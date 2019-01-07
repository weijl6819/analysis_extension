/**
 * AUTH HEADER DIRECTIVE
 */

(function () {

  /* directive definition*/
  function cpAuthHeaderDirective() {

    return {
      restrict: 'EA',
      templateUrl: 'app/directives/auth/header/auth.header.chrome.directive.html',
      replace: true
    }
  }

  angular.module('clipto')
    .directive('cpAuthHeader', cpAuthHeaderDirective)

}());