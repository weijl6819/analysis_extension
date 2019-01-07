Handlebars["templates"] = Handlebars["templates"] || {};
Handlebars["templates"]["game"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"btn daily-draw-claim flex-center\" data-href=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.gamesDraw : depth0)) != null ? stack1.ClaimUrl : stack1), depth0))
    + "\" data-event=\"GameDrawClaim\">CLAIM NOW</div>";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"btn daily-draw-claim flex-center\" data-href=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.gamesDraw : depth0)) != null ? stack1.ClaimUrl : stack1), depth0))
    + "\" data-event=\"GameDrawCheckResults\">ARE YOU A WINNER?</div>";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "<div class=\"daily-draw-background flex-center\"><div class=\"daily-draw-head flex-center\"><div class=\"daily-draw-img\"></div></div><div class=\"daily-draw-middle flex-center\"><div class=\"daily-draw-prizes_table\"></div><div class=\"daily-draw-points points_left flex-center\"><div class=\"points-text\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.gamesDraw : depth0)) != null ? stack1.Jackpot : stack1), depth0))
    + "</div></div><div class=\"daily-draw-points points_right flex-center\"><div class=\"points-text\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.gamesDraw : depth0)) != null ? stack1.Bonus : stack1), depth0))
    + "</div></div></div><div class=\"daily-draw-bottom flex-center\"><div class=\"daily-draw-todays_winner\">TODAY'S WINNER</div><div class=\"daily-draw-winner_name flex-center\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.gamesDraw : depth0)) != null ? stack1.Username : stack1), depth0))
    + "</div>"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.gamesDraw : depth0)) != null ? stack1.CanClaim : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "</div></div>";
},"useData":true});
Handlebars["templates"]["navigation"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "";
},"3":function(container,depth0,helpers,partials,data) {
    return "disabled";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"popup-footer\"><li><label for=\"carousel-1\" class=\"carousel-bullet\"><div class=\"navigation-tab "
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.Reward : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "\" id=\"retailer-tab\"></div></label></li><li><label for=\"carousel-2\" class=\"carousel-bullet\"><div class=\"navigation-tab\" id=\"search-tab\"></div></label></li><li><label for=\"carousel-3\" class=\"carousel-bullet\"><div class=\"navigation-tab\" id=\"survey-tab\"></div></label></li><li><label for=\"carousel-4\" class=\"carousel-bullet\"><div class=\"navigation-tab\" id=\"game-tab\"></div></label></li><li><label for=\"carousel-5\" class=\"carousel-bullet\"><div class=\"navigation-tab\" id=\"user-tab\"></div></label></li><div class=\"settings-button js-settings\"></div></div>";
},"useData":true});
Handlebars["templates"]["popup"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "<div class=\"loggedin-user carousel\"><div class=\"carousel-inner flex-center\"><input class=\"carousel-open\" type=\"radio\" id=\"carousel-1\" name=\"carousel\" aria-hidden=\"true\" hidden=\"\" checked=\"checked\"><div class=\"carousel-item\"><div class=\"retailer-tab flex-center-horizontal\" id=\"retailer-tab-view\"></div></div><input class=\"carousel-open\" type=\"radio\" id=\"carousel-2\" name=\"carousel\" aria-hidden=\"true\" hidden=\"\"><div class=\"carousel-item\"><div class=\"search-tab flex-center-horizontal\" id=\"search-tab-view\"></div></div><input class=\"carousel-open\" type=\"radio\" id=\"carousel-3\" name=\"carousel\" aria-hidden=\"true\" hidden=\"\"><div class=\"carousel-item\"><div class=\"surveys-tab flex-center-horizontal\" id=\"survey-tab-view\"><span class=\"loading_text\">Loading...</span></div></div><input class=\"carousel-open\" type=\"radio\" id=\"carousel-4\" name=\"carousel\" aria-hidden=\"true\" hidden=\"\"><div class=\"carousel-item\"><div class=\"daily-draw-tab flex-center\" id=\"game-tab-view\"></div></div><input class=\"carousel-open\" type=\"radio\" id=\"carousel-5\" name=\"carousel\" aria-hidden=\"true\" hidden=\"\"><div class=\"carousel-item\"><div class=\"user-tab\" id=\"user-tab-view\"></div></div><input class=\"carousel-open\" type=\"radio\" id=\"carousel-6\" name=\"carousel\" aria-hidden=\"true\" hidden=\"\"><div class=\"carousel-item\"><div class=\"settings-tab\" id=\"settings-tab-view\"></div></div></div></div></div><div class=\"popup-navigation\" id=\"popup-navigation\"></div>";
},"3":function(container,depth0,helpers,partials,data) {
    return "<div class=\"not-loggedin-user flex-center\"><div class=\"text-login\">Please login to your GetPaidTo account to get access to all the latest cashback and earning offers.</div><div class=\"btn btn-blue btn-login flex-center\" id=\"login-to-ext-popup\">LOGIN NOW</div></div>";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"popup-body\"><div class=\"popup-header\" data-href=\"https://www.getpaidto.com/\"></div><div class=\"popup-content flex-center\" id=\"popup-content\">"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.user : depth0)) != null ? stack1.Username : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "</div>";
},"useData":true});
Handlebars["templates"]["retailer"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {});

  return "<div class=\"retailer-view_info-block\"><div class=\"retailer-view_logo flex-center\"><img class=\"retailer-view_logo\" src=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.merchant : depth0)) != null ? stack1.Logo : stack1), depth0))
    + "\"></div><div class=\"retailer-view_info flex-center-vertical\"><div class=\"retailer-view_info-title\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.merchant : depth0)) != null ? stack1.Reward : stack1), depth0))
    + "</div><div class=\"retailer-view_info-offers\">"
    + ((stack1 = helpers["if"].call(alias3,((stack1 = ((stack1 = (depth0 != null ? depth0.offers : depth0)) != null ? stack1["0"] : stack1)) != null ? stack1.OfferId : stack1),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div></div></div>"
    + ((stack1 = helpers["if"].call(alias3,((stack1 = (depth0 != null ? depth0.merchant : depth0)) != null ? stack1.isActivated : stack1),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.program(7, data, 0),"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias3,((stack1 = ((stack1 = (depth0 != null ? depth0.offers : depth0)) != null ? stack1["0"] : stack1)) != null ? stack1.OfferId : stack1),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " ";
},"2":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "plus "
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.offers : depth0)) != null ? stack1.length : stack1), depth0))
    + " code"
    + ((stack1 = (helpers.compare || (depth0 && depth0.compare) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.offers : depth0)) != null ? stack1["0"] : stack1)) != null ? stack1.OfferId : stack1),1,{"name":"compare","hash":{"operator":">"},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " available";
},"3":function(container,depth0,helpers,partials,data) {
    return "s";
},"5":function(container,depth0,helpers,partials,data) {
    return "<div class=\"btn-light_green btn-activate-cashback\"><div class=\"tick\"></div>Cashback Activated</div>";
},"7":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"btn btn-blue btn-get-cashback flex-center\" data-url=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.merchant : depth0)) != null ? stack1.Url : stack1), depth0))
    + "\">GET CASHBACK</div>";
},"9":function(container,depth0,helpers,partials,data) {
    var stack1;

  return " "
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.offers : depth0),{"name":"each","hash":{},"fn":container.program(10, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " ";
},"10":function(container,depth0,helpers,partials,data) {
    var stack1;

  return " "
    + ((stack1 = (helpers.if_all || (depth0 && depth0.if_all) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.getTheCode : depth0),(depth0 != null ? depth0.VoucherCode : depth0),{"name":"if_all","hash":{},"fn":container.program(11, data, 0),"inverse":container.program(13, data, 0),"data":data})) != null ? stack1 : "")
    + " ";
},"11":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "<div class=\"retailer-view_offer-with-code\"><div class=\"retailer-view_offer-info_and-code flex-center\"><div><div class=\"retailer-view_offer-title\">"
    + alias2(alias1((depth0 != null ? depth0.Name : depth0), depth0))
    + "</div><div class=\"retailer-view_offer-description\">"
    + alias2(alias1((depth0 != null ? depth0.Description : depth0), depth0))
    + "</div><div class=\"retailer-view_offer-code flex-center\">"
    + alias2(alias1((depth0 != null ? depth0.VoucherCode : depth0), depth0))
    + "</div></div></div><div class=\"btn-copy-code flex-center\">COPY THE CODE <span class=\"copy_text\">"
    + alias2(alias1((depth0 != null ? depth0.VoucherCode : depth0), depth0))
    + "</span></div></div>";
},"13":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {});

  return "<div class=\"retailer-view_offer\"><div class=\"retailer-view_offer-info flex-center\"><div><div class=\"retailer-view_offer-title\">"
    + alias2(alias1((depth0 != null ? depth0.Name : depth0), depth0))
    + "</div><div class=\"retailer-view_offer-description\">"
    + alias2(alias1((depth0 != null ? depth0.Description : depth0), depth0))
    + "</div>"
    + ((stack1 = helpers["if"].call(alias3,(depth0 != null ? depth0.Expiry : depth0),{"name":"if","hash":{},"fn":container.program(14, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div></div>"
    + ((stack1 = helpers["if"].call(alias3,(depth0 != null ? depth0.getTheCode : depth0),{"name":"if","hash":{},"fn":container.program(16, data, 0),"inverse":container.program(18, data, 0),"data":data})) != null ? stack1 : "")
    + "</div>";
},"14":function(container,depth0,helpers,partials,data) {
    return "<div class=\"retailer-view_offer-expires\"><div class=\"expires-clock\"></div>Expires in "
    + container.escapeExpression(container.lambda((depth0 != null ? depth0.ExpiryDays : depth0), depth0))
    + " days</div>";
},"16":function(container,depth0,helpers,partials,data) {
    var helper, alias1=container.escapeExpression, alias2=container.lambda;

  return "<div class=\"btn-got-code flex-center\" data-id=\""
    + alias1(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"index","hash":{},"data":data}) : helper)))
    + "\" data-url=\""
    + alias1(alias2((depth0 != null ? depth0.Url : depth0), depth0))
    + "\" id=\""
    + alias1(alias2((depth0 != null ? depth0.OfferId : depth0), depth0))
    + "\">OFFER ACTIVATED</div>";
},"18":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.escapeExpression, alias3=container.lambda;

  return "<div class=\"btn-get-code flex-center\" data-id=\""
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
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"retailer-view\">"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.merchant : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>";
},"useData":true});
Handlebars["templates"]["search"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "<div class=\"merchant-in_search\" data-href=\""
    + alias2(alias1((depth0 != null ? depth0.Url : depth0), depth0))
    + "\" data-event=\"FeaturedMerchantClick\"><div class=\"merchant_logo-in_search flex-center\"><img src=\""
    + alias2(alias1((depth0 != null ? depth0.Logo : depth0), depth0))
    + "\"></div><div class=\"merchant_cashback-in_search flex-center\">"
    + alias2(alias1((depth0 != null ? depth0.Reward : depth0), depth0))
    + "</div></div>";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"ui-widget search-head flex-center\"><input type=\"search\" class=\"search\" id=\"tags\" placeholder=\"Search retailers\"></div><div class=\"search-featured_merchants\" id=\"search-results\">"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.featuredMerchants : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>";
},"useData":true});
Handlebars["templates"]["searchResults"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "<div class=\"merchant-in_search\" data-href=\""
    + alias2(alias1((depth0 != null ? depth0.Url : depth0), depth0))
    + "\" data-event=\"SearchedMerchantClick\"><div class=\"merchant_logo-in_search flex-center\"><img src=\""
    + alias2(alias1((depth0 != null ? depth0.Logo : depth0), depth0))
    + "\"></div><div class=\"merchant_cashback-in_search flex-center\">"
    + alias2(alias1((depth0 != null ? depth0.Reward : depth0), depth0))
    + "</div></div>";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.foundMerchants : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"useData":true});
Handlebars["templates"]["settings"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return " <input type=\"checkbox\" class=\"toggle__input\" id=\"toggle-serp\" checked=\"\"> ";
},"3":function(container,depth0,helpers,partials,data) {
    return " <input type=\"checkbox\" class=\"toggle__input\" id=\"toggle-serp\"> ";
},"5":function(container,depth0,helpers,partials,data) {
    return " <input type=\"checkbox\" class=\"toggle__input\" id=\"toggle-slider\" checked=\"\"> ";
},"7":function(container,depth0,helpers,partials,data) {
    return " <input type=\"checkbox\" class=\"toggle__input\" id=\"toggle-slider\"> ";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "<div class=\"settings-container\"><div class=\"settings-table\"><div class=\"settings_item\"><div class=\"toggle\" id=\"serp-settings\">"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.settingsVal : depth0)) != null ? stack1.showSerp : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + " <label class=\"toggle__control\" for=\"toggle-serp\"></label> <label class=\"toggle__label\" for=\"toggle-serp\"></label></div><div class=\"\">Show cashback alerts in google search results</div></div><div class=\"settings_item\"><div class=\"toggle\" id=\"slider-settings\">"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.settingsVal : depth0)) != null ? stack1.showSlider : stack1),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.program(7, data, 0),"data":data})) != null ? stack1 : "")
    + " <label class=\"toggle__control\" for=\"toggle-slider\"></label> <label class=\"toggle__label\" for=\"toggle-slider\"></label></div><div class=\"\">Show cashback alert popup on retailer sites</div></div></div><div class=\"btn btn-blue btn-login flex-center\" id=\"save-settings\">SAVE SETTINGS</div></div>";
},"useData":true});
Handlebars["templates"]["surveys"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return " "
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.surveysTargeted : depth0),{"name":"each","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " ";
},"2":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "<div class=\"targeted-survey\"><div class=\"targeted-survey_info-block\"><div class=\"targeted-survey_logo flex-center\"><img src=\""
    + alias2(alias1((depth0 != null ? depth0.Logo : depth0), depth0))
    + "\"></div><div class=\"targeted-survey_info-points flex-center\"><p><span class=\"targeted-survey_points-text\">"
    + alias2(alias1((depth0 != null ? depth0.PointsValue : depth0), depth0))
    + "</span><br>Points</p></div><div class=\"targeted-survey_info-min flex-center\">"
    + alias2(alias1((depth0 != null ? depth0.SurveyLength : depth0), depth0))
    + " min</div></div><div class=\"btn btn-green btn-take-survey flex-center\" data-href=\""
    + alias2(alias1((depth0 != null ? depth0.Url : depth0), depth0))
    + "\" data-event=\"TargetedSurveyClick\">TAKE SURVEY</div></div>";
},"4":function(container,depth0,helpers,partials,data) {
    return "<div class=\"no-targeted-survey-message flex-center\">There are currently no targeted surveys that fit your profile.<br>Please try a daily survey below.</div>";
},"6":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"no-targeted-surveys-daily\">"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.surveysCommon : depth0),{"name":"each","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "<div class=\"btn btn-green btn-goto-survey-page flex-center\" id=\"go-to-surveys-page\">GO TO SURVEY PAGE</div></div>";
},"7":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "<div class=\"merchant-in_search\" data-href=\""
    + alias2(alias1((depth0 != null ? depth0.Url : depth0), depth0))
    + "\" data-event=\"DailySurveyClick\"><div class=\"merchant_logo-in_search flex-center\"><img src=\""
    + alias2(alias1((depth0 != null ? depth0.Logo : depth0), depth0))
    + "\"></div><div class=\"merchant_cashback-in_search flex-center\"><span class=\"find-survey-text\">Find a Survey</span></div></div>";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.surveysTargeted : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(4, data, 0),"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.surveysCommon : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"useData":true});
Handlebars["templates"]["user"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "<div class=\"user-logout\"><ul class=\"user-info-list\"><li class=\"user-info_item user-info_item__points\"><div class=\"user-info_title\">Points balance:</div><div class=\"user-info_value\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.user : depth0)) != null ? stack1.PointsBalance : stack1), depth0))
    + "</div></li><li class=\"user-info_item user-info_item__tracked\"><div class=\"user-info_title\">Tracked cashback:</div><div class=\"user-info_value\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.user : depth0)) != null ? stack1.TrackedCashback : stack1), depth0))
    + "</div></li><li class=\"user-info_item user-info_item__confirmed\"><div class=\"user-info_title\">Confirmed cashback:</div><div class=\"user-info_value\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.user : depth0)) != null ? stack1.CashBalance : stack1), depth0))
    + "</div></li></ul><a class=\"link-to-account\" data-href=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.user : depth0)) != null ? stack1.AccountUrl : stack1), depth0))
    + "\">View my account in browser</a><div class=\"text-logout_title\">You are logged in as <span id=\"username\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.user : depth0)) != null ? stack1.Username : stack1), depth0))
    + "</span></div><div class=\"btn btn-blue btn-login flex-center\" id=\"logout-from-ext\">LOGOUT NOW</div><div class=\"text-logout\">Click the logout button above to switch to another account.</div><div class=\"social-links-container\"><div class=\"social-links-container_title\"><span class=\"bold-text\">Get more from GetPaidTo!</span></div><div class=\"social-link facebook-ico\" data-href=\"https://www.facebook.com/www.GetPaidTo\"></div><div class=\"social-link twitter-ico\" data-href=\"https://twitter.com/getpaidto\"></div><div class=\"social-link youtube-ico\" data-href=\"https://www.youtube.com/channel/UCTCTgp-ECeFdM5_1I871PjQ/featured\"></div><div class=\"social-link pinterest-ico\" data-href=\"https://pinterest.com/GPTcashback/\"></div></div></div>";
},"useData":true});