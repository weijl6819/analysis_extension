
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

;(function(){
"use strict";
var FreePriceAlerts = window.FreePriceAlerts = window.FreePriceAlerts || {};
FreePriceAlerts.console = FreePriceAlerts.console || {};

var _ = FreePriceAlerts.libs.underscore;

(function() { // this === FreePriceAlerts.console

    var _getContexts = function() {
        return FreePriceAlerts.config('logContexts') || [];
    };

    var _setContexts = function(contexts) {
        FreePriceAlerts.config('logContexts', contexts);
        FreePriceAlerts.browser.config('logContexts', JSON.stringify(contexts));
        return _getContexts();
    };

    this.contexts = function() { return _getContexts(); };
    this.contexts.all = function() { return _setContexts(['all']); };
    this.contexts.clear = function() { return _setContexts([]); };

    this.contexts.isEnabled = function(context) {
        return _(_getContexts()).any(function(v){
            return v.toLowerCase() === context.toLowerCase();
        });
    };

    /// Enables each named context.
    this.contexts.enable = function(/* 'context name', ... */) {
        var contexts = _getContexts();
        _(arguments).chain().flatten().each(function(name){
            contexts.push(name.toLowerCase());
        });
        _setContexts(contexts);
    };

    /// Disables each named context.
    this.disableContexts = function(/* 'context name', ... */) {
        var args = arguments;
        var contexts = _getContexts();
        contexts = _(contexts).select(function(context) {
            return !_(args).chain().flatten().any(function(name){
                return name.toLowerCase() === context.toLowerCase();
            }).value();
        });
        _setContexts(contexts);
    };

    /// Sends the args to the logger if the context is enabled.
    /// @param  context  The name of the context or a function that returns the name.
    ///                  Used to check if the message should be output.
    this.logContext = function(context /* , console_arg, ... */)
    {
        var args = Array.prototype.slice.call(arguments);
        args.shift(); // => context

        if ( this.contexts.isEnabled('all') || this.contexts.isEnabled(context) ) {
            this.logRaw.apply(this, args);
        }
    };

}).call(FreePriceAlerts.console);

})();

