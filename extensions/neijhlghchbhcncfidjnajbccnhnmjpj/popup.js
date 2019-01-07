// google analytics asynch tracking:
// https://developer.chrome.com/extensions/tut_analytics
var _gaq = _gaq || [];
	_gaq.push(['_setAccount', 'UA-111296891-1']); //Chrome
	_gaq.push(['_trackPageview']);
(function() {
	var ga = document.createElement('script'); 
	ga.type = 'text/javascript'; 
	ga.async = true;
	ga.src = 'https://ssl.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0]; 
	s.parentNode.insertBefore(ga, s);
})();
function trackButtonClick(e) {
    _gaq.push(['_trackEvent', e.target.id, 'clicked']);
};///

//give searchbox initial focus
document.getElementById("wiusearchbox").focus();

//upon db choice, return searchbox focus
document.getElementById("chosendb").addEventListener("change", function() {
	document.getElementById("wiusearchbox").focus();
}, {passive: true});

//clean/build queryURL for most dbs
function dbquery(userInput) {
	var encodedQ = encodeURIComponent(userInput.value);
	finalURL = searchURL + encodedQ;
	chrome.tabs.create({url: finalURL});
}

//clean/build queryURL for westcat
function wcquery(userInput) {
	var trimmedInput = userInput.value.trim();
	var trimmedInput = encodeURIComponent(trimmedInput);
	var encodedQ = trimmedInput;
	//WebVoyage needs '+' vs '%20' for query string 'space':
	encodedQ = encodedQ.replace(/%20/gi, "+"); 
	//encodedQ = encodedQ.replace(/'/gi, "%27"); 
	finalURL = startofURL + encodedQ + endofURL;
	chrome.tabs.create({url: finalURL});
}

//assign db to query
function searchit(chosendb,userInput) {
	switch (chosendb.value){
		case "westcat":
		startofURL = "https://webvoyage.carli.illinois.edu/wiu/cgi-bin/Pwebrecon.cgi?Search_Arg=";
		endofURL = "&DB=local&SL=none&SL=None&CNT=20&Search_Code=FT*";
		wcquery(userInput);
		break;

		case "westcat-ti":
		startofURL="https://webvoyage.carli.illinois.edu/wiu/cgi-bin/Pwebrecon.cgi?SAB1=";
		endofURL="&BOOL1=all+of+these&FLD1=Title+Words+%28TKEY%29&GRP1=AND+with+next+set&SAB2=&BOOL2=as+a+phrase&FLD2=Any+Words+%28GKEY%29&SAB3=&BOOL3=any+of+these&FLD3=Any+Words+%28GKEY%29&CNT=20&HIST=1&DB=local";
		wcquery(userInput);
		break;

		case "westcat-au":
		startofURL="https://webvoyage.carli.illinois.edu/wiu/cgi-bin/Pwebrecon.cgi?SAB1=";
		endofURL="&BOOL1=all+of+these&FLD1=Author+Words+%28NKEY%29&GRP1=AND+with+next+set&SAB2=&BOOL2=as+a+phrase&FLD2=Any+Words+%28GKEY%29&SAB3=&BOOL3=any+of+these&FLD3=Any+Words+%28GKEY%29&CNT=20&HIST=1&DB=local";
		wcquery(userInput);
		break;

		case "westcat-su":
		startofURL="https://webvoyage.carli.illinois.edu/wiu/cgi-bin/Pwebrecon.cgi?Search_Arg=";
		endofURL="&Search_Code=SUBJ_&CNT=20&HIST=1&DB=local";
		wcquery(userInput);
		break;

		case "i-share":
		searchURL = "https://i-share.carli.illinois.edu/all/vf/Search/Results?type=AllFields&limit=20&sort=relevance&lookfor=";
		dbquery(userInput);
		break;

		case "phl":
		searchURL = "http://sfx.carli.illinois.edu/sfxwiu/az/default?param_perform_value=searchTitle&param_jumpToPage_value=&param_type_value=textSearch&param_chinese_checkbox_active=1&param_textSearchType_value=contains&param_pattern_value=";
		dbquery(userInput);
		break;

		case "vu-westcat":
		searchURL = "https://i-share.carli.illinois.edu/vf-wiu/Search/Results?type=AllFields&limit=20&sort=relevance&lookfor=";
		dbquery(userInput);
		break;

		case "ebsco-ASP":
		searchURL = "https://wiulibraries.idm.oclc.org/login?url=http://search.ebscohost.com/login.aspx?direct=true&authtype=ip,uid&defaultdb=a9h&fQuery=((FT Y))&bQuery=";
		dbquery(userInput);
		break;

		case "ebsco-gensources":
		searchURL = "https://wiulibraries.idm.oclc.org/login?url=http://search.ebscohost.com/login.aspx?direct=true&authtype=ip,uid&db=aph,gjh,funk,f5h,nfh&fQuery=((FT Y))&bQuery=";
		dbquery(userInput);
		break;

		case "ebsco-allsources":
		searchURL = "https://wiulibraries.idm.oclc.org/login?url=http://search.ebscohost.com/login.aspx?direct=true&authtype=ip,uid&db=a9h,ach,ahl,axh,bsh,bwh,cmh,ufh,eric,f5h,funk,fyh,geh,gjh,hxh,hch,hia,hoh,hgh,ijh,iyh,lxh,mzh,mth,nfh,nrh,pdh,prh,psyh,qeh,reh,sph,teh,tfh,trh,ulh&fQuery=((FT Y))&bQuery=";
		dbquery(userInput);
		break;

		case "google":
		searchURL = "http://www.google.com/search?hl=en&q=";
		dbquery(userInput);
		break;

		case "google-scholar":
		searchURL = "https://wiulibraries.idm.oclc.org/login?url=http://scholar.google.com/scholar?hl=en&q=";
		dbquery(userInput);
		break;

		case "libweb-search":
		searchURL = "https://www.google.com/cse?ie=UTF-8&cof=&cx=006324787020407184689%3A4phnafp1g5y&q=hello&sa=Search#gsc.tab=0&gsc.page=1&gsc.q=";
		dbquery(userInput);
		break;

		case "refurls-search":
		searchURL = "http://www.wiu.edu/library/units/reference/refdburls/searchurls.php?boolchoice=KEYLIMITS&keywords=";
		dbquery(userInput);
		break;

		case "reftools":
		searchURL = "http://www.wiu.edu/library/units/reference/reftools/reftools.sphp?boolchoice=KEYLIMITS&CATEG=*&keywords=";
		dbquery(userInput);
		break;

		case "oed-search":
		searchURL = "https://wiulibraries.idm.oclc.org/login?url=http://www.oed.com/search?searchType=dictionary&_searchBtn=Search&q=";
		dbquery(userInput);
		break;

		case "dictionary":
		searchURL = "http://dictionary.com/browse/";
		dbquery(userInput);
		break;

		case "thesauri":
		searchURL = "http://thesaurus.com/browse/";
		dbquery(userInput);
		break;

		case "wiuweb-search":
		searchURL = "http://www.wiu.edu/search/?cx=010690051306724477785:6dyuasjgpla&cof=FORID:11&q=";
		dbquery(userInput);
		break;

		case "worldcat-org":
		searchURL = "http://worldcat.org/search?qt=worldcat_org_all&q=";
		dbquery(userInput);
		break;

		case "converter":
		searchURL = "http://www.wiu.edu/libraries/databases/persistent_links/linkConverter.php?submit=Convert+It!&thelink=";
		dbquery(userInput);

		//default:
		// searchURL = "http://imdb.com";
		// dbquery(userInput);
	}
}

//if click resTools button
document.getElementById("goresTools").addEventListener("click", function(event) {
	var resTools = document.getElementById("resTools");
	var resTools = resTools.value;
		if (resTools) {
			chrome.tabs.create({url: resTools});
		}
}, {passive: true});

//if click atoz button
document.getElementById("goatoz").addEventListener("click", function(event) {
	var atoz = document.getElementById("atoz");
	var atoz = atoz.value;
	var nonwiulibURL = new RegExp (/^http/);
		if (atoz) { //an embedded non-wiulibs URL:
			if (nonwiulibURL.test(atoz)) {	
				chrome.tabs.create({url: atoz});
			}
			else { //a wiulibs URL:
				var wiulibURL = "http://www.wiu.edu/libraries/"
				atoz = wiulibURL + atoz;
				chrome.tabs.create({url: atoz});
			}
		}
		else {}
}, {passive: true});

//if click mywiuopt button
document.getElementById("gomywiuopt").addEventListener("click", function(event) {
	var mywiuopt = document.getElementById("mywiuopt");
	var mywiuopt = mywiuopt.value;
		if (mywiuopt) {
			chrome.tabs.create({url: mywiuopt});
		}
}, {passive: true});

//if submit primary searchbox
document.addEventListener('submit', function(event) {
	var chosendb = document.getElementById("chosendb");
	var userInput = document.getElementById("wiusearchbox");
	searchit(chosendb,userInput);
}, {passive: true});

//if click options button
document.getElementById("opts").addEventListener("click", function(event) {
	var opts = document.getElementById("opts");
		if (mywiuopt) { //Chrome method:
			chrome.tabs.create({'url': 'chrome://extensions/?options=' + chrome.runtime.id});
			//chrome.tabs.create({'url': "/options.html"})
		}
}, {passive: true});

//analytics
document.getElementById("searchbox").addEventListener("submit", trackButtonClick);
document.getElementById("goresTools").addEventListener("click", trackButtonClick);
document.getElementById("goatoz").addEventListener("click", trackButtonClick);
document.getElementById("gomywiuopt").addEventListener("click", trackButtonClick);
document.getElementById("opts").addEventListener("click", trackButtonClick);
	
//DOM loaded
document.addEventListener("DOMContentLoaded", function(event) {
		//console.log("DOM loaded/parsed");
}, {passive: true});