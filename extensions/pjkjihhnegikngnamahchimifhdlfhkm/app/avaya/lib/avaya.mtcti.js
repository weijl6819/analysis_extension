(function () {

  var Promise = window.Promise;

  var Utils = (function () {
    function padLeft(v, n) {
      var c = '0';
      var r = '';
      for (var i = 0; i < n; i++) {
        r += c;
      }
      r += v;
      return r.substr(r.length - n, n);
    }
    function dumpHex(arr) {
      return [].reduce.call(arr, function (r, b, index) {
        if ((index % 16) === 0) {
          r.lines.push(padLeft(index.toString(16), 4));
        }
        r.lines[r.lines.length - 1] += ' ' + padLeft(b.toString(16), 2);
        return r;
      }, { lines: [] }).lines.join('\n');
    }
    function updateKey(s, d, key) {
      if (s[key] !== d[key]) {
        s[key] = d[key];
        return true;
      }
      return false;
    }

    return {
      dumpHex: dumpHex,
      updateKey: updateKey,
    };
  })();

  var Socket = (function () {
    var log = console.info.bind(console, '[MTWSC]');

    function Socket(cb) {
      this.cb = cb;
      this.onwso = this.onwso.bind(this);
      this.onwsm = this.onwsm.bind(this);
      this.onwsc = this.onwsc.bind(this);
      this.onwse = this.onwse.bind(this);
    }
    Socket.prototype.open = function open(uri, proto) {
      log('ws:open');
      this.close();

      var ws = this.ws = new WebSocket(uri, proto);
      ws.binaryType = 'arraybuffer';
      ws.onopen = this.onwso;
      ws.onmessage = this.onwsm;
      ws.onclose = this.onwsc;
      ws.onerror = this.onwse;
    };
    Socket.prototype.send = function send(data) {
      if (this.ws) {
        log('ws:send', data.length);
        this.ws.send(data);
      }
    };
    Socket.prototype.close = function close() {
      var ws = this.ws;
      if (!ws) {
        return;
      }
  
      log('ws:close');
      this.ws = null;
      ws.close();
    };
    Socket.prototype.onwso = function onwso(ev) {
      if (!this.ws) {
        return;
      }
      log('ws:onwso', ev);
      this.cb(true, ev);
    };
    Socket.prototype.onwsc = function onwsc(ev) {
      if (!this.ws) {
        return;
      }
      this.ws = null;
      log('ws:onwsc', ev);
      this.cb(false, ev);
    };
    Socket.prototype.onwse = function onwse(ev) {
      if (!this.ws) {
        return;
      }
      this.ws = null;
      log('ws:onwse', ev);
      this.cb(false, ev);
    };
    Socket.prototype.onwsm = function onwsm(ev) {
      if (!this.ws) {
        return;
      }
      var data = new Uint8Array(ev.data);
      log('ws:onwsm', data.length);
      return this.cb(data, ev);
    };
  
    return Socket;
  })();

  var MTCTI = (function () {
    var logInfo = console.info.bind(console, '[MTPBF]');

    function noop() {
    }

    function MTCTI(opt) {
      opt = opt || {};

      this._cb = opt.cb || noop;

      this._pbuf = window.protobuf;
      this._pver = 0x01000000;
      this._ids = { request: 0, subscribe: 0, cmdinst: 0 };

      this._sock = new Socket(this._recv.bind(this));
    }
    MTCTI.prototype._getUri = function (opt, noUser, endpoint) {
      var proto = opt.proto || 'wss://';
      var host = opt.host || 'localhost';
      var port = opt.port || '';
      var user = opt.user || '';
      var pass = opt.pass || '';
      var path = endpoint || opt.path || '/tpkt/mtcti';
      var token = opt.token || '';

      var uri;
      if (noUser) {
        uri = 'https://' + host + (port ? ':' + port : '') + path;
      } else if (token) {
        uri = proto + host + (port ? ':' + port : '') + path + '?' + token;
      } else {
        uri = proto + (user ? (pass ? encodeURIComponent(user) + ':' + encodeURIComponent(pass) : encodeURIComponent(user)) + '@' : '') + host + (port ? ':' + port : '') + path;
      }
      return uri;
    };

    MTCTI.prototype.login = function (sid, opt) {
      var self = this;
      var sessionId = this.sessionId;
      if (!sessionId) {
        return;
      }
      if (sid !== sessionId) {
        return;
      }

      if (opt.token || opt.explicit || opt._explicit) {
        var uri = self._getUri(opt);
        self._sock.open(uri, 'mtcti');
        return;
      }

      var res = { token: { }, user: { } };
      var fn = opt.fetch || window.fetch;
      var auth = 'Basic ' + btoa(opt.user + ':' + opt.pass);

      var uriAuth1 = self._getUri(opt, true, '/tpkt/gettoken/mtcti');
      var dfd1 = fn(uriAuth1, { headers: { 
        'authorization': auth,
      }}).then(function (r) {
        if (r.status > 400) {
          throw { fatal: true };
        }
        return r.text();
      }, function (e) {
        throw { retry: true, error: e };
      }).then(function (r) {
        if (r.indexOf('token=') === 0) {
          res.token = { token: r };
        } else {
          res.token = { token: '' };
        }
      }, function (e) {
        res.token = e;
      });

      var uriAuth2 = self._getUri(opt, true, '/tpkt/mtcti');
      var uriHeaders2 = { 'authorization': auth };

      var dfd2 = fn(uriAuth2, { headers: uriHeaders2 }).then(function (r) {
        if (r.status === 0) {
          res.user = { retry: true };
        } else if ((r.status >= 400) && (r.status !== 403)) {
          res.user = { fatal: true };
        } else {
          res.user = { ready: true };
        }
      }, function () {
        res.user = { retry: true };
      });

      Promise.all([dfd1, dfd2]).then(function () {
        if (res.token.fatal && res.user.fatal) {
          // both failed, lets fail
          self._cb(0);
        } else if (res.token.token) {
          // token obtained, we'll use token
          opt.token = res.token.token;
          self.login(sid, opt);
        } else if (res.user.ready) {
          // user validated, we'll use user/pass
          opt._explicit = true;
          self.login(sid, opt);
        } else {
          // high chance of network failure - retry
          setTimeout(function () {
            self.login(sid, opt);
          }, 1000);
        }
      });
    };

    MTCTI.prototype.open = function (opt) {
      this._opt = opt = opt || {};
      opt.token = null;
      opt._explicit = false;

      var uriLog = this._getUri({ proto: opt.proto, host: opt.host, port: opt.port, user: opt.user, pass: opt.pass ? '******' : '', path: opt.path });
      logInfo('_open:', uriLog);

      this._ids = { request: 0, subscribe: 0, cmdinst: 0 };

      var self = this;
      self.sessionId = 'S' + Date.now();

      this.login(self.sessionId, opt);
    };
    MTCTI.prototype.close = function () {
      logInfo('_close:');
      var opt = this._opt || {};
      opt.token = null;
      opt._explicit = false;

      this.sessionId = null;
      this._sock.close();
    };

    MTCTI.prototype._ruid = function (msg) {
      var type = msg.payload;
      var mt = msg[type] || { };
      if ((type !== 'notifyack') && !mt.requestid) {
        mt.requestid = ++this._ids.request;
      }
      if (type === 'generalcmd') {
        var mc = mt[mt.payload];
        if (!mc.cmdinst) {
          mc.cmdinst = ++this._ids.cmdinst;
        }
      }
      return msg;
    };
    MTCTI.prototype._suid = function (msg) {
      if (msg.subscribe && !msg.subscribe.subscribeId) {
        msg.subscribe.subscribeId = ++this._ids.subscribe;
      }
      return msg;
    };
    MTCTI.prototype.send = function (msg) {
      var def = this._pbuf.roots.default;
      var w = this._pbuf.Writer.create();
      w.fixed32(this._pver);

      var _msg = def.Message.fromObject(msg);
      _msg = this._ruid(_msg);
      _msg = this._suid(_msg);
      logInfo('_tsend:', JSON.stringify(_msg));

      var data = def.Message.encode(_msg, w).finish();

      this._logBin('_bsend:', data);
      this._sock.send(data);
    };
    MTCTI.prototype.decode = function (data) {
      var def = this._pbuf.roots.default;
      var r = this._pbuf.Reader.create(data);
      var v = r.fixed32();
      if (v !== this._pver) {
        logInfo('_brecv:ver', v);
      }

      var res;
      try {
        res = def.Message.decode(r);
      } catch (e) {
        res = { error: e, toJSON: function () { return this; } };
      }
      return res;
    };
    MTCTI.prototype._recv = function (data) {
      if (data === false) {
        logInfo('_trecv:', data);
        this._cb(data);
        return;
      } else if (data === true) {
        logInfo('_trecv:', data);
        this._cb(data);
        return;
      }

      this._logBin('_brecv:', data);

      var res = this.decode(data);

      logInfo('_trecv:', JSON.stringify(res.toJSON()));
      this._cb(res);
    };
    MTCTI.prototype._logBin = function (tag, data) {
      var hex = Utils.dumpHex(data).split('\n');
      hex.forEach(function (line) {
        logInfo(tag, line);
      });
    };

    return MTCTI;
  })();

  var RTCCall = (function () {
    var instance = 0;
    var logInfo = console.info.bind(console, '[MTRTC]');
    var logWarn = console.warn.bind(console, '[MTRTC]');

    function RTCCall(opt) {
      this.tempCallId = opt.callId;
      this.rtcCalls = opt.rtcCalls || {};
      this.rtcCalls[this.tempCallId] = this;
      this._id = ++instance;

      this.init();
    }
    
    RTCCall.prototype.init = function () {
      logInfo(this._id, 'init:');

      var self = this;
      self.pc = new window.RTCPeerConnection();
      self.pc.onaddstream = self._onaddstream.bind(self);
      self.pc.onconnectionstatechange = self._onconnectionstatechange.bind(self);
      self.pc.ondatachannel = self._ondatachannel.bind(self);
      self.pc.onicecandidate = self._onicecandidate.bind(self);
      self.pc.oniceconnectionstatechange = self._oniceconnectionstatechange.bind(self);
      self.pc.onicegatheringstatechange = self._onicegatheringstatechange.bind(self);
      self.pc.onnegotiationneeded = self._onnegotiationneeded.bind(self);
      self.pc.onremovestream = self._onremovestream.bind(self);
      self.pc.onsignalingstatechange = self._onsignalingstatechange.bind(self);
      self.pc.ontrack = self._ontrack.bind(self);
    };

    RTCCall.prototype.dispose = function () {
      if (this.disposed) {
        return;
      }
      logInfo(this._id, 'dispose:');

      delete this.rtcCalls[this.tempCallId];
      delete this.rtcCalls[this.realCallId];

      if (this.localStream) {
        this.localStream.getTracks().forEach(function (track) {
          track.stop();
        });
        this.localStream = null;
      }
      if (this.remoteStream) {
        this.remoteStream.getTracks().forEach(function (track) {
          track.stop();
        });
        this.remoteStream = null;
      }
      if (this.pc) {
        this.pc.close();
        //this.pc = null;
      }
      this.disposed = true;
    };

    RTCCall.prototype.updateCallId = function updateCallId(oldId, newId) {
      logInfo(this._id, 'updateCallId:' + oldId + ':' + newId);
      if (this.tempCallId === oldId) {
        delete this.rtcCalls[this.tempCallId];
        this.tempCallId = null;
        this.realCallId = newId;
        this.rtcCalls[this.realCallId] = this;
      } else if (this.realCallId === oldId) {
        delete this.rtcCalls[this.realCallId];
        this.tempCallId = null;
        this.realCallId = newId;
        this.rtcCalls[this.realCallId] = this;
      }
    };

    RTCCall.prototype.getLocalStream = function getLocalStream() {
      return this.localStream;
    };
    RTCCall.prototype.getRemoteStream = function getRemoteStream() {
      return this.remoteStream;
    };

    RTCCall.prototype.bindMedia = function bindMedia() {
      var self = this;
      logInfo(self._id, 'bindMedia');
      return Promise.resolve().then(function () {
        return navigator.mediaDevices.getUserMedia({ audio: true /*, video: true */ });
      }).then(function (stream) {
        logInfo(self._id, 'bindMedia:mediaObtained', stream);
        self.localStream = stream;

        stream.getTracks().forEach(function (track) {
          self.pc.addTrack(track, stream);
        });
        logInfo(self._id, 'bindMedia:tracksAdded');
      });
    };
    RTCCall.prototype.setLocalDescription = function setLocalDescription(sdp) {
      var self = this;
      logInfo(self._id, 'setLocalDescription:' + sdp);
      return Promise.resolve().then(function () {
        return self.pc.setLocalDescription(new window.RTCSessionDescription(sdp));
      }).then(function () {
        return new Promise(function (resolve, reject) {
          self.iceDFD = { resolve: resolve, reject: reject };
        });
      }).then(function () {
        logInfo(self._id, 'setLocalDescription:iceCompleted', self.pc.localDescription);
        return self.pc.localDescription.sdp;
      }, function (e) {
        logWarn(self._id, 'setLocalDescription:failed', e);
        return Promise.reject(e);
      });
    };
    RTCCall.prototype.setRemoteDescription = function setRemoteDescription(type, sdp) {
      var self = this;
      logInfo(self._id, 'setRemoteDescription:' + sdp);
      return Promise.resolve().then(function () {
        return self.pc.setRemoteDescription(new window.RTCSessionDescription({ type: type, sdp: sdp }));
      }).then(function () {
        logInfo(self._id, 'setRemoteDescription:completed');
        return self.pc.remoteDescription.sdp;
      }, function (e) {
        logWarn(self._id, 'setRemoteDescription:failed', e);
        return Promise.reject(e);
      });
    };

    RTCCall.prototype.startInbound = function startInbound(sdp) {
      var self = this;
      return Promise.resolve().then(function () {
        self.setRemoteDescription('offer', sdp);
      }).then(function () {
        return self.bindMedia();
      }).then(function () {
        return self.pc.createAnswer();
      }).then(function (sdp) {
        return self.setLocalDescription(sdp);
      }).then(function () {
        return self.pc.localDescription.sdp;
      }, function (e) {
        logWarn(self._id, 'startInbound:failed', e);
        return Promise.reject(e);
      });
    };

    RTCCall.prototype.startOutbound = function startOutbound() {
      var self = this;
      return Promise.resolve().then(function () {
        return self.bindMedia();
      }).then(function (stream) {
        stream = stream;
        return self.pc.createOffer();
      }).then(function (offer) {
        return self.setLocalDescription(offer);
      }).then(function () {
        return self.pc.localDescription.sdp;
      }, function (e) {
        logWarn(self._id, 'startOutbound:failed', e);
        return Promise.reject(e);
      });
    };


    RTCCall.prototype._onaddstream = function (ev) {
      logInfo(this._id, '_onaddstream:', ev.stream);
      this.remoteStream = ev.stream;
    };
    RTCCall.prototype._onconnectionstatechange = function (ev) {
      ev = ev;
      logInfo(this._id, '_onconnectionstatechange:', this.pc.connectionState);
    };
    RTCCall.prototype._ondatachannel = function (ev) {
      logInfo(this._id, '_onaddstream:', ev.channel);
    };
    RTCCall.prototype._onicecandidate = function (ev) {
      logInfo(this._id, '_onicecandidate:', ev.candidate);
    };
    RTCCall.prototype._oniceconnectionstatechange = function (ev) {
      ev = ev;
      logInfo(this._id, '_oniceconnectionstatechange:', this.pc.iceConnectionState);
    };
    RTCCall.prototype._onicegatheringstatechange = function (ev) {
      ev = ev;
      logInfo(this._id, '_onicegatheringstatechange:', this.pc.iceGatheringState);
      if (this.pc.iceGatheringState === 'complete') {
        if (this.iceDFD) {
          this.iceDFD.resolve();
          this.iceDFD = null;
        }
      }
    };
    RTCCall.prototype._onnegotiationneeded = function (ev) {
      ev = ev;
      logInfo(this._id, '_onnegotiationneeded:');
    };
    RTCCall.prototype._onremovestream = function (ev) {
      ev = ev;
      logInfo(this._id, '_onremovestream:');
    };
    RTCCall.prototype._onsignalingstatechange = function (ev) {
      ev = ev;
      logInfo(this._id, '_onsignalingstatechange:', this.pc.signalingState);
    };
    RTCCall.prototype._ontrack = function (ev) {
      logInfo(this._id, '_onsignalingstatechange:', ev.streams);
    };

    return RTCCall;
  })();

  var Client = (function () {
    var logInfo = console.info.bind(console, '[MTCTI]');
    var logWarn = console.warn.bind(console, '[MTCTI]');
    var subscriptionLifetime = 3600;
    var subscriptionLifetimeMax = 30*24*60*60;

    function Client() {
      this._cti = new MTCTI({ cb: this._recv.bind(this) });
      this._state = this._initState();

      window.__client = this;
    }

    Client.prototype._initState = function () {
      return { 
        config: { },
        callback: null,
        capability: { },
        contacts: { cache: { }, items: { }, search: { }, presence: { }, self: { }, id: 0 },
        searches: { current: 0, direct: { }, reverse: { } },
        timers: { reopen: null, poll: null },
        queue: { current: null, items: [] },
        subscriptions: { id: 0, items: { }, active: { } },
        voicemail: { number: '', unread: null },
        rtcCalls: { }
      };
    };
    Client.prototype.init = function (opt, cb) {
      logInfo('init:');
      var config = this._state.config = opt || this._state.config;
      config.user = (config.user || '').split('@')[0];

      this._state.callback = cb || this._state.callback;

      this._cleanup();
      
      this._raiseEvent({ 'status': 0 });
      this._cti.open(config);
    };
    Client.prototype.shut = function () {
      logInfo('shut:');
      this._raiseEvent({ 'status': 3 });
      this._cti.close();
      this._cleanup();
    };

    Client.prototype._cleanup = function () {
      var oldState = this._state;
      if (oldState.timers.reopen) {
        oldState.timers.reopen = clearTimeout(oldState.timers.reopen) || null;
      }
      if (oldState.timers.poll) {
        oldState.timers.poll = clearTimeout(oldState.timers.poll) || null;
      }
      this._state = this._initState();
      this._state.config = oldState.config || this._state.config;
      this._state.callback = oldState.callback || this._state.callback;

      var contacts = oldState.contacts.items || { };
      var self = this;
      Object.getOwnPropertyNames(contacts).forEach(function (key) {
        self._raiseEvent({ 'person': { id: key }, cmd: 'remove' });
      });
    };
    Client.prototype._reopen = function () {
      logInfo('_reopen:');
      if (this._state.config.noretry) {
        this.shut();
      } else {
        this._raiseEvent({ 'status': 2 });
        this._cleanup();
        this._state.timers.reopen = setTimeout(this.init.bind(this), 5000);
      }
    };

    Client.prototype._poll = function () {
      var subs = this._state.subscriptions.active || { };

      var self = this;
      Object.getOwnPropertyNames(subs).forEach(function (key) {
        var sub = subs[key];
        var dtn = Date.now();
        if (dtn > sub.expiry - 60000) {
          if (key === 'calls') {
            logInfo('renew:', key);
            self._subscribeCallControl(sub.line, sub.sid, sub.lifetime);
          } else if (key === 'self') {
            logInfo('renew:', key);
            self._subscribeEquinoxSelf(sub.sid, sub.lifetime);
          } else if (key === 'equinox') {
            logInfo('renew:', key);
            self._subscribeEquinox(sub.sid, sub.lifetime);
          } else if (key === 'equinoxEntries') {
            logInfo('renew:', key);
            self._subscribeEquinoxEntries(sub.entries, sub.sid, sub.lifetime);
          } else if (key === 'contacts') {
            logInfo('renew:', key);
            self._subscribeContacts(sub.sid, sub.lifetime);
          } else {
            logWarn('renew:', key);
            debugger;
          }
        }
      });

      if (this._state.timers.poll) {
        this._state.timers.poll = clearTimeout(this._state.timers.poll) || null;
      }
      this._state.timers.poll = setTimeout(this._poll.bind(this), 20000);
    };

    Client.prototype._start = function () {
      logInfo('_start:');

      this._poll();
      this._fetchCapability();
    };
    Client.prototype._startAfterCapability = function () {
      logInfo('_startAfterCapability:');
      var capability = this._state.capability;

      this._fetchContact({ self: true });

      if (capability.subscribecontact) {
        logInfo('_startAfterCapability:subscribeContacts');
        this._subscribeEquinoxSelf();
        this._subscribeContacts();
        this._subscribeEquinox();
      } else {
        logInfo('_startAfterCapability:subscribeContacts:not supported');
      }
    };

    // send/recv
    Client.prototype._send = function (msg) {
      logInfo('_send:', JSON.stringify(msg));
      this._raiseEvent({ 'connectionTx': JSON.stringify(msg).length });
      this._cti.send(msg);
    };
    Client.prototype._recv = function (msg) {
      logInfo('_recv:', JSON.stringify(msg));
      if (msg === false) {
        this._raiseEvent({ 'connection': 0 });
        this._reopen();
      } else if (msg === true) {
        this._raiseEvent({ 'connection': 1 });
        this._start();
      } else if (msg === 0) {
        this._raiseEvent({ 'connection': 0 });
        this._raiseEvent({ 'status': 4 });
      } else {
        this._raiseEvent({ 'connectionRx': JSON.stringify(msg).length });
        this._proc(msg);
      }
    };
    Client.prototype._sendQueued = function (msg) {
      var queue = this._state.queue;
      queue.items.push(msg);
      this._next();
    };
    Client.prototype._next = function () {
      var queue = this._state.queue;
      if (queue.current) {
        return;
      }
      var msg = queue.current = queue.items.shift();
      if (!msg) {
        return;
      }
      this._send(msg);
    };
    Client.prototype._done = function () {
      var queue = this._state.queue;
      queue.current = null;
      this._next();
    };

    // protocol level operations
    Client.prototype._nack = function (ntf) {
      if (!ntf.notifyId) {
        return;
      }

      logInfo('_nack:', JSON.stringify(ntf));
      var m = { notifyack: { subscribeId: ntf.subscribeId, notifyId: ntf.notifyId } };
      this._send(m);
    };
    Client.prototype._ntfg = function (ntf) {
      logInfo('_ntfg:', JSON.stringify(ntf));
      switch (ntf.payload) {
        case 'selfpresence':
          this._notifyPresence(ntf.selfpresence);
          break;        
        case 'presence':
          this._notifyPresence(ntf.presence);
          break;        
        case 'contacts':
          this._notifyContacts(ntf.contacts);
          break;        
        case 'callcontrol':
          this._notifyCallControl(ntf.callcontrol);
          break;
        default:
          logWarn('_ntfg:notSupported:', ntf.payload);
          break;
      }
      this._nack(ntf);
    };
    Client.prototype._resp = function (rsp) {
      if (rsp.result !== 0) {
        logWarn('_resp', JSON.stringify(rsp));
      } else {
        logInfo('_resp:', JSON.stringify(rsp));
      }
      this._done();
    };
    Client.prototype._data = function (data) {
      logInfo('_data:', JSON.stringify(data));
      if (data.contact) {
        this._notifyContact(data.contact);
      }
      if (data.directory) {
        if (!data.directory.personalcontacts) {
          this.searchCompletion(data.directory);
        }
      }
      if (data.capability) {
        this._notifyCapability(data.capability);
      }
    };
    Client.prototype._proc = function (msg) {
      logInfo('_proc:', msg.payload);
      switch (msg.payload) {
        case 'notify':
          this._ntfg(msg.notify);
          break;
        case 'response':
          this._resp(msg.response);
          break;
        case 'generaldata':
          this._data(msg.generaldata);
          break;
        case 'subscibecmd':
          debugger;
          break;
        case 'subscribeend':
          debugger;
          break;
        case 'subscribeterminated':
          debugger;
          break;
        default:
          debugger;
          break;
      }
    };

    // capability operations
    Client.prototype._fetchCapability = function () {
      logInfo('_fetchCapability:');
      var m = { generalcmd: { capability: { } } };
      this._sendQueued(m);
    };
    Client.prototype._notifyCapability = function (capability) {
      logInfo('_notifyCapability:', JSON.stringify(capability));
      var oldCapability = this._state.capability;
      this._state.capability = capability;

      this._raiseEvent({ 'capability': { 
        version: capability.version, 
        subscribecontact: capability.subscribecontact, 

        addcontact: capability.addcontact, 
        updatecontact: capability.updatecontact, 
        deletecontact: capability.deletecontact, 
        favoritecontacts: capability.favoritecontacts, 

        retrievepictures: capability.retrievepictures,

        networksearchterminal: capability.networksearchterminal,

        resolveenterprisecontacts: capability.resolveenterprisecontacts,

        directorysearch: capability.directorysearch, 
        directorynumbersearch: capability.directorynumbersearch, 

        subscribecallcontrol: capability.subscribecallcontrol, 

        subscribecalllog: capability.subscribecalllog, 
      }});

      if (!oldCapability.version) {
        // just retrieved, proceed with other operations
        this._startAfterCapability();
      }
    };

    // equinox self operations
    Client.prototype._subscribeEquinoxSelf = function (sid, lifetime) {
      var create = !sid;
      sid = sid || (++this._state.subscriptions.id);
      lifetime = lifetime || subscriptionLifetime;
      logInfo('_subscribeEquinoxSelf:', create, sid, lifetime);

      var m;
      if (create) {
        var flags = 0x18; // 0x8 - enable MWI reporting, 0x10 - enable call control caps
        m = { subscribe: { subscriptionId: sid, timeout: lifetime, selfpresence: { flags: flags } } };
      } else {
        m = { subscibecmd: { subscribeId: sid, timeout: lifetime } };
      }

      this._sendQueued(m);
      var sub = { sid: sid, expiry: Date.now() + lifetime*1000, lifetime: lifetime };
      this._state.subscriptions.active['self'] = sub;
    };
    Client.prototype._updateEquinoxSelf = function (status, label) {
      var sub = this._state.subscriptions.active['self'];
      logInfo('_updateEquinoxSelf:', sub.sid, status, label);

      var pres = { app: { value: status } };
      if (label) {
        pres.absence = { set: 1, absence: { msg: 11, str: label } };
      } else {
        pres.absence = { set: 1, absence: { msg: 11, str: '' } };
      }
      var m = { subscibecmd: { subscribeId: sub.sid, selfpresence: pres } };

      this._sendQueued(m);
    };

    var _phoneStates = {
      idle: 0, dialing: 1, ringing: 2, acw: 3, connected: 4, logout: 5, fault: 6, recover: 7, unknown: 8
    };
    Client.prototype._notifyPresence = function (presence) {
      logInfo('_ntfp:', JSON.stringify(presence));

      if (!presence.entry) {
        // case of self presence
        this._updatePhonePresence(presence);
        this._updatePresence(presence, presence.presentity || this._state.contacts.self.number, true);
        this._raiseEvent({ 'self': presence });
      } else {
        // process all reported entries
        var self = this;
        presence.entry.forEach(function (item) {
          self._updatePresence(item);
        });
      }
    };
    Client.prototype._updatePhonePresence = function (presenceInfo) {
      var phoneState = presenceInfo.phonestate || 0;
      switch (phoneState) {
        case _phoneStates.logout:
        case _phoneStates.fault:
        case _phoneStates.unknown:
          if (this._state.phoneState !== phoneState) {
            this._state.phoneState = phoneState;
            this._raiseEvent({ 'status': 0 });
          }
          break;
        default:
          if (this._state.phoneState !== phoneState) {
            this._state.phoneState = phoneState;
            this._raiseEvent({ 'status': 1 });
          }
          break;
      }
      this._notifyVoiceMail(presenceInfo.vmunreadMessages);
    };
    Client.prototype._updatePresenceString = function (type, s) {
      var prefix = '', prefixId = '';
      switch (type) {
        case 1: prefix = 'ON HOLIDAY UNTIL'; prefixId = '$(PRESENCE_ON_HOLIDAY_UNTIL) $0'; break;
        case 2: prefix = 'WILL BE BACK'; prefixId = '$(PRESENCE_WILL_BE_BACK) $0'; break;
        case 3: prefix = 'AT LUNCH UNTIL'; prefixId = '$(PRESENCE_AT_LUNCH_UNTIL) $0'; break;
        case 4: prefix = 'MEETING UNTIL'; prefixId = '$(PRESENCE_MEETING_UNTIL) $0'; break;
        case 5: prefix = 'PLEASE CALL'; prefixId = '$(PRESENCE_PLEASE_CALL) $0'; break;
        case 6: prefix = 'DON’T DISTURB UNTIL'; prefixId = '$(PRESENCE_DND_UNTIL) $0'; break;
        case 7: prefix = 'WITH VISITOR UNTIL'; prefixId = '$(PRESENCE_WITH_VISITOR_UNTIL) $0'; break;
        case 8: prefix = 'WITH CUSTOMER UNTIL'; prefixId = '$(PRESENCE_WITH_CUSTOMER_UNTIL) $0'; break;
        case 9: prefix = 'BACK SOON'; prefixId = '$(PRESENCE_BACK_SOON) $0'; break;
        case 10: prefix = 'BACK TOMORROW'; prefixId = '$(PRESENCE_BACK_TOMORROW) $0'; break;
      }
      if (prefixId) {
        return prefixId.replace(/\$0/ig, s || '').trim();
        //if (prefix) {
        //return [prefix, s].join(' ');
      } else {
        return s;
      }
    };
    Client.prototype._updatePresence = function (presenceInfo, presentity, self) {
      var contacts = this._state.contacts;
      var absence = presenceInfo.absence || {};
      presentity = presentity || presenceInfo.presentity;
      
      var current = contacts.presence[presentity];
      if (!current) {
        current = contacts.presence[presentity] = { };
      }

      var update = false;
      update = Utils.updateKey(current, { presentity: presentity }, 'presentity') || update;
      update = Utils.updateKey(current, presenceInfo, 'app') || update;
      update = Utils.updateKey(current, presenceInfo, 'phonestate') || update;
      update = Utils.updateKey(current, presenceInfo, 'sac') || update;
      update = Utils.updateKey(current, presenceInfo, 'fwdu') || update;
      update = Utils.updateKey(current, absence, 'msg') || update;
      update = Utils.updateKey(current, absence, 'str') || update;

      current.label = this._updatePresenceString(absence.msg, absence.str);

      if (self) {
        update = Utils.updateKey(current, presenceInfo, 'fwdu_number') || update;
        update = Utils.updateKey(current, presenceInfo, 'locked') || update;
        update = Utils.updateKey(current, presenceInfo, 'ec500') || update;
        update = Utils.updateKey(current, presenceInfo, 'featuresavailable') || update;
        update = Utils.updateKey(current, presenceInfo, 'ccdesk') || update;
        update = Utils.updateKey(current, presenceInfo, 'ccmobile') || update;
        update = Utils.updateKey(current, presenceInfo, 'ccteleworker') || update;
        update = Utils.updateKey(current, presenceInfo, 'cclogindesk') || update;
        update = Utils.updateKey(current, presenceInfo, 'ccwebrtc') || update;
        update = Utils.updateKey(current, presenceInfo, 'ccsoftphone') || update;
      }

      if (update) {
        this._raiseEvent({ 'presence': current });
      }
    };

    Client.prototype._notifyVoiceMail = function (unread) {
      if (typeof(unread) === 'undefined') {
        return;
      }
      
      var voicemail = this._state.voicemail;
      if (voicemail.unread !== unread) {
        voicemail.unread = unread;
        this._raiseEvent({ 'mwi': { 'count': voicemail.unread, 'vmNumber': this._state.contacts.self.number || '' } });
      }
    };

    // presence operations
    Client.prototype._subscribeEquinox = function (sid, lifetime) {
      var create = !sid;
      sid = sid || ++this._state.subscriptions.id;
      lifetime = lifetime || subscriptionLifetime;
      logInfo('_subscribeEquinox:', create, sid, lifetime);

      var m;
      
      if (create) {
        m = { subscribe: { subscriptionId: sid, timeout: lifetime, presence: { } } };
      } else {
        m = { subscibecmd: { subscribeId: sid, timeout: lifetime } };
      }

      this._sendQueued(m);
      var sub = { sid: sid, expiry: Date.now() + lifetime*1000, lifetime: lifetime };
      this._state.subscriptions.active['equinox'] = sub;
    };

    Client.prototype._subscribeEquinoxEntries = function (entries, sid, lifetime) {
      var create = !sid;
      sid = sid || ++this._state.subscriptions.id;
      lifetime = lifetime || subscriptionLifetime;
      logInfo('_subscribeEquinoxEntries:', create, JSON.stringify(entries), sid, lifetime);

      var m;
      
      if (create) {
        m = { subscribe: { subscriptionId: sid, timeout: lifetime, presence: { } } };
        if (entries) {
          var items = entries.map(function (item) {
            return { presentity: item };
          });
          m.subscribe.presence.entry = items;
        }
      } else {
        m = { subscibecmd: { subscribeId: sid, timeout: lifetime } };
      }

      this._sendQueued(m);
      var sub = { sid: sid, expiry: Date.now() + lifetime*1000, lifetime: lifetime, entries: entries };
      this._state.subscriptions.active['equinoxEntries'] = sub;
    };
    Client.prototype._appendEquinoxEntries = function (entries) {
      var sub = this._state.subscriptions.active['equinoxEntries'];
      logInfo('_appendEquinoxEntries:', sub.sid, JSON.stringify(entries));

      var items = entries.map(function (item) {
        return { presentity: item };
      });
      var m = { subscibecmd: { subscribeId: sub.sid, presence: { add: items } } };

      this._sendQueued(m);
    };
    Client.prototype._removeEquinoxEntries = function (entries) {
      var sub = this._state.subscriptions.active['equinoxEntries'];
      logInfo('_removeEquinoxEntries:', sub.sid, JSON.stringify(entries));

      var items = entries.map(function (item) {
        return { presentity: item };
      });
      var m = { subscibecmd: { subscribeId: sub.sid, presence: { remove: items } } };

      this._sendQueued(m);
    };


    // public presence operations
    Client.prototype.setPresence = function (status, label) {
      status = status || 'Available';
      label = label || '';
      logInfo('setPresence', status, label);

      this._updateEquinoxSelf(status, label);
    };


    // contacts operations
    Client.prototype._subscribeContacts = function (sid, lifetime) {
      var create = !sid;
      lifetime = lifetime || subscriptionLifetime;
      sid = sid || ++this._state.subscriptions.id;
      logInfo('_subscribeContacts:', create, sid, lifetime);
      var m;
      
      if (create) {
        m = { subscribe: { subscriptionId: sid, timeout: lifetime, contacts: { personalcontactlist: 1, selfcontact: 1 } } };
      } else {
        m = { subscibecmd: { subscribeId: sid, timeout: lifetime } };
      }

      this._sendQueued(m);
      var sub = { sid: sid, expiry: Date.now() + lifetime*1000, lifetime: lifetime };
      this._state.subscriptions.active['contacts'] = sub;
    };
    Client.prototype._updateContacts = function (req) {
      var sub = this._state.subscriptions.active['contacts'];
      logInfo('_updateContacts:', sub.sid, req);

      var m = { subscibecmd: { subscribeId: sub.sid, contacts: req } };
      this._sendQueued(m);
    };

    Client.prototype._fetchContacts = function (key, max) {
      logInfo('_fetchContacts:');
      
      var m = { generalcmd: { directory: { cmdinst: key, maxentries: max || 50, personalcontacts: true } } };
      this._sendQueued(m);
    };
    Client.prototype._notifyContacts = function (info) {
      logInfo('_notifyContacts:', JSON.stringify(info));

      var self = this;
      if (info.selfcontact) {
        self._notifyContact({ head: info.head, selfcontact: true, personalcontact: false, contact: info.selfcontact });
      }
      if (info.full && info.full.entryList) {
        var contacts = this._state.contacts;
        contacts.head = info.head;
        info.full.entryList.forEach(function (item) {
          self._notifyContact({ head: info.head, selfcontact: false, personalcontact: true, contact: item });
        });
        Object.getOwnPropertyNames(contacts.cache).forEach(function (key) {
          var item = contacts.cache[key];
          if (item.head !== info.head) {
            if (contacts.items[item.id]) {
              delete contacts.cache[key];
              delete contacts.items[item.id];
              delete contacts.presence[item.number];
              self._raiseEvent({ 'person': item, cmd: 'remove' });
            }
          }
        });
      }
    };

    Client.prototype._fetchContact = function (self, name) {
      logInfo('_fetchContact:', self, name);
      var m = { generalcmd: { contact: { selfcontact: !!self, name: name || '' } } };
      this._sendQueued(m);
    };
    Client.prototype._notifyContact = function (info) {
      logInfo('_notifyContact:', JSON.stringify(info));

      var entry = { 
        firstname: info.contact.firstname || '', 
        lastname: info.contact.lastname || '', 
        number: info.contact.number || '', 
        email: info.contact.email || '', 
        favourite: !!info.contact.favourite,
        image: info.contact.image || '',
        lref: info.contact.lref,
        self: info.selfcontact,
        head: info.head,
        personal: info.personalcontact
      };

      this._updateContact(entry);

      if (entry.self) {
        if (!this._state.subscriptions.active['calls']) {
          this._subscribeEquinoxEntries([info.contact.number]);
          this._subscribeCallControl(info.contact.number);
        }
      }

    };
    Client.prototype._updateContact = function (entry, fromSearch) {
      var hash = [entry.email, entry.number, entry.firstname, entry.lastname].join('|');
      var contacts = this._state.contacts;
      var current = contacts.cache[hash];
      var created = false, updated = false;

      if (!current) {
        created = true;
        updated = true;
        current = entry;
        current.id = entry.email || ('' + (++contacts.id) + '@ipoffice.local');
        contacts.cache[hash] = current;

        if (!fromSearch) {
          if (entry.personal) {
            contacts.items[current.id] = current;
          }
        } else {
          contacts.search[current.id] = current;
        }
      } else {
        // update head always
        if (!fromSearch) {
          current.head = entry.head;
          current.lref = entry.lref;
        }

        updated = Utils.updateKey(current, entry, 'favourite') || updated;
        updated = Utils.updateKey(current, entry, 'image') || updated;

        if (!fromSearch && entry.personal) {
          if (!contacts.items[current.id]) {
            updated = true;
            contacts.items[current.id] = current;
          }
        }
      }

      var presenceInfo;
      if (current.self) {
        contacts.self = current;
      }
      if (current.number && !fromSearch) {
        presenceInfo = contacts.presence[current.number];
        if (presenceInfo) {
          presenceInfo.id = current.id;
        } else {
          contacts.presence[current.number] = { id: current.id };
        }
      }

      if (updated && !fromSearch) {
        if (current.self && !entry.personal) {
          this._raiseEvent({ 'myself': current });
        } else if (entry.personal) {
          this._raiseEvent({ 'person': current, cmd: created ? 'create' : 'update' });
          if (presenceInfo) {
            this._raiseEvent({ 'presence': presenceInfo });
          }
        }
      }
      return current;
    };

    // public contacts operations
    Client.prototype.contactAdd = function (contactId, info, fav) {
      logInfo('contactAdd:', contactId);
      var contact = this._state.contacts.items[contactId];
      if (contact) {
        logInfo('contactAdd:already', contactId);
        return;
      }
      contact = this._state.contacts.search[contactId];
      if (!contact) {
        if (!info) {
          logInfo('contactAdd:notFound', contactId);
          return;
        }
        contact = info;
      }

      contact.lref = -1;
      contact.favourite = !!fav;
      this._updateContacts({ head: this._state.contacts.head, added: { entryList: [ contact ] } });
    };
    Client.prototype.contactRemove = function (contactId) {
      logInfo('contactRemove:', contactId);

      var contact = this._state.contacts.items[contactId];
      if (!contact) {
        logInfo('contactRemove:notFound', contactId);
        return;
      }
      this._updateContacts({ head: this._state.contacts.head, removed: { entryList: [ contact ] } });
    };
    Client.prototype.contactUpdate = function (contactId, favourite) {
      favourite = !!favourite;
      logInfo('contactUpdate:', contactId, favourite);
      var contact = this._state.contacts.items[contactId];
      if (!contact) {
        logInfo('contactAdd:notFound', contactId);
        return;
      }

      var item = { firstname: contact.firstname, lastname: contact.lastname, email: contact.email, number: contact.number, lref: contact.lref };
      item.favourite = favourite;
            
      this._updateContacts({ head: this._state.contacts.head, changed: { entryList: [ item ] } });
    };

    // directory operations
    Client.prototype._fetchDirectory = function (key, filter, max, personal, numbersOpt) {
      logInfo('_fetchDirectory:', key, filter, numbersOpt);
      
      var m = { generalcmd: { directory: { cmdinst: key, maxentries: max || 10, personalcontacts: !!personal, filter: filter, numbersearch: numbersOpt } } };
      this._sendQueued(m);
    };

    // call control operations
    var _callFeatures = {
      'DROP': 0x00000001, 'ANSWER': 0x00000002, 'HOLD': 0x00000004, 'UNHOLD': 0x00000008, 'BLINDXFER': 0x00000010, 'REDIRECT': 0x00000020, 
      'DIAL': 0x00000040, 'PARK': 0x00000080, 'SETUPXFER': 0x00000100, 'COMPLETEXFER': 0x00000200, 'COMPLETECONF': 0x00000400, 'ADDTOCONF': 0x00000800,
      'CONFMEMBER': 0x00001000, 'TAG': 0x00002000, 'ACCT': 0x00004000, 'PUSHCALLTOEC500': 0x00010000, 'GENERATEDIGITS': 0x00020000,
      'FORCECLEAR': 0x00200000, 'AUTHCODE': 0x00400000,
      'RECORDON': 0x00800000, 'RECORDOFF': 0x01000000, 'PRIVACYON': 0x02000000, 'PRIVACYOFF': 0x04000000, 'MUTEON': 0x08000000, 'MUTEOFF': 0x100000000,
    };
    Client.prototype._extractCallFeatures = function (features) {
      var res = Object.getOwnPropertyNames(_callFeatures).reduce(function (r, key) {
        if (features & _callFeatures[key]) {
          r.push(key);
        }
        return r;
      }, []);
      logInfo('_feat:', JSON.stringify(res));
      return res;
    };
    Client.prototype._subscribeCallControl = function (line, sid, lifetime) {
      var create = !sid;
      lifetime = lifetime || subscriptionLifetime;
      lifetime = 0; // forced infinite lifetime now
      sid = sid || ++this._state.subscriptions.id;
      line = line || this._state.contacts.self.number;

      logInfo('_subscribeCallControl:', create, line, sid, lifetime);

      var m;
      if (create) {
        var rtc = (this._state.config.mode === 'rtc');
        m = { subscribe: { subscribeId: sid, timeout: lifetime, callcontrol: { 
          flags: 1, attachment: rtc ? 'AttachmentThis' : 'AttachmentAny', 
          teleworkerconnection: rtc ? undefined : { number: line || this._state.config.user, holdlineopen: true, testconnection: 1 }, 
          webrtcmode: rtc ? 'WebRTCCallByCall' : 'WebRTCShared'
        } } };
      } else {
        m = { subscibecmd: { subscribeId: sid, timeout: lifetime } };
      }
      
      this._sendQueued(m);
      var sub = { sid: sid, line: line, expiry: Date.now() + subscriptionLifetimeMax*1000, lifetime: lifetime };
      this._state.subscriptions.active['calls'] = sub;
    };
    Client.prototype._updateCallControl = function (callId, action, arg, sdp) {
      logInfo('_updateCallControl:');
      var subscribeId = (this._state.subscriptions.active['calls'] || {}).sid || 0;

      var m = { subscibecmd: { subscribeId: subscribeId } };
      if ((action === 'CompleteTransfer') || (action === 'CompleteConf')) {
        m.subscibecmd.callcontrol = { 
          callid: callId, 
          //referencecallid: arg, 
          callfunction: {
            action: action, 
            callinst: [{
              callid: arg,
              //referencecallid: arg
            }]
          },
        };
      } else if (action === 'DialVM') {
        m.subscibecmd.callcontrol = { 
          referencecallid: callId,
          makecall: {
            target: arg,
            type: 102,
            sdp: typeof(sdp) === 'string' ? sdp : undefined
          }        
        };
      } else if (action !== 'Dial') {
        m.subscibecmd.callcontrol = { 
          callid: callId, 
          // referencecallid: 0, 
          callfunction: {
            // None = 0; DropCall = 1; AnswerCall = 2; HoldCall = 3; UnHoldCall = 4;
            // BlindTransfer = 5; Redirect = 6; Dial = 7; Park = 8; SetupTransfer = 9;
            // CompleteTransfer = 10; CompleteConf = 11; AddToConf = 12; MemberFunction = 13;
            // SetTag = 14; SetAccountCode = 15; Unused16 = 16; PushToEC500 = 17;
            // GenerateDigits = 18; ShortCodeAction = 19; UpdateSDP = 20; Unused21 = 21;
            // ForceClear = 22; SetAuthCode = 23; CallRecordingOn = 24; CallRecordingOff = 25;
            // PrivacyOn = 26; PrivacyOff = 27; MuteOn = 28; MuteOff = 29;
              
            action: action, 
            arg1: typeof(arg) === 'string' ? arg : undefined
  
            // callfunction:arg1 - unclear meaning
            // callfunction:shortcodedata - unclear meaning
            // callfunction:memberfunctiondata - unclear meaning
            // memberfunctiondata:action None = 0; DropCall = 1; MuteOn = 2; MuteOff = 3;
            // arg1: '', shortcodedata: { code: 0, val: '' }, memberfunctiondata: { lref: 0, action: '' }, sdp: ''
          }
        };
      } else {
        m.subscibecmd.callcontrol = {
          referencecallid: callId,
          makecall: {
            target: arg,
            sdp: typeof(sdp) === 'string' ? sdp : undefined
          }
        };
      }
      this._sendQueued(m);
    };
    Client.prototype._notifyCallControl = function (callInfo) {
      logInfo('_ntft:', JSON.stringify(callInfo));
      var self = this;
      var active = callInfo.callinfo || [];
      active.forEach(function (item) {
        var number = (item.connectedparty || {}).number || (item.callingparty || {}).number || item.calledparty || item.referencecallid || '';
        var name = (item.connectedparty || {}).name || (item.callingparty || {}).name || '';

        var members = item.conferencemember || [];
        var isConference = !!members.length;
        var np = members.length;

        if (isConference) {
          name = 'Conference, ' + np + ' parties';
        }

        var rtcCall;
        var rtcCalls = self._state.rtcCalls;
        if (rtcCalls) {
          if (item.referencecallid) {
            rtcCall = rtcCalls[item.referencecallid];
            if (rtcCall) {
              rtcCall.updateCallId(item.referencecallid, item.id);
            }
          }
          rtcCall = rtcCalls[item.id];
        }

        if (rtcCall && item.sdp) {
          rtcCall.setRemoteDescription('answer', item.sdp);
        }
        self._raiseEvent({ 'callinfo': { id: item.callid, state: item.state, direction: item.direction, features: self._extractCallFeatures(item.featuresavailable), number: '' + number, name: name, conference: isConference, sdp: item.sdp } });
        if (rtcCall) {
          self._raiseEvent({ 'rtcinfo': { id: item.callid, call: rtcCall } });
        }
      });
      var lost = callInfo.calllost || [];
      lost.forEach(function (item) {
        var rtcCall;
        var rtcCalls = self._state.rtcCalls;
        if (rtcCalls) {
          if (item.referencecallid) {
            rtcCall = rtcCalls[item.referencecallid];
            if (rtcCall) {
              rtcCall.updateCallId(item.referencecallid, item.id);
            }
          }
          rtcCall = rtcCalls[item.id];
          if (rtcCall) {
            rtcCall.dispose();
          }
        }

        self._raiseEvent({ 'callinfo': { id: item.callid, state: 'OnHook' } });
        if (rtcCall) {
          self._raiseEvent({ 'rtcinfo': { id: item.callid, call: rtcCall } });
        }
      });
    };


    // public call operations
    Client.prototype.dial = function (tel) {
      logInfo('call:dial', tel);
      this._updateCallControl(tel, 'Dial', tel);
    };
    Client.prototype.dialRTC = function (tel) {
      logInfo('call:dialRTC', tel);

      var cid = Date.now()/1000;

      var rtcCalls = this._state.rtcCalls;
      var rtcCall = new RTCCall({ tempCallId: cid, rtcCalls: rtcCalls });
      rtcCalls[cid] = rtcCall;

      var self = this;
      return Promise.resolve().then(function () {
        return rtcCall.startOutbound();
      }).then(function (sdp) {
        logInfo('call:dialRTC:ready');
        self._updateCallControl(cid, 'Dial', tel, sdp);
        return rtcCall;
      }, function (e) {
        rtcCall.dispose();

        logInfo('call:dialRTC:failed', e);
        return Promise.reject(e);
      });
    };
    Client.prototype.dialVoicemail = function () {
      logInfo('call:dialVoicemail');

      this._updateCallControl(Date.now()/1000, 'DialVM', '?' + this._state.config.user);
    };
    Client.prototype.dialVoicemailRTC = function () {
      logInfo('call:dialVoicemailRTC');

      var cid = Date.now()/1000;

      var rtcCalls = this._state.rtcCalls;
      var rtcCall = new RTCCall({ tempCallId: cid, rtcCalls: rtcCalls });
      rtcCalls[cid] = rtcCall;

      var self = this;
      return Promise.resolve().then(function () {
        return rtcCall.startOutbound();
      }).then(function (sdp) {
        logInfo('call:dialVoicemailRTC:ready');
        self._updateCallControl(cid, 'DialVM', '?' + self._state.config.user, sdp);
        return rtcCall;
      }, function (e) {
        rtcCall.dispose();

        logInfo('call:dialVoicemailRTC:failed', e);
        return Promise.reject(e);
      });
    };

    Client.prototype.answer = function (cid) {
      logInfo('call:answer', cid);
      this._updateCallControl(cid, 'AnswerCall');
    };
    Client.prototype.hangup = function (cid) {
      logInfo('call:hangup', cid);
      this._updateCallControl(cid, 'DropCall');
    };
    Client.prototype.hold = function (cid) {
      logInfo('call:hold', cid);
      this._updateCallControl(cid, 'HoldCall');
    };
    Client.prototype.resume = function (cid) {
      logInfo('call:resume', cid);
      this._updateCallControl(cid, 'UnHoldCall');
    };
    Client.prototype.dtmf = function (cid, d) {
      logInfo('call:dtmf', cid, d);
      this._updateCallControl(cid, 'GenerateDigits', d);
    };
    Client.prototype.mute = function (cid) {
      logInfo('call:mute', cid);
      this._updateCallControl(cid, 'MuteOn');
    };
    Client.prototype.unmute = function (cid) {
      logInfo('call:unmute', cid);
      this._updateCallControl(cid, 'MuteOff');
    };
    Client.prototype.transfer = function (cid, hid) {
      logInfo('call:transfer', cid, hid);
      this._updateCallControl(cid, 'CompleteTransfer', hid);
    };
    Client.prototype.join = function (cid, hid) {
      logInfo('call:join', cid, hid);
      // CompleteConf/AddToConf
      this._updateCallControl(cid, 'CompleteConf', hid);
    };

    // directory search
    Client.prototype.search = function (opt) {
      logInfo('search', JSON.stringify(opt));

      if (!this._state.contacts.self.id) {
        this._raiseEvent({ 'searchinfo': { entries: [], completed: true, key: opt.key, opt: opt } });
        return;
      }

      var key = opt.key.id || opt.key;
      var q = opt.query;

      var searches = this._state.searches;
      var directInfo = {};
      searches.direct[key] = directInfo;
      directInfo['*'] = opt;

      var current;

      current = ++searches.current;
      directInfo[current] = key;
      searches.reverse[current] = key;
      this._fetchDirectory(current, q, 10, false, 1);
    };
    Client.prototype.searchCompletion = function (info) {
      var searches = this._state.searches;
      var contacts = this._state.contacts;

      var key = searches.reverse[info.cmdinst] || '';
      if (info.complete) {
        delete searches.reverse[info.cmdinst];
      }

      var direct = searches.direct[key] || {};
      if (info.complete) {
        delete direct[info.cmdinst];
      }

      var completed = (Object.getOwnPropertyNames(direct).length <= 1);
      if (completed) {
        delete searches.direct[key];
      }
      
      var entries = (info.list || { }).entryList || [];
      var self = this;
      var rqp = { };

      var items = entries.map(function (item) {
        var entry = { 
          firstname: item.firstname || '', 
          lastname: item.lastname || '', 
          number: item.number || '', 
          email: item.email || '', 
          favourite: !!item.favourite,
          image: item.image || '',
        };
        var contact = self._updateContact(entry, true);
        if (!contacts.items[contact.id]) {
          if (!contacts.presence[contact.number]) {
            contacts.presence[contact.number] = { id: contact.id };
            rqp[contact.number] = 1;
          }
        }
        return contact;
      });
      var arqp = Object.getOwnPropertyNames(rqp);
      if (arqp.length) {
        this._appendEquinoxEntries(arqp);
      }

      this._raiseEvent({ 'searchinfo': { entries: items, completed: completed, key: key, opt: direct['*'] || {} } });
    };

    // raise event
    Client.prototype._raiseEvent = function (info) {
      try {
        logInfo('report:' + JSON.stringify(info));
      } catch (e) {
      }
      if (this._state.callback) {
        this._state.callback(info);
      }
    };

    return Client;
  })();

  window.MTCTIClient = Client;
  window.MTCTISocket = MTCTI;
  window.MTRTCCall = RTCCall;
   
})();