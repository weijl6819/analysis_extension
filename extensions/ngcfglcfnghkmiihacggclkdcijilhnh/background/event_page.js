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
/**
 * This is the main background page, the control center
 *
 * NOTE:
 * background.js can receive messages from content script only
 * background.js can send messages to both content script and iframe (our app)
 */

//disable console.log
console.log = function() {};

var _cl_eventPage = {

  isIframeLoadedFlag: {},
  scrollToWaitingList: {},
  deviceId: undefined,

  /**
   * Init function
   */
  init: function () {

    chrome.runtime.onInstalled.addListener(_cl_eventPage.onRuntimeInstalled);

    chrome.runtime.onStartup.addListener(_cl_eventPage.onRuntimeStartup);

    // receive post messages from "content.script.js" and any iframes
    chrome.runtime.onMessage.addListener(_cl_eventPage.processMessage);

    // each complete: get tab data, get relevant notes from db, inject script, replay highlights and set icon
    chrome.webNavigation.onCompleted.addListener(_cl_eventPage.onWebNavigationCompleted);

    // listen to browser action click - just sends a message to open/close pane
    chrome.browserAction.onClicked.addListener(_cl_eventPage.onBrowserActionClicked);

    // listen to updates on tabs
    chrome.tabs.onUpdated.addListener(_cl_eventPage.onTabUpdated);

    // listen to change of active tab
    chrome.tabs.onActivated.addListener(_cl_eventPage.onTabActivated);

    //getDeviceId
    _cl_eventPage.getDeviceDetails();
  },

  //************************* GLOBALS ******************************//

  getDeviceDetails: function () {
    return _storage.getDeviceId_Promise().then(function (deviceId) {
      _cl_eventPage.deviceId = deviceId || null;
    })
  },
  /**
   * process messages coming from content script
   * @param request
   * @param sender
   * @param sendResponse
   */
  processMessage: function (request, sender, sendResponse) {

    console.log('bg received runtime message ' + request.message_id + ' ' + 'from tabId ' + sender.tab.id);
    if (!request.message_id) return;
    // process the request

    var response;

    switch (request.message_id) {
      // ===================== EVENT PAGE ======================
      case 'clipto-iframe-loaded':
        _cl_eventPage.onIframeLoaded(sender.tab.id);
        break;
      case 'clipto-homepage-loaded':
        _cl_eventPage.onHomepageLoaded(sender.tab.id);
        break;
      case 'clipto-on-mouseup':
        _cl_eventPage.onMouseup(sender, request.data);
        break;
      case 'clipto-add-note-to-page':
        _cl_eventPage.onAddNoteToPage(sender, request.data);
        break;
      case 'clipto-get-page-data':
        _cl_eventPage.onGetPageData(sender, request.data);
        break;
      case 'clipto-pane-open':
        _cl_eventPage.onPaneOpen(sender, request.data);
        break;
      case 'clipto-toolkit-clip-page':
        _cl_eventPage.onClipPage(sender, request.data);
        break;
      case 'clipto-open-page-and-scroll-to-highlight':
        _cl_eventPage.onOpenPageAndScrollToHighlight(request.data);
        break;
      case 'clipto-update-highlight':
        _cl_eventPage.onUpdateHighlight(sender.tab.id, request.data);
        break;
      case 'clipto-google-analytics-event':
        _ga.trackEvent(request.data);
        break;
      case 'clipto-guide-name-enter':
        _cl_eventPage.onGuideNameEnter(request.data);
        break;
      case 'clipto-guide-sign-up':
        _cl_eventPage.onGuideSignUp(request.data);
        break;
      // ====================== NOTES ===========================
      case 'clipto-create-new-note':
        _cl_notes.onCreateNewNote(sender.tab.id, request.data);
        break;
      case 'clipto-delete-note':
        _cl_notes.onDeleteNote(sender.tab.id, request.data);
        break;
      case 'clipto-update-note':
        _cl_notes.onUpdateNote(sender.tab.id, request.data);
        break;
      // ====================== USERS ===========================
      case 'clipto-new-remote-user':
        _cl_users.onNewRemoteUser(sender, request.data);
        break;
      case 'clipto-logout-user':
        _cl_users.onLogOutUser(sender, request.data);
        break;
      case 'clipto-set-active-user':
        response = _cl_users.onSetActiveUser(request.data);
        break;
      case 'clipto-user-authenticated':
        response = _cl_users.onUserAuthenticated(request.data);
        break;

    }
    if (response) {
      sendResponse(response)
    }
  },

  sendMessage: function (message_id, data) {
    var data = data || {};

    if (data.tabId) {
      //console.log('bg sending message : ' + message_id + ' to tab ' + data.tabId);
      chrome.tabs.sendMessage(data.tabId, {
        message_id: message_id,
        data: data
      });
    } else {
      // Fallback if no tab id, find the current tab and send a message to "inject.js" and all the iframes
      chrome.tabs.getSelected(null, function (tab) {
        if (!tab) return;
        //console.log('bg sending message : ' + message_id + ' to tab ' + tab.id);
        chrome.tabs.sendMessage(tab.id, {
          message_id: message_id,
          data: data
        });
      });
    }
  },

  /**
   * send message to all tabs
   * @param message_id
   * @param data
   */
  sendMessageToAllTabs: function (message_id, data) {
    chrome.tabs.query({}, function (tabs) {
      for (var i = 0; i < tabs.length; i++) {
        data.tabId = tabs[i].id;
        _cl_eventPage.sendMessage(message_id, data)
      }
    });
  },

  /**
   * Set the title/icon for page icon, based on whether 1 or more highlights weren't found in DOM.
   * Note that it doesn't show/hide icon
   * @param {number} tabId
   * @param isActive (boolean)
   * @private
   */
  setPageActionStatus: function (tabId, isActive) {
    "use strict";

    var coloredIcon = chrome.extension.getURL('icons/19.png'),
      blackIcon = chrome.extension.getURL('icons/19bw.png');
    chrome.browserAction.setIcon({
      "tabId": tabId,
      path: {
        19: isActive ? coloredIcon : blackIcon,
        38: isActive ? coloredIcon : blackIcon
      }
    });
  },

  //************************* EVENTS *******************************//

  /**
   * refresh all open tab
   */
  refreshAllTabs: function () {
    console.log('refreshAllTabs');

    chrome.tabs.query({}, function (tabs) {
      for (var i = 0; i < tabs.length; i++) {
        if (tabs[i].url.indexOf('chrome://') === -1) {
          chrome.tabs.reload(tabs[i].id);
        }
      }
    });
  },

  /**
   * init Scripts And User Data to tab
   * @param user
   * @param tabId
   * @param url
   * @returns {*}
   */
  initScriptsAndUserData_Promise: function (user, tabId, url) {
    console.log('init Scripts And User Data to tab');
    console.log(tabId, url);
    return _cl_tabs.executeAllScripts_Promise(tabId, false).then(function () {
      return _cl_users.initPaneUserData_Promise(user, tabId, url)
    });
  },

  /**
   * init Scripts And User Data on all open tabs
   */
  initScriptsAndUserDataOnAllTabs: function (user) {
    console.log('initScriptsAndUserDataOnAllTabs');
    var promisesArray = [];

    chrome.tabs.query({}, function (tabs) {
      for (var i = 0; i < tabs.length; i++) {
        if (tabs[i].url.indexOf('chrome://') === -1) {
          promisesArray.push(_cl_eventPage.initScriptsAndUserData_Promise(user, tabs[i].id, tabs[i].url))
        }
      }
    });
    return Promise.all(promisesArray)
  },

  /**
   * Fired when the extension is first installed,
   * when the extension is updated to a new version,
   * and when Chrome is updated to a new version.
   * also, called when you manually reload the extension
   *
   * details: {"previousVersion":"0.1","reason":"update"}
   *
   * @param {function} details function(object details) {...}
   */
  onRuntimeInstalled: function (details) {

    console.log('onRuntimeInstalled');

    // init deviceId
    return _storage.getDeviceId_Promise().then(function () {
      return _cl_users.createOrUpdateUser().then(function (user) {

        if (details && details.reason && details.reason == 'install') {
          _ga.trackEvent({hitType: 'event', eventCategory: 'users', eventLabel: 'general', eventAction: 'install'});

          //_cl_eventPage.initScriptsAndUserDataOnAllTabs(user);
          _cl_eventPage.refreshAllTabs();
          chrome.tabs.create({url: "https://www.cliptoapp.com/guide"});
        } else {
          _ga.trackEvent({hitType: 'event', eventCategory: 'users', eventLabel: 'general', eventAction: 'update'});
        }
      });
    });
  },

  /**
   * Fired when a document, including the resources it refers to, is completely loaded and initialized.
   * @param details
   */
  onWebNavigationCompleted: function (details) {
    "use strict";

    // 0 indicates the navigation happens in the tab content window;
    // a positive value indicates navigation in a subframe.
    if (details.frameId !== 0) {
      return Promise.resolve();
    } else {
      console.log("onWebNavigationCompleted");
      console.log(details);
      return _storage.getActiveUser_Promise().then(function (activeUser) {
        return _cl_eventPage.initScriptsAndUserData_Promise(activeUser, details.tabId, details.url)
      });
    }
  },

  /**
   * Fired when a profile that has this extension installed first starts up.
   * This event is not fired when an incognito profile is started,
   * even if this extension is operating in 'split' incognito mode.
   * @param details
   */
  onRuntimeStartup: function (details) {
    "use strict";
  },

  onTabUpdated: function (tabId, changeInfo, tab) {

    if (changeInfo.url && changeInfo.url !== undefined) {

      var data = {
        tabId: tabId,
        url: '',
        //domainNotes: [],
        urlNotes: []
      };

      var match = _lc_utils.buildMatchString(changeInfo.url);
      data.url = match.url;
      data.domain = match.domain;

      // gets all active user docs by url (from all dbs)
      //TODO : if url query params are mixed it will not find the url docs
      return _database.getAllDocumentsByKey_Promise('domain', data.domain, true).then(function (docs) {
        data.urlNotes = _lc_utils.extractUrlNotesFromDomainNotes(docs, data.url);
        _cl_eventPage.message_tabUpdated(data);
      });

    }
  },

  /**
   * when user changes the active tab, notify all tabs.
   * @param tabId
   * @param windowId
   */
  onTabActivated: function (tabId, windowId) {
    var data = {
      activeTab: tabId
    };

    // pane will just exit editMode on all tabs, including the new active one
    _cl_eventPage.sendMessageToAllTabs('clipto-new-active-tab', data);
  },

  /**
   * browser action clicked, notify content script
   * @returns {*}
   */
  onBrowserActionClicked: function () {
    console.log('onBrowserActionClicked');
    _cl_eventPage.message_browserActionClicked();
  },

  onIframeLoaded: function (senderTabId) {
    _cl_eventPage.isIframeLoadedFlag[senderTabId] = true;
  },

  /**
   * check if clipto app in pane was loaded for a specific tabId.
   * send the relevant data to initialize the app
   * @returns data{url, domain, user, domainNotes}
   */
  checkIsIframeLoadedFlag_Promise: function (tabId) {

    console.log('waiting for iFrame to load on tab ' + tabId);
    // send message to tab anyway, to check if frame loaded
    _cl_eventPage.message_isIframeLoaded(tabId);

    var counter = 0;
    return new Promise(function (_resolve, _reject) {
      function checkFlag() {
        //console.log('checkIsIframeLoadedFlag_Promise for tab ' + tabId + ' : ' + _cl_eventPage.isIframeLoadedFlag[tabId]);
        if ((_cl_eventPage.isIframeLoadedFlag[tabId] == false || _cl_eventPage.isIframeLoadedFlag[tabId] == undefined) && counter < 100) {
          /* this checks the flag every 100 milliseconds*/
          counter++;
          window.setTimeout(checkFlag, 100);
        } else if (_cl_eventPage.isIframeLoadedFlag[tabId] == true) {
          _resolve();
        } else if (counter >= 100) {
          //sometimes, like on Google search results page, chrome loads 'fake' iframs of ads, then clipto iFrame will not load and it's OK.
          console.log('OOPS. clipto iframe is not loaded on tabID ' + tabId);
          _cl_eventPage.setPageActionStatus(tabId, false);
          _reject()
        }
      }

      checkFlag();
    });
  },

  /**
   * user highlighted text
   * data: {xpathRange, highlightText, isValidHighlight, message}
   */
  onMouseup: function (sender, data) {
    data.tabId = sender.tab.id;
    data.match = _lc_utils.buildMatchString(sender.url);
    //TODO: is this async??
    _cl_eventPage.message_onUserNewClip(data)
  },

  /**
   * user added note to page
   */
  onAddNoteToPage: function (sender, data) {
    data.tabId = sender.tab.id;
    data.match = _lc_utils.buildMatchString(sender.url);
    _cl_eventPage.message_onUserNewClip(data)
  },

  onPaneOpen: function (sender, data) {

    data.tabId = sender.tab.id;

    console.log('onPaneOpen');
    _ga.trackEvent({hitType: 'event', eventCategory: 'pane', eventAction: 'open'});

    return _storage.getLastActiveDeviceId_Promise().then(function (lastActiveDeviceId) {
      if (lastActiveDeviceId && _cl_eventPage.deviceId !== lastActiveDeviceId) {
        return _storage.getActiveUser_Promise().then(function (user) {
          return _remote_database.syncAllUserDbs_Promise(user)
        }).then(function () {
          return _database.getAllDocuments_Promise()
        }).then(function (allNotes) {
          data.allNotes = allNotes;
          _cl_eventPage.message_allNotes(data)
        })
      } else {
        _storage.setLastActiveDeviceId_Promise(_cl_eventPage.deviceId).then(function () {
          return _database.getAllDocuments_Promise()
        }).then(function (allNotes) {
          data.allNotes = allNotes;
          _cl_eventPage.message_allNotes(data)
        })
      }
    });
  },

  onClipPage: function (sender, data) {
    data.tabId = sender.tab.id;
    _cl_eventPage.message_clipPage(data)
  },

  onOpenPageAndScrollToHighlight: function (data) {

    var url = data.url,
      highlightId = data.highlightId;

    chrome.tabs.create({url: url}, function (tab) {

      var tabId = tab.id;
      var resData = {
        tabId: tab.id,
        url: decodeURIComponent(tab.url),
        highlightId: highlightId
      };
      _cl_eventPage.scrollToWaitingList[tabId] = resData;

    })
  },

  /**
   * Update the highlight by changing its class name, first by revising its 'create' document, then in DOM
   * @param tabId
   * @param data
   */
  onUpdateHighlight: function (tabId, data) {
    "use strict";

    var noteProperties = data.noteProperties,
      user = data.user,
      itemId = data.itemId,
      isUpdateDb = data.isUpdateDb,
      color = data.color,
      isActive = data.isActive;

    var promisesArray = [
      _cl_tabs.message_updateHighlight_Promise(tabId, data)
    ];

    if (isUpdateDb) {
      promisesArray.push(_cl_notes.onUpdateNote(tabId, data))
    }

    return Promise.all(promisesArray);
  },

  onGuideNameEnter: function (data) {

    _cl_eventPage.sendMessage("clipto-guide-name-enter", data);
  },

  onGuideSignUp: function (data) {
    _cl_eventPage.sendMessage("clipto-guide-sign-up", data);
  },

  /**
   * data coming from content script about location, such as current href and title
   * initially requested from app, so just route back to app.
   * @param sender
   * @param data
   */
  onGetPageData: function (sender, data) {
    data.tabId = sender.tab.id;
    _cl_eventPage.sendMessage("clipto-get-page-data", data);
  },

  //************************* MESSAGES *****************************//

  message_isIframeLoaded: function (tabId) {
    "use strict";
    var data = {
      tabId: tabId
    };
    _cl_eventPage.sendMessage("clipto-is-iframe-loaded", data);
  },

  message_newPaneInitData: function (data) {
    _cl_eventPage.sendMessage('new-pane-init-data', data);
  },

  message_tabUpdated: function (data) {
    _cl_eventPage.sendMessage('clipto-tab-updated', data);
  },

  message_onUserNewClip: function (data) {
    _cl_eventPage.sendMessage('clipto-on-new-clip', data);
  },

  message_clipPage: function (data) {
    _cl_eventPage.sendMessage('clipto-clip-page', data);
  },

  message_scrollToHighlight: function (data) {
    _cl_eventPage.sendMessage('clipto-scroll-to-highlight', data);
  },

  message_browserActionClicked: function () {
    _cl_eventPage.sendMessage('clipto-browser-action-clicked')
  },

  message_allNotes: function (data) {
    _cl_eventPage.sendMessage('clipto-all-notes', data)
  }

};

_cl_eventPage.init();