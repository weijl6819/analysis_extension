var newTabURL = chrome.extension.getBackgroundPage().newTabURL;

var payload = { request: "ga", category: "New Tab Page", action: "newtab" }  /* remove for Firefox */
chrome.runtime.sendMessage(payload); /* remove for Firefox */

chrome.storage.local.get(["newtabfocus"], function(items) {
  if ("newtabfocus" in items && !items.newtabfocus) {
    document.getElementById("theiframe").src = newTabURL;
  } else {
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
      chrome.tabs.create({url: newTabURL});
      chrome.tabs.remove(tabs[0].id);
    });
  }
});
