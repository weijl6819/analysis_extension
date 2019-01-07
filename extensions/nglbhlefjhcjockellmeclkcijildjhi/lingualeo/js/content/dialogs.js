/*

// ==UserScript==
// @name LinguaLeoDialogs
// @all-frames true
// @include http://*
// @include https://*
// @include file://*
// @include file:///*
// @exclude http*://lingualeo.com/*
// @exclude http*://lingualeo.ru/*
// @exclude http*://*facebook.com/plugins/*
// @exclude http*://*twitter.com/widgets/*
// @exclude http*://plusone.google.com/*
// ==/UserScript==
*/
var getDialogTemplate=function(e,f,d,b){getDialogTemplate.insertedStyles||(getDialogTemplate.insertedStyles={});return{_dialogHtml:"",dialogData:{},_id:e,_styleTemplateId:d,_templateId:f,_hideCallback:null,init:function(a){var c=this;c._insertCss(function(){c._getHtmlTemplate(a)})},show:function(){this._createDialog();this._bindCommonEvents();this.bindEvents()},hide:function(a){this._destroyDialogElement();this._hideCallback&&this._hideCallback(a)},addClassName:function(a){cssHelper.addClass(document.getElementById(this._id),
a)},removeClassName:function(a){cssHelper.removeClass(document.getElementById(this._id),a)},_destroyDialogElement:function(){this._unbindCommonEvents();var a=document.getElementById(this._id);a&&a.parentNode.removeChild(a)},_setDialogPosition:function(a){var c=document.getElementById(this._id);if(a)cssHelper.addClass(c,"lleo_default-pos"+(browserDetector.isSafari()?" lleo_safari":""));else{var b=llContent.dialog.rect;a=sizeHelper.scrollOffset();var d=a.left+b.left-12,e=a.top+b.top-c.offsetHeight-
10;e<a.top&&(e=a.top+b.bottom+10);d<a.left+5?d=a.left+5:(b=domHelper.getBody(),d+c.offsetWidth>a.left+b.offsetWidth-5&&(d=a.left+b.offsetWidth-c.offsetWidth-5));c.style.left=d+"px";c.style.top=e+"px"}},_createDialog:function(){this._destroyDialogElement();var a=stringHelper.formatStrWithEscaping(this._dialogHtml,this.dialogData);domHelper.appendHtmlToElement(document.getElementsByTagName("body")[0],a);this._setDialogPosition(b);var c=this;setTimeout(function(){c.removeClassName("lleo_show-animation")},
1010)},_insertCss:function(a){getDialogTemplate.insertedStyles[e]?a():(lingualeoHelper.getTemplate(this._styleTemplateId,function(c){cssHelper.addCss(c);a()}),getDialogTemplate.insertedStyles[e]=!0)},_getHtmlTemplate:function(a){var c=this;lingualeoHelper.getTemplate(this._templateId,function(b){c._dialogHtml=b;a()})},_documentMouseDownHandler_static:function(a){a.customData.hide()},_documentKeyDownHandler_static:function(a){var c=a.customData;27===a.keyCode&&c.hide()},_bindCommonEvents:function(){Event.add(document,
"mousedown",this._documentMouseDownHandler_static,this);Event.add(document,"keydown",this._documentKeyDownHandler_static,this);var a=document.getElementById(this._id);Event.add(a,"dblclick",function(a){a.stopPropagation()});Event.add(a,"mousedown",function(a){a.stopPropagation()});Event.add(a,"mouseup",function(a){a.stopPropagation()});Event.add(a,"contextmenu",function(a){a.stopPropagation()})},_unbindCommonEvents:function(){Event.remove(document,"mousedown",this._documentMouseDownHandler_static);
Event.remove(document,"keydown",this._documentKeyDownHandler_static)},bindEvents:function(){}}},showLoginDialog=function(e,f){var d=getDialogTemplate("lleo_loginForm","content/loginForm","content/loginFormStyle",e);d.dialogData={loginDialogCapt:i18n.getLocaleMessage("loginDialogCapt"),loginDialogEnter:i18n.getLocaleMessage("loginDialogEnter"),loginDialogSignUp:i18n.getLocaleMessage("loginDialogSignUp"),loginDialogForgot:i18n.getLocaleMessage("loginDialogForgot"),loginDialogPass:i18n.getLocaleMessage("loginDialogPass"),
loginDialogEmail:i18n.getLocaleMessage("loginDialogEmail"),dlgCloseHint:i18n.getLocaleMessage("dlgCloseHint")};d.bindEvents=function(){var b=this,a=document.getElementById(this._id);Event.add(a,"submit",function(a){return!1});a=document.getElementById("lleo_loginButton");Event.add(a,"click",function(){b._handleLogin();return!1});a=document.getElementById("lleo_loginCreateAccount");Event.add(a,"click",function(){kango.invokeAsync("window.lingualeo.openLinguaLeoPage","registerViaExtension",{utm_campaign:"login-dialog"});
b.hide();return!1});a=document.getElementById("lleo_loginForgotPass");Event.add(a,"click",function(){kango.invokeAsync("window.lingualeo.openLinguaLeoPage","forgotPass");return!1});a=document.getElementById("lleo_loginClose");Event.add(a,"click",function(){b.hide();return!1})};d._clearErrorList=function(){var b=document.getElementById("lleo_loginErrorList1");domHelper.removeAllChilds(b);cssHelper.removeClass(b,"showing");d.removeClassName("lleo_error")};d._addErrorToList=function(b){var a=document.getElementById("lleo_loginErrorList1");
domHelper.removeAllChilds(a);domHelper.appendHtmlToElement(a,htmlHelper.escapeHTML(b));cssHelper.addClass(a,"showing");d.removeClassName("lleo_error");setTimeout(function(){d.addClassName("lleo_error")},0)};d._isDataValid=function(b,a){var c;(c=0===b.length)||(c=!/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i.test(b));
return c||0===a.length?(this._addErrorToList(i18n.getLocaleMessage("loginDialogEmailIncorrect")),!1):!0};d._handleLogin=function(){this._clearErrorList();var b=document.getElementById("lleo_loginUsername").value,a=document.getElementById("lleo_loginPassword").value;if(this._isDataValid(b,a)){this.addClassName("lleo_loading");document.getElementById("lleo_loginButton").setAttribute("disabled","disabled");var c=this;kango.invokeAsyncCallback("window.lingualeo.loginUser",b,a,function(a){c.removeClassName("lleo_loading");
document.getElementById("lleo_loginButton").removeAttribute("disabled");a.error_msg?c._addErrorToList(403==a.error_code?i18n.getLocaleMessage("loginDialogEmailIncorrect"):a.error_msg):c.hide(!0)})}};d._hideCallback=f;d.init(function(){d.show();setTimeout(function(){var b=document.getElementById("lleo_loginUsername");b&&b.focus()},800)})};(function(){lingualeoHelper.isTopWindow()&&kango.addMessageListener("showLoginForm",showLoginDialog)})();