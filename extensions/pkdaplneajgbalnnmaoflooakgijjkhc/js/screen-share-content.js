
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
/* jshint undef: false */

// Notify our page the extension is installed.
// https://developer.chrome.com/webstore/inline_installation
if (document.getElementById('ls-extension-installed')) {
  document.getElementById('ls-extension-installed').remove();
}

var isInstalledNode = document.createElement('div');
if (isInstalledNode) {
  isInstalledNode.id = 'ls-extension-installed';

  isInstalledNode.addEventListener("requestScreenShareWithSources", function(evt) {
    try {
      chrome.runtime.sendMessage({requestScreenWithSources: evt.detail}, function (res) {
      });
    } catch (err) {
      var e = document.createEvent('MessageEvent');
      e.initMessageEvent('reinstallEvent', true, true);
      document.dispatchEvent(e);
    }
  });

  isInstalledNode.addEventListener("requestScreenShare", function(evt) {
    try {
      chrome.runtime.sendMessage({requestScreen: true}, function (res) {
      });
    } catch (err) {
      var e = document.createEvent('MessageEvent');
      e.initMessageEvent('reinstallEvent', true, true);
      document.dispatchEvent(e);
    }
  });
}

var installerNode = document.querySelector('#ls-extension');
if (installerNode) {
  installerNode.appendChild(isInstalledNode);
}

document.addEventListener("requestScreenShare", function() {
  chrome.runtime.sendMessage({requestScreen: true}, function(res) {
  });
});


// Recieve message from eventPage
chrome.runtime.onMessage.addListener(
  function(req, sender, sendResponse) {
    // respond back to website with 'screenShareEvent'
    var e = document.createEvent('MessageEvent');
    e.initMessageEvent('screenShareEvent', true, true, req.streamId);
    document.dispatchEvent(e);
    if (req.event) {
        e.initMessageEvent('screenShareEventWithOptions', true, true, {streamId:req.streamId, options:req.options})   
        document.dispatchEvent(e);
    }
  }
);

