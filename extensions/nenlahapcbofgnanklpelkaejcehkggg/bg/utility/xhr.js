const Promise = require('bluebird');
const localStore = require('storage/local');
const Url = require('url');
const _ = require('lodash');

module.exports = function(method, url, data, text, headers, session) {
  return new Promise((resolve, reject) => {
    method = method || 'GET';
    const xhr = new XMLHttpRequest();
    const parsed = Url.parse(url);
    localStore.get('token').then(storage => {
      const sessionId = storage.token || false;
      xhr.open(method, url);
      if (session) {
        xhr.setRequestHeader('x-wb-session', session);
      }
      if (headers) {
        _.forEach(headers, (v, k) => {
          xhr.setRequestHeader(k, v);
        });
      } else {
        if (/\.(ivaws|ivbackend)\.com$/.test(parsed.hostname) && sessionId) {
          xhr.setRequestHeader('x-wb-session', sessionId);
        }
        if (!text) {
          xhr.setRequestHeader('content-type', 'application/json');
        }
      }
      xhr.onload = () => {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch (e) {
          resolve(xhr.responseText);
        }
      };
      xhr.onerror = () => {
        try {
          reject(JSON.parse(xhr.responseText));
        } catch (e) {
          reject(xhr.responseText);
        }
      };
      if (data) {
        xhr.send(JSON.stringify(data));
      } else {
        xhr.send();
      }
    });
  });
};
