(function() {
  angular.module('maybe.directives')
    .directive('emailValidator', [
      EmailValidator
    ]);

  function EmailValidator() {
    return {
      require: '?ngModel',
      link: function(scope, element, attr, ctrl) {
        var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-z0-9!#$%&'*+/=?^_`{|}~.-]+\.[a-z0-9!#$%&'*+/=?^_`{|}~.-]+$/i;

        if (ctrl && ctrl.$validators.email) {
          // this will overwrite the default AngularJS email validator
          ctrl.$validators.email = function(modelValue) {
            return ctrl.$isEmpty(modelValue) || EMAIL_REGEXP.test(modelValue);
          };
        }
      }
    };
  }
})();
