var prod_id = jQuery("input#pogId").val();
function removeAlert(email,pid)
{     
	if(email != '' && pid != '')
		chrome.runtime.sendMessage({rm_email: email,pid:pid,vendor:16}, function(response){});    
}


flagToDisp = 0; strToDisp = "";diff = 0;var emailtosend = "";
chrome.runtime.sendMessage({get_products: "defined",get_product_id:prod_id,vendor:16}, function(response) {
  

var imgURL2 = chrome.extension.getURL("watch-price2.png");
	if(response.out == 1)
	{
		 strToDisp = '<div class="pricealert_hatke"><div class="price_hatke-wraps" style="width: 185px;  height: 120px;"><img src="'+imgURL2+'"><a href="javascript:void();" id="removeMe2">Remove</a></div></div><div id="addWatchList"></div>';
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
			document.getElementById('bhWidget').innerHTML = '<div class="line fk-font-12" style="margin-bottom: 4px;"><b>Thank You ! We appreciate your motive to save energy :)</b></div>';
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

	var prod_id = jQuery("input#pogId").val();
	
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
				$s.post('https://www.yourshoppingwizard.com/ext/price_watch/add_to_list.php',{email:emailtosend,vendor:16,product_id:prod_id,price_added:myPrice},function(resp){});
				chrome.runtime.sendMessage({product_id:prod_id,vendor:16}, function(response) { });
			}else{alert('Error: Invalid Email');return false;}
		
		
		  document.getElementById('addEmailBH').innerHTML = '<div class="line fk-font-12" style="margin-bottom: 4px;;color:#b12704!important">Thank You ! An email has been sent to ' + document.getElementById('BhEmail').value + '. Please verify to start receiving price drop notifications. Do check your <b>SPAM</b> folder !</div>';
		}, false);
	  }
	  else { 
		  emailtosend = response.farewell;		 
		  if(validateEmail(emailtosend))
			{  
				$s.post('https://www.yourshoppingwizard.com/ext/price_watch/add_to_list.php',{email:emailtosend,vendor:16,product_id:prod_id,price_added:myPrice},function(resp){});
				chrome.runtime.sendMessage({product_id:prod_id,vendor:16}, function(response) { });
			}else{
				alert('Error: Invalid Email');return false;
			}
			
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
				$s.post('https://www.yourshoppingwizard.com/ext/price_watch/add_to_list.php',{email:emailtosend,vendor:16,product_id:prod_id,price_added:myPrice},function(resp){});
				chrome.runtime.sendMessage({product_id:prod_id,vendor:16}, function(response) { });
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

if($s('#pdp-buynow-rp').length>0){
  if(flagToDisp==0){
		$s('#pdp-buynow-rp:eq(0)').after('<div id="bhWidget"><a id="addWatchList" alt="Add to Watch List" title="Add to Watch List and get notifications on price drop" href="javascript:void();" class="fk-inline-block buy-btn fksk-buy-btn"><img style="margin-top:4px;" src=' + imgURL2 +'></a></div>');
	 
		var button = document.getElementById("addWatchList");
		button.addEventListener("click", function(){		
		addToWatchList();
		}, false);
	}
	else {
		$s('#pdp-buynow-rp:eq(0)').after(strToDisp);
		var button = document.getElementById("removeMe");
		button.addEventListener("click", function(){
			 removeAlert(emailtosend,prod_id);
			document.getElementById('bhWidget').innerHTML = '<div class="line fk-font-12" style="margin-bottom: 4px;color:#0B6F06"><b>Thank You ! We appreciate your motive to save energy :)</b></div>';
		}, false);
	}
}

function getPrice()
{
	myPrice = $("input#productPrice").val();
	return myPrice;
}
