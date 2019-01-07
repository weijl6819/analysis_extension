import xhr from 'utility/xhr';
import {WIKIBUY_API} from 'constants';

export async function reportIssue(type, data, publicFeedback = true) {
  if (publicFeedback) {
    return await xhr('POST', `${WIKIBUY_API}/public-feedback`, {
      type,
      blob: data
    });
  } else {
    return await xhr('POST', `${WIKIBUY_API}/feedback`, {
      type,
      blob: data
    });
  }
}
