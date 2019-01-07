import xhr from 'utility/xhr';
import localStore from 'storage/local';
import {WIKIBUY_API} from 'constants';
import tree from 'state';
import _ from 'lodash';

export async function getContentApiData({contentSlug, contentId, contentProps, context}, options) {
  const {userId} = await localStore.get('userId');
  return await xhr('POST', `${WIKIBUY_API}/content/fetch`, {
    contentId,
    contentSlug,
    userId,
    contentProps: contentProps || {},
    context
  });
}

export async function trackContent(items, options) {
  const {userId} = await localStore.get('userId');
  return await xhr('POST', `${WIKIBUY_API}/content/track`, {userId, items});
}
