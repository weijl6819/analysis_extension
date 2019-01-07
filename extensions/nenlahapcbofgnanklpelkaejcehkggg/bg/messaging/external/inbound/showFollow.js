import {invokeInTab} from '../../notifications/index.js';
import _ from 'lodash';
import tldjs from 'tldjs';

let data = null;

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  const activeURL = _.get(data, 'details.product.url');
  const activeDomain = tldjs.getDomain(activeURL);
  const tabDomain = tldjs.getDomain(tab.url);
  if (activeURL && changeInfo.status === 'complete' && tab.active && tabDomain === activeDomain) {
    invokeInTab(tabId, 'showFollow', data);
    data = null;
  }
});

export default async ({details, run, productData}) => {
  data = {details, run, productData};
};
