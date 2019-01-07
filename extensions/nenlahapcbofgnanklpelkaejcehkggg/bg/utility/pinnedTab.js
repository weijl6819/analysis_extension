// Store each pinned tab independently using a unique ID
const pinnedTabs = {};

export function runPinnedTab(data) {
  const {url, id, done, timeout = 10000} = data;

  return new Promise(resolve => {
    const pinned = navigator.userAgent.indexOf(' OPR/') === -1;
    chrome.tabs.create({pinned, active: false, url}, tab => {
      if (tab) {
        const id = tab.id;
        pinnedTabs[id] = {};
        pinnedTabs[id].resolve = resolve;
        pinnedTabs[id].intervalID = setInterval(() => {
          chrome.tabs.get(id, tab => {
            // The pinned tab can set its URL to indicate the "done" state
            if (done(tab)) {
              clearInterval(pinnedTabs[id].intervalID);
              clearTimeout(pinnedTabs[id].timeoutID);
              resolve({id, success: true});
            }
          });
        }, 300);
        // Set timeout to close tab if something went wrong
        pinnedTabs[id].timeoutID = setTimeout(() => {
          clearInterval(pinnedTabs[id].intervalID);
          resolve({id, timeout: true});
        }, timeout);
      } else {
        resolve({id, error: 'Tab not found'});
      }
    });
  }).then(data => {
    if (pinnedTabs[data.id]) {
      setTimeout(() => {
        chrome.tabs.remove(data.id);
        delete pinnedTabs[data.id];
      }, 5000);
    }
    return data;
  });
}

export async function showPinnedTab(tabId, affiliateLink) {
  if (!pinnedTabs[tabId]) {
    return;
  }
  clearInterval(pinnedTabs[tabId].intervalID);
  clearTimeout(pinnedTabs[tabId].timeoutID);

  if (pinnedTabs[tabId].resolve) {
    pinnedTabs[tabId].resolve({success: true});
  }
  chrome.tabs.update(tabId, {pinned: false, active: true}, tab => {});
  delete pinnedTabs[tabId];
  try {
    if (affiliateLink) {
      await fetch(affiliateLink);
    }
  } catch (e) {}
}
