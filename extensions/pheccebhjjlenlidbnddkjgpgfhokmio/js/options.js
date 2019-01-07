var prefs={};
var msgData;

function onLoad(items){
  prefs=items;
  msgData=exlib.loadPrefs("msgData",{});
  prefs["soundData"]=exlib.loadPrefs("soundData","");
  var scriptInfo=exlib.loadPrefs("scriptInfo",[{},{},{}]);
  
  $("#alertSound").addEventListener("click",function(){setPref(this.id,this.checked);toggleCustomSound(this.checked);});
  $("#soundFile").addEventListener("change",function(){onSoundSelect(this.files[0]);});
  $("#btn-choose").addEventListener("click",function(){onChoose();});
  $("#soundUrl").addEventListener("input",function(){setPref(this.id,this.value);});
  $("#showNotification").addEventListener("click",function(){setPref(this.id,this.checked);});

  $("#btn-save").addEventListener("click",function(){onSave();});

  $("#updateInterval").value=prefs["updateInterval"];

  $("#alertSound").checked=prefs["alertSound"];
  $("#showNotification").checked=prefs["showNotification"];

  var em=$("#soundUrl");
  var att = em.getAttribute('i18n-placeholder');
  var s=exlib.i18nString(att);
  if(s)em.setAttribute("placeholder",s);  
  em.value=prefs["soundUrl"];  
  toggleCustomSound(prefs["alertSound"]);
  

  var root=$("#accounts");
  var host=prefs.host;
  var acc=prefs.acc;
  for(var i in scriptList){
    var h=scriptList[i];
    var enabled=true;
    if(host[h]==null)host[h]=true;
    if(!host[h])enabled=false;
    var em = document.createElement("div");
      em.setAttribute("class","host");
      if(!enabled)em.classList.add("exclude");
      em.host=h;
      var em1 = document.createElement("input");
        em1.type="checkbox";
        em1.checked=enabled;
        em1.addEventListener("click",toggleHost);
      em.appendChild(em1);
      em1 = document.createElement("span");
        em1.innerHTML=exlib.i18nString(h);
      em.appendChild(em1);

    if(acc[h]==null)acc[h]={};
    var _acc=acc[h];
    var a=msgData[h];
    if(a){
      for(var i in a){
        if(_acc[i]==null)_acc[i]={enabled:true, inboxOnly:true};
      }
    }
    var keys=Object.keys(_acc).sort();
    var inboxOnly=scriptInfo[2][h];
    for(var k in keys){
      var i=keys[k];
      var active=(a&&a[i]&&a[i].active==true);
      var em0 = document.createElement("div");
      em0.setAttribute("class","row acc collapsed"+(active?"":" disabled"));
      em0.host=h;
      em0.user=i;
      em0.innerHTML='<input type="checkbox"><span></span><div class="expander"></div><div class="del"></div>'
                   +'<div class="row option">'
                   +(inboxOnly?'<input type="checkbox">'+exlib.i18nString("inboxOnly"):"")+'</div>';
      var ch=em0.childNodes;
      ch[0].checked=_acc[i].enabled;
      ch[1].innerHTML=i;
      ch[1].addEventListener("click",toggleCollapse);
      ch[2].addEventListener("click",toggleCollapse);
      ch[3].addEventListener("click",deleteAccount);
      if(inboxOnly)ch[4].childNodes[0].checked=_acc[i].inboxOnly;
      em.appendChild(em0);
    }
    root.appendChild(em);
  }
}
document.addEventListener('DOMContentLoaded', loadOptions.bind(this,onLoad));

function toggleHost(){
  this.parentNode.classList.toggle("exclude",!this.checked);
}
function toggleCollapse(){
  this.parentNode.classList.toggle("collapsed");
}
function deleteAccount(){
  var p=this.parentNode;
  delete prefs.acc[p.host][p.user];
  p.parentNode.removeChild(p);
}

function onSave(){
  prefs["updateInterval"]=parseInt($("#updateInterval").value);
  prefs["customSound"]=prefs["soundUrl"]?true:false;
  if(!prefs["soundUrl"])prefs["soundData"]="";
  else if(prefs["soundUrl"].indexOf("http")==0)prefs["soundData"]=prefs["soundUrl"];
  var l=$$(".host");
  prefs.host={};
  for(var i=0;i<l.length;i++){
    var em=l[i];
    var enable=!em.classList.contains("exclude");
    prefs.host[em.host]=enable;
    if(!enable && msgData[em.host])delete msgData[em.host];
  }

  l=$$(".acc");
  for(var i=0;i<l.length;i++){
    var em=l[i];
    var d=prefs.acc[em.host][em.user];
    d.enabled=em.childNodes[0].checked;
    if(em.childNodes[4].childNodes[0])d.inboxOnly=em.childNodes[4].childNodes[0].checked;
    if(msgData[em.host] && msgData[em.host][em.user]){
      msgData[em.host][em.user].enabled=d.enabled;
    }
  }

  $("#btn-save").disabled=true;

  exlib.savePrefs("msgData",msgData);
  exlib.savePrefs("soundData",prefs["soundData"]);
  delete prefs["soundData"];
  chrome.storage.sync.set(prefs, function(){
    //$("#btn-save").disabled=false;
    exlib.savePrefs("reload",true);
    chrome.runtime.reload();
    //window.close();
  });
}

function setPref(id,val){
  prefs[id]=val;
}
function toggleCustomSound(val){
  $("#soundUrl").disabled=!val;
  $("#btn-choose").disabled=!val;
  $("#soundURL").classList.toggle("disabled",!val);
}

function onChoose(){
  $("#soundFile").value="";
  $("#soundFile").click();
}
function onSoundSelect(file){
  if(!file)return;
  var reader = new FileReader();
  reader.onloadend = function(evt){
    $("#soundUrl").value=file.name;
    prefs["soundUrl"]=file.name;
    prefs["soundData"]=this.result;
  };
  reader.readAsDataURL(file);
}