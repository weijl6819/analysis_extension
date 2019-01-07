/** @see http://stackoverflow.com/questions/17470790/how-to-use-a-keypress-event-in-angularjs
 *
 * Functionality is the same like facebook comments
 * enter exectutes delivered function.
 * shift+enter, alt+enter, ctrl+enter jumps line
 * command+enter does nothing
 */
(function () {

  /* @ngInject */
  function lcEnter() {
    return {
      restrict: 'EA',
      link: function (scope, element, attrs) {

        element.bind("keydown keypress", function (event) {
          if (event.which === 13 || event.which === 10) {
            if (event.shiftKey) {
              // do nothing, shift key already jumps line
            }
            else if (event.ctrlKey) {
              // do nothing
              //console.log(element[0].value);
              //element[0].value = element[0].value.replace(/\r\n?|\n/g, '\n');
              //console.log(element[0].value);
            }
            else if (event.altKey) {
              // do nothing
            }
            else if (event.metaKey) {
              // do nothing
            }
            else {
              // enter pressed without jump line key - apply function
              scope.$apply(function () {
                scope.$eval(attrs.lcEnter);
              });

              event.preventDefault();
            }
          }
        });
      }
    };
  }

  angular.module('clipto')
    .directive('lcEnter', lcEnter);

}());