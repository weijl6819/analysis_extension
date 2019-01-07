/*

// ==UserScript==
// @name LinguaLeoLyrics
// @all-frames true
// @include http*://vk.com/*
// ==/UserScript==
*/
llLyrics=function(){function f(a){var b=a.id;b&&(a.setAttribute("data-lleo-lyrics","waiting"),cssHelper.addClass(a,"lleo_lyrics"),setTimeout(function(){var a=document.getElementById(b);a&&kango.invokeAsyncCallback("window.lingualeo.isContentInEnglish",a.innerHTML,function(b){b&&(kango.invokeAsyncCallback("window.lingualeo.getClickableContent",a.innerHTML,function(b){a.innerHTML=c["content/lyricsBrand"]+b;a.setAttribute("data-lleo-lyrics","yes")}),d||(cssHelper.addCss(c["content/lyricsBrandStyle"]),
Event.add(document,"click",g),d=!0))})},500))}function h(a){a.setAttribute("data-lleo-lyrics","removing");setTimeout(function(){a.removeAttribute("data-lleo-lyrics");cssHelper.removeClass(a,"lleo_lyrics")},100)}function g(a){return"TRAN"===a.target.tagName?(selectionHelper.selectNode(a.target),llContent.showDialogForCurrentSelection(null,!1),!1):!0}function k(){-1<window.location.href.indexOf("vk.com/audios")&&(clearInterval(e),LinguaLeoWizardManager.activateWizard("vkLyrics",0,function(a){if(a){a=
document.querySelectorAll(".audio_table .title a");for(var b=0;b<a.length;b++)/[\u0430-\u044f]/i.test(a[b].textContent)||cssHelper.addClass(a[b],"lleo_songName")}}));return!0}var e,c,d=!1;(function(){lingualeoHelper.getTemplates(["content/lyricsBrand","content/lyricsBrandStyle"],!1,function(a){c=a});Event.add(document,"DOMNodeInserted",function(a){a.target.nodeType===Node.TEXT_NODE&&a.target.parentNode&&cssHelper.hasClass(a.target.parentNode,"lyrics")&&!a.target.parentNode.hasAttribute("data-lleo-lyrics")&&
f(a.target.parentNode)});Event.add(document,"DOMNodeRemoved",function(a){a.target.nodeType===Node.TEXT_NODE&&a.target.parentNode&&"yes"===a.target.parentNode.getAttribute("data-lleo-lyrics")&&h(a.target.parentNode)});e=setInterval(k,4E3)})()}();
