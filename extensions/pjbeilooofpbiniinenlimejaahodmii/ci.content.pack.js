
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

window.AddonsFramework=function(){this.browser=new this.Browser;this.extension=new this.Extension};window.AddonsFramework.prototype.Browser=function(){function f(c,b){if(a[c])for(var d=0;d<a[c].length;d++)a[c][d](b)}function d(a){var b={action:"ci_browser_navigate"},d;for(d in a)b[d]=a[d];return b}var a={};this.attachEvent=function(c,b){a[c]||(a[c]=[]);a[c].push(b)};this.fireEvent=f;this.navigate=function(a){chrome.runtime.sendMessage(d(a))};this.NEWTAB=-1;this.CURRENTTAB=-2;this.NEWWINDOW=-3;this.ALLTABS=-4;this.TABCLOSED=-5;this.DOCUMENTCOMPLETE="DocumentComplete";this.BEFORENAVIGATE="BeforeNavigate";
this.DNSERROR="DNSError";this.TABCHANGED="TabChanged";var b=navigator.userAgent.match(/(opr|yabrowser|mrchrome|chrome(?!.*(?:opr|yabrowser|mrchrome)))\/?\s*(\d+)?/i);if(b){switch(b[1].toLowerCase()){case "opr":this.name="Opera";break;default:this.name="Chrome"}this.version=b[2]||"unknown"}else this.name="chromium",this.version="unknown";chrome.runtime.onMessage.addListener(function(a){"event"==a.action&&f(a.name,a.data)})};window.AddonsFramework.prototype.Extension=function(){var f=this,d={};this.fireEvent=function(a,b,c){c?chrome.runtime.sendMessage({action:"event",name:a,data:b},c):chrome.runtime.sendMessage({action:"event",name:a,data:b});if(d[a])for(var e=0;e<d[a].length;e++)d[a][e].call(f,b,c)};this.attachEvent=function(a,b){d[a]||(d[a]=[]);d[a].push(b)};this.detachEvent=function(a,b){if(d[a])for(var c=0;c<d[a].length;c++)b&&b===d[a][c]&&(delete d[a][c],d[a][c]=null,d[a].splice(c,1))};this.log=function(){console.log.apply(console,
arguments)};this.setItem=function(a,b){if("string"==typeof a)if("undefined"==typeof b)chrome.storage.local.remove(a);else{var c={};c[a]=b;chrome.storage.local.set(c)}else"object"==typeof a&&chrome.storage.local.set(a)};this.getItem=function(a,b){"string"==typeof a||("array"==typeof a||"object"==typeof a)&&0<a.length?chrome.storage.local.get(a,function(c){"string"==typeof a?b(c?c[a]:null):b(c)}):b(null)};chrome.runtime.onMessage.addListener(function(a,b,c){if("event"==a.action&&(b=a.name,a={data:a.data.data},
d[b]))for(var e=0;e<d[b].length;e++)d[b][e]&&d[b][e].call(f,a,c)})};window.framework=new AddonsFramework;
