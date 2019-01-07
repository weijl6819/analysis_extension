"use strict";
/***********************************************************
iCloud
***********************************************************/
scripts["icloud"]={
  config:{
    showFolders:true,
    showSnippets:true,
    includeSpam:true,

    cookies:[{domain:".icloud.com",name:"X-APPLE-WEBAUTH-USER"}],

    iconURL:"https://www.icloud.com/favicon.ico"
  },
  
  init:function(){
    this.infoURL=["https://setup.icloud.com/setup/ws/1/validate",""];
    this.viewURL="https://www.icloud.com/#mail";
  },

  getUser:function(aData){
    var fnd=aData.match(/"primaryEmail":"(\S+?)"/);
    if(fnd)return fnd[1];
    else return null;
  },    
  
  getInfo:function(aData){
    var fnd=aData.match(/"mail":\S+?"url":"(\S+?)"/);
    if(fnd){
      this.baseHost=fnd[1];
      this.dataURL=[this.baseHost+"/wm/folder",'{"jsonrpc":"2.0","method":"list","userStats":{},"systemStats":[0,0,0,0]}',{"Content-Type":"application/json-rpc; charset=UTF-8"}];
      this.dataURL2=[this.baseHost+"/wm/message",'{"jsonrpc":"2.0","method":"list","params":{"guid":"folder:INBOX","sorttype":"Unread","sortorder":"descending","searchtype":null,"searchtext":null,"requesttype":"index","selected":1,"count":50,"rollbackslot":"0.0"},"userStats":{},"systemStats":[0,0,0,0]}',{"Content-Type":"application/json-rpc; charset=UTF-8"}];
      return true;
    }
    return false;
  },
  
  getData:function(aData){
    var obj=[];
    var folders=[];
    
    var num=0;
    var found=false;
    var l;
    try{
      l=JSON.parse(aData).result;
    }catch(e){
      return null;
    }

    for(var i=0;i<l.length;i++){
      var o=l[i];
      var fid=o.guid;
      if(fid=="folder:Archive")continue;
      if(fid=="folder:Deleted Messages")continue;
      if(fid=="folder:Drafts")continue;
      if(fid=="folder:Sent Messages")continue;
      var n=o.unread==null?0:o.unread;
      if(fid=="folder:Junk"){
         this.spam=n;
      }else if(fid=="folder:INBOX"||!this.inboxOnly)num+=n;
      if(n>0&&fid!="folder:INBOX"){
        var t={id:fid,title:o.name,count:n,url:this.viewURL,action:fid};
        folders.push(t);
      }
      found=true;
    }
    if(found)this.count=num;

    var rs={count:this.count,user:this.user,folders:folders,msg:obj,spam:this.spam};
    rs.action={};
    rs.action["read"]=this.getActionUrl("read");
    rs.action["spam"]=this.getActionUrl("spam");
    rs.action["del"]=this.getActionUrl("del");
    return rs;
  },
  
  getData2:function(aData,rs){
    try{
      if(rs.msg==null)rs.msg=[];
      var ar=rs.msg; 
      var o=JSON.parse(aData).result;
      var j=0;
      for(var i in o){
        var m=o[i];
        if(m.type!="CoreMail.Message"||m.unread!=true)continue;        
        if(j>=MAX_MSG)break;
        var d={};
        d.mid=m.uid;
        var sender=m.from.match(/(.+?) <(\S+?)>/);
        if(sender){
          d.email=sender[2];
          d.name=sender[1];
        }else d.name=m.from;
        d.title=m.subject;
        d.content=m.preview;
        try{
          d.time=new Date(m.date).getTime();
        }catch(e){}
        d.url=this.viewURL;
        d.folder=m.folder;
        ar.push(d);
        j++;
      }
      return true;
    }catch(e){}
    return false;
  },  

  getActionUrl:function(act){
    var rs=[];
    switch(act){
    case "read":
      rs[1]=['{"jsonrpc":"2.0","method":"clrflag","params":{"folder":"folder:INBOX","uids":[',
            '"','%s',',','"',  '],"flag":"unread","rollbackslot":"0.0"},"userStats":{},"systemStats":[0,0,0,0]}'];
      break;
    case "spam":
      rs[1]=['{"jsonrpc":"2.0","method":"setflag","params":{"folder":"folder:INBOX","uids":[',
            '"','%s',',','"',  '],"flag":"junk","rollbackslot":"0.0"},"userStats":{},"systemStats":[0,0,0,0]}'];
      break;
    case "del":
      rs[1]=['{"jsonrpc":"2.0","method":"delete","params":{"folder":"folder:INBOX","uids":[',
            '"','%s',',','"',  '],"rollbackslot":"0.0"},"userStats":{},"systemStats":[0,0,0,0]}'];
      break;
    }
    rs[0]=this.baseHost+"/wm/message";
    rs[2]={"Content-Type":"application/json-rpc; charset=UTF-8"};
    return rs;
  }
}