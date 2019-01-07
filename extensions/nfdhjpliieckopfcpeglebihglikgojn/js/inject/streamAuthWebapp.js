
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
/*
 * * * * * * * * * * * * * * * * * * * *
 * © Copyright 2009-2018 Debrid-link
 * All rights reserved
 *
 * Contact: https://debrid-link.fr/contact
 */


(function(){

  if(!browser)var browser = chrome;

  function hostname(link){
    var element = document.createElement('a');
    element.href = link;
    if(element.hostname.substr(0, 3) == 'www')
      return element.hostname.substr(4);
    return element.hostname;
  }

  function isValidEvent(event){
    var allowedDomains = ['debrid-link.fr', 'debrid-link.com'];
    return (event && event.origin
      && event.source == window
      && event.data.from == 'webapp'
      && allowedDomains.indexOf(hostname(event.origin)) >= 0);
  }

  function sendMessage(message, callback){
    message.from = 'streamAuthWebapp';
    return browser.runtime.sendMessage(message, callback);
  }

  function sendMessageToWebapp(message, event){
    if(!isValidEvent(event))return false;
    message.from = 'streamAuthWebapp';
    return window.postMessage(message, origin);
  }

  window.addEventListener("message", function(event) {

      if(!isValidEvent(event))return false;

      sendMessage({type: 'getAuth'}, value => sendMessageToWebapp({type: 'auth', value: value}, event));

  });

}());