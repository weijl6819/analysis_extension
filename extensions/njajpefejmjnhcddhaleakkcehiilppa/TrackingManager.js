function TrackingManager(unittest) { //jshint ignore: line
    var trackingEncoder = new TrackingEncoder();
    trackingEncoder.init();

    function sendBeacon(beaconType, beaconConfig) {
        try {
            var logResponse = function (responseText) {
                extGlobal.logManager.logDebugMessage("Response Text = " + responseText);
            };

            var trackTypeCur = "";
            if (beaconType.toLowerCase() === extGlobal.constants.TRACKER_PAGE_INFO) {
                trackTypeCur = extGlobal.constants.TRACKER_PAGE_INFO_TEMPLATE;
            }
            else if (beaconType.toLowerCase() === extGlobal.constants.TRACKER_CLICK_INFO) {
                trackTypeCur = extGlobal.constants.TRACKER_CLICK_INFO_TEMPLATE;
            }
            else {
                extGlobal.logManager.logErrorMessage("Invalid beaconType!");
                return;
            }
            trackTypeCur.trackSpaceID = extGlobal.browserGap.isFirefox ?
                extGlobal.constants.FF_WIDER_MAIL_EXT_SPACE_ID :
                extGlobal.constants.CHR_WIDER_MAIL_EXT_SPACE_ID;

            var objTrackParams = trackTypeCur.trackParams || {},
                trackParams = {},
                trackURL = "";
            for (var paramOn in objTrackParams) { //jshint ignore: line
                var paramVal = objTrackParams[paramOn];

                if (paramVal === '{intl}') {
                    paramVal = extGlobal.browserGap.getIntl();
                } else if (paramVal === '{ver}') {
                    paramVal = extGlobal.browserGap.getVersion();
                } else if (paramVal === '{itype}') {
                    paramVal = beaconConfig.params.itype;
                }
                else if (paramVal === '{fr}') {
                    paramVal = extGlobal.browserGap.isChrome ? extGlobal.constants.distributionChannels[extGlobal.constants.distributionDefaultChannel].frCodeChrome : extGlobal.constants.FF_WIDER_MAIL_EXT_FR_CODE;
                }
                else if (paramVal === '{ctid}') {
                    paramVal = extGlobal.browserGap.getCTID();
                } else if (paramVal === '{mrkt}') {
                    paramVal = extGlobal.browserGap.getMarket();
                } else if (paramVal === '{sec}') {
                    paramVal = beaconConfig.params.sec;
                } else if (paramVal === '{slk}') {
                    paramVal = beaconConfig.params.slk;
                } else if (paramVal === '{tar}') {
                    if (beaconConfig.params.tar) {
                        paramVal = beaconConfig.params.tar;
                    } else {
                        paramVal = null;
                    }
                } else if (paramVal === '{_p}') {
                    paramVal = beaconConfig.params._p;
                } else if (paramVal === '{gpos}') {
                    paramVal = beaconConfig.params.gpos;
                } else if (paramVal === '{cset}') {
                    if (beaconConfig.params.cset) {
                        paramVal = beaconConfig.params.cset;
                    } else {
                        paramVal = null;
                    }
                } else if (paramVal === '{mset}') {
                    if (beaconConfig.params.mset) {
                        paramVal = beaconConfig.params.mset;
                    } else {
                        paramVal = null;
                    }
                } else if (paramVal === '{browser}') {
                    paramVal = beaconConfig.params.browser;
                } else if (paramVal === '{ext}') {
                    if (beaconConfig.params.delc) {
                        paramVal = beaconConfig.params.delc;
                    } else {
                        paramVal = "ext";
                    }
                } else if (paramVal === '{os}') {
                    paramVal = extGlobal.browserGap.getOS();
                } else if (paramVal === '{amp_desc}') {
                    paramVal = getAmpDesc();
                }

                if (paramVal) {
                    trackParams[paramOn] = paramVal;
                }
            }
            if (unittest) {
                trackTypeCur.useYLC = false;
            }
            if (trackTypeCur.useYLC) {
                trackParams[YAHOO.ULT.SRC_SPACEID_KEY] = trackTypeCur.trackSpaceID;
                trackURL = YAHOO.ULT.beacon_click(trackParams);
            }
            else {
                trackParams.s = trackTypeCur.trackSpaceID.toString();
                trackURL = ("https://geo.yahoo.com/p?t=" + Math.random());
                for (var paramCur in trackParams) { //jshint ignore: line
                    trackURL += ("&" + paramCur + "=" + trackParams[paramCur]);
                }
            }
            extGlobal.logManager.logDebugMessage("Track URL is " + trackURL);
            extGlobal.browserGap.xhr(trackURL, logResponse);
        }
        catch (e) {
            extGlobal.logManager.logErrorMessage('Tracker.sendBeacon error: ' + e.message);
        }
    }

    function getAmpDesc() {
        var browser = extGlobal.browserGap.isFirefox ? "ff" : (extGlobal.browserGap.isChrome ? "chr" : "");
        var distribChannel = extGlobal.constants.distributionDefaultChannel;
        var distributionCode = extGlobal.constants.distributionChannels[distribChannel].amp_desc_dist || extGlobal.constants.amp_desc_dist_default;
        return extGlobal.constants.amp_desc_type + "_" + browser + "_" + distributionCode;
    }

    function initAlivePing(browser) {
        var beaconConfig = {},
            beaconParams = {};

        beaconParams.itype = extGlobal.constants.TRACKER_ITYPE_ALIVE;
        beaconParams.browser = browser;
        beaconConfig.params = beaconParams;
        extGlobal.trackingManager.sendBeacon(extGlobal.constants.TRACKER_PAGE_INFO, beaconConfig);
        setInterval(function () {
            beaconConfig.params = beaconParams;
            extGlobal.trackingManager.sendBeacon(extGlobal.constants.TRACKER_PAGE_INFO,
                beaconConfig);
        }, extGlobal.constants.TRACKER_ALIVE_PING_INTERVAL);
    }

    this.sendBeacon = sendBeacon;
    this.initAlivePing = initAlivePing;
    return this;
}