"use strict";infinity.USEWEBICON=!1,infinity.USEBASE64ICON=!1;var bg={init:function(){bgSetting.init(),bgHome.init(),bgUser.init(),bgIcon.init(),bgSearch.init(),bgWeather.init(),bgNotes.init(),bgTodos.init(),bgSync.init(),bgWallpaper.init(),bgGmail.init(),bgNotification.init(),bgInfinityPro.init(),bgStatic.init(),bgAlarm.init(),bgReferer.init(),bgGa.init(),this.broadcast(),this.onReset(),this.installed()},broadcast:function(){chrome.runtime.onMessage.addListener(function(t,i,n){var e=t.message,o=t.name;if(0==o.indexOf("infinity-broadcast-")){var a=o.substr(19);infinity.sendMessage("infinity-onBroadcast-"+a,e)}})},onReset:function(){infinity.onMessage("reset",function(){infinity.reset()})},uninstall:function(t){chrome.storage.local.set({"infinity-utm":t},this.setCookie);chrome.runtime.setUninstallURL("https://uninstall.infinitynewtab.com",function(){})},setCookie:function(){chrome.storage.local.get(["infinity-utm"],function(t){var i=t["infinity-utm"];i&&chrome.cookies.set({url:"https://uninstall.infinitynewtab.com/",name:"infinity_utm",value:encodeURIComponent(JSON.stringify(i)),expirationDate:parseInt((Date.now()+31536e6)/1e3,10)})})},installed:function(){var t=this;setInterval(this.setCookie,6e5),chrome.runtime.onInstalled.addListener(function(i){"install"===i.reason&&(chrome.tabs.create({}),t.installFromUnion(function(i){i&&t.installFromExtIrs()}))})},installFromUnion:function(t){var i=this,n={url:"https://infinity-russia.extfans.com",name:"infinity_utm"};chrome.cookies.get(n,function(e){if(e){var o={country:"russia"};try{Object.assign(o,JSON.parse(decodeURIComponent(e.value)))}catch(t){}chrome.cookies.remove(n),$.ajax({url:"https://items.extfans.com/distribute/install",data:o}),i.uninstall(o),t()}else t(!0)})},installFromExtIrs:function(){var t=this,i={url:"http://ext-irs.extfans.com",name:"irsCid"};chrome.cookies.get(i,function(n){var e={country:"russia"};if(n){try{e.from=1,e.code=n.value}catch(t){}chrome.cookies.remove(i)}$.ajax({url:"https://items.extfans.com/distribute/install",data:e}),t.uninstall(e)});var n={url:"http://ext-irs.extfans.com/",name:"ibser"};chrome.cookies.get(n,function(t){if(t){try{var i,e,o,a=t.value.split("&"),s={};for(i=0,e=a.length;i<e;i++)s[(o=a[i].split("="))[0]]=decodeURIComponent(o[1]);s.url&&s.payload&&$.ajax({url:s.url,contentType:"application/json; charset=utf-8",data:s.payload,method:"POST"})}catch(t){}chrome.cookies.remove(n)}})}};bg.init();