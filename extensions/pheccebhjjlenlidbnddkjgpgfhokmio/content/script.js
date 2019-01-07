
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
"use strict";
var msgData;
var msgList;
var onAction=false;

var noLogin;

function onLoad(data,noChange){
  msgData=data;

  if($("#menu")==null){
    var root=$("#header");
    var em = document.createElement("div");
      em.setAttribute("id","menu");
      em.innerHTML='<div class="menu-btn" id="menu-refresh" title="'+exlib.i18nString("refresh")+'"><div></div></div>'
                  +'<div class="menu-btn" id="menu-options" title="'+exlib.i18nString("options")+'"><div></div></div>'
                  +'<div class="menu-btn" id="menu-help" title="'+exlib.i18nString("help")+'"><div></div></div>';
    root.appendChild(em);
    $("#menu-refresh").addEventListener("click",onRefresh);
    $("#menu-options").addEventListener("click",onOptions);
    $("#menu-help").addEventListener("click",onHelp);

    em = document.createElement("div");
    em.setAttribute("id","loading");
    em.setAttribute("class","hidden");
    em.innerHTML='<span>'+exlib.i18nString("loading")+' ...</span>';
    root.appendChild(em);
  }

  root=$("#sidebar1");
  clear(root);
  for(var i in data){
    var host=data[i];
    for(var j in host){
      var o=host[j];
      if(!o.active || !o.enabled)continue;
      var em = document.createElement("div");
      em.setAttribute("class","acc");
        var em1 = document.createElement("div");
          em1.setAttribute("class","acc-title"+(o.count>0?" new-msg":""));
          em1.innerHTML="<img class=\"icon\" src=\""+o.iconURL+"\">"+o.user+(o.count>0?" ("+o.count+")":"");
          em1.addEventListener("click",openUrl.bind(this, null,o.viewURL));
        em.appendChild(em1);
        var em2 = document.createElement("div");
          em2.setAttribute("class","folder");
            var folders=o.folders;
            for(var k in folders){
              var f=folders[k];
              if(f){
                var fo = document.createElement("div");
                fo.innerHTML=(f.title?f.title:f.id)+" ("+f.count+")";
                fo.addEventListener("click",openUrl.bind(this,f.url,o.viewURL,f.action));
                em2.appendChild(fo);
              }
            }
        em.appendChild(em2);
      root.appendChild(em);
    }
  }
  
  if(noChange)return;
  
  var found=false;
  var ar=[];
  for(var i in data){
    var host=data[i];
    for(var j in host){
      var o=host[j];
      if(!o.active || !o.enabled)continue;
      found=true;
      var msg=o.msg;
      for(var k in msg){
        var m=msg[k];
        m.acc=o;
        ar.push(m);
      }
    }
  }
  
  if(!noLogin)noLogin = $("#no-login");

  root=$("#content");  
  clear(root);
  
  if(!found){
    root.appendChild(noLogin);
    return;
  }  
  
  ar.sort(function(a,b){return b.time-a.time;});
  msgList=ar;
  
  var em = document.createElement("table");
  em.setAttribute("id","msgs");
  
  for(var i in ar){
    var m=ar[i];
    m.noAction=m.acc.action==null;
    var em2 = document.createElement("tr");
      var em3 = createElement("td","msg-check");
        var em4 = createElement("input");
        em4.id="selector";
        em4.type="checkbox";
        if(m.noAction)em4.disabled=true;
        else em4.addEventListener("click",onSelect.bind(em4,i));
        em3.appendChild(em4);
      em2.appendChild(em3);
      em3 = createElement("td","msg-acc",m.acc.user);
        em3.innerHTML="<img src=\""+m.acc.iconURL+"\">";
      em2.appendChild(em3);
      em3 = createElement("td","name",m.email);
        em3.innerHTML=m.name;
      em2.appendChild(em3);
      em3 = createElement("td","msg-title");
        em3.innerHTML=m.title+"<span class=\"msg-content\">"+(m.content?" - "+m.content:"")+"</span>";
        var ho={};
        ho[m.acc.host]=[m.acc.user];
        var msgFunc=openMsg.bind(this,m.url,m.acc.viewURL,m.acc.action?[[m.acc.action["read"],[m.mid]]]:null,ho);
        em3.addEventListener("click",msgFunc);
        //em3.addEventListener("click",httpReq.bind(this,m.spamURL));
      em2.appendChild(em3);
      var date=new Date(parseInt(m.time));
      em3 = createElement("td","msg-time",date.toLocaleString());
        em3.innerHTML=getTimeStr(date);
        em3.addEventListener("click",msgFunc);
      em2.appendChild(em3);
    em.appendChild(em2);
  }

  if(ar.length>0){
    var em0 = document.createElement("table");
    em0.setAttribute("id","control");
    em0.innerHTML='<tr><td id="selector-box" class="control-box"><input id="all-selector" type="checkbox"/></td>'
          +'<td id="act-spam" class="act-btn hidden" title="'+exlib.i18nString("spam")+'"><div></div></td>'
          +'<td id="act-del" class="act-btn hidden" title="'+exlib.i18nString("del")+'"><div></div></td>'
          +'<td id="act-read" class="act-btn hidden" title="'+exlib.i18nString("read")+'"><div></div></td></tr>';
    root.appendChild(em0);
    $("#all-selector").addEventListener("click",function(){selectAll(this.checked);});
    $("#act-spam").addEventListener("click",function(){reqAction("spam");});
    $("#act-del").addEventListener("click",function(){reqAction("del");});
    $("#act-read").addEventListener("click",function(){reqAction("read");});
  }

  root.appendChild(em);
}
function showControl(b){
  $("#act-spam").classList.toggle("hidden", !b);
  $("#act-del").classList.toggle("hidden", !b);
  $("#act-read").classList.toggle("hidden", !b);
}
function selectAll(sel){
  var l=$$("#selector");
  for(var i=0;i<l.length;i++){
    if(!msgList[i].working&&!msgList[i].noAction){
      l[i].checked=sel;
      msgList[i].selected=sel;
    }
  }
  showControl(sel);
}
function onSelect(ind){
  msgList[ind].selected=this.checked;

  var all=true;
  var l=$$("#selector");
  for(var i=0;i<l.length;i++){
    if(!l[i].checked&&!msgList[i].working){
      all=false;
      break;
    }
  }
  $("#all-selector").checked=all;

  var selected=false;
  for(var i=0;i<l.length;i++){
    if(l[i].checked&&!msgList[i].working){
      selected=true;
      break;
    }
  }
  showControl(selected);
}

function reqAction(act){
  if(onAction)return;

  var table=$("#msgs");
  var rows=$$("tr",table);
  for(var i=0;i<msgList.length;i++){
    if(msgList[i].selected && !msgList[i].noAction)rows[i].classList.toggle("working", true);
  }

  var ar=[];
  var hosts={};
  for(var i in msgData){
    var host=msgData[i];
    for(var j in host){
      var acc=host[j];
      if(acc.action){
        var msg=acc.msg;
        var list=[];
        for(var k in msg){
          var m=msg[k];
          if(m.selected&&!m.working)list.push(m.mid);
        }
        if(list.length>0){
          ar.push([acc.action[act],list]);
          if(!hosts[i])hosts[i]=[];
          hosts[i].push(acc.user);
        }
      }
    }
  }
  if(ar.length==0)return;
  for(var i=0;i<msgList.length;i++){
    if(msgList[i].selected && !msgList[i].noAction)msgList[i].working=true;
  }  
  setLoading(true);
  chrome.runtime.sendMessage({cmd: "reqAction",req:ar,hosts:hosts});
}
function setLoading(b){
  onAction=b;
  $("#loading").classList.toggle("hidden", !b);
}

function onRefresh(){
  if(onAction)return;
  setLoading(true);
  chrome.runtime.sendMessage({cmd: "refresh"});
}
function onOptions(){
  chrome.runtime.sendMessage({cmd: "options"});
}
function onHelp(){
  openUrl("http://xnotifier.tobwithu.com/dp/forum/10");
}

function onMessage(req, sender, sendResponse) {
  switch(req.cmd){
  case "update":
    setLoading(false);
    onLoad(req.data,!req.changed);
    break;
  }
}
chrome.runtime.onMessage.addListener(onMessage);

document.addEventListener('DOMContentLoaded',function(){
  chrome.runtime.sendMessage({cmd: "getData"},onLoad);
});
