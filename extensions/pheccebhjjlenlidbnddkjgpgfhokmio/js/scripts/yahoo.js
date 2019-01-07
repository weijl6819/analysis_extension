"use strict";
/***********************************************************
Yahoo
***********************************************************/
scripts["yahoo"]={
  config:{
    inboxOnly:true,
    showFolders:true,
    showSnippets:true,
    includeSpam:true,

    cookies:[{domain:".yahoo.com",name:"T"}],

    iconURL:"https://s.yimg.com/nq/favicons/2/favicons/favicon-no-badge-32x32.png"
  },
  
  init:function(){
    this.infoURL="https://mail.yahoo.com/";
    this.reuseInfo=true;
    this.viewURL="https://mail.yahoo.com/";
    this.oldUI=false;
  },

  getUser:function(aData){
    var fnd=aData.match(/"yid":"(\S+?)"/);
    var fnd2=aData.match(/"accounts".+?"email":"(\S+?)"/); 
    if(fnd&&fnd2)return fnd2[1];    
    fnd=aData.match(/"defaultID":"(\S+?)"/);
    if(fnd)return fnd[1];
    else return null;
  },
  
  getInfo:function(aData){
    var fnd=aData.match(/"yid":"(\S+?)"/);
    if(!fnd)this.oldUI=true;
    if(this.oldUI){
      this.config.iconURL="https://s.yimg.com/nq/favicons/2/favicons/favicon-no-badge-32x32.png";
      var fnd=aData.match(/data-host="(\S+?)"/);
      if(fnd){
        this.baseHost="https://"+fnd[1]
        this.dataURL=this.baseHost+"/neo/launch";
      }
      var fnd2=aData.match(/str_nav_spam\s*:\s*"(.+?)"/);
      if(fnd2)this.spamName=fnd2[1];
      else this.spamName="Spam";      
    }else{
      this.config.iconURL="https://s.yimg.com/nq/nr/img/favicon_LFWFGUw4cMt2cbVGy0T6xBqoJ4BBr2VKY56xSLK4IX0.ico";
      this.baseHost="https://mail.yahoo.com";
    }
    return true;
  },
  
  getData:function(aData){
    if(this.user!=this.getUser(aData)){//check account because of yahoo account manager
      this.count=-1;
      return null;
    }
    
    var obj=[];
    var folders=[];
        
    if(!this.oldUI){
      var fnd=aData.match(/,"folders":({[\s\S]+?}),"savedSearches"/);
      if(fnd){
        var num=0;
        var l=JSON.parse(fnd[1]);      
        for(var i in l){
          var o=l[i];       
          var fid=o.types[0];
          if(fid=="CHATS")continue;
          if(fid=="DRAFT")continue;
          if(fid=="SENT")continue;
          if(fid=="TRASH")continue;
          if(o.types.indexOf("INVISIBLE")!=-1)continue;         
          var n=o.unread;
          if(fid=="BULK"){
            this.spam=n;
          }else if(fid=="INBOX"||!this.inboxOnly)num+=n;
          if(n>0&&fid!="INBOX"){
            var t={id:o.id,title:o.name,count:n,url:this.baseHost+"/d/folders/"+o.id};
            folders.push(t);
          }
        }
        this.count=num;
        
        fnd=aData.match(/"messageGroupList":(\[{[\S\s]+?}\]),"actionTimestamp"/);    
        var l=JSON.parse(fnd[1]);
        var n=0;
        for(var i in l){
          if(n>=MAX_MSG)break;
          var mg=l[i].messages;
          for(var j in mg){
            if(n>=MAX_MSG)break;
            var m=mg[j]; 
            if(m.flags.read)continue;
            var d={};
            d.mid=m.id;
            d.email=m.headers.from[0].email;
            d.name=m.headers.from[0].name;
            d.title=m.headers.subject;
            d.content=m.snippet;
            d.time=m.headers.date*1000;
            d.url=this.baseHost+"/d/folders/"+m.folder.id+"/messages/"+m.conversationId;
            obj.push(d);  
            ++n;
          }
        }
        var rs={count:this.count,user:this.user,folders:folders,msg:obj,spam:this.spam};
        return rs;
      }
    }
      
    var fnd=aData.match(/\.folders\s*?=\s*?({[\s\S]+?});/);
    if(fnd){     
      var num=0;
      var l=JSON.parse(fnd[1]).folder;
      for(var i=0;i<l.length;i++){
        var o=l[i];     
        var fid=o.folderInfo.fid;
        if(fid=="%40C%40Chats")continue;
        if(fid=="Draft")continue;
        if(fid=="Sent")continue;
        if(fid=="Trash")continue;
        var n=o.unread;        
        if(fid=="%40B%40Bulk"){
           this.spam=n;
        }else if(fid=="Inbox"||!this.inboxOnly)num+=n;
        if(n>0&&fid!="Inbox"){
          var fn=fid=="%40B%40Bulk"?this.spamName:unescape(o.folderInfo.name.replace(/\\u/g,"%u"));
          var t={id:fid,title:fn,count:n,url:this.baseHost+"?fid="+encodeURIComponent(fid)};
          folders.push(t);
        }
      }
      this.count=num;
    }
    fnd=aData.match(/\.msgListObj\s*?=\s*?(\[[\s\S]*?\]);/);
    if(fnd){
      var l=JSON.parse(fnd[1]);
      var em=document.createElement("span");
      for(var i=0;i<l.length&&i<MAX_MSG;i++){
        var m=l[i]; 
        if(m.totalUnread==0)continue;
        var d={};
        d.mid=m.mid;
        d.email=m.messageInfo[0].from.email;
        d.name=m.messageInfo[0].from.name;
        d.title=m.subject;
        em.innerHTML=m.snippetStr;//decode HTML entity
        d.content=em.innerText;        
        d.time=m.rawDate*1000;
        d.url=this.viewURL;
        obj.push(d);        
      }
    }
    var rs={count:this.count,user:this.user,folders:folders,msg:obj,spam:this.spam};
    return rs;
  }
}