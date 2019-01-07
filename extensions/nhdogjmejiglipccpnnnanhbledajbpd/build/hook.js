
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
!function(t){var e={};function n(o){if(e[o])return e[o].exports;var i=e[o]={i:o,l:!1,exports:{}};return t[o].call(i.exports,i,i.exports,n),i.l=!0,i.exports}n.m=t,n.c=e,n.d=function(t,e,o){n.o(t,e)||Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:o})},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=78)}({5:function(t,e,n){"use strict";e.a=function(t){if(t.prototype.hasOwnProperty("$isChrome"))return;Object.defineProperties(t.prototype,{$isChrome:{get:()=>o},$isFirefox:{get:()=>i},$isWindows:{get:()=>r},$isMac:{get:()=>c},$isLinux:{get:()=>s},$keys:{get:()=>l}}),r&&document.body.classList.add("platform-windows");c&&document.body.classList.add("platform-mac");s&&document.body.classList.add("platform-linux")};const o="undefined"!=typeof chrome&&!!chrome.devtools;e.b=o;const i=navigator.userAgent.indexOf("Firefox")>-1;e.c=i;const r=0===navigator.platform.indexOf("Win"),c="MacIntel"===navigator.platform,s=0===navigator.platform.indexOf("Linux"),l={ctrl:c?"&#8984;":"Ctrl",shift:"Shift",alt:c?"&#8997;":"Alt",del:"Del",enter:"Enter",esc:"Esc"};e.d=l},78:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=n(79),i=n(5);if(document instanceof HTMLDocument){const t=";("+o.a.toString()+")(window)";if(i.c)window.eval(t);else{const e=document.createElement("script");e.textContent=t,document.documentElement.appendChild(e),e.parentNode.removeChild(e)}}},79:function(t,e,n){"use strict";e.a=function(t){let e={};if(t.hasOwnProperty("__VUE_DEVTOOLS_GLOBAL_HOOK__"))return;const n={Vue:null,on(t,n){(e[t="$"+t]||(e[t]=[])).push(n)},once(t,n){const o=t;(e[t="$"+t]||(e[t]=[])).push(function t(){this.off(o,t);n.apply(this,arguments)})},off(t,n){if(t="$"+t,arguments.length){const o=e[t];if(o)if(n)for(let t=0,e=o.length;t<e;t++){const e=o[t];if(e===n||e.fn===n){o.splice(t,1);break}}else e[t]=null}else e={}},emit(t){let n=e[t="$"+t];if(n){const t=[].slice.call(arguments,1);for(let e=0,o=(n=n.slice()).length;e<o;e++)n[e].apply(this,t)}}};n.once("init",e=>{n.Vue=e,e.prototype.$inspect=function(){const e=t.__VUE_DEVTOOLS_INSPECT__;e&&e(this)}}),n.once("vuex:init",t=>{n.store=t}),Object.defineProperty(t,"__VUE_DEVTOOLS_GLOBAL_HOOK__",{get:()=>n})}}});