
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
var pageAction=function(){var k=null;var g=function(l){if(l===1&&typeof k==="function"){k();}};var j=function(){InternalMessaging.messageToBackground({action:"pageAction",params:["show"]});};var e=function(){InternalMessaging.messageToBackground({action:"pageAction",params:["hide"]});};var b=function(l){InternalMessaging.messageToBackground({action:"pageAction",params:["setIcon",l]});};var c=function(l){InternalMessaging.messageToBackground({action:"pageAction",params:["setTitle",l]});};var h=function(l){k=l.callback;InternalMessaging.messageToBackground({action:"pageAction",params:["onClick"]});};var a=function(l){InternalMessaging.messageToBackground({action:"pageAction",params:["setPopupHTML",l]});};var f=function(){InternalMessaging.messageToBackground({action:"pageAction",params:["clearPopup"]});};var i=function(){InternalMessaging.messageToBackground({action:"pageAction",params:["closePopup"]});};var d=function(n){if(typeof n==="undefined"){return;}if((typeof n.pages==="undefined")||(n.pages.length===0)||(typeof n.imageData==="undefined")){return;}for(var l=0;l<n.pages.length;l++){var m=n.pages[l];rx=typeof(m)=="string"?new RegExp("^http.?\\:\\/\\/(?:www\\.)?"+m.replace(/^https?:\/\//,"").replace(/\\/g,"\\\\").replace(/\./g,"\\.").replace(/\*/g,".*"),"i"):m;if(rx.test(document.location.href)){b(n.imageData);if(typeof n.title==="string"){c({title:n.title});}if(typeof n.callback==="function"){h({callback:n.callback});}else{if((typeof n.html==="string")&&(typeof n.width==="number")&&(typeof n.height==="number")){a({html:n.html,width:n.width,height:n.height});}}j();break;}}};return{show:j,hide:e,setIcon:b,setTitle:c,onClick:h,setPopupHTML:a,clearPopup:f,closePopup:i,innerSetPages:d,_activateCallback:g};};
