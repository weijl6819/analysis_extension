/**
 * Password Forget Component
 *
 * The purpose of this component is to provide an interface for user to issue a password reset token, by providing the
 * account's email address.
 *
 */
(function($) {
  angular.module('maybe.components')
    .component('passwordForget', {
      templateUrl: '/views/components/passwordForget.html',
      controller: [
        '$scope',
        '$state',
        'localStorageService',
        'CONSTANTS',
        'AuthService',
        'NotifyService',
        PasswordForgetController]
    });

  function PasswordForgetController(
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
        email: null
      },
      attempt: 0,
      message: null,
      state: $state
    };

    $ctrl.forgetPassword = _forgetPassword;

    function _fail(response) {
      $ctrl.data.message = response.message;
      NotifyService.notify(CONSTANTS.EVENTS.AUTH.PASSWORD.RESET.EMAIL_FAIL, $ctrl.data.message);
    }

    function _success(response) {
      NotifyService.notify(CONSTANTS.EVENTS.AUTH.PASSWORD.RESET.EMAIL_SENT, response);
    }

    /**
     * Sign in a user with given credentials
     * @private
     */
    function _forgetPassword(email) {
      AuthService
        .forgetPassword(email)
        .then(_success, _fail);
    }
  }
})(window.jQuery);
