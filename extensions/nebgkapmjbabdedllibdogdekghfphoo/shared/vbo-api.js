
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
FreePriceAlerts.api = {};


FreePriceAlerts.api.Request = function(type,path,data)
{
	this.superclass = FreePriceAlerts.events.Dispatcher;
	this.superclass();

	this.type = type;
	this.path = path;
	this.data = data;
	this.dataType = undefined;

	var self = this;

	var handleSuccess = function( response, textStatus, httpRequest )
	{
		var headers = [];
		var evt = new FreePriceAlerts.api.RequestResponseEvent(FreePriceAlerts.api.Request.SUCCESS, headers, response);
		self.triggerEvent(evt);
	};

	var handleFailure = function( response, textStatus, httpRequest )
	{
		var evt = new FreePriceAlerts.api.RequestResponseEvent(FreePriceAlerts.api.Request.FAILURE, [], null);
		self.triggerEvent(evt);
	};

	this.send = function()
	{
		FreePriceAlerts.libs.jQuery.ajax({
			type    : this.type,
			url     : this.path,
			data    : this.data,
			dataType: this.dataType,
			success : function(r,s,h){handleSuccess(r,s,h)},
			error   : function(r,s,h){handleFailure(r,s,h)},
		});
	};

}


FreePriceAlerts.api.Request.SUCCESS = 'ReqSuccess';
FreePriceAlerts.api.Request.FAILURE = 'ReqFailure';


FreePriceAlerts.api.GetRequest = function(path)
{
  this.superclass = FreePriceAlerts.api.Request;
  this.superclass('GET',path);
}


FreePriceAlerts.api.PostRequest = function(path,data)
{
  this.superclass = FreePriceAlerts.api.Request;
  this.superclass('POST',path,data);
}


FreePriceAlerts.api.RequestResponseEvent = function( success, headers, data )
{
  this.superclass = FreePriceAlerts.events.Event;
  this.superclass( success ? FreePriceAlerts.api.Request.SUCCESS : FreePriceAlerts.api.Request.FAILURE );
  
  this.headers = headers;
  this.data = data;
}
