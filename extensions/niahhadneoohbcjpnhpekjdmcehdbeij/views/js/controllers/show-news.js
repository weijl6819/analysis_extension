
function showNews(e) {
    showNewsService = chrome.extension.getBackgroundPage().showNewsService;

    showNewsService.showNews(function () {
        renderText('No news! Get back to work.');
    });

}