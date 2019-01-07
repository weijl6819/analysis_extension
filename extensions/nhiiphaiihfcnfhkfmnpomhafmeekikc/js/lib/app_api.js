
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
(function(){if(typeof window.appAPI!=="undefined"){return;}var h=Consts;var e=function(i){i=i.trim();(function(j){window["eval"].call(window,j);}(i));};var a=function(){var l=function(m){if(typeof m==="function"){InternalMessaging.messageToBackground({action:"getBgCode",passCallback:true},function(n){m(n);});}};var k=function(m){if(typeof m==="function"){InternalMessaging.messageToBackground({action:"getPageCode",passCallback:true},function(n){m(n);});}};var j=function(m){InternalMessaging.messageToBackground({action:"setBgCode",params:[m]});};var i=function(m){InternalMessaging.messageToBackground({action:"setPageCode",params:[m]});};return{getBackground:l,getExtension:k,setBackground:j,setExtension:i};};var g=function(){var j=function(m,n){if(typeof n==="function"){InternalMessaging.messageToBackground({action:"getPluginsOrder",params:[m],passCallback:true},function(o){n(o);});}};var i=function(m,n){if(typeof n==="function"){n(m);}};var l=function(m,n){if(typeof n==="function"){InternalMessaging.messageToBackground({action:"getPluginCode",params:[m.id],passCallback:true},function(o){n(o);});}};var k=function(m,n,o){InternalMessaging.messageToBackground({action:"setPluginCode",params:[m,n,o]});};return{getOrder:j,getInfo:i,getCode:l,setPluginCode:k};};AppApi=function(){};AppApi.prototype={_dom:{},_removedCookies:{},_cookies:{},init:function(i){this._bic=i.bic;this.db=new DBManager(TableNames.USER_COOKIES);this.db.async=new AsyncDBManager(TableNames.DB_ASYNC);this.internal={};this.internal.db=DBManager(TableNames.INTERNAL_DB);this.internal.db.async=AsyncDBManager(TableNames.INTERNAL_DB_ASYNC);this.db._self=this;this.internal.db._self=this;this.__should_activate_validation__=true;this.internal.scope=h.SCOPE.PAGE;this.cookie=new Cookie(this);this.tabID=i.tabID;this.manifest=i.manifest;this.appID=this.manifest.crossrider.appID;this.cr_version=this.manifest.version;this.version=this.manifest.ver;this.platform=this.manifest.platform;this.debugMode=this.manifest.crossrider.debug;this._cookies=i._cookies;this.message=new Message(this);this.message.setTabId(i.tabID);this._initInternalMessaging();this.isBackground=false;this.internal.installer=Installer();this.db.init(this);this.db.async.init(this);this.internal.db.init(this);this.internal.db.async.init(this);this.pageAction=new pageAction();this.internal.userCode=a();this.internal.plugins=g();this.internal.platformVersion=PlatformVersion;this._getUserScripts();for(var j in TableNames){if(j.toLowerCase().indexOf("length")<0){this._removedCookies[TableNames[j]]={};}}},_initInternalMessaging:function(){if(typeof chrome.extension.onMessage==="undefined"){chrome.extension.onRequest.addListener(this._onRequest.bind(this));}else{chrome.extension.onMessage.addListener(this._onRequest.bind(this));}},_getUserScripts:function(){chrome.storage.local.get(h.PAGE_PLUGIN_CODE_KEY,function(l){if(l==="undefined"||l===null){return;}var i=l[h.PAGE_PLUGIN_CODE_KEY];if(typeof i!=="string"||i.length<=0){return;}if(appAPI.debugMode){var k=appAPI.manifest.crossrider.user_script;var j=new XHR({url:k+"?rnd="+(new Date().getTime()),method:"get",async:false}).send();e(i+"\n\n"+j);}else{chrome.storage.local.get(h.PAGE_CODE_KEY,function(n){if(n==="undefined"||n===null){return;}var m=n[h.PAGE_CODE_KEY];if(typeof m!=="string"){return;}e(i+"\n\n"+m);});}});},_onRequest:function(l,k,i){var m=l.action,o=null;var j=!(InternalMessaging.responseLater);if(m){if(l.hasOwnProperty("scope")&&this[l.scope].hasOwnProperty(m)){o=this[l.scope][m];}else{o=this[m];}}if(typeof(o)==="function"){var n=l.params&&typeof(l.params["push"])==="function"?l.params:[];if(l.passCallback===true){n.push(i);}j=o.apply(this,n);return j;}},activatePageActionCallback:function(i){appAPI.pageAction._activateCallback(i);},openURL:function(j,i){InternalMessaging.messageToBackground({action:"innerOpenURL",params:[j,i]});},innerOpenURL:function(j,i){InternalMessaging.messageToBackground({action:"innerOpenURL",params:[j,i]});},loadResourceInTab:function(j){var i=window.document;i=i.open("text/html","replace");i.write(j);i.close();},superAlert:function(i){InternalMessaging.messageToBackground({action:"superAlert",params:[i]});},removeExpiredCookies:function(k,m){if(m.length>0){for(var l=0;l<m.length;++l){var j=m[l];if((m.indexOf(j)>=0)&&this._cookies[k].hasOwnProperty(j)){delete this._cookies[k][j];}}}},updateCookie:function(k,l,j){var i=this;if(!this._cookies){setTimeout(function(){i.updateCookie(k,l,j);},25);return;}if(this._removedCookies[j][k]){delete this._removedCookies[j][k];}var m=l.expires instanceof (Date)?l.expires:new Date(l.expires);this._cookies[j][k]={value:l.value,expires:m};},updateCookieExpiration:function(k,i,j){this._cookies[j][k].expires=i;},unsetCookie:function(j,i){if(this._cookies[i][j]){this._removedCookies[i][j]=true;delete this._cookies[i][j];}},removeAllCookies:function(i,j,k){for(cookie in this._cookies[i]){this._removedCookies[i][cookie]=true;if(j&&k.indexOf(cookie)<0){delete this._cookies[i][cookie];}}if(!j){this._cookies[i]={};}},updateRealCookie:function(i,j){if(this._removedCookies[TableNames.USER_COOKIES]["real"+i]){delete this._removedCookies[TableNames.USER_COOKIES]["real"+i];}else{this._cookies[TableNames.USER_COOKIES].mysite[i]={value:j.value,expires:j.expires};}},unsetRealCookie:function(i){if(this._cookies[TableNames.USER_COOKIES].mysite[i]){this._removedCookies[TableNames.USER_COOKIES]["real"+i]=true;delete this._cookies[TableNames.USER_COOKIES].mysite[i];}},getTabId:function(){return this.tabID;},isDebugMode:function(){return this.debugMode;},getCrossriderID:function(){return this._bic;},fb_respond:function(j,i){this.fbAPI.callback(j,i);},handleMessage:function(i){this.message.call(i);},background:{reload:function(){InternalMessaging.messageToBackground({action:"reload"});}},getAPIInfo:function(){return{appID:this.appID,cr_version:this.cr_version,version:this.version,platform:this.platform};}};var b=0;function d(k){if(typeof k!=="undefined"&&k.hasOwnProperty("manifest")&&k.hasOwnProperty("_cookies")){var i=(window.top!==window.self);var l=(k.manifest.runiniframe==="true");if(!l&&i){return;}if(!k._cookies.hasOwnProperty("_cr_verify_cookies_are_good")){if(b<3){b++;f();}else{var j="cookiesNotSetYet var limit was reached";InternalMessaging.messageToBackground({action:"reportError",params:[j,"main_code"]});}return;}delete k._cookies._cr_verify_cookies_are_good;window.appAPI=new AppApi();appAPI.init(k);}else{if(b<3){b++;f();}}}function c(){InternalMessaging.messageToBackground({action:"getAppData",passCallback:true},d);}function f(){InternalMessaging.messageToBackground({action:"refreshMemoryCookiesFromDB",passCallback:true},function(){setTimeout(c,50);});}c();}());
