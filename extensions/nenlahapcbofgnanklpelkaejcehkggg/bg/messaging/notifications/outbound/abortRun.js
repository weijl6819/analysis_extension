import {invokeInTab} from '../index';

export default (tabId, run) => {
  return invokeInTab(tabId, 'abortRun', {run});
};
