
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
Handlebars["templates"] = Handlebars["templates"] || {};
Handlebars["templates"]["serp"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div data-window=\"new\" data-serplink=\""
    + alias4(((helper = (helper = helpers.Url || (depth0 != null ? depth0.Url : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"Url","hash":{},"data":data}) : helper)))
    + "\" class=\"get-paid-to_serp-injection-google get-paid-to-notification_flex-center-vertical\"><span>Get <b>"
    + alias4(((helper = (helper = helpers.Reward || (depth0 != null ? depth0.Reward : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"Reward","hash":{},"data":data}) : helper)))
    + "</b> on your purchase via <b>GetPaidTo.com</b></span></div>";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.IS_GOOGLE : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"useData":true});
Handlebars["templates"]["slider"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {});

  return "<div class=\"get-paid-to-notification_loggedin-content get-paid-to-notification_flex-center\"><div class=\"get-paid-to-notification_retailer-view\"><div class=\"get-paid-to-notification_retailer-view_info-block\"><div class=\"get-paid-to-notification_retailer-view_logo get-paid-to-notification_flex-center\"><img class=\"get-paid-to-notification_retailer-view_logo\" src=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.currentMerchant : depth0)) != null ? stack1.Logo : stack1), depth0))
    + "\"></div><div class=\"get-paid-to-notification_retailer-view_info get-paid-to-notification_flex-center-vertical\"><div class=\"get-paid-to-notification_retailer-view_info-title\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.currentMerchant : depth0)) != null ? stack1.Reward : stack1), depth0))
    + "</div><div class=\"get-paid-to-notification_retailer-view_info-offers\">"
    + ((stack1 = helpers["if"].call(alias3,((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.currentMerchant : depth0)) != null ? stack1.Offers : stack1)) != null ? stack1["0"] : stack1)) != null ? stack1.OfferId : stack1),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div></div></div>"
    + ((stack1 = helpers["if"].call(alias3,((stack1 = (depth0 != null ? depth0.currentMerchant : depth0)) != null ? stack1.isActivated : stack1),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.program(7, data, 0),"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias3,((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.currentMerchant : depth0)) != null ? stack1.Offers : stack1)) != null ? stack1["0"] : stack1)) != null ? stack1.OfferId : stack1),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div></div>";
},"2":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "plus "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.currentMerchant : depth0)) != null ? stack1.Offers : stack1)) != null ? stack1.length : stack1), depth0))
    + " code"
    + ((stack1 = (helpers.compare || (depth0 && depth0.compare) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.currentMerchant : depth0)) != null ? stack1.Offers : stack1)) != null ? stack1.length : stack1),1,{"name":"compare","hash":{"operator":">"},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " available";
},"3":function(container,depth0,helpers,partials,data) {
    return "s";
},"5":function(container,depth0,helpers,partials,data) {
    return "<div class=\"get-paid-to-notification_btn-light_green get-paid-to-notification_btn-activate-cashback\"><div class=\"get-paid-to-notification_tick\"></div>Cashback Activated</div>";
},"7":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"get-paid-to-notification_btn get-paid-to-notification_btn-blue get-paid-to-notification_btn-get-cashback get-paid-to-notification_flex-center\" data-url=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.currentMerchant : depth0)) != null ? stack1.Url : stack1), depth0))
    + "\">GET CASHBACK</div>";
},"9":function(container,depth0,helpers,partials,data) {
    var stack1;

  return " "
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.currentMerchant : depth0)) != null ? stack1.Offers : stack1),{"name":"each","hash":{},"fn":container.program(10, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " ";
},"10":function(container,depth0,helpers,partials,data) {
    var stack1;

  return " "
    + ((stack1 = (helpers.if_all || (depth0 && depth0.if_all) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.getTheCode : depth0),(depth0 != null ? depth0.VoucherCode : depth0),{"name":"if_all","hash":{},"fn":container.program(11, data, 0),"inverse":container.program(13, data, 0),"data":data})) != null ? stack1 : "")
    + " ";
},"11":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "<div class=\"get-paid-to-notification_retailer-view_offer-with-code get-paid-to-notification_flex-center\"><div class=\"get-paid-to-notification_retailer-view_offer-info_and-code get-paid-to-notification_flex-center\"><div><div class=\"get-paid-to-notification_retailer-view_offer-title\">"
    + alias2(alias1((depth0 != null ? depth0.Name : depth0), depth0))
    + "</div><div class=\"get-paid-to-notification_retailer-view_offer-description\">"
    + alias2(alias1((depth0 != null ? depth0.Description : depth0), depth0))
    + "</div><div class=\"get-paid-to-notification_retailer-view_offer-code get-paid-to-notification_flex-center\">"
    + alias2(alias1((depth0 != null ? depth0.VoucherCode : depth0), depth0))
    + "</div></div></div><div class=\"get-paid-to-notification_btn-copy-code get-paid-to-notification_flex-center\">COPY THE CODE <span class=\"get-paid-to-notification_copy_text\">"
    + alias2(alias1((depth0 != null ? depth0.VoucherCode : depth0), depth0))
    + "</span></div></div>";
},"13":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {});

  return "<div class=\"get-paid-to-notification_retailer-view_offer get-paid-to-notification_flex-center\"><div class=\"get-paid-to-notification_retailer-view_offer-info get-paid-to-notification_flex-center\"><div><div class=\"get-paid-to-notification_retailer-view_offer-title\">"
    + alias2(alias1((depth0 != null ? depth0.Name : depth0), depth0))
    + "</div><div class=\"get-paid-to-notification_retailer-view_offer-description\">"
    + alias2(alias1((depth0 != null ? depth0.Description : depth0), depth0))
    + "</div>"
    + ((stack1 = helpers["if"].call(alias3,(depth0 != null ? depth0.Expiry : depth0),{"name":"if","hash":{},"fn":container.program(14, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div></div>"
    + ((stack1 = helpers["if"].call(alias3,(depth0 != null ? depth0.getTheCode : depth0),{"name":"if","hash":{},"fn":container.program(16, data, 0),"inverse":container.program(18, data, 0),"data":data})) != null ? stack1 : "")
    + "</div>";
},"14":function(container,depth0,helpers,partials,data) {
    return "<div class=\"get-paid-to-notification_retailer-view_offer-expires\"><div class=\"get-paid-to-notification_expires-clock\"></div>Expires in "
    + container.escapeExpression(container.lambda((depth0 != null ? depth0.ExpiryDays : depth0), depth0))
    + " days</div>";
},"16":function(container,depth0,helpers,partials,data) {
    var helper, alias1=container.escapeExpression, alias2=container.lambda;

  return "<div class=\"get-paid-to-notification_btn-got-code get-paid-to-notification_flex-center\" data-id=\""
    + alias1(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"index","hash":{},"data":data}) : helper)))
    + "\" data-url=\""
    + alias1(alias2((depth0 != null ? depth0.Url : depth0), depth0))
    + "\" id=\""
    + alias1(alias2((depth0 != null ? depth0.OfferId : depth0), depth0))
    + "\">OFFER ACTIVATED</div>";
},"18":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.escapeExpression, alias3=container.lambda;

  return "<div class=\"get-paid-to-notification_btn-get-code get-paid-to-notification_flex-center\" data-id=\""
    + alias2(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" data-url=\""
    + alias2(alias3((depth0 != null ? depth0.Url : depth0), depth0))
    + "\" id=\""
    + alias2(alias3((depth0 != null ? depth0.OfferId : depth0), depth0))
    + "\">"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.VoucherCode : depth0),{"name":"if","hash":{},"fn":container.program(19, data, 0),"inverse":container.program(21, data, 0),"data":data})) != null ? stack1 : "")
    + "</div>";
},"19":function(container,depth0,helpers,partials,data) {
    return "GET THE CODE";
},"21":function(container,depth0,helpers,partials,data) {
    return "GET OFFER";
},"23":function(container,depth0,helpers,partials,data) {
    return "<div class=\"get-paid-to-notification_not-loggedin-content get-paid-to-notification_flex-center\"><div class=\"get-paid-to-notification_text-login\">Please login to your GetPaidTo account to get access to all latest cashback and earning offers.</div><div class=\"get-paid-to-notification_btn get-paid-to-notification_btn-blue get-paid-to-notification_btn-login get-paid-to-notification_flex-center\" id=\"gpt-login-to-ext-slider\">LOGIN NOW</div></div>";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"get-paid-to-notification_slider-body-loggedin\"><div class=\"get-paid-to-notification_slider-header\"><div class=\"get-paid-to-notification_close-slider-btn\" id=\"gpt-close-slider\"></div></div>"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.user : depth0)) != null ? stack1.Username : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(23, data, 0),"data":data})) != null ? stack1 : "")
    + "</div>";
},"useData":true});