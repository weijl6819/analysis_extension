(function(){"use strict";function c(d,e){var f=String.fromCharCode;return d?++e?f((d=d.charCodeAt()+47,126<d?d-94:d)):d.replace(/[^ ]/g,c):d}function d(){return j=o.get(),j?void h():(l++,10>=l?void setTimeout(d,50):void(n.includes("options")?h():n.includes("popup")&&g()))}function e(){return k=p.get(),k?void $("#api_endpoint").attr("placeholder",k):(m++,10>=m?void setTimeout(e,50):void f())}function f(){k="api.dnsdb.info",p.set(k),$("#api_endpoint").attr("placeholder","api.dnsdb.info")}function g(){j||"none"!=$("#popup-cta").css("display")||($("#popup-warning").attr("style","display: block"),$("#popup-form").attr("style","display: block"),$("#popup-cta").attr("style","display: block"))}function h(){var a=new XMLHttpRequest,b="https://"+k+"/lookup/rate_limit?&client="+"Scout"+"&version="+"1.0.5";a.open("POST",b,!0),a.setRequestHeader("Content-type","application/x-www-form-urlencoded"),a.setRequestHeader("X-API-Key",o.get()),a.onreadystatechange=function(){var b=Math.floor,c=Math.sign;if(4==a.readyState&&200==a.status){var e=JSON.parse(a.responseText);if(e.rate.expires){var f=new Date,g=new Date(0),i=new Date;if(g.setUTCSeconds(e.rate.expires),i=(g-f)/1e3,c(i)==0<e.rate.remaining){var j=parseInt(i,10),k=b(j/86400);j-=24*(3600*k);var d=b(j/3600);$("#quota-time").html(k+"d "+d+"h"),$("#quota-time-desc").html("API Time Remaining"),$("#quota-quantity").html(e.rate.remaining),$("#quota-quantity-desc").html("Block Queries Left"),$("#quota-error").attr("style","display: none"),$("#quota-days").attr("style","display: block"),$("#quota-queries").attr("style","display: block"),$("#loading-spinner").removeClass("active"),$("#popup-key-status").attr("style","display: flex"),$("#api_key_message").html("<p id='api_key_message_saved'>Your API Key has been saved. You can now make queries from the <a href='dashboard.html'>Dashboard</a>.</p>"),$("#orange-cta").fadeOut("slow")}else $("#quota-time").html("N/A"),$("#quota-time-desc").html("Expired"),$("#quota-quantity").html("N/A"),$("#quota-quantity-desc").html("Invalid"),$("#quota-error").attr("style","display: block"),$("#quota-days").attr("style","display: block"),$("#quota-queries").attr("style","display: block"),$("#loading-spinner").removeClass("active"),$("#popup-key-status").attr("style","display: none"),$("#popup-warning").attr("style","display: block"),$("#popup-form").attr("style","display: block"),$("#api_key_message").html("<p id='api_key_message_saved'>Your API Key has been saved. You can now make queries from the <a href='dashboard.html'>Dashboard</a>.</p>"),$("#orange-cta").fadeIn("slow")}else if(!e.rate)$("#quota-time").html("?"),$("#quota-time-desc").html("Error"),$("#quota-quantity").html("?"),$("#quota-quantity-desc").html("#91576C"),$("#quota-error").attr("style","display: none"),$("#quota-days").attr("style","display: block"),$("#quota-queries").attr("style","display: block"),$("#loading-spinner").removeClass("active"),$("#popup-key-status").attr("style","display: flex"),$("#api_key_message").html("<p id='api_key_message_saved'>Unknown product API Key set.</p>"),$("#orange-cta").fadeIn("slow");else if(isNaN(e.rate.limit))$("#quota-quantity").html("Unlimited"),$("#quota-quantity-desc").html("Queries Remaining"),$("#quota-error").attr("style","display: none"),$("#quota-days").attr("style","display: none"),$("#quota-queries").attr("style","display: block"),$("#loading-spinner").removeClass("active"),$("#quota-time").html("N/A"),$("#quota-time-desc").html("Time Remaining"),$("#popup-key-status").attr("style","display: flex"),$("#api_key_message").html("<p id='api_key_message_saved'>Your API Key has been saved. You can now make queries from the <a href='dashboard.html'>Dashboard</a>.</p>"),$("#orange-cta").fadeOut("slow");else{var f=b(new Date().getTime()/1e3),h=e.rate.reset,i=new Date(null);i.setSeconds(h-f),i=i.toISOString().substr(11,8),i=i.split(":"),i=i[0]+"h "+i[1]+"m",$("#quota-time").html(i),$("#quota-time-desc").html("Until Quota Reset"),$("#quota-quantity").html(e.rate.remaining),$("#quota-quantity-desc").html("Queries Left"),$("#quota-error").attr("style","display: none"),$("#quota-days").attr("style","display: block"),$("#quota-queries").attr("style","display: block"),$("#loading-spinner").removeClass("active"),$("#popup-key-status").attr("style","display: flex"),$("#api_key_message").html("<p id='api_key_message_saved'>Your API Key has been saved. You can now make queries from the <a href='dashboard.html'>Dashboard</a>.</p>"),$("#orange-cta").fadeOut("slow")}}else 4==a.readyState&&200!==a.status&&($("#quota-time").html("N/A"),$("#quota-time-desc").html("Expired"),$("#quota-quantity").html("N/A"),$("#quota-quantity-desc").html("Invalid"),$("#quota-error").attr("style","display: block"),$("#quota-days").attr("style","display: block"),$("#quota-queries").attr("style","display: block"),$("#loading-spinner").removeClass("active"),$("#popup-warning").attr("style","display: block"),$("#popup-form").attr("style","display: block"),$("#popup-cta").attr("style","display: block"),$("#popup-key-status").attr("style","display: none"),$("#api_key_message").html("<p id='api_key_message_saved'>Invalid, Expired, or no API key is currently set.</p>"),$("#orange-cta").fadeIn("slow"))},a.send("")}var j,k,l=0,m=0,n=window.location.pathname.split("/").pop(),o=function(){return chrome.storage.local.get("DNSDB_API_Key",function(a){j=c(a.DNSDB_API_Key)}),{get:function(){return j?c(j):""},set:function(a){chrome.storage.local.set({DNSDB_API_Key:c(a)},function(){})},clear:function(){chrome.storage.local.set({DNSDB_API_Key:""},function(){}),j=""}}}(),p=function(){return chrome.storage.local.get("DNSDB_API_Endpoint",function(a){k=a.DNSDB_API_Endpoint}),{get:function(){return k},set:function(a){chrome.storage.local.set({DNSDB_API_Endpoint:a},function(){})},clear:function(){chrome.storage.local.set({DNSDB_API_Endpoint:"api.dnsdb.info"},function(){}),k=""}}}(),q=function(){return{clear:function(){chrome.storage.local.set({DNSDB_recent_queries:[]},function(){})}}}();e(),d();for(var r,s=document.querySelectorAll("form"),t=0;t<s.length;t++)r=s[t],r.addEventListener("submit",()=>{event.preventDefault()}),r.addEventListener("keypress",()=>{13==event.keyCode&&event.preventDefault()});$(document).on("click","#api_key_set",function(){j=$("#api_key").val().trim(),o.set(j),$("#api_key").val(""),$("#api_key_message").html("<p id='api_key_message_saved'>Validating API Key...</p>"),$("#api_key_message").removeClass("hidden"),$("#loading-spinner").addClass("active"),l=0,setTimeout(d,200)}),$(document).on("click","#api_key_clear",function(){j="",o.clear(),$("#api_key").val(""),$("#api_key_message").html("<p id='api_key_message_cleared'>Your API Key has been cleared.</p>"),$("#api_key_message").removeClass("hidden"),$("#loading-spinner").addClass("active"),l=0,setTimeout(d,200)}),$(document).on("click","#api_endpoint_set",function(){k=$("#api_endpoint").val().trim(),p.set(k),$("#api_endpoint").val(""),$("#api_endpoint").attr("placeholder",k),$("#api_endpoint_message").html("<span>Endpoint saved: "+k+"</span><br><span>Please reload the query tab/page if it's already open.</span>"),$("#api_endpoint_message").removeClass("hidden"),m=0,setTimeout(e,200),$("#loading-spinner").addClass("active"),h()}),$(document).on("click","#clear-all",function(){o.clear(),m=0,setTimeout(e,200),p.clear(),l=0,setTimeout(d,200),q.clear(),$("#clear-all-message").html("<span>All settings and history has been cleared.</span>"),$("#clear-all-message").removeClass("hidden")}),$(".ui.accordion").accordion(),$("#api-endpoint-info").popup(),$("#clear-all-info").popup(),$(document).on("click","#advanced-section",function(){$("#advanced-section").hasClass("active")?$("#advanced-section-icon").removeClass("plus").addClass("minus"):($("#advanced-section-icon").removeClass("minus").addClass("plus"),$("#api_endpoint_message").addClass("hidden"),$("#clear-all-message").addClass("hidden"))})})();