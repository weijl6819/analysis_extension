'use strict';

function onYouTubeIframeAPIReady() {
		document.dispatchEvent(new Event('audioAPIReady'));
}

function initAudioSyncPlayer() {
		if (!window['YT']) {
				var YT = {
						loading: 0,
						loaded: 0
				};
		}
		if (!window['YTConfig']) {
				var YTConfig = {
						'host': 'http://www.youtube.com'
				};
		}
		if (!YT.loading) {
				YT.loading = 1;
				(function () {
						var l = [];
						YT.ready = function (f) {
								if (YT.loaded) {
										f();
								} else {
										l.push(f);
								}
						};
						window.onYTReady = function () {
								YT.loaded = 1;
								for (var i = 0; i < l.length; i++) {
										try {
												l[i]();
										} catch (e) {}
								}
						};
						YT.setConfig = function (c) {
								for (var k in c) {
										if (c.hasOwnProperty(k)) {
												YTConfig[k] = c[k];
										}
								}
						};
						document.dispatchEvent(new Event('readyToLoadAudioApi'));
				})();
		}
}