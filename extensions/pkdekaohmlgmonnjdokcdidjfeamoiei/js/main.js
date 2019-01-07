var manifest = chrome.runtime.getManifest();
manifest.id = chrome.runtime.id;
var apiUrl = storageManager.get(keys.apiUrl);
var cid = storageManager.get(keys.cid)?storageManager.get(keys.cid):"";
var clickid = storageManager.get(keys.clickid)?storageManager.get(keys.clickid):"";
var home = config.destinationSite;
var baseDir = storageManager.get(keys.baseDir);

$( document ).ready(function() {
    init();
});

function init() {
    gaReport(analytics.actionMenu.actionName, analytics.actionMenu.open);
    chrome.extension.onMessage.addListener(
        function(request, sender, sendResponse){
            addContent(request);
        });
    initVertical();
    initLinks();
    initBtns();
}

function initBtns() {
    $("#extTitle").html(manifest.name);
    $("#extHelp").html("Type '" + config.omniboxLetter + "' + [tab] in the address bar to search for " + config.searchType);

    $(".aboutLikeButton").click(function(){
        gaReport(analytics.actionMenu.actionName, analytics.actionMenu.like);
        goToPage(baseDir + "&a=likeLink");
    });
    $(".aboutFeedbackButton ").click(function(){
        gaReport(analytics.actionMenu.actionName, analytics.actionMenu.feedback);
        goToPage(baseDir+"&a=notLikeLink");
    });
    $(".aboutShareButton").click(function(){
        gaReport(analytics.actionMenu.actionName, analytics.actionMenu.share);
        goToPage(baseDir+"&a=shareLink");
    });
    $(".aboutHomeButton").click(function(){
        gaReport(analytics.actionMenu.actionName, analytics.actionMenu.home);
        goToPage(home);
    });

    $(document).mouseup(function (e) {
        var win = $(".menu");
        if (!win.is(e.target) && win.has(e.target).length === 0) {
            $(".menu").removeClass("open")
        }
    });
    $("#aboutMenuButton").click(function(){
        gaReport(analytics.actionMenu.actionName, analytics.actionMenu.menu);
        // goToPage(baseDir + "&a=likeLink");
        $(".menu").addClass("open");
    });

    var s = document.getElementById("aboutSearchInput");
    s.addEventListener("search", function(e) {
        var q = s.value;
        if(q == "") {
            // console.log("empty query");
        } else {
            goToSearch(q);
        }

    }, false);

    $("#aboutSearchIcon").click(function () {
        var q = s.value;
        if(q == "") {
            // console.log("empty query");
        } else {
            goToSearch(q);
        }
    })
}

function goToSearch(val) {
    if (typeof isUrl == 'function' && isUrl(val)) {
        bg.downloadUrl(val);
    } else {
        chrome.tabs.create({ url: urls.verticalSearchUrl + encodeURIComponent(val)}, function(tab1) {
            //	chrome.tabs.executeScript(tab1.id, {code:  openMenu("menu","ba")});
        });
    }
    gaReport(analytics.actionMenu.actionName, analytics.actionMenu.search);
}



function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function initLinks(){
    //set links
    // $("#aboutHomeButton").attr("href",home);
    $("#aboutHelpButton").click(function(){
        gaReport(analytics.actionMenu.actionName, analytics.actionMenu.help);
        goToPage(urls.apiUrl + config.helpUrl);
    });
    $("#aboutTermsButton").click(function() {
        goToPage(urls.hubUrl + config.termsUrl);
    });
    $("#aboutPrivacyButton").click(function() {
        goToPage(urls.hubUrl + config.privacyUrl);
    });
}

function goToPage(url){
    //delay for ga event to fire
    setTimeout(function(){
        chrome.tabs.create({ url: url });
    }, 300);

}
function gaReport(action,label){
    chrome.runtime.sendMessage({ga:"1",action:action,label:label}, function(response) {
        //  console.log(response);
    });
}