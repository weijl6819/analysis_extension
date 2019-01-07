var hashes = window.location.hash.substr(1).split("#");
url = atob(hashes[0]);
var host = url.split("/")[2];
var errorms = atob(hashes[1]).substr(5);
var message = host + " is not available.";
document.title = message;
document.getElementsByClassName("error-code")[0].innerHTML = errorms;
try {
document.getElementsByTagName("strong")[0].innerHTML = host;
} catch(err) {
console.log(err);
}
document.addEventListener("keydown", function(e) {
	if (((e.which || e.keyCode) == 116) || ((e.ctrlKey || e.metaKey) && e.keyCode == 82)) {
		document.location.replace(url); 
		e.preventDefault();
	}
});

var xhr = new XMLHttpRequest();
xhr.open("HEAD", url, true);
xhr.onreadystatechange = function() {
  if (xhr.readyState == 4 && xhr.status > 0) {
    document.location.replace(url);
  }
}
xhr.send();

try {
new Runner(".interstitial-wrapper");
} catch(err) {

}

footer1 = document.createElement('a');
footer1.href = url;
footer1.innerHTML = url;
footer1.setAttribute("style", 'position: absolute; bottom: 2%; left: 2%; color: #909090;');
document.body.appendChild(footer1);
