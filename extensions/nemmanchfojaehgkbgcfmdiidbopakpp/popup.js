!function(a){function b(d){if(c[d])return c[d].exports;var e=c[d]={i:d,l:!1,exports:{}}
;return a[d].call(e.exports,e,e.exports,b),e.l=!0,e.exports}var c={};b.m=a,b.c=c,b.d=function(a,c,d){
b.o(a,c)||Object.defineProperty(a,c,{configurable:!1,enumerable:!0,get:d})},b.n=function(a){
var c=a&&a.__esModule?function(){return a.default}:function(){return a};return b.d(c,"a",c),c},b.o=function(a,b){
return Object.prototype.hasOwnProperty.call(a,b)},b.p="",b(b.s=55)}([function(a,b){var c=a.exports={version:"2.6.0"}
;"number"==typeof __e&&(__e=c)},function(a,b,c){var d=c(29)("wks"),e=c(17),f=c(2).Symbol,g="function"==typeof f
;(a.exports=function(a){return d[a]||(d[a]=g&&f[a]||(g?f:e)("Symbol."+a))}).store=d},function(a,b){
var c=a.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")()
;"number"==typeof __g&&(__g=c)},function(a,b,c){var d=c(6),e=c(39),f=c(24),g=Object.defineProperty
;b.f=c(7)?Object.defineProperty:function(a,b,c){if(d(a),b=f(b,!0),d(c),e)try{return g(a,b,c)}catch(a){}
if("get"in c||"set"in c)throw TypeError("Accessors not supported!");return"value"in c&&(a[b]=c.value),a}},function(a,b){
var c={}.hasOwnProperty;a.exports=function(a,b){return c.call(a,b)}},function(a,b,c){var d=c(3),e=c(13)
;a.exports=c(7)?function(a,b,c){return d.f(a,b,e(1,c))}:function(a,b,c){return a[b]=c,a}},function(a,b,c){var d=c(12)
;a.exports=function(a){if(!d(a))throw TypeError(a+" is not an object!");return a}},function(a,b,c){
a.exports=!c(8)(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},function(a,b){
a.exports=function(a){try{return!!a()}catch(a){return!0}}},function(a,b,c){var d=c(42),e=c(26);a.exports=function(a){
return d(e(a))}},function(a,b,c){"use strict";function d(a,b){
if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function e(a){if(Array.isArray(a)){
for(var b=0,c=Array(a.length);b<a.length;b++)c[b]=a[b];return c}return Array.from(a)}var f=Object.assign||function(a){
for(var b=1;b<arguments.length;b++){var c=arguments[b]
;for(var d in c)Object.prototype.hasOwnProperty.call(c,d)&&(a[d]=c[d])}return a},g={type:"logger",log:function(a){
this.output("log",a)},warn:function(a){this.output("warn",a)},error:function(a){this.output("error",a)},
output:function(a,b){var c;console&&console[a]&&(c=console)[a].apply(c,e(b))}},h=function(){function a(b){
var c=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};d(this,a),this.init(b,c)}
return a.prototype.init=function(a){var b=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{}
;this.prefix=b.prefix||"i18next:",this.logger=a||g,this.options=b,this.debug=b.debug},a.prototype.setDebug=function(a){
this.debug=a},a.prototype.log=function(){for(var a=arguments.length,b=Array(a),c=0;c<a;c++)b[c]=arguments[c]
;return this.forward(b,"log","",!0)},a.prototype.warn=function(){
for(var a=arguments.length,b=Array(a),c=0;c<a;c++)b[c]=arguments[c];return this.forward(b,"warn","",!0)},
a.prototype.error=function(){for(var a=arguments.length,b=Array(a),c=0;c<a;c++)b[c]=arguments[c]
;return this.forward(b,"error","")},a.prototype.deprecate=function(){
for(var a=arguments.length,b=Array(a),c=0;c<a;c++)b[c]=arguments[c]
;return this.forward(b,"warn","WARNING DEPRECATED: ",!0)},a.prototype.forward=function(a,b,c,d){
return d&&!this.debug?null:("string"==typeof a[0]&&(a[0]=""+c+this.prefix+" "+a[0]),this.logger[b](a))},
a.prototype.create=function(b){return new a(this.logger,f({prefix:this.prefix+":"+b+":"},this.options))},a}();b.a=new h
},function(a,b,c){var d=c(2),e=c(0),f=c(38),g=c(5),h=c(4),i="prototype",j=function(a,b,c){
var k,l,m,n=a&j.F,o=a&j.G,p=a&j.S,q=a&j.P,r=a&j.B,s=a&j.W,t=o?e:e[b]||(e[b]={}),u=t[i],v=o?d:p?d[b]:(d[b]||{})[i]
;o&&(c=b)
;for(k in c)(l=!n&&v&&void 0!==v[k])&&h(t,k)||(m=l?v[k]:c[k],t[k]=o&&"function"!=typeof v[k]?c[k]:r&&l?f(m,d):s&&v[k]==m?function(a){
var b=function(b,c,d){if(this instanceof a){switch(arguments.length){case 0:return new a;case 1:return new a(b);case 2:
return new a(b,c)}return new a(b,c,d)}return a.apply(this,arguments)};return b[i]=a[i],b
}(m):q&&"function"==typeof m?f(Function.call,m):m,q&&((t.virtual||(t.virtual={}))[k]=m,a&j.R&&u&&!u[k]&&g(u,k,m)))}
;j.F=1,j.G=2,j.S=4,j.P=8,j.B=16,j.W=32,j.U=64,j.R=128,a.exports=j},function(a,b){a.exports=function(a){
return"object"==typeof a?null!==a:"function"==typeof a}},function(a,b){a.exports=function(a,b){return{enumerable:!(1&a),
configurable:!(2&a),writable:!(4&a),value:b}}},function(a,b,c){var d=c(41),e=c(30);a.exports=Object.keys||function(a){
return d(a,e)}},function(a,b){a.exports={}},function(a,b){a.exports=!0},function(a,b){var c=0,d=Math.random()
;a.exports=function(a){return"Symbol(".concat(void 0===a?"":a,")_",(++c+d).toString(36))}},function(a,b){
b.f={}.propertyIsEnumerable},function(a,b,c){var d=c(26);a.exports=function(a){return Object(d(a))}},function(a,b,c){
a.exports={default:c(76),__esModule:!0}},function(a,b,c){"use strict";function d(a,b){
if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}var e=function(){function a(){d(this,a),
this.observers={}}return a.prototype.on=function(a,b){var c=this;return a.split(" ").forEach(function(a){
c.observers[a]=c.observers[a]||[],c.observers[a].push(b)}),this},a.prototype.off=function(a,b){var c=this
;this.observers[a]&&this.observers[a].forEach(function(){if(b){var d=c.observers[a].indexOf(b)
;d>-1&&c.observers[a].splice(d,1)}else delete c.observers[a]})},a.prototype.emit=function(a){
for(var b=arguments.length,c=Array(b>1?b-1:0),d=1;d<b;d++)c[d-1]=arguments[d];if(this.observers[a]){
[].concat(this.observers[a]).forEach(function(a){a.apply(void 0,c)})}if(this.observers["*"]){
[].concat(this.observers["*"]).forEach(function(b){b.apply(b,[a].concat(c))})}},a}();b.a=e},function(a,b,c){"use strict"
;function d(a){return null==a?"":""+a}function e(a,b,c){a.forEach(function(a){b[a]&&(c[a]=b[a])})}function f(a,b,c){
function d(a){return a&&a.indexOf("###")>-1?a.replace(/###/g,"."):a}function e(){return!a||"string"==typeof a}
for(var f="string"!=typeof b?[].concat(b):b.split(".");f.length>1;){if(e())return{};var g=d(f.shift())
;!a[g]&&c&&(a[g]=new c),a=a[g]}return e()?{}:{obj:a,k:d(f.shift())}}function g(a,b,c){var d=f(a,b,Object);d.obj[d.k]=c}
function h(a,b,c,d){var e=f(a,b,Object),g=e.obj,h=e.k;g[h]=g[h]||[],d&&(g[h]=g[h].concat(c)),d||g[h].push(c)}
function i(a,b){var c=f(a,b),d=c.obj,e=c.k;if(d)return d[e]}function j(a,b,c){
for(var d in b)d in a?"string"==typeof a[d]||a[d]instanceof String||"string"==typeof b[d]||b[d]instanceof String?c&&(a[d]=b[d]):j(a[d],b[d],c):a[d]=b[d]
;return a}function k(a){return a.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&")}function l(a){
return"string"==typeof a?a.replace(/[&<>"'\/]/g,function(a){return m[a]}):a}b.e=d,b.a=e,b.h=g,b.f=h,b.d=i,b.b=j,b.g=k,
b.c=l;var m={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#x2F;"}},function(a,b,c){a.exports={
default:c(59),__esModule:!0}},function(a,b,c){var d=c(12);a.exports=function(a,b){if(!d(a))return a;var c,e
;if(b&&"function"==typeof(c=a.toString)&&!d(e=c.call(a)))return e
;if("function"==typeof(c=a.valueOf)&&!d(e=c.call(a)))return e
;if(!b&&"function"==typeof(c=a.toString)&&!d(e=c.call(a)))return e
;throw TypeError("Can't convert object to primitive value")}},function(a,b){var c={}.toString;a.exports=function(a){
return c.call(a).slice(8,-1)}},function(a,b){a.exports=function(a){
if(void 0==a)throw TypeError("Can't call method on  "+a);return a}},function(a,b){var c=Math.ceil,d=Math.floor
;a.exports=function(a){return isNaN(a=+a)?0:(a>0?d:c)(a)}},function(a,b,c){var d=c(29)("keys"),e=c(17)
;a.exports=function(a){return d[a]||(d[a]=e(a))}},function(a,b,c){
var d=c(0),e=c(2),f="__core-js_shared__",g=e[f]||(e[f]={});(a.exports=function(a,b){return g[a]||(g[a]=void 0!==b?b:{})
})("versions",[]).push({version:d.version,mode:c(16)?"pure":"global",copyright:"\xa9 2018 Denis Pushkarev (zloirock.ru)"
})},function(a,b){
a.exports="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")
},function(a,b){b.f=Object.getOwnPropertySymbols},function(a,b,c){var d=c(3).f,e=c(4),f=c(1)("toStringTag")
;a.exports=function(a,b,c){a&&!e(a=c?a:a.prototype,f)&&d(a,f,{configurable:!0,value:b})}},function(a,b,c){"use strict"
;var d=c(73)(!0);c(46)(String,"String",function(a){this._t=String(a),this._i=0},function(){var a,b=this._t,c=this._i
;return c>=b.length?{value:void 0,done:!0}:(a=d(b,c),this._i+=a.length,{value:a,done:!1})})},function(a,b,c){b.f=c(1)
},function(a,b,c){var d=c(2),e=c(0),f=c(16),g=c(34),h=c(3).f;a.exports=function(a){
var b=e.Symbol||(e.Symbol=f?{}:d.Symbol||{});"_"==a.charAt(0)||a in b||h(b,a,{value:g.f(a)})}},function(a,b){
a.exports=__virtru_deps["jquery-pack"]},function(a,b,c){"use strict";function d(a){return a&&a.__esModule?a:{default:a}}
var e=c(23),f=d(e),g=c(44),h=d(g),i=c(20),j=d(i),k=c(79),l=d(k),m=c(50),n=d(m),o=c(88),p=c(97),q=c(107),r=c(124),s={
queryLocale:null,setAvailableLocales:function(){var a=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[]
;window.localStorage.setItem("availableLocales",(0,n.default)(a))},getAvailableLocales:function(){
return JSON.parse(window.localStorage.getItem("availableLocales"))||[]},setQueryLocale:function(){
var a=new URLSearchParams(window.location.search).get("virtru-locale");s.queryLocale=q[a]?a:null},
updateUserAvailableLocales:function(){
var a=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],b=s.getAvailableLocales(),c=a.filter(function(a){
return!b.includes(a)});b=[].concat((0,l.default)(b),(0,l.default)(c)),s.setAvailableLocales(b),s.enableLocales(b)},
enableLocales:function(a){(0,j.default)(q).forEach(function(b){q[b].enabled=a.includes(b)})},detectLocale:function(){
return s.getCurrentLanguage()||s.getBrowserLanguage()||"en-US"},canUseLocale:function(a){
return!!q[a]&&!!(s.queryLocale||q[a].published&&s.getAvailableLocales().includes(a))},getBrowserLanguage:function(){
var a=navigator.languages,b=void 0;return a.map(function(a){b=b||r(a,q)}),b},changeLanguage:function(a){
s.canUseLocale(a)||(a="en-US"),o.changeLanguage(a),window.localStorage.setItem("locale",a)},
getLanguagePreference:function(){
var a=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},b=["preferences","orgSettings"],c=!0,d=!1,e=void 0;try{
for(var f,g=(0,h.default)(b);!(c=(f=g.next()).done);c=!0){var i=f.value,j=a[i]
;if(j&&j.locale&&s.canUseLocale(j.locale))return{locale:j.locale,localeTimestamp:j.localeTimestamp||0}}}catch(a){d=!0,
e=a}finally{try{!c&&g.return&&g.return()}finally{if(d)throw e}}},detectGmailLocale:function(a){return r(a,q)},
getCurrentLanguage:function(){return s.queryLocale||window.localStorage.getItem("locale")},
syncCurrentLanguage:function(){var a=s.getCurrentLanguage();s.changeLanguage(a)},init:function(){
return s.setQueryLocale(),o.use(p).init({lng:s.detectLocale(),detection:{
order:["querystring","localStorage","navigator"],lookupQuerystring:"virtru-locale",lookupLocalStorage:"locale",
caches:null},fallbackLng:"en-US",debug:!1,resources:q,returnedObjectHandler:function(a,b,c){return b.message||a}})}
},t=s.init();a.exports=(0,f.default)(t,s)},function(a,b,c){var d=c(61);a.exports=function(a,b,c){if(d(a),
void 0===b)return a;switch(c){case 1:return function(c){return a.call(b,c)};case 2:return function(c,d){
return a.call(b,c,d)};case 3:return function(c,d,e){return a.call(b,c,d,e)}}return function(){
return a.apply(b,arguments)}}},function(a,b,c){a.exports=!c(7)&&!c(8)(function(){
return 7!=Object.defineProperty(c(40)("div"),"a",{get:function(){return 7}}).a})},function(a,b,c){
var d=c(12),e=c(2).document,f=d(e)&&d(e.createElement);a.exports=function(a){return f?e.createElement(a):{}}
},function(a,b,c){var d=c(4),e=c(9),f=c(63)(!1),g=c(28)("IE_PROTO");a.exports=function(a,b){var c,h=e(a),i=0,j=[]
;for(c in h)c!=g&&d(h,c)&&j.push(c);for(;b.length>i;)d(h,c=b[i++])&&(~f(j,c)||j.push(c));return j}},function(a,b,c){
var d=c(25);a.exports=Object("z").propertyIsEnumerable(0)?Object:function(a){return"String"==d(a)?a.split(""):Object(a)}
},function(a,b,c){var d=c(27),e=Math.min;a.exports=function(a){return a>0?e(d(a),9007199254740991):0}},function(a,b,c){
a.exports={default:c(65),__esModule:!0}},function(a,b,c){c(66)
;for(var d=c(2),e=c(5),f=c(15),g=c(1)("toStringTag"),h="CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,TextTrackList,TouchList".split(","),i=0;i<h.length;i++){
var j=h[i],k=d[j],l=k&&k.prototype;l&&!l[g]&&e(l,g,j),f[j]=f.Array}},function(a,b,c){"use strict"
;var d=c(16),e=c(11),f=c(47),g=c(5),h=c(15),i=c(69),j=c(32),k=c(72),l=c(1)("iterator"),m=!([].keys&&"next"in[].keys()),n="keys",o="values",p=function(){
return this};a.exports=function(a,b,c,q,r,s,t){i(c,b,q);var u,v,w,x=function(a){if(!m&&a in B)return B[a];switch(a){
case n:case o:return function(){return new c(this,a)}}return function(){return new c(this,a)}
},y=b+" Iterator",z=r==o,A=!1,B=a.prototype,C=B[l]||B["@@iterator"]||r&&B[r],D=C||x(r),E=r?z?x("entries"):D:void 0,F="Array"==b?B.entries||C:C
;if(F&&(w=k(F.call(new a)))!==Object.prototype&&w.next&&(j(w,y,!0),d||"function"==typeof w[l]||g(w,l,p)),
z&&C&&C.name!==o&&(A=!0,D=function(){return C.call(this)}),d&&!t||!m&&!A&&B[l]||g(B,l,D),h[b]=D,h[y]=p,r)if(u={
values:z?D:x(o),keys:s?D:x(n),entries:E},t)for(v in u)v in B||f(B,v,u[v]);else e(e.P+e.F*(m||A),b,u);return u}
},function(a,b,c){a.exports=c(5)},function(a,b,c){
var d=c(6),e=c(70),f=c(30),g=c(28)("IE_PROTO"),h=function(){},i="prototype",j=function(){
var a,b=c(40)("iframe"),d=f.length,e="<",g=">";for(b.style.display="none",c(71).appendChild(b),b.src="javascript:",
a=b.contentWindow.document,a.open(),a.write(e+"script"+g+"document.F=Object"+e+"/script"+g),a.close(),
j=a.F;d--;)delete j[i][f[d]];return j()};a.exports=Object.create||function(a,b){var c;return null!==a?(h[i]=d(a),
c=new h,h[i]=null,c[g]=a):c=j(),void 0===b?c:e(c,b)}},function(a,b,c){var d=c(75),e=c(1)("iterator"),f=c(15)
;a.exports=c(0).getIteratorMethod=function(a){if(void 0!=a)return a[e]||a["@@iterator"]||f[d(a)]}},function(a,b,c){
a.exports={default:c(87),__esModule:!0}},function(a,b,c){"use strict";b.a={processors:{},addPostProcessor:function(a){
this.processors[a.name]=a},handle:function(a,b,c,d,e){var f=this;return a.forEach(function(a){
f.processors[a]&&(b=f.processors[a].process(b,c,d,e))}),b}}},function(a,b){a.exports={
ACTIVATE_FOR_ATTACHMENTS:'You must activate with Virtru prior to being able to secure attachments.\n\nTo activate click the "Activate" button below.',
ACTIVATION_BUTTON_ACTIVATE:"Activate {{currentUser}}",ACTIVATION_BUTTON_REACTIVATE:"Reactivate {{currentUser}}",
ACTIVATION_HEADER_USER_NOT_ACTIVATED:"{{currentUser}} is not activated to use Virtru",ACTIVATION_LINK:"How it works",
ACTIVATION_SUBTEXT:"To protect your privacy, we periodically need to verify your identity. It just takes a minute, just click to reactivate.",
ACTIVATION_TEXT_ACTIVATE:"ACTIVATE VIRTRU TO<br>COMPOSE SECURE EMAILS",
ACTIVATION_TEXT_REACTIVATE:"REACTIVATE VIRTRU TO CONTINUE",
ACTIVATION_WAIT_CANCELED:"Virtru was unable to authenticate your email account because the authentication tab was closed.<br/><br/>Click the 'Try Again' link below to restart the process",
ACTIVATION_WAIT_ERROR:"Virtru - Could Not Authenticate",
ACTIVATION_WAIT_FAILED:'Virtru was unable to authenticate your email account because your current browser settings do not allow cookies to be created, or because you denied Virtru\'s request to verify your email address.</br><br/>The authentication process requires cookies. If you have changed your browser\'s default cookie settings, please configure your browser to allow all cookies, then click the "Try Again" button. When your account has been authenticated, you may reactivate the cookie restrictions and continue to use Virtru.</br><br/>Virtru requests the "See your email address" permission from your webmail provider to verify that you own the account you are activating. For more information about how we use your email address, please see our <a href="https://www.virtru.com/terms-of-service" target="_blank">Terms of Service<a/> and <a href="https://www.virtru.com/privacy-policy" target="_blank">Privacy Policy</a>. Please click the "Try Again" button to grant this permission.',
ACTIVATION_WAIT_HEADER:"Virtru - Authenticating...",
ACTIVATION_WAIT_IN_PRIVATE:'Virtru was unable to authenticate your email account because your browser is in private mode, also known as "incognito" or "InPrivate" mode. The authentication process requires cookies, which are restricted in private mode.</br><br/>To continue, please disable private mode and return to your webmail window or tab to restart the authentication process.</br><br/>When your account has been authenticated, you may re-enable private mode and continue to use Virtru.',
ACTIVATION_WAIT_MESSAGE:"Virtru is still authenticating your email account on this browser. Until you complete authentication, you will not be able to send or read secure messages.</br><br/>Please return to the authentication tab and complete the authentication process.",
ANIMATION_WIDGET_LOADING_TEXT:"Decrypting Email...",
ATTACHMENTS_UPLOADING_NO_SEND:"Uploading attachments must complete before being able to send.",
ATTACHMENT_ANIMATION_LABEL:"Encrypting Attachment(s)",ATTACHMENT_APPID_ERROR_HEADER:"Activation Expired",
ATTACHMENT_APPID_ERROR_TEXT:"Your activation has expired so we can't upload your attachment. For your security, please refresh the page and try again.",
ATTACHMENT_APPID_ERROR_TITLE:"Attachment Error",ATTACHMENT_CONNECTION_ERROR_HEADER:"No network connection",
ATTACHMENT_CONNECTION_ERROR_TEXT:"There was a problem uploading your attachment. Please check your connection and try again.",
ATTACHMENT_CONNECTION_ERROR_TITLE:"Attachment Error",
ATTACHMENT_ERROR_CORRUPT:"The attachment is corrupt and cannot be decrypted. Please ask the sender to resend the attachment.",
ATTACHMENT_ERROR_EXPIRED:"The expiration date for this file has passed. Access to the file is no longer allowed.",
ATTACHMENT_ERROR_REVOKED:"Access to this file has been revoked by the sender.",
ATTACHMENT_ERROR_UNAUTHORIZED:"You are not authorized to have access to this file.",
ATTACHMENT_ERROR_UNKNOWN:"An error has occurred and Virtru is unable to download or decrypt this file. Please try again later.",
ATTACHMENT_GENERIC_ERROR_BUTTON:"Dismiss",ATTACHMENT_GENERIC_ERROR_HEADER:"Attachment Error",
ATTACHMENT_GENERIC_ERROR_TEXT:"There was a problem uploading your attachment. Please check your connection and try again.",
ATTACHMENT_GENERIC_ERROR_TITLE:"Error",
ATTACHMENT_INTEGRITY_COMPROMISED:"Virtru cannot decrypt this attachment.\n\nThis situation usually occurs when a message's ciphertext has been modified, thus making the encryption unreadable.",
ATTACHMENT_NOT_READY_ERROR:"Attachment not ready",ATTACHMENT_TOO_LARGE_HEADER:"An attachment is too large",
ATTACHMENT_TOO_LARGE_TEXT:"One or more of your attachments was too large to be encrypted.  Please attach files that are under {{maxSizeMb}} MB.",
ATTACHMENT_TOO_LARGE_TITLE:"Attachment Too Large",CANNOT_DECRYPT_GET_HELP:"Learn more about this in Virtru's FAQ.",
CANNOT_DECRYPT_HEADER:"Possibly Altered Message",
CANNOT_DECRYPT_MESSAGE_CKS:'The {{ownerName}} encryption server is unreachable.<br/>For help, <a href="{{ownerSupportUrl}}">contact the<br/>{{ownerName}} support desk</a>.',
CANNOT_DECRYPT_MESSAGE_INTEGRITY_COMPROMISED:'Virtru has detected that this message may have been tampered with. Try asking <span class="vic-message-bold">{{sender}}</span> to resend the message.',
CHROME_POPUP_ABOUT_VIRTRU_BUTTON:"About Virtru",
CHROME_POPUP_ACTIVATION_BUTTON:"Activate Virtru for <code>{{userId}}</code>",
CHROME_POPUP_ACTIVATION_LABEL:"Using Virtru with {{userId}}",CHROME_POPUP_LOGOUT_BUTTON:"Logout",
CHROME_POPUP_SETTINGS_BUTTON:"Settings",CHROME_POPUP_SUPPORT_BUTTON:"Support",CHROME_POPUP_UNINSTALL_BUTTON:"Uninstall",
COMMON_CANCEL:"Cancel",COMMON_OK:"OK",COMMON_SAVE_CHANGES:"SAVE CHANGES",COMMON_SEND:"Send",
COMMON_SEND_SECURE:"Secure Send",COMMON_TRY_AGAIN:"Try Again",COMPOSE_ACTIVATION_REQUIRED:"Virtru requires activation",
COMPOSE_ATTACHMENTS_ON_REMOVE:"If secure mode is turned on all existing attachments will be removed and must be reattached.  Are you sure you want to do this?",
COMPOSE_ATTACHMENTS_REMOVE_WARN:"Attachments must be removed before switching Virtru protection on.",
COMPOSE_ATTACHMENTS_UPLOADING_WARN:"Secure mode cannot be toggled while attachments are uploading.  Please wait until attachments are finished uploading and then toggle secure mode.",
COMPOSE_DRIVE_ATTACHMENTS_UNSUPPORTED:"Virtru does not currently support Drive attachments. Would you like to remove them?",
COMPOSE_EXPIRES:"expires {{timeRemaining}}",
COMPOSE_INLINE_IMAGES_NOT_SUPPORTED:"Inline attachments currently aren't supported by Virtru. Would you like to remove them?",
COMPOSE_INSERT_DRIVE_INSERT_FILE:"Inserting files from Google Drive is not supported in secure mode.",
COMPOSE_INSERT_PHOTOS_INLINE_IMAGES:"Currently, Virtru does not support inline images.",
COMPOSE_OFF_CONFIRM_REMOVE:"If secure mode is turned off all secure attachments will be removed.  Are you sure you want to do this?",
COMPOSE_ONBOARDING1_BUTTON_NEXT:"Next",COMPOSE_ONBOARDING1_STEP1_DESCRIPTION:"Turn on Virtru Security",
COMPOSE_ONBOARDING1_STEP1_FOOTER:"When you create or reply to an email, make sure to turn on Virtru security switch on the top right of the compose field to protect and encrypt your message and its attachments.",
COMPOSE_ONBOARDING1_STEP2_DESCRIPTION:"Customize your security message",
COMPOSE_ONBOARDING1_STEP2_FOOTER:'Once you\'ve composed your secure message, simply hit the "Send Secure" button to deliver your protected email.',
COMPOSE_ONBOARDING1_TITLE:"Welcome! Let's get started...",COMPOSE_ONBOARDING2_BUTTON_DONE:"Done",
COMPOSE_ONBOARDING2_STEP3_DESCRIPTION:"Customize your security message",
COMPOSE_ONBOARDING2_STEP3_FOOTER:"When someone recieves a secured email from you for the first time, they will see this security mesage. It will ensure that your colleagues understand how to open your secured messages. Feel free to customize it, or leave it as is.",
COMPOSE_ONBOARDING2_STEP3_PREFIX:"Hi! I'm using Virtru to secure my emails. You will need to click the link below and install the proper software to securely view my message. Contact me if you wish to verify the origin of this email.",
COMPOSE_ONBOARDING2_TITLE:"Almost Done...",CONTENT_IS_MANAGED:"The sender has disabled download for this file.",
CONTEXTUAL_ACTIVATE_INFO:"The account {{currentUser}} has not been activated with Virtru.  Once activated, your identity is verified and Virtru sends you the keys to decrypt your secure messages.  Virtru never has access to any of your content.",
DISMISS_POPOVER_DEFAULT_OPTIONS_TEXT:"Ok, got it.",DOWNLOAD_ATTACHMENT_DECRYPTING:"Decrypting",
EDITOR_FRAME_MESSAGE_BANNER:"Your email is secure.",
EMAIL_ERROR_EMAIL_CORRUPT:"The message is corrupt and cannot be decrypted. Please ask the sender to resend the message.",
EMAIL_ERROR_EMAIL_CORRUPT_HEADER:"Email Corrupt",
EMAIL_ERROR_INTEGRITY_COMPROMISED:"The integrity of this message has been compromised.",
EMAIL_ERROR_INTEGRITY_COMPROMISED_HEADER:"Integrity Compromised Error",
EMAIL_ERROR_INTERNAL_SERVER_ERROR:"Virtru's servers did not respond. Please wait a few minutes and try again.",
EMAIL_ERROR_INTERNAL_SERVER_ERROR_HEADER:"Server Error",
EMAIL_ERROR_NETWORK_LOST:"Virtru could not connect to the internet. Please check your internet connection and try again.",
EMAIL_ERROR_NETWORK_LOST_HEADER:"Network Connection Error",
EMAIL_ERROR_READ:"The message could not be decrypted. Please check your internet connection and try again.",
EMAIL_ERROR_READ_HEADER:"Decryption Failure",
EMAIL_ERROR_SEND:"An error occurred and the message could not be sent. Please check your internet connection and try again.",
EMAIL_ERROR_SEND_ENCRYPT_FAILED:"An error occurred and the message could not be encrypted. Please check your internet connection and try again.",
EMAIL_ERROR_SEND_ENCRYPT_FAILED_HEADER:"Encryption Error",EMAIL_ERROR_SEND_HEADER:"Unknown Error",
EMAIL_ERROR_SMART_SEND_SECURE:"An error occurred when attempting to send your message. Please contact Virtru if the problem persists.",
EMAIL_ERROR_SMART_SEND_SECURE_HEADER:"Error Sending",EMAIL_ERROR_TEMPLATE_SUPPORT_LINK:"Virtru Support",
EMAIL_ERROR_UNKNOWN:"An error occurred and the message could not be read. Please check your internet connection and try again.",
EMAIL_ERROR_UNKNOWN_HEADER:"Unknown Error",
EMAIL_ERROR_YOURE_ON_STAGING:"Whoa there cowboy... looks like you're trying to get tricky and read an e-mail from the wrong server (staging/production). Check the options page to see which server you're pointing to.. you might just be pointing to the wrong one.",
EMAIL_ERROR_YOURE_ON_STAGING_HEADER:"Whoa there cowboy... looks like you're trying to get tricky and read an e-mail from the ",
EMAIL_EXPIRATION:"Expires in:",EMAIL_EXPIRATION_RESET:"Expiration Date:",
EMAIL_INVALID_ADDRESS:'The address "{{invalidAddress}}" was not recognized. Please make sure that all addresses are properly formed.',
EMAIL_INVALID_ADDRESS_GENERIC:"One or more email addresses were not recognized. Please make sure that all addresses are properly formed.",
EMAIL_TEMPLATE_FOOTER:"Secured by Virtru",EMAIL_TEMPLATE_SENDER_HEADER:"Your message, protected by Virtru",
ENCRYPTED_SEARCH_REMINDER_HEADER:"Encrypted Search will not appear in your search results.",
ENCRYPTED_SEARCH_REMINDER_SUBTEXT:"Searching of Virtru-encrypted message bodies is not currently enabled. Click here to enable.",
ENHANCEDPDF_DL_DISABLED_TOOLTIP:"The sender has disabled download for this file. Click below to view it in Virtru's Secure Reader.",
ENHANCEDPDF_DL_DISABLED_TOOLTIP_TITLE:"Enhanced PDF Protection",FEATURE_ENCRYPTED_SEARCH_BUTTON:"Enable From Dashboard",
FEATURE_ENCRYPTED_SEARCH_CANCEL:"Not Right Now",FEATURE_ENCRYPTED_SEARCH_FAQ:"Learn more in our FAQ",
FEATURE_ENCRYPTED_SEARCH_POPUP_DESCRIPTION:"To enable search for your Virtru-encrypted emails, click below to go to the 'Features' tab of your Virtru Dashboard.",
FEATURE_ENCRYPTED_SEARCH_POPUP_HEADER:"New Feature",FEATURE_ENCRYPTED_SEARCH_TITLE_TEXT:"Search Your Encrypted Emails",
FEATURE_VAULT_ACTION_UPDATE_CANCEL:"Close Window",
FEATURE_VAULT_ACTION_UPDATE_POPUP_DESCRIPTION:"Purchasing Google Vault Support requires help from a Virtru support representative. We'll contact you shortly.",
FEATURE_VAULT_ACTION_UPDATE_TITLE_TEXT:"We'll be in touch soon",FEATURE_VAULT_BUTTON:"Get Vault Support",
FEATURE_VAULT_CANCEL:"No Thanks",
FEATURE_VAULT_POPUP_DESCRIPTION:"You can now conduct searches of encrypted emails and decrypt them directly within Google Vault. Click below to contact a Virtru rep and purchase Virtru's Google Vault E-Discovery Support for your domain.",
FEATURE_VAULT_POPUP_HEADER:"New Feature",FEATURE_VAULT_TITLE_TEXT:"Search Virtru Emails in Google Vault",FILE_SIZES:{
BYTES:"B",UNITS:["kb","mb","gb","tb","pb","eb","zb","yb"]},FIRST_TIME_ONBOARD_LINK_ACTIVATE:"Activate",
FOOTER_POPOVER_BODY:"Let your friends and colleagues know they can email you securely with Virtru.",
FOOTER_POPOVER_HEADER:"Communicate Privately",FOOTER_POPOVER_REMOVE_SIGNATURE:" Remove from my email signature ",
FOOTER_PROMO:"Need to send me private email? I use",FOOTER_PROMO_USE:"Virtru",
FORWARDING_RESTRICTED:"- Forwarding Restricted",
GMAIL_BASIC_MODE_UNSUPPORTED_MAIN:"Gmail's basic HTML view not supported",
GMAIL_BASIC_MODE_UNSUPPORTED_SUB:"Please switch to standard view to use Virtru.",
INTEGRITY_SECURITY_NOTICE:"Security Notice",INTEGRITY_SENDER_CONTINUE:"I still want to read this message",
INTEGRITY_SENDER_ERROR:'\n<p>This email was sent by <span class="virtru-sender-integrity-fail-message-bold">{{expected}}</span>, \nbut it was delivered by <span class="virtru-sender-integrity-fail-message-bold">{{got}}</span>.</p>\n<p>If you do not trust <span class="virtru-sender-integrity-fail-message-bold">{{got}}</span>, \nDO NOT click on any links or attachments.</p>',
INTEGRITY_SUBJECT_ERROR:'<p>This email was sent with the subject <span class="virtru-sender-integrity-fail-message-bold">{{expected}}</span>,\n    but it now displays <span class="virtru-sender-integrity-fail-message-bold">{{got}}</span>.</p>\n    <p>If you do not trust the sender of this message, DO NOT click on any links or attachments.</p>',
INTRO_MESSAGE_FOOTER_TEXT:"Text above this line will not be encrypted.",
INVITATION_EMAIL_REPLACE_TEXT_DEFAULT:"This is a secure message chain, protected by Virtru.",LEARN_MORE:"Learn More",
MOMENT_CALENDAR_POLICY_CONFIG_FULL_DATE:{lastDay:"dddd[,] MMM Do[,] YYYY [@] LT",
lastWeek:"dddd[,] MMM Do[,] YYYY [@] LT",nextDay:"dddd[,] MMM Do[,] YYYY [@] LT",
nextWeek:"dddd[,] MMM Do[,] YYYY [@] LT",sameDay:"dddd[,] MMM Do[,] YYYY [@] LT",
sameElse:"dddd[,] MMM Do[,] YYYY [@] LT"},MOMENT_CALENDAR_RECIPIENT_EXPIRATION:{lastDay:"[at] LT [yesterday]",
lastWeek:"[at] LT [last] dddd",nextDay:"[at] LT [tomorrow]",nextWeek:"[at] LT [on] dddd",sameDay:"[at] LT [today]",
sameElse:"[at] LT [on] dddd[,] MMM Do[,] YYYY"},MOMENT_CALENDAR_SENDER_EXPIRED:{lastDay:"[yesterday at] LT",
lastWeek:"[last] dddd [at] LT",nextDay:"[tomorrow at] LT",nextWeek:"[on] dddd [at] LT",sameDay:"[today at] LT",
sameElse:"[on] dddd[,] MMM Do[,] YYYY [at] LT"},MOMENT_CALENDAR_SENDER_EXPIRING_SOON:{lastDay:"LT [yesterday]",
lastWeek:"LT [last] dddd",nextDay:"LT [tomorrow]",nextWeek:"LT [on] dddd",sameDay:"LT [today]",
sameElse:"LT [on] dddd[,] MMM Do[,] YYYY"},NB_INTEGRITY_GO_TO_FAQS:"Read Virtru's FAQ to learn more about this issue",
NB_INTEGRITY_HEADER:"Security Notice:",NB_INTEGRITY_MESSAGE:"Beware of links and attachments in this message.",
NB_INTEGRITY_SENDER_DETAILS:'\n<p>\n  This email was sent by <span class="vnb-details-bold">{{expected}}</span>, but it was delivered by\n  <span class="vnb-details-bold">{{got}}</span>.\n</p>\n<p>\n  If you do not trust <span class="virtru-sender-integrity-fail-message-bold">{{got}}</span>, \n  DO NOT click on any links or attachments.\n</p>',
NB_INTEGRITY_SUBJECT_DETAILS:'\n<p>\n  This email was sent with the subject <span class="vnb-details-bold">{{expected}}</span>,\n  but it now displays <span class="vnb-details-bold">{{got}}</span>.\n</p>\n<p>\n  If you do not trust the sender of this message, DO NOT click on any links or attachments.\n</p>',
NB_NON_SECURE_FORWARD_DETAILS:'<p>This usually happens when someone forwards an encrypted email without\n  turning Virtru on. As a result, we can validate the integirty of the encrypted content, but not the message\n  in which this content was embedded.\n</p>\n<p>This unvalidated message was sent by <span class="vnb-details-bold">{{sender}}</span>. If you do not know\n  this person, DO NOT click on any links or attachments in this message.\n</p>\n<p>To avoid this in the future, make sure your senders turn Virtru on when forwarding emails that have already\n  been encrypted.\n</p>',
NB_NON_SECURE_FORWARD_HEADER:"Warning:",NB_NON_SECURE_FORWARD_LEARN_MORE:"Click to learn more.",
NB_NON_SECURE_FORWARD_MESSAGE:"Use caution with links and attachments.",
NESTED_MESSAGE_PLACEHOLDER_TEXT_DEFAULT:"Show last secure message",
NESTED_MESSAGE_PLACEHOLDER_TEXT_LOADING:"Loading secure message...",NEW_COMPOSE_ARCHIVE_SEND:"Send +",
NEW_COMPOSE_ARCHIVE_SEND_SECURE:"Secure Send +",
NEW_COMPOSE_DISABLED_WHILE_SECURING:"Disabled while securing message (and attachments)",
NOTIFICATION_BAR_HIDE_DETAILS:"Hide Details",NOTIFICATION_BAR_SHOW_DETAILS:"Show Details",OKGOTIT:"OK, GOT IT!",
ONBOARDING_LABEL_COMPLETE:"TUTORIAL<br>COMPLETE",ONBOARDING_LABEL_START:"GETTING<br>STARTED",
ONBOARDING_POPOVERS_CLOSE:"CLOSE WINDOW",ONBOARDING_POPOVERS_SKIP:"Skip, I already know how to use Virtru",
ONBOARDING_POPOVER_1_LARGE_HEADER:"To send a secure message, click Compose as usual.",
ONBOARDING_POPOVER_1_SMALL_HEADER:"Step 1 of 4",
ONBOARDING_POPOVER_2_LARGE_HEADER:"Turn on Virtru by clicking the switch.",
ONBOARDING_POPOVER_2_SMALL_HEADER:"Step 2 of 4",ONBOARDING_POPOVER_3_LARGE_HEADER:"Activate your email address.",
ONBOARDING_POPOVER_3_SMALL_HEADER:"Step 3 of 4",
ONBOARDING_POPOVER_4_BODY_TEXT:"Introduce your secure message - and Virtru - by adding a short note here.<br><br>This text won't be encrypted - use it to confirm your identity or explain why you're sending securely.",
ONBOARDING_POPOVER_4_LARGE_HEADER:"Add a personalized introduction.",ONBOARDING_POPOVER_4_SMALL_HEADER:"Step 4 of 4",
ONBOARDING_POPOVER_5_BODY_TEXT:'When you\'re ready to send a message, click Secure Send.<br><br>After you\'ve sent, you can manage security settings by clicking the message in your Sent Mail folder, or in the <a href="https://secure-develop01.virtru.com/dashboard/" target="_blank">Dashboard</a>.<br><br>Thanks for using Virtru. <a href="https://www.virtru.com/contact-support/" target="_blank">Let us know</a> if you have any questions.',
ONBOARDING_POPOVER_5_LARGE_HEADER:"Send with confidence.",ONBOARDING_POPOVER_5_SMALL_HEADER:"Tutorial complete",
ONBOARDING_SECURITY_BAR:'Hey, this is new! We\'ve added a Virtru security bar for you. Click the switch to turn on protection. <a href="https://www.virtru.com/how-it-works" target="_blank">Learn more</a>',
ONBOARDING_TEXTAREA_VAL:"Hi! I'm using Virtru to secure my emails. You will need to click the link below and install the proper software to securely view my message. Contact me if you wish to verify the origin of this email.",
ONE_CLICK_OPTION:"Enable One-Click",PAGE_ACTIONS_FORMAT_NON_PROD_MESSAGE:"This message was sent using {{acmUrl}}",
PERSONAL_INTRO_ADD:'Customize Intro <div class="virtru-intro-message-toggle-arrow"></div>',
PERSONAL_INTRO_DEFAULT_TEXT:"Hello! I'm using Virtru to send and receive secure email. Click the link below to read my message. If you have any questions, please contact me.",
PERSONAL_INTRO_ONBOARD:"Add an unencrypted personal introduction to your private email.  This lets recipients know that your message is genuine and not spam.",
PERSONAL_INTRO_PLACEHOLDER_TEXT:"[Enter your intro message here. Include information that only your recipient would know, or write it in such a way that they know it's really you.]",
PLAINTEXT_NOT_SUPPORTED_HEADER:"Plaintext mode is not supported",
PLAINTEXT_NOT_SUPPORTED_TEXT:"Please turn off plaintext mode before continuing.",
PLAINTEXT_NOT_SUPPORTED_TITLE:"Send Failed",
POLICY_BANNER_DAYS_REMAINING_PLURAL:"{{daysRemaining}} Days Left to Try Pro Features",
POLICY_BANNER_DAYS_REMAINING_SINGLE:"1 Day Left to Try Pro Features",
POLICY_BANNER_UPGRADE_TEXT:"Get Virtru Pro Features",POLICY_MENU_DISABLE_FORWARDING:"Disable Forwarding",
POLICY_MENU_NOTICE_UPGRADE:"Upgrade Now",POLICY_MENU_UPGRADE:"Click to upgrade!",
POLICY_MENU_WATERMARKING:"PDF Watermarking",POPUP_BASE_CONTACT_ADMIN:"Contact your administrator to adjust this rule",
POPUP_BASE_DASHBOARD_LINK:"Edit your rules on the Dashboard",
READ_RECEIPT_FORWARD_COUNT_DETAILS:"(click for more details)",RECIPIENT_WIDGET_EXPIRATION_DATE:"Expires {{datetime}}",
RECIPIENT_WIDGET_EXPIRED:"This message has expired",RECIPIENT_WIDGET_EXPIRED_BODY:"ACCESS EXPIRED",
RECIPIENT_WIDGET_EXPIRED_DATE:"This message expired {{datetime}}",
RECIPIENT_WIDGET_HEADER:"You are reading a secure message, protected by Virtru",
RECIPIENT_WIDGET_NO_EXPIRATION:"No expiration date",RECIPIENT_WIDGET_OFFLINE_BODY:"LOST INTERNET CONNECTION",
RECIPIENT_WIDGET_OFFLINE_HEADER:"Access to secure messages is not allowed without an internet connection.",
RECIPIENT_WIDGET_REVOKED_BODY:"ACCESS REVOKED",RECIPIENT_WIDGET_REVOKED_HEADER:"The author has removed your access",
RECIPIENT_WIDGET_UNAUTHORIZED_BODY:"THIS EMAIL ADDRESS IS NOT AUTHORIZED TO VIEW THIS EMAIL",
RECIPIENT_WIDGET_UNAUTHORIZED_HEADER:"This email address is not authorized to read this email",
RESTORE_DRAFT_FAILED:"There was a problem restoring this draft. Please check your network connection and try again.",
SCREENREADER_CLOSED_POLICY_MENU:"Closed policy menu",SCREENREADER_DISABLED_COPY_PASTE:"Disabled copy paste",
SCREENREADER_DISABLED_EXPIRATION:"Disabled expiration",SCREENREADER_DISABLED_FORWARDING:"Disabled forwarding",
SCREENREADER_DISABLED_ONECLICK:"Disabled one-click",SCREENREADER_DISABLED_PRINTING:"Disabled printing",
SCREENREADER_DISABLED_WATERMARK_PDF:"Disabled watermark PDF",SCREENREADER_DISABLE_COPY_PASTE:"Disable copy paste",
SCREENREADER_DISABLE_FORWARDING:"Disable forwarding",SCREENREADER_DISABLE_PRINT:"Disable print",
SCREENREADER_ENABLED_COPY_PASTE:"Enabled copy paste",SCREENREADER_ENABLED_EXPIRATION:"Enabled expiration",
SCREENREADER_ENABLED_FORWARDING:"Enabled forwarding",SCREENREADER_ENABLED_ONECLICK:"Enabled one-click",
SCREENREADER_ENABLED_PRINTING:"Enabled printing",SCREENREADER_ENABLED_WATERMARK_PDF:"Enabled watermark PDF",
SCREENREADER_EXPIRATION:"Expiration set",SCREENREADER_ONECLICK:"Enable one-click",
SCREENREADER_OPENED_POLICY_MENU:"Opened policy menu",SCREENREADER_VIRTRU_POLICY_MENU:"Virtru policy menu",
SCREENREADER_VIRTRU_SECURE_TOGGLE:"Virtru secure toggle",SCREENREADER_WATERMARK_PDF:"Watermark PDF",
SECURE_EMAIL_COMPOSER_PLACEHOLDER_HTML:"The email chain has been secured by Virtru.",
SECURE_EMAIL_COMPOSER_POLICY_OPTIONS_DEFAULT:"(No Subject)",SECURE_MESSAGE_CONTROL_ENABLE:"Enable",
SECURE_MESSAGE_CONTROL_REVOKE:"Revoke",SECURE_MESSAGE_LABEL:"You are reading a secured message",
SENDER_WIDGET_ERROR_ENABLE_MESSAGE:"There was an error processing enabling this message.",
SENDER_WIDGET_ERROR_REVOCATION:"There was an error processing the revocation.",
SENDER_WIDGET_ERROR_UPDATE_POLICY:"There was an error updating the policy.",
SENDER_WIDGET_EXPIRED_DATE:"Expired {{datetime}}",SENDER_WIDGET_EXPIRES_DATE:"Expires {{datetime}}",
SENDER_WIDGET_MESSAGE_REVOKED:"This message has been revoked",SENDER_WIDGET_NO_EXPIRATION:"No expiration date",
SENDER_WIDGET_REVOKED_DATE:"Revoked {{datetime}}",SEND_ANIMATION_LOADING_TEXT:"Encrypting Email...",
SEND_BLOCK_HEADER:"Violation Detected",
SEND_BLOCK_SUBTEXT:" According to your organization's content security policy, this email contains sensitive information and cannot be sent. Please remove any sensitive data, and try again.",
SEND_ENCRYPT_BUTTON_SEND_SECURE:"Send Secure",SEND_ENCRYPT_HEADER:"Encryption Enabled",
SEND_ENCRYPT_SUBTEXT:" This email contains sensitive information. According to your organization's settings, you must send this type of information securely. Click send secure to proceed, or cancel to make changes.",
SEND_WARNING_BUTTON_SEND:"SEND",SEND_WARNING_BUTTON_SEND_SECURE:"SEND SECURE",
SEND_WARNING_CANCEL:"Cancel, I want to edit my email",SEND_WARNING_RULE_NAME:"Sensitive Items Found",
SMART_SEND_SECURE_BUTTON_SEND:"Send +",SMART_SEND_SECURE_BUTTON_SEND_SECURE:"Send +",
SMART_SEND_SECURE_BUTTON_SEND_SECURE_CHILD:"Secure",SMART_SEND_SECURE_VIOLATONS_HIDE:"Hide",
SMART_SEND_SECURE_VIOLATONS_SHOW:"{{number}} more (show)",TOOLTIP_DISABLE_COPY_PASTE:"Disable Copy/Paste",
TOOLTIP_DISABLE_FORWARDING:"Disable Forwarding",TOOLTIP_DISABLE_PRINT:"Disable Print",
TOOLTIP_EXPIRATION:"Expiration Date",TOOLTIP_FORWARDING_RESTRICTED:"Forwarding Restricted",
TOOLTIP_FORWARDING_RESTRICTED_CONTENT:"Forwarding has been restricted on a secure message in the chain.  Recipients added to your message may not be able to access the forwarded message.  The owner of the secure message must allow access to new recipients.",
TOOLTIP_GOOGLE_DRIVE_SECURE_ATTACHMENT_CONTENT:"Click this icon to turn this feature off.",
TOOLTIP_GOOGLE_DRIVE_SECURE_ATTACHMENT_TITLE:"Virtru Secure Attachment, uploaded to Google Drive.",
TOOLTIP_ONE_CLICK:"One-Click",
TOOLTIP_REAUTHORIZE_BUTTON_CONTENT:"This message was revoked previously. Reauthorizing it will let people see it again.",
TOOLTIP_REAUTHORIZE_BUTTON_TITLE:"Reauthorize Message",
TOOLTIP_RECIPIENT_DISABLE_COPY_PASTE:"This Virtru-secured message has been restricted by its sender. You may not use copy/paste functionality.",
TOOLTIP_RECIPIENT_DISABLE_FORWARDING:"This Virtru-secured message has been restricted from forwarding by its sender.",
TOOLTIP_RECIPIENT_DISABLE_PRINT:"This Virtru-secured message has been restricted by its sender. You may not print it.",
TOOLTIP_RECIPIENT_EXPIRATION:"This Virtru-secured message expires {{date}}. To view this message after it expires, contact the sender.",
TOOLTIP_RECIPIENT_ONE_CLICK:"This Virtru-secured message does not require authorization to read.",
TOOLTIP_RECIPIENT_UNAUTHORIZED_INFO:"The original author of this email has restricted access to this message. Therefore, if you did not directly receive this message from the original author, you may not view its contents.<br><br>To get access, contact the original author.",
TOOLTIP_REVOKE_BUTTON_CONTENT:"Disables access to your message. Other than you, no one will be able to see this message.",
TOOLTIP_REVOKE_BUTTON_TITLE:"Revoke Message",
TOOLTIP_SECURE_ATTACHMENT_CONTENT:"{{filename}} has been secured by Virtru",
TOOLTIP_SECURE_ATTACHMENT_DOWNLOAD:"Decrypt & Download",
TOOLTIP_SECURE_ATTACHMENT_DRIVE:"Save to Google Drive\nnot Virtru supported",
TOOLTIP_SECURE_ATTACHMENT_TITLE:"Virtru Secure Attachment",
TOOLTIP_SENDER_DISABLE_COPY_PASTE_CONTENT:"Your recipients will not be able to copy content from your message.",
TOOLTIP_SENDER_DISABLE_FORWARDING_CONTENT:"Your recipients will not be able to forward your message.",
TOOLTIP_SENDER_DISABLE_PRINT_CONTENT:"Your recipients will not be able to print your message.",
TOOLTIP_SENDER_EXPIRATION_CONTENT:"After {{date}}, your recipients will no longer have access to your message.",
TOOLTIP_SENDER_EXPIRATION_CONTENT_EXPIRED:"Your message expired {{date}}. Your recipients can no longer view this content. To re-enable viewing, remove or reset the expiration date.",
TOOLTIP_SENDER_EXPIRATION_CONTENT_NO_DATE:"Specify an expiration date.  After this time, your recipients will no longer have access to your message.",
TOOLTIP_SENDER_ONE_CLICK_CONTENT:"Your recipients do not require authorization to read your message.",
TOOLTIP_TOGGLE_DISABLED:"You are not authorized to send securely.  Please contact your administrator if you have any questions.",
TOOLTIP_TOGGLE_OFF:"Protect your message with Virtru",
TOOLTIP_UPSELL_POSTFIX:"<br/><br/>This feature is available in the Pro version of Virtru.",
TOOLTIP_VIRTRU_OPTIONS:"Virtru Options",UNSECURE_ATTACHMENTS_EXIST_HEADER:"Unsecure attachments exist",
UNSECURE_ATTACHMENTS_EXIST_TEXT:"Unable to send secure while attachments detected.",
UNSECURE_ATTACHMENTS_EXIST_TITLE:"Send Failed",UPDATE_MODAL_HEADER:"Virtru has been updated.",
UPDATE_MODAL_REFRESH_BUTTON:"Click here to refresh",
UPDATE_MODAL_SUBHEADER:"Please refresh this page to make sure <br>you're using the latest version.",
VIRTRU_ATTACHMENT_CLICK_TO_DOWNLOAD:"Click to Download",VIRTRU_ATTACHMENT_DECRYPTING:"Decrypting",
VIRTRU_CONTACT_US:"Please contact your IT administrator",
VIRTRU_DISABLED_ON_DOMAIN:"Virtru has been disabled for your domain",VIRTRU_PROTECTION_OFF:"Virtru protection is OFF",
VIRTRU_PROTECTION_ON:"Virtru protection is ON",VIRTRU_SECURE_DRAFT_PREFIX:"This is a draft secured by Virtru",
WEBMAIL_PLUGIN_ACTIVATION_LINK_RETRY:"Send again",
WEBMAIL_PLUGIN_ACTIVATION_TEXT:"Verification email sent.<br>Check this inbox shortly.",
WEBMAIL_PLUGIN_INIT_ERROR:'Virtru was unable to successfullly initialize. This may be due to network connectivity errors or a broken user configuration. Please try refreshing again in a few moments, or contact Virtru customer support at <a href="https://www.virtru.com/contact-us/">https://www.virtru.com/contact-us/</a>.',
WEBMAIL_PLUGIN_INIT_ERROR_HEADER:"Virtru plugin failed to initialize",
WEBMAIL_PLUGIN_INIT_ERROR_TITLE:"Oops! There was a problem..",WIDGET_BASE_BODY_REVOKED:"ACCESS DENIED",
WIDGET_BASE_EXPIRATION_OPTIONS_CUSTOM:"Add custom date/time",WIDGET_BASE_FOOTER:"Secured by Virtru technology",
WIDGET_BASE_HEADER_MESSAGE_RECIPIENT:"You are reading a secure message, protected by Virtru",
WIDGET_BASE_HEADER_MESSAGE_SENDER:"Your message, protected by Virtru",
WIDGET_BASE_MENU_OPTION_COPY_PASTE:"Disable Copy / Paste",WIDGET_BASE_MENU_OPTION_EXPIRES:"Add Expiration",
WIDGET_BASE_MENU_OPTION_FORWARDING:"Disable Forwarding",WIDGET_BASE_MENU_OPTION_PRINT:"Disable Print",
EXPIRATION_UNIT_DAYS:"day",EXPIRATION_UNIT_DAYS_plural:"days",EXPIRATION_UNIT_HOURS:"hour",
EXPIRATION_UNIT_HOURS_plural:"hours",EXPIRATION_UNIT_MINS:"minute",EXPIRATION_UNIT_MINS_plural:"minutes",
EXPIRATION_UNIT_MONTHS:"month",EXPIRATION_UNIT_MONTHS_plural:"months",EXPIRATION_UNIT_WEEKS:"week",
EXPIRATION_UNIT_WEEKS_plural:"weeks",EXPIRATION_UNIT_YEARS:"year",EXPIRATION_UNIT_YEARS_plural:"years",
READ_RECEIPT_FORWARD_COUNT:'<div style="text-align:center;">Forwarded {{count}} time<br /><span style="font-size:8pt;">$t(READ_RECEIPT_FORWARD_COUNT_DETAILS)</span></div>',
READ_RECEIPT_FORWARD_COUNT_plural:'<div style="text-align:center;">Forwarded {{count}} times<br /><span style="font-size:8pt;">$t(READ_RECEIPT_FORWARD_COUNT_DETAILS)</span></div>'
}},function(a,b,c){"use strict";function d(a){return a&&a.__esModule?a:{default:a}}b.__esModule=!0
;var e=c(110),f=d(e),g=c(112),h=d(g),i="function"==typeof h.default&&"symbol"==typeof f.default?function(a){
return typeof a}:function(a){
return a&&"function"==typeof h.default&&a.constructor===h.default&&a!==h.default.prototype?"symbol":typeof a}
;b.default="function"==typeof h.default&&"symbol"===i(f.default)?function(a){return void 0===a?"undefined":i(a)
}:function(a){
return a&&"function"==typeof h.default&&a.constructor===h.default&&a!==h.default.prototype?"symbol":void 0===a?"undefined":i(a)
}},function(a,b,c){var d=c(41),e=c(30).concat("length","prototype");b.f=Object.getOwnPropertyNames||function(a){
return d(a,e)}},function(a,b,c){"use strict";function d(a,b){if(a.empty(),!b)return void e(a);var c=b.activation;if(c){
if("active"!==c.status){var d=f('<a class="button" href="#">'+i.t("CHROME_POPUP_ACTIVATION_BUTTON",{userId:c.userId
})+"</a>");a.append(d),d.click(function(){var a={userId:c.userId,provider:c.provider}
;j.callContentScript("runTabsFederatedActivation",a).then(function(){window.close()})}),e(a)}else{
var g=f('<div class="activation-label">'+i.t("CHROME_POPUP_ACTIVATION_LABEL",{userId:c.userId})+"</div>");a.append(g),
e(a);f("#clearActivations").show()}}}function e(a){
var b=f('<a class="button" href="#">'+i.t("CHROME_POPUP_SETTINGS_BUTTON")+"</a>");a.append(b),b.click(function(){
var a=chrome.extension.getBackgroundPage(),b=a.router,c=function(a,b){window.open(b.dashboardUrl,"_blank")}
;b.route("loadExtensionSettings",{},c,void 0)})}
var f=c(36),g=chrome.extension.getBackgroundPage(),h=g.router,i=c(56),j=c(125);f(document).ready(function(){
var a=f("div.page-menu"),b=f(".browser-menu"),c='\n  <a class="button" href="https://www.virtru.com/contact-us/" target="_blank">'+i.t("CHROME_POPUP_SUPPORT_BUTTON")+'</a>\n  <a class="button" href="https://www.virtru.com" target="_blank">'+i.t("CHROME_POPUP_ABOUT_VIRTRU_BUTTON")+'</a>\n  <a class="button" id="clearActivations" href="#" style="display: none;">'+i.t("CHROME_POPUP_LOGOUT_BUTTON")+'</a>\n  <a class="button" href="https://support.google.com/chromebook/answer/2589434?hl=en" target="_blank">'+i.t("CHROME_POPUP_UNINSTALL_BUTTON")+"</a>"
;b.html(c);var e=f("#clearActivations");j.callContentScript("loadBrowserActionOptions").then(function(b){d(a,b)
}).catch(function(){d(a)}).done(),e.click(function(){h.route("clear-activations",{}),window.close()})})
},function(a,b,c){"use strict";c(57),a.exports=c(37)},function(a,b,c){"use strict";var d=c(58),e=c(37)
;d.defineLocale("dev",{parentLocale:"fr"}),d.locale(e.language),e.on("languageChanged",function(a){return d.locale(a)}),
a.exports=d},function(a,b){a.exports=__virtru_deps.moment},function(a,b,c){c(60),a.exports=c(0).Object.assign
},function(a,b,c){var d=c(11);d(d.S+d.F,"Object",{assign:c(62)})},function(a,b){a.exports=function(a){
if("function"!=typeof a)throw TypeError(a+" is not a function!");return a}},function(a,b,c){"use strict"
;var d=c(14),e=c(31),f=c(18),g=c(19),h=c(42),i=Object.assign;a.exports=!i||c(8)(function(){
var a={},b={},c=Symbol(),d="abcdefghijklmnopqrst";return a[c]=7,d.split("").forEach(function(a){b[a]=a}),
7!=i({},a)[c]||Object.keys(i({},b)).join("")!=d})?function(a,b){
for(var c=g(a),i=arguments.length,j=1,k=e.f,l=f.f;i>j;)for(var m,n=h(arguments[j++]),o=k?d(n).concat(k(n)):d(n),p=o.length,q=0;p>q;)l.call(n,m=o[q++])&&(c[m]=n[m])
;return c}:i},function(a,b,c){var d=c(9),e=c(43),f=c(64);a.exports=function(a){return function(b,c,g){
var h,i=d(b),j=e(i.length),k=f(g,j);if(a&&c!=c){for(;j>k;)if((h=i[k++])!=h)return!0
}else for(;j>k;k++)if((a||k in i)&&i[k]===c)return a||k||0;return!a&&-1}}},function(a,b,c){
var d=c(27),e=Math.max,f=Math.min;a.exports=function(a,b){return a=d(a),a<0?e(a+b,0):f(a,b)}},function(a,b,c){c(45),
c(33),a.exports=c(74)},function(a,b,c){"use strict";var d=c(67),e=c(68),f=c(15),g=c(9)
;a.exports=c(46)(Array,"Array",function(a,b){this._t=g(a),this._i=0,this._k=b},function(){
var a=this._t,b=this._k,c=this._i++
;return!a||c>=a.length?(this._t=void 0,e(1)):"keys"==b?e(0,c):"values"==b?e(0,a[c]):e(0,[c,a[c]])},"values"),
f.Arguments=f.Array,d("keys"),d("values"),d("entries")},function(a,b){a.exports=function(){}},function(a,b){
a.exports=function(a,b){return{value:b,done:!!a}}},function(a,b,c){"use strict";var d=c(48),e=c(13),f=c(32),g={}
;c(5)(g,c(1)("iterator"),function(){return this}),a.exports=function(a,b,c){a.prototype=d(g,{next:e(1,c)}),
f(a,b+" Iterator")}},function(a,b,c){var d=c(3),e=c(6),f=c(14);a.exports=c(7)?Object.defineProperties:function(a,b){e(a)
;for(var c,g=f(b),h=g.length,i=0;h>i;)d.f(a,c=g[i++],b[c]);return a}},function(a,b,c){var d=c(2).document
;a.exports=d&&d.documentElement},function(a,b,c){var d=c(4),e=c(19),f=c(28)("IE_PROTO"),g=Object.prototype
;a.exports=Object.getPrototypeOf||function(a){
return a=e(a),d(a,f)?a[f]:"function"==typeof a.constructor&&a instanceof a.constructor?a.constructor.prototype:a instanceof Object?g:null
}},function(a,b,c){var d=c(27),e=c(26);a.exports=function(a){return function(b,c){
var f,g,h=String(e(b)),i=d(c),j=h.length;return i<0||i>=j?a?"":void 0:(f=h.charCodeAt(i),
f<55296||f>56319||i+1===j||(g=h.charCodeAt(i+1))<56320||g>57343?a?h.charAt(i):f:a?h.slice(i,i+2):g-56320+(f-55296<<10)+65536)
}}},function(a,b,c){var d=c(6),e=c(49);a.exports=c(0).getIterator=function(a){var b=e(a)
;if("function"!=typeof b)throw TypeError(a+" is not iterable!");return d(b.call(a))}},function(a,b,c){
var d=c(25),e=c(1)("toStringTag"),f="Arguments"==d(function(){return arguments}()),g=function(a,b){try{return a[b]
}catch(a){}};a.exports=function(a){var b,c,h
;return void 0===a?"Undefined":null===a?"Null":"string"==typeof(c=g(b=Object(a),e))?c:f?d(b):"Object"==(h=d(b))&&"function"==typeof b.callee?"Arguments":h
}},function(a,b,c){c(77),a.exports=c(0).Object.keys},function(a,b,c){var d=c(19),e=c(14);c(78)("keys",function(){
return function(a){return e(d(a))}})},function(a,b,c){var d=c(11),e=c(0),f=c(8);a.exports=function(a,b){
var c=(e.Object||{})[a]||Object[a],g={};g[a]=b(c),d(d.S+d.F*f(function(){c(1)}),"Object",g)}},function(a,b,c){
"use strict";function d(a){return a&&a.__esModule?a:{default:a}}b.__esModule=!0;var e=c(80),f=d(e)
;b.default=function(a){if(Array.isArray(a)){for(var b=0,c=Array(a.length);b<a.length;b++)c[b]=a[b];return c}return(0,
f.default)(a)}},function(a,b,c){a.exports={default:c(81),__esModule:!0}},function(a,b,c){c(33),c(82),
a.exports=c(0).Array.from},function(a,b,c){"use strict"
;var d=c(38),e=c(11),f=c(19),g=c(83),h=c(84),i=c(43),j=c(85),k=c(49);e(e.S+e.F*!c(86)(function(a){Array.from(a)
}),"Array",{from:function(a){
var b,c,e,l,m=f(a),n="function"==typeof this?this:Array,o=arguments.length,p=o>1?arguments[1]:void 0,q=void 0!==p,r=0,s=k(m)
;if(q&&(p=d(p,o>2?arguments[2]:void 0,2)),void 0==s||n==Array&&h(s))for(b=i(m.length),
c=new n(b);b>r;r++)j(c,r,q?p(m[r],r):m[r]);else for(l=s.call(m),
c=new n;!(e=l.next()).done;r++)j(c,r,q?g(l,p,[e.value,r],!0):e.value);return c.length=r,c}})},function(a,b,c){var d=c(6)
;a.exports=function(a,b,c,e){try{return e?b(d(c)[0],c[1]):b(c)}catch(b){var f=a.return;throw void 0!==f&&d(f.call(a)),b}
}},function(a,b,c){var d=c(15),e=c(1)("iterator"),f=Array.prototype;a.exports=function(a){
return void 0!==a&&(d.Array===a||f[e]===a)}},function(a,b,c){"use strict";var d=c(3),e=c(13);a.exports=function(a,b,c){
b in a?d.f(a,b,e(0,c)):a[b]=c}},function(a,b,c){var d=c(1)("iterator"),e=!1;try{var f=[7][d]();f.return=function(){e=!0
},Array.from(f,function(){throw 2})}catch(a){}a.exports=function(a,b){if(!b&&!e)return!1;var c=!1;try{var f=[7],g=f[d]()
;g.next=function(){return{done:c=!0}},f[d]=function(){return g},a(f)}catch(a){}return c}},function(a,b,c){
var d=c(0),e=d.JSON||(d.JSON={stringify:JSON.stringify});a.exports=function(a){return e.stringify.apply(e,arguments)}
},function(a,b,c){"use strict";Object.defineProperty(b,"__esModule",{value:!0}),c.d(b,"changeLanguage",function(){
return e}),c.d(b,"cloneInstance",function(){return f}),c.d(b,"createInstance",function(){return g}),
c.d(b,"dir",function(){return h}),c.d(b,"exists",function(){return i}),c.d(b,"getFixedT",function(){return j}),
c.d(b,"init",function(){return k}),c.d(b,"loadLanguages",function(){return l}),c.d(b,"loadNamespaces",function(){
return m}),c.d(b,"loadResources",function(){return n}),c.d(b,"off",function(){return o}),c.d(b,"on",function(){return p
}),c.d(b,"setDefaultNamespace",function(){return q}),c.d(b,"t",function(){return r}),c.d(b,"use",function(){return s})
;var d=c(89);b.default=d.a
;var e=d.a.changeLanguage.bind(d.a),f=d.a.cloneInstance.bind(d.a),g=d.a.createInstance.bind(d.a),h=d.a.dir.bind(d.a),i=d.a.exists.bind(d.a),j=d.a.getFixedT.bind(d.a),k=d.a.init.bind(d.a),l=d.a.loadLanguages.bind(d.a),m=d.a.loadNamespaces.bind(d.a),n=d.a.loadResources.bind(d.a),o=d.a.off.bind(d.a),p=d.a.on.bind(d.a),q=d.a.setDefaultNamespace.bind(d.a),r=d.a.t.bind(d.a),s=d.a.use.bind(d.a)
},function(a,b,c){"use strict";function d(a,b){for(var c=Object.getOwnPropertyNames(b),d=0;d<c.length;d++){
var e=c[d],f=Object.getOwnPropertyDescriptor(b,e);f&&f.configurable&&void 0===a[e]&&Object.defineProperty(a,e,f)}
return a}function e(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function f(a,b){
if(!a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
;return!b||"object"!=typeof b&&"function"!=typeof b?a:b}function g(a,b){
if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function, not "+typeof b)
;a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,enumerable:!1,writable:!0,configurable:!0}}),
b&&(Object.setPrototypeOf?Object.setPrototypeOf(a,b):d(a,b))}function h(){}
var i=c(10),j=c(21),k=c(90),l=c(91),m=c(92),n=c(93),o=c(94),p=c(95),q=c(96),r=c(51),s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){
return typeof a}:function(a){
return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a
},t=Object.assign||function(a){for(var b=1;b<arguments.length;b++){var c=arguments[b]
;for(var d in c)Object.prototype.hasOwnProperty.call(c,d)&&(a[d]=c[d])}return a},u=function(a){function b(){
var c=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},d=arguments[1];e(this,b);var g=f(this,a.call(this))
;if(g.options=Object(q.b)(c),g.services={},g.logger=i.a,g.modules={external:[]},d&&!g.isInitialized&&!c.isClone){var h
;if(!g.options.initImmediate)return h=g.init(c,d),f(g,h);setTimeout(function(){g.init(c,d)},0)}return g}return g(b,a),
b.prototype.init=function(){function a(a){return a?"function"==typeof a?new a:a:null}
var b=this,c=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},d=arguments[1];if("function"==typeof c&&(d=c,
c={}),this.options=t({},Object(q.a)(),this.options,Object(q.b)(c)),this.format=this.options.interpolation.format,
d||(d=h),!this.options.isClone){
this.modules.logger?i.a.init(a(this.modules.logger),this.options):i.a.init(null,this.options)
;var e=new m.a(this.options);this.store=new k.a(this.options.resources,this.options);var f=this.services;f.logger=i.a,
f.resourceStore=this.store,f.languageUtils=e,f.pluralResolver=new n.a(e,{prepend:this.options.pluralSeparator,
compatibilityJSON:this.options.compatibilityJSON,simplifyPluralSuffix:this.options.simplifyPluralSuffix}),
f.interpolator=new o.a(this.options),f.backendConnector=new p.a(a(this.modules.backend),f.resourceStore,f,this.options),
f.backendConnector.on("*",function(a){for(var c=arguments.length,d=Array(c>1?c-1:0),e=1;e<c;e++)d[e-1]=arguments[e]
;b.emit.apply(b,[a].concat(d))}),this.modules.languageDetector&&(f.languageDetector=a(this.modules.languageDetector),
f.languageDetector.init(f,this.options.detection,this.options)),
this.modules.i18nFormat&&(f.i18nFormat=a(this.modules.i18nFormat),f.i18nFormat.init&&f.i18nFormat.init(this)),
this.translator=new l.a(this.services,this.options),this.translator.on("*",function(a){
for(var c=arguments.length,d=Array(c>1?c-1:0),e=1;e<c;e++)d[e-1]=arguments[e];b.emit.apply(b,[a].concat(d))}),
this.modules.external.forEach(function(a){a.init&&a.init(b)})}
["getResource","addResource","addResources","addResourceBundle","removeResourceBundle","hasResourceBundle","getResourceBundle","getDataByLanguage"].forEach(function(a){
b[a]=function(){var c;return(c=b.store)[a].apply(c,arguments)}});var g=function(){
b.changeLanguage(b.options.lng,function(a,c){b.isInitialized=!0,b.logger.log("initialized",b.options),
b.emit("initialized",b.options),d(a,c)})}
;return this.options.resources||!this.options.initImmediate?g():setTimeout(g,0),this},
b.prototype.loadResources=function(){var a=this,b=arguments.length>0&&void 0!==arguments[0]?arguments[0]:h
;if(this.options.resources)b(null);else{if(this.language&&"cimode"===this.language.toLowerCase())return b()
;var c=[],d=function(b){if(b){a.services.languageUtils.toResolveHierarchy(b).forEach(function(a){
c.indexOf(a)<0&&c.push(a)})}};if(this.language)d(this.language);else{
this.services.languageUtils.getFallbackCodes(this.options.fallbackLng).forEach(function(a){return d(a)})}
this.options.preload&&this.options.preload.forEach(function(a){return d(a)
}),this.services.backendConnector.load(c,this.options.ns,b)}},b.prototype.reloadResources=function(a,b,c){
a||(a=this.languages),b||(b=this.options.ns),c||(c=function(){}),this.services.backendConnector.reload(a,b,c)},
b.prototype.use=function(a){
return"backend"===a.type&&(this.modules.backend=a),("logger"===a.type||a.log&&a.warn&&a.error)&&(this.modules.logger=a),
"languageDetector"===a.type&&(this.modules.languageDetector=a),"i18nFormat"===a.type&&(this.modules.i18nFormat=a),
"postProcessor"===a.type&&r.a.addPostProcessor(a),"3rdParty"===a.type&&this.modules.external.push(a),this},
b.prototype.changeLanguage=function(a,b){var c=this,d=function(a,d){c.translator.changeLanguage(d),
d&&(c.emit("languageChanged",d),c.logger.log("languageChanged",d)),b&&b(a,function(){return c.t.apply(c,arguments)})
},e=function(a){a&&(c.language=a,c.languages=c.services.languageUtils.toResolveHierarchy(a),
c.translator.language||c.translator.changeLanguage(a),
c.services.languageDetector&&c.services.languageDetector.cacheUserLanguage(a)),c.loadResources(function(b){d(b,a)})}
;a||!this.services.languageDetector||this.services.languageDetector.async?!a&&this.services.languageDetector&&this.services.languageDetector.async?this.services.languageDetector.detect(e):e(a):e(this.services.languageDetector.detect())
},b.prototype.getFixedT=function(a,b){var c=this,d=function a(b,d){
for(var e=arguments.length,f=Array(e>2?e-2:0),g=2;g<e;g++)f[g-2]=arguments[g];var h=t({},d)
;return"object"!==(void 0===d?"undefined":s(d))&&(h=c.options.overloadTranslationOptionHandler([b,d].concat(f))),
h.lng=h.lng||a.lng,h.lngs=h.lngs||a.lngs,h.ns=h.ns||a.ns,c.t(b,h)};return"string"==typeof a?d.lng=a:d.lngs=a,d.ns=b,d},
b.prototype.t=function(){var a;return this.translator&&(a=this.translator).translate.apply(a,arguments)},
b.prototype.exists=function(){var a;return this.translator&&(a=this.translator).exists.apply(a,arguments)},
b.prototype.setDefaultNamespace=function(a){this.options.defaultNS=a},b.prototype.loadNamespaces=function(a,b){
var c=this;if(!this.options.ns)return b&&b();"string"==typeof a&&(a=[a]),a.forEach(function(a){
c.options.ns.indexOf(a)<0&&c.options.ns.push(a)}),this.loadResources(b)},b.prototype.loadLanguages=function(a,b){
"string"==typeof a&&(a=[a]);var c=this.options.preload||[],d=a.filter(function(a){return c.indexOf(a)<0})
;if(!d.length)return b();this.options.preload=c.concat(d),this.loadResources(b)},b.prototype.dir=function(a){
return a||(a=this.languages&&this.languages.length>0?this.languages[0]:this.language),
a?["ar","shu","sqr","ssh","xaa","yhd","yud","aao","abh","abv","acm","acq","acw","acx","acy","adf","ads","aeb","aec","afb","ajp","apc","apd","arb","arq","ars","ary","arz","auz","avl","ayh","ayl","ayn","ayp","bbz","pga","he","iw","ps","pbt","pbu","pst","prp","prd","ur","ydd","yds","yih","ji","yi","hbo","men","xmn","fa","jpr","peo","pes","prs","dv","sam"].indexOf(this.services.languageUtils.getLanguagePartFromCode(a))>=0?"rtl":"ltr":"rtl"
},b.prototype.createInstance=function(){
return new b(arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},arguments[1])},
b.prototype.cloneInstance=function(){
var a=this,c=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},d=arguments.length>1&&void 0!==arguments[1]?arguments[1]:h,e=t({},this.options,c,{
isClone:!0}),f=new b(e);return["store","services","language"].forEach(function(b){f[b]=a[b]}),
f.translator=new l.a(f.services,f.options),f.translator.on("*",function(a){
for(var b=arguments.length,c=Array(b>1?b-1:0),d=1;d<b;d++)c[d-1]=arguments[d];f.emit.apply(f,[a].concat(c))}),
f.init(e,d),f.translator.options=f.options,f},b}(j.a);b.a=new u},function(a,b,c){"use strict";function d(a,b){
for(var c=Object.getOwnPropertyNames(b),d=0;d<c.length;d++){var e=c[d],f=Object.getOwnPropertyDescriptor(b,e)
;f&&f.configurable&&void 0===a[e]&&Object.defineProperty(a,e,f)}return a}function e(a,b){
if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function f(a,b){
if(!a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
;return!b||"object"!=typeof b&&"function"!=typeof b?a:b}function g(a,b){
if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function, not "+typeof b)
;a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,enumerable:!1,writable:!0,configurable:!0}}),
b&&(Object.setPrototypeOf?Object.setPrototypeOf(a,b):d(a,b))}var h=c(21),i=c(22),j=Object.assign||function(a){
for(var b=1;b<arguments.length;b++){var c=arguments[b]
;for(var d in c)Object.prototype.hasOwnProperty.call(c,d)&&(a[d]=c[d])}return a},k=function(a){function b(c){
var d=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{ns:["translation"],defaultNS:"translation"};e(this,b)
;var g=f(this,a.call(this))
;return g.data=c||{},g.options=d,void 0===g.options.keySeparator&&(g.options.keySeparator="."),g}return g(b,a),
b.prototype.addNamespaces=function(a){this.options.ns.indexOf(a)<0&&this.options.ns.push(a)},
b.prototype.removeNamespaces=function(a){var b=this.options.ns.indexOf(a);b>-1&&this.options.ns.splice(b,1)},
b.prototype.getResource=function(a,b,c){
var d=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{},e=void 0!==d.keySeparator?d.keySeparator:this.options.keySeparator,f=[a,b]
;return c&&"string"!=typeof c&&(f=f.concat(c)),c&&"string"==typeof c&&(f=f.concat(e?c.split(e):c)),
a.indexOf(".")>-1&&(f=a.split(".")),i.d(this.data,f)},b.prototype.addResource=function(a,b,c,d){
var e=arguments.length>4&&void 0!==arguments[4]?arguments[4]:{silent:!1},f=this.options.keySeparator;void 0===f&&(f=".")
;var g=[a,b];c&&(g=g.concat(f?c.split(f):c)),a.indexOf(".")>-1&&(g=a.split("."),d=b,b=g[1]),this.addNamespaces(b),
i.h(this.data,g,d),e.silent||this.emit("added",a,b,c,d)},b.prototype.addResources=function(a,b,c){
var d=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{silent:!1}
;for(var e in c)"string"==typeof c[e]&&this.addResource(a,b,e,c[e],{silent:!0});d.silent||this.emit("added",a,b,c)},
b.prototype.addResourceBundle=function(a,b,c,d,e){var f=arguments.length>5&&void 0!==arguments[5]?arguments[5]:{
silent:!1},g=[a,b];a.indexOf(".")>-1&&(g=a.split("."),d=c,c=b,b=g[1]),this.addNamespaces(b);var h=i.d(this.data,g)||{}
;d?i.b(h,c,e):h=j({},h,c),i.h(this.data,g,h),f.silent||this.emit("added",a,b,c)},
b.prototype.removeResourceBundle=function(a,b){this.hasResourceBundle(a,b)&&delete this.data[a][b],
this.removeNamespaces(b),this.emit("removed",a,b)},b.prototype.hasResourceBundle=function(a,b){
return void 0!==this.getResource(a,b)},b.prototype.getResourceBundle=function(a,b){return b||(b=this.options.defaultNS),
"v1"===this.options.compatibilityAPI?j({},this.getResource(a,b)):this.getResource(a,b)},
b.prototype.getDataByLanguage=function(a){return this.data[a]},b.prototype.toJSON=function(){return this.data},b}(h.a)
;b.a=k},function(a,b,c){"use strict";function d(a,b){for(var c=Object.getOwnPropertyNames(b),d=0;d<c.length;d++){
var e=c[d],f=Object.getOwnPropertyDescriptor(b,e);f&&f.configurable&&void 0===a[e]&&Object.defineProperty(a,e,f)}
return a}function e(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function f(a,b){
if(!a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
;return!b||"object"!=typeof b&&"function"!=typeof b?a:b}function g(a,b){
if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function, not "+typeof b)
;a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,enumerable:!1,writable:!0,configurable:!0}}),
b&&(Object.setPrototypeOf?Object.setPrototypeOf(a,b):d(a,b))}
var h=c(10),i=c(21),j=c(51),k=c(22),l=Object.assign||function(a){for(var b=1;b<arguments.length;b++){var c=arguments[b]
;for(var d in c)Object.prototype.hasOwnProperty.call(c,d)&&(a[d]=c[d])}return a
},m="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){
return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},n=function(a){
function b(c){var d=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};e(this,b);var g=f(this,a.call(this))
;return k.a(["resourceStore","languageUtils","pluralResolver","interpolator","backendConnector","i18nFormat"],c,g),
g.options=d,void 0===g.options.keySeparator&&(g.options.keySeparator="."),g.logger=h.a.create("translator"),g}
return g(b,a),b.prototype.changeLanguage=function(a){a&&(this.language=a)},b.prototype.exists=function(a){
var b=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{interpolation:{}},c=this.resolve(a,b)
;return c&&void 0!==c.res},b.prototype.extractFromKey=function(a,b){var c=b.nsSeparator||this.options.nsSeparator
;void 0===c&&(c=":")
;var d=void 0!==b.keySeparator?b.keySeparator:this.options.keySeparator,e=b.ns||this.options.defaultNS
;if(c&&a.indexOf(c)>-1){var f=a.split(c);(c!==d||c===d&&this.options.ns.indexOf(f[0])>-1)&&(e=f.shift()),a=f.join(d)}
return"string"==typeof e&&(e=[e]),{key:a,namespaces:e}},b.prototype.translate=function(a,b){var c=this
;if("object"!==(void 0===b?"undefined":m(b))&&this.options.overloadTranslationOptionHandler&&(b=this.options.overloadTranslationOptionHandler(arguments)),
b||(b={}),void 0===a||null===a||""===a)return"";"number"==typeof a&&(a=String(a)),"string"==typeof a&&(a=[a])
;var d=void 0!==b.keySeparator?b.keySeparator:this.options.keySeparator,e=this.extractFromKey(a[a.length-1],b),f=e.key,g=e.namespaces,h=g[g.length-1],i=b.lng||this.language,j=b.appendNamespaceToCIMode||this.options.appendNamespaceToCIMode
;if(i&&"cimode"===i.toLowerCase()){if(j){var k=b.nsSeparator||this.options.nsSeparator;return h+k+f}return f}
var n=this.resolve(a,b),o=n&&n.res,p=n&&n.usedKey||f,q=Object.prototype.toString.apply(o),r=["[object Number]","[object Function]","[object RegExp]"],s=void 0!==b.joinArrays?b.joinArrays:this.options.joinArrays,t=!this.i18nFormat||this.i18nFormat.handleAsObject,u="string"!=typeof o&&"boolean"!=typeof o&&"number"!=typeof o
;if(t&&o&&u&&r.indexOf(q)<0&&(!s||"[object Array]"!==q)){
if(!b.returnObjects&&!this.options.returnObjects)return this.logger.warn("accessing an object - but returnObjects options is not enabled!"),
this.options.returnedObjectHandler?this.options.returnedObjectHandler(p,o,b):"key '"+f+" ("+this.language+")' returned an object instead of string."
;if(d){var v="[object Array]"===q?[]:{};for(var w in o)if(Object.prototype.hasOwnProperty.call(o,w)){var x=""+p+d+w
;v[w]=this.translate(x,l({},b,{joinArrays:!1,ns:g})),v[w]===x&&(v[w]=o[w])}o=v}
}else if(t&&s&&"[object Array]"===q)(o=o.join(s))&&(o=this.extendTranslation(o,a,b));else{var y=!1,z=!1
;if(!this.isValidLookup(o)&&void 0!==b.defaultValue){if(y=!0,void 0!==b.count){
var A=this.pluralResolver.getSuffix(i,b.count);o=b["defaultValue"+A]}o||(o=b.defaultValue)}this.isValidLookup(o)||(z=!0,
o=f);var B=b.defaultValue&&b.defaultValue!==o&&this.options.updateMissing;if(z||y||B){
this.logger.log(B?"updateKey":"missingKey",i,h,f,B?b.defaultValue:o)
;var C=[],D=this.languageUtils.getFallbackCodes(this.options.fallbackLng,b.lng||this.language)
;if("fallback"===this.options.saveMissingTo&&D&&D[0])for(var E=0;E<D.length;E++)C.push(D[E]);else"all"===this.options.saveMissingTo?C=this.languageUtils.toResolveHierarchy(b.lng||this.language):C.push(b.lng||this.language)
;var F=function(a,d){
c.options.missingKeyHandler?c.options.missingKeyHandler(a,h,d,B?b.defaultValue:o,B,b):c.backendConnector&&c.backendConnector.saveMissing&&c.backendConnector.saveMissing(a,h,d,B?b.defaultValue:o,B,b),
c.emit("missingKey",a,h,d,o)};if(this.options.saveMissing){var G=void 0!==b.count&&"string"!=typeof b.count
;this.options.saveMissingPlurals&&G?C.forEach(function(a){c.pluralResolver.getPluralFormsOfKey(a,f).forEach(function(b){
return F([a],b)})}):F(C,f)}}
o=this.extendTranslation(o,a,b,n),z&&o===f&&this.options.appendNamespaceToMissingKey&&(o=h+":"+f),
z&&this.options.parseMissingKeyHandler&&(o=this.options.parseMissingKeyHandler(o))}return o},
b.prototype.extendTranslation=function(a,b,c,d){var e=this
;if(this.i18nFormat&&this.i18nFormat.parse)a=this.i18nFormat.parse(a,c,d.usedLng,d.usedNS,d.usedKey,{resolved:d
});else if(!c.skipInterpolation){c.interpolation&&this.interpolator.init(l({},c,{
interpolation:l({},this.options.interpolation,c.interpolation)}))
;var f=c.replace&&"string"!=typeof c.replace?c.replace:c
;this.options.interpolation.defaultVariables&&(f=l({},this.options.interpolation.defaultVariables,f)),
a=this.interpolator.interpolate(a,f,c.lng||this.language,c),!1!==c.nest&&(a=this.interpolator.nest(a,function(){
return e.translate.apply(e,arguments)},c)),c.interpolation&&this.interpolator.reset()}
var g=c.postProcess||this.options.postProcess,h="string"==typeof g?[g]:g
;return void 0!==a&&null!==a&&h&&h.length&&!1!==c.applyPostProcessor&&(a=j.a.handle(h,a,b,c,this)),a},
b.prototype.resolve=function(a){
var b=this,c=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},d=void 0,e=void 0,f=void 0,g=void 0
;return"string"==typeof a&&(a=[a]),a.forEach(function(a){if(!b.isValidLookup(d)){var h=b.extractFromKey(a,c),i=h.key;e=i
;var j=h.namespaces;b.options.fallbackNS&&(j=j.concat(b.options.fallbackNS))
;var k=void 0!==c.count&&"string"!=typeof c.count,l=void 0!==c.context&&"string"==typeof c.context&&""!==c.context,m=c.lngs?c.lngs:b.languageUtils.toResolveHierarchy(c.lng||b.language,c.fallbackLng)
;j.forEach(function(a){b.isValidLookup(d)||(g=a,m.forEach(function(e){if(!b.isValidLookup(d)){f=e;var g=i,h=[g]
;if(b.i18nFormat&&b.i18nFormat.addLookupKeys)b.i18nFormat.addLookupKeys(h,i,e,a,c);else{var j=void 0
;k&&(j=b.pluralResolver.getSuffix(e,c.count)),k&&l&&h.push(g+j),l&&h.push(g+=""+b.options.contextSeparator+c.context),
k&&h.push(g+=j)}for(var m=void 0;m=h.pop();)b.isValidLookup(d)||(d=b.getResource(e,a,m,c))}}))})}}),{res:d,usedKey:e,
usedLng:f,usedNS:g}},b.prototype.isValidLookup=function(a){
return!(void 0===a||!this.options.returnNull&&null===a||!this.options.returnEmptyString&&""===a)},
b.prototype.getResource=function(a,b,c){var d=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{}
;return this.i18nFormat&&this.i18nFormat.getResource?this.i18nFormat.getResource(a,b,c,d):this.resourceStore.getResource(a,b,c,d)
},b}(i.a);b.a=n},function(a,b,c){"use strict";function d(a,b){
if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function e(a){
return a.charAt(0).toUpperCase()+a.slice(1)}var f=c(10),g=function(){function a(b){d(this,a),this.options=b,
this.whitelist=this.options.whitelist||!1,this.logger=f.a.create("languageUtils")}
return a.prototype.getScriptPartFromCode=function(a){if(!a||a.indexOf("-")<0)return null;var b=a.split("-")
;return 2===b.length?null:(b.pop(),this.formatLanguageCode(b.join("-")))
},a.prototype.getLanguagePartFromCode=function(a){if(!a||a.indexOf("-")<0)return a;var b=a.split("-")
;return this.formatLanguageCode(b[0])},a.prototype.formatLanguageCode=function(a){
if("string"==typeof a&&a.indexOf("-")>-1){var b=["hans","hant","latn","cyrl","cans","mong","arab"],c=a.split("-")
;return this.options.lowerCaseLng?c=c.map(function(a){return a.toLowerCase()}):2===c.length?(c[0]=c[0].toLowerCase(),
c[1]=c[1].toUpperCase(),
b.indexOf(c[1].toLowerCase())>-1&&(c[1]=e(c[1].toLowerCase()))):3===c.length&&(c[0]=c[0].toLowerCase(),
2===c[1].length&&(c[1]=c[1].toUpperCase()),"sgn"!==c[0]&&2===c[2].length&&(c[2]=c[2].toUpperCase()),
b.indexOf(c[1].toLowerCase())>-1&&(c[1]=e(c[1].toLowerCase())),
b.indexOf(c[2].toLowerCase())>-1&&(c[2]=e(c[2].toLowerCase()))),c.join("-")}
return this.options.cleanCode||this.options.lowerCaseLng?a.toLowerCase():a},a.prototype.isWhitelisted=function(a){
return("languageOnly"===this.options.load||this.options.nonExplicitWhitelist)&&(a=this.getLanguagePartFromCode(a)),
!this.whitelist||!this.whitelist.length||this.whitelist.indexOf(a)>-1},a.prototype.getFallbackCodes=function(a,b){
if(!a)return[];if("string"==typeof a&&(a=[a]),"[object Array]"===Object.prototype.toString.apply(a))return a
;if(!b)return a.default||[];var c=a[b];return c||(c=a[this.getScriptPartFromCode(b)]),
c||(c=a[this.formatLanguageCode(b)]),c||(c=a.default),c||[]},a.prototype.toResolveHierarchy=function(a,b){
var c=this,d=this.getFallbackCodes(b||this.options.fallbackLng||[],a),e=[],f=function(a){
a&&(c.isWhitelisted(a)?e.push(a):c.logger.warn("rejecting non-whitelisted language code: "+a))}
;return"string"==typeof a&&a.indexOf("-")>-1?("languageOnly"!==this.options.load&&f(this.formatLanguageCode(a)),
"languageOnly"!==this.options.load&&"currentOnly"!==this.options.load&&f(this.getScriptPartFromCode(a)),
"currentOnly"!==this.options.load&&f(this.getLanguagePartFromCode(a))):"string"==typeof a&&f(this.formatLanguageCode(a)),
d.forEach(function(a){e.indexOf(a)<0&&f(c.formatLanguageCode(a))}),e},a}();b.a=g},function(a,b,c){"use strict"
;function d(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function e(){var a={}
;return g.forEach(function(b){b.lngs.forEach(function(c){a[c]={numbers:b.nr,plurals:h[b.fc]}})}),a}var f=c(10),g=[{
lngs:["ach","ak","am","arn","br","fil","gun","ln","mfe","mg","mi","oc","pt","pt-BR","tg","ti","tr","uz","wa"],nr:[1,2],
fc:1},{
lngs:["af","an","ast","az","bg","bn","ca","da","de","dev","el","en","eo","es","et","eu","fi","fo","fur","fy","gl","gu","ha","he","hi","hu","hy","ia","it","kn","ku","lb","mai","ml","mn","mr","nah","nap","nb","ne","nl","nn","no","nso","pa","pap","pms","ps","pt-PT","rm","sco","se","si","so","son","sq","sv","sw","ta","te","tk","ur","yo"],
nr:[1,2],fc:2},{
lngs:["ay","bo","cgg","fa","id","ja","jbo","ka","kk","km","ko","ky","lo","ms","sah","su","th","tt","ug","vi","wo","zh"],
nr:[1],fc:3},{lngs:["be","bs","dz","hr","ru","sr","uk"],nr:[1,2,5],fc:4},{lngs:["ar"],nr:[0,1,2,3,11,100],fc:5},{
lngs:["cs","sk"],nr:[1,2,5],fc:6},{lngs:["csb","pl"],nr:[1,2,5],fc:7},{lngs:["cy"],nr:[1,2,3,8],fc:8},{lngs:["fr"],
nr:[1,2],fc:9},{lngs:["ga"],nr:[1,2,3,7,11],fc:10},{lngs:["gd"],nr:[1,2,3,20],fc:11},{lngs:["is"],nr:[1,2],fc:12},{
lngs:["jv"],nr:[0,1],fc:13},{lngs:["kw"],nr:[1,2,3,4],fc:14},{lngs:["lt"],nr:[1,2,10],fc:15},{lngs:["lv"],nr:[1,2,0],
fc:16},{lngs:["mk"],nr:[1,2],fc:17},{lngs:["mnk"],nr:[0,1,2],fc:18},{lngs:["mt"],nr:[1,2,11,20],fc:19},{lngs:["or"],
nr:[2,1],fc:2},{lngs:["ro"],nr:[1,2,20],fc:20},{lngs:["sl"],nr:[5,1,2,3],fc:21}],h={1:function(a){return Number(a>1)},
2:function(a){return Number(1!=a)},3:function(a){return 0},4:function(a){
return Number(a%10==1&&a%100!=11?0:a%10>=2&&a%10<=4&&(a%100<10||a%100>=20)?1:2)},5:function(a){
return Number(0===a?0:1==a?1:2==a?2:a%100>=3&&a%100<=10?3:a%100>=11?4:5)},6:function(a){
return Number(1==a?0:a>=2&&a<=4?1:2)},7:function(a){return Number(1==a?0:a%10>=2&&a%10<=4&&(a%100<10||a%100>=20)?1:2)},
8:function(a){return Number(1==a?0:2==a?1:8!=a&&11!=a?2:3)},9:function(a){return Number(a>=2)},10:function(a){
return Number(1==a?0:2==a?1:a<7?2:a<11?3:4)},11:function(a){return Number(1==a||11==a?0:2==a||12==a?1:a>2&&a<20?2:3)},
12:function(a){return Number(a%10!=1||a%100==11)},13:function(a){return Number(0!==a)},14:function(a){
return Number(1==a?0:2==a?1:3==a?2:3)},15:function(a){
return Number(a%10==1&&a%100!=11?0:a%10>=2&&(a%100<10||a%100>=20)?1:2)},16:function(a){
return Number(a%10==1&&a%100!=11?0:0!==a?1:2)},17:function(a){return Number(1==a||a%10==1?0:1)},18:function(a){
return Number(0==a?0:1==a?1:2)},19:function(a){return Number(1==a?0:0===a||a%100>1&&a%100<11?1:a%100>10&&a%100<20?2:3)},
20:function(a){return Number(1==a?0:0===a||a%100>0&&a%100<20?1:2)},21:function(a){
return Number(a%100==1?1:a%100==2?2:a%100==3||a%100==4?3:0)},22:function(a){
return Number(1===a?0:2===a?1:(a<0||a>10)&&a%10==0?2:3)}},i=function(){function a(b){
var c=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};d(this,a),this.languageUtils=b,this.options=c,
this.logger=f.a.create("pluralResolver"),this.rules=e()}return a.prototype.addRule=function(a,b){this.rules[a]=b},
a.prototype.getRule=function(a){return this.rules[a]||this.rules[this.languageUtils.getLanguagePartFromCode(a)]},
a.prototype.needsPlural=function(a){var b=this.getRule(a);return b&&b.numbers.length>1},
a.prototype.getPluralFormsOfKey=function(a,b){var c=this,d=[],e=this.getRule(a);return e?(e.numbers.forEach(function(e){
var f=c.getSuffix(a,e);d.push(""+b+f)}),d):d},a.prototype.getSuffix=function(a,b){var c=this,d=this.getRule(a);if(d){
var e=d.noAbs?d.plurals(b):d.plurals(Math.abs(b)),f=d.numbers[e]
;this.options.simplifyPluralSuffix&&2===d.numbers.length&&1===d.numbers[0]&&(2===f?f="plural":1===f&&(f=""))
;var g=function(){return c.options.prepend&&f.toString()?c.options.prepend+f.toString():f.toString()}
;return"v1"===this.options.compatibilityJSON?1===f?"":"number"==typeof f?"_plural_"+f.toString():g():"v2"===this.options.compatibilityJSON&&2===d.numbers.length&&1===d.numbers[0]?g():this.options.simplifyPluralSuffix&&2===d.numbers.length&&1===d.numbers[0]?g():this.options.prepend&&e.toString()?this.options.prepend+e.toString():e.toString()
}return this.logger.warn("no plural rule found for: "+a),""},a}();b.a=i},function(a,b,c){"use strict";function d(a,b){
if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}
var e=c(22),f=c(10),g=Object.assign||function(a){for(var b=1;b<arguments.length;b++){var c=arguments[b]
;for(var d in c)Object.prototype.hasOwnProperty.call(c,d)&&(a[d]=c[d])}return a},h=function(){function a(){
var b=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};d(this,a),this.logger=f.a.create("interpolator"),
this.init(b,!0)}return a.prototype.init=function(){var a=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{}
;arguments[1]&&(this.options=a,this.format=a.interpolation&&a.interpolation.format||function(a){return a}),
a.interpolation||(a.interpolation={escapeValue:!0});var b=a.interpolation;this.escape=void 0!==b.escape?b.escape:e.c,
this.escapeValue=void 0===b.escapeValue||b.escapeValue,
this.useRawValueToEscape=void 0!==b.useRawValueToEscape&&b.useRawValueToEscape,
this.prefix=b.prefix?e.g(b.prefix):b.prefixEscaped||"{{",this.suffix=b.suffix?e.g(b.suffix):b.suffixEscaped||"}}",
this.formatSeparator=b.formatSeparator?b.formatSeparator:b.formatSeparator||",",
this.unescapePrefix=b.unescapeSuffix?"":b.unescapePrefix||"-",
this.unescapeSuffix=this.unescapePrefix?"":b.unescapeSuffix||"",
this.nestingPrefix=b.nestingPrefix?e.g(b.nestingPrefix):b.nestingPrefixEscaped||e.g("$t("),
this.nestingSuffix=b.nestingSuffix?e.g(b.nestingSuffix):b.nestingSuffixEscaped||e.g(")"),
this.maxReplaces=b.maxReplaces?b.maxReplaces:1e3,this.resetRegExp()},a.prototype.reset=function(){
this.options&&this.init(this.options)},a.prototype.resetRegExp=function(){var a=this.prefix+"(.+?)"+this.suffix
;this.regexp=new RegExp(a,"g");var b=""+this.prefix+this.unescapePrefix+"(.+?)"+this.unescapeSuffix+this.suffix
;this.regexpUnescape=new RegExp(b,"g");var c=this.nestingPrefix+"(.+?)"+this.nestingSuffix
;this.nestingRegexp=new RegExp(c,"g")},a.prototype.interpolate=function(a,b,c,d){function f(a){
return a.replace(/\$/g,"$$$$")}var g=this,h=void 0,i=void 0,j=void 0,k=function(a){
if(a.indexOf(g.formatSeparator)<0)return e.d(b,a)
;var d=a.split(g.formatSeparator),f=d.shift().trim(),h=d.join(g.formatSeparator).trim();return g.format(e.d(b,f),h,c)}
;this.resetRegExp();var l=d&&d.missingInterpolationHandler||this.options.missingInterpolationHandler
;for(j=0;(h=this.regexpUnescape.exec(a))&&(i=k(h[1].trim()),a=a.replace(h[0],i),this.regexpUnescape.lastIndex=0,
!(++j>=this.maxReplaces)););for(j=0;h=this.regexp.exec(a);){if(void 0===(i=k(h[1].trim())))if("function"==typeof l){
var m=l(a,h);i="string"==typeof m?m:""
}else this.logger.warn("missed to pass in variable "+h[1]+" for interpolating "+a),
i="";else"string"==typeof i||this.useRawValueToEscape||(i=e.e(i));if(i=f(this.escapeValue?this.escape(i):i),
a=a.replace(h[0],i),this.regexp.lastIndex=0,++j>=this.maxReplaces)break}return a},a.prototype.nest=function(a,b){
function c(a,b){if(a.indexOf(",")<0)return a;var c=a.split(",");a=c.shift();var d=c.join(",");d=this.interpolate(d,i),
d=d.replace(/'/g,'"');try{i=JSON.parse(d),b&&(i=g({},b,i))}catch(b){
this.logger.error("failed parsing options string in nesting for key "+a,b)}return a}
var d=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},f=void 0,h=void 0,i=g({},d)
;for(i.applyPostProcessor=!1;f=this.nestingRegexp.exec(a);){
if((h=b(c.call(this,f[1].trim(),i),i))&&f[0]===a&&"string"!=typeof h)return h;"string"!=typeof h&&(h=e.e(h)),
h||(this.logger.warn("missed to resolve "+f[1]+" for nesting "+a),h=""),a=a.replace(f[0],h),this.regexp.lastIndex=0}
return a},a}();b.a=h},function(a,b,c){"use strict";function d(a,b){
for(var c=Object.getOwnPropertyNames(b),d=0;d<c.length;d++){var e=c[d],f=Object.getOwnPropertyDescriptor(b,e)
;f&&f.configurable&&void 0===a[e]&&Object.defineProperty(a,e,f)}return a}function e(a,b){
if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function f(a,b){
if(!a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
;return!b||"object"!=typeof b&&"function"!=typeof b?a:b}function g(a,b){
if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function, not "+typeof b)
;a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,enumerable:!1,writable:!0,configurable:!0}}),
b&&(Object.setPrototypeOf?Object.setPrototypeOf(a,b):d(a,b))}function h(a,b){
for(var c=a.indexOf(b);-1!==c;)a.splice(c,1),c=a.indexOf(b)}var i=c(22),j=c(10),k=c(21),l=Object.assign||function(a){
for(var b=1;b<arguments.length;b++){var c=arguments[b]
;for(var d in c)Object.prototype.hasOwnProperty.call(c,d)&&(a[d]=c[d])}return a},m=function(){function a(a,b){
var c=[],d=!0,e=!1,f=void 0;try{for(var g,h=a[Symbol.iterator]();!(d=(g=h.next()).done)&&(c.push(g.value),
!b||c.length!==b);d=!0);}catch(a){e=!0,f=a}finally{try{!d&&h.return&&h.return()}finally{if(e)throw f}}return c}
return function(b,c){if(Array.isArray(b))return b;if(Symbol.iterator in Object(b))return a(b,c)
;throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),n=function(a){function b(c,d,g){
var h=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{};e(this,b);var i=f(this,a.call(this));return i.backend=c,
i.store=d,i.languageUtils=g.languageUtils,i.options=h,i.logger=j.a.create("backendConnector"),i.state={},i.queue=[],
i.backend&&i.backend.init&&i.backend.init(g,h.backend,h),i}return g(b,a),b.prototype.queueLoad=function(a,b,c,d){
var e=this,f=[],g=[],h=[],i=[];return a.forEach(function(a){var d=!0;b.forEach(function(b){var h=a+"|"+b
;!c.reload&&e.store.hasResourceBundle(a,b)?e.state[h]=2:e.state[h]<0||(1===e.state[h]?g.indexOf(h)<0&&g.push(h):(e.state[h]=1,
d=!1,g.indexOf(h)<0&&g.push(h),f.indexOf(h)<0&&f.push(h),i.indexOf(b)<0&&i.push(b)))}),d||h.push(a)}),
(f.length||g.length)&&this.queue.push({pending:g,loaded:{},errors:[],callback:d}),{toLoad:f,pending:g,toLoadLanguages:h,
toLoadNamespaces:i}},b.prototype.loaded=function(a,b,c){var d=a.split("|"),e=m(d,2),f=e[0],g=e[1]
;b&&this.emit("failedLoading",f,g,b),c&&this.store.addResourceBundle(f,g,c),this.state[a]=b?-1:2;var j={}
;this.queue.forEach(function(c){i.f(c.loaded,[f],g),h(c.pending,a),b&&c.errors.push(b),
0!==c.pending.length||c.done||(Object.keys(c.loaded).forEach(function(a){j[a]||(j[a]=[]),
c.loaded[a].length&&c.loaded[a].forEach(function(b){j[a].indexOf(b)<0&&j[a].push(b)})}),c.done=!0,
c.errors.length?c.callback(c.errors):c.callback())}),this.emit("loaded",j),this.queue=this.queue.filter(function(a){
return!a.done})},b.prototype.read=function(a,b,c){
var d=arguments.length>3&&void 0!==arguments[3]?arguments[3]:0,e=this,f=arguments.length>4&&void 0!==arguments[4]?arguments[4]:250,g=arguments[5]
;return a.length?this.backend[c](a,b,function(h,i){if(h&&i&&d<5)return void setTimeout(function(){
e.read.call(e,a,b,c,d+1,2*f,g)},f);g(h,i)}):g(null,{})},b.prototype.prepareLoading=function(a,b){
var c=this,d=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},e=arguments[3]
;if(!this.backend)return this.logger.warn("No backend was added via i18next.use. Will not load resources."),e&&e()
;"string"==typeof a&&(a=this.languageUtils.toResolveHierarchy(a)),"string"==typeof b&&(b=[b])
;var f=this.queueLoad(a,b,d,e);if(!f.toLoad.length)return f.pending.length||e(),null;f.toLoad.forEach(function(a){
c.loadOne(a)})},b.prototype.load=function(a,b,c){this.prepareLoading(a,b,{},c)},b.prototype.reload=function(a,b,c){
this.prepareLoading(a,b,{reload:!0},c)},b.prototype.loadOne=function(a){
var b=this,c=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",d=a.split("|"),e=m(d,2),f=e[0],g=e[1]
;this.read(f,g,"read",null,null,function(d,e){d&&b.logger.warn(c+"loading namespace "+g+" for language "+f+" failed",d),
!d&&e&&b.logger.log(c+"loaded namespace "+g+" for language "+f,e),b.loaded(a,d,e)})},
b.prototype.saveMissing=function(a,b,c,d,e){var f=arguments.length>5&&void 0!==arguments[5]?arguments[5]:{}
;this.backend&&this.backend.create&&this.backend.create(a,b,c,d,null,l({},f,{isUpdate:e})),
a&&a[0]&&this.store.addResource(a[0],b,c,d)},b}(k.a);b.a=n},function(a,b,c){"use strict";function d(){return{debug:!1,
initImmediate:!0,ns:["translation"],defaultNS:["translation"],fallbackLng:["dev"],fallbackNS:!1,whitelist:!1,
nonExplicitWhitelist:!1,load:"all",preload:!1,simplifyPluralSuffix:!0,keySeparator:".",nsSeparator:":",
pluralSeparator:"_",contextSeparator:"_",saveMissing:!1,updateMissing:!1,saveMissingTo:"fallback",saveMissingPlurals:!0,
missingKeyHandler:!1,missingInterpolationHandler:!1,postProcess:!1,returnNull:!0,returnEmptyString:!0,returnObjects:!1,
joinArrays:!1,returnedObjectHandler:function(){},parseMissingKeyHandler:!1,appendNamespaceToMissingKey:!1,
appendNamespaceToCIMode:!1,overloadTranslationOptionHandler:function(a){var b={};return a[1]&&(b.defaultValue=a[1]),
a[2]&&(b.tDescription=a[2]),b},interpolation:{escapeValue:!0,format:function(a,b,c){return a},prefix:"{{",suffix:"}}",
formatSeparator:",",unescapePrefix:"-",nestingPrefix:"$t(",nestingSuffix:")",maxReplaces:1e3}}}function e(a){
return"string"==typeof a.ns&&(a.ns=[a.ns]),"string"==typeof a.fallbackLng&&(a.fallbackLng=[a.fallbackLng]),
"string"==typeof a.fallbackNS&&(a.fallbackNS=[a.fallbackNS]),
a.whitelist&&a.whitelist.indexOf("cimode")<0&&(a.whitelist=a.whitelist.concat(["cimode"])),a}c.d(b,"a",function(){
return d}),b.b=e},function(a,b,c){a.exports=c(98).default},function(a,b,c){"use strict";function d(a){
return a&&a.__esModule?a:{default:a}}function e(a){if(a&&a.__esModule)return a;var b={}
;if(null!=a)for(var c in a)Object.prototype.hasOwnProperty.call(a,c)&&(b[c]=a[c]);return b.default=a,b}function f(a,b){
if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function g(){return{
order:["querystring","cookie","localStorage","navigator","htmlTag"],lookupQuerystring:"lng",lookupCookie:"i18next",
lookupLocalStorage:"i18nextLng",caches:["localStorage"],excludeCacheFor:["cimode"]}}
Object.defineProperty(b,"__esModule",{value:!0});var h=function(){function a(a,b){for(var c=0;c<b.length;c++){var d=b[c]
;d.enumerable=d.enumerable||!1,d.configurable=!0,"value"in d&&(d.writable=!0),Object.defineProperty(a,d.key,d)}}
return function(b,c,d){return c&&a(b.prototype,c),d&&a(b,d),b}
}(),i=c(99),j=e(i),k=c(100),l=d(k),m=c(101),n=d(m),o=c(102),p=d(o),q=c(103),r=d(q),s=c(104),t=d(s),u=c(105),v=d(u),w=c(106),x=d(w),y=function(){
function a(b){var c=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};f(this,a),this.type="languageDetector",
this.detectors={},this.init(b,c)}return h(a,[{key:"init",value:function(a){
var b=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},c=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{}
;this.services=a,
this.options=j.defaults(b,this.options||{},g()),this.options.lookupFromUrlIndex&&(this.options.lookupFromPathIndex=this.options.lookupFromUrlIndex),
this.i18nOptions=c,this.addDetector(l.default),this.addDetector(n.default),this.addDetector(p.default),
this.addDetector(r.default),this.addDetector(t.default),this.addDetector(v.default),this.addDetector(x.default)}},{
key:"addDetector",value:function(a){this.detectors[a.name]=a}},{key:"detect",value:function(a){var b=this
;a||(a=this.options.order);var c=[];a.forEach(function(a){if(b.detectors[a]){var d=b.detectors[a].lookup(b.options)
;d&&"string"==typeof d&&(d=[d]),d&&(c=c.concat(d))}});var d=void 0;if(c.forEach(function(a){if(!d){
var c=b.services.languageUtils.formatLanguageCode(a);b.services.languageUtils.isWhitelisted(c)&&(d=c)}}),!d){
var e=this.i18nOptions.fallbackLng
;"string"==typeof e&&(e=[e]),e||(e=[]),d="[object Array]"===Object.prototype.toString.apply(e)?e[0]:e[0]||e.default&&e.default[0]
}return d}},{key:"cacheUserLanguage",value:function(a,b){var c=this;b||(b=this.options.caches),
b&&(this.options.excludeCacheFor&&this.options.excludeCacheFor.indexOf(a)>-1||b.forEach(function(b){
c.detectors[b]&&c.detectors[b].cacheUserLanguage(a,c.options)}))}}]),a}();y.type="languageDetector",b.default=y
},function(a,b,c){"use strict";function d(a){return g.call(h.call(arguments,1),function(b){
if(b)for(var c in b)void 0===a[c]&&(a[c]=b[c])}),a}function e(a){return g.call(h.call(arguments,1),function(b){
if(b)for(var c in b)a[c]=b[c]}),a}Object.defineProperty(b,"__esModule",{value:!0}),b.defaults=d,b.extend=e
;var f=[],g=f.forEach,h=f.slice},function(a,b,c){"use strict";Object.defineProperty(b,"__esModule",{value:!0});var d={
create:function(a,b,c,d){var e=void 0;if(c){var f=new Date;f.setTime(f.getTime()+60*c*1e3),
e="; expires="+f.toGMTString()}else e="";d=d?"domain="+d+";":"",document.cookie=a+"="+b+e+";"+d+"path=/"},
read:function(a){for(var b=a+"=",c=document.cookie.split(";"),d=0;d<c.length;d++){
for(var e=c[d];" "===e.charAt(0);)e=e.substring(1,e.length);if(0===e.indexOf(b))return e.substring(b.length,e.length)}
return null},remove:function(a){this.create(a,"",-1)}};b.default={name:"cookie",lookup:function(a){var b=void 0
;if(a.lookupCookie&&"undefined"!=typeof document){var c=d.read(a.lookupCookie);c&&(b=c)}return b},
cacheUserLanguage:function(a,b){
b.lookupCookie&&"undefined"!=typeof document&&d.create(b.lookupCookie,a,b.cookieMinutes,b.cookieDomain)}}
},function(a,b,c){"use strict";Object.defineProperty(b,"__esModule",{value:!0}),b.default={name:"querystring",
lookup:function(a){var b=void 0
;if("undefined"!=typeof window)for(var c=window.location.search.substring(1),d=c.split("&"),e=0;e<d.length;e++){
var f=d[e].indexOf("=");if(f>0){var g=d[e].substring(0,f);g===a.lookupQuerystring&&(b=d[e].substring(f+1))}}return b}}
},function(a,b,c){"use strict";Object.defineProperty(b,"__esModule",{value:!0});var d=void 0;try{
d="undefined"!==window&&null!==window.localStorage;var e="i18next.translate.boo";window.localStorage.setItem(e,"foo"),
window.localStorage.removeItem(e)}catch(a){d=!1}b.default={name:"localStorage",lookup:function(a){var b=void 0
;if(a.lookupLocalStorage&&d){var c=window.localStorage.getItem(a.lookupLocalStorage);c&&(b=c)}return b},
cacheUserLanguage:function(a,b){b.lookupLocalStorage&&d&&window.localStorage.setItem(b.lookupLocalStorage,a)}}
},function(a,b,c){"use strict";Object.defineProperty(b,"__esModule",{value:!0}),b.default={name:"navigator",
lookup:function(a){var b=[];if("undefined"!=typeof navigator){
if(navigator.languages)for(var c=0;c<navigator.languages.length;c++)b.push(navigator.languages[c])
;navigator.userLanguage&&b.push(navigator.userLanguage),navigator.language&&b.push(navigator.language)}
return b.length>0?b:void 0}}},function(a,b,c){"use strict";Object.defineProperty(b,"__esModule",{value:!0}),b.default={
name:"htmlTag",lookup:function(a){var b=void 0,c=a.htmlTag||("undefined"!=typeof document?document.documentElement:null)
;return c&&"function"==typeof c.getAttribute&&(b=c.getAttribute("lang")),b}}},function(a,b,c){"use strict"
;Object.defineProperty(b,"__esModule",{value:!0}),b.default={name:"path",lookup:function(a){var b=void 0
;if("undefined"!=typeof window){var c=window.location.pathname.match(/\/([a-zA-Z-]*)/g)
;if(c instanceof Array)if("number"==typeof a.lookupFromPathIndex){if("string"!=typeof c[a.lookupFromPathIndex])return
;b=c[a.lookupFromPathIndex].replace("/","")}else b=c[0].replace("/","")}return b}}},function(a,b,c){"use strict"
;Object.defineProperty(b,"__esModule",{value:!0}),b.default={name:"subdomain",lookup:function(a){var b=void 0
;if("undefined"!=typeof window){var c=window.location.href.match(/(?:http[s]*\:\/\/)*(.*?)\.(?=[^\/]*\..{2,5})/gi)
;c instanceof Array&&(b="number"==typeof a.lookupFromSubdomainIndex?c[a.lookupFromSubdomainIndex].replace("http://","").replace("https://","").replace(".",""):c[0].replace("http://","").replace("https://","").replace(".",""))
}return b}}},function(a,b,c){"use strict";var d=c(52),e=c(108),f=c(109),g={"en-US":{translation:d,label:"English (USA)",
mobileLabel:"EN",momentLocale:"en",published:!0},"fr-FR":{translation:e,label:"Fran\xe7ais (France)",mobileLabel:"Fr",
momentLocale:"fr",published:!0},dev:{translation:f,label:"Development",mobileLabel:"Dev",momentLocale:"fr",published:!1}
};a.exports=g},function(a,b){a.exports={
ACTIVATE_FOR_ATTACHMENTS:'Vous devez activer votre compte aupr\xe8s de Virtru pour pouvoir envoyer des pi\xe8ces jointes s\xe9curis\xe9es. Pour proc\xe9der \xe0 l\u2019activation, cliquez sur le bouton "Activer" ci-dessous.',
ACTIVATION_BUTTON_ACTIVATE:"Activer {{currentUser}}",ACTIVATION_BUTTON_REACTIVATE:"R\xe9activer {{currentUser}}",
ACTIVATION_HEADER_USER_NOT_ACTIVATED:"{{currentUser}} n\u2019est pas activ\xe9 pour utiliser Virtru",
ACTIVATION_LINK:"Fonctionnement",
ACTIVATION_SUBTEXT:"Afin de prot\xe9ger votre vie priv\xe9e, nous devons v\xe9rifier r\xe9guli\xe8rement votre identit\xe9. Cela ne prend qu\u2019une minute, la r\xe9activation s\u2019effectue en un clic.",
ACTIVATION_TEXT_ACTIVATE:"ACTIVER VIRTRU POUR<br>R\xc9DIGER DES E-MAILS S\xc9CURIS\xc9S",
ACTIVATION_TEXT_REACTIVATE:"R\xc9ACTIVER VIRTRU POUR CONTINUER",
ACTIVATION_WAIT_CANCELED:'Virtru n\u2019a pas pu authentifier votre compte de messagerie, car l\u2019onglet d\u2019authentification a \xe9t\xe9 ferm\xe9.<br/><br/>Cliquez sur le lien "R\xe9essayer" ci-dessous pour red\xe9marrer le processus.',
ACTIVATION_WAIT_ERROR:"Virtru - Authentification impossible",
ACTIVATION_WAIT_FAILED:'Virtru n\u2019a pas pu authentifier votre compte de messagerie, car les param\xe8tres actuels de votre navigateur n\u2019autorisent pas la cr\xe9ation de cookies, ou car vous avez rejet\xe9 la demande de Virtru de v\xe9rifier votre adresse e-mail.</br><br/>Le processus d\u2019authentification requiert des cookies. Si vous avez modifi\xe9 les param\xe8tres de cookies par d\xe9faut de votre navigateur, configurez ce dernier de fa\xe7on \xe0 autoriser tous les cookies, puis cliquez sur le bouton "R\xe9essayer". Une fois votre compte authentifi\xe9, vous pouvez r\xe9activer les limitations de cookies et continuer \xe0 utiliser Virtru.</br><br/>Virtru demande l\u2019autorisation "Voir votre adresse e-mail" \xe0 votre fournisseur de messagerie Web afin de v\xe9rifier que vous poss\xe9dez bien le compte que vous activez. Pour plus d\u2019informations sur la fa\xe7on dont nous utilisons votre adresse e-mail, consultez nos <a href="https://www.virtru.com/terms-of-service" target="_blank">Conditions de service<a/> et notre <a href="https://www.virtru.com/privacy-policy" target="_blank">Politique de confidentialit\xe9</a>. Cliquez sur le bouton "R\xe9essayer" pour accorder cette autorisation.',
ACTIVATION_WAIT_HEADER:"Virtru - Authentification en cours...",
ACTIVATION_WAIT_IN_PRIVATE:'Virtru n\u2019a pas pu authentifier votre compte de messagerie, car votre navigateur est en mode priv\xe9, \xe9galement appel\xe9 mode "Incognito" ou "InPrivate". Le processus d\u2019authentification requiert des cookies, qui sont limit\xe9s en mode priv\xe9.</br><br/>Pour continuer, d\xe9sactivez le mode priv\xe9, et revenez \xe0 votre fen\xeatre ou onglet de messagerie Web pour red\xe9marrer le processus d\u2019authentification.</br><br/>Une fois votre compte authentifi\xe9, vous pouvez r\xe9activer le mode priv\xe9 et continuer \xe0 utiliser Virtru.',
ACTIVATION_WAIT_MESSAGE:"Virtru est toujours en train d\u2019authentifier votre compte de messagerie sur ce navigateur. Tant que l\u2019authentification n\u2019est pas termin\xe9e, vous ne pouvez pas envoyer ou lire des messages s\xe9curis\xe9s.</br><br/>Revenez \xe0 l\u2019onglet d\u2019authentification et terminez le processus.",
ANIMATION_WIDGET_LOADING_TEXT:"D\xe9chiffrement de l'e-mail",
ATTACHMENTS_UPLOADING_NO_SEND:"Le t\xe9l\xe9chargement des pi\xe8ces jointes doit \xeatre termin\xe9 avant de lancer l\u2019envoi.",
ATTACHMENT_ANIMATION_LABEL:"Chiffrement des pi\xe8ces jointes",
ATTACHMENT_APPID_ERROR_HEADER:"Activation arriv\xe9e \xe0 expiration",
ATTACHMENT_APPID_ERROR_TEXT:"Votre activation ayant expir\xe9, nous ne pouvons pas t\xe9l\xe9charger votre pi\xe8ce jointe. Pour votre s\xe9curit\xe9, actualisez la page et r\xe9essayez.",
ATTACHMENT_APPID_ERROR_TITLE:"Erreur de pi\xe8ce jointe",
ATTACHMENT_CONNECTION_ERROR_HEADER:"Aucune connexion r\xe9seau",
ATTACHMENT_CONNECTION_ERROR_TEXT:"Un probl\xe8me est survenu lors du t\xe9l\xe9chargement de votre pi\xe8ce jointe. V\xe9rifiez votre connexion et r\xe9essayez.",
ATTACHMENT_CONNECTION_ERROR_TITLE:"Erreur de pi\xe8ce jointe",
ATTACHMENT_ERROR_CORRUPT:"La pi\xe8ce jointe est corrompue et ne peut pas \xeatre d\xe9chiffr\xe9e. Demandez \xe0 l\u2019exp\xe9diteur de renvoyer la pi\xe8ce jointe.",
ATTACHMENT_ERROR_EXPIRED:"La date d\u2019expiration a \xe9t\xe9 d\xe9pass\xe9e pour ce fichier. L\u2019acc\xe8s au fichier n\u2019est plus autoris\xe9.",
ATTACHMENT_ERROR_REVOKED:"L\u2019acc\xe8s \xe0 ce fichier a \xe9t\xe9 r\xe9voqu\xe9 par l\u2019exp\xe9diteur.",
ATTACHMENT_ERROR_UNAUTHORIZED:"Vous n\u2019\xeates pas autoris\xe9 \xe0 acc\xe9der \xe0 ce fichier.",
ATTACHMENT_ERROR_UNKNOWN:"Une erreur est survenue et Virtru n\u2019a pas pu t\xe9l\xe9charger ou d\xe9chiffrer ce fichier. Veuillez r\xe9essayer ult\xe9rieurement.",
ATTACHMENT_GENERIC_ERROR_BUTTON:"Ignorer",ATTACHMENT_GENERIC_ERROR_HEADER:"Erreur de pi\xe8ce jointe",
ATTACHMENT_GENERIC_ERROR_TEXT:"Un probl\xe8me est survenu lors du t\xe9l\xe9chargement de votre pi\xe8ce jointe. V\xe9rifiez votre connexion et r\xe9essayez.",
ATTACHMENT_GENERIC_ERROR_TITLE:"Erreur",
ATTACHMENT_INTEGRITY_COMPROMISED:"Virtru ne peut pas d\xe9chiffrer cette pi\xe8ce jointe. Cette situation a g\xe9n\xe9ralement lieu lorsque le texte chiffr\xe9 d\u2019un message a \xe9t\xe9 modifi\xe9, ce qui rend le chiffrement illisible.",
ATTACHMENT_NOT_READY_ERROR:"Pi\xe8ce jointe non pr\xeate",
ATTACHMENT_TOO_LARGE_HEADER:"Une pi\xe8ce jointe est trop volumineuse",
ATTACHMENT_TOO_LARGE_TEXT:"Certaines pi\xe8ces jointes sont trop volumineuses pour \xeatre chiffr\xe9es. Joignez des fichiers d\u2019une taille inf\xe9rieure \xe0 {{maxSizeMb}}\xa0Mo.",
ATTACHMENT_TOO_LARGE_TITLE:"Pi\xe8ce jointe trop volumineuse",
CANNOT_DECRYPT_GET_HELP:"Pour en savoir plus, consultez la FAQ de Virtru.",
CANNOT_DECRYPT_HEADER:"Message probablement modifi\xe9",
CANNOT_DECRYPT_MESSAGE_CKS:'Le serveur de chiffrement {{ownerName}} est inaccessible.<br/>Pour obtenir de l\u2019aide, <a href="{{ownerSupportUrl}}">contactez le <br/>support technique {{ownerName}}</a>.',
CANNOT_DECRYPT_MESSAGE_INTEGRITY_COMPROMISED:'Virtru a d\xe9tect\xe9 que ce message a peut-\xeatre \xe9t\xe9 falsifi\xe9. Essayez de demander \xe0 <span class="vic-message-bold">{{sender}}</span> de renvoyer le message.',
CHROME_POPUP_ABOUT_VIRTRU_BUTTON:"\xc0 propos de Virtru",
CHROME_POPUP_ACTIVATION_BUTTON:"Activer Virtru pour <code>{{userId}}</code>",
CHROME_POPUP_ACTIVATION_LABEL:"Utilisation de Virtru avec {{userId}}",CHROME_POPUP_LOGOUT_BUTTON:"Se d\xe9connecter",
CHROME_POPUP_SETTINGS_BUTTON:"Param\xe8tres",CHROME_POPUP_SUPPORT_BUTTON:"Support technique",
CHROME_POPUP_UNINSTALL_BUTTON:"D\xe9sinstaller",COMMON_CANCEL:"Annuler",COMMON_OK:"OK",
COMMON_SAVE_CHANGES:"ENREGISTRER LES MODIFICATIONS",COMMON_SEND:"Envoyer",COMMON_SEND_SECURE:"S\xe9curiser l'envoi",
COMMON_TRY_AGAIN:"R\xe9essayer",COMPOSE_ACTIVATION_REQUIRED:"Activation requise par Virtru",
COMPOSE_ATTACHMENTS_ON_REMOVE:"Si le mode s\xe9curis\xe9 est activ\xe9, toutes les pi\xe8ces jointes existantes seront supprim\xe9es et devront \xeatre jointes \xe0 nouveau. Voulez-vous vraiment effectuer cette op\xe9ration\xa0?",
COMPOSE_ATTACHMENTS_REMOVE_WARN:"Vous devez supprimer les pi\xe8ces jointes avant d\u2019activer la protection Virtru.",
COMPOSE_ATTACHMENTS_UPLOADING_WARN:"Le mode s\xe9curis\xe9 ne peut pas \xeatre modifi\xe9 pendant le t\xe9l\xe9chargement des pi\xe8ces jointes. Attendez la fin du t\xe9l\xe9chargement des pi\xe8ces jointes, puis modifiez le mode s\xe9curis\xe9.",
COMPOSE_DRIVE_ATTACHMENTS_UNSUPPORTED:"Virtru ne prend pas en charge les pi\xe8ces jointes Drive actuellement. Voulez-vous les supprimer\xa0?",
COMPOSE_EXPIRES:"expiration\xa0: {{timeRemaining}}",
COMPOSE_INLINE_IMAGES_NOT_SUPPORTED:"Les pi\xe8ces jointes int\xe9gr\xe9es ne sont actuellement pas prises en charge par Virtru. Voulez-vous les supprimer\xa0?",
COMPOSE_INSERT_DRIVE_INSERT_FILE:"L\u2019insertion de fichiers \xe0 partir de Google\xa0Drive n\u2019est pas prise en charge en mode s\xe9curis\xe9.",
COMPOSE_INSERT_PHOTOS_INLINE_IMAGES:"Actuellement, Virtru ne prend pas en charge les images int\xe9gr\xe9es.",
COMPOSE_OFF_CONFIRM_REMOVE:"Si le mode s\xe9curis\xe9 est d\xe9sactiv\xe9, toutes les pi\xe8ces jointes s\xe9curis\xe9es seront supprim\xe9es. Voulez-vous vraiment effectuer cette op\xe9ration\xa0?",
COMPOSE_ONBOARDING1_BUTTON_NEXT:"Suivant",COMPOSE_ONBOARDING1_STEP1_DESCRIPTION:"Activer la s\xe9curit\xe9 Virtru",
COMPOSE_ONBOARDING1_STEP1_FOOTER:"Lorsque vous cr\xe9ez un e-mail ou y r\xe9pondez, veillez \xe0 activer la s\xe9curit\xe9 Virtru dans l\u2019angle sup\xe9rieur droit du champ de r\xe9daction afin de prot\xe9ger et de chiffrer votre message et ses pi\xe8ces jointes.",
COMPOSE_ONBOARDING1_STEP2_DESCRIPTION:"Personnaliser votre message de s\xe9curit\xe9",
COMPOSE_ONBOARDING1_STEP2_FOOTER:'Une fois que vous avez r\xe9dig\xe9 votre message s\xe9curis\xe9, appuyez tout simplement sur le bouton "Envoi s\xe9curis\xe9" pour envoyer votre e-mail prot\xe9g\xe9.',
COMPOSE_ONBOARDING1_TITLE:"Bienvenue\xa0! Il est temps de vous lancer.",COMPOSE_ONBOARDING2_BUTTON_DONE:"Termin\xe9",
COMPOSE_ONBOARDING2_STEP3_DESCRIPTION:"Personnaliser votre message de s\xe9curit\xe9",
COMPOSE_ONBOARDING2_STEP3_FOOTER:"Lorsque votre destinataire re\xe7oit un e-mail s\xe9curis\xe9 de votre part pour la premi\xe8re fois, il obtient ce message de s\xe9curit\xe9. Celui-ci permet \xe0 vos coll\xe8gues de comprendre comment ouvrir vos messages s\xe9curis\xe9s. N\u2019h\xe9sitez pas \xe0 le personnaliser, m\xeame si vous pouvez le conserver tel quel.",
COMPOSE_ONBOARDING2_STEP3_PREFIX:"Bonjour\xa0! J\u2019utilise Virtru pour s\xe9curiser mes e-mails. Vous devrez cliquer sur le lien ci-dessous et installer le logiciel requis pour consulter mon message en toute s\xe9curit\xe9. Contactez-moi si vous souhaitez v\xe9rifier l\u2019origine de cet e-mail.",
COMPOSE_ONBOARDING2_TITLE:"C\u2019est presque termin\xe9...",
CONTENT_IS_MANAGED:"L\u2019exp\xe9diteur a d\xe9sactiv\xe9 le t\xe9l\xe9chargement pour ce fichier.",
CONTEXTUAL_ACTIVATE_INFO:"Le compte {{currentUser}} n\u2019a pas \xe9t\xe9 activ\xe9 aupr\xe8s de Virtru. Une fois votre compte activ\xe9, votre identit\xe9 est v\xe9rifi\xe9e et Virtru vous envoie les cl\xe9s de d\xe9chiffrement de vos messages s\xe9curis\xe9s. Virtru n\u2019a jamais acc\xe8s \xe0 votre contenu.",
DISMISS_POPOVER_DEFAULT_OPTIONS_TEXT:"Ok, j\u2019ai compris.",DOWNLOAD_ATTACHMENT_DECRYPTING:"D\xe9chiffrement",
EDITOR_FRAME_MESSAGE_BANNER:"Votre e-mail est s\xe9curis\xe9.",
EMAIL_ERROR_EMAIL_CORRUPT:"Ce message est corrompu et ne peut pas \xeatre d\xe9chiffr\xe9. Demandez \xe0 l\u2019exp\xe9diteur de renvoyer le message.",
EMAIL_ERROR_EMAIL_CORRUPT_HEADER:"E-mail corrompu",
EMAIL_ERROR_INTEGRITY_COMPROMISED:"L\u2019int\xe9grit\xe9 de ce message a \xe9t\xe9 compromise.",
EMAIL_ERROR_INTEGRITY_COMPROMISED_HEADER:"Erreur d\u2019int\xe9grit\xe9 compromise",
EMAIL_ERROR_INTERNAL_SERVER_ERROR:"Les serveurs de Virtru n\u2019ont pas r\xe9pondu. Patientez quelques minutes et r\xe9essayez.",
EMAIL_ERROR_INTERNAL_SERVER_ERROR_HEADER:"Erreur du serveur",
EMAIL_ERROR_NETWORK_LOST:"Virtru n\u2019a pas pu se connecter \xe0 Internet. V\xe9rifiez votre connexion Internet et r\xe9essayez.",
EMAIL_ERROR_NETWORK_LOST_HEADER:"Erreur de connexion r\xe9seau",
EMAIL_ERROR_READ:"Le message n\u2019a pas pu \xeatre d\xe9chiffr\xe9. V\xe9rifiez votre connexion Internet et r\xe9essayez.",
EMAIL_ERROR_READ_HEADER:"\xc9chec du d\xe9chiffrement",
EMAIL_ERROR_SEND:"Une erreur est survenue et le message n\u2019a pas pu \xeatre envoy\xe9. V\xe9rifiez votre connexion Internet et r\xe9essayez.",
EMAIL_ERROR_SEND_ENCRYPT_FAILED:"Une erreur est survenue et le message n\u2019a pas pu \xeatre chiffr\xe9. V\xe9rifiez votre connexion Internet et r\xe9essayez.",
EMAIL_ERROR_SEND_ENCRYPT_FAILED_HEADER:"Erreur de chiffrement",EMAIL_ERROR_SEND_HEADER:"Erreur inconnue",
EMAIL_ERROR_SMART_SEND_SECURE:"Une erreur est survenue lors de la tentative d\u2019envoi de votre message. Si le probl\xe8me persiste, contactez Virtru.",
EMAIL_ERROR_SMART_SEND_SECURE_HEADER:"Erreur d\u2019envoi",EMAIL_ERROR_TEMPLATE_SUPPORT_LINK:"Support technique Virtru",
EMAIL_ERROR_UNKNOWN:"Une erreur est survenue et le message n\u2019a pas pu \xeatre lu. V\xe9rifiez votre connexion Internet et r\xe9essayez.",
EMAIL_ERROR_UNKNOWN_HEADER:"Erreur inconnue",
EMAIL_ERROR_YOURE_ON_STAGING:"Attention\xa0! Il semblerait que vous tentiez de lire un e-mail provenant du mauvais serveur (interm\xe9diaire/de production). Consultez la page des options pour conna\xeetre le serveur vers lequel vous pointez. Il se peut qu\u2019il s\u2019agisse d\u2019un serveur incorrect.",
EMAIL_ERROR_YOURE_ON_STAGING_HEADER:"Attention\xa0! Il semblerait que vous tentiez de lire un e-mail provenant de ",
EMAIL_EXPIRATION:"Expire dans\xa0:",EMAIL_EXPIRATION_RESET:"Date d\u2019expiration\xa0:",
EMAIL_INVALID_ADDRESS:'L\u2019adresse "{{invalidAddress}}" n\u2019a pas \xe9t\xe9 reconnue. Assurez-vous que le format de toutes les adresses est correct.',
EMAIL_INVALID_ADDRESS_GENERIC:"Certaines adresses e-mail n\u2019ont pas \xe9t\xe9 reconnues. Assurez-vous que le format de toutes les adresses est correct.",
EMAIL_TEMPLATE_FOOTER:"S\xe9curis\xe9 par Virtru",
EMAIL_TEMPLATE_SENDER_HEADER:"Votre message, prot\xe9g\xe9 par Virtru",
ENCRYPTED_SEARCH_REMINDER_HEADER:"La recherche chiffr\xe9e n\u2019appara\xeetra pas dans les r\xe9sultats de recherche.",
ENCRYPTED_SEARCH_REMINDER_SUBTEXT:"La recherche de corps de messages chiffr\xe9s par Virtru n\u2019est pas activ\xe9e actuellement. Cliquez ici pour l\u2019activer.",
ENHANCEDPDF_DL_DISABLED_TOOLTIP:"L\u2019exp\xe9diteur a d\xe9sactiv\xe9 le t\xe9l\xe9chargement pour ce fichier. Cliquez ci-dessous pour afficher le message dans Virtru Secure\xa0Reader.",
ENHANCEDPDF_DL_DISABLED_TOOLTIP_TITLE:"Protection de PDF am\xe9lior\xe9e",
FEATURE_ENCRYPTED_SEARCH_BUTTON:"Activer \xe0 partir du tableau de bord",
FEATURE_ENCRYPTED_SEARCH_CANCEL:"Pas maintenant",FEATURE_ENCRYPTED_SEARCH_FAQ:"En savoir plus gr\xe2ce \xe0 notre FAQ",
FEATURE_ENCRYPTED_SEARCH_POPUP_DESCRIPTION:'Afin d\u2019activer la recherche de vos e-mails chiffr\xe9s par Virtru, cliquez ci-dessous pour acc\xe9der \xe0 l\u2019onglet "Fonctionnalit\xe9s" de votre Virtru\xa0Dashboard.',
FEATURE_ENCRYPTED_SEARCH_POPUP_HEADER:"Nouvelle fonctionnalit\xe9",
FEATURE_ENCRYPTED_SEARCH_TITLE_TEXT:"Rechercher vos e-mails chiffr\xe9s",
FEATURE_VAULT_ACTION_UPDATE_CANCEL:"Fermer la fen\xeatre",
FEATURE_VAULT_ACTION_UPDATE_POPUP_DESCRIPTION:"L\u2019achat de Google\xa0Vault\xa0Support n\xe9cessite l\u2019aide d\u2019un responsable du support Virtru. Nous vous contacterons rapidement.",
FEATURE_VAULT_ACTION_UPDATE_TITLE_TEXT:"Nous vous contacterons rapidement.",
FEATURE_VAULT_BUTTON:"Obtenir Vault\xa0Support",FEATURE_VAULT_CANCEL:"Non, merci",
FEATURE_VAULT_POPUP_DESCRIPTION:"Vous pouvez d\xe9sormais effectuer des recherches d\u2019e-mails chiffr\xe9s et les d\xe9chiffrer directement dans Google\xa0Vault. Cliquez ci-dessous pour contacter un responsable Virtru et acheter Google Vault E-Discovery Support de Virtru pour votre domaine.",
FEATURE_VAULT_POPUP_HEADER:"Nouvelle fonctionnalit\xe9",
FEATURE_VAULT_TITLE_TEXT:"Rechercher des e-mails Virtru dans Google\xa0Vault",FILE_SIZES:{BYTES:"o",
UNITS:["ko","Mo","Go","To","Po","Eo","Zo","Yo"]},FIRST_TIME_ONBOARD_LINK_ACTIVATE:"Activer",
FOOTER_POPOVER_BODY:"Indiquez \xe0 vos amis et \xe0 vos coll\xe8gues qu\u2019ils peuvent vous envoyer un e-mail en toute s\xe9curit\xe9 avec Virtru.",
FOOTER_POPOVER_HEADER:"Communiquer en toute confidentialit\xe9",
FOOTER_POPOVER_REMOVE_SIGNATURE:" Supprimer de ma signature d\u2019e-mail ",
FOOTER_PROMO:"Vous devez m\u2019envoyer un e-mail priv\xe9\xa0? J\u2019utilise",FOOTER_PROMO_USE:"Virtru",
FORWARDING_RESTRICTED:"- Transfert limit\xe9",
GMAIL_BASIC_MODE_UNSUPPORTED_MAIN:"L\u2019affichage\xa0HTML de base de Gmail n\u2019est pas pris en charge",
GMAIL_BASIC_MODE_UNSUPPORTED_SUB:"Passez en affichage standard pour utiliser Virtru.",
INTEGRITY_SECURITY_NOTICE:"Notification de s\xe9curit\xe9",
INTEGRITY_SENDER_CONTINUE:"Je souhaite quand m\xeame lire ce message",
INTEGRITY_SENDER_ERROR:'\n<p>Cet e-mail a \xe9t\xe9 envoy\xe9 par <span class="virtru-sender-integrity-fail-message-bold">{{expected}}</span>, mais il a \xe9t\xe9 distribu\xe9 par <span class="virtru-sender-integrity-fail-message-bold">{{got}}</span>.</p>\n<p>Si vous ne faites pas confiance \xe0 <span class="virtru-sender-integrity-fail-message-bold">{{got}}</span>, NE CLIQUEZ PAS sur les liens ou les pi\xe8ces jointes.</p>',
INTEGRITY_SUBJECT_ERROR:'<p>Cet e-mail a \xe9t\xe9 envoy\xe9 avec l\u2019objet <span class="virtru-sender-integrity-fail-message-bold">{{expected}}</span>, mais il affiche actuellement l\u2019objet <span class="virtru-sender-integrity-fail-message-bold">{{got}}</span>.</p>\n    <p>Si vous ne faites pas confiance \xe0 l\u2019exp\xe9diteur de ce message, NE CLIQUEZ PAS sur les liens ou les pi\xe8ces jointes.</p>',
INTRO_MESSAGE_FOOTER_TEXT:"Le texte pr\xe9sent au-dessus de cette ligne ne sera pas chiffr\xe9.",
INVITATION_EMAIL_REPLACE_TEXT_DEFAULT:"Il s\u2019agit d\u2019une cha\xeene de messages s\xe9curis\xe9e, prot\xe9g\xe9e par Virtru.",
LEARN_MORE:"En savoir plus",MOMENT_CALENDAR_POLICY_CONFIG_FULL_DATE:{lastDay:"dddd Do MMM YYYY [\xe0] LT",
lastWeek:"dddd Do MMM YYYY [\xe0] LT",nextDay:"dddd Do MMM YYYY [\xe0] LT",nextWeek:"dddd Do MMM YYYY [\xe0] LT",
sameDay:"dddd Do MMM YYYY [\xe0] LT",sameElse:"dddd Do MMM YYYY [\xe0] LT"},MOMENT_CALENDAR_RECIPIENT_EXPIRATION:{
lastDay:"[\xe0] LT [hier]",lastWeek:"[\xe0] LT dddd [dernier]",nextDay:"[\xe0] LT [demain]",nextWeek:"[\xe0] LT dddd",
sameDay:"[\xe0] LT [aujourd\u2019hui]",sameElse:"[\xe0] LT dddd Do MMM YYYY"},MOMENT_CALENDAR_SENDER_EXPIRED:{
lastDay:"[hier \xe0] LT",lastWeek:"dddd [dernier] [\xe0] LT",nextDay:"[demain \xe0] LT",nextWeek:"dddd [\xe0] LT",
sameDay:"[aujourd\u2019hui \xe0] LT",sameElse:"dddd Do MMM YYYY [\xe0] LT"},MOMENT_CALENDAR_SENDER_EXPIRING_SOON:{
lastDay:"LT [hier]",lastWeek:"LT dddd [dernier]",nextDay:"LT [demain]",nextWeek:"LT dddd",
sameDay:"LT [aujourd\u2019hui]",sameElse:"LT dddd Do MMM YYYY"},
NB_INTEGRITY_GO_TO_FAQS:"Lisez la FAQ de Virtru pour en savoir plus sur ce probl\xe8me",
NB_INTEGRITY_HEADER:"Notification de s\xe9curit\xe9\xa0:",
NB_INTEGRITY_MESSAGE:"M\xe9fiez-vous des liens et des pi\xe8ces jointes dans ce message.",
NB_INTEGRITY_SENDER_DETAILS:'\n<p>\n  Cet e-mail a \xe9t\xe9 envoy\xe9 par <span class="vnb-details-bold">{{expected}}</span>, mais il a \xe9t\xe9 distribu\xe9 par <span class="vnb-details-bold">{{got}}</span>.\n</p>\n<p>\n  Si vous ne faites pas confiance \xe0 <span class="virtru-sender-integrity-fail-message-bold">{{got}}</span>, NE CLIQUEZ PAS sur les liens ou les pi\xe8ces jointes.\n</p>',
NB_INTEGRITY_SUBJECT_DETAILS:'\n<p>\n  Cet e-mail a \xe9t\xe9 envoy\xe9 avec l\u2019objet <span class="vnb-details-bold">{{expected}}</span>, mais il affiche actuellement l\u2019objet <span class="vnb-details-bold">{{got}}</span>.\n</p>\n<p>\n  Si vous ne faites pas confiance \xe0 l\u2019exp\xe9diteur de ce message, NE CLIQUEZ PAS sur les liens ou les pi\xe8ces jointes.\n</p>',
NB_NON_SECURE_FORWARD_DETAILS:'<p>Cela se produit g\xe9n\xe9ralement lorsqu\u2019une personne transf\xe8re un e-mail chiffr\xe9 sans activer Virtru. Dans ce cas, nous pouvons valider l\u2019int\xe9grit\xe9 du contenu chiffr\xe9, mais pas le message dans lequel ce contenu a \xe9t\xe9 int\xe9gr\xe9.\n</p>\n<p>Ce message non valid\xe9 a \xe9t\xe9 envoy\xe9 par <span class="vnb-details-bold">{{sender}}</span>. Si vous ne connaissez pas cette personne, NE CLIQUEZ PAS sur les liens ou les pi\xe8ces jointes qu\u2019il contient.\n</p>\n<p>Pour \xe9viter ce probl\xe8me \xe0 l\u2019avenir, veillez \xe0 ce que les exp\xe9diteurs activent Virtru lors du transfert d\u2019e-mails qui ont d\xe9j\xe0 \xe9t\xe9 chiffr\xe9s.\n</p>',
NB_NON_SECURE_FORWARD_HEADER:"Avertissement\xa0:",NB_NON_SECURE_FORWARD_LEARN_MORE:"Cliquez ici pour en savoir plus.",
NB_NON_SECURE_FORWARD_MESSAGE:"Soyez prudent avec les liens et les pi\xe8ces jointes.",
NESTED_MESSAGE_PLACEHOLDER_TEXT_DEFAULT:"Afficher le dernier message s\xe9curis\xe9",
NESTED_MESSAGE_PLACEHOLDER_TEXT_LOADING:"Chargement du message s\xe9curis\xe9...",
NEW_COMPOSE_ARCHIVE_SEND:"Envoyer\xa0+",NEW_COMPOSE_ARCHIVE_SEND_SECURE:"S\xe9curiser l'envoi\xa0+",
NEW_COMPOSE_DISABLED_WHILE_SECURING:"D\xe9sactiv\xe9 pendant la s\xe9curisation du message (et des pi\xe8ces jointes)",
NOTIFICATION_BAR_HIDE_DETAILS:"Masquer les d\xe9tails",NOTIFICATION_BAR_SHOW_DETAILS:"Afficher les d\xe9tails",
OKGOTIT:"OK, J\u2019AI COMPRIS\xa0!",ONBOARDING_LABEL_COMPLETE:"TUTORIEL<br>TERMIN\xc9",
ONBOARDING_LABEL_START:"PREMIERS<br>PAS",ONBOARDING_POPOVERS_CLOSE:"FERMER LA FEN\xcaTRE",
ONBOARDING_POPOVERS_SKIP:"Ignorer, je sais d\xe9j\xe0 utiliser Virtru",
ONBOARDING_POPOVER_1_LARGE_HEADER:"Pour envoyer un message s\xe9curis\xe9, cliquez comme d\u2019habitude sur R\xe9diger.",
ONBOARDING_POPOVER_1_SMALL_HEADER:"\xc9tape\xa01 sur\xa04",
ONBOARDING_POPOVER_2_LARGE_HEADER:"Activez Virtru en cliquant sur l\u2019option correspondante.",
ONBOARDING_POPOVER_2_SMALL_HEADER:"\xc9tape\xa02 sur\xa04",
ONBOARDING_POPOVER_3_LARGE_HEADER:"Activez votre adresse e-mail.",
ONBOARDING_POPOVER_3_SMALL_HEADER:"\xc9tape\xa03 sur\xa04",
ONBOARDING_POPOVER_4_BODY_TEXT:"Pr\xe9sentez votre message s\xe9curis\xe9, ainsi que Virtru, en ajoutant une courte note ici.<br><br>Ce texte ne sera pas chiffr\xe9\xa0: utilisez-le pour confirmer votre identit\xe9 ou pour expliquer les raisons de votre envoi s\xe9curis\xe9.",
ONBOARDING_POPOVER_4_LARGE_HEADER:"Ajoutez une pr\xe9sentation personnalis\xe9e.",
ONBOARDING_POPOVER_4_SMALL_HEADER:"\xc9tape\xa04 sur\xa04",
ONBOARDING_POPOVER_5_BODY_TEXT:'Une fois que vous \xeates pr\xeat \xe0 envoyer un message, cliquez sur S\xe9curiser l\u2019envoi.<br><br>Apr\xe8s l\u2019envoi, vous pouvez g\xe9rer les param\xe8tres de s\xe9curit\xe9 en cliquant sur le message dans votre dossier d\u2019e-mails envoy\xe9s ou sur le <a href="https://secure-develop01.virtru.com/dashboard/" target="_blank">tableau de bord</a>.<br><br>Merci d\u2019utiliser Virtru. <a href="https://www.virtru.com/contact-support/" target="_blank">Contactez-nous</a> si vous avez des questions.',
ONBOARDING_POPOVER_5_LARGE_HEADER:"Envoyez vos messages en toute confiance.",
ONBOARDING_POPOVER_5_SMALL_HEADER:"Tutoriel termin\xe9",
ONBOARDING_SECURITY_BAR:'Une nouveaut\xe9\xa0! Nous avons ajout\xe9 une barre de s\xe9curit\xe9 Virtru pour vous. Cliquez sur l\u2019option pour activer la protection. <a href="https://www.virtru.com/how-it-works" target="_blank">En savoir plus</a>',
ONBOARDING_TEXTAREA_VAL:"Bonjour\xa0! J\u2019utilise Virtru pour s\xe9curiser mes e-mails. Vous devrez cliquer sur le lien ci-dessous et installer le logiciel requis pour consulter mon message en toute s\xe9curit\xe9. Contactez-moi si vous souhaitez v\xe9rifier l\u2019origine de cet e-mail.",
ONE_CLICK_OPTION:"Activer un clic unique",
PAGE_ACTIONS_FORMAT_NON_PROD_MESSAGE:"Ce message a \xe9t\xe9 envoy\xe9 \xe0 l\u2019aide de {{acmUrl}}",
PERSONAL_INTRO_ADD:'Personnaliser la pr\xe9sentation <div class="virtru-intro-message-toggle-arrow"></div>',
PERSONAL_INTRO_DEFAULT_TEXT:"Bonjour\xa0! J\u2019utilise Virtru pour envoyer et recevoir des e-mails s\xe9curis\xe9s. Cliquez sur le lien ci-dessous pour lire mon message. Si vous avez des questions, contactez-moi.",
PERSONAL_INTRO_ONBOARD:"Ajoutez une pr\xe9sentation personnelle non chiffr\xe9e \xe0 votre e-mail priv\xe9. Les destinataires savent ainsi que le message est authentique et n\u2019est pas un courrier ind\xe9sirable.",
PERSONAL_INTRO_PLACEHOLDER_TEXT:"[Saisissez votre message de pr\xe9sentation ici. Int\xe9grez des informations que seul votre destinataire conna\xeet ou \xe9crivez-les d\u2019une fa\xe7on qui lui permettra de vous reconna\xeetre.]",
PLAINTEXT_NOT_SUPPORTED_HEADER:"Le mode de texte clair n\u2019est pas pris en charge",
PLAINTEXT_NOT_SUPPORTED_TEXT:"D\xe9sactivez le mode de texte clair avant de continuer.",
PLAINTEXT_NOT_SUPPORTED_TITLE:"\xc9chec de l\u2019envoi",
POLICY_BANNER_DAYS_REMAINING_PLURAL:"Plus que {{daysRemaining}}\xa0jours pour essayer les fonctionnalit\xe9s Pro",
POLICY_BANNER_DAYS_REMAINING_SINGLE:"Plus qu\u2019un jour pour essayer les fonctionnalit\xe9s Pro",
POLICY_BANNER_UPGRADE_TEXT:"B\xe9n\xe9ficier des fonctionnalit\xe9s Virtru\xa0Pro",
POLICY_MENU_DISABLE_FORWARDING:"D\xe9sactiver le transfert",POLICY_MENU_NOTICE_UPGRADE:"Mettre \xe0 niveau maintenant",
POLICY_MENU_UPGRADE:"Cliquez pour mettre \xe0 niveau\xa0!",POLICY_MENU_WATERMARKING:"Tatouage num\xe9rique de PDF",
POPUP_BASE_CONTACT_ADMIN:"Contacter votre administrateur pour ajuster cette r\xe8gle",
POPUP_BASE_DASHBOARD_LINK:"Modifier vos r\xe8gles dans le tableau de bord",
READ_RECEIPT_FORWARD_COUNT_DETAILS:"(cliquez pour en savoir plus)",
RECIPIENT_WIDGET_EXPIRATION_DATE:"Expire le {{datetime}}",RECIPIENT_WIDGET_EXPIRED:"Ce message a expir\xe9",
RECIPIENT_WIDGET_EXPIRED_BODY:"ACC\xc8S EXPIR\xc9",
RECIPIENT_WIDGET_EXPIRED_DATE:"Ce message a expir\xe9 le {{datetime}}",
RECIPIENT_WIDGET_HEADER:"Vous consultez un message s\xe9curis\xe9, prot\xe9g\xe9 par Virtru.",
RECIPIENT_WIDGET_NO_EXPIRATION:"Aucune date d\u2019expiration",
RECIPIENT_WIDGET_OFFLINE_BODY:"CONNEXION INTERNET PERDUE",
RECIPIENT_WIDGET_OFFLINE_HEADER:"L\u2019acc\xe8s aux messages s\xe9curis\xe9s n\u2019est pas autoris\xe9 dans connexion Internet.",
RECIPIENT_WIDGET_REVOKED_BODY:"ACC\xc8S R\xc9VOQU\xc9",
RECIPIENT_WIDGET_REVOKED_HEADER:"L\u2019auteur a supprim\xe9 votre acc\xe8s.",
RECIPIENT_WIDGET_UNAUTHORIZED_BODY:"CETTE ADRESSE E-MAIL N\u2019EST PAS AUTORIS\xc9E \xc0 VISUALISER CET E-MAIL",
RECIPIENT_WIDGET_UNAUTHORIZED_HEADER:"Cette adresse e-mail n\u2019est pas autoris\xe9e \xe0 lire cet e-mail",
RESTORE_DRAFT_FAILED:"Un probl\xe8me est survenu lors de la restauration de ce brouillon. V\xe9rifiez votre connexion r\xe9seau et r\xe9essayez.",
SCREENREADER_CLOSED_POLICY_MENU:"Menu Politique ferm\xe9",
SCREENREADER_DISABLED_COPY_PASTE:"Copier/Coller d\xe9sactiv\xe9",
SCREENREADER_DISABLED_EXPIRATION:"Expiration d\xe9sactiv\xe9e",
SCREENREADER_DISABLED_FORWARDING:"Transfert d\xe9sactiv\xe9",
SCREENREADER_DISABLED_ONECLICK:"En un clic d\xe9sactiv\xe9",SCREENREADER_DISABLED_PRINTING:"Impression d\xe9activ\xe9e",
SCREENREADER_DISABLED_WATERMARK_PDF:"Tatouage num\xe9rique du PDF d\xe9sactiv\xe9",
SCREENREADER_DISABLE_COPY_PASTE:"D\xe9sactiver le copier/coller",
SCREENREADER_DISABLE_FORWARDING:"D\xe9sactiver le transfert",
SCREENREADER_DISABLE_PRINT:"D\xe9sactiver l\u2019impression",SCREENREADER_ENABLED_COPY_PASTE:"Copier/Coller activ\xe9",
SCREENREADER_ENABLED_EXPIRATION:"Expiration activ\xe9e",SCREENREADER_ENABLED_FORWARDING:"Transfert activ\xe9",
SCREENREADER_ENABLED_ONECLICK:"En un clic activ\xe9",SCREENREADER_ENABLED_PRINTING:"Impression d\xe9sactiv\xe9e",
SCREENREADER_ENABLED_WATERMARK_PDF:"Tatouage num\xe9rique du PDF activ\xe9",
SCREENREADER_EXPIRATION:"Expiration d\xe9finie",SCREENREADER_ONECLICK:"Activer En un clic",
SCREENREADER_OPENED_POLICY_MENU:"Menu Politique ouvert",SCREENREADER_VIRTRU_POLICY_MENU:"Menu Politique de Virtru",
SCREENREADER_VIRTRU_SECURE_TOGGLE:"Bouton S\xe9curiser Virtru",
SCREENREADER_WATERMARK_PDF:"Tatouer num\xe9riquement le PDF",
SECURE_EMAIL_COMPOSER_PLACEHOLDER_HTML:"La cha\xeene d\u2019e-mails a \xe9t\xe9 s\xe9curis\xe9e par Virtru.",
SECURE_EMAIL_COMPOSER_POLICY_OPTIONS_DEFAULT:"(Sans objet)",SECURE_MESSAGE_CONTROL_ENABLE:"Activer",
SECURE_MESSAGE_CONTROL_REVOKE:"R\xe9voquer",SECURE_MESSAGE_LABEL:"Vous lisez un message s\xe9curis\xe9",
SENDER_WIDGET_ERROR_ENABLE_MESSAGE:"Une erreur est survenue lors du traitement de l\u2019activation de ce message.",
SENDER_WIDGET_ERROR_REVOCATION:"Une erreur est survenue lors du traitement de la r\xe9vocation.",
SENDER_WIDGET_ERROR_UPDATE_POLICY:"Une erreur est survenue lors de la mise \xe0 jour de la politique.",
SENDER_WIDGET_EXPIRED_DATE:"Arriv\xe9 \xe0 expiration le {{datetime}}",
SENDER_WIDGET_EXPIRES_DATE:"Expire le {{datetime}}",
SENDER_WIDGET_MESSAGE_REVOKED:"Ce message a \xe9t\xe9 r\xe9voqu\xe9",
SENDER_WIDGET_NO_EXPIRATION:"Aucune date d\u2019expiration",SENDER_WIDGET_REVOKED_DATE:"R\xe9voqu\xe9 {{datetime}}",
SEND_ANIMATION_LOADING_TEXT:"Chiffrement de l'e-mail",SEND_BLOCK_HEADER:"Violation d\xe9tect\xe9e",
SEND_BLOCK_SUBTEXT:" Conform\xe9ment \xe0 la politique de s\xe9curit\xe9 du contenu de votre organisation, cet e-mail comprend des informations confidentielles et ne peut pas \xeatre envoy\xe9. Supprimez les donn\xe9es confidentielles et r\xe9essayez.",
SEND_ENCRYPT_BUTTON_SEND_SECURE:"Envoi s\xe9curis\xe9",SEND_ENCRYPT_HEADER:"Chiffrement activ\xe9",
SEND_ENCRYPT_SUBTEXT:" Cet e-mail contient des informations confidentielles. Conform\xe9ment aux param\xe8tres de votre organisation, vous devez envoyer ce type d\u2019informations de mani\xe8re s\xe9curis\xe9e. Clique sur l\u2019option d\u2019envoi s\xe9curis\xe9 pour continuer, ou annulez l\u2019op\xe9ration pour apporter des modifications.",
SEND_WARNING_BUTTON_SEND:"ENVOYER",SEND_WARNING_BUTTON_SEND_SECURE:"ENVOI S\xc9CURIS\xc9",
SEND_WARNING_CANCEL:"Annuler, je veux modifier mon e-mail",
SEND_WARNING_RULE_NAME:"\xc9l\xe9ments confidentiels d\xe9tect\xe9s",SMART_SEND_SECURE_BUTTON_SEND:"Envoyer\xa0+",
SMART_SEND_SECURE_BUTTON_SEND_SECURE:"Envoyer\xa0+",SMART_SEND_SECURE_BUTTON_SEND_SECURE_CHILD:"S\xe9curiser",
SMART_SEND_SECURE_VIOLATONS_HIDE:"Masquer",SMART_SEND_SECURE_VIOLATONS_SHOW:"{{number}} de plus (afficher)",
TOOLTIP_DISABLE_COPY_PASTE:"D\xe9sactiver le copier/coller",TOOLTIP_DISABLE_FORWARDING:"D\xe9sactiver le transfert",
TOOLTIP_DISABLE_PRINT:"D\xe9sactiver l\u2019impression",TOOLTIP_EXPIRATION:"Date d\u2019expiration",
TOOLTIP_FORWARDING_RESTRICTED:"Transfert limit\xe9",
TOOLTIP_FORWARDING_RESTRICTED_CONTENT:"Le transfert a \xe9t\xe9 limit\xe9 sur un message s\xe9curis\xe9 de la cha\xeene. Il se peut que les destinataires ajout\xe9s \xe0 votre message n\u2019aient pas acc\xe8s au message transf\xe9r\xe9. Le propri\xe9taire du message s\xe9curis\xe9 doit accorder l\u2019acc\xe8s aux nouveaux destinataires.",
TOOLTIP_GOOGLE_DRIVE_SECURE_ATTACHMENT_CONTENT:"Cliquez sur cette ic\xf4ne pour d\xe9sactiver cette fonctionnalit\xe9.",
TOOLTIP_GOOGLE_DRIVE_SECURE_ATTACHMENT_TITLE:"Pi\xe8ce jointe s\xe9curis\xe9e Virtru, t\xe9l\xe9charg\xe9e vers Google\xa0Drive.",
TOOLTIP_ONE_CLICK:"En un clic",
TOOLTIP_REAUTHORIZE_BUTTON_CONTENT:"Ce message a \xe9t\xe9 r\xe9voqu\xe9 auparavant. Si vous le r\xe9autorisez, il sera \xe0 nouveau visible.",
TOOLTIP_REAUTHORIZE_BUTTON_TITLE:"R\xe9autoriser le message",
TOOLTIP_RECIPIENT_DISABLE_COPY_PASTE:"Ce message s\xe9curis\xe9 par Virtru fait l\u2019objet de limitations par son exp\xe9diteur. Vous ne pouvez pas utiliser la fonctionnalit\xe9 de copier/coller.",
TOOLTIP_RECIPIENT_DISABLE_FORWARDING:"Ce message s\xe9curis\xe9 par Virtru fait l\u2019objet de limitations de transfert par son exp\xe9diteur.",
TOOLTIP_RECIPIENT_DISABLE_PRINT:"Ce message s\xe9curis\xe9 par Virtru fait l\u2019objet de limitations par son exp\xe9diteur. Vous ne pouvez pas l\u2019imprimer.",
TOOLTIP_RECIPIENT_EXPIRATION:"Ce message s\xe9curis\xe9 par Virtru expire le {{date}}. Pour visualiser ce message apr\xe8s son expiration, contactez l\u2019exp\xe9diteur.",
TOOLTIP_RECIPIENT_ONE_CLICK:"Vous n\u2019avez pas besoin d\u2019une autorisation pour lire ce message s\xe9curis\xe9 Virtru.",
TOOLTIP_RECIPIENT_UNAUTHORIZED_INFO:"L\u2019auteur d\u2019origine de cet e-mail a limit\xe9 l\u2019acc\xe8s au message. Par cons\xe9quent, si vous n\u2019avez pas re\xe7u ce message directement de l\u2019auteur d\u2019origine, vous ne pourrez peut-\xeatre pas visualiser son contenu.<br><br>Pour obtenir l\u2019acc\xe8s, contactez l\u2019auteur d\u2019origine.",
TOOLTIP_REVOKE_BUTTON_CONTENT:"D\xe9sactive l\u2019acc\xe8s \xe0 votre message. \xc0 part vous, personne ne pourra visualiser ce message.",
TOOLTIP_REVOKE_BUTTON_TITLE:"R\xe9voquer le message",
TOOLTIP_SECURE_ATTACHMENT_CONTENT:"{{filename}} a \xe9t\xe9 s\xe9curis\xe9 par Virtru",
TOOLTIP_SECURE_ATTACHMENT_DOWNLOAD:"D\xe9chiffrer et t\xe9l\xe9charger",
TOOLTIP_SECURE_ATTACHMENT_DRIVE:"L\u2019enregistrement sur Google\xa0Drive n\u2019est pas pris en charge par Virtru",
TOOLTIP_SECURE_ATTACHMENT_TITLE:"Pi\xe8ce jointe s\xe9curis\xe9e Virtru",
TOOLTIP_SENDER_DISABLE_COPY_PASTE_CONTENT:"Vos destinataires ne pourront pas copier le contenu de votre message.",
TOOLTIP_SENDER_DISABLE_FORWARDING_CONTENT:"Vos destinataires ne pourront pas transf\xe9rer votre message.",
TOOLTIP_SENDER_DISABLE_PRINT_CONTENT:"Vos destinataires ne pourront pas imprimer votre message.",
TOOLTIP_SENDER_EXPIRATION_CONTENT:"Apr\xe8s le {{date}}, vos destinataires n\u2019auront plus acc\xe8s \xe0 votre message.",
TOOLTIP_SENDER_EXPIRATION_CONTENT_EXPIRED:"Votre message a expir\xe9 le {{date}}. Vos destinataires ne peuvent plus visualiser ce contenu. Pour r\xe9activer la visualisation, supprimez ou r\xe9initialisez la date d\u2019expiration.",
TOOLTIP_SENDER_EXPIRATION_CONTENT_NO_DATE:"Sp\xe9cifiez une date d\u2019expiration. Apr\xe8s cette heure-l\xe0, vos destinataires n\u2019auront plus acc\xe8s \xe0 votre message.",
TOOLTIP_SENDER_ONE_CLICK_CONTENT:"Vos destinataires ne demandent aucune autorisation pour lire votre message.",
TOOLTIP_TOGGLE_DISABLED:"Vous n\u2019\xeates pas autoris\xe9 \xe0 effectuer un envoi s\xe9curis\xe9. Contactez votre administrateur si vous avez des questions.",
TOOLTIP_TOGGLE_OFF:"Prot\xe9gez votre message avec Virtru",
TOOLTIP_UPSELL_POSTFIX:"<br/><br/>Cette fonctionnalit\xe9 est disponible dans la version Pro de Virtru.",
TOOLTIP_VIRTRU_OPTIONS:"Options Virtru",
UNSECURE_ATTACHMENTS_EXIST_HEADER:"Pr\xe9sence de pi\xe8ces jointes non s\xe9curis\xe9es",
UNSECURE_ATTACHMENTS_EXIST_TEXT:"Envoi s\xe9curis\xe9 impossible si des pi\xe8ces jointes sont d\xe9tect\xe9es.",
UNSECURE_ATTACHMENTS_EXIST_TITLE:"\xc9chec de l\u2019envoi",UPDATE_MODAL_HEADER:"Virtru a \xe9t\xe9 mis \xe0 jour.",
UPDATE_MODAL_REFRESH_BUTTON:"Cliquez ici pour actualiser la page",
UPDATE_MODAL_SUBHEADER:"Actualisez cette page pour vous assurer <br>que vous utilisez la derni\xe8re version.",
VIRTRU_ATTACHMENT_CLICK_TO_DOWNLOAD:"Cliquez pour t\xe9l\xe9charger",VIRTRU_ATTACHMENT_DECRYPTING:"D\xe9chiffrement",
VIRTRU_CONTACT_US:"Contactez votre administrateur informatique",
VIRTRU_DISABLED_ON_DOMAIN:"Virtru a \xe9t\xe9 d\xe9sactiv\xe9 pour votre domaine",
VIRTRU_PROTECTION_OFF:"La protection Virtru est d\xe9sactiv\xe9e",
VIRTRU_PROTECTION_ON:"La protection Virtru est activ\xe9e",
VIRTRU_SECURE_DRAFT_PREFIX:"Il s\u2019agit d\u2019un brouillon s\xe9curis\xe9 par Virtru",
WEBMAIL_PLUGIN_ACTIVATION_LINK_RETRY:"Renvoyer",
WEBMAIL_PLUGIN_ACTIVATION_TEXT:"E-mail de v\xe9rification envoy\xe9.<br>Consultez cette bo\xeete de r\xe9ception d\u2019ici peu.",
WEBMAIL_PLUGIN_INIT_ERROR:'Virtru n\u2019a pas pu s\u2019initialiser. Cela peut \xeatre d\xfb \xe0 des erreurs de connectivit\xe9 r\xe9seau ou \xe0 une configuration utilisateur incompl\xe8te. Tentez d\u2019effectuer une actualisation dans quelques instants ou contactez le support client\xe8le Virtru sur <a href="https://www.virtru.com/contact-us/">https://www.virtru.com/contact-us/</a>.',
WEBMAIL_PLUGIN_INIT_ERROR_HEADER:"\xc9chec de l\u2019initialisation du plug-in Virtru",
WEBMAIL_PLUGIN_INIT_ERROR_TITLE:"Oups\xa0! Un probl\xe8me est survenu.",WIDGET_BASE_BODY_REVOKED:"ACC\xc8S REFUS\xc9",
WIDGET_BASE_EXPIRATION_OPTIONS_CUSTOM:"Ajouter une date/heure personnalis\xe9e",
WIDGET_BASE_FOOTER:"S\xe9curis\xe9 par la technologie Virtru",
WIDGET_BASE_HEADER_MESSAGE_RECIPIENT:"Vous consultez un message s\xe9curis\xe9, prot\xe9g\xe9 par Virtru.",
WIDGET_BASE_HEADER_MESSAGE_SENDER:"Votre message, prot\xe9g\xe9 par Virtru",
WIDGET_BASE_MENU_OPTION_COPY_PASTE:"D\xe9sactiver le copier/coller",
WIDGET_BASE_MENU_OPTION_EXPIRES:"Ajouter une expiration",
WIDGET_BASE_MENU_OPTION_FORWARDING:"D\xe9sactiver le transfert",
WIDGET_BASE_MENU_OPTION_PRINT:"D\xe9sactiver l\u2019impression",EXPIRATION_UNIT_DAYS:"jour",
EXPIRATION_UNIT_DAYS_plural:"jours",EXPIRATION_UNIT_HOURS:"heure",EXPIRATION_UNIT_HOURS_plural:"heures",
EXPIRATION_UNIT_MINS:"minute",EXPIRATION_UNIT_MINS_plural:"minutes",EXPIRATION_UNIT_MONTHS:"mois",
EXPIRATION_UNIT_MONTHS_plural:"mois",EXPIRATION_UNIT_WEEKS:"semaine",EXPIRATION_UNIT_WEEKS_plural:"semaines",
EXPIRATION_UNIT_YEARS:"an",EXPIRATION_UNIT_YEARS_plural:"ans",
READ_RECEIPT_FORWARD_COUNT:'<div style="text-align:center;">Transf\xe9r\xe9 {{count}}\xa0fois<br /><span style="font-size:8pt;">$t(READ_RECEIPT_FORWARD_COUNT_DETAILS)</span></div>',
READ_RECEIPT_FORWARD_COUNT_plural:'<div style="text-align:center;">Transf\xe9r\xe9 {{count}}\xa0fois<br /><span style="font-size:8pt;">$t(READ_RECEIPT_FORWARD_COUNT_DETAILS)</span></div>'
}},function(a,b,c){"use strict";function d(a){return a&&a.__esModule?a:{default:a}}
var e=c(50),f=d(e),g=c(23),h=d(g),i=c(53),j=d(i),k=c(20),l=d(k),m=c(123),n=c(52),o={"{":"}","<":">"},p={a:"\xe4",
b:"\xdf",c:"\u010d",d:"\u0111",e:"\xeb",f:"\u0192",g:"\u011f",h:"\u0127",i:"\xef",j:"\u0135",k:"\u0137",l:"\u013e",
m:"\u1e41",n:"\u0148",o:"\u014f",p:"\xde",q:"\xa7",r:"\u0159",s:"\u0161",t:"\u0167",u:"\u016d",w:"\u0175",v:"\u0477",
x:"\xd7",y:"\u0177",z:"\u017e",A:"\xc2",B:"\u1e02",C:"\u010c",D:"\u010e",E:"\xca",F:"\u1e1e",G:"\u011e",H:"\u0124",
I:"\xce",J:"\u0134",K:"\u01e8",L:"\u0139",M:"\u1e40",N:"\xd1",O:"\xd4",P:"\u1e56",Q:"\u01fe",R:"\u0158",S:"\u0160",
T:"\u0164",U:"\xdb",W:"\u0174",V:"\u25ca",X:"\u03c7",Y:"\u0176",Z:"\u017d"},q=function(a){
for(var b=[],c="",d=0;d<a.length;d++)(0,l.default)(o).includes(a[d])?b.push(o[a[d]]):a[d]===b[b.length-1]&&b.pop(),
c+=!b.length&&p[a[d]]||a[d];return c},r=function(a){return a.map(function(a){return q(a)})},s=function a(b,c){
if(Array.isArray(c))return r(c);if("object"===(void 0===c?"undefined":(0,j.default)(c))){var d={};return(0,
l.default)(c).forEach(function(b){d[b]=a(b,c[b])}),d}if(c)return q(c);throw new Error("Incorrect value format")
},t=["MOMENT_CALENDAR_RECIPIENT_EXPIRATION","MOMENT_CALENDAR_SENDER_EXPIRED","MOMENT_CALENDAR_SENDER_EXPIRING_SOON","MOMENT_CALENDAR_POLICY_CONFIG_FULL_DATE"],u=m.pick(n,t),v=m.omit(n,t),w=(0,
h.default)(JSON.parse((0,f.default)(v),function(a,b){return a&&b&&(b=s(a,b)),b}),u);a.exports=w},function(a,b,c){
a.exports={default:c(111),__esModule:!0}},function(a,b,c){c(33),c(45),a.exports=c(34).f("iterator")},function(a,b,c){
a.exports={default:c(113),__esModule:!0}},function(a,b,c){c(114),c(120),c(121),c(122),a.exports=c(0).Symbol
},function(a,b,c){"use strict"
;var d=c(2),e=c(4),f=c(7),g=c(11),h=c(47),i=c(115).KEY,j=c(8),k=c(29),l=c(32),m=c(17),n=c(1),o=c(34),p=c(35),q=c(116),r=c(117),s=c(6),t=c(12),u=c(9),v=c(24),w=c(13),x=c(48),y=c(118),z=c(119),A=c(3),B=c(14),C=z.f,D=A.f,E=y.f,F=d.Symbol,G=d.JSON,H=G&&G.stringify,I="prototype",J=n("_hidden"),K=n("toPrimitive"),L={}.propertyIsEnumerable,M=k("symbol-registry"),N=k("symbols"),O=k("op-symbols"),P=Object[I],Q="function"==typeof F,R=d.QObject,S=!R||!R[I]||!R[I].findChild,T=f&&j(function(){
return 7!=x(D({},"a",{get:function(){return D(this,"a",{value:7}).a}})).a})?function(a,b,c){var d=C(P,b);d&&delete P[b],
D(a,b,c),d&&a!==P&&D(P,b,d)}:D,U=function(a){var b=N[a]=x(F[I]);return b._k=a,b
},V=Q&&"symbol"==typeof F.iterator?function(a){return"symbol"==typeof a}:function(a){return a instanceof F
},W=function(a,b,c){return a===P&&W(O,b,c),s(a),b=v(b,!0),s(c),e(N,b)?(c.enumerable?(e(a,J)&&a[J][b]&&(a[J][b]=!1),
c=x(c,{enumerable:w(0,!1)})):(e(a,J)||D(a,J,w(1,{})),a[J][b]=!0),T(a,b,c)):D(a,b,c)},X=function(a,b){s(a)
;for(var c,d=q(b=u(b)),e=0,f=d.length;f>e;)W(a,c=d[e++],b[c]);return a},Y=function(a,b){return void 0===b?x(a):X(x(a),b)
},Z=function(a){var b=L.call(this,a=v(a,!0))
;return!(this===P&&e(N,a)&&!e(O,a))&&(!(b||!e(this,a)||!e(N,a)||e(this,J)&&this[J][a])||b)},$=function(a,b){if(a=u(a),
b=v(b,!0),a!==P||!e(N,b)||e(O,b)){var c=C(a,b);return!c||!e(N,b)||e(a,J)&&a[J][b]||(c.enumerable=!0),c}},_=function(a){
for(var b,c=E(u(a)),d=[],f=0;c.length>f;)e(N,b=c[f++])||b==J||b==i||d.push(b);return d},aa=function(a){
for(var b,c=a===P,d=E(c?O:u(a)),f=[],g=0;d.length>g;)!e(N,b=d[g++])||c&&!e(P,b)||f.push(N[b]);return f}
;Q||(F=function(){if(this instanceof F)throw TypeError("Symbol is not a constructor!")
;var a=m(arguments.length>0?arguments[0]:void 0),b=function(c){this===P&&b.call(O,c),
e(this,J)&&e(this[J],a)&&(this[J][a]=!1),T(this,a,w(1,c))};return f&&S&&T(P,a,{configurable:!0,set:b}),U(a)},
h(F[I],"toString",function(){return this._k}),z.f=$,A.f=W,c(54).f=y.f=_,c(18).f=Z,c(31).f=aa,
f&&!c(16)&&h(P,"propertyIsEnumerable",Z,!0),o.f=function(a){return U(n(a))}),g(g.G+g.W+g.F*!Q,{Symbol:F})
;for(var ba="hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","),ca=0;ba.length>ca;)n(ba[ca++])
;for(var da=B(n.store),ea=0;da.length>ea;)p(da[ea++]);g(g.S+g.F*!Q,"Symbol",{for:function(a){
return e(M,a+="")?M[a]:M[a]=F(a)},keyFor:function(a){if(!V(a))throw TypeError(a+" is not a symbol!")
;for(var b in M)if(M[b]===a)return b},useSetter:function(){S=!0},useSimple:function(){S=!1}}),g(g.S+g.F*!Q,"Object",{
create:Y,defineProperty:W,defineProperties:X,getOwnPropertyDescriptor:$,getOwnPropertyNames:_,getOwnPropertySymbols:aa
}),G&&g(g.S+g.F*(!Q||j(function(){var a=F();return"[null]"!=H([a])||"{}"!=H({a:a})||"{}"!=H(Object(a))})),"JSON",{
stringify:function(a){for(var b,c,d=[a],e=1;arguments.length>e;)d.push(arguments[e++]);if(c=b=d[1],
(t(b)||void 0!==a)&&!V(a))return r(b)||(b=function(a,b){if("function"==typeof c&&(b=c.call(this,a,b)),!V(b))return b}),
d[1]=b,H.apply(G,d)}}),F[I][K]||c(5)(F[I],K,F[I].valueOf),l(F,"Symbol"),l(Math,"Math",!0),l(d.JSON,"JSON",!0)
},function(a,b,c){var d=c(17)("meta"),e=c(12),f=c(4),g=c(3).f,h=0,i=Object.isExtensible||function(){return!0
},j=!c(8)(function(){return i(Object.preventExtensions({}))}),k=function(a){g(a,d,{value:{i:"O"+ ++h,w:{}}})
},l=function(a,b){if(!e(a))return"symbol"==typeof a?a:("string"==typeof a?"S":"P")+a;if(!f(a,d)){if(!i(a))return"F"
;if(!b)return"E";k(a)}return a[d].i},m=function(a,b){if(!f(a,d)){if(!i(a))return!0;if(!b)return!1;k(a)}return a[d].w
},n=function(a){return j&&o.NEED&&i(a)&&!f(a,d)&&k(a),a},o=a.exports={KEY:d,NEED:!1,fastKey:l,getWeak:m,onFreeze:n}
},function(a,b,c){var d=c(14),e=c(31),f=c(18);a.exports=function(a){var b=d(a),c=e.f
;if(c)for(var g,h=c(a),i=f.f,j=0;h.length>j;)i.call(a,g=h[j++])&&b.push(g);return b}},function(a,b,c){var d=c(25)
;a.exports=Array.isArray||function(a){return"Array"==d(a)}},function(a,b,c){
var d=c(9),e=c(54).f,f={}.toString,g="object"==typeof window&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[],h=function(a){
try{return e(a)}catch(a){return g.slice()}};a.exports.f=function(a){return g&&"[object Window]"==f.call(a)?h(a):e(d(a))}
},function(a,b,c){var d=c(18),e=c(13),f=c(9),g=c(24),h=c(4),i=c(39),j=Object.getOwnPropertyDescriptor
;b.f=c(7)?j:function(a,b){if(a=f(a),b=g(b,!0),i)try{return j(a,b)}catch(a){}if(h(a,b))return e(!d.f.call(a,b),a[b])}
},function(a,b){},function(a,b,c){c(35)("asyncIterator")},function(a,b,c){c(35)("observable")},function(a,b){
a.exports=__virtru_deps.underscore},function(a,b,c){"use strict";function d(a){return a&&a.__esModule?a:{default:a}}
function e(a){return a.split("-")[0].trim()}var f=c(20),g=d(f),h=function(){
var a=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},b=arguments.length>1&&void 0!==arguments[1]?arguments[1]:""
;return a[b]&&a[b].published&&a[b].enabled&&b};a.exports=function(a,b){var c=(0,g.default)(b),d=c.includes(a)&&h(b,a)
;return c.map(function(c){e(a)===e(c)&&(d=d||h(b,c))}),d}},function(a,b,c){"use strict";function d(a){
return a&&a.__esModule?a:{default:a}}function e(a,b){x(a).on("click keypress",function(a){f(a)&&b(a)})}function f(a){
return"click"===a.type||"keypress"===a.type&&(32===a.charCode||13===a.charCode)}function g(a){var b=toString.call(a)
;if("[object Error]"===b||"[object DOMException]"===b)return h(a);if(v.isObject(a))for(var c in a)a[c]=g(a[c]);return a}
function h(a){var b={};return y.forEach(function(c){null!=a[c]&&(b[c]=a[c])}),b}function i(a,b){
var c=v.get(a,"settings.clientConfig.features."+b,!1);return"object"===(void 0===c?"undefined":(0,
u.default)(c))&&"string"==typeof c.GA_date?Date.now()>=new Date(c.GA_date).getTime():!!c}function j(a,b){
var c=void 0,d=!0,e=!1,f=void 0;try{
for(var g,h=(0,s.default)((0,q.default)(a).sort().reverse());!(d=(g=h.next()).done);d=!0){var i=g.value
;Number(b)>=Number(i)&&(c=(0,o.default)({},a[i],c))}}catch(a){e=!0,f=a}finally{try{!d&&h.return&&h.return()}finally{
if(e)throw f}}return c}function k(a){if("string"==typeof a){var b=a.split(".");if(b.length>1&&b[0]){
return"pdf"===b.pop().toLowerCase()}}return!1}function l(a){return a?{message:a.message,type:a.type,name:a.name}:null}
function m(a){return("aeiou".indexOf(a.substr(0,1))>-1?"an ":"a ")+a}Object.defineProperty(b,"__esModule",{value:!0})
;var n=c(23),o=d(n),p=c(20),q=d(p),r=c(44),s=d(r),t=c(53),u=d(t);b.onA11yClick=e,b.formatForTransport=g,
b.processError=h,b.isFeatureEnabled=i,b.mergeSelectors=j,b.isPdf=k,b.jsonifyError=l,b.readableRule=m
;var v=c(126),w=c(129),x=c(36),y=["name","message","type","status","stack","arguments","reason"]
;b.callContentScript=function(a,b){var c=w.defer(),d={type:"command",action:a,target:"content",data:b}
;return chrome.tabs.query({currentWindow:!0,active:!0},function(a){var b=a[0]
;chrome.tabs.sendMessage(b.id,d,function(a){
return void 0===a?c.reject(new Error("No response")):a.error?c.reject(a.error):c.resolve(a.data)})}),c.promise},
v.extend(a.exports,c(130))},function(a,b,c){(function(a,d){var e;(function(){function f(a,b,c){switch(c.length){case 0:
return a.call(b);case 1:return a.call(b,c[0]);case 2:return a.call(b,c[0],c[1]);case 3:return a.call(b,c[0],c[1],c[2])}
return a.apply(b,c)}function g(a,b,c,d){for(var e=-1,f=null==a?0:a.length;++e<f;){var g=a[e];b(d,g,c(g),a)}return d}
function h(a,b){for(var c=-1,d=null==a?0:a.length;++c<d&&!1!==b(a[c],c,a););return a}function i(a,b){
for(var c=null==a?0:a.length;c--&&!1!==b(a[c],c,a););return a}function j(a,b){
for(var c=-1,d=null==a?0:a.length;++c<d;)if(!b(a[c],c,a))return!1;return!0}function k(a,b){
for(var c=-1,d=null==a?0:a.length,e=0,f=[];++c<d;){var g=a[c];b(g,c,a)&&(f[e++]=g)}return f}function l(a,b){
return!!(null==a?0:a.length)&&w(a,b,0)>-1}function m(a,b,c){
for(var d=-1,e=null==a?0:a.length;++d<e;)if(c(b,a[d]))return!0;return!1}function n(a,b){
for(var c=-1,d=null==a?0:a.length,e=Array(d);++c<d;)e[c]=b(a[c],c,a);return e}function o(a,b){
for(var c=-1,d=b.length,e=a.length;++c<d;)a[e+c]=b[c];return a}function p(a,b,c,d){var e=-1,f=null==a?0:a.length
;for(d&&f&&(c=a[++e]);++e<f;)c=b(c,a[e],e,a);return c}function q(a,b,c,d){var e=null==a?0:a.length
;for(d&&e&&(c=a[--e]);e--;)c=b(c,a[e],e,a);return c}function r(a,b){
for(var c=-1,d=null==a?0:a.length;++c<d;)if(b(a[c],c,a))return!0;return!1}function s(a){return a.split("")}
function t(a){return a.match(Ob)||[]}function u(a,b,c){var d;return c(a,function(a,c,e){if(b(a,c,e))return d=c,!1}),d}
function v(a,b,c,d){for(var e=a.length,f=c+(d?1:-1);d?f--:++f<e;)if(b(a[f],f,a))return f;return-1}function w(a,b,c){
return b===b?X(a,b,c):v(a,y,c)}function x(a,b,c,d){for(var e=c-1,f=a.length;++e<f;)if(d(a[e],b))return e;return-1}
function y(a){return a!==a}function z(a,b){var c=null==a?0:a.length;return c?E(a,b)/c:Ja}function A(a){
return function(b){return null==b?ca:b[a]}}function B(a){return function(b){return null==a?ca:a[b]}}
function C(a,b,c,d,e){return e(a,function(a,e,f){c=d?(d=!1,a):b(c,a,e,f)}),c}function D(a,b){var c=a.length
;for(a.sort(b);c--;)a[c]=a[c].value;return a}function E(a,b){for(var c,d=-1,e=a.length;++d<e;){var f=b(a[d])
;f!==ca&&(c=c===ca?f:c+f)}return c}function F(a,b){for(var c=-1,d=Array(a);++c<a;)d[c]=b(c);return d}function G(a,b){
return n(b,function(b){return[b,a[b]]})}function H(a){return function(b){return a(b)}}function I(a,b){
return n(b,function(b){return a[b]})}function J(a,b){return a.has(b)}function K(a,b){
for(var c=-1,d=a.length;++c<d&&w(b,a[c],0)>-1;);return c}function L(a,b){for(var c=a.length;c--&&w(b,a[c],0)>-1;);
return c}function M(a,b){for(var c=a.length,d=0;c--;)a[c]===b&&++d;return d}function N(a){return"\\"+$c[a]}
function O(a,b){return null==a?ca:a[b]}function P(a){return Rc.test(a)}function Q(a){return Sc.test(a)}function R(a){
for(var b,c=[];!(b=a.next()).done;)c.push(b.value);return c}function S(a){var b=-1,c=Array(a.size)
;return a.forEach(function(a,d){c[++b]=[d,a]}),c}function T(a,b){return function(c){return a(b(c))}}function U(a,b){
for(var c=-1,d=a.length,e=0,f=[];++c<d;){var g=a[c];g!==b&&g!==ja||(a[c]=ja,f[e++]=c)}return f}function V(a){
var b=-1,c=Array(a.size);return a.forEach(function(a){c[++b]=a}),c}function W(a){var b=-1,c=Array(a.size)
;return a.forEach(function(a){c[++b]=[a,a]}),c}function X(a,b,c){for(var d=c-1,e=a.length;++d<e;)if(a[d]===b)return d
;return-1}function Y(a,b,c){for(var d=c+1;d--;)if(a[d]===b)return d;return d}function Z(a){return P(a)?_(a):pd(a)}
function $(a){return P(a)?aa(a):s(a)}function _(a){for(var b=Pc.lastIndex=0;Pc.test(a);)++b;return b}function aa(a){
return a.match(Pc)||[]}function ba(a){return a.match(Qc)||[]}
var ca,da="4.17.11",ea=200,fa="Unsupported core-js use. Try https://npms.io/search?q=ponyfill.",ga="Expected a function",ha="__lodash_hash_undefined__",ia=500,ja="__lodash_placeholder__",ka=1,la=2,ma=4,na=1,oa=2,pa=1,qa=2,ra=4,sa=8,ta=16,ua=32,va=64,wa=128,xa=256,ya=512,za=30,Aa="...",Ba=800,Ca=16,Da=1,Ea=2,Fa=3,Ga=1/0,Ha=9007199254740991,Ia=1.7976931348623157e308,Ja=NaN,Ka=4294967295,La=Ka-1,Ma=Ka>>>1,Na=[["ary",wa],["bind",pa],["bindKey",qa],["curry",sa],["curryRight",ta],["flip",ya],["partial",ua],["partialRight",va],["rearg",xa]],Oa="[object Arguments]",Pa="[object Array]",Qa="[object AsyncFunction]",Ra="[object Boolean]",Sa="[object Date]",Ta="[object DOMException]",Ua="[object Error]",Va="[object Function]",Wa="[object GeneratorFunction]",Xa="[object Map]",Ya="[object Number]",Za="[object Null]",$a="[object Object]",_a="[object Promise]",ab="[object Proxy]",bb="[object RegExp]",cb="[object Set]",db="[object String]",eb="[object Symbol]",fb="[object Undefined]",gb="[object WeakMap]",hb="[object WeakSet]",ib="[object ArrayBuffer]",jb="[object DataView]",kb="[object Float32Array]",lb="[object Float64Array]",mb="[object Int8Array]",nb="[object Int16Array]",ob="[object Int32Array]",pb="[object Uint8Array]",qb="[object Uint8ClampedArray]",rb="[object Uint16Array]",sb="[object Uint32Array]",tb=/\b__p \+= '';/g,ub=/\b(__p \+=) '' \+/g,vb=/(__e\(.*?\)|\b__t\)) \+\n'';/g,wb=/&(?:amp|lt|gt|quot|#39);/g,xb=/[&<>"']/g,yb=RegExp(wb.source),zb=RegExp(xb.source),Ab=/<%-([\s\S]+?)%>/g,Bb=/<%([\s\S]+?)%>/g,Cb=/<%=([\s\S]+?)%>/g,Db=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,Eb=/^\w*$/,Fb=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,Gb=/[\\^$.*+?()[\]{}|]/g,Hb=RegExp(Gb.source),Ib=/^\s+|\s+$/g,Jb=/^\s+/,Kb=/\s+$/,Lb=/\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/,Mb=/\{\n\/\* \[wrapped with (.+)\] \*/,Nb=/,? & /,Ob=/[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g,Pb=/\\(\\)?/g,Qb=/\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,Rb=/\w*$/,Sb=/^[-+]0x[0-9a-f]+$/i,Tb=/^0b[01]+$/i,Ub=/^\[object .+?Constructor\]$/,Vb=/^0o[0-7]+$/i,Wb=/^(?:0|[1-9]\d*)$/,Xb=/[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g,Yb=/($^)/,Zb=/['\n\r\u2028\u2029\\]/g,$b="\\ud800-\\udfff",_b="\\u0300-\\u036f",ac="\\ufe20-\\ufe2f",bc="\\u20d0-\\u20ff",cc=_b+ac+bc,dc="\\u2700-\\u27bf",ec="a-z\\xdf-\\xf6\\xf8-\\xff",fc="\\xac\\xb1\\xd7\\xf7",gc="\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf",hc="\\u2000-\\u206f",ic=" \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000",jc="A-Z\\xc0-\\xd6\\xd8-\\xde",kc="\\ufe0e\\ufe0f",lc=fc+gc+hc+ic,mc="['\u2019]",nc="["+$b+"]",oc="["+lc+"]",pc="["+cc+"]",qc="\\d+",rc="["+dc+"]",sc="["+ec+"]",tc="[^"+$b+lc+qc+dc+ec+jc+"]",uc="\\ud83c[\\udffb-\\udfff]",vc="(?:"+pc+"|"+uc+")",wc="[^"+$b+"]",xc="(?:\\ud83c[\\udde6-\\uddff]){2}",yc="[\\ud800-\\udbff][\\udc00-\\udfff]",zc="["+jc+"]",Ac="\\u200d",Bc="(?:"+sc+"|"+tc+")",Cc="(?:"+zc+"|"+tc+")",Dc="(?:"+mc+"(?:d|ll|m|re|s|t|ve))?",Ec="(?:"+mc+"(?:D|LL|M|RE|S|T|VE))?",Fc=vc+"?",Gc="["+kc+"]?",Hc="(?:"+Ac+"(?:"+[wc,xc,yc].join("|")+")"+Gc+Fc+")*",Ic="\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])",Jc="\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])",Kc=Gc+Fc+Hc,Lc="(?:"+[rc,xc,yc].join("|")+")"+Kc,Mc="(?:"+[wc+pc+"?",pc,xc,yc,nc].join("|")+")",Nc=RegExp(mc,"g"),Oc=RegExp(pc,"g"),Pc=RegExp(uc+"(?="+uc+")|"+Mc+Kc,"g"),Qc=RegExp([zc+"?"+sc+"+"+Dc+"(?="+[oc,zc,"$"].join("|")+")",Cc+"+"+Ec+"(?="+[oc,zc+Bc,"$"].join("|")+")",zc+"?"+Bc+"+"+Dc,zc+"+"+Ec,Jc,Ic,qc,Lc].join("|"),"g"),Rc=RegExp("["+Ac+$b+cc+kc+"]"),Sc=/[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/,Tc=["Array","Buffer","DataView","Date","Error","Float32Array","Float64Array","Function","Int8Array","Int16Array","Int32Array","Map","Math","Object","Promise","RegExp","Set","String","Symbol","TypeError","Uint8Array","Uint8ClampedArray","Uint16Array","Uint32Array","WeakMap","_","clearTimeout","isFinite","parseInt","setTimeout"],Uc=-1,Vc={}
;Vc[kb]=Vc[lb]=Vc[mb]=Vc[nb]=Vc[ob]=Vc[pb]=Vc[qb]=Vc[rb]=Vc[sb]=!0,
Vc[Oa]=Vc[Pa]=Vc[ib]=Vc[Ra]=Vc[jb]=Vc[Sa]=Vc[Ua]=Vc[Va]=Vc[Xa]=Vc[Ya]=Vc[$a]=Vc[bb]=Vc[cb]=Vc[db]=Vc[gb]=!1;var Wc={}
;Wc[Oa]=Wc[Pa]=Wc[ib]=Wc[jb]=Wc[Ra]=Wc[Sa]=Wc[kb]=Wc[lb]=Wc[mb]=Wc[nb]=Wc[ob]=Wc[Xa]=Wc[Ya]=Wc[$a]=Wc[bb]=Wc[cb]=Wc[db]=Wc[eb]=Wc[pb]=Wc[qb]=Wc[rb]=Wc[sb]=!0,
Wc[Ua]=Wc[Va]=Wc[gb]=!1;var Xc={"\xc0":"A","\xc1":"A","\xc2":"A","\xc3":"A","\xc4":"A","\xc5":"A","\xe0":"a","\xe1":"a",
"\xe2":"a","\xe3":"a","\xe4":"a","\xe5":"a","\xc7":"C","\xe7":"c","\xd0":"D","\xf0":"d","\xc8":"E","\xc9":"E",
"\xca":"E","\xcb":"E","\xe8":"e","\xe9":"e","\xea":"e","\xeb":"e","\xcc":"I","\xcd":"I","\xce":"I","\xcf":"I",
"\xec":"i","\xed":"i","\xee":"i","\xef":"i","\xd1":"N","\xf1":"n","\xd2":"O","\xd3":"O","\xd4":"O","\xd5":"O",
"\xd6":"O","\xd8":"O","\xf2":"o","\xf3":"o","\xf4":"o","\xf5":"o","\xf6":"o","\xf8":"o","\xd9":"U","\xda":"U",
"\xdb":"U","\xdc":"U","\xf9":"u","\xfa":"u","\xfb":"u","\xfc":"u","\xdd":"Y","\xfd":"y","\xff":"y","\xc6":"Ae",
"\xe6":"ae","\xde":"Th","\xfe":"th","\xdf":"ss","\u0100":"A","\u0102":"A","\u0104":"A","\u0101":"a","\u0103":"a",
"\u0105":"a","\u0106":"C","\u0108":"C","\u010a":"C","\u010c":"C","\u0107":"c","\u0109":"c","\u010b":"c","\u010d":"c",
"\u010e":"D","\u0110":"D","\u010f":"d","\u0111":"d","\u0112":"E","\u0114":"E","\u0116":"E","\u0118":"E","\u011a":"E",
"\u0113":"e","\u0115":"e","\u0117":"e","\u0119":"e","\u011b":"e","\u011c":"G","\u011e":"G","\u0120":"G","\u0122":"G",
"\u011d":"g","\u011f":"g","\u0121":"g","\u0123":"g","\u0124":"H","\u0126":"H","\u0125":"h","\u0127":"h","\u0128":"I",
"\u012a":"I","\u012c":"I","\u012e":"I","\u0130":"I","\u0129":"i","\u012b":"i","\u012d":"i","\u012f":"i","\u0131":"i",
"\u0134":"J","\u0135":"j","\u0136":"K","\u0137":"k","\u0138":"k","\u0139":"L","\u013b":"L","\u013d":"L","\u013f":"L",
"\u0141":"L","\u013a":"l","\u013c":"l","\u013e":"l","\u0140":"l","\u0142":"l","\u0143":"N","\u0145":"N","\u0147":"N",
"\u014a":"N","\u0144":"n","\u0146":"n","\u0148":"n","\u014b":"n","\u014c":"O","\u014e":"O","\u0150":"O","\u014d":"o",
"\u014f":"o","\u0151":"o","\u0154":"R","\u0156":"R","\u0158":"R","\u0155":"r","\u0157":"r","\u0159":"r","\u015a":"S",
"\u015c":"S","\u015e":"S","\u0160":"S","\u015b":"s","\u015d":"s","\u015f":"s","\u0161":"s","\u0162":"T","\u0164":"T",
"\u0166":"T","\u0163":"t","\u0165":"t","\u0167":"t","\u0168":"U","\u016a":"U","\u016c":"U","\u016e":"U","\u0170":"U",
"\u0172":"U","\u0169":"u","\u016b":"u","\u016d":"u","\u016f":"u","\u0171":"u","\u0173":"u","\u0174":"W","\u0175":"w",
"\u0176":"Y","\u0177":"y","\u0178":"Y","\u0179":"Z","\u017b":"Z","\u017d":"Z","\u017a":"z","\u017c":"z","\u017e":"z",
"\u0132":"IJ","\u0133":"ij","\u0152":"Oe","\u0153":"oe","\u0149":"'n","\u017f":"s"},Yc={"&":"&amp;","<":"&lt;",
">":"&gt;",'"':"&quot;","'":"&#39;"},Zc={"&amp;":"&","&lt;":"<","&gt;":">","&quot;":'"',"&#39;":"'"},$c={"\\":"\\",
"'":"'","\n":"n","\r":"r","\u2028":"u2028","\u2029":"u2029"
},_c=parseFloat,ad=parseInt,bd="object"==typeof a&&a&&a.Object===Object&&a,cd="object"==typeof self&&self&&self.Object===Object&&self,dd=bd||cd||Function("return this")(),ed="object"==typeof b&&b&&!b.nodeType&&b,fd=ed&&"object"==typeof d&&d&&!d.nodeType&&d,gd=fd&&fd.exports===ed,hd=gd&&bd.process,id=function(){
try{var a=fd&&fd.require&&fd.require("util").types;return a||hd&&hd.binding&&hd.binding("util")}catch(a){}
}(),jd=id&&id.isArrayBuffer,kd=id&&id.isDate,ld=id&&id.isMap,md=id&&id.isRegExp,nd=id&&id.isSet,od=id&&id.isTypedArray,pd=A("length"),qd=B(Xc),rd=B(Yc),sd=B(Zc),td=function a(b){
function c(a){if(ei(a)&&!pm(a)&&!(a instanceof s)){if(a instanceof e)return a;if(pk.call(a,"__wrapped__"))return bg(a)}
return new e(a)}function d(){}function e(a,b){this.__wrapped__=a,this.__actions__=[],this.__chain__=!!b,
this.__index__=0,this.__values__=ca}function s(a){this.__wrapped__=a,this.__actions__=[],this.__dir__=1,
this.__filtered__=!1,this.__iteratees__=[],this.__takeCount__=Ka,this.__views__=[]}function B(){
var a=new s(this.__wrapped__);return a.__actions__=Ie(this.__actions__),a.__dir__=this.__dir__,
a.__filtered__=this.__filtered__,a.__iteratees__=Ie(this.__iteratees__),a.__takeCount__=this.__takeCount__,
a.__views__=Ie(this.__views__),a}function X(){if(this.__filtered__){var a=new s(this);a.__dir__=-1,a.__filtered__=!0
}else a=this.clone(),a.__dir__*=-1;return a}function _(){
var a=this.__wrapped__.value(),b=this.__dir__,c=pm(a),d=b<0,e=c?a.length:0,f=yf(0,e,this.__views__),g=f.start,h=f.end,i=h-g,j=d?h:g-1,k=this.__iteratees__,l=k.length,m=0,n=Tk(i,this.__takeCount__)
;if(!c||!d&&e==i&&n==i)return re(a,this.__actions__);var o=[];a:for(;i--&&m<n;){j+=b;for(var p=-1,q=a[j];++p<l;){
var r=k[p],s=r.iteratee,t=r.type,u=s(q);if(t==Ea)q=u;else if(!u){if(t==Da)continue a;break a}}o[m++]=q}return o}
function aa(a){var b=-1,c=null==a?0:a.length;for(this.clear();++b<c;){var d=a[b];this.set(d[0],d[1])}}function Ob(){
this.__data__=bl?bl(null):{},this.size=0}function $b(a){var b=this.has(a)&&delete this.__data__[a]
;return this.size-=b?1:0,b}function _b(a){var b=this.__data__;if(bl){var c=b[a];return c===ha?ca:c}
return pk.call(b,a)?b[a]:ca}function ac(a){var b=this.__data__;return bl?b[a]!==ca:pk.call(b,a)}function bc(a,b){
var c=this.__data__;return this.size+=this.has(a)?0:1,c[a]=bl&&b===ca?ha:b,this}function cc(a){
var b=-1,c=null==a?0:a.length;for(this.clear();++b<c;){var d=a[b];this.set(d[0],d[1])}}function dc(){this.__data__=[],
this.size=0}function ec(a){var b=this.__data__,c=Dc(b,a);return!(c<0)&&(c==b.length-1?b.pop():Dk.call(b,c,1),
--this.size,!0)}function fc(a){var b=this.__data__,c=Dc(b,a);return c<0?ca:b[c][1]}function gc(a){
return Dc(this.__data__,a)>-1}function hc(a,b){var c=this.__data__,d=Dc(c,a);return d<0?(++this.size,
c.push([a,b])):c[d][1]=b,this}function ic(a){var b=-1,c=null==a?0:a.length;for(this.clear();++b<c;){var d=a[b]
;this.set(d[0],d[1])}}function jc(){this.size=0,this.__data__={hash:new aa,map:new(Zk||cc),string:new aa}}
function kc(a){var b=uf(this,a).delete(a);return this.size-=b?1:0,b}function lc(a){return uf(this,a).get(a)}
function mc(a){return uf(this,a).has(a)}function nc(a,b){var c=uf(this,a),d=c.size;return c.set(a,b),
this.size+=c.size==d?0:1,this}function oc(a){var b=-1,c=null==a?0:a.length
;for(this.__data__=new ic;++b<c;)this.add(a[b])}function pc(a){return this.__data__.set(a,ha),this}function qc(a){
return this.__data__.has(a)}function rc(a){var b=this.__data__=new cc(a);this.size=b.size}function sc(){
this.__data__=new cc,this.size=0}function tc(a){var b=this.__data__,c=b.delete(a);return this.size=b.size,c}
function uc(a){return this.__data__.get(a)}function vc(a){return this.__data__.has(a)}function wc(a,b){
var c=this.__data__;if(c instanceof cc){var d=c.__data__;if(!Zk||d.length<ea-1)return d.push([a,b]),this.size=++c.size,
this;c=this.__data__=new ic(d)}return c.set(a,b),this.size=c.size,this}function xc(a,b){
var c=pm(a),d=!c&&om(a),e=!c&&!d&&rm(a),f=!c&&!d&&!e&&wm(a),g=c||d||e||f,h=g?F(a.length,ik):[],i=h.length
;for(var j in a)!b&&!pk.call(a,j)||g&&("length"==j||e&&("offset"==j||"parent"==j)||f&&("buffer"==j||"byteLength"==j||"byteOffset"==j)||Gf(j,i))||h.push(j)
;return h}function yc(a){var b=a.length;return b?a[$d(0,b-1)]:ca}function zc(a,b){return Zf(Ie(a),Jc(b,0,a.length))}
function Ac(a){return Zf(Ie(a))}function Bc(a,b,c){(c===ca||Sh(a[b],c))&&(c!==ca||b in a)||Hc(a,b,c)}function Cc(a,b,c){
var d=a[b];pk.call(a,b)&&Sh(d,c)&&(c!==ca||b in a)||Hc(a,b,c)}function Dc(a,b){
for(var c=a.length;c--;)if(Sh(a[c][0],b))return c;return-1}function Ec(a,b,c,d){return nl(a,function(a,e,f){
b(d,a,c(a),f)}),d}function Fc(a,b){return a&&Je(b,Ni(b),a)}function Gc(a,b){return a&&Je(b,Oi(b),a)}function Hc(a,b,c){
"__proto__"==b&&Hk?Hk(a,b,{configurable:!0,enumerable:!0,value:c,writable:!0}):a[b]=c}function Ic(a,b){
for(var c=-1,d=b.length,e=bk(d),f=null==a;++c<d;)e[c]=f?ca:Ki(a,b[c]);return e}function Jc(a,b,c){
return a===a&&(c!==ca&&(a=a<=c?a:c),b!==ca&&(a=a>=b?a:b)),a}function Kc(a,b,c,d,e,f){var g,i=b&ka,j=b&la,k=b&ma
;if(c&&(g=e?c(a,d,e,f):c(a)),g!==ca)return g;if(!di(a))return a;var l=pm(a);if(l){if(g=Bf(a),!i)return Ie(a,g)}else{
var m=zl(a),n=m==Va||m==Wa;if(rm(a))return ye(a,i);if(m==$a||m==Oa||n&&!e){if(g=j||n?{}:Cf(a),
!i)return j?Le(a,Gc(g,a)):Ke(a,Fc(g,a))}else{if(!Wc[m])return e?a:{};g=Df(a,m,i)}}f||(f=new rc);var o=f.get(a)
;if(o)return o;if(f.set(a,g),vm(a))return a.forEach(function(d){g.add(Kc(d,b,c,d,a,f))}),g
;if(tm(a))return a.forEach(function(d,e){g.set(e,Kc(d,b,c,e,a,f))}),g;var p=k?j?qf:pf:j?Oi:Ni,q=l?ca:p(a)
;return h(q||a,function(d,e){q&&(e=d,d=a[e]),Cc(g,e,Kc(d,b,c,e,a,f))}),g}function Lc(a){var b=Ni(a);return function(c){
return Mc(c,a,b)}}function Mc(a,b,c){var d=c.length;if(null==a)return!d;for(a=gk(a);d--;){var e=c[d],f=b[e],g=a[e]
;if(g===ca&&!(e in a)||!f(g))return!1}return!0}function Pc(a,b,c){if("function"!=typeof a)throw new jk(ga)
;return Cl(function(){a.apply(ca,c)},b)}function Qc(a,b,c,d){var e=-1,f=l,g=!0,h=a.length,i=[],j=b.length;if(!h)return i
;c&&(b=n(b,H(c))),d?(f=m,g=!1):b.length>=ea&&(f=J,g=!1,b=new oc(b));a:for(;++e<h;){var k=a[e],o=null==c?k:c(k)
;if(k=d||0!==k?k:0,g&&o===o){for(var p=j;p--;)if(b[p]===o)continue a;i.push(k)}else f(b,o,d)||i.push(k)}return i}
function Rc(a,b){var c=!0;return nl(a,function(a,d,e){return c=!!b(a,d,e)}),c}function Sc(a,b,c){
for(var d=-1,e=a.length;++d<e;){var f=a[d],g=b(f);if(null!=g&&(h===ca?g===g&&!pi(g):c(g,h)))var h=g,i=f}return i}
function Xc(a,b,c,d){var e=a.length;for(c=vi(c),c<0&&(c=-c>e?0:e+c),d=d===ca||d>e?e:vi(d),d<0&&(d+=e),
d=c>d?0:wi(d);c<d;)a[c++]=b;return a}function Yc(a,b){var c=[];return nl(a,function(a,d,e){b(a,d,e)&&c.push(a)}),c}
function Zc(a,b,c,d,e){var f=-1,g=a.length;for(c||(c=Ff),e||(e=[]);++f<g;){var h=a[f]
;b>0&&c(h)?b>1?Zc(h,b-1,c,d,e):o(e,h):d||(e[e.length]=h)}return e}function $c(a,b){return a&&pl(a,b,Ni)}
function bd(a,b){return a&&ql(a,b,Ni)}function cd(a,b){return k(b,function(b){return ai(a[b])})}function ed(a,b){
b=we(b,a);for(var c=0,d=b.length;null!=a&&c<d;)a=a[$f(b[c++])];return c&&c==d?a:ca}function fd(a,b,c){var d=b(a)
;return pm(a)?d:o(d,c(a))}function hd(a){return null==a?a===ca?fb:Za:Gk&&Gk in gk(a)?xf(a):Sf(a)}function id(a,b){
return a>b}function pd(a,b){return null!=a&&pk.call(a,b)}function td(a,b){return null!=a&&b in gk(a)}function vd(a,b,c){
return a>=Tk(b,c)&&a<Sk(b,c)}function wd(a,b,c){for(var d=c?m:l,e=a[0].length,f=a.length,g=f,h=bk(f),i=1/0,j=[];g--;){
var k=a[g];g&&b&&(k=n(k,H(b))),i=Tk(k.length,i),h[g]=!c&&(b||e>=120&&k.length>=120)?new oc(g&&k):ca}k=a[0]
;var o=-1,p=h[0];a:for(;++o<e&&j.length<i;){var q=k[o],r=b?b(q):q;if(q=c||0!==q?q:0,!(p?J(p,r):d(j,r,c))){for(g=f;--g;){
var s=h[g];if(!(s?J(s,r):d(a[g],r,c)))continue a}p&&p.push(r),j.push(q)}}return j}function xd(a,b,c,d){
return $c(a,function(a,e,f){b(d,c(a),e,f)}),d}function yd(a,b,c){b=we(b,a),a=Uf(a,b);var d=null==a?a:a[$f(ug(b))]
;return null==d?ca:f(d,a,c)}function zd(a){return ei(a)&&hd(a)==Oa}function Ad(a){return ei(a)&&hd(a)==ib}
function Bd(a){return ei(a)&&hd(a)==Sa}function Cd(a,b,c,d,e){
return a===b||(null==a||null==b||!ei(a)&&!ei(b)?a!==a&&b!==b:Dd(a,b,c,d,Cd,e))}function Dd(a,b,c,d,e,f){
var g=pm(a),h=pm(b),i=g?Pa:zl(a),j=h?Pa:zl(b);i=i==Oa?$a:i,j=j==Oa?$a:j;var k=i==$a,l=j==$a,m=i==j;if(m&&rm(a)){
if(!rm(b))return!1;g=!0,k=!1}if(m&&!k)return f||(f=new rc),g||wm(a)?lf(a,b,c,d,e,f):mf(a,b,i,c,d,e,f);if(!(c&na)){
var n=k&&pk.call(a,"__wrapped__"),o=l&&pk.call(b,"__wrapped__");if(n||o){var p=n?a.value():a,q=o?b.value():b
;return f||(f=new rc),e(p,q,c,d,f)}}return!!m&&(f||(f=new rc),nf(a,b,c,d,e,f))}function Ed(a){return ei(a)&&zl(a)==Xa}
function Fd(a,b,c,d){var e=c.length,f=e,g=!d;if(null==a)return!f;for(a=gk(a);e--;){var h=c[e]
;if(g&&h[2]?h[1]!==a[h[0]]:!(h[0]in a))return!1}for(;++e<f;){h=c[e];var i=h[0],j=a[i],k=h[1];if(g&&h[2]){
if(j===ca&&!(i in a))return!1}else{var l=new rc;if(d)var m=d(j,k,i,a,b,l);if(!(m===ca?Cd(k,j,na|oa,d,l):m))return!1}}
return!0}function Gd(a){return!(!di(a)||Lf(a))&&(ai(a)?vk:Ub).test(_f(a))}function Hd(a){return ei(a)&&hd(a)==bb}
function Id(a){return ei(a)&&zl(a)==cb}function Jd(a){return ei(a)&&ci(a.length)&&!!Vc[hd(a)]}function Kd(a){
return"function"==typeof a?a:null==a?Dj:"object"==typeof a?pm(a)?Qd(a[0],a[1]):Pd(a):Lj(a)}function Ld(a){
if(!Mf(a))return Rk(a);var b=[];for(var c in gk(a))pk.call(a,c)&&"constructor"!=c&&b.push(c);return b}function Md(a){
if(!di(a))return Rf(a);var b=Mf(a),c=[];for(var d in a)("constructor"!=d||!b&&pk.call(a,d))&&c.push(d);return c}
function Nd(a,b){return a<b}function Od(a,b){var c=-1,d=Th(a)?bk(a.length):[];return nl(a,function(a,e,f){
d[++c]=b(a,e,f)}),d}function Pd(a){var b=vf(a);return 1==b.length&&b[0][2]?Of(b[0][0],b[0][1]):function(c){
return c===a||Fd(c,a,b)}}function Qd(a,b){return If(a)&&Nf(b)?Of($f(a),b):function(c){var d=Ki(c,a)
;return d===ca&&d===b?Mi(c,a):Cd(b,d,na|oa)}}function Rd(a,b,c,d,e){a!==b&&pl(b,function(f,g){if(di(f))e||(e=new rc),
Sd(a,b,g,c,Rd,d,e);else{var h=d?d(Wf(a,g),f,g+"",a,b,e):ca;h===ca&&(h=f),Bc(a,g,h)}},Oi)}function Sd(a,b,c,d,e,f,g){
var h=Wf(a,c),i=Wf(b,c),j=g.get(i);if(j)return void Bc(a,c,j);var k=f?f(h,i,c+"",a,b,g):ca,l=k===ca;if(l){
var m=pm(i),n=!m&&rm(i),o=!m&&!n&&wm(i);k=i,m||n||o?pm(h)?k=h:Uh(h)?k=Ie(h):n?(l=!1,k=ye(i,!0)):o?(l=!1,
k=De(i,!0)):k=[]:mi(i)||om(i)?(k=h,om(h)?k=yi(h):di(h)&&!ai(h)||(k=Cf(i))):l=!1}l&&(g.set(i,k),e(k,i,d,f,g),
g.delete(i)),Bc(a,c,k)}function Td(a,b){var c=a.length;if(c)return b+=b<0?c:0,Gf(b,c)?a[b]:ca}function Ud(a,b,c){
var d=-1;return b=n(b.length?b:[Dj],H(tf())),D(Od(a,function(a,c,e){return{criteria:n(b,function(b){return b(a)}),
index:++d,value:a}}),function(a,b){return Fe(a,b,c)})}function Vd(a,b){return Wd(a,b,function(b,c){return Mi(a,c)})}
function Wd(a,b,c){for(var d=-1,e=b.length,f={};++d<e;){var g=b[d],h=ed(a,g);c(h,g)&&ee(f,we(g,a),h)}return f}
function Xd(a){return function(b){return ed(b,a)}}function Yd(a,b,c,d){var e=d?x:w,f=-1,g=b.length,h=a
;for(a===b&&(b=Ie(b)),c&&(h=n(a,H(c)));++f<g;)for(var i=0,j=b[f],k=c?c(j):j;(i=e(h,k,i,d))>-1;)h!==a&&Dk.call(h,i,1),
Dk.call(a,i,1);return a}function Zd(a,b){for(var c=a?b.length:0,d=c-1;c--;){var e=b[c];if(c==d||e!==f){var f=e
;Gf(e)?Dk.call(a,e,1):oe(a,e)}}return a}function $d(a,b){return a+Mk(Wk()*(b-a+1))}function _d(a,b,c,d){
for(var e=-1,f=Sk(Lk((b-a)/(c||1)),0),g=bk(f);f--;)g[d?f:++e]=a,a+=c;return g}function ae(a,b){var c=""
;if(!a||b<1||b>Ha)return c;do{b%2&&(c+=a),(b=Mk(b/2))&&(a+=a)}while(b);return c}function be(a,b){
return Dl(Tf(a,b,Dj),a+"")}function ce(a){return yc($i(a))}function de(a,b){var c=$i(a);return Zf(c,Jc(b,0,c.length))}
function ee(a,b,c,d){if(!di(a))return a;b=we(b,a);for(var e=-1,f=b.length,g=f-1,h=a;null!=h&&++e<f;){var i=$f(b[e]),j=c
;if(e!=g){var k=h[i];j=d?d(k,i,h):ca,j===ca&&(j=di(k)?k:Gf(b[e+1])?[]:{})}Cc(h,i,j),h=h[i]}return a}function fe(a){
return Zf($i(a))}function ge(a,b,c){var d=-1,e=a.length;b<0&&(b=-b>e?0:e+b),c=c>e?e:c,c<0&&(c+=e),e=b>c?0:c-b>>>0,b>>>=0
;for(var f=bk(e);++d<e;)f[d]=a[d+b];return f}function he(a,b){var c;return nl(a,function(a,d,e){return!(c=b(a,d,e))}),
!!c}function ie(a,b,c){var d=0,e=null==a?d:a.length;if("number"==typeof b&&b===b&&e<=Ma){for(;d<e;){var f=d+e>>>1,g=a[f]
;null!==g&&!pi(g)&&(c?g<=b:g<b)?d=f+1:e=f}return e}return je(a,b,Dj,c)}function je(a,b,c,d){b=c(b)
;for(var e=0,f=null==a?0:a.length,g=b!==b,h=null===b,i=pi(b),j=b===ca;e<f;){
var k=Mk((e+f)/2),l=c(a[k]),m=l!==ca,n=null===l,o=l===l,p=pi(l)
;if(g)var q=d||o;else q=j?o&&(d||m):h?o&&m&&(d||!n):i?o&&m&&!n&&(d||!p):!n&&!p&&(d?l<=b:l<b);q?e=k+1:f=k}return Tk(f,La)
}function ke(a,b){for(var c=-1,d=a.length,e=0,f=[];++c<d;){var g=a[c],h=b?b(g):g;if(!c||!Sh(h,i)){var i=h
;f[e++]=0===g?0:g}}return f}function le(a){return"number"==typeof a?a:pi(a)?Ja:+a}function me(a){
if("string"==typeof a)return a;if(pm(a))return n(a,me)+"";if(pi(a))return ll?ll.call(a):"";var b=a+""
;return"0"==b&&1/a==-Ga?"-0":b}function ne(a,b,c){var d=-1,e=l,f=a.length,g=!0,h=[],i=h;if(c)g=!1,e=m;else if(f>=ea){
var j=b?null:vl(a);if(j)return V(j);g=!1,e=J,i=new oc}else i=b?[]:h;a:for(;++d<f;){var k=a[d],n=b?b(k):k
;if(k=c||0!==k?k:0,g&&n===n){for(var o=i.length;o--;)if(i[o]===n)continue a;b&&i.push(n),h.push(k)
}else e(i,n,c)||(i!==h&&i.push(n),h.push(k))}return h}function oe(a,b){return b=we(b,a),
null==(a=Uf(a,b))||delete a[$f(ug(b))]}function pe(a,b,c,d){return ee(a,b,c(ed(a,b)),d)}function qe(a,b,c,d){
for(var e=a.length,f=d?e:-1;(d?f--:++f<e)&&b(a[f],f,a););return c?ge(a,d?0:f,d?f+1:e):ge(a,d?f+1:0,d?e:f)}
function re(a,b){var c=a;return c instanceof s&&(c=c.value()),p(b,function(a,b){
return b.func.apply(b.thisArg,o([a],b.args))},c)}function se(a,b,c){var d=a.length;if(d<2)return d?ne(a[0]):[]
;for(var e=-1,f=bk(d);++e<d;)for(var g=a[e],h=-1;++h<d;)h!=e&&(f[e]=Qc(f[e]||g,a[h],b,c));return ne(Zc(f,1),b,c)}
function te(a,b,c){for(var d=-1,e=a.length,f=b.length,g={};++d<e;){var h=d<f?b[d]:ca;c(g,a[d],h)}return g}
function ue(a){return Uh(a)?a:[]}function ve(a){return"function"==typeof a?a:Dj}function we(a,b){
return pm(a)?a:If(a,b)?[a]:El(Ai(a))}function xe(a,b,c){var d=a.length;return c=c===ca?d:c,!b&&c>=d?a:ge(a,b,c)}
function ye(a,b){if(b)return a.slice();var c=a.length,d=zk?zk(c):new a.constructor(c);return a.copy(d),d}function ze(a){
var b=new a.constructor(a.byteLength);return new yk(b).set(new yk(a)),b}function Ae(a,b){var c=b?ze(a.buffer):a.buffer
;return new a.constructor(c,a.byteOffset,a.byteLength)}function Be(a){var b=new a.constructor(a.source,Rb.exec(a))
;return b.lastIndex=a.lastIndex,b}function Ce(a){return kl?gk(kl.call(a)):{}}function De(a,b){
var c=b?ze(a.buffer):a.buffer;return new a.constructor(c,a.byteOffset,a.length)}function Ee(a,b){if(a!==b){
var c=a!==ca,d=null===a,e=a===a,f=pi(a),g=b!==ca,h=null===b,i=b===b,j=pi(b)
;if(!h&&!j&&!f&&a>b||f&&g&&i&&!h&&!j||d&&g&&i||!c&&i||!e)return 1
;if(!d&&!f&&!j&&a<b||j&&c&&e&&!d&&!f||h&&c&&e||!g&&e||!i)return-1}return 0}function Fe(a,b,c){
for(var d=-1,e=a.criteria,f=b.criteria,g=e.length,h=c.length;++d<g;){var i=Ee(e[d],f[d]);if(i){if(d>=h)return i
;return i*("desc"==c[d]?-1:1)}}return a.index-b.index}function Ge(a,b,c,d){
for(var e=-1,f=a.length,g=c.length,h=-1,i=b.length,j=Sk(f-g,0),k=bk(i+j),l=!d;++h<i;)k[h]=b[h]
;for(;++e<g;)(l||e<f)&&(k[c[e]]=a[e]);for(;j--;)k[h++]=a[e++];return k}function He(a,b,c,d){
for(var e=-1,f=a.length,g=-1,h=c.length,i=-1,j=b.length,k=Sk(f-h,0),l=bk(k+j),m=!d;++e<k;)l[e]=a[e]
;for(var n=e;++i<j;)l[n+i]=b[i];for(;++g<h;)(m||e<f)&&(l[n+c[g]]=a[e++]);return l}function Ie(a,b){var c=-1,d=a.length
;for(b||(b=bk(d));++c<d;)b[c]=a[c];return b}function Je(a,b,c,d){var e=!c;c||(c={});for(var f=-1,g=b.length;++f<g;){
var h=b[f],i=d?d(c[h],a[h],h,c,a):ca;i===ca&&(i=a[h]),e?Hc(c,h,i):Cc(c,h,i)}return c}function Ke(a,b){
return Je(a,xl(a),b)}function Le(a,b){return Je(a,yl(a),b)}function Me(a,b){return function(c,d){
var e=pm(c)?g:Ec,f=b?b():{};return e(c,a,tf(d,2),f)}}function Ne(a){return be(function(b,c){
var d=-1,e=c.length,f=e>1?c[e-1]:ca,g=e>2?c[2]:ca;for(f=a.length>3&&"function"==typeof f?(e--,f):ca,
g&&Hf(c[0],c[1],g)&&(f=e<3?ca:f,e=1),b=gk(b);++d<e;){var h=c[d];h&&a(b,h,d,f)}return b})}function Oe(a,b){
return function(c,d){if(null==c)return c;if(!Th(c))return a(c,d)
;for(var e=c.length,f=b?e:-1,g=gk(c);(b?f--:++f<e)&&!1!==d(g[f],f,g););return c}}function Pe(a){return function(b,c,d){
for(var e=-1,f=gk(b),g=d(b),h=g.length;h--;){var i=g[a?h:++e];if(!1===c(f[i],i,f))break}return b}}function Qe(a,b,c){
function d(){return(this&&this!==dd&&this instanceof d?f:a).apply(e?c:this,arguments)}var e=b&pa,f=Te(a);return d}
function Re(a){return function(b){b=Ai(b);var c=P(b)?$(b):ca,d=c?c[0]:b.charAt(0),e=c?xe(c,1).join(""):b.slice(1)
;return d[a]()+e}}function Se(a){return function(b){return p(yj(ej(b).replace(Nc,"")),a,"")}}function Te(a){
return function(){var b=arguments;switch(b.length){case 0:return new a;case 1:return new a(b[0]);case 2:
return new a(b[0],b[1]);case 3:return new a(b[0],b[1],b[2]);case 4:return new a(b[0],b[1],b[2],b[3]);case 5:
return new a(b[0],b[1],b[2],b[3],b[4]);case 6:return new a(b[0],b[1],b[2],b[3],b[4],b[5]);case 7:
return new a(b[0],b[1],b[2],b[3],b[4],b[5],b[6])}var c=ml(a.prototype),d=a.apply(c,b);return di(d)?d:c}}
function Ue(a,b,c){function d(){for(var g=arguments.length,h=bk(g),i=g,j=sf(d);i--;)h[i]=arguments[i]
;var k=g<3&&h[0]!==j&&h[g-1]!==j?[]:U(h,j)
;return(g-=k.length)<c?df(a,b,Xe,d.placeholder,ca,h,k,ca,ca,c-g):f(this&&this!==dd&&this instanceof d?e:a,this,h)}
var e=Te(a);return d}function Ve(a){return function(b,c,d){var e=gk(b);if(!Th(b)){var f=tf(c,3);b=Ni(b),c=function(a){
return f(e[a],a,e)}}var g=a(b,c,d);return g>-1?e[f?b[g]:g]:ca}}function We(a){return of(function(b){
var c=b.length,d=c,f=e.prototype.thru;for(a&&b.reverse();d--;){var g=b[d];if("function"!=typeof g)throw new jk(ga)
;if(f&&!h&&"wrapper"==rf(g))var h=new e([],!0)}for(d=h?d:c;++d<c;){g=b[d];var i=rf(g),j="wrapper"==i?wl(g):ca
;h=j&&Kf(j[0])&&j[1]==(wa|sa|ua|xa)&&!j[4].length&&1==j[9]?h[rf(j[0])].apply(h,j[3]):1==g.length&&Kf(g)?h[i]():h.thru(g)
}return function(){var a=arguments,d=a[0];if(h&&1==a.length&&pm(d))return h.plant(d).value()
;for(var e=0,f=c?b[e].apply(this,a):d;++e<c;)f=b[e].call(this,f);return f}})}function Xe(a,b,c,d,e,f,g,h,i,j){
function k(){for(var r=arguments.length,s=bk(r),t=r;t--;)s[t]=arguments[t];if(o)var u=sf(k),v=M(s,u)
;if(d&&(s=Ge(s,d,e,o)),f&&(s=He(s,f,g,o)),r-=v,o&&r<j){var w=U(s,u);return df(a,b,Xe,k.placeholder,c,s,w,h,i,j-r)}
var x=m?c:this,y=n?x[a]:a;return r=s.length,h?s=Vf(s,h):p&&r>1&&s.reverse(),l&&i<r&&(s.length=i),
this&&this!==dd&&this instanceof k&&(y=q||Te(y)),y.apply(x,s)}var l=b&wa,m=b&pa,n=b&qa,o=b&(sa|ta),p=b&ya,q=n?ca:Te(a)
;return k}function Ye(a,b){return function(c,d){return xd(c,a,b(d),{})}}function Ze(a,b){return function(c,d){var e
;if(c===ca&&d===ca)return b;if(c!==ca&&(e=c),d!==ca){if(e===ca)return d;"string"==typeof c||"string"==typeof d?(c=me(c),
d=me(d)):(c=le(c),d=le(d)),e=a(c,d)}return e}}function $e(a){return of(function(b){return b=n(b,H(tf())),be(function(c){
var d=this;return a(b,function(a){return f(a,d,c)})})})}function _e(a,b){b=b===ca?" ":me(b);var c=b.length
;if(c<2)return c?ae(b,a):b;var d=ae(b,Lk(a/Z(b)));return P(b)?xe($(d),0,a).join(""):d.slice(0,a)}function af(a,b,c,d){
function e(){
for(var b=-1,i=arguments.length,j=-1,k=d.length,l=bk(k+i),m=this&&this!==dd&&this instanceof e?h:a;++j<k;)l[j]=d[j]
;for(;i--;)l[j++]=arguments[++b];return f(m,g?c:this,l)}var g=b&pa,h=Te(a);return e}function bf(a){
return function(b,c,d){return d&&"number"!=typeof d&&Hf(b,c,d)&&(c=d=ca),b=ui(b),c===ca?(c=b,b=0):c=ui(c),
d=d===ca?b<c?1:-1:ui(d),_d(b,c,d,a)}}function cf(a){return function(b,c){
return"string"==typeof b&&"string"==typeof c||(b=xi(b),c=xi(c)),a(b,c)}}function df(a,b,c,d,e,f,g,h,i,j){
var k=b&sa,l=k?g:ca,m=k?ca:g,n=k?f:ca,o=k?ca:f;b|=k?ua:va,(b&=~(k?va:ua))&ra||(b&=~(pa|qa))
;var p=[a,b,e,n,l,o,m,h,i,j],q=c.apply(ca,p);return Kf(a)&&Bl(q,p),q.placeholder=d,Xf(q,a,b)}function ef(a){var b=fk[a]
;return function(a,c){if(a=xi(a),c=null==c?0:Tk(vi(c),292)){var d=(Ai(a)+"e").split("e")
;return d=(Ai(b(d[0]+"e"+(+d[1]+c)))+"e").split("e"),+(d[0]+"e"+(+d[1]-c))}return b(a)}}function ff(a){
return function(b){var c=zl(b);return c==Xa?S(b):c==cb?W(b):G(b,a(b))}}function gf(a,b,c,d,e,f,g,h){var i=b&qa
;if(!i&&"function"!=typeof a)throw new jk(ga);var j=d?d.length:0;if(j||(b&=~(ua|va),d=e=ca),g=g===ca?g:Sk(vi(g),0),
h=h===ca?h:vi(h),j-=e?e.length:0,b&va){var k=d,l=e;d=e=ca}var m=i?ca:wl(a),n=[a,b,c,d,e,k,l,f,g,h];if(m&&Qf(n,m),a=n[0],
b=n[1],c=n[2],d=n[3],e=n[4],h=n[9]=n[9]===ca?i?0:a.length:Sk(n[9]-j,0),!h&&b&(sa|ta)&&(b&=~(sa|ta)),
b&&b!=pa)o=b==sa||b==ta?Ue(a,b,h):b!=ua&&b!=(pa|ua)||e.length?Xe.apply(ca,n):af(a,b,c,d);else var o=Qe(a,b,c)
;return Xf((m?rl:Bl)(o,n),a,b)}function hf(a,b,c,d){return a===ca||Sh(a,mk[c])&&!pk.call(d,c)?b:a}
function jf(a,b,c,d,e,f){return di(a)&&di(b)&&(f.set(b,a),Rd(a,b,ca,jf,f),f.delete(b)),a}function kf(a){
return mi(a)?ca:a}function lf(a,b,c,d,e,f){var g=c&na,h=a.length,i=b.length;if(h!=i&&!(g&&i>h))return!1;var j=f.get(a)
;if(j&&f.get(b))return j==b;var k=-1,l=!0,m=c&oa?new oc:ca;for(f.set(a,b),f.set(b,a);++k<h;){var n=a[k],o=b[k]
;if(d)var p=g?d(o,n,k,b,a,f):d(n,o,k,a,b,f);if(p!==ca){if(p)continue;l=!1;break}if(m){if(!r(b,function(a,b){
if(!J(m,b)&&(n===a||e(n,a,c,d,f)))return m.push(b)})){l=!1;break}}else if(n!==o&&!e(n,o,c,d,f)){l=!1;break}}
return f.delete(a),f.delete(b),l}function mf(a,b,c,d,e,f,g){switch(c){case jb:
if(a.byteLength!=b.byteLength||a.byteOffset!=b.byteOffset)return!1;a=a.buffer,b=b.buffer;case ib:
return!(a.byteLength!=b.byteLength||!f(new yk(a),new yk(b)));case Ra:case Sa:case Ya:return Sh(+a,+b);case Ua:
return a.name==b.name&&a.message==b.message;case bb:case db:return a==b+"";case Xa:var h=S;case cb:var i=d&na
;if(h||(h=V),a.size!=b.size&&!i)return!1;var j=g.get(a);if(j)return j==b;d|=oa,g.set(a,b);var k=lf(h(a),h(b),d,e,f,g)
;return g.delete(a),k;case eb:if(kl)return kl.call(a)==kl.call(b)}return!1}function nf(a,b,c,d,e,f){
var g=c&na,h=pf(a),i=h.length;if(i!=pf(b).length&&!g)return!1;for(var j=i;j--;){var k=h[j]
;if(!(g?k in b:pk.call(b,k)))return!1}var l=f.get(a);if(l&&f.get(b))return l==b;var m=!0;f.set(a,b),f.set(b,a)
;for(var n=g;++j<i;){k=h[j];var o=a[k],p=b[k];if(d)var q=g?d(p,o,k,b,a,f):d(o,p,k,a,b,f)
;if(!(q===ca?o===p||e(o,p,c,d,f):q)){m=!1;break}n||(n="constructor"==k)}if(m&&!n){var r=a.constructor,s=b.constructor
;r!=s&&"constructor"in a&&"constructor"in b&&!("function"==typeof r&&r instanceof r&&"function"==typeof s&&s instanceof s)&&(m=!1)
}return f.delete(a),f.delete(b),m}function of(a){return Dl(Tf(a,ca,mg),a+"")}function pf(a){return fd(a,Ni,xl)}
function qf(a){return fd(a,Oi,yl)}function rf(a){for(var b=a.name+"",c=dl[b],d=pk.call(dl,b)?c.length:0;d--;){
var e=c[d],f=e.func;if(null==f||f==a)return e.name}return b}function sf(a){
return(pk.call(c,"placeholder")?c:a).placeholder}function tf(){var a=c.iteratee||Ej;return a=a===Ej?Kd:a,
arguments.length?a(arguments[0],arguments[1]):a}function uf(a,b){var c=a.__data__
;return Jf(b)?c["string"==typeof b?"string":"hash"]:c.map}function vf(a){for(var b=Ni(a),c=b.length;c--;){
var d=b[c],e=a[d];b[c]=[d,e,Nf(e)]}return b}function wf(a,b){var c=O(a,b);return Gd(c)?c:ca}function xf(a){
var b=pk.call(a,Gk),c=a[Gk];try{a[Gk]=ca;var d=!0}catch(a){}var e=sk.call(a);return d&&(b?a[Gk]=c:delete a[Gk]),e}
function yf(a,b,c){for(var d=-1,e=c.length;++d<e;){var f=c[d],g=f.size;switch(f.type){case"drop":a+=g;break
;case"dropRight":b-=g;break;case"take":b=Tk(b,a+g);break;case"takeRight":a=Sk(a,b-g)}}return{start:a,end:b}}
function zf(a){var b=a.match(Mb);return b?b[1].split(Nb):[]}function Af(a,b,c){b=we(b,a)
;for(var d=-1,e=b.length,f=!1;++d<e;){var g=$f(b[d]);if(!(f=null!=a&&c(a,g)))break;a=a[g]}
return f||++d!=e?f:!!(e=null==a?0:a.length)&&ci(e)&&Gf(g,e)&&(pm(a)||om(a))}function Bf(a){
var b=a.length,c=new a.constructor(b);return b&&"string"==typeof a[0]&&pk.call(a,"index")&&(c.index=a.index,
c.input=a.input),c}function Cf(a){return"function"!=typeof a.constructor||Mf(a)?{}:ml(Ak(a))}function Df(a,b,c){
var d=a.constructor;switch(b){case ib:return ze(a);case Ra:case Sa:return new d(+a);case jb:return Ae(a,c);case kb:
case lb:case mb:case nb:case ob:case pb:case qb:case rb:case sb:return De(a,c);case Xa:return new d;case Ya:case db:
return new d(a);case bb:return Be(a);case cb:return new d;case eb:return Ce(a)}}function Ef(a,b){var c=b.length
;if(!c)return a;var d=c-1;return b[d]=(c>1?"& ":"")+b[d],b=b.join(c>2?", ":" "),
a.replace(Lb,"{\n/* [wrapped with "+b+"] */\n")}function Ff(a){return pm(a)||om(a)||!!(Ek&&a&&a[Ek])}function Gf(a,b){
var c=typeof a;return!!(b=null==b?Ha:b)&&("number"==c||"symbol"!=c&&Wb.test(a))&&a>-1&&a%1==0&&a<b}function Hf(a,b,c){
if(!di(c))return!1;var d=typeof b;return!!("number"==d?Th(c)&&Gf(b,c.length):"string"==d&&b in c)&&Sh(c[b],a)}
function If(a,b){if(pm(a))return!1;var c=typeof a
;return!("number"!=c&&"symbol"!=c&&"boolean"!=c&&null!=a&&!pi(a))||(Eb.test(a)||!Db.test(a)||null!=b&&a in gk(b))}
function Jf(a){var b=typeof a;return"string"==b||"number"==b||"symbol"==b||"boolean"==b?"__proto__"!==a:null===a}
function Kf(a){var b=rf(a),d=c[b];if("function"!=typeof d||!(b in s.prototype))return!1;if(a===d)return!0;var e=wl(d)
;return!!e&&a===e[0]}function Lf(a){return!!rk&&rk in a}function Mf(a){var b=a&&a.constructor
;return a===("function"==typeof b&&b.prototype||mk)}function Nf(a){return a===a&&!di(a)}function Of(a,b){
return function(c){return null!=c&&(c[a]===b&&(b!==ca||a in gk(c)))}}function Pf(a){var b=Eh(a,function(a){
return c.size===ia&&c.clear(),a}),c=b.cache;return b}function Qf(a,b){
var c=a[1],d=b[1],e=c|d,f=e<(pa|qa|wa),g=d==wa&&c==sa||d==wa&&c==xa&&a[7].length<=b[8]||d==(wa|xa)&&b[7].length<=b[8]&&c==sa
;if(!f&&!g)return a;d&pa&&(a[2]=b[2],e|=c&pa?0:ra);var h=b[3];if(h){var i=a[3];a[3]=i?Ge(i,h,b[4]):h,
a[4]=i?U(a[3],ja):b[4]}return h=b[5],h&&(i=a[5],a[5]=i?He(i,h,b[6]):h,a[6]=i?U(a[5],ja):b[6]),h=b[7],h&&(a[7]=h),
d&wa&&(a[8]=null==a[8]?b[8]:Tk(a[8],b[8])),null==a[9]&&(a[9]=b[9]),a[0]=b[0],a[1]=e,a}function Rf(a){var b=[]
;if(null!=a)for(var c in gk(a))b.push(c);return b}function Sf(a){return sk.call(a)}function Tf(a,b,c){
return b=Sk(b===ca?a.length-1:b,0),function(){for(var d=arguments,e=-1,g=Sk(d.length-b,0),h=bk(g);++e<g;)h[e]=d[b+e]
;e=-1;for(var i=bk(b+1);++e<b;)i[e]=d[e];return i[b]=c(h),f(a,this,i)}}function Uf(a,b){
return b.length<2?a:ed(a,ge(b,0,-1))}function Vf(a,b){for(var c=a.length,d=Tk(b.length,c),e=Ie(a);d--;){var f=b[d]
;a[d]=Gf(f,c)?e[f]:ca}return a}function Wf(a,b){if("__proto__"!=b)return a[b]}function Xf(a,b,c){var d=b+""
;return Dl(a,Ef(d,ag(zf(d),c)))}function Yf(a){var b=0,c=0;return function(){var d=Uk(),e=Ca-(d-c);if(c=d,e>0){
if(++b>=Ba)return arguments[0]}else b=0;return a.apply(ca,arguments)}}function Zf(a,b){var c=-1,d=a.length,e=d-1
;for(b=b===ca?d:b;++c<b;){var f=$d(c,e),g=a[f];a[f]=a[c],a[c]=g}return a.length=b,a}function $f(a){
if("string"==typeof a||pi(a))return a;var b=a+"";return"0"==b&&1/a==-Ga?"-0":b}function _f(a){if(null!=a){try{
return ok.call(a)}catch(a){}try{return a+""}catch(a){}}return""}function ag(a,b){return h(Na,function(c){var d="_."+c[0]
;b&c[1]&&!l(a,d)&&a.push(d)}),a.sort()}function bg(a){if(a instanceof s)return a.clone()
;var b=new e(a.__wrapped__,a.__chain__);return b.__actions__=Ie(a.__actions__),b.__index__=a.__index__,
b.__values__=a.__values__,b}function cg(a,b,c){b=(c?Hf(a,b,c):b===ca)?1:Sk(vi(b),0);var d=null==a?0:a.length
;if(!d||b<1)return[];for(var e=0,f=0,g=bk(Lk(d/b));e<d;)g[f++]=ge(a,e,e+=b);return g}function dg(a){
for(var b=-1,c=null==a?0:a.length,d=0,e=[];++b<c;){var f=a[b];f&&(e[d++]=f)}return e}function eg(){
var a=arguments.length;if(!a)return[];for(var b=bk(a-1),c=arguments[0],d=a;d--;)b[d-1]=arguments[d]
;return o(pm(c)?Ie(c):[c],Zc(b,1))}function fg(a,b,c){var d=null==a?0:a.length;return d?(b=c||b===ca?1:vi(b),
ge(a,b<0?0:b,d)):[]}function gg(a,b,c){var d=null==a?0:a.length;return d?(b=c||b===ca?1:vi(b),b=d-b,ge(a,0,b<0?0:b)):[]}
function hg(a,b){return a&&a.length?qe(a,tf(b,3),!0,!0):[]}function ig(a,b){return a&&a.length?qe(a,tf(b,3),!0):[]}
function jg(a,b,c,d){var e=null==a?0:a.length;return e?(c&&"number"!=typeof c&&Hf(a,b,c)&&(c=0,d=e),Xc(a,b,c,d)):[]}
function kg(a,b,c){var d=null==a?0:a.length;if(!d)return-1;var e=null==c?0:vi(c);return e<0&&(e=Sk(d+e,0)),
v(a,tf(b,3),e)}function lg(a,b,c){var d=null==a?0:a.length;if(!d)return-1;var e=d-1;return c!==ca&&(e=vi(c),
e=c<0?Sk(d+e,0):Tk(e,d-1)),v(a,tf(b,3),e,!0)}function mg(a){return(null==a?0:a.length)?Zc(a,1):[]}function ng(a){
return(null==a?0:a.length)?Zc(a,Ga):[]}function og(a,b){return(null==a?0:a.length)?(b=b===ca?1:vi(b),Zc(a,b)):[]}
function pg(a){for(var b=-1,c=null==a?0:a.length,d={};++b<c;){var e=a[b];d[e[0]]=e[1]}return d}function qg(a){
return a&&a.length?a[0]:ca}function rg(a,b,c){var d=null==a?0:a.length;if(!d)return-1;var e=null==c?0:vi(c)
;return e<0&&(e=Sk(d+e,0)),w(a,b,e)}function sg(a){return(null==a?0:a.length)?ge(a,0,-1):[]}function tg(a,b){
return null==a?"":Qk.call(a,b)}function ug(a){var b=null==a?0:a.length;return b?a[b-1]:ca}function vg(a,b,c){
var d=null==a?0:a.length;if(!d)return-1;var e=d;return c!==ca&&(e=vi(c),e=e<0?Sk(d+e,0):Tk(e,d-1)),
b===b?Y(a,b,e):v(a,y,e,!0)}function wg(a,b){return a&&a.length?Td(a,vi(b)):ca}function xg(a,b){
return a&&a.length&&b&&b.length?Yd(a,b):a}function yg(a,b,c){return a&&a.length&&b&&b.length?Yd(a,b,tf(c,2)):a}
function zg(a,b,c){return a&&a.length&&b&&b.length?Yd(a,b,ca,c):a}function Ag(a,b){var c=[];if(!a||!a.length)return c
;var d=-1,e=[],f=a.length;for(b=tf(b,3);++d<f;){var g=a[d];b(g,d,a)&&(c.push(g),e.push(d))}return Zd(a,e),c}
function Bg(a){return null==a?a:Xk.call(a)}function Cg(a,b,c){var d=null==a?0:a.length
;return d?(c&&"number"!=typeof c&&Hf(a,b,c)?(b=0,c=d):(b=null==b?0:vi(b),c=c===ca?d:vi(c)),ge(a,b,c)):[]}
function Dg(a,b){return ie(a,b)}function Eg(a,b,c){return je(a,b,tf(c,2))}function Fg(a,b){var c=null==a?0:a.length
;if(c){var d=ie(a,b);if(d<c&&Sh(a[d],b))return d}return-1}function Gg(a,b){return ie(a,b,!0)}function Hg(a,b,c){
return je(a,b,tf(c,2),!0)}function Ig(a,b){if(null==a?0:a.length){var c=ie(a,b,!0)-1;if(Sh(a[c],b))return c}return-1}
function Jg(a){return a&&a.length?ke(a):[]}function Kg(a,b){return a&&a.length?ke(a,tf(b,2)):[]}function Lg(a){
var b=null==a?0:a.length;return b?ge(a,1,b):[]}function Mg(a,b,c){return a&&a.length?(b=c||b===ca?1:vi(b),
ge(a,0,b<0?0:b)):[]}function Ng(a,b,c){var d=null==a?0:a.length;return d?(b=c||b===ca?1:vi(b),b=d-b,ge(a,b<0?0:b,d)):[]}
function Og(a,b){return a&&a.length?qe(a,tf(b,3),!1,!0):[]}function Pg(a,b){return a&&a.length?qe(a,tf(b,3)):[]}
function Qg(a){return a&&a.length?ne(a):[]}function Rg(a,b){return a&&a.length?ne(a,tf(b,2)):[]}function Sg(a,b){
return b="function"==typeof b?b:ca,a&&a.length?ne(a,ca,b):[]}function Tg(a){if(!a||!a.length)return[];var b=0
;return a=k(a,function(a){if(Uh(a))return b=Sk(a.length,b),!0}),F(b,function(b){return n(a,A(b))})}function Ug(a,b){
if(!a||!a.length)return[];var c=Tg(a);return null==b?c:n(c,function(a){return f(b,ca,a)})}function Vg(a,b){
return te(a||[],b||[],Cc)}function Wg(a,b){return te(a||[],b||[],ee)}function Xg(a){var b=c(a);return b.__chain__=!0,b}
function Yg(a,b){return b(a),a}function Zg(a,b){return b(a)}function $g(){return Xg(this)}function _g(){
return new e(this.value(),this.__chain__)}function ah(){this.__values__===ca&&(this.__values__=ti(this.value()))
;var a=this.__index__>=this.__values__.length;return{done:a,value:a?ca:this.__values__[this.__index__++]}}function bh(){
return this}function ch(a){for(var b,c=this;c instanceof d;){var e=bg(c);e.__index__=0,e.__values__=ca,
b?f.__wrapped__=e:b=e;var f=e;c=c.__wrapped__}return f.__wrapped__=a,b}function dh(){var a=this.__wrapped__
;if(a instanceof s){var b=a;return this.__actions__.length&&(b=new s(this)),b=b.reverse(),b.__actions__.push({func:Zg,
args:[Bg],thisArg:ca}),new e(b,this.__chain__)}return this.thru(Bg)}function eh(){
return re(this.__wrapped__,this.__actions__)}function fh(a,b,c){var d=pm(a)?j:Rc;return c&&Hf(a,b,c)&&(b=ca),
d(a,tf(b,3))}function gh(a,b){return(pm(a)?k:Yc)(a,tf(b,3))}function hh(a,b){return Zc(nh(a,b),1)}function ih(a,b){
return Zc(nh(a,b),Ga)}function jh(a,b,c){return c=c===ca?1:vi(c),Zc(nh(a,b),c)}function kh(a,b){
return(pm(a)?h:nl)(a,tf(b,3))}function lh(a,b){return(pm(a)?i:ol)(a,tf(b,3))}function mh(a,b,c,d){a=Th(a)?a:$i(a),
c=c&&!d?vi(c):0;var e=a.length;return c<0&&(c=Sk(e+c,0)),oi(a)?c<=e&&a.indexOf(b,c)>-1:!!e&&w(a,b,c)>-1}
function nh(a,b){return(pm(a)?n:Od)(a,tf(b,3))}function oh(a,b,c,d){return null==a?[]:(pm(b)||(b=null==b?[]:[b]),
c=d?ca:c,pm(c)||(c=null==c?[]:[c]),Ud(a,b,c))}function ph(a,b,c){var d=pm(a)?p:C,e=arguments.length<3
;return d(a,tf(b,4),c,e,nl)}function qh(a,b,c){var d=pm(a)?q:C,e=arguments.length<3;return d(a,tf(b,4),c,e,ol)}
function rh(a,b){return(pm(a)?k:Yc)(a,Fh(tf(b,3)))}function sh(a){return(pm(a)?yc:ce)(a)}function th(a,b,c){
return b=(c?Hf(a,b,c):b===ca)?1:vi(b),(pm(a)?zc:de)(a,b)}function uh(a){return(pm(a)?Ac:fe)(a)}function vh(a){
if(null==a)return 0;if(Th(a))return oi(a)?Z(a):a.length;var b=zl(a);return b==Xa||b==cb?a.size:Ld(a).length}
function wh(a,b,c){var d=pm(a)?r:he;return c&&Hf(a,b,c)&&(b=ca),d(a,tf(b,3))}function xh(a,b){
if("function"!=typeof b)throw new jk(ga);return a=vi(a),function(){if(--a<1)return b.apply(this,arguments)}}
function yh(a,b,c){return b=c?ca:b,b=a&&null==b?a.length:b,gf(a,wa,ca,ca,ca,ca,b)}function zh(a,b){var c
;if("function"!=typeof b)throw new jk(ga);return a=vi(a),function(){return--a>0&&(c=b.apply(this,arguments)),
a<=1&&(b=ca),c}}function Ah(a,b,c){b=c?ca:b;var d=gf(a,sa,ca,ca,ca,ca,ca,b);return d.placeholder=Ah.placeholder,d}
function Bh(a,b,c){b=c?ca:b;var d=gf(a,ta,ca,ca,ca,ca,ca,b);return d.placeholder=Bh.placeholder,d}function Ch(a,b,c){
function d(b){var c=m,d=n;return m=n=ca,s=b,p=a.apply(d,c)}function e(a){return s=a,q=Cl(h,b),t?d(a):p}function f(a){
var c=a-r,d=a-s,e=b-c;return u?Tk(e,o-d):e}function g(a){var c=a-r,d=a-s;return r===ca||c>=b||c<0||u&&d>=o}function h(){
var a=dm();if(g(a))return i(a);q=Cl(h,f(a))}function i(a){return q=ca,v&&m?d(a):(m=n=ca,p)}function j(){q!==ca&&ul(q),
s=0,m=r=n=q=ca}function k(){return q===ca?p:i(dm())}function l(){var a=dm(),c=g(a);if(m=arguments,n=this,r=a,c){
if(q===ca)return e(r);if(u)return q=Cl(h,b),d(r)}return q===ca&&(q=Cl(h,b)),p}var m,n,o,p,q,r,s=0,t=!1,u=!1,v=!0
;if("function"!=typeof a)throw new jk(ga);return b=xi(b)||0,di(c)&&(t=!!c.leading,u="maxWait"in c,
o=u?Sk(xi(c.maxWait)||0,b):o,v="trailing"in c?!!c.trailing:v),l.cancel=j,l.flush=k,l}function Dh(a){return gf(a,ya)}
function Eh(a,b){if("function"!=typeof a||null!=b&&"function"!=typeof b)throw new jk(ga);var c=function(){
var d=arguments,e=b?b.apply(this,d):d[0],f=c.cache;if(f.has(e))return f.get(e);var g=a.apply(this,d)
;return c.cache=f.set(e,g)||f,g};return c.cache=new(Eh.Cache||ic),c}function Fh(a){
if("function"!=typeof a)throw new jk(ga);return function(){var b=arguments;switch(b.length){case 0:return!a.call(this)
;case 1:return!a.call(this,b[0]);case 2:return!a.call(this,b[0],b[1]);case 3:return!a.call(this,b[0],b[1],b[2])}
return!a.apply(this,b)}}function Gh(a){return zh(2,a)}function Hh(a,b){if("function"!=typeof a)throw new jk(ga)
;return b=b===ca?b:vi(b),be(a,b)}function Ih(a,b){if("function"!=typeof a)throw new jk(ga)
;return b=null==b?0:Sk(vi(b),0),be(function(c){var d=c[b],e=xe(c,0,b);return d&&o(e,d),f(a,this,e)})}function Jh(a,b,c){
var d=!0,e=!0;if("function"!=typeof a)throw new jk(ga);return di(c)&&(d="leading"in c?!!c.leading:d,
e="trailing"in c?!!c.trailing:e),Ch(a,b,{leading:d,maxWait:b,trailing:e})}function Kh(a){return yh(a,1)}
function Lh(a,b){return jm(ve(b),a)}function Mh(){if(!arguments.length)return[];var a=arguments[0];return pm(a)?a:[a]}
function Nh(a){return Kc(a,ma)}function Oh(a,b){return b="function"==typeof b?b:ca,Kc(a,ma,b)}function Ph(a){
return Kc(a,ka|ma)}function Qh(a,b){return b="function"==typeof b?b:ca,Kc(a,ka|ma,b)}function Rh(a,b){
return null==b||Mc(a,b,Ni(b))}function Sh(a,b){return a===b||a!==a&&b!==b}function Th(a){
return null!=a&&ci(a.length)&&!ai(a)}function Uh(a){return ei(a)&&Th(a)}function Vh(a){
return!0===a||!1===a||ei(a)&&hd(a)==Ra}function Wh(a){return ei(a)&&1===a.nodeType&&!mi(a)}function Xh(a){
if(null==a)return!0
;if(Th(a)&&(pm(a)||"string"==typeof a||"function"==typeof a.splice||rm(a)||wm(a)||om(a)))return!a.length;var b=zl(a)
;if(b==Xa||b==cb)return!a.size;if(Mf(a))return!Ld(a).length;for(var c in a)if(pk.call(a,c))return!1;return!0}
function Yh(a,b){return Cd(a,b)}function Zh(a,b,c){c="function"==typeof c?c:ca;var d=c?c(a,b):ca
;return d===ca?Cd(a,b,ca,c):!!d}function $h(a){if(!ei(a))return!1;var b=hd(a)
;return b==Ua||b==Ta||"string"==typeof a.message&&"string"==typeof a.name&&!mi(a)}function _h(a){
return"number"==typeof a&&Pk(a)}function ai(a){if(!di(a))return!1;var b=hd(a);return b==Va||b==Wa||b==Qa||b==ab}
function bi(a){return"number"==typeof a&&a==vi(a)}function ci(a){return"number"==typeof a&&a>-1&&a%1==0&&a<=Ha}
function di(a){var b=typeof a;return null!=a&&("object"==b||"function"==b)}function ei(a){
return null!=a&&"object"==typeof a}function fi(a,b){return a===b||Fd(a,b,vf(b))}function gi(a,b,c){
return c="function"==typeof c?c:ca,Fd(a,b,vf(b),c)}function hi(a){return li(a)&&a!=+a}function ii(a){
if(Al(a))throw new dk(fa);return Gd(a)}function ji(a){return null===a}function ki(a){return null==a}function li(a){
return"number"==typeof a||ei(a)&&hd(a)==Ya}function mi(a){if(!ei(a)||hd(a)!=$a)return!1;var b=Ak(a);if(null===b)return!0
;var c=pk.call(b,"constructor")&&b.constructor;return"function"==typeof c&&c instanceof c&&ok.call(c)==tk}
function ni(a){return bi(a)&&a>=-Ha&&a<=Ha}function oi(a){return"string"==typeof a||!pm(a)&&ei(a)&&hd(a)==db}
function pi(a){return"symbol"==typeof a||ei(a)&&hd(a)==eb}function qi(a){return a===ca}function ri(a){
return ei(a)&&zl(a)==gb}function si(a){return ei(a)&&hd(a)==hb}function ti(a){if(!a)return[]
;if(Th(a))return oi(a)?$(a):Ie(a);if(Fk&&a[Fk])return R(a[Fk]());var b=zl(a);return(b==Xa?S:b==cb?V:$i)(a)}
function ui(a){if(!a)return 0===a?a:0;if((a=xi(a))===Ga||a===-Ga){return(a<0?-1:1)*Ia}return a===a?a:0}function vi(a){
var b=ui(a),c=b%1;return b===b?c?b-c:b:0}function wi(a){return a?Jc(vi(a),0,Ka):0}function xi(a){
if("number"==typeof a)return a;if(pi(a))return Ja;if(di(a)){var b="function"==typeof a.valueOf?a.valueOf():a
;a=di(b)?b+"":b}if("string"!=typeof a)return 0===a?a:+a;a=a.replace(Ib,"");var c=Tb.test(a)
;return c||Vb.test(a)?ad(a.slice(2),c?2:8):Sb.test(a)?Ja:+a}function yi(a){return Je(a,Oi(a))}function zi(a){
return a?Jc(vi(a),-Ha,Ha):0===a?a:0}function Ai(a){return null==a?"":me(a)}function Bi(a,b){var c=ml(a)
;return null==b?c:Fc(c,b)}function Ci(a,b){return u(a,tf(b,3),$c)}function Di(a,b){return u(a,tf(b,3),bd)}
function Ei(a,b){return null==a?a:pl(a,tf(b,3),Oi)}function Fi(a,b){return null==a?a:ql(a,tf(b,3),Oi)}function Gi(a,b){
return a&&$c(a,tf(b,3))}function Hi(a,b){return a&&bd(a,tf(b,3))}function Ii(a){return null==a?[]:cd(a,Ni(a))}
function Ji(a){return null==a?[]:cd(a,Oi(a))}function Ki(a,b,c){var d=null==a?ca:ed(a,b);return d===ca?c:d}
function Li(a,b){return null!=a&&Af(a,b,pd)}function Mi(a,b){return null!=a&&Af(a,b,td)}function Ni(a){
return Th(a)?xc(a):Ld(a)}function Oi(a){return Th(a)?xc(a,!0):Md(a)}function Pi(a,b){var c={};return b=tf(b,3),
$c(a,function(a,d,e){Hc(c,b(a,d,e),a)}),c}function Qi(a,b){var c={};return b=tf(b,3),$c(a,function(a,d,e){
Hc(c,d,b(a,d,e))}),c}function Ri(a,b){return Si(a,Fh(tf(b)))}function Si(a,b){if(null==a)return{}
;var c=n(qf(a),function(a){return[a]});return b=tf(b),Wd(a,c,function(a,c){return b(a,c[0])})}function Ti(a,b,c){
b=we(b,a);var d=-1,e=b.length;for(e||(e=1,a=ca);++d<e;){var f=null==a?ca:a[$f(b[d])];f===ca&&(d=e,f=c),
a=ai(f)?f.call(a):f}return a}function Ui(a,b,c){return null==a?a:ee(a,b,c)}function Vi(a,b,c,d){
return d="function"==typeof d?d:ca,null==a?a:ee(a,b,c,d)}function Wi(a,b,c){var d=pm(a),e=d||rm(a)||wm(a);if(b=tf(b,4),
null==c){var f=a&&a.constructor;c=e?d?new f:[]:di(a)&&ai(f)?ml(Ak(a)):{}}return(e?h:$c)(a,function(a,d,e){
return b(c,a,d,e)}),c}function Xi(a,b){return null==a||oe(a,b)}function Yi(a,b,c){return null==a?a:pe(a,b,ve(c))}
function Zi(a,b,c,d){return d="function"==typeof d?d:ca,null==a?a:pe(a,b,ve(c),d)}function $i(a){
return null==a?[]:I(a,Ni(a))}function _i(a){return null==a?[]:I(a,Oi(a))}function aj(a,b,c){return c===ca&&(c=b,b=ca),
c!==ca&&(c=xi(c),c=c===c?c:0),b!==ca&&(b=xi(b),b=b===b?b:0),Jc(xi(a),b,c)}function bj(a,b,c){return b=ui(b),c===ca?(c=b,
b=0):c=ui(c),a=xi(a),vd(a,b,c)}function cj(a,b,c){if(c&&"boolean"!=typeof c&&Hf(a,b,c)&&(b=c=ca),
c===ca&&("boolean"==typeof b?(c=b,b=ca):"boolean"==typeof a&&(c=a,a=ca)),a===ca&&b===ca?(a=0,b=1):(a=ui(a),b===ca?(b=a,
a=0):b=ui(b)),a>b){var d=a;a=b,b=d}if(c||a%1||b%1){var e=Wk();return Tk(a+e*(b-a+_c("1e-"+((e+"").length-1))),b)}
return $d(a,b)}function dj(a){return Wm(Ai(a).toLowerCase())}function ej(a){
return(a=Ai(a))&&a.replace(Xb,qd).replace(Oc,"")}function fj(a,b,c){a=Ai(a),b=me(b);var d=a.length
;c=c===ca?d:Jc(vi(c),0,d);var e=c;return(c-=b.length)>=0&&a.slice(c,e)==b}function gj(a){return a=Ai(a),
a&&zb.test(a)?a.replace(xb,rd):a}function hj(a){return a=Ai(a),a&&Hb.test(a)?a.replace(Gb,"\\$&"):a}function ij(a,b,c){
a=Ai(a),b=vi(b);var d=b?Z(a):0;if(!b||d>=b)return a;var e=(b-d)/2;return _e(Mk(e),c)+a+_e(Lk(e),c)}function jj(a,b,c){
a=Ai(a),b=vi(b);var d=b?Z(a):0;return b&&d<b?a+_e(b-d,c):a}function kj(a,b,c){a=Ai(a),b=vi(b);var d=b?Z(a):0
;return b&&d<b?_e(b-d,c)+a:a}function lj(a,b,c){return c||null==b?b=0:b&&(b=+b),Vk(Ai(a).replace(Jb,""),b||0)}
function mj(a,b,c){return b=(c?Hf(a,b,c):b===ca)?1:vi(b),ae(Ai(a),b)}function nj(){var a=arguments,b=Ai(a[0])
;return a.length<3?b:b.replace(a[1],a[2])}function oj(a,b,c){return c&&"number"!=typeof c&&Hf(a,b,c)&&(b=c=ca),
(c=c===ca?Ka:c>>>0)?(a=Ai(a),a&&("string"==typeof b||null!=b&&!um(b))&&!(b=me(b))&&P(a)?xe($(a),0,c):a.split(b,c)):[]}
function pj(a,b,c){return a=Ai(a),c=null==c?0:Jc(vi(c),0,a.length),b=me(b),a.slice(c,c+b.length)==b}function qj(a,b,d){
var e=c.templateSettings;d&&Hf(a,b,d)&&(b=ca),a=Ai(a),b=Bm({},b,e,hf)
;var f,g,h=Bm({},b.imports,e.imports,hf),i=Ni(h),j=I(h,i),k=0,l=b.interpolate||Yb,m="__p += '",n=hk((b.escape||Yb).source+"|"+l.source+"|"+(l===Cb?Qb:Yb).source+"|"+(b.evaluate||Yb).source+"|$","g"),o="//# sourceURL="+("sourceURL"in b?b.sourceURL:"lodash.templateSources["+ ++Uc+"]")+"\n"
;a.replace(n,function(b,c,d,e,h,i){return d||(d=e),m+=a.slice(k,i).replace(Zb,N),c&&(f=!0,m+="' +\n__e("+c+") +\n'"),
h&&(g=!0,m+="';\n"+h+";\n__p += '"),d&&(m+="' +\n((__t = ("+d+")) == null ? '' : __t) +\n'"),k=i+b.length,b}),m+="';\n"
;var p=b.variable;p||(m="with (obj) {\n"+m+"\n}\n"),m=(g?m.replace(tb,""):m).replace(ub,"$1").replace(vb,"$1;"),
m="function("+(p||"obj")+") {\n"+(p?"":"obj || (obj = {});\n")+"var __t, __p = ''"+(f?", __e = _.escape":"")+(g?", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n":";\n")+m+"return __p\n}"
;var q=Xm(function(){return ek(i,o+"return "+m).apply(ca,j)});if(q.source=m,$h(q))throw q;return q}function rj(a){
return Ai(a).toLowerCase()}function sj(a){return Ai(a).toUpperCase()}function tj(a,b,c){
if((a=Ai(a))&&(c||b===ca))return a.replace(Ib,"");if(!a||!(b=me(b)))return a;var d=$(a),e=$(b)
;return xe(d,K(d,e),L(d,e)+1).join("")}function uj(a,b,c){if((a=Ai(a))&&(c||b===ca))return a.replace(Kb,"")
;if(!a||!(b=me(b)))return a;var d=$(a);return xe(d,0,L(d,$(b))+1).join("")}function vj(a,b,c){
if((a=Ai(a))&&(c||b===ca))return a.replace(Jb,"");if(!a||!(b=me(b)))return a;var d=$(a);return xe(d,K(d,$(b))).join("")}
function wj(a,b){var c=za,d=Aa;if(di(b)){var e="separator"in b?b.separator:e;c="length"in b?vi(b.length):c,
d="omission"in b?me(b.omission):d}a=Ai(a);var f=a.length;if(P(a)){var g=$(a);f=g.length}if(c>=f)return a;var h=c-Z(d)
;if(h<1)return d;var i=g?xe(g,0,h).join(""):a.slice(0,h);if(e===ca)return i+d;if(g&&(h+=i.length-h),um(e)){
if(a.slice(h).search(e)){var j,k=i;for(e.global||(e=hk(e.source,Ai(Rb.exec(e))+"g")),
e.lastIndex=0;j=e.exec(k);)var l=j.index;i=i.slice(0,l===ca?h:l)}}else if(a.indexOf(me(e),h)!=h){var m=i.lastIndexOf(e)
;m>-1&&(i=i.slice(0,m))}return i+d}function xj(a){return a=Ai(a),a&&yb.test(a)?a.replace(wb,sd):a}function yj(a,b,c){
return a=Ai(a),b=c?ca:b,b===ca?Q(a)?ba(a):t(a):a.match(b)||[]}function zj(a){var b=null==a?0:a.length,c=tf()
;return a=b?n(a,function(a){if("function"!=typeof a[1])throw new jk(ga);return[c(a[0]),a[1]]}):[],be(function(c){
for(var d=-1;++d<b;){var e=a[d];if(f(e[0],this,c))return f(e[1],this,c)}})}function Aj(a){return Lc(Kc(a,ka))}
function Bj(a){return function(){return a}}function Cj(a,b){return null==a||a!==a?b:a}function Dj(a){return a}
function Ej(a){return Kd("function"==typeof a?a:Kc(a,ka))}function Fj(a){return Pd(Kc(a,ka))}function Gj(a,b){
return Qd(a,Kc(b,ka))}function Hj(a,b,c){var d=Ni(b),e=cd(b,d);null!=c||di(b)&&(e.length||!d.length)||(c=b,b=a,a=this,
e=cd(b,Ni(b)));var f=!(di(c)&&"chain"in c&&!c.chain),g=ai(a);return h(e,function(c){var d=b[c];a[c]=d,
g&&(a.prototype[c]=function(){var b=this.__chain__;if(f||b){var c=a(this.__wrapped__)
;return(c.__actions__=Ie(this.__actions__)).push({func:d,args:arguments,thisArg:a}),c.__chain__=b,c}
return d.apply(a,o([this.value()],arguments))})}),a}function Ij(){return dd._===this&&(dd._=uk),this}function Jj(){}
function Kj(a){return a=vi(a),be(function(b){return Td(b,a)})}function Lj(a){return If(a)?A($f(a)):Xd(a)}function Mj(a){
return function(b){return null==a?ca:ed(a,b)}}function Nj(){return[]}function Oj(){return!1}function Pj(){return{}}
function Qj(){return""}function Rj(){return!0}function Sj(a,b){if((a=vi(a))<1||a>Ha)return[];var c=Ka,d=Tk(a,Ka)
;b=tf(b),a-=Ka;for(var e=F(d,b);++c<a;)b(c);return e}function Tj(a){return pm(a)?n(a,$f):pi(a)?[a]:Ie(El(Ai(a)))}
function Uj(a){var b=++qk;return Ai(a)+b}function Vj(a){return a&&a.length?Sc(a,Dj,id):ca}function Wj(a,b){
return a&&a.length?Sc(a,tf(b,2),id):ca}function Xj(a){return z(a,Dj)}function Yj(a,b){return z(a,tf(b,2))}
function Zj(a){return a&&a.length?Sc(a,Dj,Nd):ca}function $j(a,b){return a&&a.length?Sc(a,tf(b,2),Nd):ca}function _j(a){
return a&&a.length?E(a,Dj):0}function ak(a,b){return a&&a.length?E(a,tf(b,2)):0}
b=null==b?dd:ud.defaults(dd.Object(),b,ud.pick(dd,Tc))
;var bk=b.Array,ck=b.Date,dk=b.Error,ek=b.Function,fk=b.Math,gk=b.Object,hk=b.RegExp,ik=b.String,jk=b.TypeError,kk=bk.prototype,lk=ek.prototype,mk=gk.prototype,nk=b["__core-js_shared__"],ok=lk.toString,pk=mk.hasOwnProperty,qk=0,rk=function(){
var a=/[^.]+$/.exec(nk&&nk.keys&&nk.keys.IE_PROTO||"");return a?"Symbol(src)_1."+a:""
}(),sk=mk.toString,tk=ok.call(gk),uk=dd._,vk=hk("^"+ok.call(pk).replace(Gb,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),wk=gd?b.Buffer:ca,xk=b.Symbol,yk=b.Uint8Array,zk=wk?wk.allocUnsafe:ca,Ak=T(gk.getPrototypeOf,gk),Bk=gk.create,Ck=mk.propertyIsEnumerable,Dk=kk.splice,Ek=xk?xk.isConcatSpreadable:ca,Fk=xk?xk.iterator:ca,Gk=xk?xk.toStringTag:ca,Hk=function(){
try{var a=wf(gk,"defineProperty");return a({},"",{}),a}catch(a){}
}(),Ik=b.clearTimeout!==dd.clearTimeout&&b.clearTimeout,Jk=ck&&ck.now!==dd.Date.now&&ck.now,Kk=b.setTimeout!==dd.setTimeout&&b.setTimeout,Lk=fk.ceil,Mk=fk.floor,Nk=gk.getOwnPropertySymbols,Ok=wk?wk.isBuffer:ca,Pk=b.isFinite,Qk=kk.join,Rk=T(gk.keys,gk),Sk=fk.max,Tk=fk.min,Uk=ck.now,Vk=b.parseInt,Wk=fk.random,Xk=kk.reverse,Yk=wf(b,"DataView"),Zk=wf(b,"Map"),$k=wf(b,"Promise"),_k=wf(b,"Set"),al=wf(b,"WeakMap"),bl=wf(gk,"create"),cl=al&&new al,dl={},el=_f(Yk),fl=_f(Zk),gl=_f($k),hl=_f(_k),il=_f(al),jl=xk?xk.prototype:ca,kl=jl?jl.valueOf:ca,ll=jl?jl.toString:ca,ml=function(){
function a(){}return function(b){if(!di(b))return{};if(Bk)return Bk(b);a.prototype=b;var c=new a;return a.prototype=ca,c
}}();c.templateSettings={escape:Ab,evaluate:Bb,interpolate:Cb,variable:"",imports:{_:c}},c.prototype=d.prototype,
c.prototype.constructor=c,e.prototype=ml(d.prototype),e.prototype.constructor=e,s.prototype=ml(d.prototype),
s.prototype.constructor=s,aa.prototype.clear=Ob,aa.prototype.delete=$b,aa.prototype.get=_b,aa.prototype.has=ac,
aa.prototype.set=bc,cc.prototype.clear=dc,cc.prototype.delete=ec,cc.prototype.get=fc,cc.prototype.has=gc,
cc.prototype.set=hc,ic.prototype.clear=jc,ic.prototype.delete=kc,ic.prototype.get=lc,ic.prototype.has=mc,
ic.prototype.set=nc,oc.prototype.add=oc.prototype.push=pc,oc.prototype.has=qc,rc.prototype.clear=sc,
rc.prototype.delete=tc,rc.prototype.get=uc,rc.prototype.has=vc,rc.prototype.set=wc
;var nl=Oe($c),ol=Oe(bd,!0),pl=Pe(),ql=Pe(!0),rl=cl?function(a,b){return cl.set(a,b),a}:Dj,sl=Hk?function(a,b){
return Hk(a,"toString",{configurable:!0,enumerable:!1,value:Bj(b),writable:!0})}:Dj,tl=be,ul=Ik||function(a){
return dd.clearTimeout(a)},vl=_k&&1/V(new _k([,-0]))[1]==Ga?function(a){return new _k(a)}:Jj,wl=cl?function(a){
return cl.get(a)}:Jj,xl=Nk?function(a){return null==a?[]:(a=gk(a),k(Nk(a),function(b){return Ck.call(a,b)}))
}:Nj,yl=Nk?function(a){for(var b=[];a;)o(b,xl(a)),a=Ak(a);return b}:Nj,zl=hd
;(Yk&&zl(new Yk(new ArrayBuffer(1)))!=jb||Zk&&zl(new Zk)!=Xa||$k&&zl($k.resolve())!=_a||_k&&zl(new _k)!=cb||al&&zl(new al)!=gb)&&(zl=function(a){
var b=hd(a),c=b==$a?a.constructor:ca,d=c?_f(c):"";if(d)switch(d){case el:return jb;case fl:return Xa;case gl:return _a
;case hl:return cb;case il:return gb}return b});var Al=nk?ai:Oj,Bl=Yf(rl),Cl=Kk||function(a,b){return dd.setTimeout(a,b)
},Dl=Yf(sl),El=Pf(function(a){var b=[];return 46===a.charCodeAt(0)&&b.push(""),a.replace(Fb,function(a,c,d,e){
b.push(d?e.replace(Pb,"$1"):c||a)}),b}),Fl=be(function(a,b){return Uh(a)?Qc(a,Zc(b,1,Uh,!0)):[]}),Gl=be(function(a,b){
var c=ug(b);return Uh(c)&&(c=ca),Uh(a)?Qc(a,Zc(b,1,Uh,!0),tf(c,2)):[]}),Hl=be(function(a,b){var c=ug(b)
;return Uh(c)&&(c=ca),Uh(a)?Qc(a,Zc(b,1,Uh,!0),ca,c):[]}),Il=be(function(a){var b=n(a,ue)
;return b.length&&b[0]===a[0]?wd(b):[]}),Jl=be(function(a){var b=ug(a),c=n(a,ue);return b===ug(c)?b=ca:c.pop(),
c.length&&c[0]===a[0]?wd(c,tf(b,2)):[]}),Kl=be(function(a){var b=ug(a),c=n(a,ue);return b="function"==typeof b?b:ca,
b&&c.pop(),c.length&&c[0]===a[0]?wd(c,ca,b):[]}),Ll=be(xg),Ml=of(function(a,b){var c=null==a?0:a.length,d=Ic(a,b)
;return Zd(a,n(b,function(a){return Gf(a,c)?+a:a}).sort(Ee)),d}),Nl=be(function(a){return ne(Zc(a,1,Uh,!0))
}),Ol=be(function(a){var b=ug(a);return Uh(b)&&(b=ca),ne(Zc(a,1,Uh,!0),tf(b,2))}),Pl=be(function(a){var b=ug(a)
;return b="function"==typeof b?b:ca,ne(Zc(a,1,Uh,!0),ca,b)}),Ql=be(function(a,b){return Uh(a)?Qc(a,b):[]
}),Rl=be(function(a){return se(k(a,Uh))}),Sl=be(function(a){var b=ug(a);return Uh(b)&&(b=ca),se(k(a,Uh),tf(b,2))
}),Tl=be(function(a){var b=ug(a);return b="function"==typeof b?b:ca,se(k(a,Uh),ca,b)}),Ul=be(Tg),Vl=be(function(a){
var b=a.length,c=b>1?a[b-1]:ca;return c="function"==typeof c?(a.pop(),c):ca,Ug(a,c)}),Wl=of(function(a){
var b=a.length,c=b?a[0]:0,d=this.__wrapped__,f=function(b){return Ic(b,a)}
;return!(b>1||this.__actions__.length)&&d instanceof s&&Gf(c)?(d=d.slice(c,+c+(b?1:0)),d.__actions__.push({func:Zg,
args:[f],thisArg:ca}),new e(d,this.__chain__).thru(function(a){return b&&!a.length&&a.push(ca),a})):this.thru(f)
}),Xl=Me(function(a,b,c){pk.call(a,c)?++a[c]:Hc(a,c,1)}),Yl=Ve(kg),Zl=Ve(lg),$l=Me(function(a,b,c){
pk.call(a,c)?a[c].push(b):Hc(a,c,[b])}),_l=be(function(a,b,c){var d=-1,e="function"==typeof b,g=Th(a)?bk(a.length):[]
;return nl(a,function(a){g[++d]=e?f(b,a,c):yd(a,b,c)}),g}),am=Me(function(a,b,c){Hc(a,c,b)}),bm=Me(function(a,b,c){
a[c?0:1].push(b)},function(){return[[],[]]}),cm=be(function(a,b){if(null==a)return[];var c=b.length
;return c>1&&Hf(a,b[0],b[1])?b=[]:c>2&&Hf(b[0],b[1],b[2])&&(b=[b[0]]),Ud(a,Zc(b,1),[])}),dm=Jk||function(){
return dd.Date.now()},em=be(function(a,b,c){var d=pa;if(c.length){var e=U(c,sf(em));d|=ua}return gf(a,d,b,c,e)
}),fm=be(function(a,b,c){var d=pa|qa;if(c.length){var e=U(c,sf(fm));d|=ua}return gf(b,d,a,c,e)}),gm=be(function(a,b){
return Pc(a,1,b)}),hm=be(function(a,b,c){return Pc(a,xi(b)||0,c)});Eh.Cache=ic;var im=tl(function(a,b){
b=1==b.length&&pm(b[0])?n(b[0],H(tf())):n(Zc(b,1),H(tf()));var c=b.length;return be(function(d){
for(var e=-1,g=Tk(d.length,c);++e<g;)d[e]=b[e].call(this,d[e]);return f(a,this,d)})}),jm=be(function(a,b){
var c=U(b,sf(jm));return gf(a,ua,ca,b,c)}),km=be(function(a,b){var c=U(b,sf(km));return gf(a,va,ca,b,c)
}),lm=of(function(a,b){return gf(a,xa,ca,ca,ca,b)}),mm=cf(id),nm=cf(function(a,b){return a>=b}),om=zd(function(){
return arguments}())?zd:function(a){return ei(a)&&pk.call(a,"callee")&&!Ck.call(a,"callee")
},pm=bk.isArray,qm=jd?H(jd):Ad,rm=Ok||Oj,sm=kd?H(kd):Bd,tm=ld?H(ld):Ed,um=md?H(md):Hd,vm=nd?H(nd):Id,wm=od?H(od):Jd,xm=cf(Nd),ym=cf(function(a,b){
return a<=b}),zm=Ne(function(a,b){if(Mf(b)||Th(b))return void Je(b,Ni(b),a);for(var c in b)pk.call(b,c)&&Cc(a,c,b[c])
}),Am=Ne(function(a,b){Je(b,Oi(b),a)}),Bm=Ne(function(a,b,c,d){Je(b,Oi(b),a,d)}),Cm=Ne(function(a,b,c,d){Je(b,Ni(b),a,d)
}),Dm=of(Ic),Em=be(function(a,b){a=gk(a);var c=-1,d=b.length,e=d>2?b[2]:ca
;for(e&&Hf(b[0],b[1],e)&&(d=1);++c<d;)for(var f=b[c],g=Oi(f),h=-1,i=g.length;++h<i;){var j=g[h],k=a[j]
;(k===ca||Sh(k,mk[j])&&!pk.call(a,j))&&(a[j]=f[j])}return a}),Fm=be(function(a){return a.push(ca,jf),f(Km,ca,a)
}),Gm=Ye(function(a,b,c){null!=b&&"function"!=typeof b.toString&&(b=sk.call(b)),a[b]=c},Bj(Dj)),Hm=Ye(function(a,b,c){
null!=b&&"function"!=typeof b.toString&&(b=sk.call(b)),pk.call(a,b)?a[b].push(c):a[b]=[c]
},tf),Im=be(yd),Jm=Ne(function(a,b,c){Rd(a,b,c)}),Km=Ne(function(a,b,c,d){Rd(a,b,c,d)}),Lm=of(function(a,b){var c={}
;if(null==a)return c;var d=!1;b=n(b,function(b){return b=we(b,a),d||(d=b.length>1),b}),Je(a,qf(a),c),
d&&(c=Kc(c,ka|la|ma,kf));for(var e=b.length;e--;)oe(c,b[e]);return c}),Mm=of(function(a,b){return null==a?{}:Vd(a,b)
}),Nm=ff(Ni),Om=ff(Oi),Pm=Se(function(a,b,c){return b=b.toLowerCase(),a+(c?dj(b):b)}),Qm=Se(function(a,b,c){
return a+(c?"-":"")+b.toLowerCase()}),Rm=Se(function(a,b,c){return a+(c?" ":"")+b.toLowerCase()
}),Sm=Re("toLowerCase"),Tm=Se(function(a,b,c){return a+(c?"_":"")+b.toLowerCase()}),Um=Se(function(a,b,c){
return a+(c?" ":"")+Wm(b)}),Vm=Se(function(a,b,c){return a+(c?" ":"")+b.toUpperCase()
}),Wm=Re("toUpperCase"),Xm=be(function(a,b){try{return f(a,ca,b)}catch(a){return $h(a)?a:new dk(a)}
}),Ym=of(function(a,b){return h(b,function(b){b=$f(b),Hc(a,b,em(a[b],a))}),a}),Zm=We(),$m=We(!0),_m=be(function(a,b){
return function(c){return yd(c,a,b)}}),an=be(function(a,b){return function(c){return yd(a,c,b)}
}),bn=$e(n),cn=$e(j),dn=$e(r),en=bf(),fn=bf(!0),gn=Ze(function(a,b){return a+b},0),hn=ef("ceil"),jn=Ze(function(a,b){
return a/b},1),kn=ef("floor"),ln=Ze(function(a,b){return a*b},1),mn=ef("round"),nn=Ze(function(a,b){return a-b},0)
;return c.after=xh,c.ary=yh,c.assign=zm,c.assignIn=Am,c.assignInWith=Bm,c.assignWith=Cm,c.at=Dm,c.before=zh,c.bind=em,
c.bindAll=Ym,c.bindKey=fm,c.castArray=Mh,c.chain=Xg,c.chunk=cg,c.compact=dg,c.concat=eg,c.cond=zj,c.conforms=Aj,
c.constant=Bj,c.countBy=Xl,c.create=Bi,c.curry=Ah,c.curryRight=Bh,c.debounce=Ch,c.defaults=Em,c.defaultsDeep=Fm,
c.defer=gm,c.delay=hm,c.difference=Fl,c.differenceBy=Gl,c.differenceWith=Hl,c.drop=fg,c.dropRight=gg,
c.dropRightWhile=hg,c.dropWhile=ig,c.fill=jg,c.filter=gh,c.flatMap=hh,c.flatMapDeep=ih,c.flatMapDepth=jh,c.flatten=mg,
c.flattenDeep=ng,c.flattenDepth=og,c.flip=Dh,c.flow=Zm,c.flowRight=$m,c.fromPairs=pg,c.functions=Ii,c.functionsIn=Ji,
c.groupBy=$l,c.initial=sg,c.intersection=Il,c.intersectionBy=Jl,c.intersectionWith=Kl,c.invert=Gm,c.invertBy=Hm,
c.invokeMap=_l,c.iteratee=Ej,c.keyBy=am,c.keys=Ni,c.keysIn=Oi,c.map=nh,c.mapKeys=Pi,c.mapValues=Qi,c.matches=Fj,
c.matchesProperty=Gj,c.memoize=Eh,c.merge=Jm,c.mergeWith=Km,c.method=_m,c.methodOf=an,c.mixin=Hj,c.negate=Fh,
c.nthArg=Kj,c.omit=Lm,c.omitBy=Ri,c.once=Gh,c.orderBy=oh,c.over=bn,c.overArgs=im,c.overEvery=cn,c.overSome=dn,
c.partial=jm,c.partialRight=km,c.partition=bm,c.pick=Mm,c.pickBy=Si,c.property=Lj,c.propertyOf=Mj,c.pull=Ll,
c.pullAll=xg,c.pullAllBy=yg,c.pullAllWith=zg,c.pullAt=Ml,c.range=en,c.rangeRight=fn,c.rearg=lm,c.reject=rh,c.remove=Ag,
c.rest=Hh,c.reverse=Bg,c.sampleSize=th,c.set=Ui,c.setWith=Vi,c.shuffle=uh,c.slice=Cg,c.sortBy=cm,c.sortedUniq=Jg,
c.sortedUniqBy=Kg,c.split=oj,c.spread=Ih,c.tail=Lg,c.take=Mg,c.takeRight=Ng,c.takeRightWhile=Og,c.takeWhile=Pg,c.tap=Yg,
c.throttle=Jh,c.thru=Zg,c.toArray=ti,c.toPairs=Nm,c.toPairsIn=Om,c.toPath=Tj,c.toPlainObject=yi,c.transform=Wi,
c.unary=Kh,c.union=Nl,c.unionBy=Ol,c.unionWith=Pl,c.uniq=Qg,c.uniqBy=Rg,c.uniqWith=Sg,c.unset=Xi,c.unzip=Tg,
c.unzipWith=Ug,c.update=Yi,c.updateWith=Zi,c.values=$i,c.valuesIn=_i,c.without=Ql,c.words=yj,c.wrap=Lh,c.xor=Rl,
c.xorBy=Sl,c.xorWith=Tl,c.zip=Ul,c.zipObject=Vg,c.zipObjectDeep=Wg,c.zipWith=Vl,c.entries=Nm,c.entriesIn=Om,c.extend=Am,
c.extendWith=Bm,Hj(c,c),c.add=gn,c.attempt=Xm,c.camelCase=Pm,c.capitalize=dj,c.ceil=hn,c.clamp=aj,c.clone=Nh,
c.cloneDeep=Ph,c.cloneDeepWith=Qh,c.cloneWith=Oh,c.conformsTo=Rh,c.deburr=ej,c.defaultTo=Cj,c.divide=jn,c.endsWith=fj,
c.eq=Sh,c.escape=gj,c.escapeRegExp=hj,c.every=fh,c.find=Yl,c.findIndex=kg,c.findKey=Ci,c.findLast=Zl,c.findLastIndex=lg,
c.findLastKey=Di,c.floor=kn,c.forEach=kh,c.forEachRight=lh,c.forIn=Ei,c.forInRight=Fi,c.forOwn=Gi,c.forOwnRight=Hi,
c.get=Ki,c.gt=mm,c.gte=nm,c.has=Li,c.hasIn=Mi,c.head=qg,c.identity=Dj,c.includes=mh,c.indexOf=rg,c.inRange=bj,
c.invoke=Im,c.isArguments=om,c.isArray=pm,c.isArrayBuffer=qm,c.isArrayLike=Th,c.isArrayLikeObject=Uh,c.isBoolean=Vh,
c.isBuffer=rm,c.isDate=sm,c.isElement=Wh,c.isEmpty=Xh,c.isEqual=Yh,c.isEqualWith=Zh,c.isError=$h,c.isFinite=_h,
c.isFunction=ai,c.isInteger=bi,c.isLength=ci,c.isMap=tm,c.isMatch=fi,c.isMatchWith=gi,c.isNaN=hi,c.isNative=ii,
c.isNil=ki,c.isNull=ji,c.isNumber=li,c.isObject=di,c.isObjectLike=ei,c.isPlainObject=mi,c.isRegExp=um,
c.isSafeInteger=ni,c.isSet=vm,c.isString=oi,c.isSymbol=pi,c.isTypedArray=wm,c.isUndefined=qi,c.isWeakMap=ri,
c.isWeakSet=si,c.join=tg,c.kebabCase=Qm,c.last=ug,c.lastIndexOf=vg,c.lowerCase=Rm,c.lowerFirst=Sm,c.lt=xm,c.lte=ym,
c.max=Vj,c.maxBy=Wj,c.mean=Xj,c.meanBy=Yj,c.min=Zj,c.minBy=$j,c.stubArray=Nj,c.stubFalse=Oj,c.stubObject=Pj,
c.stubString=Qj,c.stubTrue=Rj,c.multiply=ln,c.nth=wg,c.noConflict=Ij,c.noop=Jj,c.now=dm,c.pad=ij,c.padEnd=jj,
c.padStart=kj,c.parseInt=lj,c.random=cj,c.reduce=ph,c.reduceRight=qh,c.repeat=mj,c.replace=nj,c.result=Ti,c.round=mn,
c.runInContext=a,c.sample=sh,c.size=vh,c.snakeCase=Tm,c.some=wh,c.sortedIndex=Dg,c.sortedIndexBy=Eg,c.sortedIndexOf=Fg,
c.sortedLastIndex=Gg,c.sortedLastIndexBy=Hg,c.sortedLastIndexOf=Ig,c.startCase=Um,c.startsWith=pj,c.subtract=nn,
c.sum=_j,c.sumBy=ak,c.template=qj,c.times=Sj,c.toFinite=ui,c.toInteger=vi,c.toLength=wi,c.toLower=rj,c.toNumber=xi,
c.toSafeInteger=zi,c.toString=Ai,c.toUpper=sj,c.trim=tj,c.trimEnd=uj,c.trimStart=vj,c.truncate=wj,c.unescape=xj,
c.uniqueId=Uj,c.upperCase=Vm,c.upperFirst=Wm,c.each=kh,c.eachRight=lh,c.first=qg,Hj(c,function(){var a={}
;return $c(c,function(b,d){pk.call(c.prototype,d)||(a[d]=b)}),a}(),{chain:!1}),c.VERSION=da,
h(["bind","bindKey","curry","curryRight","partial","partialRight"],function(a){c[a].placeholder=c}),
h(["drop","take"],function(a,b){s.prototype[a]=function(c){c=c===ca?1:Sk(vi(c),0)
;var d=this.__filtered__&&!b?new s(this):this.clone()
;return d.__filtered__?d.__takeCount__=Tk(c,d.__takeCount__):d.__views__.push({size:Tk(c,Ka),
type:a+(d.__dir__<0?"Right":"")}),d},s.prototype[a+"Right"]=function(b){return this.reverse()[a](b).reverse()}}),
h(["filter","map","takeWhile"],function(a,b){var c=b+1,d=c==Da||c==Fa;s.prototype[a]=function(a){var b=this.clone()
;return b.__iteratees__.push({iteratee:tf(a,3),type:c}),b.__filtered__=b.__filtered__||d,b}}),
h(["head","last"],function(a,b){var c="take"+(b?"Right":"");s.prototype[a]=function(){return this[c](1).value()[0]}}),
h(["initial","tail"],function(a,b){var c="drop"+(b?"":"Right");s.prototype[a]=function(){
return this.__filtered__?new s(this):this[c](1)}}),s.prototype.compact=function(){return this.filter(Dj)},
s.prototype.find=function(a){return this.filter(a).head()},s.prototype.findLast=function(a){
return this.reverse().find(a)},s.prototype.invokeMap=be(function(a,b){
return"function"==typeof a?new s(this):this.map(function(c){return yd(c,a,b)})}),s.prototype.reject=function(a){
return this.filter(Fh(tf(a)))},s.prototype.slice=function(a,b){a=vi(a);var c=this
;return c.__filtered__&&(a>0||b<0)?new s(c):(a<0?c=c.takeRight(-a):a&&(c=c.drop(a)),b!==ca&&(b=vi(b),
c=b<0?c.dropRight(-b):c.take(b-a)),c)},s.prototype.takeRightWhile=function(a){
return this.reverse().takeWhile(a).reverse()},s.prototype.toArray=function(){return this.take(Ka)},
$c(s.prototype,function(a,b){
var d=/^(?:filter|find|map|reject)|While$/.test(b),f=/^(?:head|last)$/.test(b),g=c[f?"take"+("last"==b?"Right":""):b],h=f||/^find/.test(b)
;g&&(c.prototype[b]=function(){
var b=this.__wrapped__,i=f?[1]:arguments,j=b instanceof s,k=i[0],l=j||pm(b),m=function(a){var b=g.apply(c,o([a],i))
;return f&&n?b[0]:b};l&&d&&"function"==typeof k&&1!=k.length&&(j=l=!1)
;var n=this.__chain__,p=!!this.__actions__.length,q=h&&!n,r=j&&!p;if(!h&&l){b=r?b:new s(this);var t=a.apply(b,i)
;return t.__actions__.push({func:Zg,args:[m],thisArg:ca}),new e(t,n)}return q&&r?a.apply(this,i):(t=this.thru(m),
q?f?t.value()[0]:t.value():t)})}),h(["pop","push","shift","sort","splice","unshift"],function(a){
var b=kk[a],d=/^(?:push|sort|unshift)$/.test(a)?"tap":"thru",e=/^(?:pop|shift)$/.test(a);c.prototype[a]=function(){
var a=arguments;if(e&&!this.__chain__){var c=this.value();return b.apply(pm(c)?c:[],a)}return this[d](function(c){
return b.apply(pm(c)?c:[],a)})}}),$c(s.prototype,function(a,b){var d=c[b];if(d){var e=d.name+""
;(dl[e]||(dl[e]=[])).push({name:b,func:d})}}),dl[Xe(ca,qa).name]=[{name:"wrapper",func:ca}],s.prototype.clone=B,
s.prototype.reverse=X,s.prototype.value=_,c.prototype.at=Wl,c.prototype.chain=$g,c.prototype.commit=_g,
c.prototype.next=ah,
c.prototype.plant=ch,c.prototype.reverse=dh,c.prototype.toJSON=c.prototype.valueOf=c.prototype.value=eh,
c.prototype.first=c.prototype.head,Fk&&(c.prototype[Fk]=bh),c},ud=td();dd._=ud,(e=function(){return ud
}.call(b,c,b,d))!==ca&&(d.exports=e)}).call(this)}).call(b,c(127),c(128)(a))},function(a,b){var c;c=function(){
return this}();try{c=c||Function("return this")()||(0,eval)("this")}catch(a){"object"==typeof window&&(c=window)}
a.exports=c},function(a,b){a.exports=function(a){return a.webpackPolyfill||(a.deprecate=function(){},a.paths=[],
a.children||(a.children=[]),Object.defineProperty(a,"loaded",{enumerable:!0,get:function(){return a.l}}),
Object.defineProperty(a,"id",{enumerable:!0,get:function(){return a.i}}),a.webpackPolyfill=1),a}},function(a,b){
a.exports=__virtru_deps.q},function(a,b,c){"use strict";a.exports.cancelableEmit=function(a){
this._callbacks=this._callbacks||{};var b=[].slice.call(arguments,1),c=this._callbacks[a];if(c){c=c.slice(0)
;for(var d=0,e=c.length;d<e;++d){var f=c[d].apply(this,b);if(!(f=void 0===f||f))return!1}}return!0}}]);