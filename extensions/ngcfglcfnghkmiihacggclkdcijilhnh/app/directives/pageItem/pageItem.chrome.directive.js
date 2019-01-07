(function () {

  /* directive definition*/
  function cpPageItemDirective() {
    return {
      restrict: 'EA',
      templateUrl: 'app/directives/pageItem/pageItem.chrome.directive.html',
      replace: true
      //scope: true,
      //controller: 'homeController',
      //controllerAs: 'homeCtrl'
      //require: '^cpNotesList',
      //link: function(scope, element, attrs, notesListCtrl) {
      //  alert(note)
      //}
    }
  }

  /* controller */
  function pageItemController($scope, Note, $window) {
    var self = this;

  }

  angular.module('clipto')
    .directive('cpPageItem', cpPageItemDirective)
    .controller('pageItemController', ['$scope', 'Note', '$window', pageItemController]);

}());