function sendCallback(){$(".fixedCover").show()}var i=Math.floor(10*Math.random())+1,infinity={};infinity.i18n=function(o){try{return chrome.i18n.getMessage(o)||o}catch(i){return o}};var addTitle=$("#addTitle"),icobgColorArray=$(".icobgColor"),ico="",color=icobgColorArray.eq(i-1).css("background-color");icobgColorArray.eq(i-1).css("border-color",color);var addPre=infinity.i18n("add"),addHaved=infinity.i18n("added"),addBtn=$("#addBu");addBtn.val(addPre),$("#icon").css({"background-color":color}),$("#top").text(addPre),$("#haveedAdd").text(infinity.i18n("added")),$("#finishBtn").attr("data-text",infinity.i18n("done")),chrome.tabs.getSelected(null,function(o){tabUrl=o.url,tabTitle=o.title,addTitle.val(tabTitle),(ico=$("#icon")).text(tabTitle.substr(0,2)),addTitle.data("url",tabUrl)}),icobgColorArray.on("click",function(){var o=$(this).css("background-color");$(".icobgColor").css("border-color","transparent"),$(this).css("border-color",o),$("#icon").css({"background-color":o})}),addTitle.on("input",function(){var o=addTitle.val();o.length>2&&(o=o.substring(0,2)),ico.text(o)}),$("#addBu").on("click",function(o){var i=addTitle.val(),n="",t={icon:{name:i,url:addTitle.data("url"),src:void 0,imageType:"color",uid:"",showText:n=i.length>2?i.substring(0,2):i,bgColor:$("#icon").css("background-color"),fontSize:34},tabId:void 0};infinity.sendMessage("addIcon",t,sendCallback)}),$("#finishBtn").on("click",function(o){window.close()}),infinity.sendMessage=function(o,i,n){chrome.runtime.sendMessage({name:o,message:i},function(o){n&&n(o)})};