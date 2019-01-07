
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
var timerContent = null;

$(function () {
    (function init() {
        log('CONTENT.JS: INITIALIZE');
        if ('undefined' === typeof framework) {
            log('CONTENT.JS: FRAMEWORK IS UNDEFINED');
            if(timerContent < 5000) {
                timerContent += 100;
                setTimeout(init, 100);
            }
        } else {
            log('CONTENT.JS: FRAMEWORK EXISTED');
            injectCSS();
            log('CONTENT.JS: ', extractDomain(window.location.href) + ' ' + API.auth.domain);
            if (extractDomain(window.location.href) == API.auth.domain) {
                log('CONTENT.JS: FRAMEWORK EXISTED');
                var cookieValue = getCookie(API.auth.cookieName);
                if (cookieValue) {
                    log('CONTENT.JS: RECEIVE cookie => USER_LOGIN', cookieValue);
                    framework.extension.fireEvent('USER_LOGIN', {tabId: null, data: {cookie: cookieValue}});
                } else {
                    log('CONTENT.JS: NO cookie => USER_LOGOUT');
                    framework.extension.fireEvent('USER_LOGOUT', {tabId: null, data: {cookie: ''}});
                }
            }
            if (extractDomain(window.location.href)) {

            }
        }

        framework.extension.fireEvent('GET_MERCHANT', {data:{
            'url': location.href
        }}, function(data) {
            if (data) {
                log('CONTENT.JS: DO SLIDER?', data);
                if (data.currentMerchant && data.currentMerchant.Id && data.currentMerchant.Reward) {
                    if (
                        extractDomain(window.location.href) == data.currentMerchant.Domai ||
                        extractDomain(window.location.href).match(data.currentMerchant.Pattern)
                    ) {
                        log('CONTENT.JS: SHOW SLIDER FOR', data.currentMerchant);
                        if (data.currentMerchant.Offers.toJSON || navigator.userAgent.indexOf("Firefox") != -1) {
                            data.currentMerchant.Offers = data.currentMerchant.Offers.models;//.toJSON();
                            data.currentMerchant.Offers.forEach(function(offer, j, thisArr){
                                offer = offer.attributes || offer;
                                thisArr[j] = offer;
                            });
                            log('CONTENT.JS: OFFERS', data.currentMerchant.Offers);
                        }

                        if(data.gotTheCode) {
                            data.gotTheCode.forEach(function(element){
                                var gotCode = 0;
                                data.currentMerchant.Offers.forEach(function(offer){
                                    if(offer.OfferId === +element) {
                                        gotCode = offer;
                                    }
                                });
                                if (gotCode) {
                                    gotCode.getTheCode = true;
                                }
                            });
                        }

                        var thisSlider = new Slider({
                            model: data
                        });
                    }

                }

                var thisSerp = new Serp({
                    model: data
                });
            }
        });

    })();
});