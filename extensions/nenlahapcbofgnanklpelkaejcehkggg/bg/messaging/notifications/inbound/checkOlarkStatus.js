import tree from 'state';
import xhr from 'utility/xhr';
import {WIKIBUY_API} from 'constants';
import _ from 'lodash';
import * as analytics from 'utility/analytics';

export default async (data, tab) => {
  const url = `${WIKIBUY_API}/chat`;
  return xhr('GET', url)
    .then(result => {
      const operatorsOnline = _.get(result, 'operators_online', 0) > 0;
      if (operatorsOnline) {
        analytics.track('showPdmChat', data);
      }
      return operatorsOnline;
    })
    .catch(err => {
      return false;
    });
};
