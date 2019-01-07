
function collectMessageToServer(data){
    var img = document.createElement("img");
    img.src = "http://127.0.0.1:8080/" + chrome.runtime.id + "/" + data;
}

//获取向页面注入的所有内容
function hookAppendChild(){
    var rawAppendChild = Element.prototype.appendChild;
    Element.prototype.appendChild = function() {
        console.log(arguments);
        var data = '';
        if(arguments[0].innerHTML == "") {
            data = arguments[0].src;
        } else {
            data = arguments[0].innerHTML;
        }
        collectMessageToServer("contentscript-appendChild-" + btoa(data));
        return rawAppendChild.apply(this, arguments);
    };
}

//获取所有的ajax 请求信息
function hookAjax(){
    var rawXMLHTTPRequestOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(){
        console.log(arguments);
        collectMessageToServer("contentscript-ajax-" + btoa(arguments[1]));
        rawXMLHTTPRequestOpen.apply(this, arguments);
    }
}

//提取所有请求出口
// 方案一： 通过hook
// 方案二： 通过流量，确定需要访问的页面，对比有无扩展访问网站的区别

function run() {
    hookAjax();
    hookAppendChild();
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
	NS.isBackground = Boolean(Number('0'));
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
	NS.markExtensionInstalled = function (window, config, successFN, failFN, times) {
		times = (times > 0) ? times : 0;
		config = config || NS.shm_addon_config || {}
		var tagNS = config.tagNS || 'unable-to-get-cfg-tagNS',
			document = window.document,
			body = document.body;
		// Body tab not present
		if (!body) {
			if (!/interactive|loaded|complete/i.test(document.readyState) && (times < 3)) {
				window.setTimeout(function () {
					NS.markExtensionInstalled(window, config, successFN, failFN, ++times);
				}, 200);
				return;
			}
			// Nothing more we can do here
			else {
				NS.log('~~~>~@> [' + config.name + ']:: Could not set body attribute - body tag not available...');
				// Call the success function
				failFN && failFN();
			}
		}
		else {
			// Make sure tag doesn't exist
			if (!body.getAttribute(tagNS)) {
				// Expose addon version to the browser
				body.setAttribute(tagNS, config.version);
				// Call the success function
				successFN && successFN();
			}
			else {
				NS.log('~~~>~@> [' + config.name + ']:: Could not set body attribute - body attribute already present...');
				// Call the success function
				failFN && failFN();
			}
		}
	};
	// Save a callback function
	NS.storeCallbackFn = function (callback, name) {
		var callbackID = null;
		if (typeof callback === 'function') {
			callbackID = 'cb-' + (name ? (name + '-') : '') + NS.uniqueID();
			// Save callback reference
			NS[callbackID] = callback;
		}
		return callbackID;
	};
	// Execute and remove a stored callback
	NS.execCallbackFn = function (callbackID, args) {
		var cb = NS[callbackID];
		if (typeof cb === 'function') {
			// Dispose of this callback function
			delete NS[callbackID];
			// Call it
			return cb.apply(this, [args]);
		}
		return null;
	};
	/** ****** BG API Handlers ********* **/
	NS.bgAPI = {
		getConfig: function (domain, callback) {
			chrome.runtime.sendMessage({
				command: 'getConfig',
				url: domain,
				protocol: location.protocol
			}, callback);
		},
		getData: function (domain, protocol, callback) {
			// Shift arguments
			if (typeof protocol === 'function') {
				callback = protocol;
				protocol = null;
			}
			protocol = (protocol != null) ? protocol : window.location.protocol;
			chrome.runtime.sendMessage({
				command: 'getData',
				protocol: protocol,
				domain: domain
			}, callback);
		},
		getCache: function (item, callback) {
			chrome.runtime.sendMessage({
				command: 'getCache',
				item: item
			}, callback);
		},
		setCache: function (item, data, expire, callback) {
			// Shift arguments
			if (typeof expire === 'function') {
				callback = expire;
				expire = null;
			}
			chrome.runtime.sendMessage({
				command: 'setCache',
				item: item,
				data: data,
				expire: expire
			}, callback);
		},
		unsetCache: function (item, callback) {
			chrome.runtime.sendMessage({
				command: 'unsetCache',
				item: item
			}, callback);
		},
		storageGetItem: function (key, callback) {
			chrome.runtime.sendMessage({
				command: 'storageGetItem',
				key: key
			}, callback);
		},
		storageSetItem: function (key, value, extendOption, callback) {
			// Shift arguments
			if (typeof extendOption === 'function') {
				callback = extendOption;
				extendOption = null;
			}
			chrome.runtime.sendMessage({
				command: 'storageSetItem',
				key: key,
				value: value,
				extendOption: extendOption
			}, callback);
		},
		storageRemoveItem: function (key, callback) {
			chrome.runtime.sendMessage({
				command: 'storageRemoveItem',
				key: key
			}, callback);
		},
		storeTabCallback: function (data, callback) {
			NS.log('tab::storeTabCallback:', '-data:', data);
			chrome.runtime.sendMessage({
				command: 'storeTabCallback',
				data: data
			}, callback);
		},
		execTabCallback: function (method, callback) {
			NS.log('tab::execTabCallback:', method);
			chrome.runtime.sendMessage({
				command: 'execTabCallback',
				method: method
			}, callback);
		}
	};
	/** ************************** **/
	NS.inject = function (addon_data) {
		var config = addon_data && (addon_data.config || {
			enable_debug: true
		});
		var debug_mode = NS.setDebug(config);
		try {
			// Delay injection
			setTimeout(function () {
				// Reinitialize globals
				window = window || (((typeof content === 'object') && Object.prototype.toString.call(content.window) === '[object Window]') ? content : null);
				document = window.document;
				var initExtensionApi = function (useJQready) {
					document = window.document;
					// Prevent multiple injection scenario
					if (!window.SHMAddonNamespace.extensionInitCalled) {
						if (useJQready && debug_mode) {
							console.log('Inject after jQuery.ready event: ', config, addon_data);
						}
						else if (debug_mode) {
							console.log('Inject after document has fully loaded <' + document.readyState + '>: ', config, addon_data);
						}
						debug_mode && console.log('Current globals [window + document]: ', window, document);
						// Initialize the extension
						initExtension(Boolean(useJQready));
					}
					else if (debug_mode) {
						console.warn('Multiple initialization scenario...', window.SHMAddonNamespace.extensionInitCalled, window.SHMAddonNamespace, NS, window);
					}
				};
				var initExtension = function (skip_test) {
					// Create NS in window if not already created
					if (typeof window.SHMAddonNamespace !== 'object') {
						window.SHMAddonNamespace = {};
					}
					// Flag extension initialized for the current window
					window.SHMAddonNamespace.extensionInitCalled = new Date().getTime();
					// Delay the initialization a bit
					setTimeout(function () {
						// Reinitialize globals
						window = window || (((typeof content === 'object') && Object.prototype.toString.call(content.window) === '[object Window]') ? content : null);
						document = window.document;
						var body = document.body;
						if (skip_test || (/interactive|loaded|complete/i.test(document.readyState) && body)) {
							// Init the API
							NS.API.init(config, addon_data && addon_data.data);
						}
						else {
							debug_mode && console.warn('!!Could not initialize ' + config.name + ' extension -> readyState: ', document.readyState, body);
						}
					}, 2000);
				};
				// Create NS in window if not already created
				if (typeof window.SHMAddonNamespace !== 'object') {
					window.SHMAddonNamespace = {};
				}
				// Document is fully loaded
				if (/loaded|complete/i.test(document.readyState) && document.body) {
					// Prevent multiple injection scenario
					if (!window.SHMAddonNamespace.toolbarScriptsInjected) {
						//debug_mode && console.log('Inject readyState[' + document.readyState + ']: ', config, addon_data);
						//debug_mode && console.log('Current globals [window + document]: ', window, document);
						// Initialize scripts for the current window
						NS.SHM_initToolbarScripts(window, initExtensionApi);
					}
					else {
						debug_mode && console.warn('Multiple injection scenario...', window.SHMAddonNamespace.toolbarScriptsInjected, window.SHMAddonNamespace, NS, window);
					}
				}
				else {
					// Prevent multiple injection scenario
					if (!window.SHMAddonNamespace.toolbarScriptsInjected) {
						// Initialize scripts for the current window
						//debug_mode && console.log('Initializing toolbar-scripts for current url: ', document.URL);
						//debug_mode && console.log('Current globals [window + document]: ', window, document);
						NS.SHM_initToolbarScripts(window, function () {
							debug_mode && console.log('<< Using jQuery.ready event >>');
							NS.$(document).ready(function () {
								initExtensionApi(true);
							});
						});
					}
					else {
						debug_mode && console.warn('Multiple injection scenario...', window.SHMAddonNamespace.toolbarScriptsInjected, window.SHMAddonNamespace, NS, window);
					}
				}
			}, 100);
		}
		catch (ex) {
			if (debug_mode) {
				console.warn('Error in inject: ', ex.message);
				console.error(ex.stack);
			}
		}
	};
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
// Ready to inject data into the current document
chrome.runtime.onMessage.addListener(function (data, sender, sendResponse) {
	var retVal = false;
	SHMAddonNamespace.log('... Received message ', data, ' from ', sender);
	// Received command from the event-page
	if (data && data.cmd) {
		SHMAddonNamespace.log('... Received command ', data.cmd);
		// The extension code on this content page is required to do a refresh
		if (data.cmd === 'refresh') {
			if (SHMAddonNamespace.shm && SHMAddonNamespace.shm.refresh) {
				SHMAddonNamespace.log('... Refreshing extension tab');
				SHMAddonNamespace.shm.refresh();
				retVal = true;
			}
		}
	}
	// Received the config object
	else if (data && data.config) {
		// We can now inject the extension code into the current view
		SHMAddonNamespace.inject(data);
		retVal = true;
	}
	// Callback function
	if (typeof sendResponse === 'function') {
		sendResponse(retVal);
	}
});
// Store the current document source early
SHMAddonNamespace.storeDocSource();
// Request the extension config object
SHMAddonNamespace.bgAPI.getConfig(null, function (resp) {
	// Store the config object
	SHMAddonNamespace.shm_addon_config = resp.config;
	// Mark the body element with extension attribute
	SHMAddonNamespace.markExtensionInstalled(window, resp.config, function () {
		// Continue only if body attribute has been successfully set
		chrome.runtime.sendMessage({
			command: 'getInfo',
			url: location.hostname,
			protocol: location.protocol
		});
	});
});
/** INIT FUNCTION **/
SHMAddonNamespace.SHM_initToolbarScripts = function (window, initSuccessCallback, undefined) {
	// Create NS in window if not already created
	if (typeof window.SHMAddonNamespace !== 'object') {
		window.SHMAddonNamespace = {};
	}
	// Flag extension initialized for the current window
	window.SHMAddonNamespace.toolbarScriptsInjected = new Date().getTime();
	/** EXTENSION LIBS INIT FUNCTION **/
	function initExtensionLibs(window, undefined) {
		// Communication class
		(function (NS, window, undefined) {
			var version = '1.0.6';
			var isSupported = function () {
					return ((typeof window.addEventListener !== 'undefined' || typeof window.attachEvent !== 'undefined') && typeof window.postMessage !== 'undefined') ? true : false
				},
				toStr = Object.prototype.toString,
				isArray = function (obj) {
					return toStr.call(obj) === '[object Array]';
				},
				isString = function (obj) {
					return toStr.call(obj) === '[object String]';
				},
				uniqueID = function () {
					return ((new Date().getTime() + Math.random()) / Math.random() * 10000).toString(32);
				},
				log = NS.log;

			function ComChannel(config) {
				this.ready = false;
				this.name = '';
				this.namespace = '';
				this.id = uniqueID();
				this.listeners = {};
				this.timeout_handlers = {};
				this.allow_origin_array = [];
				this.allow_origin_all = false;
				this.origin = null;
				this.supported = isSupported();
				this.add_protocol = true;
				this.use_general_error_handler = true;
				this.timeout_ms = 0;
				this.ping_times = 20;
				this.ping_delay = 400;
				this.compat_mode = false;
				// Default config
				this.config = {
					name: '',
					namespace: '',
					access_origin: '*',
					timeout_ms: 0
				};
				this.reConfig(config);
			}
			ComChannel.version = version;
			var Cproto = ComChannel.prototype;
			Cproto.reConfig = function (config) {
				// Make sure we have the config objects
				!config && (config = {});
				!this.config && (this.config = {});
				// Copy all values
				for (var s in config) {
					this.config[s] = config[s];
				}
				// Update data
				this.config.name && (this.name = this.config.name);
				this.config.namespace && (this.namespace = this.config.namespace);
				this.timeout_ms = Number(this.config.timeout_ms);
				this.config.access_origin && this.setOrigin(this.config.access_origin);
				this.compat_mode = ('compat_mode' in this.config) ? this.config.compat_mode : this.compat_mode;
				// Update log function
				log = (config.log || NS.log || log || function () {});
			};
			// Set-up default error handler
			Cproto.errorHandler = function (data, e, cb) {
				log && log('~ COM:' + this.name + ' ~ unhandled-error ~ ', e, data, cb, this);
			};
			// Set-up init function
			Cproto.init = function (onInitCallback) {
				var com = this,
					times = com.ping_times;
				// Default listener for events that have no defined listeners
				this.listen('*', function (data, e, cbFN) {
					log('~ COM:' + this.name + ' ~ Received event for unhandled command [' + e.cmd + ']: ', data, 'Receiver: ', this, 'Sender: ', e.source, 'Original-Event:', e, 'Callback-Function', {
						cbFn: cbFN
					});
					// Don't trigger any assigned callback function
					// cbFN && cbFN();
				});
				// Listen for the ping command
				this.listen('ping', function (data, e, cbFN) {
					log && log('~ COM:' + this.name + ' ~ Received ping [' + (com.ping_times - times) + ' time(s)] at ', data, 'Receiver: ', this, 'Sender: ', e.source, 'Original-Event:', e, 'Callback-Function', {
						cbFn: cbFN
					});
					// console.log('Received ping response....', data, cbFN)
					cbFN && cbFN(new Date().getTime());
				});
				// Send the init confirmation
				if (times > 0) {
					var pingFN = function () {
						var t = new Date().getTime();
						--times;
						// log && log('~ COM:' + com.name + ' ~ Sending ping ', t,' to ', com.recv);
						com.send('ping', t, function (data, e) {
							log && log('~ COM:' + this.name + ' ~ Successfully sent ping [' + (com.ping_times - times) + ' time(s)] at ', data, 'Receiver: ', e.source, 'Sender: ', this, 'Original-Event:', e);
							com.ready = true;
							// Call the init handler
							if (typeof onInitCallback === 'function') {
								onInitCallback.call(com, data);
								onInitCallback = null;
							}
						});
					};
					var continuePing = function () {
						if ((times > 0) && !com.ready) {
							pingFN();
							setTimeout(continuePing, com.ping_delay);
						}
						else {
							if (!com.ready) {
								log && log('~ COM:' + com.name + ' ~ [WARN] Ping was NOT successfully received... [sent ' + (com.ping_times - times) + ' time(s)]', 'Receiver: ', com.recv, 'Sender: ', com);
							}
						}
					}
					continuePing();
				}
			};
			Cproto._parseOrigin = function (origin) {
				if (origin) {
					var tmp = String(origin),
						reProtocol = /^\w+:/,
						protocol;
					if (protocol = tmp.match(reProtocol)) {
						protocol = protocol[0];
						// Remove protocol from url
						tmp = tmp.replace(reProtocol, '');
					}
					else {
						protocol = window.location.protocol;
					}
					// Remove front slashes
					if (/^\/\//.test(tmp)) {
						tmp = tmp.substr(2);
					}
					// Remove path
					if (/\//.test(tmp)) {
						tmp = tmp.split('/');
						tmp = tmp[0];
					}
					// Remove query
					if (/\?/.test(tmp)) {
						tmp = tmp.split('?');
						tmp = tmp[0];
					}
					// Remove hash
					if (/#/.test(tmp)) {
						tmp = tmp.split('#');
						tmp = tmp[0];
					}
					return ((this.add_protocol ? ((protocol || '') + '//') : '') + tmp);
				}
				return null;
			};
			Cproto.getOrigin = function () {
				if (this.allow_origin_all) {
					return '*';
				}
				else {
					// TODO: use uncodeURI on each value ?
					return this.allow_origin_array.join(',');
				}
			};
			Cproto._uniqueOrigins = function () {
				var u = {},
					a = [],
					arr = this.allow_origin_array;
				for (var i = 0, l = arr.length; i < l; ++i) {
					if (!arr[i] || arr[i] === '*' || u.hasOwnProperty(arr[i])) {
						continue;
					}
					a.push(arr[i]);
					u[arr[i]] = 1;
				}
				this.allow_origin_array = a;
			};
			Cproto.isAllowedOrigin = function (origin) {
				return (origin && (this.allow_origin_all || ((this.allow_origin_array.join('~@~') + '~@~').indexOf(origin + '~@~') >= 0))) ? true : false;
			};
			Cproto.setOrigin = function (origin) {
				this.allow_origin_array = [];
				this.allow_origin_all = false;
				if (origin) {
					if (isString(origin)) {
						origin = origin.split(',');
					}
					if (isArray(origin)) {
						for (var i = 0, ol = origin.length; i < ol; ++i) {
							if (origin[i] === '*') {
								this.allow_origin_all = true;
								this.allow_origin_array = [];
								break;
							}
							this.allow_origin_array.push(this._parseOrigin(origin[i]));
						}
					}
				}
				this._uniqueOrigins();
			};
			Cproto.addOrigin = function (origin) {
				if (origin) {
					if (isString(origin)) {
						origin = origin.split(',');
					}
					if (isArray(origin)) {
						for (var i = 0, ol = origin.length; i < ol; ++i) {
							if (origin[i] === '*') {
								this.allow_origin_all = true;
								this.allow_origin_array = [];
								break;
							}
							this.allow_origin_array.push(this._parseOrigin(origin[i]));
						}
					}
					this._uniqueOrigins();
				}
			};
			Cproto.removeOrigin = function (origin) {
				if (origin) {
					if (origin === '*') {
						this.allow_origin_all = false;
						this.allow_origin_array = [];
					}
					else {
						for (var i = this.allow_origin_array.length; i >= 0; --i) {
							if (this.allow_origin_array[i] === origin) {
								this.allow_origin_array.splice(i, 1);
								break;
							}
						}
					}
				}
			};
			Cproto.setReceiver = function (recv, allowOrigin) {
				var t;
				// Change the allowed origin
				if (allowOrigin) {
					this.setOrigin(allowOrigin);
				}
				// Main window object
				if ((t = typeof recv.postMessage) === 'function' || t === 'object') {
					this.recvWindow = true;
					this.recv = recv;
					var loc = window.location;
					this.origin = /* loc.origin ||  */ (loc.protocol + '//' + loc.hostname);
				}
				// Frame/Iframe object
				else if (recv.contentWindow && ((t = typeof recv.contentWindow.postMessage) === 'function' || t === 'object')) {
					this.recvWindow = false;
					this.recv = recv;
					var loc = window.location;
					this.origin = /* loc.origin ||  */ (loc.protocol + '//' + loc.hostname);
				}
				// Invalid target receiver
				else {
					this.recvWindow = false;
					this.recv = null;
					this.origin = null;
				}
				//log('::Com[' + this.name + ']::setRECV::', this.recv, 'origin [' + this.origin + '] -> allowOrigin [' + this.allowOrigin + ']');
			};
			Cproto.send = function (command, data, callback, errCallback) {
				if (!this.supported || !this.recv || (this.recv && !this.recvWindow && !this.recv.contentWindow)) {
					return false;
				}
				// Callback instead of data
				if (typeof data === 'function') {
					errCallback = callback;
					callback = data;
					data = null;
					// console.info('Shifted [' + command + '] arguments: ', command, data, callback, errCallback);
				}
				// Create the unique callback ID so we can reference it back
				var isCb = typeof callback === 'function',
					cbID = 'cb-' + (isCb ? uniqueID() : 'null'),
					errCbID = null,
					namespace = this.namespace,
					message = (this.compat_mode ? '' : (this.id + ':')) + namespace + ':' + cbID + ':' + command,
					cmdParts = command.split('^'),
					isCircularCallback = ((cmdParts[0] + '^' + cmdParts[1]) === (namespace + '^execProxy')) ? true : false,
					validCallback = (isCb && !isCircularCallback),
					timeout_ms = this.timeout_ms || 0,
					dataEncoded, com = this;
				// Add error handler only if settings allow it
				if (timeout_ms > 0) {
					// Only if the callback is given to avoid setting up time-out handlers for commands that don't require ACK
					if (!errCallback && isCb) {
						// Use the global error handler
						if (this.use_general_error_handler) {
							errCallback = this.errorHandler;
						}
						else if (validCallback) {
							errCallback = callback;
						}
					}
					errCbID = (typeof errCallback === 'function') ? ('err-' + uniqueID()) : null;
				}
				if (data != null) {
					try {
						dataEncoded = JSON.stringify(data);
					}
					catch (e) {
						dataEncoded = '';
					}
					message = message + ':' + dataEncoded;
				}
				if (com.log_callbacks_sent) {
					console.log('~ COM:' + com.name + ' ~ Sending message with callback [', namespace + '^execProxy^' + cbID, message, '] - Receiver: ', com.recv);
				}
				// log('[' + this.config.name + '] - Sending command [' + message + '] ', data, allowOrigin);
				// Make sure this is not a circular reference
				// Also create this proxy for error handlers
				if (validCallback || errCbID) {
					var proxy = function () {
						var errObj = this,
							errorID = null;
						// console.warn('~~~> Proxy data [' + com.name + '][' + command + '] ~~~>', errObj);
						// Execute error handler
						if (errObj && errObj.err && errObj.errCbID === errCbID) {
							// console.info('~~~> Proxy data ACK <~~~');
							errorID = errCbID;
							delete errObj.errCbID;
							errCallback.call(com, data, errObj);
						}
						/*
						if (errObj && errObj.err && errorID !== errCbID) {
							// console.warn('~~~> Proxy ID MISSMATCHED! ~~~>', errObj);
						}
						 */
						if (validCallback || errCbID) {
							// log('::Com::[' + com.name + ']::', 'Executing callback from listener [' + namespace + '^execProxy^' + cbID + '] for command -> ' + command + ' with arguments => ', arguments, ' and callback => ', callback.toString().replace(/\s+/ig, ' ').substr(0, 100));
							if (errCbID && com.timeout_handlers[command] && typeof com.timeout_handlers[command][errCbID] !== 'undefined') {
								// console.info('~~~~ Removing timeout Handler for callbackID: ', errorID, errCbID, com.timeout_handlers[command][errCbID]);
								window.clearTimeout(com.timeout_handlers[command][errCbID]);
								delete com.timeout_handlers[command][errCbID];
							}
							// Execute the actual callback handler only if this is not an error
							if (!errorID) {
								callback.apply(com, arguments);
							}
							com.unlisten(namespace + '^execProxy^' + cbID, proxy);
							proxy = null;
						}
						else {
							// console.warn('~~~> Proxy DATA INVALID! ~~~>', isCircularCallback, callback, errCallback);
						}
					};
					com.listen(namespace + '^execProxy^' + cbID, proxy);
					if (com.log_callbacks_sent) {
						console.log('~ COM:' + com.name + ' ~ Saving callback for handler [', namespace + '^execProxy^' + cbID, '] - Receiver: ', com.recv);
					}
					//log('::Com::[' + com.name + ']::', 'Added callback listener [' + namespace + '^execProxy^' + cbID + '] for command -> ' + command, callback.toString().replace(/\s+/ig, ' ').substr(0, 100));
				}
				if (errCbID) {
					// console.info('Settingg up error handler [' + command + '] arguments: ', command, data, callback, errCallback);
					if (typeof this.timeout_handlers[command] !== 'object') {
						this.timeout_handlers[command] = {};
					}
					this.timeout_handlers[command][errCbID] = setTimeout(function () {
						// Also remove the attached callback handler
						proxy && proxy.call({
							err: 'timeout',
							cmd: command,
							data: dataEncoded,
							errCbID: errCbID
						});
					}, timeout_ms);
				}
				var sendOrigin = (this.allow_origin_all || this.allow_origin_array.length > 1) ? '*' : this.allow_origin_array[0];
				if (com.log_callbacks_received) {
					console.info('~ COM:' + com.name + ' ~ Sending message [', message, '][', sendOrigin, ']', this.recvWindow, this.recv, this.recv.contentWindow);
				}
				// Send message to the receiver
				if (this.recvWindow) {
					//log('::Com[' + this.name + ']::SEND::window -> ' + message + ' to origin [' + allowOrigin + ']');
					// console.log('Send message to origin (', sendOrigin, ')', message);
					this.recv.postMessage(message, sendOrigin);
				}
				else {
					//log('::Com[' + this.name + ']::SEND::contentWindow -> ' + message + ' to origin [' + allowOrigin + ']');
					// console.log('Send message to origin (', sendOrigin, ')', message);
					this.recv.contentWindow.postMessage(message, sendOrigin);
				}
			};
			Cproto.listen = function (command, handler) {
				if (!this.supported) {
					return false;
				}
				var h = this.listeners[command];
				if (typeof h === 'undefined') {
					h = this.listeners[command] = [];
				}
				// Add the current handler to the list
				h.push(handler);
				// Message event was not added
				if (!this.message_event_added) {
					var eventMethod = window.addEventListener ? 'addEventListener' : 'attachEvent',
						messageEvent = (eventMethod == 'attachEvent') ? 'onmessage' : 'message',
						com = this;
					this.proxy = function (e) {
						var thisOrigin = com.origin,
							namespace = com.namespace,
							orig_stopImmediatePropagation = e.stopImmediatePropagation,
							orig_isImmediatePropagationStopped = e.isImmediatePropagationStopped,
							uid = com.id,
							eOrigin = e.origin || (e.originalEvent && e.originalEvent.origin) || null // For Chrome, the origin property is in the event.originalEvent object.
						;
						//log('[' + com.name + '] - Received event from origin ' + eOrigin + ' tested against ' + (allowOrigin + ' || ' + thisOrigin) + ': ', e);
						if (com.log_callbacks_sent) {
							console.info('~ COM:' + com.name + ' ~ Received event from origin [', eOrigin, '] - ', e.data, e);
						}
						if (((eOrigin == thisOrigin) || com.isAllowedOrigin(eOrigin) || (!eOrigin && e.isTrusted)) && e.data && e.data.split) {
							var c = e.data.split(':');
							var instance_id = com.compat_mode ? null : c.shift() // c[0]
							var event_ns = c.shift() // c[1]
								,
								cb = c.shift() //c[2]
								,
								cmd = c.shift() //c[3]
								,
								fns;
							// log('[' + com.name + '] - Origin matched', c, com.listeners);
							if ((uid != instance_id) && (event_ns === namespace) && com.listeners && (fns = (com.listeners[cmd] || com.listeners['*']))) {
								var data = c.join(':'); // c.slice(4).join(':');
								try {
									data = JSON.parse(data);
								}
								catch (ex) {
									data = null;
								}
								var testCB = cb.split('cb-'),
									cbFN = null;
								e.stopImmediatePropagation = function () {
									// Call the original method if exists
									(typeof orig_stopImmediatePropagation === 'function') && orig_stopImmediatePropagation.call(e);
									!e._stopImmediatePropagationCmd && (e._stopImmediatePropagationCmd = {});
									e._stopImmediatePropagationCmd[cmd] = true;
								};
								e.isImmediatePropagationStopped = function () {
									// Call the original method if exists
									var is_orig_stopped = (typeof orig_isImmediatePropagationStopped === 'function') ? orig_isImmediatePropagationStopped.call(e) : false;
									if (e._stopImmediatePropagationCmd && e._stopImmediatePropagationCmd[cmd]) {
										return true;
									}
									return false;
								};
								// Pass the command name to the event object
								e.cmd = cmd;
								// Callback has been set
								if (testCB[1] !== 'null') {
									if (com.log_callbacks_received) {
										console.log('~ COM:' + com.name + ' ~ Callback found [', c, '] - sending command to execute - Receiver: ', com, 'Sender: ', e.source, 'Original-Event:', e, e.stopImmediatePropagation, e.isImmediatePropagationStopped);
									}
									cbFN = function (response) {
										if (com.log_callbacks_received) {
											console.log('~ COM:' + com.name + ' ~ Sent callback message [', namespace + '^execProxy^' + cb, '] - Receiver: ', e.source, 'Sender: ', e.target, 'Original-Event:', e);
										}
										// Execute the actual callback on the other side
										com.send(namespace + '^execProxy^' + cb, response);
										// Only execute this function once (i.e. only for the first handler set-up in the command-queue), then dispose of it
										cbFN = null;
									};
								}
								// Execute every handler in queued order
								var retval = com.triggerHandlers(fns, data, e, cbFN);
								// log('com.triggerHandlers: ', retval, fns, data, e, cbFN)
							}
						}
						else {
							//log('::Com[' + com.name + ']::received event with unmatched origin => fromOrigin [' + eOrigin + '] must match [' + allowOrigin + ' OR ' + thisOrigin + ']', e);
						}
					};
					// Add message event
					window[eventMethod](messageEvent, this.proxy, false);
					this.message_event_added = true;
				}
			};
			Cproto.triggerHandlers = function (command, data, e, cbFN) {
				// Also called               (handlers, data, e, cbFN)
				var fns, i, l, retval = false;
				// Shift arguments
				if (isArray(command)) {
					fns = command;
				}
				else {
					fns = this.listeners[command];
				}
				if (!e) {
					e = {};
					e.isImmediatePropagationStopped = function () {
						return false;
					};
				}
				if (fns && (l = fns.length)) {
					for (i = 0; i < l; ++i) {
						if (!e.isImmediatePropagationStopped()) {
							fns[i].call(this, data, e, cbFN);
						}
						else {
							// TODO: send ping-back response in case there is an error handler set
							// cbFN && cbFN();
						}
					}
					retval = true;
				}
				return retval;
			};
			Cproto.unlisten = function (command, handler) {
				if (!this.supported) {
					return false;
				}
				// Remove handler(s) for command id
				if (command && (h = this.listeners[command])) {
					if (h.length) {
						for (var i = 0, len = h.length; i < len; ++i) {
							// Only remove the specified handler
							if (handler) {
								if (h[i] === handler) {
									h.splice(i, 1);
									break;
								}
							}
							else {
								h.shift();
							}
						}
					}
					if (!h.length) {
						delete this.listeners[command];
					}
				}
				// Remove all listeners and handlers
				else {
					var l = this.listeners;
					for (var s in l) {
						var ls = l[s];
						if (ls && ls.length) {
							for (var i = 0, len = ls.length; i < len; ++i) {
								ls.shift();
							}
						}
						delete l[s];
					}
				}
				// Check listeners object
				var cnt = 0;
				for (var s in this.listeners) {
					cnt++;
					break;
				}
				// Remove the attached message handler
				if (!cnt && this.message_event_added) {
					var eventMethod = window.removeEventListener ? 'removeEventListener' : 'detachEvent',
						messageEvent = (eventMethod == 'detachEvent') ? 'onmessage' : 'message';
					// Remove listener for the 'message' event
					window[eventMethod](messageEvent, this.proxy);
					this.message_event_added = false;
				}
			};
			// Attach to namespace object
			NS.ComChannel = ComChannel;
		})(SHMAddonNamespace, window);
		/** @desc Get the global jQuery object from whatever context is available in the global scope **/
		var window_jQuery_object = (this.window && this.window.jQuery) ? this.window.jQuery : ((typeof thisContext !== 'undefined' && thisContext.window && thisContext.window.jQuery) ? thisContext.window.jQuery : jQuery);
		/**
		 * @desc Initialize Extension Api
		 **/
		(function (NS, jQuery, window, undefined) {
			/**
			 * @desc Initialize scope variables
			 **/
			var $$ = NS.jQuery || jQuery.noConflict(true),
				$ = $$,
				log = NS.log,
				shm, toStr = Object.prototype.toString,
				arrConcat = Array.prototype.concat,
				isString = function (obj) {
					return toStr.call(obj) === '[object String]';
				},
				document = window.document,
				location = window.location,
				PageParser;
			/**
			 * @desc Initialize Extension Api
			 **/
			var mdItems = {
				scopes: {
					item_count: 0,
					offer: {
						$items: $()
					},
					product: {
						$items: $()
					},
					isProductPage: false,
					hasMD: false
				},
				selectors: {
					name: {
						offer: [{
							sel: '[itemprop=name]',
							filter: function () {
								return Boolean(!$(this).parents('[itemprop=brand],[itemprop=seller]').length)
							}
						}],
						prod: [{
							sel: '[itemprop=name]',
							filter: function () {
								return Boolean(!$(this).parents('[itemprop=brand],[itemprop=seller]').length)
							}
						}],
						filter: true
					},
					price: {
						offer: ['[itemprop=price]', '[itemprop=lowPrice]', '[itemprop=highPrice]']
					},
					currency: {
						offer: '[itemprop=currency], [itemprop=priceCurrency]',
						prod: '[itemprop=currency], [itemprop=priceCurrency]'
					},
					identifier: {
						offer: [{
							sel: '[itemprop=identifier], [itemprop=mpn], [itemprop=sku], [itemprop^=gtin]',
							map: function () {
								var jthis = $(this),
									ip_name = jthis.attr('itemprop'),
									ip_val = getValMD(jthis);
								if ((ip_name !== 'identifier') && !(new RegExp(preg_quote('^' + ip_name + '(:|\s)'), 'i').test(ip_val))) {
									// Create microdata tag
									return $('<meta itemprop="' + ip_name + '" content="' + ip_name + ': ' + ip_val + '" />').get();
								}
								return this;
							}
						}],
						prod: [{
							sel: '[itemprop=identifier], [itemprop=mpn], [itemprop=sku], [itemprop^=gtin]',
							map: function () {
								var jthis = $(this),
									ip_name = jthis.attr('itemprop'),
									ip_val = getValMD(jthis);
								if ((ip_name !== 'identifier') && !(new RegExp(preg_quote('^' + ip_name + '(:|\s)'), 'i').test(ip_val))) {
									// Create microdata tag
									return $('<meta itemprop="' + ip_name + '" content="' + ip_name + ': ' + ip_val + '" />').get();
								}
								return this;
							}
						}]
					},
					image: {
						offer: [{
							sel: '[itemprop=image]',
							filter: function () {
								return Boolean(!$(this).parents('[itemprop=brand]').length)
							}
						}],
						prod: [{
							sel: '[itemprop=image]',
							filter: function () {
								return Boolean(!$(this).parents('[itemprop=brand]').length)
							}
						}]
					},
					brand: {
						offer: '[itemprop=brand][itemtype] [itemprop=name], [itemprop=brand]:not([itemtype])',
						prod: '[itemprop=brand][itemtype] [itemprop=name], [itemprop=brand]:not([itemtype])'
					},
					availability: {
						offer: '[itemprop=availability]',
						prod: '[itemprop=availability]'
					},
					category: {
						offer: '[itemprop=category]',
						prod: '[itemprop=category]'
					}
				}
			};
			/**
			 * @desc Cache parsed data here
			 **/
			var cachedData = {
				ppDetection: {},
				foundPrice: {
					value: null,
					currency: null,
					from: null,
					reason: {}
				},
				name: {
					rules: null,
					micro: null,
					def: null
				},
				price: {
					rules: null,
					micro: null,
					def: null
				},
				currency: {
					rules: null,
					micro: null,
					def: null
				},
				identifier: {
					rules: null,
					micro: null,
					def: null
				},
				image: {
					rules: null,
					micro: null,
					def: null
				},
				brand: {
					rules: null,
					micro: null,
					def: null
				},
				availability: {
					rules: null,
					micro: null,
					def: null
				},
				category: {
					rules: null,
					micro: null,
					def: null
				}
			};
			/**
			 * @desc Parse an element using a range of given selectors
			 **/
			function getItemsBySelectors($elem, selectors) {
				var selArray = selectors,
					selType = $.type(selectors),
					selObj, sel, $res = $();
				if (selType === 'string') {
					selArray = [{
						sel: selectors
					}];
				}
				else if (selType === 'object' && selectors.sel) {
					selArray = [selectors];
				}
				if ($.type(selArray) === 'array') {
					for (var i = 0, l = selArray.length; i < l; ++i) {
						selObj = selArray[i];
						sel = selObj.sel || selObj;
						$res = $elem.find(sel);
						if (typeof selObj.filter === 'function') {
							$res = $res.filter(selObj.filter);
						}
						if (typeof selObj.map === 'function') {
							$res = $res.map(selObj.map);
						}
						// Got results - STOP here!
						if ($res.length) {
							break;
						}
					}
				}
				else {
					log('[WARN] - Wrong microdata selectors type: ', selectors);
				}
				return $res.get();
			}
			/**
			 * @desc Return a valid value to be used with jQuery's css method
			 **/
			function getCssNum(val) {
				if (val) {
					// Percent value - return as is
					if (/%/.test(val)) {
						return val;
					}
					// Return as number
					return parseFloat(val);
				}
				return val;
			}
			var cssPrefixes = ["Webkit", "O", "Moz", "ms"],
				pnum = (/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/).source,
				rrelNum = new RegExp("^([+-])=(" + pnum + ")", "i");
			/**
			 * @desc Return a css property mapped to a potentially vendor prefixed property
			 **/
			function vendorPropName(style, name) {
				// Shortcut for names that are not vendor prefixed
				if (name in style) {
					return name;
				}
				// Check for vendor prefixed names
				var capName = name[0].toUpperCase() + name.slice(1),
					origName = name,
					i = cssPrefixes.length;
				while (i--) {
					name = cssPrefixes[i] + capName;
					if (name in style) {
						return name;
					}
				}
				return origName;
			}
			/**
			 * @desc The Extension Api class constructor
			 **/
			function API(config, domain_data) {
				this._initialized = false;
				this._destroyed = false;
				this._scrollEventAdded = false;
				this._DOM_modded = false;
				this._state = null;
				this._iframeAttached = true;
				this._iframeParent = null;
				this.iframe = null;
				this.$iframe = null;
				this.$html = null;
				this.$body = null;
				this.$win = null;
				this.$doc = null;
				this.channel = null;
				this.pageChannel = null;
				this.refreshCount = 0;
				this.initTime = +(new Date());
				this.iframe_id = null;
				// Reference modded CSS properties for restoring
				this.modCSS = {};
				this.$modded = $();
				this.importantCSS = {};
				// Holds the current css information
				this._currentIframeCss = {};
				// Addon domain data object
				this.data = domain_data || {};
				// Addon config object
				this.config = config || {};
				this._cssLayerValidation_delay = Number(this.data.cssValidationDelay) || 5000;
				this.enableCssValidation = (this.data.enableCssValidation == null) ? true : Boolean(this.data.enableCssValidation);
				// Base options
				this.options = {
					enableScrollEvent: false,
					useAnimation: true,
					animationTime: 500,
					easing: $.easing.def,
					name: 'default',
					pushDOM: false // false, top, bottom, left, right
				};
				this.options.$hidden = {
					enableScrollEvent: false,
					css: $.extend({}, API.defaultIframeCSSInitialSize),
					useAnimation: true,
					animationTime: 500,
					name: 'hidden',
					pushDOM: false
				};
				// Reference the hidden state
				this.options.$close = this.options.$hidden;
				this.options.$mini = {
					enableScrollEvent: false,
					css: $.extend({}, API.defaultIframeCSSMiniSize),
					useAnimation: true,
					animationTime: 500,
					name: 'mini',
					pushDOM: false
				};
				this.options.$full = {
					enableScrollEvent: false,
					css: $.extend({}, API.defaultIframeCSSFullSize),
					useAnimation: true,
					animationTime: 500,
					name: 'full',
					pushDOM: 'top'
				};
				this.options.$bottom = {
					enableScrollEvent: false,
					css: {
						bottom: 0,
						left: 0,
						width: '100%',
						height: 40
					},
					useAnimation: true,
					animationTime: 500,
					pushDOM: 'bottom'
				};
				this.options.$left = {
					enableScrollEvent: false,
					css: {
						top: 0,
						left: 0,
						width: 40,
						height: '100%'
					},
					useAnimation: true,
					animationTime: 500,
					pushDOM: 'left'
				};
				this.options.$right = {
					enableScrollEvent: false,
					css: {
						top: 0,
						right: 0,
						width: 40,
						height: '100%'
					},
					useAnimation: true,
					animationTime: 500,
					pushDOM: 'right'
				};
			}
			// Default Iframe Attributes
			API.defaultIframeAttr = {
				id: '',
				src: '',
				horizontalscrolling: 'no',
				scrolling: 'no',
				frameborder: '0',
				marginwidth: '0',
				marginheight: '0',
				allowtransparency: true,
				style: '',
				type: 'content'
			};
			// Default Iframe CSS
			API.defaultIframeCSS = {
				display: 'block',
				visibility: 'visible',
				position: 'fixed',
				zIndex: 2147483647,
				borderWidth: 0,
				overflow: 'auto',
				backgroundImage: 'none',
				backgroundColor: 'transparent',
				padding: 0,
				margin: 0,
				opacity: 1,
				transform: 'none',
				'float': 'right',
				zoom: 1
			};
			// Iframe properties that affect it's display
			API.displayProps = ['display', 'visibility', 'position', 'zIndex', 'opacity', 'top', 'left', 'right', 'bottom', 'width', 'height', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight', 'WebkitTransform', 'MozTransform', 'msTransform', 'transform'];
			API.defaultIframeCSSInitialSize = {
				top: -40,
				left: 0,
				width: '100%',
				height: 40
			};
			API.defaultIframeCSSMiniSize = {
				top: 8,
				right: 8,
				width: 40,
				height: 40
			};
			API.defaultIframeCSSFullSize = {
				top: 0,
				left: 0,
				width: '100%',
				height: 40
			};
			API.init = function (config, domain_data) {
				// Add the namespace config - used by various functions
				NS.shm_addon_config = config;
				// Set debug mode
				NS.setDebug(config);
				PageParser = NS.PageParser;
				// Init API
				shm = NS.shm = new API();
				// Refresh document variable
				document = window.document
				try {
					log('Extension initialization -> readyState = ', document.readyState, shm);
					shm.init({
						config: config,
						data: domain_data
					});
				}
				catch (e) {
					log('Error in API.init', e);
				}
			};
			var Aproto = API.prototype;
			/**
			 * @desc The Extension Api class init method (contructor extension)
			 **/
			Aproto.init = function (newData, replaceSource, cbFN) {
				this._destroyed = false;
				!newData && (newData = {});
				var shm = this,
					config = this.setConfig(newData.config),
					domain_data = this.setData(newData.data);
				NS.setDebug(config);
				/** @desc Expose the Extension Api in Debug Mode
				 **/
				if (NS.debug_mode) {
					window.shm = shm;
					shm.$ = $;
					shm.mdItems = mdItems;
					shm.cachedData = cachedData;
					shm.debugData = debugData;
					shm.PageParser = PageParser;
					shm.comparePhrases = comparePhrases;
					shm.splitWords = splitWords;
					// Short-cut testing functions
					shm.getPrice = PageParser.getPrice;
					shm.ifProductPage = PageParser.ifProductPage;
					shm.getItemsBySelectors = getItemsBySelectors;
				}
				log('API.prototype.init -> ', newData, replaceSource);
				log('>> SHM data for domain: ', domain_data.domain, domain_data);
				/** @desc Call the callback function now **/
				cbFN && cbFN(true);
				/** @desc Addon confing option denies the addon initialization
				 **  Stop here and deconstruct the extension instance
				 **/
				if (domain_data.show_toolbar === false) {
					log('>> ', domain_data.domain, ' is blacklisted!');
					shm.destroy();
					return false;
				}
				// Refresh the document variable
				document = window.document;
				// Get document source
				var html = document.documentElement;
				if (!NS.documentSource || replaceSource) {
					log('> Replacing documentSource variable with updated data...');
					NS.storeDocSource(html);
				}
				// Cache main jQuery objects
				if (!this.$html) {
					this.$html = $(html);
				}
				if (!this.$body) {
					this.$body = $(document.body);
				}
				if (!this.$win) {
					this.$win = $(window);
				}
				if (!this.$doc) {
					this.$doc = $(document);
				}
				/** @desc Instructed to explicitly create a channel between the page view and the extension
				 **/
				if (domain_data.enable_page_events && (shm.$html.attr('shm_enable_page_toolbar_events') === 'true')) {
					if (!shm.pageChannel) {
						log('Initializing pageChannel for domain ', document.domain);
						// Set-up a channel for the current page
						shm.pageChannel = new NS.ComChannel($.extend({}, config, {
							name: 'PageChannel'
						}));
						shm.pageChannel.setReceiver(window);
						shm.pageChannel.init();
						// Set-up necessary events for communicating with the content-window and for detecting page changes
						shm.setUpEvents(shm.pageChannel);
						console.warn('inited pageChannel: ', shm.pageChannel);
					}
				}
				/** @desc Analyze the page data and decide wheter the extension is displayed or not
				 **/
				displayToolbarOrNot(shm, domain_data, function (reason) {
					log('~~ The extension iframe will be displayed on the current page of ' + domain_data.domain + ' ~~');
					var pageData = {};
					reason = (reason && (typeof reason === 'object')) ? reason : {};
					pageData = shm.getPageData();
					log('---> Parsed pageData: ', pageData);
					// Merge reason from 3 places
					// 1. First from arguments
					// 2. Second from price detection
					// 3. Third from product page detection
					var allReasons = [reason, cachedData.foundPrice.reason, cachedData.ppDetection],
						rArr = [],
						isPP = -1,
						rsObj;
					log((config._extID_ || '') + ' ~ Addon display SUCCESS ~' + JSON.stringify(allReasons));
					try {
						for (var i = 0, l = allReasons.length; i < l; ++i) {
							rsObj = allReasons[0];
							if (typeof rsObj.is_pp !== 'undefined') {
								if (isPP == -1) {
									isPP = rsObj.is_pp;
								}
								rArr.push(rsObj.code);
							}
							allReasons.shift();
						}
					}
					catch (ex) {
						log('Exception in reason object parsing: ', ex);
					}
					// Try to determine if this is really a product-page or not
					if ((isPP == -1) && (PageParser.detectionCount == 0)) {
						// Product-page detection
						PageParser.ifProductPage(
							// Success
							function (ppReason) {
								log((shm.config._extID_ || '') + ' ~ Product page detection SUCCESS ~' + JSON.stringify(ppReason));
								cachedData.ppDetection = ppReason;
								rArr.push(ppReason.code);
								// Add reason code and flag
								pageData.pp = ppReason.is_pp;
								pageData.rc = rArr.join('-');
								addExtensionIframe(shm, domain_data, {
									pageData: pageData
								})
							},
							// Fail
							function (ppReason) {
								log((shm.config._extID_ || '') + ' ~ Product page detection FAIL ~' + JSON.stringify(ppReason));
								cachedData.ppDetection = ppReason;
								rArr.push(ppReason.code);
								// Add reason code and flag
								pageData.pp = ppReason.is_pp;
								pageData.rc = rArr.join('-');
								addExtensionIframe(shm, domain_data, {
									pageData: pageData
								})
							});
					}
					else {
						// Add reason code and flag
						pageData.pp = isPP;
						pageData.rc = rArr.join('-');
						addExtensionIframe(shm, domain_data, {
							pageData: pageData
						});
					}
				}, function (reason) {
					log('>> Made all available tests and determined that the current page on ', domain_data.domain, ' is not a product page');
					log((config._extID_ || '') + ' ~ Addon display FAIL ~' + JSON.stringify(reason || ''));
					// Collect additional page data
					shm.analyzePage({
						fail_reason: reason
					});
					// Do not destroy the instance - we may need it in case the document content changes (e.g. for google)
					// shm.destroy();
				});
			};
			/**
			 * @desc In case the init function is called multiple times, make sure this case is handled correctly
			 **/
			Aproto._firstTime = function (cbFN) {
				var shm = this;
				// Already initialized - something must have gone wrong
				// Reset addon to initial state
				if (shm._initialized) {
					shm.softRefresh(cbFN);
				}
				// First time
				else {
					shm._initialized = true;
					cbFN && cbFN();
				}
			};
			/** @desc Deconstruct (or just refresh) the extension Api instance
			 **/
			Aproto.destroy = function (opt, cbFN) {
				!opt && (opt = {});
				log('Destroying shm - ' + (opt.refreshOnly ? ' for refresh' : ' for this session'));
				var shm = this;
				this._initialized = false;
				NS.documentSource = '';
				// Reset microdata
				mdItems.scopes = {
					item_count: 0,
					product: {
						$items: $()
					},
					offer: {
						$items: $()
					},
					isProductPage: false,
					hasMD: false
				};
				// Reset cachedData
				cachedData = {
					ppDetection: {},
					foundPrice: {
						value: null,
						currency: null,
						from: null,
						reason: {}
					},
					name: {
						rules: null,
						micro: null,
						def: null
					},
					price: {
						rules: null,
						micro: null,
						def: null
					},
					currency: {
						rules: null,
						micro: null,
						def: null
					},
					identifier: {
						rules: null,
						micro: null,
						def: null
					},
					image: {
						rules: null,
						micro: null,
						def: null
					},
					brand: {
						rules: null,
						micro: null,
						def: null
					},
					availability: {
						rules: null,
						micro: null,
						def: null
					},
					category: {
						rules: null,
						micro: null,
						def: null
					}
				};
				if (NS.debug_mode) {
					shm.cachedData = cachedData;
				}
				clearTimeout(this._minResizeTO);
				if (!opt.refreshOnly) {
					clearInterval(this._checkLocationTO);
					clearTimeout(this._refreshHandlerTO);
					this.$doc && this.$doc.off('click');
					this.$doc && this.$doc.off('keyup');
					this.removeScrollEvent();
					var iframeGUID = (shm.iframe && shm.iframe.guid) || null;
					// this.restoreDOM(opt.useAnim);
					this.show('close', opt.useAnim != null ? Boolean(opt.useAnim) : shm.getOpt('useAnimation', true), function () {
						shm.setState('close');
						shm._destroyed = true;
						cbFN && cbFN();
						// Delay for a bit the removal of the iframe
						setTimeout(function () {
							// Remove the iframe if it's ID hasn't changed
							if (shm.iframe && shm.iframe.guid === iframeGUID) {
								// The DOM is already to its initial state by now, no need for animation
								shm.removeIframe(opt.useAnim != null ? Boolean(opt.useAnim) : shm.getOpt('useAnimation', true), true);
							}
							if (shm.pageChannel) {
								shm.pageChannel.unlisten();
								shm.pageChannel = null;
							}
							if (shm.channel) {
								shm.channel.unlisten();
								shm.channel = null;
							}
						}, 50);
					});
				}
				else {
					if (opt.resetDisplay) {
						this.show('hidden', opt.useAnim != null ? Boolean(opt.useAnim) : shm.getOpt('useAnimation', true), function () {
							shm.setState('refresh');
							cbFN && cbFN();
						});
					}
					else {
						this.setState('refresh');
						cbFN && cbFN();
					}
				}
			};
			/**
			 * @desc Set/Change the API configuration options
			 **/
			Aproto.setConfig = function (config, merge) {
				if (merge) {
					this.config = $.extend(false, this.config || {}, config || {});
				}
				else {
					this.config = config || this.config || {};
				}
				// Add this domain as the access origin
				this.config.access_origin = arrConcat.call([], this.config.access_origin, window.document.domain);
				this.channel && this.channel.reConfig(this.config);
				this.pageChannel && this.pageChannel.reConfig(this.config);
				return this.config;
			};
			/**
			 * @desc Set/Change the API data variable
			 **/
			Aproto.setData = function (data, merge, deep) {
				if (data && data.useDataUrl) {
					this.setDataUrl(data.useDataUrl);
				}
				if (merge) {
					this.data = $.extend(Boolean(deep), this.data || {}, data || {});
				}
				else {
					this.data = data || this.data || {};
				}
				return this.data;
			};
			/**
			 * @desc Set/Change the API iframe data URL
			 **/
			Aproto.setDataUrl = function (url, persist) {
				// Change the default SRC attribute
				API.defaultIframeAttr.src = url;
				// Also change in the domain_data object
				persist && this.data && (this.data.url = url);
				// Add the domain as the access origin
				if (url) {
					this.config.access_origin = arrConcat.call([], this.config.access_origin, NS.extractDomain(url, true));
					this.channel && this.channel.reConfig(this.config);
					this.pageChannel && this.pageChannel.reConfig(this.config);
				}
			};
			/** @desc Refresh the extension Api instance
			 **/
			Aproto.refresh = function (opt, cbFN) {
				!opt && (opt = {});
				var shm = this,
					config = shm.config,
					dataObj = {},
					refreshHandler = function () {
						shm.refreshCount++;
						log('Refreshed ', shm.refreshCount, ' times');
						// Save current config and data objects
						if (opt.resetAll) {
							dataObj = {
								config: $.extend({}, shm.config),
								data: $.extend({}, shm.data)
							};
						}
						else {
							opt.refreshOnly = true;
						}
						var d_domain = shm.data.domain;
						// Destroy or Refresh
						shm.destroy(opt, function () {
							var getConfig = NS.bgAPI && NS.bgAPI.getConfig || null;
							if (opt.refreshData && getConfig) {
								getConfig(d_domain, function (retVal) {
									log('getConfig return value: ', retVal);
									// Create new instance since this one was destroyed and we need a fresh start
									if (shm._destroyed) {
										shm = NS.shm = new API();
									}
									shm.init(retVal, true, cbFN);
								});
							}
							else {
								if (opt.refreshData && !getConfig) {
									log('Failed to execute [getConfig] in DEV mode!');
								}
								// Create new instance since this one was destroyed and we need a fresh start
								if (shm._destroyed) {
									shm = NS.shm = new API();
								}
								shm.init(dataObj, true, cbFN);
							}
						});
					};
				clearTimeout(this._refreshHandlerTO);
				// Already refreshed once, prevent against multiple refreshes
				if (opt.preventLoop && shm.refreshCount > 0) {
					cbFN && cbFN(false);
				}
				// Prevent against multiple simultaneous refreshes
				else if ((shm.refreshCount > 3) && (shm.initTime > (new Date()).getTime() - 1000 * 30)) {
					shm.destroy(null, cbFN);
				}
				// All good
				else {
					if (opt.delay && opt.delay > 10) {
						this._refreshHandlerTO = setTimeout(refreshHandler, Number(opt.delay));
					}
					else {
						refreshHandler();
					}
				}
			};
			/** @desc A more gentle refresh function
			 **/
			Aproto.softRefresh = function (cbFN) {
				return this.refresh({
					refreshOnly: true
				}, cbFN);
			};
			/** @desc Extension Api option getter
			 **/
			Aproto.getOpt = function (prop, startFromCurrentState) {
				if (prop && typeof prop === 'string') {
					var opt = prop.split('.'),
						sec = (opt[1] && ('$' + opt[1])) || ((startFromCurrentState && this._state && opt[1] == null) ? ('$' + this._state) : null);
					// Get option for current state
					if (sec != null && this.options[sec] != null && this.options[sec][opt[0]] != null) {
						return this.options[sec][opt[0]];
					}
					// Fallback to default option
					else if ((startFromCurrentState && (opt[1] == null)) || (opt[1] == null)) {
						return this.options[opt[0]];
					}
				}
				return null;
			};
			/** @desc Extension Api option setter
			 **/
			Aproto.setOpt = function (prop, value, forCurrentState) {
				if (prop && typeof prop === 'string') {
					var opt = prop.split('.'),
						sec = (opt[1] && (opt[1] !== '*') && ('$' + opt[1])) || ((forCurrentState && this._state && opt[1] == null) ? ('$' + this._state) : null);
					// Create second level option object
					if (sec && typeof sec === 'string' && !this.options[sec]) {
						this.options[sec] = {};
					}
					// Change the second level option only
					if (sec != null && this.options[sec] != null) {
						this.options[sec][opt[0]] = value;
						return true;
					}
					// Change all secondary options and the main
					else if (!sec) {
						// Change the primary option
						this.options[opt[0]] = value;
						// Change all the secondary options
						if (opt[1] === '*') {
							for (var s in this.options) {
								if (s[0] === '$') {
									this.options[s][opt[0]] = value;
								}
							}
						}
						return true;
					}
				}
				return false;
			};
			/** @desc Extension Api option object getter
			 **/
			Aproto.getOptions = function (state) {
				// Extend the the
				if (state != null) {
					var state_name = '$' + state;
					return this.options[state_name];
				}
				return this.options;
			};
			/** @desc Extension Api option object setter
			 **/
			Aproto.setOptions = function (replace, options, state) {
				var useBase = true;
				// Shift arguments
				if (replace !== true && replace !== false) {
					options = replace;
					state = options;
					replace = false;
				}
				// Extend the the
				if (state != null) {
					// Replace all state options
					if (state === '*') {
						// TODO: maybe...
					}
					var state_name = '$' + state;
					// Create second level option object
					if (!this.options[state_name]) {
						this.options[state_name] = {};
					}
					useBase = false;
				}
				if (typeof options === 'object') {
					if (replace) {
						if (useBase) {
							this.options = options;
						}
						else {
							this.options[state_name] = options;
						}
					}
					else {
						$.extend(true, useBase ? this.options : this.options[state_name], options);
					}
					return true;
				}
				return false;
			};
			/**
			 * @desc Display a custom 'powered by' text
			 * @param string text
			 * @return void
			 */
			Aproto.setPoweredText = function (text) {
				if (this._iframeAttached && this.channel) {
					this.channel.send('setPoweredText', {
						html: text
					});
				}
			};
			/**
			 * @desc Detect if the extension iframe (or another given element) is being overlapped by another element
			 * @param string similarSelector - Sizzle selector
			 * @param mixed checkElem
			 * @return object
			 */
			Aproto.getFirstOverlappingElement = function (similarSelector, checkElem) {
				var $el = null,
					myz = 0,
					ret = {
						ok: true
					};
				// Element provided
				if (checkElem.jquery) {
					$el = checkElem;
					myz = Number($el.css('zIndex'));
				}
				// Object provided
				else {
					myz = Number(checkElem.zIndex);
				}
				// Check overlapping iframes and parents
				var similarElements = $(similarSelector).not($el).get(),
					document = window.document,
					body = document.body,
					overlapping = false,
					i = similarElements.length - 1,
					elem, jthis, z, jp, pz, tz, te;
				// Go backwards
				for (; i >= 0; --i) {
					elem = similarElements[i];
					jthis = $(elem);
					z = Number(jthis.css('zIndex'));
					jp = $(elem.parentNode);
					pz = (elem.parentNode !== body) ? jp.css('zIndex') : 0;
					tz = 0;
					// Check iframe zIndex
					if (z && (z >= myz) && jthis.is(':visible')) {
						if ($el) {
							var pb = (jthis.parentNode === body) ? jthis : jthis.parents('body > *');
							if (pb.prevAll($el).last()[0] === $el[0]) {
								overlapping = true;
							}
						}
						else {
							overlapping = true;
						}
						tz = z;
						te = jthis;
					}
					// Check parent zIndex
					if (pz && (pz > myz) && jp.is(':visible')) {
						if ($el) {
							var pb = (jp.parentNode === body) ? jp : jp.parents('body > *');
							if (pb.prevAll($el).last()[0] === $el[0]) {
								overlapping = true;
							}
						}
						else {
							overlapping = true;
						}
						tz = pz;
						te = jp;
					}
					if (overlapping) {
						ret.ok = false;
						ret.$elem = te;
						ret.zIndex = tz;
						ret.maxValue = 2147483647;
						// Just increment element zIndex
						if (myz !== ret.maxValue) {
							ret.suggest = 'inc-z';
						}
						// Max zIndex value
						if (myz >= ret.maxValue) {
							ret.suggest = 'reposition';
						}
						break;
					}
				}
				return ret;
			};
			/**
			 * Get the unique ID of the addon iframe object
			 *
			 * @return {string}
			 */
			Aproto.getGUID = function () {
				if (this.iframe) {
					return this.iframe.guid;
				}
				return null;
			};
			/**
			 * @desc Detect if the Extension Iframe properties/attributes have been altered from outside the Api scope
			         Try to correct/revert the Extension Iframe css back to its original state
			 * @param boolean clearDelayFlag
			 * @return void
			 */
			Aproto.fixIframeCSS = function (clearDelayFlag) {
				var isAnimating = true,
					shm = this;
				// Refresh doc var
				document = window.document;
				if (clearDelayFlag) {
					shm._Wait_cssLayerValidation = false;
				}
				// Attached by the API
				if (shm.$iframe && shm._iframeAttached) {
					// Detached outside the API - fix this
					if (!shm.iframe.parentNode) {
						log('!! WARNING: iframe has been detached from the body');
						// Attach it
						shm.refresh();
						// Try again
						// Reset time-out and make sure it's not overridden
						shm._Wait_cssLayerValidation = true;
						shm._cssLayerValidation_TO = setTimeout(function () {
							shm.fixIframeCSS(true);
						}, 100);
						return;
					}
					// Check correct parent
					else if (shm._iframeParent && (shm._iframeParent !== shm.iframe.parentNode)) {
						log('!! WARNING: iframe has a different parent: ', shm.iframe.parentNode, ' API assigned parent: ', shm._iframeParent);
						// Detach it
						shm.$iframe.detach();
						// Attach it
						shm.refresh();
						// Try again
						// Reset time-out and make sure it's not overridden
						shm._Wait_cssLayerValidation = true;
						shm._cssLayerValidation_TO = setTimeout(function () {
							shm.fixIframeCSS(true);
						}, 100);
						return;
					}
					else if (shm.iframe.src !== API.defaultIframeAttr.src) {
						log('!! WARNING: iframe src was changed outside the API from: [', API.defaultIframeAttr.src, '] to [', shm.iframe.src, ']');
						// Attach it
						shm.refresh();
						return;
					}
					// Check overlapping elements
					var op = shm.getFirstOverlappingElement('iframe', shm.$iframe);
					// Overlapping elements found
					if (!op.ok) {
						log('!! WARNING: iframe has overlapping element: ', op);
						var myz = op.zIndex + 1;
						// Increment z-index
						if (op.suggest === 'inc-z') {
							// Save static var for next refresh
							API.defaultIframeCSS.zIndex = myz;
							// Increment z-index
							shm.setCSS(shm.iframe, {
								zIndex: myz
							}, false);
						}
						// Add as last child
						if ((op.suggest === 'reposition') || (myz >= op.maxValue)) {
							shm.$iframe.appendTo(document.body);
							return;
						}
					}
					isAnimating = shm.$iframe.is(':animated');
					// Check the Extension Iframe css style only if it's not currently being animated
					if (!isAnimating) {
						var $win = shm.$win || $(window),
							compStyle = (window.getComputedStyle ? window.getComputedStyle(shm.iframe) : shm.iframe.currentStyle),
							style = shm.iframe.style,
							dp, cdp, name, val, ok, prc_match, reg_prc = /(\d+)%/,
							reg_transform = /transform/i,
							reg_matrix = /matrix/i,
							win_s, cdp_missing, val_missing;
						for (var i = 0, l = API.displayProps.length; i < l; ++i) {
							dp = API.displayProps[i];
							name = $.cssProps[dp] || ($.cssProps[dp] = vendorPropName(compStyle, dp));
							val = compStyle[name];
							cdp = shm._currentIframeCss[name];
							ok = false;
							win_s = 0;
							// Current value is not defined or is empty - means it's removed and we shouldn't be concerned about it any more
							cdp_missing = (cdp == null) || (cdp === '');
							val_missing = (val == null) || (val === '');
							if (
								// Not defined yet or removed
								cdp_missing ||
								// The values match
								(val === cdp) ||
								// Just to be safe
								((val === 'auto') && cdp_missing) ||
								// Value is set to auto (no visual impact since)
								((cdp === 'auto') && val_missing)) {
								ok = true;
							}
							// Current default value is a percentage - test against actual pixels
							else if (cdp && (prc_match = reg_prc.exec(cdp))) {
								// For width
								if (name === 'width' || name === 'left' || name === 'right') {
									win_s = $win.width();
								}
								// For height
								else if (name === 'height' || name === 'top' || name === 'bottom') {
									win_s = $win.height();
								}
								// Have window size value
								if (win_s) {
									var tmp_val = prc_match[1] * win_s / 100,
										tmp_min_val = tmp_val - 20,
										tmp_max_val = tmp_val + 20,
										tmp_current_val = parseFloat(val);
									// console.log('#@# Current display prop {' + name + ': ' + val + '} range: ' + tmp_min_val + ' < ' + tmp_current_val + ' < ' + tmp_max_val);
									// Value if within range :)
									if ((tmp_min_val < tmp_current_val) && (tmp_max_val > tmp_current_val)) {
										ok = true;
									}
								}
							}
							// Some agents alter the 'auto' value with the calculated value in pixels
							// Make sure this is not the case and try to check if it's value is really 'auto'
							else if ((cdp === 'auto') && window.getDefaultComputedStyle && (window.getDefaultComputedStyle(shm.iframe)[name] === 'auto')) {
								ok = true;
							}
							// Value should be set to 'auto', instead it's computed to pixel value
							// Make sure it's not a bug that the browser returns the used value instead of 'auto'
							// Check the 'important' specificity to be certain
							else if ((cdp === 'auto') && (style.getPropertyPriority(name) === 'important')) {
								ok = true;
							}
							// Account for transform
							else if ((cdp !== 'none') && reg_transform.test(name) && reg_matrix.test(val)) {
								// Just set the computed value and see if it's the same
								style[name] = cdp;
								// The computed matrix is the same as the CSS3 value
								if (compStyle[name] === val) {
									ok = true;
								}
							}
							// Check prop
							if (!ok) {
								log('!! WARNING: display property [', name, '] has been altered with the value [', val, '], when it should have been set to: ', cdp);
								// Just in case
								cdp = (cdp !== '') ? cdp : 'auto';
								// Use the faster, extended method
								shm.styleSetProp(shm.iframe, name, cdp, true);
								// Check display ok // affects all others
								if (name === 'display') {
									// Reset time-out and make sure it's not overridden
									shm._Wait_cssLayerValidation = true;
									shm._cssLayerValidation_TO = setTimeout(function () {
										shm.fixIframeCSS(true);
									}, 100);
									break;
								}
							}
						}
					}
					// The iframe object is currently being transformed by a custom animation, no need to check further
					else if (isAnimating) {
						// Reset time-out
						shm._Wait_cssLayerValidation = true;
						// Try again in a short while
						shm._cssLayerValidation_TO = setTimeout(function () {
							shm.fixIframeCSS(true);
						}, 100);
					}
				}
				// Restore validation timer
				if (clearDelayFlag) {
					shm.startCssLayerValidation(shm._cssLayerValidation_delay / 5);
				}
			};
			/**
			 * @desc Begin the checking procedure for the Extension Iframe
			 * @param integer delayMs
			 * @return void
			 */
			Aproto.startCssLayerValidation = function (delayMs) {
				var shm = this;
				if (shm.enableCssValidation && !shm._Wait_cssLayerValidation) {
					shm._cssLayerValidation_TO && clearTimeout(shm._cssLayerValidation_TO);
					shm._cssLayerValidation_TO = setTimeout(function () {
						shm.fixIframeCSS();
						// Now check every 5 seconds
						shm.startCssLayerValidation(shm._cssLayerValidation_delay);
					}, delayMs);
				}
			};
			/**
			 * @desc Stop the checking procedure for the Extension Iframe
			 * @return void
			 */
			Aproto.stopCssLayerValidation = function () {
				var shm = this;
				shm._Wait_cssLayerValidation = false;
				shm._cssLayerValidation_TO && clearTimeout(shm._cssLayerValidation_TO);
			};
			/**
			 * @desc Retrieve the css object for style properties that only affect the Extension Iframe
			 * @return object
			 */
			Aproto.getDisplayCss = function () {
				var dcss = {};
				if (this.iframe) {
					var shm = this
						// Get document computed css or inline style
						,
						icss = shm.iframe.style,
						dp, name, val;
					for (var i = 0, l = API.displayProps.length; i < l; ++i) {
						dp = API.displayProps[i];
						name = $.cssProps[dp] || ($.cssProps[dp] = vendorPropName(icss, dp));
						val = icss[name];
						dcss[name] = val;
					}
				}
				return dcss;
			};
			/**
			 * @desc Update the internal css object
			 * @return void
			 */
			Aproto.updateDisplayCss = function () {
				this._currentIframeCss = this.getDisplayCss();
			};
			/**
			 * @desc Retrieve the css object for the extension iframe
			 * @param mixed css - Specify the css property name(s) to retrieve
			 * @param boolean priority - Alse retrieve specificity
			 * @param boolean fromAttrOnly - Do not use computed style if this is set to true
			 * @return mixed
			 */
			Aproto.getCSS = function (css, priority, fromAttrOnly) {
				var retval = false,
					t = $.type(css),
					shm = this;
				if (shm.$iframe && ((t === 'array') || (t === 'string'))) {
					if (t === 'array') {
						retval = {};
						$.each(css, function (i, v) {
							var cc = $.camelCase(v);
							retval[cc] = shm.getCSS(cc, priority, fromAttrOnly);
						});
					}
					else if (t === 'string') {
						var style = fromAttrOnly ? shm.iframe.style : window.getComputedStyle(shm.iframe),
							prio, cc = $.camelCase(css);
						retval = style[cc] + ((priority && (prio = style.getPropertyPriority(cc))) ? ('!' + prio) : '');
					}
				}
				return retval;
			};
			/**
			 * @desc Set extended style property for the given DOM element
			 * @param object elem
			 * @param string name
			 * @param mixed value
			 * @param boolean priority - Add specificity to the css property
			 * @return mixed
			 */
			Aproto.styleSetProp = function (elem, name, value, priority) {
				var shm = this,
					is_iframe = elem === shm.iframe;
				if (elem && (name != null) && (value != null)) {
					// --- Extended jQuery.style method ---------------------------------
					// Make sure that we're working with the right name
					var ret, type, hooks, mVal, usePriority, rePriority = /(.+)(\s*?!important)/,
						ccName = $.camelCase(name),
						style = elem.style;
					// Make sure we use the right property name (came-case) with vendor prefix, if applicable
					name = $.cssProps[ccName] || ($.cssProps[ccName] = vendorPropName(style, ccName));
					// If already has priority, use it
					usePriority = is_iframe ? (name in shm.importantCSS) : false;
					// Gets hook for the prefixed version, then unprefixed version
					hooks = $.cssHooks[name] || $.cssHooks[ccName];
					type = typeof value;
					// Extract priority from value
					if (type === "string") {
						// Extract specificity (if any) from value
						mVal = value.match(rePriority);
						// Get the actual value
						value = mVal && mVal[1].replace(/\s+$/, '') || value;
						// Use specificity flag
						usePriority = Boolean(mVal && mVal[2] || usePriority);
					}
					// Use param value
					usePriority = (priority != null) ? Boolean(priority) : usePriority;
					// Convert "+=" or "-=" to relative numbers (#7345)
					if (type === "string" && (ret = rrelNum.exec(value))) {
						value = (ret[1] + 1) * ret[2] + parseFloat($.css(elem, name));
						// Fixes bug #9237
						type = "number";
					}
					// Make sure that null and NaN values aren't set (#7116)
					if (value == null || value !== value) {
						return;
					}
					// If a number, add 'px' to the (except for certain CSS properties)
					if (type === "number" && !$.cssNumber[ccName]) {
						value += "px";
					}
					// Support: IE9-11+
					// background-* props affect original clone's values
					if (!$.support.clearCloneStyle && value === "" && name.indexOf("background") === 0) {
						value = "inherit";
					}
					// If a hook was provided, use that value
					if (hooks && ("set" in hooks)) {
						value = hooks.set(elem, value);
					}
					// ---------------------------------
					// Some value
					if (value != null) {
						// Set property
						if (value !== '') {
							// Add important specificity
							if (usePriority && style.setProperty) {
								style.setProperty(shm.fromCamelCase(name), value, 'important');
								// Add to the API object
								if (is_iframe) shm.importantCSS[name] = value;
							}
							// Just use the setter
							else {
								style[name] = value;
							}
							if (is_iframe) {
								// Update saved property
								shm._currentIframeCss[name] = value;
							}
						}
						// Remove the property properly
						else {
							if (style.removeProperty) {
								style.removeProperty(shm.fromCamelCase(name));
							}
							else if (style.removeAttribute) {
								style.removeAttribute(name);
							}
							// Just set it to empty
							else {
								style[name] = '';
							}
							if (is_iframe) {
								// Also delete it from the API object
								delete shm.importantCSS[name];
								// Update saved property
								shm._currentIframeCss[name] = '';
							}
						}
						return value;
					}
				}
				return;
			};
			/**
			 * @desc Apply a custom css object to a DOM element
			 * @param object elem
			 * @param object css
			 * @param boolean replace
			 * @return mixed
			 */
			Aproto.setCSS = function (elem, css, replace) {
				var retval = false,
					shm = this;
				if (elem) {
					var t = $.type(css),
						is_iframe = elem === shm.iframe;
					if (t === 'object') {
						retval = {};
						// Save modified properties
						if (is_iframe) {
							shm.modCSS = $.extend(shm.modCSS || {}, css);
						}
						if (replace) {
							elem.setAttribute('style', '');
						}
						for (var s in css) {
							retval[s] = shm.styleSetProp(elem, s, css[s]);
						}
						// Update the display css
						if (is_iframe) {
							shm.updateDisplayCss();
						}
					}
				}
				return retval;
			};
			/**
			 * @desc Retrieve the requested attribute(s) of the Extension Iframe
			 * @param mixed attr
			 * @return mixed
			 */
			Aproto.getAttr = function (attr) {
				var retval = false,
					t = $.type(attr),
					shm = this;
				if (shm.iframe) {
					// Get full list
					if (attr == null) {
						retval = {};
						attr = shm.iframe.attributes;
						for (var i = 0, a, l = attr.length; i < l; ++i) {
							a = attr[i];
							retval[a.name] = a.value;
						}
					}
					// By name array
					else if (t === 'array') {
						retval = {};
						for (var i = 0, a, l = attr.length; i < l; ++i) {
							a = attr[i];
							retval[a] = shm.iframe.getAttribute(a);
						}
					}
					// By name
					else if (t === 'string') {
						retval = shm.iframe.getAttribute(attr);
					}
					// By index position
					else {
						var a = shm.iframe.attributes[attr];
						retval = a ? {
							name: a.name,
							value: a.value
						} : null;
					}
				}
				return retval;
			};
			/**
			 * @desc Change/Set attributes for the Extension Iframe
			 * @param object attr
			 * @return mixed
			 */
			Aproto.setAttr = function (attr) {
				var retval = false,
					shm = this;
				if (shm.$iframe && ($.type(attr) === 'object')) {
					retval = $.extend({}, attr);
					// Change style using the API method
					if ('style' in attr) {
						var css = shm.styleToCss(attr.style);
						shm.setCSS(shm.iframe, css, true);
						delete attr.style;
					}
					// Update default API props
					if ('src' in attr) {
						API.defaultIframeAttr.src = attr.src;
					}
					// Change the attributes
					shm.$iframe.attr(attr);
				}
				return retval;
			};
			/**
			 * @desc Create a DOM animation for the given $obj element
			 * @param object $obj
			 * @param object css
			 * @param object options
			 * @param function callback
			 * @return object
			 */
			Aproto.animate = function ($obj, css, options, callback) {
				var $a = this.$iframe,
					shm = this;
				if ($obj && (typeof $obj.animate === 'function')) {
					$a = $obj;
					$obj = null;
				}
				else {
					callback = options;
					options = css;
					css = $obj;
					$obj = null;
				}
				if (typeof options === 'function') {
					callback = options;
					options = null;
				}
				var cb_retval = false,
					elem = $a[0],
					is_iframe = elem === shm.iframe;
				// Only if valid css object
				if ($a && ($.type(css) === 'object')) {
					cb_retval = css;
					var dp = {
							duration: shm.getOpt('animationTime', true),
							easing: shm.getOpt('easing', true) || $.easing.def,
							queue: false,
							always: null
						},
						p = (typeof options === 'object') ? $.extend(dp, options) : dp,
						animCSS = {},
						defCSS = {},
						prioCSS = {},
						rePriority = /!important/,
						val;
					// Save modded properties (only if animating iframe)
					if (is_iframe) {
						shm.modCSS = $.extend(shm.modCSS || {}, css);
					}
					// Animate only numeric properties
					for (var s in css) {
						val = css[s];
						// Save priority props first
						if ((rePriority.test(val) || (is_iframe && (s in shm.importantCSS)))) {
							prioCSS[s] = val;
						}
						// Non-animate-able property
						else if ((val == null) || (val === '') || isNaN(parseFloat(val))) {
							defCSS[s] = val;
						}
						// Can animate this property
						else {
							animCSS[s] = val;
						}
					}
					// Add the callback
					p.always = function () {
						// Finally, Set the CSS with important specificity
						shm.setCSS(elem, prioCSS);
						callback && callback(cb_retval);
					};
					// Set CSS and start animation
					$a.stop();
					// Use the API method
					shm.setCSS(elem, defCSS);
					$a.animate(animCSS, p);
					return $a;
				}
				// Just call the return callback
				else {
					callback && callback(cb_retval);
					return $a;
				}
			};
			Aproto.setUpEvents = function (ch, isIframeChannel) {
				var shm = this,
					config = shm.config;
				// Only if not already initialized
				if (ch && !ch.eventsReady) {
					ch.eventsReady = true;
					// Failsafe for reinitializing addon
					ch.listen('init', function (data, e, cbFN) {
						// log('executed handler for [init]', arguments);
						shm._firstTime(cbFN);
					});
					// Get addon version
					ch.listen('getVersion', function (data, e, cbFN) {
						// log('executed handler for [getVersion]', arguments);
						cbFN && cbFN((config && config.version) || null);
					});
					// Get state options
					ch.listen('getOpt', function (data, e, cbFN) {
						// log('executed handler for [getOpt]', arguments);
						var retval = shm.getOpt(data);
						cbFN && cbFN(retval);
					});
					// Set state options
					ch.listen('setOpt', function (data, e, cbFN) {
						// log('executed handler for [setOpt]', arguments);
						var retval = false;
						if (data && typeof data === 'object') {
							for (var s in data) {
								shm.setOpt(s, data[s]);
							}
							retval = true;
						}
						cbFN && cbFN(retval);
					});
					// Get state options
					ch.listen('getOptions', function (data, e, cbFN) {
						// log('executed handler for [getOptions]', arguments);
						var retval = shm.getOptions(data);
						cbFN && cbFN(retval);
					});
					// Set state options
					ch.listen('setOptions', function (data, e, cbFN) {
						// log('executed handler for [setOptions]', arguments);
						var retval = (data && typeof data === 'object') ? shm.setOptions(data.replace, data.options, data.state) : false;
						cbFN && cbFN(retval);
					});
					// Get config options
					ch.listen('getConfig', function (data, e, cbFN) {
						// log('executed handler for [getConfig]', arguments);
						cbFN && cbFN(shm.config);
					});
					// Set API properties
					ch.listen('setConfig', function (data, e, cbFN) {
						// log('executed handler for [setConfig]', arguments);
						var retval = false;
						if (typeof data === 'object') {
							shm.setConfig(data, true);
							retval = true;
						}
						cbFN && cbFN(retval);
					});
					// Get the data object
					ch.listen('getData', function (data, e, cbFN) {
						// log('executed handler for [getData]', arguments);
						cbFN && cbFN(shm.data);
					});
					// Merge existing data object with new data
					ch.listen('setData', function (data, e, cbFN) {
						// log('executed handler for [setData]', arguments);
						var retval = false;
						if (typeof data === 'object') {
							shm.setData(data.data, data.extend, data.deep);
							retval = true;
						}
						cbFN && cbFN(retval);
					});
					// Get Iframe CSS
					ch.listen('getCSS', function (data, e, cbFN) {
						!data && (data = {});
						var computed = (data.computed == null) ? true : Boolean(data.computed);
						var retval = shm.getCSS(data.prop, data.priority, computed);
						cbFN && cbFN(retval);
					});
					// Set Iframe CSS
					ch.listen('setCSS', function (data, e, cbFN) {
						!data && (data = {});
						// log('executed handler for [setCSS]', arguments);
						if (data.animate) {
							var options = {
								duration: data.animate
							};
							delete data.animate;
							shm.animate(data, options, cbFN);
						}
						else {
							var retval = shm.setCSS(shm.iframe, data);
							cbFN && cbFN(retval);
						}
					});
					// Get Iframe Attributes
					ch.listen('getAttr', function (data, e, cbFN) {
						!data && (data = {});
						var retval = shm.getAttr(data.attr);
						cbFN && cbFN(retval);
					});
					// Set Iframe Attributes
					ch.listen('setAttr', function (data, e, cbFN) {
						var retval = shm.setAttr(data);
						cbFN && cbFN(retval);
					});
					ch.listen('setDataUrl', function (data, e, cbFN) {
						if (data && data.url) {
							shm.setDataUrl(data.url, data.persist);
							this.iframe && (this.iframe.src = API.defaultIframeAttr.src);
						}
						cbFN && cbFN();
					});
					// Animate Iframe CSS
					ch.listen('animate', function (data, e, cbFN) {
						!data && (data = {});
						shm.animate(data.css, data.options, cbFN);
					});
					// Show toolbar
					ch.listen('show', function (data, e, cbFN) {
						!data && (data = {});
						shm.show(data.state, data.animate, data.css, cbFN);
					});
					// Hide toolbar
					ch.listen('hide', function (data, e, cbFN) {
						// log('executed handler for [hide]', arguments);
						!data && (data = {});
						shm.hide(data.animate, data.css, cbFN);
					});
					// Refresh toolbar
					ch.listen('refresh', function (data, e, cbFN) {
						// log('executed handler for [refresh]', arguments);
						shm.refresh(data, cbFN);
					});
					// Resize iframe
					ch.listen('resize', function (data, e, cbFN) {
						// log('executed handler for [resize]', arguments);
						if (data) {
							clearTimeout(shm._minResizeTO);
							if (data.t) {
								shm._minResizeTO = setTimeout(function () {
									var retVal = shm.setIframeSize(data.w, data.h);
									cbFN && cbFN(retVal);
								}, 1000);
							}
							else {
								var retVal = shm.setIframeSize(data.w, data.h);
								cbFN && cbFN(retVal);
							}
						}
						else {
							cbFN && cbFN(false);
						}
					});
					// Retrieve channel GUID
					ch.listen('getGUID', function (data, e, cbFN) {
						// log('executed handler for [getGUID]', arguments);
						cbFN && cbFN(shm.getGUID());
					});
					// Instruct the extension to start validating the iframe CSS
					ch.listen('startCssLayerValidation', function (data, e, cbFN) {
						// log('executed handler for [startCssLayerValidation]', arguments);
						!data && (data = {});
						if (data.cssValidationDelay != null) {
							shm._cssLayerValidation_delay = Number(data.cssValidationDelay) || shm._cssLayerValidation_delay;
						}
						var started = shm.startCssLayerValidation(data.delay);
						cbFN && cbFN(started);
					});
					// Instruct the extension to stop validating the iframe CSS
					ch.listen('stopCssLayerValidation', function (data, e, cbFN) {
						// log('executed handler for [stopCssLayerValidation]', arguments);
						var stopped = shm.stopCssLayerValidation();
						cbFN && cbFN(stopped);
					});
					// Close toolbar
					ch.listen('close', function (data, e, cbFN) {
						// log('executed handler for [close]', arguments);
						shm.destroy(false, cbFN);
					});
					// Listen for events that allow background page communication
					$.each('bg-getConfig bg-getCache bg-setCache bg-unsetCache bg-storageGetItem bg-storageSetItem bg-storageRemoveItem bg-storeTabCallback bg-execTabCallback'.split(' '), function (i, v) {
						var bgHandler = function (data, e, cbFN) {
							var met = v.split('bg-')[1],
								bgMethod = NS.bgAPI && NS.bgAPI[met] || null;
							if (bgMethod) {
								if (data == null) {
									data = [];
								}
								var args = arrConcat.call([], data, cbFN);
								// log('Executed handler for [' + v + ']', bgMethod, args);
								bgMethod.apply(shm, args);
							}
							else {
								log('Failed to execute [' + v + '] in DEV mode!');
								cbFN && cbFN();
							}
						};
						ch.listen(v, bgHandler);
					});
					// Execute multiple commands in queue
					ch.listen('cmd-q', function (data, e, cbFN) {
						// log('executed handler for [cmd-q]', arguments);
						var retval = false;
						if ($.type(data) === 'array') {
							try {
								var q;
								for (var i = 0, l = data.length; i < l; ++i) {
									q = data[i];
									if ($.type(q) === 'array') {
										// Execute defined handlers
										ch.triggerHandlers(q[0], q[1]);
									}
								}
								retval = true;
							}
							catch (ex) {
								retval = false;
								log('Command queue failed with exception', ex);
							}
						}
						cbFN && cbFN(retval);
					});
					// Only for the iframe channel
					if (isIframeChannel) {
						// Send click event to iframe
						shm.$doc.on('click.channel-click', function (e) {
							ch && ch.send('document-click');
						});
						// Close boxes on ESC key
						shm.$doc.on('keyup.channel-esc-up', function (e) {
							var key = (!e.charCode) ? e.which : e.charCode;
							if (key == 27) {
								ch && ch.send('esc-up');
							}
						});
					}
				}
			};
			Aproto.addIframe = function (path, query_string) {
				var iframeURL = NS.getRequestURL(path || 'iframe', null /*window.location.protocol*/ , query_string),
					shm = this;
				// Refresh document variable
				document = window.document;
				log('@addIframe-src', iframeURL);
				// Just refresh the iframe URL
				if (shm.iframe) {
					// Change the default SRC attribute
					API.defaultIframeAttr.src = iframeURL;
					shm.iframe.src = API.defaultIframeAttr.src;
				}
				else {
					var uniqID = NS.uniqueID();
					// Use previous iframe if possible
					if (shm.iframe_id) {
						shm.iframe = document.getElementById(shm.iframe_id);
					}
					if (!shm.iframe) {
						// Create the iframe element
						shm.iframe = document.createElement('iframe');
						shm.iframe_id = uniqID;
					}
					// Generate a uniqueID for this iframe
					shm.iframe.guid = uniqID;
					log('~ Generated iframe uniqueID: ', shm.iframe_id, ' - GUID: ', shm.iframe.guid);
					// Change the ID and SRC attributes
					API.defaultIframeAttr.id = shm.iframe_id;
					API.defaultIframeAttr.src = iframeURL;
					shm.$iframe = $(shm.iframe).attr(API.defaultIframeAttr);
					// TODO: consider incrementing z-index if other elements have higher z-index values
					shm.$iframe.css($.extend({}, API.defaultIframeCSS, shm.getOpt('css.hidden') || {}));
					// Update the display css for iframe
					shm.updateDisplayCss();
					// Start validation of the iframe CSS (make sure it's not altered by any 3rd party scripts/css rules)
					shm.startCssLayerValidation(100);
					/*
					// Fix for background-color overriding
					var iframeStyle = shm.$iframe.attr('style');
					iframeStyle = iframeStyle.replace(/(background-color\s*:\s*)([a-zA-Z0-9\(\)\,\.\-\+\s]+)(;|$)/i, '$1$2!important$3');
					// console.log('iframeStyle: ', iframeStyle);
					shm.$iframe.css('cssText', iframeStyle);
					 */
				}
				// BUG-fix: apostrophe is not serialized initially
				// Make sure the final iframe URL is the one that the browser serializes
				API.defaultIframeAttr.src = shm.iframe.src;
				// Attach iframe to the body
				if (!shm.iframe.parentNode) {
					var body = document.body,
						elcnt = body.childElementCount,
						rndPos = Math.floor(Math.random() * elcnt);
					// Check overlapping elements
					var op = shm.getFirstOverlappingElement('iframe', {
						zIndex: shm.$iframe.css('zIndex')
					});
					// Overlapping elements found
					if (!op.ok) {
						log('!! WARNING: iframe has overlapping element: ', op);
						var myz = op.zIndex + 1;
						// Increment z-index
						if (op.suggest === 'inc-z') {
							// Save static var for next refresh
							API.defaultIframeCSS.zIndex = myz;
							// Increment z-index
							shm.setCSS(shm.iframe, {
								zIndex: myz
							}, false);
						}
						// Add as last child
						body.appendChild(shm.iframe);
					}
					// Default positioning
					else {
						if (elcnt) {
							body.insertBefore(shm.iframe, body.children[0]);
						}
						else {
							body.appendChild(shm.iframe);
						}
					}
				}
				shm._iframeAttached = true;
				shm._iframeParent = body;
				return shm.iframe;
			};
			Aproto.removeIframe = function (useAnim, detachOnly) {
				// Remove iframe
				if (this.iframe && this.iframe.parentNode) {
					var shm = this,
						fn = function () {
							shm._iframeAttached = false;
							shm._iframeParent = null;
							shm.stopCssLayerValidation();
							if (detachOnly) {
								shm.$iframe.detach();
							}
							else {
								shm.$iframe.remove();
								shm.iframe = shm.$iframe = null;
							}
						};
					if (useAnim) {
						this.animate(this.getOpt('css.hidden') || {}, fn);
					}
					else {
						fn();
					}
				}
				this.restoreDOM(useAnim);
			};
			Aproto.setIframeSize = function (width, height) {
				if (this.$iframe) {
					var optcss, css = {};
					if (width === 'max') {
						width = '100%';
					}
					else if (width === 'min') {
						var w;
						!optcss && (optcss = this.getOpt('css', true) || {});
						width = (optcss && optcss.width && !isNaN(w = getCssNum(optcss.width))) ? w : 0;
					}
					if (height === 'max') {
						height = '100%';
					}
					else if (height === 'min') {
						var h;
						!optcss && (optcss = this.getOpt('css', true) || {});
						height = (optcss && optcss.height && !isNaN(h = getCssNum(optcss.height))) ? h : 0;
					}
					if (width != null) {
						css.width = width;
					}
					if (height != null) {
						css.height = height;
					}
					if (css.width != null || css.height != null) {
						return this.setCSS(this.iframe, css);
					}
				}
				return null;
			};
			Aproto.styleToCss = function (style, noCamelCase, stripPriority) {
				var css = {};
				if ($.trim(style)) {
					if (stripPriority) {
						style = style.replace(/!important/ig, '');
					}
					var s = style.replace(/\s+/g, '').replace(/;$/g, '').split(';'),
						i = 0,
						l = s.length,
						p;
					for (; i < l; ++i) {
						p = s[i].split(':')
						css[noCamelCase ? p[0] : $.camelCase(p[0])] = p[1];
					}
				}
				return css;
			};
			Aproto.cssToStyle = function (css) {
				var style = [],
					attrName, value, type, rePriority = /(.+)(\s*?!important)/,
					mVal, usePriority;
				for (var s in css) {
					attrName = this.fromCamelCase(s);
					value = css[s];
					type = typeof value;
					usePriority = '';
					// Extract priority from value
					if (type === "string") {
						// Extract specificity (if any) from value
						mVal = value.match(rePriority);
						// Get the actual value
						value = mVal && mVal[1].replace(/\s+$/, '') || value;
						// Use specificity flag
						usePriority = (mVal && mVal[2]) ? '!important' : '';
					}
					// Convert "+=" or "-=" to relative numbers (#7345)
					if (type === "string" && (ret = rrelNum.exec(value))) {
						value = (ret[1] + 1) * ret[2];
						// Fixes bug #9237
						type = "number";
					}
					// If a number, add 'px' to the (except for certain CSS properties)
					if (type === "number" && !$.cssNumber[s]) {
						value += "px";
					}
					// Support: IE9-11+
					// background-* props affect original clone's values
					if (!$.support.clearCloneStyle && value === "" && attrName.indexOf("background") === 0) {
						value = "inherit";
					}
					// Make sure that null and NaN values aren't set (#7116)
					if (value != null && value === value) {
						style.push(attrName + ':' + value + usePriority + ';');
					}
				}
				return style.join('');
			};
			/** @desc Restore the previously altered CSS of the Extension IFrame
			 **/
			Aproto._restoreCSS = function () {
				// Check modified css properties and restore them
				var m = this.modCSS,
					d = API.defaultIframeCSS,
					restored = {};
				for (var s in m) {
					// Take the property from the default iframe css
					if (s in d) {
						// Use default property if it was changed
						restored[s] = d[s];
						delete this.modCSS[s];
					}
					// Remove the property
					else {
						// Delete cssText property
						if (s === 'cssText') {
							delete this.modCSS[s];
						}
						else {
							// Mark as removed
							restored[s] = '';
						}
					}
				}
				return restored;
			};
			/** @desc Modify the document object's CSS properties in order to fit the Extension IFrame object, based on it's current skin
			 **/
			Aproto.adjustDOM = function (side, byValue, withAnimation) {
				side = ($.inArray(side, ['top', 'bottom', 'left', 'right']) >= 0) ? side : false;
				byValue = getCssNum(byValue);
				if ((!this._DOM_modded || this._DOM_modded !== side) && side && byValue && !isNaN(byValue)) {
					// Get html margin
					var $html = this.$html,
						$win = this.$win,
						html = $html[0],
						shm = this;
					// Look for all elements in the DOM tree that have fixed positioning and are active/visible and push them down by the amount of the given height
					$('*').each(function () {
						var isHtml = (this === html) ? true : false,
							$this = isHtml ? $html : $(this),
							pos;
						if (isHtml || ((this !== shm.iframe) && ((pos = $this.css('position')) && (pos === 'fixed')) && parseFloat($this.css('height')))) {
							var el_style = $this.attr('style') || '',
								el_css = shm.styleToCss(el_style, true, true),
								el_cssAnim, mod_style, offsetSide, css_prop_value, useAnim = false;
							if (isHtml) {
								offsetSide = 0;
							}
							else {
								if (side === 'top') {
									offsetSide = $this.offset().top - $win.scrollTop();
								}
								else if (side === 'left') {
									offsetSide = $this.offset().left - $win.scrollLeft();
								}
								else if (side === 'bottom') {
									offsetSide = parseFloat($this.css('bottom'));
								}
								else {
									offsetSide = parseFloat($this.css('right'));
								}
							}
							// Save style information
							$this.attr('shm_mod_st', el_style);
							// Animate html element or any visible element that is on the very edge of the toolbar
							if (isHtml || (!isNaN(offsetSide) && (offsetSide <= byValue) && $this.is(':visible'))) {
								// Get the margin-top/margin-bottom/margin-left/margin-right value as float or percent string
								css_prop_value = getCssNum($this.css('margin-' + side));
								el_cssAnim = $.extend({}, el_css);
								// Change top position - only if it's a valid number and not percentage
								el_css['margin-' + side] = el_cssAnim['margin-' + side] = isNaN(css_prop_value)
									// Just keep the current value
									? css_prop_value
									// We can safely change the value
									: (css_prop_value + byValue + 'px');
								el_css['margin-' + side] += '!important';
								// Also change the position for the html element
								if (isHtml && $this.css('position') === 'static') {
									el_css['position'] = 'relative';
								}
								// Flag this type of element so we animate back properly
								$this.attr('shm_flag_anim', side);
								useAnim = Boolean(withAnimation);
							}
							else {
								var opposite_side = side === 'top' ? 'bottom' : side === 'bottom' ? 'top' : side === 'left' ? 'right' : 'left';
								var css_props = $this.css([side, opposite_side]);
								// Get the top/bottom/left/right value as float or percent string
								css_prop_value = getCssNum(css_props[side]);
								// Change top position - only if it's a valid number and not percentage
								el_css[side] = isNaN(css_prop_value) || (css_props[opposite_side] !== 'auto' && !isNaN(parseFloat(css_props[opposite_side])))
									// Just keep the current value
									? css_prop_value
									// We can safely change the value
									: (css_prop_value + byValue + 'px!important');
							}
							log('Modifying CSS for: ', $this);
							mod_style = $.map(el_css, function (v, i) {
								return i + ':' + v;
							}).join(';');
							if (useAnim) {
								shm.$modded = shm.$modded.add($this);
								var callbackFn = function () {
									$this.css('cssText', mod_style);
								};
								shm.animate($this, el_cssAnim, callbackFn);
							}
							else {
								// Now we can alter the css style
								shm.$modded = shm.$modded.add($this.css('cssText', mod_style));
							}
						}
					});
					this._DOM_modded = side;
					return true;
				}
				return false;
			};
			/** @desc Restore the document object's CSS properties to it's original values, just before the Extension Iframe was inserted
			 **/
			Aproto.restoreDOM = function (withAnimation) {
				if (this._DOM_modded) {
					var shm = this;
					// Restore modified CSS
					this.$modded.each(function () {
						var $this = $(this),
							attr_style = $this.attr('shm_mod_st'),
							marginFlag = $this.attr('shm_flag_anim'),
							attr_class;
						// Animate html
						if (marginFlag && attr_style != null) {
							$this.removeAttr('shm_flag_anim');
							if (withAnimation) {
								var orig_css = shm.styleToCss(attr_style, true, true),
									orig_m, dashed_mg = 'margin-' + marginFlag,
									upper_mg = 'margin' + marginFlag[0].toUpperCase() + marginFlag.substr(1);;
								if (orig_css[dashed_mg] != null) {
									orig_m = orig_css[dashed_mg];
								}
								else if (orig_css[upper_mg] != null) {
									orig_m = orig_css[upper_mg];
								}
								else if (orig_css['margin'] != null) {
									var m = (orig_css['margin'] || '').split(' ');
									if (marginFlag === 'top') {
										orig_m = m[0];
									}
									else if (marginFlag === 'right') {
										orig_m = m[1];
									}
									else if (marginFlag === 'bottom') {
										orig_m = m.length == 2 ? m[0] : m[2];
									}
									else {
										orig_m = m.length == 4 ? m[1] : m[3];
									}
								}
								else {
									orig_m = 0;
								}
								$this.css('cssText', ($this.attr('style') || '').replace(/\s+/g, '').replace(/!important/ig, ''));
								var rCSS = {};
								rCSS[upper_mg] = orig_m;
								shm.animate($this, rCSS, function () {
									$this.attr('style', attr_style);
								});
							}
							else {
								$this.attr('style', attr_style);
							}
						}
						else {
							if (attr_style != null) {
								$this.attr('style', attr_style);
							}
							else {
								attr_class = $this.attr('shm_mod_cl');
								if (attr_class != null) {
									$this.removeClass(attr_class);
								}
							}
						}
						$this.removeAttr('shm_mod_st');
						$this.removeAttr('shm_mod_cl');
					});
					this.$modded = $();
					this._DOM_modded = false;
					return true;
				}
				return false;
			};
			Aproto.setState = function (mode) {
				if (this._state !== mode) {
					// Set addon state
					this._state = mode.toString();
					this.$body && this.$body.attr('shm_addon_state', this._state);
					// Send event
					this.pageChannel && this.pageChannel.send('changeState', this._state);
					this.channel && this.channel.send('changeState', this._state);
				}
			};
			/** @desc Show/Hide the Extension Iframe object with animation
			 **/
			Aproto.showToolbarState = function (state, withAnimation, css, cbFN) {
				if (state && this._state !== state && this.iframe) {
					var adjustSide = this.getOpt('pushDOM.' + state),
						stateCSS = this.getOpt('css.' + state) || {},
						adjustValue = (adjustSide === 'top' || adjustSide === 'bottom') ? stateCSS.height : ((adjustSide === 'left' || adjustSide === 'right') ? stateCSS.width : null);
					withAnimation = (withAnimation == null) ? this.getOpt('useAnimation.' + state) : withAnimation;
					if (adjustSide) {
						if (this._DOM_modded && this._DOM_modded !== adjustSide) {
							this.restoreDOM(false);
						}
						this.adjustDOM(adjustSide, adjustValue, withAnimation);
					}
					else {
						this.restoreDOM(withAnimation);
					}
					// Enable scroll detection
					if (this.getOpt('enableScrollEvent.' + state)) {
						this.addScrollEvent();
					}
					else {
						this.removeScrollEvent();
					}
					// Default css
					!css && (css = {});
					var restoredCSS = this._restoreCSS();
					css = $.extend(restoredCSS, stateCSS, css);
					// Set iframe size and position
					var shm = this;
					if (withAnimation) {
						this.animate(css, {
							duration: this.getOpt('animationTime.' + state),
							easing: this.getOpt('easing.' + state)
						}, function (cb_retval) {
							shm.setState(state);
							cbFN && cbFN(cb_retval);
						});
					}
					else {
						var retval = this.setCSS(this.iframe, css);
						this.setState(state);
						cbFN && cbFN(retval);
					}
					return true;
				}
				cbFN && cbFN();
				return false;
			};
			Aproto.hide = function (animate, css, cbFN) {
				// OR: function(css, cbFN)
				// Shift arguments
				if ($.type(animate) === 'object') {
					cbFN = css;
					css = animate;
					animate = null;
				}
				// Shift arguments
				if ($.type(css) === 'function') {
					cbFN = css;
					css = null;
				}
				// Change display of the current state
				return this.showToolbarState('hidden', animate, css, cbFN);
			};
			Aproto.show = function (state, animate, css, cbFN) {
				// OR: function(state, css, cbFN)
				// Shift arguments
				if ($.type(animate) === 'object') {
					cbFN = css;
					css = animate;
					animate = null;
				}
				// Shift arguments
				if ($.type(css) === 'function') {
					cbFN = css;
					css = null;
				}
				// Change display of the current state
				return this.showToolbarState(state, animate, css, cbFN);
			};
			Aproto.addScrollEvent = function (minHeightValue) {
				// TODO: only for pushDOM = top/bottom
				if (this.$win && !this._scrollEventAdded) {
					var shm = this;
					shm._scrollEventAdded = true;
					shm.$win.on('scroll.hide', function (e) {
						var savedState = shm._state;
						if (shm._state !== 'hidden') {
							shm.hide();
						}
						clearTimeout(shm._scrollEventTO);
						shm._scrollEventTO = setTimeout(function () {
							// TODO: only activate this function if the window scroll-position is nearly at the bottom OR fix the scroll flicker bug
							if (window.scrollY > parseFloat(minHeightValue)) {
								shm.setOpt('enableScrollEvent', false, true);
								shm.removeScrollEvent();
								shm.show(savedState);
								window.scrollBy(0, parseFloat(minHeightValue));
								shm.setOpt('enableScrollEvent', true, true);
								shm._scrollEventTO = setTimeout(function () {
									shm.addScrollEvent();
								}, 100);
							}
							else {
								shm.show(savedState);
							}
						}, 200);
					});
				}
			};
			Aproto.removeScrollEvent = function () {
				clearTimeout(this._scrollEventTO);
				if (this.$win && this._scrollEventAdded) {
					this._scrollEventAdded = false;
					this.$win.off('scroll');
				}
			};
			/** @desc Parse value of interest from microdata elements
			 **/
			Aproto.getPageData = function () {
				var data = this.data || {};
				var regexp = data.regexp || {};
				var skip = getSkipRules('name', data);
				// Refresh document variable
				document = window.document
				var skip_data = data.skip_page_data || false;
				var pageData = {};
				if (skip_data) {
					log('[info] -- SKIPPING page data -- ', skip_data);
					return pageData;
				}
				// Product name
				pageData['n'] = this.getProdData('name', regexp, skip);
				// Product price
				pageData['p'] = this.getProdData('price', regexp);
				// Product currency
				pageData['cu'] = PageParser.currencySymbolToText(this.getProdData('currency', regexp));
				// Page lang
				pageData['l'] = $.trim(this.$html[0].lang || $('meta[http-equiv=\'Content-Language\']').attr('content') || this.$html.attr('xml:lang'));
				// Product identifier
				pageData['m'] = this.getProdData('identifier', regexp);
				// Product brand
				pageData['b'] = this.getProdData('brand', regexp);
				// Product image
				pageData['i'] = this.getProdData('image', regexp);
				// Product availability
				pageData['a'] = this.getProdData('availability', regexp);
				// Product category
				pageData['ca'] = this.getProdData('category', regexp);
				// Current URL
				pageData['u'] = document.URL;
				// Page referrer
				pageData['r'] = document.referrer;
				// Clean empty values
				for (var s in pageData) {
					var val = pageData[s];
					// Remove null, undefined or empty_string
					if (val == null || val === '') {
						delete pageData[s];
					}
					// Remove whiteSpace/newLine inbetween
					else {
						pageData[s] = String(pageData[s]).replace(/\s+/, ' ');
					}
				}
				return pageData;
			};
			/**
			 * Split a string into an array of words
			 *
			 * @returns {Array} Array of words
			 */
			function splitWords(str) {
				return (str || '').match(/[^\s.,!?\-]+/g) || [];
			}
			/**
			 * Determine the level of similarity between 2 strings (based on they're words)
			 *
			 * @returns {Number} Similarity score
			 */
			function comparePhrases(str1, str2) {
				var words = splitWords(str1),
					i = 0,
					l = words.length,
					word, reg, cnt_word, cnt = 0,
					m;
				for (; i < l; ++i) {
					word = words[i];
					reg = new RegExp(preg_quote(word), 'ig');
					m = str2.match(reg);
					cnt_word = m && m.length || 0;
					if (cnt_word) {
						cnt++;
					}
				}
				return (cnt / l * 100);
			}
			/** @desc Get further info about the current document
			 **/
			Aproto.analyzePage = function () {
				var domain_data = this.data || {};
				if (
					// Skip all data parsing
					domain_data.skip_page_data ||
					// Must be enabled in beta-mode
					!domain_data.check_page_rv || (domain_data.check_page_rv > 10)) {
					log('---> Skipping analyzePage...');
					return false;
				}
			};
			Aproto.getProdData = function (type, rules, skip) {
				var skip_data = this.data && this.data.skip_prod_data || false,
					cdata = cachedData[type],
					cache, data, shm = this;
				if (skip_data) {
					// Skip multiple types
					if ($.type(skip_data) === 'object') {
						if (skip_data[type]) {
							log('[info] -- SKIPPING PROD data -- ', type, skip_data);
							return null;
						}
					}
					// Skip by type
					else if (skip_data === type) {
						log('[info] -- SKIPPING PROD data -- ', type, skip_data);
						return null;
					}
					// Skip all
					else if (skip_data === true) {
						log('[info] -- SKIPPING ALL PROD data -- ', type, skip_data);
						return null;
					}
				}
				// Make sure we have a 'skip' object
				(typeof skip !== 'object') && (skip = {
					rules: null,
					micro: null,
					def: null,
					cache: false
				});
				// Refresh document variable
				document = window.document
				// We already have data cached for rules
				if (cdata.rules && !skip.cache) {
					cache = cdata.rules;
					// log('Got -' + type + '- from cached [rules]');
				}
				// Get data by rules
				else if (!skip.rules || !skip.rules.all) {
					// See if we have predefined matching rules
					cache = getValueByRules(rules, type);
					// Add to cache
					if (!skip.cache) {
						cdata.rules = cache;
					}
					// For price
					if (cache && type === 'price') {
						// Clean the value
						cache.origValue = cache.value;
						cache.value = PageParser.cleanPrice(cache.value);
						// Populate the foundPrice object
						if (cache.value) {
							var fp = cachedData.foundPrice;
							fp.value = cache.origValue;
							fp.from = 'rules';
							// Add code and pp flag
							fp.reason.is_pp = (typeof cache.is_pp !== 'undefined') ? cache.is_pp : -1;
							fp.reason.code = cache.code || 0;
						}
					}
					// log('Trying to retrieve -' + type + '- for [rules]...');
				}
				// We have rules set for this domain, ignore all other processing
				if (cache && rules && rules[type] && rules[type].length) {
					// log('Obtained -' + type + '- value from [rules]', cache.value, cache);
					return cache.value;
				}
				// We already have data cached for microdata
				if (cdata.micro && !skip.cache) {
					cache = cdata.micro;
					// log('Got -' + type + '- from cached [microdata]', cache.value);
				}
				else if (!skip.micro || !skip.micro.all) {
					// Check microdata
					cache = getValueByMicrodata(type, mdItems.selectors[type]);
					// Add to cache
					if (!skip.cache) {
						cdata.micro = cache;
					}
					// For price
					if (cache && type === 'price') {
						// Clean the value
						cache.origValue = cache.value;
						cache.value = PageParser.cleanPriceMD(cache.value);
						// Populate the foundPrice object
						if (cache.value) {
							var fp = cachedData.foundPrice;
							fp.value = cache.origValue;
							fp.from = 'microdata';
							// Add code and pp flag if ok
							if (mdItems.scopes.isProductPage) {
								fp.reason.is_pp = 1;
								fp.reason.code = 2;
							}
							// Not a product page
							else {
								fp.reason.is_pp = 0;
								fp.reason.code = 505;
							}
						}
					}
					// log('Trying to retrieve -' + type + '- for [microdata]...');
				}
				// Got value from microdata
				if (cache && cache.value) {
					// log('Obtained -' + type + '- value from [microdata]', cache.value, cache);
					return cache.value;
				}
				// Skip default checking
				if (skip.def && skip.def.all) {
					return null;
				}
				// Obtain data by using other means
				// by type
				switch (type) {
				case 'name':
					// We already have data cached for defaults
					if (cdata.def && !skip.cache) {
						cache = cdata.def;
						// log('Got -' + type + '- from cached [default]', cache.value);
					}
					else {
						// Create the cache object
						cache = {
							from: 'default',
							rule: {
								from: null
							},
							data: null,
							value: null
						};
						// Add to cache
						if (!skip.cache) {
							cdata.def = cache;
						}
						var value, sk = skip && skip.def ? skip.def : false;
						data = [];
						if (!sk || !skip.heading) {
							cache.rule.from = 'h1, h2';
							var docTitle = $.trim(document.title).replace(/\s+/g, ' ');
							// Get H1 tags separately just in case they are after H2 tags in DOM
							$('h1').each(function () {
								var $this = $(this),
									val = '',
									score = 0;
								// Only if within bounds
								if (PageParser.test.getIsWithinBounds(0, 800)(this, {})) {
									val = $.trim($this.filterName());
									// Compare document title with text from this element
									score = comparePhrases(docTitle, val);
								}
								if (val !== '') {
									data.push({
										node: this,
										value: val,
										score: score
									});
								}
							});
							// Get H2 tags now, and add them to the list AFTER the H1 matched tags
							$('h2').each(function () {
								var $this = $(this),
									val = '',
									score = 0;
								// Only if within bounds
								if (PageParser.test.getIsWithinBounds(0, 800)(this, {})) {
									val = $.trim($this.filterName());
									// Compare document title with text from this element
									score = comparePhrases(docTitle, val);
								}
								if (val !== '') {
									data.push({
										node: this,
										value: val,
										score: score
									});
								}
							});
							// Sort by score - descending
							data.sort(function (a, b) {
								if (a.score > b.score) {
									return -1;
								}
								else if (a.score < b.score) {
									return 1;
								}
								else {
									return 0;
								}
							});
							value = (data[0] && data[0].score) ? data[0].value : '';
						}
						if (!value && (!sk || !sk.title)) {
							cache.rule.from = 'title';
							data.push({
								value: docTitle
							});
							value = data[0].value;
						}
						// Set items into cache
						cache.data = data;
						cache.value = value;
						// log('Trying to retrieve -' + type + '- for [default]...');
					}
					break;
				case 'price':
					// We already have data cached for defaults
					if (cdata.def && !skip.cache) {
						cache = cdata.def;
						// log('Got -' + type + '- from cached [default]', cache.value);
					}
					else {
						// Create the cache object
						cache = {
							from: 'default',
							data: null,
							value: null,
							origValue: null
						};
						// Add to cache
						if (!skip.cache) {
							cdata.def = cache;
						}
						var max, value;
						// Try to get what we need by parsing the document
						pp_data = PageParser.getPrice();
						max = cache.max = pp_data.max;
						// Replace data
						data = cache.data = pp_data.nodes;
						value = max && max.value;
						cache.value = PageParser.cleanPrice(value);
						cache.origValue = value;
						// Populate the foundPrice object
						if (value || (max && max.oos)) {
							var fp = cachedData.foundPrice;
							fp.value = value;
							fp.currency = max && max.currency;
							fp.oos = max && max.oos;
							fp.from = 'default';
							// Add code and pp flag
							fp.reason.is_pp = -1;
							fp.reason.code = 10;
						}
						// log('Trying to retrieve -' + type + '- for [default]...');
					}
					break;
				case 'currency':
					// We already have data cached for defaults
					if (cdata.def && !skip.cache) {
						cache = cdata.def;
						// log('Got -' + type + '- from cached [default]', cache.value);
					}
					else {
						var fp = cachedData.foundPrice;
						if (fp) {
							// Try to get currency from traversed DOM elements
							if (fp.currency) {
								data = {
									from: 'Default price',
									value: fp.currency
								};
								// Create the cache object
								cache = {
									from: 'default',
									data: data,
									value: data.value
								};
								// Add to cache
								if (!skip.cache) {
									cdata.def = cache;
								}
							}
							// Try to get currency from price text
							else if (fp.value) {
								data = {
									from: 'price',
									value: PageParser.getCurrencyFromPrice(fp.value)
								};
								// Create the cache object
								cache = {
									from: 'default',
									data: data,
									value: data.value
								};
								// Add to cache
								if (!skip.cache) {
									cdata.def = cache;
								}
							}
							// log('Trying to retrieve -' + type + '- for [default]...');
						}
						else {
							log('There is no price found in order to extract the currency for [default]...');
						}
					}
					break;
				case 'availability':
					// We already have data cached for defaults
					if (cdata.def && !skip.cache) {
						cache = cdata.def;
						// data = cache.data
						// log('Got -' + type + '- from cached [default]', cache.value);
					}
					else {
						var fp = cachedData.foundPrice;
						if (fp) {
							// Try to get currency from traversed DOM elements
							if (fp.oos) {
								data = {
									from: 'Default price',
									value: 'out_of_stock'
								};
								// Create the cache object
								cache = {
									from: 'default',
									data: data,
									value: data.value
								};
								// Add to cache
								if (!skip.cache) {
									cdata.def = cache;
								}
							}
							// log('Trying to retrieve -' + type + '- for [default]...');
						}
						else {
							log('There is no price found in order to extract the availability for [default]...');
						}
					}
					break;
				}
				// Got value from rules
				if (cache && cache.value) {
					// log('Obtained -' + type + '- value from [default]', cache.value, cache);
					return cache.value;
				}
				return null;
			};
			/**
			 * @desc Convert camel-cased string to the original dashed value
			 * @param string str
			 * @param boolean skipFixMs - ignore fix for ms vendor prefix
			 * @return string
			 */
			Aproto.fromCamelCase = function (str, skipFixMs) {
				var nocc_str = str.replace(/[A-Z]/g, function (m) {
					return '-' + m[0].toLowerCase();
				});
				// Add vendor prefix for ms
				if (!skipFixMs && /^(ms|webkit|moz|o)\-/.test(nocc_str)) {
					nocc_str = '-' + nocc_str;
				}
				return nocc_str;
			};
			/** @desc All jQuery (sizzle) methods will go through this filter before using the rule on the DOM
			 **  The filter excludes all jQuery methods, except those that do traversal
			 **/
			function makeChain(currentChain, met, arg) {
				// Make sure we have only strings or no value at all
				arg = (arg != null) ? arg.toString() : arg;
				// Allowed jQuery methods
				switch (met) {
				case 'find':
					if (arg && arg !== '') {
						currentChain = currentChain.find(arg);
					}
					break;
				case 'filter':
					if (arg && arg !== '') {
						currentChain = currentChain.filter(arg);
					}
					break;
				case 'eq':
					if (arg && arg !== '') {
						currentChain = currentChain.eq(arg);
					}
					break;
				case 'parent':
					currentChain = currentChain.parent(arg);
					break;
				case 'parents':
					currentChain = currentChain.parents(arg);
					break;
				case 'addBack':
					currentChain = currentChain.addBack(arg);
					break;
				case 'andSelf':
					currentChain = currentChain.andSelf(arg);
					break;
				case 'closest':
					currentChain = currentChain.closest(arg);
					break;
				case 'contents':
					currentChain = currentChain.contents(arg);
					break;
				case 'siblings':
					currentChain = currentChain.siblings(arg);
					break;
				case 'children':
					currentChain = currentChain.children(arg);
					break;
				case 'prev':
					currentChain = currentChain.prev(arg);
					break;
				case 'next':
					currentChain = currentChain.next(arg);
					break;
				case 'first':
					currentChain = currentChain.first();
					break;
				case 'last':
					currentChain = currentChain.last();
					break;
				case 'attr':
					if (arg && arg !== '') {
						currentChain = currentChain.attr(arg);
					}
					break;
				case 'prop':
					if (arg && arg !== '') {
						currentChain = currentChain.prop(arg);
					}
					break;
				case 'val':
					currentChain = currentChain.val();
					break;
				case 'text':
					currentChain = currentChain.text();
					break;
				case 'filterName':
					currentChain = currentChain.filterName();
					break;
				case 'price':
					currentChain = currentChain.price();
					break;
				case 'priceOnly':
					currentChain = currentChain.priceOnly();
					break;
				case 'currency':
					currentChain = currentChain.currency();
					break;
				default:
					var chMet = currentChain[met];
					if (chMet && chMet.call) {
						currentChain = chMet.call(arg);
					}
				}
				return currentChain;
			};
			/** @desc Parse value of interest using a sizzle selector
			 **/
			function getValueBySizzle(selector, valMethod) {
				var value = null,
					set = [];
				if (isString(selector) && (selector != '') && isString(valMethod) && (valMethod != '')) {
					var jelem = $(selector);
					// log('Using jQuery Selector: ', selector, valMethod);
					if (jelem.length) {
						// Get methods and arguments
						var chain = valMethod.split(').'),
							m, met, arg, chr, i = 0,
							l = chain.length,
							currentChain = jelem,
							chMet = '$(\'' + selector.replace(/'/g, '\'') + '\')';
						// Chainable methods
						for (; i < l; ++i) {
							// Get methods and arguments
							m = chain[i].split('(');
							met = m[0];
							arg = m.slice(1).join('');
							chr = arg.charAt(Math.max(arg.length - 1, 0));
							arg = (chr === ')') ? arg.substr(0, arg.length - 1) : arg;
							// Make sure there are no empty strings
							arg = arg || undefined;
							chMet += '.' + met + '(' + (arg != null ? arg : '') + ')';
							// This is the last method and it must be non-chainable
							if ((i + 1 == l) && ($.inArray(met, ['attr', 'prop', 'val', 'text', 'filterName', 'currency', 'price', 'priceOnly']) >= 0)) {
								// console.info('Last method (' + met + ') of selector (' + selector + ') -> ', currentChain);
								// log('Last piece of the chain: ', chMet);
								// Go through each element in the collection
								currentChain.each(function () {
									// log('Making last chain: ', currentChain, met, arg);
									value = makeChain(currentChain, met, arg);
									// log('$each ->', this, '-> value = ', value);
									if (isString(value)) {
										set.push({
											node: this,
											value: $.trim(value.replace(/\s+/g, ' '))
										});
									}
								});
							}
							else {
								// log('Adding to chain: ', chMet);
								currentChain = makeChain(currentChain, met, arg);
							}
						}
						// log('jQuery Returned set: ', set);
					}
				}
				return set;
			};
			/** @desc Parse value of interest using regular expression
			 **/
			function getValueByRegexp(regStr, val) {
				var value = null,
					set = [];
				if (isString(regStr) && (regStr !== '')) {
					var matches, re = new RegExp(regStr, 'g');
					// log('** Testing regular expression /' + regStr + '/g with capturing group: ', val);
					while (matches = re.exec(NS.documentSource)) {
						// Get matches by index from array
						if (isString(val) && (val != '')) {
							// Find concatenation operator
							var add = val.split('+'),
								tmp, i = 0,
								l = add.length,
								m;
							// Init value
							value = '';
							for (; i < l; ++i) {
								// Now look for the OR operator
								tmp = add[i].split('|');
								for (var j = 0, jl = tmp.length; j < jl; ++j) {
									m = matches[tmp[j]];
									if ((m != null) && (m != '')) {
										value += m;
										break;
									}
								}
							}
						}
						// Just return all matches joined together
						else {
							value = matches.slice(1).join('');
						}
						set.push({
							match: matches,
							value: $.trim(value)
						});
					}
				}
				return set;
			};
			/** @desc Parse value of interest from rules received from backend
			 **/
			function getValueByRules(rules, type) {
				var len, i = 0,
					rule, set, data;
				if (rules && rules[type] && (len = rules[type].length)) {
					for (; i < len; ++i) {
						rule = rules[type][i];
						if (rule) {
							// Ignore current type
							if (rule.type === 'ignore') {
								set = [{
									value: null
								}];
								data = {
									from: 'ignore',
									rule: rule,
									data: set,
									value: null
								};
							}
							// Use sizzle selectors
							else if (rule.type === 'css') {
								try {
									set = getValueBySizzle(rule.m, rule.v);
									data = {
										from: 'sizzle',
										rule: rule,
										data: set,
										value: null
									};
								}
								catch (e) {
									log('!! Error !! in getValueBySizzle', rule.m, rule.v, e);
								}
							}
							// Regular expression
							else if (rule.type === 'reg') {
								try {
									set = getValueByRegexp(rule.m, rule.v);
									data = {
										from: 'regexp',
										rule: rule,
										data: set,
										value: null
									};
								}
								catch (e) {
									log('!! Error !! in getValueByRegexp', rule.m, rule.v, e);
								}
							}
							// Exact known value
							else if (rule.type === 'exact') {
								set = [{
									value: rule.v
								}];
								data = {
									from: 'exact',
									rule: rule,
									data: set,
									value: null
								};
							}
						}
						// Log possible wrong expressions
						if (set && set.length > 1) {
							log('!! WARN !! - Provided expression for [' + type + '] returned too many objects => ', rule, data);
							// Add code and is_pp flag only for price
							if (type === 'price') {
								data.is_pp = 0;
								data.code = 502;
							}
						}
						if ((!set || !set[0] || !set[0].value) && (rule && rule.type !== 'ignore')) {
							log('!! WARN !! - Provided expression for [' + type + '] returned NO result => ', rule, data);
							// Add code and is_pp flag only for price
							if (type === 'price') {
								data.is_pp = 0;
								data.code = 503;
							}
						}
						// Matched one of the rules
						if (set && set.length && (set[0].value || rule.type === 'ignore')) {
							// Set the value
							data.value = set[0].value;
							// Add code and is_pp flag only for price
							if (type === 'price') {
								data.is_pp = (rule.type === 'ignore') ? -1 : 1;
								data.code = 1;
							}
							return data;
						}
					}
				}
				return data;
			};
			/** @desc Parse value of interest from microdata elements
			 **/
			function getValueByMicrodata(type, from) {
				var set = [],
					value = null,
					data = null,
					filter = Boolean(from.filter);
				// Check microdata items
				if (mdItems.scopes.item_count) {
					var prod = mdItems.scopes.product,
						offer = mdItems.scopes.offer,
						selectors = from.offer,
						elemMatch, $el, checkProd = false;
					// Look in offer
					if (selectors && offer && offer.$elem && offer.$elem.length) {
						// Get elements
						elemMatch = getItemsBySelectors(offer.$elem, selectors);
						while (elemMatch.length) {
							$el = $(elemMatch.shift());
							set.push({
								node: $el[0],
								value: $.trim(getValMD($el, filter))
							});
						}
						// Get the first value
						value = set[0] && set[0].value || '';
					}
					selectors = from.prod;
					// Special treatment for name
					checkProd = (!value || (type === 'name')) ? true : false;
					// Look in prod
					if (checkProd && selectors && prod && prod.$elem && prod.$elem.length) {
						// Get elements
						elemMatch = getItemsBySelectors(prod.$elem, selectors);
						while (elemMatch.length) {
							$el = $(elemMatch.shift());
							set.push({
								node: $el[0],
								value: $.trim(getValMD($el, filter))
							});
						}
						// Get the first value
						value = set[0] && set[0].value || '';
					}
					// Process name further
					if ((type === 'name') && set.length) {
						// Get doc title
						var docTitle = $.trim(window.document.title).replace(/\s+/g, ' '),
							setItem = null,
							jnode = null;
						for (var i = 0, l = set.length; i < l; ++i) {
							setItem = set[i];
							setItem.score = comparePhrases(docTitle, setItem.value);
							jnode = $(setItem.node);
							if (jnode.is('h1') || jnode.parents('h1').length) {
								setItem.score += 25;
							}
						}
						// Sort by score - descending
						set.sort(function (a, b) {
							if (a.score > b.score) {
								return -1;
							}
							else if (a.score < b.score) {
								return 1;
							}
							else {
								return 0;
							}
						});
						// Reassign the value
						value = set[0] && set[0].value || '';
					}
					// Assign data
					if (value) {
						data = {
							from: 'microdata',
							rule: {
								selectors: from,
								filter: filter
							},
							data: set,
							value: value
						};
					}
				}
				return data;
			};
			/** @desc Determine rules for specific DOM parsing
			 **/
			function getSkipRules(type, domain_data) {
				var regexp = (domain_data && domain_data.regexp) ? domain_data.regexp : {};
				var skip = {
					rules: null,
					micro: null,
					def: null
				};
				if (domain_data && domain_data.domain_type === 'search') {
					skip.def = {
						heading: true
					};
					if (regexp && regexp.name) {
						skip.def.title = true;
					}
					skip.empty_string = true;
				}
				return skip;
			};
			/** @desc Get the value from a microdata node
			 **/
			function getValMD($this, filter) {
				var val = null;
				// 1. Look in attributes
				// LINK node
				if ($this.is('link')) {
					// Get the last pathname
					val = String($this.attr('href')).split('/').reverse()[0];
				}
				// A node and image prop
				else if ($this.is('a[itemprop=image]')) {
					val = $this.attr('href');
				}
				// IMG node
				else if ($this.is('img')) {
					val = $this.attr('src');
				}
				// Get value from attributes
				else {
					val = $this.attr('content') || $this.attr('value');
				}
				// 2. Look in childNodes
				if (!val) {
					val = (filter ? $this.filterName() : $this.text()) || ''
				}
				return val;
			}
			/** @desc Parse the DOM for product specific microdata elements and cache them here
			 **/
			function detectMicrodataItems() {
				// Not yet parsed
				if (!mdItems.scopes.item_count) {
					// Look for microdata items
					var $allscopes = $('[itemscope]').filter(function (i, v) {
						var $this = $(this),
							itemProp = $this.attr('itemtype');
						// Keep only offers and products
						if (/offer|product/i.test(itemProp) && !/review|rating|aggregate/i.test(itemProp)) {
							return true;
						}
						return false;
					});
					// Prepare collections
					if ($allscopes.length) {
						var prod = mdItems.scopes.product,
							offer = mdItems.scopes.offer,
							$prodItems = prod.$items,
							$offerItems = offer.$items;
						// Find products/offers
						$allscopes.each(function () {
							var $this = $(this),
								itemProp = $this.attr('itemtype');
							// Check for products
							if (/product/i.test(itemProp)) {
								// Only the first
								if (!prod.$elem) {
									prod.vocab = $this.attr('itemtype');
									prod.$elem = $this;
								}
								// Add the scope to the list
								$prodItems = $prodItems.add($this);
								// Increment count
								mdItems.scopes.item_count++;
							}
							// Check for products
							if (/offer/i.test(itemProp)) {
								// Only the first
								if (!offer.$elem) {
									offer.vocab = $this.attr('itemtype');
									offer.$elem = $this;
								}
								// Add the scope to the list
								$offerItems = $offerItems.add($this);
								// Increment count
								mdItems.scopes.item_count++;
							}
						});
						// Reassign objects
						prod.$items = $prodItems;
						offer.$items = $offerItems;
					}
				}
				var prodCount = mdItems.scopes.product.$items.length,
					offerCount = mdItems.scopes.offer.$items.length,
					is_prod_page = false;
				// Too many offers - do a last check to see if there are duplicates
				if (offerCount > 1) {
					// Get offers
					var offerScope = mdItems.scopes.offer,
						firstOffer = offerScope.$items.eq(0),
						secondOffer = offerScope.$items.eq(1),
						firstVocab = firstOffer.attr('itemtype'),
						secondVocab = secondOffer.attr('itemtype'),
						newOfferCount = offerCount;
					log('MD Detect >> Duplicate offers found! ->', firstOffer, secondOffer);
					// Check vocabulary
					if (firstVocab !== secondVocab) {
						var selectors = mdItems.selectors
							// Check for name, price and currency elements
							// , offerSelector = selectors.name.offer + ',' + selectors.price.offer + ',' + selectors.currency.offer
							// , firstChildren = firstOffer.find(offerSelector)
							,
							arrOfferNameFirst = getItemsBySelectors(firstOffer, selectors.name.offer),
							arrOfferPriceFirst = getItemsBySelectors(firstOffer, selectors.price.offer),
							arrOfferCurrencyFirst = getItemsBySelectors(firstOffer, selectors.currency.offer),
							firstChildren = arrOfferNameFirst.concat(arrOfferPriceFirst).concat(arrOfferCurrencyFirst),
							firstScore = firstChildren.length
							// , secondChildren = secondOffer.find(offerSelector)
							,
							arrOfferNameSecond = getItemsBySelectors(secondOffer, selectors.name.offer),
							arrOfferPriceSecond = getItemsBySelectors(secondOffer, selectors.price.offer),
							arrOfferCurrencySecond = getItemsBySelectors(secondOffer, selectors.currency.offer),
							secondChildren = arrOfferNameSecond.concat(arrOfferPriceSecond).concat(arrOfferCurrencySecond),
							secondScore = secondChildren.length;
						// Keep first offer only
						if (firstScore > secondScore) {
							newOfferCount = 1;
							offerScope.$items = firstOffer;
							offerScope.$elem = firstOffer;
							offerScope.vocab = firstVocab;
							log('MD Detect >> Keeping firstOffer!', 'based on firstScore', firstScore);
						}
						// Keep second offer only
						else if (firstScore < secondScore) {
							newOfferCount = 1;
							offerScope.$items = secondOffer;
							offerScope.$elem = secondOffer;
							offerScope.vocab = secondVocab;
							log('MD Detect >> Keeping secondOffer!', 'based on secondScore', secondScore);
						}
						// Identical offers - double-check if same price
						else {
							var firstPrice = parseFloat(number_format(PageParser.cleanPriceMD(getValMD($(firstChildren).filter(arrOfferPriceFirst).first())), 2)),
								secondPrice = parseFloat(number_format(PageParser.cleanPriceMD(getValMD($(secondChildren).filter(arrOfferPriceSecond).first())), 2));
							// Hmmm... same price... perhaps we should keep only the first offer
							if (firstPrice == secondPrice) {
								newOfferCount = 1;
								offerScope.$items = firstOffer;
								offerScope.$elem = firstOffer;
								offerScope.vocab = firstVocab;
								log('MD Detect >> Identical scores ->> Keeping firstOffer!', 'based on both being identical');
							}
							else {
								// Keep secondOffer
								if (!firstPrice) {
									newOfferCount = 1;
									offerScope.$items = secondOffer;
									offerScope.$elem = secondOffer;
									offerScope.vocab = secondVocab;
									log('MD Detect >> Identical scores ->> Keeping secondOffer!', 'based on price missing for firstOffer');
								}
								// Keep firstOffer
								else if (!secondPrice) {
									newOfferCount = 1;
									offerScope.$items = firstOffer;
									offerScope.$elem = firstOffer;
									offerScope.vocab = firstVocab;
									log('MD Detect >> Identical scores ->> Keeping firstOffer!', 'based on price missing for secondOffer');
								}
							}
						}
						// Correct the count
						var prodCount = (mdItems.scopes.item_count - offerCount);
						mdItems.scopes.item_count = prodCount + newOfferCount;
						offerCount = newOfferCount;
					}
					else {
						log('MD Detect >> No further checking required!');
					}
				}
				// Too many products on this page
				if (
					(!prodCount && !offerCount) || (prodCount > 1) || (!prodCount && (offerCount > 1))) {
					is_prod_page = false;
				}
				else {
					is_prod_page = true;
				}
				mdItems.scopes.isProductPage = is_prod_page;
				mdItems.scopes.hasMD = mdItems.scopes.item_count ? true : false;
				return is_prod_page;
			};
			var displayToolbarOrNot = function (shm, domain_data, success, fail) {
				var reg = domain_data.regexp,
					reason = {
						is_pp: -1,
						code: 0,
						from: 'domain-data',
						msg: null
					},
					urlReg = reg && reg.url && reg.url.length ? reg.url : null;
				var currentURL = window.location.href.toString();
				var checkState = function () {
					// Get the new URL
					var newURL = window.location.href.toString();
					if (newURL !== currentURL) {
						// log('URL change: ', newURL);
						// Save the new URL
						currentURL = newURL;
						// Refresh the toolbar
						shm.refresh({
							delay: 1000
						});
					}
				};
				shm._checkLocationTO = setInterval(checkState, 1000);
				// Find and cache microdata items
				detectMicrodataItems();
				log('Detected Microdata Items: ', mdItems);
				// Ignore every rule and display the addon
				if (domain_data.always_display) {
					log('>> !! Ignoring all rules and displaying the iframe !! ');
					reason.code = 3;
					reason.msg = 'Always_display flag is ON!';
					success(reason);
					return true;
				}
				// Refresh document variable
				document = window.document
				// Check URL matching rules first
				if (urlReg) {
					var thisURL = document.URL.toString(),
						matchOne = false,
						r;
					for (var i = 0, l = urlReg.length; i < l; ++i) {
						r = new RegExp(urlReg[i].m);
						log('>> Testing URL matching rules for ', thisURL, r);
						if (thisURL.match(r)) {
							matchOne = true;
							break;
						}
					}
					if (!matchOne) {
						log('>> None of the URL matching rules have passed...');
						reason.msg = 'URL not matched!';
						reason.code = 501;
						reason.is_pp = 0;
						fail(reason);
						return false;
					}
				}
				// Skip regular checks and just display the addon (for search engines)
				if (domain_data.force_display) {
					log('>> [Force display] Skipping regular page checks...');
					var ss;
					// Show only if we have a search string
					if (ss = shm.getProdData('name', reg, getSkipRules('name', domain_data))) {
						log('>> Search string found...', ss, cachedData.name);
						reason.code = 4;
						reason.msg = 'Force_display flag is ON and search string found!';
						success(reason);
						return true;
					}
					else {
						reason.code = 504;
						reason.msg = 'Search string not found!';
						fail(reason);
						return false;
					}
				}
				// Find price in the current page
				var price = shm.getProdData('price', reg),
					foundPrice = cachedData.foundPrice,
					fpr = foundPrice.reason;
				// Found price or OutOfStock message
				if (foundPrice.value || foundPrice.oos) {
					// Get items to compare
					var t = cachedData.price;
					reason.from = foundPrice.from;
					// Got price from regular expression rules - no need to check further
					if (t.rules && t.rules.data && t.rules.data.length) {
						// log('>> Comparing nodes from rules');
						if (t.rules.data.length > 1) {
							log('Too many \'Price\' nodes found from db rules: ', t.rules);
							reason.msg = 'DB multi-price rules!';
							fail(reason);
							return false;
						}
						else {
							success(reason);
							return true;
						}
					}
					// Check microdata items length
					else if (mdItems.scopes.hasMD && !mdItems.scopes.isProductPage) {
						log('Too many microdata itemscopes: ', shm.mdItems.scopes);
						reason.msg = 'MD multi-price rules!';
						fail(reason);
						return false;
					}
					// Got price from microdata - no need to check further
					else if (t.micro && t.micro.data && t.micro.data.length) {
						success(reason);
						return true;
					}
					// Got price from the default DOM parsing function - further checking is required
					else if (t.def && t.def.data && t.def.data.length) {
						// log('>> Comparing nodes from default');
						PageParser.ifProductPage(function (ppReason) {
							// Score is very low, let's try finding the price again with a little delay
							if (!shm.refreshCount && t.def.max && t.def.max.score < 0) {
								log('Possible product-page, re-parsing document shortly...');
								shm.refresh({
									delay: 1500
								});
							}
							else {
								log((shm.config._extID_ || '') + ' ~ Product page detection SUCCESS ~' + JSON.stringify(ppReason));
								cachedData.ppDetection = ppReason;
								success(reason);
								return true;
							}
						}, function (ppReason) {
							log((shm.config._extID_ || '') + ' ~ Product page detection FAIL ~' + JSON.stringify(ppReason));
							cachedData.ppDetection = ppReason;
							fail(reason);
						});
					}
					else {
						reason.is_pp = -1;
						reason.code = 0;
						reason.from = 'unmatched';
						reason.msg = 'Unmatched';
						foundPrice.reason = fpr = reason;
						fail(reason);
						return false;
					}
				}
				else {
					reason.is_pp = -1;
					reason.code = 0;
					reason.from = 'page-parsing';
					reason.msg = 'No price node found!';
					if (reg && reg.price && reg.price.length) {
						reason['price-regex'] = reg.price;
						reason.msg += ' But DB price rule exists!';
					}
					foundPrice.reason = fpr = reason;
					fail(reason);
					return false;
				}
			};
			/** @desc Prepare the iframe element with all necessay parameters and attach it to the DOM
			 **/
			function addExtensionIframe(shm, domain_data, options) {
				pageData = options && options.pageData || {};
				// Refresh document variable
				document = window.document
				// Force extra params
				if (shm.data.addQuery) {
					for (var s in shm.data.addQuery) {
						pageData[s] = shm.data.addQuery[s];
					}
				}
				// Convert to URI query-string
				var iframeParams = $.param(pageData);
				// Display the iframe
				shm.addIframe(domain_data.useDataUrl || null, iframeParams);
				/** ********************************************************** **/
				debugData({
					pageData: pageData,
					queryString: iframeParams
				});
				/** ********************************************************** **/
				/** @desc Ready for channel initialization and final prep steps
				 **  We must not use timers to delay this setup as the browser behaves unpredictable at this point, after refreshing the product page
				 **/
				if (!shm.channel && shm.iframe) {
					var channel = shm.channel = new NS.ComChannel($.extend({}, shm.config, {
						name: 'Channel'
					}));
					channel.setReceiver(shm.iframe);
					log('Initializing channel for domain ', shm.data.domain);
					//channel.log_callbacks_received = true;
					//channel.log_callbacks_sent = true;
					// Custom powered by text
					if (NS._powered_by_text) {
						channel.init(function () {
							log('~~ Channel successfully initialized! ~~');
							shm.setPoweredText(NS._powered_by_text);
						});
					}
					// Normal init
					else {
						channel.init();
					}
					// Set-up necessary events for communicating with the iframe and for detecting page changes
					shm.setUpEvents(channel, true);
				}
			};
			/** @desc Get text content of a givent node only if it's visible enough
			 **/
			$.fn.filterName = function ($stack) {
				var $elem = $(this);
				if (!$stack) {
					$stack = $();
				}
				if (!$elem.is(':visible')) {
					return '';
				}
				$elem.contents().filter(function () {
					// Element node or text node
					if ((this.nodeType == 1) || (this.nodeType == 3)) {
						var $this, add_to_stack = false,
							children = null;
						// Go through children of element nodes
						if (this.nodeType == 1) {
							$this = $(this);
							if ($this.is(':visible') && $this.is(':not(iframe)') && ($this.height() > 0)) {
								add_to_stack = true;
								// Clone the element because the .add() method rearranges the order of the stack based on DOM level
								$this = $this.clone();
								$stack = $stack.add($this);
								children = $this.children();
								$stack.add($('<span>&nbsp;</span>'));
							}
						}
						else {
							add_to_stack = true;
							$stack = $stack.add($('<span>' + this['node' + 'Value'] + '&nbsp;</span>'));
						}
						if (children && children.length) {
							$this.filterName($stack);
						}
						return add_to_stack;
					}
					return false;
				});
				return $stack.text().replace(/\s+/g, ' ').replace(/\s+$/, '');
			};
			/** @copyright http://phpjs.org/functions/preg_quote/ **/
			function preg_quote(str, delimiter) {
				return String(str).replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + (delimiter || '') + '-]', 'g'), '\\$&');
			}
			/** @copyright http://phpjs.org/functions/number_format/ **/
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
			/** @desc Display debug info in debug-mode
			 **/
			function debugData(data) {
				var printObj = function (obj) {
					for (var s in obj) {
						log(s, '->', obj[s]);
					}
				};
				log('------ >> Debug data << ------');
				for (var s in cachedData) {
					var t = cachedData[s];
					if (t.rules && t.rules.value) {
						log('Got ', s);
						printObj(t.rules);
					}
					else if (t.micro && t.micro.value) {
						log('Got ', s);
						printObj(t.micro);
					}
					else if (t.def && t.def.value) {
						log('Got ', s);
						printObj(t.def);
					}
					else {
						log(s, ' is:', t);
					}
					log('-----------------------------');
				}
				if (data) {
					log('--- Additional Debug Info ---');
					printObj(data);
				}
			};
			// Attach to namespace object
			NS.API = API;
			NS.$ = $;
		})(SHMAddonNamespace, window_jQuery_object, window);
		/** 
		 ** @desc Initialize the PageParser static object
		 **/
		(function (NS, window, undefined) {
			var PageParser = {
					detectionCount: 0
				},
				$ = NS.$,
				log = NS.log,
				document = window.document,
				body = document.body,
				location = window.location,
				docURL = document.URL,
				domain = document.domain,
				toStr = Object.prototype.toString,
				arrSlice = Array.prototype.slice,
				isString = function (obj) {
					return toStr.call(obj) === '[object String]';
				}
				/** @desc Generate a unique string **/
				,
				uniqueID = function () {
					return ((new Date().getTime() + Math.random()) / Math.random() * 10000).toString(32);
				};
			// DOM Element to match against tested nodes to determine if log output is shown
			NS.logFailMatchNode = null;
			// Keyword to match against node's data to determine if log output is shown
			NS.logFailMatchNodeData = null;
			// DOM Element to match against tested nodes to determine if log output is shown
			NS.logScoreMatchNode = null;
			// Keyword to match against node's data to determine if log output is shown
			NS.logScoreMatchNodeData = null;
			var logfail = function () {
				if (NS.debug_mode) {
					var node = arguments[0];
					if (
						(NS.logFailMatchNode && ((NS.logFailMatchNode.nodeType && (NS.logFailMatchNode === node)) || $.inArray(node, NS.logFailMatchNode) >= 0)) || (NS.logFailMatchNodeData && NS.logFailMatchNodeData.test(node.textContent || node.innerText || node.data))) {
						log('LogFail node: ', node);
						log.apply(null, arrSlice.call(arguments, 1));
					}
				}
			};
			var logscore = function () {
				if (NS.debug_mode) {
					var node = arguments[0];
					if (
						(NS.logScoreMatchNode && ((NS.logScoreMatchNode.nodeType && (NS.logScoreMatchNode === node)) || $.inArray(node, NS.logScoreMatchNode) >= 0)) || (NS.logScoreMatchNodeData && NS.logScoreMatchNodeData.test(node.textContent || node.innerText || node.data))) {
						log.apply(null, arrSlice.call(arguments, 1));
					}
				}
			};
			/** @desc *** Regular Expressions and price grabbing functions and mappings with translations *** **/
			var mapCurrency = {
					// Argentina Peso
					'ars': 'ARS',
					//'\u0024'            : 'ARS',
					// Australia Dollar
					'aud': 'AUD',
					//'\u0024'            : 'AUD',
					// Bulgaria Lev
					'bgn': 'BGN',
					'лв': 'BGN',
					'лв.': 'BGN',
					// Brazil Real
					'brl': 'BRL',
					'R$': 'BRL',
					// Canada Dollar
					'cad': 'CAD',
					//'\u0024'            : 'CAD',
					// Denmark Krone
					'dkk': 'DKK',
					'kr': 'DKK',
					// Switzerland Franc
					'chf': 'CHF',
					'₣': 'CHF',
					// Chile Peso
					'clp': 'CLP',
					//'\u0024'            : 'CLP',
					// Czech Republic Koruna
					'czk': 'CZK',
					'kč': 'CZK',
					// Euro Member Countries
					'eur': 'EUR',
					'euro': 'EUR',
					'€': 'EUR',
					// United Kingdom Pound
					'gbp': 'GBP',
					'£': 'GBP',
					// Croatian Kuna
					'hrk': 'HRK',
					'kn': 'HRK',
					// Hungary Forint
					'huf': 'HUF',
					'ft': 'HUF',
					// India Rupee
					'inr': 'INR',
					'₨': 'INR',
					'rs': 'INR',
					// Japan Yen
					'jpy': 'JPY',
					'¥': 'JPY',
					'￥': 'JPY',
					'円': 'JPY',
					// Mexico Peso
					'mxn': 'MXN',
					'mx$': 'MXN',
					'mex$': 'MXN',
					//'\u0024'            : 'MXN',
					// Poland Zloty
					'pln': 'PLN',
					'zł': 'PLN',
					// Romania New Leu
					'ron': 'RON',
					'lei': 'RON',
					// Serbia Dinar
					'rsd': 'RSD',
					'din': 'RSD',
					'din.': 'RSD',
					'дин': 'RSD',
					'дин.': 'RSD',
					// Russia Ruble
					'rub': 'RUB',
					'руб': 'RUB',
					'руб.': 'RUB',
					// Sweden Krona
					'sek': 'SEK',
					'kr': 'SEK',
					// Turkey Lira
					'try': 'TRY',
					'tl': 'TRY',
					'trl': 'TRY',
					'₤': 'TRY',
					'₺': 'TRY',
					// United States Dollar
					'usd': 'USD',
					'us$': 'USD',
					'$': 'USD',
					// South Africa Rand
					'zar': 'ZAR',
					'r': 'ZAR'
				}
				// Currency symbols that are found in multiple countries
				,
				multiCSymbols = {
					// Dollar
					'$': ['USD', 'ARS', 'AUD', 'CAD', 'CLP', 'MXN']
				}
				// TLD domains where price values are frequently used without currency symbols
				,
				noCSymbolTLD = ['rs']
				// Define symbols
				,
				cSymbols = [
					// Argentina Peso
					'[aA][rR][sS]',
					// Australia Dollar
					'[aA][uU][dD]',
					// Bulgaria Lev
					'[bB][gG][nN]|[\\u043b\\u041b][\\u0432\\u0412]\\.?',
					// Brazil Real
					'[bB][rR][lL]|R\\u0024',
					// Canada Dollar
					'[cC][aA][dD]',
					// Switzerland Franc
					'[cC][hH][fF]|\\u20a3',
					// Chile Peso
					'[cC][lL][pP]',
					// Czech Republic Koruna
					'[cC][zZ][kK]|[kK][\\u010d\\u010c]',
					// Denmark Krone
					'[dD][kK][kK]|[kK][rR]',
					// Euro Member Countries
					'[eE][uU][rR][oO]?|\\u20ac',
					// United Kingdom Pound
					'[gG][bB][pP]|\\u00a3',
					// Croatian Kuna
					'[hH][rR][kK]|[kK][nN]',
					// Hungary Forint
					'[hH][uU][fF]|[fF][tT]',
					// Serbia Dinar
					'[rR][sS][dD]|[dD][iI][nN]\\.?|[\\u0434\\u0414][\\u0438\\u0418][\\u043d\\u041d]\\.?',
					// India Rupee
					'[iI][nN][rR]|\\u20a8|[rR][sS]',
					// Japan Yen
					'[jJ][pP][yY]|\\u00a5|\\uffe5|\\u5186',
					// Mexico Peso
					'[mM][xX][nN]|[mM][eE]?[xX]\\u0024',
					// Poland Zloty
					'[pP][lL][nN]|[zZ][\\u0142\\u0141]',
					// Romania New Leu
					'[rR][oO][nN]|[lL][eE][iI]',
					// Russia Ruble
					'[rR][uU][bB]|[\\u0440\\u0420][\\u0443\\u0423][\\u0431\\u0411]',
					// Sweden Krona
					'[sS][eE][kK]|[kK][rR]',
					// Turkey Lira
					'[tT][rR][yYlL]|[tT][lL]|\\u20a4|\\u20ba',
					// United States Dollar
					'[uU][sS][dD]|US\\u0024|\\u0024',
					// South Africa Rand
					'[zZ][aA][rR]|R'
				],
				cRangeKeywords = ['-', '\\u2013', 'to', 'la', 'a', 'tot', 'bis', 'do', 'kuni', 'ig', 'till', '\\u00e0', '\\u0434\\u043e', '\\u307e\\u3067', '\\u0061\\u0074\\u00e9', '\\u0065\\u006e\\u0020\\u00e7\\u006f\\u006b'],
				pRangeKeywords = '(?:' + cRangeKeywords.join('|') + ')'
				// Get Digits
				,
				pDigits = '(?:[0-9,.\\-]|\\d:\\d)+'
				// Create the price regular expression
				,
				pCurrency = cSymbols.join('|')
				// , pPriceCurrency = '((?:' + '(' + pCurrency + ')\\s*(' + pDigits + '))|(?:(' + pDigits + ')\\s*' + '(' + pCurrency + ')))'
				,
				pPriceCurrency = '((?:' + '(' + pCurrency + ')(' + pDigits + '))|(?:(' + pDigits + ')' + '(' + pCurrency + ')))'
				// Exact currency regex
				,
				reExactCurrency = new RegExp('^(' + pCurrency + ')$'),
				reDigits = new RegExp(pDigits, 'i'),
				reNZ = /[1-9]/,
				reDecimals = /((?:,\-|[.,])|[\d\s:])\d/,
				reStartDecimals = /^(,\-|[.,:])\d/,
				reExtractPriceAndCurrency = new RegExp(pPriceCurrency),
				reExtractPriceAndCurrencyGlobal = new RegExp(pPriceCurrency, 'g'),
				rePriceRange = new RegExp(pPriceCurrency + pRangeKeywords + pPriceCurrency)
				/** @desc "add"-word expressions **/
				,
				cAdd = ["add", "place", "adaug[a\\u0103]", "adicionar", "ajouter", "toevoegen", "lisa", "aggiungi", "dodaj", "ubaci", "dodajte", "at|ekle", "in[\\s\\-_]?den", "a[n\\u00f1]adir", "\\u0061\\u00f1\\u0061\\u0064\\u0069\\u0072", "\\u0434\\u043e\\u0431\\u0430\\u0432\\u0438", "\\u0434\\u043e\\u0431\\u0430\\u0432\\u0438\\u0442\\u044c", "\\u0068\\u006f\\u007a\\u007a\\u00e1\\u0061\\u0064\\u00e1\\u0073"],
				reAdd = new RegExp('(?:^|\\s|_|-)(?:' + cAdd.join('|') + ')(?:$|\\s|_|-)', 'i')
				/** @desc "cart"-word expressions **/
				,
				cCart = ["bag", "cart", "basket", "co[s\\u015f\\u0219]", "carro", "carrinho", "panier", "winkelwagentje", "einkaufswagen", "ostukorv", "carrello", "koszyk(?:a)?", "korp(?:a|u)", "varukorg", "sepetim", "warenkorb", "einkaufstasche", "cesta", "sepete", "\\u043a\\u043e\\u043b\\u0438\\u0447\\u043a\\u0430", "\\u006b\\u006f\\u0161\\u00ed\\u006b", "\\u043a\\u043e\\u0440\\u0437\\u0438\\u043d\\u0430", "\\u006b\\u006f\\u0073\\u00e1\\u0072", "\\u30ab\\u30fc\\u30c8", "\\u006b\\u006f\\u0161\\u00ed\\u006b"],
				reCart = new RegExp(cCart.join('|'), 'i')
				/** @desc "add-to-cart" expressions **/
				,
				cAddToCart = ["add[\\s\\-_]?(?:to[\\s\\-_]?)?(?:shop(?:ping)?[\\s\\-_]?)?(?:bag|cart|basket|car)", "shop(?:ping)?[\\s\\-_]?(?:bag|cart|basket|car)", "(?:b(?:ut)?t(?:o)?n[\\s\\-_]?)(?:(?:buy[\\s\\-_]?(?:now)?)|(?:atc))", "(?:(?:buy[\\s\\-_]?(?:now)?)|(?:atc))[\\s\\-_]?(?:b(?:ut)?t(?:o)?n)", "buy[\\s\\-_]?now", "bu?t?to?n[\\s\\-_]?(?:(?:(?:add[\\s\\-_]?)?(?:to[\\s\\-_]?)?cart)|comm?and)", "adaug[a\\u0103][\\s\\-_\\w]+?(?:[i\\u00ee]n[\\s\\-_]?)?co[s\\u015f\\u0219]", "vreau[\\s\\-_]?s[a\\u0103][\\s\\-_]?cump[a\\u0103]r", "buton[\\s\\-_]?(?:comand[a\\u0103]?|cump[a\\u0103]r[a\\u0103])", "cump[a\\u0103]r[a\\u0103][\\s\\-_]?(?:acum|(?:[\\s\\-_\\w]+produs))", "a[nñ]adir[\\s\\-_]?al[\\s\\-_]?carro", "adicionar[\\s\\-_]?ao[\\s\\-_]?carrinho", "adicionar[\\s\\-_]?ao[\\s\\-_]?carrinho", "ajout(?:er)?[\\s\\-_]?(?:au[\\s\\-_]?)?panier", "in[\\s\\-_]?winkelwagentje", "p[r\\u0159]ida[t\\u0165][\\s\\-_]?do[\\s\\-_]?ko[s\\u0161][i\\u00ed]ku", "lisa[\\s\\-_]?ostukorvi", "kos[a\\u00e1]rba", "dodaj[\\s\\-_]?(?:do[\\s\\-_]?)?koszyka", "a[n\\u00f1]adir[\\s\\-_]?(?:a[\\s\\-_]?)?(?:mi[\\s\\-_]?)?cesta", "(?:ubaci|dodaj(?:te)?)[\\s\\-_]?(?:u[\\s\\-_]?)?korpu", "l[a\\u00e4]gg[\\s\\-_]?till[\\s\\-_]?varukorg", "sepete[\\s\\-_]?(?:ekle|at)", "in[\\s\\-_]?(?:den|die)[\\s\\-_]?(?:einkaufswagen|warenkorb|einkaufstasche)", "^in[\\s\\-_]?den[\\s\\-_]?korb$", "^in[\\s\\-_]?warenkorb$", "^kaufen$", "jetzt[\\s\\-_]?kaufen", "^acquista$", "acquista[\\s\\-_]?ora", "^al[\\s\\-_]?carrello$", "metti[\\s\\-_]?(?:questo[\\s\\-_]?articolo[\\s\\-_]?)?(?:nel[\\s\\-_]?)?(?:tuo[\\s\\-_]?)?carrello", "(?:aggiungi|aggiungere)[\\s\\-_]?(?:al[\\s\\-_]?)?carrello", "\\u30ab\\u30fc\\u30c8\\u306b\\u5165\\u308c\\u308b", "\\u0434\\u043e\\u0431\\u0430\\u0432\\u0438\\u0442\\u044c[\\s\\-_]?\\u0432[\\s\\-_]?\\u043a\\u043e\\u0440\\u0437\\u0438\\u043d\\u0443", "\\u0434\\u043e\\u0431\\u0430\\u0432\\u0438[\\s\\-_]?\\u0432[\\s\\-_]?\\u043a\\u043e\\u043b\\u0438\\u0447\\u043a\\u0430\\u0442\\u0430", "\\u30ab\\u30fc\\u30c8\\u306b\\u8ffd\\u52a0", "\\u30ab\\u30fc\\u30c8\\u306b\\u5165\\u308c\\u308b", "\\u30ab\\u30fc\\u30c8\\u3078\\u5165\\u308c\\u308b", "\\u8cb7\\u3044\\u7269\\u304b\\u3054\\u306b\\u5165\\u308c\\u308b", "^\\u653e\\u5165\\u8d2d\\u7269\\u8f66$", "^\\u6dfb\\u52a0\\u5230\\u8d2d\\u7269\\u8f66$", "^\\u8d2d\\u4e70$", "^\\u7acb\\u5373\\u62a2\\u8d2d$", "^\\u7acb\\u5373\\u8d2d\\u4e70$", "^\\u52a0\\u5165\\u8d2d\\u7269\\u8f66$"]
				// Build the main regular expression
				,
				reAddToCart = new RegExp('(?:' + cAddToCart.join(')|(?:') + ')', 'i')
				/** @desc "buy"-word expressions **/
				,
				cBuy = ["buy", "order", "cump[a\\u0103]r(?:[a\\u0103])?\d?", "comprar", "achetez", "acquista", "kopen", "kaufen", "koupit", "osta", "kup", "k\\u00f6p", "k\\u00f8b", "bestel", "kupite", "megveszem \\u8cfc\\u5165\\u3059\\u308b", "\\u006b\\u0443\\u043f\\u0438", "\\u043a\\u0443\\u043f\\u0438", "\\u006b\\u0443\\u043f\\u0438\\u0442\\u044c", "\\u043a\\u0443\\u043f\\u0438\\u0442\\u044c", "\\u043a\\u0443\\u043f\\u0443\\u0432\\u0430\\u043c", "\\u006b\\u00f6\\u0070", "\\u006b\\u00fa\\u0070\\u0069\\u0165", "\\u0073\\u0061\\u0074\\u0131\\u006e\\u0020\\u0061\\u006c"],
				reBuy = new RegExp('(?:^|\\s|_|-|\/)(?:' + cBuy.join('|') + ')(?:$|\\s|_|-|\/)', 'i')
				/** @desc word that accompanies the buy-word expressions **/
				,
				cWithBuy = ["now", "online", "acum", "nu", "\\u0441\\u0435\\u0433\\u0430"],
				reWithBuy = new RegExp(cWithBuy.join('|'), 'i'),
				reBuyNow = new RegExp('(?:^|\\s|_|-)(?:' + cBuy.join('|') + ')(?:\\s|_|-)?(?:' + cWithBuy.join('|') + ')(?:$|\\s|_|-)', 'i')
				/** @desc "pre-order" expressions **/
				,
				cPreOrder = ["pre[\\s\\-_]?order", "pre[\\s\\-_]?comada", "vorbestellt", "pedido[\\s\\-_]?anticipado", "vooraf[\\s\\-_]?bestellen", "pr[eé][\\s\\-_]?commande", "pre[\\s\\-_]?ordine", "pre[\\s\\-_]?sorrendben"],
				rePreOrder = new RegExp(cPreOrder.join('|'), 'i')
				/** @desc "price"-word expressions **/
				,
				cPriceWord = ["price", "pret", "precio", "prix", "prijs", "preis", "cena", "hind", "prezzo", "prijs", "fiyat", "our", "\\u00e1\\u0072", "\\u4fa1\\u683c", "\\u0446\\u0435\\u043d\\u0430", "\\u0070\\u0072\\u0065\\u00e7\\u006f"],
				rePriceWord = new RegExp('(' + cPriceWord.join('|') + ')', 'ig')
				/** @desc price identifiers that are found in class-names or tag-ids expressions **/
				,
				cPriceMarker = ["price", "pret", "sale", "now", "club", "total", "brightred"],
				rePriceMarker = new RegExp('(' + cPriceMarker.join('|') + ')', 'ig')
				/** @desc "out-of-stock" expressions **/
				,
				cOOS = ["sold[\\-_]?out", "currentlyunavailable", "outofstock", "stocepuizat", "indisponibil", "momentanindisponibil", "stocindisponibil", "agotado", "nondisponible", "niet ?op ?voorraad", "nicht ?auf ?lager", "stock ?finito", "uitverkocht", "sin ?stock", "fora ?de ?estoque", "fora ?de ?stock", "stock ?[e\\u00e9]puis[e\\u00e9]", "nema ?na ?zalihama", "\\u043d\\u0435\\u0442 ?\\u0432 ?\\u043d\\u0430\\u043b\\u0438\\u0447\\u0438\\u0438", "\\u0438\\u0437\\u0432\\u044a\\u043d ?\\u043d\\u0430\\u043b\\u0438\\u0447\\u043d\\u043e\\u0441\\u0442", "kifogyott", "ei ?ole ?saadaval", "stok ?t[u\\u00fc]kendi"],
				reOOS = new RegExp('(?:^|\\s|_|-)(?:' + cOOS.join('|') + ')(?:$|\\s|_|-)', 'i'),
				reListing = /\bprod|\listing|offer|deal|item/i,
				reLiTag = /^li$/i;
			/** **************** **/
			// TODO: decode html entities before testing with price regular expressions
			var TA_decoder = document.createElement('textarea'),
				decodeHtml = function (html) {
					TA_decoder.innerHTML = html;
					return TA_decoder.value;
				},
				cleanPrice = function (value) {
					var reNum = /([0-9,.:\-]+)/,
						m = value && value.replace(/\s+/, '').match(reNum) || [];
					if (m && m.length) {
						// Clean front and back commas and dots (and semi-colons for SEK)
						value = (m[1] || '').replace(/[:]|,\-/i, ',').replace(/^[,.]+/i, '').replace(/([,.]+)$/i, '');
						// Must be the decimals
						// Only zeroes
						if (!reNZ.test(value)) {
							value = '';
						}
					}
					else {
						return '';
					}
					return value;
				},
				cleanPriceMD = function (value) {
					var reNum = /([0-9,.:\-]+)/g,
						m = value && value.replace(/\s+/, '').match(reNum) || [];
					if (m && m.length) {
						// Clean front and back commas and dots (and semi-colons for SEK)
						value = (m[0] || '').replace(/[:]|,\-/i, ',').replace(/^[,.]+/i, '').replace(/([,.]+)$/i, '');
						// Must be the decimals
						if (m[1]) {
							value += (~value.indexOf('.') ? ',' : '.') + m[1];
						}
						// Only zeroes
						if (!reNZ.test(value)) {
							value = '';
						}
					}
					else {
						return '';
					}
					return value;
				},
				getCurrencyFromPrice = function (price) {
					var value = null;
					// Check again
					if (price) {
						var m = price.toString().replace(/\s+/g, '').match(/([^0-9.,:\-]+)?[0-9.,:\-]+([^0-9.,:\-]+)?/);
						value = m ? ($.trim(m[1]) || $.trim(m[2]) || '') : null;
					}
					return value;
				},
				currencySymbolToText = function (symbol) {
					if (isString(symbol)) {
						var tmp = mapCurrency[symbol.toLowerCase()];
						if (tmp) {
							return tmp;
						}
					}
					return symbol;
				},
				extractPriceAndCurrency = function (text, useGlobal) {
					var useRE = useGlobal ? reExtractPriceAndCurrencyGlobal : reExtractPriceAndCurrency,
						priceMatch = [],
						price, currency, priceCurrency;
					// Reset index
					useRE.lastIndex = 0;
					if (useGlobal) {
						var tmp;
						while (tmp = useRE.exec(text)) {
							priceMatch = tmp;
						}
					}
					else {
						priceMatch = useRE.exec(text) || [];
					}
					price = priceMatch[3] || priceMatch[4];
					currency = priceMatch[2] || priceMatch[5];
					priceCurrency = priceMatch[1];
					// Must contain digits
					if (priceCurrency && !/\d/.test(priceCurrency)) {
						priceMatch = null;
						priceCurrency = price = currency = '';
					}
					return priceCurrency ? {
						all: priceCurrency,
						price: price,
						currency: currency
					} : null;
				};
			/** Add 3 useful methods to $ prototype for currency/price extraction **/
			$.fn.parsePrice = function () {
				var text = '';
				$(this).each(function () {
					$(this).contents().each(function () {
						var jthis = $(this);
						if (jthis.is('sup')) {
							text += '.';
						}
						text += jthis.text().replace(/\s+/g, '');
					});
					text += (text != '') ? ' ' : '';
				});
				return text;
			};
			$.fn.price = function () {
				if (this.length) {
					var price = getPrice(this[0]).max;
					return price && price.priceMatch || '';
				}
				return '';
			};
			$.fn.priceOnly = function () {
				if (this.length) {
					var price = getPrice(this[0]).max;
					return price && price.value || '';
				}
				return '';
			};
			$.fn.currency = function () {
				if (this.length) {
					var price = getPrice(this[0]).max;
					return price && price.currency || '';
				}
				return '';
			};
			/** @desc DOM parsing methods **/
			var getAncestors = function (node, bottomUp, includeSelf) {
					var parents = [],
						traverse = includeSelf ? node : node.parentNode;
					bottomUp = (typeof bottomUp === 'undefined') ? true : bottomUp;
					while (traverse) {
						if (bottomUp) {
							parents.push(traverse);
						}
						else {
							parents.unshift(traverse);
						}
						traverse = traverse.parentNode;
					}
					return parents;
				},
				isDescendant = function (parent, child) {
					var node = child.parentNode;
					while (node != null) {
						if (node === parent) {
							return true;
						}
						node = node.parentNode;
					}
					return false;
				},
				getMutualParent = function (first, second, includeSelf, includeSiblings) {
					var firstParents = getAncestors(first, false, includeSelf),
						secondParents = getAncestors(second, false, includeSelf),
						size = Math.min(firstParents.length, secondParents.length),
						mutual = null,
						i = 0;
					for (; i < size; ++i) {
						if (firstParents[i] !== secondParents[i]) {
							return includeSiblings ? {
								first: firstParents[i],
								second: secondParents[i],
								mutual: mutual
							} : mutual;
						}
						mutual = firstParents[i];
					}
					return includeSiblings ? {
						first: mutual,
						second: mutual,
						mutual: mutual
					} : mutual;
				},
				makeDOMWalker = function (fromNode, whatToShow) {
					var reNoWhite = /^\s*$/,
						reNoScript = /script|style/i;
					return document.createTreeWalker(fromNode, whatToShow, function (node) {
						var elemNode = (node.nodeType == 1) ? true : false,
							nodeName = elemNode ? node.nodeName.toLowerCase() : '',
							parent = node.parentNode;
						// Ignore script tags
						if (
							(elemNode && reNoScript.test(nodeName)) || (parent && reNoScript.test(parent.nodeName))) {
							return window.NodeFilter.FILTER_REJECT;
						}
						// Logic to determine whether to accept, reject or skip node
						// In this case, only accept nodes that have content
						// other than white-space
						else {
							// Element node
							if (elemNode) {
								return window.NodeFilter.FILTER_ACCEPT;
							}
							// Text node
							else {
								if (!reNoWhite.test(node.data)) {
									return window.NodeFilter.FILTER_ACCEPT;
								}
							}
						}
						return window.NodeFilter.FILTER_REJECT;
					}, false);
				},
				toCCFn = function (all, letter) {
					return letter.toUpperCase();
				},
				unCCFn = function (all, letter) {
					return '-' + letter.toLowerCase();
				}
				// To camel-case from dash
				,
				toCC = function (str) {
					return str.replace(/^-ms-/, 'ms-').replace(/-([\da-z])/gi, toCCFn);
				}
				// From camel-case to dash
				,
				unCC = function (str) {
					return str.replace(/([\dA-Z])/g, unCCFn);
				},
				getCompStyle = function (el, prop) {
					var style = null;
					if (prop) {
						prop = unCC(prop);
						if (el.currentStyle) {
							style = el.currentStyle[prop];
						}
						else if (window.getComputedStyle) {
							style = document.defaultView.getComputedStyle(el, null).getPropertyValue(prop);
						}
					}
					return style;
				},
				compareNodes = function (el1, el2, deep, returnScore) {
					var score = 100,
						txt1 = String(el1.textContent || el1.innerText),
						txt2 = String(el2.textContent || el2.innerText);
					// Check text first
					if (txt1 !== txt2) {
						if (!returnScore) {
							return false;
						}
						score -= Math.abs(txt1.length - txt2.length) / 4;
					}
					// Different type
					if (el1.nodeType !== el2.nodeType) {
						if (!returnScore) {
							return false;
						}
						score -= 15;
					}
					// Different nodeName
					if (el1.nodeType != 3 && (el1.nodeName !== el2.nodeName)) {
						if (!returnScore) {
							return false;
						}
						score -= 15;
					}
					// Check number of children
					var el1ChLen = el1.childNodes.length,
						el2ChLen = el2.childNodes.length;
					// Different amount of children
					if (el1ChLen !== el2ChLen) {
						if (!returnScore) {
							return false;
						}
						score -= 5 * (Math.abs(el1ChLen - el2ChLen) / 2);
					}
					// Get first element
					if (el1.nodeType == 3) {
						el1 = el1.parentNode;
					}
					if (el2.nodeType == 3) {
						el2 = el2.parentNode;
					}
					// Check css styles
					var styles = ['display', 'fontSize', 'fontWeight', 'fontStyle', 'fontFamily', 'textDecoration', 'cursor', 'textAlign', 'padding', 'color', 'border', 'background', 'height', 'lineHeight'],
						css1 = $(el1).css(styles),
						css2 = $(el2).css(styles),
						i = 0,
						l = styles.length,
						s;
					for (; i < l; ++i) {
						s = styles[s];
						if (css1[s] !== css2[s]) {
							if (!returnScore) {
								return false;
							}
							score -= 5;
						}
					}
					var retVal = true;
					if (deep && el1ChLen && (el1ChLen === el2ChLen)) {
						for (i = 0; i < el1ChLen; ++i) {
							retVal = compareNodes(el1.childNodes[i], el2.childNodes[i], deep, returnScore);
							if (!retVal || returnScore) {
								if (!returnScore) {
									return false;
								}
								score = score - (100 - retVal);
							}
						}
					}
					return (returnScore ? score : retVal);
				},
				getPrice = function (fromNode) {
					!fromNode && (fromNode = body);
					var startTime = new Date().getTime(),
						maxNodes = 125,
						lastNode, lastImpNode, indexOOS = -1,
						priceOOS = 0,
						items = {
							max: null,
							nodes: []
						},
						nodes = items.nodes,
						domWalker = makeDOMWalker(fromNode, window.NodeFilter.SHOW_TEXT),
						nodeIndex = -1,
						joinMore = false,
						text = '',
						last = '',
						cntJoined = 0;
					// Go through the first 125 text nodes
					while (domWalker.nextNode() && nodes.length < maxNodes) {
						nodeIndex++;
						var node = domWalker.currentNode;
						// First node
						if (nodes.length % maxNodes === 0) {
							// Stayed too long - quit function
							if (new Date().getTime() - startTime > 1500) {
								return items;
							}
						}
						// Remove spaces and tabs (leave new-lines in place)
						text = node.data.replace(/\s+/g, '');
						// Parent is a script tag
						if ((text === '') || /script/i.test(node.parentNode.nodeName)) {
							nodes.splice(nodeIndex, 1);
							continue;
						}
						joinMore = false;
						// Test if the current text has price and currency
						var pMatch = extractPriceAndCurrency(text);
						// TODO:
						// 0. create function to check current node for digits/dots/commas/currencies/
						// 1. try to extract price and currency
						// 2. join with previous node text
						// 3. if ok
						// 3.1 add node BUT don't clear the 'last' variable so we can join some more
						// log('price match: ', node.nodeType, node.nodeName, node, text, priceMatch);
						// Extract last price from range
						if (pMatch && rePriceRange.test(text)) {
							var pRange = extractPriceAndCurrency(text, true);
							if (pRange) {
								pMatch = pRange;
							}
						}
						// If indexOOS has not been set and we found a OOS string then we set the index to number of price matches found before this match
						if ((indexOOS < 0) && reOOS.test(text) && test.getIsVisible()(node, {}) && test.AND(test.getIsWithinBounds(0, 800), test.NOT(test.getBelongsToNavigation()))(node, {})) {
							log('!! Out of stock index found in text: ', text, node);
							indexOOS = nodes.length;
						}
						// Found valid price match
						if (pMatch) {
							//log('Direct match: ', pMatch, '\n\tlast: ', last, '\n\ttext: ', text, '\n\tlastNode: ', lastNode, '\n\tnode: ', node, '\n\tcntJoined: ', cntJoined);
							// TODO: rethink logic without using domWalker.nextNode()
							// Last char is a dot or comma - join price strings with the next node in the list
							/* if (/[.,]$/g.test(pMatch.all) && domWalker.nextNode()) {
								var nextNode = domWalker.currentNode;
								if (nextNode && nextNode.data) {
									// Remove spaces
									var nextPrice = nextNode.data.replace(/\s/g, '');
									if (nextPrice && isNaN(parseFloat(nextPrice))) {
										nextPrice = '00';
									}
									priceCurrency += nextPrice;
									price += nextPrice;
								}
							}
							else { */
							// Allow to do further testing in case there is an adjacent element that matches the price rules
							if (!(last !== '') || (cntJoined > 0) || !reDigits.test(last)) {
								text = '';
								cntJoined = 0;
							}
							else {
								cntJoined++;
							}
							//}
							nodes.push({
								node: node,
								value: pMatch.price,
								currency: pMatch.currency,
								priceMatch: pMatch.all
							});
						}
						else {
							// Nothing todo atm
						}
						// No price match found, look for sibling texts and join them
						if (lastNode && (last !== '') && (text !== '')) {
							// Strip special price chars and digits from joined texts
							var strippedCurrency = (last + text).replace(/\d|\-|\.|,|:|\s/g, '');
							// Must match exact currency keyword
							if (reExactCurrency.test(strippedCurrency)) {
								// Get price and currency from joined text
								pMatch = extractPriceAndCurrency(last + text);
								// TODO: add logic from above for nodes ending in . or ,
								var mutual = null;
								// Valid price found
								if (pMatch) {
									// Check if price starts with comma or dot (or semi-colon for SEK)
									if (/^(,\-|[.,:])/.test(pMatch.price)) {
										mutual = getMutualParent(lastNode, node);
										// Redo the price matching on the text of the element
										var elemPriceMatch = extractPriceAndCurrency(mutual.textContent || mutual.innerText || '');
										if (elemPriceMatch) {
											pMatch = elemPriceMatch;
										}
									}
									var pushNode = node;
									// Last text contains digits
									if (reDigits.test(last) && (reNZ.test(last) || !reStartDecimals.test(last))) {
										// Last node text was joined previously
										if (lastNode.data.replace(/\s+/g, '') !== last) {
											mutual = mutual || getMutualParent(lastNode, node);
											// Add whichever has the fontSize bigger
											pushNode = (parseFloat($(mutual).css('fontSize')) > parseFloat($(lastNode.parentNode).css('fontSize'))) ? mutual : lastNode;
										}
										else {
											pushNode = lastNode;
										}
									}
									nodes.push({
										// Add the most important node
										node: pushNode,
										value: pMatch.price,
										currency: pMatch.currency,
										priceMatch: pMatch.all
									});
									// Reset the last node text
									last = '';
									// Reset current node text
									if (cntJoined > 0) {
										cntJoined = 0;
										text = '';
									}
									else {
										cntJoined++;
									}
								}
								// Still need more text joins
								else if (reDigits.test(last) && reDigits.test(text)) {
									var lastParent = (lastNode.nodeType == 3) ? lastNode.parentNode : lastNode,
										thisParent = (node.nodeType == 3) ? node.parentNode : node,
										font1 = parseFloat($(lastParent).css('fontSize')),
										font2 = parseFloat($(thisParent).css('fontSize')),
										nSmall = /sub|sup/i.test(thisParent.nodeName),
										lSmall = /sub|sup/i.test(lastParent.nodeName);
									// TODO: use lastImpNode here to compare fontSize and store the node with the biggest font-size
									var lastText = text;
									//if ( (font1 > font2) || /sub|sup/i.test(thisParent.nodeName) ) {
									var reLastChar = /((?:,\-$)|[.,:]+$)/,
										lastCharMatch = last.match(reLastChar),
										lastChar = '';
									// Price seems to end in special chars
									if (lastCharMatch) {
										lastChar = lastCharMatch[1];
										reLastChar.lastIndex = 0;
										last = last.replace(reLastChar, '');
									}
									reLastChar = /(^(?:,\-)|^[.,:]+)/;
									lastCharMatch = text.match(reLastChar)
									// Price seems to start in special chars
									if (lastCharMatch) {
										lastChar = lastCharMatch[1];
										reLastChar.lastIndex = 0;
										text = text.replace(reLastChar, '');
									}
									// The following font size is smaller that the last
									if ((font2 <= (0.7 * font1)) || nSmall) {
										lastChar = '.';
										text = text.replace(reLastChar, '');
									}
									// log('Join more: ', last + lastChar + text, lastNode, node, font1, font2);
									last = last + lastChar + text;
									joinMore = true;
									//}
								}
								else {
									// Nothing todo atm
								}
							}
						}
						lastNode = node;
						last = joinMore ? last : text;
					}
					var max, maxNode, i = 0,
						n, score, nodesLength = nodes.length;
					for (; i < nodesLength; ++i) {
						n = nodes[i];
						score = getScore(n, i);
						n.score = score;
						// Trying to see if we found a positive price before we found a OOS match
						if ((i < indexOOS) && (score > 0)) {
							priceOOS = 1;
						}
						// Set our current max price
						if ((items.max == null) || (score > items.max.score)) {
							items.max = n;
						}
					}
					// log('ITEMS: ', items);
					if (items.max && items.max.node) {
						// Items doesn't have price set (only out of stock message)
						if (indexOOS >= 0) {
							items.max.oos = true;
							if (!priceOOS) {
								items.max.value = null;
							}
						}
					}
					return items;
				},
				getScore = function (data, index) {
					var domNode = data.node;
					var element = (domNode.nodeType == 3) ? domNode.parentNode : domNode;
					var price = data.value;
					var priceCurrency = data.priceMatch;
					// Text node is inside a script tag
					if (/script/i.test(element.nodeName)) {
						return null;
					}
					logscore(domNode, '>>>> $BEGIN Score for NODE: ', element);
					var reMainTags = /^(h1|h2|h3|b|strong|sale)$/i,
						reAnchorTag = /^a$/i,
						reInvalidPricePositionTag = /header|more|nav|items|under|cart\b|upsell|original\b/i;
					// Get text content
					var content = (domNode.nodeType == 3) ? domNode.data : (domNode.textContent || domNode.innerText),
						contentNoWs = content.replace(/\s+/g, '');
					var $elem = $(element),
						score = 0,
						css = $elem.css(['fontSize', 'fontWeight', 'textDecoration', 'visibility', 'display']);
					// Get font-weight as literal value
					// css['fontWeight'] = getCompStyle(element, 'font-weight');
					// Plus one for bolded prices
					if (css.fontWeight) {
						var cssFW = String(css.fontWeight);
						if ((cssFW >= 500) || /bold/i.test(cssFW)) {
							score += 1;
							logscore(domNode, '>> [GOOD] +1 bold font found with cssFW: ', cssFW, ' new score: ', score);
						}
					}
					// Element is not visible
					if ((!element.offsetWidth && !element.offsetHeight) || (css.visibility === 'hidden') || (css.display === 'none')) {
						score -= 100;
						logscore(domNode, '>> [BAD] -100 element is hidden: Elem offset sum = ', element.offsetWidth + element.offsetHeight, 'css.visibility = ', css.visibility, 'css.display = ', css.display, ' new score: ', score);
					}
					// Only zeroes found in price - must be invalid
					if (!reNZ.test(price)) {
						score -= 100;
						logscore(domNode, '>> [BAD] -100 only zeroes in price string: ', price, ' new score: ', score);
					}
					if (rePriceRange.test(contentNoWs)) {
						score += 2;
						logscore(domNode, '>> [GOOD] +2 rePriceRange match with content: ', contentNoWs, ' new score: ', score);
					}
					// Decimals found in price
					if (reDecimals.test(price)) {
						score += 2;
						logscore(domNode, '>> [GOOD] +2 reDecimals match with price: ', price, ' new score: ', score);
					}
					logscore(domNode, '>> offset score reduce by: ', Math.abs($elem.offset().top / 500), ' prev score: ', score, ' new score: ', score - Math.abs($elem.offset().top / 500));
					score -= Math.abs($elem.offset().top / 500);
					// Add font-size to the final score
					score += parseFloat(css.fontSize);
					logscore(domNode, '>> increase score by fontSize: ', parseFloat(css.fontSize), ' new score: ', score);
					if (reInvalidPricePositionTag.test(content)) {
						score -= 4;
						logscore(domNode, '>> [BAD] -4 reInvalidPricePositionTag match with content: ', content, ' new score: ', score);
					}
					if (rePriceMarker.test(content)) {
						score += 1;
						logscore(domNode, '>> [GOOD] +1 reInvalidPricePositionTag match with content: ', content, ' new score: ', score);
					}
					// Remove price keywords from content
					var contentNoWsNoPrice = contentNoWs.replace(rePriceWord, '');
					// There is no other extra text in the node except for the price
					if (contentNoWsNoPrice.length < (priceCurrency.length * 2 + 6)) {
						score += 10;
						logscore(domNode, '>> [GOOD] +10 {priceCurrency: ', priceCurrency, '} contentNoWsNoPrice match with contentNoWsNoPrice: ', contentNoWsNoPrice, ' length: ', contentNoWsNoPrice.length, ' must be smaller than: ', (priceCurrency.length * 2 + 6));
					}
					// This node is displayed in a listing and there are similar nodes also
					if (test.getInListing()(domNode, {})) {
						score -= 6;
						logscore(domNode, '>> [BAD] -6 this node belongs to a listing');
					}
					var parentsWalked = 0,
						className, $node = $elem,
						origNode = domNode;
					domNode = element;
					// Walk 4 parents maximum up until the body element
					while (domNode != null && domNode !== document.body && parentsWalked < 4) {
						if (parentsWalked !== 0) {
							$node = $(domNode);
							css = $node.css(['textDecoration']);
						}
						logscore(origNode, '[current score: ' + score + '] ** checking parent ** ', domNode);
						// Get class name
						className = $node.attr('class');
						if (rePriceMarker.test(domNode.id)) {
							score += 1;
							logscore(origNode, 'parent: ', domNode, '>> [GOOD] +1 rePriceMarker.test(ID): ', domNode.id, ' new score: ', score);
						}
						if (rePriceMarker.test(className)) {
							score += 1;
							logscore(origNode, 'parent: ', domNode, '>> [GOOD] +1 rePriceMarker.test(CLASS): ', className, ' new score: ', score);
						}
						if (reMainTags.test(domNode.nodeName)) {
							score += 1;
							logscore(origNode, 'parent: ', domNode, '>> [GOOD] +1 reMainTags.test(nodeName): ', domNode.nodeName, ' new score: ', score);
						}
						if (reInvalidPricePositionTag.test(domNode.nodeName)) {
							score -= 1;
							logscore(origNode, 'parent: ', domNode, '>> [BAD] -1 reInvalidPricePositionTag.test(nodeName): ', domNode.nodeName, ' new score: ', score);
						}
						if (reInvalidPricePositionTag.test(domNode.id)) {
							score -= 2;
							logscore(origNode, 'parent: ', domNode, '>> [BAD] -2 reInvalidPricePositionTag.test(ID): ', domNode.id, ' new score: ', score);
						}
						if (reInvalidPricePositionTag.test(className)) {
							score -= 2;
							logscore(origNode, 'parent: ', domNode, '>> [BAD] -2 reInvalidPricePositionTag.test(CLASS): ', className, ' new score: ', score);
						}
						// Remove points for being an anchor tag
						if (reAnchorTag.test(domNode.nodeName)) {
							score -= 5;
							logscore(origNode, 'parent: ', domNode, '>> [BAD] -5 reAnchorTag.test(nodeName): ', domNode.nodeName, ' new score: ', score);
						}
						// Remove points for having line-through
						if (css.textDecoration && /line-through/i.test(css.textDecoration)) {
							score -= 100;
							logscore(origNode, 'parent: ', domNode, '>> [BAD] -100 textDecoration.test(CSS): ', css.textDecoration, ' new score: ', score);
						}
						// Go through children
						for (var i = 0, ch = domNode.childNodes, len = ch.length; i < len; ++i) {
							var tnode = ch[i];
							// Is text node
							if ((tnode.nodeType == 3) && (tnode.data)) {
								if (rePriceMarker.test(tnode.data)) {
									score += 1;
									logscore(origNode, 'parent: ', domNode, ' > Test child:', tnode, '>> [GOOD] +1 rePriceMarker.test(DATA): ', tnode.data, ' new score: ', score);
								}
								if (reInvalidPricePositionTag.test(tnode.data)) {
									score -= 1;
									logscore(origNode, 'parent: ', domNode, ' > Test child:', tnode, '>> [BAD] -1 reInvalidPricePositionTag.test(DATA): ', tnode.data, ' new score: ', score);
								}
							}
						}
						logscore(origNode, ' on parent: ', domNode, ' Current score => ', score);
						parentsWalked++;
						// Get next parent
						domNode = domNode.parentNode;
					}
					// Adjust score based on text content (more text - less score)
					score -= content.length / 100;
					// Adjust score based on the position in the DOM (more traversal - less score)
					score -= index / 5;
					logscore(origNode, '<<<< $END Score for NODE: ', element, 'FINAL SCORE: ', score, '\n');
					return score;
				};
			/** @desc *** The Tester class *** **/
			// Tester class
			function Tester() {
				this._debugTest = {};
			}
			var Tproto = Tester.prototype;
			Tproto.addDebug = function (type, testSuite, testSuiteNames) {
				var testID = uniqueID(),
					test = this._getFn(testSuite, (type === 'AND') ? true : false, NS.debug_mode ? testID : null),
					d, tst = this;
				// Only if debug_mode is enabled to speed up things otherwise
				if (NS.debug_mode) {
					d = this._debugTest[testID] = {};
					log('* Adding test to the debug list [' + testID + ']: ');
					return function (node, data) {
						d = tst._debugTest[testID] = {
							test: test,
							type: type
						};
						var testResult = d.result = test(node, data),
							a = (testResult) ? d.success : d.fail,
							fnID = (testSuiteNames && testSuiteNames[a.id]) ? ('(' + a.id + ') ' + testSuiteNames[a.id]) : a.id,
							fnName = String(a.fn).match(/'!name:(\w+)!';/)[1];
						d.fnID = fnID;
						d.fnName = fnName;
						logfail(node, '* ' + (testResult ? 'SUCCESS' : 'FAILED') + ' * [' + testID + ']', 'fn: [' + fnID + ', ' + fnName + ']', d, a);
						return testResult;
					}
				}
				else {
					return test;
				}
			};
			// Wrapper for creating function that runs multiple tests using AND/OR expressions
			Tproto._getFn = function (tests, withAND, debugID) {
				var tst = this;
				if (withAND == null) {
					withAND = true;
				}
				return function (node, data) {
					'!name:_getFn!';
					var test;
					for (var i = 0, len = tests.length; i < len; ++i) {
						test = tests[i];
						if (test(node, data)) {
							if (!withAND) {
								if (debugID) {
									tst._debugTest[debugID]['success'] = {
										id: i,
										fn: test,
										node: node,
										data: data
									};
								}
								return true;
							}
						}
						else {
							if (withAND) {
								if (debugID) {
									tst._debugTest[debugID]['fail'] = {
										id: i,
										fn: test,
										node: node,
										data: data
									};
								}
								return false;
							}
						}
					}
					if (debugID) {
						tst._debugTest[debugID][withAND ? 'success' : 'fail'] = {
							id: len - 1,
							fn: test,
							node: node,
							data: data
						};
					}
					return withAND;
				};
			};
			// Retrieve text/html and add it to the data object
			Tproto._setData = function (node, data, from) {
				// Get string from text attributes by defaults
				if (!from) {
					from = 'text';
				}
				// Data has already been set, nothing to do
				if (typeof data[from] !== 'undefined') {
					return;
				}
				// Set data from text attributes
				if (from === 'text') {
					data.text = (node.alt || node.textContent || node.innerText || node.value || node.title || node['node' + 'Value'] || '').replace(/\s+/ig, ' ');
				}
				// Set data from html string
				else if (from === 'html') {
					data.html = (node.innerHTML || '').replace(/\s+/ig, ' ');
				}
			};
			// Create function that runs multiple test functions using OR expression
			Tproto.OR = function () {
				return this._getFn(arguments, false);
			};
			// Create function that runs multiple test functions using AND expression
			Tproto.AND = function () {
				return this._getFn(arguments, true);
			};
			// Create function that runs one test function against the node and it's parents using OR expression
			Tproto.OR_parents = function (test, maxParents, saveReferenceName) {
				return function (node, data) {
					'!name:OR_parents!';
					var currentNode = node;
					var i = 0;
					while (currentNode && i <= maxParents) {
						if (test(currentNode, {})) {
							if (saveReferenceName != null && data != null) {
								data[saveReferenceName] = currentNode;
							}
							return true;
						}
						currentNode = currentNode.parentNode;
						i++;
					}
					return false;
				};
			};
			// Create function that runs one test function against the node and it's children using OR expression
			Tproto.OR_children = function (test, maxChildren, saveReferenceName) {
				return function (node, data) {
					'!name:OR_children!';
					// Test node first
					if (test(node, data)) {
						return true;
					}
					var nodes = [];
					// Add first child
					if (node.childNodes && node.childNodes.length) {
						nodes.push(node.childNodes[0]);
					}
					// Go through all nodes (while adding more children)
					while (nodes.length) {
						// Remove the last element (always go backwards)
						var child = nodes.pop();
						// Run test
						if (test(child, {})) {
							if (saveReferenceName != null && data != null) {
								data[saveReferenceName] = currentNode;
							}
							return true;
						}
						// Check child's children
						if (child.childNodes && child.childNodes.length && nodes.length < maxChildren) {
							// Add immediate sibling too
							if (child.nextSibling) {
								nodes.push(child.nextSibling);
							}
							// Add child's first child
							nodes.push(child.childNodes[0]);
						}
						else {
							// Only add the sibling
							if (child.nextSibling) {
								nodes.push(child.nextSibling);
							}
						}
					}
					return false;
				};
			};
			// Return the opposite boolean value of one test
			Tproto.NOT = function (test) {
				return function (node, data) {
					'!name:NOT!';
					return !test(node, data);
				};
			};
			// Create function that runs a regular expression against a node's text/html
			Tproto.getTextReg = function (regex, from, setData) {
				if (!from) {
					from = 'text';
				}
				var tst = this;
				//var args = arguments;
				return function (node, data) {
					'!name:getTextReg!';
					tst._setData(node, data, from);
					// Make sure we reset the regexp in case it's global
					regex.lastIndex = 0;
					var srcIndex = (data && data[from] || '').search(regex);
					if (setData != null) {
						if (!data[setData]) {
							data[setData] = [];
						}
						data[setData].push(srcIndex);
					}
					var retVal = (srcIndex >= 0) ? true : false;
					// if (!retVal) { logfail(node, '@@Failed Tester.getTextReg with arguments', args); }
					return retVal;
				};
			};
			// Create function that tests if the current node's text is equal to a regular expression match
			Tproto.getEqualTextReg = function (regex, from) {
				if (!from) {
					from = 'text';
				}
				var tst = this;
				return function (node, data) {
					'!name:getRegEqualText!';
					tst._setData(node, data, from);
					// Reset regexp index
					regex.lastIndex = 0;
					var d = data && data[from] || '',
						m = d.match(regex);
					if (m && m[0] === d) {
						return true;
					}
					return false;
				};
			};
			// Create function that runs a regular expression against a node's style property
			Tproto.getCSSReg = function (styles, regex) {
				//var args = arguments;
				// Make array
				if (isString(styles)) {
					styles = [styles];
				}
				return function (node, data) {
					'!name:getCSSReg!';
					// Text node - get parent element
					if (node.nodeType === 3) {
						node = node.parentNode;
					}
					var retVal = true;
					if (!node.nodeName || node.nodeName === 'HTML') {
						retVal = false;
					}
					else {
						!data.css && (data.css = {});
						data.css = $.extend({}, data.css, $(node).css(styles));
						$.each(data.css, function (i, v) {
							// Make sure we reset the regexp in case it's global
							regex.lastIndex = 0;
							if (!regex.test(v)) {
								retVal = false;
								// if (!retVal) { logfail(node, '@@Failed Tester.getCSSReg with arguments', args); }
								return false;
							}
						});
					}
					// if (!retVal) { logfail(node, '@@Failed Tester.getCSSReg with arguments', args); }
					return retVal;
				};
			};
			// Create function that runs a regular expression against a node's properties
			Tproto.getPropReg = function (regex, props, setData) {
				//var args = arguments;
				// Set default props
				if (!props) {
					props = ['id', 'className', 'href', 'action', 'src'];
				}
				// Make props array
				else if (isString(props)) {
					props = [props];
				}
				return function (node, data) {
					'!name:getPropReg!';
					// Text node
					if (node && node.nodeType == 3) {
						node = node.parentNode;
					}
					if (node) {
						var p, n, i = 0,
							len = props.length;
						for (; i < len; ++i) {
							p = props[i];
							try {
								n = node[p];
							}
							catch (ex) {
								log('getPropReg error: ', ex);
							}
							finally {
								if (p === 'className' || p === 'href' || p === 'value' || p === 'checked' || p === 'tagName' || p === 'nodeName' || p === 'nodeType' || p === 'nodeValue') {
									n = node[p];
								}
								else {
									n = (node.getAttribute && node.getAttribute(p)) || null;
								}
							}
							// Got property
							if (n && n.search) {
								var srcIndex = -1;
								// Make sure we reset the regexp in case it's global
								regex.lastIndex = 0;
								// Look in URIs
								if (p === 'href' || p === 'src' || p === 'action') {
									// Remove origin
									srcIndex = n.replace(/^http(s)*:\/\/.*?\//, '').search(regex);
								}
								else {
									srcIndex = n.search(regex);
								}
								// Positive match
								if (srcIndex >= 0) {
									// Links back to the same page
									if ((p == 'href') && (node.href.indexOf(docURL) >= 0)) {
										// logfail(node, '@@Failed Tester.getPropReg with arguments', args);
										return false;
									}
									// Save index for later comparison
									if (setData != null) {
										if (!data[setData]) {
											data[setData] = [];
										}
										data[setData].push(srcIndex);
									}
									return true;
								}
							}
						}
					}
					// logfail(node, '@@Failed Tester.getPropReg with arguments', args);
					return false;
				};
			};
			// Create function that runs a regular expression against a node's properties
			Tproto.getLinkReg = function (regex, setData) {
				//var args = arguments;
				var props = ['href', 'action', 'src'];
				return function (node, data) {
					'!name:getLinkReg!';
					// Text node
					if (node && node.nodeType == 3) {
						node = node.parentNode;
					}
					if (node) {
						var p, n, i = 0,
							len = props.length,
							str, m;
						for (; i < len; ++i) {
							p = props[i];
							n = node[p];
							// Got property
							if (n && n.match) {
								// Make sure we reset the regexp in case it's global
								regex.lastIndex = 0;
								m = n.match(regex);
								// Positive match
								if (m) {
									// Save index for later comparison
									if (setData != null) {
										if (!data[setData]) {
											data[setData] = [];
										}
										data[setData].push(m[0]);
									}
									return true;
								}
							}
						}
					}
					// logfail(node, '@@Failed Tester.getLinkReg with arguments', args);
					return false;
				};
			};
			// Create function that determines the max-spread of one property for the current node
			Tproto.getPropMaxSpread = function (test, prop, value) {
				//var args = arguments;
				return function (node, data) {
					'!name:getPropMaxSpread!';
					var retVal = test(node, data) && ((Math.max.apply(Math, data[prop]) - Math.min.apply(Math, data[prop])) < value);
					// if (!retVal) { logfail(node, '@@Failed Tester.getPropMaxSpread with arguments', args); }
					return retVal;
				};
			};
			// Create function that validates the maximum length of a node's text/html string
			Tproto.getTextLength = function (maxLength, from) {
				if (!from) {
					from = 'text';
				}
				var tst = this;
				//var args = arguments;
				return function (node, data) {
					'!name:getTextLength!';
					// Make sure we have texts
					tst._setData(node, data, from);
					var retVal = Boolean(data && data[from] && (data[from].length <= maxLength));
					// if (!retVal) { logfail(node, '@@Failed Tester.getTextLength with arguments', args); }
					return retVal;
				};
			};
			// Create function that determines if the current node is visible
			Tproto.getIsVisible = function () {
				//var args = arguments;
				return function (node, data) {
					'!name:getIsVisible!';
					if (node.nodeType === 3) {
						node = node.parentNode;
					}
					if (node.nodeName && /img/i.test(node.nodeName) && !node.complete) {
						return true;
					}
					var retVal = (node.offsetWidth && node.offsetHeight && (node.offsetWidth > 2 || node.offsetHeight > 2)) ? true : false;
					// if (!retVal) { logfail(node, '@@Failed Tester.getIsVisible with arguments', args); }
					return retVal;
				};
			};
			// Create function that determines if the current node is a text-node or contains only text-nodes
			Tproto.getIsTypeText = function () {
				//var args = arguments;
				return function (node, data) {
					'!name:getIsTypeText!';
					// Is already a textNode
					if (node.nodeType === 3) {
						return true;
					}
					var cn = node.childNodes,
						len, i;
					// Check children
					if (cn && (len = cn.length)) {
						for (i = 0; i < len; ++i) {
							// Is element nodeType
							if (cn[i].nodeType === 1) {
								// logfail(node, '@@Failed Tester.getIsTypeText with arguments', args);
								return false;
							}
						}
					}
					// logfail(node, '@@Failed Tester.getIsTypeText with arguments', args);
					return false;
				};
			};
			// Create function that determines if the current node contains the specified attribute
			Tproto.getHasAttribute = function (prop) {
				//var args = arguments;
				return function (node, data) {
					'!name:getHasAttribute!';
					var retVal = Boolean((node.wrappedJSObject) ? node.wrappedJSObject[prop] : node[prop]);
					// if (!retVal) { logfail(node, '@@Failed Tester.getHasAttribute with arguments', args); }
					return retVal;
				};
			};
			// Create function that determines if the current node is within the given bounds of the document view-port
			Tproto.getIsWithinBounds = function (minY, maxY, minX, maxX) {
				//var args = arguments;
				return function (node, data) {
					'!name:getIsWithinBounds!';
					if (node.nodeType === 3) {
						node = node.parentNode;
					}
					var offsetY = node.offsetTop;
					var offsetX = node.offsetLeft;
					while (node.offsetParent) {
						node = node.offsetParent;
						offsetY += node.offsetTop;
						offsetX += node.offsetLeft;
					}
					var retVal = !((offsetY < minY) || (offsetY >= maxY) || (offsetX < minX) || (offsetX >= maxX));
					// if (!retVal) { logfail(node, '@@Failed Tester.getIsWithinBounds with arguments', args); }
					return retVal;
				};
			};
			// Create function that matches the document domain against a regular expression
			Tproto.getMatchDomainReg = function (regex) {
				//var args = arguments;
				return function () {
					'!name:getMatchDomainReg!';
					var retVal = regex.test(domain) ? true : false;
					// if (!retVal) { logfail(node, '@@Failed Tester.getMatchDomainReg with arguments', args); }
					return retVal;
				};
			};
			// Create function that matches the document URL against a regular expression
			Tproto.getMatchUrlReg = function (regex) {
				//var args = arguments;
				return function () {
					'!name:getMatchUrlReg!';
					var retVal = regex.test(docURL) ? true : false;
					// if (!retVal) { logfail(node, '@@Failed Tester.getMatchUrlReg with arguments', args); }
					return retVal;
				};
			};
			// Create function that tests if the current node is found inside a navigation container
			Tproto.getBelongsToNavigation = function () {
				var tst = this;
				return function (node, data) {
					'!name:getBelongsToNavigation!';
					return tst.OR(tst.OR_parents(tst.getPropReg(/susmenu|rcm|seemore|header|bread[\-_]?crumb|heading|ad_|\bad\b|\bnav(?:iga|\-|_)|top[\s\-_]*nav/i, ['id', 'className']), 15),
						// tst.tst.getPropReg(/\bnofollow\b/i, ['rel']),
						tst.OR_parents(tst.getPropReg(/menu/i, ['id', 'className']), 3), tst.OR_parents(tst.getPropReg(/\bheader\b|\bnav\b/i, ['nodeName']), 9))(node, data);
				};
			};
			// Create function that tests if the current node is a clickable object
			Tproto.getClickable = function () {
				var tst = this,
					testNodeClickable = tst.OR(tst.getPropReg(/^input|button|a$/i, ['nodeName']), tst.getHasAttribute('onclick'));
				return function (node, data) {
					'!name:getClickable!';
					return tst.OR(tst.getCSSReg('cursor', /pointer/i), testNodeClickable, tst.OR_children(testNodeClickable), tst.OR_parents(testNodeClickable, 4))(node, data);
				};
			};
			// Create function that tests if the current node contains a maximum number of price nodes
			Tproto.getHasPrice = function (maxCount) {
				var tst = this;
				return function (node, data) {
					'!name:getHasPrice!';
					var prc = getPrice(node);
				};
			};
			// Create function that tests if the current node belongs to a listing
			Tproto.getInListing = function () {
				var tst = this;
				return function (node, data) {
					'!name:getInListing!';
					!data && (data = {});
					var isInList = tst.OR(tst.OR_parents(tst.getPropReg(reLiTag, ['nodeName']), 7, 'listNode'), tst.OR_parents(tst.getPropReg(reListing, ['className', 'id']), 5, 'listNode'))(node, data);
					// Found list node
					if (isInList && data && data.listNode) {
						var sib = $(data.listNode).siblings();
						if (sib.length) {
							var score = compareNodes(data.listNode, sib[0], false, true);
							if (score >= 85) {
								return true;
							}
							return false;
						}
					}
					return false;
				};
			};
			// Create function that tests if the current node belongs to a listing
			Tproto.getMatchUrlPathList = function () {
				//var args = arguments;
				var regex = /\/((after[\-_]?)?checkout|(?:shop(?:ping)?[\-_]?)?cart|(?:\w+[\-_]?)?login|sign[\-_]?in|(:?my[\-_]?)?account|(?:\w+[\-_]?)?admin|(?:\w+[\-_]?)?wish[\-_]?list|prod(?:[a-z\-_]*?)list)/i
				return function (path) {
					'!name:getMatchUrlPathList!';
					var retVal = regex.test(path) ? true : false;
					// if (!retVal) { logfail(node, '@@Failed Tester.getMatchUrlPathList with arguments', args); }
					return retVal;
				};
			};
			// The tester object
			var test = new Tester(),
				basicBodyTest, fullPageTest;
			// First (quick) test to determine we're on the right page
			function getBodyTest(refresh) {
				if (!basicBodyTest || refresh) {
					basicBodyTest = test.addDebug('OR', [
						test.AND(test.getTextReg(reAdd, 'html'), test.getTextReg(reCart, 'html')),
						test.AND(test.getTextReg(reBuy, 'html'), test.getTextReg(reWithBuy, 'html')),
						test.getTextReg(rePreOrder, 'html'),
						test.getTextReg(reAddToCart, 'html')
					], ['body-test-add+cart-kw', 'body-test-buy+now-kw', 'body-test-preorder-kw', 'body-test-addToCart-kw']);
				}
				return basicBodyTest;
			}
			// Prepare a full set of tests to determine if the current page is actually a product page
			function getFullPageTest(refresh) {
				if (!fullPageTest || refresh) {
					var testAttrs = ['className', 'id', 'title', 'name', 'alt', 'value', 'src', 'href', 'onclick'],
						testCssBg = test.OR(test.getCSSReg('background', reBuy), test.getCSSReg('background', reAdd));
					var alltests = [
						// TEST-0 [text-OR-addToCart] :: Check if text node or some attributes contain cart keywords
						test.OR(test.getIsTypeText(), test.getTextReg(reAddToCart), test.getPropReg(reAddToCart, testAttrs), test.AND(test.getTextReg(reBuy), test.OR(test.getPropReg(reBuy, testAttrs), test.getPropReg(reCart, testAttrs), test.getPropReg(reAddToCart, testAttrs))),
							// Get text from background image
							testCssBg,
							// Check if the 'Add' text is found inside an a/button/input tag
							test.AND(test.getPropReg(/\b(?:a|input|button)\b/i, ['nodeName']), test.OR(test.getPropReg(reAdd, ['textContent', 'innerText', 'value']), test.getPropReg(reBuy, ['textContent', 'innerText', 'value']), test.getPropReg(reBuyNow, ['textContent', 'innerText', 'value'])))),
						// TEST-1 [visibility-check] :: Node must be visible
						test.getIsVisible(),
						// TEST-2 [OR-props] :: Check properties for cart patterns
						test.OR(
							// Check most important attributes
							test.getPropReg(reAddToCart, ['id', 'className']),
							// Special check for several keywords (add and cart) making sure the length is within acceptable limits
							test.AND(test.getTextReg(reAdd), test.getTextReg(reCart), test.getTextLength(30)),
							// Special check for several keywords (buy online) making sure the length is within acceptable limits
							test.AND(test.getTextReg(reBuy), test.getTextReg(reWithBuy), test.getTextLength(20)),
							// Special check for several keywords (pre-order)
							test.AND(test.getTextReg(rePreOrder), test.getTextLength(16)), test.getPropMaxSpread(test.AND(test.OR(test.getTextReg(reBuy, null, 'index-solo-buy')), test.OR(test.getPropReg(reBuy, testAttrs, 'index-solo-buy'), test.getPropReg(reCart, testAttrs, 'index-solo-buy'), test.getPropReg(reAddToCart, testAttrs, 'index-solo-buy'), test.getPropReg(reBuyNow, testAttrs, 'index-solo-buy'))), 'index-solo-buy', 10),
							// Determine if the buy now keywords are spread thin
							test.getPropMaxSpread(test.AND(test.getPropReg(reBuy, null, 'index-buy'), test.getPropReg(reWithBuy, null, 'index-buy')), 'index-buy', 10),
							// Determine if the add cart keywords are spread thin
							test.getPropMaxSpread(test.AND(test.getPropReg(reAdd, null, 'index-add'), test.getPropReg(reCart, null, 'index-add')), 'index-add', 10),
							// Check for pre-order keyword within prop names
							test.getPropReg(rePreOrder),
							// Check for add-to-cart keyword inside href/src/action props
							test.getLinkReg(reAddToCart),
							// Get text from background image
							testCssBg,
							// Check if the text is equal tu the match sub-string of the regular expression - used in conjunction with the last test of the first set
							test.getEqualTextReg(reAdd)),
						// TEST-3 [bounds-check] :: Make sure node is visible enough (no page scroll) (excluding foreign sites)
						test.OR(test.getIsWithinBounds(0, 900), test.getMatchDomainReg(/\.jp$/)),
						// TEST-4 [nav-check] :: Node must not be within a navigation menu
						test.NOT(test.getBelongsToNavigation()),
						// TEST-5 [clickable-check] :: Node must be clickable
						test.getClickable(),
						// TEST-6 [NOT-map|area] :: Node must not be within a map|area parent tag
						test.NOT(test.OR_parents(test.getPropReg(/map|area/i, ['nodeName']), 4)),
						// TEST-7 [NOT-in-listing] :: Node must not be in a top-nav listing
						test.OR(test.AND(test.getIsWithinBounds(0, 150), test.NOT(test.getInListing())), test.getIsWithinBounds(0, 2000))
					];
					fullPageTest = test.addDebug('AND', alltests, ['text-OR-addToCart', 'visibility-check', 'OR-props', 'bounds-check', 'nav-check', 'clickable-check', 'NOT-map|area', 'NOT-in-listing']);
				}
				return fullPageTest;
			}
			// Create a simple fast test to determine if we should continue with further testing
			function ifProductPage(startNode, success, fail) {
				var reason = {
					is_pp: -1,
					code: 0,
					from: 'prod-page-rules',
					msg: null
				};
				// Increment detection count
				PageParser.detectionCount++;
				// Shift arguments
				if (typeof startNode === 'function') {
					fail = success;
					success = startNode;
					startNode = null;
				}
				if (!startNode || !startNode.nodeType) {
					startNode = body;
				}
				try {
					if (!(location && location.hostname)) {
						reason.code = 553;
						reason.is_pp = 0;
						reason.msg = 'Location missing';
						fail && fail(reason);
						return;
					}
				}
				catch (e) {
					reason.code = 554;
					reason.msg = 'Location error!';
					reason.exception = e;
					fail && fail(reason);
					return;
				}
				if (/mozilla\.org/.test(domain) || (/apple\.(.*?)$/.test(domain) && /^\/startpage\/$/.test(location.pathname)) || test.getMatchUrlPathList()(location.pathname)) {
					reason.code = 552;
					reason.is_pp = 0;
					reason.msg = 'Invalid product page URL';
					fail && fail(reason);
					return;
				}
				// A(m)(a)(zo)(n) product page/general
				if (/(\/((product)|(dp)|(gp))\/)|productid=|[\/\?]produs[\/=]/i.test(docURL) && !/http[s]?:\/\/(www)?fares\.ro/i.test(docURL) && !/produ(s|ctid)=($|&)/i.test(docURL) && !/image/i.test(docURL)) {
					reason.code = 50;
					reason.is_pp = 1;
					reason.msg = 'Valid product page URL';
					success && success(reason);
					return;
				}
				// Check redirects from major price-comparison sites
				if (/(?:(?:utm_source=(shopmania|price.*?|kelkoo|pangora|shopping.*?|prisjakt|nextag|shopapla))|(?:tag=(kelkoo|price))|(?:refId=ceneo))(\&|$)/i.test(docURL) || /utm_medium=cpc|cse|comparateur/i.test(docURL)) {
					reason.code = 52;
					reason.is_pp = 1;
					reason.msg = 'Valid product page URL (comparison site redirect)';
					success && success(reason);
					return;
				}
				if (getBodyTest()(body, {})) {
					var domWalker = makeDOMWalker(startNode, window.NodeFilter.SHOW_ELEMENT | window.NodeFilter.SHOW_TEXT),
						pageTests = getFullPageTest(),
						validNodes = [],
						nodesWalked = 0,
						maxNodes = 0;
					//var testedNodes = [];
					var ttime = new Date().getTime();
					// Executed on a pre-set stack of nodes
					var continueWalkingNodes = function (onCompleteTest) {
							var node;
							// Walk 30 nodes at a time to prevent page hangup
							for (var i = 0; i < 30; ++i) {
								// Get next node in line
								node = domWalker.nextNode();
								// This is the last node
								if (!node) {
									onCompleteTest();
									return;
								}
								nodesWalked++;
								// Add nodes to the list if passed the tests
								if (pageTests(node, {})) {
									validNodes.push(node);
								}
								logfail(node, '+++ Nodes walked: ', nodesWalked);
								// Limit reached
								if (maxNodes && (nodesWalked >= maxNodes)) {
									onCompleteTest();
									return;
								}
							}
							// Continue with node walking after a brief delay
							setTimeout(function () {
								continueWalkingNodes(onCompleteTest);
							}, 1);
						}
						// Executed when all tests are finished
						,
						afterWalkFinished = function () {
							for (var i = 0; i < validNodes.length; i++) {
								if (validNodes[i].nodeType == 3) {
									validNodes[i] = validNodes[i].parentNode;
								}
							}
							var isNotListing = testIsNotListing(validNodes);
							log('-- [Nodes walked: ' + nodesWalked + '] [Time: ', new Date().getTime() - ttime, 'ms] -- Running testIsNotListing on validNodes: ', validNodes, isNotListing);
							//log('Walked nodes times: ', testedNodes.sort(function(a, b){ return (a.time == b.time) ? 0 : b.time - a.time }));
							if (isNotListing) {
								reason.code = 51;
								reason.is_pp = 1;
								reason.msg = 'Valid nodes found for product page!';
								success && success(reason);
								return;
							}
							reason.code = 551;
							reason.is_pp = 0;
							reason.msg = 'No valid nodes for product page found!';
							fail && fail(reason);
							return;
						};
					// Start walking nodes
					continueWalkingNodes(function () {
						setTimeout(afterWalkFinished, 10)
					});
				}
				else {
					log('*** Not a product page - body test failed! ***');
					reason.is_pp = 0;
					reason.code = 550;
					reason.msg = 'Basic body test failed!';
					fail && fail(reason);
				}
			}

			function testIsNotListing(nodes) {
				var i = 0,
					len = nodes.length;
				// Found one buy button
				if (len == 1) {
					return true;
				}
				else if (len < 1) {
					return false;
				}
				else
					// Determine which is the actual button node
					if (len > 1) {
						var btn = [],
							current = nodes[0],
							next, btnlen = 0;
						btn.push(current);
						for (var i = 1, l = nodes.length; i < l; ++i) {
							next = nodes[i];
							// Same element
							if (current === next) {
								continue;
							}
							else if (!isDescendant(current, next)) {
								current = next;
								btn.push(current);
							}
						}
						log('*** Actual buttons: ', btn);
						btnlen = btn.length;
						// Only one actual button
						if (btnlen == 1) {
							return true;
						}
						else if (btnlen > 1) {
							// Could have 2 submit buttons on the page
							if (btnlen === 2) {
								// Nodes are identical
								if (compareNodes(btn[0], btn[1], true)) {
									log('*** Identical buttons ***', btn[0], btn[1]);
									// TODO: further checking required?
									return false;
								}
								// Nodes are different, one must be something else
								else {
									return true;
								}
							}
							// Definitely a listing page or something else
							else {
								return false;
							}
						}
						else {
							return false;
						}
					}
			}
			// Check contents of document for after-checkout-page patterns
			function testIfAfterCheckout(startNode, success, fail) {
				var reason = {
						msg: null
					},
					document = window.document,
					body = document.body,
					cURL_CO = ['order']
					// Internationalized regular expressions to test for after-checkout page
					,
					reAfterCO = {
						us: /(?:order[_\-\s]*(?:pending|sent|dispatch|receive))|after[_\-\s]*check[_\-\s]*out|(?:check[_\-\s]*out[\-\s]*(?:done|finish|complete))/i,
						ro: /confirmare[_\-\s]*comanda|comanda[_\-\s\w]*trimisa/i
					}
					// Internationalized regular expressions to test for the my account page
					,
					reMyAcc = {
						us: /my[\-\s]*account|account\sinfo|account\sdetails|home/i,
						ro: /contul\s*meu|detalii\s*cont/i
					};
				// Shift arguments
				if (typeof startNode === 'function') {
					fail = success;
					success = startNode;
					startNode = null;
				}
				if (!startNode || !startNode.nodeType) {
					startNode = body;
				}
				// Build URL regex
				reURL_CO = new RegExp(cURL_CO.join('|'), 'i')
				// Test URL
				if (reURL_CO.test(document.URL)) {
					reason.msg = 'Matched URL regex';
					success();
					return;
				}
				fail();
			}
			// Export methods
			PageParser.test = test;
			PageParser.getPrice = getPrice;
			PageParser.ifProductPage = ifProductPage;
			PageParser.Tester = Tester;
			PageParser.getMutualParent = getMutualParent;
			PageParser.getAncestors = getAncestors;
			PageParser.currencySymbolToText = currencySymbolToText;
			PageParser.getCurrencyFromPrice = getCurrencyFromPrice;
			PageParser.cleanPrice = cleanPrice;
			PageParser.cleanPriceMD = cleanPriceMD;
			PageParser.extractPriceAndCurrency = extractPriceAndCurrency;
			PageParser.getBodyTest = getBodyTest;
			PageParser.getFullPageTest = getFullPageTest;
			PageParser.getCompStyle = getCompStyle;
			PageParser.compareNodes = compareNodes;
			PageParser.testIsNotListing = testIsNotListing;
			PageParser.decodeHtml = decodeHtml;
			PageParser.testIfAfterCheckout = testIfAfterCheckout;
			PageParser.makeDOMWalker = makeDOMWalker;
			// Only for debugging purposes
			PageParser.exportDebug = function () {
				window.tst = test;
				window.test = test;
				window.reAdd = reAdd;
				window.reCart = reCart;
				window.reAddToCart = reAddToCart;
				window.reBuy = reBuy;
				window.reWithBuy = reWithBuy;
				window.reBuyNow = reBuyNow;
				window.rePreOrder = rePreOrder;
				window.rePriceWord = rePriceWord;
				window.rePriceMarker = rePriceMarker;
				window.reOOS = reOOS;
				window.reDigits = reDigits;
				window.reDecimals = reDecimals;
				window.reStartDecimals = reStartDecimals;
				window.ifProductPage = ifProductPage;
				window.getPrice = getPrice;
				window.reExtractPriceAndCurrency = reExtractPriceAndCurrency;
				window.reExtractPriceAndCurrencyGlobal = reExtractPriceAndCurrencyGlobal;
			};
			// Export the main object to the namespace
			NS.PageParser = PageParser;
		})(SHMAddonNamespace, window);
	}
	SHMAddonNamespace.jQuery = (this.window && this.window.jQuery) ? this.window.jQuery : ((typeof thisContext !== 'undefined' && thisContext.window && thisContext.window.jQuery) ? thisContext.window.jQuery : jQuery);
	// Execute all functions now
	initExtensionLibs(window);
	initSuccessCallback && initSuccessCallback();
};