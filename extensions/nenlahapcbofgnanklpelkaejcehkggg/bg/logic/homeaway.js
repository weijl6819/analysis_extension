import xhr from '../utility/xhr';
import _ from 'lodash';
import {WIKIBUY_API} from 'constants';
import getSite from 'cache/siteCache';
import hasFeature from 'utility/hasFeature';

export default async function search(data) {
  const includeSimilarResults = hasFeature('hma_sim_results');
  if (includeSimilarResults) {
    data = _.assign(data, {priceSimilarResults: true});
  }
  const siteAPIData = await getSite('homeaway.com');
  const resp = await xhr('POST', `${WIKIBUY_API}/homeaway/get_match`, data);
  return {
    results: includeSimilarResults ? resp : _.filter(resp, r => r.exactMatch),
    cashback: _.get(siteAPIData, 'siteData.cashback')
  };
}
