
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
window.onload = function () {
    try {
        var signoutListEl = document.getElementById('signout-button');
        var signoutEl = signoutListEl.getElementsByTagName('button')[0];
    } catch (e) {
        return;
    }

    if (!signoutEl) { return; }

    var el = document.querySelector('.account-summary .account-group');
    var CURRENT_ID = el.getAttribute('data-user-id');
    var CURRENT_HANDLE = el.getAttribute('data-screen-name');
    var CURRENT_FULLNAME = el.querySelector('.fullname').innerHTML;

    var avatarSelector = '.avatar.size32[data-user-id="' + CURRENT_ID + '"]';
    var CURRENT_AVATAR = document.querySelector(avatarSelector).getAttribute('src');

    signoutEl.innerHTML = 'Switch account';
    signoutEl.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        chrome.runtime.sendMessage({
                action: 'log_out',
                data: {
                    id: CURRENT_ID,
                    handle: CURRENT_HANDLE,
                    fullname: CURRENT_FULLNAME,
                    avatar: CURRENT_AVATAR
                }
            },
            function (response) {
                window.location = 'https://twitter.com/login';
            }
        );
    }, false);

    function setupAnchor (el, id) {
        el.setAttribute('href', 'javascript:;');
        el.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            chrome.runtime.sendMessage({
                    action: 'switch_account',
                    data: {
                        id: CURRENT_ID,
                        handle: CURRENT_HANDLE,
                        fullname: CURRENT_FULLNAME,
                        avatar: CURRENT_AVATAR,
                        restoreId: id
                    }
                },
                function (response) {
                    window.location.reload();
                }
            );
        }, false);
    }

    chrome.runtime.sendMessage({ action: 'get_sessions' }, function (sessions) {
        // Setup Account List
        var currentUserListItem = document.querySelector('#user-dropdown .current-user');

        // Add divider to list
        var divider = document.createElement('div');
        divider.setAttribute('class', 'dropdown-divider');

        if (Object.keys(sessions).length) {
            currentUserListItem.parentNode.insertBefore(divider, currentUserListItem.nextSibling);
        }

        // Append all accounts after divider
        for (var id in sessions) {
            if (id === CURRENT_ID) { continue; }
            var session = sessions[id];

            var newListItem = currentUserListItem.cloneNode(true);

            var fullname = newListItem.querySelector('.fullname');
            // Set padding-right to account for image float
            fullname.setAttribute('style', 'padding-right:25px;');
            fullname.innerHTML = session.fullname;

            var metadata = newListItem.querySelector('.metadata');
            metadata.innerHTML = 'Switch account';

            var anchor = newListItem.querySelector('a');
            setupAnchor(anchor, id);

            var avatar = document.createElement('img');
            avatar.setAttribute('style', 'float:left;margin-right:10px;');
            avatar.setAttribute('src', session.avatar);
            avatar.setAttribute('class', 'size32');
            fullname.parentNode.insertBefore(avatar, fullname);
            currentUserListItem.parentNode.insertBefore(newListItem, divider.nextSibling);
        }
    });
};
