import xhr from 'utility/xhr';
import {WIKIBUY_API} from 'constants';

export async function getCart(data) {
  return await xhr('POST', `${WIKIBUY_API}/cart`, data);
}
