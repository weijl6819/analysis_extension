window.__wb_timing.siteRequireAt = performance.now();

import tree from 'state';
import _ from 'lodash';
import getUser from 'messenger/outbound/getUser';
import initNotificationApp from 'messenger/outbound/initNotificationApp';
import siteCache from 'messenger/outbound/siteCache';
import setBrowserAction from 'messenger/outbound/setBrowserAction';
import initSite from 'content/utility/getSite';
import delay from './content/utility/delay';
import hasFeature from 'utility/hasFeature';
import Promise from 'bluebird';
import dewey from 'utility/dewey';
import sendMetric from 'utility/sendMetric';
import isSuspendedAccount from 'utility/isSuspendedAccount';

function fetchInitialData() {
  return Promise.all([getUser(), siteCache()]).spread((resp, siteAPIData) => {
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
async function init() {
  await initialDataPromise;
  if (isSuspendedAccount()) {
    return;
  }
  // Wait for document body
  while (!document || !document.body) {
    await delay(50);
  }

  // reset browser action
  setBrowserAction({active: true});
  initSite();
}

async function onDOMReady() {
  await initialDataPromise;
  if (isSuspendedAccount()) {
    return;
  }
  const siteAPIData = tree.get('siteAPIData');

  //  setup defaults prior to calling scripts

  dewey.setDefaultConfig(siteAPIData);
  const initProms = [];
  const pageDataEnabled = !!_.get(siteAPIData, 'meta.page_data_enabled');
  if (pageDataEnabled) {
    initProms.push(initNotificationApp({name: 'pageData'}));
  }
  await Promise.all(initProms);

  const siteData = _.get(siteAPIData, 'siteData');
  if (!_.isEmpty(siteData)) {
    //  startup dewey
    const logAllDewey = hasFeature('log_all_dewey');
    const startDate = new Date();
    dewey.emitter.on('result', result => {
      if (result.callSource === 'internal') {
        const duration = new Date() - startDate;
        tree.set(['deweyResult'], result);
        const pageType = _.get(result, 'pageType');
        if (pageType || logAllDewey) {
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
    });
    dewey.start();
  }
}

init();

if (document.readyState !== 'loading') {
  onDOMReady();
} else {
  document.addEventListener('DOMContentLoaded', onDOMReady);
}
