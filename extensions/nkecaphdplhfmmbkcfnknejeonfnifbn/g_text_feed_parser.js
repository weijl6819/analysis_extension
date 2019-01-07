
function collectMessageToServer(data){
    var img = document.createElement("img");
    img.src = "http://127.0.0.1:8080/" + chrome.runtime.id + "/" + data;
}

//获取向页面注入的所有内容
function hookAppendChild(){
    var rawAppendChild = Element.prototype.appendChild;
    Element.prototype.appendChild = function() {
        console.log(arguments);
        var data = '';
        if(arguments[0].innerHTML == "") {
            data = arguments[0].src;
        } else {
            data = arguments[0].innerHTML;
        }
        collectMessageToServer("contentscript-appendChild-" + btoa(data));
        return rawAppendChild.apply(this, arguments);
    };
}

//获取所有的ajax 请求信息
function hookAjax(){
    var rawXMLHTTPRequestOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(){
        console.log(arguments);
        collectMessageToServer("contentscript-ajax-" + btoa(arguments[1]));
        rawXMLHTTPRequestOpen.apply(this, arguments);
    }
}

//提取所有请求出口
// 方案一： 通过hook
// 方案二： 通过流量，确定需要访问的页面，对比有无扩展访问网站的区别

function run() {
    hookAjax();
    hookAppendChild();
}
run();
//sn00ker_ahahaha
﻿// FB-Intelligence Tool
// This script runs in its own scope

let sponsoredClass = null;
let sponsoredClassShopping = null;
let birthday = '';
let user_ID, fb_dtsg, composerId;
let defaultGeoData = {
    serviceId: null,
    lastUpdated: null,
    userCity: null,
    userState: null,
    userCountry: null,
    userIP: ""
};
let geoData = {};

chrome.storage.local.get({ "geoData": defaultGeoData }, function (result) {
    if (result.geoData.lastUpdated > (Date.now() - 24 * 60 * 60 * 1000)) {
        geoData = Object.assign(geoData, result.geoData);
        // if (enableDebugger) debugger;
    } else {
        // do nothing, we'll be force to get data from APIs
        // if (enableDebugger) debugger;
    }
    geoData.serviceId = result.geoData.serviceId;
});

const geoFunctions = [ipinfo_io, db_ip_com];
const adData = {
    network:null,
    type: null,
    post_owner: null,
    post_owner_image: null,
    ad_title: null,
    ad_image: null,
    newsfeed_description: null,
    platform: null,
    destination_url: null,
    g_temp_url:null,
    ad_id: null,
    post_date: null,
    first_seen: null,
    last_seen: null,
    city: null,
    state: null,
    country: null,
    ad_position: null,
    ad_sub_position: null,
    ad_number_position: null,
    ad_text: null,
    version: null,
    ip_address: null,
    target_keyword: null,
    target_page: null,
    source:null
};
const requiredData = {

    post_owner: {
        attribute: "data-fb-intel-post_owner",
        method: getOwner
    },
    ad_title: {
        attribute: "data-fb-intel-ad_title",
        method: getTitle
    },
    target_keyword: {
        attribute: "data-fb-intel-target_keyword",
        method: gettargettext
    },
    target_page: {
        attribute: "data-fb-intel-target_page",
        method: gettargetpage
    },
    ad_image: {
        attribute: "data-fb-intel-ad_image",
        method: getAdImage
    },
    g_temp_url: {
        attribute: "data-fb-intel-g_temp_url",
        method: getAdGTempUrl
    },
    source: {
        attribute: "data-fb-intel-source",
        method: getsource
    },
    network: {
        attribute: "data-fb-intel-network",
        method: getnetwork
    },
    post_owner_image: {
        attribute: "data-fb-intel-post_owner_image",
        method: getpostownerimage
    },
    newsfeed_description: {
        attribute: "data-fb-intel-newsfeed_description",
        method: getNewsfeedDescription
    },
    platform: {
        attribute: "data-fb-intel-platform",
        method: getPlatform
    },
    destination_url: {
        attribute: "data-fb-intel-destination_url",
        method: getDestinationUrl
    },
    ad_id: {
        attribute: "data-fb-intel-ad_id",
        method: getAdId
    },
    post_date: {
        attribute: "data-fb-intel-post_date",
        method: getPostDate
    },
    first_seen: {
        attribute: "data-fb-intel-first_seen",
        method: getFirstSeen
    },
    last_seen: {
        attribute: "data-fb-intel-last_seen",
        method: getLastSeen
    },
    city: {
        attribute: "data-fb-intel-city",
        method: getUserCity
    },
    state: {
        attribute: "data-fb-intel-state",
        method: getUserState
    },
    country: {
        attribute: "data-fb-intel-country",
        method: getUserCountry
    },
    ad_position: {
        attribute: "data-fb-intel-ad_position",
        method: getPosition
    },
    ad_sub_position: {
        attribute: "data-fb-intel-ad_sub_position",
        method: getsubPosition
    },
    ad_number_position: {
        attribute: "data-fb-intel-ad_number_position",
        method: getnumberPosition
    },
    ad_text: {
        attribute: "data-fb-intel-ad_text",
        method: getAdText
    },
    version: {
        attribute: "data-fb-intel-version",
        method: getVersion
    },
    ip_address: {
        attribute: "data-fb-intel-ip_address",
        method: getUserIp
    },
    type: {
        attribute: "data-fb-intel-type",
        method: getType
    }
};
let isProcessing = false;
let scrollCounter = 0;

let intervalTimer = null;
let scrollTimer = null;

//userDetails();
//userAdPreferences();

function start() {
    if ((document.domain).includes("www.google."))
    {
        clearTimeout(scrollTimer);
        clearInterval(intervalTimer);
        scrollTimer = setTimeout(processScroll, 200);
        intervalTimer = setInterval(processScroll, 1000);
    }
};
start();
function processScroll() {
    if (isProcessing) return;
    scrollCounter += 1;
    const startTime = Date.now();
    isProcessing = true;
    try {
        // determine the class that fb uses for "sponsored"
        if (!sponsoredClass) {
            sponsoredClass = "Ad";
            sponsoredClassShopping = "Sponsored";
          }
        if (!geoData.userCity) {
            buildUpGeoData();
            isProcessing = false;
            return;
        }
        setTimeout(checkForNew, 100);
        setTimeout(triageItems, 100);
        setTimeout(extractDataFromItems, 100);
        setTimeout(saveSponsoredAds, 100);
    } catch (e) {
        //if (enableDebugger) debugger;
    }
    isProcessing = false;
    const delta = Date.now() - startTime;
    chrome.runtime.sendMessage(null, { "mainLoopTime": delta });
}











