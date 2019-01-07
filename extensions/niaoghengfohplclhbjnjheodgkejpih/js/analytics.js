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
try{localStorage.optOut+""=="false"?(!function(e,t,a,n,o,c,i){e.GoogleAnalyticsObject=o,e[o]=e[o]||function(){(e[o].q=e[o].q||[]).push(arguments)},e[o].l=1*new Date,c=t.createElement(a),i=t.getElementsByTagName(a)[0],c.async=1,c.src=n,i.parentNode.insertBefore(c,i)}(window,document,"script","https://www.google-analytics.com/analytics.js","ga"),ga("create","UA-12697733-6","auto"),ga("set","checkProtocolTask",function(){}),ga("require","displayfeatures")):window.ga=window.ga||function(){}}catch(e){window.ga=window.ga||function(){}}