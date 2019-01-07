// @BUG@ TEMP FOR DEMO
//window.loadConfig = function(id) {
//    window.location = window.location.href.replace(/\?conf_id=[^&#]+/, '') + (id ? '?conf_id=' + id : '');
//};



define(['knockout', 'api/shim', 'lib/js/ko-mapper', 'lib/js/tools', (function() {
    var confFile = window && window.location && window.location.search.match(/[^\w]conf_id=([0-9]+)/);

    if(confFile && confFile[1])
        return 'json!config-package-' + confFile[1] + '.json';

    return 'json!config-package.json';
})()], function(ko, shim, ko_mapper, tools, cfgPkg) {

    var cfgOne, cfgUser;

    var userEditables = [];
    var subscriptions = [];



    function trackUserEditables() {
        var key, opt;

        cfgUser = {
            metrics: {},
            social: {},
            newtab: {}
        };

        // Analytics
        for(key in cfgOne.metrics) {
            cfgUser.metrics[key] = cfgOne.metrics[key];
            userEditables.push(cfgOne.metrics[key]);
        }

        // Analytics
        for(key in cfgOne.social) {
            cfgUser.social[key] = cfgOne.social[key];
            userEditables.push(cfgOne.social[key]);
        }

        // Settings
        for(key in cfgOne.newtab) {
            if(!cfgOne.newtab[key].hasOwnProperty('settings'))
                continue;

            cfgUser.newtab[key] = { defaults: {} };

            for(opt in cfgOne.newtab[key].settings) {
                if(cfgOne.newtab[key].defaults.hasOwnProperty(opt) && cfgOne.newtab[key].settings[opt]) {
                    cfgUser.newtab[key].defaults[opt] = cfgOne.newtab[key].defaults[opt];
                    userEditables.push(cfgOne.newtab[key].defaults[opt]);
                }
            }
        }
    }



    function watch() {
        // Just to be safe
        unwatch();

        for(var i = 0; i < userEditables.length; ++i)
            subscriptions.push(userEditables[i].subscribe(onDirty));
    }



    function unwatch() {
        for(var i = 0; i < subscriptions.length; ++i)
            subscriptions[i].dispose();

        subscriptions = [];
    }



    function onDirty() {
        shim.pstorage.set({ 'FRAMEWORK_CONFIG_USER_LOCAL': ko_mapper.toJS(cfgUser) });
    }



    return function(deferred) {
        tools.prepareConfig(cfgPkg);
        cfgOne = ko_mapper.initFromJS(cfgPkg);

        trackUserEditables();

        shim.pstorage.monitor('FRAMEWORK_CONFIG_USER_LOCAL', function(key, changes) {
            if(key !== 'FRAMEWORK_CONFIG_USER_LOCAL')
                return;

            unwatch();
            ko_mapper.updateFromJS(cfgUser, changes.newValue);
            watch();
        });

        shim.pstorage.get('FRAMEWORK_CONFIG_USER_LOCAL', function(error, storage) {
            if(!error && storage.hasOwnProperty('FRAMEWORK_CONFIG_USER_LOCAL'))
                ko_mapper.updateFromJS(cfgUser, storage.FRAMEWORK_CONFIG_USER_LOCAL);

            watch();

            deferred.resolve(cfgOne);
        });
    };

});
