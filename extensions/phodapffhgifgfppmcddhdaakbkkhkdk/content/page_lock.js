var s3security = {};
s3security.url = null;

//------------------------------------------------------------------------------
s3security.init = function() {
	s3security.url = window.location.search;
	s3security.url = s3security.utils.urldecode(s3security.url.replace(/^\?/, ''));

	chrome.runtime.sendMessage({ action_get_tab_data: true, is_pagelock: true }, function(response) {
		var aTab = (response && response.tab_data) ? response.tab_data : null;
		//------------------------------------------------------------------
		if (aTab && (aTab.url == s3security.url) && aTab.is_locked && (! aTab.show_pagelock)) {
			s3security.start(aTab);
		} else if (s3security.url) {
			window.location = s3security.url;
		}
	});
}
//------------------------------------------------------------------------------
s3security.start = function(aTab) {
	var is_closetab = false;

	if (aTab.history) {
		if (aTab.history.length == 1) {
			is_closetab = true;
		} else if ((aTab.history.length == 2) && (aTab.history[0] == s3security.url)) {
			is_closetab = true;
		}
	}
	if (window.history.length <= 1) {
		is_closetab = true;
	}

	if (aTab.is_closetab && is_closetab) {
		window.close();
	} else {
		s3security.tab_show_page_lock(aTab);
	}
}
//------------------------------------------------------------------------------
s3security.tab_show_page_lock = function(aTab) {
	//-----------------------------------------------------------------------
	if ((! aTab) || (! aTab.s3security)) {
		return;
	}
	//-----------------------------------------------------------------------
	var wm_window = window;
	var doc = wm_window.document;

	//-----------------------------------------------------------------------
	var page = null;
	//-----------------------------------------------------------------------
	if (! s3security.utils.prefs_get('security_page_lock_default')) {
		var page_source = s3security.utils.prefs_get('security_page_lock_source');
		if (page_source && (page_source != 'DEFAULT_PAGE')) {
			try {
				page = s3security.utils.parseHTML(s3security.utils.parseTemplate(page_source, aTab.s3security), wm_window);
			} catch(e) {
			}
		}
	}
	//-----------------------------------------------------------------------
	if (! page) {
		page = s3security.utils.parseHTML(s3security.utils.parseTemplate(s3security.page_lock_template, aTab.s3security), wm_window);
	}
	//-----------------------------------------------------------------------
	doc.replaceChild(page.documentElement, doc.documentElement);
}
//------------------------------------------------------------------------------
window.addEventListener("load", s3security.init);
