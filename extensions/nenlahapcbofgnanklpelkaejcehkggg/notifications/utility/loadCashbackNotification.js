import {React} from 'utility/css-ns';
import sendMetric from 'utility/sendMetric';
import tree from 'state';
import siteCache from 'messenger/outbound/siteCache';
import _ from 'lodash';
import hasFeature from 'utility/hasFeature';
import loadApp from 'utility/loadApp';
import Cashback from 'pages/Cashback';
import tldjs from 'tldjs';
import moment from 'moment';
import {Route} from 'react-router';

export default async function loadCashbackNotification(deweyResult, options) {
  const {siteData, meta} = await siteCache();
  const cashback = tree.get('cashback');
  const settings = tree.get('settings');
  const cashbackPrefs = _.get(settings, 'notificationPreferences.cashbackPrefs');
  let showCashback;
  let pageType = _.get(deweyResult, 'pageType');
  // Stand down notification
  const domain = tldjs.getDomain(location.href);
  if (
    tree.get(['couponsDisabledSites', `${domain}_${tree.get('tabId')}`]) > moment().unix() ||
    tree.get(['couponsDisabledSites', `${domain}_all`]) > moment().unix()
  ) {
    return false;
  }
  if (domain.match(/hilton\.com/) && hasFeature('cb_hilton_honors')) {
    return false;
  }

  if (domain === 'ebay.com' && _.get(siteData, 'coupons.coupons.length')) {
    return false;
  }

  const overRides = _.get(siteData.cashback, 'pageTypesOverride', {}) || {};

  if (overRides && overRides[pageType] && hasFeature('cb_dewey_overrides')) {
    const type = overRides[pageType];
    const action = _.get(type, 'value', type); // ingest both new and old way;
    let resolve;
    if (action === 'show') {
      showCashback = true;
    } else if (action === 'hide') {
      showCashback = false;
    } else if (action === 'conditional' && type.conditional) {
      resolve = resolveConditional(type.conditional);
      if (!resolve || resolve.hide) {
        showCashback = false;
      } else {
        showCashback = true;
      }
    }

    sendMetric('track', 'cashbackNotificationOverride', {
      show: showCashback,
      reason: _.get(resolve, 'feature', '')
    });
    if (!showCashback) {
      return false;
    }
  } else if (
    _.get(deweyResult, 'domain') === 'tophatter.com' &&
    _.get(deweyResult, 'pageType') === 'homePage' &&
    hasFeature('top_hatter_hp_or')
  ) {
    showCashback = true;
  } else if (_.get(deweyResult, 'pageType') === 'atcPage' && hasFeature('cb_on_atc_page')) {
    showCashback = true;
  } else if (_.get(deweyResult, 'pageType') === 'dealPage' && hasFeature('credit_on_deal')) {
    showCashback = true;
  } else if (cashbackPrefs) {
    showCashback = cashbackPrefs.indexOf(pageType) !== -1;
  } else {
    pageType = _.snakeCase(pageType);
    const pagesToShowOn = new Set(siteData.cashback.minNotificationsPageTypes);
    showCashback =
      pagesToShowOn.has(pageType) ||
      (hasFeature('product_page_cb_notif') && pageType === 'productPage') ||
      (hasFeature('home_page_cb_notif') && pageType === 'homePage') ||
      (hasFeature('search_page_cb_notif') && pageType === 'searchPage');
    const notificationSetting = _.get(cashback, 'user.notifications.notificationSetting');
    showCashback = notificationSetting === 'NONE' ? false : showCashback;
  }

  let showMiniTabNotification;
  if (pageType === 'productPage' && !showCashback && hasFeature('mini_cashback_tab')) {
    showMiniTabNotification = true;
    showCashback = true;
  }

  if (
    cashback &&
    showCashback &&
    !_.get(cashback, 'user.activated') &&
    !_.get(cashback, 'user.dismissed') &&
    !tree.get('cashbackVisible')
  ) {
    const viewData = tree.get('cashbackView') || cashback;
    tree.set('cashbackView', {
      ...viewData,
      isCashbackURLMatch: showCashback,
      showMiniTabNotification,
      deweyResult,
      ebatesReward: siteData.ebatesReward,
      exclusions: _.get(siteData, 'merchantPage.exclusions'),
      affiliateLinkCurrentTab: _.get(meta, 'affiliate_link_current_tab')
    });
    loadApp({
      initialRoute: '/cashback',
      cssUrl: 'GENERATED/cashback.css',
      route: <Route path="cashback" component={Cashback} />,
      disableDelay: true
    });
    tree.set('cashbackVisible', true);
  }
}

function resolveConditional(conditional) {
  try {
    const obj = JSON.parse(conditional);
    const hideMap = _.map(obj.hide, c => {
      return {
        hide: hasFeature(c),
        feature: c
      };
    });
    const showMap = _.map(obj.show, c => {
      return {
        show: hasFeature(c),
        feature: c
      };
    });
    const h = _.find(hideMap, {hide: true});
    const s = _.find(showMap, {show: true});
    if (h) {
      // hide overrides show
      return h;
    }
    if (s) {
      return s;
    }
    return false;
  } catch (err) {
    console.log('conditional error', err.message);
    return false;
  }
}
