function setLocalesText(){document.querySelectorAll(".content-wait").forEach(function(e){e.innerText=chrome.i18n.getMessage(e.dataset.innerText)})}function setHeaderColor(){document.querySelector("header").style.background=constants.headerBackgroundColor}function setLogoIcon(){document.querySelector(".logo-icon").style.display="block",document.querySelector("#source-link").setAttribute("href",constants.sourceLink)}function setHeaderText(){document.querySelector(".header-text").style.display="block",document.querySelector(".header-text .wrapper").innerHTML=constants.headerText}function setPushToggle(){document.querySelector("#push-off-block").style.display="block";var e=document.querySelector("#push-toggle");e.onclick=function(){this.classList.contains("active")?(this.on(),utils.track("PUSH_SET_ON")):(this.off(),utils.track("PUSH_SET_OFF"))},document.querySelector("#push-off-title").onclick=function(){e.classList.contains("active")?e.on():e.off()},e.off=function(){this.classList.add("active"),setSettings({push:!1})},e.on=function(){this.classList.remove("active"),setSettings({push:!0})},e.getDefault=function(){constants.showDesktopNotifications?this.classList.remove("active"):this.classList.add("active"),setSettings({push:constants.showDesktopNotifications})},chrome.storage.local.get("push",function(t){void 0!==t.push?t.push?e.on():e.off():e.getDefault()})}function setPushModeToggle(){document.querySelector("#push-mode-block").style.display="block";var e=document.querySelector("#push-mode");e.onclick=function(){this.classList.contains("active")?(this.onlyImportant(),utils.track("PUSHMODE_SET_IMPORTANT")):(this.allNews(),utils.track("PUSHMODE_SET_ALL"))},e.onlyImportant=function(){this.classList.remove("active"),setSettings({"push-mode":"only-important"})},e.allNews=function(){this.classList.add("active"),setSettings({"push-mode":"all-news"})},e.getDefault=function(){"all-news"==constants.pushModeDefault?this.classList.add("active"):this.classList.remove("active"),setSettings({"push-mode":constants.pushModeDefault},function(){})},document.querySelector("span#all-news").onclick=function(){e.allNews(),utils.track("CLICK_PUSH_ALL_NEWS")},document.querySelector("span#most-important").onclick=function(){e.onlyImportant(),utils.track("CLICK_PUSH_ONLY_IMPORTANT")},chrome.storage.local.get("push-mode",function(t){switch(t["push-mode"]){case"only-important":e.onlyImportant();break;case"all-news":e.allNews();break;default:e.getDefault()}})}function settingPageActive(){document.querySelector(".settings").style.display="block",document.querySelector("#settings-button").onclick=function(){this.classList.contains("active")?(this.classList.remove("active"),hideAllScreen(),showScreen("div.feed")):(this.classList.add("active"),hideAllScreen(),showScreen("#settings-box"),utils.track("ON_SETTING"))}}function hideAllScreen(){for(var e=document.querySelectorAll(".js-screen"),t=0;t<e.length;t++)e[t].style.display="none"}function showScreen(e){document.querySelector(e).style.display="block"}function setSettings(e,t){chrome.storage.local.set(e,t)}function showFeed(){chrome.storage.local.get("feed",function(e){void 0!==e.feed?parseFeed(e.feed):setTimeout(function(){showError(),showFeed(),utils.track("ERR_EMPTY_FEED")},100),document.querySelectorAll(".ChronologyItem").forEach(function(e){e.addEventListener("click",function(){utils.track("ITEM_OPENED")})}),utils.track("POPUP_STARTED")})}function showError(){var e=document.querySelector("#feed-box");e.innerHTML="";var t=document.querySelector("#tpl-error").innerText;t=(t=t.replace("{{text}}",constants.i18n_errorMsg)).replace("{{reload}}",chrome.i18n.getMessage("reloadTitle")),e.innerHTML=t,document.querySelector(".error-block button").addEventListener("click",refreshItems)}function refreshItems(){chrome.runtime.sendMessage(chrome.runtime.id,{action:"refresh"}),document.querySelector(".error-block button").removeEventListener("click",refreshItems)}function checkScroll(){var e=null;chrome.storage.local.get(["lastPopupScrollTop","lastPopupScrollTopTime"],function(t){void 0!==t.lastPopupScrollTop&&(new Date).getTime()-t.lastPopupScrollTopTime<12e4&&(document.body.scrollTop=t.lastPopupScrollTop,e=t.lastPopupScrollTop)}),onscrollAttached||(onscrollAttached=!0,document.onscroll=function(){e&&document.body.scrollTop>0&&Math.abs(document.body.scrollTop-e)>50?(e=document.body.scrollTop,setSettings({lastPopupScrollTop:document.body.scrollTop}),setSettings({lastPopupScrollTopTime:(new Date).getTime()})):e>0&&!document.body.scrollTop&&onscrollFixCounter<2&&(onscrollFixCounter++,document.body.scrollTop=e)})}function parseFeed(e){e=JSON.parse(e);var t=document.querySelector("#tpl").innerText,o=document.querySelector("#tpl-day-separator").innerText,n=document.querySelector("#tpl-photo").innerText,s=document.querySelector("#feed-box"),c=!1;s.innerHTML="";for(var r=0;r<e.length;r++){var l=e[r],i=t;l.is_show_image&&(i=n);var a=new Date(l.date);if(c&&c!=a.getDate()){var u=o;u=u.replace("{{text}}",chrome.i18n.getMessage("month_"+a.getMonth(),[a.getDate(),a.getFullYear()])),s.innerHTML+=u}c=a.getDate(),a=(a.getHours()<10?"0":"")+a.getHours()+":"+(a.getMinutes()<10?"0":"")+a.getMinutes(),i=(i=(i=(i=(i=(i=(i=(i=i.replace(/{{url}}/g,l.url)).replace("{{time}}",a)).replace("{{title}}",l.title)).replace("{{icon}}",l.icon)).replace("{{tagTitle}}",l.notifyTitle)).replace("{{author}}",l.author)).replace("{{second_title}}",l.second_title)).replace("{{fun_type}}",l.post_type),s.innerHTML+=i}processLinks(),checkScroll()}function processLinks(){for(var e=document.querySelectorAll("a"),t=0;t<e.length;t++)e[t].onclick=function(e){setSettings({lastPopupScrollTop:document.body.scrollTop}),setSettings({lastPopupScrollTopTime:(new Date).getTime()}),window.close()}}var constants=window.consts56c4372f,utils=window.utils56c4372f;utils.track("INIT_POPUP");var onscrollAttached=!1,onscrollFixCounter=0;setLocalesText(),setHeaderColor(),constants.isLogoIcon&&setLogoIcon(),constants.isHeaderText&&setHeaderText(),constants.isSettingPage&&settingPageActive(),constants.isSettingPage&&constants.isSettingToggleForPushNotification&&setPushToggle(),constants.isSettingPage&&constants.isSettingToggleForModePushNotification&&setPushModeToggle(),setSettings({lastOpenNewsDate:(new Date).toString()}),chrome.runtime.connect(),setTimeout(function(){showFeed()},0),document.body.style.opacity=0,document.body.style.transition="opacity ease-out .4s",requestAnimationFrame(function(){document.body.style.opacity=1});var redrawPopup=function(){document.body.style.border="none",setTimeout(function(){document.body.style.border="1px solid transparent"},100),setTimeout(function(){document.body.style.border="none"},300)},checkWidth=function(e){setTimeout(function(){document.outerWidth<100&&redrawPopup()},e)};redrawPopup(),checkWidth(3e3),checkWidth(1e4);