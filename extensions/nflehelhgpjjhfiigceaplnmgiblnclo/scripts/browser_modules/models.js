//var datetime = require('shared/date.format');

var UNITS = ['B', 'KB', 'MB', 'GB', 'TB'];
var sizeFormat = function(num, dec) {
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
};
var shareTitle = function(share) {
	if (share.title) {
		return share.title;
	} else if(share.files.length === 1) {
		return share.files[0].filename;
	}

	return share.files.length+' '+({image:'images',audio:'songs',doc:'documents'}[share.getType()] || 'files');
};
var reduceFiles = function(share, init, fn) {
	return function() {
		var files = share.files;
		var acc = init;

		for(var i in files) {
			var file = files[i];

			acc = fn(acc, file);
		}

		return acc;
	};
};
var date = function(time) {
	time = new Date(time * 1000);

	return time.toString();
	//return time.format('dd mmm yyyy');
};
var filetype = function(filename) {
	if (/\.(jpg|jpeg|png|gif)$/i.test(filename)) {
		return 'image';
	}
	if (/\.(mp3)$/i.test(filename)) {
		return 'audio';
	}
	if (/\.(txt|readme|nfo|html|htm|doc|docx|pdf|ppt|pptx|tiff)$/i.test(filename)) {
		return 'doc';
	}

	return 'misc';
};

exports.create = function(host) {
	if(typeof host !== 'function') {
		var originalHost = (host || '').indexOf('://') === -1 ? 'http://' + host : host;

		host = function() {
			return originalHost;
		};
	}

	var that = {};

	that.share = function(share) {
		for (var i = 0; i < share.files.length; i++) {
			share.files[i] = that.file(share.files[i], share);
		}

		share.getSize = reduceFiles(share, 0, function(acc, file) {
			return acc + (file.size || 0);
		});
		share.getDownloads = reduceFiles(share, 0, function(acc, file) {
			return acc + file.downloads;
		});
		share.getType = reduceFiles(share, null, function(acc, file) {
			return (!acc || acc === file.filetype) ? file.filetype : 'misc';
		});
		share.getTitle = function() {
			return shareTitle(share);
		};

		share.createdDate = date(share.created);
		share.zipurl = host()+'/1/shares/'+share.sharename+'/zip';

		share.formatSize = function() {
			var size = share.getSize();
			
			return size ? sizeFormat(size || 0, true) : '~';			
		};
		share.ready = function() {
			return share.readystate === 'ready';
		};

		return share;
	};
	that.shares = function(shares) {
		for (var i = 0; i < shares.length; i++) {
			shares[i] = that.share(shares[i]);
		}
		return shares;
	};
	that.file = function(file, share) {
		share = share || {};

		file.sharename = file.sharename || share.sharename;
		file.userid = file.userid || share.userid;

		file.extension = file.filename.split('.').pop().substring(0, 4).toLowerCase();
		file.filetype = filetype(file.filename); //shareutils.filetype(file.filename);
		file.createdDate = date(file.created);

		//file.bloburl = host()+'/1/files/'+file.sharename+'/'+file.fileid+'/blob';

		var bloburl = host()+'/1/files/'+file.sharename+'/'+file.fileid+'/blob';
		var normalizeUrl = function(url) {
			return url && url.replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/'/g, '%27');
		};
		var createUrls = function(bloburl, query) {
			query = query ? '?' + query : '';

			file.bloburl = bloburl + query;
			file.downloadurl = bloburl + '?download';

			if (file.filetype === 'image') {
				file.teaserurl = normalizeUrl(file.thumbs && file.thumbs['50x36']) || (bloburl+'/50x36?method=thumb');
				file.thumburl = normalizeUrl(file.thumbs && file.thumbs['185x135']) || (bloburl+'/185x135?method=thumb');
				file.scaleurl = bloburl+'/x675' + query;
			}

			file.viewurl = bloburl + query;

			if(file.filetype === 'image' && file.extension !== 'gif') {
				file.viewurl = file.scaleurl;
			}
			else if(file.filetype === 'doc') {
				file.viewurl = '/s/viewers/doc.html?url=' + encodeURIComponent(bloburl + query) + '&extension=' + file.extension;
			}
		};

		createUrls(bloburl);

		file.formatSize = function() {
			return this.size ? sizeFormat(this.size, true) : '~';			
		};
		file.uploaded = function() {
			return this.readystate === 'uploaded';	
		};
		file.failed = function() {
			return !(this.readystate in { remote: 1, uploaded: 1, uploading: 1 });
		};
		file.errorMessage = function() {
			return {
				storagelimit: 'Sorry, no space left for the file',
				violatedterms: 'This file has violated the terms of services',
				failed: 'Failed to upload file'
			}[this.readystate] || null;
		};
		file.user = function(user) {
			var owns = user.owns(file) ? 'noinc=1' : '';

			createUrls(bloburl, owns);

			return file;
		};

		return file;
	};
	that.user = function(user) {
		user.anon = user.type === 'anon';
		user.paying = !user.anon && user.type !== 'free';
		user.fromFacebook = !!user.facebookuserid;
		user.unread = user.unread || 0;

		var storage = Math.min(user.storage.limit, user.storage.used);
		var percentage = Math.floor(100*storage/user.storage.limit);

		user.storage.usedPercentage = percentage;
		user.storage.formatted = {
			used: sizeFormat(Math.min(user.storage.used, user.storage.limit)),
			limit: sizeFormat(user.storage.limit),
			extra: user.storage.extra && sizeFormat(user.storage.extra)
		}

		user.fresh = user.anon && !user.files; // todo, find out when this is correct

		user.owns = function(resource) {
			if(!resource || !resource.userid) {
				return false;
			}

			return user.userid === resource.userid;
		};
		
		return user;
	};

	return that;
};
