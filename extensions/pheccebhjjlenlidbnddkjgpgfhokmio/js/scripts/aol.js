"use strict";
/***********************************************************
AOL
***********************************************************/
scripts["aol"]={
  config:{
    showFolders:true,
    showSnippets:true,
    includeSpam:true,

    cookies:[{domain:".aol.com",name:"OTH"}],

    iconURL:"https://mail.aol.com/favicon.ico"
  },
  
  init:function(){
    this.infoURL="https://mail.aol.com";
    this.viewURL="https://mail.aol.com";
  },
  
  getUser:function(aData){
    var fnd=aData.match(/"ActiveUserEmailAddress":"(\S+?)"/);
    if(fnd)return fnd[1];
    else return null;
  },    
  
  getInfo:function(aData){
    var fnd=aData.match(/"UserUID"\s*:\s*"(\S+?)"/);
    var fnd2=aData.match(/"ViewNewOld"\s*:\s*true/);
    if(fnd){
      this.dataURL=["https://mail.aol.com/webmail/rpc/v1/en-us?transport=xmlhttp&user="+fnd[1]+"&a=GetMessageList",
            "requests="+encodeURIComponent('[{"folder":"'+(fnd2?'NewMail':'Inbox')+'","start":0,"count":100,"indexStart":0,"indexMax":100,"index":true,"info":true,"rows":true,"sort":"received","tcs":false,"sortDir":"descending","search":"false","searchIn":"seen","subSearch":"","seen":[],"returnfoldername":true,"import":false,"action":"GetMessageList"}]"')+"&automatic=false"];
      return true;
    }
    return false;
  },
  
  getData:function(aData){
    var msg=[];
    var folders=[];
    
    var num=0;
    var found=false;
    var l;
    try{
      l=JSON.parse(aData)[0];
    }catch(e){
      return null;
    }
    if(!l.folders)return null;
  
    for(var i=0;i<l.folders.length;i++){
      var o=l.folders[i];
      var fid=o[0];
      if(fid=="Drafts")continue;
      if(fid=="Sent")continue;
      if(fid=="Deleted")continue;
      if(fid=="Saved")continue;
      if(fid=="SavedIMs")continue;
      var n=o[6];
      if(fid=="Spam"){
         this.spam=n;
      }else if(fid=="Inbox"||fid=="NewMail"||!this.inboxOnly)num+=n;
      if(n>0&&fid!="Inbox"&&fid!="NewMail"){
        var t={id:fid,title:o[1],count:n,url:this.viewURL};
        folders.push(t);
      }
      found=true;
    }
    if(found)this.count=num;
    
    for(var i=0;i<l.rows.length&&i<MAX_MSG;i++){
      var m=l.rows[i];
      var d={};
      d.mid=m[0];
      d.email=m[1];
      d.name=m[2];
      d.title=m[3];
      d.content=m[21];
      d.time=m[4];
      d.url=this.viewURL;
      //d.folder=m[20];
      msg.push(d);
    }
    
    var rs={count:this.count,user:this.user,folders:folders,msg:msg,spam:this.spam};
    rs.action={};
    rs.action["read"]=this.getActionUrl("read");
    rs.action["spam"]=this.getActionUrl("spam");
    rs.action["del"]=this.getActionUrl("del");
    return rs;
  },

  getActionUrl:function(act){
    var rs=[];
    switch(act){
    case "read":
      rs[1]=["requests="+encodeURIComponent('[{"messageAction":"seen","folder":"Inbox","uids":{"Inbox":['),
            '%22','%s',',','%22',  encodeURIComponent(']},"xuids":{},"checkUndo":false,"isUndoAction":false,"returnSpamKnob":false,"isSearchAction":false,"action":"MessageAction"}]"')+"&automatic=false"];
      break;
    case "spam":
      rs[1]=["requests="+encodeURIComponent('[{"messageAction":"reportSpam","folder":"Inbox","uids":{"Inbox":['),
            '%22','%s',',','%22',  encodeURIComponent(']},"xuids":{},"isSpam":true,"checkUndo":true,"isUndoAction":false,"returnSpamKnob":true,"isSearchAction":false,"action":"MessageAction"}]"')+"&automatic=false"];
      break;
    case "del":
      rs[1]=["requests="+encodeURIComponent('[{"messageAction":"delete","folder":"Inbox","uids":{"Inbox":['),
            '%22','%s',',','%22',  encodeURIComponent(']},"xuids":{},"checkUndo":true,"reason":"delebtn","isAllSelected":false,"isUndoAction":false,"returnSpamKnob":false,"isSearchAction":false,"action":"MessageAction"}]"')+"&automatic=false"];
      break;
    }
    rs[0]=this.dataURL[0];
    return rs;
  }
}