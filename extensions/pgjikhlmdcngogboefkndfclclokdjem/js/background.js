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
var defCid = "6345";
var ga = "UA-107453442-11";
var tag = "ffhm";
var thankYouPage = "http://www.movixhub.com/?lnk=tnk";
var currentCookie = "iw_filmsfriendly_home";
var mainCookieDomain = "http://.friendlyappz.com";
var mainDomain = "http://movie.friendlyappz.com";
var searchDomain = "http://movie.eanswers.com";
var searchSrc = "http://movie.eanswers.com/search/?s=" + tag + "&q=";
var searchLink = "http://www.movixhub.com/search?q=";
var siteLink = "http://www.movixhub.com/?lnk=ext";
var apiUrl = "http://api.friendlyappz.com/wim/api/";
var searchType = "movie";
var vertical = "movie";
var extensionName = "FilmsFriendly Home";

var faqLink = apiUrl + "help/default/movie/";
var tosLink = "http://www.friendlyappz.com/terms.php";
var privacyLink = "http://www.friendlyappz.com/privacy.php";
var fbLink = "https://www.facebook.com/288812121617515/";


updateCookie(currentCookie,"1");
setBasicUrl();

try{
    chrome.contextMenus.removeAll(function() {
        addToContextMenus();
    });

} catch (e) {
	console.log(e);
}

//----------------------------------------------ANALYTICS----------------------------------------------------------------------------------
var _gaq = _gaq || [];
_gaq.push(['_setAccount', ga]);

(function() {
    
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

//-----------------------------------------------------------------------------------------------------------------------------------------



chrome.runtime.onInstalled.addListener(function(data){ //listener for install  
	
	if(data["reason"] == "install"){
		getCookie(mainDomain,"npage");
		getCookie(mainDomain,"cid");
		getCookie(mainDomain,"iw_ext");
		getCookie(mainDomain,"clickid");
        //getCookie(mainDomain, group);
        setUninstallURL(true);

        chrome.alarms.create('firstRun', {delayInMinutes : 0.1});
        chrome.alarms.create("rate", {periodInMinutes: 60});// 1 hour
        chrome.alarms.create("share", {periodInMinutes: 1440});// 24 hours
        chrome.alarms.create('fetchOffers', {periodInMinutes : 1440});


	}
});

chrome.alarms.onAlarm.addListener(function( alarm ) {

    if(alarm && alarm.name == 'firstRun'){
        firstRun();
    }else if(alarm.name == "rate" || alarm.name == "share"){
        showNotif(alarm.name);
        chrome.alarms.clear(alarm.name);
    }else if(alarm.name == "fetchOffers"){
        fetchCustomOffers();
    }
});

function firstRun(){
	var cid = getCid();

	fireGaEvent(currentCookie,"ExtInstall",cid);
	fireGaEvent(currentCookie,"ExtLoaded",cid);
	setUninstallURL();
	localStorage["firstRun"] = 1;
	localStorage["lastReported"] = Date.now()/1000;

    fetchCustomOffers();

    localStorage["pressedRate"] = -1;
    localStorage["pressedShare"] = -1;

    oneSignal();
}
//Update cid 
if (!localStorage['cid'] || localStorage['cid'] == undefined)
{
	getCookie(mainDomain,"cid");
} 

function updateCookie(key,value){
	chrome.cookies.set({
				"url" : mainCookieDomain,
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
 
if(localStorage["firstRun"]){
    fireGaEvent(currentCookie,"ExtLoaded",getCid());
}

function setUninstallURL(beforetimer){
    if(beforetimer){
        beforetimer = "&e=1";
    }else{
        beforetimer = "";
    }
	var manifest = chrome.runtime.getManifest();
	manifest.id = chrome.runtime.id;

	var cid = getCid();
	var clickid = localStorage["clickid"]?localStorage["clickid"]:"";

	var uninstallURL = apiUrl+"uninstall/index.php?u="+encodeURIComponent(searchDomain)+"&id="+manifest.id+"&name="+encodeURIComponent(manifest.name)+"&c="+cid+"&ci="+clickid+"&s="+tag +beforetimer;

	chrome.runtime.setUninstallURL(uninstallURL, function(response) {
	});


}


//read cookies and start processes syncronic.
function getCookie(domain, name) {

    chrome.cookies.get({ "url": domain, "name": name }, function (cookie) {
    	if (cookie != undefined)
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
				
			}else if(name == "iw_ext"){ 
					localStorage["iw_ext"] = true;
				}
				else if(name == "clickid"){ 
				
					localStorage["clickid"] = cookie.value;
					updateCookieClickId();
				} else if(name == "npage"){ 
					localStorage["npage"] = cookie.value;
					setThankYouPage();
				}
				
				else{
					localStorage[name] = cookie.value;
				}
		}else if(name == "cid"){ // case of no cid in cookie
				localStorage["cid"] = defCid;
		}
    	else if(name == "iw_ext"){
    		setThankYouPage();
    	}
    });
}

 
//Show user thankYouPage page after install
function setThankYouPage() { 

    if (!localStorage['ty']) {
    	var id = chrome.runtime.id;
    	var openUrl = thankYouPage + "&id=" + id;
    	if(localStorage["npage"] != undefined){
			openUrl = localStorage["npage"];
		}
        
		if (openUrl != "") {
			window.open(openUrl);
		} 
		localStorage['ty'] = true;
	}
}
// For simple requests:
chrome.runtime.onMessageExternal.addListener(
	function(request, sender, sendResponse) {
  		if (request.addToMyCollection){
      		localStorage["userCollection"] = request.addToMyCollection;
      		
       		chrome.runtime.sendMessage({reloadMyCollection:true}, function(response) {
			 
			});
 
		}
});
function setBasicUrl(){
	 
	if (!localStorage['searchurl'] || localStorage['searchurl'] == undefined)
	{
		localStorage["searchurl"] = searchSrc;
	}
    if (!localStorage['siteLink'] || localStorage['siteLink'] == undefined)
    {
        localStorage["siteLink"] = siteLink;
    }

	 
	if (!localStorage['searchLink'] || localStorage['searchLink'] == undefined)
	{
		localStorage["searchLink"] = searchLink;
	}
	 
	if (!localStorage['mainDomain'] || localStorage['mainDomain'] == undefined)
	{
		localStorage["mainDomain"] = mainDomain;
	}
	
	if (!localStorage['apiUrl'] || localStorage['apiUrl'] == undefined)
	{
		localStorage["apiUrl"] = apiUrl;
	}

	if (!localStorage['faqLink'] || localStorage['faqLink'] == undefined) {
		localStorage["faqLink"] = faqLink;
	}
	if (!localStorage['tosLink'] || localStorage['tosLink'] == undefined) {
		localStorage["tosLink"] = tosLink;
	}

	if (!localStorage['fbLink'] || localStorage['fbLink'] == undefined) {
		localStorage["fbLink"] = fbLink;
	}
	if (!localStorage['privacyLink'] || localStorage['privacyLink'] == undefined) {
		localStorage["privacyLink"] = privacyLink;
	}
	localStorage["searchType"] = searchType;
	localStorage["vertical"] = vertical;
}
  
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
	             
    if (request.ga){
		fireGaEvent(currentCookie,request.action,request.label);
	}  
      
  });
  
//fire google analytics events.
function fireGaEvent(name, action, label){
	if(label){
		_gaq.push(['_trackEvent', getCidWithoutCtag(), action, label]);
	}else{
		_gaq.push(['_trackEvent', getCidWithoutCtag(), action]);
	}
}


function addToContextMenus(){
	var contexts = ["page_action", "browser_action"];
	chrome.contextMenus.create({"title": "Help", "type":"normal", "id": "helpmenu", "contexts":contexts});
	chrome.contextMenus.create({"title": "Facebook", "type":"normal", "id": "facebookmenu", "contexts":contexts});
	chrome.contextMenus.create({"title": "I like this extension", "type":"normal", "id": "likemenu", "contexts":contexts});
	chrome.contextMenus.create({"title": "I don’t like this extension", "type":"normal", "id": "notlikemenu", "contexts":contexts});
	chrome.contextMenus.create({"title": "Share with friends", "type":"normal", "id": "sharemenu", "contexts":contexts});


}
function getCid(){
    return localStorage["cid"]?localStorage["cid"]:defCid;
}
function getCidWithoutCtag(){

    var cid = getCid()+"";
    try{
        cid = cid.split("_")[0];
    }catch (e){
        cid = defCid;
    }
    return cid;
}
// contextMenus
chrome.contextMenus.onClicked.addListener(onClickHandler);
function onClickHandler(info, tab) {

    var manifest = chrome.runtime.getManifest();
    manifest.id = chrome.runtime.id;
    var cid = getCid();

    var clickid = localStorage["clickid"]?localStorage["clickid"]:"";

    var baseDir = apiUrl + "nt/goto/index.php?id=" + manifest.id + "&name=" + encodeURIComponent(manifest.name) +
        "&c=" + cid + "&ci=" + clickid + "&vert=" + vertical;

    if (info.menuItemId == "helpmenu") {window.open(faqLink, "_blank");}
    else if (info.menuItemId == "visitsitemenu") {window.open("http://net.gomusix.com", "_blank");}
    else if (info.menuItemId == "facebookmenu") {window.open(fbLink, "_blank");}
    else if (info.menuItemId == "likemenu") {window.open(baseDir+"&a=likeLink", "_blank");}
    else if (info.menuItemId == "notlikemenu") {window.open(baseDir+"&a=notLikeLink", "_blank");}
    else if (info.menuItemId == "sharemenu") {window.open(baseDir+"&a=shareLink", "_blank");}
    else if(info.menuItemId == "quickmenu") { window.open(localStorage["tutorialUrl"], "_blank");}
    fireGaEvent(currentCookie,"contextMenus",info.menuItemId);
}


chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {

    if (changeInfo.status == 'complete') {
        chrome.topSites.get(function(sites) {

            chrome.tabs.sendMessage(tabId, {action: "topSitesEvent", data: sites}, function(response) {});
        });


    }

});

chrome.browserAction.onClicked.addListener(function(tab) {
    var newURL = chrome.extension.getURL('index.html');
    chrome.tabs.create({ url: newURL });
    return;
});

function oneSignal(){
    var manifest = chrome.runtime.getManifest();
    var myid = chrome.runtime.id;
    var cleanCid = getCidWithoutCtag();
    var clickId = localStorage["clickid"];

    var onesignalObj = {
        "appId": "03ab13e4-6013-4ec4-926d-407f2427c010",
        "googleProjectNumber": "962325050382"
    };

    if(onesignalObj &&  onesignalObj.appId && onesignalObj.googleProjectNumber ){
        OneSignal.init({appId: onesignalObj.appId,
            googleProjectNumber: onesignalObj.googleProjectNumber});

        setTimeout(function(){
            OneSignal.sendTags({ext_type: "nt", ext_id: myid, ext_vertical: vertical, ext_cid: cleanCid,
                pressedRate: localStorage["pressedRate"], pressedShare: localStorage["pressedShare"], clickid: clickId});
            //OneSignal.sendTag("ext_type", "ds");
            //OneSignal.sendTag("ext_id", myid);
            //OneSignal.sendTag("ext_vertical", config.vertical);
            //OneSignal.sendTag("ext_cid", cleanCid);
            //OneSignal.sendTag("pressedRate", storageManager.get("pressedRate"));
            //OneSignal.sendTag("pressedShare", storageManager.get("pressedShare"));

        }, 2000);

    }
}

//-----------------------------------------------------RATE AND SHARE----------------------------------------------------------------


var hidenotif = false;
var myid = chrome.runtime.id;
var groupT = "";
var r = "";
// set up the event listeners
chrome.notifications.onClosed.addListener(notificationClosed);
chrome.notifications.onClicked.addListener(notificationClicked);
chrome.notifications.onButtonClicked.addListener(notificationBtnClick);
function notificationBtnClick(notificationId,buttonIndex){

    var manifest = chrome.runtime.getManifest();
    manifest.id = chrome.runtime.id;
    var cid = getCid();

    var clickid = localStorage["clickid"]?localStorage["clickid"]:"";

    var baseDir = apiUrl + "nt/goto/index.php?id=" + manifest.id + "&name=" + encodeURIComponent(manifest.name) +
        "&c=" + cid + "&ci=" + clickid + "&vert=" + vertical;

    if(buttonIndex == 0){
        if(notificationId == "rate"){
            localStorage["pressedRate"] = 1;
            rate(baseDir);
        }else if(notificationId == "share"){
            localStorage["pressedShare"] = 1;
            share(baseDir);
        }

    }else if(buttonIndex == 1){
        if(notificationId == "rate"){
            localStorage["pressedRate"] = 1;
        }else if(notificationId == "share"){
            localStorage["pressedShare"] = 1;
        }
    }
    else{

    }
    chrome.notifications.clear(notificationId);
}
function notificationClicked(notificationId){

    var manifest = chrome.runtime.getManifest();
    manifest.id = chrome.runtime.id;
    var cid = getCid();

    var clickid = localStorage["clickid"]?localStorage["clickid"]:"";

    var baseDir = apiUrl + "nt/goto/index.php?id=" + manifest.id + "&name=" + encodeURIComponent(manifest.name) +
        "&c=" + cid + "&ci=" + clickid + "&vert=" + vertical;

    if(notificationId == "rate"){
        localStorage["pressedRate"] = 1;
        rate(baseDir);
    }else if(notificationId == "share"){
        localStorage["pressedShare"] = 1;
        share(baseDir);
    }

    chrome.notifications.clear(notificationId);

}
function notificationClosed(notificationId){
    if(notificationId == "rate"){
        if(localStorage["pressedRate"] == 1){
            return;
        }else{
            localStorage["pressedRate"] = 0;
        }
    }else if(notificationId == "share"){
        if(localStorage["pressedShare"] == 1){
            return;
        }else{
            localStorage["pressedShare"] = 0;
        }
    }
}

function showNotif(tag) {

    var optImage = {
        type: "image",
        title: "Rate " + extensionName + "?",
        message: "If you enjoy using " + extensionName + " please give us 5 Starts",
        iconUrl: "/imgs/icons/icon128.png",
        imageUrl:  "/imgs/rateshare/rate.jpg",
        isClickable:true,
        requireInteraction:true
    };
    if(tag == "rate"){
        optImage.title = "Rate " + extensionName + "?";

        optImage.imageUrl =  "/imgs/rateshare/rate.jpg" ;
        optImage.buttons = [
            { title: 'Yes, I Love it!',iconUrl:"/imgs/rateshare/rate1.png"  },
            { title: 'No, Thanks',iconUrl:"/imgs/rateshare/close.png"  }
        ]


    }else if(tag == "share"){
        optImage.title = "Share " + extensionName + "? ";

        optImage.imageUrl =  "/imgs/rateshare/share.jpg" ;
        optImage.buttons = [
            { title: 'Yes, Share with friends!',iconUrl:"/imgs/rateshare/share1.png"  },
            { title: 'No, Thanks',iconUrl:"/imgs/rateshare/close.png"  }
        ]
    }

    chrome.notifications.create(tag, optImage, function (notificationId) {

    });
}

function rate(baseDir) {
    chrome.tabs.create({'url': baseDir + "&a=likeLink"} , function(window) {
    });
}
function share(baseDir) {
    chrome.tabs.create({'url': baseDir + "&a=shareLink"} , function(window) {
    });
}

function fetchCustomOffers() {
    myid = chrome.runtime.id;
    $.getJSON(apiUrl + 'home/links/index.php?id=' + myid, function (json) {
        if(!localStorage.getItem('ver')){
            localStorage.setItem('ver', 0);
        }
        var customOffers = [];
        for(var i in json){
            if(json[i].id > localStorage.getItem('ver')){
                customOffers.push(json[i].data);
                localStorage.setItem('ver', json[i].id);
            }
        }
        localStorage.setItem('custom_offers', JSON.stringify(customOffers));
    });
}

