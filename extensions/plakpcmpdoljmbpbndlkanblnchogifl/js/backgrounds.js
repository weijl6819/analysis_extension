
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

var glob_url='';
var glob_adc_status;
var glob_takeasy_status;
var glob_overall_status = "normal";
var glob_version = "2.0.0.r85";
//to avoid multiple login actions
var glob_logining = false;
//to determine if the user already set anything
var glob_firstTime = true;
var glob_errorReason = "";
var glob_overall_status_info = "";
var glob_dl_url='';
var glob_tabopened = false;
var glob_ajaxPool = new Object();
var glob_uniqid = 0;
/*
var SuccessNot = webkitNotifications.createNotification(
  'images/Icon.png',  // icon url - can be relative
   chrome.i18n.getMessage("CDC_SUCCESS"),  // notification title
  chrome.i18n.getMessage("CDC_ADD_SUCCESS")  // notification body text
);
var FailedNot = webkitNotifications.createNotification(
  'images/Icon.png',  // icon url - can be relative
   chrome.i18n.getMessage("CDC_FAILED"),  // notification title
  chrome.i18n.getMessage("CDC_ADD_FAIL")  // notification body text
);
*/

function getUniqid(){
	glob_uniqid++;
	if(glob_uniqid>=100000)
		glob_uniqid = 0;
	return glob_uniqid;
}

function clearAjax(){
	for(var key in glob_ajaxPool)
	{
		glob_ajaxPool[key].abort();
		delete glob_ajaxPool[key];
	}
}

function addAjax(ajaxCall,key){
	glob_ajaxPool[key]=ajaxCall;
}

//set number
	//chrome.browserAction.setIcon({path:"images/tray_ico_upload.gif"});
chrome.browserAction.setBadgeBackgroundColor({color:"#ff0000"});
	
function showMessage(message,notClose,id){
	if(!id)
		id = Date.now().toString();
	chrome.notifications.create(id, {type: "basic",title:chrome.i18n.getMessage('extName2'),iconUrl: "images/Icon2_64x64.png",message:message},function(notiID){	
	});
	/*
	if(!notClose)
		window.setTimeout(clearMessage(id), 3000);
	*/
}	
	
function clearMessage(notiID)	{
	chrome.notifications.clear(notiID,function(){});
}
	
//****************** Icon Animation ********************//

var rotate_images = ['images/Icons/Icon_24x24_01.png',
                        'images/Icons/Icon_24x24_02.png',
                        'images/Icons/Icon_24x24_03.png',
                        'images/Icons/Icon_24x24_04.png',
                        'images/Icons/Icon_24x24_05.png',
                        'images/Icons/Icon_24x24_06.png',
                        'images/Icons/Icon_24x24_07.png'];
 
var image_index = 0;
var keep_switching_icon = false;
var IconTimeInterval = 200;

function rotateIcon()
{    

	stopIcon();
    /*       
   if ( keep_switching_icon )
   {
      chrome.browserAction.setIcon({path: rotate_images[image_index]});
      image_index = (image_index + 1) % rotate_images.length;
      window.setTimeout(rotateIcon, IconTimeInterval);
   }
   */
}

function restartIcon(){
	keep_switching_icon = true;
	window.setTimeout(rotateIcon, IconTimeInterval);
}

function stopIcon(){
	keep_switching_icon = false;
	chrome.browserAction.setIcon({path: "images/Icon_24x24.png"});
}

function errorIcon(){
	keep_switching_icon = false;
	chrome.browserAction.setIcon({path: "images/Icon_24x24_2.png"});
	chrome.browserAction.setBadgeText({text:""});
}

window.setTimeout(rotateIcon, IconTimeInterval);

//****************** Icon Animation End ********************//

//endswith function
String.prototype.endsWith = function(suffix) {
	suffix = suffix.toLowerCase();
    return this.toLowerCase().indexOf(suffix, this.length - suffix.length) !== -1;
};

String.prototype.startsWith = function(prefix){
    return (this.substr(0, prefix.length) === prefix);
}

var url_manager = {
	method: 'lan',
	wan_ip: '',
	lan_ip: [],
	ddns: ''
}

//to manage contextMenu id
var contextManager = {
	contextMenuAdcID:false, 
	contextMenuTakeasyID:false, 
	contextMenuAdvancedID:false,
	eventCreated:false,
	
	clearContext: function(){
		chrome.contextMenus.remove(this.contextMenuAdcID);
		chrome.contextMenus.remove(this.contextMenuTakeasyID);
		chrome.contextMenus.remove(this.contextMenuAdvancedID);
		this.contextMenuAdcID = false;
		this.contextMenuTakeasyID = false;
		this.contextMenuAdvancedID = false;
	},
	
	setContext: function(){
		if(!this.eventCreated)
		{
			this.eventCreated = true;
			chrome.contextMenus.onClicked.addListener(function(info, tab) {
				if(info.menuItemId == contextManager.contextMenuAdcID)
				{
					trackButton("Add Task - Context Menu");
					if(info.linkUrl)
						addNewTask(info.linkUrl,tab.id);
					else if(info.selectionText )
						addNewTask(info.selectionText,tab.id);
					else if(info.srcUrl)
						addNewTask(info.srcUrl,tab.id);
				}
				else if(info.menuItemId == contextManager.contextMenuTakeasyID)
				{
					trackButton("Add Takeasy Task - Context Menu");

					if(info.mediaType == "video" || info.mediaType == "audio")
						addNewInstantTakeasyTask(tab.url,tab.id);
					else if(info.linkUrl)
						addNewInstantTakeasyTask(info.linkUrl,tab.id);
					else if(info.selectionText )
						addNewInstantTakeasyTask(info.selectionText,tab.id);
					else if(info.srcUrl)
						addNewInstantTakeasyTask(info.srcUrl,tab.id);
				}
				else if(info.menuItemId == contextManager.contextMenuAdvancedID)
				{
					trackButton("Add Advanced Task - Context Menu");
					
					if(info.mediaType == "video" || info.mediaType == "audio")
						glob_dl_url = tab.url;
					else if(info.linkUrl)
						glob_dl_url = info.linkUrl;
					else if(info.selectionText )
						glob_dl_url = info.selectionText;
					else if(info.srcUrl)
						glob_dl_url = info.srcUrl;
					
					chrome.tabs.executeScript(tab.id, {file:"js/advanced_initiate.js"});
					/*
					if(info.mediaType == "video" || info.mediaType == "audio")
						addNewInstantTakeasyTask(tab.url,tab.id);
					else if(info.linkUrl)
						addNewInstantTakeasyTask(info.linkUrl,tab.id);
					else if(info.selectionText )
						addNewInstantTakeasyTask(info.selectionText,tab.id);
					else if(info.srcUrl)
						addNewInstantTakeasyTask(info.srcUrl,tab.id);
					*/
				}				
			});
		}
		if(!this.contextMenuAdcID)
		{
			this.contextMenuAdcID=chrome.contextMenus.create({id:"asustor download adc",title : chrome.i18n.getMessage('CDC_DOWNLOAD_ADC_LABEL'),contexts: ['link','selection','image','video','audio']});
		}		
		if(!this.contextMenuTakeasyID)
		{
			this.contextMenuTakeasyID=chrome.contextMenus.create({id:"asustor download takeasy",title : chrome.i18n.getMessage('CDC_DOWNLOAD_TAKEASY_LABEL'),contexts: ['link','selection','image','video','audio']});
		}	
		if(!this.contextMenuAdvancedID)
		{
			this.contextMenuAdvancedID=chrome.contextMenus.create({id:"asustor download advanced",title : chrome.i18n.getMessage('CDC_DOWNLOAD_ADVANCED_LABEL'),contexts: ['link','selection','image','video','audio']});
		}	
	}
};


//to manage session id
var sidManager = {

	sid: '',
	//used by test connection
	test_sid: '',
	
	setSid: function(sidValue){
		this.sid = sidValue;
	},
	setTestSid: function(sidValue){
		this.test_sid = sidValue;
	},	
	clearSid: function(){
		this.sid = '';
	},
	clearTestSid: function(){
		this.test_sid = '';
	}	
};

//pref manager
//to manage preference
var prefManager = {

	default_dl_dir: ''
	
};
var prefManagerTakeasy = {

	default_dl_dir: ''
	
};

//exception handler
function exceptionHandler(error_code,error_msg){

	//alert(error_code);
	//session 過期再次login
	if(error_code == 5000)
	{
		login(function(){
			chrome.runtime.sendMessage({purpose: 'reloadList'});
		});
	}
		

	/*
	else if(error_code == 5001)
		chrome.runtime.sendMessage({purpose: 'errorMessage',header: " ",message: "Authentication fail"});
	else if(error_code == 1002)
		chrome.runtime.sendMessage({purpose: 'errorMessage',header: " ",message: "Account is disabled"});
	else if(error_code == 1003)
		chrome.runtime.sendMessage({purpose: 'errorMessage',header: " ",message: "Account is expired"});	
	*/
}

//logout
function logout(callBack,is_test) {

	var sid;
	if(!is_test)
		sid=sidManager.sid;
	else
		sid=sidManager.test_sid;
//console.info(url+"portal/apis/login.cgi?act=login", items.userID, items.Password);
	
	logout_by_value(callBack,glob_url,sid);
	
	if(!is_test)
	{
		clearAjax();
		sidManager.clearSid();
		glob_url="";
		glob_overall_status_info = chrome.i18n.getMessage('CDC_NOT_LOGGED');
		setPluginStatus("logout",3); 
		glob_adc_status="";
		glob_takeasy_status="";
		glob_overall_status="logout"
		chrome.storage.local.remove("Password");  	
		errorIcon();		
		contextManager.clearContext();
	}
	else
		sidManager.clearTestSid();
}

//logout with specific value
function logout_by_value(callBack,url,sid)
{
	if(sid && url)
	{
		$.ajax({
			type: "POST",
			url: url+"portal/apis/login.cgi?act=logout&sid="+sid,
			dataType: "json"
			}).done(function(data) {
				if(data.success) // logout success
				{
					
					if(callBack)
						callBack();
					//alert(sidManager.sid);
				}
				else // logout  fail
				{
					//alert("logout fail");
				}
			});
	}
}

//clear settings
function clearSetting(){
	chrome.storage.local.clear( function() {
		glob_firstTime = true;
		glob_adc_status ="";
		glob_takeasy_status ="";
		errorIcon();
	}); 
	logout();
 
}

//***************** check download status ******************//
var CheckTimeInterval = 30000;
function checkDownloadStatusInterval()
{
	window.setTimeout(checkDownloadStatusInterval, CheckTimeInterval);
	if(sidManager.sid)
	{
		checkDownloadStatus();
		reviveConnection(0);
	}
	else if(glob_overall_status != "logout")
		login();
}
window.setTimeout(checkDownloadStatusInterval, CheckTimeInterval);

function reviveConnection(retry_count)
{
	$.ajax({
		type: "POST",
		url: glob_url+"portal/apis/login.cgi?act=revive&sid="+sidManager.sid,
		data: {sortby: "position",orderby: "asc"},
		dataType: "json",
		timeout: 5000
		}).done(function(data) {
			if(data.success)
			{
				//sidManager.sid = data.sid;
			}
			//failed
			else
			{
				login();
			}
		}).error(function(){
		//to check is not installed or connect error next time
			if(retry_count >= 2)
			{
				login();
			}
			else
			{
				reviveConnection(retry_count + 1)
			}
				
			//errorIcon();
			//login();
		});
}

function checkDownloadStatus()
{
	var completeNum=0;
	var RunningNum=0;
	var dc_changed = false;
	//console.info(url+"/apps/download-center/btdlm.cgi?act=torrent-list&sid="+mySid);
	$.ajax({
		type: "POST",
		url: glob_url+"/apps/download-center/btdlm.cgi?act=torrent-list&sid="+sidManager.sid,
		data: {sortby: "position",orderby: "asc"},
		dataType: "json"
		}).done(function(data) {
			
			if(data.success)
			{
				
				for(var key in data.files){
				
					//count job number
					if(data.files[key].status == "Finished" || data.files[key].status == "Seeding")
						completeNum++;
					else if(data.files[key].status == "Downloading")
						RunningNum++;
				}
				
				//if status changed relogin
				if(glob_adc_status!="enabled")
					dc_changed = true;;
				
				checkTakeasyDownloadStatus(completeNum,RunningNum,dc_changed);
				/*
				//if no downloading job
				if(RunningNum <= 0) 
				{
					stopIcon();
					chrome.browserAction.setBadgeText({text:completeNum.toString()});
				}
				else
				{
					if(!keep_switching_icon)
						restartIcon();
					chrome.browserAction.setBadgeText({text:completeNum.toString()});
				}
				

				*/
			}
			//failed
			else
			{
				glob_adc_status ="no-permission";
				checkTakeasyDownloadStatus(0,0);
				//exceptionHandler(data.error_code);
			}

			
		}).error(function(){
		//to check is not installed or connect error next time
			glob_adc_status ="";
			checkTakeasyDownloadStatus(0,0);
			//errorIcon();
			//login();
		});
	
}

function checkTakeasyDownloadStatus(completeNum,RunningNum,dc_changed)
{
	//console.info(url+"/apps/download-center/btdlm.cgi?act=torrent-list&sid="+mySid);
	$.ajax({
		type: "POST",
		url: glob_url+"/apps/takeasy/video_downloader.cgi?act=list_download&sid="+sidManager.sid,
		data: {sortby: "position",orderby: "asc"},
		dataType: "json"
		}).done(function(data) {
			
			if(data.success)
			{
				completeNum += data.finish;
				RunningNum += data.download;

				setBadget(completeNum,RunningNum);
				
				//if status changed relogin
				if(dc_changed || glob_takeasy_status!="enabled")
					getGeneralDatas(glob_url,sidManager.sid);
			}
			//failed
			else
			{
				glob_adc_status ="no-permission";
				setBadget(completeNum,RunningNum);
				if(dc_changed)
					getGeneralDatas(glob_url,sidManager.sid);
				//exceptionHandler(data.error_code);
			}

		}).error(function(){
			//if no downloading job
			setBadget(completeNum,RunningNum);	
			//to check is not installed or connect error next time
			glob_takeasy_status ="";
			if(dc_changed)
				getGeneralDatas(glob_url,sidManager.sid);			
			//errorIcon();
			//login();
		});
	
}

function setBadget(completeNum,RunningNum){
	
	if(completeNum == 0)
		completeNum = '';
	//if no downloading job
	if(RunningNum <= 0) 
	{
		stopIcon();
		chrome.browserAction.setBadgeText({text:completeNum.toString()});
	}
	else
	{
		if(!keep_switching_icon)
			restartIcon();
		chrome.browserAction.setBadgeText({text:completeNum.toString()});
	}
}

//***************** check download status end ******************//

// to see if already logged in
function is_logged_in(){
	if(sidManager.sid)
		return true;
	else
		return false;
}

//login to ADM by value 
function login_by_value(callBack,userID,Password,Host,Port,Protocol,is_test,waitTime)
{

	if(glob_logining)
		return;
	glob_logining = true;

  //set callback wait
  if(!waitTime)
	waitTime = 0;
  //console.info("callBack:"+callBack);
  Host = Host.replace( /\s/g, "");
  var ipRE =  /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
  if( !ipRE.test(Host))
  {
	if(Host.indexOf(".") != -1) // Host Name 
		Host=Host;
	else  //cloud ID
		Host=Host+".myasustor.com";
  }

  var oldSid=sidManager.sid;
  var oldUrl=glob_url;
  var tempUrl;
  if(Port == "")
	Port = "8000";
	tempUrl = Protocol+"://"+Host+":"+Port+"/";
	//console.info(url+"portal/apis/login.cgi?act=login", items.userID, items.Password);
	clearAjax();
	var uniqid = getUniqid();
	var ajaxCall = $.ajax({
			type: "POST",
			url: tempUrl+"portal/apis/login.cgi?act=login",
			data: {account: userID,password: Password},
			timeout: 10000,
			dataType: "json"
			}).done(function(data) {
				if(data.success) // log in success
				{
					//if is not test save settings
					if(!is_test)
					{

						url_manager.lan_ip = [];
						for(var key in data.netif)
						{
							if(data.netif[key].IP == Host)
								url_manager.method = 'lan';
							url_manager.lan_ip.push(data.netif[key].IP);
						}
						uniqid = getUniqid();
						//get wan_ip
						ajaxCall = $.ajax({
						type: "POST",
						url: tempUrl+"/portal/apis/settings/ddns.cgi?act=wan_ip&sid="+data.sid,
						dataType: "json"
						}).done(function(data2) {
							//console.info(data);
							
							if(data2.success)
							{
								if(data2.ip == Host )
									url_manager.method = 'wan';
								url_manager.wan_ip= data2.ip;
								
							}
							else
							{

							}
							uniqid = getUniqid();
							//get ddns
							ajaxCall = $.ajax({
							type: "POST",
							url: tempUrl+"/portal/apis/settings/ddns.cgi?act=check_avail&sid="+data.sid,
							dataType: "json"
							}).done(function(data) {
								//console.info(data);
								
								if(data.success)
								{
									if(data.hostname == Host )
										url_manager.method = 'ddns';
									url_manager.ddns= data.hostname;
								}
								else
								{
									url_manager.ddns = false;
								}
								
								chrome.storage.local.set({'url_manager':url_manager}, function() {
								});  								
								
							});
							addAjax(ajaxCall,uniqid);
							
						});	
						addAjax(ajaxCall,uniqid);
								
						
						getGeneralDatas(tempUrl,data.sid);
						
						//logout old session
						if(oldSid && oldUrl)
							logout_by_value(false,oldUrl,oldSid);					
							
						if(callBack)
							window.setTimeout(function(){
								callBack();
							}, waitTime);								
						glob_logining = false;
						sidManager.setSid(data.sid);

					}
					else
					{
						sidManager.setTestSid(data.sid);	
						logout_by_value(false,tempUrl,data.sid);
						if(callBack)
							window.setTimeout(function(){
								callBack();
							}, waitTime);
					}
				}
				else // log in fail
				{
					if(!is_test)
					{
						errorIcon();
						sidManager.clearSid();
						glob_overall_status_info = chrome.i18n.getMessage('CDC_CONN_FAIL');
						glob_logining = false;
					}
					else
						sidManager.clearTestSid();
						
					glob_errorReason = chrome.i18n.getMessage('CDC_USER_INCORRECT');
					exceptionHandler(data.error_code,data.error_msg);
					if(callBack)
						window.setTimeout(function(){
							callBack();
						}, waitTime);
				}
					
			}).error(function(data){
				if(!is_test)
				{
					sidManager.clearSid();
					errorIcon();
					glob_overall_status_info = chrome.i18n.getMessage('CDC_CONN_FAIL');
					//failed and try to do more login
					multi_url_login(userID,Password,Port,Protocol,callBack);
				}
				else
				{
					sidManager.clearTestSid();
					if(callBack)
					{
						window.setTimeout(function(){
							callBack();
						}, waitTime);
					}					
				}
				glob_errorReason = chrome.i18n.getMessage('CDC_CONN_FAIL');
				
			});
			addAjax(ajaxCall,uniqid);
}

//login to ADM if original setting fail
function login_by_value_auto(callBack,userID,Password,Host,Port,Protocol,next_index,ori_callback)
{
  //console.info("callBack:"+callBack);
  Host = Host.replace( /\s/g, "");
  var ipRE =  /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
  if( !ipRE.test(Host))
  {
	if(Host.indexOf(".") != -1) // Host Name 
		Host=Host;
	else  //cloud ID
		Host=Host+".myasustor.com";
  }

  var oldSid=sidManager.sid;
  var oldUrl=glob_url;
  var tempUrl;
  if(Port == "")
	Port = "8000";
	tempUrl = Protocol+"://"+Host+":"+Port+"/";
	//console.info(url+"portal/apis/login.cgi?act=login", items.userID, items.Password);
		var uniqid = getUniqid();
		var ajaxCall = $.ajax({
			type: "POST",
			url: tempUrl+"portal/apis/login.cgi?act=login",
			data: {account: userID,password: Password},
			timeout: 5000,
			dataType: "json"
			}).done(function(data) {
				if(data.success) // log in success
				{
					getGeneralDatas(tempUrl,data.sid);
					//logout old session
					if(oldSid && oldUrl)
						logout_by_value(false,oldUrl,oldSid);	
						
					glob_logining = false;
					if(ori_callback)
							ori_callback();							
					
					sidManager.setSid(data.sid);

				}
				else // log in fail
				{
					errorIcon();
					sidManager.clearSid();
					glob_overall_status_info = chrome.i18n.getMessage('CDC_CONN_FAIL');
					glob_logining = false;
					glob_errorReason = chrome.i18n.getMessage('CDC_USER_INCORRECT');
					exceptionHandler(data.error_code,data.error_msg);
					if(ori_callback)
						ori_callback();
				}
					
			}).error(function(data){

				sidManager.clearSid();
				errorIcon();
				glob_overall_status_info = chrome.i18n.getMessage('CDC_CONN_FAIL');
				if(callBack)
				{
					callBack(userID,Password,Port,Protocol,ori_callback,next_index);
				}
				else 
				{
					glob_overall_status_info = chrome.i18n.getMessage('CDC_CONN_FAIL');
					glob_logining = false;
					if(ori_callback)
						ori_callback();
				}
				glob_errorReason = chrome.i18n.getMessage('CDC_CONN_FAIL');
				
			});
			addAjax(ajaxCall,uniqid );
}  
  
function getGeneralDatas(tempUrl,sid){
	
	glob_overall_status_info = chrome.i18n.getMessage('CDC_CONNECTED');
	glob_overall_status ="normal";
	restartIcon();
	setPluginStatus(glob_overall_status,3);
		
	//********right click context menu download functions************//
	
	contextManager.setContext();

	//********right click context menu download functions end************//
	
	glob_url = tempUrl;
	chrome.runtime.sendMessage({purpose: 'changeUrl',url:glob_url });
	
	//get download-center status
	var uniqid = getUniqid();
	var ajaxCall = $.ajax({
	type: "POST",
	url: tempUrl+"/portal/apis/appCentral/appcentral.cgi?act=check-status&sid="+sid,
	data: {name:"download-center"},
	dataType: "json"
	}).done(function(data) {
		var temp_app_status = glob_adc_status;
		if(data.success)
		{
			
			if(data.items.length <= 0)
			{
				glob_adc_status = "not-installed";
				//glob_adc_status_info = chrome.i18n.getMessage('CDC_DC_NOT_INSTALL');
			}
			else if(data.items[0].enabled)
			{
	

				uniqid = getUniqid();
				//get preference
				ajaxCall = $.ajax({
				type: "POST",
				url: tempUrl+"/apps/download-center/btdlm.cgi?act=get-pref&sid="+sid,
				dataType: "json"
				}).done(function(data) {
					//console.info(data);
					
					if(data.success)
					{
						glob_adc_status = "enabled";
						//glob_adc_status_info = chrome.i18n.getMessage('CDC_CONNECTED');
						checkDownloadStatus();					
						prefManager.default_dl_dir = data.default_dl_dir;
					}
					else
					{
						glob_adc_status = "no-permission";
					}
					
				});	
				addAjax(ajaxCall,uniqid);				
				
			}
			else
			{
				glob_adc_status = "disabled";
				//glob_adc_status_info = chrome.i18n.getMessage('CDC_DC_NOT_INSTALL');
			}

		}
		else
		{
			glob_adc_status = "not-installed";
			//glob_adc_status_info = chrome.i18n.getMessage('CDC_DC_NOT_INSTALL');
		}
		//if status changed , change popup panel
		if(temp_app_status!=glob_adc_status)
			chrome.runtime.sendMessage({purpose: 'sePanelVisibility'});
										

	});
	addAjax(ajaxCall,uniqid);
	//get takeasy status
	uniqid = getUniqid();
	ajaxCall = $.ajax({
	type: "POST",
	url: tempUrl+"/portal/apis/appCentral/appcentral.cgi?act=check-status&sid="+sid,
	data: {name:"takeasy"},
	dataType: "json"
	}).done(function(data) {
		var temp_app_status = glob_takeasy_status;
		if(data.success)
		{
			if(data.items.length <= 0)
			{
				glob_takeasy_status = "not-installed";
				//glob_takeasy_status_info = chrome.i18n.getMessage('CDC_DC_NOT_INSTALL');
				
			}
			else if(data.items[0].enabled)
			{

				uniqid = getUniqid();
				//get takeasy preference
				ajaxCall = $.ajax({
				type: "POST",
				url: tempUrl+"/apps/takeasy/video_downloader.cgi?act=get_general_option&sid="+sid,
				dataType: "json"
				}).done(function(data) {
					//console.info(data);
					
					if(data.success)
					{
						prefManagerTakeasy.default_dl_dir = data.location;
						glob_takeasy_status = "enabled";
						//glob_takeasy_status_info = chrome.i18n.getMessage('CDC_CONNECTED');
						checkDownloadStatus();						
					}
					else
					{
						glob_takeasy_status = "no-permission";
					}
					
				});	
				addAjax(ajaxCall,uniqid);					
			}
			else
			{
				glob_takeasy_status = "disabled";
				//glob_takeasy_status_info = chrome.i18n.getMessage('CDC_DC_NOT_INSTALL');
			}

		}
		else
		{
			glob_takeasy_status = "not-installed";
			//glob_takeasy_status_info = chrome.i18n.getMessage('CDC_DC_NOT_INSTALL');
		}
		//if status changed , change popup panel
		if(temp_app_status!=glob_takeasy_status)
			chrome.runtime.sendMessage({purpose: 'sePanelVisibility'});
										
	});								
	addAjax(ajaxCall,uniqid);

}
  
// login to ADM with settings
function login(callBack,waitTime) {
  if(chrome.storage.local)
  {
	chrome.storage.local.get(['userID','Password','Host','Port','Protocol','test','url_manager'], function(items) {
		url_manager = items.url_manager;
		if(!url_manager)
			url_manager = {
				method: 'lan',
				wan_ip: '',
				lan_ip: [],
				ddns: ''
			};
		//if is first time use
		if(typeof items.userID != "undefined")
			glob_firstTime = false;
		if(!glob_firstTime)
		{
			login_by_value(callBack,items.userID,items.Password,items.Host,items.Port,items.Protocol,false,waitTime);
		}
		else if(!glob_tabopened)
		{
			chrome.tabs.create({url : 'setting.html'});
			glob_tabopened = true;
		}
	});  
  }
}

// login with url_manager
function multi_url_login(userID,Password,Port,Protocol,ori_callback){
	glob_logining = true;
	var next_index;
	for(key= 0; key <= url_manager.lan_ip.length;key++){
		if(url_manager.lan_ip[key] && url_manager.lan_ip[key] != "0.0.0.0")
		{	
			next_index = key;
			break;
		}
	}
	if(typeof next_index != "undefined")
		multi_url_login_recursive(userID,Password,Port,Protocol,ori_callback,next_index);
	else
		multi_url_login_recursive_wan(userID,Password,Port,Protocol,ori_callback)
}

// login with url_manager, first try to login to lan
function multi_url_login_recursive(userID,Password,Port,Protocol,ori_callback,index){
	if(!userID)
	{
		glob_logining = false;
		return;
	}
	var current_ip = url_manager.lan_ip[index];
	var next_index = false
	for(key= index+1; key <= url_manager.lan_ip.length;key++){
		if(url_manager.lan_ip[key] && url_manager.lan_ip[key] != "0.0.0.0")
		{
			next_index = key;
			break;
		}
	}
	if(next_index)
		login_by_value_auto(multi_url_login_recursive,userID,Password,current_ip,Port,Protocol,next_index,ori_callback);
	else
		login_by_value_auto(multi_url_login_recursive_wan,userID,Password,current_ip,Port,Protocol,false,ori_callback);
}

//than try to login to wan 
function multi_url_login_recursive_wan(userID,Password,Port,Protocol,ori_callback){
	if(!userID)
	{
		glob_logining = false;
		return;
	}
	var current_ip = url_manager.wan_ip;
	
	if(current_ip && current_ip != "0.0.0.0")
		login_by_value_auto(multi_url_login_recursive_ddns,userID,Password,current_ip,Port,Protocol,false,ori_callback);
	else
		 multi_url_login_recursive_ddns(userID,Password,Port,Protocol,ori_callback)
}

//than try to login to ddns
function multi_url_login_recursive_ddns(userID,Password,Port,Protocol,ori_callback){
	if(!userID)
	{
		glob_logining = false;
		return;
	}
	var current_ip = url_manager.ddns;
	if(!current_ip)
		current_ip = "0.0.0.0";
	login_by_value_auto(false,userID,Password,current_ip,Port,Protocol,false,ori_callback);
}

function addNewTask(dl_url,tab_id,username,password) {

	var action ='';
	var auth_enabled = false;
	var auth_account = '';
	var auth_password = '';
	
	if(dl_url.endsWith(".torrent") || dl_url.indexOf(".torrent?") != -1 || dl_url.startsWith('magnet'))
		action = 'torrent-add-url';
	else
		action = 'download-add';
		
	if(username || password)	
	{
		auth_enabled = true;
		auth_account = username;
		auth_password = password;
	}
		
	$.ajax({
		type: "POST",
		url: glob_url+"/apps/download-center/btdlm.cgi?act="+action+"&sid="+sidManager.sid,
		data: {url: dl_url,save_to:prefManager.default_dl_dir,auth_enabled:auth_enabled,auth_account:auth_account,auth_password:auth_password},
		dataType: "json"
		}).done(function(data) {
			
			//if is a torrent file,continue to add torrent
			if(data.success && action == 'torrent-add-url')
			{
				
				var torrent=data.torrent;
				
				var dl_link = dl_url;

				//is magnet uri
				if(!torrent)
				{
					torrent=dl_url;
					dl_link="";
				}
				//add all file to download
				$.ajax({
					type: "POST",
					url: glob_url+"/apps/download-center/btdlm.cgi?act=torrent-add&sid="+sidManager.sid,
					data: {url: dl_link,download_dir:prefManager.default_dl_dir,torrent:torrent,enable_top_queue:false,file_unwanted:''},
					dataType: "json"
					}).done(function(data) {
						
						if(data.success)
						{
							//SuccessNot.show();
							checkDownloadStatus();
							showMessage(chrome.i18n.getMessage("CDC_ADD_SUCCESS").replace("{0}",chrome.i18n.getMessage("CDC_DOWNLOAD_ADC_LABEL")));
							
							//if(tab_id)
								//chrome.tabs.executeScript(tab_id, {code: 'CDC_alert_success("'+chrome.i18n.getMessage("CDC_ADD_SUCCESS")+'");'});
						}
						else
						{
							showMessage(chrome.i18n.getMessage("CDC_ADD_FAIL").replace("{0}",chrome.i18n.getMessage("CDC_DOWNLOAD_ADC_LABEL")));
							//if(tab_id)
								//chrome.tabs.executeScript(tab_id, {code: 'CDC_alert_fail("'+chrome.i18n.getMessage("CDC_ADD_FAIL")+'");'});
						}
					});
			}
			else if(data.success)
			{	
				//SuccessNot.show();
				checkDownloadStatus();
				showMessage(chrome.i18n.getMessage("CDC_ADD_SUCCESS").replace("{0}",chrome.i18n.getMessage("CDC_DOWNLOAD_ADC_LABEL")));
				
				//if(tab_id)
					//chrome.tabs.executeScript(tab_id, {code: 'CDC_alert_success("'+chrome.i18n.getMessage("CDC_ADD_SUCCESS")+'");'});
			}
			else
			{
				showMessage(chrome.i18n.getMessage("CDC_ADD_FAIL").replace("{0}",chrome.i18n.getMessage("CDC_DOWNLOAD_ADC_LABEL")));
				//if(tab_id)
					//chrome.tabs.executeScript(tab_id, {code: 'CDC_alert_fail("'+chrome.i18n.getMessage("CDC_ADD_FAIL")+'");'});
			}
		});
}

function addNewInstantTakeasyTask(dl_url) {
	showMessage(chrome.i18n.getMessage('CDC_ADDING_TAKEASY')+"...",true,dl_url);
	$.ajax({
		type: "POST",
		url: glob_url+"/apps/takeasy/video_downloader.cgi?act=check_url&sid="+sidManager.sid,
		data: {url: dl_url},
		dataType: "json"
		}).done(function(data) {
			
			if(data.success)
			{
				var playlist = data.playlist;
				var flvcd = data.flvcd;
				
				if(!playlist ) {
					
					addNewTaskTakeasyStep2(-1,dl_url);
				}
				else if(playlist) {
					if(dl_url.indexOf("www.youtube.com/playlist") != -1)
					{
						$.ajax({
							type: "POST",
							url: glob_url+"/apps/takeasy/video_downloader.cgi?act=list_playlist&sid="+sidManager.sid,
							data: {url: dl_url},
							dataType: "json"
							}).done(function(data2) {
								var urls = [];
								for(var key in data2.items){
									urls.push(data2.items[key].url);
								}							
								addNewTaskTakeasyStep2Playlist(urls,dl_url);
							});
					}
					else if(dl_url.indexOf("www.youtube.com/watch") != -1)
					{
						$.ajax({
							type: "POST",
							url: glob_url+"/apps/takeasy/video_downloader.cgi?act=list_playlist&sid="+sidManager.sid,
							data: {url: dl_url},
							dataType: "json"
							}).done(function(data2) {
								var single_url;
								for(var key in data2.items){
									var item = data2.items[key];
									if(item.check)
									{
										single_url = item.url;
									}
								}							
								addNewTaskTakeasyStep2(-1,single_url);
									//chrome.runtime.sendMessage({purpose: 'takeasyFormatContentScript',formats: data2.formats,url:dl_url});
							});
					}
				}
			
			}
			else
			{
				if(data.error_code != 5017)
					showMessage(chrome.i18n.getMessage("CDC_ADD_FAIL").replace("{0}",chrome.i18n.getMessage("CDC_DOWNLOAD_TAKEASY_LABEL")),true,dl_url);
				else
					showMessage(chrome.i18n.getMessage("CDC_EXCEED_TAKEASY"),true,dl_url);			
			}
		}).error(function(){
			showMessage(chrome.i18n.getMessage("CDC_ADD_FAIL").replace("{0}",chrome.i18n.getMessage("CDC_DOWNLOAD_TAKEASY_LABEL")),true,dl_url);	
		});
	
}

function addNewTaskTakeasyStep1(dl_url,content_script) {
		
	$.ajax({
		type: "POST",
		url: glob_url+"/apps/takeasy/video_downloader.cgi?act=check_url&sid="+sidManager.sid,
		data: {url: dl_url},
		dataType: "json"
		}).done(function(data) {
			
			if(data.success)
			{
				var playlist = data.playlist;
				var flvcd = data.flvcd;
				
				if(!playlist ) {
					$.ajax({
						type: "POST",
						url: glob_url+"/apps/takeasy/video_downloader.cgi?act=get_format&sid="+sidManager.sid,
						data: {url: dl_url},
						dataType: "json"
						}).done(function(data2) {
							if(!content_script)
								chrome.runtime.sendMessage({purpose: 'takeasyFormat',formats: data2.formats,url:dl_url});
							else
							{
								  chrome.tabs.getSelected(null, function(tab) {
										chrome.tabs.sendRequest(tab.id, {purpose: 'takeasyFormatContentScript',formats: data2.formats,url:dl_url}, function(response) {
									});
								  });
							}
								//chrome.runtime.sendMessage({purpose: 'takeasyFormatContentScript',formats: data2.formats,url:dl_url});
						});
				}
				else if(playlist ) {
					if(dl_url.indexOf("www.youtube.com/playlist") != -1)
					{
						addNewTaskTakeasyStep2Playlist("playlist",dl_url,content_script);
						//showMessage(chrome.i18n.getMessage('CDC_ADDING_TAKEASY')+"...",true,dl_url);
					}
					else if(dl_url.indexOf("www.youtube.com/watch") != -1)
					{
					
						if(!content_script)
						{
							chrome.runtime.sendMessage({purpose: 'takeasyFormatPlaylist',dl_url:dl_url});
						}
						else
						{
							chrome.tabs.getSelected(null, function(tab) {
								chrome.tabs.sendRequest(tab.id, {purpose: 'takeasyFormatPlaylistContentScript',url:dl_url}, function(response) {});
							});
						}					

					}
				}
			
			}
			else
			{
				showMessage(chrome.i18n.getMessage("CDC_CANT_FIND_VIDEO"));
				if(content_script)
				{
					chrome.tabs.getSelected(null, function(tab) {
						chrome.tabs.sendRequest(tab.id, {purpose: 'errorOccured'}, function(response) {});
					});
				}
			}
		});
}

function addNewTaskTakeasyStep2(format,dl_url) {
			
	$.ajax({
		type: "POST",
		url: glob_url+"/apps/takeasy/video_downloader.cgi?act=add_download&sid="+sidManager.sid,
		data: {url: dl_url,format:format,location:prefManagerTakeasy.default_dl_dir},
		dataType: "json"
		}).done(function(data) {
			
			if(data.success)
			{
				clearMessage(dl_url);
				//SuccessNot.show();
				checkDownloadStatus();
				showMessage(chrome.i18n.getMessage("CDC_ADD_SUCCESS").replace("{0}",chrome.i18n.getMessage("CDC_DOWNLOAD_TAKEASY_LABEL")));
			
			}
			else
			{
				clearMessage(dl_url);
				if(data.error_code != 5017)
					showMessage(chrome.i18n.getMessage("CDC_ADD_FAIL").replace("{0}",chrome.i18n.getMessage("CDC_DOWNLOAD_TAKEASY_LABEL")));
				else
					showMessage(chrome.i18n.getMessage("CDC_EXCEED_TAKEASY"));
			}
		});
}

function addNewTaskTakeasyStep2Playlist(type,dl_url,content_script) {
	
	var dl_urls = '';
	
	showMessage(chrome.i18n.getMessage('CDC_ADDING_TAKEASY')+"...",true,dl_url);
	
	$.ajax({
		type: "POST",
		url: glob_url+"/apps/takeasy/video_downloader.cgi?act=list_playlist&sid="+sidManager.sid,
		data: {url: dl_url},
		dataType: "json"
		}).done(function(data2) {
			var single_url;
			for(var key in data2.items){
				var item = data2.items[key];
				if(item.check)
				{
					single_url = item.url;
				}
				dl_urls+=item.url+",";
			}
			
			if(type=="single")
				dl_urls = single_url;
			
			$.ajax({
				type: "POST",
				url: glob_url+"/apps/takeasy/video_downloader.cgi?act=add_playlist&sid="+sidManager.sid,
				data: {url: dl_urls,format:"-1",location:prefManagerTakeasy.default_dl_dir},
				dataType: "json"
				}).done(function(data) {
					
					if(data.success)
					{
						if(dl_url)
							clearMessage(dl_url);
						//SuccessNot.show();
						checkDownloadStatus();
						showMessage(chrome.i18n.getMessage("CDC_ADD_SUCCESS").replace("{0}",chrome.i18n.getMessage("CDC_DOWNLOAD_TAKEASY_LABEL")),true,dl_url);
					
					}
					else
					{
						if(dl_url)
							clearMessage(dl_url);
						if(data.error_code != 5017)
							showMessage(chrome.i18n.getMessage("CDC_ADD_FAIL").replace("{0}",chrome.i18n.getMessage("CDC_DOWNLOAD_TAKEASY_LABEL")),true,dl_url);
						else
							showMessage(chrome.i18n.getMessage("CDC_EXCEED_TAKEASY"),true,dl_url);
					}
					if(!content_script)
						chrome.runtime.sendMessage({purpose: 'takeasyClose'});
					else
					{
						  chrome.tabs.getSelected(null, function(tab) {
								chrome.tabs.sendRequest(tab.id, {purpose: 'takeasyCloseContentScript'}, function(response) {
							});
						  });
					}					
				  chrome.tabs.getSelected(null, function(tab) {
						chrome.tabs.sendRequest(tab.id, {purpose: 'takeasyCloseContentScript'}, function(response) {
					});
				  });			
				});
		}).error(function(){
			showMessage(chrome.i18n.getMessage("CDC_ADD_FAIL").replace("{0}",chrome.i18n.getMessage("CDC_DOWNLOAD_TAKEASY_LABEL")),true,dl_url);	
		});;	
	

}
			
chrome.windows.onRemoved.addListener(function(windowId){
	//logout only when all windows closed
	chrome.windows.getAll( function(windows){
		if(windows.length<=0)
		{
			logout_by_value(false,glob_url,glob_sid);
			// save logged out status
			setPluginStatus(glob_adc_status,1); 
			setPluginStatus(glob_takeasy_status,2); 
			setPluginStatus(glob_overall_status,3); 
		}
	}); 

}); 

chrome.storage.local.get(['adc_status','takeasy_status','overall_status'], function(items) {
	if(items.adc_status)
		glob_adc_status	 = items.adc_status;
	else
		glob_adc_status = "normal";
		
	if(items.takeasy_status)
		glob_takeasy_status	 = items.takeasy_status;
	else
		glob_takeasy_status = "normal";

	if(items.overall_status)
		glob_overall_status	 = items.overall_status;
	else
		glob_overall_status = "normal";		
		
	//login first
	if(glob_overall_status == "normal")
		login();
	else
		glob_overall_status_info = chrome.i18n.getMessage('CDC_NOT_LOGGED');		
		
});
 
//type=1 adc, type=2 takeasy, type=3 overall 
function setPluginStatus(status,type){
	switch(type){
		case 1:
			glob_adc_status = status;
			chrome.storage.local.set({'adc_status': status}, function() {
			});  			
		break;
		case 2:
			glob_takeasy_status = status;
			chrome.storage.local.set({'takeasy_status': status}, function() {
			});  			
		break;
		case 3:
			glob_overall_status = status;
			chrome.storage.local.set({'overall_status': status}, function() {
			});  			
		break;		
	}

}
 
// listen 從 content scripts 傳來的 requests
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

	if(request.purpose == 'closeAdvance')
	{
		chrome.tabs.getSelected(null, function(tab){
			chrome.tabs.sendRequest(tab.id, {purpose: 'closeAdvance'}, function(response) {});
		} );
			
	}
    else if (request.purpose == 'getDlUrl') {
		
	  sendResponse({dl_url: glob_dl_url}); 

    }	
    else if (request.purpose == 'saveSetting') {
	
	  chrome.storage.local.set({'userID': request.userID,'Host': request.Host,'Password': request.Password,'Port': request.Port,'Protocol': request.Protocol}, function() {
		// Notify that we saved.
			glob_firstTime = false;
			glob_logining = false;
			login(function(){
				chrome.runtime.sendMessage({purpose: 'settingMessage',header: chrome.i18n.getMessage("CDC_SETTING_SAVED"),message: chrome.i18n.getMessage("CDC_SETTING_SAVED_INFO") })
			});
	  });  

    }
	else if(request.purpose == 'getSetting') {
	  chrome.storage.local.get(['userID','Password','Host','Port','Protocol'], function(items) {
		//if is first time use
		if(typeof items.userID != "undefined")
			glob_firstTime = false;
		else
			errorIcon();
		// Notify that we saved.
			chrome.runtime.sendMessage({purpose: 'getSettingResult',userID: items.userID,Password: items.Password,Host: items.Host,Port:items.Port,Protocol: items.Protocol});  
		});  
	}
	else if(request.purpose == 'getVideoFormat') {
		addNewTaskTakeasyStep1(request.dl_url,true);
	}
	else if(request.purpose == 'addVideoTask') {
		addNewTaskTakeasyStep2(request.format,request.dl_url);
	}	
	else if(request.purpose == 'addInstantVideoTask') {
		addNewInstantTakeasyTask(request.dl_url);
	}
	else if(request.purpose == 'addAdcTask') {
		addNewTask(request.dl_url,false,request.username,request.password);
	}		
	else if(request.purpose == 'addVideoTaskPlaylist') {
		addNewTaskTakeasyStep2Playlist(request.type,request.dl_url,true);
	}		
	else if(request.purpose == 'getTakeasyStatus') {
		chrome.tabs.getSelected(null, function(tab){
			chrome.tabs.sendRequest(tab.id, {purpose: 'getTakeasyStatusResult',status: glob_takeasy_status}, function(response) {});
		} );
	}		
    else {
        //sendResponse({}); // clean request
    }
});