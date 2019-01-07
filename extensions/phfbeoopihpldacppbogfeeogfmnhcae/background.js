var tid = btpersonas.tid;
chrome.storage.local.set({"tid" : tid});
var newTabURL = "http://home.brandthunder.com/" + tid;
var startPageURL = "http://brandthunder.com/startpage/" + tid;

chrome.runtime.setUninstallURL("http://home.brandthunder.com/mywebchrome/uninstall?tid=" + tid);

chrome.runtime.onInstalled.addListener(function(details){
  if (details.reason == "install") {
    removeExtensionTab();
    chrome.tabs.create({"url": newTabURL + "?welcome"});
    chrome.tabs.create({"url": startPageURL});
  }
});

/* Closes the extension tab if it is open */
function removeExtensionTab() {
  chrome.tabs.query({}, function (tabs) {
    for (var i=0; i < tabs.length; i++) {
      var tab = tabs[i];
      if (/http:\/\/home.brandthunder.com\/.*\/?extension.*/.test(tab.url)) {
        chrome.tabs.remove(tab.id);
        return;
      }
    }
  });
}

chrome.browserAction.onClicked.addListener(function() {
  chrome.tabs.create({url: chrome.extension.getURL("newtab.html")});
})
