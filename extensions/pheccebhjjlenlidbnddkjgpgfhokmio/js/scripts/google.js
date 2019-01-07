"use strict";
/***********************************************************
Google
***********************************************************/
scripts["google"]={
  config:{
    cookies:[{domain:".google.com",name:"SID"}]
  },

  init:function(){
    this.initStage=ST_DATA;
    this.dataURL="https://mail.google.com/mail/u/0/";
  },

  getData:function(aData){
    var obj=[];
    var fnd=aData.match(/\["mla",([\S\s]+?\]\])\]/);
    if(fnd){
      this.count=0;
      obj=JSON.parse(fnd[1]);
    }
    return obj;
  }
}