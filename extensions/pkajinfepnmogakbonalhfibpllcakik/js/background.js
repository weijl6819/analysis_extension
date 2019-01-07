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
function isURL(str) {  var regexp =  /(?:(?:https?|ftp):\/\/)(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;  return regexp.test(str);}function shortUrl(url){url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?/im,'');url = url.replace(/undefined(:\/\/)?/im,'');return url;}function domainFromUrl(url) {    var result;    var match;    if (match = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n\?\=]+)/im)) {        result = match[1];        if (match = result.match(/^([^\.]+\.+\..+)$/)) {            result = match[1]        }    }    return result;}var db_controller = new dbController();var port = {};chrome.extension.onConnect.addListener(function(ex_port) {port[ex_port.sender.tab.id] = ex_port;ex_port.onMessage.addListener(function(msg) {switch(msg.action){case 'getAuthToken':chrome.permissions.contains({permissions: ["identity"]}, function(result) {if (result) {chrome.identity.getAuthToken({ 'interactive': msg.interactive }, function(token){ex_port.postMessage({'action': msg.action, 'error': chrome.runtime.lastError, 'token': token})});}});break; case 'getBookmarks':chrome.permissions.contains({permissions: ["bookmarks"]}, function(result) {if (result) {chrome.bookmarks.getTree(function(bookmarkTreeNodes) {ex_port.postMessage({'action' : msg.action, 'data': bookmarkTreeNodes});});}});break;case 'getFavico':msg.url =  'chrome://favicon/' + msg.url;var xhr = new XMLHttpRequest();xhr.open('GET', msg.url, true);xhr.responseType = 'blob';xhr.onload = function(r){if (this.status == 200) {var blob = this.response;var reader = new FileReader();reader.readAsDataURL(blob);reader.onloadend = function() {ex_port.postMessage({'action' : msg.action, 'url': msg.url, 'src' : reader.result});}}};xhr.send();break;case 'getHistory':chrome.permissions.contains({permissions: ["history"]}, function(result) {if (result) {chrome.history.search({text: '', maxResults: 8}, function(data) {ex_port.postMessage({'action' : msg.action, 'data': data});});}});break;case 'getTopSites':chrome.permissions.contains({permissions: ["topSites"]}, function(result) {if(result){chrome.topSites.get(function(t) {ex_port.postMessage({'action' : msg.action, 'data': t});});}});break;case 'getThumbnail':db_controller.getThumbnail(msg.url, function(src){ex_port.postMessage({'action': msg.action, 'url': msg.url ,'src': src});});break;case 'createBookmark':chrome.bookmarks.create({parentId: '1',title: msg.title,url: msg.url}, ex_port.postMessage({'action': msg.action}));break;case 'deleteBookmark':chrome.bookmarks.remove(msg.bookmark_id.toString(), ex_port.postMessage({'action': msg.action}));break;case 'ask_for_permissions':chrome.permissions.request(msg.optional_permissions, function(result) {ex_port.postMessage({'action': msg.action, 'granted': result, 'generator_id': msg.generator_id})});break;case 'check_for_permissions':chrome.permissions.contains(msg.optional_permissions, function(result) {ex_port.postMessage({'action': msg.action, 'granted': result, 'generator_id': msg.generator_id})});break;}});ex_port.onDisconnect.addListener(function(){ex_port.disconnect();delete port[ex_port.sender.tab.id];});});chrome.browserAction.onClicked.addListener(function(tab) {chrome.tabs.create({'url': "https://jdm.coolstart.com"});});chrome.runtime.setUninstallURL('https://coolstart.com/uninstalled?ex_id='+chrome.runtime.id);function cropImg(str, coords, callback) {var img = new Image();img.onload = function() {var canvas = document.createElement('canvas');canvas.width = coords.w;canvas.height = coords.h;var ctx = canvas.getContext('2d');ctx.drawImage(img, 0, 0, coords.w, coords.h);callback((canvas.toDataURL()));};img.src = str;}var url_tab_before_redirect = '',tab_id = '';chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){chrome.permissions.contains({permissions: ["history", "bookmarks", "tabs", "topSites"],origins: ["chrome://favicon/", "<all_urls>", "*://*.facebook.com/*", "*://*.coolstart.com/*"]}, function(result) {if (result) {/* if tab makes redirect while loading, search topsite by title */if(tab.status != 'complete'){ chrome.topSites.get(function(top_sites) {if(top_sites.length > 0){for(var i = 0, c = top_sites.length; i < c; i++){if(/* top_sites[i].title == tab.title &&  */domainFromUrl(tab.url) == domainFromUrl(top_sites[i].url)){url_tab_before_redirect = top_sites[i].url;tab_id = tab.id;break;}}}});}if(tab.status == 'complete' && tab.active){/* when new tab is loaded */chrome.topSites.get(function(top_sites) {/* check if is top-site and make thumbnail */if(top_sites.length > 0){/* var domain = domainFromUrl(tab.url); */var domain = tab.url;var insert_tab = false;for(var i = 0, c = top_sites.length; i < c; i++){if(domainFromUrl(top_sites[i].url) == domain /* || top_sites[i].title == tab.title */){tab.url = top_sites[i].url;insert_tab = true;}else if(url_tab_before_redirect == top_sites[i].url && tab_id == tab.id){tab.url = url_tab_before_redirect;insert_tab = true;}else if(tab_id == tab.id){tab.url = url_tab_before_redirect;insert_tab = true;}if(insert_tab){db_controller.insertThumbnail(tab);url_tab_before_redirect = '';tab_id = '';break;}}}});}} });});chrome.runtime.onMessage.addListener(function (msg, sender) {if ((msg.from === 'content') && (msg.subject === 'tokenUpdate')) {chrome.storage.sync.set({'linkedin_token': msg.body});}});chrome.runtime.onInstalled.addListener(function (details) {if (details.reason == "install") {chrome.storage.sync.set({'installed_on': Date.now()});chrome.tabs.query({ currentWindow: true, active: true },function (tabArray) { chrome.cookies.set({'url': 'https://coolstart.com', 'domain': '.coolstart.com', 'name': 'activated_extension', 'value': JSON.stringify({'id': chrome.runtime.id, 'subdomain': 'jdm'})}, function(cookie){chrome.tabs.update(tabArray[0].id, {url: "https://jdm.coolstart.com/"});});});}});chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponse) {if(typeof(request.action) != 'undefined'){switch(request.action){case "is_active_extension":sendResponse(true);break;}}});