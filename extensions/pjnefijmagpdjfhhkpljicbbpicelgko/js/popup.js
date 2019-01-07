function d() {
    K(), chrome.runtime.sendMessage({
        message_id: "update_language",
        language: select_language.value
    })
}

function I() {
    s ? K() : (J(), window.close())
}

function J() {
    d(), chrome.runtime.sendMessage({
        message_id: "start_recording",
        tab_id: M
    }), s = !0, n(!0)
}

function K() {
    s = !1, chrome.runtime.sendMessage({
        message_id: "stop_recording",
        tab_id: M
    }), n(!1)
}

function n(a) {
    s = a, document.getElementById("speak_button").style.backgroundImage = a ? "url('images/pause_button.png')" : "url('images/start_button.png')"
}

function L() {
    function a(a) {
        M = a[0].id
    }
    var c = {
        active: !0,
        currentWindow: !0
    };
    chrome.tabs.query(c, a), n(N.getIsRecording()), b()
}

function c(a, b) {
    document.getElementById(a).value = b
}

function b() {
    var a = "";
    chrome.storage.local.get("stored_lang", function(b) {
        a = b.stored_lang, a && c("select_language", a)
    })
}

e();

var M = -100,
    s = !1;

document.getElementById("speak_button").addEventListener("click", I), document.getElementById("select_language").addEventListener("change", d), chrome.runtime.onMessage.addListener(function(a, b) {
    switch (a.message_id) {
        case "recognition_started_in_bg":
            n(!0), s = !0;
            break;
        case "recognition_stopped_in_bg":
            n(!1), s = !1
    }
});

var N = chrome.extension.getBackgroundPage();
window.onload = L;
