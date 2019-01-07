
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

"use strict";
FreePriceAlerts.toolbars = FreePriceAlerts.toolbars || {};
FreePriceAlerts.toolbars.fpa = FreePriceAlerts.toolbars.fpa || {};


FreePriceAlerts.debugHeader = '==== FreePriceAlerts Extension Debug ====\n',


FreePriceAlerts.toolbars.fpa.Product = function()
{
	this.originalUrl = this.name = this.description = this.image_url = this.id = "";
	this.originalPrice = 0;
	this.offers = [];
	this.product_site = null;
	this.relevantOffers = [];

	this.getSavings = function()
	{
		if ( this.originalPrice <= 0 || this.offers.length == 0 ) return false;
		return this.originalPrice - this.offers[0].price;
	}

	this.getLowestPrice = function()
	{
		return this.getSavings() > 0 ? parseFloat(this.offers[0].price) : this.originalPrice;
	}
	
	this.getLowestPriceVendor = function()
	{
		return this.getSavings() > 0 ? this.offers[0].merchant.name : null;
	}
	
	this.getLowestPriceUrl = function()
	{
		return this.getSavings() > 0 ? this.offers[0].product_url : this.originalUrl;
	}
}

FreePriceAlerts.toolbars.fpa.ProductSite = function( name, product_pattern, domain_pattern )
{
	var self = this;
	this.name = name;

	if (typeof domain_pattern  != 'string') domain_pattern  = false;
	if (typeof product_pattern != 'string') product_pattern = false;
	var domain_regexp  = false;
	var product_regexp = false;

	try {
		self.domain_pattern  = domain_pattern;
		domain_regexp  = ( domain_pattern  ? FreePriceAlerts.utils.stringToRegexp(domain_pattern ) : false );
	} catch (e) {
		FreePriceAlerts.console.logContext('error', 'Invalid regular expression '
			+'for `'+name+'` in the domain pattern: `'+domain_pattern+'`');
		self.domain_pattern  = false;
	}

	try {
		self.product_pattern = product_pattern;
		product_regexp = ( product_pattern ? FreePriceAlerts.utils.stringToRegexp(product_pattern) : false );
	} catch (e) {
		FreePriceAlerts.console.logContext('error', 'Invalid regular expression '
			+'for `'+name+'` in the product pattern: `'+product_pattern+'`');
		self.product_pattern = false;
	}

	this.testDomain = function( url )
	{
		if (domain_regexp && domain_regexp.test(url))
			return this.name;
		return false;
	}

	this.testProduct = function( url )
	{
		if (product_regexp && product_regexp.test(url))
			return this.name;
		return false;
	}

	this.test = function( url )
	{
		return ( ( this.testDomain(url) || this.testProduct(url) )
			? this.name : false );
	}

	this.toString = function()
	{
		var m = name;
		m += '  domain: ' +( self.domain_pattern  ? '`'+self.domain_pattern +'`' : 'NULL' );
		m += '  product: '+( self.product_pattern ? '`'+self.product_pattern+'`' : 'NULL' );
		return m;
	}

}


FreePriceAlerts.toolbars.fpa.CouponSite = function( pattern, code, data )
{
	var self = this;
	this.code = code;
	this.data = data;
	var regexp;

	try {
		self.pattern  = pattern;
		regexp  = ( pattern  ? FreePriceAlerts.utils.stringToRegexp(pattern) : false );
		FreePriceAlerts.console.log('Coupon added');
	} catch (e) {
		FreePriceAlerts.console.log('Invalid regular expression '
			+'for `'+code+'` in the domain pattern: `'+pattern+'`');
		self.pattern  = false;
	}

	this.test = function( url )
	{
		if (regexp && regexp.test(url))
			return this;
		return false;
	}
}


FreePriceAlerts.toolbars.fpa.OffersReadyEvent = function( product ) {
	this.superclass = FreePriceAlerts.events.Event;
	this.superclass('OffersReady');
	this.product = product;
}


FreePriceAlerts.toolbars.fpa.SitesReadyEvent = function( controller ) {
	this.superclass = FreePriceAlerts.events.Event;
	this.superclass('SitesReady');
	this.controller = controller;
}

FreePriceAlerts.toolbars.fpa.StyleChangedEvent = function( controller ) {
	this.superclass = FreePriceAlerts.events.Event;
	this.superclass('StyleChanged');
	this.controller = controller;
}

FreePriceAlerts.processing.Filter.addGlobalFilter('price',function(win,str) {
	if( str = FreePriceAlerts.processing.Filter.convertToString(str) )
		return str.replace(/[^0-9.]/g,'');
	else
		return null;
});
 
