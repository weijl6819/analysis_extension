var bp = chrome.extension.getBackgroundPage();
var s = document.getElementById("cur");
var sortrev = false;
function cmp(a,b) {
	var x, y
	if (sortrev) {
		x = a.A.substr(4,3)+a.A.substr(0,3);
		y = b.A.substr(4,3)+b.A.substr(0,3);
	} else {
		x = a.A;
		y = b.A;
	}
	return ((x < y) ? -1 : ((x > y) ? 1 : 0));
}
function save() {
	localStorage.currency=bp.curre=s.options[s.selectedIndex].value;
	bp.refresh();
	postpost();
}
function bldlist() {
	s.options.length=0;
	bp.rates.d.sort(cmp);
	for (var i=0, x; x=bp.rates.d[i]; i++) {
		if (bp.fil!='' && (bp.fil.indexOf(x.A.substr(0,3))==-1 || bp.fil.indexOf(x.A.substr(4,3))==-1))
			continue;
		var sl=x.A==bp.curre;
		s.options[s.options.length]=new Option(x.A,x.A,sl,sl);
	}
}
function fixdig(v) {
	return v.toFixed(8).substr(0,7);
}
function postpost() {
	document.getElementById("bid").innerHTML=fixdig(bp.bid);
	document.getElementById("ask").innerHTML=fixdig(bp.ask);
	document.getElementById("avg").innerHTML=fixdig((bp.bid+bp.ask)/2);
}

document.addEventListener('DOMContentLoaded', function() {
	postpost();
	bldlist();
	s.focus();
	cur.addEventListener('change', function(){save()}, false)

	chart.addEventListener('click', function() {
		chrome.tabs.create({url: 'http://www.forex.com/uk/currency-pairs-public-charts.html?cp='+bp.curre.substr(0,3)+bp.curre.substr(4,3)})
	})

	resort.addEventListener('click', function(){
		sortrev = !sortrev
		bldlist()
	})

	forex.addEventListener('click', function(){
		chrome.tabs.create({url: 'http://www.forex.com/'})
	})

	bp.addEventListener("refresh", postpost)
})
