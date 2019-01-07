
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
!function(e){var s={};function t(r){if(s[r])return s[r].exports;var a=s[r]={i:r,l:!1,exports:{}};return e[r].call(a.exports,a,a.exports,t),a.l=!0,a.exports}t.m=e,t.c=s,t.d=function(e,s,r){t.o(e,s)||Object.defineProperty(e,s,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var s=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(s,"a",s),s},t.o=function(e,s){return Object.prototype.hasOwnProperty.call(e,s)},t.p="./",t(t.s=862)}({189:function(e,s,t){"use strict";Object.defineProperty(s,"__esModule",{value:!0});var r=Object.assign||function(e){for(var s=1;s<arguments.length;s++){var t=arguments[s];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])}return e};const a="__error__",n="EN_request",i="EN_response";s.default=class{constructor(e,s){this._channelName=e||"",this._requestHandlers=s,this._uniqueMessageID=0,this._pendingMessages={},this._handleMessage=this._handleMessage.bind(this)}start(){window.addEventListener("message",this._handleMessage)}stop(){window.removeEventListener("message",this._handleMessage)}sendMessageToFrame(e,s,t){return this.sendMessage(e.contentWindow,s,t)}sendMessageToParent(e,s){return this.sendMessage(window.parent,e,s)}sendMessage(e,s,t){return new Promise((r,a)=>{const i=`${this._channelName}-${++this._uniqueMessageID}`,o={type:n,messageID:i,name:s,data:t};this._pendingMessages[i]={name:s,resolve:r,reject:a},e.postMessage(o,"*")})}_handleMessage(e){if(!e.data)return Promise.resolve();switch(e.data.type){case n:return this._handleRequest(e.data,e.source);case i:return this._handleResponse(e.data);default:return Promise.resolve()}}_handleRequest(e,s){const t=e.name,n=e.messageID,o=this._requestHandlers[t];if(!o)return;const l=o(e.data||{});Promise.resolve(l).catch(e=>({[a]:r({},e,{stack:e.stack,message:e.message})})).then(e=>{const r={type:i,messageID:n,name:t,data:e};s.postMessage(r,"*")})}_handleResponse(e){const s=e.messageID,t=this._pendingMessages[s];if(!t)return;const r=t.resolve,n=t.reject;e.data&&e.data[a]&&n(e.data[a]),r(e.data),delete this._pendingMessages[s]}}},40:function(e,s,t){"use strict";Object.defineProperty(s,"__esModule",{value:!0});s.SERIALIZER_IGNORED_CLASS="en-serializer-ignore",s.MessageNames={FORWARD_FETCH_REQUEST:"EN_forwardFetchRequest",REPORT_PROGRESS:"EN_progress",INSTALL_SERIALIZER:"EN_installFrameSerializer",INSTALL_AND_SERIALIZE_ALL:"EN_installAndSerializeAll",INSTALL_AND_SERIALIZE_TO:"EN_installAndSerializeTo",SERIALIZE:"EN_serialize"},s.ClipTypes={ARTICLE:"article",FULL_PAGE:"fullPage",SIMPLIFIED:"simplified",PDF:"pdf",EMAIL:"email",SELECTION:"selection",BOOKMARK:"bookmark",SCREENSHOT:"screenshot",TOP_SITE:"topsite"}},862:function(e,s,t){"use strict";var r,a=t(189),n=(r=a)&&r.__esModule?r:{default:r},i=t(40);const o=2e3;(new class{constructor(){this._completed=!1,this._timeoutID=null,this._frameChannel=new n.default("BrowserFrameLoader",{[i.MessageNames.INSTALL_SERIALIZER]:e=>this.installAllFrameSerializers(e),[i.MessageNames.INSTALL_AND_SERIALIZE_ALL]:e=>this.installAndSerializeAll(e),[i.MessageNames.INSTALL_AND_SERIALIZE_TO]:e=>this.installAndSerizalizeTo(e)})}start(){this._frameChannel.start()}stop(){this._frameChannel.stop()}installAndSerizalizeTo({frameName:e,resourcePath:s=""}){const t=document.querySelector(`.${e}`);return this._frameChannel.sendMessageToFrame(t,i.MessageNames.INSTALL_SERIALIZER,{resourcePath:s}).catch(e=>{console.warn(e)}).then(()=>this._frameChannel.sendMessageToFrame(t,i.MessageNames.SERIALIZE))}installAndSerializeAll({target:e,resourcePath:s=""}){return this._completed=!1,new Promise(t=>{const r=()=>{this._completed||(this._completed=!0,window.clearTimeout(this._timeoutID),t(this._frameChannel.sendMessage(window,i.MessageNames.SERIALIZE,{target:e})))};this._timeoutID=window.setTimeout(()=>{r()},o),this.installAllFrameSerializers({resourcePath:s,target:e}).then(()=>{r()})})}installAllFrameSerializers({resourcePath:e,target:s}){return Promise.all([this._installScript(this._getBundleUrl(e,"FrameSerializer.js")),this._installChildFrameSerializers({target:s,resourcePath:e})])}_installChildFrameSerializers({target:e,resourcePath:s}){const t=document.querySelector(e)||document;return new Promise(e=>{const r=[].slice.apply(t.querySelectorAll(`iframe:not(.${i.SERIALIZER_IGNORED_CLASS})`));r.length||e();const a=[];r.forEach(e=>{a.push(this._frameChannel.sendMessageToFrame(e,i.MessageNames.INSTALL_SERIALIZER,{resourcePath:s}))}),Promise.all(a).then(e),setTimeout(e,o)})}_getBundleUrl(e,s){if("string"==typeof e)return`${e}${s}`;throw new Error("No resources path specified!")}_installScript(e){return new Promise((s,t)=>{if(document.querySelector(`script[src='${e}']`))return void s();const r=document.createElement("script");r.type="text/javascript",r.src=e,r.onload=(()=>{s()}),r.onerror=(()=>{t(new Error(`Failed to load script: "${e}"`))}),document.head.appendChild(r)})}}).start()}});