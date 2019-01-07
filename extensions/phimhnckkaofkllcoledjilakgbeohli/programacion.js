try {
	prog = JSON.parse(localStorage.programacion);
} catch(e){
	localStorage.programacion = "{}";
	prog = {};
}

//obtProg();
duracion();
llenar();
$(document).ready(function(){
	
});
var ready = true;
function obtProg(){
	var p = {};
	$.ajaxSetup({async: false});
	var canales = ["Canal_13", "13C", "CHV", "TVN", "UCV", "CNN_Chile", "Mega", "La_Red", "CDO", "ETC_TV"];
	for(i in canales){
		//Si sobrepasan las 12 horas bajar denuevo
		try {
			if(moment().unix() - prog[canales[i]].timestamp <= 43200) continue
		}catch(e){}
		data = $.getJSON("http://app.juicedev.me/prog/"+ canales[i] +".json");
		data = JSON.parse(data.responseText);
		
		p.progCanal = canales[i];
		p.data = data;
		p.timestamp = moment().unix();
		
		loc = JSON.parse(localStorage.programacion);
		loc[canales[i]] = p;
		localStorage.programacion = JSON.stringify(loc);

	}
	ready = true;
}
function duracion(){
	for (i in prog){
		data = prog[i].data
		for(j in data){
			if(data.length-1 == j) continue;
			d = data[parseInt(j)+1].i - data[j].i;
			data[j].d = parseInt(d/60);
		}
	}
}
function llenar(){
	if(!ready){
		console.log(ready);
		setTimeout(function(){llenar()}, 1000);
		return
	}
	//inicio dia
	ini = moment().startOf('day').unix();
	ultima = 0;
	for(i in prog){
		data = prog[i].data
		if(ini >= data[data.length - 1].i) continue;
		console.log(prog[i].progCanal);
		$('<div class="'+ i +'"></div>').appendTo(".logos");
		$('<ul class="'+ i +'"></div>').appendTo(".prog");
		data = prog[i].data
		acum = 0;
		for(j in data){
			acum = data[j].i - ini;
			$('<li style="width: '+ (6*data[j].d-10) +'px; left: '+ acum/10 +'px" data-duracion="'+ data[j].d +'" data-time="'+ moment(data[j].i*1000).format("HH:mm") +'"><div>'+ moment(data[j].i*1000).format("H:mm") +'</div><div>'+ data[j].p +'</div></li>').appendTo("ul."+ i);
			ultima = (data[j].i > ultima)? data[j].i : ultima;
		}
	}
	//Llenar el Head
	for(i = 0; i<= (ultima - ini)/(30*60); i++){
		$('<li data-hora="'+ moment(ini*1000 + i*60000*30).format("HH") +'" style="left: '+ i*180 +'px; width: 180px">'+ moment(ini*1000 + i*60000*30).format("HH:mm") + '</li>').appendTo(".head");
	}
	//Hacer scroll automatico
	scr = $(".head li[data-hora="+ moment().format("H") +"]").get(0).offsetLeft;
	$(".prog").scrollLeft(scr);
}