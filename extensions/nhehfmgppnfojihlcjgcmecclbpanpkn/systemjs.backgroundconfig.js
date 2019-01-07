(function (global) {

    var map = {
        'background': 'background',
        'common': 'common',
    };

    var packages = {
        'background': { main: 'background.js', defaultExtension: 'js' },
        'common': { main: 'common.js', defaultExtension: 'js' },
    };
    
    var config = {
        map: map,
        packages: packages
    };


    System.config(config);
})(this);

(function () {
    System.import('background').catch(function (err) {
            console.error(err) });
})();
