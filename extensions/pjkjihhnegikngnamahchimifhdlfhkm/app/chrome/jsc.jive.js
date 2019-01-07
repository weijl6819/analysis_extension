
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
(function() {(function(){function g(){var a={action:"cnt:jiveBind"};if(!("undefined"==typeof chromeUnloading?0:chromeUnloading))c||(c=chrome.runtime.connect({name:d+Date.now()+("undefined"==typeof chromeId?"":chromeId)}),c.onMessage.addListener(function(b){"string"==typeof b&&(b=JSON.parse(b));var a=e[d+b._AA];delete e[d+b._AA];if(a)return a(b);console.log("JIVE",b);a=document.createEvent("CustomEvent");a.initCustomEvent("jabber.presence",!0,!0,b);document.dispatchEvent(a)})),f++,e[d+f]=void 0,a._AA=f,c.postMessage(a)}
function h(){var a=document.documentElement.attributes.getNamedItem("bridge");a&&"jive.jabber"==a.value&&(console.log("JIVE bind"),g())}if(!(0<=location.href.indexOf("dynamics.com/"))){var c,f=0,e={},d="JSCJIVE";h()}})();})();

/* Esna Technologies Inc (C) 2012-2013 */

//@ sourceMappingURL=G:\PROJECTS\ESNATECH\JSLink\apps\src\app\chrome\jsc.jive.lst.map
