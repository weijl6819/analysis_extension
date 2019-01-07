_cl_contentScript.toolkit = {


  // constants ----------------------------------------------------------------
  CONST: {
    //TOOLKIT_HTML: chrome.extension.getURL('/clipto.toolkit.html'),
    LOGO_ICON: chrome.extension.getURL('icons/16.png'),
    CLOSE_ICON: chrome.extension.getURL('icons/delete16-gray.png'),
  },

  // ===================================================== //
  // ================ Fingers Toolkit ==================== //
  // ===================================================== //

  toolkitHtml: '<div class="cp-toolkit-tools-wrapper">' +
  '<div class="cp-toolkit-slot">' +
  '<div class="cp-toolkit-slot-inner" id="cp-toolkit-open-app"><p class="cp-toolkit-slot-text">Open ClipTo</p></div>' +
  '</div>' +
  '<div class="cp-toolkit-slot">' +
  '<div class="cp-toolkit-slot-inner" id="cp-toolkit-add-highlight"><p class="cp-toolkit-slot-text">Clip Highlight</p></div>' +
  '</div>' +
  '<div class="cp-toolkit-slot">' +
  '<div class="cp-toolkit-slot-inner" id="cp-toolkit-add-page"><p class="cp-toolkit-slot-text">Clip Page</p></div>' +
  '</div>' +
  '<div class="cp-toolkit-slot">' +
  '<div class="cp-toolkit-slot-inner" id="cp-toolkit-add-note"><p class="cp-toolkit-slot-text">Clip Note</p></div>' +
  '</div>' +
    //'<div id="cp-toolkit-actions" class="cp-toolkit-slot"></div>' +
  '</div>',

  //'<div class="cp-toolkit-tools-wrapper">' +
  //'<div id="cp-toolkit-open-app" class="cp-toolkit-slot"><p class="cp-toolkit-slot-text">Open ClipTo</p></div>' +
  //'<div id="cp-toolkit-add-highlight" class="cp-toolkit-slot"><p class="cp-toolkit-slot-text">Clip Highlight</p></div>' +
  //'<div id="cp-toolkit-add-page" class="cp-toolkit-slot">' +
  //'<p class="cp-toolkit-slot-text">Clip Page</p>' +
  //'</div>' +
  //'<div id="cp-toolkit-add-note" class="cp-toolkit-slot"><p class="cp-toolkit-slot-text">Clip Note</p></div>' +
  //  //'<div id="cp-toolkit-actions" class="cp-toolkit-slot"></div>' +
  //'</div>',

  init: function () {

    this.appendFontsToPage();
    this.insertCliptoToolkit();

    $(document).on("mouseenter", "#clipto-toolkit-wrapper", function () {
      $("#clipto-toolkit-wrapper").removeClass("cp-toolkit-wrapper-shrink").addClass("cp-toolkit-wrapper-expand");
    });

    $(document).on("mouseleave", "#clipto-toolkit-wrapper", function () {
      $("#clipto-toolkit-wrapper").removeClass("cp-toolkit-wrapper-expand").addClass("cp-toolkit-wrapper-shrink");
    });

    $(document).on("mouseenter", "#cp-toolkit-open-app, #cp-toolkit-add-highlight, #cp-toolkit-add-page, #cp-toolkit-add-note", function () {
      $("#" + this.id).removeClass("cp-toolkit-slot-shrink").addClass("cp-toolkit-slot-expand");
    });

    $(document).on("mouseleave", "#cp-toolkit-open-app, #cp-toolkit-add-highlight, #cp-toolkit-add-page, #cp-toolkit-add-note", function () {
      $("#" + this.id).removeClass("cp-toolkit-slot-expand").addClass("cp-toolkit-slot-shrink");
    });

  },

  appendFontsToPage: function () {
    //$("head").append('<link href="https://fonts.googleapis.com/css?family=Kaushan+Script" rel="stylesheet">');
    $("head").append('<link href="https://fonts.googleapis.com/css?family=Arimo" rel="stylesheet">');
    $("head").append('<link href="https://fonts.googleapis.com/css?family=Cinzel" rel="stylesheet">');

  },

  insertCliptoToolkit: function () {
    if (!!document.getElementById("clipto-toolkit-wrapper")) {
      // do nothing
    } else {
      //injecting clipto toolkit
      var toolkit = $('<div />', {id: 'clipto-toolkit-wrapper'}).html(_cl_contentScript.toolkit.toolkitHtml);
      toolkit.appendTo(document.body);
      //$('.cp-toolkit-slot').css('background-image', 'url(' + _cl_contentScript.toolkit.CONST.SLOT_BG + ')');
    }
  },

  /**
   * when user click clip page
   * just route to app, when it comes back we'll show notification and stuff
   */
  onAddPageClick: function () {
    //check if user exists
    if (_cl_contentScript.STATE.user && _cl_contentScript.STATE.user !== null) {
      _cl_contentScript.message_routeToBackground('clipto-toolkit-clip-page', {});
      _cl_contentScript.toolkit.expandNoteSlot();
    }
    else {
      _cl_contentScript.mini_notifications.fireMiniNotification("login");
    }
  },

  /**
   * when user clicks clip highlight
   */
  onAddHighlightClick: function () {
    _cl_contentScript.activateHighlighter();
  },

  /**
   * when user clicks clip note finger
   */
  onAddNoteClick: function () {
    //check if user exists
    if (_cl_contentScript.STATE.user && _cl_contentScript.STATE.user !== null) {
      _cl_contentScript.toolkit.removeNoteToolkit();
      _cl_contentScript.toolkit.shrinkNoteSlot();
      _cl_contentScript.toolkit.fireNoteToolkit();
    }
    else {
      _cl_contentScript.mini_notifications.fireMiniNotification("login");
    }
  },

  /**
   * when user clicks clip note finger
   */
  onHighlightClick: function (e) {
    //check if user exists (not supposed to show highlight if no user, but anyway..)
    if (_cl_contentScript.STATE.user && _cl_contentScript.STATE.user !== null) {
      console.log("YO HIGHLIGHT HERE")
    }
    else {
      _cl_contentScript.mini_notifications.fireMiniNotification("login");
    }
  },

  /**
   * expand toolkit highlight slot
   */
  expandHighlightSlot: function () {
    $("#cp-toolkit-add-highlight")
      .removeClass('cp-toolkit-slot-shrink')
      .addClass('cp-toolkit-slot-active')
      .addClass('cp-toolkit-slot-active-highlight');
  },

  /**
   * expand toolkit note slot
   */
  expandNoteSlot: function () {
    $("#cp-toolkit-add-note")
      .removeClass('cp-toolkit-slot-shrink')
      .addClass('cp-toolkit-slot-active')
      .addClass('cp-toolkit-slot-active-note');
  },

  /**
   * shrink toolkit note slot
   */
  shrinkHighlightSlot: function () {
    $("#cp-toolkit-add-highlight")
      .removeClass('cp-toolkit-slot-active')
      .removeClass('cp-toolkit-slot-active-highlight')
      .removeClass("cp-toolkit-slot-expand")
      .addClass("cp-toolkit-slot-shrink");
  },

  /**
   * shrink toolkit note slot
   */
  shrinkNoteSlot: function () {
    $("#cp-toolkit-add-note")
      .removeClass('cp-toolkit-slot-active')
      .removeClass('cp-toolkit-slot-active-note')
      .removeClass("cp-toolkit-slot-expand")
      .addClass("cp-toolkit-slot-shrink");
  },

  // ===================================================== //
  // =================== note Toolkit ==================== //
  // ===================================================== //

  toolkitNoteHtml: '<div id="cp-toolkit-note-expandable" class="cp-toolkit-note-wrapper cp-toolkit-note-wrapper-collapsed">' +

  '<div class="cp-toolkit-note-header-wrapper">' +
  '<div class="cp-toolkit-note-header">' +

  '<div class="cp-toolkit-note-title">' +
  '</div>' +

  '<div class="cp-toolkit-note-highlight-colors-wrapper">' +
  '</div>' +

    //'<div class="cp-toolkit-note-close-wrapper">' +
    //'</div>' +

  '</div>' +
  '</div>' +


  '<div class="cp-toolkit-note-body-wrapper">' +
  '<div class="cp-toolkit-note-body">' +
  '<textarea class="cp-toolkit-note-textarea cp-no-border" placeholder="Add Note ..."/>' +
  '</div>' +
  '</div>' +

  '<div class="cp-toolkit-note-footer-wrapper">' +
  '<div class="cp-toolkit-note-footer">' +

  '<div class="cp-toolkit-note-footer-button-wrapper cp-toolkit-note-remove-wrapper">' +
  '<div class="cp-toolkit-note-footer-button cp-toolkit-note-remove">' +
  'delete' +
  '</div>' +
  '</div>' +
  '<div class="cp-toolkit-note-footer-button-wrapper cp-toolkit-note-save-wrapper">' +
  '<div class="cp-toolkit-note-footer-button cp-toolkit-note-save">' +
  'save' +
  '</div>' +
  '</div>' +

  '</div>' +
  '</div>' +

  '</div>',

  toolkitNoteColorsDiv: '<div id="cp-toolkit-note-highlight-color-yellow" class="cp-toolkit-note-highlight-color cp-highlight-text-yellow">' +
  '</div>' +
  '<div id="cp-toolkit-note-highlight-color-green" class="cp-toolkit-note-highlight-color cp-highlight-text-green">' +
  '</div>' +
  '<div id="cp-toolkit-note-highlight-color-red" class="cp-toolkit-note-highlight-color cp-highlight-text-red">' +
  '</div>' +
  '<div id="cp-toolkit-note-highlight-color-blue" class="cp-toolkit-note-highlight-color cp-highlight-text-blue">' +
  '</div>',

  fillNoteToolkit: function (id) {

    if (!!document.getElementById("cp-toolkit-note-wrapper")) {
      $('.cp-toolkit-note-textarea').val(_cl_contentScript.STATE.activeNote.note);
    } else {
      var $noteTemplate = $('<div />', {id: 'cp-toolkit-note-wrapper'}).html(_cl_contentScript.toolkit.toolkitNoteHtml);

      //var closeIcon = this.CONST.CLOSE_ICON;

      // UI
      //$('.cp-toolkit-note-close-wrapper').append('<img class="cp-toolkit-note-close" src=""/>');
      //$('.cp-toolkit-note-close').attr("src", _cl_contentScript.toolkit.CONST.DELETE_ICON);

      if (_cl_contentScript.STATE.activeNote.itemId) {
        $noteTemplate.find('.cp-toolkit-note-title').append(document.createTextNode("clip note to highlight"));
        $noteTemplate.find('.cp-toolkit-note-highlight-colors-wrapper').append(_cl_contentScript.toolkit.toolkitNoteColorsDiv)
      } else {
        $noteTemplate.find('.cp-toolkit-note-title').append(document.createTextNode("clip note to page"));
      }

      if (_cl_contentScript.STATE.activeNote.note) {
        $noteTemplate.find('.cp-toolkit-note-textarea').append(document.createTextNode(_cl_contentScript.STATE.activeNote.note));
      }

      // Actions
      $noteTemplate.find('.cp-toolkit-note-close').bind("click", function () {
        _cl_contentScript.toolkit.removeNoteToolkit();
      });

      $noteTemplate.find('.cp-toolkit-note-highlight-color').bind("click", function () {
        var id = $(this).attr('id');
        var color = id.split('cp-toolkit-note-highlight-color-')[1];
        _cl_contentScript.toolkit.changeHighlightStatus({color: color, isActive: true, isUpdateDb: true});
      });

      // On enter keypress when on textarea - save the note
      $noteTemplate.find('.cp-toolkit-note-textarea').keydown(function (e) {

        //console.log($(this).val());
        //
        //if ($(this).val().length === 0) {
        //  $('.cp-toolkit-note-save').removeClass('cp-toolkit-note-save-active')
        //} else {
        //  $('.cp-toolkit-note-save').addClass('cp-toolkit-note-save-active')
        //}

        if (e.keyCode === 13 || e.which === 13) {
          if (e.shiftKey) {
            // nothing to do. jump line automatically by chrome
          } else {
            _cl_contentScript.toolkit.saveToolkitNote();
          }
        }
      });

      // On save click - save the note
      $noteTemplate.find('.cp-toolkit-note-save').bind("click", function () {
        _cl_contentScript.toolkit.saveToolkitNote();
      });

      // On remove click - remove highlight and its note
      $noteTemplate.find('.cp-toolkit-note-remove').bind("click", function () {
        _cl_contentScript.toolkit.deleteHighlightAndNoteItem();
      });

      return $noteTemplate;
    }

  },

  /**
   * when called, shows the note toolkit
   */
  fireNoteToolkit: function () {
    this.insertNoteToolkit(this.fillNoteToolkit());
    if (_cl_contentScript.STATE.activeNote.itemId) {
      this.changeHighlightStatus({isActive: true});
    }
    $('.cp-toolkit-note-textarea').focus();
  },

  closeNoteToolkit: function () {
    $('#cp-toolkit-note-expandable').removeClass('cp-toolkit-note-wrapper-expand').addClass('cp-toolkit-note-wrapper-collapsed');
  },

  insertNoteToolkit: function (noteTemplate) {
    if (!!document.getElementById("cp-toolkit-note-wrapper")) {
      // do nothing
    } else {
      noteTemplate.appendTo(document.body);
      window.setTimeout(
        function () {
          $('#cp-toolkit-note-expandable')
            .removeClass('cp-toolkit-note-wrapper-collapsed').addClass('cp-toolkit-note-wrapper-expand')
          $('.cp-toolkit-note-textarea').focus();
        },
        300);
    }
  },

  /**
   * remove it completely from DOM, to prevent duplicates
   */
  removeNoteToolkit: function () {

    if (!!document.getElementById("cp-toolkit-note-wrapper")) {
      if (_cl_contentScript.STATE.activeNote.itemId) {
        this.changeHighlightStatus({isActive: false});
        _cl_contentScript.STATE.cleanActiveNote();
      }
      this.closeNoteToolkit();
      window.setTimeout(
        function () {
          $("#cp-toolkit-note-wrapper").remove();
        },
        350);
    } else {
      // do nothing
    }
  },


  /**
   * save the toolkit note on relevant itemId
   * by just updating it
   */
  saveToolkitNote: function () {
    var itemId = _cl_contentScript.STATE.activeNote.itemId,
      noteProperties = _cl_contentScript.STATE.activeNote.noteProperties,
      note = $(".cp-toolkit-note-textarea").val(),
      user = _cl_contentScript.STATE.user;

    var data = {
      noteProperties: noteProperties, // will be used on update only (note on highlight)
      isSync: true, // will be used on update only (note on highlight)
      note: note, // will be used on note on page only
      message: "toolkit-new-note",
      user: user
    };

    var item = itemId ? _lc_utils.findObjectInArrayOfObjects(noteProperties.items, 'itemId', itemId) : undefined;

    // in case of note on highlight
    if (item) {
      item.note = note;
      _cl_contentScript.sendMessage('clipto-update-note', data);
      _cl_contentScript.sendMessage('clipto-google-analytics-event', {
        hitType: 'event',
        eventCategory: 'clip',
        eventAction: 'clipNote',
        eventValue: 2
      });
      _cl_contentScript.mini_notifications.fireMiniNotification("clipped");
    }
    // in case of note on page
    else {
      _cl_contentScript.sendMessage('clipto-add-note-to-page', data);
    }

    // clean up
    this.removeNoteToolkit();
    this.shrinkNoteSlot();
    _cl_contentScript.STATE.cleanActiveNote(); // has to be after removeNoteToolkit, because color change relies on activeNote
  },

  /**
   * change highlight status - such as color or active or not
   * TODO: this goes to event page and stops there. app doesn't know about the color change. ( will need to know soon, and consistancy is a good idea
   * @param options (color, isUpdateDb, isActive)
   */
  changeHighlightStatus: function (options) {

    var options = options || {},
      color = options.color,
      isUpdateDb = options.isUpdateDb,
      isActive = options.isActive;

    var itemId = _cl_contentScript.STATE.activeNote.itemId,
      noteProperties = _cl_contentScript.STATE.activeNote.noteProperties,
      user = _cl_contentScript.STATE.user;

    _cl_contentScript.STATE.activeHighlightColor = color ? color : _cl_contentScript.STATE.activeHighlightColor;

    var item = itemId ? _lc_utils.findObjectInArrayOfObjects(noteProperties.items, 'itemId', itemId) : undefined;

    if (item) {
      item.highlightColor = color ? color : item.highlightColor;
    }

    var data = {
      noteProperties: noteProperties,
      user: user,
      isSync: false, // do not sync with remote db on saving
      itemId: itemId,
      color: item && item.highlightColor ? item.highlightColor : undefined,
      isActive: isActive,
      isUpdateDb: isUpdateDb
    };

    _cl_contentScript.sendMessage('clipto-update-highlight', data);
  },

  /**
   * click on remove on item - to delete highlight and note (the whole itemId stuff)
   */
  deleteHighlightAndNoteItem: function () {
    console.log('remove this highlight! ' + _cl_contentScript.STATE.activeNote.itemId);

    var itemId = _cl_contentScript.STATE.activeNote.itemId,
      noteProperties = _cl_contentScript.STATE.activeNote.noteProperties,
      user = _cl_contentScript.STATE.user;

    var item = itemId ? _lc_utils.findObjectInArrayOfObjects(noteProperties.items, 'itemId', itemId) : undefined;

    if (item) {
      noteProperties.items.splice(noteProperties.items.indexOf(item), 1);
    }

    var data = {
      noteProperties: noteProperties,
      user: user,
      isSync: true
    };
    _cl_contentScript.sendMessage('clipto-update-note', data);
    _cl_contentScript.deleteHighlight(itemId);
    _cl_contentScript.toolkit.removeNoteToolkit();
    //_cl_contentScript.STATE.cleanActiveNote();
    _cl_contentScript.mini_notifications.fireMiniNotification("deleted");
  }

};

_cl_contentScript.toolkit.init();