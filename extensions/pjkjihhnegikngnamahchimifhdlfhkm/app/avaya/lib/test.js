(function () {
  'use strict';

  var instancesEl, cmdStart, cmdStop;

  function startFrames(frames) {
    var frame = frames.shift();
    if (!frame) {
      return;
    }
    frame.contentWindow.postMessage('start', '*');
    setTimeout(startFrames, 10, frames);
  }

  function startFrame(host, user, pass, context) {
    var url = 'test.instance.html';
    var args = {
      'host': encodeURIComponent(host),
      'user': encodeURIComponent(user),
      'pass': encodeURIComponent(pass),
    };
    var q = Object.getOwnPropertyNames(args).reduce(function (r, key) {
      r.push(key + '=' + args[key]);
      return r;
    }, []).join('&');
    if (q) {
      url += '?' + q;
    }

    var frame = document.createElement('iframe');
    context.frames.push(frame);

    frame.setAttribute('scroll', 'no');
    instancesEl.appendChild(frame);
    frame.src = url;
  }
  var context = {};
  function onloaded(ev) {
    if (ev.data !== 'loaded') {
      return;
    }
    context.loaded = context.loaded + 1;
    console.log('loaded:' + context.loaded);
    if (context.loaded === context.instances) {
      console.log('real start');
      startFrames(context.frames);
    }
  }
  function start() {
    cmdStop.removeAttribute('disabled');
    cmdStart.setAttribute('disabled', 1);


    var elServer = document.getElementById('txtServer');
    var elPass = document.getElementById('txtPass');
    var elUser = document.getElementById('txtUser');
    var elIndex = document.getElementById('txtIndex');
    var elCount = document.getElementById('txtCount');
    elServer.setAttribute('disabled', 1);
    elPass.setAttribute('disabled', 1);
    elUser.setAttribute('disabled', 1);
    elIndex.setAttribute('disabled', 1);
    elCount.setAttribute('disabled', 1);

    context = { index: 0 + ((elIndex.value || 0) | 0), instances: 0 + ((elCount.value || 0) | 0), loaded: 0, frames: [] };
    window.addEventListener('message', onloaded);

    var host = elServer.value;
    for (var i = 0; i < context.instances; i++) {
      var user = elUser.value + (i + context.index);
      var pass = elPass.value;
      startFrame(host, user, pass, context);
    }
  }

  function stop() {
    cmdStart.removeAttribute('disabled');
    cmdStop.setAttribute('disabled', 1);

    var elServer = document.getElementById('txtServer');
    var elPass = document.getElementById('txtPass');
    var elUser = document.getElementById('txtUser');
    var elIndex = document.getElementById('txtIndex');
    var elCount = document.getElementById('txtCount');
    elServer.removeAttribute('disabled');
    elPass.removeAttribute('disabled');
    elUser.removeAttribute('disabled');
    elIndex.removeAttribute('disabled');
    elCount.removeAttribute('disabled');

    window.removeEventListener('message', onloaded);

    var frames = document.querySelectorAll('iframe');
    for (var i = 0; i < frames.length; i++) {
      var frame = frames[i];
      frame.parentElement.removeChild(frame);
    }
  }

  function init() {
    instancesEl = document.getElementById('instances');
    cmdStart = document.getElementById('cmdStart');
    cmdStart.addEventListener('click', start);
    cmdStop = document.getElementById('cmdStop');
    cmdStop.addEventListener('click', stop);
  }

  window.addEventListener('load', init);
})();