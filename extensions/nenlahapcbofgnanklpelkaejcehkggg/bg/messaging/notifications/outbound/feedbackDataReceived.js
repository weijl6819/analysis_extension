import {invokeInTab} from '../index';

export default (tabId, feedbackData) => {
  return invokeInTab(tabId, 'feedbackDataReceived', feedbackData);
};
