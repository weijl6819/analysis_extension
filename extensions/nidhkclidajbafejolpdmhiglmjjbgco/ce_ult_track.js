
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
YUI.add('ce-ult-track', function(Y, NAME) {
    'use strict';

    var S2SUlt = Y.namespace('S2SUlt'),
        IMG = new Image(),
        appConfig = (YUI.Env.S2s && YUI.Env.S2s.config) ? YUI.Env.S2s.config : {},
        GEO_SERVER_LOCATION = (appConfig.env === 'qa' || appConfig.env === 'development') ? 'http://linktrack.corp.yahoo.com/p?' : 'https://geo.yahoo.com/p?',
        S2S_SPACE_IDS = YUI.Env.S2s && YUI.Env.S2s.config && YUI.Env.S2s.config.SPACE_ID;

    /*Dump ULT JS Lib to configure locally for S2s*/
    /*twiki: http://twiki.corp.yahoo.com/view/SDSMain/ULTJavascriptClickOnly*/
    /*current version : 3.2*/
    var YAHOO = {
        'ULT': {
            'BEACON': (appConfig.env === 'qa' || appConfig.env === 'development') ? 'http://linktrack.corp.yahoo.com/t' : location.protocol + "//geo.yahoo.com/t",
            'IMG': new Image()
        }
    };

    YAHOO.ULT.SRC_SPACEID_KEY = '_S';
    YAHOO.ULT.DEST_SPACEID_KEY = '_s';
    YAHOO.ULT.YLC_LIBSRC = 2;
    YAHOO.ULT.CTRL_C = '\x03';
    YAHOO.ULT.CTRL_D = '\x04';
    YAHOO.ULT.BASE64_STR = "ABCDEFGHIJKLMNOP" + "QRSTUVWXYZabcdef" + "ghijklmnopqrstuv" + "wxyz0123456789._-";
    (function() {
        var YLT = YAHOO.ULT;
    }());
    (function() {
        YAHOO.ULT.track_click = function(u, p, g) {
            if (!u || !p) {
                return u;
            }
            u = YAHOO.ULT.y64_token("ylc", u, p);
            if (g) {
                u = YAHOO.ULT.y64_token("ylg", u, g);
            }
            return u;
        };
        YAHOO.ULT.beacon_click = function(p, g, i, cb) {
            if (!i) {
                i = YAHOO.ULT.IMG;
            }
            if (g && g.nodeName === 'IMG') {
                i = g;
                g = undefined;
            }
            if (p) {
                var url = YAHOO.ULT.track_click(YAHOO.ULT.BEACON, p, g);
                url += '?t=' + Math.random();
                i.src = url;
            }
            if (cb) {
                cb({'message': url});
            }
            return true;
        };
        YAHOO.ULT.y64_token = function(t, u, p) {
            if (!t || !u || !p) {
                return u;
            }
            p._r = YAHOO.ULT.YLC_LIBSRC;
            var ks = [],
                i = 0,
                k;
            for (k in p) {
                var v = p[k];
                if (typeof v !== 'string') {
                    v = String(v);
                    p[k] = v;
                }
                if (k.length < 1) {
                    return u;
                }
                if (k.length > 8) {
                    return u;
                }
                if (k.indexOf(' ') !== -1) {
                    return u;
                }
                if (YAHOO.ULT.has_ctrl_char(k) || YAHOO.ULT.has_ctrl_char(v)) {
                    return u;
                }
                ks[i++] = k;
            }
            ks = ks.sort();
            var f = [];
            for (i = 0; i < ks.length; i++) {
                f[i] = ks[i] + YAHOO.ULT.CTRL_C + p[ks[i]];
            }
            f = f.join(YAHOO.ULT.CTRL_D);
            if (f.length < 1 || f.length > 1024) {
                return u;
            }
            f = ';_' + t + '=' + YAHOO.ULT.encode64(f);
            i = u.indexOf('/*');
            if (i === -1) {
                i = u.indexOf('/?');
            }
            if (i === -1) {
                i = u.indexOf('?');
            }
            if (i === -1) {
                return u + f;
            } else {
                return u.substr(0, i) + f + u.substr(i);
            }
        };
        YAHOO.ULT.has_ctrl_char = function(s) {
            var i = 0;
            for (; i < s.length; i++) {
                if (s.charCodeAt(i) < 0x20) {
                    return true;
                }
            }
            return false;
        };
        YAHOO.ULT.encode64 = function(input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;
            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }
                output = output +
                    YAHOO.ULT.BASE64_STR.charAt(enc1) +
                    YAHOO.ULT.BASE64_STR.charAt(enc2) +
                    YAHOO.ULT.BASE64_STR.charAt(enc3) +
                    YAHOO.ULT.BASE64_STR.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);
            return output;
        };
    }());
    /*ULT lib dump end*/

    S2SUlt.ULT = YAHOO.ULT;

    S2SUlt.ULT.firePartialPVBeacon = function(spaceID, params, cb) {
        var url = "",
            queryString = "";

        if (!spaceID) {
            if (cb) {
                cb({'message': 'no action taken'});
            }
            return;
        }

        url = GEO_SERVER_LOCATION + 's=' + S2S_SPACE_IDS[spaceID] + '&t=' + Math.random();

        for (var param in params) {
            if (params.hasOwnProperty(param)) {
                queryString += '&' + param + '=' + encodeURIComponent(params[param]);
            }
        }

        url += queryString;

        IMG.src = url;
        if (cb) {
            cb({'message': url});
        }
    };

}, '0.8.0', {
    requires: []
});