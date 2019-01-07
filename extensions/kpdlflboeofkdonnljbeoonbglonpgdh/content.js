
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
 * This script runs on the target page but isolated from other page scripts
 * still with full access to the DOM
 */

/**
 * This is the main entry of this file, started as soon as the page loads
 */
function main() {
    // This is to allow to simulate an esc event on the Twitter.com context so the menu will disapear
    injectScriptFileToWebContext("common.js");
    // This is to detect when twitter navigation change to reload few things
    observeChanges("head link[rel='canonical']", function () { navigationUpdated(); });
    // This is to act on already present '.ProfileTweet-action .dropdown'
    addActionForVisibleDropdown();
    // This will observe any added node and if it is a '.ProfileTweet-action .dropdown' act on it to add our menu entry
    observeChanges("body", function (mutations) {
        for (var mutation of mutations) {
            for (var node of mutation.addedNodes) {
                if ($(node).has('.ProfileTweet-action .dropdown').length > 0) {
                    addActionFromDropdown($(node).find('.ProfileTweet-action .dropdown'));
                }
            }
        }
    }, {subtree: true, childList: true});
}

function navigationUpdated() {
    addActionForVisibleDropdown();
}

function observeChanges(selector, onChange, config = { attributes: true }) {
    if (!selector) return;

    var target = selector;
    if (typeof selector === 'string') {
        target = document.querySelector(target);
        if (!target) return;
    }

    var observer = new MutationObserver(onChange);
    observer.observe(target, config);

    return observer;
}

function observeChangesAll(selector, onChange, config = { attributes: true, attributeOldValue: true }) {
    if (!selector) return;

    var targets = selector;
    if (typeof selector === 'string') {
        targets = document.querySelectorAll(targets);
        if (!targets) return;
    }

    var observer = new MutationObserver(onChange);
    for (var t of targets) {
        observer.observe(t, config);
    }

    return observer;
}

function addActionForVisibleDropdown() {
    $('.ProfileTweet-action .dropdown').each(function (index, element) {
        addActionFromDropdown(element);
    });
    // observeChangesAll('.ProfileTweet-action .dropdown', function (e) {
    //     console.error("modified", e);
    //     var mutation = e[0];
    //     addActionFromDropdown(mutation.target);
    // }, {
    //     attributeFilter: ['class'],
    //     attributes: true,
    //     attributeOldValue: true
    // });
}

function lookUpForTweetElement(el) {
    var found = el;
    var max = 10;
    while (max > 0) {
        max--;
        found = $(found).parent();
        if (found.data('tweet-id')) {
            return found;
        }
    }
    return null;
}

function addActionFromDropdown(dropdown) {
    var $tweetEl = lookUpForTweetElement(dropdown);
    if (!$tweetEl) return;

    var $dropdown = $(dropdown);
    var $ul = $dropdown.find('ul');
    if ($ul.has('.threadreaderapp-menu-entry').length > 0) return;

    // Get Tweet id
    var tweetId = $tweetEl.data('tweet-id');

    // Create our menu entry
    var $li = $(
        '<li class="threadreaderapp-menu-entry" role="presentation">' +
        '<button type="button" class="dropdown-link" role="menuitem">Unroll in Thread Reader</button>' +
        '</li>'
    );

    // Add action
    $li.on('click', function (e) {
        injectScriptCodeToWebContext('esc();', true);
        window.open(THREADREADERAPP_URL_TWEET + tweetId + '.html?utm_source=ext');
        return true;
    });

    // Add our markup to the page
    $ul.append($li);
}

/**
 * This will inject the script `name` into the current page using the page context
 */
function injectScriptFileToWebContext(name) {
    var s = document.createElement('script');
    s.src = chrome.extension.getURL(name);
    var e = (document.head || document.documentElement);
    if (e) e.appendChild(s);
}

/**
 * This will execute the given code in the target page context
 */
function injectScriptCodeToWebContext(code, ignoreError) {
    var consoleLog = 'error';
    if (ignoreError) { consoleLog = 'log'; }
    var script = document.createElement('script');
    var textNode = document.createTextNode('(function(){try{' + code + '}catch(e){console.' + consoleLog + '(e);}})();');
    script.appendChild(textNode);
    var e = (document.body || document.head);
    if (e) e.appendChild(script);
}

// Boot
main();
