import _ from 'lodash';
import tree from 'state';
import loadEstimateAnnotation from '../../utility/loadEstimateAnnotation';
import uuid from 'node-uuid';
import hasFeature from 'utility/hasFeature';

function getTextFromSelectors(selectors) {
  let text = '';
  _.forEach(selectors, s => {
    const textEls = document.querySelectorAll(s);
    for (let i = 0; i < textEls.length; i++) {
      const textEl = textEls[i];
      if (textEl && textEl.innerText) {
        text += `${textEl.innerText}\n`;
      }
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
    const ogImage = getOGProperty('image');
    const image = ogImage
      ? ogImage.indexOf('//') === 0
        ? `https:${ogImage}`
        : ogImage
      : undefined;
    const schemaData = _(document.querySelectorAll('[type="application/ld+json"]'))
      .map(el => {
        return JSON.parse(el.innerText);
      })
      .value();
    const productData = _.chain(schemaData)
      .get('[0]@graph[0].@graph')
      .find(d => d['@type'] === 'Product')
      .value();

    const price =
      getTextFromSelectors(['[data-test="product-price"]']) || _.get(productData, 'offers.price');
    const sku = productData.sku;
    let gtin;
    const gtinMatches = (getTextFromSelectors(['.h-padding-b-tight']) || '').match(/UPC:\s*(\d+)/);
    if (gtinMatches && gtinMatches.length) {
      gtin = gtinMatches[1];
      while (gtin.length < 14) {
        gtin = `0${gtin}`;
      }
    }
    const brand = _.get(schemaData, '@graph[0].brand');
    const mpnMatches = (getTextFromSelectors(['.h-padding-b-tight']) || '').match(
      /Item Number.*:\s*(.*)\n/
    );
    let mpn;
    if (mpnMatches && mpnMatches.length) {
      mpn = mpnMatches[1].replace(/Item Number.*:\s*/, '');
    }
    return {
      title,
      image,
      price,
      sku,
      gtin,
      brand,
      mpn,
      url: window.location.href,
      vendor: 'target.com',
      wbpid: `target.com_${sku}`
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
        additionalClass: 'target-product-page',
        insertAfterElement: document.querySelector('[data-test="ratingFeedbackContainer"]')
      },
      {
        waitForFullRun: true,
        offersFrom: true,
        originVendor: 'target.com',
        input: {
          product,
          unpricedResults: [
            {
              vendor: 'target.com',
              product,
              atc: {
                method: 'POST',
                url:
                  'https://checkout-api-secure.target.com/order-api/cart/v5/cartitems?responseGroup=cart',
                httpVersion: 'HTTP/1.1',
                headers: [
                  {
                    name: 'Origin',
                    value: 'http://www.target.com'
                  },
                  {
                    name: 'Accept-Encoding',
                    value: 'gzip, deflate, br'
                  },
                  {
                    name: 'Host',
                    value: 'checkout-api-secure.target.com'
                  },
                  {
                    name: 'Accept-Language',
                    value: 'en-US,en;q=0.8'
                  },
                  {
                    name: 'User-Agent',
                    value:
                      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.116 Safari/537.36'
                  },
                  {
                    name: 'Content-Type',
                    value: 'application/json'
                  },
                  {
                    name: 'Accept',
                    value: '*/*'
                  },
                  {
                    name: 'Referer',
                    value: product.url
                  },
                  {
                    name: 'Cookie',
                    value: ''
                  },
                  {
                    name: 'Connection',
                    value: 'keep-alive'
                  },
                  {
                    name: 'Pragma',
                    value: 'no-cache'
                  },
                  {
                    name: 'Cache-Control',
                    value: 'no-cache'
                  }
                ],
                postData: {
                  mimeType: 'application/json',
                  text: `{"products":[{"partnumber":"${product.sku}","quantity":"1","age":"17"}]}`
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

function handleChange(mutations) {
  if (window.location.href.match(/\/p\//i)) {
    tree.set('trigger', 'productPage');
    setTimeout(run, 200);
  }
}

export default function getSite() {
  if (!hasFeature('ext_other_origins')) {
    return;
  }
  let active = false;
  const target = document.querySelector('title');
  const debouncedHandleChange = _.debounce(handleChange, 1000);
  const observer = new MutationObserver(debouncedHandleChange);
  observer.observe(target, {
    attributes: true,
    characterData: true,
    childList: true,
    subtree: true,
    attributeOldValue: true,
    characterDataOldValue: true
  });
  return {active};
}
