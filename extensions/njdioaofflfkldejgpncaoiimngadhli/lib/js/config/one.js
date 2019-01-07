define(['rsvp', 'api/shim', 'lib/js/ko-mapper', 'lib/js/tools'], function(RSVP, shim, ko_mapper, tools) {

    var deferred = RSVP.defer();



    // Mystart One Platform
    if(shim.target === 'mystart-one-preview') {
        var cfgOne = null;

        window.addEventListener('message', function(e) {
            var cfgPreview = e.data;
            if(tools.isJson(cfgPreview) && cfgPreview.newtab) {
                tools.prepareConfig(cfgPreview);

                if(cfgOne === null) {
                    cfgOne = ko_mapper.initFromJS(cfgPreview);
                    deferred.resolve(cfgOne);
                }
                else {
                    ko_mapper.updateFromJS(cfgOne, cfgPreview);
                    window.postMessage({ event: 'config-reloaded' }, window.location.origin);
                }
            }
        }, false);

        window.parent.postMessage('newtab-ready', window.location.origin);
    }
    // Chrome Extension / Firefox Add-on / Normal site
    else {
        require(['lib/js/config/one-watcher'], function(watcher) {
            watcher(deferred);
        });
    }



    return deferred.promise;

});
