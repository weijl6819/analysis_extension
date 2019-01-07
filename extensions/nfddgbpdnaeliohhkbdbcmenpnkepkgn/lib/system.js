
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

var inboxsdk_app_id = 'sdk_net2016_ae053ca144';
var ep_type = 'production';
var apis = {};
var NET_stripeKey = '';


var buildEp = function (host, ver) {
    return {
        pay_plans:              host + 'pay' + ver + 'plans',
        pay_subscribe:          host + 'pay' + ver + 'subscribe',
        track_enable:           host + 'track' + ver + 'enable',
        track_open:             host + 'track' + ver + 'open',
        track_link:             host + 'track' + ver + 'link',
        track_view:             host + 'track' + ver + 'view',
        gmail_auth:             host + 'gmail' + ver + 'auth',
        gmail_auth_callback:    host + 'gmail' + ver + 'auth_callback',
        gmail_auth_verify:      host + 'gmail' + ver + 'auth_verify',
        gmail_get_profile:      host + 'gmail' + ver + 'get_profile',
        gmail_mark:             host + 'gmail' + ver + 'mark',
        gmail_schedule_message: host + 'gmail' + ver + 'schedule_message',
        gmail_edit_message:     host + 'gmail' + ver + 'edit_message',
        gmail_save_message:     host + 'gmail' + ver + 'save_message',
        gmail_schedule_bump:    host + 'gmail' + ver + 'schedule_bump',
        gmail_view_job:         host + 'gmail' + ver + 'view_job',
        gmail_fetch_draft:      host + 'gmail' + ver + 'fetch_draft',
        gmail_schedule_followup:    host + 'gmail' + ver + 'schedule_followup',
        gmail_get_send_with_tag:    host + 'gmail' + ver + 'get_send_with_tag',
        gmail_get_alerts:       host + 'gmail' + ver + 'get_alerts',
        report_count_now:       host + 'report' + ver + 'count_now'
    };
};


var applyApiEp = function (type) {

    ep_type = type;
    var host = '', ver = '';
    if (type === 'local') {
        host = 'https://localhost:36001/';
        ver = '/';
        NET_stripeKey = 'pk_test_GZnncdgicMnygPSEQQkyxu3q';
    } else if (type === 'test') {
        host = 'https://net.heshiming.com/';
        ver = '/v2/';
        NET_stripeKey = 'pk_test_GZnncdgicMnygPSEQQkyxu3q';
    } else if (type === 'production') {
        host = 'https://api.thetopinbox.com/';
        ver = '/v2/';
        NET_stripeKey = 'pk_live_t4tro0LBEgh9nauLyegfPiZS';
    }
    apis = buildEp(host, ver);
    console.log('applyApiEp', host, ver);

};


if (chrome.management) {
    // running in background
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if (request.code === 'getEpType')
            sendResponse(ep_type);
    });
    chrome.management.getSelf(function (result) {
        var type = 'production'; 
        if (result.installType === 'development') {
            type = 'local';
        }
        applyApiEp(type);
    });
} else {
    // running embedded in Gmail
    chrome.runtime.sendMessage({code: 'getEpType'}, function (type) {
        applyApiEp(type);
    });
}
