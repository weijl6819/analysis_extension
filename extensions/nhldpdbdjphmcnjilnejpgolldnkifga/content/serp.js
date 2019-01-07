
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
var Serp = Backbone.View.extend({
    template: Handlebars.templates.serp,
    injected: 'extension-serp-element',

    initialize: function (options) {
        if(!this.template) {
            log('SERP.JS: NO TEMPLATE');

            return undefined;
        }
        log('SERP.JS: INITIALIZE SERP', this);
        var self = this;

        var settings = (self.model.settings.toJSON && self.model.settings.toJSON()) || self.model.settings;
        settings = settings.attributes || settings;
        if (settings.showSerp) {
            for (var search of objectToArray(SERPS)) {
                if (search.PATTERN.test(window.location.href)) {
                    log('SERP.JS: NOTICE ' + search.NAME + ' SEARCH PAGE');
                    self.search = search;
                    self.render(self.search);
                    self.eventsHandler();
                    setInterval(_.bind(self.render, self, self.search), INTERVAL_SERP_INJECTIONS);
                    return;
                }
            }
            log('SERP.JS: THIS IS NOT SEARCH PAGE');
        }
    },

    eventsHandler: function () {
        var self = this;
        $('body').on('click', '[data-serplink]', function (event) {
            googleAnalytics('UserActivity', 'SerpInjectionClick');
            framework.browser.navigate({
                tabId: event.currentTarget.dataset.window == 'new' ? framework.browser.NEWTAB : framework.browser.CURRENTTAB,
                url: event.currentTarget.dataset.serplink
            });
        });
    },

    render: function (search) {
        var self = this,
            SERP = search || self.search,
            merchants = (self.model.merchants.toJSON && self.model.merchants.toJSON()) || self.model.merchants,
            settings = (self.model.settings.toJSON && self.model.settings.toJSON()) || self.model.settings;
        settings = settings.attributes || settings;
        merchants = merchants.models || merchants;
        if (settings.showSerp) {
            $(SERP.CONTAINER_SELECTOR).each(function (index) {
                var container = $(this),
                    inject = SERP.INJ_SELECTOR ? $(this).find(SERP.INJ_SELECTOR) : $(this),
                    label = $(this).find(SERP.DATA_SELECTOR).text().toLowerCase().trim(),
                    link = decodeURI($(this).find(SERP.DATA_SELECTOR).attr(SERP.ATTR));

                if (inject && !inject.hasClass(self.injected)) {
                    for (var merchant of merchants) {
                        merchant = merchant.attributes || merchant;
                        if (merchant.Pattern !== null && merchant.Pattern !== '' && merchant.Domain !== null &&
                            (((label == merchant.Pattern.toLowerCase() ||
                                label == merchant.Domain.toLowerCase() ||
                                label == merchant.Domain.substr(0, merchant.Domain.lastIndexOf('.')).toLowerCase()) &&
                                SERP.CHECK_LABEL) ||
                                (link.indexOf('www.' + merchant.Domain.toLowerCase()) !== -1 ||
                                    extractDomain(link) == merchant.Domain.toLowerCase() ||
                                    extractDomain(link).match(merchant.Pattern)
                                ))
                        ) {//HACK
                            //INJECTION
                            var content = self.template(_.extend(merchant, SERP));
                            switch (SERP.ACTION) {
                                case 'append':
                                    inject.append(content);
                                    break;
                                case 'prepend':
                                    inject.prepend(content);
                                    break;
                                default:
                                    break;
                            }
                            $(inject).addClass(self.injected).addClass(SERP.CSS);
                            return self;
                        }
                    }
                }
            });
        }
    }
});