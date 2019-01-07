
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

window.FreePriceAlerts = window.FreePriceAlerts || {};
window.FreePriceAlerts.core = new (function(){
    "use strict";

    var self = this;
    var FreePriceAlerts = window.FreePriceAlerts;
    FreePriceAlerts.version = null;
    var l  = function() { FreePriceAlerts.console.log.apply(FreePriceAlerts.console, arguments); };
    var lc = function() { FreePriceAlerts.console.logContext.apply(FreePriceAlerts.console, arguments); };

    var $ = FreePriceAlerts.libs.jQuery;
    var _ = FreePriceAlerts.libs.underscore;
    var uuid = FreePriceAlerts.libs.uuid;
    var base64_encode = FreePriceAlerts.libs.base64_encode;

    /// Number to show welcome if their "lastKnownVersion" is less than this value.
    this.showWelcomeBefore = 3;

    this.useZiftrOnOrAfter = 3.1;

    var is_number = function(o) { return !isNaN(parseFloat(o)) && isFinite(o); };

    /// Get or set configuration stored in browser.
    var browserConfig = function(name, opt_value) {
        if (opt_value === undefined) {
            return FreePriceAlerts.browser.readPref(name);
        }
        else {
            return FreePriceAlerts.browser.writePref(name, opt_value);
        }
    };

    /// Get or set configuration stored in a locally-stored array.
    var localConfig = function() { return FreePriceAlerts.config.apply(FreePriceAlerts.config, arguments); };

    /// Reads the config from the browser and writes it to the local config.
    /// If the browser config is undefined, the default value is written.
    var loadConfig = function( name, defaultValue ) {
        var browserValue = browserConfig(name);
        if ( browserValue === undefined ) {
            localConfig(name, defaultValue);
        }
        else {
            localConfig(name, browserValue);
        }
    };

    var beforeSend = function(xhr) {
        if ( FreePriceAlerts.version )
            xhr.setRequestHeader("X-FPA-Toolbar-Version", FreePriceAlerts.version);

        var ptnr = localConfig('distributionPartner');
        if ( ptnr !== undefined && ptnr && ptnr != "" )
            xhr.setRequestHeader("X-FPA-Partner", ptnr);

        var uid = localConfig('uid');
        if ( uid !== undefined && uid && uid != "" )
            xhr.setRequestHeader("X-FPA-UID", uid);
    };

    var makeUid = function() {
        var buffer = [];
        uuid.v4({}, buffer);
        var encoded = base64_encode(String.fromCharCode.apply(null,buffer));
        encoded = encoded.replace( /=/g  , ''  );
        encoded = encoded.replace( /\+/g , '-' );
        encoded = encoded.replace( /\//g , '_' );
        return encoded;
    };

    var initUid = function() {

        var thisUid = browserConfig('uid');
        if (thisUid === undefined) {
            thisUid = makeUid();
            browserConfig('uid', thisUid);
            localConfig('uid', thisUid);
            lc('uid', 'uid '+thisUid+' (new)');
        }
        else {
            localConfig('uid', thisUid);
            lc('uid', 'uid '+thisUid);
        }

    };

    var getVersionFloat = function() {
        try {
            return parseFloat(localConfig('version'));
        }
        catch(ex){
            return undefined;
        }
    };

    var setPodPath = function() {
        localConfig('api.podPath', 'http://'+FreePriceAlerts.config.api_host()+'/product_sites/toolbar_parser/');
    };

    var showWelcome = function() {
        var v, oldv=NaN;

        try {
            v    = parseFloat(browserConfig('lastKnownVersion'));
            oldv = parseFloat(browserConfig('firstKnownVersion'));

            if ( isNaN(oldv) ) {
                browserConfig('firstKnownVersion', ( isNaN(v) ? FreePriceAlerts.version.toString() : v.toString() ));
            }

            if ( isNaN(v) || v < FreePriceAlerts.version ) {
                throw "Older Version";
            }
        }
        catch ( e )
        {
            var url = 'http://'+FreePriceAlerts.config.fe_host()+'/congratulations/?'
            var first = true;
            self.getCommonUrlParams(function(k,v){
                if (first) { first = false; }
                else { url += '&'; }
                url += k+'='+v;
            });
            url += ( !isNaN(v) && v ? '&upgrade_from='+v : '');

            if ( isNaN(v) || !v || v < self.showWelcomeBefore ) {
                FreePriceAlerts.browser.newTab(url);
            } else {
                var req = new FreePriceAlerts.api.GetRequest(url + '&silent');
                req.send();
            }

            browserConfig('lastKnownVersion', FreePriceAlerts.version.toString());
        }
    };

    this.initializeBackground = function() {

        $.ajaxSetup({ beforeSend : function(xhr){beforeSend(xhr);} });

        // Add custom logger to the logging library
        FreePriceAlerts.console.customLogFn = function() {
            var str = 'FPA: ';
            for ( var i=0; i < arguments.length; i++ ) {
                str += arguments[i].toString()+' ';
            }

            FreePriceAlerts.browser.log(str);
        };

        initUid();

        var ptnr = localConfig('distributionPartner');
        if ( ptnr === undefined ) { ptnr = ''; }

        localConfig('logContexts', JSON.parse(browserConfig('logContexts') || '[]') || [] );
        loadConfig('distributionPartner', ptnr);
        loadConfig('debug', localConfig('debug'));
        loadConfig('confirm_search', localConfig('confirm_search'));
        loadConfig('avoid_hash_in_tests', false);

        // Store the distribution partner in settings so it survives an upgrade
        browserConfig('distributionPartner', localConfig('distributionPartner'));

        //FreePriceAlerts.browser.getExtensionVersion(self.onGetVersion);
    };

    this.initializeForeground = function() {};

    /// Called when the current version of this extension is read.
    this.onGetVersion = function(installedVersion) {
        lc('init', 'FreePriceAlerts.core.onGetVersion');

        FreePriceAlerts.version = parseFloat(installedVersion);

        loadConfig('lastKnownVersion', FreePriceAlerts.version);
        loadConfig('firstKnownVersion', localConfig('lastKnownVersion'));

        var fnv = NaN, lnv = NaN;

        try {
            lnv = parseFloat(localConfig('lastKnownVersion'));
            fnv = parseFloat(localConfig('firstKnownVersion'));
        } catch ( e ) { }

        var useZiftr = ( isNaN(lnv)
            || ( isNaN(fnv) && lnv >= self.useZiftrOnOrAfter)
            || (!isNaN(fnv) && fnv >= self.useZiftrOnOrAfter) );

        loadConfig("api.host",	useZiftr ? "api.ziftr.com" : "api.freepricealerts.com");
        loadConfig("fe.host",	useZiftr ? "www.ziftr.com" : "www.freepricealerts.com");
        localConfig('version', FreePriceAlerts.version.toFixed(2));

        setPodPath();

        showWelcome();

        FreePriceAlerts.console.log(
          "Loaded extension with configuration:\n"+
          "Version  = "+FreePriceAlerts.version+"\n"+
          "api.host = "+localConfig('api.host')+"\n"+
          "fe.host  = "+localConfig('fe.host')
        );

    };

    this.onBrowserConfigChanged = function(name, value) {

        var lc = function(name, value) {
            FreePriceAlerts.console.log(
                "Changed configuration:\n"+
                name+" = "+value );
        };

        if (localConfig(name) === value) { return; }
        if (value === undefined) { value = browserConfig(name); }
        if (value === undefined) { return; }

        switch(name)
        {
        case 'api.host':
            localConfig(name, value);
			setPodPath();
            lc(name, value);
            break;

        case 'fe.host':
        case 'distributionPartner':
        case 'debug':
        case 'confirm_search':
        case 'avoid_hash_in_tests':
        // case 'uid': // We don't allow the user to set this.
            localConfig(name, value);
            lc(name, value);
            break;
        }

    };

    this.dispose = function() {};

    /**
     *  Calls the callback once for each query string parameter to append to a url.
     *  @param  on_param  function(key, value)
     *  @param  key  The name of the query string parameter.
     *  @param  value  The value of the query string parameter, already encoded for the URL.
     */
    this.getCommonUrlParams = function(on_param) {

        if ( localConfig('distributionPartner') )
            on_param('_ptnr', encodeURIComponent(localConfig('distributionPartner')));

        if ( getVersionFloat() )
            on_param('v', getVersionFloat().toFixed(2));

        if ( localConfig('uid') )
            on_param('uid', encodeURIComponent(localConfig('uid')));

    };

    /**
     *  Generates the _lt query string parameter and calls the callback if successful.
     *  @param  win  A window object to gather timing from.
     *  @param  c  A FreePriceAlerts.toolbars.fpa.Controller object to gather timing from.
     *  @param  on_param  function(key, value)
     *  @param  key  The name of the query string parameter.
     *  @param  value  The value of the query string parameter, already encoded for the URL.
     */
    this.getLtUrlParam = function(win, on_param) {

        var lt = '';
        var last = null;
        var append = function(name, end) {
            if (end) {
                lt += name+( last === null ? '0' : (end - last) );
                last = end;
            }
        };

        if (win
        &&  win.performance
        &&  win.performance.timing) {

            var t = win.performance.timing;

            append('n', t.navigationStart);
            append('rd',t.redirectStart);
            append('Rd',t.redirectEnd);
            append('f', t.fetchStart);
            append('d', t.domainLookupStart);
            append('D', t.domainLookupEnd);
            append('c', t.connectStart);
            append('s', t.secureConnectionStart);
            append('C', t.connectEnd);
            append('q', t.requestStart);
            append('r', t.responseStart);
            append('u', t.unloadEventStart);
            append('U', t.unloadEventEnd);
            append('R', t.responseEnd);
            append('m', t.domLoading);
            append('i', t.domInteractive);
            append('x', t.domContentLoadedEventStart);
            append('X', t.domContentLoadedEventEnd);
            append('M', t.domComplete);
            append('l', t.loadEventStart);
            append('L', t.loadEventEnd);
        }

        FreePriceAlerts.TimingLog.getInstance().each(function(entry){ append(entry.key, entry.time) });

        if (lt) {
            FreePriceAlerts.console.log('_lt = '+( lt.replace(/([a-zA-Z]+)/g, ' $1 ') ));
            on_param('_lt', lt);
        }
    };

})();

