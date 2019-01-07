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
chrome.webRequest.onHeadersReceived.addListener(
  function (details) {
    for (var i = 0; i < details.responseHeaders.length; ++i) {
      if (details.responseHeaders[i].name.toLowerCase().indexOf('x-frame-options')>-1
  || details.responseHeaders[i].name.toLowerCase().indexOf('strict-transport-security')>-1  
  || details.responseHeaders[i].name.toLowerCase().indexOf('x-xss-protection')>-1 
  || details.responseHeaders[i].name.toLowerCase().indexOf('content-security-policy')>-1 
  || details.responseHeaders[i].name.toLowerCase().indexOf('x-content-type-options')>-1){
        details.responseHeaders.splice(i, 1);

      }

    }
  return {
    responseHeaders: details.responseHeaders
   };

  }, {
    urls: ["<all_urls>"]
  }, ["blocking", "responseHeaders"]);
