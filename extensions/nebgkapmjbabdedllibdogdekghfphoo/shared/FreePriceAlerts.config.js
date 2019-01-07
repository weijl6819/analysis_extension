
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

(function(){

var FreePriceAlerts = window.FreePriceAlerts = window.FreePriceAlerts || {};
var _ = FreePriceAlerts.libs.underscore;

/// config() => returns all confurations.
/// config(name) => returns named config.
/// config(name, value) => sets named config to value.
FreePriceAlerts.config = function(name, opt_value) {
    "use strict";

    var self = window.FreePriceAlerts.config;

    if (arguments.length === 0) {
        return self.readAll.apply(self, arguments);
    }

    if (arguments.length === 1) {
        return self.read.apply(self, arguments);
    }

    return self.write.apply(self, arguments);
};

;(function(){
    "use strict";

	var values = {
		debug: false,
		confirm_search: false,
	};

	this.read     = function(i)   { return values[i]; }
	this.write    = function(i,v) { return values[i]=v; }
	this.writeAll = function(v)   { return values=v; }
	this.readAll  = function()    { return values; }

	this.isDebug = function() { return this.read('debug'); }

	// Reads a Delimiter-separated values setting.
	// The separator is spaces or commas.
	this.readDsv = function(name) {
		var hosts = values[name];
		if (_(hosts).isString()) hosts = hosts.split(/[\s,]+/);
		if (!_(hosts).isArray()) hosts = [];
		return hosts;
	};

	this.api_hosts = function() { return this.readDsv('api.host') };
	this.api_host  = function() { return _(this.api_hosts()).first() };

	this.fe_host   = function() { return this.read('fe.host') };

	/// Like: values[name] = source[name];
	///
	/// Reads from the settings/preferences of the browser into this if a custom
	/// read function was set.
	/// @returns the read value on success; otherwise null.
	this.pullSource = function(name)
	{
		if ( !this.customReadFn ) return;
		var val = this.customReadFn.apply(this,arguments);
		if (null !== val)
			this.write(name,val);
	}

	/// Like: source[name] = values[name];
	///
	/// Writes to the settings/preferences of the browser from this if a custom
	/// write function was set.
	this.pushSource = function(name)
	{
		if ( !this.customWriteFn ) return;
		this.customWriteFn.apply(this,[name, this.read(name)]);
	}

	/// Like: return source[name];
	///
	/// Returns the read value from the settings/preferences of the browser if a
	/// custom read function was set.
	/// @returns the read value on success; otherwise null.
	this.readSource = function(name)
	{
		if ( !this.customReadFn ) return null;
		return this.customReadFn.apply(this,[name]);
	}

	/// Like: source[name] = val;
	///
	/// Writes val into the settings/preferences of the browser if a custom
	/// write function was set.
	this.writeSource = function(name, val)
	{
		if ( !this.customWriteFn ) return;
		this.customWriteFn.apply(this,[name, val]);
	}

	/// Like: for (* in values) source[*] = values[*];
	///
	/// Writes all of this config values to the settings/preferences of the 
	/// browser if a custom function was set.
	this.writeAllSource = function()
	{
		if ( !this.customWriteFn ) return;
		for (var name in values)
			if (values.hasOwnProperty(name))
				this.customWriteFn.apply(this,[name, values[name]]);
	}

	/// Checks and updates the distribution partner.
	/// @param  doc  The document object in the DOM.
	this.foundPartner = function(partner)
	{
		if (!partner) return;
		var configParter = FreePriceAlerts.config.read('distributionPartner');

		// Todo: verify using permissions API

		if (!configParter)
		{
			FreePriceAlerts.console.log('Updating distribution partner: `'+configParter+'` >> `'+partner+'`');
			FreePriceAlerts.config.write('distributionPartner', partner);
			FreePriceAlerts.config.pushSource('distributionPartner');
		}
		else
			FreePriceAlerts.console.logDebug('distribution partner: `'+configParter+'` xx `'+partner+'`');
	}

	this.foundRole = function(role)
	{
		if (!role) return;
		FreePriceAlerts.config.write('role', role);
		FreePriceAlerts.config.write('advancedSettings', /\bsettings\b/.test(role));
	}

}).call(FreePriceAlerts.config);

})();

