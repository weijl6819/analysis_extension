
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

;(function(){
"use strict";

var FreePriceAlerts = window.FreePriceAlerts = window.FreePriceAlerts || {};
FreePriceAlerts.utils = FreePriceAlerts.utils || {};

var $ = FreePriceAlerts.libs.jQuery;
var _ = FreePriceAlerts.libs.underscore;


FreePriceAlerts.assert = function(condition, message)
{
	if (!condition)
		throw message;
};


FreePriceAlerts.utils.stringToRegexp = function( str )
{
	var f=str.match(/^\/((?:\\\/|[^\/])+)\/(?:((?:\\\/|[^\/])*)\/)?([a-z]*)$/i);
	if ( !f ) throw new SyntaxError('Invalid regular expression: `'+(str ? str : 'NULL')+'`');

	var re = new RegExp( f[1], f[3] );
	re.replaceWith = f[2];
	return re;
};


FreePriceAlerts.utils.callLater = function( f )
{
	setTimeout( function(){ f(); }, 1 );
};


FreePriceAlerts.utils.ErrorToString = function(err) {

    if (typeof err === 'string') return 'Error: '+err;
 
    var m = '';
    var indent = '    ';
    var append = function(message) { m += "\n"+message; };
    var prop = function(name) {
        if (undefined !== err[name] )
            append(indent+'.'+name+' => '+err[name]);
    };

    m += 'Error: ';
    if (''+err !== '[object Error]') m += err;
 
    if (err.toString() !== '[object Error]'
    && ''+err !== err.toString())
        append(indent+err.toString());

    prop('message'     ); // Standard
    if (err.message !== err.description)
        prop('description' ); // Microsoft
    prop('name'        ); // Standard
    prop('fileName'    ); // Microsoft
    prop('lineNumber'  ); // Microsoft
    prop('columnNumber'); // Microsoft
    prop('number'      ); // Microsoft
    prop('stack'       ); // Mozilla
    prop('stacktrace'  );

    return m;
};


/// Returns a list of attributes formatted like fpa:NAME
FreePriceAlerts.utils.getFpaAttributes = function(element)
{
	var fpaAttributes = FreePriceAlerts.utils.getAttributesMatchingRegex(element, /^fpa:/ig);
	return fpaAttributes;
};


/// Returns a list of attributes on the element where the name match the pattern.
FreePriceAlerts.utils.getAttributesMatchingRegex = function(element, regex)
{
	var map = {};
	FreePriceAlerts.utils.eachAttribute(element, function(name,value)
	{
		if (regex.test(name))
			map[name] = value;
	});

	return map;
};


/**
 *  Calls the callback once for each attribute on the element.
 *  @param  element  The element to find attributes on.
 *  @param  callback  function(name,value), a function to call for each
 *          attribute. If this ever returns exactly false, the enumeration will
 *          end.
 *  @returns  false if the callback ever returns exactly false; otherwise true.
 */
FreePriceAlerts.utils.eachAttribute = function(element, callback)
{
	FreePriceAlerts.assert(element, 'Element is required.');
	FreePriceAlerts.assert(typeof callback === 'function', 'callback is required.');

	var attrs = element.attributes;
	var l = attrs.length;
	for (var i=0; i < l; i++) {
		var attr = attrs[i];
		if (false === callback(attr.name, attr.value))
			return false;
	}

	return true;
};


FreePriceAlerts.utils.isFunction = function(o) {
	o && {}.toString.call(o) === '[object Function]';
};


/**
 *  Javascript string pad
 *  http://www.webtoolkit.info/
 *  http://www.webtoolkit.info/javascript-pad.html
 */
FreePriceAlerts.utils.pad = function(str, len, pad, dir)
{
	var self = FreePriceAlerts.utils.pad;

	if (typeof(len) == "undefined") { var len = 0; }
	if (typeof(pad) == "undefined") { var pad = ' '; }
	if (typeof(dir) == "undefined") { var dir = self.STR_PAD_RIGHT; }

	if (len + 1 >= str.length) {

		switch (dir) {

			case self.STR_PAD_LEFT:
				str = Array(len + 1 - str.length).join(pad) + str;
			break;

			case self.STR_PAD_BOTH:
				var right = Math.ceil((padlen = len - str.length) / 2);
				var left = padlen - right;
				str = Array(left+1).join(pad) + str + Array(right+1).join(pad);
			break;

			default:
				str = str + Array(len + 1 - str.length).join(pad);
			break;

		} // switch

	}

	return str;

};

FreePriceAlerts.utils.pad.STR_PAD_LEFT = 1;
FreePriceAlerts.utils.pad.STR_PAD_RIGHT = 2;
FreePriceAlerts.utils.pad.STR_PAD_BOTH = 3;


FreePriceAlerts.utils.padLeft = function(str, len, pad)
{
	if (typeof(len) == "undefined") return str;
	if (typeof(pad) == "undefined") var pad = ' ';
	str = str+'';

	if (len + 1 >= str.length) {
		str = Array(len + 1 - str.length).join(pad) + str;
	}

	return str;
};


/**
 *  Javascript string pad
 *  http://www.webtoolkit.info/
 *  http://www.webtoolkit.info/javascript-pad.html
 */
FreePriceAlerts.utils.padRight = function(str, len, pad)
{
	if (typeof(len) == "undefined") return str;
	if (typeof(pad) == "undefined") var pad = ' ';

	if (len + 1 >= str.length) {
		str = str + Array(len + 1 - str.length).join(pad);
	}

	return str;
};


FreePriceAlerts.utils.newEvent = function(name)
{
	var evt = document.createEvent('Event');
	evt.initEvent(name, true, true);
	return evt;
};


FreePriceAlerts.utils.makeInMemoryPodKey = function() {
    return (Math.random()*89999999+10000000).toString(16);
};


FreePriceAlerts.utils.getHash = function(url) {
    var hashIndex = url.indexOf("#")
    return hashIndex != -1 ? url.substring(hashIndex) : "";
};


/**
 *  Invokes the action until the action returns true or the timeout occurs.
 *  
 *  @param  action    The action to perform.
 *  @param  timeout   The timeout in milliseconds. If 0, there is no timeout.
 *  @param  interval  The frequency the action will be called.
 */
FreePriceAlerts.utils.doUntil = function(action, timeout, interval)
{
	if (typeof action === 'undefined') throw 'doWhen: invalid action';
	if (typeof interval === 'undefined') interval = 10;
	if (typeof timeout === 'undefined') timeout = 500;

	var tryAction = function()
	{
		var passed = false;
		try { passed = action() ? true : false; } 
		catch(e) { FreePriceAlerts.console.logException('doUntil action exception: ', e); }
		return passed;
	}

	if (tryAction()) return;

	var eventId;
	var clearEvent = function()
	{
		if (!eventId) return;
		clearInterval(eventId);
		eventId = null;
	}

	eventId = setInterval(function(){
		if (!eventId) return;
		if (tryAction()) clearEvent();
	}, interval);

	if (timeout != 0) {
		window.setTimeout(function() { clearEvent(); }, timeout);
	}
};


/// Returns a value indicating if the string starts with the prefix.
FreePriceAlerts.utils.startsWith = function(string, prefix) {
	return 0 === string.indexOf(prefix);
};


/// Returns a value indicating if the string ends with the suffix.
FreePriceAlerts.utils.endsWith = function(string, suffix) {
    if (string === undefined || suffix === undefined) { return false; }
	return -1 !== string.indexOf(suffix, string.length - suffix.length);
};


FreePriceAlerts.utils.contains = function(string, needle) {
	return -1 !== string.indexOf(needle);
};


/**
 * Returns a value indicating if the value is an integer.
 * Returns false for very large integers, any string, NaN, Infinity and Exponents.
 * Returns true for floats with 0 to the right of the decimal (1.0)
 */
FreePriceAlerts.utils.isInteger = function(n) { return n===+n && n===(n|0); };


FreePriceAlerts.utils.Stopwatch = function(startTime)
{
	var now = function() { return (new Date()).getTime(); }

	if (typeof startTime == 'undefined') startTime = now();

	this.duration     = function() { return now() - startTime; }
	this.milliseconds = function() { return Math.floor( this.duration()                     % 1000); }
	this.seconds      = function() { return Math.floor((this.duration() /  1000           ) % 60  ); }
	this.minutes      = function() { return Math.floor((this.duration() / (1000 * 60     )) % 60  ); }
	this.hours        = function() { return Math.floor((this.duration() / (1000 * 60 * 60)) % 24  ); }
	this.ms           = this.milliseconds;
	this.padLeft      = FreePriceAlerts.utils.padLeft;
	this.toString     = function()
	{
		var str = this.padLeft(this.milliseconds(),3,'0');
		var s = this.seconds();
		var m = this.minutes();
		var h = this.hours();

		if (0<h||0<m||0<s) str = this.padLeft(s,2,'0')+'.'+str;
		if (0<h||0<m     ) str = this.padLeft(m,2,'0')+'.'+str;
		if (0<h          ) str = this.padLeft(h,2,'0')+'.'+str;
		return str;
	}
	this.toLongString = function()
	{
		return      this.padLeft(this.hours(),2,'0')
			+ ':' + this.padLeft(this.minutes(),2,'0')
			+ ':' + this.padLeft(this.seconds(),2,'0')
			+ '.' + this.padLeft(this.milliseconds(),3,'0');
	}
};


FreePriceAlerts.utils.Stopwatch.fromNavigationStart = function(win) {
    win = win || window;
    if (win.performance
    &&  win.performance.timing
    &&  win.performance.timing.navigationStart > 0 )
        return new FreePriceAlerts.utils.Stopwatch(win.performance.timing.navigationStart);
    return new FreePriceAlerts.utils.Stopwatch();
};


/// Gets and returns the content type of the current page.
/// Warning: On Chrome this method invokes an additional request to the document.location.
FreePriceAlerts.utils.getContentType = function()
{
	if (typeof navigator.contentType != 'undefined')
		return navigator.contentType;

	var req = new XMLHttpRequest();
	req.open('GET', document.location, false);
	req.send(null);
	return req.getResponseHeader("Content-Type");
};


var TimingLog = FreePriceAlerts.TimingLog = function(logs) {

    this.log = [];

    this.add = function(key, name, time) {
        this.log.push({
            key : key  || '',
            name: name || '',
            time: time || (new Date()).getTime(),
        });
    };

    this.push = this.add;

    this.addLogs = function( logs ) {
        if (logs && logs.length)
            Array.prototype.push.apply(this.log, logs);
    };

    this.clear = function(){ this.log.clear };

    this.addJsonLogs = function(logs) {
        if (logs) logs = JSON.parse(logs);
        this.addLogs(logs);
    };

    this.each = function(on_item) { _(this.log).each(function(v,i,a){on_item(v,i,a)}) };

    this.toJson =
    this.toJSON = function() {
        return JSON.stringify(this.log);
    };

};

var timingLog = null;

TimingLog.getInstance = function() {
    if (!timingLog) {
        timingLog = new TimingLog();
    }
    return timingLog;
};


})();

