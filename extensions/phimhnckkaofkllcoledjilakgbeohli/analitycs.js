//Player
// Analitycs
var app = chrome.app.getDetails();
var ver = app.version;
var hash = location.hash.replace(/\s/g,'_');
var _gaq = _gaq || [];

$(document).ready(function(){
	//Obtener programacion
	prog.start();
	//Histats
	HiStats();
	//Analitycs
	_gaq.push(['_setAccount', 'UA-1985086-7']);
	_gaq.push(['_set', 'page', hash]);
	_gaq.push(['_trackPageview']);
	$.getScript('https://ssl.google-analytics.com/ga.js');
	Ping();
});
//Ping Analytics
function Ping(){
	if(!prog.ready){
		ping = setTimeout(function(){
			Ping();
		}, 5000);
		return;
	}
	try {
		_gaq.push(['_trackEvent', 'Ping', prog.progCanal, prog.programa]);
	} catch(e){
		_gaq.push(['_trackEvent', 'Ping', document.title]);
	}
	ping = setTimeout(function(){
		Ping();
	}, 300000);
}
//HiStats
function HiStats(){
	if(!prog.ready){
		setTimeout(function(){
			HiStats();
		}, 1000);
		return;
	}
	Histats.start(1,1500018,4,0,0,0,00010000);
	Histats.B_U();
	$('<img src="http://s4.histats.com/stats/0.php?'+ Histats.u +'"></img>').appendTo("body");
}

document.title = (location.href.match("mas"))? location.hash.slice(1).split("-")[1] : location.hash.slice(1);

if(typeof localStorage.programacion == "undefined") localStorage.programacion = "{}";
var progError = 0;
prog = {
		canal: function(){
			return document.title.split(/\s?\|\s?/)[0];
		},
		programa: "",
		ready: false,
		status: "idle",
		get: function(a){
			//console.log(JSON.parse(localStorage.Config).offset);
			tim = moment().utc().unix() - (JSON.parse(localStorage.Config).offset);
			var b = {now: "", next: ""};
			for(i in a){
				if(a[i].i <= tim){
					n = (i == (a.length - 1))? 0 : parseInt(i)+1;
					b.now = a[i].p;
					b.next = a[n].p;
				}	
			}
			return b;
		},
		progCanal: "",
		start: function(a){
			var canal = (typeof a == "undefined")? this.canal() : a;
			timer = setTimeout(function(){prog.start();}, 1000);
			
			try {
				if(this.programa != s.now){
					_gaq.push(['_trackEvent', 'Programas', canal, s.now]);
					this.programa = s.now;
					prog.ready = true;
				}
			} catch(e){}

			if(typeof prog.data == "object" && this.progCanal == canal && typeof prog.data.error == "undefined"){
				s = prog.get(prog.data);
				document.title = canal +' | '+ s.now;
				prog.status = "OK";
				return;
			}
			if(this.status == "noProg"){
				return;
			}
			try {
				p = JSON.parse(localStorage.programacion)[canal.replace(/\s+/g,"_")];
				prog.data = p.data;
				prog.timestamp = p.timestamp;
				prog.progCanal = p.progCanal;
				if (moment().unix() - prog.timestamp < 600) return;
			} catch(e){
				//console.log('No hay programacion en el localStorage.');
			}
			
			$.ajaxSetup({cache: false, async: false});
			$.getJSON("http://api.uno.juicedev.me/prog/"+ canal.replace(/\s+/g,"_") +".json", function(data){
				prog.progCanal = canal;
				prog.data = data;
				prog.timestamp = moment().unix();
				if(typeof prog.data.error == "string"){
					prog.status = "noProg";
					prog.ready = true;
					return;
				}
				loc = JSON.parse(localStorage.programacion);
				loc[canal.replace(/\s+/g,"_")] = prog;
				localStorage.programacion = JSON.stringify(loc);
			}).fail(function(data){
				clearTimeout(timer);
				if(progError > 2) return;
				progError++;
				
				_gaq.push(['_trackEvent', 'Error programacion', data.status, data.statusText]);
						
				setTimeout(function(){
					prog.start();
				}, 10000);
			});
		}
}