define(['lib/js/ajax'], function(ajax) {

    var defaultPayload = {
        v: '1'
    };

    if(window) {

        // Viewport size
        if(window.innerWidth && window.innerHeight)
            defaultPayload.vp = encodeURIComponent(window.innerWidth + 'x' + window.innerHeight);

        if(window.screen) {
            // Screen Resolution
            if(window.screen.width && window.screen.height)
                defaultPayload.sr = encodeURIComponent(window.screen.width + 'x' + window.screen.height);

            // Screen Colors
            if(window.screen.colorDepth)
                defaultPayload.sd = encodeURIComponent(window.screen.colorDepth + '-bits');
        }

        if(window.document) {
            // Document Encoding
            if(window.document.characterSet || window.document.inputEncoding || window.document.charset || window.document.defaultCharset)
                defaultPayload.de = encodeURIComponent(window.document.characterSet || window.document.inputEncoding || window.document.charset || window.document.defaultCharset);
        }

        if(window.navigator) {
            // User Language
            if(window.navigator.userLanguage || window.navigator.language)
                defaultPayload.ul = encodeURIComponent(window.navigator.userLanguage || window.navigator.language);

            // Java Enabled
            if(typeof window.navigator.javaEnabled === 'function')
                defaultPayload.je = encodeURIComponent(window.navigator.javaEnabled() ? 1 : 0);
        }
    }



    function buildQueryString(params) {
        var i, computed = {}, qs = [];

        // Copy default values
        for(i in defaultPayload)
            computed[i] = defaultPayload[i];

        // Extend with request values
        for(i in params)
            computed[i] = encodeURIComponent(params[i]);

        // Object to array
        for(i in computed)
            qs.push(i + '=' + computed[i]);

        return qs.join('&');
    }



    function Tracker(trackerUrl, siteId) {
        this._trackerUrl = trackerUrl;
        this._siteId     = siteId;
        this._cVars      = [];
    }

    Tracker.prototype.disableCookies = function() {};

    Tracker.prototype.deleteCookies = function() {};

    Tracker.prototype.setUserId = function(userId) {
        this._userId = userId;
    };

    Tracker.prototype.setCampaignNameKey = function(campaignName) {
        this._campaignName = typeof campaignName === 'string' ? campaignName : null;
    };

    Tracker.prototype.setDocumentTitle = function(documentTitle) {
        this._documentTitle = documentTitle;
    };

    Tracker.prototype.setCustomUrl = function(customUrl) {
        this._customUrl = this.customUrl;
    };

    Tracker.prototype.setCustomVariable = function(index, key, value) {
        this._cVars[index] = value;
    };

    Tracker.prototype.trackPageView = function(customTitle) {
        var i;
        var payload = {
            tid: this._siteId,
            cid: this._userId,
            t:'pageview',
        };

        // Campaign ID
        if(this._campaignName)
            payload.cn = this._campaignName;

        // Custom vars
        for(i = 1; i <= 5; ++i)
            if(typeof this._cVars[i] === 'string')
                payload['cd' + i] = this._cVars[i];

        // Document location URL
        payload.dl = this._customUrl ||
            (window && window.document && window.document.location && (window.document.location.origin + window.document.location.pathname + window.document.location.search)) ||
            'unknown';

        // Document Title
        if(customTitle || this._documentTitle || (window && window.document && window.document.title))
            payload.dt = customTitle || this._documentTitle || (window && window.document && window.document.title);


        ajax({
            method:  'POST',
            url:     this._trackerUrl,
            payload: buildQueryString(payload)
        });
    };

    Tracker.prototype.trackEvent = function(category, action, name, value) {
        var i;
        var payload = {
            tid: this._siteId,
            cid: this._userId,
            t: 'event',

            ec: category + '',
            ea: action + ''
        };

        // Campaign ID
        if(this._campaignName)
            payload.cn = this._campaignName;

        // Custom vars
        for(i = 1; i <= 5; ++i)
            if(typeof this._cVars[i] === 'string')
                payload['cd' + i] = this._cVars[i];

        if(name)
            payload.el = name + '';

        if(typeof value !== 'undefined')
            payload.ev = +value || 0;

        ajax({
            method:  'POST',
            url:     this._trackerUrl,
            payload: buildQueryString(payload)
        });
    };



    return {

        getTracker: function(trackerUrl, siteId) {
            return new Tracker(trackerUrl, siteId);
        }

    };

});
