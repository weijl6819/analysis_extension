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
/******/ 	return __webpack_require__(__webpack_require__.s = 532);
/******/ })
/************************************************************************/
/******/ ({

/***/ 36:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var gaEvents = function gaEvents(gaCategory, gaAction, gaLabel, gaValue) {
    chrome.runtime.sendMessage({ action: "gaEvent", gaCategory: gaCategory, gaAction: gaAction, gaLabel: gaLabel, gaValue: gaValue }, function () {});
};

exports.gaEvents = gaEvents;

/***/ }),

/***/ 532:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(533);


/***/ }),

/***/ 533:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _backgroundMessenger = __webpack_require__(36);

if (!window.injected) {
    window.injected = true;

    var interval = setInterval(function () {

        var body = $("body");
        if (!body[0]) return;

        clearInterval(interval);

        var loadToClick = Math.round((new Date().getTime() - window.performance.timing.navigationStart) / 1000);
        (0, _backgroundMessenger.gaEvents)("Timing", "Seconds Bucket from Load to Click", loadToClick);

        var url = chrome.extension.getURL("/content/similarsites.html?url=" + location.origin);
        var direction = chrome.i18n.getMessage("@@bidi_dir") || "ltr";

        var toggleBox = function toggleBox() {

            var similarSites = $("#similarsites");
            if (!similarSites[0]) {
                setTimeout(function () {
                    toggleBox();
                }, 50);
            }

            if (similarSites.hasClass('smst_mainbox_in_' + direction)) {
                similarSites.removeClass('smst_mainbox_in_' + direction).addClass('smst_mainbox_out_' + direction);
            } else {
                similarSites.removeClass('smst_mainbox_out_' + direction).addClass('smst_mainbox_in_' + direction);
            }
        };

        body.append("<div id='similarsites' class='smst_mainbox smst_mainbox_create_" + direction + "' >" + "<iframe  id='similarsites_iframe' src='" + url + "' frameBorder=\"0\"/>" + "</div>");

        $("html").click(function (e) {
            var similarSites = $("#similarsites");
            if (similarSites[0] && e.target.id !== "similarsites") {
                if (similarSites.hasClass("smst_mainbox_in_ltr") || similarSites.hasClass("smst_mainbox_in_rtl")) {
                    toggleBox(similarSites);
                }
            }
        });

        chrome.runtime.onMessage.addListener(function (msg, sender) {
            switch (msg.action) {
                case "toggle":
                    toggleBox();
                    break;
                case "ready":
                    $("#similarsites").addClass("smst_mainbox_in_" + direction).removeClass("smst_mainbox_create_" + direction);
                    break;
            }
        });
    }, 50);
}

/***/ })

/******/ });