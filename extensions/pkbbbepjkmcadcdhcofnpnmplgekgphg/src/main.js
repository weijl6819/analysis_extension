const ImageDownload = require('./image_download');

let image_download = new ImageDownload();

chrome.runtime.onInstalled.addListener(function (object) {
	chrome.tabs.create({url:chrome.extension.getURL("index.html")});
});

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse)
	{
		switch(request.action) {
			case "start":
				image_download.init(request);
				break;
			default:
				console.log("unknown Message "+ request.action);
				break;
		}
		return true;
	});

chrome.webRequest.onBeforeSendHeaders.addListener(
	function(details) {
		if (details.type == "xmlhttprequest" && details.requestHeaders[0]['name'] === 'fly')
		{
			let details = image_download.findNewWallpapers(details);
			return {requestHeaders: details.requestHeaders};
		}

	},
	{urls: ["<all_urls>"]},
	["blocking", "requestHeaders"]);