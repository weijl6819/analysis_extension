(function (global) {

    var map = {
        'popup': 'popup',
        'common': 'common',
    };

    var packages = {
        'popup': { main: 'popup.js', defaultExtension: 'js' },
        'common': { main: 'common.js', defaultExtension: 'js' },
    };
    
    var config = {
        map: map,
        packages: packages
    };

    System.config(config);
})(this);

(function () {
    System.import('popup').catch(function (err) { console.error(err); });
})();
