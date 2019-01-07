
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
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    sendResponse({count: deletedCount});
});

var deletedCount = 0;
var fbDeletedCount = 0;
var youtubeDeletedCount = 0;
var xpathPatterns = [ ];

var badWords = [ 
    'trump', 'donald trump', 'the donald', 'trump campaign', 'donaldtrump'
    ];
    
    for(var i = 0; i < badWords.length; i++) {

        var word = badWords[i];
        xpathPatterns.push(
    "//text()[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '" + word + "')]",
    "//a[contains(translate(@href, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'),'" + word + "')]",
    "//img[contains(translate(@src, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'),'" + word + "')]",
    "//img[contains(translate(@alt, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'),'" + word + "')]"
                );
    }

if (true)
    window.addEventListener("load", function() {
        var array = new Array();
        for (i = 0; i < xpathPatterns.length; i++) {
            var xpathResult =
                    document.evaluate(xpathPatterns[i],
                            document, null,
                            XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
            var thisNode = xpathResult.iterateNext();
            while (thisNode) {
                array.push(thisNode);
                thisNode = xpathResult.iterateNext();
            }
        }
		deletedCount = deletedCount + array.length;
        for (var i = 0; i < array.length; i++) {
            var p = array[i].parentNode;
            if(p !== null) 
				p.removeChild(array[i]);
        }
		

    });
	
	
     function autoRun() {

        var array = new Array();
        for (i = 0; i < xpathPatterns.length; i++) {
            var xpathResult =
                    document.evaluate(xpathPatterns[i],
                            document, null,
                            XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
            var thisNode = xpathResult.iterateNext();
            while (thisNode) {
                array.push(thisNode);
                thisNode = xpathResult.iterateNext();
            }
        }
        deletedCount = deletedCount + array.length;
		
        for (var i = 0; i < array.length; i++) {
            var p = array[i].parentNode;
            if(p !== null) 
				p.removeChild(array[i]);
        }
		
    }
	
	setTimeout(autoRun, 1000);
	setInterval(autoRun, 2000);
	
	if (true)
    window.addEventListener("scroll", function() {

        var array = new Array();
        for (i = 0; i < xpathPatterns.length; i++) {
            var xpathResult =
                    document.evaluate(xpathPatterns[i],
                            document, null,
                            XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
            var thisNode = xpathResult.iterateNext();
            while (thisNode) {
                array.push(thisNode);
                thisNode = xpathResult.iterateNext();
            }
        }
      
		deletedCount = deletedCount + array.length;
        for (var i = 0; i < array.length; i++) {
            var p = array[i].parentNode;
            if(p !== null) 
				p.removeChild(array[i]);
        }
		
    });
	
	(function() {
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            var newNodes = mutation.addedNodes;
            if (newNodes !== null) {                
                
                var nodes = document.querySelectorAll('.userContentWrapper, ._1bar, ._5my2, ._4qjp, ._2kg4');
                for (var ii = 0, nn = nodes.length; ii < nn; ii++)
                {
                    var text = nodes[ii] ? nodes[ii].textContent.toLowerCase() : '';
                    if (text && text.indexOf('donald') >= 0 && text.indexOf('trump') >= 0 && nodes[ii].style.display != 'none')
                    {
						deletedCount = deletedCount + 1;
						fbDeletedCount = fbDeletedCount + 1;
                        nodes[ii].style.display = 'none';
						
                       
                    }
                }

            }
        });
    });

    observer.observe(document, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false,
    });

})();


chrome.runtime.sendMessage({
	"name": "pageAction",
	"content": "show"
});

var video_selectors = [
	{
		"container": ".yt-shelf-grid-item",
		"channel": ".yt-lockup-byline .g-hovercard",
		"title": ".yt-lockup-title > a.spf-link"
	},
	{
		"container": ".lohp-medium-shelf",
		"channel": ".yt-lockup-byline .g-hovercard",
		"title": ".yt-lockup-title > a.spf-link"
	},
	{
		"container": ".lohp-large-shelf-container",
		"channel": ".yt-lockup-byline .g-hovercard",
		"title": ".yt-lockup-title > a.spf-link"
	},
	{
		"container": ".expanded-shelf-content-item-wrapper",
		"channel": ".yt-lockup-byline .g-hovercard",
		"title": ".yt-lockup-title > a.spf-link"
	},
	{
		"container": ".pl-video-table .pl-video",
		"channel": ".pl-video-owner .g-hovercard",
		"title": ".pl-video-title a.spf-link"
	},
	{
		"container": ".video-list .video-list-item",
		"channel": ".attribution .g-hovercard",
		"title": "a.spf-link > .title"
	},
	{
		"container": ".playlist-videos-list > li",
		"channel": ".video-uploader-byline > span",
		"title": "h4.yt-ui-ellipsis"
	},
	{
		"container": ".videowall-still",
		"channel": ".videowall-still-info-author",
		"title": ".videowall-still-info-title"
	},
	{
		"container": ".branded-page-related-channels-list .branded-page-related-channels-item",
		"channel": ".yt-lockup-title > .yt-uix-tile-link"
	},
	{
		"container": "#results .section-list .item-section > li",
		"channel": ".yt-lockup-byline .g-hovercard",
		"title": ".yt-lockup-title > a"
	},
	{
		"container": ".yt-gb-shelf .yt-gb-shelf-hero",
		"channel": ".qualified-channel-title-wrapper > .g-hovercard > a"
	},
];


$(document).ready(function(){
	

		
	hide_videos();
	
	var mutationTarget = document.getElementById("page");
	var mutationObserver = new MutationObserver(function(mutations) {
		hide_videos();
	});
	var mutationConfig = {
		"childList": true,
		"subtree": true
	};
	mutationObserver.observe(mutationTarget, mutationConfig);
	
});


function hide_videos() {
	
	chrome.storage.local.get(function(items){
		
		
		for ( var i = 0; i < video_selectors.length; i++ ) {
			
			
			$( video_selectors[i].container ).each(function(){
				
				var inside_array = false,
					title = $( video_selectors[i].title, this ).text().trim();
				
			
				
					if (title.toLowerCase().indexOf('trump') >= 0) {
						inside_array = true;

					}
					
			
			
				if ( inside_array ) {

					deletedCount = deletedCount + 1;
					youtubeDeletedCount = youtubeDeletedCount + 1;
					$(this).remove();

				}
				
			});
				
		}

		for ( var i = 0; i < video_selectors.length; i++ ) {
			$(video_selectors[i].container).css({visibility: "visible"});
		}
		
		fix_thumbnails();
		
	});
	
}

function fix_thumbnails() {
	
	jQuery(".yt-thumb img").each(function(){

		if( jQuery(this).attr("data-thumb") != $(this).attr("src") )
			jQuery(this).attr("src",$(this).attr("data-thumb"));
		
	});
	
}


