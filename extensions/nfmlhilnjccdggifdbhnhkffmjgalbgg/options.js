

document.addEventListener("webkitvisibilitychange", showRules, false);

function save() {
	var prefs = JSON.parse(window.localStorage.img_on_off_prefs);
	prefs.showContextMenu = document.getElementById("contextMenu").checked;
	prefs.autoRefresh = document.getElementById("autoRefresh").checked;

	prefs.allProtocols = document.getElementById("allProtocols").checked;
	prefs.allSubdomains = document.getElementById("allSubdomains").checked;
	prefs.allPorts = document.getElementById("allPorts").checked;
    
    prefs.lightIcon = document.getElementById("lightIcon").checked;
    prefs.defaultIcon = document.getElementById("defaultIcon").checked;
    prefs.darkIcon = document.getElementById("darkIcon").checked;
    //update icon
    if (prefs.darkIcon)
        chrome.browserAction.setIcon({path:"icon-dark-allow.png"});
    else if (prefs.lightIcon)
        chrome.browserAction.setIcon({path:"icon-light-allow.png"});    
    else
		chrome.browserAction.setIcon({path:"icon-allow.png"});
    
	window.localStorage.img_on_off_prefs = JSON.stringify(prefs);
	
	chrome.extension.getBackgroundPage().init();
}
function showRules() {
	document.getElementById("imgTF_rules").value = chrome.extension.getBackgroundPage().getLocalStorageRules();
}

window.onload = function() {

	var prefs = JSON.parse(window.localStorage.img_on_off_prefs);

	showRules();

	document.getElementById("contextMenu").checked = prefs.showContextMenu;
	document.getElementById("autoRefresh").checked = prefs.autoRefresh;
	document.getElementById("allProtocols").checked = prefs.allProtocols;
	document.getElementById("allSubdomains").checked = prefs.allSubdomains;
	document.getElementById("allPorts").checked = prefs.allPorts;
	
	document.getElementById("contextMenu").onclick = function() { save(); };
	document.getElementById("autoRefresh").onclick = function() { save(); };
	document.getElementById("allProtocols").onclick = function() { save(); };
	document.getElementById("allSubdomains").onclick = function() { save(); };
	document.getElementById("allPorts").onclick = function() { save(); };
	    
    document.getElementById("lightIcon").checked = prefs.lightIcon;
    document.getElementById("defaultIcon").checked = prefs.defaultIcon;
    document.getElementById("darkIcon").checked = prefs.darkIcon;
    //default icon by default ;-)
    if (!prefs.defaultIcon &&!prefs.lightIcon &&!prefs.darkIcon )document.getElementById("defaultIcon").checked = true;
    
    document.getElementById("lightIcon").onclick = function() { save(); };
    document.getElementById("defaultIcon").onclick = function() { save(); };
    document.getElementById("darkIcon").onclick = function() { save(); };
	
	document.getElementById("openImageSettings").onclick = chrome.extension.getBackgroundPage().openImgPanel();

	document.getElementById("clearImageSettings").onclick = function() {
		chrome.extension.getBackgroundPage().clearRules("contentSettings");
		chrome.extension.getBackgroundPage().openImgPanel().call();
	};

	document.getElementById("importRules").onclick = function() {
		if (document.getElementById("imgTF_rules").value !== "") {
			chrome.extension.getBackgroundPage().importRules(JSON.parse(document.getElementById("imgTF_rules").value));
			chrome.extension.getBackgroundPage().openImgPanel().call();
		}
	};

	document.getElementById("clearLocalStorageRules").onclick = function() {
		chrome.extension.getBackgroundPage().clearRules("localStorage");
		showRules();
	};

}

