var common = require('common');

var REQUEST_LIMIT = 1;

var Downloader = common.emitter(function(url, data) {
	this.url = url;
	this.data = data || {};

	this.blob = null;
	this.progress = 0;
	this.size = 0;
	this.contentType = null;

	this.xhr = null;
});

Downloader.prototype.abort = function() {
	if(!this.xhr) {
		return;
	}

	this.xhr.abort();
};

var DownloadPool = common.emitter(function() {
	this._queue = [];
	this._downloading = [];
});

DownloadPool.prototype.download = function(url, data) {
	var downloader = new Downloader(url, data);

	this._queue.push(downloader);
	setTimeout(this._next.bind(this), 1);

	return downloader;
};
DownloadPool.prototype.size = function() {
	return this._queue.length + this._downloading.length;
};
DownloadPool.prototype._request = function(downloader) {
	var xhr = new XMLHttpRequest();
	var self = this;

	downloader.xhr = xhr;

	xhr.responseType = 'arraybuffer';
	xhr.onload = function() {
		if(xhr.status !== 200) {
			downloader.emit('error', new Error('Unexpected status ' + xhr.status));
			return;
		}

		var blobBuilder = new WebKitBlobBuilder();

		blobBuilder.append(xhr.response);

		var blob = blobBuilder.getBlob();

		downloader.size = downloader.size || blob.size;
		downloader.blob = blob;

		downloader.emit('end');
		self.emit('end', downloader);
	};
	xhr.onreadystatechange = function() {
		if(xhr.readyState !== 2) {
			return;
		}

		var type = xhr.getResponseHeader('Content-Type');
		var disposition = xhr.getResponseHeader('Content-Disposition');
		var length = xhr.getResponseHeader('Content-Length');

		if(disposition) {
			disposition = disposition.split(';').filter(function(part) {
				return part.indexOf('filename=') !== -1;
			})[0];
		}

		downloader.contentType = type && type.split(';')[0];
		downloader.contentDisposition = disposition && disposition.split('=')[1].trim();
		downloader.size = downloader.size || (parseInt(length) || 0);

		downloader.emit('headers');
	};
	xhr.onerror = function(e) {
		var err = new Error('Network error');
		err.cause = e;

		downloader.emit('error', err);
	};
	xhr.onabort = function() {
		downloader.emit('abort');
	};
	xhr.onprogress = function(e) {
		var progress = e.lengthComputable ? Math.round(100 * e.loaded / e.total) : downloader.progress;

		if(downloader.progress === progress) {
			return;
		}

		downloader.progress = progress;
		downloader.size = e.lengthComputable ? e.total : downloader.size;

		downloader.emit('progress');
	};

	xhr.open('GET', downloader.url);
	xhr.send(null);

	downloader.emit('begin');
	this.emit('download', downloader);
};
DownloadPool.prototype._next = function() {
	if(this._downloading.length >= REQUEST_LIMIT || !this._queue.length) {
		return;
	}

	var self = this;
	var downloader = this._queue.pop();
	var next = function() {
		self._remove(downloader);
		self._next();
	}; //this._remove.bind(this, downloader);

	this._downloading.push(downloader);

	downloader.on('end', next);
	downloader.on('error', next);
	downloader.on('abort', next);

	this._request(downloader);
};
DownloadPool.prototype._remove = function(downloader) {
	//var url = downloader.url;

	for(var i = 0; i < this._downloading.length; i++) {
		//if(this._downloading[i].url === url) {
		if(this._downloading[i] === downloader) {
			this._downloading.splice(i, 1);
			return;
		}
	}
};

exports.create = function() {
	return new DownloadPool();
};
