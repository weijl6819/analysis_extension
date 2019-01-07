// Prevents Chrome from force reloading our extension mid stream
// Waits until Chrome's next restart to reload the extension if
// our manual update continuously fails.
if (chrome.runtime.onUpdateAvailable) {
  chrome.runtime.onUpdateAvailable.addListener(() => {
    // Firefox doesnt support requestUpdateCheck so if an update is available
    // just reload the extension. Its a noop for chrome.
    if (!chrome.runtime.requestUpdateCheck) {
      chrome.runtime.reload();
    }
  });
}

let reloadTimeout;
// Checks for an update and reloads the extension if one is available.
function checkForUpdate() {
  chrome.runtime.requestUpdateCheck(status => {
    if (status === 'update_available') {
      // Delay reload for 10 seconds to prevent installing new versions to rapidly
      // There is a warning thrown when the extension reloads 5 times in under 10 seconds
      // [TODO] add logic to prevent reload if working on a run
      if (reloadTimeout) {
        clearTimeout(reloadTimeout);
      }
      reloadTimeout = setTimeout(() => {
        chrome.runtime.reload();
      }, 10000);
    }
  });
}
if (chrome.runtime.requestUpdateCheck) {
  checkForUpdate();
  // Check for update every 5 min.
  setInterval(checkForUpdate, 1000 * 60 * 5);
}
