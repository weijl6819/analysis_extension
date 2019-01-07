
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

var $JQ=jQuery.noConflict();$JQ.utils=function(){return{getExtensionApi:function(){return"undefined"!=typeof browser?browser:"undefined"!=typeof chrome?chrome:(void 0,null)},getEnabledLanguageIsoCodes:function(){return["en","fr","es","de","it","pt","nl"]},getCurrentLanguageIsoCode:function(){return this.getExtensionApi().i18n.getUILanguage().split("-")[0]},sendMessage:function(e,n){if("undefined"!=typeof browser){this.getExtensionApi().runtime.sendMessage(e).then(function(e){n(e)},function(e){return void 0,!1})}else"undefined"!=typeof chrome&&this.getExtensionApi().runtime.sendMessage(e,function(e){n(e)})},onMessage:function(e){if(void 0,"undefined"!=typeof browser){this.getExtensionApi().runtime.onMessage.addListener(e)}else"undefined"!=typeof chrome&&this.getExtensionApi().runtime.onMessage.addListener(function(n,o,s){e(n,o,s)})}}},void 0;var languageIsoCode=$JQ.utils().getCurrentLanguageIsoCode(),enabledLanguages=$JQ.utils().getEnabledLanguageIsoCodes(),bodyClass="lang-en";-1!==enabledLanguages.indexOf(languageIsoCode)&&(bodyClass="lang-"+languageIsoCode),$JQ("body").addClass(bodyClass);