import moment from 'moment';
import _ from 'lodash';

const shippingSpeeds = {
  Overnight: 'Overnight',
  Expedited: 'Expedited',
  Standard: 'Standard',
  NoRush: 'No rush'
};
export default function getShippingSpeed(shippingSpeed) {
  return shippingSpeeds[shippingSpeed];
}

const shippingMeta = {
  Overnight: {
    label: 'Overnight shipping',
    description: '1-2 business days'
  },
  Expedited: {
    label: 'Expedited shipping',
    description: 'less than a week'
  },
  Standard: {
    label: 'Standard shipping',
    description: 'about a week'
  },
  NoRush: {
    label: 'No rush shipping',
    description: 'more than a week'
  },
  Prime: {
    label: 'Prime shipping',
    description: '2 business days'
  }
};

export function getShippingMeta(shippingKey) {
  return shippingMeta[shippingKey];
}

function orderStatusMap(status, shippingKey, arrival) {
  const uiStatus = {
    placed: {
      value: 'placed',
      description: 'your order has been placed.'
    },
    canceled: {
      value: 'canceled',
      description: 'your order has been canceled.'
    },
    returned: {
      value: 'returned',
      description: 'your order has been returned.'
    },
    preparingToShip: {
      value: 'preparing-to-ship',
      description: 'your order is preparing to ship.'
    },
    onTheWay: {
      value: 'on-the-way',
      description: 'your order is on the way.'
    },
    delivered: {
      value: 'delivered',
      description: 'your order has been delivered!'
    }
  };

  const shippingStatus = uiStatus[status];
  if (shippingStatus) {
    if (status === 'delivered') {
      shippingStatus.shipping = 'delivered';
    } else if (arrival) {
      shippingStatus.shipping = `arrives by ${moment(arrival).format('dddd MMM. D')}`;
    } else {
      shippingStatus.shipping = `arrives in ${_.get(
        getShippingMeta(shippingKey),
        'description',
        'about a week'
      )}`;
    }
  }
  return shippingStatus || {};
}

const orderStatuses = {
  pending: 'placed',
  received: 'placed',
  preauthorized: 'placed',
  placing_order: 'placed',
  order_confirmation_sent: 'placed',
  canceled: 'canceled',
  merchant_order_placed: 'preparingToShip',
  shipped: 'onTheWay',
  shipping_confirmation_sent: 'onTheWay',
  delivered: 'delivered',
  return_pending: 'delivered',
  returned: 'returned',
  refunded: 'refunded',
  closed: 'delivered'
};

export function getOrderStatus(statusKey, shippingKey, arrival) {
  return orderStatusMap(orderStatuses[statusKey], shippingKey, arrival);
}

export function getInstantOrderStatus(statusKey, arrival, sent) {
  const status = orderStatuses[statusKey];
  if (
    status === 'canceled' ||
    status === 'delivered' ||
    status === 'return_pending' ||
    status === 'refunded' ||
    status === 'returned' ||
    status === 'closed'
  ) {
    return {
      status,
      hasItem: true,
      statusKey: statusKey
    };
  } else if (sent) {
    return {
      status: 'arrives by ' + moment.utc(arrival).format('dddd MMM. D')
    };
  } else {
    return {
      status: 'arriving ' + moment.utc(arrival).format('dddd MMM. D')
    };
  }
}
