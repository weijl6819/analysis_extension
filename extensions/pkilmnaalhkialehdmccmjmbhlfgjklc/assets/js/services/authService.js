(function() {
  angular.module('maybe.services')
    .factory('AuthService', [
      '$q',
      '$http',
      '$cookies',
      '$rootScope',
      '$state',
      'localStorageService',
      'CONSTANTS',
      'ENV',
      'NotifyService',
      'LogService',
      'ParseService',
      AuthService
    ]);

  function AuthService(
    $q,
    $http,
    $cookies,
    $rootScope,
    $state,
    localStorageService,
    CONSTANTS,
    ENV,
    NotifyService,
    LogService,
    ParseService
  ) {
    'use strict';

    var _user;

    _user = extend(_getUserTemplate(), localStorageService.get('user'), true);

    /**
     * Generates a user template for caching current user
     * @returns {{id: null, username: null, fbId: string, fbUpdatedTime: string, firstname: string, middlename: string, lastname: string, email: string, profileImage: string, profileImageFile: null, showWebIntro: null, suggestionBasket: null, block: null, blockedBy: Array, blocking: Array, createdInitialBasket: null, createdWelcomeBasket: null, createdAt: null, token: string, type: string}}
     * @private
     */
    function _getUserTemplate() {
      return {
        id: null,
        username: null,
        fbId: '',
        fbUpdatedTime: '',
        firstname: '',
        middlename: '',
        lastname: '',
        email: '',
        profileImage: '',
        profileImageFile: null,
        hasPassword: false,
        showWebIntro: null,
        suggestionBasket: null,
        block: null,
        blockedBy: [],
        blocking: [],
        createdInitialBasket: null,
        createdWelcomeBasket: null,
        createdAt: null,
        token: '',
        type: '',
        sessionToken: ''
      };
    }

    /**
     * Generic user login success handler
     * @param data
     * @returns {*}
     * @private
     */
    function _userSuccess(data) {
      NotifyService.notify(CONSTANTS.EVENTS.LOADING.DONE, '');
      return $q(function (resolve, reject) {
        // Parse doesn't return ID as part of attributes, adding it for reference later
        var today = new Date();
        var expireDate = new Date(today.setMonth(today.getMonth() + 1));
        var user = _getUserTemplate();

        user.id = data.id;
        _user = extend(user, data.attributes, true);
        _user.hasPassword = data.get('userPassword').length > 0;
        _user.sessionToken = data.getSessionToken();

        localStorageService.set('maybe.user', _user);
        $cookies.put(CONSTANTS.COOKIES.MAYBE, user.id, {domain: 'maybe.xyz', expires: expireDate});

        NotifyService.notify(CONSTANTS.EVENTS.AUTH.CHANGE, _user);
        resolve({'status': CONSTANTS.STATUSES.SUCCESS, 'data': _user});
      });
    }

    /**
     * Generic user login fail handler
     * @param data
     * @returns {*}
     * @private
     */
    function _userFail(data) {
      NotifyService.notify(CONSTANTS.EVENTS.LOADING.DONE, '');
      return $q(function (resolve, reject) {
        var message = data.message ? data.message : CONSTANTS.MESSAGES.ERROR_CONNECTION;

        reject({'status': CONSTANTS.STATUSES.ERROR_CONNECTION, 'message': message});
      });
    }

    /**
     * Generic send success handler
     * @param data
     * @returns {*}
     * @private
     */
    function _sendSuccess(data) {
      NotifyService.notify(CONSTANTS.EVENTS.LOADING.DONE, '');
      return $q(function (resolve, reject) {
        resolve(data);
      });
    }

    /**
     * Generic send fail handler
     * @param data
     * @returns {*}
     * @private
     */
    function _sendFail(data) {
      NotifyService.notify(CONSTANTS.EVENTS.LOADING.DONE, '');
      return $q(function (resolve, reject) {
        reject(data);
      });
    }

    function _deeplink(token) {
      NotifyService.notify(CONSTANTS.EVENTS.LOADING.START, '');

      return ParseService
        .deeplink(token)
        .then(_userSuccess, _userFail);
    }

    function _fbLogin() {
      NotifyService.notify(CONSTANTS.EVENTS.LOADING.START, '');

      return ParseService
        .fbLogin()
        .then(_userSuccess, _userFail);
    }

    function _sendLink(name, email, overwrite, basket) {
      NotifyService.notify(CONSTANTS.EVENTS.LOADING.START, '');

      return ParseService.getLink(name, email, overwrite, basket)
        .then(_sendSuccess, _sendFail);
    }

    function _forgetPassword(email) {
      NotifyService.notify(CONSTANTS.EVENTS.LOADING.START, '');

      return ParseService.forgetPassword(email)
        .then(_sendSuccess, _sendFail);
    }

    function _login(email, password) {
      NotifyService.notify(CONSTANTS.EVENTS.LOADING.START, '');

      return ParseService.login(email, password)
        .then(_userSuccess, _sendFail);
    }

    function _resetPassword(token) {
      NotifyService.notify(CONSTANTS.EVENTS.LOADING.START, '');

      return ParseService.resetPassword(token)
        .then(_userSuccess, _userFail);
    }

    function _setPassword(email, password, oldPassword) {
      NotifyService.notify(CONSTANTS.EVENTS.LOADING.START, '');

      return ParseService.setPassword(email, password, oldPassword)
        .then(_userSuccess, _userFail);
    }

    function _logout() {
      localStorageService.clearAll();
      _user = extend(_getUserTemplate(), localStorageService.get('maybe.user'), true);

      $cookies.remove(CONSTANTS.COOKIES.MAYBE, {domain: 'maybe.xyz'});
      NotifyService.notify(CONSTANTS.EVENTS.AUTH.CHANGE, false);

      window.Intercom("shutdown");

      return ParseService.logout();
    }

    function _updateUser(userData) {
      NotifyService.notify(CONSTANTS.EVENTS.LOADING.START, '');

      return ParseService
        .updateUser(userData)
        .then(_userSuccess, _userFail);
    }

    function _currentUser() {
      return _user && _user.username ? _user : false;
    }

    function _validateUser() {
      var promise = new Parse.Promise();

      if (_currentUser()) {
        return ParseService.query({
          type: 'first',
          className: '_User',
          equalTo: {
            'objectId': _user.id
          }
        }).then(
          function(user) {
            if (user.get('block')) {
              _logout();
              return false;
            } else {
              return true;
            }
          },
          function(error) {
            return false;
          }
        );
      } else {
        promise.reject(false);
        return promise;
      }
    }

    function _getTwitterLink(url) {
      return ParseService.run('getTwitterLink', {url: url});
    }

    return {
      fbLogin: _fbLogin,
      sendLink: _sendLink,
      deeplink: _deeplink,
      login: _login,
      logout: _logout,
      forgetPassword: _forgetPassword,
      resetPassword: _resetPassword,
      setPassword: _setPassword,
      currentUser: _currentUser,
      updateUser: _updateUser,
      validateUser: _validateUser,
      getTwitterLink: _getTwitterLink
    };
  }
})();
