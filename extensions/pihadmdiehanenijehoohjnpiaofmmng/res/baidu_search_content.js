
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
var frame_func = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(func) {
    window.setTimeout(func, 1000 / 30);
}

function showDanger(dom) {
  if (dom.querySelector(".pt-chrome-plugin")) {
    return;
  }
  var html = '<a style="background-color:red; padding:3px 6px; margin-left:5px;" href="https://github.com/hustcc/PTHospital.chrome" target="_blank" class="pt-chrome-plugin OP_LOG_LINK c-text c-text-public c-text-mult c-gap-icon-left">莆田系</a>';
  var title = dom.querySelector(".t");
  if (title) {
    title.innerHTML = title.innerHTML + html;
  }
}

function doBaidu() {
  var search_results = document.getElementsByClassName("c-container") || [];
  for (var i = 0; i < search_results.length; i++) {
    var result = search_results[i];
    if (result.querySelector(".pt-chrome-plugin")) {
      continue;
    }
    var url = result.querySelector(".c-showurl");
    if (url) {
      url = url.innerText;
      url = url.substring(0, url.indexOf("/"));
      // title = title.innerText;
      chrome.runtime.sendMessage({
        "id": i,
        "what": "ptinfo_bs", 
        "url": url,
        "title": "",
        "desc": ""}, function(response) {
          if (response.data && response.data.length >= 2) {
              showDanger(search_results[response.id]);    
          }
      });
    }
  }
  frame_func(doBaidu);
}
doBaidu();
