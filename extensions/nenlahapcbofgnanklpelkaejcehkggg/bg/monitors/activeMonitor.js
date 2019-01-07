import _ from 'lodash';
import hasFeature from 'utility/hasFeature';
import numeral from 'numeral';
import tree from 'state';
const activeTabs = {};

export function showActiveIcon(tabId, data) {
  if (data && data.textOverride) {
    chrome.browserAction.setBadgeBackgroundColor({color: data.colorOverride || '#3f5a69'});
    chrome.browserAction.setBadgeText({text: data.textOverride});
  } else {
    activeTabs[tabId] = _.assign({active: true}, activeTabs[tabId], data);
    const cashback = activeTabs[tabId].cashback;
    if (cashback && !_.get(cashback, 'user.activated') && !hasFeature('ext_badge_control')) {
      const reward = _.get(cashback, 'reward');
      const type = _.get(cashback, 'reward.type');
      let text;
      if (reward && reward.amount) {
        text =
          type === 'percentage' && reward
            ? numeral(reward.amount / 10000).format('0%')
            : numeral(reward.amount / 100).format('$0');
      }
      if (text) {
        chrome.browserAction.setBadgeBackgroundColor({color: '#3f5a69'});
        chrome.browserAction.setBadgeText({text});
      }
    } else if (_.get(activeTabs[tabId], 'text')) {
      chrome.browserAction.setBadgeBackgroundColor({color: '#3f5a69'});
      chrome.browserAction.setBadgeText({text: _.get(activeTabs[tabId], 'text')});
    }
  }
  const iconData = {
    path: {
      19: '/assets/icons/browser/browseraction-on-19.png',
      38: '/assets/icons/browser/browseraction-on-38.png'
    }
  };
  chrome.browserAction.setIcon(iconData);
}

export function showInactiveIcon(tabId) {
  delete activeTabs[tabId];
  const iconData = {
    path: {
      19: '/assets/icons/browser/browseraction-off-19.png',
      38: '/assets/icons/browser/browseraction-off-38.png'
    }
  };
  chrome.browserAction.setBadgeText({text: ''});
  chrome.browserAction.setIcon(iconData);
}

export function showInactiveIconWithBadge(tabId, data = {}) {
  delete activeTabs[tabId];
  const iconData = {
    path: {
      19: '/assets/icons/browser/browseraction-off-19.png',
      38: '/assets/icons/browser/browseraction-off-38.png'
    }
  };
  if (data && data.textOverride) {
    chrome.browserAction.setBadgeBackgroundColor({color: data.colorOverride || '#3f5a69'});
    chrome.browserAction.setBadgeText({text: data.textOverride});
  } else {
    chrome.browserAction.setBadgeText({text: ''});
    chrome.browserAction.setIcon(iconData);
  }
}

function checkTab(tab) {
  if (!tab) {
    return;
  }
  if (tab.active) {
    const session = tree.get('session');
    if (
      hasFeature('ext_alert_unverified') &&
      session &&
      session.roles &&
      session.roles.indexOf('unverified') > -1
    ) {
      showInactiveIconWithBadge(tab.id, {textOverride: '1', colorOverride: '#FF0000'});
    } else if (activeTabs[tab.id]) {
      showActiveIcon(tab.id);
    } else {
      showInactiveIcon(tab.id);
    }
  }
}

chrome.tabs.onActivated.addListener(activeInfo => {
  chrome.tabs.get(activeInfo.tabId, tab => {
    checkTab(tab);
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  checkTab(tab);
});

chrome.tabs.onRemoved.addListener((tabId, changeInfo, tab) => {
  showInactiveIcon(tabId);
});
