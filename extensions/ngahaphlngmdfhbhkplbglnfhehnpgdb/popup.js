var _func = {
	app: chrome.extension.getBackgroundPage(),
	lang: chrome.i18n.getUILanguage(),
	label: () => {return document.querySelector('#control .label')},
	on: () => {
		_func.app.self.toggle = true;
		localStorage.toggle = true;
		chrome.browserAction.setIcon({path: "images/enabled.png"});
		chrome.browserAction.setTitle({title: 'On'});
	},
	off: () => {
		_func.app.self.toggle = false;
		localStorage.toggle = false;
		chrome.browserAction.setIcon({path: "images/disabled.png"});
		chrome.browserAction.setTitle({title: 'Off'});
	},
	ready: () => {
		$(document).ready(() => {
			$("#email_address").hide();
			$("#email_support").click(() => {
				$("#email_address").show();
			})
			_func.lang.indexOf('ru') != - 1 ? $('#fb_support').hide() : $("#vk_support").hide();
			$('input').lc_switch();
			chrome.runtime.sendMessage({"get": "is_enabled"}, response => {
				response.is_enabled ? ($('.lcs_check').lcs_on(), _func.on()) : ($('.lcs_check').lcs_off(), _func.off());
			});
			$('body').delegate('.lcs_check', 'lcs-on', () => {
				_func.label().innerHTML = chrome.i18n.getMessage("popup_on");
				_func.label().style.color = 'green';
				_func.label().style.fontSize = '12px';
				_func.on();
			});
			$('body').delegate('.lcs_check', 'lcs-off', () => {
				_func.label().innerHTML = chrome.i18n.getMessage("popup_off");
				_func.label().style.color = 'red';
				_func.label().style.fontSize = '12px';
				_func.off();
			});
		});
	}
}

_func.ready();