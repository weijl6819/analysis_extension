
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
﻿/// <reference path="../chrome_extensions.js" />
/// <reference path="../webkit_console.js" />

var Exts = [
    "jpg",
    "jpeg",
    "png",
    "gif"
]

//------------------------------------------------------------------------------
//https://chrome.google.com/webstore/detail/oneclick-picsaver-image-d/klpnlinfkbamngjobmipfdojflgmaamj
var AppID = "klpnlinfkbamngjobmipfdojflgmaamj";
// Debug
//var AppID = "ocalkfbclmefhalhkpldnldkchnmfmbk";
var AppInstalled = false;

function detectChromeExtension(extensionId, callback){
    chrome.runtime.sendMessage(
		extensionId,
		{command : "ping", data : ""},
		function(M)
		{
			var lastError = chrome.runtime.lastError;
		    if (lastError)
		        callback(false);
		    else
		    	callback(true);
		}
	);

};

detectChromeExtension(AppID,function(result)
{
	AppInstalled = result;
	Handle();
})

//------------------------------------------------------------------------------


function Update(ImgDesc) {
	if (!ImgDesc)
		return;
	if (!AppInstalled)
	{
		chrome.extension.sendRequest({ Command: "Icon", filename: "20.png" }, function (response) { });
		chrome.extension.sendRequest({ Command: "Images", Images: ImgDesc, Popup: "popup.html" }, function (response) { });
	}
	else
	{
		if (ImgDesc.length > 0) 
		{
			chrome.extension.sendRequest({ Command: "Icon", filename: "18.png" }, function (response) { });
			chrome.extension.sendRequest({ Command: "Images", Images: ImgDesc, Popup: "popup.html" }, function (response) { });
		}
		else 
		{
			chrome.extension.sendRequest({ Command: "Icon", filename: "19.png" }, function (response) { });
			chrome.extension.sendRequest({ Command: "Images", Images: ImgDesc, Popup: "" }, function (response) { });
		}
	}
}

function HandleImages(Images)
{
	var Hash = new Array();
	var Res = new Array();
    for (var i=0; i<Images.length; i++)
    {        
        var width = Number(Images[i].width);
        if (width < 50) continue;
        var height = Number(Images[i].height);
        if (height < 50) continue;
        if (height*width < 40000)
            continue;
        var imgSrc = Images[i].src;
		
        var width = Images[i].naturalWidth;
        var height = Images[i].naturalHeight;
        var top = Images[i].getBoundingClientRect().top;
        var img = 
        {    
        	url: imgSrc,
        	width: width,
        	height: height,
        	hasLink: false
        };
        Hash[imgSrc] = img;
    }

    for (s in Hash)
    {
    	if (s != length)
    	{
    		Res.push(Hash[s]);
    	}
    }
    return Res;
}

function HandleFacebook()
{
	var photos = document.querySelectorAll('a[href*="photo.php"]');
	var Res = new Array();

	for (var i = 0; i < photos.length; i++) {
		var img = photos[i].getElementsByTagName("i");

		var PicInfo =
			{
				ajax: photos[i].href,
				url: null,
				width: 0,
				height: 0
			};

		for (var j = 0; j < img.length; j++) {

			var text = img[j].style.backgroundImage;
			console.log(img[j]);
			var pos = text.indexOf("(");
			if (pos != -1)
			{
				text = text.substr(pos+1, text.indexOf(")", pos+1) - pos -1);
			}

			if (text.length > 4) {
				PicInfo.url = text;
				PicInfo.width = 400;
				PicInfo.height = 400;
			}
		}
		
		if (PicInfo.url != null) {
			Res.push(PicInfo);
		}
	}

	return Res;
}

function Handle500px() {
	var photos = document.querySelectorAll('a[href*="photo/"]');
	var Res = new Array();

	for (var i = 0; i < photos.length; i++) {
		var img = photos[i].getElementsByTagName("img");

		var PicInfo =
			{
				ajax: photos[i].href,
				url: null,
				width: 0,
				height: 0
			};

		for (var j = 0; j < img.length; j++) {
			if (img[j].src) {
				var width = img[j].naturalWidth;
				var height = img[j].naturalHeight;

				PicInfo.url = img[j].src;
				PicInfo.width = width;
				PicInfo.height = height;
			}
		}

		if (PicInfo.url != null) {
			Res.push(PicInfo);
		}
	}
	return Res;
}

function HandlePinterest() {
	var photos = document.querySelectorAll('a[href*="pin/"]');
	var Res = new Array();

	for (var i = 0; i < photos.length; i++) 
	{
		var img = photos[i].getElementsByTagName("img");

		var PicInfo =
			{
				ajax: photos[i].href,
				url : null,
				width: 0,
				height: 0
			};

		for (var j = 0; j < img.length; j++)
		{
			if (img[j].src)
			{
				PicInfo.url = img[j].src;
				PicInfo.width = img[j].naturalWidth;
				PicInfo.height = img[j].naturalHeight;
			}
		}		
		
		if (PicInfo.url != null)
		{
			Res.push(PicInfo);
		}
	}
	return Res;
}

function Handle()
{
	var Images = new Array();
	if (document.URL.indexOf("facebook.com") != -1)
	{		
		Images = HandleFacebook();
	}
	else if (document.URL.indexOf("500px.com") != -1)
	{
		Images = Handle500px();
	}
	else if (document.URL.indexOf("pinterest.com") != -1)
	{		
		Images = HandlePinterest();
	}
	else
	{
		var RawImages = document.getElementsByTagName('img');
		Images = HandleImages(RawImages);
	}
	if (Images.length > 0)
	{
		Update(Images);
	}
}

var lastTimeStamp = 0;

document.addEventListener("DOMSubtreeModified", function(event){
	if (event.timeStamp > lastTimeStamp + 1000)
	{
		lastTimeStamp = event.timeStamp;
		Handle();
	}
});

Handle();
