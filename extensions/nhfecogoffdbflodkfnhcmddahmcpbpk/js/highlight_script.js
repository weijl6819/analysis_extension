
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
/**
 * Created by Ali H. on 9/30/2016.
 */

function highlight(domains) {
    var anchor_links_length = $("a").wrap("href").length;
    for (var i = 0; i < anchor_links_length; i++) {
        var link = $($("a").wrap("href")[i]).attr("href");
        if (link != '#' && link != undefined && link != "") {
            if (link.indexOf("http") >= 0) {
                if (url("domain", window.location.href) != url("domain", link)) {
                    if (url("domain", link)) {
                        if (link.includes(url("domain", link))) {
                            for (var j = 0; j < domains.length; j++) {
                                if (domains[j].available) {
                                    if (domains[j].domain == url("domain", link)) {
                                        $($("a").wrap("href")[i]).addClass("anchor_link_style");
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    highlightTextDomains(domains);
}

function highlightTextDomains(domains){
    for (var j = 0; j < domains.length; j++) {
        if (domains[j].available) {
            findString(domains[j].domain);
        }
    }
}
function findString(str) {
    if (parseInt(navigator.appVersion)<4) return;
    var strFound;
    if (window.find) {
        // CODE FOR BROWSERS THAT SUPPORT window.find
        strFound=self.find(str);
        if (!strFound) {
            strFound=self.find(str,0,1);
            while (self.find(str,0,1)) continue;
        }
    }

    if (strFound){
        document.designMode = "on";
        document.execCommand('backColor', false, "#ffff00");
        document.designMode = "off";
    }

    return;
}

var page_number = 1;
var youtube_url ;
var pere = 1;
function replaceUrlParam(url, paramName, paramValue) {
    if (paramValue == null)
        paramValue = '';
    var pattern = new RegExp('\\b(' + paramName + '=).*?(&|$)')
    if (url.search(pattern) >= 0) {
        return url.replace(pattern, '$1' + paramValue + '$2');
    }
    return url + (url.indexOf('?') > 0 ? '&' : '?') + paramName + '=' + paramValue
}

var resultToLoad = $(".g").length;
var resultToLoadBing = $(".b_algo").length;
$(window).scroll(function () {
    if ($(window).scrollTop() >= $(document).height() - $(window).height() - 100) {
        if(window.location.hostname.indexOf('google.com') !== -1) {
            var url = replaceUrlParam(window.location.href, "start", (page_number++) * resultToLoad);
            if (url) {
                $.ajax({
                    url: url,
                    dataType: 'html',
                    success: function (html) {
                        var elements = $(html);
                        var found = $('.srg', elements);
                        if (found) {
                            $('.srg').append(found);
                        }
                    }
                });
            }
        }

        else if(window.location.hostname.indexOf('youtube.com') !== -1){
                youtube_url = $('a[aria-label="Go to page ' + (++page_number) + '"]').attr('href');
            if (youtube_url) {
                $.ajax({
                    url: youtube_url,
                    dataType: 'html',
                    success: function (html) {
                        var elements = getHtml(html);
                        var found = $('.item-section .yt-lockup', elements);
                        youtube_url = $('a[aria-label="Go to page ' + (++page_number) + '"]', elements).attr('href');
                        if (found) {
                            $('.yt-lockup:last').after(found);
                        }
                    }
                });
            }
        }

        else if(window.location.hostname.indexOf('bing.com') !== -1) {
            var url = replaceUrlParam(window.location.href, "first", (page_number++) * resultToLoadBing +1);

            if (url) {
                $.ajax({
                    url: url,
                    dataType: 'html',
                    success: function (html) {
                        var elements = $(html);
                        var found = $('#b_results .b_algo', elements);
                        if (found) {
                            $('.b_algo:last').after(found);
                        }
                    }
                });
            }
        }

        else if(window.location.hostname.indexOf('yandex.com') !== -1) {
            var url = replaceUrlParam(window.location.href, "p", (page_number++));

            if (url) {
                $.ajax({
                    url: url,
                    dataType: 'html',
                    success: function (html) {
                        var elements = $(html);
                        var found = $('.serp-list.serp-list_left_yes .serp-item', elements);
                        console.log(found);
                        console.log(found);
                        if (found) {
                            $('.serp-list.serp-list_left_yes .serp-item:last').after(found);
                        }
                    }
                });
            }
        }

    }
});

function getHtml(str){
    var d = document.createElement('div');
    d.innerHTML = str;
    return d.childNodes;
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.key == "findDomains") {
        highlight(request.result);
    }
});
