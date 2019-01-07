
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
var Adguard=Adguard||{};!function(t,n,o,e,a){Adguard.Switch=function(t){this.el=t.el;var n=this;this.onUserHavingAdblock(function(){n.init()})},Adguard.Switch.prototype.onUserHavingAdblock=function(t){n.storage.local.get("authed_user",function(n){try{var o=JSON.parse(n.authed_user)}catch(t){return void 0,!1}return o?o.hasOwnProperty("metaData")?o.metaData.hasOwnProperty("hasAdblock")?void(o.metaData.hasAdblock&&"function"==typeof t&&t()):(void 0,!1):(void 0,!1):(void 0,!1)})},Adguard.Switch.prototype.init=function(){var t=this;t.changeToAdblockToggle(),t.onClickListener(),t.onMessageListener(),t.getStatus(function(n){t.setElementState(n)})},Adguard.Switch.prototype.changeToAdblockToggle=function(){this.newButton=t("<div/>").addClass("switch primary round").html('&nbsp;<span class="indicator"></span>').attr("ui-adblock-toggle",!0),this.el.replaceWith(this.newButton),this.el=this.newButton},Adguard.Switch.prototype.getStatus=function(t){n.runtime.sendMessage({action:"get-config-adblock"},function(n){void 0===n.conf&&void 0,"function"==typeof t&&t(n.conf.startOnLoad)})},Adguard.Switch.prototype.setElementState=function(t){t?this.el.addClass("on"):this.el.removeClass("on")},Adguard.Switch.prototype.toggleAdblockState=function(){var t=this,o=this.el.hasClass("on")?"stop-adblock":"start-adblock";n.runtime.sendMessage({action:o},function(n){t.notifyTabs(!0),n.running?t.el.addClass("on"):t.el.removeClass("on")})},Adguard.Switch.prototype.notifyTabs=function(t){n.runtime.sendMessage({action:"notifyTabs"},function(t){})},Adguard.Switch.prototype.onClickListener=function(){var t=this;t.el.on("click",function(){t.toggleAdblockState()})},Adguard.Switch.prototype.onMessageListener=function(){var t=this;n.runtime.onMessage.addListener(function(n,o,e){if("string"==typeof n.action)switch(n.action){case"toggleAdBlockElement":t.getStatus(function(n){t.setElementState(n)})}return e("Found!"),!0})}}($JQ,$JQ.utils().getExtensionApi(),window,document),$JQ(document).ready(function(){new Adguard.Switch({el:$JQ("[ui-adblock-toggle]")})});