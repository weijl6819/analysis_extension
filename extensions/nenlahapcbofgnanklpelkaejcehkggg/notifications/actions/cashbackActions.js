import tree from 'state';
import dismissCashback from 'messenger/outbound/dismissCashback';
import getCashback from 'messenger/outbound/getCashback';
import completeTooltipSteps from 'messenger/outbound/completeTooltipSteps';
import activatePinnedTab from 'messenger/outbound/activatePinnedTab';
import saveCashBackNotificationSettings from 'messenger/outbound/saveCashBackNotificationSettings';
import getCashBackNotificationSettings from 'messenger/outbound/getCashBackNotificationSettings';
import setMiniCashbackTabState from 'messenger/outbound/setMiniCashbackTabState';
import backgroundTreeSet from 'messenger/outbound/backgroundTreeSet';
import getUserCreditAmount from 'messenger/outbound/getUserCreditAmount';
import moment from 'moment';
import _ from 'lodash';
import currentDomain from 'utility/currentDomain';
import getCustomAffiliateUrl from 'utility/customAffiliateUrl';
import {WIKIBUY_API} from 'constants';
import uuid from 'node-uuid';

const cursor = tree.select('cashbackView');

export function dismiss() {
  dismissCashback();
}

export async function initCashback() {
  let cashbackResult = false;
  if (shouldPreventCashback()) {
    return false;
  }
  const cashback = await getCashback();
  if (cashback && _.get(cashback, 'reward.amount')) {
    cashbackResult = cashback;
  }
  const notificationSettings = await getCashBackNotificationSettings();
  const creditAmount = await getUserCreditAmount();

  _.set(cashback, 'user.notifications', notificationSettings);
  _.set(cashback, 'user.credit', creditAmount);
  return cashbackResult;
}

export function setSeenNotificationTooltip(type) {
  const obj = {
    [type]: Date.now()
  };
  let events = _.cloneDeep(tree.get(['events']));
  events = _.merge(events, obj);
  tree.set(['events'], events);
  completeTooltipSteps(type);
}

export function activateThroughPinnedTab() {
  const domain = currentDomain();
  tree.set(
    ['couponsAffiliateDisabledSites', `${domain}_${tree.get('tabId')}`],
    moment()
      .add(30, 'minutes')
      .unix()
  );
  const clickId = uuid.v4().replace(/-/g, '');
  const customAffiliateURL = getCustomAffiliateUrl(domain, clickId, 'cashback');
  return activatePinnedTab({
    affiliateUrl: customAffiliateURL,
    pageViewId: tree.get('pageViewId'),
    clickId,
    domain
  });
}

export function activateInCurrentTab() {
  const domain = currentDomain();
  tree.set(
    ['couponsAffiliateDisabledSites', `${domain}_${tree.get('tabId')}`],
    moment()
      .add(30, 'minutes')
      .unix()
  );
  const clickId = uuid.v4().replace(/-/g, '');
  const customAffiliateURL = getCustomAffiliateUrl(domain, clickId, 'cashback');
  const data = {
    affiliateUrl:
      customAffiliateURL ||
      `${WIKIBUY_API}/redirect?r=1&url=${encodeURIComponent(
        location.href
      )}&channel=cashback&clickId=${clickId}`,
    pageViewId: tree.get('pageViewId'),
    clickId,
    domain,
    preventPinnedTab: true
  };
  // signals to standdown
  activatePinnedTab(data);
  return data;
}

export async function saveNotificationSettings(notificationSettings) {
  saveCashBackNotificationSettings(notificationSettings);
  cursor.merge(['user', 'notifications'], notificationSettings);
}

export async function setMiniCashbackTabStateAction(state) {
  setMiniCashbackTabState(state);
}

export async function backgroundTreeSetAction({path, value, persistKey}) {
  backgroundTreeSet({path, value, persistKey});
}

function shouldPreventCashback() {
  const preventURLsRegEx = [/weightwatchers.com\/us\/shop/];
  return Boolean(_.find(preventURLsRegEx, url => url.test(document.URL)));
}
