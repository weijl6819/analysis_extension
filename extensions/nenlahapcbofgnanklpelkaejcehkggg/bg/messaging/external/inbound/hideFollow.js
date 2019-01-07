import {invokeInTab} from '../../notifications/index.js';
import _ from 'lodash';

export default async data => {
  const productUrl = _.get(data, 'product.url');
  const vendor = _.get(data, 'product.vendor');
  chrome.tabs.query({url: `*://*.${vendor}/*`}, tabs => {
    _.forEach(tabs, tab => {
      const url = tab.url || '';
      if (url.indexOf(productUrl) > -1) {
        invokeInTab(tab.id, 'hideFollow');
      }
    });
  });
};
