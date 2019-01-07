var s3security = {};
s3security.form = null;
s3security.tab_id = 0;
s3security.tab_url = '';
s3security.dns_servers_work = null;
s3security.dns_servers_edit_current = null;

//------------------------------------------------------------------------------
s3security.init_0 = function() {
	s3security.utils.i18n_parse(document);
	window.document.documentElement.style.display='none';
	//------------------------------------------------------------------------
	chrome.tabs.getCurrent(function(tab){
		s3security.tab_id = tab.id;
		s3security.tab_url = tab.url;

		chrome.runtime.sendMessage({ action_get_tab_data: true }, function(response) {
			var aTab = (response && response.tab_data) ? response.tab_data : null;
			var access_allowed = s3security.utils.check_action_password(s3security.tab_url, s3security.tab_id, aTab);
			if (access_allowed) {
				window.document.documentElement.style.display='';
				s3security.init_1();
			}
		});

	});
}
//------------------------------------------------------------------------------
s3security.init_1 = function() {
	s3security.form = document.getElementById('s3security_form');

	//------------------------------------------------------------------------
	var current_locale = document.getElementById('current_locale');
	for (var i=0; i<s3security.I18N_SUPPORTED.length; i++) {
		var el_lang = s3security.I18N_SUPPORTED[i];
		var option = document.createElement("option");
		option.text = el_lang.name;
		option.value = el_lang.lang;
		current_locale.options.add(option);
	}
	//------------------------------------------------------------------------
	//------------------------------------------------------------------------
	s3security.password_value_init();
	s3security.init_events();
	s3security.init();
}
//------------------------------------------------------------------------------
s3security.init = function() {
	//------------------------------------------------------------------------
	s3security.init_prefs();
	s3security.check_security_enabled();

	//------------------------------------------------------------------------
	var dns_servers_init = [];
	try {
		dns_servers_init = s3security.utils.prefs_get('security_dns_list');
	} catch(e) {
	}
	if ((! dns_servers_init) || (dns_servers_init.length == 0)) {
		dns_servers_init = s3security.utils.clone_object(s3security.dns_servers);
	}
	s3security.dns_servers_work = dns_servers_init;
	s3security.dns_servers_setup();
	s3security.dns_edit_events();

	//------------------------------------------------------------------------
	var white_list = [];
	var black_list = [];
	var white_black_list = s3security.utils.prefs_get('security_white_black_list');

	for (var domain in white_black_list) {
		if (white_black_list[domain] == 'white') {
			white_list.push(domain);
		} else {
			black_list.push(domain);
		}
	}
	document.getElementById("security_white_list_text").value = white_list.sort().join("\n");
	document.getElementById("security_black_list_text").value = black_list.sort().join("\n");

	//------------------------------------------------------------------------
	var pref_security_page_lock_source = s3security.utils.prefs_get('security_page_lock_source');
	if (/^\s*$/.test(pref_security_page_lock_source) || (pref_security_page_lock_source == 'DEFAULT_PAGE')) {
		document.getElementById("security_page_lock_source_text").value = s3security.page_lock_template;
	} else {
		document.getElementById("security_page_lock_source_text").value = pref_security_page_lock_source;
	}

	//------------------------------------------------------------------------
	document.getElementById("password_save").disabled = true;
	document.getElementById("password_save").setAttribute('disabled', true);
/*
	s3security.dbh = new s3security.sqlite();
	s3security.dbh.init();
	s3security.get_statistics('today');
	s3security.statistics_full_path();
*/
}
//------------------------------------------------------------------------------
s3security.init_events = function() {
	s3security.form.addEventListener('submit', function(event){
		event.stopPropagation();
		event.preventDefault();
	});

	document.getElementById('password_value').addEventListener('keypress', function(){ s3security.password_value_keypress(); });
	document.getElementById('password_value').addEventListener('change', function(){ s3security.password_value_keypress(); });
	document.getElementById('password_value').addEventListener('keyup', function(){ s3security.password_value_keypress(); });
	document.getElementById('password_value').addEventListener('focus', function(){ this.select(); });
	document.getElementById('password_show').addEventListener('change', function(){ s3security.password_value_show(this); });
	document.getElementById('password_save').addEventListener('click', function(){ s3security.password_value_save(this); });

	document.getElementById('security_white_list_enabled').addEventListener('change', function(){ s3security.check_white_black_list_enabled('white'); });
	document.getElementById('security_black_list_enabled').addEventListener('change', function(){ s3security.check_white_black_list_enabled('black'); });
	document.getElementById('security_white_list_text').addEventListener('input', function(){ s3security.white_black_list_accept(); });
	document.getElementById('security_black_list_text').addEventListener('input', function(){ s3security.white_black_list_accept(); });

	document.getElementById('security_page_lock_default').addEventListener('change', function(){ s3security.check_page_lock_template(); });
	document.getElementById('security_page_lock_source_text').addEventListener('keydown', function(event){ s3security.page_lock_tab(event, this); });
	document.getElementById('security_page_lock_source_text').addEventListener('change', function(){ s3security.page_lock_source_changed(); });
	document.getElementById('security_page_lock_source_text').addEventListener('input', function(){ s3security.page_lock_source_changed(); });

	document.getElementById('dns_test_domain').addEventListener('keydown', function(event){ s3security.dns_test_check_enter(event); });
	document.getElementById('dns_test_button').addEventListener('click', function(){ s3security.dns_test_start(); });
	document.getElementById('dns_add_button').addEventListener('click', function(){ s3security.dns_add_click(); });
	document.getElementById('dns_default').addEventListener('click', function(){ s3security.dns_set_default(); });

	document.getElementById('dns_servers_edit_name').addEventListener('change', function(){ s3security.dns_edit_value2(this); });
	document.getElementById('dns_servers_edit_name').addEventListener('keyup', function(){ s3security.dns_edit_value2(this); });
	document.getElementById('dns_servers_edit_name').addEventListener('paste', function(){ s3security.dns_edit_value2(this); });

	document.getElementById('dns_servers_edit_iplist').addEventListener('change', function(){ s3security.dns_edit_value2(this); });
	document.getElementById('dns_servers_edit_iplist').addEventListener('keyup', function(){ s3security.dns_edit_value2(this); });
	document.getElementById('dns_servers_edit_iplist').addEventListener('paste', function(){ s3security.dns_edit_value2(this); });

	document.getElementById('dns_servers_edit_save').addEventListener('click', function(){ s3security.dns_edit_save('save'); });
	document.getElementById('dns_servers_edit_save_check').addEventListener('click', function(){ s3security.dns_edit_save('save_check'); });
	document.getElementById('dns_servers_edit_check').addEventListener('click', function(){ s3security.dns_edit_save('check'); });
	document.getElementById('dns_servers_edit_close').addEventListener('click', function(){ s3security.dns_edit_close(); });
	document.getElementById('dns_servers_edit_delete').addEventListener('click', function(){ s3security.dns_edit_delete(); });
	document.getElementById('dns_servers_edit_wait_return').addEventListener('click', function(){ s3security.dns_edit_return(); });

	document.getElementById('reset_settings').addEventListener('click', function(){ s3security.reset_settings(); });
}
//------------------------------------------------------------------------------
s3security.init_prefs = function() {
	for (var pref_name in s3security.prefs.list) {
		var pref_value = s3security.prefs.list[pref_name];
		var pref_el = s3security.form[pref_name];
		if (pref_el) {
			if (pref_name == 'password_value') { continue; }
			if (pref_el.type && (pref_el.type == 'checkbox')) {
				pref_el.checked = pref_value;
			} else {
				pref_el.value = pref_value;
			}
		}
	}
	//------------------------------------------------------------------------
	s3security.form.addEventListener('change', function(event){
		var pref_el = event.target;
		if (! pref_el.name) { return; }
		if (pref_el.name == 'password_value') { return; }
		if (s3security.prefs.list[pref_el.name] === undefined) { return; }
		//-----------------------------------------------------
		var callback = null;
		var pref_value = pref_el.value;
		//-----------------------------------------------------
		if (pref_el.type && (pref_el.type == 'checkbox')) {
			pref_value = pref_el.checked;
		}
		//-----------------------------------------------------
		if (pref_el.name == 'current_locale') {
			callback = function() {
				s3security.i18n.init(pref_value);
				s3security.utils.i18n_parse(document);
			}
		}
		//-----------------------------------------------------
		else if (pref_el.name == 'security_enabled') {
			callback = function() {
				s3security.check_security_enabled();
			}
		}
		//-----------------------------------------------------
		s3security.pref_save(pref_el.name, pref_value, callback);
		pref_el.blur();
	});
}
//------------------------------------------------------------------------------
s3security.pref_save = function(pref_name, pref_value, callback) {
	chrome.runtime.sendMessage({ 'action_prefs_set': true, 'pref_name' : pref_name, 'pref_value': pref_value }, function(response) {
		s3security.utils.prefs_set(pref_name, pref_value);
		if (callback) {
			callback();
		}
		s3security.save_settings_message();
	});
}
//------------------------------------------------------------------------------
s3security.check_security_enabled = function() {
	var is_enabled = document.getElementById("security_enabled").checked;

	var field_list = [ 
		'password_box', 's3security_dangerous_tabbox', 
		'security_tab_white_list', 'security_tab_black_list', 'security_tab_page_lock', 
		'security_tab_statistics', 'security_tab_others' 
	];
	for (var id of field_list) {
		s3security.set_disable(document.getElementById(id), is_enabled);
	}

	if (is_enabled) {
		s3security.check_white_black_list_enabled('white');
		s3security.check_white_black_list_enabled('black');
		s3security.check_page_lock_template();
/*
		s3security.check_statistics_short_enabled();
		s3security.check_statistics_full_enabled();
*/

	}
}
//------------------------------------------------------------------------------
s3security.check_white_black_list_enabled = function(list_name) {
	var is_enabled = document.getElementById("security_" + list_name + "_list_enabled").checked;
	var field_list = [ 'security_' + list_name + '_list_settings', 'security_' + list_name + '_list_text', 'security_' + list_name + '_list_action' ];
	for (var id of field_list) {
		if (document.getElementById(id)) {
			s3security.set_disable(document.getElementById(id), is_enabled);
		}
	}
}
//------------------------------------------------------------------------------
s3security.check_page_lock_template = function() {
	var is_enabled = document.getElementById("security_page_lock_default").checked;

	var field_list = [ 'security_page_lock_source_text' ];
	for (var id of field_list) {
		s3security.set_disable(document.getElementById(id), ! is_enabled);
	}
}
//------------------------------------------------------------------------------
s3security.check_statistics_short_enabled = function() {
	var is_enabled = document.getElementById("statistics_short_enabled").checked;

	var field_list = [ 'statistics_clear', 'statistics_short_data', 'statistics_short_period' ];
	for (var id of field_list) {
		s3security.set_disable(document.getElementById(id), is_enabled);
	}
}
//------------------------------------------------------------------------------
s3security.check_statistics_full_enabled = function() {
	var is_enabled = document.getElementById("statistics_full_enabled").checked;

	var field_list = [ 'statistics_full_box' ];
	for (var id of field_list) {
		s3security.set_disable(document.getElementById(id), is_enabled);
	}
}
//------------------------------------------------------------------------------
s3security.set_disable = function(el, is_enabled) {
	if (! el) { return; }

	var tag_list = el.querySelectorAll("input, button,textarea,label");
	for (var i=0; i<tag_list.length; i++) {
		var tag = tag_list[i];
		if (is_enabled) {
			tag.removeAttribute("disabled");
		} else {
			tag.setAttribute("disabled", true);
		}
	}

	if (is_enabled) {
		el.removeAttribute("disabled");
	} else {
		el.setAttribute("disabled", true);
	}
}
//------------------------------------------------------------------------------
s3security.page_lock_tab = function(event, el) {
	var top = el.scrollTop;  
	var left = el.scrollLeft;  
  
	if ((event.charCode == 9) || (event.keyCode == 9)) {
		s3security.page_lock_tab_insert(el);
		el.scrollTop = top;
		el.scrollLeft = left;

		event.stopPropagation();
		event.preventDefault();
		return false;
	}
	return true;
}
//------------------------------------------------------------------------------
s3security.page_lock_tab_insert = function(el) {
	var tab_char = "\t";
	if (el.selectionStart || el.selectionStart == '0') {
		var startPos = el.selectionStart;
		var endPos = el.selectionEnd;
		el.value = el.value.substring(0, startPos)+ tab_char+ el.value.substring(endPos, el.value.length);
		s3security.page_lock_tab_setSelRange(el, endPos + tab_char.length, endPos + tab_char.length);
	} else {
		el.value += tab_char.length;
	}
}
//------------------------------------------------------------------------------
s3security.page_lock_tab_setSelRange = function(el, selStart, selEnd) { 
	if (el.setSelectionRange) { 
		el.focus(); 
		el.setSelectionRange(selStart, selEnd); 
	} else if (el.createtextRange) { 
		var range = el.createtextRange(); 
		range.collapse(true); 
		range.moveEnd('character', selEnd); 
		range.moveStart('character', selStart); 
		range.select(); 
	}
}
//------------------------------------------------------------------------------
s3security.page_lock_source_changed = function() {
	var pref_security_page_lock_source = '';
	var security_page_lock_source = document.getElementById("security_page_lock_source_text");

	if (/^\s*$/.test(security_page_lock_source.value) || (security_page_lock_source.value == 'DEFAULT_PAGE') || (security_page_lock_source.value.replace(/\s/g, '') == s3security.page_lock_template.replace(/\s/g, ''))) {
		pref_security_page_lock_source = 'DEFAULT_PAGE';
	} else {
		pref_security_page_lock_source = security_page_lock_source.value;
	}

	s3security.pref_save('security_page_lock_source', pref_security_page_lock_source);
}
//------------------------------------------------------------------------------
s3security.white_black_list_accept = function() {
	var white_list = document.getElementById("security_white_list_text").value.split(/\n/);
	var black_list = document.getElementById("security_black_list_text").value.split(/\n/);
	var white_black_list = {};

	for (var domain of white_list) {
		domain = domain.replace(/\s/g, '');
		domain = domain.replace(/^\*$/g, '');
		if (domain != '') {
			white_black_list[domain] = 'white';
		}
	}
	for (var domain of black_list) {
		domain = domain.replace(/\s/g, '');
		if (domain != '') {
			white_black_list[domain] = 'black';
		}
	}

	s3security.pref_save('security_white_black_list', white_black_list);
}
//------------------------------------------------------------------------------
s3security.password_value_init = function() {
	var password = s3security.utils.lazy_crypt_decode(s3security.utils.prefs_get('password_value'));
	document.getElementById("password_value").value = password;
	document.getElementById("password_save").disabled = true;
	document.getElementById("password_save").setAttribute('disabled', true);
	return password;
}
//------------------------------------------------------------------------------
s3security.password_value_show = function(el) {
	if (el.checked) {
		document.getElementById("password_value").type = 'text';
	} else {
		document.getElementById("password_value").type = 'password';
	}
}
//------------------------------------------------------------------------------
s3security.password_value_save = function() {
	var password_value = s3security.utils.lazy_crypt_encode(document.getElementById("password_value").value);
	s3security.pref_save('password_value', password_value, function() {
		document.getElementById("password_save").disabled = true;
		document.getElementById("password_save").setAttribute('disabled', true);
	});
}
//------------------------------------------------------------------------------
s3security.password_value_keypress = function() {
	document.getElementById("password_save").disabled = false;
	document.getElementById("password_save").removeAttribute('disabled');
}
//------------------------------------------------------------------------------
/*
s3security.get_statistics = function(dater) {
	if (! document.getElementById("statistics_short_enabled").checked)  { return; }
	var date_where = '';
	var date_select = '';
	if (dater == 'today') {
		date_where = 'statistic_date = date("now")';
		date_select = 'date("now")';
	}
	else if (dater == 'yesterday') {
		date_where = 'statistic_date = date("now", "-1 day")';
		date_select = 'date("now", "-1 day")';
	}
	else if (dater == 'last7') {
		date_where = 'statistic_date > date("now", "-7 day")';
		date_select = 'date("now", "-6 day") || " - " || date("now")';
	}
	else if (dater == 'last30') {
		date_where = 'statistic_date > date("now", "-30 day")';
		date_select = 'date("now", "-29 day") || " - " || date("now")';
	}
	else if (dater == 'this_month') {
		date_where = 'strftime("%Y-%m", statistic_date) = strftime("%Y-%m", date("now"))';
		date_select = 'strftime("%Y-%m-01", date("now")) || " - " || date("now")';
	}
	else if (dater == 'last_month') {
		date_where = 'strftime("%Y-%m", statistic_date) = strftime("%Y-%m", date("now", "-1 month"))';
		date_select = 'strftime("%Y-%m-01", date("now", "-1 month")) || " - " || date(strftime("%Y-%m-01", date("now")), "-1 day")';
	}
	else {
		date_where = 'statistic_date = statistic_date';
		date_select = 'ifnull(min(statistic_date), date("now")) || " - " || ifnull(max(statistic_date), date("now"))';
	}

	//------------------------------------------------------------------------
	var date_txt = '';

	//------------------------------------------------------------------------
	var date_list = s3security.dbh.query('SELECT ' + date_select + ' AS date_txt, min(statistic_date) AS date_min, max(statistic_date) AS date_max FROM statistic WHERE ' + date_where);
	if (date_list.length > 0) {
		date_txt = date_list[0].date_txt;
	}
	document.getElementById("statistic_date").value = date_txt;


	//------------------------------------------------------------------------
	for (var type in { 'infected' : 1, 'adult' : 1, 'blacklist' : 1 }) {
		document.getElementById("statistic_" + type).value = '0 - 0 - 0';
		document.getElementById("statistic_" + type + '_subrequest').value = '0 - 0 - 0';
	}
	//------------------------------------------------------------------------
	var stat_list = s3security.dbh.query('SELECT statistic_type, sum(statistic_request_count) AS request_count, sum(statistic_skipped_count) AS skipped_count FROM statistic WHERE ' + date_where + ' GROUP BY statistic_type');
	if (stat_list.length > 0) {
		for (var i=0; i<stat_list.length; i++) {
			var stat = stat_list[i];
			document.getElementById("statistic_" + stat.statistic_type).value = stat.request_count + ' - ' + (stat.request_count - stat.skipped_count) + ' - ' + stat.skipped_count;
		}
	}
}
//------------------------------------------------------------------------------
s3security.clear_statistics = function() {
	if (! document.getElementById("statistics_short_enabled").checked)  { return; }
	if (! s3security.utils.confirm(s3security.utils.get_string('confirm_warning'), '', window)) { return; }
	s3security.dbh.clear_db();
	s3security.get_statistics('today');
}
//------------------------------------------------------------------------------
s3security.statistics_full_path = function() {
	var dir_path = document.getElementById("pref_statistics_full_directory").value;
	document.getElementById("statistics_full_path").value = s3security.utils.get_file_path(dir_path, s3security.utils.get_statistics_full_filename());
}
//------------------------------------------------------------------------------
s3security.statistics_full_path_show = function() {
	if (! document.getElementById("statistics_full_enabled").checked) { return; }

	var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
	file.initWithPath(document.getElementById("statistics_full_path").value);
	try {
		if (file.exists()) {
			file.reveal();
		} else {
			file.parent.reveal();
		}
	} catch(e) {
	}
}
//------------------------------------------------------------------------------
s3security.statistics_full_path_select = function() {
	if (! document.getElementById("statistics_full_enabled").checked) { return; }

	var localFile = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
	var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(Components.interfaces.nsIFilePicker);
	fp.init(window, '', Components.interfaces.nsIFilePicker.modeGetFolder);

	var dir_path = document.getElementById("pref_statistics_full_directory").value;

	try {
		localFile.initWithPath(s3security.utils.get_file_path(dir_path, ''));
		fp.displayDirectory = localFile;
	} catch(e) {
	}

	var result = fp.show();
	if (result == fp.returnOK) {
		dir_path = s3security.utils.compare_dir_path(fp.file.path);
		document.getElementById("pref_statistics_full_directory").value = dir_path;
		s3security.statistics_full_path();
	}
}
*/
//------------------------------------------------------------------------------
s3security.dns_servers_setup = function() {
	document.getElementById("dns_servers_list").setAttribute('is_hidden', false);
	document.getElementById("dns_servers_edit").setAttribute('is_hidden', true);
	document.getElementById("dns_servers_edit_wait").setAttribute('is_hidden', true);

	var dns_servers_rows = document.getElementById("dns_servers_rows");
	while (dns_servers_rows.firstChild) {
		dns_servers_rows.removeChild(dns_servers_rows.firstChild);
	}

	for (var i=0; i<s3security.dns_servers_work.length; i++) {
		var dns = s3security.dns_servers_work[i];

		var row = dns_servers_rows.insertRow(dns_servers_rows.rows.length);
		row.setAttribute('valign', 'center');
		if (! dns.enabled) {
			row.style.opacity = 0.3;
		}

		var cell1 = row.insertCell(0);
		var button_edit = document.createElement('div');
		button_edit.className = 'dns_edit';
		button_edit.setAttribute('dns_id', dns.id);
		button_edit.addEventListener("click", s3security.dns_edit_click, true);
		cell1.appendChild(button_edit);

		var cell2 = row.insertCell(1);
		var label_name = document.createElement('div');
		label_name.textContent = dns.name;
		cell2.appendChild(label_name);

		var cell3 = row.insertCell(2);
		var button = document.createElement('div');
		button.style.paddingLeft = "20px";
		button.setAttribute('id', 'dns_icon[' + dns.id + ']');
		button.setAttribute('domain_status', 'unknown');
		button.setAttribute('is_hidden', 'true');
		button.className = 's3security-button';
		cell3.appendChild(button);

		var cell4 = row.insertCell(3);
		var label_timer = document.createElement('span');
		label_timer.setAttribute('id', 'dns_timer[' + dns.id + ']');
		cell4.appendChild(label_timer);

		var cell5 = row.insertCell(4);
		var label_status = document.createElement('label');
		label_status.style.paddingLeft = "20px";
		label_status.setAttribute('id', 'dns_status[' + dns.id + ']');
		cell5.appendChild(label_status);
	}
}
//------------------------------------------------------------------------------
s3security.dns_set_default = function() {
	if (! window.confirm(s3security.utils.get_string('confirm_warning'))) { return; }

	var dns_new = s3security.utils.clone_object(s3security.dns_servers);
	s3security.dns_servers_work = dns_new;
	s3security.pref_save('security_dns_list', s3security.dns_servers_work);
	s3security.dns_servers_setup();
}
//------------------------------------------------------------------------------
s3security.dns_add_click = function() {
	s3security.dns_servers_edit_current = {
		'name' : '',
		'id' : 'dns_' + s3security.utils.random_string(7),
		'dns_ip' : [],
		'enabled' : true,
		'result_list' : [
			{ 'ip' : {}, 'type' : 'adult' },
			{ 'ip' : {}, 'type' : 'infected' },
			{ 'ip' : {}, 'type' : 'unknown_host' }
		]
	};
	s3security.dns_edit_setup();
}
//------------------------------------------------------------------------------
s3security.dns_edit_click = function(event) {
	var dns_id = event.target.getAttribute('dns_id');

	for (var i=0; i<s3security.dns_servers_work.length; i++) {
		var dns = s3security.dns_servers_work[i];
		if (dns.id == dns_id) {
			s3security.dns_servers_edit_current = s3security.utils.clone_object(dns);
			s3security.dns_edit_setup();
			break;
		}
	}
}
//------------------------------------------------------------------------------
s3security.dns_edit_save_button = function(is_enable) {
	var button = document.getElementById('dns_servers_edit_save');
	var button2 = document.getElementById('dns_servers_edit_save_check');
	if (is_enable) {
		button.removeAttribute("disabled");
		button2.removeAttribute("disabled");
	} else {
		button.setAttribute("disabled", true);
		button2.setAttribute("disabled", true);
	}
}
//------------------------------------------------------------------------------
s3security.dns_edit_events = function() {
	var dns_elements = [ "dns_servers_edit_enabled", "dns_servers_edit_name", "dns_servers_edit_iplist", "dns_servers_edit_result_adult", "dns_servers_edit_result_infected", "dns_servers_edit_result_unknown_host" ];
	for (var i=0; i<dns_elements.length; i++) {
		var dns_el = document.getElementById(dns_elements[i]);
		var func = function(event){
			if (event && event.keyCode && (event.keyCode == 13)) {
				event.stopPropagation();
				event.preventDefault();
			} else {
				s3security.dns_edit_save_button(true);
			}
		};
		if (dns_el.getAttribute('type') == 'checkbox') {
			dns_el.addEventListener("click", func, true);
		}
		dns_el.addEventListener("change", func, true);
		dns_el.addEventListener("keyup", func, true);
		dns_el.addEventListener("paste", func, true);
		dns_el.addEventListener("keypress", func, true);
	}
}
//------------------------------------------------------------------------------
s3security.dns_edit_setup = function() {
	var dns = s3security.dns_servers_edit_current;
	s3security.dns_edit_save_button(false);

	s3security.dns_edit_return();

	document.getElementById("dns_servers_edit_name").value = dns.name;
	document.getElementById("dns_servers_edit_iplist").value = dns.dns_ip.join(', ');
	document.getElementById("dns_servers_edit_name").setAttribute('value2', dns.name);
	document.getElementById("dns_servers_edit_iplist").setAttribute('value2', dns.dns_ip.join(', '));

	document.getElementById("dns_servers_edit_enabled").checked = dns.enabled;
	document.getElementById("dns_servers_edit_result_adult").value = '';
	document.getElementById("dns_servers_edit_result_infected").value = '';
	document.getElementById("dns_servers_edit_result_unknown_host").value = '';

	for (var i=0; i<dns.result_list.length; i++) {
		var ip_list = [];
		for (var ip in dns.result_list[i].ip) {
			ip_list.push(ip);
		}
		document.getElementById("dns_servers_edit_result_" + dns.result_list[i].type).value = ip_list.join(', ');
	}
}
//------------------------------------------------------------------------------
s3security.dns_edit_value2 = function(self) {
	setTimeout(function(){
		self.setAttribute('value2', self.value);
	}, 10);
}
//------------------------------------------------------------------------------
s3security.dns_edit_close = function() {
	s3security.dns_servers_setup();
}
//------------------------------------------------------------------------------
s3security.dns_edit_return = function() {
	document.getElementById("dns_servers_list").setAttribute("is_hidden", true);
	document.getElementById("dns_servers_edit").setAttribute("is_hidden", false);
	document.getElementById("dns_servers_edit_wait").setAttribute("is_hidden", true);

	document.getElementById("dns_servers_edit_wait_loader").setAttribute("is_hidden", false);
	document.getElementById("dns_servers_edit_wait_percent").setAttribute("is_hidden", false);
	document.getElementById("dns_servers_edit_wait_error").setAttribute("is_hidden", true);
	document.getElementById("dns_servers_edit_wait_return").setAttribute("is_hidden", true);
}
//------------------------------------------------------------------------------
s3security.dns_edit_save = function(save_check) {
	var dns_name = document.getElementById("dns_servers_edit_name").value;
	dns_name = dns_name.replace(/^\s+|\s+$/g, '');
	document.getElementById("dns_servers_edit_name").value = dns_name;
	document.getElementById("dns_servers_edit_name").setAttribute('value2', dns_name);

	var iplist = s3security.utils.make_ip_list(document.getElementById("dns_servers_edit_iplist").value);
	document.getElementById("dns_servers_edit_iplist").value = iplist.join(', ');
	document.getElementById("dns_servers_edit_iplist").setAttribute('value2', iplist.join(', '));

	if ((dns_name == '') || (iplist.length == 0)) { return; }

	//------------------------------------------------------------------------
	var dns = {
		'name' : dns_name,
		'id' : s3security.dns_servers_edit_current.id,
		'dns_ip' : iplist,
		'enabled' : document.getElementById("dns_servers_edit_enabled").checked,
		'result_list' : []
	};
	//------------------------------------------------------------------------
	var dns_type_list = [ 'adult', 'infected', 'unknown_host' ];
	for (var i=0; i<dns_type_list.length; i++) {
		var result = { 'ip' : {}, 'type' : dns_type_list[i] };
		var ip_list = s3security.utils.make_ip_list(document.getElementById("dns_servers_edit_result_" + dns_type_list[i]).value);
		if ((save_check == 'save_check') || (save_check == 'check')) {
			var ip_list_predefine = s3security.dns_edit_predefine_blocklist(iplist, dns_type_list[i]);
			ip_list = ip_list.concat(ip_list_predefine);
		}
		for (var i2=0; i2<ip_list.length; i2++) {
			result.ip[ip_list[i2]] = true;
		}
		dns.result_list.push(result);
	}

	//------------------------------------------------------------------------
	if ((save_check == 'save_check') || (save_check == 'check')) {
		document.getElementById("dns_servers_list").setAttribute("is_hidden", true);
		document.getElementById("dns_servers_edit").setAttribute("is_hidden", true);
		document.getElementById("dns_servers_edit_wait").setAttribute("is_hidden", false);
		document.getElementById("dns_servers_edit_wait_percent").textContent = "...0%";

		var dns_check = [];
		var check_list = [
			{ 'type': 'adult', 'domain' : 'sex.com', 'domain_ip' : '206.125.164.82', 'result_list': [] },
			{ 'type': 'adult', 'domain' : 'redtube.com', 'domain_ip' : '64.210.135.134', 'result_list': [] },
			{ 'type': 'infected', 'domain' : 'google.maniyakat.cn', 'domain_ip' : '103.51.144.81', 'result_list': [] },
			{ 'type': 'infected', 'domain' : 'xinhuawindows.com', 'domain_ip' : '61.191.190.141', 'result_list': [] },
			{ 'type': 'unknown_host', 'domain' : 's98498498.co9849894m', 'domain_ip' : '', 'result_list': [] }
		];
		for (var i=0; i< dns.dns_ip.length; i++) {
			for (var i2=0; i2<check_list.length; i2++) {
				var check_tmp = s3security.utils.clone_object(check_list[i2]);
				check_tmp.id = dns.id;
				check_tmp.name = dns.name;
				check_tmp.dns_ip = [dns.dns_ip[i]];
				check_tmp.enabled = true;
				dns_check.push(check_tmp);
			}
		}
		s3security.dns_edit_check(dns, dns_check, dns_check.length, save_check);
	} else {
		s3security.dns_edit_save2(dns);
	}
}
//------------------------------------------------------------------------------
s3security.dns_edit_predefine_blocklist = function(ip_list, type) {
	var predefine = [
		{
		'dns_ip' : [ '77.88.8.7', '77.88.8.3', '77.88.8.88', '77.88.8.2'  ],
		'adult' : [ '93.158.134.250' ],
		'infected' : [ '213.180.193.250' ],
		'unknown_host' : []
		},
		{
		'dns_ip' : [ '208.67.222.123', '208.67.220.123'],
		'adult' : [ '67.215.65.130' , '146.112.61.106' ],
		'infected' : [ '146.112.61.104', '146.112.61.105', '146.112.61.107', '146.112.61.108', '146.112.61.109', '146.112.61.110'  ],
		'unknown_host' : []
		},
		{
		'dns_ip' : [ '199.85.126.30', '199.85.127.30', '199.85.126.20', '199.85.127.20', '199.85.127.10', '199.85.126.10' ],
		'adult' : [ '156.154.175.230', '156.154.176.230', '156.154.175.232', '156.154.176.232', '156.154.175.20', '156.154.176.20', '156.154.175.30', '156.154.176.30', '156.154.175.216', '156.154.176.216', '156.154.175.217', '156.154.176.217' ],
		'infected' : [ '156.154.175.228', '156.154.176.228', '156.154.175.10', '156.154.176.10', '156.154.175.215', '156.154.176.215' ], 
		'unknown_host' : [ '54.200.75.96' ]
		},
		{
		'dns_ip' : ['8.26.56.26', '8.20.247.20'],
		'adult' : [],
		'infected' : [ '174.129.145.134' ],
		'unknown_host' : [ '92.242.144.50' ]
		}
	];
	for (var i=0; i<ip_list.length; i++) {
		for (var i2=0; i2<predefine.length; i2++) {
			if (predefine[i2].dns_ip.indexOf(ip_list[i]) >= 0) {
				return predefine[i2][type];
			}
		}
	}
	return [];
}
//------------------------------------------------------------------------------
s3security.dns_edit_save2 = function(dns) {
	var is_new = true;

	for (var i=0; i<s3security.dns_servers_work.length; i++) {
		var dns_work = s3security.dns_servers_work[i];
		if (dns_work.id == dns.id) {
			is_new = false;
			s3security.dns_servers_work[i] = dns;
			break;
		}
	}
	if (is_new) {
		s3security.dns_servers_work.push(dns);
	}
	s3security.pref_save('security_dns_list', s3security.dns_servers_work);
	s3security.dns_servers_edit_current = dns;
	s3security.dns_edit_setup();
}
//------------------------------------------------------------------------------
s3security.dns_edit_delete = function() {
	if (! window.confirm(s3security.utils.get_string('confirm_warning'))) { return; }

	var dns = s3security.dns_servers_edit_current;
	var dns_new = [];

	for (var i=0; i<s3security.dns_servers_work.length; i++) {
		var dns_work = s3security.dns_servers_work[i];
		if (dns_work.id != dns.id) {
			dns_new.push(dns_work);
		}
	}
	if (dns_new.length == 0) {
		dns_new = s3security.utils.clone_object(s3security.dns_servers);
	}
	s3security.dns_servers_work = dns_new;
	s3security.pref_save('security_dns_list', s3security.dns_servers_work);
	s3security.dns_edit_close();
}
//------------------------------------------------------------------------------
s3security.dns_edit_check = function(dns, dns_check, dns_check_max, save_check) {
	dns_check_max = (dns_check_max) ? dns_check_max : dns_check.length;
	var dns2 = dns_check.shift();
	document.getElementById("dns_servers_edit_wait_percent").textContent = "..." + Math.floor((dns_check_max - dns_check.length)*100/dns_check_max) +"%";
	//------------------------------------------------------------------------
	if (dns2) {
		var request = {
			'dns_servers' : [dns2],
			'is_test' : true,
			'host' : dns2.domain,
			'timeout' : 5000
		};
		//----------------------------------------------------
		var str = '[begin]' + JSON.stringify(request) + '[end]';
		str = s3security.utils.urlencode(str);
		var url = 'http://127.0.0.1:53861/?' + str;
		var req = new XMLHttpRequest();
		req.open("GET", url, true);
		req.onreadystatechange = function (event) {
			if (event.target.readyState == 4) {
				var result = JSON.parse(event.target.responseText);
				s3security.dns_edit_check_response(result, dns, dns_check, dns2, dns_check_max, save_check);
			}
		};
		req.send(null);
	}
	//------------------------------------------------------------------------
	else {
		var adult = 0;
		var infected = 0;
		for (var i=0; i<dns.result_list.length; i++) {
			if (dns.result_list[i].type == 'adult') {
				adult = Object.keys(dns.result_list[i].ip).length;
			} else if (dns.result_list[i].type == 'infected') {
				infected = Object.keys(dns.result_list[i].ip).length;
			}
		}
		if ((adult > 0) || (infected > 0)) {
			if (save_check == 'save_check') {
				s3security.dns_edit_save2(dns);
			} else {
				s3security.dns_servers_edit_current = dns;
				s3security.dns_edit_setup();
			}
		} else {
			document.getElementById("dns_servers_edit_wait_loader").setAttribute("is_hidden", true);
			document.getElementById("dns_servers_edit_wait_percent").setAttribute("is_hidden", true);
			document.getElementById("dns_servers_edit_wait_error").setAttribute("is_hidden", false);
			document.getElementById("dns_servers_edit_wait_return").setAttribute("is_hidden", false);
			s3security.utils.HTMLDOM_value(document.getElementById("dns_servers_edit_wait_error"), s3security.utils.get_string('dns_not_secure').replace(/DNS_NAME/, dns.name));
		}
	}
}
//------------------------------------------------------------------------------
s3security.dns_edit_check_response = function(result, dns, dns_check, dns2, dns_check_max, save_check) {
	if ((result.domain_status == 'error') && (dns2.type != 'unknown_host')) {
		document.getElementById("dns_servers_edit_wait_loader").setAttribute("is_hidden", true);
		document.getElementById("dns_servers_edit_wait_percent").setAttribute("is_hidden", true);
		document.getElementById("dns_servers_edit_wait_error").setAttribute("is_hidden", false);
		document.getElementById("dns_servers_edit_wait_return").setAttribute("is_hidden", false);
		s3security.utils.HTMLDOM_value(document.getElementById("dns_servers_edit_wait_error"), result.domain_dns_ip + ' : ' + s3security.utils.get_string('failed_connection'));
		return;
	}
	else if (result.domain_ip_list) {
		for (var i=0; i<dns.result_list.length; i++) {
			if (dns.result_list[i].type == dns2.type) {
				if (result.domain_ip_list.indexOf(dns2.domain_ip) < 0) {
					for (var i2=0; i2<result.domain_ip_list.length; i2++) {
						dns.result_list[i].ip[result.domain_ip_list[i2]] = true;
					}
				}
				break;
			}
		}
	}
	s3security.dns_edit_check(dns, dns_check, dns_check_max, save_check);
}
//------------------------------------------------------------------------------
s3security.dns_test_check_enter = function(event) {
	if (event.keyCode && (event.keyCode == 13)) {
		event.stopPropagation();
		event.preventDefault();
		s3security.dns_test_start();
	}
}
//------------------------------------------------------------------------------
s3security.dns_test_start = function() {
	var domain = document.getElementById("dns_test_domain").value;
	domain = domain.replace(/\s/g, '').replace(/^https?\:\/\//gi, '').replace(/\/.+$/g, '');
	if (domain.length == 0) {
		domain = 'google.com';
	}
	document.getElementById("dns_test_domain").value = domain;

	//------------------------------------------------------------------------
	var dns_servers = s3security.utils.clone_object(s3security.dns_servers_work);
	for (var i=0; i<dns_servers.length; i++) {
		if (! dns_servers[i].enabled) {
			continue;
		}

		document.getElementById("dns_icon[" + dns_servers[i].id + "]").setAttribute('domain_status', 'unknown');
		document.getElementById("dns_icon[" + dns_servers[i].id + "]").setAttribute('is_hidden', false);
		s3security.utils.HTMLDOM_value(document.getElementById("dns_status[" + dns_servers[i].id + "]"), '');
		s3security.utils.HTMLDOM_value(document.getElementById("dns_timer[" + dns_servers[i].id + "]"), '');

		var dns = s3security.utils.clone_object(dns_servers[i]);
		var request = {
			'dns_servers' : [dns],
			'is_test' : true,
			'host' : domain,
			'timeout' : 3000
		};
		//----------------------------------------------------
		var str = '[begin]' + JSON.stringify(request) + '[end]';
		str = s3security.utils.urlencode(str);
		var url = 'http://127.0.0.1:53861/?' + str;
		var req = new XMLHttpRequest();
		req.open("GET", url, true);
		req.onreadystatechange = function (event) {
			if (event.target.readyState == 4) {
				var json_data = JSON.parse(event.target.responseText);
				s3security.dns_test_response(json_data);
			}
		};
		req.send(null);
	}
}
//------------------------------------------------------------------------------
s3security.dns_test_response = function(result) {
	var map_status = {
		'unknown' : 0,
		'error' : 1,
		'white' : 2,
		'infected' : 3,
		'adult' : 4
	};

	var dns_icon = document.getElementById("dns_icon[" + result.domain_dns_id + "]");
	var last_status = dns_icon.getAttribute('domain_status');
	var last_status_id = map_status[last_status];
	var current_status_id = map_status[result.domain_status];

	if (current_status_id > last_status_id) {
		dns_icon.setAttribute('domain_status', result.domain_status);
		var status = s3security.utils.get_string('security_' + result.domain_status + '_alert', [result.domain_dns_name]).replace(/\s*\(.+?\)/, '');
		s3security.utils.HTMLDOM_value(document.getElementById("dns_status[" + result.domain_dns_id + "]"), status);
	}

	s3security.utils.HTMLDOM_value(document.getElementById("dns_timer[" + result.domain_dns_id + "]"), result.domain_time_wait + ' ms');
}
//------------------------------------------------------------------------------
s3security.reset_settings = function() {
	if (confirm(s3security.utils.get_string('confirm_warning'))) {
		chrome.runtime.sendMessage({ 'action_reset_defaults': true }, function(response) {
			s3security.prefs.reset_defaults(function(){
				s3security.utils.i18n_parse(document);
				s3security.init();
				s3security.save_settings_message();
			});
		});
	}
}
//------------------------------------------------------------------------------
s3security.save_settings_message = function() {
	document.getElementById("settings_saved").removeAttribute('is_hidden');
	setTimeout(function(){
		document.getElementById("settings_saved").setAttribute('is_hidden', true);
	}, 500);
}
//------------------------------------------------------------------------------
window.addEventListener("load", function(){
	s3security.prefs.init(s3security.init_0);
});
