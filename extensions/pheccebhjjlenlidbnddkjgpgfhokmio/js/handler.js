"use strict";
const MAX_MSG = 5;

const ST_COOKIE      = 200;
const ST_COOKIE_RES  = 201;
const ST_INFO        = 300;
const ST_INFO_RES    = 301;
const ST_DATA        = 400;
const ST_DATA_RES    = 401;
const ST_DATA2       = 500;
const ST_DATA2_RES   = 501;

function Handler(main){
  this.main=main;
}
Handler.prototype={
  inboxOnly: true,

  stage: 0,
  initStage: ST_INFO,
  count:-1,
  user:"",
  started:false,
  retry:0,
  lastCheck:null,

  initHandler:function(){
    this.initStage=this.config.cookies?ST_COOKIE:ST_INFO;
    this.count=-1;
    this.retry=0;
    delete this.dataURL;
    this.init();
    if(!this.dataURL)this.dataURL=this.infoURL; 
    if(!this.config.iconURL){
      try{
        var url=this.viewURL.match(/(((\S+):\/\/([^/]+))(\S*\/)?)([^/]*)/);
        if(url)this.config.iconURL=url[2]+"/favicon.ico";
      }catch(e){}
    }    
  },
  
  reset : function(){
    this.count=-1;
    this.stage=this.initStage;
  },
  
  check : function(){
    if(!this.enabled)return;
if(this.started)dout("started "+this.user+" "+this.lastCheck);
    if(this.started && this.lastCheck!=null && (new Date()-this.lastCheck<6000))return; //prevent duplicate check;
    this.lastCheck=new Date();    
    this.stop();
    if(this.count<0)this.reset();
    else this.stage=ST_DATA;
    this.started=true;
    this.doNext("");
  },
  stop : function(){
    if(this.xhr){
      this.xhr.onreadystatechange=null;
      this.xhr.abort();
      delete this.xhr;
    }
  },
  doNext:function(aData,aHttp){
    if(aData==null){//suspend
      if(this.checkRetry())return;
      this.onError(aData);
      return;
    }
    try{
      if(!this.process(aData,aHttp))++this.stage;
      delete this.xhr;
    }catch(e){
      this.onError(aData);
      if(e&&e.stack)console.info(e.stack);
    }
  },
  checkRetry:function(){
    if(this.retry<1){
      ++this.retry;
      this.count=-1;
      this.started=false;
      this.check();
      return true;
    }else return false;
  },
  process:function(aData,aHttp){
//dout(this.stage);
//dout(this.stage+" "+aData);
    switch(this.stage){
    case ST_COOKIE:
      this.checkCookies();
      return false;
    case ST_COOKIE_RES://no cookie
      this.reset();
      this.setResult(null);
      return true;
    case ST_INFO:
      this.getHtml(this.infoURL);
      return false;
    case ST_INFO_RES:
      var user=this.getUser(aData);
      if(this.user!=user)this.setUser(user);    
      if(!this.getInfo(aData)){
        if(this.checkRetry())return true;
        else break;          
      }
      this.stage=this.reuseInfo?ST_DATA_RES:ST_DATA;  
      this.doNext(aData,aHttp);
      return true;
      /*if(this.user==user){
        if(!this.getInfo(aData)){
          if(checkRetry())return true;
          else break;          
        }
        this.stage=this.reuseInfo?ST_DATA_RES:ST_DATA;
        return this.process(aData,aHttp);
      }else{
        this.setUser(user);
        this.check();
        return true;
      }*/      
    case ST_DATA:
      this.getHtml(this.dataURL);
      return false;
    case ST_DATA_RES:
      //var n=parseInt(this.getCount(aData));
      //this.count=isNaN(n)?-1:n;
      this.count=-1;
      var data;
      if(aData!=null)data=this.getData(aData);
      if(this.count<0){
        if(this.checkRetry()){
          return true;
        }else{
          data=null;
          this.reset();
        }
      }else{
        if(this.dataURL2){
          this.stage=ST_DATA2;
          this.data=data;
          return this.process("");
        }else{
          this.retry=0;          
          this.stage=ST_DATA;
        }
      }
      this.setResult(data,aData==null);
      return true;
    case ST_DATA2:
      this.getHtml(this.dataURL2);
      return false;      
    case ST_DATA2_RES:
      var data=this.data;
      if(!this.getData2(aData,data)){
        if(this.checkRetry()){
          return true;
        }else{
          data=null;
        }
      }
      delete this.data;
      
      this.retry=0;
      this.stage=ST_DATA;      
      this.setResult(data,aData==null);
      return true;
    }
    this.onError(aData);
    return true;
  },
  onError : function(aData){
console.log(new Error("[onError] "+this.id+" "+this.user+" "+this.stage+" "+new Date().toISOString()));
    this.reset();
    this.setResult(null,aData==null);
  },

  getHtml:function(req) {
    this.xhr = getHtml(req,this.doNext.bind(this));
  },

  getViewURL : function(aFolder){
    return this.viewURL;
  },

  getCount : function(aData){
    return -1;
  },
  getData : function(aData){
    return {};
  },
  getUser : function(aData){
    return this.user;
  },
  getInfo : function(aData){
    return true;
  },  
  getData2 : function(aData,rs){
    return true;
  },  

  getForm:function(data,name,action){
    var url=null;
    if(name){
      var reg=new RegExp("<form([^>]+?id\\s*=\\s*[\"\']"+name+"[\"\'][\\S\\s]+?)<\/form>","i");
      var s=data.match(reg);
      if(!s)return "";
      data=s[1];
    }
    if(action){
      var fnd=data.match(/action\s*=\s*[\"\'](\S+?)[\"\']/);
      if(fnd)url=fnd[1];
    }
    var re=/<input[^>]+?name\s*=\s*[\"\'](\S+?)[\"\'][^>]+?value\s*=s*[\"\']([\s\S]*?)[\"\'][\s\S]*?>/ig;
    var o;
    var post="";
    while ((o = re.exec(data)) != null){
      if(o[0].match(/type\s*=\s*[\"\']?hidden[\"\']?/i)){
        if(post)post+="&";
        post+=o[1]+"="+encodeURIComponent(o[2]);
      }
    }
    if(action)return url?[url,post]:null;
    return post;
  },

  delay:function(sec){
    var self=this;
    window.setTimeout(function(){self.doNext("");},sec);
  },
  setResult:function(data,error){
    this.started=false;
    this.main.setResult(this,data,error);
  },
  setUser:function(user){
    this.main.setUser(this,user);
  },
  setOption:function(){
  },
  checkCookies:function(){
    var cks=this.config.cookies;
    this.cookieCount=cks.length;
    this.cookieFound=false;
    var self=this;
    for(var i=0;i<cks.length;i++){
      chrome.cookies.getAll({domain:cks[i].domain,name:cks[i].name,storeId:"0"},
        function(cookies){
          self.onCheckCookie(cookies);
        }
      );
    }
  },
  onCheckCookie:function(cookies){
    if(this.cookieCount<0)return;
    if(cookies&&cookies.length>0)this.cookieFound=true;
    --this.cookieCount;
    if(this.cookieCount==0){
      this.cookieCount=-1;
      this.stage=this.cookieFound?ST_INFO:ST_COOKIE_RES;
      this.doNext("");
    }
  }
}
Handler.prototype.baseProcess=Handler.prototype.process;

function getHtml(req,func){
  var aURL,aPostData,aHeaders,aMethod;
  if(req instanceof Array){
    aURL=req[0];
    aPostData=req[1];
    aHeaders=req[2];
    aMethod=req[3];
  }else aURL=req;

  var xhr = new XMLHttpRequest();
  if(func){
    xhr.func=func;
    xhr.onreadystatechange=function(){
      if(this.readyState==4){
        //this.status==0 when supended
        func(this.status==0?null:this.responseText,this);
      }
    };
  }
  var setContentType=false;
  if(aPostData||aPostData==""){
    xhr.open(aMethod?aMethod:"POST", aURL, true);
    setContentType=true;
  }else xhr.open(aMethod?aMethod:"GET", aURL, true);
  if(aHeaders){
    for(var t in aHeaders){
      if(t=="Content-Type")setContentType=false;
      xhr.setRequestHeader(t,aHeaders[t]);
    }
  }
  if(setContentType)xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  try{
    xhr.send(aPostData);
  }catch(e){
    if(func)func(null,xhr);
    dout(e);
  }
  return xhr;
}
