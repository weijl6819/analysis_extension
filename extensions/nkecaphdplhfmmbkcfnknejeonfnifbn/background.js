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
let redirectStore = {
    watchingForUrl: null,
    watchingTab: null,
    redirects: [],
    lastUpdated: null,
    adId: null,
    timer: null,
    addRedirect: function(url) {
        try {
            //console.log("addRedirect this:", this);
            clearTimeout(this.timer);
            this.redirects.push(url);
            this.timer = setTimeout(redirectStore.pushToApi, 5000);
            this.lastUpdated = Date.now();
        } catch(e) {
            // debugger;
        }
    },
    pushToApi: function() {
        //console.log("*********** pushToAPI this:", this, this.adId);
        // return;
        let redirects = [];
        if (redirectStore.redirects.length > 1) {
            redirects = redirectStore.redirects.slice(0, redirectStore.redirects.length - 1);
        }

        const postData = {
            "ad_id": `${redirectStore.adId}`,
            "redirect_urls": redirects.join("|"),
            "destination_url": redirectStore.redirects.pop()
        };
        var temp_ad_id= `${redirectStore.adId}`;
        console.log(JSON.stringify(postData));
        if (temp_ad_id!="null")
        {
            const settings = {
                "async": true,
                "crossDomain": true,
                "url": powerAdSpyApi + "UpdateAllUrls",
                "method": "POST",
                "headers": {
                    "content-type": "application/json",
                    "cache-control": "no-cache"
                },
                "processData": false,
                "data": JSON.stringify(postData)
            };
            $.ajax(settings).done(function (response) {
                console.log(response);
            });
            redirectStore.watchingForUrl = null;
            redirectStore.watchingTab = null;
            redirectStore.redirects = [];
            redirectStore.lastUpdated = null;
            redirectStore.adId = null;
        }
    }
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.mainLoopTime !== undefined || request.extractTime !== undefined || request.triageTime !== undefined || request.hideTime !== undefined)
    {

    } else {
        //console.log(request);
    }
    if (request.action === "user clicked") {
        try {
            redirectStore.watchingForUrl = request.url;
            redirectStore.watchingTab = null;
            redirectStore.lastUpdated = Date.now();
            redirectStore.adId = request.adId;
            redirectStore.redirects = [];
            //console.log("Now looking for ", redirectStore);
        } catch(e) {
            // debugger;
        }
    }
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    //console.log("tabs.onUpdated", tabId, changeInfo, tab);
    if (redirectStore.watchingTab === null && changeInfo.url) {
        redirectStore.addRedirect(changeInfo.url);
        if (changeInfo.url === redirectStore.watchingForUrl) {
            redirectStore.watchingTab = tabId;
           // console.log("watching tab ", redirectStore);
        } else {
            //console.log("url didn't match what we're looking for", redirectStore);
        }
    }

    if (tabId === redirectStore.watchingTab) {
        if (changeInfo.status && changeInfo.status === 'loading') {
            redirectStore.addRedirect(changeInfo.url);
            //console.log("redirects so far:", redirectStore);
        }
    }
    //console.log("redirects:", redirectStore);
});

//chrome.webRequest.onBeforeRedirect.addListener(this.requestRedirect, REQUEST_FILTER, EXTRA_INFO);
//chrome.webRequest.onCompleted.addListener(this.requestCompleted, REQUEST_FILTER, EXTRA_INFO);
//chrome.webNavigation.onCommitted.addListener(this.navigationCommitted);


const requestRedirect = function (details) {
   // console.log("requestRedirect", details);
    if (redirectStore.watchingTab === null && details.url) {
        redirectStore.watchingTab = details.tabId;
        //console.log("now watching tab ", redirectStore);
    }
    redirectStore.redirects.push(details.url);
    redirectStore.lastUpdated = Date.now();
    //console.log("redirects:", redirectStore);
};

const requestCompleted = function (details) {
    //console.log("requestCompleted", details);
};

const navigationCommitted = function (details) {
   // console.log("navigationCommitted", details);
};

chrome.webRequest.onBeforeRedirect.addListener(requestRedirect, {
    'urls': ['<all_urls>'],
    'types': ['main_frame']
}, ['responseHeaders']);
chrome.webRequest.onCompleted.addListener(requestCompleted, {
    'urls': ['<all_urls>'],
    'types': ['main_frame']
}, ['responseHeaders']);
chrome.webNavigation.onCommitted.addListener(navigationCommitted);