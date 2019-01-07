module.exports = function setBrowserAction(type) {
  if (type === 'go') {
    chrome.browserAction.setBadgeText({text: 'GO'});
    chrome.browserAction.setBadgeBackgroundColor({color: '#28c682'});
  } else if (type === 'waiting') {
    chrome.browserAction.setBadgeText({text: 'WAIT'});
    chrome.browserAction.setBadgeBackgroundColor({color: '#F05b5b'});
  } else if (type === 'ok') {
    chrome.browserAction.setIcon({
      path: {
        '19': 'assets/icons/icon_identify_capture-check-19.png',
        '38': 'assets/icons/icon_identify_capture-check-38.png'
      }
    });
    chrome.browserAction.setBadgeText({text: 'OK'});
    chrome.browserAction.setBadgeBackgroundColor({color: '#28c682'});
    setTimeout(() => {
      chrome.browserAction.setBadgeText({text: ''});
    }, 1000);
  } else if (type === 'atc') {
    chrome.browserAction.setBadgeText({text: 'ATC'});
    chrome.browserAction.setBadgeBackgroundColor({color: '#28c682'});
  } else {
    chrome.browserAction.setBadgeText({text: ''});
  }
};
