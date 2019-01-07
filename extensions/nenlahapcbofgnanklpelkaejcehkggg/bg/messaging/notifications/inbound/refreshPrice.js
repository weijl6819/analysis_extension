import {startRun} from 'logic/instant';
import _ from 'lodash';

export default (request, tab) => {
  if (request.inputData) {
    const data = _.clone(request.inputData);
    data.meta = {
      tab,
      atcData: request.atcData
    };
    startRun(data);
  }
};
