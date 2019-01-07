define(['api/shim'], function(shim) {

    return {

        pageView: function(page, cb) {
            shim.runtime.sendMessage({
                'module' : 'analytics',
                'action' : 'page-view',
                'data'   : page
            }, cb);
        },

        events: function(events, cb) {
            shim.runtime.sendMessage({
                'module' : 'analytics',
                'action' : 'events',
                'data'   : events
            }, cb);
        }

    };

});
