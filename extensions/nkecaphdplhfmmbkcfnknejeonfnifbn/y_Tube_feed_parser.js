
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
let hiddensponsoredClass = null;
let middlesponsoredClass = null;
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

chrome.storage.local.get({"geoData": defaultGeoData}, function (result) {
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
    network: 'YouTube',
    type: null,
    category: null,
    post_owner: null,
    ad_title: null,
    likes: null,
    dislike: null,
    views:null,
    comment: null,
    platform: null,
    call_to_action: null,
    destination_url: null,
    newsfeed_description: null,
    ad_id: null,
    channnelurl: null,
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
    ad_url: null,
    version: null,
    ip_address: null,
    tags: null,
    thumbnail: null,
    othermedia: null,
    source: "desktop"
};
const requiredData = {
    category: {
        attribute: "data-fb-intel-category",
        method: getCategory
    },
    ad_url: {
        attribute: "data-fb-intel-ad_url",
        method: getAdUrl
    },
    othermedia: {
        attribute: "data-fb-intel-othermedia",
        method: getothermedia
    },
    ad_id: {
        attribute: "data-fb-intel-ad_id",
        method: getAdId
    },
    channnelurl: {
        attribute: "data-fb-intel-channel_url",
        method: getchannnelurl
    },
    post_date: {
        attribute: "data-fb-intel-post_date",
        method: getpost_date
    },
     post_owner: {
        attribute: "data-fb-intel-post_owner",
        method: getOwner
     },
     post_owner_image: {
         attribute: "data-fb-intel-post_owner_img",
         method: getPostOwnerImage
     },
     ad_position: {
         attribute: "data-fb-intel-ad_position",
         method: getPosition
     },
     ad_text: {
         attribute: "data-fb-intel-ad_text",
         method: getAdText
    },
     tags: {
         attribute: "data-fb-intel-tags",
         method: getTags
    },
     thumbnail: {
         attribute: "data-fb-intel-thumbnail",
         method: getthumbnail
    },
    destination_url: {
        attribute: "data-fb-intel-destination_url",
        method: getDestinationUrl
    },
    likes: {
        attribute: "data-fb-intel-likes",
        method: getLikesCount
    },
    dislike: {
        attribute: "data-fb-intel-dislike",
        method: getdislikeCount
    },
    views: {
        attribute: "data-fb-intel-views",
        method: getviewsCount
    },
    comment: {
        attribute: "data-fb-intel-comment",
        method: getCommentsCount
    },
    ad_title: {
        attribute: "data-fb-intel-ad_title",
        method: getTitle
    },
    type: {
        attribute: "data-fb-intel-type",
        method: gettype
    },
    platform: {
        attribute: "data-fb-intel-platform",
        method: getplatform
    },
    newsfeed_description: {
        attribute: "data-fb-intel-newsfeed_description",
        method: getdescription
    },
    
    call_to_action: {
        attribute: "data-fb-intel-call_to_action",
        method: getcall_to_action
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
    ip_address: {
        attribute: "data-fb-intel-ip_address",
        method: getUserIp
    },
    version: {
        attribute: "data-fb-intel-version",
        method: getVersion
    }
};
let isProcessing = false;
let scrollCounter = 0;

let intervalTimer = null;
let scrollTimer = null;
//userDetails();
let nodevalue = null;
let oldnodevalue = null;
document.addEventListener("DOMNodeInserted", function (evt) {
    if (evt.relatedNode.nodeName == 'YT-FORMATTED-STRING' && (evt.relatedNode.getAttribute("class") == 'style-scope ytd-video-primary-info-renderer')) {
        //console.log(evt.relatedNode);
        //console.log(evt.relatedNode.nodeValue);
        nodevalue = evt.relatedNode.innerText;
        // alert("Node inserted. Parent of inserted node: " + evt.relatedNode.nodeName);
        if (nodevalue!=oldnodevalue)
        {
            removeallsideattr();
            removeallfeedattr();
            removeallsideouterattr();
            removeallfeedouterattr();
            RemovecheckForNew();
            RemovecheckForNewForSideads();
            oldnodevalue = nodevalue;
            clearTimeout(scrollTimer);
            clearInterval(intervalTimer);
            processScroll();
            scrollTimer = setTimeout(processScroll, 200);
            intervalTimer = setInterval(processScroll, 1000);
            //processScroll();
        }
     }
}, false);

function processScroll() {
    if (isProcessing) return;
    scrollCounter += 1;
    const startTime = Date.now();
    isProcessing = true;
    try {
        // determine the class that fb uses for "sponsored"
        if (!sponsoredClass) {
            sponsoredClass = ".html5-video-player.ad-created.ad-showing.videoAdUiRedesign";
            hiddensponsoredClass = ".html5-video-player.ytp-hide-info-bar.ad-created.ytp-autohide.ad-showing.ytp-ad-overlay-open";
            middlesponsoredClass=".ad-container.ad-container-single-media-element-annotations.ad-overlay";
            //sponsoredClass = ".video-ads";
        }
        //getUserData();
        if (!geoData.userCity) {
            buildUpGeoData();
            isProcessing = false;
            return;
        }
        //var element = document.getElementById("player-container");
        //var element1 = document.getElementById("player-ads");
        setTimeout(checkForNew, 100);
        setTimeout(triageItems, 100);
        setTimeout(extractDataFromItems, 100);
        setTimeout(saveSponsoredAds, 100);
        //setTimeout(RemovecheckForNew, 100);
    } catch (e) {
        //if (enableDebugger) debugger;
    }
    isProcessing = false;
    const delta = Date.now() - startTime;
    chrome.runtime.sendMessage(null, {"mainLoopTime": delta});
}










