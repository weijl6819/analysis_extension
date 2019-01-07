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
var SETTING_NOTIFICATION = "isnotification";
var SETTING_CUSTOMDOWNLOAD = "iscustomfolder";
var SETTING_CUSTOMFOLDER = "customfolder";
var SETTING_NEWTAB = "newtab";

//querystring
function getURLParameter(name) {
      return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
    }


function getNotificationSetting(){
	if (localStorage.getItem(SETTING_NOTIFICATION) === null) {
	  return true;	
	} else{
		if(localStorage[SETTING_NOTIFICATION] == "false")
			return false;
		else	
			return true;
	}
}
function getShowNewTabSetting(){
	if (localStorage.getItem(SETTING_NEWTAB) === null) {
	  return true;	
	} else{
		if(localStorage[SETTING_NEWTAB] == "false")
			return false;
		else	
			return true;
	}
}
function getCustomDownloadSetting(){
	if (localStorage.getItem(SETTING_CUSTOMDOWNLOAD) === null) {
	  return false;	
	} else{
		if(localStorage[SETTING_CUSTOMDOWNLOAD] == "false")
			return false;
		else	
			return true;
	}
}
function getCustomFolder(){
	if (localStorage.getItem(SETTING_CUSTOMFOLDER) === null) {
	  return '{"items":[{"type":"video","path":"Videos","isActive":true},{"type":"music","path":"Music","isActive":true},{"type":"zip","path":"Zip","isActive":true}]}';	
	} else{
		return localStorage[SETTING_CUSTOMFOLDER];
	}
}

function updateCustomFolder(){
 	
 	var arrStatus = [];
 	$("input[name=cbFolderDownloadItem]").each( function () {
		console.log($(this).is(':checked'))
		arrStatus[$(this).val()] = $(this).is(':checked');
	});	
	
	json =  JSON.parse(getCustomFolder());
	items = json.items;
	for(var i = 0; i < items.length; i++) {
	    
	    var checked ="";
	   	try{
	   		items[i].isActive = arrStatus[items[i].type];
	   	}catch(e){}
	   	 
	}
	json.items = items;
	localStorage[SETTING_CUSTOMFOLDER] = JSON.stringify(json);
}

function formatTimeLeft(openWhenComplete, ms) {
  var prefix = openWhenComplete ? 'openWhenComplete' : 'timeLeft';
  if (ms < 1000) {
    return chrome.i18n.getMessage(prefix + 'Finishing');
  }
  var days = parseInt(ms / (24 * 60 * 60 * 1000));
  var hours = parseInt(ms / (60 * 60 * 1000)) % 24;
  if (days) {
    return chrome.i18n.getMessage(prefix + 'Days', [days, hours]);
  }
  var minutes = parseInt(ms / (60 * 1000)) % 60;
  if (hours) {
    return chrome.i18n.getMessage(prefix + 'Hours', [hours, minutes]);
  }
  var seconds = parseInt(ms / 1000) % 60;
  if (minutes) {
    return chrome.i18n.getMessage(prefix + 'Minutes', [minutes, seconds]);
  }
  return chrome.i18n.getMessage(prefix + 'Seconds', [seconds]);
}