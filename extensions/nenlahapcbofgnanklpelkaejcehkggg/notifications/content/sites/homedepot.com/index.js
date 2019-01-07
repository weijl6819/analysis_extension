import _ from 'lodash';
import tree from 'state';
import getPriceFromSelector from '../../utility/getPriceFromSelector';
import loadEstimateAnnotation from '../../utility/loadEstimateAnnotation';
import uuid from 'node-uuid';
import hasFeature from 'utility/hasFeature';

async function getProductInfo() {
  try {
    const brand = document.querySelector('.sticky_brand_info');
    const sku = document.querySelector('[itemprop="productID"]').innerText;
    return {
      title: document.querySelector('[itemprop="name"]').getAttribute('content'),
      image: document.querySelector('[itemprop="image"]').src,
      price: document.querySelector('#ajaxPrice').getAttribute('content'),
      brand: brand && brand.innerText,
      gtin: document.querySelector('[itemprop="gtin13"]').getAttribute('content'),
      sku,
      url: window.location.href,
      wbpid: `homedepot.com_${sku}`,
      vendor: 'homedepot.com'
    };
  } catch (e) {
    console.log(e);
    return null;
  }
}

async function run() {
  // Get product info
  const product = await getProductInfo();
  if (_.get(product, 'gtin')) {
    loadEstimateAnnotation(
      {
        additionalClass: 'homedepot-product-page',
        insertAfterElement: document.querySelector('.og-offer')
      },
      {
        waitForFullRun: true,
        originVendor: 'homedepot.com',
        offersFrom: true,
        input: {
          product,
          unpricedResults: [
            {
              vendor: 'homedepot.com',
              product,
              atc: {
                method: 'POST',
                url: 'https://secure2.homedepot.com/mcc-cart/v2/Cart',
                headers: [
                  {
                    name: 'Origin',
                    value: 'https://www.homedepot.com'
                  },
                  {
                    name: 'Accept-Encoding',
                    value: 'gzip, deflate, br'
                  },
                  {
                    name: 'Host',
                    value: 'secure2.homedepot.com'
                  },
                  {
                    name: 'Accept-Language',
                    value: 'en-US,en;q=0.9'
                  },
                  {
                    name: 'User-Agent',
                    value:
                      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36'
                  },
                  {
                    name: 'content-type',
                    value: 'application/json'
                  },
                  {
                    name: 'accept',
                    value: 'application/json;charset=utf-8'
                  },
                  {
                    name: 'Referer',
                    value: 'https://www.homedepot.com/'
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
                    name: 'Content-Length',
                    value: '156'
                  }
                ],
                postData: {
                  mimeType: 'application/json',
                  text:
                    '{"CartRequest":{"itemDetails":[{"itemId":"301766885","quantity":"1","fulfillmentLocation":"78704","fulfillmentMethod":"ShipToHome"}],"localStoreId":"6542"}}'
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
  if (window.location.href.match(/\/p\//i)) {
    tree.set('trigger', 'productPage');
    window.addEventListener('DOMContentLoaded', () => run());
    active = true;
  }
  return {active};
}
