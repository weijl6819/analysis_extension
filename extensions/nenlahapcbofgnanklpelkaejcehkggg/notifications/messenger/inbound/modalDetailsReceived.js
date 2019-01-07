import {invokeLocal} from '../index';

export default data => {
  invokeLocal('modalDetailsReceived', data);
};
