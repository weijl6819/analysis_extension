
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
!function(t){function e(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,e),o.l=!0,o.exports}var n={};e.m=t,e.c=n,e.d=function(t,n,r){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:r})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="/",e(e.s=407)}({11:function(t,e,n){"use strict";function r(t){if(Array.isArray(t)){for(var e=0,n=Array(t.length);e<t.length;e++)n[e]=t[e];return n}return Array.from(t)}function o(t){return t.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?=]+)/im)[1]}function u(t){return"[object Function]"===Object.prototype.toString.call(t)}function i(t){return t.filter(function(t){return t&&"undefined"!==typeof t})}function c(t){var e=[];for(var n in t)if(t[n]){var r=Object.prototype.toString.call(t[n]).match(/\[object (\w+)\]/)[1];"String"!==r&&"Number"!==r||e.push(encodeURIComponent(n)+"="+encodeURIComponent(t[n]))}return e.join("&")}function a(t){return"true"===t||1===t||1===parseInt(t,10)}function s(t){var e;return[].concat(r(new Set((e=[]).concat.apply(e,r(t)))))}e.b=o,e.d=u,e.a=i,e.f=c,e.c=a,e.e=s},12:function(t,e){function n(t){return null!=t&&"object"==typeof t}t.exports=n},13:function(t,e,n){function r(t){return null==t?void 0===t?a:c:s&&s in Object(t)?u(t):i(t)}var o=n(20),u=n(54),i=n(55),c="[object Null]",a="[object Undefined]",s=o?o.toStringTag:void 0;t.exports=r},17:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});e.DISPATCH_TYPE="chromex.dispatch",e.STATE_TYPE="chromex.state",e.PATCH_STATE_TYPE="chromex.patch_state",e.DIFF_STATUS_UPDATED="updated",e.DIFF_STATUS_REMOVED="removed"},2:function(t,e,n){"use strict";function r(t){return F.runtime.onMessage.addListener(t)}function o(t){return F.runtime.onMessage.removeListener(t)}function u(t){return F.runtime.onUpdateAvailable.addListener(t)}function i(){return F.runtime.reload()}function c(t){return F.runtime.setUninstallURL(t)}function a(t){return F.tabs.onActivated.addListener(t)}function s(t){return F.tabs.onUpdated.addListener(t)}function f(t){return F.tabs.onRemoved.addListener(t)}function l(t){return F.tabs.onReplaced.addListener(t)}function p(t){return F.windows.onFocusChanged.addListener(t)}function d(){var t=(arguments.length>0&&void 0!==arguments[0]&&arguments[0],arguments[1]),e=arguments[2],n=Object(k.d)(e)?e:function(){};return F.runtime.sendMessage(t,n)}function v(t,e,n){var r=Object(k.d)(n)?n:function(){};return F.tabs.sendMessage(t,e,r)}function b(){return F.browserAction}function y(){return F.contextMenus}function h(){return F.cookies}function m(t){return F.runtime.getURL(t)}function g(t){F.tabs.query({active:!0,currentWindow:!0},function(e){F.tabs.update(e[0].id,{url:t})})}function j(t,e){var n=!0!==e;return F.tabs.create({url:t,active:n})}function x(){return F.runtime.openOptionsPage()}function _(t,e){var n="images/"+e+"-19.png",r="images/"+e+"-38.png";F.browserAction.setIcon({tabId:t,path:{19:n,38:r}})}function O(t,e){e?_(t,"browser-action-icon-added"):_(t,"browser-action-icon")}function w(t,e,n){var r=Object(k.d)(n)?n:function(){};return F.tabs.executeScript(t,e,r)}function S(){return new Promise(function(t){return F.management.getSelf(t)})}function P(t){var e=Object(k.d)(t)?t:function(){};return F.tabs.query({windowId:F.windows.WINDOW_ID_CURRENT,active:!0},function(t){e(t)})}function T(t,e){var n=Object(k.d)(e)?e:function(){};return F.tabs.query(t,n)}function A(t){return F.tabs.remove(t)}function E(t){return localStorage.getItem(t)}function I(t){Object.keys(t).forEach(function(e){localStorage.setItem(e,t[e])})}function M(t){t.forEach(function(t){localStorage.removeItem(t)})}e.a=r,e.v=o,e.p=u,e.u=i,e.A=c,e.l=a,e.o=s,e.m=f,e.n=l,e.k=p,e.x=d,e.y=v,e.b=b,e.d=y,e.e=h,e.j=m,e.s=g,e.r=j,e.q=x,e.B=O,e.f=w,e.h=S,e.g=P,e.t=T,e.c=A,e.i=E,e.z=I,e.w=M;var k=n(11),F=window.chrome},20:function(t,e,n){var r=n(8),o=r.Symbol;t.exports=o},21:function(t,e){var n=Array.isArray;t.exports=n},24:function(t,e){function n(t,e){return t===e||t!==t&&e!==e}t.exports=n},25:function(t,e,n){function r(t){return null!=t&&u(t.length)&&!o(t)}var o=n(32),u=n(29);t.exports=r},26:function(t,e){t.exports=function(t){return t.webpackPolyfill||(t.deprecate=function(){},t.paths=[],t.children||(t.children=[]),Object.defineProperty(t,"loaded",{enumerable:!0,get:function(){return t.l}}),Object.defineProperty(t,"id",{enumerable:!0,get:function(){return t.i}}),t.webpackPolyfill=1),t}},27:function(t,e,n){function r(t,e){var n=u(t,e);return o(n)?n:void 0}var o=n(53),u=n(58);t.exports=r},28:function(t,e){function n(t){return t}t.exports=n},29:function(t,e){function n(t){return"number"==typeof t&&t>-1&&t%1==0&&t<=r}var r=9007199254740991;t.exports=n},30:function(t,e,n){function r(t,e,n){"__proto__"==e&&o?o(t,e,{configurable:!0,enumerable:!0,value:n,writable:!0}):t[e]=n}var o=n(34);t.exports=r},31:function(t,e){function n(t,e){var n=typeof t;return!!(e=null==e?r:e)&&("number"==n||"symbol"!=n&&o.test(t))&&t>-1&&t%1==0&&t<e}var r=9007199254740991,o=/^(?:0|[1-9]\d*)$/;t.exports=n},32:function(t,e,n){function r(t){if(!u(t))return!1;var e=o(t);return e==c||e==a||e==i||e==s}var o=n(13),u=n(9),i="[object AsyncFunction]",c="[object Function]",a="[object GeneratorFunction]",s="[object Proxy]";t.exports=r},33:function(t,e,n){(function(e){var n="object"==typeof e&&e&&e.Object===Object&&e;t.exports=n}).call(e,n(6))},34:function(t,e,n){var r=n(27),o=function(){try{var t=r(Object,"defineProperty");return t({},"",{}),t}catch(t){}}();t.exports=o},37:function(t,e,n){"use strict";n.d(e,"c",function(){return r}),n.d(e,"a",function(){return o}),n.d(e,"b",function(){return u}),n.d(e,"d",function(){return i});var r="FN2187",o="https://getpocket.com/signup?src=extension&route=/extension_login_success",u="https://getpocket.com/lo",i="chrome://extensions/configureCommands"},39:function(t,e,n){var r=n(59),o=n(12),u=Object.prototype,i=u.hasOwnProperty,c=u.propertyIsEnumerable,a=r(function(){return arguments}())?r:function(t){return o(t)&&i.call(t,"callee")&&!c.call(t,"callee")};t.exports=a},40:function(t,e,n){function r(t,e){return i(u(t,e,o),t+"")}var o=n(28),u=n(60),i=n(62);t.exports=r},407:function(t,e,n){t.exports=n(408)},408:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=n(70),o=(n.n(r),n(37)),u=n(2);(function(){return new Promise(function(t){return Object(u.x)(null,{action:"getExtensionInfo"},t)})})().then(function(t){var e=new r.Store({portName:o.c,extensionId:t.id});e.ready().then(function(){e.dispatch({type:"USER_LOGOUT"})})})},45:function(t,e){function n(t){if(null!=t){try{return o.call(t)}catch(t){}try{return t+""}catch(t){}}return""}var r=Function.prototype,o=r.toString;t.exports=n},46:function(t,e){function n(t){return function(e){return t(e)}}t.exports=n},47:function(t,e,n){function r(t,e){var n=i(t),r=!n&&u(t),f=!n&&!r&&c(t),p=!n&&!r&&!f&&s(t),d=n||r||f||p,v=d?o(t.length,String):[],b=v.length;for(var y in t)!e&&!l.call(t,y)||d&&("length"==y||f&&("offset"==y||"parent"==y)||p&&("buffer"==y||"byteLength"==y||"byteOffset"==y)||a(y,b))||v.push(y);return v}var o=n(66),u=n(39),i=n(21),c=n(48),a=n(31),s=n(49),f=Object.prototype,l=f.hasOwnProperty;t.exports=r},48:function(t,e,n){(function(t){var r=n(8),o=n(67),u="object"==typeof e&&e&&!e.nodeType&&e,i=u&&"object"==typeof t&&t&&!t.nodeType&&t,c=i&&i.exports===u,a=c?r.Buffer:void 0,s=a?a.isBuffer:void 0,f=s||o;t.exports=f}).call(e,n(26)(t))},49:function(t,e,n){var r=n(68),o=n(46),u=n(69),i=u&&u.isTypedArray,c=i?o(i):r;t.exports=c},50:function(t,e){function n(t){var e=t&&t.constructor;return t===("function"==typeof e&&e.prototype||r)}var r=Object.prototype;t.exports=n},53:function(t,e,n){function r(t){return!(!i(t)||u(t))&&(o(t)?v:s).test(c(t))}var o=n(32),u=n(56),i=n(9),c=n(45),a=/[\\^$.*+?()[\]{}|]/g,s=/^\[object .+?Constructor\]$/,f=Function.prototype,l=Object.prototype,p=f.toString,d=l.hasOwnProperty,v=RegExp("^"+p.call(d).replace(a,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");t.exports=r},54:function(t,e,n){function r(t){var e=i.call(t,a),n=t[a];try{t[a]=void 0;var r=!0}catch(t){}var o=c.call(t);return r&&(e?t[a]=n:delete t[a]),o}var o=n(20),u=Object.prototype,i=u.hasOwnProperty,c=u.toString,a=o?o.toStringTag:void 0;t.exports=r},55:function(t,e){function n(t){return o.call(t)}var r=Object.prototype,o=r.toString;t.exports=n},56:function(t,e,n){function r(t){return!!u&&u in t}var o=n(57),u=function(){var t=/[^.]+$/.exec(o&&o.keys&&o.keys.IE_PROTO||"");return t?"Symbol(src)_1."+t:""}();t.exports=r},57:function(t,e,n){var r=n(8),o=r["__core-js_shared__"];t.exports=o},58:function(t,e){function n(t,e){return null==t?void 0:t[e]}t.exports=n},59:function(t,e,n){function r(t){return u(t)&&o(t)==i}var o=n(13),u=n(12),i="[object Arguments]";t.exports=r},6:function(t,e){var n;n=function(){return this}();try{n=n||Function("return this")()||(0,eval)("this")}catch(t){"object"===typeof window&&(n=window)}t.exports=n},60:function(t,e,n){function r(t,e,n){return e=u(void 0===e?t.length-1:e,0),function(){for(var r=arguments,i=-1,c=u(r.length-e,0),a=Array(c);++i<c;)a[i]=r[e+i];i=-1;for(var s=Array(e+1);++i<e;)s[i]=r[i];return s[e]=n(a),o(t,this,s)}}var o=n(61),u=Math.max;t.exports=r},61:function(t,e){function n(t,e,n){switch(n.length){case 0:return t.call(e);case 1:return t.call(e,n[0]);case 2:return t.call(e,n[0],n[1]);case 3:return t.call(e,n[0],n[1],n[2])}return t.apply(e,n)}t.exports=n},62:function(t,e,n){var r=n(63),o=n(65),u=o(r);t.exports=u},63:function(t,e,n){var r=n(64),o=n(34),u=n(28),i=o?function(t,e){return o(t,"toString",{configurable:!0,enumerable:!1,value:r(e),writable:!0})}:u;t.exports=i},64:function(t,e){function n(t){return function(){return t}}t.exports=n},65:function(t,e){function n(t){var e=0,n=0;return function(){var i=u(),c=o-(i-n);if(n=i,c>0){if(++e>=r)return arguments[0]}else e=0;return t.apply(void 0,arguments)}}var r=800,o=16,u=Date.now;t.exports=n},66:function(t,e){function n(t,e){for(var n=-1,r=Array(t);++n<t;)r[n]=e(n);return r}t.exports=n},67:function(t,e){function n(){return!1}t.exports=n},68:function(t,e,n){function r(t){return i(t)&&u(t.length)&&!!c[o(t)]}var o=n(13),u=n(29),i=n(12),c={};c["[object Float32Array]"]=c["[object Float64Array]"]=c["[object Int8Array]"]=c["[object Int16Array]"]=c["[object Int32Array]"]=c["[object Uint8Array]"]=c["[object Uint8ClampedArray]"]=c["[object Uint16Array]"]=c["[object Uint32Array]"]=!0,c["[object Arguments]"]=c["[object Array]"]=c["[object ArrayBuffer]"]=c["[object Boolean]"]=c["[object DataView]"]=c["[object Date]"]=c["[object Error]"]=c["[object Function]"]=c["[object Map]"]=c["[object Number]"]=c["[object Object]"]=c["[object RegExp]"]=c["[object Set]"]=c["[object String]"]=c["[object WeakMap]"]=!1,t.exports=r},69:function(t,e,n){(function(t){var r=n(33),o="object"==typeof e&&e&&!e.nodeType&&e,u=o&&"object"==typeof t&&t&&!t.nodeType&&t,i=u&&u.exports===o,c=i&&r.process,a=function(){try{return c&&c.binding&&c.binding("util")}catch(t){}}();t.exports=a}).call(e,n(26)(t))},70:function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0}),e.alias=e.wrapStore=e.Store=void 0;var o=n(71),u=r(o),i=n(80),c=r(i),a=n(82),s=r(a);e.Store=u.default,e.wrapStore=c.default,e.alias=s.default},71:function(t,e,n){"use strict";function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var o=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),u=n(72),i=function(t){return t&&t.__esModule?t:{default:t}}(u),c=n(17),a=function(){function t(e){var n=this,o=e.portName,u=e.state,i=void 0===u?{}:u,a=e.extensionId,s=void 0===a?"":a;if(r(this,t),!o)throw new Error("portName is required in options");this.portName=o,this.readyResolved=!1,this.readyPromise=new Promise(function(t){return n.readyResolve=t}),this.extensionId=s,this.port=chrome.runtime.connect(this.extensionId,{name:o}),this.listeners=[],this.state=i,this.port.onMessage.addListener(function(t){switch(t.type){case c.STATE_TYPE:n.replaceState(t.payload),n.readyResolved||(n.readyResolved=!0,n.readyResolve());break;case c.PATCH_STATE_TYPE:n.patchState(t.payload)}}),this.dispatch=this.dispatch.bind(this)}return o(t,[{key:"ready",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;return null!==t?this.readyPromise.then(t):this.readyPromise}},{key:"subscribe",value:function(t){var e=this;return this.listeners.push(t),function(){e.listeners=e.listeners.filter(function(e){return e!==t})}}},{key:"patchState",value:function(t){var e=Object.assign({},this.state);t.forEach(function(t){var n=t.change,r=t.key,o=t.value;switch(n){case c.DIFF_STATUS_UPDATED:e[r]=o;break;case c.DIFF_STATUS_REMOVED:Reflect.deleteProperty(e,r)}}),this.state=e,this.listeners.forEach(function(t){return t()})}},{key:"replaceState",value:function(t){this.state=t,this.listeners.forEach(function(t){return t()})}},{key:"getState",value:function(){return this.state}},{key:"dispatch",value:function(t){var e=this;return new Promise(function(n,r){chrome.runtime.sendMessage(e.extensionId,{type:c.DISPATCH_TYPE,portName:e.portName,payload:t},function(t){var e=t.error,o=t.value;if(e){var u=new Error("\nLooks like there is an error in the background page. You might want to inspect your background page for more details.\n"+e);r((0,i.default)(u,e))}else n(o&&o.payload)})})}}]),t}();e.default=a},72:function(t,e,n){var r=n(73),o=n(75),u=n(77),i=o(function(t,e){r(e,u(e),t)});t.exports=i},73:function(t,e,n){function r(t,e,n,r){var i=!n;n||(n={});for(var c=-1,a=e.length;++c<a;){var s=e[c],f=r?r(n[s],t[s],s,n,t):void 0;void 0===f&&(f=t[s]),i?u(n,s,f):o(n,s,f)}return n}var o=n(74),u=n(30);t.exports=r},74:function(t,e,n){function r(t,e,n){var r=t[e];c.call(t,e)&&u(r,n)&&(void 0!==n||e in t)||o(t,e,n)}var o=n(30),u=n(24),i=Object.prototype,c=i.hasOwnProperty;t.exports=r},75:function(t,e,n){function r(t){return o(function(e,n){var r=-1,o=n.length,i=o>1?n[o-1]:void 0,c=o>2?n[2]:void 0;for(i=t.length>3&&"function"==typeof i?(o--,i):void 0,c&&u(n[0],n[1],c)&&(i=o<3?void 0:i,o=1),e=Object(e);++r<o;){var a=n[r];a&&t(e,a,r,i)}return e})}var o=n(40),u=n(76);t.exports=r},76:function(t,e,n){function r(t,e,n){if(!c(n))return!1;var r=typeof e;return!!("number"==r?u(n)&&i(e,n.length):"string"==r&&e in n)&&o(n[e],t)}var o=n(24),u=n(25),i=n(31),c=n(9);t.exports=r},77:function(t,e,n){function r(t){return i(t)?o(t,!0):u(t)}var o=n(47),u=n(78),i=n(25);t.exports=r},78:function(t,e,n){function r(t){if(!o(t))return i(t);var e=u(t),n=[];for(var r in t)("constructor"!=r||!e&&a.call(t,r))&&n.push(r);return n}var o=n(9),u=n(50),i=n(79),c=Object.prototype,a=c.hasOwnProperty;t.exports=r},79:function(t,e){function n(t){var e=[];if(null!=t)for(var n in Object(t))e.push(n);return e}t.exports=n},8:function(t,e,n){var r=n(33),o="object"==typeof self&&self&&self.Object===Object&&self,u=r||o||Function("return this")();t.exports=u},80:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=n(17),o=n(81),u=function(t){return t&&t.__esModule?t:{default:t}}(o),i=function(t,e){Promise.resolve(t).then(function(t){e({error:null,value:t})}).catch(function(t){console.error("error dispatching result:",t),e({error:t.message,value:null})})};e.default=function(t,e){var n=e.portName,o=e.dispatchResponder;if(!n)throw new Error("portName is required in options");o||(o=i);var c=function(e,u,i){if(e.type===r.DISPATCH_TYPE&&e.portName===n){var c=Object.assign({},e.payload,{_sender:u}),a=null;try{a=t.dispatch(c)}catch(t){a=Promise.reject(t.message),console.error(t)}return o(a,i),!0}},a=function(e){if(e.name===n){var o=t.getState(),i=function(){var n=t.getState(),i=(0,u.default)(o,n);i.length&&(o=n,e.postMessage({type:r.PATCH_STATE_TYPE,payload:i}))},c=t.subscribe(i);e.onDisconnect.addListener(c),e.postMessage({type:r.STATE_TYPE,payload:o})}};chrome.runtime.onMessage.addListener(c),chrome.runtime.onMessageExternal?chrome.runtime.onMessageExternal.addListener(c):console.warn("runtime.onMessageExternal is not supported"),chrome.runtime.onConnect.addListener(a),chrome.runtime.onConnectExternal?chrome.runtime.onConnectExternal.addListener(a):console.warn("runtime.onConnectExternal is not supported")}},81:function(t,e,n){"use strict";function r(t,e){var n=[];return Object.keys(e).forEach(function(r){t[r]!==e[r]&&n.push({key:r,value:e[r],change:o.DIFF_STATUS_UPDATED})}),Object.keys(t).forEach(function(t){e[t]||n.push({key:t,change:o.DIFF_STATUS_REMOVED})}),n}Object.defineProperty(e,"__esModule",{value:!0}),e.default=r;var o=n(17)},82:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(t){return function(){return function(e){return function(n){var r=t[n.type];return e(r?r(n):n)}}}}},9:function(t,e){function n(t){var e=typeof t;return null!=t&&("object"==e||"function"==e)}t.exports=n}});