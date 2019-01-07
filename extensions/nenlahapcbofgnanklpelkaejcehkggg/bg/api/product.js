import _ from 'lodash';
import xhr from 'utility/xhr';
import {WIKIBUY_API} from 'constants';

export function getProduct(body) {
  return xhr('POST', `${WIKIBUY_API}/product`, body);
}

export async function getAlternatives(body) {
  return xhr('POST', `${WIKIBUY_API}/alternatives`, body);
}

export async function getVariants(body) {
  return xhr('POST', `${WIKIBUY_API}/variants`, body);
}

export async function getPriceHistory(body) {
  const data = xhr('GET', `${WIKIBUY_API}/priceHistory?origin_wbpid=${body.origin_wbpid}`);
  if (data && data.items) {
    data.items = _.filter(data.items, item => item.origin_total_p50 && item.match_total_p50);
  }
  return data;
}

export async function getOfferHistory(body) {
  return xhr('GET', `${WIKIBUY_API}/offerHistory`);
}

export async function getProductV2(body) {
  return xhr(
    'GET',
    `${WIKIBUY_API}/productV2?${
      body.asin ? `asin=${body.asin}` : body.gtin ? `gtin=${body.gtin}` : ''
    }`,
    body
  );
}

export async function runPricing(body) {
  return xhr('POST', `${WIKIBUY_API}/run/runV3`, body);
}

export async function isRunComplete(id) {
  return xhr('GET', `${WIKIBUY_API}/run/${id}/isComplete`);
}
