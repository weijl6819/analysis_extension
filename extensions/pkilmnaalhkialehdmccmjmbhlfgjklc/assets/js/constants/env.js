(function() {
  angular.module('maybe.constants')
    .constant('ENV', {
      'FACEBOOK': {
        'APP_ID': '1553739704876275',
        'OPTIONS': 'public_profile,email',
        'OAUTH_URL': 'https://www.facebook.com/dialog/oauth?client_id=1553739704876275&redirect_uri=https%3A%2F%2Fapp.maybe.xyz%2Fapp%2Ffacebook&scope=email'
      },
      'PARSE': {
        'APP_ID': '7599b1faab8e0e7ed9ac94184c6365856241623e',
        'JS_KEY': '688e6fa978fd581e31658181aa90cb4338b920b6',
        'REST_KEY': '76c9dd0a447f80d407c0291585701bfa1ead36f9',
        'URL': 'https://parse.maybe.xyz/1'
      },
      'APP': {
        'URL': 'https://app.maybe.xyz'
      },
      'GA': {
        'PROPERTY_ID': 'UA-63307495-1'
      },
      'AWS': {
        'CLOUDFRONT': 'https://d3p1p682vy8lrp.cloudfront.net'
      },
      'HOKO': {
        'ID': 'e71fb3d771490af0'
      },
      'TEMPORARY_USER_TIMEOUT':  24 * 60 * 60 * 1000,         // Set timeout to only 24 hours
      'DEBUG': false
    });
})();
