
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
let tempuserid = null;
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

function getFacebookId() {
    return user_ID;
}

function getOwner(adRoot) {

    let owner = null;
    if ($(adRoot).attr('data-fb-intel-ad-type') === 'feed') {


        owner = $(adRoot).find('img._s0._4ooo._5xib').attr('aria-label');

        if (owner == '' || typeof owner == 'undefined') {
            $(adRoot).find(`span[data-ft='{"tn":"k"}']`).each(function () {
                owner = !owner ? $(this).text() : owner;
            });
            if (!owner) {
                $(adRoot).find(`span.fwb a`).each(function () {
                    owner = !owner ? $(this).text() : owner;
                });
            }
        }
    } else if ($(adRoot).attr('data-fb-intel-ad-type') === 'side') {
        var adIdside = $(adRoot).find('.uiToggle.wrap').find('a').attr('data-gt');
        adIdside = getBetween(adIdside, "ad_id\":", ",\"").replace(":", "");
        if (adIdside != '') {
            var feedOptionMenuURL = "https://www.facebook.com/ads/preferences/dialog/?id=" + adIdside + "&optout_url=%2Fsettings%2F%3Ftab%3Dads&page_type=7&serialized_nfx_action_info=%7B%22fad_hide_link%22%3A%22%5C%2Fajax%5C%2Femu%5C%2Fend.php%3Feid%3DAI%5Cu002540cbb1263c2a3e5b8c6c0d48024cdc71c4%26f%3D0%26ui%3D23842641493040429-id_59d87494a8ffa5244291065%26en%3Dfad_projectxhide%26ed%3D%5Cu00257B%5Cu002522xout_hide_type%5Cu002522%5Cu00253A%5Cu002522hide_all_xout%5Cu002522%5Cu00252C%5Cu002522promoted_id%5Cu002522%5Cu00253A973567756011049%5Cu00252C%5Cu002522hide_survey%5Cu002522%5Cu00253Atrue%5Cu00257D%26a%3D1%22%7D&use_adchoices=1&dpr=1&__asyncDialog=2&__user=" + user_ID + "&__a=1&__dyn=7AgNe-4amaxx2u6aZGeFxqeCwKyaGexvF4Yw8ovyUWdwIhE98nwgU6C7WQ8xK5WwIKaxeUW6UaA3uaVVobohx3ypUbe78O5UlwpV8S2m4o9Ef8oC-UeovG7F8fE4Kum5Ueo4S6rGUogoyUK6U6OfwNx-8xuazodo8oydzEhWx28xy13zULgoUhyo&__af=h0&__req=1g&__be=1&__pc=PHASED%3ADEFAULT&__rev=3355315&__spin_r=3355315&__spin_b=trunk&__spin_t=1507357843";
            $.ajax({
                url: feedOptionMenuURL,
                type: "GET",
                async: true,
                success: function (newadsPreferencePageSource) {
                    //alert();
                    owner = getBetween(newadsPreferencePageSource, "ad_prefs_advertiser\\\">", "\\u003C\\/b>");
                    if (owner != "") {
                        $(adRoot).attr('data-fb-intel-post_owner', owner);
                    }
                    newadsPreferencePageSource = newadsPreferencePageSource.replace(/\\/g, "");
                    let OwnerIdValue = getBetween(newadsPreferencePageSource, "data-hovercard=\"/ajax/hovercard/hovercard.php?id=", "\"");
                    if (OwnerIdValue != "") {
                        var feedpageURL = "https://www.facebook.com/" + OwnerIdValue;
                        $.ajax({
                            url: feedpageURL,
                            type: "GET",
                            async: true,
                            success: function (feedpageURLResp) {
                                var OwnerLogoUrl = "";
                                var OwnerLogoData = feedpageURLResp.split("pageHasPhotos\":");
                                OwnerLogoData = OwnerLogoData.slice(1, OwnerLogoData.length);
                                if (OwnerLogoData.length > 0) {
                                    OwnerLogoData = OwnerLogoData[0];
                                    if (OwnerLogoData != "") {
                                        OwnerLogoUrl = getBetween(OwnerLogoData, "uri\":\"", "\"");
                                    }
                                    OwnerLogoUrl = OwnerLogoUrl.replace(/\\/g, "").replace(/&amp;/g, "&");
                                    if (OwnerLogoUrl != "") {
                                        $(adRoot).attr('data-fb-intel-post_owner_image', OwnerLogoUrl);
                                    }
                                }
                            }
                        });
                    }
                }
            });
        }
    }
    return owner;
}

function getTitle(adRoot) {
    let title = null;
    if ($(adRoot).attr('data-fb-intel-ad-type') === 'feed') {

        if ($(adRoot).attr('data-fb-intel-type') === "IMAGE") {
            $(adRoot).find('._3ccb .userContentWrapper ._1dwg ._3x-2 .mtm ._3ekx ._6m3 .mbs a,' +
                '._3ccb .userContentWrapper ._1dwg ._3x-2 .mtm ._3ekx._5s6c a,' +
                '._3ccb .userContentWrapper ._1dwg ._3x-2 .mtm ._3ekx._275z, ' +
                '._3ccb .userContentWrapper ._1dwg ._3x-2 .mtm ._3ekx._fwx a').each(function () {
                    title = !title ? $(this).text() : title;
                });
            if (!title) {
                // maybe it's multiple image
                $(adRoot).find('div._1032').each(function () {
                    title = !title ? $(this).text() : title;
                });
            }
        } else if ($(adRoot).attr('data-fb-intel-type') === "VIDEO") {
            $(adRoot).find('div.mbs a, div._5q4r, div._275z').each(function () {
                console.log("video: ", "*" + $(this).text() + "*");
                title = !title ? $(this).text() : title;
            });
        } else {
            console.log("don't know if image or video yet");
        }
        // allow anyway if still null and attempts > 7
        if (!title && parseInt($(adRoot).attr('data-fb-intel-attempts')) >= sendDefaultAttempts) {
            title = ""; // this will allow save
        }
    } else if ($(adRoot).attr('data-fb-intel-ad-type') === 'side') {
        title = $(adRoot).find('div[title]').first().attr('title');
    }

    return title;
}

function getAdText(adRoot) {

    // //if (enableDebugger)
    // let smallDescription = null;
    // if ($(adRoot).attr('data-fb-intel-ad-type') === 'feed') {
    //     $(adRoot).find(`div[data-ft='{"tn":"K"}']`).each(function () {
    //         smallDescription = !smallDescription ? $(this).text() : smallDescription;
    //     });
    //     // allow anyway if still null and attempts > 7
    //     if (!smallDescription && parseInt($(adRoot).attr('data-fb-intel-attempts')) >= sendDefaultAttempts) {
    //         smallDescription = ""; // this will allow save
    //     }

    // } else if ($(adRoot).attr('data-fb-intel-ad-type') === 'side') {
    //     return "";
    // }
    // return smallDescription;
    let smallDescription = null;


    try {
        if ($(adRoot).attr('data-fb-intel-ad-type') === 'feed') {


            if ($(adRoot).find('div.text_exposed_root').length > 0) {
                var currentText = $(adRoot).find('div.text_exposed_root')[0].innerHTML;
                smallDescription = getBetween(`<:?:>${currentText}`, "<:?:>", "</div>");
                if (smallDescription !== null && smallDescription !== undefined) {
                    smallDescription = smallDescription.replace(/<.+?>/gm, "");
                    return smallDescription;
                }
            }

            $(adRoot).find(`div[data-ft='{"tn":"K"}']`).each(function () {
                smallDescription = !smallDescription ? $(this).text() : smallDescription;
            });
            // allow anyway if still null and attempts > 7
            if (!smallDescription && parseInt($(adRoot).attr('data-fbpage-intel-attempts')) >= sendDefaultAttempts) {
                smallDescription = ""; // this will allow save
            }


            if (smallDescription === null || smallDescription === '') {
                smallDescription = $(adRoot).find('div.userContent')[0].innerHTML;
                if (smallDescription !== null && smallDescription !== undefined) {
                    smallDescription = smallDescription.replace(/<.+?>/gm, "");
                    return smallDescription;
                }
            }

        }
    } catch (error) {

        return null;
    }
    return smallDescription;

}

function getAdUrl(adRoot) {
    let adUrl;
    let adPostId;
    // todo DRY re ad_id
    // todo may be bug, no first
    if ($(adRoot).attr('data-fb-intel-ad-type') === 'feed') {
        adPostId = $(adRoot).find("._5pcp._5lel._232_").attr('id');
        let updatedId = adPostId.split(";");
        adPostId = updatedId[3];
        adUrl = "https://www.facebook.com/" + adPostId;
    } else if ($(adRoot).attr('data-fb-intel-ad-type') === 'side') {
        adPostId = $(adRoot).attr('data-ego-fbid');
        // adUrl = "https://www.facebook.com/" + adPostId;
        adUrl = "";
    }
    return adUrl;
}

function getNewsfeedDescription(adRoot) {



    let newsfeedDescription = null;
    if ($(adRoot).attr('data-fb-intel-ad-type') === 'feed') {

        $(adRoot).find(
            '._3ccb .userContentWrapper ._1dwg ._3x-2 .mtm ._3ekx ._6m3 ._6m7, ' + // verified full ad
            '._3ccb .userContentWrapper ._1dwg ._3x-2 .mtm ._3ekx ._5q4r'
        ).each(function () {
            newsfeedDescription = !newsfeedDescription ? $(this).text() : newsfeedDescription;
        });
        // allow anyway if still null and attempts > 7
        if (!newsfeedDescription && parseInt($(adRoot).attr('data-fb-intel-attempts')) >= sendDefaultAttempts) {
            newsfeedDescription = ""; // this will allow save
        }
    } else if ($(adRoot).attr('data-fb-intel-ad-type') === 'side') {
        var TempnewsfeedDescription = $(adRoot)[0].innerHTML;
        newsfeedDescription = getBetween(TempnewsfeedDescription, "<div><span", "</span></div>");
        if (newsfeedDescription.includes("class=")) {
            newsfeedDescription = newsfeedDescription + '<a>';
            newsfeedDescription = getBetween(newsfeedDescription, "\">", "<a>");
        }
        var encodedStr = newsfeedDescription;
        var parser = new DOMParser;
        var dom = parser.parseFromString(
            '<!doctype html><body>' + encodedStr,
            'text/html');
        newsfeedDescription = dom.body.textContent;
        //newsfeedDescription = $('div.fb-intel-ad[data-fb-intel-ad-type="side"] div[title]').parent().find('div:nth-child(4) div span').first().text();
    }
    return newsfeedDescription;
}

function getpageverified() {
    return null;
}

function getCategory(adRoot) {
   
    const categoryUrlCandidates = $(adRoot).find("a._52c6").first().length;
    const categoryUrl = $(adRoot)
        .find(`span[data-ft='{"tn":"k"}'] a[href^="https://www.facebook.com/"]`, `span.fwb > a.profileLink`).first().attr('href');
    if (categoryUrl) {
        const reqJson = {
            async: true,
            crossDomain: true,
            url: categoryUrl,
            method: "GET",
            headers: {
                "content-type": "application/json",
                "cache-control": "no-cache"
            },
            processData: false
        };
        $.ajax(reqJson).done(function (categoryPageSource) {

            let verified = getBetween(categoryPageSource, "class=\\\"_3d2h\\\">", "Facebook confirmed");
            if (verified.includes("Verified Page")) {
                verified = 'verified';
                $(adRoot).attr('data-fbpage-intel-page_verified', verified);
            }
            else {
                verified = 'not-verified';
                $(adRoot).attr('data-fbpage-intel-page_verified', verified);
            }
            let category = getBetween(categoryPageSource, 'categoryLabel:"', '",prepositionLabel:');
            if (category !== "") {
                $(adRoot).attr('data-fb-intel-category', category);
            }
            else if (category == "") {
                category = getBetween(categoryPageSource, "page_about_category\">", "</a>");
                if (category !== "") {
                    $(adRoot).attr('data-fb-intel-category', category);
                }
            } else {
                $(adRoot).attr('data-fb-intel-category', "No Category");
                //if (enableDebugger)
            }
        }).fail(function (error) {
            verified = 'not-verified';
            $(adRoot).attr('data-fbpage-intel-page_verified', verified);
            $(adRoot).attr('data-fb-intel-category', "No Category");
            //if (enableDebugger)
        });
    } else {
        //if (enableDebugger)
        $(adRoot).attr('data-fb-intel-category', "market");
    }
    return null;
}

function getAdVideoUrl(adRoot) {

    let scaledImages = $(adRoot).find('img.scaledImageFitWidth');

    if (scaledImages.length > 0) {

        // this is image, not video. Doesn't matter if feed or side
        $(adRoot).attr('data-fb-intel-type', "IMAGE");

        scaledImages.first().each(function () {
            $(adRoot).attr('data-fb-intel-image_video_url', $(this).attr('src'));
            $(adRoot).attr('data-fb-intel-other_multimedia_url', ""); // in case only one ad
        });

        if (scaledImages.length > 1) {
            let imagesArray = [];
            scaledImages.each(function () {
                imagesArray.push($(this).attr('src'));
            });
            $(adRoot).attr('data-fb-intel-other_multimedia_url', imagesArray.join('||'));
        }

        return; // we have done all that is needed
    }

    if ($(adRoot).attr('data-fb-intel-ad-type') === 'feed') {

        try {
            let imageArray = [];
            $(adRoot).find('ul.uiList img._kvn').each(function () {
                imageArray.push($(this).attr('src'));
            });
            if (imageArray.length > 0) {
                $(adRoot).attr('data-fb-intel-type', "IMAGE");
                $(adRoot).attr('data-fb-intel-image_video_url', imageArray[0]);
                $(adRoot).attr('data-fb-intel-other_multimedia_url', imageArray.join('||'));
                return null;
            }

            { // isolated scope
                let adVideoUrl;
                let adPostId;
                adPostId = $(adRoot).find("._5pcp._5lel._232_").attr('id');
                let updatedId = adPostId.split(";");
                adPostId = updatedId[3];

                adVideoUrl = "https://www.facebook.com/" + adPostId;
                //adVideoUrl = 'https://www.facebook.com/11689632618881';
                let adScraperComposerPostUrl = "https://www.facebook.com/react_composer/scraper?composer_id=" + composerId + "&target_id=" + user_ID + "&scrape_url=" + adVideoUrl + "&entry_point=feedx_sprouts&source_attachment=STATUS&source_logging_name=link_pasted&av=" + user_ID + "&dpr=1";
                let adScraperComposerData = "__user=" + user_ID + "&__a=1&__dyn=5V4cjLx2ByK5A9UkKLqAyqomzFE9XG8GAdyempFLOaA4VEvxuES2N6xCay8KFGUpG4VEG5UaEObGubyRUC48G5WAxamjDK8xmAcU8UqDodEHDByU8rCAUg-nDLzA5KcyF8O49ElwQUlByECQi8yFUix6eUkg8GxqUkC-Rx2ih1G7Wxqp3FK4bDJ2u5Ey4VEWul3oy48a9EGqqrxmfCx6WLBx11yhu9KfmFqzlEyEGGfjglyRfBGqVk5HyXV98-8iyuXyES2Wq6rK8oK8GE_Ax2fKdx69hEkBHxzmeBA-FpF-23RxqmiChxC&fb_dtsg=" + fb_dtsg + "&jazoest=2658172788811151107827351685865817110211310810010355986576";
                const reqJson = {
                    async: true,
                    crossDomain: true,
                    url: adScraperComposerPostUrl,
                    method: "POST",
                    data: adScraperComposerData,
                    adPostId: adPostId
                };
                $.ajax(reqJson).done(function (videoPageSource) {
                    if (!videoPageSource.includes('sd_src')) {
                        return null; // either we're too early or there's an image we didn't trap. Let the retry deal with it
                    }
                    $(adRoot).attr('data-fb-intel-type', "VIDEO");
                    let adVideoURL;
                    let splitMediaSource = videoPageSource.split("sd_src\":\"");
                    splitMediaSource = splitMediaSource.slice(1, splitMediaSource.length);
                    let videoSourceUrl = "";
                    if (splitMediaSource.length > 1) {
                        let videoUrlArray = [];
                        splitMediaSource.forEach(function (video) {
                            video = "<a>" + video;
                            let sourceUrl = getBetween(video, "<a>", "\"");
                            sourceUrl = sourceUrl.replace(/\\/g, "").replace(/&amp;/g, "&");
                            videoUrlArray.push(sourceUrl);
                        });
                        if (videoUrlArray.length > 0) {
                            videoSourceUrl = videoUrlArray.join('||');
                            $(adRoot).attr('data-fb-intel-image_video_url', videoUrlArray[0]);
                            $(adRoot).attr('data-fb-intel-other_multimedia_url', videoSourceUrl);
                        }
                    } else {
                        adVideoURL = getBetween(videoPageSource, "sd_src\":\"", "\"");
                        adVideoURL = adVideoURL.replace(/\\/g, "").replace(/&amp;/g, "&");
                        adVideoURL = adVideoURL.replace(/u00253/g, "%3");
                        if (adVideoURL !== "") {
                            $(adRoot).attr('data-fb-intel-image_video_url', adVideoURL);
                            $(adRoot).attr('data-fb-intel-other_multimedia_url', "");
                        }
                    }
                });
            }
        } catch (e) {

        }
        return null;
    } else if ($(adRoot).attr('data-fb-intel-ad-type') === 'side') {
        if ($(adRoot).find('img.scaledImageFitWidth').length > 0) {
            $(adRoot).find('img.scaledImageFitWidth').each(function () {
                $(adRoot).attr('data-fb-intel-type', "IMAGE");
                $(adRoot).attr('data-fb-intel-image_video_url', $(this).attr('src'));
                $(adRoot).attr('data-fb-intel-other_multimedia_url', "");
                return null;
            });
            let imageArray = [];
            $(adRoot).find('img.scaledImageFitWidth').each(function () {
                imageArray.push($(this).attr('src'));
            });
            if (imageArray.length > 0) {
                $(adRoot).attr('data-fb-intel-type', "IMAGE");
                $(adRoot).attr('data-fb-intel-image_video_url', imageArray[0]);
                $(adRoot).attr('data-fb-intel-other_multimedia_url', imageArray.join('||'));
                return null;
            }
        }
        else if ($(adRoot).find('img.scaledImageFitHeight').length > 0) {
            $(adRoot).find('img.scaledImageFitHeight').each(function () {
                $(adRoot).attr('data-fb-intel-type', "IMAGE");
                $(adRoot).attr('data-fb-intel-image_video_url', $(this).attr('src'));
                $(adRoot).attr('data-fb-intel-other_multimedia_url', "");
                return null;
            });
            let imageArray = [];
            $(adRoot).find('img.scaledImageFitHeight').each(function () {
                imageArray.push($(this).attr('src'));
            });
            if (imageArray.length > 0) {
                $(adRoot).attr('data-fb-intel-type', "IMAGE");
                $(adRoot).attr('data-fb-intel-image_video_url', imageArray[0]);
                $(adRoot).attr('data-fb-intel-other_multimedia_url', imageArray.join('||'));
                return null;
            }
        }

    }
}

function extractCount(text) {
    text = text.trim().toLowerCase();
    let value = 0;
    if (text !== "") {
        const re = new RegExp(/\d[km]/i);
        const matchResult = re.exec(text);
        if (matchResult) {
            if (text.includes('k')) {
                value = 1000 * parseFloat(text);//.replace('k', '.'));
            } else if (text.includes('m')) {
                value = 1000000 * parseFloat(text);//.replace('m', '.'));
            }
        } else {
            value = parseInt(text);
        }
    }
    return value;
}

function getLikesCount(adRoot) {

    try {
        if ($(adRoot).attr('data-fb-intel-ad-type') === 'feed') {

            let likesCount = 0;

            if ($(adRoot).length > 0) {
                try {
                    var htmlContent = $(adRoot)[0].innerHTML;
                    var like = decodeItem(htmlContent, rules_facebook.posts.likes);
                    like = like.replace(/<.*?>/g);

                    var numbers = like.match(/\d+/g).map(Number);

                    if (numbers.length > 0) {
                        likesCount = numbers[0];
                    }

                    if (likesCount === '' || likesCount === undefined || likesCount === null) {
                        likesCount = 0;
                    }
                } catch (error) {
                    likesCount = 0;
                }
            }

            if (likesCount === 0) {
                const likesAnchors = $(adRoot).find(`a[href*="ufi/reaction/profile/browser"]`);
                if (likesAnchors.length) {
                    const likesCountString = likesAnchors.first().text();
                    likesCount = extractCount(likesCountString);
                }
            }

            if (likesCount === 0) {
                if ($(adRoot).find('._3dlh').length > 0) {
                    var likeValue = $(adRoot).find('._3dlh')[0].innerText;
                    if (isNumber(likeValue)) {
                        likesCount = likeValue;
                    }
                }
            }

            return likesCount;
        } else if ($(adRoot).attr('data-fb-intel-ad-type') === 'side') {
            return 0;
        }
    } catch (e) {
        //if (enableDebugger)
    }
}

var isNumber = function (str) {
    var pattern = /^\d+$/;
    return pattern.test(str);
};

function getSharesCount(adRoot) {

    if ($(adRoot).attr('data-fb-intel-ad-type') === 'feed') {


        let sharesCount = 0;

        if ($(adRoot).length > 0) {
            try {
                var htmlContent = $(adRoot)[0].innerHTML;
                var share = decodeItem(htmlContent, rules_facebook.posts.shares);
                sharesCount = share.replace(/^\D+/g, '').trim();
                var numbers = sharesCount.match(/\d+/g).map(Number);

                if (numbers.length > 0) {
                    sharesCount = numbers[0];
                }


                if (sharesCount === '' || sharesCount === undefined || sharesCount === null) {
                    sharesCount = 0;
                }
            } catch (error) {
                sharesCount = 0;
            }
        }

        if (sharesCount == 0) {
            const sharesAnchors = $(adRoot).find(`a[href*="shares/view"]`);

            if (sharesAnchors.length) {
                const likesCountString = sharesAnchors.first().text();
                sharesCount = extractCount(likesCountString);
            }
        }

        return sharesCount;
    } else if ($(adRoot).attr('data-fb-intel-ad-type') === 'side') {
        return 0;
    }
}

function getCommentsCount(adRoot) {

    if ($(adRoot).attr('data-fb-intel-ad-type') === 'feed') {

        let commentsCount = 0;

        if ($(adRoot).length > 0) {
            try {
                var htmlContent = $(adRoot)[0].innerHTML;
                var comments = decodeItem(htmlContent, rules_facebook.posts.comments);
                var numbers = comments.match(/\d+/g).map(Number);
                if (numbers.length > 0) {
                    commentCount = numbers[0];
                }
                if (commentCount === '' || commentCount === undefined || commentCount === null) {
                    commentCount = 0;
                }
            } catch (error) {
                commentsCount = 0;
            }

        }

        if (commentsCount == 0) {
            const commentsAnchors = $(adRoot).find(`a[href*="comment"]`);

            if (commentsAnchors.length) {
                const likesCountString = commentsAnchors.first().text();
                commentsCount = extractCount(likesCountString);
            }
        }
        return commentsCount;
    }
    else if ($(adRoot).attr('data-fb-intel-ad-type') === 'side') {
        return 0;
    }
}

function getPlatform() {
    return Platform;
}

function transformFacebookUrl(url) {
    url = url.replace("https://l.facebook.com/l.php?u=", "");
    if (url.includes("&h=AT")) {
        const tempUrl = url.split('&h=AT');
        url = tempUrl[0];
    }
    return url.includes('http') ? url : null;
}

function getDestinationUrl(adRoot) {

    let adLinkURL;
    try {
        if ($(adRoot).attr('data-fb-intel-ad-type') === 'feed') {

            adLinkURL = $(adRoot).find('a[href^="https://l.facebook.com/l.php?u=http"]').first().attr('href');
            if (adLinkURL) {
                return transformFacebookUrl(adLinkURL);
            }
            adLinkURL = $(adRoot).find('a[href^="https://l.facebook.com/l.php?u="]').first().attr('href');
            if (adLinkURL) {
                return adLinkURL.includes('http') ? adLinkURL : null;
            }
            adLinkURL = $(adRoot).find('a[target="_blank"]').first().attr('href');
            if (adLinkURL) {
                return adLinkURL.includes('http') ? adLinkURL : null;
            }
            adLinkURL = $(adRoot).find('a[href^="http"]').first().attr('href');
            if (adLinkURL) {
                return adLinkURL.includes('http') ? adLinkURL : null;
            }
            return null;
        } else if ($(adRoot).attr('data-fb-intel-ad-type') === 'side') {
            adLinkURL = $(adRoot).find('a[href^="https://l.facebook.com/l.php?u=http"]').first().attr('href');
            if (adLinkURL) {
                return transformFacebookUrl(adLinkURL);
            }
            adLinkURL = $(adRoot).find('a[href^="https://l.facebook.com/l.php?u="]').first().attr('href');
            if (adLinkURL) {
                return adLinkURL.includes('http') ? adLinkURL : null;
            }
            adLinkURL = $(adRoot).find('a[target="_blank"]').first().attr('href');
            return adLinkURL.includes('http') ? adLinkURL : null;
        }
        // allow anyway if still null and attempts > 7
        if (!adLinkURL && parseInt($(adRoot).attr('data-fb-intel-attempts')) >= sendDefaultAttempts) {
            adLinkURL = ""; // this will allow save
        }

        return adLinkURL;
    } catch (e) {
        //adLinkURL="";
        return null;
    }
}

function getCallActionType(adRoot) {

    const searchText = $(adRoot).text().trim().toLowerCase();
    const actionTypes = [
        "Learn More", "Sign Up", "Shop Now", "Interested", "Send Message", "Book Now", "Play Now", "Download",
        "Get Offer", "Make Reservation", "Donate", "Use App", "Play Game", "Watch Video", "See Offers", "Book Appointment",
        "Listen", "Send Email", "Request Time", "Read articles", "Video Call Room", "Start Order", "Get Directions",
        "Get Tickets", "WhatsApp", "Play Music", "Visit group", "Apply Now", "Buy", "Buy Now", "Buy Tickets",
        "Call Now", "Contact Us", "Donate Now", "Download", "Get Deal", "Get Offer", "Get Quote", "Get Your Code",
        "Install App", "Install Now", "Learn Page", "Like Page", "Liked", "Listen Now", "Listen on Apple Music",
        "Listen On Deezer", "Listen on Whooshkaa", "Open Link", "Order Now", "Play Game", "Play", "Save Offer",
        "Save", "SaveSaved", "See Details", "See Menu", "Sell Now", "Spotify Icon", "Spotify IconAdd to Spotify",
        "Use Now", "View Event", "Visit Website", "Vote Now", "Watch More"
    ];
    for (const actionType of actionTypes) {
        if (searchText.includes(actionType.toLowerCase())) {
            return actionType;
        }
    }
    return "";
}

function getLowerAdAge() {

    if (birthday === '' || birthday === null || birthday === undefined) {
        return "18";
    }
    return birthday.toString();
}

function getUpperAdAge() {
    return "65";
}

//function getPostOwnerImage(adRoot) {
//    if ($(adRoot).attr('data-fb-intel-ad-type') === 'feed') {
//        return $(adRoot).find('img._s0').first().attr('src');
//    } else if ($(adRoot).attr('data-fb-intel-ad-type') === 'side') {
//        return "";
//    }
//}

function getPostOwnerImage(adRoot) {

    if ($(adRoot).attr('data-fb-intel-ad-type') === 'feed') {

        if ($(adRoot).length > 0) {
            try {
               
                var htmlContent = $(adRoot)[0].innerHTML;
                var postOwnerImageUrl = decodeItem(htmlContent, rules_facebook.posts.postOwnerImage);
                postOwnerImageUrl = postOwnerImageUrl.replace(/&amp;/g, '&');

                if (postOwnerImageUrl != '') {
                    $(adRoot).attr('data-fb-intel-post_owner_image', postOwnerImageUrl);
                    return postOwnerImageUrl;
                }
            } catch (error) {

            }
        }

        let adPostId = '';
        let ownerimg = '';
        adPostId = $(adRoot).find("._5pcp._5lel._232_").attr('id');
        let updatedId = adPostId.split(";");
        adPostId = updatedId[3];
        adpostUrl = "https://www.facebook.com/" + adPostId;
        //adpostUrl='https://www.facebook.com/1665093386871550';
        if (adpostUrl) {
            const reqJson = {
                async: true,
                crossDomain: true,
                url: adpostUrl,
                method: "GET",
                headers: {
                    "content-type": "application/json",
                    "cache-control": "no-cache"
                },
                processData: false
            };
            $.ajax(reqJson).done(function (categoryPageSource) {
                let postownerimage = getBetween(categoryPageSource, "<img class=\"_11h5 img\" src=\"", "\"");
                if (postownerimage == "") {
                    postownerimage = getBetween(categoryPageSource, "<img class=\"_s0 _4ooo _5xib", "\">");
                    postownerimage = getBetween(postownerimage, "src=\"", "\"");
                }
                ownerimg = postownerimage.replace(/&amp;/g, "&");
                if (ownerimg != '') {
                    $(adRoot).attr('data-fb-intel-post_owner_image', ownerimg);
                }
                else {
                    ownerimg = $(adRoot).find('img._s0._4ooo._5xib').first().attr('src');
                    if (ownerimg != '') {
                        ownerimg = ownerimg.replace("&amp;", "&");
                        $(adRoot).attr('data-fb-intel-post_owner_image', ownerimg);
                    }
                }
            }).fail(function (error) {
                //if (enableDebugger)
            });
        }
        else {
            ownerimg = $(adRoot).find('img._s0._4ooo._5xib').first().attr('src');
            if (ownerimg != '') {
                ownerimg = ownerimg.replace("&amp;", "&");
                $(adRoot).attr('data-fb-intel-post_owner_image', ownerimg);
            }
        }
        return null;
    } else if ($(adRoot).attr('data-fb-intel-ad-type') === 'side') {
        return null;
    }
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
    return d.getTime();
}

function getLastSeen() {
    const d = new Date();
    return d.getTime();
}

function getPostDate(adRoot) {

    let adPostTime;
    if ($(adRoot).attr('data-fb-intel-ad-type') === 'feed') {

        adPostTime = $(adRoot).find("._5pcp._5lel._232_").attr('id');
        let updatedTime = adPostTime.split(";");
        let adPostedTime = updatedTime[4];
        adPostedTime = "tm" + adPostedTime;
        adPostTime = getBetween(adPostedTime, "tm", ":");
    } else if ($(adRoot).attr('data-fb-intel-ad-type') === 'side') {
        const d = new Date();
        return d.getTime();
    }
    return adPostTime;
}

function getAdId(adRoot) {

    let adPostId;
    if ($(adRoot).attr('data-fb-intel-ad-type') === 'feed') {

        adPostId = $(adRoot).find("._5pcp._5lel._232_").attr('id');
        let updatedId = adPostId.split(";");
        adPostId = updatedId[3];
        //$(adRoot).attr('data-fb-intel-ad_id', adPostId);
    } else {
        adPostId = $(adRoot).attr('data-ego-fbid');
    }
    return adPostId;
}

function getType() {
    return null;
}

function getPosition(adRoot) {
    if ($(adRoot).attr('data-fb-intel-ad-type') === 'feed') {
        return "FEED";
    } else if ($(adRoot).attr('data-fb-intel-ad-type') === 'side') {
        return "SIDE"
    } else {
        return null;
    }
}

function getUndefined() {
    return "Not implemented yet";
}

//div.fb-intel-ad[data-fb-intel-triaged='no'], div.fb-intel-ad[data-fb-intel-triaged='not-sponsored']
// $("div.fb-intel-ad[data-fb-intel-triaged='no'], div.fb-intel-ad[data-fb-intel-triaged='not-sponsored']")
function hideOrShowAds() {
    if (scrollCounter % 10 === 0) {
        let hideTime = Date.now();
        chrome.storage.local.get({ "issponsored": "OFF" }, function (result) {
            if (result.issponsored == "OFF") {
                //$('div[data-fb-intel-triaged="not-sponsored"]').show();
                $('div[data-fb-intel-triaged="not-sponsored"]').show();
            } else {
                // $('div[data-fb-intel-triaged="not-sponsored"]').hide();
                $('div[data-fb-intel-triaged="not-sponsored"]').hide();
            }
            chrome.runtime.sendMessage(null, { "hideTime": Date.now() - hideTime });
        });
    }
}

function getUserData() {
    //debugger;
    if (user_ID && fb_dtsg && composerId) return;

    let headText = document.getElementsByTagName("head")[0].innerHTML;
    const reUserId = new RegExp(/USER_ID":"(\d*)/i);
    let matchResult = reUserId.exec(headText);
    if (matchResult) {
        user_ID = matchResult[1];
    }

    fb_dtsg = $('input[name="fb_dtsg"]').first().attr('value');
    composerId = $('input[name="xhpc_composerid"]').first().attr('value');
    if (user_ID !== undefined && user_ID !== "") {
        chrome.storage.local.get('userid', function (result) {
            userid = result.userid;
            if (userid !== user_ID) {
                chrome.storage.local.set({ 'userid': user_ID });
            }
        });
    }
    if ((fb_dtsg === undefined || fb_dtsg == "") && (composerId === undefined || composerId == "")) {
        const home = "https://www.facebook.com";
        $.ajax({
            url: home,
            type: "GET",
            async: true,
            success: function (homepagerespResponse) {
                composerId = getBetween(homepagerespResponse, "composerID:\"", "\"")
                fb_dtsg = getBetween(homepagerespResponse, "\"fb_dtsg\" value=\"", "\"")
                if (user_ID === undefined || user_ID == "") {
                    const reUserId = new RegExp(/USER_ID":"(\d*)/i);
                    let matchResult = reUserId.exec(homepagerespResponse);
                    if (matchResult) {
                        user_ID = matchResult[1];
                    }
                    if (user_ID !== undefined && user_ID !== "") {
                        chrome.storage.local.get('userid', function (result) {
                            userid = result.userid;
                            if (userid !== user_ID) {
                                chrome.storage.local.set({ 'userid': user_ID });
                            }
                        });
                    }
                }
                // chrome.storage.local.set({"geoData":geoData});
            }
        });
    }
}

function buildUpGeoData() {
    if (!geoData.userIP || !geoData.userCity || !geoData.userState || !geoData.userCountry) {
        if (!geoData.userIP) {
            // if (enableDebugger)
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
            // if (enableDebugger)
            geoData.serviceId = (geoData.serviceId + 1) % geoFunctions.length;
            geoFunctions[geoData.serviceId].call(null, geoData.userIP);
        }
    }
}


function userDetails() {
    let userID = '';
    let currentCity = '';
    let profileName = '';
    let data = document.getElementsByTagName("html")[0].innerHTML;
    userID = getBetween(data, "USER_ID\":\"", "\"");
    if (userID == "") {
        userID = getBetween(data, "ACCOUNT_ID\":\"", "\"");
    }
    fb_dtsg = getBetween(data, "fb_dtsg\" value=\"", "\"");

    let adUser = "{\"facebook_id\":\"" + userID + "\"}";
    const settings = {
        async: true,
        crossDomain: true,
        url: powerAdSpyApi + "checkFbUser",
        method: "POST",
        headers: {
            "content-type": "application/json",
            "cache-control": "no-cache"
        },
        processData: false,
        data: adUser
    };

    $.ajax(settings).done(function (response) {
        //console.log(response);
        const obj = JSON.parse(response);
        const userCount = obj.count;
        if (userCount != 1) {
            const aboutUrl = "https://www.facebook.com/profile.php?id=" + userID + "&sk=about";
            const LivingUrl = "https://www.facebook.com/" + userID + "/about?section=living&pnref=about";
            const GenderPageURL = "https://www.facebook.com/profile.php?id=" + userID + "&sk=about&section=contact-info";
            const relationshipURL = "https://www.facebook.com/" + userID + "/about?section=relationship&pnref=about";
            $.ajax({
                url: aboutUrl,
                type: "GET",
                async: true,
                success: function (AboutPage) {
                    profileName = getBetween(AboutPage, "id=\"pageTitle\">", "<");
                    if (profileName == '') {
                        // @todo doubt this ever gets executed
                        profileName = getBetween(AboutPage, "fb-timeline-cover-name\">", "<").replace("&#039;", "'");
                    }

                    profileName = profileName.replace(",", "");

                    if (profileName == '') {
                        profileName = "NA";
                    }
                    birthday = getBetween(AboutPage, "Birthday</span></div><div>", "</div>").replace(",", "");
                    birthday = birthday.substr(birthday.length - 4, 4);
                    const d = new Date();
                    const n = d.getFullYear();
                    birthday = n - birthday;
                    if (isNaN(birthday) || birthday == n) {
                        birthday = 23;
                    }
                    let gender = '';
                    $.ajax({
                        url: GenderPageURL,
                        type: "GET",
                        async: true,
                        success: function (GenderPage_Response) {
                            const genderInfo = getBetween(GenderPage_Response, "Gender</span>", "</span>");
                            if (genderInfo.indexOf("Male") != -1) {
                                gender = "Male";
                            }
                            else if (genderInfo.indexOf("Female") != -1) {
                                gender = "Female";
                            }
                            else {
                                gender = "NA";
                            }
                            let relationshipStatus = '';
                            $.ajax({
                                url: relationshipURL,
                                type: "GET",
                                async: true,
                                success: function (Relationship_Response) {
                                    relationshipStatus = getBetween(Relationship_Response, "class=\"_vb- _50f5\">", "<");
                                    let otherPlace = '';
                                    $.ajax({
                                        url: LivingUrl,
                                        type: "GET",
                                        async: true,
                                        success: function (Living_Response) {
                                            let currentLocationAndHomeTown = getBetween(Living_Response, "Current City and Home Town", "Other Places Lived");
                                            if (currentLocationAndHomeTown == "") {
                                                currentLocationAndHomeTown = getBetween(Living_Response, "CURRENT CITY AND HOMETOWN", "OTHER PLACES LIVED");
                                            }
                                            if (currentLocationAndHomeTown == "") {
                                                currentLocationAndHomeTown = getBetween(Living_Response, "Current City and Hometown", "Other Places Lived");
                                            }
                                            let livingStatus = currentLocationAndHomeTown.split("data-hovercard-prefer-more-content-show=");
                                            currentCity = getBetween(livingStatus[1], "1\">", "</a>");
                                            if (currentCity == "") {
                                                currentCity = getBetween(Living_Response, "data-hovercard-prefer-more-content-show=\"1\">", "</a>");
                                            }

                                            let countofotherplace = 0;
                                            let otherPlaces = Living_Response.split("class=\"_2iel _50f7\"");
                                            otherPlaces = otherPlaces.slice(2, otherPlaces.length);
                                            if (otherPlaces.length > 0) {
                                                otherPlaces.forEach(function (movedPlaces) {
                                                    if (movedPlaces.indexOf("<!DOCTYPE html>") == -1) {
                                                        countofotherplace = countofotherplace + 1;
                                                        otherPlace = getBetween(movedPlaces, "data-hovercard-prefer-more-content-show=\"1\">", "</a>") + "fdads" + otherPlace;
                                                        if (countofotherplace == 1) {
                                                            if (otherPlace.includes("fdads")) {
                                                                otherPlace = otherPlace.replace("fdads", "");
                                                            }
                                                        }
                                                        else {
                                                            if (otherPlace.includes("fdads")) {
                                                                otherPlace = otherPlace.replace("fdads", "|");
                                                                //if (otherPlace.includes("India|")) {
                                                                //    otherPlace = otherPlace.replace("India|", "India");
                                                                //}
                                                            }
                                                        }
                                                    }
                                                });
                                            }


                                            if (userID == "0" || userID == 0 || userID == '0') {
                                                return false;
                                            }
                                            //userID="54654465464624655";
                                            const adData = "{\"facebook_id\":\"" + userID + "\",\"current_country\":\"" + currentCity + "\",\"name\":\"" + profileName + "\",\"others_places_lived\":\"" + otherPlace + "\",\"Gender\":\"" + gender + "\",\"age\":\"" + birthday + "\",\"relationship_status\":\"" + relationshipStatus + "\"}";
                                            //console.log(adData);
                                            const settings = {
                                                async: true,
                                                crossDomain: true,
                                                url: powerAdSpyApi + "fb_user_data",
                                                method: "POST",
                                                headers: {
                                                    "content-type": "application/json",
                                                    "cache-control": "no-cache"
                                                },
                                                processData: false,
                                                data: adData
                                            }
                                            $.ajax(settings).done(function (response) {
                                                //console.log(response);
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}

function userAdPreferences() {



    const data = document.getElementsByTagName("html")[0].innerHTML;

    const fb_dtsg = getBetween(data, "fb_dtsg\" value=\"", "\"");

    let userID = getBetween(data, "USER_ID\":\"", "\"");

    if (userID == "") {
        userID = getBetween(data, "ACCOUNT_ID\":\"", "\"");
    }

    const adData = "__user=" + userID + "&__a=1&fb_dtsg=" + fb_dtsg;

    const settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://www.facebook.com/ads/profile/interests/?dpr=1",
        "method": "POST",
        "headers": {
            "cache-control": "no-cache",
            "postman-token": "30c0c2bf-cee3-f072-071a-05b3e58fc3fe"
        },
        "processData": false,
        "data": adData
    };

    $.ajax(settings).done(function (response) {

        response = decodeURI(response.replace("\\\\([^u])", "\\\\$1"));
        response = response.replace(/\u00253A/g, "//");
        response = response.replace(/u00252F/g, "/");
        response = response.replace(/u00253A/g, "/");
        response = response.replace(/\u00253A/g, ":");
        response = response.replace(/\\/g, "");
        let userInterestCategoryList = response.split(`{"fbid"\:`);
        userInterestCategoryList = userInterestCategoryList.slice(1, userInterestCategoryList.length);
        try {
            let interestData = "";
            for (let i = 0; i < userInterestCategoryList.length; i++) {

                const subCategory = getBetween(userInterestCategoryList[i], `name":"`, `"`);
                const category = getBetween(userInterestCategoryList[i], `topic":"`, `"`);

                interestData = interestData + "|" + category + ":" + subCategory;
            }
            if (interestData.startsWith("|")) {
                interestData = interestData.substr(1);
            }
            const insertUserVar = `{"facebook_id":"` + userID + `","interests":"` + interestData + `"}`;
            const searchSettingsFeed = {
                "async": true,
                "crossDomain": true,
                "url": powerAdSpyApi + "insertUserInterest",
                "method": "POST",
                "headers": {
                    "content-type": "application/json",
                    "cache-control": "no-cache"
                },
                "processData": false,
                "data": insertUserVar
            };

            $.ajax(searchSettingsFeed).done(function (response) {

            });
        } catch (e) {

        }
    });
}







function checkForNew() {
    //debugger;
    // feed ads
    $("div._5jmm:not([data-fb-intel-triaged])")
        .attr("data-fb-intel-triaged", "no")
        .attr("data-fb-ad", "yes")
        .attr("data-fb-intel-ad-type", "feed")
        .addClass('fb-intel-ad');

    $("div.ego_unit:not([data-fb-intel-triaged])")
        .attr("data-fb-intel-triaged", "no")
        .attr("data-fb-ad", "yes")
        .attr("data-fb-intel-ad-type", "side")
        .addClass('fb-intel-ad');

    //.attr("data-fb-intel-triaged", "sponsored");
}

function triageItems() {
    const startTime = Date.now();
    if (sponsoredClass) {
        $("div.fb-intel-ad[data-fb-intel-triaged='no'], div.fb-intel-ad[data-fb-intel-triaged='not-sponsored']").each(function () {
            if ($(this).attr('data-fb-intel-ad-type') == "feed") {
                let sponsoredLinkCount = '';
                if ($(this).find('._5pcp').length > 0 && $(this).find('._5pcp._5lel._2jyu._232_').length > 0) {

                    sponsoredLinkCount = $(this).find('._5pcp._5lel._2jyu._232_')[0].innerText;
                    sponsoredLinkCount = encodeURIComponent(sponsoredLinkCount);

                    if (!sponsoredLinkCount.includes(sponsoredClass) && !sponsoredLinkCount.includes(optsponsoredClass)) {
                        $(this).attr("data-fb-intel-triaged", "not-sponsored");
                    }

                    else if (sponsoredLinkCount === sponsoredClass || sponsoredLinkCount === optsponsoredClass) {
                        $(this).attr("data-fb-intel-triaged", "sponsored");
                    }

                }
                else {
                    $(this).attr("data-fb-intel-triaged", "not-sponsored");
                }
            }

            else if ($(this).attr('data-fb-intel-ad-type') == "side") {
                let sponsoredLinkCount = '';
                if ($(this)[0].parentElement.parentElement) {
                    sponsoredLinkCount = $(this)[0].parentElement.parentElement.innerText;
                    if (!sponsoredLinkCount.includes(sidesponsoredClass)) {
                        $(this).attr("data-fb-intel-triaged", "not-sponsored");
                    }
                    else if (sponsoredLinkCount.includes(sidesponsoredClass)) {
                        $(this).attr("data-fb-intel-triaged", "sponsored");
                    }
                }
            }

        });
    }
    const delta = Date.now() - startTime;
    chrome.runtime.sendMessage(null, { "triageTime": delta });
}

function extractDataFromItems() {

    const startTime = Date.now();
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

        //if (debugParsing || $("html").attr('fb-intel-debug')) {
        if ($(this).find("div.fb-intel-debug").length === 0) {
            $(this).append($('<div class="fb-intel-debug" style="display:none"></div>'));
        }

        debugPanel += `<p>sponsoredClass: ${sponsoredClass}</p>`;
        //console.log(debugPanel);
        $(this).find("div.fb-intel-debug").first().html(debugPanel);

        //}
    });
    const delta = Date.now() - startTime;
    chrome.runtime.sendMessage(null, { "extractTime": delta });

}

function getSponsoredAdCount() {
    $("div.fb-intel-ad[data-fb-intel-parsed]:not([data-fb-intel-count-updated])").each(function () {
        const owner = $(this).attr("data-fb-intel-post_owner");
        if (owner) {
            let searchPostOwnerDataFeed = "{\"post_owner\":\"" + owner + "\"}";
            //console.log(powerAdSpyApi + "postOwner");
            //console.log(searchPostOwnerDataFeed);
            const reqJson = {
                async: true,
                crossDomain: true,
                url: powerAdSpyApi + "postOwner",
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "cache-control": "no-cache"
                },
                processData: false,
                data: searchPostOwnerDataFeed
            };

            const attachTo = $(this).find("div._5pcp").first();

            $.ajax(reqJson).done((function (pAttachTo, pOwner) {
                return function (response) {
                    //if (enableDebugger)
                    //console.log(response);


                    const returnObj = JSON.parse(response);
                    const adCount = returnObj.data.count;
                    $(pAttachTo).append($("<a></a>")
                        .attr("href", powerAdSpyLander + encodeURIComponent(pOwner))
                        .attr("target", "_blank")
                        .attr("class", "powerlanding")
                        .text("Total Ads: " + adCount)
                    );
                };
            })(attachTo, owner));
            $(this).attr("data-fb-intel-count-updated", "true");
        }
    });
}

function saveSponsoredAds() {
    $("div.fb-intel-ad[data-fb-intel-parsed='complete']:not([data-fb-intel-saved])").each(function () {

        const adRoot = this;
        let thisAdData = Object.assign({}, adData);
        for (const [key, value] of Object.entries(requiredData)) {
            thisAdData[key] = $(adRoot).attr(value.attribute) || "";
            if (thisAdData[key] === null) {
                //if (enableDebugger)
            }
        }

        const postData = JSON.stringify(thisAdData);
        //console.log(powerAdSpyApi + "adsdata");
        //console.log(postData);
        // if (enableDebugger)
        const settings = {
            "async": true,
            "crossDomain": true,
            "url": powerAdSpyApi + "adsdata",
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
            try {
                let abc = (JSON.parse(response));
                if (abc.code == '200') {
                    console.log(abc);
                    $(adRoot).attr("data-fbpage-intel-saved", "saved");
                }
                else {
                    console.log(abc);
                    $(adRoot).attr("data-fbpage-intel-triaged", "completeforpages");
                    $(adRoot).attr("data-fbpage-intel-saved", "success");
                }
            }
            catch (e) {
                console.log(response);
                console.log(response.error);
            }
        }).fail(function () {
            //if (enableDebugger)
            // mark as done so we won't retry
            $(adRoot).attr("data-fb-intel-triaged", "complete");
            $(adRoot).attr("data-fb-intel-saved", "failed");
        });
    });
}

//function addEventListeners() {
//    $("div.fb-intel-ad[data-fb-intel-triaged='sponsored']:not([data-fb-intel-events-added])").each(function () {
//        const adId = $(this).attr('data-fb-intel-ad_id');
//        $(this).find(`div[data-ft='{"tn":"*J"}'] a`).each(function () {
//            let adLinkURL = $(this).attr('href'); // the link to track
//            if (!adLinkURL) {
//                adLinkURL =  $(this).find('a[href^="https://l.facebook.com/l.php?u=http"]').first().attr('href');
//            }
//           if (!adLinkURL) {
//                adLinkURL =  $(this).find('a[href^="https://l.facebook.com/l.php?u="]').first().attr('href');
//                if (adLinkURL) {
//                    adLinkURL = adLinkURL.includes('http') ? adLinkURL : null;
//                }
//            }
//           if (!adLinkURL) {
//               adLinkURL =  $(this).find('a[target="_blank"]').first().attr('href');
//               if (adLinkURL) {
//                   adLinkURL = adLinkURL.includes('http') ? adLinkURL : null;
//               }
//           }
//            if (!adLinkURL) {
//                adLinkURL =  $(this).find('a[href^="http"]').first().attr('href');
//                if (adLinkURL) {
//                    adLinkURL = adLinkURL.includes('http') ? adLinkURL : null;
//                }
//            }
//            //$(this).attr('target', '_blank');
//            //chrome.runtime.sendMessage(null, {
//            //    action: "user clicked",
//            //    url: adLinkURL,
//            //    adId: adId || `1`
//            //});
//            $(this).on('click', function () {
//                alert('hhfhjfhjfhjgfhf');
//                //e.stopImmediatePropagation();
//                //e.stopPropagation();
//                //e.preventDefault();
//                chrome.runtime.sendMessage(null, {
//                    action: "user clicked",
//                    url: adLinkURL,
//                    adId: adId || `1`
//                });

//                //chrome.runtime.sendMessage({ 
//                //    action: "user clicked",
//                //    url: adLinkURL,
//                //    adId: adId || `1`}, 
//                //    function(response) {
//                //    console.log(response);
//                //});
//                //console.log(typeof this, typeof $(this));

//            });
//        });
//        $(this).attr('data-fb-intel-events-added', "true");
//    });
//}

function addEventListeners() {
    $("div.fb-intel-ad[data-fb-intel-triaged='sponsored']:not([data-fb-intel-events-added])").each(function () {
        const adId = $(this).attr('data-fb-intel-ad_id');
        $(this).find(`div[data-ft='{"tn":"*J"}'] a`).each(function () {
            let adLinkURL = $(this).attr('href'); // the link to track
            if (!adLinkURL) {
                adLinkURL = $(this).find('a[href^="https://l.facebook.com/l.php?u=http"]').first().attr('href');
            }
            if (!adLinkURL) {
                adLinkURL = $(this).find('a[href^="https://l.facebook.com/l.php?u="]').first().attr('href');
                if (adLinkURL) {
                    adLinkURL = adLinkURL.includes('http') ? adLinkURL : null;
                }
            }
            if (!adLinkURL) {
                adLinkURL = $(this).find('a[target="_blank"]').first().attr('href');
                if (adLinkURL) {
                    adLinkURL = adLinkURL.includes('http') ? adLinkURL : null;
                }
            }
            if (!adLinkURL) {
                adLinkURL = $(this).find('a[href^="http"]').first().attr('href');
                if (adLinkURL) {
                    adLinkURL = adLinkURL.includes('http') ? adLinkURL : null;
                }
            }
            $(this).attr('target', '_blank');
            chrome.runtime.sendMessage(null, {
                action: "user clicked",
                url: adLinkURL,
                adId: adId || `1`
            });
        });
        $(this).attr('data-fb-intel-events-added', "true");
    });
}