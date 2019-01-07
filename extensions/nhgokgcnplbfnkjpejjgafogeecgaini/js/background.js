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
﻿
// on every time chrome launched except the first time launch this will be fire
chrome.windows.onCreated.addListener(function () {
    ShowBadgeTextOfNewItems()
})

// only for first time launch this will be fired
chrome.tabs.getSelected(null, function (tab) {
    ShowBadgeTextOfNewItems()
    GetNewNewsFeedItemsCount();
});

function GetNewNewsFeedItemsCount()
{   
    $(document).ready(function () {
        setInterval(function () {
            // Do ping after 5 mins
            ShowBadgeTextOfNewItems();
        }, 300000);
    })
}


function ShowBadgeTextOfNewItems() {
    var newItemCount = 0;
    var nowDate = new Date($.now());

    // on browser launch get today item count and show as badge text
    ////$.get('http://192.168.37.26:9002/rss.xml')
    $.get('http://www.naturalnews.com/rss.xml')
   .done(function (data) {
       $(data).find("channel").each(function () {           
           var rootElement = $(this);
           // get all children elements
           var children = $(this).children();
           $(this).children('item').each(function () {
               //alert("item = " + $(this).children('title').text() + "pub-date = " + new Date($(this).children('pubdate').text()) + "diff = " + CompareTwoDates(new Date($(this).children('pubdate').text()), nowDate))

               // logic for new :- will store the item ID if any id in the news feed greater than the stored last seen item id then that wil be new
               ////alert($(this).children('guid').text().split("http://www.naturalnews.com/")[1].split('_')[0])
               if (localStorage["LastReadItemId"] == null || localStorage["LastReadItemId"] == undefined || localStorage["LastReadItemId"]=='')
               {
                   localStorage["LastReadItemId"] = 0;
               }

                if (parseInt($(this).children('guid').text().split("http://www.naturalnews.com/")[1].split('_')[0]) > parseInt(localStorage["LastReadItemId"])) {
                   newItemCount = newItemCount + 1;
               }

           })

           setBadgeText(newItemCount);
       })
   })
   .fail(function () {
       // this function is executed if the request fails
   });
}

function CompareTwoDates(dateOne, dateTwo) {
    return Math.floor((dateTwo.getTime() - dateOne.getTime()) / 86400000); // ms per day
}

function setBadgeText(badgeText) {
    if (badgeText > 0) {
        if (badgeText > 10) {
            chrome.browserAction.setBadgeText({ text: '10+' }); // We have 10+ unread items.
        }
        else {
            chrome.browserAction.setBadgeText({ text: badgeText.toString() }); // We have 10+ unread items.
        }

        chrome.browserAction.setBadgeBackgroundColor({ color: "#0AAF1B" })
    }
}