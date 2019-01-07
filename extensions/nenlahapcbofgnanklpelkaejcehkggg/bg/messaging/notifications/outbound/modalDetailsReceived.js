import {invokeInTab} from '../index';
import _ from 'lodash';

export default (tabId, cartData) => {
  const run = _.get(cartData, 'items[0]');
  const cartPricing = _.get(cartData, 'cartTotal');
  const feedbackData = _.get(cartData, 'feedbackData');
  const instantOffers = _.get(cartData, 'instantOffers');
  return invokeInTab(tabId, 'modalDetailsReceived', {
    asin: run.inputData.asin,
    gtins: run.inputData.gtins,
    modal: _.get(run, 'betterResults[0]'),
    run: _.assign(run, {
      runId: run.id || run.runId
    }),
    cartPricing,
    feedbackData,
    instantOffers
  });
};
