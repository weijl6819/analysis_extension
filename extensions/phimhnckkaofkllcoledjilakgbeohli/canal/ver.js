/*if(typeof localStorage.Snaps == "undefined") localStorage.Snaps = "";
Snaps = JSON.parse(localStorage.Snaps);
*/
var canal = location.hash.replace(/\s+/g,"_").slice(1);

$(document).ready(function(){
	document.getElementsByTagName("iframe")[0].addEventListener("load", alertar);
	$.ajaxSetup({cache: false});
	$.getJSON("http://app.juicedev.me/ext/senales/"+ canal +".json", function(data){
		if(data[canal].length == 1){
			if(data[canal][0].match("redirect")){
				location.href = data[canal][0];
			} else {
				$("iframe").attr("src", data[canal][0]);
			}
		}else {
			$("iframe").attr("src","http://app.juicedev.me/ext/flash.html"+location.hash.replace(/\s/g,"_"));
		}	
	});	
	/*$(".screenshot").click(function(){
		chrome.tabs.captureVisibleTab(null, {format: "png"}, function (image) {
				Snaps.push(image);
				localStorage.Snaps = JSON.stringify(Snaps);
		});
		chrome.windows.create({'url': 'snapshot.html', 'type': 'popup'});
	});	*/
});
function alertar(){
	$("#loading").fadeOut("fast");
}