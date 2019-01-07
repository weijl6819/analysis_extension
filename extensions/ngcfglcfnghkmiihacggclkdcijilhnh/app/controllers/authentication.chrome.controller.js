(function () {

  function authenticationController(LCUtils, AuthHttp, $state, $scope, AppData, Events, User, $window, $rootScope) {

    var self = this;
    var oneMonth = 30 * 24 * (60 * 60 * 1000);

    self.isShowSpinner = false;
    self.credentials = {};

    //////////////////////////////////////
    ////////// private ///////////////////
    //////////////////////////////////////

    //init user
    self.networkState = AppData.getNetworkState();
    var user = AppData.getActiveUser();
    self.user = (user && user.localUserId) ? user : new User();

    self.userProvidedName = AppData.getUserProvidedName() ? AppData.getUserProvidedName() : undefined;
    self.credentials.email = AppData.getUserEmail() ? AppData.getUserEmail() : undefined;
    self.skippedLoginUserBeforeSignUp = AppData.getSkippedLoginUserBeforeSignUp() ? AppData.getSkippedLoginUserBeforeSignUp() : undefined;

    // skipped login user that now wants to signup
    if (self.skippedLoginUserBeforeSignUp && self.skippedLoginUserBeforeSignUp.localUserId) {
      self.user = self.skippedLoginUserBeforeSignUp;
      self.userProvidedName = self.skippedLoginUserBeforeSignUp.userProvidedName;
    }

    //init users
    var users = AppData.getUsers();
    self.users = users ? users : [];


    // If user is already authenticated or skipped login, redirect back home
    if (((self.user && self.user.isAuthenticated) || (self.user && self.user.isSkipLogin && !self.user._id)) && !self.skippedLoginUserBeforeSignUp) {
      $state.go('home.views');
    }

    /**
     * CALLED ONLY AFTER SERVER RESPONSE or after skip login
     * userData is the server response in case of signup/signin
     * @param userData {user, userType}
     */
    var setUser = function (userData) {

      var user = userData.user;
      user.userType = userData.userType;
      user.isAuthenticated = true;

      AppData.setActiveUser(user);
      Events.message_newRemoteUser(user);

    };

    var cleanAppDataUser = function () {

      AppData.setUserEmail(undefined);
      //AppData.setSkippedLoginUserBeforeSignUp(undefined);
      //self.skippedLoginUserBeforeSignUp = undefined;
    };

    var setActiveUser = function (user) {
      self.user = user;
      Events.message_setActiveUser(user);
      AppData.setActiveUser(user);
    };

    //////////////////////////////////////
    /////////// public methods ///////////
    //////////////////////////////////////

    /**
     * just make AppData.goToAuthView() available to views
     * @returns {*}
     */
    self.goToAuthView = function () {
      return AppData.goToAuthView();
    };

    /**
     * user selected from users list
     * @param user
     * @param state  (signin/signup - optional. used on "add new" button
     */
    self.userSelectedClick = function (user, state) {

      setActiveUser(user);

      // we use email and not access_token because access_token is deleted on signout. skip users do not provide email.
      if (user._id || user.email || state && state === 'signin') {
        AppData.setUserEmail(user.email);
        $state.go('signin')
      }
      else if (!user._id && !user.email && user.isSkipLogin) {
        //$state.go('home.views')
        setUser({user: user, userType: 'skip'})
      }
      else if (state && state === 'hello') {
        AppData.setUserEmail(undefined);
        self.credentials.email = undefined;
        $state.go('hello');
      }
      else {
        // fallback. not supposed to happen.
        $state.go('signup')
      }
    };

    /**
     *  just set it on the service, because controller gets refreshed and loses data
     */
    self.userProvidedNameEnter = function () {
      var name = self.userProvidedName;
      var index = -1;

      if (name.length < 2) {
        self.error = 'Please fill in your name  :)'
      } else {
        for (var i = 0; i < self.users.length; i++) {
          if (name && self.users[i].userProvidedName && name.toLowerCase() === self.users[i].userProvidedName.toLowerCase()) {
            index = i;
            self.error = "Hi, "+name+ ". Seems like your name is already taken on this device. If you have already signed up, please log in or choose your name from 'choose account' user's list";
            break;
          }
        }
        if (index === -1) {
          Events.message_gaEvent({hitType: 'event', eventCategory: 'app page', eventLabel:'hello', eventAction:'name insert'});
          AppData.setUserProvidedName(name);
          $state.go('signup')
        }
      }
    };

    self.skipLogin = function () {

      //if (!self.user.isSkipLogin) {};

      self.user['isSkipLogin'] = true;
      self.user['email'] = undefined;
      self.user['password'] = undefined;
      self.user['userProvidedName'] = self.userProvidedName;


      AppData.setActiveUser(self.user); //why? - init will set
      Events.message_setActiveUser(self.user); // why? - init will set

      setUser({user: self.user, userType: 'skip'});
      Events.message_gaEvent({hitType: 'event', eventCategory: 'app page', eventLabel:'skip login', eventAction:'click'});
    };

    /**
     * helper function for setting and validating user data locally befor auth
     * @returns {*}
     */
    var setUserBeforeAuth = function () {

      var user;

      if (self.skippedLoginUserBeforeSignUp && self.skippedLoginUserBeforeSignUp.localUserId) {
        user = self.skippedLoginUserBeforeSignUp;
      }
      else {
        //make sure the active user is the one entered by the user
        user = LCUtils.findObjectInArrayOfObjects(self.users, 'email', self.credentials.email);
        user = user && user.email ? user : {};
      }

      user.password = self.credentials.password;
      user.email = self.credentials.email;
      user.userProvidedName = user.userProvidedName ? user.userProvidedName : self.userProvidedName || undefined;

      setActiveUser(user);

      // empty credentials
      self.credentials.password = undefined;

      cleanAppDataUser();

      return user;
    };

    /**
     * send signup data to server
     */
    self.signup = function () {

      var gaMessage = {hitType: 'event', eventCategory: 'app page', eventLabel:'sign up', eventAction:null};
      gaMessage.eventAction = 'click';
      var user = setUserBeforeAuth();
      self.isShowSpinner = true;

      AuthHttp.signup(user).success(function (response) {
        // If successful we assign the response to the global user model
        gaMessage.eventAction = 'success';
        setUser(response);

      }).error(function (response) {

        gaMessage.eventAction = 'fail';
        self.isShowSpinner = false;

        if (response && response !==null) {
          if (response.message.includes("The password must be at least 8 characters long.") ||
            response.message.includes("The password must contain at least one uppercase letter.") ||
            response.message.includes("The password must contain at least one special character.") ||
            response.message.includes("The password must contain at least one special number.")
          ){
            response.message = "The password must be at least 8 characters long."
          }
          else if (response.message === "11000 duplicate key error collection: clipto-dev.users index: email already exists") {
            response.message = "email already exists."
          }
          self.error = response.message;
        } else {
          //no response, server is dead. skip login instead and show message.
          //Events.onInnerAppNotification({message: "We're currently working offline. \n\ We have skipped the signup process for you, and all your data is kept safe locally and will be automatically synced to cloud. Please try signing up again later"});
          AppData.setNetworkState('offline');
          gaMessage.eventAction = 'fatal fail';
          self.skipLogin();
        }

        Events.message_gaEvent(gaMessage);
      });

    };

    /**
     * send signin data to server
     */
    self.signin = function () {

      var gaMessage = {hitType: 'event', eventCategory: 'app page', eventLabel:'sign in', eventAction:null};
      gaMessage.eventAction = 'click';
      var user = setUserBeforeAuth();
      self.isShowSpinner = true;

      AuthHttp.signin(user).success(function (response) {
        // If successful we assign the response to the global user model
        gaMessage.eventAction = 'success';
        setUser(response);

      }).error(function (response) {

        gaMessage.eventAction = 'fail';
        self.isShowSpinner = false;

        if (response && response !==null) {
          self.error = response.message;
        } else {
          self.error = "OOPS.. We are currently offline. Please try again later.";
          gaMessage.eventAction = 'fatal fail';
          AppData.setNetworkState('offline');
        }

      });

      Events.message_gaEvent(gaMessage);

    };

    /**
     * send oAuth request to server
     */
    self.goToAuthProvider = function (providerName) {

      var user = self.user;
      self.isShowSpinner = true;

      AuthHttp.goToAuthProvider(user, providerName).success(function (response) {

        if (providerName === 'google' && response && !response.user) {
          //Events.message_googleOauthChooseAccount(response);
          //console.log(response);
        } else {
          // If successful we assign the response to the global user model
          setUser(response);
        }
        // user will be redirected to the homepage by new init data from background

      }).error(function (response) {
        self.isShowSpinner = false;
        self.error = response.message;
      });
    };

    //*********** forgot password ***********************
    /**
     * Submit forgotten password email
     */
    self.askForPasswordReset = function () {
      self.success = self.error = null;

      AuthHttp.askForPasswordReset(self.credentials).success(function (response) {
        // Show user success message and clear form
        self.credentials = null;
        self.success = response.message;

      }).error(function (response) {
        // Show user error message and clear form
        self.credentials = null;
        if (response && response !==null) {
          self.error = response.message;
        } else {
          self.error = "OOPS.. We are currently offline. Please try again later.";
          AppData.setNetworkState('offline');
        }

      });
    };

    // ============================================================
    // ===================== EVENTS ===============================
    // ============================================================
    /**
     * user name enter on guide page (after first install user is redirected to guide page)
     */
    $scope.$on('clipto-guide-name-enter', function (event, data) {
      self.userProvidedName = data;
      self.userProvidedNameEnter();
      self.skipLogin();
    });

  }

  angular.module('clipto')
    .controller('authenticationController', ['LCUtils', 'AuthHttp', '$state', '$scope', 'AppData', 'Events', 'User', '$window', '$rootScope', authenticationController])

}());
