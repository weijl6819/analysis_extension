"use strict";

function checkNow(){
   chrome.runtime.sendMessage({cmd: "refresh"});
   window.close();
}
function openDashboard(){
  chrome.runtime.sendMessage({cmd: "iconClick"});
  window.close();
}
function onPageLoad(){
  $("#dashboard").addEventListener("click",openDashboard);
  $("#chk").addEventListener("click",checkNow);
  chrome.runtime.sendMessage({cmd: "getData"},onLoad);
}
function openUrl2(event){
  if(event.button==0&&event.shiftKey||event.button==1){
    chrome.runtime.sendMessage({cmd:"checkOne",host:this.host,user:this.user});
  }else{
    openUrl(null,this.viewURL);
  }
  window.close();
}

function onLoad(data){
  var root=$("#accounts");
  clear(root);
  for(var i in data){
    var host=data[i];
    for(var j in host){
      var o=host[j];
      if(!o.active || !o.enabled)continue;
      
      var folders=o.folders;
      var tooltip="";
      for(var k in folders){
        var f=folders[k];
        if(f){
          tooltip+=" - "+(f.title?f.title:f.id)+" : "+f.count+"\n";
        }
      }
      if(tooltip){
        tooltip=o.user+(o.count>0?" : "+o.count:"")+"\n"+tooltip;
      }
      
      var em = createElement("div","menu flex"+(o.count>0?" newMsg":""),tooltip);
      em.addEventListener("click",openUrl2.bind(o));
          var em2=createElement("div","icon");
          em2.style.backgroundImage="url("+o.iconURL+")";
        em.appendChild(em2);

          var em2=createElement("div","acc");
          var em3=document.createTextNode(o.user);
          em2.appendChild(em3);
        em.appendChild(em2);

        var em2=createElement("div","num");
          em2.setAttribute("class","num");
          var em3=document.createTextNode(o.count>0?o.count:"");
          em2.appendChild(em3);
        em.appendChild(em2);      
      root.appendChild(em);
    }
  }
}

function onMessage(req, sender, sendResponse) {
  switch(req.cmd){
  case "update":
    onLoad(req.data);
    break;
  }
}
chrome.runtime.onMessage.addListener(onMessage);

document.addEventListener('DOMContentLoaded',onPageLoad);
