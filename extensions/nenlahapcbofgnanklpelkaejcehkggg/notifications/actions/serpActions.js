import tree from 'state';
import activatePinnedTab from 'messenger/outbound/activatePinnedTab';
import runPinnedTab from 'messenger/outbound/pinnedTab';
import moment from 'moment';
import getCustomAffiliateUrl from 'utility/customAffiliateUrl';
import sendMetric from 'utility/sendMetric';
import {WIKIBUY_API} from 'constants';
import uuid from 'node-uuid';

export function activateThroughPinnedTab(domain) {
  tree.set(
    ['couponsAffiliateDisabledSites', `${domain}_${tree.get('tabId')}`],
    moment()
      .add(30, 'minutes')
      .unix()
  );
  const clickId = uuid.v4().replace(/-/g, '');
  const customAffiliateURL = getCustomAffiliateUrl(domain, clickId);
  return activatePinnedTab({
    affiliateUrl: customAffiliateURL,
    pageViewId: tree.get('pageViewId'),
    clickId,
    domain
  });
}

export function copyCode(code, domain) {
  const clickId = uuid.v4().replace(/-/g, '');
  sendMetric('trackClick', 'copyCouponCode', code, {
    domain,
    pagePath: location.pathname,
    clickId
  });
  const customAffiliateURL = getCustomAffiliateUrl(domain, clickId);
  runPinnedTab({
    url:
      customAffiliateURL ||
      `${WIKIBUY_API}/redirect?r=1&url=${encodeURIComponent(
        `http://${domain}`
      )}&channel=coupons&clickId=${clickId}`,
    id: `coupons${clickId}`,
    timeout: 10000,
    cb: {
      type: 'aff'
    }
  });
}
