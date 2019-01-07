import {
  initSite,
  tryCoupons as tryTigger,
  dropCookie as dropCookieTigger,
  deleteCookie
} from 'iv-tigger';
import {deleteCookieMessager} from '../actions/couponActions';
import _ from 'lodash';

export async function dropCookie(...args) {
  return dropCookieTigger(...args);
}

export async function initTigger(domain, coupons, options) {
  let result;
  try {
    result = await initSite(domain, coupons, options);
  } catch (e) {
    result = {error: 'Tigger internal error', message: e.message};
  }
  return result;
}

export async function tryCoupons(domain, coupons, siteData) {
  let result;
  try {
    if (domain === 'godaddy.com') {
      await deleteCookieMessager(await deleteCookie(domain));
    }
    result = await tryTigger(domain, _.cloneDeep(coupons), siteData);
  } catch (e) {
    result = {error: 'Tigger internal error', message: e.message};
    throw e;
  }
  return result;
}
