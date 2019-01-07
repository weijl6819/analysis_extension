function WiderMailManager() { //jshint ignore: line
    /*This function initializes the WiderMailManager by doing the following tasks:
        1. Initializing the request header module.
     */

    var _mMailSiteTab = extGlobal.browserGap.isFirefox ? {id: 0} : {id: -1};

    function init() {
        extGlobal.browserGap.addTabRemovedListener(function (tabID, removeInfo) {
            if (tabID === _mMailSiteTab.id) {
                _mMailSiteTab = {id: -1};
            }
        });
        extGlobal.browserGap.initExtensionButton();
        extGlobal.browserGap.initReqHeaderModule();
    }

    function sendPageViewPing(){
        var beaconConfig = {};
        var beaconParams = {};
        beaconParams.itype = extGlobal.constants.TRACKER_ITYPE_VIEW;
        beaconParams.browser = extGlobal.browserGap.isChrome ? extGlobal.constants.TRACKER_BROWSER_CHR : extGlobal.constants.TRACKER_BROWSER_FF;
        beaconConfig.params = beaconParams;
        extGlobal.trackingManager.sendBeacon(extGlobal.constants.TRACKER_PAGE_INFO, beaconConfig);
    }

    function sendErrorPing(){
        var beaconConfig = {};
        var beaconParams = {};
        beaconParams.itype = extGlobal.constants.TRACKER_ITYPE_ERROR;
        beaconParams.browser = extGlobal.browserGap.isChrome ? extGlobal.constants.TRACKER_BROWSER_CHR : extGlobal.constants.TRACKER_BROWSER_FF;
        beaconConfig.params = beaconParams;
        extGlobal.trackingManager.sendBeacon(extGlobal.constants.TRACKER_PAGE_INFO, beaconConfig);
    }

    function _getMailTab(callback) {
        if (extGlobal.browserGap.isFirefox && (!_mMailSiteTab || _mMailSiteTab.id === 0)) {
            //Search through all the open tabs for tab with mail url if tab id is 0
            var mailTab = extGlobal.browserGap.getTabWithPartialUrl(extGlobal.constants.MAIL_PARTIAL_URL);
            if (mailTab !== null) {
                _mMailSiteTab = mailTab;
                _mMailSiteTab.on('close', function() {
                    _mMailSiteTab = {id: 0};
                });
            }
            callback(_mMailSiteTab);
            return;         
        }
        else if (extGlobal.browserGap.isChrome && (!_mMailSiteTab || _mMailSiteTab.id === -1)) {
            extGlobal.browserGap.getCurrentTab(function (tabArray) {
                if (tabArray.length > 0) {
                    _mMailSiteTab = tabArray[0];
                    _getMailTab(callback);
                    return;
                }
                else {
                    extGlobal.logManager.logDebugMessage("tabArray length equal to 0");
                    _mMailSiteTab = {id: -1};
                    callback(_mMailSiteTab);
                }
            });
            return;
        }
        try {
            extGlobal.browserGap.getTabWithId(_mMailSiteTab.id, function(tab) {
                if (tab && tab.url && tab.url.indexOf(extGlobal.constants.MAIL_PARTIAL_URL) !== -1) {
                    extGlobal.logManager.logDebugMessage("url contains mail");
                    _mMailSiteTab = tab;
                }
                else {
                    extGlobal.logManager.logDebugMessage("url does not contain mail");
                    _mMailSiteTab = extGlobal.browserGap.isFirefox ? {id: 0} : {id: -1};
                }

                callback(_mMailSiteTab);
            });
        } catch (e) {
            extGlobal.logManager.logDebugMessage("In catch e = " + e);
            _mMailSiteTab = extGlobal.browserGap.isFirefox ? {id: 0} : {id: -1};
            callback(_mMailSiteTab);
        }
    }

    function navToMailSite () {
        var beaconConfig = {};
        var beaconParams = {};

        beaconParams.sec = extGlobal.constants.TRACKER_EXTBTN_SEC;
        beaconParams.slk = extGlobal.constants.TRACKER_EXTBTN_SLK;
        beaconParams.gpos = extGlobal.constants.TRACKER_EXTBTN_GPOS;
        beaconParams._p = extGlobal.constants.TRACKER_EXTBTN_P_BTN;
        beaconConfig.params = beaconParams;

        /* 5 sec delay is added to avoid sending the ping while the mail page is loading.*/
        setTimeout(extGlobal.trackingManager.sendBeacon.bind(this, extGlobal.constants.TRACKER_CLICK_INFO, beaconConfig), 5000);
        _getMailTab(function (tab) {
            if ((extGlobal.browserGap.isFirefox && tab && tab.id !== 0) ||
                (extGlobal.browserGap.isChrome && tab && tab.id !== -1)) {
                extGlobal.browserGap.reloadTab(tab);
            }
            else {
                var tabConfig = {};
                var fnRet = "";
                if (extGlobal.browserGap.isFirefox) {
                    tabConfig = {
                        url: extGlobal.constants.YAHOO_MAIL_URL,
                        onReady: function onReady(tab) {
                            _mMailSiteTab = tab;
                        },
                        onClose: function onClose(tab) {
                            _mMailSiteTab = {id: 0};
                        }
                    };
                }
                else if (extGlobal.browserGap.isChrome) {
                    tabConfig = {
                        url: extGlobal.constants.YAHOO_MAIL_URL
                    };
                    fnRet = function (tab) {
                        _mMailSiteTab = tab;
                    };
                }
                extGlobal.browserGap.openTab(tabConfig, fnRet);
            }
        });
    }

    this.init = init;
    this.sendPageViewPing = sendPageViewPing;
    this.sendErrorPing = sendErrorPing;
    this.navToMailSite = navToMailSite;

    return this;
}
