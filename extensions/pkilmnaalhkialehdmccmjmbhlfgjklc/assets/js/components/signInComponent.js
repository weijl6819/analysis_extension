/**
 * Sign In Component
 *
 * The purpose of this component is to provide an interface for users to sign in. It can either by email with password,
 * or just email. When a password is submitted, it would log in a user immediately. If a password is omitted, it would
 * generate an email with log in instructions.
 *
 */
(function($) {
  angular.module('maybe.components')
    .component('signIn', {
      templateUrl: '/views/components/signIn.html',
      controller: [
        '$scope',
        '$state',
        'localStorageService',
        'CONSTANTS',
        'ENV',
        'AuthService',
        'NotifyService',
        SignInController]
    });

  function SignInController(
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
        email: null,
        password: null
      },
      attempt: 0,
      message: null,
      state: $state,
      authURL: null,
      facebookURL: ENV.FACEBOOK.OAUTH_URL
    };

    $ctrl.signIn = _signIn;

    function _fail(response) {
      $ctrl.data.message = response.message;
      NotifyService.notify(CONSTANTS.EVENTS.AUTH.SIGNIN.FAIL, $ctrl.data.message);
    }

    function _success(response) {
      NotifyService.notify(CONSTANTS.EVENTS.AUTH.SIGNIN.SUCCESS, response);
      NotifyService.notify(CONSTANTS.EVENTS.LAYOUT.REFRESH);

    }

    function _sent(response) {
      NotifyService.notify(CONSTANTS.EVENTS.AUTH.SIGNIN.EMAIL_SENT, response);
    }

    function _loginFailHandler(event, data) {
      $ctrl.data.message = data;
    }

    /**
     * Sign in a user with given credentials
     * @private
     */
    function _signIn(email, password) {
      if (!password) {
        AuthService
          .sendLink(null, email, true)
          .then(_sent, _fail);
      } else {
        AuthService
          .login(email, password)
          .then(_success, _fail);
      }
    }

    NotifyService.subscribe($scope, CONSTANTS.EVENTS.AUTH.SIGNIN.FAIL, _loginFailHandler)

    AuthService.getTwitterLink('signup')
      .then(
        function(response) {
          $ctrl.data.authURL = response.authURL;
          $scope.$apply();
        }
      );
  }
})(window.jQuery);
