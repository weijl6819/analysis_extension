import tree from 'state';
import _ from 'lodash';
import {startRun} from 'logic/instant';

const settingsCursor = tree.select('settings');

export default (request, tab) => {
  if (request.default) {
    settingsCursor.set('zipcode', request.zipcode);
  }
  if (request.inputData) {
    const data = _.clone(request.inputData);
    data.meta = {
      tab,
      atcData: request.atcData
    };
    startRun(data, request.zipcode);
  }
};
