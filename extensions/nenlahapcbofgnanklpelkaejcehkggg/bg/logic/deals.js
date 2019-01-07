import tree from '../state';
import _ from 'lodash';
import xhr from '../utility/xhr';
import {WIKIBUY_API} from 'constants';

const prodOverride = false;
const endpoint = prodOverride ? 'https://wikibuy.com/api/v1' : WIKIBUY_API;
const settingsCursor = tree.select(['settings']);

export async function fetchASINs(asins) {
  const url = `${endpoint}/offer`;
  const data = {asins, force_image: true, count: asins.length};
  return await xhr('POST', url, data);
}

export async function fetchASIN(asin) {
  const url = `${endpoint}/offer`;
  const data = {asin, force_image: true};
  return await xhr('POST', url, data);
}

export async function getSuggestions(products) {
  const url = `${endpoint}/suggestion`;
  const data = {products};
  return await xhr('POST', url, data);
}

export async function search(term, asins) {
  const url = `${endpoint}/offer`;
  const data = {asins, filters: {term}, force_image: true};
  const results = await xhr('POST', url, data);
  if (!asins) {
    return results;
  }
  return _(results)
    .map((r, i) => {
      r.index = i;
      r.asinIndex = asins.indexOf(r.asin);
      if (r.asinIndex === -1) {
        r.asinIndex = asins.length + i;
      }
      return r;
    })
    .sort((a, b) => a.asinIndex - b.asinIndex)
    .map(r => {
      delete r.asinIndex;
      return r;
    })
    .value();
}

async function getTotal({price, shipping, zipcode, vendor, seller}) {
  if (!price) {
    return null;
  }
  const url = `https://instant.wikibuy.com/v1/taxInfo/?vendor=${vendor}&zipcode=${zipcode}`;
  const taxData = await xhr('GET', url);
  if (!shipping) {
    shipping = 0;
  }
  let total = price + shipping;
  const taxRate = _.get(taxData, 'taxRate');
  if (taxRate) {
    total += price * taxRate + (taxData.taxOnShipping && shipping ? shipping * taxRate : 0);
  }
  return parseInt(total);
}

export async function getDeal(data) {
  const {gtin, brand, mpn, asin, vendor, showAmazonSavings} = data;
  const url = `${endpoint}/offer`;
  const postData = {force_image: true};
  if (gtin) {
    postData.gtins = [gtin];
  }
  if (asin) {
    postData.asins = [asin];
  }
  if (brand && mpn && brand.length && mpn.length) {
    postData.brand = brand;
    postData.mpn = mpn;
  }
  const resultPromise = xhr('POST', url, postData);

  const {zipcode} = settingsCursor.get();
  data.zipcode = zipcode;
  const pricePromise = getTotal(data);

  const deals = await resultPromise;
  if (deals && deals.length) {
    const deal = _.get(deals, '[0]');
    if (showAmazonSavings) {
      return deal;
    }
    const total = await pricePromise;
    if (total) {
      const totalDiff = total - deal.originPricing.total;
      const amazonTotal = deal.originPricing.total;
      if (deal.savings <= 0) {
        deal.matchPricing.total = amazonTotal;
      }
      deal.originPricing.total = total;
      deal.savings += totalDiff;
      if (deal.savings < 0) {
        deal.savings = 0;
      }
    } else {
      // Different UI if we're missing origin total
      deal.noTotal = true;
    }
    deal.sourceVendor = vendor;
    return deal;
  }
}

export async function getDeals(asins) {
  const url = `${endpoint}/offer`;
  const data = {asins, force_image: true};
  return await xhr('POST', url, data);
}
