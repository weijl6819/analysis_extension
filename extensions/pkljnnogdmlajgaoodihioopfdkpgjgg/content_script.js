
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
/**
 * @desc DOM HIGHLIGHTER
 * @author jiguang
 * @mail jiguang1984#gmail.com
 * @date 2013-11-25
 */

// init, get item list from background
var port = chrome.runtime.connect({name: "dom_highlighter"});
port.postMessage({action: "init"});
port.onMessage.addListener(function(msg) {
    if (msg.status == "ok"){

        var item_list = msg.item_list;

        if(item_list.length > 0){
            for(var i = 0, j = item_list.length; i<j; i++){
                $(item_list[i].selector).css('background-color', item_list[i].color);
            }
        }
    }
});

// get message from background
chrome.runtime.onConnect.addListener(function(port) {

    port.onMessage.addListener(function(msg) {

        // init dom highlight in current page
        if (msg.action == "add"){
            $(msg.selector).css('background-color', msg.color);
        }
        if (msg.action == "remove"){
            location.reload();
        }

        port.postMessage({
            status: "ok"
        });
    });
});







