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
/*
 ***********************************************************************************************************************
 ----------------------------------------- BASE CONFIG -----------------------------------------------------------------
 ***********************************************************************************************************************
 */
var config = {
    destinationSite: "http://j.gomusix.com",
    verticalSearchEndpoint: "/?s=",
    searchDomain: "http://music.eanswers.com",
    hubDomain: "theappjunkies.com",
    defCid: "6278",
    ga: "UA-102040193-2",
    yLetters: "ojds",
    vertical: "music",
    currentCookie: "iw_songsjunkie_ds",
    tnkUrl: "?lnk=tnk",
    helpUrl: "help/default/index.php?vert=music",
    privacyUrl: "/privacy.php",
    termsUrl: "/terms.php",
    fbPageId: "320667408383451",
    aliveInterval: 1000*60*60, // 1 hour
    omniboxText: "music for ",
    omniboxResetText: "<url><match>Search music</match></url>",
    omniboxLetter: "m",
	searchType: "music",
    isHub: "false"
};

/*
 ***********************************************************************************************************************
 -------------------------------------------- KEYS ---------------------------------------------------------------------
 ***********************************************************************************************************************
 */
var keys = {
    searchUrl: "searchUrl",
    mainDomain: "mainDomain",
    apiUrl: "apiUrl",
    baseDir: "baseDir",
    clickid: "clickid",
    cid: "cid",
    iw_ext: "iw_ext",
    npage: "npage",
    ty: "ty",
    hubUrl: "hubUrl",
    firstRun: "firstRun",
    lastAlive: 'lastAlive',
    searchEngine: "searchEngine",
    privateMode: "privatemode",
    zds: "zds",
    offers: "offers",
    lastOffer: "lastOffer"
};

/*
 ***********************************************************************************************************************
 -------------------------------------------- WI SUBDOMAINS ------------------------------------------------------------
 ***********************************************************************************************************************
 */

var subDomains = {
    movies: "movie",
    music: "music",
    sporttv: "tvsport",
    games: "games",
    tv: "tv",
    media: "media",
    sport: "sport",
    series: "series",
    private: "private",
    getSubDomain: function(){
        if (config.isHub) {
            return subDomains[config.vertical];
        }
        return "ext";
    }
};

/*
 ***********************************************************************************************************************
 -------------------------------------------- URLS ---------------------------------------------------------------------
 ***********************************************************************************************************************
 */
var urls = {
    hubUrl: "http://www." + config.hubDomain,
    mainCookieDomain: "http://." + config.hubDomain,
    mainDomain: "http://" + subDomains.getSubDomain() + "." + config.hubDomain,
    searchDomain: config.searchDomain,
    searchUrl: config.searchDomain + "/go/index.php?category=###param0###&s=" + config.yLetters + "&q=###param1###",
    verticalSearchUrl: config.destinationSite + config.verticalSearchEndpoint,
    uninstallUrl: "uninstall/index.php",
    apiUrl: "http://api." + config.hubDomain + "/wim/api/",
    baseEndpoint: "nt3/goto/index.php",
    offersUrl: "http://api." + config.hubDomain + "/wim/api/verticals/index.php?vert=" + config.vertical + "&action=get",
    setBasicUrls: function () {
        storageManager.set(keys.searchUrl, this.searchUrl);
        storageManager.set(keys.mainDomain, this.mainDomain);
        storageManager.set(keys.apiUrl, this.apiUrl);
        // storageManager.set(keys.searchType, this.searchType);

        if (!storageManager.exists(keys.cid) || storageManager.get(keys.cid) == undefined) {
            cookies.getCookie(urls.mainCookieDomain, keys.cid);
        } else {
            var n = parseInt(storageManager.get(keys.cid));
            if (!isNaN(n)) {
                cookies.updateCookieForDomain(config.searchDomain, keys.zds, storageManager.get(keys.cid));
            }
        }

        var manifest = chrome.runtime.getManifest();
        manifest.id = chrome.runtime.id;
        var cid = storageManager.get(keys.cid) ? storageManager.get(keys.cid) : config.defCid;
        var clickid = storageManager.get(keys.clickid) ? storageManager.get(keys.clickid) : "";
        storageManager.set(keys.baseDir, this.apiUrl + this.baseEndpoint + "?id=" + manifest.id + "&name=" +
            encodeURIComponent(manifest.name) + "&c=" + cid + "&ci=" + clickid + "&vert=" + config.vertical);
    },
    setUninstallUrl: function () {
        setTimeout(function () {
            var manifest = chrome.runtime.getManifest();
            manifest.id = chrome.runtime.id;
            var cid = storageManager.get(keys.cid) ? storageManager.get(keys.cid) : "";
            var clickid = storageManager.get(keys.clickid) ? storageManager.get(keys.clickid) : "";
            var uninstallURL = urls.apiUrl + urls.uninstallUrl + "?u=" + encodeURIComponent(config.searchDomain) + "&id=" + manifest.id +
                "&name=" + encodeURIComponent(manifest.name) + "&c=" + cid + "&ci=" + clickid + "&s=" + config.yLetters;
            chrome.runtime.setUninstallURL(uninstallURL, function (response) {
            });
        }, 5000);
    },
    setThankYouPage: function () {
        var myid = chrome.runtime.id;
        if (!storageManager.exists(keys.ty)) {
            var openUrl = config.destinationSite + config.tnkUrl + "&id=" + myid;
            if (storageManager.exists(keys.npage)) {
                openUrl = storageManager.get(keys.npage);
            }
            if (openUrl != "") {
                window.open(openUrl);
            }
            storageManager.set(keys.ty, true);
        }
    }
};

/*
 ***********************************************************************************************************************
 ----------------------------------------- STORAGE MANAGER -------------------------------------------------------------
 ***********************************************************************************************************************
 */
var storageManager = {
    set: function (key, value) {
        localStorage[key] = value;
    },
    get: function (key) {
        return localStorage.getItem(key);
    },
    exists: function (key) {
        return (this.get(key) != null && this.get(key) != undefined);
    }
};

/*
 ***********************************************************************************************************************
 ------------------------------------------ ANALYTICS ------------------------------------------------------------------
 ***********************************************************************************************************************
 */
var _gaq = _gaq || [];
_gaq.push(['_setAccount', config.ga]);

var analytics = {
    actionMenu: {
        actionName: "action_menu",
        open: "open",
        like: "like",
        feedback: "feedback",
        share: "share",
        search: "search",
        help: "help",
        home: "home",
        itemClick: "item_click",
        menu: "menu",
        private: function(isPrivate){
          var mode = isPrivate? "on" : "off";
          return "private_" + mode;
        },
        contextMenu: "context_menu",
        searchEngineSelected: function (se) {
            return "search_engine_" + se;
        }
    },
    installed: "ext_installed",
    updated: "ext_updated",
    loaded: "ext_loaded",
    alive: "ext_alive",
    init: function () {
        var ga = document.createElement('script');
        ga.type = 'text/javascript';
        ga.async = true;
        ga.src = 'https://ssl.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(ga, s);
    },
    fireGaEvent: function (name, value, label) {
        if (label) {
            _gaq.push(['_trackEvent', name, value, label]);
        } else {
            _gaq.push(['_trackEvent', name, value]);
        }
    },
    reportAlive: function() {
        var timePassed = new Date().getTime() - analytics.getLastAlive();
        if (timePassed >= config.aliveInterval) {
            storageManager.set(keys.lastAlive, new Date().getTime());
            analytics.fireGaEvent(config.currentCookie, analytics.alive, storageManager.get(keys.cid));
        }
        setTimeout(analytics.reportAlive, config.aliveInterval);
    },
    getLastAlive: function() {
        if (isNaN(storageManager.get(keys.lastAlive)) || storageManager.get(keys.lastAlive) < 0) {
            return 0;
        } else {
            return storageManager.get(keys.lastAlive);
        }
    }
};

/*
 ***********************************************************************************************************************
 ------------------------------------------ COOKIES --------------------------------------------------------------------
 ***********************************************************************************************************************
 */
var cookies = {
    updateCookie: function (key, value) {
        chrome.cookies.set({
            "url": urls.mainCookieDomain,
            "name": key,
            "value": value,
            "expirationDate": new Date().getTime() / 1000 + (3600 * 24 * 365)
        });
    },
    updateCookieForDomain: function(domain, key, value) {
        chrome.cookies.set({
            "url" : domain,
            "name" : key,
            "value" : value,
            "expirationDate" : new Date().getTime() / 1000 + (3600 * 24 * 365)
        });
    },
    updateCookieClickId: function () {
        chrome.cookies.set({
            "url": urls.searchDomain,
            "name": keys.clickid,
            "value": storageManager.get(keys.clickid),
            "expirationDate": new Date().getTime() / 1000 + (3600 * 24 * 365)
        });
    },
    getCookie: function (domain, name) {
        chrome.cookies.get({"url": domain, "name": name}, function (cookie) {
            if (cookie != undefined) {
                if (name == keys.cid) {
                    try {
                        var n = parseInt(cookie.value);
                        if (!isNaN(n)) {
                            storageManager.set(keys.cid, cookie.value);
							var manifest = chrome.runtime.getManifest();
                            manifest.id = chrome.runtime.id;
                            var cid = cookie.value;
                            var clickid = storageManager.get(keys.clickid) ? storageManager.get(keys.clickid) : "";
                            storageManager.set(keys.baseDir, urls.apiUrl + urls.baseEndpoint + "?id=" + manifest.id + "&name=" +
                                encodeURIComponent(manifest.name) + "&c=" + cid + "&ci=" + clickid + "&vert=" + config.vertical);
                        } else {
                            storageManager.set(keys.cid, config.defCid);
                        }
                    } catch (e) {
                        storageManager.set(keys.cid, config.defCid);
                    }
                    cookies.updateCookieForDomain(config.searchDomain, keys.zds, storageManager.get(keys.cid));
                } else if (name == keys.iw_ext) {
                    storageManager.set(keys.iw_ext, true);
                } else if (name == keys.clickid) {
                    storageManager.set(keys.clickid, cookie.value);
                    cookies.updateCookieClickId();
                } else if (name == keys.npage) {
                    storageManager.set(keys.npage, cookie.value);
                    urls.setThankYouPage();
                } else {
                    storageManager.set(name, cookie.value);
                }
            } else if (name == keys.iw_ext) {
                urls.setThankYouPage();
            } else if (name == keys.cid) {
                storageManager.set(keys.cid, config.defCid);
                cookies.updateCookieForDomain(config.searchDomain, keys.zds, config.defCid);
            }
        });
    },
    updateCid: function () {
        if (!storageManager.exists(keys.cid)) {
            cookies.getCookie(urls.mainDomain, keys.cid);
        }
    }
};

/*
 ***********************************************************************************************************************
 ------------------------------------------ LISTENERS ------------------------------------------------------------------
 ***********************************************************************************************************************
 */
var listeners = {
    onInstall: function () {
        chrome.runtime.onInstalled.addListener(function (data) {
            if (data["reason"] == "install") {
                cookies.getCookie(urls.mainDomain, keys.npage);
                cookies.getCookie(urls.mainCookieDomain, keys.cid);
                cookies.getCookie(urls.mainDomain, keys.iw_ext);
                cookies.getCookie(urls.mainDomain, keys.clickid);

                urls.setUninstallUrl();

                analytics.fireGaEvent(config.currentCookie, analytics.installed, storageManager.get(keys.cid));
                storageManager.set(keys.firstRun, 1);
                storageManager.set(keys.lastAlive, 0);
                setTimeout(function() {
                    analytics.reportAlive();
                }, config.aliveInterval);
            } else if (data["reason"] == "update") {
                analytics.fireGaEvent(config.currentCookie, analytics.updated, storageManager.get(keys.cid));
            }
        });
    },
    onMessage: function () {
        chrome.runtime.onMessage.addListener(
            function (request, sender, sendResponse) {
                if (request.ga) {
                    analytics.fireGaEvent(config.currentCookie, request.action, request.label);
                } else if (request.se){//searchengine
                    cookies.updateCookieForDomain(config.searchDomain, "se",request.se);
                }
            });
    },
    omnibox: function(){
        function resetDefaultSuggestion() {
            chrome.omnibox.setDefaultSuggestion({
                description: config.omniboxResetText
            });
        }
        chrome.omnibox.onInputEntered.addListener(
            function (text) {
                text = text.replace(config.omniboxText, "");
                var url = urls.verticalSearchUrl + encodeURIComponent(text);
                chrome.tabs.create({url: url});
            });
        chrome.omnibox.onInputCancelled.addListener(function () {
            resetDefaultSuggestion();
        });
        resetDefaultSuggestion();
    },
    registerContextMenu: function() {
        var contexts = ["page_action", "browser_action"];
        chrome.contextMenus.removeAll(function(){
            chrome.contextMenus.create({"title": "Help", "type": "normal", "id": "helpmenu", "contexts": contexts});
            chrome.contextMenus.create({"title": "Facebook", "type": "normal", "id": "facebookmenu", "contexts": contexts});
            chrome.contextMenus.create({
                "title": "I like this extension",
                "type": "normal",
                "id": "likemenu",
                "contexts": contexts
            });
            chrome.contextMenus.create({
                "title": "I don’t like this extension",
                "type": "normal",
                "id": "notlikemenu",
                "contexts": contexts
            });
            chrome.contextMenus.create({
                "title": "Share with friends",
                "type": "normal",
                "id": "sharemenu",
                "contexts": contexts
            });
        });
        chrome.contextMenus.onClicked.addListener(function(info, tab) {
            var manifest = chrome.runtime.getManifest();
            manifest.id = chrome.runtime.id;
            var cid = storageManager.get(keys.cid);
            var clickid = storageManager.get(keys.clickid) ? storageManager.get(keys.clickid) : "";

            var baseDir = storageManager.get(keys.baseDir);

            if (info.menuItemId == "helpmenu") {
                window.open(urls.apiUrl + config.helpUrl, "_blank");
            }
            else if (info.menuItemId == "visitsitemenu") {
                window.open(urls.hubUrl, "_blank");
            }
            else if (info.menuItemId == "facebookmenu") {
                window.open("http://www.facebook.com/" + config.fbPageId, "_blank");
            }
            else if (info.menuItemId == "likemenu") {
                window.open(baseDir + "&a=likeLink", "_blank");
            }
            else if (info.menuItemId == "notlikemenu") {
                window.open(baseDir + "&a=notLikeLink", "_blank");
            }
            else if (info.menuItemId == "sharemenu") {
                window.open(baseDir + "&a=shareLink", "_blank");
            }

            analytics.fireGaEvent(config.currentCookie, analytics.actionMenu.actionName, analytics.actionMenu.contextMenu+"_"+info.menuItemId);
        });
    }
};