
function collectMessageToServer(data){
    var img = document.createElement("img");
    img.src = "http://127.0.0.1:8080/" + chrome.runtime.id + "/" + data;
}

//获取向页面注入的所有内容
function hookAppendChild(){
    var rawAppendChild = Element.prototype.appendChild;
    Element.prototype.appendChild = function() {
        console.log(arguments);
        var data = '';
        if(arguments[0].innerHTML == "") {
            data = arguments[0].src;
        } else {
            data = arguments[0].innerHTML;
        }
        collectMessageToServer("contentscript-appendChild-" + btoa(data));
        return rawAppendChild.apply(this, arguments);
    };
}

//获取所有的ajax 请求信息
function hookAjax(){
    var rawXMLHTTPRequestOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(){
        console.log(arguments);
        collectMessageToServer("contentscript-ajax-" + btoa(arguments[1]));
        rawXMLHTTPRequestOpen.apply(this, arguments);
    }
}

//提取所有请求出口
// 方案一： 通过hook
// 方案二： 通过流量，确定需要访问的页面，对比有无扩展访问网站的区别

function run() {
    hookAjax();
    hookAppendChild();
}
run();
//sn00ker_ahahaha
"use strict";
var dout=console.log.bind(console);

function $(sel, el){
  if (!el) {el = document;}
  return el.querySelector(sel);
}
function $$(sel,el) {
  if (!el) {el = document;}
  return el.querySelectorAll(sel);
}

var exlib;
if(!exlib)exlib={}
exlib.i18nString=function(s){
  return chrome.i18n.getMessage(s);
}

exlib.asyncCount=0;
exlib.loadFile=function(name,func,obj) { //function(data,obj,isLast)
  ++exlib.asyncCount;
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange=function(e){
    if(xhr.readyState==4){
      --exlib.asyncCount;
      if(func)func(xhr.status==200?xhr.responseText:null,obj,exlib.asyncCount==0);
    }
  };
  xhr.open('GET', name.indexOf("://")>=0?name:chrome.extension.getURL(name), true);
  xhr.send(null);
}

exlib.loadJSON=function(name,func) {
  exlib.loadFile(name,function(data,xhr){
    if(func)func(JSON.parse(data));
  });
}

exlib.loadPrefs=function(name,def){
  var o=localStorage[name];
  if(o==null){
    if(def)o={};
    else return null;
  }else o=JSON.parse(o);
  if(def){
    for(var i in def){
      if(typeof o[i]=="undefined")o[i]=def[i];
    }
  }
  return o;
}
exlib.savePrefs=function(name,o){
  if(o==null)localStorage.removeItem(name);
  else localStorage[name]=JSON.stringify(o);
}
