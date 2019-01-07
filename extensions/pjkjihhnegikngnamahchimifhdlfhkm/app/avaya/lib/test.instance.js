(function () {
  'use strict';

  function extractContext() {
    var q = (location.search || '?').substr(1);
    return q.split('&').reduce(function (r, item) {
      var kv = item.split('=');
      var key = kv.shift();
      var val = kv.join('=');
      r[key] = val;
      return r;
    }, { });
  }

  var statusEls = { };
  function updateStatus(id, text, color) {
    if (!statusEls[id]) {
      statusEls[id] = document.getElementById(id);
    }
    if (!statusEls[id]) {
      return;
    }
    if (text) {
      statusEls[id].textContent = text || '';
    }
    if (color) {
      statusEls[id].style.backgroundColor = color;
    }
  }

  var bytesRx = 0, bytesTx = 0;
  function handler(info) {
    if (typeof(info.connection) !== 'undefined') {
      updateStatus('connection', 'socket:' + (info.connection ? 'on' : 'off'), info.connection ? 'green' : 'red');
    }
    if (typeof(info.status) !== 'undefined') {
      updateStatus('phone', 'phone:' + (info.status === 1 ? 'on' : 'off'), info.status === 1 ? 'green' : 'red');
    }
    if (typeof(info.connectionRx) !== 'undefined') {
      bytesRx += info.connectionRx;
      updateStatus('sockRx', 'Rx:' + bytesRx);
    }
    if (typeof(info.connectionTx) !== 'undefined') {
      bytesTx += info.connectionTx;
      updateStatus('sockTx', 'Tx:' + bytesTx);
    }
  }

  var client, args;
  function start(args) {
    if (!client) {
      client = new window['MTCTIClient']();
      client.init({ 'host': args.host, 'user': args.user, 'pass': args.pass, 'noPreflight': 1 }, handler);
    }
  }

  function init() {
    args = extractContext();
    updateStatus('user', 'User:' + args.user);
    window.addEventListener('message', function (ev) {
      if (ev.data !== 'start') {
        return;
      }
      start(args);
    });
    window.parent.postMessage('loaded', '*');
  }

  window.addEventListener('load', init);
})();