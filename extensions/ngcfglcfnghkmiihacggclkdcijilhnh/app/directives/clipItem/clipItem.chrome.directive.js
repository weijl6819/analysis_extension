(function () {

  /* directive definition*/
  function cpClipItemDirective() {
    return {
      restrict: 'EA',
      templateUrl: 'app/directives/clipItem/clipItem.chrome.directive.html',
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
  function clipItemController($scope, Note, $window) {
    var self = this;

  }

  angular.module('clipto')
    .directive('cpClipItem', cpClipItemDirective)
    .controller('clipItemController', ['$scope', 'Note', '$window', clipItemController]);

}());