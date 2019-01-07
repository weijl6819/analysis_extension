/** @module popup.js
 * @copyright 2013-2015 Cardinal Path.  All rights reserved.  The unauthorized use, reproduction, modification or distribution of any or all of this code is expressly prohibited.
 */
var currentTab;
var port;
document.documentElement.classList.add(navigator.userAgent.match(/Mac OS X/) ? 'mac' : 'win');
document.addEventListener('DOMContentLoaded', function() {
	chrome.tabs.query({
		active : true,
		currentWindow : true
	}, function(tabs) {
		currentTab = tabs[0].id;
		port = chrome.runtime.connect({
			name : "WASP.popup-" + currentTab
		});
		port.onMessage.addListener(function(msg) {
			if (msg['msg-type'] == 'set-tags') {
				var ul = document.querySelector('#taglist .portal ul'),
				    t,
				    dName = '',
				    dID,
				    dLI,
				    dUL,
				    dCount,
				    el1,
				    el2,
				    fLI,
				    fCount;
				//console.group('tags');
				for (var a = -1,
				    l = msg['tag-list'].length; ++a < l; ) {
					t = msg['tag-list'][a];
					if (dName !== t.domain) {
						dName = t.domain;
						dID = dName.replace('.', '_');
						dLI = document.createElement('li');
						dLI.dataset.domain = t.domain;
						ul.appendChild(dLI);
						el1 = document.createElement('input');
						el1.type = 'checkbox';
						el1.setAttribute('is', 'ux-switch');
						el1.setAttribute('checked', false);
						el1.id = dID;
						el1.checked = true;
						dLI.appendChild(el1);
						el1 = document.createElement('label');
						el1.setAttribute('for', dID);
						el2 = document.createElement('span');
						el2.innerText = t.domain;
						el1.appendChild(el2);
						dCount = document.createElement('b');
						dCount.dataset.count = '0';
						dCount.className = 'count';
						el1.appendChild(dCount);
						dLI.appendChild(el1);
						dUL = document.createElement('ul');
						dLI.appendChild(dUL);
					}
					fLI = document.createElement('li');
					fLI.dataset.file = t.file;
					fLI.dataset.special = t.special;
					dUL.appendChild(fLI);
					el1 = document.createElement('div');
					el1.className = 'info';
					fLI.appendChild(el1);
					el2 = document.createElement('div');
					el2.className = 'file';
					el2.innerHTML = '<span></span>';
					el2.firstChild.innerText = t.file;
					el1.appendChild(el2);
					fCount = document.createElement('b');
					fCount.className = 'count';
					fCount.dataset.count = t.count;
					dCount.dataset.count = Number(dCount.dataset.count) + Number(t.count);
					el2.appendChild(fCount);
					if (t.special.trim().length) {
						el2 = document.createElement('div');
						el2.className = 'special';
						el2.innerText = t.special;
						el1.appendChild(el2);
					}
				}
				//console.log(msg)
				//console.groupEnd();
				// no tags sent
				if (!a) {
					clearTags(msg['ignore-tags']);
				}
			} else {
				console.log('unexpected message', msg);
			}
		});
		port.postMessage({
			'msg-type' : 'get-tags'
		});
	});

	function clearTags(trackLevel) {
		console.log(trackLevel, trackLevel === false);
		if (trackLevel) {
			var p = document.querySelector('#taglist .portal');
			while (p.firstChild)
			p.removeChild(p.firstChild);
			var el = document.createElement('i');
			el.innerHTML = 'Tag tracking is disabled for this ' + trackLevel + '<br>';
			p.appendChild(el);
			el = document.createElement('button');
			el.onclick = function() {
				port.postMessage({
					'msg-type' : 'track-tags',
					'track-level' : trackLevel
				});
				clearTags(false);
			};
			el.innerText = 're-enable';
			p.appendChild(el);
			port.postMessage({
				'msg-type' : 'ignore-tags',
				'track-level' : trackLevel
			});
			document.querySelector('#taglist .menu-button').style.display = 'none';
		} else {
			document.querySelector('#taglist').style.display = 'none';
			port.postMessage({
				'msg-type' : 'clear-tags'
			});
			var p = document.querySelector('#taglist .portal ul');
			while (p.firstChild)
			p.removeChild(p.firstChild);
		}
	}

	/*chrome.runtime.connect({
	 name: "WASP.popup-" + WaspUI.currentTab
	 });*/
	var as = document.querySelectorAll('a');
	for (var l = as.length; l--; ) {
		var a = as[l];
		switch (a.id) {
		case 'clear-tags':
		case 'clear-page':
		case 'clear-domain':
			a.dataset.action = a.id;
			break;
		case 'options':
			a.dataset.url = '/options.html';
			break;
		case 'support':
			a.dataset.url = 'http://support.webanalyticssolutionprofiler.com/?utm_source=plugin&utm_medium=chrome&utm_campaign=wasp';
			break;
		case 'about':
			a.dataset.url = '/about.html';
			break;
		case 'crawl':
			a.dataset.url = 'http://webanalyticssolutionprofiler.com/chrome/crawler/';
			chrome.runtime.sendMessage('fdogdfpioiggoomoobmfkgckbkheckik', {
				'name' : 'ping'
			}, function(r) {
				if (r) {
					var a = document.querySelector('#crawl');
					//console.log('crawler exits',a.dataset);
					a.dataset.action = 'crawl';
					a.dataset.url = '';
					delete a.dataset.url;
				}
			});
		}
		a.onclick = function(e) {
			// console.log(this.dataset);
			// return;
			if (this.dataset.url) {
				chrome.tabs.create({
					'url' : this.dataset.url,
					'active' : true
				}, function(tab) {
					chrome.windows.update(tab.windowId, {
						'focused' : true
					});
				});
			} else {
				switch (this.dataset.action) {
				case 'crawl':
					chrome.runtime.sendMessage('fdogdfpioiggoomoobmfkgckbkheckik', {
						'name' : 'launch'
					}, function(r) {
						//console.log('crawler returned',r);
					});
					break;
				case 'clear-tags':
					clearTags();
					break;
				case 'clear-page':
				case 'clear-domain':
					clearTags(this.dataset.action.split('-')[1]);
					break;
				default:
				//console.log('unknown menu press',this);
				}
			}
		};
	}
}); 