import {invokeLocal} from '../index';

export default data => {
  invokeLocal('abortRun', data);
};
