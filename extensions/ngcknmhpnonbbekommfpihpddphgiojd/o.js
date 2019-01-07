/**
* Copyrights (c) 2012 : @author tech4computer
* Released under the CONDITIONAL GPLv3 license with
* ADDITIONAL CONDITIONS THAT OVER RULES CONFLICTING
* PORTION OF GPLv3 ARE:
*  * Cannot commercially redistribute without author's permission.
*  * Cannot list on software directory listings without authors permission.
*  * Software news, blogs sites can publish articles about it. The article,
*    should contain links back pointing to the page where author hosted
*    the software.
*  * The bottom 'Home of this utility ( feedback  )' portion cannot be
*    removed. And its content cannot be changed. It should appear as it is
*    when the script is run.
*  * No derivative works - You may not alter, transform, or build upon this work.
*  * Attribution - You must attribute the work in the manner specified by the
*    author or licensor (but not in any way that suggests that they endorse
*    you or your use of the work)
*  * Cannot copy, modify and re-list the design layout, storage, human interaction concepts.
*  * Cannot copy, modify and re-list as separate Userscript on userscripts.org
*    or on Google Chrome Extensions listing.
*  * Cannot copy, modify and re-list as separate Firefox Addon on addons.mozilla.org
*  * Cannot copy, modify and re-list as separate Google Chrome Extension on
*    Google Chrome Extensions listing sites
*  * Cannot copy, modify and re-list as separate Safari Extension
*  * Cannot copy, modify and re-list as separate Browser Extension or Add-on or Plugin
*  * Cannot copy, modify and re-list as Web App, Mobile App
*  * Cannot copy, modify and re-list as plugin, forum plugin
*
* If anyone wants a feature added to it then make a suggestion
* to author and he will try his best to add it.
*
* Author blog: http://tech4computer.wordpress.com
**/
var ext=chrome.extension.getBackgroundPage();
md=ext.localStorage.getItem('md');
var tbDb;
function restore_options() {
chrome.tabs.getSelected(null,function(tab){
show_options();
var ofMd=document.getElementById("ofMd");
if(ofMd){
ofMd.addEventListener('click', function(){tgl("ofMd");},false);
}
var dblMd=document.getElementById("dblMd");
if(dblMd){
dblMd.addEventListener('click', function(){tgl("dblMd");},false);
}
var eblMd=document.getElementById("eblMd");
if(eblMd){
eblMd.addEventListener('click', function(){tgl("eblMd");},false);
}
var btn=document.getElementById("adpg");
if(btn){
btn.addEventListener('click', function(){adpg();},false);
}
btn=document.getElementById("opnBlg");
if(btn){
btn.addEventListener('click', function(){opnBlg();},false);
}
var rbtn=document.getElementById("rtt");
if(rbtn){
rbtn.addEventListener('click', function(){rttChg();},false);
}
var elk,el;
var els=document.getElementsByClassName("btn-rm");
if(els && els.length>0){
for(var i=0;i<els.length;i++){
elk=Number(els[i].getAttribute("data-k"));
(function(a,b){
a.addEventListener('click', function(){rmpg(b);},false);
})(els[i],elk);
}
}
var btglRf=document.getElementById("tglRf");
if(btglRf){
btglRf.addEventListener('click', function(){tglRf();},false);
}
var b1=document.getElementById("adRfpg");
if(b1){
b1.addEventListener('click', function(){adRfpg();},false);
}
var elk,el;
var els=document.getElementsByClassName("btn-rmrf");
if(els && els.length>0){
for(var i=0;i<els.length;i++){
elk=Number(els[i].getAttribute("data-k"));
(function(a,b){
a.addEventListener('click', function(){rmRfpg(b);},false);
})(els[i],elk);
}
}
});
}
function show_options(){
try{
var h1 = document.getElementById('heading');
h1.appendChild(document.createTextNode(chrome.i18n.getMessage("apSt")));
var content = document.getElementById('sub-content');
var s="";
var sb=[];
sb.push("<form name='slmdkflForm' class='slmdkflForm'>");
var a0=" ",a1=" ",a2=" ";
if(md==0){
a0="checked";
}else if(md==1){
a1="checked";
}else if(md==2){
a2="checked";
}
sb.push("<div class='dv-item-w dv-rd'>");
sb.push("<div  class='dv-item'>");
sb.push("<strong>Use Mode:</strong><br/>");
sb.push('<input id="ofMd" type="radio" name="pwr" value="ofMd" ');
sb.push(' '+a0+'>Turn Off.<br>');
sb.push('<input id="dblMd" type="radio" name="pwr" value="dblMd" ');
sb.push(' '+a1+'>Work on All redirect links (except ones in ‘disable’ list).<br>');
sb.push('<input id="eblMd" type="radio" name="pwr" value="eblMd" ');
sb.push(' '+a2+'>Work Only on specific links/sites that you added to its ‘enable’ list.<br>');
sb.push("</div>");
sb.push("</div>");
sb.push("<div class='dv-item-w dv-rd'>");
sb.push("<div  class='dv-item'>");
if(md<2){
sb.push("If having issues on some website then add its name : <br>");
sb.push("<button  id='adpg'>disable Fix-URL on : </button> <br>");
}else if(md==2){
sb.push("Add site to enable list <br>");
sb.push("<button  id='adpg'>enable Fix-URL on : </button> <br>");
}else{
sb.push("If having issues on some website then add its name : <br>");
sb.push("<button  id='adpg'>disable Fix-URL on : </button> <br>");
}
sb.push("<input class='fld-enbl' type='text' size='40' name='pgu' ");
sb.push("></div>");
sb.push("</div>");
sb.push("<div class='dv-item-w dv-rd'>");
var flg1=0;
for(iDm in ext.blkLst){
if(flg1==0){
flg1=1;
sb.push("<div class='dv-item'>");
if(md<2){
sb.push("<strong>Manage list of sites for which Fix URL is <font class='dsbl'>DISABLED</font></strong>");
}else if(md==2){
sb.push("<strong>Manage list of sites for which Fix URL is <font class='enbl'>ENABLED</font></strong>");
}
sb.push("</div>");
}
sb.push("<div class='dv-item'>");
sb.push("<button class='btn-rm' id='btn-rm-"+ext.blkLst[iDm].k+"' data-k='"+ext.blkLst[iDm].k+"'>remove</button> : ");
if(md<2){
sb.push("<span class='rm-rw' ");
}else{
sb.push("<span class='rm-rw-ebl' ");
}
sb.push(" >"+ext.blkLst[iDm].rc.dm+"</span>");
sb.push("</div>");
}
sb.push("</div>");
sb.push("<div class='dv-item-w dv-rf'>");
sb.push("<div class='dv-item'>");
sb.push("<strong>Referrer:</strong><br/>");
var rfttl="When visiting a webpage, the referrer or referring page is the URL of the previous webpage from which a link was followed. Most web servers maintain logs of all traffic, and record the HTTP referer sent by the web browser for each request.";
sb.push("<input type='checkbox' name='rf' ");
if(Number(ext.localStorage.getItem('rf'))==1){
sb.push(" value='1' checked=true ");
}else{
sb.push(" value='0' ");
}
sb.push(" id='tglRf' title='"+rfttl+"'> remove Referrer. Do not send referring page URL or information.<br><font class='tips-font'><i>&nbsp;&nbsp;"+rfttl+"</i></font><br>");
sb.push("</div>");
sb.push("</div>");
sb.push("<div class='dv-item-w dv-rf'>");
sb.push("<div  class='dv-item'>");
sb.push("If having issues on some website then add its url : <br>");
sb.push("<font class='tips-font'><i>&nbsp;&nbsp;Add site, where Remove Referrer feature messes up normal working of website.</i></font><br>");
sb.push("<button id='adRfpg'>disable Remove Referrer on : </button> <br>");
sb.push("<input class='fld-enbl' type='text' size='40' name='pgrfu' ");
sb.push("></div>");
sb.push("</div>");
sb.push("<div class='dv-item-w dv-rf'>");
var flg1=0;
for(iDm in ext.rfLst){
if(flg1==0){
flg1=1;
sb.push("<div class='dv-item'>");
sb.push("<strong>Manage list of sites for which 'Remove Referrer' is <font class='dsbl'>DISABLED</font></strong>");
sb.push("</div>");
}
sb.push("<div class='dv-item'>");
sb.push("<button class='btn-rmrf' id='btn-rmrf-"+ext.rfLst[iDm].k+"' data-k='"+ext.rfLst[iDm].k+"'>remove</button> : ");
sb.push("<span class='rm-rw-ebl' ");
sb.push(" >"+ext.rfLst[iDm].rc.dm+"</span>");
sb.push("</div>");
}
sb.push("</div>");
sb.push("<div class='dv-item-w dv-rd'>");
sb.push("<div class='dv-item'>Report an issue or give feedback to author : ");
sb.push("<span class='spn-blg' id='opnBlg'>&copy;tech4computer - blog</span><br>");
sb.push("</div>");
sb.push("</div>");
sb.push("</form>");
content.innerHTML=sb.join("\n");
}catch(e){
}
}
function tgl(rbtn) {
var sel=rbtn;
if (sel=="dblMd") {
ext.localStorage.setItem('md',1);
}else if(sel=="ofMd") {
ext.localStorage.setItem('md',0);
}else if(sel=="eblMd") {
ext.localStorage.setItem('md',2);
} else {
ext.localStorage.setItem('md',1);
}
ext.f5();
window.location.reload();
}
function tglRf() {
if(Number(ext.localStorage.getItem('rf'))!=1){
ext.localStorage.setItem('rf',1);
}else{
ext.localStorage.setItem('rf',0);
}
}
adpg=function(){
var flg=0;
if(ext.localStorage.getItem('md')==0){
flg=0;
}else if(ext.localStorage.getItem('md')==1){
flg=0;
}else if(ext.localStorage.getItem('md')==2){
flg=1;
}
var s=document.slmdkflForm.pgu.value.trim();
if(s && s.length>0){
s.replace("http://","");
s.replace("www.","");
ext.slmdkdb.idb.adD({rc:{dm:s,timestamp:Date.now(),flg:flg}});
ext.f5();
}else{
}
};
rmpg=function(id){
if(null!=id && id!=undefined){
ext.slmdkdb.idb.del(id,'d');
ext.f5();
}else{
}
};
adRfpg=function(){
var flg=0;
if(ext.localStorage.getItem('md')==0){
flg=0;
}else if(ext.localStorage.getItem('md')==1){
flg=0;
}else if(ext.localStorage.getItem('md')==2){
flg=1;
}
if(null!=document.slmdkflForm.pgrfu.value && document.slmdkflForm.pgrfu.value.trim().length>0){
ext.slmdkdb.idb.adRfD({rc:{dm:document.slmdkflForm.pgrfu.value.trim(),timestamp:Date.now(),flg:flg}});
ext.f5();
}else{
}
};
rmRfpg=function(id){
if(null!=id && id!=undefined){
ext.slmdkdb.idb.del(id,'rf');
ext.f5();
}else{
}
};
opnBlg = function(){
ext.blg();
};
function init(){
restore_options();
}
window.addEventListener('onload', init(), false);
