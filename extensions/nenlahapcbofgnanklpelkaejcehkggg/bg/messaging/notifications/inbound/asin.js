import {startRun} from 'logic/instant';

export default (request, tab) => {
  const data = {
    asin: request.asin,
    gtins: request.gtins,
    price: request.price,
    shipping: request.shipping,
    seller: request.seller,
    product: request.product,
    meta: {
      tab, // TODO
      atcData: request.atcData,
      feedback: request.feedback,
      dealId: request.dealId
    }
  };
  return startRun(data).then(({runId} = {}) => {
    return {runId};
  });
};
