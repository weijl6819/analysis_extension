(function() {
  angular.module('maybe.services')
    .factory('NotifyService', [
      '$rootScope',
      NotifyService
    ]);

  function NotifyService(
    $rootScope
  ) {
    'use strict';

    function _subscribe(scope, event, callback) {
      var handler = $rootScope.$on(event, callback);
      scope.$on('$destroy', handler);
      return handler;
    }

    function _notify(event, message) {
      $rootScope.$emit(event, message);
    }

    return {
      subscribe: _subscribe,
      notify: _notify
    };
  }
})();