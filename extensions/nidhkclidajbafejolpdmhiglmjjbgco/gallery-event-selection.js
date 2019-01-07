
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
YUI.add('gallery-event-selection', function(Y) {

/*
 * Cross browser/device text selection events.
 *  - selection: Fired when text has been selected.
 *  - selectionchange: Fired when text has been selected or deselected.
 *
 * Fired events have the following properties:
 *  - selection: Selected text.
 *  - pageX/pageY: Best guess on where selection ends.
 *
 * Limitations:
 *  - There are a few edge cases where selection events don't work well. Namely,
 *    when selecting text that crosses the boundary of a bounded node or selecting
 *    text with only keyboard selection.
 *
 * Notes:
 *  - Polling for selection changes is necessary because iOS doesn't tell us
 *    when the selection region has been updated and desktop browsers can use
 *    keyboard selection.
 *  - iOS requires a slight delay when getting selected text.
 *
 * event-gesture bugs:
 *  - Can't listen to multiple gesturemove events on the same node.
 *  - gesturemoveend doesn't fire without gesturemovestart.
 */
var DELAY = Y.UA.ios ? 400 : 0,
    POLL = 300;

function getSelection() {
    if (Y.config.win.getSelection) {
        return Y.config.win.getSelection().toString();
    } else if (Y.config.doc.selection) {
        return Y.config.doc.selection.createRange().text;
    }
    return '';
}

Y.Event.define('selection', {
    on: function(node, sub, notifier, filter) {
        var method = filter ? 'delegate' : 'on';
        sub._notifier = notifier;
        sub._handle = new Y.EventHandle([
            node[method]('gesturemovestart', function(e) {}, filter), // event-gesture bug
            // Checking asynchronously since previously selected text can be reported as selected.
            node[method]('gesturemoveend', Y.bind(function(e) {
                sub._x = e.pageX;
                sub._y = e.pageY;
                Y.later(DELAY, this, this._checkSelection, sub);
            }, this), filter)
        ]);
    },

    delegate: function() {
        this.on.apply(this, arguments);
    },

    detach: function(node, sub, notifier) {
        sub._handle.detach();
    },

    detachDelegate: function() {
        this.detach.apply(this, arguments);
    },

    _checkSelection: function(sub) {
        var selection = getSelection();
        if (selection !== '') {
            sub._notifier.fire({selection: selection, pageX: sub._x, pageY: sub._y});
        }
    }
});

Y.Event.define('selectionchange', {
    _poll: null, // Keep one poll since there can only ever be one text selection.

    on: function(node, sub, notifier, filter) {
        var method = filter ? 'delegate' : 'on';
        sub._selection = ''; // Save last selection
        sub._notifier = notifier;
        sub._handle = new Y.EventHandle([
            Y.on('gesturemovestart', Y.bind(function(e) {
                this._unpoll();
                if (sub._selection) {
                    Y.later(0, this, this._checkSelectionChange, sub);
                }
            }, this)),
            node[method]('gesturemovestart', function(e) {}, filter), // event-gesture bug
            // Checking asynchronously since previously selected text can be reported as selected.
            node[method]('gesturemoveend', Y.bind(function(e) {
                sub._x = e.pageX;
                sub._y = e.pageY;
                Y.later(DELAY, this, this._checkSelection, sub);
            }, this), filter)
        ]);
    },

    delegate: function() {
        this.on.apply(this, arguments);
    },

    detach: function(node, sub, notifier) {
        this._unpoll();
        sub._handle.detach();
    },

    detachDelegate: function() {
        this.detach.apply(this, arguments);
    },

    _checkSelection: function(sub) {
        this._unpoll();
        this._checkSelectionChange(sub);
        this._poll = Y.later(POLL, this, this._checkSelectionChange, sub, true);
    },

    _checkSelectionChange: function(sub) {
        var selection = getSelection();
        if (selection !== sub._selection) {
            sub._selection = selection;
            sub._notifier.fire({selection: sub._selection, pageX: sub._x, pageY: sub._y});
        }
    },

    _unpoll: function() {
        if (this._poll) {
            this._poll.cancel();
            this._poll = null;
        }
    }
});


}, 'gallery-2012.07.18-13-22' ,{requires:['event-move'], skinnable:false});