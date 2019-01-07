
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
var arBadElements=["img","object","embed","iframe","frame","audio","video"];var loadCheckInterval=1;var loadCheck;var toggleTextMode=function(e){if(!e){document.location.reload();return}removeElements.apply(document,arBadElements);var t=document.all;for(var n=0;n<t.length;n++){if(getComputedStyle(t[n])!=null&&getComputedStyle(t[n]).backgroundImage!=null&&getComputedStyle(t[n]).backgroundImage.length>0&&t[n].style!=null&&t[n].style.backgroundImage!=null){t[n].style.backgroundImage="none"}}};var removeElements=function(){var e=this;e.documentElement.classList.add("textOnly");Array.prototype.slice.call(arguments).forEach(function(t){var n=e.getElementsByTagName(t);for(var r=n.length-1;r>=0;r--){n[r].parentElement.removeChild(n[r])}});var t=e.getElementsByTagName("input");for(var n=t.length-1;n>=0;n--){if(t[n].type!="image")continue;t[n].src=chrome.extension.getURL("/images/submit.png")}};var showPage=function(e){if(e)document.documentElement.style.display="";else document.documentElement.style.display="false"};var i=0;var doLoadCheck=function(){loadCheck=window.setInterval(function(){if(document.readyState=="complete"){removeElements.apply(document,arBadElements);window.clearInterval(loadCheck);return}removeElements.apply(document,arBadElements)},loadCheckInterval)}