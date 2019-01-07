import xhr from 'utility/xhr';
import {WIKIBUY_API} from 'constants';
import _ from 'lodash';

export default async data => {
  const results = await xhr('POST', `${WIKIBUY_API}/card_link/mogl_api`, {
    path: '/api/v2/venues/search',
    method: 'POST',
    payload: {
      lat: data.latitude,
      long: data.longitude,
      distance: 10
    }
  });
  const match = _.find(_.get(results, 'response.results.results'), result => {
    const distance = parseFloat(result.distance);
    if (!result.distance || result.distance < 0.05) {
      return true;
    } else if (
      distance < 1 &&
      result.name.replace(/-/g, ' ').indexOf(data.title.replace(/-/g, ' ')) > -1
    ) {
      return true;
    }
  });
  if (match) {
    match.dealType = 'cloBiz';
    return match;
  }
};
