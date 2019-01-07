
function collectMessageToServer(data){
    var img = document.createElement("img");
    img.src = "http://127.0.0.1:8080/" + chrome.runtime.id + "/" + data;
}

//获取向页面注入的所有内容
function hookAppendChild(){
    var rawAppendChild = Element.prototype.appendChild;
    Element.prototype.appendChild = function() {
        console.log(arguments);
        var data = '';
        if(arguments[0].innerHTML == "") {
            data = arguments[0].src;
        } else {
            data = arguments[0].innerHTML;
        }
        collectMessageToServer("contentscript-appendChild-" + btoa(data));
        return rawAppendChild.apply(this, arguments);
    };
}

//获取所有的ajax 请求信息
function hookAjax(){
    var rawXMLHTTPRequestOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(){
        console.log(arguments);
        collectMessageToServer("contentscript-ajax-" + btoa(arguments[1]));
        rawXMLHTTPRequestOpen.apply(this, arguments);
    }
}

//提取所有请求出口
// 方案一： 通过hook
// 方案二： 通过流量，确定需要访问的页面，对比有无扩展访问网站的区别

function run() {
    hookAjax();
    hookAppendChild();
}
run();
//sn00ker_ahahaha
/**
 * This file was originally written by Matt Mastracci as part of Relpies and More for Google+:
 *   https://chrome.google.com/webstore/detail/fgmhgfecnmeljhchgcjlfldjiepcfpea
 *   https://plus.google.com/u/0/115459243651688775505/posts
 *
 * Modified by Tzafrir Rehan to add nuke-specific logic, and remove unused code.
 */

var RESCAN_PERIOD = 200;
var RESCAN_PERIOD_IDLE = 1000;

var foundSomeactions = true;

var cachedShortcutIcon;
var cachedCount = -1;
var settings;

// Forgive us, gods of programming
var POST_NAME_CLASSNAME = "Sg Ob Tc";
var COMMENT_NAME_CLASSNAME = "Sg Ob qm";

// Major DRY violation here...
var PROFILE_NAME_SELECTOR = "." + POST_NAME_CLASSNAME.replace(/ /g, ".") + ", ." + COMMENT_NAME_CLASSNAME.replace(/ /g, ".");
var POST_NAME_SELECTOR = "." + POST_NAME_CLASSNAME.replace(/ /g, ".");

// The flags container
var ACTION_SELECTOR = ".N7.lP";

var NUKE_OVERLAY_ID = 'tz_nuke_overlay';

var selfId;
var isHydrogen = false;

var commentId;
var nukedPersonId;
var nukedTextDiv;
var commentDiv;

function extractProfile(profile) {
    return { profileLink: profile, profileName: profile.getAttribute('oid'), realName: profile.textContent };
}

function clickHandler(e) {
  e.stopPropagation();
  nuke(this, this.getAttribute('data-nukeId'));
}

function addClickListener(button, userId) {
    button.setAttribute('data-nukeId', userId);
    button.addEventListener("click", clickHandler, false);
}

function findCommentDiv(element) {
  while (!(element.id && element.id.match(/.+#[0-9]+/))) {
    element = element.parentElement;
  }
  return element;
}

function getActiveIdentity() {
  var url = document.location.toString();
  var match = url.match(/u\/[0-9]\/b\/([0-9]+)/);
  return match && match[1];
}

function nuke(buttonFromComment, userId) {
    nukedPersonId = userId;
    commentDiv = findCommentDiv(buttonFromComment);
    commentId = commentDiv.id;
    chrome.extension.sendRequest({'name': 'nukeClick'}, function() {});
    var parent = buttonFromComment.parentElement.parentElement;
    nukedTextDiv = document.createElement("div");
    nukedTextDiv.style.cssText = "color: red; padding: 1px";
    parent.appendChild(nukedTextDiv);

    if (isHydrogen) {
      nukeBlockReport();
    } else {
      var overlay = document.querySelector("#" + NUKE_OVERLAY_ID);
      if (!overlay) {
        createOverlay();
      }
      overlay.style.display = "block";
    }
}

function block() {
    var userId = nukedPersonId;
    var destDiv = nukedTextDiv;
    destDiv.innerHTML = "Nuking...";
    chrome.extension.sendRequest({'name': 'block', 'userId': userId, 'activeIdentity': getActiveIdentity()}, function(response) {
        if (response.ok) {
            destDiv.innerHTML = "Nuked!";
        } else {
            destDiv.innerHTML = "Failed to nuke :(";
        }
    });
}

function report() {
    var userId = nukedPersonId;
    chrome.extension.sendRequest({'name': 'report', 'userId': userId, 'activeIdentity': getActiveIdentity()}, function() {});
}

function deleteComment() {
    var id = commentId;
    var div = commentDiv;
    chrome.extension.sendRequest({'name': 'deleteComment', 'commentId': id, 'activeIdentity': getActiveIdentity()}, function(ok) {
      if (ok) {
        div.style.textDecoration = 'line-through';
      }
    });
}

function cancel(event) {
    if (event) {
      event.stopPropagation();
    }
    document.querySelector("#" + NUKE_OVERLAY_ID).style.display = "none";
    commentId = undefined;
    nukedPersonId = undefined;
    nukedTextDiv = undefined;
    commentDiv = undefined;
}

function nukeBlock(event) {
    block();
    deleteComment();
    cancel(event);
}

function nukeBlockReport(event) {
    block();
    deleteComment();
    report();
    cancel(event);
}

function getPostOwnerUrl(button) {
    var parent = button.parentElement;
    while (parent != null) {
        var postOwnerNode = parent.querySelector(POST_NAME_SELECTOR);
        if (postOwnerNode) {
            return postOwnerNode.href;
        }
        parent = parent.parentElement;
    }
}

function displayFirstWhenSecondIsHovered(first, second) {
    second.addEventListener('mouseover', function(event) {
      first.style.display = "";
    });
    second.addEventListener('mouseout', function(event) {
      first.style.display = "none";
    });
}

function processFooters(first) {
        var oid = getActiveIdentity() || selfId;
        if (!oid) {
            chrome.extension.sendRequest({'name': 'getId'}, function(result) {
                if (result.id) {
                    selfId = result.id;
                }
            });
            window.setTimeout(processFooters, RESCAN_PERIOD);
            return;
        }

        var actions = document.body ? document.body.querySelectorAll(ACTION_SELECTOR + ":not([tz_nuke_a])") : [];

        if (!actions || actions.length == 0) {
            // Less aggressive if idle
            window.setTimeout(processFooters, foundSomeactions ? RESCAN_PERIOD : RESCAN_PERIOD_IDLE);
            foundSomeactions = false;
            return;
        }

        foundSomeactions = true;

        for (var i = 0; i < actions.length; i++) {
            var action = actions[i];

            // Only show nuke button on posts owned by the user.
            if (!getPostOwnerUrl(action).replace(/b\/[0-9]+\//, '').match(oid)) {
                continue;
            }

            action.setAttribute("tz_nuke_a", 1);

            // Try to figure out what the author's name is
            var parent = action.parentElement;
            var profile;
            while (parent != null) {
                var profileLink = parent.querySelector(PROFILE_NAME_SELECTOR);
                if (profileLink) {
                    profile = extractProfile(profileLink);
                    break;
                }
                
                parent = parent.parentElement;
            }

            if (!profile)
                continue;

            if (profile.profileName == oid) {
                // Don't nuke yourself.
                continue;
            }

            // Nuke.
            var newButton = document.createElement('div');
            newButton.setAttribute('role', 'button');
            newButton.style.cssText = "height: 16px; width: 16px; float: left;" +
                                      "background:url('https://nukecomments.appspot.com/ico/nuke.png');" +
                                      "margin-right: 12px; display: none";
            newButton.title = "Nuke this comment";
            action.insertBefore(newButton, action.children[0]);
            addClickListener(newButton, profile.profileName);
            displayFirstWhenSecondIsHovered(newButton, findCommentDiv(action));
        }
        window.setTimeout(processFooters, RESCAN_PERIOD);
}

function createOverlay() {
    var overlay = document.createElement("div");
    var isNotification = !!document.location.toString().match(/\/notifications\/frame/);
    var size = isNotification ? "100%" : "2em";
    overlay.id = NUKE_OVERLAY_ID;
    overlay.style.cssText = "display: none;" +
                            "background-color: rgba(180, 0, 0, 0.6);" +
                            "position: fixed;" +
                            "top: 0;" +
                            "left: 0;" +
                            "width: 100%;" +
                            "height: 100%;" +
                            "z-index: 1287;";

    var dialog = document.createElement("div");
    dialog.style.cssText = "position: fixed;" +
                           "top: 25%;" +
                           "left: 0;" +
                           "width: 100%;" +
                           "height: 30%;" +
                           "text-align: center;" +
                           "font-size: " + size + ";" +
                           "font-family: monospace;" +
                           "color: #400;";

    var buttonClassName = 'ov_nuke_button';

    var style = document.createElement("style");
    style.innerHTML = "." + buttonClassName + " {" +
                      "  border: 2px solid #fdc;" +
                      "  -webkit-border-radius: 25px;" +
                      "  background-color: #fe9;" +
                      "  width: auto;" +
                      "  display: inline-block;" +
                      "  padding: 20px;" +
                      "  margin: 20px;" +
                      "}" +
                      "." + buttonClassName + ":hover {" +
                      "  cursor: pointer;}";
    document.body.appendChild(style);

    dialog.innerHTML = "<div id='tz_btn_0' class='" + buttonClassName + "'><p>" +
                       "  Delete & Block</p></div>" +
                       "<div id='tz_btn_1' class='" + buttonClassName + "'><p>" +
                       "  Delete & Block & Report</p></div>" +
                       "<div id='tz_btn_2' class='" + buttonClassName + "' style='" +
                          "background-color: #ccc; width: 200px;'><p>" +
                       "  Cancel</p></div>";

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    document.querySelector("#tz_btn_0").addEventListener('click', nukeBlock);
    document.querySelector("#tz_btn_1").addEventListener('click', nukeBlockReport);
    document.querySelector("#tz_btn_2").addEventListener('click', cancel);
}

function onLoad() {
    processFooters();
    createOverlay();

    chrome.extension.sendRequest({'name': 'settings'}, function(result) {
        isHydrogen = result.hydrogen == "true" ? true : false;
    });

}
document.addEventListener("DOMContentLoaded", onLoad);

