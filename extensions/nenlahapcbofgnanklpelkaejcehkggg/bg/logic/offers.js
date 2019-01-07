import tree from 'state';
import _ from 'lodash';
import Promise from 'bluebird';
import {getProductV2} from 'api/product';
import {getCart as getCartItems} from 'api/cart';
import {createRunObservable} from 'iv-wb-light/dist/iv-wb-light-chrome';

const CACHE_EXPIRATION = 1000 * 60 * 15; // cache 15 min
const cartMap = new Map();
const pricingMap = new Map();
const productMap = new Map();
const settingsCursor = tree.select(['settings']);

function cleanMaps() {
  const time = Date.now();
  pricingMap.forEach((pricing, wbid) => {
    if (pricing.expires < time) {
      cartMap.delete(pricing.estimateRunId);
      cartMap.delete(pricing.updatedPricingRunId);
      pricingMap.delete(wbid);
    }
  });
}

function getCachedCart({asin, gtin, vendor}) {
  const runs = _.values(tree.get(['runCache']));
  const run = _.find(runs, r => {
    const sku = _.get(r.cart, 'items[0].originResult.product.sku');
    const runGtin = _.get(r.cart, 'items[0].originResult.product.gtin');
    const runVendor = _.get(r.cart, 'items[0].originResult.product.vendor');
    const asinMatch = sku && asin === sku && vendor === runVendor;
    const gtinVendorMatch = runGtin && runVendor && gtin === runGtin && vendor === runVendor;
    return asinMatch || gtinVendorMatch;
  });
  if (run && run.cart) {
    return run.cart;
  }
}

async function fetchCart({runId, priceCheckId, product}) {
  const profileId = tree.get('profileId');
  const cart = await getCartItems({
    items: [{run_id: runId}],
    priceCheckId,
    profileId
  });
  cartMap.set(runId, {cart, product});
  return cart;
}

async function createRun(input) {
  return new Promise(resolve => {
    const runObservable = createRunObservable(input);
    let product;
    async function onNext({type, ...data}) {
      switch (type) {
        case 'runStart':
          pricingMap.set(input.wbid || `${input.product.vendor}-${input.product.gtin}`, {
            estimateRunId: data.estimateRunId,
            updatedPricingRunId: data.runId,
            expires: Date.now() + CACHE_EXPIRATION
          });
          let cart;
          product = data.product;
          if (data.estimateRunId) {
            cart = await fetchCart({
              runId: data.estimateRunId,
              priceCheckId: input.priceCheckId,
              product
            });
          }
          resolve({
            pricing: {
              estimateRunId: data.estimateRunId,
              updatedPricingRunId: data.runId
            },
            product: data.product,
            cart
          });
          break;
        case 'complete':
          await fetchCart({
            runId: data.runId,
            priceCheckId: input.priceCheckId,
            product
          });
          break;
        default:
          console.log('Unhandled run message');
      }
    }
    runObservable.subscribe({
      next: onNext,
      error: () => {},
      complete: () => {}
    });
  });
}

export async function getEstimate({asin, gtin, unpricedResults, product} = {}) {
  cleanMaps();
  // Check for completed run in caches
  if (product) {
    const pricing = pricingMap.get(product.wbid || `${product.vendor}-${product.gtin}`);
    const cachedCart = getCachedCart({asin, gtin, vendor: product.vendor});
    if (pricing && pricing.expires > Date.now()) {
      const cachedCartFromMap = cartMap.get(pricing.updatedPricingRunId);
      if (cachedCartFromMap) {
        return {
          product: _.merge({}, product, cachedCartFromMap.product),
          pricing,
          cart: cachedCartFromMap.cart
        };
      }
    } else if (cachedCart) {
      product = await getProductV2({asin, gtin});
      const runId = _.get(cachedCart, 'items[0].id');
      return {
        product: _.merge({}, product),
        pricing: {
          estimateRunId: runId,
          updatedPricingRunId: runId
        },
        cart: cachedCart
      };
    }
  } else {
    product = await getProductV2({asin, gtin});
  }
  const {prime, zipcode} = settingsCursor.get();
  const vendor = product.vendor || 'amazon.com';
  const run = await createRun({
    userId: tree.get(['session', 'id']),
    vendor,
    wbid: product.wbid,
    prime: typeof prime === 'boolean' ? prime : true,
    zipcode: zipcode || '78746',
    asin: asin || product.asin,
    meta: {
      shouldGetAmazonList: vendor === 'amazon.com'
    },
    product,
    unpricedResults
  });
  if (!_.get(run, 'pricing.updatedPricingRunId')) {
    return {
      error: 'Product not found'
    };
  }
  run.product = _.merge({}, product, run.product);

  return {
    ...run
  };
}

export async function getCart({runId}) {
  const cartFromMap = cartMap.get(runId);
  if (cartFromMap && cartFromMap.cart) {
    return cartFromMap.cart;
  } else {
    return false;
  }
}
