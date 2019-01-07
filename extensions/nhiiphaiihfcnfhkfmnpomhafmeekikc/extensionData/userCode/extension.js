  /************************************************************************************
  This is your Page Code. The appAPI.ready() code block will be executed on every page load.
  For more information please visit our docs site: http://docs.crossrider.com
*************************************************************************************/


appAPI.ready(function($) {
    
   appAPI.resources.includeJS('jquery.js');
   appAPI.resources.includeCSS('styles.css', { });
 
if(!inIframe()){

	if(!document.getElementById("openCommentIframe")) {
		
		var newElement = document.createElement("div");
		newElement.id = 'putinherechatt';
		document.body.insertBefore(newElement, document.body.firstChild);
		
		$('#putinherechatt').html('<iframe id="openCommentIframe" sandbox="allow-same-origin allow-scripts allow-forms allow-popups" src="http://google.ca" ></iframe>');
		
		/*var newElement = document.createElement("iframe");
		newElement.setAttribute("sandbox","allow-same-origin,allow-scripts,allow-forms");
		newElement.id = 'openCommentIframe';
		document.body.insertBefore(newElement, document.body.firstChild);*/
	}
}
function inIframe () {  try { return window.self !== window.top; } catch (e) { return true; } }


});

var lid = appAPI.message.addListener(function(msg) { 
    if($("#openCommentIframe").width()>0){
		$("#openCommentIframe").stop().animate({ width: "0px"  }, 400, function() { });
	}else{
		document.getElementById('openCommentIframe').src = 'https://gator4079.hostgator.com/~rivison/chatterbox/index.php?theurl=' + encodeURIComponent(document.URL) 
		$("#openCommentIframe").stop().animate({ width: "300px"  }, 400, function() { });
	}
});
