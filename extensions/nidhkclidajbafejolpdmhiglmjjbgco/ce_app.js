
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
/*global YUI, window, document, top*/
/*jslint nomen:true, plusplus:true*/
/*jshint unused:false */
/**
 * @module s2s
 */
'use strict';

extGlobal.browserGap = new BrowserGap(true);
extGlobal.constants = new Constants();

YUI.add('ce-plus-app', function (Y) {
    var L = Y.Lang,
        sub = L.sub,
        globalInstance,
        S2S = Y.namespace('S2S');

    // create your own namespace in the YUI global environment
    globalInstance = YUI.namespace("Env.S2sApp");

    /**
     * @class App
     * @constructor
     */
    function App() {

        // if an instance doesn't exist yet
        // do the normal class initialization and set the global
        // instance to this instance
        if (Y.Lang.isUndefined(globalInstance.instance)) {
            globalInstance.instance = this;
            App.superclass.constructor.apply(this, arguments);
        }
        // instead of returning this, return the global instance
        return globalInstance.instance;
    }

    var css_path = extGlobal.browserGap.getContentScriptAssetPath('ce_plus.css');
    /**
     * @static
     * @type {Object}
     * @property CSS_PATH
     */
    App.CSS_PATH = {
        //modified dev path
        dev: css_path,
        prod: 'https://s.yimg.com/pv/ce/css/ce_plus-min-' + (YUI.Env.S2s && YUI.Env.S2s.config && YUI.Env.S2s.config.releaseTag) + '.css',
        qa: 'https://s.yimg.com/pv/ce/css/ce_plus_qa.css'
    };

    /**
     * @static
     * @property HTML
     * @type {String}
     * @description skeleton template
     */
    App.HTML_MARKUP = '<div id="s2s">{flyout_html}<a href="" class="s2s-hide" id="s2s-dummy-link" target="_blank"></a></div>';

    /**
     * @static
     * @property ATTRS
     * @type {Object}
     */
    App.ATTRS = {
        query: {
            value: ''
        },
        queryStartPos: {
            value: ''
        },
        triggerType: {
            value: ''
        },
        renderComplete: {
            value: false
        },
        triggerNode: {
            value: null
        }
    };

    /**
     * @static
     * @property FLYOUT_MODELS
     * @type {Object}
     * @description the flyout model to use
     */
    App.FLYOUT_MODELS = {
        row: {
            flyout: Y.FlyoutRow,
            button: Y.FlyoutButtonRow
        }
    };

    App.TYPE_Tags = {
        "searchlight-search": "web_",
        "searchlight-images": "image_",
        "searchlight-video": "video_"
    };

    App.RADIAL_CLICK_SLK = {
        "searchlight-search": "web",
        "searchlight-images": "image",
        "searchlight-video": "video"
    };

    App.LOCALE_TO_INTL_MAP = {
        'zh-TW': 'tw',
        'zh-HK': 'hk'
    };

    /*Translations for the APP. Later can be moved to seperate file for more translation*/
    App.BUTTON_TEXT_TRANSLATIONS_MAP = {
        "searchlight.search": {
            "default": "Web Search",
            "zh-TW": "網頁搜尋",
            "zh-HK": "網頁搜尋"
        }
    };

    App.SIDEBAR_MODELS = {
        narrow: {
            settings_desc: "In a narrow sidebar",
            width: 320,
            srp_templates: {
                "searchlight-search": {
                    directURL: "https://{intl}search.yahoo.com/yhs/search?p={query}&hspart={hspart}&hsimp={hsimp}&type={typecode}"
                },
                "searchlight-images": {
                    directURL: "https://{intl}images.search.yahoo.com/yhs/search?p={query}&hspart={hspart}&hsimp={hsimp}&type={typecode}"
                },
                "searchlight-video": {
                    directURL: "https://{intl}video.search.yahoo.com/yhs/search?p={query}&hspart={hspart}&hsimp={hsimp}&type={typecode}"
                }
            }
        }
    };

    App.SETTING_DEFAULTS = {
        safe_search: "strict",
        open_behavior: "self",
        results_per_page: "10",
        search_scan: "off",
        flyout_model: "row",
        sidebar_model: "narrow",
        selector_orient: "left",
        direct_nav: true
    };

    App.ROOT_S2S_DOMAIN = "s2s";


    Y.extend(App, Y.Base, {
        /**
         * @method initializer
         * @param {Object} config configuration object
         * @chainable
         */
        initializer: function (config) {
            var cssPath = App.CSS_PATH.prod; // use appropriate CSS path for dev/prod

            this._config = config;
            this._settings = {};

            /*this._tables = [{
                "id": "searchlight.search",
                "title": "Web Search"
            }, {
                "id": "searchlight.images",
                "title": "Images"
            }, {
                "id": "searchlight.video",
                "title": "Videos"
            }];*/

            this._tables = [{
                "id": "searchlight.search",
                "title": App.BUTTON_TEXT_TRANSLATIONS_MAP["searchlight.search"][this._config.locale] || App.BUTTON_TEXT_TRANSLATIONS_MAP["searchlight.search"]["default"]
            }];

            this._pendingReplies = {}; //tag

            if (this._config.env === 'development') {
                cssPath = App.CSS_PATH.dev;
            } else if (this._config.env === 'qa') {
                cssPath = App.CSS_PATH.qa;
            }

            if (!config.mockCss) {
                Y.one('head').append('<link rel="stylesheet" href="' + cssPath + '" />');
            }

            this._flyoutModel = App.FLYOUT_MODELS.row;
            this._tablesFlyout = this._tables;
            this._settings = App.SETTING_DEFAULTS;

            this.render();

            return this;
        },

        /**
         * @method render
         * @chainable
         */
        render: function () {
            this.renderUI();
            this.bindUI();

            return this;
        },

        /**
         * @method renderUI
         * @description render all your markup, including markup from YUI child elements, here
         * @chainable
         */
        renderUI: function (cb) {
            if (this._node) {
                if (cb) {
                    cb({"message": "node already created. No need to create again."});
                }
                return;
            }

            this._node = Y.Node.create(sub(App.HTML_MARKUP, {
                flyout_html: this._flyoutModel.flyout.HTML_MARKUP
            }));

            var list = this._node.one('ul'),
                flyoutButtons = [],
                index = 0;

            Y.Array.each(this._tables, function (table) {
                var id = table.id.replace('.', '-'),
                    html,
                    linkClass = '',
                    clickHandler = null,
                    openIn = '_blank';

                index++;

                if (index === 1) {
                    linkClass += 'blr4';
                }

                if (index === this._tables.length) {
                    linkClass += (linkClass.length ? ' ' : '') + 'brr4';
                }

                if (this._config.openInNewTab && this._config.openInNewTab.toLowerCase()==='no'){
                    openIn="_self";
                }

                html = Y.Node.create(sub(this._flyoutModel.button.HTML_MARKUP, {
                    name: id,
                    className: id,
                    title: table.title,
                    linkClass: linkClass,
                    openIn:openIn
                }));

                list.append(html);

                flyoutButtons.push(new this._flyoutModel.button({
                    nodeSelector: "#s2s #" + html.get('id'),
                    clickHandler: clickHandler,
                    pos: index
                }));

            }, this);

            if (Y.UA.ie && (Y.UA.ie < 9)) {
                this._node.addClass('degrade');
            }

            Y.one('body').append(this._node);

            this._flyout = new this._flyoutModel.flyout({
                nodeSelector: "#s2s #s2s-flyout",
                buttons: flyoutButtons
            });
            this._flyout.render();

            this.set('renderComplete', true);

            return this;
        },

        /**
         * @method bindUI
         * @description set up all your event handlers (Y.on, Y.after, etc.) here
         * @chainable
         */
        bindUI: function (cb) {
            if (this._alreadyBound) {
                if (cb) {
                    cb({"message": "Listeners already binded. No need to bind again."});
                }
                return this;
            }

            Y.on('flyoutButton:tap', function (e, cb) {
                this.onTap(e, cb);
            }, this);

            Y.on("resize", Y.bind(function () {

                if ((Y.DOM.winHeight() !== this._winHeight) ||
                        (Y.DOM.winWidth() !== this._winWidth)) {
                    this.close();

                    this._winHeight = Y.DOM.winHeight();
                    this._winWidth = Y.DOM.winWidth();
                }

            }, this));

            this._alreadyBound = true;

            return this;
        },

        onTap: function (e, cb) {
            e.preventDefault();
            //for UTs
            cb = cb || e.cb;

            var term = this.get('query');

            var url = "";
            if(extGlobal.browserGap.isFirefox) {
                url = "https://search.yahoo.com/yhs/search" +
                      "?p=" + encodeURIComponent(term) +
                      "&hspart=" + extGlobal.constants.SEARCH_HSPART_VAL +
                      "&hsimp=" + extGlobal.constants.SEARCH_HSIMP_VAL;
            } else {
                url = "https://search.yahoo.com/search" +
                      "?p=" + encodeURIComponent(term) +
                      "&fr=" + extGlobal.constants.SEARCH_FRCODE;
            }


                var beaconConfig = {};
                var beaconParams = {};
                beaconParams.sec = "contentEnhancer";
                beaconParams.slk = "contentEnhancer";
                beaconParams.tar = url;
                beaconConfig.params = beaconParams;
                extGlobal.browserGap.emitToMain({trackingManager: true, beaconConfig: beaconConfig});

                window.open(url,'_blank') ;
                this.close(true);
            return true;
        },

        /**
         * @method open
         * @description open the S2S+ UI
         * @chainable
         */
        open: function (term, x, y1, y2, cb) {
            if (!term || typeof term !== 'string' || !Y.Lang.isNumber(x) || !Y.Lang.isNumber(y1) || !Y.Lang.isNumber(y2)) {
                if (cb) {
                    cb({"message": "please set proper values for term, x or y."});
                }
                return;
            }

            var trigNode = this.get('triggerNode');

            if (trigNode) {
                trigNode.addClass('active');
            }

            this.set('query', term);
            this._flyout.set('x', x);
            this._flyout.set('y1', y1);
            this._flyout.set('y2', y2);

            this._flyout.render();
            this._flyout.show();
            /* Check with Param if we want to implement something similar to this
            //beacon
            /*Y.S2SUlt.ULT.firePartialPVBeacon('MENU', {
                'sec': 'radial',
                'slk': 'web',
                'query': encodeURIComponent(term),
                'cauuid': this._config.uuid || '',
                'parentpg': this._formatParentCode(),
                'trigsrc': this.get('triggerType') === "selection" ? "sel" : "lnk"
            });*/

            return this;
        },

        /**
         * @method close
         * @description close the S2S+ UI
         * @chainable
         */
        close: function(skipBeacon, cb) {
            var trigNode = this.get('triggerNode');

            if (trigNode) {
                trigNode.removeClass('active');
                this.set('triggerNode', null);
            }

            if (this._flyout.isOpen()) {
                this._flyout.hide();
            } else if (cb) {
                cb({"message": "Radial is already closed. No need to call hide method."});
            }
            return this;
        },

        isClosed: function () {
            return this._flyout.isClosed();
        },

        isRenderComplete: function () {
            return this.get('renderComplete');
        },

        getSettings: function () {
            return this._settings;
        },

        _formatParentCode: function (cb) {
            var hspart = this._config.hspart || '',
                hsimp = this._config.hsimp || '';

            if (cb) {
                cb({"message": hspart + '_' + hsimp});
            }

            return hspart + '_' + hsimp;
        }
    });

    S2S.App = App;
}, '0.8.0', {
    requires: [
        'node',
        'base',
        'event',
        'ce-plus-flyout-row',
        'ce-ult-track'
    ]
});
