var paused = false, scrolling = false, scrollingVolume = false, upnext = false, moved = false, resizing = -1, first_run = true, hidden = false, forceNext = false, scrollbar = 0, last_url = "", ratio = 0.5, settings_hovered = false, scrollingOpacity = false;
var image = null, interval = null;

log("Video player initialization...");

function initPlayer() {
	if (document.getElementById("YouTubeVideo"))
	{
		//document.getElementById("YouTubeVideo").style.display = "block";
		return true;
	}
	log("Second init step...");
	chrome.runtime.onMessage.removeListener(backgroundListener);
	chrome.runtime.onMessage.addListener(backgroundListener);

	var block = document.createElement("div");
	block.id = "YouTubeVideo";
	block.setAttribute("data-width", 300);

	scrollbar = getScrollbarWidth();

	/*block.onmouseover =  function() {
		var img = this.children[0];
		this.style.width = 430 + "px";
		this.style.height = (+document.body.getAttribute("data-video-height") / (+document.body.getAttribute("data-video-width")) * 430 || 215) + "px";
	};
	block.onmouseleave = function() {
		setTimeout(function(ths) {
			var img = ths.children[0];
			ths.style.width = 300 + "px";
			ths.style.height = (+document.body.getAttribute("data-video-height") / (+document.body.getAttribute("data-video-width")) * 300 || 150) + "px";
		}, 150, this);
	};*/
	block.onmousedown = function(e) {
		if (e.target.id != "YouTubeVideoControls")
			return true;
		e.preventDefault();
		moved = true;
		block.setAttribute("data-last-x", e.clientX);
		block.setAttribute("data-last-y", e.clientY);
		block.setAttribute("data-last-height", block.offsetHeight + (/without_featured/.test(document.getElementById("YouTubeVideo").className) ? 0 : 60));
		setTimeout(function() {
			if (moved)
			{
				block.classList.add("moving");
			}
		}, 150);
		return false;
	};
	/*block.onmouseleave = function(e) {
		if (moved)
		{
			savePlayer();
			setTimeout(function() { document.getElementById("YouTubeVideo").classList.remove("moving"); }, 100);
			moved = false;
		}
	};*/
	block.onclick = function(e) {
		if (/moving/.test(this.className))
		{
			block.classList.remove("moving");
			return false;
		}
		if (e.target.id == "YouTubeVideoControls")
		{
			e.preventDefault();
			toggleVideo();
			document.getElementById("YouTubePlayPauseFading").classList.add("animate");
			setTimeout(function() {
				document.getElementById("YouTubePlayPauseFading").classList.remove("animate");
			}, 500);
			return false;
		}
	};
	block.innerHTML =   '<div id="YouTubeFeaturedVideosBlock"><div id="YouTubeFeaturedVideosFeed"></div><div class="YouTubeFeaturedBlockShade"></div><div class="YouTubeFeaturedBlockShade rightSide"></div></div>' + 
						'<img onerror="this.style.opacity=0;" onload="this.style.opacity = +document.body.getAttribute(\'data-video-opacity\') || 1;">' +
						'<div id="YouTubeVideoControls">' +
							'<a id="YouTubeVideoName" href="" target="_blank"></a>' +
							'<p id="YouTubeClosePlayer"></p>' +
							'<div id="YouTubeVideoControlsPanel">' +
								'<div id="YouTubeVideoScrollBox"><div id="YouTubeVideoScroll"><p></p><p class="YouTubeNow"></p></div></div>' +
								'<p id="YouTubeVideoToggle" class="YouTubeButtons"></p>' +
								'<div id="YouTubeNextVideo"></div>' + 
								'<div id="YouTubeVideoSound" class="YouTubeButtons"><div id="YouTubeVideoSoundScroll"><p></p></div></div>' +
								'<div id="YouTubeTiming">00:00 / 00:00</div>' +
								'<a id="YouTubeLogo" href="" target="_blank"></a>' +
								'<div id="YouTubeSettingsButton"></div>' +
								'<div id="YouTubeFeaturedVideosTrigger"></div>' +
								'<div id="YouTubeSettingsPanel">' +
									'<div><p>Autoplay</p><div id="YouTubeAutoNext"><p></p></div></div>' +
									'<div><p>Opacity</p><div id="YouTubeVideoBlockOpacityScroll"><p></p></div></div>' +
									'<div><p>Speed</p><div id="YouTubeVideoSpeedChoice"><p data-speed-choice="0.25">0.25</p><p data-speed-choice="0.5">0.5</p><p data-speed-choice="1" class="choosen">Normal</p><p data-speed-choice="1.25">1.25</p><p data-speed-choice="1.5">1.5</p><p data-speed-choice="2">2</p></div></div>' +
									'<div><p>Quality</p><div id="YouTubeVideoQualityChoice"><p data-quality-choice="low">Low</p><p data-quality-choice="medium" class="choosen">Medium</p><p data-quality-choice="hd">HD</p></div></div>' +
								'</div>' +
							'</div>' +
						'</div>' +
						'<div id="YouTubePlayPauseFading"></div>' +
						'<div class="YouTubeResizeElement"></div><div class="YouTubeResizeElement YREBottom" style="cursor: nesw-resize;"></div><div class="YouTubeResizeElement YREBottom" style="left: initial; right: 0;"></div>' +
						'<div id="YouTubeUpNext"><span>Playing next:</span><p></p><div id="YouTubeUpNextPlay"></div><button id="CancelUpNext">Cancel</button></div>' +
						'<div id="YouTubeRepeat">Repeat?<div id="YouTubeRepeatButton"></div><button id="CancelRepeat">Cancel</button></div>' +
						'<div id="YouTubeFeaturedVideosTooltip"><p><span></span></p><span></span></div>';
	document.body.appendChild(block);
	block.classList.add("without_featured");
	setTimeout(initEvents, 500);
};

function checkDocument()
{
	if (document.body)
		initPlayer();
	else
		setTimeout(checkDocument, 50);
}

// RUN SCRIPT:

checkDocument();

function initEvents() {
	document.getElementById("YouTubeVideo").ondragstart = function() { return false; } 
	document.getElementById("YouTubeClosePlayer").onclick = function() {
		document.body.removeChild(document.getElementById("YouTubeVideo"));
		chrome.runtime.sendMessage({ close: true });
	};
	document.getElementById("YouTubeVideoToggle").onclick = function() {
		toggleVideo();
	};
	document.getElementById("YouTubeVideoSound").onclick = function(e) {
		if (e.target.id == "YouTubeVideoSound")
		{
			chrome.runtime.sendMessage({ toggleMute: true });
			if (paused)
			{
				if (/muted/.test(document.getElementById("YouTubeVideo").className))
					document.getElementById("YouTubeVideo").classList.remove("muted");
				else
					document.getElementById("YouTubeVideo").classList.add("muted");
			}
		}
	}

	document.getElementById("YouTubeVideoScrollBox").onmousedown = function(e) { 
		scrolling = true;
		document.getElementById("YouTubeVideo").classList.add("scrolling");
		scrollVideo(e);
	};
	document.body.addEventListener("mousemove", function(e) {
		if (resizing >= 0)
		{
			e.preventDefault();
			var block = document.getElementById("YouTubeVideo");
			log("Resizing");
			var old_width = block.offsetWidth || 300,
				old_height = block.offsetHeight || 150,
				bounds = block.getBoundingClientRect() || { left: window.innerWidth - old_width - 6, top: 6 }; //{ left: +block.getAttribute("data-start-x") };
			var ft = document.getElementById("YouTubeFeaturedVideosFeed")
				new_ft_left = 0;
			switch (resizing) {
				case 1: { // LEFT BOTTOM CORNER
					var new_width = bounds.left - e.clientX + old_width,
						new_height = new_width * ratio;
					if (new_height > 400 || new_width < 300 || e.clientX < 6 || e.clientX + new_width + 6 > window.innerWidth || parseInt(block.style.top) + new_height + 6 > window.innerHeight)
						return false;
					block.style.width = new_width + "px";
					block.style.height = new_height + "px";
					block.style.left = e.clientX + "px";
					new_ft_left = ft.offsetLeft + (new_width - old_width) / 2;
					break;
				}
				case 2: { // RIGHT BOTTOM CORNER
					var new_width = -bounds.left - old_width + e.clientX + old_width,
						new_height = new_width * ratio;
					if (new_height > 400 || new_width < 300 || e.clientX < 6 || e.clientX + 6 > window.innerWidth || parseInt(block.style.top) + new_height + 6 > window.innerHeight)
						return false;
					block.style.width = new_width + "px";
					block.style.height = new_height + "px";
					new_ft_left = ft.offsetLeft + (new_width - old_width) / 2;
					break;
				}
				default: { // LEFT TOP CORNER
					var new_width = bounds.left - e.clientX + old_width,
						new_height = new_width * ratio,
						new_top = bounds.top + old_height - new_height;
					if (new_height > 400 || new_width < 300 || e.clientX < 6 || e.clientX + new_width + 6 > window.innerWidth || new_top < 6 || new_top + new_height + 6 > window.innerHeight)
						return false;
					block.style.width = new_width + "px";
					block.style.height = new_height + "px";
					block.style.left = e.clientX + "px";
					block.style.top = new_top + "px";
					new_ft_left = ft.offsetLeft + (new_width - old_width) / 2;
				}
			}
			var buttons = ft.parentNode.getElementsByClassName("YouTubeFeaturedBlockShade");
			if (new_ft_left > 0)
				new_ft_left = 0,
				buttons[0].style.left = -52 + "px";
			else
				buttons[0].style.left = 0 + "px";
			if (new_ft_left < -ft.offsetWidth + ft.parentNode.offsetWidth)
				new_ft_left = -ft.offsetWidth + ft.parentNode.offsetWidth,
				buttons[1].style.right = -52 + "px";
			else
				buttons[1].style.right = 0 + "px";
			ft.style.left = new_ft_left + "px";
			return false;
		}
		if (!scrolling)
			return true;
		scrollVideo(e);
		return false;
	}, false);
	document.body.addEventListener("mouseup", function(e) {
		if (resizing >= 0)
		{
			resizing = -1;
			document.getElementById("YouTubeVideo").classList.remove("resizing");
			savePlayer();
		}
		if (scrollingOpacity)
		{
			document.getElementById("YouTubeVideo").classList.remove("scrollingOpacity");
			chrome.runtime.sendMessage({ blockOpacity: +document.body.getAttribute("data-video-opacity") });
			scrollingOpacity = false;
		}
		if (moved)
		{
			moved = false;
			setTimeout(function() { document.getElementById("YouTubeVideo").classList.remove("moving"); }, 100);
			savePlayer();
		}
		if (scrolling)
		{
			chrome.runtime.sendMessage({ scrollingFinished: true });
			scrolling = false;
			document.getElementById("YouTubeVideo").classList.remove("scrolling");
		}
		if (scrollingVolume)
		{
			scrollingVolume = false;
			document.getElementById("YouTubeVideo").classList.remove("scrollingVolume");
		}
	}, false);

	document.getElementById("YouTubeVideoSoundScroll").onmousedown = function(e) { 
		scrollingVolume = true;
		document.getElementById("YouTubeVideo").classList.add("scrollingVolume");
		scrollVolume(e);
	};
	document.body.addEventListener("mousemove", function(e) {
		var block = document.getElementById("YouTubeVideo");
		if (!block)
			return false;
		if (scrollingOpacity)
		{
			scrollOpacity(e);
			return false;
		}
		if (/moving/.test(document.getElementById("YouTubeVideo").className) && moved)
		{
			e.preventDefault();
			var old_x = +block.getAttribute("data-last-x"),
				old_y = +block.getAttribute("data-last-y"),
				new_x = parseInt(block.style.left) + e.clientX - old_x,
				new_y = parseInt(block.style.top) + e.clientY - old_y;
			if (new_x < 6)
				new_x = 6;
			if (new_x > window.innerWidth - block.offsetWidth - scrollbar - 6)
				new_x = window.innerWidth - block.offsetWidth - scrollbar - 6;
			if (new_y < 6)
				new_y = 6;
			if (new_y > window.innerHeight - block.getAttribute("data-last-height") - 6)
				new_y = window.innerHeight - block.getAttribute("data-last-height") - 6;
			block.style.left = new_x + "px";
			block.style.top = new_y + "px";
			block.setAttribute("data-last-x", e.clientX);
			block.setAttribute("data-last-y", e.clientY);
			return false;
		}
		if (!scrollingVolume)
			return true;
		scrollVolume(e);
		return false;
	}, false);
	document.getElementById("CancelUpNext").onclick = function() {
		chrome.runtime.onMessage.removeListener(backgroundListener);
		upnext = false;
		//document.getElementById("YouTubeVideo").classList.remove("upnext");
		document.getElementById("YouTubeVideo").style.top = -(document.getElementById("YouTubeVideo").offsetHeight + 10) + "px";
		chrome.runtime.sendMessage({ cancelUpNext: true });
		setTimeout(function() {
			document.body.removeChild(document.getElementById("YouTubeVideo"));
		}, 500);
	};
	document.getElementById("YouTubeLogo").onclick = document.getElementById("YouTubeVideoName").onclick = function() {
		chrome.runtime.sendMessage({ toggleVideoHide: true });
	};
	document.getElementById("YouTubeAutoNext").onclick = function() {
		if (/enabled/.test(this.className))
			this.classList.remove("enabled");
		else
			this.classList.add("enabled");
		chrome.runtime.sendMessage({ toggleAutoNext: true });
	};
	document.getElementById("YouTubeRepeatButton").onclick = function() {
		chrome.runtime.sendMessage({ repeatVideo: true });
	};
	document.getElementById("CancelRepeat").onclick = function() {
		log("Removing the video block.");
		document.getElementById("YouTubeVideo").style.top = -(document.getElementById("YouTubeVideo").offsetHeight + 10) + "px";
		setTimeout(function() {
			document.body.removeChild(document.getElementById("YouTubeVideo"));
		}, 500);
		return false;
	};
	document.getElementById("YouTubeUpNextPlay").onclick = function(e) {
		e.preventDefault();
		chrome.runtime.sendMessage({ startNext: true });
		this.style.opacity = 0;
		return false;
	};
	document.getElementById("YouTubeVideoSound").onmouseover = function() {
		if (+document.getElementById("YouTubeVideo").offsetWidth < 331 && document.getElementById("YouTubeTiming").offsetWidth > 75)
			document.getElementById("YouTubeVideo").classList.add("hideautoplay");
	};
	document.getElementById("YouTubeVideoSound").onmouseleave = function() {
		document.getElementById("YouTubeVideo").classList.remove("hideautoplay");
	};
	document.getElementById("YouTubeNextVideo").onclick = function() {
		forceNext = true;
		chrome.runtime.sendMessage({ forceNext: true });
	};
	document.getElementById("YouTubeSettingsButton").onclick = function() {
		if (/settings/.test(document.getElementById("YouTubeVideo").className))
		{
			settings_hovered = false;
			toggleSettings(false);
			return false;
		}
		updateSettings();
		settings_hovered = true;
		toggleSettings(true);
		setTimeout(function() {
			if (!settings_hovered)
				toggleSettings(false);
		}, 2000);
		return false;
	};
	document.getElementById("YouTubeFeaturedVideosTrigger").onclick = function() {
		var is_ft = /without_featured/.test(document.getElementById("YouTubeVideo").className);
		chrome.runtime.sendMessage({ toggleRelated: !is_ft });
		document.getElementById("YouTubeVideo").classList[is_ft ? "remove" : "add"]("without_featured");
		return false;
	};
	document.getElementById("YouTubeSettingsButton").onmouseleave = function() {
		setTimeout(function() {
			if (!settings_hovered)
				toggleSettings(false);
		}, 2000);
	};
	document.getElementById("YouTubeSettingsPanel").onmouseover = function() {
		settings_hovered = true;
	};
	document.getElementById("YouTubeSettingsPanel").onmouseleave = function() {
		settings_hovered = false;
		setTimeout(function() {
			if (!settings_hovered)
				toggleSettings(false);
		}, 1000);
	};
	document.getElementById("YouTubeVideo").onmouseleave = function() {
		settings_hovered = false;
		toggleSettings(false);
	};
	document.getElementById("YouTubeVideoBlockOpacityScroll").onmousedown = function(e) { 
		scrollingOpacity = true;
		document.getElementById("YouTubeVideo").classList.add("scrollingOpacity");
		scrollOpacity(e);
	};
	document.getElementById("YouTubeVideoSpeedChoice").onclick = function(e) {
		if (e.target.tagName != "P" || /choosen/.test(e.target.className))
			return false;
		e.target.parentNode.getElementsByClassName("choosen")[0].classList.remove("choosen");
		e.target.classList.add("choosen");
		chrome.runtime.sendMessage({ newVideoSpeed: +e.target.getAttribute("data-speed-choice") });
		return false;
	};
	document.getElementById("YouTubeVideoQualityChoice").onclick = function(e) {
		if (e.target.tagName != "P" || /choosen/.test(e.target.className))
			return false;
		e.target.parentNode.getElementsByClassName("choosen")[0].classList.remove("choosen");
		e.target.classList.add("choosen");
		chrome.runtime.sendMessage({ newVideoQuality: e.target.getAttribute("data-quality-choice") });
		return false;
	};
	var resizes = document.getElementById("YouTubeVideo").getElementsByClassName("YouTubeResizeElement");
	for (var i = 0; i < resizes.length; i++)
		initResizer(resizes[i]);
	log("Initialization done!");
}

function toggleVideo() {
	chrome.runtime.sendMessage({ toggleVideo: true });
}

function toggleSettings(toggle) {
	if (toggle) {
		document.getElementById("YouTubeSettingsPanel").style.visibility = "visible";
		document.getElementById("YouTubeVideo").classList.add("settings");
	} else {
		if (scrollingOpacity)
			return false;
		setTimeout(function() {
			document.getElementById("YouTubeSettingsPanel").style.visibility = "hidden";
		}, 200);
		document.getElementById("YouTubeVideo").classList.remove("settings");
	}
}

function initResizer(ths)
{
	ths.onmousedown = function(e) {
		e.preventDefault();
		document.getElementById("YouTubeVideo").classList.add("resizing");
		document.getElementById("YouTubeVideo").setAttribute("data-start-x", e.clientX);
		document.getElementById("YouTubeVideo").setAttribute("data-start-y", e.clientY);
		for (var i = 0; i < 3; i++)
			if (this.parentNode.getElementsByClassName("YouTubeResizeElement")[i] == this)
				resizing = i;
	};
}

function scrollVideo(e)
{
	e.preventDefault();
	var left = e.pageX - document.getElementById("YouTubeVideoScrollBox").getBoundingClientRect().left,
		pc = left / document.getElementById("YouTubeVideoScrollBox").offsetWidth * 100;
	if (pc < 0)
		pc = 0;
	if (pc > 100)
		pc = 100;
	document.getElementById("YouTubeVideoScroll").children[1].style.width = pc + '%';
	chrome.runtime.sendMessage({ scrollMoving: pc / 100 });
	return false;
}

function scrollVolume(e) {
	e.preventDefault();
	var left = e.pageX - document.getElementById("YouTubeVideoSoundScroll").getBoundingClientRect().left,
		pc = left / document.getElementById("YouTubeVideoSoundScroll").offsetWidth * 100;
	if (pc < 0)
		pc = 0;
	if (pc > 100)
		pc = 100;
	document.getElementById("YouTubeVideoSoundScroll").children[0].style.width = pc + '%';
	chrome.runtime.sendMessage({ volume: pc / 100 });
	return false;
}

function scrollOpacity(e) {
	e.preventDefault();
	var left = e.pageX - document.getElementById("YouTubeVideoBlockOpacityScroll").getBoundingClientRect().left,
		pc = left / document.getElementById("YouTubeVideoBlockOpacityScroll").offsetWidth * 100;
	if (pc < 10)
		pc = 10;
	if (pc > 100)
		pc = 100;
	document.getElementById("YouTubeVideoBlockOpacityScroll").children[0].style.width = pc + '%';
	document.getElementById("YouTubeVideo").getElementsByTagName("img")[0].style.opacity = pc / 100;
	document.body.setAttribute('data-video-opacity', pc / 100);
	return false;
}

function savePlayer()
{
	var block = document.getElementById("YouTubeVideo"),
		cors = block.getBoundingClientRect();
	chrome.runtime.sendMessage({ reposition: [ cors.left, cors.top ], size: [ block.offsetWidth, block.offsetHeight ] });
}

function setBlockSize()
{
	chrome.runtime.sendMessage({ get_size: true }, function(res) {
		if (!res.work)
			return false;
		document.body.classList.remove("SidePlayerLoading");
		log("Setting size.");
		var block = document.getElementById("YouTubeVideo");
		block.getElementsByTagName("img")[0].style.opacity = res.opacity || 1;
		document.body.setAttribute('data-video-opacity', res.opacity || 1);
		document.getElementById("YouTubeVideoBlockOpacityScroll").children[0].style.width = (res.opacity || 1) * 100 + '%';
		if (res.empty)
		{
			block.style.width = 360 + "px";
			block.style.height = 360 * ratio + "px";
			block.style.left = window.innerWidth - 360 - 6 + "px";
			block.style.top = 6 + "px";
			//block.style.height = 150 + "px";
		} else {
			if (res.width > 800 || res.height > 400)
				res.width = 360, res.height = 180;
			block.style.width = res.width + "px";
			block.style.height = res.width * ratio + "px";
			if (res.x + res.width + scrollbar > window.innerWidth)
				block.style.left = window.innerWidth - scrollbar - res.width - 6 + "px";
			else
				block.style.left = res.x + "px";
			if (res.y + res.height > window.innerHeight)
				block.style.top = window.innerHeight - res.height - 6 + "px";
			else
				block.style.top = res.y + "px";
		}
		block.style.display = hidden ? "none" : "block";
	});
}

function updateSettings() {
	chrome.runtime.sendMessage({ get_settings: true }, function(res) {
		// Video opacity
		document.getElementById("YouTubeVideo").getElementsByTagName("img")[0].style.opacity = res.opacity || 1;
		document.body.setAttribute('data-video-opacity', res.opacity || 1);
		document.getElementById("YouTubeVideoBlockOpacityScroll").children[0].style.width = (res.opacity || 1) * 100 + '%';
		// Playback rate (speed)
		var ps = document.getElementById("YouTubeVideoSpeedChoice").getElementsByTagName("p"), found = false;
		for (var i = 0; i < ps.length; i++) {
			if (+ps[i].getAttribute("data-speed-choice") == +res.videoSpeed)
			{
				ps[i].click();
				found = true;
				break;
			}
		};
		if (!found)
			ps[2].click();
		// Video quality
		ps = document.getElementById("YouTubeVideoQualityChoice").getElementsByTagName("p"), found = false;
		for (var i = 0; i < ps.length; i++) {
			if (ps[i].getAttribute("data-quality-choice") == res.videoQuality)
			{
				ps[i].click();
				found = true;
				break;
			}
		};
		if (!found)
			ps[1].click();
	});
}

function updateBlockSize(x, y, width, height, opacity)
{
	if (resizing >= 0 || moved || scrollingOpacity || /moving/.test(document.getElementById("YouTubeVideo").className))
		return false;
	var block = document.getElementById("YouTubeVideo");
	block.getElementsByTagName("img")[0].style.opacity = opacity || 1;
	document.body.setAttribute('data-video-opacity', opacity || 1);
	document.getElementById("YouTubeVideoBlockOpacityScroll").children[0].style.width = (opacity || 1) * 100 + '%';
	if (parseInt(block.style.left) == x &&
		parseInt(block.style.top) == y &&
		block.offsetWidth == width &&
		block.offsetHeight == height)
		return false;
	if (width > 800 || height > 400)
		width = 300, height = 150;
	block.style.width = width + "px";
	block.style.height = height + "px";
	if (x + width + scrollbar > window.innerWidth)
		block.style.left = window.innerWidth - width - scrollbar - 6 + "px";
	else
		block.style.left = x + "px";
	if (y + height > window.innerHeight)
		block.style.top = window.innerHeight - height - 6 + "px";
	else
		block.style.top = y + "px";
	return true;
}

function moveCircle(count)
{
	if (!/upnext/.test(document.getElementById("YouTubeVideo").className))
	{
		document.getElementById("YouTubeUpNextPlay").style.backgroundImage = "";
		return false;
	}
	if (typeof count != "number")
		count = 293;
	else
		count += 0.5;
	// 293 - 586
	document.getElementById("YouTubeUpNextPlay")
						.style.backgroundImage ='url(\'data:image/svg+xml;utf8,<svg height="100%" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 98 98" width="100%"><circle class="ytp-svg-autoplay-circle" cx="49" cy="49" fill="#000" fill-opacity="0.8" r="48"></circle><circle class="ytp-svg-autoplay-ring" cx="-49" cy="49" fill-opacity="0" r="46.5" stroke="#FFFFFF" stroke-dasharray="293"' +
	' stroke-dashoffset="-' + count + '" ' +
												'stroke-width="4" transform="rotate(-90)"></circle><polygon class="ytp-svg-autoplay-triangle" fill="#fff" points="32,27 72,49 32,71"></polygon></svg>\')';
	if (count < 586)
		setTimeout(moveCircle, 7000 / (293 * 2), count);
	else
		document.getElementById("YouTubeUpNextPlay").style.opacity = 0;
	return true;
}

function backgroundListener(request, sender, sendResponse) {
	if (request.endedButContinuous)
	{
		if (/upnext/.test(document.getElementById("YouTubeVideo").className))
			return false;
		document.getElementById("YouTubeUpNext").children[1].innerHTML = request.name.substr(0, 66);
		document.getElementById("YouTubeUpNext").style.visibility = "hidden";
		document.getElementById("YouTubeUpNext").style.display = "block";
		document.getElementById("YouTubeUpNextPlay").style.backgroundImage = "";
		document.getElementById("YouTubeUpNextPlay").style.opacity = "1";
		if (document.getElementById("YouTubeVideo").offsetHeight / 2 > 100)
		{
			var b_size = document.getElementById("YouTubeUpNextPlay").offsetHeight;
			document.getElementById("YouTubeUpNextPlay").style.marginTop = Math.floor(document.getElementById("YouTubeVideo").offsetHeight - document.getElementById("YouTubeUpNext").children[0].offsetHeight - document.getElementById("YouTubeUpNext").children[1].offsetHeight - 35 - 41 - b_size) / 2 + "px";
		}
		document.getElementById("YouTubeUpNext").style.visibility = "";
		document.getElementById("YouTubeUpNext").style.display = "";
		document.getElementById("YouTubeVideo").classList.add("upnext");
		moveCircle();
		upnext = true;
		if (!/enabled/.test(document.getElementById("YouTubeAutoNext").className) && !forceNext)
		{
			chrome.runtime.onMessage.removeListener(backgroundListener);
			/*chrome.runtime.sendMessage({ close: true });
			document.getElementById("YouTubeVideo").style.top = -(document.getElementById("YouTubeVideo").offsetHeight + 10) + "px";
			setTimeout(function() {
				document.body.removeChild(document.getElementById("YouTubeVideo"));
			}, 500);*/
			document.getElementById("YouTubeVideo").classList.remove("upnext");
			document.getElementById("YouTubeVideo").classList.add("repeat");
		}
		return true;
	}
	if (request.relatedVideos)
	{
		var r_block = document.getElementById("YouTubeFeaturedVideosFeed"),
			timeout = 10;
		if (r_block.children.length > 0)
		{
			if (r_block.children[0].href == request.relatedVideos[0].url && r_block.children[2].href == request.relatedVideos[2].url)
				return false;
			timeout = 1000,
			r_block.style.left = -r_block.offsetWidth + "px";
		}
		setTimeout(function() {
			r_block.classList.add("loseanims");
			r_block.style.left = r_block.parentNode.offsetWidth + "px";
			r_block.innerHTML = "";
			var m = request.relatedVideos;
			for (var i = 0; i < m.length; i++) {
				var a = document.createElement("a");
				a.innerHTML = '<p>' + m[i].duration + '</p>';
				a.href = m[i].url;
				a.setAttribute("data-video-name", m[i].name);
				a.className = "YouTubeFeaturedVideoItems";
				a.style.backgroundImage = 'url(\'' + m[i].img + '\')';
				a.addEventListener("mouseover", function() {
					this.hovered = true;
					var tlp = document.getElementById("YouTubeFeaturedVideosTooltip");
					tlp.children[0].children[0].style.marginLeft = 0 + "px";
					//tlp.children[0].children[0].waitSomeTime = 0;
					tlp.classList.remove("YFVScroll");
					tlp.children[0].children[0].innerText = this.getAttribute("data-video-name");
					setTimeout(function(ths) {
						if (!ths.hovered)
							return false;
						var tlp = document.getElementById("YouTubeFeaturedVideosTooltip");
						if (tlp.children[0].offsetWidth >= 153)
						{
							var saved_state = tlp.innerHTML;
							tlp.innerHTML = "";
							tlp.innerHTML = saved_state;
							tlp.classList.add("YFVScroll");
							var seconds = tlp.innerText.length * 0.175;
							tlp.children[0].children[0].style["animation"] = "ticker " + seconds + "s 1s linear 1, ticker2 " + (seconds + 1) + "s " + (seconds + 1) + "s linear infinite";
							//tlp.children[0].children[0].style["transform"] = "translateX(0%)";
							//tlp.children[0].children[0].waitInterval = 1;
							/*interval = setInterval(function(ths) {
								if (!/showTooltip/.test(ths.parentNode.parentNode.className))
								{
									clearInterval(interval);
									interval = null;
									ths.style.marginLeft = 0 + "px";
									ths.chooseSide = -1;
									return false;
								}
								if (!ths.chooseSide)
									ths.chooseSide = -1;
								if ((parseInt(ths.style.marginLeft || 0) + ths.offsetWidth <= 153 || parseInt(ths.style.marginLeft) > 0) && !ths.waitInterval)
								{
									ths.chooseSide = -ths.chooseSide,
									ths.waitInterval = 1;
									return true;
								}
								if (ths.waitInterval > 0)
								{
									ths.waitInterval++;
									if (ths.waitInterval > 25)
										ths.waitInterval = 0;
									else
										return true;
								}
								ths.style.marginLeft = parseInt(ths.style.marginLeft || 0) + ths.chooseSide + "px";
								

								if (!ths.waitSomeTime)
									ths.waitSomeTime = 1;
								if (ths.waitSomeTime < 15)
								{
									ths.waitSomeTime++;
									return;
								}
								ths.style.marginLeft = parseInt(ths.style.marginLeft || 0) - 1 + "px";
								if (-parseInt(ths.style.marginLeft || 0) == ths.offsetWidth)
									ths.style.marginLeft = ths.parentNode.offsetWidth + "px";
							}, 70, tlp.children[0].children[0]);*/
						}
						tlp.style.left = ths.offsetLeft + ths.parentNode.offsetLeft - tlp.offsetWidth / 2 + ths.offsetWidth / 2 + "px";
						if (parseInt(tlp.style.left) + tlp.offsetWidth > r_block.parentNode.offsetWidth)
						{
							tlp.children[1].style.left = tlp.offsetWidth / 2 + parseInt(tlp.style.left) - (r_block.parentNode.offsetWidth - tlp.offsetWidth) + "px";
							tlp.style.left = r_block.parentNode.offsetWidth - tlp.offsetWidth + "px";
						} else
							tlp.children[1].style.left = "50%";
						tlp.classList.add("showTooltip");
					}, 500, this)
				});
				a.addEventListener("mouseleave", function() {
					var tlp = document.getElementById("YouTubeFeaturedVideosTooltip");
					clearInterval(interval);
					tlp.children[0].children[0].chooseSide = -1;
					tlp.children[0].children[0].waitInterval = 0;
					if (/showTooltip/.test(tlp.className))
					{
						tlp.classList.remove("showTooltip");
						setTimeout(function(ths) { ths.style.left = "-100%"; }, 150, tlp);
					}
					this.hovered = false;
				});
				r_block.appendChild(a);
			};
			document.getElementById("YouTubeVideo").classList.remove("without_featured");
			setTimeout(initRelatedVideosEvents, 500);
		}, timeout);
		return true;
	}
	if (request.ended)
	{
		if (/upnext/.test(document.getElementById("YouTubeVideo").className))
			return false;
		chrome.runtime.onMessage.removeListener(backgroundListener);
		/*log("Removing the video block.");
		document.getElementById("YouTubeVideo").style.top = -(document.getElementById("YouTubeVideo").offsetHeight + 10) + "px";
		document.getElementById("YouTubeVideo").classList.remove("upnext");
		setTimeout(function() {
			document.body.removeChild(document.getElementById("YouTubeVideo"));
		}, 500);*/
		document.getElementById("YouTubeVideo").classList.add("repeat");
		return false;
	}
	if (request.updated_image)
	{
		image.src = request.updated_image;
		document.getElementById("YouTubeTiming").innerHTML = request.currentTime;
		if (request.x)
			updateBlockSize(request.x, request.y, request.width, request.height, request.opacity);
		return false;
	}
	if (typeof request.forceHide == "boolean")
	{
		hidden = !hidden;
		document.getElementById("YouTubeVideo").style.display = hidden ? "none" : "block";
	}
	if (request.image)
	{
		ratio = +request.ratio;
		if (first_run || last_url != request.url)
		{
			if (request.hidden)
				hidden = true;
			document.getElementById("YouTubeVideo").classList.remove("repeat");
			document.getElementById("YouTubeVideoName").innerText = request.name;
			setBlockSize();
			first_run = false;
			if (!request.block_width && document.getElementById("YouTubeVideo").offsetWidth > 300)
			{
				document.getElementById("YouTubeVideo").setAttribute("data-width", 300);
				document.getElementById("YouTubeVideo").style.width = 300;
			}
			document.getElementById("YouTubeVideo").style.height = ratio * (+document.getElementById("YouTubeVideo").getAttribute("data-width") || document.getElementById("YouTubeVideo").offsetWidth) + "px";
		}
		if (!image)
			image = document.getElementById("YouTubeVideo").getElementsByTagName("img")[0];
		if (forceNext && last_url != request.url)
		{
			forceNext = false;
		}

		last_url = request.url;

		if (!forceNext)
		{
			if (!paused)
			{
				if (request.muted)
					document.getElementById("YouTubeVideo").classList.add("muted");
				else
					document.getElementById("YouTubeVideo").classList.remove("muted");
			} else {
				document.getElementById("YouTubeVideoToggle").style.backgroundImage = 'url(' + "'" + 'data:image/svg+xml;utf8,<svg width="100%" height="100%"  style="filter: drop-shadow(0px 0px 1px rgba(0, 0, 0, 0.5));" viewBox="0 0 36 36" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><path id="ytp-2" fill="#FFFFFF" d="M 11 10 L 17 10 L 17 26 L 11 26 M 20 10 L 26 10 L 26 26 L 20 26"><animate attributeType="XML" attributeName="d" fill="freeze" from="M11,10 L18,13.74 18,22.28 11,26 M18,13.74 L26,18 26,18 18,22.28" to="M11,10 L17,10 17,26 11,26 M20,10 L26,10 26,26 20,26" dur="0.2s" keySplines=".4 0 1 1" repeatCount="1"></animate></path></defs><use xlink:href="#ytp-2" class="ytp-svg-shadow"></use><use xlink:href="#ytp-2" class="ytp-svg-fill-' + parseInt(Math.random()*500) + '"></use></svg>' + "'" + ')';
				setTimeout(function() {
					document.getElementById("YouTubeVideo").classList.remove("paused");
				}, 500);
				paused = false;
			}
		}
		if ((upnext || /upnext/.test(document.getElementById("YouTubeVideo").className)) && request.now != request.duration)
		{
			upnext = false;
			document.getElementById("YouTubeVideo").classList.remove("upnext");
		}
		if (request.hidden)
		{
			hidden = true;
			document.getElementById("YouTubeVideo").style.display = "none";
		} else if (hidden) {
			document.getElementById("YouTubeVideo").style.display = "block";
			hidden = false;
		}
		document.getElementById("YouTubeAutoNext").className = request.autonext ? "enabled" : "";
		/*if (request.timing.match(/:/gi).length > 2)
			document.getElementById("YouTubeTiming").style.fontSize = "8px";*/
		if (request.x)
			updateBlockSize(request.block_x, request.block_y, request.block_width, request.block_height, request.opacity);
		if (!isNaN(parseInt(request.timing)))
			document.getElementById("YouTubeTiming").innerHTML = request.timing;
		document.getElementById("YouTubeVideoScroll").children[0].style.width = request.loaded + '%';

		var video_url = request.url.split('&t')[0] + "&t=" + parseInt(request.now);
		document.getElementById("YouTubeVideoName").href = video_url;
		document.getElementById("YouTubeLogo").href = video_url;
		
		if (!scrolling)
		{
			document.getElementById("YouTubeVideoSoundScroll").children[0].style.width = +request.volume * 100 + '%';
			document.getElementById("YouTubeVideoScroll").children[1].style.width = request.now / request.duration * 100 + '%';
		}
		if (!document.body.getAttribute("data-video-width") && request.height)
		{
			document.body.setAttribute("data-video-width", request.width);
			document.body.setAttribute("data-video-height", request.height);
			document.body.setAttribute("data-video-scale", request.height / request.width);
		}
		image.src = request.image; // URL.createObjectURL(dataURItoBlob(request.image));
		if (!image.parentNode.style.height)
		{
			image.parentNode.style.height = ratio * (+image.parentNode.getAttribute("data-width")) + "px";
		}
	}
	if (request.paused)
	{
		if (!paused)
		{
			document.getElementById("YouTubeVideoToggle").style.backgroundImage = 'url(' + "'" + 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100" height="100" style="filter: drop-shadow(0px 0px 1px rgba(0, 0, 0, 0.5));" viewBox="0 0 36 36" version="1.1"><defs><path id="ytp-11" fill="#FFFFFF" d="M11 10L18 13.74 18 22.28 11 26M18 13.74L26 18 26 18 18 22.28"><animate attributeType="XML" attributeName="d" fill="freeze" from="M11,10 L17,10 17,26 11,26 M20,10 L26,10 26,26 20,26" to="M11,10 L18,13.74 18,22.28 11,26 M18,13.74 L26,18 26,18 18,22.28" dur="0.2" keySplines="0.4" repeatCount="1"/></path></defs><use xlink:href="#ytp-11" class="ytp-svg-shadow"/><use xlink:href="#ytp-11" class="ytp-svg-fill-' + parseInt(Math.random()*500) + '"/></svg>' + "'" + ')';
			setTimeout(function() {
				document.getElementById("YouTubeVideo").classList.add("paused");
			}, 500);
		}
		paused = true;
	}
}

function initRelatedVideosEvents()
{
	var r_block = document.getElementById("YouTubeFeaturedVideosFeed");
	r_block.addEventListener("click", function(e) {
		if (e.target.className != "YouTubeFeaturedVideoItems" && e.target.parentNode.className != "YouTubeFeaturedVideoItems")
			return true;
		e.preventDefault();
		chrome.runtime.sendMessage({ playSideplayer: e.target.href || e.target.parentNode.href });
		return false;
	});
	var buttons = r_block.parentNode.getElementsByClassName("YouTubeFeaturedBlockShade");
	buttons[0].addEventListener("click", function(e) {
		e.preventDefault();
		var new_left = r_block.offsetLeft + this.parentNode.offsetWidth;
		buttons[1].style.right = 0 + "px";
		if (new_left > 0)
		{
			new_left = 0;
			this.style.left = -52 + "px";
		} else 
			this.style.left = 0 + "px";
		r_block.style.left = new_left + "px";
		return false;
	});
	buttons[1].addEventListener("click", function(e) {
		e.preventDefault();
		var new_left = r_block.offsetLeft - this.parentNode.offsetWidth;
		buttons[0].style.left = 0 + "px";
		if (new_left < -r_block.offsetWidth + this.parentNode.offsetWidth)
		{
			new_left = -r_block.offsetWidth + this.parentNode.offsetWidth;
			this.style.right = -52 + "px";
		} else 
			this.style.right = 0 + "px";
		r_block.style.left = new_left + "px";
		return false;
	});
	r_block.classList.remove("loseanims");
	r_block.style.width = r_block.children.length * 72 + "px";
	r_block.style.left = -r_block.offsetWidth / 2 + r_block.parentNode.offsetWidth / 2 + "px";
	r_block.style.opacity = "1";
}

function log()
{
	return false; // Comment if need debug info.
	var array = [];
	for (var i = 0; i < arguments.length; i++)
		array.push(arguments[i]);
	console.log(array.join(" "));
	return true;
}

function getScrollbarWidth() {
    var outer = document.createElement("div");
    outer.style.visibility = "hidden";
    outer.style.width = "100px";
    outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps

    document.body.appendChild(outer);

    var widthNoScroll = outer.offsetWidth;
    // force scrollbars
    outer.style.overflow = "scroll";

    // add innerdiv
    var inner = document.createElement("div");
    inner.style.width = "100%";
    outer.appendChild(inner);        

    var widthWithScroll = inner.offsetWidth;

    // remove divs
    outer.parentNode.removeChild(outer);

    return widthNoScroll - widthWithScroll;
}

function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], {type:mimeString});
}