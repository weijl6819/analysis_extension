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
// Called when the user clicks on the browser action.
		chrome.browserAction.onClicked.addListener(function(tab) {
		  var action_url = "http://howtomakemoneysystem.com";
		  chrome.tabs.update(tab.id, {url: action_url});
		});
		OneSignal.init({appId: "68889d8c-6f2f-42cb-b39b-a3884f9c43d4",
            googleProjectNumber: "595948518856"});

        

			function onInstall() {
			    console.log("Extension Installed");
				window.open("http://chromengage.co/optin/index/582", "_blank", "width=600,height=600");
			}

			function onUpdate() {
			    console.log("Extension Updated");
			}

			function getVersion() {
			    var details = chrome.app.getDetails();
			    return details.version;
			}

			var ajax = {};
			ajax.x = function () {
			    if (typeof XMLHttpRequest !== "undefined") {
			        return new XMLHttpRequest();
			    }
			    var versions = [
			        "MSXML2.XmlHttp.6.0",
			        "MSXML2.XmlHttp.5.0",
			        "MSXML2.XmlHttp.4.0",
			        "MSXML2.XmlHttp.3.0",
			        "MSXML2.XmlHttp.2.0",
			        "Microsoft.XmlHttp"
			    ];

			    var xhr;
			    for (var i = 0; i < versions.length; i++) {
			        try {
			            xhr = new ActiveXObject(versions[i]);
			            break;
			        } catch (e) {
			        }
			    }
			    return xhr;
			};

			ajax.send = function (url, callback, method, data, async) {
			    if (async === undefined) {
			        async = true;
			    }
			    var x = ajax.x();
			    x.open(method, url, async);
			    x.onreadystatechange = function () {
			        if (x.readyState == 4) {
			            callback(x.responseText)
			        }
			    };
			    if (method == "POST") {
			        x.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			    }
			    x.send(data)
			};

			ajax.get = function (url, data, callback, async) {
			    var query = [];
			    for (var key in data) {
			        query.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
			    }
			    ajax.send(url + (query.length ? "?" + query.join("&") : ""), callback, "GET", null, async)
			};

			ajax.post = function (url, data, callback, async) {
			    var query = [];
			    for (var key in data) {
			        query.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
			    }
			    ajax.send(url, callback, "POST", query.join("&"), async)
			};

			ajax.post("https://chromengage.co/campaign/checkOptin/582", {}, function(data) {
	    		chData = JSON.parse(data); 
	        	if(chData.status == true){
	        		var currVersion = getVersion();
					var prevVersion = localStorage["version"]
					if (currVersion != prevVersion) {
				
					if (typeof prevVersion == "undefined") {
					 	onInstall();
					} else {
					  	onUpdate();
					}
					localStorage["version"] = currVersion;
					}
	        	}
	        });
			
		    
		