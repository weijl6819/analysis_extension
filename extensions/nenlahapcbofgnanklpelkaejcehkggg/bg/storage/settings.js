import _ from 'lodash';
import localStore from './local';
import getPreferences, {clear} from '../cache/preferencesCache';
import {updatePreferences} from 'api/preferences';
import tree from 'state';

export async function reloadSetting() {
  clear();
  const settings = await loadSettings();
  tree.set('settings', settings);
}

function getPrimeMembership(prefs, defaultValue = true) {
  const primeMembership = _.find(_.get(prefs, 'memberships'), ({type}) => {
    return type === 'amazonPrime';
  });
  return _.get(primeMembership, 'active', defaultValue);
}

async function updateZipAndPrime(zipcode, prime, currentPrefs) {
  const memberships = _.map(currentPrefs.memberships, membership => {
    if (membership.type === 'amazonPrime') {
      return {
        type: 'amazonPrime',
        active: !!prime
      };
    }
    return membership;
  });
  if (!memberships.length) {
    memberships.push({
      type: 'amazonPrime',
      active: !!prime
    });
  }
  return await updatePreferences({
    customer: {
      zipcode
    },
    memberships
  });
}

export async function saveSettings(settings) {
  const {prime, zipcode} = settings;
  await localStore.set({userPrefs: settings});
  const prefs = await getPreferences();
  // Update prefs if prime or zipcode has changed
  if (
    prefs &&
    !prefs.error &&
    (_.get(prefs, 'customer.zipcode') !== zipcode || getPrimeMembership(prefs) !== settings.prime)
  ) {
    await updateZipAndPrime(zipcode, prime, prefs);
    await reloadSetting();
  }
}

export async function loadSettings() {
  const result = await localStore.get('userPrefs');
  const prefs = _.get(result, 'userPrefs', {
    showOnboarding: true,
    showWebsiteOnboarding: true,
    zipcode: '78756',
    prime: false,
    dismissNewTabSites: false
  });
  try {
    const serverPrefs = await getPreferences();
    const {isShadowAccount} = await localStore.get('isShadowAccount');
    if (!_.get(serverPrefs, 'events.hasAgreedToTerms')) {
      prefs.hasAccount = false; // Shows full onboarding if the extension hasnt seen it
      prefs.events = _.get(serverPrefs, 'events', {});
    } else if (
      isShadowAccount &&
      serverPrefs &&
      serverPrefs.customer &&
      serverPrefs.customer.zipcode === '78756'
    ) {
      // prevent overriding prefs
      prefs.hasAccount = true;
      prefs.events = _.get(serverPrefs, 'events', {});
    } else if (serverPrefs && !serverPrefs.error) {
      prefs.zipcode = _.get(serverPrefs, 'customer.zipcode', prefs.zipcode);
      prefs.firstname = _.get(serverPrefs, 'customer.firstname', prefs.firstname);
      prefs.lastname = _.get(serverPrefs, 'customer.lastname', prefs.lastname);
      prefs.prime = getPrimeMembership(serverPrefs, prefs.prime);
      prefs.hasAccount = true; // Shows just the last step of onboarding if applicable
      prefs.events = _.get(serverPrefs, 'events', {});
    }
    if (
      !/^\d{5}$/.test(prefs.zipcode) ||
      prefs.zipcode !== _.get(serverPrefs, 'customer.zipcode', '78756')
    ) {
      prefs.zipcode = _.get(serverPrefs, 'customer.zipcode', '78756') || '78756';
    }
    if (typeof prefs.prime !== 'boolean') {
      prefs.prime = true;
    }
    if (serverPrefs && serverPrefs.dismissNewTabSites) {
      prefs.dismissNewTabSites = serverPrefs.dismissNewTabSites;
    }
    if (serverPrefs && serverPrefs.username) {
      prefs.username = serverPrefs.username;
    }
    if (serverPrefs && serverPrefs.notificationPreferences) {
      prefs.notificationPreferences = serverPrefs.notificationPreferences;
    }
    if (serverPrefs && serverPrefs.emailPreferences) {
      prefs.emailPreferences = serverPrefs.emailPreferences;
    }
  } catch (e) {}

  return prefs;
}

const debounceSaveSettings = _.debounce(() => {
  saveSettings(tree.get('settings'));
}, 1000);
// Save settings when they update
tree.select('settings').on('update', debounceSaveSettings);
