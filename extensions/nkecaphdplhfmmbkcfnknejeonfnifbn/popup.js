let user_ID = null;


function userRewards() {
    chrome.storage.local.get('userid', function (result) {
        userid = result.userid;
        if (userid !== undefined && userid!=="")
        {
            user_ID = userid;
            let postData = "{\"facebook_id\":\"" + user_ID + "\"}";
                    const settings = {
                        "async": true,
                        "crossDomain": true,
                        "url": powerAdSpyRewards,
                        "method": "POST",
                        "headers": {
                            "content-type": "application/json",
                            "cache-control": "no-cache"
                        },
                        "processData": false,
                        "data": postData
                    };

                    $.ajax(settings).done(function (response) {
                        const obj = JSON.parse(response);
                        if (obj["code"] == 200) {
                            let paidAds = obj["paidads"];
                            let unpaidAds = obj["unpaidads"];
                            let adCount = obj["adscount"];

                            if (unpaidAds == adCount) {
                                if (unpaidAds < 100 || adCount < 100) {
                                    document.getElementById("amember-video").style.display = "block";
                                    document.getElementById('amember-video').href = "https://poweradspy.com";
                                } else {
                                    document.getElementById("amember-signup").style.display = "block";
                                    document.getElementById('amember-signup').href = powerAdSpyAmemberSignUp + user_ID;
                                }

                            }
                            if (unpaidAds != adCount) {
                                if (unpaidAds < 100 || adCount < 100) {
                                    document.getElementById("amember-video").style.display = "block";
                                    document.getElementById('amember-video').href = powerAdSpyEarning + user_ID;
                                }
                            }
                            if (paidAds > 0) {
                                document.getElementById("amember-login").style.display = "block";
                                document.getElementById('amember-login').href = powerAdSpyAmemberLogin;
                            }

                            document.getElementById("total-ads").innerHTML = obj["adscount"];
                            document.getElementById("earning").innerHTML = "$" + obj["moneycount"];
                            document.getElementById("earning-ff").innerHTML = "Click Here";
                        } else {
                            document.getElementById("amember-video").style.display = "block";
                            document.getElementById('amember-video').href = powerAdSpyEarning + user_ID;
                            document.getElementById("total-ads").innerHTML = "0";
                            document.getElementById("earning").innerHTML = "$" + 0.00;
                            document.getElementById("earning-ff").innerHTML = "Click Here";
                        }

                    }).fail(function () {
                        document.getElementById("earning").innerHTML = "error";
                        document.getElementById("total-ads").innerHTML = "error";

                    });
        }
        else
        {
            $.ajax({
                url: "https://www.facebook.com/",
                type: "GET",
                async: true,
                success: function (facebookResponse) {
                    user_ID = getBetween(facebookResponse, "USER_ID\":\"", "\"");
                    if (user_ID == "") {
                        user_ID = getBetween(facebookResponse, "ACCOUNT_ID\":\"", "\"");
                    }
                    let postData = "{\"facebook_id\":\"" + user_ID + "\"}";
                    const settings = {
                        "async": true,
                        "crossDomain": true,
                        "url": powerAdSpyRewards,
                        "method": "POST",
                        "headers": {
                            "content-type": "application/json",
                            "cache-control": "no-cache"
                        },
                        "processData": false,
                        "data": postData
                    };

                    $.ajax(settings).done(function (response) {
                        const obj = JSON.parse(response);
                        if (obj["code"] == 200) {
                            let paidAds = obj["paidads"];
                            let unpaidAds = obj["unpaidads"];
                            let adCount = obj["adscount"];

                            if (unpaidAds == adCount) {
                                if (unpaidAds < 100 || adCount < 100) {
                                    document.getElementById("amember-video").style.display = "block";
                                    document.getElementById('amember-video').href = "https://poweradspy.com";
                                } else {
                                    document.getElementById("amember-signup").style.display = "block";
                                    document.getElementById('amember-signup').href = powerAdSpyAmemberSignUp + user_ID;
                                }

                            }
                            if (unpaidAds != adCount) {
                                if (unpaidAds < 100 || adCount < 100) {
                                    document.getElementById("amember-video").style.display = "block";
                                    document.getElementById('amember-video').href = powerAdSpyEarning + user_ID;
                                }
                            }
                            if (paidAds > 0) {
                                document.getElementById("amember-login").style.display = "block";
                                document.getElementById('amember-login').href = powerAdSpyAmemberLogin;
                            }

                            document.getElementById("total-ads").innerHTML = obj["adscount"];
                            document.getElementById("earning").innerHTML = "$" + obj["moneycount"];
                            document.getElementById("earning-ff").innerHTML = "Click Here";
                        } else {
                            document.getElementById("amember-video").style.display = "block";
                            document.getElementById('amember-video').href = powerAdSpyEarning + user_ID;
                            document.getElementById("total-ads").innerHTML = "0";
                            document.getElementById("earning").innerHTML = "$" + 0.00;
                            document.getElementById("earning-ff").innerHTML = "Click Here";
                        }

                    }).fail(function () {
                        document.getElementById("earning").innerHTML = "error";
                        document.getElementById("total-ads").innerHTML = "error";

                    });

                }
            });
        }
    });
}

function getBetween(pageSource, firstData, secondData) {
    try {
        const resSplit = pageSource.split(firstData);
        const indexSec = resSplit[1].indexOf(secondData);
        return resSplit[1].substring(0, indexSec);
    } catch (e) {
        return "";
    }
}

chrome.storage.local.get({ 'issponsored': "OFF" }, function (result) {
    document.getElementById("is-sponsored").setAttribute("value", result.issponsored);
    // don't do this here, else we reload the page just because the user opened the popup
    // chrome.extension.sendMessage({ checkedValue: isSponsored });
});

$('#is-sponsored').on('click', function () {
    // debugger; // note this would require the dev tools for the popup window to be open!
    let checkedValue = document.querySelector('#is-sponsored').getAttribute("value");
    // toggle
    checkedValue = (checkedValue === "OFF") ? "ON" : "OFF";
    document.getElementById("is-sponsored").setAttribute("value", checkedValue);
    chrome.storage.local.set({ "issponsored": checkedValue }, function () {
        chrome.extension.sendMessage({ checkedValue: checkedValue });
    });
});

$('#user-rewards').on('click', function () {
    chrome.storage.local.get('userid', function (result) {
        user_ID = result.userid;
    });
    if (user_ID) {
        const url = powerAdSpyEarning;
        const form = $('<form action="' + url + '" method="post" target="_blank">' +
            '<input type="text" name="facebook_id" value="' + user_ID + '" />' +
            '</form>');
        $('body').append(form);
        form.submit();
    }
    else {
        $.ajax({
            url: "https://www.facebook.com/",
            type: "GET",
            async: true,
            success: function (facebookResponse) {
                user_ID = getBetween(facebookResponse, "USER_ID\":\"", "\"");
                if (user_ID == "") {
                    user_ID = getBetween(facebookResponse, "ACCOUNT_ID\":\"", "\"");
                }
                const url = powerAdSpyEarning;
                const form = $('<form action="' + url + '" method="post" target="_blank">' +
                    '<input type="text" name="facebook_id" value="' + user_ID + '" />' +
                    '</form>');
                $('body').append(form);
                form.submit();
            }
        })
    }
});
$('#user-history').on('click', function () {
    chrome.storage.local.get('userid', function (result) {
        user_ID = result.userid;
    });
    if (user_ID) {
        const url = powerAdSpyEarning;
        const form = $('<form action="' + url + '" method="post" target="_blank">' +
            '<input type="text" name="facebook_id" value="' + user_ID + '" />' +
            '</form>');
        $('body').append(form);
        form.submit();
    }
    else {
        $.ajax({
            url: "https://www.facebook.com/",
            type: "GET",
            async: true,
            success: function (facebookResponse) {
                user_ID = getBetween(facebookResponse, "USER_ID\":\"", "\"");
                if (user_ID == "") {
                    user_ID = getBetween(facebookResponse, "ACCOUNT_ID\":\"", "\"");
                }
                const url = powerAdSpyEarning;
                const form = $('<form action="' + url + '" method="post" target="_blank">' +
                    '<input type="text" name="facebook_id" value="' + user_ID + '" />' +
                    '</form>');
                $('body').append(form);
                form.submit();
            }
        })
    }
});
$('#version').text(version);
$('.login-link').attr('href', powerAdSpyLogin);
userRewards();
//startTime();
function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById("Time").innerHTML =
    h + ":" + m + ":" + s;
    var t = setTimeout(startTime, 500);
}
function checkTime(i) {
    if (i < 10) { i = "0" + i };  // add zero in front of numbers < 10
    return i;
}