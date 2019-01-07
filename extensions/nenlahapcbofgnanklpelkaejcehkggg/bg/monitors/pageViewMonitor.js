import _ from 'lodash';
import {isWhitelisted, isTracklisted} from './libs/listCache';
import {showInactiveIcon} from 'monitors/activeMonitor';
import {track} from '../utility/analytics';
import hasFeature from '../utility/hasFeature';
import publicSuffixList from 'iv-public-suffix-list';
import getSiteDomainFromUrl from 'utility/getSiteDomainFromUrl';
import Url from 'url';
import Promise from 'bluebird';
import tree from 'state';
import uuid from 'node-uuid';
import getSite from '../cache/siteCache';
import isSuspendedAccount from 'utility/isSuspendedAccount';

async function getUser(tab) {
  return {
    settings: tree.get(['settings']),
    session: tree.get(['session']),
    couponsDisabledSites: tree.get('couponsDisabledSites'),
    couponsAffiliateDisabledSites: tree.get('couponsAffiliateDisabledSites'),
    selfStandDown: tree.get('selfStandDown'),
    tabId: tab.id
  };
}

async function fetchInitialData(tab) {
  const domain = getSiteDomainFromUrl(tab.url);
  const [resp, siteAPIData] = await Promise.all([getUser(tab), getSite(domain)]);
  return {resp, siteAPIData};
}

async function getLists(domain) {
  const [whitelisted, tracklisted] = await Promise.all([
    isWhitelisted(domain),
    isTracklisted(domain)
  ]);
  return {whitelisted, tracklisted};
}

async function analyzeData(data, domain, tab, trackOpts = {}) {
  const siteAPIData = _.get(data, 'siteAPIData');

  const scripts = [];
  let scriptLoaded = false;
  let ignoreCommon = false;
  let deweyLoading = false;
  let watch = _.get(siteAPIData, 'meta.watch');

  // Pre-load sites via content script for improved performance
  if (domain.match(/amazon\.com|bestbuy\.com|homedepot\.com|zappos\.com|target\.com/)) {
    ignoreCommon = true;
    scriptLoaded = true;
  } else if (checkGoogleShoppingURL(tab.url, domain)) {
    scripts.push({file: '/GENERATED/site.js'});
    scriptLoaded = true;
  }
  if (domain.match(/opentable\.com|yelp\.com|tripadvisor\.com|google\.com/)) {
    scripts.push({file: '/GENERATED/deals.js'});
  }
  if (
    hasFeature('show_hotel_storm') &&
    (domain.match(
      /expedia\.com|priceline\.com|^hotels\.com|^kayak\.com|^booking\.com|^tripadvisor\.com|^airbnb\.com/
    ) ||
      (domain.match(/^google\.com/) && hasFeature('cug_goog')))
  ) {
    scripts.push({file: '/GENERATED/hotel.js'});
  }
  if (
    domain.match(/^google\.com|^yahoo\.com|^bing\.com|^ask\.com/) &&
    hasFeature('serp_annotation')
  ) {
    scripts.push({file: '/GENERATED/serp.js'});
  }
  const couponsData = _.get(siteAPIData, 'siteData.coupons');
  if (
    (couponsData && !couponsData.ignoreSite && couponsData.coupons && couponsData.coupons.length) ||
    (hasFeature('apply_page_coupons') &&
      (hasFeature('apply_page_coupons_amazon') && domain === 'amazon.com'))
  ) {
    ignoreCommon = false;
    scriptLoaded = false;
    // Included in coupon script
    if (
      domain === 'bestbuy.com' ||
      domain === 'homedepot.com' ||
      domain === 'amazon.com' ||
      domain === 'zappos.com' ||
      domain === 'target.com'
    ) {
      ignoreCommon = true;
    }
    // end TODO
    watch = false;
    scripts.push({file: '/GENERATED/coupons.js'});
  } else if (
    _.get(siteAPIData, 'siteData.cashback') &&
    !_.get(siteAPIData, 'siteData.cashback.disabled')
  ) {
    ignoreCommon = false;
    scriptLoaded = false;
    scripts.push({file: '/GENERATED/cashback.js'});
  }

  if (
    hasFeature('show_custom_notification') &&
    _.get(siteAPIData, 'siteData.notifications.length')
  ) {
    ignoreCommon = false;
    scriptLoaded = false;
    scripts.push({file: '/GENERATED/customNotification.js'});
  }

  if (_.get(siteAPIData, 'siteData.mirageNotification.identifiers')) {
    ignoreCommon = false;
    scriptLoaded = false;
    scripts.push({file: '/GENERATED/mirageNotification.js'});
  }

  if (!scriptLoaded) {
    const siteData = _.get(siteAPIData, 'siteData');
    const pageDataEnabled = !!_.get(siteAPIData, 'meta.page_data_enabled');
    if (checkShopifyURL(tab.url) || pageDataEnabled || (siteData && !_.isEmpty(siteData))) {
      deweyLoading = true;
      scripts.push({file: '/GENERATED/dewey.js'});
    }
  }
  if (watch && !ignoreCommon) {
    scripts.push({file: '/GENERATED/watch.js'});
  }

  if (scripts.length) {
    if (ignoreCommon) {
      _.forEach(scripts, script => {
        chrome.tabs.executeScript(tab.id, script);
      });
    } else {
      chrome.tabs.executeScript(tab.id, {file: '/GENERATED/commons.js'}, () => {
        if (chrome.runtime.lastError) {
          return;
        }
        _.forEach(scripts, script => {
          chrome.tabs.executeScript(tab.id, script, e => {
            if (chrome.runtime.lastError) {
              return;
            }
          });
        });
      });
      if (deweyLoading) {
        // use appLoaded utility for dewey to keep track of apps that need to load before it starts emitting
        const loadingApps = _.map(scripts, script => {
          return script.file.match(/GENERATED\/(.*)\.js/)[1];
        });
        tree.set('loadingApps', loadingApps);
      }
    }
  }
}

function checkGoogleShoppingURL(url, domain) {
  if (domain === 'google.com') {
    return url.match(/google\.com\/search.*&tbm=shop|google\.com\/shopping/i);
  }
}

function checkSerpPage(url, domain) {
  if (!hasFeature('serp_annotation')) {
    return false;
  }
  if (domain === 'google.com') {
    return /google\.com\/search/i.test(url);
  } else if (domain === 'yahoo.com') {
    return /search\.yahoo\.com\//i.test(url);
  } else if (domain === 'bing.com') {
    return /bing\.com\/search/i.test(url);
  } else if (domain === 'ask.com') {
    return /ask\.com\/web/i.test(url);
  }
}

function checkShopifyURL(url) {
  const re = /\.[a-z]{2,9}\/\d{4,11}\/checkouts\/[0-9a-f]{32}/;
  return re.test(url);
}

function checkHotelsURL(url, domain) {
  return (
    /^expedia\.com|^priceline\.com|^hotels\.com|^kayak\.com|^booking\.com|^tripadvisor\.com|^google\.com|^airbnb\.com/.test(
      domain
    ) || /google\.com\/search/.test(url)
  );
}

function checkYahooURL(url) {
  return /smallbusiness\.yahoo\.com/.test(url);
}

async function trackPage(request, parsed, domain, sender, sendResponse) {
  const pageViewId = uuid.v4();
  sendResponse(pageViewId);
  showInactiveIcon(sender.tab.id);
  getLists(domain).then(async ({whitelisted, tracklisted}) => {
    try {
      const isSerpPage = checkSerpPage(parsed.href, domain);
      if (checkYahooURL(parsed.href)) {
        whitelisted = true;
      }
      if (
        whitelisted ||
        tracklisted ||
        isSerpPage ||
        checkGoogleShoppingURL(parsed.href, domain) ||
        checkShopifyURL(parsed.href) ||
        checkHotelsURL(parsed.href, domain)
      ) {
        const pageObj = {
          domain,
          title: request.title,
          url: parsed.href,
          pageViewId
        };
        const pageViewObj = {
          page: {
            path: parsed.pathname,
            referrer: request.referrer,
            search: parsed.search || '',
            title: request.title,
            url: parsed.href
          },
          integrations: {
            'Customer.io': false
          }
        };
        if (
          whitelisted ||
          tracklisted ||
          checkGoogleShoppingURL(parsed.href, domain) ||
          checkShopifyURL(parsed.href)
        ) {
          track('pageView', pageObj, pageViewObj);
        }

        // Fetch site api data
        const tab = sender.tab;
        const data = await fetchInitialData(tab);
        if (!isSuspendedAccount()) {
          analyzeData(data, domain, tab, {pageObj, pageViewObj});
        }
      }
    } catch (e) {}
  });
  return true;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'extLink') {
    track('extLink', {
      link: request.link,
      url: request.url,
      title: request.title,
      referrer: request.referrer
    });
    return;
  }
  if (request.type !== 'pageView') {
    return;
  }
  const parsed = request.url ? Url.parse(request.url) : null;
  const domain = parsed ? publicSuffixList.getDomain(parsed.hostname) : null;
  if (parsed) {
    trackPage(request, parsed, domain, sender, sendResponse);
  }
});
