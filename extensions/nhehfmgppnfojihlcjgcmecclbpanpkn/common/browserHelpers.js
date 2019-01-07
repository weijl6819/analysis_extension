"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
class Uri {
    static parse(url) {
        var uri = new Uri();
        let a = document.createElement('a');
        a.href = url;
        uri.source = url;
        uri.protocol = a.protocol.replace(':', '');
        uri.host = a.hostname;
        uri.port = a.port;
        uri.query = a.search;
        uri.params = Uri.parseParams(uri.query);
        uri.hash = a.hash.replace('#', '');
        uri.hashParams = Uri.parseParams(uri.hash);
        uri.path = a.pathname.charAt(0) === '/' ? a.pathname.substring(1) : a.pathname;
        uri.segments = uri.path.split('/');
        return uri;
    }
    static parseParams(query) {
        let result = {};
        let segments = query.replace('?', '').split('&');
        let len = segments.length;
        for (let i = 0; i < len; i++) {
            if (!segments[i]) {
                continue;
            }
            let parts = segments[i].split('=');
            result[window.decodeURIComponent(parts[0])] = window.decodeURIComponent(parts[1]);
        }
        return result;
    }
}
exports.Uri = Uri;
var browserHelpers;
(function (browserHelpers) {
    function getActiveTabUrl() {
        return getActiveTab().then(tab => {
            return Uri.parse(tab.url);
        });
    }
    browserHelpers.getActiveTabUrl = getActiveTabUrl;
    function getActiveTab() {
        return new Promise((resolve, reject) => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                //workaround for debugging - while debugging if we lose focus we can no longer find the active tab
                //so we store the last used tab id and use it if we can't find the active tab
                if (tabs.length > 0) {
                    common_1.common.Globals.TabId = tabs[0].id;
                    resolve(tabs[0]);
                    return;
                }
                chrome.tabs.get(common_1.common.Globals.TabId, tab => {
                    if (!tab) {
                        reject("active tab not found");
                    }
                    resolve(tab);
                });
            });
        });
    }
    browserHelpers.getActiveTab = getActiveTab;
    function openTab(url) {
        return new Promise((resolve, reject) => {
            chrome.tabs.create({ url: url }, t => { resolve(t); });
        });
    }
    browserHelpers.openTab = openTab;
    function openSettings() {
        let settingsUrl = chrome.extension.getURL("settings.html");
        browserHelpers.openTab(settingsUrl);
    }
    browserHelpers.openSettings = openSettings;
    function getOrOpenTab(url) {
        let uri = Uri.parse(url);
        return getTab(uri).then(tab => tab, () => openTab(url));
    }
    browserHelpers.getOrOpenTab = getOrOpenTab;
    function getTab(uri) {
        return new Promise((resolve, reject) => {
            chrome.tabs.query({}, (tabs) => {
                let tab = tabs.find((tab) => {
                    let tabUri = Uri.parse(tab.url);
                    var isMatch = tabUri.protocol == uri.protocol
                        && tabUri.host == uri.host
                        && tabUri.path == uri.path;
                    for (let param in uri.params) {
                        isMatch = isMatch && tabUri.params[param] === uri.params[param];
                    }
                    return isMatch;
                });
                if (tab) {
                    resolve(tab);
                }
                else {
                    reject();
                }
            });
        });
    }
    browserHelpers.getTab = getTab;
})(browserHelpers = exports.browserHelpers || (exports.browserHelpers = {}));
//# sourceMappingURL=browserHelpers.js.map