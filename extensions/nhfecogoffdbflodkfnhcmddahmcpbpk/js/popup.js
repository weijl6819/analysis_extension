/**
 * Created by Ali H. on 9/30/2016.
 */
$(document).ready(function () {

    chrome.storage.sync.get({expyred_email: "", lastErrorMessage: ""}, function (result) {
        if(result.lastErrorMessage != ""){
            $('.message').html(result.lastErrorMessage);
            chrome.storage.sync.set({lastErrorMessage: ""});
        }
        if (result.expyred_email != "") {
            window.location = "apidetails.html";
        }
        else {
            $('body').show();
        }
    });

    $(".login_here").click(function () {
        $('.message').html("");

        $('.login_detail_wrapper').css('display', 'block');
        $('.create_account_detail_wrapper').css('display', 'none');
        $('.create_account_here a').removeClass('active');
        $('.login_here a').addClass('active');
    });

    $(".create_account_here").click(function () {
        $('.message').html("");

        $('.login_detail_wrapper').css('display', 'none');
        $('.create_account_detail_wrapper').css('display', 'block');
        $('.create_account_here a').addClass('active');
        $('.login_here a').removeClass('active');
    });

    $("#sign_up").submit(function (e) {

        $("#register_btn").text("Registering...");
        $('#result').html("");

        e.preventDefault();

        var dataString = $(this).serialize();

        chrome.extension.sendMessage({key: "register", dataString: dataString});

        return false;
    });

    $("#login").submit(function (e) {

        $("#login_btn").text("Login...");
        $('#login_result').html("");

        e.preventDefault();

        var dataString = $(this).serialize();
        var email = $("#email_id").val();

        chrome.extension.sendMessage({key: "login", dataString: dataString, email: email});
        return false;
    });

    $(".google_login_link").click(function () {
        $('.message').html("");
        chrome.extension.sendMessage({key: "googleLogin"});
    });

    function googleLoginCallback(message) {
        if(message == "location"){
            window.location = "apidetails.html";
        }
        else {
            $('.message').html(message);
        }
    }

    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if(request.key == "login"){
            $('#login_result').html(request.result);
            $("#login_btn").text("Login");

            if(request.result == "Login Successfully.") {
                chrome.storage.sync.set({expyred_email: request.email}, function () {
                    window.location = "apidetails.html";
                });
            }
        }
        else  if(request.key == "register"){
            $('#result').html(request.result);
            $("#register_btn").text("Register");
        }
        else  if(request.key == "googleLogin"){
            googleLoginCallback(request.result);
        }
    });
});
