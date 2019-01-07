import {runV3} from 'iv-wb-light/dist/iv-wb-light-chrome';
import tree from 'state';
import hasFeature from 'utility/hasFeature';
import Promise from 'bluebird';
import _ from 'lodash';

const settingsCursor = tree.select(['settings']);

export default async ({
  asin,
  userId,
  prime,
  zipcode,
  address,
  product,
  price,
  seller,
  meta = {}
}) => {
  prime =
    prime ||
    (typeof settingsCursor.get('prime') === 'boolean' ? settingsCursor.get('prime') : true);
  zipcode = zipcode || settingsCursor.get('zipcode');
  address = address || settingsCursor.get('address');
  const features = _.get(tree.get(['session']), 'features');
  const events = settingsCursor.get('events');
  if (product && !product.vendor) {
    product.vendor = 'amazon.com';
  }
  if (hasFeature('az_mk_res') || hasFeature('wbv2_list_est')) {
    meta.shouldGetAmazonList = true;
  }
  return new Promise(resolve => {
    runV3(
      {asin, userId, prime, zipcode, address, product, features, events, price, seller, meta},
      ({runId, type}) => {
        if (runId && type === 'complete') {
          resolve({runId});
        }
      }
    );
  });
};
