
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
!function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:o})},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=180)}({180:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(181),r=n(5);function i(e){const t=";("+e.toString()+")(window)";if(r.c)window.eval(t);else{const e=document.createElement("script");e.textContent=t,document.documentElement.appendChild(e),e.parentNode.removeChild(e)}}window.addEventListener("message",e=>{e.source===window&&e.data.vueDetected&&chrome.runtime.sendMessage(e.data)}),document instanceof HTMLDocument&&(i(function(e){setTimeout(()=>{if(Boolean(window.__NUXT__||window.$nuxt)){let t;return window.$nuxt&&(t=window.$nuxt.$root.constructor),void e.postMessage({devtoolsEnabled:t&&t.config.devtools,vueDetected:!0,nuxtDetected:!0},"*")}const t=document.querySelectorAll("*");let n;for(let e=0;e<t.length;e++)if(t[e].__vue__){n=t[e];break}if(n){let t=Object.getPrototypeOf(n.__vue__).constructor;for(;t.super;)t=t.super;e.postMessage({devtoolsEnabled:t.config.devtools,vueDetected:!0},"*")}},100)}),i(o.a))},181:function(e,t,n){"use strict";t.a=function(e){let t=null,n=0;const o={normal:"#3BA776",warn:"#DB6B00",error:"#DB2600"};function r(){clearTimeout(n),t&&(document.body.removeChild(t),t=null)}e.__VUE_DEVTOOLS_TOAST__=((e,i)=>{const d=o[i]||o.normal;console.log(`%c vue-devtools %c ${e} %c `,"background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff",`background: ${d}; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff`,"background:transparent"),t?t.querySelector(".vue-wrapper").style.background=d:((t=document.createElement("div")).addEventListener("click",r),t.innerHTML=`\n      <div id="vue-devtools-toast" style="\n        position: fixed;\n        bottom: 6px;\n        left: 0;\n        right: 0;\n        height: 0;\n        display: flex;\n        align-items: flex-end;\n        justify-content: center;\n        z-index: 999999999999999999999;\n        font-family: Menlo, Consolas, monospace;\n        font-size: 14px;\n      ">\n        <div class="vue-wrapper" style="\n          padding: 6px 12px;\n          background: ${d};\n          color: white;\n          border-radius: 3px;\n          flex: auto 0 1;\n          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);\n          cursor: pointer;\n        ">\n          <div class="vue-content"></div>\n        </div>\n      </div>\n      `,document.body.appendChild(t)),t.querySelector(".vue-content").innerText=e,clearTimeout(n),n=setTimeout(r,5e3)})}},5:function(e,t,n){"use strict";t.a=function(e){if(e.prototype.hasOwnProperty("$isChrome"))return;Object.defineProperties(e.prototype,{$isChrome:{get:()=>o},$isFirefox:{get:()=>r},$isWindows:{get:()=>i},$isMac:{get:()=>d},$isLinux:{get:()=>c},$keys:{get:()=>s}}),i&&document.body.classList.add("platform-windows");d&&document.body.classList.add("platform-mac");c&&document.body.classList.add("platform-linux")};const o="undefined"!=typeof chrome&&!!chrome.devtools;t.b=o;const r=navigator.userAgent.indexOf("Firefox")>-1;t.c=r;const i=0===navigator.platform.indexOf("Win"),d="MacIntel"===navigator.platform,c=0===navigator.platform.indexOf("Linux"),s={ctrl:d?"&#8984;":"Ctrl",shift:"Shift",alt:d?"&#8997;":"Alt",del:"Del",enter:"Enter",esc:"Esc"};t.d=s}});