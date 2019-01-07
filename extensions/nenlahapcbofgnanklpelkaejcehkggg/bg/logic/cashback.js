import tldjs from 'tldjs';
import cache from 'cache/cashbackCache';
import moment from 'moment';
import getSite from '../cache/siteCache';
import {WIKIBUY_API} from 'constants';
import {track} from 'utility/analytics';
import _ from 'lodash';
import uuid from 'node-uuid';
import getPreferences from 'cache/preferencesCache';
import getCredits from 'cache/creditsCache';
import {updatePreferences} from 'api/preferences';
import {getCashbackByTag as getByTag} from 'api/site';
import {standDown} from 'monitors/afsrcMonitor';
import {runPinnedTab} from '../utility/pinnedTab';
import hasFeature from 'utility/hasFeature';
import noCreditsWhitelist from 'resources/noCreditsWhitelist.json';

function disableCreditsTestGroup(domain, hasCoupons) {
  return (
    hasFeature('ext_cc_no_credit2') && hasCoupons && (noCreditsWhitelist || []).indexOf(domain) > -1
  );
}

function checkToShowCashback(url) {
  const domain = tldjs.getDomain(url);
  const cashback = cache.get(domain);
  const checkData = {
    activated: false,
    dismissed: false,
    hasSeenFirst: false,
    seenCount: 0
  };
  if (cashback && cashback.activated) {
    checkData.activated = true;
  }
  if (
    cashback &&
    cashback.dismissed &&
    moment(cashback.dismissed)
      .add(60, 'minute')
      .isAfter(moment())
  ) {
    checkData.dismissed = true;
  }
  if (
    cashback &&
    cashback.hasSeenFirst &&
    moment(cashback.hasSeenFirst)
      .add(60, 'minute')
      .isAfter(moment())
  ) {
    checkData.hasSeenFirst = true;
  }
  if (cashback && cashback.seenCount) {
    checkData.seenCount = cashback.seenCount;
  }
  return checkData;
}

export async function activateInPinnedTab({
  url,
  tabId,
  pageViewId,
  domain,
  affiliateUrl,
  clickId,
  preventPinnedTab
}) {
  standDown(url, 'ebatesActivate', tabId);
  cache.set(domain, {activated: Date.now()});
  // Some sites we want to just follow the affiliate link in the current tab
  // so we only need to stand down then return
  if (preventPinnedTab) {
    return;
  }
  const pinId = `cashback${domain}`;
  clickId = clickId || uuid.v4().replace(/-/g, '');
  domain = domain || tldjs.getDomain(url);
  track('cashbackRedirect', {
    clickId,
    domain,
    pageViewId
  });
  const result = await runPinnedTab({
    url:
      affiliateUrl ||
      `${WIKIBUY_API}/redirect?r=1&url=${encodeURIComponent(
        `http://${domain}`
      )}&channel=cashback&clickId=${clickId}`,
    id: pinId,
    done: tab => {
      return domain === tldjs.getDomain(tab.url);
    }
  });
  result.domain = domain;
  return result;
}

export async function saveCashBackNotificationSettings({notificationSetting, firstTimeSeenDate}) {
  const prefs = await getPreferences();
  const cashback = _.assign(prefs.cashback, {notificationSetting, firstTimeSeenDate});
  await updatePreferences({cashback});
}

export async function getCashBackNotificationSettings() {
  const prefs = await getPreferences();
  return _.defaults(prefs.cashback, {notificationSetting: 'ALL'});
}

export async function getUserCredits() {
  const credits = await getCredits();
  return credits;
}

export async function getCashbackByTag({url, tag}) {
  const isEbates = hasFeature('ebates_customer_group');
  const {domain} = tldjs.parse(url);
  const cashback = await getByTag({domain, tag});
  if (cashback && cashback.reward && !isEbates) {
    return cashback;
  }
}

export default async ({url}) => {
  const isEbates = hasFeature('ebates_customer_group');
  const {hostname, domain} = tldjs.parse(url);
  const siteAPIData = await getSite(hostname);
  const cashback = _.get(siteAPIData, 'siteData.cashback');
  const hasCoupons =
    _.get(siteAPIData, 'siteData.coupons.coupons.length') &&
    !_.get(siteAPIData, 'siteData.coupons.ignoreSite');
  if (cashback && cashback.reward && !isEbates && !disableCreditsTestGroup(domain, hasCoupons)) {
    const checkData = checkToShowCashback(url);
    cashback.user = checkData;
    cashback.vendor = _.get(siteAPIData, 'vendorName') || _.get(siteAPIData, 'siteData.tld');
    return cashback;
  }
};
