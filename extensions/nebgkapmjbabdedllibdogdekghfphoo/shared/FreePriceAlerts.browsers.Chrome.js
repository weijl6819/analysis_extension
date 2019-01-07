
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

window.FreePriceAlerts = window.FreePriceAlerts || {};
window.FreePriceAlerts.browsers = window.FreePriceAlerts.browsers || {};
window.FreePriceAlerts.browsers.Chrome = function(){
    "use strict";

    var self = this;

    this.log = function(var_args) {
        window.console.log.apply(window.console,arguments);
    };

    this.readPref  = function(name) { return localStorage['settings.'+name]; };
    this.writePref = function(name, value) { localStorage['settings.'+name] = value; };
    this.deletePref = function(name) { localStorage.removeItem('settings.'+name); };

    this.config = function() {
        "use strict";

        if (arguments.length === 0) {
            return {};
        }

        if (arguments.length === 1) {
            return self.readPref.apply(self, arguments);
        }

        return self.writePref.apply(self, arguments);
    };

    this.extUrl = function() { return chrome.extension.getURL(); };
    this.getUrl = function(file) { return chrome.extension.getURL(file); };

    this.getExtensionVersion = function(extensionId, callback) {
		FreePriceAlerts.libs.jQuery.get( 'manifest.json', function(manifest) {
            callback(manifest.version);
        }, 'json' );
    };

    this.newTab = function(url) { chrome.tabs.create({url: url}); };

};
