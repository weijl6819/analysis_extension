window.bgReferer={init:function(){chrome.webRequest.onBeforeSendHeaders.addListener(function(e){if("AiIBZRprFDJWWA1FBCVbV0IUEEULRFRBSkAOClBMW0srKUlmRn0nU1h3dRUPCn8MSEdwcRVZDRkOIgZlHl8XBRA3ZXopJQ%3D%3D"===infinity.parseUri(e.url).queryKey.p||"W1dCFBBFC0RUQUpADgpQTFtL"===query.t){for(var r=e.requestHeaders,n=!1,i=0;i<r.length;i++)if("Referer"===r[i].name){n=!0;break}return n?void 0:(r.push({name:"Referer",value:"http://infinitynewtab.com"}),{requestHeaders:r})}},{urls:["http://union.click.jd.com/*"]},["blocking","requestHeaders"])}};