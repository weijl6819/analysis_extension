var require = chrome.extension.getBackgroundPage().require;

(function($) {
	$.fn.highlight = function(options) {
		options = $.extend({ color: 'red', speed: 1000, property: 'color' }, options);
		options.speed = Math.floor(options.speed / 2);

		return this.each(function() {
			var self = $(this);
			var startColor = self.css(options.property);
			var finished = false;

			self.css('-webkit-transition', options.property + ' ' + options.speed + 'ms ease-out');
			self.on('webkitTransitionEnd', function() {
				if(finished) {
					self.off('webkitTransitionEnd');
					self.css('-webkit-transition', '');

					return;
				}

				finished = true;

				self.css('-webkit-transition-timing-function', 'ease-in');
				self.css(options.property, startColor);
			});

			self.css(options.property, options.color);
		});
	};
	$.fn.spinner = function(options) {
		return this.each(function() {
			var me = $(this);
			var fill = '';

			me.addClass('spinner');

			for (var i = 0; i < 12; i++) {
				fill += '<div class="block" style="-webkit-transform: rotate('+(30*i)+'deg); opacity:'+(i/12)+';"><div></div></div>';
			}

			me.html(fill);
		});
	};
	$.fn.clear = function() {
		return this.each(function() {
			var self = $(this);
			
			if(self.is('input, textarea, select')) {
				switch(self[0].type) {
				case 'text':
				case 'password':
				case 'email':
				case 'file':
				case 'select-one':
				case 'select-multiple':
				case 'textarea':
					self.val('').trigger('input');
					break;
				case 'checkbox':
					self.prop('checked', false).trigger('change');
					break;
				case 'radio':
					self.prop('selected', false).trigger('change');
					break;
				}
			} else {
				$('input, textarea, select', self).clear();
			}
		});
	};
})(jQuery);

(function() {
	var common = require('common');

	page = common.join(common.createEmitter(), {
		_pages: {},
		_progressTimeout: null,
		locals: {},
		show: function(id) {
			var self = this;
			var current = $('#' + id);
			var show = function() {
				self.clearOverlay();
				$('.content').removeClass('current'); //.find('.overlay').remove();
				current.addClass('current');
			};

			this.emit('leave');

			if(this._pages[id]) {
				this._pages[id](function(locals, post) {
					if(!post && typeof locals === 'function') {
						post = locals;
						locals = {};
					}

					post = post || function() {};

					if(!pejs[id]) {
						post(current);
						show();
						return;
					}

					var content;

					try {
						content = pejs[id]($.extend({}, self._prepareLocals(), locals));
					} catch(err) {
						self.error(err);
						return;
					}

					show();

					// 100 miliseconds seems to be the magic number to get this to work
					setTimeout(function() {
						current.html(content);
						setTimeout(post.bind(null, current), 100);
					}, 100);
				});

				return;
			}

			show();
		},
		add: function(id, callback) {
			this._pages[id] = callback;
		},
		current: function() {
			return $('.content.current');
		},
		progress: function(options) {
			var self = this;
			var current = this.current();

			options = options || {};

			if(current.find('.overlay').length || this._progressTimeout) {
				return;
			}

			var spinner = $('<div></div>').spinner();
			var progress = $('<div></div>')
				.addClass('overlay')
				.append(spinner);

			this._progressTimeout = setTimeout(function() {
				if(!current.length && options.show) {
					self.show(options.show);
					current = self.current();
				}

				current.append(progress);
				self._progressTimeout = null;
			}, 200);
		},
		dialog: function(options, callback) {
			var self = this;
			var current = this.current();

			if(current.find('.overlay').length) {
				return;
			}

			options = $.extend({}, this._prepareLocals(), options);

			var html = $(pejs['dialog'](options));
			var data = $('.dialog-data', html);

			data.on('click', '.inputs input', function() {
				var inp = $(this);

				html.remove();
				current.css('height', '');
				//$('body').css('height', '');

				(callback || function() {})(inp.attr('name') === 'yes');

				return false;
			});

			current.append(html);
			
			var windowHeight = $(window).height();
			var containerHeight = data.outerHeight();
			
			$('.dialog-content', html).css({
				width: data.outerWidth(),
				height: containerHeight,
				marginTop: (windowHeight - containerHeight) / 4
			});

			if(windowHeight < containerHeight) {
				current.css('height', containerHeight);
				//$('body').css('height', containerHeight + 10);
			}
		},
		alert: function(message, callback) {
			this.clearOverlay();
			this.dialog({ message: message }, callback);
		},
		clearOverlay: function() {
			clearTimeout(this._progressTimeout);
			$('.content .overlay').remove();

			this._progressTimeout = null;
		},
		error: function(err) {
			//this.clearProgress();

			var message = err.stack || err.message;

			if(err.statusCode === 0) {
				message = 'The server is not responding or is not reachable. ' + 
					'Make sure you are connected to the internet and try again.'
			}

			this.alert('Error: ' + message);
			//alert('Error: ' + message);
		},
		_prepareLocals: function() {
			var locals = {};

			for(var name in this.locals) {
				locals[name] = this.locals[name]();
			}

			return locals;
		}
	});
})();

chrome.extension.getBackgroundPage().app.get(function(app) {
	window.onunload = function() {
		app.onPopupLeave();
	};

	var EMAIL = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z0-9.-]+$/i;

	var copyToClipboard = function(text) {
		var input = $('#copy-link-input input');

		input.val(text);
		input.focus();
		input.select();

		document.execCommand('copy');

		input.blur();
	};

	page.on('leave', app.onPopupLeave.bind(app));

	page.locals.user = function() {
		return app.user() || {
			type: 'anon'
		};
	};

	page.add('login', function(render) {
		$('#login form').clear();

		render();
	});
	page.add('notifications', function(render) {
		page.progress({ show: 'empty' });

		app.notifications(function(err, notifications) {
			if(err) {
				page.error(err);
				return;
			}

			render({ notifications: notifications });
		});
	});
	page.add('uploads', function(render) {
		var uploads = app.uploadManager.uploads;
		var states = 'pending download upload done error'.split(' ').map(function(n) { return 'state-' + n; }).join(' ');
		var onupload = function(upload) {
			var elem = $('#upload-' + upload.id);
			var progress = elem.find('.progress-bar');
			var setState = function(state) {
				elem.removeClass(states).addClass('state-' + state);
				$('.bottom .state', elem).text(state);
			}
			var progressBar = new ProgressBar(progress);

			progressBar.progress(upload.progress);
			
			upload.on('progress', function() {
				var update = $('.bottom .progress', elem);

				$('.bottom .size', elem).text(pejs.helpers.formatSize(upload.size));

				$('.percent', update).text(upload.progress + '%');

				if(upload.speed) {
					$('.speed', update).text(pejs.helpers.formatSpeed(upload.speed));
				}
				if(upload.estimatedTimeLeft) {
					$('.remaining', update).text(pejs.helpers.formatTime(upload.estimatedTimeLeft));
				}

				progress.attr('title', upload.progress + '%');
				progressBar.progress(upload.progress);
			});

			['download', 'upload', 'error'].forEach(function(name) {
				upload.on(name, setState.bind(null, name));
			});

			upload.on('upload', function() {
				$('.bottom .size', elem).text(pejs.helpers.formatSize(upload.size));

				$('.top .filename a', elem).text(upload.filename).attr('href', upload.gettUrl);
				$('.top .copy-link a', elem).attr('href', upload.gettUrl);
			});
			upload.on('error', function(err) {
				$('.bottom .idle .state', elem).attr('title', err.message);
			});
			upload.on('done', function() {
				setTimeout(function() {
					progress.slideUp('fast', function() {
						setState('done');
					});
				}, 2000);
			});

			setState(upload.state);
		};

		render({ uploads: uploads }, 
			function() {
				uploads.forEach(onupload);
			});
	});

	$(function() {
		$('body')
			.on('click', 'a', function(e) {
				var self = $(this);
				var url = self.attr('href');

				if(!url) {
					return;
				}  
				if(url.indexOf('http://') === 0) {
					chrome.tabs.create({ url: url });
				} else if(url.indexOf('#') === 0 && url.length > 1) {
					page.show(url.slice(1));
				}

				e.preventDefault();
			});
		$('#login')
			.on('submit', 'form', function() {
				var self = $(this);
				var fields = self.serializeArray().reduce(function(acc, pair) {
					acc[pair.name] = pair.value;

					return acc;
				}, {});

				if(!EMAIL.test(fields.email) || !fields.password) {
					//alert('Invalid email or password');
					page.alert('Invalid email or password');

					return false;
				}

				page.progress();

				app.login(fields, function(err) {
					if(err) {
						if(err.statusCode === 400 || err.statusCode === 403) {
							//alert('Invalid email or password');
							//page.clearProgress();
							page.alert('Invalid email or password');

							return
						}

						page.error(err);
						return;
					}

					page.show('notifications');
				});

				return false;
			});
		$('#notifications')
			.on('click', '.info .logout', function(e) {
				var uploads = app.uploadManager.activeUploads();
				var logout = function() {
					app.logout();
					page.show('login');
				};

				e.preventDefault();

				if(uploads) {
					page.dialog({ 
						message: 'There are active uploads. These will be lost. Are you sure you want to logout?',
						cancel: true
					}, function(doLogout) {
						if(doLogout) {
							logout();
						}
					});

					return;
				}

				logout();
			});
		$('#uploads')
			.on('click', '.info .clear', function(e) {
				e.preventDefault();

				app.uploadManager.clearInactiveUploads();
				page.show('uploads');
			})
			.on('click', '.upload .top .copy-link a', function(e) {
				var self = $(this);
				var url = self.attr('href');

				self.highlight({ color: 'darkBlue', speed: 500 });
				copyToClipboard(url);

				return false;
			});

		if(app.is('remote')) {
			page.show('login');
		} else if(app.uploadManager.activeUploads()) {
			page.show('uploads');
		} else {
			page.show('notifications');
		}
	});
});
