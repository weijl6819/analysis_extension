(function() {
  angular.module('maybe.services')
    .factory('LogService', [
      '$rootScope',
      'ENV',
      LogService
    ]);

  function LogService(
    $rootScope,
    ENV
  ) {
    'use strict';

    function _log(state, scope, message) {
      if (ENV.DEBUG) {
        console.log(state, scope, message);
      }
    }

    return {
      log: _log
    };
  }
})();