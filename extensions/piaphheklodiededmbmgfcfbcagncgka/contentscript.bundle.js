
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
/******/ 	return __webpack_require__(__webpack_require__.s = 1243);
/******/ })
/************************************************************************/
/******/ ({

/***/ 1243:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__contentscript_style__ = __webpack_require__(1244);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_store__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils_constants__ = __webpack_require__(33);




if (window.location.href.indexOf("https://www.youtube.com/tv#/") == 0 || window.location.href.indexOf("http://www.youtube.com/tv#/") == 0 || window.location.href.indexOf("https://tv.youtube.com") == 0 || window.location.href.indexOf("http://tv.youtube.com") == 0 || window.location.href.indexOf("https://gaming.youtube.com") == 0 || window.location.href.indexOf("http://gaming.youtube.com") == 0) {
    throw "YTRP: Script is being injected into an special unsupported YouTube version, stop execution";
}

chrome.runtime.sendMessage({ name: "injectionDone" });

var timerMutations = null;

var hashtable = {};

var mutationObserver = new MutationObserver(function (mutations) {

    if (timerMutations == null) {
        timerMutations = setTimeout(function () {
            mutationObserved();
        }, 500);
    }
});

let highlightedVideos = null;
let showRpScore = null;
let enable = null;

__WEBPACK_IMPORTED_MODULE_1__utils_store__["b" /* getLocal */]().then(result => {
    highlightedVideos = result[__WEBPACK_IMPORTED_MODULE_2__utils_constants__["s" /* YTRP_HIGHLIGHTED_VIDEOS_KEY */]];
    showRpScore = result[__WEBPACK_IMPORTED_MODULE_2__utils_constants__["u" /* YTRP_SHOW_RP_SCORE_KEY */]];
    enable = result[__WEBPACK_IMPORTED_MODULE_2__utils_constants__["r" /* YTRP_ENABLE_KEY */]];
    Object(__WEBPACK_IMPORTED_MODULE_0__contentscript_style__["a" /* startApplyStyle */])();
    if (enable) {
        showBars();
    }
});

__WEBPACK_IMPORTED_MODULE_1__utils_store__["a" /* addListener */](changes => {
    if (changes[__WEBPACK_IMPORTED_MODULE_2__utils_constants__["s" /* YTRP_HIGHLIGHTED_VIDEOS_KEY */]] !== undefined) {
        highlightedVideos = changes[__WEBPACK_IMPORTED_MODULE_2__utils_constants__["s" /* YTRP_HIGHLIGHTED_VIDEOS_KEY */]];
    }
    if (changes[__WEBPACK_IMPORTED_MODULE_2__utils_constants__["u" /* YTRP_SHOW_RP_SCORE_KEY */]] !== undefined) {
        showRpScore = changes[__WEBPACK_IMPORTED_MODULE_2__utils_constants__["u" /* YTRP_SHOW_RP_SCORE_KEY */]];
    }
    if (changes[__WEBPACK_IMPORTED_MODULE_2__utils_constants__["r" /* YTRP_ENABLE_KEY */]] !== undefined) {
        enable = changes[__WEBPACK_IMPORTED_MODULE_2__utils_constants__["r" /* YTRP_ENABLE_KEY */]];
        if (enable) {
            showBars();
        }
    }
});

function observeMutations(observe) {

    if (observe) {
        mutationObserver.observe(document.body, { childList: true, subtree: true });
    } else {
        mutationObserver.disconnect();
        clearTimeout(timerMutations);
        timerMutations = null;
    }
}

function mutationObserved() {

    timerMutations = null;

    if (document.querySelectorAll("#progress[style*=transition-duration], yt-page-navigation-progress:not([hidden])").length == 0) {
        showBars();
    } else {}
}

function showBars() {
    if (!enable) {
        return;
    }
    showMainBar();

    var previousHashtableLength = Object.keys(hashtable).length;

    var success = retrievePageVideos();

    if (success) {
        observeMutations(false);

        var _ids = Object.keys(hashtable);
        var ids = [];
        for (var i = previousHashtableLength; i < _ids.length; i++) {
            ids.push(_ids[i]);
        }

        chrome.runtime.sendMessage({ name: "injectionDone" });
        chrome.runtime.sendMessage({ name: "getVideosData", message: ids }, onMessageResponse);
    } else {
        observeMutations(true);
    }

    return success;
}

function showMainBar() {
    try {
        var viewsElement = document.querySelector(".watch-view-count, .view-count");
        if (viewsElement && !viewsElement.getAttribute("ytrp")) {
            viewsElement.setAttribute("ytrp", "true");

            var viewsTextElement = viewsElement.firstChild;
            if (viewsTextElement.nodeName == "#text") {
                var youtubeMaterialDesign = false;
                var likesElement = document.querySelector(".like-button-renderer-like-button:not(.hid)");
                var dislikesElement = document.querySelector(".like-button-renderer-dislike-button:not(.hid)");
                if (!likesElement && !dislikesElement) {
                    var likesAndDislikesElements = document.querySelectorAll("#menu .ytd-video-primary-info-renderer yt-formatted-string");
                    if (likesAndDislikesElements.length == 2) {
                        youtubeMaterialDesign = true;
                        likesElement = document.querySelectorAll("#menu .ytd-video-primary-info-renderer yt-formatted-string")[0];
                        dislikesElement = document.querySelectorAll("#menu .ytd-video-primary-info-renderer yt-formatted-string")[1];
                    }
                }
                if (likesElement && dislikesElement && viewsTextElement.textContent && likesElement.textContent && dislikesElement.textContent) {
                    var views = parseInt(viewsTextElement.textContent.replace(/\D/g, ""));
                    var likes = !youtubeMaterialDesign ? parseInt(likesElement.textContent.replace(/\D/g, "")) : parseInt("0" + likesElement.getAttribute("aria-label").replace(/\D/g, ""));
                    var dislikes = !youtubeMaterialDesign ? parseInt(dislikesElement.textContent.replace(/\D/g, "")) : parseInt("0" + dislikesElement.getAttribute("aria-label").replace(/\D/g, ""));
                    if (!isNaN(views) && !isNaN(likes) && !isNaN(dislikes)) {
                        var score = totalScore(views, likes, dislikes);

                        var fullBarElement = document.getElementsByClassName("video-extras-sparkbars")[0] || document.getElementById("sentiment");
                        var liveVideo = document.querySelectorAll("#watch-sidebar-live-chat, #chat").length > 0;
                        var total = likes + dislikes;
                        if (total > 0) {
                            if (dislikes == 0) {
                                var likeBarElement = document.getElementsByClassName("video-extras-sparkbar-likes")[0] || document.getElementById("like-bar");
                                if (likeBarElement) {
                                    likeBarElement.setAttribute("style", likeBarElement.getAttribute("style") + "; margin-left: 0 !important; border-right: 0 !important;");
                                }
                            }

                            if (fullBarElement && !liveVideo) {
                                fullBarElement.setAttribute("title", Math.round(likes / total * 10000) / 100 + "% likes (" + ts(total) + " ratings)\x0ARP score: " + Math.floor(score * 10) / 10);
                            }
                        } else if (fullBarElement && !liveVideo) {
                            fullBarElement.setAttribute("title", "No ratings\x0ARP score: " + Math.floor(score * 10) / 10);
                        }

                        if (showRpScore && !liveVideo) {
                            var span = document.createElement("span");
                            span.setAttribute("class", "ytrp_span_main_bar");
                            span.textContent = " (" + Math.floor(score * 10) / 10 + ")";
                            viewsElement.appendChild(span);
                        }
                    }
                }
            }
        }
    } catch (err) {}
}

function retrievePageVideos() {
    var success = false;

    var clips = document.querySelectorAll(".video-thumb, .yt-uix-simple-thumb-wrap, .ytp-videowall-still, .pl-header-thumb, #thumbnail:not(.ytd-moving-thumbnail-renderer):not(.ytd-movie-upsell-renderer), #thumbnail-container");

    var clipsLength = clips.length;
    for (var i = 0; i < clipsLength; i++) {
        try {
            var clip = clips[i];

            if (!clip.getAttribute("ytrp")) {
                if (clip.offsetWidth > 60) {
                    if (isVisible(clip)) {
                        var id;
                        var found = false;

                        var anchor;
                        if (clip.parentNode.tagName == "A") {
                            anchor = clip.parentNode;
                        } else if (clip.parentNode.parentNode.tagName == "A") {
                            anchor = clip.parentNode.parentNode;
                        } else if (clip.tagName == "A") {
                            anchor = clip;
                        } else if (clip.parentNode.parentNode.parentNode.tagName == "A") {
                            anchor = clip.parentNode.parentNode.parentNode;
                        } else if (clip.parentNode.parentNode.parentNode.parentNode.tagName == "A") {
                            anchor = clip.parentNode.parentNode.parentNode.parentNode;
                        } else if (clip.parentNode.parentNode.parentNode.parentNode.parentNode.tagName == "A") {
                            anchor = clip.parentNode.parentNode.parentNode.parentNode.parentNode;
                        } else if (clip.childNodes[0].tagName == "A") {
                            anchor = clip.childNodes[0];
                        } else if (clip.childNodes[1].tagName == "A") {
                            anchor = clip.childNodes[1];
                        } else if (clip.childNodes[2].tagName == "A") {
                            anchor = clip.childNodes[2];
                        }

                        var href = anchor.getAttribute("href");
                        var params = href.split("?")[1] ? href.split("?")[1].split("&") : [];

                        if (params.length > 0) {
                            for (var j = 0; j < params.length; j++) {
                                if (params[j].substr(0, 2).toLowerCase() == "v=") {
                                    id = params[j].substr(2);
                                    if (id.length == 11) {
                                        found = true;
                                        break;
                                    }
                                }
                            }

                            if (!found) {
                                var ids = [];
                                var ids_index = -1;
                                for (var j = 0; j < params.length; j++) {
                                    if (params[j].substr(0, 10).toLowerCase() == "video_ids=") {
                                        ids = params[j].substr(10).split("%2C");
                                        if (ids.length > 0) {
                                            break;
                                        }
                                    }
                                }
                                for (var j = 0; j < params.length; j++) {
                                    if (params[j].substr(0, 6).toLowerCase() == "index=") {
                                        ids_index = parseInt(params[j].substr(6));
                                        if (ids_index >= 0) {
                                            break;
                                        }
                                    }
                                }
                                if (ids.length > 0) {
                                    if (ids_index < 0) {
                                        ids_index = 0;
                                    }
                                    id = ids[ids_index];
                                    if (id.length == 11) {
                                        found = true;
                                    }
                                }
                            }
                        }

                        if (!found) {
                            var outerHTML = clip.outerHTML;
                            var match = outerHTML.match(/\/vi\/([a-zA-Z0-9-_]{11})\//);
                            if (match) {
                                id = match[1];
                                if (id) {
                                    found = true;
                                }
                            }
                        }

                        if (found) {
                            var checkParents = 3;
                            var watchCard = clip;
                            for (var j = 0; j <= checkParents; j++) {
                                if (watchCard.className.indexOf("watch-card") != -1) {
                                    found = false;
                                    break;
                                }
                                watchCard = watchCard.parentNode;
                            }
                        }

                        if (found) {
                            if (!(id in hashtable)) {
                                hashtable[id] = [[clip]];
                                success = true;
                            } else {
                                hashtable[id][0].push(clip);
                                if (hashtable[id].length == 6) {
                                    attachBar(clip, hashtable[id][1], hashtable[id][2], hashtable[id][3], hashtable[id][4], hashtable[id][5]);
                                }
                            }
                        }
                    }
                }
            }
        } catch (err) {}
    }

    return success;
}

function onMessageResponse(ht) {
    var ids = Object.keys(ht);
    for (var i = 0; i < ids.length; i++) {
        if (ids[i] in hashtable) {
            var score = totalScore(ht[ids[i]][0], ht[ids[i]][1], ht[ids[i]][2]);
            hashtable[ids[i]] = [hashtable[ids[i]][0], ht[ids[i]][0], ht[ids[i]][1], ht[ids[i]][2], score, false];
        }
    }

    markHighlighted();

    var success = attachBars(ids);

    observeMutations(true);

    if (success) {
        chrome.runtime.sendMessage({ name: "wasSuccessful" });
    }
}

function attachBars(ids) {
    var success = false;
    for (var i = 0; i < ids.length; i++) {
        try {
            if (ids[i] in hashtable && hashtable[ids[i]].length == 6) {
                for (var j = 0; j < hashtable[ids[i]][0].length; j++) {
                    try {
                        attachBar(hashtable[ids[i]][0][j], hashtable[ids[i]][1], hashtable[ids[i]][2], hashtable[ids[i]][3], hashtable[ids[i]][4], hashtable[ids[i]][5]);
                        success = true;
                    } catch (_err) {}
                }
            }
        } catch (err) {}
    }
    return success;
}

function attachBar(clip, views, likes, dislikes, score, hl) {
    if (clip && !clip.getAttribute("ytrp")) {
        clip.setAttribute("ytrp", "true");

        const total = likes + dislikes;
        const totalWidth = clip.offsetWidth;

        if (totalWidth > 0) {
            const wrapperDiv = document.createElement("div");
            wrapperDiv.setAttribute("class", "ytrp_wrapper");
            const tooltipDiv = document.createElement("div");
            tooltipDiv.setAttribute("class", "ytrp_tooltip");

            if (hl) {

                const ratingDiv1 = document.createElement("div");
                const ratingDiv2 = document.createElement("div");
                const ratingDiv3 = document.createElement("div");
                const ratingDiv4 = document.createElement("div");
                ratingDiv1.setAttribute("class", "ytrp_rb_bg ytrp_rb_bg_bottom");
                if (total > 0) {
                    tooltipDiv.setAttribute("title", Math.round(likes / total * 10000) / 100 + "% likes (" + ts(total) + " ratings)\x0ARP score: " + Math.floor(score * 10) / 10);
                } else {
                    tooltipDiv.setAttribute("title", "No ratings\x0ARP score: " + Math.floor(score * 10) / 10);
                }
                ratingDiv2.setAttribute("class", "ytrp_rb_bg ytrp_rb_bg_top");
                ratingDiv3.setAttribute("class", "ytrp_rb_bg ytrp_rb_bg_left");
                ratingDiv4.setAttribute("class", "ytrp_rb_bg ytrp_rb_bg_right");

                const innerDiv1 = document.createElement("div");
                const innerDiv2 = document.createElement("div");
                const innerDiv3 = document.createElement("div");
                const innerDiv4 = document.createElement("div");
                innerDiv1.setAttribute("class", "ytrp_rb_fg ytrp_rb_fg_hl ytrp_rb_fg_hl_bottom");
                innerDiv2.setAttribute("class", "ytrp_rb_fg ytrp_rb_fg_hl ytrp_rb_fg_hl_top");
                innerDiv3.setAttribute("class", "ytrp_rb_fg ytrp_rb_fg_hl ytrp_rb_fg_hl_left");
                innerDiv4.setAttribute("class", "ytrp_rb_fg ytrp_rb_fg_hl ytrp_rb_fg_hl_right");
                ratingDiv1.appendChild(innerDiv1);
                ratingDiv2.appendChild(innerDiv2);
                ratingDiv3.appendChild(innerDiv3);
                ratingDiv4.appendChild(innerDiv4);

                wrapperDiv.appendChild(ratingDiv1);
                wrapperDiv.appendChild(ratingDiv2);
                wrapperDiv.appendChild(ratingDiv3);
                wrapperDiv.appendChild(ratingDiv4);
                wrapperDiv.appendChild(tooltipDiv);
            } else {

                var likesWidth = 0;
                var dislikesWidth = 0;
                if (total > 0) {
                    if (likes >= dislikes) {
                        likesWidth = Math.floor(likes / total * totalWidth);
                        dislikesWidth = Math.ceil(dislikes / total * totalWidth);
                    } else {
                        likesWidth = Math.ceil(likes / total * totalWidth);
                        dislikesWidth = Math.floor(dislikes / total * totalWidth);
                    }
                }

                if (likesWidth > 0 && dislikesWidth > 0) {
                    if (likesWidth >= dislikesWidth) {
                        likesWidth -= 1;
                    } else {
                        dislikesWidth -= 1;
                    }
                }

                var ratingDiv = document.createElement("div");
                ratingDiv.setAttribute("class", "ytrp_rb_bg ytrp_rb_bg_bottom");
                if (total > 0) {
                    tooltipDiv.setAttribute("title", Math.round(likes / total * 10000) / 100 + "% likes (" + ts(total) + " ratings)\x0ARP score: " + Math.floor(score * 10) / 10);
                } else {
                    tooltipDiv.setAttribute("title", "No ratings\x0ARP score: " + Math.floor(score * 10) / 10);
                }

                if (total > 0) {
                    if (likesWidth > 0) {
                        var likesDiv = document.createElement("div");
                        likesDiv.setAttribute("class", "ytrp_rb_fg ytrp_rb_fg_like");
                        likesDiv.setAttribute("style", "width: " + likesWidth + "px;");
                        ratingDiv.appendChild(likesDiv);
                    }
                    if (dislikesWidth > 0) {
                        var dislikesDiv = document.createElement("div");
                        dislikesDiv.setAttribute("class", "ytrp_rb_fg ytrp_rb_fg_dislike");
                        dislikesDiv.setAttribute("style", "width: " + dislikesWidth + "px;");
                        ratingDiv.appendChild(dislikesDiv);
                    }
                } else {
                    var noRatingsDiv = document.createElement("div");
                    noRatingsDiv.setAttribute("class", "ytrp_rb_fg ytrp_rb_fg_norating");
                    ratingDiv.appendChild(noRatingsDiv);
                }

                wrapperDiv.appendChild(ratingDiv);
                wrapperDiv.appendChild(tooltipDiv);
            }

            clip.appendChild(wrapperDiv);

            if (showRpScore) {
                attachRpScore(clip, score, 0);
            }

            var gifParent = clip.querySelector("#mouseover-overlay");
            if (gifParent) {
                wrapperDiv.addEventListener("mouseenter", function () {
                    setTimeout(function () {
                        var gif = clip.querySelector("ytd-moving-thumbnail-renderer");
                        if (gif) {
                            gif.dispatchEvent(new MouseEvent("mouseenter"));
                        }
                    }, 0);
                });
                wrapperDiv.addEventListener("mouseleave", function () {
                    var gif = gifParent.querySelector("ytd-moving-thumbnail-renderer");
                    if (gif) {
                        gif.dispatchEvent(new MouseEvent("mouseleave"));
                    }
                });
            }
        }
    }
}

function attachRpScore(clip, score, asyncTrial) {

    if (asyncTrial == 0) {
        if (clip.parentElement && clip.parentElement.parentElement) {
            var timeNodes = clip.parentElement.parentElement.getElementsByClassName("video-time");
            if (timeNodes.length == 1 && !timeNodes[0].getAttribute("ytrp")) {
                var timeNode = timeNodes[0];
                timeNode.setAttribute("ytrp", "true");

                var span = document.createElement("span");
                span.setAttribute("class", "ytrp_span_time_box");
                span.textContent = " (" + Math.floor(score * 10) / 10 + ")";
                timeNode.appendChild(span);
            } else if (timeNodes.length == 0) {
                attachRpScore(clip, score, 1);
            }
        } else {
            attachRpScore(clip, score, 1);
        }
    } else {
        setTimeout(function () {
            var timeNodes = clip.getElementsByClassName("ytd-thumbnail-overlay-time-status-renderer");
            if (timeNodes.length == 1 && !timeNodes[0].getAttribute("ytrp")) {
                var timeNode = timeNodes[0];
                timeNode.setAttribute("ytrp", "true");

                var span = document.createElement("span");
                span.setAttribute("class", "ytrp_span_time_box");
                span.textContent = " (" + Math.floor(score * 10) / 10 + ")";
                timeNode.appendChild(span);
            } else if (timeNodes.length == 0 && asyncTrial < 10) {
                attachRpScore(clip, score, asyncTrial + 1);
            }
        }, asyncTrial * 500);
    }
}

function markHighlighted() {
    if (highlightedVideos > 0) {
        var allScores = [];
        var ids = Object.keys(hashtable);
        for (var i = 0; i < ids.length; i++) {
            if (hashtable[ids[i]].length == 6) {
                allScores.push({ id: ids[i], score: hashtable[ids[i]][4] });
            }
        }
        allScores.sort(function (a, b) {
            return b.score - a.score;
        });

        for (var i = 0; i < highlightedVideos && i < allScores.length / 2 - 1; i++) {
            if (allScores[i].score >= 5) {
                hashtable[allScores[i].id][5] = true;
            }
        }
    }
}

Element.prototype.remove = function () {
    this.parentElement.removeChild(this);
};
NodeList.prototype.remove = HTMLCollection.prototype.remove = function () {
    for (var i = this.length - 1; i >= 0; i--) {
        if (this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
};
function onHistoryStateUpdated() {

    observeMutations(false);

    document.querySelectorAll(".ytrp_wrapper").remove();

    document.querySelectorAll(".ytrp_span_main_bar").remove();

    document.querySelectorAll(".ytrp_span_time_box").remove();

    [].forEach.call(document.querySelectorAll("[ytrp]"), function (item) {
        item.removeAttribute("ytrp");
    });

    setTimeout(function () {
        observeMutations(true);
    }, 1000);
}
window.onHistoryStateUpdated = onHistoryStateUpdated;

function getHostName(url) {
    if (url != null) {
        var matches = url.match(/^https?\:\/\/([^\/?#]+)/i);
        return matches && matches[1];
    } else {
        return null;
    }
}

function getDomainName(hostName) {
    return hostName.substring(hostName.lastIndexOf(".", hostName.lastIndexOf(".") - 1) + 1);
}

function ts(v) {
    var val = v.toString();
    var result = "";
    var len = val.length;
    while (len > 3) {
        result = "," + val.substr(len - 3, 3) + result;
        len -= 3;
    }
    return val.substr(0, len) + result;
}

function isVisible(obj) {
    if (obj == document) return true;

    if (!obj) return false;
    if (!obj.parentNode) return false;

    if (obj.style) {
        if (obj.style.display == "none") return false;
        if (obj.style.visibility == "hidden") return false;
    }

    var style = window.getComputedStyle(obj, "");
    if (style.display == "none") return false;
    if (style.visibility == "hidden") return false;

    return isVisible(obj.parentNode);
}

function totalScore(views, likes, dislikes) {
    var votes = likes + dislikes;

    if (votes > 0 && views > 0) {
        var likesScore = likes / votes * Math.min(log(Math.pow(10, 2), (Math.pow(10, 2) - 1) * votes / Math.pow(10, 3) + 1), 1) + 0.5 * (1 - Math.min(log(Math.pow(10, 2), (Math.pow(10, 2) - 1) * votes / Math.pow(10, 3) + 1), 1));

        var viewsScore = Math.min(log(Math.pow(10, 6), (Math.pow(10, 6) - 1) * views / Math.pow(10, 9) + 1), 1);

        var votesScore = 1 - Math.min(log(Math.pow(10, 2 / 3), (Math.pow(10, 2 / 3) - 1) * votes * 100 / views / Math.pow(10, 1) + 1), 1);

        var totalRawScore = likesScore * 0.8 + viewsScore * 0.1 + votesScore * 0.1;

        var totalNetScore = Math.min(Math.max(10.8 * totalRawScore - 0.4, 0), 10);

        return totalNetScore;
    } else {
        return 5;
    }
}
function log(base, number) {
    return Math.log(number) / Math.log(base);
}

/***/ }),

/***/ 1244:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = startApplyStyle;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_constants__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__tokenized_style_txt__ = __webpack_require__(1245);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__tokenized_style_txt___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__tokenized_style_txt__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils_store__ = __webpack_require__(78);





function generateFullStyle(barStyle = __WEBPACK_IMPORTED_MODULE_0__utils_constants__["j" /* YTRP_DEFAULT_BAR_STYLE */], barThickness = __WEBPACK_IMPORTED_MODULE_0__utils_constants__["k" /* YTRP_DEFAULT_BAR_THICKNESS */], barOpacity = __WEBPACK_IMPORTED_MODULE_0__utils_constants__["i" /* YTRP_DEFAULT_BAR_OPACITY */], playbackProress = __WEBPACK_IMPORTED_MODULE_0__utils_constants__["p" /* YTRP_DEFAULT_PLAYBACK_PROGRESS_BAR */]) {
    let style = __WEBPACK_IMPORTED_MODULE_1__tokenized_style_txt___default.a;

    if (barStyle === 0) {
        style = style.replace(/\[YTRP_LIKE_COLOR_TOKEN\]/g, '#197519');
        style = style.replace(/\[YTRP_SEPARATOR_COLOR_TOKEN\]/g, '#FFF');
        style = style.replace(/\[YTRP_DISLIKE_COLOR_TOKEN\]/g, '#d63232');
        style = style.replace(/\[YTRP_HIGHLIGHT_COLOR_TOKEN\]/g, '#1919ff');
        style = style.replace(/\[YTRP_NORATING_COLOR_TOKEN\]/g, '#AAA');
    } else if (barStyle === 1) {
        style = style.replace(/\[YTRP_LIKE_COLOR_TOKEN\]/g, '#2793e6');
        style = style.replace(/\[YTRP_SEPARATOR_COLOR_TOKEN\]/g, '#CCC');
        style = style.replace(/\[YTRP_DISLIKE_COLOR_TOKEN\]/g, '#CCC');
        style = style.replace(/\[YTRP_HIGHLIGHT_COLOR_TOKEN\]/g, '#e62793');
        style = style.replace(/\[YTRP_NORATING_COLOR_TOKEN\]/g, '#CCC');
    } else if (barStyle === 2) {
        style = style.replace(/\[YTRP_LIKE_COLOR_TOKEN\]/g, '#65aaf7');
        style = style.replace(/\[YTRP_SEPARATOR_COLOR_TOKEN\]/g, '#CCC');
        style = style.replace(/\[YTRP_DISLIKE_COLOR_TOKEN\]/g, '#f765aa');
        style = style.replace(/\[YTRP_HIGHLIGHT_COLOR_TOKEN\]/g, '#f765aa');
        style = style.replace(/\[YTRP_NORATING_COLOR_TOKEN\]/g, '#CCC');
    }

    style = style.replace(/\[YTRP_BAR_THICKNESS_TOKEN\]/g, barThickness);

    style = style.replace(/\[YTRP_BAR_OPACITY_TOKEN\]/g, barOpacity / 10);

    if (playbackProress) {
        style = style.replace(/\[YTRP_PLAYBACK_PROGRESS_BAR_TOKEN\]/g, 'top: 0 !important; visibility: visible !important');
    } else {
        if (barOpacity === 0) {
            style = style.replace(/\[YTRP_PLAYBACK_PROGRESS_BAR_TOKEN\]/g, 'bottom: 0 !important; visibility: visible !important');
        } else {
            style = style.replace(/\[YTRP_PLAYBACK_PROGRESS_BAR_TOKEN\]/g, 'bottom: 0 !important; visibility: hidden !important');
        }
    }
    return style;
}

let node = null;

function applyStyle() {
    if (!node) {
        node = document.createElement('style');
        document.body.appendChild(node);
    }
    __WEBPACK_IMPORTED_MODULE_2__utils_store__["b" /* getLocal */]().then(result => {
        if (!result[__WEBPACK_IMPORTED_MODULE_0__utils_constants__["r" /* YTRP_ENABLE_KEY */]]) {
            node.innerHTML = "";
            return;
        }
        const style = generateFullStyle(result[__WEBPACK_IMPORTED_MODULE_0__utils_constants__["f" /* YTRP_BAR_STYLE_KEY */]], result[__WEBPACK_IMPORTED_MODULE_0__utils_constants__["g" /* YTRP_BAR_THICKNESS_KEY */]], result[__WEBPACK_IMPORTED_MODULE_0__utils_constants__["e" /* YTRP_BAR_OPACITY_KEY */]], result[__WEBPACK_IMPORTED_MODULE_0__utils_constants__["t" /* YTRP_PLAYBACK_PROGRESS_BAR_KEY */]]);
        node.innerHTML = style;
    });
}

function onSettingChange(changes) {
    if (changes[__WEBPACK_IMPORTED_MODULE_0__utils_constants__["f" /* YTRP_BAR_STYLE_KEY */]] !== undefined || changes[__WEBPACK_IMPORTED_MODULE_0__utils_constants__["g" /* YTRP_BAR_THICKNESS_KEY */]] !== undefined || changes[__WEBPACK_IMPORTED_MODULE_0__utils_constants__["e" /* YTRP_BAR_OPACITY_KEY */]] !== undefined || changes[__WEBPACK_IMPORTED_MODULE_0__utils_constants__["t" /* YTRP_PLAYBACK_PROGRESS_BAR_KEY */]] !== undefined || changes[__WEBPACK_IMPORTED_MODULE_0__utils_constants__["r" /* YTRP_ENABLE_KEY */]] !== undefined) {
        applyStyle();
    }
}

function startApplyStyle() {
    applyStyle();
    __WEBPACK_IMPORTED_MODULE_2__utils_store__["a" /* addListener */](onSettingChange);
}

/***/ }),

/***/ 1245:
/***/ (function(module, exports) {

module.exports = ".ytrp_wrapper\r\n{\r\n\tposition: absolute;\r\n\ttop: 0px;\r\n\tleft: 0px;\r\n\twidth: 100%;\r\n\theight: 100%;\r\n\tz-index: 3;\r\n\topacity: 0;\r\n    opacity: [YTRP_BAR_OPACITY_TOKEN];\r\n\ttransition: opacity 0.2s;\r\n\t-webkit-transition: opacity 0.2s;\r\n}\r\n\r\n.ytrp_wrapper.no_transition\r\n{\r\n\ttransition: none;\r\n\t-webkit-transition: none;\r\n}\r\n\r\n.ytrp_wrapper:hover\r\n{\r\n\topacity: 1;\r\n}\r\n\r\n.ytrp_rb_bg\r\n{\r\n\tposition: absolute;\r\n\tbackground: #CCC;\r\n    background: [YTRP_SEPARATOR_COLOR_TOKEN];\r\n\tz-index: 3;\r\n}\r\n\r\n.ytrp_rb_fg\r\n{\r\n\tposition: absolute;\r\n}\r\n\r\n.ytrp_rb_bg_bottom\r\n{\r\n\tbottom: 0;\r\n\tleft: 0;\r\n\tright: 0;\r\n\theight: 4px;\r\n    height: [YTRP_BAR_THICKNESS_TOKEN]px;\r\n\tborder-top: 1px solid #FFF;\r\n}\r\n\r\n.ytrp_rb_bg_top\r\n{\r\n\ttop: 0;\r\n\tleft: 0;\r\n\tright: 0;\r\n\theight: 4px;\r\n\theight: [YTRP_BAR_THICKNESS_TOKEN]px;\r\n\tborder-bottom: 1px solid #FFF;\r\n}\r\n\r\n.ytrp_rb_bg_left\r\n{\r\n\tleft: 0;\r\n\ttop: 4px;\r\n    top: [YTRP_BAR_THICKNESS_TOKEN]px;\r\n\tbottom: 4px;\r\n    bottom: [YTRP_BAR_THICKNESS_TOKEN]px;\r\n\twidth: 4px;\r\n    width: [YTRP_BAR_THICKNESS_TOKEN]px;\r\n\tborder-right: 1px solid #FFF;\r\n}\r\n\r\n.ytrp_rb_bg_right\r\n{\r\n\tright: 0;\r\n\ttop: 4px;\r\n    top: [YTRP_BAR_THICKNESS_TOKEN]px;\r\n\tbottom: 4px;\r\n    bottom: [YTRP_BAR_THICKNESS_TOKEN]px;\r\n\twidth: 4px;\r\n    width: [YTRP_BAR_THICKNESS_TOKEN]px;\r\n\tborder-left: 1px solid #FFF;\r\n}\r\n\r\n.ytrp_rb_fg_like\r\n{\r\n\tbottom: 0;\r\n\tleft: 0;\r\n\theight: 4px;\r\n    height: [YTRP_BAR_THICKNESS_TOKEN]px;\r\n\tbackground: #2793e6;\r\n    background: [YTRP_LIKE_COLOR_TOKEN];\r\n}\r\n\r\n.ytrp_rb_fg_dislike\r\n{\r\n\tbottom: 0;\r\n\tright: 0;\r\n\theight: 4px;\r\n\theight: [YTRP_BAR_THICKNESS_TOKEN]px;\r\n\tbackground: #CCC;\r\n    background: [YTRP_DISLIKE_COLOR_TOKEN];\r\n\tborder-left: 1px solid #CCC;\r\n    border-left: 1px solid [YTRP_SEPARATOR_COLOR_TOKEN];\r\n}\r\n\r\n.ytrp_rb_fg_norating\r\n{\r\n\tbottom: 0;\r\n\tleft: 0;\r\n\tright: 0;\r\n\theight: 4px;\r\n\theight: [YTRP_BAR_THICKNESS_TOKEN]px;\r\n\tbackground: #CCC;\r\n    background: [YTRP_NORATING_COLOR_TOKEN];\r\n}\r\n\r\n.ytrp_rb_fg_hl\r\n{\r\n\tbackground: #cc181e;\r\n    background: [YTRP_HIGHLIGHT_COLOR_TOKEN];\r\n}\r\n\r\n.ytrp_rb_fg_hl_bottom\r\n{\r\n\tbottom: 0;\r\n\tleft: 0;\r\n\tright: 0;\r\n\theight: 4px;\r\n\theight: [YTRP_BAR_THICKNESS_TOKEN]px;\r\n}\r\n\r\n.ytrp_rb_fg_hl_top\r\n{\r\n\ttop: 0;\r\n\tleft: 0;\r\n\tright: 0;\r\n\theight: 4px;\r\n\theight: [YTRP_BAR_THICKNESS_TOKEN]px;\r\n}\r\n\r\n.ytrp_rb_fg_hl_left\r\n{\r\n\tleft: 0;\r\n\ttop: 0;\r\n\tbottom: 0;\r\n\twidth: 4px;\r\n\twidth: [YTRP_BAR_THICKNESS_TOKEN]px;\r\n}\r\n\r\n.ytrp_rb_fg_hl_right\r\n{\r\n\tright: 0;\r\n\ttop: 0;\r\n\tbottom: 0;\r\n\twidth: 4px;\r\n\twidth: [YTRP_BAR_THICKNESS_TOKEN]px;\r\n}\r\n\r\n.ytrp_tooltip\r\n{\r\n\tposition: absolute;\r\n\tbottom: 0px;\r\n\tleft: 0px;\r\n\twidth: 100%;\r\n\theight: 25%;\r\n\tz-index: 3;\r\n}\r\n\r\n\r\n.video-extras-sparkbars, .video-extras-sparkbar-likes, .video-extras-sparkbar-dislikes\r\n{\r\n\theight: 4px !important;\r\n    height: [YTRP_BAR_THICKNESS_TOKEN]px !important;\r\n}\r\n\r\n.video-extras-sparkbar-likes\r\n{\r\n\tbackground: #2793e6 !important;\r\n    background: [YTRP_LIKE_COLOR_TOKEN] !important;\r\n\tmargin-left: -1px !important; /* Should be made 0 if dislikes are 0 */\r\n    border-right: 1px solid #CCC !important;\r\n    border-right: 1px solid [YTRP_SEPARATOR_COLOR_TOKEN] !important; /* Should be made 0 if dislikes are 0 */\r\n}\r\n\r\n.video-extras-sparkbar-dislikes\r\n{\r\n\tbackground: #CCC !important;\r\n\tbackground: [YTRP_DISLIKE_COLOR_TOKEN] !important;\r\n}\r\n\r\n#sentiment /* For new YouTube material design */\r\n{\r\n\theight: 4px !important;\r\n    height: [YTRP_BAR_THICKNESS_TOKEN]px !important;\r\n    padding: 0 !important;\r\n    background: #CCC !important;\r\n\tbackground: [YTRP_DISLIKE_COLOR_TOKEN] !important;\r\n}\r\n\r\n.ytd-sentiment-bar-renderer /* For new YouTube material design */\r\n{\r\n    background-color: transparent !important;\r\n}\r\n\r\n#like-bar /* For new YouTube material design */\r\n{\r\n\theight: 4px !important;\r\n    height: [YTRP_BAR_THICKNESS_TOKEN]px !important;\r\n\tbackground: #2793e6 !important;\r\n    background: [YTRP_LIKE_COLOR_TOKEN] !important;\r\n    margin-left: -1px !important; \r\n    border-right: 1px solid #CCC !important;\r\n    border-right: 1px solid [YTRP_SEPARATOR_COLOR_TOKEN] !important; /* Should be made 0 if dislikes are 0 */\r\n}\r\n\r\n.watch-view-count\r\n{\r\n\twhite-space: nowrap !important;\r\n    width: auto !important;\r\n    right: 0 !important;\r\n}\r\n\r\n.video-time, .video-actions, .vdur, .ytp-videowall-still-info-duration,\r\nytd-thumbnail-overlay-time-status-renderer /* For new YouTube material design */\r\n{\r\n\tbottom: 6px !important;\r\n    bottom: calc([YTRP_BAR_THICKNESS_TOKEN]px + 2px) !important;\r\n    margin-bottom: 0px !important;\r\n}\r\n\r\n.video-time, .addto-button, .yt-uix-button, .vdur, .ytp-button,\r\nytd-thumbnail-overlay-time-status-renderer, ytd-thumbnail-overlay-toggle-button-renderer /* For new YouTube material design */\r\n{\r\n\tz-index: 4 !important;\r\n}\r\n\r\n.playlist-data-section, .videowall-still-takeover\r\n{\r\n\tz-index: 3 !important;\r\n}\r\n\r\n#masthead-expanded-lists-container\r\n{\r\n\tpadding-bottom: 1px !important;\r\n}\r\n\r\n.resume-playback-background, .resume-playback-progress-bar,\r\nytd-thumbnail-overlay-resume-playback-renderer /* For new YouTube material design */\r\n{\r\n    [YTRP_PLAYBACK_PROGRESS_BAR_TOKEN];\r\n}\r\n\r\n/* For Chrome: prevents bars to be 1px thinner in some thumbnails. Values calculated by trial-error. */\r\n\r\n.yt-thumb-72\r\n{\r\n    height: 40.250px; /* should override 40.500px */\r\n}\r\n\r\n.yt-thumb-100\r\n{\r\n\theight: 56px; /* should override 56.250px */\r\n}\r\n\r\n.yt-thumb-106\r\n{\r\n\theight: 59.125px; /* should override 59.625px */\r\n}\r\n\r\n.yt-thumb-120\r\n{\r\n\theight: 67.250px; /* should override 67.500px */\r\n}\r\n\r\n.yt-thumb-170\r\n{\r\n\theight: 69.250px; /* should override 69.750px */\r\n}\r\n\r\n.yt-thumb-196\r\n{\r\n\theight: 110px; /* should override 110.250px */\r\n}\r\n\r\n.yt-thumb-224\r\n{\r\n\theight: 67.250px; /* Special case, should override 67.500 */\r\n}\r\n\r\n .yt-thumb-370\r\n{\r\n\theight: 226px; /* should override 226.125px */\r\n}\r\n"

/***/ }),

/***/ 33:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const LOCALE = "_locales";
/* harmony export (immutable) */ __webpack_exports__["b"] = LOCALE;

const FILE = "messages.json";
/* harmony export (immutable) */ __webpack_exports__["a"] = FILE;


const YTRP_ENABLE_KEY = 'YTRP_ENABLE_KEY';
/* harmony export (immutable) */ __webpack_exports__["r"] = YTRP_ENABLE_KEY;

const YTRP_BAR_STYLE_KEY = 'YTRP_BAR_STYLE';
/* harmony export (immutable) */ __webpack_exports__["f"] = YTRP_BAR_STYLE_KEY;

const YTRP_BAR_THICKNESS_KEY = 'YTRP_BAR_THICKNESS';
/* harmony export (immutable) */ __webpack_exports__["g"] = YTRP_BAR_THICKNESS_KEY;

const YTRP_HIGHLIGHTED_VIDEOS_KEY = 'YTRP_HIGHLIGHTED_VIDEOS';
/* harmony export (immutable) */ __webpack_exports__["s"] = YTRP_HIGHLIGHTED_VIDEOS_KEY;

const YTRP_SHOW_RP_SCORE_KEY = 'YTRP_SHOW_RP_SCORE';
/* harmony export (immutable) */ __webpack_exports__["u"] = YTRP_SHOW_RP_SCORE_KEY;

const YTRP_BAR_OPACITY_KEY = 'YTRP_BAR_OPACITY';
/* harmony export (immutable) */ __webpack_exports__["e"] = YTRP_BAR_OPACITY_KEY;

const YTRP_CACHING_KEY = 'YTRP_CACHING';
/* harmony export (immutable) */ __webpack_exports__["h"] = YTRP_CACHING_KEY;

const YTRP_PLAYBACK_PROGRESS_BAR_KEY = 'YTRP_PLAYBACK_PROGRESS_BAR';
/* harmony export (immutable) */ __webpack_exports__["t"] = YTRP_PLAYBACK_PROGRESS_BAR_KEY;


const YTRP_DEFAULT_ENABLE = true;
/* harmony export (immutable) */ __webpack_exports__["n"] = YTRP_DEFAULT_ENABLE;

const YTRP_DEFAULT_BAR_STYLE = 1;
/* harmony export (immutable) */ __webpack_exports__["j"] = YTRP_DEFAULT_BAR_STYLE;

const YTRP_DEFAULT_BAR_THICKNESS = 4;
/* harmony export (immutable) */ __webpack_exports__["k"] = YTRP_DEFAULT_BAR_THICKNESS;

const YTRP_DEFAULT_HIGHLIGHTED_VIDEOS = 0;
/* harmony export (immutable) */ __webpack_exports__["o"] = YTRP_DEFAULT_HIGHLIGHTED_VIDEOS;

const YTRP_DEFAULT_SHOW_RP_SCORE = false;
/* harmony export (immutable) */ __webpack_exports__["q"] = YTRP_DEFAULT_SHOW_RP_SCORE;

const YTRP_DEFAULT_BAR_OPACITY = 10;
/* harmony export (immutable) */ __webpack_exports__["i"] = YTRP_DEFAULT_BAR_OPACITY;

const YTRP_DEFAULT_CACHING = 3;
/* harmony export (immutable) */ __webpack_exports__["l"] = YTRP_DEFAULT_CACHING;

const YTRP_DEFAULT_PLAYBACK_PROGRESS_BAR = true;
/* harmony export (immutable) */ __webpack_exports__["p"] = YTRP_DEFAULT_PLAYBACK_PROGRESS_BAR;


const YTRP_DEFAULT_CACHING_DESC = ["Disabled", "5m", "30m", "1h", "2h", "6h", "12h", "24h"];
/* harmony export (immutable) */ __webpack_exports__["m"] = YTRP_DEFAULT_CACHING_DESC;


const YOUTUBE_API_MAX_OPERATIONS_PER_REQUEST = 40;
/* harmony export (immutable) */ __webpack_exports__["d"] = YOUTUBE_API_MAX_OPERATIONS_PER_REQUEST;

const YOUTUBE_API_DEVELOPER_KEY = ["AIzaSyAGosg8Ncdqw8IrwV4iT9E1xCIAVvg4CBw", "AIzaSyDQ9jq7u_2Xc5yp_rf9oaH1HgJZQWfOKEw", "AIzaSyBEWfotUHmjDEg17hlMZXbu2kvfIsgbbVw", "AIzaSyBMCSjKu6byATzbCi0lVqlf_Y8pIpEmxFA", "AIzaSyCZ49MPBhXFNEWc9jvsZqY82nkH_Jwca80", "AIzaSyBPFodMA7VOAr338JfHeR08uv_-CYAj-1w", "AIzaSyCbqbGj5PeSZ028EHINfnsSG-MgHmG7NQk", "AIzaSyBtzKknwPgbOiGXyHOYD5tU-cuaRAbK31M", "AIzaSyCo_RosHubOxkgyksXylL7rueuEDdsHViE"];
/* harmony export (immutable) */ __webpack_exports__["c"] = YOUTUBE_API_DEVELOPER_KEY;


/***/ }),

/***/ 78:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = getLocal;
/* harmony export (immutable) */ __webpack_exports__["c"] = resetSetting;
/* harmony export (immutable) */ __webpack_exports__["d"] = setLocal;
/* harmony export (immutable) */ __webpack_exports__["a"] = addListener;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants__ = __webpack_require__(33);



function getLocal() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get([__WEBPACK_IMPORTED_MODULE_0__constants__["r" /* YTRP_ENABLE_KEY */], __WEBPACK_IMPORTED_MODULE_0__constants__["f" /* YTRP_BAR_STYLE_KEY */], __WEBPACK_IMPORTED_MODULE_0__constants__["g" /* YTRP_BAR_THICKNESS_KEY */], __WEBPACK_IMPORTED_MODULE_0__constants__["s" /* YTRP_HIGHLIGHTED_VIDEOS_KEY */], __WEBPACK_IMPORTED_MODULE_0__constants__["u" /* YTRP_SHOW_RP_SCORE_KEY */], __WEBPACK_IMPORTED_MODULE_0__constants__["e" /* YTRP_BAR_OPACITY_KEY */], __WEBPACK_IMPORTED_MODULE_0__constants__["t" /* YTRP_PLAYBACK_PROGRESS_BAR_KEY */], __WEBPACK_IMPORTED_MODULE_0__constants__["h" /* YTRP_CACHING_KEY */]], result => {
            let needSet = false;
            if (result[__WEBPACK_IMPORTED_MODULE_0__constants__["r" /* YTRP_ENABLE_KEY */]] === undefined) {
                result[__WEBPACK_IMPORTED_MODULE_0__constants__["r" /* YTRP_ENABLE_KEY */]] = __WEBPACK_IMPORTED_MODULE_0__constants__["n" /* YTRP_DEFAULT_ENABLE */];
                needSet = true;
            }
            if (result[__WEBPACK_IMPORTED_MODULE_0__constants__["f" /* YTRP_BAR_STYLE_KEY */]] === undefined) {
                result[__WEBPACK_IMPORTED_MODULE_0__constants__["f" /* YTRP_BAR_STYLE_KEY */]] = __WEBPACK_IMPORTED_MODULE_0__constants__["j" /* YTRP_DEFAULT_BAR_STYLE */];
                needSet = true;
            }
            if (result[__WEBPACK_IMPORTED_MODULE_0__constants__["g" /* YTRP_BAR_THICKNESS_KEY */]] === undefined) {
                result[__WEBPACK_IMPORTED_MODULE_0__constants__["g" /* YTRP_BAR_THICKNESS_KEY */]] = __WEBPACK_IMPORTED_MODULE_0__constants__["k" /* YTRP_DEFAULT_BAR_THICKNESS */];
                needSet = true;
            }
            if (result[__WEBPACK_IMPORTED_MODULE_0__constants__["s" /* YTRP_HIGHLIGHTED_VIDEOS_KEY */]] === undefined) {
                result[__WEBPACK_IMPORTED_MODULE_0__constants__["s" /* YTRP_HIGHLIGHTED_VIDEOS_KEY */]] = __WEBPACK_IMPORTED_MODULE_0__constants__["o" /* YTRP_DEFAULT_HIGHLIGHTED_VIDEOS */];
                needSet = true;
            }
            if (result[__WEBPACK_IMPORTED_MODULE_0__constants__["u" /* YTRP_SHOW_RP_SCORE_KEY */]] === undefined) {
                result[__WEBPACK_IMPORTED_MODULE_0__constants__["u" /* YTRP_SHOW_RP_SCORE_KEY */]] = __WEBPACK_IMPORTED_MODULE_0__constants__["q" /* YTRP_DEFAULT_SHOW_RP_SCORE */];
                needSet = true;
            }
            if (result[__WEBPACK_IMPORTED_MODULE_0__constants__["e" /* YTRP_BAR_OPACITY_KEY */]] === undefined) {
                result[__WEBPACK_IMPORTED_MODULE_0__constants__["e" /* YTRP_BAR_OPACITY_KEY */]] = __WEBPACK_IMPORTED_MODULE_0__constants__["i" /* YTRP_DEFAULT_BAR_OPACITY */];
                needSet = true;
            }
            if (result[__WEBPACK_IMPORTED_MODULE_0__constants__["h" /* YTRP_CACHING_KEY */]] === undefined) {
                result[__WEBPACK_IMPORTED_MODULE_0__constants__["h" /* YTRP_CACHING_KEY */]] = __WEBPACK_IMPORTED_MODULE_0__constants__["l" /* YTRP_DEFAULT_CACHING */];
                needSet = true;
            }
            if (result[__WEBPACK_IMPORTED_MODULE_0__constants__["t" /* YTRP_PLAYBACK_PROGRESS_BAR_KEY */]] === undefined) {
                result[__WEBPACK_IMPORTED_MODULE_0__constants__["t" /* YTRP_PLAYBACK_PROGRESS_BAR_KEY */]] = __WEBPACK_IMPORTED_MODULE_0__constants__["p" /* YTRP_DEFAULT_PLAYBACK_PROGRESS_BAR */];
                needSet = true;
            }
            if (needSet) {
                chrome.storage.local.set(result, () => {
                    resolve(result);
                });
            } else {
                resolve(result);
            }
        });
    });
}

function resetSetting() {
    chrome.storage.local.set({
        [__WEBPACK_IMPORTED_MODULE_0__constants__["r" /* YTRP_ENABLE_KEY */]]: __WEBPACK_IMPORTED_MODULE_0__constants__["n" /* YTRP_DEFAULT_ENABLE */],
        [__WEBPACK_IMPORTED_MODULE_0__constants__["f" /* YTRP_BAR_STYLE_KEY */]]: __WEBPACK_IMPORTED_MODULE_0__constants__["j" /* YTRP_DEFAULT_BAR_STYLE */],
        [__WEBPACK_IMPORTED_MODULE_0__constants__["g" /* YTRP_BAR_THICKNESS_KEY */]]: __WEBPACK_IMPORTED_MODULE_0__constants__["k" /* YTRP_DEFAULT_BAR_THICKNESS */],
        [__WEBPACK_IMPORTED_MODULE_0__constants__["s" /* YTRP_HIGHLIGHTED_VIDEOS_KEY */]]: __WEBPACK_IMPORTED_MODULE_0__constants__["o" /* YTRP_DEFAULT_HIGHLIGHTED_VIDEOS */],
        [__WEBPACK_IMPORTED_MODULE_0__constants__["u" /* YTRP_SHOW_RP_SCORE_KEY */]]: __WEBPACK_IMPORTED_MODULE_0__constants__["q" /* YTRP_DEFAULT_SHOW_RP_SCORE */],
        [__WEBPACK_IMPORTED_MODULE_0__constants__["e" /* YTRP_BAR_OPACITY_KEY */]]: __WEBPACK_IMPORTED_MODULE_0__constants__["i" /* YTRP_DEFAULT_BAR_OPACITY */],
        [__WEBPACK_IMPORTED_MODULE_0__constants__["h" /* YTRP_CACHING_KEY */]]: __WEBPACK_IMPORTED_MODULE_0__constants__["l" /* YTRP_DEFAULT_CACHING */],
        [__WEBPACK_IMPORTED_MODULE_0__constants__["t" /* YTRP_PLAYBACK_PROGRESS_BAR_KEY */]]: __WEBPACK_IMPORTED_MODULE_0__constants__["p" /* YTRP_DEFAULT_PLAYBACK_PROGRESS_BAR */]
    });
}

function setLocal(setting) {
    chrome.storage.local.set(setting);
}

function addListener(listener) {
    chrome.storage.onChanged.addListener((changes, namespace) => {
        const newChanges = {};
        for (let key in changes) {
            const storageChange = changes[key];
            newChanges[key] = storageChange.newValue;
        }
        listener(newChanges);
    });
}

/***/ })

/******/ });