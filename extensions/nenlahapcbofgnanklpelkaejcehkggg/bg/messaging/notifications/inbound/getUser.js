import tree from 'state';

export default (data, tab) => {
  return {
    settings: tree.get(['settings']),
    session: tree.get(['session']),
    couponsDisabledSites: tree.get('couponsDisabledSites'),
    couponsAffiliateDisabledSites: tree.get('couponsAffiliateDisabledSites'),
    selfStandDown: tree.get('selfStandDown'),
    tabId: tab.id,
    miniCashbackTabState: tree.get('miniCashbackTabState'),
    notificationBackgroundOpacity: tree.get('notificationBackgroundOpacity')
  };
};
