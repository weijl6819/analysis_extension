import {invokeLocal} from '../index';

export default data => {
  invokeLocal('amazonResultsReceived', data);
};
