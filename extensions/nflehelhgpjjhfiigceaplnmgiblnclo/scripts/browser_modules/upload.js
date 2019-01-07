var common = require('common');
var mimeTypes = require('mime');

var MEASURE_SIZE = 10;
var MAX_FILE_SIZE = 300 * 1000000;

var parseUrl = function(url) {
	var a = document.createElement('a');
	a.href = url;

	url = ['pathname', 'host', 'hostname', 'port', 'protocol', 'search'].reduce(function(acc, name) {
		acc[name] = a[name];
		return acc;
	}, {});

	a = null;

	url.protocol = url.protocol.slice(0, -1);
	url.port = parseInt(url.port) || 80;

	return url;
};
var nameFromUrl = function(pathname) {
	var names = pathname.split('/');
	var name = names[names.length - 1] || '';

	if(name.indexOf('.') !== -1) {
		return name;
	}

	return null;
};
var nameFromHeaders = function(options) {
	if(options.contentDisposition) {
		return options.contentDisposition;
	}

	return (new Date()).getTime().toString() + (mimeTypes.suffix(options.contentType) || '');
};
var now = function() {
	return Math.floor(Date.now() / 1000);
};

var Uploader = common.emitter(function(url, sharename) {
	this.url = url;
	this.sharename = sharename;
	this.parsedUrl = parseUrl(url);
	this.created = now();
	this.prettyUrl = this.parsedUrl.hostname.replace(/^www\./, '') + this.parsedUrl.pathname;
	this.filename = nameFromUrl(this.parsedUrl.pathname); //getName(url);
	this.id = common.uuid();

	this.setResources({ sharename: sharename });

	this.state = 'pending';
	this.lastError = null;

	this.fileid = null;
	this.contentType = null;
	this.progress = 0;
	this.size = 0;
	this.speed = 0;
	this.estimatedTimeLeft = 0;
	this.gettUrl = 'http://ge.tt';

	this._measurePoints = [];

	var self = this;
	var cleanup = function() {
		self._measurePoints = [];
	};

	this.on('progress', function() {
		self.setSpeed();
	});
	this.on('error', cleanup);
	this.on('done', cleanup);
});

Uploader.prototype.is = function(state) {
	var states = {};

	if(Array.isArray(state)) {
		state.forEach(function(name) {
			states[name] = 1;
		});
	} else if(typeof state === 'string') {
		states[state] = 1;
	}

	return this.state in states;
};
Uploader.prototype.setError = function(err) {
	if(this.state === 'error') {
		return;
	}

	this.state = 'error';
	this.lastError = err;

	this.emit('error', err);
};
Uploader.prototype.setContentInfo = function(options) {
	this.contentType = options.contentType;
	this.filename = this.filename || nameFromHeaders(options);
};
Uploader.prototype.setResources = function(options) {
	this.sharename = options.sharename || this.sharename;
	this.fileid = options.fileid || this.fileid;
	this.gettUrl = 'http://ge.tt';

	if(!this.sharename) {
		return;
	}

	this.gettUrl += '/' + this.sharename;

	if(!this.fileid) {
		return;
	}

	this.gettUrl += '/v/' + this.fileid;
};
Uploader.prototype.setSpeed = function() {
	var points = this._measurePoints;

	var time = now();
	var size = (this.size * 2) * (this.progress / 100);

	points.push({
		size: size,
		time: time
	});

	if(points.length > MEASURE_SIZE) {
		points.splice(0, 1);
	}

	var deltatime = time - points[0].time;

	// bytes per second
	this.speed = Math.round(deltatime ? (size - points[0].size) / deltatime : 0);
	this.estimatedTimeLeft = Math.round(this.speed ? ((this.size * 2) - size) / this.speed : 0);
};

var UploadManager = common.emitter(function(downloadPool, api) {
	this._pool = downloadPool;
	this.uploads = [];

	this.setApi(api);
});

UploadManager.prototype.setApi = function(api) {
	this._api = api;

	var self = this;

	this._api.on('fileuploading', function(file) {
		var uploader = self._find(file);

		if(uploader) {
			debug.debug('Upload started', uploader.url);

			return;
		}

		debug.warn('No uploader matching file in fileuploading', file);
	});
	this._api.on('fileupload', function(file) {
		var uploader = self._find(file);

		file.source = null;

		if(uploader) {
			uploader.state = 'done';

			debug.info('-- Upload ended', uploader.url, file, uploader);

			uploader.emit('done');

			return;
		}

		debug.warn('No uploader matching file in fileupload', file);
	});
	this._api.on('fileerror', function(file) {
		var uploader = self._find(file);

		file.source = null;

		if(uploader) {
			uploader.setError(new Error('Upload failed'));
			return;
		}

		debug.warn('No uploader matching file in fileerror', file);
	});
	this._api.on('fileprogress', function(file) {
		var uploader = self._find(file);

		if(uploader) {
			var progress = Math.round((100 + file.progress) / 2);

			if(progress === uploader.progress) {
				return;
			}

			uploader.progress = progress;

			debug.debug('Upload progress', uploader.url, file.progress, 
				'total progress', uploader.progress, 'speed', uploader.speed);

			uploader.emit('progress');

			return;
		}

		debug.warn('No uploader matching file in fileprogress', file);
	});
};
UploadManager.prototype.upload = function(url, sharename) {
	var self = this;
	var uploader = new Uploader(url, sharename);
	var end = this.emit.bind(this, 'end', uploader);
	var error = uploader.setError.bind(uploader);

	debug.info('Url added', url, sharename);

	this.uploads.splice(0, 0, uploader);

	if(uploader.parsedUrl.protocol !== 'http') {
		setTimeout(function() {
			error(new Error('Invalid url \'' + url + '\''));
		}, 1);

		return uploader;
	}

	uploader.on('done', end);
	uploader.on('error', end);

	this.emit('start', uploader);
	
	var downloader = this._pool.download(url);	

	downloader.on('begin', function() {
		debug.debug('-- Download started', url);

		uploader.state = 'download';

		uploader.emit('download');
	});
	downloader.on('headers', function() {
		debug.debug('Headers received', { contentLength: downloader.size, 
			contentType: downloader.contentType, contentDisposition: downloader.contentDisposition });

		if(downloader.size > MAX_FILE_SIZE) {
			downloader.abort();
			uploader.setError(new Error('File too big'));

			return;
		}

		uploader.setContentInfo({ 
			contentType: downloader.contentType,
			contentDisposition: downloader.contentDisposition
		});

		uploader.emit('progress');
	});
	downloader.on('error', error);
	downloader.on('progress', function() {
		var progress = Math.round(downloader.progress / 2);

		if(progress === uploader.progress) {
			return;
		}

		uploader.size = downloader.size;
		uploader.progress = progress;

		debug.debug('Download progress', url, downloader.progress, 
			'total progress', uploader.progress, 'speed', uploader.speed);

		uploader.emit('progress');
	});
	downloader.on('end', function() {
		uploader.size = downloader.size;

		self.emit('metainfo', uploader);

		debug.debug('Download ended', url, uploader.contentType, uploader.filename);

		common.step([
			function(next) {
				if(uploader.sharename) {
					next(null, { sharename: sharename });
					return;
				}

				self._api.post('/1/shares/create', next);
			},
			function(share, next) {
				uploader.setResources({ sharename: share.sharename });

				debug.debug('Share ready', url, share);

				if(share.created) {
					self.emit('share', share);
				}

				self._api.upload(share.sharename, {
					filename: uploader.filename,
					blob: downloader.blob
				}, next);
			},
			function(file) {
				uploader.state = 'upload';
				uploader.setResources({ fileid: file.fileid });

				file.__id = uploader.id;

				debug.debug('File ready', url, file);

				self.emit('file', file);
				uploader.emit('upload');
			}
		], error);
	});

	return uploader;
};
UploadManager.prototype.activeUploads = function() {
	return this._activeUploads().length;
};
UploadManager.prototype.clearInactiveUploads = function() {
	this.uploads = this._activeUploads();
};
UploadManager.prototype._activeUploads = function() {
	return this.uploads.filter(function(uploader) {
		return uploader.state in { pending: 1, download:1, upload:1 };
	});
};
UploadManager.prototype._find = function(file) {
	var id = file.__id;

	return this.uploads.filter(function(uploader) {
		return uploader.id === id;
	})[0];
};

exports.create = function(downloadPool, api, application) {
	return new UploadManager(downloadPool, api, application);
};
