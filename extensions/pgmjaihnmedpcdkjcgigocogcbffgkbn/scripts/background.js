"use strict";

var getJSON = function(url, async, successHandler, errorHandler) {
    var xhr = new XMLHttpRequest();
    xhr.open("get", url, async);
    xhr.setRequestHeader("x-api-key", apikey);
    if (void 0 === async || async === !1) {
        xhr.send();
        if (200 === xhr.status) return xhr.response; else return !1;
    } else {
        xhr.responseType = "json";
        xhr.timeout = 1e3;
        xhr.onload = function() {
            var status = xhr.status;
            if (200 === status) successHandler && successHandler(xhr.response); else errorHandler && errorHandler(status);
        };
        xhr.send();
    }
};

function getTime() {
    var today = new Date();
    var dd = today.getDate();
    if (10 > dd) dd = "0" + dd;
    var mm = today.getMonth() + 1;
    if (10 > mm) mm = "0" + mm;
    var yyyy = today.getFullYear();
    var date = yyyy + "-" + mm + "-" + dd;
    var h = today.getHours();
    if (10 > h) h = "0" + h;
    var min = today.getMinutes();
    if (10 > min) min = "0" + min;
    var sec = today.getSeconds();
    if (10 > sec) sec = "0" + sec;
    var time = h + ":" + min + ":" + sec;
    return "[" + date + " " + time + "]";
}

function sendLog(PageUrl, cat, action) {
    if (s.companyId && s.userName && s.validationCode) if (s.userName.indexOf("@blocksicloud.com") > -1) {
        console.log(getTime() + " " + "Sending log");
        var today = new Date();
        var dd = today.getDate();
        if (10 > dd) dd = "0" + dd;
        var mm = today.getMonth() + 1;
        if (10 > mm) mm = "0" + mm;
        var yyyy = today.getFullYear();
        var date = yyyy + "-" + mm + "-" + dd;
        var h = today.getHours();
        if (10 > h) h = "0" + h;
        var min = today.getMinutes();
        if (10 > min) min = "0" + min;
        var sec = today.getSeconds();
        if (10 > sec) sec = "0" + sec;
        var time = h + ":" + min + ":" + sec;
        today.setHours(today.getHours() - today.getTimezoneOffset() / 60);
        var timestamp = today.toJSON();
        var reqUrl = "https://service.block.si/elasticsearch?date=" + date + "&time=" + time + "&Extension_Version=" + chrome.app.getDetails().version + "&timestamp=" + timestamp + "&userEmail=" + s.userName + "&Hostname=" + PageUrl.hostname + "&User_ID=" + s.userName + "&Company_ID=" + s.companyId + "&URL=" + PageUrl.hostname + "&Category=" + cat + "&Category_Action=" + action;
        getJSON(reqUrl, !0, function(data) {});
    }
}

function checkAction(PageUrl, cat, action) {
    sendLog(PageUrl, cat, action);
    if (0 === action) {
        console.log(getTime() + " " + "ALLOW");
        return {
            cancel: !1
        };
    }
    if (1 === action) {
        console.log(getTime() + " " + "BLOCK");
        var today = new Date();
        var dd = today.getDate();
        if (10 > dd) dd = "0" + dd;
        var mm = today.getMonth() + 1;
        if (10 > mm) mm = "0" + mm;
        var yyyy = today.getFullYear();
        var date = yyyy + "-" + mm + "-" + dd;
        var h = today.getHours();
        if (10 > h) h = "0" + h;
        var min = today.getMinutes();
        if (10 > min) min = "0" + min;
        var sec = today.getSeconds();
        if (10 > sec) sec = "0" + sec;
        var time = h + ":" + min + ":" + sec;
        if (s.userName && s.companyId) {
            console.log(getTime() + " " + "Sending block notification email");
            var sendEmail = "https://service.block.si/config/sendAlertEmail/" + s.companyId + "/" + s.userName + "/" + PageUrl.hostname + "/" + cat + "/" + date + "/" + time + "/residential";
            var jqxhr = $.getJSON(sendEmail, function(data) {});
        }
        if (s.userSettings.BlockUrl.indexOf("defaultBlockUrl") < 0) return {
            redirectUrl: s.userSettings.BlockUrl + "?url=" + PageUrl.hostname + "&category=" + cat
        }; else return {
            redirectUrl: "http://www.block.si/block.php?url=" + PageUrl.hostname + "&category=" + cat
        };
    }
    if (2 === action) {
        console.log(getTime() + " " + "WARNING");
        return {
            redirectUrl: "http://www.block.si/warning.php?url_link=" + encodeURIComponent(PageUrl.href) + "&category=" + cat
        };
    }
}

function localIP(ipAddress) {
    var ip = ipAddress.split(".");
    if (4 === ip.length) {
        var x = [ parseInt(ip[0], 10), parseInt(ip[1], 10), parseInt(ip[2], 10), parseInt(ip[3], 10) ];
        var from = [ [ 10, 0, 0, 0 ], [ 172, 16, 0, 0 ], [ 192, 168, 0, 0 ], [ 127, 0, 0, 1 ] ];
        var to = [ [ 10, 255, 255, 255 ], [ 172, 31, 255, 255 ], [ 192, 168, 255, 255 ], [ 127, 0, 0, 1 ] ];
        if (isNaN(x[0]) || isNaN(x[1]) || isNaN(x[2]) || isNaN(x[3])) return !1;
        var i = 3;
        while (i > -1) {
            if (from[i][0] <= x[0] && to[i][0] >= x[0] && from[i][1] <= x[1] && to[i][1] >= x[1] && from[i][2] <= x[2] && to[i][2] >= x[2] && from[i][3] <= x[3] && to[i][3] >= x[3]) return !0;
            i--;
        }
    }
    return !1;
}

function checkURL(PageUrl) {
    var action;
    var lan = localIP(PageUrl.hostname);
    if (lan) return {
        cancel: !1
    };
    var data = getJSON("https://service2.block.si/getRating.json?url=" + PageUrl.hostname);
    if (data) {
        var pageInfo = JSON.parse(data);
        console.log(getTime() + " " + pageInfo.Category);
        if (void 0 === pageInfo.status) {
            action = s.userSettings.webFilter[pageInfo.Category].a;
            return checkAction(PageUrl, pageInfo.Category, action);
        } else return {
            cancel: !1
        };
    } else return {
        cancel: !1
    };
}

function checkBlackWhite(PageUrl) {
    var len = s.userSettings.bwList.length, data, i;
    console.log(getTime() + " " + "Checking BW list");
    if (0 === len) return checkURL(PageUrl);
    for (i = 0; len >= i; i++) if (i === len) {
        console.log(getTime() + " " + " > Url not found in list");
        return checkURL(PageUrl);
    } else if (s.userSettings.bwList[i][0] === PageUrl.hostname.replace("www.", "") || s.userSettings.bwList[i][0] === PageUrl.hostname) {
        if (1 === s.userSettings.bwList[i][1] || "1" === s.userSettings.bwList[i][1]) {
            console.log(getTime() + " " + "Url found in list");
            if (data && void 0 === pageInfo.status) {
                sendLog(PageUrl, 800, 1);
                if (s.userSettings.BlockUrl.indexOf("defaultBlockUrl") > -1) return {
                    redirectUrl: "http://www.block.si/block.php?url=" + PageUrl.hostname + "&category=" + pageInfo.Category + "&bwlist=1"
                }; else return {
                    redirectUrl: s.userSettings.BlockUrl
                };
            } else {
                sendLog(PageUrl, 800, 1);
                if (s.userSettings.BlockUrl.indexOf("defaultBlockUrl") > -1) return {
                    redirectUrl: "http://www.block.si/block.php?url=" + PageUrl.hostname + "&category=700&bwlist=1"
                }; else return {
                    redirectUrl: s.userSettings.BlockUrl
                };
            }
        } else {
            sendLog(PageUrl, 800, 0);
            return {
                cancel: !1
            };
        }
        break;
    } else if (s.userSettings.bwList[i][0].indexOf("*") > -1) {
        var r = s.userSettings.bwList[i][0];
        r = r.replace(/\*/g, ".*").replace(/\./g, ".").replace(/\+/g, "\\+");
        var regex = new RegExp(r);
        if (regex.test(PageUrl.href)) {
            console.log(getTime() + " " + "Wildcard match");
            if (1 === s.userSettings.bwList[i][1] || "1" === s.userSettings.bwList[i][1]) if (data && void 0 === pageInfo.status) {
                sendLog(PageUrl, 800, 1);
                if (s.userSettings.BlockUrl.indexOf("defaultBlockUrl") > -1) return {
                    redirectUrl: "http://www.block.si/block_ext.php?url=" + PageUrl.hostname + "&category=" + pageInfo.Category + "&bwlist=1"
                }; else return {
                    redirectUrl: s.userSettings.BlockUrl
                };
            } else {
                sendLog(PageUrl, 800, 1);
                if (s.userSettings.BlockUrl.indexOf("defaultBlockUrl") > -1) return {
                    redirectUrl: "http://www.block.si/block_ext.php?url=" + PageUrl.hostname + "&category=700&bwlist=1"
                }; else return {
                    redirectUrl: s.userSettings.BlockUrl
                };
            } else {
                sendLog(PageUrl, 800, 0);
                return {
                    cancel: !1
                };
            }
        }
    }
}

function extractVideoID(PageUrl) {
    var embed = PageUrl.pathname.split("/");
    if ("embed" === embed[1] && embed[2]) return embed[2];
    if (!PageUrl.search) return !1;
    if ("embedded" === PageUrl.searchParams.get("el")) return !1;
    var videoId = PageUrl.searchParams.get("v");
    if (videoId) return videoId;
    videoId = PageUrl.searchParams.get("video_id");
    if (videoId) return videoId;
    return !1;
}

function youtubeBlockChannel(PageUrl) {
    var youtubeURL = PageUrl.pathname;
    var channelID = youtubeURL.split("/");
    var userChannel = channelID[1];
    if ("user" === userChannel || "channel" === userChannel) {
        var checkAPI = "";
        if ("user" === userChannel) checkAPI = getJSON("https://www.googleapis.com/youtube/v3/channels?part=snippet&forUsername=" + channelID[2] + "&key=AIzaSyBKT3Saw74H4enTSrEj0pI5-dOh3RjfKzk"); else if ("channel" === userChannel) checkAPI = getJSON("https://www.googleapis.com/youtube/v3/channels?part=snippet&id=" + channelID[2] + "&key=AIzaSyBKT3Saw74H4enTSrEj0pI5-dOh3RjfKzk");
        if (checkAPI) {
            var parseChannel = JSON.parse(checkAPI);
            return parseChannel;
        }
    }
    return !1;
}

function youtube(PageUrl) {
    var videoId = extractVideoID(PageUrl);
    if (videoId && "iOd5r5pfHig" !== videoId) {
        var data = getJSON("http://service1.block.si/getYtRating?video=" + videoId);
        if (!data) return !1;
        var rating = JSON.parse(data);
        if ("status" in rating) return !1;
        return rating;
    }
    return !1;
}

function checkYoutube(PageUrl) {
    var rating = youtube(PageUrl);
    var parseChannel = youtubeBlockChannel(PageUrl);
    var embedd = /(embed)/;
    var url1 = PageUrl.pathname;
    var isEmbedd = url1.match(embedd);
    var url = "https://www.youtube.com/watch?v=iOd5r5pfHig", channelList, matchchannelName;
    if (rating) {
        var videoID = rating.video;
        var title = rating.title;
        var channel = rating.channel;
        var channelId = rating.channelId;
        var description = rating.description;
        var restricted = rating.restricted;
        var category = rating.category;
        for (var i = 0; i < s.userSettings.bwList.length; i++) if (s.userSettings.bwList[i][0].includes("watch?v=")) {
            var id = s.userSettings.bwList[i][0].split("watch?v=")[1];
            if (videID === id && "0" === s.userSettings.bwList[i][1]) return {
                cancel: !1
            }; else if (videID === id && "1" === s.userSettings.bwList[i][1]) return {
                redirectUrl: url
            };
        }
        for (var i = 0; i < s.userSettings.ytKeywords.length; i++) if (title.toLowerCase().indexOf(s.userSettings.ytKeywords[i]) > -1 || description.toLowerCase().indexOf(s.userSettings.ytKeywords[i]) > -1) return {
            redirectUrl: url
        };
        for (var i = 0; i < s.userSettings.ytChannelList.length; i++) if (channel == s.userSettings.ytChannelList[i][0] || channelId == s.userSettings.ytChannelList[i][0]) if ("0" == s.userSettings.ytChannelList[i][1] || 0 == s.userSettings.ytChannelList[i][1]) return {
            cancel: !1
        }; else if ("1" == s.userSettings.ytChannelList[i][1] || 1 == s.userSettings.ytChannelList[i][1]) return {
            redirectUrl: url
        };
        if (restricted && 1 == s.userSettings.ytAgeRestriction) {
            console.log(getTime() + " " + "Age restricted video");
            return {
                redirectUrl: url
            };
        }
        if (1 === s.userSettings.ytFilter["yt_" + category].a) return {
            redirectUrl: url
        };
    }
    if (isEmbedd) return {
        redirectUrl: url
    };
    if (parseChannel) {
        var name = parseChannel.items[0].snippet.title;
        for (var i = 0; i < s.userSettings.ytChannelList.length; i++) {
            channelList = s.userSettings.ytChannelList[i][0];
            matchchannelName = name.match(channelList);
            if (matchchannelName) if ("0" == s.userSettings.ytChannelList[i][1] || 0 == s.userSettings.ytChannelList[i][1]) return {
                cancel: !1
            }; else if ("1" == s.userSettings.ytChannelList[i][1] || 1 == s.userSettings.ytChannelList[i][1]) return {
                redirectUrl: url
            };
        }
    }
    return checkBlackWhite(PageUrl);
}

function checkAccTimes(PageUrl) {
    var now = new Date(), then = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0), diff = now.getTime() - then.getTime(), day = now.getDay();
    if ("x" != s.userSettings.AccTimes[day]) {
        var len = s.userSettings.AccTimes[day].length, i;
        if ("undefined" != typeof s.userSettings.AccTimes[day]) if ("string" == typeof s.userSettings.AccTimes[day]) {
            var periods = s.userSettings.AccTimes[day].split(",");
            for (var i = 0; i < periods.length; i++) {
                var FromTo = periods[i].split("_");
                var from = parseInt(FromTo[0].split(":")[0]);
                var to = parseInt(FromTo[1].split(":")[0]);
                var t1_ = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0), from_ = new Date(t1_.getFullYear(), t1_.getMonth(), t1_.getDate(), from, 0, 0), till_ = new Date(t1_.getFullYear(), t1_.getMonth(), t1_.getDate(), to, 0, 0);
                var diff1 = from_.getTime() - t1_.getTime(), diff2 = till_.getTime() - t1_.getTime();
                if (i === len) break; else if (diff > diff1 && diff2 > diff) {
                    var t1 = new Date(0, 0, 0, 0, 0, 0, diff1).getHours(), t2 = new Date(0, 0, 0, 0, 0, 0, diff2).getHours();
                    if (10 > t1) t1 = "0" + t1;
                    if (10 > t2) t2 = "0" + t2;
                    t1 += ":00:00";
                    t2 += ":00:00";
                    sendLog(PageUrl, 700, 1);
                    if (s.userSettings.BlockUrl.indexOf("defaultBlockUrl") < 0) return {
                        redirectUrl: s.userSettings.BlockUrl
                    }; else return {
                        redirectUrl: "http://www.block.si/acctime.php?t1=" + t1 + "&t2=" + t2
                    };
                }
            }
        }
    }
    if ("x" != s.userSettings.AccTimesFB[day]) {
        var len = s.userSettings.AccTimesFB[day].length, i;
        if ("undefined" != typeof s.userSettings.AccTimesFB[day]) if ("string" == typeof s.userSettings.AccTimesFB[day]) {
            var periods = s.userSettings.AccTimesFB[day].split(",");
            for (var i = 0; i < periods.length; i++) {
                var FromTo = periods[i].split("_");
                var from = parseInt(FromTo[0].split(":")[0]);
                var to = parseInt(FromTo[1].split(":")[0]);
                var t1_ = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0), from_ = new Date(t1_.getFullYear(), t1_.getMonth(), t1_.getDate(), from, 0, 0), till_ = new Date(t1_.getFullYear(), t1_.getMonth(), t1_.getDate(), to, 0, 0);
                var diff1 = from_.getTime() - t1_.getTime(), diff2 = till_.getTime() - t1_.getTime();
                if (i === len) break; else if (PageUrl.host.indexOf("facebook") != -1 && diff > diff1 && diff2 > diff) {
                    var t1 = new Date(0, 0, 0, 0, 0, 0, diff1).getHours(), t2 = new Date(0, 0, 0, 0, 0, 0, diff2).getHours();
                    if (10 > t1) t1 = "0" + t1;
                    if (10 > t2) t2 = "0" + t2;
                    t1 += ":00:00";
                    t2 += ":00:00";
                    sendLog(PageUrl, 700, 1);
                    if (s.userSettings.BlockUrl.indexOf("defaultBlockUrl") < 0) return {
                        redirectUrl: s.userSettings.BlockUrl
                    }; else return {
                        redirectUrl: "http://www.block.si/acctime.php?t1=" + t1 + "&t2=" + t2
                    };
                }
            }
        }
    }
    if ("x" != s.userSettings.AccTimesYT[day]) {
        var len = s.userSettings.AccTimesYT[day].length, i;
        if ("undefined" != typeof s.userSettings.AccTimesYT[day]) if ("string" == typeof s.userSettings.AccTimesYT[day]) {
            var periods = s.userSettings.AccTimesYT[day].split(",");
            for (var i = 0; i < periods.length; i++) {
                var FromTo = periods[i].split("_");
                var from = parseInt(FromTo[0].split(":")[0]);
                var to = parseInt(FromTo[1].split(":")[0]);
                var t1_ = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0), from_ = new Date(t1_.getFullYear(), t1_.getMonth(), t1_.getDate(), from, 0, 0), till_ = new Date(t1_.getFullYear(), t1_.getMonth(), t1_.getDate(), to, 0, 0);
                var diff1 = from_.getTime() - t1_.getTime(), diff2 = till_.getTime() - t1_.getTime();
                if (i === len) break; else if (PageUrl.host.indexOf("youtube") != -1 && diff > diff1 && diff2 > diff) {
                    var t1 = new Date(0, 0, 0, 0, 0, 0, diff1).getHours(), t2 = new Date(0, 0, 0, 0, 0, 0, diff2).getHours();
                    if (10 > t1) t1 = "0" + t1;
                    if (10 > t2) t2 = "0" + t2;
                    t1 += ":00:00";
                    t2 += ":00:00";
                    sendLog(PageUrl, 700, 1);
                    if (s.userSettings.BlockUrl.indexOf("defaultBlockUrl") < 0) return {
                        redirectUrl: s.userSettings.BlockUrl
                    }; else return {
                        redirectUrl: "http://www.block.si/acctime.php?t1=" + t1 + "&t2=" + t2
                    };
                }
            }
        }
    }
    if ("www.youtube.com" === PageUrl.host) return checkYoutube(PageUrl); else return checkBlackWhite(PageUrl);
}

function pageCheck(url) {
    var PageUrl = new URL(url);
    var whitelist = [ "accounts.google.com", "blocksimanager.appspot.com", "www.block.si", "service2.block.si", "service.block.si", "accounts.youtube.com" ];
    var i = whitelist.length - 1;
    if ("true" == s.userSettings.SafeSearch) if (PageUrl.hostname.indexOf("www.google") > -1 && PageUrl.href.indexOf("maps") < 0 && PageUrl.href.indexOf("safe=active") < 0) if (PageUrl.search.length > 0) return {
        redirectUrl: PageUrl.href + "&safe=active"
    }; else return {
        redirectUrl: PageUrl.href + "?safe=active"
    }; else if (PageUrl.hostname.indexOf("www.bing") > -1 && PageUrl.href.indexOf("adlt=strict") < 0) return {
        redirectUrl: PageUrl.href + "&adlt=strict"
    }; else if (PageUrl.hostname.indexOf("search.yahoo") > -1 && PageUrl.href.indexOf("vm=r") < 0) return {
        redirectUrl: PageUrl.href + "&vm=r"
    };
    while (i > -1) {
        if (whitelist[i] === PageUrl.hostname || PageUrl.hostname.indexOf(whitelist[i]) > -1) return {
            cancel: !1
        };
        i--;
    }
    while (i > -1) {
        if (whitelist[i] === PageUrl.hostname || PageUrl.hostname.indexOf(whitelist[i]) > -1) return {
            cancel: !1
        };
        i--;
    }
    if ("http:" === PageUrl.protocol || "https:" === PageUrl.protocol) if (s.userSettings.AccTimeEnabled) return checkAccTimes(PageUrl); else if ("www.youtube.com" === PageUrl.host) return checkYoutube(PageUrl); else return checkBlackWhite(PageUrl); else return {
        cancel: !1
    };
}

function getTime() {
    var today = new Date();
    var dd = today.getDate();
    if (10 > dd) dd = "0" + dd;
    var mm = today.getMonth() + 1;
    if (10 > mm) mm = "0" + mm;
    var yyyy = today.getFullYear();
    var date = yyyy + "-" + mm + "-" + dd;
    var h = today.getHours();
    if (10 > h) h = "0" + h;
    var min = today.getMinutes();
    if (10 > min) min = "0" + min;
    var sec = today.getSeconds();
    if (10 > sec) sec = "0" + sec;
    var time = h + ":" + min + ":" + sec;
    return "[" + date + " " + time + "]";
}

var s;

function updateChromeSettings() {
    chrome.storage.sync.set({
        BlocksiSettingsV2: s
    });
}

function storeBmhSettings() {
    chrome.storage.sync.set({
        BMHConfig: s
    });
}

var user;

var pingCount;

var geolocCount = 0;

var locDownloads = 0;

function displayError(error) {
    var errors = {
        1: "Permission denied",
        2: "Position unavailable",
        3: "Request timeout"
    };
    console.log(getTime() + " " + "Geolocation error: " + errors[error.code]);
    if (5 > geolocCount) {
        if (navigator.geolocation) {
            geolocCount++;
            setTimeout(function() {
                navigator.geolocation.getCurrentPosition(getGeolocation, displayError);
            }, 5e3);
        }
    } else getManagerSettings(user, "none", 0);
}

function calculateDistance(startLat, startLon, endLat, endLon) {
    console.log(getTime() + " " + "Calculating distance");
    var R = 6371;
    var lat1 = startLat * Math.PI / 180;
    var lat2 = endLat * Math.PI / 180;
    var delta1 = (endLat - startLat) * Math.PI / 180;
    var delta2 = (endLon - startLon) * Math.PI / 180;
    var a = Math.sin(delta1 / 2) * Math.sin(delta1 / 2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(delta2 / 2) * Math.sin(delta2 / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
}

var getGeolocation = function(position) {
    console.log(getTime() + " " + "--------------------- GEOLOCATION ----------------------------------------------");
    geolocCount = 0;
    var reqUrl = "https://service.block.si/config/getLocations/" + user;
    var jqxhr = $.getJSON(reqUrl, function(data) {
        locDownloads = 0;
        console.log(getTime() + " " + "Locations: ");
        console.log(data);
        if ("true" == data.status) for (var i = 0; i < data.locations.length; i++) {
            var newPos = position.coords;
            var startLat = parseFloat(data.locations[i].latitude);
            var startLon = parseFloat(data.locations[i].longitude);
            var endLat = parseFloat(position.coords.latitude);
            var endLon = parseFloat(position.coords.longitude);
            var d = calculateDistance(startLat, startLon, endLat, endLon);
            console.log(getTime() + " " + "Distance: " + d);
            if (.8 > d) {
                console.log(getTime() + " " + "Geolocation is valid. Applying filter settings...");
                getManagerSettings(user, "none", 0);
                break;
            }
            if (i == data.locations.length - 1) {
                console.log(getTime() + " " + "Unknown location. Applying empty filter...");
                setNoFiltering(user, 0);
            }
        } else {
            console.log(getTime() + " " + "No locations defined.");
            getManagerSettings(user, "none", 0);
        }
    }).fail(function() {
        locDownloads++;
        console.log(getTime() + " " + "Error: Could not retrieve locations.");
        if (10 > locDownloads) setTimeout(function() {
            navigator.geolocation.getCurrentPosition(getGeolocation, displayError);
        }, 5e3); else getManagerSettings(user, "none", 0);
    });
};

var timePolicyInterval;

function checkTabs(interval) {
    console.log(getTime() + " Checking time control...");
    if (checkTimeControl("general")) {
        console.log(getTime() + " General time control is active. Closing all tabs.");
        chrome.tabs.query({}, function(tabs) {
            var tabs_ = [];
            for (var i = 0; i < tabs.length; i++) tabs_.push(tabs[i].id);
            chrome.tabs.remove(tabs_, function() {});
        });
    } else {
        if (checkTimeControl("facebook")) {
            console.log(getTime() + " Facebook time control is active. Closing Facebook tabs.");
            chrome.tabs.query({}, function(tabs) {
                var tabs_ = [];
                for (var i = 0; i < tabs.length; i++) if (tabs[i].url.indexOf("facebook") > -1) tabs_.push(tabs[i].id);
                chrome.tabs.remove(tabs_, function() {});
            });
        }
        if (checkTimeControl("youtube")) {
            console.log(getTime() + " Youtube time control is active. Closing Youtube tabs.");
            chrome.tabs.query({}, function(tabs) {
                var tabs_ = [];
                for (var i = 0; i < tabs.length; i++) if (tabs[i].url.indexOf("youtube") > -1) tabs_.push(tabs[i].id);
                chrome.tabs.remove(tabs_, function() {});
            });
        }
    }
    if (interval) makeInterval(!0);
}

function checkTimeControl(type) {
    var now = new Date(), then = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0), diff = now.getTime() - then.getTime(), day = now.getDay();
    var timeArray;
    if (s) {
        if ("facebook" == type) timeArray = s.userSettings.AccTimesFB; else if ("youtube" == type) timeArray = s.userSettings.AccTimesYT; else timeArray = s.userSettings.AccTimes;
        if ("x" != timeArray[day]) {
            var len = timeArray[day].length, i;
            if ("undefined" != typeof timeArray[day]) if ("string" == typeof timeArray[day]) {
                var periods = timeArray[day].split(",");
                for (var i = 0; i < periods.length; i++) {
                    var FromTo = periods[i].split("_");
                    var from = parseInt(FromTo[0].split(":")[0]);
                    var to = parseInt(FromTo[1].split(":")[0]);
                    var t1_ = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0), from_ = new Date(t1_.getFullYear(), t1_.getMonth(), t1_.getDate(), from, 0, 0), till_ = new Date(t1_.getFullYear(), t1_.getMonth(), t1_.getDate(), to, 0, 0);
                    var diff1 = from_.getTime() - t1_.getTime(), diff2 = till_.getTime() - t1_.getTime();
                    if (i === len) break; else if (diff > diff1 && diff2 > diff) {
                        var t1 = new Date(0, 0, 0, 0, 0, 0, diff1).getHours(), t2 = new Date(0, 0, 0, 0, 0, 0, diff2).getHours();
                        if (10 > t1) t1 = "0" + t1;
                        if (10 > t2) t2 = "0" + t2;
                        t1 += ":00:00";
                        t2 += ":00:00";
                        return !0;
                    }
                }
            }
        }
    }
    return !1;
}

function makeInterval(newInterval) {
    var d = new Date();
    var min = d.getMinutes();
    var sec = d.getSeconds();
    if ("00" == min && "00" == sec && 0 == newInterval) checkTabs(!0); else if (0 == newInterval) {
        timePolicyInterval = setTimeout(function() {
            checkTabs(!0);
        }, 1e3 * (60 * (60 - min - 1) + (60 - sec)));
        var ms = 1e3 * (60 * (60 - min - 1) + (60 - sec));
        var sec = ms / 1e3;
        var min = Math.round(sec / 60) - 1;
        var sec_left = sec % 60;
        console.log(getTime() + " Checking time control in " + min + " minutes " + sec_left + " seconds");
    } else {
        timePolicyInterval = setTimeout(function() {
            checkTabs(!0);
        }, 36e5);
        console.log(getTime() + " Checking time control in 60 minutes.");
    }
}

chrome.runtime.onUpdateAvailable.addListener(function(details) {
    console.log(getTime() + " " + "Updating to version " + details.version);
    chrome.runtime.reload();
});

chrome.runtime.requestUpdateCheck(function(status, details) {});

var ws;

var pingInterval;

var reconnectInterval;

function ConnectWebSocket(cId) {
    console.log(getTime() + " " + "----------------------------- WEB SOCKET -------------------------------------");
    var socketIoHost = "wss://k8s-ws-lb.block.si";
    var socketClient = io.connect(socketIoHost, {
        transports: [ "websocket" ],
        parser: msgpack,
        query: {
            companyId: cId,
            GroupId: user,
            user: user
        }
    });
    socketClient.on("connect", function() {
        console.log(getTime() + "[SOCKET-IO]Connection established");
    });
    socketClient.on("connect_error", function(error) {
        console.error(getTime(), "[SOCKET-IO]Connection error:" + error);
    });
    socketClient.on("connect_timeout", function(timeout) {
        console.error(getTime(), "[SOCKET-IO] Connection timeout:" + timeout);
    });
    socketClient.on("disconnect", function(reason) {
        console.error(getTime(), "[SOCKET-IO] Disconnected from server:" + reason);
    });
    socketClient.on("error", function(error) {
        console.error(getTime(), "[SOCKET-IO] Socket error:" + error);
    });
    socketClient.on("updateSettings", function() {
        if (navigator.geolocation) navigator.geolocation.getCurrentPosition(getGeolocation, displayError); else getManagerSettings(user, "none", 0);
    });
}

function initExtension() {
    console.log(getTime() + " " + "Initializing Blocksi...");
    chrome.storage.sync.get("BMHConfig", function(data) {
        if (data.BMHConfig) {
            console.log(getTime() + " Temporarily loading stored settings");
            s = data.BMHConfig;
        } else console.log(getTime() + " No stored settings available.");
        chrome.identity.getProfileUserInfo(function(userInfo) {
            user = userInfo.email;
            if (user.indexOf("@blocksicloud.com") > -1) {
                chrome.browserAction.disable();
                chrome.browserAction.setTitle({
                    title: "Manager is used"
                });
                chrome.browserAction.setBadgeText({
                    text: "M"
                });
                console.log(getTime() + " " + "Setting up user: " + user);
                var jqxhr1 = $.getJSON("https://service.block.si/config/setExtension/" + user + "/" + user + "/" + user, function(data) {
                    ConnectWebSocket(data.CompanyId);
                });
                if (navigator.geolocation) navigator.geolocation.getCurrentPosition(getGeolocation, displayError); else {
                    console.log(getTime() + " " + "Geolocation is not supported. Downloading settings...");
                    getManagerSettings(user, "none", 0);
                }
            } else updateLocalSettings();
            makeInterval(!1);
        });
    });
}

function setNoFiltering(userName, count) {
    var i, len, name, reqUrl;
    reqUrl = "https://service.block.si/config/getSettingsByHomeUser/" + userName;
    var jqxhr = $.getJSON(reqUrl, function(data) {
        var reqSettings;
        if ("string" == typeof data) reqSettings = JSON.parse(data); else reqSettings = data;
        if ("true" === reqSettings.status) {
            s = new UserData(userName, "none");
            s.companyId = reqSettings.CompanyId;
            s.userSettings.SafeSearch = "false";
            len = Object.keys(s.userSettings.webFilter).length;
            for (i = 0; len > i; i++) {
                name = Object.keys(s.userSettings.webFilter)[i];
                s.userSettings.webFilter[name].a = parseInt("0", 10);
            }
            updateChromeSettings();
        }
    }).fail(function() {
        if (10 > count) setTimeout(function() {
            setNoFiltering(userName, validationCode, count + 1);
        }, 1e4);
        console.log(getTime() + " " + "---------------------------------------------------------------------------------");
    });
}

function getManagerSettings(userName, validationCode, count) {
    var i, len, name, reqUrl;
    if ("none" === validationCode) reqUrl = "https://service.block.si/config/getSettingsByHomeUser/" + userName; else reqUrl = "https://service.block.si/config/getSettingsByHomeUser/" + userName + "/" + validationCode;
    var jqxhr = $.getJSON(reqUrl, function(data) {
        var reqSettings;
        if ("string" == typeof data) reqSettings = JSON.parse(data); else reqSettings = data;
        if ("true" === reqSettings.status) {
            console.log(getTime());
            console.log(reqSettings);
            s = new UserData(userName, validationCode);
            s.companyId = reqSettings.CompanyId;
            if ("true" === reqSettings.PassStatus) s.password = [ !0, reqSettings.Password ]; else s.password = [ !0, "" ];
            if (void 0 != reqSettings.BlockUrl && null != reqSettings.BlockUrl) {
                s.userSettings.BlockUrl = reqSettings.BlockUrl;
                if (s.userSettings.BlockUrl.indexOf("http://") < 0 && s.userSettings.BlockUrl.indexOf("https://") < 0) s.userSettings.BlockUrl = "http://" + s.userSettings.BlockUrl;
            }
            if (null != reqSettings.SafeSearch && void 0 != reqSettings.SafeSearch) s.userSettings.SafeSearch = reqSettings.SafeSearch;
            var fix = [ 49, 38, 32, 17, 8, 5 ];
            var arr = reqSettings.FilterSettings.split("");
            len = fix.length;
            for (i = 0; len > i; i++) {
                var p = arr.splice(fix[i], 1)[0];
                arr.reverse().push(p);
                arr.reverse();
            }
            len = Object.keys(s.userSettings.webFilter).length;
            for (i = 0; len > i; i++) {
                name = Object.keys(s.userSettings.webFilter)[i];
                s.userSettings.webFilter[name].a = parseInt(arr[i], 10);
            }
            if (null !== reqSettings.YTFilter) if (reqSettings.YTFilter.length > 0) {
                len = Object.keys(s.userSettings.ytFilter).length;
                s.userSettings.ytFilter.embedded = reqSettings.YTFilter[0].Embedded;
                for (i = 0; len > i; i++) {
                    name = Object.keys(s.userSettings.ytFilter)[i];
                    s.userSettings.ytFilter[name].a = parseInt(reqSettings.YTFilter[0].Settings.charAt(i), 10);
                }
                if (reqSettings.YTFilter[0].Settings.length > 33) if ("1" == reqSettings.YTFilter[0].Settings.charAt(33)) s.userSettings.ytAgeRestriction = !0; else s.userSettings.ytAgeRestriction = !1; else s.userSettings.ytAgeRestriction = !0;
            }
            len = reqSettings.YTChannelList.length;
            for (i = 0; len > i; i++) {
                var a = new Array();
                a[0] = reqSettings.YTChannelList[i].Channel;
                a[1] = reqSettings.YTChannelList[i].Action;
                s.userSettings.ytChannelList.push(a);
            }
            len = reqSettings.YTKeywords.length;
            for (i = 0; len > i; i++) s.userSettings.ytKeywords.push(reqSettings.YTKeywords[i].Keyword);
            len = reqSettings.List.length;
            for (i = 0; len > i; i++) {
                var a = new Array();
                a[0] = reqSettings.List[i].Url;
                a[1] = reqSettings.List[i].Action;
                s.userSettings.bwList.push(a);
            }
            len = reqSettings.AppFilter.length;
            if (len > 0) {
                var ytUrls = [ "*.ytimg.com", "*.ggpht.com", "*.googleusercontent.com", "*.googlevideo.com", "*.youtube.com*", "*.youtu.be*", "*youtu.be*", "*youtube.com*", "youtube.com", "youtu.be", "www.youtube.com", "*accounts.youtube.com*" ];
                var googleDocsUrls = [ "*docs.google.com*", "lh*.google.com", "*.client-channel.google.com" ];
                var googleClassroomUrls = [ "*classroom.google.com*" ];
                var gmailUrls = [ "*mail.google.com*", "*www.gmail.com*" ];
                var googleDriveUrls = [ "*drive.google.com*" ];
                var ytAction;
                var gdAction;
                var classroomAction;
                var gmailAction;
                var googleDriveAction;
                if (0 == reqSettings.AppFilter[0].Youtube || "0" == reqSettings.AppFilter[0].Youtube) ytAction = "0"; else ytAction = "1";
                if (0 == reqSettings.AppFilter[0].GoogleDocs || "0" == reqSettings.AppFilter[0].GoogleDocs) gdAction = "0"; else gdAction = "1";
                if (0 == reqSettings.AppFilter[0].GoogleClassroom || "0" == reqSettings.AppFilter[0].GoogleClassroom) classroomAction = "0"; else classroomAction = "1";
                if (0 == reqSettings.AppFilter[0].Gmail || "0" == reqSettings.AppFilter[0].Gmail) gmailAction = "0"; else gmailAction = "1";
                if (0 == reqSettings.AppFilter[0].GoogleDrive || "0" == reqSettings.AppFilter[0].GoogleDrive) googleDriveAction = "0"; else googleDriveAction = "1";
                var c;
                for (c = 0; c < ytUrls.length; c++) {
                    var a = new Array();
                    a[0] = ytUrls[c];
                    a[1] = ytAction;
                    s.userSettings.bwList.push(a);
                }
                for (c = 0; c < googleDocsUrls.length; c++) {
                    var a = new Array();
                    a[0] = googleDocsUrls[c];
                    a[1] = gdAction;
                    s.userSettings.bwList.push(a);
                }
                for (c = 0; c < googleClassroomUrls.length; c++) {
                    var a = new Array();
                    a[0] = googleClassroomUrls[c];
                    a[1] = classroomAction;
                    s.userSettings.bwList.push(a);
                }
                for (c = 0; c < gmailUrls.length; c++) {
                    var a = new Array();
                    a[0] = gmailUrls[c];
                    a[1] = gmailAction;
                    s.userSettings.bwList.push(a);
                }
                for (c = 0; c < googleDriveUrls.length; c++) {
                    var a = new Array();
                    a[0] = googleDriveUrls[c];
                    a[1] = googleDriveAction;
                    s.userSettings.bwList.push(a);
                }
            }
            s.userSettings.bwList.push(new Array("accounts.google.com", "0"));
            s.userSettings.bwList.push(new Array("accounts.youtube.com", "0"));
            if (reqSettings.RegEx) {
                len = reqSettings.RegEx.length;
                for (i = 0; len > i; i++) s.userSettings.regExList.push(reqSettings.RegEx[i].RegEx);
            }
            if (null !== reqSettings.ATProfile) {
                s.userSettings.AccTimeEnabled = !0;
                s.userSettings.AccTimes = [ "x", "x", "x", "x", "x", "x", "x" ];
                len = reqSettings.ATProfile.length;
                for (i = 0; len > i; i++) if ("x" !== reqSettings.ATProfile[i]) s.userSettings.AccTimes[i] = reqSettings.ATProfile[i];
            }
            if (null !== reqSettings.ATProfileFB) {
                s.userSettings.AccTimeEnabled = !0;
                s.userSettings.AccTimesFB = [ "x", "x", "x", "x", "x", "x", "x" ];
                len = reqSettings.ATProfileFB.length;
                for (i = 0; len > i; i++) if ("x" !== reqSettings.ATProfileFB[i]) s.userSettings.AccTimesFB[i] = reqSettings.ATProfileFB[i];
            }
            if (null !== reqSettings.ATProfileYT) {
                s.userSettings.AccTimeEnabled = !0;
                s.userSettings.AccTimesYT = [ "x", "x", "x", "x", "x", "x", "x" ];
                len = reqSettings.ATProfileYT.length;
                for (i = 0; len > i; i++) if ("x" !== reqSettings.ATProfileYT[i]) s.userSettings.AccTimesYT[i] = reqSettings.ATProfileYT[i];
            }
            console.log(getTime());
            console.log(s.userSettings);
            updateChromeSettings();
            storeBmhSettings();
            checkTabs(!1);
        }
    }).fail(function() {
        chrome.storage.sync.get("BMHConfig", function(data) {
            if (data.BMHConfig) s = data.BMHConfig;
        });
        console.log(getTime() + " " + "Settings download: Error");
        if (10 > count) setTimeout(function() {
            getManagerSettings(userName, validationCode, count + 1);
        }, 1e4);
        console.log(getTime() + " " + "---------------------------------------------------------------------------------");
    });
}

function updateLocalSettings() {
    if (user.indexOf("@blocksicloud.com") < 0) chrome.storage.sync.get("BlocksiSettingsV2", function(data) {
        if (data.BlocksiSettingsV2) {
            s = data.BlocksiSettingsV2;
            chrome.browserAction.enable();
            chrome.browserAction.setTitle({
                title: "Add to black/white list"
            });
            chrome.browserAction.setBadgeText({
                text: ""
            });
            if (s.userName && s.validationCode) {
                getManagerSettings(s.userName, s.validationCode, 0);
                chrome.browserAction.disable();
                chrome.browserAction.setTitle({
                    title: "Manager is used"
                });
                chrome.browserAction.setBadgeText({
                    text: "M"
                });
            }
        } else {
            s = new UserData(!1, !1);
            updateChromeSettings();
            chrome.tabs.create({
                url: "quick-setup.html"
            });
        }
    });
}

initExtension();

function addURLtoBW(url, action) {
    var len = s.userSettings.bwList.length;
    if (0 === len) {
        s.userSettings.bwList.push([ url, action ]);
        updateChromeSettings();
        return;
    }
    for (var i = 0; len > i; i++) {
        if (s.userSettings.bwList[i][0] === url || s.userSettings.bwList[i][0].indexOf(url) !== -1) {
            s.userSettings.bwList[i][1] = action;
            updateChromeSettings();
            break;
        }
        if (i === len - 1) {
            s.userSettings.bwList.push([ url, action ]);
            updateChromeSettings();
        }
    }
}

function getBWaction(url) {
    var len = s.userSettings.bwList.length;
    if (0 === len) return 0;
    for (var i = 0; len > i; i++) {
        if (s.userSettings.bwList[i][0] === url) return s.userSettings.bwList[i][1];
        if (i === len - 1) return 0;
    }
}

chrome.storage.onChanged.addListener(function(changes, areaName) {
    console.log(getTime() + " " + "              LISTENER: setting changed              ");
    updateLocalSettings();
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (void 0 !== request.regex) {
        console.log(getTime() + " " + "Regex checking");
        sendResponse({
            Regex: s.userSettings.regExList,
            WhiteList: s.userSettings.bwList
        });
    } else if (void 0 !== request.warning) if ("Allow" === request.warning) {
        var url = new URL(decodeURIComponent(request.url));
        addURLtoBW(url.hostname, 0);
        chrome.tabs.update(sender.tab.id, {
            url: url.href
        });
    } else chrome.tabs.remove(sender.tab.id); else if (void 0 !== request.BW) if ("add" === request.BW) addURLtoBW(request.url, parseInt(request.action, 10)); else if ("action" === request.BW) sendResponse({
        action: getBWaction(request.url)
    }); else if ("password" === request.BW) if (s.password[0]) sendResponse({
        password: s.password[1]
    }); else sendResponse({
        password: !1
    });
});

chrome.webRequest.onBeforeRequest.addListener(function(details) {
    var PageUrl = new URL(details.url);
    if ("sub_frame" === details.type) {
        var results = checkYoutube(PageUrl);
        if (results.redirectUrl) if ("off" == s.userSettings.ytFilter.embedded) return {
            redirectUrl: "https://www.youtube.com/embed/iOd5r5pfHig"
        }; else return {
            redirectUrl: PageUrl.href
        };
        return results;
    } else if ("xmlhttprequest" === details.type) {
        if ("/get_video_info" === PageUrl.pathname && "embedded" !== PageUrl.searchParams.get("el")) {
            var results = checkYoutube(PageUrl);
            if (results.redirectUrl) {
                PageUrl.searchParams.set("video_id", "iOd5r5pfHig");
                return {
                    redirectUrl: PageUrl.href
                };
            }
            return results;
        }
    } else return pageCheck(details.url);
}, {
    urls: [ "<all_urls>" ],
    types: [ "sub_frame", "main_frame", "xmlhttprequest" ]
}, [ "blocking" ]);

chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
    console.log(getTime() + " " + "onHistoryStateUpdated");
    var blockData = pageCheck(details.url);
    if (void 0 !== blockData && "redirectUrl" in blockData) chrome.tabs.update(details.tabId, {
        url: blockData.redirectUrl
    });
});