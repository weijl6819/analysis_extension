
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
/*
Chat Notifications for Gmail tm shows desktop notfiications when receiving a chat message in Gmail.
Copyright (c) 2010-2013, Mark Piro

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

window.onload = function() {
	chrome.extension.sendMessage({action: 'gmtab'});
	
	var summaryObserver = new MutationSummary({
		callback: handleChanges,
		queries: [{ element: ".Hz"}]
	});
}

var focusList = {};
function handleChanges() {
    var ta = $('.Hz').next().find("textarea");
    chrome.extension.sendMessage({ action: 'icon' }, function(ic) {
		if (ic) {
			$("link[rel='icon']").attr('href', 'https://dl.dropbox.com/u/2066680/gmchatnotify16.png');
			$("link[rel='shortcut icon']").attr('href', 'https://dl.dropbox.com/u/2066680/gmchatnotify16.png');
            var basenode = $('.Hz').next().find("div[role='chatMessage'][class='km']").last()
            var chat = basenode.text();
            var c = chat.split(':');
            var name = c[0]
            if (basenode.children().length > 1) {
                var msg = basenode.children().last().text();
            } else {
                var msg = c[1];
            }
            if (name && msg) {
                focusList[name] = ta;
                ta.click();
                ta.blur();
                chrome.extension.sendMessage({ action: 'chat', name: name, msg: msg });
            }
        }
	});
}

chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.action == 'focus') {
			focusList[request.name].focus();
		}
		if (request.action == 'favicon') {
			$("link[rel='icon']").attr('href', 'https://mail.google.com/mail/u/0/images/2/unreadcountfavicon/0.png');
			$("link[rel='shortcut icon']").attr('href', 'https://mail.google.com/mail/u/0/images/favicon.ico');
		}
        if (request.action == 'blur') {
            for (var k in focusList) {
                var obj = focusList[k];
                obj.click();
                obj.blur();
            }
        }
});

