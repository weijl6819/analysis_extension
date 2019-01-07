import xhr from 'utility/xhr';
import {WIKIBUY_API} from 'constants';
import tree from 'state';
import Promise from 'bluebird';

export async function getSession() {
  let profileId = tree.get('profileId');
  if (!profileId && chrome.storage.sync) {
    profileId = await new Promise(resolve => {
      chrome.storage.sync.get('profileId', ({profileId} = {}) => {
        resolve(profileId);
      });
    });
  }
  return await xhr('GET', `${WIKIBUY_API}/session?profileId=${profileId}`);
}
