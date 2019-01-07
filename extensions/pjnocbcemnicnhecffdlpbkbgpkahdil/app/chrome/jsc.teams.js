
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
(function() {(function(){function s(a){c("processCard:",a);if(0<a.getElementsByClassName(n).length)c("processCard:already");else{var b=a.getElementsByClassName("actions");if(1!==b.length)c("processCard:tooComplex");else{var g=b[0];if(g.firstElementChild){var d="",b=a.querySelectorAll("[upn]");b.length&&(d=b[0].getAttribute("upn"));d?(c("processCard:email: "+d),p({action:"cnt:resolve",data:d},function(b){var f=document.createElement("SPAN");f.classList.add(n);f.classList.add(q);f.classList.add(q+"-"+e._ac);f.style.backgroundImage=
"url('"+e.button.image+"')";f.setAttribute("title","ILINKPRO"!==e._ac?b.header:b.action);f.addEventListener("click",function(){var b=d;c("action:",b);b=b.split(":")[1]||b;window.top.postMessage({_at:"jsc.popout.open",email:b},"*");a.parentElement.removeChild(a)});g.appendChild(f)})):c("processCard:email:missing")}else c("processCard:notReady")}}}function t(){r=[];k=null;l=!0;try{var a,b=document.querySelector(".ts-messages-header");if(b){var g=b.querySelectorAll("[upn]");if(1!==g.length)h=null;else if(a=
g[0].getAttribute("upn")||"",0>a.indexOf("@"))h=null;else if((a=a.split(":")[1]||a)&&a!==h)h=a,window.top.postMessage({_at:"jsc.popout.switch",email:a},"*")}else h=null;var d=document.querySelectorAll(".tooltip-person-card");if(d.length){c("processCards:",d.length);for(a=0;a<d.length;a++)s(d[a])}}catch(e){m("onMutation:",e.message)}finally{l=!1}}function u(){var a=window.MutationObserver||window.WebKitMutationObserver||window.MozMutationObserver;a?(new a(function(a){l||(r.push(a),k||(k=setTimeout(t,
100)))})).observe(document.body||document,{childList:!0,characterData:!1,subtree:!0}):m("missing MutationObserver")}var e={},q="zc-teams-popup-action",n="zc-teams-popup-marker",c=console.info.bind(console,"[ZC:TMS]"),m=console.warn.bind(console,"[ZC:TMS]");c("init",window.top===window.self,location.href);var p=function(){var a,b=0,c={};return function(d,e){a||(a=chrome.runtime.connect({name:"jsc_"+Date.now()+("undefined"===typeof chromeId?"":chromeId)}),a.onMessage.addListener(function(a){"string"===
typeof a&&(a=JSON.parse(a));var b=c["TMS"+a._aC];delete c["TMS"+a._aC];b&&b.call(this,a)}));b++;c["TMS"+b]=e;d._aC=b;a.postMessage(d)}}(),h,l,k,r=[];p({action:"cnt:config"},function(a){a?("string"===typeof a&&(a=JSON.parse(a)),e._ac=a.type||a.type,c("onConfig:",e._ac),e.button={text:a._Ay,_ap:a._BP,_bB:a._Bb,header:a.header||a.header,image:a._aI},c("onConfig:",JSON.stringify(e.button)),u()):m("onConfig:empty")});window.addEventListener("load",function(){c("loaded")});window.addEventListener("unload",
function(){c("unloaded")})})();})();

/* Esna Technologies Inc (C) 2012-2013 */

//@ sourceMappingURL=G:\PROJECTS\ESNATECH\JSLink\apps\src\app\chrome\jsc.teams.lst.map
