/**
 *
 * Created by Ali H. on 10/4/2016.
 */
$(document).ready(function () {

    var _domain;

    $('body').on('click', '.domains_domdetailer_btn', function () {
        $('.scraped_domains_wrapper').hide();
        $('.metrics_wrapper').show();

        $("#save_all_domains").hide();

        $('#metrics_result').show();
        $('.metrics_detail_wrapper').hide();
        $('#domdetailer_error').hide();

        _domain = $(this).attr("domain");
        chrome.storage.sync.get({expyred_domdetailer_key: ""}, function (result) {

            if (result.expyred_domdetailer_key != "") {
                var apiKey = result.expyred_domdetailer_key;
                loadDomDetailerStats(apiKey);
                $('#domdetailer_detail').html("(" + _domain + ")");
            }
            else {
                chrome.extension.sendMessage({key: "getDomdetailerKey", email: result.expyred_email});
            }
        });
    });

    $(".metrics_title").click(function () {
        $('.scraped_domains_wrapper').show();
        $('.metrics_wrapper').hide();

        $("#save_all_domains").show();
    });

    function loadDomDetailerStats(apiKey) {
        chrome.extension.sendMessage({key: "loadDomdetailerStats", apiKey: apiKey, domain: _domain});
    }

    function showMetrics(stats) {

        $('#moz_links').html(stats.moz_links);

        $('#moz_da').html(stats.moz_da);

        $('#moz_pa').html(stats.moz_pa);

        $('#moz_rank').html(stats.moz_rank);

        $('#moz_trust').html(stats.moz_trust);

        $('#majestics_link').html(stats.majestics_link);

        $('#majestics_tf').html(stats.majestics_tf);

        $('#majestics_cf').html(stats.majestics_cf);

        $('#majestics_rd').html(stats.majestics_rd);

        $("#save_metrics").attr("domain",_domain);
    }

    $("#logout_link-1").click(function () {
        chrome.storage.sync.set({expyred_email: "", expyred_estibot_key: "", expyred_domdetailer_key: ""}, function () {
            window.location = "popup.html";
        });
    });


    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if (request.key == "getDomdetailerKey") {
            if (request.result == "") {
                $('#metrics_result').html("You need to add your DomDetailer API Key in order to check Moz and Majestic Metrics. Please go to the <a href='settings.html'>Settings</a> page and enter your API Key.");
            }
            else {
                chrome.storage.sync.set({expyred_domdetailer_key: request.result}, function () {
                    loadDomDetailerStats(request.result);
                });
            }
        }
        else if (request.key == "loadDomdetailerStats") {
            if (request.metrics_result) {
                $('#metrics_result').html(request.metrics_result);
            }
            else if (request.domdetailer_error) {
                $('#domdetailer_error').html(request.domdetailer_error);
                $("#domdetailer_error").show();
                $('#metrics_result').hide();
            }
            else if (request.result) {
                showMetrics(request.stats);

                $('.metrics_detail_wrapper').show();
                $('#metrics_result').hide();

                $('#domdetailer_error').html(request.result);
                $('#domdetailer_error').show();
            }
            else {
                $("#domdetailer_error").show();
                $('#metrics_result').hide();
            }
        }

    });

});
