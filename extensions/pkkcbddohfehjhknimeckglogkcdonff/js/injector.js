
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
var script, noscript;

/**
 *
 * @param url
 * @returns {XML|void|string}
 */

function absolutify(url) {
	if (url === '') {
		url = location.origin + location.pathname;
	} else if (/^https?:\/\//.test(url)) {
		url = url;
	} else if (!url) {
		url = location.origin + location.pathname + location.search;
	} else if (/^\?/.test(url)) {
		url = location.origin + location.pathname + url;
	} else if (/^\/\//.test(url)) {
		url = location.protocol + url;
	} else if (/^\//.test(url)) {
		url = location.origin + url;
	} else {
		url = location.origin + location.pathname.substring(0, location.pathname.lastIndexOf('/') + 1) + url;
	}

	return url.replace(/(^https?:\/\/[^\/]+)(\/[^\?]+)(\?|$)/i, function ($0, $1, $2, $3) {
			$2 = $2.replace(/\\/g, '/');
			while ($2 != ($2 = $2.replace(/\/\.(\/|$)/g, '/')));
			while ($2 != ($2 = $2.replace(/(^|\/[^\/]+)\/\.\.(\/|$)/g, '/')));
			return $1 + $2 + $3;
		});
}

/**
 * injector script for content script
 * define in manifest.json / content_scripts
 */

try {
	// Check whether JavaScript is on or not
	noscript = document.createElement('noscript');
	noscript.innerText = 'no scripts?';
	noscript.style.display = 'block';
	noscript.style.visibility = 'hidden';
	noscript.style.position = 'fixed';
	document.documentElement.appendChild(noscript);
	if (noscript.clientHeight) { // has the noscript element been rendered?
		if (window == window.top) {
			chrome.extension.sendRequest('noScripts');
		}
		document.documentElement.removeChild(noscript);
		throw new Error('JavaScript is disabled'); // end execution
	} else {
		chrome.extension.sendRequest('yesScripts', function () {
				// request logging disabled
				document.documentElement.removeChild(script);
			});
		document.documentElement.removeChild(noscript);
	}

	// inject catcher.js to the DOM
	script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = chrome.extension.getURL('js/catcher.js');
	script.innerHTML = '<!-- script injected by GKApp -->';
	document.documentElement.appendChild(script);

	// forward the events
	script.addEventListener('kajfghlhfkcocafkcjlajldicbikpgnp', function (event) {
			chrome.extension.sendRequest({
				'type': event.detail.type,
				'method': event.detail.method,
				'url': absolutify(event.detail.url),
				'headers': event.detail.headers ? event.detail.headers : [ ],
				'data': event.detail.data
			});
		});
} catch (e) {
	if (e.message != 'JavaScript is disabled') {
		throw e;
	}
}

chrome.extension.onMessage.addListener(function(request, sender, sendResponse){
	console.log("chrome.extension.onMessage");
	if(request.topic =="redirectUrl") {
		var url = request.redirectUrl;
		window.location.href = url;
		sendResponse({status:"finished"});
	}
});