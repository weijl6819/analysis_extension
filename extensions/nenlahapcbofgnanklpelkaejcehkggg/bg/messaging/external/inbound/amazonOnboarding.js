import {amazonOnboarding as amazonOnboardingV2} from 'iv-wb-light/dist/iv-wb-light-chrome';
import onboardingProduct from '../outbound/onboardingProduct';
import Promise from 'bluebird';
import promisifyChromeFunctions from 'utility/promisifyChromeFunctions';
import _ from 'lodash';

promisifyChromeFunctions(chrome.tabs);

export default async ({userId, prime, zipcode}) => {
  const [tab] = await chrome.tabs.queryAsync({active: true, lastFocusedWindow: true});
  return new Promise(resolve => {
    amazonOnboardingV2(userId, zipcode, prime, null, data => {
      if (data && data.type === 'input' && !_.get(data, 'inputs.length')) {
        resolve(data);
        return;
      }
      const results = _.get(data, 'results', []);
      const result = _.last(results);
      const minutes = results.length * 20;
      const hours = minutes && minutes < 60 ? (minutes / 60).toFixed(2) : Math.round(minutes / 60);
      onboardingProduct(tab.id, {
        result: _.omit(result, ['results']),
        hours,
        percent: data.percent || 0
      });
      if (data.percent === 1.0) {
        resolve(data);
      }
    });
  });
};
