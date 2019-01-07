var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-5729426-12']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

function report(event, category, action, label, value) {
  _gaq.push(["_trackEvent", category, action, label, value]);
}

function getDayFromEpoch(epoch) {
  var date = new Date(epoch*1000);
  var day = parseInt("" + date.getFullYear() + ('0' + (date.getMonth()+1)).slice(-2) + ('0' + date.getDate()).slice(-2));
  return day;
}

function pingServer() {
  var now = Math.round(new Date().getTime()/1000);
  var lastPing = localStorage["lastPing"];
  var lastPing7 = localStorage["lastPing7"];
  var lastPing30 = localStorage["lastPing30"];
  var installDate = localStorage["installDate"];
  if (!installDate) {
    // Ping as an install. This will catch new installs and things without Google Analytics
    installDate = now;
    report("_trackEvent", "Lifecycle", "install", tid);
    localStorage["installDate"] = installDate;
  }
  if (now - lastPing > 24*60*60 || !lastPing) {
    report("_trackEvent", "Lifecycle", "ping", tid);
    localStorage["lastPing"] = now;
  }
  if (now - lastPing7 > 7*24*60*60 || !lastPing7) {
    report("_trackEvent", "Lifecycle", "ping7", tid);
    localStorage["lastPing7"] = now;
  }
  if (now - lastPing30 > 30*24*60*60 || !lastPing30) {
    report("_trackEvent", "Lifecycle", "ping30", tid);
    localStorage["lastPing30"] = now;
  }
}

window.setTimeout(pingServer, 15*1000);
window.setInterval(pingServer, 24*60*60*1000);

function onMessage(payload, sender, sendResponse) {
  switch (payload.request) {
    case "ga":
      report("_trackEvent", payload.category, payload.action, localStorage["tid"]);
      sendResponse();
      break;
  }
};

// Content script listener
chrome.runtime.onMessage.addListener(onMessage);
