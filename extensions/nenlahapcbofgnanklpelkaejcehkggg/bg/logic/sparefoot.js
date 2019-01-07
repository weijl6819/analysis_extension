import xhr from 'utility/xhr';
import {WIKIBUY_API} from 'constants';
import _ from 'lodash';

export default async data => {
  const results = await xhr(
    'GET',
    `${WIKIBUY_API}/storage-unit?location=${data.latitude},${data.longitude}`
  );
  const match = _.find(results, result => {
    const distance = parseFloat(result.distance);
    if (result.distance === 0) {
      return true;
    } else if (distance < 1 && result.name.indexOf(data.title) > -1) {
      return true;
    }
  });
  if (match) {
    match.dealType = 'storageUnit';
    return match;
  }
};
