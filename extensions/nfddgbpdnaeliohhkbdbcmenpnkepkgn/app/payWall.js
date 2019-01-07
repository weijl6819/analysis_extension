
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
var makeOnChildMessage = function (state) {
    return function (e) {
        if (!e.data ||
            !e.data.src ||
            !e.data.event ||
            e.data.src !== 'NET')
            return;
        if (e.data.event === 'NET_close') {
            state.frm.parentNode.removeChild(state.frm);
        } else if (e.data.event === 'NET_stayFree') {
            state.frm.parentNode.removeChild(state.frm);
            if (state.stayFree)
                state.stayFree();
        } else if (e.data.event === 'NET_purchased') {
            state.frm.parentNode.removeChild(state.frm);
            if (state.purchased)
                state.purchased();
        }
    };
};


var showPayWall = function (sdk, credits, purchased, stayFree, done) {

    auth.getToken(sdk, function (token) {

        if (!token) {
            if (done)
                done();
            return;
        }

        var iframe = document.createElement('iframe');
        iframe.src = chrome.extension.getURL('assets/pay_wall.html');
        iframe.style.position = 'absolute';
        iframe.style.top = '0';
        iframe.style.left = '0';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.borderStyle = 'none';
        iframe.style.zIndex = 999;
        iframe.style.overflow = 'visible';
        iframe.onload = function () {
            iframe.contentWindow.postMessage({
                src:        'NET',
                event:      'NET_load',
                credits:    credits,
                stripeKey:  NET_stripeKey,
                apis:       apis,
                extName:    chrome.runtime.getManifest().name,
                client:     chrome.runtime.id,
                token:      token
            }, '*');
            if (done)
                done();
        };
        document.getElementsByTagName('body')[0].appendChild(iframe);

        addEventListener('message', makeOnChildMessage({
            frm:        iframe,
            stayFree:   stayFree,
            purchased:  purchased
        }), true);

    });

};
