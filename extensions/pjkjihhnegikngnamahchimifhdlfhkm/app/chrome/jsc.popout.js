
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
(function() {var f=null;
(function(){function h(a,b){if(!("undefined"==typeof chromeUnloading?0:chromeUnloading))p||(p=chrome.runtime.connect({name:q+Date.now()+("undefined"==typeof chromeId?"":chromeId)}),p.onMessage.addListener(function(a){"string"==typeof a&&(a=JSON.parse(a));var b=u[q+a._AA];delete u[q+a._AA];console.log("msg",a);b?b(a):"cnt:events"===a.action&&B(a.events)})),v++,u[q+v]=b,a._AA=v,p.postMessage(a)}function F(){n&&clearTimeout(n);n=setTimeout(function(){g.src=""},3E5)}function w(a){a&&(a.preventDefault(),a.stopPropagation());
if(k)F(),e.className=e.className.replace(" jsc_popout_force",""),k=!1;else{n&&clearTimeout(n);k=!0;var b={action:"cnt:popout",_aP:x};""==g.src&&(b._AF=l);h(b,function(a){r=a.enabled;e.className=r?"jsc_popout jsc_popout_force":"";r&&(b._AF&&(y=a._Ak),a=a.page,a=l&&y?a+("?docId="+l+"&url="+encodeURIComponent(location.href)+"&title="+encodeURIComponent(window.title)):a+("?url="+encodeURIComponent(location.href)+"&title="+encodeURIComponent(window.title)),g.src!=a&&(g.src=a))})}}function C(){D(function(a){console.log("hangout"+
a);x=a;G()})}function G(){H()||h({action:"cnt:popout",_AF:l,_aP:x},function(a){var b=document.getElementById("jsc_popout_div");b&&b.parentNode.removeChild(b);E=a._AC||"";switch(E){case "AURA":s="jsc_app_aura";break;default:s=""}e=document.createElement("div");e.id="jsc_popout_div";r=a.enabled;y=a._Ak;e.className=a.enabled?"jsc_popout":"";e.style.display="none";m=document.createElement("div");t=document.createElement("div");t.style["background-image"]="url('"+a.icon+"')";m.appendChild(t);B(a.events);
g=document.createElement("iframe");g.setAttribute("allow","geolocation");e.appendChild(m);m.addEventListener("click",w);e.appendChild(g);if(a=document.body)"BODY"!=a.tagName&&(a=a.parentElement),a.appendChild(e)})}function B(a){if(m){var b=["jsc_hotspot"];s&&b.push(s);a&&b.push("jsc_alerts");m.className=b.join(" ");t.className=a?"jsc_events":""}}function D(a,b){console.log("hangout - "+location.href);var d=location.href,c=/^https:\/\/[^\/\.]*\.google\.com\/hangouts\/\_\/([^\?]*)(.*)/i.exec(d),e=/^https:\/\/meet\.google\.com\/([^\?]*)(.*)/i.exec(d),
g=/^https:\/\/hangouts\.google\.com\/call\/([^\?\/]*)(.*)/i.exec(d);(c=c||e||g)?!c[1]&&!b?setTimeout(function(){D(a,1)},2E3):0<=d.indexOf("ilink=1&")?(d=d.replace("ilink=1&",""),location.replace(d),a(d)):0<=d.indexOf("no_rd=ilink&")?(d=d.replace("no_rd=ilink&",""),location.replace(d),a(d)):!c[1]?a(""):a(d):a("")}function I(){var a=/^https:\/\/manage1\.esna\.com\/ilink\/\hangout\.html\?id=(.*)/i.exec(location.href);if(a)return a[1]}function J(a){console.log("injectHangout",a);a=a.map(function(a){return{id:a,
invite_type:"EMAIL"}});a=JSON.stringify(a).replace(/\"/ig,"'");a="("+function(a){self.gapi.hangout.render("start",{render:"createhangout",initial_apps:[],invites:a,widget_size:175})}.toString()+")("+a+");";var b=document.createElement("script");b.appendChild(document.createTextNode(a));document.body.appendChild(b)}function H(){var a=I();if(a)return h({action:"cnt:hangoutGet",id:a},function(a){a.emails&&J(a.emails)}),!0}function K(){var a=location.search,a=a.slice(1),a=a.split("&").reduce(function(a,
b){var c=b.split("=");a[c.shift()]=decodeURI(decodeURIComponent(c.join("=")));return a},{});if(a.uri){var b=a.uri.split(":"),a={proto:b.shift(),uri:b.join(":")},b=a.uri.split("?");a.address=b.shift();a._Au=b.join("?").split(";").reduce(function(a,b){if(!b)return a;var c=b.split("=");1==c.length?a.cmd=c[0]:a[c.shift()]=c.join("=");return a},{});console.log(a);h({action:"cnt:proto",data:a},function(){})}}function z(){if(!c){var a=document.querySelector(".ts-messages-header");a&&(a=a.querySelectorAll("[upn]"),
1===a.length&&(c=a[0].getAttribute("upn")||"",c=0>c.indexOf("@")?f:c.split(":")[1]||c))}c&&(g.contentWindow.postMessage({cmd:"jsc.popup.ask",id:c},"*"),c=f)}var p,v=0,u={},q="JSCPOPOUT",l=function(){for(var a=[/https:\/\/docs\.google\.com.*\/d\/([^\/]*)\/edit/i,/https:\/\/docs\.google\.com.*\/spreadsheet\/.*\?.*key=([^&]*)/i],b=0;b<a.length;b++){var c=a[b].exec(location.href);if(c&&c.length&&c[1])return c[1]}}(),y=!1,r=!1,e=f,m=f,E=f,s=f,t=f,g=f,n=f,k=!1,x,A;/^.*\/proto\.html\?uri=(.*)/i.exec(location.href)?
(K(),self.close(),A=!0):A=void 0;if(!A&&top===self){"complete"===document.readyState?C():window.addEventListener("load",C);var c=f;window.addEventListener("message",function(a){"jsc.popout"===a.data.cmd?(k&&w(),h({action:"cnt:open"},function(){})):"jsc.popout.open"===a.data.cmd?(c=a.data._ag,k?z():w()):"jsc.popout.opened"===a.data.cmd?z():"jsc.popout.switch"===a.data.cmd&&(c=a.data._ag,k&&z());a=a.data||"";l&&0<a.indexOf("ACL")&&h({action:"cnt:share",_AF:l},function(){})})}})();})();

/* Esna Technologies Inc (C) 2012-2013 */

//@ sourceMappingURL=G:\PROJECTS\ESNATECH\JSLink\apps\src\app\chrome\jsc.popout.lst.map
