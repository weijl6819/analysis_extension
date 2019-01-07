import tree from 'state';
import Promise from 'bluebird';
import _ from 'lodash';
import currentDomain from 'utility/currentDomain';

function showSiteHub(data) {
  const deals = tree.get(['siteHubView', 'deals']);
  const primaryDeal = tree.get(['siteHubView', 'primaryDeal']);
  if (!_.get(data, 'site.siteData.flags.siteHubStandDown')) {
    tree.set(['couponsDisabledSites', `${currentDomain()}_${tree.get('tabId')}`], 0);
  }
  if (!tree.get(['siteHubView', 'shown'])) {
    tree.set('siteHubView', {
      shown: true,
      visible: true,
      site: data.site,
      deals,
      primaryDeal
    });
  } else {
    tree.set(['siteHubView', 'visible'], true);
    tree.set(['siteHubView', 'site'], data.site);
  }
  // disable sitehub on ebay when there is a coupon
  if (currentDomain() === 'ebay.com' && _.get(data, 'site.siteData.coupons.coupons.length')) {
    return false;
  }
  if (!tree.get(['siteHubScriptLoaded'])) {
    return true;
  } else {
    return false;
  }
}

export default async data => {
  if (
    document.readyState === 'interactive' ||
    document.readyState === 'complete' ||
    document.readyState === 'loaded'
  ) {
    return showSiteHub(data);
  } else {
    return new Promise(resolve => {
      document.addEventListener('DOMContentLoaded', () => {
        resolve(showSiteHub(data));
      });
    });
  }
};
