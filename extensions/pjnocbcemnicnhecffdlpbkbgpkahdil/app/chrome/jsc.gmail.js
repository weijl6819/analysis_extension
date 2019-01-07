
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
(function() {var m=null;
(function(){function r(a){function b(){if("WEBEX"===e.type){var c=document.createEvent("CustomEvent");c.initCustomEvent("jsc_rept_gmail_event_webex",!0,!0,this.email);document.dispatchEvent(c)}else g({action:"cnt:contact",data:this.email})}function d(){g({action:"cnt:dialExt",data:this.phone})}function n(c,a){c&&("WEBEX"===e.type&&setTimeout(function(){a&&a({_aW:!0,email:c,header:e.button.header})},250),g({action:"cnt:resolve",data:c},function(c){a&&a(c)}))}function s(c,b){c.id=b.id;"WEBEX"!==e.type&&
(c.style.color="transparent",c.style.backgroundImage='url("'+e.button.image+'")',c.style.backgroundRepeat="no-repeat",c.style.opacity="0.6");a.version?(c.setAttribute("data-tooltip",b.title),c.style.width="24px",c.style.margin="10px 10px 10px 0",c.style.backgroundPosition="center",c.style.cursor="pointer"):(c.setAttribute("title",b.title),c.style.top="-1px",c.style.height="10px",c.style.backgroundPosition="left center");c.addEventListener("mousedown",function(a){a.preventDefault();a.stopPropagation()});
c.addEventListener("mouseup",function(a){a.preventDefault();a.stopPropagation()});c.addEventListener("click",function(a){console.log("click:"+JSON.stringify(b));b.handler();a.preventDefault();a.stopPropagation()});return c}function f(a){var b={x:0,y:0};if(a.hidden)return b;for(;a!=document.body;)b.x+=a.offsetLeft,b.y+=a.offsetTop,a=a.offsetParent;return b}function h(a,b){var d=f(a),e=f(b),h=e.y-d.y,d=e.x-d.x;return h?h:d}function p(c){if(c&&c._aW){var f;if("ILINKPRO"===e._ac){if(!c._ap.length)return;
f=c._ap[0]}f={id:"jsc_gmail_action_"+e._ac.toLowerCase(),email:c.email,phone:f,title:"ILINKPRO"!==e._ac?c.header:c.action,handler:"ILINKPRO"!==e._ac?b:d};console.log("resolve:",c);if(!document.getElementById(f.id)){for(var n=document.getElementsByTagName("div")||[],l=[],g=0;g<n.length;g++){var k=l,q=n[g];q.getAttribute("role")&&k.push(q)}if(l.length&&(l.sort(h),l[0].parentElement.appendChild(s(l[0].cloneNode(),f)),("JABBER"===e._ac||"AVAYA"===e._ac||"AURA"===e._ac||"OFFICE2600"===e._ac)&&c._aW))f=
document.getElementsByTagName("img")[0].parentElement,"A"===f.tagName&&(f=f.parentElement),a.version?f.classList.add("jsc_presence_"+a.version):f.classList.add("jsc_presence"),f.classList.add(c.presence||"online")}}}"showCard"===a.method&&(k=a.data.email);"setShown"===a.method&&(n(k=a.data?k:m,p),console.log("showCard: "+k),window.parent.postMessage({action:"jsc.showCard",location:location.href},"*"))}function p(a){a&&("string"==typeof a&&(a=JSON.parse(a)),e._ac=a.type||a.type,console.info("opt.app:",
e._ac),e.button={text:a._Ay,_ap:a._BP,_bB:a._Bb,header:a.header||a.header,image:a._aI})}var e={type:"ILINK"};e._ac=e.type;var k=m,g=function(){var a,b=0,d={};return function(e,g){a||(a=chrome.runtime.connect({name:"jsc_"+Date.now()+("undefined"==typeof chromeId?"":chromeId)}),a.onMessage.addListener(function(a){"string"==typeof a&&(a=JSON.parse(a));var b=d["G"+a._aC];delete d["G"+a._aC];b&&b.call(this,a)}));b++;d["G"+b]=g;e._aC=b;a.postMessage(e)}}();window.addEventListener("message",function(a){var b=
m;try{var d=a.data.substr(a.data.indexOf("{"));console.log("msg:gmail:",d);b=JSON.parse(d)}catch(e){}if(b){var g=d=a=m,f;for(f in b){var h=b[f]||"";"string"===typeof h?"setShown"===h||"showCard"===h?a=h:0<=h.indexOf(":loadData")?a="loadData":0<=h.indexOf(":render")?a="render":0<=h.indexOf(":hide")&&(a="hide"):h.pop&&(d=h)}if(a&&d){if("showCard"===a)for(b=0;b<d.length;b++){if(d[b]&&d[b].email){d=d[b];break}}else if("setShown"===a)for(b=0;b<d.length;b++){if(!0===d[b]||!1===d[b])d=d[b]}else if("loadData"===
a){g="201806";a="showCard";for(b=0;b<d.length;b++)if(d[b]&&d[b]["hovercard-id"]){d={email:d[b]["hovercard-id"]};break}}else"render"===a?(g="201806",a="setShown",d=!0):"hide"===a&&(g="201806");r({method:a,data:d,version:g})}}});window.addEventListener("load",function(){"WEBEX"!==e.type?g({action:"cnt:config"},p):chrome.extension.sendRequest({action:"cnt:config"},p)})})();})();

/* Esna Technologies Inc (C) 2012-2013 */

//@ sourceMappingURL=G:\PROJECTS\ESNATECH\JSLink\apps\src\app\chrome\jsc.gmail.lst.map
