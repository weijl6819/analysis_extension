(function() {
	var noop = function() {};
	var once = function(fn) {
		var called = false;

		return function() {
			if(called) {
				return;
			}

			called = true;

			fn.apply(null, arguments);
		};
	};

	var ProgressBar = function(elem, options) {
		var self = this;

		options = options || {};
		this._animating = false;
		this._next = noop;
		this._elem = elem;
		this._sofar = 0;
		this._fade = options.fade;
		this._endColor = options.endColor;
		this._init = once(function() {
			self._slider = $('.slider', $(elem)).css({height:'100%', width:'0'});
		});
	};

	ProgressBar.prototype.progress = function(progress, callback) {
		var self = this;

		this._init();
		callback = callback || noop;

		clearTimeout(this._timeout);

		$(this._elem).fadeIn(1000, 'linear', function() {
			if (progress <= self._sofar) {
				self._animating = false;
				self._sofar = progress;
				self._next = noop;
				self._slider.stop();
				self._slider.css({width:progress+'%'});
				callback();
				return;
			}
			if (self._animating) {
				self._next = once(function() {
					self.progress(progress, callback);
				});
				return;
			}

			self._animating = true;
			self._slider.animate({width:progress+'%'}, 500, function() {
				self._sofar = progress;
				self._animating = false;
				self._next();
				callback();
			});
		});
	};
	ProgressBar.prototype.end = function() {
		var self = this;
		var onfade = function() {
			if (self._fade === false) {
				return;
			}

			$(self._elem).fadeOut(function() {
				self._sofar = 0;
				self._slider.css('width', '0');
				$(self._elem).hide();
			});
		};

		this.progress(100, function() {
			if (self._endColor) {
				self._slider.css('background-color', self._endColor);
			}
			self._timeout = setTimeout(onfade, 3000);					
		});
	};

	/*exports.create = function(elem, options) {
		return new ProgressBar(elem, options);
	};*/

	window.ProgressBar = ProgressBar;
})();
