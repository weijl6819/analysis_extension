_cl_contentScript.mini_notifications = {

  // ===================================================== //
  // ============ CONSTANTS ============================== //
  // ===================================================== //
  CONST: {
    //NOTIFICATIONS_JSON: chrome.extension.getURL('/notifications.json')
    LOGO_ICON: chrome.extension.getURL('icons/16.png'),
  },

  // ===================================================== //
  // ============ MINI NOTIFICATION HTML ====================== //
  // ===================================================== //
  miniNotificationHtml:

  '<div class="cp-mimi-notification-wrapper">' +
    '<div class="cp-mini-notification-body">' +
      '<div class="cp-mini-notification-title"></div>' +
    '</div>' +
  '</div>',

  // ===================================================== //
  // ============ NOTIFICATIONS JSON ===================== //
  // ===================================================== //
  MINI_NOTIFICATIONS_JSON: {
    "login": {
      "title": "Please login first"
    },
    "empty_highlight_selection": {
      "title": "Please mark some text first",
      "time": 3000
    },
    "clipped": {
      "title": "Clipped"
    },
    "deleted": {
      "title": "Deleted"
    },
    "already_clipped": {
      "title": "Already clipped"
    },
    "highlight_clipped": {
      "title": "Highlight clipped"
    },
    "highlight_clipped_with_page": {
      "title": "Highlight clipped on page"
    },
    "note_clipped": {
      "title": "Note clipped on page"
    },
    "note_clipped_to_highlight": {
      "title": "Note clipped to highlight"
    }

  },

  openMiniNotification: function (id) {
    $('#cp-mini-notification-'+id).removeClass('cp-notification-close').addClass('cp-notification-open')
  },

  closeMiniNotification: function (id) {
    $('#cp-mini-notification-'+id).removeClass('cp-notification-open').addClass('cp-notification-close')
  },

  /**
   * fill in the notification tamplate with the relevant notification by id
   * @param id
   */
  fillMiniNotification: function (id) {
    var json = this.MINI_NOTIFICATIONS_JSON;
    var notification = json[id];
    var logoIcon = this.CONST.LOGO_ICON;

    // UI
    //$('.cp-mini-notification-logo').append('<img class="cp-mini-notification-logo"/>');
    //$('.cp-mini-notification-logo').attr("src", logoIcon);

    $('.cp-mini-notification-title').append(document.createTextNode(notification.title));
  },

  /**
   * helper function to inject notification into the DOM
   */
  insertCliptoMiniNotification: function (id) {

    $('<div />', {id: "cp-mini-notification-" + id})
      .addClass('cp-mini-notification-wrapper')
      .html(this.miniNotificationHtml).appendTo(document.body);
  },

  /**
   * builds and injects the notification
   * @param id
   */
  fireMiniNotification: function (id) {
    if (!!document.getElementById("cp-mini-notification-" + id)) {
      // do nothing
    } else {
      this.insertCliptoMiniNotification(id);
      this.fillMiniNotification(id);
      this.openMiniNotification(id);
      // set timeout to remove notification automatically after 2.5 sec
      var time = this.MINI_NOTIFICATIONS_JSON[id].time || 3000;
      window.setTimeout(
        function() {_cl_contentScript.mini_notifications.removeMiniNotification(id)},
        time);
    }
  },

  /**
   * removes notification from DOM
   * @param id
   */
  removeMiniNotification: function (id) {
    if (!!document.getElementById("cp-mini-notification-" + id)) {
      $("#cp-mini-notification-" + id).remove()
    } else {
      // do nothing
    }
  }

};
