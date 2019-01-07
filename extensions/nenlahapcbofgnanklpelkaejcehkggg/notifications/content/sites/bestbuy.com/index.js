import _ from 'lodash';
import tree from 'state';
import getPriceFromSelector from '../../utility/getPriceFromSelector';
import loadEstimateAnnotation from '../../utility/loadEstimateAnnotation';
import uuid from 'node-uuid';
import hasFeature from 'utility/hasFeature';

function getTextFromSelectors(selectors) {
  let text;
  _.forEach(selectors, s => {
    if (text) {
      return;
    }
    const textEl = document.querySelector(s);
    if (textEl && textEl.innerText) {
      text = textEl.innerText;
    }
  });
  return text;
}

function getOGProperty(property) {
  const selector = `[property="og:${property}"]`;
  const el = document.querySelector(selector);
  if (el) {
    return el.content;
  }
  return null;
}

async function getProductInfo() {
  try {
    const title = getOGProperty('title');
    const image = getOGProperty('image');
    const schemaData = _(document.querySelectorAll('[type="application/ld+json"]'))
      .map(el => {
        return JSON.parse(el.innerText);
      })
      .find(d => d['@type'] === 'Product');
    const price = getTextFromSelectors(['.pb-purchase-price']) || _.get(schemaData, 'offers.price');
    const sku = getTextFromSelectors(['#sku-value']) || schemaData.sku;
    const gtin = schemaData.gtin13;
    const brand = title.split(' - ')[0];
    const mpn = getTextFromSelectors(['#model-value']) || schemaData.model;
    return {
      title,
      image,
      price,
      sku,
      gtin,
      brand,
      mpn,
      url: window.location.href,
      vendor: 'bestbuy.com',
      wbpid: `bestbuy.com_${sku}`
    };
  } catch (e) {
    return null;
  }
}

async function run() {
  // Get product info
  const product = await getProductInfo();
  if (_.get(product, 'gtin')) {
    loadEstimateAnnotation(
      {
        additionalClass: 'bestbuy-product-page',
        insertAfterElement: document.querySelector('.price-block')
      },
      {
        waitForFullRun: true,
        offersFrom: true,
        originVendor: 'bestbuy.com',
        input: {
          product,
          unpricedResults: [
            {
              vendor: 'bestbuy.com',
              product,
              atc: {
                method: 'POST',
                url: 'https://www.bestbuy.com/cart/api/v1/addToCart',
                headers: [
                  {
                    name: 'origin',
                    value: 'https://www.bestbuy.com'
                  },
                  {
                    name: 'accept-encoding',
                    value: 'gzip, deflate, br'
                  },
                  {
                    name: 'accept-language',
                    value: 'en-US,en;q=0.9'
                  },
                  {
                    name: 'user-agent',
                    value:
                      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36'
                  },
                  {
                    name: 'content-type',
                    value: 'application/json; charset=UTF-8'
                  },
                  {
                    name: 'accept',
                    value: 'application/json'
                  },
                  {
                    name: 'referer',
                    value: window.location.href
                  },
                  {
                    name: 'cookie',
                    value: ''
                  }
                ],
                postData: {
                  mimeType: 'application/json; charset=UTF-8',
                  text: `{"items":[{"skuId":"${product.sku}"}]}`
                },
                data: {
                  raw: `{"items":[{"skuId":"${product.sku}"}]}`
                }
              },
              details: {},
              meta: {
                graphLink: true
              },
              id: uuid.v4()
            }
          ]
        }
      }
    );
  }
}

export default function getSite() {
  if (!hasFeature('ext_other_origins')) {
    return;
  }
  let active = false;
  if (window.location.href.match(/site\/.*\.p\?.*skuId=/i)) {
    tree.set('trigger', 'productPage');
    window.addEventListener('DOMContentLoaded', () => run());
    active = true;
  }
  return {active};
}
