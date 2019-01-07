"use strict";infinity.setIconImageBgColorSrc=function(n,i,t,e){if("transparent"!=n){var o=document.getElementById("iconCanvas"),a=o.getContext("2d"),c=infinity.iconSize,s=c;i&&(s=.56*c);var r=(c-s)/2;a.clearRect(0,0,c,c),o.width=c,o.height=c;var f=new Image;f.src=t,f.onload=function(){a.fillStyle=n,a.fillRect(0,0,c,c),a.drawImage(f,r,r,s,s);var i=o.toDataURL("image/png");e&&e(i)}}else e&&e(t)};var bgIcon={lockAddIcon:!1,init:function(){var n=this;n.deleteIcon(),n.setLayout(),n.updateIcon(),infinity.onMessage("setIconFlat",function(){n.setIconsFlat()}),infinity.onMessage("rateIcon",function(i){n.rateIcon(i.uid)}),infinity.onMessage("addIcon",function(i,t,e){var o=parseInt(getAddPosition()),a=i.icon;a.url=infinity.isUrl(a.url).str,a.name=infinity.i18n(a.name);i.tabId;var c=infinity.get("infinity-icons");if("color"==a.imageType){var s=infinity.id("800");a.src=null,a.uid=s,n.addIconOrPage(c,a,o),infinity.set("infinity-icons",c),n.setIconsFlat(),infinity.doSyncIcon(),infinity.sendMessage("addFromWebPage"),e({})}}),infinity.onMessage("shareIcon",function(i){var t=i.name,e=i.url,o=i.src;n.shareIcon(t,e,o)})},addIconOrPage:function(n,i,t){return n[t]?n[t].push(i):(n.push([]),n[t].push(i)),n},rateIcon:function(n){try{var i=infinity.getUserInfo(),t=i.uid,e=i.secret;$.ajax({url:infinity.url+"user/add-icon-rate?uid="+t+"&secret="+e+"&iconUid="+n+"&t="+(new Date).getTime(),type:"GET",dataType:"json"}).done(function(){}).fail(function(){}).always(function(){})}catch(n){void 0}},deleteIcon:function(){var n=this;infinity.onBroadcast("deleteDone",function(i){n.setIconsFlat(),infinity.doSyncIcon()})},setLayout:function(){infinity.onMessage("setLayout",function(n,i,t){infinity.setLayout(n),infinity.doSyncIcon(),infinity.doSyncData()})},updateIcon:function(){var n=this;infinity.onMessage("updateIcon",function(i,t,e){var o=i.icon,a=i.page,c=i.iconIndex,s=infinity.get("infinity-icons"),r=s[a][c];r.imageType=o.imageType,r.name=o.name,r.url=infinity.isUrl(o.url).str,r.uid=o.uid,/^800/.test(r.uid)||(r.uid=infinity.id("800"));var f=o.isShare;if("image"==o.imageType)if("data:image/"==o.src.substr(0,11)){var u=o.iconImageBgColor;infinity.setIconImageBgColorSrc(u,!1,o.src,function(t){infinity.uploadBase64Img({src:t,scope:"custom-icon/"},function(t,o){t?e({error:t}):(r.src=o,r.showText=null,r.bgColor=null,infinity.set("infinity-icons",s),n.setIconsFlat(),n.updateDone(i.tabId,r.name,a,c),infinity.doSyncIcon(),f&&n.shareIcon(r.name,r.url,r.src),e({error:null}))})})}else r.src=o.src,r.showText=null,r.bgColor=null,infinity.set("infinity-icons",s),n.setIconsFlat(),n.updateDone(i.tabId,r.name,a,c),infinity.doSyncIcon(),e({error:null});else r.bgColor=o.bgColor,r.showText=o.showText,r.fontSize=o.fontSize,r.src=null,infinity.set("infinity-icons",s),n.setIconsFlat(),n.updateDone(i.tabId,r.name,a,c),infinity.doSyncIcon(),e({error:null});return!0})},updateDone:function(n,i,t,e){infinity.sendMessage("editDone",{tabId:n,name:i,page:t,iconIndex:e}),infinity.doSyncIcon()},setIconsFlat:function(){var n=infinity.get("infinity-icons"),i=_.flatten(n,!0);infinity.set("infinity-iconsFlat",i),infinity.sendMessage("reloadIconLibrary")},shareIcon:function(n,i,t){try{var e=infinity.getUserInfo(),o=e.uid,a=e.secret;$.ajax({url:infinity.url+"user/save-user-share-icon?uid="+o+"&secret="+a,type:"POST",dataType:"json",data:{name:n,site:i,img:t,lang:infinity.lang}}).done(function(){}).fail(function(){}).always(function(){})}catch(n){}}};