
var status=false;


//popover callback function to bind addTask event
var tmp = $.fn.popover.Constructor.prototype.show;
$.fn.popover.Constructor.prototype.show = function () { tmp.call(this); if (this.options.callback) { this.options.callback(); } }
jQuery.fn.exists = function(){return this.length>0;};

setInterval(function() { addAsustorBtn(); }, 1000);

function addAsustorBtn(){
	if(!$('#AsustorYoutubeBtn').exists() && $('.playlist-actions').exists()  && status == "enabled")
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

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if(request.purpose == 'takeasyCloseContentScript'){
		$('#AsustorYoutubeBtn').removeAttr("disabled");
		$('#AsustorYoutubeBtn').css('background-image',"url('"+chrome.extension.getURL("images/Takeasy_02.png")+"')");
	}
	else if(request.purpose == "getTakeasyStatusResult")
	{
		status = request.status;
		if(status!="enabled")
			$("#AsustorYoutubeBtn").remove();
	}	
});

chrome.runtime.sendMessage({purpose: "getTakeasyStatus"});