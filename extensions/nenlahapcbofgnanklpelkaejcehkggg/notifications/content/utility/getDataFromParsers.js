import getPriceFromSelector from './getPriceFromSelector';
import _ from 'lodash';
import delay from './delay';
import Promise from 'bluebird';

function findPrice(selectors, oneSelector) {
  let price;
  _.forEach(selectors, s => {
    if (price) {
      return;
    }
    price = getPriceFromSelector(s, true);
  });
  return price;
}

export async function getPriceAsync(selectors, oneSelector, retries) {
  let price = findPrice(selectors, oneSelector);
  while (!price && retries > 0) {
    await delay(100);
    price = findPrice(selectors, oneSelector);
    --retries;
  }
  return price;
}

function findValue(selectors, oneSelector) {
  let value;
  _.forEach(selectors, s => {
    if (value) {
      return;
    }
    const els = document.querySelectorAll(s);
    if (els.length) {
      if (oneSelector) {
        if (els.length === 1) {
          value = els[0].innerText.trim();
        }
      } else {
        value = value = els[0].innerText.trim();
      }
    }
  });
  return value;
}

export async function getValueAsync(selectors, oneSelector, retries) {
  let value = findValue(selectors, oneSelector);
  while (!value && retries > 0) {
    await delay(100);
    value = findValue(selectors, oneSelector);
    --retries;
  }
  return value;
}

export async function getDataFromParser(parser) {
  let data;
  if (parser.type === 'price') {
    data = await getPriceAsync(parser.selectors, parser.oneSelector, parser.retries);
  } else {
    data = await getValueAsync(parser.selectors, parser.retries);
  }
  return {
    key: parser.key,
    data
  };
}

export default async function getDataFromParsers(parsers) {
  const data = {};
  const promises = _.map(parsers, parser => getDataFromParser(parser));
  const results = await Promise.all(promises);
  _.forEach(results, r => {
    if (r) {
      data[r.key] = r.data;
    }
  });
  return data;
}
