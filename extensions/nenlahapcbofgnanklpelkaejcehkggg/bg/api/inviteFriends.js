import xhr from 'utility/xhr';
import {WIKIBUY_API} from 'constants';

export async function inviteFriends(data) {
  return await xhr('POST', `${WIKIBUY_API}/send_referrals`, data);
}
