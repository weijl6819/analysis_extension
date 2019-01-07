(function () {

  function LCUtils() {

    return {

      /**
       * Generates a UUID to use as the document id, and makes sure it doesn't begin with a number (because DOM elements
       * can't use ids that don't begin with a-z)
       * @param {object} [options] optional options object.
       * @return {string} uuid string.
       */
      createUUID: function (options) {
        "use strict";
        if (!options) {
          options = {
            beginWithLetter: false
          };
        }

        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c, index) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);

          // make sure first letter is a-f
          if (options.beginWithLetter && index === 0) {
            v = (v % 6) + 0xa;// Math.max(v, 0xa);
          }

          return v.toString(16);
        });
      },

      /**
       * gets a url and returns the domain
       * @param url
       */
      extractDomainFromUrl: function (url) {
        return new Promise(function (resolve, reject) {
          var domainArray = url.match(/^[\w-]+:\/*\[?([\w\.:-]+)\]?(?::\d+)?/)[1].split(".");

          if (domainArray.length == 2) {
            resolve(domainArray.join('.'));
          }
          else {
            resolve(domainArray.splice(1).join('.'))
          }
        });
      },

      /**
       * helper function for creating random colors for tags
       *
       * @returns {string}
       */
      getRandomColor: function() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      },

      /**
       * find an Object In an Array Of Objects
       * if no matching object found, returns null
       * @param array
       * @param keyName - must be the full key name
       * @param keyValue - can be a partial of the value.
       * ex dbId: pdb_213454215 --> so keyName must be 'dbId', keyValue can be 'pdb_'
       * @returns {*}
       */
      findObjectInArrayOfObjects: function(array, keyName, keyValue) {

        var result = null;

        for (var i=0 ; i < array.length ; i++) {
          var obj = array[i];
          if (obj[keyName] == keyValue) {
            result = obj;
            break;
          } else if (obj[keyName] && obj[keyName].indexOf(keyValue) !== -1) {
            result = obj;
            break;
          }
        }

        return result;
      },

      /**
       * * Returns a random integer with $DIGITS digits
       * if isAsString = true, returns string
       * note that for more than 16 digits, Javascript freaks out and it's not covered here
       * @param digits
       * @param isAsString
       * @returns {*}
       */
      getRandomInt: function(digits, isAsString) {
        "use strict";

        if (! isAsString) {
          isAsString = false
        }

        var _min = Math.pow(10, digits-1);
        var _max;

        if (digits < 16) {
          _max = Math.pow(10, digits) - 1;
        } else if (digits === 16) {
          _max = Math.pow(10, digits) - 2;
        } else {
          return;
        }
        var result = Math.floor(Math.random() * (_max - _min + 1)) + _min;
        if (isAsString) {
          return result.toString();
        } else {
          return result;
        }
      },

      /**
       * helper function for finding objects in array
       * @param arr
       * @param prop
       * @param val
       * @returns {number}
       */
      isObjectInArray: function(arr, prop, val) {
        var result = false;
        for(var i = 0 ; i < arr.length ; i++) {
          if (arr[i][prop] === val) {
            result = true;
          }
        }
        return result
      },

      /**
       * checks if two urls are the same, event if their query string is mixed (but same parameters)
       * @param url_1
       * @param url_2
       */
      isUrlsMatch: function(url_1, url_2) {
        var uri_1 = URI(url_1), uri_2 = URI(url_2),
            host_1 = uri_1.host(), host_2 = uri_2.host(),
            path_1 = uri_1.pathname(), path_2 = uri_2.pathname(),
            query_1 = uri_1.search(true), query_2 = uri_2.search(true);

        if (url_1 === url_2) {
          return true;
        } else if (host_1 === host_2 && path_1 === path_2) {
          return _.isEqual(query_1, query_2);
        } else {
          return false
        }
      }
    }

  }

  angular.module('clipto')
    .service('LCUtils', ['URI', LCUtils])

}());