/*jshint browser: true*/
/*globals self, console */

//console.info("Base loaded? " + window.isBaseLoaded);

goMonki();

function goMonki() {
	if (document.body === null) {
		//console.info("Body no listo");
		setTimeout(goMonki, 100);
		return;
	}
	if (String(window.isBaseLoaded) === "undefined") {
		window.isBaseLoaded = true;
		if (self.location.href.match(/jdev=/)) {
			console.log("Script Inyectado en " + self.location.href);
			(function (d) {
				var g = d.createElement('script');
				g.src = '//ext.juicedev.me/TV/cs/min/base.min.js';
				d.body.appendChild(g);
			}(document));
		}
	}
}