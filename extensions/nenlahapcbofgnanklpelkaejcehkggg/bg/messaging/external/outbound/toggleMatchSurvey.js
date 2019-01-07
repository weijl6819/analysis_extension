import {invokeInTab} from '../index.js';

export default (tabId, data) => {
  return invokeInTab(tabId, 'toggleMatchSurvey', data);
};
