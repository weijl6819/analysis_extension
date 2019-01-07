import xhr from '../utility/xhr';
import _ from 'lodash';
import {WIKIBUY_API} from 'constants';

function simpleWords(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ');
}

function scoreWords(w1, w2) {
  const intersection = _.intersection(w1, w2);
  const minLength = Math.min(w1.join('').length, w2.join('').length);
  const length = intersection.join('').length;
  return length / minLength;
}

export default async function findHotel(input) {
  const resp = await xhr('POST', `${WIKIBUY_API}/marriott/get_match`, {
    lat: input.latitude,
    lon: input.longitude
  });
  const inputTitle = simpleWords(input.title || '');
  const inputAddress = simpleWords(input.address || '');
  const data = _.sortBy(resp, h => {
    return (
      scoreWords(inputTitle, simpleWords(h.name)) +
      scoreWords(inputAddress, simpleWords(h.streetAddress))
    );
  }).reverse();
  return {
    source: 'marriott',
    results: data && data.length ? data : null
  };
}
