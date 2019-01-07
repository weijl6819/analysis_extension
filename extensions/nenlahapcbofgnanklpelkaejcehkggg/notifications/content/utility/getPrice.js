import getPriceFromSelector from './getPriceFromSelector';
import _ from 'lodash';
import delay from './delay';

function findPrice() {
  const selectors = [
    '#buyDealSection .offer-price',
    '#priceblock_dealprice:not(.a-hidden)',
    '#priceblock_saleprice',
    '#priceblock_ourprice',
    '.a-accordion-active #addToCart .header-price',
    '#unqualifiedBuyBox .a-color-price',
    '#olp_feature_div a'
  ];
  let price;
  _.forEach(selectors, s => {
    if (price) {
      return;
    }
    price = getPriceFromSelector(s, true);
  });
  return price;
}

export async function getPriceAsync(retries) {
  let price = findPrice();
  while (!price && retries > 0) {
    await delay(100);
    price = findPrice();
    --retries;
  }
  return price;
}

export default function getPrice() {
  return findPrice();
}
