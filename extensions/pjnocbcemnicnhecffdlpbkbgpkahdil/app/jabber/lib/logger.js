(function () {
  'use strict';

  function safeJSON(o) {
    try {
      return JSON.stringify(o);
    } catch (e) {
      return {};
    }
  }

  var tag = '[JABBER:' + location.pathname.split('/').reverse()[0] + ']';
  function exec() {
    var args = Array.prototype.slice.call(arguments);
    args = args.map(function(item) {
      if (typeof(item) !== 'object') {
        return item;
      }
      return safeJSON(item);
    }).join('::');
    this.fn.call(this.c, args);
  }
  function noop() {
  }

  var _methods = [
    { fn: console.log || console.log || noop, tag: '[l]' },
    { fn: console.info || console.log || noop, tag: '[i]' },
    { fn: console.warn || console.log || noop, tag: '[w]' },
    { fn: console.error || console.log || noop, tag: '[e]' },
    { fn: console.debug || console.log || noop, tag: '[d]' },
    { fn: console.trace || console.log || noop, tag: '[t]' },
    { fn: console.assert || console.log || noop, tag: '[a]' },
  ];
  _methods.reduce(function (r, item) {
    r[item.fn.name] = exec.bind({ fn: item.fn, c: r }, tag, item.tag);
    return r;
  }, console);

})();