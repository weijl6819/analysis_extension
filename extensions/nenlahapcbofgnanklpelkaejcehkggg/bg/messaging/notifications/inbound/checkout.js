import {WIKIBUY_URL} from 'constants';
import * as analytics from 'utility/analytics';
import getCashback, {activateInPinnedTab} from 'logic/cashback';
import hasFeature from 'utility/hasFeature';
import {addRunResultToCart} from 'iv-wb-light/dist/iv-wb-light-chrome';
import _ from 'lodash';
import {setIgnoreStandDown} from 'monitors/afsrcMonitor';
import promisifyChromeFunctions from 'utility/promisifyChromeFunctions';
promisifyChromeFunctions(chrome.tabs);

export default async (request, tab) => {
  if (_.get(request, 'paymentsSupport')) {
    chrome.tabs.create(
      {
        url: `${WIKIBUY_URL}/run/${request.runId}/place-order/${request.detail.id}${
          request.paypal ? '/?paypal=true' : ''
        }`,
        active: true
      },
      tab => {}
    );
  } else {
    if (hasFeature('cb_vm_activate')) {
      const cashback = await getCashback({
        url: `http://${_.get(request, 'detail.product.vendor')}`
      });
      if (cashback && cashback.balance <= 1000 && cashback.vendor !== 'eBay') {
        activateInPinnedTab({url: _.get(request, 'detail.product.url')});
      }
      chrome.tabs.create({url: _.get(request, 'detail.product.url'), active: true}, tab => {});
    } else {
      setIgnoreStandDown();
      let url = _.get(request, 'detail.redirectUrl') || _.get(request, 'detail.product.url');
      if (url) {
        url = url.replace('mock_click_id', request.clickId);
        analytics.track('cartRedirect', {cartUrl: url, clickId: request.clickId});
        chrome.tabs.create({url, active: true}, tab => {});
      }
    }
  }
};
