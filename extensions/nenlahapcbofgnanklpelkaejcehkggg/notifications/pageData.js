import tree from 'state';
import sendMetric from 'utility/sendMetric';
import _ from 'lodash';
import * as linus from 'iv-linus';
import syncLinusCache from 'messenger/outbound/syncLinusCache';
import persistLinusData from 'messenger/outbound/persistLinusData';

window.__wb_timing.pageDataRequireAt = performance.now();

const siteAPIData = tree.get('siteAPIData');
linus
  .getPageData({
    pageTypes: _.get(siteAPIData, 'siteData.pageTypes'),
    domain: _.get(siteAPIData, 'meta.domain')
  })
  .then(pageData => {
    if (_.get(pageData, 'type')) {
      sendMetric('track', 'pageMeta', pageData, {
        integrations: {
          'Customer.io': false
        }
      });
    }
  });

linus.config.cacheStore = {
  get: key => {
    return syncLinusCache('get', key);
  },
  set: (key, value) => {
    return syncLinusCache('set', key, value);
  }
};
linus.config.sendMetric = (event, properties) => {
  sendMetric('track', event, properties, {
    integrations: {
      'Customer.io': false
    }
  });
};
linus.config.LOGGING_URL =
  __ENV__ === 'prod'
    ? 'https://client-logger-api.ivaws.com/log'
    : 'https://client-logger-api.dev.ivaws.com/log';

//  Start linus tracking
linus.checkPageData(window.location.href).then(data => data && persistLinusData(data));
