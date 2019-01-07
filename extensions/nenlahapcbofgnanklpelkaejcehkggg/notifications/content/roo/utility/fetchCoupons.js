import xhr from './xhr';
import {SITE_API} from 'constants';
import _ from 'lodash';

const MAX_CACHE_TIME = 0;
const scriptCache = {};

export default async domain => {
  const script = await getScript(domain);
  // TODO: don't hard-code estimated runtime
  return {
    coupons: script.items || [],
    couponCount: script.items.length,
    estimatedRunTime: 3000 * script.items.length >= 25000 ? 25000 : 3000 * script.items.length,
    ignoreSite: _.isUndefined(script.ignoreSite) ? true : script.ignoreSite,
    ignoreAffiliate: _.isUndefined(script.ignoreAffiliate) ? true : script.ignoreAffiliate
  };
};

async function getScript(siteData) {
  const domain = siteData.domain;
  const cachedScript = scriptCache[domain];
  if (cachedScript && cachedScript.expiration < MAX_CACHE_TIME) {
    return scriptCache[domain];
  }
  const url = `${SITE_API}/coupons?tld=${domain}`;
  const script = await xhr('GET', url);
  const currentTime = new Date().getTime();
  scriptCache[domain] = {expiration: currentTime + MAX_CACHE_TIME, script};
  return script;
}
