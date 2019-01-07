define(['jquery', 'api/shim'], function($, shim) {

    var defaultsettings = {left:-1 , top:40, display: false, expanded: false};

    function update() {
        shim.storage.get('FRAMEWORK_QUOTES', function(error, storage) {
            var settings = storage.hasOwnProperty('FRAMEWORK_QUOTES') ?
                           storage.FRAMEWORK_QUOTES.settings :
                           defaultsettings;
            save(settings);
        });
    }

    function save(settings) {
        shim.storage.set( { 'FRAMEWORK_QUOTES': {
            date: Date.now(),
            settings: settings || defaultsettings
        }});
    }

    shim.runtime.onMessage(function(request, sender, sendResponse) {
        // Only accept message for this module
        if(request.module !== 'quotes') {
            return;
        }

        if(request.action === 'update') {
            update();
            return;
        }

        if(request.action === 'settings') {
            shim.storage.get('FRAMEWORK_QUOTES', function(error, storage) {
                if(error)
                    return;

                var settings = $.extend(storage.FRAMEWORK_QUOTES.settings, request.settings);
                save(settings);
            });
            return;
        }

    });

    return {};
});
