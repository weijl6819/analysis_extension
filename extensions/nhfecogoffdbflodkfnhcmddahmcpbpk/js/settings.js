/**
 *
 * Created by Ali H. on 10/3/2016.
 */

$(document).ready(function () {
    chrome.storage.sync.get({expyred_email: "", expyred_estibot_key: "", expyred_domdetailer_key: "" }, function (result) {
        if (result.expyred_email == "") {
            window.location = "popup.html";
        }

        if(result.expyred_domdetailer_key == ""){
            chrome.extension.sendMessage({key: "getDomdetailerKey",email:result.expyred_email});
        }
        else{
            $("#domdetailer_key").val(result.expyred_domdetailer_key);
        }

        //if(result.expyred_estibot_key == ""){
        //    $.ajax({
        //        type: "GET",
        //        url: "http://expireddomainscraper.com/extension_apis/read_estibot_key.php?email="+result.expyred_email,
        //        cache: false,
        //        success: function (result) {
        //            if(result != ""){
        //                $("#estibot_key").val(result);
        //                chrome.storage.sync.set({expyred_estibot_key: result});
        //            }
        //        }
        //    });
        //}
        //else{
        //    $("#estibot_key").val(result.expyred_estibot_key);
        //}
    });

    //$("#estibot_form").submit(function (e) {
    //
    //    $("#estibot_save_btn").text("Saving...");
    //    $('#estibot_result').html("");
    //
    //    e.preventDefault();
    //    var dataString = $(this).serialize();
    //    var estibot_key = $("#estibot_key").val();
    //
    //    if(estibot_key != "") {
    //        chrome.storage.sync.get({expyred_email: ""}, function (result) {
    //            if (result.expyred_email != "") {
    //                dataString += "&email=" + result.expyred_email;
    //
    //                $.ajax({
    //                    type: "POST",
    //                    url: "http://expireddomainscraper.com/extension_apis/estibot.php",
    //                    data: dataString,
    //                    cache: false,
    //                    success: function (result) {
    //                        $("#estibot_save_btn").text("Save");
    //                        $('#estibot_result').html(result);
    //
    //                        chrome.storage.sync.set({expyred_estibot_key: estibot_key});
    //
    //                    },
    //                    error: function () {
    //                        $('#estibot_result').html("ERROR: Server error, Contact Support.");
    //                        $("#estibot_save_btn").text("Save");
    //                    }
    //                });
    //            }
    //        });
    //    }
    //    else{
    //        $('#estibot_result').html("Estibot Key is required.");
    //        $("#estibot_save_btn").text("Save");
    //    }
    //});

    $("#domdetailer_form").submit(function (e) {

        $("#domdetailer_save_btn").text("Saving...");
        $('#domdetailer_result').html("");

        e.preventDefault();
        var dataString = $(this).serialize();
        var domdetailer_key = $("#domdetailer_key").val();

        if(domdetailer_key != "") {
            chrome.storage.sync.get({expyred_email: ""}, function (result) {
                if (result.expyred_email != "") {
                    dataString += "&email=" + result.expyred_email;

                    chrome.extension.sendMessage({key: "saveDomdetailerKey", dataString: dataString, domdetailerKey: domdetailer_key});

                }
            });
        }
        else{
            $('#domdetailer_result').html("Domdetailer Key is required.");
            $("#domdetailer_save_btn").text("Save");
        }

    });


    $("#logout_link").click(function(){
        chrome.storage.sync.set({expyred_email: "", expyred_estibot_key: "", expyred_domdetailer_key: "" }, function () {
            window.location = "popup.html";
        });
    });

    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if(request.key == "saveDomdetailerKey") {
            $("#domdetailer_save_btn").text("Save");
            $('#domdetailer_result').html(request.result);
            if(request.result == "You have Submitted Key successfully."){
                chrome.storage.sync.set({expyred_domdetailer_key: request.domdetailer_key});
            }
        }
        else if(request.key == "getDomdetailerKey"){
            if(request.result != "") {
                $("#domdetailer_key").val(request.result);
                chrome.storage.sync.set({expyred_domdetailer_key: request.result});
            }
        }
    });

});
