import _ from 'lodash';
import xhr from '../utility/xhr';
import regex from '../utility/regex';
import cheerio from 'cheerio';
import {fetchASINs, getSuggestions} from './deals';

let primeCache = null;
let nameCache = null;
let browseHistoryCache = null;

export async function checkPrime(getName) {
  if (primeCache !== null) {
    if (getName) {
      return {name: nameCache, prime: primeCache};
    } else {
      return primeCache;
    }
  }
  const url = 'https://www.amazon.com/dp/B00DBYBNEE';
  const headers = {};
  const html = await xhr('GET', url, null, headers);
  primeCache = html.indexOf('Prime Member Exclusives') !== -1;
  nameCache = regex(/Hello, ([A-Z][a-z]+)/, html);
  if (getName) {
    return {name: nameCache, prime: primeCache};
  }
  return primeCache;
}

export async function getBrowseHistory() {
  if (browseHistoryCache) {
    return browseHistoryCache;
  }
  const url = 'https://www.amazon.com/gp/history/ref=nav_timeline_view_history';
  const headers = {};
  const html = await xhr('GET', url, null, headers);
  const $ = cheerio.load(html);
  const asins = [];
  $('[data-asin]').each((i, el) => {
    try {
      const b = el.attribs['data-asin'];
      const asin = atob(b);
      if (asins.indexOf(asin) === -1) {
        asins.push(asin);
      }
    } catch (e) {}
  });
  browseHistoryCache = asins;
  return asins;
}

export async function getProductHistory() {
  const asins = await getBrowseHistory();
  const results = await fetchASINs(asins);
  return {results, asins};
}

export default async function getOnboardingResults() {
  try {
    const results = await getProductHistory();
    const suggestions = await getSuggestions(results.results);
    const history = _(results.results)
      .filter(a => {
        if (!a || !a.product || !a.matchPricing) {
          return false;
        }
        const d = _.find(results, {asin: a.asin});
        if (d) {
          a.source = d.source;
          if (!a.product.image) {
            a.product.image = d.image;
          }
          if (d.price) {
            a.savings = d.price - a.matchPricing.total;
          }
        }
        return a.savings >= 100 && _.get(a, 'product.image');
      })
      .sort((a, b) => {
        const ia = results.asins.indexOf(a.asin);
        const ib = results.asins.indexOf(b.asin);
        return ia - ib;
      })
      .value();

    return {history, suggestions};
  } catch (e) {
    return null;
  }
}
