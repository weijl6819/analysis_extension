import _ from 'lodash';
import tree from 'state';
import regex from 'utility/regex';
import delay from 'utility/delay';
import setBrowserAction from 'messenger/outbound/setBrowserAction';
import {loadProduct} from './notificationActions';
import getDeals from 'messenger/outbound/getDeals';

let primaryDeal;

export async function setPrimaryDeal(deal) {
  primaryDeal = deal;
  tree.set(['siteHubView', 'primaryDeal'], deal);
  addDeals([]);
  const id = deal.id;
  const runId = deal.runId;
  const asin = deal.asin;
  const data = {id, asin, runId};
  loadProduct(data);
}

export function addDeals(deals) {
  deals = _.filter(deals, deal => deal.savings);
  let currentDeals = tree.get(['siteHubView', 'deals']);
  if (!currentDeals) {
    currentDeals = deals;
  } else {
    currentDeals = _(currentDeals.concat(deals))
      .uniq('asin')
      .filter(deal => deal.asin !== _.get(primaryDeal, 'asin'))
      .value();
  }
  tree.set(['siteHubView', 'deals'], currentDeals);

  if (primaryDeal) {
    if (primaryDeal.savings > 0) {
      setBrowserAction({active: true, text: '1'});
    } else {
      setBrowserAction({active: true, text: ''});
    }
  } else {
    if (currentDeals.length) {
      const count = currentDeals.length + (primaryDeal ? 1 : 0);
      setBrowserAction({active: true, text: count.toString()});
    } else {
      setBrowserAction({active: false, text: ''});
    }
  }
}

export async function checkForDeals() {
  const links = document.querySelectorAll('a');
  const asins = [];
  _.forEach(links, link => {
    const url = link.href;
    if (url.indexOf('amazon.com') !== -1) {
      const asin =
        regex(/%252F([B0-9][A-Z0-9]{9})%\n/, url) ||
        regex(/creativeASIN%253D([B0-9][A-Z0-9]{9})/, url) ||
        regex(/\/([B0-9][A-Z0-9]{9})(\/|$)/, url);
      if (asin && asins.indexOf(asin) === -1) {
        asins.push(asin);
      }
    }
  });
  if (asins.length) {
    let deals = await getDeals(asins);
    if (_.get(deals, 'length')) {
      deals = deals.sort((a, b) => {
        const ia = asins.indexOf(a.asin);
        const ib = asins.indexOf(b.asin);
        return ia - ib;
      });
      addDeals(deals);
    }
  }
}
