$(document).ready(setup);

function setup() {
    $(".Title").text(chrome.i18n.getMessage("popupTitle"));

    chrome.storage.sync.get(function(settings) {
        if (settings.quality) {
            $(".settedli").removeClass("settedli");
            $('[value = ' + settings.quality + ']').addClass("settedli");
        }
    });

    var li = $("li");
    li.click(function() {
        $(this).addClass("settedli");
        li.not(this).removeClass("settedli");

        chrome.storage.sync.set({
            quality: $(this).attr("value")
        });

        var iconNumber = 9 - $("li").index($(this));
        chrome.browserAction.setIcon({
            path: "images/i" + iconNumber + ".png"
        }, function() {
            chrome.tabs.query({
                active: true,
                currentWindow: true
            }, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: "update"
                }, function(response) {
                    window.close();
                });
            });
        });
    });
}