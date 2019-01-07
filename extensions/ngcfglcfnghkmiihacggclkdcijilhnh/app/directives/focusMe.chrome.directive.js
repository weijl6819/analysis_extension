/**
 * see http://stackoverflow.com/questions/14833326/how-to-set-focus-on-input-field
 *
 * Name: <input type="text" lc-focus-me="shouldBeOpen">
 *
 * Define a directive and have it $watch a property/trigger so it knows when to focus the element:
 * The $timeout seems to be needed to give the modal time to render.
 */

(function () {

  /* @ngInject */
  function lcFocusMe($timeout, $parse) {
    return {
      //scope: true,   // optionally create a child scope
      link: function (scope, element, attrs) {
        var model = $parse(attrs.lcFocusMe);
        scope.$watch(model, function (value) {
          //console.log('value=', value);
          if (value === true) {
            $timeout(function () {
              element[0].focus();
            });
          }
        });
        // to address @blesh's comment, set attribute value to 'false'
        // on blur event:
        element.bind('blur', function () {
          console.log('blur');
          scope.$apply(model.assign(scope, false));
        });
      }
    };
  }

  angular.module('clipto')
    .directive('lcFocusMe', ['$timeout', '$parse', lcFocusMe]);

}());


