/*
 * Object setup
 */
var CCE = CCE || {};
CCE.ForceInject = {
	forceInject: function() {
		// is the toolbar already present?
		if (document.getElementById("citelighter-toolbar-iframe")) {
			return;
		}

		var request = {
			action: "forceInject"
		};

		chrome.extension.sendMessage(request, function(response) {
            if (!response && "undefined" != typeof chrome.extension.lastError) {
                console.log("No response. Error: " + chrome.extension.lastError.message);
            }
        });
	}
};

/*
 * Page setup
 */
CCE.ForceInject.forceInject();