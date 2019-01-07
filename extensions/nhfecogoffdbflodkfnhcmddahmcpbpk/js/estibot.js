/**
 *
 * Created by Ali H. on 10/4/2016.
 */
$( document ).ready(function() {
    chrome.storage.sync.get({expyred_email: "", expyred_estibot_key: "" }, function (result) {
        if (result.expyred_email == "") {
            window.location = "popup.html";
        }
        else {
            if (result.expyred_estibot_key != "") {
                var apiKey = result.expyred_estibot_key;
                loadEstiBotStats(apiKey);
            }
            else {
                $.ajax({
                    type: "GET",
                    url: "http://expireddomainscraper.com/extension_apis/read_estibot_key.php?email="+result.expyred_email,
                    cache: false,
                    success: function (key) {
                        if(key == ""){
                            $('#estibot_result').html("You need to add EstiBot API key. Visit <a href='settings.html'>Settings</a> page.");
                        }
                        else{
                            loadEstiBotStats(key);
                            chrome.storage.sync.set({expyred_estibot_key: key});
                        }
                    },
                    error: function(){
                        $('#estibot_result').html("Something went wrong, please check your internet connection or contact support");
                    }
                });
            }
        }
    });

    function loadEstiBotStats(apiKey){
        $.getJSON("http://domdetailer.com/api/checkDomain.php?domain=domainhuntergatherer.com&app=DomDetailer&apikey="+apiKey+"&majesticChoice=root", function (result) {
            if (result) {
                console.log(result);
                $('#moz_links').html(result.mozLinks);
                $('#moz_da').html(result.mozDA);
                $('#moz_pa').html(result.mozPA);
                $('#moz_rank').html(result.mozRank);
                $('#moz_trust').html(result.mozTrust);
                $('#majestics_link').html(result.majesticLinks);
                $('#majestics_tf').html(result.majesticTF);
                $('#majestics_cf').html(result.majesticCF);
                $('#majestics_rd').html(result.majesticRefDomains);
                $('.metrics_detail_wrapper').show();
                $('#metrics_result').hide();
            }
            else {
                $('#estibot_result').html("Something went wrong, please check your internet connection or contact support");
            }
        });
    }

    $("#logout_link").click(function(){
        chrome.storage.sync.set({expyred_email: "", expyred_estibot_key: "", expyred_domdetailer_key: "" }, function () {
            window.location = "popup.html";
        });
    });
});
