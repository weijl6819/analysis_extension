import xhr from 'utility/xhr';
import {WIKIBUY_API} from 'constants';

export async function createAccount(data) {
  return await xhr('POST', `${WIKIBUY_API}/account`, data);
}
