const _ = require('lodash');
const Promise = require('bluebird');

const stores = {};

module.exports = function LocalStorageAdapter(namespace) {
  namespace = namespace || 'default';
  if (!stores[namespace]) {
    stores[namespace] = new Store(namespace);
  }
  return stores[namespace];
};

//-------------- Private methods ----------------

function Store(namespace) {
  this.namespace = namespace + ':';
}

Store.prototype.transformToNamespaceKeys = function(keys) {
  const defaultObj = {};
  if (typeof keys === 'string') {
    return this.namespace + keys;
  } else if (Array.isArray(keys)) {
    keys = _.map(
      keys,
      function(key) {
        return this.namespace + key;
      },
      this
    );
    return keys;
  } else if (keys && typeof keys === 'object') {
    _.forEach(Object.keys(keys), key => {
      defaultObj[this.namespace + key] = keys[key];
    });
    return defaultObj;
  }
  return keys;
};

Store.prototype.transformFromNamespaceKeys = function(keys) {
  let data = {};
  _.forEach(Object.keys(keys), key => {
    if (key.indexOf(this.namespace) === 0) {
      const transformedKey = key.replace(this.namespace, '');
      data[transformedKey] = keys[key];
    }
  });
  return data;
};

Store.prototype.get = function(keys) {
  return new Promise(
    function(resolve, reject) {
      chrome.storage.local.get(
        this.transformToNamespaceKeys(keys),
        resolver.bind(this, resolve, reject)
      );
    }.bind(this)
  );
};

Store.prototype.set = function(keys) {
  return new Promise(
    function(resolve, reject) {
      chrome.storage.local.set(
        this.transformToNamespaceKeys(keys),
        resolver.bind(this, resolve, reject)
      );
    }.bind(this)
  );
};

Store.prototype.remove = function(keys) {
  return new Promise(
    function(resolve, reject) {
      chrome.storage.local.remove(
        this.transformToNamespaceKeys(keys),
        resolver.bind(this, resolve, reject)
      );
    }.bind(this)
  );
};

Store.prototype.clear = function() {
  return this.get().then(
    function(data) {
      return this.remove.call(this, Object.keys(data));
    }.bind(this)
  );
};

function resolver(resolve, reject, data) {
  if (chrome.runtime.lastError) {
    reject(chrome.runtime.lastError);
  }
  resolve(data ? this.transformFromNamespaceKeys(data) : data);
}
