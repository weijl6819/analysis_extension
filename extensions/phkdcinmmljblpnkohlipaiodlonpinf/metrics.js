var Browsers = {
	CHROME: "chrome",
	FIREFOX: "firefox"
};

var browser = (function() {
	return (this.localStorage ? Browsers.CHROME : Browsers.FIREFOX);
})();

//////////////////////////////////////////////////////////////////////////////

function ExtensionData() {
	if (browser == Browsers.FIREFOX) {
		this.ffBranch = Components.classes["@mozilla.org/preferences;1"]
			.getService(Components.interfaces.nsIPrefBranch);
	}
}

ExtensionData.prototype.getVersion = function(callback) {
	if (browser == Browsers.CHROME) {
		callback(chrome.app.getDetails().version);
	} else if (browser == Browsers.FIREFOX) {
		Components.utils.import("resource://gre/modules/AddonManager.jsm");
		AddonManager.getAddonByID(this.extensionId, function(addon) {
			callback(String(addon.version));
		});
	}
}

ExtensionData.prototype.getValue = function(key) {
	if (browser == Browsers.CHROME) {
		return localStorage[key] || "";
	} else if (browser == Browsers.FIREFOX) {
		try {
			return this.ffBranch.getComplexValue(
				"extensions." + ExtensionData.instance.extensionId + "." + key,
				Components.interfaces.nsISupportsString).data || "";
		} catch (e) {
			return "";
		}
	}
}

ExtensionData.prototype.setValue = function(key, value) {
	if (browser == Browsers.CHROME) {
		localStorage[key] = value;
	} else if (browser == Browsers.FIREFOX) {
		var str = Components.classes["@mozilla.org/supports-string;1"]
      .createInstance(Components.interfaces.nsISupportsString);
		str.data = String(value);
		this.ffBranch.setComplexValue(
			"extensions." + this.extensionId + "." + key,
			Components.interfaces.nsISupportsString, str);
	}
}

ExtensionData.instance = new ExtensionData;

//////////////////////////////////////////////////////////////////////////////

function today() {
	var date = new Date();
	date.setUTCHours(0, 0, 0, 0);
	return date;
}

function tomorrow() {
	var date = today();
	date.setDate(date.getDate() + 1);
	return date;
}

//////////////////////////////////////////////////////////////////////////////

function Metric(url, name) {
	this.url = url;
	this.name = name;
	this.state = {};
	this.readState();
}

Metric.prototype.readState = function() {
	var stateJson = ExtensionData.instance.getValue("metric_state_" + this.name);
	if (stateJson) {
		try {
			this.state = JSON.parse(stateJson);
		} catch (e)
		{ }
	}
}

Metric.prototype.saveState = function() {
	ExtensionData.instance.setValue("metric_state_" + this.name, JSON.stringify(this.state));
}

Metric.prototype.send = function() {
	if (this.sending) {
		return false;
	}

	if (browser == Browsers.FIREFOX) {
		var xhr = Components.classes["@mozilla.org/xmlextras/xmlhttprequest;1"]
			.createInstance();
	} else {
		var xhr = new XMLHttpRequest();
	}
	xhr.open("GET", this.getUrl(), true);

	var self = this;
	xhr.onreadystatechange = function() {
		self.sending = false;
		if (xhr.readyState === 4 && xhr.status) {
			self.onSendSuccess();
		}
	}
	xhr.send();
	
	this.sending = true;
}

Metric.prototype.getUrl = function() {
	return this.url.replace("${VERSION}", ExtensionData.instance.version);
}

function DailyMetric(url, name) {
	Metric.call(this, url, name);
}
DailyMetric.prototype = Object.create(Metric.prototype);

DailyMetric.prototype.shouldBeSent = function() {
	return !this.state.lastDayDate || today() > new Date(this.state.lastDayDate);
}

DailyMetric.prototype.send = function() {
	this.currentDayNumber = (this.state.lastDayNumber || 0) + 1;
	Metric.prototype.send.call(this);
}

DailyMetric.prototype.onSendSuccess = function() {
	this.state.lastDayNumber = this.currentDayNumber;
	this.state.lastDayDate = today();
	this.saveState();
}

DailyMetric.prototype.getUrl = function() {
	var url = Metric.prototype.getUrl.call(this);
	return url.replace("${DAYNUM}", this.currentDayNumber);
}

function InstallationMetric(url, name) {
	Metric.call(this, url, name);
}
InstallationMetric.prototype = Object.create(Metric.prototype);

InstallationMetric.prototype.shouldBeSent = function() {
	return !this.state.wasSent;
}

InstallationMetric.prototype.onSendSuccess = function() {
	this.state.wasSent = true;
	this.saveState();
}

//////////////////////////////////////////////////////////////////////////////

function getCommonParams() {
	var prefs = ExtensionData.instance;
	return {
		product_id: prefs.getValue("product_id"),
		install_id: prefs.getValue("install_id"),
		kind: prefs.getValue("product_type"),
		gp: prefs.getValue("rfr")
	};
}

function addUrlParams(url, paramObject) {
	var paramsArray = [];
	for (var key in paramObject) {
		paramsArray.push(encodeURIComponent(key) + "=" + encodeURIComponent(paramObject[key]));
	}
	var result = url;
	if (paramsArray.length) {
		result += (url.search("\\?") == -1 ? "?" : "&");
		result += paramsArray.join("&");
	}
	return result;
}

function getGoMetricUrl() {
	var url = ExtensionData.instance.getValue("go_metric_url");
	if (url) {
		return url;
	}
	
	// for compatibility
	return addUrlParams("http://go.mail.ru/distib/mark/", getCommonParams());
}

function getMrdsMetricUrl() {
	var url = ExtensionData.instance.getValue("mrds_metric_url");
	if (url) {
		return url;
	}
	
	// for compatibility
	url = addUrlParams(
		"http://mrds.mail.ru/update/2/version.txt?type=product_online_metric",
		getCommonParams());
	// this should not be urlencoded
	url += "&day_num=${DAYNUM}";
	url += "&version=${VERSION}";
	return url;
}

function getMetricsAndCall(metrics, callback) {
	if (metrics.length) {
		return;
	}
	
	var prefs = ExtensionData.instance;

	if (!prefs.version) {
		prefs.getVersion(function(version) {
			prefs.version = version;
			getMetricsAndCall(metrics, callback);
		});
		return;
	}
	
	metrics.push(new DailyMetric(getGoMetricUrl(), "go_metric"));
	metrics.push(new DailyMetric(getMrdsMetricUrl(), "mrds_metric"));

	var partnerOnlineUrl = prefs.getValue("partner_product_online_url");
	if (partnerOnlineUrl) {
		metrics.push(new InstallationMetric(partnerOnlineUrl, "installPartnerMetric"));
	}
	
	callback();
}

//////////////////////////////////////////////////////////////////////////////

var MetricsInterface = {

sendIfNecessary: function() {
	if (!ExtensionData.instance.getValue("product_id")) {
		return;
	}
	
	if (!MetricsInterface.metricsArray) {
		MetricsInterface.metricsArray = [];
		getMetricsAndCall(MetricsInterface.metricsArray,
			MetricsInterface.sendIfNecessary);
		return;
	}
	
	MetricsInterface.metricsArray.forEach(function(metric) {
		if (metric.shouldBeSent()) {
			metric.send();
		}
	});
},
	
// needed for firefox
setExtensionId: function(extensionId) {
	ExtensionData.instance.extensionId = extensionId;
}

};

//////////////////////////////////////////////////////////////////////////////

if (browser == Browsers.FIREFOX) {
	var EXPORTED_SYMBOLS = [ "MetricsInterface" ];
}

if (browser == Browsers.CHROME) {
	onStart = function() {
		MetricsInterface.sendIfNecessary();
	
		var alarmTime = tomorrow();
		alarmTime.setSeconds(Math.floor(Math.random() * 60*60*2));
		chrome.alarms.create("DailyMetricsAlarm", { when: alarmTime.getTime() });
	};

	onAlarm = function(alarm) {
		if (alarm.name == "DailyMetricsAlarm") {
			onStart();
		}
	};

	chrome.runtime.onStartup.addListener(onStart);
	chrome.runtime.onInstalled.addListener(onStart);
	chrome.alarms.onAlarm.addListener(onAlarm);
}