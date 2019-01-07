import tree from 'state';
import sendMetric from 'utility/sendMetric';
import uuid from 'node-uuid';
import _ from 'lodash';
import Bluebird from 'bluebird';
import setSeenDiscountPromotion from 'messenger/outbound/setSeenDiscountPromotion';
import checkOlarkStatus from 'messenger/outbound/checkOlarkStatus';
import completeTooltipSteps from 'messenger/outbound/completeTooltipSteps';
import checkout from 'messenger/outbound/checkout';
import {default as loadProductFromBg} from 'messenger/outbound/loadProduct';
import {default as loadPriceHistoryFromBg} from 'messenger/outbound/loadPriceHistory';
import {default as updateFavoriteFromBg} from 'messenger/outbound/updateFavorite';
import {default as loadOfferHistoryFromBg} from 'messenger/outbound/loadOfferHistory';
import {default as addToAmazonCartFromBg} from 'messenger/outbound/addToAmazonCart';
import {default as getPersonalizedDataFromBg} from 'messenger/outbound/getPersonalizedData';
import hasFeature from 'utility/hasFeature';
import moment from 'moment';

let bodyOverflow;

const cursor = tree.select('notification');

export function checkForOlarkAgents(data) {
  checkOlarkStatus(data).then(agents => {
    if (agents) {
      cursor.set('showOlark', true);
    } else {
      cursor.set('showOlark', false);
    }
  });
}

function modalDetailsReceived(data) {
  const asin = data.asin || _.get(data, 'gtins[0]');
  if (asin !== tree.get('currentASIN') && !tree.get('ignoreCurrentASIN') && !data.instantOffers) {
    return;
  }
  if (data.instantOffers) {
    sendMetric('track', 'instantOffersReceived', {
      parentQuoteId: data.instantOffers.runId,
      quoteId: data.instantOffers.instantOffersRunId,
      trigger: tree.get('trigger'),
      currentLocation: window.location,
      domain: location.hostname.replace(/^www\./, '')
    });
  }
  const run = _.clone(cursor.get('run') || {});
  if (_.get(data, 'run.runId') === _.get(run, 'runId') && data.modal) {
    run.betterResults = _.map(_.get(run, 'betterResults'), result => {
      if (result.id === data.modal.id) {
        result = data.modal;
      }
      return result;
    });
  }
  cursor.merge({
    details: data.modal,
    run: _.isEmpty(run) ? data.run : run,
    lastChance: false,
    cartPricing: data.cartPricing
  });
  runUpdated(data);
}

function lastChanceDetailsReceived(data) {
  const details = _.get(data.run, 'betterResults[0]');
  cursor.merge({
    details,
    run: data.run,
    lastChance: true,
    cartPricing: data.cartPricing
  });
  runUpdated(data, true);
}

function runUpdated(data, overrideCurrentAsin) {
  const savings = _.get(data, 'cartPricing.savings') || data.run.savings;
  const asin = _.get(data, 'run.inputData.asin') || _.get(data, 'run.inputData.gtins[0]');
  if (asin !== tree.get('currentASIN') && !overrideCurrentAsin) {
    return;
  }
  const activeRunId = cursor.get('activeRunId');
  if (activeRunId === _.get(data.run, 'runId')) {
    return;
  }
  if (data.run.status === 'complete') {
    sendMetric('page', 'quoteCompleteNotification', {
      view: 'quoteCompleteNotification',
      type: 'notification',
      domain: location.hostname.replace(/^www\./, ''),
      pagePath: location.pathname,
      matchDomain: _.get(data.run, 'betterResults[0].vendor', null),
      matchUrl: _.get(data.run, 'betterResults[0].product.url', null),
      savings: savings > 0 ? savings : null,
      paymentsSupport: !!_.get(data, 'cartPricing.paymentsSupport')
    });
    endPriceCheck(data.run);
    cursor.merge({activeRunId: _.get(data.run, 'runId')});
  }
  const showPopup = savings > 0;
  cursor.merge({
    run: data.run,
    currentSavings: savings,
    updating: true,
    lastSavings: cursor.get('currentSavings'),
    showPopup,
    resetting: false,
    ignoreRun: false
  });
}

function startPriceCheck(runId) {
  window.priceCheckId = uuid.v4();
  cursor.set(['priceCheckStarted'], true);
  sendMetric('track', 'priceCheckStart', {
    quoteId: runId,
    priceCheckId: window.priceCheckId,
    trigger: tree.get('trigger'),
    currentLocation: window.location,
    domain: location.hostname.replace(/^www\./, '')
  });
}

function endPriceCheck(run) {
  const priceCheckStarted = cursor.get('priceCheckStarted');
  if (!priceCheckStarted) {
    startPriceCheck(run.runId);
    cursor.set(['endFiredFirst'], run.runId);
  }
  cursor.set(['priceCheckStarted'], false);
  sendMetric('track', 'priceCheckEnd', {
    quoteId: run.runId,
    category: _.get(run, 'originResult.product.vendorCategory'),
    priceCheckId: window.priceCheckId,
    matchId: _.get(run, 'betterResults[0].id'),
    domain: location.hostname.replace(/^www\./, '')
  });
}

export function setShowModal(value, run, asin) {
  const disableBlur = true;
  const pageContainer = document.querySelector('#a-page');
  if (value) {
    bodyOverflow = window.getComputedStyle(document.body, null).getPropertyValue('overflow');
    document.body.style.overflow = 'hidden';
    if (pageContainer && !disableBlur) {
      setTimeout(() => {
        pageContainer.style['-webkit-filter'] = 'blur(5px)';
        pageContainer.style.transition = '-webkit-filter 400ms';
      }, 100);
    }
  } else if (bodyOverflow) {
    document.body.style.overflow = bodyOverflow;
    if (pageContainer && !disableBlur) {
      pageContainer.style['-webkit-filter'] = 'none';
    }
  }
  cursor.merge({
    showModal: value,
    showToolTip: false
  });
}

export function setShowPopup(value) {
  cursor.set(['showPopup'], value);
}

export function setShowOnboarding(value) {
  cursor.set(['showOnboarding'], value);
}

export function resetNotification() {
  cursor.merge({
    run: {},
    details: null,
    cartPricing: null,
    currentSavings: 0,
    updating: true,
    lastSavings: cursor.get('currentSavings'),
    showPopup: false,
    resetting: true,
    ignoreRun: false,
    communityDeal: null
  });
  tree.set('bestAmazonResult', null);
}

export function ignoreRun() {
  cursor.merge({
    ignoreRun: true
  });
}

export function displayDeal(deal) {
  cursor.merge({
    ignoreRun: false,
    communityDeal: deal
  });
  sendMetric('page', 'dealNotification', {
    view: 'quoteCompleteNotification',
    type: 'notification',
    domain: location.hostname.replace(/^www\./, ''),
    pagePath: location.pathname,
    savings: _.get(deal, 'savings'),
    productId: _.get(deal, 'id'),
    productUrl: _.get(deal, 'url')
  });
}

export function loadDeal(deal) {
  // sendMetric('page', 'dealNotification', {
  //   view: 'quoteCompleteNotification',
  //   type: 'notification',
  //   domain: location.hostname.replace(/^www\./, ''),
  //   pagePath: location.pathname,
  //   savings: _.get(deal, 'savings'),
  //   productId: _.get(deal, 'id'),
  //   productUrl: _.get(deal, 'url')
  // });
  // loadApp(deal);
}

export function dismissPromotion() {
  cursor.set(['showPromotion'], false);
  setSeenDiscountPromotion();
}

export async function appReady() {
  tree.set('appReady', true);
  const stack = tree.get('messages');
  await Bluebird.delay(1000);
  _.forEach(stack, request => {
    if (request.type === 'resetNotification') {
      return;
    }
    handleMessage(request);
  });
  tree.set('messages', []);
}

function setBestAmazonResult(amazonResults, runId) {
  sendMetric('track', 'amazonResultsReceived', {
    domain: location.hostname.replace(/^www\./, ''),
    pagePath: location.pathname,
    quoteId: runId,
    amazonResults: amazonResults.length
  });
  const originResult = _.find(amazonResults, r => {
    return !!_.get(r, 'meta.isOrigin');
  });
  const originTotal = _.get(originResult, 'pricing.total');
  if (!originResult || !originTotal) return false;
  const results = _(amazonResults)
    .map(r => {
      const savings = _.get(r, 'pricing.total') ? originTotal - _.get(r, 'pricing.total') : 0;
      r.savings = savings > 0 ? savings : 0;
      if (!r.product.wbpid) {
        try {
          const matches = r.product.url.match(/gp\/product\/(.*)\/|dp\/(.*)\?/);
          const asin = matches[2] || matches[1];
          if (asin) {
            r.product.wbpid = `amazon.com_${asin}`;
          }
        } catch (e) {}
      }
      return r;
    })
    .filter(r => !!r.savings)
    .sortBy(
      ['savings', r => moment(_.get(r, 'details.arrival_date'), 'ddd. MMM. D').unix()],
      ['desc', 'asc']
    )
    .reverse()
    .value();
  if (results && results.length) {
    sendMetric('track', 'bestAmazonResult', {
      domain: location.hostname.replace(/^www\./, ''),
      pagePath: location.pathname,
      quoteId: runId,
      matchUrl: _.get(results[0], 'product.url'),
      matchSeller: _.get(results[0], 'product.seller'),
      matchSavings: _.get(results[0], 'savings'),
      matchSubtotal: _.get(results[0], 'pricing.subtotal'),
      matchTax: _.get(results[0], 'pricing.tax'),
      matchShipping: _.get(results[0], 'pricing.shipping'),
      matchTotal: _.get(results[0], 'pricing.total'),
      amazonFulfilled: _.get(results[0], 'details.amazonFulfilled'),
      prime: _.get(results[0], 'details.prime')
    });
    tree.set('bestAmazonResult', results[0]);
  }
}

function handleMessage(request) {
  if (!tree.get('appReady')) {
    tree.push(['messages'], request);
    return;
  }
  const {type, ...data} = request;
  if (data) {
    switch (type) {
      case 'setInputData':
        cursor.merge({inputData: data.inputData});
        break;
      case 'modalDetailsReceived':
        modalDetailsReceived(data);
        break;
      case 'lastChanceDetailsReceived':
        lastChanceDetailsReceived(data);
        break;
      case 'showOnboarding':
        setTimeout(() => {
          cursor.merge({
            showOnboarding: true,
            hasAccount: !!data.hasAccount
          });
        });
        break;
      case 'runUpdated':
        runUpdated(data);
        break;
      case 'abortRun':
        cursor.merge({
          run: {status: 'complete', runId: _.get(data, 'run.runId'), aborted: true},
          currentSavings: 0,
          updating: false,
          lastSavings: cursor.get('currentSavings'),
          showPopup: false,
          resetting: false
        });
        if (data.run) {
          endPriceCheck(data.run);
        }
        break;
      case 'resetNotification':
        resetNotification();
        break;
      case 'setRunId':
        const endFiredFirst = cursor.get('endFiredFirst');
        if (endFiredFirst !== data.runId) {
          startPriceCheck(data.runId);
          cursor.set(['endFiredFirst'], null);
        }
        break;
      case 'amazonResultsReceived':
        setBestAmazonResult(request.amazonResults, request.runId);
        break;
      default:
        console.log('unknown message', request);
    }
  }
}

window.handleMessage = handleMessage;

// Tooltips
export function setSeenNotificationTooltip(affiliate) {
  if (affiliate) {
    cursor.set(['seenNotificationAffiliateTooltip'], true);
    completeTooltipSteps('notificationAffiliateTooltip');
  } else {
    cursor.set(['seenNotificationTooltip'], true);
    completeTooltipSteps('notificationTooltip');
  }
}

export function setSeenModalTooltip(value) {
  cursor.set(['seenModalTooltip'], true);
  completeTooltipSteps('modalTooltip');
}

export function visitMerchant({details, cartPricing, run, title, meta}) {
  const clickId = uuid.v4().replace(/-/g, '');
  let paymentsSupport = hasFeature('affiliate_only')
    ? false
    : !!_.get(cartPricing, 'paymentsSupport');
  sendMetric('trackClick', 'checkout', 'express checkout', {
    view: 'productDetailModal',
    domain: location.hostname.replace(/^www\./, ''),
    pagePath: location.pathname,
    pageLocation: 'modal',
    matchDomain: details.product.vendor,
    matchUrl: details.product.url,
    matchId: details.id,
    quoteId: run.runId || run.id
  });
  if (_.get(details, 'product.vendor') === 'amazon.com') {
    sendMetric(
      'trackClick',
      'visitAmazon',
      '',
      _.assign(
        {
          view: 'productDetailModal',
          domain: location.hostname.replace(/^www\./, ''),
          pagePath: location.pathname,
          pageLocation: 'modal',
          matchDomain: details.product.vendor,
          matchUrl: details.product.url,
          matchId: details.id,
          quoteId: run.runId || run.id,
          clickId
        },
        meta
      )
    );
    paymentsSupport = false;
  } else if (!paymentsSupport) {
    sendMetric(
      'trackClick',
      'visitMerchant',
      'check out on',
      _.assign(
        {
          view: 'productDetailModal',
          domain: location.hostname.replace(/^www\./, ''),
          pagePath: location.pathname,
          pageLocation: 'modal',
          matchDomain: details.product.vendor,
          matchUrl: details.product.url,
          matchId: details.id,
          quoteId: run.runId || run.id,
          clickId
        },
        meta
      )
    );
  }

  if (details.product.url && details.product.url.indexOf('mock_click_id') === -1) {
    details.redirectUrl = `https://wikibuy.com/api/v1/redirect?r=true&url=${encodeURIComponent(
      details.product.url
    )}&clickId=mock_click_id`.replace('mock_click_id', clickId);
  }

  // replace mock_click_id in atcURL with clickId
  _.set(
    details,
    'details.atcURL',
    _.get(details, 'details.atcURL', '').replace('mock_click_id', clickId)
  );
  return checkout({
    paypal: title === 'paypal',
    detail: details,
    runId: run.runId || run.id,
    clickId,
    priceCheckId: window.priceCheckId,
    paymentsSupport
  });
}

export async function loadProduct(data) {
  // No need to fetch data we're fetching, or have
  const lastRunId = tree.get(['ProductPage', 'lastRunId']);
  if (lastRunId === data.runId) {
    return;
  }
  if (tree.get(['ProductPage'])) {
    tree.merge('ProductPage', {isFetching: true, lastRunId: data.runId});
  } else {
    tree.set('ProductPage', {isFetching: true, lastRunId: data.runId});
  }
  const productPage = await loadProductFromBg(data);
  if (productPage) {
    productPage.isFetching = false;
    tree.merge('ProductPage', productPage);
  } else {
    tree.merge('ProductPage', {isFetching: false});
  }
}

export async function loadPriceHistory(asin) {
  const priceHistory = await loadPriceHistoryFromBg(asin);
  if (tree.get('ProductPage')) {
    tree.merge('ProductPage', {priceHistory});
  } else {
    tree.set('ProductPage', {priceHistory});
  }
}

export async function updateFavorite(data) {
  await updateFavoriteFromBg(data);
}

export async function loadOfferHistory() {
  const offerHistory = await loadOfferHistoryFromBg();
  tree.merge('siteHubView', {offerHistory});
}

export function addToAmazonCart(result) {
  return addToAmazonCartFromBg(result);
}

export async function getPersonalizedData() {
  const personalizedData = await getPersonalizedDataFromBg();
  tree.merge('siteHubView', {personalizedData});
}
