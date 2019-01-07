localStorageClient = chrome.extension.getBackgroundPage().localStorageClient;
cniApiClient = chrome.extension.getBackgroundPage().cniApiClient;
pageManager = chrome.extension.getBackgroundPage().pageManager;


(function () {
    document.addEventListener('DOMContentLoaded', function () {
        document.querySelector('#signInWithGoogle').addEventListener('click', function (e) {
            chrome.extension.getBackgroundPage().signInWithGoogle(function () {
                pageManager.openPage(pageManager.PageName.SETTINGS);
            }, function() {
                var messageElement = $('#d-message');
                cniCommon.clearMessage(messageElement);
                cniCommon.displayError(messageElement, 'Sorry something went wrong... Please try again!');
            });
        });

        document.querySelector('#signInWithFacebook').addEventListener('click', function (e) {
            chrome.extension.getBackgroundPage().signInWithFacebook();
        });

        document.querySelector('#register').addEventListener('click', function () {
            pageManager.openPage(pageManager.PageName.REGISTER);
        });

        document.querySelector('#forgotPassword').addEventListener('click', function () {
            pageManager.openPage(pageManager.PageName.FORGOT_PASSWORD);
        });
        
        document.querySelector('#logOut').addEventListener('click', function (e) {
            localStorageClient.getAuthMethod(function (authMethodData) {
                var authMethod = authMethodData['AuthMethod'];

                if (authMethod == 'GOOGLE') {
                    logoutViaGoogle(logOutAction);
                }
                if (authMethod == 'FACEBOOK') {
                    logoutViaFacebook(logOutAction);
                }
                if (authMethod == 'CNI') {
                    logoutViaCni(logOutAction);
                }

                function logOutAction() {
                    showFormFields();
                    cniCommon.displaySuccess($('#d-message'), 'Logged out successfully! Bye...');
                    $('#d-logged-in').hide();
                }
            });
        });

        document.querySelector('#signInWithCni').addEventListener('click', function (e) {
            var username = $('#i-txt-login').val();
            var password = $('#i-txt-password').val();
            var button = $('#signInWithCni');
            var messageElement = $('#d-message');

            cniCommon.lockButton(button);
            signInWithCni(username, password, function () {
                cniCommon.unlockButton(button, "SIGN IN");
                pageManager.openPage(pageManager.PageName.SETTINGS);
            }, function (data) {
                cniCommon.clearMessage(messageElement);
                var message;
                if (data.responseText != "") {
                    message = data.responseJSON.error_message;
                } else {
                    message = "Network error. Are u offline?";
                }
                cniCommon.displayError(messageElement, message);
                cniCommon.unlockButton(button, "SIGN IN");
            });
        });
    });


})();

//sprawdzenie czy zalgoowany user
(function () {
    showLoggedInIfLogged();
})();

function showLoggedInIfLogged() {
    localStorageClient.getUserId(function (userId) {
        if (userId.UserId == undefined || userId.UserId == '') {
            //nothing
        } else {
            //zalogowany user
            hideFormFields();
            $('#d-logged-in').show();
        }
    });
}

function hideFormFields() {
    cniCommon.clearMessage($('d-message'));
    $('#d-login-method').hide();
}

function showFormFields() {
    cniCommon.clearMessage($('d-message'));
    $('#d-login-method').show();
}