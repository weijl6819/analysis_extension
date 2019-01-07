(function () {

  function removeProtocolFilter() {
    return function (input) {

      if (input) {
        input = input.replace(/.*?:\/\//g, "").replace(/^www\./,'');
      }
      return input;
    }
  }

  angular.module('clipto')
    .filter('removeProtocol', removeProtocolFilter)
}());
