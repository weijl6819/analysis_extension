"use strict";var infinity={extId:chrome.runtime.id,domain:"infinity-api.infinitynewtab.com/",url:"https://infinity-api.infinitynewtab.com/",staticUrl:"https://static-api.infinitynewtab.com/",lang:chrome.i18n.getUILanguage(),isMac:navigator.platform.indexOf("Mac")>=0,iconSize:240,modules:{},isDevelopmentEnvironment:!0};infinity.import=function(n,i,t){var e=n.substr(n.lastIndexOf("/")+1),r=document.createElement("link");r.setAttribute("name",e),r.rel="import",r.href=n+"/"+e+".html";var o=document.createElement("link");o.rel="stylesheet",o.href=n+"/"+e+".css",document.head.appendChild(o),document.head.appendChild(r),r.onload=function(){var n=r.import.querySelector("template").content;document.querySelector(i).appendChild(n),document.querySelector('script[name="'+e+'-js"]').onload=function(){t&&t()}}},infinity.id=function(n){function i(n){for(var i="",t="abcdefghijklmnopqrstuvwxyz0123456789",e=0;e<n;e++)i+=t.charAt(Math.floor(Math.random()*t.length));return i}return function(t){var e=new Uint8Array((t||40)/2);return window.crypto.getRandomValues(e),n+(new Date).getTime().toString(32)+i(18)}()},infinity.with=function(n,i,t){var e="string"==typeof arguments[1];if(infinity.modules.hasOwnProperty(n))e?t&&t(infinity.modules[n]):i&&i(infinity.modules[n]);else{var r;r=e?i:"body",infinity.import("/modules/"+n,r,function(){e?(infinity.modules[n]=infinity.modules[n]||!0,t&&t(infinity.modules[n])):(infinity.modules[n]=infinity.modules[n]||!0,i&&i(infinity.modules[n]))})}},infinity.require=function(n,i){var t=n.substr(n.lastIndexOf("/")+1);if(infinity.modules.hasOwnProperty(t))i&&i(infinity.modules[t]);else{var e=document.createElement("script");e.setAttribute("async","true"),e.src=n+".js",document.head.appendChild(e),e.onload=function(){infinity.modules[t]=infinity.modules[t]||!0,i&&i(infinity.modules[t])}}},infinity.init=function(n,i,t,e){try{localStorage[n]||(localStorage[n]=JSON.stringify(i))}catch(n){}},infinity.set=function(n,i,t,e){try{if(t){var r={};r[n]=JSON.stringify(i),chrome.storage.local.set(r,function(){e&&e()})}else localStorage[n]=JSON.stringify(i)}catch(n){void 0}},infinity.get=function(n,i,t){try{if(!i)return JSON.parse(localStorage[n]);chrome.storage.local.get(n,function(i){try{var e=JSON.parse(i[n]);t&&t(e)}catch(n){t&&t(null)}})}catch(n){return null}},infinity.isLogin=function(n){try{return!!infinity.get("infinity-user").isLogin}catch(n){return!1}},infinity.getUserInfo=function(){return infinity.get("infinity-user")},infinity.logout=function(n){infinity.sendMessage("logout")},infinity.i18n=function(n){try{return void 0==n?n:chrome.i18n.getMessage(n)||n}catch(i){return n}},infinity.i18nTranslate=function(){var n=/([^\s]+)\s*\|\s*i18n$/;return function(i){var t=this;if($.isPlainObject(i)){var e={};return Object.keys(i).forEach(function(n){e[n]=t.i18nTranslate(i[n])}),e}if($.isArray(i))return i.map(function(n){return t.i18nTranslate(n)});if("string"==typeof i){var r=i.match(n);if(r)return t.i18n(r[1])}return i}}(),infinity.isZh=function(){return"zh-CN"==chrome.i18n.getUILanguage()},infinity.sendMessage=function(n,i,t){chrome.runtime.sendMessage({name:n,message:i},function(n){t&&t(n)})},infinity.onMessage=function(n,i){chrome.runtime.onMessage.addListener(function(t,e,r){var o,a=t.message;return t.name==n&&(o=i&&i(a,e,r)),!0===o})},infinity.broadcast=function(n,i,t){var e=i||{};chrome.tabs.getCurrent(function(i){e.tabId=i.id,infinity.sendMessage("infinity-broadcast-"+n,e,t)})},infinity.onBroadcast=function(n,i,t){infinity.onMessage("infinity-onBroadcast-"+n,function(n,e,r){"boolean"==typeof i&&i?t&&t(n,e,r):chrome.tabs.getCurrent(function(t){t.id!=n.tabId&&i&&i(n,e,r)})})},infinity.reset=function(){infinity.sendMessage("reset")},infinity.setting=function(n,i){if(void 0===i)return infinity.get("infinity-settings")[n];var t=infinity.get("infinity-settings");return t[n]=i,infinity.set("infinity-settings",t),!0},infinity.settingInitOrReset=function(n,i){try{var t=infinity.get("infinity-settings");t||(t={},infinity.set("infinity-settings",t));for(var e in n)i?infinity.setting(e,n[e]):(t=infinity.get("infinity-settings")).hasOwnProperty(e)||infinity.setting(e,n[e])}catch(n){}},infinity.isUrl=function(n){return 0==n.indexOf("http://")||0==n.indexOf("https://")||0==n.indexOf("ftp://")||0==n.indexOf("chrome://")||0==n.indexOf("chrome-extension://")||0==n.indexOf("file://")||0==n.indexOf("mailto:")||0==n.indexOf("tel:")||0==n.indexOf("chrome-app://")||0==n.indexOf("infinity://")||(n="http://"+n),{isValid:/(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(n),str:n}},infinity.setIconImageBgColorSrc=function(n,i,t,e){if("transparent"!=n){var r=document.getElementById("transIconCanvas"),o=r.getContext("2d"),a=infinity.iconSize,s=a;i&&(s=.56*a);var f=(a-s)/2;o.clearRect(0,0,a,a),r.width=a,r.height=a;var c=new Image;c.src=t,c.onload=function(){o.fillStyle=n,o.fillRect(0,0,a,a),o.drawImage(c,f,f,s,s);var i=r.toDataURL("image/png");e&&e(i)}}else e&&e(t)},infinity.uploadBase64Img=function(){function n(n){for(var i=n.replace(/^data:(image\/.+);base64,/,""),t=atob(i),e=t.length,r=new Array(e);e--;)r[e]=t.charCodeAt(e);return new Blob([new Uint8Array(r)],{type:"image/png"})}return function(i,t){/http[s]?/.test(i.src)?t(null,i.src):infinity.getQiniuUploadToken(function(e,r){if(e)t(e);else{var o=i.scope,a=new FormData;a.append("token",r);var s=o+infinity.id("900")+".png";a.append("key",s),a.append("file",n(i.src));var f=new XMLHttpRequest;f.open("POST","http://upload.qiniu.com",!0),f.onload=function(n){try{var i=n.target,e=JSON.parse(i.response);if(200!==i.status)throw new Error(e.error);var r="https://infinitypro-img.infinitynewtab.com/"+e.key;t(null,r)}catch(n){t(n,null)}},f.onerror=function(n){t(new Error("上传失败"),null)},f.send(a)}})}}(),infinity.getQiniuUploadToken=function(){function n(n,i){for(var t;t=e.pop();)t(n,i)}var i,t,e=[],r=!1;return function(o){var a=new Date;i&&a-t<72e5?o(null,i):(e.push(o),r||(r=!0,$.ajax({url:"https://infinity-api.infinitynewtab.com/createQiniuToken?rt="+(new Date).getTime(),type:"GET",dataType:"json",timeout:5e3}).done(function(e){200==e.status?(t=new Date,n(null,i=e.token)):n(new Error("获取token失败"))}).fail(function(){n(new Error("获取token失败"))}).always(function(){r=!1})))}}(),infinity.chooseImg=function(n){var i=this;$('<input type="file">').attr("accept","image/jpg,image/jpeg,image/png,image/gif,image/bmp,image/webp,image/svg").one("change",function(t){var e=this.files[0],r=new FileReader;r.readAsDataURL(e),r.onload=function(t){var e=t.target.result;i.cropImg(e,n)}}).click()},infinity.cropImg=function(n,i){infinity.with("cropper",function(t){t.onEditImage(n,function(n,t){i(null,{img:n,croppedImg:n,bgColor:t})},!0)})},infinity.parseUri=function(n){for(var i=infinity.parseUri.options,t=i.parser[i.strictMode?"strict":"loose"].exec(n),e={},r=14;r--;)e[i.key[r]]=t[r]||"";return e[i.q.name]={},e[i.key[12]].replace(i.q.parser,function(n,t,r){t&&(e[i.q.name][t]=r)}),e},infinity.parseUri.options={strictMode:!1,key:["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],q:{name:"queryKey",parser:/(?:^|&)([^&=]*)=?([^&]*)/g},parser:{strict:/^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,loose:/^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/}},infinity.getHost=function(n){var i=this.parseUri(n);return i.protocol+"://"+i.host},infinity.requestPermission=function(n){return new Promise(function(i,t){chrome.permissions.request({permissions:n,origins:[]},function(n){n?setTimeout(i,300):t()})})};