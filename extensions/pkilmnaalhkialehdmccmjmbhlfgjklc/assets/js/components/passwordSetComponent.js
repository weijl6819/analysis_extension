/**
 * Password Set Component
 * 
 * The purpose of this component is to provide an interface for a user to enter their optional password, once the first
 * step (sign up) is complete. Typically, when a password is set successfully, it should log in a user immediately.
 * 
 */
(function($) {
  angular.module('maybe.components')
    .component('passwordSet', {
      bindings: {
        email: '='
      },
      templateUrl: '/views/components/passwordSet.html',
      controller: [
        '$scope',
        '$state',
        '$stateParams',
        'localStorageService',
        'CONSTANTS',
        'AuthService',
        'NotifyService',
        PasswordResetController]
    });

  function PasswordResetController(
    $scope,
    $state,
    $stateParams,
    localStorageService,
    CONSTANTS,
    AuthService,
    NotifyService
  ) {
    'use strict';

    var
      $ctrl = this;

    $ctrl.data = {
      formData: {
        email: $stateParams.email ? $stateParams.email : $ctrl.email,
        password: null
      },
      attempt: 0,
      message: null,
      state: $state
    };

    $ctrl.setPassword = _setPassword;

    function _fail(response) {
      $ctrl.data.message = 'Password has already been set, please log in.';
      NotifyService.notify(CONSTANTS.EVENTS.AUTH.PASSWORD.SET.FAIL, $ctrl.data.message);
    }

    function _success(response) {
      NotifyService.notify(CONSTANTS.EVENTS.AUTH.PASSWORD.SET.SUCCESS, response);
    }

    /**
     * Sign in a user with given credentials
     * @private
     */
    function _setPassword(email, password) {
      $ctrl.data.attempt++;
      AuthService.setPassword(email, password)
        .then(_success, _fail);
    }
  }
})(window.jQuery);