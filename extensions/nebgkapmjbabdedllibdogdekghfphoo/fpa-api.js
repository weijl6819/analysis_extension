
(function(){

if (!document.documentElement.getAttribute("fpa:data")) { return; }

window.freePriceAlerts = new (function(){

    var newEvent = function(name) {
        var evt = document.createEvent('Event');
        evt.initEvent(name, true, true);
        return evt;
    };

    var data = JSON.parse( document.documentElement.getAttribute("fpa:data") );

    document.documentElement.removeAttribute("fpa:data");

    data = data || {};

    var con = window.console;
    var log = function() {
        if (!data.debug) return;
        if (con && typeof con.log === 'function')
            con.log.apply(con, arguments);
    };

    this.getVersion = function() { return data.version; };
    this.getDistributionPartner = function() { return data.distributionPartner; };

    if ( data.debug ) {
        this.loadPodIntoMemory = function( podXml ) {
            log('<< FPA-API: loadPodIntoMemory');
            podXml = JSON.stringify(podXml);
            document.documentElement.setAttribute('fpa:podXml', podXml)
            document.documentElement.dispatchEvent(newEvent('loadPodIntoMemory'));
        };

        this.runPodFromMemory = function( uri ) {
            log('<< FPA-API: runPodFromMemory '+JSON.stringify(arguments));
            uri = JSON.stringify(uri);
            document.documentElement.setAttribute('fpa:podUri', uri)
            document.documentElement.dispatchEvent(newEvent('runPodFromMemory'));
        };
    }

    if ( data.advancedSettings ) {
        this.advancedSettings = function() {
            log('<< FPA-API: advancedSettings');
            document.documentElement.setAttribute('fpa:eventtype', 'advsettings-'+data.eventKey)
            document.documentElement.dispatchEvent(newEvent('fpaEvent'));
        };
    }

    if ( data.isApi ) {

        var callbackAdded = false;

        this.setIframeStyle = function(style) {
            log('<< FPA-API: setIframeStyle '+JSON.stringify(arguments));
            document.documentElement.setAttribute('fpa:style', JSON.stringify(style))
            document.documentElement.dispatchEvent(newEvent('fpaSetIframeStyle'));
        };

        var iframeStyleCallback = null;
        this.setIframeStyleCallback = function( callback ) {
            log('<< FPA-API: setIframeStyleCallback');
            iframeStyleCallback = callback;

            if ( !callbackAdded ) {
                document.documentElement.addEventListener('fpaIframeStyleChangeEvent',function(e) {
                    if ( !iframeStyleCallback ) return;

                    var field = document.documentElement.getAttribute('fpa:iframe-style-field');
                    document.documentElement.removeAttribute('fpa:iframe-style-field');

                    var value = document.documentElement.getAttribute('fpa:iframe-style-value');
                    document.documentElement.removeAttribute('fpa:iframe-style-value');

                    iframeStyleCallback(field,value);
                });

                callbackAdded = true;
            }
        };

        this.setDistributionPartner = function( ptnr ) {
            log('<< FPA-API: setDistributionPartner '+JSON.stringify(arguments));
            data.distributionPartner = ptnr;
            document.documentElement.setAttribute('fpa:distribution-partner', ptnr);
            document.documentElement.dispatchEvent(newEvent('fpaDistributionPartner'));
        };

        this.addCouponAlert = function( pattern, code, data ) {
            log('<< FPA-API addCouponAlert '+JSON.stringify(arguments));
            var d = JSON.stringify({pattern:pattern,code:code,data:data});
            document.documentElement.setAttribute('fpa:coupon-alert', d);
            document.documentElement.dispatchEvent(newEvent('fpaCouponAlert'));
        };

    }

    setTimeout( function(){
        log('<< FPA-API: fpaApiReady'+( window === window.top ? ' (top)' : '' ));
        document.documentElement.dispatchEvent(newEvent('fpaApiReady'));
    },1);

})();

})();
