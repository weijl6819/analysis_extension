import * as analytics from '../utility/analytics';
import _ from 'lodash';
import xhr from '../utility/xhr';
import cheerio from 'cheerio';
import {search} from './deals';

const arg = {
  integrations: {
    'Customer.io': false
  }
};

export async function autosuggest(term) {
  const keyword = encodeURIComponent(term);
  const url = `https://completion.amazon.com/search/complete?method=completion&mkt=1&p=Gateway&l=en_US&sv=desktop&client=amazon-search-ui&x=String&search-alias=aps&q=${keyword}&qs=&cf=1&fb=1&sc=1`;
  const resp = await xhr('GET', url);
  const values = JSON.parse(resp.replace('completion = ', '').replace(';String();', ''));
  const suggestions = _.get(values, '[1]');

  const properties = {
    term,
    suggestions
  };
  analytics.track('amazonExtAutosuggest', properties, arg);

  return suggestions;
}

export default async function searchAmazon(term, lowPrice, highPrice, skipSearch) {
  try {
    const keyword = encodeURIComponent(term);
    let url = `https://www.amazon.com/s?&field-keywords=${keyword}`;
    if (lowPrice) {
      url = `${url}&low-price=${lowPrice}`;
    }
    if (highPrice) {
      url = `${url}&high-price=${highPrice}`;
    }
    const html = await xhr('GET', url);
    const $ = cheerio.load(html);
    const asins = [];
    $('.s-result-item[data-asin]').each((i, el) => {
      if (!$(el).find('.s-sponsored-list-header').length) {
        const asin = el.attribs['data-asin'];
        asins.push(asin);
      }
    });

    const properties = {
      term,
      asins
    };
    analytics.track('amazonExtSearch', properties, arg);
    if (!skipSearch) {
      return await search(term, asins);
    } else {
      return _.map(asins, a => {
        return {asin: a};
      });
    }
  } catch (e) {
    return null;
  }
}
