$(document).ready(function(){

	if ( localStorage.getItem("cf") !== null) {
		loadStorage('cf', '#celsiusFarenheit');
	}else{
		localStorage.setItem("cf", "adat");
	}


	$("#celsiusFarenheitInputOK").click(function(){
		x = $("#celsiusFarenheit").val();
		localStorage['cf'] = x;
		$("h4.cf").append(" <span>SAVED<span>");
		$("h4.cf span").delay(1000).fadeOut("slow");
	});


});

function save(adatnev, adat){
	localStorage.setItem(adatnev, adat);
};

function loadStorage(adatnev, hely){
	var loadAdat = localStorage.getItem(adatnev);
	$(hely).val(loadAdat);
}