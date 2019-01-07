import {WIKIBUY_API} from '../constants';
import xhr from 'utility/xhr';

export async function getPreferences() {
  return await xhr('GET', `${WIKIBUY_API}/preferences?linkedpm=true`);
}

export async function getCredits() {
  return await xhr('GET', `${WIKIBUY_API}/coupon`);
}

export async function updatePreferences(prefs) {
  return await xhr('PUT', `${WIKIBUY_API}/preferences`, prefs);
}

export async function setEvent(event) {
  return await xhr('POST', `${WIKIBUY_API}/event/${event}`);
}
