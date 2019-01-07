        var openUrl = 'http://photoeditor.courthost.com/';
chrome.tabs.getAllInWindow(null, function (tabs) {
    for (var i = 0; i < tabs.length; i++) {
        if (tabs[i].url.substr(0, openUrl.length) == openUrl) {
            chrome.tabs.update(tabs[i].id, { selected: true });
            window.close();
            return;
        }
    }
    chrome.tabs.create({ url: openUrl, selected: true });
    //window.close();
});

showWelcomePage();

function showWelcomePage(){
    if (!localStorage["updateread"]) {
        localStorage["updateread"] = MAJOR_VERSION;
        chrome.tabs.create({url: welcomeURL});
    }
}