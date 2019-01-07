/*

// ==UserScript==
// @name LinguaLeoWizardDialog
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
var LinguaLeoWizardDialog=function(h){function n(){domHelper.removeChild(d);h=d=null}function f(){var a=sizeHelper.scrollOffset(),b=sizeHelper.getOffset(h.traceTargetElement);b.left=b.left+h.traceTargetElement.offsetWidth-a.left;b.top-=a.top;a=sizeHelper.getOffsetSum(g);a.left+=g.offsetWidth/2;a.top+=g.offsetHeight/2;for(var c=(a.top-b.top)/(a.left-b.left),d=(b.left-a.left)/k.length,e=0,f;f=k[e];e++)f.style.left=a.left+d*e+"px",f.style.top=c*(a.left+d*e-b.left)+b.top+"px"}function e(){if(lingualeoHelper.isTopWindow()){cssHelper.addClass(d,
"lleo_hide");cssHelper.removeClass(d,"lleo_nextStep");if(c&&c.onClose)c.onClose();l&&l();c=null;if(g){Event.remove(window,"scroll",f);for(var a=0,b;b=k[a];a++)domHelper.removeChild(b);g=k=null}setTimeout(n,1E3)}}function p(a){var b=a.target.getAttribute("data-action-page");if(b){kango.invokeAsync("window.lingualeo.openLinguaLeoPage",b);if(c.onActionPage)c.onActionPage(b);e()}else if(a=a.target.getAttribute("data-action"),"next"===a){if(cssHelper.addClass(d,"lleo_nextStep"),c.onNext)c.onNext()}else if("close"===
a)e();else if(a){if(c.onAction)c.onAction(a);e()}}var l,m=Math.random()+10*Math.random(),c=h,d=null,g,k;(function(){var a=["content/wizardDialog"].concat(c.slides);lingualeoHelper.getTemplate("content/wizardDialogStyle",function(a){cssHelper.addCss(a,"wizardDialog")});lingualeoHelper.getTemplates(a,!0,function(a){a=stringHelper.formatStrExt(a["content/wizardDialog"],{UID:m,isBig:c.isBig,isStyle2:c.isStyle2,slide1:a[c.slides[0]],slide2:a[c.slides[1]]});domHelper.appendHtmlToElement(domHelper.getBody(),
a);d=document.getElementById("lleo_wizardDialog"+m);Event.add(d,"click",p);setTimeout(function(){cssHelper.addClass(d,"lleo_show");if(h.traceTargetElement&&(g=d.querySelector('[data-trace-pointer="yes"]'))){for(var a=[],b=0;40>b;b++)a.push('<div class="lleo_tracePoint" style="width:'+parseInt(3+.3*b)+"px !important;height:"+parseInt(3+.3*b)+'px !important"></div>');domHelper.appendHtmlToElement(domHelper.getBody(),a.join(""));k=Array.prototype.slice.call(document.getElementsByClassName("lleo_tracePoint"),
0);f();Event.add(window,"scroll",f)}if(c.onShow)c.onShow()},0)});return this})();return{close:e,getRootElement:function(){return d},assignOnCloseHandler:function(a){l=a}}};
