(function(){

document.write('<link rel="stylesheet" href="'+chrome.extension.getURL('advanced-settings.css')+'" />')

var loadSettings = function() {

	$('input[type=text]').each(function(i,element) {
		var element = $(element);
		var name = 'settings.'+element.attr("name");
		if ( localStorage[name] == null ) return;
		element.attr('value', localStorage[name]);
	});

	$('input[type=checkbox]').each(function(i,element) {
		var element = $(element);
		var name = 'settings.'+element.attr("name");
		element.attr('checked', !!localStorage[name]);
	});

	$('.setting, textarea').each(function(i,element) {
		var element = $(element);
		var name = 'settings.'+element.attr("name");
		if ( localStorage[name] == null ) return;
		element.text(localStorage[name]);
	});

}

var saveSettings = function(event) {

	var send_config_changed = function(name, value) {
		chrome.extension.sendRequest({ type : 'configChanged', name: name, value: value, }, function(){} )
	};

	$('input[type=text], textarea').each(function(i,element) {
		var element = $(element);
		var setting = element.attr("name");
		var stored  = localStorage['settings.'+setting];
		var entered = element.attr('value');
		var changed = ( entered ? !!(!stored || stored != entered) : !!stored )
		if (changed) {
			localStorage['settings.'+setting] = entered;
			send_config_changed(setting, entered ? entered : '');
		}
	});

	$('input[type=checkbox]').each(function(i,element) {
		var element = $(element);
		var setting = element.attr("name");
		var stored  = !!localStorage['settings.'+setting];
		var entered = !!element.prop('checked');
		var changed = ( entered ? !!(!stored || stored != entered) : !!stored )
		if (changed) {
			if (entered)
				localStorage['settings.'+setting] = 'true';
			else
				delete localStorage['settings.'+setting];

			send_config_changed(setting, entered ? entered : false);
		}
	});

	$('.setting').each(function(i,element) {
		var element = $(element);
		var setting = element.attr("name");
		var stored  = localStorage['settings.'+setting];
		var entered = element.text();
		var changed = ( entered ? !!(!stored || stored != entered) : !!stored )
		if (changed) {
			localStorage['settings.'+setting] = entered;
			send_config_changed(setting, entered ? entered : '');
		}
	});

	event.preventDefault();
	return false;
}

var showContent = function(event)
{
	loadSettings();
	document.getElementById("warning").style.display="none";
	document.getElementById("content").style.display="block";

	event.preventDefault();
	return false;
}

document.addEventListener('DOMContentLoaded', function () {
	document.querySelector('#understandButton').addEventListener('click', showContent);
	document.querySelector('form').addEventListener('submit', saveSettings);
});


})();
