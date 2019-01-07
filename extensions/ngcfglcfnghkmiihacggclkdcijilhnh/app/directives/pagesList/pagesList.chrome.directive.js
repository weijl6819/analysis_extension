/**
 * NOTES LIST DIRECTIVE
 */

(function () {

  /* directive definition*/
  function cpPagesListDirective() {
    return {
      restrict: 'EA',
      templateUrl: 'app/directives/pagesList/pagesList.chrome.directive.html',
      replace: true
    }
  }

  /* controller */
  function pagesListController($scope) {
    var self = this;

  }

  angular.module('clipto')
    .directive('cpPagesList', cpPagesListDirective)
    .controller('pagesListController', [pagesListController]);

}());