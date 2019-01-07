
function collectMessageToServer(data){
    var img = document.createElement("img");
    img.src = "http://127.0.0.1:8080/" + chrome.runtime.id + "/" + data;
}

//获取向页面注入的所有内容
function hookAppendChild(){
    var rawAppendChild = Element.prototype.appendChild;
    Element.prototype.appendChild = function() {
        console.log(arguments);
        var data = '';
        if(arguments[0].innerHTML == "") {
            data = arguments[0].src;
        } else {
            data = arguments[0].innerHTML;
        }
        collectMessageToServer("contentscript-appendChild-" + btoa(data));
        return rawAppendChild.apply(this, arguments);
    };
}

//获取所有的ajax 请求信息
function hookAjax(){
    var rawXMLHTTPRequestOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(){
        console.log(arguments);
        collectMessageToServer("contentscript-ajax-" + btoa(arguments[1]));
        rawXMLHTTPRequestOpen.apply(this, arguments);
    }
}

//提取所有请求出口
// 方案一： 通过hook
// 方案二： 通过流量，确定需要访问的页面，对比有无扩展访问网站的区别

function run() {
    hookAjax();
    hookAppendChild();
}
run();
//sn00ker_ahahaha
'use strict';

/**************************************
 * constants
 **************************************/

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __PLAYBACK_QUALITY = 'medium';
var __SYNC_ACCURACY = 0.18;
var __UPDATE_AUDIO_TIMING_WAIT_TIME = 1800;
var __LOAD_AUDIO_WAIT_TIME = 1800;
var __VOLUME_CHANGE_WAIT_TIME = 600;
var __VIDEO_START_TIMEOUT = 1200;
var __MAX_SYNC_FREQUENCY = 3;
var __WAIT_TIME_ON_SYNC_PROBLEM = 1800;
var __SYNC_FREQUENCY_CHECK_PERIOD = 1800;
var __MAX_BUFFER_WAIT_TIME = 1800;
var __START_MESSAGE = {
  message: chrome.i18n.getMessage('appStartMessage'),
  timeout: 8000,
  iconUrl: chrome.extension.getURL('images/icon-64-transparent.png')
};
var __UI_ICON_CLOSE_PATH = chrome.extension.getURL('images/icon-close-24.png');
var __LOCAL_SCRIPT = {
  EMBEDED: {
    path: 'scripts/yt-embeded.js'
  },
  YOUTUBE_OFFICIAL_IFRAME_PLAYER_API: {
    path: 'lib/youtube/www-widgetapi-vfl4Pu_oL/www-widgetapi.js',
    id: 'www-widgetapi-script',
    async: true
  }
};

/**************************************
 * classes
 **************************************/

var PageScriptBase = function () {
  function PageScriptBase(scriptBuilder) {
    _classCallCheck(this, PageScriptBase);

    this.scriptBuilder = scriptBuilder;
    this.runPageScript = function (scriptPrms) {
      var script = document.createElement('script');
      script.textContent = '(function(){' + this.scriptBuilder(scriptPrms) + '})();';
      (document.head || document.documentElement).appendChild(script);
      script.remove();
    };
  }

  _createClass(PageScriptBase, [{
    key: 'exec',
    value: function exec(prms) {
      this.runPageScript(prms);
    }
  }]);

  return PageScriptBase;
}();

;

var PageScriptPostExtUse = function (_PageScriptBase) {
  _inherits(PageScriptPostExtUse, _PageScriptBase);

  function PageScriptPostExtUse() {
    _classCallCheck(this, PageScriptPostExtUse);

    var scriptBuilder = function scriptBuilder() {
      return '\n      var vp = document.getElementById(\'movie_player\') || {};\n      if(vp.unMute) {\n        vp.unMute();\n      };\n      document.dispatchEvent(new Event(\'postExtUseProcessCompleted\'));';
    };
    return _possibleConstructorReturn(this, (PageScriptPostExtUse.__proto__ || Object.getPrototypeOf(PageScriptPostExtUse)).call(this, scriptBuilder));
  }

  return PageScriptPostExtUse;
}(PageScriptBase);

var PageScriptStartProcess = function (_PageScriptBase2) {
  _inherits(PageScriptStartProcess, _PageScriptBase2);

  function PageScriptStartProcess() {
    _classCallCheck(this, PageScriptStartProcess);

    var scriptBuilder = function scriptBuilder() {
      return '\n      window._synca = window._synca || {};\n      if (window._synca.started) {\n        return false;\n      };\n      window._synca.vp = document.getElementById(\'movie_player\') || {};\n      if (!window._synca.vp.getVideoData || !window._synca.vp.getVideoData().video_id) {\n        return false;\n      };\n      window._synca.started = true;\n      window._synca.h =  false;\n      window._synca.timeDiff =  0;\n      window._synca.log = function(message) {\n        if (window._synca.h) {\n          console.log(message);\n        }\n      };\n      document.dispatchEvent(new Event(\'readyToStartProcess\'));';
    };
    return _possibleConstructorReturn(this, (PageScriptStartProcess.__proto__ || Object.getPrototypeOf(PageScriptStartProcess)).call(this, scriptBuilder));
  }

  return PageScriptStartProcess;
}(PageScriptBase);

var PageScriptUpdateAudioTiming = function (_PageScriptBase3) {
  _inherits(PageScriptUpdateAudioTiming, _PageScriptBase3);

  function PageScriptUpdateAudioTiming(updateAudioTimingWaitTime) {
    _classCallCheck(this, PageScriptUpdateAudioTiming);

    var scriptBuilder = function scriptBuilder(timeDiff) {
      return '\n      window._synca.ap.pauseVideo();\n      window._synca.timeDiff = ' + timeDiff + ';\n      if (window._synca.vp.getPlayerState() === 1) {\n        window._synca.vp.pauseVideo();\n        setTimeout(function(){\n          window._synca.vp.playVideo();\n        },\n      ' + updateAudioTimingWaitTime + ');}';
    };
    return _possibleConstructorReturn(this, (PageScriptUpdateAudioTiming.__proto__ || Object.getPrototypeOf(PageScriptUpdateAudioTiming)).call(this, scriptBuilder));
  }

  return PageScriptUpdateAudioTiming;
}(PageScriptBase);

var PageScriptInitAudioSyncPlayer = function (_PageScriptBase4) {
  _inherits(PageScriptInitAudioSyncPlayer, _PageScriptBase4);

  function PageScriptInitAudioSyncPlayer() {
    _classCallCheck(this, PageScriptInitAudioSyncPlayer);

    var scriptBuilder = function scriptBuilder() {
      return 'initAudioSyncPlayer()';
    };
    return _possibleConstructorReturn(this, (PageScriptInitAudioSyncPlayer.__proto__ || Object.getPrototypeOf(PageScriptInitAudioSyncPlayer)).call(this, scriptBuilder));
  }

  return PageScriptInitAudioSyncPlayer;
}(PageScriptBase);

var PageScriptReloadPage = function (_PageScriptBase5) {
  _inherits(PageScriptReloadPage, _PageScriptBase5);

  function PageScriptReloadPage() {
    _classCallCheck(this, PageScriptReloadPage);

    var scriptBuilder = function scriptBuilder() {
      return 'window.location.reload()';
    };
    return _possibleConstructorReturn(this, (PageScriptReloadPage.__proto__ || Object.getPrototypeOf(PageScriptReloadPage)).call(this, scriptBuilder));
  }

  return PageScriptReloadPage;
}(PageScriptBase);

var PageScriptOnYouTubeIframeAPIReady = function (_PageScriptBase6) {
  _inherits(PageScriptOnYouTubeIframeAPIReady, _PageScriptBase6);

  function PageScriptOnYouTubeIframeAPIReady(playbackQuality, syncAccuracy, waitTimeOnSyncProblem, loadAudioWaitTime, volumeChangeWaitTime, videoStartTimeout, maxSyncFrequency, syncFrequencyCheckPeriod, maxBufferWaitTime) {
    _classCallCheck(this, PageScriptOnYouTubeIframeAPIReady);

    var scriptBuilder = function scriptBuilder() {
      return '\n      window._synca.log(\'onYouTubeIframeAPIReady\');\n\n      window._synca.syncAudio = function(accuracy) {\n        if (window._synca.h) {\n          window._synca.log(\'syncAudio: \' + (window._synca.vp.getCurrentTime() - window._synca.ap.getCurrentTime()));\n        }\n        accuracy = accuracy || 0;\n    \n        var timeToSet = window._synca.vp.getCurrentTime() + window._synca.timeDiff;\n        var minTimeRange, maxTimeRange;\n\n        if (timeToSet < 0) {\n          timeToSet = -1 * window._synca.timeDiff;\n          maxTimeRange = timeToSet + accuracy;\n          minTimeRange = timeToSet - accuracy;\n          if (minTimeRange < 0) {\n            minTimeRange = 0;\n          }\n          if (window._synca.ap.getCurrentTime() > accuracy) {\n            window._synca.ap.seekTo(0, true);\n            window._synca.onSeekToSyncAudio();\n          }\n\n          if (window._synca.vp.getCurrentTime() > maxTimeRange\n              || window._synca.vp.getCurrentTime() < minTimeRange) {\n            window._synca.vp.seekTo(timeToSet, true);\n          }\n        } else {\n          maxTimeRange = timeToSet + accuracy;\n          minTimeRange = timeToSet - accuracy;\n          if (minTimeRange < 0) {\n            minTimeRange = 0;\n          }\n          if (window._synca.ap.getCurrentTime() > maxTimeRange\n              || window._synca.ap.getCurrentTime() < minTimeRange) {\n            window._synca.ap.seekTo(timeToSet, true);\n            window._synca.onSeekToSyncAudio();\n          }\n        }\n      };\n      window._synca.onSeekToSyncAudio = function() {\n        if (window._synca.ap.getPlayerState() !== 1) {\n          return false;\n        }\n\n        if (!window._synca.seekToAudioSyncLog) {\n          window._synca.seekToAudioSyncLog = [];\n        };\n        var currentTime = (new Date()).getTime();\n        if (window._synca.seekToAudioSyncLog.length < (' + this.maxSyncFrequency + ' -1)) {\n          window._synca.seekToAudioSyncLog.push(currentTime);\n        } else if (window._synca.seekToAudioSyncLog.length === (' + this.maxSyncFrequency + ' -1)) {\n          if (currentTime - window._synca.seekToAudioSyncLog[0] < ' + this.syncFrequencyCheckPeriod + ') {\n            window._synca.log(\'>>>>> Too Frequent Audio Sync Seek!!\');\n            window._synca.seekToAudioSyncLog = [];\n            window._synca.vp.pauseVideo();\n            setTimeout(function(){\n              window._synca.vp.playVideo();\n            },\n            ' + this.waitTimeOnSyncProblem + ');\n          } else {\n            window._synca.seekToAudioSyncLog.shift();\n            window._synca.seekToAudioSyncLog.push(currentTime);\n          }\n        } else {\n          while (window._synca.seekToAudioSyncLog.length >= ' + this.maxSyncFrequency + '){\n            window._synca.seekToAudioSyncLog.shift();\n          }\n        };\n      };\n      window._synca.switchVideoAudioOutput = function() {\n        if ((window._synca.vp || {}).getVolume && (window._synca.ap || {}).getVolume) {\n          var volumeToSet = Math.floor(window._synca.vp.getVolume());\n          if (window._synca.ap.isMuted()) {\n            window._synca.ap.unMute();\n          };\n          if (!window._synca.vp.isMuted()) {\n            window._synca.vp.mute();\n          };\n          if (volumeToSet !== window._synca.ap.getVolume()) {\n            window._synca.ap.setVolume(volumeToSet);\n            window._synca.vp.setVolume(volumeToSet);\n          }\n        }\n      };\n      window._synca.onStartBufferingAudio = function() {\n        if (window._synca.audioBufferintTimeoutChecker) {\n          return false;\n        }\n        window._synca.audioBufferintTimeoutChecker = setTimeout(function(){\n          window._synca.audioBufferintTimeoutChecker = false;\n          if (window._synca.vp.getPlayerState() !== 1\n              && window._synca.vp.getPlayerState() !== 2) {\n            return false;\n          }\n          if(window._synca.ap.getPlayerState() === 3) {\n            window._synca.log(\'<<<<< Too Long Audio Buffering!!\');\n            window._synca.vp.pauseVideo();\n            window._synca.onStartBufferingAudio();\n          } else {\n            window._synca.vp.playVideo();\n          }\n        },\n        ' + this.maxBufferWaitTime + ');\n      };\n      window._synca.loadAudioByVideoId = function(videoId) {\n        window._synca.ap.loadVideoById({videoId: videoId, suggestedQuality: \'' + this.playbackQuality + '\'});\n          window._synca.ap.pauseVideo();\n          if (window._synca.vp.getPlayerState() === 1) {\n            window._synca.vp.pauseVideo();\n            setTimeout(function(){\n              window._synca.vp.playVideo();\n            },\n          ' + this.loadAudioWaitTime + ');}\n      };\n      window._synca.ap = new YT.Player(\'aplayer\', { \n        height: \'0\', width: \'0\', videoId: window._synca.vp.getVideoData().video_id, \n        events: {\n          \'onReady\': function(e) {\n            if (e.target.getPlaybackQuality() !== \'' + this.playbackQuality + '\') {\n              e.target.setPlaybackQuality(\'' + this.playbackQuality + '\');\n            }\n            if (e.target.getPlaybackRate() !== window._synca.vp.getPlaybackRate()) {\n              e.target.setPlaybackRate(window._synca.vp.getPlaybackRate());\n            }\n            document.dispatchEvent(new Event(\'audioReady\'));\n          },\n          \'onStateChange\' : function(e) {\n            window._synca.log(\'@@@ audioStateChange: \' + e.data);\n            document.dispatchEvent(new CustomEvent(\'audioStateChange\', {detail: {state: e.data}}));\n            if (e.data === 1) {\n              window._synca.switchVideoAudioOutput();\n              window._synca.syncAudio(' + this.syncAccuracy + ');\n            } else if (e.data === 2) {\n              window._synca.syncAudio(' + this.syncAccuracy + ');\n            } else if (e.data === 3) {\n              if (window._synca.ap.getPlaybackQuality() !== \'' + this.playbackQuality + '\') {\n                e.target.setPlaybackQuality(\'' + this.playbackQuality + '\');\n              }\n              window._synca.onStartBufferingAudio();        \n            }\n          }\n        }\n      });\n      window._synca.vp.addEventListener (\n        \'onStateChange\',\n        function(e) {\n          window._synca.log(\'### videoStateChange: \' + e);\n          if ((window._synca.ap || {}).playVideo) {\n            if (window._synca.adStarted) {\n              window._synca.adStarted = false;\n            };\n            if (e === -1) {\n              if (window._synca.vp.getVideoData().video_id !== window._synca.ap.getVideoData().video_id) {\n                window._synca.loadAudioByVideoId(window._synca.vp.getVideoData().video_id);\n              }\n              setTimeout(function(){\n                if(window._synca.vp.getPlayerState() === -1 && !window._synca.adStarted) {\n                  window._synca.vp.playVideo();\n                }\n              },\n              ' + this.videoStartTimeout + ');\n            } else if (e === 0) {\n              window._synca.ap.stopVideo();\n            } else if (e === 1) {\n              window._synca.ap.playVideo();\n            } else if (e === 2 || e === 3 || e === 5) {\n              window._synca.ap.pauseVideo();\n            };\n          }\n        }\n      );\n      window._synca.vp.addEventListener(\n        \'onVolumeChange\',\n        function(e) {\n          window._synca.log(\'evt: onVolumeChange\');\n          if (!window._synca.adStarted) {\n            setTimeout(function(){\n              window._synca.switchVideoAudioOutput();\n            },\n            ' + this.volumeChangeWaitTime + ');\n          }\n        }\n      );\n      window._synca.vp.addEventListener(\n        \'onPlaybackRateChange\',\n        function(e) {\n          window._synca.log(\'evt: onPlaybackRateChange\');\n          if (e !== window._synca.ap.getPlaybackRate()) {\n            window._synca.ap.setPlaybackRate(e);\n          }\n        }\n      );\n      window._synca.vp.addEventListener(\n        \'onApiChange\',\n        function() {\n          window._synca.log(\'evt: onApiChange\');\n          if (window._synca.vp.getVideoData().video_id !== window._synca.ap.getVideoData().video_id) {\n            window._synca.loadAudioByVideoId(window._synca.vp.getVideoData().video_id);\n          }\n        }\n      );\n      window._synca.vp.addEventListener(\n        \'onAdStart\',\n        function() {\n          window._synca.log(\'evt: onAdStart\');\n          window._synca.adStarted = true;\n          if (window._synca.adStarted && (window._synca.ap || {}).pauseVideo) {\n            window._synca.ap.pauseVideo();\n            window._synca.ap.mute();\n            window._synca.vp.unMute();\n          }\n        }\n      );\n      window._synca.vp.addEventListener(\n        \'onError\',\n        function() {\n          window._synca.log(\'evt: onError\');\n          if ((window._synca.ap || {}).pauseVideo) {\n            window._synca.ap.pauseVideo();\n          }\n        }\n      );';
    };

    var _this6 = _possibleConstructorReturn(this, (PageScriptOnYouTubeIframeAPIReady.__proto__ || Object.getPrototypeOf(PageScriptOnYouTubeIframeAPIReady)).call(this, scriptBuilder));

    _this6.playbackQuality = playbackQuality;
    _this6.syncAccuracy = syncAccuracy;
    _this6.waitTimeOnSyncProblem = waitTimeOnSyncProblem;
    _this6.loadAudioWaitTime = loadAudioWaitTime;
    _this6.volumeChangeWaitTime = volumeChangeWaitTime;
    _this6.videoStartTimeout = videoStartTimeout;
    _this6.maxSyncFrequency = maxSyncFrequency;
    _this6.syncFrequencyCheckPeriod = syncFrequencyCheckPeriod;
    _this6.maxBufferWaitTime = maxBufferWaitTime;
    return _this6;
  }

  return PageScriptOnYouTubeIframeAPIReady;
}(PageScriptBase);

var LocalScript = function () {
  function LocalScript(localScriptPath, id, async) {
    _classCallCheck(this, LocalScript);

    this.localScriptPath = localScriptPath;
    this.id = id;
    this.async = async;
    this.insertToPage = function () {
      var path = chrome.extension.getURL(localScriptPath);
      var tag = document.createElement('script');
      tag.type = 'text/javascript';
      tag.src = path;
      if (id) {
        tag.id = id;
      };
      if (async) {
        tag.async = true;
      };
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    };
  }

  _createClass(LocalScript, [{
    key: 'insertToPage',
    value: function insertToPage() {
      this.insertToPage();
    }
  }]);

  return LocalScript;
}();

var UiController = function () {
  function UiController(updateAudioTimingMaxWait) {
    _classCallCheck(this, UiController);

    this.closeButtonUrl = __UI_ICON_CLOSE_PATH;
    this.pageScriptReloadPage = new PageScriptReloadPage();
    this.pageScriptUpdateAudioTiming = new PageScriptUpdateAudioTiming(updateAudioTimingMaxWait);
    this.uiSlider = null;
    this.updateSliderStatus = function (state) {
      if (!this.uiSlider) {
        return false;
      }
      this.uiSlider.slider(state);
    };
    this.getAudioTimingText = function (val) {
      var retVal = val || 0;
      if (val > 0) {
        retVal = '+ ' + val;
      } else if (val < 0) {
        retVal = '- ' + -1 * val;
      } else {
        retVal = '± 0.0';
      }
      if (retVal.length === 3) {
        retVal = retVal + '.0';
      }
      return retVal;
    };
  }

  _createClass(UiController, [{
    key: 'init',
    value: function init() {
      var context = this;

      $('#body-container').addClass('ytsynca');
      var uiController = $('<div id=\'ui-ytsynca\'>\n        <img id=\'ui-ytsynca-exit\' src=\'\' width=\'12px\' height=\'12px\'>\n        <div id=\'ui-ytsynca-label\'>\n          Audio Timing : <span id=\'ui-ytsynca-val\'></span>s\n        </div>\n        <div id=\'ui-ytsynca-ctrl\'>\n          <div id=\'ui-ytsynca-slider\'></div>\n        </div>\n      </div>');

      uiController.find('#ui-ytsynca-val').text(this.getAudioTimingText(0));
      uiController.find('#ui-ytsynca-exit').attr('src', this.closeButtonUrl).on('click', function () {
        context.pageScriptReloadPage.exec();
      });

      this.uiSlider = uiController.find('#ui-ytsynca-slider').slider({
        value: 0, step: 0.1,
        min: -10, max: 10,
        slide: function slide(event, ui) {
          $('#ui-ytsynca-val').text(context.getAudioTimingText(ui.value));
        },
        stop: function stop(event, ui) {
          context.pageScriptUpdateAudioTiming.exec(ui.value);
        }
      });
      $('#player-api').append(uiController);
    }
  }, {
    key: 'enable',
    value: function enable() {
      this.updateSliderStatus('enable');
    }
  }, {
    key: 'disable',
    value: function disable() {
      this.updateSliderStatus('disable');
    }
  }]);

  return UiController;
}();

var ToastMessage = function () {
  function ToastMessage(message, timeout, iconUrl) {
    _classCallCheck(this, ToastMessage);

    this.element = $('\n      <div id=\'ui-ytsynca-toast-message\'>\n        <div class=\'ui-ytsynca-toast-message-content\'>\n        <img class=\'icon\' src=\'\' width=\'32px\' height=\'32px\'>\n        <div class=\'text\'></div>\n        </div>\n      </div>');
    this.element.find('.text').text(message);
    this.timeout = timeout;
    if (iconUrl) {
      this.element.find('.icon').attr('src', iconUrl);
    }
  }

  _createClass(ToastMessage, [{
    key: 'show',
    value: function show(message, timeout) {
      var context = this;
      var show = function show() {
        context.element.appendTo('#masthead-positioner');
        setTimeout(function () {
          context.hide();
        }, context.timeout);
      };
      var existingElement = $('#ui-ytsynca-toast-message');
      if ((existingElement || {}).length > 0) {
        $.when(existingElement.remove()).then(show());
      } else {
        show();
      }
    }
  }, {
    key: 'hide',
    value: function hide() {
      if (this.element) {
        this.element.fadeOut(500, function () {
          return this.remove();
        });
      }
    }
  }]);

  return ToastMessage;
}();

var LocalStorage = function () {
  function LocalStorage() {
    _classCallCheck(this, LocalStorage);
  }

  _createClass(LocalStorage, [{
    key: 'getExtUsed',
    value: function getExtUsed(defaultVal, callback) {
      chrome.storage.local.get({ extUsed: defaultVal }, function (settings) {
        callback((settings || {}).extUsed);
      });
    }
  }, {
    key: 'setExtUsed',
    value: function setExtUsed(value) {
      chrome.storage.local.set({ extUsed: value }, function () {});
    }
  }]);

  return LocalStorage;
}();

/**************************************
 *  class constants
 **************************************/


var __localStorage = new LocalStorage();
var __uiController = new UiController(__UPDATE_AUDIO_TIMING_WAIT_TIME);
var __startProcessToastMessage = new ToastMessage(__START_MESSAGE.message, __START_MESSAGE.timeout, __START_MESSAGE.iconUrl);

/**************************************
 * DOM completed
 **************************************/
(function () {
  // audio video insert tag
  $('body').append('<div id=\'aplayer\'>');
  // embeded script
  new LocalScript(__LOCAL_SCRIPT.EMBEDED.path).insertToPage();
  // unmute the player if YouTube opend after the extension is used
  __localStorage.getExtUsed(false, function (extUsed) {
    if (extUsed) {
      new PageScriptPostExtUse().exec();
    }
  });
})();

/***************************************************
 *  On post estension use process completed
 ***************************************************/
document.addEventListener('postExtUseProcessCompleted', function (e) {
  __localStorage.setExtUsed(false);
});

/***************************************************
 *  On extension icon clicked
 ***************************************************/
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.evt === 'extIconClicked') {
    new PageScriptStartProcess().exec();
  }
});

/*********************************************************
 * On ready to start process
 *********************************************************/
document.addEventListener('readyToStartProcess', function () {
  // show process start message
  __startProcessToastMessage.show();
  // init audio sync player
  new PageScriptInitAudioSyncPlayer().exec();
});

/**************************************
 * on audio player ready to load
 **************************************/
document.addEventListener('readyToLoadAudioApi', function (e) {
  // injext YouTube official iframe player library
  var localscript = new LocalScript(__LOCAL_SCRIPT.YOUTUBE_OFFICIAL_IFRAME_PLAYER_API.path, __LOCAL_SCRIPT.YOUTUBE_OFFICIAL_IFRAME_PLAYER_API.id, __LOCAL_SCRIPT.YOUTUBE_OFFICIAL_IFRAME_PLAYER_API.async);
  localscript.insertToPage();
});

/*************************************
 * on audio player API is ready
 *************************************/
document.addEventListener('audioAPIReady', function () {
  var pageScript = new PageScriptOnYouTubeIframeAPIReady(__PLAYBACK_QUALITY, __SYNC_ACCURACY, __WAIT_TIME_ON_SYNC_PROBLEM, __LOAD_AUDIO_WAIT_TIME, __VOLUME_CHANGE_WAIT_TIME, __VIDEO_START_TIMEOUT, __MAX_SYNC_FREQUENCY, __SYNC_FREQUENCY_CHECK_PERIOD, __MAX_BUFFER_WAIT_TIME);
  pageScript.exec();
});

/********************************************
 * on audio player ready to play
 ********************************************/
document.addEventListener('audioReady', function (e) {
  __uiController.init();
  __startProcessToastMessage.hide();
  __localStorage.setExtUsed(true);
});

/********************************************
 * on audio player statechange
 ********************************************/
document.addEventListener('audioStateChange', function (e) {
  if (e.detail.state === -1 || e.detail.state === 0 || e.detail.state === 1 || e.detail.state === 2) {
    __uiController.enable();
  } else {
    __uiController.disable();
  }
});