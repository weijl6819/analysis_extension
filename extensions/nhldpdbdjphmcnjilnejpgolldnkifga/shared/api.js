
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
var LOG_INTO_EXTENSION = 'https://www.getpaidto.com/login?ext=login';
var LOG_OUT_OF_EXTENSION = 'https://www.getpaidto.com/logout?extLogout=true';
var SURVEYS_PAGE = 'https://www.getpaidto.com/points/surveys';

var API = {
    mainPage: {
        url: 'https://www.getpaidto.com'
    },
    user: {
        url: 'https://api.getpaidto.com/browserapi?method=getuser',
        period: 1000 * 60 * 60 //60min
    },
    merchants: {
        url: 'https://api.getpaidto.com/browserapi?method=getmerchants',
        period: 1000 * 60 * 60 //60min
    },
    offersUrl: function (merchantId) { //on demand
        return 'https://api.getpaidto.com/browserapi?method=getmerchantoffers&merchantId=' + merchantId; //+ '&startindex=0&pagesize=10';
    },
    featuredMerchants: {
        url: 'https://api.getpaidto.com/browserapi?method=getfeaturedmerchants', //+ '&startindex=0&pagesize=10';
        period: 1000 * 60 * 60 //60min
    },
    gamesDraw: {
        url: 'https://api.getpaidto.com/browserapi?method=getgamesdraw',
        period: 1000 * 60 * 60 * 24 // The games draw runs every day at 18:00 UTC
    },
    surveys: {//on demand
        urlUser: 'https://api.getpaidto.com/browserapi?method=getsurveys',
        urlDaily: 'http://api.getpaidto.com/browserapi?method=getsurveyrouters'
    },
    search: {
        url: 'https://www.getpaidto.com/retailers?search='
    },
    afterInstallPage: {
        url: 'https://www.getpaidto.com/login?ext=install'
    },
    auth: {
        domain: 'www.getpaidto.com',
        cookieName: 'GetPaidToThirdPartyToken'
    },
    suppressions: [
        'being.successfultogether.co.uk',
        'www.awin1.com',
        'www.jdoqocy.com',
        'www.dpbolvw.net',
        'www.kqzyfj.com',
        'www.tkqlhce.com',
        'www.anrdoezrs.net',
        'click.linksynergy.com',
        'clkuk.tradedoubler.com',
        'www.pjtra.com',
        'www.shareasale.com',
        'track.webgains.com',
        'scripts.affiliatefuture.com',
        'track.omguk.com'
    ]
};

var REGEXPS = {//https://www.getpaidto.com/offer-splash?linktype=1&typeid=3921&redirect=true
    interstitial: /(https?:\/\/)?(www.)?(getpaidto)\.(com)\/(offer-splash\?linktype\=1\&typeid\=)[0-9]+/,
    merchantIdFromInterstitial: /(offer\-splash\?linktype\=1\&typeid\=)[0-9]+/,
    replace: /offer\-splash\?linktype\=1\&typeid=/
};

var SERPS = {
    GOOGLE: {
        NAME: 'Google',
        IS_GOOGLE: true,
        PATTERN: /^http(?:s)?:\/\/(?:www\.|encrypted\.)?google\./,
        DATA_SELECTOR: '.r > a,h3>a[data-preconnect-urls]',
        ATTR: 'href',
        CHECK_LABEL: false,
        CONTAINER_SELECTOR: 'div.rc, li.ads-ad',
        INJ_SELECTOR: false,
        ACTION: 'prepend',
        CSS: ''
    }
};