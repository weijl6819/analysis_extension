var extGlobal = {}; //jshint ignore: line

extGlobal.logManager = new LogManager();
extGlobal.constants = new Constants();
extGlobal.browserGap = new BrowserGap();
extGlobal.trackingManager = new TrackingManager();
extGlobal.widerMailManager = new WiderMailManager();

extGlobal.browserGap.init();
extGlobal.widerMailManager.init();

chrome.runtime.setUninstallURL(extGlobal.constants.chromeUninstallURL);

chrome.runtime.onConnectExternal.addListener(function (port) {
    port.postMessage({ widerMailExtEnabled: true });
});

extGlobal.browserGap.addMessageListener(
    function (message, sender, sendResponse) {
        if (message.hasRightRailAd) {
            setTimeout(extGlobal.widerMailManager.sendErrorPing, extGlobal.constants.TRACKER_ERROR_PING_TIMEOUT);
        }
    });

function isFirstRunCompleted() {
    return JSON.parse(extGlobal.browserGap.localStorage.getItem("widerMailFirstRunCompleted"));
}

function initFirstRun() {
    if (!isFirstRunCompleted()) {
        var now = new Date();
        extGlobal.browserGap.localStorage.setItem("widerMailFirstRunCompleted", JSON.stringify(true));
        extGlobal.browserGap.localStorage.setItem("widerMailFirstRunCompletedTime", JSON.stringify(now.getTime()));
        sendInstallPing();
    }
}

function sendInstallPing() {
    var beaconConfig = {};
    var beaconParams = {};
    beaconParams.itype = extGlobal.constants.TRACKER_ITYPE_INSTALL;
    beaconParams.browser = extGlobal.constants.TRACKER_BROWSER_CHR;
    beaconConfig.params = beaconParams;
    extGlobal.trackingManager.sendBeacon(extGlobal.constants.TRACKER_PAGE_INFO, beaconConfig);
}

initFirstRun();

// Alive ping
// TODO: chrome intervals and timeouts longer than a minute should use chrome.alarm
extGlobal.trackingManager.initAlivePing(extGlobal.constants.TRACKER_BROWSER_CHR);
