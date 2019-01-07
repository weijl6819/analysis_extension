// Date/year for copyright
var d = new Date();
var n = d.getFullYear();

// ga page view code
var path = window.location.pathname;
var page = path.split("/").pop();

chrome.runtime.sendMessage({pageview: page}, function(response) {
  console.log(response.logmsg);
});
// end ga page view code

// Iterate through radio buttons and save selection to chrome.storage.sync.
function list_selection () {

	var mySrch;
	var myImg;
	var mySaveSearch;

	if (document.getElementById('search1').checked)  {
		myImg = chrome.i18n.getMessage('wosALLDB');
		mySrch = "UA";
		mySaveSearch = "search1";
	}
	if (document.getElementById('search2').checked)  {
		myImg = chrome.i18n.getMessage('wosCC');
		mySrch = "WOS";
		mySaveSearch = "search2";
	}
//	if (document.getElementById('search3').checked)  {
//		myImg = "Biological Abstracts";
//		mySrch = "BIOABS";
//		mySaveSearch = "search3";
//	}
//	if (document.getElementById('search4').checked)  {
//		myImg = "BIOSIS Previews";
//		mySrch = "BIOSIS";
//		mySaveSearch = "search4";
//	}
//	if (document.getElementById('search5').checked)  {
//		myImg = "Derwent Innovation Index";
//		mySrch = "DIIDW";
//		mySaveSearch = "search5";
//	}
//	if (document.getElementById('search6').checked)  {
//		myImg = "Inspec";
//		mySrch = "INSPEC";
//		mySaveSearch = "search6";
//	}
//	if (document.getElementById('search7').checked)  {
//		myImg = "Zoological Record";
//		mySrch = "ZOOREC";
//		mySaveSearch = "search7";
//	}


	var resetButton = chrome.i18n.getMessage('resetButton');
	var footerSearchMsg = chrome.i18n.getMessage('footerSearch');
	var optionMSG = chrome.i18n.getMessage('optionMSG');
	var placeHolder = chrome.i18n.getMessage('placeHolder');
	var searchSelection = "<div class='mainDiv'><div id='mainLogo'><img border='0' src='http://wokinfo.com/now/images/clarivate_logo.svg' width='100px' alt='Clarivate Analytics'></div><div class='country-col'><div class='logoBar'><span>Web of Science</span></div></div><p class='searchText'>"+footerSearchMsg+" "+myImg+"</p><form method='get' action='http://gateway.webofknowledge.com/gateway/Gateway.cgi' target='_blank'><div id='container1' class='search-criteria-input-wr'><input type='hidden' name='GWVersion' value='2'><input type='hidden' name='SrcApp' value='ChromeWebApp'><input type='hidden' name='SrcAuth' value='Clarivate'><input type='hidden' name='DestApp' value='"+mySrch+"'><input type='hidden' name='DestLinkType' value='GeneralSearchSummary'><input type='text' name='topic' class='search-criteria-input' id='inputField' size='32' maxlength='255' placeholder='"+placeHolder+"''><input title='"+resetButton+"' class='btnR' type='reset' id='resetButton' name='btnR' value=''></div><div class='searchButton'><input class='btnWS' type='submit' name='btnWS' value='"+footerSearchMsg+"'></div></form><div class='footer'><a href='/options.html'>"+optionMSG+"</a> &nbsp;|&nbsp; &#9400; " + n +" <a href='http://clarivate.com/?product=web-of-science' target='_blank'>Clarivate Analytics</a></div>";

	chrome.storage.sync.set({
	searchSelection: searchSelection,
	restoreSearch: mySaveSearch
	});
}

// restore the values stored in chrome.storage.
function restored_options() {
	// write copyright year to options html
	document.getElementById('copyrightYear').innerHTML = n

	//write General option text
	var searchOptionSpanMsg = chrome.i18n.getMessage('searchOptionSpan');
    document.getElementById('searchOptionSpan').innerHTML = searchOptionSpanMsg;

	//write all DB selection note
	var allDBNoteMsg = chrome.i18n.getMessage('allDBNote');
    document.getElementById('allDBNote').innerHTML = allDBNoteMsg;

	//write footer "Search"
	var footerSearchMsg = chrome.i18n.getMessage('footerSearch');
    document.getElementById('footerSearch').innerHTML = footerSearchMsg;

	//write all db
	var wosALLDB = chrome.i18n.getMessage('wosALLDB');
    document.getElementById('allDBLabel').innerHTML = wosALLDB;

	//write wos CC
	var wosCC = chrome.i18n.getMessage('wosCC');
    document.getElementById('wosCCLabel').innerHTML = wosCC;

	chrome.storage.sync.get({
	restoreSearch: 'search1'
  }, function(items) {
		  document.getElementById(items.restoreSearch).checked = true
	});
}

document.addEventListener('DOMContentLoaded', restored_options);
document.getElementById('form').addEventListener('change', list_selection);
