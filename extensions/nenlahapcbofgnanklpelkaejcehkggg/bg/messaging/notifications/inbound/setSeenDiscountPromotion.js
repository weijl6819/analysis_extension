import tree from 'state';

const settingsCursor = tree.select('settings');

export default request => {
  settingsCursor.set('hasSeenDiscountPromotion', true);
};
