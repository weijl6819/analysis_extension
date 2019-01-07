
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
var PasswordVault=PasswordVault||{};!function(t,e,a,s,o){"use strict";PasswordVault.FieldChecker=function(){this.init()},PasswordVault.FieldChecker.prototype.init=function(){var t=this;this.onUserNotHavingPasswordVault(function(){t.startMessageListener()})},PasswordVault.FieldChecker.prototype.onUserNotHavingPasswordVault=function(t){e.storage.local.get("authed_user",function(e){try{var a=JSON.parse(e.authed_user)}catch(t){return void 0,!1}return a?a.hasOwnProperty("metaData")?a.metaData.hasOwnProperty("hasPasswordVault")?void(a.metaData.hasPasswordVault||"function"==typeof t&&t()):(void 0,!1):(void 0,!1):(void 0,!1)})},PasswordVault.FieldChecker.prototype.startMessageListener=function(){var t=this;e.runtime.onMessage.addListener(function(e,a,s){if("passwordFieldCheck"===e.action)return s({success:t.pageHasPasswordField()}),!0})},PasswordVault.FieldChecker.prototype.pageHasPasswordField=function(){return s.querySelectorAll('[type="password"]').length>0}}(jQuery,$JQ.utils().getExtensionApi(),window,document),$JQ(document).ready(function(){new PasswordVault.FieldChecker});