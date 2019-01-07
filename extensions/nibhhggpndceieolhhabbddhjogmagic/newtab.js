const kCurrentShoppingCookie = "shoppingOfferFall2015_2";
const kShoppingTimeout = 24*60*60; // 1 day

var newTabURL = chrome.extension.getBackgroundPage().newTabURL;

var payload = {
  request: "ga",
  category: "New Tab Page",
  action: "newtab"
}
chrome.extension.sendMessage(payload);

chrome.storage.local.get([kCurrentShoppingCookie, "newtabfocus"], function(items) {
  if (!(kCurrentShoppingCookie in items)) {
    var installDate = localStorage["installDate"];
    var now = Math.round(new Date().getTime()/1000);
    if (now - installDate > kShoppingTimeout) {
      newTabURL += "?shopping";
      var params = {};
      params[kCurrentShoppingCookie] = true;
      chrome.storage.local.set(params);
    }    
  }
  if ("newtabfocus" in items && !items.newtabfocus) {
    document.getElementById("theiframe").src = newTabURL;
  } else {
    chrome.tabs.create({url: newTabURL});
    window.close();
  }
});  
