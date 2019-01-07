"use strict";
/***********************************************************
Hotmail
***********************************************************/
scripts["hotmail"]={
  config:{
    inboxOnly:true,
    showFolders:true,
    showSnippets:true,
    includeSpam:true,

    cookies:[{domain:".live.com",name:"WLSSC"}],

    iconURL:"https://outlook.live.com/mail/favicon.ico"
  },
  
  init:function(){ 
    this.infoURL="https://outlook.live.com/";
    this.dataURL=["https://outlook.live.com/owa/sessiondata.ashx?appcacheclient=0","appcacheclient=0"];
    this.viewURL="https://outlook.live.com/";
  },

  process:function(aData,aHttp){ 
    switch(this.stage){
    case ST_INFO_RES:
      var fnd=aData.match(/"clientId":\s*?"(\S+?)"/);//new beta
      if(!fnd){
        fnd=aData.match(/window\.clientId/);
      }    
      if(fnd){
        this.dataURL=["https://outlook.live.com/owa/sessiondata.ashx?appcacheclient=0","appcacheclient=0"];
        this.reuseInfo=true;
        this.getHtml(this.dataURL);
        return false;
      }      
    case ST_DATA_RES:
      var fnd=aData.match(/window\.location\.replace\("(\S+?)"/);
      if(fnd){//old UI
dout("redirect "+fnd[1]+" "+new Date().toISOString());
        this.getHtml(fnd[1]);
        return false;
      }
      var f=this.getForm(aData,"fmHF",true);
      if(f){//login timeout
dout("fmHF "+f[0]+" "+new Date().toISOString());
        this.stage=ST_INFO;
        this.getHtml(f);
        return true;
      }        
      break;
    case ST_INFO_RES+1:
      this.stage=ST_INFO_RES;
      break;
    case ST_DATA_RES+1:
      this.stage=ST_DATA_RES;
      break;
    }
    return this.baseProcess(aData,aHttp);
  },

  getUser:function(aData){  
    var fnd=aData.match(/"LogonEmailAddress":"(\S+?)"/);
    if(fnd){
      delete this.oldUI;
      return fnd[1];
    }
    var fnd=aData.match(/"userEmail":"(\S+?)"/);
    if(fnd){//old UI
      this.oldUI=true;
      return unescape(fnd[1].replace(/\\x40/g,"@"));
    }
    return null;
  },
  
  getInfo:function(aData){
    if(!this.oldUI){
      this.config.iconURL="https://outlook.live.com/owa/favicon.ico";
      return true;
    }
    
    //old UI
    this.dataURL=this.inboxOnly?"https://mail.live.com/?fid=flinbox&fltid=1":"https://mail.live.com/?fid=flsearch&srch=1&scat=1&sdr=10&satt=0";
    this.config.iconURL="https://a.gfx.ms/OLFav.ico";
    
    var fnd=aData.match(/<base\s+href="(\S+?)"/);
    if(fnd){
      var url=fnd[1].match(/(((\S+):\/\/([^/]+))(\S*\/)?)([^/]*)/);
      if(url){
        this.baseHost=url[2];
        this.dataURL=this.dataURL.replace("https://mail.live.com",this.baseHost);
        this.viewURL=this.baseHost+"/";
      }
      
      fnd=aData.match(/"fppConfig":(\{\S+?\})/);
      if(fnd){
        fnd=unescape(fnd[1].replace(/\\u/g,"%u").replace(/\\x/g,"%"));
        var o=JSON.parse(fnd);
        this.authUser=o.AuthUser;
        this.sessionId=o.SessionId;
        return true;
      }
    }
    return false;
  },
    
  getData:function(aData){
    var obj=[];
    var folders=[];
    
    if(!this.oldUI){
      delete this.reuseInfo;

      var o;
      try{
        o=JSON.parse(aData);
      }catch(e){
        ++this.retry;//prevent retry
        return null;
      }
      var l=o.findFolders.Body.ResponseMessages.Items[0].RootFolder.Folders;
      this.count=0;
      this.spam=0;
      var flds={};      
      for(var i in l){
        var f=l[i];
        flds[f.FolderId.Id]=f.DisplayName;
        if(f.FolderClass!="IPF.Note")continue;
        var fid=f.DistinguishedFolderId?f.DistinguishedFolderId:f.FolderId.Id;
        if(fid=="sentitems"||fid=="drafts"||fid=="deleteditems"||fid=="outbox")continue;
        var n=f.UnreadCount;
        if(fid=="junkemail"){
          this.spam=n;
        }else if(this.inboxOnly){
          if(fid=="inbox")this.count+=n;
        }else this.count+=n;
        if(n>0&&fid!="inbox"){
          var fname;
          if(flds[f.ParentFolderId.Id])fname=flds[f.ParentFolderId.Id]+"/"+f.DisplayName;
          else fname=f.DisplayName;
          var t={id:fid,title:fname,count:n,url:this.viewURL};
          folders.push(t);
        }
      }      
      
      var conv=o.findConversation.Body.Conversations;
      for(var i=0;i<conv.length;i++){
        var m=conv[i];
        if(m.GlobalUnreadCount==0)continue;
        var d={};
        d.mid=m.ConversationId.Id;
        //d.email=
        d.name=m.UniqueSenders[0];
        d.title=m.ConversationTopic;
        d.content=m.Preview;
        d.time=new Date(m.LastDeliveryTime).getTime();
        d.url=this.viewURL;
        obj.push(d);
      }    
      
      var rs={count:this.count,user:this.user,folders:folders,msg:obj,spam:this.spam};
      return rs;
    }

    var fnd=aData.match(/HM.ContainerPoolData\(\S+?,0,\{([\s\S]+?)\},\s*\[([\S\s]+?)\]/);
    if(fnd){
      var order=fnd[2].split(",");
      fnd=fnd[1];
      var re=/Folder\("(\S+?)","(\S+?)".+?"([^"]+?)",(\d+)\)\)/g;
      var o;
      var num=0;
      while ((o = re.exec(fnd)) != null){
        if(o[1]=="fldrafts"||o[1]=="flsent"||o[1]=="fltrash")continue;
        var n=parseInt(o[4]);
        if(o[1]=="fljunk"){
          this.spam=n;
        }else if(o[1]=="flinbox"||!this.inboxOnly)num+=n;
        if(n>0&&o[1]!="flinbox"){
          var name=o[3];
          name=unescape(name.replace(/\\u/g,"%u").replace(/\\x/g,"%"));
          var i=order.indexOf("\""+o[1]+"\"");
          var t={id:o[1],title:name,count:n,url:this.baseHost+"/?fid="+o[1]};
          if(i>=0)folders[i]=t;
          else folders.push(t);
        }
      }
      this.count=num;

      var re=/ItemListData\(0,null,\{([^\}]+?)\},\{[^\}]*?\},(\[\S+?\])/g;
      while ((fnd = re.exec(aData)) != null){      
        var order=JSON.parse(fnd[2]);
        fnd=fnd[1].replace(/new HM\.[^\(]+?\(/g,"[").replace(/\)/g,"]");
        //fnd="var o={"+fnd+"}";
        //eval(fnd);
        fnd="{"+fnd+"}";
        fnd=fnd.replace(/\\x22/g,"\\\"").replace(/\\x/g,"%").replace(/\\u/g,"%u");
        var o=JSON.parse(unescape(fnd));
        for(var i=0;i<order.length&&i<MAX_MSG;i++){
          var m=o[order[i]][0];
          var d={};
          d.mid=m[0];
          d.email=m[7][0][2];
          d.name=m[7][0][0];
          d.title=m[9];
          //var time=m[28]; //28: "6/26/2015" 29: "Friday, June 26, 2015 10:15:39 AM" 36: 1435281339373
          d.time=m[36];
          d.url=this.viewURL+"?tid="+d.mid;

          obj.push(d);
        }
      }
    }
    var rs={count:this.count,user:this.user,folders:folders,msg:obj,spam:this.spam};
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
      act="MarkMessagesReadState";
      rs[1]=["cn=Microsoft.Msn.Hotmail.Ui.Fpp.MailBox&mn="+act+"&d=true,[",
            "%22","%s",",","%22",  "],[",
            "{","%r","",",","}",   "],[",
            "{","%r","",",","}",   "],true,{[],[],[],[],[],[]},null&v=1"];
      break;
    case "spam":
      act="MarkMessagesForJmr";
      rs[1]=["cn=Microsoft.Msn.Hotmail.Ui.Fpp.MailBox&mn="+act+"&d=%22flinbox%22,[",
            "%22","%s",",","%22",  "],[",
            "{","%r","",",","}",   "],0,false,0,false,false,[",
            "{","%r","",",","}",   "],true,{[],[],[],[],[],[]},null&v=1"];
      break;
    case "del":
      act="MoveMessagesToFolder";
      rs[1]=["cn=Microsoft.Msn.Hotmail.Ui.Fpp.MailBox&mn="+act+"&d=%22fltrash%22,[",
            "%22","%s",",","%22",  "],[",
            "{","%r","",",","}",   "],[",
            "{","%r","",",","}",   "],false,false,false,true,{[],[],[],[],[],[]},null&v=1"];
      break;
    }
    rs[0]=this.viewURL+"ol/mail.fpp?cnmn=Microsoft.Msn.Hotmail.Ui.Fpp.MailBox."
        +act+"&ptid=0&a="+this.sessionId+"&au="+this.authUser;
    return rs;
  }
}