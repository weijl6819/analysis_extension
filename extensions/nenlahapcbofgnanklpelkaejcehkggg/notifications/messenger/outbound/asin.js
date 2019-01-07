import invoke, {invokeLocal} from 'messenger';

export default data => {
  invokeLocal('resetNotification');
  invokeLocal('setInputData', {inputData: data});
  return invoke('asin', data).then(resp => {
    if (resp && resp.runId) {
      invokeLocal('setRunId', {runId: resp.runId});
    }
  });
};
