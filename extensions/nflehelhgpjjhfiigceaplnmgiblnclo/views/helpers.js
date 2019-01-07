var pejs = (function() {
	var WEB = 'http://ge.tt/s/images';
	
	var UNITS = ['B', 'KB', 'MB', 'GB', 'TB'];

	var MINUTE = 60;
	var HOUR = MINUTE * 60;
	var DAY = 24 * HOUR;
	var WEEK = 7 * DAY;
	var MONTH = 30 * DAY;
	var YEAR = 365 * DAY;
	var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

	var helpers = {
		escape: function(str) {
			return str.replace(/&(?!\w+;)/g,'&amp;').replace(/>/g,'&gt;').replace(/</g, '&lt;').replace(/"/g,'&quot;');
		},
		formatMessage: function(message) {
			return helpers.escape(message).replace(/&lt;(\/?)b&gt;/g,'<$1b>');
		},
		formatDate: function(utc, now) {
			now = now || new Date();
			var date = new Date(utc * 1000);
			var elapsed = Math.floor((now - date) / 1000);

			var ago = function(unit, interval) {
				var value = Math.floor(elapsed / interval);

				return value + ' ' + unit + (value === 1 ? '' : 's') + ' ago';
			};

			if(elapsed < MINUTE) {
				return 'a few seconds ago'
			}
			else if(elapsed < HOUR) {
				return ago('minute', MINUTE);
			}
			else if(elapsed < DAY) {
				return ago('hour', HOUR);
			}
			else if(elapsed < WEEK) {
				return 'on ' + DAYS[date.getDay()];
			}
			else if(elapsed < MONTH) {
				return ago('day', DAY);
			}
			else if(elapsed < YEAR) {
				return 'more than a month ago';
			}
			else {
				return 'more than a year ago';
			}
		},
		formatSize: function(num, dec) {
			var unit = UNITS[0];

			for (var i = 0; ((i < UNITS.length-1) && num >= 1000); i++) {
				num /= 1000;
				unit = UNITS[i+1];
			}

			if (dec && num < 10) {
				num = Math.floor(10*num)/10;
			} else {
				num = Math.floor(num);
			}
			return num+' '+unit;
		},
		formatSpeed: function(speed) {
			// speed in bytes per second

			var unit = UNITS[0];

			for(var i = 0; (i < 2) && (speed >= 1000); i++) {
				speed /= 1000;
				unit = UNITS[i + 1];
			}

			if(speed < 10) {
				speed = Math.round(10 * speed) / 10;
			} else {
				speed = Math.round(speed);
			}

			return speed + ' ' + unit + '/sec';
		},
		formatTime: function(time) {
			// time in whole seconds

			if(time <= 60) {
				return time + ' second' + (time === 1 ? '' : 's');
			} else if(time <= 3600) {
				return Math.round(time / 60) + ' minutes';
			} else {
				var hours = Math.floor(time / 3600);
				var minutes = (time - (3600 * hours)) / 60;

				return hours + 'h ' + Math.round(minutes) + 'm';
			}
		},
		notificationIcon: function(notification) {
			var name = notification.type;

			if(notification.type === 'mail') {
				name = notification.unread ? 'unread' : 'read';
			}

			return WEB + '/notification-' + name + '_16.png';
		}
	};

	return {
		helpers: helpers
	};
})();
