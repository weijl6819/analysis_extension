"use strict";
var exlib;
if(!exlib)exlib={}
exlib.getVersion=function(){
  return chrome.runtime.getManifest().version;
}
exlib.openTab=function(url){
  chrome.tabs.create({url:url,selected: true});
}

exlib.setIcon=function(url){
  chrome.browserAction.setIcon({path:url});
}
exlib.setBadgeText=function(s){
  //chrome.browserAction.setBadgeBackgroundColor({color:"#da0018"});
  chrome.browserAction.setBadgeText({text:s});
}
exlib.setTitle=function(s){
  chrome.browserAction.setTitle({title:s});
}

exlib.initToolbarUI=function(icon,title){
  chrome.browserAction.setIcon({imageData:icon});
  chrome.browserAction.setTitle({title:title});
}
exlib.getTabs=function(func){
  chrome.tabs.query({}, function (tabs) {
    func(tabs);
  });
}
exlib.getURL=function(u){
  return chrome.extension.getURL(u);
}
