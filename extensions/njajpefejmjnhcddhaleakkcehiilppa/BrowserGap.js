function BrowserGap(unittest) { //jshint ignore: line

    var isChrome = true;
    var _ctid = "",
        _version = "",
        _uiLang = "",
        _os = "";

    function init() {
        _loadTrackingParams();
    }

    /*Initializes the extension button*/
    function initExtensionButton() {
        chrome.browserAction.onClicked.addListener(function (tab) {
            extGlobal.widerMailManager.navToMailSite();
        });
    }

    function getVersion() {
        return _version;
    }

    function getUILanguage() {
        return _uiLang;
    }

    function getCTID() {
        return _ctid;
    }

    function getOS() {
        return _os;
    }

    function _loadTrackingParams() {
        _ctid = localStorage.getItem('ctid');
        if (!_ctid) {
            _ctid = _generateCTID();
            localStorage.setItem('ctid', _ctid);
        }
        _version = chrome.runtime.getManifest().version;
        _uiLang = chrome.i18n.getUILanguage();
        chrome.runtime.getPlatformInfo(function (platformInfo) {
            _os = platformInfo.os;
            return;
        });

    }

    function _generateCTID() {
        var strUUID = "";

        try {
            var timeSeed = ((new Date()).getTime()).toString();
            timeSeed = timeSeed.substr(timeSeed.length - 3);
            for (var seedOn = 0; seedOn < timeSeed; seedOn++) {
                Math.random();
            }

            for (var charOn = 0; charOn < 32; charOn++) {
                var charCur = Math.floor(Math.random() * 36);
                if (charCur > 25) {
                    charCur = String.fromCharCode(48 + charCur - 26);
                } else {
                    charCur = String.fromCharCode(65 + charCur);
                }

                strUUID += charCur;

                switch (charOn) {
                    case 7:
                    case 11:
                    case 15:
                    case 19:
                        strUUID += '-';
                        break;
                }
            }
        }
        catch (e) {
            extGlobal.logManager.logErrorMessage('BrowserGap.generateCTID error: ' + e.message);
        }
        return strUUID;
    }

    function xhr(url, callback, err) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE) {
                var response = {
                    text: this.responseText,
                    status: this.status
                };
                if (this.status === 200) {
                    callback(response);
                } else {
                    err(response);
                }
            }
        };
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    }

    /*This function initializes the request header module by adding a listener that listens to web requests just before sending the headers*/
    function initReqHeaderModule() {
        chrome.runtime.getPlatformInfo(function (platformInfo) {
            chrome.webRequest.onBeforeSendHeaders.addListener(_onBeforeSendHeadersListener,
                {
                    /*TODO: Need to replace this Url pattern with the mail prod Url pattern,
                        after the changes in the mail server are available in prod.
                        */
                    urls: ["https://*.mail.yahoo.com/*"],
                    //Using this ResourceType helps us to minimize the events that we check for adding Request headers.
                    types: ["main_frame"]
                },
                /*It is important to use a blocking call as we do not want the request to be sent without the wider mail header*/
                ["blocking", "requestHeaders"]
            );
        });
    }

    /*Callback function that gets invoked.
     * This function adds the wider mail specific header to the request*/
    function _onBeforeSendHeadersListener(details) {

        setTimeout(extGlobal.widerMailManager.sendPageViewPing, 15000);
        var new_header = {
            name: extGlobal.constants.WIDER_MAIL_REQUEST_HEADER_NAME,
            value: extGlobal.constants.WIDER_MAIL_REQUEST_HEADER_VALUE
        };
        details.requestHeaders.push(new_header);
        return { requestHeaders: details.requestHeaders };
    }

    function addMessageListener(fnRet) {
        // set a listener to listen for messages from detectWiderMail.js
        chrome.runtime.onMessage.addListener(fnRet);
    }

    function getCurrentTab(callback) {
        chrome.tabs.query({ active: true, currentWindow: true }, callback);
    }

    function reloadTab(tab) {
        chrome.tabs.update(tab.id, { active: true, highlighted: true }, function (tab) { });
        chrome.windows.update(tab.windowId, { focused: true }, function (chromeWindow) { });
        chrome.tabs.reload(tab.id, {}, function () { });
    }

    function openTab(tabConfig, fnRet) {
        chrome.tabs.create(tabConfig, fnRet);
    }

    function addTabRemovedListener(callback) {
        chrome.tabs.onRemoved.addListener(callback);
    }

    function getTabWithId(tabId, callback) {
        chrome.tabs.get(tabId, callback);
    }

    /*Expose all the private functions through this object if unittest is true*/
    /* jshint ignore: start */
    if (unittest) {
        this._loadTrackingParams = _loadTrackingParams;
        this._generateCTID = _generateCTID;
        this._version = _version;
        this._os = _os;
        this._ctid = _ctid;
        this._uiLang = _uiLang;
        this.injectFunction = function () {
            _loadTrackingParams = this._loadTrackingParams;
            _os = this._os;
            _ctid = this._ctid;
            _version = this._version;
            _uiLang = this._uiLang;
        };
        this.syncData = function () {
            this._os = _os;
            this._ctid = _ctid;
            this._version = _version;
            this._uiLang = _uiLang;
        };
        this._onBeforeSendHeadersListener = _onBeforeSendHeadersListener;
        this.xhr = xhr;
    }
    /* jshint ignore: end */

    this.init = init;
    this.initExtensionButton = initExtensionButton;
    this.isChrome = isChrome;
    this.localStorage = window.localStorage;//chrome.storage.local;
    this.getVersion = getVersion;
    this.getMarket = getUILanguage;
    this.getIntl = getUILanguage;
    this.getCTID = getCTID;
    this.getOS = getOS;
    this.initReqHeaderModule = initReqHeaderModule;
    this.addMessageListener = addMessageListener;
    this.getCurrentTab = getCurrentTab;
    this.xhr = xhr;
    this.reloadTab = reloadTab;
    this.openTab = openTab;
    this.addTabRemovedListener = addTabRemovedListener;
    this.getTabWithId = getTabWithId;

    return this;
}
