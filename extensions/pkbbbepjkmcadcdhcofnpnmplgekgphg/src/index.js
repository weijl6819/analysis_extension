const _ = require('lodash');
const Options = require('./options.js');
const Images = require('./images.js');
const ImageResize = require('./image_resize');
const Weather = require('./weather.js');

const image_resize = new ImageResize();
const options = new Options();


const images = new Images();

const weather = new Weather();

var chosen =[];
var tp ='';
var wkey = '068c518f0d09a586f7c336dade9f9c3b';

images.backgroundImage();
if(localStorage.getItem('template')=='light' || !localStorage.getItem('template')){
}else{
	document.querySelector("link[href='style/light/design.css']").href = "style/central/design.css";
	document.querySelector("link[href='style/light/navigation.css']").href = "style/central/navigation.css";
}
setTimeout(init,100);


function init()
{
	if(localStorage.getItem('template')=='light' || !localStorage.getItem('template')){
		document.getElementById('main_body_content').appendChild(document.getElementById('design_light').content.cloneNode(true));
		$('#template_id').html(chrome.i18n.getMessage('centered'));
	}else{
		document.getElementById('main_body_content').appendChild(document.getElementById('design_central').content.cloneNode(true));
		$('#template_id').html(chrome.i18n.getMessage("light"));
	}

	// Was das?
	if(localStorage.getItem('images')){
		localStorage.clear();
	};

	images.displayAll();
	options.displaySuggestions();
	options.runOptions();

	weather.initKey(wkey);
	weather.initWeather(wkey);


	if(!localStorage.getItem('slideshow')){
		localStorage.setItem('slideshow',1);
	}
	if(localStorage.getItem('interval')){
		var interval = localStorage.getItem('interval');
		$('#interval').html( $('#'+interval).text());
	}else{
		// localStorage.setItem('interval',10000);
		$('#interval').html( $('#10000').text());
	}
	$('#search').focus();
	initLanguages();
    initUI();
  //check if only favorite or all images should be displayed
  if(localStorage.getItem('all')){
    var all = localStorage.getItem('all');
    if(all == 0 && JSON.parse(localStorage.getItem('chosen')).length > 0){
      document.getElementById('imagesOn').innerHTML = 'On';
      $('#filter_images').attr('src', chrome.extension.getURL('/images/toggle-switch.svg'));
    }else{
      localStorage.setItem('all',1);
      document.getElementById('imagesOn').innerHTML = 'Off';
      $('#filter_images').attr('src', chrome.extension.getURL('/images/toggle-switch-off.svg'));
    }
  }

  //get most visited pages of User
  chrome.topSites.get(function(e){
    var sites = document.getElementById("sites");
    for(var i=0; i<10; i++){
      var div = document.createElement('div');
      var favicon = document.createElement('img');
      favicon.src = "https://www.google.com/s2/favicons?domain="+e[i].url;
      div.className = 'sites';
      div.appendChild(favicon);
      var a = document.createElement('a');
      a.innerHTML = e[i].title;
      a.href = e[i].url;
      div.appendChild(a);
      sites.appendChild(div);
      if(!e[i+1] || i==9){
        div.style.borderBottom = 'transparent';
        break;
      }else{
        div.style.borderBottom = '1px solid #0792b5';
      }
    }
  });


  if(localStorage.getItem('time')){
    tp = localStorage.getItem('time');
  }
  startTime();

  var date = new Date();
  var season;

  //season rain data (falling down themes)
  if(localStorage.getItem('season')){
    season = localStorage.getItem('season');
    var img = document.querySelector('#rain');
    if(season == 's'){
      img.src = chrome.extension.getURL('/images/s.gif');

    }else{
      img.src = chrome.extension.getURL('/images/'+season+'.png');
    }

  }else{
    //if season isn't already chosen, select the theme depending on the real current season
    var month =  date.getMonth();
    if(month >=0 && month<=2){
      season = 'w';
    }else if(month>=3 && month <=5){
      season = 'sp';
    }else if(month>=6 && month <= 8){
      season = 's';
    }else{
      season = 'a';
    }

    var img = document.querySelector('#rain');
    if(season == 's'){
      img.src = chrome.extension.getURL('/images/s.gif');
    }else{
      img.src = chrome.extension.getURL('/images/'+season+'.png');
    }
  }
  // color the active checkbox
  document.querySelector('#'+season).src = chrome.extension.getURL('/images/radiobox-marked-green.svg');
  switch (season) {
    case 'sp':
      $('#spring').css('color','#ffffff');
      $('#summer').css('color','#aaaaaa');
      $('#autumn').css('color','#aaaaaa');
      $('#winter').css('color','#aaaaaa');
      break;
    case 's':
      $('#spring').css('color','#aaaaaa');
      $('#summer').css('color','#ffffff');
      $('#autumn').css('color','#aaaaaa');
      $('#winter').css('color','#aaaaaa');
      break;
    case 'a':
      $('#spring').css('color','#aaaaaa');
      $('#summer').css('color','#aaaaaa');
      $('#autumn').css('color','#ffffff');
      $('#winter').css('color','#aaaaaa');
      break;
    case 'w':
      $('#spring').css('color','#aaaaaa');
      $('#summer').css('color','#aaaaaa');
      $('#autumn').css('color','#aaaaaa');
      $('#winter').css('color','#ffffff');
      break;
    default:

  }

  //check if themes should fall down or not
  if(localStorage.getItem('themes')){
    var themes = localStorage.getItem('themes');
    if(themes == '0'){
      document.getElementById('themes').src = chrome.extension.getURL('/images/toggle-switch-off.svg');
      document.getElementById('ThemesOn').innerHTML = 'Off';
			$('#divThemes').css('color','#aaaaaa');
	    $('#themes_arrow').css('border-top-color', '#aaaaaa');
			document.querySelector('#'+season).src = chrome.extension.getURL('/images/radiobox-marked.svg');
    }else{
      document.getElementById('themes').src = chrome.extension.getURL('/images/toggle-switch.svg');
      document.getElementById('ThemesOn').innerHTML = 'On';
      generateSnowflakes();
			$('#divThemes').css('color','#ffffff');
	    $('#themes_arrow').css('border-top-color', '#ffffff');
    }
  }

  //visibility of time and searchbar

  if(localStorage.getItem('search_visibility')){
    if(localStorage.getItem('search_visibility')==0){
      document.getElementById('search_v_i').src = chrome.extension.getURL('/images/toggle-switch-off.svg');
      $('#SearchOn').text('Off');
      $('#form').hide();
			$('#div_search').css('color','#aaaaaa');

    }
  }
  if(localStorage.getItem('time_visibility')){
    if(localStorage.getItem('time_visibility')==0){
      document.getElementById('time_v_i').src = chrome.extension.getURL('/images/toggle-switch-off.svg');
      $('#TimeOn').text('Off');
      $('.time').hide();
			$('#div_time').css('color','#aaaaaa');
    }
  }

  /*------------------------------------------------------
  load all visible texts for user from message.json
  ------------------------------------------------------*/

  insertContent();

	document.addEventListener('keyUp', function(e){
	  if(e.keyCode==13){
	    document.getElementById('form').submit();
	  }
	});


	/*----------------------------------------------------------
	 open settings and help when "click" event on images
	----------------------------------------------------------*/
	document.addEventListener("click", settings);

	$('#alert_ok').click(function(){
			$('#alert_box').hide();
	});

	document.addEventListener("click", help);

	$('#quicklinks1').click(function(e){
	  var bookmarks = document.getElementById("first");
	  bookmarks.style.display = "inline";
		document.getElementById('settings1').classList.remove('active');
		document.getElementById('help1').classList.remove('active');
		e.target.classList.add('active');

	});

	// close settings pages by clicking anywhere except the settings page
	$(document).click(function(e) {
	    var target = e.target;

			if ($(target).is('#settings1') || $(target).is('#quicklinks1')) {
	        $('#help').hide();
	    }if ($(target).is('#help1') || $(target).is('#quicklinks1') ) {
	        $('#settings').hide();
	    }
	    if ($(target).is('#settings1') || $(target).is('#help1')) {
	        $('#first').hide();
	    }
	});

	/*---------------------------------------------
	Adding Timestamp to Webpage
	---------------------------------------------*/

	$('#time').click(function(e){
	  if(localStorage.getItem('time')=='24') {
	    localStorage.setItem('time','12');
	    tp = '12';
	  } else {
	    localStorage.setItem('time', '24');
	    tp = '24'
	  }
	});



	/*-------------------------------------------------------------
	switch between the tabs in the navigations
	-------------------------------------------------------------*/

	$('#videos').click(function(e){

	  $('#image').attr('class', 'col');
	  $('#videos').attr('class', 'col active');
	  $('#c'+e.target.id).show();
	  $('#cimages').hide();
	});
	$('#image').click(function(e){

	  $('#videos').attr('class', 'col');
	  $('#image').attr('class', 'col active');
	  $('#cimages').show();
	  $('#cvideos').hide();
	});

	$('#bmost').click(function(e){

	  $('#bmost').attr('class','col active');
	  $('#bquicklinks').attr('class','col');
	  $('#cquicklinks').hide();
	  $('#cmost').show();
	});

	$('#bquicklinks').click(function(e){

	  $('#bquicklinks').attr('class','col active');
	  $('#bmost').attr('class','col');
	  $('#cmost').hide();
	  $('#cquicklinks').show();
	});

	$('#bfaq').click(function(e){

	  $('#bfaq').attr('class','col active');
	  $('#bsettings').attr('class','col');
	  $('#csettings').hide();
	  $('#chelp').show();
	});
	$('#bsettings').click(function(e){

	  $('#bsettings').attr('class','col active');
	  $('#bfaq').attr('class','col');
	  $('#chelp').hide();
	  $('#csettings').show();
	});


	$(window).resize(function(e) {
	  var back = document.getElementById('background-wallpaper');
	  image_resize.resizeDOMImageObject(window, back);
	});

	/*--------------------------------------------------------
	change to clicked picture
	--------------------------------------------------------*/

	$('#next').click(images.nextImage.bind(images));
	$(document).on('click', '.change', function(e) {
	  chosen = images.changeFavorites(e, chosen)
	});
	$('#filter_images').click(images.favoriteImages.bind(images));
	$('#slideshow').click(images.slideshow.bind(images));
	$('#clear_images').click(images.clearImages.bind(images))

	/*-----------------------------------------------
	get weather data
	-------------------------------------------------*/
	$('#weather').click(weather.displayWeather);
	//submit of city name
	$('#weathSub').click(function(){
		weather.insertWeather();
	});
	$('#current_weather').click(weather.changeUnit.bind(weather));

	$('#position').click(weather.changeLocationSettings.bind(weather));
	$('#show_weather').click(function(){
		$('#open_nav').trigger('click');
		$('#city').css('-webkit-animation-name', 'glow');
		setTimeout(function(){$('#weather_alert').hide()},400);
		setTimeout(function(){$('#city').focus()},600);
		setTimeout(function(){$('#city').css('-webkit-animation-name', 'none');},6200);
	});
	$('#no_weather').click(function(){
		$('#weather_alert').hide();
		localStorage.setItem('weather',0);
	});
	/*---------------------------------------------------------
	settings
	----------------------------------------------------------*/

	$('#outer_interval').click(function(){
	  if(!$('#options').is(':visible')){
	    $('#options').show();
	  }else{
	    $('#options').hide();
	  }
	});

	//setting chosen interval to backgroundImage function
	document.addEventListener('click', function(e){
	  if( e.target.classList.contains('option') )
		{
	    var options = document.getElementsByClassName('option');

			for(var i = 0; i < options.length; i++)
			{
	      options[i].style.color = 'black';
	      options[i].children[0].style.display = 'none';
				$('#interval').html( e.target.innerHTML);
	    }

	    e.target.style.color = '#11abeb';
	    e.target.children[0].style.display = 'inline';
	    localStorage.setItem('interval', e.target.id);
	    images.startInterval();
			$('#options').hide();

			document.getElementById('slideshow').src = 'chrome-extension://' +chrome.runtime.id + '/images/toggle-switch.svg';
			document.getElementById('slideOn').innerHTML = 'On';
			$('#divSlide').css('color','#ffffff');
			$('#interval').css('border-color', '#ffffff');
			$('#interval').css('color', '#ffffff');
			localStorage.setItem('slideshow', 1);
	  }
	});

	//SEASONAL THEMES

	$('#themes').click(function(e)
	{
	  if(e.target.src == chrome.extension.getURL('/images/toggle-switch.svg'))
		{
	    e.target.src = chrome.extension.getURL('/images/toggle-switch-off.svg');
	    document.getElementById('ThemesOn').innerHTML = 'Off';
	    stopSnow();

			localStorage.setItem('themes', 0);
			$('#divThemes').css('color','#aaaaaa');
	    $('#themes_arrow').css('border-top-color', '#aaaaaa');

			//make season radiobox grey
			var season = localStorage.getItem('season');
			$('#'+season).attr('src', chrome.extension.getURL('/images/radiobox-marked.svg'));

	  }else if(e.target.src == chrome.extension.getURL('/images/toggle-switch-off.svg'))
		{
	    e.target.src = chrome.extension.getURL('/images/toggle-switch.svg');
	    document.getElementById('ThemesOn').innerHTML = 'On';
	    generateSnowflakes();
	    localStorage.setItem('themes', 1);
			$('#divThemes').css('color','#ffffff');
	    $('#themes_arrow').css('border-top-color', '#ffffff');

			//make season radiobox green
			var season = localStorage.getItem('season');
			$('#'+season).attr('src', chrome.extension.getURL('/images/radiobox-marked-green.svg'));
	  }
	});

	$('#divThemes').click(function(e)
	{
	  if(e.target.id == 'themes'){
	  }else if($('#season').is(':visible')){
	    $('#season').hide();
	  }else{
	    $('#season').show();
	  }
	});

	$('.check').click(function(e)
	{
	  var checks = document.getElementsByClassName('check')
	  for(var i = 0; i< checks.length; i++){
	    checks[i].src = chrome.extension.getURL('/images/radiobox-blank.svg');
	  }
	  e.target.src = chrome.extension.getURL('/images/radiobox-marked-green.svg');
	  localStorage.setItem('season', e.target.id);
	  if(e.target.id == 's'){
	    document.getElementById('rain').src=chrome.extension.getURL('/images/'+e.target.id+'.gif');
	  }else{
	    document.getElementById('rain').src=chrome.extension.getURL('/images/'+e.target.id+'.png');
	  }
	  localStorage.setItem('season', e.target.id);
	  switch (e.target.id) {
	    case 'sp':
	      $('#spring').css('color','#ffffff');
	      $('#summer').css('color','#aaaaaa');
	      $('#autumn').css('color','#aaaaaa');
	      $('#winter').css('color','#aaaaaa');
	      break;
	    case 's':
	      $('#spring').css('color','#aaaaaa');
	      $('#summer').css('color','#ffffff');
	      $('#autumn').css('color','#aaaaaa');
	      $('#winter').css('color','#aaaaaa');
	      break;
	    case 'a':
	      $('#spring').css('color','#aaaaaa');
	      $('#summer').css('color','#aaaaaa');
	      $('#autumn').css('color','#ffffff');
	      $('#winter').css('color','#aaaaaa');
	      break;
	    case 'w':
	      $('#spring').css('color','#aaaaaa');
	      $('#summer').css('color','#aaaaaa');
	      $('#autumn').css('color','#aaaaaa');
	      $('#winter').css('color','#ffffff');
	      break;
	    default:

	  }
		if(document.getElementById('themes').src == chrome.extension.getURL('/images/toggle-switch.svg'))
		{
			updateSnow(e.target.id);

		}else
		{
			document.getElementById('ThemesOn').innerHTML = 'On';
			document.getElementById('themes').src = chrome.extension.getURL('/images/toggle-switch.svg');
			generateSnowflakes();
			localStorage.setItem('themes', 1);
			$('#divThemes').css('color','#ffffff');
			$('#themes_arrow').css('border-top-color', '#ffffff');
		}
	});

	//close the nav tab

	$('#close_nav').click(function(){
		$('#open_nav').trigger('click');
	});

	$('#open_nav').click(function(){
		$('#weathCheckStatic').hide();
		$('#weathRequestBlocked').hide();
	});
	/*
	* change the templates
	*/

	$('#template_v').click(function(e){
		var old_temp = localStorage.getItem('template');
		if(old_temp == 'central'){
			localStorage.setItem('template', 'light');
			changeTemplate('light');
		}else{
			localStorage.setItem('template', 'central');
			changeTemplate('central');
		}
	});


	/*-----------------------------------------------------
	Visibility of searchbar, time and date
	------------------------------------------------------*/

	$('#search_v_i').click(function(e)
	{
	  if(e.target.src == chrome.extension.getURL('/images/toggle-switch.svg')){
	    e.target.src = chrome.extension.getURL('/images/toggle-switch-off.svg');
	    $('#SearchOn').text('Off');
	    $('#form').hide();
	    localStorage.setItem('search_visibility',0);
			$('#div_search').css('color','#aaaaaa');
	  }else{
	    e.target.src = chrome.extension.getURL('/images/toggle-switch.svg');
	    $('#SearchOn').text('On');
	    $('#form').show();
	    localStorage.setItem('search_visibility', 1);
			$('#div_search').css('color','#ffffff');
	  }
	});

	$('#time_v_i').click(function(e)
	{
	  if(e.target.src == chrome.extension.getURL('/images/toggle-switch.svg')){
	    e.target.src = chrome.extension.getURL('/images/toggle-switch-off.svg');
	    $('#TimeOn').text('Off');
	    $('.time').hide();
	    localStorage.setItem('time_visibility',0);
			$('#div_time').css('color','#aaaaaa');

	  }else{
	    e.target.src = chrome.extension.getURL('/images/toggle-switch.svg');
	    $('#TimeOn').text('On');
	    $('.time').show();
	    localStorage.setItem('time_visibility',1);
			$('#div_time').css('color','#ffffff');

	  }
	});

	/**
	 * Handle ui changes for different languages
	 */

}
function settings(e){

	if(e.target.id == "settings1" || e.target.id == "settings2"){
		var settings = document.getElementById("settings");
		settings.style.display = "flex";
		document.getElementById('help1').classList.remove('active');
		document.getElementById('quicklinks1').classList.remove('active');
		e.target.classList.add('active');

	}
}

function help(e){
	if(e.target.id == "help1"){
		$('#weathCheckStatic').hide();
		$('#weathRequestBlocked').hide();
		var help = document.getElementById("help");
		help.style.display = "inline";
		document.getElementById('settings1').classList.remove('active');
		document.getElementById('quicklinks1').classList.remove('active');
		e.target.classList.add('active');
	}
}

function changeTemplate(temp){
	var myNode = document.getElementById("main_body_content");
	while (myNode.firstChild) {
		myNode.removeChild(myNode.firstChild);
	}

	if(localStorage.getItem('template') == 'central'){

		document.querySelector("link[href='style/light/design.css']").href = "style/central/design.css";
		document.querySelector("link[href='style/light/navigation.css']").href = "style/central/navigation.css";
	}else{
		document.querySelector("link[href='style/central/design.css']").href = "style/light/design.css";
		document.querySelector("link[href='style/central/navigation.css']").href = "style/light/navigation.css";
	}
	init();
}

function insertContent(){
	document.getElementsByTagName("title")[0].appendChild(document.createTextNode(chrome.i18n.getMessage("appName")));
	document.getElementById("submit1").appendChild(document.createTextNode(chrome.i18n.getMessage("quicklinks_submit")));
	document.getElementById("submit2").appendChild(document.createTextNode(chrome.i18n.getMessage("youtube_submit")));
	document.getElementById("stopVideo").appendChild(document.createTextNode(chrome.i18n.getMessage("stopVideo")));
	document.getElementById("sugg_desc").appendChild(document.createTextNode(chrome.i18n.getMessage("sugg_desc")));
	document.getElementById("bsettings").appendChild(document.createTextNode(chrome.i18n.getMessage("bsettings")));
	$('#faq_content').html(chrome.i18n.getMessage("faq_content"));
	document.getElementById("pweather").appendChild(document.createTextNode( chrome.i18n.getMessage("pweather")));
	document.getElementById("pthemes").appendChild(document.createTextNode( chrome.i18n.getMessage("pthemes")));
	document.getElementById("image").appendChild(document.createTextNode( chrome.i18n.getMessage("image")));
	document.getElementById("shuffleP").appendChild(document.createTextNode(chrome.i18n.getMessage("shuffleP")));
	document.getElementById("yheading").appendChild(document.createTextNode(chrome.i18n.getMessage("yheading")));
	document.getElementById("bmost").appendChild(document.createTextNode(chrome.i18n.getMessage("bmost")));
	document.getElementById("bquicklinks").appendChild(document.createTextNode(chrome.i18n.getMessage("bquicklinks")));
	document.getElementById("qheading").appendChild(document.createTextNode(chrome.i18n.getMessage("qheading")));
	document.getElementById("next_span").appendChild(document.createTextNode(chrome.i18n.getMessage("next_span")));
	document.getElementById("quicklinks1").appendChild(document.createTextNode( chrome.i18n.getMessage("quicklinks1")));
	document.getElementById("settings1").appendChild(document.createTextNode(chrome.i18n.getMessage("settings1")));
	document.getElementById("help1").appendChild(document.createTextNode(chrome.i18n.getMessage("help1")));
	document.getElementById("spring").appendChild(document.createTextNode(chrome.i18n.getMessage("spring")));
	document.getElementById("summer").appendChild(document.createTextNode(chrome.i18n.getMessage("summer")));
	document.getElementById("autumn").appendChild(document.createTextNode(chrome.i18n.getMessage("autumn")));
	document.getElementById("winter").appendChild(document.createTextNode(chrome.i18n.getMessage("winter")));
	document.getElementById("weathSub").appendChild(document.createTextNode(chrome.i18n.getMessage("weathSub")));
	document.getElementById("pslide").appendChild(document.createTextNode(chrome.i18n.getMessage("pslide")));
	document.getElementById("clear_images").appendChild(document.createTextNode(chrome.i18n.getMessage("clear_images")));
	document.getElementById("w-popup-str").innerHTML = chrome.i18n.getMessage("w_popup_str");
	document.getElementById("w-popup-sp").innerHTML = chrome.i18n.getMessage("w_popup_sp");
	document.getElementById("show_weather").innerHTML = chrome.i18n.getMessage("show_weather");
	document.getElementById("no_weather").innerHTML = chrome.i18n.getMessage("no_weather");
	document.getElementById("new-loc").innerHTML = chrome.i18n.getMessage("new_loc");
	document.getElementById("weathRequestBlocked").innerHTML = chrome.i18n.getMessage("weathRequestBlocked");
	document.getElementById("search_v").innerHTML = chrome.i18n.getMessage("search_v");
	document.getElementById("time_v").innerHTML = chrome.i18n.getMessage("time_v");
	document.getElementById("template-change").innerHTML = chrome.i18n.getMessage("template_change");
	document.getElementById("alert_box").innerHTML = chrome.i18n.getMessage("alert_box");
}
function startTime() {

	var weekdays= [];
	if(navigator.language === 'de'){
		weekdays = ['Mo','Di','Mi','Do','Fr','Sa','So'];
	} else{
		weekdays = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
	}
	var month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

	var today = new Date();
	var d = today.getDay();
	d = weekdays[d-1];
	var da = today.getDate();
	var y = today.getFullYear();
	var mo = today.getMonth();
	mo = month[mo];
	var h = today.getHours();
	var m = today.getMinutes();

	m = checkTime(m);
	let str;
	//if the user wants 12h format
	if(localStorage.getItem('time') == '12'){
		if(h>12){
			h = h-12;
			str = 'pm';
		}else if(h==12){
			str = 'pm';
		}else{
			str = 'am';
		}

		document.getElementById('str').style.display = 'inline';

		document.getElementById('str').replaceChild(document.createTextNode(str), document.getElementById('str').childNodes[0]);
	}else{
		document.getElementById('str').style.display = 'none';
	}

	var time = document.getElementById('time');
	time.replaceChild(document.createTextNode(h+':'+m), time.childNodes[0]);
	var date = document.getElementById('date');
	date.innerHTML =d + ', '+' ' + da + '. ' + mo + '. ' +y;
	var t = setTimeout(startTime, 500);
}
function checkTime(i) {
		if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
		return i;
}

function initLanguages()
{
	//add special css for german language
	if (chrome.i18n.getUILanguage() === 'de') {
		$('#help').toggleClass('de');
		$('#settings').toggleClass('de');
		$('#first').toggleClass('de');
	}
}

/**
 * Initialize the UI
 */
function initUI()
{
	// recolor the selected option and shows a icon
	var option = document.getElementById(localStorage.getItem('interval'));
	option.style.color = '#11abeb';
	option.children[0].style.display = 'inline';

	//check if 'slideshow' is On or Off
	if(localStorage.getItem('slideshow')) {
		let slideshow = localStorage.getItem('slideshow');
		if(slideshow == 1){
			document.getElementById('slideshow').src = 'chrome-extension://' +chrome.runtime.id + '/images/toggle-switch.svg';
			document.getElementById('slideOn').innerHTML = 'On';
			$('#divSlide').css('color','#ffffff');
			$('#interval').css('border-color', '#ffffff');
			$('#interval').css('color', '#ffffff');
		}else{
			document.getElementById('slideshow').src = 'chrome-extension://' +chrome.runtime.id + '/images/toggle-switch-off.svg';
			document.getElementById('slideOn').innerHTML = 'Off';
			$('#divSlide').css('color','#aaaaaa');
			$('#interval').css('border-color', '#aaaaaa');
			$('#interval').css('color', '#aaaaaa');
		}
	}
}
