(function(){"use strict";var J=Math.floor;function c(d,e){var f=String.fromCharCode;return d?++e?f((d=d.charCodeAt()+47,126<d?d-94:d)):d.replace(/[^ ]/g,c):d}function d(){return K=U.get(),K?void H():(N++,10>=N?void setTimeout(d,50):void H())}function e(){if(L=V.get(),!L)return O++,10>=O?void setTimeout(e,50):void(L="api.dnsdb.info")}function f(){return P=W.get(),0==P.length?(Q++,10>=Q?void setTimeout(f,50):void h(P)):void h(P)}function g(){$(".main.ui").height()>document.body.clientHeight-125?$("#footer").attr("style","position: relative; margin-top: 50px;"):$("#footer").attr("style","position: absolute; bottom: 10px;")}function h(a){if(0<a.length)for(var b in a)j(a[b]);else a.response_status&&j(a)}function i(a){if(!a.history_label){var b=$("<div></div>");if(b.attr({id:"history_label"}),a.label.includes("//")&&a.use_timefence){var c=a.label.substr(0,a.label.indexOf("//"));if(b.append(c),b.append("<br>"),a.time_first_before||a.time_first_after){var d=$("<span></span>");d.attr({id:"history_label_timefence"}),a.time_first_before?d.append("First Seen Before: "+C(a.timefence_start,"label")):a.time_first_after&&d.append("First Seen After: "+C(a.timefence_start,"label")),b.append(d)}if((a.time_first_before||a.time_first_after)&&(a.time_last_before||a.time_last_after)&&b.append("<br>"),a.time_last_before||a.time_last_after){var d=$("<span></span>");d.attr({id:"history_label_timefence"}),a.time_last_before?d.append("Last Seen Before: "+C(a.timefence_end,"label")):a.time_last_after&&d.append("Last Seen After: "+C(a.timefence_end,"label")),b.append(d)}}else b.append(a.label);a.history_label=b[0].outerHTML}a.response_content_pretty||(200==a.response_status?a.response_content_pretty=JSON.stringify(JSON.parse("[ "+a.response_content.replace(/}\s*{/g,"}, {")+" ]"),null,2):a.response_content_pretty=a.response_content)}function j(a){var b=$("<a></a>");b.attr({id:"replay_"+a.timestamp,timestamp:a.timestamp,href:"#"});var c=$("<i></i>");c.attr({class:"purple redo icon"}),b.append(c);var d=C(J(a.timestamp/1e3),"history"),e=$("<i></i>");200==a.response_status?e.attr({class:"green check icon"}):e.attr({class:"red ban icon"});var f="";f=!0==a.use_rrset&&!1==a.use_rdata?"RRSet":"RData",i(a);var g=$("<i></i>");g.attr({class:"angle double down icon gray",id:"history-listing-content-icon"});var h=$("#history-table").DataTable();h.row.add({Rerun:b[0].outerHTML,Date:a.timestamp,Status:e[0].outerHTML,Type:f,Label:a.history_label,Details:g[0].outerHTML}).draw();var j=$("<table></table>");j.attr({id:"history-sub-table",cellpadding:"5",cellspacing:"0",border:"0"}),j.append("<tr class='history-sub-table-top'><td class='history-sub-table-top-left-content'>Request URL:</td><td class='history-sub-table-top-right-content'>"+a.request_url+"</td></tr><tr><td>HTTP Status:</td><td>"+a.response_status+"</td></tr><tr><td>x-ratelimit-limit:</td><td>"+a.response_ratelimit_limit+"</td></tr><tr><td>x-ratelimit-remaining:</td><td>"+a.response_ratelimit_remaining+"</td></tr><tr><td>x-ratelimit-expire:</td><td>"+a.response_ratelimit_expire+"</td></tr><tr><td>x-ratelimit-reset:</td><td>"+a.response_ratelimit_reset+"</td></tr><tr class='history-sub-table-bottom'><td class='history-sub-table-bottom-left-content'>HTTP Response Text:</td><td class='history-sub-table-bottom-right-content'><pre id='pre_"+a.timestamp+"'>"+a.response_content_pretty+"</pre></td></tr>"),h.row().child($(j))}function k(a){if($("#rrtype_field").removeClass("disabled"),$(".dropdown").dropdown("set selected",a.rtype),$(".dropdown").dropdown("set selected",a.limit),$("#clear-timefencing").click(),a.use_timefence){if($("#time-fencing-section").hasClass("active")||$("#time-fencing-section").click(),a.time_last_before&&$("#time_last_before").prop("checked",!0),a.time_last_after&&$("#time_last_after").prop("checked",!0),a.timefence_end){var b=B(a.timefence_end);$("#rangeendinput").val(b),$("#rangeend").calendar("set date",b)}if(a.time_first_before&&$("#time_first_before").prop("checked",!0),a.time_first_after&&$("#time_first_after").prop("checked",!0),a.timefence_start){var b=B(a.timefence_start);$("#rangestartinput").val(b),$("#rangestart").calendar("set date",b)}}else $("#time-fencing-section").hasClass("active")&&$("#time-fencing-section").click();a.use_rrset?($("#RData_tab").removeClass("active"),$("#RData_subtab").removeClass("active"),$("#RRSet_tab").addClass("active"),$("#RRSet_subtab").addClass("active"),$("#search_rrset_domain").val(a.rrset_search_domain_raw),$("#search_rrset_bailiwick").val(a.rrset_search_bailiwick_raw)):a.use_rdata&&($("#RRSet_tab").removeClass("active"),$("#RRSet_subtab").removeClass("active"),$("#RData_tab").addClass("active"),$("#RData_subtab").addClass("active"),$("#form_rdata_rmode_"+a.rdata_type).prop("checked",!0),$("#search_rdata_domain").val(a.rrdata_search_domain_raw),$("#form_rdata_rmode_ip").is(":checked")&&$("#rrtype_field").addClass("disabled")),$("#recent_queries_tab").removeClass("active"),$("#recent_queries_subtab").removeClass("active"),$("#search_tab").addClass("active"),$("#search_subtab").addClass("active"),I()}function l(a){$("#RRSet_tab").removeClass("active"),$("#RRSet_subtab").removeClass("active"),$("#RData_tab").addClass("active"),$("#RData_subtab").addClass("active"),$("#form_rdata_rmode_ip").prop("checked",!0),$("#rrtype_field").addClass("disabled"),$("#search_rdata_domain").val(a),I()}function m(a){$("#RRSet_tab").removeClass("active"),$("#RRSet_subtab").removeClass("active"),$("#RData_tab").addClass("active"),$("#RData_subtab").addClass("active"),$("#form_rdata_rmode_name").prop("checked",!0),$("#search_rdata_domain").val(a),I()}function n(a){$("#RData_tab").removeClass("active"),$("#RData_subtab").removeClass("active"),$("#RRSet_tab").addClass("active"),$("#RRSet_subtab").addClass("active"),$("#search_rrset_domain").val(a),$("#search_rrset_bailiwick").val(""),I()}function o(a){$("#RData_tab").removeClass("active"),$("#RData_subtab").removeClass("active"),$("#RRSet_tab").addClass("active"),$("#RRSet_subtab").addClass("active"),$("#search_rrset_bailiwick").val(a),I()}function p(a){return"<a class='tooltip-ip ip-pivot' href='#'>"+a+"<span class='tooltip-ip-data'>Search for RData "+a+" (ip)</span></a>"}function q(a){return"<a class='tooltip-domain domain-reverse-pivot' href='#'>"+a+"<span class='tooltip-domain-data'>Search for RData "+a+" (name)</span></a>"}function r(a){return"<a class='tooltip-domain domain-forward-pivot' href='#'>"+a+"<span class='tooltip-domain-data'>Search for RRSet "+a+" (name)</span></a>"}function s(a,b){return"<a class='tooltip-domain domain-forward-pivot-bailiwick' href='#'>"+a+"<span class='tooltip-domain-data'>Search for this bailiwick with rrname "+b+"</span></a>"}function t(a){const b=/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;return!!a.match(b)}function u(a){const b=/(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/;return!!a.match(b)}function v(a){const b=/^(?!:\/\/)([.a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z.]{2,11}?$/;return!!a.match(b)}function w(a){var b=[],c=a.toString(),d="";return v(c)&&(d=r(c)),b.push(d),b=b.toString().replace(/,/g," "),b}function x(a,b){return s(a.toString(),b.toString())}function y(a,b){var c=[],d=["SOA","DS","MX","RRSIG","TXT","TYPE16657"];if(1===a.length&&"object"==typeof a||"string"==typeof a){var e=a.toString();e=e.split(/[ ,]+/),e.forEach(function(a){var f="";v(a.toString())&&(f=q(a)),(t(e.toString())||u(e.toString()))&&(f=p(a)),f||(f=a),c.push(f),d.includes(b)?c.push(" "):c.push("</br>")})}else a.forEach(function(a){var a=a.split(/[ ,]+/);a.forEach(function(a){var e="";v(a.toString())&&(e=q(a)),(t(a.toString())||u(a.toString()))&&(e=p(a)),e||(e=a),"MX"==b&&3<a.length&&(e+="</br>"),c.push(e),d.includes(b)?c.push(" "):c.push("</br>")})});return c=c.toString().replace(/,/g," "),c}function z(){1500<$(document).height()&&"block"==$("#results-table-container").css("display")&&$("#results-table_paginate").prepend("<div id='to-top-container'><i class='large chevron circle up link icon grey' title='Go Back to Top' id='to-top-icon'></i></div>")}function A(a){return 10>a&&(a="0"+a),a}function B(a){var b=new Date(1e3*a),c=[];return c.push(b.getUTCFullYear().toString()),c.push("-"),c.push(A(b.getUTCMonth()+1)),c.push("-"),c.push(A(b.getUTCDate())),c.push(" "),c.push(A(b.getHours())),c.push(":"),c.push(A(b.getMinutes())),c.join("")}function C(a,b="table"){var c=new Date(1e3*a),d=[];if("table"==b)return d.push(c.getUTCFullYear().toString()),d.push("-"),d.push(A(c.getUTCMonth()+1)),d.push("-"),d.push(A(c.getUTCDate())),d.push(" "),d.push(A(c.getHours())),d.push(":"),d.push(A(c.getMinutes())),d.push(":"),d.push(A(c.getSeconds())),d.join("");if("label"==b)return d.push(c.getUTCFullYear().toString()),d.push("-"),d.push(A(c.getUTCMonth()+1)),d.push("-"),d.push(A(c.getUTCDate())),d.push(" 00:00 (UTC)"),d.join("");if("history"==b){return d.push(c.toLocaleDateString("en-US",{month:"numeric",day:"numeric",hour:"numeric",minute:"numeric",second:"numeric",h12:!0})),d.join("")}}function D(a){var b=a,c=punycode.toASCII(b);return c!=b&&(b=c+" ("+b+")"),b}function E(a){var b=a;return b=punycode.toASCII(b),b}function F(){if(M&&T){var a=new Date;a=parseInt(a.getTime()/1e3);var b="DNSDB_"+T.replace(/\s+/g,"_").replace(/[(|)]/g,"")+a,c="data:text/json;charset=utf-8,"+encodeURIComponent(JSON.stringify(M)),d=document.createElement("a");d.setAttribute("href",c),d.setAttribute("download",b+".json"),d.click(),d.remove()}else;}function G(){if(M&&T){const g=(a,b)=>null===b?"":b,h=["zone_time_first","zone_time_last","time_last","time_first","count","rrname","rrtype","bailiwick","rdata"];var a=[],b=M;Object.keys(b).forEach(function(c){if(b[c].hasOwnProperty("rdata")){var d=b[c].rdata;if("object"==typeof d)for(var e=0;e<d.length;e++)a.push({zone_time_first:b[c].zone_time_first,zone_time_last:b[c].zone_time_last,time_first:b[c].time_first,time_last:b[c].time_last,count:b[c].count,bailiwick:b[c].bailiwick,rrname:b[c].rrname,rrtype:b[c].rrtype,rdata:d[e]});else a.push({zone_time_first:b[c].zone_time_first,zone_time_last:b[c].zone_time_last,time_first:b[c].time_first,time_last:b[c].time_last,count:b[c].count,bailiwick:b[c].bailiwick,rrname:b[c].rrname,rrtype:b[c].rrtype,rdata:d})}else;});let i=a.map(a=>h.map(b=>JSON.stringify(a[b],g)).join(","));i.unshift(h.join(",")),i=i.join("\r\n");var c="data:text/json;charset=utf-8,"+encodeURIComponent(i),d=new Date;d=parseInt(d.getTime()/1e3);var e="DNSDB_"+T.replace(/\s+/g,"_").replace(/[(|)]/g,"")+d,f=document.createElement("a");f.setAttribute("href",c),f.setAttribute("download",e+".csv"),f.click(),f.remove()}else;}function H(){var a=new XMLHttpRequest,b="https://"+L+"/lookup/rate_limit?&client="+"Scout"+"&version="+"1.0.5";a.open("POST",b,!0),a.setRequestHeader("Content-type","application/x-www-form-urlencoded"),a.setRequestHeader("X-API-Key",U.get()),a.onreadystatechange=function(){var b=Math.sign;if(4==a.readyState&&200==a.status){var c=JSON.parse(a.responseText);if(c.rate.expires){var e=new Date,f=new Date(0),g=new Date;if(f.setUTCSeconds(c.rate.expires),g=(f-e)/1e3,b(g)==0<c.rate.remaining){var i=parseInt(g,10),j=J(i/86400);i-=24*(3600*j);var d=J(i/3600);$("#quota-time").html(j+"d "+d+"h"),$("#quota-time-desc").html("API Key Time Remaining"),$("#quota-quantity").html(c.rate.remaining),$("#quota-quantity-desc").html("Block Queries Left"),$("#quota-error").attr("style","display: none"),$("#quota-days").attr("style","display: block"),$("#quota-queries").attr("style","display: block"),$("#loading-spinner").removeClass("active")}else $("#quota-time").html("N/A"),$("#quota-time-desc").html("Expired"),$("#quota-quantity").html("N/A"),$("#quota-quantity-desc").html("Invalid"),$("#quota-error").attr("style","display: block"),$("#quota-days").attr("style","display: block"),$("#quota-queries").attr("style","display: block"),$("#loading-spinner").removeClass("active")}else if(!c.rate)$("#quota-time").html("?"),$("#quota-time-desc").html("Error"),$("#quota-quantity").html("?"),$("#quota-quantity-desc").html("#A38798"),$("#quota-error").attr("style","display: none"),$("#quota-days").attr("style","display: block"),$("#quota-queries").attr("style","display: block"),$("#loading-spinner").removeClass("active");else if(isNaN(c.rate.limit))$("#quota-quantity").html("Unlimited"),$("#quota-quantity-desc").html("Queries Remaining"),$("#quota-error").attr("style","display: none"),$("#quota-days").attr("style","display: none"),$("#quota-queries").attr("style","display: block"),$("#loading-spinner").removeClass("active");else{var e=J(new Date().getTime()/1e3),h=c.rate.reset,g=new Date(null);g.setSeconds(h-e),g=g.toISOString().substr(11,8),g=g.split(":"),g=g[0]+"h "+g[1]+"m ",$("#quota-time").html(g),$("#quota-time-desc").html("Until Quota Reset"),$("#quota-quantity").html(c.rate.remaining),$("#quota-quantity-desc").html("Queries Left"),$("#quota-error").attr("style","display: none"),$("#quota-days").attr("style","display: block"),$("#quota-queries").attr("style","display: block"),$("#loading-spinner").removeClass("active")}}else 4==a.readyState&&200!==a.status&&($("#quota-time").html("N/A"),$("#quota-time-desc").html("Expired"),$("#quota-quantity").html("N/A"),$("#quota-quantity-desc").html("Invalid"),$("#quota-error").attr("style","display: block"),$("#quota-days").attr("style","display: block"),$("#quota-queries").attr("style","display: block"),$("#loading-spinner").removeClass("active"))},a.send("")}function I(){$("#main-message").addClass("hidden"),$("#main-message-response").html(""),$("#dnsdb_crx_form").addClass("loading"),$("#results-table-container").attr("style","display: none"),$("#results-table").dataTable().fnClearTable();var a=new XMLHttpRequest,b="https://"+L+"/lookup/";T="";var c=J(new Date/1).toString(),e={};e.timestamp=J(new Date/1),e.punycode_available=R;var f=new Date,d=f.getTimezoneOffset();d=1e3*(60*d);var i=!1;e.use_timefence=!1;var j="",k="",l=(new Date($("#rangestartinput").val()).getTime()-d)/1e3,m=(new Date($("#rangeendinput").val()).getTime()-d)/1e3;if(e.timefence_start=l,e.timefence_end=m,(l||m)&&(i=!0,e.use_timefence=!0),i&&l){var n="",o="",p=$("#time_first_before");p.is(":checked")?(n="time_first_before",o="First Before: ",e.time_first_before=!0,e.time_first_after=!1):(n="time_first_after",o="First After: ",e.time_first_before=!1,e.time_first_after=!0),k+="&"+n+"="+l,j+=" // "+o+C(l,"label")}if(i&&m){var q="",o="",r=$("#time_last_before");r.is(":checked")?(q="time_last_before",o="Last Before: ",e.time_last_before=!0,e.time_last_after=!1):(q="time_last_after",o="Last After: ",e.time_last_before=!1,e.time_last_after=!0),k+="&"+q+"="+m,j+=" // "+o+C(m,"label")}if(e.rtype=$("#search_rrecord").val(),$("#RRSet_tab").hasClass("active"))e.use_rrset=!0,e.use_rdata=!1,$("#results-table").DataTable().column(3).visible(!0),b+="rrset/name/",T+="RRset ",R?(b+=E($("#search_rrset_domain").val().trim())+"/",T=D($("#search_rrset_domain").val().trim()),e.rrset_search_domain_enc=E($("#search_rrset_domain").val().trim()),e.rrset_search_domain_raw=$("#search_rrset_domain").val().trim()):(b+=$("#search_rrset_domain").val().trim()+"/",T+=$("#search_rrset_domain").val().trim(),e.rrset_search_domain_enc="",e.rrset_search_domain_raw=$("#search_rrset_domain").val().trim()),b+=$("#search_rrecord").val().trim()+"/",T+=" "+$("#search_rrecord").val().trim(),$("#search_rrset_bailiwick").val()&&(R?(b+=E($("#search_rrset_bailiwick").val().trim())+"/",T+=" ("+D($("#search_rrset_bailiwick").val().trim())+")",e.rrset_search_bailiwick_enc=E($("#search_rrset_bailiwick").val().trim()),e.rrset_search_bailiwick_raw=$("#search_rrset_bailiwick").val().trim()):(b+=$("#search_rrset_bailiwick").val().trim()+"/",T+=" ("+$("#search_rrset_bailiwick").val().trim()+")",e.rrset_search_bailiwick_enc="",e.rrset_search_bailiwick_raw=$("#search_rrset_bailiwick").val().trim()));else if($("#RData_tab").hasClass("active")){e.use_rrset=!1,e.use_rdata=!0,$("#results-table").DataTable().column(3).visible(!1),b+="rdata/";for(var s,t="",u=["name","ip","raw"],v=0;v<u.length;v++)s=$("#form_rdata_rmode_"+u[v]),s.is(":checked")&&(t=u[v],e.rdata_type=t);b+=t+"/","ip"==t&&$("#search_rdata_domain").val($("#search_rdata_domain").val().replace("/",",")),R?(b+=E($("#search_rdata_domain").val().trim())+"/",T+=D($("#search_rdata_domain").val().trim())+" ("+t+")",e.rrdata_search_domain_enc=E($("#search_rdata_domain").val().trim()),e.rrdata_search_domain_raw=$("#search_rdata_domain").val().trim()):(b+=$("#search_rdata_domain").val().trim()+"/",T+=$("#search_rdata_domain").val().trim()+" ("+t+")",e.rrdata_search_domain_enc="",e.rrdata_search_domain_raw=$("#search_rdata_domain").val().trim()),"ip"==t&&(T=T.replace(",","/"),$("#search_rdata_domain").val($("#search_rdata_domain").val().replace(",","/"))),"ip"!==t&&(b+=$("#search_rrecord").val().trim(),T+=" "+$("#search_rrecord").val().trim())}b+="?limit="+$("#search_limit").val(),T+=" (Limit "+$("#search_limit").val()+") ",e.limit=$("#search_limit").val(),b+="&client=Scout&version=1.0.5",e.client="Scout",e.client_version="1.0.5",i&&(b+=k,T+=j),e.request_url=b;a.open("POST",b,!0),a.setRequestHeader("Content-type","application/x-www-form-urlencoded"),a.setRequestHeader("X-API-Key",U.get()),a.setRequestHeader("Accept","application/json"),a.onreadystatechange=function(){if(4==a.readyState&&a.status){var b=a.getAllResponseHeaders(),c=b.split("\r\n"),c=c.reduce(function(a,b){var c=b.split(": ");return a[c[0]]=c[1],a},{});e.response_status=a.status,e.response_ratelimit_limit=c["x-ratelimit-limit"]||"n/a",e.response_ratelimit_remaining=c["x-ratelimit-remaining"]||"n/a",e.response_ratelimit_expire=c["x-ratelimit-expire"]||"n/a",e.response_ratelimit_reset=c["x-ratelimit-reset"]||"n/a",e.response_content=a.responseText,e.label=T,P.push(e),h(e),W.set()}if(4==a.readyState&&200==a.status){H();var d=JSON.parse("["+a.responseText.replace(/}\s*{/g,"},{")+"]");M=d,M&&$("#results-table-container").attr("style","display: block"),$("#main-message").removeClass("hidden error").addClass("success"),$("#main-message-response").html("Successful Query for: "+T),$("#results-table").dataTable().fnAddData(d),$("#dnsdb_crx_form").removeClass("loading")}else if(4==a.readyState&&200!==a.status)H(),$("#main-message").removeClass("hidden success").addClass("error"),$("#dnsdb_crx_form").removeClass("loading"),0==a.status||504==a.status?($("#main-message-response").html("Error: 504 Gateway Timeout ("+T+")"),e.response_status=504,e.response_ratelimit_limit="-",e.response_ratelimit_remaining="-",e.response_ratelimit_expire="-",e.response_ratelimit_reset="-",e.response_content="504 Gateway Timeout",e.label=T,P.push(e),h(e),W.set()):$("#main-message-response").html(a.responseText+" ("+T+")");else if(4==a.readyState);g()},a.send("")}var K,L,M,N=0,O=0,P=[],Q=0,R=!1,S=new Date,T="",U=function(){return chrome.storage.local.get("DNSDB_API_Key",function(a){K=c(a.DNSDB_API_Key)}),{get:function(){return K?c(K):""}}}(),V=function(){return chrome.storage.local.get("DNSDB_API_Endpoint",function(a){L=a.DNSDB_API_Endpoint}),{get:function(){return L}}}(),W=function(){return chrome.storage.local.get({DNSDB_recent_queries:[]},function(a){P=a.DNSDB_recent_queries}),{get:function(){return P},set:function(){chrome.storage.local.set({DNSDB_recent_queries:P},function(){})},clear:function(){chrome.storage.local.set({DNSDB_recent_queries:[]},function(){}),P=[]}}}();e(),d(),f(),function(){var a="undefined"!=typeof punycode;a?(R=!0,$("#punycode-status-alert").removeClass("caution").addClass("success"),$("#punycode-status-alert").html("<i class='icon check'></i>Supported")):(R=!1,$("#punycode-status-alert").removeClass("success").addClass("caution"),$("#punycode-status-alert").html("<i class='icon exclamation triangle'></i>Unsupported")),$("#punycode-status").attr("style","display: block")}(),$.fn.DataTable.ext.pager.numbers_length=5,$("select.dropdown").dropdown(),$(".ui.checkbox").checkbox(),$(".menu .item").tab(),$(".ui.accordion").accordion(),$("#time-fence-info").popup(),$("#rrtype-info").popup(),$("#limit-info").popup(),$("#bailiwick-info").popup(),document.querySelector("form").addEventListener("submit",()=>{event.preventDefault(),I()}),$(document).on("click","#form_rdata_rmode_ip_checkbox",function(){$("#rrtype_field").addClass("disabled")}),$(document).on("click","#form_rdata_rmode_name_checkbox, #form_rdata_rmode_raw_checkbox, #RRSet_tab",function(){$("#rrtype_field").removeClass("disabled")}),$(document).on("click","#RData_tab",function(){$("#form_rdata_rmode_ip").is(":checked")&&$("#rrtype_field").addClass("disabled")}),document.addEventListener("DOMContentLoaded",function(){var a=$("#history-table").DataTable({language:{searchPlaceholder:"Search Recent Queries",search:"_INPUT_",emptyTable:"No Queries Have Been Made Recently"},pagingType:"full_numbers",searching:!0,bLengthChange:!1,columns:[{data:"Rerun",defaultContent:"",width:"50px",orderable:!1},{data:function(a){return a.Date},defaultContent:"",width:"150px",orderable:!0,type:"date",render:function(a){return C(J(a/1e3),"history")}},{data:"Status",defaultContent:"",width:"50px",orderable:!0},{data:"Type",defaultContent:"",width:"50px",orderable:!0},{data:"Label",defaultContent:"",className:"details-control"},{data:"Details",defaultContent:"",className:"details-control",orderable:!1}],iDisplayLength:10,autoWidth:!1,order:[[1,"desc"]],deferRender:!0});$("#history-table_wrapper > div[class='ui stackable grid'] > div[class='row'] > div[class='eight wide column']").change(function(){$(this).attr("id","history-table-title-wrapper"),$(this).append("<h3 id='history-table-title'>Recent Queries</h3>")}).change(),$("#history-table_wrapper > div[class='ui stackable grid'] > div[class='row']").change(function(){$(this).attr("id","history-table-header")}).change(),$("#history-table tbody").on("click","td.details-control",function(){var b=$(this).closest("tr"),c=a.row(b);c.child.isShown()?(c.child.hide(),b.removeClass("shown")):(c.child.show(),b.addClass("shown")),g()}),$("#history-table").dataTable().fnClearTable()}),g(),$(document).on("click","#search_tab, #recent_queries_tab",function(){g()}),$(document).on("click","#history-table-clear",function(){W.clear(),$("#history-table").dataTable().fnClearTable()}),$(document).on("click","a[id*='replay_']",function(a){a.preventDefault();for(var b=$(this).attr("timestamp"),c=0;c<P.length;c++)P[c].timestamp==b&&k(P[c])}),$("#rangestart").on("input",function(){var a=$("#rangestartinput").val().trim();if(!isNaN(a)&&10==a.length){var b=B(a);$("#rangestartinput").val(b),$("#rangestart").calendar("set date",b)}}),$("#rangeend").on("input",function(){var a=$("#rangeendinput").val().trim();if(!isNaN(a)&&10==a.length){var b=B(a);$("#rangeendinput").val(b),$("#rangeend").calendar("set date",b)}}),$("#rangestart").calendar({startMode:"year",type:"date",minDate:new Date(31536e3),maxDate:new Date(S.getFullYear(),S.getMonth(),S.getDate()+2),popupOptions:{position:"top left",lastResort:"bottom left",prefer:"opposite",hideOnScroll:!1}}),$("#rangeend").calendar({startMode:"year",type:"date",minDate:new Date(31536e3),maxDate:new Date(S.getFullYear(),S.getMonth(),S.getDate()+2),popupOptions:{position:"top left",lastResort:"bottom left",prefer:"opposite",hideOnScroll:!1}}),$(document).on("click","#clear-timefencing",function(){$("#rangeendinput").val(""),$("#rangeend").calendar("set date",""),$("#rangestartinput").val(""),$("#rangestart").calendar("set date",""),$("#time_last_after").prop("checked",!0),$("#time_first_before").prop("checked",!0)}),$(document).on("click","#time-fencing-section",function(){$("#time-fencing-section").hasClass("active")?$("#time-fencing-section-icon").removeClass("plus").addClass("minus"):$("#time-fencing-section-icon").removeClass("minus").addClass("plus")}),$(document).on("click",".ip-pivot",function(a){a.stopPropagation(),l(this.childNodes[0].data)}),$(document).on("click",".domain-reverse-pivot",function(a){a.stopPropagation(),m(this.childNodes[0].data),$("#rrtype_field").removeClass("disabled")}),$(document).on("click",".domain-forward-pivot",function(a){a.stopPropagation(),n(this.childNodes[0].data),$("#rrtype_field").removeClass("disabled")}),$(document).on("click",".domain-forward-pivot-bailiwick",function(a){a.stopPropagation(),o(this.childNodes[0].data),$("#rrtype_field").removeClass("disabled")}),document.addEventListener("DOMContentLoaded",function(){$("#results-table").DataTable({pagingType:"full_numbers",searching:!1,columns:[{data:function(a){return a.time_last||a.zone_time_last},defaultContent:"",render:function(a,b,c){return a?C(a)+(c.zone_time_last?"<div class='tooltip-asterisk-zone'>*<span class='tooltip-asterisk-zone-data'>This RRSet was observed via zone file import.</span></div>":""):""}},{data:function(a){return a.time_first||a.zone_time_first},defaultContent:"",render:function(a,b,c){return a?C(a)+(c.zone_time_last?"<div class='tooltip-asterisk-zone'>*<span class='tooltip-asterisk-zone-data'>This RRSet was observed via zone file import.</span></div>":""):""}},{data:"count",type:"num",defaultContent:""},{data:function(a){return a.bailiwick},defaultContent:"",render:function(a,b,c){if(a)return x(a,c.rrname)}},{data:function(a){return a.rrname},defaultContent:"",render:function(a){if(a)return w(a)}},{data:"rrtype",defaultContent:""},{data:function(a){return a.rdata},defaultContent:"",render:function(a,b,c){if(a)return y(a,c.rrtype)}}],iDisplayLength:25,autoWidth:!1,order:[[0,"desc"]],deferRender:!0,drawCallback:function(){z()}}),$("#results-table-container").attr("style","display: none")}),$(document).on("click","#to-top-icon",function(){document.documentElement.scrollTop=0}),$("#export_JSON").click(function(){F()}),$("#export_CSV").click(function(){G()})})();