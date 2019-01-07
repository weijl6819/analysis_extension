
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
/*global YUI*/
/*jslint nomen:true, plusplus:true*/
/**
 * @module s2s
 */
'use strict';
YUI.add('ce-text-select', function (Y) {

    var S2S = Y.namespace('S2S'),
        TARGET_CLASS = 'cap-annotation';

    /**
     * @class TextSelect
     * @constructor
     */
    function TextSelect() {
        TextSelect.superclass.constructor.apply(this, arguments);
    }

    TextSelect.NAME = 'textSelect';

    TextSelect.NS = 'select';

    TextSelect.MAX_WORDS_TO_INVOKE_S2S = 5; // don't invoke on selections > 6 words

    Y.extend(TextSelect, Y.Plugin.Base, {
        /**
         * @method initializer
         * @param {Object} config configuration object
         * @chainable
         */
        initializer: function (config) {
            var doc = Y.one(Y.config.doc),
                capTermNodes = Y.all('.' + TARGET_CLASS),
                hoverMask = Y.one('#hover-mask'),
                s2sNodes,
                that = this;

            this._host = config.host;
            this._blacklist = config.blacklist || [];

            if (!this._host._config.trigger || this._host._config.trigger === 'selection' || this._host._config.trigger === 'both') {

                this._previousTerm = null;

                doc.on(Y.UA.ie ? 'selection' : 'selectionchange', function(e) {
                    this._host.set('triggerType', 'selection');
                    this.onRawSelectionChange(e);
                }, this);
            }

            if ((this._host._config.trigger === 's2s_links' || this._host._config.trigger === 'both') && capTermNodes && capTermNodes.each) {

                capTermNodes.each(function(n) {
                    var text = n.getContent();

                    if (that.checkBlackList(text)) {
                        n.addClass(TARGET_CLASS + '_s2s');
                    }

                });

                s2sNodes = Y.all('.' + TARGET_CLASS + '_s2s');


                s2sNodes.on('hover', Y.bind(function (e) {
                    var target = e.target,
                        x = e.pageX,
                        scrollTop = Y.DOM.docScrollY(),
                        scrollLeft = Y.DOM.docScrollX(),
                        coords = target._node.getBoundingClientRect(),
                        term = target.getContent(),
                        spos = target.getAttribute('capspos');

                    this._host.set('triggerType', 's2s_links');
                    this._host.set('queryStartPos', spos);
                    this._host.set('triggerNode', target);

                    this.onTextSelect(term, x + scrollLeft, coords.top + scrollTop, coords.bottom + scrollTop);

                }, this));

                if (Y.UA.ie && (Y.UA.ie < 9)) {
                    doc.on("click", Y.bind(function(e) {

                        if (!this._host.isClosed() && !e.target.hasClass(TARGET_CLASS)) {
                            this._host.close();
                        }

                    }, this));

                } else {
                    hoverMask.on("mouseleave", Y.bind(function(e) {
                        var x = e.pageX,
                            y = e.pageY,
                            region = e.currentTarget.get('region');

                        if ((x > region.left && region.right > x) && (y > region.top && region.bottom > y)) {
                            return;
                        }

                        if (!this._host.isClosed() && !e.target.hasClass(TARGET_CLASS)) {
                            this._host.close();
                        }

                    }, this));
                }
            }

            return this;
        },

        checkBlackList: function (term) {
            var i;

            if (!Y.Lang.isString(term)) {
                return false;
            }

            term = term.replace(/\s/g, '').toLowerCase();

            for (i = 0; i < this._blacklist.length; i++) {
                if (term.toLowerCase().search(this._blacklist[i]) > -1) {
                    return false;
                }
            }

            return true;

        },

        onRawSelectionChange: function(e, cb) {
            var x = e.pageX,
                y = e.pageY,
                termTrimmed = Y.Lang.trim((e.selection || "").toString()),
                wordAry = termTrimmed.split(" ");

            if (typeof e.selection === "string" && e.selection.length > 0 && (wordAry.length <= S2S.TextSelect.MAX_WORDS_TO_INVOKE_S2S)) {
                this.onTextSelect(e.selection, x, y, y);
                if (cb) {
                    cb({message: "onTextSelect() called"});
                } 
            } else if (cb) {
                cb({message: "selection invalid"});
            }
        },

        onTextSelect: function(term, pageX, pageY1, pageY2, cb) {
            //send beacon with term ...
            var queryTerm = window.location.href;
            var beaconConfig = {};
            var beaconParams = {};
            beaconParams.kwd = "untracked";
            beaconConfig.params = beaconParams;
            extGlobal.browserGap.emitToMain({pageInfo:true, trackingManager: true, beaconConfig: beaconConfig});

            if (this._host && (this._host.isClosed() || (term !== this._previousTerm))) {
                this._previousTerm = term;

                var termTrimmed = Y.Lang.trim(term.toString()),
                    wordAry = termTrimmed.split(" ");

                if ((termTrimmed !== "") && (wordAry.length <= S2S.TextSelect.MAX_WORDS_TO_INVOKE_S2S)) {
                    this._host.open(termTrimmed, pageX, pageY1, pageY2);
                } else {
                    this._host.close();
                    if (cb) {
                        cb({message: "term invalid"});
                    }
                }
            } else {
                if (cb) {
                    cb({message: "no action taken"});
                }
            }
        }
    });

    S2S.TextSelect = TextSelect;

}, '0.8.0', {
    requires: ['plugin', 'gallery-event-selection', 'ce-ult-track', 'event-hover']
});
