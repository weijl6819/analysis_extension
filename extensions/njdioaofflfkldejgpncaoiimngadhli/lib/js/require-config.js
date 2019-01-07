var require = {
    baseUrl: '..',
    urlArgs: function(id, url){
        var version = location.search.match(/(\d+)\.(\d+)\.(\d+)/);
        return (version === null ? '' : '?v=' + version[0]);
    },
    map: {},
    shim: {
        'facebook-sdk' : {
          exports: 'FB'
        },
        'youtube-api' : {
          exports: 'YT'
        }
    },
    paths: {
        'fingerprintjs2':   'lib/vendor/fingerprint2',
        'facebook-sdk':     'lib/vendor/facebook-sdk',
        'facebook':         'lib/vendor/facebook',
        'youtube-api':      'lib/vendor/youtube-api',
        'youtube':          'lib/vendor/youtube',
        'i18next':          'lib/vendor/i18next',
        'i18nextko':        'lib/vendor/i18nextko',
        'jquery':           'lib/vendor/jquery',
        'jquery-ui':        'lib/vendor/jquery-ui',
        'jquery-browser':   'lib/vendor/jquery-browser',
        'jquery-actual':    'lib/vendor/jquery-actual',
        'bxslider':         'lib/vendor/jquery.bxslider',
        'knockout':         'lib/vendor/knockout',
        'moment':           'lib/vendor/moment',
        'perfect-scrollbar':'lib/vendor/perfect-scrollbar',
        'piwik':            'lib/vendor/piwik',
        'text':             'lib/vendor/require-text',
        'json':             'lib/vendor/require-json',
        'rsvp':             'lib/vendor/rsvp'
    }
};
