angular.module('clipto', ['ui.router', 'ngResource', 'ui.bootstrap', 'ngAnimate', 'ngMaterial'])
  .config([

    '$resourceProvider',
    '$stateProvider',
    '$mdThemingProvider',

    function ($resourceProvider, $stateProvider, $mdThemingProvider) {

      // Don't strip trailing slashes from calculated URLs
      //$resourceProvider.defaults.stripTrailingSlashes = false;

      // material design theme config
      $mdThemingProvider.theme('default')
        .primaryPalette('blue-grey')
        .accentPalette('orange');


      $stateProvider

        .state('home', {
          templateUrl: 'app/views/home/home.chrome.view.html',
          controller: 'homeController',
          controllerAs: 'homeCtrl',
          resolve: {
            activeTabDomain: function (AppData) {
              return AppData.getActiveTabDomain()
            },
            activeTabUrl: function (AppData) {
              return AppData.getActiveTabUrl()
            },
            activeUser: function (AppData) {
              return AppData.getActiveUser()
            },
            urlNotes: function (AppData) {
              return AppData.getUrlNotes()
            }
          }
        })
        .state('home.views', {
          views: {
            'header': {
              templateUrl: 'app/views/home/sub_views/home.header.chrome.view.html'
            },
            'footer': {
              templateUrl: 'app/views/home/sub_views/home.footer.chrome.view.html',
              controller: 'notificationsCtrl',
              controllerAs: 'notificationsCtrl'

            },
            'note': {
              templateUrl: 'app/views/home/sub_views/home.note.chrome.view.html'
            },
            'content': {
              templateUrl: 'app/views/home/sub_views/home.content.chrome.view.html'

            }
          }
        })
        //User routes
        .state('signin', {
          templateUrl: 'app/views/users/authentication/users.signin.chrome.view.html',
          controller: 'authenticationController',
          controllerAs: 'authCtrl',
          resolve: {
            gaHit: function (Events) {
              return Events.message_gaEvent({hitType: 'event', eventCategory: 'app page', eventLabel:'signin', eventAction:'open'})
            }
          }
        })
        .state('signup', {
          templateUrl: 'app/views/users/authentication/users.signup.chrome.view.html',
          controller: 'authenticationController',
          controllerAs: 'authCtrl',
          resolve: {
            gaHit: function (Events) {
              return Events.message_gaEvent({hitType: 'event', eventCategory: 'app page', eventLabel:'signup', eventAction:'open'})
            }
          }
        })
        .state('hello', {
          templateUrl: 'app/views/users/authentication/users.hello.chrome.view.html',
          controller: 'authenticationController',
          controllerAs: 'authCtrl',
          resolve: {
            gaHit: function (Events) {
              return Events.message_gaEvent({hitType: 'event', eventCategory: 'app page', eventLabel:'hello', eventAction:'open'})
            }
          }
        })
        .state('usersList', {
          templateUrl: 'app/views/users/authentication/users.usersList.chrome.view.html',
          controller: 'authenticationController',
          controllerAs: 'authCtrl',
          resolve: {
            gaHit: function (Events) {
              return Events.message_gaEvent({hitType: 'event', eventCategory: 'app page', eventLabel:'list', eventAction:'open'})
            }
          }
        })
        .state('forgot', {
          templateUrl: 'app/views/users/password/users.forgot.chrome.view.html',
          controller: 'authenticationController',
          controllerAs: 'authCtrl',
          resolve: {
            gaHit: function (Events) {
              return Events.message_gaEvent({hitType: 'event', eventCategory: 'app page', eventLabel:'forgot', eventAction:'open'})
            }
          }
        })
      //.state('password_reset_success', {
      //  templateUrl: 'app/views/users/password/passwordResetSuccess.chrome.view.html',
      //  controller: 'passwordController',
      //  controllerAs: 'passwordCtrl'
      //})

    }]);
