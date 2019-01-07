function alertar(){
	setTimeout(function(){
		$("#loading").fadeOut("fast");
	}, 2000);
}

$(document).ready(function() {	
	canal = location.hash.slice(1).split("-")[0];
	url =  localStorage['url'] +"/yuzbot/tv/canal_"+ canal +".json";
	$.ajaxSetup({cache: false});
	$.getJSON(url, function(data) {
		if(prog.progCanal != data.titulo) document.title = data.titulo;
		codigo = data.codigo.replace(/http:\/\/cdn.*pot.com/g, localStorage["url"])
		$("#mediaspace").html(codigo);
		document.getElementsByTagName("iframe")[0].addEventListener("load", alertar)
	})
})