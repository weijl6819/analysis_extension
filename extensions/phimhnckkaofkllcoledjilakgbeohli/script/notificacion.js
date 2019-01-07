var _gaq = _gaq || [];
var app = chrome.app.getDetails();
var ver = app.version;
var cs = app.content_scripts;

function guardarConfig(a, b){
	var config = JSON.parse(localStorage.Config);
	config[a] = b;
	localStorage.Config = JSON.stringify(config);
}

/* Google Analytics */
_gaq.push(['_setAccount', 'UA-1985086-7']);
_gaq.push(['_trackPageview']);

if(localStorage.actualizacion == "true"){
	actualizacion = true;
	localStorage.version = ver;
	localStorage.actualizacion = false;
} else {
	actualizacion = false;
}

modUrl = JSON.parse(localStorage.modUrl);


$(document).ready(function(){
	$(".version").text(ver);
	actualizacion = true;
	if (actualizacion){
		$(".actualizacion").show();
	}
	
	$(".actualizacion div").click(function(){
		chrome.tabs.create({
            'url': 'changelog.html'
        });
	})
	//Opciones
	Config = JSON.parse(localStorage.Config);
	$("input[id=avisar]").attr('checked', Config.avisar).change(function(){
		guardarConfig('avisar', this.checked);
	});
	
});