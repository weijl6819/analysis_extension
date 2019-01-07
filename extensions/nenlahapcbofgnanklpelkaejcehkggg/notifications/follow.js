import {React} from 'utility/css-ns';
import Follow from 'pages/Follow';
import CouponReminder from 'pages/CouponReminder';
import loadApp from 'utility/loadApp';
import tree from 'state';
import Promise from 'bluebird';
import _ from 'lodash';
import Root from 'components/Root';
import getUser from 'messenger/outbound/getUser';
import siteCache from 'messenger/outbound/siteCache';

window.__wb_timing.followRequireAt = performance.now();

function fetchInitialData() {
  return Promise.all([getUser(), siteCache()]).spread((resp, siteAPIData, cashback) => {
    if (resp) {
      tree.set('session', _.get(resp, 'session'));
      tree.set('events', _.get(resp, 'settings.events'));
      tree.set('settings', _.get(resp, 'settings'));
      tree.set('couponsDisabledSites', _.get(resp, 'couponsDisabledSites'));
      tree.set('couponsAffiliateDisabledSites', _.get(resp, 'couponsAffiliateDisabledSites'));
      tree.set('selfStandDown', _.get(resp, 'selfStandDown'));
      tree.set('pageViewId', window.__wb_page_view_id);
      tree.set('tabId', _.get(resp, 'tabId'));
    }
    tree.merge({siteAPIData});
  });
}

async function init() {
  await fetchInitialData();
  const resultData = tree.get(['followView', 'resultData']);
  const hasCoupon = _.get(resultData, 'details.pricing.coupons.length');
  loadApp({
    initialRoute: '/follow',
    cssUrl: 'GENERATED/follow.css',
    app: (props => <Root>{hasCoupon ? <CouponReminder /> : <Follow />}</Root>)()
  });
}

if (document.readyState !== 'loading') {
  init();
} else {
  document.addEventListener('DOMContentLoaded', init);
}
