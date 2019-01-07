"use strict";

var scripts={};

function loadScripts(host,func){  
  var list=getHostList(host);

  var scriptCount=0;
  for(var i in list)++scriptCount;
  for(var i in list){
    loadScript(list[i],function(){
      --scriptCount;
      if(scriptCount==0){//All files loaded
        func(list);
      }
    });
  }
}

function loadScript(id,func){
  if(scripts[id]){
    func();
    return;
  }
  var script;
  var s=$$("script#"+id);  
  if(s.length>0){
    script=s[0];
  }else{
    script=document.createElement("script");
    script.type= "text/javascript";
    script.src="js/scripts/"+id+".js";
    script.id=id;
    document.getElementsByTagName("head")[0].appendChild(script);
  }
  
  function listener(e){
    func();
    script.removeEventListener("load", listener);
    script.removeEventListener("error", listener);
    if(e.type=="error")script.parentNode.removeChild(script);
  }
  script.addEventListener("load", listener);
  script.addEventListener("error", listener);
}