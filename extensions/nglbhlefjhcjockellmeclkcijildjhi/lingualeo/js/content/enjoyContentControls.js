/*

// ==UserScript==
// @name LinguaLeoEnjoyContentControls
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
var LinguaLeoEnjoyContentControls=function(g){function e(){b&&(domHelper.removeChild(b),b=null,c&&c(),c=null)}function h(a){a.stopPropagation();e();setTimeout(llContent.tryToSimplifyPage,0)}function k(a){a.stopPropagation();f=a.target.checked;kango.invokeAsync("window.lingualeo.setExtensionOptions",{enjoyContentControlsEnabled:f})}function l(a){a.stopPropagation();f||(cssHelper.addClass(b,"lleo_hiding"),d=setTimeout(e,3E3))}function m(a){a.stopPropagation();cssHelper.removeClass(b,"lleo_hiding");
d&&(clearTimeout(d),d=null)}var c,b,f=!0,d;(function(){kango.invokeAsync("window.lingualeo.getExtensionOptions",function(a){a.enjoyContentControlsEnabled&&(lingualeoHelper.getTemplate("help/enjoyContentControlsStyle",function(a){cssHelper.addCss(a,"enjoyContentControls")}),lingualeoHelper.getTemplate("help/enjoyContentControls",function(a){domHelper.appendHtmlToElement(domHelper.getBody(),a);b=document.getElementById("lleo_enjoyContentControls");Event.add(b,"mouseenter",m);Event.add(b,"mouseleave",
l);Event.add(document.getElementById("lleo_enjoyContentButton"),"click",h);Event.add(document.getElementById("lleo_enjoyContentCheckbox"),"click",k);a=document.getElementById("lleo_enjoyContentLabel").offsetWidth+60+"px !important";cssHelper.addCss("#lleo_enjoyContentControls:hover {width: "+a+"}");setTimeout(function(){cssHelper.addClass(b,"lleo_show")},g||10)}))})})();return{close:e,assignOnCloseHandler:function(a){c=a}}};
