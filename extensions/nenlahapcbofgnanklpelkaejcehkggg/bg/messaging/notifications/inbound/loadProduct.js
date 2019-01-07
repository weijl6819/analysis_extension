import {getProduct} from 'api/product';
import _ from 'lodash';

export default async (data, tab) => {
  return await getProduct(_.merge(data, {forceImage: true}));
};
