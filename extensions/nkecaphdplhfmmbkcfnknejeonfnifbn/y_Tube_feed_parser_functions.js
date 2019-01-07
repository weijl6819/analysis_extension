
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
function getUserIp() {
    //debugger;
    return !!geoData.userIP ? geoData.userIP : null;
}
function getUserCity() {
    //debugger;
    return !!geoData.userCity ? geoData.userCity : null;
}

function getUserState() {
    //debugger;
    return !!geoData.userState ? geoData.userState : null;
}

function getUserCountry() {
    //debugger;
    return !!geoData.userCountry ? geoData.userCountry : null;
}
function getplatform() {
    //debugger;
    //server=1,user=3
    return Platform;
}

function getCategory(adRoot) 
{
    if ($(adRoot).attr('data-fb-intel-ad-type') === 'feed') 
    {
        let adownerimages=null; 
        var myArray = ['AIzaSyAN9CEiGS5M5__TfMXSCpfej31WzUAe9oI', 'AIzaSyCL-bSPgPPCzipoGtQOrVlpcByZ5sUTIR0','AIzaSyCrjOsdXZI0WOEeeEuXYcW_59Lju84awUY','AIzaSyBptwCMcBGoBoNXxdOFKf1RprSz4DvGPHg','AIzaSyDUew7Nr8FVRm-M-zgpwKRKZViooh9Iprw','AIzaSyAPKS6pAEm3GDDIPQ6iJWyD6MrKo7eWWPk', 'AIzaSyATgFNuIFT6L5BMrFWDrkbkYOS8Iy0nTko','AIzaSyAiJyjXaLnBjds1Jk5mStU77ZWIAKTQlo8','AIzaSyBlfWJe7algPMWO8EbYYkiB0kBdqWgVhEo','AIzaSyBqJQHcrwTtJDQtxHQJFyVkgHpFA1JUj3I','AIzaSyD0OVouXWf9PlOX8o3rU3cycU8bKe6YkXE','AIzaSyClmRt3KAZlZL9f8_JHCOQo_UgJmWi-aQs','AIzaSyA5iIWx6x0t3WR9Jp-0tMXKOw3lvZelpnE']; 
        var randKey = myArray[Math.floor(Math.random() * myArray.length)];
        let adPostId=null;
        let adUrl=null;
        adUrl= $(adRoot).find('.ytp-title-link').attr('href');
        adPostId=adUrl+'<a>';
        adPostId = getBetween(adPostId, "https://www.youtube.com/watch?v=", "<a>");
        const categoryUrl = "https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id="+adPostId+"&key="+randKey;
        //console.log(categoryUrl);
        if (adPostId) {
            const reqJson = {
                async: false,
                crossDomain: true,
                url: categoryUrl,
                method: "GET",
                headers: {
                    "content-type": "application/json",
                    "cache-control": "no-cache"
                },
                processData: false
            };
            $.ajax(reqJson).done(function (imgurlpagesource) {
                let likescount=null;
                let dislikecount=null;
                let viewcount=null;
                let commentcount=null;
                let categoryId=null;   
                let description=null;   
                let Title=null;   
                let channelUrl=null;   
                let postdate=null;   
                let Tags=[];  
                let thumbnail=null; 
                let adurl=null; 
                let destURL=null; 
                let adowner=null; 
                $(adRoot).attr('data-fb-intel-newsfeed_description',"");
                $(adRoot).attr('data-fb-intel-call_to_action',"");
                try{
                   var adId=imgurlpagesource.items[0].id;
                   if(adId!="" && typeof adId!='undefined')
                   {
                        adPostId=adId;
                        $(adRoot).attr('data-fb-intel-ad_id',adPostId);
                   }
                   else
                   {
                       $(adRoot).attr('data-fb-intel-ad_id',adPostId);
                   }
                }
                catch(e)
                {
                    //$(adRoot).attr('data-fb-intel-ad_id',adPostId);
                }
                $(adRoot).attr('data-fb-intel-type',"VIDEO");
                try{
                    Title=imgurlpagesource.items[0].snippet.localized.title;
                    if(Title!="" && typeof Title!='undefined')
                    {
                        $(adRoot).attr('data-fb-intel-ad_title',Title);
                    }
                    else
                    {
                        $(adRoot).attr('data-fb-intel-ad_title',"");
                    }
                }
                catch(e)
                {
                    $(adRoot).attr('data-fb-intel-ad_title',"");
                }
                try{
                    adurl="https://www.youtube.com/watch?v="+adPostId;
                    if(adurl!="" && typeof adurl!='undefined')
                    {
                        $(adRoot).attr('data-fb-intel-ad_url',adurl);
                    }
                }
                catch(e)
                {

                }
                try{
                    description=imgurlpagesource.items[0].snippet.localized.description;
                    description=description.replace(/\n/g," ");
                    if(description!="" && typeof description!='undefined')
                    {
                        $(adRoot).attr('data-fb-intel-ad_text',description);
                    }
                    else 
                    {
                        $(adRoot).attr('data-fb-intel-ad_text',"");
                    }
                }
                catch(e)
                {
                    $(adRoot).attr('data-fb-intel-ad_text',"");
                }
          
                try
                {
                    if((description!="" && typeof description!='undefined') && (description.includes("http://")||description.includes("https://")||description.includes("www")))
                    {
                        description=description+' ';
                        if(description.includes("http"))
                        {
                            destURL=getBetween(description,"http"," ");
                            destURL="http"+destURL;
                            if(destURL=="http")
                            {
                                destURL="";
                            }
                        }
                        else if(description.includes("www"))
                        {
                            destURL=getBetween(description,"www"," ");
                            destURL="www"+destURL;
                            if(destURL=="www")
                            {
                                destURL="";
                            }
                        }
                    }
                    else
                    {
                        if($(adRoot).find('.videoAdUiVisitAdvertiserLinkText').length>0)
                        {
                            destURL= $(adRoot).find('.videoAdUiVisitAdvertiserLinkText')[0].innerText;
                            if(destURL.includes("Visit Advertiser"))
                            {
                                destURL="";
                            }
                            else if((destURL!="" && typeof destURL!='undefined') && (!destURL.includes("http://")&&!destURL.includes("https://")&&!destURL.includes("www")))
                            {
                                destURL='http://'+destURL;
                                if(destURL=='http://')
                                {
                                    destURL="";
                                }
                            }
                        }
                     }
                    if(destURL!="" && typeof destURL!='undefined')
                    {
                        $(adRoot).attr('data-fb-intel-destination_url',destURL);
                    }
                    else
                    {
                        $(adRoot).attr('data-fb-intel-destination_url',adurl);
                    }
                }
                catch(e)
                {
                    $(adRoot).attr('data-fb-intel-destination_url',adurl);
                }
                try
                {
                    categoryId=imgurlpagesource.items[0].snippet.categoryId;
                    if(categoryId!="" && typeof categoryId!='undefined')
                    {
                        $(adRoot).attr('data-fb-intel-category',categoryId);
                    }
                    else
                    {
                        $(adRoot).attr('data-fb-intel-category',"0");
                    }
                }
                catch(e)
                {
                    $(adRoot).attr('data-fb-intel-category',"0");
                }
                try
                {
                    channelUrl=imgurlpagesource.items[0].snippet.channelId;
                    var chanelid=channelUrl;
                    channelUrl="https://www.youtube.com/channel/"+channelUrl;
                    if(channelUrl!="" && typeof channelUrl!='undefined')
                    {
                        $(adRoot).attr('data-fb-intel-channel_url',channelUrl);
                        
                        //Check whether postowner present or not in DB
                        const getchannaelstatus =powerAdSpyYTApi+"check-channel-url";
                        var addata = "{\"channel_url\":\"" + channelUrl + "\"}";
                  
                        //console.log(categoryUrl);
                        if (chanelid) {
                            const reqJsonchannel = {
                                async: false,
                                crossDomain: true,
                                url: getchannaelstatus,
                                method: "POST",
                                data:addata,
                                headers: {
                                    "content-type": "application/json",
                                    "cache-control": "no-cache"
                                },
                                processData: false
                            };
                            $.ajax(reqJsonchannel).done(function (apiresponse) 
                            {
                                if(apiresponse["message"]=="Post Owner Exists")
                                {
                                    $(adRoot).attr('data-fb-intel-post_owner_img',apiresponse["data"]["post_owner_image"]);
                                    $(adRoot).attr('data-fb-intel-post_owner',apiresponse["data"]["post_owner_name"]);
                                }
                                else
                                {
                                    var myArray = ['AIzaSyAN9CEiGS5M5__TfMXSCpfej31WzUAe9oI', 'AIzaSyCL-bSPgPPCzipoGtQOrVlpcByZ5sUTIR0','AIzaSyCrjOsdXZI0WOEeeEuXYcW_59Lju84awUY','AIzaSyBptwCMcBGoBoNXxdOFKf1RprSz4DvGPHg','AIzaSyDUew7Nr8FVRm-M-zgpwKRKZViooh9Iprw','AIzaSyAPKS6pAEm3GDDIPQ6iJWyD6MrKo7eWWPk', 'AIzaSyATgFNuIFT6L5BMrFWDrkbkYOS8Iy0nTko','AIzaSyAiJyjXaLnBjds1Jk5mStU77ZWIAKTQlo8','AIzaSyBlfWJe7algPMWO8EbYYkiB0kBdqWgVhEo','AIzaSyBqJQHcrwTtJDQtxHQJFyVkgHpFA1JUj3I','AIzaSyD0OVouXWf9PlOX8o3rU3cycU8bKe6YkXE','AIzaSyClmRt3KAZlZL9f8_JHCOQo_UgJmWi-aQs','AIzaSyA5iIWx6x0t3WR9Jp-0tMXKOw3lvZelpnE']; 
                                    var randKey = myArray[Math.floor(Math.random() * myArray.length)];
                                    const getchanneldetailUrl = "https://www.googleapis.com/youtube/v3/channels?part=snippet&id=" + chanelid + "&key=" + randKey;
                                    const reqJson = {
                                        async: false,
                                        crossDomain: true,
                                        url: getchanneldetailUrl,
                                        method: "GET",
                                        headers: {
                                            "content-type": "application/json",
                                            "cache-control": "no-cache"
                                        },
                                        processData: false
                                    };
                                    $.ajax(reqJson).done(function (channelpagesource) {
                                        try{
                                            var postownerimgurl= channelpagesource["items"][0]["snippet"]["thumbnails"]["default"]["url"];
                                            if(postownerimgurl!="" && typeof postownerimgurl!='undefined')
                                            {
                                                $(adRoot).attr('data-fb-intel-post_owner_img',postownerimgurl);
                                            }
                                            else
                                            {
                                                $(adRoot).attr('data-fb-intel-post_owner_img',"");
                                            }
                                        }
                                        catch(e)
                                        {
                                            //$(adRoot).attr('data-fb-intel-ad_id',adPostId);
                                        }
                                        try{
                                            var postownernamedata= channelpagesource["items"][0]["snippet"]["localized"]["title"];
                                            if(postownernamedata!="" && typeof postownernamedata!='undefined')
                                            {
                                                $(adRoot).attr('data-fb-intel-post_owner',postownernamedata);
                                            }
                                        }
                                        catch(e)
                                        {
                                            //$(adRoot).attr('data-fb-intel-ad_id',adPostId);
                                        }
                                    });
                                }
                              
                            });
                        }
                    }
                    else
                    {
                        $(adRoot).attr('data-fb-intel-channel_url',"");
                    }
                }
                catch(e)
                {
                    $(adRoot).attr('data-fb-intel-channel_url',"");
                }
                try
                {
                    postdate=imgurlpagesource.items[0].snippet.publishedAt;
                    var myDate = Date.parse(postdate)/1000;
                    postdate=parseInt(myDate);
                    if(postdate!="" && typeof postdate!='undefined')
                    {
                        $(adRoot).attr('data-fb-intel-post_date',postdate);
                    }
                    else
                    {
                        $(adRoot).attr('data-fb-intel-post_date',"");
                    }
                }
                catch(e)
                {
                    $(adRoot).attr('data-fb-intel-post_date',"");
                }
                try{
                    Tags=imgurlpagesource.items[0].snippet.tags;
                    if(Tags!="" && typeof Tags!='undefined')
                    {
                        $(adRoot).attr('data-fb-intel-tags',Tags);
                    }
                    else
                    {
                        $(adRoot).attr('data-fb-intel-tags',"");
                    }
                }
                catch(e)
                {
                    $(adRoot).attr('data-fb-intel-tags',"");
                }
                try{
                    thumbnail=imgurlpagesource.items[0].snippet.thumbnails.medium.url;
                    if(thumbnail!="" && typeof thumbnail!='undefined')
                    {
                        $(adRoot).attr('data-fb-intel-thumbnail',thumbnail);
                    }
                    else
                    {
                        $(adRoot).attr('data-fb-intel-thumbnail',"");
                    }
                }
                catch(e)
                {
                    $(adRoot).attr('data-fb-intel-thumbnail',"");
                }
            
               try{
                    likescount = imgurlpagesource.items[0].statistics.likeCount;
                    if(likescount!="" && typeof likescount!='undefined')
                    {
                        $(adRoot).attr('data-fb-intel-likes',likescount);
                    }
                    else
                    {
                        $(adRoot).attr('data-fb-intel-likes',"0");
                    }
                }
                catch(e)
                {
                    $(adRoot).attr('data-fb-intel-likes',"0");
                }
           
                try{
                    dislikecount = imgurlpagesource.items[0].statistics.dislikeCount;
                    if(dislikecount!="" && typeof dislikecount!='undefined')
                    {
                        $(adRoot).attr('data-fb-intel-dislike',dislikecount);
                    }
                    else
                    {
                        $(adRoot).attr('data-fb-intel-dislike',"0");
                    }
                }
                catch(e)
                {
                    $(adRoot).attr('data-fb-intel-dislike',"0");
                }
            
                try{
                    viewcount =imgurlpagesource.items[0].statistics.viewCount;
                    if(viewcount!="" && typeof viewcount!='undefined')
                    {
                        $(adRoot).attr('data-fb-intel-views',viewcount);
                    }
                    else
                    {
                        $(adRoot).attr('data-fb-intel-views',"0");
                    }
                }
                catch(e)
                {
                    $(adRoot).attr('data-fb-intel-views',"0");
                }
           
                try{
                    commentcount =imgurlpagesource.items[0].statistics.commentCount;
                    if(commentcount!="" && typeof commentcount!='undefined')
                    {
                        $(adRoot).attr('data-fb-intel-comment',commentcount);
                    }
                    else
                    {
                        $(adRoot).attr('data-fb-intel-comment',"0");
                    }
                }
                catch(e)
                {
                    $(adRoot).attr('data-fb-intel-comment',"0");
                }
                //document.getElementById('thumbnail').click();
            }).fail(function (error) {
                //if (enableDebugger) //debugger;
            });
        }
    }

    else if ($(adRoot).attr('data-fb-intel-ad-type') === 'side')  // && ($(adRoot).find('div').find('#tooltip').length)>0
    {
       //side ads with multiple video
        if($(adRoot).attr('data-fb-intel-ad-type') === 'side' && ($(adRoot).find('ytd-iframe-companion-renderer').length>0))
        {
            let adownerside2images=null; 
            var check=$(adRoot).find('iframe').attr('src');
            if($(adRoot).find('iframe').attr('src')!="" && typeof check!='undefined')
            {
                var url=$(adRoot).find('iframe').attr('src')
                url=url.replace(/&amp;/g,"&");
                if (url.includes("https://www.youtube.com/ad_companion")) 
                {
                    const reqJson = {
                        async: false,
                        crossDomain: true,
                        url: url,
                        method: "GET",
                        headers: {
                            "content-type": "application/json",
                            "cache-control": "no-cache"
                        },
                        processData: false
                    };
                    $.ajax(reqJson).done(function (imgurlpagesource) {
                        $(adRoot).attr('data-fb-intel-newsfeed_description',"");
                        $(adRoot).attr('data-fb-intel-call_to_action',"");
                        var videocontainer=imgurlpagesource.split('video-wall-thumbs-v2');
                        videocontainer = videocontainer.slice(1, videocontainer.length);
                        var multivideocontainer=videocontainer[0].split('all-thumbs-v2 thumb');
                        multivideocontainer = multivideocontainer.slice(1, multivideocontainer.length);

                        var posownimg=imgurlpagesource.split("video-wall-top-bar-v2");
                        posownimg=posownimg.slice(1,posownimg.length);
                        var postownerimage=getBetween(posownimg[0],"<img class","alt=");
                        adownerside2images=getBetween(postownerimage,"src=\"","\"");
                        if(adownerside2images!="")
                        {
                            $(adRoot).attr('data-fb-intel-post_owner_img',adownerside2images);
                        }

                        var videoid="";
                        var arrvideo="";
                        if(multivideocontainer.length>1)
                        {
                            multivideocontainer.forEach(function (multivideo) {
                                var video=getBetween(multivideo,"href=\"","\"");
                                if(videoid=="")
                                {
                                    videoid=getBetween(video,"/watch?v=","&amp;");
                                }
                                video=video.replace(/&amp;/g,"&");
                                video='https://www.youtube.com'+video;
                                arrvideo=arrvideo+'||'+video;
                            });
                        }
                        else if(multivideocontainer.length==1)
                        {
                            var videoid=getBetween(videocontainer[0],"<a","</a>");
                            videoid=getBetween(videoid,"href=\"/watch?v=","\"");
                            videoid=videoid.replace(/&amp;/g,"&");
                        }
                        if(arrvideo!="")
                        {
                            arrvideo=arrvideo.replace("||","");
                            $(adRoot).attr('data-fb-intel-othermedia',arrvideo);
                        }
                        else
                        {
                            $(adRoot).attr('data-fb-intel-othermedia',"");
                        }
                        $(adRoot).attr('data-fb-intel-type',"VIDEO");
                        getdetailbyvideoid($(adRoot),videoid,imgurlpagesource);

                       
                    });
                }
               
            }
        
        }

        //side ads with only image
        else if($(adRoot).attr('data-fb-intel-ad-type') === 'side' && ($(adRoot).find('ytd-image-companion-renderer').length>0))
        {
            try{
                $(adRoot).attr('data-fb-intel-call_to_action',"");
                $(adRoot).attr('data-fb-intel-newsfeed_description',"");
                var adlink=$(adRoot).find('ytd-image-companion-renderer').find('a')[1].href;
                if(adlink!="" && typeof adlink!='undefined')
                {
                    var addesturl=adlink+'<a>';
                    addesturl=getBetween(addesturl,"adurl=","<a>");
                    if(addesturl!="")
                    {
                        $(adRoot).attr('data-fb-intel-destination_url',addesturl);
                        try{
                            var postowner=decodeURIComponent(decodeURIComponent(addesturl));
                            if(postowner.includes("url="))
                            {
                                postowner=postowner+'<a>';
                                postowner=getBetween(postowner,"url=","<a>");
                                if(postowner.includes("."))
                                {
                                    var trmpurlchek=postowner.replace("www.youtube.com","");
                                    if(!trmpurlchek.includes("www"))
                                    {
                                        trmpurlchek= trmpurlchek.replace('http://','').replace('https://','').split(/[/?#]/)[0]
                                        var tempstr=trmpurlchek.split(".");
                                        if(tempstr.length==2)
                                        {
                                            if(tempstr[0].includes("http"))
                                            {
                                                postowner=tempstr[0].replace("https://","").replace("http://","").replace("www","");
                                            }
                                            else
                                            {
                                                postowner=tempstr[0];
                                            }
                                        }
                                        else
                                        {
                                            tempstr[0]=tempstr[0].replace("https://","").replace("http://","").replace("www","");
                                            tempstr[1]=tempstr[1].replace("https://","").replace("http://","").replace("www","");
                                            if( tempstr[0].length> tempstr[1].length)
                                            {
                                                postowner=tempstr[0];
                                            }
                                            else
                                            {
                                                postowner=tempstr[1];
                                            }
                                        }
                                    }
                                    else
                                    {
                                        var tempstr=postowner.split(".");
                                        if(tempstr.length>2)
                                        {
                                            tempstr[0]=tempstr[0].replace("https://","").replace("http://","").replace("www","");
                                            tempstr[1]=tempstr[1].replace("https://","").replace("http://","").replace("www","");
                                            if( tempstr[0].length> tempstr[1].length)
                                            {
                                                postowner=tempstr[0];
                                            }
                                            else
                                            {
                                                postowner=tempstr[1];
                                            }
                                        }
                                        else if(tempstr.length==2)
                                        {
                                            if(tempstr[0].includes("http"))
                                            {
                                                postowner=tempstr[0].replace("https://","").replace("http://","").replace("www","");
                                            }
                                            else
                                            {
                                                postowner=tempstr[0];
                                            }
                                        }
                                      
                                    }
                                   
                                }
                                if(postowner!="" && typeof postowner!='undefined')
                                {
                                    $(adRoot).attr('data-fb-intel-post_owner',postowner);
                                }
                            }
                            else
                            {
                                //postowner = postowner.replace('https://','').replace('http://','').replace('www.','');
                                if(postowner.includes("."))
                                {
                                    var trmpurlchek=postowner.replace("www.youtube.com","");
                                    if(!trmpurlchek.includes("www"))
                                    {
                                        trmpurlchek= trmpurlchek.replace('http://','').replace('https://','').split(/[/?#]/)[0]
                                        var tempstr=trmpurlchek.split(".");
                                        if(tempstr.length==2)
                                        {
                                            if(tempstr[0].includes("http"))
                                            {
                                                postowner=tempstr[0].replace("https://","").replace("http://","").replace("www","");
                                            }
                                            else
                                            {
                                                postowner=tempstr[1];
                                            }
                                        }
                                        else
                                        {
                                            tempstr[0]=tempstr[0].replace("https://","").replace("http://","").replace("www","");
                                            tempstr[1]=tempstr[1].replace("https://","").replace("http://","").replace("www","");
                                            if( tempstr[0].length> tempstr[1].length)
                                            {
                                                postowner=tempstr[0];
                                            }
                                            else
                                            {
                                                postowner=tempstr[1];
                                            }
                                        }
                                    }
                                    else
                                    {
                                        var tempstr=postowner.split(".");
                                        if(tempstr.length>2)
                                        {
                                            tempstr[0]=tempstr[0].replace("https://","").replace("http://","").replace("www","");
                                            tempstr[1]=tempstr[1].replace("https://","").replace("http://","").replace("www","");
                                            if( tempstr[0].length> tempstr[1].length)
                                            {
                                                postowner=tempstr[0];
                                            }
                                            else
                                            {
                                                postowner=tempstr[1];
                                            }
                                        }
                                        else if(tempstr.length==2)
                                        {
                                            if(tempstr[0].includes("http"))
                                            {
                                                postowner=tempstr[0].replace("https://","").replace("http://","").replace("www","");
                                            }
                                            else
                                            {
                                                postowner=tempstr[0];
                                            }
                                        }
                                       
                                    }
                                   
                                }
                                if(postowner!="" && typeof postowner!='undefined')
                                {
                                    $(adRoot).attr('data-fb-intel-post_owner',postowner);
                                }
                            }
                           
                        }
                        catch(e)
                        {
                
                        }
                    }
                    else
                    {
                        $(adRoot).attr('data-fb-intel-destination_url',adlink);
                    }
                }
            }
            catch(e)
            {
                
            }
            try{
                var adimage=$(adRoot).find('ytd-image-companion-renderer').find('img')[0].currentSrc;
                if(adimage!="" && typeof adimage!='undefined')
                {
                    $(adRoot).attr('data-fb-intel-ad_url',adimage);
                    $(adRoot).attr('data-fb-intel-type',"IMAGE");
                    var str=hashCode(adimage);
                    if(str!="")
                    {
                        $(adRoot).attr('data-fb-intel-ad_id',str);
                    }
                }
            }
            catch(e)
            {
                
            }
                try{
                    const d = new Date();
                    var myDate =d.getTime()
                    myDate = myDate/1000;
                    var postd= parseInt(myDate);
                    $(adRoot).attr('data-fb-intel-post_date',postd);
                }
                catch(e)
                {
                
                }
                add_remaining_parameters_for_imageonly($(adRoot));
        }

        //side ads with inside iframe

            //if($(adRoot).find('#google_companion_ad_div').length>0)
            //{
            //    //debugger;
            //    var test=document.getElementById('google_companion_ad_div');
            //    console.log(test);
            //    if(document.getElementById('google_center_div')!=null)
            //    {
            //        var iframeadsdata= document.getElementById('google_ads_frame1').contentWindow.document.body.innerHTML;
            //        try{
            //            var adlink=getBetween(iframeadsdata,"href=\"","\"");
            //            if(adlink!="" && typeof adlink!='undefined')
            //            {
            //                $(adRoot).attr('data-fb-intel-destination_url',adlink);
            //            }
            //        }
            //        catch(e)
            //        {
                
            //        }
            //        try{
            //            var adimage=getBetween(iframeadsdata,"<img src=\"","\'")
            //            if(adimage!="" && typeof adimage!='undefined')
            //            {
            //                $(adRoot).attr('data-fb-intel-ad_url',adimage);
            //            }
            //        }
            //        catch(e)
            //        {
                
            //        }
            //        adremainingparameters($(adRoot));
            //    }
            //}


         //side ads with without ad id
        else if($(adRoot).attr('data-fb-intel-ad-type') === 'side' && ($(adRoot).find('ytd-companion-slot-renderer').length>0))
        {
            let adownersideimages=null; 
            var tempimg="";
            try{
                var adimage=$(adRoot).find('#banner').find('img').attr('src');
                if(adimage!="" && typeof adimage!='undefined')
                {
                    tempimg= adimage;
                    $(adRoot).attr('data-fb-intel-ad_url',adimage);
                    $(adRoot).attr('data-fb-intel-type',"IMAGE");
                    var str=hashCode(adimage);
                    if(str!="")
                    {
                        $(adRoot).attr('data-fb-intel-ad_id',str);
                    }
                }
            }
            catch(e)
            {
                
            }
            if(adimage!="" && typeof adimage!='undefined')
            {
                try{
                    adownersideimages=$(adRoot).find('#icon').find('img').attr('src');
                    if(adownersideimages!="" && typeof adownersideimages!='undefined')
                    {
                        $(adRoot).attr('data-fb-intel-post_owner_img',adownersideimages);
                    }
                }
                catch(e)
                {
                
                }
                try{
                    var adtitle=$(adRoot).find('#header')[0].innerText;
                    if(adtitle!="" && typeof adtitle!='undefined')
                    {
                        $(adRoot).attr('data-fb-intel-ad_title',adtitle);
                    }
                }
                catch(e)
                {
                
                }
                try{
                    var desturl=$(adRoot).find('a')[1].href;
                    if(desturl!="" && typeof desturl!='undefined')
                    {
                        var addesturl=desturl+'<a>';
                        addesturl=getBetween(addesturl,"adurl=","<a>");
                        if(addesturl!="" && typeof addesturl!='undefined')
                        {
                            $(adRoot).attr('data-fb-intel-destination_url',addesturl);
                        }
                        else
                        {
                            desturl=$(adRoot).find('#domain')[0].innerText;
                            if(desturl!="" && typeof desturl!='undefined')
                            {
                                $(adRoot).attr('data-fb-intel-destination_url',desturl);
                            }
                        }
                    }
                    else
                    {
                        desturl=$(adRoot).find('#domain')[0].innerText;
                        if(desturl!="" && typeof desturl!='undefined')
                        {
                            $(adRoot).attr('data-fb-intel-destination_url',desturl);
                        }
                    }
                    
                }
                catch(e)
                {
                
                }
                try{
                    var postowner=$(adRoot).find('#domain')[0].innerText;
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
                                postowner=tempstr[0];
                            }
                            else
                            {
                                postowner=tempstr[1];
                            }
                        }
                        else if(tempstr.length==2)
                        {
                            if(tempstr[0].includes("http"))
                            {
                                postowner=tempstr[0].replace("https://","").replace("http://","").replace("www","");
                            }
                            else
                            {
                                postowner=tempstr[0];
                            }
                        }
                       
                    }
                    
                    if(postowner!="" && typeof postowner!='undefined')
                    {
                        $(adRoot).attr('data-fb-intel-post_owner',postowner);
                    }
                }
                catch(e)
                {
                
                }
                try{
                    const d = new Date();
                    var myDate =d.getTime()
                    myDate = myDate/1000;
                    var postd= parseInt(myDate);
                    $(adRoot).attr('data-fb-intel-post_date',postd);
                }
                catch(e)
                {
                
                }
                try{
                    var calltoaction=$(adRoot).find('#action')[0].innerText;
                    if(calltoaction!="" && typeof calltoaction!='undefined')
                    {
                        calltoaction=calltoaction.replace("\n","");
                        console.log("Call_to_action "+calltoaction)
                        $(adRoot).attr('data-fb-intel-call_to_action',calltoaction);
                    }
                }
                catch(e)
                {
                
                }
                try{
                    var addescrption=$(adRoot).find('#domain')[0].innerText;
                    if(addescrption!="" && typeof addescrption!='undefined')
                    {
                        $(adRoot).attr('data-fb-intel-newsfeed_description',addescrption);
                    }
                    else
                    {
                        $(adRoot).attr('data-fb-intel-newsfeed_description',"");
                    }
                }
                catch(e)
                {
                
                }
                add_remaining_parameters_withoutadid($(adRoot));
            }
        }
    }
    
    else if($(adRoot).attr('data-fb-intel-ad-type') === 'middle')
    {   
        //Get hostname from string URL
        //var url = 'hub.kentrelianceforintermediaries.co.uk';
        //var hostname = (new URL(url)).hostname;
        //console.log(hostname)

        //Get max length string value
        //var arr = ['first item', 'second item is longer than the third one', 
        //   'third longish item','second item is longer than the third one sssssssssssssss'];

        //var lgth = 0;
        //var longest;

        //for(var i=0; i < arr.length; i++){
        //    if(arr[i].length > lgth){
        //        var lgth = arr[i].length;
        //        longest = arr[i];
        //    }      
        //} 

        //alert(longest);
        //ads from main player only image ads called middle ads
       if($(adRoot).attr('data-fb-intel-ad-type') === 'middle' && ($(adRoot).find('.image-container').length>0))
        {
            try{
                $(adRoot).attr('data-fb-intel-newsfeed_description',"");
                $(adRoot).attr('data-fb-intel-call_to_action',"");
                var adlink=$(adRoot).find('.adDisplay').find('a').attr('href');
                if(adlink!="" && typeof adlink!='undefined')
                {
                    var addesturl=adlink+'<a>';
                    addesturl=getBetween(addesturl,"adurl=","<a>");
                    if(addesturl!="")
                    {
                        $(adRoot).attr('data-fb-intel-destination_url',addesturl);
                        try{
                            var postowner=decodeURIComponent(decodeURIComponent(addesturl));
                            if(postowner.includes("url="))
                            {
                                postowner=postowner+'<a>';
                                postowner=getBetween(postowner,"url=","<a>");
                                //postowner = postowner.replace('https://','').replace('http://','').replace('www.','');
                                if(postowner.includes("."))
                                {
                                    var trmpurlchek=postowner.replace("www.youtube.com","");
                                    if(!trmpurlchek.includes("www"))
                                    {
                                        trmpurlchek= trmpurlchek.replace('http://','').replace('https://','').split(/[/?#]/)[0]
                                        var tempstr=trmpurlchek.split(".");
                                        if(tempstr.length==2)
                                        {
                                            if(tempstr[0].includes("http"))
                                            {
                                                postowner=tempstr[0].replace("https://","").replace("http://","").replace("www","");
                                            }
                                            else
                                            {
                                                postowner=tempstr[0];
                                            }
                                        }
                                        else
                                        {
                                            tempstr[0]=tempstr[0].replace("https://","").replace("http://","").replace("www","");
                                            tempstr[1]=tempstr[1].replace("https://","").replace("http://","").replace("www","");
                                            if( tempstr[0].length> tempstr[1].length)
                                            {
                                                postowner=tempstr[0];
                                            }
                                            else
                                            {
                                                postowner=tempstr[1];
                                            }
                                        }
                                    }
                                    else
                                    {
                                        var tempstr=postowner.split(".");
                                        if(tempstr.length>2)
                                        {
                                            tempstr[0]=tempstr[0].replace("https://","").replace("http://","").replace("www","");
                                            tempstr[1]=tempstr[1].replace("https://","").replace("http://","").replace("www","");
                                            if( tempstr[0].length> tempstr[1].length)
                                            {
                                                postowner=tempstr[0];
                                            }
                                            else
                                            {
                                                postowner=tempstr[1];
                                            }
                                        }
                                        else if(tempstr.length==2)
                                        {
                                            if(tempstr[0].includes("http"))
                                            {
                                                postowner=tempstr[0].replace("https://","").replace("http://","").replace("www","");
                                            }
                                            else
                                            {
                                                postowner=tempstr[0];
                                            }
                                        }
                                       
                                    }
                                   
                                }
                                if(postowner!="" && typeof postowner!='undefined')
                                {
                                    $(adRoot).attr('data-fb-intel-post_owner',postowner);
                                }
                            }
                            else
                            {
                                //postowner = postowner.replace('https://','').replace('http://','').replace('www.','');
                                if(postowner.includes("."))
                                {
                                    var trmpurlchek=postowner.replace("www.youtube.com","");
                                    if(!trmpurlchek.includes("www"))
                                    {
                                        trmpurlchek= trmpurlchek.replace('http://','').replace('https://','').split(/[/?#]/)[0]
                                        var tempstr=trmpurlchek.split(".");
                                        if(tempstr.length==2)
                                        {
                                            if(tempstr[0].includes("http"))
                                            {
                                                postowner=tempstr[0].replace("https://","").replace("http://","").replace("www","");
                                            }
                                            else
                                            {
                                                postowner=tempstr[0];
                                            }
                                        }
                                        else
                                        {
                                            tempstr[0]=tempstr[0].replace("https://","").replace("http://","").replace("www","");
                                            tempstr[1]=tempstr[1].replace("https://","").replace("http://","").replace("www","");
                                            if( tempstr[0].length> tempstr[1].length)
                                            {
                                                postowner=tempstr[0];
                                            }
                                            else
                                            {
                                                postowner=tempstr[1];
                                            }
                                        }
                                        
                                    }
                                    else
                                    {
                                        var tempstr=postowner.split(".");
                                        if(tempstr.length>2)
                                        {
                                            tempstr[0]=tempstr[0].replace("https://","").replace("http://","").replace("www","");
                                            tempstr[1]=tempstr[1].replace("https://","").replace("http://","").replace("www","");
                                            if( tempstr[0].length> tempstr[1].length)
                                            {
                                                postowner=tempstr[0];
                                            }
                                            else
                                            {
                                                postowner=tempstr[1];
                                            }
                                        }
                                        else if(tempstr.length==2)
                                        {
                                            if(tempstr[0].includes("http"))
                                            {
                                                postowner=tempstr[0].replace("https://","").replace("http://","").replace("www","");
                                            }
                                            else
                                            {
                                                postowner=tempstr[0];
                                            }
                                        }
                                    }
                                   
                                }
                                if(postowner!="" && typeof postowner!='undefined')
                                {
                                    $(adRoot).attr('data-fb-intel-post_owner',postowner);
                                }
                            }
                           
                        }
                        catch(e)
                        {
                
                        }
                    }
                    else
                    {
                        $(adRoot).attr('data-fb-intel-destination_url',adlink);
                    }
                }
            }
            catch(e)
            {
                
            }
            try{
                var adimage=$(adRoot).find('.adDisplay').find('img')[0].currentSrc;
                if(adimage!="" && typeof adimage!='undefined')
                {
                    $(adRoot).attr('data-fb-intel-ad_url',adimage);
                    $(adRoot).attr('data-fb-intel-type',"IMAGE");
                    var str=hashCode(adimage);
                    if(str!="")
                    {
                        $(adRoot).attr('data-fb-intel-ad_id',str);
                    }
                    //var str1=hashCode("https://pagead2.googlesyndication.com/pagead/imgad?id=CICAgKDrjaSCIBDUAxg8Mgj9FV5VIV5zeA");
                    //var str1=hashCode("https://pagead2.googlesyndication.com/pagead/imgad?id=CICAgKCbruKyNhDUAxg8MghNi3S5zrlYfw");
                    //var str1=hashCode("https://pagead2.googlesyndication.com/pagead/imgad?id=CICAgKCbieDhRRDUAxg8MgiA2jLdV02E7Q");
                    //console.log(str1);
                }
            }
            catch(e)
            {
                
            }
            try{
                const d = new Date();
                var myDate =d.getTime()
                myDate = myDate/1000;
                var postd= parseInt(myDate);
                $(adRoot).attr('data-fb-intel-post_date',postd);
            }
            catch(e)
            {
                
            }
            add_remaining_parameters_for_imageonly($(adRoot));
        }
            //Main player Middle ads Only Text type ads
        else if($(adRoot).attr('data-fb-intel-ad-type') === 'middle' && ($(adRoot).find('.text-container').length>0))
        {
            var adurlid="";
            $(adRoot).attr('data-fb-intel-call_to_action',"");
            try{
                var adlink=$(adRoot).find('.text-title').attr('href');
                if(adlink!="" && typeof adlink!='undefined')
                {
                    var addesturl=adlink+'<a>';
                    addesturl=getBetween(addesturl,"adurl=","<a>");
                    if(addesturl!="")
                    {
                        $(adRoot).attr('data-fb-intel-destination_url',addesturl);
                    }
                    else
                    {
                        $(adRoot).attr('data-fb-intel-destination_url',adlink);
                    }
                }
            }
            catch(e)
            {
                
            }
            try{
                var adtitle=$(adRoot).find('.text-title')[0].innerText;
                if(adtitle!="" && typeof adtitle!='undefined')
                {
                    $(adRoot).attr('data-fb-intel-ad_title',adtitle);
                    $(adRoot).attr('data-fb-intel-type',"TEXT");
                    var str=hashCode(adtitle);
                    if(str!="")
                    {
                        adurlid=str;
                        $(adRoot).attr('data-fb-intel-ad_id',str);
                    }
                }
            }
            catch(e)
            {
                
            }
            try{
                var adtext=$(adRoot).find('.text-description')[0].innerText;
                if(adtext!="" && typeof adtext!='undefined')
                {
                    $(adRoot).attr('data-fb-intel-ad_text',adtext);
                }
            }
            catch(e)
            {
                
            }
            try{
                var addescrption=$(adRoot).find('.text-ad-channel')[0].innerText;
                if(addescrption!="" && typeof addescrption!='undefined')
                {
                    $(adRoot).attr('data-fb-intel-newsfeed_description',addescrption);
                    if(!addescrption.includes("http"))
                    {
                        var adurl='https://'+addescrption+"/"+adurlid;
                        $(adRoot).attr('data-fb-intel-ad_url',adurl);
                    }
                    else
                    {
                        var adurl=addescrption+"/"+adurlid;
                        $(adRoot).attr('data-fb-intel-ad_url',adurl);
                    }

                    var postowner =addescrption;
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
                                postowner=tempstr[0];
                            }
                            else
                            {
                                postowner=tempstr[1];
                            }
                        }
                        else if(tempstr.length==2)
                        {
                            if(tempstr[0].includes("http"))
                            {
                                postowner=tempstr[0].replace("https://","").replace("http://","").replace("www","");
                            }
                            else
                            {
                                postowner=tempstr[0];
                            }
                            
                        }
                    }
                    if(postowner!="" && typeof postowner!='undefined')
                    {
                        $(adRoot).attr('data-fb-intel-post_owner',postowner);
                    }
                }
                else
                {
                    $(adRoot).attr('data-fb-intel-newsfeed_description',"");
                }
            }
            catch(e)
            {
                
            }
            try{
                const d = new Date();
                var myDate =d.getTime()
                myDate = myDate/1000;
                var postd= parseInt(myDate);
                $(adRoot).attr('data-fb-intel-post_date',postd);
            }
            catch(e)
            {
                
            }
            add_remaining_parameters_for_Textonly($(adRoot));
         }
        
    }
    return null;
}

function getOwner(adRoot) {
    let owner = null;
    if ($(adRoot).attr('data-fb-intel-ad-type') === 'feed') {
        return null;
      } 
    else if ($(adRoot).attr('data-fb-intel-ad-type') === 'side')
    {
        return null;
    }
    else if ($(adRoot).attr('data-fb-intel-ad-type') === 'middle')
    {
        return null;
    }
    return null;
}

function getdescription(adRoot) {
    let description = null;
    if ($(adRoot).attr('data-fb-intel-ad-type') === 'feed') {
        return null;
    } 
    else if ($(adRoot).attr('data-fb-intel-ad-type') === 'side')
    {
        return null;
    }
    else if ($(adRoot).attr('data-fb-intel-ad-type') === 'middle')
    {
        return null;
    }
    return null;
}

function getcall_to_action(adRoot) {
    let calltoaction = null;
    if ($(adRoot).attr('data-fb-intel-ad-type') === 'feed') {
        return null;
    } 
    else if ($(adRoot).attr('data-fb-intel-ad-type') === 'side')
    {
        return null;
    }
    else if ($(adRoot).attr('data-fb-intel-ad-type') === 'middle')
    {
        return null;
    }
    return null;
}

function getothermedia(adRoot) {
    let othermedia = null;
    if ($(adRoot).attr('data-fb-intel-ad-type') === 'feed') {
        return "";
    } 
    else if ($(adRoot).attr('data-fb-intel-ad-type') === 'side')
    {
        return null;
    }
    else if ($(adRoot).attr('data-fb-intel-ad-type') === 'middle')
    {
        return null;
    }
   // return null;;
}

function getPostOwnerImage(adRoot) {
    let postownerimgs = null;
    if ($(adRoot).attr('data-fb-intel-ad-type') === 'feed') 
    {
        return null;
    }  
    else if ($(adRoot).attr('data-fb-intel-ad-type') === 'side')
    {
        return null;
    }
    else if ($(adRoot).attr('data-fb-intel-ad-type') === 'middle')
    {
        return null;
    }
    return null;
}

function getchannnelurl(adRoot) {
    let channelurl = null;
    if ($(adRoot).attr('data-fb-intel-ad-type') === 'feed') {
        return null;
      
    }  else if ($(adRoot).attr('data-fb-intel-ad-type') === 'side')
    {
        return null;
    }
    else if ($(adRoot).attr('data-fb-intel-ad-type') === 'middle')
    {
        return null;
    }
}

function getPosition(adRoot) {
    if ($(adRoot).attr('data-fb-intel-ad-type') === 'feed') {
        return "FEED";
    } else if ($(adRoot).attr('data-fb-intel-ad-type') === 'side')
    {
        return "SIDE";
    }
    else if ($(adRoot).attr('data-fb-intel-ad-type') === 'middle')
    {
        return "FEED";
    }
}
function getpost_date(adRoot) {
    if ($(adRoot).attr('data-fb-intel-ad-type') === 'feed') {
        return null;
    } else if ($(adRoot).attr('data-fb-intel-ad-type') === 'side')
    {
        return null;
    }
    else if ($(adRoot).attr('data-fb-intel-ad-type') === 'middle')
    {
        return null;
    }
}
function gettype (adRoot) {
    if ($(adRoot).attr('data-fb-intel-ad-type') === 'feed') {
        return null;
    } else if ($(adRoot).attr('data-fb-intel-ad-type') === 'side')
    {
        return null;
    }
    else if ($(adRoot).attr('data-fb-intel-ad-type') === 'middle')
    {
        return null;
    }
}
function getTags(adRoot) {
    if ($(adRoot).attr('data-fb-intel-ad-type') === 'feed') {
        return null;
    } else if ($(adRoot).attr('data-fb-intel-ad-type') === 'side')
    {
        return null;
    }
    else if ($(adRoot).attr('data-fb-intel-ad-type') === 'middle')
    {
        return null;
    }
}
function getthumbnail(adRoot) {
    if ($(adRoot).attr('data-fb-intel-ad-type') === 'feed') {
        return null;
    } else if ($(adRoot).attr('data-fb-intel-ad-type') === 'side')
    {
        return null;
    }
    else if ($(adRoot).attr('data-fb-intel-ad-type') === 'middle')
    {
        return null;
    }
}
function getAdText(adRoot) {
    //if (enableDebugger) //debugger;
    if ($(adRoot).attr('data-fb-intel-ad-type') === 'feed') {
        return null;
    }  else if ($(adRoot).attr('data-fb-intel-ad-type') === 'side')
    {
        return null;
    }
    else if ($(adRoot).attr('data-fb-intel-ad-type') === 'middle')
    {
        return null;
    }
    
}
function getLikesCount(adRoot) {
    //if (enableDebugger) //debugger;
    if ($(adRoot).attr('data-fb-intel-ad-type') === 'feed') {
        return null;
    }  else if ($(adRoot).attr('data-fb-intel-ad-type') === 'side')
    {
        return null;
    }
    else if ($(adRoot).attr('data-fb-intel-ad-type') === 'middle')
    {
        return null;
    }
    
}
function getdislikeCount(adRoot) {
    //if (enableDebugger) //debugger;
    if ($(adRoot).attr('data-fb-intel-ad-type') === 'feed') {
        return null;
    }  else if ($(adRoot).attr('data-fb-intel-ad-type') === 'side')
    {
        return null;
    }
    else if ($(adRoot).attr('data-fb-intel-ad-type') === 'middle')
    {
        return null;
    }
    
}
function getviewsCount(adRoot) {
    //if (enableDebugger) //debugger;
    if ($(adRoot).attr('data-fb-intel-ad-type') === 'feed') {
        return null;
    }  else if ($(adRoot).attr('data-fb-intel-ad-type') === 'side')
    {
        return null;
    }
    else if ($(adRoot).attr('data-fb-intel-ad-type') === 'middle')
    {
        return null;
    }
    
}
function getCommentsCount(adRoot) {
     if ($(adRoot).attr('data-fb-intel-ad-type') === 'feed') {
         return null;
     } else if ($(adRoot).attr('data-fb-intel-ad-type') === 'side')
     {
         return null;
     }
     else if ($(adRoot).attr('data-fb-intel-ad-type') === 'middle')
     {
         return null;
     }
}

function getDestinationUrl(adRoot)
{
    if ($(adRoot).attr('data-fb-intel-ad-type') === 'feed') 
    {
       return null;
    } else if ($(adRoot).attr('data-fb-intel-ad-type') === 'side')
    {
        return null;
    }
    else if ($(adRoot).attr('data-fb-intel-ad-type') === 'middle')
    {
        return null;
    }
 }

function getTitle(adRoot) {
    if ($(adRoot).attr('data-fb-intel-ad-type') === 'feed') {
        return null;
    } else if ($(adRoot).attr('data-fb-intel-ad-type') === 'side')
    {
        return null;
    }
    else if ($(adRoot).attr('data-fb-intel-ad-type') === 'middle')
    {
        return null;
    }
}

function getAdId(adRoot) 
{
    if ($(adRoot).attr('data-fb-intel-ad-type') === 'feed') {
       return null
    }  else if ($(adRoot).attr('data-fb-intel-ad-type') === 'side')
    {
        return null;
    }
    else if ($(adRoot).attr('data-fb-intel-ad-type') === 'middle')
    {
        return "123";
    }
}

function getAdUrl(adRoot) {
    if ($(adRoot).attr('data-fb-intel-ad-type') === 'feed') {
        return null;
    }  else if ($(adRoot).attr('data-fb-intel-ad-type') === 'side')
    {
        return null;
    }
    else if ($(adRoot).attr('data-fb-intel-ad-type') === 'middle')
    {
        return null;
    }
}

function getFirstSeen() {
    //debugger;
    const d = new Date();
    var myDate =d.getTime()
    myDate = myDate/1000;
    return parseInt(myDate);
    //return new Date();
}

function getLastSeen() {
    //debugger;
    const d = new Date();
    var myDate =d.getTime()
    myDate = myDate/1000;
    return parseInt(myDate);
    //return new Date();
}
function getLowerAdAge() {
    //debugger;
    //return birthday.toString();
    return "18";
}

function getUpperAdAge() {
    //debugger;
    return "65";
}
function getLinkedInId() {
    //debugger;
    return user_ID;
}

function getUserData() {
    let data = document.getElementsByTagName("html")[0].innerHTML;
    var tempUserId = data.split("publicIdentifier");
    user_ID=tempUserId[1];
    user_ID = getBetween(user_ID, ":\"", "\",");

}
function buildUpGeoData() {
    if (!geoData.userIP || !geoData.userCity || !geoData.userState || !geoData.userCountry) {
        if (!geoData.userIP) {
            // if (enableDebugger) //debugger;
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
            // if (enableDebugger) //debugger;
            geoData.serviceId = (geoData.serviceId + 1) % geoFunctions.length;
            geoFunctions[geoData.serviceId].call(null, geoData.userIP);
        }
    }
}

function getdetailbyvideoid(adRoot, videoid, imgurlpages)
    {
            var myArray = ['AIzaSyAN9CEiGS5M5__TfMXSCpfej31WzUAe9oI', 'AIzaSyAPKS6pAEm3GDDIPQ6iJWyD6MrKo7eWWPk', 'AIzaSyATgFNuIFT6L5BMrFWDrkbkYOS8Iy0nTko','AIzaSyAiJyjXaLnBjds1Jk5mStU77ZWIAKTQlo8','AIzaSyBlfWJe7algPMWO8EbYYkiB0kBdqWgVhEo']; 
            var randKey = myArray[Math.floor(Math.random() * myArray.length)];
            let adPostId=videoid;
            let adUrl=null;
            const categoryUrl = "https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id="+videoid+"&key="+randKey;
            //console.log(categoryUrl);
            if (adPostId) {
                const reqJson = {
                    async: false,
                    crossDomain: true,
                    url: categoryUrl,
                    method: "GET",
                    headers: {
                        "content-type": "application/json",
                        "cache-control": "no-cache"
                    },
                    processData: false
                };
                $.ajax(reqJson).done(function (imgurlpagesource) {
                    let likescount=null;
                    let dislikecount=null;
                    let viewcount=null;
                    let commentcount=null;
                    let categoryId=null;   
                    let description=null;   
                    let Title=null;   
                    let channelUrl=null;   
                    let postdate=null;   
                    let Tags=[];  
                    let thumbnail=null; 
                    let adurl=null; 
                    let destURL=null; 
                    let postowner=null; 
           
                    try{
                        var adId=imgurlpagesource.items[0].id;
                        if(adId!="" && typeof adId!='undefined')
                        {
                            adPostId=adId;
                            $(adRoot).attr('data-fb-intel-ad_id',adPostId);
                        }
                        else
                        {
                            $(adRoot).attr('data-fb-intel-ad_id',adPostId);
                        }
                    }
                    catch(e)
                    {
                        //$(adRoot).attr('data-fb-intel-ad_id',adPostId);
                    }
                    try{
                        postowner=imgurlpagesource.items[0].snippet.channelTitle;
                        if(postowner!="" && typeof Title!='undefined')
                        {
                            $(adRoot).attr('data-fb-intel-post_owner',postowner);
                        }
                    }
                    catch(e)
                    {
                       // $(adRoot).attr('data-fb-intel-ad_title',"");
                    }
                    try{
                        Title=imgurlpagesource.items[0].snippet.localized.title;
                        if(Title!="" && typeof Title!='undefined')
                        {
                            $(adRoot).attr('data-fb-intel-ad_title',Title);
                        }
                        else
                        {
                            $(adRoot).attr('data-fb-intel-ad_title',"");
                        }
                    }
                    catch(e)
                    {
                        $(adRoot).attr('data-fb-intel-ad_title',"");
                    }
                    try{
                        adurl="https://www.youtube.com/watch?v="+adPostId;
                        if(adurl!="" && typeof adurl!='undefined')
                        {
                            $(adRoot).attr('data-fb-intel-ad_url',adurl);
                        }
                    }
                    catch(e)
                    {

                    }
                    try{
                        description=imgurlpagesource.items[0].snippet.localized.description;
                        description=description.replace(/\n/g," ");
                        if(description!="" && typeof description!='undefined')
                        {
                            $(adRoot).attr('data-fb-intel-ad_text',description);
                        }
                        else 
                        {
                            $(adRoot).attr('data-fb-intel-ad_text',"");
                        }
                    }
                    catch(e)
                    {
                        $(adRoot).attr('data-fb-intel-ad_text',"");
                    }
          
                    try
                    {
                        if((description!="" && typeof description!='undefined') && (description.includes("http://")||description.includes("https://")||description.includes("www")))
                        {
                            description=description+' ';
                            if(description.includes("http"))
                            {
                                destURL=getBetween(description,"http"," ");
                                destURL="http"+destURL;
                                if(destURL=="http")
                                {
                                    destURL="";
                                }
                            }
                            else if(description.includes("www"))
                            {
                                destURL=getBetween(description,"www"," ");
                                destURL="www"+destURL;
                                if(destURL=="www")
                                {
                                    destURL="";
                                }
                            }
                        }
                        else
                        {
                            var AdLink=imgurlpages.split('video-wall-cta-container');
                            AdLink = AdLink.slice(1, AdLink.length);
                            destURL=getBetween(AdLink[0],"<a","</a>");
                            destURL=getBetween(destURL,"href=\"","\"");
                            if(destURL!="")
                            {
                                $(adRoot).attr('data-fb-intel-destination_url',destURL);
                            }
                            else
                            {
                                $(adRoot).attr('data-fb-intel-destination_url',adurl);
                            }
                        }
                        if(destURL!="" && typeof destURL!='undefined')
                        {
                            $(adRoot).attr('data-fb-intel-destination_url',destURL);
                        }
                        else
                        {
                            $(adRoot).attr('data-fb-intel-destination_url',adurl);
                        }
                    }
                    catch(e)
                    {
                        $(adRoot).attr('data-fb-intel-destination_url',adurl);
                    }
                    try
                    {
                        categoryId=imgurlpagesource.items[0].snippet.categoryId;
                        if(categoryId!="" && typeof categoryId!='undefined')
                        {
                            $(adRoot).attr('data-fb-intel-category',categoryId);
                        }
                        else
                        {
                            $(adRoot).attr('data-fb-intel-category',"0");
                        }
                    }
                    catch(e)
                    {
                        $(adRoot).attr('data-fb-intel-category',"0");
                    }
                    try
                    {
                        channelUrl=imgurlpagesource.items[0].snippet.channelId;
                        channelUrl="https://www.youtube.com/channel/"+channelUrl;
                        if(channelUrl!="" && typeof channelUrl!='undefined')
                        {
                            $(adRoot).attr('data-fb-intel-channel_url',channelUrl);
                        }
                        else
                        {
                            $(adRoot).attr('data-fb-intel-channel_url',"");
                        }
                    }
                    catch(e)
                    {
                        $(adRoot).attr('data-fb-intel-channel_url',"");
                    }
                    try
                    {
                        postdate=imgurlpagesource.items[0].snippet.publishedAt;
                        var myDate = Date.parse(postdate)/1000;
                        ///postdate=parseInt(myDate);
                        if(postdate!="" && typeof postdate!='undefined')
                        {
                            $(adRoot).attr('data-fb-intel-post_date',parseInt(myDate));
                        }
                        else
                        {
                            $(adRoot).attr('data-fb-intel-post_date',"");
                        }
                    }
                    catch(e)
                    {
                        $(adRoot).attr('data-fb-intel-post_date',"");
                    }
                    try{
                        Tags=imgurlpagesource.items[0].snippet.tags;
                        if(Tags!="" && typeof Tags!='undefined')
                        {
                            $(adRoot).attr('data-fb-intel-tags',Tags);
                        }
                        else
                        {
                            $(adRoot).attr('data-fb-intel-tags',"");
                        }
                    }
                    catch(e)
                    {
                        $(adRoot).attr('data-fb-intel-tags',"");
                    }
                    try{
                        thumbnail=imgurlpagesource.items[0].snippet.thumbnails.medium.url;
                        if(thumbnail!="" && typeof thumbnail!='undefined')
                        {
                            $(adRoot).attr('data-fb-intel-thumbnail',thumbnail);
                        }
                        else
                        {
                            $(adRoot).attr('data-fb-intel-thumbnail',"");
                        }
                    }
                    catch(e)
                    {
                        $(adRoot).attr('data-fb-intel-thumbnail',"");
                    }
                  
                    try{
                        likescount = imgurlpagesource.items[0].statistics.likeCount;
                        if(likescount!="" && typeof likescount!='undefined')
                        {
                            $(adRoot).attr('data-fb-intel-likes',likescount);
                        }
                        else
                        {
                            $(adRoot).attr('data-fb-intel-likes',"0");
                        }
                    }
                    catch(e)
                    {
                        $(adRoot).attr('data-fb-intel-likes',"0");
                    }
           
                    try{
                        dislikecount = imgurlpagesource.items[0].statistics.dislikeCount;
                        if(dislikecount!="" && typeof dislikecount!='undefined')
                        {
                            $(adRoot).attr('data-fb-intel-dislike',dislikecount);
                        }
                        else
                        {
                            $(adRoot).attr('data-fb-intel-dislike',"0");
                        }
                    }
                    catch(e)
                    {
                        $(adRoot).attr('data-fb-intel-dislike',"0");
                    }
            
                    try{
                        viewcount =imgurlpagesource.items[0].statistics.viewCount;
                        if(viewcount!="" && typeof viewcount!='undefined')
                        {
                            $(adRoot).attr('data-fb-intel-views',viewcount);
                        }
                        else
                        {
                            $(adRoot).attr('data-fb-intel-views',"0");
                        }
                    }
                    catch(e)
                    {
                        $(adRoot).attr('data-fb-intel-views',"0");
                    }
           
                    try{
                        commentcount =imgurlpagesource.items[0].statistics.commentCount;
                        if(commentcount!="" && typeof commentcount!='undefined')
                        {
                            $(adRoot).attr('data-fb-intel-comment',commentcount);
                        }
                        else
                        {
                            $(adRoot).attr('data-fb-intel-comment',"0");
                        }
                    }
                    catch(e)
                    {
                        $(adRoot).attr('data-fb-intel-comment',"0");
                    }
               
                }).fail(function (error) {
                    //if (enableDebugger) //debugger;
                });
            }
    }

function add_remaining_parameters_for_imageonly(adRoot)
  {
      $(adRoot).attr('data-fb-intel-category',"");
      $(adRoot).attr('data-fb-intel-othermedia',"");
      $(adRoot).attr('data-fb-intel-channel_url',"");
      //$(adRoot).attr('data-fb-intel-post_owner',"");
      $(adRoot).attr('data-fb-intel-post_owner_img',"");
      $(adRoot).attr('data-fb-intel-ad_text',"");
      $(adRoot).attr('data-fb-intel-tags',"");
      $(adRoot).attr('data-fb-intel-thumbnail',"");
      $(adRoot).attr('data-fb-intel-likes',"0");
      $(adRoot).attr('data-fb-intel-dislike',"0");
      $(adRoot).attr('data-fb-intel-views',"0");
      $(adRoot).attr('data-fb-intel-comment',"0");
      $(adRoot).attr('data-fb-intel-ad_title',"");
}

function add_remaining_parameters_for_Textonly(adRoot)
{
    //$(adRoot).attr('data-fb-intel-ad_url',"");
    $(adRoot).attr('data-fb-intel-category',"");
    $(adRoot).attr('data-fb-intel-othermedia',"");
    $(adRoot).attr('data-fb-intel-channel_url',"");
    //$(adRoot).attr('data-fb-intel-post_owner',"");
    $(adRoot).attr('data-fb-intel-post_owner_img',"");
    $(adRoot).attr('data-fb-intel-tags',"");
    $(adRoot).attr('data-fb-intel-thumbnail',"");
    $(adRoot).attr('data-fb-intel-likes',"0");
    $(adRoot).attr('data-fb-intel-dislike',"0");
    $(adRoot).attr('data-fb-intel-views',"0");
    $(adRoot).attr('data-fb-intel-comment',"0");
}

function add_remaining_parameters_withoutadid(adRoot)
  {
      $(adRoot).attr('data-fb-intel-othermedia',"");
      $(adRoot).attr('data-fb-intel-ad_text',"");
      $(adRoot).attr('data-fb-intel-category',"");
      $(adRoot).attr('data-fb-intel-channel_url',"");
      $(adRoot).attr('data-fb-intel-tags',"");
      $(adRoot).attr('data-fb-intel-thumbnail',"");
      $(adRoot).attr('data-fb-intel-likes',"0");
      $(adRoot).attr('data-fb-intel-dislike',"0");
      $(adRoot).attr('data-fb-intel-views',"0");
      $(adRoot).attr('data-fb-intel-comment',"0");
  }

  function RemovecheckForNew() {
      //debugger;
      // document.getElementById('player-container').removeAttribute("data-fb-intel-triaged");
      var element = document.getElementById("player-container");
       var elementcls=element;
       element = element.outerHTML;
      $(element).removeAttr("data-fb-intel-type");
      $(element).removeAttr("data-fb-intel-parsed");
      $(element).removeAttr("data-fb-intel-triaged");
      $(element).removeAttr("data-fb-intel-attempts");
      $(element).removeAttr("data-fb-intel-events-added");
      $(element).removeAttr("data-fb-intel-saved");
      $(element).removeAttr("data-fb-intel-category");
      $(element).removeAttr("data-fb-intel-ad_url");
      $(element).removeAttr("data-fb-intel-call_to_action");
      $(element).removeAttr("data-fb-intel-ad_id");
      $(element).removeAttr("data-fb-intel-channel_url");
      $(element).removeAttr("data-fb-intel-post_date");
      $(element).removeAttr("data-fb-intel-post_owner");
      $(element).removeAttr("data-fb-intel-post_owner_img");
      $(element).removeAttr("data-fb-intel-ad_position");
      $(element).removeAttr("data-fb-intel-ad_text");
      $(element).removeAttr("data-fb-intel-destination_url");
      $(element).removeAttr("data-fb-intel-likes");
      $(element).removeAttr("data-fb-intel-dislike");
      $(element).removeAttr("data-fb-intel-views");
      $(element).removeAttr("data-fb-intel-comment");
      $(element).removeAttr("data-fb-intel-ad_title");
      $(element).removeAttr("data-fb-intel-platform");
      $(element).removeAttr("data-fb-intel-first_seen");
      $(element).removeAttr("data-fb-intel-last_seen");
      $(element).removeAttr("data-fb-intel-lower_age");
      $(element).removeAttr("data-fb-intel-upper_age");
      $(element).removeAttr("data-fb-intel-newsfeed_description");
      $(element).removeAttr("data-fb-ad");
       elementcls.classList.remove("fb-intel-ad");
       $(element).removeClass("fb-intel-ad");

  }

  function RemovecheckForNewForSideads() {
      //debugger;
      // document.getElementById('player-container').removeAttribute("data-fb-intel-triaged");
      var element = document.getElementById("player-ads");
      var elementcls=element;
      element = element.outerHTML;
     $(element).removeAttr("data-fb-intel-type");
     $(element).removeAttr("data-fb-intel-triaged");
     $(element).removeAttr("data-fb-intel-parsed");
     $(element).removeAttr("data-fb-intel-attempts");
     $(element).removeAttr("data-fb-intel-events-added");
     $(element).removeAttr("data-fb-intel-saved");
     $(element).removeAttr("data-fb-intel-category");
     $(element).removeAttr("data-fb-intel-ad_url");
     $(element).removeAttr("data-fb-intel-call_to_action");
     $(element).removeAttr("data-fb-intel-ad_id");
     $(element).removeAttr("data-fb-intel-channel_url");
     $(element).removeAttr("data-fb-intel-post_date");
     $(element).removeAttr("data-fb-intel-post_owner");
     $(element).removeAttr("data-fb-intel-post_owner_img");
     $(element).removeAttr("data-fb-intel-ad_position");
     $(element).removeAttr("data-fb-intel-ad_text");
     $(element).removeAttr("data-fb-intel-destination_url");
     $(element).removeAttr("data-fb-intel-likes");
     $(element).removeAttr("data-fb-intel-dislike");
     $(element).removeAttr("data-fb-intel-views");
     $(element).removeAttr("data-fb-intel-comment");
     $(element).removeAttr("data-fb-intel-ad_title");
     $(element).removeAttr("data-fb-intel-platform");
     $(element).removeAttr("data-fb-intel-first_seen");
     $(element).removeAttr("data-fb-intel-last_seen");
     $(element).removeAttr("data-fb-intel-lower_age");
     $(element).removeAttr("data-fb-intel-upper_age");
     $(element).removeAttr("data-fb-intel-newsfeed_description");
     $(element).removeAttr("data-fb-ad");
      elementcls.classList.remove("fb-intel-ad");
      $(element).removeClass("fb-intel-ad");
     
  }

  function clear_check_For_New_Feed_ads() {
      //debugger;
      // document.getElementById('player-container').removeAttribute("data-fb-intel-triaged");
      var element = document.getElementById("player-container");
      element = element.outerHTML;
     $(element).removeAttr("data-fb-intel-type");
     $(element).removeAttr("data-fb-intel-category");
     $(element).removeAttr("data-fb-intel-ad_url");
     $(element).removeAttr("data-fb-intel-call_to_action");
     $(element).removeAttr("data-fb-intel-ad_id");
     $(element).removeAttr("data-fb-intel-channel_url");
     $(element).removeAttr("data-fb-intel-post_date");
     $(element).removeAttr("data-fb-intel-post_owner");
     $(element).removeAttr("data-fb-intel-post_owner_img");
     $(element).removeAttr("data-fb-intel-ad_position");
     $(element).removeAttr("data-fb-intel-ad_text");
     $(element).removeAttr("data-fb-intel-destination_url");
     $(element).removeAttr("data-fb-intel-likes");
     $(element).removeAttr("data-fb-intel-dislike");
     $(element).removeAttr("data-fb-intel-views");
     $(element).removeAttr("data-fb-intel-comment");
     $(element).removeAttr("data-fb-intel-ad_title");
     $(element).removeAttr("data-fb-intel-platform");
     $(element).removeAttr("data-fb-intel-first_seen");
     $(element).removeAttr("data-fb-intel-last_seen");
     $(element).removeAttr("data-fb-intel-lower_age");
     $(element).removeAttr("data-fb-intel-upper_age");
     $(element).removeAttr("data-fb-intel-newsfeed_description");
  }
  function clear_check_For_New_Side_ads() {
      //debugger;
      // document.getElementById('player-container').removeAttribute("data-fb-intel-triaged");
      var element = document.getElementById("player-ads");
      element = element.outerHTML;
     $(element).removeAttr("data-fb-intel-type");
     $(element).removeAttr("data-fb-intel-category");
     $(element).removeAttr("data-fb-intel-ad_url");
     $(element).removeAttr("data-fb-intel-call_to_action");
     $(element).removeAttr("data-fb-intel-ad_id");
     $(element).removeAttr("data-fb-intel-channel_url");
     $(element).removeAttr("data-fb-intel-post_date");
     $(element).removeAttr("data-fb-intel-post_owner");
     $(element).removeAttr("data-fb-intel-post_owner_img");
     $(element).removeAttr("data-fb-intel-ad_position");
     $(element).removeAttr("data-fb-intel-ad_text");
     $(element).removeAttr("data-fb-intel-destination_url");
     $(element).removeAttr("data-fb-intel-likes");
     $(element).removeAttr("data-fb-intel-dislike");
     $(element).removeAttr("data-fb-intel-views");
     $(element).removeAttr("data-fb-intel-comment");
     $(element).removeAttr("data-fb-intel-ad_title");
     $(element).removeAttr("data-fb-intel-platform");
     $(element).removeAttr("data-fb-intel-first_seen");
     $(element).removeAttr("data-fb-intel-last_seen");
     $(element).removeAttr("data-fb-intel-lower_age");
     $(element).removeAttr("data-fb-intel-upper_age");
     $(element).removeAttr("data-fb-intel-newsfeed_description");
     
  }

//Start Main Loop to get all ads
  function checkForNew() 
  {
      $("div#player-container:not([data-fb-intel-triaged])")
        .attr("data-fb-intel-triaged", "no")
        .attr("data-fb-ad", "yes")
        .attr("data-fb-intel-ad-type", "feed")
        .addClass('fb-intel-ad');

      $("div#player-ads:not([data-fb-intel-triaged])")
      .attr("data-fb-intel-triaged", "no")
      .attr("data-fb-ad", "yes")
      .attr("data-fb-intel-ad-type", "side")
      .addClass('fb-intel-ad')
      .attr("data-fb-intel-triaged", "sponsored");
  }

  function triageItems() {
      // debugger;
      const startTime = Date.now();
      if (sponsoredClass) {
          $("div.fb-intel-ad[data-fb-intel-triaged='no'], div.fb-intel-ad[data-fb-intel-triaged='not-sponsored']").each(function () {
              const sponsoredLinkCount = $(this).find(sponsoredClass).length
              const hiddensponsoredLinkCount = $(this).find(hiddensponsoredClass).length;
              const middlesponsoredLinkCount = $(this).find(middlesponsoredClass).length;
              if(middlesponsoredLinkCount)
              {
                  $(this).attr("data-fb-intel-triaged", "sponsored");
                  $(this).attr("data-fb-intel-ad-type", "middle");
              }
              if (!sponsoredLinkCount && !middlesponsoredLinkCount) 
              {
                  $(this).attr("data-fb-intel-triaged", "not-sponsored");
                  //const winLoc = window.location.href;
              } 
              if(sponsoredLinkCount && !hiddensponsoredLinkCount && !middlesponsoredLinkCount)
              {
                  $(this).attr("data-fb-intel-triaged", "sponsored");
              }
             
          });
      }
      const delta = Date.now() - startTime;
      chrome.runtime.sendMessage(null, {"triageTime": delta});
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
          //if(attempts=="1")
          //{
          //    clear_check_For_New_Feed_ads();
          //    clear_check_For_New_Side_ads();
          //}
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
  //const delta = Date.now() - startTime;
  //chrome.runtime.sendMessage(null, {"extractTime": delta});

  }

  function saveSponsoredAds() {
      $("div.fb-intel-ad[data-fb-intel-parsed='complete']:not([data-fb-intel-saved])").each(function () {
          const adRoot = this;
          let thisAdData = Object.assign({}, adData);
          for (const [key, value] of Object.entries(requiredData)) {
              thisAdData[key] = $(adRoot).attr(value.attribute) || "";
          if (thisAdData[key] === null) {
              //if (enableDebugger) //debugger;
          }
      }
       const postData = JSON.stringify(thisAdData);
      //console.log(postData);
      // if (enableDebugger) //debugger;
      const settings = {
          "async": true,
          "crossDomain": true,
          "url": powerAdSpyYTApi + "insert-youtube-ads",
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
          $(adRoot).attr("data-fb-intel-triaged", "complete");
          $(adRoot).attr("data-fb-intel-saved", "success");
      }).fail(function () {
          //if (enableDebugger) //debugger;
          // mark as done so we won't retry
          $(adRoot).attr("data-fb-intel-triaged", "complete");
          $(adRoot).attr("data-fb-intel-saved", "failed");
      });
  });
  }




  function removeallfeedouterattr()
  {
     // document.getElementById("player-container").outerHTML="";
      var element = document.getElementById("player-container");
      element = element.outerHTML;
      //console.log($(element)[0].attributes.length);
      for (var i = $(element)[0].attributes.length - 1; i >= 0; i--)
      {
          if($(element)[0].attributes[i].name !="id")
          {
              if($(element)[0].attributes[i].name !="role")
              {
                  if($(element)[0].attributes[i].name !="class")
                  {
                      $(element)[0].removeAttribute(element.attributes[i].name);
                  }
                  else if($(element)[0].attributes[i].name =="class")
                  {
                      $(element).removeClass("fb-intel-ad");
                  }
              }
              
          }
      }
  }
  function removeallsideouterattr()
  {
     var element = document.getElementById("player-ads");
      element = element.outerHTML;
     // console.log($(element)[0].attributes.length);
      for (var i = $(element)[0].attributes.length - 1; i >= 0; i--)
      {
          if($(element)[0].attributes[i].name !="id")
          {
              if($(element)[0].attributes[i].name !="role")
              {
                  if($(element)[0].attributes[i].name !="class")
                  {
                      $(element)[0].removeAttribute(element.attributes[i].name);
                  }
                  else if($(element)[0].attributes[i].name =="class")
                  {
                      $(element).removeClass("fb-intel-ad");
                  }
              }
              
          }
      }
  }

  function removeallfeedattr()
  {
      var element = document.getElementById("player-container");
      for (var i = element.attributes.length - 1; i >= 0; i--)
      {
          if(element.attributes[i].name !="id")
          {
              if(element.attributes[i].name !="role")
              {
                  if(element.attributes[i].name !="class")
                  {
                      element.removeAttribute(element.attributes[i].name);
                  }
                  else if(element.attributes[i].name =="class")
                  {
                      $(element).removeClass("fb-intel-ad");
                  }
              }
              
          }
         
      }
  }
  function removeallsideattr()
  {
      var element = document.getElementById("player-ads");
      for (var i = element.attributes.length - 1; i >= 0; i--)
      {
          if(element.attributes[i].name !="id")
          {
              if(element.attributes[i].name !="role")
              {
                  if(element.attributes[i].name !="class")
                  {
                      element.removeAttribute(element.attributes[i].name);
                  }
                  else if(element.attributes[i].name =="class")
                  {
                      $(element).removeClass("fb-intel-ad");
                  }
              }
              
          }
      }
  }

  function hashCode(str) {
      return str.split('').reduce((prevHash, currVal) =>
          (((prevHash << 5) - prevHash) + currVal.charCodeAt(0))|0, 0);
  }