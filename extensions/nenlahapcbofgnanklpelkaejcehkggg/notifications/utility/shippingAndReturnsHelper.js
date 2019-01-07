import _ from 'lodash';

export default function shippingAndReturnsHelper(shippingAndReturns) {
  const returnsAccepted =
    _.find(shippingAndReturns, {name: 'Returns Accepted'}, null) ||
    _.find(shippingAndReturns, {name: 'Returns'}, null);
  const returnShippingCost = _.find(shippingAndReturns, {name: 'Return shipping cost'}, null);
  const returnWithin = _.find(shippingAndReturns, {name: 'Returns within'}, null);
  let returnShipping = '';
  let returnPeriod = '';

  if (_.get(returnsAccepted, 'value') === 'No') {
    returnShipping = '';
    returnPeriod = 'no returns';
  } else if (
    _.get(returnsAccepted, 'name') === 'Returns' &&
    _.get(returnsAccepted, 'value') === 'free within 30 days'
  ) {
    returnShipping = 'free return shipping';
    returnPeriod = '30 days';
  }

  if (returnShippingCost && returnShippingCost.value !== 'Yes') {
    returnShipping = 'free return shipping';
  }

  if (returnWithin && returnWithin.value) {
    returnPeriod = returnWithin.value.toLowerCase();
    returnPeriod = returnPeriod.replace('days', 'day');
  }

  return {
    returnPeriod,
    returnShipping
  };
}
