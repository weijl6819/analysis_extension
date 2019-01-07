(function() {
	chrome.extension.onMessage.addListener(function(message, sender, respond) {
		debug.debug('Internal message received', message);

		switch(message.type) {
		case 'syncinit': 
			synchronization.refreshtoken = message.refreshtoken;
			respond({ type: 'syncinit', status: 'ok' });

			break;
		case 'syncget':
			synchronization.get(function(err, token) {
				debug.debug('Sending response containing synchronization result', err, token);

				respond({ type: 'syncget', refreshtoken: token });
			});

			return true;
		}
	});

	synchronization.initialize();
}());
