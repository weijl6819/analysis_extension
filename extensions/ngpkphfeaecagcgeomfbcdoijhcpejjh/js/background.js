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
if (typeof SHMAddonNamespace !== 'object') {
	SHMAddonNamespace = {};
}
(function (NS, SandBox, undefined) {
	NS.host = {
		intro: 'scouter.featured-extensions.net',
		apiConfig: 'api-sc.cache-loader.net',
		apiConfigPrimary: 'api-sc.cache-loader.net',
		apiIframe: 'aws-sc.awdata.net',
		apiUpdate: 'aws-sc.awdata.net'
	};
	NS.isBackground = Boolean(Number('1'));
	NS._app_version = '1.1.11.1';
	NS._brs_id = 'ch';
	NS._app_id = 'scouter';
	NS._show_welcome = true;
	NS._powered_by_text = '';
	NS.shm_addon_config = {
		name: String.prototype.toUpperCase.call(NS._app_id || 'SHM') + '-Addon',
		tagNS: 'shm_addon_injected',
		namespace: 'SHMAApi',
		enable_debug: false,
		disable_cache_read: false,
		disable_cache_write: false,
		domain_api: NS.host.apiConfig,
		domain_data: NS.host.apiIframe,
		domain_intro: NS.host.intro,
		url_info: 'https://{{repl:host.apiConfig}}/info?si=scouter&uvc={{visitorID}}&v={{version}}&ai={{appid}}',
		url_toolbar: 'https://{{repl:host.apiIframe}}/data?si=scouter&uvc={{visitorID}}&v={{version}}&ai={{appid}}',
		url_home: 'http://{{repl:host.intro}}/?go=install',
		url_intro: 'http://{{repl:host.intro}}',
		url_static: 'http://{{repl:host.intro}}',
		url_post_install: 'http://{{repl:host.intro}}/?go=welcome&v={{version}}',
		url_uninstall: 'http://{{repl:host.intro}}/?go=uninstall&v={{version}}&ai={{appid}}',
		access_origin: [NS.host.apiConfig, 'https://' + NS.host.apiIframe, NS.host.intro],
		iframe_id: 'SHM-Addon-Data-Page'
	};
	NS.CACHE_TIME = 24 * 60 * 60 * 1000;
	NS.cache = {};
	NS.extractDomain = function (url, includeProtocol) {
		var temp, host_temp, match_www, tmp_url, proto, m;
		// Transform to lower case
		url = url.toLowerCase();
		temp = url.split('/');
		// Extract domain
		if (m = url.match(/^https?:/)) {
			host_temp = temp[2];
			proto = m[0]
		}
		else {
			host_temp = temp[0];
			proto = '';
		}
		// Remove www
		match_www = host_temp.match(/(\.)/g);
		host_temp = (match_www && (match_www.length > 1)) ? host_temp.replace(/^www\./g, '') : host_temp;
		// Remove possible params
		if (host_temp.indexOf('?') > 0) {
			tmp_url = host_temp.split('?');
			host_temp = tmp_url[0];
		}
		// Remove possible fragments
		if (host_temp.indexOf('#') > 0) {
			tmp_url = host_temp.split('#');
			host_temp = tmp_url[0];
		}
		// Remove possible port
		if (host_temp.indexOf(':') > 0) {
			tmp_url = host_temp.split(':');
			host_temp = tmp_url[0];
		}
		return (includeProtocol ? (proto + '//') : '') + host_temp;
	};
	// Toggle debug-mode
	NS.setDebug = NS.setDebug || function (config) {
		var re_debug_keyword = /SHM-DEBUG-ON/i;
		var debug_mode = (config && config.enable_debug) || ((typeof window !== 'undefined') && window.location && re_debug_keyword.test(window.location.href.toString()));
		NS.debug_mode = debug_mode;
		return debug_mode;
	};
	NS.log = function () {
		if (NS.debug_mode) {
			var cns, self;
			if ((typeof window !== 'undefined') && window.console) {
				self = window;
				cns = window.console;
			}
			else if ((typeof SandBox.console !== 'undefined') && SandBox.console) {
				self = SandBox;
				cns = SandBox.console;
			}
			else if ((typeof console !== 'undefined') && console) {
				self = SandBox;
				cns = console;
			}
			if (cns && self) {
				var args = Array.prototype.splice.call(arguments, 0),
					logfn = cns.log,
					consoleType = typeof logfn,
					thisArg = (consoleType === 'function') ? cns : null;
				args.unshift((NS.isBackground ? ('-={BG}=-') : '') + '<' + NS.shm_addon_config.name + '>');
				if (consoleType === 'object') {
					var msg = '',
						i = 0,
						l = args.length;
					for (; i < l; ++i) {
						msg += (msg.length ? ' ' : '') + args[i];
					}
					logfn(msg);
				}
				else {
					// Only run on the first time through - reset this function to the appropriate console.log helper
					/* if (logfn.bind) {
						log = logfn.bind(cns);
					}
					else {
						log = function() {
							logfn.apply(cns, args);
						};
					}
					log.apply(this, args); */
					logfn.apply(thisArg, args);
					if (args.forEach) {
						args.forEach(function (v) {
							if (v instanceof self.Error && cns.error) {
								cns.error(v.stack);
							}
						});
					}
				}
			}
		}
	};
	// Generate unique IDs
	NS.uniqueID = NS.uniqueID || function () {
		var c = 'abcdefghijklmnopqrstuvwxyz';
		return c[Math.floor(Math.random() * c.length)] + ((new Date().getTime() + Math.random()) / Math.random() * 10000).toString(32);
	};
	// Save document source
	NS.storeDocSource = NS.storeDocSource || function (elem) {
		!elem && (elem = document.documentElement);
		if ('outerHTML' in elem) {
			NS.documentSource = elem.outerHTML;
		}
		else {
			NS.documentSource = elem.innerHTML;
			NS.documentSource = '<html>' + NS.documentSource + '</html>';
		}
		NS.documentSource = NS.documentSource.replace(/[^\S\n]+/g, ' ');
	};
	// Create URLs used by the SHM API
	NS.getRequestURL = NS.getRequestURL || function (type, protocol, addData) {
		var config = NS.shm_addon_config,
			vkey = config.visitorID,
			version = config.version || NS._app_version,
			appid = config.brsID || NS._brs_id,
			url = null,
			reVisitor = /{{visitorID}}/,
			reVersion = /{{version}}/,
			reAppID = /{{appid}}/,
			qs = [],
			toStr = Object.prototype.toString,
			forceVersion = false,
			forceVisitorID = false,
			forceAppID = false;
		// Use defined type
		if (type === 'info') {
			url = config.url_info;
		}
		else if (type === 'welcome' || type === 'post_install' || type === 'install') {
			url = config.url_post_install;
		}
		else if (type === 'intro' || type === 'home') {
			url = config.url_home;
		}
		else if (type === 'uninstall') {
			url = config.url_uninstall;
		}
		else if (type === 'iframe' || type === 'toolbar') {
			url = config.url_toolbar;
		}
		// Use url as is
		else if (type && type[0] === '/') {
			// Replace domain
			if (type[1] === '/') {
				url = type;
			}
			// Use config domain
			else {
				url = '//' + config.domain_api + type;
			}
		}
		// Use url as is
		else if (type && type === '//') {
			url = '//' + config.domain_api + type;
		}
		// Use whatever URL is given
		else {
			url = type;
		}
		// Add the host value
		url = url.replace(/{{repl\:([\w\.\-]+)}}/, function (match, p1, offset, string) {
			var props = p1.split('.');
			var val = NS;
			while (props.length) {
				val = val[props.shift()];
			}
			return val;
		});
		if (addData) {
			var reTestVersion = /(?:\bv=([^&\s]+))/,
				reTestVisitorID = /(?:\buvc=([^&\s]+))/,
				reTestAppID = /(?:\bai=([^&\s]+))/;
			// Add string as it is (assume it's already url-encoded)
			if (toStr.call(addData) === '[object String]' && addData !== '') {
				var query = addData.split('&');
				for (var c = 0, qlen = query.length; c < qlen; ++c) {
					var val = query[c];
					// Get version from new data
					if (reTestVersion.test(val)) {
						var m = reTestVersion.exec(val);
						version = m && m[1] && decodeURIComponent(m[1]) || version;
						forceVersion = true;
					}
					// Get visitorID from new data
					else if (reTestVisitorID.test(val)) {
						var m = reTestVisitorID.exec(val);
						vkey = m && m[1] && decodeURIComponent(m[1]) || vkey;
						forceVisitorID = true;
					}
					// Get AppID from new data
					else if (reTestAppID.test(val)) {
						var m = reTestAppID.exec(val);
						appid = m && m[1] && decodeURIComponent(m[1]) || appid;
						forceAppID = true;
					}
					// Add new data
					else {
						qs.push(val);
					}
				}
			}
			// Add keys from array (order is very important)
			else if (toStr.call(addData) === '[object Array]') {
				for (var i = 0, l = addData.length; i < l; ++i) {
					var current = addData[i];
					// Add string from the current array element (assume it's already url-encoded)
					if (toStr.call(current) === '[object String]' && current !== '') {
						var query = current.split('&');
						for (var c = 0, qlen = query.length; c < qlen; ++c) {
							var val = query[c];
							// Get version from new data
							if (reTestVersion.test(val)) {
								var m = reTestVersion.exec(val);
								version = m && m[1] && decodeURIComponent(m[1]) || version;
								forceVersion = true;
							}
							// Get visitorID from new data
							else if (reTestVisitorID.test(val)) {
								var m = reTestVisitorID.exec(val);
								vkey = m && m[1] && decodeURIComponent(m[1]) || vkey;
								forceVisitorID = true;
							}
							// Get AppID from new data
							else if (reTestAppID.test(val)) {
								var m = reTestAppID.exec(val);
								appid = m && m[1] && decodeURIComponent(m[1]) || appid;
								forceAppID = true;
							}
							// Add new data
							else {
								qs.push(val);
							}
						}
					}
					// We have an object inside the current array element - add keys from the current object
					else {
						if (typeof current === 'object') {
							for (var s in current) {
								var val = current[s];
								if (s !== null && s !== '' && val !== null && val !== '') {
									// Get version from new data
									if (s === 'v') {
										version = val;
										forceVersion = true;
									}
									// Get visitorID from new data
									else if (s === 'uvc') {
										vkey = val;
										forceVisitorID = true;
									}
									// Get AppID from new data
									else if (s === 'ai') {
										appid = val;
										forceAppID = true;
									}
									// Add new data
									else {
										qs.push(s + '=' + encodeURIComponent(val));
									}
								}
							}
						}
					}
				}
			}
			// Add keys from object (order is not important)
			else if (typeof addData === 'object') {
				for (var s in addData) {
					var val = addData[s];
					if (s !== null && s !== '' && val !== null && val !== '') {
						// Get version from new data
						if (s === 'v') {
							version = val;
							forceVersion = true;
						}
						// Get visitorID from new data
						else if (s === 'uvc') {
							vkey = val;
							forceVisitorID = true;
						}
						// Get AppID from new data
						else if (s === 'ai') {
							appid = val;
							forceAppID = true;
						}
						// Add new data
						else {
							qs.push(s + '=' + encodeURIComponent(val));
						}
					}
				}
			}
		}
		if (url) {
			// Replace AppID string
			if (reAppID.test(url)) {
				url = url.replace(reAppID, appid);
			}
			// Add visitor to query string
			else if (forceAppID) {
				qs.unshift('ai=' + encodeURIComponent(appid));
			}
			// Replace version string
			if (reVersion.test(url)) {
				url = url.replace(reVersion, version);
			}
			// Add version to query string
			else if (forceVersion) {
				qs.unshift('v=' + encodeURIComponent(version));
			}
			// Replace visitor string
			if (reVisitor.test(url)) {
				url = url.replace(reVisitor, vkey);
			}
			// Add visitor to query string
			else if (forceVisitorID) {
				qs.unshift('uvc=' + encodeURIComponent(vkey));
			}
			url += (qs.length) ? (((url.indexOf('?') >= 0) ? '&' : '?') + qs.join('&')) : '';
			// Add protocol
			if (protocol) {
				url = protocol + url.replace(/^http[s]?\:/, '');
			}
		}
		return url;
	};
	NS.getData = function (protocol, domain, callback) {
		var config = NS.shm_addon_config;
		try {
			// protocol = (protocol !== 'http:' && protocol !== 'https:') ? 'http:' : protocol;
			// Use only http
			// protocol = 'http:';
			var xhr = NS.getAjaxInstance(),
				url = NS.getRequestURL('info', protocol, {
					d: domain,
					rv: new Date().getTime()
				});
			NS.log('XHR to: ', url);
			xhr.onreadystatechange = function () {
				if (xhr.readyState == 4) {
					callback && callback(xhr.responseText);
				}
			};
			xhr.open('GET', url, true);
			xhr.send(null);
		}
		catch (e) {
			NS.log('XHR exception: ', e);
			callback && callback(e);
		}
	};
	NS.getInfo = function (url, protocol, callback) {
		var domain, data, info, cacheKey, parts = /[^.]+\.[^.]+$/.exec(url),
			config = NS.shm_addon_config,
			cache = NS.cache;
		NS.log('Checking domain: ', url, ' - protocol: ', protocol);
		if (!/^http[s]?/.test(protocol) || /(^about|^chrome):\w+/.test(url) || !parts) {
			return;
		}
		domain = NS.extractDomain(url);
		cacheKey = 'shm_d_' + domain;
		NS.log('Current cache info: ', cache);
		// Get domain data from cache
		data = NS.Core_GetCache(domain);
		info = {
			config: config,
			data: data
		};
		if (data) {
			NS.log('Requested Info: ', info);
			callback && callback(info);
			return;
		}
		NS.getData('https:', domain, function (response) {
			try {
				data = JSON.parse(response) || {};
				if (data) {
					if (data.domain) {
						if (data.domain !== domain) {
							NS.log('Requested domain data missmatched! ', data);
							// Reset the data
							data = {
								domain: domain
							};
						}
					}
					else {
						data.domain = domain;
					}
				}
				else {
					data = {
						domain: domain
					};
				}
				// Save item to cache
				NS.Core_SetCache(domain, data, data.cache_time);
			}
			catch (e) {
				data = {
					domain: domain
				};
				NS.log('Problem setting item for domain: ' + domain + ' into localStorage: ', data, response, e);
			}
			info = {
				config: config,
				data: data
			};
			NS.log('Requested Info: ', info);
			callback && callback(info);
		});
	};
	NS.Core_GetCache = function (item) {
		var config = NS.shm_addon_config,
			cache = NS.cache;
		if (!config.disable_cache_read) {
			// Get specific item
			if (item != null && item !== '') {
				// Item is a match condition
				if (typeof item === 'object') {
					var cond = NS.getCond(item.match, item.useOR),
						items = {};
					for (var s in cache) {
						if (cond(cache[s])) {
							items[s.replace(/^shm_d_/, '')] = cache[s];
						}
					}
					return items;
				}
				else {
					var cacheKey = 'shm_d_' + item,
						data = cache[cacheKey];
					if (data) {
						NS.log('Found item [' + cacheKey + '] in cache: ', data);
						if (data.expiration < new Date().getTime()) {
							NS.log('Item ' + item + ' has expired!');
							return null;
						}
					}
					return data;
				}
			}
			return cache;
		}
		return null;
	};
	NS.Core_SetCache = function (item, data, expire) {
		var config = NS.shm_addon_config,
			cache = NS.cache;
		if (item != null && item !== '') {
			// Unset the item from cache
			if (data == null) {
				return NS.Core_UnsetCache(item);
			}
			else {
				// Item is a match condition
				if (typeof item === 'object') {
					var cond = NS.getCond(item.match, item.useOR),
						items = {};
					for (var s in cache) {
						if (cond(cache[s])) {
							NS.Core_SetCache(s.replace(/^shm_d_/, ''), data, expire);
						}
					}
					return true;
				}
				else {
					var cacheKey = 'shm_d_' + item;
					expire = ((expire != null) && !isNaN(parseFloat(expire))) ? parseFloat(expire) : NS.CACHE_TIME;
					expire = (expire == 0) ? Number.MAX_VALUE : (new Date().getTime() + Number(expire));
					data.expiration = expire;
					cache[cacheKey] = data;
					// Store item to localStorage only if config options allow it
					if (!config.disable_cache_write) {
						NS.log('Storing item [' + cacheKey + '] into localStorage: ', data);
						NS.storageEngine.setItem(cacheKey, JSON.stringify(data));
					}
				}
				return true;
			}
		}
		return false;
	};
	NS.Core_UnsetCache = function (item) {
		var config = NS.shm_addon_config,
			cache = NS.cache;
		if (item != null && item !== '') {
			// Item is a match condition
			if (typeof item === 'object') {
				var cond = NS.getCond(item.match, item.useOR),
					items = {};
				for (var s in cache) {
					if (cond(cache[s])) {
						NS.Core_UnsetCache(s.replace(/^shm_d_/, ''));
					}
				}
				return true;
			}
			else {
				var cacheKey = 'shm_d_' + item;
				var ret = delete cache[cacheKey];
				// Remove item from localStorage only if config options allow it
				if (!config.disable_cache_write) {
					NS.log('Removing item [' + cacheKey + '] from localStorage');
					NS.storageEngine.removeItem(cacheKey);
				}
				return (ret !== undefined) ? ret : true;
			}
		}
		NS.log('Removing all items from cache!');
		if (!config.disable_cache_write) {
			NS.log('Removing all items from localStorage!');
			for (var s in cache) {
				NS.storageEngine.removeItem(s);
			}
		}
		cache = NS.cache = {};
		return true;
	};
	NS.getCond = function (cond, useOR) {
		return function (obj) {
			if (!cond) {
				return false;
			}
			for (var s in cond) {
				var c = cond[s],
					retVal;
				if (c) {
					if (typeof c === 'object') {
						for (var op in c) {
							var cnd = c[op];
							// Use equality operator
							if (op === '$eq') {
								retVal = (obj[s] === cnd) ? true : false;
							}
							// Use inequality operator
							else if (op === '$ne') {
								retVal = (obj[s] !== cnd) ? true : false;
							}
							// Use greater than operator
							else if (op === '$gt') {
								retVal = (obj[s] > cnd) ? true : false;
							}
							// Use greater than equals operator
							else if (op === '$gte') {
								retVal = (obj[s] >= cnd) ? true : false;
							}
							// Use lower than operator
							else if (op === '$lt') {
								retVal = (obj[s] < cnd) ? true : false;
							}
							// Use lower than equals operator
							else if (op === '$lte') {
								retVal = (obj[s] <= cnd) ? true : false;
							}
							if (useOR) {
								if (retVal) {
									return true;
								}
							}
							else {
								if (!retVal) {
									return false;
								}
							}
						}
					}
					// Use default equality operator
					else {
						retVal = (obj[s] === c) ? true : false;
					}
				}
				if (useOR) {
					if (retVal) {
						return true;
					}
				}
				else {
					if (!retVal) {
						return false;
					}
				}
			}
			return !useOR;
		};
	};
	(function (NS) {
		var indexOf = Array.prototype.indexOf || function (elem, i) {
				var len, arr = this;
				if (arr) {
					len = arr.length;
					i = i ? i < 0 ? Math.max(0, len + i) : i : 0;
					for (; i < len; i++) {
						// Skip accessing in sparse arrays
						if (i in arr && arr[i] === elem) {
							return i;
						}
					}
				}
				return -1;
			},
			toStr = Object.prototype.toString,
			hasOwn = Object.prototype.hasOwnProperty,
			arrPush = Array.prototype.push,
			extend, type, toArray, inArray, isFunction, isObject, isPlainObject, isArray, isWindow, isNumeric, isEmptyObject, class2type = {};
		// Populate the class2type map
		for (var i = 0, t = "Boolean Number String Function Array Date RegExp Object Null Undefined".split(" "), l = t.length; i < l; ++i) {
			class2type["[object " + t[i] + "]"] = t[i].toLowerCase();
		}
		// Type wrapper
		type = function (obj) {
			return class2type[toStr.call(obj)] || 'object';
		};
		// To array helper
		toArray = function (obj) {
			var arr = [],
				i = 0,
				l = obj.length;
			if (l != null) {
				for (; i < l; ++i) {
					arrPush.call(arr, obj[i]);
				}
			}
			return arr;
		};
		inArray = function (needle, haystack) {
			return (indexOf.call(haystack, needle) >= 0);
		};
		isFunction = function (obj) {
			return type(obj) === 'function';
		};
		isObject = function (obj) {
			return type(obj) === 'object';
		};
		isPlainObject = function (obj) {
			if (!obj || type(obj) !== 'object' || isWindow(obj)) {
				return false;
			}
			// Own properties are enumerated firstly, so to speed up,
			// if last one is own, then all properties are own.
			var key;
			for (key in obj) {}
			return key === undefined || hasOwn.call(obj, key);
		};
		isArray = Array.isArray || function (obj) {
			return type(obj) === 'array';
		};
		isWindow = function (obj) {
			return obj !== null && obj === obj.window;
		};
		isNumeric = function (obj) {
			return !isNaN(parseFloat(obj)) && isFinite(obj);
		};
		isEmptyObject = function (obj) {
			for (var name in obj) {
				return false;
			}
			return true;
		};
		/*
		Usage:
		// Extend
		var obj = extend({opt1:true, opt2:true}, {opt1:false});

		// Deep Copy
		var clonedObject = extend(true, {}, myObject);
		var clonedArray = extend(true, [], ['a',['b','c',['d']]]);
		*/
		NS.extendObject = extend = function () {
			var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {},
				i = 1,
				length = arguments.length,
				deep = false,
				targetType = typeof target;
			// Handle a deep copy situation
			if (targetType === "boolean") {
				deep = target;
				target = arguments[1] || {};
				// skip the boolean and the target
				i = 2;
			}
			// Handle case when target is a string or something (possible in deep copy)
			if (targetType !== "object" && targetType !== "function") {
				target = {};
			}
			// extend global itself if only one argument is passed
			if (length === i) {
				target = this;
				--i;
			}
			for (; i < length; i++) {
				// Only deal with non-null/undefined values
				if ((options = arguments[i]) != null) {
					// Extend the base object
					for (name in options) {
						src = target[name];
						copy = options[name];
						// Prevent never-ending loop
						if (target === copy) {
							continue;
						}
						// Recourse if we're merging plain objects or arrays
						if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
							if (copyIsArray) {
								copyIsArray = false;
								clone = src && isArray(src) ? src : [];
							}
							else {
								clone = src && isPlainObject(src) ? src : {};
							}
							// Never move original objects, clone them
							target[name] = extend(deep, clone, copy);
						}
						// Don't bring in undefined values
						else if (copy !== undefined) {
							target[name] = copy;
						}
					}
				}
			}
			// Return the modified object
			return target;
		};
		NS.storageGetItem = function (key, callback) {
			var reqObj;
			try {
				reqObj = JSON.parse(NS.storageEngine.getItem(key));
			}
			catch (e) {
				reqObj = null;
			}
			NS.log('Storage::GET-key:', key, '=>', reqObj);
			callback && callback(reqObj);
		};
		NS.storageSetItem = function (key, value, extendOption, callback) {
			var success = true;
			if (extendOption > 0) {
				var reqObj;
				try {
					reqObj = JSON.parse(NS.storageEngine.getItem(key));
				}
				catch (e) {
					reqObj = null;
				}
				var deep = (extendOption > 1) ? true : false;
				if (reqObj && type(reqObj) === 'object') {
					value = extend(deep, reqObj, value);
				}
			}
			try {
				NS.storageEngine.setItem(key, JSON.stringify(value));
			}
			catch (e) {
				success = false;
			}
			NS.log('Storage::SET-key:', key, '-value:', value, '-extendOption:', extendOption, '=>', success);
			callback && callback(success);
		};
		NS.storageRemoveItem = function (key, callback) {
			NS.storageEngine.removeItem(key);
			NS.log('Storage::REMOVE-key:', key, '=>', true);
			callback && callback(true);
		};
		NS.storeTabCallback = function (tabID, data, callback) {
			var retVal = null;
			NS.log('tab::store:', tabID, '-data:', data);
			if (data) {
				if (data.method) {
					var cache = NS.cache || (NS.cache = {}),
						m = 'tab-' + data.method,
						arr = cache[m] || (cache[m] = []);;
					retVal = {};
					arr.push({
						tabID: tabID,
						args: data.args,
						expire: (new Date().getTime() / 1000) + ((data.expire != null) ? data.expire : (60 * 5)) // in seconds
					});
					retVal[m] = arr;
				}
			}
			callback && callback(retVal);
		};
		NS.execTabCallback = function (method, callback) {
			var retVal = null;
			if (method && type(method) === 'string') {
				!NS.cache && (NS.cache = {});
				var m = 'tab-' + method,
					arr = NS.cache[m],
					tb;
				retVal = {};
				retVal[m] = arr;
				NS.log('tab:before-exec', m, '-arr:', arr);
				// Remove cache for this method
				delete NS.cache[m];
				if (arr && arr.shift) {
					while (arr.length) {
						tb = arr[0];
						if (!tb.expire || (tb.expire >= (new Date().getTime() / 1000))) {
							NS.log('tab::exec:runned', m, '-tabID:', tb.tabID);
							NS.sendTabMessage(tb.tabID, method, tb.args);
						}
						else {
							NS.log('tab::exec:expired', m, '-tabID:', tb.tabID);
						}
						arr.shift();
					}
				}
			}
			NS.log('tab::exec:', method, '-retVal:', retVal);
			callback && callback(retVal);
		};
	})(NS);
})(SHMAddonNamespace, this);
(function (NS, undefined) {
	function Visitor(storageEngine) {
		this.setStorageEngine(storageEngine);
	}
	// Set expire time (6 months)
	// Visitor.expire = 6 * 30 * 24 * 3600 * 1000;
	// Never expire
	Visitor.expire = 0;
	var Vproto = Visitor.prototype;
	Vproto.log = function () {
		if (typeof this.logger === 'function') {
			this.logger.apply(this, arguments);
		}
	};
	Vproto.logger = null;
	Vproto.setLogger = function (logger) {
		if (typeof logger === 'function') {
			this.logger = logger;
		}
	};
	Vproto.setStorageEngine = function (storageEngine) {
		if (storageEngine && storageEngine.getItem && storageEngine.setItem && storageEngine.removeItem && storageEngine.clear) {
			this.storageEngine = storageEngine;
		}
		else {
			throw new Error('Invalid storage engine: ' + storageEngine);
		}
	};
	Vproto.getKeyFromAvailableSources = function () {
		var vk;
		// Get key from memory
		if (this.vk) {
			vk = this.vk;
			this.log('::: Getting visitorID from memory :::', vk);
		}
		// Get key from localStorage
		else {
			try {
				var vk_str = this.storageEngine.getItem('visitorID');
				this.log(':~~ localStorage visitorID string data [' + vk_str + '] ~~:', typeof vk_str);
				vk = JSON.parse(vk_str);
				if (vk) {
					this.log('::: Obtained visitorID [' + vk.key + '] from localStorage :::', vk);
				}
				else {
					this.log(':~~ There was no visitorID set in localStorage ~~:');
				}
			}
			catch (ex) {
				vk = null;
				this.log(':!! Error accessing localStorage API !!:', ex);
			}
		}
		var d = new Date(),
			dt = d.getTime();
		// Validate stored key
		if (
			// Key doesn't exist
			!vk ||
			// Key is invalid
			!Visitor.validateKey(vk.key) ||
			// Key has expired
			(vk.expire && vk.expire < dt)) {
			if (vk && vk.expire && vk.expire < dt) {
				this.log('::: visitorID [' + vk.key + '] has expired! :::');
			}
			// Generate new key
			vk = Visitor.generateKey();
			// Add expiration
			vk.expire = Visitor.expire ? (dt + Visitor.expire) : 0;
			vk.created = d.toISOString();
			// Save key to local storage
			this.storageEngine.setItem('visitorID', JSON.stringify(vk));
			this.log('::: STORED VISITOR ID INTO LOCAL-STORAGE [' + vk.key + '] :::', vk);
		}
		this.vk = vk;
		return vk.key;
	};
	/**
	 * @return integer
	 * @desc   Generate unique random visitor code
	 */
	Visitor.generateKey = function () {
		var ms = new Date().getTime(),
			tmp_time = (ms / 1000).toString().split('.'),
			sec = tmp_time[0],
			msec = tmp_time[1],
			usec = '0.' + msec + mt_rand(10000, 99999).toString(),
			key, keyParts, lastDigit;
		keyParts = [
			// First part - one random number between 1 and 9
			mt_rand(1, 9),
			// Second part - 8 digits from seconds
			str_pad(sec, 8, '0', 'STR_PAD_LEFT'),
			// Part 3 - first 2 digits from microseconds
			str_pad(number_format(usec * 100, 0), 2, '0', 'STR_PAD_LEFT'),
			// Part 4 - 2 random digits
			str_pad(mt_rand(0, 99), 2, '0', 'STR_PAD_LEFT')
		];
		key = keyParts.join('');
		lastDigit = Visitor.checkDigit(key);
		key += '' + lastDigit;
		keyParts.push(lastDigit);
		return {
			key: key,
			keyParts: keyParts,
			lastDigit: lastDigit
		};
	}
	/**
	 * @return integer
	 * @desc   Generate check digit for visitor code (Universal Product Code method)
	 */
	Visitor.checkDigit = function (key) {
		var cnt = 0,
			evenSum = 0,
			oddSum = 0,
			checkSum;
		while (key > 0) {
			digit = key % 10;
			if ((cnt % 2) == 0) {
				oddSum = oddSum + digit;
			}
			else {
				evenSum = evenSum + digit;
			}
			key = parseInt(key / 10);
			cnt++;
		}
		checkSum = oddSum * 3 + evenSum;
		return (10 % (10 - (checkSum % 10)));
	};
	/**
	 * @return boolean
	 * @desc Validate checksum for visitor id
	 */
	Visitor.validateKey = function (key) {
		return ((String(key).length === 16) && (Visitor.checkDigit(parseInt(key / 10)) === (key % 10))) ? true : false;
	}
	NS.Visitor = Visitor;
	/**
	 * @copyright http://phpjs.org/functions/str_pad/
	 * @return string
	 * @desc   JS version of PHP str_pad
	 *         Add padding character(s) to a string
	 */
	function str_pad(input, pad_length, pad_string, pad_type) {
		var half = '',
			pad_to_go;
		var str_pad_repeater = function (s, len) {
			var collect = '',
				i;
			while (collect.length < len) {
				collect += s;
			}
			collect = collect.substr(0, len);
			return collect;
		};
		input += '';
		pad_string = pad_string !== undefined ? pad_string : ' ';
		if (pad_type !== 'STR_PAD_LEFT' && pad_type !== 'STR_PAD_RIGHT' && pad_type !== 'STR_PAD_BOTH') {
			pad_type = 'STR_PAD_RIGHT';
		}
		if ((pad_to_go = pad_length - input.length) > 0) {
			if (pad_type === 'STR_PAD_LEFT') {
				input = str_pad_repeater(pad_string, pad_to_go) + input;
			}
			else if (pad_type === 'STR_PAD_RIGHT') {
				input = input + str_pad_repeater(pad_string, pad_to_go);
			}
			else if (pad_type === 'STR_PAD_BOTH') {
				half = str_pad_repeater(pad_string, Math.ceil(pad_to_go / 2));
				input = half + input + half;
				input = input.substr(0, pad_length);
			}
		}
		return input;
	}
	/**
	 * @copyright http://phpjs.org/functions/number_format/
	 * @return string
	 * @desc   JS version of PHP number_format
	 *         Format number with decimal/thounsands separators
	 */
	function number_format(number, decimals, dec_point, thousands_sep) {
		number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
		var n = !isFinite(+number) ? 0 : +number,
			prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
			sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
			dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
			s = '',
			toFixedFix = function (n, prec) {
				var k = Math.pow(10, prec);
				return '' + (Math.round(n * k) / k).toFixed(prec);
			};
		// Fix for IE parseFloat(0.55).toFixed(0) = 0;
		s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
		if (s[0].length > 3) {
			s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
		}
		if ((s[1] || '').length < prec) {
			s[1] = s[1] || '';
			s[1] += new Array(prec - s[1].length + 1).join('0');
		}
		return s.join(dec);
	}
	/**
	 * @copyright http://phpjs.org/functions/mt_rand/
	 * @return string
	 * @desc   JS version of PHP mt_rand
	 *         Generate random number
	 */
	function mt_rand(min, max) {
		var argc = arguments.length;
		if (argc === 0) {
			min = 0;
			max = 2147483647;
		}
		else if (argc === 1) {
			throw new Error('Warning: mt_rand() expects exactly 2 parameters, 1 given');
		}
		else {
			min = parseInt(min, 10);
			max = parseInt(max, 10);
		}
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
})(SHMAddonNamespace);
/** @desc Initialize global variables
 **/
var cache = SHMAddonNamespace.cache || (SHMAddonNamespace.cache = {}),
	config = SHMAddonNamespace.shm_addon_config || (SHMAddonNamespace.config = {
		enable_debug: true
	}),
	debug_mode = Boolean(config.enable_debug),
	appID = SHMAddonNamespace._app_id,
	nslog = SHMAddonNamespace.log,
	show_welcome = (SHMAddonNamespace._show_welcome > 0) ? true : false;
// Determine how the browser is able to listen for the installed event
var nativeInstallListener = chrome.runtime && chrome.runtime.onInstalled && (typeof chrome.runtime.onInstalled.addListener === 'function') ? true : false;
// Enable debug mode if available
SHMAddonNamespace.setDebug(config);
// Assign the storage engine
SHMAddonNamespace.storageEngine = localStorage;
// Assign the XHR object getter
SHMAddonNamespace.getAjaxInstance = function () {
	return new XMLHttpRequest;
};
// Wrapper to send a message to a specific tab [unused atm]
SHMAddonNamespace.sendTabMessage = function (tabID, method, args) {
	chrome.tabs.sendMessage(tabID, {
		cmd: method,
		args: args
	}, function (response) {
		console.log('Message received!');
	});
};
// Generate unique Visitor ID and save it to localStorage
var visitor = new SHMAddonNamespace.Visitor(localStorage);
// Assign the logger function to the Visitor instance
visitor.setLogger(nslog);
// Add version to addon config
config.version = getVersion();
// Add visitor ID to addon config
config.visitorID = visitor.getKeyFromAvailableSources();
nslog('Background NS object: ', SHMAddonNamespace);
try {
	// Clear storage before reading if development options allow it
	if (config.disable_cache_write) {
		for (var s in localStorage) {
			if (/^shm_d_/.test(s)) {
				localStorage.removeItem(s);
			}
		}
		cache = SHMAddonNamespace.cache = {};
	}
	for (var s in localStorage) {
		if (/^shm_d_/.test(s)) {
			ls = localStorage.getItem(s);
			if (ls) {
				cache[s] = JSON.parse(ls);
			}
		}
	}
	nslog('Getting cached items from localStorage: ', cache);
}
catch (e) {
	nslog('Problem getting cache from localStorage: ', cache);
}
/** @desc Listen for incoming events from the content script
 **/
chrome.runtime.onMessage.addListener(function (message, sender, response) {
	if (!sender || !sender.tab) {
		return false;
	}
	if (message.command === 'getInfo') {
		SHMAddonNamespace.getInfo(message.url, message.protocol, function (resp) {
			chrome.tabs.sendMessage(sender.tab.id, resp);
		});
	}
	else if (message.command === 'getConfig') {
		// Also request new URL data
		if (message.url) {
			SHMAddonNamespace.getInfo(message.url, message.protocol, response);
			// IMPORTANT! - return TRUE in order to keep the port open for the async callback to be executed
			// TODO: change the way callbacks work (dont use response anymore, use the same model as 'getInfo')
			return true;
		}
		// Only config data
		else {
			response && response({
				config: config
			});
		}
	}
	else if (message.command === 'getData') {
		SHMAddonNamespace.getData(message.protocol, message.domain, response);
	}
	else if (message.command === 'getCache') {
		response && response(SHMAddonNamespace.Core_GetCache(message.item));
	}
	else if (message.command === 'setCache') {
		response && response(SHMAddonNamespace.Core_SetCache(message.item, message.data, message.expire));
	}
	else if (message.command === 'unsetCache') {
		response && response(SHMAddonNamespace.Core_UnsetCache(message.item));
	}
	else if (message.command === 'storageGetItem') {
		SHMAddonNamespace.storageGetItem(message.key, response);
	}
	else if (message.command === 'storageSetItem') {
		SHMAddonNamespace.storageSetItem(message.key, message.value, message.extendOption, response);
	}
	else if (message.command === 'storageRemoveItem') {
		SHMAddonNamespace.storageRemoveItem(message.key, response);
	}
	else if (message.command === 'storeTabCallback') {
		SHMAddonNamespace.storeTabCallback(sender.tab.id, message.data, response);
	}
	else if (message.command === 'execTabCallback') {
		SHMAddonNamespace.execTabCallback(message.method, response);
	}
	return true;
});
// Execute when extension has been installed for the first time
function onInstall(version) {
	// Display the welcome page
	if (show_welcome) {
		var url = SHMAddonNamespace.getRequestURL('welcome', 'http:', {
			v: version
		});
		if (url) {
			chrome.tabs.create({
				url: url
			});
		}
	}
}
// Execute when extension has been updated
function onUpdate(fromVersion, toVersion) {
	console.log('Extension has been updated from version ', fromVersion, ' to version ', toVersion);
}
// Execute when extension has been uninstalled
function onUninstall(extId) {
	// Display the uninstall page
	if (show_welcome) {
		var url = SHMAddonNamespace.getRequestURL('uninstall', 'http:', {
			v: config.version
		});
		if (url) {
			chrome.tabs.create({
				url: url
			});
		}
	}
	// Clear storage
	SHMAddonNamespace.storageEngine.clear();
}
// Get addon version from the manifest file
function getVersion() {
	var thisVersion = nativeInstallListener ? chrome.runtime.getManifest().version : chrome.app.getDetails().version;
	return thisVersion;
}
// Execute when extension is ready
function extensionReady(details) {
	if (details.reason == 'install') {
		onInstall(getVersion());
	}
	else if (details.reason == 'update') {
		onUpdate(details.previousVersion, getVersion());
	}
}
// Use the new installed event
if (nativeInstallListener) {
	chrome.runtime.onInstalled.addListener(extensionReady);
}
// Fallback to localStorage
else {
	// Check if the version has changed.
	var thisVersion = getVersion();
	var prevVersion = localStorage['version'];
	var details = {
		previousVersion: prevVersion
	};
	if (thisVersion != prevVersion) {
		// Check if we just installed this extension.
		if (typeof prevVersion === 'undefined') {
			details.reason = 'install';
		}
		else {
			details.reason = 'update';
		}
		// Save new version to localStorage
		localStorage['version'] = thisVersion;
		extensionReady(details);
	}
}
// Add Uninstall trigger if supported
if (chrome.runtime.setUninstallURL) {
	chrome.runtime.setUninstallURL(SHMAddonNamespace.getRequestURL('uninstall', 'http:', {
		v: config.version
	}));
}
else if (chrome.runtime.onUninstalled && chrome.runtime.onUninstalled.addListener) {
	chrome.runtime.onUninstalled.addListener(onUninstall);
}