var common = require('common');

var PREFIX = 'blob-'+common.encode(new Date().getTime())+'-';

var noop = function() {};
var onevent = window.addEventListener ? 
	function(elem, name, fn) {
		elem.addEventListener(name, fn, false);

		return function() {
			elem.removeEventListener(name, fn, false);
		};	
	} :
	function(elem, name, fn) {
		elem.attachEvent('on'+name, fn);

		return function() {
			elem.detachEvent('on'+name, fn);
		};
	};

var isBlob = function(obj) {
	var type = Object.prototype.toString.call(obj);

	return type === '[object File]' || type === '[object Blob]';
};
var now = function() {
	return new Date().getTime();	
};
var addQuery = function(url, name, val) {
	return url + (url.indexOf('?') > -1 ? '&' : '?') + name+'='+encodeURIComponent(val);
};

var main = function() {
	var div = document.createElement('div');
	
	div.style.position = 'absolute';
	div.style.left = '-1000px';
	div.style.top = '-1000px';
	div.style.width = '100px';
	div.style.height = '100px';
	div.style.overflowX = 'hidden';
	div.style.overflowY = 'hidden';

	document.body.appendChild(div);

	main = function() {
		return div;
	};

	return div;
};
var onchannelmessage = function(channel, onmessage) { // TODO: add this to the curly proxy also
	channel += '::';

	return function(e) {
		if (e.data.substring(0, channel.length) !== channel) {
			return;
		}
		onmessage(e.data.substring(channel.length));
	};
};

var createProgressFrame = function(url) {
	var that = common.createEmitter();
	var div = document.createElement('div');
	var progressId = that.id = PREFIX+common.uuid();
	var progressURL = url.match(/(\w+:\/\/[^\/]+)?/)[1]+'/progress/'+progressId;

	div.innerHTML = '<iframe name="'+progressId+'" id="'+progressId+'" width="2000" src="'+progressURL+'"></iframe>';

	main().appendChild(div);
	that.uploadURL = addQuery(url, 'progressId', progressId);

	var progressFrame = document.getElementById(progressId);
	var ended = false;

	var onend = function(message) {
		if (ended) {
			return;
		}
		ended = true;

		unbind();
		main().removeChild(div);
		that.emit(message);
	};
	var onprogressmessage = function(fn) {
		var cancel = onevent(window, 'message', onchannelmessage(progressId, function(message) {
			fn(parseInt(message, 10));			
		}));

		progressFrame.onresize = function() {
			fn(Math.round(progressFrame.offsetWidth/10));
		};

		return function() {
			progressFrame.onresize = noop;
			cancel();
		};
	};
	var unbind = onprogressmessage(function(message) {
		if (ended) {
			return;
		}
		if (message === 110) {
			that.handshake = true;
			that.emit('handshake');
			return;
		}
		if (!that.handshake) {
			return;
		}
		if (message <= 100) {
			that.progress = message;
			that.emit('progress');
			return;
		}

		onend(message == 120 ? 'upload' : 'error');
	});

	that.destroy = function() {
		onend('error');
	};

	return that;
};

var putInput = function(url, input) {
	var that = common.createEmitter();
	var div = document.createElement('div');

	var targetUpload = PREFIX+common.uuid();
	var progressFrame = createProgressFrame(url);

	div.innerHTML = ''+
		'<iframe name="'+targetUpload+'" id="'+targetUpload+'"></iframe>'+
		'<form method="post" action="'+progressFrame.uploadURL+'" enctype="multipart/form-data" target="'+targetUpload+'"></form>';	

	main().appendChild(div);

	var targetFrame = document.getElementById(targetUpload);
	var form = div.getElementsByTagName('form')[0];
	var ended = false;
	var handshaking;
	
	var onnotend = function(fn) {
		return function() {
			if (ended) {
				return;
			}
			fn();
		};
	};
	var tidy = function() {
		main().removeChild(div);		
	};
	var onend = function(timeout) {
		ended = true;

		if (!timeout) {
			tidy();
			return;
		}

		setTimeout(tidy, timeout);
	};
	var submit = common.once(function() {
		form.submit();

		common.step([
			function(next) {
				onevent(targetFrame, 'load', onnotend(next));	
			},
			function(next) {
				setTimeout(onnotend(next), 10000);
			},
			function() {
				onend();
				progressFrame.destroy();

				that.emit(progressFrame.handshake ? 'error' : 'upload');
			}
		]);
	});

	progressFrame.on('handshake', function() {
		clearTimeout(handshaking);		
		submit();
	});
	progressFrame.on('error', onnotend(function() {
		clearTimeout(handshaking);

		targetFrame.src = 'about:blank';

		onend(2500);
		that.emit('error');
	}));
	progressFrame.on('upload', onnotend(function() {
		onend(2500);
		that.emit('upload');
	}));
	progressFrame.on('progress', onnotend(function() {
		that.emit('progress', progressFrame.progress);
	}));

	that.destroy = function() {
		progressFrame.destroy();
	};

	if (input.parentNode) {
		input.parentNode.removeChild(input);
	}

	input.id = input.name = (input.name || input.id || targetUpload+'-file');
	form.appendChild(input);

	handshaking = setTimeout(submit, 2000);

	return that;
};;

var putFile = function(url, file) {
	var that = common.createEmitter();
	var form = new FormData();
	var xhr = new XMLHttpRequest();

	var destroy = function(success) {
		xhr.abort();
	};

	if (!xhr.upload) {
		var progressFrame = createProgressFrame(url);

		progressFrame.on('error', function() {
			that.emit('error');
		});
		progressFrame.on('upload', function() {
			that.emit('upload');
		});
		progressFrame.on('progress', function() {
			that.emit('progress', progressFrame.progress);
		});

		that.destroy = function() {
			destroy();
			progressFrame.destroy();	
		};

		url = progressFrame.uploadURL;
	} else {
		var lastProgress = -1;
		var lastTime = 0;

		var onuploadevent = function(name, fn) {
			xhr.upload.addEventListener(name, fn, false);		
		};

		onuploadevent('progress', function(e) {
			var progress = Math.floor(100 * e.loaded / e.total);

			if (progress === lastProgress || now() - lastTime < 500) {
				return;
			}

			lastTime = now();
			lastProgress = progress;
			that.emit('progress', progress);			
		});
		onuploadevent('load', function() {
			that.emit('upload');
		});
		onuploadevent('error', function() {
			that.emit('error');
		});
		onuploadevent('abort', function() {
			that.emit('error');
		});

		that.destroy = destroy;
	}

	that.on('upload', function() {
		that.destroy = noop;
	});
	that.on('error', function() {
		that.destroy = noop;
	});

	form.append('blob', file);

	xhr.open('POST', url, true);
	xhr.send(form);

	return that;
};

exports.put = function(url, file, callback) {
	var that = common.createEmitter();
	var upload = (isBlob(file) ? putFile : putInput)(addQuery(url, 'nounce', common.uuid()), file);

	callback = callback || noop;

	var lastProgress = -1;

	that.progress = 0;
	that.readyState = 'uploading';
	that.destroy = function() {
		upload.destroy();
	};

	upload.on('progress', function(progress) {
		if (lastProgress > progress) {
			upload.destroy();
			return;
		}
		that.progress = progress;
		that.emit('progress', progress);
	});
	upload.on('upload', function() {
		if (that.progress < 100) {
			that.progress = 100;
			that.emit('progress', that.progress);
		}

		that.readyState = 'uploaded';
		that.emit('upload');

		callback();
	});
	upload.on('error', function() {
		var err = new Error('premature close');

		that.readyState = 'failed';
		that.emit('error', err);

		callback(err);
	});

	return that;
};