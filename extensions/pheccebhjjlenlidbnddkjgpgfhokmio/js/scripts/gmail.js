"use strict";
/***********************************************************
Gmail
***********************************************************/
scripts["gmail"]={
  config:{
    isGoogle:true,
    multi:true,

    inboxOnly:true,
    showFolders:true,
    showSnippets:true,
    includeSpam:true,

    iconURL:"https://ssl.gstatic.com/ui/v1/icons/mail/images/favicon5.ico"
  },

  init:function(){
    this.useInboxCount=true;
    this.infoURL="https://mail.google.com/mail/u/"+this.nid+"/";
    this.viewURL=this.infoURL;
    this.dataURL2=this.viewURL+"feed/atom"+(this.inboxOnly?"":"/unread");    
  },

  getInfo:function(aData){
    var fnd=aData.match(/"sx_iosc"\s*,\s*"(\S+?)"/);
    var fnd1=aData.match(/"\/mail(?:\/u\/(\d+))?",\S+?,"(\S+?)"/);    
    if(fnd&&fnd1){
      var filter="is:unread";      
      if(this.inboxOnly){           
        if(fnd[1]!="^smartlabel_personal" && fnd[1]!="^u|" && fnd[1]!="^t|"){
          var fnd2=aData.match(/"ix_ioiut"\s*,\s*"(\S+?)"/);
          if(!fnd2 || fnd2[1] == "0"){
            this.useInboxCount=false;
            if(fnd[1].indexOf("^smartlabel_personal")>=0){
              filter+=" category:primary";
            }else{
              filter+=" l:^io_im";
            }
          }
        }
      }

      var fnd=aData.match(/\["sld",\[(\[[\s\S]+?\])\]/);
      if(fnd){
        var re=/\["(.+?)"\s*,\s*"(.+?)"/g;
        var o;
        this.smartlabel={};
        while ((o = re.exec(fnd[1])) != null){
          var fn=unescape(o[2].replace(/\\u/g,"%u"))
          this.smartlabel[o[1]]=fn;
        }
      }else{
        this.smartlabel={"^smartlabel_promo":"Promotions","^smartlabel_notification":"Updates","^smartlabel_social":"Social","^smartlabel_group":"Forums","^smartlabel_personal":"Personal"};
      }
      this.ik=fnd1[2];
      fnd=aData.match(/GM_ACTION_TOKEN="(\S+?)"/);
      if(fnd)this.actionToken=fnd[1];
      this.dataURL=this.viewURL+"?ui=2&ik="+this.ik+"&at="+this.actionToken+"&view=tl&start=0&num=25&rt=c&as_has="+encodeURIComponent(filter)+"&as_subset="+(this.inboxOnly?"inbox":"all")+"&search=adv";
      return true;
    }
    return false;
  },

  getData:function(aData){
    this.count=-1;
    var obj=[];
    var folders=[];
    var fnd;
    if(this.inboxOnly)fnd=aData.match(this.useInboxCount?/"ld",\[[\S\s]*?\["\^i",(\d+)/:/"ld",\[[\S\s]*?\["\^ig",(\d+)/);
    else fnd=aData.match(/\["ti",.+?,(\d+)/);
    if(fnd){
      this.count=parseInt(fnd[1]);

      var fnd2=aData.match(/"ld",\[\[[\S\s]+?"\^s",(\d+)/);
      if(fnd2){
        this.spam=parseInt(fnd2[1]);
      }
      if(this.count>=0){
        var d=aData;
        fnd=null;
        var list=[];
        while(fnd=d.match(/\n(\d+?)(\n([\S\s]+))/)){
          d=fnd[2].substring(0,fnd[1]);
          d=d.replace(/\[\s*,/g,"[null,").replace(/,\s*(?=,)/g,",null").replace(/,\s*\]/g,",null]");
          var o=JSON.parse(d);
          list=list.concat(o);
          d=fnd[3];
        }
                
        fnd=null;
        for(var i=0;i<list.length;i++){
          if(list[i][0]=="ld"){
            fnd=list[i];
            break;
          }
        }
        if(fnd){
          if(fnd[2]){
            var t=fnd[2];
            for(var i=0;i<t.length;i++){
              var o=t[i];
              if(o[1]>0){
                folders.push({id:o[0],count:o[1],url:this.viewURL+"#label/"+o[0]});
              }
            }
          }

          if(fnd[4]){
            var t=fnd[4];
            var slb={"social":"social","promo":"promotions","notification":"updates","group":"forums"};
            for(var i=0;i<t.length;i++){
              var o=t[i];
              if(o[1]>0){
                var cat="#category/"+slb[o[0].substring(12)];
                folders.push({id:cat,title:this.smartlabel?this.smartlabel[o[0]]:o[0],count:o[1],url:this.viewURL+cat});
              }
            }
          }          
        }

        fnd=null;
        for(var i=0;i<list.length;i++){
          if(list[i][0]=="tb"){
            fnd=list[i];
            break;
          }
        }
        if(fnd){
          o=fnd[2];
          var em=document.createElement("span");
          for(var i=0;i<o.length&&i<MAX_MSG;i++){
            var m=o[i];
            var d={};
            //d.cid=m[0];
            d.mid=m[1];
            var str=m[7].match(/email="(\S+?)".+?name="(.+?)"/);
            d.email=str[1];
            em.innerHTML=str[2];
            d.name=em.innerText;
            em.innerHTML=m[9];
            d.title=em.innerText;
            em.innerHTML=m[10];//decode HTML entity
            d.content=em.innerText;
            //var time=m[14].replace(/<\S+?>/g,""); //14: "<b>14:58</b>"15: "2015년 7월 17일 오후 2:58" 16: 1437117948447000
            d.time=m[16]/1000;
            d.url=this.viewURL+(this.inboxOnly?"#inbox":"#all")+"/"+d.mid;
            
            d.readURL=this.getActionUrl("rd",d.mid);
            d.spamURL=this.getActionUrl("sp",d.mid);
            d.delURL=this.getActionUrl("tr",d.mid);

            obj.push(d);
  //dout(mid+" "+email+" "+sender);
  //dout(title+" "+content+" "+time);
          }
        }
      }
      if(this.spam>0)folders.push({id:"Spam",count:this.spam,url:this.viewURL+"#spam"});
    }
  //dout(obj);
    var rs={count:this.count,user:this.user,folders:folders,msg:obj,spam:this.spam};
    rs.action={};
    rs.action["read"]=this.getActionUrl("rd");
    rs.action["spam"]=this.getActionUrl("sp");
    rs.action["del"]=this.getActionUrl("tr");
    return rs;
  },

  getActionUrl:function(act){
    var rs=[];
    rs[0]=this.viewURL+"?ui=2&ik="+this.ik+"&at="+this.actionToken+"&view=up&act="
        +act+"&pcd=1&mb=0&rt=j&search=inbox";
    rs[1]=["t=","%s","","&"];
    return rs;
  },
  
  getData2:function(aData,rs){
    try{
      var parser = new DOMParser();
      var doc = parser.parseFromString(aData,"text/xml");
      var ar=doc.querySelectorAll("entry");
      var timeMap={};
      for(var i=0;i<ar.length;i++){
        var em=ar[i];
        var id=em.querySelector("link");
        id=id.getAttribute("href");
        id=id.match(/message_id=(\S+?)&/)[1];
        var t=em.querySelector("issued");
        t=new Date(t.textContent).getTime();
        timeMap[id]=t;
      }
      for(var i in rs.msg){
        var d=rs.msg[i];
        if(d.mid in timeMap)d.time=timeMap[d.mid];        
      }
      return true;
    }catch(e){}
    return false;
  }
  
}