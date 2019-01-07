
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
/*global YUI, top, document, window*/
/*jslint nomen:true, plusplus:true*/
/*jshint nomen:false*/
/*jshint unused:false */
/**
 * @module s2s
 */
YUI.add('ce-plus-flyout-row', function (Y, NAME) {
    'use strict';

    /**
     * @class FlyoutRow
     * @description Flyout Menu
     */
    function FlyoutRow(config) {
        FlyoutRow.superclass.constructor.apply(this, arguments);
    }

    FlyoutRow.NAME = 'flyout';

    FlyoutRow.HTML_MARKUP = '<div id="s2s-flyout" class="s2s-flyout-row dialog-box top"><div id="hover-mask"></div><ul></ul></div>';

    FlyoutRow.ATTRS = {
        x: {value: 0},
        y1: {value: 0},
        y2: {value: 0},
        track_sec: {value: "radial"}
    };

    FlyoutRow.OPEN_CLASS = 'open';

    FlyoutRow.STATUS_OPEN = 1;
    FlyoutRow.STATUS_CLOSED = 2;

    Y.extend(FlyoutRow, Y.Base, {
        initializer: function(config) {
            this._nodeSelector = config.nodeSelector;
            this._buttons = config.buttons;
            this._status = FlyoutRow.STATUS_CLOSED;

            Y.Array.each(this._buttons, function(button, index, list) {
                button.set('parent', this);
            }, this);
        },

        renderUI: function() {
            Y.Array.each(this._buttons, function (button, index, list) {
                button.setPosition(0, 0, index, list.length);
                button.render();
            }, this);
        },

        syncUI: function() {
            var x = this.get('x'),
                y1 = this.get('y1'),
                y2 = this.get('y2'),
                node = Y.one(this._nodeSelector),
                position = this._calculateFlyoutPosition(x, y1, y2),
                currentPosition = node.hasClass('top') ? 'top' : 'bottom';

            if (currentPosition !== position.pos) {
                node.replaceClass(currentPosition, position.pos);
            }

            node.setStyle('left', position.x);

            if (!Y.UA.ie || (Y.UA.ie >= 9)) {
                node.setStyle('top', (position.pos === 'top') ? position.y + 46 : position.y - 46);
            } else {
                node.setStyle('top', (position.pos === 'top') ? position.y + 6 : position.y - 8);
            }
        },

        render: function() {
            this.syncUI();
            this.renderUI();
        },

        hide: function(cb) {
            if (this.isClosed()) {
                if (cb) {
                    cb({message: 'Row already hidden. No action'});
                }
                return;
            }

            var self = this;

            this._status = FlyoutRow.STATUS_CLOSED;

            Y.Array.each(this._buttons, function (button, index) {
                button.hide();
            });

            // Timeout for hiding
            this._timeout = setTimeout(function() {
                Y.one(self._nodeSelector).removeClass(FlyoutRow.OPEN_CLASS);
            }, 20); // Add a little flex time
        },

        show: function(cb) {
            console.log(this.get('query'));
            if (this.isOpen()) {
                if (cb) {
                    cb({message: 'Row already shown. No action'});
                }
                return;
            }

            var node = Y.one(this._nodeSelector);

            if (this._timeout) {
                clearTimeout(this._timeout);
                delete this._timeout;
            }

            node.addClass(FlyoutRow.OPEN_CLASS);
            this._status  = FlyoutRow.STATUS_OPEN;

            Y.Array.each(this._buttons, function(button) {
                button.show();
            });
        },

        isOpen: function() {
            return this._status  === FlyoutRow.STATUS_OPEN;
        },

        isClosed: function() {
            return !this.isOpen();
        },

        _calculateFlyoutPosition: function(x, y1, y2) {
            var buttonWidth = Y.FlyoutButtonRow.WIDTH,
                total = this._buttons.length,
                flyoutWidth = (buttonWidth * total) + 2,
                flyoutHeight = Y.FlyoutButtonRow.HEIGHT + 2,
                viewportWidth = Y.DOM.winWidth(),
                viewportHeight = Y.DOM.winHeight(),
                documentScrollTop = Y.DOM.docScrollY(),
                documentScrollLeft = Y.DOM.docScrollX(),
                minTop = documentScrollTop,
                maxTop = documentScrollTop + viewportHeight,
                minLeft = documentScrollLeft,
                maxLeft = documentScrollLeft + viewportWidth,
                adjx;

            //check top 
            if ((y1 - flyoutHeight) >= minTop) {
                if ((x - (flyoutWidth / 2) >= minLeft) && (x + (flyoutWidth / 2) <= maxLeft)) {
                    return {
                        x: x - flyoutWidth / 2,
                        y: y1 - flyoutHeight,
                        pos: 'top'
                    };
                }

                if ((x - (flyoutWidth / 2) < minLeft)) {
                    adjx = minLeft - (x - (flyoutWidth / 2));
                    return {
                        x: (x - flyoutWidth / 2) + adjx,
                        y: y1 - flyoutHeight,
                        pos: 'top'
                    };
                }

                if ((x + (flyoutWidth / 2) > maxLeft)) {
                    adjx = (x + (flyoutWidth / 2)) - maxLeft;
                    return {
                        x: (x - flyoutWidth / 2) - adjx,
                        y: y1 - flyoutHeight,
                        pos: 'top'
                    };
                }
            }

            //check bottom 
            if ((y2 + flyoutHeight) < maxTop) {
                if ((x - (flyoutWidth / 2) >= minLeft) && (x + (flyoutWidth / 2) <= maxLeft)) {
                    return {
                        x: x - flyoutWidth / 2,
                        y: y2 + 8,
                        pos: 'bottom'
                    };
                }

                if ((x - (flyoutWidth / 2) < minLeft)) {
                    adjx = minLeft - (x - (flyoutWidth / 2));
                    return {
                        x: (x - flyoutWidth / 2) + adjx,
                        y: y2 + 8,
                        pos: 'bottom'
                    };
                }

                if ((x + (flyoutWidth / 2) > maxLeft)) {
                    adjx = (x + (flyoutWidth / 2)) - maxLeft;
                    return {
                        x: (x - flyoutWidth / 2) - adjx,
                        y: y2 + 8,
                        pos: 'bottom'
                    };
                }
            }

            // default
            return {
                x: x - flyoutWidth / 2,
                y: y1 - flyoutHeight
            };
        }
    });

    Y.FlyoutRow = FlyoutRow;
}, '0.8.0', {requires: ['ce-plus-flyout-button-row', 'dom-base', 'base']});
