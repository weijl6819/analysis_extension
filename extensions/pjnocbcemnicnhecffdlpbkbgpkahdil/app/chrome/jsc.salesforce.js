
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
(function() {(function(){function d(){return"undefined"===typeof chromeUnloading?!1:chromeUnloading}function f(a,b){g||(g=chrome.runtime.connect({name:h+Date.now()+("undefined"===typeof chromeId?"":chromeId)}),g.onMessage.addListener(function(a){if(!d()){"string"===typeof a&&(a=JSON.parse(a));var b=k[h+a._aC];delete k[h+a._aC];b&&b(a)}}));l++;k[h+l]=b;a._aC=l;g.postMessage(a)}function q(a){var b=document.getElementById("JSC_SF_CTI");if(b){var e=document.getElementById("jsc_to_cti");if(e){var c=document.createEvent("Event");
c.initEvent("jsc_to_cti",!0,!0);e.textContent=JSON.stringify(a);b.dispatchEvent(c)}}}function u(){if(!d()){var a=document.getElementById("jsc_from_cti");if(a)switch(a=JSON.parse(a.textContent),a.action){case "dial":f({action:"cnt:dialsf",data:a.phone});break;case "pick":f({action:"cnt:picksf",data:{callId:a.callId,items:a.items,_aH:a.activity,match:a.match,_ec:a.codes,types:a.types}})}}}function r(){d()||f({action:"cnt:salesforceCTI",_AJ:v},function(a){if(!d()){if(a.call){var b=a.call._AA,b=b.replace(/[^0-9]/ig,
" ").replace(/  /ig," ").trim();if(7>=b.length)return;var e=b.split(" ");3===e&&(e.shift(),b=e.join(" "));q({action:"call",incoming:a.call._an,number:b,appName:m})}else a.calls?q({action:"calls",calls:a.calls,activities:a._Tr,open:a.open,appName:m}):console.log("IDLE");setTimeout(r,1E3)}})}function w(){var a=location.search||"",a=a.substr(1);return"lightning"===(a.split("&").reduce(function(a,e){var c=e.split("="),d=c.shift();a[d]=c.join("=");return a},{}).mode||"").toLowerCase()}function s(a){if(!d()&&
!(10<a)){var b=document.getElementById("JSC_SF_CTI");if(!b)return setTimeout(s,50*(a+1),a+1);f({action:"cnt:salesforce"},function(a){if(!d()&&("string"===typeof a&&(a=JSON.parse(a)),a.enabled)){var c=a.page;a.appName&&(m=a.appName);w()?c+="?noexpand=1":n&&(c+="?expanded=1");b.src=c;b.addEventListener("jsc_from_cti",u);b.className="jsc_sf_cti";r()}})}}function p(){t||(t=!0,window.addEventListener("message",x),s(0))}function x(a){a=a.data||{};if("jsc.show"===a._at){if(!a.status!==!n){n=!!a.status;var b=
document.createElement("script");b.textContent="localStorage.setItem('jsc.showOption', "+(a.status?"1":"''")+");";document.body.appendChild(b)}self!==top&&top.postMessage(a,"*")}}var g,l=0,k={},h="JSCSF",v="Bridge_"+Date.now(),m="",n=localStorage.getItem("jsc.showOption")?1:0,t;if("complete"===document.readyState)return p();window.addEventListener("load",p);setTimeout(100,p)})();})();

/* Esna Technologies Inc (C) 2012-2013 */

//@ sourceMappingURL=G:\PROJECTS\ESNATECH\JSLink\apps\src\app\chrome\jsc.salesforce.lst.map
