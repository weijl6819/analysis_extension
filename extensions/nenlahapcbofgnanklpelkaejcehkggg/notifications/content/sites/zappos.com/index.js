import _ from 'lodash';
import tree from 'state';
import loadEstimateAnnotation from '../../utility/loadEstimateAnnotation';
import hasFeature from 'utility/hasFeature';
import uuid from 'node-uuid';
import delay from 'utility/delay';

const productIds = {};
let currentSelects;
let mountPoint;

const onChangeDebounced = _.debounce(async (styles, sizing) => {
  await delay(1000);
  updateNotification(styles, sizing);
}, 1000);

async function getStyles() {
  const productId = document.querySelector('input[name="productId"]').value;
  if (productIds[productId]) {
    return productIds[productId];
  }
  const resp = await fetch(
    `https://api.zcloudcat.com/v3/productBundle?productId=${productId}&siteId=1&includeImages=true&includeSizing=true&entireProduct=true&includeBrand=true&includes=preferredSubsite&autolink=description,brandProductName`
  );
  const data = await resp.json();
  const styleData = _.pick(_.get(data, 'product[0]'), ['styles', 'sizing']);
  productIds[productId] = styleData;
  return styleData;
}

async function getProductInfo() {
  try {
    const {styles, sizing} = await getStyles();
    const formValues = getFormValues();
    const colorParent =
      styles && styles.length === 1
        ? styles[0]
        : _.find(styles, s => s.styleId === formValues.styleId);
    if (!colorParent) {
      return;
    }
    let variant;
    if (colorParent.stocks && colorParent.stocks.length === 1) {
      variant = colorParent.stocks[0];
    } else {
      _.find(styles, s => s.styleId === formValues.styleId);
      const sizeSizingData = sizing.valueIdToName[formValues.sizingId];
      const widthSizingData = sizing.valueIdToName[formValues.widthId];
      if (!sizeSizingData) {
        return;
      }
      const sizingValue = sizeSizingData ? sizeSizingData.value : null;
      const widthValue = widthSizingData ? widthSizingData.value : null;
      variant = _.find(
        colorParent.stocks,
        s =>
          s.size.indexOf(sizingValue) > -1 &&
          (_.isUndefined(formValues.widthId) || s.width === widthValue)
      );
    }
    if (!variant) {
      return;
    }
    const brand = document.querySelector('[itemprop="brand"] [itemprop="name"]');
    const sku = colorParent.productId;
    const gtin = `00${variant.upc}`;
    return {
      title: document.querySelector('h1 > [itemprop="name"]').innerText,
      image: document.querySelector('[itemprop="image"]').getAttribute('content'),
      price: colorParent.price || '$0',
      brand: brand && brand.innerText,
      gtin,
      asin: `${variant.asin}`,
      sku,
      stockId: variant.stockId,
      url: window.location.href,
      wbpid: `zappos.com_${gtin}`,
      vendor: 'zappos.com'
    };
  } catch (e) {
    console.log(e);
    return null;
  }
}

function getFormValues() {
  const colorSelect = document.querySelector('#pdp-color-select');
  const sizeSelect = document.querySelector('#pdp-size-select');
  const widthSelect = document.querySelector('#pdp-width-select');
  return {
    styleId: colorSelect ? colorSelect.value : undefined,
    sizingId: sizeSelect ? sizeSelect.value : undefined,
    widthId: widthSelect ? widthSelect.value : undefined
  };
}

async function updateNotification() {
  if (mountPoint && mountPoint.remove) {
    mountPoint.remove();
    mountPoint = null;
  }
  const product = await getProductInfo();
  if (_.get(product, 'gtin') || _.get(product, 'asin')) {
    loadNotif(product);
  }
}

async function run() {
  const selects = document.querySelectorAll(
    '#productRecap ~ div form[action="https://www.zappos.com/cartAddItem.do"] select'
  );
  if (!_.isEqual(currentSelects, selects)) {
    currentSelects = selects;
    [
      ...document.querySelectorAll(
        '#productRecap ~ div form[action="https://www.zappos.com/cartAddItem.do"] select'
      )
    ].forEach(() => {
      document.addEventListener('change', () => {
        onChangeDebounced();
      });
    });
  }
  setTimeout(() => updateNotification(), 1000);
}

async function loadNotif(inputProduct) {
  const {stockId, ...product} = inputProduct;
  document.querySelector('[itemscope] > :first-child').style.overflow = 'visible';
  mountPoint = await loadEstimateAnnotation(
    {
      additionalClass: 'wbext-zappos-product-page',
      insertAfterElement: _.last(
        document.querySelector(
          '#productRecap ~ div form[action="https://www.zappos.com/cartAddItem.do"]'
        ).parentElement.previousSibling.previousSibling.children
      )
    },
    {
      waitForFullRun: true,
      originVendor: 'zappos.com',
      offersFrom: true,
      noIncudeTaxShipping: true,
      input: {
        product,
        unpricedResults: [
          {
            vendor: 'zappos.com',
            product,
            atc: {
              method: 'POST',
              url: 'https://amazon.zappos.com/mobileapi/v1/cart',
              httpVersion: 'HTTP/1.1',
              headers: [
                {
                  name: 'Origin',
                  value: 'https://www.zappos.com'
                },
                {
                  name: 'Accept-Encoding',
                  value: 'gzip, deflate, br'
                },
                {
                  name: 'Host',
                  value: 'amazon.zappos.com'
                },
                {
                  name: 'X-Mafia-Session-Requested',
                  value: 'true'
                },
                {
                  name: 'User-Agent',
                  value:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36'
                },
                {
                  name: 'Content-Type',
                  value: 'application/json'
                },
                {
                  name: 'Accept-Language',
                  value: 'en-US,en;q=0.9'
                },
                {
                  name: 'Accept',
                  value: 'application/json'
                },
                {
                  name: 'Referer',
                  value: location.href
                },
                {
                  name: 'Connection',
                  value: 'keep-alive'
                },
                {
                  name: 'Cookie',
                  value: ''
                }
              ],
              postData: {
                mimeType: 'application/json',
                text: `{"items":[{"stockId":"${stockId}","quantity":1}]}`
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

export default function getSite() {
  if (true || !hasFeature('ext_other_origins')) {
    return;
  }
  window.addEventListener('DOMContentLoaded', () => {
    tree.set('trigger', 'productPage');
    let lastUrl;
    const checkProductPage = () => {
      if (lastUrl !== location.pathname) {
        lastUrl = location.pathname;
        if (location.pathname.match(/\/p\//i)) {
          run();
        }
      }
    };
    setInterval(checkProductPage, 1000);
    checkProductPage();
  });
  return {active: true};
}
