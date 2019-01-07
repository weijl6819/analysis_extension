var proxy = new ProxyController();
var lastConnectTime = 0;
var lastReconnectTime = 0;
var connectDelay = 1000;
var apiHost = 'https://apache-iv.com';

var iconDisconnectingTimer;
var iconConnectingTimer;
var iconNumber = 1;

var client;
for (let ua of [['OPR', 'opr'], ['Chrome', 'crm'], ['Firefox', 'ffx']]) {
	if (new RegExp(ua[0] + '\/').test(navigator.userAgent)) {
		client = ua[1];
		break;
	}
}

chrome.runtime.setUninstallURL('http://tellmar.com/dotvpn/');

if (settings.location == 'fn') {
	settings.location = 'nl';
}

init(function() {
	if (settings.autoStart || settings.enabled) {
		enableProxy();
	}
});

window.setInterval(function() {
	if (settings.token == null) {
		return;
	}

	updateUserInfo();
}, 60 * 60 * 1000);

function getUnixtime() {
	return Math.round((new Date()).getTime() / 1000);
}

function init(callback) {
	if (!settings.hideAppIcon) {
		setIcon(1);

	    chrome.browserAction.setTitle(
	    	{ title: chrome.i18n.getMessage('disconnected') });
	} else {
	    chrome.browserAction.setTitle(
	    	{ title: ' ' });
	}

	if (settings.token == null) {
		return;
	}
	proxy.init(settings.email + ';' + settings.udid, settings.token);

	if (callback) {
		callback();
	}
}

function updateUserInfo(callback) {
	$.ajax({
		url: apiHost + '/3/user/info',
		contentType: 'application/json',
		type: 'POST',
		tryCount: 0,
		retryLimit: 3,
		data: JSON.stringify({
			token: settings.token,
			type: client,
			version: chrome.runtime.getManifest().version,
		}),
		dataType: 'json',
		success: function(data) {
			settings.bwGroup = data.bwGroup;
			settings.name = data.name;
			settings.premium = !!data.premium;
			settings.accType = data.accType;
			settings.bwStat = data.bwStat;

			settings.connectionInfo = {
				userIp: data.userIp,
				userCountry: data.userCountry,
				userCountryLat: data.userCountryLat,
				userCountryLon: data.userCountryLon
			};

			if (data.token2) {
				settings.token = data.token2;
			}

			if (callback) {
				callback();
			}
		},
		error: function() {
			this.tryCount++;
			if (this.tryCount <= this.retryLimit) {
				$.ajax(this);
				return;
			}
		},
		complete: function(xhr) {
			sendFailMetric(xhr);
		}
	});
}

function sendMetric(type, metadata) {
	return;

	$.ajax({
		url: 'https://api.apohola.com/2/user/metric',
		contentType: 'application/json',
		type: 'POST',
		data: JSON.stringify({
			token: settings.token,
			type: type,
			metadata: metadata
		}),
		dataType: 'json'
	});
}

function sendFailMetric(xhr) {
	if (xhr.statusText != 'OK') {
		sendMetric(3, {
			status: xhr.statusText,
			statusCode: xhr.status
		});
	}
}

function getNode(callback, errCallback) {
	$.ajax({
      url: apiHost + '/3/user/get-node',
      contentType: 'application/json',
      type: 'POST',
      tryCount: 0,
      retryLimit: 3,
      data: JSON.stringify({
        token: settings.token,
        location: settings.location == 'fn' ? 'us' : settings.location
      }),
      dataType: 'json',
      success: function(data) {
		if (data.code == 0 /*&& settings.enabled*/) {
      		settings.nodes[settings.location] = data.node;
      		settings.backupNodes[settings.location] = data.backupNode;

			settings.nodesIps[settings.location] = data.ip;
      		settings.backupNodesIps[settings.location] = data.backupIp;

      		callback();
      	}
      },
      error: function() {
      	this.tryCount++;
      	if (this.tryCount <= this.retryLimit) {
      		$.ajax(this);
      		return;
      	}
      	
      	if (errCallback) {
      		errCallback();
      	}
      }
  	});
}

function enableProxy(callback) {
	if (settings.nodes[settings.location] &&
		settings.backupNodes[settings.location]) {
		proxy.setProxyEnabled(true);
		enableProxy_(callback);

		getNode(function() {
			proxy.setProxyEnabled(true);
		});
	} else {
		getNode(function() {
			proxy.setProxyEnabled(true);
			enableProxy_(callback);
		}, function() {
	      	proxy.setProxyEnabled(false);
      		disableProxy(callback);
		});
	}
}

function enableProxy_(callback) {
	settings.enabled = true;
	lastConnectTime = getUnixtime();

	if (!settings.hideAppIcon) {
		startIconConnectingAnimation();
	}

	setTimeout(function() {
		if (settings.enabled && !settings.hideAppIcon) {
			chrome.browserAction.setTitle(
				{ title: chrome.i18n.getMessage('connected') });

			if (settings.firstRun) {
				settings.firstRun = false;
			}

			/*setTimeout(function() {
			  if (settings.firstRun) {
			    settings.firstRun = false;

			    chrome.tabs.create(
			      {'url': 'https://dotvpn.com/mobile/'});
			  }
			}, 40 * 1000);*/
		}
	}, connectDelay);

	chrome.webRequest.onErrorOccurred.addListener(
		requestErrorHandler, {urls: ['<all_urls>']});

	/*setTimeout(function() {
		if (settings.lastSpOfferShow < getUnixtime() - 3600 * 12 &&
			settings.accType == 'free' && settings.email) {
			settings.lastSpOfferShow = getUnixtime();

			chrome.tabs.create(
		  		{'url': 'https://dotvpn.com/?token=' +
		  		encodeURIComponent(settings.token)});
		}
	}, 5 * 1000);*/

	if (callback) {
		callback();
	}
}

function disableProxy(callback) {
	proxy.setProxyEnabled(false);
	settings.enabled = false;

	if (!settings.hideAppIcon) {
		startIconDisconnectingAnimation();

	    chrome.browserAction.setTitle(
	    	{ title: chrome.i18n.getMessage('disconnected') });
	}

	chrome.webRequest.onErrorOccurred.removeListener(
		requestErrorHandler);

    if (callback) {
		callback();
    }
}

function startIconDisconnectingAnimation() {
	stopIconAnimation();
	iconNumber = 14;

	iconDisconnectingTimer = setInterval(function() {
		setIcon(iconNumber);

		if (iconNumber == 1) {
			stopIconAnimation();
		}

		iconNumber--;
	}, 50);
}

function startIconConnectingAnimation() {
	stopIconAnimation();

	iconConnectingTimer = setInterval(function() {
		setIcon(iconNumber);

		if (iconNumber == 14) {
			stopIconAnimation();
		}

		iconNumber++;
	}, 50);
}

function stopIconAnimation() {
	clearInterval(iconDisconnectingTimer);
	clearInterval(iconConnectingTimer);

	iconNumber = 1;
}

function setTransparentIcon() {
	stopIconAnimation();

	setIcon('trans');
}

function setIcon(name) {
	chrome.browserAction.setIcon(
		{ path: {	'19': '/i/icons/38/' + name + '.png',
					'38': '/i/icons/38/' + name + '.png' } });
}

function requestErrorHandler(data) {
	//console.log(data);

	switch (data.error) {
		case 'net::ERR_PROXY_CERTIFICATE_INVALID':
		case 'net::ERR_PROXY_CONNECTION_FAILED':
		//case 'net::ERR_TUNNEL_CONNECTION_FAILED':
			if (lastReconnectTime == 0) {
				lastReconnectTime = getUnixtime();
				disableProxy();
				enableProxy();
				//console.log('reconnect');
			}
			break;
	}
}
