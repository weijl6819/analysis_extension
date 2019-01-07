(function () {
  'use strict';

  var terminal;
  function echoInfo(message) {
    console.info(message);
    terminal.echo(message, {
      finalize : function (div) {
        div.css('color', 'green');
      }
    });
  }
  function echoStatus(message) {
    console.info(message);
    terminal.echo(message, {
      finalize : function (div) {
        div.css('color', 'lightgray');
      }
    });
  }

  function echoWarn(message) {
    console.warn(message);
    terminal.echo(message, {
      finalize : function (div) {
        div.css('color', 'yellow');
      }
    });
  }
  function echoError(message) {
    console.error(message);
    terminal.echo(message, {
      finalize : function (div) {
        div.css('color', 'red');
      }
    });
  }

  var client, capabilities, status, calls, selfPresence;
  function clientHandler(info) {
    if (info.connectionTx || info.connectionRx) {
      return;
    }
    status = status || { };
    calls = calls || { };
    
    if (typeof(info.status) !== 'undefined') {
      status.phone = info.status;
      switch (info.status) {
        case 0:
          echoInfo('waiting for phone');
          break;
        case 1:
          echoInfo('phone in service');
          break;
        case 2:
          echoWarn('client reconnecting');
          break;
        case 3:
          echoInfo('client disconnected');
          status = null;
          capabilities = null;
          client = null;
          calls = null;
          selfPresence = null;
          break;
      }
      return;
    }

    if (typeof(info.connection) !== 'undefined') {
      status.connection = info.connection;
      switch (info.connection) {
        case 1: 
          echoInfo('mtcti channel connected'); 
          break;
      }
      return;
    }
    if (info.capability) {
      capabilities = info.capability;
      echoStatus('scap: ' + JSON.stringify(info.capability));
    } else if (info.mwi) {
      echoStatus('smwi: ' + JSON.stringify(info.mwi));
    } else if (info.callinfo) {
      if (info.callinfo.state === 'OnHook') {
        var local = document.getElementById('local');
        var remote = document.getElementById('remote');
        local.srcObject = null;
        remote.srcObject = null;
        
        delete calls['' + info.callinfo.id];
      } else {
        calls['' + info.callinfo.id] = info.callinfo;
      }
      echoStatus('call:' + JSON.stringify(info.callinfo));
    } else if (info.rtcinfo) {
      var local = document.getElementById('local');
      var remote = document.getElementById('remote');
      local.srcObject = info.rtcinfo.call.getLocalStream();
      setTimeout(function () {
        remote.srcObject = info.rtcinfo.call.getRemoteStream();
      }, 1000);
      echoStatus('rtc:' + JSON.stringify({ id: info.rtcinfo.id }));
    } else if (info.searchinfo) {
      var res = (info.searchinfo.entries || []);
      if (res.length === 0) {
        echoStatus('search:no results');
      } else {
        res.forEach(function (item) {
          echoStatus('search:' + JSON.stringify(item));
        });
      }
    } else if (info.person) {
      echoStatus('pcnt:' + info.cmd + JSON.stringify(info.person));
    } else if (info.myself) {
      echoStatus('scnt:' + JSON.stringify(info.myself));
    } else if (info.presence) {
      echoStatus('pres:' + JSON.stringify(info.presence));
    } else if (info.self) {
      selfPresence = info.self;
      echoStatus('self:' + JSON.stringify(selfPresence));
    } else {
      echoInfo('res:' + JSON.stringify(info));
    }
  }

  function initClient(host, user, pass, mode) {
    if (client) {
      echoWarn('Already initialized');
    } else {
      client = new window['MTCTIClient']();
      client.init({ 'host': host || '', 'user': user || '', 'pass': pass || '', 'explicit': 1, 'noretry': true, mode: mode || 'cti' }, clientHandler);
    }
  }
  function initClientCTI(host, user, pass) {
    initClient(host, user, pass, 'cti');
  }
  function initClientRTC(host, user, pass) {
    initClient(host, user, pass, 'rtc');
  }

  function shutClient() {
    if (!client) {
      echoWarn('Not initialized');
    } else {
      client.shut();
      status = null;
      capabilities = null;
      client = null;
      calls = null;
      selfPresence = null;
    }
  }

  function padRight(v, l) {
    var a = new Array(l - v.length);
    return v + a.join(' ');
  }
  function showHelp() {
    echoInfo('Available commands:');
    var maxArgs = 0;
    Object.getOwnPropertyNames(commands).forEach(function (cmd) {
      var cmdInfo = commands[cmd];
      var args = cmd + ' ' + cmdInfo.args || '';
      if (args.length > maxArgs) {
        maxArgs = args.length;
      }
    });
    Object.getOwnPropertyNames(commands).forEach(function (cmd) {
      var cmdInfo = commands[cmd];
      if (cmdInfo.handler) {
        echoInfo('    ' + padRight(cmd + ' ' + (cmdInfo.args || ''), maxArgs + 4) + ' - ' + cmdInfo.desc);
      } else {
        echoWarn('    ' + padRight(cmd + ' ' + (cmdInfo.args || ''), maxArgs + 4) + ' - ' + cmdInfo.desc + ' - not implemented yet');
      }
    });
  }
  function showCapabilities() {
    if (!capabilities) {
      echoWarn('Capabilities not available');
    } else {
      echoStatus('capabilities:' + JSON.stringify(capabilities));
    }
  }
  function showStatus() {
    if (!status) {
      echoWarn('Status not available');
    } else {
      echoStatus('status:' + JSON.stringify(status));
    }
  }
  function listcalls() {
    if (!calls) {
      echoWarn('Calls not available');
    } else {
      var ids = Object.getOwnPropertyNames(calls);
      if (!ids.length) {
        echoStatus('No active calls');
      } else {
        ids.forEach(function (id) {
          echoStatus('call:' + JSON.stringify(calls[id]));
        });
      }
    }
  }
  function presence(app, label) {
    if (!client) {
      echoWarn('not initialized');
      return;
    }
    if (!status || (status.connection !== 1)) {
      echoWarn('not connected');
      return;
    }
    client.setPresence(app, label);
  }
  function contactAdd(id) {
    if (!client) {
      echoWarn('not initialized');
      return;
    }
    if (!status || (status.connection !== 1)) {
      echoWarn('not connected');
      return;
    }
    client.contactAdd(id);
  }
  function contactRemove(id) {
    if (!client) {
      echoWarn('not initialized');
      return;
    }
    if (!status || (status.connection !== 1)) {
      echoWarn('not connected');
      return;
    }
    client.contactRemove(id);
  }
  function contactUpdate(id, favourite) {
    if (!client) {
      echoWarn('not initialized');
      return;
    }
    if (!status || (status.connection !== 1)) {
      echoWarn('not connected');
      return;
    }
    client.contactUpdate(id, 0 | favourite);
  }

  function contactSearch(query) {
    if (!client) {
      echoWarn('not initialized');
      return;
    }
    if (!status || (status.connection !== 1)) {
      echoWarn('not connected');
      return;
    }
    if (!query) {
      echoWarn('search criteria missing');
      return;
    }
    client.search({ key: 'S' + Date.now(), query: query });
  }

  function checkPhone() {
    if (!client) {
      echoWarn('not initialized');
      return;
    }
    if (!status || (status.phone !== 1)) {
      echoWarn('phone not connected');
      return;
    }
    return true;
  }
  function getCall(callId) {
    if (!checkPhone()) {
      return;
    }
    var call = (calls || {})[callId];
    if (!call) {
      echoWarn('call does not exist');
      return;
    }
    return call;
  }

  function dialVM() {
    if (!checkPhone()) {
      return;
    }
    if (client._opt.mode !== 'rtc') {
      client.dialVoicemail();
    } else if (client._opt.mode === 'rtc') {
      if (!selfPresence || !selfPresence.ccwebrtc) {
        echoWarn('webrtc is not supported:' + JSON.stringify(selfPresence));
      } else {
        client.dialVoicemailRTC();
      }
    }
  }
  function dial(address, mode) {
    if (!checkPhone()) {
      return;
    }
    if (client._opt.mode !== 'rtc') {
      client.dial(address);
    } else if (client._opt.mode === 'rtc') {
      if (!selfPresence || !selfPresence.ccwebrtc) {
        echoWarn('webrtc is not supported:' + JSON.stringify(selfPresence));
      } else {
        client.dialRTC(address);
      }
    }
  }

  function hangup(callId) {
    var call= getCall(callId);
    if (!call) {
      return;
    }
    if (call.features.indexOf('DROP') < 0) {
      echoWarn('command is not supported in current state:' + JSON.stringify(call.features));
      return;
    }
    client.hangup(call.id);
  }
  function hold(callId) {
    var call= getCall(callId);
    if (!call) {
      return;
    }
    if (call.features.indexOf('HOLD') < 0) {
      echoWarn('command is not supported in current state:' + JSON.stringify(call.features));
      return;
    }
    client.hold(call.id);
  }
  function resume(callId) {
    var call= getCall(callId);
    if (!call) {
      return;
    }
    if (call.features.indexOf('UNHOLD') < 0) {
      echoWarn('command is not supported in current state:' + JSON.stringify(call.features));
      return;
    }
    client.resume(call.id);
  }
  function sendDtmf(callId, dtmf) {
    var call= getCall(callId);
    if (!call) {
      return;
    }
    if (call.features.indexOf('GENERATEDIGITS') < 0) {
      echoWarn('command is not supported in current state:' + JSON.stringify(call.features));
      return;
    }
    if (!dtmf) {
      echoWarn('dtmf not specified');
      return;
    }
    client.dtmf(call.id, dtmf);
  }
  function transfer(callId, targetCallId) {
    var call1 = getCall(callId);
    if (!call1) {
      return;
    }
    var call2 = getCall(targetCallId);
    if (!call2) {
      return;
    }
    client.transfer(call1.id, call2.id);
  }
  function merge(callId, targetCallId) {
    var call1 = getCall(callId);
    if (!call1) {
      return;
    }
    var call2 = getCall(targetCallId);
    if (!call2) {
      return;
    }
    client.join(call1.id, call2.id);
  }
  function testRTCLocal() {
    var RTCCall = window.MTRTCCall;

    var c1 = new RTCCall({ callId: 1 });
    var c2 = new RTCCall({ callId: 2 });

    var local = document.getElementById('local');
    var remote = document.getElementById('remote');

    Promise.resolve().then(function () {
      echoStatus('test:s1');
      return c1.startOutbound();
    }).then(function (sdp1) {
      echoStatus('test:s2');
      local.srcObject = c1.getLocalStream();
      return c2.startInbound(sdp1);
    }).then(function (sdp2) {
      echoStatus('test:s3');
      return c1.setRemoteDescription('answer', sdp2);
    }).then(function () {
      echoStatus('test:s4');
      return new Promise(function (resolve, reject) {
        setTimeout(resolve, 1000);
      });
    }).then(function () {
      echoStatus('test:s5');
      remote.srcObject = c1.getRemoteStream();
      return new Promise(function (resolve, reject) {
        setTimeout(resolve, 30000);
      });
    }).then(function () {
      echoStatus('test:s6');
      local.srcObject = null;
      remote.srcObject = null;

      c1.dispose();
      c2.dispose();
    }).then(function () {
      echoStatus('testDone');
    }, function (e) {
      echoWarn('err:' + e);
    });
  }
  function decodeMTCTI (b64) {
    var args = atob(b64);
    args = Array.prototype.map.call(args, function (v) {
      return v.charCodeAt(0);
    });
    var data = new Uint8Array(args);
    var sock = new window.MTCTISocket();
    var res = sock.decode(data);

    echoStatus('decode:' + JSON.stringify(res));
  }

  var commands = {
    'help': { args: '', desc: 'shows this text', handler: showHelp },
    'initcti': { args: '<host> <user> <pass>', desc: 'opens MTCTI connection in cti mode', handler: initClientCTI },
    'initrtc': { args: '<host> <user> <pass>', desc: 'opens MTCTI connection in rtc mode', handler: initClientRTC },

    'shut': { args: '', desc: 'closes MTCTI connection', handler: shutClient },
    //'wait': { args: '<seconds>', desc: 'waits before processing another command', handler: shutClient },

    'capabilities': { args: '', desc: 'prints capabilities', handler: showCapabilities },
    'status': { args: '', desc: 'prints connection status', handler: showStatus },

    'presence': { args: '<Available|Busy|Away|DND> <label>', desc: 'sets own presence status and label', handler: presence },

    'contact-add': { args: '<search-refid>', desc: 'adds contact to personal list by on search id', handler: contactAdd },
    'contact-remove': { args: '<contact-id>', desc: 'removes contact from personal list by contact id', handler: contactRemove },
    'contact-update': { args: '<contact-id> <favourite>', desc: 'updates contact favourite flag by contact id', handler: contactUpdate },
    'contact-search': { args: '<query>', desc: 'searches directory', handler: contactSearch },
    
    'listcalls': { args: '', desc: 'prints active calls', handler: listcalls },

    'call': { args: '<address>', desc: 'starts a new call', handler: dial },
    'callvm': { args: '', desc: 'starts a new call to voicemail', handler: dialVM },
    'end': { args: '<call-id>', desc: 'ends call', handler: hangup },
    'answer': { args: '<call-id>', desc: 'answers call' },
    'hold': { args: '<call-id>', desc: 'puts call on hold', handler: hold },
    'unhold': { args: '<call-id>', desc: 'resumes call', handler: resume },
    'transfer': { args: '<call-id> <target-call-id>', desc: 'transfers call', handler: transfer },
    'merge': { args: '<call-id> <target-call-id>', desc: 'merges two calls', handler: merge },
    'senddtmf': { args: '<call-id> <dtmf>', desc: 'sends dtmf', handler: sendDtmf },

    'testlocal': { args: '', desc: 'local rtc test', handler: testRTCLocal },
    'decode-b64': { args: '<b64-data>', desc: 'decode mtcti.proto', handler: decodeMTCTI }
  };
  function processCommand(command) {
    var cmds = command.split('\n');
    cmds.forEach(function (command) {
      var args = command.split(' ');
      var cmd = args.shift();
      var cmdInfo = commands[cmd];
      if (!cmdInfo || !cmdInfo.handler) {
        echoWarn('Unknown command \'' + cmd + '\'');
      } else {
        cmdInfo.handler.apply(this, args);
      }
    });
  }
  function terminalInitialized(_terminal) {
    terminal = _terminal;

    echoInfo('MTCTI Test app');
    echoInfo('Type help for the list of available commands');
    $('#term').click();
  }

  jQuery(function($, undefined) {
    $('#term').terminal(function(command, terminal) {
      terminal = terminal;
      processCommand(command);
    }, {
      greetings : '',
      name : 'mtcti',
      prompt : 'mtcti> ',
      onInit : terminalInitialized,
      convertLinks : false
    });
  });

})();