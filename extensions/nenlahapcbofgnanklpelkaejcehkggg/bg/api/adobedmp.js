import xhr from 'utility/xhr';
import {WIKIBUY_API} from 'constants';

export async function updateAdobeDMP() {
  return await xhr('GET', `${WIKIBUY_API}/adobedmp`, null, null, {});
}
