import _ from 'lodash';
import xhr from '../utility/xhr';
import regex from '../utility/regex';
import delay from '../utility/delay';
import Promise from 'bluebird';

// Store orders that we've already received to minimize redundant data
async function getCachedOrders() {
  return new Promise(resolve => {
    chrome.storage.local.get('fetchedEbaySellerData', ({fetchedEbaySellerData}) => {
      let fetchedOrderIds = [];
      if (fetchedEbaySellerData) {
        fetchedOrderIds = _.cloneDeep(fetchedEbaySellerData);
      } else {
        fetchedOrderIds = [];
      }
      resolve(fetchedOrderIds);
    });
  });
}

async function updateCachedOrders(fetchedEbaySellerData) {
  return new Promise(resolve => {
    chrome.storage.local.set({fetchedEbaySellerData}, () => {
      resolve(true);
    });
  });
}

function converPrice(s) {
  if (!s) {
    return null;
  }
  return parseInt(s.replace(/[^0-9]/gi, ''));
}

function convertDate(d, addYear) {
  try {
    if (!d) {
      return null;
    }
    let date;
    if (addYear) {
      date = new Date(d + ' 2016');
      let diff = new Date().getTime() - date.getTime();
      if (diff < 0) {
        diff *= -1;
      }
      if (diff > 90 * 24 * 60 * 60 * 1000) {
        date = new Date(d + ' 2017');
      }
    } else {
      date = new Date(d);
    }
    return date.toISOString();
  } catch (e) {
    return null;
  }
}

async function getItems(url, attempts) {
  const headers = {
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.8'
  };
  const response = await xhr('GET', url, null, false, headers);
  if (_.get(response, 'data.status') !== 'Success') {
    await delay(2000);
    if (attempts) {
      return await getItems(url, attempts - 1);
    }
  } else {
    return _.get(response, 'data.items');
  }
}

export default async function getOrderStats() {
  try {
    const fetchedOrderIds = await getCachedOrders();
    const promises = [
      getItems(
        'http://www.ebay.com/myb/PurchaseHistoryOrdersContainer?ipp=25&Period=1&Filter=1',
        2
      ),
      getItems(
        'http://www.ebay.com/myb/PurchaseHistoryReturnsContainer?ipp=25&Period=1&Filter=1',
        2
      )
    ];
    const results = await Promise.all(promises);
    const items = _.flatten(results);
    const orders = _(items)
      .map(item => {
        const orderItems = _.get(item, 'data.items');
        return _.map(orderItems, d => {
          const price = converPrice(_.get(d, 'data.buyingInfo.price'));
          const shipping_price = converPrice(_.get(d, 'data.buyingInfo.shippingPrice'));
          let seller_percent = _.get(item, 'data.orderInfo.sellerInfo.fbPercent');
          if (seller_percent) {
            seller_percent = parseFloat(seller_percent);
          }
          let seller = _.get(item, 'data.orderInfo.sellerInfo.login');
          if (!seller) {
            if (item.actions) {
              const otherItems = _.find(item.actions, {label: 'Save this seller'});
              if (otherItems) {
                const url = _.get(otherItems, 'actionParam.url');
                if (url) {
                  seller = regex(/sellerid=(.*)&/, url);
                }
              }
            }
          }
          const r = {
            seller,
            seller_id: _.get(item, 'data.orderInfo.sellerInfo.id'),
            seller_score: _.get(item, 'data.orderInfo.sellerInfo.fbScore'),
            seller_percent,
            title: _.get(item, 'data.orderInfo.orderItemsTitle'),
            order_date: convertDate(_.get(item, 'data.orderInfo.orderDate')),
            order_id: _.get(item, 'data.orderInfo.orderId'),
            order_state: _.get(item, 'data.orderInfo.orderStats.displayState'),
            refund_status: _.get(d, 'data.itemInfo.lineItemStates.refundStatus'),
            return_status: _.get(d, 'data.itemInfo.lineItemStates.returnStatus'),
            cancel_status: _.get(d, 'data.itemInfo.lineItemStates.cancelStatus'),
            item_id: _.get(d, 'data.itemInfo.itemId'),
            transaction_id: _.get(d, 'data.itemInfo.transactionId'),
            quantity: _.get(d, 'data.itemInfo.quantity'),
            price,
            shipping_price,
            total: price + shipping_price,
            shipping_type: _.get(d, 'data.buyingInfo.shippingType'),
            min_delivery_date: convertDate(_.get(d, 'data.buyingInfo.minDeliveryDate'), true),
            max_delivery_date: convertDate(_.get(d, 'data.buyingInfo.maxDeliveryDate'), true),
            actual_delivery_date: convertDate(_.get(d, 'data.buyingInfo.actualDeliveryDate'), true),
            tracking_number: _.get(d, 'data.buyingInfo.trackingNumber')
          };
          // Generate an id that updates with new info
          r.wb_id = JSON.stringify(r);
          return r;
        });
      })
      .flatten()
      .filter(r => r.wb_id && fetchedOrderIds.indexOf(r.wb_id) === -1)
      .value();
    // Cache new order ids
    _.forEach(orders, order => {
      fetchedOrderIds.push(order.wb_id);
      // Remove id before logging
      delete order.wb_id;
    });
    await updateCachedOrders(fetchedOrderIds);
    return orders;
  } catch (e) {
    return null;
  }
}
