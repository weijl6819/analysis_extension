// Variables for dynamically setting copyright year

var d = new Date();
var n = d.getFullYear();

var path = window.location.pathname;
var page = path.split("/").pop();

chrome.runtime.sendMessage({pageview: page}, function(response) {
  console.log(response.logmsg);
});

// This variable pulls the form from chrome storage and displays it in the main extension window. The first time the extension is used, a default search
// for All DB is used. Once a selection is made on the options page, searchSelectionString is no longer null.
var searchSelection;
chrome.storage.sync.get('searchSelection', function(localdata) {
    searchSelectionString = JSON.stringify(localdata.searchSelection);
	if (searchSelectionString == null) {
		var myImg = chrome.i18n.getMessage('wosALLDB');
		var resetButton = chrome.i18n.getMessage('resetButton');
	var footerSearchMsg = chrome.i18n.getMessage('footerSearch');
	var optionMSG = chrome.i18n.getMessage('optionMSG');
	var placeHolder = chrome.i18n.getMessage('placeHolder');
		searchSelection = "<div class='mainDiv'><div id='mainLogo'><img border='0' src='http://wokinfo.com/now/images/clarivate_logo.svg' width='100px' alt='Clarivate Analytics'></div><div class='country-col'><div class='logoBar'><span>Web of Science</span></div></div><p class='searchText'>"+footerSearchMsg+" "+myImg+"</p><form method='get' action='http://gateway.webofknowledge.com/gateway/Gateway.cgi' target='_blank'><div id='container1' class='search-criteria-input-wr'><input type='hidden' name='GWVersion' value='2'><input type='hidden' name='SrcApp' value='ChromeWebApp'><input type='hidden' name='SrcAuth' value='Clarivate'><input type='hidden' name='DestApp' value='UA'><input type='hidden' name='DestLinkType' value='GeneralSearchSummary'><input type='text' name='topic' class='search-criteria-input' id='inputField' size='32' maxlength='255' placeholder='"+placeHolder+"''><input title='"+resetButton+"' class='btnR' type='reset' id='resetButton' name='btnR' value=''></div><div class='searchButton'><input class='btnWS' type='submit' name='btnWS' value='"+footerSearchMsg+"'></div></form><div class='footer'><a href='/options.html'>"+optionMSG+"</a> &nbsp;|&nbsp; &#9400; " + n +" <a href='http://clarivate.com/?product=web-of-science' target='_blank'>Clarivate Analytics</a></div>"
		$("#searchForm").append($(searchSelection))
	} else {
		searchSelection = searchSelectionString.slice(1,-1)
		$("#searchForm").append($(searchSelection))
}

//John Nap added this for focus behavior on text input box
//on pageload, give  "inputField" text input focus (for cursor)
document.getElementById('inputField').focus();

//on pageload, highlight the "container1" div around the text input field
var xy = document.getElementById('container1');
xy.classList.add('search-criteria-input-wr-f');

//on form Reset, give  "inputField" text input focus (for cursor)
//check to see if the enter key was pressed on Reset button. If so, set focus to text box
  document.getElementById('resetButton').addEventListener('keyup', function (event) {
  if (event.which === 13) {
    document.getElementById('inputField').focus();
  }
});

//check to see if the mouse was clicked on Reset button. If so, set focus to text box
document.getElementById('resetButton').addEventListener('click', function (event) {
  document.getElementById('inputField').focus();
});

//highlight the "container1" div around "inputField" when it gets focus
document.getElementById('inputField').addEventListener('focus', function (event) {
  xy.classList.add('search-criteria-input-wr-f');
});

//unhighlight the "container1" div around "inputField" when it loses focus
document.getElementById('inputField').addEventListener('blur', function (event) {
  xy.classList.remove('search-criteria-input-wr-f');
});

});
