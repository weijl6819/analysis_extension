import xhr from '../utility/xhr';
import _ from 'lodash';
import street from '../utility/street';
import LRU from 'lru-cache';
import Promise from 'bluebird';
import moment from 'moment';
import {track} from 'utility/analytics';
import hasFeature from 'utility/hasFeature';
import findHotelMarriott from './marriott';
import {getCashbackByTag} from './cashback';

const UPDATE_SEARCH_DISTANCE = 30; // km
const cache = LRU({
  max: 15,
  maxAge: 1000 * 60 * 60 * 1 // 1 hour
});

function formatDate(date) {
  if (date.indexOf('%2F') > -1) {
    return date;
  }
  const components = date.split('/');
  const elements = [];
  _.forEach(components, (c, i) => {
    if (i < 2 && c.length === 1) {
      elements.push(`0${c}`);
    } else {
      elements.push(c);
    }
  });
  return elements.join('%2F');
}

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

function scoreAddress(address1, address2) {
  const addressVariations = street(address1);
  addressVariations.push(address1);
  return !!_.find(addressVariations, address => {
    return !!address2.match(address);
  });
}

function scoreResults(results, input) {
  const inputTitle = simpleWords(input.title);
  const inputAddress = simpleWords(input.address);

  const {latitude, longitude} = input;

  return _.map(results, r => {
    const lat = _.get(r, 'hotel.address.latitude');
    const long = _.get(r, 'hotel.address.longitude');
    const dx = parseFloat(latitude) - lat;
    const dy = parseFloat(longitude) - long;
    const distance = Math.pow(dx * dx + dy * dy, 0.5);

    const name = simpleWords(r.hotel.name);
    const address = simpleWords(r.hotel.address.line1);
    const nameScore = scoreWords(inputTitle, name);
    const addressScore = scoreWords(inputAddress, address);
    const addressMatch = scoreAddress(address.join(' '), inputAddress.join(' '));
    r.score = {distance, nameScore, addressMatch, addressScore, total: nameScore * addressScore};
    return r;
  });
}
function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}
function toDegrees(radians) {
  return radians * (180 / Math.PI);
}
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const rLat = toRadians(lat1);
  const rLat2 = toRadians(lat2);
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rLat) * Math.cos(rLat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
function midPoint(lat1, lon1, lat2, log2) {
  const dLng = toRadians(log2 - lon1);
  lat1 = toRadians(lat1);
  lat2 = toRadians(lat2);
  lon1 = toRadians(lon1);
  const bx = Math.cos(lat2) * Math.cos(dLng);
  const by = Math.cos(lat2) * Math.sin(dLng);
  return {
    latitude: toDegrees(
      Math.atan2(
        Math.sin(lat1) + Math.sin(lat2),
        Math.sqrt((Math.cos(lat1) + bx) * (Math.cos(lat1) + bx) + by * by)
      )
    ),
    longitude: toDegrees(lon1 + Math.atan2(by, Math.cos(lat1) + bx))
  };
}

async function hotelSearch(input) {
  const {checkIn, checkOut, adults, rooms, latitude, longitude} = input;
  const cacheKey = btoa(JSON.stringify({checkIn, checkOut, adults, rooms}));
  const results = cache.get(cacheKey);
  const userGroup = hasFeature('ext_ho_w3')
    ? 'wikibuy-3'
    : hasFeature('cug_inv')
      ? 'wikibuy-2'
      : 'wikibuy';
  if (
    results &&
    getDistanceFromLatLonInKm(
      parseFloat(_.get(results, 'region.latitude', 0)),
      parseFloat(_.get(results, 'region.longitude', 0)),
      parseFloat(latitude),
      parseFloat(longitude)
    ) <= UPDATE_SEARCH_DISTANCE
  ) {
    return results;
  } else {
    const url = `https://secured.hotelstorm.com/rest/search?adults=${adults}&checkIn=${checkIn}&checkOut=${checkOut}&currency=USD&hotelImageHeight=202&hotelImageWidth=302&language=en&latitude=${latitude}&longitude=${longitude}&rooms=${rooms}&userGroup=${userGroup}`;
    const headers = {
      authority: 'www.hotelstorm.com',
      'accept-language': 'en-US,en;q=0.8',
      accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
    };
    const resp = await xhr('GET', url, null, headers);
    cache.set(cacheKey, resp);
    return resp;
  }
}

async function formatHotelstormMatch({match, input, nights, regionId}) {
  const checkIn = formatDate(input.checkIn);
  const checkOut = formatDate(input.checkOut);
  const userGroup = hasFeature('ext_ho_w3')
    ? 'wikibuy-3'
    : hasFeature('cug_inv')
      ? 'wikibuy-2'
      : 'wikibuy';
  const resultURL = `https://www.hotelstorm.com/details?region=${regionId}&guests=${
    input.adults
  }&checkIn=${checkIn}&checkOut=${checkOut}&currency=USD&hotelImageHeight=202&hotelImageWidth=302&language=en&latitude=${
    input.latitude
  }&longitude=${input.longitude}&rooms=${input.rooms}&userGroup=${userGroup}&id=${
    match.hotel.id
  }&averagePrice=${match.lowestAveragePrice.amount}`;
  const finalPrice = Math.floor(parseFloat(match.lowestAveragePrice.amount * 100));
  const rewardAmount = Math.floor(parseFloat(_.get(match, 'partnerRewardResult.amount', 0) * 100));
  const discount = input.price - finalPrice;
  if (discount > 99 || !input.price || rewardAmount) {
    const hotelData = {
      discount: Math.floor(discount),
      title: match.hotel.name,
      url: resultURL,
      finalPrice,
      inputPrice: input.price,
      totalDiscount: Math.floor(discount) * nights,
      cashback: rewardAmount ? {reward: {amount: rewardAmount, type: 'fixed'}} : undefined
    };
    track('hotelSearchMatch', {
      matchDiscount: hotelData.discount,
      matchTitle: hotelData.title,
      matchUrl: hotelData.url,
      matchId: match.hotel.id,
      matchTotalDiscount: hotelData.totalDiscount,
      ...input
    });
    return hotelData;
  } else {
    track('hotelSearchMatch', {
      matchDiscount: 0,
      matchTitle: match.hotel.name,
      matchUrl: resultURL,
      matchId: match.hotel.id,
      matchTotalDiscount: 0,
      ...input
    });
  }
}

async function formatMarriottMatch({match, input}) {
  const cashback = await getCashbackByTag({url: 'https://marriott.com', tag: 'comp-hotel-offer'});
  const hotelData = {
    title: match.name,
    url: match.url,
    cashback,
    source: 'marriott'
  };
  track('hotelSearchMatch', {
    matchTitle: match.name,
    matchUrl: match.url,
    matchId: match.id,
    ...input
  });
  return hotelData;
}

function getHotelstormMatch(results, input) {
  results = scoreResults(results, input);
  let finalResult;
  let matches = _.filter(results, r => _.get(r, 'score.addressMatch'));
  if (matches.length > 1) {
    matches = _.filter(matches, r => _.get(r, 'score.nameScore') === 1);
    if (matches.length === 1) {
      finalResult = matches[0];
    }
  } else if (matches.length === 1) {
    finalResult = matches[0];
  }
  if (!finalResult) {
    matches = _.filter(results, r => r.score.distance < 0.0005 && r.score.nameScore > 0);
    if (matches.length === 1) {
      finalResult = matches[0];
    }
  }
  if (!finalResult) {
    results = _(results)
      .filter(r => _.get(r, 'score.total') > 0.67)
      .sort((a, b) => b.score.total - a.score.total)
      .value();
    finalResult = _.get(results, '[0]');
  }
  return finalResult;
}

async function findHotel(input) {
  input = _.cloneDeep(input);
  const checkIn = formatDate(input.checkIn);
  const checkOut = formatDate(input.checkOut);
  const searchData = {
    address: input.address || '',
    checkIn,
    checkOut,
    adults: input.adults,
    rooms: input.rooms,
    latitude: input.latitude,
    longitude: input.longitude,
    title: input.title || ''
  };
  let resp;
  if (
    hasFeature('ext_ho_mar') &&
    input.domain === 'expedia.com' &&
    !!searchData.title.match(
      /marriot|autograph collection|renaissance|delta|gaylord|residence inn|spring hill suites|fairfield inn|towneplace suites|protea|moxy/i
    )
  ) {
    resp = await findHotelMarriott(searchData);
  } else {
    resp = await hotelSearch(searchData);
  }
  if (!_.get(resp, 'results')) {
    try {
      track('hotelSearchError', {
        error: resp && JSON.stringify(resp),
        ...input
      });
      return;
    } catch (e) {}
  }
  const match =
    resp.source === 'marriott'
      ? _.get(resp, 'results[0]')
      : getHotelstormMatch(_.get(resp, 'results'), input);
  const nights = moment(new Date(input.checkOut)).diff(moment(new Date(input.checkIn)), 'days');
  if (match) {
    return resp.source === 'marriott'
      ? formatMarriottMatch({match, input})
      : formatHotelstormMatch({
          regionId: resp.region.id,
          match,
          input,
          nights
        });
  } else {
    track('hotelSearchNoMatch', {
      ...input
    });
  }
}

export function searchBetweenTwoPoints({checkIn, checkOut, adults, rooms, latLongs}) {
  const {latitude, longitude} = midPoint(
    latLongs[0].latitude,
    latLongs[0].longitude,
    latLongs[1].latitude,
    latLongs[1].longitude
  );
  return hotelSearch({checkIn, checkOut, adults, rooms, latitude, longitude});
}
export async function findMultple(hotels, meta) {
  await findHotel(_.assign(meta, hotels[0]));
  const results = await Promise.map(hotels, hotel => {
    return findHotel(_.assign(meta, hotel));
  });
  return _.compact(results);
}
export default findHotel;
