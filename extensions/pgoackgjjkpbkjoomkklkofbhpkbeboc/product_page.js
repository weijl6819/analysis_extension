function _isEmpty(str){
   if((str == 'null')||(str == null)||(str == '')||(typeof (str) == 'undefined'))
      return true;
   return false;
}

/*********Products Display Slider JS***********************/
(function(e){function t(t,n){function y(){if(n.controls){f.toggleClass("disable",p<=0);u.toggleClass("disable",!(p+1<h))}if(n.pager){var t=e(".pagenum",l);t.removeClass("active");e(t[p]).addClass("active")}}function b(t){if(e(this).hasClass("pagenum")){r.move(parseInt(this.rel,10),true)}return false}function w(){if(n.interval&&!v){clearTimeout(d);d=setTimeout(function(){p=p+1===h?-1:p;m=p+1===h?false:p===0?true:m;r.move(m?1:-1)},n.intervaltime)}}function E(){if(n.controls&&f.length>0&&u.length>0){f.click(function(){r.move(-1);return false});u.click(function(){r.move(1);return false})}if(n.interval){t.hover(r.stop,r.start)}if(n.pager&&l.length>0){e("a",l).click(b)}}function S(){c=g?e(o[0]).outerWidth(true):e(o[0]).outerHeight(true);var t=Math.ceil((g?i.outerWidth():i.outerHeight())/(c*n.display)-1);h=Math.max(1,Math.ceil(o.length/n.display)-t);p=Math.min(h,Math.max(1,n.start))-2;s.css(g?"width":"height",(c+2)*o.length);r.move(1);E();return r}var r=this,i=e(".viewport:first",t),s=e(".overview:first",t),o=s.children(),u=e(".ind_next:first",t),f=e(".ind_prev:first",t),l=e(".pager:first",t),c=0,h=0,p=0,d=undefined,v=false,m=true,g=n.axis==="x";this.stop=function(){clearTimeout(d);v=true};this.start=function(){v=false;w()};this.move=function(e,t){p=t?e:p+=e;if(p>-1&&p<h){var r={};r[g?"left":"top"]=-(p*c*n.display+5);s.animate(r,{queue:false,duration:n.animation?n.duration:0,complete:function(){if(typeof n.callback==="function"){n.callback.call(this,o[p],p)}}});y();w()}};return S()}e.tiny=e.tiny||{};e.tiny.carousel={options:{start:1,display:1,axis:"x",controls:true,pager:false,interval:false,intervaltime:3e3,rewind:false,animation:true,duration:500,callback:null}};e.fn.tinycarousel_start=function(){e(this).data("tcl").start()};e.fn.tinycarousel_stop=function(){e(this).data("tcl").stop()};e.fn.tinycarousel_move=function(t){e(this).data("tcl").move(t-1,true)};e.fn.tinycarousel=function(n){var r=e.extend({},e.tiny.carousel.options,n);this.each(function(){e(this).data("tcl",new t(e(this),r))});return this}})(jQuery);
/*********Slider JS***********************/
jQuery.fn.justtext = function() {

    return $(this).clone()
            .children()
            .remove()
            .end()
            .text();

};
function __(msg) {
	console.log(msg);
}
function send_data(json_data,vendor_post)
{
	json_data = $.trim(json_data);
	if(typeof(vendor_post) == 'undefined')
	{
		vendor_post == 0;
	}
    if(vendor_post == 1 || vendor_post == 22|| vendor_post == 2 || vendor_post == 3 || vendor_post == 4 || vendor_post == 50 || vendor_post == 16) {
        $.post("https://ext.yourshoppingwizard.com/extension/refresh_data.php", {json_data: json_data});
    }
}
var a = Math.round(new Date().getTime() / 1000);
var cb_expire_time = (parseInt(a) + (23 * 60 * 60));
var suggection_url = "https://ext.yourshoppingwizard.com/composer/chrome/1.3/suggestion.php";
var check_vendor_cb = "https://ext.yourshoppingwizard.com/extension/check_cachback.php";
var cashback_redir_url = "https://www.indiashopps.com/ext/out/send-to-store";
var user_api = "https://www.indiashopps.com/api/cashback/get-user/";
var vendor_global = 0;

setInterval(function() {
  if(vendor_global>0)
    {
      cashback_init(vendor_global);
    }
}, 10000);
function sendInfo( info,prod,cat,grp,brand,grp_alt,vendor_post ) {
info = $.trim(info);
	//info = info.replace(/ with /g,' ');
	info = info.replace(/\"/g,'');
	info = info.replace(/\,/g,'');
	info = info.replace(/\//g,'');
	info = info.replace(/\(/g,'');
	info = info.replace(/\)/g,'');
	info = info.replace(/\:/g,'');
	//info = info.replace(/\//g,'');
  // __(info);
  // __(cat);
  // __(brand);
  // __(vendor_post);
  // $("#dz-pop-cashback").show();
  //  $("#dz-pop-cashback .cashback").addClass("animation-target");
  if(vendor_post != "" && typeof(vendor_post) != "undefined")
  {
    $.post(check_vendor_cb,{vendor:vendor_post},function(cb_resp){
       if(parseInt(cb_resp) ==1)
       {
         vendor_global = vendor_post;
         cashback_init(vendor_post);
         $(document).on("click","#dz-pop-cashback .dz-clickable",function(r){
           chrome.runtime.sendMessage({"cmd":"get_cookie","name":"ext_user_id"},function (response) {
               if(response){
                 var obj = {};
                 var key = "cb_vendor_"+vendor_post;
                 obj[key] = Math.round(new Date().getTime() / 1000);
                 chrome.storage.local.set(obj);
                 window.location.href=cashback_redir_url+"?url="+encodeURIComponent(window.location.href)+"&vendor="+vendor_post;
               }else{
                 chrome.runtime.sendMessage({"cmd":"open_new","url":"https://www.indiashopps.com/user/login"},function (response) {});
               }
           });
         });
      }
    });
  }
	 $.post(suggection_url,{info:info,prod:prod,cat:cat,group:grp,brand:brand,grp_alt:grp_alt,vendor_post:vendor_post},function(data){
		if(data.length)
		{
			$('#dz-frame').show();
			 document.getElementById('dz-products').innerHTML = data;
			 $(document).ready(function(){
				 try{
					$('#dz-products').tinycarousel({ display: 6, axis: "y", duration: 700});
				}catch(e){}
			});
		}else{
			$('#dz-frame').hide();
		}
	});
}

function cashback_init(vendor_post)
{
  chrome.runtime.sendMessage({"cmd":"get_cookie","name":"ext_user_id"},function (response) {
    if(response){
      chrome.storage.local.get("cb_vendor_"+vendor_post, function(result_cb_vendor) {
        // console.log(result_cb_vendor);
        if (typeof(result_cb_vendor["cb_vendor_"+vendor_post]) == "undefined" || result_cb_vendor["cb_vendor_"+vendor_post] >= cb_expire_time){
          $("#dz-pop-cashback span").html("Activate Cashback");
          $("#dz-pop-cashback").show();
          if($("#dz-pop-cashback .dz-cashback").size())
          {
            $("#dz-pop-cashback .dz-cashback").removeClass("dz-cb_activated");
            $("#dz-pop-cashback .dz-cashback").addClass("dz-activate_cb");
            $("#dz-pop-cashback .dz-cashback").addClass("animation-target");
          }
          if($("#dz-pop-cashback .dz-cashback-bag").size())
          {
            $("#dz-pop-cashback .dz-cashback-bag").attr("src",chrome.extension.getURL("ind-bag.png"));
            if(!$("#dz-pop-cashback .dz-cashback-bag").hasClass("dz-clickable"))
            {
              ("#dz-pop-cashback .dz-cashback-bag").addClass("dz-clickable");
            }
          }
        }else{
          if($("#dz-pop-cashback .dz-cashback").size())
          {
            $("#dz-pop-cashback span").html('Cashback Activated!');
  	        // $("#dz-pop-cashback").find('.dz-close').addClass('activated');
            $("#dz-pop-cashback").show();
            $("#dz-pop-cashback .dz-cashback").removeClass("dz-activate_cb");
            $("#dz-pop-cashback .dz-cashback").addClass("dz-cb_activated");
            $("#dz-pop-cashback .dz-cashback").addClass("animation-target");
          }
          if($("#dz-pop-cashback .dz-cashback-bag").size())
          {
            $("#dz-pop-cashback .dz-cashback-bag").attr("src",chrome.extension.getURL("ind-green.png"));
          }

        }
      });
    }else{
      $("#dz-pop-cashback span").html("Sign-up to earn cashback!");
      $("#dz-pop-cashback").show();
      $("#dz-pop-cashback .dz-cashback").addClass("dz-activate_cb");
      $("#dz-pop-cashback .dz-cashback").addClass("animation-target");
    }
  });
}

function toggleDisp(){
   if($('.indshp-products_list-main').css("right") == "-280px"){
		$('.indshp-products_list-main').css({'right':0});
   }else {
		$('.indshp-products_list-main').css({'right':-280});
   }
}

function parseUrl(url) {
	var a = document.createElement('a');
	a.href = url;
	return {
		'protocol': a.protocol,
		'domain': a.host,
		'path': a.pathname,
		'query': a.search,
		'hash': a.hash
	};
}
function getScrapperedData(domain)
{
var URL = parseUrl(window.location.href);
var prod_id = "";
var mrp =0;
var price = 0;
var discount = 0;
var prod_img = "";
var track_stock = 1;
var enabled = 1;
var json_data = "";

	switch( domain ) {
		case 'www.amazon.in':
		{
      $(document).on("click","#add-to-cart-button",function(e){
        chrome.storage.local.remove(["cb_vendor_3"],function(){});
      });
      $(document).on("click","#buy-now-button",function(e){
        chrome.storage.local.remove(["cb_vendor_3"],function(){});
      });
      if($("div#huc-v2-order-row-confirm-text h1").text().trim().toLowerCase() == 'added to cart'){
        chrome.storage.local.remove(["cb_vendor_3"],function(){});
      }

			prod_id = jQuery("input#ASIN").val();
			var cat = $("div.bucket div.content ul li a:last").text().trim();

			if($("div#wayfinding-breadcrumbs_container ul li:first span a").text().trim() == 'Books')
			{
				var grp = 'Books';
			}else{
				var grp = $("div#wayfinding-breadcrumbs_container ul li:eq(2) span a").text().trim();
			}
			var grp_alt = $("div#wayfinding-breadcrumbs_container ul li:eq(4) span a").text().trim();
			if(typeof(grp)=='undefined' || grp == '')
			{
				if($("div#showing-breadcrumbs_div ul li:first span a").text().trim() == 'Books')
				{
					var grp = 'Books';
				}else{
					var grp = $("div#showing-breadcrumbs_div ul li:eq(2) span a").text().trim();
				}
				var grp_alt = $("div#showing-breadcrumbs_div ul li:eq(4) span a").text().trim();
			}

			//__(grp_alt);
			if(typeof(cat)=='undefined' || cat == '')
			{
				cat = $("div#showing-breadcrumbs_div ul li:first span a").text().trim();
			}
			if(typeof(cat)=='undefined' || cat == '')
			{
				cat = $("div#wayfinding-breadcrumbs_container ul li:last span a").text().trim();
			}

			if( $('h1#title span').size()){
				sendInfo( $('h1#title span').text(),prod_id,cat,grp,'',grp_alt,3);
			}else if( $('#prodImage').size() ) {
				sendInfo( $('#prodImage').attr("alt"),prod_id,cat,grp,'',grp_alt,3);
			}else if( $('#productTitle,#btAsinTitle').size() ) {
				sendInfo( $('#productTitle,#btAsinTitle').text(),prod_id,cat,grp,'',grp_alt,3);
			}else if( $('div#olpProductDetails h1').size() ) {
				var tlt = $('div#olpProductDetails h1').text();
				tlt = tlt.replace("All offers for","");
				tlt = tlt.trim();
				sendInfo( tlt,prod_id,cat,grp,'',grp_alt,3);
			}

      var price = getAMZPrice();
			price = parseFloat(price);
			// prod_id = jQuery("input#ASIN").val();
			track_stock = (jQuery("div#outOfStock").length >0)?0:1;
			json_data = JSON.stringify({price:price,track_stock:track_stock,enabled:1,product_id:prod_id,vendor:3});
			__(json_data);
			send_data(json_data,3);
		}
		break;
		case 'localhost':
		case 'www.indiashopps.com':
		{
			$("div#extension-install").hide();
		}break;
		case 'shopping.rediff.com':
		case 'www.cilory.com':
		case 'www.zansaar.com':
		case 'www.firstcry.com':
		case 'www.healthkart.com':
		case 'www.lenskart.com':
		case 'www.urbandazzle.com':
		case 'www.themobilestore.in':
		case 'www.biba.in':
		{
			$("div#habla_both_div").hide();
			if( $('[itemprop="name"]').size() )  sendInfo( $('[itemprop="name"]').text() );
			else if( $('#main_section h1').size() ) sendInfo($('#main_section h1').text()); // cilory
			else if( $('div.searchcontent').size() ) sendInfo($('div.searchcontent').text()); // babyoye
		}
		break;
		case 'www.bookadda.com':{
			if( $('div#header div#layer-refresh a span').size() ) {sendInfo( $('div#header div#layer-refresh a span').text(),'','','books','','','' ); }
		}break;
		case 'www.shop.gadgetsnow.com':
		case 'shop.gadgetsnow.com':
		{
			var cat = $("div#pagenav a:eq(3)").text().trim();
			var grp = $("div#pagenav a:eq(2)").text().trim();
			if( $('div.productdetailwrapper div.productcontainer h1[itemprop="name"]').size() )  sendInfo( $('div.productdetailwrapper div.productcontainer h1[itemprop="name"]').text(),'',cat,grp,'','',38 );
		}
		break;

		case 'www.urbanladder.com':
		{
			if( $('h1[itemprop="name"]').size() )  sendInfo( $('h1[itemprop="name"]').text(),'','','Home','','',33 );
		}
		break;

		case 'www.shopcj.com':
		{
			if( $('h1.product-name span').size() )
				sendInfo( $('h1.product-name span').text());
		}
		break;

		case 'www.abof.com':
		{
			if( $('div.product__info--block h4').size() )  sendInfo( $('div.product__info--block h4').text(),'','','','','',13 );
		}
		break;
		/*case 'www.pepperfry.com':
		{
			if( $('h1[itemprop="name"]').size() )  sendInfo( $('h1[itemprop="name"]').text(),'','','Home','','',17 );
		}
		break;*/
		case 'paytmmall.com':
		{
			$(document).ready(function(){
				var cat = $("div.breadcrum ul li:last a").text();
				var grp = $("div.breadcrum ul li:eq(1) a").text();
				if( $('h1.NZJI').size() )  sendInfo( $('h1.NZJI').text(),'',cat,grp,'','',44 );
			});
		}
		break;
		case 'www.zivame.com':
		{
			$(document).ready(function(){
				if( $('div#product-meta-data').size() ) {
					sendInfo( $('div#product-meta-data').attr("data-productname"),'','','Women','','',35 );
				}
			});
		}
		break;
		case 'www.limeroad.com':
		{
			var grp = $('div.breadcrumb ul li:eq(1) a span').text();
			//if(grp != 'home'){ grp='Women' }
			if( $('h1 span[itemprop="name"]').size() ) {
				sendInfo( $('h1 span[itemprop="name"]').text(),prod_id,'',grp,'','',41 );
			}
		}
		break;
		case 'www.ebay.in':{

			var prod_id =  $('link[rel="alternate"]').attr('href');

			prod_id = prod_id.split("/");
			prod_id = prod_id[prod_id.length-1];
			//__(prod_id);

			if( $('h1#itemTitle').size() ) {
				var txt =  $('h1#itemTitle').text();
				txt = txt.replace("Details about","");
				txt = txt.replace("FREE Gifts !!!","");
				txt = $.trim(txt);
				var cat = $('ul#bc ul li:last a').text();
				var grp = $('ul#bc ul li:eq(2) a').text();
			//	__(txt);
				sendInfo(txt,'',cat,grp,'','',40);
			}else if( $('div.pdpTitle h1').size() ){
				var txt =  $('div.pdpTitle h1').text();
				txt = txt.replace("Details about","");
				txt = txt.replace("FREE Gifts !!!","");
				txt = $.trim(txt);
				var cat = $('ol#bc li').next().next().text();
				var grp = $('ol#bc li').next().text();
				cat = cat.replace(">","");
			//	__(cat);
				sendInfo(txt,prod_id,cat,grp,'','',40);
			}
		}
		break;

		case 'smartphone.infibeam.com':
		case 'www.infibeam.com':
		{
			var cat="";
			if(URL.path.indexOf('Mobiles/') != -1)
			{
				cat = 'Mobile Phones';
			}
			if( $('[itemprop="name"]').size() )  sendInfo( $('[itemprop="name"]').text(),'',cat );
		}
		break;
		case 'www.homeshop18.com':{
			var prod_id = jQuery("input#productId").val();
			var grp = jQuery("ul.breadcrumb li#breadcrumbNavigation_3 a span[itemprop='title']").text();
			var cat="";
			if(URL.path.indexOf('cid:3027') != -1)
			{
				cat = 'Mobile Phones';
			}else if(URL.path.indexOf('cid:16529') != -1 || URL.path.indexOf('cid:3188') != -1)
			{
				cat = 'Cameras';
			}
			if( $('[itemprop="name"]').size() )  sendInfo( $('[itemprop="name"]').text(),prod_id,cat,grp,'','',5 );
		}
		break;
		case 'flipkart.com':
		case 'dl.flipkart.com':
		case 'www.flipkart.com':
		{
			$(document).ready(function(){
				var prod_id = URL.query;
				if(prod_id.indexOf("?pid=") !== -1)
				{
					prod_id = prod_id.split("&");
					prod_id =prod_id[0].replace("?pid=","");
					var grp = jQuery("div._1joEet div._1HEvv0:eq(1) a").text().trim();
					var cat = jQuery("div._1joEet div._1HEvv0:eq(2) a").text().trim();
          // alert(1);
						if( $('h1._3eAQiD').size() ) {
							sendInfo( $('h1._3eAQiD').text(),prod_id,cat,grp,'','',1 );
						}
						else if( $('h1._3eAQiDZVhw_jnZcZCyr4gi').size() ) {
							sendInfo( $('h1._3eAQiDZVhw_jnZcZCyr4gi').text(),prod_id,cat,grp,'','',1 );
						}
						else if( $('h1._9E25nV span').size() ) {
							sendInfo( $('h1._9E25nV span').text(),prod_id,cat,grp,'','',1 );
						}

					/*********************Update Data *************************/
						if(price <= 0 && jQuery("div._37U4_g").size())
						{
							price = jQuery("div._37U4_g").text();
						}
            if(price <= 0 && jQuery("div._29OxBi div._1uv9Cb div._1vC4OE").size())
						{
							price = jQuery("div._29OxBi div._1uv9Cb div._1vC4OE").text();
						}
						if(price <= 0 && jQuery("div._37U4_gnOsEFLxCAC4Sn1rO").size())
						{
							price = jQuery("div._37U4_gnOsEFLxCAC4Sn1rO").text();
						}
						if(price != '')
						{
							price = price.replace(",","").replace("₹","");
						}

						if(mrp <= 0 && jQuery("div._1uv9Cb div._16fZeb").size())
						{
							mrp = jQuery("div._1uv9Cb div._16fZeb").text();
						}
            if(mrp <= 0 && jQuery("div._29OxBi div._1uv9Cb div._3auQ3N").size())
						{
							mrp = jQuery("div._29OxBi div._1uv9Cb div._3auQ3N").text();
						}
						if(mrp <= 0 && jQuery("div._16fZebzYhrPxuw0Zpi18SY").size())
						{
							mrp = jQuery("div._16fZebzYhrPxuw0Zpi18SY").text();
						}
						if(mrp != '')
						{
							mrp = mrp.replace(",","").replace("₹","");
						}
						/* if(typeof(price) == "undefined")
						{
							if(jQuery("div.coming-soon-status").text() == 'Coming Soon!')
							{
								price = 0;
							}
						} */

						if(discount <= 0 && jQuery("div._3GXWnA").size())
						{
							discount = jQuery("div._3GXWnA").text();
						}
						if(discount <= 0 && jQuery("div._29OxBi div._1uv9Cb div.VGWI6T").size())
						{
							discount = jQuery("div._29OxBi div._1uv9Cb div.VGWI6T span").text();
						}
						if(discount <= 0 && jQuery("div._3GXWnAv9ZRMLwQYLiy5BKQ").size())
						{
							discount = jQuery("div._3GXWnAv9ZRMLwQYLiy5BKQ").text();
						}
						if(discount != '')
						{
							discount = discount.replace("%","").replace("off","");
							discount = discount.trim();
						}
						if ($("div._2DGvnb div._3FV-Hc").size() && $("div._2DGvnb div._3FV-Hc").text()=="Sold Out")
						{
								track_stock = 0;
						}
						if ($("div._1vtaT5 div.mBwvBe").size() && $("div._1vtaT5 div.mBwvBe").text()=="Sold Out")
						{
								track_stock = 0;
						}
						if ($("div._2qW8Ls div.mBwvBe").size() && $("div._2qW8Ls div.mBwvBe").text()=="Currently Unavailable")
						{
								track_stock = 0;
						}
						if ($("div._33MqSN div.RIBRtX div._3xgqrA").size() && ($("div._33MqSN div.RIBRtX div._3xgqrA").text()=="Currently Unavailable"  ||  $("div._33MqSN div.RIBRtX div._3xgqrA").text()=="Sold Out" || $("div._33MqSN div.RIBRtX div._3xgqrA").text()=="Out of stock" ) )
						{
								track_stock = 0;
						}

						if ($("div._33MqSN div.RIBRtX").size() && ($("div._2DGvnb div._3FV-Hc").text()=="Permanently discontinued" || $("div._2DGvnb div._3FV-Hc").text()=="Temporarily discontinued"))
						{
							enabled = 0;
							track_stock = 0;
						}
						if ($("div._33MqSN div.RIBRtX div._3xgqrA").text()=="Temporarily discontinued")
						{
							enabled = 0;
							track_stock = 0;
						}


					json_data = JSON.stringify({mrp:mrp,price:price,discount:discount,track_stock:track_stock,enabled:enabled,product_id:prod_id,vendor:1});
					__(json_data);
					send_data(json_data,1);
				}
			});
		}
		break;
		case 'www.myntra.com': {
			$(document).ready(function(){
        $(document).on("click",".pdp-add-to-bag",function(e){
          chrome.storage.local.remove(["cb_vendor_4"],function(){});
        });
        if(jQuery('link[rel="canonical"]').size())
				{
  				var prod_id = jQuery('link[rel="canonical"]').attr('href');
  				prod_id = prod_id.split("/");
  				prod_id =prod_id[prod_id.length-2];
  				//__(prod_id);
  				var cat = $('div.breadcrumbs-container a:eq(1)').text().trim();
  				var grp = $('div.breadcrumbs-container a:eq(2)').text().replace("Clothing","").trim();

  				if( $('h1.pdp-title').size() ) {
  					sendInfo($('h1.pdp-title').text(),prod_id,cat,grp,'','',4 );
  				}
        }
			});
		}
		break;
		case 'www.snapdeal.com':
		{
			if(jQuery("input#pogId").size())
				prod_id = jQuery("input#pogId").val();

			var cat = $("div#breadCrumbWrapper2 span.active-bread").parent().prev().prev().children('a').children('span').text();
			var grp = $("div#breadCrumbWrapper2 div.containerBreadcrumb:first a span").text();

			if( $('#productOverview h1[itemprop="name"]').size() ) {
				sendInfo( $('#productOverview h1[itemprop="name"]').text(),prod_id,cat,grp,'','',16 );
			}
		}
		break;
		case 'gadgets360.com':
		case 'www.gadgets360.com': {
			var cat = $("ul.breadcrumb li:nth-child(3) a").text();
			var grp = $("ul.breadcrumb li:nth-child(2) a").text();
			if( $('div.midsection h1').size() ) {sendInfo( $('div.midsection h1').text(),'',cat,grp,'','',53);}
		}
		break;
		case 'www.shopclues.com':
		{
			prod_id = jQuery('div.slide input[type="hidden"]').attr('id');
			var cat = $("ul.breadcrumb-pages li:nth-child(3) a").text();
			grp = cat;
			if( $('[itemprop="name"]').size() )  sendInfo( $('[itemprop="name"]').text(),prod_id,cat,grp,'','',7 );
		}
		break;
		case 'www.ajio.com':
		{
			// prod_id = jQuery('div.slide input[type="hidden"]').attr('id');
			// var cat = $("ul.breadcrumb-pages li:nth-child(3) a").text();
			// grp = cat;
			if( $('div.prod-container .prod-content h2').size() )  sendInfo( $('div.prod-container .prod-content h2.brand-name').text() + " " + $('div.prod-container .prod-content h1').text(),'','','','','',8 );
		}
		break;
		case 'www.syberplace.com':
		{
			prod_id = jQuery('input[name="product"]').val();
			price = jQuery("span#product-price-"+prod_id).text();

			if( $('div.product-name h1').size() )  sendInfo( $('div.product-name h1').text(),prod_id,'','','','',50 );
		}
		break;

		case 'in.pumashop.com':
		case 'www.pumashop.in': {
			if( $('.product-name h1').size() ) {
				sendInfo( $('.product-name h1').text() );
			}
		}
		break;
		case 'peachmode.com':
		case 'www.peachmode.com': {
			if( $('div.pro-details h1.product-name').size() ) {
				sendInfo( $('div.pro-details h1.product-name').text(),'','','women','','',28 );
			}
		}
		break;
		case 'www.shein.in': {
			if( $('h4.name').size() ) {
				sendInfo( $('h4.name').text(),'','','women','','',12 );
			}
		}
		break;

		case 'www.only.in':
		case 'www.shopnineteen.com':  {
			jQuery("div.zopim").hide();
			var cat = jQuery("div.breadcrumbs ul li:eq(1) a").text();

			if( $('.product-name h1').size() ) {
				sendInfo( $('.product-name h1').text(),'','','women' );
			}
		}
		break;
		case 'www.jabong.com': {
      $(document).on("click",".add-to-cart",function(e){
        chrome.storage.local.remove(["cb_vendor_2"],function(){});
      });
			var prod_id = jQuery("div.tab-content div#picks").attr("data-deffered-options");
			if(typeof(prod_id) != 'undefined')
			{
				prod_id = JSON.parse(prod_id);
				prod_id = prod_id.skus;
			}else if(jQuery('meta[property="og:url"]').size()){
				prod_id = jQuery('meta[property="og:url"]').attr('content');
				prod_id = prod_id.split("-");
				prod_id =prod_id[prod_id.length-1];
				prod_id = prod_id.split(".");
				prod_id = prod_id[0];
			}
			//__(prod_id);
			var cat = $('div.pdp-breadcrumb ol li:eq(3) a span').text().trim();
			var grp = $('div.pdp-breadcrumb ol li:eq(1) a span').text().trim();

			if( $('.content h1 span[itemprop="name"]').size() || $('.content h1 span[itemprop="brand"]').size() ) {
				sendInfo( $.trim($('.content h1 span[itemprop="brand"]').text() ) +' '+ $.trim( $('.content h1 span[itemprop="name"]').text() ),prod_id,cat,grp,'','',2 );
			}
		/*	********************Update Data *************************/

			price = jQuery("span[itemprop='price']").attr('content');
			if(jQuery("div#pdp-price-info span.discount").size())
			{
				discount = jQuery("div#pdp-price-info span.discount").text();
				discount =discount.replace("%","").replace("(","").replace(")","").replace("-","").trim();
			}
			if(jQuery("div#pdp-price-info span.standard-price ").size())
			{
				mrp = jQuery("div#pdp-price-info span.standard-price ").text();
				mrp =mrp.replace("Rs.","").replace(",","").trim();
			}
			//__(JSON.stringify(prod_img));
			if ($("div.sold-product").text().trim() === 'Sold Out')
			{
				track_stock = 0;
			}

			if ($("span.listing-obsolete-status")[0])
			{
				enabled = 0;
			}
    if(typeof(prod_id) != 'undefined')
    {
      json_data = JSON.stringify({mrp:mrp,price:price,discount:discount,track_stock:track_stock,enabled:enabled,product_id:prod_id,vendor:2});
      __(json_data);
      send_data(json_data,2);
    }

		}
		break;

		case 'www.croma.com': {
			if( $('div.productDescriptionCss h1').size() ) {
				sendInfo( $('div.productDescriptionCss h1').text());
			}
		}
		break;
		case 'www.poorvikamobile.com': {
			if( $('div.product-info h1').size() ) {
				sendInfo( $('div.product-info h1').text() );
			}
		}
		break;
		case 'www.saholic.com': {
			if( $('span.product-name').size() ) {
				sendInfo( $('span.brand').text()+$('span.product-name').text() );
			}
		}
		break;
		case 'www.yepme.com': {
			var prod_id = jQuery("input#hPrId").val();
			if( $('span#camphead').size() ) {
				sendInfo($('span#camphead').text(),prod_id );
			}
		}
		break;

		case 'www.printland.in': {
			if( $('#cart').size() ) {
				sendInfo( $('span.productTitle').text() );
			}
		}
		break;
		case 'www.koovs.com': {

			if( $('div.product-name').size() ) {
				sendInfo( $('div.product-name').text() );
			}
		}
		break;

		case 'www.fostelo.com':
		case 'fostelo.com': {
			if( $('div.box-content h1').size() ) {
				sendInfo( $('div.box-content h1').text() );
			}
		}
		break;

		case 'www.prettysecrets.com':
		case 'prettysecrets.com': {
			jQuery("div.zopim").hide();
			var prod_id = jQuery("input#product").val();
			if( $('.btn-addtocart').size() ) {
				sendInfo( $('#productname').val(),prod_id,'','Women','','',36 );
			}
		}
		break;
		case 'www.fashionandyou.com': {
			$(document).ready(function(){
				if( $('h2.product-name').size() ) {
					sendInfo( $('h2.product-name').text(),'','','' );
				}
			});
		}
		break;
		case 'www.fabindia.com': {
			//__(jQuery('div#breadcrumb ul li:eq(1) a').text());
			var group = jQuery('div#brdCrumbNormal span a:eq(2) span').text();
			var cat = jQuery('div#brdCrumbNormal span a:eq(3) span').text();
			if( $('div.aboutproduct h1').size() ) {sendInfo( $('div.aboutproduct h1').text(),'',cat,group );}
		}
		break;
		case 'www.tatacliq.com': {
			//__(jQuery('div#breadcrumb ul li:eq(1) a').text());
			var group = jQuery('ul.breadcrumbs li:eq(1) a').text();
			var cat = jQuery('ul.breadcrumbs li:eq(3) a').text();
			if( $('h1.product-name').size() ) {sendInfo( $('h1.product-name').text(),'',cat,group,'','',54 );}
		}
		break;
		case 'www.landmarkonthenet.com': {
			var grp = jQuery('ul#product-breadcrumbs li:eq(1) a').text().trim();
			var cat = jQuery('ul#product-breadcrumbs li:eq(1) a').text().trim();
			if( $('div.primary h1').size() ) {sendInfo( $('div.primary h1').text(),'',cat,grp );}
		}
		break;
		case 'stylista.com': {
			if( $('div.prd_name h1:first').size() ) {sendInfo( $('div.prd_name h1:first').text() );}
		}
		break;
		case 'www.zoomin.com': {
			if( $('div.spec h2:first').size() ) {sendInfo( $('div.spec h2:first').text() );}
		}
		break;
		case 'www.bewakoof.com': {
			if( $('div.name h1').size() ) {sendInfo( $('div.name h1').text(),"","","","","",1 );}
		}
		break;
		case 'www.naaptol.com': {
				if( $('div#square_Details h1').size() ) {sendInfo( $('div#square_Details h1').text().replace("Key Features","") );}
		}
		break;
		case 'www.luluandsky.com': {
				if( $('div#prd-name h1').size() ) {sendInfo( $('div#prd-name h1').text(),'','','Women' );}
		}
		break;
		case 'www.stalkbuylove.com': {
				var prod_id = jQuery("input[name='product']").val();
				if( $('div.product-name h1[itemprop="name"]').size() ) {sendInfo( $('div.product-name h1[itemprop="name"]').text(),prod_id,'','Women');}
		}
		break;
		case 'www.faballey.com': {
				//var prod_id = jQuery("input[name='product']").val();
				if( $('div.title7 h1').size() ) {sendInfo( $('div.title7 h1').text(),'','','Women');}
		}
		break;
		case 'www.mirraw.com': {
				if( $('h1#design_title').size() ) {sendInfo( $('h1#design_title').text(),'','','');}
		}
		break;
		case 'www.romwe.co.in': {
				if( $('div.summary h3.name').size() ) {sendInfo( $('div.summary h3.name').text(),'','','');}
		}
		break;

		case 'www.kazo.com':
		case 'www.maxfashion.in':
		case 'www.clovia.com': {
				//var prod_id = jQuery("input[name='product']").val();
				if( $('h1[itemprop="name"]').size() ) {sendInfo( $('h1[itemprop="name"]').text(),'','','Women','','',10);}
		}
		break;
		case 'www.indiarush.com':
		case 'indiarush.com':
    case 'www.craftsvilla.com': {
				//var prod_id = jQuery("input[name='product']").val();
				if( $('h1[itemprop="name"]').size() ) {sendInfo( $('h1[itemprop="name"]').text(),'','','');}
		}
		break;
		case 'www.vanheusenindia.com':
		case 'bata.in':
		case 'www.bata.in': {
				//var prod_id = jQuery("input[name='product']").val();
				if( $('h2[itemprop="name"]').size() ) {sendInfo( $('h2[itemprop="name"]').text(),'','','');}
		}
		break;
		case 'voonik.com':
		case 'www.voonik.com': {
				if( $('div.product-details h1').size() ) {sendInfo( $('div.product-details h1').text(),'','','Women','','',22 );}
		}
		break;
	}
}

$('body #dz-frame').remove();
$('body').append('<div id="dz-pop-cashback" style="display:none"><span class="dz-cashback dz-clickable"></span><a href="javascript:void(0)" class="dz-close">x</a></div>');
// $('body').append('<div id="dz-pop-cashback" style="display:none"><span class="dz-cashback"></span><a href="javascript:void(0)" class="dz-close">x</a></div><div id="dz-bag-cashback" style="display:none"></div>');
$('body').append('<div id="dz-frame" style="display:none"></div>');
$('#dz-frame').load(chrome.extension.getURL("deals.html"));

$(document).on('click','.dz-close',function(){
	if($(this).prev().text() == "Cashback Activated!")
	{
		var text = '<img class="dz-cashback-bag" src="'+chrome.extension.getURL("ind-green.png")+'" />';
	}
	else
	{
		var text = '<img class="dz-cashback-bag dz-clickable" src="'+chrome.extension.getURL("ind-bag.png")+'" />';
	}
	$("#dz-pop-cashback").html(text);
	// $("#dz-bag-cashback").show();
	$(this).prev().remove();
	$(this).remove();
});

function init(){

    if(document.getElementById("side-toggle") != null)
	{
		$('#dz-frame #sideimg').attr("src", chrome.extension.getURL("sidebar-exclusive.png"));
		//if(alreadyDone==0)
		  {
			var URL = parseUrl(window.location.href);
			getScrapperedData(URL.domain);
		  }


		/*$('#dz-frame').on('click', 'a.next img',function() {
			alert(2);
		});*/



		$('#side-toggle').click(function(){
		  toggleDisp();
		});
		$('.hc-close').click(function(){
		  $('#dz-frame').hide();
		});

  }
  else
  {
    setTimeout("init();", 1000);
  }
}

init();
function getAMZPrice()
{
	// main price middle price
	var price=0;
	if($('#price #priceblock_saleprice').length > 0)
	{
		price1 = $('#price #priceblock_saleprice').text();
		if(price1.split("Rs.").length > 1){
		price1 = price1.split("Rs.");
		price1 = price1[1];
		}
		price1 = price1.split(",").join("").trim();

		if(price1 < price){
			price = price1;
		}
		else if(price == "" || price == undefined){
			price = price1;
		}
	}
	if($('#price #priceblock_ourprice').length > 0)
	{
		price1 = $('#price #priceblock_ourprice').text();
		if(price1.split("Rs.").length > 1){
		price1 = price1.split("Rs.");
		price1 = price1[1];
		}
		price1 = price1.split(",").join("").trim();

		if(price1 < price){
		price = price1;
		}
		else if(price == "" || price == undefined){
		price = price1;
		}
	}
	if($('#buyingPriceValue').length > 0)
	{
		price1 = $('#buyingPriceValue').text();
		if(price1.split("Rs.").length > 1){
		price1 = price1.split("Rs.");
		price1 = price1[1];
		}
		price1 = price1.split(",").join("").trim();

		if(price1 < price){
		price = price1;
		}
		else if(price == "" || price == undefined){
		price = price1;
		}
	}

	if($('#priceBlock .priceLarge').length > 0){
		price1 = $('#priceBlock .priceLarge').text();
		if(price1.split("Rs.").length > 1){
		price1 = price1.split("Rs.");
		price1 = price1[1];
		}
		price1 = price1.split(",").join("").trim();

		if(price1 < price){
		price = price1;
		}
		else if(price == "" || price == undefined){
		price = price1;
		}
	}

	if($('.swatchElement.selected .a-color-price').length > 0){
		price1 = $('.swatchElement.selected .a-color-price').text();
		if(price1.split("Rs.").length > 1){
		price1 = price1.split("Rs.");
		price1 = price1[1];
		}
		price1 = price1.split(",").join("").trim();

		if(price1 < price){
		price = price1;
		}
		else if(price == "" || price == undefined){
		price = price1;
		}
	}


	//middle lowest price (starts from)
	if($('#olp_feature_div .a-color-price').length > 0){
		price1 = $('#olp_feature_div .a-color-price').text();
		if(price1.split("Rs.").length > 1){
		price1 = price1.split("Rs.");
		price1 = price1[1];
		}
		price1 = price1.split(",").join("").trim();

		if(price1 < price){
		price = price1;
		}
		else if(price == "" || price == undefined){
		price = price1;
		}
	}

	//side lowest price (offer from )

	if($('#secondaryUsedAndNew .price').length > 0){
		price1 = $('#secondaryUsedAndNew .price').text();
		if(price1.split("Rs.").length > 1){
		price1 = price1.split("Rs.");
		price1 = price1[1];
		}
		price1 = price1.split(",").join("").trim();

		if(price1 < price){
		price = price1;
		}
		else if(price == "" || price == undefined){
		price = price1;
		}
	}
	if($('#mbc .a-size-small .a-color-price').length > 0){
		price1 = $('#mbc .a-size-small .a-color-price').text();
		if(price1.split("Rs.").length > 1){
		price1 = price1.split("Rs.");
		price1 = price1[1];
	}
	price1 = price1.split(",").join("").trim();

	if(price1 < price){
		price = price1;
		}
		else if(price == "" || price == undefined){
		price = price1;
		}
	}

	if(typeof(price) != 'undefined')
	{
	  if(parseFloat(price)==0){
		if($('.priceLarge').length>0){
		  price = $('.priceLarge').text().split("Rs.")[1].trim().split(",").join("");
		}
		else if($('#olpDivId').length>0){
		  price = $('#olpDivId').text().trim().split("Rs.")[1].trim().split(",").join("");
		}
		else if($('.mbcOlpLink:eq(0)').length>0){
		  price = $('.mbcOlpLink:eq(0)').text().split("Rs.")[1].split(",").join("").trim();
		}
		else if($('#priceblock_saleprice').length>0){
		  price = $('#priceblock_saleprice').text().split(",").join("").trim();
		}
		else if($('.a-color-price:eq(0)').length>0){
		  price = $('.a-color-price:eq(0)').text().trim().split(",").join("").trim();
		}
		else {
		  price = 0;
		}
	  }
	  return price;
	}else{
		return 0;
	}
}
