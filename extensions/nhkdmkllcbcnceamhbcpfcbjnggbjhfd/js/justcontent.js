
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
var demoSeen = false;

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
   
     togglejust();
    if (request.greeting == "hello")
      sendResponse({farewell: "goodbye"});
  });


var isjusting_pyt = "NO";
var theOptions = "";

function get_options(callback) {
	var returner = "";
    chrome.storage.sync.get({
	loaded: true,
    fbshare: true,
    fbmessage: true,
    comment: false,
    tweet: true,
    reddit: false,
    instapaper: false,
    evernote: true,
    pocket: true,
    mail: true,
    ytplay: true,
    newtab: true,
    shortener: true,
    removeads: true,
    urlclickable: true,
    favicon: true,
    justMain: true,
    demoSeen: false
  }, function(items) {
	  demoSeen = items.demoSeen;
    theOptions = items;
    callback();
  });
  
}

   function insertEnhance(){
	    var s = document.createElement('script');
		s.src = chrome.extension.getURL('/js/jquery.js');
		document.getElementsByTagName('head')[0].appendChild(s);
		var s = document.createElement('script');
		s.src = chrome.extension.getURL('/js/justpage.js');
		document.getElementsByTagName('head')[0].appendChild(s);

    }
    

    
    




var test = "";
var theTitle = "";

function insertElements(where){

	var resultcount = document.getElementsByClassName(where).length; // ount of search results
	for (i = 0; i < resultcount; i++) { 

try {
var isDiv = document.getElementsByClassName('g')[i].tagName;
} catch (e){
	var isDiv = "NO";
}

if (isDiv != "DISV"){
	try{
var theUrl = document.getElementsByClassName(where)[i].getElementsByTagName('a')[0].href;
try {
 theTitle = document.getElementsByClassName(where)[i].getElementsByClassName('_Dk')[0].innerHTML; // if news
} catch (e){
}
if (theTitle === 'undefined' || !theTitle){
 theTitle = document.getElementsByClassName(where)[i].getElementsByClassName('r')[0].getElementsByTagName('a')
[0].innerHTML; //if featured
}
if (theTitle === 'undefined'){
		 theTitle = document.getElementsByClassName(where)[i].getElementsByTagName('a')[0].innerHTML; // normal

}

	//insert

	var xtradiv = insertXtraDiv(i,theUrl); //if xtradiv already there
	if (theUrl.indexOf("just.io") > 1 && !theOptions.demoSeen){
	insertDemoDiv(i,theUrl); //if xtradiv already there
	}
/*
	if (divCheck == "notNew"){
		return;
	}
*/
	
	
	$.when(xtradiv).done(function () {
/*
	if (theOptions.save){
// 		insertSave(i,theUrl);
	}
*/
try {
	
/*
	if (theOptions.urlclickable){
		correctGreenUrl(i,theUrl);
	}
*/
	
/*
	if (theOptions.favicon){
	insertfavicon(i,theUrl);
	}
*/
	if (theOptions.ytplay){
		insertYTPlay(i,theUrl);
	}
/*
	if (theOptions.newtab){
			openInNew(i,theUrl);
	}

	
	
	if (theOptions.tweet){
		insertTweet(i,theUrl);
	}
	if (theOptions.fbshare){
		insertFBshare(i,theUrl);
	}
	if (theOptions.fbmessage){
	insertFBmessage(i,theUrl);
	}
	if (theOptions.shortener){
	insertShortener(i,theUrl);
	}
	
	if (theOptions.mail){
			insertMail(i,theUrl,theTitle);
	}
	
	if (theOptions.reddit){
			

		insertReddit(i,theUrl);
	}
	
	if (theOptions.instapaper){
		insertInstapaper(i,theUrl,theTitle);
	}
	
 	if (theOptions.evernote){


		insertEvernote(i,theUrl,theTitle);
		}
			if (theOptions.pocket){
		insertPocket(i,theUrl,theTitle);
		
		}
	
	if (theOptions.comment){
		insertCommentToggle(i,theUrl);
		
		insertCommentCount(i,theUrl);
	}
	insertInfobox(i);
*/
	
} catch (e){
}
});
	
	

	
	
	theTitle = "undefined";
	


	} catch (e){
		
	}
	  } else {
	  
  }
  
	}	
	var justEnabled = localStorage.getItem("justEnabled");
	if (!justEnabled){
		justEnabled = "YES";
		chrome.storage.sync.set({
		justEnabled: "YES"
    
    
  		}, function() {
  });
		
	}
	var isjusted_pyt = document.getElementsByClassName('enhance3845')[0].style.display;
	
	if (justEnabled != "NO" && isjusted_pyt != "block"){
			$('.enhance3845').animate({ width: 'toggle', opacity: 'toggle' }, 'slow'); 
			$('.enhance3843').animate({ height: 'toggle', opacity: 'toggle' }, 'slow'); 
			$('.videoplayer').animate({ height: 'toggle', opacity: 'toggle' }, 'slow'); 
			$('.fb-comment').animate({ height: 'toggle', opacity: 'toggle' }, 'slow'); 
			
			$( "#togglejust" ).removeClass("justsettings2");
			$( "#togglejust" ).addClass("justsettings");
	} else {
	}

}

function insertXtraDiv(i,theUrl){
	
	var element = document.createElement("DIV");        // Create a <button> element
	element.className = "enhance3843";
	element.innerHTML = "";
	element.id = "enhance3843_" + i;
	try {
		var recheck = document.getElementById("enhance3843_" + i).id;
		if (recheck == "enhance3843_" + i){
			return;
		}
	} catch (e){
	}
	try{
	document.getElementsByClassName('g')[i].getElementsByClassName('rc')[0].appendChild(element); 
	} catch (e){
	document.getElementsByClassName('g')[i].appendChild(element); 

	}
	return "done";
	
}

function insertDemoDiv(i,theUrl){
	
	var element = document.createElement("DIV");        // Create a <button> element
	element.className = "enhance3849";
	element.innerHTML = "";
	element.id = "enhance3849";

	element.innerHTML = "Alright... click on any of the buttons above, to share or save or whatever you like to do...";
	try {
		var recheck = document.getElementById("enhance3849").id;
		if (recheck == "enhance3849"){
			return;
		}
	} catch (e){
	}
	try{
	document.getElementsByClassName('g')[i].getElementsByClassName('rc')[0].appendChild(element);
	} catch (e){
	document.getElementsByClassName('g')[i].appendChild(element); 
	
	}
	$( "#enhance3849").animate({width: 'show'});
	document.getElementById("enhance3843_" + i).className = "enhance3843 justdemoresult";

	$( "#enhance3843_" + i ).click(function() {
	demoUpdate1(i);

	});
	return "done";
	
}



function startEnhancing() {
	
		var resultcount = document.getElementsByClassName('g').length; // all results

			get_options(function(){
				
				if (theOptions.justMain){
	} else {
		return;
	}
			if (theOptions.justMain){    
// 			insertToggle();
			insertElements('g');
			
			loadFBSDK();
				
			
			
			try {
				FB.XFBML.parse();
			} catch(err) {
			}
			
			

			}
		});
			
}


function insertInfobox(i){
	try {
			var isThere = document.getElementById("infobox_" + i).id;
			if (isThere == "infobox_" + i){
				return;
			}
		} catch (e){
		}
	
	var element = document.createElement("DIV");        // Create a <button> element
	element.className = "enhance3844 enhanceInfobox";
	element.innerHTML = "";
	element.id = "infobox_" + i;
	document.getElementById("enhance3843_" + i).appendChild(element);


}



function updateInfobox(info,i,fbcomm){
	
	if (fbcomm == "yes"){
		try{
			var commnr = document.getElementById("enhance3843_" + i).appendChild(element);getElementsByClassName('fb_comments_count')[0].innerHTML;
			} catch (e){
		var commnr = "0";
	}
		
		commnr = " (" + commnr + " comments)";
	} else {
		var commnr = "";
	}
	try {
	document.getElementById('infobox_' + i).innerHTML = info + commnr ;
	} catch (e){
		
	}
}



function insertTweet(i,theUrl){
	try {
			var isThere = document.getElementById("justTweet_" + i).id;
			if (isThere == "justTweet_" + i){
				return;
			}
		} catch (e){
		}
	var element = document.createElement("DIV");        // Create a <button> element
	element.className = "enhance3844";
	element.id = "justTweet_" + i;
		$(element).hover(function(){updateInfobox('tweet this',i,"no");},function(){updateInfobox('',i,"no");})

	element.innerHTML = "<a href='#' target='_blank'  onClick=\"window.open('https://twitter.com/intent/tweet?url="+ encodeURIComponent(theUrl) +"','TweetThis "+ i +" ','resizable,height=260,width=370'); return false;\"><div class='justButton'><i class='fa fa-twitter'></i></div></a>";


	document.getElementById("enhance3843_" + i).appendChild(element);
}

function insertShortener(i,theUrl){
	try {
			var isThere = document.getElementById("shortener_" + i).id;
			if (isThere == "shortener_" + i){
				return;
			}
		} catch (e){
		}
	var element = document.createElement("DIV");        // Create a <button> element
	element.className = "enhance3844";
		$(element).hover(function(){updateInfobox('shorten url',i,"no");},function(){updateInfobox('',i,"no");})
		element.id = "shortener_" + i;

	element.innerHTML = "<a href='javascript:createShort(\""+theUrl+"\","+i+");'><div class='justButton'><i class='fa fa-link'></i></div></a>";
	document.getElementById("enhance3843_" + i).appendChild(element);
	
	var element = document.createElement("DIV");        // Create a <button> element
	element.className = "enhance3844";
	element.innerHTML = "<i class='fa fa-check shortened'></i>";
	element.id = "shortencheck_" + i;
	element.style.display = "none";
	document.getElementById("enhance3843_" + i).appendChild(element);
	
	var element = document.createElement("DIV");        // Create a <button> element
	element.className = "enhance3847 enhanceShortener";
	element.id = "shortened_" + i;
	element.style.display = "none";
	element.innerHTML = "<img src='' id='loader_shorten_"+i+"' class='loader_shorten'>";
	document.getElementById("enhance3843_" + i).parentNode.appendChild(element);
	document.getElementById("loader_shorten_" + i).src  = chrome.extension.getURL("icons/ajax-loader.gif");
}


function insertYTPlay(i,theUrl){
	
	try {
			var isThere = document.getElementById("enhanceyt_" + i).id;
			if (isThere == "enhanceyt_" + i){
				return;
			}
		} catch (e){
		}
		try {
			var isThere = document.getElementById("enhanceNA_" + i).id;
			if (isThere == "enhanceNA_" + i){
				return;
			}
		} catch (e){
		}
		try {
			var isThere = document.getElementById("enhanceytremove_" + i).id;
			if (isThere == "enhanceytremove_" + i){
				return;
			}
		} catch (e){
		}
	
	var isYT = theUrl.indexOf("youtube.com/watch?v=");
	var test = document.getElementById("enhance3843_" + i).tagName;
	
	if (isYT > 0){
	var isYTvid = theUrl.indexOf("v=");
		if (isYTvid > 0){
			var element = document.createElement("DIV");
			element.className = "enhance3844";
				$(element).hover(function(){updateInfobox('play video',i);},function(){updateInfobox('',i);})
				element.id = "enhanceyt_" + i;
			element.innerHTML = "<a href='javascript:ytplay(\""+theUrl+"\","+i+");'><div class='justButton'><i class='fa fa-youtube-play'></i></div></a>";
			document.getElementById("enhance3843_" + i).appendChild(element);
			
			var element = document.createElement("DIV");        // Create a <button> element
			element.className = "enhance3844";
				$(element).hover(function(){updateInfobox('close video',i);},function(){updateInfobox('',i);})
			element.id = "enhanceytremove_" + i;
			element.innerHTML = "<a href='javascript:ytRemove("+i+");'><div class='justButton'><i class='fa fa-remove'></i></div></a>";
			element.style.display = "none";
			document.getElementById("enhance3843_" + i).appendChild(element);
			
			
			
		} 
	} else { // no video
		
/*
			var element = document.createElement("DIV"); 
			element.className = "enhance3844 ytNA";
			$(element).hover(function(){updateInfobox('no video',i);},function(){updateInfobox('',i);})
			element.id = "enhanceNA_" + i;
			element.innerHTML = "<i class='fa fa-youtube-play'></i>";
			document.getElementById("enhance3843_" + i).appendChild(element);
*/
			
		}
}

function insertFBmessage(i,theUrl){
	try {
			var isThere = document.getElementById("justFBMessage" + i).id;
			if (isThere == "justFBMessage" + i){
				return;
			}
		} catch (e){
		}
	var element = document.createElement("DIV");     
	element.id = "justFBMessage" + i;
	element.className = "enhance3844";
		$(element).hover(function(){updateInfobox('message on facebook',i);},function(){updateInfobox('',i);})

	element.innerHTML = "<div class='fb_messenger'></div>";
$(element).click()
	document.getElementById("enhance3843_" + i).appendChild(element);
	
$(element).click(function() {
createSend(theUrl);
  });

}

function insertFBshare(i,theUrl){
	try {
			var isThere = document.getElementById("justFBShare" + i).id;
			if (isThere == "justFBShare" + i){
				return;
			}
		} catch (e){
		}
	var element = document.createElement("DIV");     
	element.id = "justFBShare" + i;
	element.className = "enhance3844";
		$(element).hover(function(){updateInfobox('share on facebook',i);},function(){updateInfobox('',i);})

	element.innerHTML = "<div class='justButton' onClick=\"createShare('"+ theUrl +"');\"><i class='fa fa-facebook'></i></div>";
	document.getElementById("enhance3843_" + i).appendChild(element);
}

function insertReddit(i,theUrl){

	try {
			var isThere = document.getElementById("justREDDIT_" + i).id;
			if (isThere == "justREDDIT_" + i){
				return;
			}
		} catch (e){
		}

	var element = document.createElement("DIV");       
	element.id = "justREDDIT_" + i;
	element.className = "enhance3844";
		$(element).hover(function(){updateInfobox('reddit this',i);},function(){updateInfobox('',i);})

	element.innerHTML = "<a href='#' target='_blank' onClick=\"window.open('//www.reddit.com/submit?url="+ encodeURIComponent(theUrl) +"','reddit this"+ i +"','resizable,height=460,width=700'); return false;\"><div class='justButton'><i class='fa fa-reddit'></i></div></a>";
	document.getElementById("enhance3843_" + i).appendChild(element);
}

function insertInstapaper(i,theUrl,theTitle){

	try {
			var isThere = document.getElementById("justINSTA_" + i).id;
			if (isThere == "justINSTA_" + i){
				return;
			}
		} catch (e){
		}
	var element = document.createElement("DIV");       
	element.id = "justINSTA_" + i;
	element.className = "enhance3844 instapaper";
		$(element).hover(function(){updateInfobox('add to instapaper',i);},function(){updateInfobox('',i);})

	element.innerHTML = "<div class='instapaper justButton' id='instapaper_"+i+"' onClick=\"ajaxInstapaper('"+ encodeURIComponent(theUrl) +"',"+i+");\">I</i></div><div id='instapaperdone_"+i+"' class='justButton2' style='display:none;' onclick='window.open(\"https://instapaper.com\");'><i class='fa fa-check'></i></div><div id='instapaperloader_"+i+"' class='justButton2 loader' style='display:none;'></div>";
	document.getElementById("enhance3843_" + i).appendChild(element);
}

function insertMail(i,theUrl,theTitle){

	try {
			var isThere = document.getElementById("justMail_" + i).id;
			if (isThere == "justMail_" + i){
				return;
			}
		} catch (e){
		}
	var element = document.createElement("DIV");       
	element.id = "justMail_" + i;
	element.className = "enhance3844 justmail";
	theBody = encodeURIComponent(theTitle) + "%0D%0A" + encodeURIComponent(theUrl) + "%0D%0A%0D%0A---%0D%0Asent with https://just.io";
		$(element).hover(function(){updateInfobox('send by mail',i);},function(){updateInfobox('',i);})
	element.innerHTML = "<a href='mailto:?Subject="+encodeURIComponent(theTitle)+"&body="+theBody+"' style='text-decoration:none;'><div class='mail justButton'><i class='fa fa-envelope'></div></a>";
	document.getElementById("enhance3843_" + i).appendChild(element);
}

function insertEvernote(i,theUrl,theTitle){
	try {
			var isThere = document.getElementById("justEVER_" + i).id;
			if (isThere == "justEVER_" + i){
				return;
			}
		} catch (e){
		}
	var element = document.createElement("DIV");        // Create a <button> element
	element.id = "justEVER_" + i;
	element.className = "enhance3844";
		$(element).hover(function(){updateInfobox('add to evernote',i);},function(){updateInfobox('',i);})
 	element.innerHTML = "<div id='evernote_" + i + "' class='evernote justbutton' onClick=\"ajaxEvernote('"+ encodeURIComponent(theTitle) +"','"+ encodeURIComponent(theUrl) +"',"+i+"); \"></div><div id='evernotedone_" + i + "' class='justButton2' style='display:none;' onclick='window.open(\"https://evernote.com\");'><i class='fa fa-check'></i></div><div id='evernoteloader_" + i +"' class='justButton2 loader' style='display:none;'></div>";
	document.getElementById("enhance3843_" + i).appendChild(element);
}

function insertPocket(i,theUrl,theTitle){
	try {
			var isThere = document.getElementById("justPOCKET_" + i).id;
			if (isThere == "justPOCKET_" + i){
				return;
			}
		} catch (e){
		}
	var element = document.createElement("DIV");        // Create a <button> element
	element.id = "justPOCKET_" + i;
	element.className = "enhance3844";
		$(element).hover(function(){updateInfobox('add to pocket',i);},function(){updateInfobox('',i);})
 	element.innerHTML = "<div id='pocket_" + i + "' class='pocket justbutton'></div><div id='pocketdone_" + i + "' class='justButton2' style='display:none;' onclick='window.open(\"https://getpocket.com\");'><i class='fa fa-check'></i></div><div id='pocketloader_" + i +"' class='justButton2 loader' style='display:none;'></div>";
	document.getElementById("enhance3843_" + i).appendChild(element);

$( "#pocket_" + i ).click(function() {
ajaxPocket(theTitle, theUrl,i);
});

}






function insertCommentToggle(i,theUrl){
	try {
			var isThere = document.getElementById("justCOMBUT_" + i).id;
			if (isThere == "justCOMBUT_" + i){
				return;
			}
		} catch (e){
		}
		try {
			var isThere = document.getElementById("justCOMREM_" + i).id;
			if (isThere == "justCOMREM_" + i){
				return;
			}
		} catch (e){
		}
	var element = document.createElement("DIV");        // Create a <button> element
	element.className = "enhance3844 commentButton";
	$(element).hover(function(){updateInfobox('comment with fb',i,"yes");},function(){updateInfobox('',i,"no");})
	element.innerHTML = "<div class='fbAll'><a href='javascript:comment(\""+theUrl+"\","+i+");'><div class='fbcomm justButton'></div></a></div>";
	element.id = "justCOMBUT_" + i;
	document.getElementById("enhance3843_" + i).appendChild(element);
	var element = document.createElement("DIV");        // Create a <button> element
	element.className = "enhance3844 commentRemove";
	$(element).hover(function(){updateInfobox('close comments',i,"no");},function(){updateInfobox('',i,"no");})
	element.style.display = "none";
	element.id = "justCOMREM_" + i;
	element.innerHTML = "<a href='javascript:removeComment("+i+");'><i class='fa fa-remove'></i></a>";
	document.getElementById("enhance3843_" + i).appendChild(element);
}

function insertCommentCount(i,theUrl){
	try {
			var isThere = document.getElementById("justCOMCount_" + i).id;
			if (isThere == "justCOMCount_" + i){
				return;
			}
		} catch (e){
		}
	var element = document.createElement("DIV");        // Create a <button> element
	element.className = "enhance3844 commentCount";
	element.style.cursor = "pointer";
	element.id = "justCOMCount_" + i;
	element.innerHTML = "<span class='fb-comments-count fb_comments_count_zero' data-href='" + theUrl + "' fb-xfbml-state='rendered'><div class='comloadimg'><img src='' id='loader_comment_"+ i +"' height='12px' width='12px'/></div></span>";
	document.getElementById("enhance3843_" + i).getElementsByClassName('fbcomm')[0].parentNode.appendChild(element); 
	document.getElementById("loader_comment_" + i).src = chrome.extension.getURL("icons/ajax-loader1.gif");
	FB.XFBML.parse();


}



function openInNew(i,theUrl){
	try {
			var isThere = document.getElementById("justTab_" + i).id;
			if (isThere == "justTab_" + i){
				return;
			}
		} catch (e){
		}
	
	var element = document.createElement("DIV");        // Create a <button> element
		element.className = "enhance3844";
		element.id = "justTab_" + i;
		$(element).hover(function(){updateInfobox('open in new tab',i);},function(){updateInfobox('',i);})

	element.innerHTML = "<div class='justButton'><a href='" + theUrl + "' target='_blank'><i class='fa fa-clone'></a></div>";
	document.getElementById("enhance3843_" + i).appendChild(element);

}

function insertfavicon(i,theUrl){
	try {
			var isThere = document.getElementById("justFav_" + i).id;
			if (isThere == "justFav_" + i){
				return;
			}
		} catch (e){
		}
		try {
	var element = document.createElement("div");        // Create a <button> element
		element.className = "enhance3845";
		element.id = "justFav_" + i;
		
	element.innerHTML = "<a href='" + theUrl + "'><img width='12px' src='https://www.google.com/s2/favicons?domain=" + encodeURIComponent(theUrl) + "' /></a>";
	var theUrl = document.getElementsByClassName('g')[i].getElementsByClassName('f')[0].appendChild(element);
	} catch (e){
		
	} 

}

function correctGreenUrl(i,theUrl){
	try {
	var greenUrl = document.getElementsByClassName('g')[i].getElementsByTagName('cite')[0].innerHTML;
	document.getElementsByClassName('g')[i].getElementsByTagName('cite')[0].innerHTML = "<span class='enhance_greenLink' onclick='javascript:document.location.href = \"" + theUrl+ "\"'>" + greenUrl + "</span>";
	} catch (e){
		
	}
	
}

function removeAds(){
	try {
	var element = document.getElementById("taw");
	element.parentNode.removeChild(element);
	}
catch(err) {
	}
	try {
	var element = document.getElementById("tvcap");
	element.parentNode.removeChild(element);
	}
catch(err) {
	}
	try {
	var element = document.getElementById("mbEnd");
	element.parentNode.removeChild(element);
	}
catch(err) {
	}
	try {
	var element = document.getElementById("tadsb");
	element.parentNode.removeChild(element);
	}
catch(err) {
	}
	try {
	var element = document.getElementsByClassName("commercial-unit-desktop-rhs")[0]; //books
	element.parentNode.removeChild(element);
	}
catch(err) {
	}
	
}

function loadFBSDK(){
	(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.4&appId=";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
}

    

    function insertToggle(){
	    	    try {
			var isThere = document.getElementById("justmenu").id;
			if (isThere == "justmenu"){
				return;
			}
		} catch (e){
		}
	    var options = document.createElement("li");
	    options.className = "ab_ctl";
	    options.id = "justmenu"
	    options.innerHTML = "<div id=''><li class='ab_ctl' id=''><a class='justoptions' href='javascript:openOption();'><i class='fa fa-cogs justmenu'></i></a></li><span id='justsep'></span><li class='ab_ctl' id=''><div onclick='togglejust();' class='justsettings2' id='togglejust'></div></li></div>";
	    document.getElementById('ab_ctls').appendChild(options);
	    
	    
	    
    }
    
   


function set_colors(){
	$('.enhance3844').css({"background-color":"#000000"});
}


  function placeID(){
	    var myid = chrome.runtime.id;
	    var element = document.createElement("DIV");      
		element.innerHTML = myid;
		element.id = "justXTID_pyt";
		element.className = "justXTID";
		document.getElementsByClassName('g')[0].appendChild(element); 
  }
  
  function launchjust(i){
	  						
	  if (isjusting_pyt == "YES"){
		  return;
	  }
	  isjusting_pyt = "YES";
	  try {
	  var isjusted_pyt = document.getElementById('justXTID_pyt').tagName;
	  } catch (e) {

		  isjusting_pyt = "NO";
		  var isjusted_pyt = "NO";
	  }
	  if (isjusted_pyt == "DIV"){

		  isjusting_pyt = "NO";
		  return;
	  }
	  if (i > 200){
		  isjusting_pyt = "NO";
		  return;
	  }
	  
	  var hash = window.location.hash;
	  var isImageSearch = document.location.href.indexOf("tbm=isch");
	  if (isImageSearch > -1){
		  return;
	  }
	  var isSearch1 = hash.indexOf("q=");
	  var isSearch2 = document.location.href.indexOf("q=");
	  if (isSearch1 > -1 || isSearch2 > -1){
	  try{
	 var isReady = document.getElementsByClassName('g')[0].tagName;
	 } catch (e){
		var isReady = "NO";
	 }
	 if (isReady != "NOA"){
		 	

	  placeID();
	  insertEnhance();
	  
	  startEnhancing();
	  } else {
		  i++;
		  isjusting_pyt = "NO";
		  setTimeout(function(){ launchjust(i); }, 10);
	  }
}
	  
  }
  


$(document).bind("DOMSubtreeModified", function() {
	

try{
		    launchjust(0);
		    } catch (e){
			        document.getElementsByTagName('body')[0].style.display = "block";

		    }
		    if (theOptions.removeads){
					//removeAds();
				}
				
		    
 	if (document.readyState == "complete"){ //fixed error for ajax search
    document.getElementsByTagName('body')[0].style.display = "block";
     } 
     var test = localStorage.getItem("justEnabled");
     if (test == "YES"){
	     $('.enhance3843').show();
     }
     
});



