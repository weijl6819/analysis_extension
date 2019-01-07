/*
 * Image On/Off Chrome Extension
 * www.singleclickapps.com 
 *
 * Distributed under GPL License. 
 * https://github.com/SingleClickApps
 */

var prefs;
var contextMenuId = null;
var icon = 'defaultIcon';

var chromeContentSettings = chrome.contentSettings;
/* currently (chrome 16), infobars is not implemented (only experimental...) */
var chromeInfobars = chrome.infobars;

var currHost = '';

init();

if(chromeContentSettings) {
	
	var forbiddenOrigin = /(chrome\:\/\/)/g,
		incognito,
		url,
		setting,
		tabId,
		matchForbiddenOrigin;

	chrome.tabs.onUpdated.addListener(function(tabId, props, tab) {
		// Prevent multiple calls
		if (props.status == "loading" && tab.selected) {
			//console.info("onUpdated");
			getSettings();
		}
	});

	chrome.tabs.onHighlighted.addListener(function() {
		//console.info("onHighlighted");
		getSettings();
	});

	chrome.windows.onFocusChanged.addListener(function() {
		//console.info("onFocusChanged");
		getSettings();
	});

	chrome.windows.getCurrent(function(win) {
		chrome.tabs.query( {'windowId': win.id, 'active': true}, function(){
			//console.info("getCurrent");
			getSettings();
		});
	});

	chrome.browserAction.onClicked.addListener(changeSettings);

} else {
	chrome.browserAction.onClicked.addListener(openImgPanel.call());
}

function updateIcon(setting) {
    
    if (icon == 'darkIcon')
        chrome.browserAction.setIcon({path:"icon-dark-" + setting + ".png"});
    else if (icon == 'lightIcon')
        chrome.browserAction.setIcon({path:"icon-light-" + setting + ".png"});    
    else
		chrome.browserAction.setIcon({path:"icon-" + setting + ".png"});
		
		/*
		//if you like useless caption changes...
		if(setting=="allow"){chrome.browserAction.setTitle({title:"Disable Images"});}
		else if(setting=="block"){chrome.browserAction.setTitle({title:"Enable Images"});}
		else {chrome.browserAction.setTitle({title:"Images On/Off"});}
		*/
}

function getSettings() {
	chrome.tabs.getSelected(undefined, function(tab) {
		incognito = tab.incognito;
		url = tab.url;
		tabId = tab.id;
		
		//console.info("Current tab settings : "+url);
		chromeContentSettings.images.get({
			'primaryUrl': url,
			'incognito': incognito
		},
		function(details) {
			//console.info("Current tab settings : "+url);
			url ? matchForbiddenOrigin = url.match(forbiddenOrigin,'') : matchForbiddenOrigin = true;
			matchForbiddenOrigin ? updateIcon("inactive") : updateIcon(details.setting);				
		});
	});
}

function changeSettings() {
	if (!matchForbiddenOrigin) {
		chromeContentSettings.images.get({
			'primaryUrl': url,
			'incognito': incognito
		},
		function(details) {

			setting = details.setting;
			if (setting) {
				var urlParser = new URL(url);
				var pattern = /^file:/.test(url) ? url : (urlParser.hostname + '/*');

				// If this is not a file
				if (!/^file:/.test(url)) {
					pattern = prefs.allProtocols?'*://':(urlParser.protocol + '//');
					// Split hostname into parts, if more than 2 and allSubdomains is set, make it wildcard
					domParts = urlParser.hostname.split('.');
					if (prefs.allSubdomains && domParts.length > 2) {
						// Cut down hostname to two parts: domain.tld
						while (domParts.length > 2) {
							domParts.shift();
						}
						pattern += '*.' + domParts.join('.');
					} else {
						pattern += urlParser.hostname;
					}
					// If allPorts is set, add wildcard port, otherwise use given port, if set
					pattern += prefs.allPorts?':*':(urlParser.port?':'+urlParser.port:'');
					pattern += '/*';
				}
				
				currHost = pattern;
				
				// old method : url.replace(/\/[^\/]*?$/, '/*')
				var newSetting = (setting == 'allow' ? 'block' : 'allow');
				chromeContentSettings.images.set({
					'primaryPattern': pattern,
					'setting': newSetting,
					'scope': (incognito ? 'incognito_session_only' : 'regular')
				});
				
				updateIcon(newSetting);

				

				if (prefs.autoRefresh) {
					chrome.tabs.reload(tabId,{"bypassCache":true});
				}

				setLocalStorageRule(pattern, newSetting);

				//console.info("images is now "+newSetting+"ed on "+pattern);
			}
			else {
				//console.error("error, the setting is "+setting);
			}
		});
	}
	else {
		
		if(chromeInfobars) {
			chromeInfobars.show({"tabId": tabId, "path": "infobar.html"});
		}
		else {
			//console.error("You can't disable images on "+url);
		}
		
	}
}


function getLocalStorageRules() {
	return window.localStorage.imgTF_rules;
}

function setLocalStorageRule(pattern, newSetting) {

	if (!incognito) {

		var keyExist = false;

		if (rules.length) {
			for(i = 0; i < rules.length; i++) {
				if(pattern == rules[i].primaryPattern) {
					rules[i].setting = newSetting;
					keyExist = true;
					break;
				}
			}
		}

		if (!keyExist) {
			rules.push({
				'primaryPattern': pattern,
				'setting': newSetting,
				'scope': (incognito ? 'incognito_session_only' : 'regular')
			});
		}

		window.localStorage.setItem('imgTF_rules',JSON.stringify(rules));

	}

}

function importRules(localStorageRules) {

	var rules = localStorageRules;

	if (rules.length) {
		for(i = 0; i < rules.length; i++) {

			chrome.contentSettings.images.set({
				'primaryPattern': rules[i].primaryPattern,
				'setting': rules[i].setting,
				'scope': rules[i].scope
			});
		}
	}

	window.localStorage.setItem('imgTF_rules',JSON.stringify(rules));

}

function clearRules(arg) {
	
	if (arg == "contentSettings" || arg === undefined) {
		chromeContentSettings.images.clear({'scope': (incognito ? 'incognito_session_only' : 'regular')});
	}
	if (arg == "localStorage" || arg === undefined) {
		rules = [];
		window.localStorage.setItem('imgTF_rules',[]);
	}
}

function getLocalStoragePrefs() {
	
	// img_on_off_prefs
	if (!window.localStorage.img_on_off_prefs) {
		window.localStorage.img_on_off_prefs = JSON.stringify({ "showContextMenu": false, "autoRefresh": true });
	}
	prefs = JSON.parse(window.localStorage.img_on_off_prefs);

	// imgTF_rules
	if (!window.localStorage.imgTF_rules) {
		clearRules("localStorage");
	} else {
		rules = JSON.parse(window.localStorage.imgTF_rules);
	}

	// imgTF_version
	var currentVersion = getVersion();
	var previousVersion = window.localStorage.imgTF_version;
	if (currentVersion != previousVersion) {
		if (typeof previousVersion == 'undefined') {
			onInstall();
		} else {
			onUpdate();
		}
		window.localStorage.imgTF_version = currentVersion;
	}

    // icon is now inside prefs->lightIcon ...etc.
         if (prefs.darkIcon) icon = 'darkIcon'
    else if (prefs.lightIcon) icon = 'lightIcon'
    else icon = 'defaultIcon';
    
}

//set on uninstall url
chrome.runtime.setUninstallURL('https://singleclickapps.com/images-on-off/removed-chrome.html');

// Check if the version has changed.
function onInstall() {
	if (rules.length) {	importRules(rules);	}
//  console.log("Extension Installed");
	if (navigator.onLine) {
		chrome.tabs.create({url: 'https://singleclickapps.com/images-on-off/instructions.html'});
	}
}
function onUpdate() {
	if (rules.length) {	importRules(rules);	}
//  console.log("Extension Updated");
	if (navigator.onLine) {
		chrome.tabs.create({url: 'https://singleclickapps.com/images-on-off/whatsnew-2.3.html'});
	}
}
function getVersion() {
	var details = chrome.app.getDetails();
	return details.version;
}

function toggleContextMenu() {

	if (prefs.showContextMenu && !contextMenuId) {
		
		contextMenuId = chrome.contextMenus.create({
			"title" : "Settings -> Image exceptions",
			"type" : "normal",
			"contexts" : ["all"],
			"onclick" : openImgPanel()
		});
		
	}

	if (!prefs.showContextMenu && contextMenuId) {
		
		chrome.contextMenus.remove(contextMenuId);
		contextMenuId = null;
		
	}

}
/** Opens Chrome's Image Settings panel */
function openImgPanel() {
	return function(info, tab) {
		chrome.tabs.create({"url":"chrome://settings/content/images", "selected":true});
	};
}

/** Loads preferences and adds/removes context menu entry. */
function init() {
	
	getLocalStoragePrefs();
	toggleContextMenu();
	
}

