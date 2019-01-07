/**
 * SEARCH BAR DIRECTIVE
 */

(function () {

  /* directive definition*/
  function cpTagsBarDirective() {
    return {
      restrict: 'EA',
      templateUrl: 'app/directives/tagsBar/tagsBar.chrome.directive.html',
      replace: true
    }
  }

  angular.module('clipto')
    .directive('cpTagsBar', cpTagsBarDirective)

}());