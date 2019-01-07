import {addRunResultToCart} from 'iv-wb-light/dist/iv-wb-light-chrome';
import _ from 'lodash';

export default async (result, tab) => {
  if (_.get(result, 'vendor') === 'amazon.com') {
    await addRunResultToCart(result);
    chrome.tabs.create({url: 'https://www.amazon.com/gp/cart/view.html', active: true});
  }
};
