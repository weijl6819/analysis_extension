import toggleMatchSurvey from '../../external/outbound/toggleMatchSurvey';
import {WIKIBUY_HOST} from 'constants';
import _ from 'lodash';

export default async data => {
  const id = _.get(data, 'productData.wbid');
  chrome.tabs.query({url: `*://*.${WIKIBUY_HOST}/*`}, tabs => {
    _.forEach(tabs, tab => {
      const url = tab.url || '';
      if (url.indexOf(id) > -1) {
        toggleMatchSurvey(tab.id, data);
      }
    });
  });
};
