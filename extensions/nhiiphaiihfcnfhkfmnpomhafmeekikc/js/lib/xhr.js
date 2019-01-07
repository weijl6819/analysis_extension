
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
var XHR=function(d){var v=[200,201,202,203,204,205,206,207,226];var n=d;var j=d.callback;var l=(d.method||"get").toUpperCase();var m=d.data||null;var r=d.type||"text";var s=d.async;var k=new XMLHttpRequest();k.open(l,d.url,d.async);var a=false;var o=(typeof d.contentType==="string")?d.contentType:"application/x-www-form-urlencoded";var t=d.responseDataType;var c=d.additionalRequestHeaders;i();if(l==="POST"){k.setRequestHeader("Content-Type",o);m=h(m);}function i(){if(typeof c==="object"){for(var w in c){if(c.hasOwnProperty(w)){k.setRequestHeader(w,c[w]);}}}}function h(z){var x="";try{if(typeof z==="string"){return z;}if(typeof z!=="object"){return null;}if(typeof o==="string"&&o.toLowerCase().indexOf("json")>-1){x=JSON.stringify(z);}else{for(var w in z){if(z.hasOwnProperty(w)){if(x!==""){x+="&";}if(typeof z[w]!=="string"&&typeof z[w]!=="number"){return null;}x+=escape(w)+"="+escape(z[w]);}}}}catch(y){}return x;}function p(z){var C;try{if(typeof z==="string"){var w=0,y=1;z=z.replace(/\r\n/g,"\n");if(z.lastIndexOf("\n")+1==z.length){z=z.trim();}var x=z.split("\n");C={};x.forEach(function(E){var D=E.split(": ");C[D[w]]=D[y];});}}catch(B){var A="_toHeadersObject, IsDefined:"+typeof IsDefined+",Remove:"+typeof[].remove;if(typeof Reports!=="undefined"){Reports.error(new ErrorMessage(B,A));}}return C;}function g(){var w={};try{var x=(typeof k.getAllResponseHeaders==="function")?k.getAllResponseHeaders():undefined;w=p(x);}catch(y){q(y,"_headersToObject,IsDefined:"+typeof IsDefined+",ResponseHeaders:"+typeof ResponseHeaders);}return w;}function b(x){var w="XHR EXCEPTION: "+x.message+", CODE: "+x.code+"\nURL: "+n.url+", METHOD: "+l+", IS ASYNC: "+n.async;if(typeof LogFile!=="undefined"){LogFile.write("file: xhr.js, function: _handleSendException, "+w);}if(typeof(Crossrider)!=="undefined"){Crossrider.Utils.internalDebug(w);}u(x);}function f(){try{if(k.readyState===4){if(v.indexOf(k.status)>=0||(!s&&k.status===0)){var w=k[r==="xml"?"responseXML":"responseText"];if(s&&typeof j==="function"){var x=g();if((typeof t==="string"&&t.toLowerCase().indexOf("json")>-1)){try{w=JSON.parse(w);}catch(y){}}j({call:"success",response:w,additionalInfo:{headers:x}});}else{return w;}}else{if(s&&typeof j==="function"){u(k.status);}else{return null;}}}}catch(y){q(y,"_onReadyStateChange");}}function u(x){try{if(s&&typeof j==="function"&&!a){a=true;j({call:"failure",response:x});}}catch(w){q(w,"_callFailureCallback");}}function q(x,w){if(typeof Reports!=="undefined"){Reports.error(new ErrorMessage(x,w));}}var e=function(){try{if(s){try{k.onreadystatechange=f;k.send(m);}catch(w){b(w);}}else{try{k.send(m);}catch(w){b(w);return null;}return f();}}catch(w){q(w,"send");}};return{send:e};};
