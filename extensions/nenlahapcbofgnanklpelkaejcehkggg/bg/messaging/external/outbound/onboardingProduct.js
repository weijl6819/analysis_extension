import {invokeInTab} from '../index.js';

export default (tabId, data) => {
  return invokeInTab(tabId, 'onboardingProduct', data);
};
