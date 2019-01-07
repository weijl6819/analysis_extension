
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
function clear(em){
  var last;
  while (last = em.lastChild) em.removeChild(last);
}

function openUrl(url,match,action){
  if(action)chrome.runtime.sendMessage({cmd: "setAction",action:action});
  chrome.runtime.sendMessage({cmd: "openUrl",url:url,match:match});
}

function openMsg(url,match,req,host){
  chrome.runtime.sendMessage({cmd: "openUrl",url:url,match:match});
  if(req)chrome.runtime.sendMessage({cmd: "reqAction",req:req,hosts:host});
}

function getTimeStr(date){
  var now=new Date();
  now.setHours(0,0,0);
  if(date>=now){
    return date.toLocaleString(undefined,{"hour12":false,"hour":"numeric","minute":"numeric"});
  }
  now.setMonth(0,1);
  if(date>=now){
    return date.toLocaleString(undefined,{"month":"short","day":"numeric"});
  }
  return date.toLocaleString(undefined,{"year":"2-digit","month":"numeric","day":"numeric"});
}

function createElement(tag,cls,title){
  var em = document.createElement(tag);
  if(cls)em.setAttribute("class",cls);
  if(title)em.setAttribute("title",title);
  return em;
}