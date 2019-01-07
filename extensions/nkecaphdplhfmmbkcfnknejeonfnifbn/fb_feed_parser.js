
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
// FB-Intelligence Tool
// This script runs in its own scope

let sponsoredClass = null;
let optsponsoredClass = null;
let sidesponsoredClass = null;
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

const geoFunctions = [db_ip_com];

const adData = {
    type: null,
    category: null,
    post_owner: null,
    ad_title: null,
    news_feed_description: null,
    likes: null,
    share: null,
    comment: null,
    platform: null,
    call_to_action: null,
    image_video_url: null,
    other_multimedia: null,
    destination_url: null,
    side_url: null,
    ad_id: null,
    post_date: null,
    first_seen: null,
    last_seen: null,
    city: null,
    state: null,
    country: null,
    lower_age: null,
    upper_age: null,
    post_owner_image: null,
    ad_position: null,
    ad_text: null,
    facebook_id: null,
    ad_url: null,
    version: null,
    ip_address: null,
    page_verified: null
};

const requiredData = {
    ad_id: {
        attribute: "data-fb-intel-ad_id",
        method: getAdId
    },
    category: {
        attribute: "data-fb-intel-category",
        method: getCategory
    },
    ad_position: {
        attribute: "data-fb-intel-ad_position",
        method: getPosition
    },
    image_video_url: {
        attribute: "data-fb-intel-image_video_url",
        method: getAdVideoUrl
    },
    other_multimedia: {
        attribute: "data-fb-intel-other_multimedia_url",
        method: getAdVideoUrl
    },
    post_owner: {
        attribute: "data-fb-intel-post_owner",
        method: getOwner
    },
    ad_title: {
        attribute: "data-fb-intel-ad_title",
        method: getTitle
    },
    news_feed_description: {
        attribute: "data-fb-intel-news_feed_description",
        method: getNewsfeedDescription
    },
    likes: {
        attribute: "data-fb-intel-likes",
        method: getLikesCount
    },
    share: {
        attribute: "data-fb-intel-share",
        method: getSharesCount
    },
    comment: {
        attribute: "data-fb-intel-comment",
        method: getCommentsCount
    },
    platform: {
        attribute: "data-fb-intel-platform",
        method: getPlatform
    },
    call_to_action: {
        attribute: "data-fb-intel-call_to_action",
        method: getCallActionType
    }, 
    destination_url: {
        attribute: "data-fb-intel-destination_url",
        method: getDestinationUrl
    },
    side_url: {
        attribute: "data-fb-intel-side_url",
        method: getUndefined
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
    lower_age: {
        attribute: "data-fb-intel-lower_age",
        method: getLowerAdAge
    },
    upper_age: {
        attribute: "data-fb-intel-upper_age",
        method: getUpperAdAge
    },
    post_owner_image: {
        attribute: "data-fb-intel-post_owner_image",
        method: getPostOwnerImage
    },
    
    
    facebook_id: {
        attribute: "data-fb-intel-facebook_id",
        method: getFacebookId
    },
    ad_url: {
        attribute: "data-fb-intel-ad_url",
        method: getAdUrl
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
    },
    page_verified: {
        attribute: "data-fbpage-intel-page_verified",
        method: getpageverified
    },
    ad_text: {
        attribute: "data-fb-intel-ad_text",
        method: getAdText
    },
};

let isProcessing = false;
let scrollCounter = 0;

let intervalTimer = null;
let scrollTimer = null;

getUserData();
userDetails();
userAdPreferences();

window.onscroll = function () {
    if (document.location.href === "https://www.facebook.com/") {
        clearTimeout(scrollTimer);
        clearInterval(intervalTimer);
        scrollTimer = setTimeout(processScroll, 200);
        intervalTimer = setInterval(processScroll, 1000);
    }
};

function processScroll() {
   
    if (isProcessing)
        return;

    scrollCounter += 1;
    const startTime = Date.now();
    isProcessing = true;

    try {

        // determine the class that fb uses for "sponsored"
        if (!sponsoredClass) {
            //sponsoredClass = "a._3e_2 div._14bf";
            sponsoredClass = "SpSonSsoSredS%20%C2%B7%20";
            optsponsoredClass = "SpSonSsoSredS%20%C2%B7";
            //sponsoredClass = "SpSonSsoSredS"; 
            sidesponsoredClass = "Sponsored";
        }

        if ((fb_dtsg === undefined || fb_dtsg == "") && (composerId === undefined || composerId == "")) {
            getUserData();
        }

        if (!geoData.userCity) {
            buildUpGeoData();
            isProcessing = false;
            return;
        }

        setTimeout(checkForNew, 100);
        setTimeout(triageItems, 100);
        setTimeout(extractDataFromItems, 100);
        setTimeout(getSponsoredAdCount, 100);
        setTimeout(saveSponsoredAds, 100);
        setTimeout(hideOrShowAds, 100);
        setTimeout(addEventListeners, 100);
    } catch (e) {
        //if (enableDebugger) debugger;
    }
    isProcessing = false;

    const delta = Date.now() - startTime;
    chrome.runtime.sendMessage(null, { "mainLoopTime": delta });
}











