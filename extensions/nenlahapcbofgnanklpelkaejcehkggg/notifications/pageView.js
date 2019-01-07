
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
window.__wb_timing = {
  docStartAt: performance.now(),
  pageViewRequireAt: performance.now()
};

chrome.runtime.sendMessage(
  {
    type: 'pageView',
    url: window.location.href,
    referrer: document.referrer,
    title: document.title
  },
  pageViewId => {
    window.__wb_page_view_id = pageViewId;
  }
);
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'isCommonLoaded') {
    sendResponse({loaded: !!window.webpackJsonp});
  }
});
document.addEventListener('DOMContentLoaded', () => {
  window.__wb_timing.DOMContentLoadedAt = performance.now();
  var link = document.querySelector('link[rel="chrome-webstore-item"]');
  if (link && link.href) {
    chrome.runtime.sendMessage({
      type: 'extLink',
      link: link.href,
      url: window.location.href,
      referrer: document.referrer,
      title: document.title
    });
  }
});
