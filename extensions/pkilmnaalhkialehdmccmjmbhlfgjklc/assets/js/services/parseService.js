/**
 * Parse Service
 *
 *
 */
(function(Parse, FB, $, maybeGlobals) {
  angular.module('maybe.services')
    .factory('ParseService', [
      '$q',
      '$state',
      '$analytics',
      'CONSTANTS',
      'ENV',
      'NotifyService',
      'LogService',
      ParseService
    ]);

  function ParseService(
    $q,
    $state,
    $analytics,
    CONSTANTS,
    ENV,
    NotifyService,
    LogService
  ) {
    'use strict';

    var _ready = false;
    var _config = {};

    function _init() {
      if (!_ready) {
        Parse.initialize(ENV.PARSE.APP_ID, ENV.PARSE.JS_KEY);
        Parse.serverURL = ENV.PARSE.URL;
        Parse.Config.get()
          .then(
            function(config) {
              _config = config.attributes;
              NotifyService.notify(CONSTANTS.EVENTS.PARSE.READY);
            }
          );
        //// Load the facebook SDK asynchronously
        //(function(d, s, id){
        //  var js, fjs = d.getElementsByTagName(s)[0];
        //  if (d.getElementById(id)) return;
        //  js = d.createElement(s); js.id = id;
        //  js.src = "//connect.facebook.net/es_US/sdk.js";
        //  fjs.parentNode.insertBefore(js, fjs);
        //}(document, 'script', 'facebook-jssdk'));
        //
        //$window.fbAsyncInit = function() {
        //  Parse.initialize(ENV.PARSE.APP_ID, ENV.PARSE.JS_KEY);
        //  Parse.serverURL = ENV.PARSE.URL;
        //
        //  Parse.FacebookUtils.init({
        //    appId: ENV.FACEBOOK.APP_ID,
        //    status: true, // check Facebook Login status
        //    cookie: true, // enable cookies to allow Parse to access the session
        //    xfbml: true,  // initialize Facebook social plugins on the page
        //    version: 'v2.4' // point to the latest Facebook Graph API version
        //  });
        //
        //  NotifyService.notify(CONSTANTS.EVENTS.PARSE.READY);
        //};
      } else {
        NotifyService.notify(CONSTANTS.EVENTS.PARSE.READY);
      }
    }

    function _getConfig() {
      return _config;
    }

    function _fbLogin() {
      return $q(function(resolve, reject) {
        Parse.FacebookUtils.logIn(ENV.FACEBOOK.OPTIONS, {
          success: function(user) {
            FB.getLoginStatus(function(response) {
              var
                uid = response.authResponse.userID,
                accessToken = response.authResponse.accessToken;

              // ensure the token in stored authData is in sync with Facebook
              if (
                Parse.User.current().attributes &&
                Parse.User.current().attributes.authData &&
                Parse.User.current().attributes.authData.facebook &&
                Parse.User.current().attributes.authData.facebook.access_token &&
                Parse.User.current().attributes.authData.facebook.access_token === accessToken
              ) {
                resolve(Parse.User.current().fetch());
              } else {
                try {
                  Parse.FacebookUtils
                    .unlink(Parse.User.current(), {})
                    .then(
                      function() {
                        Parse.FacebookUtils
                          .link(Parse.User.current(), null, {
                            success: function(user) {
                              resolve(Parse.User.current().fetch());
                            },
                            error: function(error) {
                              reject(error);
                            }
                          });
                      }
                    );
                } catch (error) {
                  LogService.log($state, null, error);
                  reject(error);
                }
              }
            }, true);
            console.log('exiting FB')
          },
          error: function(user, error) {
            reject(error);
          }
        });

        // TODO: WL: Come back later
        //FB.getLoginStatus(function(response) {
        //  if (response.status === 'connected' && Parse.User.current()) {
        //    // the user is logged in and has authenticated your
        //    // app, and response.authResponse supplies
        //    // the user's ID, a valid access token, a signed
        //    // request, and the time the access token
        //    // and signed request each expire
        //    var uid = response.authResponse.userID;
        //    var accessToken = response.authResponse.accessToken;
        //
        //    // ensure the token in stored authData is in sync with Facebook
        //    if (
        //      Parse.User.current().attributes &&
        //      Parse.User.current().attributes.authData &&
        //      Parse.User.current().attributes.authData.facebook &&
        //      Parse.User.current().attributes.authData.facebook.access_token &&
        //      Parse.User.current().attributes.authData.facebook.access_token === accessToken
        //    ) {
        //      resolve(Parse.User.current().fetch());
        //    } else {
        //      try {
        //        Parse.FacebookUtils
        //          .unlink(Parse.User.current(), {})
        //          .then(
        //            function() {
        //              Parse.FacebookUtils
        //                .link(Parse.User.current(), null, {
        //                  success: function(user) {
        //                    resolve(Parse.User.current().fetch());
        //                  }
        //                });
        //            }
        //          );
        //      } catch (error) {
        //        LogService.log($state, null, error);
        //      }
        //    }
        //  } else {
        //    Parse.FacebookUtils.logIn(ENV.FACEBOOK.OPTIONS, {
        //      success: function(user) {
        //        resolve(user);
        //      },
        //      error: function(user, error) {
        //        reject(error);
        //      }
        //    });
        //  }
        //}, true);
      });
    }

    function _fbLogout() {
    }

    function _deeplink(token) {
      $analytics.eventTrack('Smartlink', {category: 'User', label: CONSTANTS.ORIGIN});
      return Parse.Cloud.run('deeplink', {token: token, origin: CONSTANTS.ORIGIN})
        .then(
          function(response) {
            maybeGlobals.promptToSetPassword = response.promptToSetPassword;
            return Parse.User.logIn(response.email, response.password);
          }
        );
    }

    /**
     * Login using user-set password, or just straight login with password
     * @param email
     * @param password
     * @param isUserPassword
     * @returns {*}
     * @private
     */
    function _login(email, password, isUserPassword) {
      $analytics.eventTrack('Login', {category: 'User', label: CONSTANTS.ORIGIN});

      if (isUserPassword === false) {
        return Parse.User.logIn(email, password);
      } else {
        return Parse.Cloud.run('login', {email: email, userPassword: password, origin: CONSTANTS.ORIGIN})
          .then(
            function(response) {
              return Parse.User.logIn(response.email, response.password);
            }
          );
      }

    }

    function _forgetPassword(email) {
      return Parse.Cloud.run('forgetPassword', {email: email});
    }

    function _resetPassword(token) {
      return Parse.Cloud.run('resetPassword', {token: token})
        .then(
          function(response) {
            return Parse.User.logIn(response.email, response.password);
          }
        );
    }

    function _setPassword(email, password, oldPassword) {
      var data = {email: email, newUserPassword: password};

      if (oldPassword) {
        data.oldUserPassword = oldPassword;
      }

      return Parse.Cloud.run('updatePassword', data)
        .then(
          function(response) {
            return Parse.User.logIn(response.email, response.password);
          }
        );
    }

    function _logout() {
      return Parse.User.logOut();
    }

    function _current() {
      return Parse.User.current();
    }

    function _updateUser(userData) {
      var user = Parse.User.current();

      return user
        .save(userData)
        .then(
          function(data) {
            return Parse.User.current().fetch();
          }
        );
    }

    function _getLink(name, email, overwrite, basket, sendWelcome) {
      if (overwrite) {
        $analytics.eventTrack('Get Link', {category: 'User', label: CONSTANTS.ORIGIN});
      } else {
        $analytics.eventTrack('Register', {category: 'User', label: CONSTANTS.ORIGIN});
      }
      return Parse.Cloud.run('getLink', {name: name, email: email, overwrite: overwrite, origin: CONSTANTS.ORIGIN, basketId: basket ? basket.id : null, sendWelcome: sendWelcome});
    }

    /**
     * Executes a Parse Query and returns its Promise
     * @param {Object} queryConfig, where: className: Query object class, equalTo: key/value pairs of criteria
     * @returns {Promise}
     * @private
     */
    function _query(queryConfig) {
      var
        ObjectClass = Parse.Object.extend(queryConfig.className),
        query = new Parse.Query(ObjectClass);

      angular.forEach(queryConfig.equalTo, function(value, attribute) {
        query.equalTo(attribute, value);
      });

      angular.forEach(queryConfig.notEqualTo, function(value, attribute) {
        query.notEqualTo(attribute, value);
      });

      angular.forEach(queryConfig.include, function(value) {
        query.include(value);
      });

      angular.forEach(queryConfig.lessThan, function(value, attribute) {
        query.lessThan(attribute, value);
      });

      angular.forEach(queryConfig.greaterThan, function(value, attribute) {
        query.greaterThan(attribute, value);
      });

      if (queryConfig.select) { query.select(queryConfig.select); }
      if (queryConfig.ascending) { query.addAscending(queryConfig.ascending); }
      if (queryConfig.descending) { query.addDescending(queryConfig.descending); }
      if (queryConfig.limit) { query.limit(queryConfig.limit); }
      if (queryConfig.skip) { query.skip(queryConfig.skip); }

      switch (queryConfig.type) {
        case 'query':
          return query.find();
          break;
        case 'count':
          return query.count();
          break;
        case 'first':
          return query.first();
          break;
        case 'get':
          return query.get(queryConfig.equalTo.objectId);
          break;
        default:
          return query.find();
          break;
      }
    }

    /**
     * Upload a file to Parse, returns its Promise
     * @param file
     * @private
     */
    function _upload(file) {
      NotifyService.notify(CONSTANTS.EVENTS.LOADING.START, '');

      var parseFile = new Parse.File(file.name.replace(/([^a-z0-9\.]+)/gi, '-'), file);

      return parseFile.save()
        .then(
          function(file) {
            NotifyService.notify(CONSTANTS.EVENTS.LOADING.DONE, '');
            return file;
          }
        );
    }

    /**
     * A wrapper to run Parse Cloud code
     * @param endpoint
     * @param params
     * @private
     */
    function _run(endpoint, params) {
      return Parse.Cloud.run(endpoint, params);
    }

    function _become(sessionToken) {
      return Parse.User.become(sessionToken);
    }

    /**
     * Given an array of users, return an Parse ACL object. If no users are given, return a public read/write ACL
     * @param users
     * @returns {Parse.ACL}
     * @private
     */
    function _configACL(users) {
      var acl = new Parse.ACL();

      acl.setPublicReadAccess(true);

      if (users && users.length > 0) {
        acl.setPublicWriteAccess(false);

        for (var i = 0; i < users.length; i++) {
          acl.setWriteAccess(users[i], true);
        }
      } else {
        acl.setPublicWriteAccess(true);
      }

      return acl;
    }

    _init();

    return {
      init: _init,
      fbLogin: _fbLogin,
      fbLogout: _fbLogout,
      deeplink: _deeplink,
      login: _login,
      logout: _logout,
      forgetPassword: _forgetPassword,
      resetPassword: _resetPassword,
      setPassword: _setPassword,
      current: _current,
      updateUser: _updateUser,
      query: _query,
      getLink: _getLink,
      upload: _upload,
      config: _getConfig,
      run: _run,
      become: _become,
      configACL: _configACL
    };
  }
})(window.Parse, window.FB, window.jQuery, maybeGlobals);
