
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

;(function(){
"use strict";

var FreePriceAlerts = window.FreePriceAlerts = window.FreePriceAlerts || {};
FreePriceAlerts.toolbars = FreePriceAlerts.toolbars || {};
FreePriceAlerts.toolbars.fpa = FreePriceAlerts.toolbars.fpa || {};

var $ = FreePriceAlerts.libs.jQuery;
var _ = FreePriceAlerts.libs.underscore;

var inMemoryPodKey = '__in_memory__';
var timingLog = FreePriceAlerts.TimingLog.getInstance();

var SitesList = FreePriceAlerts.toolbars.fpa.SitesList = function() {

    this.superclass = FreePriceAlerts.events.Dispatcher;
    this.superclass();

    var self = this;
    // 10 minutes, Always fetch this often. This should hit the browser cache most of the time.
    this.fetch_freq = 600000;
    this.fetch_freq_limit = 60000; // 1 minute, Fetch no more often than this.
    var _lastProductSitesFetch = 0;
    var _rawProductSites = [];
    this.productSites = []; // Array of ProductSite
    this.rawCouponSites = [];
    this.couponSites = []; // Array of CouponSite
    this.inMemoryKey = null;
    this.inMemoryPod = null;

    /// @param onFetchDone  function( list, cameFromCache )
    this.fetchSites = function( onFetchDone, options ) {
        options = options || {};
        options.timingLog = options.timingLog || timingLog;

        var now = (new Date()).getTime();

        if (now - _lastProductSitesFetch < this.fetch_freq_limit) {
            return onFetchDone(_rawProductSites, true);
        }

        if (_rawProductSites.length === 0
        || now - _lastProductSitesFetch > this.fetch_freq) {

            _lastProductSitesFetch = now;

            var url = 'http://'+FreePriceAlerts.config.api_host()+'/product_sites.json?domain_pattern';
            FreePriceAlerts.core.getCommonUrlParams(function(k,v) { url += '&'+k+'='+v; });

            options.timingLog.add('ss', 'sitesRequestStart');
            $.ajax({
                type : 'GET',
                url : url,
                ifModified : !!_rawProductSites.length, // true ::= return status 304 if cached.
                success : function( response, textStatus, jqXHR ) {
                    options.timingLog.add('sS', 'sitesRequestEnd');
                    FreePriceAlerts.console.log('Fetched '+( response ? response.length || 0 : 0 )+' product site[s] (status: '+jqXHR.status+')');

                    _rawProductSites = response || _rawProductSites;
                    onFetchDone(_rawProductSites, jqXHR.status === 304);
                },
                fail : function( jqXHR, textStatus, errorThrown ) {
                    options.timingLog.add('sz', 'sitesRequestFail');
                    FreePriceAlerts.console.log('Product site fetch failed.');

                    //_rawProductSites = [];
                    onFetchDone(_rawProductSites, true);
                },
            });

        }
        else {
            return onFetchDone(_rawProductSites, true);
        }

    };

    this.initProductSites = function( onInitDone, options ) {
        options = options || {};
        options.timingLog = options.timingLog || timingLog;

        var _init = function( rawProductSites, cameFromCache ) {
            if (!rawProductSites || rawProductSites.length === 0) {
                FreePriceAlerts.console.log('Failed to fetch sites.');
                return;
            }

            if (self.productSites.length === 0 || !cameFromCache) {
                FreePriceAlerts.console.log('Loading '+rawProductSites.length+' site[s].');
                options.timingLog.add('si', 'sitesInitStart');
                self.productSites = _(rawProductSites).map(function(site){
                    return new FreePriceAlerts.toolbars.fpa.ProductSite(
                        site.ProductSite.parser_name, 
                        site.ProductSite.pattern, // The product pattern
                        site.ProductSite.domain_pattern);
                });
                options.timingLog.add('sI', 'sitesInitEnd');
            }

            onInitDone(self, self.productSites);
            self.triggerEvent( new FreePriceAlerts.toolbars.fpa.SitesReadyEvent(self) );
        };

        this.fetchSites(_init, options);
    };

    var checkForInMemorySite = function(url) {

        if (!FreePriceAlerts.config.read('debug')) return;

        var run_in_memory_pdl = function() {
            var mockWindow = { location : { href : url } };
            if ( !(new FreePriceAlerts.processing.Pod(self.inMemoryPod, FreePriceAlerts.config.read('api.podPath'))).parsers[0].testConditions(mockWindow) ) {
                FreePriceAlerts.console.log("The in-memory pod does not contain any parsers that match this URI.\n\nURI: "+url);
            }
            else {
                FreePriceAlerts.console.log("The in-memory pod matched.");
                return inMemoryPodKey;
            }
        }

        if (FreePriceAlerts.config.read('avoid_hash_in_tests')) {
            if (self.inMemoryPod) return run_in_memory_pdl();
        }
        else {
            var hash = FreePriceAlerts.utils.getHash(url);

            if (hash.substring(1,17) !== "freePriceAlerts-") return;

            var key = hash.substring(17),
                found = true,
                reason = "";

            if ( !self.inMemoryPod ) {
                found  = false;
                reason = "no pods in memory"
            }
            else if ( key != self.inMemoryKey ) {
                found  = false;
                reason = "invalid key pod may have expired";
            }

            FreePriceAlerts.console.log("Attempting to use in-memory pod for debugging\nKey:    "+key+"\nFound:  "+(found ? "yes" : "no\nReason: "+reason));

            if ( found ) return run_in_memory_pdl();
        }
    }

    /// Only works on the foreground page for Chrome and Safari.
    /// @param key  If provided, used as the in-memory key; otherwise a new key is generated.
    this.setInMemoryPod = function( podXml, key ) {

        this.inMemoryPod = this.inMemoryKey = null;

        var pod = new FreePriceAlerts.processing.Pod( podXml, FreePriceAlerts.config.read("api.podPath") );
        pod.validatePod();

        this.inMemoryPod = podXml;
        this.inMemoryKey = key = key || SitesList.makeInMemoryPodKey();;          

        FreePriceAlerts.console.log( "Pod loaded into memory\nKey: "+key);

        return key;
    };

    this.addCoupon = function( pattern, code, data ) {

        var i = this.rawCouponSites.length;

        var site = false;
        while ( i-- ) {
            if ( this.rawCouponSites[i].pattern == pattern ) {
                site = this.rawCouponSites[i];
                break;
            }
        }

        if ( code === undefined ) {
            if ( site ) {
                this.rawCouponSites = this.rawCouponSites.splice(this.rawCouponSites.indexOf(site)+1,1);
            }
        }
        else if ( site ) {
            site.code = code;
            site.data = data;
        }
        else {
            this.rawCouponSites.push({ pattern:pattern, code:code, data:data });
        }
    };

    this.initCouponSites = function( rawCouponSites ) {
        rawCouponSites = rawCouponSites || this.rawCouponSites;
        this.couponSites = _(rawCouponSites).map(function(c){ return new FreePriceAlerts.toolbars.fpa.CouponSite( c.pattern, c.code, c.data ) });
    }

    this.testCoupon = function(url) {
        if ( !url ) return null;

        var site = _(this.couponSites).find(function(v){ return v.test(url) });

        if ( site )
            FreePriceAlerts.console.log("Testing for coupon site in URI: "+url+
                "\n"+(site ? "URI matched: "+JSON.stringify(site) : "URI did not match any added coupons"));

        return site;
    }

    this.testDomain = function(url) {
        if ( !url ) return null;

        var i = this.productSites.length;
        var site = false;
        while ( i-- ) {
            if ( site = this.productSites[i].testDomain(url) ) break;
        }

        // Comment out this next line to log on all URIs
        if ( site ) 
            FreePriceAlerts.console.log("Testing for site in URI: "+url+"\n"+(site ? "URI matched: "+site : "URI did not match any pods"));

        return site;
    }

    this.testProduct = function(url) {
        if ( !url ) return null;

        var site = false;
        if (( site = checkForInMemorySite(url) )) {
            return site;
        }

        var i = this.productSites.length;
        while ( i-- ) {
            if ( site = this.productSites[i].testProduct(url) ) break;
        }

        // Comment out this next line to log on all URIs
        if ( site ) 
            FreePriceAlerts.console.log("Testing for product in URI: "+url+"\n"+(site ? "URI matched: "+site : "URI did not match any pods"));

        return site;
    }

    /// @param onDone  function( site, type, sitesList )
    this.test = function(url, onDone, options) {

        options = options || {};
        options.timingLog = options.timingLog || timingLog;

        if (this.rawCouponSites.length !== this.couponSites.length) {
            this.initCouponSites();
        }

        this.initProductSites(function(sitesList) {
            var productSite, domainSite, couponSite;
            options.timingLog.add('t', 'siteTestStart');

            if ( !options.skipProductSite && (productSite = self.testProduct(url)) ) {
                options.timingLog.add('T', 'siteProductMatch');
                FreePriceAlerts.console.logContext('SitesList', 'Matched site for '+productSite);
                onDone(productSite, 'product', self);
                self.triggerEvent( new SitesList.MatchedProductEvent(self, productSite) );
            }
            else if ( domainSite = self.testDomain(url) ) {
                options.timingLog.add('sD', 'siteDomainMatch');
                FreePriceAlerts.console.logContext('SitesList', 'Matched domain for '+domainSite);
                onDone(domainSite, 'domain', self);
                self.triggerEvent( new SitesList.MatchedDomainEvent(self, domainSite) );
            }
            else if ( couponSite = self.testCoupon(url) ) {
                options.timingLog.add('sC', 'siteCouponMatch');
                FreePriceAlerts.console.logContext('SitesList', 'Matched coupon for '+couponSite.pattern);
                onDone(couponSite, 'coupon', self);
                self.triggerEvent( new SitesList.MatchedCouponEvent(self, couponSite) );
            }
            else {
                options.timingLog.add('z', 'siteNoMatch');
                FreePriceAlerts.console.logContext('SitesList', 'No matched site, domain or coupon.');
                FreePriceAlerts.core.getLtUrlParam(null, function(){});
                onDone(null, 'none', self);
                self.triggerEvent( new SitesList.MatchedNothingEvent(self) );
            }
        }, options);

    };

};

SitesList.makeInMemoryPodKey = function() {
    return (Math.random()*89999999+10000000).toString(16);
};

SitesList.MatchedProductEvent = function(sitesList, productSite) {
    this.superclass = FreePriceAlerts.events.Event;
    this.superclass('MatchedProduct');
    this.sitesList = sitesList;
    this.site = this.productSite = productSite;
}

SitesList.MatchedDomainEvent = function(sitesList, domainSite) {
    this.superclass = FreePriceAlerts.events.Event;
    this.superclass('MatchedDomain');
    this.sitesList = sitesList;
    this.site = this.domainSite = domainSite;
}

SitesList.MatchedCouponEvent = function(sitesList, couponSite) {
    this.superclass = FreePriceAlerts.events.Event;
    this.superclass('MatchedCoupon');
    this.sitesList = sitesList;
    this.site = this.couponSite = couponSite;
}

SitesList.MatchedNothingEvent = function(sitesList) {
    this.superclass = FreePriceAlerts.events.Event;
    this.superclass('MatchedNothing');
    this.sitesList = sitesList;
}

var sitesList = FreePriceAlerts.toolbars.fpa.sitesList = new SitesList();


var Controller = FreePriceAlerts.toolbars.fpa.Controller = function( win, doc )
{
    this.superclass = FreePriceAlerts.events.Dispatcher;
    this.superclass();

    var self = this;
    this.pods = {}; // List of PDL name to PDL XML data.
    this.inMemoryKey = null;
    this.view = null;
    this.parserUsed = null;
    this.queryUsed = null;
    var jq = FreePriceAlerts.libs.jQuery;
    var Controller = FreePriceAlerts.toolbars.fpa.Controller;

    if ( doc === undefined ) doc = document;

    /// @param key  If provided, used as the in-memory key; otherwise a new key is generated.
    this.setInMemoryPod = function( podXml, key ) {

        this.pods[inMemoryPodKey] = this.inMemoryKey = null;
        if (!podXml) return null;

        var pod = new FreePriceAlerts.processing.Pod( podXml, FreePriceAlerts.config.read("api.podPath") );
        pod.validatePod();

        this.pods[inMemoryPodKey] = podXml;
        this.inMemoryKey = key = key || SitesList.makeInMemoryPodKey();;          

        FreePriceAlerts.console.log( "Pod loaded into memory\nKey: "+key);

        return key;
    };

    this.search = function(q, price) {
        if ( !q || !price ) throw 'Invalid parameters';
        FreePriceAlerts.console.logContext('Controller', 'Controller.search `'+price+'`  `'+q+'`');
        self.queryUsed = q;
        timingLog.add('I', 'injectIframe');

        var url = buildOffersUrl(q, price);

        if (!askShouldDoSearch(url, q, price)) return;

        self.getIFrame(url);
    }

    var buildOffersUrl = function(q, price)
    {
        var url = '//'+FreePriceAlerts.config.api_host()+'/products/offers/popup.html';
        url += '?product&coupons&relevant_offers';

        if ( q !== undefined )
            url += '&q='+encodeURIComponent(q);

        if ( price !== undefined )
            url += '&target_price='+encodeURIComponent(price);

        var site = null;

        // The Coupon site list is sent from the background to the forground script so this will work just fine.
        if ( site = sitesList.testCoupon(win.location.href) )
            url += '&coupon='+encodeURIComponent(site.code)+'&data='+encodeURIComponent(site.data);

        var append = function(k,v) { url += '&'+k+'='+v; };
        FreePriceAlerts.core.getCommonUrlParams(append);
        FreePriceAlerts.core.getLtUrlParam(win, append);

        if (doc.location.href)
            url += '&referer='+encodeURIComponent(doc.location.href);

        return url;
    }

    var askShouldDoSearch = function(url, q, price)
    {
        FreePriceAlerts.console.log(' url => '+url);
        if ( FreePriceAlerts.config.read('confirm_search') )
        {
            return confirm(FreePriceAlerts.debugHeader+
                "Would you like to do a search?\n\n"+
                (q?"Term:  "+q+"\n":"")+
                (price?"Price:   "+price+"\n\n":"")+
                ""+url);
        }

        return true;
    }

    var listenerAdded = false;

    var runParser = function( pod )
    {
        var evalParser = function( pod )
        {
            timingLog.add('pe', 'pdlExecuteStart');
            FreePriceAlerts.console.logContext('pdl', 'Controller.runParser.evalParser');

            var priceField = pod.getFieldsByName('price')[0];
            var queryField = pod.getFieldsByName('raw-query')[0];

            if ( !priceField || !queryField )
            {
                if( FreePriceAlerts.config.read('debug') ) alert('Price and/or query fields not found in pod');
                return;
            }

            var price = parseFloat(priceField.valueOf( win ));
            var query = queryField.valueOf( win );

            if ( price && query )
            {
                self.search( query, price );
            }
            else if ( !listenerAdded )
            {
                listenerAdded = true;
                FreePriceAlerts.console.logContext('pdl', 'Controller.runParser.evalParser: No match, adding listeners and showing Coupon view.');

                self.triggerEvent( new Controller.ProductMatchFailedEvent() );

                var tmp = function() { evalParser( pod ); };
                priceField.addEventListener('FieldChanged',tmp);
                queryField.addEventListener('FieldChanged',tmp);
            }
            else
            {
                FreePriceAlerts.console.logContext('pdl', 'Controller.runParser.evalParser: No match, showing Coupon view.');
                self.triggerEvent( new Controller.ProductMatchFailedEvent() );
            }
        };

        pod.addEventListener( 'PodReady', function() {
            if (jq.isReady)
            {
                evalParser( pod );
            }
            else
            {
                jq(doc).ready(function() {
                    evalParser( pod );
                });
            }
        } );
    }

    this.executeParser = function( site )
    {
        this.parserUsed = site;

        var lg = function(status) { FreePriceAlerts.console.logContext('pdl', "Executing parsers\nPod:    "+site+"\nURI:    "+win.location.href+"\nStatus: "+status); };

        if ( self.pods[site] )
        {
            lg("cached");
            runParser( new FreePriceAlerts.processing.Pod( self.pods[site], FreePriceAlerts.config.read("api.podPath") ) );
        }
        else
        {
            var uri = FreePriceAlerts.config.read('api.podPath')+site+'.xml';
            lg('loading from '+uri);

            var req = new FreePriceAlerts.api.GetRequest(uri);

            timingLog.add('pr', 'pdlRequestStart');
            req.addEventListener(FreePriceAlerts.api.Request.SUCCESS, function( evt ) {
                timingLog.add('pR', 'pdlRequestEnd');
                self.pods[site] = evt.data;
                runParser(new FreePriceAlerts.processing.Pod( evt.data, FreePriceAlerts.config.read('api.podPath') ));
            });

            req.send();
        }
    }

    this.showCouponView = function()
    {
        self.queryUsed = null;
        timingLog.add('I', 'injectIframe');
        FreePriceAlerts.console.logContext('Controller', "Controller.showCouponView");

        var url = buildOffersUrl();

        if (!askShouldDoSearch(url)) return;

        self.getIFrame(url);
    }

    this.getIFrame = function(url)
    {
        if ( this.view ) {
            this.view.setUrl(url);
        } else {
            this.view = new FreePriceAlerts.toolbars.fpa.IFrame(url,doc,this);

            if ( window.MutationObserver !== undefined ) {
                var observer = new MutationObserver(function(mutations) {
                    var styleChanged = false;

                    mutations.some(function(mutation) {
                        if ( mutation.attributeName == "style" ) {
                            styleChanged = true;
                            return true;
                        }
                    });

                    if ( styleChanged ) {
                        var data = { 'name' : 'cssText', 'value' : self.view.rootNode.style.cssText };
                        document.documentElement.removeAttribute('fpa:style');
                        chrome.extension.sendMessage({ type: 'iframeStyleChanged', style: data });
                    }
                });

                var mutationConfig = { attributes: true };
                observer.observe(this.view.rootNode, mutationConfig);
            }
        }
    }

    this.viewNode = function()
    {
        if (self.view) {
            console.log('###### Controller.viewNode: ',( $('#fpa_iframe')[0] === self.view.rootNode ));
            return self.view.rootNode;
        }
        return null;
    }

    // This is very noisy.
    FreePriceAlerts.console.logContext('Controller', "Initialized controller for: "+win.location.href);

};

Controller.ProductMatchFailedEvent = function() {
    this.superclass = FreePriceAlerts.events.Event;
    this.superclass('ProductMatchFailed');
};


FreePriceAlerts.toolbars.fpa.IFrame = function( url, doc, controller )
{
    var self = this;
    if ( doc === undefined ) doc = document;

    var jq = FreePriceAlerts.libs.jQuery;

    this.url = url;
    this.rootNode = null;
    this.document = null;
    this.iframeId = 'fpa_iframe';

    var initialize = function()
    {
        self.rootNode = self.getViewDom();
        self.rootNode.style.display = 'none';

        FreePriceAlerts.utils.doUntil(append, 1000, 10);
    }

    var append = function()
    {
        if (!doc.body) { return false; }

        FreePriceAlerts.console.logContext('page', 'Inserting iframe at `'+self.url+'`');
        doc.body.appendChild(self.rootNode);
        return true;
    }

    this.getViewDom = function()
    {
        var iframe = doc.createElement('iframe');
        iframe.setAttribute('id',self.iframeId);
        iframe.setAttribute('src',self.url);
        return iframe;
    }

    this.remove = function()
    {
        if (self.rootNode)
        {
            self.rootNode.remove();
            self.rootNode = null;
        }
    }

    this.setUrl = function(url)
    {
        if (!self.rootNode) return;
        self.url = url;
        self.rootNode.setAttribute('src',url);
    }

    initialize();
};


})();
