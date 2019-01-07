
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



var addTaskHtmlTakeasy = '<span>'+chrome.i18n.getMessage('CDC_QUALITY')+':</span><select style="top: 10px;position:relative;float:left;" id="takeasyFormatSelection"></select><br/><a class="btn myBtn"  style="margin-top: 20px;" name="Download" id="downloadTaskSubmitTakeasy" >'+chrome.i18n.getMessage('CDC_DOWNLOAD')+'</a><a class="btn myBtn" style="margin-left:10px;margin-top: 20px;" name="Cancel" id="downloadTaskCancelTakeasy" >'+chrome.i18n.getMessage('CDC_CANCEL')+'</a>';
var addTaskHtmlTakeasyPlaylist = '<input type="radio" checked value="single" name="typeSelect"></input>&nbsp;'+chrome.i18n.getMessage('CDC_DOWNLOAD_SINGLE_VIDEO')+'<br/><br/><input type="radio" value="playlist" name="typeSelect"></input>&nbsp;'+chrome.i18n.getMessage('CDC_DOWNLOAD_PLAYLIST')+'<br/><br/><a class="btn myBtn"  name="Download" id="downloadTaskSubmitTakeasy" >'+chrome.i18n.getMessage('CDC_DOWNLOAD')+'</a><a class="btn myBtn" style="margin-left:10px;" name="Cancel" id="downloadTaskCancelTakeasy" >'+chrome.i18n.getMessage('CDC_CANCEL')+'</a>';
var formats;
var single_url;
var urls;
var status=false;

//popover callback function to bind addTask event
var tmp = $.fn.popover.Constructor.prototype.show;
$.fn.popover.Constructor.prototype.show = function () { tmp.call(this); if (this.options.callback) { this.options.callback(); } }
jQuery.fn.exists = function(){return this.length>0;};

setInterval(function() { addAsustorBtn(); }, 1000);

setInterval(function() {
	var dl_url = window.location.toString();
	if(dl_url.indexOf("www.youtube.com/watch") != -1)
	{
		if($('#AsustorYoutubeBtn').exists() &&!$('#AsustorYoutubeBtn').hasClass('enabled'))
			chrome.runtime.sendMessage({purpose: "getVideoFormat", dl_url:dl_url}); 
	}
	
}, 5000);

function addAsustorBtn(){
	if(!$('#AsustorYoutubeBtn').exists()  && status == "enabled")
	{
		if($('#watch-dislike').exists())
		{
			var dl_url = window.location.toString();
			
			$('#watch-like-dislike-buttons').append("<input data-placement='bottom' type=button id='AsustorYoutubeBtn' class='yt-uix-button yt-uix-button-text'  style=\"margin-left: 10px;border-radius:0px;background-image:url('"+chrome.extension.getURL("images/Takeasy_03.gif")+"');\"></input>");
			chrome.runtime.sendMessage({purpose: "getVideoFormat", dl_url:dl_url});
		}
		else if($('.playlist-actions').exists())
		{
			var dl_url = window.location.toString();
			
			$('.playlist-actions').append("<input data-placement='bottom' type=button id='AsustorYoutubeBtn' class='yt-uix-button yt-uix-button-text'  style=\"background-image:url('"+chrome.extension.getURL("images/Takeasy_02.png")+"');\"></input>");
			$('#AsustorYoutubeBtn').click(function(){
					if($(this).attr("disabled") == "true")
						return ;
					$(this).attr("disabled","true");
					$(this).css('background-image',"url('"+chrome.extension.getURL("images/Takeasy_03.gif")+"')");
					chrome.runtime.sendMessage({purpose: "getVideoFormat", dl_url:window.location.toString()});
				});
		}
	}
}
chrome.runtime.sendMessage({purpose: "getTakeasyStatus"});

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if(request.purpose == 'takeasyCloseContentScript'){
		$('#AsustorYoutubeBtn').removeAttr("disabled");
		$('#AsustorYoutubeBtn').css('background-image',"url('"+chrome.extension.getURL("images/Takeasy_02.png")+"')");
	}
	if($('#AsustorYoutubeBtn').hasClass('enabled'))
		return;
    if(request.purpose == 'takeasyFormatContentScript'){
		if( request.url != window.location.toString())
			return;
		$('#AsustorYoutubeBtn').addClass('enabled');
		$("#AsustorYoutubeBtn").css('background-image',"url('"+chrome.extension.getURL("images/Takeasy_02.png")+"')");
		$("#AsustorYoutubeBtn").popover({html:true,content:addTaskHtmlTakeasy,callback:clickCallBack}).click(function(e) {
			e.preventDefault(); 
		}).on("hidden", function(e) {
		   $("#AsustorYoutubeBtn").css('background-image',"url('"+chrome.extension.getURL("images/Takeasy_02.png")+"')");
		});
		formats = request.formats;
		//alert("saved");
	}
    else if(request.purpose == 'takeasyFormatPlaylistContentScript'){
		if( request.url != window.location.toString())
			return;	
		$('#AsustorYoutubeBtn').addClass('enabled');
		$("#AsustorYoutubeBtn").css('background-image',"url('"+chrome.extension.getURL("images/Takeasy_02.png")+"')");
		$("#AsustorYoutubeBtn").popover({html:true,content:addTaskHtmlTakeasyPlaylist,callback:clickCallBackPlaylist}).click(function(e) {
			e.preventDefault(); 
		}).on("hidden", function(e) {
		   $("#AsustorYoutubeBtn").css('background-image',"url('"+chrome.extension.getURL("images/Takeasy_02.png")+"')");
		});
		//alert("saved");
	}	
	else if(request.purpose == "errorOccured")
	{
		$("#AsustorYoutubeBtn").css('background-image',"url('"+chrome.extension.getURL("images/Takeasy_01.png")+"')");
		$('#AsustorYoutubeBtn').addClass('enabled');
	}
	else if(request.purpose == "getTakeasyStatusResult")
	{
		status = request.status;
		if(status!="enabled")
			$("#AsustorYoutubeBtn").remove();
	}
});

function clickCallBack()
{
	$("#AsustorYoutubeBtn").css('background-image',"url('"+chrome.extension.getURL("images/Takeasy_01.png")+"')");
	$('#takeasyFormatSelection').html('');
	$('#downloadTaskSubmitTakeasy').click(function(){
		chrome.runtime.sendMessage({purpose: "addVideoTask", dl_url:window.location.toString(), format:$('#takeasyFormatSelection').val()});
		$("#AsustorYoutubeBtn").popover('hide');
		$("#AsustorYoutubeBtn").css('background-image',"url('"+chrome.extension.getURL("images/Takeasy_02.png")+"')");
	});
	$('#downloadTaskCancelTakeasy').click(function(){
		$("#AsustorYoutubeBtn").popover('hide');
		$("#AsustorYoutubeBtn").css('background-image',"url('"+chrome.extension.getURL("images/Takeasy_02.png")+"')");
	});
	for(var key in formats)
	{
		$('#takeasyFormatSelection').append($("<option>", {value:formats[key].format, text: formats[key].dimension +'('+formats[key].ext+')'}));
	}
	if($('#takeasyFormatSelection').html().length == 0)
		$('#takeasyFormatSelection').append($("<option>", {value:-1, text: chrome.i18n.getMessage('CDC_DEFAULT')}));
}

function clickCallBackPlaylist()
{
	$("#AsustorYoutubeBtn").css('background-image',"url('"+chrome.extension.getURL("images/Takeasy_01.png")+"')");
	$('#downloadTaskSubmitTakeasy').click(function(){
		var type=$("input[name='typeSelect']:checked").val();
		chrome.runtime.sendMessage({purpose: "addVideoTaskPlaylist", type:type,dl_url:window.location.toString()});
		$("#AsustorYoutubeBtn").popover('hide');
		$("#AsustorYoutubeBtn").css('background-image',"url('"+chrome.extension.getURL("images/Takeasy_02.png")+"')");
	});
	$('#downloadTaskCancelTakeasy').click(function(){
		$("#AsustorYoutubeBtn").popover('hide');
		$("#AsustorYoutubeBtn").css('background-image',"url('"+chrome.extension.getURL("images/Takeasy_02.png")+"')");
	});
}

function closePopup()
{
	setTimeout(function() { $("#AsustorYoutubeBtn").popover('hide');$("#AsustorYoutubeBtn").css('background-image',"url('"+chrome.extension.getURL("images/Takeasy_02.png")+"')"); }, 1000)
}
