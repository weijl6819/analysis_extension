import tree from 'state';
import _ from 'lodash';

export default ({runId, savings, betterResultsLength}) => {
  const runCache = tree.select('runCache');
  const runData = runCache.get([runId]) || {};
  const {cart, parentRunId} = runData;
  let parentRunData;
  let parentCart;
  if (parentRunId) {
    parentRunData = runCache.get([parentRunId]) || {};
    parentCart = parentRunData.cart;
    if (_.get(parentCart, 'items[0].status') !== 'complete') {
      return {
        isRunning: true,
        runId: parentRunId
      };
    } else if (
      _.get(parentCart, 'items[0].status') === 'complete' &&
      (_.get(parentCart, 'cartTotal.savings') !== savings ||
        _.get(parentCart, 'items[0].betterResults.length') !== betterResultsLength)
    ) {
      return {
        isRunning: false,
        runUpdated: true,
        cart: parentCart,
        runId: parentRunId
      };
    }
  } else if (cart) {
    if (_.get(cart, 'items[0].status') !== 'complete') {
      return {
        isRunning: true,
        runId: parentRunId || runId
      };
    } else if (
      _.get(cart, 'items[0].status') === 'complete' &&
      (_.get(cart, 'cartTotal.savings') !== savings ||
        _.get(cart, 'items[0].betterResults.length') !== betterResultsLength)
    ) {
      return {
        isRunning: false,
        runUpdated: true,
        cart,
        runId
      };
    }
  }
  return {
    isRunning: false
  };
};
