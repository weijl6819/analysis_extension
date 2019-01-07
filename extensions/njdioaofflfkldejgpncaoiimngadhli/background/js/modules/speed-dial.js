define(['jquery', 'api/shim'], function($, shim) {

    var defaultsettings = {left:-1 , top:-1, width:600, height:320, display: false};

    function update(callback) {
        shim.storage.get('FRAMEWORK_SPEEDDIAL', function(error, storage) {
            var data = storage.hasOwnProperty('FRAMEWORK_SPEEDDIAL') ?
                       storage.FRAMEWORK_SPEEDDIAL.data :
                       [];
            var settings = storage.hasOwnProperty('FRAMEWORK_SPEEDDIAL') ?
                           storage.FRAMEWORK_SPEEDDIAL.settings :
                           defaultsettings;
            save(data, settings, callback);
        });
    }

    function save(data, settings, callback) {
        shim.storage.set( { 'FRAMEWORK_SPEEDDIAL': {
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
        if(request.module !== 'speed-dial') {
            return;
        }

        if(request.action === 'loading') {
            update(function(data) {
                sendResponse(data);
            });
            return;
        }

        if(request.action === 'settings') {
            shim.storage.get('FRAMEWORK_SPEEDDIAL', function(error, storage) {
                if(error)
                    return;

                storage.FRAMEWORK_SPEEDDIAL.settings = $.extend(storage.FRAMEWORK_SPEEDDIAL.settings, request.settings);
                save(storage.FRAMEWORK_SPEEDDIAL.data, storage.FRAMEWORK_SPEEDDIAL.settings);
            });
            return;
        }

        if(request.action === 'sortlist') {
            shim.storage.get('FRAMEWORK_SPEEDDIAL', function(error, storage) {
                if(error)
                    return;

                save(request.data, storage.FRAMEWORK_SPEEDDIAL.settings);
            });
            return;
        }

    });

    return {};
});
