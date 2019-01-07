(function($, Parse){
  angular
    .module('maybe.controllers')
    .controller('ShareCtrl', [
      '$scope',
      '$location',
      '$analytics',
      'CONSTANTS',
      'ENV',
      'NotifyService',
      'AuthService',
      'ParseService',
      'BasketService',
      ShareCtrl
    ]);

  function ShareCtrl(
    $scope,
    $location,
    $analytics,
    CONSTANTS,
    ENV,
    NotifyService,
    AuthService,
    ParseService,
    BasketService
  ) {
    'use strict';

    var vm = this;

    vm.data = {
      state: '',
      user: {},
      email: '',
      baskets: [],
      shareData: {
        basket: null,
        url: $location.search().url ? $location.url().split('url=')[1] : ''         //  Retain the parameters possibly in the shared URL
      },
      deregisters: []
    };

    vm.data.shareData.url = decodeURIComponent(vm.data.shareData.url);              //  Make sure to get all params encoded correctly

    vm.setState = _setState;
    vm.addToBasket = _addToBasket;

    function _userReady() {
      try {
        chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
          vm.data.shareData.url = tabs[0].url;
        });
      } catch (err) {
        console.log(err);
      }

      if (!vm.data.user) {
        vm.data.state = 'sign-in';

        vm.data.deregisters.push(NotifyService.subscribe($scope, CONSTANTS.EVENTS.AUTH.SIGNUP.SUCCESS, _signUpSuccessHandler));
        vm.data.deregisters.push(NotifyService.subscribe($scope, CONSTANTS.EVENTS.AUTH.SIGNIN.SUCCESS, _signInSuccessHandler));
        vm.data.deregisters.push(NotifyService.subscribe($scope, CONSTANTS.EVENTS.AUTH.SIGNIN.EMAIL_SENT, _signInSentHandler));
        vm.data.deregisters.push(NotifyService.subscribe($scope, CONSTANTS.EVENTS.AUTH.PASSWORD.RESET.EMAIL_SENT, _passwordResetSentHandler));
        vm.data.deregisters.push(NotifyService.subscribe($scope, CONSTANTS.EVENTS.AUTH.PASSWORD.SET.SUCCESS, _signInSuccessHandler));
      } else {
        vm.data.state = 'share';
        _initShare();
      }
    }

    function _init() {
      vm.data.user = AuthService.currentUser();

      if (vm.data.user.sessionToken && !ParseService.current()) {
        ParseService.become(vm.data.user.sessionToken)
          .then(_userReady);
      } else {
        _userReady();
      }

    }

    function _initShare() {
      vm.data.user = AuthService.currentUser();

      BasketService
        .findMine(['name'])
        .then(
          function (baskets) {
            if (baskets.length > 0) {
              $scope.$apply(function() {
                vm.data.baskets = baskets;
              });
            }
          },
          function (error) {
            console.log(error);
          }
        );
    }

    function _addToBasket(shareData) {
      var
        promise = new Parse.Promise(),
        basket = shareData.basket,
        basketJSON;

      if (basket === 'new' || vm.data.baskets.length === 0) {
        maybe.analytics.tracker.sendEvent('Browser', 'add-item-collection', CONSTANTS.ORIGIN);

        promise = BasketService
          .create(shareData.basketName, shareData.basketContext, shareData.basketPrivacy)
          .then(
            function(b) {
              return b.toJSON();
            }
          );
      } else {
        maybe.analytics.tracker.sendEvent('Browser', 'add-item', CONSTANTS.ORIGIN);

        // Need to convert because select can't use ng-option and so can't reference an object.
        basketJSON = JSON.parse(basket);
        promise = Parse.Promise.resolve(basketJSON);
      }

      return Parse.Promise.when(promise)
        .then(
          function(b) {
            shareData.basket = b;
            shareData.basketUrl = ENV.APP.URL + '/c/' + b.objectId;

            _setState('processing');
            $scope.$apply();

            return Parse.Cloud.run('diffbot', {
              endpoint: 'product',
              url: shareData.url,
              context: shareData.context,
              shopperId: vm.data.user.id,
              basketId: b.objectId,
              origin: CONSTANTS.ORIGIN
            });
          }
        ).then(
          function() {
            _setState('done');
          },
          function() {
            _setState('error');
          }
        ).always(
          function() {
            $scope.$apply();
          }
        );
    }

    function _setState(newState) {
      vm.data.state = newState;
      return false;
    }

    function _signUpSuccessHandler(event, data) {
      vm.data.email = data.email;
      _setState('password-set');
    }

    function _signInSuccessHandler(event, data) {
      // triggers nav change
      NotifyService.notify(CONSTANTS.EVENTS.AUTH.CHANGE, data);

      _initShare();
      _setState('share');
    }

    function _signInSentHandler(event, data) {
      _setState('email-sent');
    }

    function _passwordResetSentHandler(event, data) {
      _setState('password-reset-sent');
    }

    try {
      _init();
    } catch (error) {
      if (error.message.indexOf(CONSTANTS.MESSAGES.ERROR_PARSE_INITIALIZE) > -1) {
        NotifyService.subscribe($scope, CONSTANTS.EVENTS.PARSE.READY, _init);
      }
    }
  }
})(window.jQuery, Parse);
