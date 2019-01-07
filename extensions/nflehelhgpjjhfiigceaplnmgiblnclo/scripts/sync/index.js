(function() {
	var error = function(callback) {
		callback = callback || function() {};

		return function(response) {
			if(!response) {
				callback(new Error(chrome.extension.lastError));
				return;
			}

			callback(null, response);
		};
	};

	window.synchronization = {
		initialize: function(refreshtoken, callback) {
			chrome.extension.sendMessage({ type: 'syncinit', refreshtoken: refreshtoken }, error(callback));
		},
		get: function(callback) {
			chrome.extension.sendMessage({ type: 'syncget' }, error(function(err, response) {
				callback(err, response && response.refreshtoken);
			}));
		}
	};
}());
