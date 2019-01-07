/**
 * NOTES LIST DIRECTIVE
 */

(function () {

  /* directive definition*/
  function cpClipsListDirective() {
    return {
      restrict: 'EA',
      templateUrl: 'app/directives/clipsList/clipsList.chrome.directive.html',
      replace: true
    }
  }

  /* controller */
  function clipsListController($scope) {
    var self = this;

  }

  angular.module('clipto')
    .directive('cpClipsList', cpClipsListDirective)
    .controller('clipsListController', [clipsListController]);

}());