import {showPinnedTab} from 'utility/pinnedTab';

export default ({affiliateLink}, tab) => {
  showPinnedTab(tab.id, affiliateLink);
};
