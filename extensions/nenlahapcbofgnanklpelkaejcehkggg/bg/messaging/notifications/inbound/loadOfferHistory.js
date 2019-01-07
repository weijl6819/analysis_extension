import {getOfferHistory} from 'api/product';

export default async (asin, tab) => {
  return await getOfferHistory();
};
