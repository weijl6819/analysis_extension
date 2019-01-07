define(['jquery', 'api/shim', 'json!config-package.json'], function($, shim, cfgPkg) {

    var defaultsettings = {left:-1 , top:-1, width:645, height:340, display: cfgPkg.newtab.history_center.defaults.opened_by_default};

    function update(callback) {
        shim.storage.get('FRAMEWORK_HISTORY_CENTER', function(error, storage) {
            var data = storage.hasOwnProperty('FRAMEWORK_HISTORY_CENTER') ?
                       storage.FRAMEWORK_HISTORY_CENTER.data :
                       [];
            var settings = storage.hasOwnProperty('FRAMEWORK_HISTORY_CENTER') ?
                           storage.FRAMEWORK_HISTORY_CENTER.settings :
                           defaultsettings;
            save(data, settings, callback);
        });
    }

    function save(data, settings, callback) {
        shim.storage.set( { 'FRAMEWORK_HISTORY_CENTER': {
            data: data,
            date: Date.now(),
            settings: settings || defaultsettings
        }}, function() {
            if (callback)
                callback(settings || defaultsettings);
        });
    }

    shim.runtime.onMessage(function(request, sender, sendResponse) {
        // Only accept message for this module
        if(request.module !== 'history-center') {
            return;
        }

        if(request.action === 'loading') {
            update(function(data) {
                sendResponse(data);
            });
            return;
        }

        if(request.action === 'settings') {
            shim.storage.get('FRAMEWORK_HISTORY_CENTER', function(error, storage) {
                if(error)
                    return;

                storage.FRAMEWORK_HISTORY_CENTER.settings = $.extend(storage.FRAMEWORK_HISTORY_CENTER.settings, request.settings);
                save(storage.FRAMEWORK_HISTORY_CENTER.data, storage.FRAMEWORK_HISTORY_CENTER.settings);
            });
            return;
        }

    });

    return {};
});
