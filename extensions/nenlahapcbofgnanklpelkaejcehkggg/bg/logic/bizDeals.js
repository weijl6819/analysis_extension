import findDeal from 'logic/groupon';
import {default as findStorageDeal} from 'logic/sparefoot';
import {default as findCLODeal} from 'logic/cardLink';
import hasFeature from 'utility/hasFeature';
import {track} from 'utility/analytics';
import _ from 'lodash';
import tree from 'state';

export default async data => {
  track('bizDealSearch', data);
  if (data && data.title && data.title.match(/storage/i) && hasFeature('ext_storage_deals')) {
    return findStorageDeal(data);
  } else {
    const hasLinkedCard = tree.get(['session', 'events', 'hasLinkedCard']);
    if (hasFeature('ext_clo_deals') && !hasLinkedCard) {
      const cloDeal = await findCLODeal(data);
      if (cloDeal && _.get(cloDeal, 'offers[0].rewardType') === 'PERCENT') {
        return cloDeal;
      }
    }
    return findDeal(data);
  }
};
