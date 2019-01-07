
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

!function(){"use strict";var e,r;function t(n,i,o){var u,s,a,p;if(u=n.match(/^((\.)?.*\/|)(.[^.]*|)(\..*|)$/),s=new URL(u[1]+u[3]+(u[3]&&(u[4]||".js")),u[2]?i:r.paths[0]).href,(a=e[s]=e[s]||{e:void 0,m:void 0,p:void 0,r:void 0,s:void 0,t:void 0,u:s}).p||(a.p=new Promise(function(r,n){(p=a.r=new XMLHttpRequest).onload=p.onerror=p.ontimeout=function(){var i,o,u,l,c=0;if(p=a.r){if(a.r=null,p.status>99&&(s=p.responseURL)!=a.u){if(e[s])return(a=e[a.u]=e[s]).p.then(r,n),void(a.r&&(i=a.r,a.r=p,i.abort(),i.onload()));e[s]=a}if(p.status>99&&p.status<400){if(a.s=p.responseText,a.t=p.getResponseHeader("Content-Type"),o=function(){--c<0&&r(a)},p.timeout)for(u=/require(?:\.resolve)?\((?:"((?:[^"\\]|\\.)+)"|'((?:[^'\\]|\\.)+)')\)/g;null!==(l=u.exec(a.s));)(i=t(l[1]||l[2],s,!0)).r&&(c++,i.p.then(o,o));o()}else n(a.e=new Error(s+" "+p.status))}}})),p=p||!o&&a.r)try{p.abort(),p.timeout=o?1e4:0,p.open("GET",s,o),p.send()}catch(e){p.onerror()}if(a.e)throw a.e;return a}function n(e,r){var t;return e.m||((t=e.m={children:new Array,exports:Object.create(null),filename:e.u,id:e.u,loaded:!1,parent:r,paths:r.paths.slice(),require:void 0,uri:e.u}).require=i(t),r.children.push(t),"application/json"==e.t?t.exports=JSON.parse(e.s):new Function("exports,require,module,__filename,__dirname",e.s+"\n//# sourceURL="+t.uri)(t.exports,t.require,t,t.uri,t.uri.match(/.*\//)[0]),t.loaded=!0),e.m}function i(e){function i(o,u,s){var a;function p(t){var a=/package\.json$/;return a.test(t.u)&&!a.test(u)?(e=n(t,e),i(o,e.exports.main,s)):1===o?t.u:2===o?["."===u[0]?e.uri.match(/.*\//)[0]:r.uri]:n(t,e).exports}return e=-1===e?(a=self.Tarp&&self.Tarp.require&&self.Tarp.require.config||{},r={children:[],paths:a.paths||[new URL("./node_modules/",location.href).href],uri:a.uri||location.href}):e,s?new Promise(function(r,n){t(u,e.uri,s).p.then(p).then(r,n)}):p(t(u,e.uri,s))}var o=i.bind(void 0,0);return o.resolve=i.bind(o,1),o.resolve.paths=i.bind(o.resolve,2),o}e=Object.create(null),(self.Tarp=self.Tarp||{}).require=i(-1)}();