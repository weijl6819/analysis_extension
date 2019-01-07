var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-105840655-3']);
_gaq.push(['_trackPageview']);

(function() {
	var ga = document.createElement('script');
	ga.type = 'text/javascript';
	ga.async = true;
	ga.src = 'https://ssl.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(ga, s);
})();


var alert_string = "The request must be longer than 2 characters";
var placehold = "Torrents search";
var show_alert = false;
var popup_default_width = 400;
var popup_default_height = 40;
var autocomplete_id = 0;
//localize, if ready

alert_string = chrome.i18n.getMessage("appAlertPopup");
placehold = chrome.i18n.getMessage("appPlaceholderPopup");

//addListener's (IE support :())
function addCustomListener(object, type, handler) {
	if (object.addEventListener) {
		object.addEventListener(type, handler);
	} else // if(object.attachEvent)
	{
		object['on'+type] = handler;
	}
}

//removeListener's
function removeCustomListener(object, type, handler){
	if( object.removeEventListener ){
		object.removeEventListener(type,handler);
	}
}

//function to remove alert div and resize popup, if alert exist
function removeAlertDiv(){
	if( show_alert ){
		document.body.removeChild(document.querySelector('.alert_div'));
		var size = bgWindow.Popup.getCurrentSize();
		bgWindow.Popup.resize(size.width, size.height - 40);
		show_alert = false;
	}
}

function getMagnetLink(link){
	var onSuccess = function(resp){
		var resp = JSON.parse(resp);
		var magnetLink = resp.magnetLink;

		chrome.tabs.create({url:magnetLink},function(){});
	};
	var onError = function(){};
	var magnetUrl = 'http://megafindr.com/pirate/torrent/';
	bgWindow.RequestPost(magnetUrl, 'link='+encodeURIComponent(link), onSuccess, onError);
}

function implement_search_data(inp_value){
	//if input text exist and length > 2
	if( inp_value.length > 0 ){
		if( inp_value.length > 2 ){
			document.getElementById('search-input').value = inp_value;

			//encode input value
			var encoded_val = encodeURI(inp_value.trim());
			var searchUrl = 'http://megafindr.com/pirate/' + encoded_val;
			_gaq.push(['_trackEvent', 'search', inp_value]);

			autocomplete.className = 'center';
			autocomplete.innerHTML = '<img src="./files/images/loading.gif">';

			var onSuccess = function(resp){
				resp = JSON.parse(resp);
			
				autocomplete.className = '';
				autocomplete.innerHTML = '';

				if( resp.error ){
					show_alert = true;
					var size = bgWindow.Popup.getCurrentSize();
					bgWindow.Popup.resize(size.width, size.height + 40);
					var div_alert = document.createElement("div");
					div_alert.className = "alert_div";
					div_alert.innerHTML = '<span>' + resp.errorDescription + '</span>';
					document.body.appendChild(div_alert);
					return;
				}

				for( var i = 0, l = resp['torrents'].length; i < l; i++ ){
					var auto = document.createElement('div');
					auto.className = 'torrent_element';
					auto.setAttribute('data-link', resp.torrents[i].link);
					auto.innerHTML = '<div><strong>'+resp.torrents[i].title+'</strong></div><div>'+resp.torrents[i].description+'</div><div>Seeders: '+resp.torrents[i].seeders+'</div><div>Leechers: '+resp.torrents[i].leechers+'</div>';
					autocomplete.appendChild(auto);

					addCustomListener(auto, 'click', function(){
						var torrentLink = this.dataset.link;
						getMagnetLink(torrentLink);
					});
				}
			}
			var onError = function(){};
			bgWindow.Request(searchUrl, onSuccess, onError);
		} else {
			//if length <= 2 - show alert message
			if( !show_alert ){
				show_alert = true;
				var size = bgWindow.Popup.getCurrentSize();
				bgWindow.Popup.resize(size.width, size.height + 40);
				var div_alert = document.createElement("div");
				div_alert.className = "alert_div";
				div_alert.innerHTML = '<span>' + alert_string + '</span>';
				document.body.appendChild(div_alert);
			}	
		}
	}
}

//get html code of popup page
function getCode(){
	var code = '<div id="search">\
				<span id="search-button"><i class="icon-magnifier"></i></span>\
				<input id="search-input" placeholder="' + placehold + '" name="text" autocomplete="off" value="">\
				<div id="reset_container" class="hidden"><span id = "reset"><i class="icon-close"></i></span></div>\
				</div>\
				<div id="autocomplete" class="hidden"></div>';
	return code;
}

function init(){
	autocomplete_id = 0;
	//resize popup to default value
	bgWindow.Popup.resize(popup_default_width, popup_default_height);
	var div = document.createElement('div');
	div.innerHTML = getCode();
	document.body.appendChild(div);
	String.prototype.trim = function(){
		return this.replace(/^\s+|\s+$/g,'');
	}

	// Search
	var search_input = document.querySelector('#search-input');
	var reset = document.querySelector('#reset_container');
	var autocomplete = document.querySelector('#autocomplete');
	var search_button = document.querySelector('#search-button');

	search_input.focus();

	addCustomListener(search_input, 'keyup', function(e){
		var keyCode = e.keyCode ? e.keyCode : e.which;
		switch( keyCode ){
			case 37:
			case 38:
			case 39:
			case 40:
			case 13: break;
			default:
				//else - try to remove alert div if exist
				removeAlertDiv();
				autocomplete.className = '';
				autocomplete.innerHTML = '';
				autocomplete_id = 0;
				if( this.value !== '' ){
					//if textinput not empty - show reset button
					reset.className = '';
					//send request for autocomplete values

					var onSuccess = function(resp){
						resp = JSON.parse(resp);
						if( resp.length > 1 ){
							for( var i = 0, l = resp[1].length; i < l; i++ ){
								var auto = document.createElement('div');
								auto.className = 'autocomplete_element';
								auto.innerHTML = resp[1][i];
								autocomplete.appendChild(auto);
								addCustomListener(auto, 'click', function(){
									var inp_value = this.innerHTML;
									implement_search_data(inp_value);
								});

								addCustomListener(auto, 'keyup', function(e){
									e = e || window.event;
									var keyCode = e.keyCode ? e.keyCode : e.which;
									if( keyCode == 13 ){
										if( this.className.indexOf('selected') != -1 ){
											var inp_value = this.innerHTML;
											implement_search_data(inp_value);
										}
									}
								});

							}
							bgWindow.Popup.resize(popup_default_width, popup_default_height + (l * 21));
						} else {
							autocomplete.className = 'hidden';
							bgWindow.Popup.resize(popup_default_width, popup_default_height);
						}
					}
					var onError = function(){};
					bgWindow.Request('http://suggestqueries.google.com/complete/search?client=firefox&q=' + this.value, onSuccess, onError);
				} else {
					autocomplete.className = 'hidden';
					bgWindow.Popup.resize(popup_default_width, popup_default_height);
					reset.className = 'hidden';
				}
			break;
		}
	});

	addCustomListener(search_input, 'keydown', function(e) {
		var keyCode = e.keyCode ? e.keyCode : e.which;
		switch( keyCode ){
			case 40:
				e.preventDefault();
				var childs = autocomplete.querySelectorAll('div');
				if( autocomplete_id !== childs.length ){
					autocomplete_id++;
					var selected = autocomplete.querySelector('.selected');
					if( selected ){
						selected.className = 'autocomplete_element';
					}
					childs[autocomplete_id - 1].className = childs[autocomplete_id - 1].className + ' selected';
				}
				break;

			case 38:
				e.preventDefault();
				var childs = autocomplete.querySelectorAll('div');
				if( autocomplete_id !== 1 ){
					autocomplete_id--;
					var selected = autocomplete.querySelector('.selected');
					if( selected ){
						selected.className = 'autocomplete_element';
					}
					childs[autocomplete_id - 1].className = childs[autocomplete_id - 1].className + ' selected';
				}
				break;
			case 37:
			case 39:
			case 13:
			default:break;
		}
	});

	//add searchclick listener
	addCustomListener(search_button, 'click', function() {
		var inp_value = search_input.value;
		implement_search_data(inp_value);
	});
	
	addCustomListener(reset,'click', function() {
		autocomplete.innerHTML = '';
		autocomplete.className = 'hidden';
		bgWindow.Popup.resize(popup_default_width, popup_default_height);
		search_input.value = "";
		this.className = "hidden";
	});

	addCustomListener(search_input, 'keypress', function(e) {
		e = e || window.event;
		var keyCode = e.keyCode ? e.keyCode : e.which;
		if( keyCode == 13 ){
			var if_selected = document.querySelector('.selected');
			if(if_selected){
				var inp_value = if_selected.innerHTML;
				implement_search_data(inp_value);
			} else {
				var inp_value = search_input.value;
				implement_search_data(inp_value);
			}
		}
	});	
}

(function main() {
	setTimeout(function() {
		init();
	}, 100);
})();
