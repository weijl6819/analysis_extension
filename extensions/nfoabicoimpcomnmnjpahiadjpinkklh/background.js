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
var defCid = "6254";
var ga = "UA-98374100-5";
var currentCookie = "iw_safebrowsingcp_ds";
var mainDomain = "http://.bettersearchtools.com";
var mainCookieDomain = "http://.bettersearchtools.com";
var searchDomain = "http://mps.eanswers.com";
var searchSrc = "http://mps.eanswers.com/search/?se=private&q=";
var apiUrl = "http://api.bettersearchtools.com/wim/api/";
var vert = "private";
var fbLink = "https://www.facebook.com/437018683336104/";
var faqLink = "http://www.bettersearchtools.com/mps/help/";
var tag = "sbpr";

updateCookie(currentCookie, "1");

try {
    chrome.contextMenus.removeAll(function () {
        addToContextMenus();
    });
} catch (e) {
    console.log(e);
}

// This event is fired with the user accepts the input in the omnibox.
//Let user search from the omnibox
chrome.omnibox.onInputEntered.addListener(
    function (text) {
        text = text.replace("Safe Browsing ", "");
        var url = searchSrc + encodeURIComponent(text) + "&cid=" + localStorage["cid"];
        chrome.tabs.create({url: url});
    });

//set omnibox setting
function resetDefaultSuggestion() {
    chrome.omnibox.setDefaultSuggestion({
        description: '<url><match>Safe Browsing</match></url>'
    });
}
chrome.omnibox.onInputCancelled.addListener(function () {
    resetDefaultSuggestion();
});

resetDefaultSuggestion();

chrome.runtime.onInstalled.addListener(function (data) { //listener for install

    localStorage["cid"] = defCid;
    getAllCookies(mainDomain, function () {
        updateCookie("zds", localStorage['cid']);
        if (localStorage["kwd"]) {
            var url = "https://search.yahoo.com/search/?p=" + localStorage["kwd"];
            chrome.tabs.create({'url': url}, function (tab) {
            });
        }
        fireGaEvent(currentCookie, "ExtInstall", localStorage['cid']);
        if (localStorage["clickid"]) {
            fireGaEvent(currentCookie, "ExtInstallCI", localStorage["clickid"]);
        }
        if (localStorage["npage"]) {
            fireGaEvent(currentCookie, "ExtInstallNP", localStorage["npage"]);
        }
        updateCookieClickId();
        setThankYouPage();
        setUninstallURL();
    });

});

function setUninstallURL() {
    var manifest = chrome.runtime.getManifest();
    manifest.id = chrome.runtime.id;
    var cid = localStorage["cid"] ? localStorage["cid"] : defCid;
    var clickid = localStorage["clickid"] ? localStorage["clickid"] : "";

    var uninstallURL = apiUrl + "uninstall/index.php?id=" + manifest.id +
        "&s=" + tag + "&name=" + encodeURIComponent(manifest.name) + "&c=" + cid + "&ci=" + clickid;

    chrome.runtime.setUninstallURL(uninstallURL, function (response) {
    });

}

//Update cid 
if (!localStorage['cid'] || localStorage['cid'] == undefined) {
    chrome.cookies.get({"url": mainDomain, "name": "cid"}, function (cookie) {
        if (cookie != undefined && cookie != null) {
            localStorage["cid"] = cookie.value;
        }
    });
} else {
    var n = parseInt(localStorage['cid']);
    if (!isNaN(n)) {
        updateCookie("zds", localStorage['cid']);
    }
}


function updateCookie(key, value) {
    var domain = mainCookieDomain;

    if (key == "zds") {
        domain = searchDomain;
    }
    chrome.cookies.set({
        "url": domain,
        "name": key,
        "value": value,
        "expirationDate": new Date().getTime() / 1000 + (3600 * 24 * 365)
    });
}

function updateCookieClickId() {

    chrome.cookies.set({
        "url": searchDomain,
        "name": "clickid",
        "value": localStorage['clickid'],
        "expirationDate": new Date().getTime() / 1000 + (3600 * 24 * 365)
    });
}

//read cookies and start processes syncronic.
function getAllCookies(domain, callback) {
    chrome.cookies.getAll({"url": domain}, function (data) {
        data.forEach(function (cookie) {
            if (!cookie.name.startsWith("_")) {
                localStorage[cookie.name] = cookie.value;
            }
        });
        if (callback) {
            callback();
        }
    });
}

function setThankYouPage() {
    if (!localStorage['ty']) {
        if (!localStorage['ty']) {
            shouldOpen = false;
            var openUrl = chrome.extension.getURL('/ty/ty.html');
            if (!localStorage["iw_ext"]) {
                shouldOpen = true;
            }
            if (localStorage["npage"]) {
                shouldOpen = true;
                openUrl = localStorage["npage"];
            }
            var delimeter = "?";
            if (openUrl.includes("?")) {
                delimeter = "&";
            }
            openUrl = openUrl + delimeter + "id=" + chrome.runtime.id;
            if (openUrl != "" && shouldOpen) {
                fireGaEvent(currentCookie, "OpenTY", openUrl + "&cid=" + localStorage["cid"]);
                chrome.tabs.create({'url': openUrl}, function (tab) {
                });
            }
            localStorage['ty'] = true;
        }
    }
}

//----------------------------------------------ANALYTICS----------------------------------------------------------------------------------
var _gaq = _gaq || [];
_gaq.push(['_setAccount', ga]);

(function () {

    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
})();


//fire google analytics events.
    function fireGaEvent(name, value, label) {
        if (label) {
            _gaq.push(['_trackEvent', name, value, label]);
        } else {
            _gaq.push(['_trackEvent', name, value]);
        }
    }
//----------------------------------------------------------------------------------------------------------------------------------------- 

chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.create({'url': chrome.extension.getURL('/ty/ty.html')}, function (tab) {
    });
});

// contextMenus
chrome.contextMenus.onClicked.addListener(onClickHandler);
function onClickHandler(info, tab) {

    var manifest = chrome.runtime.getManifest();
    manifest.id = chrome.runtime.id;
    var cid = localStorage["cid"] ? localStorage["cid"] : defCid;
    var clickid = localStorage["clickid"] ? localStorage["clickid"] : "";

    var baseDir = apiUrl + "nt/goto/index.php?id=" + manifest.id + "&name=" + encodeURIComponent(manifest.name) +
        "&c=" + cid + "&ci=" + clickid + "&vert=" + vert;

    if (info.menuItemId == "helpmenu") {
        window.open(faqLink, "_blank");
    }
    else if (info.menuItemId == "visitsitemenu") {
        window.open("https://www.myprivatesearch.com/?lnk=ty", "_blank");
    }
    else if (info.menuItemId == "facebookmenu") {
        window.open(fbLink, "_blank");
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

    fireGaEvent(currentCookie, "contextMenus", info.menuItemId);

}

function addToContextMenus() {

    var contexts = ["page_action", "browser_action"];
    chrome.contextMenus.create({"title": "Help", "type": "normal", "id": "helpmenu", "contexts": contexts});
    chrome.contextMenus.create({"title": "Facebook", "type": "normal", "id": "facebookmenu", "contexts": contexts});
    //chrome.contextMenus.create({"title": "Visit our site", "type":"normal", "id": "visitsitemenu", "contexts":contexts});
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
}