import {invokeInTab} from '../index';

export default (tabId, dealData) => {
  return invokeInTab(tabId, 'communityDealReceived', dealData);
};
