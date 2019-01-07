/*jshint browser: true, jquery: true*/
/*globals chrome, angular*/

var Hash = getUrlVars(),
	urlScheme = Hash.url,
	//urlScheme = 'http://*.' + url + "/*",
	urlBack = decodeURIComponent(Hash.urlBack);

window.resizeTo(750, 670);

var extended = angular.module('Extended', []);

extended.controller('BodyController', function ($scope) {
	$scope.urlExtra = Hash.url.replace(/\*\./,"").replace(/\/\*/, "");
	$scope.Senal = decodeURI(Hash.canal);
	$scope.Agree = "Estoy de acuerdo";
	$scope.NoAgree = "No estoy de acuerdo";
	chrome.permissions.getAll(function (permisos) {
		$scope.Permisos = permisos.origins;
		$scope.$digest();
	});
	_gaq.push(['_trackEvent', 'Ping', "Permisos", Hash.url]);
	$(".Agree").click(function () {
		$(".Agree").addClass("big");
		$(".Disagree").hide();
		$scope.Agree = "Casi listo! Ahora debes \"Permitir\" en la ventana que aparecerá a continuación";
		$scope.$digest();
		chrome.permissions.request({
			origins: [urlScheme]
		}, function (granted) {
			$(".Disagree").show();
			if (granted) {
				_gaq.push(['_trackEvent', 'Permiso Obtenido', Hash.url]);
				$scope.Agree = "Todo bien, volviendo al canal ^^";
			} else {
				_gaq.push(['_trackEvent', 'Permiso Denegado', Hash.url]);
				$scope.Agree = "Nada sucedió, volviendo al canal...";
			}
			$scope.$digest();
			setTimeout(function () {
				location.href = urlBack;
			}, 3000);
		});
	});

	//No de acuerdo
	$(".Disagree").click(function () {
		_gaq.push(['_trackEvent', 'Permiso Denegado', Hash.url]);
		$scope.NoAgree = "Nada sucedió, volviendo al canal...";
		$scope.$digest();
		setTimeout(function () {
			location.href = urlBack;
		}, 3000);
	});
	getAnalitycs();
});


var ch = chrome.app.getDetails(),
	_gaq = _gaq || [];

function getAnalitycs() {
	_gaq.push(['_setAccount', 'UA-1985086-7']);
	_gaq.push(['_set', 'page', '/Extended.' + ch.version + '.html']);
	_gaq.push(['_trackPageview']);
	$.getScript('https://ssl.google-analytics.com/ga.js');
}

function getUrlVars() {
	var vars = [],
		hash;
	var hr = window.location.href;
	hr = (hr.indexOf('?') == -1) ? hr.indexOf('#') : hr.indexOf('?');
	var hashes = window.location.href.slice(hr + 1).split('&');
	for (var i = 0; i < hashes.length; i++) {
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}
	return vars;
}