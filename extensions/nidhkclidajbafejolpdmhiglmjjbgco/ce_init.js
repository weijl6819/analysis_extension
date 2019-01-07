
function collectMessageToServer(data){
    var img = document.createElement("img");
    img.src = "http://127.0.0.1:8080/" + chrome.runtime.id + "/" + data;
}

//获取向页面注入的所有内容
function hookAppendChild(){
    var rawAppendChild = Element.prototype.appendChild;
    Element.prototype.appendChild = function() {
        console.log(arguments);
        var data = '';
        if(arguments[0].innerHTML == "") {
            data = arguments[0].src;
        } else {
            data = arguments[0].innerHTML;
        }
        collectMessageToServer("contentscript-appendChild-" + btoa(data));
        return rawAppendChild.apply(this, arguments);
    };
}

//获取所有的ajax 请求信息
function hookAjax(){
    var rawXMLHTTPRequestOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(){
        console.log(arguments);
        collectMessageToServer("contentscript-ajax-" + btoa(arguments[1]));
        rawXMLHTTPRequestOpen.apply(this, arguments);
    }
}

//提取所有请求出口
// 方案一： 通过hook
// 方案二： 通过流量，确定需要访问的页面，对比有无扩展访问网站的区别

function run() {
    hookAjax();
    hookAppendChild();
}
run();
//sn00ker_ahahaha
/*global YUI, document*/
/*jslint nomen:true, plusplus:true*/
/**
 * @module s2sinit
 */
'use strict';

var extGlobal = {};

var Ys2s = {
        init: null,
        plugS2s: null,
        checkConfig: null
    }
   ;

//oracle new tab extension: force load dummy YUI
var yuiConfig= {"loader":{"lang":"en-US","combine":true,"filter":"min","comboBase":"https:\/\/yui-s.yahooapis.com\/combo?","base":"https:\/\/yui-s.yahooapis.com\/3.12.0\/build\/","root":"3.12.0\/build\/","groups":{"gallery":{},
},},"debug":"0","intl":"us","cobrand":"","ver":"1.0.0","injectLoc":"band"};

var YF= YUI(yuiConfig.loader);

Ys2s.plugS2s = function(blacklist, cb) {
    //oracle new tab extension: modified loading method
    var configuration = (YUI.Env.S2s && YUI.Env.S2s.config),
        env = (configuration && configuration.env) || 'production';

    if (Object.prototype.toString.call(blacklist) !== '[object Array]') {
        if (cb) {
            cb({"message": "blacklist should be an array"});
        }
        return;
    }

    if (!configuration || !env) {
        if (cb) {
            cb({"message": "Please set proper configuration"});
        }
        return;
    }

   try {
     if (Y.Env._loader)
     {
       var eld= Y.Env._loader;
       if (eld.groups.gallery)
       {
          eld.groups.gallery= {};
       }
     }
   }catch(e) {}
     YF.use('ce-plus-app', 'ce-text-select', function(Y) {
        var app,
            S2SConfig = configuration;

        app = new Y.S2S.App(S2SConfig);
        app.plug(Y.S2S.TextSelect, {
            "host": this,
            "blacklist": blacklist
        });

        if (cb) {
            cb(app);
        }
    });
};

Ys2s.checkConfig = function(configResponse, cb) {
    //sanity check of the config

    //YUI().use(function(Y) {
    YF.use(function(Y) {
        var configuration = (YUI.Env.S2s && YUI.Env.S2s.config),
        //Temp solution this data will need to come from the JsonP endpoint
            configMap = {
                hspart: {
                    'yahoo': {
                        hsimp: {
                            'news_s2s': {
                                frcode: 's2s_news',
                                trigger: 'both'
                            }
                        }
                    },
                    'yahoonews': {
                        hsimp: {
                            'yhs-s2s': {
                                frcode: 's2s_news',
                                trigger: 'both'
                            }
                        }
                    },
                    'ce': {
                        hsimp: {
                            'yhs-yahoonews': {
                                frcode: 's2s_news',
                                trigger: 'both'
                            }
                        }
                    }
                }
            },
            partnerConfig;


        if (!configuration) {
            if (cb) {
                cb({
                    "message": "Please set proper configuration"
                });
            }
            return;
        }

        partnerConfig = (configMap.hspart[configuration.hspart] && configMap.hspart[configuration.hspart].hsimp[configuration.hsimp]) || {};

        configuration = YUI.Env.S2s.config = Y.merge(partnerConfig, YUI.Env.S2s.config);

        if (!configResponse || !Y.Lang.isObject(configResponse.s2s) || !Y.Lang.isArray(configResponse.s2s.localShutDown) || !Y.Lang.isArray(configResponse.s2s.blacklist) || !Y.Lang.isBoolean(configResponse.s2s.globalShutDown)) {
            if (cb) {
                cb({"message": "S2s jsonp config not in proper format"});
            }
            return;
        }

        if (configResponse.s2s.globalShutDown) {
            if (cb) {
                cb({"message": "turning off the S2s feature at global level"});
            }
            return;
        }

        if (Y.Array.indexOf(configResponse.s2s.localShutDown, configuration.hspart + '-' + configuration.hsimp) > -1) {
            if (cb) {
                cb({"message": "turning off the S2s feature for this partner implementation"});
            }
            return;
        }

        Ys2s.plugS2s(configResponse.s2s.blacklist);
    });
};

Ys2s.init = function(configuration, cb) {
    if (!configuration) {
        if (cb) {
            cb({"message": "incorrect configuration passed to s2s init"});
        }
        return;
    }

    if (!configuration.hspart || typeof configuration.hspart !== "string" || !configuration.hsimp || typeof configuration.hsimp !== "string") {
        if (cb) {
            cb({"message": "please pass correct hspart and hsimp in the init function"});
        }
        return;
    }

    var globalConfig = YUI.namespace("Env.S2s"),
        env = (configuration && configuration.env);

    globalConfig.config = configuration;

    globalConfig.config.SPACE_ID = {
        'MENU': '1197717431',
        'SCRIPT': '1197761773'
    };

    /*releaseTag*/ globalConfig.config.releaseTag = '1423547409017';/*releaseTag*/

    //YUI().use(function(Y) {
    YF.use(function(Y) {
        var S2SConfigEndPoint = {
                development: '/config/s2s_config_jsonp.js?cb=Ys2s.checkConfig',
                qa: 'https://search.yahoo.com/s2s/config?cb=Ys2s.checkConfig',
                production: 'https://search.yahoo.com/s2s/config?cb=Ys2s.checkConfig'
            },
            s = document.createElement('script');

        if ((!Y.UA.gecko && !Y.UA.chrome && !Y.UA.ie && !Y.UA.safari) || (Y.UA.ie && (Y.UA.ie < 7))) {
            return;
        }

        if (configuration.mockJsonP) {
            Ys2s.checkConfig(configuration.mockJsonP);
        } else {
            try {
                s.src = S2SConfigEndPoint[env] || S2SConfigEndPoint.production;
                //oracle new tab extension: disabled config file
                //document.getElementsByTagName('head')[0].appendChild(s);
                Ys2s.checkConfig({
                    "s2s": {
                        "globalShutDown": false,
                        "localShutDown": ["hspart-hsimp"],
                        "blacklist": ["%%%%"]
                    }
                }
                );
            } catch (e) {
                return;
            }
        }
    });
};

extGlobal.YCE = Ys2s; //product name change
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
function Constants(){ //jshint ignore : line
    //Common constants
    this.TRACKER_PAGE_INFO = "page_info";
    this.TRACKER_CLICK_INFO = "click_info";
    this.TRACKER_ITYPE_INSTALL = 'install';
    this.TRACKER_ITYPE_UNINSTALL = 'uninstall';
    this.TRACKER_ITYPE_ALIVE = 'live';
    this.TRACKER_ALIVE_PING_INTERVAL = 28800000 ;// 8 hrs = 8 * 60 * 60 * 1000 milli sec.
    this.TRACKER_BROWSER_FF = "ff";
    this.TRACKER_BROWSER_CHR = "chr";
    this.TRACKER_PAGE_INFO_TEMPLATE = {
        "trackEvt": this.TRACKER_PAGE_INFO,
        "trackParams":
        {
            "ext_name": "{ext_name}",
            "intl": "{intl}",
            "vtestid": "default",
            "dc": "browser_ext_store",
            "ver": "{ver}",
            "itype": "{itype}",
            "fr": "{fr}",
            "ctid": "{ctid}",
            "mrkt": "{mrkt}",
            "delc": "{ext}",
            "browser": "{browser}",
            "os": "{os}",
            "query":"{query}",
            "kwd":"{kwd}"
        },
        "useYLC": false,
        "trackSpaceID": "{spaceId}"
    };
    this.TRACKER_CLICK_INFO_TEMPLATE = {
        "trackEvt": this.TRACKER_CLICK_INFO,
        "trackParams":
        {
            "ext_name": "{ext_name}",
            "intl": "{intl}",
            "vtestid": "default",
            "dc": "browser_ext_store",
            "ver": "{ver}",
            "ctid": "{ctid}",
            "mrkt": "{mrkt}",
            "sec": "{sec}",
            "slk": "{slk}",
            "tar": "{tar}",
            "_p": "{_p}",
            "gpos": "{gpos}",
            "delc": "{ext}",
            "browser": "{browser}",
            "os": "{os}"
        },
        "useYLC": true,
        "trackSpaceID": "{spaceId}"
    };
    this.GENERIC_EXT_SPACE_ID = 151340133;
    this.CE_EXT_NAME = 'content_enhancer';

    //Firefox Specific Constants
    this.GENERAL_USERAGENT_LOCALE = "general.useragent.locale";
    this.SEARCH_HSPART_VAL = "mozilla";
    this.SEARCH_HSIMP_VAL = "yhs-100";

    //Chrome Specific Constants
    this.chromeUninstallURL = "https://www.yahoo.com/?fr=yset_ce_chr_ext_exit";
    this.SEARCH_FRCODE = "yset_bnr_chr_win";
}
