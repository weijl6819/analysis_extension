/**
 * Sign Up Component
 *
 * The purpose of this component is to provide an interface for user to sign up, by providing a name and email.
 *
 */
(function($) {
  angular.module('maybe.components')
    .component('signUp', {
      templateUrl: '/views/components/signUp.html',
      controller: [
        '$scope',
        '$state',
        'localStorageService',
        'CONSTANTS',
        'ENV',
        'AuthService',
        'NotifyService',
        SignUpController]
    });

  function SignUpController(
    $scope,
    $state,
    localStorageService,
    CONSTANTS,
    ENV,
    AuthService,
    NotifyService
  ) {
    'use strict';

    var
      $ctrl = this;

    $ctrl.data = {
      formData: {
        name: null,
        email: null
      },
      attempt: 0,
      message: null,
      state: $state,
      authURL: null,
      facebookURL: ENV.FACEBOOK.OAUTH_URL
    };

    $ctrl.sendLink = _sendLink;

    function _fail(response) {
      $ctrl.data.message = response.message;
      NotifyService.notify(CONSTANTS.EVENTS.AUTH.SIGNUP.FAIL, $ctrl.data.message);
    }

    function _success(response) {
      NotifyService.notify(CONSTANTS.EVENTS.AUTH.SIGNUP.SUCCESS, {email: $ctrl.data.formData.email});
    }

    /**
     * Send email with smart link using email
     * @private
     */
    function _sendLink(name, email) {
      $ctrl.data.attempt++;

      AuthService
        .sendLink(name, email, false)
        .then(_success, _fail);
    }

    AuthService.getTwitterLink('signup')
      .then(
        function(response) {
          $ctrl.data.authURL = response.authURL;
          $scope.$apply();
        }
      );

  }
})(window.jQuery);
