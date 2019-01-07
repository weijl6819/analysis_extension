/**
 * NOTE:
 * content script can receive messages from both background.js and DOM / iframes
 * content script can only send messages to background.js
 */

//disable console.log
console.log = function() {};

var _cl_contentScript = {

  /**
   * A random string applied as an additional class name to all highlights,
   * allowing .on() event handling, and shared style
   */
  highlightClassName: null,

  // ===================================================== //
  // =========== INIT ON EACH PAGE LOAD ================== //
  // ===================================================== //

  init: function () {

    console.log('Clipto Init');

    _cl_contentScript.highlightClassName = _lc_utils.createUUID({beginWithLetter: true});

    // insert clipto pane
    _cl_contentScript.insertCliptoPane();

    // listen to the iframe messages
    window.addEventListener("message", _cl_contentScript.onDomMessage, false);

    // listen to the Control Center (background.js) messages
    chrome.runtime.onMessage.addListener(_cl_contentScript.onBackgroundMessage);

    // listen to page resizing
    window.addEventListener('resize', _cl_contentScript.onPageResize);

    //bind mouseup event
    $(document).bind('mouseup', function (e) {
      _cl_contentScript.onMouseup(e);
    });

    // monitor shift key press. double shift will activate highlighter if there's marked text
    $(document).on('keydown', function(e) {

      if (e.which === 16 && !_lc_utils.isEditable(document.activeElement)) {

        _cl_contentScript.STATE.shiftKeyPressCount += 1;
        if (_cl_contentScript.STATE.shiftKeyPressCount > 1) {
          _cl_contentScript.activateHighlighter();
          if (window.getSelection) {
            if (window.getSelection().empty) {  // Chrome
              window.getSelection().empty();
            }
            //else if (window.getSelection().removeAllRanges) {  // Firefox
            //  window.getSelection().removeAllRanges();
            //}
          }
          _cl_contentScript.STATE.shiftKeyPressCount = 0;
        }
        window.setTimeout(
          function() {
            _cl_contentScript.STATE.shiftKeyPressCount = 0;
          },
          1000);
      }
    });

    /**
     * checking if and when user clicks on highlight
     */
    $(document).on({
      mouseup: function () {

        var firstSpan = $(this).prop('firstSpan');

        if (firstSpan && firstSpan.id && firstSpan.id.includes('cp-')) {
          for (var i = 0; i < _cl_contentScript.STATE.urlNotes[0].items.length; i++) {
            if (_cl_contentScript.STATE.urlNotes[0].items[i].itemId === firstSpan.id) {
              _cl_contentScript.STATE.activeNote = {
                itemId: firstSpan.id,
                note: _cl_contentScript.STATE.urlNotes[0].items[i].note,
                noteProperties: _cl_contentScript.STATE.urlNotes[0]
              };
              _cl_contentScript.toolkit.fireNoteToolkit();
              _cl_contentScript.toolkit.shrinkNoteSlot();
              break;
            }
          }
        }
      }
    }, "." + _cl_contentScript.highlightClassName);

  },

  // ===================================================== //
  // =================== CONSTANTS ======================= //
  // ===================================================== //

  CONST: {
    PANE_HTML: chrome.extension.getURL('/clipto.pane.html')
  },

  STATE: {
    shiftKeyPressCount: 0,
    activeHighlightColor: 'yellow',
    isPaneOpen: false,
    tempRange: undefined,
    user: undefined,
    urlNotes: [],

    activeNote: {itemId: undefined, noteProperties: undefined},

    cleanActiveNote: function () {
      this.activeNote = {
        itemId: undefined,
        noteProperties: undefined
      }
    },

    highlightData: {
      highlightText: undefined,
      highlightColor: this.activeHighlightColor,
      xpathRange: undefined,
      isValidHighlight: false,
      message: ''
    },

    cleanHighlightData: function () {
      this.highlightData = {
        highlightText: undefined,
        highlightColor: this.activeHighlightColor,
        xpathRange: undefined,
        isValidHighlight: false,
        message: ''
      }
    }
  },

  // ===================================================== //
  // =================== GLOBALS  ======================== //
  // ===================================================== //

  /**
   * just get it and make sure its decoded
   */
  getCurrentUrl: function () {
    var currUrl = decodeURIComponent(window.location.href);
    return _lc_utils.buildMatchString(currUrl).url;
  },

  /**
   * Get text selection range
   * @return {Range}. If the selection is collapsed, a fake collapsed range is created
   */
  getSelectionRange: function () {
    "use strict";
    var selection = window.getSelection();
    var range;

    if (selection.isCollapsed) {
      // a fake range
      range = new Range();
      range.collapse(false);
    } else {
      range = selection.getRangeAt(0);
    }

    return range;
  },

  insertCliptoPane: function () {
    if (!!document.getElementById("clipto-container")) {
      // do nothing
      console.log('clipto pane already loaded')
    } else {
      console.log('injecting clipto pane');
      var container = $('<div />', {id: 'clipto-container'}).appendTo(document.body),
        src = _cl_contentScript.CONST.PANE_HTML,
        iframe = $('<iframe />', {id: 'clipto-iframe', src: src, scrolling: false});
      container.append(iframe);
    }
  },

  // Each message request has a string message and an optional data object
  sendMessage: function (message_id, data) {
    var data = data || {};

    // send a message to "background.js"
    chrome.runtime.sendMessage({
      message_id: message_id,
      data: data
    })
  },

  /**
   * messages coming fron iframe
   * @param request
   */
  processDomMessage: function (request) {
    "use strict";

    console.log(request.message_id);

    switch (request.message_id) {
      case 'clipto-iframe-loaded':
        _cl_contentScript.message_routeToBackground(request.message_id, request.data);
        break;

      case 'clipto-create-new-note':
        _cl_contentScript.onPageCRUD(request.message_id, request.data, 'add');
        break;
      case 'clipto-update-note':
        _cl_contentScript.onPageCRUD(request.message_id, request.data, 'update');
        break;
      case 'clipto-delete-note':
        _cl_contentScript.onPageCRUD(request.message_id, request.data, 'remove');
        break;
      case 'clipto-google-analytics-event':
        _cl_contentScript.onGaEvent(request.message_id, request.data);
        break;

      case 'clipto-new-remote-user':
        _cl_contentScript.message_routeToBackground(request.message_id, request.data);
        break;
      case 'clipto-logout-user':
        _cl_contentScript.message_routeToBackground(request.message_id, request.data);
        break;
      case 'clipto-set-active-user':
        _cl_contentScript.message_routeToBackground(request.message_id, request.data);
        break;
      case 'clipto-user-authenticated':
        _cl_contentScript.message_routeToBackground(request.message_id, request.data);
        break;
      case 'clipto-get-page-data':
        _cl_contentScript.message_routeToBackground(request.message_id, {
          title: document.title,
          url: _cl_contentScript.getCurrentUrl()
        });
        break;
      // from guide page
      case 'clipto-guide-name-enter':
        _cl_contentScript.message_routeToBackground(request.message_id, request.data);
        break;
      case 'clipto-guide-sign-up':
        _cl_contentScript.message_routeToBackground(request.message_id, request.data);
        _cl_contentScript.openPane();
        break;
      case 'clipto-already-clipped':
        _cl_contentScript.mini_notifications.fireMiniNotification('already_clipped');
        break;

      case 'clipto-remove-highlight':
        _cl_contentScript.deleteHighlight(request.data);
        break;
      case 'clipto-scroll-to-highlight':
        _cl_contentScript.scrollToHighlight(request.data);
        break;
    }
  },

  /**
   * messages coming from background
   * @param request
   * @param sender
   * @param sendResponse
   */
  processRuntimeMessage: function (request, sender, sendResponse) {
    "use strict";
    var response;

    if (!request.message_id) return;

    switch (request.message_id) {
      case "clipto-create-highlight":
        // the caller specifies the id to use for the first span of the highlight,
        // so it can identify it to remove it later
        response = _cl_contentScript.createHighlight(request.range, request.highlightId, request.className, request.colorClassName) !== null;
        break;
      case "clipto-update_highlight":
        response = _cl_contentScript.updateHighlight(request.highlightId, request.classes);
        break;
      case "clipto-delete-highlight":
        response = _cl_contentScript.deleteHighlight(request.highlightId);
        break;
      case "clipto-scroll-to-highlight":
        response = _cl_contentScript.scrollToHighlight(request.data);
        break;
      case 'clipto-browser-action-clicked':
        _cl_contentScript.onBrowserActionClick();
        break;
      case 'clipto-close-pane':
        _cl_contentScript.onClosePane();
        break;
      case 'cp-get-document-title':
        response = document.title;
        break;
      case 'new-pane-init-data':
        _cl_contentScript.STATE.user = request.data.user;
        _cl_contentScript.STATE.urlNotes = request.data.urlNotes;
        break;
    }
    sendResponse(response);
  },

  /**
   * opens the pane
   */
  openPane: function () {
    if (!_cl_contentScript.STATE.isPaneOpen) {
      _cl_contentScript.hideToolkit();
      //_cl_pageResize.shrinkPage();
      $("#clipto-container").addClass('pane-open').removeClass('pane-closed');
      _cl_contentScript.STATE.isPaneOpen = true;
      _cl_contentScript.message_routeToBackground('clipto-pane-open', null);
    }
  },

  /**
   * closes the pane
   * TODO: do it by changing class name, so we can use transitions
   */
  closePane: function () {
    $("#clipto-toolkit-wrapper").removeClass('cp-toolkit-wrapper-closed');
    //_cl_pageResize.expandPage();
    $("#clipto-container").addClass('pane-closed').removeClass("pane-open");
    _cl_contentScript.STATE.isPaneOpen = false;
  },

  /**
   * hide the toolkit -
   * on pane open, fullscreen mode
   */
  hideToolkit: function () {
    $("#clipto-toolkit-wrapper").addClass('cp-toolkit-wrapper-closed');
  },

  /**
   * hide the toolkit -
   * on pane open, fullscreen mode
   */
  showToolkit: function () {
    $("#clipto-toolkit-wrapper").removeClass('cp-toolkit-wrapper-closed');
  },

  /**
   * user activated the highlighter by clicking double shift,
   * or clicking on the yellow toolkit finger
   */
  activateHighlighter: function () {
    console.log('activateHighlighter');
    //check if user exists
    if (_cl_contentScript.STATE.user && _cl_contentScript.STATE.user !== null) {
      //check if valid highlight
      if (_cl_contentScript.STATE.highlightData.isValidHighlight) {
        _cl_contentScript.STATE.highlightData.message = 'toolkit-new-highlight';
        _cl_contentScript.STATE.highlightData.highlightColor = _cl_contentScript.STATE.activeHighlightColor;

        console.log('_cl_contentScript.STATE.highlightData');
        console.log(_cl_contentScript.STATE.highlightData);

        _cl_contentScript.message_routeToBackground('clipto-on-mouseup', _cl_contentScript.STATE.highlightData);
        _cl_contentScript.toolkit.expandNoteSlot();
      }
      else {
        _cl_contentScript.mini_notifications.fireMiniNotification("empty_highlight_selection");
      }
    }
    else {
      _cl_contentScript.mini_notifications.fireMiniNotification("login");
    }
    _cl_contentScript.toolkit.shrinkHighlightSlot();
    _cl_contentScript.STATE.cleanHighlightData();
  },

  /**
   * Highlight part of the DOM, identified by the selection
   * @param xpathRange
   * @param id id to set on the first span of the highlight
   * @param className
   * @return {*} span of highlight list, or null on error
   */
  createHighlight: function (xpathRange, id, className, colorClassName) {
    "use strict";

    var range;

    // check if highlight already in DOM
    if ($("#" + id).length === 0) {
      console.log('creating highlight : ' + id);
      // this is likely to cause exception when the underlying DOM has changed
      try {
        range = _xpath.createRangeFromXPathRange(xpathRange);
      } catch (err) {
        console.log("Exception parsing xpath range: " + err.message);
        return null;
      }
      if (!range) {
        return null;
      }
      // create span(s), with class names
      return _highlighter.create(range, id, [
        _cl_contentScript.highlightClassName,
        className,
        colorClassName
      ]);
    }
    else {
      // highlight already in DOM, do nothing.
      console.log('highlight already in DOM : ' + id);
    }
  },

  /**
   * Update the class name for all the spans of a highlight
   * @param id existing highlight id
   * @param classes class names to replace
   */
  updateHighlight: function (id, classes) {
    // remember to also include the shared highlights class name
    "use strict";
    classes.push(_cl_contentScript.highlightClassName);
    return _highlighter.update(id, classes);
  },

  /**
   * Delete a previously created highlight
   * @param {string} highlightId id of the first element of the list of spans that a highlight consists of.
   */
  deleteHighlight: function (highlightId) {
    "use strict";
    return _highlighter.del(highlightId)
  },

  /**
   * Scroll DOM to top of an element
   * @param {Object} selector element selector
   * @return {boolean} true if selector matched an element
   */
  scrollToHighlight: function (data) {
    "use strict";

    var selector = "#" + data.highlightId,
      url = data.url,
      currentUrl = _cl_contentScript.getCurrentUrl();

    console.log(url);
    console.log(currentUrl);

    if (_lc_utils.isUrlsMatch(url,currentUrl)) {
      //_cl_contentScript.openPane();
      var $elm = $(selector);
      if ($elm) {
        $('body').animate({
          'scrollTop': $elm.offset().top - 50
        }, 'slow');
      }
      return $elm !== null;
    }
    else {
      _cl_contentScript.sendMessage('clipto-open-page-and-scroll-to-highlight', data);
    }
  },

  /**
   * find out if an element is a clipto app element
   * @param e
   * @returns {boolean}
   */
  isCliptoElement: function (e) {

    e = e || window.event;

    var isCliptoClass = false;
    var isCliptoId = false;

    var element = (e.target || e.srcElement);
    var elClassList = element.className.split(/\s+/);
    var parentElsIds = $(element).parents()
      .map(function () {
        return this.id;
      });

    for (var i = 0; i < elClassList.length; i++) {
      if (elClassList[i].includes('cp-')) {
        isCliptoClass = true;
        break;
      }
    }

    for (var i = 0; i < parentElsIds.length; i++) {
      if (parentElsIds[i].includes('cp-')) {
        isCliptoId = true;
        break;
      }

    }

    return isCliptoClass || isCliptoId;
  },

  // ===================================================== //
  // =================== EVENTS ========================== //
  // ===================================================== //

  onMouseup: function (e) {

    console.log('onMouseup');

    var elementId = (e.target || e.srcElement).id;
    var parentId = $(e.target).parent().attr('id');

    var isCliptoEl = _cl_contentScript.isCliptoElement(e);

    if (isCliptoEl) {
      // toolkit button was clicked
      var id = elementId ? elementId : parentId;

      switch (id) {

        case 'cp-toolkit-open-app' :
          _cl_contentScript.openPane();
          break;
        case 'cp-toolkit-add-note' :
          _cl_contentScript.toolkit.onAddNoteClick();
          break;
        case 'cp-toolkit-add-highlight' :
          _cl_contentScript.toolkit.onAddHighlightClick();
          break;
        case 'cp-toolkit-add-page' :
          _cl_contentScript.toolkit.onAddPageClick();
          break;
        default:
          console.log('not clipto element');
          break;

      }

    }
    else {
      // click on page, no toolkit
      var selectionRange = _cl_contentScript.getSelectionRange();

      if (!selectionRange.collapsed) {
        _cl_contentScript.toolkit.removeNoteToolkit();
        // User selection is not empty
        if (!_lc_utils.isEditable(document.activeElement)) {
          // expand highlight slot
          _cl_contentScript.toolkit.expandHighlightSlot();
          _cl_contentScript.toolkit.shrinkNoteSlot();

          _cl_contentScript.STATE.highlightData = {
            highlightText: window.getSelection().toString(),
            xpathRange: _xpath.createXPathRangeFromRange(selectionRange),
            isValidHighlight: true,
            message: "New highlight"
          };
          _cl_contentScript.message_routeToBackground('clipto-on-mouseup', _cl_contentScript.STATE.highlightData);
        } else {
          _cl_contentScript.STATE.highlightData.message = "Editable field";
          _cl_contentScript.message_routeToBackground('clipto-on-mouseup', _cl_contentScript.STATE.highlightData);
        }
      } else {

        // Empty selection
        // if none of the fingers clicked,
        // shrink back the toolkit highlight and note slots
        _cl_contentScript.toolkit.shrinkHighlightSlot();
        _cl_contentScript.toolkit.shrinkNoteSlot();
        _cl_contentScript.toolkit.removeNoteToolkit();

        _cl_contentScript.STATE.cleanHighlightData();
        _cl_contentScript.STATE.cleanActiveNote();

        _cl_contentScript.STATE.highlightData.message = "Empty selection";
        _cl_contentScript.message_routeToBackground('clipto-on-mouseup', _cl_contentScript.STATE.highlightData);
        _cl_contentScript.onClosePane()
      }
    }
  },

  /**
   * when user clicks on browser action button
   * if there is a user selection
   */
  onBrowserActionClick: function () {
    if (_cl_contentScript.STATE.isPaneOpen) {
      _cl_contentScript.closePane();
    } else {
      _cl_contentScript.openPane();
    }
  },

  onClosePane: function () {
    if (_cl_contentScript.STATE.isPaneOpen) {
      _cl_contentScript.closePane();
    }
  },

  // messages coming from iframes and the current webpage
  onDomMessage: function (event) {
    if (!event.data.message_id) return;

    _cl_contentScript.processDomMessage(event.data);
  },

  // messages coming from "background.js"
  onBackgroundMessage: function (request, sender, sendResponse) {
    if (!request.message_id) return;

    _cl_contentScript.processRuntimeMessage(request, sender, sendResponse);
  },

  /**
   * listen to page resize for full screen mode
   */
  onPageResize: function () {
    if (screen.width === window.innerWidth && screen.height === window.innerHeight) {
      // this is full screen
      _cl_contentScript.hideToolkit();
    } else {
      _cl_contentScript.showToolkit();
    }
  },

  /**
   * in case of google analytics event fired from app,
   * route to background if pane is open
   */
  onGaEvent: function (message_id, data) {
    if (data.eventCategory === 'toolkit' || _cl_contentScript.STATE.isPaneOpen) {
      _cl_contentScript.message_routeToBackground(message_id, data);
    }
  },

  /**
   * called on page create / updated / deleted
   * (also on each new note or item change on page)
   *
   * @param message_id
   * @param data
   * @param action
   */
  onPageCRUD: function (message_id, data, action) {

    var url = data.noteProperties.url;
    var currentUrl = _cl_contentScript.getCurrentUrl();

    if (url && currentUrl && _lc_utils.isUrlsMatch(url, currentUrl)) {
      switch (action) {

        case "add" :

          if (!_cl_contentScript.STATE.urlNotes.length || _cl_contentScript.STATE.urlNotes.length === 0) {
            _cl_contentScript.STATE.urlNotes = [data.noteProperties];

            if (data.origin && data.origin === 'toolkit') {
              _cl_contentScript.mini_notifications.fireMiniNotification("clipped");
              _cl_contentScript.STATE.activeNote = {itemId: data.itemId, noteProperties: data.noteProperties};
            }
          }
          // if page already clipped app will fire event accordingly "already_clipped"
          break;

        case "update" :

          _cl_contentScript.STATE.urlNotes = [data.noteProperties];

          if (data.origin && data.origin === 'toolkit') {
            _cl_contentScript.mini_notifications.fireMiniNotification("clipped");
            _cl_contentScript.STATE.activeNote = {itemId: data.itemId, noteProperties: data.noteProperties};
          }
          // if page already clipped app will fire event accordingly "already_clipped"
          break;

        case "remove" :
          _cl_contentScript.STATE.urlNotes = [];
          _cl_contentScript.STATE.cleanActiveNote();
          break;
      }
    }

    _cl_contentScript.message_routeToBackground(message_id, data);
  },

  //******************** MESSAGES **********************************//

  // just deliver the message to background page
  message_routeToBackground: function (message_id, data) {
    _cl_contentScript.sendMessage(message_id, data);
  }


};

_cl_contentScript.init();