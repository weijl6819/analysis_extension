var kango={event:{MESSAGE:"message"},registerModule:function(b,d){},lang:{evalInSandbox:function(b,d,c){for(var a in d)d.hasOwnProperty(a)&&(arguments.callee[a]=d[a]);eval("(function(){"+c+"\n})();")},evalScriptsInSandbox:function(b,d,c){for(var a="",e=0;e<c.length;e++){for(var f=0;f<c[e].requires.length;f++)a+=c[e].requires[f].text+"\n\n";a+=c[e].text+"\n\n"}return this.evalInSandbox(b,d,a)}},browser:{getName:function(){return null}},console:{log:function(b){"undefined"!=typeof opera?opera.postError(b):
console.log(b)}},io:{},xhr:{send:function(b,d){var c=b.contentType;if("xml"==c||"json"==c)b.contentType="text";kango.invokeAsyncCallback("kango.xhr.send",b,function(a){if(""!=a.response&&null!=a.response)if("json"==c)try{a.response=JSON.parse(a.response)}catch(e){a.response=null}else if("xml"==c)try{var f=null,f="undefined"!=typeof DOMParser?DOMParser:window.DOMParser,g=new f;a.response=g.parseFromString(a.response,"text/xml")}catch(h){a.response=null}b.contentType=c;d(a)})}},_init:function(b){"undefined"==
typeof kango.dispatchMessage&&this._initMessaging();(new kango.UserscriptEngineClient).run(window,b,window==window.top)}};








kango.browser.getName=function(){return"chrome"};kango.io.getResourceUrl=function(a){return chrome.extension.getURL(a)};
kango._initMessaging=function(){var a=[],e=Math.random().toString(),f=chrome.extension.connect({name:window==window.top?"main_"+e:e});f.onMessage.addListener(function(c){c.source=c.target=kango;for(var b=0;b<a.length;b++)a[b](c)});kango.dispatchMessage=function(a,b){f.postMessage({name:a,data:b,origin:"tab",source:null,target:null});return!0};kango.addEventListener=function(c,b){if("message"==c){for(var d=0;d<a.length;d++)if(a[d]==b)return;a.push(b)}};new kango.InvokeAsyncModule(kango);new kango.MessageTargetModule(kango)};
