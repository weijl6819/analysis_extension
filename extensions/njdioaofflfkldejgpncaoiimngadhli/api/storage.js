define(['lib/js/event-handler'], function(EH) {

    var monitorAll    = EH();
    var monitoredKeys = {};

    var addMonitorCallback = function(key, callback) {
        if(!monitoredKeys.hasOwnProperty(key))
            monitoredKeys[key] = EH();

        monitoredKeys[key](callback);
    };



    var storage = {

        clear: function(callback) {
            chrome.storage.local.clear(function() {
                EH.safe(callback)(!!chrome.runtime.lastError);
            });
        },

        get: function(keys, callback) {
            chrome.storage.local.get(keys, function(items) {
                EH.safe(callback)(!!chrome.runtime.lastError, items);
            });
        },

        remove: function(keys, callback) {
            chrome.storage.local.remove(keys, function() {
                EH.safe(callback)(!!chrome.runtime.lastError);
            });
        },

        set: function(items, callback) {
            chrome.storage.local.set(items, function() {
                EH.safe(callback)(!!chrome.runtime.lastError);
            });
        },

        monitor: function(anyKeys, callback) {
            var keys = [];

            switch(Object.prototype.toString.apply(anyKeys)) {
                case '[object Null]':
                    monitoredAll(callback);
                    return;

                case '[object String]':
                    keys.push(anyKeys);
                    break;

                case '[object Array]':
                    keys = anyKeys;
                    break;

                case '[object Object]':
                    for(var key in anyKeys)
                        keys.push(key);
                    break;
            }

            for(var i = 0; i < keys.length; ++i)
                addMonitorCallback(keys[i], callback);
        },

        onChange: EH()

    };



    chrome.storage.onChanged.addListener(function(changes, areaName) {
        if(areaName !== 'local')
            return;

        storage.onChange.fire(changes);

        for(var key in changes) {
            monitorAll.fire(key, changes[key]);

            if(monitoredKeys.hasOwnProperty(key))
                monitoredKeys[key].fire(key, changes[key]);
        }
    });



    return storage;

});



/*
####  CHROME.STORAGE  ####

Notes:
  - ...

Methods:
  chrome.storage.local.clear(function callback)
  chrome.storage.local.get(string or array of string or object keys or null, function callback(object items) )
  chrome.storage.local.remove(string or array of string keys, function callback)
  chrome.storage.local.set(object items, function callback)

Events:
  chrome.storage.onChanged.addListener(function callback(object changes, string areaName) )
            changes: { key: value, ... }, fuck le areaName
*/
