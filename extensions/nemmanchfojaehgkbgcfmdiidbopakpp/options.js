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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var options = __webpack_require__(1);
options.setup();

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _stringify = __webpack_require__(2);

var _stringify2 = _interopRequireDefault(_stringify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ = __webpack_require__(5);
var $ = __webpack_require__(6);
var Q = __webpack_require__(7);

var PRODUCTION_URLS = {
  acmUrl: 'https://acm.virtru.com',
  accountsUrl: 'https://accounts.virtru.com',
  eventsUrl: 'https://events.virtru.com',
  remoteContentBaseUrl: 'https://secure.virtru.com/start/',
  dashboardUrl: 'https://secure.virtru.com/dashboard/',
  checkoutUrl: 'https://secure.virtru.com/checkout/'
};

var LOCAL_URLS = {
  acmUrl: 'https://acm.testingtru.com',
  accountsUrl: 'https://accounts.testingtru.com',
  eventsUrl: 'https://events.testingtru.com',
  remoteContentBaseUrl: 'https://www.virtru.com/start/',
  dashboardUrl: 'https://www.virtru.com/dashboard/'
};

function getEnvUrls(env) {
  // Use `secure-` instead of `www-` for new environments;
  var wwwPrefix = env === 'dev' || env === 'staging' ? 'www' : 'secure';

  return {
    acmUrl: 'https://acm' + env + '.virtru.com',
    accountsUrl: 'https://accounts' + env + '.virtru.com',
    eventsUrl: 'https://events' + env + '.virtru.com',
    remoteContentBaseUrl: 'https://secure' + env + '.virtru.com/start/',
    dashboardUrl: 'https://secure' + env + '.virtru.com/dashboard/',
    checkoutUrl: 'https://secure' + env + '.virtru.com/checkout/'
  };
}

function OptionsPage(router) {
  this._router = router;
  _.bindAll(this);
}

OptionsPage.setup = function () {

  var bkg = chrome.extension.getBackgroundPage();
  var router = bkg.router;
  var options = new OptionsPage(router);

  options.init();
  return options;
};

OptionsPage.prototype.init = function () {
  try {
    $('#save').click(this.saveButtonClick);

    var router = this._router;
    router.route('loadExtensionSettings', {}, this.loadSettings, undefined);

    var self = this;
    $('#clear-storage').click(function () {
      if (confirm('This will clear all storage. You must refresh each tab.\n\nAre you sure you want to do this?')) {
        router.route('clear-storage', {}, function () {
          alert('Storage cleared.');
          self.refreshSettings();
        }, undefined);
      }
    });
    $('.options-radio-production').click(this.productionRadioClick);
    $('.options-radio-non-production').click(this.nonProductionRadioClick);
    $('.options-radio-other').click(this.otherRadioClick);
    $('.options-radio-local').click(this.localRadioClick);
    $('.easter-egg').click(this.activateEasterEgg);

    $('#refresh-settings').click(function () {
      var user = $('.refresh-settings-user').val();
      router.route('refresh-settings', { userId: user }, function () {
        $('.status').text('Signaled refresh of user settings for ' + user);
      });
    });

    this.refreshSettings();
  } catch (err) {
    console.log(err);
  }
};

OptionsPage.prototype.loadSettings = function (unused, settings) {
  if (settings.acmUrl.indexOf('acm.virtru.com') > 0) {
    $('.options-radio-production').prop('checked', true);
    this.toggleUrls(true);
  } else if (settings.acmUrl.indexOf('acm-staging.virtru.com') > 0) {
    $('.options-radio-staging').prop('checked', true);
    this.toggleUrls(true);
  } else if (settings.acmUrl.indexOf('testingtru') > 0) {
    $('.options-radio-local').prop('checked', true);
    this.toggleUrls(true);
  } else {
    $('.options-radio-other').prop('checked', true);
    this.toggleUrls(false);
  }

  $('.acm-broker-url').val(settings.acmUrl);
  $('.acm-accounts-url').val(settings.accountsUrl);
  $('.acm-events-url').val(settings.eventsUrl);
  $('.utdf-base-url').val(settings.remoteContentBaseUrl);
  $('.dashboard-url').val(settings.dashboardUrl);
  $('.checkout-url').val(settings.checkoutUrl);

  $('#log-level-select')[0].selectedIndex = this.getLogLevelIndex(settings.logLevel);
};

OptionsPage.prototype.getLogLevelIndex = function (name) {
  return ['ALL', 'TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL'].indexOf(name);
};

OptionsPage.prototype.refreshSettings = function () {
  var router = this._router;
  router.route('loadExtensionSettings', {}, function (unused, settings) {
    $('.json').val((0, _stringify2.default)(settings, null, '\t'));
  }, undefined);
};

OptionsPage.prototype.productionRadioClick = function () {
  try {
    this.toggleUrls(true);
    this.updateUrls(PRODUCTION_URLS);
    this.updateExtensionSettings(PRODUCTION_URLS);
  } catch (err) {
    console.log(err);
  }
};

OptionsPage.prototype.localRadioClick = function () {
  try {
    this.toggleUrls(true);
    this.updateUrls(LOCAL_URLS);
    this.updateExtensionSettings(LOCAL_URLS);
  } catch (err) {
    console.log(err);
  }
};

OptionsPage.prototype.nonProductionRadioClick = function (e) {
  var env = e.currentTarget.value;
  var envUrls = getEnvUrls(env);

  try {
    this.toggleUrls(true);
    this.updateUrls(envUrls);
    this.updateExtensionSettings(envUrls);
  } catch (err) {
    console.log(err);
  }
};

OptionsPage.prototype.otherRadioClick = function () {
  try {
    this.toggleUrls(false);
  } catch (err) {
    console.log(err);
  }
};

OptionsPage.prototype.saveButtonClick = function () {
  try {
    this.updateExtensionSettings({
      acmUrl: $('.acm-broker-url').val(),
      accountsUrl: $('.acm-accounts-url').val(),
      eventsUrl: $('.acm-events-url').val(),
      remoteContentBaseUrl: $('.utdf-base-url').val(),
      dashboardUrl: $('.dashboard-url').val(),
      checkoutUrl: $('.checkout-url').val(),
      logLevel: $('#log-level-select')[0].options[$('#log-level-select')[0].selectedIndex].innerText
    });
  } catch (err) {
    console.log(err);
  }
};

OptionsPage.prototype.toggleUrls = function (hide) {
  $('.acm-broker-url').prop('disabled', hide);
  $('.acm-accounts-url').prop('disabled', hide);
  $('.acm-events-url').prop('disabled', hide);
  $('.utdf-base-url').prop('disabled', hide);
  $('.dashboard-url').prop('disabled', hide);
  $('.checkout-url').prop('disabled', hide);

  $('.label')[hide ? 'addClass' : 'removeClass']('disabled');
};

OptionsPage.prototype.updateUrls = function (settings) {
  $('.acm-broker-url').val(settings.acmUrl);
  $('.acm-accounts-url').val(settings.accountsUrl);
  $('.acm-events-url').val(settings.eventsUrl);
  $('.utdf-base-url').val(settings.remoteContentBaseUrl);
  $('.dashboard-url').val(settings.dashboardUrl);
  $('.checkout-url').val(settings.checkoutUrl);
};

OptionsPage.prototype.updateExtensionSettings = function (settingsPatch) {
  this._router.route('updateExtensionSettings', { params: { settings: settingsPatch } }, undefined, undefined);
  this.refreshSettings();
};

OptionsPage.prototype.activateEasterEgg = function () {
  $('.background-div').css('opacity', '.02');
  $('.background-div2').css('opacity', '.02');
};

module.exports = exports = OptionsPage;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(3), __esModule: true };

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__(4);
var $JSON = core.JSON || (core.JSON = { stringify: JSON.stringify });
module.exports = function stringify(it) { // eslint-disable-line no-unused-vars
  return $JSON.stringify.apply($JSON, arguments);
};


/***/ }),
/* 4 */
/***/ (function(module, exports) {

var core = module.exports = { version: '2.6.0' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = __virtru_deps.underscore;

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = __virtru_deps["jquery-pack"];

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = __virtru_deps.q;

/***/ })
/******/ ]);