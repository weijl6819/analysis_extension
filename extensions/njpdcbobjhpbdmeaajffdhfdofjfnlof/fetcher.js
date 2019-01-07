
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
fh={bookmarkletContent:function(){function e(e,t,o){var i=document.createElement(e);return o&&(i.id=o),t&&(i.className=t),i}function t(e,t,o){var i=function(t){t=t||window.event,o.call(e,t)};e.addEventListener?e.addEventListener(t,i,!1):e.attachEvent&&e.attachEvent("on"+t,i)}function o(e){var t=document.getElementById(e);t&&t.parentNode&&t.parentNode.removeChild(t)}function i(){for(var e=["fhPickerNew","fhBG","fhShim"],t=0;t<e.length;t++)o(e[t]);window.scroll(0,p)}function n(){k.style.opacity="0",C.style.opacity="0",setTimeout(i,150)}function a(e){var t=0;e.wheelDelta?t=e.wheelDelta/120:e.detail&&(t=-e.detail/3),(this.scrollTop===this.scrollHeight-this.offsetHeight&&0>t||0===this.scrollTop&&t>0)&&(e.preventDefault&&e.preventDefault(),e.returnValue=!1)}function r(o){var i=e("div","fhImageSquare"),a=document.createElement("img");a.style.opacity="0",a.onload=function(){var e=this.width,t=this.height;if(t>e)var o=v/t,i=t;else var o=v/e,i=e;if(200>e&&200>t)var o=1;var n="small (not recommended)";i>1280?n="x-large "+this.width+"x"+this.height:i>959?n="large "+this.width+"x"+this.height:i>599?n="medium "+this.width+"x"+this.height:i>499&&(n="small "+this.width+"x"+this.height+" (Not Recommended)"),this.parentNode.parentNode.lastChild.innerHTML=n;var a=Math.floor(e*o),r=Math.floor(t*o);this.width=a,this.height=r,this.style.left=Math.floor((f-a)/2)+"px",this.style.top=Math.floor((f-r)/2)+"px",this.style.opacity="1"};var r=e("div","fhImageWrapper");r.appendChild(a);var h=e("div","fhButton");h.innerHTML="Fav at Fancy",r.appendChild(h),i.appendChild(r),i.appendChild(e("div","fhSizeHint")),b.appendChild(i),t(i,"click",function(){var e="http://fancyhype.com/add/?";e+="source="+encodeURIComponent(document.location.href),e+="&title="+encodeURIComponent(document.title),e+="&thumb="+encodeURIComponent(o);var t=Math.floor((screen.width-u)/2),i=Math.floor((screen.height-g)/2);window.open(e,"FANCY"+(new Date).getTime(),"status=no,resizable=yes,scrollbars=yes,personalbar=no,directories=no,location=no,toolbar=no,menubar=no,width="+u+",height="+g+",left="+t+",top="+i),n()}),a.src=o,(a.width>0||a.height>0)&&(a.onload(),a.onload=null)}for(var h=[/facebook\.com$/,/google\.com$/,/flickr\.com$/],d=document.domain,l=0;l<h.length;l++){var c=h[l];if(d.match(c))return void alert("Images from "+d+" are not allowed")}var s=499,m=3,f=200,v=200,u=900,g=480;i();var p=window.pageYOffset;window.scroll(0,0);var w=Math.max(document.body.scrollHeight,document.body.offsetHeight)+"px",y=e("iframe","fhCover","fhShim");y.width="100%",y.height="100%",y.allowTransparency="true",y.style.height=w,document.body.appendChild(y);var C=e("div","fhCover","fhBG");C.style.height=w,document.body.appendChild(C);var k=e("div","fhCover","fhPickerNew");k.innerHTML='<div id="fhPickerHeader"><div id="fhPickerCancel"></div></div><div id="fhPickerImageContainer"></div>',document.body.appendChild(k),t(k.firstChild.firstChild,"click",n);var b=k.lastChild;t(b,"DOMMouseScroll",a),t(b,"mousewheel",a),t(document,"keydown",function(e){27==e.keyCode&&n()});for(var M=[],N={},l=0;l<document.images.length;l++){var x=document.images[l];if(x.src.replace(/\s/g,"")){var H=x.width,I=x.height,T=Math.max(H,I),E=Math.min(H,I);T>=s&&m>=T/E&&!N[x.src]&&(N[x.src]=!0,M.push(x))}}for(var B=!1,D=document.getElementsByTagName("meta"),l=0;l<D.length;l++)if("og:image"==D[l].getAttribute("property")){var L=D[l].getAttribute("content");N[L]||(r(L),B=!0);break}M.length||B||(i(),alert("No images were found or images are too small. Plese try another page.")),M.sort(function(e,t){return t.width*t.height-e.width*e.height});for(var l=0;l<M.length;l++)r(M[l].src)}},chrome.runtime.onMessage.addListener(function(e,t,o){"injectBookmarklet"==e.type&&(fh.bookmarkletContent(),o({success:"It worked!"}))});