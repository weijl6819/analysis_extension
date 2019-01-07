import _ from 'lodash';
import hasFeature from 'utility/hasFeature';
import inviteFriends from 'messenger/outbound/inviteFriends';

export async function sendInvites(data) {
  let success;
  data.referral_emails = _.uniq(data.referral_emails);
  data.feature = hasFeature('referral_inc_control')
    ? 'referral_inc_control'
    : hasFeature('referral_inc_gg5')
      ? 'referral_inc_gg5'
      : hasFeature('referral_inc_g5')
        ? 'referral_inc_g5'
        : '';

  try {
    await inviteFriends(data);
    success = true;
  } catch (err) {
    success = false;
  }
  return success;
}
