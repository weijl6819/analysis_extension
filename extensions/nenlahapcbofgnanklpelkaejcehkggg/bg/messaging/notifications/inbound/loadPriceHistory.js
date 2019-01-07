import {getPriceHistory} from 'api/product';

export default async (asin, tab) => {
  return await getPriceHistory({origin_wbpid: `amazon.com_${asin}`});
};
