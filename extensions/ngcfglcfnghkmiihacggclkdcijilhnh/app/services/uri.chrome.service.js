(function () {

  function uriFactory($window) {

    if(!$window.URI){
      // If URI is not available you can now provide a
      // mock service, try to load it from somewhere else,
      // redirect the user to a dedicated error page, ...

      alert('OOPS, no URI Lib');
    }
    return $window.URI;

  }

  angular.module('clipto')
    .factory('URI',['$window', uriFactory])

}());