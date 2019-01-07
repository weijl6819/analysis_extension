/**
 * Password Reset Component
 * 
 * The purpose of this component is to provide an interface for user to enter new passwords, after they have issued
 * a password reset request, and received a password reset token.
 * 
 */
(function($) {
  angular.module('maybe.components')
    .component('passwordReset', {
      templateUrl: '/views/components/passwordReset.html',
      controller: [
        '$scope',
        '$state',
        'localStorageService',
        'CONSTANTS',
        'AuthService',
        'NotifyService',
        PasswordResetController]
    });

  function PasswordResetController(
    $scope,
    $state,
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
        password: null
      },
      attempt: 0,
      message: null,
      state: $state
    };

    $ctrl.resetPassword = _resetPassword;

    function _fail(response) {
      $ctrl.data.message = response.message;
      NotifyService.notify(CONSTANTS.EVENTS.AUTH.PASSWORD.RESET.FAIL, $ctrl.data.message);
    }

    function _success(response) {
      NotifyService.notify(CONSTANTS.EVENTS.AUTH.PASSWORD.RESET.SUCCESS, response);
    }

    /**
     * Sign in a user with given credentials
     * @private
     */
    function _resetPassword(password) {
      AuthService.setPassword(AuthService.currentUser().email, password)
        .then(_success, _fail);
    }
  }
})(window.jQuery);