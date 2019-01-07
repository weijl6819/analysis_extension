/**
 * SEARCH BAR DIRECTIVE
 */

(function () {

  /* directive definition*/
  function cpSearchBarDirective() {
    return {
      restrict: 'EA',
      templateUrl: 'app/directives/searchBar/searchBar.chrome.directive.html',
      replace: true
    }
  }

  angular.module('clipto')
    .directive('cpSearchBar', cpSearchBarDirective)

}());