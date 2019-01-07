import tree from 'state';
import {setPrimaryDeal} from 'actions/dealActions';
// import {loadProduct} from 'actions/notificationActions';
export default communityDeal => {
  if (
    communityDeal &&
    !communityDeal.error &&
    communityDeal.deal.asin === tree.get('currentASIN')
  ) {
    tree.set(['notification', 'communityDeal'], communityDeal);
    const deal = communityDeal.deal;
    setPrimaryDeal(deal);
  } else if (communityDeal && communityDeal.error) {
    tree.set(['notification', 'communityDeal'], communityDeal);
  }
};
