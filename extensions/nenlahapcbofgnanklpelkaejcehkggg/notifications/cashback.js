import tree from 'state';
import _ from 'lodash';
import setBrowserAction from 'messenger/outbound/setBrowserAction';
import siteCache from 'messenger/outbound/siteCache';
import tldjs from 'tldjs';
import moment from 'moment';
import {initCashback} from 'actions/cashbackActions';
import dewey from './utility/dewey';
import Promise from 'bluebird';
import hasFeature from 'utility/hasFeature';
import getUser from 'messenger/outbound/getUser';
import loadCashbackNotification from 'utility/loadCashbackNotification';

window.__wb_timing.cashbackRequireAt = performance.now();

let cashbackVisible;

function fetchInitialData() {
  return Promise.all([getUser(), siteCache(), initCashback()]).spread(
    (resp, siteAPIData, cashback) => {
      if (resp) {
        tree.set('session', _.get(resp, 'session'));
        tree.set('events', _.get(resp, 'settings.events'));
        tree.set('settings', _.get(resp, 'settings'));
        tree.set('couponsDisabledSites', _.get(resp, 'couponsDisabledSites'));
        tree.set('couponsAffiliateDisabledSites', _.get(resp, 'couponsAffiliateDisabledSites'));
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
  const cashback = tree.get('cashback');
  tree.set('cashbackVisible', false);
  const domain = tldjs.getDomain(location.href);
  if (
    tree.get(['couponsDisabledSites', `${domain}_${tree.get('tabId')}`]) > moment().unix() ||
    tree.get(['couponsDisabledSites', `${domain}_all`]) > moment().unix()
  ) {
    return false;
  }
  setBrowserAction({active: !!cashback, cashback});

  const deweyResult = tree.get(['deweyResult']);
  checkCashBack(deweyResult);
  // TODO: move dewey into pageData; subscribe to page data and listen for cashback page type
  setupCashbackListener();
}

async function setupCashbackListener() {
  dewey.emitter.on('result', result => {
    checkCashBack(result);
  });
}

async function checkCashBack(deweyResult) {
  if (tree.get('cashbackVisible') || !deweyResult || cashbackVisible) {
    return;
  }
  cashbackVisible = true;
  loadCashbackNotification(deweyResult).then(() => {
    cashbackVisible = tree.get('cashbackVisible');
  });
}

if (document.readyState !== 'loading') {
  init();
} else {
  document.addEventListener('DOMContentLoaded', init);
}
