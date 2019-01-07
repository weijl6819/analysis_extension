import {runPinnedTab} from 'utility/pinnedTab';

/*
 New types of callbacks can be added to this object
 (callbacks must be defined in the background)
*/

const CB_TYPES = {
  aff: tab => false
};

export default async data => {
  data.done = CB_TYPES[data.cb.type];
  runPinnedTab(data);
};
