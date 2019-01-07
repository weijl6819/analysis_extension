import numeral from 'numeral';
import _ from 'lodash';
export default function formatCurrency(cents, {removeCents, noDollarSign} = {}) {
  if (!_.isFinite(cents)) {
    cents = 0;
  }
  return numeral(cents / 100).format(
    removeCents ? `${noDollarSign ? '' : '$'}0,0` : `${noDollarSign ? '' : '$'}0,0.00`,
    Math.floor
  );
}
