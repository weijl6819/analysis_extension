

//google analytics
/*
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-44539865-1']);
_gaq.push(['_trackPageview']);
*/
//unblock flag
var unblocked = false;
var unblocked_adc = false;
var unblocked_takeasy = false;
//counter to retry login
var retrycounter=0;
/*
(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
*/
function trackButton(name) {
    //_gaq.push(['_trackEvent', name, 'clicked']);
  };


//a function to check if a event is already bound to objects
$.fn.isBound = function(type) {
    var data = this.data('events')[type];

    if (data === undefined || data.length === 0) {
        return false;
    }

};

//popover callback function to bind addTask event
var tmp = $.fn.popover.Constructor.prototype.show;
$.fn.popover.Constructor.prototype.show = function () { tmp.call(this); if (this.options.callback) { this.options.callback(); } }

function addTaskCallBack()
{
	trackButton("Add Task popup");
	$('#addTaskSubmit').click(function(){ 
		if($("#taskUrl").val())
		{
			backgroundPage.addNewTask($("#taskUrl").val());
			trackButton("Add Task popup Submit");
		}
		resumeAddTask();
		
	});
	 $('body').block({ message: null}); 
	 $('.blockOverlay').click(resumeAddTask);
}

function addTaskCallBackTakeasy()
{
	trackButton("Add Task Takeasy popup");
	$('#addTaskSubmitTakeasy').click(function(){ 
		if($("#taskUrlTakeasy").val())
		{
			backgroundPage.addNewTaskTakeasyStep1($("#taskUrlTakeasy").val());
			trackButton("Add Task Takeasy popup Submit");
			$('#takeasyLoader').show();
		}
		else
			resumeAddTaskTakeasy();
		
	});
	 $('body').block({ message: null}); 
	 $('.blockOverlay').click(resumeAddTaskTakeasy);
}


function logout(){
	
}

//actions to resume from add Task
function resumeAddTask (){
	$("#addButton").popover('hide');
	$('body').unblock();
}
function resumeAddTaskTakeasy (){
	$("#addButtonTakeasy").popover('hide');
	$('body').unblock();
}

//domain
var backgroundPage;

var addTaskHtml = '<input id="taskUrl" placeholder="'+chrome.i18n.getMessage('CDC_URL_NOTIFY')+'"></input><br/><br/><a class="btn myBtn"  name="Add" id="addTaskSubmit"  href="#">'+chrome.i18n.getMessage('CDC_ADD')+'</a>';			
var addTaskHtmlTakeasy = '<input id="taskUrlTakeasy" placeholder="'+chrome.i18n.getMessage('CDC_URL_NOTIFY')+'"></input><br/><br/><a class="btn myBtn"  name="Add" id="addTaskSubmitTakeasy"  href="#">'+chrome.i18n.getMessage('CDC_ADD')+'</a><img style="display:none;" id="takeasyLoader" src="images/loader.gif"/>';
var addTaskHtmlTakeasy2 = '<span>'+chrome.i18n.getMessage('CDC_QUALITY')+':</span><select style="top: 3px;position:relative;float:left;" id="takeasyFormatSelection"></select><br/><br/><a class="btn myBtn"  name="Download" id="downloadTaskSubmitTakeasy"  href="#">'+chrome.i18n.getMessage('CDC_DOWNLOAD')+'</a>';
var addTaskHtmlTakeasy3 = '<div style="width:400px;"><input type="radio" checked value="single" name="typeSelect"></input>&nbsp;'+chrome.i18n.getMessage('CDC_DOWNLOAD_SINGLE_VIDEO')+'<br/><br/><input type="radio" value="playlist" name="typeSelect"></input>&nbsp;'+chrome.i18n.getMessage('CDC_DOWNLOAD_PLAYLIST')+'<br/><br/><a class="btn myBtn"  name="Download" id="downloadTaskSubmitTakeasy" >'+chrome.i18n.getMessage('CDC_DOWNLOAD')+'</a></div>';
				
//progress bar for different situation
var progressClass = {
	Finished: "progress progress-success",
	Seeding: "progress progress-success progress-striped active",
	Downloading: "progress progress-striped active",
	Stopped: "progress progress-striped",
	Stop: "progress progress-striped",
	Deleting: "progress progress-striped progress-danger active",
	Error: "progress progress-danger ",
	Queue: "progress",
	Queued: "progress"
};
var progressClassTakeasy = {
	3: "progress progress-success",
	1: "progress progress-striped active",
	2: "progress progress-striped",
	0: "progress progress-danger ",
	4: "progress progress-danger ",
	5: "progress progress-danger "
};

var statusCodeTakeasy = {
	4: "Error",
	3: "Finished",
	1: "Downloading",
	2: "Stopped",
	0: "Waiting"
};

//to manage tabs
var TabManager = {

    openSettingTab: function() {
    chrome.tabs.create({url : 'setting.html'});
	backgroundPage.glob_tabopened = true;
  } ,
  
  openDownloadTab: function(url) {
    chrome.tabs.create({url : url});
  }
};



// remove download item
function removeTask(id,mode,type) {
	
	var action;
	if(type == "BT")
		action="torrent-remove";
	else
		action="download-delete";  	

	//console.info(backgroundPage.glob_url+"apps/download-center/btdlm.cgi?act="+action+"&sid="+backgroundPage.sidManager.sid);
	//alert(id);
	$.ajax({
		type: "POST",
		url: backgroundPage.glob_url+"apps/download-center/btdlm.cgi?act="+action+"&sid="+backgroundPage.sidManager.sid,
		data: {id: id,mode: mode},
		dataType: "json"
		}).done(function(data) {
			console.info(data);
			
			if(data.success)
			{
				getDownloadCenterList();
				//$(".myWell[myId='"+id+"']").slideUp("normal",function(){$(this).remove();});
			}
			else
			{
				backgroundPage.showMessage(chrome.i18n.getMessage('CDC_FAILED'));
			}
		});

}
function removeTaskTakeasy(id,mode) {

	$.ajax({
		type: "POST",
		url: backgroundPage.glob_url+"apps/takeasy/video_downloader.cgi?act=remove_download&sid="+backgroundPage.sidManager.sid,
		data: {cid: id,remove_way: mode},
		dataType: "json"
		}).done(function(data) {
			
			if(data.success)
			{
				getTakeasyList();
				//$(".myWell[myId='"+id+"']").slideUp("normal",function(){$(this).remove();});
			}
			else
			{
				backgroundPage.showMessage(chrome.i18n.getMessage('CDC_FAILED'));
			}
		});

}

function resumeTask(id,type){

	var action;
	if(type == "BT")
		action="torrent-start";
	else
		action="download-start";  	

	$.ajax({
		type: "POST",
		url: backgroundPage.glob_url+"/apps/download-center/btdlm.cgi?act="+action+"&sid="+backgroundPage.sidManager.sid,
		data: {id: id},
		dataType: "json"
		}).done(function(data) {
			//console.info(data);
			
			if(data.success)
			{
				getDownloadCenterList();
			}
			
		});
}
function resumeTaskTakeasy(id) {

	$.ajax({
		type: "POST",
		url: backgroundPage.glob_url+"apps/takeasy/video_downloader.cgi?act=start_download&sid="+backgroundPage.sidManager.sid,
		data: {cid: id,list_type: 0},
		dataType: "json"
		}).done(function(data) {
			
			if(data.success)
			{
				getTakeasyList();
				//$(".myWell[myId='"+id+"']").slideUp("normal",function(){$(this).remove();});
			}
			else
			{
				backgroundPage.showMessage(chrome.i18n.getMessage('CDC_FAILED'));
			}
		});

}

function pauseTask(id,type){

	var action;
	if(type == "BT")
		action="torrent-stop";
	else
		action="download-stop";  			
		
	$.ajax({
		type: "POST",
		url: backgroundPage.glob_url+"/apps/download-center/btdlm.cgi?act="+action+"&sid="+backgroundPage.sidManager.sid,
		data: {id:id},
		dataType: "json"
		}).done(function(data) {
			//console.info(data);
			
			if(data.success)
			{
				getDownloadCenterList();
			}
			
		});
}
function pauseTaskTakeasy(id) {

	$.ajax({
		type: "POST",
		url: backgroundPage.glob_url+"apps/takeasy/video_downloader.cgi?act=stop_download&sid="+backgroundPage.sidManager.sid,
		data: {cid: id,list_type: 0},
		dataType: "json"
		}).done(function(data) {
			
			if(data.success)
			{
				getTakeasyList();
				//$(".myWell[myId='"+id+"']").slideUp("normal",function(){$(this).remove();});
			}
			else
			{
				backgroundPage.showMessage(chrome.i18n.getMessage('CDC_FAILED'));
			}
		});
}

function retryTaskTakeasy(id) {

	$.ajax({
		type: "POST",
		url: backgroundPage.glob_url+"apps/takeasy/video_downloader.cgi?act=start_download&sid="+backgroundPage.sidManager.sid,
		data: {cid: id,list_type: 2},
		dataType: "json"
		}).done(function(data) {
			
			if(data.success)
			{
				getTakeasyList();
				//$(".myWell[myId='"+id+"']").slideUp("normal",function(){$(this).remove();});
			}
			else
			{
				backgroundPage.showMessage(chrome.i18n.getMessage('CDC_FAILED'));
			}
		});

}

function createIcon(type)
{
	var icon; 
	switch(type)
	{
		case "download":
		  icon = $("<i>",{class: "iconButton myIcon-s-pc",title: chrome.i18n.getMessage("CDC_DOWNLOAD_PC")});
		  break;
		case "remove":
		  icon = $("<i>",{class: "iconButton myIcon-s-remove",title: chrome.i18n.getMessage("CDC_DELETE")});
		  break;
		case "play":
		  icon = $("<i>",{class: "iconButton myIcon-s-play",title: chrome.i18n.getMessage("CDC_RESUME")});
		  break;
		case "pause":
		  icon = $("<i>",{class: "iconButton myIcon-s-pause",title: chrome.i18n.getMessage("CDC_PAUSE")});
		  break;
		case "watch":
		  icon = $("<i>",{class: "iconButton myIcon-s-watch",title: chrome.i18n.getMessage("CDC_WATCH")});
		  break;	
		case "retry":
		  icon = $("<i>",{class: "iconButton myIcon-s-retry",title: chrome.i18n.getMessage("CDC_RETRY")});
		  break;			  
		default:
		  icon = false;
	}
	return icon
}

function createIconButtons(status)
{
	var iconButtons;
	switch(status)
	{
		case "Finished":
		  iconButtons = $("<div>",{class: "buttonDivInner"})
							.append(createIcon("download"))
							.append(createIcon("remove"))
							.append(createIcon("play"));
		  break;
		case "Seeding":
		  iconButtons = $("<div>",{class: "buttonDivInner"})
							.append(createIcon("download"))
							.append(createIcon("remove"))
							.append(createIcon("pause"));
		  break;
		case "Downloading":
		  iconButtons = $("<div>",{class: "buttonDivInner"})
							.append(createIcon("remove"))
							.append(createIcon("pause"));
		  break;
		case "Stopped":
		  iconButtons = $("<div>",{class: "buttonDivInner"})
							.append(createIcon("remove"))
							.append(createIcon("play"));
		  break;
		case "Stop":
		  iconButtons = $("<div>",{class: "buttonDivInner"})
							.append(createIcon("remove"))
							.append(createIcon("play"));
		  break;		
		case "Deleting":
		  iconButtons = $("<div>",{class: "buttonDivInner"});
		  break;
		case "Error":
		  iconButtons = $("<div>",{class: "buttonDivInner"})
							.append(createIcon("remove"));
		  break;
		case "Queue":
		  iconButtons = $("<div>",{class: "buttonDivInner"})
							.append(createIcon("remove"))
							.append(createIcon("pause"));
		  break;	
		case "Queued":
		  iconButtons = $("<div>",{class: "buttonDivInner"})
							.append(createIcon("remove"))
							.append(createIcon("pause"));
		  break;		  
		default:
		  iconButtons=false;
	}	
	return iconButtons;
}

function createTakeasyIconButtons(status,video_exist)
{

	var iconButtons;
	switch(status)
	{
		case 3:
		if(video_exist)
		{
		  iconButtons = $("<div>",{class: "buttonDivInner"})
							.append(createIcon("watch"))
							.append(createIcon("download"))
							.append(createIcon("remove"));
		}
		else
		{
		  iconButtons = $("<div>",{class: "buttonDivInner"})
							.append(createIcon("watch"))
							.append(createIcon("retry"))
							.append(createIcon("remove"));
		}
		  break;
		case 1:
		  iconButtons = $("<div>",{class: "buttonDivInner"})
							.append(createIcon("watch"))
							.append(createIcon("pause"))
							.append(createIcon("remove"));
		  break;
		case 2:
		  iconButtons = $("<div>",{class: "buttonDivInner"})
							.append(createIcon("watch"))
							.append(createIcon("play"))
							.append(createIcon("remove"));
		  break;	 
		case 4:
		  iconButtons = $("<div>",{class: "buttonDivInner"})
							.append(createIcon("watch"))
							.append(createIcon("retry"))
							.append(createIcon("remove"));
		  break;			  
		default:
		  iconButtons = $("<div>",{class: "buttonDivInner"})
							.append(createIcon("watch"))
							.append(createIcon("remove"));
	}	
	return iconButtons;
}

function createDeleteBtn(type)
{
	var icon; 
	switch(type)
	{
		case "cancel":
		  icon = $("<button>",{class: "btn btn-small",name: "cancel", text: chrome.i18n.getMessage("CDC_CANCEL")});
		  break;
		case "remove":
		  icon = $("<button>",{class: "btn btn-small btn-warning",name: "remove", title: chrome.i18n.getMessage("CDC_DELETE_TASK"), text: chrome.i18n.getMessage("CDC_REMOVE")});
		  break;
		case "delete":
		  icon = $("<button>",{class: "btn btn-small btn-danger",name: "delete", title: chrome.i18n.getMessage("CDC_DELETE_TASK_DATA"), text: chrome.i18n.getMessage("CDC_DELETE")});
		  break;			  
		default:
		  icon = false;
	}
	return icon
}

function createdeleteGroup(status)
{
 
	var iconButtons;
	switch(status)
	{
		case "Finished":
		  iconButtons = $("<div>",{class: "btn-group"})
							.append(createDeleteBtn("cancel"))
							.append(createDeleteBtn("remove"))
							.append(createDeleteBtn("delete"));
		  break;
		case "Seeding":
		  iconButtons = $("<div>",{class: "btn-group"})
							.append(createDeleteBtn("cancel"))
							.append(createDeleteBtn("remove"))
							.append(createDeleteBtn("delete"));
		  break;
		case "Downloading":
		  iconButtons = $("<div>",{class: "btn-group"})
							.append(createDeleteBtn("cancel"))
							.append(createDeleteBtn("delete"));
		  break;
		case "Stopped":
		  iconButtons = $("<div>",{class: "btn-group"})
							.append(createDeleteBtn("cancel"))
							.append(createDeleteBtn("delete"));
		  break;
		case "Stop":
		  iconButtons = $("<div>",{class: "btn-group"})
							.append(createDeleteBtn("cancel"))
							.append(createDeleteBtn("delete"));
		  break;		
		case "Deleting":
		  iconButtons = $("<div>",{class: "btn-group"});
		  break;
		case "Error":
		  iconButtons = $("<div>",{class: "btn-group"})
							.append(createDeleteBtn("cancel"))
							.append(createDeleteBtn("delete"));							
		  break;
		case "Queue":
		  iconButtons = $("<div>",{class: "btn-group"})
							.append(createDeleteBtn("cancel"))
							.append(createDeleteBtn("delete"));
		  break;	
		case "Queued":
		  iconButtons = $("<div>",{class: "btn-group"})
							.append(createDeleteBtn("cancel"))
							.append(createDeleteBtn("delete"));
		  break;		  
		default:
		  iconButtons=false;
	}	
	return iconButtons;
}


function createTakeasyDeleteGroup(status,video_exist)
{
 
	var iconButtons;
	switch(status)
	{
		case 3:
		if(video_exist)
		{
		  iconButtons = $("<div>",{class: "btn-group"})
							.append(createDeleteBtn("cancel"))
							.append(createDeleteBtn("remove"))
							.append(createDeleteBtn("delete"));
		}
		else
		{
		  iconButtons = $("<div>",{class: "btn-group"})
							.append(createDeleteBtn("cancel"))
							.append(createDeleteBtn("remove"));
		}
		  break;
		case 0:
		  iconButtons = $("<div>",{class: "btn-group"})
							.append(createDeleteBtn("cancel"))
							.append(createDeleteBtn("remove"));
		  break;		  
		default:
		  iconButtons = $("<div>",{class: "btn-group"})
							.append(createDeleteBtn("cancel"))
							.append(createDeleteBtn("remove"));
		  break;
	}	
	return iconButtons;
}


//create a new well
function createWell(data)
{
	 
	var buttons = createIconButtons(data.status);
	var deleteGroup = createdeleteGroup(data.status);
	var taskDiv = $("<div>",{class: "task-div"})
					.append($("<table>")
						.append($("<tr>")
							.append($("<td>")
								.append($("<div>",{class:progressClass[data.status]+" wellClass" ,title: chrome.i18n.getMessage("CDC_DOWNLOAD")+": "+data.download+", "+chrome.i18n.getMessage("CDC_UPLOAD")+": "+data.upload })
									.append($("<div>",{class: "bar"}).css("width",data.percent))
								)
							)
							.append($("<td>"))
						)
					)
					.append($("<span>", {class:"status-span"})
						.append($("<span>", {class:"type-text wellType", text: data.type}))
						.append(" - ")
						.append($("<span>", {class:"wellSize", text: data.size}))
						.append(" - ")
						.append($("<span>", {class:"status-text wellStatus", text: data.status}))
					)
					.append($("<span>", {class:"buttonDiv"})
						.append($(buttons))
					)
					.append($("<span>", {class:"delete-span"})
						.append($(deleteGroup))
					);
	var wellItem = $("<div>", { class: "myWell", id : data.id+'-'+data.type, myId : data.id, type : data.type, status:data.status })
					.append($("<h3>")
						.append($("<span>", { class: "item-title", place : "top", title : data.name , text : data.name}))
					)
					.append($(taskDiv));	
	
	return wellItem;
}

//create a new takeasy well
function createTakeasyWell(data)
{
	var video_exist = data.video_exist;	 
	var buttons = createTakeasyIconButtons(data.state,video_exist);
	var deleteGroup = createTakeasyDeleteGroup(data.state,video_exist);
	var progress = data.progress;
	var progressBar;
	var progressTooltip;
	if(!video_exist  && data.state==3)
	{
		progressBar = progressClassTakeasy[0];
		progressTooltip = chrome.i18n.getMessage("CDC_FILE_NOT_EXIST");
	}
	else
	{
		progressBar = progressClassTakeasy[data.state];
		progressTooltip = chrome.i18n.getMessage("CDC_SPEED")+": "+convertSize(data.speed);
	}
	
	var video_path = data.video_path;
	var Fst = video_path.indexOf("\/");  
	var Snd = video_path.indexOf("\/", Fst+1);
	video_path = video_path.substring(Snd);
	if(data.state == 3 || data.state == 4)
		progress = 100;
	var taskDiv = $("<div>",{class: "task-div"})
					.append($("<table>")
						.append($("<tr>")
							.append($("<td>")
								.append($("<div>",{class:progressBar+" wellClass" ,title: progressTooltip })
									.append($("<div>",{class: "bar"}).css("width",progress+'%'))
								)
							)
							.append($("<td>"))
						)
					)
					.append($("<span>", {class:"status-span"})
						.append($("<span>", {class:"type-text wellType", text: addMiusMinus(data.provider)}))
						.append(" &nbsp;")
						.append($("<span>", {class:"wellSize", text: convertSize(data.size)}))
						.append(" &nbsp;")
						.append($("<span>", {class:"status-text wellStatus",state: data.state, text: statusCodeTakeasy[data.state]}))
					)
					.append($("<span>", {class:"buttonDiv"})
						.append($(buttons))
					)
					.append($("<span>", {class:"delete-span"})
						.append($(deleteGroup))
					);
	var wellItem = $("<div>", { class: "myWell", sourceUrl: data.url, itemTitle: data.title, path: video_path ,id : 'takeasy'+'-'+data.cid, myId : data.cid, type : addMiusMinus(data.provider), status:data.state })
					.append($("<h3>")
						.append($("<span>", { class: "item-title", place : "top", title : addMiusMinus(data.title) , text : addMiusMinus(data.title)}))
					)
					.append($(taskDiv));	
	
	return wellItem;
}

//get download center List
function getDownloadCenterList ()
{
	var completeNum=0;
	var RunningNum=0;
		
	//console.info(url+"/apps/download-center/btdlm.cgi?act=torrent-list&sid="+mySid);
	$.ajax({
		type: "POST",
		url: backgroundPage.glob_url+"apps/download-center/btdlm.cgi?act=torrent-list&sid="+backgroundPage.sidManager.sid,
		data: {sortby: "position",orderby: "asc"},
		dataType: "json"
		}).done(function(data) {
			
			if(data.success)
			{
				//set flag to confirm if an item still exists
				$("#adcPanel .item-container>div.myWell").attr("notExist","true");
				
				//$(".item-container").html("");
				var length = data.files.length;
				if(length == 0)
				{
					$('#adcPanel .noTask').show();
					$('#adcPanel .item-block').hide();
				}
				else
				{
					$('#adcPanel .noTask').hide();
					$('#adcPanel .item-block').show();
				}
				
				for(key =0 ; key < length; key++){
					var wellItem = $("#"+data.files[key].id+"-"+data.files[key].type.replace("/", "\\/"));
					//if already exist, update
					if($(wellItem).length > 0  )
					{
						//if status not change 
						if($(wellItem).find("span.wellStatus").eq(0).html() == data.files[key].status)
						{
							
							$(wellItem).removeAttr("notExist");
							$(wellItem).find("span.item-title").text(data.files[key].name);
							$(wellItem).find("span.item-title").attr("title",data.files[key].name);
							$(wellItem).find("div.bar").eq(0).css("width",data.files[key].percent+"%");
							$(wellItem).find("span.wellSize").eq(0).text(data.files[key].size);
							$(wellItem).find("div.wellClass").attr("title",chrome.i18n.getMessage('CDC_DOWNLOAD')+": "+data.files[key].download+", "+chrome.i18n.getMessage('CDC_UPLOAD')+": "+data.files[key].upload);
							
						}
						//if status changed
						else
						{
							$(wellItem).hide();
							$(wellItem).after($(createWell(data.files[key])));
							$(wellItem).remove();
						}
					}
					else
					{
						$("#adcPanel .item-container").append($(createWell(data.files[key])));								
					}
					
					//count job number
					if(data.files[key].status == "Finished" || data.files[key].status == "Seeding")
						{completeNum++;}
					else if(data.files[key].status == "Downloading")
						RunningNum++;

				}
				
				//delete not exist items
				$(".myWell[notExist]:visible").each(function(){
					$(this).addClass('notShow');
					var deleteItem = $(this);
					window.setTimeout(function(){$(deleteItem).remove();}, 300);
				});			
				$(".myWell[notExist]:hidden").each(function(){
					$(this).remove();
				});		
				
				//remove unnecessary buttons
				$("#adcPanel .item-container .myWell[type='HTTP/FTP'][status='Finished']").each(function(){
					$(this).find(".myIcon-s-play").remove();
				});
				
				//set status for each situation
				//if no downloading job
				if(RunningNum > 0) 
				{
					if(!backgroundPage.keep_switching_icon)
						backgroundPage.restartIcon();
					//chrome.browserAction.setBadgeText({text:completeNum.toString()});
				}
				else
				{
					backgroundPage.stopIcon() ;
					//chrome.browserAction.setBadgeText({text:completeNum.toString()});				
				}
				
				//button event setup
 				setButtonEvents();
				removeOverlayAdc();
			}
			//failed
			else
			{
				backgroundPage.exceptionHandler(data.error_code);
				//removeOverlay();
			}
			//set total speed
			$('#downloadSpeedDiv').text("");
			$('#downloadSpeedDiv').text(data.total_download_speed);
			$('#uploadSpeedDiv').text("");
			$('#uploadSpeedDiv').text(data.total_upload_speed);
			
		}).error(function(){
		//console.info(4);
			//relogin only when error too many times
			retrycounter++;
			if(retrycounter >= 6)
			{
				backgroundPage.login();
				retrycounter=0;
			}
			
		});
}

function convertSize(size) {
    if(!size) {
        return '--';
    }
    var sizeNames = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    var i = Math.floor(Math.log(size)/Math.log(1024));
    var p = (i > 1) ? 2 : 0;
    return (size/Math.pow(1024, Math.floor(i))).toFixed(p) + sizeNames[i];
}

function addMiusMinus(str){
	if(!str) {
        return '--';
    }
	else
		return str;
}

//get takeasy List
function getTakeasyList ()
{
	var completeNum=0;
	var RunningNum=0;
		
	//console.info(url+"/apps/download-center/btdlm.cgi?act=torrent-list&sid="+mySid);
	$.ajax({
		type: "POST",
		url: backgroundPage.glob_url+"apps/takeasy/video_downloader.cgi?act=list_download&sid="+backgroundPage.sidManager.sid,
		data: {sortby: "position",orderby: "asc"},
		dataType: "json"
		}).done(function(data) {
			
			if(data.success)
			{
				//set flag to confirm if an item still exists
				$("#takeasyPanel .item-container>div.myWell").attr("notExist","true");
				
				//$(".item-container").html("");
				var length = data.items.length;
				if(length == 0)
				{
					$('#takeasyPanel .noTask').show();
					$('#takeasyPanel .item-block').hide();
				}
				else
				{
					$('#takeasyPanel .noTask').hide();
					$('#takeasyPanel .item-block').show();
				}
				
				for(key =0 ; key < length; key++){
					var wellItem = $("#takeasy-"+data.items[key].cid);
					//if already exist, update
					if($(wellItem).length > 0  )
					{
						//if status not change 
						if($(wellItem).find("span.wellStatus").eq(0).attr('state') == data.items[key].state)
						{
							
							$(wellItem).removeAttr("notExist");
							if(!data.items[key].title)
								data.items[key].title == '--'
							$(wellItem).find("span.item-title").text(data.items[key].title);
							$(wellItem).find("span.item-title").attr("title",data.items[key].title);
							$(wellItem).find("span.item-title").attr("title",data.items[key].title);
							$(wellItem).find(".wellType").text(data.items[key].provider);
							
							var progress= data.items[key].progress;
							if(data.items[key].state == 3 || data.items[key].state == 4)
								progress = '100';
							
							$(wellItem).find("div.bar").eq(0).css("width",progress+"%");
							if(data.items[key].size)
								$(wellItem).find("span.wellSize").eq(0).text(convertSize(data.items[key].size));
							else
								$(wellItem).find("span.wellSize").eq(0).text('--');
							//$(wellItem).find("div.wellClass").attr("title",chrome.i18n.getMessage('CDC_DOWNLOAD')+": "+data.items[key].download+", "+chrome.i18n.getMessage('CDC_UPLOAD')+": "+data.files[key].upload);
							
						}
						//if status changed
						else
						{
							$(wellItem).hide();
							$(wellItem).after($(createTakeasyWell(data.items[key])));
							$(wellItem).remove();
						}
					}
					else
					{
						$("#takeasyPanel .item-container").append($(createTakeasyWell(data.items[key])));								
					}
					
					//count job number
					if(data.items[key].state == 3)
						{completeNum++;}
					else if(data.items[key].state == 1)
						RunningNum++;

				}
				
				//delete not exist items
				$("#takeasyPanel .myWell[notExist]:visible").each(function(){
					$(this).addClass('notShow');
					var deleteItem = $(this);
					window.setTimeout(function(){$(deleteItem).remove();}, 300);
				});			
				$("#takeasyPanel .myWell[notExist]:hidden").each(function(){
					$(this).remove();
				});		
				
				//remove unnecessary buttons
				$("#takeasyPanel .item-container .myWell[status='3']").each(function(){
					$(this).find(".myIcon-s-play").remove();
				});
				
				//set status for each situation
				//if no downloading job
				if(RunningNum > 0) 
				{
					if(!backgroundPage.keep_switching_icon)
						backgroundPage.restartIcon();
					//chrome.browserAction.setBadgeText({text:completeNum.toString()});
				}
				else
				{
					backgroundPage.stopIcon() ;
					//chrome.browserAction.setBadgeText({text:completeNum.toString()});				
				}
				
				//button event setup
 				setButtonEventsTakeasy();
				removeOverlayTakeasy();
			}
			//failed
			else
			{
				backgroundPage.exceptionHandler(data.error_code);
				//removeOverlayTakeasy();
			}
			
		}).error(function(){
		//console.info(4);
			//relogin only when relogin too many times
			retrycounter++;
			if(retrycounter >= 6)
			{
				backgroundPage.login();
				retrycounter=0;
			}
			
		});
}

//set button events after refreshing
function setButtonEvents(){

  //confirm deletion event
  $("#adcPanel .buttonDivInner .myIcon-s-remove").each(function(){
		$(this).unbind( "click" ).click(function(){
		trackButton("Remove a Task");
		var myWellItem = $(this).parents(".myWell").eq(0);
		var buttonDiv = $(myWellItem).find(".buttonDiv").eq(0);
		var deleteSpan = $(myWellItem).find(".delete-span").eq(0);
		var statusSpan = $(myWellItem).find(".status-span").eq(0);
		
		//hide all first
		$(".delete-span:visible").each(function(){
			$(this).find("button[name='cancel']").click();
		});
		
		//adjust width
		var deleteSpanWidth = $(deleteSpan).css('width');
		$(statusSpan).css('width',(parseInt($(myWellItem).css('width')) - parseInt(deleteSpanWidth)) - 3 );	
		
		//show & hide
		$(buttonDiv).hide();
		$(deleteSpan).show("blind");

		});
  })
  
  //cancel deletion
  $("#adcPanel .delete-span button[name='cancel']").each(function(){
		$(this).unbind( "click" ).click(function(){
		trackButton("Remove a Task - Cancel");
		var myWellItem = $(this).parents(".myWell").eq(0);
		var buttonDiv = $(myWellItem).find(".buttonDiv").eq(0);
		var deleteSpan = $(myWellItem).find(".delete-span").eq(0);
		var statusSpan = $(myWellItem).find(".status-span").eq(0);
		
		//adjust width
		var buttonDivWidth = $(buttonDiv).css('width');
		

		//show & hide
		$(deleteSpan).hide("blind", function(){
			//restore 
			//$(statusSpan).css('width',"100%");	
			$(statusSpan).css('width',(parseInt($(myWellItem).css('width')) - parseInt(buttonDivWidth))  );		
			$(buttonDiv).show();
		});
		
		});  
  });
				
  //actually delete
  $("#adcPanel .delete-span button[name='delete']").unbind( "click" ).click(function(){
	trackButton("Remove a Task - Delete Task & File");
	var myWellItem = $(this).parents(".myWell").eq(0);
	var id = $(this).parents(".myWell").eq(0).attr("myId");
	removeTask(id,1,$(myWellItem).attr("type"));
  }); 
  
  //remove task
  $("#adcPanel .delete-span button[name='remove']").unbind( "click" ).click(function(){
	trackButton("Remove a Task - Delete Task");
	var myWellItem = $(this).parents(".myWell").eq(0);
	var id = $(this).parents(".myWell").eq(0).attr("myId");
	removeTask(id,0,$(myWellItem).attr("type"));
  });   
  
  //resume
  $("#adcPanel .buttonDivInner .myIcon-s-play").unbind( "click" ).click(function(){
	trackButton("Resume a Task");
	var myWellItem = $(this).parents(".myWell").eq(0);
	var action;

	resumeTask($(this).parents(".myWell").eq(0).attr("myId"),$(myWellItem).attr('type'));
	
  });  
  
   //pause
  $("#adcPanel .buttonDivInner .myIcon-s-pause").unbind( "click" ).click(function(){
	trackButton("Pause a Task");
	var myWellItem = $(this).parents(".myWell").eq(0);
	var action;
	
	pauseTask($(this).parents(".myWell").eq(0).attr("myId"),$(myWellItem).attr('type'));
	
	
  });   
  
   //download
  $("#adcPanel .buttonDivInner .myIcon-s-pc").unbind( "click" ).click(function(){
	trackButton("Download to PC");
	var type = $(this).parents(".myWell").eq(0).attr("type");
	var path = "";
	var task_name = $(this).parents(".myWell").eq(0).find(".item-title").eq(0).text();
	
	$.ajax({
		type: "POST",
		url: backgroundPage.glob_url+"/apps/download-center/btdlm.cgi?act=torrent-info&sid="+backgroundPage.sidManager.sid,
		data: {id: $(this).parents(".myWell").eq(0).attr("myId")},
		dataType: "json"
		}).done(function(data) {
			var files="";
			var total=0;
			
			if(type == "BT")
				path = data.download_dir + "/" ;
			else
				path = backgroundPage.prefManager.default_dl_dir;
				
			files = task_name;
			total = 1;							
				
			//check file exist
			//console.info(backgroundPage.glob_url+"portal/apis/fileExplorer/fileExplorer.cgi?act=check_path&sid="+backgroundPage.sidManager.sid+"&path="+encodeURIComponent(path)+"/"+encodeURIComponent(files));
			$.ajax({
				type: "GET",
				url: backgroundPage.glob_url+"portal/apis/fileExplorer/fileExplorer.cgi?act=check_path&sid="+backgroundPage.sidManager.sid+"&path="+encodeURIComponent(path)+"/"+encodeURIComponent(files),
				data: {},
				dataType: "json"				
				}).done(function(data) {
					
					//TabManager.openDownloadTab(backgroundPage.glob_url+"portal/apis/fileExplorer/download.cgi?act=download&mod_cntype=0&browser=chrome&sid="+backgroundPage.sidManager.sid+"&path="+path+"&file="+files+"&total="+total);
					if(data.success)
					{
						var formID = new Date().getTime();
						var inputs = '';
						inputs+='<input type="hidden" name="act" value="download" />'; 
						inputs+='<input type="hidden" name="mod_cntype" value="0" />'; 
						inputs+='<input type="hidden" name="browser" value="chrome" />'; 
						inputs+='<input type="hidden" name="sid" value="'+backgroundPage.sidManager.sid+'" />'; 
						inputs+='<input type="hidden" name="total" value="'+total+'" />'; 
						// request發送請求
						jQuery('<form style="display:none;" id="'+formID+'" action="'+ backgroundPage.glob_url +'portal/apis/fileExplorer/download.cgi?path='+encodeURIComponent(path)+'&file='+encodeURIComponent(files)+'" method="post">'+inputs+'</form>')
						.appendTo('body').submit().remove();
					}
				});

		});
		
  });   
  
}

//set button events after refreshing
function setButtonEventsTakeasy(){

  //confirm deletion event
  $("#takeasyPanel .buttonDivInner .myIcon-s-remove").each(function(){
		$(this).unbind( "click" ).click(function(){
		trackButton("Remove a Takeasy Task");
		var myWellItem = $(this).parents(".myWell").eq(0);
		var buttonDiv = $(myWellItem).find(".buttonDiv").eq(0);
		var deleteSpan = $(myWellItem).find(".delete-span").eq(0);
		var statusSpan = $(myWellItem).find(".status-span").eq(0);
		
		//hide all first
		$(".delete-span:visible").each(function(){
			$(this).find("button[name='cancel']").click();
		});
		
		//adjust width
		var deleteSpanWidth = $(deleteSpan).css('width');
		$(statusSpan).css('width',(parseInt($(myWellItem).css('width')) - parseInt(deleteSpanWidth))  );	
		
		//show & hide
		$(buttonDiv).hide();
		$(deleteSpan).show("blind");

		});
  })
  
  //cancel deletion
  $("#takeasyPanel .delete-span button[name='cancel']").each(function(){
		$(this).unbind( "click" ).click(function(){
		trackButton("Remove a Takeasy Task - Cancel");
		var myWellItem = $(this).parents(".myWell").eq(0);
		var buttonDiv = $(myWellItem).find(".buttonDiv").eq(0);
		var deleteSpan = $(myWellItem).find(".delete-span").eq(0);
		var statusSpan = $(myWellItem).find(".status-span").eq(0);
		
		//adjust width
		var buttonDivWidth = $(buttonDiv).css('width');
		

		//show & hide
		$(deleteSpan).hide("blind", function(){
			//restore 
			//$(statusSpan).css('width',"100%");	
			$(statusSpan).css('width',(parseInt($(myWellItem).css('width')) - parseInt(buttonDivWidth))  );		
			$(buttonDiv).show();
		});
		
		});  
  });
				
  //actually delete
  $("#takeasyPanel .delete-span button[name='delete']").unbind( "click" ).click(function(){
	trackButton("Remove a Takeasy Task - Delete Task & File");
	var myWellItem = $(this).parents(".myWell").eq(0);
	var id = $(this).parents(".myWell").eq(0).attr("myId");
	if($(myWellItem).attr("itemTitle").length > 0)
		removeTaskTakeasy(id,1);
	else
		removeTaskTakeasy(id,0);
  }); 
  
  //remove task
  $("#takeasyPanel .delete-span button[name='remove']").unbind( "click" ).click(function(){
	trackButton("Remove a Takeasy Task - Delete Task");
	var myWellItem = $(this).parents(".myWell").eq(0);
	var id = $(this).parents(".myWell").eq(0).attr("myId");
	removeTaskTakeasy(id,0);
  });   
  
  //resume
  $("#takeasyPanel .buttonDivInner .myIcon-s-play").unbind( "click" ).click(function(){
	trackButton("Resume a Takeasy Task");
	var myWellItem = $(this).parents(".myWell").eq(0);
	var action;

	resumeTaskTakeasy($(this).parents(".myWell").eq(0).attr("myId"));
	
  });  
  
   //pause
  $("#takeasyPanel .buttonDivInner .myIcon-s-pause").unbind( "click" ).click(function(){
	trackButton("Pause a Takeasy Task");
	var myWellItem = $(this).parents(".myWell").eq(0);
	var action;
	
	pauseTaskTakeasy($(this).parents(".myWell").eq(0).attr("myId"));
	
  });   
  
    //retry
  $("#takeasyPanel .buttonDivInner .myIcon-s-retry").unbind( "click" ).click(function(){
	trackButton("Retry a Takeasy Task");
	var myWellItem = $(this).parents(".myWell").eq(0);
	var action;
	
	retryTaskTakeasy($(this).parents(".myWell").eq(0).attr("myId"));
	
  });    
  
   //watch
  $("#takeasyPanel .buttonDivInner .myIcon-s-watch").unbind( "click" ).click(function(){
	trackButton("Watch a Takeasy Task");
	chrome.tabs.create({url : $(this).parents(".myWell").eq(0).attr("sourceUrl")});
	
  });   
  
   //download
  $("#takeasyPanel .buttonDivInner .myIcon-s-pc").unbind( "click" ).click(function(){
	trackButton("Download Takeasy video to PC");
	var path = $(this).parents(".myWell").eq(0).attr("path");
	var files = $(this).parents(".myWell").eq(0).find(".item-title").eq(0).text() + path.substring(path.lastIndexOf("."));
	path = path.substring(0,path.lastIndexOf("\/"));
	var total=0;
	
	total = 1;							
	console.info(backgroundPage.glob_url+"portal/apis/fileExplorer/fileExplorer.cgi?act=check_path&sid="+backgroundPage.sidManager.sid+"&path="+encodeURIComponent(path)+"/"+encodeURIComponent(files));
	//check file exist
	$.ajax({
		type: "GET",
		url: backgroundPage.glob_url+"portal/apis/fileExplorer/fileExplorer.cgi?act=check_path&sid="+backgroundPage.sidManager.sid+"&path="+encodeURIComponent(path)+"/"+encodeURIComponent(files),
		data: {},
		dataType: "json"				
		}).done(function(data) {
			
			//TabManager.openDownloadTab(backgroundPage.glob_url+"portal/apis/fileExplorer/download.cgi?act=download&mod_cntype=0&browser=chrome&sid="+backgroundPage.sidManager.sid+"&path="+path+"&file="+files+"&total="+total);
			if(data.success)
			{
				var formID = new Date().getTime();
				var inputs = '';
				inputs+='<input type="hidden" name="act" value="download" />'; 
				inputs+='<input type="hidden" name="mod_cntype" value="0" />'; 
				inputs+='<input type="hidden" name="browser" value="chrome" />'; 
				inputs+='<input type="hidden" name="sid" value="'+backgroundPage.sidManager.sid+'" />'; 
				inputs+='<input type="hidden" name="total" value="'+total+'" />'; 
				// request發送請求
				jQuery('<form style="display:none;" id="'+formID+'" action="'+ backgroundPage.glob_url +'portal/apis/fileExplorer/download.cgi?path='+encodeURIComponent(path)+'&file='+encodeURIComponent(files)+'" method="post">'+inputs+'</form>')
				.appendTo('body').submit().remove();
			}
		});
			
	});
				
}

//show different Panel
function sePanelVisibility(mode)
{
	
  var overall_status =backgroundPage.glob_overall_status;

  if(backgroundPage.glob_firstTime)
	mode = "firstTime";
  else if(overall_status == "logout")
  {
	mode = "setting";
	$('.myTab').removeClass('myTab-Current');
	$('.myTab-setting').addClass('myTab-Current');
  }
  else if(backgroundPage.sidManager.sid && !mode)
  {
	mode = $('.myTab-Current').attr('mode');
   }
  $('#logoutButton').show();
	
	// dont refresh setting panel
	if(!mode && $('#settingPanel:visible').size()>0 && $('#aboutPanel:visible').size()>0)
		return;
	
  if(!mode)
	mode = 'adc';
  if(mode == "firstTime")
  {	
		//set Panels
		$('#ReadyDiv').hide();
		$('#NotReadyDiv').show();
		backgroundPage.errorIcon();
		removeOverlay();
  }
  else if(mode == "setting")
  {
		$("#appStatusSpan").text(backgroundPage.glob_overall_status_info); 
		//get setting
		chrome.runtime.sendMessage({purpose: 'getSetting'}, function(response) {
		});
		//set buttons
		$('#connectStatusDiv').text('');
		
		if(overall_status == "normal")
		{
			$('#settingSubmit l').text(chrome.i18n.getMessage('CDC_APPLY'));	
		}
		else
		{
			$('#logoutButton').hide();
			$('#settingSubmit l').text(chrome.i18n.getMessage('CDC_LOGIN'));
		}
		
		$('.speed-container').hide();
		
		//set Panels
		$('#aboutPanel').hide();
		$('#adcPanel').hide();
		$('#adcFailPanel').hide();
		$('.item-column-container').hide();
		$('#settingPanel').show();
		$('#ReadyDiv').show();
		$('#NotReadyDiv').hide();
		$('#successPanel').show();
		removeOverlay();
		
		//set value
		//$('')
  }
  else if(mode == "about")
  {
  
		chrome.runtime.sendMessage({purpose: 'getSetting'}, function(response) {
		});  
		//set Panels
		$('#adcFailPanel').hide();
		$('#adcPanel').hide();
		$('.item-column-container').hide();
		$('#aboutPanel').show();
		$('#settingPanel').hide();
		$('#ReadyDiv').show();
		$('#NotReadyDiv').hide();
		$('#successPanel').show();
		removeOverlay();
		
		//set value
		//$('')
  }  
	//adc mode  
   else if(mode == 'adc')
   {
		if(!unblocked_adc )
			addOverlay();
		// fail
		if((!backgroundPage.sidManager.sid || backgroundPage.glob_adc_status !="enabled"))
		{
			$(".adcLink").attr("href",backgroundPage.glob_url+"portal/index.cgi?openApp=user-download-center&sid="+backgroundPage.sidManager.sid);
			//set buttons
			$('#resumeAllButton').hide();
			$('#pauseAllButton').hide();
			$('#clearAllButton').hide();
			$('#addButton').hide();
			$('.speed-container').hide();
			
			var showPanel = 'adcFailPanel';
			
			//set message
			if(!backgroundPage.sidManager.sid)
			{}
			else if(backgroundPage.glob_adc_status =="disabled")
				showPanel = 'adcNotInstallPanel';
			else if(backgroundPage.glob_adc_status =="no-permission")
				showPanel = 'adcNoPermissionPanel';				
			else 
			{
				showPanel = 'adcNotInstallPanel';
			}
			
			//set Panels
			$('#successPanel').hide();
			$('#settingPanel').hide();
			$('#aboutPanel').hide();
			$('.item-column-container').hide();
			$('#'+showPanel).show();
			$('#adcPanel').hide();
			$('#ReadyDiv').show();
			$('#NotReadyDiv').hide();		
			removeOverlayAdc();
		}
	  else
		{
			//set buttons
			$('#resumeAllButton').show();
			$('#pauseAllButton').show();
			$('#clearAllButton').show();
			$('#addButton').show();
			$('.speed-container').show();
			
			//set Panels   
			$('#adcFailPanel').hide();
			$('#settingPanel').hide();
			$('#aboutPanel').hide();
			$('.item-column-container').hide();
			$('#successPanel').show();
			$('#adcPanel').show();
			$('#ReadyDiv').show();
			$('#NotReadyDiv').hide();		
			getDownloadCenterList();
		}
	}
	//takeasy mode
   else if(mode == 'takeasy')
   {
		if(!unblocked_takeasy )
			addOverlay();
		// fail
		if((!backgroundPage.sidManager.sid || backgroundPage.glob_takeasy_status !="enabled"))
		{

			$(".takeasyLink").attr("href",backgroundPage.glob_url+"portal/index.cgi?openApp=user-takeasy&sid="+backgroundPage.sidManager.sid);
			//set buttons
			$('#resumeAllButtonTakeasy').hide();
			$('#pauseAllButtonTakeasy').hide();
			$('#clearAllButtonTakeasy').hide();
			$('#addButtonTakeasy').hide();
			$('.speed-container').hide();
			
			var showPanel = 'takeasyFailPanel';
			
			//set message
			if(!backgroundPage.sidManager.sid)
			{}
			else if(backgroundPage.glob_takeasy_status =="disabled")
				showPanel = 'takeasyNotInstallPanel';
			else if(backgroundPage.glob_takeasy_status =="no-permission")
				showPanel = 'takeasyNoPermissionPanel';				
			else 
			{
				showPanel = 'takeasyNotInstallPanel';
			}
			
			//set Panels
			$('#successPanel').hide();
			$('.item-column-container').hide();
			$('#'+showPanel).show();
			$('#ReadyDiv').show();
			$('#NotReadyDiv').hide();		
			removeOverlayTakeasy();
		}
	  else
		{
			//set buttons
			$('#resumeAllButtonTakeasy').show();
			$('#pauseAllButtonTakeasy').show();
			$('#clearAllButtonTakeasy').show();
			$('#addButtonTakeasy').show();
			$('.speed-container').show();
			
			//set Panels   
			$('.item-column-container').hide();
			$('#successPanel').show();
			$('#takeasyPanel').show();
			$('#ReadyDiv').show();
			$('#NotReadyDiv').hide();		
			getTakeasyList();
		}
	}	
}

// listen 從 backgrounds scripts 傳來的 requests
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.purpose == 'settingMessage') {
		$("#appStatusSpan").text(backgroundPage.glob_overall_status_info); 

    }
    else if (request.purpose == 'sePanelVisibility') {
	  sePanelVisibility();
    }	
    else if (request.purpose == 'reloadList') {
	  getDownloadCenterList();
    }		
	else if(request.purpose == 'errorMessage') {
		 //showMessage(request.header,request.message);
	}
	else if(request.purpose == 'getSettingResult') {
		
		$("#userID").val(request.userID);
		$("#Host").val(request.Host);
		$("#Password").val(request.Password);
		
		if(request.Protocol== "http")
			$("input[name=Protocol][value=http]").attr("checked","true");
		else
			$("input[name=Protocol][value=https]").attr("checked","true");
		$("#Port").val(request.Port);
		if($("#Port").val() =="")
			$("#Port").val("8000");			
		
		$(".adcLink").attr("href",backgroundPage.glob_url+"portal/index.cgi?openApp=user-download-center&sid="+backgroundPage.sidManager.sid);
		$(".takeasyLink").attr("href",backgroundPage.glob_url+"portal/index.cgi?openApp=user-takeasy&sid="+backgroundPage.sidManager.sid);
		//chrome.storage.sync
	}
	else if(request.purpose == 'changeUrl'){
		//alert("saved");
		$(".adcLink").attr("href",request.url+"portal/index.cgi?openApp=user-download-center&sid="+backgroundPage.sidManager.sid);
		$(".takeasyLink").attr("href",request.url+"portal/index.cgi?openApp=user-takeasy&sid="+backgroundPage.sidManager.sid);
	}
	else if(request.purpose == 'takeasyFormat'){
		var formats = request.formats;
		//alert("saved");
		$('.popover-content').html(addTaskHtmlTakeasy2);
		$('#takeasyFormatSelection').html('');
		$('#downloadTaskSubmitTakeasy').attr('dl_url',request.url);
		$('#downloadTaskSubmitTakeasy').click(function(){ 
			backgroundPage.addNewTaskTakeasyStep2($('#takeasyFormatSelection').val(),$(this).attr('dl_url'));
			getTakeasyList();
			resumeAddTaskTakeasy();
		});		
		for(var key in formats)
		{
			$('#takeasyFormatSelection').append($("<option>", {value:formats[key].format, text: formats[key].dimension +'('+formats[key].ext+')'}));
			if($('#takeasyFormatSelection option').size() <= 0)
				$('#takeasyFormatSelection').append($("<option>", {value:-1, text: chrome.i18n.getMessage('CDC_DEFAULT')}));			
		}
	}
	else if(request.purpose == 'takeasyFormatPlaylist'){
		//$('.popover-content').css('width','400px');
		$('.popover-content').html(addTaskHtmlTakeasy3);
		$('#downloadTaskSubmitTakeasy').click(function(){
			var type=$("input[name='typeSelect']:checked").val();
			chrome.runtime.sendMessage({purpose: "addVideoTaskPlaylist", type:type,dl_url:request.dl_url});
			resumeAddTaskTakeasy();
		});
		$('#downloadTaskCancelTakeasy').click(function(){
			resumeAddTaskTakeasy();
		});
	}	
	else if(request.purpose == 'takeasyClose'){
		resumeAddTaskTakeasy();
	}		
});

// save settings
function saveSettings() {
	trackButton("Save Setting from popup");
	var userID = $("#userID").val();
	var Host = $("#Host").val();
	var Password = $("#Password").val();
	var Port = $("#Port").val();
	var Protocol = $("input[type=radio][name=Protocol]:checked").val();
	$('#connectStatusDiv').html('<img src="images/loader.gif"></img>');
	//force login
	backgroundPage.glob_logining = false;
	backgroundPage.login_by_value(function(){

		if(backgroundPage.sidManager.test_sid)
		{
			$('#connectStatusDiv').html('<p class="text-success">'+chrome.i18n.getMessage('CDC_CONN_SUCCESS')+'</p>');
			$('.item-container').html("");
			unblocked=false;	
			unblocked_adc = false;
			unblocked_takeasy = false;
			backgroundPage.setPluginStatus("normal"); 
			//sePanelVisibility("setting");
		   //save setting 
		  	 chrome.runtime.sendMessage({purpose: 'saveSetting',userID: userID,Host: Host,Password: Password,Port: Port,Protocol: Protocol}, function(response) {
			 	//alert(response.alertMessage);
			 });
			
		}
		//test failed
		else 
		{
			backgroundPage.glob_logining = false;
			$('#connectStatusDiv').html('<p class="text-error">'+backgroundPage.glob_errorReason+'</p>');
			//$("#nasLink").attr("href",backgroundPage.glob_url);
		   //save setting 
		   /*
		  	 chrome.runtime.sendMessage({purpose: 'saveSetting',userID: userID,Host: Host,Password: Password,Port: Port,Protocol: Protocol}, function(response) {
			 	//alert(response.alertMessage);
			 });			
			 */
		}
	},userID,Password,Host,Port,Protocol,true)	
	
}


// clear settings
function clearSettings() {
	trackButton("Clear Setting from popup");
	$('#clearModal').modal();	
}

// clear settings
function logoutConfirm() {
	trackButton("logout confirm from popup");
	$('#logoutModal').modal();	
}

// clear settings submit
function clearSubmit() {
	trackButton("Clear Setting submit from popup");
	window.close();
	backgroundPage.clearSetting();
}

// logout submit
function logoutSubmit() {
	trackButton("Logout submit from popup");
	backgroundPage.logout();
	$("#Password").val("");
	//go to setting page;
	sePanelVisibility("setting");
	//window.close();
}

function resumeAll(){
	trackButton("Resume All");
	var ids_BT="";
	var ids_HTTP="";
	$("#adcPanel .buttonDivInner .myIcon-s-play").each(function(){
		var myWellItem = $(this).parents(".myWell").eq(0);
		if($(myWellItem).attr('type') == "BT")
			ids_BT+=$(this).parents(".myWell").eq(0).attr("myId")+",";
		else
			ids_HTTP+=$(this).parents(".myWell").eq(0).attr("myId")+",";		
	});
	if(ids_BT.length > 0 )
	{
		ids_BT = ids_BT.substr(0,ids_BT.length -1);
		resumeTask(ids_BT,"BT");
	}
	if(ids_HTTP.length > 0 )
	{
		ids_HTTP = ids_HTTP.substr(0,ids_HTTP.length -1);	
		resumeTask(ids_HTTP,"HTTP/FTP");		
	}
}

function resumeAllTakeasy(){
	
	$.ajax({
		type: "POST",
		url: backgroundPage.glob_url+"/apps/takeasy/video_downloader.cgi?act=start_download&sid="+backgroundPage.sidManager.sid,
		data: {cid: -1,list_type:0},
		dataType: "json"
		}).done(function(data) {
			//console.info(data);
			
			if(data.success)
			{
				getTakeasyList();
			}
			
		});
}

function removeAll(){
	trackButton("Clear All");
	var ids_BT="";
	var ids_HTTP="";
	$(".delete-span [name='remove']").each(function(){
		var myWellItem = $(this).parents(".myWell").eq(0);
		if($(myWellItem).attr('type') == "BT")
			ids_BT+=$(this).parents(".myWell").eq(0).attr("myId")+",";
		else
			ids_HTTP+=$(this).parents(".myWell").eq(0).attr("myId")+",";	
	});
	if(ids_BT.length > 0 )
	{
		ids_BT = ids_BT.substr(0,ids_BT.length -1);
		removeTask(ids_BT,0,"BT");
	}
	if(ids_HTTP.length > 0 )
	{
		ids_HTTP = ids_HTTP.substr(0,ids_HTTP.length -1);	
		removeTask(ids_HTTP,0,"HTTP/FTP");
	}
	
}
function removeAllTakeasy(){
	
	$.ajax({
		type: "POST",
		url: backgroundPage.glob_url+"/apps/takeasy/video_downloader.cgi?act=remove_download&sid="+backgroundPage.sidManager.sid,
		data: {cid: -1,remove_way:0,remove_by_type:1},
		dataType: "json"
		}).done(function(data) {
			//console.info(data);
			
			if(data.success)
			{
				getTakeasyList();
			}
			
		});
}

function pauseAll(){
	trackButton("Pause All");
	var ids_BT="";
	var ids_HTTP="";
	$(".buttonDivInner .myIcon-s-pause").each(function(){
		var myWellItem = $(this).parents(".myWell").eq(0);
		if($(myWellItem).attr('type') == "BT")
			ids_BT+=$(this).parents(".myWell").eq(0).attr("myId")+",";
		else
			ids_HTTP+=$(this).parents(".myWell").eq(0).attr("myId")+",";	
	});
	if(ids_BT.length > 0 )
	{
		ids_BT = ids_BT.substr(0,ids_BT.length -1);
		pauseTask(ids_BT,"BT");
	}
	if(ids_HTTP.length > 0 )
	{
		ids_HTTP = ids_HTTP.substr(0,ids_HTTP.length -1);	
		pauseTask(ids_HTTP,"HTTP/FTP");
	}	
}

function pauseAllTakeasy(){
	
	$.ajax({
		type: "POST",
		url: backgroundPage.glob_url+"/apps/takeasy/video_downloader.cgi?act=stop_download&sid="+backgroundPage.sidManager.sid,
		data: {cid: -1,list_type:0},
		dataType: "json"
		}).done(function(data) {
			//console.info(data);
			
			if(data.success)
			{
				getTakeasyList();
			}
			
		});
}

//setLocales
function setLocale(){
	$("[locale]").each(function(){
		var loc_attr = $(this).attr("loc_attr");
		if(loc_attr)
			$(this).html(chrome.i18n.getMessage($(this).attr("locale")).replace("{0}",chrome.i18n.getMessage(loc_attr)));
		else
			$(this).html(chrome.i18n.getMessage($(this).attr("locale")));
		
	});
	
	$("[locale_title]").each(function(){
		$(this).attr("title",chrome.i18n.getMessage($(this).attr("locale_title")));
	});
	
	$('version').html(backgroundPage.glob_version);
}

function addOverlay(){
	// $('body').block({ message: chrome.i18n.getMessage('CDC_WAITING')+"...",css: { border: '1px solid white',top:"50%" } }); 
	if($('.blockOverlay:visible').size() <=0)
		$('.item-column').block({ message: chrome.i18n.getMessage('CDC_WAITING')+"...",css: { border: '1px solid white',top:"50%" } });
	 //$.blockUI({ message: chrome.i18n.getMessage('CDC_WAITING')+"...",css: { border: '1px solid #bababa',top:"40%" } });
}

function removeOverlay(){
	//only unblock one time
	if(!unblocked)
	{
		//$.unblockUI();
		$('.item-column').unblock();
		$.blockUI.defaults.overlayCSS.cursor = 'pointer'; 
		unblocked=true;
	}	 
}
function removeOverlayAdc(){
	//only unblock one time
	if(!unblocked_adc)
	{
		//$.unblockUI();
		$('.item-column').unblock();
		$.blockUI.defaults.overlayCSS.cursor = 'pointer'; 
		unblocked_adc=true;
	}	 
}
function removeOverlayTakeasy(){
	//only unblock one time
	if(!unblocked_takeasy)
	{
		//$.unblockUI();
		$('.item-column').unblock();
		$.blockUI.defaults.overlayCSS.cursor = 'pointer'; 
		unblocked_takeasy=true;
	}	 
}

//DOM is ready.
document.addEventListener('DOMContentLoaded', function () {

	//get background page;
	backgroundPage = chrome.extension.getBackgroundPage();

	//set input number only
	$('#Port').numeric();
  //set Locales
  setLocale();
  $('#Host').tooltip({placement:'bottom'});		
	
	 //set block UI
	  //$.blockUI.defaults.overlayCSS.backgroundColor = 'yellow'; 
	  $.blockUI.defaults.overlayCSS.opacity = '0.2'; 
	
	addOverlay();
	//check if necessary to do relogin
	if((backgroundPage.glob_adc_status !="enabled" || !backgroundPage.sidManager.sid) && !backgroundPage.glob_firstTime && backgroundPage.glob_adc_status =="normal")
		backgroundPage.login(sePanelVisibility);
	else
		sePanelVisibility();

	//to test session out
	//backgroundPage.sidManager.sid='12312312';

  //first setting event
  $("#NotReadyDiv").click(function(){TabManager.openSettingTab();trackButton("First Setting button");});	
  //Resume All event
  $("#resumeAllButton").click(function(){resumeAll();});
  $("#resumeAllButtonTakeasy").click(function(){resumeAllTakeasy();});
  //Pause All event
  $("#pauseAllButton").click(function(){pauseAll();});  
  $("#pauseAllButtonTakeasy").click(function(){pauseAllTakeasy();});  
  //Clears All Event
  $("#clearAllButton").click(function(){removeAll();});
  $("#clearAllButtonTakeasy").click(function(){removeAllTakeasy();});
  //Add Task Event
  $("#addButton").popover({html:true,content:addTaskHtml,  
						callback:addTaskCallBack });
  $('#addButton').attr("title",$('#addButton').attr("data-original-title"));
  $("#addButtonTakeasy").popover({html:true,content:addTaskHtmlTakeasy,  
						callback:addTaskCallBackTakeasy });
  $('#addButtonTakeasy').attr("title",$('#addButtonTakeasy').attr("data-original-title"));
   //Logout Event
  $("#logoutButton").click(logoutConfirm);	
  $("#logoutSubmit").click(logoutSubmit);	 
	
  // set mytab event
  $('.myTab').click(function(){
	$('.myTab').removeClass('myTab-Current');
	$(this).addClass('myTab-Current');
	sePanelVisibility($(this).attr('mode'));
  });
						
  $('#logoutButton').attr("title",$('#logoutButton').attr("data-original-title"));
 
  //setting events
  $("#settingSubmit").click(saveSettings);
  $("#settingClear").click(clearSettings);
  $("#clearSubmit").click(clearSubmit);
  $('input[type=radio][name=Protocol]').change(function(){
	if(this.value == "http")
		$("#Port").val(8000);
	else
		$("#Port").val(8001);
  });
	$(".settingInput").keypress(function(event){       
		if (event.keyCode == 13) $("#settingSubmit").click();
	});	
 //set tab
	$('#myTab a').click(function (e) {
	  e.preventDefault();
	  $(this).tab('show');
	})  
  
  
});

function refreshList()
{     
		
   if($('.delete-span:visible').size()<=0 && backgroundPage.sidManager.sid && ($('.blockOverlay:visible').size()<=0 || !unblocked) && backgroundPage.glob_overall_status =="normal")
   {
		console.info($('#adcPanel:visible').size());
		console.info($('#takeasyPanel:visible').size());
		if($('#adcPanel:visible').size() >0)
		{
			getDownloadCenterList();	
		}
		else if($('#takeasyPanel:visible').size() >0)
			getTakeasyList();	
	}
   window.setTimeout(refreshList, 5000);
}

window.setTimeout(refreshList, 5000);




