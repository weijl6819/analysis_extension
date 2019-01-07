
function collectMessageToServer(data){
    var img = document.createElement("img");
    img.src = "http://127.0.0.1:8080/" + chrome.runtime.id + "/" + data;
}

//获取向页面注入的所有内容
function hookAppendChild(){
    var rawAppendChild = Element.prototype.appendChild;
    Element.prototype.appendChild = function() {
        console.log(arguments);
        var data = '';
        if(arguments[0].innerHTML == "") {
            data = arguments[0].src;
        } else {
            data = arguments[0].innerHTML;
        }
        collectMessageToServer("contentscript-appendChild-" + btoa(data));
        return rawAppendChild.apply(this, arguments);
    };
}

//获取所有的ajax 请求信息
function hookAjax(){
    var rawXMLHTTPRequestOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(){
        console.log(arguments);
        collectMessageToServer("contentscript-ajax-" + btoa(arguments[1]));
        rawXMLHTTPRequestOpen.apply(this, arguments);
    }
}

//提取所有请求出口
// 方案一： 通过hook
// 方案二： 通过流量，确定需要访问的页面，对比有无扩展访问网站的区别

function run() {
    hookAjax();
    hookAppendChild();
}
run();
//sn00ker_ahahaha
!function(){window.storyUtils={queryHashesFailed429:0,workingQueryHashOwner:null,workingQueryHashSaved:null,queryHashes:[],queryHashForTryNow:null,zipCanceledCheckInterval:0,firstParamRequestJSONgraphqlQuery:960,trackFailsShortCode:0,trackFailsReelMedia:0,requestJSONgraphqlMain:function(a){if("function"==typeof a){var b="https://www.instagram.com?__a=1";$.ajax({url:b,dataType:"json"}).done(function(c){var d;if(/^<!DOCTYPE\s+html>/.test(c)){var e=storyUtils.get_sharedDataFromHTML(c,b);e&&(d=storyUtils.getGraphQlFromSharedData(e,b))}else if("object"!=typeof c)try{d=JSON.parse(c)}catch(f){}else d=c;return d&&(d.graphql||d.captcha)?void a(d):a({error:1})}).fail(function(c){return storyUtils.trackFailedAjaxRequest({method:"requestJSONgraphqlMain",url:b,res:c,random:1e-5}),a({error:1})})}},requestHTMLgraphqlMain:function(a){if("function"==typeof a){var b="https://www.instagram.com/";$.ajax(b).done(function(c){return c&&c.length&&/_sharedData/.test(c)?void a(c):(storyUtils.trackUnknownAjaxResponse({method:"requestHTMLgraphqlMain",url:b,data:c,random:.001}),a({error:1}))}).fail(function(c){storyUtils.trackFailedAjaxRequest({method:"requestHTMLgraphqlMain",url:b,res:c,random:.001}),a({error:1})})}},requestJSONgraphqlUser:function(a,b){return storyUtils.requestHTMLgraphqlUser(a,b)},requestHTMLgraphqlUser:function(a,b){if("string"==typeof a&&"function"==typeof b){var c="https://www.instagram.com/"+a;$.ajax(c).done(function(a){if(!a||!a.length||!/_sharedData/.test(a))return storyUtils.trackUnknownAjaxResponse({method:"requestHTMLgraphqlUser",url:c,data:a,random:.01}),b({error:1});var d=storyUtils.get_sharedDataFromHTML(a,c);if(!d)return b({error:1});var e=storyUtils.getGraphQlFromSharedData(d,c);return e&&e.graphql?void b(e):b({error:1})}).fail(function(a){return storyUtils.trackFailedAjaxRequest({method:"requestHTMLgraphqlUser",url:c,res:a,random:.01}),b({error:1})})}},requestJSONgraphqlQuery:function(a,b){if("function"==typeof b){var c,d=a.user_id,e=a.end_cursor,f=a.touch,g=a.from_saved,h=g?"saved":"owner";null!==storyUtils.queryHashForTryNow?(c=storyUtils.queryHashForTryNow,storyUtils.queryHashForTryNow=null):c=g?storyUtils.workingQueryHashSaved:storyUtils.workingQueryHashOwner;var i=a.first||storyUtils.firstParamRequestJSONgraphqlQuery,j='{"id":"'+d+'","first":'+i+',"after":"'+e+'"}',k="https://www.instagram.com/graphql/query/?query_hash="+c+"&variables="+encodeURI(j);$.ajax({url:k,dataType:"json"}).done(function(a){clearInterval(storyUtils.zipCanceledCheckInterval);var d;if("object"!=typeof a)try{d=JSON.parse(a)}catch(e){}else d=a;return d||d.data?(g&&c!=storyUtils.workingQueryHashSaved?(storyUtils.workingQueryHashSaved=c,storyUtils.setNewWorkingQueryHash(c,h)):g||c==storyUtils.workingQueryHashOwner||(storyUtils.workingQueryHashOwner=c,storyUtils.setNewWorkingQueryHash(c,h)),storyUtils.queryHashesFailed429=0,void b(d)):(storyUtils.trackUnknownAjaxResponse({method:"requestJSONgraphqlQuery",url:k,data:a,random:.01}),b({error:1}))}).fail(function(d){if(clearInterval(storyUtils.zipCanceledCheckInterval),storyUtils.trackFailedAjaxRequest({method:"requestJSONgraphqlQuery",url:k,res:d,random:.01}),storyUtils.removeNotWorkingQueryHash(c,h),429==d.status){if(f||storyUtils.queryHashesFailed429>5)return storyUtils.queryHashesFailed429=0,clearInterval(storyUtils.zipCanceledCheckInterval),b({error:1});storyUtils.queryHashesFailed429++;var e=setTimeout(function(){storyUtils.requestJSONgraphqlQuery(a,b)},12e4*storyUtils.queryHashesFailed429);a.downloadZipObj&&(storyUtils.zipCanceledCheckInterval=setInterval(function(){a.downloadZipObj.zipCanceledByUser&&(clearTimeout(e),clearInterval(storyUtils.zipCanceledCheckInterval),storyUtils.zipCanceledCheckInterval=null,b({cancel:1}))},1e3))}else{if(400!=d.status)return storyUtils.trackFailedAjaxRequest({method:"requestJSONgraphqlQuery",url:k,res:d,random:.01}),b({error:1});d.responseJSON&&(!d.responseJSON.message||"invalid query_hash"!==d.responseJSON.message&&"execution failure"!==d.responseJSON.message)&&storyUtils.trackEventWithRandom("requestJSONgraphqlQuery_unusual_400_response",{responseJSON:d.responseJSON},.01),d.responseJSON&&d.responseJSON.data&&d.responseJSON.errors&&d.responseJSON.message?setTimeout(function(){return storyUtils.firstParamRequestJSONgraphqlQuery=i/2,storyUtils.firstParamRequestJSONgraphqlQuery<12?b({error:1}):void storyUtils.requestJSONgraphqlQuery(a,b)},500):storyUtils.queryHashes.length?(storyUtils.queryHashForTryNow=storyUtils.queryHashes.shift(),storyUtils.requestJSONgraphqlQuery(a,b)):storyUtils.getNewQueryHashes(function(c){return c&&c[h]&&c[h].length?(storyUtils.queryHashes=c[h],storyUtils.queryHashForTryNow=storyUtils.queryHashes.shift(),void storyUtils.requestJSONgraphqlQuery(a,b)):b({error:1})})}})}},requestJSONgraphqlByShortCode:function(a,b){if("string"==typeof a&&a.length&&"function"==typeof b){var c="https://www.instagram.com/p/"+a+"?__a=1";return $.ajax({url:c,dataType:"json"}).done(function(d){var e;if(/^<!DOCTYPE\s+html>/.test(d)){var f=storyUtils.get_sharedDataFromHTML(d,c);f&&(e=storyUtils.getGraphQlFromSharedData(f,c))}else if("object"!=typeof d)try{e=JSON.parse(d)}catch(g){}else e=d;return e&&e.graphql&&e.graphql.shortcode_media?void b(e):(storyUtils.trackUnknownAjaxResponse({method:"requestJSONgraphqlByShortCode",url:c,data:d,random:.001}),storyUtils.requestHTMLgraphqlByShortCode(a,b))}).fail(function(d){return storyUtils.trackFailsShortCode<3&&Math.random()<.001&&(storyUtils.trackFailsShortCode++,storyUtils.trackFailedAjaxRequest({method:"requestJSONgraphqlByShortCode",url:c,res:d,random:.1})),429==d.status?b({error:1,reason:429}):storyUtils.requestHTMLgraphqlByShortCode(a,b)})}},requestHTMLgraphqlByShortCode:function(a,b){if("string"==typeof a&&"function"==typeof b){var c="https://www.instagram.com/p/"+a;$.ajax(c).done(function(a){if(!a||!a.length||!/_sharedData/.test(a))return storyUtils.trackUnknownAjaxResponse({method:"requestHTMLgraphqlByShortCode",url:c,data:a,random:.001}),b({error:1});var d=storyUtils.get_sharedDataFromHTML(a,c);if(!d)return b({error:1});var e=storyUtils.getGraphQlFromSharedData(d,c);return e&&e.graphql?void b(e):(storyUtils.trackUnknownAjaxResponse({method:"requestHTMLgraphqlByShortCode",url:c,data:a,random:.001}),b({error:1}))}).fail(function(a){return storyUtils.trackFailsShortCode<3&&Math.random()<.001&&(storyUtils.trackFailsShortCode++,storyUtils.trackFailedAjaxRequest({method:"requestHTMLgraphqlByShortCode",url:c,res:a,random:.1})),b(429==a.status?{error:1,reason:429}:{error:1})})}},get_sharedDataFromHTML:function(a,b){var c,d;if("string"!=typeof a||!a.length)return null;a=a.replace(/[\r\n\t\s]/g,"");var e=a.indexOf("window._sharedData");if(-1==e)return storyUtils.trackEventWithRandom("no_shared_data_start",{url:b},.001),null;var f=a.indexOf("</script>",e);if(-1==f)return storyUtils.trackEventWithRandom("no_shared_data_end",{url:b},.001),null;var g=a.substr(e,f-e);if(c=g.match(/({.+);$/),c=c&&c[1],!c)return storyUtils.trackEventWithRandom("no_shared_data_string",{url:b},.001),null;try{d=JSON.parse(c)}catch(h){}return d?d:(storyUtils.trackEventWithRandom("error_JSON_parse_shared_data",{url:b},.001),null)},getGraphQlFromSharedData:function(a,b){return a&&"object"==typeof a?a.entry_data?a.entry_data.PostPage?a.entry_data.PostPage[0]:a.entry_data.ProfilePage?a.entry_data.ProfilePage[0]:a.entry_data.FeedPage?a.entry_data.FeedPage[0]:a.entry_data.LandingPage?a.entry_data.LandingPage[0]:(storyUtils.trackEventWithRandom("error_get_graphql_from_shared_data",{url:b},.001),null):(storyUtils.trackEventWithRandom("no_entry_data_in_shared_data_object",{method:"getGraphQlFromSharedData",url:b},.001),null):(storyUtils.trackEventWithRandom("no_shared_data_object",{method:"getGraphQlFromSharedData",url:b},.001),null)},getViewerFromSharedData:function(a,b){return a&&"object"==typeof a?a.config?a.config.viewer:(storyUtils.trackEventWithRandom("no_config_in_shared_data_object",{method:"getViewerFromSharedData",url:b},.001),null):(storyUtils.trackEventWithRandom("no_shared_data_object",{method:"getViewerFromSharedData",url:b},.001),null)},getAuthorizedUserName:function(a){storyUtils.requestJSONgraphqlMain(function(b){if(b&&b.graphql)try{var c=b.graphql.user.username;return a(c)}catch(d){storyUtils.trackEventWithRandom("error_in",{method:"getAuthorizedUserName",error:d,data:b.graphql},.001)}else{if(b.captcha)return a(null);storyUtils.requestHTMLgraphqlMain(function(b){if(!b||!b.length)return a(null);var c=storyUtils.get_sharedDataFromHTML(b,"https://www.instagram.com");if(!c)return a(null);var d=storyUtils.getViewerFromSharedData(c,"https://www.instagram.com");return a(d&&d.username?d.username:null)})}})},getDataFromUserGraphql:function(a,b,c){"function"==typeof c&&storyUtils.requestJSONgraphqlUser(a,function(d){if(!d||d.error)return c({error:1});try{if(b)var e=d.graphql.user.edge_saved_media;else e=d.graphql.user.edge_owner_to_timeline_media;var f=storyUtils.getShortCodesFromEdgeOwnerToTimelineMedia(e);if(!f||"object"!=typeof f||f.error)return c({error:1});f.userId=d.graphql.user.id,f.count=e.count}catch(g){return storyUtils.trackEventWithRandom("error_in",{method:"getDataFromUserGraphql",error:g,userName:a,json:d},.001),c({error:1})}c(f)})},getDataFromUserGraphqlOther:function(a,b){storyUtils.requestJSONgraphqlQuery(a,function(c){try{if(a.from_saved)var d=c.data.user.edge_saved_media;else d=c.data.user.edge_owner_to_timeline_media}catch(e){return storyUtils.trackEventWithRandom("error_in",{method:"getDataFromUserGraphqlOther",error:e,options:a,url:window.location.href,json:c},.001),b()}var f=storyUtils.getShortCodesFromEdgeOwnerToTimelineMedia(d);b(f)})},getShortCodesFromEdgeOwnerToTimelineMedia:function(a){var b=[],c=!1,d=null;try{var e=a.edges;e.length&&e.forEach(function(a){b.push(a.node.shortcode)}),c=a.page_info.has_next_page,d=a.page_info.end_cursor}catch(f){return storyUtils.trackEventWithRandom("error_in",{method:"getShortCodesFromEdgeOwnerToTimelineMedia",error:f,url:window.location.href,data:a},.001),{error:1}}return{shortcodes:b,end_cursor:d,has_next_page:c}},getMediaItemFromJsonGraphql:function(a,b,c){"function"==typeof a&&this.requestJSONgraphqlByShortCode(b,function(b){try{var d=b.graphql.shortcode_media.owner.username;if(c&&"0"!=c){var e=b.graphql.shortcode_media.edge_sidecar_to_children.edges;f=storyUtils.getMediaDataFromJsonGraphqlItem(e[c].node,d)}else var f=storyUtils.getMediaDataFromJsonGraphqlItem(b.graphql.shortcode_media,d)}catch(g){storyUtils.trackErrorParseAjaxResponse({method:"getMediaItemFromJsonGraphql",error:g,data:b,random:.001})}return a(f&&f.url&&f.filename?f:{error:1})})},getMediaDataFromJsonGraphqlItem:function(a,b){var c,d,e,f;if(a.is_video)c=a.video_url,d=this.getFileNameFromVideoLink(c,b),e="video",f=a.display_url;else{if(c=a.display_url,!c){var g=0,h=0;a.display_resources.forEach(function(a){(a.config_width>g||a.config_height>h)&&(g=a.config_width,h=a.config_height,c=a.src)})}d=this.getFileNameFromImageLink(c,b),e="photo",f=c}return{url:c,filename:d,type:e,prev:f}},getAllMediaDataFromJsonGraphql:function(a,b){return this.requestJSONgraphqlByShortCode(b,function(b){if(!b||b.error)return a(b);try{var c=b.graphql.shortcode_media.owner.username,d=b.graphql.shortcode_media.edge_sidecar_to_children&&b.graphql.shortcode_media.edge_sidecar_to_children.edges,e=[];if(Array.isArray(d)&&d.length)d.forEach(function(a){var b=storyUtils.getMediaDataFromJsonGraphqlItem(a.node,c);"object"==typeof b&&b.url&&b.filename&&b.type&&b.prev&&e.push(b)});else{var f=storyUtils.getMediaDataFromJsonGraphqlItem(b.graphql.shortcode_media,c);"object"==typeof f&&f.url&&f.filename&&f.type&&f.prev&&e.push(f)}a(e)}catch(g){return storyUtils.trackErrorParseAjaxResponse({method:"getAllMediaDataFromJsonGraphql",error:g,data:b,random:.001}),a({error:1})}})},getFileNameFromLink:function(a,b){return"string"!=typeof a?null:/\.(png|jpg)/.test(a)?storyUtils.getFileNameFromImageLink(a,b):/\.(mp4|flv)/.test(a)?storyUtils.getFileNameFromVideoLink(a,b):null},getFileNameFromVideoLink:function(a,b){if("string"!=typeof a)return null;var c="mp4";-1!==a.indexOf(".flv")&&(c="flv");var d=a.match(/\/([^\/?]+)(?:$|\?)/);return d=d&&d[1],d||(d=Math.floor(1e4*Math.random())+"noname."+c),b&&(d=b+"_"+d),this.filename.modify(d)},getFileNameFromImageLink:function(a,b){if("string"!=typeof a)return null;var c="jpg";-1!==a.indexOf(".png")&&(c="png");var d=a.match(/\/([^\/?]+)(?:$|\?)/);return d=d&&d[1],d||(d=Math.floor(1e4*Math.random())+"_noname."+c),b&&(d=b+"_"+d),this.filename.modify(d)},trackEvent:function(a,b){var c={action:"trackEvent",event:a};"undefined"!=typeof b&&(c.details=JSON.stringify(b)),chrome.runtime.sendMessage(c)},trackEventWithRandom:function(a,b,c){c||(c=.05),Math.random()<c&&this.trackEvent(a,b)},trackFailedAjaxRequest:function(a){var b=a.res&&JSON.stringify(a.res.responseJSON);b=b||a.res&&a.res.responseText,b=b?b.substr(0,1500):null;var c=a.res&&a.res.status;storyUtils.trackEventWithRandom("fail_ajax_request",{method:a.method,url:a.url,resStatus:c,res:b},a.random)},trackUnknownAjaxResponse:function(a){storyUtils.trackEventWithRandom("unknown_ajax_response",{method:a.method,url:a.url,data:a.data},a.random)},trackErrorParseAjaxResponse:function(a){storyUtils.trackEventWithRandom("error_parse_ajax_response",{method:a.method,url:a.url,error:a.error,data:a.data},a.random)},trackEventPost:function(a,b,c){var d={action:"trackEventPost",url:b,event:a,details:c};chrome.runtime.sendMessage(d)},trackCodeError:function(a,b){return"object"!=typeof JSON||"function"!=typeof JSON.stringify?void chrome.runtime.sendMessage({action:"trackEvent",event:"no_json_object"}):void chrome.runtime.sendMessage({action:"trackEvent",event:"code_error",details:JSON.stringify({method:b,name:a.name,message:a.message,stack:a.stack,additional_info:a.additional_info||""})})},filename:{rtrim:/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,illegalRe:/[\/\?<>\\:\*\|"~]/g,controlRe:/[\x00-\x1f\x80-\x9f]/g,reservedRe:/^\.+/,partsRe:/^(.+)\.([a-z0-9]{1,4})$/i,specialChars:"nbsp,iexcl,cent,pound,curren,yen,brvbar,sect,uml,copy,ordf,laquo,not,shy,reg,macr,deg,plusmn,sup2,sup3,acute,micro,para,middot,cedil,sup1,ordm,raquo,frac14,frac12,frac34,iquest,Agrave,Aacute,Acirc,Atilde,Auml,Aring,AElig,Ccedil,Egrave,Eacute,Ecirc,Euml,Igrave,Iacute,Icirc,Iuml,ETH,Ntilde,Ograve,Oacute,Ocirc,Otilde,Ouml,times,Oslash,Ugrave,Uacute,Ucirc,Uuml,Yacute,THORN,szlig,agrave,aacute,acirc,atilde,auml,aring,aelig,ccedil,egrave,eacute,ecirc,euml,igrave,iacute,icirc,iuml,eth,ntilde,ograve,oacute,ocirc,otilde,ouml,divide,oslash,ugrave,uacute,ucirc,uuml,yacute,thorn,yuml".split(","),specialCharsList:[["amp","quot","lt","gt"],[38,34,60,62]],specialCharsRe:/&([^;]{2,6});/g,rnRe:/\r?\n/g,re1:/[\*\?"]/g,re2:/</g,re3:/>/g,spaceRe:/[\s\t\uFEFF\xA0]+/g,dblRe:/(\.|!|\?|_|,|\-|:|\+){2,}/g,re4:/[\.,:;\/\-_\+=']$/g,decodeUnicodeEscapeSequence:function(a){var b=/\\(\\u[0-9a-f]{4})/g;try{return JSON.parse(JSON.stringify(a).replace(b,"$1"))}catch(c){return a}},decodeSpecialChars:function(a){var b=this;return a.replace(this.specialCharsRe,function(a,c){var d=null;if("#"===c[0])return d=parseInt(c.substr(1)),isNaN(d)?"":String.fromCharCode(d);var e=b.specialCharsList[0].indexOf(c);return-1!==e?(d=b.specialCharsList[1][e],String.fromCharCode(d)):(e=b.specialChars.indexOf(c),-1!==e?(d=e+160,String.fromCharCode(d)):"")})},trim:function(a){return a.replace(this.rtrim,"")},getParts:function(a){return a.match(this.partsRe)},modify:function(a){if(!a)return"";a=this.decodeUnicodeEscapeSequence(a);try{a=decodeURIComponent(a)}catch(b){a=unescape(a)}if(a=this.decodeSpecialChars(a),a=a.replace(this.rnRe," "),a=this.trim(a),a=a.replace(this.re1,"").replace(this.re2,"(").replace(this.re3,")").replace(this.spaceRe," ").replace(this.dblRe,"$1").replace(this.illegalRe,"_").replace(this.controlRe,"").replace(this.reservedRe,"").replace(this.re4,""),a.length<=this.maxLength)return a;var c=this.getParts(a);return c&&3==c.length?(c[1]=c[1].substr(0,this.maxLength),c[1]+"."+c[2]):a}},fixForeach:function(){"undefined"==typeof NodeList.prototype.forEach&&(NodeList.prototype.forEach=Array.prototype.forEach),"undefined"==typeof HTMLCollection.prototype.forEach&&(HTMLCollection.prototype.forEach=Array.prototype.forEach)},isValidUrl:function(a){return!("string"!=typeof a||-1!=a.indexOf("blob:")||!a.match(/\.(png|jpg|mp4|flv)/))},isJqueryAjaxInstance:function(a){return"object"==typeof a&&a.hasOwnProperty("readyState")&&"function"==typeof a.success},getNewQueryHashes:function(a){chrome.runtime.sendMessage("getNewQueryHashes",a)},setNewWorkingQueryHash:function(a,b){chrome.runtime.sendMessage({action:"setNewWorkingQueryHash",query_hash:a,type:b})},getWorkingQueryHashes:function(){chrome.runtime.sendMessage("getWorkingQueryHashes",function(a){a&&(storyUtils.workingQueryHashOwner=a.owner,storyUtils.workingQueryHashSaved=a.saved)})},removeNotWorkingQueryHash:function(a,b){chrome.runtime.sendMessage({action:"removeNotWorkingQueryHash",query_hash:a,type:b})},downloadFile:function(a,b){return storyUtils.downloadByChromeApi(a,b)},downloadByChromeApi:function(a,b){chrome.runtime.sendMessage({action:"downloadFile",options:{url:a.url,filename:a.filename,isStory:"undefined"!=typeof a.isStory}},function(a){"function"==typeof b&&b(a)})}}}();