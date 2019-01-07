define(['jquery'], function($) {

    var myindexedDB = {};

    myindexedDB.dbs = {};
    myindexedDB.keyPath = 'timeStamp';

    myindexedDB.init = function(schemaName, keyPath, callback) {
        myindexedDB.open(schemaName, keyPath, callback);
    };

    myindexedDB.open = function(schemaName, keyPath, callback) {
      schemaName = schemaName.toLowerCase();
      var collectionName = schemaName +'s';
      if (schemaName.substring(schemaName.length - 1) === 's') {
        collectionName = schemaName +'es';
      }

      var version = 1;
      var request = indexedDB.open(collectionName, version);

      // We can only create Object stores in a versionchange transaction.
      request.onupgradeneeded = function(e) {
        var db = e.target.result;

        // A versionchange transaction is started automatically.
        e.target.transaction.onerror = function(e) {
            callback(null);
        };

        e.target.transaction.onabort = function(e) {
            callback(null);
        };

        if (db.objectStoreNames.contains(schemaName)) {
          db.deleteObjectStore(schemaName);
        }

        if (keyPath) {
            myindexedDB.keyPath = keyPath;
        }

        // console.log('keyPath = ', myindexedDB.keyPath);
        var store = db.createObjectStore(schemaName,
          {keyPath: myindexedDB.keyPath});
      };

      request.onsuccess = function(e) {
        myindexedDB.dbs[schemaName] = e.target.result;
        myindexedDB.getAll(schemaName, callback);
      };

      request.onerror = function(e) {
        callback(null);
      };
    };

    myindexedDB.addNew = function(schemaName, datas, callback) {
        schemaName = schemaName.toLowerCase();
        if (!myindexedDB.dbs.hasOwnProperty(schemaName)) {
            // console.log('Shema ' + schemaName + ' does not exist.');
            return;
        }
        // console.log('Add new item to ' + schemaName);
        var db = myindexedDB.dbs[schemaName];
        // console.log("Here is the database:"+ db);
        var trans = db.transaction([schemaName], "readwrite");
        var store = trans.objectStore(schemaName);
        // console.log("Here is the store:"+ store);

        if (myindexedDB.keyPath === 'timeStamp') {
            datas.timeStamp = new Date().getTime();
        }

        var request = store.put(datas);

        // console.log("here is the request" + request);

        request.onsuccess = function(e) {
            myindexedDB.getAll(schemaName, callback);
        };

        request.onerror = function(e) {
            // console.log(e.value);
        };
    };

    myindexedDB.getAll = function(schemaName, callback) {
        var db = myindexedDB.dbs[schemaName];
        var trans = db.transaction([schemaName], "readwrite");
        var store = trans.objectStore(schemaName);

      // Get everything in the store;
      var keyRange = IDBKeyRange.lowerBound(0);
      var cursorRequest = store.openCursor(keyRange);
      var allItems = [];

      cursorRequest.onsuccess = function(e) {
        var result = e.target.result;

        if (result) {
            allItems.push(result.value);
            result.continue();
        } else {
            callback(allItems);
        }

      };

      cursorRequest.onerror = myindexedDB.onerror;
    };

    myindexedDB.update = function(schemaName, id, changes, callback) {
        var db = myindexedDB.dbs[schemaName];
        var trans = db.transaction([schemaName], "readwrite");
        var store = trans.objectStore(schemaName);
        if (!changes.hasOwnProperty(id)) {
            myindexedDB.getAll(schemaName, callback);
            return;
        }

        if (!changes[id]) {
            myindexedDB.getAll(schemaName, callback);
            return;
        }

        var request = store.get(changes[id]);

        request.onsuccess = function(e) {
            var data = e.target.result;

            data = $.extend(data, changes);
            // Put this updated object back into the database.
            var requestUpdate = store.put(data);
            requestUpdate.onerror = function(e) {
                // console.log(e);
            };

            requestUpdate.onsuccess = function(event) {
                myindexedDB.getAll(schemaName, callback);
            };
        };

        request.onerror = function(e) {
            // console.log(e);
        };
    };


    myindexedDB.delete = function(schemaName, id, callback) {
        var db = myindexedDB.dbs[schemaName];
        var trans = db.transaction([schemaName], "readwrite");
        var store = trans.objectStore(schemaName);

        var request = store.delete(id);

        request.onsuccess = function(e) {
            myindexedDB.getAll(schemaName, callback);
        };

        request.onerror = function(e) {
            // console.log(e);
        };
    };

    myindexedDB.onerror = function(){
        // console.log("encountered an error:");
    };

    return myindexedDB;

});
