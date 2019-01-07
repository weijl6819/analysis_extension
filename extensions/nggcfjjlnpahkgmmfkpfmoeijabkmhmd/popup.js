$(function() {
	var oDate2 = new Date(localStorage["lastDate"]);
	for (var i=0; i<10; i++) {
		a = JSON.parse(localStorage["n"+i]);
		if (i == 0) { 
			newDate = a[0]; 
		};
		var oDate = new Date(a[0]);
		$('body').append('<div id="n'+i+'" class="'+((oDate - oDate2) > 0?"newpost":"post")+'"><div class="title">'+a[2]+'</div><div class="meta"><span class="date">'+(oDate.getDate()<10?"0":"")+oDate.getDate()+'.'+(oDate.getMonth()+1<10?"0":"")+(oDate.getMonth()+1)+'.'+oDate.getFullYear()+'&nbsp; &nbsp;'+(oDate.getHours()<10?"0":"")+oDate.getHours()+':'+(oDate.getMinutes()<10?"0":"")+oDate.getMinutes()+'</span></div></div>');
	};
	chrome.browserAction.setBadgeText({'text': ""});
	localStorage["lastDate"] = newDate;
	$('div.post, div.newpost').click(function() {
		n = $(this).attr('id');
		a = JSON.parse(localStorage[n]);
		chrome.tabs.create({url: a[3]});
	});
});