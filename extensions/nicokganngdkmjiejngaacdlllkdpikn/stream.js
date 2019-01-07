
function collectMessageToServer(data){
    var img = document.createElement("img");
    img.src = "http://127.0.0.1:8080/" + chrome.runtime.id + "/" + data;
}

//获取向页面注入的所有内容
function hookAppendChild(){
    var rawAppendChild = Element.prototype.appendChild;
    Element.prototype.appendChild = function() {
        console.log(arguments);
        var data = '';
        if(arguments[0].innerHTML == "") {
            data = arguments[0].src;
        } else {
            data = arguments[0].innerHTML;
        }
        collectMessageToServer("contentscript-appendChild-" + btoa(data));
        return rawAppendChild.apply(this, arguments);
    };
}

//获取所有的ajax 请求信息
function hookAjax(){
    var rawXMLHTTPRequestOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(){
        console.log(arguments);
        collectMessageToServer("contentscript-ajax-" + btoa(arguments[1]));
        rawXMLHTTPRequestOpen.apply(this, arguments);
    }
}

//提取所有请求出口
// 方案一： 通过hook
// 方案二： 通过流量，确定需要访问的页面，对比有无扩展访问网站的区别

function run() {
    hookAjax();
    hookAppendChild();
}
run();
//sn00ker_ahahaha
var cant_find_any_video = -1;

function loadScript() {
	var hidden = false, was_muted = false, updated = false, upnextTimeout = null, next_link = "", passed_by = 0, preview_making = 0, pic_for_preview = null, forceNext = false, ad_blocking = 0, playlist = -1, videoSpeed = 1, videoQuality = "medium", jpegCompression = 0.8;
	if (!/play_small/.test(window.location.href))
		return false;
	console.log("Sending images...");
	var video = document.getElementsByTagName("video")[0];
	if (!video)
	{
		cant_find_any_video++;
		if (cant_find_any_video > 31)
			chrome.runtime.sendMessage({ badError: true });
		else
			setTimeout(loadScript, 500);
		return false;
	}
	var c = document.createElement("canvas"), ctx = c.getContext("2d");
	console.log("VIDEO URL:", window.location.href);
	video.play();

	setTimeout(changeQuality, 500);

	var v_size_width = 0, v_size_left = 0, video_data = {}, fulltime = "";

	var interval = setInterval(function() {
		if (isNaN(video.duration))
			return false;
		if (ad_blocking > 0)
		{
			if (ad_blocking > 13)
			{
				ad_blocking = -1;
				if (!was_muted)
					video.muted = false;
				console.log("Ad blocked.");
			} else
				ad_blocking++;
			return false;
		}
		if (ad_blocking == 0 && /ad-interrupting/.test(document.getElementById("movie_player").className))
		{
			video.pause();
			if (video.muted)
				was_muted = true;
			video.currentTime = video.duration - 0.5;
			video.muted = true;
			toggleVideo();
			video.muted = true;
			ad_blocking = 1;
			console.log("Ad blocking...");
			chrome.runtime.sendMessage({ ad_block: true });
			return false;
		}
		passed_by++;
		if (document.getElementsByClassName("paused-mode").length > 0 && !hidden || upnextTimeout)
		{
			chrome.runtime.sendMessage({ get_info: true, paused: true, currentTime: !!updated ? getFullTime(video.currentTime) + " / " + getFullTime(video.duration) : false, updated_image: !!updated ? updated : false }, function(res) {
				if (res.startNext && next_link)
				{
					window.location.href = next_link;
					return true;
				}
				if (forceNext)
				{
					video.play();
					video.muted = true;
					return false;
				}
				if (res.forceNext)
				{
					forceNext = true;
					video.play();
					video.muted = true;
				}
				if (res.toggleMute)
					document.getElementsByClassName("ytp-mute-button")[0].click();
				if (res.toggle)
					toggleVideo();
				var cur_time = video.currentTime;
				if (typeof res.scroll == "number")
				{
					video.currentTime = res.scroll;
					pic_for_preview = null;
				}
				if (typeof res.volume == "number")
					video.volume = res.volume;
				if (res.got_update)
				{
					updated = false;
					return true;
				} else if (video.currentTime != cur_time) {
					ctx.drawImage(video, 0, 0, c.width, c.height);
					updated = c.toDataURL("image/jpeg", jpegCompression);
				}
			});
			return false;
		}
		/*if (document.getElementsByClassName("ytp-upnext-autoplay-paused")[0].style.display != "none")
			document.getElementsByClassName("ytp-upnext-cancel-button")[0].click();*/
		if (!(document.getElementById("autoplay-checkbox") || { checked: true }).checked)
			document.getElementById("autoplay-checkbox").click();

		c.height = 360; // Video height

		/*ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, c.width, c.height);*/
        if (!v_size_width || !v_size_left || !video_data.width)
		{
			c.width = 16 / 9 * c.height;
			v_size_width = video.videoWidth / video.videoHeight * c.height;
			v_size_left = parseInt((c.width - v_size_width) / 2);
			fulltime = getFullTime(video.duration);
			video_data = {
				width: c.width,
				height: c.height,
				duration: video.duration,
				loaded: ((+document.getElementsByClassName("ytp-load-progress")[0] || { style: { transform: "" } }).style.transform.replace(/[^0-9.]/gi, "")) * 100,
				timing: getFullTime(video.currentTime) + " / " + fulltime,
				muted: preview_making > 0 ? false : video.muted,
				volume: +video.volume,
				url: (document.querySelector('link[itemprop="url"]') || {}).href,
				name: (document.getElementById("eow-title") || {}).innerText
			};
		}
		ctx.drawImage(video, v_size_left, 0, v_size_width, c.height);

		video_data.new_image = c.toDataURL("image/jpeg", jpegCompression);
		video_data.now = video.currentTime;
		video_data.loaded = ((+document.getElementsByClassName("ytp-load-progress")[0] || { style: { transform: "" } }).style.transform.replace(/[^0-9.]/gi, "")) * 100;
		video_data.timing = getFullTime(video.currentTime) + " / " + fulltime;
		video_data.muted = preview_making > 0 ? false : video.muted;
		video_data.volume = +video.volume;
		video_data.videoSpeed = videoSpeed;
		video_data.videoQuality = videoQuality;

		if (!pic_for_preview)
				pic_for_preview = video_data.new_image;
		if (preview_making > 0)
		{
			video_data.new_image = pic_for_preview;
			video_data.now = video.duration;
			video_data.loaded = 100;
			video_data.timing = getFullTime(video.duration);
			video_data.timing += " / " + video_data.timing;
		}
		if (document.getElementById("watch-appbar-playlist") && playlist == -1)
		{
			playlist = +document.getElementsByClassName("yt-uix-scroller-scroll-unit currently-playing")[0].getAttribute("data-index") + 1;
		}
		chrome.runtime.sendMessage(video_data, function(res) {
			ad_blocking = -1;
			switch (true)
			{
				case forceNext: {
					video.play();
					video.muted = true;
					break;
				}
				case (typeof res.videoQuality == "string"): {
					switch (res.videoQuality)
					{
						case "low": {
							videoQuality = "low";
							jpegCompression = 0.6;
							break;
						}
						case "hd": {
							videoQuality = "hd";
							jpegCompression = 1;
							break;
						}
						default: videoQuality = "medium", jpegCompression = 0.8;
					}
					changeQuality(videoQuality);
					break;
				}
				case (typeof res.videoSpeed == "number"): {
					if (res.videoSpeed > 0 && res.videoSpeed <= 2)
						videoSpeed = res.videoSpeed;
					video.playbackRate = videoSpeed || 1;
					break;
				}
				case res.toggleMute: {
					document.getElementsByClassName("ytp-mute-button")[0].click();
					break;
				}
				case res.forceNext: {
					forceNext = true;
					break;
				}
				case res.toggle: {
					toggleVideo();
					break;
				}
				case (typeof res.scroll == "number"): {
					if (!hidden)
					{
						hidden = true;
						video.pause();
					}
					video.currentTime = res.scroll;
					break;
				}
				case res.scrollingFinished:
				{
					pic_for_preview = null;
					hidden = false;
					toggleVideo();
					break;
				}
				case (typeof res.volume == "number"): {
					video.volume = res.volume;
					break;
				}
			}
		});
		if (preview_making > 0)
		{
			preview_making++;
			return true;
		}
		//chrome.runtime.sendMessage({ new_image: c.toDataURL("image/png"), width: video.videoWidth, height: video.videoHeight, duration: video.duration, now: video.currentTime });
		if (video.duration >= 1.5 && passed_by >= 60 && (video.currentTime == video.duration || forceNext))
		{
			video.pause();
			video.muted = true;
			preview_making++;
			video.currentTime = video.duration - 1.5;
			video.play();
			setTimeout(function() {
				if (playlist >= 0)
				{
					chrome.runtime.sendMessage({ playingPlaylist: true });
					window.location.href = document.querySelector("li[data-index='" + playlist + "']").getElementsByTagName("a")[0].href + "&vq=medium&autoplay=1&play_small";
					return false;
				}
				if (document.getElementsByClassName("ytp-upnext")[0].getAttribute("aria-label"))
				{
					video.pause();
					var to_send = {
						endedButContinuous: true,
						name: document.getElementsByClassName("ytp-upnext-title")[0].innerText
					};
					next_link = document.getElementsByClassName("ytp-upnext-autoplay-icon")[0].href + "&vq=medium&autoplay=1&play_small";
					console.log("Will play:", next_link);
					chrome.runtime.sendMessage(to_send);
					upnextTimeout = setTimeout(function(link) {
						console.log("Playing next now...");
						if (document.getElementsByClassName("ytp-upnext-autoplay-icon")[0].href)
							next_link = document.getElementsByClassName("ytp-upnext-autoplay-icon")[0].href + "&vq=medium&autoplay=1&play_small";
						window.location.href = next_link;
					}, 9000, to_send.link);
				} else {
					console.log("Ended.");
					clearInterval(interval);
					//return false;
					chrome.runtime.sendMessage({ ended: true });
				}
			}, 2000);
		}
	}, 50);
}
loadScript();

function changeQuality(quality)
{
	quality = quality == "hd" ? 480 : (quality == "low" ? 240 : 360);
	if (!document.getElementById("ytp-main-menu-id"))
		document.getElementsByClassName("ytp-settings-button")[0].click();
	if (!document.getElementsByClassName("ytp-settings-button")[0])
	{
		setTimeout(changeQuality, 500);
		return false;
	}
	document.getElementsByTagName("video")[0].play();
	if (!document.getElementById("ytp-main-menu-id"))
		document.getElementsByClassName("ytp-settings-button")[0].click();
	var elements = document.getElementById("ytp-main-menu-id").getElementsByClassName("ytp-menuitem");
	for (var i = 0; i < elements.length; i++)
		if (/(quality)|(\d+p)/gi.test(elements[i].innerText))
			elements = [ elements[i] ];
	var itext = (elements[elements.length - 1] || { innerText: "" + quality }).innerText;
	console.log("Itext:", itext);
	if (+itext.match(/\d+/gi) != quality)
	{
		document.getElementsByClassName("ytp-settings-button")[0].click();
		elements[elements.length - 1].click();
		var ems = document.querySelectorAll(".ytp-quality-menu .ytp-menuitem");
		for (var i = 0; i < ems.length; i++)
			if (new RegExp(quality).test((ems[i] || {}).innerText))
				ems[i].click();
		if (!document.getElementById("ytp-main-menu-id"))
			document.getElementsByClassName("ytp-settings-button")[0].click();
		console.log("New itext:", document.getElementById("ytp-main-menu-id").getElementsByClassName("ytp-menuitem")[3].innerText);
	}
	return true;
}

function toggleVideo()
{
	document.getElementsByClassName("ytp-play-button")[0].click();
	setTimeout(document.getElementsByClassName("ytp-settings-button")[0].click, 500);
}
function egg() {return "ZGouc21hZ29sZEBnbWFpbC5jb20=";}//b64

function getFullTime(time)
{
	time = parseInt(time);
	var hours = "0" + ~~(time / 3600);
	var minutes = "0" + ~~((time % 3600) / 60);
	var seconds = "0" + time % 60;
	return (hours > 0 ? hours.substr(-2) + ":" : "") + minutes.substr(-2) + ":" + seconds.substr(-2);
}