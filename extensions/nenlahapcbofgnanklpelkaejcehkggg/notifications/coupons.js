import {React} from 'utility/css-ns';
import hasFeature from 'utility/hasFeature';
import Coupon from 'pages/Coupon';
import CouponDemo from 'pages/Coupon/demo/CouponDemo';
import {Route} from 'react-router';
import loadApp from 'utility/loadApp';
import getUser from 'messenger/outbound/getUser';
import getGoogleContacts from 'messenger/outbound/getGoogleContacts';
import siteCache from 'messenger/outbound/siteCache';
import setBrowserAction from 'messenger/outbound/setBrowserAction';
import couponsMessenger from 'messenger/outbound/couponsMessenger';
import {initCoupons as initTigger, initOnlyShowCoupons} from 'actions/couponActions';
import {initCoupons as initRoo} from 'actions/rooActions';
import {initCashback} from 'actions/cashbackActions';
import {setDomain, default as currentDomain} from 'utility/currentDomain';
import couponChecking from 'content/couponChecking';
import getShopifyDomain from 'content/utility/shopify';
import fetchJSON from 'utility/fetchJSON';
import {SITE_API, ORIGIN_SITE_API} from 'constants';
import Promise from 'bluebird';
import tree from 'state';
import _ from 'lodash';
import moment from 'moment';
import dewey from 'utility/dewey';
import $ from 'jquery';
import sendMetric from 'utility/sendMetric';
import {appLoaded} from 'utility/appLoaded';
import {isTiggerSite} from 'iv-tigger';
import loadCashbackNotification from 'utility/loadCashbackNotification';

window.__wb_timing.couponsRequireAt = performance.now();

const CLASSIFIER_SITES = new Set(['etsy.com']);

function fetchInitialData() {
  return Promise.all([getUser(), siteCache(), initCashback()]).spread(
    (resp, siteAPIData, cashback) => {
      if (resp) {
        tree.set('session', _.get(resp, 'session'));
        tree.set('events', _.get(resp, 'settings.events'));
        tree.set('settings', _.get(resp, 'settings'));
        tree.set('couponsDisabledSites', _.get(resp, 'couponsDisabledSites'));
        tree.set('couponsAffiliateDisabledSites', _.get(resp, 'couponsAffiliateDisabledSites'));
        tree.set('selfStandDown', _.get(resp, 'selfStandDown'));
        tree.set('pageViewId', window.__wb_page_view_id);
        tree.set('tabId', _.get(resp, 'tabId'));
        tree.set('miniCashbackTabState', _.get(resp, 'miniCashbackTabState'));
        tree.set('notificationBackgroundOpacity', _.get(resp, 'notificationBackgroundOpacity'));
      }
      tree.merge({siteAPIData});
      tree.merge({cashback});
    }
  );
}

async function init() {
  await fetchInitialData();
  const domain = currentDomain();
  if (window.location.href.indexOf('wikibuydemo=true') > -1) {
    setTimeout(() => {
      couponDemoApp();
    }, 500);
    return;
  }
  // Firefox blacklisted coupon sites
  if (navigator.userAgent.indexOf('Firefox') > -1 && domain.match(/eyebuydirect\.com/)) {
    return false;
  }

  getGoogleContacts({contacts: true});
  const cashback = tree.get('cashback');

  tree.set('couponsVisible', false);
  const siteAPIData = tree.get('siteAPIData');
  const initCoupons = await getInitCoupons(siteAPIData);
  // Pull site info again since we may have modified it in getInitCoupons
  couponChecking(domain);
  // set browser action just incase the initCoupons promise never resolves

  const couponStandDownOverride =
    _.get(siteAPIData, 'siteData.coupons.tld') === 'ebay.com' &&
    _.get(siteAPIData, 'siteData.coupons.coupons.length');
  if (
    !(
      tree.get(['couponsDisabledSites', `${currentDomain()}_${tree.get('tabId')}`]) >
      moment().unix()
    ) &&
    !(tree.get(['couponsDisabledSites', `${currentDomain()}_all`]) > moment().unix())
  ) {
    if (cashback && !cashback.postCoupons && !couponStandDownOverride) {
      setBrowserAction({active: true, cashback});
    } else {
      setBrowserAction({active: true});
    }
  }
  let ogPageData;
  try {
    ogPageData = JSON.parse(sessionStorage.getItem('ogPageData'));
    if (ogPageData && ogPageData.expires < moment().unix()) {
      sessionStorage.removeItem('ogPageData');
      ogPageData = null;
    }
  } catch (e) {}
  let classifierFired = false;
  dewey.emitter.on('result', async result => {
    if (result.callSource === 'coupons_start' && result.pageData) {
      sessionStorage.setItem(
        'ogPageData',
        JSON.stringify({
          ...result.pageData,
          expires: moment()
            .add(3, 'm')
            .unix()
        })
      );
    } else if (result.callSource === 'coupons_end') {
      const couponResult = tree.select('couponView').get('resultTemp');
      try {
        ogPageData = JSON.parse(sessionStorage.getItem('ogPageData'));
      } catch (e) {}
      sessionStorage.removeItem('ogPageData');
      const ogCartTotal = _.get(ogPageData, 'order.total');
      const newCartTotal = _.get(result, 'pageData.order.total');

      // console.log(resultTemp, 'ENENENENENENENEN')

      // Modify couponResult with data from before running
      couponResult.originalTotal = ogCartTotal || couponResult.originalTotal;
      couponResult.savings =
        ogCartTotal && newCartTotal ? ogCartTotal - newCartTotal : couponResult.savings;
      // Modify deweyResult with data from before running
      if (couponResult.savings > 0) {
        if (_.get(result, 'pageData.products.length') > 1) {
          /*
          / If there is more than one product,
          / we can only be confident that the coupon applied
          / to a product if we see that the price on that specific
          / product was reduced.
          */
          result.pageData.products = _.map(result.pageData.products, (product, i) => {
            if (_.has(product, 'list_price') && _.has(ogPageData, `products[${i}].list_price`)) {
              const productSavings = ogPageData.products[i].list_price - product.list_price;
              if (productSavings) {
                product.coupon_savings = ogPageData.products[i].list_price - product.list_price;
              }
            }
            product.coupon_applied = couponResult.bestCoupon.code;
            return product;
          });
        } else if (_.get(result, 'pageData.products.length') === 1) {
          /*
          / If there is only one product, we can
          / be confident that the coupon had savings on that product.
          */
          result.pageData.products[0].coupon_savings = couponResult.savings;
          result.pageData.products[0].coupon_applied = couponResult.bestCoupon.code;
        }
      }

      const domain = currentDomain();

      const config = tree.get('couponsConfig');
      if (config && config.pageWasReloaded) {
        config.result = couponResult;
        prepareCouponsApp(config, cashback);
      } else {
        tree.select('couponView').set('result', couponResult);
      }

      sendMetric('track', 'tryCouponsResult', {
        domain,
        clickId: couponResult.clickId,
        droppedCookie: couponResult.droppedCookie,
        originalTotal: couponResult.originalTotal,
        savings: couponResult.savings || 0,
        errored: couponResult.errored,
        runTime: couponResult.runTime,
        totalCouponsTested: _.get(couponResult, 'coupons.length'),
        coupons: _.get(couponResult, 'coupons'),
        bestCoupon: _.get(couponResult, 'bestCoupon.code'),
        currentLocation: window.location
      });
      // TODO log the cart data with savings so we can display in webapp
      sendMetric(
        'track',
        'deweyResult',
        _.assign(result, {
          url: window.location.href,
          domain
        })
      );
    } else if (ogPageData && _.get(result, 'pageType')) {
      // init coupons asynchronously (after dewey finds a page type) if the page reloaded
      initCoupons();
    } else if (CLASSIFIER_SITES.has(domain) && !classifierFired) {
      if (_.get(result, 'pageData')) {
        classifierFired = true;
        const config = await initCoupons();
        if (config) {
          // init coupons asynchronously (after dewey finds page data) if it's a classifier site
          const res = await fetchJSON(`${ORIGIN_SITE_API}/site/${domain}/coupon`, {
            body: JSON.stringify({pageData: result.pageData}),
            method: 'POST'
          });
          config.coupons = res.items;
          prepareCouponsApp(config, cashback);
        }
      }
    } else {
      const domain = currentDomain();
      if (!tree.get('cashbackVisible') && !_.get(cashback, 'postCoupons') && domain !== 'att.com') {
        // Try to load cashback notification if the coupon notification is not loaded yet.
        setTimeout(() => {
          if (!tree.get('couponsVisible')) {
            loadCashbackNotification(result);
          }
        }, 1000);
      }
    }
  });

  // notify dewey that its coupons listener has loaded
  appLoaded('coupons');
  // init coupons synchronously only if there is no ogPageData (the page did not reload having saved the dewey result on the previous page) and it's not a classifier site;
  const coupons = !CLASSIFIER_SITES.has(domain) && (await initCoupons());
  // const coupons = !CLASSIFIER_SITES.has(domain) && !ogPageData && await initCoupons();
  if (coupons && !_.get(coupons, 'disableCouponsOverride')) {
    if (!coupons.pageWasReloaded) {
      // load app asynchronously (using Dewey) if the page was reloaded
      prepareCouponsApp(coupons, cashback);
    }
  }
}

async function prepareCouponsApp(coupons, cashback) {
  const {standDown} = coupons;
  const domain = currentDomain();
  tree.set('couponView', coupons);
  const viewData = tree.get('cashbackView') || cashback;
  tree.set('cashbackView', viewData);

  // Wait until here to check for throttle because another experience (e.g. SiteHub) may still want access to cashbackView or couponView
  const isThrottled = await couponsMessenger({domain, message: 'isThrottled'});
  const seenThrottleToolTip = !!tree.get(['events', 'hasSeenCouponsThrottleToolTip']);
  const showThrottleToolTip = isThrottled && !seenThrottleToolTip && !coupons.pageWasReloaded;
  tree.select('couponView').set('showThrottleToolTip', showThrottleToolTip);

  const settings = tree.get('settings');
  const showCoupons = _.has(settings, 'notificationPreferences.showCouponCodes')
    ? _.get(settings, 'notificationPreferences.showCouponCodes')
    : true;
  if ((!showCoupons || isThrottled) && !coupons.pageWasReloaded) {
    tree.set('couponsThrottled', true);
    if (!showThrottleToolTip) {
      setBrowserAction({active: true, textOverride: `${_.get(coupons, 'coupons.length', '')}C`});
      // Only continue to load the coupons if we are going to show the throttle tooltip
      return;
    }
  } else if (showCoupons && standDown) {
    // throttled due to stand down.
    tree.set('couponsThrottled', true);
    return;
  }

  if (tree.get(['couponView', 'standDownOverride'])) {
    setBrowserAction({active: true, textOverride: `${_.get(coupons, 'coupons.length', '')}C`});
  }

  const loadOptions = {
    initialRoute: '/coupons',
    cssUrl: 'GENERATED/coupons.css',
    route: <Route path="coupons" component={Coupon} />,
    disableDelay: true
  };
  // TODO: remove after investigation
  if (domain === 'groupon.com') {
    sendMetric('track', 'foundCouponsEnd', {pageViewId: tree.get('pageViewId')});
  }

  // end TODO
  if (!tree.get('couponsVisible')) {
    // sometimes we call init coupons when dewey page refreshes. Stop the app from loading in if its there. But load state above
    tree.set('couponsVisible', true);
    loadApp(loadOptions);
  }
}

async function couponDemoApp(coupons, cashback) {
  const loadOptions = {
    initialRoute: '/coupons',
    cssUrl: 'GENERATED/coupons.css',
    route: <Route path="coupons" component={CouponDemo} />,
    disableDelay: true
  };
  tree.set('couponsVisible', true);
  loadApp(loadOptions);
}

async function getInitCoupons(siteAPIData) {
  const domain = _.get(siteAPIData, 'meta.domain');
  setDomain(domain);
  const shopifyDomain = getShopifyDomain(domain);
  if (_.get(siteAPIData, 'siteData.coupons.ignoreSite')) {
    return _.noop;
  }
  if (
    _.get(siteAPIData, 'siteData.coupons.type') === 'eeyore' &&
    _.get(siteAPIData, 'siteData.coupons.coupons.length') > 0
  ) {
    // No tigger or roo script but tigger enabled and has coupons object
    const identifiers = _.get(siteAPIData, 'siteData.coupons.identifiers');
    if (identifiers) {
      const deweyDoc = document;
      deweyDoc.deweyParser = $;
      deweyDoc.html = document.documentElement.innerHTML;
      const result = await dewey.evaluateIdentifierTree(identifiers, deweyDoc);
      if (result) {
        return initOnlyShowCoupons;
      }
    }
    return _.noop;
  } else if (
    _.get(siteAPIData, 'siteData.coupons.type') === 'tigger' &&
    (shopifyDomain || isTiggerSite(domain))
  ) {
    if (shopifyDomain) {
      setDomain(shopifyDomain);
      if (shopifyDomain !== domain) {
        // e.g. shopify.com/${id}; we won't have pulled site data for that domain previously so we must pull it now
        const script = await fetchJSON(`${SITE_API}/coupons?tld=${shopifyDomain}`);
        siteAPIData.siteData.coupons = {
          coupons: script.items || [],
          ignoreSite: _.isUndefined(script.ignoreSite) ? true : script.ignoreSite,
          ignoreAffiliate: _.isUndefined(script.ignoreAffiliate) ? true : script.ignoreAffiliate,
          tld: script.tld
        };
      }
      siteAPIData.siteData.coupons.shopify = true;
      siteAPIData.siteData.appliedCodeSelector = '.applied-reduction-code__information';
      await siteCache(
        _.assign(siteAPIData, {
          domain: shopifyDomain,
          setSite: true
        })
      );
    }
    return initTigger;
  } else if (_.get(siteAPIData, 'siteData.coupons.type') === 'roo') {
    return initRoo;
  } else {
    return _.noop;
  }
}

if (document.readyState !== 'loading') {
  init();
} else {
  document.addEventListener('DOMContentLoaded', init);
}
