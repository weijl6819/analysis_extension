
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
/*global YUI, setTimeout, document*/
/*jslint nomen:true, plusplus:true*/
/*jshint unused:false */
/**
 * @module s2s
 */
YUI.add('ce-plus-flyout-button-row', function(Y, NAME) {
    'use strict';

    var CLICK_EVENT = 'click';

    /**
     * @class FlyoutButtonRow
     * @description Flyout Button - Buttons used by Flyout menu.
     */
    function FlyoutButtonRow(config) {
        FlyoutButtonRow.superclass.constructor.apply(this, arguments);
    }

    FlyoutButtonRow.NAME = 'flyoutButton';

    FlyoutButtonRow.WIDTH = 40;
    FlyoutButtonRow.HEIGHT = 44;

    FlyoutButtonRow.ATTRS = {
        x: {value: 0},
        y: {value: 0},
        z: {value: 0},
        parent: {value: null},
        pos: {value: 0}
    };

    FlyoutButtonRow.HTML_MARKUP = '<li id="{name}" class="{className} {linkClass}"><a title="{title}" class="{linkClass}" target="{openIn}"><span id="{title}">&nbsp;</span></a></li>';

    Y.extend(FlyoutButtonRow, Y.Base, {
        initializer: function(config) {
            this._nodeSelector = config.nodeSelector;
            this._clickHandler = config.clickHandler;
            this._isShown = false;

            this.set("pos", config.pos);

            return this;
        },

        bindUI: function() {

            if (this._alreadyBound) {
                return;
            }

            this._alreadyBound = true;

            this.publish('tap', {emitFacade: true, broadcast: true});

            var icon = Y.one(this._nodeSelector).one('a');
            icon.on(CLICK_EVENT, Y.bind(function(e) {
                this.fire('tap', {originalEvent: e, flyoutButton: this});
                if (this._clickHandler) {
                    this._clickHandler(e);
                }
            }, this));

            return this;
        },

        syncUI: function() {
        },

        render: function() {
            this.bindUI();
            this.syncUI();

            return this;
        },

        setPosition: function(x, y, index, total) {
            this.setAttrs({
                x: x,
                y: y,
                z: total - index + 1
            });

            return this;
        },

        show: function(cb) {
            if (this._isShown) {
                if (cb) {
                    cb({message: 'Buttons already shown. No action'});
                }
                return;
            }

            this._isShown = true;

            var node = Y.one(this._nodeSelector);
            node.setStyle('transform', 'translate(' + this.get('x') + 'px, ' + this.get('y') + 'px)');
        },

        hide: function(cb) {
            if (!this._isShown) {
                if (cb) {
                    cb({message: 'Buttons already hidden. No action'});
                }
                return;
            }

            this._isShown = false;

            return this;
        }
    });

    Y.FlyoutButtonRow = FlyoutButtonRow;

}, '0.8.0', {requires: ['node', 'base']});