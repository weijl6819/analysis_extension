var pejs = typeof pejs === "undefined" ? {} : pejs;
pejs["notifications"] = (function() {
	var template = function () {
		var $t = {};
		var buffer;
		var blocks = {};
		var result = '';

		$t.w = function(data) {
			if (typeof data === 'object' && data) {
				(buffer = buffer || []).push(result, data);
				result = '';
				return;
			}
			result += data;
		};
		$t.e = function(data) {
			return $t.w((''+data).replace(/&(?!\w+;)/g,'&amp;').replace(/>/g,'&gt;').replace(/</g, '&lt;').replace(/"/g,'&quot;'));
		};
		$t.o = function(name, locals, block) {
			var $b = blocks[name];

			if (!$b) return;
			$b.locals = locals;
			$b.block = block;
		};
		$t.d = function(name, live, locals, block) {
			if (!name) return block($t, locals);

			var $b = blocks[name] = template();
			var toString = $b.toString;

			$b.toString = function() {
				if ($b.block) {
					$b.block($b, $b.locals);				
				}
				return ($b.toString = toString)();
			};

			$t.w($b);
			$t.o(name, locals, block);
		};
		$t.toString = function() {
			if (buffer) {
				result = buffer.join('')+result;
				buffer = null;
			}
			return result;
		};

		return $t;
	};
	var reduce = function($t,locals){
		with (locals) {
			$t.w("<div class='info'>\n\t<div class='name'>");
			$t.e(user.fullname || user.email);
			$t.w("</div>\n\t<div class='controls'>\n\t\t<a class='uploads' href='#uploads'>Uploads</a> | \n\t\t<a href='http://ge.tt'>Open Ge.tt</a> |\n\t\t<a class='logout' href='#'>Logout</a>\n\t</div>\n\n\t<div class='clear'></div>\n</div>\n\n<div class='notifications'>\n\t");
			for(var i = 0; i < notifications.length; i++) { 
			var notification = notifications[i];
			$t.w("\n\t\t<a class='notification-wrapper ");
			$t.e(notification.type);
			$t.w(" ");
			$t.e(notification.unread ? 'unread' : 'read');
			$t.w("' \n\t\t\t\thref='http://ge.tt");
			$t.w(notification.url);
			$t.w("'>\n\t\t\t<div class='notification ");
			$t.e(notification.type);
			$t.w(" ");
			$t.e(notification.unread ? 'unread' : 'read');
			$t.w("'>\n\t\t\t\t<div class='icon' style='background-image:url(");
			$t.w(pejs.helpers.notificationIcon(notification));
			$t.w(");'></div>\n\t\t\t\t<div class='message'>\n\t\t\t\t\t");
			$t.w(pejs.helpers.formatMessage(notification.message));
			$t.w("\n\t\t\t\t</div>\n\n\t\t\t\t<div class='clear'></div>\n\t\t\t</div>\n\n\t\t\t<div class='date'>");
			$t.e(pejs.helpers.formatDate(notification.updated));
			$t.w("</div>\n\t\t</a>\n\t");
			}
			$t.w("\n\n\t<a class='notification-wrapper all-notifications' href='http://ge.tt/notifications'>See all notifications</a>\n</div>\n");
		}
	};
	return function (locals) {
		var $t = template();
		reduce($t,locals || {});
		return $t.toString();
	};
}());
pejs["uploads"] = (function() {
	var template = function () {
		var $t = {};
		var buffer;
		var blocks = {};
		var result = '';

		$t.w = function(data) {
			if (typeof data === 'object' && data) {
				(buffer = buffer || []).push(result, data);
				result = '';
				return;
			}
			result += data;
		};
		$t.e = function(data) {
			return $t.w((''+data).replace(/&(?!\w+;)/g,'&amp;').replace(/>/g,'&gt;').replace(/</g, '&lt;').replace(/"/g,'&quot;'));
		};
		$t.o = function(name, locals, block) {
			var $b = blocks[name];

			if (!$b) return;
			$b.locals = locals;
			$b.block = block;
		};
		$t.d = function(name, live, locals, block) {
			if (!name) return block($t, locals);

			var $b = blocks[name] = template();
			var toString = $b.toString;

			$b.toString = function() {
				if ($b.block) {
					$b.block($b, $b.locals);				
				}
				return ($b.toString = toString)();
			};

			$t.w($b);
			$t.o(name, locals, block);
		};
		$t.toString = function() {
			if (buffer) {
				result = buffer.join('')+result;
				buffer = null;
			}
			return result;
		};

		return $t;
	};
	var reduce = function($t,locals){
		with (locals) {
			$t.w("<div class='uploads'>\n\t<div class='info'>\n\t\t<div class='name'>Uploads</div>\n\t\t<div class='controls'>\n\t\t\t<a class='uploads' href='#notifications'>Notifications</a> |\n\t\t\t<a class='clear' href='#' title='Clear finished uploads'>Clear</a>\n\t\t</div>\n\n\t\t<div class='clear'></div>\n\t</div>\n\n\t");
			if(!uploads.length) {
			$t.w("\n\t\t<div class='upload empty'>\n\t\t\tNothing uploaded\n\t\t</div>\n\t");
			}
			$t.w("\n\n\t");
			uploads.forEach(function(upload) {
			$t.w("\n\t\t<div class='upload state-");
			$t.w(upload.state);
			$t.w("' id='upload-");
			$t.e(upload.id);
			$t.w("'>\n\t\t\t<div class='top'>\n\t\t\t\t<div class='filename text-overflow'>\n\t\t\t\t\t<a href='");
			$t.w(upload.gettUrl);
			$t.w("' title='");
			$t.e(upload.filename || 'unknown');
			$t.w("'>\n\t\t\t\t\t\t");
			$t.e(upload.filename || 'unknown');
			$t.w("\n\t\t\t\t\t</a>\n\t\t\t\t</div>\n\t\t\t\t<div class='copy-link'>\n\t\t\t\t\t(<a href='");
			$t.w(upload.gettUrl);
			$t.w("'>Copy link</a>)\n\t\t\t\t</div>\n\t\t\t\t<div class='date'>");
			$t.e(pejs.helpers.formatDate(upload.created));
			$t.w("</div>\n\n\t\t\t\t<div class='clear'></div>\n\t\t\t</div>\n\t\t\t<div class='middle'>\n\t\t\t\t<div class='progress-bar' title='0%'>\n\t\t\t\t\t<div class='bar'>\n\t\t\t\t\t\t<div class='slider'></div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class='bottom'>\n\t\t\t\t<div class='progress'>\n\t\t\t\t\t<span class='remaining'>\n\t\t\t\t\t\t");
			$t.e(pejs.helpers.formatTime(upload.estimatedTimeLeft));
			$t.w("\n\t\t\t\t\t</span>\n\t\t\t\t\t<span> remaining</span>\n\t\t\t\t\t<span class='divider'> - </span>\n\t\t\t\t\t<span class='percent'>");
			$t.e(upload.progress);
			$t.w("%</span>\n\t\t\t\t\t<span> of </span>\n\t\t\t\t\t<span class='size'>");
			$t.e(pejs.helpers.formatSize(upload.size));
			$t.w("</span> \n\t\t\t\t\t(<span class='speed'>");
			$t.e(pejs.helpers.formatSpeed(upload.speed));
			$t.w("</span>)\n\t\t\t\t</div>\n\n\t\t\t\t<div class='idle'>\n\t\t\t\t\t<span class='size'>");
			$t.e(pejs.helpers.formatSize(upload.size));
			$t.w("</span>\n\t\t\t\t\t<span title='");
			$t.e(upload.lastError && upload.lastError.message);
			$t.w("' class='state'>");
			$t.e(upload.state);
			$t.w("</span>\n\t\t\t\t\t<span class='divider'> - </span>\n\t\t\t\t\t<span class='url text-overflow' title='");
			$t.e(upload.prettyUrl);
			$t.w("'>");
			$t.e(upload.prettyUrl);
			$t.w("</span>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t");
			})
			$t.w("\n</div>\n");
		}
	};
	return function (locals) {
		var $t = template();
		reduce($t,locals || {});
		return $t.toString();
	};
}());
pejs["dialog"] = (function() {
	var template = function () {
		var $t = {};
		var buffer;
		var blocks = {};
		var result = '';

		$t.w = function(data) {
			if (typeof data === 'object' && data) {
				(buffer = buffer || []).push(result, data);
				result = '';
				return;
			}
			result += data;
		};
		$t.e = function(data) {
			return $t.w((''+data).replace(/&(?!\w+;)/g,'&amp;').replace(/>/g,'&gt;').replace(/</g, '&lt;').replace(/"/g,'&quot;'));
		};
		$t.o = function(name, locals, block) {
			var $b = blocks[name];

			if (!$b) return;
			$b.locals = locals;
			$b.block = block;
		};
		$t.d = function(name, live, locals, block) {
			if (!name) return block($t, locals);

			var $b = blocks[name] = template();
			var toString = $b.toString;

			$b.toString = function() {
				if ($b.block) {
					$b.block($b, $b.locals);				
				}
				return ($b.toString = toString)();
			};

			$t.w($b);
			$t.o(name, locals, block);
		};
		$t.toString = function() {
			if (buffer) {
				result = buffer.join('')+result;
				buffer = null;
			}
			return result;
		};

		return $t;
	};
	var reduce = function($t,locals){
		with (locals) {
			$t.w("<div class='overlay'>\n\t<div class='dialog'>\n\t\t<div class='dialog-content'>\n\t\t\t<div class='dialog-data'>\n\t\t\t\t<div class='text'>");
			$t.e(message);
			$t.w("</div>\n\n\t\t\t\t<div class='inputs'>\n\t\t\t\t\t");
			if(locals.cancel) {
			$t.w("\n\t\t\t\t\t\t<input class='button weak' type='button' name='no' value='Cancel'>\n\t\t\t\t\t");
			}
			$t.w("\n\n\t\t\t\t\t<input class='button' type='button' name='yes' value='OK'>\n\t\t\t\t</div>\n\n\t\t\t\t<div class='clear'></div>\n\t\t\t</div>\n\t\t\t\n\t\t\t<div class='clear'></div>\n\t\t</div>\n\t</div>\n</div>\n");
		}
	};
	return function (locals) {
		var $t = template();
		reduce($t,locals || {});
		return $t.toString();
	};
}());
