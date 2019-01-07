var e=function(){var a=d,b=new XMLHttpRequest;b.open("GET","https://clients1.google.com/searchdomaincheck?format=domain",!1);b.onreadystatechange=function(){4==b.readyState&&200==b.status&&a(b.responseText)};try{b.send()}catch(c){}};/*
 Copyright 2009 Google Inc.  All Rights Reserved.
 Your use of this software is subject to the Terms of Service located
 at https://chrome.google.com/extensions/intl/en/gallery_tos.html.
*/
function d(a){a&&0<a.length&&0==a.indexOf(".")&&(window.localStorage.request_domain="https://www"+a+"/");(a=window.localStorage.request_domain)&&0==a.indexOf("https://www.google")||(window.localStorage.request_domain="https://www.google.com/");window.localStorage.already_run||(chrome.tabs.create({url:"options.html"}),window.localStorage.already_run=!0)};chrome.tabs.onUpdated.addListener(function(a,b,c){-1==c.url.indexOf("chrome://")&&-1==c.url.indexOf("chrome-extension://")&&-1==c.url.indexOf("file://")||chrome.pageAction.setIcon({tabId:a,path:"images/sp-disabled-19.png"});chrome.pageAction.show(a)});
window.addEventListener("load",function(){chrome&&(chrome.runtime.onMessage.addListener(function(a,b,c){switch(a.command){case "get_request_domain":c(window.localStorage.request_domain);break;case "set_request_domain":window.localStorage.request_domain=a.data}}),e())},!1);
