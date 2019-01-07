/// <reference path="../chrome_extensions.js" />
/// <reference path="../webkit_console.js" />

var ImageURLs;

var CurrentTab;
var left = 0;
//https://chrome.google.com/webstore/detail/oneclick-picsaver-image-d/klpnlinfkbamngjobmipfdojflgmaamj
var AppID = "klpnlinfkbamngjobmipfdojflgmaamj";
// Debug
//var AppID = "ocalkfbclmefhalhkpldnldkchnmfmbk";

//------------------------------------------------------------------------------

function SetIcon(name)
{
    chrome.pageAction.setIcon({ tabId: CurrentTab.id, path: name });
}

//------------------------------------------------------------------------------

function SetIconCounted(percent)
{
	var id = Math.round(15 * percent);
	if (id == 0)
		id = 16;
    var name = id.toString() + ".png";
    SetIcon(name);
}

//------------------------------------------------------------------------------

function GetTitleFromURL(url)
{
    var title = url.substr(url.lastIndexOf("/")+1);
    
    return title;
}

//------------------------------------------------------------------------------

function getImages(tab) 
{
    var imgs = new Array();
    var bkpage = chrome.extension.getBackgroundPage();

    var photos = bkpage.Images[tab.id.toString() + tab.url];

    if (!photos)
    {
    	console.log("Var 'photos' is undefined, that means, no data for this tab available");
    	return imgs;
	}

    for (var i = 0; i<photos.length; i++) 
    {        
    	var url = {
    		url: photos[i].url,
    		ajax: photos[i].ajax,
    		filename: GetTitleFromURL(photos[i].url),
    		width: photos[i].width,
    		height: photos[i].height
    	};
        imgs.push(url);
    };
    
    return imgs;
}

//------------------------------------------------------------------------------

function insertElipsis(maxSize, String)
{
    if (String.length > maxSize)
    {
        String = String.substr(0,maxSize/4-3)+"..."+String.substr(String.length-maxSize/2);
    }
    return String;
}

//------------------------------------------------------------------------------

function getWidth(Image)
{
    var sh = 1;
    if (Image.height>150)
        sh = 150/Image.height;
    var width = sh * Image.width;
    if (width > 200)
        return 200;
    
    return width;
}

//------------------------------------------------------------------------------

function showPhotos(tab) 
{
    var Images = getImages(tab);

    SetIcon("16.png");
    var mydiv = document.getElementById("main");
	
	ImageURLs = new Array();
	
    var icount = document.getElementById("ImgCount");
    if (icount)
        icount.innerHTML ="Image count: "+Images.length.toString();
	
    var MainWidth = 0;
    for (var i = 0; i<Images.length; i++) 
    {		
		var img_container = document.createElement("div");
		img_container.className="img_container";
		img_container.id = "img_container_"+i.toString();	
					
		var img_placer = document.createElement("div");
		img_placer.className = "img_placer";
				
		var img = document.createElement("img");
		img.src = Images[i].url;
		console.log("url = " + img.src);
		
		img.className = "Image";
				
		var span = document.createElement("span");
		span.className = "img_holder";
				
		var CheckBox = document.createElement("input");
			
		CheckBox.setAttribute("type", "checkbox");
		CheckBox.setAttribute("checked", "checked");
		CheckBox.setAttribute("onclick", "onCheckPicture()");
		CheckBox.className="img_checkbox";
		CheckBox.id = "img_checkbox_"+i.toString();
			
		var label = document.createElement("label");
		label.setAttribute("for","img_checkbox_"+i.toString());
		label.innerHTML = insertElipsis(getWidth(Images[i]) / 8, Images[i].filename);
                
		span.appendChild(img);
		img_placer.appendChild(span);
		img_placer.appendChild(CheckBox);	
		img_placer.appendChild(label);
			
		img_container.appendChild(img_placer);
		mydiv.appendChild(img_container);

		var container = {
			ajax: Images[i].ajax,
			url: Images[i].url,
			checkbox: CheckBox,
			img_id: img_container.id
		};
		ImageURLs.push(container);
		document.getElementById("img_container_"+i.toString()).addEventListener("click", onCheckPicture);
                
                MainWidth += getWidth(Images[i]) + 50;
    }
    if (MainWidth < 750)
        document.body.style.width = MainWidth+"px";
}

//------------------------------------------------------------------------------

function onWriteFiles(writableEntry)
{
    alert(writableEntry);
}

//------------------------------------------------------------------------------

function onCheckPicture()
{
	var counter = 0;
    for (var i = 0, photo; photo = ImageURLs[i]; i++) 
    {	
		if (photo.img_id.localeCompare(this.id) === 0)
		{
			photo.checkbox.checked = !photo.checkbox.checked;
		}
		if (photo.checkbox.checked)
			counter++;
	}
	
	var icount = document.getElementById("ImgCount");
    if (icount)
        icount.innerHTML ="Image count: "+counter;
}

//------------------------------------------------------------------------------

function ParsePinterest(text)
{
	var resurl = "";
	var pos = text.indexOf('<div class="imageContainer"');
	if (pos != -1) {

		var ImagePos = text.indexOf('src="', pos + 4);
		if (ImagePos != -1) {
			ImagePos += 5;
			resurl = text.substr(ImagePos, text.indexOf('.jpg', ImagePos) - ImagePos + 4);
		}
	}
	return resurl;
}

//------------------------------------------------------------------------------

function ParseFacebook(text)
{
	var resurl = "";
	var pos = text.indexOf('<img class="fbPhotoImage');
	if (pos != -1) {
		var ImagePos = text.indexOf('https://', pos + 10);
		if (ImagePos != -1) {
			resurl = text.substr(ImagePos, text.indexOf('.jpg', ImagePos) - ImagePos + 4);
		}
	}
	return resurl;
}

//------------------------------------------------------------------------------

function Parse500px(text)
{
	var resurl = "";
	var pos = text.indexOf("<div class='photo segment'");
	if (pos != -1) {

		var ImagePos = text.indexOf('src="', pos + 4);
		if (ImagePos != -1) {
			ImagePos += 5;
			resurl = text.substr(ImagePos, text.indexOf('.jpg', ImagePos) - ImagePos + 4);
		}
	}
	return resurl;
}

//------------------------------------------------------------------------------

function sendMessage(message)
{
	console.log(message);

    left = 0;
    chrome.runtime.sendMessage(
		AppID,
		{command : "url", data : message},
		function(M)
		{
			left = ImageURLs.length;
			console.log("sent " + left + " images");
		}
	);
}

//------------------------------------------------------------------------------

function onSaveAll()
{
    SetIcon("15.png");

	var MessageContent = new Array();
	
	var status = document.getElementById("Status");
	if (status)
		status.innerHTML = "Please, wait...";

    for (var i = 0; i<ImageURLs.length; i++) 
    {
    	(function(iurl)
    	{
			if (iurl.checkbox.checked)
			{
				var href = iurl.ajax;
				if (href)
				{
					var req = new XMLHttpRequest();
					req.onreadystatechange = function () {
						if (req.readyState == 4) 
						{
							if (req.status == 200) 
							{
								var saveURL = "";
								if (href.indexOf("facebook") != -1)
								{
									saveURL = ParseFacebook(req.responseText);
								}
								else if (href.indexOf("pinterest") != -1)
								{
									saveURL = ParsePinterest(req.responseText);
								}
								else if (href.indexOf("500px.com") != -1)
								{
									saveURL = Parse500px(req.responseText);
								}
								if (saveURL.length > 5)
								{
									console.log("Status = " + req.status + " ReadyState = " + req.readyState + " "+saveURL);
									var msg = {
										url : saveURL
									};
									MessageContent.push(msg);

									if (status)
										status.innerHTML = "Parsed " + MessageContent.length + " images";

									if (MessageContent.length == ImageURLs.length)
									{
										if (status)
											status.innerHTML = "";
										sendMessage(MessageContent);
									}									
								}
							}
						}
					}
					req.open("GET", href, true);
					req.send();	
				}
				else
				{
					var msg = {
						url : ImageURLs[i].url
					};
					MessageContent.push(msg);				
				}			
			}
		})(ImageURLs[i]);
    }
    
    if (MessageContent.length > 0)
    {
    	if (status)
			status.innerHTML = "";
		sendMessage(MessageContent);
    }
    	
}

//------------------------------------------------------------------------------

function detectChromeExtension(extensionId, callback){
    chrome.runtime.sendMessage(
		extensionId,
		{command : "ping", data : ""},
		function(M)
		{
			var lastError = chrome.runtime.lastError;
			console.log(lastError);
		    if (lastError)
		        callback(false);
		    else
		    	callback(true);
		}
	);

};

//------------------------------------------------------------------------------

function CaseAppNotInstalled()
{
	var mainDiv = document.getElementById("global");
	mainDiv.style.visibility = "hidden";
	mainDiv.style.height = "0%";

	var InstallDiv = document.createElement("div");
	InstallDiv.id = "Installer";

	var ButtonDiv = document.createElement("div");
	ButtonDiv.id = "InstallBottom";
	
	var TextDiv = document.createElement("div");
	TextDiv.id = "InstallText";
	TextDiv.innerHTML = "You need to install PicSaver App to be able to save images";
	var button = document.createElement("input");
    button.type = "button";
    button.value = "Install";
    button.id = "InstallButton"

    button.onclick = function()
    {
    	console.log("function");
    	
    	chrome.tabs.create({ url: "https://chrome.google.com/webstore/detail/oneclick-picsaver-image-d/klpnlinfkbamngjobmipfdojflgmaamj" });
    };
    
    ButtonDiv.appendChild(button);
	InstallDiv.appendChild(ButtonDiv);
	InstallDiv.appendChild(TextDiv);

	document.body.appendChild(InstallDiv);
}

//------------------------------------------------------------------------------

function onShowPopup()
{
	var element = document.getElementById("Installer");
	if (element)
	{
		element.parentNode.removeChild(element);
		element.remove();
	}
			
	var mainDiv = document.getElementById("global");
	mainDiv.style.visibility = "visible";
	mainDiv.style.height = "100%";

	detectChromeExtension(AppID,function(Installed)
	{
		console.log("App installed = " + Installed);
		if (Installed)
		{
			chrome.tabs.getSelected(null, function (tab)
			{
				CurrentTab = tab;
				showPhotos(tab);
			});
		}
		else
		{
			CaseAppNotInstalled();
		}
	});	
}

//------------------------------------------------------------------------------

function onRecieveMessage(Message)
{	
	left--;
	if (left < 1)
		SetIcon("18.png");
	else
		SetIconCounted(left / ImageURLs.length);

	console.log("Left " + left + " images");
}

//------------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", function () 
{
    document.getElementById("idSaveAll").addEventListener("click", onSaveAll);
});

// Chrome on unload bug workaround
window.addEventListener("unload", function() 
{
    chrome.extension.getBackgroundPage().changeIcon("18.png");
}, false);

//-----------------------------------------------------------------------------

chrome.runtime.onMessageExternal.addListener(onRecieveMessage);

window.onload = onShowPopup;
