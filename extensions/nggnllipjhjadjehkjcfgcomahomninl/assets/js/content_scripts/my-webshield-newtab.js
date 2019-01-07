
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
var Webshield=Webshield||{};!function(e,t,n,i,o){Webshield.Newtab=function(e){this.el=e.el,this.init()},Webshield.Newtab.prototype.init=function(){this.changeToNewTabButtons(),this.onClickListener()},Webshield.Newtab.prototype.changeToNewTabButtons=function(){this.newButton=e("<button/>").addClass("button secondary small").html("Safely Search the Web").attr("ui-webshield-newtab",!0),this.el.replaceWith(this.newButton)},Webshield.Newtab.prototype.requestNewTabFromBackground=function(){t.runtime.sendMessage({action:"newtab-open"},function(e){})},Webshield.Newtab.prototype.onClickListener=function(){var t=this;"object"==typeof this.newButton&&e(i).on("click","[ui-webshield-newtab]",function(e){e.preventDefault(),t.requestNewTabFromBackground()})}}($JQ,$JQ.utils().getExtensionApi(),window,document),$JQ(document).ready(function(){new Webshield.Newtab({el:$JQ("[ui-webshield-newtab]")})});