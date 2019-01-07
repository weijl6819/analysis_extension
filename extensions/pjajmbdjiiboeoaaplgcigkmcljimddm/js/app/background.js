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
var activateLock=function(setTitle, tabID){
	chrome.tabs.executeScript(tabID,{code:"document.title='" + setTitle + "'"});
	var relTab = tabID;
  activateLock.titles[relTab]=setTitle;
	chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
   		if (tabId != relTab) {
          return false;
    	}
   		chrome.tabs.executeScript(tabID,{code:"document.title='" + activateLock.titles[tabId] + "'"});
  });
}
activateLock.titles={};

chrome.extension.onMessage.addListener(function(request,sender,sendResponse) {
  if (request.to == "background") {
    activateLock(request.title, request.relTabID);
  }
});

/*=========================================
=            Listeners                    =
=========================================*/
chrome.extension.onMessage.addListener(function(request,sender,sendResponse) {
  if(request.reminder){
    reminders.list[request.tabId]=request;
  }
  if(request.storage){
    if(request.set){
      storage.set(request.set,request.value);
    }
    if(request.get){
      var data=storage.get(request.get);
      sendResponse(data);
      return true;
    }
  }
});

/*===================================
=            Remindering            =
===================================*/
var reminders={
  icon:chrome.runtime.getURL("img/tabtodo128.png"),
  list:[],
  refresh:2/60,
  startTimer:function(){
    setInterval(function(){
      var now = parseInt(Date.now()/1000);
      for (var i in reminders.list) {
        if(reminders.list[i].at<now){
          reminders.init(i);
        }
      }
    },reminders.refresh*60*1000)
  },
  init:function(reminder_index){
    var reminder=reminders.list[reminder_index];
    var tabId=reminder_index;
    if(reminder.settings.active){
      chrome.notifications.create(tabId,{
        type:"basic",
        iconUrl:reminders.icon,
        title:reminder.title,
        message:"Yo! you've got a task!"
      });
    }
    reminder.settings.active=false;
    //Update reminders stored settings
    storage.set(tabId+"_settings",reminder.settings);
  },
}
reminders.startTimer();

chrome.notifications.onClicked.addListener(function(tabId){
  try{
    chrome.tabs.update(parseInt(tabId), {selected: true});
    return true;
  }catch(e){
    console.log(tabId+" is closed");
  }
});

chrome.tabs.onRemoved.addListener(function(closedTabId){
  delete reminders.list[closedTabId];
});
/*===============================
=            Storage            =
===============================*/
var storage={
  get:function(key){
    return JSON.parse(localStorage.getItem(key));
  },
  set:function(key,value){
    var value = JSON.stringify( value, function( k, val ) {
      if( k === "$$hashKey" ) {
        return undefined;
      }
      return val;
    });
    return localStorage.setItem(key,value);
  }
}