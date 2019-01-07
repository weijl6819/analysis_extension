var win = {};

var empty = document.getElementById('empty-tabs');
chrome.storage.local.get('empty', function(el) {
	empty.checked = el.empty;
});

var tabWindows = document.getElementsByClassName('tabs__item');
for ( var i = 0; i < tabWindows.length; i++ ) {
	tabWindows[i].addEventListener('click', function() {
		windowParams(this.dataset.grid);
	});
}

function favicons() {
	chrome.windows.getCurrent({}, function(currentWin) {
		win.current = currentWin;

		chrome.tabs.getAllInWindow(currentWin.id, function(tabs) {
			win.tabs = tabs;

			for ( var k = 0; k < tabs.length; k++ ) {

				if (tabs[k].active == true) {
					win.actualTabs = [];
					win.actualTabs[0] = tabs[k];

					var i = 1, j = 1;
					while (i <= 3) {

						if (tabs[k+i]) {
							win.actualTabs[i] = tabs[k+i];
							i++;

						} else if (tabs[k-j]) {
							win.actualTabs[i] = tabs[k-j];
							j++; i++;
							
						} else { i++; }

					}
				}
			}

			for ( var i = 0; i < tabWindows.length; i++ ) {

				var tabLayouts = tabWindows[i].querySelectorAll('.tabs__layout');

				for ( var j = 0; j < tabLayouts.length; j++ ) {
					var tabFavicon = tabLayouts[j].querySelector('.tabs__favicon');
					var tabLetter = tabLayouts[j].querySelector('.tabs__tab-letter');

					if (!empty.checked) {

						if (win.actualTabs[j]) {

							tabFavicon.src = win.actualTabs[j].favIconUrl;
							tabLetter.innerHTML = win.actualTabs[j].url[win.actualTabs[j].url.indexOf('/') + 2];

						} else { tabLetter.innerHTML = 'T'; }

					} else {
						
						tabFavicon.src = '';
						tabLetter.innerHTML = 'N';

						tabFavicon = tabLayouts[0].querySelector('.tabs__favicon')
						tabLetter = tabLayouts[0].querySelector('.tabs__tab-letter');
						
						tabFavicon.src = win.actualTabs[0].favIconUrl;
						tabLetter.innerHTML = win.actualTabs[0].url[win.actualTabs[0].url.indexOf('/') + 2];
					}
				}
			}

		});
	});
}
favicons();

empty.addEventListener('click', function(){
	chrome.storage.local.set({'empty': empty.checked}, function() {});
	favicons();
});

var params = {
	top: 0,
	left: window.screen.width - window.screen.availWidth,
	offsetTop: window.screen.width - window.screen.availWidth,
	offsetLeft: window.screen.height - window.screen.availHeight,
	width: 0,
	height: 0, 
	windows: [],
	screenWidth: window.screen.availWidth,
	screenHeight: window.screen.availHeight, 
	screenFullWidth: window.screen.width,
	screenFullHeight: window.screen.height
}

function windowParams(grid) {

	params.windows = [];
	params.notUpdate = false

	switch(grid) {
		case 'x4':
			params.width = Math.round(params.screenWidth / 2);
			params.height = Math.round(params.screenHeight / 2);

			params.windows[0] = {};
			params.windows[1] = {left: params.left + params.width};
			params.windows[2] = {top: params.top + params.height + params.offsetTop};
			params.windows[3] = {
				top: params.top + params.height + params.offsetTop,
				left: params.left + params.width
			};
		break;

		case 'x2-col':
			params.width = params.screenWidth;
			params.height = Math.round(params.screenHeight / 2);

			params.windows[0] = {};
			params.windows[1] = {top: params.top + params.height + params.offsetTop};
		break;

		case 'x2-row':
			params.width = Math.round(params.screenWidth / 2);
			params.height = params.screenHeight;

			params.windows[0] = {};
			params.windows[1] = {left: params.left + params.width};
		break;

		case 'x2-70-30':
			params.width = Math.round(params.screenWidth * 0.65);
			params.height = params.screenHeight;

			params.windows[0] = {};
			params.windows[1] = {
				width: Math.round(params.screenWidth * 0.35),
				left: params.left + params.width
			};
		break;

		case 'x3-col':
			params.width = params.screenWidth;
			params.height = Math.round(params.screenHeight / 3);

			params.windows[0] = {};
			params.windows[1] = {top: params.top + params.height + params.offsetTop};
			params.windows[2] = {top: params.top + params.height * 2 + params.offsetTop};
		break;

		case 'x3':
			params.width = Math.round(params.screenWidth / 2);
			params.height = Math.round(params.screenHeight / 2);

			params.windows[0] = {
				width: params.screenWidth
			};
			params.windows[1] = {top: params.top + params.height + params.offsetTop};
			params.windows[2] = {
				top: params.top + params.height + params.offsetTop,
				left: params.left + params.width
			};
		break;

		case 'x3-row':
			params.width = Math.round(params.screenWidth / 3);
			params.height = params.screenHeight;

			params.windows[0] = {};
			params.windows[1] = {left: params.left + params.width};
			params.windows[2] = {left: params.left + params.width * 2};
		break;

		case 'x1':
			params.width = params.screenWidth;
			params.height = params.screenHeight;

			if (win.actualTabs.length > 1) {
				params.notUpdate = true
			} else {
				empty.checked ? params.notUpdate = true : params.notUpdate = false 
			}

			params.windows[0] = {};
		break;
	}
	
	windowBuild(params);
}

function windowBuild(params) {

	if (!params.notUpdate) {
		chrome.windows.update(win.current.id, {
			top: params.windows[0].top || params.top,
			left: params.windows[0].left || params.left,
			width: params.windows[0].width || params.width,
			height: params.windows[0].height || params.height,
		});
	}

	for (var i = 0; i < params.windows.length; i++) {

		var config = {
			top: params.windows[i].top || params.top,
			left: params.windows[i].left || params.left,
			width: params.windows[i].width || params.width,
			height: params.windows[i].height || params.height,
		}

		if (!empty.checked) {

			if (win.actualTabs[i]) {

				config.tabId = win.actualTabs[i].id;
				chrome.windows.create(config);
			}

		} else { chrome.windows.create(config); }
	}
}