/*

// ==UserScript==
// @name LinguaLeoConfig
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
var LinguaLeoConfig=function(){var a="lingualeo.com";try{"undefined"!==typeof localStorage&&(a=localStorage.getItem("domain")||a)}catch(c){}var b="http://api."+a;return{debug:!1,domain:"http://"+a,api:b,modules:{llLyrics:!0,llYoutube:!1,llSimplified:!0},path:{root:"?utm_source=ll_plugin&utm_medium=plugin&utm_campaign=popup",login:"/login?utm_source=ll_plugin&utm_medium=plugin&utm_campaign=options",profile:"/profile?utm_source=ll_plugin&utm_medium=plugin&utm_campaign=logindialog",registerViaExtension:"?utm_source=ll_plugin&utm_medium=plugin",
meatballs:"/meatballs?utm_source=ll_plugin&utm_medium=plugin&utm_campaign=nomeatballsdialog",dictionaryFromInternet:"/glossary/learn/internet?utm_source=ll_plugin&utm_medium=plugin&utm_campaign=simplifiedcontent#{originalText}",forgotPass:"/password/forgot?utm_source=ll_plugin&utm_medium=plugin&utm_campaign=logindialog",goldStatus:"/gold?utm_source=ll_plugin&utm_medium=plugin&utm_campaign=wizardmanager",youtubeExport:"/content/addVideoContent",images:"https://d144fqpiyasmrr.cloudfront.net/plugins/all/images",
audio_player:"https://d144fqpiyasmrr.cloudfront.net/plugins/all/flash/1.html#sound="},ajax:{isAuth:"/isauthorized",login:"/api/login",addWordToDict:"/addword",addWordToDictMultiple:"/addwords",translate:"/translate.php",getTranslations:"/gettranslates",setChromeHideCookie:"/setChromeHideCookie",getUntrainedWordsCount:"/getUntrainedWordsCount",checkSiteNotifications:b+"/user/{user_id}/notifications/unread",youtubeCaptionsInfo:"http://www.youtube.com/api/timedtext?type=list&v={id}"},userStorageDataPrefix:"user_",
userStorageData:{user_id:{},fname:{},nickname:{persistent:!0},avatar:{},avatar_mini:{},lang_native:{persistent:!0,broadcastMessage:"nativeLanguageUpdated"},lang_interface:{persistent:!0,broadcastMessage:"localeMessagesUpdated"}},notificationTimeout:6E3,maxTextLengthToTranslate:255,simplifiedContentMaxWidth:800,simplifiedContentBlurBackground:!1,defaultExportedYoutubeContentGenre:12,untrainedWordsCheckingTimeout:72E5,languageDetectionTimeout:6E3,localDictionaryMaxWordsCount:20}};
