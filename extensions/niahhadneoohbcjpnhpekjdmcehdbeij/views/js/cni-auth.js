function signInWithCni(username, password, onLoginSuccess, onLoginError) {

    cniApiClient.loginViaCni(username, password, onSuccess, onError);

    function onSuccess(authData) {

        //udalo sie zalogowac, zapisujemy sposob autoryzacji i id uzytkownika
        //cachujemy base64(username:password)

        localStorageClient.setAuthMethod('CNI');
        localStorageClient.setEncodedUserData(btoa(username +':'+password));
        localStorageClient.setUserId(authData.user_id);
        chrome.extension.getBackgroundPage().postLogin();
        onLoginSuccess();

    }

    function onError(data) {
        onLoginError(data);
        localStorageClient.clearAuthData();
    }

}

function logoutViaCni(onLogOut) {
    localStorageClient.clearAuthData();
    onLogOut();
}



