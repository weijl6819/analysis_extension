$.warning=function(){var e={init:function(){e.urlWhitelist=[],e.getExtensionApi().storage.local.get("dont-block-whitelist",function(t){void 0!==t["dont-block-whitelist"]&&(e.urlWhitelist=JSON.parse(t["dont-block-whitelist"]),void 0),e.populateContent(),$(document).on("click","#safe-search-continue",function(t){e.continueToUrl(t)}),$(document).on("click","#back-to-safety",function(t){e.backToSafety(t)})})},populateContent:function(){var t=e.getUrlParams("url"),i=e.getUrlParams("threat"),n=$(".blocked-content-injector"),o=n.html().replace("{url}",t).replace("{linkurl}",t).replace("{short-url}",t).replace("{category}",e.enum.threatType[i].name).replace("{description}",e.enum.threatType[i].description);n.html(o)},continueToUrl:function(t){t.preventDefault(),void 0;var i=$(t.currentTarget),n=i.parents(".blocked-content-injector").find("#trustUrl"),o=e.getExtensionApi(),r=n.data("url"),a=-1!=i.attr("href").indexOf("?")?"&":"?",s=i.attr("href")+a+"SafeSearchIgnore",c=i.attr("target");if(0!=s.indexOf("http")&&(s="http://"+s),n.is(":checked")){r=r.replace("https://www.","").replace("http://www.","").replace("https://","").replace("http://","").replace(/^www\./g,"");var l=new RegExp(/(\/.*)/,"g"),u=l.exec(r);null!=u&&(r=r.replace(u[0],"")),void 0,void 0,-1==$.inArray(r,e.urlWhitelist)?(e.urlWhitelist.push(r),o.runtime.sendMessage("ljeoncllgjickobhpgkfaogcmogkagjg",JSON.stringify({whitelist:e.urlWhitelist}),function(e){void 0,window.open(s,c)}),o.storage.local.set({"dont-block-whitelist":JSON.stringify(e.urlWhitelist)},function(e){void 0})):window.open(s,c)}else window.open(s,c)},backToSafety:function(e){e.preventDefault();try{window.history.go(-1)}catch(e){window.open("https://search.pcprotect.com/","_self")}},getExtensionApi:function(){return"undefined"!=typeof browser?browser:"undefined"!=typeof chrome?chrome:(void 0,null)},getUrlParams:function(e){void 0;var t,i,n=window.location.search.substring(1),o=n.split("&");for(i=0;i<o.length;i++)if(t=o[i].split("="),t[0]===e)return void 0===t[1]||decodeURIComponent(t[1])},enum:{threatEntryType:{THREAT_ENTRY_TYPE_UNSPECIFIED:{},URL:{},IP_RANGE:{},EXECUTABLE:{}},platformType:{PLATFORM_TYPE_UNSPECIFIED:{},WINDOWS:{},LINUX:{},ANDROID:{},OSX:{},IOS:{},ANY_PLATFORM:{},ALL_PLATFORMS:{},CHROME:{}},category:{},threatType:{SAFE:{name:"No Threat",description:""},THREAT_TYPE_UNSPECIFIED:{name:"Unknown",description:"This url has been identified as potentially harmful.  Attackers may trick you into doing something dangerous that could comprimise your security."},VIRUSINFECTED:{name:"Virus ",description:"This url has been identified as containing deceptive content.  Attackers may trick you into doing something dangerous that could compromise your security."},SPYWARE:{name:"Spyware",description:"This ur; has been identified as containing deceptive content.  Attackers may trick you into doing something dangerous that could compromise your security."},PHISHING:{name:"Phishing",description:"This url has been identified as containing deceptive content.  Attackers  may trick you into doing something dangerous that could compromise your security."},MALWARE:{name:"Malware",description:"This url has been identified as containing deceptive & malicious content.  Attackers may trick you into doing something dangerous that could compromise your security. "},SOCIAL_ENGINEERING:{name:"Social Engineering",description:"This url has been identified as containing deceptive content.  Attackers may trick you into doing something dangerous that could compromise your security. "},UNWANTED_SOFTWARE:{name:"Unwanted Software",description:"This url has been identified as containing unwanted software.  This program likely contains adware, spyware or other intrusive and malicious behavior. "},POTENTIALLY_HARMFUL_APPLICATION:{name:"Harmful Application",description:"This url has been identified as containing unwanted software.  This program likely contains adware, spyware or other intrusive and malicious behavior."}}}};return e.init(),e}();