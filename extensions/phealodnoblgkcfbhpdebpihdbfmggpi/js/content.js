
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
/** global: browser */
/** global: XMLSerializer */

if ( typeof browser !== 'undefined' && typeof document.body !== 'undefined' ) {
  try {
    var html = new XMLSerializer().serializeToString(document);

    if ( html.length > 50000 ) {
      html = html.substring(0, 25000) + html.substring(html.length - 25000, html.length);
    }

    const scripts = Array.prototype.slice
      .apply(document.scripts)
      .filter(script => script.src)
      .map(script => script.src);

    browser.runtime.sendMessage({
      id: 'analyze',
      subject: { html, scripts },
      source: 'content.js'
    });

    const script = document.createElement('script');

    script.onload = () => {
      addEventListener('message', event => {
        if ( event.data.id !== 'js' ) {
          return;
        }

        browser.runtime.sendMessage({
          id: 'analyze',
          subject: {
            js: event.data.js
          },
          source: 'content.js'
        });
      }, true);

      ( chrome || browser ).runtime.sendMessage({
        id: 'init_js',
        subject: {},
        source: 'content.js'
      }, response => {
        if ( response ) {
          postMessage({
            id: 'patterns',
            patterns: response.patterns
          }, '*');
        }
      });
    };

    script.setAttribute('id', 'wappalyzer');
    script.setAttribute('src', browser.extension.getURL('js/inject.js'));

    document.body.appendChild(script);
  } catch (e) {
    log(e);
  }
}

function log(message) {
  browser.runtime.sendMessage({
    id: 'log',
    message,
    source: 'content.js'
  });
}
