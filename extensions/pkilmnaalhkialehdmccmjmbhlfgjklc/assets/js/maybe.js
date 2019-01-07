var maybe = maybe || {
    analytics: {}
  };

(function (analytics) {
  'use strict';

  angular
    .module('maybe', [
      'ui.router',
      'angulartics',
      'angulartics.google.analytics',
      'LocalStorageModule',
      'ngCookies',
      'maybe.controllers',
      'maybe.services',
      'maybe.constants',
      'maybe.components',
      'maybe.directives',
      'maybe.filters'
    ])
    .config(['localStorageServiceProvider', function(localStorageServiceProvider) {
      localStorageServiceProvider
        .setPrefix('maybe')
        .setStorageType('localStorage')
        .setStorageCookie(30, '/')
        .setStorageCookieDomain(window.location);
    }])
    .config(['$urlRouterProvider', '$stateProvider', '$locationProvider', function($urlRouterProvider, $stateProvider, $locationProvider) {
      // use the HTML5 History API
      $locationProvider.html5Mode(true);

      // set default landing page
      $urlRouterProvider.otherwise('share');

      // base state provides a way to redirect user back to their welcome/dashboard page, without flashing login page
      $stateProvider
        .state('base', {
          url: '/',
          template: '<div ui-view></div>',
          controller: 'LoginCtrl as vm',
          data: {
            pageTitle: '',
            requireLogin: true
          }
        })
        .state('share', {
          url: '/share',
          templateUrl: '/views/app/share.html',
          controller: 'ShareCtrl as vm',
          data: {
            pageTitle: 'Share'
          }
        });
    }])
    .run(['$window', '$rootScope', '$state', 'AuthService', 'NotifyService', 'CONSTANTS', 'ENV', function($window, $rootScope, $state, AuthService, NotifyService, CONSTANTS, ENV) {
      function _loadingStartHandler() {
        $('#loadingOverlay').css('left', 0);
      }

      function _loadingDoneHandler() {
        $('#loadingOverlay').css('left', '-200vw');
      }

      $rootScope.$state = $state;

      // global loading spinner
      NotifyService.subscribe($rootScope, CONSTANTS.EVENTS.LOADING.START, _loadingStartHandler);
      NotifyService.subscribe($rootScope, CONSTANTS.EVENTS.LOADING.DONE, _loadingDoneHandler);

      $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        NotifyService.notify(CONSTANTS.EVENTS.STATE.CHANGE);
      });

      // set up Google Analytics with corresponding property ID
      if (analytics) {
        maybe.analytics.service = analytics.getService('maybe_chrome_extension');
        maybe.analytics.tracker = maybe.analytics.service.getTracker(ENV.GA.PROPERTY_ID);
      }
    }]);

  // declare the modules to be used
  angular.module('maybe.controllers', []);
  angular.module('maybe.services', []);
  angular.module('maybe.constants', []);
  angular.module('maybe.components', []);
  angular.module('maybe.directives', []);
  angular.module('maybe.filters', []);
}(analytics));

String.prototype.toProperCase = function () {
  return this.replace(/\w\S*/g, function(text){return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();});
};

/**
 * Extending an object with additional values. If overwriteOnly is true,
 * it'd use base object and attempt to find matching keys in ext object and overwrite
 *
 * @param {Object} base
 * @param {Object} ext
 * @param {Boolean} overwriteOnly
 * @returns {Object}
 */
function extend(base, ext, overwriteOnly) {
  if (!ext) {
    return base;
  }

  if (overwriteOnly) {
    for (var key in base) {
      if (base.hasOwnProperty(key) && ext.hasOwnProperty(key)) {
        base[key] = ext[key];
      }
    }
  } else {
    for (var key in ext) {
      if (ext.hasOwnProperty(key)) {
        base[key] = ext[key];
      }
    }
  }

  return base;
}

// Because sometimes you just need these...
var maybeGlobals = {};
