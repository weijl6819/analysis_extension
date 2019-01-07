import tree from 'state';
import _ from 'lodash';
import getUser from 'messenger/outbound/getUser';
import siteCache from 'messenger/outbound/siteCache';
import {getLoadingApps, waitForApps} from 'utility/appLoaded';
import initNotificationApp from 'messenger/outbound/initNotificationApp';
import hasFeature from 'utility/hasFeature';
import Promise from 'bluebird';
import dewey from 'utility/dewey';
import sendMetric from 'utility/sendMetric';
import {setDomain, default as currentDomain} from 'utility/currentDomain';
import getShopifyDomain from 'content/utility/shopify';
import $ from 'jquery';

window.__wb_timing.deweyRequireAt = performance.now();

function fetchInitialData() {
  return Promise.all([getUser(), siteCache(), getLoadingApps()]).spread((resp, siteAPIData) => {
    if (resp) {
      tree.set('session', _.get(resp, 'session'));
      tree.set('events', _.get(resp, 'settings.events'));
      tree.set('settings', _.get(resp, 'settings'));
      tree.set('couponsDisabledSites', _.get(resp, 'couponsDisabledSites'));
      tree.set('couponsAffiliateDisabledSites', _.get(resp, 'couponsAffiliateDisabledSites'));
      tree.set('pageViewId', window.__wb_page_view_id);
      tree.set('tabId', _.get(resp, 'tabId'));
    }
    tree.merge({siteAPIData});
  });
}

const initialDataPromise = fetchInitialData();

async function onDOMReady() {
  await initialDataPromise;
  let siteAPIData = tree.get('siteAPIData');

  const domain = _.get(siteAPIData, 'meta.domain');
  setDomain(domain);
  siteAPIData = getShopifySiteData(siteAPIData) || siteAPIData;
  // coupons is dependent on dewey results in some cases, so wait for it to be ready before setting up dewey
  await waitForApps(['coupons']);
  const siteData = _.cloneDeep(siteAPIData);
  siteData.document = document;
  siteData.document.deweyParser = $;
  siteData.document.html = document.documentElement.innerHTML;
  dewey.setDefaultConfig(siteData);

  const initProms = [];
  const pageDataEnabled = !!_.get(siteAPIData, 'meta.page_data_enabled');
  if (pageDataEnabled) {
    initProms.push(initNotificationApp({name: 'pageData'}));
  }
  await Promise.all(initProms);

  //  startup dewey
  const logAllDewey = hasFeature('log_all_dewey');
  const startDate = new Date();
  // load in current coupon codes for logging new ones
  const seenCouponCodes = new Set(
    _.map(
      _.get(siteAPIData, 'siteData.tigger.coupons') ||
        _.get(siteAPIData, 'siteData.roo.coupons') ||
        [],
      'code'
    )
  );

  dewey.emitter.on('result', result => {
    if (result.callSource === 'internal') {
      tree.set(['deweyResult'], result);
      const pageType = _.get(result, 'pageType');
      if (pageType || logAllDewey) {
        const duration = new Date() - startDate;
        sendMetric(
          'track',
          'deweyResult',
          _.assign({}, result, {
            url: window.location.href,
            flags: _.get(siteAPIData, 'siteData.flags'),
            logAllDewey,
            totalTimeElapsed: duration,
            deweyAttempt: dewey.startAttempt
          })
        );
      }
    }
    if (_.get(result, 'pageData.coupons.length')) {
      // log customer-added codes the old-fashioned way to get them in coupons db
      _.forEach(result.pageData.coupons, code => {
        if (!seenCouponCodes.has(code)) {
          sendMetric('track', 'codeApplied', {
            domain: currentDomain(),
            code,
            currentLocation: window.location
          });
          seenCouponCodes.add(code);
        }
      });
    }
  });
  dewey.start();
}

function getShopifySiteData(siteAPIData) {
  const shopifyDomain = getShopifyDomain(currentDomain());
  if (shopifyDomain) {
    setDomain(shopifyDomain);
    siteAPIData = _.has(siteAPIData, 'siteData.tigger') ? siteAPIData : {siteData: {tigger: {}}};
    siteAPIData.siteData.tigger.shopify = true;
    siteAPIData.siteData.pageTypes = siteAPIData.siteData.pageTypes || {};
    siteAPIData.siteData.pageTypes.checkoutPage = {
      data: {
        coupons: [
          {
            parsers: [],
            selector: '.applied-reduction-code__information',
            type: 'text'
          }
        ]
      },
      identifiers: {
        and: [
          {
            type: 'element',
            value: '#checkout_reduction_code'
          },
          {
            type: 'element',
            value: '.order-summary__section--discount'
          },
          {
            type: 'element',
            value: '.payment-due__price'
          }
        ]
      },
      triggers: [
        {
          selector: '.applied-reduction-code__information',
          trigger: 'exists',
          action: 'run_data',
          repeat: 'uniq'
        }
      ]
    };
    return siteAPIData;
  }
}

if (document.readyState !== 'loading') {
  onDOMReady();
} else {
  document.addEventListener('DOMContentLoaded', onDOMReady);
}
