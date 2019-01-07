(function () {

  function AppData(LCUtils, $q, $state) {

    var self = this;
    self.activeTabUrl = '';
    self.activeTabDomain = '';
    self.activeNote = {};
    self.activeUser = {};
    self.activeDb = {};
    self.urlNotes = [];
    self.dbsMetaData = [];
    self.appVersion = null;
    self.deviceId = null;
    self.networkState = 'online'; //by default;

    self.skippedLoginUserBeforeSignUp = {};
    self.userProvidedName = '';

    /**
     * gets the domainNotes array and the url and returns the urlNotes array
     * @param domainNotes
     * @param url
     * @returns {Array}
     */
    //_cleanDomainNotes = function (domainNotes, url) {
    //  var result = [];
    //  for (var i = 0; i < domainNotes.length; i++) {
    //    var note = domainNotes[i];
    //    if (note.url !== url) {
    //      result.push(note);
    //    }
    //  }
    //  return result;
    //};

    _setDbsMetaData_Promise = function (dbsMetaData) {
      self.dbsMetaData = dbsMetaData;

      // init active db to be the default one
      var generalDbMeta = LCUtils.findObjectInArrayOfObjects(dbsMetaData, 'dbName', 'General');
      self.activeDb =  (generalDbMeta && generalDbMeta!==null) ? generalDbMeta.dbId : null;
    };

    _setUrlNotes_Promise = function (urlNotes) {
      self.urlNotes = urlNotes;
      return $q.when(self.urlNotes);
    };

    _setAllNotes_Promise = function (allNotes) {
      self.allNotes = allNotes;
      return $q.when(self.allNotes);
    };



    return {
      goToAuthView: function () {
        if (self.users && self.users.length > 0) {
          $state.go('usersList')
        } else {
          $state.go('hello')
        }
      },
      setSkippedLoginUserBeforeSignUp: function (user) {
        self.skippedLoginUserBeforeSignUp = user;
      },
      getSkippedLoginUserBeforeSignUp: function () {
        return self.skippedLoginUserBeforeSignUp
      },
      setAppVersion: function (appVersion) {
        self.appVersion = appVersion;
      },
      getAppVersion: function () {
        return self.appVersion
      },
      setDeviceId: function (deviceId) {
        self.deviceId = deviceId;
      },
      getDeviceId: function () {
        return self.deviceId
      },
      setUserProvidedName: function (userProvidedName) {
        self.userProvidedName = userProvidedName;
      },
      getUserProvidedName: function () {
        return self.userProvidedName;
      },
      setUserEmail: function (email) {
        self.userEmail = email;
      },
      getUserEmail: function () {
        return self.userEmail;
      },
      setPageTitle: function (pageTitle) {
        self.pageTitle = pageTitle;
      },
      getPageTitle: function () {
        return self.pageTitle
      },
      setActiveTabUrl: function (url) {
        self.activeTabUrl = url;
      },
      getActiveTabUrl: function () {
        return self.activeTabUrl;
      },
      setActiveTabDomain: function (domain) {
        self.activeTabDomain = domain;
      },
      getActiveTabDomain: function () {
        return self.activeTabDomain;
      },
      setActiveNote: function (note) {
        self.activeNote = note;
      },
      getActiveNote: function () {
        return self.activeNote;
      },
      setActiveUser: function (user) {
        self.activeUser = user;
      },
      getActiveUser: function () {
        return self.activeUser;
      },
      setUsers: function (users) {
        self.users = users;
      },
      getUsers: function () {
        return self.users;
      },
      setDbsMetaData: function (dbsMetaData) {
        return _setDbsMetaData_Promise(dbsMetaData)
      },
      setActiveDb: function (dbId) {
        self.activeDb = dbId;
      },
      getActiveDb: function () {
        //if (!self.activeDb.dbId || self.activeDb.dbId === null) {
        //  // fallback in case no activeDb defined, save note to user's private db
        //  // TODO: report this as an error
        //  self.activeDb = LCUtils.findObjectInArrayOfObjects(self.activeUser.dbs, 'dbId', 'pdb_');
        //}
        return self.activeDb;
      },
      setUrlNotes: function (urlNotes) {
        return _setUrlNotes_Promise(urlNotes);
      },
      getUrlNotes: function () {
        return self.urlNotes;
      },
      setAllNotes: function (allNotes) {
        return _setAllNotes_Promise(allNotes);
      },
      getPaneNotes: function () {
        return {
          urlNotes: self.urlNotes,
          allNotes: self.allNotes
        }
      },
      setNetworkState: function (state) {
        self.networkState = state;
      },
      getNetworkState: function () {
        return self.networkState;
      }
    }
  }

  angular.module('clipto')
    .factory('AppData', ['LCUtils', '$q', '$state', AppData])

}());
