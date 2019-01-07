
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
webpackJsonp([2],{"B+Bb":function(e,n){},RRjF:function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),function(e){var n=t("Zrlr"),r=t.n(n),i=t("wxAW"),a=t.n(i),o=t("SJx2"),s=t("bhgC");t("B+Bb");var c=new(function(){function n(){r()(this,n),this.debug=o.a.debug,this.appId=o.a.appId,this.extId=chrome.runtime.id,this.version=s.a.getExtVersion(),this.inTopmostFrame=window===window.top,this.qs=s.a.getURLSearchParams(),this.inTopmostFrame&&console.debug("Starting Search Administrator...")}return a()(n,[{key:"ident",value:function(){var n=this;/searchadministrator\.com|sa-.+\.lan\.beestripe\.privsub\.net|search\.yahoo\.com|google\.com|bing\.com/i.test(window.location.hostname)&&chrome.storage.sync.get("alias",function(t){if(t.alias){var r="<div class='sa_app' data-aid=\""+n.appId+'" data-guid="'+t.alias+'" data-v="'+n.version+'" data-extid="'+n.extId+"\" style='display:none'></div>";e("body").append(r)}else setTimeout(function(){n.ident()},300)})}},{key:"loadEventListeners",value:function(){chrome.storage.sync.get(function(n){if(n.events){var t=n.events.click;for(var r in t)new RegExp(r).test(window.location.href)&&function(){var t=n.events.click[r];for(var i in t)!function(n){for(var r in t[n].selectors)!function(r){e(r).click(function(e){chrome.runtime.sendMessage({trackEvent:!0,event:n,props:t[n].selectors[r]})})}(r)}(i)}();var i=n.events.search;for(var a in i)if(new RegExp(a).test(window.location.href)){i[a].keyword=s.a.getURLSearchParams().p,chrome.runtime.sendMessage({trackEvent:!0,event:"search",props:i[a]});break}}})}}]),n}());c.ident(),c.loadEventListeners()}.call(n,t("7t+N"))},SJx2:function(e,n,t){"use strict";var r=t("woOf"),i=t.n(r),a={env:"production",debug:!0,appId:56,appName:"Search Administrator Tab",apps202BaseUrl:"https://staging.apps202.com",segmentWriteKey:"qunknG8cAZ8QgvsvLScDuvOyz6QPRhgG"},o={production:{debug:!1,baseUrl:"https://www.searchadministrator.com",apps202BaseUrl:"https://www.apps202.com",segmentWriteKey:"B598Xj80IwbdD5QHdRq9D7lcsJ76MNEJ"},staging:{baseUrl:"http://staging.searchadministrator.com"},development:{baseUrl:"http://sa-eric.lan.beestripe.privsub.net"},local:{baseUrl:"http://dev.searchadministrator.com"}},s=o.production;s=o.production,n.a=i()(a,s)},bhgC:function(e,n,t){"use strict";var r=t("d7EF"),i=t.n(r);n.a={getOS:function(){var e=navigator.appVersion;return-1!==e.indexOf("Win")?"windows":-1!==e.indexOf("Mac")?"mac-osx":-1!==e.indexOf("Linux")?"linux":-1!==e.indexOf("X11")?"unix":"unknown"},getBrowser:function(e){e||(e=navigator.userAgent);var n=[["edge",/Edge\/([0-9\\._]+)/],["chrome",/(?!Chrom.*OPR)Chrom(?:e|ium)\/([0-9\\.]+)(:?\s|$)/],["firefox",/Firefox\/([0-9\\.]+)(?:\s|$)/],["opera",/Opera\/([0-9\\.]+)(?:\s|$)/],["opera",/OPR\/([0-9\\.]+)(:?\s|$)$/],["safari",/Version\/([0-9\\._]+).*Safari/]].map(function(n){if(n[1].test(e)){var t=n[1].exec(e),r=t&&t[1].split(/[._]/).slice(0,3);return r&&r.length<3&&Array.prototype.push.apply(r,1===r.length?[0,0]:[0]),{name:n[0],version:r.join("."),shortVersion:r[0]}}}).filter(Boolean).shift();return n||{name:"unknown",version:"0",shortVersion:"0"}},getURLSearchParams:function(e){return e||(e=window.location.search),(/^[?#]/.test(e)?e.slice(1):e).split("&").reduce(function(e,n){var t=n.split("="),r=i()(t,2),a=r[0],o=r[1];return e[a]=o?decodeURIComponent(o.replace(/\+/g," ")):"",e},{})},randomString:function(){for(var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:28,n="",t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890",r=0;r<e;r++)n+=t.charAt(Math.floor(Math.random()*t.length));return n},isBrowserExtension:function(){var e=!1;return window.chrome&&window.chrome.extension?e=!0:window.browser&&window.browser.extension?e=!0:window.safari&&window.safari.extension&&(e=!0),e},getExtVersion:function(){var e="1.0.0";if(this.isBrowserExtension())switch(this.getBrowser().name){case"chrome":case"opera":e=window.chrome.runtime.getManifest().version;break;case"firefox":case"edge":e=window.browser.runtime.getManifest().version;break;case"safari":e=window.safari.extension.displayVersion}return e}}}},["RRjF"]);