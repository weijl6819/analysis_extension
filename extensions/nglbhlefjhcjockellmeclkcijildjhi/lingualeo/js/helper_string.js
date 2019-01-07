/*

// ==UserScript==
// @name LinguaLeoStringHelper
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
var stringHelper={formatStrWithEscaping:function(a,b){for(var c in b)b.hasOwnProperty(c)&&(a=a.replace(new RegExp("{"+c+"}","g"),htmlHelper.escapeHTML(b[c])));return a},formatStr:function(a,b){for(var c in b)b.hasOwnProperty(c)&&(a=a.replace(new RegExp("{"+c+"}","g"),b[c]));return a},formatStrExt:function(a,b){for(var c in b)a=a.replace(new RegExp("{"+c+"\\?(.*?)\\:(.*?)}","g"),b[c]?"$1":"$2");return stringHelper.formatStr(a,b)},wrapWordWithTag:function(a,b,c){return a.replace(new RegExp("(^|\\s)("+
b+")(\\s|$)","gi"),"$1<"+c+">$2</"+c+">$3")},trimText:function(a){return a.replace(/^[ \t\r\n]+|[ \t\r\n]+$/,"")}};
