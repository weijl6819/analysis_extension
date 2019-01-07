import xhr from 'utility/xhr';
import {WIKIBUY_API} from 'constants';

export async function addFavorite(body) {
  return xhr('POST', `${WIKIBUY_API}/favorite`, body);
}

export async function deleteFavorite(body) {
  return xhr('DELETE', `${WIKIBUY_API}/favorite`, body);
}
