 
function doinit() {
	loadSavedOptions();

	document.getElementById('optmailto').innerHTML = chrome.i18n.getMessage('optMailto');
	document.getElementById('optgmail').innerHTML = chrome.i18n.getMessage('optgmail');
	document.getElementById('optInTab').innerHTML = chrome.i18n.getMessage('optInTab');
	document.getElementById('optInWin').innerHTML = chrome.i18n.getMessage('optInWin');
	
	var saveHandlers = document.getElementsByClassName(""); 
	Array.from(document.getElementsByClassName("initSave")).forEach(function(item) {
		item.addEventListener('click', saveOptions);
	});
}
 
function loadSavedOptions() {
  if (window.localStorage == null) {
    alert("LocalStorage must be enabled for managing options.");
    return;
  }

  var windowOptions = localStorage["opt_new_window"];
  document.getElementById('open_new_tab').checked = (windowOptions != "true") ? true : false;
  document.getElementById('open_new_window').checked = (windowOptions == "true") ? true : false;


  var gmailOptions = localStorage["opt_use_gmail"];
  document.getElementById('use_mailto').checked = (gmailOptions != "true") ? true : false;
  document.getElementById('use_gmail').checked = (gmailOptions == "true") ? true : false;
}
 
function saveOptions() {

  localStorage["opt_use_gmail"] = document.getElementById('use_gmail').checked;
  localStorage["opt_new_window"] = document.getElementById('open_new_window').checked;
}

document.addEventListener('DOMContentLoaded', doinit);
 