var mania = require('crossmania');
var common = require('common');
var blobs = require('./blobs');

var noop = function() {};

var blobify = function(blob) {
	// wrapped blob
	if (Object.prototype.toString.call(blob.blob) === '[object Blob]' && blob.filename) return {filename:blob.filename, source:blob.blob};
	// html5 file object
	if (Object.prototype.toString.call(blob) === '[object File]') return {filename:blob.name, source:blob};
	// jQuery input
	if (typeof blob.get === 'function' && blob.get(0)) return blobify(blob.get(0));
	// DOM input
	return {filename:blob.value.match(/(?:^|[\/\\])([^\/\\]+)$/)[1], source:blob};
};
var forEach = function(obj, fn) {
	if (obj.forEach) return obj.forEach(fn);
	if (obj.length) {
		for (var i = 0; i < obj.length; i++) {
			fn(obj[i], i);
		}
		return;
	}
	for (var i in obj) {
		if (obj.hasOwnProperty(i)) {
			fn(obj[i], i);	
		}
	}
};
var map = function(obj, fn) {
	var list = [];

	forEach(obj, function(item) {
		list.push(fn(item));
	});

	return list;
};
var find = function(obj, fn) {
	var found;

	forEach(obj, function(item, i) {
		if (!found && fn(item, i)) {
			found = item;
		}
	});

	return found;
};
var query = function(url, name, value) {
	return url+(url.indexOf('?') > -1 ? '&' : '?')+name+'='+encodeURIComponent(value);
};
var mixin = function(request, api) {
	var that = common.createEmitter();
	var pools = {};

	forEach(api.user || {}, function(value, name) {
		that[name] = value;
	});

	that.session = that.session || Math.random().toString(16).substr(2)+Math.random().toString(16).substr(2);
	that.accesstoken = that.accesstoken || api.accesstoken;
	that.refreshtoken = that.refreshtoken || api.refreshtoken;
	
	var accesstoken = function(callback) {
		var expires = parseInt(that.accesstoken.split('.')[3], 10) * 1000;

		if (!that.refreshtoken) return callback();
		if (expires && (expires - (new Date().getTime()) < 60*60*1000)) {
			request.post('/1/users/login').json({refreshtoken: that.refreshtoken}, common.fork(callback, function(response) {
				that.accesstoken = response.accesstoken;
				callback();
			}));
			return;
		}
		callback();
	};
	var toURL = function(options) {
		var url = options.url;

		forEach(options.query || options.qs || {}, function(val, key) {
			url = query(url, key, val);
		});

		return query(url, 'accesstoken', that.accesstoken);
	};
	that.post = function(options, body, callback) {
		if (typeof options === 'string') {
			options = {url:options};
		}
		if (typeof body === 'function') {
			callback = body;
			body = null;
		}
		accesstoken(function() {
			request.post(toURL(options)).json(options.body || body || {}, callback || noop);		
		});
	};
	that.get = function(options, callback) {
		if (typeof options === 'string') {
			options = {url: options};
		}
		accesstoken(function() {
			request.get(toURL(options)).json(callback || noop);
		});
	};

	var uploadNext = function(pool) {
		var uploading = find(pool, function(file) {
			return file.readystate === 'uploading';
		});

		if (uploading) return;

		var remote = find(pool, function(file) {
			return file.readystate === 'remote';
		});

		if (!remote) return;

		remote.readystate = 'uploading';
		remote.progress = 0;

		// only trigger onupload if it's a retry... otherwise we already called this in poolFile
		if (remote.retries) onupload();

		// let's ensure that we actually are supposed to upload this file...
		that.get('/1/files/'+remote.sharename+'/'+remote.fileid, function(err, fresh) {
			if (!fresh || !(fresh.readystate in {remote:1, uploading:1})) {
				remote.readystate = fresh ? fresh.readystate : 'failed';
				onuploadend(remote);
				uploadNext(pool);
				return;
			} 

			var upload = blobs.put(remote.upload.posturl, remote.source);
			var next = function() {
				var nextUpload = function() {
					uploadNext(pool);
				};
				var nextFile = find(pool, function(file) {
					return file.readystate === 'remote';
				});

				// to avoid rcs with same files we wait 2s between uploads...
				if (nextFile && (nextFile.filename === remote.filename)) return setTimeout(nextUpload, 2000);
				nextUpload();
			};

			that.emit('fileuploading', remote);

			upload.on('progress', function() {
				var delta = (upload.progress - remote.progress);

				remote.progress = upload.progress;
				that.emit('fileprogress', remote);
				onuploadprogress(delta, remote);
			});
			upload.on('upload', function() {
				remote.progress = 100;
				remote.readystate = 'uploaded';
				that.emit('fileupload', remote);

				onuploadend(remote);
				next();
			});
			upload.on('error', function() {
				remote.progress = 0;
				remote.retries = (remote.retries || 0) + 1;
				remote.readystate = remote.retries < 5 ? 'remote' : 'failed';

				if (remote.readystate === 'failed') {
					that.emit('fileerror', remote);
				}

				onuploadend(remote);
				next();
			});
		});
	};

	var totalUploading = 0;
	var totalUploaded = 0;
	var totalProgress = 0;

	var emitProgress = function(progress, file) {
		if (progress === that.progress) return;
		that.progress = progress;
		that.emit('progress', progress, file);
	};
	var onupload = function() {
		totalUploading++;
	};
	var onuploadprogress = function(delta, file) {
		totalProgress += delta;
		emitProgress(Math.floor(totalProgress / totalUploading), file);
	};
	var onuploadend = function(file) {
		totalUploaded++;

		if (totalUploaded === totalUploading) {
			totalUploading = totalUploaded = totalProgress = 0;
			emitProgress(100, file);
		}
	};

	var uploadFile = function(blob) {
		var sharename = blob.sharename;
		var pool = pools[sharename] = pools[sharename] || [];

		onupload();
		pool.push(blob);
		uploadNext(pool);
	};

	var createFiles = function(sharename, files, callback) {
		if (!files.length) return callback(null, []);

		common.step([
			function(next) {
				forEach(files, function(file) {
					createFile(sharename, file, next.parallel());
				});
			},
			function(files) {
				callback(null, files);
			}
		], callback);
	};
	var createFile = function(sharename, file, callback) {
		common.step([
			function(next) {
				that.post('/1/files/'+sharename+'/create', {filename:file.filename, session:that.session}, next);
			},
			function(result) {
				forEach(result, function(value, prop) {
					file[prop] = value;
				});

				file.progress = 0;

				uploadFile(file);
				callback(null, file);
			}
		], callback);
	};

	that.uploading = function(sharename, query) {
		if (!pools[sharename]) return false;
		if (typeof query === 'string') query = {filename:query};

		return find(pools[sharename], function(file) {
			for (var i in query) {
				if (file[i] !== query[i]) return false;
			}

			return file;
		});
	};
	that.upload = function(sharename, input, callback) {
		callback = callback || noop;

		return input.files ? createFiles(sharename, map(input.files, blobify), callback) : createFile(sharename, blobify(input), callback);
	};
	that.toJSON = function() {
		return api;
	};

	return that;
};

module.exports = function(options, callback) {
	var request = mania.create(options.host || 'https://open.ge.tt');

	if (options.accesstoken) return callback(null, mixin(request, options));

	request.post('/1/users/login').json({
		apikey: options.apikey,
		email: options.email,
		password: options.password,
		refreshtoken: options.refreshtoken
	}, common.fork(callback, function(api) {
		callback(null, mixin(request, api));
	}));

	return request;
};