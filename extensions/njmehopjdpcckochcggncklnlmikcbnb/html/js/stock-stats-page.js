$(document).ready(function(){"use strict";function e(){return 0==l&&(l=$("#sellers-table").DataTable({paging:!1,searching:!1,createdRow:function(e,t,a){$(e).addClass("seller-row "+t.key).data("seller",t.key).data("offer",t.offer)},columns:[{name:"Seller",data:"Seller",title:"Seller"},{name:"Stock",data:"Stock",title:"Stock",className:"stock",orderDataType:"dom-text-numeric"},{name:"Price",data:"Price",title:"Price"},{name:"Fulfillment",data:"Fulfillment",title:"Fulfillment"},{name:"Rating",data:"Rating",title:"Rating"}]})),l}function t(t,l){e(),t.forEach(function(t){var a=n.length;n.push(t);var l="seller-"+a;a++;var r=t.sellerName,s=t.totalPrice,o="Yes"==t.fufilmentByAmazon?"Amazon":"Seller",d=t.rating,c=t.recentRatingDetails,f=t.offering;if(!i.includes(f)){i.push(f);var u=t;u.key=l,u.Seller=r,u.Stock="",u.Price=s,u.Fulfillment=o,u.Rating="",u.Description=c,u.offer=f;e().row.add(u).draw(!1);$("tr."+l+" td").last().raty({score:d,readOnly:!0,hints:null}).append("<br/>").append(t.ratingText)}}),function(e){console.log("update stock"),$("#sellers-table-body .seller-row:not(.processed)").each(function(){var t=$(this).find(".stock");if(t.parents(".seller-row").addClass("processed"),!t.text().trim()){t.html('<i class="fa fa-spinner fa-spin fa-fw"></i>');var n={seller:$(this).data("seller"),offer:$(this).data("offer"),asin:a};$.ajax({url:e+"/extension/get-stock?seller="+$(this).data("seller"),type:"POST",data:n}).done(function(e){console.log("update liimit"),e.stock?("999"==e.stock&&(e.stock="1000+"),(t=$("."+e.seller+" .stock")).html(e.stock),e.hasLimit&&0==$("."+e.seller).find(".limited-box").length&&console.log("prepend limit"),t.prev().append('<br><span class="limited-box" style="background-color: #f6b301;font-size: 10px;font-weight: bold;">Seller has set max quantity</span>')):t.html("Data unavailable")}).fail(function(e){t.html("Data unavailable")})}})}(l)}$.fn.raty.defaults.path="images";var a=/#(\w+)/.exec(window.location.href)[1];!function(e){var t="https://www.amazon.com/dp/"+e;$.ajax({method:"GET",url:t,timeout:15e3,xhr:function(){var e=jQuery.ajaxSettings.xhr(),t=e.setRequestHeader;return e.setRequestHeader=function(e,a){"X-Requested-With"!=e&&"Referer"!=e&&t.call(this,e,a)},e}}).done(function(a){var n=$(a),l=(n.find("#productTitle").text()||self.data.find("#btAsinTitle").text()||self.data.find("#aiv-content-title").text()||self.data.find("#title_feature_div").text()||self.data.find("#ebooksProductTitle").text()||self.data.find(".AAG_ProductTitle a").attr("title")||"N/A").trim(),i=n.find("#landingImage, #imgBlkFront, #ebooksImgBlkFront").attr("data-a-dynamic-image");i?(i=JSON.parse(i),i=Object.keys(i)[0]?Object.keys(i)[0].trim():null):(i=n.find("#main-image").attr("src"))||(i=n.find("#js-masrw-main-image").attr("afr-data-src"));var r=n.find("#SalesRank").clone().find("ul,style,li").remove().end().text().match(/((\#)|(Nr.\s))?[0-9,.]+/i);if(r)r=r[0].replace(/(\#)|(Nr.)|(\,)|(\.)/gi,"");else{var s=null,o=0;n.find('th:contains("Best Sellers Rank")').next().find(':contains("#")').each(function(){var e=$(this).text().split(">").length;(0===o||e<o)&&(o=e,s=$(this))}),s&&(r=s.text().replace(/#([,\d]+)\sin\s[\s\S]*/,"$1").replace(/[^\d]/g,""))}$("#product-title").text(l).attr("href",t),$(".media-object").attr("src",i),$("#product-asin").text(e),$("#product-bsr").text(r),$("#product-preview").show()})}(a),chrome.runtime.sendMessage({type:"get-sellers",asin:a}),chrome.runtime.onMessage.addListener(function(e,n,l){if(e.type)switch(console.log("msg about seller"),console.log(e),e.type){case"sellers-found":e.asin==a&&t(e.data,e.backend)}}),$.fn.dataTable.ext.order["dom-text-numeric"]=function(e,t){return this.api().column(t,{order:"index"}).nodes().map(function(e,t){return 1*$(e).text()})};var n=[],l=!1,i=[]});