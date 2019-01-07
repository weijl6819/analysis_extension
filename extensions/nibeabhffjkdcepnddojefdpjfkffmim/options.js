var bp = chrome.extension.getBackgroundPage();

function ver(s) {
	var v = parseInt(s.value);
	if (v=='NaN') v=0;
	else  if (v>255)  v = 255;
	else  if (v<0)  v = 0;
	return v;
}

function reset() {
	document.getElementById("r").value=bp.defr
	document.getElementById("g").value=bp.defg
	document.getElementById("b").value=bp.defb
	document.getElementById("fil").value=bp.default_filter
	document.getElementById("extra").value=bp.default_extra
	document.getElementById("sdp").checked=true
}

function save() {
	localStorage.r = bp.r = ver(document.getElementById("r"))
	localStorage.g = bp.g = ver(document.getElementById("g"))
	localStorage.b = bp.b = ver(document.getElementById("b"))
	localStorage.fil = bp.fil = document.getElementById("fil").value
	localStorage.extra = bp.extra = document.getElementById("extra").value
	if (document.getElementById("sdp").checked) {
		bp.sdp = true
		localStorage.sdp = 1
	} else {
		bp.sdp = false
		localStorage.sdp = 2
	}
	bp.setcol()
	bp.refresh()
}

function col() {
	document.getElementById("bc").style.backgroundColor="rgb("+ver(document.getElementById("r"))+","+ver(document.getElementById("g"))+","+ver(document.getElementById("b"))+")";
}

document.addEventListener('DOMContentLoaded', function() {
	document.getElementById("r").value=bp.r
	document.getElementById("g").value=bp.g
	document.getElementById("b").value=bp.b
	document.getElementById("fil").value = bp.fil
	document.getElementById("extra").value = bp.extra
	document.getElementById("sdp").checked = bp.sdp
	col();
	setInterval(col, 300);

	bres.addEventListener('click', function(){reset()})
	bsav.addEventListener('click', function(){save()})
})
