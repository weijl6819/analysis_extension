var bg = chrome.extension.getBackgroundPage();

chrome.tabs.query( { active: true, currentWindow: true } ,function (tabsArray){ 
    var tabObj = new bg.TabInfo(tabsArray[0].id,tabsArray[0].url);
    bg.saveRecord(tabObj.url, 'click_browseraction', tabObj.domain, 'click_browseraction_rv');
    var manifest = chrome.runtime.getManifest();
    bg.getRecentViewedProducts(tabObj).then(function (detailedItems, fromBrowserAction=false) {
        showDropdown(detailedItems, tabObj);
    });
});

function showDropdown(detailedItems, tabObj) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST",extConfig.domainName + "/popup/dropdown.php", true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    var param = "url="+encodeURIComponent(tabObj.url)+"&uid="+localStorage.uid+"&store="+tabObj.store+"&domain="+tabObj.domain+"&isFilteredUrl="+tabObj.isFilteredUrl+"&advertisedRecently="+tabObj.advertisedRecently+"&rvProducts="+JSON.stringify(detailedItems)+"&extName="+bg.extensionName;;
    xhr.onload=function() {
        var response=JSON.parse(xhr.responseText);
        document.body.outerHTML = response.html;
        addTrackEvents(tabObj);
    };
    xhr.send(param);
}

function showDefaultPopup(tabObj) {
    window.close();
    bg.displayPopup(tabObj, true, true);
}

//Add click,show track events
function addTrackEvents(tabObj) {
	var showNode = $(document).find("[data-showeventnamefrostty]");
    for(i=0;i<showNode.length;i++){
        var node  = showNode[i];
        console.log(node);
        trackEvent = $(node).attr("data-showeventnamefrostty");
        chrome.runtime.sendMessage({
                _trackEvent: trackEvent,
                url: tabObj.url,
                fromFrostty : true,
                info1: tabObj.domain,
                tabObj: tabObj
            });
    }
    $(document).on("click",".js-frsty-open-link", function(){
	    var url = $(this).data("href");
	    chrome.runtime.sendMessage({
	        _trackEvent: 'clickDropdown_rv',
	        url: tabObj.url,
	        fromFrostty : true,
	        info1: tabObj.domain,
        	tabObj: tabObj
    	});
    	window.open(url,"_blank");
    });
}

