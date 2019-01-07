/**
 * This service is responsible for sending, receiving and handling of messages.
 * Listening to messages is done by MainController.
 *
 * NOTE:
 * an iframe (our app in this case) can only receive messages from background.js
 * our iframe (app) can only send messages to content script.
 */


(function () {

  function Events($rootScope, AppData, $q) {

    var events = {};

    //****************************************************************//
    //******************** HELPER FUNCTIONS **************************//
    //****************************************************************//

    /**
     * Each message request has a string message and an optional data object
     *
     * @param message_id
     * @param data
     */
    events.sendMessage = function (message_id, data) {
      var data = data || {};
      window.parent.postMessage({
        message_id: message_id,
        data: data
      }, '*');
    };

    /**
     * Routing incoming messages
     * @param request
     */
    events.processMessage = function (request) {
      if (!request.message_id) return;

      switch (request.message_id) {
        case 'new-pane-init-data':
          events.onPaneInitDataReceived(request.data);
          break;
        case 'clipto-all-notes':
          events.onAllNotesReceived(request.data);
          break;
        case 'clipto-on-new-clip':
          events.onNewClip(request.data);
          break;
        case 'clipto-clip-page':
          events.onClipPage(request.data);
          break;
        case 'clipto-is-iframe-loaded':
          events.onIsIframeLoaded(request.data);
          break;
        case 'clipto-get-page-data':
          events.onGetPageData(request.data);
          break;
        case 'clipto-tab-updated':
          events.onTabUpdated(request.data);
          break;
        case 'clipto-new-active-tab':
          events.onNewActiveTab(request.data);
          break;
        case 'clipto-note-updated':
          events.onNoteUpdated(request.data);
          break;
        case 'clipto-delete-note-item':
          //events.onNoteUpdated(request.data);
          break;
        case 'clipto-guide-name-enter':
          events.onGuideNameEnter(request.data);
          break;
        case 'clipto-guide-sign-up':
          events.onGuideSignUp(request.data);
          break;
      }
    };

    /**
     * set the tab url, user and notes on AppData, and go home
     * @param data
     */
    events.setInitData = function (data) {

      console.log('setInitData');
      console.log(data);

      AppData.setActiveTabUrl(data.url);
      AppData.setActiveTabDomain(data.domain);
      AppData.setAppVersion(data.AppVersion);
      AppData.setDeviceId(data.deviceId);
      AppData.setPageTitle(data.documentTitle);
      AppData.setActiveUser(data.user);
      AppData.setUsers(data.users);

      var promisesArray = [
        AppData.setUrlNotes(data.urlNotes)
      ];

      if (data.user && data.user !== null) {
        promisesArray.push(AppData.setDbsMetaData(data.dbsMetaData));
      }

      $q.all(promisesArray).then(function (results) {
        $rootScope.$broadcast('pane-init-data-ready', null);
      });

    };

    //****************************************************************//
    //******************** EVENTS ************************************//
    //****************************************************************//

    /**
     * onBackgroundMessage refers to chrome.tabs messages sent from background
     * @param request
     * @param sender
     * @param sendResponse
     */
    events.onBackgroundMessage = function (request, sender, sendResponse) {

      if (!request.message_id) return;

      // call the listener callback
      events.processMessage(request);
    };

    /**
     * background sent pane init data
     * @param data: {location, user)
     */
    events.onPaneInitDataReceived = function (data) {
      console.log('onPaneInitDataReceived');
      if (!data) {
        //TODO: add error log here and send one more new request for data from bg ( avoid loops!)
      } else {
        events.setInitData(data);
      }
    };

    /**
     * this event is fired once pane is opened.
     * @param data ({allNotes array})
     */
    events.onAllNotesReceived = function (data) {
      AppData.setAllNotes(data.allNotes);
      $rootScope.$broadcast('clipto-on-all-notes', data.allNotes);

    };

    /**
     * background sent new clip - highlight or note
     * if highlight - data: {xpathRange, highlightText, isValidHighlight, message, tabId, match}
     * if note - data: {note, message}
     */
    events.onNewClip = function (data) {
      $rootScope.$broadcast('clipto-on-new-clip', data);
    };

    events.onClipPage = function() {
      $rootScope.$broadcast('clip-page', {});
    };

    /**
     * background is checking if pane is loaded on this tab. Just say hi back.
     */
    events.onIsIframeLoaded = function () {
      events.message_paneLoaded();
    };

    events.onGetPageData = function (data) {
      $rootScope.$broadcast('current-page-data', data);
    };

    events.onTabUpdated = function (data) {
      $rootScope.$broadcast('tab-updated', data);
    };

    events.onNewActiveTab = function (data) {
      $rootScope.$broadcast('new-active-tab', data);
    };

    events.onNoteUpdated = function (data) {
      $rootScope.$broadcast('note-updated', data);
    };

    events.onInnerAppNotification = function (data) {
      $rootScope.$broadcast('clipto-inner-app-notification', data);
    };

    events.onGuideNameEnter = function (data) {
      $rootScope.$broadcast('clipto-guide-name-enter', data);
    };

    events.onGuideSignUp = function (data) {
      $rootScope.$broadcast('clipto-guide-sign-up', data);
    };


    //****************************************************************//
    //******************** MESSAGES **********************************//
    //****************************************************************//

    events.message_paneLoaded = function () {
      events.sendMessage('clipto-iframe-loaded');
    };

    events.message_closePane = function () {
      events.sendMessage('clipto-close-pane');
    };

    events.message_newRemoteUser = function (user) {
      events.sendMessage('clipto-new-remote-user', user);
    };

    events.message_logOutUser = function (user) {
      events.sendMessage('clipto-logout-user', user);
    };

    events.message_setActiveUser = function (user) {
      events.sendMessage('clipto-set-active-user', user);
    };

    events.message_onUserAuthenticated = function (user) {
      events.sendMessage('clipto-user-authenticated', user);
    };

    events.message_getPageData = function () {
      events.sendMessage('clipto-get-page-data')
    };

    events.message_removeHighlight = function (highlightId) {
      events.sendMessage('clipto-remove-highlight', highlightId)
    };

    events.message_scrollToHighlight = function (data) {
      events.sendMessage('clipto-scroll-to-highlight', data)
    };

    events.message_alreadyClipped = function () {
      events.sendMessage('clipto-already-clipped')
    };

    events.message_gaEvent = function (data) {
      events.sendMessage('clipto-google-analytics-event', data)
    };

    //****************************************************************//
    //************** FINALLY, SERVICE RETURNS events *****************//
    //****************************************************************//

    return events;

  }

  angular.module('clipto')
    .service('Events', ['$rootScope', 'AppData', '$q', Events])

}());