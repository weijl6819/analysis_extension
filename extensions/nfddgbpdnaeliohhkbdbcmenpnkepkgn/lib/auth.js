
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
var authorizeGmailCallback = function (e) {
    if (e.data.hasOwnProperty('id') &&
        e.data.id == 'NET_GMAIL_AUTH_CALLBACK') {
        if (e.data.content.hasOwnProperty('refresh_token')) {
            var email = window.NET_INBOXSDK.User.getEmailAddress().toLowerCase();
            auth.saveToken(email, ep_type, e.data.content, function () {
                if (window.NET_GMAIL_AUTH_CALLBACK)
                    window.NET_GMAIL_AUTH_CALLBACK(e.data.content);
            });
        } else {
            displayError(window.NET_INBOXSDK, 'Incomplete Authorization', chrome.runtime.getManifest().name + ' requires access to your Gmail account to function properly.<br>Please refresh the page to retry authorization.');
        }
    }
};
addEventListener('message', authorizeGmailCallback, false);


var auth = {

    saveToken: function (email, epType, token, callback) {
        var key = 'AuthTokens';
        email = email.toLowerCase();
        chrome.storage.sync.get(key, function (root) {
            if (!root.hasOwnProperty(key))
                root[key] = {};
            if (!root[key].hasOwnProperty(email))
                root[key][email] = {};
            root[key][email][epType] = token;
            chrome.storage.sync.set(root, callback);
        });
    },

    getToken: function (sdk, callback) {
        window.NET_INBOXSDK = null;
        window.NET_GMAIL_AUTH_CALLBACK = null;
        var email = sdk.User.getEmailAddress().toLowerCase();
        var _authorize = function () {
            window.NET_INBOXSDK = sdk;
            window.NET_GMAIL_AUTH_CALLBACK = callback;
            window.open(apis.gmail_auth + '?client=' + chrome.runtime.id + '&user_id=' + encodeURIComponent(email), "authorizeGmail");
        };
        // new method: multiple account tokens stored in 'AuthTokens'
        var key = 'AuthTokens';
        chrome.storage.sync.get(key, function (root) {
            if (root.hasOwnProperty(key)) {
                if (root[key].hasOwnProperty(email) &&
                    root[key][email].hasOwnProperty(ep_type)) {
                    // found token
                    callback(root[key][email][ep_type]);
                } else {
                    // token not found, reauth
                    _authorize();
                }
            } else {
                // old method: single account token stored in 'GmailOAuth2.' + ep_type
                auth.getOldToken(function (token) {
                    if (token) {
                        // call to obtain email address
                        simpleXHR({
                            url:        apis.gmail_get_profile,
                            payload: {
                                client: chrome.runtime.id,
                                token:  token
                            }
                        }, function (status, response) {
                            if (response &&
                                response.profile &&
                                response.profile.emailAddress) {
                                auth.saveToken(response.profile.emailAddress, ep_type, token);
                                if (response.profile.emailAddress.toLowerCase() === email)
                                    callback(token);
                                else
                                    _authorize();
                            } else {
                                callback(null);
                            }
                        }, function (status, response) {
                            if (status === 400 &&
                                response &&
                                response.error &&
                                response.error.code &&
                                response.error.code === 400) {
                                // explicit 400 error 'invalid_grant', should reauth
                                _authorize();
                            } else {
                                // unrecognized error, could be server offline
                                callback(null);
                            }
                        });
                    } else {
                        // completely new user
                        _authorize();
                    }
                });
            }
        });
    },

    getOldToken: function (callback) {
        var key = 'GmailOAuth2.' + ep_type;
        chrome.storage.sync.get(key, function (root) {
            if (root.hasOwnProperty(key))
                callback(root[key]);
            else
                callback(null);
        });
    }
};
