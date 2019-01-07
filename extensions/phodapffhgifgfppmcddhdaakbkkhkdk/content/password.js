var s3security = {};
s3security.form = null;
s3security.url = null;
s3security.tab_id = 0;

//------------------------------------------------------------------------------
s3security.init = function() {
	s3security.url = window.location.search;
	s3security.url = s3security.utils.urldecode(s3security.url.replace(/^\?/, ''));
	//------------------------------------------------------------------------
	chrome.tabs.getCurrent(function(tab){
		s3security.tab_id = tab.id;
	});
	//------------------------------------------------------------------------
	s3security.utils.i18n_parse(document);
	s3security.form = document.getElementById('form_password');
	s3security.form.addEventListener('submit', function(event){
		event.stopPropagation();
		event.preventDefault();
		s3security.check_password();
	});
}
//------------------------------------------------------------------------------
s3security.check_password = function() {
	var password_value = s3security.form['password_value'].value;

	chrome.runtime.sendMessage({ action_check_password: true, 'password_value': password_value, 'tab_id': s3security.tab_id }, function(response) {
		if (response && response.success) {
			chrome.tabs.update(s3security.tab_id, { url: s3security.url });
		} else {
			s3security.form['password_value'].value = '';
			var prompt_password_error_text = s3security.utils.get_string('prompt_password_error');
			if (! window.confirm(prompt_password_error_text)) {
				window.close();
			}
		}
	});
}
//------------------------------------------------------------------------------
window.addEventListener("load", function(){
	s3security.prefs.init(s3security.init);
});
