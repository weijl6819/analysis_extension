//console.log('running background script');

function connectTabToFD(tab) {
  //console.log('connectTabToFD tabId=' + tab.id + ' executing content_script');
  chrome.tabs.executeScript(tab.id, {
    file: 'content_script.js',
    runAt: 'document_end'
  }, function () {
    //console.log('connectTabToFD tabId=' + tab.id + ' executing connect_content_script');
    chrome.tabs.executeScript(tab.id, {
      file: 'connect_content_script.js',
      runAt: 'document_end'
    });
  });
}

function connectActiveTabToFD(window) {
  // connect active tab in focused window
  chrome.tabs.query({ windowId: window.id, active: true }, function (tabs) {
    for (var j = 0; j < tabs.length; j++) {
      //console.log('onFocusChanged allTabId=' + tabs[j].id);
      //console.log('onFocusChanged connecting to FD');
      connectTabToFD(tabs[j]);
    }
  });
}

function disconnectTabFromFD(tab) {
  //console.log('disconnectTabFromFD tabId=' + tab.id + ' executing disconnect_content_script');
  chrome.tabs.executeScript(tab.id, {
    file: 'disconnect_content_script.js',
    runAt: 'document_end'
  });
}

function disconnectAllInactiveTabsFromFD(window) {
  chrome.tabs.query({ windowId: window.id }, function (tabs) {
    for (var j = 0; j < tabs.length; j++) {
      //console.log('onFocusChanged allTabId=' + tabs[j].id);
      if (!window.focused || !tabs[j].active) {
        //console.log('onFocusChanged disconnecting from FD');
        disconnectTabFromFD(tabs[j]);
      }
    }
  });
}

function updateTabConnectionsToFD() {
  chrome.windows.getAll({}, function (windows) {
    // disconnect inactive tabs (incl active tab in windows w/out focus)
    for (var i = 0; i < windows.length; i++) {
      //console.log('onFocusChanged allWindowId=' + windows[i].id);
      disconnectAllInactiveTabsFromFD(windows[i]);
    }

    chrome.windows.getLastFocused({}, function (window) {
      connectActiveTabToFD(window);
    });
  });
}

// Fired when the currently focused window changes. Will be chrome.windows.WINDOW_ID_NONE if all chrome windows have lost focus.
chrome.windows.onFocusChanged.addListener(function (windowId) {
  console.log('onFocusChanged windowId=' + windowId);
  updateTabConnectionsToFD();
});

// Fires when the active tab in a window changes.
chrome.tabs.onActivated.addListener(function (activeInfo) {
  console.log('onActivated tabId=' + activeInfo.tabId + ', windowId=' + activeInfo.windowId);
  updateTabConnectionsToFD();
});

// Fired when a tab is updated.
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  console.log('onUpdated tabId=' + tabId + ', changeInfo=' + JSON.stringify(changeInfo));

  if ('status' in changeInfo && changeInfo.status == 'complete') {
    //console.log('onUpdated tabId=' + tabId + ' page is complete');
    updateTabConnectionsToFD();
  }
});