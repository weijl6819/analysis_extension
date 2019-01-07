(function () {

  function TruncateFilter() {
    return function (input, limit) {

      if (limit <= 0) {
        return '';
      }

      // by words
      //if (input) {
      //  var inputWords = input.split(/\s+/);
      //  if (inputWords.length > limit) {
      //    input = inputWords.slice(0, limit).join(' ') + '...';
      //  }
      //}

      //by letters
      if (input) {
        if (input.length > limit) {
          input = input.slice(0, limit) + '...';
        }
      }
      return input;
    }
  }

  angular.module('clipto')
    .filter('truncate', TruncateFilter)
}());
