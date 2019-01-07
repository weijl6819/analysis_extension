
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
(function() {var k=null;
(function(){var r,s,t,g,p,u,v,q;function l(a,b){return RegExp("(^|\\s)"+b+"(\\s|$)","g").test(a.className)}function m(a,b){l(a,b)||(a.className=(a.className+" "+b).replace(/\s+/g," ").replace(/(^ | $)/g,""))}function w(a,b){a.className=a.className.replace(RegExp("(^|\\s)"+b+"(\\s|$)","g"),"$1").replace(/\s+/g," ").replace(/(^ | $)/g,"")}function J(){for(var a=document.getElementsByTagName("meta"),b=0;b<a.length;b++)switch(a[b].name){case "x-ilink-lookups":r=!!a[b].content;break;case "x-ilink-classes":s=(a[b].content||
"").split(" ");break;case "x-ilink-attrs":t=(a[b].content||"").split(" ");break;case "x-ilink-mode":g=(a[b].content||"").split(" ");break;case "x-ilink-anchors":p=!!a[b].content;break;case "x-ilink-phone-classes":u=(a[b].content||"").split(" ");break;case "x-ilink-phone-attrs":v=(a[b].content||"").split(" ");break;case "x-ilink-phone-anchors":q=!!a[b].content}}function B(){J();r&&(K(),0<=g.indexOf("static")&&m(document.body,"jsc-static"),document.addEventListener("click",function(){x(k)}),C())}function K(){var a=
document.createElement("style"),b=".jsc-card { background-image: url('"+("chrome-extension://"+chrome.runtime.id+"/img/common/esna.png")+"'); }";a.textContent=b+".jsc-spot { display: none; } .jsc-card { display: none; }";document.head.appendChild(a)}function C(){f({action:"cnt:status"},function(a){a._AU?w(document.body,"jsc-offline"):m(document.body,"jsc-offline");a._AU&&L();setTimeout(C,1E3)})}function D(){function a(){if(0==b.length)return setTimeout(D,1E4);var d=b.shift();f({action:"cnt:tags",
_Am:d},function(b){var e=n[d];e&&(e.data=b,y(e));setTimeout(a,100)})}var b=Object.getOwnPropertyNames(n);a()}function L(){if(!E){for(var a=p||q?document.getElementsByTagName("a"):[],b=0;b<a.length;b++)p&&F(a[b]),q&&G(a[b]);s.forEach(function(a){a=document.getElementsByClassName(a);for(var b=0;b<a.length;b++)F(a[b])});u.forEach(function(a){a=document.getElementsByClassName(a);for(var b=0;b<a.length;b++)G(a[b])});E=!0;setTimeout(D,1E4)}}function M(a){var b=k;"A"==a.tagName&&(b=(/mailto:([^\?]*)/ig.exec(a.href)||
[])[1]);return b?b:t.reduce(function(b,c){return b||("."==c&&"A"!=a.tagName?a.textContent:a.getAttribute(c))},k)}function N(a){if("A"==a.tagName){var b=(/tel:([^\?]*)/ig.exec(a.href)||[])[1];if(b)return b}return v.reduce(function(b,c){return b||("."==c&&"A"!=a.tagName?a.textContent:a.getAttribute(c))},k)}function F(a){var b=M(a);if(b){var d="E"+ ++H,c=n[b];c?(c.elements[d]={_aA:a})&&y(c):(c=n[b]={elements:{}},c.elements[d]={_aA:a},f({action:"cnt:tags",_Am:b},function(a){var c=n[b];c&&(c.data=a,y(c))}))}}
function G(a){var b=N(a);if(b){var d="P"+ ++H,c=z[b];c?(c.elements[d]={_aA:a})&&I(c):(c=z[b]={elements:{}},c.elements[d]={_aA:a},f({action:"cnt:phoneTags",phone:b},function(a){var c=z[b];c&&(c.data=a.data,I(c))}))}}function x(a){for(var b=document.getElementsByClassName("jsc-active"),d=0;d<b.length;d++)b[d]!=a&&w(b[d],"jsc-active");a&&m(a,"jsc-active")}function A(a){w(a,"jsc-active")}function y(a){for(var b in a.elements)O(a.elements[b],a.data)}function I(a){for(var b in a.elements)P(a.elements[b],
a.data)}function O(a,b){if(b&&b._ap){var d=a._aA.parentElement,c=!1,e;(c=l(d,"jsc-wrap"))?c=d:(c=document.createElement("span"),c.className="jsc-wrap",d.insertBefore(c,a._aA),d.removeChild(a._aA),c.appendChild(a._aA));a.wrap||(a.wrap=c,a.wrap.addEventListener("click",function(c){var d=c.target;if(l(d,"jsc-spot"))0<=g.indexOf("spotCard")?l(a.wrap,"jsc-active")?A(a.wrap):x(a.wrap):(d={action:"cnt:tag",id:b.id,cmd:"open"},f(d,function(){})),c.preventDefault(),c.stopPropagation();else if(d.getAttribute("jsc-action"))A(a.wrap),
"webex"==d.getAttribute("jsc-action")?(d=a.wrap.getElementsByClassName("jsc-simple"),d[0]&&d[0].click()):(d={action:"cnt:tag",id:b._Am.id||b.id,_ag:b.id,cmd:d.getAttribute("jsc-action")},f(d,function(){})),c.preventDefault(),c.stopPropagation();else return c.returnValue=!1}),a.wrap.addEventListener("mouseover",function(a){if(!(0>g.indexOf("hoverCard")))for(a=a.toElement;a;){if(l(a,"jsc-wrap"))return e&&(clearTimeout(e),e=k),x(a);a=a.parentElement}}),a.wrap.addEventListener("mouseout",function(b){0>
g.indexOf("hoverCard")||(e&&(clearTimeout(e),e=k),e=setTimeout(function(){A(a.wrap)},200),console.log("mouseout",b))}));a._Af||(a._Af=document.createElement("span"),a._Af.className="jsc-card",a.wrap.insertBefore(a._Af,a._aA));a._aj||(a._aj=document.createElement("span"),a._aj.className="jsc-spot",a.wrap.insertBefore(a._aj,a._Af));m(a._aA,"jsc-data");Q(a,b)}}function P(a,b){if(b&&b.length){var d=a._aA.parentElement,c=!1;(c=l(d,"jsc-wrap"))?c=d:(c=document.createElement("span"),c.className="jsc-wrap",
d.insertBefore(c,a._aA),d.removeChild(a._aA),c.appendChild(a._aA));a.wrap||(a.wrap=c,a.wrap.addEventListener("click",function(){f({action:"cnt:dial",data:b[0].orig},function(){})}));a._aj||(a._aj=document.createElement("span"),a._aj.className="jsc-spot phone",a.wrap.insertBefore(a._aj,a._aA));m(a._aA,"jsc-data");a.wrap.title="Dial "+b[0]._bb}}function Q(a,b){if(a._Af){a.wrap.setAttribute("jsc-status",b._Am.presence||"offline");a.img||(a.img=document.createElement("img"),a._Af.appendChild(a.img));
a.img.src!=b._Am.image&&(a.img.src=b._Am.image||"");a.label||(a.label=document.createElement("div"),a._Af.appendChild(a.label));a.label.innerHTML=(b._Am.label||[]).join("<br/>");a.hr||a._Af.appendChild(a.hr=document.createElement("hr"));a._AO||(a._AO={});var d={},c=a._AO,e;for(e in c)d[e]=1;l(a.wrap,"jsc-simple")&&b._AO.push({id:"webex",label:"Start WebEx",_aH:"Start WebEx"});for(var f=0;f<b._AO.length;f++){var g=b._AO[f],h=g.id;delete d[h];c[h]||(c[h]=document.createElement("a"),c[h].href="ws://",
c[h].setAttribute("jsc-action",h),a._Af.appendChild(c[h]));c[h].textContent=g.label;c[h].title=g._aH||""}for(e in d)c[e].parentElement.removeChild(c[e]),delete c[e]}}if(!(0<=location.href.indexOf("dynamics.com/"))){var f=function(a){var b,d=0,c={};return function(e,f){if(!("undefined"==typeof chromeUnloading?0:chromeUnloading)){if(!b){try{b=chrome.runtime.connect({name:a+Date.now()+("undefined"==typeof chromeId?"":chromeId)})}catch(g){return console.log("can not connect"),f&&f({})}b.onMessage.addListener(function(b){"string"==
typeof b&&(b=JSON.parse(b));var d=c[a+b._AA];delete c[a+b._AA];d&&d(b)});b.onDisconnect.addListener(function(){console.log("disconnect");b=k;d=0;c={}})}d++;c[a+d]=f;e._AA=d;b.postMessage(e)}}}("JSCTAGS");r=0;s=[];t=[];p=1;u=[];v=[];q=1;g=[];var n={},z={},H=0,E=!1;if("complete"===document.readyState)return B();window.addEventListener("load",B)}})();})();

/* Esna Technologies Inc (C) 2012-2013 */

//@ sourceMappingURL=G:\PROJECTS\ESNATECH\JSLink\apps\src\app\chrome\jsc.tags.lst.map
