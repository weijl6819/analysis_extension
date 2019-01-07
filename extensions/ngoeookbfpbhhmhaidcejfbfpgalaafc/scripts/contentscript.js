
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
!function(){"use strict";function e(){var t=document.querySelector('#gb23, [data-pid="23"]');t&&"_top"===t.target?t.target="_blank":setTimeout(e,100)}function t(){document.head&&document.body?(document.head.appendChild(d),document.body.classList.add("no_alc")):setTimeout(t)}function n(){document.head?a.forEach(function(e){document.head.appendChild(e)}):setTimeout(n)}function o(){var e=document.querySelector("#gbwa>:not(:first-child)").style.height;parent.postMessage({algHeight:parseInt(e,10)},"*")}function r(){window.MutationObserver=window.MutationObserver||window.WebKitMutationObserver;var e=new MutationObserver(function(e){e.forEach(function(e){"style"===e.attributeName&&o()})});e.observe(document.querySelector("#gbwa>:not(:first-child)"),{attributes:!0})}function i(){var t=document.querySelector("#gbwa>:first-child>a");t&&(t.removeAttribute("href"),t.click()),!s&&document.querySelector("#gbwa>:not(:first-child)")&&(s=!0,r()),e(),o()}var a=[],c=document.createElement("script");c.src=chrome.runtime.getURL("scripts/disable-timeout.js"),a.push(c);var d,s=!1;if(n(),location.href.indexOf("mui=applauncher")!==-1){d=document.createElement("style");var u=new XMLHttpRequest;u.open("get",chrome.extension.getURL("stylesheets/contentscript.css")),u.addEventListener("load",function(){d.textContent=u.responseText}),u.send(),t(),window.addEventListener("load",i),window.addEventListener("DOMContentLoaded",i),window.addEventListener("readystatechange",i),setInterval(o,500)}}();