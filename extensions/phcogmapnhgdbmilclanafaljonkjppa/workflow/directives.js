'use strict';

/* Directives */


angular.module('goalBuddy.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]).
  directive('loading', function () {
      return {
        restrict: 'E',
        replace:true,
        template: '<div class="loading">LOADING...</div>',
        link: function (scope, element, attr) {
              scope.$watch('loading', function (val) {
                  if (val)
                      $(element).show();
                  else
                      $(element).hide();
              });
        }
      }
  });