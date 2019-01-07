
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
webpackJsonp([14],{0:function(e,n){var o=e.exports={version:"2.5.7"};"number"==typeof __e&&(__e=o)},105:function(e,n,o){var t=o(0),i=t.JSON||(t.JSON={stringify:JSON.stringify});e.exports=function(e){return i.stringify.apply(i,arguments)}},257:function(e,n,o){"use strict";var t,i=o(80),a=(t=i)&&t.__esModule?t:{default:t};chrome.runtime.onMessage.addListener(function(e,n,o){var t=e.action,i=e.payload;if("SET_PERCENT_GET_TRACKING_CODE"==t)window.location.href=i;else if("WARNING_ALIREVIEWS_LOGIN_STATUS"==t||"WARNING_ALIEXPRESS_LOGIN_STATUS"==t||"WARNING_OBERLO_LOGIN_STATUS"==t){var r=(0,a.default)({type:e.payload.type,message:e.payload.message});window.location.href="javascript:window.notifyExtensiond("+r+")"}})},80:function(e,n,o){e.exports={default:o(105),__esModule:!0}}},[257]);