
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
var Slider = Backbone.View.extend({
    template: Handlebars.templates.slider,
    events: {
        'click #gpt-close-slider': function () {
            googleAnalytics('UserActivityInNotification', 'CloseNotification');

            this.model.currentMerchant.isClosed = true;
            framework.extension.fireEvent('CLOSE_SLIDER', {data: this.model.currentMerchant.isClosed});

            log('SLIDER.JS: CLOSE SLIDER', this);

            this.$el.animate({
                'top': '-' + 500 + 'px'
            }, {
                'duration': 500
            });
        },
        'click .get-paid-to-notification_btn-get-cashback': function (event) {
            this.model.currentMerchant.isActivated = true;
            log('SLIDER.JS: GET CASHBACK', this);
            googleAnalytics('UserActivityInNotification', 'GetCashbackClick');
            framework.browser.navigate({
                tabId: framework.browser.CURRENTTAB,
                url: event.currentTarget.dataset.url
            });
        },
        'click #gpt-login-to-ext-slider': function () {
            googleAnalytics('UserActivityInNotification', 'LoginClick');
            framework.browser.navigate({
                tabId: framework.browser.NEWTAB,
                url: LOG_INTO_EXTENSION
            });
        },
        'click .get-paid-to-notification_btn-get-code': function (event) {
            googleAnalytics('UserActivityInNotification', 'GetTheCode');
            framework.browser.navigate({
                tabId: framework.browser.CURRENTTAB,
                url: event.currentTarget.dataset.url
            });
        },
        'click .get-paid-to-notification_btn-copy-code': function (event) {
            googleAnalytics('UserActivityInNotification', 'CopyTheCode');
            copyToClipboard($(event.currentTarget).find('.get-paid-to-notification_copy_text').text());
        }
    },
    initialize: function (options) {
        log('SLIDER.JS: INIT SLIDER', this);

        if (!this.model.currentMerchant.isClosed && this.model.settings.showSlider) {
            this.render();
        }
    },

    render: function () {
        log('SLIDER.JS: RENDER SLIDER', this);

        var self = this;
        if (!$.contains(window.document, this.el)) {
            this.$el.empty().append($(this.template(this.model)));

            this.$el.prependTo(window.document.body)
                .css({
                    "position": "fixed",
                    "z-index": "987654329876",
                    "top": "10px",
                    "right": "10px",
                    "padding": "0",
                    "margin": "0",
                    "display": "none"
                })
                .show();

            // CHRISTMAS
            var currentData = new Date();
            if (// from November 25 to January 1
            (currentData.getUTCDate() > 24 && currentData.getUTCMonth() === 10) ||
            (currentData.getUTCMonth() === 11) ||
            (currentData.getUTCDate() < 2 && currentData.getUTCMonth() === 0)
            ) {
                $('.get-paid-to-notification_slider-header')[0].classList.add('get-paid-to-notification_slider-header-xmas');
            }
            //

            return this;
        }
    }
});