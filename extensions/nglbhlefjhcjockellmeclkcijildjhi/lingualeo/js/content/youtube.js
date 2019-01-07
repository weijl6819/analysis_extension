/*

// ==UserScript==
// @name LinguaLeoYoutube
// @all-frames false
// @include http*://*youtube.com/*
// ==/UserScript==
*/
llYoutube=function(){function g(a){a.target&&a.target.id&&"watch7-container"===a.target.id&&e()}function h(a){a.target&&a.target.id&&"watch7-container"===a.target.id&&f&&LinguaLeoWizardManager.deactivateWizard("youtubeExport")}function k(a){var b=document.getElementById("watch7-subscription-container");return b?(a=stringHelper.formatStr('<button class="yt-uix-button yt-uix-button-size-default yt-uix-button-default" id="lleo_youtubeExportBtn"><span class="yt-uix-button-icon-wrapper"><i></i></span><span class="yt-uix-button-content">{title}</span></button>',
{title:a}),domHelper.insertHtmlAsNextElement(b,a),document.getElementById("lleo_youtubeExportBtn").onclick=l,!0):!1}function c(a){var b=document.querySelector("#lleo_youtubeExportBtn .yt-uix-button-content");b&&(b.innerHTML=a)}function d(a){var b=document.getElementById("lleo_youtubeExportBtn");a?b.removeAttribute("disabled"):b.setAttribute("disabled","disabled")}function m(){var a=window.location.search.match(/v=(.*?)(&|$)/);return a&&a[1]?stringHelper.formatStr(llContent.config.ajax.youtubeCaptionsInfo,
{id:a[1]}):null}function e(){if(k(i18n.getLocaleMessage("processing"))){d(!1);var a=m();a?(kango.invokeAsyncCallback("window.lingualeo.approveYoutubeCaptionsInfo",a,function(a){a?(c(i18n.getLocaleMessage("learnOnLinguaLeo")),d(!0)):c(i18n.getLocaleMessage("noSubtitles"))}),LinguaLeoWizardManager.activateWizard("youtubeExport",1E3,null),f=!0):c(i18n.getLocaleMessage("noSubtitles"))}}function l(){c(i18n.getLocaleMessage("processing"));d(!1);kango.invokeAsyncCallback("window.lingualeo.exportYoutubeContent",
window.location.href,function(a){a.contentUrl?(c(i18n.getLocaleMessage("redirecting")),window.location.href=llContent.config.domain+a.contentUrl):(c(i18n.getLocaleMessage("learnOnLinguaLeo")),d(!0))})}var f=!1;return{init:function(){Event.add(document,"DOMNodeInserted",g);Event.add(document,"DOMNodeRemoved",h);e()}}}();
