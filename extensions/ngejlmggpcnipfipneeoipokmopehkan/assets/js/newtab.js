webpackJsonp([0],{"+g0x":function(e,t,n){"use strict";var s=n("chHD"),a=n("oEnz"),o=n("VU/8")(s.a,a.a,function(e){n("Dh2s")},null,null);t.a=o.exports},"3QGG":function(e,t,n){"use strict";function s(e){if(r.a.isBrowserExtension()){chrome.storage.sync.set({widgets:{location:i.widgets.location,time:i.widgets.time}});var t={},n=i.widgets[e]?"on":"off";t["settings_"+e]=n,chrome.extension.sendMessage({command:"segment_identify",traits:t}),chrome.extension.sendMessage({command:"segment_track",event:"newtab settings changed",props:{element:e,value:n}})}else localStorage.setItem("widgets."+e,i.widgets[e])}var a=n("/5sW"),o=n("NYxO"),r=n("bhgC");a.default.use(o.a);var i={searchEngine:"yahoo",background:{type:null,value:null,thumb:null,wallpaper:null},widgets:{location:!0,time:!0}};r.a.isBrowserExtension()?(chrome.storage.local.get(function(e){e.background&&(i.background={type:e.background.type,value:e.background.value,thumb:e.background.thumb})}),chrome.storage.sync.get(function(e){e.widgets&&(i.widgets={location:e.widgets.location,time:e.widgets.time}),e.searchEngine&&(i.searchEngine=e.searchEngine)}),chrome.runtime.onMessage.addListener(function(e,t,n){"reset_engine"===e.command&&(i.searchEngine="yahoo")})):(i.background={type:localStorage.getItem("background.type"),value:localStorage.getItem("background.value"),thumb:localStorage.getItem("background.thumb")},i.widgets={location:"true"===localStorage.getItem("widgets.location"),time:"true"===localStorage.getItem("widgets.time")},i.searchEngine=sessionStorage.getItem("searchEngine")||"yahoo");var c={updateSearchEngine:function(e,t){e.searchEngine=t.selected,r.a.isBrowserExtension()?(chrome.storage.sync.set({searchEngine:t.selected}),chrome.extension.sendMessage({command:"segment_identify",traits:{search_engine:t.selected}}),chrome.extension.sendMessage({command:"segment_track",event:"search engine changed",props:{search_engine:t.selected,location:t.location}})):sessionStorage.setItem("searchEngine",t.selected)},updateBackground:function(e,t){if(e.background={type:t.type,value:t.value,thumb:t.thumb,wallpaper:t.wallpaper},r.a.isBrowserExtension()){var n={},s={};"color"===t.type?(n.settings_color=t.value,n.settings_wallpaper="none",s.element="color",s.value=t.value):"wallpaper"===t.type?(n.settings_color="none",n.settings_wallpaper=t.wallpaper.name,s.element="wallpaper",s.value=t.wallpaper.name):"custom"===t.type&&(n.settings_color="none",n.settings_wallpaper="custom",s.element="wallpaper",s.value="custom"),chrome.extension.sendMessage({command:"segment_identify",traits:n}),chrome.extension.sendMessage({command:"segment_track",event:"newtab settings changed",props:s})}},toggleLocationWidget:function(e){e.widgets.location=!e.widgets.location,s("location")},toggleTimeWidget:function(e){e.widgets.time=!e.widgets.time,s("time")}},l={},u={};t.a=new o.a.Store({state:i,getters:u,actions:l,mutations:c})},"3f9S":function(e,t,n){"use strict";var s={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{directives:[{name:"show",rawName:"v-show",value:e.enabled,expression:"enabled"}],attrs:{id:"widget-time",top:e.top}},[n("span",{domProps:{textContent:e._s(e.formattedDateTime)}})])},staticRenderFns:[]};t.a=s},Coir:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=n("woOf");"function"!=typeof n.n(s).a&&Object.defineProperty(Object,"assign",{value:function(e,t){if(null==e)throw new TypeError("Cannot convert undefined or null to object");for(var n=Object(e),s=1;s<arguments.length;s++){var a=arguments[s];if(null!=a)for(var o in a)Object.prototype.hasOwnProperty.call(a,o)&&(n[o]=a[o])}return n},writable:!0,configurable:!0})},Dh2s:function(e,t){},HEm3:function(e,t,n){"use strict";var s={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("select",{class:e.classes,attrs:{id:e.id,name:e.name}},e._l(e.options,function(t){return n("option",{domProps:{value:t.value||t,textContent:e._s(t.text||t.value||t)}})}))},staticRenderFns:[]};t.a=s},JBpk:function(e,t){},JZSy:function(e,t,n){"use strict";(function(e){var s=n("//Fk"),a=n.n(s),o=n("Miuz"),r=n.n(o),i=n("N0Tb"),c=(n.n(i),n("Zzkc")),l=(n.n(c),n("bhgC")),u=n("a0oE");t.a={components:{Popper:r.a,"sketch-picker":c.Sketch,Select2:u.a},data:function(){return{active:!1,background:{type:null,value:null,thumb:null},wallpapers:[{name:"panda",thumb:"/assets/bg/panda-thumb.jpg",full:"/assets/bg/panda.jpg"},{name:"desert",thumb:"/assets/bg/desert-thumb.jpg",full:"/assets/bg/desert.jpg"},{name:"desert-sky",thumb:"/assets/bg/desert-sky-thumb.jpg",full:"/assets/bg/desert-sky.jpg"},{name:"wave",thumb:"/assets/bg/wave-thumb.jpg",full:"/assets/bg/wave.jpg"},{name:"wildebeest",thumb:"/assets/bg/wildebeest-thumb.jpg",full:"/assets/bg/wildebeest.jpg"},{name:"turtle-sea",thumb:"/assets/bg/turtle-sea-thumb.jpg",full:"/assets/bg/turtle-sea.jpg"},{name:"frog-green",thumb:"/assets/bg/frog-green-thumb.jpg",full:"/assets/bg/frog-green.jpg"},{name:"dog-snow",thumb:"/assets/bg/dog-snow-thumb.jpg",full:"/assets/bg/dog-snow.jpg"},{name:"citrus",thumb:"/assets/bg/citrus-thumb.jpg",full:"/assets/bg/citrus.jpg"}],popperOptions:{placement:"bottom",gpuAcceleration:!0,modifiers:{preventOverflow:{boundariesElement:"viewport"}}},toggleButtonColors:{checked:"#4DD765",unchecked:"#ECECEC"},toggleButtonWidth:42,searchEngine:"yahoo",searchEngineOptions:["yahoo","google","bing"]}},computed:{selectedSearchEngine:function(){this.searchEngine=this.$store.state.searchEngine;var t=e("#settings-search-engine-select");return t.val(this.searchEngine),t.trigger("change"),this.searchEngine},recommendBGSize:function(){return screen.width+" x "+screen.height},bgIsColor:function(){return"color"===this.$store.state.background.type},bgValue:function(){return this.$store.state.background.value},vueColors:function(){return"color"===this.$store.state.background.type?{hex:this.$store.state.background.value}:{hex:"#000000"}},locationEnabled:function(e,t){return this.$store.state.widgets.location},timeEnabled:function(e,t){return this.$store.state.widgets.time}},mounted:function(){e("#btn-upload-wallpaper").click(function(t){return e("#wallpaper-input").click()})},methods:{settingsHide:function(){this.active=!1},settingsShow:function(){this.active=!0},toggleLocationWidget:function(){return this.$store.commit("toggleLocationWidget"),!this.$store.state.widgets.location},toggleTimeWidget:function(){return this.$store.commit("toggleTimeWidget"),!this.$store.state.widgets.time},setWallpaper:function(t,n){var s=this,o=function(e){return fetch(e).then(function(e){return e.blob()}).then(function(e){return new a.a(function(t,n){var s=new FileReader;s.onloadend=function(){return t(s.result)},s.onerror=n,s.readAsDataURL(e)})})},r=null;o(t.full).then(function(n){r=n,e("body").css("background-image","url("+r+")"),o(t.thumb).then(function(n){e(".bg-wallpaper-thumb").attr("src",n),s.updateBackground("wallpaper",r,n,t)})})},uploadWallpaper:function(e){var t=e.target.files[0];t.size,this.saveWallpaper(t)},saveWallpaper:function(t){var n=this,s=new FileReader;s.addEventListener("load",function(){e("body").css("background-image","url("+s.result+")"),e(".bg-wallpaper-thumb").attr("src",s.result),n.updateBackground("custom",s.result)},!1),t&&s.readAsDataURL(t)},updateBGColor:function(t){e("body").css({"background-color":t.hex,"background-image":""}),e(".bg-wallpaper-thumb").attr("src",""),this.updateBackground("color",t.hex)},updateBackground:function(e,t,n,s){l.a.isBrowserExtension()?chrome.storage.local.set({background:{type:e,value:t,thumb:n}}):(localStorage.setItem("background.type",e),localStorage.setItem("background.value",t),localStorage.setItem("background.thumb",n)),this.$store.commit("updateBackground",{type:e,value:t,thumb:n,wallpaper:s})},formatSelect:function(t){return t.id?e('<span><img src="/assets/img/'+t.element.value.toLowerCase()+'-circle-color.svg" /></span>'):t.text},onSelectOptionMouseEnter:function(t){e(".select2-results__option").each(function(t,n){var s=e(n).find("img"),a=s.attr("src");s.attr("src",a.replace("white","color"))});var n=e(t.currentTarget).find("img"),s=n.attr("src");n.attr("src",s.replace("color","white"))}}}}).call(t,n("7t+N"))},JrhV:function(e,t,n){"use strict";var s=n("Li6X"),a=n("kUyr"),o=n("VU/8")(s.a,a.a,function(e){n("j+YD")},null,null);t.a=o.exports},K13Y:function(e,t,n){"use strict";var s=n("fcVE"),a=n("3f9S"),o=n("VU/8")(s.a,a.a,function(e){n("JBpk")},null,null);t.a=o.exports},LViX:function(e,t,n){"use strict";var s=n("SJx2");t.a={data:function(){return{footerLinks:[{url:s.a.baseUrl+"/eula",text:"EULA"},{url:s.a.baseUrl+"/privacy-policy",text:"Privacy Policy"},{url:s.a.baseUrl+"/support",text:"Support"},{url:s.a.baseUrl+"/uninstall",text:"Uninstall"}]}}}},Lg9w:function(e,t){},Li6X:function(e,t,n){"use strict";(function(e){var s=n("bhgC"),a=n("niH5"),o=n("+g0x"),r=n("K13Y"),i=n("W3IB"),c=n("TRvD");t.a={name:"app-nt",components:{Settings:a.a,Location:o.a,FormattedDateTime:r.a,NewTabSearchBar:i.a,NewTabFooter:c.a},mounted:function(){if(s.a.isBrowserExtension())chrome.storage.local.get(function(t){t.background&&("wallpaper"===t.background.type||"custom"===t.background.type)&&t.background.value?(e("body").css("background-image","url("+t.background.value+")"),void 0!==t.background.thumb?e(".bg-wallpaper-thumb").attr("src",t.background.thumb):e(".bg-wallpaper-thumb").attr("src",t.background.value)):t.background&&"color"===t.background.type&&t.background.value?e("body").css("background-color",t.background.value):(e("body").css("background-image","url(/assets/bg/panda.jpg)"),e(".bg-wallpaper-thumb").attr("src","/assets/bg/panda.jpg"))});else{var t=localStorage.getItem("background.type"),n=localStorage.getItem("background.value"),a=localStorage.getItem("background.thumb");"wallpaper"!==t&&"custom"!==t||!n?"color"===t&&n&&e("body").css("background-color",n):(e("body").css("background-image","url("+n+")"),"undefined"!==a?e(".bg-wallpaper-thumb").attr("src",a):e(".bg-wallpaper-thumb").attr("src",n))}}}}).call(t,n("7t+N"))},N0Tb:function(e,t){},OmpC:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=n("/5sW"),a=n("NYxO"),o=n("nkUn"),r=n.n(o),i=n("3QGG"),c=n("JrhV");n("Coir"),n("K3J8"),n("DDSE"),n("hv7s"),n("PHjj"),s.default.use(a.a),s.default.use(r.a),s.default.config.productionTip=!1,new s.default({el:"#app-nt",store:i.a,render:function(e){return e(c.a)}})},SJx2:function(e,t,n){"use strict";var s=n("woOf"),a=n.n(s),o={env:"production",debug:!0,appId:56,appName:"Search Administrator Tab",apps202BaseUrl:"https://staging.apps202.com",segmentWriteKey:"qunknG8cAZ8QgvsvLScDuvOyz6QPRhgG"},r={production:{debug:!1,baseUrl:"https://www.searchadministrator.com",apps202BaseUrl:"https://www.apps202.com",segmentWriteKey:"B598Xj80IwbdD5QHdRq9D7lcsJ76MNEJ"},staging:{baseUrl:"http://staging.searchadministrator.com"},development:{baseUrl:"http://sa-eric.lan.beestripe.privsub.net"},local:{baseUrl:"http://dev.searchadministrator.com"}},i=r.production;i=r.production,t.a=a()(o,i)},TRvD:function(e,t,n){"use strict";var s=n("LViX"),a=n("nZYA"),o=n("VU/8")(s.a,a.a,function(e){n("XFsZ")},"data-v-4d6cbb3e",null);t.a=o.exports},W3IB:function(e,t,n){"use strict";var s=n("ZDpQ"),a=n("YhP8"),o=n("VU/8")(s.a,a.a,function(e){n("YmXY")},null,null);t.a=o.exports},XFsZ:function(e,t){},YhP8:function(e,t,n){"use strict";var s={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"sb col-xl-6 col-lg-8 col-md-10 col-sm-12 mx-auto"},[n("form",{staticClass:"search-form",attrs:{action:e.searchUrl},on:{submit:function(t){t.preventDefault(),e.search(t)}}},[n("div",{staticClass:"form-row"},[n("div",{staticClass:"col-xl-2 col-md-2 col-sm-3 col-xs-2",staticStyle:{padding:"0 1px"}},[n("select2",{staticStyle:{width:"100%"},attrs:{id:"sb-search-engine-select","dropdown-parent":"sb-search-engine-select-dropdown-parent","minimum-results-for-search":"Infinity",options:e.searchEngineOptions,value:e.selectedSearchEngine,"template-result":e.formatSelect,"template-selection":e.formatSelect,"on-select-option-mouse-enter":e.onSelectOptionMouseEnter,location:"search bar"}}),e._v(" "),n("div",{attrs:{id:"sb-search-engine-select-dropdown-parent"}})],1),e._v(" "),n("div",{staticClass:"col",staticStyle:{padding:"0 1px"}},[n("div",{staticClass:"input-group"},[n("input",{directives:[{name:"model",rawName:"v-model",value:e.query,expression:"query"}],staticClass:"input-search form-control form-control-lg",attrs:{type:"text",name:"q",id:"input-search",placeholder:"Search",autocomplete:"off"},domProps:{value:e.query},on:{input:function(t){t.target.composing||(e.query=t.target.value)}}}),e._v(" "),e._m(0)])])]),e._v(" "),n("input",{directives:[{name:"model",rawName:"v-model",value:e.searchEngine,expression:"searchEngine"}],attrs:{type:"hidden",name:"engine"},domProps:{value:e.searchEngine},on:{input:function(t){t.target.composing||(e.searchEngine=t.target.value)}}}),e._v(" "),n("input",{directives:[{name:"model",rawName:"v-model",value:e.appId,expression:"appId"}],attrs:{type:"hidden",name:"aid"},domProps:{value:e.appId},on:{input:function(t){t.target.composing||(e.appId=t.target.value)}}}),e._v(" "),n("input",{directives:[{name:"model",rawName:"v-model",value:e.source,expression:"source"}],attrs:{type:"hidden",name:"sr"},domProps:{value:e.source},on:{input:function(t){t.target.composing||(e.source=t.target.value)}}}),e._v(" "),n("input",{directives:[{name:"model",rawName:"v-model",value:e.version,expression:"version"}],attrs:{type:"hidden",name:"v"},domProps:{value:e.version},on:{input:function(t){t.target.composing||(e.version=t.target.value)}}}),e._v(" "),n("input",{directives:[{name:"model",rawName:"v-model",value:e.limitedUA,expression:"limitedUA"}],attrs:{type:"hidden",name:"ua"},domProps:{value:e.limitedUA},on:{input:function(t){t.target.composing||(e.limitedUA=t.target.value)}}})])])},staticRenderFns:[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("span",{staticClass:"input-group-btn"},[n("button",{staticClass:"btn btn-lg btn-search",attrs:{type:"submit"}},[n("i",{staticClass:"fa fa-search",attrs:{"aria-hidden":"true"}})])])}]};t.a=s},YmXY:function(e,t){},ZDpQ:function(e,t,n){"use strict";(function(e){var s=n("a0oE"),a=n("SJx2"),o=n("bhgC");t.a={components:{Select2:s.a},data:function(){return{appId:a.a.appId,searchUrl:a.a.baseUrl+"/search",searchEngine:"yahoo",searchEngineOptions:["yahoo","google","bing"],source:"newtab-sb",limitedUA:o.a.getBrowser().name+"-"+o.a.getOS(),version:o.a.getExtVersion(),query:""}},computed:{selectedSearchEngine:function(){this.searchEngine=this.$store.state.searchEngine;var t=e("#sb-search-engine-select");return t.val(this.searchEngine),t.trigger("change"),this.searchEngine}},mounted:function(){function t(){s.typeahead({minLength:2,highlight:!0,hint:!1},{name:"ssuggest",source:function(t,n,o){var r=[];if(e.each(i,function(e,n){(n.startsWith(t)||n.replace(/http(s)?:\/\//,"").startsWith(t)||n.replace(/(http(s)?:\/\/|www.)/g,"").startsWith(t))&&r.push(n.replace(/(http(s)?:\/\/|www.)/g,""))}),r.length>0){var c=-1;0===r[0].indexOf(t)?c=0:0===r[0].replace(/(http(s))?:\/\//,"").indexOf(t)?c=r[0].indexOf("://")+3:r[0].replace(/(http(s)?:\/\/|www.)/g,"")&&(c=r[0].indexOf("://www.")+7),s.val(r[0]),s.selectRange(c+t.length,r[0].length)}else s.html("");return n(r.slice(0,2)),e(".tt-suggestion").addClass("site_suggest"),e.ajax({url:a.a.baseUrl+"/ss",type:"GET",data:{q:t,t:"ss"},success:function(e){return o(e[1])}})},limit:4}).bind("typeahead:selected",function(t,n,s){e(".search-form").submit()}),s.focus()}e.fn.selectRange=function(t,n){var s=document.getElementById(e(this).attr("id"));if(s)if(s.setSelectionRange)s.focus(),s.setSelectionRange(t,n);else if(s.createTextRange){var a=s.createTextRange();a.collapse(!0),a.moveEnd("character",n),a.moveStart("character",t),a.select()}else s.selectionStart&&(s.selectionStart=t,s.selectionEnd=n)};var n,s=e(".input-search"),o=["facebook.com","news.yahoo.com","spotify.com","github.com","yahoo.monday.com.tw","search.yahoo.com","yahoo.com","google.com","youtube.com","gmail.com","mail.yahoo.com","mail.google.com","netflix.com","google.ca","google.co.th","google.co.in","google.co.uk","amazon.com","cnn.com","edition.cnn.com","tumblr.com","twitter.com","ebay.com","msn.com","wellsfargo.com","aol.com","apps.facebook.com","flickr.com","chrome.google.com","instagram.com","linkedin.com","bing.com","pandora.com","searchlock.com","safesearchresults.com","seekit.com","getbrowserprotection.com","thebettertab.com","startshield.com","newtabtools.com","messenger.com","searchadministrator.com"],r=[],i=[];"undefined"!=typeof chrome&&void 0!==chrome.topSites?chrome.topSites.get(function(s){s.length&&e.each(s,function(e,t){r.push(t.url)}),n=r.concat(o),e.each(n,function(e,t){var n=t.replace(/(http(s)?:\/\/|www.)/g,"");"/"===n.substring(n.length-1,n.length)&&(n=n.substring(0,n.length-1)),-1===i.indexOf(n)&&i.push(n)}),t()}):t()},methods:{formatSelect:function(t){return t.id?e('<span><img src="/assets/img/'+t.element.value.toLowerCase()+'-color.svg" /></span>'):t.text},onSelectOptionMouseEnter:function(t){e(".select2-results__option").each(function(t,n){var s=e(n).find("img"),a=s.attr("src");s.attr("src",a.replace("white","color"))});var n=e(t.currentTarget).find("img"),s=n.attr("src");n.attr("src",s.replace("color","white"))},search:function(t){var n=e(".input-search").val().trim();if(n.length){var s=a.a.baseUrl+"/search?q="+n+"&engine="+this.selectedSearchEngine+"&aid="+this.appId+"&sr="+this.source+"&v="+this.version+"&ua="+this.limitedUA,o=/[-a-zA-Z0-9@:%_\\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\\+.~#?&//=]*)?/gi,r=new RegExp(o);if(!(n.split(" ").length>1))return n.match(r)?(/^((http|https):\/\/)/.test(n)||(n="http://"+n),void(window.location.href=n)):void(window.location.href=s);window.location.href=s}}}}}).call(t,n("7t+N"))},a0oE:function(e,t,n){"use strict";var s=n("x7/p"),a=n("HEm3"),o=n("VU/8")(s.a,a.a,function(e){n("Lg9w")},null,null);t.a=o.exports},bhgC:function(e,t,n){"use strict";var s=n("d7EF"),a=n.n(s);t.a={getOS:function(){var e=navigator.appVersion;return-1!==e.indexOf("Win")?"windows":-1!==e.indexOf("Mac")?"mac-osx":-1!==e.indexOf("Linux")?"linux":-1!==e.indexOf("X11")?"unix":"unknown"},getBrowser:function(e){e||(e=navigator.userAgent);var t=[["edge",/Edge\/([0-9\\._]+)/],["chrome",/(?!Chrom.*OPR)Chrom(?:e|ium)\/([0-9\\.]+)(:?\s|$)/],["firefox",/Firefox\/([0-9\\.]+)(?:\s|$)/],["opera",/Opera\/([0-9\\.]+)(?:\s|$)/],["opera",/OPR\/([0-9\\.]+)(:?\s|$)$/],["safari",/Version\/([0-9\\._]+).*Safari/]].map(function(t){if(t[1].test(e)){var n=t[1].exec(e),s=n&&n[1].split(/[._]/).slice(0,3);return s&&s.length<3&&Array.prototype.push.apply(s,1===s.length?[0,0]:[0]),{name:t[0],version:s.join("."),shortVersion:s[0]}}}).filter(Boolean).shift();return t||{name:"unknown",version:"0",shortVersion:"0"}},getURLSearchParams:function(e){return e||(e=window.location.search),(/^[?#]/.test(e)?e.slice(1):e).split("&").reduce(function(e,t){var n=t.split("="),s=a()(n,2),o=s[0],r=s[1];return e[o]=r?decodeURIComponent(r.replace(/\+/g," ")):"",e},{})},randomString:function(){for(var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:28,t="",n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890",s=0;s<e;s++)t+=n.charAt(Math.floor(Math.random()*n.length));return t},isBrowserExtension:function(){var e=!1;return window.chrome&&window.chrome.extension?e=!0:window.browser&&window.browser.extension?e=!0:window.safari&&window.safari.extension&&(e=!0),e},getExtVersion:function(){var e="1.0.0";if(this.isBrowserExtension())switch(this.getBrowser().name){case"chrome":case"opera":e=window.chrome.runtime.getManifest().version;break;case"firefox":case"edge":e=window.browser.runtime.getManifest().version;break;case"safari":e=window.safari.extension.displayVersion}return e}}},chHD:function(e,t,n){"use strict";var s=n("mtWM"),a=n.n(s),o=n("bhgC");t.a={data:function(){return{location:{city:null,country:null,countryCode:null},updateInterval:72e5}},created:function(){var e=this;o.a.isBrowserExtension()?chrome.storage.sync.get("location",function(t){t&&void 0!==t.location?(e.location={city:t.location.city,country:t.location.country,countryCode:t.location.countryCode},(new Date).getTime()>t.location.nextUpdateTime&&e.getLocation()):e.getLocation()}):this.getLocation()},computed:{enabled:function(){return this.$store.state.widgets.location}},methods:{getLocation:function(){var e=this;a.a.get("http://ip-api.com/json").then(function(t){e.location.city=t.data.city,e.location.country=t.data.countryCode,e.location.countryCode=t.data.countryCode,e.location.nextUpdateTime=(new Date).getTime()+e.updateInterval,o.a.isBrowserExtension()&&chrome.storage.sync.set({location:e.location})}).catch(function(e){console.log(e)})}}}},fcVE:function(e,t,n){"use strict";var s=n("PJh5"),a=n.n(s);t.a={data:function(){return{format:"dddd h:mm A",formattedDateTime:null}},created:function(){var e=this;this.updateDateTime(),setInterval(function(){return e.updateDateTime()},1e3)},computed:{enabled:function(){return this.$store.state.widgets.time},top:function(){return!this.$store.state.widgets.location}},methods:{updateDateTime:function(){this.formattedDateTime=a()().format(this.format)}}}},"hJu+":function(e,t,n){"use strict";var s={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("popper",{attrs:{trigger:"click",options:e.popperOptions},on:{hide:e.settingsHide,show:e.settingsShow}},[n("div",{staticClass:"popper"},[n("div",{staticClass:"settings-container"},[n("div",{staticClass:"settings-header"},[e._v("\n          Settings\n        ")]),e._v(" "),n("div",{staticClass:"settings-body"},[n("div",{attrs:{id:"widgets","data-children":".widget-item"}},[n("div",{staticClass:"widget-item"},[n("div",{staticClass:"widget-name location"},[e._v("\n                Location "),n("toggle-button",{staticClass:"pull-right",attrs:{value:e.locationEnabled,sync:!0,color:e.toggleButtonColors,width:e.toggleButtonWidth},on:{change:e.toggleLocationWidget}})],1)]),e._v(" "),n("div",{staticClass:"widget-item"},[n("div",{staticClass:"widget-name time"},[e._v("\n                Time "),n("toggle-button",{staticClass:"pull-right",attrs:{value:e.timeEnabled,sync:!0,color:e.toggleButtonColors,width:e.toggleButtonWidth},on:{change:e.toggleTimeWidget}})],1)]),e._v(" "),n("div",{staticClass:"widget-item"},[n("div",{staticClass:"widget-name search-engine"},[e._v("\n                Search Engine\n                "),n("select2",{staticStyle:{width:"50px"},attrs:{id:"settings-search-engine-select","dropdown-parent":"settings-search-engine-select-dropdown-parent","minimum-results-for-search":"Infinity",options:e.searchEngineOptions,value:e.selectedSearchEngine,"template-result":e.formatSelect,"template-selection":e.formatSelect,"on-select-option-mouse-enter":e.onSelectOptionMouseEnter,location:"settings"}}),e._v(" "),n("div",{attrs:{id:"settings-search-engine-select-dropdown-parent"}})],1)]),e._v(" "),n("div",{staticClass:"widget-item"},[n("div",{staticClass:"widget-name bg-color",attrs:{"data-toggle":"collapse","data-parent":"#widgets",href:"#widget-color","aria-controls":"widget-color"}},[n("i",{staticClass:"toggle-arrow"}),e._v("\n                Color\n                "),n("img",{directives:[{name:"show",rawName:"v-show",value:!e.bgIsColor,expression:"!bgIsColor"}],staticClass:"bg-color-thumb",attrs:{src:"/assets/img/icon-none.svg"}}),e._v(" "),n("div",{directives:[{name:"show",rawName:"v-show",value:e.bgIsColor,expression:"bgIsColor"}],staticClass:"bg-color-thumb",style:"padding:10px 13px;border-radius:100%;background-color:"+e.bgValue})]),e._v(" "),n("div",{staticClass:"collapse",attrs:{id:"widget-color",role:"tabpanel"}},[n("sketch-picker",{attrs:{value:e.vueColors},on:{input:e.updateBGColor}})],1)]),e._v(" "),n("div",{staticClass:"widget-item"},[n("div",{staticClass:"widget-name bg-wallpaper",attrs:{"data-toggle":"collapse","data-parent":"#widgets",href:"#widget-wallpaper","aria-controls":"widget-wallpaper"}},[n("i",{staticClass:"toggle-arrow"}),e._v("\n                Wallpaper\n                "),n("img",{staticClass:"bg-wallpaper-thumb"})]),e._v(" "),n("div",{staticClass:"collapse",attrs:{id:"widget-wallpaper",role:"tabpanel"}},[n("div",{attrs:{id:"widget-wallpapers"}},e._l(e.wallpapers,function(t){return n("img",{staticClass:"bg-wallpaper-item img-fluid",attrs:{src:t.thumb},on:{click:function(n){e.setWallpaper(t,n)}}})})),e._v(" "),n("div",{attrs:{id:"widget-custom-wallpaper"}},[n("p",[e._v("My Photo "),n("br"),n("small",[e._v("Recommended size ("),n("span",{domProps:{textContent:e._s(e.recommendBGSize)}}),e._v(")")])]),e._v(" "),n("button",{staticClass:"btn btn-default",attrs:{id:"btn-upload-wallpaper"}},[e._v("\n                    +Upload\n                  ")]),e._v(" "),n("input",{attrs:{type:"file",accept:"image/*",id:"wallpaper-input"},on:{change:e.uploadWallpaper}})])])])])])])]),e._v(" "),n("span",{staticClass:"btn-settings",attrs:{slot:"reference","aria-expanded":e.active},slot:"reference"})])],1)},staticRenderFns:[]};t.a=s},"j+YD":function(e,t){},kUyr:function(e,t,n){"use strict";var s={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"app-nt"}},[n("div",{staticClass:"container-fluid"},[n("settings"),e._v(" "),n("div",{attrs:{id:"top-widgets"}},[n("location"),e._v(" "),n("formatted-date-time")],1),e._v(" "),n("new-tab-search-bar")],1),e._v(" "),n("new-tab-footer")],1)},staticRenderFns:[]};t.a=s},nZYA:function(e,t,n){"use strict";var s={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("footer",{staticClass:"footer"},[n("div",{staticClass:"container text-center"},[n("ul",{staticClass:"list-inline"},e._l(e.footerLinks,function(t){return n("li",{staticClass:"list-inline-item"},[n("a",{attrs:{href:t.url}},[e._v(e._s(t.text))])])}))])])},staticRenderFns:[]};t.a=s},niH5:function(e,t,n){"use strict";var s=n("JZSy"),a=n("hJu+"),o=n("VU/8")(s.a,a.a,function(e){n("vJOh")},null,null);t.a=o.exports},oEnz:function(e,t,n){"use strict";var s={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{directives:[{name:"show",rawName:"v-show",value:e.enabled,expression:"enabled"}],attrs:{id:"widget-location"}},[n("div",{directives:[{name:"show",rawName:"v-show",value:e.location.city&&e.location.country,expression:"location.city && location.country"}]},[n("span",{domProps:{textContent:e._s(e.location.city)}}),e._v(", "),n("span",{domProps:{textContent:e._s(""+e.location.country)}})])])},staticRenderFns:[]};t.a=s},uslO:function(e,t,n){function s(e){return n(a(e))}function a(e){var t=o[e];if(!(t+1))throw new Error("Cannot find module '"+e+"'.");return t}var o={"./af":"3CJN","./af.js":"3CJN","./ar":"3MVc","./ar-dz":"tkWw","./ar-dz.js":"tkWw","./ar-kw":"j8cJ","./ar-kw.js":"j8cJ","./ar-ly":"wPpW","./ar-ly.js":"wPpW","./ar-ma":"dURR","./ar-ma.js":"dURR","./ar-sa":"7OnE","./ar-sa.js":"7OnE","./ar-tn":"BEem","./ar-tn.js":"BEem","./ar.js":"3MVc","./az":"eHwN","./az.js":"eHwN","./be":"3hfc","./be.js":"3hfc","./bg":"lOED","./bg.js":"lOED","./bn":"aM0x","./bn.js":"aM0x","./bo":"w2Hs","./bo.js":"w2Hs","./br":"OSsP","./br.js":"OSsP","./bs":"aqvp","./bs.js":"aqvp","./ca":"wIgY","./ca.js":"wIgY","./cs":"ssxj","./cs.js":"ssxj","./cv":"N3vo","./cv.js":"N3vo","./cy":"ZFGz","./cy.js":"ZFGz","./da":"YBA/","./da.js":"YBA/","./de":"DOkx","./de-at":"8v14","./de-at.js":"8v14","./de-ch":"Frex","./de-ch.js":"Frex","./de.js":"DOkx","./dv":"rIuo","./dv.js":"rIuo","./el":"CFqe","./el.js":"CFqe","./en-au":"Sjoy","./en-au.js":"Sjoy","./en-ca":"Tqun","./en-ca.js":"Tqun","./en-gb":"hPuz","./en-gb.js":"hPuz","./en-ie":"ALEw","./en-ie.js":"ALEw","./en-nz":"dyB6","./en-nz.js":"dyB6","./eo":"Nd3h","./eo.js":"Nd3h","./es":"LT9G","./es-do":"7MHZ","./es-do.js":"7MHZ","./es.js":"LT9G","./et":"XlWM","./et.js":"XlWM","./eu":"sqLM","./eu.js":"sqLM","./fa":"2pmY","./fa.js":"2pmY","./fi":"nS2h","./fi.js":"nS2h","./fo":"OVPi","./fo.js":"OVPi","./fr":"tzHd","./fr-ca":"bXQP","./fr-ca.js":"bXQP","./fr-ch":"VK9h","./fr-ch.js":"VK9h","./fr.js":"tzHd","./fy":"g7KF","./fy.js":"g7KF","./gd":"nLOz","./gd.js":"nLOz","./gl":"FuaP","./gl.js":"FuaP","./gom-latn":"+27R","./gom-latn.js":"+27R","./he":"Nzt2","./he.js":"Nzt2","./hi":"ETHv","./hi.js":"ETHv","./hr":"V4qH","./hr.js":"V4qH","./hu":"xne+","./hu.js":"xne+","./hy-am":"GrS7","./hy-am.js":"GrS7","./id":"yRTJ","./id.js":"yRTJ","./is":"upln","./is.js":"upln","./it":"FKXc","./it.js":"FKXc","./ja":"ORgI","./ja.js":"ORgI","./jv":"JwiF","./jv.js":"JwiF","./ka":"RnJI","./ka.js":"RnJI","./kk":"j+vx","./kk.js":"j+vx","./km":"5j66","./km.js":"5j66","./kn":"gEQe","./kn.js":"gEQe","./ko":"eBB/","./ko.js":"eBB/","./ky":"6cf8","./ky.js":"6cf8","./lb":"z3hR","./lb.js":"z3hR","./lo":"nE8X","./lo.js":"nE8X","./lt":"/6P1","./lt.js":"/6P1","./lv":"jxEH","./lv.js":"jxEH","./me":"svD2","./me.js":"svD2","./mi":"gEU3","./mi.js":"gEU3","./mk":"Ab7C","./mk.js":"Ab7C","./ml":"oo1B","./ml.js":"oo1B","./mr":"5vPg","./mr.js":"5vPg","./ms":"ooba","./ms-my":"G++c","./ms-my.js":"G++c","./ms.js":"ooba","./my":"F+2e","./my.js":"F+2e","./nb":"FlzV","./nb.js":"FlzV","./ne":"/mhn","./ne.js":"/mhn","./nl":"3K28","./nl-be":"Bp2f","./nl-be.js":"Bp2f","./nl.js":"3K28","./nn":"C7av","./nn.js":"C7av","./pa-in":"pfs9","./pa-in.js":"pfs9","./pl":"7LV+","./pl.js":"7LV+","./pt":"ZoSI","./pt-br":"AoDM","./pt-br.js":"AoDM","./pt.js":"ZoSI","./ro":"wT5f","./ro.js":"wT5f","./ru":"ulq9","./ru.js":"ulq9","./sd":"fW1y","./sd.js":"fW1y","./se":"5Omq","./se.js":"5Omq","./si":"Lgqo","./si.js":"Lgqo","./sk":"OUMt","./sk.js":"OUMt","./sl":"2s1U","./sl.js":"2s1U","./sq":"V0td","./sq.js":"V0td","./sr":"f4W3","./sr-cyrl":"c1x4","./sr-cyrl.js":"c1x4","./sr.js":"f4W3","./ss":"7Q8x","./ss.js":"7Q8x","./sv":"Fpqq","./sv.js":"Fpqq","./sw":"DSXN","./sw.js":"DSXN","./ta":"+7/x","./ta.js":"+7/x","./te":"Nlnz","./te.js":"Nlnz","./tet":"gUgh","./tet.js":"gUgh","./th":"XzD+","./th.js":"XzD+","./tl-ph":"3LKG","./tl-ph.js":"3LKG","./tlh":"m7yE","./tlh.js":"m7yE","./tr":"k+5o","./tr.js":"k+5o","./tzl":"iNtv","./tzl.js":"iNtv","./tzm":"FRPF","./tzm-latn":"krPU","./tzm-latn.js":"krPU","./tzm.js":"FRPF","./uk":"ntHu","./uk.js":"ntHu","./ur":"uSe8","./ur.js":"uSe8","./uz":"XU1s","./uz-latn":"/bsm","./uz-latn.js":"/bsm","./uz.js":"XU1s","./vi":"0X8Q","./vi.js":"0X8Q","./x-pseudo":"e/KL","./x-pseudo.js":"e/KL","./yo":"YXlc","./yo.js":"YXlc","./zh-cn":"Vz2w","./zh-cn.js":"Vz2w","./zh-hk":"ZUyn","./zh-hk.js":"ZUyn","./zh-tw":"BbgG","./zh-tw.js":"BbgG"};s.keys=function(){return Object.keys(o)},s.resolve=a,e.exports=s,s.id="uslO"},vJOh:function(e,t){},"x7/p":function(e,t,n){"use strict";(function(e){t.a={props:["name","options","value","minimumResultsForSearch","templateResult","templateSelection","onSelectOptionMouseEnter","dropdownParent","classes","id","location"],mounted:function(){var t=this,n=e(this.$el),s=e("#"+this.dropdownParent);s.length||(s=e(document.body)),this.value&&(e(n).val(this.value),e(n).trigger("change")),n.select2({minimumResultsForSearch:this.minimumResultsForSearch,templateResult:this.templateResult,templateSelection:this.templateSelection,dropdownParent:s}),n.on("select2:select",function(e){t.updatedSelected(e.params.data.id)}),this.id&&this.onSelectOptionMouseEnter&&e(document).on("mouseenter",".select2-results__option",this.onSelectOptionMouseEnter)},methods:{updatedSelected:function(e){this.$emit("input",e),this.$store.commit("updateSearchEngine",{selected:e,location:this.location})}}}}).call(t,n("7t+N"))}},["OmpC"]);