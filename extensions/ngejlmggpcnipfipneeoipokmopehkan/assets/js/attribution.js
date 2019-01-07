
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
webpackJsonp([3],{SJx2:function(t,e,a){"use strict";var n=a("woOf"),s=a.n(n),i={env:"production",debug:!0,appId:56,appName:"Search Administrator Tab",apps202BaseUrl:"https://staging.apps202.com",segmentWriteKey:"qunknG8cAZ8QgvsvLScDuvOyz6QPRhgG"},r={production:{debug:!1,baseUrl:"https://www.searchadministrator.com",apps202BaseUrl:"https://www.apps202.com",segmentWriteKey:"B598Xj80IwbdD5QHdRq9D7lcsJ76MNEJ"},staging:{baseUrl:"http://staging.searchadministrator.com"},development:{baseUrl:"http://sa-eric.lan.beestripe.privsub.net"},local:{baseUrl:"http://dev.searchadministrator.com"}},o=r.production;o=r.production,e.a=s()(i,o)},"VMP+":function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=a("fZjL"),s=a.n(n),i=a("pFYg"),r=a.n(i),o=a("SJx2");!function(){function t(){chrome.storage.sync.get(["install_attributed","alias"],function(s){if(!s.install_attributed)if(s.alias){var r=e+"/attribution?alias="+s.alias+"&aid="+a+"&v="+n+"&extid="+i,o=document.createElement("iframe");o.src=r,o.id="cnvrt",o.style.display="none";var c=setInterval(function(){document.body&&(clearInterval(c),document.body.appendChild(o))},50)}else setTimeout(function(){t()},300)})}if(window===window.top){var e=o.a.baseUrl,a=56,n=chrome.runtime.getManifest().version,i=chrome.runtime.id;window.addEventListener("message",function(t){if(/.+\.searchadministrator\.(?:com|dev)|sa-.+\.lan\.beestripe\.privsub\.net/i.test(t.origin)&&"sa_install_attributed"===t.data.message&&t.data.extId===i){chrome.storage.sync.set({install_attributed:!0},function(){console.debug("Install attributed")});var e=t.data.pbParams;"object"===(void 0===e?"undefined":r()(e))&&s()(e).length>0&&chrome.storage.sync.set({pb_params:e},function(){console.debug(e)})}},!1),t()}}()}},["VMP+"]);