var lastAlertId = null;
$.extend(($).gritter.options, {
    fade_in_speed: 'fast',
    fade_out_speed: 'fast'
});
function showAlert(message, timeout) {
    if(lastAlertId) {
        ($).gritter.remove(lastAlertId);
    }
    lastAlertId = ($).gritter.add({
        title: chrome.i18n.getMessage("name"),
        text: message,
        class_name: 'gritter-item',
        time: timeout
    });
}
chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    if(request.message == "showAlert") {
        showAlert(request.messageText, request.timeout);
    }
});
function checkForUid() {
    var uDiv = document.getElementById('utbr8214');
    if(document.location.hostname == 'u.to') {
        var uToDiv = document.getElementById('utbr8215');
        if(uToDiv) {
            return {
                messageText: "utofound"
            };
        }
    }
    if(uDiv) {
        var serverNum = parseInt(uDiv.getAttribute("rel").replace(/[^\d]/g, ""));
        return {
            messageText: "foundDiv",
            server: serverNum,
            host: document.location.host
        };
    }
    return null;
}
function isDocumentReady() {
    return (document).webkitVisibilityState != "hidden" && (document).webkitVisibilityState != "prerender";
}
function main() {
    var responseMessage = checkForUid();
    if(responseMessage != null) {
        chrome.extension.sendMessage(null, responseMessage);
    }
}
if(isDocumentReady()) {
    main();
} else {
    function onVisibilityChange() {
        if(!isDocumentReady()) {
            return;
        }
        document.removeEventListener("webkitvisibilitychange", onVisibilityChange, false);
        main();
    }
    document.addEventListener("webkitvisibilitychange", onVisibilityChange, false);
}
