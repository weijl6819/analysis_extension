/**
 * Created by Ali H. on 10/4/2016.
 */

var availableDomains = [];
function showDomains(result) {
    for (var i = 0; i < result.length; i++) {
        if (result[i].available) {
            availableDomains.push({"domain names" : result[i].domain});
            var element = '<div class="scraped_domains_detail_wrapper">'
                + '<a href="#" class="scraped_domain_link_name">' + result[i].domain + '</a>'
                + '<a class="domains_domdetailer_btn" domain="' + result[i].domain + '">Metrics</a>'
                + '<a class="domains_register_btn" href="http://www.expyred.com/" target="_blank">Register</a>'
                + '</div>';
            $('.scraped_domains_wrapper').append(element);

            $("#save_all_domains").show();
        }
    }

    if ($(".scraped_domains_detail_wrapper").length == 0) {
        $(".no_result").show();
    }

    $("#find_domains_btn").text('Find Expired Domains');
    $('#progress_bar').hide();
}

$(document).ready(function () {

    chrome.storage.sync.get({expyred_email: "", expyred_domdetailer_key: ""}, function (result) {
        if (result.expyred_email == "") {
            window.location = "popup.html";
        }
        else {

            var apiKey = "";

            if (result.expyred_domdetailer_key != "") {
                apiKey = result.expyred_domdetailer_key;
            }
            else {
                chrome.extension.sendMessage({key: "getDomdetailerKey", email: result.expyred_email});
            }

            $("#find_domains_btn").click(function () {
                $("#find_domains_btn").text('Find Expired Domains...');
                $('#progress_bar').show();
                $('.metrics_wrapper').hide();

                $('.scraped_domains_detail_wrapper').remove();
                $(".no_result").hide();

                chrome.extension.sendMessage({key: "findDomains"});

                $("#save_all_domains").hide();
            });

            $('body').on('click', '#save_metrics', function () {
                if (apiKey != "") {
                    $(this).text("Saving Metrics...");
                    var domain = $(this).attr("domain");
                    chrome.extension.sendMessage({key: "saveDomdetailerStats", apiKey: apiKey, domain: domain});
                }
                else {
                    alert("You need to add DomDetailer API key. Visit Settings page.");
                }
            });

            $("#save_all_domains").click(function () {
                JSONToCSVConvertor(JSON.stringify(availableDomains), "All available Domains", true, "AvailableDomains");
            });

            chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
                if (request.key == "findDomains") {
                    if (request.result == "no result") {
                        $(".no_result").show();
                        $("#find_domains_btn").text('Find Expired Domains');
                        $('#progress_bar').hide();

                        $("#save_all_domains").hide();
                    }
                    else {
                        showDomains(request.result);
                    }
                }
                else if (request.key == "saveDomdetailerStats") {
                    if(request.error){
                        $(".no_result").html("Something went wrong, please check your internet connection or contact support");
                        $(".no_result").show();
                    }
                    else{
                        var arr = [];
                        arr.push(request.result);
                        JSONToCSVConvertor(arr, "Domdetailer Stats Report", true, "AvailableDomainStatsReport");
                    }

                    $("#save_metrics").text("Save Metrics");
                }
            });

            $("#logout_link").click(function () {
                chrome.storage.sync.set({
                    expyred_email: "",
                    expyred_estibot_key: "",
                    expyred_domdetailer_key: ""
                }, function () {
                    window.location = "popup.html";
                });
            });
        }
    });
});
