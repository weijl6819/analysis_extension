/*jshint browser: true, jquery: true*/
/* globals angular, moment, chrome */

try {
	var Config = JSON.parse(localStorage.Config);
} catch (e) {
}


var extensionTv = angular.module('MonkiBuExtension', []);
extensionTv.filter('orderObjectBy', function () {
	return function (items, field, reverse) {
		var filtered = [];
		angular.forEach(items, function (item) {
			filtered.push(item);
		});
		filtered.sort(function (a, b) {
			return (a[field] > b[field] ? 1 : -1);
		});
		if (reverse) {
			filtered.reverse();
		}
		return filtered;
	};
});


var ch = chrome.app.getDetails(),
	_gaq = _gaq || [];
extensionTv.controller('BodyControl', function ($scope) {
	$scope.ready = false;
	$scope.Pais = "Chile";
	$scope.Alerta = txt.filtro;
	$scope.Error = Config.error;
	$scope.Extra = Config.ExtraMonki;
	$scope.Social = Config.SocialData;
	$scope.ExtraExist = Config.ExtraDisponible;
	obtenerTV($scope);
	$scope.OpenCanal = function () {
		var c = this.Canal;
		_gaq.push(['_trackEvent', 'Canales', c.nombre]);
		//window.open('http://ext.juicedev.me/TV/index.html#' + c.senal + '|' + ch.version + '|' + c.nombre, '', 'width = 623, height = 396');
		window.open('http://ext.juicedev.me/MonkiTVng/' + ch.version + '/📺/' + c.senal + "", '', 'width= 645, height=396');
	};
	$scope.OpenExtra = function () {
		var c = this.Canal;
		_gaq.push(['_trackEvent', 'Canales', this.title]);
		//window.open('http://ext.juicedev.me/v2/mas.html#' + c.nombre + '-' + c.nombre + "|" + ch.version, '', 'width= 645, height=396');
		window.open('http://ext.juicedev.me/MonkiTVng/' + ch.version + '/📡/' + c.i + '/' + c.n + '', '', 'width= 645, height=396');
	};
	$("#Mosaico").click(function () {
		_gaq.push(['_trackEvent', 'Canales', 'Mosaico']);
		window.open('http://www.monkibu.net/Mosaico/?utm_source=' + ch.name + ' - ' + ch.version + '&utm_medium=ExtensionPopup&utm_campaign=Extension2017', '', 'width = 976, height=578');
	});
	$("#Radio").click(function () {
		_gaq.push(['_trackEvent', 'Canales', 'Radio']);
		window.open('https://www.monkibu.net/Radio?utm_source=' + ch.name + ' - ' + ch.version + '&utm_medium=ExtensionPopup&utm_campaign=Extension2017', '', 'width = 666, height = 473');
	});

	$("a .twitter").click(function () {
		_gaq.push(['_trackEvent', 'Compartir', 'Twitter']);
		window.open('https://twitter.com/intent/tweet?text=MonkiBu TV y Radios Online&amp;url=https://chrome.google.com/webstore/detail/phimhnckkaofkllcoledjilakgbeohli', '', 'width=600,height=253');

	});
	$("a .facebook").click(function () {
		_gaq.push(['_trackEvent', 'Compartir', 'Facebook']);
		window.open("https://www.facebook.com/sharer/sharer.php?&u=https%3A%2F%2Fchrome.google.com%2Fwebstore%2Fdetail%2Ftv-y-radios-de-chile%2Fphimhnckkaofkllcoledjilakgbeohli", '', 'width=600,height=575');
	});
	$("a .gplus").click(function () {
		_gaq.push(['_trackEvent', 'Compartir', 'Google Plus']);
		window.open("https://plus.google.com/share?url=https://chrome.google.com/webstore/detail/phimhnckkaofkllcoledjilakgbeohli", '', 'width=500,height=660');
	});

	$("#Changelog").click(function () {
		_gaq.push(['_trackEvent', 'Changelog']);
		chrome.tabs.create({
			'url': 'changelog.html'
		});
	});

	$("#Disclaimer").click(function () {
		_gaq.push(['_trackEvent', 'Disclaimer']);
		chrome.tabs.create({
			'url': 'http://ayuda.juicedev.me/post/135679763737/disclaimer'
		});
	});
	$("#Ayuda").click(function () {
		_gaq.push(['_trackEvent', 'Soporte']);
		chrome.tabs.create({
			'url': 'http://ayuda.juicedev.me/post/9573608544/soporte'
		});
	});
	$("#Privacidad").click(function () {
		_gaq.push(['_trackEvent', 'Privacidad']);
		chrome.tabs.create({
			'url': 'http://ayuda.juicedev.me/post/41314599166/privacidad'
		});
	});

	function obtenerTV() {
		if (!popupReady) {
			setTimeout(obtenerTV, 100);
			return;
		}

		if (moment().diff(Config.ultimaConexion * 1000, 'seconds') >= 10 || typeof Config.dataCanalesNew !== "object") { //Default 600 segundos

			$.ajaxSetup({
				cache: false
			});

			$.getJSON("https://ext.juicedev.me/monkibuData/Canales.json", function (data) {
				guardarConfig("dataCanalesNew", data);
				$scope.Canales = Config.dataCanalesNew;
				$scope.ready = true;
				$scope.$digest();
			}).fail(function (jqxhr, textStatus, error) {
				var err = textStatus + ", " + error;
				console.info("Request Failed: " + err);
				//Mostrar aviso de que no hay conexion
				if (Config.error !== "filtro") {
					$(".alert").show().text(txt.sinConexion);
				}
			}).complete(function () {
				// Guardar la ultima apertura
				guardarConfig("ultimaConexion", moment().unix());

			});

		} else {
			$scope.Canales = Config.dataCanalesNew;
			$scope.ready = true;
			$scope.$digest();
		}
	}
});
var popupReady = false;
window.onload = function () {
	popupReady = true;
	/* Google Analytics */
	getAnalitycs();
	/* Cargar FbFrame */
	$(".fbFrame").attr("src", "https://www.monkibu.net/Home/LikeFB.html");
};

function getAnalitycs() {
	_gaq.push(['_setAccount', 'UA-1985086-7']);
	_gaq.push(['_set', 'page', '/Popup.' + ch.version + '.html']);
	_gaq.push(['_trackPageview']);
	$.getScript('https://ssl.google-analytics.com/ga.js');
}

//Funcion para guardar configuracion en el localStorage;
//a: clave, b: valor
function guardarConfig(a, b) {
	var config = JSON.parse(localStorage.Config);
	config[a] = b;
	localStorage.Config = JSON.stringify(config);
	Config = JSON.parse(localStorage.Config);
}

var txt = {
	sinConexion: "Sin conexion a internet...",
	filtro: "Estas detrás de un filtro que impide el correcto funcionamiento de la extensión. Puedes intentar ver algunas señales pero no existe garantía de que funcionen."
};