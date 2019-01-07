if (!exports) {var exports = {};} //jshint ignore : line
function Constants() { //jshint ignore : line
    //Wider Mail Manager related constants
    this.WIDER_MAIL_REQUEST_HEADER_NAME = "extensions_installed";
    this.WIDER_MAIL_REQUEST_HEADER_VALUE = "yset_wider_mail_ext";
    this.YAHOO_MAIL_URL = "https://mail.yahoo.com";
    this.MAIL_PARTIAL_URL = "mail.yahoo.com";

    //Tracking related constants
    this.FF_WIDER_MAIL_EXT_SPACE_ID = "151340129";
    this.CHR_WIDER_MAIL_EXT_SPACE_ID = "151340130";
    this.CHR_WIDER_MAIL_EXT_FR_CODE = "yset_widemail_chr_win";
    this.FF_WIDER_MAIL_EXT_FR_CODE = "yset_ff_syc_widemail";
    this.TRACKER_PAGE_INFO = "page_info";
    this.TRACKER_CLICK_INFO = "click_info";
    this.TRACKER_ITYPE_INSTALL = 'install';
    this.TRACKER_ITYPE_UNINSTALL = 'uninstall';
    this.TRACKER_ITYPE_REJECT = 'reject';
    this.TRACKER_ITYPE_ALIVE = 'live';
    this.TRACKER_ITYPE_MODIFIED = 'modified';
    this.TRACKER_ITYPE_EXISTS = 'exists';
    this.TRACKER_ITYPE_VIEW = 'view';
    this.TRACKER_ITYPE_ERROR = 'error';
    this.TRACKER_BROWSER_FF = 'ff';
    this.TRACKER_BROWSER_CHR = 'chr';
    this.TRACKER_ALIVE_PING_INTERVAL = 86400000;// 24 hrs = 24 * 60 * 60 * 1000 milli sec.
    this.TRACKER_PV_PING_TIMEOUT = 15000;// 15 secs = 15 * 1000 milli sec.
    this.TRACKER_ERROR_PING_TIMEOUT = 20000;// 20 secs = 20 * 1000 milli sec.
    this.TRACKER_SEARCHSET_DELC = "ext_ss";
    this.TRACKER_SEARCH_PROTECT_DIALOG_SEC = "search_protect_prompt";
    this.TRACKER_SEARCH_PROTECT_DIALOG_SLK_SUCCESS = "keep_yahoo";
    this.TRACKER_SEARCH_PROTECT_DIALOG_SLK_CANCEL = "switch";
    this.TRACKER_SEARCH_PROTECT_DIALOG_SLK_CLOSE = "x";
    this.TRACKER_SEARCH_PROTECT_DIALOG_SLK_INVOKE = "invoke";
    this.TRACKER_SEARCH_PROTECT_DIALOG_GPOS = "2";
    this.TRACKER_SEARCH_PROTECT_DIALOG_P_SUCCESS = "1";
    this.TRACKER_SEARCH_PROTECT_DIALOG_P_CANCEL = "2";
    this.TRACKER_SEARCH_PROTECT_DIALOG_P_CLOSE = "3";
    this.TRACKER_EXTBTN_SEC = "extension_icon";
    this.TRACKER_EXTBTN_SLK = "extension_icon";
    this.TRACKER_EXTBTN_GPOS = "1";
    this.TRACKER_EXTBTN_P_BTN = "1";
    this.TRACKER_PAGE_INFO_TEMPLATE = {
        "trackEvt": this.TRACKER_PAGE_INFO,
        "trackParams":
        {
            "intl": "{intl}",
            "vtestid": "default",
            "ver": "{ver}",
            "itype": "{itype}",
            "fr": "{fr}",
            "ctid": "{ctid}",
            "mrkt": "{mrkt}",
            "delc": "{ext}",
            "cset": "{cset}",
            "mset": "{mset}",
            "browser": "{browser}",
            "os": "{os}",
            "amp_desc": "{amp_desc}"
        },
        "useYLC": false,
        "trackSpaceID": "{spaceId}"
    };
    this.TRACKER_CLICK_INFO_TEMPLATE = {
        "trackEvt": this.TRACKER_CLICK_INFO,
        "trackParams":
        {
            "intl": "{intl}",
            "vtestid": "default",
            "ver": "{ver}",
            "fr": "{fr}",
            "ctid": "{ctid}",
            "mrkt": "{mrkt}",
            "sec": "{sec}",
            "slk": "{slk}",
            "tar": "{tar}",
            "_p": "{_p}",
            "gpos": "{gpos}",
            "delc": "{ext}",
            "browser": "{browser}",
            "os": "{os}",
            "amp_desc": "{amp_desc}"
        },
        "useYLC": true,
        "trackSpaceID": "{spaceId}"
    };
    this.tracker_searchSet_delc = "ext_ss";

    this.distributionDefaultChannel = "external-oo";
    this.distributionChannels = {
        "external-oo": {
            "frCodeChrome": "yset_widemail_chr_win",
            "type": "default",
            "amp_desc_dist": "oo"
        },
        "external-oo-norrin": {
            "frCodeChrome": "yset_widemail_chr_win",
            "type": "wdrmail_norrin",
            "amp_desc_dist": "oo-norrin"
        },
        "external-oo-postcard": {
            "frCodeChrome": "yset_widemail_chr_win",
            "type": "wdrmail_postcard",
            "amp_desc_dist": "oo-postcard"
        },
        "external-oo-wlcm-cmpn": {
            "frCodeChrome": "yset_widemail_chr_win",
            "type": "wdrmail_wlcm_cmpn",
            "amp_desc_dist": "oo-wlcm-cmpn"
        }
    };

    this.amp_desc_type = "wider";
    this.amp_desc_dist_default = "oo";

    //FF Specific constants
    this.GENERAL_USERAGENT_LOCALE = "general.useragent.locale";
    this.profile_directory = "ProfD";
    this.yahoo_folder = "Yahoo Inc";
    this.yahoo_search_xml = "yahoo.xml";
    this.yahoo_syc_search_xml = "yahoo-web.xml";
    this.tag_url = "Url";
    this.tag_param = "Param";
    this.attribute_name = "name";
    this.attribute_value = "value";
    this.attribute_template = "template";
    this.text_xml = "text/xml";
    this.GENERAL_USERAGENT_LOCALE = "general.useragent.locale";
    this.EXTENSION_BUTTON_ID = "yahoo-mail-link";
    this.EXTENSION_BUTTON_LABEL_ACTIVE = "Search and  Wider Mail by Yahoo";
    this.EXTENSION_BUTTON_LABEL_PASSIVE = "Please switch back to Yahoo Partner as the default search for this add-on to work as expected.";

    //FF Search related constants
    this.YAHOO_CUSTOM_SEARCH_ENGINE_NAME = "Yahoo Partner";
    this.YAHOO_INBUILT_SEARCH_ENGINE = "Yahoo";
    this.YAHOO_CUSTOM_SEARCH_ENGINE_NAME_OLD = "Yahoo Web";
    this.ENGINE_CURRENT = "engine-current";
    this.ENGINE_DEFAULT = "engine-default";
    this.ENGINE_ADDED = "engine-added";
    this.OLD_SEARCH_PROVIDER = "old_search_provider_name";
    this.SEARCH_PROV_DOMAIN = "search.yahoo.com";
    this.SEARCH_PATH = "/search";
    this.SEARCH_SET = "search_set";
    //Placeholder copy till we get the final copy from marketing
    this.SEARCH_SET_MODIFICATION_WARNING_MESSAGE = "Are you sure you want to move away from Yahoo as your default search engine on Firefox. If you decide to continue then you will not experience wider view of Yahoo Mail";

    this.ff_sugg_url = "/sugg/ff?output=fxjson&command={searchTerms}&nResults=";

    //Chrome Specific constants
    this.chromeUninstallURL = "https://www.yahoo.com/?fr=yset_widemail_chr_win_exit";

    return this;
}
