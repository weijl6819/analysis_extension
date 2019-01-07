"use strict";
const DASHBOARD="http://xnotifier.tobwithu.com/xn/";

var flag={
  setScriptInfo:false,
  checkGoogle:false
}

var changed=false;
var refresh=false;
var isStartup=false;

var prefs;

var scriptInfo;

var msgData={};

var hdls=[];

function onInstall(){//install, reload in dev tool
  flag.setScriptInfo=true;
  onStartup();
}
var started=false;
function onStartup(){//browser startup, reload
  if(started)return;
  started=true;
//dout("onInit-----------");
  changed=true;
  flag.checkGoogle=true;
  isStartup=true;  
  check();
}
function onStartup2(){
//  dout("startup2-----");
  if(exlib.loadPrefs("reload",false)){
    exlib.savePrefs("reload",null);
    onStartup();
  }//do nothing on event page reload after suspend
}

function onAlarm(alarm){
  check();
}
function setTimer(){
  chrome.alarms.clear("refresh");
  if(prefs["updateInterval"]>0)chrome.alarms.create("refresh", {periodInMinutes: prefs["updateInterval"]});
}

function onOptionsLoad(items,hosts){
  prefs=items;
  var soundData;
  if(prefs["customSound"])soundData=exlib.loadPrefs("soundData","");
  if(soundData){
    $("#sound").src=soundData;
  }else $("#sound").src="notify.ogg";
  loadScripts(hosts,onLoad);
  if(isStartup){
    isStartup=false;
    setTimer();
  }
}

function isFinished(){
  for(var i in hdls){
    if(hdls[i].started){
      return false;
    }
  }
  return true;
}

function check(hosts){//entry point for checking
//dout("\ncheck ["+(hosts?hosts:"")+"] --------------- "+new Date());
  if(!isFinished()){
    dout("on checking already "+new Date().toISOString());
    return;
  }
  if(prefs)loadScripts(hosts,onLoad);
  else loadOptions(onOptionsLoad,hosts);
}

chrome.runtime.onInstalled.addListener(onInstall);
chrome.runtime.onStartup.addListener(onStartup);
chrome.alarms.onAlarm.addListener(onAlarm);
document.addEventListener('DOMContentLoaded',onStartup2);//'chrome.runtime.reload()' does not call onStartup

var lastCheck;

chrome.cookies.onChanged.addListener(function(changeInfo){
  if(!scriptInfo)scriptInfo=exlib.loadPrefs("scriptInfo",[{},{},{}]);
  var list=scriptInfo[0];
  var rs; 
  for(var i in list){
    var o=list[i];
    for(var j in o){
      if(o[j].monitor==false)continue;
      if(changeInfo.cookie.domain==o[j].domain && changeInfo.cookie.name==o[j].name){
//dout(changeInfo);      
//console.log(changeInfo.cookie);      
        if(!rs)rs={};
        rs[i]=true;
        if(i=="google"){
          for(var k in scriptInfo[1])rs[k]=true;
        }
        break;
      }
    }
  }
  if(rs){
    if(lastCheck!=null){
      if(new Date()-lastCheck<200)return; //prevent duplicate check when cookie is updated
    }
    lastCheck=new Date();
    flag.checkGoogle=true;
    check(Object.keys(rs));
  }
});


/*
var filters = {
  //url: [{urlMatches: "accounts.google.com/(ServiceLoginAuth|Logout)"}]
  url: [{urlMatches: "accounts.google.com/(.+)"}]
};
function onNavigate(details) {
  console.log(details.url);
}
chrome.webNavigation.onDOMContentLoaded.addListener(onNavigate, filters);
chrome.webNavigation.onReferenceFragmentUpdated.addListener(onNavigate, filters);
*/
function checkGoogle(list){
  if(!scriptInfo)scriptInfo=exlib.loadPrefs("scriptInfo",[{},{},{}]);
  for(var i in list){
    if(list[i] in scriptInfo[1]){
      return true;
    }
  }
  return false;
}
function checkHostPref(list){
  for(var i=0;i<list.length;i++){//remove disabled hosts
    if(list[i]=="google")continue;
    var h=prefs.host[list[i]];
    if(h==false)list.splice(i--,1);
  }
  var ind;
  if((ind=list.indexOf("google"))>=0){
    if(!checkGoogle(list)){
      list.splice(ind,1);
    }
  }
}
function getHostList(list){
  if(!list){
    list=scriptList.slice(0);//copy
    if(flag.setScriptInfo){//scriptInfo is not set yet
      list.splice(0,0,"google");
      return list;
    }
  }
  checkHostPref(list);
  if(flag.checkGoogle && list.indexOf("google")==-1){
    if(!scriptInfo)scriptInfo=exlib.loadPrefs("scriptInfo",[{},{},{}]);
    for(var i in list){
      if(list[i] in scriptInfo[1]){
        list.splice(0,0,"google");
        break;
      }
    }
  }
  return list;
}

function onLoad(list){
  if(flag.setScriptInfo){
    flag.setScriptInfo=false;
    var t=exlib.loadPrefs("scriptInfo",[{},{},{}]);
    for(var id in scripts){
      if(scripts[id].config.cookies)t[0][id]=scripts[id].config.cookies;
      if(scripts[id].config.isGoogle)t[1][id]=scripts[id].config.multi;
      if(scripts[id].config.inboxOnly)t[2][id]=scripts[id].config.inboxOnly;
    }
    exlib.savePrefs("scriptInfo",t);
    
    checkHostPref(list);
  }

//dout('Init Hosts -------------------');
//dout(list);

  msgData=exlib.loadPrefs("msgData",{});
  var gAccount=exlib.loadPrefs("gAccount",{});

  for(var i in list){
    var id=list[i];
    if(!scripts[id]){
      delete msgData[id];
      continue;
    }
    var googleMulti=scripts[id].config.isGoogle && scripts[id].config.multi;
    if(flag.checkGoogle){
      if(googleMulti)continue;
    }else if(id=="google")continue;

    var h=null;
    if(id in msgData){
      //use previous settings if available;
      for(var u in msgData[id]){
        var o=msgData[id][u];
        if(o.enabled && (o.active || (googleMulti && gAccount[u]))){
          h=getHandler(id,o.nid,u);
          if(o.settings){
            for(var k in o.settings){              
              h[k]=o.settings[k];
            }
          }
          h.check();
          if(!scripts[id].config.multi)break;
        }
      }      
    }
    if(h==null&& !googleMulti){
      var h=getHandler(id,0);
      h.check();
    }
  }
  flag.checkGoogle=false;
}

function getAccountPref(id,user){
  if(user!=null && prefs.acc[id] && prefs.acc[id][user]){
    return prefs.acc[id][user];
  }else return null;
}
function checkAccount(id,user){
  if(user!=null && prefs.acc[id] && prefs.acc[id][user] && !prefs.acc[id][user].enabled){
    return false;
  }else return true;
}

function findHandler(id,user,nid){
  for(var i in hdls){
    var o=hdls[i];
    if(o.id==id && (nid==null||o.nid==nid) && (user==null || o.user==user)){
      return o;
    }
  }
  return null;
}

function getHandler(id,nid,user){
  var h=findHandler(id,user,nid);
//if(h!=null)dout("reuse  "+id+" "+nid+" "+user+" "+h.user);  
  if(h!=null)return h;

//dout("create "+id+" "+nid+" "+user);  
  h=new Handler();
  hdls.push(h);
  h.main=window;
  h.id=id;
  if(nid!=null)h.nid=nid;

  var s=scripts[id];
  for(var i in s){
    h[i]=s[i];
  }
  initHandler(h,user);
  return h;
}

function initHandler(h,user){
  h.user=user;
  h.enabled=true;
  var p=getAccountPref(h.id,user);
  if(p){
    for(var i in p)h[i]=p[i];
  }
  
  h.initHandler();
}

function setUser(hdl,user){ 
//dout("setUser "+hdl.id+" "+user);
  if(!scripts[hdl.id].config.multi && hdl.user!=null && hdl.user!=user){
    msgData[hdl.id][hdl.user].active=false;
  }
  initHandler(hdl,user);
}

function setResult(hdl,data,error){
  if(!error){//check network error
    if(hdl.id=="google"){
      var d=data;
      if(d&&d.length>0){
        var gAccount={};
        for(var i=0;i<d.length;i++){
          gAccount[d[i][0]]=true;
        }        
        exlib.savePrefs("gAccount",gAccount);

        for(var id in scripts){
          if(id=="google")continue;
          if(scripts[id].config.isGoogle && scripts[id].config.multi){
            var accs=msgData[id];
            if(accs){
              for(var i in accs){
                if(!gAccount[i])accs[i].active=false;
              }
            }
            
            var ar=[];
            for(var i=0;i<d.length;i++){//sort with nid
              ar[d[i][3]]=d[i][0];
            }
            for(var i in ar){
              var h=getHandler(id,i,ar[i]);
              h.count=-1; //start again
              h.check();
            }
          }
        }
        return;
      }else{//google logout
        exlib.savePrefs("gAccount",{});
      
        for(var id in scripts){
          if(id=="google")continue;
          if(scripts[id].config.isGoogle){
            var accs=msgData[id];
            for(var i in accs){
              accs[i].active=false;
            }

            for(var i=0;i<hdls.length;i++){
              var o=hdls[i];
              if(o.id==id){
                hdls.splice(i,1);
              }
            }
          }
        }
      }
    }else{
      if(hdl.user){//disable unused accounts after getting userId
        hdl.enabled=checkAccount(hdl.id,hdl.user);
      }
      if(data){
        if(!msgData[hdl.id])msgData[hdl.id]={};
        var d=data;
        if(hdl.settings){
           d.settings={};
           for(var i in hdl.settings){
             var k=hdl.settings[i];
             d.settings[k]=hdl[k]; 
           }
        }
        if(hdl.id=="gmail"){
          d.iconURL=exlib.getURL("res/gmail/"+hdl.nid+".png");
        }else d.iconURL=hdl.config.iconURL;
        d.viewURL=hdl.viewURL;
        d.nid=hdl.nid;
        d.active=true;
        d.enabled=hdl.enabled;
        d.host=hdl.id;
        if(msgData[hdl.id][hdl.user])d.lastTime=msgData[hdl.id][hdl.user].lastTime;
        msgData[hdl.id][hdl.user]=d;
      }else{
        if(msgData[hdl.id]){
          var acc=msgData[hdl.id][hdl.user];
          if(acc)acc.active=false;
        }
      }
    }
  }  
  if(isFinished()){
    msgData=sortData(msgData);
//console.log(msgData);
    //compare data
    var prev=exlib.loadPrefs("msgData",{});
    var hasNoti=false;
    compareData(prev,msgData,function(host,o,m){
//dout(m);
      changed=true;
      
      var showNoti=true; 
      if(o.lastTime!=null&&m.time<=o.lastTime){
        showNoti=false;
      }else o.lastTime=m.time;

      if(prefs["showNotification"]){        
        if(showNoti){
          hasNoti=true;
          chrome.notifications.create(host+"|"+o.user+"|"+m.mid,{
            type:"basic",iconUrl:"res/"+host+(host=="gmail"&&o.nid>0?o.nid:"")+".png",title:m.name,message:m.title,contextMessage:m.content
              ,buttons:o.action?[{title:exlib.i18nString("read")},{title:exlib.i18nString("del")}]:null
          });
        }
      }
    });
    //check removed data and remove notifications
    compareData(msgData,prev,function(host,o,m){
      changed=true;
      clearNotification(host+"|"+o.user+"|"+m.mid);
    });

    var preCount=getCount(prev);
    var ar=[];
    var count=getCount(msgData,ar);
    if(count>preCount||hasNoti){
      if(prefs["alertSound"])$("#sound").play();
    }
    setCount(count,ar);
    exlib.savePrefs("msgData",msgData);

    if(!changed){
      if(checkActiveState(msgData,prev)||checkActiveState(prev,msgData)){//check login/logout
        changed=true;
        refresh=true;
      }
    }
    if(changed||refresh){
      if(refresh){
        refresh=false;
        var req={cmd:"update",data:msgData,changed:changed};
        exlib.getTabs(function(tabs){
          for (var i = 0, tab; tab = tabs[i]; i++){
            if(tab.url==DASHBOARD){
              chrome.tabs.sendMessage(tab.id,req);
            }
          }
        });
        chrome.runtime.sendMessage(req);
      }else updateUrl(DASHBOARD);
      changed=false;
    }
  }
}

// data manage /////////////////////////////////////////////////////////////////
function sortData(data){
  var data2={};
  for(var i in scriptList){//sort to script order
    var o=scriptList[i];
    if(data[o])data2[o]=data[o];
  }
  data=data2;
  //sort with nid
  for(var h in data){
    var acc=data[h];
    var ar=[];
    for(var u in acc){
      ar.push(acc[u]);
    }
    ar=ar.sort(function(a,b){var t=a.active-b.active;return t==0?(a.nid-b.nid):t;});
    var t={};
    for(var i in ar){
      t[ar[i].user]=ar[i];
    }
    data[h]=t;
  }
  return data;
}
function getCount(data,ar){
  var count=0;
  for(var h in data){
    var acc=data[h];
    for(var i in acc){
      var o=acc[i];
      if(!o.active || !o.enabled)continue;
      if(o.count>0){
        count+=o.count;
        if(ar!=null)ar.push(o.user+" : "+o.count);
      }
    }
  }
  return count;
}
function compareData(data1, data2, func/*(host,acc,msg)*/){
  for(var i in data2){
    var host=data2[i];
    for(var j in host){
      var o=host[j];
      var msg=o.msg;
      for(var k in msg){
        var m=msg[k];
        if(getMsg(data1,i,o.user,m.mid)==null){
          func(i,o,m);
        }
      }
    }
  }
}
function getMsg(data,host,acc,mid){
  if(!(host in data))return null;
  var a=data[host][acc];
  if(!a)return null;
  var msg=a.msg;
  for(var k in msg){
    var m=msg[k];
    if(m.mid==mid)return [m,a];
  }
  return null;
}
function checkActiveState(data1,data2){
  for(var h in data1){
    var b=data2[h];
    if(!b)return true;
    var a=data1[h];
    for(var i in a){
      if(!b[i]||b[i].active!=a[i].active)return true;
    }
  }
  return false;
}

function getAction(url,list){
  var ar=[];
  for(var i in url){
    var o=url[i];
    if(o instanceof Array){
      if(!(list instanceof Array))list=[list];
      ar[i]="";
      for(var j=0;j<o.length;j++){
        if(o[j]=="%s"){
          ar[i]+=list.join(o[j+2]+o[j+1]+o[j-1]);
          j++;
        }else if(o[j]=="%r"){
          var t=[];
          for(var k in list)t.push(o[j+1]);
          ar[i]+=t.join(o[j+3]+o[j+2]+o[j-1]);
          j+=2;
        }else ar[i]+=o[j];
      }
    }else{
      ar[i]=o;
    }
  }
  return ar;
}
////////////////////////////////////////////////////////////////////////////////

function procAction(list,hosts){
  var count=list.length;
  var failed=false;
  for(var i in list){
    getHtml(getAction(list[i][0],list[i][1]),function(aData,xhr){
      --count;
      if(xhr.status!=200){
        failed=true;
      }
      if(count==0){
        var ar=[];
        var hst=[];
        for(var h in hosts){//find required handlers
          hst.push(h);
          var o=hosts[h];
          for(var i in o){
            var hd=findHandler(h,o[i]);
            if(hd==null){
              ar=null;
              break;
            }else ar.push(hd);
          }
        }
        if(ar!=null&&prefs&&!failed){//found
          for(var i in ar){
            ar[i].check();
          }
        }else{          
          if(hst){
            if(failed)flag.checkGoogle=true;
            check(hst);
          }
        }
      }
    });
  }
}

var action=null;
function onMessage(req, sender, sendResponse) {
  switch(req.cmd){
  case "getData":
    sendResponse(exlib.loadPrefs("msgData",{}));
    break;
  case "openUrl":
    if(req.action){
      getHtml(req.action,function(){
        openUrl(req.url,req.match);
      });
    }else openUrl(req.url,req.match);
    break;
  case "reqAction":
    refresh=true;
    procAction(req.req,req.hosts);
    break;
  case "refresh":
    refresh=true;
    check();
    break;
  case "options":
    chrome.runtime.openOptionsPage();
    break;
  case "setAction":
    action=req.action;
    break;
  case "getAction":
    sendResponse(action);
    action=null;
    break;
  case "iconClick":
    onIconClick();
    break;
  case "checkOne":
    var h=findHandler(req.host,req.user);
    if(h){
      refresh=true;
      h.check();
    }
    break;    
  }
}
chrome.runtime.onMessage.addListener(onMessage);

chrome.webRequest.onBeforeSendHeaders.addListener(
  function(details) {
    var headers = details.requestHeaders;
    for(var i = 0; i < headers.length; i++){
      if(headers[i].name.toLowerCase() == "origin"){
        if(headers[i].value.indexOf("chrome-extension://")==0){
          headers[i].value='https://www.icloud.com';
          headers.push({name:"Referer",value:"https://www.icloud.com/applications/mail/current/ko-kr/index.html?"});
          break;
        }
      }
    };
    return {requestHeaders: headers};
  }, 
  {urls:["*://*.icloud.com/wm/*","*://*.icloud.com/setup/*"],types:["xmlhttprequest"]}, ["blocking", "requestHeaders"]
);

  function openUrl(aUrl,aMatch){
    var match=aMatch?aMatch:aUrl;
    var url=aUrl?aUrl:aMatch;
    exlib.getTabs(function(tabs){
      for (var i = 0, tab; tab = tabs[i]; i++) {
        if(tab.url.indexOf(match)==0){
          if((tab.url==aUrl || !aUrl))chrome.tabs.update(tab.id, {active: true});
          else chrome.tabs.update(tab.id, {url:url, active: true});
          chrome.windows.update(tab.windowId, {focused:true});
          return;
        }
      }
      chrome.windows.getAll(null,function(win){
        if(win&&win.length>0)chrome.tabs.create({url: url});
        else chrome.windows.create({url: url});
      });
    });
  }
  function updateUrl(url){
    exlib.getTabs(function(tabs){
      for (var i = 0, tab; tab = tabs[i]; i++) {
        if(tab.url==url){
          chrome.tabs.reload(tab.id);
        }
      }
    });
  }
  function onIconClick(tab){
    openUrl(DASHBOARD);
  }

//chrome.browserAction.onClicked.addListener(onIconClick);

// notification //////////////////////////////////////////////////////
chrome.notifications.onClicked.addListener(onNotificationClick);
chrome.notifications.onButtonClicked.addListener(onNotificationClick);
function onNotificationClick(notificationId, buttonId){
  var id=notificationId.split("|");
  var data=exlib.loadPrefs("msgData",{});
  var ar=getMsg(data,id[0],id[1],id[2]);
  if(ar!=null){
    var m=ar[0];
    var acc=ar[1];
    var hosts={};
    hosts[id[0]]=[id[1]];
    if(buttonId==null){
      openUrl(m.url,acc.viewURL);
      procAction([[acc.action.read, m.mid]],hosts);
    }else if(buttonId==0){
      procAction([[acc.action.read, m.mid]],hosts);
    }else procAction([[acc.action.del, m.mid]],hosts);
  }
  clearNotification(notificationId);
}

function clearNotification(notificationId){
  chrome.notifications.clear(notificationId,function(cleared){
    //bug : for notification panel is not updated correctly
    //fix : remove focus from notification panel
    if(cleared){
      chrome.windows.getAll(null,function(win){//check if the current window exists
        if(win&&win.length>0)chrome.windows.update(chrome.windows.WINDOW_ID_CURRENT, {focused:true});
      });
    }
  });
}
//////////////////////////////////////////////////////////////////////

//UI//////////////////////////////////////////////////////////////////
var icons=[{"19":"icon_19_gray.png","38":"icon_38_gray.png"},{"19":"icon_19.png","38":"icon_38.png"}];
function setCount(n,list){
  exlib.setIcon(icons[n>0?1:0]);
  exlib.setBadgeText(n>0?""+n:"");
  var title=exlib.i18nString("app_name");
  if(n>0){
    for(var i in list){
      var o=list[i];
      title+="\n"+o;
    }
  }else title+="\n"+exlib.i18nString("noNewMsg");
  exlib.setTitle(title);
}
//////////////////////////////////////////////////////////////////////