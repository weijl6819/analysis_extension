const Promise = require('bluebird');
const _ = require('lodash');

const SUFFIX = 'Async';

// See https://github.com/petkaantonov/bluebird/blob/master/API.md#promisepromisifyallobject-target--object-options---object
// for more information

function promisifier(fn) {
  return function(...callArgs) {
    const self = this;
    return new Promise((resolve, reject) => {
      fn.apply(self, [
        ...callArgs,
        function() {
          const error = chrome.runtime.lastError;
          if (error) {
            reject(error);
          } else {
            resolve.apply(null, arguments);
          }
        }
      ]);
    });
  };
}

module.exports = function(receiver, methods) {
  const opts = {
    promisifier,
    suffix: SUFFIX,
    filter: (name, func, target, passesDefaultFilter) => {
      return (
        passesDefaultFilter && !target[name + SUFFIX] && (!methods || _.includes(methods, name))
      );
    }
  };
  Promise.promisifyAll(receiver, opts);
};
