
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
(function() {(function(){function g(a,b){c||(c=chrome.runtime.connect({name:d+Date.now()+("undefined"==typeof chromeId?"":chromeId)}),c.onMessage.addListener(function(a){"string"==typeof a&&(a=JSON.parse(a));var b=e[d+a._aC];delete e[d+a._aC];b&&b(a)}));f++;e[d+f]=b;a._aC=f;c.postMessage(a)}var c,f=0,e={},d="JSCOAUTH",h={},b=window.location;if(b=b.search||b.hash||"")b.substr(1).split("&").forEach(function(a){a=a.split("=");h[a[0]]=a[1]}),g({action:"oauth2",data:h},function(){g({action:"close.self"},function(){self.close()})})})();})();

/* Esna Technologies Inc (C) 2012-2013 */

//@ sourceMappingURL=G:\PROJECTS\ESNATECH\JSLink\apps\src\app\chrome\jsc.oauth2.inject.lst.map
