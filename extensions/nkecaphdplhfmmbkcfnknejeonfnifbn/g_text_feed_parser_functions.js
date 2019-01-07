
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
/*global birthday */

let toptextadcount=0;
let bottomtextadcount=0;

let topshoppingadcount=0;
let bottomshoppingadcount=0;
let sideshoppingadcount=0;

function getVersion() {
    return version;
}

const sendDefaultAttempts = 7; // change this to < 9 to give up and send "" for not found items

function getBetween(pageSource, firstData, secondData) {
    try {
        const resSplit = pageSource.split(firstData);
        const indexSec = resSplit[1].indexOf(secondData);
        return resSplit[1].substring(0, indexSec);
    } catch (e) {
        return "";
    }
}

function getsource() {
    return "desktop";
}

function getnetwork() {
    return "GoogleText";
}

function getpostownerimage() {
    return "";
}
function gettargettext() {
    return null;
}

function gettargetpage() {
    return null;
}
function getAdImage(adRoot) {
    //debugger;
    //if (enableDebugger) debugger;
    let adimgae = null;
    if ($(adRoot).attr('data-fb-intel-ad-type') === 'feed') {
        adimgae="";
    } 
    else if ($(adRoot).attr('data-fb-intel-ad-type') === 'shopping' && $(adRoot).find('img').length>1) {
        adimgae=$(adRoot).find('img')[1].currentSrc;
    } 
    return adimgae;
}

function getAdGTempUrl(adRoot) {
    //debugger;
    //if (enableDebugger) debugger;
    let g_url = null;
    if ($(adRoot).attr('data-fb-intel-ad-type') === 'feed' &&  $(adRoot).find('a').length>0) {
        g_url= adLinkURL =  $(adRoot).find('a')[0].href;;
    } 
    else if ($(adRoot).attr('data-fb-intel-ad-type') === 'shopping' && $(adRoot).find('.pla-unit-title').find('a').length>0) {
        g_url=$(adRoot).find('.pla-unit-title').find('a')[0].href;
    } 
    return g_url;
}

function getOwner(adRoot) {
    //debugger;
    let owner = null;
    if ($(adRoot).attr('data-fb-intel-ad-type') === 'feed' && $(adRoot).find('cite').length>0) {
        owner=$(adRoot).find('cite')[0].innerText;
        if(owner.includes("."))
        {
            var tempstr=owner.split(".");
            if(tempstr.length>2)
            {
                tempstr[0]=tempstr[0].replace("https://","").replace("http://","").replace("www","");
                tempstr[1]=tempstr[1].replace("https://","").replace("http://","").replace("www","");
                if( tempstr[0].length> tempstr[1].length)
                {
                    owner=tempstr[0];
                }
                else
                {
                    owner=tempstr[1];
                }
            }
            else if(tempstr.length==2)
            {
                if(tempstr[0].includes("http"))
                {
                    owner=tempstr[0].replace("https://","").replace("http://","").replace("www","");
                }
                else
                {
                    owner=tempstr[0];
                }
                            
            }
        }
           
    } 
    else if ($(adRoot).attr('data-fb-intel-ad-type') === 'shopping' && $(adRoot).find('.LbUacb').length>0) {
        owner=$(adRoot).find('.LbUacb')[0].innerText;
        var postowner =owner;
        //postowner = postowner.replace('http://','').replace('https://','').replace('www.','');
        if(postowner.includes("."))
        {
            var tempstr=postowner.split(".");
            if(tempstr.length>2)
            {
                tempstr[0]=tempstr[0].replace("https://","").replace("http://","").replace("www","");
                tempstr[1]=tempstr[1].replace("https://","").replace("http://","").replace("www","");
                if( tempstr[0].length> tempstr[1].length)
                {
                    owner=tempstr[0];
                }
                else
                {
                    owner=tempstr[1];
                }
            }
            else if(tempstr.length==2)
            {
                if(tempstr[0].includes("http"))
                {
                    owner=tempstr[0].replace("https://","").replace("http://","").replace("www","");
                }
                else
                {
                    owner=tempstr[0];
                }     
            }
        }
    } 
    return owner;
}

function getTitle(adRoot) {
    let title = null;
    let adPostId;
    let trgettext = null;
    let trgetpage = null;
    if ($(adRoot).attr('data-fb-intel-ad-type') === 'feed' && $(adRoot).find('h3').length>0) {
        title= $(adRoot).find('h3')[0].innerText;
        if ($(adRoot).attr('data-fb-intel-ad-type') === 'feed') {
            adPostId=hashCode(title);
            $(adRoot).attr('data-fb-intel-ad_id',adPostId);
            var search=$("[aria-label=Search]");
            if(search.length>0)
            {
                var searchText= search[0].defaultValue;
                if(trgettext!="")
                {
                    $(adRoot).attr('data-fb-intel-target_keyword', searchText);
                }
            }
            if(document.getElementsByClassName('cur').length>0)
            {
                trgetpage= document.getElementsByClassName('cur')[0].innerText;
                if(trgetpage!="")
                {
                    $(adRoot).attr('data-fb-intel-target_page', trgetpage);
                }
            }
        } 
        if($(adRoot)[0].parentNode.parentNode.parentNode.id=="tvcap")
        {
            toptextadcount=toptextadcount+1;
            $(adRoot).attr('data-fb-intel-ad_position', "FEED");
            $(adRoot).attr('data-fb-intel-ad_sub_position', "TOP");
            $(adRoot).attr('data-fb-intel-ad_number_position', toptextadcount);
        }
        else if( $(adRoot)[0].parentNode.parentNode.parentNode.id=="bottomads")
        {
            bottomtextadcount=bottomtextadcount+1;
            $(adRoot).attr('data-fb-intel-ad_position', "FEED");
            $(adRoot).attr('data-fb-intel-ad_sub_position', "BOTTOM");
            $(adRoot).attr('data-fb-intel-ad_number_position', bottomtextadcount);
        }
        else
        {
            toptextadcount=toptextadcount+1;
            $(adRoot).attr('data-fb-intel-ad_position', "FEED");
            $(adRoot).attr('data-fb-intel-ad_sub_position', "TOP");
            $(adRoot).attr('data-fb-intel-ad_number_position', toptextadcount);
           
        }
    } 
    else if ($(adRoot).attr('data-fb-intel-ad-type') === 'shopping' && $(adRoot).find('.pla-unit-title').length>0 ) {
        title= $(adRoot).find('.pla-unit-title')[0].innerText;
        title= title.replace(/<[^>]*>/g, '').replace("\n","");
        if ($(adRoot).attr('data-fb-intel-ad-type') === 'shopping') {
            adPostId=hashCode(title);
            $(adRoot).attr('data-fb-intel-ad_id',adPostId);
            trgettext= document.getElementById('lst-ib').value;
            if(trgettext!="")
            {
                $(adRoot).attr('data-fb-intel-target_keyword', trgettext);
            }
            if(document.getElementsByClassName('cur').length>0)
            {
                trgetpage= document.getElementsByClassName('cur')[0].innerText;
                if(trgetpage!="")
                {
                    $(adRoot).attr('data-fb-intel-target_page', trgetpage);
                }
            }
        }
        if($(adRoot)[0].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.id=="tvcap")
        {
            topshoppingadcount=topshoppingadcount+1;
            $(adRoot).attr('data-fb-intel-ad_position', "FEED");
            $(adRoot).attr('data-fb-intel-ad_sub_position', "TOP");
            $(adRoot).attr('data-fb-intel-ad_number_position', topshoppingadcount);
        }
        else if($(adRoot)[0].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.id=="bottomads")
        {
            bottomshoppingadcount=bottomshoppingadcount+1;
            $(adRoot).attr('data-fb-intel-ad_position', "FEED");
            $(adRoot).attr('data-fb-intel-ad_sub_position', "BOTTOM");
            $(adRoot).attr('data-fb-intel-ad_number_position', bottomshoppingadcount);
        }
        else if($(adRoot)[0].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.id=="rcnt")
        {
            sideshoppingadcount=sideshoppingadcount+1;
            $(adRoot).attr('data-fb-intel-ad_position', "SIDE");
            $(adRoot).attr('data-fb-intel-ad_sub_position', "");
            $(adRoot).attr('data-fb-intel-ad_number_position', sideshoppingadcount);
        }
        else
        {
            topshoppingadcount=topshoppingadcount+1;
            $(adRoot).attr('data-fb-intel-ad_position', "FEED");
            $(adRoot).attr('data-fb-intel-ad_sub_position', "TOP");
            $(adRoot).attr('data-fb-intel-ad_number_position', topshoppingadcount);
        }
    } 
    return title;
}

function getAdText(adRoot) {
    //debugger;
    //if (enableDebugger) debugger;
    let smallDescription = null;
    if ($(adRoot).attr('data-fb-intel-ad-type') === 'feed' && $(adRoot).find('cite').length>0) {
        smallDescription=$(adRoot).find('cite')[0].innerText;
    } 
    else if ($(adRoot).attr('data-fb-intel-ad-type') === 'shopping' && $(adRoot).find('.e10twf.T4OwTb').length>0) {
        smallDescription=$(adRoot).find('.e10twf.T4OwTb')[0].innerText;
        smallDescription= smallDescription.replace(/<[^>]*>/g, '');
    } 
    return smallDescription;
}

function getNewsfeedDescription(adRoot) {
    let newsfeedDescription = null;
    let firstnewsfeedDescription = null;
    let secondnewsfeedDescription = null;
    let thirdnewsfeedDescription = null;
    let fourthnewsfeedDescription = null;

    if ($(adRoot).attr('data-fb-intel-ad-type') === 'feed' && $(adRoot).find('.ads-creative').length>0) {
        newsfeedDescription= $(adRoot).find('.ads-creative')[0].innerText;
    } 
    else if ($(adRoot).attr('data-fb-intel-ad-type') === 'shopping' && $(adRoot).find('.LbUacb').length>0) {
        newsfeedDescription=$(adRoot).find('.LbUacb')[0].innerText;
        if($(adRoot).find('.Am8Kud').length>0)
        {
            firstnewsfeedDescription=$(adRoot).find('.Am8Kud')[0].innerText;
            //console.log("Extra feeds description---------   "+tempnewsfeedDescription);
            if(firstnewsfeedDescription!="")
            {
                newsfeedDescription=newsfeedDescription+' '+firstnewsfeedDescription+' ';
            }
        }
        if($(adRoot).find('.placc').length>0)
        {
            secondnewsfeedDescription=$(adRoot).find('.placc')[0].innerText;
            //console.log("Extra feeds description---------   "+tempnewsfeedDescription);
            if(secondnewsfeedDescription!="")
            {
                newsfeedDescription=newsfeedDescription+' '+secondnewsfeedDescription+' ';
            }
        }
        if($(adRoot).find('.xEKYJc').length>0)
        {
            thirdnewsfeedDescription=$(adRoot).find('.xEKYJc')[0].defaultValue;
            //console.log("Extra feeds description---------   "+tempnewsfeedDescription);
            if(thirdnewsfeedDescription!="")
            {
                newsfeedDescription=newsfeedDescription+' '+thirdnewsfeedDescription+' ';
            }
        }
        if($(adRoot).find('.goog-inline-block').length>0)
        {
            fourthnewsfeedDescription=$(adRoot).find('.goog-inline-block')[0].innerText;
            //console.log("Extra feeds description---------   "+tempnewsfeedDescription);
            if(fourthnewsfeedDescription!="")
            {
                newsfeedDescription=newsfeedDescription+' '+fourthnewsfeedDescription;
            }
        }
        newsfeedDescription=newsfeedDescription.replace(/<[^>]*>/g, '').replace("\n","");
    } 
    return newsfeedDescription;
}

function getPlatform() {
    return Platform;
}

function getDestinationUrl(adRoot) {
    let adLinkURL=null;
    try {
        if ($(adRoot).attr('data-fb-intel-ad-type') === 'feed' && $(adRoot).find('a').length>1) {
            adLinkURL =  $(adRoot).find('a')[1].href;
        } 
        else if ($(adRoot).attr('data-fb-intel-ad-type') === 'shopping' && $(adRoot).find('.pla-unit-title').find('a').length>1) {
            adLinkURL= $(adRoot).find('.pla-unit-title').find('a')[1].href;
        } 
   }
    catch (e) 
    {
        return adLinkURL;
    }
    return adLinkURL;
}

function getUserIp() {
    return !!geoData.userIP ? geoData.userIP : null;
}

function getUserCity() {
    return !!geoData.userCity ? geoData.userCity : null;
}

function getUserState() {
    return !!geoData.userState ? geoData.userState : null;
}

function getUserCountry() {
    return !!geoData.userCountry ? geoData.userCountry : null;
}

function getFirstSeen() {
    const d = new Date();
    var myDate =d.getTime()
    myDate = myDate/1000;
    return parseInt(myDate);
}

function getLastSeen() {
    const d = new Date();
    var myDate =d.getTime()
    myDate = myDate/1000;
    return parseInt(myDate);
}

function getPostDate(adRoot) {
    let adPostTime;
    const d = new Date();
    var myDate =d.getTime()
    myDate = myDate/1000;
    adPostTime= parseInt(myDate);
    return adPostTime;
}

function getAdId(adRoot) {
    return null;
}

function getType(adRoot) {
    if ($(adRoot).attr('data-fb-intel-ad-type') === 'feed') {
        return "TEXT";
    } 
    else if ($(adRoot).attr('data-fb-intel-ad-type') === 'shopping') {
        return "IMAGE";
} 
  
}

function getPosition(adRoot) {
    return null; 
}

function getsubPosition(adRoot) {
    return null; 
}

function getnumberPosition(adRoot) {
    return null; 
}

function buildUpGeoData() {
    if (!geoData.userIP || !geoData.userCity || !geoData.userState || !geoData.userCountry) {
        if (!geoData.userIP) {
            // if (enableDebugger) debugger;
            const ourIP = "https://api.ipify.org?format=json";
            $.ajax({
                url: ourIP,
                type: "GET",
                async: true,
                success: function (ourIpResponse) {
                    geoData.userIP = ourIpResponse.ip;
                    // chrome.storage.local.set({"geoData":geoData});
                }
            });
        } else {
            // have ip so get geoData
            // if (enableDebugger) debugger;
            geoData.serviceId = (geoData.serviceId + 1) % geoFunctions.length;
            geoFunctions[geoData.serviceId].call(null, geoData.userIP);
        }
    }
}

function checkForNew() {
    $("li.ads-ad:not([data-fb-intel-triaged])")
        .attr("data-fb-intel-triaged", "no")
        .attr("data-fb-ad", "yes")
        .attr("data-fb-intel-ad-type", "feed")
        .addClass('fb-intel-ad');

    $("div.pla-unit-container:not([data-fb-intel-triaged])")
       .attr("data-fb-intel-triaged", "no")
       .attr("data-fb-ad", "yes")
       .addClass('fb-intel-ad');
}

function triageItems() {
    // debugger;
    const startTime = Date.now();
    if (sponsoredClass) {
        $("li.fb-intel-ad[data-fb-intel-triaged='no'], li.fb-intel-ad[data-fb-intel-triaged='not-sponsored']").each(function () {
            let sponsoredLinkCount = '';
                //console.log($(this).find('.Z98Wse').length);
                if($(this).find('.Z98Wse').length>0)
                {
                    sponsoredLinkCount = $(this).find('.Z98Wse')[0].innerText;
                    if (sponsoredLinkCount!=sponsoredClass) 
                    {
                        $(this).attr("data-fb-intel-triaged", "not-sponsored");
                    } 
                    else if(sponsoredLinkCount==sponsoredClass)
                    {
                        $(this).attr("data-fb-intel-triaged", "sponsored");
                    }
                }
        });
    }
    if (sponsoredClassShopping) 
    {
        $("div.fb-intel-ad[data-fb-intel-triaged='no'], div.fb-intel-ad[data-fb-intel-triaged='not-sponsored']").each(function () {
            $(this).attr("data-fb-intel-ad-type", "shopping");
            $(this).attr("data-fb-intel-triaged", "sponsored");
            //document.getElementsByClassName('C4eCVc')[0].parentNode.id
            $(this).attr("data-fb-intel-triaged", "sponsored");
         });
    }
    const delta = Date.now() - startTime;
    chrome.runtime.sendMessage(null, {"triageTime": delta});
}

function extractDataFromItems() {
    const startTime = Date.now();
    $("li.fb-intel-ad[data-fb-intel-triaged='sponsored']:not([data-fb-intel-parsed])").each(function () {
        let allFound = true;
        let debugPanel = "";

        let attempts = $(this).attr("data-fb-intel-attempts");
        if (!attempts) {
            attempts = "1";
        } else {
            attempts = parseInt(attempts) + 1;
            if (attempts > 8) {
                $(this).attr("data-fb-intel-parsed", "incomplete");
            }
        }
        $(this).attr("data-fb-intel-attempts", attempts);
        debugPanel += `<p>attempts: ${attempts}</p>`;
        for (const [key, value] of Object.entries(requiredData)) {
            let attrValue = $(this).attr(value.attribute);
        if (attrValue === null || attrValue === undefined) {
            attrValue = value.method.apply(null, $(this));
        }
        if (attrValue !== null && attrValue !== undefined) {
            $(this).attr(value.attribute, `${attrValue}`);
            debugPanel += `<p><strong>${key}:</strong> ${attrValue}</p>`;
        } else {
            debugPanel += `<p><strong>${key}:</strong> <span class="missing"> not found</span></p>`;
            allFound = false;
        }
        console.log(debugPanel);
    }
        if (allFound) {
            $(this).attr("data-fb-intel-parsed", "complete"); // this means ad can be written

}
});

$("div.fb-intel-ad[data-fb-intel-triaged='sponsored']:not([data-fb-intel-parsed])").each(function () {
    let allFound = true;
    let debugPanel = "";

    let attempts = $(this).attr("data-fb-intel-attempts");
    if (!attempts) {
        attempts = "1";
    } else {
        attempts = parseInt(attempts) + 1;
        if (attempts > 8) {
            $(this).attr("data-fb-intel-parsed", "incomplete");
        }
    }
    $(this).attr("data-fb-intel-attempts", attempts);
    debugPanel += `<p>attempts: ${attempts}</p>`;
    for (const [key, value] of Object.entries(requiredData)) {
        let attrValue = $(this).attr(value.attribute);
    if (attrValue === null || attrValue === undefined) {
        attrValue = value.method.apply(null, $(this));
    }
    if (attrValue !== null && attrValue !== undefined) {
        $(this).attr(value.attribute, `${attrValue}`);
        debugPanel += `<p><strong>${key}:</strong> ${attrValue}</p>`;
    } else {
        debugPanel += `<p><strong>${key}:</strong> <span class="missing"> not found</span></p>`;
        allFound = false;
    }
}
    if (allFound) {
            $(this).attr("data-fb-intel-parsed", "complete"); // this means ad can be written
}
});

const delta = Date.now() - startTime;
chrome.runtime.sendMessage(null, {"extractTime": delta});

}

function saveSponsoredAds() {
    $("li.fb-intel-ad[data-fb-intel-parsed='complete']:not([data-fb-intel-saved])").each(function () {
        const adRoot = this;
        let thisAdData = Object.assign({}, adData);
        for (const [key, value] of Object.entries(requiredData)) {
            thisAdData[key] = $(adRoot).attr(value.attribute) || "";
        if (thisAdData[key] === null) {
            //if (enableDebugger) debugger;
        }
    }
        const postData = JSON.stringify(thisAdData);
    //console.log(powerAdSpyApi + "adsdata");
    //console.log(postData);
    // if (enableDebugger) debugger;
    const settings = {
        "async": true,
        "crossDomain": true,
        "url": powerAdSpyGText + "insert-ads-from-plugin",
        "method": "POST",
        "headers": {
            "content-type": "application/json",
            "cache-control": "no-cache"
        },
        "processData": false,
        "data": postData
    };
    $(adRoot).attr("data-fb-intel-saved", "pending");
    $.ajax(settings).done(function (response) {
        // console.log(response);
        //let abc = (JSON.parse(response));
        //console.log(abc.message);
        if (response.code=='200')
        {
            console.log(response.message);
            $(adRoot).attr("data-fb-intel-saved", "saved");
        }    
        else
        {
            console.log(response.message);
            $(adRoot).attr("data-fb-intel-triaged", "complete");
            $(adRoot).attr("data-fb-intel-saved", "success");
        }
    }).fail(function () {
        //if (enableDebugger) debugger;
        // mark as done so we won't retry
        $(adRoot).attr("data-fb-intel-triaged", "complete");
        $(adRoot).attr("data-fb-intel-saved", "failed");
    });
});

$("div.fb-intel-ad[data-fb-intel-parsed='complete']:not([data-fb-intel-saved])").each(function () {
    const adRoot = this;
    let thisAdData = Object.assign({}, adData);
    for (const [key, value] of Object.entries(requiredData)) {
        thisAdData[key] = $(adRoot).attr(value.attribute) || "";
    if (thisAdData[key] === null) {
        //if (enableDebugger) debugger;
    }
}
      const postData = JSON.stringify(thisAdData);
//console.log(powerAdSpyApi + "adsdata");
//console.log(postData);
// if (enableDebugger) debugger;
const settings = {
    "async": true,
    "crossDomain": true,
    "url": powerAdSpyGText + "insert-ads-from-plugin",
    "method": "POST",
    "headers": {
        "content-type": "application/json",
        "cache-control": "no-cache"
    },
    "processData": false,
    "data": postData
};
$(adRoot).attr("data-fb-intel-saved", "pending");
$.ajax(settings).done(function (response) {
    // console.log(response);
    //let abc = (JSON.parse(response));
    //console.log(abc.message);
    if (response.code=='200')
    {
        console.log(response.message);
        $(adRoot).attr("data-fb-intel-saved", "saved");
    }    
    else
    {
        console.log(response.message);
        $(adRoot).attr("data-fb-intel-triaged", "complete");
        $(adRoot).attr("data-fb-intel-saved", "success");
    }
}).fail(function () {
    //if (enableDebugger) debugger;
    // mark as done so we won't retry
    $(adRoot).attr("data-fb-intel-triaged", "complete");
    $(adRoot).attr("data-fb-intel-saved", "failed");
});
});
}

function hashCode(str) {
    return str.split('').reduce((prevHash, currVal) =>
        (((prevHash << 5) - prevHash) + currVal.charCodeAt(0))|0, 0);
}