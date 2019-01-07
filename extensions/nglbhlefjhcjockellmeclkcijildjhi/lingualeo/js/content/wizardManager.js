/*

// ==UserScript==
// @name LinguaLeoWizardManager
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
var LinguaLeoWizard=function(e){var f,h=e,d=e.create();d.assignOnCloseHandler(function(){e&&e.close&&e.close();f&&f();h=null});return{close:function(){d.close()},getData:function(){return h},assignOnCloseHandler:function(c){f=c}}},LinguaLeoWizardManager=function(){function e(a){kango.invokeAsync("window.lingualeo.getWizardOptions",function(b){c=JSON.parse(JSON.stringify(b))||c;a&&a()})}function f(a){if(a in g){var b=a in c.wizards&&c.wizards[a].isDisabled,k=!d||g[a].independent;return!g[a]._wizardObject&&
!b&&k}return!1}function h(a){if(f(a.name)){var b=new LinguaLeoWizard(a);b.assignOnCloseHandler(function(){if(b&&b.getData().canDisableByCommonDisabling){var k=b.getData().name;c.wizards[k]={isDisabled:!0};kango.invokeAsync("window.lingualeo.setWizardOptions",c)}a._wizardObject===d&&(d=null);a._wizardObject=b=null});a._wizardObject=b;a.independent||(d=b);return!0}return!1}var d,c={wizards:{}},g=function(){var a={meatballsLimit:{canDisableByCommonDisabling:!1,create:function(){return new LinguaLeoWizardDialog({slides:["help/meatballs-slide1",
"help/meatballs-slide2"],isBig:!0})}},localDictionaryLimit:{independent:!0,canDisableByCommonDisabling:!1,create:function(){return new LinguaLeoWizardDialog({slides:["help/localDictionaryLimit-slide1"],isBig:!0,onAction:function(a){"signin"===a?kango.invokeAsync("window.lingualeo.showLoginDialog"):"signup"===a&&kango.invokeAsync("window.lingualeo.openLinguaLeoPage","registerViaExtension",{utm_campaign:"dictionary-limit-dialog"})}})}},enjoyContentWelcome:{canDisableByCommonDisabling:!0,create:function(){return new LinguaLeoWizardDialog({slides:["help/enjoyContentWelcome-slide1",
"help/enjoyContentWelcome-slide2"],onAction:function(a){"enableEnjoyContent"===a?llContent.tryToSimplifyPage():"disableWizards"===a&&(LinguaLeoWizardManager.deactivateWizard("enjoyContentWelcome"),kango.invokeAsync("window.lingualeo.disableWizards"))}})}},enjoyContentExplain:{canDisableByCommonDisabling:!0,create:function(){return new LinguaLeoWizardDialog({isStyle2:!0,slides:["help/enjoyContentExplain-slide1","help/enjoyContentExplain-slide2"]})}},enjoyContentNoContent:{canDisableByCommonDisabling:!0,
create:function(){return new LinguaLeoWizardDialog({isStyle2:!0,slides:["help/enjoyContentExplainNoContent-slide1","help/enjoyContentExplainNoContent-slide2"]})}},enjoyContentControlsExplain:{canDisableByCommonDisabling:!0,create:function(){return new LinguaLeoWizardDialog({slides:["help/enjoyContentControlsExplain-slide1"]})}},enjoyContentControls:{independent:!0,canDisableByCommonDisabling:!0,create:function(){return new LinguaLeoEnjoyContentControls},close:function(){LinguaLeoWizardManager.deactivateWizard("enjoyContentControls");
LinguaLeoWizardManager.deactivateWizard("enjoyContentControlsExplain")}},vkLyrics:{canDisableByCommonDisabling:!0,create:function(){return new LinguaLeoWizardDialog({slides:["help/vkLyrics-slide1"]})}},youtubeExport:{canDisableByCommonDisabling:!0,create:function(){return new LinguaLeoWizardDialog({slides:["help/youtubeExport-slide1"],traceTargetElement:document.getElementById("lleo_youtubeExportBtn")})},close:function(){domHelper.removeChild(document.getElementById("lleo_exportArrow"))}}},b;for(b in a)a.hasOwnProperty(b)&&
(a[b].name=b);return a}();return{activateWizard:function(a,b,c){if(lingualeoHelper.isTopWindow()){var d=g[a];!d||d.canDisableByCommonDisabling&&!llContent.options.wizardsEnabled?c&&c(!1):setTimeout(function(){e(function(){var a=h(d);c&&c(a)})},b||0);return this}},deactivateWizard:function(a){lingualeoHelper.isTopWindow()&&(a=g[a])&&a._wizardObject&&a._wizardObject.close()}}}();
