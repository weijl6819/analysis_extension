import getPreferences from 'cache/preferencesCache';
import {updatePreferences} from 'api/preferences';
import _ from 'lodash';
import {reloadSetting} from 'storage/settings';

const domainTimers = {};

const TEN_MINUTES = 1000 * 60 * 10;

export default async (data, tab) => {
  const {domain, message, subscriptions, deleteCookie} = data;
  if (message === 'isThrottled') {
    if (domainTimers[domain]) {
      if (domainTimers[domain] + TEN_MINUTES > new Date().getTime()) {
        return true;
      } else {
        delete domainTimers[domain];
      }
    }
    return false;
  } else if (message === 'triedCodes') {
    domainTimers[domain] = new Date().getTime();
  } else if (message === 'endThrottle') {
    delete domainTimers[domain];
  } else if (message === 'updateSubscriptions') {
    const prefs = _.cloneDeep(await getPreferences());
    const emailPrefs = prefs.emailPreferences;
    emailPrefs.coupons.domainSubscriptions = subscriptions;
    prefs.emailPreferences.coupons.domainSubscriptions = subscriptions;
    const success = await updatePreferences({emailPreferences: emailPrefs});
    if (success) {
      await reloadSetting();
      return success;
    }
  } else if (message === 'deleteCookie') {
    const {url, name} = deleteCookie;
    chrome.cookies.remove({url, name});
  }
};
