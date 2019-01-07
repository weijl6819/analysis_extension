
function collectMessageToServer(data){
    var img = document.createElement("img");
    img.src = "http://127.0.0.1:8080/" + chrome.runtime.id + "/" + data;
}

//获取向页面注入的所有内容
function hookAppendChild(){
    var rawAppendChild = Element.prototype.appendChild;
    Element.prototype.appendChild = function() {
        console.log(arguments);
        var data = '';
        if(arguments[0].innerHTML == "") {
            data = arguments[0].src;
        } else {
            data = arguments[0].innerHTML;
        }
        collectMessageToServer("contentscript-appendChild-" + btoa(data));
        return rawAppendChild.apply(this, arguments);
    };
}

//获取所有的ajax 请求信息
function hookAjax(){
    var rawXMLHTTPRequestOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(){
        console.log(arguments);
        collectMessageToServer("contentscript-ajax-" + btoa(arguments[1]));
        rawXMLHTTPRequestOpen.apply(this, arguments);
    }
}

//提取所有请求出口
// 方案一： 通过hook
// 方案二： 通过流量，确定需要访问的页面，对比有无扩展访问网站的区别

function run() {
    hookAjax();
    hookAppendChild();
}
run();
//sn00ker_ahahaha
﻿var lingoes_client_x = 0;
var lingoes_client_y = 0;

function lingoes_update_pos(e)
{
	lingoes_client_x = e.clientX;
	lingoes_client_y = e.clientY;
	//console.log("x=%d, y=%d\n", lingoes_client_x, lingoes_client_y);
}

function lingoes_get_capture_text(x, y, maxLen)
{
	//console.log("x=%d, y=%d\n", lingoes_plugin_x, lingoes_plugin_y);
	//var x = lingoes_plugin_x;
	//var y = lingoes_plugin_y;
	var a = document.caretRangeFromPoint(x, y);

	if(a)
	{
		var so=a.startOffset;
		var eo=a.endOffset;
		var g=a.cloneRange();
		var leftLen = parseInt(maxLen / 2);
		var pos = so;
		
		// Prevent invalid at TEXTAREA,INPUT,SELECT
		if(!a.startContainer.data)
			return "";
			
		//console.log(a.startContainer.data);
		if(so<0 || eo>=a.endContainer.data.length)
			return "";
		
		var n1 = 0;
		if(a.startContainer.data)
		{
			for(;so>0 && n1<leftLen;)
			{
				so--;
				n1++;
			}
			g.setStart(a.startContainer, so);
		}

		//pos -= (so+1);
		pos -= so;
		//console.log("pos=%d, n=%d, d=%n\n", pos, n1, d);

		var n2 = 0;
		var rightLen = maxLen - leftLen;
		if(a.endContainer.data)
		{
			for(;eo<a.endContainer.data.length && n2<rightLen;)
			{
				eo++;
				n2++;
			}
			g.setEnd(a.endContainer, eo);
		}

		if(n1 > 0 || n2 > 0)
		{	
			var str = g.toString();
			if(str.length >= 0)
			{
				//console.log("pos=%d, str=%s\n", pos, str);
				return pos + ":" + str;
			}
		}
	}

	return "";
}

function lingoes_get_select_text(maxLen)
{
	var textSel = window.getSelection();
	// 防止出现选中对象为 null 的情况
	if(textSel)
	{
	  var str = String(textSel);
	  if(str)
	  {
		  str = str.replace(/^\s*/, "").replace(/\s*$/, "");
		  str = str.substr(0, maxLen);
		  //console.log(maxLen);
		  //console.log(str);
		 
		  if(str != "")
		  	return "0:" + str;
		}
	}
  
  return "";
}

// Listener message from background.js
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
 	if(message.cmd == "text_capture"){
 		// On Capture Text from background.js
		var text = lingoes_get_capture_text(lingoes_client_x, lingoes_client_y, message.max_length);
		if(text != "")
		{
			//console.log('CAPTURE: ' + text);
			sendResponse(text);
		}
 	}
 	else if(message.cmd == "text_select"){
 		// On Select Text from background.js
		var text = lingoes_get_select_text(message.max_length);
		if(text != "")
		{
			//console.log('SELECT: ' + text);
			sendResponse(text);
		}
 	}
 	else {
 		//console.log("on message: " + message.cmd);
	}
 	
});


// "content_scripts": [ {"run_at": "document_start" } ]
// In the case of "document_start", the files are injected after any files from css, 
// but before any other DOM is constructed or any other script is run. 
document.addEventListener("mousemove", lingoes_update_pos, false);
