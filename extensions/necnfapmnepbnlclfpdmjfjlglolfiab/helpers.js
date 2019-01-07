function chunk_split (body, chunklen, end) {
  //  discuss at: http://locutus.io/php/chunk_split/
  chunklen = parseInt(chunklen, 10) || 76
  end = end || '\r\n'
  if (chunklen < 1) {
    return false
  }
  return body.match(new RegExp('.{0,' + chunklen + '}', 'g'))
    .join(end)
}

function substr_count (haystack, needle, offset, length) {
  //  discuss at: http://locutus.io/php/substr_count/
  var cnt = 0
  haystack += ''
  needle += ''
  if (isNaN(offset)) {
    offset = 0
  }
  if (isNaN(length)) {
    length = 0
  }
  if (needle.length === 0) {
    return false
  }
  offset--
  while ((offset = haystack.indexOf(needle, offset + 1)) !== -1) {
    if (length > 0 && (offset + needle.length) > length) {
      return false
    }
    cnt++
  }
  return cnt
}

function array_keys (input, searchValue, argStrict) {
  //  discuss at: http://locutus.io/php/array_keys/
  var search = typeof searchValue !== 'undefined'
  var tmpArr = []
  var strict = !!argStrict
  var include = true
  var key = ''
  for (key in input) {
    if (input.hasOwnProperty(key)) {
      include = true
      if (search) {
        if (strict && input[key] !== searchValue) {
          include = false
        } else if (input[key] !== searchValue) {
          include = false
        }
      }
      if (include) {
        tmpArr[tmpArr.length] = key
      }
    }
  }
  return tmpArr
}

function max () {
  //  discuss at: http://locutus.io/php/max/
  var ar
  var retVal
  var i = 0
  var n = 0
  var argv = arguments
  var argc = argv.length
  var _obj2Array = function (obj) {
    if (Object.prototype.toString.call(obj) === '[object Array]') {
      return obj
    } else {
      var ar = []
      for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
          ar.push(obj[i])
        }
      }
      return ar
    }
  }
  var _compare = function (current, next) {
    var i = 0
    var n = 0
    var tmp = 0
    var nl = 0
    var cl = 0
    if (current === next) {
      return 0
    } else if (typeof current === 'object') {
      if (typeof next === 'object') {
        current = _obj2Array(current)
        next = _obj2Array(next)
        cl = current.length
        nl = next.length
        if (nl > cl) {
          return 1
        } else if (nl < cl) {
          return -1
        }
        for (i = 0, n = cl; i < n; ++i) {
          tmp = _compare(current[i], next[i])
          if (tmp === 1) {
            return 1
          } else if (tmp === -1) {
            return -1
          }
        }
        return 0
      }
      return -1
    } else if (typeof next === 'object') {
      return 1
    } else if (isNaN(next) && !isNaN(current)) {
      if (current === 0) {
        return 0
      }
      return (current < 0 ? 1 : -1)
    } else if (isNaN(current) && !isNaN(next)) {
      if (next === 0) {
        return 0
      }
      return (next > 0 ? 1 : -1)
    }
    if (next === current) {
      return 0
    }
    return (next > current ? 1 : -1)
  }
  if (argc === 0) {
    throw new Error('At least one value should be passed to max()')
  } else if (argc === 1) {
    if (typeof argv[0] === 'object') {
      ar = _obj2Array(argv[0])
    } else {
      throw new Error('Wrong parameter count for max()')
    }
    if (ar.length === 0) {
      throw new Error('Array must contain at least one element for max()')
    }
  } else {
    ar = argv
  }
  retVal = ar[0]
  for (i = 1, n = ar.length; i < n; ++i) {
    if (_compare(retVal, ar[i]) === 1) {
      retVal = ar[i]
    }
  }
  return retVal
}

function urlencode (str) {
  //       discuss at: http://locutus.io/php/urlencode/
  str = (str + '')
  // Tilde should be allowed unescaped in future versions of PHP (as reflected below),
  // but if you want to reflect current
  // PHP behavior, you would need to add ".replace(/~/g, '%7E');" to the following.
  return encodeURIComponent(str)
    .replace(/!/g, '%21')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/\*/g, '%2A')
    .replace(/%20/g, '+')
}
