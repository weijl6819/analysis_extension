(function () {

  function getDomainFilter() {
    return function (url) {

      var domainArray = url.match(/^[\w-]+:\/*\[?([\w\.:-]+)\]?(?::\d+)?/)[1].split(".");

      if (domainArray.length == 2) {
        return domainArray.join('.');
      }
      else {
        return domainArray.splice(1).join('.');
      }
    }
  }

  angular.module('clipto')
    .filter('getDomain', getDomainFilter)
}());