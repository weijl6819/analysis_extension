//Global access to fd extenstion
if(!window.fdWebExtension)
{
  window.fdWebExtension = {};
}

//console.debug('fdWebExtension - executing');
fdWebExtension.fdExtensionVersion = "Unknown";

// see https://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
fdWebExtension.fdIsChrome = !!window.chrome && !!window.chrome.webstore;
fdWebExtension.fdIsFirefox = typeof InstallTrigger !== 'undefined';

// for FD-14927 - we no longer poll for connection, so weird instances of this script, like when it is embedded
// in Quippe/EO.WebBrowser for PCH, we need to check if the document is not finished loading
// if it is not, the set a callback to attach the focus listeners for when the doc is loaded
if((document.readyState === 'complete') || (document.readyState !== 'loading' && !document.documentElement.doScroll)){
  //console.log("content already loaded");
  // already loaded the document, focus listeners will be attached after connection is made
}else{
  //console.log("adding callback for content loaded");
  document.addEventListener("DOMContentLoaded", function(){
    fdWebExtension.fdAttachFocusListeners(document);
    fdWebExtension.fdObserveMutations(document);
  });
}

document.addEventListener('versionUpdated', function (e) {
  var version = e.detail;
  console.debug("Got version: " + version);
  fdWebExtension.fdExtensionVersion = version;
});

if (!fdWebExtension.fdConfigureExtension) {
  fdWebExtension.fdExtensionConfig = {
    enableLogging: false,
    logContentEditableInfo: false,
    keypressEventDirection: "keydown"
  };

  fdWebExtension.fdConfigureExtension = function (config) {
    fdWebExtension.fdExtensionConfig.enableLogging = config.enableLogging !== undefined ? config.enableLogging : false;
    fdWebExtension.fdExtensionConfig.logContentEditableInfo = config.logContentEditableInfo !== undefined ? config.logContentEditableInfo : false;
    fdWebExtension.fdExtensionConfig.keypressEventDirection = config.keypressEventDirection !== undefined ? config.keypressEventDirection : "keydown";

    fdWebExtension.fdLog('fdConfigureExtension - enableLogging=' + fdWebExtension.fdExtensionConfig.enableLogging);
    fdWebExtension.fdLog('fdConfigureExtension - logContentEditableInfo=' + fdWebExtension.fdExtensionConfig.logContentEditableInfo);
    fdWebExtension.fdLog('fdConfigureExtension - keypressEventDirection=' + fdWebExtension.fdExtensionConfig.keypressEventDirection);
  }
}

if (!fdWebExtension.fdLog) {
  fdWebExtension.fdDisableLoggingForMessage = false;

  fdWebExtension.fdLog = function (logLine, forceLog = false) {
    if (!fdWebExtension.fdExtensionConfig.enableLogging && !forceLog)
      return;
    else if (fdWebExtension.fdDisableLoggingForMessage && !forceLog)
      return;

    if (fdWebExtension.fdWebSocket) {
      fdWebExtension.fdWebSocket.send(JSON.stringify({
        id: fdWebExtension.fdGuid(),
        msg: 'WriteLogLine',
        logLine: logLine
      }));
    }
    else {
      console.debug(logLine);
    }
  }
}

if (!fdWebExtension.fdCache) {
  fdWebExtension.fdCache = {};
}

// Create functions necessary for script to connect to and disconnect from FD.
// Also, create functions to support message handling.
if (!fdWebExtension.fdConnect) {

  fdWebExtension.fdPortMin = 2020;
  fdWebExtension.fdPortMax = 2048;
  fdWebExtension.fdPort = null;
  fdWebExtension.fdWebSocket = null;
  fdWebExtension.fdActive = false;  //Flag for active tab

  fdWebExtension.fdSocketsOpen = [];

  fdWebExtension.fdConnect = function () {
    fdWebExtension.fdAttachFocusListeners(window.document);
    fdWebExtension.fdObserveMutations(window.document);
    fdWebExtension.fdActive = true;
    fdWebExtension.fdReconnect();
  };

  fdWebExtension.fdDisconnect = function () {
    //console.debug("fdDisconnect - Tab no longer active");
    fdWebExtension.fdActive = false;

    if (!fdWebExtension.fdWebSocket)
      return;

    fdWebExtension.fdLog("fdDisconnect - closing WebSocket");

    fdWebExtension.fdWebSocket.close();
    fdWebExtension.fdPort = null;
    fdWebExtension.fdWebSocket = null;

    window.removeEventListener('focus', fdWebExtension.fdFocusListener, false);

    // cleanup listeners
    [].forEach.call(window.document.querySelectorAll('input'), function(el) {
      if(el.type == 'text' || el.type == 'search'){
        el.removeEventListener('blur', fdWebExtension.fdBlurListener, false);
        el.removeEventListener('focus', fdWebExtension.fdFocusListener, false);
      }
    });
    [].forEach.call(window.document.querySelectorAll('textarea'), function(el){
      el.removeEventListener('blur', fdWebExtension.fdBlurListener, false);
      el.removeEventListener('focus', fdWebExtension.fdFocusListener, false);
    });
    [].forEach.call(window.document.querySelectorAll('div'), function(el){
      if (el.isContentEditable){
        el.removeEventListener('blur', fdWebExtension.fdBlurListener, false);
        el.removeEventListener('focus', fdWebExtension.fdFocusListener, false);
      }
    });

    if(window.MSpeechAPI){
      // stop listening for MEditor changes...
      fdWebExtension.fdMedCaretObservers.forEach(function(obs){
        obs.disconnect();
      });
      fdWebExtension.fdMedCaretObservers = [];

      if (fdWebExtension.fdHandleMSpeechApiCustomEvent) {
        window.removeEventListener('MSpeechAPI', fdWebExtension.fdHandleMSpeechApiCustomEvent, false);
      }
    }
  }

  fdWebExtension.fdBlurListener = function(event){
    // this is what I think we want. Blur is called when we lose focus. So,
    // if focus is moved from one text field to another, don't push a change.
    // let the focus listener handle that. 
    // But, if we move from a text field, to a non-text field, push then
    if((event.relatedTarget == null) || (!fdWebExtension.fdIsTextInputOrTextArea(event.relatedTarget) && 
        !fdWebExtension.fdIsContentEditableEl(event.relatedTarget))){
      fdWebExtension.fdHandleFocusChange();
    }
    return;
  }

  fdWebExtension.fdFocusListener = function () {
    fdWebExtension.fdHandleFocusChange();
  }

  fdWebExtension.fdHandleFocusChange = function () {
    if (fdWebExtension.fdWebSocket) {
      fdWebExtension.fdPushFocusChange();
    } else {
      fdWebExtension.fdReconnect();
    }
    return;
  }

  fdWebExtension.fdPushFocusChange = function(){
    var customResult = fdWebExtension.fdPushFocusChangeCustom ? fdWebExtension.fdPushFocusChangeCustom() : null;
    if(customResult && customResult === true){
      return true;
    }
    return fdWebExtension.fdPushFocusChangeStandard();
  }

  fdWebExtension.fdPushFocusChangeStandard = function(){
    if(!fdWebExtension.fdWebSocket){
      //console.debug("No socket connection, can't push focus change.")
      return false;
    }
    var result = fdWebExtension.fdGetFocusedControlId();

    if(!result.success){
      fdWebExtension.fdLog("Failed to get focus control id for focus change push: " + result.errorMessage);
      return false;
    }

    return fdWebExtension.fdPushFocusChangeBase(result.focusedControlId, "PushFocusedControlId");
  }

  fdWebExtension.fdPushFocusChangeBase = function(focusId, msgType){
    var isAthena = false;
    if (window.AH)
      isAthena = true;

    var isOncoEMR = false;
    if (window.OncoEMR)
      isOncoEMR = true;
    
    var overrideInsertionMethod = fdWebExtension.fdGetTextInsertionMethodOverride();

    fdWebExtension.fdWebSocket.send(JSON.stringify({
      id: fdWebExtension.fdGuid(), // not really used for push based messages, but needed on server side??
      msg: msgType,
      focusedControlId: focusId,
      isAthena: isAthena,
      isOncoEMR: isOncoEMR,
      overrideInsertionMethod: overrideInsertionMethod
    }));

    return true;
  }

  fdWebExtension.fdReconnect = function () {
    if (fdWebExtension.fdWebSocket) {
      //console.debug("fdReconnect - Already connected");
      return;
    } else if (!fdWebExtension.fdActive) {
      //console.debug("fdReconnect - Tab is not active");
      return;
    }
    //console.debug("fdReconnect - Attempting to connect");
    for (var port = fdWebExtension.fdPortMin; port < fdWebExtension.fdPortMax; port++) {
      if (fdWebExtension.fdSocketsOpen.includes(port)) {
        //console.debug("fdReconnect - Not attempting to connect to port " + port + " since it's still open");
        continue;
      }

      var url = "wss://127.0.0.1:" + port + "/?version=1_1";
      //console.debug("Try port: " + port + "");
      var ws = new WebSocket(url);
      fdWebExtension.fdSocketsOpen.push(port);
      //On open handler
      ws.onopen = fdWebExtension.fdOnOpenCallback(ws, port);
      //On close handler
      ws.onclose = fdWebExtension.fdOnCloseCallback(ws, port);
      //On message handler
      ws.onmessage = fdWebExtension.fdOnMessageCallback(ws, port);
      //On errors remove socket from poll
    }

  }

  fdWebExtension.fdOnOpenCallback = function(socket, port) {
    return function (evt) {
      fdWebExtension.fdInitializeApi();
      //console.info("onOpenCallback - A connection on port " + port + " has been made");
    };
  }

  fdWebExtension.fdOnMessageCallback = function(socket, port) {
    return function (evt) {
      if (!fdWebExtension.fdActive) {
        //console.debug("onMessageCallback - Tab is no longer active.  Closing web socket on port " + port + "...");
        socket.close();
        return;
      }
      if (!fdWebExtension.fdWebSocket) {
        //console.info("onMessageCallback - Connected on port " + port);
        fdWebExtension.fdWebSocket = socket;
        fdWebExtension.fdPort = port;

        fdWebExtension.fdLog('Connected to FdExtension, version: ' + fdWebExtension.fdExtensionVersion + ' port: ' + port, true);
      }
      try {
        var obj = JSON.parse(evt.data);
        if (!obj || !obj.msg) {
          fdWebExtension.fdLog('onMessageCallback - unknown message format');
          return;
        }

        if (obj.msg) {
        }

        // FD polling code that sends messages will result in log spam
        // So give FD a way to disable logging per message
        if (obj.disableLogging) {
          fdWebExtension.fdDisableLoggingForMessage = true;
        }

        if (obj.tabId && obj.tabId != fdWebExtension.fdTabId) {
          fdWebExtension.fdWebSocket.send(JSON.stringify({
            id: obj.id,
            msg: obj.msg,
            result: {
              success: false,
              errorMessage: 'target tabId={' + obj.tabId + '}; current tabId={' + fdWebExtension.fdTabId + '}'
            }
          }));
          return;
        }

        fdWebExtension.fdLog('onMessageCallback - handling msg=' + obj.msg);

        for (var i = 0; i < fdWebExtension.fdMessageHandlers.length; i++) {
          var startTime = Date.now();
          var handled = fdWebExtension.fdMessageHandlers[i].messageHandler(obj);
          if (handled) {
            var stopTime = Date.now();
            fdWebExtension.fdLog('fdWebSocket - finished handling msg=' +
              obj.msg +
              ' messageHandler=' +
              fdWebExtension.fdMessageHandlers[i].id +
              ' execTime=' +
              (stopTime - startTime) +
              'ms');
            fdWebExtension.fdDisableLoggingForMessage = false;
            return;
          }
        }
      } catch (ex) {
        fdWebExtension.fdLog('onMessageCallback - ' + ex.stack);
      }

      fdWebExtension.fdLog("onMessageCallback - message was not handled");

      fdWebExtension.fdDisableLoggingForMessage = false;
    };
  }

  fdWebExtension.fdOnCloseCallback = function(socket, port) {
    return function () {
      var openSocketIndex = fdWebExtension.fdSocketsOpen.indexOf(port);
      if (openSocketIndex >= 0) {
        fdWebExtension.fdSocketsOpen.splice(openSocketIndex, 1);
      }

      //console.info("onCloseCallback - Disconnected from port " + port);
      if (port === fdWebExtension.fdPort) {
        fdWebExtension.fdWebSocket = null;
        fdWebExtension.fdPort = null;
      }
    }
  }

  // messageHandler takes a message object and if the message is handled should return true else false
  // so if false is returned, then other message handlers will get the oppurtunity to handle the message
  fdWebExtension.fdMessageHandlers = [];
  fdWebExtension.fdAddMessageHandler = function (id, messageHandler) {
    fdWebExtension.fdMessageHandlers.push({
      id: id,
      messageHandler: messageHandler
    });
  };

  fdWebExtension.fdGuid = function () {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
  }

  fdWebExtension.fdAddMessageHandler('ConfigureExtensionHandler', function (obj) {
    if (obj.msg == 'ConfigureExtension') {
      fdWebExtension.fdConfigureExtension({
        enableLogging: obj.enableLogging !== undefined ? obj.enableLogging : false,
        logContentEditableInfo: obj.logContentEditableInfo !== undefined ? obj.logContentEditableInfo : false,
        keypressEventDirection: obj.keypressEventDirection !== undefined ? obj.keypressEventDirection : "keydown"
    });

      fdWebExtension.fdWebSocket.send(JSON.stringify({
        id: obj.id,
        msg: obj.msg,
        result: {
          success: true,
          errorMessage: ''
        }
      }));

      return true;
    }

    return false;
  });
}

//Custom functions
//Check for legacy functions
if (typeof fdGetGrammar !== 'undefined') {
  fdWebExtension.fdGetGrammar = fdGetGrammar;
}
if (typeof fdExecuteCommand !== 'undefined') {
  fdWebExtension.fdExecuteCommand = fdExecuteCommand;
}
if (typeof fdGetUserId !== 'undefined') {
  fdWebExtension.fdGetUserId = fdGetUserId;
}

// Athena
// Create fdGetGrammar and fdExecuteCommand that wrap Athena's SpeechToText API
// that provides the ability to voice enable parts of the Athena UI.
// Create timer that polls Athena UI for contentEditable divs and sets role="text"
// attribute in order to get level 3 support.
if (window.AH) {
  fdWebExtension.fdLog('fdWebExtension - found Athena');

  if (window.SpeechToText) {
    fdWebExtension.fdLog('fdWebExtension - found Athena SpeechToText');

    fdWebExtension.fdGrammar = '';
    fdWebExtension.fdGrammarTimestamp = 0;

    if (!fdWebExtension.fdGetGrammar) {
      fdWebExtension.fdLog('fdWebExtension - defining Athena grammar functions');

      fdWebExtension.fdGetGrammarLogLevel = 0;
      fdWebExtension.fdGetGrammar = function () {
        if (!window.SpeechToText) {
          if (fdWebExtension.fdGetGrammarLogLevel == 0) {
            fdWebExtension.fdLog('fdGetGrammar - window.SpeechToText is null');
            fdWebExtension.fdGetGrammarLogLevel = 1;
          }
          fdWebExtension.fdGrammar = '';
          return fdWebExtension.fdGrammar;
        }

        if (!window.SpeechToText.V1_1) {
          if (fdWebExtension.fdGetGrammarLogLevel <= 1) {
            fdWebExtension.fdLog('fdGetGrammar - window.SpeechToText.V1_1 is null');
            fdWebExtension.fdGetGrammarLogLevel = 2;
          }
          fdWebExtension.fdGrammar = '';
          return fdWebExtension.fdGrammar;
        }

        var canRetrieveGrammar = window.SpeechToText.V1_1.CanRetrieveGrammar();
        if (!canRetrieveGrammar) {
          if (fdWebExtension.fdGetGrammarLogLevel <= 2) {
            fdWebExtension.fdLog('fdGetGrammar - CanRetrieveGrammar=false');
            fdWebExtension.fdGetGrammarLogLevel = 3;
          }
          fdWebExtension.fdGrammar = '';
          return fdWebExtension.fdGrammar;
        }

        var isGrammarReady = window.SpeechToText.V1_1.IsGrammarReady(fdWebExtension.fdGrammarTimestamp, 'JSGF');
        if (!isGrammarReady) {
          if (fdWebExtension.fdGetGrammarLogLevel <= 3) {
            fdWebExtension.fdLog('fdGetGrammar - IsGrammarReady(' + fdWebExtension.fdGrammarTimestamp + ')=false');
            fdWebExtension.fdGetGrammarLogLevel = 4;
          }
          fdWebExtension.fdGrammar = '';
          return fdWebExtension.fdGrammar;
        }

        var getGrammarStr = window.SpeechToText.V1_1.GetGrammar('JSGF');
        var getGrammarObj = JSON.parse(getGrammarStr);
        if (!getGrammarObj || !getGrammarObj.success || getGrammarObj.data === undefined || getGrammarObj.data.indexOf('not a supported grammar') > 0) {
          if (fdWebExtension.fdGetGrammarLogLevel <= 4) {
            fdWebExtension.fdLog('fdGetGrammar - GetGrammar failed - result=' + getGrammarStr);
            fdWebExtension.fdGetGrammarLogLevel = 5;
          }
          fdWebExtension.fdGrammar = '';
          return fdWebExtension.fdGrammar;
        }

        if (getGrammarObj.data) {
          fdWebExtension.fdGrammarTimestamp = getGrammarObj.timestamp;

          var grammar = getGrammarObj.data;
          grammar = grammar.replace(/(\r\n|\n|\r)/gm, ' ');
          grammar = grammar.replace(/ to/gm, " (to | two | too | 2)");
          grammar = grammar.replace(/ flowsheets/gm, " (flowsheets | (flow sheets))");
          grammar = grammar.replace(/ flowsheet/gm, " (flowsheet | (flow sheet))");
          grammar = grammar.replace(/ facesheet/gm, " (facesheet | (face sheet))");

          fdWebExtension.fdLog('fdGetGrammar - grammar=' + grammar);
          fdWebExtension.fdGetGrammarLogLevel = 0;  //reset function's log level so errors can be logged again

          fdWebExtension.fdGrammar = grammar;
          return fdWebExtension.fdGrammar;
        }
        else {
          // GetGrammar was successful, but grammar is empty
          // so use current grammar
          return fdWebExtension.fdGrammar;
        }
      }

      fdWebExtension.fdExecuteCommand = function (resultDetail) {
        fdWebExtension.fdLog("fdExecuteCommand - value='" + resultDetail.$value + "'");

        var resultValue = resultDetail.$value;
        resultValue = resultValue.replace(/ 2/gm, " to");
        resultValue = resultValue.replace(/ too/gm, " to");
        resultValue = resultValue.replace(/ two/gm, " to");
        resultValue = resultValue.replace(/ flow sheets/gm, " flowsheets");
        resultValue = resultValue.replace(/ flow sheet/gm, " flowsheet");
        resultValue = resultValue.replace(/ face sheet/gm, " facesheet");
        resultValue = resultValue.replace(/ tablet/gm, " tab");
        resultValue = resultValue.replace(/ tablets/gm, " tab");

        window.SpeechToText.V1_1.Enter(resultValue);
      }
    }
  }

  if (!fdWebExtension.fdUpdateContentEditableDiv) {
    fdWebExtension.fdUpdateContentEditableDiv = function (divEl) {
      if (!divEl.isContentEditable) {
        return;
      }

      var role = divEl.getAttribute('role');
      if (role && role == 'textbox') {
        return;
      }

      fdWebExtension.fdLog('fdUpdateContentEditableDiv - setting role=textbox on contentEditable div id=' + divEl.id);

      divEl.setAttribute('role', 'textbox');
      // 'blur' is called when a field/item loses focus, 'focus' is called when
      // an item gains focus. So listen for both
      divEl.addEventListener('blur', fdWebExtension.fdBlurListener, false);
      divEl.addEventListener('focus', fdWebExtension.fdFocusListener, false);
    }
  }

  if (!fdWebExtension.fdUpdateContentEditableDivsInFrame) {
    fdWebExtension.fdUpdateContentEditableDivsInFrame = function (frame) {
      var divEls = frame.document.getElementsByTagName('div');
      for (var i = 0; i < divEls.length; i++) {
        var divEl = divEls[i];
        fdWebExtension.fdUpdateContentEditableDiv(divEl);
      }

      for (var i = 0; i < frame.frames.length; i++) {
        fdWebExtension.fdUpdateContentEditableDivsInFrame(frame.frames[i]);
      }
    }
  }

  if (!fdWebExtension.fdAthenaTimerId) {
    if (window.AH.Frames.Main) {
      fdWebExtension.fdLog('fdWebExtension - found Athena main frame, creating Athena timer');

      fdWebExtension.fdAthenaTimerId = window.setInterval(function (athenaMainFrame) {
        if (!athenaMainFrame.frame) {
          fdWebExtension.fdLog('fdAthenaTimer - Athena main frame is not loaded yet');
          return;
        }

        fdWebExtension.fdUpdateContentEditableDivsInFrame(athenaMainFrame.frame);
      }, 100, window.AH.Frames.Main);
    }
  }
}

if (!fdWebExtension.fdGetFocusedControlIdStandard) {
  fdWebExtension.fdLastUniqueControlIdNum = 0;
  fdWebExtension.fdGenerateUniqueControlId = function() {
    return "fdControl" + ++fdWebExtension.fdLastUniqueControlIdNum;
  }

  fdWebExtension.fdGetMainWindow = function (frame) {
    var mainWindow = frame ? frame.contentWindow : window;

    if (!mainWindow.document.activeElement) {
      return mainWindow;
    }
    else if (!mainWindow.document.activeElement.contentDocument) {
      return mainWindow;
    }
    else {
      return fdWebExtension.fdGetMainWindow(mainWindow.document.activeElement);
    }
  }

  fdWebExtension.fdIsTextInputOrTextArea = function (el) {
    return el.tagName == 'TEXTAREA' || (el.tagName == 'INPUT' && (el.type == 'text' || el.type == 'search'));
  }

  fdWebExtension.fdIsContentEditableEl = function (el) {
    return el.isContentEditable;
  }

  fdWebExtension.fdGetFocusedControlIdStandard = function () {
    var mainWindow = fdWebExtension.fdGetMainWindow();
    var activeElement = mainWindow.document.activeElement;
    if (!activeElement) {
      fdWebExtension.fdLog('fdGetFocusedControlIdStandard - no active element');
      return {
        success: true,
        focusedControlId: null
      };
    }

    var isStandardTextControl = fdWebExtension.fdIsTextInputOrTextArea(activeElement) || fdWebExtension.fdIsContentEditableEl(activeElement);
    if (!isStandardTextControl) {
      fdWebExtension.fdLog("fdGetFocusedControlIdStandard - id='" + activeElement.id + "' tagName='" + activeElement.tagName +
        "' isContentEditable=" + activeElement.isContentEditable + " is not a text control");

      return {
        success: true,
        focusedControlId: null
      };
    }

    if (!activeElement.getAttribute('fdUniqueId')) {
      activeElement.setAttribute('fdUniqueId', fdWebExtension.fdGenerateUniqueControlId());
    }

    fdWebExtension.fdLog("fdGetFocusedControlIdStandard - id='" + activeElement.id + "' fdUniqueId='" + activeElement.getAttribute('fdUniqueId') +
      "' tagName='" + activeElement.tagName + "' isContentEditable=" + activeElement.isContentEditable);

    // for using FD's correction window with Athena, see comments in FD-13659
    if (window.AH) {
      try {
        var greatGrandParentEl = activeElement.parentElement.parentElement.parentElement;
        fdWebExtension.fdCache["greatGrandParentElementOfCorrectionWindowElement"] = greatGrandParentEl;
        fdWebExtension.fdCache["correctionWindowElementText"] = activeElement.textContent;
      } catch (error) {}
    }

    return {
      success: true,
      focusedControlId: activeElement.getAttribute('fdUniqueId')
    };
  }

  // make sure child node is selected instead of outer div or paragraph (see FD-13017)
  fdWebExtension.fdEnsureChildNodeIsSelected = function (node) {
    if (!fdWebExtension.fdIsChrome)
      return;  // so far only necessary in Chrome
    if (node.childNodes.length == 0)
      return;

    var mainWindow = fdWebExtension.fdGetMainWindow();
    var sel = mainWindow.getSelection();
    if (sel == null)
      return;

    if (node.nodeName == 'DIV' || node.nodeName == 'P') {

      if (sel.anchorNode == null)
        return;

      if (sel.anchorNode.isSameNode(node))
        fdWebExtension.fdLog("fdEnsureChildNodeIsSelected - selection anchor in outer node - nodeName='" + node.nodeName + "' childNodesLength=" + node.childNodes.length + " selAnchorOffset=" + sel.anchorOffset);
      if (sel.focusNode.isSameNode(node))
        fdWebExtension.fdLog("fdEnsureChildNodeIsSelected - selection focus in outer node - nodeName='" + node.nodeName + "' childNodesLength=" + node.childNodes.length + " selFocusOffset=" + sel.focusOffset);

      if (sel.anchorNode.isSameNode(node) && sel.focusNode.isSameNode(node)) {
        fdWebExtension.fdLog("fdEnsureChildNodeIsSelected - setting selection to child node...");

        var selectedNodeOffset = sel.anchorOffset < node.childNodes.length ? sel.anchorOffset : node.childNodes.length - 1;
        var node = node.childNodes[selectedNodeOffset];
        var newSelRange = mainWindow.document.createRange();
        newSelRange.setStart(node, node.length !== undefined ? node.length : 0);
        newSelRange.setEnd(node, node.length !== undefined ? node.length : 0);
        sel.removeAllRanges();
        sel.addRange(newSelRange);
      }
    }
  }

  fdWebExtension.fdGetContentEditableElementInfo = function (node, info, indentLogMsgSpacesCt) {

    var mainWindow = fdWebExtension.fdGetMainWindow();
    var sel = mainWindow.getSelection();
    var childNodes = node.childNodes;

    const baseAndExt = 'baseNode' in sel && 'extentNode' in sel;
    const startNode = baseAndExt ? sel.baseNode : sel.anchorNode;
    const startOffset = baseAndExt ? sel.baseOffset : sel.anchorOffset;
    const endNode = baseAndExt ? sel.extentNode : sel.focusNode;
    const endOffset = baseAndExt ? sel.extentOffset : sel.focusOffset;

    const startNodeIsTextNode = startNode.nodeName === "#text";
    const endNodeIsTextNode = endNode.nodeName === "#text";
    const startNodeCharOffset = startNodeIsTextNode ? startOffset : 0;
    const endNodeCharOffset = endNodeIsTextNode ? endOffset : 0;
    const startNodeChildNodeOffset = !startNodeIsTextNode ? startOffset : 0;
    const endNodeChildNodeOffset = !endNodeIsTextNode ? endOffset : 0;

    if (info.text === undefined) {
      if (sel.isCollapsed) {
        info.isSelLeftToRight = true;
      }
      else if (sel.baseNode.isSameNode(sel.extentNode)) {
        info.isSelLeftToRight = startOffset <= endOffset;
      }
      else {
        info.isSelLeftToRight = startNode.compareDocumentPosition(endNode) & Node.DOCUMENT_POSITION_FOLLOWING;
      }

      info.text = '';
      info.selStart = 0;
      info.selEnd = 0;
      info.foundSelStart = false;
      info.foundSelEnd = false;
      info.currNodeStart = 0;
      info.currNodeEnd = 0;
      info.nodeList = [];
      info.logMsg = '';
    }

    if (childNodes.length == 0) {
      return;
    }

    for (var i = 0; i < childNodes.length; i++) {
      var childNode = childNodes[i];

      // Firefox adds an unnecessary </br> at the end, just ignore it
      if (fdWebExtension.fdIsFirefox && i == childNodes.length - 1 && childNode.nodeName == 'BR')
        continue;

      var isStartNode = (childNode.nodeName == '#text' && childNode.isSameNode(startNode)) || (childNode.parentNode.isSameNode(startNode) && i === startNodeChildNodeOffset);
      var isEndNode = (childNode.nodeName == '#text' && childNode.isSameNode(endNode)) || (childNode.parentNode.isSameNode(endNode) && i === endNodeChildNodeOffset);

      var text = '';
      if (childNode.nodeName == '#text') {
        text = childNode.nodeValue;
      }
      else if (childNode.nodeName == 'BR') {
        text = '\n';
      }
      else if ((childNode.nodeName == 'DIV' || childNode.nodeName == 'P') && childNode.nodeValue == null && childNode.childNodes.length > 0 && i != 0) {
        // add new line for all nested DIV and P
        // except whenever it's the first child (i == 0) otherwise an unnecessary new line gets added to very beggining of text
        text = '\n';
      }

      if (text) {
        info.text += text;

        info.nodeList.push({
          node: childNode,
          text: text,
          start: info.currNodeEnd,
          end: info.currNodeEnd + text.length
        });
        info.currNodeStart = info.nodeList[info.nodeList.length - 1].start;
        info.currNodeEnd = info.nodeList[info.nodeList.length - 1].end;
      }

      // selection anchor and focus for empty lines is the outer div rather than inner line break
      // this throws off our selection start and/or end calculations
      // so detect the condition here and update selection start and/or end below by adding 1
      var isBrOnlyDiv = childNode.nodeName == 'DIV' && childNode.childNodes.length == 1 && childNode.childNodes[0].nodeName == 'BR';

      if (!info.foundSelStart) {
        if (info.isSelLeftToRight && isStartNode) {
          info.selStart += startNodeCharOffset;
          if (isBrOnlyDiv) {
            info.selStart++;
          }
          info.foundSelStart = true;
        }
        else if (!info.isSelLeftToRight && isEndNode) {
          info.selStart += endNodeCharOffset;
          if (isBrOnlyDiv) {
            info.selStart++;
          }
          info.foundSelStart = true;
        }
        else {
          info.selStart += text.length;
        }
      }

      if (!info.foundSelEnd) {
        if (info.isSelLeftToRight && isEndNode) {
          info.selEnd += endNodeCharOffset;
          if (isBrOnlyDiv) {
            info.selEnd++;
          }
          info.foundSelEnd = true;
        }
        else if (!info.isSelLeftToRight && isStartNode) {
          info.selEnd += startNodeCharOffset;
          if (isBrOnlyDiv) {
            info.selEnd++;
          }
          info.foundSelEnd = true;
        }
        else {
          info.selEnd += text.length;
        }
      }

      if (fdWebExtension.fdExtensionConfig.enableLogging && fdWebExtension.fdExtensionConfig.logContentEditableInfo) {
        if (info.logMsg == '')
          info.logMsg = 'fdGetContentEditableElementInfo -';
        else
          info.logMsg += '\n';

        info.logMsg += new Array(indentLogMsgSpacesCt).join(' ') +
          " nodeName='" + childNode.nodeName + "' nodeValue='" + childNode.nodeValue + "' text='" + text.replace(/\n/g, '\\n') +
          "' using base & extent=" + baseAndExt + " isStartNode=" + isStartNode + " isEndNode=" + isEndNode +
          " startOffset=" + startOffset + " endOffset=" + endOffset +
          " start=" + (text ? info.currNodeStart : -1) + ", end=" + (text ? info.currNodeEnd : -1);
      }

      if (childNode.nodeName !== 'BR' && childNode.nodeName !== '#text') {
        fdWebExtension.fdGetContentEditableElementInfo(childNode, info, indentLogMsgSpacesCt + 2);
      }
    }
  }

  fdWebExtension.fdFindControlStandard = function (controlId) {
    fdWebExtension.fdLog('fdFindControlStandard - controlId=' + controlId);

    var mainWindow = fdWebExtension.fdGetMainWindow();
    var document = mainWindow.document;
    var textControlEl = document.querySelector('[fdUniqueId="' + controlId + '"]');

    if (textControlEl) {
      fdWebExtension.fdLog('fdFindControlStandard - found controlId=' + controlId)
    }

    return textControlEl;
  }

  fdWebExtension.fdGetTextStandard = function (textControlEl) {
    fdWebExtension.fdLog('fdGetTextStandard - controlId=' + textControlEl.getAttribute('fdUniqueId'));

    var text = '';
    if (fdWebExtension.fdIsTextInputOrTextArea(textControlEl)) {
      text = textControlEl.value;
    }
    else {
      var info = {};
      fdWebExtension.fdGetContentEditableElementInfo(textControlEl, info, 0);
      text = info.text;

      if (fdWebExtension.fdExtensionConfig.logContentEditableInfo)
        fdWebExtension.fdLog(info.logMsg);
    }

    fdWebExtension.fdLog("fdGetTextStandard - controlId=" + textControlEl.getAttribute('fdUniqueId') + " text='" + text.replace(/\n/g, '\\n') + "'");
      
    return {
      success: true,
      text: text
    }
  }

  fdWebExtension.fdGetTextLengthStandard = function (textControlEl) {
    fdWebExtension.fdLog('fdGetTextLengthStandard - controlId=' + textControlEl.getAttribute('fdUniqueId'));

    var text = fdWebExtension.fdGetTextStandard(textControlEl).text;
    var textLength = text ? text.length : 0;

    fdWebExtension.fdLog('fdGetTextLengthStandard - controlId=' + textControlEl.getAttribute('fdUniqueId') + ' textLength=' + textLength);

    return {
      success: true,
      textLength: textLength
    }
  }

  fdWebExtension.fdGetSelectionStandard = function (textControlEl) {
    fdWebExtension.fdLog('fdGetSelectionStandard - controlId=' + textControlEl.getAttribute('fdUniqueId'));

    var selStart = 0;
    var selEnd = 0;

    if (fdWebExtension.fdIsTextInputOrTextArea(textControlEl)) {
      selStart = textControlEl.selectionStart;
      selEnd = textControlEl.selectionEnd;
    }
    else {
      var info = {};
      fdWebExtension.fdGetContentEditableElementInfo(textControlEl, info, 0);
      selStart = info.selStart;
      selEnd = info.selEnd;

      if (fdWebExtension.fdExtensionConfig.logContentEditableInfo)
        fdWebExtension.fdLog(info.logMsg);
    }

    fdWebExtension.fdLog('fdGetSelectionStandard - controlId=' + textControlEl.getAttribute('fdUniqueId') + ' selStart=' + selStart + ' selEnd=' + selEnd);

    return {
      success: true,
      start: selStart,
      end: selEnd,
      length: selEnd - selStart
    }
  }

  fdWebExtension.fdSetSelectionStandard = function (textControlEl, selStart, selEnd) {
    fdWebExtension.fdLog('fdSetSelectionStandard - controlId=' + textControlEl.getAttribute('fdUniqueId') + ' selStart=' + selStart + ' selEnd=' + selEnd);

    if (fdWebExtension.fdIsTextInputOrTextArea(textControlEl)) {
      if (selEnd < 0) {
        fdWebExtension.fdLog('fdSetSelectionStandard - select all text');
        selEnd = textControlEl.value.length;
      }

      textControlEl.setSelectionRange(selStart, selEnd, 'forward');
    }
    else {
      var info = {};
      fdWebExtension.fdGetContentEditableElementInfo(textControlEl, info, 0);

      if (selEnd < 0 && info.nodeList.length > 0) {
        fdWebExtension.fdLog('fdSetSelectionStandard - select all text');
        selEnd = info.nodeList[info.nodeList.length - 1].end;
      }

      var startNode = null;
      var endNode = null;
      for (var i = 0; i < info.nodeList.length; i++) {
        var nodeStart = info.nodeList[i].start;
        var nodeEnd = info.nodeList[i].end;
        var isLastNode = i == info.nodeList.length - 1;
        var isTextNode = info.nodeList[i].node.nodeName == '#text';

        if (selStart >= nodeStart && selStart <= nodeEnd) {
          if (selStart == nodeEnd && !isLastNode && !isTextNode) {
            // set selection to start of next node instead of end of this node
            continue;
          }
          
          startNode = info.nodeList[i];
        }
        if (selEnd >= info.nodeList[i].start && selEnd <= info.nodeList[i].end) {
          if (selEnd == nodeEnd && !isLastNode && !isTextNode) {
            // set selection to start of next node instead of end of this node
            continue;
          }

          endNode = info.nodeList[i];
        }

        if (startNode && endNode) {
          break;
        }
      }

      if (startNode && endNode) {
        var mainWindow = fdWebExtension.fdGetMainWindow();
        var document = mainWindow.document;
        var range = document.createRange();
        var startOffset = startNode.node.nodeType === Node.TEXT_NODE ? selStart - startNode.start : 0;
        var endOffset = startNode.node.nodeType === Node.TEXT_NODE ? selEnd - endNode.start : 0;
        range.setStart(startNode.node, startOffset);
        range.setEnd(endNode.node, endOffset);
        var sel = document.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }

    return { success: true };
  }

  fdWebExtension.fdInsertTextStandard = function (textControlEl, text) {
    fdWebExtension.fdLog("fdInsertTextStandard - controlId=" + textControlEl.getAttribute('fdUniqueId') + " text='" + text.replace(/\n/g, '\\n') + "'");

    var mainWindow = fdWebExtension.fdGetMainWindow();
    var document = mainWindow.document;

    var oldScrollHeight = textControlEl.scrollHeight;
    var oldScrollTop = textControlEl.scrollTop;

    if (fdWebExtension.fdIsContentEditableEl(textControlEl) || fdWebExtension.fdIsChrome) {
      try {
        document.execCommand('insertText', false, text);
      } catch (e) { }
    }
    else {
      var selStart = textControlEl.selectionStart;
      var selEnd = textControlEl.selectionEnd;
      textControlEl.setRangeText(text, selStart, selEnd, "end");        
    }

    try
    {
      // simulate fake key down event to trigger application event handlers
      // works in Athena where it's necessary for text controls to grow
      // probably needed in more applications, so let's always simulate it
      var eventObj = document.createEventObject ? document.createEventObject() : document.createEvent("Events");
      if (eventObj.initEvent) {
        eventObj.initEvent(fdWebExtension.fdExtensionConfig.keypressEventDirection, true, true);
      }
      textControlEl.dispatchEvent ? textControlEl.dispatchEvent(eventObj) : textControlEl.fireEvent("on" + fdWebExtension.fdExtensionConfig.keypressEventDirection, eventObj);
    }
    catch (e) { }

    fdWebExtension.fdScrollIntoView(textControlEl, oldScrollHeight, oldScrollTop);

    // for using FD's correction window with Athena, see comments in FD-13659
    if (window.AH) {
      fdWebExtension.fdCache["correctionWindowElementText"] = textControlEl.textContent;
    }

    return { success: true };
  }

  fdWebExtension.fdScrollIntoView = function (textControlEl, oldScrollHeight, oldScrollTop) {
    fdWebExtension.fdLog("fdScrollIntoView");
    var newScrollHeight = textControlEl.scrollHeight;
    var newScrollTop = textControlEl.scrollTop;

    if (newScrollHeight > oldScrollHeight && newScrollTop == oldScrollTop) {
      // if scrollable height increased due to insertion of text, then it must have been put on a new line
      // if scroll top hasn't changed, then new line wasn't scrolled into view so do it now
      textControlEl.scrollTop = textControlEl.scrollTop + (newScrollHeight - oldScrollHeight);
    }
  }

  fdWebExtension.fdDeleteSelectionStandard = function (textControlEl) {
    fdWebExtension.fdLog("fdDeleteSelectionStandard - controlId=" + textControlEl.getAttribute('fdUniqueId'));
    var mainWindow = fdWebExtension.fdGetMainWindow();

    if (fdWebExtension.fdIsContentEditableEl(textControlEl) || fdWebExtension.fdIsChrome) {
      mainWindow.document.execCommand('delete', false, null);
    }
    else {
        var selStart = textControlEl.selectionStart;
        var selEnd = textControlEl.selectionEnd;
        textControlEl.setRangeText('', selStart, selEnd, "end");
    }
    return { success: true };
  }

  fdWebExtension.fdBoldSelectionStandard = function (textControlEl) {
    fdWebExtension.fdLog("fdBoldSelectionStandard - controlId=" + textControlEl.getAttribute('fdUniqueId'));

    var mainWindow = fdWebExtension.fdGetMainWindow();
    if (mainWindow.document.execCommand('bold', false, null)) {
      return {
        success: true,
        supported: true,
        sendKeysFromFD: false
      };
    }

    fdWebExtension.fdLog("fdBoldSelectionStandard - cannot bold text using API");

    var isTextInputOrTextArea = fdWebExtension.fdIsTextInputOrTextArea(textControlEl);
    return {
      success: false,
      errorMessage: 'cannot bold text using API',
      supported: !isTextInputOrTextArea,
      sendKeysFromFD: !isTextInputOrTextArea
    };
  }

  fdWebExtension.fdItalicizeSelectionStandard = function (textControlEl) {
    fdWebExtension.fdLog("fdItalicizeSelectionStandard - controlId=" + textControlEl.getAttribute('fdUniqueId'));

    var mainWindow = fdWebExtension.fdGetMainWindow();
    if (mainWindow.document.execCommand('italicize', false, null)) {
      return {
        success: true,
        supported: true,
        sendKeysFromFD: false
      };
    }

    fdWebExtension.fdLog("fdItalicizeSelectionStandard - cannot italicize text using API");
    var isTextInputOrTextArea = fdWebExtension.fdIsTextInputOrTextArea(textControlEl);
    return {
      success: false,
      errorMessage: 'cannot italicize text using API',
      supported: !isTextInputOrTextArea,
      sendKeysFromFD: !isTextInputOrTextArea
    };
  }

  fdWebExtension.fdUnderlineSelectionStandard = function (textControlEl) {
    fdWebExtension.fdLog("fdUnderlineSelectionStandard - controlId=" + textControlEl.getAttribute('fdUniqueId'));

    var mainWindow = fdWebExtension.fdGetMainWindow();
    if (mainWindow.document.execCommand('underline', false, null)) {
      return {
        success: true,
        supported: true,
        sendKeysFromFD: false
      };
    }

    fdWebExtension.fdLog("fdUnderlineSelectionStandard - cannot underline text using API");
    var isTextInputOrTextArea = fdWebExtension.fdIsTextInputOrTextArea(textControlEl);
    return {
      success: false,
      errorMessage: 'cannot underline text using API',
      supported: !isTextInputOrTextArea,
      sendKeysFromFD: !isTextInputOrTextArea
    };
  }

  fdWebExtension.fdCutSelectionStandard = function (textControlEl) {
    fdWebExtension.fdLog("fdCutSelectionStandard - controlId=" + textControlEl.getAttribute('fdUniqueId'));

    var mainWindow = fdWebExtension.fdGetMainWindow();
    if (mainWindow.document.execCommand('cut', false, null)) {
      return {
        success: true,
        supported: true,
        sendKeysFromFD: false
      };
    }

    fdWebExtension.fdLog("fdCutSelectionStandard - cannot cut text using API");
    return {
      success: false,
      errorMessage: 'cannot cut text using API',
      supported: true,
      sendKeysFromFD: true
    };
  }

  fdWebExtension.fdCopySelectionStandard = function (textControlEl) {
    fdWebExtension.fdLog("fdCopySelectionStandard - controlId=" + textControlEl.getAttribute('fdUniqueId'));

    var mainWindow = fdWebExtension.fdGetMainWindow();
    if (mainWindow.document.execCommand('copy', false, null)) {
      return {
        success: true,
        supported: true,
        sendKeysFromFD: false
      };
    }

    fdWebExtension.fdLog("fdCopySelectionStandard - cannot copy text using API");
    return {
      success: false,
      errorMessage: 'cannot copy text using API',
      supported: true,
      sendKeysFromFD: true
    };
  }

  fdWebExtension.fdPasteSelectionStandard = function (textControlEl) {
    fdWebExtension.fdLog("fdPasteSelectionStandard - controlId=" + textControlEl.getAttribute('fdUniqueId'));

    var mainWindow = fdWebExtension.fdGetMainWindow();
    if (mainWindow.document.execCommand('paste', false, null)) {
      return {
        success: true,
        supported: true,
        sendKeysFromFD: false
      };
    }

    fdWebExtension.fdLog("fdPasteSelectionStandard - cannot paste text using API");
    return {
      success: false,
      errorMessage: 'cannot paste text using API',
      supported: true,
      sendKeysFromFD: true
    };
  }

  fdWebExtension.fdScrollUpStandard = function (textControlEl) {
    fdWebExtension.fdLog("fdScrollUpStandard - controlId=" + textControlEl.getAttribute('fdUniqueId'));
    textControlEl.scrollTop = textControlEl.scrollTop - (textControlEl.clientHeight / 2);
    return {
      success: true,
      supported: true,
      sendKeysFromFD: false
    };
  }

  fdWebExtension.fdScrollDownStandard = function (textControlEl) {
    fdWebExtension.fdLog("fdScrollDownStandard - controlId=" + textControlEl.getAttribute('fdUniqueId'));
    textControlEl.scrollTop = textControlEl.scrollTop + (textControlEl.clientHeight / 2);
    return {
      success: true,
      supported: true,
      sendKeysFromFD: false
    };
  }

  fdWebExtension.fdScrollCaretStandard = function (textControlEl) {
    fdWebExtension.fdLog("fdScrollCaretStandard - controlId=" + textControlEl.getAttribute('fdUniqueId'));
    fdWebExtension.fdLog("fdScrollCaretStandard - cannot scroll to caret using API");

    return {
      success: false,
      errorMessage: 'cannot scroll to caret using API',
      supported: false,
      sendKeysFromFD: false
    };
  }

  fdWebExtension.fdUndoStandard = function (textControlEl) {
    fdWebExtension.fdLog("fdUndoStandard - controlId=" + textControlEl.getAttribute('fdUniqueId'));
    fdWebExtension.fdLog("fdUndoStandard - cannot undo using API");

    return {
      success: false,
      errorMessage: 'cannot undo using API',
      supported: true,
      sendKeysFromFD: true
    };
  }

  // override the default text insertion method. Use this in cases where we know that standard
  // insertion methods cause problems. For instance, in Draftjs, used in Flatiron OncoEMR, the 
  // standard HTML APIs where not working for text insertion. So, force it to use clipboard
  // valid return values are 
  //          * empty string
  //          * "Clipboard"
  //          * "Extension"
  //          * "AutoIt"
  fdWebExtension.fdGetTextInsertionMethodOverride = function(){
    if(!window.OncoEMR) // for now, just do this for Onco...
      return "";

    var mainWindow = fdWebExtension.fdGetMainWindow();
    var ctrl = mainWindow.document.activeElement;

    // on Onco, old style editors don't work with clipboard, so force back to extension
    if(ctrl !== null){
      let fdElem = ctrl.querySelector("[fdRadEditorFound='true']");
      if(fdElem !== null){
        return "Extension";
      }
      let fdattr = ctrl.getAttribute("fdRadEditorFound");
      if(fdattr !== null && fdattr == "true"){
        return "Extension";
      }
    }

    if(window.OncoEMR){
      return "Clipboard";
    }
    return "";
  }
}

// Meditech w/ M*Modal API
// Create FD text control functions that wraps Meditech's MSpeech API.
if (window.MSpeechAPI) {
  fdWebExtension.fdLog('fdWebExtension - found Meditech');

  if (!fdWebExtension.fdInitializeCustomApi) {
    fdWebExtension.fdCustomApiInitialized = false;

    fdWebExtension.fdHandleMSpeechApiCustomEvent = function (evtObj) {
      fdWebExtension.fdLog('fdHandleMSpeechApiCustomEvent - type=' + evtObj.detail.type);

      if (evtObj.detail.type == 'focusChanged') {
        fdWebExtension.fdHandleFocusChange();
      }
    }

    fdWebExtension.fdInitializeCustomApi = function () {
      if (fdWebExtension.fdCustomApiInitialized) {
        return { success: true };
      }

      fdWebExtension.fdLog('fdInitializeCustomApi - initializing MSpeechAPI');

      var initResult = window.MSpeechAPI('initialize()');
      fdWebExtension.fdCustomApiInitialized = initResult[0];
      if (fdWebExtension.fdCustomApiInitialized) {
        fdWebExtension.fdLog("fdInitializeCustomApi - MSpeechAPI initialized");

        return { success: true };
      }
      else {
        fdWebExtension.fdLog("fdInitializeCustomApi - MSpeechAPI could not be initialized (reason='" + initResult[1] + "')");
        return {
          success: fdWebExtension.fdCustomApiInitialized,
          errorMessage: initResult[1]
        };
      }
    }
  }

  if (!fdWebExtension.fdGetFocusedControlIdCustom) {
    fdWebExtension.fdGetFocusedControlIdCustom = function () {
      fdWebExtension.fdLog('fdGetFocusedControlIdCustom - getting focused control');

      if (!fdWebExtension.fdInitializeCustomApi().success) {
        fdWebExtension.fdLog('fdGetFocusedControlIdCustom - MSpeechAPI is not initialized');
        return {
          success: false,
          errorMessage: 'MSpeechAPI is not initialized',
          focusedControlId: null
        };
      }

      // Ignore MSpeechAPI in OncoEMR (FD-14514)
      if (window.MSpeechAPI && !window.OncoEMR) {
        var focusedControlId = window.MSpeechAPI('controls.getCurrentControl()')[0];
        fdWebExtension.fdLog("fdGetFocusedControlIdCustom - controlId=" + focusedControlId);
        return {
          success: true,
          focusedControlId: focusedControlId
        };
      }

      return {
        success: false,
        focusedControlId: null
      };
    }
  }

  if (!fdWebExtension.fdFindControlCustom && !window.OncoEMR) {
    fdWebExtension.fdFindControlCustom = function (controlId) {
      fdWebExtension.fdLog('fdFindControlCustom - controlId=' + controlId);

      var controlIds = window.MSpeechAPI('controls.enumerate()');
      for (var i = 0; i < controlIds.length; i++) {
        if (controlIds[i].localeCompare(controlId) == 0) {
          fdWebExtension.fdLog('fdFindControlCustom - found controlId=' + controlId);
          return true;
        }
      }

      fdWebExtension.fdLog('fdFindControlCustom - did not find controlId=' + controlId);

      return false;
    }
  }

  if (!fdWebExtension.fdGetTextCustom) {
    fdWebExtension.fdGetTextCustom = function (controlId) {

      // Ignore MSpeechAPI in OncoEMR (FD-14514)
      if (window.MSpeechAPI && window.OncoEMR) {
        return {
          success: true,
          text: null
        };
      }

      fdWebExtension.fdLog('fdGetTextCustom - controlId=' + controlId);
      var text = window.MSpeechAPI('control.text.read(id)', controlId)[0];
      fdWebExtension.fdLog("fdGetTextCustom - text='" + text.replace(/\n/g, '\\n') + "'");
      return {
        success: true,
        text: text
      };
    }
  }

  if (!fdWebExtension.fdGetTextLengthCustom) {
    fdWebExtension.fdGetTextLengthCustom = function (controlId) {
      fdWebExtension.fdLog('fdGetTextLengthCustom - controlId=' + controlId);
      var text = fdWebExtension.fdGetTextCustom(controlId).text;
      var textLength = text ? text.length : 0;
      fdWebExtension.fdLog('fdGetTextLengthCustom - textLength=' + textLength);
      return {
        success: true,
        textLength: textLength
      };
    }
  }

  if (!fdWebExtension.fdGetSelectionCustom) {
    fdWebExtension.fdGetSelectionCustom = function (controlId) {
      fdWebExtension.fdLog('fdGetSelectionCustom - controlId = ' + controlId);
      var sel = window.MSpeechAPI('control.selection.getRange(id)', controlId);
      fdWebExtension.fdLog('fdGetSelectionCustom - selStart=' + sel[0] + ' selEnd=' + (sel[0] + sel[1]) + ' selLength=' + sel[1]);
      return {
        success: true,
        start: sel[0],
        end: sel[0] + sel[1],
        length: sel[1]
      }
    }
  }

  if (!fdWebExtension.fdSetSelectionCustom) {
    fdWebExtension.fdSetSelectionCustom = function (controlId, selStart, selEnd) {
      fdWebExtension.fdLog('fdSetSelectionCustom - controlId=' + controlId + ' selStart=' + selStart + ' selEnd' + selEnd);
      if (selEnd >= 0) {
        window.MSpeechAPI('control.selection.setRange(id,point#,extent#)', controlId, selStart, selEnd - selStart);
      }
      else {
        fdWebExtension.fdLog('fdSetSelectionCustom - select all text');
        var text = fdWebExtension.fdGetText(controlId).text;
        if (text) {
          window.MSpeechAPI('control.selection.setRange(id,point#,extent#)', controlId, 0, text.length);
        }
      }

      return { success: true };
    }
  }

  if (!fdWebExtension.fdInsertTextCustom) {
    fdWebExtension.fdInsertTextCustom = function (controlId, text) {
      fdWebExtension.fdLog("fdInsertTextCustom - controlId=" + controlId + " text='" + text.replace(/\n/g, '\\n') + "'");

      var mainWindow = fdWebExtension.fdGetMainWindow();
      var activeElement = mainWindow.document.activeElement;
      var oldScrollHeight = 0;
      var oldScrollTop = 0;

      if (activeElement) {
        oldScrollHeight = activeElement.scrollHeight;
        oldScrollTop = activeElement.scrollTop;
      }

      var sel = fdWebExtension.fdGetSelectionCustom(controlId);
      try {
        window.MSpeechAPI('control.text.write(id,point#,extent#,text)', controlId, sel.start, sel.length, text);
      }
      catch (e) {
        // Meditech sample page is throwing an exception, but it seems to be after text has already been inserted
        // so just catch the exception, log it, and continue on
        console.error(e);
      }
      fdWebExtension.fdSetSelectionCustom(controlId, sel.start + text.length, sel.start + text.length);

      // simulate fake key down event for search fields
      // this isn't needed outside of search fields, but FD cannot tell if it's in a regular field or a search field
      if (activeElement) {
        try {
          var document = mainWindow.document;
          var eventObj = document.createEventObject ? document.createEventObject() : document.createEvent("Events");
          if (eventObj.initEvent) {
            eventObj.initEvent(fdWebExtension.fdExtensionConfig.keypressEventDirection, true, true);
          }
          activeElement.dispatchEvent ? activeElement.dispatchEvent(eventObj) : activeElement.fireEvent("on" + fdWebExtension.fdExtensionConfig.keypressEventDirection, eventObj);

          fdWebExtension.fdScrollIntoView(activeElement, oldScrollHeight, oldScrollTop);
        }
        catch (e) { }
      }
      
      return { success: true };
    }
  }

  if (!fdWebExtension.fdDeleteSelectionCustom) {
    fdWebExtension.fdDeleteSelectionCustom = function (controlId) {
      fdWebExtension.fdLog("fdDeleteSelectionCustom - controlId=" + controlId);
      return fdWebExtension.fdInsertTextCustom(controlId, '');
    }
  }

  if (!fdWebExtension.fdBoldSelectionCustom) {
    fdWebExtension.fdBoldSelectionCustom = function (controlId) {
      fdWebExtension.fdLog("fdBoldSelectionCustom - controlId=" + controlId);
      return {
        success: false,
        errorMessage: 'cannot bold text using MSpeechAPI',
        supported: true,
        sendKeysFromFD: true
      };
    }
  }

  if (!fdWebExtension.fdItalicizeSelectionCustom) {
    fdWebExtension.fdItalicizeSelectionCustom = function (controlId) {
      fdWebExtension.fdLog("fdItalicizeSelectionCustom - controlId=" + controlId);
      return {
        success: false,
        errorMessage: 'cannot italicize text using MSpeechAPI',
        supported: true,
        sendKeysFromFD: true
      };
    }
  }

  if (!fdWebExtension.fdUnderlineSelectionCustom) {
    fdWebExtension.fdUnderlineSelectionCustom = function (controlId) {
      fdWebExtension.fdLog("fdUnderlineSelectionCustom - controlId=" + controlId);
      return {
        success: false,
        errorMessage: 'cannot underline text using MSpeechAPI',
        supported: true,
        sendKeysFromFD: true
      };
    }
  }

  if (!fdWebExtension.fdCutSelectionCustom) {
    fdWebExtension.fdCutSelectionCustom = function (controlId) {
      fdWebExtension.fdLog("fdCutSelectionCustom - controlId=" + controlId);
      return {
        success: false,
        errorMessage: 'cannot cut text using MSpeechAPI',
        supported: true,
        sendKeysFromFD: true
      };
    }
  }

  if (!fdWebExtension.fdCopySelectionCustom) {
    fdWebExtension.fdCopySelectionCustom = function (controlId) {
      fdWebExtension.fdLog("fdCopySelectionCustom - controlId=" + controlId);
      return {
        success: false,
        errorMessage: 'cannot copy text using MSpeechAPI',
        supported: true,
        sendKeysFromFD: true
      };
    }
  }

  if (!fdWebExtension.fdPasteSelectionCustom) {
    fdWebExtension.fdPasteSelectionCustom = function (controlId) {
      fdWebExtension.fdLog("fdPasteSelectionCustom - controlId=" + controlId);
      return {
        success: false,
        errorMessage: 'cannot paste text using MSpeechAPI',
        supported: true,
        sendKeysFromFD: true
      };
    }
  }

  if (!fdWebExtension.fdScrollUpCustom) {
    fdWebExtension.fdScrollUpCustom = function (controlId) {
      fdWebExtension.fdLog("fdScrollUpCustom - controlId=" + controlId);
      return {
        success: false,
        errorMessage: 'cannot scroll up using MSpeechAPI',
        supported: true,
        sendKeysFromFD: true
      };
    }
  }

  if (!fdWebExtension.fdScrollDownCustom) {
    fdWebExtension.fdScrollDownCustom = function (controlId) {
      fdWebExtension.fdLog("fdScrollDownCustom - controlId=" + controlId);
      return {
        success: false,
        errorMessage: 'cannot scroll down using MSpeechAPI',
        supported: true,
        sendKeysFromFD: true
      };
    }
  }

  if (!fdWebExtension.fdScrollCaretCustom) {
    fdWebExtension.fdScrollCaretCustom = function (controlId) {
      fdWebExtension.fdLog("fdScrollCaretCustom - controlId=" + controlId);
      var sel = fdWebExtension.fdGetSelection(controlId);
      fdWebExtension.fdSetSelection(controlId, sel.start, sel.start + sel.length);
      return {
        success: true,
        supported: true,
        sendKeysFromFD: false
      };
    }
  }

  if (!fdWebExtension.fdUndoCustom) {
    fdWebExtension.fdUndoCustom = function (controlId) {
      fdWebExtension.fdLog("fdUndoCustom - controlId=" + controlId);
      return {
        success: false,
        errorMessage: 'cannot undo using MSpeechAPI',
        supported: !fdWebExtension.fdIsSamplePage(),  // undo doesn't work on sample page
        sendKeysFromFD: true
      };
    }
  }

  if (!fdWebExtension.fdIsSamplePage) {
    fdWebExtension.fdIsSamplePage = function () {
      return window.document.title.indexOf('MSpeech Sample') >= 0;
    }
  }

  if(!fdWebExtension.fdMedCaretObservers){
    fdWebExtension.fdMedCaretObservers = [];
  }
}

if (!fdWebExtension.fdInitializeApi) {

  fdWebExtension.fdAddLoadFunction = function(item, cb){
    var oldfunc = item.onload;
    if(typeof item.onload !== 'function'){
      item.onload = cb;
    }else{
      item.onload = function(){
        if(oldfunc){
          oldfunc();
        }
        cb();
        fdWebExtension.fdLog("fdAddLoadFunction - load callback fired.");
      }
    }
  }

  // this is mostly for onco. It uses something called a RadEditor, from telerek,
  // in some views. this editor seems to be going away, in favor of Draftjs.
  // lets just attempt to look for the radeditor, and attach our focus listeners
  // to the body of the editor.
  // the editor looks something like this:
  // <iframe>
  //   <head>
  //    <style/>
  //    <link id="RADEDITORSTYLESHEET#"/>...
  //   <body></body>
  // <iframe>
  fdWebExtension.fdAttachFocusListenerRadEditor = function(doc){
    if(doc == null){
      return;
    }

    // look for the link with radeditorstylesheet0, we can assume that's a radeditor in onco
    let radStyle = doc.querySelector("#RADEDITORSTYLESHEET0");
    if(radStyle != null){
      let body = doc.querySelector("body");
      if(body!=null){
        body.addEventListener('blur', fdWebExtension.fdBlurListener, false);
        body.addEventListener('focus', fdWebExtension.fdFocusListener, false);
        body.setAttribute("fdRadEditorFound", "true");
      }
    }

    if(doc.head == null){
      return;
    }

    // annoyingly, the style sheet link can be added after the document loads
    // so look for changes in this frame, and disconnect the observer if we find
    // a change that looks like an updated rad editor.
    let observer = new MutationObserver(function(mutations, caller){
      [].forEach.call(mutations, function(mutation){
        if(mutation.target != null){
          let link = mutation.target.querySelector("link");
          if(link != null && link.id != null){
            if(link.id == "RADEDITORSTYLESHEET0"){
              ownerdoc = link.ownerDocument;
              if(ownerdoc != null){
                body = ownerdoc.querySelector("body");
                if(body != null){
                  body.addEventListener('blur', fdWebExtension.fdBlurListener, false);
                  body.addEventListener('focus', fdWebExtension.fdFocusListener, false);
                  body.setAttribute("fdRadEditorFound", "true");
                }
              }// we found it, no need to keep watching
              caller.disconnect();
            }  
          }
        }
      });
    });
    observer.observe(doc.head, {childList:true, attributes:false, characterData:false, subtree:false});
  }

  fdWebExtension.fdAttachFocusListeners = function (doc) {
    window.addEventListener('focus', fdWebExtension.fdFocusListener, false);

    if (fdWebExtension.fdHandleMSpeechApiCustomEvent) {
      window.addEventListener('MSpeechAPI', fdWebExtension.fdHandleMSpeechApiCustomEvent, false);
    }

    if(doc == null){
      return;
    }
    try{
      // 'blur' is called when a field/item loses focus, 'focus' is called when
      // an item gains focus. So listen for both
      [].forEach.call(doc.querySelectorAll('input'), function(el) {
        if(el.type == 'text' || el.type == 'search'){
          el.addEventListener('blur', fdWebExtension.fdBlurListener, false);
          el.addEventListener('focus', fdWebExtension.fdFocusListener, false);
        }
      });
      [].forEach.call(doc.querySelectorAll('textarea'), function(el){
        el.addEventListener('blur', fdWebExtension.fdBlurListener, false);
        el.addEventListener('focus', fdWebExtension.fdFocusListener, false);
      });
      [].forEach.call(doc.querySelectorAll('div'), function(el){
        if (el.isContentEditable){
          el.addEventListener('blur', fdWebExtension.fdBlurListener, false);
          el.addEventListener('focus', fdWebExtension.fdFocusListener, false);
        }
      });

      // for iframes, listen for on load event. Drill down on both frames &
      // iframes, attaching listeners to their containing documents, after they are available
      [].forEach.call(doc.querySelectorAll('iframe'), function(el){
        fdWebExtension.fdAddLoadFunction(el, function(){
          fdWebExtension.fdAttachFocusListeners(el.contentDocument);
          if(window.OncoEMR){
            fdWebExtension.fdAttachFocusListenerRadEditor(el.contentDocument);
          }
        });
        fdWebExtension.fdAttachFocusListeners(el.contentDocument); // in case the contents were already loaded...
        if(window.OncoEMR){
          fdWebExtension.fdAttachFocusListenerRadEditor(el.contentDocument);
        }
      });
      [].forEach.call(doc.querySelectorAll('frame'), function(el){
        fdWebExtension.fdAttachFocusListeners(el.contentDocument);
      });

      if(window.MSpeechAPI){
        // meditech is weird. they may be blocking the focus/mouse events in the MEditor
        // so search for the meditor-caret. If it changes, that's and indication that
        // the focus has shifted to/from a MEditor control
        [].forEach.call(doc.querySelectorAll('.MEditor-caret'), function(meditorCaret){
          if(meditorCaret != null){
            let caretObserver = new MutationObserver(function(mutations){
              fdWebExtension.fdPushFocusChange();
            });
            caretObserver.observe(meditorCaret, {attributes:true});
            fdWebExtension.fdMedCaretObservers.push(caretObserver);
          }
        });
      }
    }catch(error){
      console.error(error);
      fdWebExtension.fdLog(error);
    }
  }

  fdWebExtension.fdObserveMutations = function(doc){
    // have we already started observing? are we ready to observe, i.e. have a valid doc body?
    if(fdWebExtension.fdMutationObserver || (doc != null && doc.body == null)){
      return;
    }

    fdWebExtension.fdMutationObserver = new MutationObserver(function(mutations){
      var attached = false;
      mutations.forEach(function(mutation){
        if(mutation.addedNodes && mutation.addedNodes.length>0){
          var hasClass = [].forEach.call(mutation.addedNodes,function(el){
            if(el.nodeType != Node.TEXT_NODE){
              fdWebExtension.fdAttachFocusListeners(el);
              attached = true;
            }
          });
        }
      });
      if(attached){
        // we have an element added, push a focus change just in case...
        fdWebExtension.fdPushFocusChange();
      }
    });
    fdWebExtension.fdMutationObserver.observe(doc.body, {attributes:false, childList:true, characterData:false, subtree:true});
  }

  fdWebExtension.fdInitializeApi = function () {
    var customResult = fdWebExtension.fdInitializeCustomApi ? fdWebExtension.fdInitializeCustomApi() : null;
    if (customResult && !customResult.success) {
      return customResult;
    }
    fdWebExtension.fdPushFocusChange(); // in case there was a focus change that caused the reconnect...

    return { success: true };
  }

  fdWebExtension.fdGetFocusedControlId = function () {
    var customResult = fdWebExtension.fdGetFocusedControlIdCustom ? fdWebExtension.fdGetFocusedControlIdCustom() : null;
    if (customResult && (customResult.focusedControlId || customResult.errorMessage)) {
      return customResult;
    }

    return fdWebExtension.fdGetFocusedControlIdStandard();
  }

  fdWebExtension.fdGetTabId = function () {
    if (!fdWebExtension.fdTabId) {
      fdWebExtension.fdTabId = fdWebExtension.fdGuid();
      fdWebExtension.fdLog('fdGetTabId - generated tabId=' + fdWebExtension.fdTabId);
    }

    return {
      success: true,
      tabId: fdWebExtension.fdTabId
    }
  }

  fdWebExtension.fdGetText = function (controlId) {

    if (!controlId) {
      return {
        success: false,
        errorMessage: 'controlId must be specified',
        text: null
      }
    }

    if (fdWebExtension.fdFindControlCustom && fdWebExtension.fdFindControlCustom(controlId)) {
      return fdWebExtension.fdGetTextCustom(controlId);
    }

    var textControlEl = fdWebExtension.fdFindControlStandard(controlId);
    if (textControlEl) {
      return fdWebExtension.fdGetTextStandard(textControlEl);
    }

    // for using FD's correction window with Athena, see comments in FD-13659
    if (window.AH) {
      var baseEl = fdWebExtension.fdCache["greatGrandParentElementOfCorrectionWindowElement"];
      var correctionWinElText = fdWebExtension.fdCache["correctionWindowElementText"];
      textControlEl = fdWebExtension.fdGetContenteditableDivChildElWithMatchingText(baseEl, correctionWinElText);
      if (textControlEl) {
        return fdWebExtension.fdGetTextStandard(textControlEl);
      }
    }

    return {
      success: false,
      errorMessage: 'text control not found',
      text: null
    }
  }

  fdWebExtension.fdGetTextLength = function (controlId) {
    fdWebExtension.fdLog('fdGetTextLength - controlId=' + controlId);

    if (!controlId) {
      return {
        success: false,
        errorMessage: 'controlId must be specified',
        textLength: 0
      }
    }

    if (fdWebExtension.fdFindControlCustom && fdWebExtension.fdFindControlCustom(controlId)) {
      return fdWebExtension.fdGetTextLengthCustom(controlId);
    }

    var textControlEl = fdWebExtension.fdFindControlStandard(controlId);
    if (textControlEl) {
      return fdWebExtension.fdGetTextLengthStandard(textControlEl);
    }

    return {
      success: false,
      errorMessage: 'text control not found',
      textLength: 0
    }
  }

  fdWebExtension.fdGetSelection = function (controlId) {
    fdWebExtension.fdLog('fdGetSelection - controlId=' + controlId);

    if (!controlId) {
      return {
        success: false,
        errorMessage: 'controlId must be specified',
        start: 0, end: 0, length: 0
      }
    }

    if (fdWebExtension.fdFindControlCustom && fdWebExtension.fdFindControlCustom(controlId)) {
      return fdWebExtension.fdGetSelectionCustom(controlId);
    }

    var textControlEl = fdWebExtension.fdFindControlStandard(controlId);
    if (textControlEl) {
      return fdWebExtension.fdGetSelectionStandard(textControlEl);
    }

    // for using FD's correction window with Athena, see comments in FD-13659
    if (window.AH) {
      var baseEl = fdWebExtension.fdCache["greatGrandParentElementOfCorrectionWindowElement"];
      var correctionWindowElText = fdWebExtension.fdCache["correctionWindowElementText"];
      textControlEl = fdWebExtension.fdGetContenteditableDivChildElWithMatchingText(baseEl, correctionWindowElText);
      if (textControlEl) {
        return fdWebExtension.fdGetSelectionStandard(textControlEl);
      }
    }

    return {
      success: false,
      errorMessage: 'text control not found',
      start: 0, end: 0, length: 0
    }
  }

  fdWebExtension.fdSetSelection = function (controlId, selStart, selEnd) {
    fdWebExtension.fdLog('fdSetSelectionCustom - controlId=' + controlId + ' selStart=' + selStart + ' selEnd' + selEnd);

    if (!controlId) {
      return {
        success: false,
        errorMessage: 'controlId must be specified'
      }
    }

    if (fdWebExtension.fdFindControlCustom && fdWebExtension.fdFindControlCustom(controlId)) {
      return fdWebExtension.fdSetSelectionCustom(controlId, selStart, selEnd);
    }

    var textControlEl;

    // for using FD's correction window with Athena, see comments in FD-13659
    if (window.AH) {
      var baseEl = fdWebExtension.fdCache["greatGrandParentElementOfCorrectionWindowElement"];
      var correctionWinElText = fdWebExtension.fdCache["correctionWindowElementText"];

      textControlEl = fdWebExtension.fdGetContenteditableDivChildElWithMatchingText(baseEl, correctionWinElText);
      if (textControlEl) {
  
        // for some fields, need to click on span element so that the corresponding contenteditable div is focused
        var spanElForCorrectionWin = fdWebExtension.fdGetSpanChildElWithMatchingText(baseEl, correctionWinElText);
        if (spanElForCorrectionWin != null) {
          spanElForCorrectionWin.click();
        }

        return fdWebExtension.fdSetSelectionStandard(textControlEl, selStart, selEnd);
      }
    }

    textControlEl = fdWebExtension.fdFindControlStandard(controlId);
    if (textControlEl) {
      return fdWebExtension.fdSetSelectionStandard(textControlEl, selStart, selEnd);
    }

    return {
      success: false,
      errorMessage: 'text control not found'
    }
  }

  // for using FD's correction window with Athena, see comments in FD-13659
  fdWebExtension.fdGetContenteditableDivChildElWithMatchingText = function(baseElement, text) {
    for (var i = 0; i < baseElement.children.length; i++) {
      var childEl = baseElement.children[i];
      if (childEl.getAttribute('contenteditable') && childEl.textContent === text) {
        return childEl;
      }
      var match = fdWebExtension.fdGetContenteditableDivChildElWithMatchingText(childEl, text);
      if (match != null) {
        return match;
      }
    }

    return null;
  }

  // for using FD's correction window with Athena, see comments in FD-13659
  fdWebExtension.fdGetSpanChildElWithMatchingText = function (baseElement, text) {
    for (var i = 0; i < baseElement.children.length; i++) {
      var childEl = baseElement.children[i];
      if (childEl.tagName.toLowerCase() === "span" && childEl.textContent === text) {
        return childEl;
      }
      var match = fdWebExtension.fdGetSpanChildElWithMatchingText(childEl, text);
      if (match != null) {
        return match;
      }
    }

    return null;
  }

  fdWebExtension.fdInsertText = function (controlId, text) {
    fdWebExtension.fdLog("fdInsertText - controlId=" + controlId + " text='" + text.replace(/\n/g, '\\n') + "'");

    if (!controlId) {
      return {
        success: false,
        errorMessage: 'controlId must be specified'
      }
    }

    if (fdWebExtension.fdFindControlCustom && fdWebExtension.fdFindControlCustom(controlId)) {
      return fdWebExtension.fdInsertTextCustom(controlId, text);
    }

    var textControlEl = fdWebExtension.fdFindControlStandard(controlId);
    if (textControlEl) {
      return fdWebExtension.fdInsertTextStandard(textControlEl, text);
    }

    // for using FD's correction window with Athena, see comments in FD-13659
    if (window.AH) {
      var baseEl = fdWebExtension.fdCache["greatGrandParentElementOfCorrectionWindowElement"];
      var correctionWinElText = fdWebExtension.fdCache["correctionWindowElementText"];
      textControlEl = fdWebExtension.fdGetContenteditableDivChildElWithMatchingText(baseEl, correctionWinElText);
      if (textControlEl) {
        return fdWebExtension.fdInsertTextStandard(textControlEl, text);
      }
    }

    return {
      success: false,
      errorMessage: 'text control not found'
    }
  }

  fdWebExtension.fdDeleteSelection = function (controlId, text) {
    fdWebExtension.fdLog("fdDeleteSelection - controlId=" + controlId);

    if (!controlId) {
      return {
        success: false,
        errorMessage: 'controlId must be specified'
      }
    }

    if (fdWebExtension.fdFindControlCustom && fdWebExtension.fdFindControlCustom(controlId)) {
      return fdWebExtension.fdDeleteSelectionCustom(controlId);
    }

    var textControlEl = fdWebExtension.fdFindControlStandard(controlId);
    if (textControlEl) {
      return fdWebExtension.fdDeleteSelectionStandard(textControlEl);
    }

    return {
      success: false,
      errorMessage: 'text control not found'
    }
  }

  fdWebExtension.fdBoldSelection = function (controlId) {
    fdWebExtension.fdLog("fdBoldSelection - controlId=" + controlId);

    if (!controlId) {
      return {
        success: false,
        errorMessage: 'controlId must be specified'
      }
    }

    if (fdWebExtension.fdFindControlCustom && fdWebExtension.fdFindControlCustom(controlId)) {
      return fdWebExtension.fdBoldSelectionCustom(controlId);
    }

    var textControlEl = fdWebExtension.fdFindControlStandard(controlId);
    if (textControlEl) {
      return fdWebExtension.fdBoldSelectionStandard(textControlEl);
    }

    return {
      success: false,
      errorMessage: 'text control not found'
    }
  }

  fdWebExtension.fdItalicizeSelection = function (controlId) {
    fdWebExtension.fdLog("fdItalicizeSelection - controlId=" + controlId);

    if (!controlId) {
      return {
        success: false,
        errorMessage: 'controlId must be specified'
      }
    }

    if (fdWebExtension.fdFindControlCustom && fdWebExtension.fdFindControlCustom(controlId)) {
      return fdWebExtension.fdItalicizeSelectionCustom(controlId);
    }

    var textControlEl = fdWebExtension.fdFindControlStandard(controlId);
    if (textControlEl) {
      return fdWebExtension.fdItalicizeSelectionStandard(textControlEl);
    }

    return {
      success: false,
      errorMessage: 'text control not found'
    }
  }

  fdWebExtension.fdUnderlineSelection = function (controlId) {
    fdWebExtension.fdLog("fdUnderlineSelection - controlId=" + controlId);

    if (!controlId) {
      return {
        success: false,
        errorMessage: 'controlId must be specified'
      }
    }

    if (fdWebExtension.fdFindControlCustom && fdWebExtension.fdFindControlCustom(controlId)) {
      return fdWebExtension.fdUnderlineSelectionCustom(controlId);
    }

    var textControlEl = fdWebExtension.fdFindControlStandard(controlId);
    if (textControlEl) {
      return fdWebExtension.fdUnderlineSelectionStandard(textControlEl);
    }

    return {
      success: false,
      errorMessage: 'text control not found'
    }
  }

  fdWebExtension.fdCutSelection = function (controlId) {
    fdWebExtension.fdLog("fdCutSelection - controlId=" + controlId);

    if (!controlId) {
      return {
        success: false,
        errorMessage: 'controlId must be specified'
      }
    }

    if (fdWebExtension.fdFindControlCustom && fdWebExtension.fdFindControlCustom(controlId)) {
      return fdWebExtension.fdCutSelectionCustom(controlId);
    }

    var textControlEl = fdWebExtension.fdFindControlStandard(controlId);
    if (textControlEl) {
      return fdWebExtension.fdCutSelectionStandard(textControlEl);
    }

    return {
      success: false,
      errorMessage: 'text control not found'
    }
  }

  fdWebExtension.fdCopySelection = function (controlId) {
    fdWebExtension.fdLog("fdCopySelection - controlId=" + controlId);

    if (!controlId) {
      return {
        success: false,
        errorMessage: 'controlId must be specified'
      }
    }

    if (fdWebExtension.fdFindControlCustom && fdWebExtension.fdFindControlCustom(controlId)) {
      return fdWebExtension.fdCopySelectionCustom(controlId);
    }

    var textControlEl = fdWebExtension.fdFindControlStandard(controlId);
    if (textControlEl) {
      return fdWebExtension.fdCopySelectionStandard(textControlEl);
    }

    return {
      success: false,
      errorMessage: 'text control not found'
    }
  }

  fdWebExtension.fdPasteSelection = function (controlId) {
    fdWebExtension.fdLog("fdPasteSelection - controlId=" + controlId);

    if (!controlId) {
      return {
        success: false,
        errorMessage: 'controlId must be specified'
      }
    }

    if (fdWebExtension.fdFindControlCustom && fdWebExtension.fdFindControlCustom(controlId)) {
      return fdWebExtension.fdPasteSelectionCustom(controlId);
    }

    var textControlEl = fdWebExtension.fdFindControlStandard(controlId);
    if (textControlEl) {
      return fdWebExtension.fdPasteSelectionStandard(textControlEl);
    }

    return {
      success: false,
      errorMessage: 'text control not found'
    }
  }

  fdWebExtension.fdScrollUp = function (controlId) {
    fdWebExtension.fdLog("fdScrollUp - controlId=" + controlId);

    if (!controlId) {
      return {
        success: false,
        errorMessage: 'controlId must be specified'
      }
    }

    if (fdWebExtension.fdFindControlCustom && fdWebExtension.fdFindControlCustom(controlId)) {
      return fdWebExtension.fdScrollUpCustom(controlId);
    }

    var textControlEl = fdWebExtension.fdFindControlStandard(controlId);
    if (textControlEl) {
      return fdWebExtension.fdScrollUpStandard(textControlEl);
    }

    return {
      success: false,
      errorMessage: 'text control not found'
    }
  }

  fdWebExtension.fdScrollDown = function (controlId) {
    fdWebExtension.fdLog("fdScrollDown - controlId=" + controlId);

    if (!controlId) {
      return {
        success: false,
        errorMessage: 'controlId must be specified'
      }
    }

    if (fdWebExtension.fdFindControlCustom && fdWebExtension.fdFindControlCustom(controlId)) {
      return fdWebExtension.fdScrollDownCustom(controlId);
    }

    var textControlEl = fdWebExtension.fdFindControlStandard(controlId);
    if (textControlEl) {
      return fdWebExtension.fdScrollDownStandard(textControlEl);
    }

    return {
      success: false,
      errorMessage: 'text control not found'
    }
  }

  fdWebExtension.fdScrollCaret = function (controlId) {
    fdWebExtension.fdLog("fdScrollCaret - controlId=" + controlId);

    if (!controlId) {
      return {
        success: false,
        errorMessage: 'controlId must be specified'
      }
    }

    if (fdWebExtension.fdFindControlCustom && fdWebExtension.fdFindControlCustom(controlId)) {
      return fdWebExtension.fdScrollCaretCustom(controlId);
    }

    var textControlEl = fdWebExtension.fdFindControlStandard(controlId);
    if (textControlEl) {
      return fdWebExtension.fdScrollCaretStandard(textControlEl);
    }

    return {
      success: false,
      errorMessage: 'text control not found'
    }
  }

  fdWebExtension.fdUndo = function (controlId) {
    fdWebExtension.fdLog("fdUndo - controlId=" + controlId);

    if (!controlId) {
      return {
        success: false,
        errorMessage: 'controlId must be specified'
      }
    }

    if (fdWebExtension.fdFindControlCustom && fdWebExtension.fdFindControlCustom(controlId)) {
      return fdWebExtension.fdUndoCustom(controlId);
    }

    var textControlEl = fdWebExtension.fdFindControlStandard(controlId);
    if (textControlEl) {
      return fdWebExtension.fdUndoStandard(textControlEl);
    }

    return {
      success: false,
      errorMessage: 'text control not found'
    }
  }

  fdWebExtension.fdAddMessageHandler('TextControlHandler', function (obj) {
    if (obj.msg == 'GetFocusedControlId') {
      var result = fdWebExtension.fdGetFocusedControlId();

      var isAthena = false;
      if (window.AH)
        isAthena = true;

      var isOncoEMR = false;
      if (window.OncoEMR)
        isOncoEMR = true;

      var overrideInsertionMethod = fdWebExtension.fdGetTextInsertionMethodOverride();

      fdWebExtension.fdWebSocket.send(JSON.stringify({
        id: obj.id,
        msg: obj.msg,
        result: {
          success: result.success,
          errorMessage: result.errorMessage ? result.errorMessage : '',
          focusedControlId: result.focusedControlId,
          isAthena: isAthena,
          isOncoEMR: isOncoEMR,
          overrideInsertionMethod: overrideInsertionMethod
        }
      }));

      return true;
    }
    else if (obj.msg == 'GetTabId') {
      var result = fdWebExtension.fdGetTabId();
      fdWebExtension.fdWebSocket.send(JSON.stringify({
        id: obj.id,
        msg: obj.msg,
        result: {
          success: result.success,
          errorMessage: result.errorMessage ? result.errorMessage : '',
          tabId: result.tabId
        }
      }));

      return true;
    }
    else if (obj.msg == 'GetText') {
      var result = fdWebExtension.fdGetText(obj.controlId);
      fdWebExtension.fdWebSocket.send(JSON.stringify({
        id: obj.id,
        msg: obj.msg,
        result: {
          success: result.success,
          errorMessage: result.errorMessage ? result.errorMessage : '',
          text: result.text
        }
      }));

      return true;
    }
    else if (obj.msg == 'GetTextLength') {
      var result = fdWebExtension.fdGetTextLength(obj.controlId);
      fdWebExtension.fdWebSocket.send(JSON.stringify({
        id: obj.id,
        msg: obj.msg,
        result: {
          success: result.success,
          errorMessage: result.errorMessage ? result.errorMessage : '',
          textLength: result.textLength
        }
      }));

      return true;
    }
    else if (obj.msg == 'GetSelection') {
      var result = fdWebExtension.fdGetSelection(obj.controlId);
      fdWebExtension.fdWebSocket.send(JSON.stringify({
        id: obj.id,
        msg: obj.msg,
        result: {
          success: result.success,
          errorMessage: result.errorMessage ? result.errorMessage : '',
          selectionStart: result.start,
          selectionEnd: result.end
        }
      }));

      return true;
    }
    else if (obj.msg == 'SetSelection') {
      var result = fdWebExtension.fdSetSelection(obj.controlId, obj.selectionStart, obj.selectionEnd);
      fdWebExtension.fdWebSocket.send(JSON.stringify({
        id: obj.id,
        msg: obj.msg,
        result: {
          success: result.success,
          errorMessage: result.errorMessage ? result.errorMessage : '',
        }
      }));

      return true;
    }
    else if (obj.msg == 'DeleteSelection') {
      var result = fdWebExtension.fdDeleteSelection(obj.controlId);
      fdWebExtension.fdWebSocket.send(JSON.stringify({
        id: obj.id,
        msg: obj.msg,
        result: {
          success: result.success,
          errorMessage: result.errorMessage ? result.errorMessage : '',
        }
      }));

      return true;
    }
    else if (obj.msg == 'InsertText') {
      var result = fdWebExtension.fdInsertText(obj.controlId, obj.text);
      fdWebExtension.fdWebSocket.send(JSON.stringify({
        id: obj.id,
        msg: obj.msg,
        result: {
          success: result.success,
          errorMessage: result.errorMessage ? result.errorMessage : '',
        }
      }));

      return true;
    }
    else if (obj.msg == 'BoldSelection') {
      var result = fdWebExtension.fdBoldSelection(obj.controlId);
      fdWebExtension.fdWebSocket.send(JSON.stringify({
        id: obj.id,
        msg: obj.msg,
        result: {
          success: result.success,
          errorMessage: result.errorMessage ? result.errorMessage : '',
          supported: result.supported,
          sendKeysFromFD: result.sendKeysFromFD
        }
      }));

      return true;
    }
    else if (obj.msg == 'ItalicizeSelection') {
      var result = fdWebExtension.fdItalicizeSelection(obj.controlId);
      fdWebExtension.fdWebSocket.send(JSON.stringify({
        id: obj.id,
        msg: obj.msg,
        result: {
          success: result.success,
          errorMessage: result.errorMessage ? result.errorMessage : '',
          supported: result.supported,
          sendKeysFromFD: result.sendKeysFromFD
        }
      }));

      return true;
    }
    else if (obj.msg == 'UnderlineSelection') {
      var result = fdWebExtension.fdUnderlineSelection(obj.controlId);
      fdWebExtension.fdWebSocket.send(JSON.stringify({
        id: obj.id,
        msg: obj.msg,
        result: {
          success: result.success,
          errorMessage: result.errorMessage ? result.errorMessage : '',
          supported: result.supported,
          sendKeysFromFD: result.sendKeysFromFD
        }
      }));

      return true;
    }
    else if (obj.msg == 'CutSelection') {
      var result = fdWebExtension.fdCutSelection(obj.controlId);
      fdWebExtension.fdWebSocket.send(JSON.stringify({
        id: obj.id,
        msg: obj.msg,
        result: {
          success: result.success,
          errorMessage: result.errorMessage ? result.errorMessage : '',
          supported: result.supported,
          sendKeysFromFD: result.sendKeysFromFD
        }
      }));

      return true;
    }
    else if (obj.msg == 'CopySelection') {
      var result = fdWebExtension.fdCopySelection(obj.controlId);
      fdWebExtension.fdWebSocket.send(JSON.stringify({
        id: obj.id,
        msg: obj.msg,
        result: {
          success: result.success,
          errorMessage: result.errorMessage ? result.errorMessage : '',
          supported: result.supported,
          sendKeysFromFD: result.sendKeysFromFD
        }
      }));

      return true;
    }
    else if (obj.msg == 'PasteSelection') {
      var result = fdWebExtension.fdPasteSelection(obj.controlId);
      fdWebExtension.fdWebSocket.send(JSON.stringify({
        id: obj.id,
        msg: obj.msg,
        result: {
          success: result.success,
          errorMessage: result.errorMessage ? result.errorMessage : '',
          supported: result.supported,
          sendKeysFromFD: result.sendKeysFromFD
        }
      }));

      return true;
    }
    else if (obj.msg == 'ScrollUp') {
      var result = fdWebExtension.fdScrollUp(obj.controlId);
      fdWebExtension.fdWebSocket.send(JSON.stringify({
        id: obj.id,
        msg: obj.msg,
        result: {
          success: result.success,
          errorMessage: result.errorMessage ? result.errorMessage : '',
          supported: result.supported,
          sendKeysFromFD: result.sendKeysFromFD
        }
      }));

      return true;
    }
    else if (obj.msg == 'ScrollDown') {
      var result = fdWebExtension.fdScrollDown(obj.controlId);
      fdWebExtension.fdWebSocket.send(JSON.stringify({
        id: obj.id,
        msg: obj.msg,
        result: {
          success: result.success,
          errorMessage: result.errorMessage ? result.errorMessage : '',
          supported: result.supported,
          sendKeysFromFD: result.sendKeysFromFD
        }
      }));

      return true;
    }
    else if (obj.msg == 'ScrollCaret') {
      var result = fdWebExtension.fdScrollCaret(obj.controlId);
      fdWebExtension.fdWebSocket.send(JSON.stringify({
        id: obj.id,
        msg: obj.msg,
        result: {
          success: result.success,
          errorMessage: result.errorMessage ? result.errorMessage : '',
          supported: result.supported,
          sendKeysFromFD: result.sendKeysFromFD
        }
      }));

      return true;
    }
    else if (obj.msg == 'Undo' || obj.msg == 'UndoSelection') {
      var result = fdWebExtension.fdUndo(obj.controlId);
      fdWebExtension.fdWebSocket.send(JSON.stringify({
        id: obj.id,
        msg: obj.msg,
        result: {
          success: result.success,
          errorMessage: result.errorMessage ? result.errorMessage : '',
          supported: result.supported,
          sendKeysFromFD: result.sendKeysFromFD
        }
      }));

      return true;
    }

    return false;
  });

  fdWebExtension.fdConnect();
}

// Any EMR SSO handler
// If fdGetUserId function is defined, then add a message handler for the GetUserId messages.
if (fdWebExtension.fdGetUserId) {
  fdWebExtension.fdLog("fdWebExtension - found fdGetUserId SSO function");

  fdWebExtension.fdAddMessageHandler('SsoHandler', function (obj) {
    if (obj.msg == 'GetUserId') {
      fdWebExtension.fdLog('fdSsoHandler - getting userId');
      var userId = fdWebExtension.fdGetUserId();
      fdWebExtension.fdLog("fdSsoHandler - userId='" + userId + "'");
      fdWebExtension.fdWebSocket.send(JSON.stringify({
        id: obj.id,
        msg: obj.msg,
        result: {
          success: true,
          userId: userId
        }
      }));
      return true;
    }

    return false;
  });

  fdWebExtension.fdConnect();
}

// Any EMR grammar handler
// If FD grammar functions are defined, then set up a timer and poll for grammar changes.
// If grammar changes, then notify FD of the grammar via a web socket message.
// If FD recognizes a command from the grammar, then it'll send a message to be handled by fdExecuteCommand.
if (fdWebExtension.fdGetGrammar && fdWebExtension.fdExecuteCommand) {
  fdWebExtension.fdLog('fdWebExtension - found grammar functions');

  if (!fdWebExtension.fdGrammarTimerId) {
    var currentGrammar = '';

    fdWebExtension.fdAddMessageHandler('GrammarHandler', function (obj) {
      if (obj.msg == 'ExecuteCommand') {
        fdWebExtension.fdLog('fdGrammarHandler - execute command resultDetail=' + obj.resultDetailJson);
        var resultDetailObj = JSON.parse(obj.resultDetailJson);
        fdWebExtension.fdExecuteCommand(resultDetailObj);
        return true;
      }

      return false;
    });

    fdWebExtension.fdConnect();

    fdWebExtension.fdGrammarTimerId = setInterval(function () {

      // if web socket isn't ready yet, then set current grammar to empty
      // as soon as web socket is ready, then grammar change is detected
      // this is useful for when FD hasn't started yet or is restarted
      if (!fdWebExtension.fdWebSocket || fdWebExtension.fdWebSocket.readyState != 1) {
        currentGrammar = '';
        return;
      }

      var grammar = fdWebExtension.fdGetGrammar();
      if (grammar != currentGrammar) {
        currentGrammar = grammar;

        if (currentGrammar) {
          fdWebExtension.fdLog('fdGrammarTimer - newGrammar=' + currentGrammar);

          fdWebExtension.fdWebSocket.send(JSON.stringify({
            id: fdWebExtension.fdGuid(),
            msg: 'AddGrammar',
            fieldId: 'AnyEmrGrammar',
            grammar: currentGrammar
          }));
        }
        else {
          fdWebExtension.fdLog('fdGrammarTimer - grammar is empty');

          fdWebExtension.fdWebSocket.send(JSON.stringify({
            id: fdWebExtension.fdGuid(),
            msg: 'RemoveGrammar',
            fieldId: 'AnyEmrGrammar'
          }));
        }
      }
    }, 1000);
  }
}

// Chrome/Firefox Scripting API
if (!fdWebExtension.fdScriptingApi) {

  fdWebExtension.fdScriptingApi = 'initialized!';

  fdWebExtension.fdIsElementKeyboardFocusable = function(element) {
    // see https://stackoverflow.com/questions/18261595/how-to-check-if-a-dom-element-is-focusable
    let hasAttributes = element.attributes != null && element.attributes.length
    let hasHref = hasAttributes && element.attributes.getNamedItem("href") != null;
    let hasTabindex = hasAttributes && element.attributes.getNamedItem("tabindex") != null;
    let hasDisabled = hasAttributes && element.attributes.getNamedItem("disabled") != null;
    let isIFrame = element.nodeName === "IFRAME";
    let isFormElement = element.nodeName === "INPUT" || element.nodeName === "SELECT" ||
      element.nodeName === "TEXTAREA" || element.nodeName === "BUTTON";

    if (element.nodeName === "A" || element.nodeName === "AREA" && hasHref)
      return true;
    if (hasTabindex)
      return true;
    if (isIFrame)
      return true;
    if (isFormElement && !hasDisabled)
      return true;

    return false;
  }

  // this should be renamed, not really mapping to JSON
  fdWebExtension.fdMapDomToJson = function(element, includeChildNodes) {
    let object = {};

    if (element == null)
      return object;

    if (element.nodeType === 1 && !element.getAttribute("fdUniqueId")) // nodeType = 1 indicates an element node
      element.setAttribute("fdUniqueId", fdWebExtension.fdGenerateUniqueControlId());

    // child nodes
    let childNodes = element.childNodes;
    if (childNodes != null && childNodes.length && includeChildNodes) {
      object["children"] = [];
      for (let i = 0; i < childNodes.length; i++) {
        let childNode = childNodes[i];
        if (childNode.nodeType === 3) { // if the node is a text node, the nodeType property will return 3
          object["children"].push(childNode.nodeValue);
        }
        else {
          json = fdWebExtension.fdMapDomToJson(childNode, true);
          object["children"].push(json);
        }
      }
    }

    // attributes
    object["attributes"] = {};
    if (element.attributes != null && element.attributes.length) {
      for (let i = 0; i < element.attributes.length; i++) {
        let attribute = element.attributes[i];
        object["attributes"][attribute.nodeName] = attribute.value;
      }

      object["IsRequiredForForm"] = element.attributes.getNamedItem("required") != null;
      object["ClassName"] = element.attributes.getNamedItem("class") != null ?
        element.attributes.getNamedItem("class").value : "";
    }

    // properties
    try { object["BoundingRectangle"] = element.getBoundingClientRect(); } catch(e) { }
    try { object["fdUniqueId"] = element.getAttribute("fdUniqueId"); } catch (e) { }
    object["TextContent"] = element.textContent;
    object["IsChecked"] = element.checked === true;
    object["IsPassword"] = element.type === "password";
    object["IsKeyboardFocusable"] = fdWebExtension.fdIsElementKeyboardFocusable(element);
    object["HasKeyboardFocus"] = element === document.activeElement;
    object["Type"] = element.nodeName;
    object["Text"] = element.textContent != null ? element.textContent : "";
    object["Value"] = element.value != null ? element.value.toString() : "";
    object["AutomationId"] = element.id != null ? element.id : "";

    // clean up if element had no attributes
    object["IsRequiredForForm"] = object["IsRequiredForForm"] != undefined ? object["IsRequiredForForm"] : false;
    object["ClassName"] = object["ClassName"] != undefined ? object["ClassName"] : "";

    return object;
  }

  fdWebExtension.fdElementSatisfiesConditions = function(element, conditions) {
    if (conditions === '')
      return true;

    try {
      conditions = JSON.parse(conditions);
    }
    catch (e) {
      fdWebExtension.fdLog('fdwebsocket - chrome/firefox scripting api - JSON.parse() throws error for conditions=' + conditions);
      return false;
    }

    for (let key in conditions) {
      var extElement = fdWebExtension.fdMapDomToJson(element, false);
      if (key === "ClassName" && !extElement[key].includes(conditions[key])) // check if subset of class names
        return false;
      if (key !== "ClassName" && extElement[key] !== conditions[key] && extElement["attributes"][key] !== conditions[key])
        return false;
    }

    return true;
  }

  fdWebExtension.fdGetIFrameBody = function(frameRef) {
    var iframeDoc = frameRef.contentWindow ? frameRef.contentWindow.document : frameRef.contentDocument;
    return iframeDoc.body;
  }

  // gets all elements by searching with getElementsBy methods
  fdWebExtension.fdGetElements = function(conditions, currentElement, includeChildNodes) {
    try {
      conditions = JSON.parse(conditions);
    } catch (e) { }

    let elementToSearchOn = typeof currentElement !== "undefined" ? currentElement : document;
    let hasClassNameCondition = typeof conditions["ClassName"] !== 'undefined';
    let hasTypeCondition = typeof conditions["Type"] !== 'undefined';
    let elementsFound;

    if (hasClassNameCondition) 
      elementsFound = elementToSearchOn.getElementsByClassName(conditions["ClassName"]);
    else if (hasTypeCondition) 
      elementsFound = elementToSearchOn.getElementsByTagName(conditions["Type"]);
    else
      elementsFound = elementToSearchOn.getElementsByTagName("*");

    let elementsArray = Array.from(elementsFound);

    if (hasClassNameCondition && elementToSearchOn.getAttribute("class") === conditions["ClassName"])
      elementsArray.push(elementToSearchOn); // because getElementsByClassName doesn't include elementToSearchOn in search
    if (hasTypeCondition && elementToSearchOn.nodeName.toLowerCase() === conditions["Type"].toLowerCase())
      elementsArray.push(elementToSearchOn); // because getElementsByTagName doesn't include elementToSearchOn in search
    if (!hasClassNameCondition && !hasTypeCondition)
      elementsArray.push(elementToSearchOn);

    return elementsArray;
  }

  // gets all elements by searching with getElementsBy methods and by searching through iframes/frames
  fdWebExtension.fdGetAllElements = function(conditions, element, includeChildNodes) {

    let elements = [];

    let visibleElements = fdWebExtension.fdGetElements(conditions, element, includeChildNodes);
    elements = elements.concat(visibleElements);

    // getElementsBy methods don't search through iframe, so we have to do it ourselves
    let iframes = element.getElementsByTagName("iframe");
    for (let iframe of iframes) {
      let iframeBody = fdWebExtension.fdGetIFrameBody(iframe);
      let iframeElems = fdWebExtension.fdGetAllElements(conditions, iframeBody, includeChildNodes);
      elements = elements.concat(iframeElems);
    }

    // frames have been removed from Web standards but EMRs still use them 
    let frames = element.getElementsByTagName("frame");
    for (let frame of frames) {
      let frameBody = fdWebExtension.fdGetIFrameBody(frame);
      let frameElems = fdWebExtension.fdGetAllElements(conditions, frameBody, includeChildNodes);
      elements = elements.concat(frameElems);
    }

    return elements;
  }

  fdWebExtension.fdGetBaseElement = function(obj, baseElement) {

    if (!obj.fdUniqueId)
      return baseElement;

    try {
      if (baseElement.getAttrribute('fduniqueid') === obj.fdUniqueId)
        return baseElement;
    } catch (e) {}

    let uniqueElement = baseElement.querySelector('[fdUniqueId="' + obj.fdUniqueId + '"]');
    if (uniqueElement !== null && uniqueElement !== undefined)
      return (uniqueElement.nodeName.toUpperCase() === 'IFRAME' || uniqueElement.nodeName.toUpperCase() === 'FRAME') ? fdWebExtension.fdGetIFrameBody(uniqueElement) : uniqueElement;


    let iframes = baseElement.getElementsByTagName("iframe");
    for (let iframe of iframes) {
      let iframeBody = fdWebExtension.fdGetIFrameBody(iframe);
      uniqueElement = fdWebExtension.fdGetBaseElement(obj, iframeBody);
      if (uniqueElement !== null)
        return uniqueElement;
    }

    let frames = baseElement.getElementsByTagName("frame");
    for (let frame of frames) {
      let frameBody = fdWebExtension.fdGetIFrameBody(frame);
      uniqueElement = fdWebExtension.fdGetBaseElement(obj, frameBody);
      if (uniqueElement !== null)
        return uniqueElement;
    }

    return null;
  }

  fdWebExtension.fdFindElement = function(obj) {

    // special case: get body element  
    if (obj.conditions === 'html') {
      return document.documentElement;
    }

    // special case: get body element  
    if (obj.conditions === 'body') {
      return document.body;
    }

    let baseElement = fdWebExtension.fdGetBaseElement(obj, document);
    let allElements = fdWebExtension.fdGetAllElements(obj.conditions, baseElement, false);
    for (let element of allElements) {
      if (fdWebExtension.fdElementSatisfiesConditions(element, obj.conditions)) {
        return element;
      }
    }

    return null;
  }

  fdWebExtension.fdFindAllElements = function(obj) {
    let baseElement = fdWebExtension.fdGetBaseElement(obj, document);
    let allElements = fdWebExtension.fdGetAllElements(obj.conditions, baseElement, false);
    let elementsWithConditions = [];
    for (let element of allElements) {
      if (fdWebExtension.fdElementSatisfiesConditions(element, obj.conditions))
        elementsWithConditions.push(element);
    }

    return elementsWithConditions;
  }

  fdWebExtension.fdFindImmediateChildren = function(obj) {

    let baseElement = fdWebExtension.fdGetBaseElement(obj, document);
    if (baseElement.childNodes == null || !baseElement.childNodes.length) {
      return [];
    }

    let children = Array.from(baseElement.childNodes);
    let immediateChildren = [];
    for (let element of children) {
      if (fdWebExtension.fdElementSatisfiesConditions(element, obj.conditions))
        immediateChildren.push(element);
    }

    return immediateChildren;
  }

  fdWebExtension.fdInvokeControl = function (obj) {
    var conditions = (obj.conditions == undefined) ? {} : obj.conditions;
    var id = obj.element.AutomationId;
    var className = obj.element.ClassName;
	//Checks if object is empty
    var numberOfKeys = Object.keys(conditions).length;
	
    if (numberOfKeys == 0 && (id == "" || id == null || className == "" || className == null))
      return {
        success: false,
        errorMessage: 'cannot find element to click'
      }

    if (numberOfKeys == 0) {
      if (id != "" && id != null)
        obj.conditions = '{"AutomationId": "' + id + '"}';
      
      else if (className != "" && className != null)
        obj.conditions = '{"ClassName": "' + className + '"}';
    }

    var element = fdWebExtension.fdFindElement(obj);
    if (element != null) {
      element.click();
      return {
        success: true
      }
    }
    
    return {
      success: false,
      errorMessage: 'cannot find element to click'
    }
  }

  fdWebExtension.fdFocusControl = function (obj) {
    var element = fdWebExtension.fdFindElement(obj);
    if (element != null) {
      element.focus();
      return {
        success: true
      }
    }
    
    return {
      success: false,
      errorMessage: 'cannot find element to focus'
    }
  } 

  fdWebExtension.fdAddMessageHandler('ScriptingApiHandler', function(obj) {

    if (obj.msg === 'FindElement') {
      let element = fdWebExtension.fdFindElement(obj);
      var success = element == null ? false : true;
      var errorMessage = element == null ? 'element not found' : '';
      var webElement = element == null ? null : fdWebExtension.fdMapDomToJson(element, false);
      fdWebExtension.fdWebSocket.send(JSON.stringify({
        id: obj.id,
        msg: obj.msg,
        result: {
          success: success,
          errorMessage: errorMessage,
          element: webElement
        }
      }));

      return true;
    }

    else if (obj.msg === 'FindAllElements') {
      let elements = fdWebExtension.fdFindAllElements(obj);
      var success = elements.length == 0 ? false : true;
      var errorMessage = elements.length == 0 ? 'elements not found' : '';
      var extElements = [];
      for (let element of elements) {
          extElements.push(fdWebExtension.fdMapDomToJson(element, false));
      }
      fdWebExtension.fdWebSocket.send(JSON.stringify({
        id: obj.id,
        msg: obj.msg,
        result: {
          success: success,
          errorMessage: errorMessage,
          elements: extElements
        }
      }));

      return true;
    }

    else if (obj.msg === 'FindImmediateChildren') {
      let children = fdWebExtension.fdFindImmediateChildren(obj);
      var success = children.length == 0 ? false : true;
      var errorMessage = children.length == 0 ? 'elements not found' : '';
      var extElements = [];
      for (let element of children) {
          extElements.push(fdWebExtension.fdMapDomToJson(element, false));
      }
      fdWebExtension.fdWebSocket.send(JSON.stringify({
        id: obj.id,
        msg: obj.msg,
        result: {
          success: success,
          errorMessage: errorMessage,
          elements: extElements
        }
      }));
      return true;
    }

    else if (obj.msg === 'InvokeControl') {
      let result = fdWebExtension.fdInvokeControl(obj);
      fdWebExtension.fdWebSocket.send(JSON.stringify({
        id: obj.id,
        msg: obj.msg,
        result: {
          success: result.success,
          errorMessage: result.errorMessage ? result.errorMessage : ''
        }
      }));
      return true;
    }

    else if (obj.msg === 'FocusControl') {
      let result = fdWebExtension.fdFocusControl(obj);
      fdWebExtension.fdWebSocket.send(JSON.stringify({
        id: obj.id,
        msg: obj.msg,
        result: {
          success: result.success,
          errorMessage: result.errorMessage ? result.errorMessage : ''
        }
      }));
      return true;
    }

    return false;
  });
}

// Javascript API
if (!fdWebExtension.fdJavascriptAPI) {

  fdWebExtension.fdJavascriptAPI = 'initialized!';

  fdWebExtension.fdExecuteFunction = function(obj) {
    try {
      let funcInfo = JSON.parse(obj.funcInfo);
      let result = window[funcInfo.functionName](...funcInfo.arguments);

      return {
        success: true,
        result: result
      }
    }
    catch (e) {
      return {
        success: false,
        errorMessage: e.message,
        result: ""
      }
    }
  }
  
  fdWebExtension.fdGetJsonObject = function (obj) {
    try {
      let result = window[obj.varibleName];
      return {
        success: true,
        jsonObject: result
      }
    }
    catch (e) {
      return {
        success: false,
        errorMessage: e.message,
        result: ""
      }
    }
  }
  
  fdWebExtension.fdExecuteFunctionOnObject = function (obj) {
    try {
      let variableObject = window[obj.varibleName];
	  let funcInfo = JSON.parse(obj.funcInfo);
	  var args = (String(funcInfo.arguments) == "") ? funcInfo.arguments : JSON.parse(funcInfo.arguments);
      let result = variableObject[funcInfo.functionName](args);
      return {
        success: true,
        result: result
      }
    }
    catch (e) {
      return {
        success: false,
        errorMessage: e.message,
        result: ""
      }
    }
  }

  fdWebExtension.fdAddMessageHandler('JavascriptApiHandler',
    function(obj) {

      if (obj.msg === 'ExecuteFunction') {
        let result = fdWebExtension.fdExecuteFunction(obj);
        fdWebExtension.fdWebSocket.send(JSON.stringify({
          id: obj.id,
          msg: obj.msg,
          result: {
            success: result.success,
            errorMessage: result.errorMessage ? result.errorMessage : '',
            result: result.result
          }
        }));

        return true;
      }
	  
	  else if (obj.msg === 'GetJsonObject') {
        let result = fdWebExtension.fdGetJsonObject(obj);
		var jsonObjectStr = "";
		var jsonObject = result.jsonObject;
        for (var p in jsonObject) {
          if (jsonObject.hasOwnProperty(p)) {
            jsonObjectStr += p + '::' + jsonObject[p] + '\n';
          }
        }
        fdWebExtension.fdWebSocket.send(JSON.stringify({
          id: obj.id,
          msg: obj.msg,
          result: {
            success: result.success,
		    errorMessage: result.errorMessage ? result.errorMessage : '',
		    jsonObject: jsonObjectStr
          }
        }));
        return true;
      }
	  
	  else if (obj.msg === 'ExecuteFunctionOnObject') {
        let result = fdWebExtension.fdExecuteFunctionOnObject(obj);
        fdWebExtension.fdWebSocket.send(JSON.stringify({
          id: obj.id,
          msg: obj.msg,
          result: {
            success: result.success,
		    errorMessage: result.errorMessage ? result.errorMessage : '',
		    result: JSON.stringify(result.result)
          }
        }));
        return true;
      }
	  
      return false;
    });
}
