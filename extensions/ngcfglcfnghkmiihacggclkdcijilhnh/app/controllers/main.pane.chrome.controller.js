
(function () {

  function mainPaneController($scope, $state, Events, AppData, AuthHttp) {

    //disable console.log
    console.log = function() {};

    //****************************************************************//
    //******************** PRIVATE VARIABLES *************************//
    //****************************************************************//

    //****************************************************************//
    //******************** GLOBALS ***********************************//
    //****************************************************************//


    var self = this;
    self.activeTabUrl = '';

    // TODO: this whole thing should happen on first app open, and THEN get the init data ready event
    $scope.$on('pane-init-data-ready', function(e, value) {
      var user = AppData.getActiveUser();

      if (user && user.access_token) {
        // authenticate user and sync
        AuthHttp.authenticate(user.access_token).then(function (response) {
          var resUser = response.data;
          console.log(response);

          if (response.status === 200 && resUser) {
            user.isAuthenticated = true;
            AppData.setActiveUser(user);
            Events.message_onUserAuthenticated(resUser);
            $state.go('home.views')
          } else {
            AppData.goToAuthView();
          }
        }).catch(function (err) {

          console.log(err);

          //TODO: handle this
          if (err.status >= 500) {
            console.log('500 server error');
            AppData.setNetworkState('offline');
            $state.go('home.views');
          } else if (err.status >=400 && err.status < 500) {
            // 400s send back to signin
            AppData.goToAuthView();
          } else if (err.status === -1) {
            // CORS error
            console.log('-1 server error');
            AppData.setNetworkState('offline');
            $state.go('home.views');
          } else {
            // what else can happen?
            AppData.goToAuthView();
          }
        });

      }
      // skip user
      else if (user && user.isSkipLogin && !user.access_token) {
        $state.go('home.views');
      }
      // no active user
      else
      {
        AppData.goToAuthView();
      }


    });

    self.closePane = function() {
      Events.message_closePane();
    };

    //****************************************************************//
    //******************** PRIVATE FUNCTIONS *************************//
    //****************************************************************//

    //****************************************************************//
    //******************** EVENTS ************************************//
    //****************************************************************//

    //****************************************************************//
    //******************** MESSAGES **********************************//
    //****************************************************************//


    //****************************************************************//
    //******************** INIT **************************************//
    //****************************************************************//

    // notify content script we are loaded
    Events.message_paneLoaded();

    // listen to the Control Center (background.js) messages
    chrome.runtime.onMessage.addListener(Events.onBackgroundMessage);

  }

  angular.module('clipto')
    .controller('mainPaneController', ['$scope', '$state', 'Events', 'AppData', 'AuthHttp', mainPaneController])

}());
