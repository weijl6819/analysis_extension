
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
//--icons
var IMG_ROOT = 'images/';
var ICON = {
    NORMAL: {
        '16': IMG_ROOT + '16x16.png',
        '18': IMG_ROOT + '18x18.png',
        '24': IMG_ROOT + '24x24.png',
        '48': IMG_ROOT + '48x48.png',
        '128': IMG_ROOT + '128x128.png'
    },
    GREY: {
        '16': IMG_ROOT + '16x16-grey.png',
        '18': IMG_ROOT + '18x18-grey.png'
    },
    ACTIVATED: {
        '16': IMG_ROOT + '16x16-activated.png',
        '18': IMG_ROOT + '18x18-activated.png',
        '24': IMG_ROOT + '24x24-activated.png',
        '48': IMG_ROOT + '48x48-activated.png'
    },
    NOTACTIVATED: {
        '16': IMG_ROOT + '16x16-notactivated.png',
        '18': IMG_ROOT + '18x18-notactivated.png',
        '24': IMG_ROOT + '24x24-notactivated.png',
        '48': IMG_ROOT + '48x48-notactivated.png'
    }
};

//--debug
var DEBUG = false;

//--popup
var POPUP_WIDTH = 267,
    POPUP_HEIGHT = 430,
    POPUP_CONTENT_HEIGHT = 340;

//--tabs
var TAB_HISTORY_LENGTH = 10; //?

//--TIMEOUTS AND INTERVALS
var FETCH_TIMEOUT_IN_CASE_OF_ERROR = 1000 * 5,
    PERIOD_ACTIVATION_PROCESS = 1000 * 20,
    PERIOD_OF_UNACTIVATION = 1000 * 60 * 60 * 24,
    INTERVAL_SERP_INJECTIONS = 1000 * 1;

// google analytics
var GA_SAND_BOX_ID = 'UA-20266843-4';//for a test 'UA-179316-16';

// extension ID
var EXTENSION_ID;

// data
var ACCOUNT_URL = 'https://www.getpaidto.com/members/my-cashback/cashback-activity';