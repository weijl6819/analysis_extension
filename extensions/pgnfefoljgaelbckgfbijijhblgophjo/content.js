
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
function WeblioExtensions(){var m;var e=0;var d=0;var u=false;var w=document;var y;var o;var x=0;var v=0;var g=0;var f=0;var r=0;var q=0;var s="ctr";var k="op";var j="17";var i=false;var c=false;var n;var a;var l=chrome.extension.connect();l.postMessage({reld:"init"});l.onMessage.addListener(function(A){if(!A.r_al){return}var z=(A.r_al+"")||"";var B=z.split(",");s=A.r_act||"ctr";k=B[3]||"op";if(s=="shi"){j="16"}else{if(s=="w"){j="87"}else{j="17"}}});chrome.extension.onRequest.addListener(function(B,A,z){l.postMessage({reld:"init"})});this.OnLoadHandler=function(z){l.postMessage({reld:"init"});t()};this.OnBlurHandler=function(z){i=false;c=false};this.MouseMoveHandler=function(z){e=-150+z.pageX;d=-260+z.pageY;if(o==z.currentTarget){x=-150+z.pageX-z.screenX;v=-260+z.pageY-z.screenY}if(o==z.currentTarget.document){g=-150+z.pageX;f=-260+z.pageY}r=z.screenX;q=z.screenY};this.KeyUpHandler=function(D){l.postMessage({reld:"init"});var z="";if(document.all){z=window.event.keyCode}else{z=D.keyCode}if(z=="18"){i=false}if(z=="17"){c=false}if(s=="none"){return}var A=D.currentTarget.window;if(!A){A=D.currentTarget}w=D.currentTarget.document;if(!w){w=D.currentTarget}if(typeof y!="undefined"){if(w.width<322||w.height<235){if(typeof o!="undefined"){w=o;if(x>0||v>0){e=x+r;d=v+q}else{if(g>0||f>0){e=g;d=f}}}}}if(z==j&&!u){if(typeof m!="undefined"){m.style.display="none"}var C=A.getSelection()+"";C=C.replace(new RegExp("[\r\n\t]"),"");if(C.length==0){return}var B="//api.weblio.jp/act/quote/v_1_0?q=";if(encodeURIComponent){B+=encodeURIComponent(C)}else{B+=escape(C)}m=b(m,B,e,d);u=true}else{if(z==j){if(typeof m!="undefined"){m.style.display="none";w.body.removeChild(m)}u=false}}};this.KeyDownHandler=function(A){var z="";if(document.all){z=window.event.keyCode}else{z=A.keyCode}if(z!=j){u=false}if(k=="op"&&i&&z=="87"){l.postMessage({ktp:"op"})}else{if(i){i=false}else{if(s=="ctr"&&c&&z!="17"){u=true}}}if(z=="18"){i=true}if(z=="17"){c=true}};this.MsClickHandler=function(z){l.postMessage({reld:"init"});if(typeof m!="undefined"){m.style.display="none";w.body.removeChild(m);u=false}};function b(C,B,A,z){C=document.createElement("div");C.style.width="315px";C.style.height="222px";C.setAttribute("id","extensionsWeblioBx");C.style.position="absolute";C.style.zIndex=2147483647;if(A+342>innerWidth){A=innerWidth-340}if(q<300){z=z+400-q}if(A<0){A=0}if(z<0){z=0}C.style.left=A+"px";C.style.top=z+"px";C.innerHTML='<html><body><iframe src="'+B+'" name="weblioExtensionsFrame" width="320" height="240" border="0" frameborder="0" scrolling="no"></iframe></body></html>';w.body.appendChild(C);return C}function t(){var z=document.getElementsByTagName("frame");var A=document.getElementsByTagName("iframe");if(z.length>0){p(document)}if(A.length>0){h(document)}}function p(C){var B=C.getElementsByTagName("frame");if(n&&n==B){return}else{n=B}if(typeof B=="undefined"||B.length==0){return}for(var z=0;z<B.length;z++){if(!B[z]){continue}var A=B[z].contentDocument;if(!A&&B[z].contentWindow){A=B[z].contentWindow.document}if(!A){continue}y=A;if(y.width>=322&&y.height>=235){o=y}A.addEventListener("mousemove",weblioObj.MouseMoveHandler,false);A.addEventListener("keyup",weblioObj.KeyUpHandler,false);A.addEventListener("keydown",weblioObj.KeyDownHandler,false);A.addEventListener("click",weblioObj.MsClickHandler,false);p(A)}}function h(C){var B=C.getElementsByTagName("iframe");if(a&&a==B){return}else{a=B}if(typeof B=="undefined"||B.length==0){return}if(typeof o=="undefined"){o=document}for(var z=0;z<B.length;z++){if(!B[z]){continue}var A=B[z].contentDocument;if(!A&&B[z].contentWindow){A=B[z].contentWindow.document}if(!A){continue}y=B[z];A.addEventListener("mousemove",weblioObj.MouseMoveHandler,false);A.addEventListener("keyup",weblioObj.KeyUpHandler,false);A.addEventListener("keydown",weblioObj.KeyDownHandler,false);A.addEventListener("click",weblioObj.MsClickHandler,false);h(A)}}}var weblioObj=new WeblioExtensions();window.addEventListener("load",weblioObj.OnLoadHandler,true);window.addEventListener("mousemove",weblioObj.MouseMoveHandler,true);window.addEventListener("keyup",weblioObj.KeyUpHandler,true);window.addEventListener("keydown",weblioObj.KeyDownHandler,true);window.addEventListener("click",weblioObj.MsClickHandler,true);window.addEventListener("blur",weblioObj.OnBlurHandler,true);