var prod_id = jQuery("input#ASIN").val();		
	
function removeAlert(email,pid)
{     
	if(email != '' && pid != '')
		chrome.runtime.sendMessage({rm_email: email,pid:pid,vendor:3}, function(response){});    
}


flagToDisp = 0; strToDisp = "";diff = 0;var emailtosend = "";
chrome.runtime.sendMessage({get_products: "defined",get_product_id:prod_id,vendor:3}, function(response) { 
  
//alert(response.out);
var imgURL2 = chrome.extension.getURL("watch-price2.png");
	if(response.out == 1)
	{
		 strToDisp = '<div class="pricealert_hatke"><div class="price_hatke-wraps"><img src="'+imgURL2+'"></div><a href="javascript:void();" id="removeMe2">Remove</a></div><div id="addWatchList"></div>';
		 flagToDisp = 1;
		if($s('#bhWidget').length>0){ 
			document.getElementById('bhWidget').innerHTML  = strToDisp;
			var button = document.getElementById("removeMe2");
			button.addEventListener("click", function(){
			removeAlert(response.emailtosend,prod_id);
			document.getElementById('bhWidget').innerHTML = '<div class="line fk-font-12" style="margin-bottom: 4px;color:#0B6F06"><b>Thank You ! We appreciate your motive to save energy :)</b></div>';
			}, false);
		}
		else { 
			$s('#price_feature_div:eq(0)').after(strToDisp);
			var button = document.getElementById("removeMe2");
			button.addEventListener("click", function(){
			removeAlert(response.emailtosend,prod_id);
			document.getElementById('bhWidget').innerHTML = '<div class="line fk-font-12" style="margin-bottom: 4px;color:#0B6F06"><b>Thank You ! We appreciate your motive to save energy :)</b></div>';
			}, false);
		}
		 
	}else{
		 flagToDisp = 0;
	}


});


function addEmailID(email){
  chrome.runtime.sendMessage({addEmail: email}, function(response) {});
}
function validateEmail($email) {
	if($email == '')
		return false;
  var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  return emailReg.test( $email );
}

$s = jQuery.noConflict();
function addToWatchList() {

  myPrice = getPrice();
  myPrice = parseFloat(myPrice);
//alert(myPrice);
	var prod_id = jQuery("input#ASIN").val();	
	
	var emailtosend = "";
	document.getElementById('bhWidget').innerHTML = '<div id="bhWidget"><div id="addWatchList"></div></div>';
	

	chrome.runtime.sendMessage({email: "defined"}, function(response) { 	 
	 //If First-time, No Email-ID is saved.
	  if(response.farewell=="No"){
		var msg = '<div id="addEmailBH"><input id="BhEmail" type="email" value="" style="min-height: 20px;margin-right: 6px;"><input id="BhButton" type="button" value="Enter Email" style="padding: 3px;padding-left: 8px;padding-right: 8px;"><br><div class="line fk-font-12" style="margin-bottom: 4px;">Enter your email if you wanna get a mail when the price drops</div></div>';
		$('#addWatchList').after(msg);
		var button = document.getElementById("BhButton");
		button.addEventListener("click", function(){
			emailtosend = document.getElementById('BhEmail').value;
			if(validateEmail(emailtosend))
			{
				addEmailID(emailtosend);
				$s.post('http://www.indiashopps.com/ext/price_watch/add_to_list.php',{email:emailtosend,vendor:3,product_id:prod_id,price_added:myPrice},function(resp){});
				chrome.runtime.sendMessage({product_id:prod_id,vendor:3}, function(response) { });
			}else{alert('Error: Invalid Email');return false;}
		
		
		  document.getElementById('addEmailBH').innerHTML = '<div class="line fk-font-12" style="margin-bottom: 4px;color:#b12704!important">Thank You ! An email has been sent to ' + document.getElementById('BhEmail').value + '. Please verify to start receiving price drop notifications. Do check your <b>SPAM</b> folder !</div>';
		}, false);
	  }
	  else {
		  emailtosend = response.farewell;
		  if(validateEmail(emailtosend))
			{
				$s.post('http://www.indiashopps.com/ext/price_watch/add_to_list.php',{email:emailtosend,vendor:3,product_id:prod_id,price_added:myPrice},function(resp){});
				chrome.runtime.sendMessage({product_id:prod_id,vendor:3}, function(response) { });
			}else{alert('Error: Invalid Email');return false;}
		var msg = '<div id="addEmailBH"><div class="line fk-font-12" style="margin-bottom: 4px;color:#b12704!important">Thank You ! A mail will be sent to ' + response.farewell + ' as soon as price drops. <a href="javascript:void();" id="changeEmail" style="color:blue;">Change Email-ID</a></div></div>';
		$('#addWatchList').after(msg);
			var button = document.getElementById("changeEmail");
		button.addEventListener("click", function(){
		  document.getElementById('addEmailBH').innerHTML = '<div id="addEmailBH"><input id="BhEmail" type="email" value="" style="min-height: 20px;margin-right: 6px;"><input id="BhButton" type="button" value="Enter Email" style="padding: 3px;padding-left: 8px;padding-right: 8px;"><br><div class="line fk-font-12" style="margin-bottom: 4px;">Enter your email if you wanna get a mail when the price drops</div></div>';
		  var button = document.getElementById("BhButton");
		button.addEventListener("click", function(){
		  emailtosend =document.getElementById('BhEmail').value;
		  if(validateEmail(emailtosend))
			{
				addEmailID(emailtosend);
				$s.post('http://www.indiashopps.com/ext/price_watch/add_to_list.php',{email:emailtosend,vendor:3,product_id:prod_id,price_added:myPrice},function(resp){});
				chrome.runtime.sendMessage({product_id:prod_id,vendor:3}, function(response) { });
			}else{alert('Error: Invalid Email');return false;}
		  document.getElementById('addEmailBH').innerHTML = '<div class="line fk-font-12" style="margin-bottom: 4px;">Thank You ! An email has been sent to ' + document.getElementById('BhEmail').value + '. Please verify to start receiving price drop notifications. Do check your <b>SPAM</b> folder !</div>';
		  
		}, false);
		}, false);
	  }
	  var rmbutton = document.getElementById("removeMe2");
	  if(rmbutton)
	  {
			rmbutton.addEventListener("click", function(){
			removeAlert(emailtosend,prod_id);
		  document.getElementById('bhWidget').innerHTML = '<div class="line fk-font-12" style="margin-bottom: 4px;color:#0B6F06"><b>Thank You ! We appreciate your motive to save energy :)</b></div>';
		}, false);
	  }
	});
	

	
}//closing of addToWatchList function

var imgURL2 = chrome.extension.getURL("watch-price1.png");

if($s('#price_feature_div').length>0){
  if(flagToDisp==0){
		$s('#price_feature_div:eq(0)').after('<div id="bhWidget"><a id="addWatchList" style="margin-top: 4px;" alt="Add to Watch List" title="Add to Watch List and get notifications on price drop" href="javascript:void();" class="fk-inline-block buy-btn fksk-buy-btn"><img style="margin-left:-12px;" src=' + imgURL2 +'></a></div>');
	 
		var button = document.getElementById("addWatchList");
		button.addEventListener("click", function(){
		//alert("Product added to your Watchlist. You will be notified on price drop");
		addToWatchList();
		}, false);
	}
	else {
		$s('#price_feature_div:eq(0)').after(strToDisp);
		var button = document.getElementById("removeMe");
		button.addEventListener("click", function(){
			 removeAlert(emailtosend,prod_id);
			document.getElementById('bhWidget').innerHTML = '<div class="line fk-font-12" style="margin-bottom: 4px;color:#0B6F06"><b>Thank You ! We appreciate your motive to save energy :)</b></div>';
		}, false);
	}
}
else if($s('.price.fk-display-block:eq(0)').length>0){
    if(flagToDisp==0){
		$s('.price.fk-display-block:eq(0)').parent().after('<div id="bhWidget"><a id="addWatchList" style="margin-top: 4px;" alt="Add to Watch List" title="Add to Watch List and get notifications on price drop" href="javascript:void();" class="fk-inline-block buy-btn fksk-buy-btn"><img style="margin-left:-12px;" src=' + imgURL2 +'></a></div>');

		 
		var button = document.getElementById("addWatchList");
		button.addEventListener("click", function(){
		  alert("Product added to your Watchlist. You will be notified on price drop");
		  addToWatchList();
		}, false);
		}
		else {
		  $s('.price.fk-display-block:eq(0)').parent().after(strToDisp);
		  var button = document.getElementById("removeMe");
		button.addEventListener("click", function(){
		  removeAlert(emailtosend,prod_id);
		  document.getElementById('bhWidget').innerHTML = '<div class="line fk-font-12" style="margin-bottom: 4px;color:#0B6F06"><b>Thank You ! We appreciate your motive to save energy :)</b></div>';
		}, false);
	}
}

function getPrice()
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