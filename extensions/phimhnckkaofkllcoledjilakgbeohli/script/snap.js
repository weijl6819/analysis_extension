$(document).ready(function(){
	Snaps = JSON.parse(localStorage.Snaps);
	if(Snaps.length >= 5){
		Snaps.splice(0,1);
	}
	localStorage.Snaps = JSON.stringify(Snaps);
	
	window.resizeTo(600, 600);
	$("#snap").html('<img src="'+ Snaps[3] +'">');
	$("#mini_1").html('<img src="'+ Snaps[2] +'">');
	$("#mini_2").html('<img src="'+ Snaps[1] +'">');
	$("#mini_3").html('<img src="'+ Snaps[0] +'">');
	/*$("img").unbind().click(function(){
		var url = this.src.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
    location.href = url;
	});*/
});