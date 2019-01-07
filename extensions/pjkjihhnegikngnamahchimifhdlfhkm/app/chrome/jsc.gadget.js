
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
(function() {(function(){function g(a){var b={action:"cnt:salesforce"};c||(c=chrome.runtime.connect({name:d+Date.now()+("undefined"==typeof chromeId?"":chromeId)}),c.onMessage.addListener(function(a){"string"==typeof a&&(a=JSON.parse(a));var b=e[d+a._AA];delete e[d+a._AA];b&&b(a)}));f++;e[d+f]=a;b._AA=f;c.postMessage(b)}var c,f=0,e={},d="JSCGADGET";window.addEventListener("load",function(){var a=document.createElement("iframe");a.style.display="none";document.body.appendChild(a);g(function(b){b.enabled&&(a.src=
b.page,a.style.display="block",a.style.borderLeft=a.style.borderRight="1px solid light gray")})})})();})();

/* Esna Technologies Inc (C) 2012-2013 */

//@ sourceMappingURL=G:\PROJECTS\ESNATECH\JSLink\apps\src\app\chrome\jsc.gadget.lst.map
