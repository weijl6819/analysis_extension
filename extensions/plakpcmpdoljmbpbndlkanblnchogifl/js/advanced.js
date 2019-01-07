
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



//google analytics
/*
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-44539865-1']);
_gaq.push(['_trackPageview']);



(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
*/

var dl_url;
//popover callback function to bind addTask event
var tmp = $.fn.modal.Constructor.prototype.show;
$.fn.modal.Constructor.prototype.show = function () { tmp.call(this); if (this.options.callback) { this.options.callback(); } }

function trackButton(name) {
    //_gaq.push(['_trackEvent', name, 'clicked']);
  };

//setLocales
function setLocale(){
	$("[locale]").each(function(){
		$(this).html(chrome.i18n.getMessage($(this).attr("locale")));
	});
	
	$("[locale_title]").each(function(){
		$(this).attr("title",chrome.i18n.getMessage($(this).attr("locale_title")));
	});	
}

//document ready event
document.addEventListener('DOMContentLoaded', function () {
	
	chrome.runtime.sendMessage({purpose: 'getDlUrl'}, function(response) {
		dl_url = response.dl_url;
		//alert(response.alertMessage);

		showMessage(chrome.i18n.getMessage("CDC_DOWNLOAD_ADVANCED_LABEL"),$('#settingBody').html());
		
	});
	
	//set locale
	setLocale();


});

//display Messages
function showMessage(header,content){
	$('#settingBody').html('');
	$('#messageModal .messageHeader').html(header);
	$('#messageModal .messageContent').html(content);
	$('#messageModal').modal({callback:function(){
		
		$("#URLInput").val(dl_url);
		$(".myBtn[name=cancel]").click(function(){

		});

		$(".myBtn[name=add]").click(function(){
			
			var action;
			
			if($('input[name=dlType]:checked').val() == 'takeasy' )
				action = 'addInstantVideoTask';
			else
				action = 'addAdcTask';
			
			chrome.runtime.sendMessage({purpose: action,dl_url:$("#URLInput").val(),username:$('#userID').val(),password:$('#Password').val()}, function(response) {
			
			//alert(response.alertMessage);
			});	
		
			$('#messageModal').modal('hide');
		});
		
		$(".settingInput").keypress(function(event){       
			if (event.keyCode == 13) $(".myBtn[name=add]").click();
		});			
		
	}});

	$('#messageModal').on('hidden.bs.modal', function (e) {

		chrome.runtime.sendMessage({purpose: 'closeAdvance'}, function(response) {
		
		//alert(response.alertMessage);
		});
	} );
}


