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
var work = false, last_video_url = "", last_sent = {}, toggle = false, paused = false, scroll = -1, toggleMute = false, scrollingFinished = false, volume = -1.0, autonext = true, hidden = false, startNext = false, forceNext = false, first_start_message = false, ad_block = false, videoSpeed = 1, videoQuality = "medium", problem_there = false;

chrome.tabs.onUpdated.addListener(checkProcess);
chrome.tabs.onActivated.addListener(checkProcess);
chrome.tabs.onCreated.addListener(checkProcess);

chrome.windows.onRemoved.addListener(function() {
    if (work)
    {
        chrome.windows.getAll(function(windows) {
            if (windows.length < 1 && !paused)
                toggleVideo();
        });
    }
});

if (!localStorage["firstStart"])
{
    localStorage["firstStart"] = true;
    first_start_message = true;
}

function checkProcess(tabId, change, tab) {
    if (/youtube\.com\/watch/gi.test((change || tab || {}).url))
        chrome.tabs.executeScript(tabId, { file: "sideplayer.js", runAt: "document_idle" });
	if (!work/* || ((change || { status: "loading" }).status != "loading")*/)
		return true;
	if (typeof tabId == "object")
		tabId = tabId.tabId;
	//chrome.tabs.insertCSS(tabId, { file: "inject.css", runAt: "document_idle" });
	//chrome.tabs.executeScript(tabId, { code: "document.body.setAttribute('data-play', '" + last_video_url + "');", runAt: "document_idle" });
    chrome.tabs.executeScript(tabId, { file: "inject.js", runAt: "document_start" }, function(res) {
        if (res == undefined)
        {
            chrome.browserAction.setIcon({ path: { '19': "icon19_problem.png", '38': "icon38_problem.png" } });
            problem_there = true;
        } else if (problem_there) {
            problem_there = false;
            chrome.browserAction.setIcon({ path: { '19': "icon19.png", '38': "icon38.png" } });
        }
        chrome.tabs.sendMessage(tabId, last_sent);
    });
}

var iframe = document.createElement("iframe");
document.body.appendChild(iframe);

function playVideo(url) {
    if (last_video_url == url)
        return false;
    chrome.browserAction.setIcon({ path: { '19': "icon19.png", '38': "icon38.png" } });
	work = true;
    volume = -1.0;
    scroll = -1;
    last_sent = {};
    ad_block = false;
    toggle = false;
    hidden = false;
    paused = false;
    forceNext = false;
    startNext = false;
    scrollingFinished = false;
    videoQuality = localStorage["quality"] || "medium";
    videoSpeed = 1;
	console.log("Playing:", url);
	iframe.src = url + "&vq=medium&autoplay=1&play_small=true"; //.replace("watch?v=", "embed/");
    last_video_url = url;
    setTimeout(function() {
        if (!last_sent.image && !ad_block)
            showUnsupportable();
    }, 15000)
    chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
    	var tab = tabs[0].id;
    	console.log("Injection:", tabs[0].url);
		//chrome.tabs.insertCSS(tab, { file: "inject.css", runAt: "document_start" });
		//chrome.tabs.executeScript(tab, { code: "document.body.setAttribute('data-play', '" + last_video_url + "');", runAt: "document_start" });
		chrome.tabs.executeScript(tab, { file: "inject.js", runAt: "document_start" });
	});
	return true;
}

function showUnsupportable()
{
    closeVideo();
    chrome.tabs.executeScript(null, { code: 'document.body.classList.remove("SidePlayerLoading");', runAt: "document_start" });
    if (confirm("Sorry, this video can't be loaded.\n\nTry again?"))
        playVideo(last_video_url);
    return false;
}

chrome.runtime.onMessage.addListener(function(data, sender, sendResponse) {
    if (data.badError)
    {
        showUnsupportable();
        return false;
    }
    if (data.ad_block)
        ad_block = true;
    if (data.playingPlaylist)
    {
        forceNext = false;
        return false;
    }
    if (data.get_settings)
    {
        sendResponse({ opacity: localStorage["opacity"], videoSpeed: videoSpeed, videoQuality: localStorage["quality"] || "medium" });
        return false; 
    }
    if (data.repeatVideo)
    {
        removeVideoBlocks("", 1);
        playVideo(last_video_url);
        return true;
    }
    if (data.blockOpacity)
    {
        localStorage["opacity"] = +data.blockOpacity;
        return false;
    }
    if (data.newVideoSpeed)
    {
        videoSpeed = data.newVideoSpeed;
        return false;
    }
    if (data.newVideoQuality)
    {
        localStorage["quality"] = data.newVideoQuality;
        videoQuality = data.newVideoQuality;
        return false;
    }
    if (typeof data.scrollMoving == "number")
    {
        scroll = data.scrollMoving;
        return true;
    }
    if (data.forceNext)
        forceNext = true;
    if (data.new_image)
    {
    	if (toggle)
    	{
    		toggle = false;
    		sendResponse({ toggle: true });
    	}
        if (data.videoSpeed != videoSpeed)
            sendResponse({ videoSpeed: videoSpeed });
        if (data.videoQuality != videoQuality)
            sendResponse({ videoQuality: videoQuality });
        if (forceNext)
            sendResponse({ forceNext: true });
        if (scrollingFinished)
        {
            sendResponse({ scrollingFinished: true });
            scrollingFinished = false;
        }
        if (toggleMute)
        {
            sendResponse({ toggleMute: true });
            toggleMute = false;
        }
        if (scroll > -1)
        {
            var new_time = last_sent.duration * scroll;
            if (new_time > last_sent.duration - 2)
                new_time = last_sent.duration - 2;
            sendResponse({ scroll: last_sent.duration * scroll });
            scroll = -1;
        }
        if (volume == -1.0)
            volume = +data.volume;
        if (paused)
            paused = false;
        last_video_url = data.url || last_video_url;
    	last_sent = {
            image: data.new_image,
            name: data.name,
            width: data.width,
            height: data.height,
            ratio: data.height / data.width,
            duration: data.duration,
            now: data.now,
            timing: data.timing,
            loaded: data.loaded,
            muted: data.muted,
            volume: +volume,
            url: last_video_url,
            autonext: autonext,
            block_x: +localStorage["x"],
            block_y: +localStorage["y"],
            block_width: +localStorage["width"],
            block_height: +localStorage["height"],
            opacity: +localStorage["opacity"],
            hidden: hidden,
            forceNext: forceNext
        };
    	chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            if (tabs.length > 0)
    		    chrome.tabs.sendMessage(tabs[0].id, last_sent);
    	});
        sendResponse({ volume: +volume });
        return true;
    }
    if (data.close)
	{
		closeVideo();
        return true;
	}
    if (data.startNext)
        startNext = true;
	if (data.get_info)
	{
        if (startNext)
        {
            sendResponse({ startNext: true });
            startNext = false;
            return true;
        }
        if (forceNext)
            sendResponse({ forceNext: true });
		if (toggle)
    	{
    		toggle = false;
    		sendResponse({ toggle: true });
    	}
        if (scroll > -1)
        {
            sendResponse({ scroll: last_sent.duration * scroll });
            scroll = -1;
            return true;
        }
        if (data.updated_image)
        {
            var update = data.updated_image;
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    updated_image: update,
                    currentTime: data.currentTime,
                    x: +localStorage["x"],
                    y: +localStorage["y"],
                    width: +localStorage["width"],
                    height: +localStorage["height"],
                    opacity: +localStorage["opacity"]
                });
            });
            sendResponse({ got_update: true });
        }
        if (data.paused && !forceNext)
        {
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { paused: true });
            });
            paused = true;
        }
        sendResponse({ volume: +volume });
        return true;
    }

    if (data.toggleVideo)
        toggleVideo();

    if (data.ended || data.cancelUpNext || (data.endedButContinuous && !autonext && !forceNext))
    {
        iframe.src = "";
        work = false;
        setDefaultIcon();
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            //removeVideoBlocks(tabs[0].id);
            if (data.endedButContinuous && !autonext)
                chrome.tabs.sendMessage(tabs[0].id, { endedButContinuous: true, name: "" });
            else
                chrome.tabs.sendMessage(tabs[0].id, { ended: true });
        });
        return false;
    }

    if (data.endedButContinuous)
    {
        //forceNext = false;
        console.log("Continue to", data.name + "?");
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { endedButContinuous: true, name: data.name });
            setTimeout(function() {
                forceNext = false;
            }, 1000);
        });
    }
    if (data.toggleMute)
    {
        console.log("Toggle mute");
        if (toggleMute)
            toggleMute = false;
        else
            toggleMute = true;
    }
    if (data.scrollingFinished)
    {
        scrollingFinished = true;
    }
    if (typeof data.volume == "number")
    {
        if (last_sent.muted)
            toggleMute = true;
        volume = +data.volume;
    }
    if (data.toggleAutoNext)
        autonext = !autonext;
    if (data.reposition)
    {
        localStorage["x"] = data.reposition[0];
        localStorage["y"] = data.reposition[1];
        localStorage["width"] = data.size[0];
        localStorage["height"] = data.size[1];
    }
    if (data.get_size)
    {
        sendResponse(!!localStorage["x"] ? { work: work, x: +localStorage["x"], y: +localStorage["y"], width: +localStorage["width"], height: +localStorage["height"], opacity: localStorage["opacity"] } : { empty: true, work: work, opacity: localStorage["opacity"] });
    }
    if (data.toggleVideoHide)
        toggleVideoHide();
    if (data.playSideplayer)
        playVideo(data.playSideplayer);
});

function toggleVideoHide() {
    hidden = !hidden;
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            forceHide: hidden
        });
    });
    if (hidden && !paused || !hidden && paused)
        toggleVideo();
}

function setDefaultIcon()
{
    chrome.browserAction.setIcon({ path: { "19": "icon_inactive19.png", "38": "icon_inactive38.png" } });
    return true;
}
function closeVideo()
{
    iframe.src = "";
    work = false;
    setDefaultIcon();
    removeVideoBlocks("", 0);
    return true;
}

function removeVideoBlocks(except, reason)
{
    console.log("Removing the block... Reason id:", reason);
    if (typeof except == "number" && !autonext)
        chrome.tabs.sendMessage(except, { ended: true });
    chrome.tabs.query({ windowType: "normal" }, function(tabs) {
        for (var i = 0; i < tabs.length; i++)
            if (tabs[i].id != except)
                chrome.tabs.executeScript(tabs[i].id, { code: 'if (document.getElementById("YouTubeVideo")) document.body.removeChild(document.getElementById("YouTubeVideo"));', runAt: "document_start" });
    });
    return true;
}
function egg() {return "ZGouc21hZ29sZEBnbWFpbC5jb20=";}//b64
function isFirstStart()
{
    return first_start_message;
}
chrome.webRequest.onHeadersReceived.addListener(
    function(info) {
        var headers = info.responseHeaders;
        for (var i=headers.length-1; i>=0; --i) {
            var header = headers[i].name.toLowerCase();
            if (header == 'x-frame-options' || header == 'frame-options') {
                headers.splice(i, 1); // Remove header
            }
        }
        return {responseHeaders: headers};
    },
    {
        urls: [ '*://*.youtube.com/*', '*://youtu.be/*' ], // Pattern to match all http(s) pages
        types: [ 'sub_frame' ]
    },
    ['blocking', 'responseHeaders']
);

function isWork() {
	return work;
}

function toggleVideo() {
	toggle = true;
}

// Google Analytics:

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-68704023-1']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();