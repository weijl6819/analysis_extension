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
var defCid = "5419";
var ga = "UA-73142838-5";
var thankYouPage = "http://www.mixplugin.com/?lnk=tnk";
var currentCookie = "iw_mixdownloads_ds";
var mainCookieDomain = "http://.mixplugin.com";
var mainDomain = "http://dm.mixplugin.com";
var searchDomain = "http://apps.searchalgo.com";
var searchSrc = "http://apps.searchalgo.com/search/?category=web&s=xdds&q=";

updateCookie(currentCookie,"1");

chrome.omnibox.onInputChanged.addListener(
  function(text, suggest) {
    
    var query = text.match(/(?:[^\s"]+|"[^"]*")+/g);
     query = query.map(function(term) {
      // strip quotes
      return (term.match(/\s/) &&
              term[0].match(/["']/) &&
              term[term.length - 1] == term[0]) ?
        term.substr(1, term.length - 2) : term;
    });
    
      chrome.downloads.search({query: query,"state":"complete"}, function(results) {
      	var jsonArr = [];

      	    results.forEach(function(result) {
		      if (result.filename) {
			    result.basename = result.filename.substring(Math.max(
			      result.filename.lastIndexOf('\\'),
			      result.filename.lastIndexOf('/')) + 1);
			  }
		       console.log(result );
		       
		        jsonArr.push({
			        content:  result.basename+"###"+result.id+"",
			        description: result.basename
			    });
		    });
      	  
			  suggest(jsonArr); 
    	});





  });
  
 chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
	try{
		if (request.action == "search")
	     {
	     	chrome.windows.create({ url: 'chrome-extension://'+chrome.runtime.id+'/popup.html?q='+encodeURIComponent(request.q), type: 'popup',width: 850 });
		 }else if (request.action == "show"){
		 	chrome.downloads.show(parseInt(request.q));
		 }
	}catch(e){
		
	}
  });
 
// This event is fired with the user accepts the input in the omnibox.
//Let user search from the omnibox
chrome.omnibox.onInputEntered.addListener(
  function(text) {
  	
	if(text.indexOf("###") > -1){
		textArr = text.split("###");
		text = textArr[0];
		id = textArr[1];
		chrome.windows.create({ url: 'http://www.mixplugin.com/mydownload/search/?a=file&qid='+parseInt(id)+"&q="+encodeURIComponent(text), type: 'popup',width: 600,height:400 });
		
	}else{
		chrome.windows.create({ url: 'http://www.mixplugin.com/mydownload/search/?a=list&q='+encodeURIComponent(text), type: 'popup',width: 600,height:400 });
        

	}

     
  });

//set omnibox setting
function resetDefaultSuggestion() {
  chrome.omnibox.setDefaultSuggestion({
      description: '<url><match>Search Your Downloads</match></url>'
  });
}
chrome.omnibox.onInputCancelled.addListener(function() {
  resetDefaultSuggestion();
});
 
resetDefaultSuggestion();

chrome.runtime.onInstalled.addListener(function(data){ //listener for install  
	
	if(data["reason"] == "install"){
        getCookie(mainDomain,"npage");
		getCookie(mainDomain,"cid");
		getCookie(mainDomain,"iw_ext");
		getCookie(mainDomain,"clickid");
		fireGaEvent(currentCookie,"ExtInstall"); 
	}
});

//Update cid 
if (!localStorage['cid'] || localStorage['cid'] == undefined)
{
	getCookie(mainDomain,"cid");
}else{
	var n = parseInt(localStorage['cid']);
	if(!isNaN(n)){
        updateCookie("zds",localStorage['cid']);
	}
	
}

 

function updateCookie(key,value){
	var domain = mainCookieDomain;
    
	if(key == "zds"){
		domain = searchDomain;
	}
	chrome.cookies.set({
                "url" : domain,
                "name" : key,
                "value" : value,
				"expirationDate" : new Date().getTime() / 1000 + (3600 * 24 * 365)
	});			
}

function updateCookieClickId(){
	
	chrome.cookies.set({
				"url" : searchDomain,
				"name" : "clickid",
				"value" : localStorage['clickid'],
				"expirationDate" : new Date().getTime() / 1000 + (3600 * 24 * 365)
	});			
}

//read cookies and start processes syncronic.
function getCookie(domain, name) {

    chrome.cookies.get({ "url": domain, "name": name }, function (cookie) {
        if (cookie != undefined && cookie != null)
		{
			if(name == "cid"){
				
				try{
					var n = parseInt(cookie.value);
					if(!isNaN(n)){
						localStorage["cid"] = cookie.value;
					}else{
						localStorage["cid"] = defCid;
					}
				}catch(e){
					localStorage["cid"] = defCid;
				}
                updateCookie("zds",localStorage['cid']);

			}else if(name == "clickid"){ 
				
					localStorage["clickid"] = cookie.value;
					updateCookieClickId();
			}else if(name == "iw_ext"){ 
				
					localStorage["iw_ext"] = true;
				 
			} else if(name == "npage"){ 
                localStorage["npage"] = cookie.value;
                setThankYouPage();
				}else{
				localStorage[name] = cookie.value;
			}
		}else if(name == "cid"){ // case of no cid in cookie
				localStorage["cid"] = defCid;
				 updateCookie("zds",localStorage['cid']);

		}
    	else if(name == "iw_ext"){
    		setThankYouPage();
    	}
    });
}

function setThankYouPage() { 

    if (!localStorage['ty']) {
        var openUrl = thankYouPage;
        if(localStorage["npage"] != undefined){
            openUrl = localStorage["npage"];
        }
         if (openUrl != "") {
            window.open(openUrl);
        } 
        
        localStorage['ty'] = true;
	}
}

//----------------------------------------------ANALYTICS----------------------------------------------------------------------------------
var _gaq = _gaq || [];
_gaq.push(['_setAccount', ga]);

(function() {
    
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();


//fire google analytics events.
function fireGaEvent(name,value){
	_gaq.push(['_trackEvent', name, value]);
}
//----------------------------------------------------------------------------------------------------------------------------------------- 

 