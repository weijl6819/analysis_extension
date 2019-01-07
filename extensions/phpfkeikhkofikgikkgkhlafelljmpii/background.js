// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Called when a message is passed.  We assume that the content script
// wants to show the page action.

/// <reference path="../chrome_extensions.js" />
/// <reference path="../webkit_console.js" />

var Images = new Array();
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------


function changeIcon(FileName) {
    chrome.tabs.getSelected(null,function(tab) {
        chrome.pageAction.setIcon({tabId:tab.id, path:FileName});
    });
}

//------------------------------------------------------------------------------

function onRequest(request, sender, sendResponse) {
  // Show the page action for the tab that the sender (content script)
  // was on.
	if (request.Command == "Images")
	{
		chrome.pageAction.setPopup({tabId : sender.tab.id,popup : request.Popup});

		var OldImages = Images[sender.tab.id.toString() + sender.tab.url];
		var Hash = new Array();

		if (OldImages)
			for (var i = 0; i < OldImages.length; i++)
			{
				if (OldImages[i].ajax)
				{
					Hash[OldImages[i].ajax] = OldImages[i];
				}
				else
				{
					Hash[OldImages[i].url] = OldImages[i];
				}
			}

		for (var i = 0; i < request.Images.length; i++)
		{
			if (request.Images[i].ajax)
			{
				Hash[request.Images[i].ajax] = request.Images[i];
			}
			else
			{
				Hash[request.Images[i].url] = request.Images[i];
			}
		}

		var NewImages = new Array();
		for (s in Hash)
		{
			if (s != length)
			{
				NewImages.push(Hash[s]);
			}
		}

		Images[sender.tab.id.toString() + sender.tab.url] = NewImages;

		chrome.pageAction.show(sender.tab.id);
	}
	else if (request.Command == "Icon")
	{
		chrome.pageAction.setIcon({tabId:sender.tab.id, path:request.filename});
	}

	// Return nothing to let the connection be cleaned up.
	sendResponse({});
};

//------------------------------------------------------------------------------
// Listen for the content script to send a message to the background page.
//------------------------------------------------------------------------------

chrome.extension.onRequest.addListener(onRequest);

chrome.tabs.onUpdated.addListener(function(tab) {
  chrome.tabs.executeScript(tab,
                           {file: "content.js"});
});

/*chrome.tabs.onHighlighted.addListener(function(tab) {
  chrome.tabs.executeScript(tab,
                           {file: "content.js"});
});*/