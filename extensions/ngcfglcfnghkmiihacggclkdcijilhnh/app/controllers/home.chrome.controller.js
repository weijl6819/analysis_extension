'use strict';

(function () {

  function homeController($timeout, $state, $scope, $q, $mdDialog, Note, AuthHttp, AppData, Events, LCUtils, activeTabDomain, activeTabUrl, activeUser, urlNotes, $window, $rootScope) {

    //****************************************************************//
    //******************** VARIABLES *********************************//
    //****************************************************************//


    //****************************************************************//
    //******************** GLOBALS ***********************************//
    //****************************************************************//

    var self = this;

    self.activeTabUrl = activeTabUrl;
    self.activeTabDomain = activeTabDomain;
    self.user = activeUser;
    self.urlNotes = urlNotes; // supposed to me max one doc
    self.extensionId = chrome.runtime.id;
    self.notesToShow = [];

    self.activeNote = new Note();

    // tags
    self.userTags = loadTags();
    self.tagsQuerySearch = tagsQuerySearch;

    // initializing the content to show to be the list of notes
    self.contentToShow = "content";
    self.isEditMode = false;

    self.notesSortOrder = ['-modified'];

    //
    AppData.setUserProvidedName(undefined);

    /**
     * switch between view modes
     */
    self.setContentToShow = function (content) {
      self.contentToShow = content;
    };

    /**
     * show note delete dialog before permanent delete
     * @param ev
     * @param note
     */
    self.showDeletePageDialog = function (ev, note) {
      // Appending dialog to document.body to cover sidenav in docs app
      var confirm = $mdDialog.confirm()
        .parent(angular.element(document.body))
        .title('Delete this page clip?')
        .content('This page, all its highlights & notes will be gone forever.')
        .ariaLabel('Delete')
        .ok('Delete')
        .cancel('Keep it')
        .targetEvent(ev);
      $mdDialog.show(confirm).then(function () {
        self.remove(note);
      }, function () {
        $scope.alert = 'You decided to keep your note.';
      });
    };

    /**
     * click on remove clip
     * @param ev
     * @param page
     * @param clip
     */
    self.onRemoveClipFromPage = function (ev, clip) {

      if ((clip.note && clip.note.length) || (clip.highlightText && clip.highlightText.length)) {
        self.showDeleteClipDialog(ev, clip);
      } else {
        self.removeClipFromPage(clip);
      }
    };

    /**
     * show clip delete dialog before permanent delete
     * @param ev
     * @param page
     */
    self.showDeleteClipDialog = function (ev, clip) {
      // Appending dialog to document.body to cover sidenav in docs app
      var confirm = $mdDialog.confirm()
        .parent(angular.element(document.body))
        .title('Delete this Clip?')
        .content('Remove this highlight and note.')
        .ariaLabel('Delete')
        .ok('Delete')
        .cancel('Keep it')
        .targetEvent(ev);
      $mdDialog.show(confirm).then(function () {
        self.removeClipFromPage(clip);
      }, function () {
        $scope.alert = 'You decided to keep your note.';
      });
    };

    /**
     * if no page provided, will remove clip from from activeNote
     * @param clip
     * @param page (optional)
     */
    self.removeClipFromPage = function (clip, page) {

      page = page && page.properties ? page : self.activeNote;

      var item = LCUtils.findObjectInArrayOfObjects(page.properties.items, 'itemId', clip.itemId),
          index = page.properties.items.indexOf(item);

      page.properties.items.splice(index, 1);
      Events.message_removeHighlight(clip.itemId);
      page.update();
    };

    /**
     * scroll to highlight
     */
    self.scrollToHighlight = function (url, highlighId) {

      var data = {
        url: url,
        highlightId: highlighId
      };
      Events.message_scrollToHighlight(data);
    };

    /**
     * remove a note after user chose 'delete' on 'showDeleteDialog'
     * @param noteProperties
     */
    self.remove = function (noteProperties) {

      // because the note received is just the properties, without methods
      var noteToRemove = new Note();
      noteToRemove.properties = noteProperties;

      //call delete method on note object
      noteToRemove.delete();
      self.exitEditMode({ isUpdate: false });
    };

    /**
     * get all user tags
     * @returns {Array}
     */
    function loadTags() {
      var allTags = self.user.tags;
      return allTags.map(function (tag) {
        return {
          textToLower: tag.text.toLowerCase(),
          text: tag.text,
          color: tag.color
        };
      });
    }

    self.showPageTags = function (activeNote) {
      activeNote.showTags = !activeNote.showTags;
    };


    // ===================================================== //
    // ================ NOTE ACTIONS ======================= //
    // ===================================================== //

    /**
     * create new note by calling .create() method on Note object
     * click on [+] on pane enters edit mode
     * clipping page from injected tooltip doesn't
     */
    self.create = function (options) {

      options = options && options !== null ? options : {};
      options.isEnterEditMode = options.isEnterEditMode !== false; //false if false, otherwise true

      // for clipping page when location mode is active
      if (self.isLocationMode) {
        self.exitLocationMode();
      }

      // completely new page
      if (self.urlNotes.length === 0) {

        var now = new Date().getTime();
        self.activeNote.properties.created = now;
        self.activeNote.properties.modified = now;
        self.activeNote.create(options);

        // from pane
        if (options.isEnterEditMode) {
          self.enterEditMode(self.activeNote.properties);
          Events.onInnerAppNotification({message: 'Clipped'});
        }
        // from toolkit
        else {
          self.exitEditMode({ isUpdate: false });
        }
      }
      // existing page from pane
      else if (options.isEnterEditMode) {
        self.activeNote.properties = self.urlNotes[0];
        self.enterEditMode(self.activeNote.properties);
        Events.onInnerAppNotification({message: 'Already Clipped'});
      }
      else {
        // existing page from toolkit
        Events.message_alreadyClipped();
      }
    };

    /**
     * click on 'Update note'
     * isSync - in case we want to sync with cloud
     */
    self.update = function (options) {

      options = options && options !== null ? options : {};
      options.isSync = options.isSync !== false; //false if false, otherwise true

      // remove empty items
      handleEmptyClips();

      self.activeNote.update(options);
      //$scope.$apply();

      self.exitEditMode({ isUpdate: false });

    };

    /**
     * helper function for handling empty clips
     * removes empty clips by default when called
     * returns true if empty clips found, false if not
     * @param options
     */
    var handleEmptyClips = function (options) {

      options = options && options !== null ? options : {};
      options.isRemoveEmptyClips = options.isRemoveEmptyClips !== false;

      // remove empty items
      var result = -1;

      for (var i= 0 ; i < self.activeNote.properties.items.length ; i++) {
        var item = self.activeNote.properties.items[i];
        if ((!item.note || item.note.length === 0) && (!item.highlightText || item.highlightText.length === 0)) {
          result = i;
          if (options.isRemoveEmptyClips) {
            self.removeClipFromPage(item , self.activeNote);
          }
        }
      }
      return result === -1 ;

    };

    //var noteWatcherRepeat = function () {
    //
    //  //console.log('noteWatcherRepeat');
    //
    //  if (self.activeNote['changeLog'] && self.activeNote['changeLog'].isChanged && Date.now() - self.activeNote['changeLog'].isChangedTime > 5000) {
    //
    //    delete self.activeNote['changeLog'];
    //    self.activeNote.update();
    //  }
    //  $timeout(noteWatcherRepeat, 2500);
    //};

    ///**
    // * watch for activeNote changes for auto save
    // * @type {null}
    // */
    //var noteWatcher = function (newVal, oldVal) {
    //
    //  //console.log('noteWatcher');
    //
    //  if (newVal !== oldVal) {
    //
    //    self.activeNote['changeLog'] = {
    //      isChanged: true,
    //      isChangedTime: Date.now(),
    //      last: Object.create(newVal)
    //    }
    //  } else {
    //    //no change
    //  }
    //};

    /**
     * click on note item goes to note editing mode
     * @param noteProperties
     */
    self.enterEditMode = function (noteProperties) {

      console.log('enterEditMode');

      self.isEditMode = true;
      self.activeNote.properties = noteProperties;
      self.contentToShow = "note";

      if (self.activeNote.properties.items.length === 0) {
        self.addItemToPage(self.activeNote, {});
      }

      //noteWatcherRepeat();

      //self.watch = $scope.$watch(
      //  angular.bind(this, function () {
      //    return self.activeNote.properties;
      //    //return self.counter
      //  }),
      //  noteWatcher,
      //  true
      //);
    };

    /**
     * exiting edit mode
     * options : isUpdate, isSync
     */
    self.exitEditMode = function (options) {

      if (!self.isEditMode) {
        // not in editMode, do nothing
      }
      else {

        console.log('exitEditMode');

        options = options && options !== null ? options : {};

        // by default, on exitEditMode update the activeNote.
        options.isUpdate = options.isUpdate !== false;

        // by default, on exitEditMode doesn't update the activeNote.
        //options.isUpdate = options.isUpdate ? options.isUpdate : false;

        self.isEditMode = false;
        // exit edit mode has to be on top of update, otherwise infinite loop
        if (options.isUpdate) {
          //remove the watcher
          //self.watch();

          //update and sync to cloud
          self.update({ isSync: true });
        }
        self.activeNote = new Note();
        self.contentToShow = "content";

      }
    };

    /**
     * * adds a note item to page
     * @param page
     * @param item
     * @returns {*}
     */
    self.addItemToPage = function (page, item) {

      // check if there are empty items on the page
      var isEmptyClips = handleEmptyClips({isRemoveEmptyClips: false});

      if (isEmptyClips) {
        // make sure xpathRange is called range here
        item.range = item.range ? item.range : item.xpathRange;

        var itemId = item.itemId ? item.itemId : 'cp-' + LCUtils.getRandomInt(5, true);

        var newItem = {
          note: item.note ? item.note : undefined,
          highlightText: item.highlightText ? item.highlightText : undefined,
          highlightColor: item.highlightColor ? item.highlightColor : undefined,
          range: item.range ? item.range : undefined,
          itemId: itemId
        };

        console.log(newItem);

        page.properties.items.unshift(newItem);
        // for lc-focus-me
        self.activeNote.properties.activeItemId = itemId;

        return itemId;
      }

    };

    /**
     * when clicking enter in note item
     * @param note
     */
    self.onNoteEnter = function (note) {

      if (note && note.length) {
        //update note without sync
        self.activeNote.update();

        //show 'saved' notification
        Events.onInnerAppNotification({message: 'saved'});

        //remove focus from item
        self.activeNote.properties.activeItemId = undefined;
      }
    };

    // ===================================================== //
    // =================== NOTE VIEW ======================= //
    // ===================================================== //

    /**
     * called from md-chips directive as md-on-append to transform tag from text to object
     * @param chip
     * @returns {{text: *, color: string}}
     */
    self.newTagAppend = function (chip) {
      if (chip.color) {
        return {
          text: chip.text,
          color: chip.color
        };
      } else {
        return {
          text: chip,
          color: LCUtils.getRandomColor()
        };
      }
    };

    //TODO: move tags functionality to a dedicated directive
    // ---------------- tags autocomplete stuff -----------------

    function tagsQuerySearch(query) {
      var results = query ? self.userTags.filter(createFilterFor(query)) : self.userTags,
        deferred;

      deferred = $q.defer();
      deferred.resolve(results);
      return deferred.promise;
    }

    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(tag) {
        return (tag.textToLower.indexOf(lowercaseQuery) === 0);
      };
    }

    // ===================================================== //
    // ================ EVENTS ============================= //
    // ===================================================== //

    $scope.$on('clipto-on-all-notes', function (event, data) {
      console.log(data);
      self.allNotes = data || {};
      self.notesToShow = self.allNotes;
    });

    /**
     * new user highlight handler
     * data:
     * if highlight - {xpathRange, highlightText, isValidHighlight, message, tabId, match}
     * if note - {note}
     *
     */
    $scope.$on('clipto-on-new-clip', function (event, data) {

      //console.log ('clipto-on-new-clip');
      //console.log(data);

      self.exitEditMode({ isUpdate: false });
      var itemId;

      if (data.message && (data.message === "toolkit-new-highlight" || data.message === 'toolkit-new-note' )) {

        if (data.message === 'toolkit-new-highlight') {
          Events.message_gaEvent({hitType: 'event', eventCategory: 'toolkit', eventLabel:'clip', eventAction:'highlight'});
        } else if (data.message === 'toolkit-new-note') {
          Events.message_gaEvent({hitType: 'event', eventCategory: 'toolkit', eventLabel:'clip', eventAction:'note'});
        }

        if (self.urlNotes.length === 0) {
          itemId = self.addItemToPage(self.activeNote, data);
          self.create({ isEnterEditMode: false, itemId: itemId, origin:'toolkit' });
        } else {
          self.activeNote.properties = self.urlNotes[0];
          itemId =  self.addItemToPage(self.activeNote, data);
          self.update({ isEnterEditMode: false, isSync: true, itemId: itemId, origin:'toolkit' })
        }

      }
    });

    $scope.$on('clip-page', function (event, data) {

      self.create({ isEnterEditMode:false , origin:'toolkit' });
      Events.message_gaEvent({hitType: 'event', eventCategory: 'toolkit', eventLabel:'clip', eventAction:'page'});
    });

    $scope.$on('tab-updated', function (event, data) {

      //console.log('tab-updated');
      //console.log(data);

      self.activeTabUrl = data.url;
      self.activeTabDomain = data.domain;
      self.urlNotes = data.urlNotes;

      AppData.setActiveTabUrl(data.url);
      AppData.setActiveTabDomain(data.domain);
      AppData.setUrlNotes(data.urlNotes);

    });

    /**
     * browser changed the active tab, just exitEditMode
     */
    $scope.$on('new-active-tab', function ($scope, event, data) {
      self.exitEditMode({ isUpdate: false });
    });

    /**
     * each time a note created/updated/deleted = all tabs gets notified.
     * relevant only if allNotes were loaded to this tab (pane opened)
     */
    $scope.$on('note-updated', function (event, data) {

      //console.log('note-updated');
      //console.log(self.urlNotes);

      if (self.allNotes) {

        var noteId, noteUrl, oldNoteProperties;

        noteId = data.noteProperties._id;
        noteUrl = data.noteProperties.url;
        oldNoteProperties = LCUtils.findObjectInArrayOfObjects(self.allNotes, '_id', noteId);

        if (data.actionType === 'create' && noteId) {

          // in case of updated note, just add it
          self.allNotes.unshift(data.noteProperties);

          if (LCUtils.isUrlsMatch(noteUrl, self.activeTabUrl)) {
            self.urlNotes.unshift(data.noteProperties);
          }
          if (self.activeNote.properties._id === noteId) {
            self.activeNote.properties = data.noteProperties;
          }
        }

        else if (data.actionType === 'update' && noteId) {

          // in case of updated note, just replace it
          self.allNotes.splice(self.allNotes.indexOf(oldNoteProperties), 1, data.noteProperties);

          if (LCUtils.isUrlsMatch(noteUrl, self.activeTabUrl)) {
            self.urlNotes.splice(self.urlNotes.indexOf(oldNoteProperties), 1, data.noteProperties);
          }
          if (self.activeNote.properties._id === noteId) {
            self.activeNote.properties = data.noteProperties;
          }

        }

        else if (data.actionType === 'delete' && noteId && oldNoteProperties !== null) {
          // in case of deleted note, just remove it
          self.allNotes.splice(self.allNotes.indexOf(oldNoteProperties), 1);

          if (LCUtils.isUrlsMatch(noteUrl, self.activeTabUrl)) {
            self.urlNotes.splice(self.urlNotes.indexOf(oldNoteProperties), 1);
          }
          if (self.activeNote.properties._id === noteId) {
            self.activeNote = new Note();
          }
        }

        $scope.$apply();

        // hack for refreshing location/edit mode clips list
        if (self.isLocationMode) {
          self.exitLocationMode();
          self.enterLocationMode();
        }

        //console.log(self.urlNotes);
      }

    });

    $scope.$on('clipto-guide-sign-up', function (event, data) {

      var userName = data;

      if (self.user.userProvidedName === userName) {
        self.signUpSkippedUser(self.user);
      } else {
        self.signout();
        $state.go('hello');
      }
    });

    // ===================================================== //
    // =================== TOOLBAR ========================= //
    // ===================================================== //

    self.isLocationMode = false;
    self.isSearchFilterMode = false;
    self.searchBarText = undefined;

    /**
     * location button click on toolbar
     * just put the domain in the search filter
     */
    self.locationButtonClick = function () {
      self.isLocationMode ? self.exitLocationMode() : self.enterLocationMode()
    };

    self.enterLocationMode = function() {

      if (self.urlNotes.length === 0) {
        self.notesToShow = self.urlNotes;
        self.isLocationMode = true;
      }
      else {
        // create will see the page is clipped and show relevant page
        // there is no need to enter location mode as we go straight to the page
        self.create({isEnterEditMode: true});
      }
    };

    self.exitLocationMode = function() {

      if(self.allNotes) {
        self.notesToShow = self.allNotes;
        self.isLocationMode = false;
      }
    };

    /**
     * search button click on toolbar
     */
    self.searchButtonClick = function () {
      self.searchBarText = undefined;
      self.isSearchFilterMode = !self.isSearchFilterMode;
    };

    self.searchCleanButtonClick = function () {
      self.searchBarText = undefined;
    };

    // ===================================================== //
    // ================ NOTE ITEM ========================== //
    // ===================================================== //

    self.itemHover = function (note, bool) {
      note.showHidden = bool;
    };

    self.goToPage = function (url) {
      $window.open(
        url,
        '_blank'
      );
      //Events.message_goToPage(url);
    };

    self.getFavicon = function (url) {
      return 'https://www.google.com/s2/favicons?domain=' + url;
    };

    // ===================================================== //
    // ================ AUTH STUFF ========================= //
    // ===================================================== //

    self.signUpSkippedUser = function (user) {

      user = user && user !== null ? user : self.user ;

      AppData.setSkippedLoginUserBeforeSignUp(user);
      $state.go('signup');
      // now on signup state we need authCtrl to check if there is skippedLoginUserBeforeSignUp and present it.
      // amnd also set it as the user on auth ctrl so it will be passed to server with all the dbs and data

    };

    self.signout = function () {

      var logoutData = {
        user: AppData.getActiveUser(),
        docs: AppData.getUrlNotes()
      };
      //server sign out
      AuthHttp.signout().success(function (response) {
        // no one cares
      }).catch(function (err) {
        //TODO: handle this
      });
      // notify background, new pane init data will be sent
      Events.message_logOutUser(logoutData);
      // locally signOut anyway (in case no response from bg)
      AppData.setActiveUser(undefined);
    };

  }

  angular.module('clipto')
    .controller('homeController', ['$timeout', '$state', '$scope', '$q', '$mdDialog', 'Note', 'AuthHttp', 'AppData', 'Events', 'LCUtils', 'activeTabDomain', 'activeTabUrl', 'activeUser', 'urlNotes', '$window', '$rootScope', homeController])

}());
