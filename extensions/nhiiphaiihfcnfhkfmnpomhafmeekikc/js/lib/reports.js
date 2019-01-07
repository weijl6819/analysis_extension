
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
var ErrorMessage=function(c,b,a){this.e=c;this.initiator=b;this.additionalParams=a;};if(typeof this.IsDefined==="undefined"){this.IsDefined=function(a){return(typeof a!=="undefined")&&!!a;};}var Reports=(function(){var o=false;var k=false;var r=[];var a="";var h={errorHostUrl:"",statsHostUrl:""};var j,n;var l="browser=chrome&ver=__VERSION_PLACE_HOLDER__&bic=__BIC_PLACE_HOLDER__&app=__APP_ID_PLACE_HOLDER__&appver=0&bgver=0&pluginsver=0&installtime=0&curtime=0&lifetime=0&browserver=__BROWSER_VER_PLACE_HOLDER__";var m=chrome.extension.getURL("background.html")===window.location.href;var g=function(v){if(typeof LogFile!=="undefined"){LogFile.write(v);}};var s=function(w,y){var x=(chrome.runtime||chrome.extension).sendMessage||chrome.extension.sendMessage;try{x({action:"_getSharedQueryStringParametersForStats",passCallback:true},function(z){a=z;y(a);});}catch(v){}};var b=function(w,x){try{var v=new XMLHttpRequest();v.open("GET",w+"&rnd="+(new Date()).getTime(),true);v.onreadystatechange=function(){if(v.readyState===4){if(v.status!==200){x=x||0;if(x<10){setTimeout(function(){b(w,x+1);},1000*10);}}}};v.send(null);}catch(y){if(o){UserReport.error(new ErrorMessage(y,"Reports->_sendPixel"));}}};var u=function(){try{var B=new Date();var A=B.getTime().toString(16);var y=[],v="0123456789abcdef";for(var w=0;w<(32-A.length);w++){y[w]=v.substr(Math.floor(Math.random()*16),1);}var x=A+y.join("");return x;}catch(z){Reports.error(new ErrorMessage(z,"Utils->getUID"));}};var f=function(v){if(m){if(typeof Crossrider!=="undefined"&&Crossrider.hasOwnProperty("_getSharedQueryStringParametersForStats")){a=Crossrider._getSharedQueryStringParametersForStats();Installer().getCachedAdditionalInfo(function(w){var x;try{x=JSON.parse(w);}catch(y){}a+="&asw="+(x&&typeof x.asw!=="undefined"?x.asw.join(","):"na");v(a);});}else{v(l.replace("__VERSION_PLACE_HOLDER__",n).replace("__BIC_PLACE_HOLDER__",u()).replace("__APP_ID_PLACE_HOLDER__",j).replace("__BROWSER_VER_PLACE_HOLDER__",parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1],10)));}}else{if(a.length>0){v(a);return;}s({action:"_getSharedQueryStringParametersForStats",passCallback:true},v);}};var p=function(v){if(o){UserReport.error(new ErrorMessage(unescape(v),""));}f(function(w){if(w.length>0&&w!==""){b(h.errorHostUrl+"/ch-error.gif?"+w+"&"+v+"&target="+(m?"bg":"page"));}});};var e=function(v){if(!m){return;}if(IsDefined(v)){f(function(w){if(w.length>0&&w!==""){b(h.statsHostUrl+"/"+v+w);}});}};var q=function(){var v;if(typeof appAPI==="undefined"||typeof appAPI.internal==="undefined"||typeof appAPI.internal.db==="undefined"){v=-1;}else{v=appAPI.internal.db.get("dailyCounter");if(typeof v==="undefined"||v===null){v=0;appAPI.internal.db.set("dailyCounter",v);}else{appAPI.internal.db.set("dailyCounter",v+1);}}return v;};var i=function(v){if(!v){k=true;r.reverse();while(r.length>0){var w=r.pop();w();}}};var d=function(x){var v=chrome.extension.getURL(x);var w=new XMLHttpRequest();w.open("GET",v,false);w.send();return JSON.parse(w.response);};var t=function(z){try{var y=d("Settings.json");h.errorHostUrl=y.crossrider.errorHostUrl;h.statsHostUrl=y.crossrider.statsHostUrl;o=y.is_staging;j=y.crossrider.appID;if(m){var v=d("manifest.json");var x=v.version.split(".");n=[x[0],x[1]].join(".");}}catch(w){}};(function c(){t();}());return{error:function(y){g("Reports.errorMessage: "+y.e.message+", "+y.initiator);var w=parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1],10);if(w<20){return;}if(y&&y.hasOwnProperty("e")&&y.hasOwnProperty("initiator")){var B=y.e;if(B.message.toLowerCase()!=="Attempting to use a disconnected port object".toLowerCase()){var A=y.initiator;A=A&&(typeof A==="string")?A:"";A=A.replace(/ /g,"_");var v=y.additionalParams||"na";var z=B&&B.message?B.message.trim():"";var x=B?B.toString():"";if(x.indexOf(":")>0){x=x.split(":")[0].trim();}else{x="unknown";}var C="msg="+escape(z)+"&errtype="+escape(x)+"&funcName="+escape(A)+"&additionalParams="+escape(v);p(C);}}},dailyStats:function(){g("Reports.dailyStats");var v=q();e("stats.gif?action=daily&counter="+v+"&");},firstInstall:function(){g("Reports.firstInstall");e("install.gif?");},install:function(){g("Reports.install");e("apps.gif?action=install&");},uninstall:function(){e("apps.gif?action=uninstall&");},update:function(v){g("Reports.update");e("apps.gif?action=update&oldver="+(IsDefined(v)?v:"")+"&");}};}());var UserReport=(function(){function a(c){var d="["+new Date().toDateString()+" "+new Date().toLocaleTimeString()+"]";if(IsDefined(c)&&c.hasOwnProperty("e")&&c.hasOwnProperty("initiator")){var h=c.e;var g=c.initiator;g=g&&(typeof g==="string")?g:"unknown";var f=h&&h.message?h.message.trim():"";var b=h?h.toString():"";if(b.indexOf(":")>0){b=b.split(":")[0].trim();}else{b="unknown";}var i="<ErrorType: "+b+", Message: "+f+" ,FuncName: "+g+">";console.log(d+" "+i);}}return{error:function(b){a(b);},surroundCallbackWithTryCatch:function(d,c){var b;if(IsDefined(d)&&typeof d==="function"){b=function(){var f=d;var h=undefined;try{h=f.apply(null,arguments);}catch(g){UserReport.error(new ErrorMessage(g,c));}return h;};}return b;}};}());
