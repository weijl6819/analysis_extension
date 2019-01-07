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
var slmdkfl = {
slmdkfl : "1"
};
var ext=chrome.extension.getBackgroundPage();
md=ext.localStorage.getItem('md');
var tbDb;
function restore_options() {
chrome.tabs.getSelected(null,function(tab){
for(kTb in ext.pgAcTbs){
if(ext.pgAcTbs[kTb].id==tab.id){
tbDb=ext.pgAcTbs[kTb];
break;
}
}
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
var btn2=document.getElementById("rmpg");
if(btn2){
btn2.addEventListener('click', function(){rmpg();},false);
}
var btn3=document.getElementById("adpg2");
if(btn3){
btn3.addEventListener('click', function(){adpg2();},false);
}
var btn4=document.getElementById("rmpg2");
if(btn4){
btn4.addEventListener('click', function(){rmpg2();},false);
}
btn=document.getElementById("opnBlg");
if(btn){
btn.addEventListener('click', function(){opnBlg();},false);
}
var btn5=document.getElementById("opnBlgSpn");
if(btn5){
btn5.addEventListener('click', function(){opnBlg();},false);
}
var btn6=document.getElementById("opns");
if(btn6){
btn6.addEventListener('click', function(){opns();},false);
}
});
}
function dbg(vn,v){
return "<div id='dbg'>"+vn+" : "+v+"</div>";
}
function show_options(){
try{
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
sb.push("<div class='dv-item-w-alpha'>");
sb.push("<div  class='dv-item'>");
if(tbDb.k==1 && md<2){
sb.push("<strong>If having issues on this website then </strong><br>");
sb.push("<button id='adpg'>disable Fix-URL on : </button> <br>");
sb.push("<input class='fld-enbl' type='text' size='40' name='pgu' ");
}else if(tbDb.k==1 && md==2){
sb.push("<strong>Remove site from enabled list. </strong><br>");
sb.push("<button id='rmpg'>disable Fix-URL on : </button> <br>");
sb.push("<input class='fld-enbl' type='text' size='40' name='pgu' ");
}else if(tbDb.k==2 && md<2){
sb.push("<strong>Fix-URL is disabled for this site. </strong><br>");
sb.push("<button id='rmpg'>re-enable Fix-URL on : </button> <br>");
sb.push("<input class='fld-dsbl' type='text' size='40' name='pgu' ");
}else if(tbDb.k==2 && md==2){
sb.push("<strong>Add site to enable list </strong><br>");
sb.push("<button id='adpg'>enable Fix-URL on : </button> <br>");
sb.push("<input class='fld-dsbl' type='text' size='40' name='pgu' ");
}else{
sb.push("<strong>If having issues on this website then <strong><br>");
sb.push("<button id='adpg'>disable Fix-URL on : </button> <br>");
sb.push("<input class='fld-enbl' type='text' size='40' name='pgu' ");
}
var hst=tbDb.u0.replace("http://","");
var hst=hst.replace("https://","");
var hst=hst.replace("www.","");
if(hst.indexOf("/")!=-1) hst=hst.substring(0,hst.indexOf("/"));
if(hst.indexOf("?")!=-1) hst=hst.substring(0,hst.indexOf("?"));
sb.push(" value='"+hst+"'");
sb.push("></div>");
sb.push("<div  class='dv-item'>");
sb.push("Or <br>");
if(tbDb.k==1 && md<2){
sb.push("<button id='adpg2''>disable Fix-URL for specific link : </button> <br>");
sb.push("<input class='fld-enbl' type='text' size='40' name='pgu2' ");
}else if(tbDb.k==1 && md==2){
sb.push("<button id='rmpg2'>disable Fix-URL for specific link : </button> <br>");
sb.push("<input class='fld-enbl' type='text' size='40' name='pgu2' ");
}else if(tbDb.k==2 && md<2){
sb.push("<button id='rmpg2'>re-enable Fix-URL for specific link : </button> <br>");
sb.push("<input class='fld-dsbl' type='text' size='40' name='pgu2' ");
}else if(tbDb.k==2 && md==2){
sb.push("<button id='adpg2''>enable Fix-URL for specific link : </button> <br>");
sb.push("<input class='fld-dsbl' type='text' size='40' name='pgu2' ");
}else{
sb.push("<button id='adpg2''>disable Fix-URL for specific link : </button> <br>");
sb.push("<input class='fld-enbl' type='text' size='40' name='pgu2' ");
}
var hst2=tbDb.u0.replace("http://","");
var hst2=hst2.replace("https://","");
var hst2=hst2.replace("www.","");
hst2=hst2.substring(0,hst2.lastIndexOf("http"));
sb.push(" value='"+hst2+"'");
sb.push("></div>");
sb.push("</div>");
sb.push("<div class='dv-item-w'>");
sb.push("<div  class='dv-item'>");
sb.push("<details><summary>Report an issue or give feedback to author</summary>");
sb.push("<p class='p-dtls'>To report issue to author, Copy below text and Paste it into Comments on ");
sb.push("<a class='spn-blg' href='#' id='opnBlg'>Author's site</a>. Add your comment to it.</p>");
sb.push("<textarea name='fdbk' class='txta' rows='7'>");
sb.push(tbDb.u0+"\n");
sb.push(tbDb.u1);
sb.push("</textarea>");
sb.push("</details>");
sb.push("</div>");
sb.push("</div>");
sb.push("<div class='dv-item-w'><div class='dv-item'><button id='opns' title='Manage list of sites where Fix-URL is disabled'>more options</button><br></div></div>");
sb.push("<div class='dv-item-w'>");
sb.push("<div class='dv-item'>");
sb.push("<span class='spn-blg' id='opnBlgSpn'>&copy;tech4computer - blog</span><br>");
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
window.close();
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
ext.slmdkdb.idb.adD({rc:{dm:s,timestamp:Date.now(),flg:flg}});
ext.rmTb(tbDb.id);
}else{
}
window.close();
};
adpg2=function(){
var flg=0;
if(ext.localStorage.getItem('md')==0){
flg=0;
}else if(ext.localStorage.getItem('md')==1){
flg=0;
}else if(ext.localStorage.getItem('md')==2){
flg=1;
}
var s=document.slmdkflForm.pgu2.value.trim();
if(s && s.length>0){
ext.slmdkdb.idb.adD({rc:{dm:s,timestamp:Date.now(),flg:flg}});
ext.rmTb(tbDb.id);
}else{
}
window.close();
};
rmpg=function(){
if(null!=document.slmdkflForm.pgu.value && document.slmdkflForm.pgu.value.trim().length>0){
ext.slmdkdb.idb.del(tbDb.tid,'d');
ext.rmTb(tbDb.id);
}else{
}
window.close();
};
rmpg2=function(){
if(null!=document.slmdkflForm.pgu2.value && document.slmdkflForm.pgu2.value.trim().length>0){
ext.slmdkdb.idb.del(tbDb.tid,'d');
ext.rmTb(tbDb.id);
}else{
}
window.close();
};
opnBlg = function(){
ext.blg();
window.close();
};
opns = function(){
ext.opns();
window.close();
};
function init(){
restore_options();
}
window.addEventListener('onload', init(), false);
