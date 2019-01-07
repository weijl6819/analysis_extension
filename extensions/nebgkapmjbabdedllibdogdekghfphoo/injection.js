
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
// Foreground

(function(win){
	"use strict";

    var FreePriceAlerts = win.FreePriceAlerts = win.FreePriceAlerts || {};
    var doc = win.document;
    FreePriceAlerts.core.initializeForeground(win);
    var $ = FreePriceAlerts.libs.jQuery;
    var _ = FreePriceAlerts.libs.underscore;
    var timingLog = FreePriceAlerts.TimingLog.getInstance();

	var p = document.location.protocol.toLowerCase();
	var isHTTP  = (0 === p.indexOf('http:' ));
	var isHTTPS = (0 === p.indexOf('https:'));
	var isFILE  = (0 === p.indexOf('file:' ));
	var isTopWindow = (window.top === window);
	var isApi = null;
	var eventKey = (Math.random()*1000000).toString(16).replace('.','-');
	var controller = null;

    FreePriceAlerts.browser = new FreePriceAlerts.browsers.Chrome();
    FreePriceAlerts.config.customReadFn  = FreePriceAlerts.browser.readPref;
    FreePriceAlerts.config.customWriteFn = FreePriceAlerts.browser.writePref;

	// Add custom logger to the logging library
	var sw = new FreePriceAlerts.utils.Stopwatch.fromNavigationStart()
	FreePriceAlerts.console.customLogFn = function(var_args)
	{
		var str = 'FPA '+sw.toString()+': ';
		for ( var i=0; i<arguments.length; i++ )
			str += arguments[i].toString()+' ';

		console.log(str);
	};

	function initBeforeSend(config)
	{
		FreePriceAlerts.libs.jQuery.ajaxSetup({ beforeSend : function(xhr)
		{
			if ( config.version )
				xhr.setRequestHeader("X-FPA-Toolbar-Version", config.version);

			var ptnr = config.distributionPartner;
			if ( ptnr !== undefined && ptnr && ptnr != "" )
				xhr.setRequestHeader("X-FPA-Partner", ptnr);
		} });
	}

	function insertApi()
	{
        FreePriceAlerts.utils.doUntil(function(){
            if (!document.head)
                return false;

            var options = FreePriceAlerts.config.readAll();
            options.isApi = !!isApi;
            options = JSON.stringify(options);
            document.documentElement.setAttribute('fpa:data',options);

            var js = document.createElement('script');
            js.setAttribute('type', 'text/javascript');
            js.setAttribute('src', chrome.extension.getURL('fpa-api.js'));
            js.setAttribute('name', 'fpa-api');
            document.head.appendChild(js);
            FreePriceAlerts.console.logContext('page', 'Inserted fpa-api.js');
            return true;
        }, 1000, 5);
	}

	function setStyle( view, styleProps )
	{
		if (!view || !view.style || !styleProps) return;

		for(var name in styleProps)
		{
			if (!styleProps.hasOwnProperty(name))
				continue;

			FreePriceAlerts.console.logContext('verbose', 'setting `'+name+'` to `'+styleProps[name]+'`');
			view.style[name] = styleProps[name];
		}
	};

	function addListeners()
	{
		if (isApi) addApiListeners();

		document.documentElement.addEventListener('fpaEvent',function(e) {
            FreePriceAlerts.console.logContext('page_message', 'document event >>  '+( isTopWindow ? '(top)' : '(iframe)' )+' `fpaEvent`');
            var type = document.documentElement.getAttribute('fpa:eventtype');
            document.documentElement.removeAttribute('fpa:eventtype');
            chrome.runtime.sendMessage({ type: 'showAdvancedSettings' });
		});

		function logEvent(name) {
			document.documentElement.addEventListener(name, function(e) {
				FreePriceAlerts.console.logContext('page_message','>> `'+name+'`');
			});
		}
		logEvent('fpaApiReady');
		logEvent('fpaOffersReady');
	}

	function apiGetStyleCallback(e) {
		chrome.extension.sendMessage({ type: 'getIframeStyle' }, apiGetStyleCallback);

		document.documentElement.setAttribute('fpa:iframe-style-field',e.style.name);
		document.documentElement.setAttribute('fpa:iframe-style-value',e.style.value);

		var evt = document.createEvent('Event');
		evt.initEvent('fpaIframeStyleChangeEvent', true, true);
        setTimeout(function(){document.documentElement.dispatchEvent(evt);},1);
	}

	function addApiListeners()
	{
		document.documentElement.addEventListener('fpaSetIframeStyle', function(e) {
            FreePriceAlerts.console.logContext('page_message', 'document event >>  '+( isTopWindow ? '(top)' : '(iframe)' )+' `fpaSetIframeStyle`');
			var data = JSON.parse( document.documentElement.getAttribute('fpa:style') );
			document.documentElement.removeAttribute('fpa:style');
			chrome.extension.sendMessage({ type: 'setIframeStyle', style: data });
		});

		document.documentElement.addEventListener('fpaDistributionPartner', function(e) {
            FreePriceAlerts.console.logContext('page_message', 'document event >>  '+( isTopWindow ? '(top)' : '(iframe)' )+' `fpaDistributionPartner`');
			var data = document.documentElement.getAttribute('fpa:distribution-partner');
			document.documentElement.removeAttribute('fpa:distribution-partner');
			chrome.extension.sendMessage({ type: 'setDistributionPartner', partner: data });
		});

		document.documentElement.addEventListener('fpaCouponAlert', function(e) {
            FreePriceAlerts.console.logContext('page_message', 'document event >>  '+( isTopWindow ? '(top)' : '(iframe)' )+' `fpaCouponAlert`');
			var data = JSON.parse( document.documentElement.getAttribute('fpa:coupon-alert') );
			document.documentElement.removeAttribute('fpa:coupon-alert');
			chrome.extension.sendMessage({ type: 'addCouponAlert', coupon : data });
		});

		document.documentElement.addEventListener('loadPodIntoMemory', function(e) {
            FreePriceAlerts.console.logContext('page_message', 'document event >>  '+( isTopWindow ? '(top)' : '(iframe)' )+' `loadPodIntoMemory`');
			var podXml = JSON.parse( document.documentElement.getAttribute('fpa:podXml') );
			document.documentElement.removeAttribute('fpa:podXml');

            try {
                // Validate the POD
                var pod = new FreePriceAlerts.processing.Pod( podXml, FreePriceAlerts.config.read("api.podPath") );
                pod.validatePod();

                var key = FreePriceAlerts.utils.makeInMemoryPodKey();
                FreePriceAlerts.toolbars.fpa.sitesList.setInMemoryPod(podXml, key);
                chrome.extension.sendMessage({ type: 'loadPodIntoMemory', podXml : podXml, key : key });
            } catch(empty){}
		});

		document.documentElement.addEventListener('runPodFromMemory', function(e) {
            FreePriceAlerts.console.logContext('page_message', 'document event >>  '+( isTopWindow ? '(top)' : '(iframe)' )+' `runPodFromMemory`');
			var uri = JSON.parse( document.documentElement.getAttribute('fpa:podUri') );
			document.documentElement.removeAttribute('fpa:podUri');

			chrome.extension.sendMessage({ type: 'runPodFromMemory', podUri : uri, key : FreePriceAlerts.toolbars.fpa.sitesList.inMemoryKey });
		});

		chrome.extension.sendMessage({ type: 'getIframeStyle' }, apiGetStyleCallback);
	}

	if ( !isHTTP && !isHTTPS && !isFILE ) return;

	var fpaAttributes = FreePriceAlerts.utils.getFpaAttributes(document.documentElement);
	// if (fpaAttributes) chrome.extension.sendRequest({ type: 'foundFpaAttributes', attributes: fpaAttributes });

    timingLog.add('fl', 'fpaOnPageLoadStart');
	chrome.runtime.sendMessage({
        type: 'onPageLoad',
        location: location,
        fpaAttributes: fpaAttributes,
        isTopWindow: isTopWindow,
    }, function(res) {
        try {

            res.config.eventKey = eventKey;
            FreePriceAlerts.config.writeAll(res.config);
            isApi = res.isApi;

            if (isTopWindow || isApi) FreePriceAlerts.console.logContext('message', 'onPageLoad >> '+JSON.stringify(res));

            timingLog.addLogs(res.timingLog);
            timingLog.add('fL', 'fpaOnPageLoadEnd');

            if (res.rawCouponSites) {
                FreePriceAlerts.toolbars.fpa.sitesList.rawCouponSites = res.rawCouponSites;
                FreePriceAlerts.toolbars.fpa.sitesList.initCouponSites();
            }

            if ( !isApi && !isTopWindow ) return;

            if (fpaAttributes['fpa:role'])
                FreePriceAlerts.config.foundRole(fpaAttributes['fpa:role']);

            initBeforeSend(res);
            addListeners();
            insertApi();

            if ( !isTopWindow ) return;

            switch(res.type) {
            case 'product':
                controller = new FreePriceAlerts.toolbars.fpa.Controller(win,doc);
                controller.setInMemoryPod(res.inMemoryPod, res.inMemoryKey);
                controller.addEventListener('ProductMatchFailed',function(){
                    if (isTopWindow || isApi) FreePriceAlerts.console.logContext('message', 'ProductMatchFailed >>');
                    chrome.runtime.sendMessage({
                        type: 'onProductMatchFailed',
                        location: location,
                        isTopWindow: isTopWindow,
                    }, function(res) {
                        if (isTopWindow || isApi) FreePriceAlerts.console.logContext('message', 'onProductMatchFailed >> '+JSON.stringify(res));
                        if (res.type == 'domain' || res.type == 'coupon') {
                            controller.showCouponView();
                        }
                    });
                });
                controller.executeParser( res.site );
                break;
            case 'domain':
                controller = new FreePriceAlerts.toolbars.fpa.Controller(win,doc);
                controller.setInMemoryPod(res.inMemoryPod, res.inMemoryKey);
                controller.showCouponView();
                break;
            case 'coupon':
                controller = new FreePriceAlerts.toolbars.fpa.Controller(win,doc);
                controller.setInMemoryPod(res.inMemoryPod, res.inMemoryKey);
                controller.showCouponView();
                break;
            //case 'none':
            //case 'api':
            }
        }
        catch(err) {
            FreePriceAlerts.console.log(
                'Unknown error when processing message: \n'
                +JSON.stringify(res)+'\n'
                +FreePriceAlerts.utils.ErrorToString(err));
        }
    });

    chrome.extension.onMessage.addListener(
        function(message, sender, sendResponse) {
            if ( message.type == 'setIframeStyle' )
            {
                if (!isTopWindow) return false;
                FreePriceAlerts.console.logContext('message','>> `'+message.type+'`  style:', JSON.stringify(message.style));
                setStyle(controller.viewNode(), message.style);
                sendResponse({});
            }
            else {
                FreePriceAlerts.console.logContext('message', '>> onMessage '+( isTopWindow ? '(top)' : '(iframe)' )+' `'+message.type+'` ('+JSON.stringify(message)+')');
                return false;
            }
        }
    );

})(window);
