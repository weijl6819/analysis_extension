
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
function googleAnalytics(eventCategory, eventAction){
    framework.extension.fireEvent('GOOGLE_ANALYTICS_EVENT', {
        data: {
            eventCategory: eventCategory,
            eventAction: eventAction
        }
    });
}

function guid() {
    return "xxxxxxxxxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        var r = Math.random() * 9 | 0, v = c == "x" ? r : (r & 0x3 | 0x8);
        return v.toString();
    });
}

function extractDomain(url) {//extract domain from url string
    var domain;
    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
    }
    else {
        domain = url.split('/')[0];
    }
    domain = domain.split(':')[0];
    return domain.toLowerCase();//domain.replace('www.', '').toLowerCase();
}

function objectToArray(obj) {//convert obj to array
    var arr = [];
    _.each(obj, function (e) {
        arr.push(e);
    });
    return arr;
}

function currentTimeStamp() {//return current timestamp
    return new Date().getTime();
}

function getCookie(name) {//get cookie by name
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, options) {//set cookie
    options = options || {};

    var expires = options.expires;

    if (typeof expires == "number" && expires) {
        var d = new Date();
        d.setTime(d.getTime() + expires * 1000);
        expires = options.expires = d;
    }
    if (expires && expires.toUTCString) {
        options.expires = expires.toUTCString();
    }

    value = encodeURIComponent(value);

    var updatedCookie = name + "=" + value;

    for (var propName in options) {
        updatedCookie += "; " + propName;
        var propValue = options[propName];
        if (propValue !== true) {
            updatedCookie += "=" + propValue;
        }
    }

    document.cookie = updatedCookie;
}

function log() {//custom log
    if (DEBUG) {
        if (framework.browser.name === 'Safari') {
            console.log(arguments);
        } else {
            console.info.apply(null, arguments);
        }
    }
}

function getStyle(el, cssprop) {//return css style from element
    if (el.currentStyle) {
        return el.currentStyle[cssprop];
    } else if (document.defaultView && document.defaultView.getComputedStyle) {
        var style = document.defaultView.getComputedStyle(el, "");
        return style ? style[cssprop] : null;
    } else if (el.style) {
        return el.style[cssprop];
    }
}

function getListOfAbsoluteElements(parent, deep, opt_parentIsAbsolute) {//is it really necessary?
    var list = [];
    for (var i = 0; i < parent.childNodes.length; i++) {
        if (parent.childNodes[i] && parent.childNodes[i].nodeType == 1) {
            var pos = getStyle(parent.childNodes[i], 'position');
            if (!opt_parentIsAbsolute && pos == 'absolute' || pos == 'fixed') {
                if (getStyle(parent.childNodes[i], 'top') != 'auto') {
                    list.push(parent.childNodes[i]);
                }
            }
            var abs = (pos == 'absolute' || pos == 'fixed' || pos == 'relative') || opt_parentIsAbsolute;
            if (parent.childNodes[i].childNodes && deep > 0) {
                var res = getListOfAbsoluteElements(parent.childNodes[i], deep - 1, abs);
                if (res && res.length) {
                    list = list.concat(res);
                }
            }
        }
    }
    return list;
}

copyToClipboard = function(str) {
    // if (framework.browser.name === 'Firefox' /*|| navigator.userAgent.indexOf("Firefox") != -1*/) {
    //     var gClipboardHelper = Components.classes["@mozilla.org/widget/clipboardhelper;1"].getService(Components.interfaces.nsIClipboardHelper);
    //     gClipboardHelper.copyString(str);
    // } else {
        var inp = document.createElement('input');
        document.body.appendChild(inp);
        inp.value = str;
        inp.select();
        document.execCommand('Copy');
        document.body.removeChild(inp);
    // }
};

Handlebars.registerHelper('if_all', function() {
    var args = [].slice.apply(arguments);
    var opts = args.pop();

    var fn = opts.fn;
    for(var i = 0; i < args.length; ++i) {
        if(args[i])
            continue;
        fn = opts.inverse;
        break;
    }
    return fn(this);
});

Handlebars.registerHelper('compare', function(lvalue, rvalue, options) {

    if (arguments.length < 3) {
        throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
    }

    var operator = options.hash.operator || "==";

    var operators = {
        '==':       function(l,r) { return l == r; },
        '===':      function(l,r) { return l === r; },
        '!=':       function(l,r) { return l != r; },
        '<':        function(l,r) { return l < r; },
        '>':        function(l,r) { return l > r; },
        '<=':       function(l,r) { return l <= r; },
        '>=':       function(l,r) { return l >= r; },
        'typeof':   function(l,r) { return typeof l == r; }
    };

    if (!operators[operator]) {
        throw new Error("Handlerbars Helper 'compare' doesn't know the operator "+operator);
    }

    var result = operators[operator](lvalue,rvalue);

    if( result ) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }

});