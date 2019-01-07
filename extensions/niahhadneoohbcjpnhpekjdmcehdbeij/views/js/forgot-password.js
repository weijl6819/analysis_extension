function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function displaySuccess(message) {
    var messageElement = $('#d-message');
    messageElement.addClass('d-success-message');
    messageElement.text(message);
    messageElement.show();
}

function displayError(message) {
    var messageElement = $('#d-message');
    messageElement.addClass('d-error-message');
    messageElement.text(message);
    messageElement.show();
}

function setLoginError() {
    $('#i-login').addClass('i-form-field-invalid');
}

function clearErrors() {
    $('#i-login').removeClass('i-form-field-invalid');
    var messageElement = $('#d-message');
    messageElement.text("");
    messageElement.removeClass('d-success-message');
    messageElement.removeClass('d-error-message');
}

function lockSubmitButton() {
    var submitButton = $('#b-forgot-password');
    submitButton.html('<div class="cssload-thecube">' +
        '<div class="cssload-cube cssload-c1"></div>' +
        '<div class="cssload-cube cssload-c2"></div>' +
        '<div class="cssload-cube cssload-c4"></div>' +
        '<div class="cssload-cube cssload-c3"></div>' +
        '</div>');
    submitButton.attr('disabled', true);
}

function unlockSubmitButton() {
    var submitButton = $('#b-forgot-password');
    submitButton.html("SEND PASSWORD RECOVERY EMAIL");
    submitButton.attr('disabled', false);
}

$(document).ready(function () {

    $('#f-forgot-password').submit(function (e) {
        e.preventDefault();
        lockSubmitButton();
        clearErrors();
        var login = $('#i-login').val();
        if (!validateEmail(login)) {
            setLoginError();
            displayError("Oops! Invalid email address.");
            unlockSubmitButton();
            return;
        }
        $.ajax({
            url: "https://www.sitesberg.com/cni/webapi/auth/cni/user/forgotPassword",
            type: "POST",
            data: JSON.stringify({username: login}),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function() {
                displaySuccess("Ok! Email with password recovery instructions was sent to " + login);
                unlockSubmitButton();
            },
            error: function(data) {
                setLoginError();
                displayError("Oops! " + JSON.parse(data.responseText).error_message);
                unlockSubmitButton();
            }
        });
    });
});