$( document ).ready(function() {
$('.title').html(addon['title']);
$('.storeID').html(addon['storeID']);
document.getElementsByClassName('fbShare')[0].onclick = function() { 
	window.open("http://www.facebook.com/sharer.php?u=https%3A%2F%2Fchrome.google.com%2Fwebstore%2Fdetail%2F" + addon['storeID'])
	}
	document.getElementsByClassName('tweet')[0].onclick = function() { 
	window.open("https://twitter.com/intent/tweet?text=" + encodeURI(addon['shortened']) + "&source=webclient")
	}
	document.getElementsByClassName('plusone')[0].onclick = function() { 
	window.open("https://plus.google.com/share?url=https%3A%2F%2Fchrome.google.com%2Fwebstore%2Fdetail%2F" + addon['storeID'])
	}
});