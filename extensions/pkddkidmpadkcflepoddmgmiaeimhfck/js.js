	var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-36555884-1']);
  _gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script');
  ga.type = 'text/javascript';
  ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(ga, s);
})();
		
		
		jQuery(document).ready(function() {

    var now = (new Date()).getTime() / 1000;
	
   if ( !localStorage.cache || now - parseInt(localStorage.time) > 1 * 60 * 60 )
	//if (1==1)
   {
	   
        $.get("http://yvision.kz", function(data) {
           var html = $(".mainContent",data);
		  
		   $(".home_article1", html).each(function(index, element) {
		   
			if (!$(element).parent().parent().hasClass('company_slide')) {
				$('.hold img',element).removeAttr('width').css('height','80px');
				$('.hold', element).append($('.text .info', element));
				$('.opt li:last-child',element).remove();
				$("#body").append(element);
			}
           });
		   $("a","#body").bind("click",function() {openInNewTab($(this).attr("href"))})
			localStorage.cache  = $("#body").html();
            localStorage.time   = now;
            
        }, 'html');

  }else{
        $('#body').html(localStorage.cache);
		$("a","#body").bind("click",function() {openInNewTab($(this).attr("href"))})

    }




})

function openInNewTab(url) {
  chrome.tabs.create({'url':url, 'selected':true});
}