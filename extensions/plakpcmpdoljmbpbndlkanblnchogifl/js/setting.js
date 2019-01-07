

//google analytics
/*
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-44539865-1']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
*/

function trackButton(name) {
    //_gaq.push(['_trackEvent', name, 'clicked']);
  };


var backgroundPage;

//setLocales
function setLocale(){
	$("[locale]").each(function(){
		$(this).html(chrome.i18n.getMessage($(this).attr("locale")));
	});
	
	$("[locale_title]").each(function(){
		$(this).attr("title",chrome.i18n.getMessage($(this).attr("locale_title")));
	});	
}

//document ready event
document.addEventListener('DOMContentLoaded', function () {
	
	//set btn event
	$('input[type=radio][name=Protocol]').change(function(){
		if(this.value == "http")
			$("#Port").val(8000);
		else
			$("#Port").val(8001);
	});	
	
	$(".settingInput").keypress(function(event){       
        if (event.keyCode == 13) $("[name='submit']").click();
    });	
	
	//set locale
	setLocale();
	
	$('#Host').tooltip({placement:'right'});
	$('#Port').numeric();
	
	//set input restriction
	$(".numeric").numeric();
	
  	backgroundPage = chrome.extension.getBackgroundPage();

  $("[name='submit']").click(saveChanges);
  
  //get setting
	chrome.runtime.sendMessage({purpose: 'getSetting'}, function(response) {
	});

  //set default value
  if($("#Port").val() == "")
	  $("#Port").val("8000");
		
  //set test connection event
  $('[name=testConnection]').click(function(){testConnection(false);});
  
  $('input').change(function(){
	$('[name="submit"]').addClass("notTest");
	$('#connectStatusDiv').html("");
  });
});

//******************** wizard area *************//
function leaveAStepCallback(obj){
	var step_num= obj.attr('rel'); // get the current step number
	return validateSteps(step_num); // return false to stay on step and true to continue navigation 
}

function onFinishCallback(){
	if(validateAllSteps()){
		saveChanges();
	}
}


//******************** wizard area end *************//

//display Messages
function showMessage(header,content){
	  $('#messageModal .messageHeader').html(header);
	  $('#messageModal .messageContent').html(content);
	  $('#messageModal').modal();
}

// listen 從 backgrounds scripts 傳來的 requests
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.purpose == 'settingMessage') {
	  showMessage(request.header,request.message);
	  //alert(request.message);
    }
	else if(request.purpose == 'errorMessage') {
		 showMessage(request.header,request.message);
	}
	// do setting only when not first time
	else if(request.purpose == 'getSettingResult' && typeof request.userID != "undefined") {
		$("#userID").val(request.userID);
		$("#Host").val(request.Host);
		$("#Password").val(request.Password);
		$("#Port").val(request.Port);
		if($("#Port").val() =="")
			$("#Port").val("8000");
		//chrome.storage.sync

		if(request.Protocol== "http")
			$("input[name=Protocol][value=http]").attr("checked","true");
		else
			$("input[name=Protocol][value=https]").attr("checked","true");		
		
		if(!(request.userID && request.Host && request.Password && request.Port))
		{
			$('[name="submit"]').addClass("notTest");
			$('#connectStatusDiv').html("");		
		}
		
		if(backgroundPage.glob_plug_in_status=="normal")
			testConnection(false);
	}
	
    else {
        sendResponse({}); // clean request
    }
});

// save changes
function saveChanges() {
  trackButton("Save Setting from tab");
  if($('[name="submit"]').hasClass('notTest'))
  {
	testConnection(true);
	return;
  }
  // Get a value saved in a form.
  var userID = $("#userID").val();
  var Host = $("#Host").val();
  var Password = $("#Password").val();
  var Port = $("#Port").val();
  var Protocol = $("input[type=radio][name=Protocol]:checked").val();
  backgroundPage.setPluginStatus("normal");
  //save setting 
	chrome.runtime.sendMessage({purpose: 'saveSetting',userID: userID,Host: Host,Password: Password,Port: Port,Protocol: Protocol}, function(response) {
		
		//alert(response.alertMessage);
	});
}

function testConnection(is_auto_save){
	trackButton("Test connection from tab");
	var userID = $("#userID").val();
	var Host = $("#Host").val();
	var Password = $("#Password").val();
	var Port = $("#Port").val();
	var Protocol = $("input[type=radio][name=Protocol]:checked").val();
	$('#connectStatusDiv').html('<img src="images/loader.gif"></img>');
	backgroundPage.glob_logining = false;
	backgroundPage.login_by_value(function(){
		if(backgroundPage.sidManager.test_sid)
		{
			$('#connectStatusDiv').html('<p>'+chrome.i18n.getMessage('CDC_CONN_SUCCESS')+'</p>');
			$('[name=submit]').removeClass("notTest");
			if(is_auto_save)
			{
				trackButton("Auto save - Setting");
				saveChanges();
			}
		}
		//test failed
		else
		{
			backgroundPage.glob_logining = false;
			$('#connectStatusDiv').html('<p class="text-error">'+backgroundPage.glob_errorReason+'</p>');
			$('[name=submit]').addClass("notTest");
		}
	},userID,Password,Host,Port,Protocol,true);


}

