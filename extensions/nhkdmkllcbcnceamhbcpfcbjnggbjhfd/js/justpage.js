
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
var googleDomain = window.location.hostname;
// googleDomain = googleDomain.hostname;
googleDomainArray = googleDomain.split('google.');
googleDomain = googleDomainArray[1];
var demoSeen = false;

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


function ajaxInstapaper(text,i)
		{
			$('#instapaperloader_' + i).show();
			$('#instapaper_' + i).hide();
			//URL TO PHP API FOLDER
			var urlToApi = "https://www.just.io/lib/instapaper/";
			if(instapaper_request) evernote_request.abort();
			text = decodeURIComponent(text);
			var instapaper_request = $.ajax({
				url: urlToApi + 'auth.php',
				type: 'GET',
				data: { 'text': text, 'domain': googleDomain },
				xhrFields: {
			       withCredentials: true
			    },
			    crossDomain: true,
				success: function(data) {
					switch(data)
					{
						case 'added':
							console.log("link added");
							$('#instapaperdone_' + i).show();
							$('#instapaperloader_' + i).hide();
							break;
						case 'needauth':
								$('#instapaperloader_' + i).hide();
								$('#instapaper_' + i).show();
								window.open(urlToApi + 'newauth.php?title='+ encodeURIComponent() +"&content="+ encodeURIComponent() +'&domain=' + googleDomain,'Authorize Instapaper','resizable,height=460,width=700'); return false;

							break;
						default:
							console.log(data); //SOME UNEXPECTED ERRORS
							break;
					}
				},
				error: function(e) {
					console.log("Connection failed");
					instapaper_request.abort();
				}
							});
		}
		
function ajaxPocket(title, text,i) {
			$('#pocketloader_' + i).show();
			$('#pocket_' + i).hide();

			var urlToApi = "https://www.just.io/lib/pocket/";
			if(evernote_request) evernote_request.abort();
			
			var evernote_request = $.ajax({
				url: urlToApi + 'auth.php',
				type: 'GET',
				data: {
					'text'	: text
				},
				xhrFields: {
			       withCredentials: true
			    },
			    crossDomain: true,
				success: function(data) {
					console.log(data);
					switch(data)
					{
						case 'added':
							$('#pocketdone_' + i).show();
							$('#pocketloader_' + i).hide();
							updateInfobox("added to <a href='https://www.getpocket.com/' target='_blank'>pocket</a>",i,"no");							
									$("justPOCKET_" + i).hover(function(){updateInfobox('go to pocket',i);},function(){updateInfobox('',i,"no");})
							break;
						case 'needauth':
$('#instapaperloader').hide();
								$('#pocket').show();
								updateInfobox("pocket needs to grant access");
							window.open(urlToApi + 'preAuth.php?title='+ encodeURIComponent(title) +"&text="+ encodeURIComponent(title) +'&domain=' + googleDomain,'Authorize 	pocket','resizable,height=800,width=900'); return false;
							break;
						case 'danied':
// 							alert("Authorization denied");
					updateInfobox("sorry. there has been an error");

							break;
						default:
												updateInfobox("sorry. there has been an error");

							break;
					}
				},
				error: function(e) {
					alert("Connection failed");
					evernote_request.abort();
				}
			});
		}
				
			

function ajaxEvernote(title, text, i)
		{
			console.log('');
			$('#evernoteloader_' + i).show();
			$('#evernote_' + i).hide();
			//URL TO PHP API FOLDER
			var urlToApi = "https://www.just.io/lib/evernote/";
			if(evernote_request) evernote_request.abort();
			
			var evernote_request = $.ajax({
				url: urlToApi + 'auth.php',
				type: 'GET',
				data: {
					'title'	: title,
					'text'	: text,
					'domain': googleDomain
				},
				xhrFields: {
			       withCredentials: true
			    },
			    crossDomain: true,
				success: function(data) {
					switch(data)
					{
						case 'added':
							$('#evernotedone_' + i).show();
							$('#evernoteloader_' + i).hide();
							break;
						case 'needauth':

							window.open(urlToApi + 'preAuth.php?title='+ encodeURIComponent(title) +"&text="+ encodeURIComponent(text) +'','Authorize evernote','resizable,height=460,width=700'); return false;
							
							break;
						case 'danied':
							console.log("There has been an error. Please try again later");

							break;
						default:
							console.log(data); //SOME UNEXPECTED ERRORS
							break;
					}
				},
				error: function(e) {
					console.log("Connection failed");
					evernote_request.abort();
				}
			});
		}


function comment(theUrl,i){
	    var comment = document.createElement("div");
	    comment.className = "fb-comment";
	    comment.id = "fb-comment_" + i;
	    comment.style.display = "none";
	    comment.innerHTML = "<div class='iframe_loader'><div class='fb-comments' data-href='" + theUrl + "' data-width='100%' data-numposts='5' height='700px'></div></div>";
	    
	    document.getElementById("enhance3843_" + i).parentNode.appendChild(comment);
	    FB.XFBML.parse();
	    $( "#fb-comment_" + i ).slideDown( "fast", function() {
    
  });
	    document.getElementById("enhance3843_" + i).getElementsByClassName('commentButton')[0].style.display = "none";
	    document.getElementById("enhance3843_" + i).getElementsByClassName('commentRemove')[0].style.display = "block";

	       }
    
    function removeComment(i){
	    $( "#fb-comment_" + i ).slideUp( "slow", function() {
    var element = document.getElementById("enhance3843_" + i).parentNode.getElementsByClassName('fb-comment')[0];
		element.parentNode.removeChild(element);
  });
	   
		document.getElementById("enhance3843_" + i).getElementsByClassName('commentButton')[0].style.display = "block";
	    document.getElementById("enhance3843_" + i).getElementsByClassName('commentRemove')[0].style.display = "none";
    }
    

function ytplay(theUrl,i){
	  var yturl = theUrl;
	  var ytid = yturl.split("v=");
	  ytid = ytid[1];
	  var iframe = "<div class='iframe_loader'><iframe class='ytplayer' width='420' height='315' src='https://www.youtube.com/embed/"+ytid+"?autoplay=1' frameborder='0' allowfullscreen></iframe></div>";
	  var videoplayer = document.createElement("div");
	  videoplayer.className = "videoplayer";
	  videoplayer.id = "videoplayer_" + i;
	  videoplayer.innerHTML = iframe;
	  videoplayer.style.display = "none";
	  var yturl = document.getElementById("enhance3843_" + i).parentNode.appendChild(videoplayer);
	  document.getElementById('enhanceyt_' + i).style.display = "none";
	  document.getElementById('enhanceytremove_' + i).style.display = "block";
	  $( "#videoplayer_" + i ).slideDown( "fast", function() {
    
  });
	  
  }
 

 
  function ytRemove(i){
	  $( "#videoplayer_" + i ).slideUp( "slow", function() {
    var element = document.getElementById("videoplayer_" + i);
	 element.parentNode.removeChild(element);
	 document.getElementById('enhanceyt_' + i).style.display = "block";
	 document.getElementById('enhanceytremove_' + i).style.display = "none";
  });
	 
  }

function createShort(theUrl,i,theTitle){
	    $( "#shortened_" + i ).slideDown( "fast", function() {
    
  });
  var shortUrl = "";
  	var urlToApi = "https://www.just.io/lib/googl/";
			if(evernote_request) evernote_request.abort();
			
			var evernote_request = $.ajax({
				url: urlToApi + 'index.php',
				type: 'GET',
				data: {
					'url'	: theUrl,
					'domain': googleDomain
				},
				xhrFields: {
			       withCredentials: true
			    },
			    crossDomain: true,
				success: function(data) {
					shortUrl = data;
					document.getElementById("shortened_" + i ).innerHTML = "<a href='" + shortUrl + "' target='_blank'>" +  shortUrl + "</a>";
						 var theBody = encodeURIComponent(shortUrl) + "%0D%0A%0D%0A---%0D%0Asent with https://just.io";
	document.getElementById("justMail_" + i).innerHTML = "<a href='mailto:?Subject="+encodeURIComponent(theTitle)+"&body="+theBody+"' style='text-decoration:none;'><div class='mail justButton'><i class='fa fa-envelope'></div></a>";
	
			document.getElementById("justTweet_" + i ).innerHTML="<a href='#' target='_blank'  onClick=\"window.open('https://twitter.com/intent/tweet?url="+ encodeURIComponent(shortUrl) +"','TweetThis "+ i +" ','resizable,height=260,width=370'); return false;\"><div class='justButton'><i class='fa fa-twitter'></i></div></a>";
	
				},
				error: function(e) {
					console.log("Connection failed");
					evernote_request.abort();
				}
			});
			  
	document.getElementById('shortencheck_' + i).style.display = "block";
	document.getElementById('shortener_' + i).style.display = "none";
	document.getElementById("shortened_" + i ).innerHTML = shortUrl;
	// update services with new shortlink

	
}
 

    function togglejust(){
	    var justEnabled = localStorage.getItem("justEnabled"); 
	    console.log(justEnabled);
	    
	    
	    if (justEnabled == "YES"){
		$('.enhance3847').slideUp( "slow", function() {
    // Animation complete.
  });
  

	    $('.enhance3845').animate({ width: 'toggle', opacity: 'toggle' }, 'slow'); 
	    $('.enhance3849').animate({ width: 'toggle', opacity: 'toggle' }, 'slow');
	    $('.enhance3843').animate({ height: 'toggle', opacity: 'toggle' }, 'slow');
	    $('.videoplayer').animate({ height: 'toggle', opacity: 'toggle' }, 'slow');
	    $('.fb-comment').animate({ height: 'toggle', opacity: 'toggle' }, 'slow');
	    disableGreen();
	    $( "#togglejust" ).removeClass("justsettings");
	    $( "#togglejust" ).addClass("justsettings2");
		
	    localStorage.setItem("justEnabled", "NO");
	    } else {
// 		    $('.enhance3847').animate({ height: 'toggle', opacity: 'toggle' }, 'slow');  
			$('.enhance3845').animate({ width: 'toggle', opacity: 'toggle' }, 'slow'); 
			$('.enhance3849').animate({ width: 'toggle', opacity: 'toggle' }, 'slow');
			$('.enhance3843').animate({ height: 'toggle', opacity: 'toggle' }, 'slow'); 
			$('.videoplayer').animate({ height: 'toggle', opacity: 'toggle' }, 'slow'); 
			$('.fb-comment').animate({ height: 'toggle', opacity: 'toggle' }, 'slow'); 
			enableGreen();
			 $( "#togglejust" ).removeClass("justsettings2");
	    $( "#togglejust" ).addClass("justsettings");

			localStorage.setItem("justEnabled", "YES");
	    }
    }
    
 function disableGreen(){
	 varCountLinks = document.getElementsByClassName('enhance_greenLink').length;
	 
	 for (i = 0; i < varCountLinks; i++) {
		 try{
		 document.getElementsByClassName('enhance_greenLink')[i].parentNode.innerHTML = document.getElementsByClassName('enhance_greenLink')[i].innerHTML;
		 } catch (e){
			 
		 }
		 } 
 }
 
  function enableGreen(){
	 varCountLinks = document.getElementsByClassName('g').length;
	 
	 for (i = 0; i < varCountLinks; i++) {
		 try{
			 
var greenUrl = document.getElementsByClassName('g')[i].getElementsByTagName('cite')[0].innerHTML;
var theUrl = document.getElementsByClassName('g')[i].getElementsByTagName('a')[0].href;

	document.getElementsByClassName('g')[i].getElementsByTagName('cite')[0].innerHTML = "<span class='enhance_greenLink' onclick='javascript:document.location.href = \"" + theUrl+ "\"'>" + greenUrl + "</span>";
		 
	} catch (e){
		 }
		 } 
 }
 
  function openOption() {
var editorExtensionId = document.getElementById('justXTID').innerHTML;
chrome.runtime.sendMessage(editorExtensionId, {action: "openOptions"},
  function(response) {
  });
  
      }
  
    function justIt() {

  }
  

  
  //listen to fb frames
var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
var eventer = window[eventMethod];
var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
  
 eventer(messageEvent,function(e) {
    var key = e.message ? "message" : "data";
    var data = e[key];
    var what = e.data;
/*
    document.getElementById('fbsharediv').innerHTML = "";
    document.getElementById('frameloader2').style.display = "none";
    document.getElementById("mainPopup").style.height = "100%";
		document.getElementById("mainPopup").style.width = "100%";
*/
try {
    updateInfobox('done');
    } catch(e){
	    
    }
    
    //run function//
},false);

/*
function createShare(theUrl){
	document.getElementById('fbsharediv').innerHTML = "";
	document.getElementById('frameloader2').style.display = "block";
	
	var iframe = document.createElement("IFRAME");        // Create a <button> element
	iframe.src = "https://www.just.io/lib/facebook/index.php?method=share&url=" + encodeURIComponent(theUrl);
	iframe.id ="fbshareframe";
	iframe.innerHTML = "loading...";
	iframe.style.display = "none";
	document.getElementByTagName('body')[0].appendChild(iframe);

	$( "#fbshareframe" ).show( "slow", function() {
		

  });
}
*/

function createShare(theUrl){
/*
	document.getElementById('fbsharediv').innerHTML = "";
	document.getElementById('frameloader2').style.display = "block";
*/
	
	var iframe = document.createElement("IFRAME");        // Create a <button> element
	iframe.src = "https://www.just.io/lib/facebook/index.php?method=share&url=" + encodeURIComponent(theUrl);
	iframe.id ="fbshareframe";
	iframe.scrolling = "no";
	iframe.innerHTML = "loading...";
	iframe.style.display = "none";
	document.getElementsByTagName('body')[0].appendChild(iframe);
	
	
	$( "#fbshareframe" ).fadeIn( "slow", function() {
  });
}

function createSend(theUrl){
/*
	document.getElementById('fbsharediv').innerHTML = "";
	document.getElementById('frameloader2').style.display = "block";
*/
	
	var iframe = document.createElement("IFRAME");        // Create a <button> element
	iframe.src = "https://www.just.io/lib/facebook/index.php?method=send&url=" + encodeURIComponent(theUrl);
	iframe.id ="fbshareframe";
	iframe.scrolling = "no";
	iframe.innerHTML = "loading...";
	iframe.style.display = "none";
	document.getElementsByTagName('body')[0].appendChild(iframe);
	
	
	$( "#fbshareframe" ).fadeIn( "slow", function() {
  });
}

// Listen to message from child window
eventer(messageEvent,function(e) {
    var key = e.message ? "message" : "data";
    var data = e[key];
    var what = e.data;
//     	console.log(e.data);

if (e.data == "fberror" || e.data == "fbshared") {
	$( "#fbshareframe" ).fadeOut( "slow", function() {
	$( "#fbshareframe" ).remove();
  });
}
    

   
    
    //run function//
},false);
  
  
function demoUpdate1(i){
	$( "#enhance3849").animate({width: 'hide'});
	document.getElementById("enhance3849").innerHTML = "Great! Thank you. Now enjoy just Search. If you ever want to turn just off, have a look in the upper right corner and Press the just icon."
	$( "#enhance3849").animate({width: 'show'});
	document.getElementById("enhance3843_" + i).style.border = "none";
	  chrome.storage.sync.set({
    demoSeen: true
    
    
  }, function() {
  });
	
}

function save_options() {
   var comment = document.getElementById('comment').checked;
  var fbshare = document.getElementById('fbshare').checked;
  var fbmessage = document.getElementById('fbmessage').checked;
   var tweet = document.getElementById('tweet').checked;
   var reddit = document.getElementById('reddit').checked;
   var instapaper = document.getElementById('instapaper').checked;
   var evernote = document.getElementById('evernote').checked;
   var pocket = document.getElementById('pocket').checked;
   var mail = document.getElementById('mail').checked;
    var ytplay = document.getElementById('ytplay').checked;
     var newtab = document.getElementById('newtab').checked;
      var shortener = document.getElementById('shortener').checked;
       var removeads = document.getElementById('removeads').checked;
       var favicon = document.getElementById('favicon').checked;
       var urlclickable = document.getElementById('urlclickable').checked;
 

       
  chrome.storage.sync.set({
    fbshare: fbshare,
    fbmessage: fbmessage,
    comment: comment,
    tweet: tweet,
    reddit: reddit,
    instapaper: instapaper,
    evernote: evernote,
    pocket: pocket,
    mail: mail,
    ytplay: ytplay,
    newtab: newtab,
    shortener: shortener,
    urlclickable: urlclickable,
    removeads: removeads,
    favicon: favicon
    
    
  }, function() {
    // Update status to let user know options were saved.
/*
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
    */
  });

}

var hostname = window.location.hostname;
var theLocation = window.location.href;

function getOptions(){
 chrome.storage.sync.get({
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
    document.getElementById('comment').checked = items.comment;
    document.getElementById('fbshare').checked = items.fbshare;
     document.getElementById('fbmessage').checked = items.fbmessage;
    document.getElementById('tweet').checked = items.tweet;
    document.getElementById('reddit').checked = items.reddit;
    document.getElementById('instapaper').checked = items.instapaper;
    document.getElementById('evernote').checked = items.evernote;
      document.getElementById('pocket').checked = items.pocket;
    document.getElementById('mail').checked = items.mail;
    document.getElementById('ytplay').checked = items.ytplay;
    document.getElementById('newtab').checked = items.newtab;
    document.getElementById('shortener').checked = items.shortener;
    document.getElementById('removeads').checked = items.removeads;
     document.getElementById('urlclickable').checked = items.urlclickable;
     document.getElementById('favicon').checked = items.favicon;
     demoSeen = items.demoSeen;
    
  });
}
 
  
if (theLocation.indexOf("just.io/installsearch.php") > 1){

$( document ).ready(function() {
     getOptions();
     $( ".option" ).click(function() {
	 	save_options();

	});
});


}



