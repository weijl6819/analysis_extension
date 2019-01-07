
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
function getReferrerPolicy(){return forceNoReferrer?"origin":""}function handlePointerPress(e){for(var r=e.target;r&&!r.href;)r=r.parentElement;if(r){var t=r.getAttribute("onmousedown");t&&/\ba?rwt\(/.test(t)&&(r.removeAttribute("onmousedown"),r.removeAttribute("ping"),e.stopImmediatePropagation());var o=getRealLinkFromGoogleUrl(r);o&&(r.href=o),r.referrerPolicy=getReferrerPolicy()}}function handleClick(e){if(0===e.button){for(var r=e.target;r&&!r.href;)r=r.parentElement;r&&(r.origin===location.origin&&(r.pathname===location.pathname||"/imgres"===r.pathname&&/[?&]imgurl=/.test(r.search)||"/search"===r.pathname&&/[?&]q=/.test(r.search))||"http:"!==r.protocol&&"https:"!==r.protocol&&"ftp:"!==r.protocol||"_blank"===r.target&&(e.stopPropagation(),r.referrerPolicy=getReferrerPolicy()))}}function getRealLinkFromGoogleUrl(e){if((e.hostname===location.hostname||"www.google.com"===e.hostname)&&/^\/(local_)?url$/.test(e.pathname)){var r=/[?&](?:q|url)=((?:https?|ftp)[%:][^&]+)/.exec(e.search);if(r)return decodeURIComponent(r[1]);if(r=/[?&](?:q|url)=((?:%2[Ff]|\/)[^&]+)/.exec(e.search))return e.origin+decodeURIComponent(r[1])}}function setupAggresiveUglyLinkPreventer(){var e=document.createElement("script");e.textContent="("+function(e){function r(e){try{u(new l("dtmg-get-referrer-policy"));var r=h("referrerPolicy");"string"==typeof r&&r&&c(e,"referrerPolicy",r)}catch(e){}}var t=HTMLAnchorElement.prototype,o=Object.getOwnPropertyDescriptor(t,"href"),n=Function.prototype.call.bind(o.get),i=Function.prototype.call.bind(o.set);Object.defineProperty(t,"href",{configurable:!0,enumerable:!0,get:function(){return n(this)},set:function(t){i(this,t);try{t=e(this),t&&i(this,t)}catch(e){}r(this)}});var c=Function.prototype.call.bind(t.setAttribute);t.setAttribute=function(e,r){"href"===e||"HREF"===e?this.href=r:c(this,e,r)};var a=Function.prototype.apply.bind(t.dispatchEvent);t.dispatchEvent=function(){return r(this),a(this,arguments)};var f=Function.prototype.apply.bind(t.click);t.click=function(){return r(this),f(this,arguments)};var l=window.CustomEvent,s=document.currentScript,u=s.dispatchEvent.bind(s),h=s.getAttribute.bind(s)}+")("+getRealLinkFromGoogleUrl+");",e.addEventListener("dtmg-get-referrer-policy",function(r){e.setAttribute("referrerPolicy",getReferrerPolicy())}),(document.head||document.documentElement).appendChild(e),e.remove()}document.addEventListener("mousedown",handlePointerPress,!0),document.addEventListener("touchstart",handlePointerPress,!0),document.addEventListener("click",handleClick,!0),setupAggresiveUglyLinkPreventer();var forceNoReferrer=!0;"object"==typeof chrome&&chrome.storage&&((chrome.storage.sync||chrome.storage.local).get({forceNoReferrer:!0,referrerPolicy:"no-referrer"},function(e){e&&(""===e.referrerPolicy&&(e.forceNoReferrer=!1),forceNoReferrer=e.forceNoReferrer)}),chrome.storage.onChanged.addListener(function(e){e.forceNoReferrer&&(forceNoReferrer=e.forceNoReferrer.newValue)}));