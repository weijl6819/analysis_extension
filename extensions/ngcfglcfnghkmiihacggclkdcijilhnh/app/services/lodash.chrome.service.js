(function () {

  function LodashFactory($window) {

    if(!$window._){
      // If URI is not available you can now provide a
      // mock service, try to load it from somewhere else,
      // redirect the user to a dedicated error page, ...

      alert('OOPS, no _ Lib');
    }
    return $window._;

  }

  angular.module('clipto')
    .factory('URI',['$window', LodashFactory])

}());