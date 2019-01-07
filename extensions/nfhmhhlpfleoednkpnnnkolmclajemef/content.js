
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
function g(b){return(b=(new RegExp(";\\s*"+b+"=(.*?);","g")).exec(";"+document.cookie+";"))?b[1]:null}var k=g("php-console-server");k||(k=g("phpcsls"));
k&&new function(){function b(a){if("object"==typeof a&&a){a.__proto__=null;for(var c in a)b(a[c])}}var l="",f="",h=0;window.addEventListener("error",function(a,c,d){a.filename&&(c=a.filename);"undefined"!=typeof a.lineno&&(d=a.lineno?a.lineno:1);if(!a.target.chrome||c){a.message?a=a.message:a.data?a=a.data:a.target&&a.target.src&&(c=window.location.href,a="File not found: "+a.target.src);if("string"!=typeof a||"Script error."==a)a=null;var b=a+c+d;b!=f&&10>h&&(f=b,h++,chrome.extension.sendMessage({_handleJavascriptError:!0,
text:a,url:c,line:d}))}},!1);chrome.extension.onMessage.addListener(function(a){if(a._id==l)if(a._handleConsolePacks)for(var c in a.packs){var d=a.packs[c];d.collapse?console.groupCollapsed(d.groupName):console.group(d.groupName);var f=void 0;for(f in d.messages){var e=d.messages[f];b(e.args);if("eval_result"==e.type)for(var h in e.args)console.log.apply(console,e.args[h]);else"error"==e.type?console.error.apply(console,e.args):console.log.apply(console,e.args)}console.groupEnd()}else a._clearConsole&&
console.clear()});chrome.runtime.sendMessage({_registerTab:!0,url:window.location.href,protocol:k},function(a){a.url&&(window.location.href=a.url);l=a.id})};