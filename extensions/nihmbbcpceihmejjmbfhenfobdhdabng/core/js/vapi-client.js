
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
/*******************************************************************************

    uBlock Origin - a browser extension to block requests.
    Copyright (C) 2014-2017 The uBlock Origin authors

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see {http://www.gnu.org/licenses/}.

    Home: https://github.com/gorhill/uBlock
*/

// For non-background page

'use strict';

/******************************************************************************/

// https://github.com/chrisaljoudi/uBlock/issues/456
//   Skip if already injected.

if ( typeof vAPI === 'object' && !vAPI.clientScript ) { // >>>>>>>> start of HUGE-IF-BLOCK

/******************************************************************************/
/******************************************************************************/

vAPI.clientScript = true;

vAPI.randomToken = function() {
    return String.fromCharCode(Date.now() % 26 + 97) +
           Math.floor(Math.random() * 982451653 + 982451653).toString(36);
};

vAPI.sessionId = vAPI.randomToken();
vAPI.chrome = true;
vAPI.setTimeout = vAPI.setTimeout || self.setTimeout.bind(self);

/******************************************************************************/

vAPI.shutdown = {
    jobs: [],
    add: function(job) {
        this.jobs.push(job);
    },
    exec: function() {
        var job;
        while ( (job = this.jobs.pop()) ) {
            job();
        }
    },
    remove: function(job) {
        var pos;
        while ( (pos = this.jobs.indexOf(job)) !== -1 ) {
            this.jobs.splice(pos, 1);
        }
    }
};

/******************************************************************************/

vAPI.messaging = {
    port: null,
    portTimer: null,
    portTimerDelay: 10000,
    channels: Object.create(null),
    channelCount: 0,
    pending: Object.create(null),
    pendingCount: 0,
    auxProcessId: 1,
    shuttingDown: false,

    shutdown: function() {
        this.shuttingDown = true;
        this.destroyPort();
    },

    disconnectListener: function() {
        this.port = null;
        vAPI.shutdown.exec();
    },
    disconnectListenerCallback: null,

    messageListener: function(details) {
        if ( !details ) {
            return;
        }

        // Sent to all channels
        if ( details.broadcast === true && !details.channelName ) {
            for ( var channelName in this.channels ) {
                this.sendToChannelListeners(channelName, details.msg);
            }
            return;
        }

        // Response to specific message previously sent
        if ( details.auxProcessId ) {
            var listener = this.pending[details.auxProcessId];
            delete this.pending[details.auxProcessId];
            delete details.auxProcessId; // TODO: why?
            if ( listener ) {
                this.pendingCount -= 1;
                listener(details.msg);
                return;
            }
        }

        // Sent to a specific channel
        var response = this.sendToChannelListeners(details.channelName, details.msg);

        // Respond back if required
        if ( details.mainProcessId === undefined ) {
            return;
        }
        var port = this.connect();
        if ( port !== null ) {
            port.postMessage({
                mainProcessId: details.mainProcessId,
                msg: response
            });
        }
    },
    messageListenerCallback: null,

    portPoller: function() {
        this.portTimer = null;
        if (
            this.port !== null &&
            this.channelCount === 0 &&
            this.pendingCount === 0
        ) {
            return this.destroyPort();
        }
        this.portTimer = vAPI.setTimeout(this.portPollerCallback, this.portTimerDelay);
        this.portTimerDelay = Math.min(this.portTimerDelay * 2, 60 * 60 * 1000);
    },
    portPollerCallback: null,

    destroyPort: function() {
        if ( this.portTimer !== null ) {
            clearTimeout(this.portTimer);
            this.portTimer = null;
        }
        var port = this.port;
        if ( port !== null ) {
            port.disconnect();
            port.onMessage.removeListener(this.messageListenerCallback);
            port.onDisconnect.removeListener(this.disconnectListenerCallback);
            this.port = null;
        }
        if ( this.channelCount !== 0 ) {
            this.channels = Object.create(null);
            this.channelCount = 0;
        }
        // service pending callbacks
        if ( this.pendingCount !== 0 ) {
            var pending = this.pending, callback;
            this.pending = Object.create(null);
            this.pendingCount = 0;
            for ( var auxId in pending ) {
                callback = pending[auxId];
                if ( typeof callback === 'function' ) {
                    callback(null);
                }
            }
        }
    },

    createPort: function() {
        if ( this.shuttingDown ) {
            return null;
        }
        if ( this.messageListenerCallback === null ) {
            this.messageListenerCallback = this.messageListener.bind(this);
            this.disconnectListenerCallback = this.disconnectListener.bind(this);
            this.portPollerCallback = this.portPoller.bind(this);
        }
        try {
            this.port = chrome.runtime.connect({name: vAPI.sessionId}) || null;
        } catch (ex) {
            this.port = null;
        }
        if ( this.port !== null ) {
            this.port.onMessage.addListener(this.messageListenerCallback);
            this.port.onDisconnect.addListener(this.disconnectListenerCallback);
        }
        this.portTimerDelay = 10000;
        if ( this.portTimer === null ) {
            this.portTimer = vAPI.setTimeout(this.portPollerCallback, this.portTimerDelay);
        }
        return this.port;
    },

    connect: function() {
        return this.port !== null ? this.port : this.createPort();
    },

    send: function(channelName, message, callback) {
        this.sendTo(channelName, message, undefined, undefined, callback);
    },

    sendTo: function(channelName, message, toTabId, toChannel, callback) {
        // Too large a gap between the last request and the last response means
        // the main process is no longer reachable: memory leaks and bad
        // performance become a risk -- especially for long-lived, dynamic
        // pages. Guard against this.
        if ( this.pendingCount > 25 ) {
            vAPI.shutdown.exec();
        }
        var port = this.connect();
        if ( port === null ) {
            if ( typeof callback === 'function' ) {
                callback();
            }
            return;
        }
        var auxProcessId;
        if ( callback ) {
            auxProcessId = this.auxProcessId++;
            this.pending[auxProcessId] = callback;
            this.pendingCount += 1;
        }
        port.postMessage({
            channelName: channelName,
            auxProcessId: auxProcessId,
            toTabId: toTabId,
            toChannel: toChannel,
            msg: message
        });
    },

    addChannelListener: function(channelName, callback) {
        if ( typeof callback !== 'function' ) {
            return;
        }
        var listeners = this.channels[channelName];
        if ( listeners !== undefined && listeners.indexOf(callback) !== -1 ) {
            console.error('Duplicate listener on channel "%s"', channelName);
            return;
        }
        if ( listeners === undefined ) {
            this.channels[channelName] = [callback];
            this.channelCount += 1;
        } else {
            listeners.push(callback);
        }
        this.connect();
    },

    removeChannelListener: function(channelName, callback) {
        if ( typeof callback !== 'function' ) {
            return;
        }
        var listeners = this.channels[channelName];
        if ( listeners === undefined ) {
            return;
        }
        var pos = listeners.indexOf(callback);
        if ( pos === -1 ) {
            console.error('Listener not found on channel "%s"', channelName);
            return;
        }
        listeners.splice(pos, 1);
        if ( listeners.length === 0 ) {
            delete this.channels[channelName];
            this.channelCount -= 1;
        }
    },

    removeAllChannelListeners: function(channelName) {
        var listeners = this.channels[channelName];
        if ( listeners === undefined ) {
            return;
        }
        delete this.channels[channelName];
        this.channelCount -= 1;
    },

    sendToChannelListeners: function(channelName, msg) {
        var listeners = this.channels[channelName];
        if ( listeners === undefined ) { return; }
        listeners = listeners.slice(0);
        var response;
        for ( var listener of listeners ) {
            response = listener(msg);
            if ( response !== undefined ) { break; }
        }
        return response;
    }
};

/******************************************************************************/

vAPI.shutdown.add(function() {
    vAPI.messaging.shutdown();
    delete window.vAPI;
});

// https://www.youtube.com/watch?v=rT5zCHn0tsg
// https://www.youtube.com/watch?v=E-jS4e3zacI

/******************************************************************************/
/******************************************************************************/

} // <<<<<<<< end of HUGE-IF-BLOCK
