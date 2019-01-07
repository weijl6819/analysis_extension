var s3security = {};
s3security.tmp_allow_request_list = {};
s3security.current_tabId = 0;
s3security.aTab = {};
s3security.subrequest_selected = {};

//------------------------------------------------------------------------------
s3security.init_0 = function() {
	document.getElementById('s3security-main-menu-white-black-list').addEventListener("click", s3security.save_domain);
	document.getElementById('s3security-main-menu-browser').addEventListener("click", function(){ s3security.main_menu_click('browser'); });
	document.getElementById('s3security-main-menu-tab').addEventListener("click", function(){ s3security.main_menu_click('tab'); });
	document.getElementById('s3security-main-menu-deny').addEventListener("click", function(){ s3security.main_menu_click('deny'); });
	document.getElementById('s3security-main-menu-settings').addEventListener("click", s3security.open_options_window);

	document.getElementById('subrequest-actions-allow-white').addEventListener("click", function(){ s3security.subrequest_selected_action('white'); });
	document.getElementById('subrequest-actions-allow-browser').addEventListener("click", function(){ s3security.subrequest_selected_action('browser'); });
	document.getElementById('subrequest-actions-allow-tab').addEventListener("click", function(){ s3security.subrequest_selected_action('tab'); });
	document.getElementById('subrequest-actions-deny').addEventListener("click", function(){ s3security.subrequest_selected_action('deny'); });
	document.getElementById('subrequest-actions-reset').addEventListener("click", function(){ s3security.subrequest_selected_action('reset'); });
	document.getElementById('subrequest-actions-select-all').addEventListener("click", s3security.subrequest_selected_all);

	s3security.utils.i18n_parse(document);
	s3security.init();
}
//------------------------------------------------------------------------------
s3security.init = function() {
	chrome.tabs.query({  active: true, currentWindow: true }, function(tabs) {
		s3security.current_tabId = tabs[0].id;
		chrome.runtime.sendMessage({ action_get_tab_data: true, 'tabId': tabs[0].id }, function(response) {
			s3security.aTab = response.tab_data;
			s3security.tmp_allow_request_list = response.tmp_allow_request_list;
			s3security.start(s3security.aTab);
			s3security.main_menu_show(s3security.aTab);
		});
	});
}
//------------------------------------------------------------------------------
s3security.start = function(tab) {
	var domain_included_box = document.getElementById("s3security-tooltip-domain-included");
	domain_included_box.hidden = true;
	document.getElementById("s3security-tooltip-text-2").hidden = true;
	var white_black_list = s3security.utils.prefs_get('security_white_black_list');

	//-----------------------------------------------------------------------
	if (tab && tab.s3security) {
		var result = tab.s3security;
		if (! result.allow_request_list) { result.allow_request_list = {}; }
		//----------------------------------------------------------------
		document.getElementById("s3security-tooltip-icon").setAttribute('domain_status', result.domain_status);
		s3security.utils.HTMLDOM_value(document.getElementById("s3security-tooltip-text"), s3security.utils.get_string('security_' + result.domain_status + '_alert', [result.domain_dns_name]));
		//----------------------------------------------------------------
		var blocked_list = [];
		for (var domain in result.blocked_list) {
			var domain_status = result.blocked_list[domain].domain_status;
			var domain_dns_name = result.blocked_list[domain].domain_dns_name;
			var user_white_black_subdomain = s3security.utils.get_user_white_black_status(domain);
			var comment = '';
			if (user_white_black_subdomain) {
				comment = s3security.utils.get_string(user_white_black_subdomain + '_list_label');
			}
			if ((domain_status == 'adult') || (domain_status == 'infected')) {
				comment = s3security.utils.get_string(domain_status + '_label', [domain_dns_name]) + (comment ? ' : ' + comment : '');
			}
			if (comment != '') {
				comment = ' (' + comment + ')';
			}
			blocked_list.push({
				'domain' : domain,
				'comment' : comment,
				'text' : domain + comment,
				'is_locked' : result.blocked_list[domain].is_locked
			});
		}
		//----------------------------------------------------------------
		if (blocked_list.length > 0) {
			domain_included_box.hidden = false;
			blocked_list = blocked_list.sort(function (a, b) {
				if (a.domain > b.domain) {
					return 1;
				} else if (a.domain < b.domain) {
					return -1;
				} else {
					return 0;
				}
			});

			var domain_included_list = document.getElementById("s3security-tooltip-domain-included-list");
			while(domain_included_list.firstChild) { domain_included_list.removeChild(domain_included_list.firstChild); }
			for (var i=0; i<blocked_list.length; i++) {
				var s3security_template = document.getElementById("s3security-domain-included").cloneNode(true);
				domain_included_list.appendChild(s3security_template);
				s3security_template.id = 's3security-domain-included-' + blocked_list[i].domain;
				s3security_template.setAttribute('domain', blocked_list[i].domain);
				var domain_included_text = s3security.utils.get_element(s3security_template, 's3security-domain-included-text');
				s3security.utils.HTMLDOM_value(domain_included_text, blocked_list[i].text);

				if (blocked_list[i].is_locked) {
					s3security.utils.get_element(s3security_template, 's3security-domain-included-image').setAttribute('is_locked', blocked_list[i].is_locked);
				} else if (s3security.tmp_allow_request_list[blocked_list[i].domain]) {
					s3security.utils.get_element(s3security_template, 's3security-domain-included-image').setAttribute('is_tmp_browser', true);
				} else if (result.allow_request_list[blocked_list[i].domain]) {
					s3security.utils.get_element(s3security_template, 's3security-domain-included-image').setAttribute('is_tmp_tab', true);
				} else {
					var user_white_black_status = s3security.utils.check_user_white_black_status(blocked_list[i].domain, white_black_list);
					if (user_white_black_status == 'white') {
						s3security.utils.get_element(s3security_template, 's3security-domain-included-image').setAttribute('is_whitelist', true);
					}
				}

				//----------------------------------------------------
				s3security_template.addEventListener("click", function() {
					s3security.subrequest_selected_set(this.getAttribute('domain'));
				});
			}
			s3security.subrequest_selected_reload();

		}
		//----------------------------------------------------------------
		var user_white_black_status = s3security.utils.get_user_white_black_status(result.domain);
		if (user_white_black_status) {
			s3security.utils.HTMLDOM_value(document.getElementById("s3security-tooltip-text-2"), s3security.utils.get_string('security_' + user_white_black_status + '_list_alert'));
			document.getElementById("s3security-tooltip-text-2").hidden = false;
			document.getElementById("s3security-tooltip-icon").setAttribute('domain_status', 'user');
		}
	}
	//-----------------------------------------------------------------------
	else {
		document.getElementById("s3security-tooltip-icon").removeAttribute('domain_status');
		s3security.utils.HTMLDOM_value(document.getElementById("s3security-tooltip-text"), s3security.utils.get_string('security_unknown_alert'));
	}
}
//------------------------------------------------------------------------------
s3security.main_menu_show = function(aTab) {
	var result = s3security.utils.get_menu_current_domain_status(aTab);
	var menu = document.getElementById('s3security-main-menu-white-black-list');
	var menu_text = document.getElementById('s3security-main-menu-white-black-list-text');
	menu.hidden = result.menu_is_hidden;
	menu.setAttribute('s3security_menu_state', result.menu_state);

	if (result.domain_exists) {
		s3security.utils.HTMLDOM_value(menu_text, s3security.utils.get_string('security_' + result.menu_state + '_list_menu_del', [result.domain]));
	} else {
		s3security.utils.HTMLDOM_value(menu_text, s3security.utils.get_string('security_' + result.menu_state + '_list_menu_add', [result.domain]));
	}

	//------------------------------------------------------------------------
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

	//------------------------------------------------------------------------
	document.getElementById('s3security-main-menu-browser').hidden = hidden_browser_tab;
	document.getElementById('s3security-main-menu-tab').hidden = hidden_browser_tab;
	document.getElementById('s3security-main-menu-deny').hidden = hidden_browser_tab_deny;
}
//------------------------------------------------------------------------------
s3security.save_domain = function() {
	if (! s3security.utils.check_action_password()) { return; }
	var aTab = s3security.aTab;

	var result = s3security.utils.get_menu_current_domain_status(aTab);
	if (! result.menu_is_hidden) {
		try {
			var white_black_list = s3security.utils.prefs_get('security_white_black_list');
			var action = 'set';
			var value = '';
			//----------------------------------------------------------
			if (white_black_list[result.domain]) {
				delete white_black_list[result.domain];
				action = 'del';
			}
			//----------------------------------------------------------
			else {
				var user_white_black_status = s3security.utils.check_user_white_black_status(result.domain, white_black_list);
				if (user_white_black_status) {
					value = (user_white_black_status == 'white') ? 'black' : 'white';
				} else {
					value = result.menu_state;
				}
				white_black_list[result.domain] = value;
			}
			//----------------------------------------------------------
			s3security.utils.prefs_set('security_white_black_list', white_black_list);
			chrome.runtime.sendMessage({ action_white_black_list: true, 'action': action, 'domain': result.domain, 'value': value }, function(response) {
				if (response) {
					s3security.tab_reload();
				}
			});
		} catch(e) {
		}
	}
}
//------------------------------------------------------------------------------
s3security.main_menu_click = function(action) {
	if (action != 'deny') {
		if (! s3security.utils.check_action_password()) { return; }
	}

	var aTab = s3security.aTab;
	var result = s3security.utils.get_menu_current_domain_status(aTab);

	//-----------------------------------------------------------------------
	chrome.runtime.sendMessage({ 'action_allow_deny_request_list': true, 'domain_list': [result.domain], 'action': action, 'tabId': s3security.current_tabId }, function(response) {
		if (response) {
			s3security.tab_reload();
		}
	});
	return true;
}
//------------------------------------------------------------------------------
s3security.open_options_window = function() {
	chrome.runtime.openOptionsPage();
}
//------------------------------------------------------------------------------
s3security.tab_reload = function() {
	chrome.tabs.update(s3security.current_tabId, { url: s3security.aTab.url }, function(tab) {
		s3security.init();
	});
}
//------------------------------------------------------------------------------
s3security.subrequest_selected_set = function(domain) {
	if (s3security.subrequest_selected[domain]) {
		delete s3security.subrequest_selected[domain];
	} else {
		s3security.subrequest_selected[domain] = true;
	}
	s3security.subrequest_selected_reload();
}
//------------------------------------------------------------------------------
s3security.subrequest_selected_all = function() {
	var selected_count = Object.keys(s3security.subrequest_selected).length;
	var all_count = Object.keys(s3security.aTab.s3security.blocked_list).length;
	var is_all = (selected_count >= all_count) ? false : true;

	for (var domain in s3security.aTab.s3security.blocked_list) {
		if (is_all) {
			s3security.subrequest_selected[domain] = is_all;
		} else {
			delete s3security.subrequest_selected[domain];
		}
	}

	s3security.subrequest_selected_reload();
}
//------------------------------------------------------------------------------
s3security.subrequest_selected_reload = function() {
	var is_inactive = true;
	for (var domain in s3security.aTab.s3security.blocked_list) {
		var template = document.getElementById('s3security-domain-included-' + domain);
		if (template) {
			template.setAttribute('is_selected', s3security.subrequest_selected[domain]);
			if (s3security.subrequest_selected[domain]) {
				is_inactive = false;
			}
		}
	}
	document.getElementById('subrequest-actions-allow-white').setAttribute('is_inactive', is_inactive);
	document.getElementById('subrequest-actions-allow-browser').setAttribute('is_inactive', is_inactive);
	document.getElementById('subrequest-actions-allow-tab').setAttribute('is_inactive', is_inactive);
	document.getElementById('subrequest-actions-deny').setAttribute('is_inactive', is_inactive);
	document.getElementById('subrequest-actions-reset').setAttribute('is_inactive', is_inactive);
}
//------------------------------------------------------------------------------
s3security.subrequest_selected_action = function(action) {
	var domain_list = [];
	var white_black_list = s3security.utils.prefs_get('security_white_black_list');

	for (var domain in s3security.subrequest_selected) {
		if (s3security.subrequest_selected[domain]) {
			domain_list.push(domain);
			//-----------------------------------------------------------
			if (action == 'deny') {
				if (s3security.aTab.s3security.blocked_list && (! s3security.aTab.s3security.blocked_list[domain].is_locked)) {
					if (! s3security.tmp_allow_request_list[domain]) {
						if (! s3security.aTab.s3security.allow_request_list[domain]) {
							if (white_black_list[domain] == 'white') {
								delete(white_black_list[domain]);
							} else {
								white_black_list[domain] = 'black';
							}
						}
					}
				}
			}
			//-----------------------------------------------------------
			else if (action == 'white') {
				if (white_black_list[domain] == 'black') {
					delete(white_black_list[domain]);
				} else {
					white_black_list[domain] = 'white';
				}
			}
			//-----------------------------------------------------------
			else if (action == 'reset') {
				delete(white_black_list[domain]);
			}
		}
	}

	//-----------------------------------------------------------------------
	if (domain_list.length > 0) {
		s3security.utils.prefs_set('security_white_black_list', white_black_list);
		chrome.runtime.sendMessage({ 'action_allow_deny_request_list': true, 'white_black_list' : white_black_list, 'domain_list': domain_list, 'is_subrequest': true, 'action': action, 'tabId': s3security.current_tabId }, function(response) {
			if (response) {
				s3security.tab_reload();
			}
		});
	}
}
//------------------------------------------------------------------------------
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		//------------------------------------------------------------------
		if (! request) { return; }

		//------------------------------------------------------------------
		if (request.action_reload_popup) {
			if (request.tabId == s3security.current_tabId) {
				s3security.init();
				sendResponse({ 'success' : true });
			}
		}
	}
);
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
window.addEventListener("load", s3security.init_0);
