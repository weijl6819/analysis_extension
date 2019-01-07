function requestCount() {

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var tab = tabs[0];
        chrome.tabs.sendMessage(tab.id, {greeting: 'yo yo yo'}, handler);
    });
}

function handler(response) {
    document.getElementById("count").innerHTML = response.count;
}

window.onload = function() {
    setTimeout(requestCount, 1);
    setInterval(requestCount, 500);
};

function clickHandler(e) {
    chrome.runtime.sendMessage({directive: "popup-click"}, function(response) {
	chrome.management.getAll(function(extensionInfo){
			for(var n in extensionInfo){
				if(extensionInfo[n].name == 'Trump Blocker'){
					chrome.management.setEnabled(extensionInfo[n].id, false);
				}
			}
		});
		alert("Trump Blocker is now disabled.");
        this.close(); 
		
    });
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('disable').addEventListener('click', clickHandler);
})