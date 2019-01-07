import * as analytics from '../utility/analytics';
import hasFeature from 'utility/hasFeature';
import {WIKIBUY_URL, WIKIBUY_HOST} from 'constants';
import {loadSettings} from 'storage/settings';
import tree from 'state';
import uuid from 'node-uuid';
import personalization from '../logic/personalization';
import getPreferences, {clear} from 'cache/preferencesCache';
import moment from 'moment';
import _ from 'lodash';

const preferencesCursor = tree.select(['preferences']);

function setIds() {
  chrome.storage.local.get('installId', ({installId} = {}) => {
    let id = installId;
    if (!id) {
      id = uuid.v4();
      chrome.storage.local.set({installId: id});
    }
    tree.set('installId', id);
  });
  if (chrome.storage.sync) {
    chrome.storage.sync.get('profileId', ({profileId} = {}) => {
      let id = profileId;
      if (!id) {
        id = uuid.v4();
        chrome.storage.sync.set({profileId: id});
      }
      chrome.cookies.set({
        url: WIKIBUY_URL,
        domain: `.${WIKIBUY_HOST}`,
        name: 'wb_profile_id',
        value: id,
        expirationDate: moment()
          .add(1, 'year')
          .unix()
      });
      tree.set('profileId', id);
      chrome.runtime.setUninstallURL(
        `${WIKIBUY_URL}/uninstall-survey?profileId=${tree.get('profileId')}`
      );
    });
  }
}

async function onInstall() {
  const version = chrome.runtime.getManifest().version;

  setTimeout(() => {
    analytics.track(
      'extensionInstalled',
      {extensionVersion: version},
      {
        integrations: {
          'Customer.io': true
        }
      }
    );

    // Load personalization data
    setupPersonalization();
  }, 2000);
  const settings = await loadSettings();
  if (settings && settings.showWebsiteOnboarding) {
    chrome.cookies.get({url: WIKIBUY_URL, name: 'extSkipOnboarding'}, cookie => {
      if (!cookie) {
        chrome.tabs.create({url: `${WIKIBUY_URL}/onboarding`, active: true});
      }
      tree.set(['settings', 'showWebsiteOnboarding'], false);
    });
  }
}
function onUpdate() {
  const version = chrome.runtime.getManifest().version;
  setTimeout(() => {
    analytics.track(
      'extensionUpdated',
      {extensionVersion: version},
      {
        integrations: {
          'Customer.io': true
        }
      }
    );
  }, 2000);
}

if (chrome.runtime.onInstalled) {
  chrome.runtime.onInstalled.addListener(async details => {
    addContextMenu();
    if (details.reason === 'install') {
      onInstall();
    } else if (details.reason === 'update') {
      onUpdate();
    }
  });
} else {
  chrome.storage.local.get('installId', ({installId}) => {
    addContextMenu();
    if (chrome.runtime.lastError) {
      return;
    }
    if (!installId) {
      onInstall();
    } else {
      onUpdate();
    }
  });
}

function addContextMenu() {
  chrome.contextMenus.create(
    {id: 'watchlist', title: 'My Watchlist', contexts: ['browser_action']},
    () => {}
  );
  chrome.contextMenus.create(
    {id: 'search', title: 'Search', contexts: ['browser_action']},
    () => {}
  );
  chrome.contextMenus.create(
    {id: 'feedback', title: 'Send Feedback', contexts: ['browser_action']},
    () => {}
  );
  chrome.contextMenus.create({id: 'help', title: 'Help', contexts: ['browser_action']}, () => {});
}

async function setupPersonalization() {
  if (!(hasFeature('history_sync_collection') || hasFeature('history_import_collection'))) {
    personalization();
    return;
  }
}

export async function initPersonalization() {
  clear(); // remove old preferences
  const prefs = await getPreferences();
  if (
    prefs.noAdditionalPersonalization ||
    !_.get(prefs, 'events.hasSetAdditionalPersonalization')
  ) {
    return;
  }
  personalization();
}

chrome.contextMenus.onClicked.addListener(info => {
  if (info.menuItemId === 'watchlist') {
    chrome.tabs.create({url: `${WIKIBUY_URL}/watchlist?trk=extMenu`, active: true});
  } else if (info.menuItemId === 'search') {
    chrome.tabs.create({url: `${WIKIBUY_URL}/home?trk=extMenu`, active: true});
  } else if (info.menuItemId === 'feedback') {
    chrome.tabs.create({url: `${WIKIBUY_URL}/help?trk=extMenu&contact=true`, active: true});
  } else if (info.menuItemId === 'help') {
    chrome.tabs.create({url: `${WIKIBUY_URL}/help?trk=extMenu`, active: true});
  }
});

setIds();
