/*jshint browser: true, jquery: true*/
/*globals chrome*/
var _gaq = _gaq || [];
var app = chrome.app.getDetails();
var ver = app.version;
var cs = app.content_scripts;

/* Google Analytics */
_gaq.push(['_setAccount', 'UA-1985086-7']);
_gaq.push(['_trackPageview']);

var actualizacion = false;
if (localStorage.actualizacion == "true") {
	actualizacion = true;
	localStorage.version = ver;
	localStorage.actualizacion = false;
}

var modUrl = JSON.parse(localStorage.modUrl),
	p = [];
$(document).ready(function () {
	var m;
	for (var i in cs) {
		m = cs[i].matches;
		for (var j in m) {
			p.push(m[j]);
		}
	}
	p.sort();
	for (i in p) {
		$(".l_acceso").append("<li>" + p[i] + "</li>");
	}

	modUrl.sort();
	$(".l_acceso").append("<div id='ademas'>" + decodeURIComponent("Adem%E1s") + " se modifican los headers de: </div>");
	for (i in modUrl) {
		$(".l_acceso").append("<li>" + modUrl[i] + "</li>");
	}
	$(".version").text("Version actual: " + ver);
	if (actualizacion) {
		$(".actualizacion").show();
	}
	$("#link_pr").click(function () {
		_gaq.push(['_trackEvent', 'Privacidad']);
		chrome.tabs.create({
			'url': 'http://ayuda.juicedev.me/post/41314599166/privacidad'
		});
	});
	$("#corto").click(function () {
		_gaq.push(['_trackEvent', 'Fail']);
		chrome.tabs.create({
			'url': 'http://ayuda.juicedev.me/post/55664441027/algo-corto'
		});
	});
	//Opciones
	var Config = JSON.parse(localStorage.Config);
	$("input[id=avisar]").attr('checked', Config.avisar).change(function () {
		Config.avisar = this.checked;
		localStorage.Config = JSON.stringify(Config);
	});
});