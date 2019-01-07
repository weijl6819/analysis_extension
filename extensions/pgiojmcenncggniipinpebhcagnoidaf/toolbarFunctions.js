
document.addEventListener('DOMContentLoaded',function(){var _gaq=_gaq||[];_gaq.push(['_setAccount','UA-15714812-4']);_gaq.push(['_trackPageview','toolbarWindow.html']);(function(){var ga=document.createElement('script');ga.type='text/javascript';ga.async=true;ga.src='https://ssl.google-analytics.com/ga.js';var s=document.getElementsByTagName('script')[0];s.parentNode.insertBefore(ga,s);})();});var autoSearchDisplay=localStorage['settingsAutoSearchDisplay'];var historyLength=15;var searchFieldSubWidth=150;var createdTabId=localStorage['createdTabId'];localStorage['tabHistoryLength'+createdTabId]=window.history.length;historyLength=localStorage['settingsHistoryLength'];var displayNewSearchTab=localStorage['settingsNewTabSearch'];var pluginTopBottom=localStorage['settingsPluginTopBottom'];var beforeSettingsNewTabOnOrOff=localStorage['beforeSettingsNewTabSearch'];var popupWindow;var browsingHistories=[];var historyArray=[];var db=window.openDatabase("searchHighlighter","","Search Highlighter DB",4096*1024);if(localStorage['enterSearchString']=="Yes"){if(localStorage['selectedString']!=undefined)
insertSelectedSearch(localStorage['selectedString']);localStorage['enterSearchString']="No";}
db.transaction(function(tx){tx.executeSql('CREATE TABLE IF NOT EXISTS searchHistory ( sno INTEGER PRIMARY KEY ASC, searchText)');});$(document).ready(function(){if(autoSearchDisplay=="On"||autoSearchDisplay==undefined){$("#searchResults").show();}else{$("#searchResults").hide();}
chrome.runtime.onMessage.addListener(function(request,sender,sendResponse){if(request.greeting=="mouseUp"){if(localStorage['selectedString']!=undefined)
document.getElementById("searchText").value=localStorage['selectedString'];}
if(request.greeting=="trackSearchEvent"){gaTrackEvent();}});$('#extensionBody').keyup(function(e){$("#veritcalSearchResults").html("");$('#searchResults').html("");if(e.keyCode==13){if(localStorage['settingsNewTabSearch']=="On"){searchNewTab()}else{search();}}else{if($("#searchText").val()=="")return;if(localStorage['selectedSearchEngine']=="bing"){bingAutoSearch();}else{googleAutoSearch();}}});if(displayNewSearchTab==undefined||displayNewSearchTab=="Off"){$("#searchNewTabId").hide();}
else $("#searchNewTabId").show();var searchHistoryString="";db.transaction(function(tx){tx.executeSql('SELECT * FROM searchHistory order by sno desc',[],function(tx,results){var length=results.rows.length;for(var i=0;i<length;i++){var searchText=results.rows.item(i).searchText;if(searchText.length>=50){var ellipsisText="";ellipsisText=searchText.substr(0,47);ellipsisText=ellipsisText+" ..."
searchHistoryString=searchHistoryString+'<option value="'+searchText+'" title="icons/bing_ico.png">'+ellipsisText+'</option>';}else{searchHistoryString=searchHistoryString+'<option>'+searchText+'</option>';}
if(historyLength-1==i){$('select#searchListSelection').html(searchHistoryString);return;}}
$('select#searchListSelection').html(searchHistoryString);});});if(localStorage['selectedSearchEngine']=="bing"){$("#searchType").css('background-image','url(logos/bing_btn.png)');$('#searchType option:selected').removeAttr('selected');$('#searchType option[value=bing]').attr('selected',true);}
var searchFieldWidth=parseInt(localStorage['searchTextWidth'])+220;if($(window).width()<searchFieldWidth){if($(window).width()<460){$("#tableWidth").css('width',420);if(displayNewSearchTab==beforeSettingsNewTabOnOrOff){if(beforeSettingsNewTabOnOrOff=="Off"||beforeSettingsNewTabOnOrOff==undefined){$("#searchText").css('width',263);}
else{$("#searchText").css('width',239);}}
else{if(beforeSettingsNewTabOnOrOff=="Off"||beforeSettingsNewTabOnOrOff=="undefined"){$("#searchText").css('width',239);}
else{$("#searchText").css('width',263);}}
return false;}
$("#searchText").css('width',$(window).width()-200);}
else{if(localStorage['searchTextWidth']==undefined){if(displayNewSearchTab==beforeSettingsNewTabOnOrOff){if(beforeSettingsNewTabOnOrOff=="Off"||beforeSettingsNewTabOnOrOff==undefined){$("#searchText").css('width',263);}
else{$("#searchText").css('width',239);}}
else{if(beforeSettingsNewTabOnOrOff=="Off"||beforeSettingsNewTabOnOrOff=="undefined"){$("#searchText").css('width',239);}
else{$("#searchText").css('width',263);}}
$("#tableWidth").css('width',420);}else{if(displayNewSearchTab==undefined||displayNewSearchTab=="Off"){$("#searchText").css('width',parseInt(localStorage['searchTextWidth'])+24);}else{$("#searchText").css('width',localStorage['searchTextWidth']);}
$("#tableWidth").css('width',localStorage['tableWidth']);}}
if(localStorage['selectedString']!=undefined)
document.getElementById("searchText").value=localStorage['selectedString'];$("#dragImagex").draggable({axis:"x",cursor:"default",drag:function(obj){localStorage['windowResize']="no";if((obj.clientX-100)>280){if(obj.clientX>$(window).width()-50)return;if(displayNewSearchTab==undefined||displayNewSearchTab=="Off"){$("#searchText").css('width',obj.clientX-searchFieldSubWidth+24);}else{$("#searchText").css('width',obj.clientX-searchFieldSubWidth);}
$("#tableWidth").css('width',obj.clientX+30);localStorage['tableWidth']=obj.clientX+30;localStorage['searchTextWidth']=obj.clientX-searchFieldSubWidth;}}});});function googleAutoSearch(){var xhr=new XMLHttpRequest();xhr.open("GET","http://www.google.com/complete/search?client=chrome&q="+$("#searchText").val(),true);xhr.onreadystatechange=function(){if(xhr.readyState==4&&xhr.status==200){var gooleAutoSearchObject=eval('('+xhr.responseText+')');var gooleAutoSearchObjectData=gooleAutoSearchObject[1];var autoSearchResulst="";for(var i=0;i<gooleAutoSearchObjectData.length;i++){var temp=gooleAutoSearchObjectData[i].substring(0,4);if(temp=='http')continue;autoSearchResulst=autoSearchResulst+"<span class='searchResltsSpan' onClick='searchResultsSpanClick(this)'>"+gooleAutoSearchObjectData[i]+"</span>"}
$('#searchResults').append(autoSearchResulst);}}
xhr.send();}
function bingAutoSearch(){$.ajax({url:'http://api.bing.com/osjson.aspx?query='+$("#searchText").val(),success:function(data){var bingAutoSearchObjectData=data[1];var autoSearchResulst=""
for(var i=0;i<bingAutoSearchObjectData.length;i++){autoSearchResulst=autoSearchResulst+"<span class='searchResltsSpan' onClick='searchResultsSpanClick(this)'>"+bingAutoSearchObjectData[i]+"</span>"}
$('#searchResults').append(autoSearchResulst);}});}
function searchResultsSpanClick(spanObj){$("#searchText").val(spanObj.innerHTML)
if(localStorage['settingsNewTabSearch']=="On"){searchNewTab()}else{search();}}
function search(){var searchNewTabValue=document.getElementById('searchText').value;if(searchNewTabValue=="")return;insertSelectedSearch(searchNewTabValue);localStorage['selectedString']=searchNewTabValue;window.setTimeout(function(){updateTabWithSearch("search",searchNewTabValue);gaTrackEvent();},4);}
function insertSelectedSearch(searchNewTabValue){db.transaction(function(tx){tx.executeSql('DELETE FROM searchHistory WHERE searchText = ?',[searchNewTabValue],function(tx,results){tx.executeSql('INSERT into searchHistory ( searchText ) values ( ? )',[searchNewTabValue],function(tx,results){});});});}
function updateTabWithSearch(sameTabOrNewTab,searchNewTabValue){if(localStorage['selectedSearchEngine']=="bing"){chrome.extension.sendMessage({greeting:sameTabOrNewTab,url:"http://www.bing.com/?form=OSDSRC&q="+searchNewTabValue},function(response){});}else{chrome.extension.sendMessage({greeting:sameTabOrNewTab,url:"http://www.google.com/search?q="+searchNewTabValue},function(response){});}}
function searchNewTab(){var searchNewTabValue=document.getElementById('searchText').value;if(searchNewTabValue=="")return;localStorage['selectedString']=searchNewTabValue;insertSelectedSearch(searchNewTabValue);updateTabWithSearch("searchNewTab",searchNewTabValue);gaTrackEvent();}
function opentDigitingPage(){chrome.extension.sendMessage({greeting:"digitingSearch"},function(response){});}
function settings(){if(popupWindow!=undefined){if(popupWindow.closed==false)return;}
localStorage['beforeSettingsNewTabSearch']=displayNewSearchTab;popupWindow=window.open("settings.html");}
function getSearchType(list){var searchEngine=(list.options[list.selectedIndex].value);if(searchEngine=='google'){localStorage['selectedSearchEngine']="google";$("#searchType").css('background-image','url(logos/google_btn.png)');$('#searchResults').html("");googleAutoSearch();}
else{localStorage['selectedSearchEngine']="bing";$("#searchType").css('background-image','url(logos/bing_btn.png)');$('#searchResults').html("");bingAutoSearch();}}
function insertSearchText(list){var selectedSearchText=(list.options[list.selectedIndex].value);localStorage['selectedString']=selectedSearchText;document.getElementById("searchText").value=selectedSearchText;insertSelectedSearch(selectedSearchText);if(localStorage['settingsNewTabSearch']=="On"){updateTabWithSearch("searchNewTab",selectedSearchText);}else{updateTabWithSearch("search",selectedSearchText);}}
function gaTrackEvent(){var searchEngine=window.localStorage.getItem('selectedSearchEngine');if(_gaq){_gaq.push(['_trackEvent','Search Engine',searchEngine,searchEngine]);}}