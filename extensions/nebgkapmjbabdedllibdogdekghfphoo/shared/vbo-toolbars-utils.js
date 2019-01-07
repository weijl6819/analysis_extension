
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

"use strict";
FreePriceAlerts.toolbars = FreePriceAlerts.toolbars || {};
FreePriceAlerts.toolbars.utils = FreePriceAlerts.toolbars.utils || {};
FreePriceAlerts.toolbars.utils.io = FreePriceAlerts.toolbars.utils.io || {};


FreePriceAlerts.toolbars.utils.io.File = function( path )
{
	// Based on "Basic JavaScript File and Directory IO module" by MonkeeSage

	this.filename = "";
	var file = null;

	this.read = function(charset)
	{
		try
		{
			var data = new String();
			var fiStream = Components.classes['@mozilla.org/network/file-input-stream;1']
					.createInstance(Components.interfaces.nsIFileInputStream);
							
			var siStream = Components.classes['@mozilla.org/scriptableinputstream;1']
					.createInstance(Components.interfaces.nsIScriptableInputStream);

			fiStream.init(file, 1, 0, false);
			siStream.init(fiStream);
			data += siStream.read(-1);
			siStream.close();
			fiStream.close();

			if (charset) {
				data = this.toUnicode(charset, data);
			}

			return data;
		}
		catch(e)
		{
			FreePriceAlerts.console.logException('Failed to read file',path,e);
			return false;
		}
	}
	
	this.toUnicode = function(charset, data)
	{
		try
		{
		  var uniConv = Components.classes['@mozilla.org/intl/scriptableunicodeconverter']
						.createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
		  uniConv.charset = charset;
		  data = uniConv.ConvertToUnicode(data);
		} 
		catch(e)
		{
			FreePriceAlerts.console.logException('Failed to convert file to unicode',path,e);
		}

		return data;
	}
	
	// This throws an exception
	// Intentionally not caught
	var file = Components.classes['@mozilla.org/file/local;1']
				.createInstance(Components.interfaces.nsILocalFile);
	file.initWithPath(path);
}


// Directory Separator
FreePriceAlerts.toolbars.utils.io.DS = ( navigator.platform.toLowerCase().indexOf('win') > -1 ? '\\' : '/' );
