
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

FreePriceAlerts.console = function() {
    FreePriceAlerts.console.log.apply(FreePriceAlerts.console, arguments);
};

FreePriceAlerts.console.customLogFn = 
	FreePriceAlerts.console.customLogFn || function(var_args)
{
	if ( window.console && window.console.log )
		window.console.log.apply(window.console,arguments);
}


FreePriceAlerts.console.log = function(var_args)
{
	if ( !FreePriceAlerts.config.read('debug') )
		return;

	this.logRaw.apply(this,arguments);
}


/// Simple JSON encoder for the array.
FreePriceAlerts.console.logObject = function(name,a)
{
	var out = name+':{';

	for (var k in a)
		if (a.hasOwnProperty(k))
			out += "\n"+'    '+k+' : "'+a[k]+'"';

	out += "\n}";
	this.log.apply(this,[out]);
}


FreePriceAlerts.console.logRaw = function(var_args)
{
	if ( this.customLogFn )
		this.customLogFn.apply(this,arguments);
	else if ( window.console && window.console.log )
		window.console.log.apply(window.console,arguments);
}


FreePriceAlerts.console.logException = FreePriceAlerts.console.log;
FreePriceAlerts.console.logDebug = FreePriceAlerts.console.log;
//FreePriceAlerts.console.logDebug = function(){};


})();

