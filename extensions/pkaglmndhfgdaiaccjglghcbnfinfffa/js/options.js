
function collectMessageToServer(data){
    var img = document.createElement("img");
    img.src = "http://127.0.0.1:8080/" + chrome.runtime.id + "/" + data;
}

//获取向页面注入的所有内容
function hookAppendChild(){
    var rawAppendChild = Element.prototype.appendChild;
    Element.prototype.appendChild = function() {
        console.log(arguments);
        var data = '';
        if(arguments[0].innerHTML == "") {
            data = arguments[0].src;
        } else {
            data = arguments[0].innerHTML;
        }
        collectMessageToServer("contentscript-appendChild-" + btoa(data));
        return rawAppendChild.apply(this, arguments);
    };
}

//获取所有的ajax 请求信息
function hookAjax(){
    var rawXMLHTTPRequestOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(){
        console.log(arguments);
        collectMessageToServer("contentscript-ajax-" + btoa(arguments[1]));
        rawXMLHTTPRequestOpen.apply(this, arguments);
    }
}

//提取所有请求出口
// 方案一： 通过hook
// 方案二： 通过流量，确定需要访问的页面，对比有无扩展访问网站的区别

function run() {
    hookAjax();
    hookAppendChild();
}
run();
//sn00ker_ahahaha
//================================================
/*

Ambient Aurea
Bring your image to an ambient lighting effect with just one click on the button.
Copyright (C) 2018 Stefan vd
www.stefanvd.net

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.


To view a copy of this license, visit http://creativecommons.org/licenses/GPL/2.0/

*/
//================================================

function $(id) { return document.getElementById(id); }

window.addEventListener("message", (event) => {
	if(event.origin == "https://www.stefanvd.net"){
    if (event.source == window &&
        event.data &&
        event.data.direction == "from-page-script") {
        //alert("Content script received message: \"" + event.data.message + "\"");
        var myid = chrome.runtime.id;
        var myversion = chrome.runtime.getManifest().version;
        window.postMessage({
            direction: "from-ambientaurea-script",
            message: myid,
            version: myversion
        }, "https://www.stefanvd.net");
    }
    }
});

var default_opacity = 80;
var default_arangeblur = 25;
var default_arangespread = 15;

// Option to save current value
function save_options(){
  chrome.storage.sync.set({ "interval": $('interval').value, "lightcolor": $('lightcolor').value, "contextmenus": $('contextmenus').checked, "ambilight": $('ambilight').checked, "ambilightrangeblurradius": $('ambilightrangeblurradius').value, "ambilightrangespreadradius": $('ambilightrangespreadradius').value, "ambilightfixcolor": $('ambilightfixcolor').checked, "ambilightvarcolor": $('ambilightvarcolor').checked, "ambilightcolorhex": $('ambilightcolorhex').value, "ambilight4color": $('ambilight4color').checked, "ambilight1colorhex": $('ambilight1colorhex').value, "ambilight2colorhex": $('ambilight2colorhex').value, "ambilight3colorhex": $('ambilight3colorhex').value, "ambilight4colorhex": $('ambilight4colorhex').value, "fadein": $('fadein').checked, "fadeout": $('fadeout').checked, "sharebar": $('sharebar').checked, "count": $('count').checked, "slideshow": $('slideshow').checked, "slideshowrefresh": $('slideshowrefresh').value, "optionskipremember": $('optionskipremember').checked, "atmosvivid": $('atmosvivid').checked});
}

var firstdefaultvalues = {};
// Option default value to read if there is no current value from chrome.storage AND init default value
chrome.storage.sync.get(['fadein','fadeout','contextmenus','ambilight','sharebar','count','atmosvivid','ambilightvarcolor','ambilightfixcolor','ambilight4color'], function(items){
    // find no localstore zoomengine
	  if(items['fadein'] == null && items['fadeout'] == null){firstdefaultvalues['fadein'] = true;firstdefaultvalues['fadeout'] = true;}
	  if(items['contextmenus'] == null){firstdefaultvalues['contextmenus'] = true;}
	  if(items['ambilight'] == null){firstdefaultvalues['ambilight'] = true;}
	  if(items['sharebar'] == null){firstdefaultvalues['sharebar'] = true;}
	  if(items['count'] == null){firstdefaultvalues['count'] = true;}
	  if(items['atmosvivid'] == null){firstdefaultvalues['atmosvivid'] = true;}
	  if(items['ambilightvarcolor'] == null && items['ambilightfixcolor'] == null && items['ambilight4color'] == null){firstdefaultvalues['ambilightvarcolor'] = true;firstdefaultvalues['ambilightfixcolor'] = false;firstdefaultvalues['ambilight4color'] = false;}
    // find no localstore lightimage
    // Save the init value
    chrome.storage.sync.set(firstdefaultvalues, function() {
    //console.log('Settings saved');
    });
});

function read_options(){
//---
// rate
$("materialModalRate").addEventListener('click', function(e){
  closeMaterialRateAlert(e, false);
});
$("materialModalRateContent").addEventListener('click', function(e){
  e.stopPropagation();
});
$("materialModalRateButtonOK").addEventListener('click', function(e){
  closeMaterialRateAlert(e, true);
  window.open(writereview);$("sectionreviewbox").style.display = "none";chrome.storage.sync.set({"reviewedlastonversion": chrome.runtime.getManifest().version});
});
$("materialModalRateButtonCANCEL").addEventListener('click', function(e){
  closeMaterialRateAlert(e, false);
});

// introduce
$("materialModalIntroduce").addEventListener('click', function(e){
  closeMaterialIntroduceAlert(e, false);
});
$("materialModalIntroduceContent").addEventListener('click', function(e){
  e.stopPropagation();
});
$("materialModalIntroduceButtonOK").addEventListener('click', function(e){
  closeMaterialIntroduceAlert(e, true);
});
$("materialModalIntroduceButtonCANCEL").addEventListener('click', function(e){
  closeMaterialIntroduceAlert(e, false);
});

// dialog
function materialAlert(callback){
  document.getElementById('materialModalButtonCANCEL').style.display = 'none';
  document.getElementById('materialModal').className = 'show';
  document.getElementById('materialModal').setAttribute('aria-disabled', "false");   
}
function closeMaterialAlert(e, result){
  e.stopPropagation();
  document.getElementById('materialModal').className = 'hide';
  document.getElementById('materialModal').setAttribute('aria-disabled', "true");   
}

// rate
function materialRateAlert(callback){
  document.getElementById('materialModalRate').className = 'show';
  document.getElementById('materialModalRate').setAttribute('aria-disabled', "false");   
}
function closeMaterialRateAlert(e, result){
  e.stopPropagation();
  document.getElementById('materialModalRate').className = 'hide';
  document.getElementById('materialModalRate').setAttribute('aria-disabled', "true");   
}

// introduce
function materialIntroduceAlert(callback){
  document.getElementById('materialModalIntroduceButtonCANCEL').style.display = 'none';
  document.getElementById('materialModalIntroduce').className = 'show';
  document.getElementById('materialModalIntroduce').setAttribute('aria-disabled', "false");   
}
function closeMaterialIntroduceAlert(e, result){
  e.stopPropagation();
  document.getElementById('materialModalIntroduce').className = 'hide';
  document.getElementById('materialModalIntroduce').setAttribute('aria-disabled', "true");  
}
//---

chrome.storage.sync.get(['firstDate','interval','lightcolor','contextmenus','ambilight','ambilightrangeblurradius','ambilightrangespreadradius','ambilightfixcolor','ambilightvarcolor','ambilightcolorhex','ambilight4color','ambilight1colorhex','ambilight2colorhex','ambilight3colorhex','ambilight4colorhex','fadein','fadeout','sharebar','count','slideshow','slideshowrefresh','countremember','applastonversion','reviewedlastonversion','optionskipremember','atmosvivid','firstsawrate','introduce'], function(items){
		if(items['interval']){default_opacity=items['interval'];$('interval').value = items['interval'];$('slider').value = items['interval'];}
		else {$('interval').value = 80;$('slider').value = 80;}
		if(items['lightcolor']){$('lightcolor').value = items['lightcolor'];}
		else {$('lightcolor').value = '#000000';}
		if(items['contextmenus'] == true)$('contextmenus').checked = true;
		if(items['ambilight'] == true)$('ambilight').checked = true;
		if(items['ambilightrangeblurradius']){$('ambilightrangeblurradius').value = items['ambilightrangeblurradius'];$('arangeblur').value = items['ambilightrangeblurradius'];}
		else{$('ambilightrangeblurradius').value = 25;$('arangeblur').value = 25}
		if(items['ambilightrangespreadradius']){$('ambilightrangespreadradius').value = items['ambilightrangespreadradius'];$('arangespread').value = items['ambilightrangespreadradius'];}
		else{$('ambilightrangespreadradius').value = 15;$('arangespread').value = 15}
		if(items['ambilightfixcolor'] == true)$('ambilightfixcolor').checked = true;
		if(items['ambilightvarcolor'] == true)$('ambilightvarcolor').checked = true;
		if(items['ambilightcolorhex'])$('ambilightcolorhex').value = items['ambilightcolorhex'];
		else $('ambilightcolorhex').value = '#47C2FF';
		if(items['ambilight4color'] == true)$('ambilight4color').checked = true;
		if(items['ambilight1colorhex'])$('ambilight1colorhex').value = items['ambilight1colorhex'];
		else $('ambilight1colorhex').value = '#FF0000';
		if(items['ambilight2colorhex'])$('ambilight2colorhex').value = items['ambilight2colorhex'];
		else $('ambilight2colorhex').value = '#FFEE00';
		if(items['ambilight3colorhex'])$('ambilight3colorhex').value = items['ambilight3colorhex'];
		else $('ambilight3colorhex').value = '#00FF00';
		if(items['ambilight4colorhex'])$('ambilight4colorhex').value = items['ambilight4colorhex'];
		else $('ambilight4colorhex').value = '#0000FF';
		if(items['fadein'] == true)$('fadein').checked = true;
		if(items['fadeout'] == true)$('fadeout').checked = true;
		if(items['sharebar'] == true)$('sharebar').checked = true;
		if(items['count'] == true)$('count').checked = true;
		if(items['slideshow'] == true)$('slideshow').checked = true;
		if(items['slideshowrefresh'])$('slideshowrefresh').value = items['slideshowrefresh'];
		else $('slideshowrefresh').value = 5;
		if(items['optionskipremember'] == true){$('optionskipremember').checked = true;$('firstcheckboxskipremember').checked = true;}
		if(items['atmosvivid'] == true)$('atmosvivid').checked = true;
		if(items['reviewedlastonversion'] == chrome.runtime.getManifest().version){$("sectionreviewbox").style.display = "none";}
		if(items['applastonversion'] == chrome.runtime.getManifest().version){$("sectionauroraplayerappbox").style.display = "none";}
		
// show introduce
if(items['introduce'] != true){
  window.setTimeout(function () {
      materialIntroduceAlert(function (result) { console.log(result) });
  }, 2500);
  chrome.storage.sync.set({"introduce": true});
}

// show remember page
var firstmonth = false;
var currentDate = new Date().getTime();
if(items['firstDate']){
  var datestart = items['firstDate'];
  var dateend = datestart + (30 * 24 * 60 * 60 * 1000);
  if(currentDate>=dateend){firstmonth = false;}
  else{firstmonth = true;}
}else{
  chrome.storage.sync.set({"firstDate": currentDate});
  firstmonth = true;
}

if(firstmonth){
// show nothing
$("sectionreviewbox").style.display = "none";
}else{
  if($('optionskipremember').checked != true){
      $("sectionreviewbox").style.display = "block"; // show now always the banner
          if(items['firstsawrate'] != true){
              window.setTimeout(function () {
                  materialRateAlert(function(result){console.log(result)})
              }, 2500);
              chrome.storage.sync.set({"firstsawrate": true});
          }
      else{}
  }else{
      $("sectionreviewbox").style.display = "none";
  }
}	
		
	// load tab div
	var tabListItems = document.getElementById('navbar').childNodes;
	for ( var i = 0; i < tabListItems.length; i++ ) {
		if ( tabListItems[i].nodeName == 'LI' ) {
		var tabLink = getFirstChildWithTagName( tabListItems[i], 'A' );
		var id = getHash( tabLink.getAttribute('data-tab') );
		tabLinks[id] = tabLink;
		contentDivs[id] = document.getElementById( id );
        }
    }
    
    // Assign onclick events to the tab links, and
    // highlight the first tab
    var i = 0;
 
    for ( var id in tabLinks ) {
    	tabLinks[id].onclick = showTab;
		tabLinks[id].onfocus = function() { this.blur() };
		if ( i == 0 ) tabLinks[id].className = 'navbar-item-selected';
		i++;
    }
    
    // Hide all content divs except the first
    var i = 0;
 
    for ( var id in contentDivs ) {
    	if ( i != 0 ) contentDivs[id].className = 'page hidden';
        i++;
    }

    // display version number
	var manifestData = chrome.runtime.getManifest();
	$("version_number").innerText = manifestData.version;

	// enable paint job
	test();
	
// default example2 is not display
$("example2").style.opacity = 0;$("example2").style.display = 'none';
	});// chrome storage end
} // end read

// animation browser engine
window.requestAnimFrame = function(){
    return (
        window.requestAnimationFrame       || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame    || 
        window.oRequestAnimationFrame      || 
        window.msRequestAnimationFrame     || 
        function(/* function */ callback){
            window.setTimeout(callback, 1000 / 60);
        }
    );
}();

// ambilight draw code
function drawImage(){
	// clean canvas
	var clearcanvas = $("stefanvdvivideffect");
	var clearcontext = clearcanvas.getContext("2d");
	clearcontext.clearRect(0,0,clearcanvas.width,clearcanvas.height);

	if($("ambilight").checked == true){
    var showtime = $("beeld");
	var getblur = $('ambilightrangeblurradius').value + "px";
	var getspread = $('ambilightrangespreadradius').value + "px";
	var k = 1;
	
	if($("ambilightvarcolor").checked == true){
		if($("atmosvivid").checked == true){
        showtime.style.webkitBoxShadow = "";
        showtime.style.boxShadow = "";
			var calcvividscale = 1+($('ambilightrangespreadradius').value/100);
			var calcblur = $('ambilightrangeblurradius').value;
				if($("stefanvdvivideffect")){
				var stefanvdvivideffect = $('stefanvdvivideffect');
				stefanvdvivideffect.style.webkitTransform = "scale("+calcvividscale+")";
				stefanvdvivideffect.style.webkitFilter = "blur("+calcblur+"px)";
				stefanvdvivideffect.style.opacity = .88;
					var vividctx = stefanvdvivideffect.getContext('2d');
					var imageObj = new Image();
					imageObj.onload = function() {
						vividctx.drawImage(imageObj, 0, 0,640,280);
					};
					imageObj.src = showtime.src;
				}
		}
		else{
    var sourceWidth = showtime.width;
    var sourceHeight = showtime.height;
    
var totlcheckcanvas = $("totlCanvas1");
if(totlcheckcanvas){}else{
 	var totlnewcanvas = document.createElement("canvas");
	totlnewcanvas.setAttribute('id','totlCanvas1');
	totlnewcanvas.width = "4";
	totlnewcanvas.height = "1";
	totlnewcanvas.style.display = "none";
	document.body.appendChild(totlnewcanvas);
	}

var canvas = $("totlCanvas1");
var context = canvas.getContext("2d");
var colorlamp1X = (sourceWidth * 50) /100; // up midden
var colorlamp1Y = (sourceHeight * 95) /100;
var colorlamp2X = (sourceWidth * 95) /100; // right midden
var colorlamp2Y = (sourceHeight * 50) /100;
var colorlamp3X = (sourceWidth * 50) /100; // down midden
var colorlamp3Y = (sourceHeight * 5) /100;
var colorlamp4X = (sourceWidth * 5) /100; // left midden
var colorlamp4Y = (sourceHeight * 50) /100;
	
	context.drawImage(showtime, colorlamp1X, colorlamp1Y, 1, 1, 0, 0, 1, 1);
	context.drawImage(showtime, colorlamp2X, colorlamp2Y, 1, 1, 1, 0, 1, 1);
	context.drawImage(showtime, colorlamp3X, colorlamp3Y, 1, 1, 2, 0, 1, 1);
	context.drawImage(showtime, colorlamp4X, colorlamp4Y, 1, 1, 3, 0, 1, 1);
	
    var imageData = context.getImageData(0, 0, 1, 1);
    var data = imageData.data;

function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}

    var p1 = context.getImageData(0 , 0, 1, 1).data; 
    var p2 = context.getImageData(1 , 0, 1, 1).data; 
    var p3 = context.getImageData(2 , 0, 1, 1).data; 
    var p4 = context.getImageData(3 , 0, 1, 1).data; 
    var hex1 = "#" + ("000000" + rgbToHex(p1[0], p1[1], p1[2])).slice(-6);
    var hex2 = "#" + ("000000" + rgbToHex(p2[0], p2[1], p2[2])).slice(-6);
    var hex3 = "#" + ("000000" + rgbToHex(p3[0], p3[1], p3[2])).slice(-6);
    var hex4 = "#" + ("000000" + rgbToHex(p4[0], p4[1], p4[2])).slice(-6);

	showtime.style.webkitBoxShadow = "0px 0px 5px black , 0px -20px " + getblur + " " + getspread + " " + hex3 + ", 0px 20px " + getblur + " " + getspread + " " + hex1 + ", 20px 0px " + getblur + " " + getspread + " " + hex2 + ", -20px 0px " + getblur + " " + getspread + " " + hex4 + "";
		}
	} else if(ambilightfixcolor.checked == true){
	var fixhex = $("ambilightcolorhex").value;
	if(fixhex)fixhex = fixhex;else fixhex = '#ccc';
	showtime.style.webkitBoxShadow = "0px 0px 5px black , 0px -20px " + getblur + " " + getspread + " " + fixhex + ", 0px 20px " + getblur + " " + getspread + " " + fixhex + ", 20px 0px " + getblur + " " + getspread + " " + fixhex + ", -20px 0px " + getblur + " " + getspread + " " + fixhex + "";
	} else if(ambilight4color.checked == true){
	var fix1hex = $("ambilight1colorhex").value;
	var fix2hex = $("ambilight2colorhex").value;
	var fix3hex = $("ambilight3colorhex").value;
	var fix4hex = $("ambilight4colorhex").value;
	if(fix1hex)fix1hex = fix1hex;else fix1hex = '#FF0000';
	if(fix2hex)fix2hex = fix2hex;else fix2hex = '#FFEE00';
	if(fix3hex)fix3hex = fix3hex;else fix3hex = '#00FF00';
	if(fix4hex)fix4hex = fix4hex;else fix4hex = '#0000FF';
	showtime.style.webkitBoxShadow = "0px 0px 5px black , 0px -20px " + getblur + " " + getspread + " " + fix1hex + ", 0px 20px " + getblur + " " + getspread + " " + fix2hex + ", 20px 0px " + getblur + " " + getspread + " " + fix3hex + ", -20px 0px " + getblur + " " + getspread + " " + fix4hex + "";
	}
	
}else{showtime.style.webkitBoxShadow = "";}
}

// Fade engine
//  Variable for the fade in and out effect
var opacity = 0;

var ReducingFinished = true;
var OpacityLevelIncrement = 10;   //  Percentage value: 1-100

//  Function determines whether we show or hide the item referenced by ElementID
function fader(ActionToTake)
{
  DIVElementById = $('example2');
  if (ActionToTake == 'hide')
  { opacity = default_opacity; reduceOpacity(); }
  else if (ActionToTake == 'show')
  { increaseOpacity(); }
}

//  Makes div increase
function increaseOpacity()
{
DIVElementById.style.display = '';
  //  If opacity level is less than default_opacity, we can still increase the opacity
  if ((opacity < default_opacity) && (ReducingFinished == true))
  {
	if ((opacity > (default_opacity-10)) && (ReducingFinished == true)){
    ReducingFinished = true;
    opacity  += (default_opacity - opacity);
    DIVElementById.style.opacity = opacity/100;
	window.requestAnimFrame(increaseOpacity);
	}
	else {
    ReducingFinished = true;
    opacity  += OpacityLevelIncrement;
    DIVElementById.style.opacity = opacity/100;
	window.requestAnimFrame(increaseOpacity);
	}
  }
  else
  {
    ReducingFinished = false;
  }
}

//  Makes div reduce
function reduceOpacity() 
{
  //  If opacity level is greater than 0, we can still reduce the opacity
  if ((opacity > 0) && (ReducingFinished == false))
  {
    ReducingFinished = false;
    opacity  -= OpacityLevelIncrement;
    DIVElementById.style.opacity = opacity/100;
	window.requestAnimFrame(reduceOpacity);
  }
  else
  {
    ReducingFinished = true;

    //  When finished, make sure the DIVElementById is set to remove element
    if (DIVElementById.style.opacity = '0')
    {DIVElementById.style.display = 'none';}
  }
}

// tabel script
    var tabLinks = new Array();
    var contentDivs = new Array();
 
    function showTab() {
      var selectedId = getHash( this.getAttribute('data-tab') );
 
      // Highlight the selected tab, and dim all others.
      // Also show the selected content div, and hide all others.
      for ( var id in contentDivs ) {
        if ( id == selectedId ) {
          tabLinks[id].className = 'navbar-item-selected';
          contentDivs[id].className = 'page';
        } else {
          tabLinks[id].className = 'navbar-item';
          contentDivs[id].className = 'page hidden';
        }
      }
 
      // Stop the browser following the link
      return false;
    }
 
    function getFirstChildWithTagName( element, tagName ) {
      for ( var i = 0; i < element.childNodes.length; i++ ) {
        if ( element.childNodes[i].nodeName == tagName ) return element.childNodes[i];
      }
    }
 
    function getHash( url ) {
      var hashPos = url.lastIndexOf ( '#' );
      return url.substring( hashPos + 1 );
    }

// fade effects control -> not when loaded page
function lightscontrol() {
var jump = $('interval').value;
default_opacity = jump;
if($('onoffrange').value == 0)
{
if($('fadeout').checked == true){ReducingFinished = false;fader('hide');}else{$('example2').style.opacity = 0;$('example2').style.display = 'none';}
}
else{
if($('fadein').checked == true){ReducingFinished = true;fader('show');}else{$('example2').style.opacity = jump/100;$('example2').style.display = 'block';}
}
}

function showValue(newValue){$('interval').value = newValue;$('slider').value = newValue;$('example2').style.opacity = (newValue/100);}
function showambilightblurValue(newValue){$('ambilightrangeblurradius').value = newValue;$('arangeblur').value = newValue;}
function showambilightspreadValue(newValue){$('ambilightrangespreadradius').value = newValue;$('arangespread').value = newValue;}

function test() {
drawImage();

if($('ambilight').checked == true)
{$('arangespread').disabled = false;$('ambilightrangespreadradius').disabled = false;$('arangeblur').disabled = false;$('ambilightrangeblurradius').disabled = false;$('ambilightfixcolor').disabled = false;$('ambilightvarcolor').disabled = false;$('ambilightcolorhex').disabled = false;$('ambilight4color').disabled = false;$('ambilight1colorhex').disabled = false;$('ambilight2colorhex').disabled = false;$('ambilight3colorhex').disabled = false;$('ambilight4colorhex').disabled = false;$('atmosvivid').disabled = false;}
else {$('arangespread').disabled = true;$('ambilightrangespreadradius').disabled = true;$('arangeblur').disabled = true;$('ambilightrangeblurradius').disabled = true;$('ambilightfixcolor').disabled = true;$('ambilightvarcolor').disabled = true;$('ambilightcolorhex').disabled = true;$('ambilight4color').disabled = true;$('ambilight1colorhex').disabled = true;$('ambilight2colorhex').disabled = true;$('ambilight3colorhex').disabled = true;$('ambilight4colorhex').disabled = true;$('atmosvivid').disabled = true;}

$('example2').style.backgroundColor = $('lightcolor').value;
}
	
// Current year
function yearnow(){
var today = new Date(); var y0 = today.getFullYear();$("yearnow").innerText = y0;
}

function checkdarkmode(){
    chrome.storage.sync.get(['darkmode'], function(items){
        darkmode = items['darkmode'];if(darkmode == null)darkmode = false; // default darkmode false

        // dark mode
        if(darkmode == true){
            $('currentdarkmode').innerText = chrome.i18n.getMessage("titledarkmodeon");
            document.body.className = 'dark';
            $('headlamp').src = "icons/icon1@2x.png";
            $('headlamp').srcset = "icons/icon1.png 1x, icons/icon1@2x.png 2x";
            $('headlamp').style.webkitFilter = "invert(1)";
            $('headlamp').style.filter = "invert(1)";
        } else{
            $('currentdarkmode').innerText = chrome.i18n.getMessage("titledarkmodeoff");
            document.body.className = 'light';
            $('headlamp').src = "icons/icon1@2x.png";
            $('headlamp').srcset = "icons/icon1.png 1x, icons/icon1@2x.png 2x";
            $('headlamp').style.webkitFilter = "invert(0)";
            $('headlamp').style.filter = "invert(0)";
        }
    });
}

/* Option page body action */
// Read current value settings
window.addEventListener('load', function(){
    // remove loading screen
    $('loading').style.display = "none";
});

if(window.location.href != exoptionspage){
    document.addEventListener('DOMContentLoaded', domcontentloaded);
}else{
    domcontentloaded();
}

function domcontentloaded(){
checkdarkmode();

if(window.location.href != exoptionspage){

    var condition = navigator.onLine ? "online" : "offline";
    if(condition == "online"){
        fetch(developerwebsite).then(function(response) {
            if(response.status === 200){
                // website is online
                // redirect to there
                window.location.href = exoptionspage;
            }
            else{
                throw new Error(response.statusText);
            }

        }).catch(e=>{
        //is not there
        // use offline page
        // Add the YouTube player
        $("dont-turn-off-the-lights").src = "https://www.youtube.com/embed/?listType=playlist&amp;list=PLfXHh3TKRb4YxE1nyEgbOwphiK8C0JX9f";
        read_options();
        yearnow();
        });
    }else{
        // Add the YouTube player
        $("dont-turn-off-the-lights").src = "https://www.youtube.com/embed/?listType=playlist&amp;list=PLfXHh3TKRb4YxE1nyEgbOwphiK8C0JX9f";
        read_options();
        yearnow();
    }

} else {
    // Add the YouTube player
    $("dont-turn-off-the-lights").src = "https://www.youtube.com/embed/?listType=playlist&amp;list=PLfXHh3TKRb4YxE1nyEgbOwphiK8C0JX9f";
    read_options();
    yearnow();
}

var sharetext = chrome.i18n.getMessage("sharetextd");
var stefanvdurl = ambientaureaproduct;
var stefanvdaacodeurl = encodeURIComponent(stefanvdurl);
$("shareboxgoogle").addEventListener("click", function() {window.open('https://plus.google.com/share?ur\l=' + stefanvdaacodeurl + '', 'Share to Google+','width=600,height=460,menubar=no,location=no,status=no');});
$("shareboxfacebook").addEventListener("click", function() {window.open("https://www.facebook.com/sharer.php?u="+ stefanvdurl + "&t=" + sharetext + "", 'Share to Facebook','width=600,height=460,menubar=no,location=no,status=no');});
$("shareboxtwitter").addEventListener("click", function() {window.open("https://twitter.com/share?url=" + stefanvdaacodeurl + "&text=" + sharetext + "", 'Share to Twitter','width=600,height=460,menubar=no,location=no,status=no');});

var isMenuClick = false;
var menu = document.getElementById('dotmenu');
document.addEventListener('click',()=>{
    if(!isMenuClick){
       //Hide the menu here
       $('dropmenu').className = "hide";
    }
    //Reset isMenuClick 
    isMenuClick = false;
})
menu.addEventListener('click',()=>{
    isMenuClick = true;
})

$("dotmenu").addEventListener('click', function() {
    if($('dropmenu').className == "show"){
        $('dropmenu').className = "hide";
    }else{
        $('dropmenu').className = "show";
    }
});

$("darkpanel").addEventListener('click', function() {
    $('menuToggle').click();
});

$("titleex").addEventListener('click', function() {
    window.open(developerwebsite);
});

$("btnsupport").addEventListener('click', function() {
    window.open(linksupport);$('dropmenu').className = "hide";
});

$("btnactivedarkmode").addEventListener('click', function() {
    chrome.storage.sync.get(['darkmode'], function(items){
        darkmode = items['darkmode'];if(darkmode == null)darkmode = false; // default darkmode false
        // dark mode
        if(darkmode == true){
            $('currentdarkmode').innerText = chrome.i18n.getMessage("titledarkmodeoff");
            $('dropmenu').className = "hide";
            document.body.className = 'light';
            $('headlamp').src = "icons/icon1@2x.png";
            $('headlamp').srcset = "icons/icon1.png 1x, icons/icon1@2x.png 2x";
            $('headlamp').style.webkitFilter = "invert(0)";
            $('headlamp').style.filter = "invert(0)";
            chrome.storage.sync.set({"darkmode":false});
        } else{
            $('currentdarkmode').innerText = chrome.i18n.getMessage("titledarkmodeon");
            $('dropmenu').className = "hide";
            document.body.className = 'dark';
            $('headlamp').src = "icons/icon1@2x.png";
            $('headlamp').srcset = "icons/icon1.png 1x, icons/icon1@2x.png 2x";
            $('headlamp').style.webkitFilter = "invert(1)";
            $('headlamp').style.filter = "invert(1)";
            chrome.storage.sync.set({"darkmode":true});
        }
    });
});

// promotion
$("promotext").innerText = chrome.i18n.getMessage("donatetext");
$("spnpromoaction").innerText = chrome.i18n.getMessage("donatecalltoaction");
$("btnpromoaction").addEventListener('click', function() {window.open(donatewebsite)});

// Detect click / change to save the page and test it.
var inputs = document.querySelectorAll('input');
for (var i = 0; i < inputs.length; i++) {inputs[i].addEventListener('change', test);inputs[i].addEventListener('change', save_options);}

// Close yellow bar
$("managed-prefs-text-close").addEventListener('click', function() {$("managed-prefs-banner").style.display = "none";});

// Slider
$("slider").addEventListener('change', function() {showValue(this.value);save_options();});
$("slider").addEventListener('input', function() {showValue(this.value);save_options();});

// Detect lightcolor change
$("lightcolor").addEventListener('change', function() {$('example2').style.background = this.value;save_options();});

// Interval
$("interval").addEventListener('change', function() {showValue(this.value);save_options();});

// Light switch
$("onoffrange").addEventListener('change', function() {lightscontrol();});

// Arangeblur
$("arangeblur").addEventListener('change', function() {showambilightblurValue(this.value);save_options();});
$("arangeblur").addEventListener('input', function() {showambilightblurValue(this.value);save_options();});
$("ambilightrangeblurradius").addEventListener('change', function() {showambilightblurValue(this.value);save_options();});

// Arangespread
$("arangespread").addEventListener('change', function() {showambilightspreadValue(this.value);save_options();});
$("arangespread").addEventListener('input', function() {showambilightspreadValue(this.value);save_options();});
$("ambilightrangespreadradius").addEventListener('change', function() {showambilightspreadValue(this.value);save_options();});

// Save KB download
$("tabbasic").addEventListener('click', function() {$('dont-turn-off-the-lights').src = "https://www.youtube.com/embed/?listType=playlist&amp;list=PLfXHh3TKRb4YxE1nyEgbOwphiK8C0JX9f";$('welcomeguide').src = "";$("managed-prefs-banner").style.display = "";});
$("tabvisual").addEventListener('click', function() {$('dont-turn-off-the-lights').src = "";$('welcomeguide').src = "";$("managed-prefs-banner").style.display = "";});
$("tabadvan").addEventListener('click', function() {$('dont-turn-off-the-lights').src = "";$('welcomeguide').src = "";$("managed-prefs-banner").style.display = "";});
$("tabguide").addEventListener('click', function() {$('dont-turn-off-the-lights').src = "";$('welcomeguide').src = linkguide;$("managed-prefs-banner").style.display = "none";});
$("tabhelp").addEventListener('click', function() {$('dont-turn-off-the-lights').src = "";$('welcomeguide').src = "";$("managed-prefs-banner").style.display = "";});

$("buttonreportissue").addEventListener('click', function() {window.open(linksupport)});
$("buttonchangelog").addEventListener('click', function() {window.open(linkchangelog)});
$("buttontranslateme").addEventListener('click', function() {window.open(linktranslate)});

// Reset settings
$("resetambientaurea").addEventListener('click', function() {chrome.storage.sync.clear();location.reload();});

// Review box
$("war").addEventListener('click', function() {window.open(writereview);$("sectionreviewbox").style.display = "none";chrome.storage.sync.set({"reviewedlastonversion": chrome.runtime.getManifest().version});});
$("nt").addEventListener('click', function() {$("sectionreviewbox").style.display = "none";chrome.storage.sync.set({"reviewedlastonversion": chrome.runtime.getManifest().version});});

// Aurora Player app box
$("apgetapp").addEventListener('click', function() {window.open(ambientaureaapp);$("sectionauroraplayerappbox").style.display = "none";chrome.storage.sync.set({"applastonversion": chrome.runtime.getManifest().version});});
$("apnt").addEventListener('click', function() {$("sectionauroraplayerappbox").style.display = "none";chrome.storage.sync.set({"applastonversion": chrome.runtime.getManifest().version});});

};