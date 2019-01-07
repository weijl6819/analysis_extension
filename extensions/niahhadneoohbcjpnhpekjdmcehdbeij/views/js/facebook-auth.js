function signInWithFacebook() {
    chrome.extension.getBackgroundPage().signInWithFacebook();
}

function logoutViaFacebook(onLogOut) {
    localStorageClient.getCachedAccessToken(function(accessTokenHolder) {
        var accessToken = accessTokenHolder['AccessToken'];
        chrome.extension.getBackgroundPage().logoutViaFacebook(accessToken, onLogOut);
    });
}