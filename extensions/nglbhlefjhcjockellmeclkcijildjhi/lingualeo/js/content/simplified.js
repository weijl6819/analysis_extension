/*

// ==UserScript==
// @name LinguaLeoSimplified
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
llSimplified=function(){function w(){cssHelper.addClass(e,"lleo_simplifiedZoomed");setTimeout(function(){cssHelper.removeClass(e,"lleo_simplifiedZoomed")},200)}function x(a){return a.hasAttribute("id")&&!a.getAttribute("id").indexOf("lleo_")}function y(){g=!0;var a=domHelper.getBody();p=a.style.overflow;a.style.overflow="hidden";l&&lingualeoHelper.getTemplate("content/simplifiedSvgFilter",function(a){domHelper.appendHtmlToElement(domHelper.getBody(),a)});if(llContent.config.simplifiedContentBlurBackground)for(var a=
a.children,c=0,b;b=a[c];c++)x(b)||(b.setAttribute("data-lleo-changed","yes"),b.setAttribute("data-lleo-webkit-filter",b.style.webkitFilter),b.setAttribute("data-lleo-filter",b.style.filter),b.style.webkitFilter="blur(7px)",b.style.filter=l?"url(#lleo_svgBlur)":"")}function q(a,c){m||(m=!0,lingualeoHelper.getTemplate("content/simplifiedStyle",function(a){cssHelper.addCss(a,"simplified")}),lingualeoHelper.getTemplate("content/simplified",function(b){var d=domHelper.getBody(),n=Math.min(sizeHelper.clientSize().width-
300,llContent.config.simplifiedContentMaxWidth);b=stringHelper.formatStrExt(b,{content:a,isEmpty:c,width:n+"px !important",marginLeft:-n/2+"px !important",listPaddingLeft:n/2+30+"px !important"});domHelper.appendHtmlToElement(d,b);e=document.getElementById("lleo_simplifiedLayer");Event.add(window,"keydown",r);Event.add(e,"click",z);Event.add(document.getElementById("lleo_simplifiedCloseBtn"),"click",s);Event.add(document.getElementById("lleo_fontSizeContainer"),"click",A);t();u(!1);setTimeout(function(){cssHelper.addClass(e,
"lleo_simplifiedShow");f={};if(h)for(var a=0,b;b=h[a];a++)v(b)},10);m=!1}))}function u(a){for(var c=document.querySelectorAll("iframe"),b=0,d=c.length;b<d;b++)c[b].classList[a?"remove":"add"]("lleo_hidden_iframe")}function t(){e&&kango.invokeAsync("window.lingualeo.getExtensionOptions",function(a){var c=document.getElementById("lleo_simplifiedContent");cssHelper.removeClass(c,"lleo_font_"+k);k=a.simplifiedFontSize||"size1";cssHelper.addClass(c,"lleo_font_"+k);cssHelper.removeClass(document.querySelector("#lleo_fontSizeContainer a.selected"),
"selected");cssHelper.addClass(document.querySelector('#lleo_fontSizeContainer a[data-value="'+k+'"]'),"selected")})}function z(a){return"TRAN"===a.target.tagName?(selectionHelper.selectNode(a.target),llContent.showDialogForCurrentSelection(null,!1),!1):!0}function A(a){"A"===a.target.tagName&&kango.invokeAsync("window.lingualeo.setExtensionOptions",{simplifiedFontSize:a.target.getAttribute("data-value")})}function s(){h=[];for(var a in f)f.hasOwnProperty(a)&&h.push(a);f={};domHelper.removeChild(e);
e=null;u(!0);Event.remove(window,"keydown",r);a=domHelper.getBody();if(llContent.config.simplifiedContentBlurBackground)for(var c=a.children,b=0,d;d=c[b];b++)d.getAttribute("data-lleo-changed")&&(d.style.webkitFilter=d.getAttribute("data-lleo-webkit-filter"),d.style.filter=d.getAttribute("data-lleo-filter"),d.removeAttribute("data-lleo-webkit-filter"),d.removeAttribute("data-lleo-filter"),d.removeAttribute("data-lleo-changed"));a.style.overflow=p;l&&domHelper.removeChild(document.getElementById("lleo_svg"));
g=!1}function r(a){27===a.keyCode&&(a.stopPropagation(),a.preventDefault(),s())}function B(a){if(g)w();else{var c=!1;-1===C.indexOf(location.host)&&(c=!0);if(c){var b=Readability.parse();y()}c&&b?kango.invokeAsyncCallback("window.lingualeo.getClickableContent",b,function(b){q(b,!1);a&&a(!0)}):lingualeoHelper.getTemplate("content/simplifiedEmpty",function(b){q(b,!0);a&&a(!1)})}}function v(a){var c=lingualeoHelper.getWordArticleUrl(a),b=document.getElementById("lleo_simplifiedWordList"),d=30<a.length?
a.substr(0,29)+"...":a;domHelper.appendHtmlToElement(b,'<a href="'+c+'" target="_blank">'+htmlHelper.escapeHTML(d)+"</a>");var e=b.lastChild;b.scrollTop=9999999999;a in f&&domHelper.removeChild(f[a]);f[a]=e;setTimeout(function(){cssHelper.addClass(e,"lleo_show")},1)}if(lingualeoHelper.isTopWindow()){var C=["twitter.com"],g=!1,m=!1,e=null,k="size1",p=null,h=null,f=[],l=browserDetector.isFirefox()||browserDetector.isIE();kango.addMessageListener("updateOptions",t);return{isSimplifiedModeOn:function(){return g},
simplifyPage:B,addWordToList:v}}}();
