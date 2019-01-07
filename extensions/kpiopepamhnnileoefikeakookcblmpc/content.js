
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
// Copyright (c) 2010 - 2015 Sipcentric Ltd. Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
// content.js

var urlBlackList = ["mail.google.com", "google.com", "google.co.uk", "secure.helpscout.net/mailbox", "yahoo.com"];

function checkBlocked() {

  var disallow = null;
  var url = document.location.href;

  $.each(urlBlackList, function(index, value){
    var re = new RegExp('^.*' + value + '.*$');
    if (url.match(re)) {
      disallow = true;
    }
  });

  var meta = $('meta[name=sccextension]');
  if (meta.attr('content') == 'clickable-off') {
    disallow = true;
  }

  if (!disallow) {
    linkNumbers();
  } else {
    console.log('Clickable numbers disabled on this page or domain');
  }

}

function linkNumbers() {
  var extension = chrome.extension.getURL("call.html");
  var pattern = /((?:0|\+44)(?:[0-9]|\(|-|\)|\s(?:[0-9]|\()){8,20})/g;
  $('body').find(':not(textarea,input,a,pre,code)').replaceText( pattern, '<a title="Click to call this number" href="' + extension + '?number=$1" target="_blank">$1<\/a>' );
}

$(document).ready(function() {
  chrome.extension.sendMessage({clickableEnabled: 1}, function(response) {
    if (response == true) {
      checkBlocked();
    }
  });
});
