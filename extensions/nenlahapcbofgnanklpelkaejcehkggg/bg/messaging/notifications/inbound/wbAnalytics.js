import * as analytics from 'utility/analytics';
import tree from 'state';
export default request => {
  try {
    if (request.priceCheckId) {
      tree.set('priceCheckId', request.priceCheckId);
      analytics.setPriceCheckId(request.priceCheckId);
    }
    analytics[request.method].apply(null, request.args);
  } catch (e) {}
};
