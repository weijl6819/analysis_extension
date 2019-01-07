
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
"use strict";

var isPrerendering = !1;

function regexCheck(regexList, whiteList) {
    var txt = document.getElementsByTagName("html")[0].innerHTML, len = regexList.length, i;
    var bwLen = whiteList.length, whiteListed = !1;
    var whitelist = [ "accounts.google.com", "blocksimanager.appspot.com", "www.block.si", "www.google.com", "service2.block.si", "service.block.si", "accounts.youtube.com" ];
    var k = whitelist.length - 1;
    while (k > -1) {
        if (whitelist[k] === location.host || location.host.indexOf(whitelist[k]) > -1) whiteListed = !0;
        k--;
    }
    for (i = 0; bwLen >= i; i++) {
        if (i == bwLen) break;
        if (location.host.indexOf(whiteList[i][0]) > -1) if (0 === whiteList[i][1] || "0" === whiteList[i][1]) whiteListed = !0;
    }
    if (0 == whiteListed) for (i = 0; len > i; i++) if (txt.search(new RegExp(regexList[i], "im")) !== -1) {
        window.location.replace("http://www.block.si/regex.php?url=" + window.location.host + "&reg=" + regexList[i]);
        break;
    }
}

function handleVisibilityChange() {
    if (!isPrerendering || location.host.indexOf("block.si") > -1) return;
    chrome.runtime.sendMessage({
        regex: !0
    }, function(response) {
        regexCheck(response.Regex, response.WhiteList);
    });
    isPrerendering = !1;
}

if ("prerender" !== document.webkitVisibilityState && location.host.indexOf("block.si") === -1) chrome.runtime.sendMessage({
    regex: !0
}, function(response) {
    regexCheck(response.Regex, response.WhiteList);
}); else {
    isPrerendering = !0;
    document.addEventListener("webkitvisibilitychange", handleVisibilityChange, !1);
}

window.addEventListener("message", function(event) {
    if (event.data.type && "FROM_PAGE" === event.data.type) {
        var urlLink = document.getElementById("url_link");
        chrome.runtime.sendMessage({
            warning: event.data.text,
            url: urlLink.innerText
        });
    }
}, !1);