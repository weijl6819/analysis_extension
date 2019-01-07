
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
chrome.runtime.sendMessage({"msg-type":"track-tab"},function(tabId,addOns){if(!tabId){return}document.onreadystatechange=function(){if(document.readyState=="interactive"){var scriptInfo=[],a,l,i,si,oh=document.documentElement.offsetHeight;for(a=-1,l=document.querySelectorAll("script,head");++a<l.length;){i=l[a];si=scriptInfo[a]={};try{si.page=document.location.toString();si.src=i.src.toString();if(i.parentElement.tagName=="HEAD"){si.location="HEAD"}else{i.setAttribute("style","display:block !important;position:relative !important;width:0 !important;height: 0!important; overflow:hidden !important;");si.location="BODY "+(i.getBoundingClientRect().top/oh*100>>0)+"%";i.setAttribute("style","")}si.async=i.async}catch(e){}}var details={"msg-type":"script-info","script-info":scriptInfo};chrome.runtime.sendMessage(details,function(e){})}};window.addEventListener("WASP.background",function(e){chrome.runtime.sendMessage(e.detail,function(keepTracking){})});var scr=document.createElement("script");var inline="("+function(){var WASP={};WASP.trackUrlInitiator=function(owner,url,call){if(!url){return}try{throw new Error("WASP.buildStack")}catch(e){var stackParts=e.stack.split(e.stack.charAt(22)),from="";while((from=stackParts.pop()).match(/WASP\./));from=(from.match(/http[^)]+/)||["",""])[0].replace(/(:[0-9]+){1,2}$/,"");if(!from){return}var anchor=document.createElement("a");anchor.href=from;from=anchor.href;anchor.href=url;url=anchor.href;var event=document.createEvent("CustomEvent");event.initCustomEvent("WASP.background",true,true,{"msg-type":"initiator","owner-url":owner,"initiator-to":url,"initiator-from":from,"initiator-call":call});window.dispatchEvent(event)}};WASP.srcProperty={enumerable:true,get:function(){return this.getAttribute("src")},set:function(value){WASP.trackUrlInitiator(this.ownerDocument.location.href,value,this.tagName+".src");this.setAttribute("src",value)}};WASP.Image=window.Image;Image=window.Image=function(width,height){var i=new WASP.Image(width,height);Object.defineProperty(i,"src",WASP.srcProperty);return i};WASP.createElement=window.document.createElement;window.document.createElement=function(tagName,typeExtension){var el=WASP.createElement.call(document,tagName,typeExtension);switch(tagName.toLowerCase()){case"img":case"script":case"iframe":Object.defineProperty(el,"src",WASP.srcProperty);break}return el};WASP.checkBeforeInsert=function(child,owner,call){var checkList=[child],check;while(checkList.length){check=checkList.shift();for(var a=(check.childNodes||[]).length;a--;checkList.push(check.childNodes[a]));switch((check.tagName||"").toLowerCase()){case"img":case"script":case"iframe":WASP.trackUrlInitiator((owner.location||document.location).href,check.src,call+"("+check.tagName+")");default:break}}};WASP.Element=Element||window.Element;WASP.appendChild=WASP.Element.prototype.appendChild;WASP.Element.prototype.appendChild=function(child){WASP.checkBeforeInsert(child,this.ownerDocument||document,this.tagName+".appendChild");return WASP.appendChild.call(this,child)};WASP.insertBefore=WASP.Element.prototype.insertBefore;WASP.Element.prototype.insertBefore=function(child,anchor){WASP.checkBeforeInsert(child,this.ownerDocument||document,this.tagName+".insertBefore");return WASP.insertBefore.call(this,child,anchor)};WASP.replaceChild=WASP.Element.prototype.replaceChild;WASP.Element.prototype.replaceChild=function(newChild,oldChild){WASP.checkBeforeInsert(newChild,this.ownerDocument||document,this.tagName+".replaceChild");return WASP.replaceChild.call(this,newChild,oldChild)};WASP.XMLHttpRequest=XMLHttpRequest||window.XMLHttpRequest;WASP.XHRopen=WASP.XMLHttpRequest.prototype.open;WASP.XMLHttpRequest.prototype.open=function(method,url,async,user,password){var und;WASP.trackUrlInitiator(document.location.href,url,"XMLHttpRequest.open("+method+")");WASP.XHRopen.apply(this,arguments)};WASP.write=(document||window.document).write;(document||window.document).write=function(markup){var tags=markup.match(/<(?:script|iframe|img)[^>]*>/gi)||[];for(var a=tags.length;a--;){var src=(tags[a].match(/src="([^"]+)"/i)||["",""])[1];if(src){WASP.trackUrlInitiator(document.location.href,src,"document.write()")}}WASP.write.call(this,markup)};WASP.writeln=(document||window.document).writeln;(document||window.document).writeln=function(line){var tags=line.match(/<(?:script|iframe|img)[^>]*>/gi)||[];for(var a=tags.length;a--;){var src=(tags[a].match(/src="([^"]+)"/i)||["",""])[1];if(src){WASP.trackUrlInitiator(document.location.href,src,"document.writeln()")}}WASP.writeln.call(this,line)};WASP.datalayer={name:"",stack:[],count:0};WASP.datalayer.send=function(){var dl=WASP.datalayer.stack,msg={"msg-type":"datalayer","for":WASP.datalayer.name,items:[]},a,l,k,b,kl,v,e;for(a=WASP.datalayer.count-1,l=dl.length;++a<l;){var item=[];if(dl[a]instanceof Object){if(dl[a]instanceof Array){item.push({name:"array",value:dl[a].length})}for(k=Object.keys(dl[a]),b=-1,kl=k.length;++b<kl;){v=dl[a][k[b]];item.push({name:k[b],value:v&&v.toString?v.toString():String(v)})}}else{v=dl[a];item.push({name:typeof v,value:v&&v.toString?v.toString():String(v)})}msg.items.push(item)}if(msg.items.length){WASP.datalayer.count=dl.length;e=document.createEvent("CustomEvent");e.initCustomEvent("WASP.background",true,true,msg);window.dispatchEvent(e)}window.setTimeout(WASP.datalayer.send,500)};WASP.datalayer.tries=0;WASP.datalayer.find=function(){var dl=document.querySelector('script[src*="googletagmanager.com"]');if(dl&&dl.src){WASP.datalayer.name=(dl.src.match(/&l=(.*)$/)||["","dataLayer"])[1];WASP.datalayer.stack=dl=window[WASP.datalayer.name]}if(dl){WASP.datalayer.send()}else if(++WASP.datalayer.tries<5){window.setTimeout(WASP.datalayer.send,1e3*WASP.datalayer.tries)}};window.addEventListener("load",WASP.datalayer.find)}+")();";if(addOns&&addOns.length){for(var a=-1,l=addOns.length;++a<l;){inline+="\n\n"+addOns[a]}}scr.textContent=inline;(document.head||document.documentElement).appendChild(scr);scr.parentNode.removeChild(scr)});