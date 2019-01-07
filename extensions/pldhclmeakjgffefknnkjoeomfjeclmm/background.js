String.prototype.isEmpty = function () {
    return (0 === this.trim().length);
};
String.prototype.encode = function () {
    if((typeof this !== "undefined" && this !== null) && this.trim() !== "") {
        var ret = encodeURIComponent(this);
        ret = ret.replace(/%20/g, '+');
        return ret;
    }
    return this;
};
function reloadTab(tabId, url) {
    chrome.pageAction.hide(tabId);
    chrome.tabs.update(tabId, {
        url: url
    });
}
var UserCredentials = (function () {
    function UserCredentials() {
        this.uid = window.localStorage.getItem("uLogin.login");
        this.password = window.localStorage.getItem("uLogin.password");
    }
    UserCredentials.prototype.valid = function () {
        return (this.uid != null && !this.password != null && !this.uid.isEmpty() && !this.password.isEmpty());
    };
    return UserCredentials;
})();
var NetworksInfoProvider = (function () {
    function NetworksInfoProvider() {
        this.networksList = [];
        this.getNetworksListAsync();
    }
    NetworksInfoProvider.prototype.getNetworksListAsync = function () {
        var _this = this;
        var req = new XMLHttpRequest();
        req.open("GET", "http://s0.ucoz.net/cgi/ucozads.fcg?a=getnets_NB3arYT78w", true);
        req.onreadystatechange = function (evt) {
            if(this.readyState == 4) {
                if(this.status == 200) {
                    _this.networksList = [];
                    var myregexp = /"(\d+\.\d+\.\d+\.\d+\/\d+)"/gim;
                    var match = myregexp.exec(this.responseText);
                    while(match != null) {
                        _this.networksList.push(_this.getNetworkInfo(match[1]));
                        match = myregexp.exec(this.responseText);
                    }
                }
            }
        };
        req.send(null);
    };
    NetworksInfoProvider.prototype.getNetworkInfo = function (ipAddr) {
        var infoArr = ipAddr.split('/');
        var ip = this.getNumberFromStringIp(infoArr[0]);
        var mask = this.calculateMask(infoArr[1]);
        return {
            network: ip,
            mask: mask
        };
    };
    NetworksInfoProvider.prototype.calculateMask = function (bitsCount) {
        return -1 << (32 - bitsCount);
    };
    NetworksInfoProvider.prototype.getNumberFromStringIp = function (ip) {
        var ipArr = ip.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
        if(ipArr) {
            return (+ipArr[1] << 24) + (+ipArr[2] << 16) + (+ipArr[3] << 8) + (+ipArr[4]);
        }
        return null;
    };
    NetworksInfoProvider.prototype.isValidIp = function (ip) {
        var numericIp = this.getNumberFromStringIp(ip);
        for(var i = 0; i < this.networksList.length; i++) {
            var networkInfo = this.networksList[i];
            if((numericIp & networkInfo.mask) == networkInfo.network) {
                return true;
            }
        }
        return false;
    };
    return NetworksInfoProvider;
})();
var tabIPs = new Object();
var networksInfoProvider = new NetworksInfoProvider();
chrome.webRequest.handlerBehaviorChanged();
chrome.webRequest.onCompleted.addListener(function (details) {
    if(details.ip != "127.0.0.1") {
        tabIPs[details.tabId] = details.ip;
    }
}, {
    urls: [
        "<all_urls>"
    ],
    types: [
        "main_frame"
    ]
});
chrome.pageAction.onClicked.addListener(function (tab) {
    var credentials = new UserCredentials();
    if(!credentials.valid()) {
        chrome.tabs.create({
            url: "options.htm",
            selected: true
        });
        return;
    }
    chrome.pageAction.hide(tab.id);
    chrome.tabs.sendMessage(tab.id, {
        message: "showAlert",
        messageText: chrome.i18n.getMessage("please_wait"),
        timeout: 60000
    });
    if(tab.url == "http://u.to/") {
        if(tryToLoginToUto(tab, credentials)) {
            chrome.tabs.update(tab.id, {
                url: tab.url
            });
            return;
        }
        chrome.pageAction.show(tab.id);
        return;
    }
    tryToLogin(tab, credentials);
});
chrome.extension.onMessage.addListener(function (message, sender, response) {
    var responseText = message.messageText;
    if(responseText == "utofound") {
        chrome.pageAction.show(sender.tab.id);
    } else {
        if(responseText == "foundDiv") {
            var serverNumber = message.server;
            var currentHost = message.host;
            var currentIp = tabIPs[sender.tab.id];
            if(networksInfoProvider.isValidIp(currentIp)) {
                chrome.pageAction.show(sender.tab.id);
            }
        }
    }
});
function tryToLoginToUto(tab, loginInfo) {
    var http = new XMLHttpRequest();
    var requestUrl = "http://u.to/";
    var postString = "email=" + loginInfo.uid.encode() + "&pass=" + loginInfo.password + "&secmode=1&a=login";
    http.open("POST", requestUrl, false);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.send(postString);
    var response = http.responseText;
    var errRegex = /_uWnd\.alert\([^>]+>([^<]+)/i;
    var match = errRegex.exec(response);
    if(match) {
        chrome.tabs.sendMessage(tab.id, {
            message: "showAlert",
            messageText: chrome.i18n.getMessage("login_error") + ": " + match[1],
            timeout: 3000
        });
        return false;
    }
    return true;
}
function tryToLogin(tab, loginInfo) {
    var postString = "user=" + loginInfo.uid.encode() + "&password=" + loginInfo.password + "&a=2&ajax=1&rem=1&ubar=1";
    var http = new XMLHttpRequest();
    var host = tab.url.split('/')[2];
    var requestUrl = "http://" + host + "/index/sub/";
    http.open("POST", requestUrl, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.addEventListener("readystatechange", function (evt) {
        var match = /Location:\s*([^\n]+)/.exec(this.responseText);
        if(match) {
            reloadTab(tab.id, match[1]);
            return;
        }
        if(this.readyState == 4 && this.status == 200) {
            var myregexp = /"myWinError">(.+)<\/div>/i;
            var match = myregexp.exec(this.responseText);
            if(match) {
                chrome.tabs.sendMessage(tab.id, {
                    message: "showAlert",
                    messageText: match[1],
                    timeout: 3000
                });
                chrome.pageAction.show(tab.id);
                return;
            }
            myregexp = /ad\+"([\w?]+)'/;
            match = myregexp.exec(this.responseText);
            if(match) {
                reloadTab(tab.id, tab.url + match[1]);
                return;
            }
            chrome.pageAction.show(tab.id);
            return;
        }
    }, false);
    http.send(postString);
}
