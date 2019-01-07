import Baobab from 'baobab';
import localStore from 'storage/local';

const tree = new Baobab({
  settings: {
    notificationPreferences: {
      notificationStyle: 'annotation',
      notificationFrequency: 'always',
      notificationWhere: ['productPage', 'checkoutPage'],
      showCouponCodes: true,
      cashbackPrefs: ['cartPage', 'checkoutPage', 'reviewPage']
    }
  },
  postOnboardingRun: null,
  engagedASINs: [],
  couponsDisabledSites: {},
  selfStandDown: {},
  googleData: null,
  couponsAffiliateDisabledSites: {},
  miniCashbackTabState: {},
  notificationBackgroundOpacity: null
});

async function setAsyncDefaults() {
  try {
    const {notificationBackgroundOpacity} = await localStore.get('notificationBackgroundOpacity');
    tree.set(['notificationBackgroundOpacity'], notificationBackgroundOpacity);
  } catch (err) {}
}
setAsyncDefaults();

export default tree;
