(function(factory) {

    // AMD anonymous module
    if(typeof define === 'function' && define.amd) {
        define([], factory);
    }
    // CommonJS/Node.js
    else if(typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
        module.exports = factory();
    }
    // Vanilla JS
    else {
        window.MyStartOneCampaign = factory();
    }

})(function() {

    var ORIGIN     = 'https://one.mystart.com';
    var IFRAME_URL = ORIGIN + '/campaign/tracker.html';

    var script = document.currentScript || document.getElementById('mystart-one-campaign-tracker');
    if(script && script.src) {
        ORIGIN     = script.src.replace(/^([^:]+:\/\/\/?[^\/?&#]+).*$/i, '$1');
        IFRAME_URL = script.src.replace(/\.js$/, '.html');
    }



    var iframe    = null;
    var isLoaded  = false;
    var callbacks = {};
    var queue     = [];



    function init() {
        // Been there done that
        if(iframe)
            return;

        iframe = document.createElement('iframe');
        iframe.setAttribute('type', 'content');

        // Hide it
        iframe.style.position   = 'absolute';
        iframe.style.left       = '-9001px';
        iframe.style.top        = '-9001px';
        iframe.style.width      = '0';
        iframe.style.height     = '0';
        iframe.style.visibility = 'hidden';

        iframe.onload = function() {
            isLoaded = true;
            send();
        };

        iframe.src = IFRAME_URL;
        document.body.appendChild(iframe);

        if(window.addEventListener)
            window.addEventListener('message', onMessage);
        else if(window.attachEvent)
            window.attachEvent('onmessage', onMessage);
    }

    function send() {
        if(!isLoaded)
            return;

        while(queue.length)
            iframe.contentWindow.postMessage(queue.shift(), ORIGIN);
    }

    function onMessage(e) {
        // Confirm the message is for us
        if(e.origin !== ORIGIN || e.source !== iframe.contentWindow)
            return;

        // No callback
        if(!e.data.uuid)
            return;

        // UUID not found, no callback
         if(!callbacks.hasOwnProperty(e.data.uuid))
            return;

        // Call function with items found
        callbacks[e.data.uuid](e.data.items);
        delete callbacks[e.data.uuid];
    }

    return function(items, callback) {
        // Always init
        init();

        // No args, user simply init'ed the iframe
        if(arguments.length === 0)
            return true;

        // JS object required
        if(typeof items !== 'object' || items === null)
            return false;

        // Optional callback function
        if(arguments.length >= 2 && typeof callback !== 'function')
            return false;

        var uuid = null;
        if(callback) {
            // Generate a new UUID
            while(uuid === null || callbacks.hasOwnProperty(uuid))
                uuid = Date.now() + '_' + Math.random();

            callbacks[uuid] = callback;
        }

        queue.push({ uuid: uuid, items: items });
        send();

        return true;
    };

});
