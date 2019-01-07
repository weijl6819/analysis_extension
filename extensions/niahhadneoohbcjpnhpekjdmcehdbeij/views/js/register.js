localStorageClient = chrome.extension.getBackgroundPage().localStorageClient;
cniApiClient = chrome.extension.getBackgroundPage().cniApiClient;

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function setLoginError() {
    cniCommon.setInputError($('#i-login'));
}

function setPasswordError() {
    cniCommon.setInputError($('#i-password'));
    cniCommon.setInputError($('#i-re-password'));
}

function clearErrors(messageElement) {
    cniCommon.clearInputError($('#i-login'));
    cniCommon.clearInputError($('#i-password'));
    cniCommon.clearInputError($('#i-re-password'));
    cniCommon.clearMessage(messageElement);
}

function hideFormFields() {
    $('#i-login').hide();
    $('#i-password').hide();
    $('#i-re-password').hide();
    $('#b-register').hide();
}

$(document).ready(function () {
    $('#f-register').submit(function (e) {
        e.preventDefault();
        var registerButton = $('#b-register');
        var messageElement = $('#d-message');
        cniCommon.lockButton(registerButton);
        clearErrors(messageElement);
        var login = $('#i-login').val();
        var password = $('#i-password').val();
        var rePassword = $('#i-re-password').val();
        if (!validateEmail(login)) {
            setLoginError();
            cniCommon.displayError(messageElement, "Oops! Invalid email address.");
            cniCommon.unlockButton(registerButton);
            return;
        }
        if (password != rePassword) {
            setPasswordError();
            cniCommon.displayError(messageElement, "Oops! Passwords doesn't match.");
            cniCommon.unlockButton(registerButton);
            return;
        }
        $.ajax({
            url: "https://www.sitesberg.com/cni/webapi/auth/cni/register",
            type: "POST",
            data: JSON.stringify({username: login, password: password}),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function () {
                signInWithCni(login, password, function () {
                    cniCommon.displaySuccess(messageElement, "Yay! You are registered and logged! You can close this tab now.");
                }, function (error) {
                    cniCommon.displayError(messageElement, "Oops! You're registered but we can't log in automatically: " + error + ". Try to log in manually.");
                });
                cniCommon.unlockButton(registerButton);
                hideFormFields();
            },
            error: function (data) {
                var errorMessage;
                if (data.responseText != "") {
                    var response = JSON.parse(data.responseText);
                    if (response.error_code == 9003) {
                        setPasswordError();
                    }
                    if (response.error_code == 5009) {
                        setLoginError();
                    }
                    errorMessage = JSON.parse(data.responseText).error_message;
                } else {
                    errorMessage = "Are we on the same wavelength? Check network connection.";
                }
                cniCommon.displayError(messageElement, "Oops! " + errorMessage);
                cniCommon.unlockButton(registerButton, "REGISTER");
            }
        });
    });
});