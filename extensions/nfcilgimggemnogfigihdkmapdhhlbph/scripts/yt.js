
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
var quality = 0;
var highpref = false;
var pause = false;

function injectCode(){
		var inj0 = document.createElement('script');
		var inj1 = document.createElement('script');
		var docFrag = document.createDocumentFragment();
		inj0.type = "text/javascript";
		inj0.src = chrome.extension.getURL('scripts/utils.js');
		inj0.onload = function() {
			this.parentNode.removeChild(this);
		};
		
		inj1.innerHTML =
				["function onYouTubePlayerReady(player){",
				 "		setTimeout(function(){ytPlayerHook(player, " + speed + ", " + quality + ", " + highpref + ", " + pause + ");},10);",
				 "}"].join('\n');
		docFrag.appendChild(inj0);
		docFrag.appendChild(inj1);
		
		(document.head||document.documentElement).appendChild(docFrag);
		inj1.parentNode.removeChild(inj1);
}

chrome.extension.sendRequest({method: "getStatus"}, function(response) {
		quality = response.status;
		chrome.extension.sendRequest({method: "getHighPref"}, function(response) {
			highpref = response.status;
			chrome.extension.sendRequest({method: "getPause"}, function(response) {
                pause = response.status;
                chrome.extension.sendRequest({method: "getSpeed"}, function(response) {
                speed = response.status;
                    injectCode();
			});
		});
	});
});
