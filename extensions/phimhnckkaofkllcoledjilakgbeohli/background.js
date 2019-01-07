/*jshint browser: true, jquery: true*/
/* globals moment */
//Cargar Configuracion
if (typeof localStorage.Config === "undefined") {
	localStorage.Config = JSON.stringify({
		avisar: true,
		urlTemporal: {}
	});
}

let Config = JSON.parse(localStorage.Config);


let error = 0;

let Emoti = ["^.^", ":D", "*_*", "\o/", "/o/"];

let msgPing = "initPing", lastPing = 0;

function startPing() {
	//Esta OK Ping
	if (moment().unix() - lastPing > 60 * 3) {
		_gaq.push(['_trackEvent', 'Ping', app.version, msgPing]);
		lastPing = moment().unix();
	}
	setTimeout(startPing, 5 * 1000 * 60);
}

function checkMonkiBu() {

	$.getJSON("https://ext.juicedev.me/monkibuData/Estado.json", function (data, textStatus, jqXHR) {
		//Obtener Canal Extra
		if (data.Extra) {
			chrome.browserAction.setBadgeBackgroundColor({
				"color": "#3498db"
			});

			let rand = Math.floor(Math.random() * (Emoti.length));
			chrome.browserAction.setBadgeText({
				text: Emoti[rand]
			});
			guardarConfig("ExtraMonki", data.CanalExtra);
		} else {
			chrome.browserAction.setBadgeText({
				text: ''
			});
			guardarConfig("ExtraMonki", "");
		}
		//Guardar version en linea y comparar con instalada
		if (compareVersion(data.Version, app.version) > 0) {
			chrome.runtime.requestUpdateCheck(function (status) {
				if (status === "throttled") {
					msgPing = app.version + " desactualizado";
					_gaq.push(['_trackEvent', 'onUpdate', 'throttled']);
				}
			});
			//Distintas versiones, extension desactualizada
			guardarConfig('version', 'desactualizado');
		} else {
			guardarConfig('version', 'actualizado');
		}

		guardarConfig("ExtraDisponible", data.Extra);

		//Guardar Datos Sociales
		guardarConfig("SocialData", data.Social);

		guardarConfig("urlTemporal", {});

		//Resetear errores
		error = 0;
		guardarConfig('error', false);

		//Revisar la hora y checkear que no existen problemas
		let h = jqXHR.getAllResponseHeaders().split("\n");

		for (let i in h) {
			if (h[i].match("Date")) {
				let offset = moment().diff(moment(h[i]), "seconds");
				//offset = (offset < 5 && offset > -5)? 0: offset;
				guardarConfig("offset", offset);
				break;
			}
		}
		//Esta OK Ping
		msgPing = "https://ext.juicedev.me";

		//Revisar ultima apertura, si no se abre el popup en mas de 7 dias se considera inactivo y se revisa menos.
		let ult = moment().diff(Config.ultimaConexion * 1000, 'days');
		if (ult >= 7) {
			guardarConfig("intervalo", 120); //Intervalo de revision de 60 minutos
			_gaq.push(['_trackEvent', 'Inactivo' + ult + " dias"]);
		} else {
			guardarConfig("intervalo", 5); //Intervalo de revision de 5 minutos
		}
	}).fail(function (data) {
		if (typeof data.responseText === "undefined") {
			//Desconectado
			guardarConfig("intervalo", 0.5);
			guardarConfig('error', 'sinConexion');
			return;
		}
		guardarConfig("intervalo", 0.16);
		if (data.status === "503" || data.statusText.match(/Service Unavailable/)) {
			_gaq.push(['_trackEvent', 'Error', "https://ext.juicedev.me", '503: Service Unavailable']);
			//Sacar url de la lista

			guardarConfig("intervalo", 1); //Para tener 10 segundos
		} else if (data.status === "0") {
			//Error 0, nose que es esto :/ ...tampoco tiene sentido enviar evento
			//_gaq.push(['_trackEvent', 'Error', u[a], data.status +': '+ data.statusText]);
		} else {
			if (data.responseText.match(/Authentication|bloqueo|filt|policy_dnied|blacklist|policy_denied|password|Servicios|RomPager/i)) {
				_gaq.push(['_trackEvent', 'Error', "Filtro", data.responseText]);
				guardarConfig('error', 'filtro');
				guardarConfig("intervalo", 1); // No se puede hacer mucho hasta salir del filtro...
				//Poner badge de filtro
				chrome.browserAction.setBadgeBackgroundColor({
					"color": "#ffcc00"
				});
				chrome.browserAction.setBadgeText({
					text: ':C'
				});
			} else {
				_gaq.push(['_trackEvent', 'Error', 'https://ext.juicedev.me', data.status + ': ' + data.statusText + ' | ' + data.responseText]);
			}
		}
		error++;
		if (error > 15) {
			//Hay muchos errores pero igual hago Ping sin url
			msgPing = "Muchos Errores";
			guardarConfig("intervalo", 15);
		}
		guardarConfig('cdnUrl', "http://cdn-jugo.appspot.com");
	}).always(function () {
		setTimeout(checkMonkiBu, Config.intervalo * 60 * 1000); //Se obtiene del Config
	});
}

let app = chrome.app.getDetails(),
	permList;
document.location = "#" + app.version;
document.title = app.name + ' - ' + app.version;

guardarConfig("id", app.id);

$(document).ready(function () {
	//Hacer reload cada un dia para usar la lista de cdn fresca
	moment.tz.add('America/Los_Angeles|PST PDT|80 70|0101|1Lzm0 1zb0 Op0');

	checkMonkiBu();
	//Obtener lista de Permisos
	chrome.permissions.getAll(function (permisos) {
		permList = permisos.origins;
		guardarConfig("ContentScript", permList);
		addCors();
	});

	startPing();
});

//Enviar config a ext
let csReady = false;
chrome.runtime.onMessage.addListener(function (mensaje, sender, respuesta) {
	if (mensaje.get === "InitConfig") {
		//console.log("Init Config");
		csReady = false;
		return;
	}
	if (mensaje.get === "Config") {
		//console.log("Obtener Config");
		if (csReady) {
			respuesta({
				Config: localStorage.Config
			});
			addCors();
		} else {
			respuesta(false);
			chrome.permissions.getAll(function (data) {
				permList = data.origins;
				//console.log("Obteniendo Lista de permisos");
				//console.info(data.origins);
				guardarConfig("ContentScript", permList);
				//console.log("Lista OK!");

				csReady = true;
			});
		}
	}
});

function updateExtension(details) {
	try {
		_gaq.push(['_trackEvent', 'onUpdate', 'Actualizando a ' + details.version]);
		chrome.runtime.reload();
	} catch (e) {
		_gaq.push(['_trackEvent', 'onUpdate', 'Error...']);
		setTimeout(function () {
			updateExtension(details);
		}, 300000);
	}
}

// Listener para cuando exista actualizacion
chrome.runtime.onUpdateAvailable.addListener(function (details) {
	_gaq.push(['_trackEvent', 'onUpdate', details.version + ' disponible']);
	updateExtension(details);
});

//Listener de instalacion o actualizacion
chrome.runtime.onInstalled.addListener(function (details) {
	let f = "",
		g = "",
		e = "";
	switch (details.reason) {
		case "install":
			e = "Instalacion";
			f = app.version;
			break;
		case "update":
			e = "Actualizacion";
			f = app.version;
			g = details.previousVersion;
			break;
		default:
			e = details.reason;
	}
	_gaq.push(['_trackEvent', e, f, g]);
});

function guardarConfig(key, data) {
	let c = JSON.parse(localStorage.Config);
	c[key] = data;
	localStorage.Config = JSON.stringify(c);
	Config = JSON.parse(localStorage.Config);
}

//Funcion para aceptar CORS de ciertas urls especiales
let responseListener;

function addCors() {
	chrome.webRequest.onHeadersReceived.removeListener(responseListener);

	let CorsHeaders = [{
		"name": "Access-Control-Allow-Origin",
		"value": "*"
	}];

	responseListener = function (details) {
		let headers = details.responseHeaders,
			l = headers.length,
			np = true;

		for (let i = 0; i < l; ++i) {
			let n = headers[i].name,
				v = headers[i].value;

			if (n === 'Access-Control-Allow-Origin' && v !== "*") {
				headers[i].value = "*";
				np = false;
				break;
			}
		}

		if (np) {
			headers = Object.assign(headers, CorsHeaders);
			//console.info("Allow: " + details.url);
		}

		//console.groupCollapsed('Response');
		//console.log(JSON.stringify(details, null, 2));
		//console.groupEnd('Response');

		return {
			responseHeaders: headers
		};
	};
	chrome.webRequest.onHeadersReceived.addListener(responseListener, {
		urls: permList,
		types: ["xmlhttprequest"]
	}, ["responseHeaders", "blocking"]);
	console.info("Cors Ready!");
}

function addurlTemporal(url, ref) {

	url = url.match(/(https?):..([^\/]+)/);
	let urlC = url[2].match(/\d+\.\d+\.\d+\./) ? url[2] : "*." + url[2];
	let urlFinal = url[1] + "://" + urlC + "/*",
		urlKey = url[2].replace(/[^\w\d]/g, "");

	//Filtrar lista
	let listaFinal = getListaUrlTemporal();

	listaFinal[urlKey] = {"time": moment().unix(), "referer": ref, "url": urlFinal};

	guardarConfig("urlTemporal", listaFinal);

	listenerReferer();
}


function getListaUrlTemporal() {
	let listaTemporal = Config.urlTemporal;

	//Filtrar lista
	let listaFinal = {};
	//console.log(listaTemporal);
	for (let i in listaTemporal) {
		if (moment().unix() - listaTemporal[i].time < 300) {
			listaFinal[i] = listaTemporal[i];
		}
	}

	return listaFinal;
}

function extendUrlTemporal(key) {
	let listaTemporal = Config.urlTemporal;

	listaTemporal[key].time = moment().unix();
}

listenerReferer(true);

function listenerReferer(init = false) {
	let listaUrl = getListaUrlTemporal(),
		urlFilter = [];

	for (let i in listaUrl) {
		urlFilter.push(listaUrl[i].url);
	}

	if (!init) {
		chrome.webRequest.onBeforeSendHeaders.removeListener(changeReferer);
		console.info("Recargando listener...\n" + urlFilter);
	}

	addListenerReferer(changeReferer, urlFilter, false);
}

function addListenerReferer(fRef, urlFilter, reload = false) {
	let Base = ["*://*/*jref=*", "*://*/*jref_2=*", "*://*/*jNoRef*"];
	let urlFilt = Base.concat(urlFilter);

	console.log("addListenerReferer\nLista: " + JSON.stringify(urlFilt));

	//Custom Referer
	if (!reload) {
		chrome.webRequest.onBeforeSendHeaders.addListener(fRef, {
			urls: urlFilt
		}, ['requestHeaders', 'blocking']);

		//chrome.webRequest.handlerBehaviorChanged();
	}
}

function changeReferer(details) {
	let headers = details.requestHeaders,
		url = new URL(details.url);

	let normal = false,
		split = [],
		newReferer,
		headerType;

	let urlKey = url.host.replace(/[^\w\d]/g, ""),
		tipoCambioRef = url.href.match(/(jref_2|jNoRef)/);

	tipoCambioRef = tipoCambioRef ? tipoCambioRef[1] : false;

	switch (tipoCambioRef) {
		case "jref_2":
			newReferer = atob(getParams(url.href)["jref_2"]);
			break;
		case "jNoRef":
			newReferer = url.origin;
			break;
		default:
			//Agregar referer segun el Config;
			let O = Config.urlTemporal[urlKey];
			newReferer = (typeof O === "undefined") ? url.origin : Config.urlTemporal[urlKey].referer;
			tipoCambioRef = "newJref";
			break;
	}

	checkLista(url.href, newReferer, urlKey);

	let addHeader = [];

	for (let i in headers) {
		if (headers[i].name === "Referer" || headers[i].name === "Origin") {
			headers[i].value = decodeURIComponent(newReferer);
		}
	}

	let finalHeaders = Object.assign(headers, addHeader);

	console.groupCollapsed("%cRequest Referer: " + url, "color:green;");
	console.log(JSON.stringify(finalHeaders, null, 2));
	console.groupEnd();

	return {
		requestHeaders: finalHeaders
	};
}

function checkLista(url, newReferer, urlKey) {
	if (urlKey in getListaUrlTemporal()) {
		//console.log("%cExtendiendo tiempo de " + urlKey, "color:blue;");
		extendUrlTemporal(urlKey);
	} else {
		//console.log("%cAgregando " + urlKey, "color:blue;");
		addurlTemporal(url, newReferer);
	}
}

//Content script
chrome.webRequest.onCompleted.addListener(function (details) {
	console.log("Corriendo script!");
	console.log(details);
	chrome.tabs.executeScript(details.tabId, {
		file: "script/goMonki.v3.js",
		allFrames: true,
		runAt: "document_idle"
	});
}, {
	urls: ["*://*/*jdev=*"]
}, []);

//Google Analytics
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-1985086-13']);
_gaq.push(['_set', 'page', "background." + app.version + ".html"]);
_gaq.push(['_trackPageview']);


//Revisar si esta version es nueva
let act = true;
if (typeof localStorage.version === "undefined") {
	localStorage.version = "";
	//_gaq.push(['_trackEvent', 'Instalacion', app.version]);
	act = false;
}

if (localStorage.version !== app.version) {
	localStorage.actualizacion = true;
	localStorage.version = app.version;
}

if (!String.format) {
	String.format = function (format) {
		let args = Array.prototype.slice.call(arguments, 1);
		return format.replace(/{(\d+)}/g, function (match, number) {
			return typeof args[number] !== "undefined" ? args[number] : match;
		});
	};
}

function compareVersion(a, b) {
	let i, diff;
	let regExStrip0 = /(\.0+)+$/;
	let segmentsA = a.replace(regExStrip0, '').split('.');
	let segmentsB = b.replace(regExStrip0, '').split('.');
	let l = Math.min(segmentsA.length, segmentsB.length);

	for (i = 0; i < l; i++) {
		diff = parseInt(segmentsA[i], 10) - parseInt(segmentsB[i], 10);
		if (diff) {
			return diff;
		}
	}
	return segmentsA.length - segmentsB.length;
}

/**
 * Get the URL parameters
 * source: https://css-tricks.com/snippets/javascript/get-url-variables/
 * @param  {String} url The URL
 * @return {Object}     The URL parameters
 */
function getParams(url) {
	let params = {};
	let parser = document.createElement('a');
	parser.href = url;
	let query = parser.search.substring(1);
	let vars = query.split('&');
	for (let i = 0; i < vars.length; i++) {
		let pair = vars[i].split('=');
		params[pair[0]] = decodeURIComponent(pair[1]);
	}
	return params;
}