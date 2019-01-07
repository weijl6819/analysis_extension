//Give the users news and musix generes
var showHeaderUserNews = false;
var showFooterUserNews = false;

var userFooterNewsHtml = "";
var userHeaderNewsHtml = "";

$( document ).ready(function() {
	
	if(!getShowNewTabSetting()){
		$("#ifrDownload").hide();
	}
  	showOffer();
  	date_time('date_time');
  	updateLink();
  	
  	$("#header li a").click(function() {
  		
	  	  changeType( $(this).attr("datatype"));		
	      $("#header li a").removeClass("activeType");
	      $(this).addClass( "activeType" );

	});
	
	 $('body').keypress(function(e){
        if(e.which == 13){//Enter key pressed
          gotosearchpage();
        }
    });

});

//Show user news
function showNews(json){
	var hwidth = '200px';
	var hheight = '200px';
	var himage_source = "";
	var h_target = "";
	var fwidth = '800px';
	var fheight = '200px';
	var fimage_source = "";
	var f_target = "";

	//Show Top and Bottom news
	$.each(json, function (index, obj) {
		if (index == "header") {
			showHeaderUserNews = obj["toshow"]?obj["toshow"]:false;
			hwidth = obj["width"]?obj["width"]:"200px";
			hheight = obj["height"]?obj["height"]:"200px";
			himage_source = obj["image_url"]?obj["image_url"]:"";
			h_target = obj["target_url"]?obj["target_url"]:"";
		}
		else if (index == "footer") {
			showFooterUserNews = obj["toshow"]?obj["toshow"]:false;
			fwidth = obj["width"]?obj["width"]:"800px";
			fheight = obj["height"]?obj["height"]:"200px";
			fimage_source = obj["image_url"]?obj["image_url"]:"";
			f_target = obj["target_url"]?obj["target_url"]:"";
		}
	});

//Show News inside iframe to use sandbox
	if(showHeaderUserNews){
		userHeaderNewsHtml = "<div style='margin:auto; width:"+hwidth+";height:"+fheight+";'><a href='"+h_target+"'><img style='width: 100%;height: 100%;' src='"+himage_source+"' /></a></div>";
		$(".hframe").append(userHeaderNewsHtml);
		$(".hframe").show();
	}

//Show News inside iframe to use sandbox
	if(showFooterUserNews){
		userFooterNewsHtml = "<div style='margin:auto; width:"+fwidth+";height:"+fheight+";'><a href='"+f_target+"'><img style='width: 100%;height: 100%;' src='"+fimage_source+"' /></a></div>";

		$(".offer").html(userFooterNewsHtml);
		$(".offer").show();
	}
}

function showOffer(){

	if ( localStorage["offer"] == undefined || refreshTime()) {
		$.getJSON("http://data.softorama.com/wim/news/index.php", function(result){
			if(result && Object.keys(result).length > 0) {
				localStorage.setItem('newsjson', JSON.stringify(result));
				showNews(result);
			}

		 
		})
		.error(function() {
				 
		})
	}else if(localStorage.getItem('newsjson')){
		showNews(JSON.parse(localStorage.getItem('newsjson')));
	}
 
}

 
function refreshTime(){

	var time = localStorage["offer"];
	var diff = (Date.now()-time)/1000;//to sec
	
	if(diff > 3600) //1 hour
	{
		localStorage.removeItem('newsjson');
		return true;
	}else{
		false;
	}
	
}

function date_time(id)
{
	    date = new Date;
        year = date.getFullYear();
        month = date.getMonth()+1;
        months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'Jully', 'August', 'September', 'October', 'November', 'December');
        d = date.getDate();
        day = date.getDay();
        days = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
        h = date.getHours();
        if(h<10)
        {
                h = "0"+h;
        }
        m = date.getMinutes();
        if(m<10)
        {
                m = "0"+m;
        }
        s = date.getSeconds();
        if(s<10)
        {
                s = "0"+s;
        }
        result = '<span class="clockTime">'+h+':'+m+':'+s +'</span><span class="clockDate">'+days[day]+', '+d+'.'+month+ '.'+year+' </span>';
        document.getElementById(id).innerHTML = result;
        
        setTimeout(function(){ date_time(id); }, 1000);

        return true;
}

function updateLink() {
	 
	 
	$( "#openDownload" ).click(function() {
	  chrome.downloads.showDefaultFolder();
	});
  	
}
