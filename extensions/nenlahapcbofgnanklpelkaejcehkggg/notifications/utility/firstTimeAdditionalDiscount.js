import tree from 'state';
import hasFeature from './hasFeature';
import _ from 'lodash';

export default pricing => {
  if (!pricing || !pricing.total || tree.get(['events', 'hasOrdered'])) {
    return 0;
  }
  let discounts = [];
  if (hasFeature('checkout_discount_first_purchase_a')) {
    discounts = [{min: 1500, discount: 1000}];
  } else if (hasFeature('checkout_discount_first_purchase_b')) {
    discounts = [{min: 1500, discount: 500}];
  }
  const additionalDiscount = _.reduce(
    discounts,
    (accum, d) => {
      // If total meets min and is a better discount apply it
      if (pricing.total >= d.min && (!accum || d.discount > accum.discount)) {
        accum = d;
      }
      return accum;
    },
    null
  );
  return additionalDiscount ? additionalDiscount.discount : 0;
};
