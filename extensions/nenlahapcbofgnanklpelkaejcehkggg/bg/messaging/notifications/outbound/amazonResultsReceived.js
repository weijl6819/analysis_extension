import {invokeInTab} from '../index';

export default (tabId, {runId, amazonResults}) => {
  return invokeInTab(tabId, 'amazonResultsReceived', {
    runId,
    amazonResults
  });
};
