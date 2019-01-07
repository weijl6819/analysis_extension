_cl_contentScript.notifications = {

  // ===================================================== //
  // ============ CONSTANTS ============================== //
  // ===================================================== //
  CONST: {
    //NOTIFICATIONS_JSON: chrome.extension.getURL('/notifications.json')
    LOGO_ICON: chrome.extension.getURL('icons/16.png'),
    CLOSE_ICON: chrome.extension.getURL('icons/delete16.png')
  },

  // ===================================================== //
  // ============ NOTIFICATION HTML ====================== //
  // ===================================================== //
  notificationHtml:
  '<div class="cp-notification-header-wrapper">' +
    '<div class="cp-notification-header">' +

      '<div class="cp-notification-logo-wrapper">' +
        //'<div class="cp-notification-logo">' + '</div>' +
      '</div>' +

      '<div class="cp-notification-title-wrapper">' +
        '<div class="cp-notification-title">' + '</div>' +
      '</div>' +

      '<div class="cp-notification-close-wrapper">' +
        //'<div class="cp-notification-close">' + '</div>' +
      '</div>' +

    '</div>' +
  '</div>' +


  '<div class="cp-notification-body-wrapper">' +
    '<div class="cp-notification-body">' + '</div>' +
  '</div>' +

  '<div class="cp-notification-footer-wrapper">' +
    '<div class="cp-notification-footer">' +

      '<div class="cp-notification-decline-wrapper">' +
        '<div class="cp-notification-decline">' + '</div>' +
      '</div>' +

      '<div class="cp-notification-accept-wrapper">' +
        '<div class="cp-notification-accept">' + '</div>' +
      '</div>' +

    '</div>' +
  '</div>',

  // ===================================================== //
  // ============ NOTIFICATIONS JSON ===================== //
  // ===================================================== //
  NOTIFICATIONS_JSON: {
    "login": {
      "title": "Hey There",
      "body": "Seems like you are logged out. \n Please log in first.",
      "accept": "Take me in!",
      "accept_action": "openPane"
    },
    "offline": {
      "title": "You're Offline",
      "body": "Seems like you're offline. '\n' Please reconnect and try again.",
      "accept": "OK",
      "accept_action": "notifications.closeNotification"
    },
    "empty_highlight_selection": {
      "title": "Highlight? No Problem",
      "body": "Mark some text and then click 'clip highlight' again.",
      "accept": "OK",
      "accept_action": "notifications.closeNotification"
    },
    "note_will_not_be_saved": {
      "title": "Discard This Note?",
      "body": "Really exit without saving this note?",
      "accept": "Keep",
      "accept_action": "notifications.closeNotification",
      "decline": "Discard",
      "decline_action": "toolkit.hardRemoveNoteToolkit"

    }
  },

  openNotification: function (id) {
    $('#cp-notification-'+id).removeClass('cp-notification-close').addClass('cp-notification-open')
  },

  closeNotification: function (id) {
    $('#cp-notification-'+id).removeClass('cp-notification-open').addClass('cp-notification-close')
  },

  /**
   * fill in the notification tamplate with the relevant notification by id
   * @param id
   */
  fillNotification: function (id) {
    var json = this.NOTIFICATIONS_JSON;
    var notification = json[id];
    var logoIcon = this.CONST.LOGO_ICON;
    var closeIcon = this.CONST.CLOSE_ICON;

    // UI
    $('.cp-notification-logo-wrapper').append('<img class="cp-notification-logo"/>');
    $('.cp-notification-logo').attr("src", logoIcon);

    $('.cp-notification-close-wrapper').append('<img class="cp-notification-close"/>');
    $('.cp-notification-close').attr("src", closeIcon);

    $('.cp-notification-title').append(document.createTextNode(notification.title));
    $('.cp-notification-body').append(document.createTextNode(notification.body));

    if (notification.decline && notification.decline.length) {
      $('.cp-notification-decline').append(document.createTextNode(notification.decline));
    }
    if (notification.accept && notification.accept.length) {
      $('.cp-notification-accept').append(document.createTextNode(notification.accept));
    }

    // Actions
    var actionFn = function (ac) {
      var action = ac+'_action';
      if (notification[action] !== undefined) {
        var fn = _cl_contentScript.notifications.parseAction(notification[[action]]);
        fn();
        _cl_contentScript.notifications.closeNotification(id);
        _cl_contentScript.notifications.removeNotification(id);
      }
    };

    $('.cp-notification-close').bind("click", function () {
      _cl_contentScript.notifications.closeNotification(id);
      _cl_contentScript.notifications.removeNotification(id);
    });

    $('.cp-notification-decline').bind("click", function () {
      actionFn('decline');
    });

    $('.cp-notification-accept').bind("click", function () {
      actionFn('accept');
    });

    //// On enter keypress when on notification - save the note
    //$('.cp-notification-accept').keypress(function (e) {
    //  if (e.which == '13') {
    //    actionFn('accept');
    //  }
    //});
    //
    //$('.cp-notification-accept').focus();
  },

  /**
   * helper function to construct a function from a string (on _cl_contentScript)
   * SEE https://www.sitepoint.com/call-javascript-function-string-without-using-eval/
   * @param stringAction
   * @returns {_cl_contentScript}
   */
  parseAction: function (stringAction) {
    var arr = stringAction.split('.');
    var fn = _cl_contentScript;
    for (var i=0 ; i<arr.length ; i++) {
      fn = fn[arr[i]]
    }
    return fn;
  },

  /**
   * helper function to inject notification into the DOM
   */
  insertCliptoNotification: function (id) {

    $('<div />', {id: "cp-notification-" + id})
      .addClass('clipto-notification-wrapper')
      .html(this.notificationHtml).appendTo(document.body);
  },

  /**
   * builds and injects the notification
   * @param id
   */
  fireNotification: function (id) {
    console.log('fire ' + id);
    if (!!document.getElementById("cp-notification-" + id)) {
      // do nothing
    } else {
      this.insertCliptoNotification(id);
      this.fillNotification(id);
      this.openNotification(id);
      // set timeout to remove notification automatically after 5 sec without hover
      window.setTimeout(
        function() {_cl_contentScript.notifications.removeNotification(id)},
        6000);
    }
  },

  /**
   * removes notification from DOM
   * @param id
   */
  removeNotification: function (id) {
    console.log('removeNotification');
    if (!!document.getElementById("cp-notification-" + id)) {
      console.log('removing ' + id);
      $("#cp-notification-" + id).remove()
    } else {
      // do nothing
    }
  }

};
