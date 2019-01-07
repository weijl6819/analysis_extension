(function() {(function(){function g(a,b){if(!("undefined"==typeof chromeUnloading?0:chromeUnloading))c||(c=chrome.runtime.connect({name:d+Date.now()+("undefined"==typeof chromeId?"":chromeId)}),c.onMessage.addListener(function(a){"string"==typeof a&&(a=JSON.parse(a));var b=e[d+a._AA];delete e[d+a._AA];b&&b(a)})),f++,e[d+f]=b,a._AA=f,c.postMessage(a)}var c,f=0,e={},d="JSCSSOIM",b=window.location,a=b.hash||b.search||"";if(a){if("#close"==a||"close"==a)return self.close();a=a.substr(1).split("&").reduce(function(a,
b){var c=b.split("=");a[c[0]]=decodeURIComponent(c[1]);return a},{});a.top=self==top;"sso"==a.type&&(a.jabberToken&&a.username)&&(a.jabberHost=b.protocol+"//"+b.host,console.info("WEBEXIM:",a),a.top?g({action:"sso",data:a},function(a){a.close&&self.close()}):(self.location.replace("about:blank"),g({action:"sso",data:a},function(){})))}})();})();

/* Esna Technologies Inc (C) 2012-2013 */

//@ sourceMappingURL=G:\PROJECTS\ESNATECH\JSLink\apps\src\app\chrome\jsc.webexim.lst.map
